/**
 * Versioned LocalStorage persistence with validation, migration and
 * recovery. Nothing here talks to a server.
 */
import { LEVELS, getLevel } from "../content";
import type { InteractionProgress, LevelRecord, PlayerProgress, PlayerSettings } from "../types";
import { SAVE_VERSION, computeUnlocked, defaultSettings, newProgress } from "./progression";

export const SAVE_KEY = "casefiles.hidden-truths.save";
export const BACKUP_KEY = "casefiles.hidden-truths.corrupt-backup";

export type LoadStatus = "new" | "loaded" | "migrated" | "recovered";

export interface LoadResult {
  progress: PlayerProgress;
  status: LoadStatus;
  warnings: string[];
}

type Json = Record<string, unknown>;

const isObj = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);
const strArr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) ? v : d);
const bool = (v: unknown, d: boolean) => (typeof v === "boolean" ? v : d);

const VALID_LEVELS = () => new Set(LEVELS.map((l) => l.id));

function sanitizeSettings(v: unknown): PlayerSettings {
  const d = defaultSettings();
  if (!isObj(v)) return d;
  const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
  return {
    sfx: bool(v.sfx, d.sfx),
    music: bool(v.music, d.music),
    sfxVolume: clamp01(num(v.sfxVolume, d.sfxVolume)),
    musicVolume: clamp01(num(v.musicVolume, d.musicVolume)),
    reducedMotion: v.reducedMotion === "on" || v.reducedMotion === "off" || v.reducedMotion === "system" ? v.reducedMotion : d.reducedMotion,
    textSize: v.textSize === "large" ? "large" : "normal",
    highContrast: bool(v.highContrast, d.highContrast),
  };
}

function sanitizeRun(levelId: string, v: unknown): InteractionProgress | null {
  if (!isObj(v)) return null;
  const level = getLevel(levelId);
  if (!level) return null;
  const area = typeof v.area === "string" && level.scene.areas.some((a) => a.id === v.area) ? v.area : level.scene.areas[0].id;
  const tiers: Record<string, number> = {};
  if (isObj(v.hintTiers)) for (const [k, t] of Object.entries(v.hintTiers)) if (typeof t === "number") tiers[k] = t;
  return {
    levelId,
    flags: strArr(v.flags),
    inventory: strArr(v.inventory),
    evidence: strArr(v.evidence),
    area,
    hintsUsed: Math.max(0, num(v.hintsUsed, 0)),
    hintTiers: tiers,
    lastHintAt: typeof v.lastHintAt === "number" ? v.lastHintAt : null,
    startedAt: num(v.startedAt, Date.now()),
    mistakes: Math.max(0, num(v.mistakes, 0)),
  };
}

function sanitizeRecord(v: unknown): LevelRecord | null {
  if (!isObj(v)) return null;
  return {
    completedAt: num(v.completedAt, Date.now()),
    stars: Math.min(3, Math.max(0, Math.round(num(v.stars, 1)))),
    hintsUsed: Math.max(0, num(v.hintsUsed, 0)),
    optionalFound: Math.max(0, num(v.optionalFound, 0)),
    optionalTotal: Math.max(0, num(v.optionalTotal, 0)),
  };
}

/** Validates (and repairs) a v2 save object. Unknown or malformed entries are dropped. */
export function validateProgress(v: unknown, warnings: string[] = []): PlayerProgress {
  if (!isObj(v)) throw new Error("Save data is not an object");
  const valid = VALID_LEVELS();
  const completed: Record<string, LevelRecord> = {};
  if (isObj(v.completed)) {
    for (const [id, rec] of Object.entries(v.completed)) {
      const r = sanitizeRecord(rec);
      if (valid.has(id) && r) completed[id] = r;
      else warnings.push(`Dropped unknown completion record "${id}".`);
    }
  }
  // A completion is only kept if its prerequisites chain is intact.
  for (const l of LEVELS) {
    if (completed[l.id] && !l.prerequisites.every((p) => p in completed)) {
      warnings.push(`Removed completion for ${l.id}: its prerequisites are missing.`);
      delete completed[l.id];
    }
  }
  const runs: Record<string, InteractionProgress> = {};
  if (isObj(v.runs)) {
    for (const [id, r] of Object.entries(v.runs)) {
      const s = sanitizeRun(id, r);
      if (s) runs[id] = s;
      else warnings.push(`Dropped invalid in-progress case "${id}".`);
    }
  }
  const unlocked = computeUnlocked(completed);
  for (const id of Object.keys(runs)) if (!unlocked.includes(id)) delete runs[id];
  const current = typeof v.currentLevelId === "string" && unlocked.includes(v.currentLevelId) ? v.currentLevelId : unlocked.at(-1) ?? LEVELS[0].id;
  const now = Date.now();
  return {
    version: SAVE_VERSION,
    createdAt: num(v.createdAt, now),
    updatedAt: num(v.updatedAt, now),
    currentLevelId: current,
    unlockedLevels: unlocked,
    completed,
    evidence: Array.from(new Set(strArr(v.evidence))),
    solvedPuzzles: Array.from(new Set(strArr(v.solvedPuzzles))),
    collectibles: Array.from(new Set(strArr(v.collectibles))),
    runs,
    chapterSummariesSeen: strArr(v.chapterSummariesSeen),
    settings: sanitizeSettings(v.settings),
  };
}

