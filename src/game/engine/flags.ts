import type { Flag, LevelCompletionRequirement, RequirementKind } from "../types";

export const flag = {
  found: (id: string): Flag => `found:${id}`,
  opened: (id: string): Flag => `opened:${id}`,
  solved: (id: string): Flag => `solved:${id}`,
  deduced: (id: string): Flag => `deduced:${id}`,
  combined: (id: string): Flag => `combined:${id}`,
  visited: (id: string): Flag => `visited:${id}`,
};

const KIND_TO_FLAG: Record<RequirementKind, (id: string) => Flag> = {
  find: flag.found,
  open: flag.opened,
  solve: flag.solved,
  deduce: flag.deduced,
  combine: flag.combined,
  visit: flag.visited,
};

export function requirementFlag(r: LevelCompletionRequirement): Flag {
  return KIND_TO_FLAG[r.kind](r.target);
}

export function parseFlag(f: Flag): { kind: string; id: string } {
  const i = f.indexOf(":");
  return i < 0 ? { kind: f, id: "" } : { kind: f.slice(0, i), id: f.slice(i + 1) };
}

export function hasAll(flags: readonly Flag[] | Set<Flag>, needed: readonly Flag[] | undefined): boolean {
  if (!needed || needed.length === 0) return true;
  const set = flags instanceof Set ? flags : new Set(flags);
  return needed.every((f) => set.has(f));
}
