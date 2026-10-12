/**
 * Automated registry validation. Checks structural integrity of every
 * level and plays every level through the real engine with the solver.
 */
import { hasSprite } from "./art/sprites";
import { PICTURES } from "./art/pictures";
import { CHAPTERS, DUPLICATE_EVIDENCE_IDS, EVIDENCE, LEVELS, getLevel } from "./content";
import { ITEMS } from "./content/items";
import { flag, parseFlag } from "./engine/flags";
import { regionFor, regionBounds } from "./engine/hit-test";
import { computeNeeds } from "./engine/needs";
import { caesarShift, isPermutation, normalizeText } from "./engine/puzzles";
import { createRun } from "./engine/run";
import { solveLevel } from "./engine/solver";
import type { LevelDefinition } from "./types";
import { SCENE_HEIGHT, SCENE_WIDTH } from "./types";

export const EXPECTED_LEVELS = 100;
export const EXPECTED_CHAPTERS = 10;
export const LEVELS_PER_CHAPTER = 10;

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen"];

function clueCorpus(level: LevelDefinition, refs: string[]): string {
  const parts: string[] = [];
  for (const ref of refs) {
    const o = level.scene.objects.find((x) => x.id === ref);
    if (o) {
      parts.push(o.name, o.description, ...(o.observations ?? []));
      if (o.document) parts.push(o.document.title, ...o.document.body);
      continue;
    }
    const e = EVIDENCE[ref];
    if (e) {
      parts.push(e.name, e.description);
      if (e.document) parts.push(e.document.title, ...e.document.body);
    }
  }
  return parts.join(" \n ");
}

/** Where each item can be obtained (level ids). */
function itemOrigins(): Map<string, string[]> {
  const m = new Map<string, string[]>();
  const add = (item: string, lvl: string) => m.set(item, [...(m.get(item) ?? []), lvl]);
  for (const l of LEVELS) {
    l.scene.objects.forEach((o) => o.item && add(o.item, l.id));
    l.recipes.forEach((r) => add(r.output, l.id));
    l.puzzles.forEach((p) => p.reward?.item && add(p.reward.item, l.id));
  }
  return m;
}

