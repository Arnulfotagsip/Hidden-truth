/**
 * Core data model for CASE FILES: Hidden Truths.
 *
 * Everything that describes content (chapters, levels, scenes, objects,
 * puzzles, evidence) is static data. Everything that describes a player's
 * progress (flags, inventory, discoveries) is serialisable state.
 */

/** A progression flag such as `found:brass-key` or `solved:desk-code`. */
export type Flag = string;

export type Difficulty = 1 | 2 | 3 | 4 | 5;

/** Scene coordinates use a fixed 1000 × 625 (16:10) logical canvas. */
export const SCENE_WIDTH = 1000;
export const SCENE_HEIGHT = 625;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type HitRegion =
  | { kind: "rect"; x: number; y: number; w: number; h: number }
  | { kind: "circle"; cx: number; cy: number; r: number }
  | { kind: "poly"; points: [number, number][] };

/* ------------------------------------------------------------------ */
/* Art                                                                  */
/* ------------------------------------------------------------------ */

/** Keys into the sprite library (see src/game/art/sprites.tsx). */
export type ArtKey = string;

export interface DecorItem {
  art: ArtKey;
  x: number;
  y: number;
  w: number;
  h: number;
  tint?: string;
  rotate?: number;
  flip?: boolean;
  opacity?: number;
  /** Sprite state variant, e.g. "open" or "lit". */
  variant?: string;
}

export type WallPattern =
  | "damask"
  | "stripes"
  | "panels"
  | "brick"
  | "tiles"
  | "planks"
  | "concrete"
  | "metal"
  | "plaster"
  | "stone"
  | "ice"
  | "glass";

export type FloorPattern =
  | "boards"
  | "checker"
  | "carpet"
  | "concrete"
  | "tiles"
  | "cobbles"
  | "snow"
  | "stone"
  | "grate"
  | "asphalt";

export type ShellKind = "interior" | "exterior" | "train" | "tunnel";

export interface ShellDefinition {
  kind: ShellKind;
  wall: WallPattern;
  floor: FloorPattern;
  /** Main wall colour. */
  wallColor: string;
  /** Secondary/accent colour (patterns, trim). */
  accent: string;
  floorColor: string;
  /** Height of the horizon (where wall meets floor). Defaults to 440. */
  horizon?: number;
  weather?: "rain" | "snow" | "none";
  /** Ambient light pools (scene coords). */
  lights?: { x: number; y: number; r: number; color?: string; strength?: number }[];
  /** Overall darkness, 0 (bright) – 1 (very dark). */
  darkness?: number;
  /** Sky colour for exterior/train/tunnel windows. */
  sky?: "night" | "dusk" | "storm" | "snow" | "dawn";
}

export interface AreaDefinition {
  id: string;
  name: string;
  shell: ShellDefinition;
  decor: DecorItem[];
  /** Area becomes accessible only when these flags are set. */
  requires?: { flags: Flag[]; message: string };
}

/* ------------------------------------------------------------------ */
/* Evidence and items                                                   */
/* ------------------------------------------------------------------ */

export type EvidenceCategory =
  | "physical"
  | "document"
  | "photograph"
  | "testimony"
  | "record"
  | "environmental";

/** Inline evidence declaration attached to an object, puzzle or recipe. */
export interface EvidenceGrant {
  id: string;
  name?: string;
  description?: string;
  category: EvidenceCategory;
  significance: string;
  related?: string[];
}

export interface EvidenceItem {
  id: string;
  name: string;
  description: string;
  category: EvidenceCategory;
  significance: string;
  related: string[];
  levelId: string;
  chapterId: string;
  location: string;
  /** Readable text when the evidence is a document. */
  document?: DocumentContent;
}

export type ItemCategory =
  | "key"
  | "tool"
  | "document"
  | "component"
  | "fragment"
  | "card"
  | "device"
  | "artifact";

export interface InventoryItemDefinition {
  id: string;
  name: string;
  art: ArtKey;
  tint?: string;
  description: string;
  category: ItemCategory;
  /** Consumable items are removed when used on their target. */
  consumable: boolean;
  inspect?: string;
}

