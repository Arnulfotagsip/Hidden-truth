/**
 * Central level registry. Levels are ordered; each requires the previous
 * level, and each chapter requires the previous chapter's final level.
 */
import type { ChapterDefinition, EvidenceItem, LevelDefinition } from "../types";
import { CHAPTERS as CHAPTER_DEFS } from "./chapters";
import { CH1_LEVELS } from "./levels/ch01";
import { CH2_LEVELS } from "./levels/ch02";
import { CH3_LEVELS } from "./levels/ch03";

const ORDERED: LevelDefinition[] = [...CH1_LEVELS, ...CH2_LEVELS, ...CH3_LEVELS];

export const LEVELS: LevelDefinition[] = ORDERED.map((l, i) => ({
  ...l,
  prerequisites: i === 0 ? [] : [ORDERED[i - 1].id],
}));

export const CHAPTERS: ChapterDefinition[] = CHAPTER_DEFS;

const LEVEL_INDEX = new Map(LEVELS.map((l) => [l.id, l]));
const CHAPTER_INDEX = new Map(CHAPTERS.map((c) => [c.id, c]));

export function getLevel(id: string): LevelDefinition | undefined {
  return LEVEL_INDEX.get(id);
}

export function getChapter(id: string): ChapterDefinition | undefined {
  return CHAPTER_INDEX.get(id);
}

export function levelsInChapter(chapterId: string): LevelDefinition[] {
  return LEVELS.filter((l) => l.chapterId === chapterId);
}

function buildEvidence(): { index: Record<string, EvidenceItem>; duplicates: string[] } {
  const index: Record<string, EvidenceItem> = {};
  const duplicates: string[] = [];
  const add = (e: EvidenceItem) => {
    if (index[e.id]) duplicates.push(e.id);
    else index[e.id] = e;
  };
  for (const l of LEVELS) {
    const base = { levelId: l.id, chapterId: l.chapterId, location: l.location };
    for (const o of l.scene.objects) {
      if (!o.evidence) continue;
      const g = o.evidence;
      add({ ...base, id: g.id, name: g.name ?? o.name, description: g.description ?? o.description, category: g.category, significance: g.significance, related: g.related ?? [], document: o.document });
    }
    for (const p of l.puzzles) {
      const g = p.reward?.evidence;
      if (g) add({ ...base, id: g.id, name: g.name ?? p.title, description: g.description ?? p.successText, category: g.category, significance: g.significance, related: g.related ?? [] });
    }
    for (const r of l.recipes) {
      const g = r.evidence;
      if (g) add({ ...base, id: g.id, name: g.name ?? r.id, description: g.description ?? r.text, category: g.category, significance: g.significance, related: g.related ?? [] });
    }
    for (const d of l.deductions) {
      const g = d.reward?.evidence;
      if (g) add({ ...base, id: g.id, name: g.name ?? d.title, description: g.description ?? d.successText, category: g.category, significance: g.significance, related: g.related ?? [] });
    }
  }
  return { index, duplicates };
}

const built = buildEvidence();
export const EVIDENCE: Record<string, EvidenceItem> = built.index;
export const DUPLICATE_EVIDENCE_IDS: string[] = built.duplicates;

export function getEvidence(id: string): EvidenceItem | undefined {
  return EVIDENCE[id];
}
