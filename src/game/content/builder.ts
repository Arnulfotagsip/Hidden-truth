/**
 * Authoring helpers for level content. They keep each level definition
 * compact while producing fully explicit, validated data structures.
 */
import { getSprite } from "../art/sprites";
import type {
  AreaDefinition,
  CombinationRecipe,
  DecorItem,
  DeductionPuzzle,
  Difficulty,
  DocumentContent,
  EvidenceGrant,
  Flag,
  HintDefinition,
  InteractiveObject,
  LevelCompletionRequirement,
  LevelDefinition,
  LockDefinition,
  ObjectCategory,
  PuzzleDefinition,
  Rect,
  ShellDefinition,
  HitRegion,
} from "../types";

export interface Placed extends Rect {
  art: string;
}

/** Rect resting on a furniture surface. `fx` is the horizontal centre (0–1). */
export function on(p: Placed, surface: number, fx: number, w: number, h: number): Rect {
  const surfaces = getSprite(p.art).surfaces ?? [0];
  const s = surfaces[Math.min(surface, surfaces.length - 1)];
  return { x: Math.round(p.x + fx * p.w - w / 2), y: Math.round(p.y + s * p.h - h), w, h };
}

/** Rect centred at a relative point inside a placed item. */
export function inside(p: Rect, fx: number, fy: number, w: number, h: number): Rect {
  return { x: Math.round(p.x + fx * p.w - w / 2), y: Math.round(p.y + fy * p.h - h / 2), w, h };
}

/** Rect resting on the floor at scene x (centre) and floor line y. */
export function floor(cx: number, y: number, w: number, h: number): Rect {
  return { x: Math.round(cx - w / 2), y: Math.round(y - h), w, h };
}

export function at(x: number, y: number, w: number, h: number): Rect {
  return { x, y, w, h };
}

export interface ObjSpec {
  id: string;
  name: string;
  cat: ObjectCategory;
  art: string;
  box: Rect;
  desc: string;
  tint?: string;
  rotate?: number;
  flip?: boolean;
  hit?: HitRegion;
  obs?: string[];
  required?: boolean;
  hiddenUntil?: Flag[];
  requires?: { flags: Flag[]; message: string };
  item?: string;
  ev?: EvidenceGrant;
  doc?: DocumentContent;
  lock?: LockDefinition;
  openArt?: string;
  openText?: string;
  hint?: string;
  obscured?: boolean;
  opacity?: number;
  variant?: string;
  exitTo?: string;
  area?: string;
}

export class SceneBuilder {
  readonly id: string;
  private areas: AreaDefinition[] = [];
  private objects: InteractiveObject[] = [];
  private current: AreaDefinition | null = null;

  constructor(id: string) {
    this.id = id;
  }

  area(id: string, name: string, shell: ShellDefinition, requires?: { flags: Flag[]; message: string }): this {
    const a: AreaDefinition = { id, name, shell, decor: [], requires };
    this.areas.push(a);
    this.current = a;
    return this;
  }

  /** Switch the current area for subsequent decor/objects. */
  in(id: string): this {
    const a = this.areas.find((x) => x.id === id);
    if (!a) throw new Error(`Unknown area ${id}`);
    this.current = a;
    return this;
  }

  decor(art: string, x: number, y: number, w: number, h: number, opts: Partial<Omit<DecorItem, "art" | "x" | "y" | "w" | "h">> = {}): Placed {
    if (!this.current) throw new Error("Declare an area first");
    this.current.decor.push({ art, x, y, w, h, ...opts });
    return { art, x, y, w, h };
  }

  /** Decor placed with a computed rect (e.g. from `on()`). */
  place(art: string, r: Rect, opts: Partial<Omit<DecorItem, "art" | "x" | "y" | "w" | "h">> = {}): Placed {
    return this.decor(art, r.x, r.y, r.w, r.h, opts);
  }

  /** Optional brass wren token collectible. */
  token(id: string, box: Rect, note: string): InteractiveObject {
    return this.obj({
      id,
      name: "Brass Wren Token",
      cat: "collectible",
      art: "token",
      box,
      desc: `A brass token stamped with a wren — Elias Hollowmere gave these to people he trusted. ${note}`,
      opacity: 0.92,
    });
  }

