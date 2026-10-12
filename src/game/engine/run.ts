import type { InteractionProgress, InteractiveObject, LevelDefinition } from "../types";
import { flag, hasAll } from "./flags";

const COLLECTABLE = new Set(["evidence", "collectible", "item", "document", "environment"]);
const OPENABLE = new Set(["container", "mechanism", "compartment", "puzzle", "exit"]);

export function isOpenable(o: InteractiveObject): boolean {
  return OPENABLE.has(o.category);
}

/** An object the player "collects" (sets found:id) rather than opens. */
export function isCollectable(o: InteractiveObject): boolean {
  if (!COLLECTABLE.has(o.category)) return false;
  if (o.category === "environment") return Boolean(o.evidence || o.item || o.document);
  return true;
}

export function createRun(level: LevelDefinition, now = Date.now()): InteractionProgress {
  const start = level.scene.areas[0].id;
  return {
    levelId: level.id,
    flags: [flag.visited(start)],
    inventory: level.startingItems.map((s) => s.item),
    evidence: [],
    area: start,
    hintsUsed: 0,
    hintTiers: {},
    lastHintAt: null,
    startedAt: now,
    mistakes: 0,
  };
}

export function getObject(level: LevelDefinition, id: string): InteractiveObject | undefined {
  return level.scene.objects.find((o) => o.id === id);
}

/** Is the object currently drawn in the scene? */
export function isVisible(o: InteractiveObject, flags: readonly string[]): boolean {
  if (!hasAll(flags, o.hiddenUntil)) return false;
  // Picked-up inventory items leave the scene.
  if (o.category === "item" && o.item && flags.includes(flag.found(o.id))) return false;
  return true;
}

export function isAccessible(o: InteractiveObject, flags: readonly string[]): boolean {
  return hasAll(flags, o.requires?.flags);
}

export function isDone(o: InteractiveObject, flags: readonly string[]): boolean {
  if (isOpenable(o)) return flags.includes(flag.opened(o.id));
  if (isCollectable(o)) return flags.includes(flag.found(o.id));
  return false;
}

export function isAreaAccessible(level: LevelDefinition, areaId: string, flags: readonly string[]): boolean {
  const a = level.scene.areas.find((x) => x.id === areaId);
  if (!a) return false;
  return hasAll(flags, a.requires?.flags);
}

export function visibleObjects(level: LevelDefinition, run: InteractionProgress): InteractiveObject[] {
  return level.scene.objects.filter((o) => o.area === run.area && isVisible(o, run.flags));
}

/** Objects referencing this puzzle as their lock. */
export function puzzleHosts(level: LevelDefinition, puzzleId: string): InteractiveObject[] {
  return level.scene.objects.filter((o) => o.lock?.kind === "puzzle" && o.lock.puzzle === puzzleId);
}

export function addUnique<T>(list: readonly T[], ...items: (T | undefined | null)[]): T[] {
  const out = [...list];
  for (const it of items) if (it != null && !out.includes(it)) out.push(it);
  return out;
}
