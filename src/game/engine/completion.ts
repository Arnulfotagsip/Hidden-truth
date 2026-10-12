import type { CaseCompletionResult, InteractionProgress, LevelDefinition } from "../types";
import { flag, requirementFlag } from "./flags";
import { computeNeeds } from "./needs";

export function requirementStatus(level: LevelDefinition, run: InteractionProgress) {
  return level.requirements.map((r) => ({ requirement: r, done: run.flags.includes(requirementFlag(r)) }));
}

/** The single source of truth for "is this level legitimately complete?" */
export function isLevelComplete(level: LevelDefinition, run: InteractionProgress): boolean {
  if (run.levelId !== level.id) return false;
  if (level.requirements.length === 0) return false;
  return level.requirements.every((r) => run.flags.includes(requirementFlag(r)));
}

/** Objects not needed for completion that still add to the case (collectibles, extra evidence). */
export function optionalObjects(level: LevelDefinition) {
  const needs = computeNeeds(level);
  return level.scene.objects.filter(
    (o) => o.category === "collectible" || (!o.required && !needs.objects.has(o.id) && Boolean(o.evidence)),
  );
}

export function computeCompletion(level: LevelDefinition, run: InteractionProgress, nextLevelId: string | null, chapterComplete: boolean): CaseCompletionResult {
  const req = requirementStatus(level, run);
  const optional = optionalObjects(level);
  const optionalFound = optional.filter((o) => run.flags.includes(flag.found(o.id)) || run.flags.includes(flag.opened(o.id))).length;
  const requiredFound = req.filter((r) => r.done).length;
  const ratio = optional.length === 0 ? 1 : optionalFound / optional.length;
  // Stars reward thoroughness, never penalise hints.
  const stars = !isLevelComplete(level, run) ? 0 : ratio >= 1 ? 3 : ratio >= 0.5 ? 2 : 1;
  return {
    levelId: level.id,
    stars,
    requiredFound,
    requiredTotal: req.length,
    optionalFound,
    optionalTotal: optional.length,
    puzzlesSolved: level.puzzles.filter((p) => run.flags.includes(flag.solved(p.id))).length + level.deductions.filter((d) => run.flags.includes(flag.deduced(d.id))).length,
    hintsUsed: run.hintsUsed,
    completeness: Math.round(((requiredFound + optionalFound) / Math.max(1, req.length + optional.length)) * 100),
    nextLevelId,
    chapterComplete,
  };
}
