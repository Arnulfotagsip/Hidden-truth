/**
 * A deterministic auto-player. It only performs legitimate actions through
 * the real interaction functions, so a successful solve proves a level is
 * completable. The first available action also drives the hint system.
 */
import type { InteractionProgress, LevelDefinition } from "../types";
import { flag, hasAll } from "./flags";
import { combineItems, clickObject, isPuzzleAvailable, moveToArea, submitDeduction, submitPuzzle, useItemOnObject } from "./interactions";
import { computeNeeds } from "./needs";
import { canonicalAnswer } from "./puzzles";
import { isAccessible, isAreaAccessible, isDone, isVisible, puzzleHosts } from "./run";
import { isLevelComplete } from "./completion";

export type PlanAction =
  | { kind: "click"; objectId: string }
  | { kind: "use"; itemId: string; objectId: string }
  | { kind: "puzzle"; puzzleId: string; objectId: string }
  | { kind: "combine"; recipeId: string; a: string; b: string }
  | { kind: "deduce"; deductionId: string }
  | { kind: "move"; area: string };

function cluesKnown(level: LevelDefinition, run: InteractionProgress, refs: string[], known: Set<string>): boolean {
  return refs.every((ref) => {
    const o = level.scene.objects.find((x) => x.id === ref);
    if (o) return run.flags.includes(flag.found(o.id)) || run.flags.includes(flag.opened(o.id));
    return known.has(ref) || run.evidence.includes(ref);
  });
}

/** Actions available in the current area (no moves). */
function localActions(level: LevelDefinition, run: InteractionProgress, known: Set<string>): PlanAction[] {
  const needs = computeNeeds(level);
  const out: PlanAction[] = [];
  const objs = level.scene.objects.filter((o) => o.area === run.area && needs.objects.has(o.id));
  for (const o of objs) {
    if (!isVisible(o, run.flags) || !isAccessible(o, run.flags)) continue;
    const opened = run.flags.includes(flag.opened(o.id));
    if (o.lock && !opened) {
      if (o.lock.kind === "item" && run.inventory.includes(o.lock.item)) out.push({ kind: "use", itemId: o.lock.item, objectId: o.id });
      continue;
    }
    if (o.exitTo) {
      if (!opened && o.required) out.push({ kind: "click", objectId: o.id });
      continue;
    }
    if (!isDone(o, run.flags) && (o.category !== "environment" || o.evidence || o.item || o.document)) {
      out.push({ kind: "click", objectId: o.id });
    }
  }
  for (const pid of needs.puzzles) {
    if (run.flags.includes(flag.solved(pid))) continue;
    const p = level.puzzles.find((x) => x.id === pid)!;
    const host = puzzleHosts(level, pid).find((h) => h.area === run.area && isVisible(h, run.flags) && isAccessible(h, run.flags));
    if (!host) continue;
    if (!cluesKnown(level, run, p.clueRefs, known)) continue;
    out.push({ kind: "puzzle", puzzleId: pid, objectId: host.id });
  }
  return out;
}

function globalActions(level: LevelDefinition, run: InteractionProgress, known: Set<string>): PlanAction[] {
  const needs = computeNeeds(level);
  const out: PlanAction[] = [];
  for (const rid of needs.recipes) {
    if (run.flags.includes(flag.combined(rid))) continue;
    const r = level.recipes.find((x) => x.id === rid)!;
    if (run.inventory.includes(r.inputs[0]) && run.inventory.includes(r.inputs[1])) {
      out.push({ kind: "combine", recipeId: rid, a: r.inputs[0], b: r.inputs[1] });
    }
  }
  for (const did of needs.deductions) {
    if (run.flags.includes(flag.deduced(did))) continue;
    const d = level.deductions.find((x) => x.id === did)!;
    if (!hasAll(run.flags, d.requires)) continue;
    if (d.evidence.every((e) => known.has(e) || run.evidence.includes(e))) out.push({ kind: "deduce", deductionId: did });
  }
  return out;
}

/** All next actions in priority order. */
export function nextActions(level: LevelDefinition, run: InteractionProgress, knownEvidence: Iterable<string>): PlanAction[] {
  const known = new Set(knownEvidence);
  const local = localActions(level, run, known);
  const global = globalActions(level, run, known);
  const actions = [...local, ...global];
  if (actions.length > 0) return actions;
  // Otherwise look for another accessible area with work to do.
  for (const a of level.scene.areas) {
    if (a.id === run.area || !isAreaAccessible(level, a.id, run.flags)) continue;
    if (localActions(level, { ...run, area: a.id }, known).length > 0) actions.push({ kind: "move", area: a.id });
  }
  return actions;
}

export function applyAction(level: LevelDefinition, run: InteractionProgress, a: PlanAction, known: Set<string>): InteractionProgress {
  switch (a.kind) {
    case "click":
      return clickObject(level, run, a.objectId).run;
    case "use":
      return useItemOnObject(level, run, a.itemId, a.objectId).run;
    case "puzzle": {
      const p = level.puzzles.find((x) => x.id === a.puzzleId)!;
      if (!isPuzzleAvailable(level, run, p.id)) return run;
      return submitPuzzle(level, run, p.id, canonicalAnswer(p)).run;
    }
    case "combine":
      return combineItems(level, run, a.a, a.b).run;
    case "deduce": {
      const d = level.deductions.find((x) => x.id === a.deductionId)!;
      return submitDeduction(level, run, d.id, d.answer, d.evidence, [...known]).run;
    }
    case "move":
      return moveToArea(level, run, a.area).run;
  }
}

export interface SolveResult {
  complete: boolean;
  steps: PlanAction[];
  run: InteractionProgress;
}

export function solveLevel(level: LevelDefinition, start: InteractionProgress, knownEvidence: Iterable<string>, maxSteps = 400): SolveResult {
  const known = new Set(knownEvidence);
  let run = start;
  const steps: PlanAction[] = [];
  for (let i = 0; i < maxSteps; i++) {
    if (isLevelComplete(level, run)) return { complete: true, steps, run };
    const acts = nextActions(level, run, known);
    if (acts.length === 0) break;
    const before = run;
    run = applyAction(level, run, acts[0], known);
    steps.push(acts[0]);
    if (run === before) break; // no progress — stuck
  }
  return { complete: isLevelComplete(level, run), steps, run };
}