  obj(spec: ObjSpec): InteractiveObject {
    if (!this.current && !spec.area) throw new Error("Declare an area first");
    const o: InteractiveObject = {
      id: spec.id,
      name: spec.name,
      category: spec.cat,
      art: spec.art,
      tint: spec.tint,
      box: spec.box,
      rotate: spec.rotate,
      flip: spec.flip,
      hit: spec.hit,
      area: spec.area ?? this.current!.id,
      description: spec.desc,
      observations: spec.obs,
      required: spec.required,
      hiddenUntil: spec.hiddenUntil,
      requires: spec.requires,
      item: spec.item,
      evidence: spec.ev,
      document: spec.doc,
      lock: spec.lock,
      openArt: spec.openArt,
      openText: spec.openText,
      hint: spec.hint,
      obscured: spec.obscured,
      opacity: spec.opacity,
      variant: spec.variant,
      exitTo: spec.exitTo,
    };
    this.objects.push(o);
    return o;
  }

  build() {
    return { id: this.id, areas: this.areas, objects: this.objects };
  }
}

/* ------------------------------------------------------------------ */
/* Shell presets                                                        */
/* ------------------------------------------------------------------ */

export function shell(s: Partial<ShellDefinition> & Pick<ShellDefinition, "wall" | "floor">): ShellDefinition {
  return {
    kind: "interior",
    wallColor: "#3a2f3a",
    accent: "#b8924a",
    floorColor: "#4a3020",
    darkness: 0.3,
    ...s,
  };
}

/* ------------------------------------------------------------------ */
/* Level assembly                                                       */
/* ------------------------------------------------------------------ */

const OPENABLE: ObjectCategory[] = ["container", "mechanism", "compartment", "puzzle", "exit"];

export interface LevelSpec {
  n: number;
  id: string;
  title: string;
  location: string;
  difficulty: Difficulty;
  description: string;
  briefing: string;
  objective: string;
  facts: string[];
  recall?: string[];
  carry?: { item: string; from: string }[];
  scene: ReturnType<SceneBuilder["build"]>;
  puzzles?: PuzzleDefinition[];
  recipes?: CombinationRecipe[];
  deductions?: DeductionPuzzle[];
  extra?: LevelCompletionRequirement[];
  summary: string;
  reveal: string;
  freeHints?: number;
}

function zoneText(r: Rect): string {
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  const h = cx < 333 ? "left" : cx > 666 ? "right" : "centre";
  const v = cy < 210 ? "high up" : cy > 430 ? "low, near the floor" : "at eye level";
  return h === "centre" ? `in the middle of the scene, ${v}` : `on the ${h} side, ${v}`;
}

export function deriveRequirements(spec: Pick<LevelSpec, "scene" | "puzzles" | "deductions" | "recipes" | "extra">): LevelCompletionRequirement[] {
  const reqs: LevelCompletionRequirement[] = [];
  for (const o of spec.scene.objects) {
    if (!o.required) continue;
    if (o.lock?.kind === "puzzle") continue; // covered by the puzzle's own requirement
    const kind = OPENABLE.includes(o.category) ? "open" : "find";
    reqs.push({ id: `req-${kind}-${o.id}`, kind, target: o.id, label: kind === "open" ? `Open the ${o.name.toLowerCase()}` : `Find the ${o.name.toLowerCase()}` });
  }
  for (const p of spec.puzzles ?? []) {
    reqs.push({ id: `req-solve-${p.id}`, kind: "solve", target: p.id, label: `Solve: ${p.title}` });
  }
  for (const r of spec.recipes ?? []) {
    reqs.push({ id: `req-combine-${r.id}`, kind: "combine", target: r.id, label: r.text.split(".")[0] });
  }
  for (const d of spec.deductions ?? []) {
    reqs.push({ id: `req-deduce-${d.id}`, kind: "deduce", target: d.id, label: `Deduce: ${d.title}` });
  }
  for (const e of spec.extra ?? []) reqs.push(e);
  return reqs;
}

