/**
 * Pure interaction rules. Every function takes the current run state and
 * returns a new state plus a list of events for the UI. Invalid actions
 * return the original state unchanged.
 */
import { getItem } from "../content/items";
import type { EvidenceGrant, InteractionProgress, InteractiveObject, LevelDefinition } from "../types";
import { flag, hasAll } from "./flags";
import { checkPuzzleAnswer, type PuzzleAnswer } from "./puzzles";
import { addUnique, getObject, isAccessible, isAreaAccessible, isCollectable, isOpenable, isVisible, puzzleHosts } from "./run";

export type GameEvent =
  | { type: "miss" }
  | { type: "inspect"; objectId: string }
  | { type: "collected"; objectId: string; item?: string; evidence?: string; document: boolean; collectible: boolean }
  | { type: "opened"; objectId: string; item?: string; evidence?: string; text?: string }
  | { type: "locked"; objectId: string; message: string }
  | { type: "blocked"; objectId: string; message: string }
  | { type: "openPuzzle"; puzzleId: string; objectId: string }
  | { type: "invalidItem"; itemId: string; objectId?: string; message: string }
  | { type: "combined"; recipeId: string; output: string; evidence?: string; text: string }
  | { type: "invalidCombination"; message: string }
  | { type: "solved"; puzzleId: string; text: string; evidence?: string[]; items?: string[] }
  | { type: "wrongAnswer"; puzzleId: string; message: string }
  | { type: "alreadySolved"; id: string }
  | { type: "deduced"; deductionId: string; text: string; evidence?: string }
  | { type: "deductionFailed"; deductionId: string; reason: "conclusion" | "missing" | "extra" | "unknown" | "locked"; message: string }
  | { type: "moved"; area: string }
  | { type: "areaLocked"; area: string; message: string };

export interface ActionResult {
  run: InteractionProgress;
  events: GameEvent[];
}

const same = (run: InteractionProgress, ...events: GameEvent[]): ActionResult => ({ run, events });

function grant(run: InteractionProgress, flags: string[], item?: string, ev?: EvidenceGrant): InteractionProgress {
  return {
    ...run,
    flags: addUnique(run.flags, ...flags),
    inventory: item ? addUnique(run.inventory, item) : run.inventory,
    evidence: ev ? addUnique(run.evidence, ev.id) : run.evidence,
  };
}

function interactable(level: LevelDefinition, run: InteractionProgress, o: InteractiveObject | undefined): o is InteractiveObject {
  return Boolean(o && o.area === run.area && isVisible(o, run.flags));
}

/** Player clicks/taps an object (optionally with an inventory item selected). */
export function clickObject(level: LevelDefinition, run: InteractionProgress, objectId: string, selectedItem?: string | null): ActionResult {
  const o = getObject(level, objectId);
  if (!interactable(level, run, o)) return same(run, { type: "miss" });
  if (selectedItem) return useItemOnObject(level, run, selectedItem, objectId);

  if (!isAccessible(o, run.flags)) {
    return same(run, { type: "blocked", objectId: o.id, message: o.requires!.message });
  }

  const opened = run.flags.includes(flag.opened(o.id));

  if (o.lock && !opened) {
    if (o.lock.kind === "puzzle") return same(run, { type: "openPuzzle", puzzleId: o.lock.puzzle, objectId: o.id });
    return same(run, { type: "locked", objectId: o.id, message: o.lock.lockedText });
  }

  if (o.exitTo && (opened || !o.lock)) {
    let next = run;
    if (!opened && isOpenable(o)) next = grant(run, [flag.opened(o.id)], o.item, o.evidence);
    const moved = moveToArea(level, next, o.exitTo);
    return { run: moved.run, events: moved.events };
  }

  if (isOpenable(o)) {
    if (opened) return same(run, { type: "inspect", objectId: o.id });
    const next = grant(run, [flag.opened(o.id)], o.item, o.evidence);
    return { run: next, events: [{ type: "opened", objectId: o.id, item: o.item, evidence: o.evidence?.id, text: o.openText }] };
  }

  if (isCollectable(o)) {
    if (run.flags.includes(flag.found(o.id))) return same(run, { type: "inspect", objectId: o.id });
    const next = grant(run, [flag.found(o.id)], o.item, o.evidence);
    return {
      run: next,
      events: [
        {
          type: "collected",
          objectId: o.id,
          item: o.item,
          evidence: o.evidence?.id,
          document: Boolean(o.document),
          collectible: o.category === "collectible",
        },
      ],
    };
  }

  return same(run, { type: "inspect", objectId: o.id });
}

