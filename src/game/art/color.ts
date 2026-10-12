/** Small colour helpers used by the procedural SVG art. */

function clamp(n: number, lo = 0, hi = 255) {
  return Math.max(lo, Math.min(hi, n));
}

function parse(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return [128, 128, 128];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex([r, g, b]: [number, number, number]) {
  return (
    "#" +
    [r, g, b]
      .map((v) => clamp(Math.round(v)).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Lighten (positive) or darken (negative) a colour by `amount` in [-1, 1]. */
export function shade(hex: string, amount: number): string {
  const rgb = parse(hex);
  const target = amount < 0 ? 0 : 255;
  const a = Math.abs(amount);
  return toHex([
    rgb[0] + (target - rgb[0]) * a,
    rgb[1] + (target - rgb[1]) * a,
    rgb[2] + (target - rgb[2]) * a,
  ]);
}

/** Mix two colours. t = 0 → a, t = 1 → b. */
export function mix(a: string, b: string, t: number): string {
  const x = parse(a);
  const y = parse(b);
  return toHex([
    x[0] + (y[0] - x[0]) * t,
    x[1] + (y[1] - x[1]) * t,
    x[2] + (y[2] - x[2]) * t,
  ]);
}

/** Deterministic pseudo-random generator (mulberry32). */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Shared palette. */
export const C = {
  ink: "#14161f",
  navy: "#1b2235",
  charcoal: "#24252b",
  burgundy: "#6b2430",
  cream: "#efe4cc",
  paper: "#e8dcc0",
  brass: "#b8924a",
  brassLight: "#e0c27a",
  wood: "#5a3a24",
  woodDark: "#3a2416",
  woodLight: "#8a5a36",
  steel: "#7b8492",
  glass: "#9fc3d1",
  leaf: "#3f5d3a",
  red: "#8e2f2f",
  ice: "#cfe6ef",
};