export function deriveHints(spec: Pick<LevelSpec, "scene" | "puzzles" | "deductions" | "recipes">, itemName: (id: string) => string): HintDefinition[] {
  const hints: HintDefinition[] = [];
  for (const o of spec.scene.objects) {
    if (o.category === "collectible") continue;
    hints.push({
      id: `hint-obj-${o.id}`,
      kind: "object",
      target: o.id,
      tiers: [
        `Something worth a closer look is ${zoneText(o.box)}.`,
        o.hint ?? `Search carefully — look for the ${o.name.toLowerCase()}.`,
        `There — the ${o.name.toLowerCase()}. It's highlighted now.`,
      ],
    });
    if (o.lock?.kind === "item") {
      const iname = itemName(o.lock.item);
      hints.push({
        id: `hint-use-${o.id}`,
        kind: "item-use",
        target: o.id,
        tiers: [
          `Something you're carrying could open a way forward.`,
          `The ${o.name.toLowerCase()} looks like it needs the ${iname.toLowerCase()}.`,
          `Select the ${iname} in your inventory, then click the ${o.name.toLowerCase()}.`,
        ],
      });
    }
  }
  for (const p of spec.puzzles ?? []) {
    const answer =
      p.kind === "code" || p.kind === "cipher"
        ? p.answer
        : p.kind === "sequence"
          ? p.answer.map((a) => p.symbols.find((s) => s.id === a)?.label ?? a).join(" → ")
          : p.kind === "timeline"
            ? p.answer.map((a, i) => `${i + 1}. ${p.events.find((e) => e.id === a)?.text ?? a}`).join("  ")
            : p.kind === "choice"
              ? p.options.find((o) => o.id === p.answer)?.text ?? p.answer
              : "Restore every piece to its original position.";
    hints.push({
      id: `hint-puzzle-${p.id}`,
      kind: "puzzle",
      target: p.id,
      tiers: [`The ${p.title.toLowerCase()} can be solved with what you've found.`, p.hint, `Solution: ${answer}`],
    });
  }
  for (const r of spec.recipes ?? []) {
    hints.push({
      id: `hint-combine-${r.id}`,
      kind: "combine",
      target: r.id,
      tiers: [
        `Two of the things you carry belong together.`,
        `Try combining the ${itemName(r.inputs[0]).toLowerCase()} with something else.`,
        `Combine the ${itemName(r.inputs[0])} with the ${itemName(r.inputs[1])}.`,
      ],
    });
  }
  for (const d of spec.deductions ?? []) {
    hints.push({
      id: `hint-deduce-${d.id}`,
      kind: "deduction",
      target: d.id,
      tiers: [
        `You have enough evidence to draw a conclusion. Open the Deduction Board.`,
        d.hint,
        `Choose “${d.conclusions.find((c) => c.id === d.answer)?.text}” and support it with exactly ${d.evidence.length} pieces of evidence.`,
      ],
    });
  }
  return hints;
}

export function makeLevel(spec: LevelSpec, chapterId: string, itemName: (id: string) => string): LevelDefinition {
  return {
    id: spec.id,
    number: spec.n,
    chapterId,
    title: spec.title,
    location: spec.location,
    description: spec.description,
    difficulty: spec.difficulty,
    scene: spec.scene,
    briefing: spec.briefing,
    objective: spec.objective,
    knownFacts: spec.facts,
    recall: spec.recall ?? [],
    startingItems: spec.carry ?? [],
    puzzles: spec.puzzles ?? [],
    recipes: spec.recipes ?? [],
    deductions: spec.deductions ?? [],
    requirements: deriveRequirements(spec),
    hints: deriveHints(spec, itemName),
    prerequisites: [],
    summary: spec.summary,
    reveal: spec.reveal,
    freeHints: spec.freeHints ?? 3,
  };
}

/** Caesar-shift encode helper for authoring cipher puzzles. */
export function caesar(text: string, shift: number): string {
  return text.replace(/[A-Z]/gi, (ch) => {
    const base = ch <= "Z" ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + shift + 26 * 10) % 26) + base);
  });
}