/** Use a selected inventory item on a scene object. */
export function useItemOnObject(level: LevelDefinition, run: InteractionProgress, itemId: string, objectId: string): ActionResult {
  const o = getObject(level, objectId);
  if (!run.inventory.includes(itemId)) {
    return same(run, { type: "invalidItem", itemId, message: "You aren't carrying that." });
  }
  if (!interactable(level, run, o)) return same(run, { type: "miss" });
  if (!isAccessible(o, run.flags)) {
    return same(run, { type: "blocked", objectId: o.id, message: o.requires!.message });
  }
  const opened = run.flags.includes(flag.opened(o.id));
  if (o.lock?.kind === "item" && o.lock.item === itemId && !opened) {
    const def = getItem(itemId);
    const consumes = o.lock.consumes ?? def?.consumable ?? false;
    let next = grant(run, [flag.opened(o.id)], o.item, o.evidence);
    if (consumes) next = { ...next, inventory: next.inventory.filter((i) => i !== itemId) };
    const events: GameEvent[] = [{ type: "opened", objectId: o.id, item: o.item, evidence: o.evidence?.id, text: o.openText }];
    if (o.exitTo) {
      const moved = moveToArea(level, next, o.exitTo);
      return { run: moved.run, events: [...events, ...moved.events] };
    }
    return { run: next, events };
  }
  const name = getItem(itemId)?.name ?? "That";
  return same(run, {
    type: "invalidItem",
    itemId,
    objectId: o.id,
    message: opened ? `The ${o.name.toLowerCase()} is already open.` : `${name} doesn't do anything with the ${o.name.toLowerCase()}.`,
  });
}

/** Combine two inventory items using an explicit recipe. */
export function combineItems(level: LevelDefinition, run: InteractionProgress, a: string, b: string): ActionResult {
  if (a === b || !run.inventory.includes(a) || !run.inventory.includes(b)) {
    return same(run, { type: "invalidCombination", message: "You need two different items to combine." });
  }
  const recipe = level.recipes.find((r) => (r.inputs[0] === a && r.inputs[1] === b) || (r.inputs[0] === b && r.inputs[1] === a));
  if (!recipe) {
    return same(run, { type: "invalidCombination", message: "Those two don't fit together." });
  }
  if (run.flags.includes(flag.combined(recipe.id))) {
    return same(run, { type: "invalidCombination", message: "You've already combined those." });
  }
  const next: InteractionProgress = {
    ...run,
    inventory: addUnique(run.inventory.filter((i) => i !== a && i !== b), recipe.output),
    flags: addUnique(run.flags, flag.combined(recipe.id)),
    evidence: recipe.evidence ? addUnique(run.evidence, recipe.evidence.id) : run.evidence,
  };
  return { run: next, events: [{ type: "combined", recipeId: recipe.id, output: recipe.output, evidence: recipe.evidence?.id, text: recipe.text }] };
}

/** Is the puzzle reachable right now (its host object is visible and accessible)? */
export function isPuzzleAvailable(level: LevelDefinition, run: InteractionProgress, puzzleId: string): boolean {
  return puzzleHosts(level, puzzleId).some((h) => isVisible(h, run.flags) && isAccessible(h, run.flags));
}

