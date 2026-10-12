import { memo } from "react";
import { FURNITURE, type SpriteDef } from "./sprites-furniture";
import { OBJECTS } from "./sprites-objects";

export type { SpriteDef };

export const SPRITES: Record<string, SpriteDef> = { ...FURNITURE, ...OBJECTS };

export function hasSprite(key: string): boolean {
  return key in SPRITES;
}

/** Placeholder art used if a sprite key is ever missing: a labelled evidence tag. */
const FALLBACK: SpriteDef = {
  vb: [40, 40],
  tint: "#efe4cc",
  draw: (t) => (
    <g>
      <rect x="2" y="2" width="36" height="36" rx="4" fill={t} stroke="#6b2430" strokeWidth="2" />
      <text x="20" y="26" fontSize="18" textAnchor="middle" fill="#6b2430" fontFamily="serif">?</text>
    </g>
  ),
};

export function getSprite(key: string): SpriteDef {
  return SPRITES[key] ?? FALLBACK;
}

export interface SpriteProps {
  art: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tint?: string;
  variant?: string;
  rotate?: number;
  flip?: boolean;
  opacity?: number;
  className?: string;
}

/** Renders a sprite stretched into the given box (scene coordinates). */
export const Sprite = memo(function Sprite({ art, x, y, w, h, tint, variant, rotate, flip, opacity, className }: SpriteProps) {
  const def = getSprite(art);
  const [vw, vh] = def.vb;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const transforms: string[] = [];
  if (rotate) transforms.push(`rotate(${rotate} ${cx} ${cy})`);
  if (flip) transforms.push(`translate(${cx * 2} 0) scale(-1 1)`);
  return (
    <g transform={transforms.length ? transforms.join(" ") : undefined} opacity={opacity} className={className}>
      <svg x={x} y={y} width={w} height={h} viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="none" overflow="visible">
        {def.draw(tint ?? def.tint, variant)}
      </svg>
    </g>
  );
});

/** Stand-alone icon for inventory slots, evidence cards, etc. */
export function SpriteIcon({ art, tint, variant, size = 48, title }: { art: string; tint?: string; variant?: string; size?: number; title?: string }) {
  const def = getSprite(art);
  const [vw, vh] = def.vb;
  const pad = Math.max(vw, vh) * 0.12;
  const side = Math.max(vw, vh) + pad * 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`${(vw - side) / 2} ${(vh - side) / 2} ${side} ${side}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {def.draw(tint ?? def.tint, variant)}
    </svg>
  );
}
