/**
 * Centralised progression: unlocking, starting/resuming runs, completing
 * levels. Completion is only accepted when the level's requirements are
 * actually satisfied by the run.
 */
import { CHAPTERS, LEVELS, getChapter, getLevel } from "../content";
import type { CaseCompletionResult, InteractionProgress, LevelRecord, PlayerProgress, PlayerSettings } from "../types";
import { computeCompletion, isLevelComplete } from "./completion";
import { flag } from "./flags";
import { createRun } from "./run";

export const SAVE_VERSION = 2;

export function defaultSettings(): PlayerSettings {
  return {
    sfx: true,
    music: true,
    sfxVolume: 0.7,
    musicVolume: 0.4,
    reducedMotion: "system",
    textSize: "normal",
    highContrast: false,
  };
}

export function newProgress(now = Date.now(), settings?: PlayerSettings): PlayerProgress {
  return {
    version: SAVE_VERSION,
    createdAt: now,
    updatedAt: now,
    currentLevelId: LEVELS[0].id,
    unlockedLevels: [LEVELS[0].id],
    completed: {},
    evidence: [],
    solvedPuzzles: [],
    collectibles: [],
    runs: {},
    chapterSummariesSeen: [],
    settings: settings ?? defaultSettings(),
  };
}

export function isChapterUnlocked(completed: Record<string, unknown>, chapterId: string): boolean {
  const ch = getChapter(chapterId);
  if (!ch) return false;
  return ch.prerequisites.every((id) => id in completed);
}

/** Prerequisites are enforced here, not only by hiding buttons. */
export function isLevelUnlocked(progress: Pick<PlayerProgress, "completed">, levelId: string): boolean {
  const level = getLevel(levelId);
  if (!level) return false;
  if (!isChapterUnlocked(progress.completed, level.chapterId)) return false;
  return level.prerequisites.every((id) => id in progress.completed);
}

export function computeUnlocked(completed: Record<string, unknown>): string[] {
  return LEVELS.filter((l) => isLevelUnlocked({ completed: completed as PlayerProgress["completed"] }, l.id)).map((l) => l.id);
}

export function nextLevelId(levelId: string): string | null {
  const i = LEVELS.findIndex((l) => l.id === levelId);
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1].id : null;
}

export function lockedReason(progress: PlayerProgress, levelId: string): string | null {
  const level = getLevel(levelId);
  if (!level) return "Unknown case.";
  if (isLevelUnlocked(progress, levelId)) return null;
  const ch = getChapter(level.chapterId)!;
  if (!isChapterUnlocked(progress.completed, ch.id)) {
    const prev = CHAPTERS.find((c) => c.number === ch.number - 1);
    return `Close Chapter ${prev?.number}: ${prev?.title} to open this chapter.`;
  }
  const missing = level.prerequisites.filter((id) => !(id in progress.completed)).map((id) => getLevel(id)!);
  return `Complete case ${missing.map((m) => `${m.number} (${m.title})`).join(", ")} first.`;
}

export function knownEvidence(progress: PlayerProgress, run?: InteractionProgress | null): string[] {
  return run ? Array.from(new Set([...progress.evidence, ...run.evidence])) : progress.evidence;
}

export type StartResult = { ok: true; progress: PlayerProgress; run: InteractionProgress; resumed: boolean } | { ok: false; reason: string };

export function startLevel(progress: PlayerProgress, levelId: string, opts: { fresh?: boolean; now?: number } = {}): StartResult {
  const level = getLevel(levelId);
  if (!level) return { ok: false, reason: "Unknown case." };
  if (!isLevelUnlocked(progress, levelId)) return { ok: false, reason: lockedReason(progress, levelId) ?? "Locked." };
  const existing = progress.runs[levelId];
  if (existing && !opts.fresh) {
    return { ok: true, progress: { ...progress, currentLevelId: levelId }, run: existing, resumed: true };
  }
  const run = createRun(level, opts.now);
  return {
    ok: true,
    resumed: false,
    run,
    progress: { ...progress, currentLevelId: levelId, runs: { ...progress.runs, [levelId]: run }, updatedAt: opts.now ?? Date.now() },
  };
}