export interface DocumentContent {
  title: string;
  /** Paragraphs. */
  body: string[];
  style?: "typed" | "handwritten" | "telegram" | "ledger" | "newspaper" | "card";
  signature?: string;
}

/* ------------------------------------------------------------------ */
/* Interactive objects                                                  */
/* ------------------------------------------------------------------ */

export type ObjectCategory =
  | "evidence"
  | "collectible"
  | "item"
  | "environment"
  | "container"
  | "mechanism"
  | "document"
  | "puzzle"
  | "compartment"
  | "exit";

export type LockDefinition =
  | { kind: "item"; item: string; consumes?: boolean; lockedText: string }
  | { kind: "puzzle"; puzzle: string; lockedText?: string };

export interface InteractiveObject {
  id: string;
  name: string;
  category: ObjectCategory;
  art: ArtKey;
  tint?: string;
  box: Rect;
  rotate?: number;
  flip?: boolean;
  /** Explicit hit region; defaults to the visual box (with touch padding). */
  hit?: HitRegion;
  area: string;
  description: string;
  observations?: string[];
  /** Appears on the search list and is required for completion. */
  required?: boolean;
  /** Only visible once all flags are set (e.g. `opened:desk-drawer`). */
  hiddenUntil?: Flag[];
  /** Interaction prerequisites; explains what to investigate first. */
  requires?: { flags: Flag[]; message: string };
  /** Inventory item granted on collection / opening. */
  item?: string;
  evidence?: EvidenceGrant;
  document?: DocumentContent;
  lock?: LockDefinition;
  /** Art shown once opened (containers / mechanisms). */
  openArt?: ArtKey;
  openText?: string;
  /** Narrow hint text used by the hint system. */
  hint?: string;
  /** Rendered partly obscured (dust, frost, shadow). */
  obscured?: boolean;
  /** Visual opacity for small, subtle objects. */
  opacity?: number;
  /** Sprite variant while closed (e.g. clock hand positions). */
  variant?: string;
  /** Clicking moves the investigation to this area (doors, hatches). */
  exitTo?: string;
}

export interface SceneDefinition {
  id: string;
  areas: AreaDefinition[];
  objects: InteractiveObject[];
}

/* ------------------------------------------------------------------ */
/* Puzzles                                                              */
/* ------------------------------------------------------------------ */

interface PuzzleBase {
  id: string;
  title: string;
  prompt: string;
  /** Object ids (in this level) or evidence ids that contain the solution. */
  clueRefs: string[];
  hint: string;
  successText: string;
  reward?: { evidence?: EvidenceGrant; item?: string };
}

export interface CodePuzzle extends PuzzleBase {
  kind: "code";
  answer: string;
  charset: "digits" | "letters";
}

export interface CipherPuzzle extends PuzzleBase {
  kind: "cipher";
  cipherText: string;
  /** Caesar shift used to encode. The player decodes by shifting back. */
  shift: number;
  answer: string;
}

export interface SequenceSymbol {
  id: string;
  label: string;
  art?: ArtKey;
}

export interface SequencePuzzle extends PuzzleBase {
  kind: "sequence";
  symbols: SequenceSymbol[];
  answer: string[];
}

export interface ReconstructPuzzle extends PuzzleBase {
  kind: "reconstruct";
  picture: string;
  cols: number;
  rows: number;
  /** Initial tile order; tile i shows piece start[i]. */
  start: number[];
}

export interface TimelinePuzzle extends PuzzleBase {
  kind: "timeline";
  events: { id: string; text: string }[];
  answer: string[];
}

export interface ChoicePuzzle extends PuzzleBase {
  kind: "choice";
  question: string;
  options: { id: string; text: string }[];
  answer: string;
}

export type PuzzleDefinition =
  | CodePuzzle
  | CipherPuzzle
  | SequencePuzzle
  | ReconstructPuzzle
  | TimelinePuzzle
  | ChoicePuzzle;

/** A single step in a sequential puzzle (exposed for hinting/inspection). */
export interface PuzzleStep {
  puzzleId: string;
  index: number;
  description: string;
}