export function validateLevel(level: LevelDefinition): string[] {
  const errors: string[] = [];
  const e = (msg: string) => errors.push(`[${level.id}] ${msg}`);
  const objIds = new Set<string>();
  const areaIds = new Set(level.scene.areas.map((a) => a.id));
  const puzzleIds = new Set(level.puzzles.map((p) => p.id));
  const dedIds = new Set(level.deductions.map((d) => d.id));
  const recipeIds = new Set(level.recipes.map((r) => r.id));

  if (!level.title || !level.objective || !level.summary || !level.briefing) e("missing title/objective/summary/briefing");
  if (level.scene.areas.length === 0) e("scene has no areas");
  if (level.requirements.length === 0) e("no completion requirements");
  if (level.hints.length === 0) e("no hint configuration");
  if (level.freeHints < 1) e("hint allowance must be at least 1");

  const flagTargetExists = (f: string) => {
    const { kind, id } = parseFlag(f);
    if (kind === "found" || kind === "opened") return level.scene.objects.some((o) => o.id === id);
    if (kind === "solved") return puzzleIds.has(id);
    if (kind === "deduced") return dedIds.has(id);
    if (kind === "combined") return recipeIds.has(id);
    if (kind === "visited") return areaIds.has(id);
    return false;
  };

  for (const a of level.scene.areas) {
    for (const d of a.decor) if (!hasSprite(d.art)) e(`decor art "${d.art}" missing`);
    a.requires?.flags.forEach((f) => !flagTargetExists(f) && e(`area ${a.id} requires unknown flag ${f}`));
  }

  for (const o of level.scene.objects) {
    if (objIds.has(o.id)) e(`duplicate object id ${o.id}`);
    objIds.add(o.id);
    if (!areaIds.has(o.area)) e(`object ${o.id} in unknown area ${o.area}`);
    if (!hasSprite(o.art)) e(`object ${o.id} art "${o.art}" missing`);
    if (o.openArt && !hasSprite(o.openArt)) e(`object ${o.id} openArt "${o.openArt}" missing`);
    if (o.item && !ITEMS[o.item]) e(`object ${o.id} grants unknown item ${o.item}`);
    if (o.lock?.kind === "item" && !ITEMS[o.lock.item]) e(`object ${o.id} lock needs unknown item ${o.lock.item}`);
    if (o.lock?.kind === "puzzle" && !puzzleIds.has(o.lock.puzzle)) e(`object ${o.id} lock references unknown puzzle ${o.lock.puzzle}`);
    if (o.exitTo && !areaIds.has(o.exitTo)) e(`object ${o.id} exits to unknown area ${o.exitTo}`);
    o.hiddenUntil?.forEach((f) => !flagTargetExists(f) && e(`object ${o.id} hiddenUntil unknown flag ${f}`));
    o.requires?.flags.forEach((f) => !flagTargetExists(f) && e(`object ${o.id} requires unknown flag ${f}`));
    // Hit region must be valid and overlap the visible scene.
    const b = regionBounds(regionFor(o));
    if (!(b.w > 0 && b.h > 0)) e(`object ${o.id} has an empty hit region`);
    const cx = b.x + b.w / 2;
    const cy = b.y + b.h / 2;
    if (cx < 0 || cx > SCENE_WIDTH || cy < 0 || cy > SCENE_HEIGHT) e(`object ${o.id} hit region centre is outside the scene`);
    if (o.required && o.category === "environment" && !o.evidence && !o.item && !o.document) e(`required object ${o.id} cannot be collected`);
  }

  for (const r of level.requirements) {
    const f = r.kind === "find" ? flag.found(r.target) : r.kind === "open" ? flag.opened(r.target) : r.kind === "solve" ? flag.solved(r.target) : r.kind === "deduce" ? flag.deduced(r.target) : r.kind === "combine" ? flag.combined(r.target) : flag.visited(r.target);
    if (!flagTargetExists(f)) e(`requirement ${r.id} targets unknown ${r.target}`);
  }

  for (const r of level.recipes) {
    for (const i of [...r.inputs, r.output]) if (!ITEMS[i]) e(`recipe ${r.id} uses unknown item ${i}`);
    if (r.inputs[0] === r.inputs[1]) e(`recipe ${r.id} combines an item with itself`);
  }

  // Consumable items with several targets could be wasted.
  const targetsByItem = new Map<string, number>();
  level.scene.objects.forEach((o) => o.lock?.kind === "item" && targetsByItem.set(o.lock.item, (targetsByItem.get(o.lock.item) ?? 0) + 1));
  for (const [item, n] of targetsByItem) {
    const consumable = ITEMS[item]?.consumable;
    const anyConsumes = level.scene.objects.some((o) => o.lock?.kind === "item" && o.lock.item === item && (o.lock.consumes ?? consumable));
    if (n > 1 && anyConsumes) e(`consumable item ${item} has ${n} targets`);
  }

  for (const p of level.puzzles) {
    if (!level.scene.objects.some((o) => o.lock?.kind === "puzzle" && o.lock.puzzle === p.id)) e(`puzzle ${p.id} has no host object`);
    if (p.clueRefs.length === 0) e(`puzzle ${p.id} has no clue references`);
    for (const ref of p.clueRefs) if (!objIds.has(ref) && !EVIDENCE[ref]) e(`puzzle ${p.id} clue ${ref} does not exist`);
    if (p.reward?.item && !ITEMS[p.reward.item]) e(`puzzle ${p.id} rewards unknown item`);
    const corpus = clueCorpus(level, p.clueRefs);
    const norm = normalizeText(corpus);
    switch (p.kind) {
      case "code":
        if (!norm.includes(normalizeText(p.answer))) e(`code puzzle ${p.id}: answer "${p.answer}" is not discoverable in its clues`);
        if (p.charset === "digits" && !/^\d+$/.test(p.answer)) e(`code puzzle ${p.id}: digits charset but non-digit answer`);
        break;
      case "cipher": {
        if (normalizeText(caesarShift(p.cipherText, -p.shift)) !== normalizeText(p.answer)) e(`cipher ${p.id}: ciphertext does not decode to the answer`);
        const lower = corpus.toLowerCase();
        if (!lower.includes(String(p.shift)) && !lower.includes(NUMBER_WORDS[p.shift] ?? "#")) e(`cipher ${p.id}: shift ${p.shift} is not discoverable`);
        break;
      }
      case "sequence": {
        const ids = new Set(p.symbols.map((s) => s.id));
        if (p.answer.some((a) => !ids.has(a))) e(`sequence ${p.id}: answer uses unknown symbol`);
        const lower = corpus.toLowerCase();
        let last = -1;
        for (const a of p.answer) {
          const label = p.symbols.find((s) => s.id === a)!.label.toLowerCase();
          const idx = lower.indexOf(label, last + 1);
          if (idx < 0) {
            e(`sequence ${p.id}: "${label}" does not appear in order in the clues`);
            break;
          }
          last = idx;
        }
        break;
      }
      case "reconstruct":
        if (!PICTURES[p.picture]) e(`reconstruct ${p.id}: unknown picture ${p.picture}`);
        if (!isPermutation(p.start, p.cols * p.rows)) e(`reconstruct ${p.id}: start is not a permutation`);
        if (p.start.every((v, i) => v === i)) e(`reconstruct ${p.id}: starts already solved`);
        break;
      case "timeline": {
        const ids = p.events.map((x) => x.id);
        if (p.answer.length !== ids.length || !p.answer.every((a) => ids.includes(a))) e(`timeline ${p.id}: answer is not a permutation of events`);
        if (p.answer.every((a, i) => a === ids[i])) e(`timeline ${p.id}: events start in solved order`);
        break;
      }
      case "choice":
        if (!p.options.some((o) => o.id === p.answer)) e(`choice ${p.id}: answer is not an option`);
        break;
    }
  }

  for (const d of level.deductions) {
    if (!d.conclusions.some((c) => c.id === d.answer)) e(`deduction ${d.id}: answer is not a conclusion`);
    if (d.conclusions.length < 2) e(`deduction ${d.id}: needs at least two conclusions`);
    if (d.evidence.length < 2) e(`deduction ${d.id}: needs at least two pieces of evidence`);
    d.requires?.forEach((f) => !flagTargetExists(f) && e(`deduction ${d.id} requires unknown flag ${f}`));
    for (const ev of d.evidence) {
      const rec = EVIDENCE[ev];
      if (!rec) {
        e(`deduction ${d.id}: unknown evidence ${ev}`);
        continue;
      }
      const src = getLevel(rec.levelId)!;
      if (src.number > level.number) e(`deduction ${d.id}: evidence ${ev} comes from a later level`);
    }
  }

  for (const c of level.startingItems) {
    if (!ITEMS[c.item]) e(`starting item ${c.item} unknown`);
    const from = getLevel(c.from);
    if (!from || from.number >= level.number) e(`starting item ${c.item} must come from an earlier level`);
  }

  // Hints cover every needed object, puzzle, recipe and deduction.
  const needs = computeNeeds(level);
  const hintIds = new Set(level.hints.map((h) => h.id));
  needs.objects.forEach((id) => !hintIds.has(`hint-obj-${id}`) && e(`no hint for needed object ${id}`));
  needs.puzzles.forEach((id) => !hintIds.has(`hint-puzzle-${id}`) && e(`no hint for puzzle ${id}`));
  needs.recipes.forEach((id) => !hintIds.has(`hint-combine-${id}`) && e(`no hint for recipe ${id}`));
  needs.deductions.forEach((id) => !hintIds.has(`hint-deduce-${id}`) && e(`no hint for deduction ${id}`));
  for (const h of level.hints) {
    const ok =
      (h.kind === "object" || h.kind === "item-use") ? objIds.has(h.target) : h.kind === "puzzle" ? puzzleIds.has(h.target) : h.kind === "combine" ? recipeIds.has(h.target) : h.kind === "deduction" ? dedIds.has(h.target) : areaIds.has(h.target);
    if (!ok) e(`hint ${h.id} references unknown target ${h.target}`);
  }
  return errors;
}

