import type { PuzzleDefinition, ReconstructPuzzle } from "../types";

export type PuzzleAnswer = string | string[] | number[];

export function normalizeText(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function caesarShift(text: string, shift: number): string {
  return text.replace(/[A-Z]/gi, (ch) => {
    const base = ch <= "Z" ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + shift + 260) % 26) + base);
  });
}

export function isPermutation(arr: readonly number[], n: number): boolean {
  if (arr.length !== n) return false;
  const seen = new Set(arr);
  return seen.size === n && arr.every((v) => Number.isInteger(v) && v >= 0 && v < n);
}

export function isSolvedArrangement(p: ReconstructPuzzle, arrangement: readonly number[]): boolean {
  const n = p.cols * p.rows;
  return isPermutation(arrangement, n) && arrangement.every((v, i) => v === i);
}

const WRONG: Record<PuzzleDefinition["kind"], string> = {
  code: "The mechanism doesn't budge. That isn't the right combination.",
  cipher: "That doesn't read as a sensible message yet.",
  sequence: "The mechanism clicks back to its starting position. Wrong order.",
  reconstruct: "The pieces don't line up yet.",
  timeline: "That order contradicts the evidence. Check the times again.",
  choice: "That doesn't fit the evidence you've gathered.",
};

/** Validates an answer. Deterministic, no side effects. */
export function checkPuzzleAnswer(p: PuzzleDefinition, answer: PuzzleAnswer): { correct: boolean; message: string } {
  let correct = false;
  switch (p.kind) {
    case "code":
    case "cipher":
      correct = typeof answer === "string" && normalizeText(answer) === normalizeText(p.answer);
      break;
    case "choice":
      correct = typeof answer === "string" && answer === p.answer;
      break;
    case "sequence":
    case "timeline":
      correct =
        Array.isArray(answer) &&
        answer.length === p.answer.length &&
        answer.every((a, i) => String(a) === p.answer[i]);
      break;
    case "reconstruct":
      correct = Array.isArray(answer) && isSolvedArrangement(p, answer.map(Number));
      break;
  }
  return { correct, message: correct ? p.successText : WRONG[p.kind] };
}

/** The answer the solver/test harness submits for a puzzle. */
export function canonicalAnswer(p: PuzzleDefinition): PuzzleAnswer {
  switch (p.kind) {
    case "code":
    case "cipher":
      return p.answer;
    case "choice":
      return p.answer;
    case "sequence":
    case "timeline":
      return [...p.answer];
    case "reconstruct":
      return Array.from({ length: p.cols * p.rows }, (_, i) => i);
  }
}