/** Persist a run and merge its discoveries into the global case notebook. */
export function updateRun(progress: PlayerProgress, run: InteractionProgress, now = Date.now()): PlayerProgress {
  const level = getLevel(run.levelId);
  if (!level) return progress;
  const solved = level.puzzles.filter((p) => run.flags.includes(flag.solved(p.id))).map((p) => p.id);
  const deduced = level.deductions.filter((d) => run.flags.includes(flag.deduced(d.id))).map((d) => d.id);
  const collectibles = level.scene.objects
    .filter((o) => o.category === "collectible" && run.flags.includes(flag.found(o.id)))
    .map((o) => o.id);
  return {
    ...progress,
    updatedAt: now,
    runs: { ...progress.runs, [run.levelId]: run },
    evidence: Array.from(new Set([...progress.evidence, ...run.evidence])),
    solvedPuzzles: Array.from(new Set([...progress.solvedPuzzles, ...solved, ...deduced])),
    collectibles: Array.from(new Set([...progress.collectibles, ...collectibles])),
  };
}

export type CompleteResult = { ok: true; progress: PlayerProgress; result: CaseCompletionResult } | { ok: false; reason: string };

export function completeLevel(progress: PlayerProgress, run: InteractionProgress, now = Date.now()): CompleteResult {
  const level = getLevel(run.levelId);
  if (!level) return { ok: false, reason: "Unknown case." };
  if (!isLevelUnlocked(progress, level.id)) return { ok: false, reason: "This case is locked." };
  if (!isLevelComplete(level, run)) return { ok: false, reason: "The case still has open requirements." };

  const next = nextLevelId(level.id);
  const lastInChapter = LEVELS.filter((l) => l.chapterId === level.chapterId).at(-1)!.id === level.id;
  const result = computeCompletion(level, run, next, lastInChapter);

  const prev = progress.completed[level.id];
  const record: LevelRecord = {
    completedAt: prev?.completedAt ?? now,
    stars: Math.max(prev?.stars ?? 0, result.stars),
    hintsUsed: prev ? Math.min(prev.hintsUsed, result.hintsUsed) : result.hintsUsed,
    optionalFound: Math.max(prev?.optionalFound ?? 0, result.optionalFound),
    optionalTotal: result.optionalTotal,
  };
  const merged = updateRun(progress, run, now);
  const completed = { ...merged.completed, [level.id]: record };
  const runs = { ...merged.runs };
  delete runs[level.id];
  const unlocked = computeUnlocked(completed);
  return {
    ok: true,
    result,
    progress: {
      ...merged,
      completed,
      runs,
      unlockedLevels: unlocked,
      currentLevelId: next && unlocked.includes(next) ? next : level.id,
    },
  };
}

export function chapterProgress(progress: PlayerProgress, chapterId: string) {
  const levels = LEVELS.filter((l) => l.chapterId === chapterId);
  const done = levels.filter((l) => l.id in progress.completed).length;
  const stars = levels.reduce((s, l) => s + (progress.completed[l.id]?.stars ?? 0), 0);
  return { done, total: levels.length, stars, maxStars: levels.length * 3 };
}

/** The level "Continue Investigation" should open. */
export function continueTarget(progress: PlayerProgress): string {
  if (isLevelUnlocked(progress, progress.currentLevelId)) return progress.currentLevelId;
  const firstOpen = LEVELS.find((l) => isLevelUnlocked(progress, l.id) && !(l.id in progress.completed));
  return firstOpen?.id ?? LEVELS[0].id;
}

export function hasMeaningfulProgress(progress: PlayerProgress): boolean {
  return Object.keys(progress.completed).length > 0 || Object.keys(progress.runs).length > 0;
}
