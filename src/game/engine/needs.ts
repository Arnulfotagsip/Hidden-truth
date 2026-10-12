/**
 * Dependency analysis: which objects, puzzles, recipes, deductions and
 * areas actually matter for completing a level. Hints and the solver only
 * ever point at things in this closure, so they never suggest irrelevant
 * or optional objects.
 */
import type { LevelDefinition } from "../types";
import { parseFlag } from "./flags";

export interface Needs {
  objects: Set<string>;
  puzzles: Set<string>;
  recipes: Set<string>;
  deductions: Set<string>;
  areas: Set<string>;
  /** Evidence ids that must come from earlier levels. */
  external: Set<string>;
}

const cache = new WeakMap<LevelDefinition, Needs>();

export function evidenceSources(level: LevelDefinition, evId: string) {
  return {
    objects: level.scene.objects.filter((o) => o.evidence?.id === evId).map((o) => o.id),
    puzzles: level.puzzles.filter((p) => p.reward?.evidence?.id === evId).map((p) => p.id),
    recipes: level.recipes.filter((r) => r.evidence?.id === evId).map((r) => r.id),
    deductions: level.deductions.filter((d) => d.reward?.evidence?.id === evId).map((d) => d.id),
  };
}

export function itemSources(level: LevelDefinition, itemId: string) {
  return {
    starting: level.startingItems.some((s) => s.item === itemId),
    objects: level.scene.objects.filter((o) => o.item === itemId).map((o) => o.id),
    recipes: level.recipes.filter((r) => r.output === itemId).map((r) => r.id),
    puzzles: level.puzzles.filter((p) => p.reward?.item === itemId).map((p) => p.id),
  };
}

export function computeNeeds(level: LevelDefinition): Needs {
  const cached = cache.get(level);
  if (cached) return cached;
  const n: Needs = {
    objects: new Set(),
    puzzles: new Set(),
    recipes: new Set(),
    deductions: new Set(),
    areas: new Set(),
    external: new Set(),
  };
  const objIds = new Set(level.scene.objects.map((o) => o.id));

  const visitFlag = (f: string) => {
    const { kind, id } = parseFlag(f);
    if (kind === "found" || kind === "opened") visitObject(id);
    else if (kind === "solved") visitPuzzle(id);
    else if (kind === "deduced") visitDeduction(id);
    else if (kind === "combined") visitRecipe(id);
    else if (kind === "visited") visitArea(id);
  };
  const visitArea = (id: string) => {
    if (n.areas.has(id)) return;
    n.areas.add(id);
    const a = level.scene.areas.find((x) => x.id === id);
    a?.requires?.flags.forEach(visitFlag);
  };
  const visitItem = (itemId: string) => {
    const s = itemSources(level, itemId);
    if (s.starting) return;
    s.objects.forEach(visitObject);
    s.recipes.forEach(visitRecipe);
    s.puzzles.forEach(visitPuzzle);
  };
  const visitEvidence = (evId: string) => {
    const s = evidenceSources(level, evId);
    const local = s.objects.length + s.puzzles.length + s.recipes.length + s.deductions.length;
    if (local === 0) {
      n.external.add(evId);
      return;
    }
    s.objects.forEach(visitObject);
    s.puzzles.forEach(visitPuzzle);
    s.recipes.forEach(visitRecipe);
    s.deductions.forEach(visitDeduction);
  };
  function visitObject(id: string) {
    if (n.objects.has(id)) return;
    const o = level.scene.objects.find((x) => x.id === id);
    if (!o) return;
    n.objects.add(id);
    visitArea(o.area);
    o.hiddenUntil?.forEach(visitFlag);
    o.requires?.flags.forEach(visitFlag);
    if (o.lock?.kind === "item") visitItem(o.lock.item);
    if (o.lock?.kind === "puzzle") visitPuzzle(o.lock.puzzle);
  }
  function visitPuzzle(id: string) {
    if (n.puzzles.has(id)) return;
    const p = level.puzzles.find((x) => x.id === id);
    if (!p) return;
    n.puzzles.add(id);
    level.scene.objects.filter((o) => o.lock?.kind === "puzzle" && o.lock.puzzle === id).forEach((o) => visitObject(o.id));
    for (const ref of p.clueRefs) {
      if (objIds.has(ref)) visitObject(ref);
      else visitEvidence(ref);
    }
  }
  function visitRecipe(id: string) {
    if (n.recipes.has(id)) return;
    const r = level.recipes.find((x) => x.id === id);
    if (!r) return;
    n.recipes.add(id);
    r.inputs.forEach(visitItem);
  }
  function visitDeduction(id: string) {
    if (n.deductions.has(id)) return;
    const d = level.deductions.find((x) => x.id === id);
    if (!d) return;
    n.deductions.add(id);
    d.requires?.forEach(visitFlag);
    d.evidence.forEach(visitEvidence);
  }

  for (const r of level.requirements) {
    if (r.kind === "find" || r.kind === "open") visitObject(r.target);
    else if (r.kind === "solve") visitPuzzle(r.target);
    else if (r.kind === "deduce") visitDeduction(r.target);
    else if (r.kind === "combine") visitRecipe(r.target);
    else if (r.kind === "visit") visitArea(r.target);
  }
  cache.set(level, n);
  return n;
}