export interface PlaythroughResult {
  levelId: string;
  complete: boolean;
  steps: number;
}

/** Plays every level in order, carrying the notebook forward like a player would. */
export function simulateFullPlaythrough(): { results: PlaythroughResult[]; evidence: string[] } {
  const known = new Set<string>();
  const results: PlaythroughResult[] = [];
  for (const level of LEVELS) {
    const res = solveLevel(level, createRun(level), known);
    res.run.evidence.forEach((ev) => known.add(ev));
    results.push({ levelId: level.id, complete: res.complete, steps: res.steps.length });
  }
  return { results, evidence: [...known] };
}

export function validateRegistry(opts: { expectComplete?: boolean } = {}): string[] {
  const errors: string[] = [];
  const expect = opts.expectComplete ?? true;
  if (expect && LEVELS.length !== EXPECTED_LEVELS) errors.push(`Expected ${EXPECTED_LEVELS} levels, found ${LEVELS.length}`);
  if (CHAPTERS.length !== EXPECTED_CHAPTERS) errors.push(`Expected ${EXPECTED_CHAPTERS} chapters, found ${CHAPTERS.length}`);
  LEVELS.forEach((l, i) => l.number !== i + 1 && errors.push(`Level at index ${i} has number ${l.number}`));
  const ids = new Set<string>();
  for (const l of LEVELS) {
    if (ids.has(l.id)) errors.push(`Duplicate level id ${l.id}`);
    ids.add(l.id);
    if (!CHAPTERS.some((c) => c.id === l.chapterId)) errors.push(`Level ${l.id} references unknown chapter ${l.chapterId}`);
    for (const p of l.prerequisites) if (!getLevel(p)) errors.push(`Level ${l.id} prerequisite ${p} does not exist`);
  }
  if (expect) {
    for (const c of CHAPTERS) {
      const n = LEVELS.filter((l) => l.chapterId === c.id).length;
      if (n !== LEVELS_PER_CHAPTER) errors.push(`Chapter ${c.id} has ${n} levels`);
      for (const p of c.prerequisites) if (!getLevel(p)) errors.push(`Chapter ${c.id} prerequisite ${p} does not exist`);
    }
  }
  // Prerequisite graph must be acyclic and reachable from a root.
  const visiting = new Set<string>();
  const done = new Set<string>();
  const visit = (id: string): boolean => {
    if (done.has(id)) return true;
    if (visiting.has(id)) return false;
    visiting.add(id);
    const l = getLevel(id);
    const ok = (l?.prerequisites ?? []).every(visit);
    visiting.delete(id);
    done.add(id);
    return ok;
  };
  for (const l of LEVELS) if (!visit(l.id)) errors.push(`Prerequisite cycle involving ${l.id}`);
  DUPLICATE_EVIDENCE_IDS.forEach((id) => errors.push(`Duplicate evidence id ${id}`));
  for (const l of LEVELS) errors.push(...validateLevel(l));
  const origins = itemOrigins();
  for (const l of LEVELS) {
    for (const c of l.startingItems) {
      if (!(origins.get(c.item) ?? []).includes(c.from)) errors.push(`[${l.id}] carried item ${c.item} is not obtainable in ${c.from}`);
    }
  }
  return errors;
}
