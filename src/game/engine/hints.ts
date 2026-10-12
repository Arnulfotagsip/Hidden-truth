/**
 * Context-sensitive hints. The next step is always taken from the solver's
 * plan for the current state, so hints only reference real, relevant,
 * currently-actionable targets.
 */
import type { HintDefinition, HitRegion, InteractionProgress, LevelDefinition } from "../types";
import { nextActions, type PlanAction } from "./solver";
import { getObject } from "./run";
import { isLevelComplete } from "./completion";

export const HINT_COOLDOWN_MS = 30_000;

export interface HintResult {
  text: string;
  tier: number;
  maxTier: number;
  target: string;
  kind: HintDefinition["kind"] | "done";
  /** Region to highlight in the scene (tier 2: broad, tier 3: exact). */
  highlight?: HitRegion;
  area?: string;
}

export type HintRequest =
  | { ok: true; run: InteractionProgress; hint: HintResult; free: boolean }
  | { ok: false; waitMs: number };

function hintKey(a: PlanAction): string {
  switch (a.kind) {
    case "click":
      return `hint-obj-${a.objectId}`;
    case "use":
      return `hint-use-${a.objectId}`;
    case "puzzle":
      return `hint-puzzle-${a.puzzleId}`;
    case "combine":
      return `hint-combine-${a.recipeId}`;
    case "deduce":
      return `hint-deduce-${a.deductionId}`;
    case "move":
      return `hint-area-${a.area}`;
  }
}

function objectFor(a: PlanAction): string | undefined {
  if (a.kind === "click" || a.kind === "use" || a.kind === "puzzle") return a.objectId;
  return undefined;
}

/** The hint definition for the next step, without spending a hint. */
export function peekHint(level: LevelDefinition, run: InteractionProgress, known: Iterable<string>): { def: HintDefinition; action: PlanAction } | null {
  if (isLevelComplete(level, run)) return null;
  const acts = nextActions(level, run, known);
  if (acts.length === 0) return null;
  const a = acts[0];
  const key = hintKey(a);
  if (a.kind === "move") {
    const area = level.scene.areas.find((x) => x.id === a.area)!;
    return {
      action: a,
      def: {
        id: key,
        kind: "area",
        target: a.area,
        tiers: [
          "There's nothing more you need in this room for now.",
          `Your next lead is in the ${area.name}.`,
          `Switch to the ${area.name} using the room tabs above the scene.`,
        ],
      },
    };
  }
  const def = level.hints.find((h) => h.id === key);
  if (!def) return null;
  return { def, action: a };
}

export function requestHint(level: LevelDefinition, run: InteractionProgress, known: Iterable<string>, now = Date.now()): HintRequest {
  const free = run.hintsUsed < level.freeHints;
  if (!free && run.lastHintAt != null && now - run.lastHintAt < HINT_COOLDOWN_MS) {
    return { ok: false, waitMs: HINT_COOLDOWN_MS - (now - run.lastHintAt) };
  }
  const peek = peekHint(level, run, known);
  if (!peek) {
    return {
      ok: true,
      free,
      run,
      hint: { text: "Every requirement is met — close the case to file your report.", tier: 1, maxTier: 1, target: "done", kind: "done" },
    };
  }
  const { def, action } = peek;
  const tier = Math.min((run.hintTiers[def.id] ?? 0) + 1, def.tiers.length);
  const nextRun: InteractionProgress = {
    ...run,
    hintsUsed: run.hintsUsed + 1,
    lastHintAt: now,
    hintTiers: { ...run.hintTiers, [def.id]: tier },
  };
  const objId = objectFor(action);
  let highlight: HitRegion | undefined;
  if (objId && tier >= 2) {
    const o = getObject(level, objId)!;
    const cx = o.box.x + o.box.w / 2;
    const cy = o.box.y + o.box.h / 2;
    if (tier >= 3) {
      highlight = { kind: "rect", x: o.box.x - 6, y: o.box.y - 6, w: o.box.w + 12, h: o.box.h + 12 };
    } else {
      // A broad circle that contains the target without centring on it exactly.
      const r = Math.max(o.box.w, o.box.h) / 2 + 90;
      const off = ((o.id.length * 37) % 50) - 25;
      highlight = { kind: "circle", cx: cx + off, cy: cy - off / 2, r };
    }
  }
  return {
    ok: true,
    free,
    run: nextRun,
    hint: {
      text: def.tiers[tier - 1],
      tier,
      maxTier: def.tiers.length,
      target: def.target,
      kind: def.kind,
      highlight,
      area: objId ? getObject(level, objId)?.area : action.kind === "move" ? action.area : undefined,
    },
  };
}