/**
 * Migrations. Version 1 (the prototype format) stored a flat list of
 * completed level numbers and a settings object with `sound`.
 */
export function migrate(data: Json, warnings: string[]): Json {
  let d = { ...data };
  const version = typeof d.version === "number" ? d.version : 1;
  if (version > SAVE_VERSION) throw new Error(`Save version ${version} is newer than this game supports.`);
  if (version < 2) {
    const completedNums = Array.isArray(d.completedLevels) ? d.completedLevels : [];
    const completed: Record<string, LevelRecord> = {};
    for (const n of completedNums) {
      const lvl = typeof n === "number" ? LEVELS.find((l) => l.number === n) : typeof n === "string" ? getLevel(n) : undefined;
      if (lvl) completed[lvl.id] = { completedAt: num(d.savedAt, Date.now()), stars: 1, hintsUsed: 0, optionalFound: 0, optionalTotal: 0 };
    }
    const oldSettings = isObj(d.settings) ? d.settings : {};
    d = {
      version: 2,
      createdAt: num(d.savedAt, Date.now()),
      updatedAt: Date.now(),
      currentLevelId: typeof d.current === "string" ? d.current : undefined,
      completed,
      evidence: strArr(d.evidence),
      solvedPuzzles: [],
      collectibles: [],
      runs: {},
      chapterSummariesSeen: [],
      settings: { ...defaultSettings(), sfx: bool(oldSettings.sound, true), music: bool(oldSettings.sound, true) },
    };
    warnings.push("Migrated save from version 1.");
  }
  return d;
}

export function parseSave(raw: string | null): LoadResult {
  if (raw == null || raw === "") return { progress: newProgress(), status: "new", warnings: [] };
  const warnings: string[] = [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!isObj(data)) throw new Error("Not an object");
    const payload = isObj(data.progress) && data.format === "casefiles-save" ? data.progress : data;
    const before = typeof payload.version === "number" ? payload.version : 1;
    const migrated = migrate(payload, warnings);
    const progress = validateProgress(migrated, warnings);
    return { progress, status: before < SAVE_VERSION ? "migrated" : warnings.length ? "recovered" : "loaded", warnings };
  } catch (e) {
    warnings.push(`Save data could not be read (${(e as Error).message}). Starting fresh; the old data was backed up.`);
    return { progress: newProgress(), status: "recovered", warnings };
  }
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function loadFromStorage(storage: StorageLike): LoadResult {
  let raw: string | null = null;
  try {
    raw = storage.getItem(SAVE_KEY);
  } catch {
    return { progress: newProgress(), status: "new", warnings: ["Local storage is unavailable; progress will not be saved."] };
  }
  const res = parseSave(raw);
  if (res.status === "recovered" && raw && res.warnings.some((w) => w.includes("could not be read"))) {
    try {
      storage.setItem(BACKUP_KEY, raw);
    } catch {
      /* ignore */
    }
  }
  return res;
}

export function saveToStorage(storage: StorageLike, progress: PlayerProgress): boolean {
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

/** JSON file contents for a manual backup. */
export function exportSave(progress: PlayerProgress): string {
  return JSON.stringify({ format: "casefiles-save", exportedAt: new Date().toISOString(), progress }, null, 2);
}

export function importSave(text: string): { ok: true; result: LoadResult } | { ok: false; reason: string } {
  try {
    JSON.parse(text);
  } catch {
    return { ok: false, reason: "That file isn't valid JSON." };
  }
  const result = parseSave(text);
  if (result.warnings.some((w) => w.includes("could not be read"))) return { ok: false, reason: result.warnings.join(" ") };
  return { ok: true, result };
}