export function submitPuzzle(level: LevelDefinition, run: InteractionProgress, puzzleId: string, answer: PuzzleAnswer): ActionResult {
  const p = level.puzzles.find((x) => x.id === puzzleId);
  if (!p) return same(run, { type: "wrongAnswer", puzzleId, message: "Unknown puzzle." });
  if (run.flags.includes(flag.solved(p.id))) return same(run, { type: "alreadySolved", id: p.id });
  if (!isPuzzleAvailable(level, run, p.id)) {
    return same(run, { type: "wrongAnswer", puzzleId, message: "You can't reach that yet." });
  }
  const res = checkPuzzleAnswer(p, answer);
  if (!res.correct) {
    return { run: { ...run, mistakes: run.mistakes + 1 }, events: [{ type: "wrongAnswer", puzzleId, message: res.message }] };
  }
  let next = grant(run, [flag.solved(p.id)], p.reward?.item, p.reward?.evidence);
  const evidence: string[] = p.reward?.evidence ? [p.reward.evidence.id] : [];
  const items: string[] = p.reward?.item ? [p.reward.item] : [];
  for (const host of puzzleHosts(level, p.id)) {
    next = grant(next, [flag.opened(host.id)], host.item, host.evidence);
    if (host.evidence) evidence.push(host.evidence.id);
    if (host.item) items.push(host.item);
  }
  return { run: next, events: [{ type: "solved", puzzleId: p.id, text: p.successText, evidence, items }] };
}

export function isDeductionAvailable(level: LevelDefinition, run: InteractionProgress, deductionId: string): boolean {
  const d = level.deductions.find((x) => x.id === deductionId);
  return Boolean(d && hasAll(run.flags, d.requires));
}

/**
 * Validate a deduction. `known` is every evidence id the player has
 * discovered (notebook + this run). The selection must match exactly.
 */
export function submitDeduction(
  level: LevelDefinition,
  run: InteractionProgress,
  deductionId: string,
  conclusion: string,
  selected: string[],
  known: readonly string[],
): ActionResult {
  const d = level.deductions.find((x) => x.id === deductionId);
  if (!d) return same(run, { type: "deductionFailed", deductionId, reason: "unknown", message: "Unknown deduction." });
  if (run.flags.includes(flag.deduced(d.id))) return same(run, { type: "alreadySolved", id: d.id });
  if (!hasAll(run.flags, d.requires)) {
    return same(run, { type: "deductionFailed", deductionId, reason: "locked", message: "You haven't gathered enough to attempt this yet." });
  }
  const knownSet = new Set([...known, ...run.evidence]);
  const sel = Array.from(new Set(selected));
  if (sel.some((e) => !knownSet.has(e))) {
    return same(run, { type: "deductionFailed", deductionId, reason: "unknown", message: "You can only cite evidence you've actually found." });
  }
  const fail = (reason: "conclusion" | "missing" | "extra", message: string): ActionResult => ({
    run: { ...run, mistakes: run.mistakes + 1 },
    events: [{ type: "deductionFailed", deductionId, reason, message }],
  });
  if (conclusion !== d.answer) {
    return fail("conclusion", d.wrongConclusionText ?? "That conclusion doesn't hold up against the evidence.");
  }
  const required = new Set(d.evidence);
  const missing = d.evidence.filter((e) => !sel.includes(e));
  const extra = sel.filter((e) => !required.has(e));
  if (missing.length > 0 && extra.length === 0) {
    return fail("missing", `The conclusion is right, but it needs more support — ${missing.length} more piece${missing.length > 1 ? "s" : ""} of evidence.`);
  }
  if (extra.length > 0) {
    return fail("extra", `Some of the evidence you've cited doesn't support this conclusion. Use only what proves it.`);
  }
  const next = grant(run, [flag.deduced(d.id)], undefined, d.reward?.evidence);
  return { run: next, events: [{ type: "deduced", deductionId: d.id, text: d.successText, evidence: d.reward?.evidence?.id }] };
}

export function moveToArea(level: LevelDefinition, run: InteractionProgress, areaId: string): ActionResult {
  const area = level.scene.areas.find((a) => a.id === areaId);
  if (!area) return same(run, { type: "miss" });
  if (!isAreaAccessible(level, areaId, run.flags)) {
    return same(run, { type: "areaLocked", area: areaId, message: area.requires?.message ?? "You can't go there yet." });
  }
  if (run.area === areaId) return same(run);
  return { run: { ...run, area: areaId, flags: addUnique(run.flags, flag.visited(areaId)) }, events: [{ type: "moved", area: areaId }] };
}