export interface DeductionPuzzle {
  id: string;
  title: string;
  question: string;
  conclusions: { id: string; text: string }[];
  answer: string;
  /** The exact set of evidence that supports the conclusion. */
  evidence: string[];
  hint: string;
  successText: string;
  wrongConclusionText?: string;
  /** Flags required before the deduction can be attempted. */
  requires?: Flag[];
  reward?: { evidence?: EvidenceGrant };
}

export interface CombinationRecipe {
  id: string;
  inputs: [string, string];
  output: string;
  text: string;
  evidence?: EvidenceGrant;
}

/** Derived from lock definitions; used for validation and hinting. */
export interface ObjectInteractionRule {
  itemId: string;
  targetId: string;
  consumes: boolean;
}

/* ------------------------------------------------------------------ */
/* Levels and chapters                                                  */
/* ------------------------------------------------------------------ */

export type RequirementKind = "find" | "open" | "solve" | "deduce" | "combine" | "visit";

export interface LevelCompletionRequirement {
  id: string;
  kind: RequirementKind;
  target: string;
  label: string;
}

/** An objective shown to the player; backed by one requirement. */
export type InvestigationObjective = LevelCompletionRequirement;

export interface HintDefinition {
  id: string;
  /** What the hint is about. */
  kind: "object" | "item-use" | "puzzle" | "combine" | "area" | "deduction";
  target: string;
  /** Tiered texts, weakest first. */
  tiers: string[];
}

export interface LevelDefinition {
  id: string;
  number: number;
  chapterId: string;
  title: string;
  location: string;
  description: string;
  difficulty: Difficulty;
  scene: SceneDefinition;
  briefing: string;
  objective: string;
  knownFacts: string[];
  /** Evidence from earlier levels the briefing should recall. */
  recall: string[];
  /** Items the detective carries in from an earlier level. */
  startingItems: { item: string; from: string }[];
  puzzles: PuzzleDefinition[];
  recipes: CombinationRecipe[];
  deductions: DeductionPuzzle[];
  requirements: LevelCompletionRequirement[];
  hints: HintDefinition[];
  prerequisites: string[];
  summary: string;
  /** Short story beat revealed on completion. */
  reveal: string;
  freeHints: number;
}

export interface ChapterDefinition {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  summary: string;
  /** Text shown when the chapter is complete. */
  closing: string;
  prerequisites: string[];
  accent: string;
}

/* ------------------------------------------------------------------ */
/* Player state                                                         */
/* ------------------------------------------------------------------ */

/** Per-level live state ("a run"). */
export interface InteractionProgress {
  levelId: string;
  flags: Flag[];
  inventory: string[];
  /** Evidence discovered during this run. */
  evidence: string[];
  area: string;
  hintsUsed: number;
  /** Hint tier reached per hint target. */
  hintTiers: Record<string, number>;
  lastHintAt: number | null;
  startedAt: number;
  mistakes: number;
}

export interface LevelRecord {
  completedAt: number;
  stars: number;
  hintsUsed: number;
  optionalFound: number;
  optionalTotal: number;
}

export interface PlayerSettings {
  sfx: boolean;
  music: boolean;
  sfxVolume: number;
  musicVolume: number;
  reducedMotion: "system" | "on" | "off";
  textSize: "normal" | "large";
  highContrast: boolean;
}

export interface PlayerProgress {
  version: number;
  createdAt: number;
  updatedAt: number;
  currentLevelId: string;
  unlockedLevels: string[];
  completed: Record<string, LevelRecord>;
  evidence: string[];
  solvedPuzzles: string[];
  collectibles: string[];
  runs: Record<string, InteractionProgress>;
  chapterSummariesSeen: string[];
  settings: PlayerSettings;
}

export interface CaseCompletionResult {
  levelId: string;
  stars: number;
  requiredFound: number;
  requiredTotal: number;
  optionalFound: number;
  optionalTotal: number;
  puzzlesSolved: number;
  hintsUsed: number;
  completeness: number;
  nextLevelId: string | null;
  chapterComplete: boolean;
}
