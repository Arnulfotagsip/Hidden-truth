/* eslint-disable react/jsx-key */
import type { ReactNode } from "react";
import { C, seeded, shade } from "./color";

export interface SpriteDef {
  /** Native viewBox width/height. Sprites stretch to their placement box. */
  vb: [number, number];
  tint: string;
  draw: (t: string, variant?: string) => ReactNode;
  /** Fractions of height where small objects can rest (top surfaces). */
  surfaces?: number[];
}

const BOOK_COLORS = ["#6b2430", "#2c3e5c", "#3f5d3a", "#7a5a2a", "#4a2f4f", "#8c6d3f", "#283a3a", "#5d2a1f", "#2f2f45"];

function books(x: number, y: number, w: number, h: number, seed: number): ReactNode[] {
  const r = seeded(seed);
  const out: ReactNode[] = [];
  let cx = x + 1;
  let i = 0;
  while (cx < x + w - 4) {
    const bw = 4 + Math.floor(r() * 5);
    const bh = h * (0.62 + r() * 0.36);
    if (cx + bw > x + w - 1) break;
    const col = BOOK_COLORS[Math.floor(r() * BOOK_COLORS.length)];
    const lean = r() > 0.93 && i > 2;
    out.push(
      <g key={`b${seed}-${i}`} transform={lean ? `rotate(-12 ${cx} ${y + h})` : undefined}>
        <rect x={cx} y={y + h - bh} width={bw} height={bh} fill={col} />
        <rect x={cx} y={y + h - bh + 3} width={bw} height={1.2} fill={C.brass} opacity={0.6} />
        <rect x={cx + bw - 1} y={y + h - bh} width={1} height={bh} fill="#000" opacity={0.25} />
      </g>,
    );
    cx += bw + (r() > 0.85 ? 3 : 0.4);
    i++;
  }
  return out;
}

export const FURNITURE: Record<string, SpriteDef> = {
  bookshelf: {
    vb: [100, 180],
    tint: C.wood,
    surfaces: [0.25, 0.48, 0.71, 0.94],
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="100" height="180" fill={shade(t, -0.25)} />
        <rect x="4" y="6" width="92" height="170" fill={shade(t, -0.6)} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            {books(5, 8 + i * 41.5, 90, 36, (v ? v.length : 7) * 31 + i * 13)}
            <rect x="0" y={44 + i * 41.5} width="100" height="5" fill={shade(t, 0.1)} />
          </g>
        ))}
        <rect x="0" y="0" width="100" height="7" fill={shade(t, 0.15)} />
        <rect x="0" y="0" width="4" height="180" fill={shade(t, -0.05)} />
        <rect x="96" y="0" width="4" height="180" fill={shade(t, -0.35)} />
      </g>
    ),
  },
  desk: {
    vb: [200, 100],
    tint: C.wood,
    surfaces: [0.08],
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="200" height="10" rx="2" fill={shade(t, 0.15)} />
        <rect x="0" y="9" width="200" height="3" fill={shade(t, -0.4)} />
        <rect x="6" y="12" width="56" height="88" fill={shade(t, -0.1)} />
        <rect x="138" y="12" width="56" height="88" fill={shade(t, -0.1)} />
        <rect x="62" y="12" width="76" height="20" fill={shade(t, -0.2)} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="10" y={16 + i * 28} width="48" height="24" fill={shade(t, 0.02)} stroke={shade(t, -0.4)} strokeWidth="1" />
            <rect x="29" y={26 + i * 28} width="10" height="3" rx="1.5" fill="url(#g-brass)" />
            <rect x="142" y={16 + i * 28} width="48" height="24" fill={shade(t, 0.02)} stroke={shade(t, -0.4)} strokeWidth="1" />
            <rect x="161" y={26 + i * 28} width="10" height="3" rx="1.5" fill="url(#g-brass)" />
          </g>
        ))}
        <rect x="62" y="32" width="76" height="68" fill="#000" opacity="0.35" />
      </g>
    ),
  },
  table: {
    vb: [160, 80],
    tint: C.wood,
    surfaces: [0.1],
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="160" height="9" rx="2" fill={shade(t, 0.12)} />
        <rect x="4" y="9" width="152" height="8" fill={shade(t, -0.25)} />
        <rect x="10" y="17" width="8" height="63" fill={shade(t, -0.15)} />
        <rect x="142" y="17" width="8" height="63" fill={shade(t, -0.15)} />
        <rect x="18" y="17" width="3" height="63" fill="#000" opacity="0.2" />
      </g>
    ),
  },
  "table-cloth": {
    vb: [200, 90],
    tint: "#d8ccb0",
    surfaces: [0.08],
    draw: (t) => (
      <g>
        <rect x="16" y="20" width="8" height="70" fill={C.woodDark} />
        <rect x="176" y="20" width="8" height="70" fill={C.woodDark} />
        <path d="M0 4 Q100 0 200 4 L196 44 Q180 50 166 44 Q150 52 134 44 Q118 52 100 44 Q82 52 66 44 Q50 52 34 44 Q18 52 4 44 Z" fill={t} />
        <path d="M0 4 Q100 0 200 4 L200 9 L0 9 Z" fill={shade(t, 0.2)} />
        <path d="M4 44 Q18 52 34 44 Q50 52 66 44 Q82 52 100 44 Q118 52 134 44 Q150 52 166 44 Q180 50 196 44" fill="none" stroke={shade(t, -0.25)} strokeWidth="1.5" />
      </g>
    ),
  },
  chair: {
    vb: [60, 100],
    tint: C.wood,
    draw: (t) => (
      <g>
        <rect x="8" y="0" width="44" height="52" rx="4" fill={shade(t, -0.05)} />
        <rect x="14" y="6" width="32" height="40" rx="3" fill={C.burgundy} />
        <rect x="4" y="52" width="52" height="10" rx="2" fill={shade(t, 0.1)} />
        <rect x="8" y="62" width="5" height="38" fill={shade(t, -0.2)} />
        <rect x="47" y="62" width="5" height="38" fill={shade(t, -0.2)} />
      </g>
    ),
  },
  armchair: {
    vb: [100, 100],
    tint: C.burgundy,
    draw: (t) => (
      <g>
        <path d="M14 10 Q50 -4 86 10 L86 60 L14 60 Z" fill={shade(t, -0.1)} />
        <path d="M22 16 Q50 6 78 16 L78 58 L22 58 Z" fill={shade(t, 0.05)} />
        {[30, 50, 70].map((x) => (
          <circle key={x} cx={x} cy="30" r="1.6" fill={shade(t, -0.4)} />
        ))}
        <rect x="16" y="56" width="68" height="18" rx="5" fill={shade(t, 0.12)} />
        <rect x="2" y="40" width="20" height="42" rx="8" fill={shade(t, -0.05)} />
        <rect x="78" y="40" width="20" height="42" rx="8" fill={shade(t, -0.05)} />
        <rect x="10" y="80" width="80" height="10" fill={shade(t, -0.3)} />
        <rect x="12" y="90" width="6" height="10" fill={C.woodDark} />
        <rect x="82" y="90" width="6" height="10" fill={C.woodDark} />
      </g>
    ),
  },
  sofa: {
    vb: [200, 90],
    tint: "#2d3d4f",
    draw: (t) => (
      <g>
        <rect x="14" y="4" width="172" height="46" rx="10" fill={shade(t, -0.05)} />
        <rect x="20" y="44" width="160" height="20" rx="6" fill={shade(t, 0.12)} />
        <line x1="100" y1="46" x2="100" y2="62" stroke={shade(t, -0.3)} />
        <rect x="0" y="30" width="26" height="46" rx="10" fill={shade(t, -0.02)} />
        <rect x="174" y="30" width="26" height="46" rx="10" fill={shade(t, -0.02)} />
        <rect x="10" y="74" width="180" height="8" fill={shade(t, -0.35)} />
        <rect x="16" y="82" width="6" height="8" fill={C.woodDark} />
        <rect x="178" y="82" width="6" height="8" fill={C.woodDark} />
      </g>
    ),
  },
  fireplace: {
    vb: [160, 150],
    tint: "#6d6257",
    surfaces: [0.13],
    draw: (t, v) => (
      <g>
        <rect x="0" y="12" width="160" height="138" fill={shade(t, -0.05)} />
        <rect x="-6" y="4" width="172" height="14" rx="2" fill={shade(t, 0.18)} />
        <rect x="10" y="18" width="10" height="132" fill={shade(t, 0.08)} />
        <rect x="140" y="18" width="10" height="132" fill={shade(t, 0.08)} />
        <path d="M34 150 L34 70 Q80 36 126 70 L126 150 Z" fill="#120c0a" />
        {v === "lit" ? (
          <g>
            <ellipse cx="80" cy="128" rx="44" ry="34" fill="url(#g-fire)" />
            <path d="M60 140 Q66 110 74 124 Q78 96 86 120 Q94 104 98 140 Z" fill="#ffcf6a" opacity="0.85" />
          </g>
        ) : (
          <g>
            <ellipse cx="80" cy="142" rx="34" ry="6" fill="#3a3632" />
            <rect x="56" y="134" width="48" height="6" rx="3" fill="#2a1d14" transform="rotate(-6 80 137)" />
          </g>
        )}
        <rect x="40" y="140" width="80" height="4" fill={C.ink} />
      </g>
    ),
  },
  window: {
    vb: [100, 140],
    tint: "#3b2a1e",
    draw: (t, v) => {
      const sky = v === "snow" ? "url(#g-sky-snow)" : v === "dusk" ? "url(#g-sky-dusk)" : v === "dawn" ? "url(#g-sky-dawn)" : "url(#g-sky-night)";
      return (
        <g>
          <rect x="0" y="0" width="100" height="140" fill={shade(t, 0.05)} />
          <rect x="7" y="7" width="86" height="120" fill={sky} />
          {v !== "snow" && v !== "dawn" && <circle cx="70" cy="30" r="9" fill="url(#g-moon)" opacity="0.9" />}
          <path d="M7 100 L22 84 L34 92 L50 76 L64 90 L80 80 L93 92 L93 127 L7 127 Z" fill="#0c0f18" opacity="0.8" />
          {v === "rain" && (
            <g stroke="#a9c1d6" strokeWidth="0.8" opacity="0.5">
              {Array.from({ length: 14 }).map((_, i) => (
                <line key={i} x1={10 + i * 6} y1={10 + (i % 3) * 20} x2={7 + i * 6} y2={22 + (i % 3) * 20} />
              ))}
            </g>
          )}
          {v === "snow" && (
            <g fill="#fff" opacity="0.8">
              {Array.from({ length: 16 }).map((_, i) => (
                <circle key={i} cx={10 + ((i * 37) % 80)} cy={12 + ((i * 53) % 100)} r="1.2" />
              ))}
              <path d="M7 118 Q50 108 93 118 L93 127 L7 127 Z" fill="#e8f2f6" />
            </g>
          )}
          <rect x="47" y="7" width="6" height="120" fill={t} />
          <rect x="7" y="62" width="86" height="5" fill={t} />
          <rect x="7" y="7" width="86" height="120" fill="url(#g-glass)" />
          <rect x="-4" y="126" width="108" height="8" fill={shade(t, 0.2)} />
        </g>
      );
    },
  },
  curtain: {
    vb: [60, 200],
    tint: C.burgundy,
    draw: (t) => (
      <g>
        <path d="M0 0 L60 0 L56 200 L0 200 Z" fill={shade(t, -0.05)} />
        {[10, 22, 34, 46].map((x) => (
          <path key={x} d={`M${x} 0 Q${x + 4} 100 ${x - 2} 200`} stroke={shade(t, -0.35)} strokeWidth="3" fill="none" />
        ))}
        <rect x="0" y="0" width="60" height="8" fill={shade(t, 0.15)} />
      </g>
    ),
  },
  door: {
    vb: [80, 170],
    tint: "#4a2f1d",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="80" height="170" fill={shade(t, -0.35)} />
        {v === "open" ? (
          <g>
            <rect x="5" y="5" width="70" height="165" fill="#07080c" />
            <path d="M5 5 L22 12 L22 163 L5 170 Z" fill={shade(t, 0.05)} />
          </g>
        ) : (
          <g>
            <rect x="5" y="5" width="70" height="165" fill={t} />
            <rect x="13" y="14" width="54" height="56" fill={shade(t, -0.12)} stroke={shade(t, 0.15)} />
            <rect x="13" y="82" width="54" height="76" fill={shade(t, -0.12)} stroke={shade(t, 0.15)} />
            <circle cx="64" cy="94" r="4" fill="url(#g-brass)" />
            <rect x="62" y="100" width="4" height="8" rx="1" fill={C.ink} />
          </g>
        )}
      </g>
    ),
  },
  "door-metal": {
    vb: [80, 170],
    tint: "#59626e",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="80" height="170" fill={shade(t, -0.4)} />
        {v === "open" ? (
          <rect x="5" y="5" width="70" height="165" fill="#06070a" />
        ) : (
          <g>
            <rect x="5" y="5" width="70" height="165" fill={t} />
            <rect x="18" y="20" width="44" height="30" fill="#1b2a33" stroke={shade(t, 0.2)} />
            <rect x="18" y="20" width="44" height="30" fill="url(#g-glass)" />
            {[70, 110, 150].map((y) => (
              <line key={y} x1="5" y1={y} x2="75" y2={y} stroke={shade(t, -0.25)} />
            ))}
            <rect x="60" y="88" width="10" height="4" fill={C.steel} />
          </g>
        )}
      </g>
    ),
  },
  painting: {
    vb: [100, 80],
    tint: "#3f5d3a",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="100" height="80" fill="url(#g-brass)" />
        <rect x="6" y="6" width="88" height="68" fill="#2a2418" />
        <rect x="9" y="9" width="82" height="62" fill={shade(t, 0.3)} />
        <path d="M9 50 Q30 34 50 46 T91 40 L91 71 L9 71 Z" fill={t} />
        <path d="M9 60 Q40 52 91 62 L91 71 L9 71 Z" fill={shade(t, -0.3)} />
        <circle cx="72" cy="22" r="6" fill="#efe1b5" opacity="0.7" />
      </g>
    ),
  },
  portrait: {
    vb: [80, 100],
    tint: "#3a3f5a",
    draw: (t, v) =>
      v === "empty" ? (
        <g>
          <rect x="0" y="0" width="80" height="100" fill="#000" opacity="0.08" />
          <rect x="4" y="4" width="72" height="92" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="2" />
          <circle cx="40" cy="-4" r="2" fill="url(#g-silver)" />
        </g>
      ) : (
      <g>
        <rect x="0" y="0" width="80" height="100" rx="3" fill="url(#g-brass)" />
        <rect x="6" y="6" width="68" height="88" fill={shade(t, -0.2)} />
        <ellipse cx="40" cy="40" rx="13" ry="16" fill={v === "b" ? "#d6b79a" : "#c9a283"} />
        <path d={v === "b" ? "M26 36 Q40 14 54 36 Q54 26 40 22 Q26 26 26 36" : "M27 34 Q40 18 53 34 L53 28 Q40 16 27 28 Z"} fill={v === "b" ? "#5a3a24" : "#9a9a9a"} />
        <path d="M12 94 Q16 62 40 58 Q64 62 68 94 Z" fill={v === "b" ? C.burgundy : "#1d1d24"} />
        <path d="M34 60 L40 72 L46 60" fill="#ece3cf" />
        <rect x="26" y="84" width="28" height="7" fill="url(#g-brass)" opacity="0.9" />
      </g>
    ),
  },
  "coat-rack": {
    vb: [60, 180],
    tint: C.woodDark,
    draw: (t) => (
      <g>
        <rect x="27" y="10" width="6" height="160" fill={t} />
        <path d="M30 170 L8 180 M30 170 L52 180 M30 170 L30 180" stroke={t} strokeWidth="5" />
        <path d="M30 18 L10 8 M30 18 L50 8 M30 30 L14 24 M30 30 L46 24" stroke="url(#g-brass)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="30" cy="8" r="5" fill="url(#g-brass)" />
      </g>
    ),
  },
  gate: {
    vb: [240, 200],
    tint: "#1d1f22",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="22" height="200" fill="#4a4540" />
        <rect x="218" y="0" width="22" height="200" fill="#4a4540" />
        <rect x="-4" y="-6" width="30" height="10" fill="#5a544c" />
        <rect x="214" y="-6" width="30" height="10" fill="#5a544c" />
        {v === "open" ? (
          <g stroke={t} strokeWidth="4">
            {[30, 42, 54].map((x) => (
              <line key={x} x1={x} y1="20" x2={x} y2="196" />
            ))}
            <line x1="26" y1="40" x2="60" y2="40" />
            <line x1="26" y1="170" x2="60" y2="170" />
          </g>
        ) : (
          <g stroke={t} strokeWidth="4">
            {Array.from({ length: 16 }).map((_, i) => (
              <g key={i}>
                <line x1={30 + i * 12} y1="20" x2={30 + i * 12} y2="196" />
                <path d={`M${26 + i * 12} 22 L${30 + i * 12} 10 L${34 + i * 12} 22`} fill={t} stroke="none" />
              </g>
            ))}
            <line x1="22" y1="40" x2="218" y2="40" />
            <line x1="22" y1="170" x2="218" y2="170" />
            <circle cx="120" cy="105" r="16" fill="none" />
          </g>
        )}
      </g>
    ),
  },
  "roll-door": {
    vb: [120, 160],
    tint: "#6c747e",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="120" height="160" fill={shade(t, -0.4)} />
        {v === "open" ? (
          <g>
            <rect x="6" y="40" width="108" height="120" fill="#08090b" />
            <rect x="6" y="6" width="108" height="34" fill={t} />
            {[12, 20, 28].map((y) => (
              <line key={y} x1="6" y1={y} x2="114" y2={y} stroke={shade(t, -0.3)} />
            ))}
          </g>
        ) : (
          <g>
            <rect x="6" y="6" width="108" height="154" fill={t} />
            {Array.from({ length: 18 }).map((_, i) => (
              <line key={i} x1="6" y1={14 + i * 8.4} x2="114" y2={14 + i * 8.4} stroke={shade(t, -0.25)} />
            ))}
            <rect x="50" y="146" width="20" height="8" fill="#2a2d31" />
          </g>
        )}
      </g>
    ),
  },
  mailboxes: {
    vb: [160, 100],
    tint: "#6d4a2c",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="160" height="100" fill={shade(t, -0.3)} />
        {Array.from({ length: 2 }).map((_, r) =>
          Array.from({ length: 4 }).map((__, c) => (
            <g key={`${r}${c}`}>
              <rect x={6 + c * 38} y={6 + r * 46} width="34" height="42" fill={t} />
              <rect x={12 + c * 38} y={12 + r * 46} width="22" height="5" fill="#1a120c" />
              <text x={23 + c * 38} y={36 + r * 46} fontSize="10" textAnchor="middle" fill="#e0c27a" fontFamily="serif">
                {r * 4 + c + 3}
              </text>
              <circle cx={23 + c * 38} cy={42 + r * 46} r="2" fill="url(#g-brass)" />
            </g>
          )),
        )}
      </g>
    ),
  },
  "pigeon-loft": {
    vb: [160, 140],
    tint: "#6a5a44",
    draw: (t) => (
      <g>
        <path d="M0 40 L80 0 L160 40 Z" fill={shade(t, -0.3)} />
        <rect x="6" y="40" width="148" height="100" fill={t} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={18 + i * 46} y="56" width="34" height="30" fill="#1a1612" />
            <rect x={14 + i * 46} y="86" width="42" height="5" fill={shade(t, 0.15)} />
          </g>
        ))}
        <rect x="56" y="100" width="48" height="40" fill={shade(t, -0.2)} />
      </g>
    ),
  },
  mirror: {
    vb: [70, 110],
    tint: "#b8924a",
    draw: () => (
      <g>
        <ellipse cx="35" cy="55" rx="35" ry="55" fill="url(#g-brass)" />
        <ellipse cx="35" cy="55" rx="29" ry="48" fill="#5d7680" />
        <ellipse cx="35" cy="55" rx="29" ry="48" fill="url(#g-glass)" />
        <path d="M18 30 L30 20" stroke="#fff" strokeWidth="3" opacity="0.5" />
      </g>
    ),
  },
  rug: {
    vb: [200, 50],
    tint: C.burgundy,
    draw: (t) => (
      <g>
        <ellipse cx="100" cy="25" rx="100" ry="25" fill={shade(t, -0.15)} />
        <ellipse cx="100" cy="25" rx="88" ry="20" fill={t} />
        <ellipse cx="100" cy="25" rx="70" ry="14" fill="none" stroke={C.brass} strokeWidth="2" opacity="0.6" />
        <ellipse cx="100" cy="25" rx="30" ry="6" fill={shade(t, -0.25)} />
      </g>
    ),
  },
  "rug-rect": {
    vb: [200, 50],
    tint: "#3b3550",
    draw: (t) => (
      <g>
        <path d="M20 0 L180 0 L200 50 L0 50 Z" fill={shade(t, -0.1)} />
        <path d="M30 5 L170 5 L186 45 L14 45 Z" fill={t} stroke={C.brass} strokeOpacity="0.5" />
        <path d="M60 15 L140 15 L150 35 L50 35 Z" fill="none" stroke={shade(t, 0.3)} />
      </g>
    ),
  },
  "lamp-desk": {
    vb: [40, 50],
    tint: "#2f5b40",
    draw: (t, v) => (
      <g>
        {v !== "off" && <ellipse cx="20" cy="30" rx="30" ry="22" fill="url(#g-glow)" />}
        <rect x="18" y="16" width="4" height="28" fill="url(#g-brass)" />
        <path d="M2 18 Q20 2 38 18 Z" fill={t} />
        <path d="M2 18 L38 18" stroke={C.brass} strokeWidth="2" />
        <rect x="8" y="44" width="24" height="6" rx="2" fill="url(#g-brass)" />
      </g>
    ),
  },
  "lamp-floor": {
    vb: [50, 170],
    tint: "#d8c39a",
    draw: (t, v) => (
      <g>
        {v !== "off" && <ellipse cx="25" cy="30" rx="50" ry="45" fill="url(#g-glow)" />}
        <path d="M6 40 L14 4 L36 4 L44 40 Z" fill={t} />
        <path d="M6 40 L44 40" stroke={shade(t, -0.3)} strokeWidth="2" />
        <rect x="23" y="40" width="4" height="120" fill="url(#g-brass)" />
        <ellipse cx="25" cy="164" rx="16" ry="5" fill="url(#g-brass)" />
      </g>
    ),
  },
  chandelier: {
    vb: [120, 80],
    tint: "#b8924a",
    draw: () => (
      <g>
        <ellipse cx="60" cy="50" rx="70" ry="40" fill="url(#g-glow)" opacity="0.6" />
        <rect x="58" y="0" width="4" height="30" fill="url(#g-brass)" />
        <path d="M10 46 Q60 70 110 46" stroke="url(#g-brass)" strokeWidth="4" fill="none" />
        {[10, 35, 60, 85, 110].map((x, i) => (
          <g key={x}>
            <rect x={x - 2} y={i === 2 ? 40 : 34} width="4" height="12" fill="#f3ead2" />
            <ellipse cx={x} cy={i === 2 ? 36 : 30} rx="2.5" ry="4" fill="#ffd47a" />
          </g>
        ))}
      </g>
    ),
  },
  "clock-grand": {
    vb: [50, 180],
    tint: C.wood,
    draw: (t, v) => (
      <g>
        <path d="M4 20 Q25 0 46 20 L46 180 L4 180 Z" fill={t} />
        <circle cx="25" cy="36" r="15" fill="#efe4cc" stroke="url(#g-brass)" strokeWidth="2.5" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={25 + Math.sin(a) * 12} cy={36 - Math.cos(a) * 12} r="0.9" fill={C.ink} />;
        })}
        {/* hands: variant like "h3m45" */}
        {(() => {
          const m = /h(\d+)m(\d+)/.exec(v ?? "h10m10");
          const hh = m ? Number(m[1]) : 10;
          const mm = m ? Number(m[2]) : 10;
          const ha = ((hh % 12) + mm / 60) / 12 * Math.PI * 2;
          const ma = (mm / 60) * Math.PI * 2;
          return (
            <g stroke={C.ink} strokeLinecap="round">
              <line x1="25" y1="36" x2={25 + Math.sin(ha) * 7} y2={36 - Math.cos(ha) * 7} strokeWidth="1.8" />
              <line x1="25" y1="36" x2={25 + Math.sin(ma) * 11} y2={36 - Math.cos(ma) * 11} strokeWidth="1.1" />
            </g>
          );
        })()}
        <rect x="12" y="60" width="26" height="80" fill={shade(t, -0.4)} />
        <rect x="12" y="60" width="26" height="80" fill="url(#g-glass)" />
        <line x1="25" y1="62" x2="25" y2="116" stroke="url(#g-brass)" strokeWidth="1.5" />
        <circle cx="25" cy="120" r="6" fill="url(#g-brass)" />
        <rect x="0" y="168" width="50" height="12" fill={shade(t, -0.2)} />
      </g>
    ),
  },
  "clock-wall": {
    vb: [50, 50],
    tint: C.wood,
    draw: (t, v) => {
      const m = /h(\d+)m(\d+)/.exec(v ?? "h10m10");
      const hh = m ? Number(m[1]) : 10;
      const mm = m ? Number(m[2]) : 10;
      const ha = (((hh % 12) + mm / 60) / 12) * Math.PI * 2;
      const ma = (mm / 60) * Math.PI * 2;
      return (
        <g>
          <circle cx="25" cy="25" r="24" fill={t} />
          <circle cx="25" cy="25" r="20" fill="#efe4cc" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <rect key={i} x={24.4 + Math.sin(a) * 16} y={24 - Math.cos(a) * 16} width="1.2" height="2.4" fill={C.ink} />;
          })}
          <g stroke={C.ink} strokeLinecap="round">
            <line x1="25" y1="25" x2={25 + Math.sin(ha) * 9} y2={25 - Math.cos(ha) * 9} strokeWidth="2.2" />
            <line x1="25" y1="25" x2={25 + Math.sin(ma) * 15} y2={25 - Math.cos(ma) * 15} strokeWidth="1.3" />
          </g>
          <circle cx="25" cy="25" r="1.6" fill={C.burgundy} />
        </g>
      );
    },
  },
  bed: {
    vb: [200, 110],
    tint: C.wood,
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="16" height="110" rx="3" fill={t} />
        <rect x="184" y="30" width="16" height="80" rx="3" fill={t} />
        <rect x="10" y="50" width="180" height="34" rx="4" fill="#e9dfc8" />
        <rect x="60" y="44" width="134" height="44" rx="6" fill={C.burgundy} />
        <path d="M60 44 L194 44 L194 52 L60 52 Z" fill={shade(C.burgundy, 0.2)} />
        <rect x="18" y="36" width="40" height="20" rx="8" fill="#f2ead8" />
        <rect x="10" y="86" width="180" height="10" fill={shade(t, -0.25)} />
        <rect x="14" y="96" width="6" height="14" fill={shade(t, -0.35)} />
        <rect x="180" y="96" width="6" height="14" fill={shade(t, -0.35)} />
      </g>
    ),
  },
  wardrobe: {
    vb: [100, 180],
    tint: C.wood,
    surfaces: [0.02],
    draw: (t, v) => (
      <g>
        <rect x="-3" y="0" width="106" height="10" fill={shade(t, 0.15)} />
        <rect x="0" y="8" width="100" height="164" fill={shade(t, -0.15)} />
        {v === "open" ? (
          <g>
            <rect x="6" y="14" width="88" height="152" fill="#0d0907" />
            <line x1="8" y1="26" x2="92" y2="26" stroke={C.steel} strokeWidth="2" />
            <path d="M24 26 L18 90 L40 90 Z" fill="#3a3f5a" />
            <path d="M60 26 L52 100 L76 100 Z" fill="#5a3a3a" />
          </g>
        ) : (
          <g>
            <rect x="6" y="14" width="43" height="152" fill={t} />
            <rect x="51" y="14" width="43" height="152" fill={t} />
            <rect x="12" y="22" width="31" height="136" fill="none" stroke={shade(t, 0.2)} />
            <rect x="57" y="22" width="31" height="136" fill="none" stroke={shade(t, 0.2)} />
            <circle cx="45" cy="90" r="2.5" fill="url(#g-brass)" />
            <circle cx="55" cy="90" r="2.5" fill="url(#g-brass)" />
          </g>
        )}
        <rect x="4" y="172" width="8" height="8" fill={shade(t, -0.4)} />
        <rect x="88" y="172" width="8" height="8" fill={shade(t, -0.4)} />
      </g>
    ),
  },
  cabinet: {
    vb: [100, 120],
    tint: C.wood,
    surfaces: [0.06],
    draw: (t) => (
      <g>
        <rect x="-2" y="0" width="104" height="8" fill={shade(t, 0.15)} />
        <rect x="0" y="8" width="100" height="104" fill={shade(t, -0.12)} />
        <rect x="6" y="14" width="42" height="92" fill={t} stroke={shade(t, 0.2)} />
        <rect x="52" y="14" width="42" height="92" fill={t} stroke={shade(t, 0.2)} />
        <circle cx="44" cy="60" r="2.4" fill="url(#g-brass)" />
        <circle cx="56" cy="60" r="2.4" fill="url(#g-brass)" />
        <rect x="4" y="112" width="8" height="8" fill={shade(t, -0.4)} />
        <rect x="88" y="112" width="8" height="8" fill={shade(t, -0.4)} />
      </g>
    ),
  },
  sideboard: {
    vb: [180, 90],
    tint: C.wood,
    surfaces: [0.07],
    draw: (t) => (
      <g>
        <rect x="-3" y="0" width="186" height="8" rx="2" fill={shade(t, 0.15)} />
        <rect x="0" y="8" width="180" height="74" fill={shade(t, -0.1)} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={6 + i * 58} y="14" width="52" height="18" fill={t} stroke={shade(t, -0.35)} />
            <rect x={6 + i * 58} y="36" width="52" height="40" fill={t} stroke={shade(t, -0.35)} />
            <rect x={28 + i * 58} y="21" width="8" height="3" fill="url(#g-brass)" />
          </g>
        ))}
        <rect x="6" y="82" width="8" height="8" fill={shade(t, -0.4)} />
        <rect x="166" y="82" width="8" height="8" fill={shade(t, -0.4)} />
      </g>
    ),
  },
  filing: {
    vb: [60, 120],
    tint: "#5d6670",
    surfaces: [0.02],
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="60" height="120" fill={shade(t, -0.15)} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="4" y={4 + i * 29} width="52" height="26" fill={v === "open" && i === 1 ? "#121418" : t} stroke={shade(t, -0.4)} />
            {!(v === "open" && i === 1) && (
              <g>
                <rect x="22" y={9 + i * 29} width="16" height="7" fill="#e8dcc0" stroke={shade(t, -0.5)} strokeWidth="0.6" />
                <rect x="24" y={19 + i * 29} width="12" height="3" rx="1" fill={C.steel} />
              </g>
            )}
          </g>
        ))}
      </g>
    ),
  },
  "card-catalog": {
    vb: [120, 120],
    tint: "#6d4a2c",
    surfaces: [0.02],
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="120" height="110" fill={shade(t, -0.2)} />
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 4 }).map((__, c) => (
            <g key={`${r}-${c}`}>
              <rect x={4 + c * 29} y={4 + r * 21} width="25" height="18" fill={t} />
              <rect x={10 + c * 29} y={7 + r * 21} width="13" height="5" fill="#efe4cc" />
              <circle cx={16.5 + c * 29} cy={16 + r * 21} r="1.5" fill="url(#g-brass)" />
            </g>
          )),
        )}
        <rect x="4" y="110" width="8" height="10" fill={shade(t, -0.4)} />
        <rect x="108" y="110" width="8" height="10" fill={shade(t, -0.4)} />
      </g>
    ),
  },
  "shelf-wall": {
    vb: [160, 20],
    tint: C.wood,
    surfaces: [0.1],
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="160" height="7" fill={shade(t, 0.12)} />
        <path d="M14 7 L14 20 L28 7 Z" fill={shade(t, -0.2)} />
        <path d="M146 7 L146 20 L132 7 Z" fill={shade(t, -0.2)} />
      </g>
    ),
  },
  "shelves-metal": {
    vb: [140, 170],
    tint: "#6c747e",
    surfaces: [0.27, 0.55, 0.83],
    draw: (t, v) => {
      const r = seeded((v?.length ?? 3) * 17 + 5);
      return (
        <g>
          <rect x="0" y="0" width="5" height="170" fill={shade(t, -0.2)} />
          <rect x="135" y="0" width="5" height="170" fill={shade(t, -0.2)} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x="0" y={44 + i * 47.5 - 4} width="140" height="5" fill={t} />
              {i < 3 &&
                [0, 1, 2].map((k) => {
                  const w = 26 + r() * 14;
                  const h = 18 + r() * 18;
                  const x = 8 + k * 42 + r() * 6;
                  return r() > 0.25 ? (
                    <g key={k}>
                      <rect x={x} y={44 + i * 47.5 - 4 - h} width={w} height={h} fill={r() > 0.5 ? "#8a6a44" : "#a68a5e"} />
                      <rect x={x + 4} y={44 + i * 47.5 - 4 - h + 4} width={w * 0.5} height="5" fill="#efe4cc" opacity="0.8" />
                    </g>
                  ) : null;
                })}
            </g>
          ))}
        </g>
      );
    },
  },
  crate: {
    vb: [80, 70],
    tint: "#8a6a44",
    surfaces: [0.02],
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="80" height="70" fill={t} />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="0" y1={i * 17.5} x2="80" y2={i * 17.5} stroke={shade(t, -0.3)} strokeWidth="1.2" />
        ))}
        <path d="M0 0 L80 70 M80 0 L0 70" stroke={shade(t, -0.15)} strokeWidth="6" />
        <rect x="0" y="0" width="80" height="70" fill="none" stroke={shade(t, -0.35)} strokeWidth="4" />
        {v === "open" && <rect x="4" y="-10" width="72" height="14" fill={shade(t, 0.1)} transform="rotate(-10 4 0)" />}
        {v === "stamp" && <text x="40" y="44" fontSize="11" textAnchor="middle" fill={C.burgundy} fontFamily="serif" fontWeight="bold" opacity="0.85">FRAGILE</text>}
      </g>
    ),
  },
  "boxes-stack": {
    vb: [80, 90],
    tint: "#a68a5e",
    surfaces: [0.02],
    draw: (t) => (
      <g>
        <rect x="0" y="40" width="80" height="50" fill={t} stroke={shade(t, -0.3)} />
        <rect x="30" y="40" width="20" height="50" fill={shade(t, 0.1)} opacity="0.6" />
        <rect x="10" y="0" width="60" height="40" fill={shade(t, -0.08)} stroke={shade(t, -0.3)} />
        <rect x="32" y="0" width="16" height="40" fill={shade(t, 0.08)} opacity="0.6" />
        <rect x="14" y="56" width="20" height="10" fill="#efe4cc" opacity="0.8" />
      </g>
    ),
  },
  barrel: {
    vb: [60, 80],
    tint: "#6d4a2c",
    surfaces: [0.02],
    draw: (t) => (
      <g>
        <path d="M6 4 Q0 40 6 76 L54 76 Q60 40 54 4 Z" fill={t} />
        {[14, 26, 38, 48].map((x) => (
          <path key={x} d={`M${x} 4 Q${x - 2} 40 ${x} 76`} stroke={shade(t, -0.3)} fill="none" />
        ))}
        <rect x="2" y="16" width="56" height="5" fill={C.steel} />
        <rect x="2" y="58" width="56" height="5" fill={C.steel} />
        <ellipse cx="30" cy="4" rx="24" ry="4" fill={shade(t, 0.15)} />
      </g>
    ),
  },
  "wine-rack": {
    vb: [120, 160],
    tint: C.woodDark,
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="120" height="160" fill={shade(t, -0.2)} />
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 5 }).map((__, c) => {
            const empty = ((r * 5 + c) * 7 + (v?.length ?? 0)) % 9 === 0;
            return (
              <g key={`${r}${c}`}>
                <rect x={4 + c * 23} y={4 + r * 26} width="21" height="23" fill="#0c0807" stroke={t} strokeWidth="2" />
                {!empty && <circle cx={14.5 + c * 23} cy={15.5 + r * 26} r="7" fill={(r + c) % 3 === 0 ? "#2b3a2a" : "#3a1d24"} />}
                {!empty && <circle cx={14.5 + c * 23} cy={15.5 + r * 26} r="2.5" fill="url(#g-brass)" opacity="0.6" />}
              </g>
            );
          }),
        )}
      </g>
    ),
  },
  plant: {
    vb: [60, 100],
    tint: "#3f5d3a",
    draw: (t) => (
      <g>
        {[-40, -20, 0, 20, 40, -60, 60].map((a, i) => (
          <path key={i} d="M30 70 Q24 40 30 6" transform={`rotate(${a} 30 70)`} stroke={shade(t, i % 2 ? 0.15 : -0.05)} strokeWidth="7" strokeLinecap="round" fill="none" />
        ))}
        <path d="M14 66 L46 66 L42 100 L18 100 Z" fill="#7a4a30" />
        <rect x="12" y="64" width="36" height="6" fill="#8a5a3a" />
      </g>
    ),
  },
  "plant-dead": {
    vb: [60, 100],
    tint: "#6b5a3a",
    draw: (t) => (
      <g>
        {[-30, -10, 15, 35].map((a, i) => (
          <path key={i} d="M30 70 Q28 50 34 26 Q38 40 46 40" transform={`rotate(${a} 30 70)`} stroke={t} strokeWidth="2.5" fill="none" />
        ))}
        <path d="M14 66 L46 66 L42 100 L18 100 Z" fill="#5a4a3a" />
      </g>
    ),
  },
  safe: {
    vb: [70, 70],
    tint: "#3c434c",
    surfaces: [0.02],
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="70" height="66" rx="4" fill={shade(t, -0.2)} />
        {v === "open" ? (
          <g>
            <rect x="6" y="6" width="58" height="54" fill="#08090b" />
            <path d="M6 6 L-14 14 L-14 52 L6 60 Z" fill={t} />
          </g>
        ) : (
          <g>
            <rect x="6" y="6" width="58" height="54" rx="2" fill={t} />
            <circle cx="35" cy="33" r="13" fill="url(#g-silver)" />
            <circle cx="35" cy="33" r="8" fill={shade(t, -0.3)} />
            <line x1="35" y1="22" x2="35" y2="26" stroke="#fff" />
            <rect x="52" y="28" width="6" height="12" rx="2" fill="url(#g-silver)" />
          </g>
        )}
        <rect x="4" y="66" width="8" height="4" fill={C.ink} />
        <rect x="58" y="66" width="8" height="4" fill={C.ink} />
      </g>
    ),
  },
  "vault-door": {
    vb: [160, 160],
    tint: "#5a6068",
    draw: (t, v) => (
      <g>
        <circle cx="80" cy="80" r="80" fill={shade(t, -0.35)} />
        {v === "open" ? (
          <g>
            <circle cx="80" cy="80" r="70" fill="#050608" />
            <ellipse cx="18" cy="80" rx="22" ry="70" fill={t} />
          </g>
        ) : (
          <g>
            <circle cx="80" cy="80" r="70" fill="url(#g-steel)" />
            <circle cx="80" cy="80" r="58" fill="none" stroke={shade(t, -0.3)} strokeWidth="3" />
            {[0, 60, 120].map((a) => (
              <rect key={a} x="76" y="30" width="8" height="100" rx="3" fill="url(#g-silver)" transform={`rotate(${a} 80 80)`} />
            ))}
            <circle cx="80" cy="80" r="16" fill="url(#g-brass)" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return <circle key={i} cx={80 + Math.cos(a) * 66} cy={80 + Math.sin(a) * 66} r="3" fill={shade(t, 0.3)} />;
            })}
          </g>
        )}
      </g>
    ),
  },
  "lab-bench": {
    vb: [220, 90],
    tint: "#d7dbd8",
    surfaces: [0.08],
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="220" height="9" fill="#2a2d31" />
        <rect x="4" y="9" width="212" height="81" fill={t} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={10 + i * 52} y="16" width="46" height="66" fill={shade(t, -0.06)} stroke={shade(t, -0.25)} />
            <rect x={28 + i * 52} y="24" width="10" height="3" fill={C.steel} />
          </g>
        ))}
      </g>
    ),
  },
  flasks: {
    vb: [60, 50],
    tint: "#5fa58a",
    draw: (t) => (
      <g>
        <path d="M8 10 L16 10 L16 22 L24 46 L0 46 L8 22 Z" fill="url(#g-glass)" stroke="#cfe3ea" strokeWidth="0.8" />
        <path d="M3 38 L21 38 L24 46 L0 46 Z" fill={t} opacity="0.8" />
        <rect x="30" y="8" width="8" height="38" rx="3" fill="url(#g-glass)" stroke="#cfe3ea" strokeWidth="0.8" />
        <rect x="30" y="28" width="8" height="18" rx="3" fill="#b85a4a" opacity="0.8" />
        <circle cx="52" cy="36" r="9" fill="url(#g-glass)" stroke="#cfe3ea" strokeWidth="0.8" />
        <rect x="49" y="14" width="6" height="16" fill="url(#g-glass)" stroke="#cfe3ea" strokeWidth="0.8" />
        <path d="M43 38 A9 9 0 0 0 61 38 Z" fill="#c9b04a" opacity="0.8" />
      </g>
    ),
  },
  microscope: {
    vb: [40, 60],
    tint: "#2a2d31",
    draw: (t) => (
      <g>
        <rect x="4" y="52" width="32" height="8" rx="2" fill={t} />
        <path d="M24 52 L28 20 L22 18 L16 46 Z" fill={shade(t, 0.2)} />
        <rect x="14" y="4" width="8" height="26" rx="2" fill="url(#g-steel)" transform="rotate(-20 18 17)" />
        <rect x="8" y="38" width="22" height="4" fill="url(#g-silver)" />
      </g>
    ),
  },
  terminal: {
    vb: [80, 70],
    tint: "#bdb5a0",
    draw: (t, v) => (
      <g>
        <rect x="4" y="0" width="72" height="56" rx="6" fill={t} />
        <rect x="10" y="6" width="60" height="42" rx="4" fill={v === "off" ? "#1a1d1c" : "url(#g-screen)"} />
        {v !== "off" &&
          [0, 1, 2, 3].map((i) => (
            <rect key={i} x="15" y={12 + i * 8} width={20 + ((i * 13) % 30)} height="3" fill="#8fe0a8" opacity="0.8" />
          ))}
        <rect x="0" y="58" width="80" height="12" rx="2" fill={shade(t, -0.15)} />
      </g>
    ),
  },
  "control-panel": {
    vb: [120, 90],
    tint: "#4d5560",
    surfaces: [0.02],
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="120" height="90" rx="3" fill={t} />
        <rect x="8" y="8" width="104" height="30" fill="#14181c" />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={20 + i * 20} cy="23" r="5" fill={v === "on" ? (i % 2 ? "#e0a84a" : "#7ad08a") : "#3a3f46"} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={14 + i * 26} y="50" width="10" height="28" rx="2" fill="#1d2126" />
            <rect x={14 + i * 26} y={v === "on" ? 52 : 66} width="10" height="10" rx="2" fill="url(#g-silver)" />
          </g>
        ))}
      </g>
    ),
  },
  fusebox: {
    vb: [50, 70],
    tint: "#6c747e",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="50" height="70" rx="2" fill={shade(t, -0.25)} />
        {v === "open" ? (
          <g>
            <rect x="4" y="4" width="42" height="62" fill="#15181c" />
            {[0, 1, 2].map((i) => (
              <rect key={i} x="12" y={10 + i * 18} width="26" height="10" rx="3" fill={i === 1 ? "#2a2a2a" : "url(#g-brass)"} />
            ))}
          </g>
        ) : (
          <g>
            <rect x="4" y="4" width="42" height="62" fill={t} />
            <path d="M25 18 L18 36 L26 36 L22 52 L32 30 L24 30 Z" fill="#e0b84a" />
          </g>
        )}
      </g>
    ),
  },
  generator: {
    vb: [160, 110],
    tint: "#6a5a3a",
    surfaces: [0.05],
    draw: (t, v) => (
      <g>
        <rect x="0" y="96" width="160" height="14" fill="#2a2d31" />
        <rect x="10" y="20" width="110" height="76" rx="10" fill={t} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={20 + i * 16} y="28" width="8" height="60" rx="2" fill={shade(t, -0.25)} />
        ))}
        <circle cx="138" cy="58" r="20" fill="url(#g-steel)" />
        <circle cx="138" cy="58" r="6" fill={shade(t, -0.4)} />
        <rect x="40" y="6" width="50" height="14" rx="3" fill="url(#g-steel)" />
        <circle cx="100" cy="12" r="4" fill={v === "on" ? "#7ad08a" : "#7a2a2a"} />
      </g>
    ),
  },
  pipes: {
    vb: [200, 40],
    tint: "#7a6a5a",
    draw: (t) => (
      <g>
        <rect x="0" y="4" width="200" height="12" fill={t} />
        <rect x="0" y="24" width="200" height="8" fill={shade(t, -0.2)} />
        {[30, 100, 170].map((x) => (
          <rect key={x} x={x} y="1" width="8" height="18" fill={shade(t, 0.2)} />
        ))}
        <circle cx="64" cy="10" r="8" fill="#9a3a2a" />
        <rect x="62" y="0" width="4" height="10" fill="#9a3a2a" />
      </g>
    ),
  },
  corkboard: {
    vb: [140, 100],
    tint: "#a07a4e",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="140" height="100" fill={C.woodDark} />
        <rect x="5" y="5" width="130" height="90" fill={t} />
        <rect x="14" y="12" width="30" height="24" fill="#efe4cc" transform="rotate(-4 29 24)" />
        <rect x="56" y="10" width="28" height="34" fill="#d9d2c2" transform="rotate(3 70 27)" />
        <rect x="58" y="14" width="24" height="20" fill="#4a4a50" transform="rotate(3 70 24)" />
        <rect x="96" y="16" width="30" height="22" fill="#efe4cc" transform="rotate(5 111 27)" />
        <rect x="20" y="54" width="34" height="26" fill="#e8dcc0" transform="rotate(2 37 67)" />
        <rect x="88" y="56" width="32" height="28" fill="#efe4cc" transform="rotate(-3 104 70)" />
        {v !== "plain" && (
          <path d="M29 24 L70 27 L111 27 L104 70 L37 67 Z" fill="none" stroke="#b02a2a" strokeWidth="1.2" />
        )}
        {[[29, 13], [70, 11], [111, 17], [37, 55], [104, 57]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.2" fill="#b02a2a" />
        ))}
      </g>
    ),
  },
  blackboard: {
    vb: [160, 100],
    tint: "#2a3a32",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="160" height="100" fill={C.wood} />
        <rect x="6" y="6" width="148" height="84" fill={t} />
        <path d="M18 30 Q40 18 62 30 T110 26" stroke="#e8e8e0" strokeWidth="1.2" fill="none" opacity="0.6" />
        <circle cx="120" cy="56" r="16" fill="none" stroke="#e8e8e0" opacity="0.5" />
        <path d="M20 60 L70 60 M20 70 L56 70" stroke="#e8e8e0" opacity="0.5" />
        <rect x="6" y="90" width="148" height="6" fill={shade(C.wood, 0.2)} />
      </g>
    ),
  },
  typewriter: {
    vb: [60, 40],
    tint: "#2a2d31",
    draw: (t) => (
      <g>
        <rect x="12" y="0" width="34" height="14" fill="#efe4cc" />
        <rect x="4" y="12" width="52" height="8" rx="3" fill={shade(t, 0.15)} />
        <path d="M2 20 L58 20 L54 38 L6 38 Z" fill={t} />
        {[0, 1, 2].map((r) =>
          Array.from({ length: 8 }).map((_, c) => (
            <circle key={`${r}${c}`} cx={12 + c * 5 + r * 1.5} cy={25 + r * 4} r="1.4" fill="#d8d0bc" />
          )),
        )}
      </g>
    ),
  },
  radio: {
    vb: [60, 45],
    tint: "#6d4a2c",
    draw: (t) => (
      <g>
        <path d="M0 45 L0 14 Q30 -6 60 14 L60 45 Z" fill={t} />
        <path d="M6 40 L6 18 Q30 2 54 18 L54 40 Z" fill="#d8c39a" />
        {[10, 16, 22, 28, 34].map((y) => (
          <line key={y} x1="10" y1={y + 2} x2="50" y2={y + 2} stroke={shade(t, -0.3)} />
        ))}
        <circle cx="16" cy="40" r="3" fill="url(#g-brass)" />
        <circle cx="44" cy="40" r="3" fill="url(#g-brass)" />
      </g>
    ),
  },
  candelabra: {
    vb: [40, 60],
    tint: "#b8924a",
    draw: (_, v) => (
      <g>
        {v !== "off" && <ellipse cx="20" cy="10" rx="30" ry="24" fill="url(#g-glow)" />}
        <path d="M6 24 Q20 36 34 24" stroke="url(#g-brass)" strokeWidth="2.5" fill="none" />
        <rect x="18" y="20" width="4" height="34" fill="url(#g-brass)" />
        <ellipse cx="20" cy="56" rx="10" ry="4" fill="url(#g-brass)" />
        {[6, 20, 34].map((x) => (
          <g key={x}>
            <rect x={x - 2} y={x === 20 ? 6 : 12} width="4" height="12" fill="#f2ead2" />
            {v !== "off" && <ellipse cx={x} cy={x === 20 ? 3 : 9} rx="2" ry="3.5" fill="#ffc95a" />}
          </g>
        ))}
      </g>
    ),
  },
  trunk: {
    vb: [100, 60],
    tint: "#5a3a24",
    surfaces: [0.02],
    draw: (t, v) => (
      <g>
        {v === "open" ? (
          <g>
            <rect x="0" y="-26" width="100" height="26" rx="6" fill={shade(t, 0.1)} transform="rotate(-8 0 0)" />
            <rect x="0" y="10" width="100" height="50" rx="3" fill={t} />
            <rect x="4" y="10" width="92" height="12" fill="#120c08" />
          </g>
        ) : (
          <g>
            <path d="M0 22 Q0 0 50 0 Q100 0 100 22 Z" fill={shade(t, 0.1)} />
            <rect x="0" y="20" width="100" height="40" rx="3" fill={t} />
            <rect x="44" y="18" width="12" height="14" rx="2" fill="url(#g-brass)" />
          </g>
        )}
        <rect x="16" y="0" width="6" height="60" fill={shade(t, -0.35)} />
        <rect x="78" y="0" width="6" height="60" fill={shade(t, -0.35)} />
      </g>
    ),
  },
  ladder: {
    vb: [50, 180],
    tint: "#8a6a44",
    draw: (t) => (
      <g>
        <rect x="4" y="0" width="6" height="180" fill={t} />
        <rect x="40" y="0" width="6" height="180" fill={t} />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="4" y={12 + i * 22} width="42" height="5" fill={shade(t, -0.15)} />
        ))}
      </g>
    ),
  },
  staircase: {
    vb: [200, 250],
    tint: "#5a3a24",
    draw: (t) => (
      <g>
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={i * 18} y={250 - (i + 1) * 24} width={200 - i * 18} height="24" fill={shade(t, i % 2 ? -0.05 : 0.05)} stroke={shade(t, -0.4)} />
        ))}
        <path d="M0 230 L180 10" stroke={shade(t, 0.25)} strokeWidth="6" />
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={i * 20 + 4} y1={226 - i * 24.4} x2={i * 20 + 4} y2={250 - i * 24} stroke={shade(t, 0.1)} strokeWidth="3" />
        ))}
      </g>
    ),
  },
  piano: {
    vb: [180, 120],
    tint: "#15161b",
    surfaces: [0.02],
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="180" height="70" rx="3" fill={t} />
        <rect x="6" y="6" width="168" height="40" fill={shade(t, 0.08)} />
        <rect x="0" y="70" width="180" height="16" fill="#f2ead8" />
        {Array.from({ length: 30 }).map((_, i) => (
          <line key={i} x1={6 * i} y1="70" x2={6 * i} y2="86" stroke="#888" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 30 }).map((_, i) =>
          [1, 2, 4, 5, 6].includes(i % 7) ? <rect key={`k${i}`} x={6 * i - 2} y="70" width="4" height="9" fill={t} /> : null,
        )}
        <rect x="0" y="86" width="180" height="10" fill={t} />
        <rect x="10" y="96" width="8" height="24" fill={t} />
        <rect x="162" y="96" width="8" height="24" fill={t} />
      </g>
    ),
  },
  "bench-park": {
    vb: [160, 60],
    tint: "#3f4a3a",
    draw: (t) => (
      <g>
        {[0, 1, 2].map((i) => (
          <rect key={i} x="0" y={i * 9} width="160" height="6" fill={shade(t, 0.1)} />
        ))}
        <rect x="0" y="30" width="160" height="7" fill={t} />
        <rect x="10" y="0" width="5" height="60" fill="#1d1f22" />
        <rect x="145" y="0" width="5" height="60" fill="#1d1f22" />
      </g>
    ),
  },
  counter: {
    vb: [240, 100],
    tint: "#6d4a2c",
    surfaces: [0.07],
    draw: (t) => (
      <g>
        <rect x="-3" y="0" width="246" height="9" fill={shade(t, 0.18)} />
        <rect x="0" y="9" width="240" height="91" fill={t} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={8 + i * 58} y="18" width="50" height="74" fill="none" stroke={shade(t, -0.3)} strokeWidth="2" />
        ))}
      </g>
    ),
  },
  register: {
    vb: [60, 50],
    tint: "#b8924a",
    draw: () => (
      <g>
        <rect x="10" y="0" width="40" height="14" fill="#1d1f22" />
        <text x="30" y="11" fontSize="9" textAnchor="middle" fill="#e0c27a" fontFamily="monospace">0.00</text>
        <path d="M2 14 L58 14 L60 50 L0 50 Z" fill="url(#g-brass)" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3, 4].map((c) => <circle key={`${r}${c}`} cx={12 + c * 9} cy={22 + r * 8} r="2.5" fill="#efe4cc" />),
        )}
      </g>
    ),
  },
  streetlamp: {
    vb: [40, 260],
    tint: "#1d1f22",
    draw: (t) => (
      <g>
        <ellipse cx="20" cy="30" rx="60" ry="55" fill="url(#g-glow)" />
        <rect x="17" y="40" width="6" height="214" fill={t} />
        <rect x="10" y="250" width="20" height="10" fill={t} />
        <path d="M8 40 L32 40 L28 14 L12 14 Z" fill="#ffe6a8" opacity="0.9" />
        <path d="M6 14 L34 14 L20 2 Z" fill={t} />
        <rect x="6" y="38" width="28" height="4" fill={t} />
      </g>
    ),
  },
  "bus-stop": {
    vb: [140, 200],
    tint: "#2d3d4f",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="140" height="10" fill={t} />
        <rect x="4" y="10" width="5" height="190" fill={shade(t, -0.3)} />
        <rect x="131" y="10" width="5" height="190" fill={shade(t, -0.3)} />
        <rect x="9" y="14" width="122" height="120" fill="url(#g-glass)" />
        <rect x="14" y="140" width="112" height="7" fill={shade(t, 0.2)} />
        <rect x="20" y="147" width="4" height="30" fill={shade(t, -0.3)} />
        <rect x="116" y="147" width="4" height="30" fill={shade(t, -0.3)} />
        <rect x="90" y="24" width="34" height="46" fill="#efe4cc" />
        <text x="107" y="36" fontSize="7" textAnchor="middle" fill={C.ink} fontFamily="serif">ROUTE</text>
        <text x="107" y="52" fontSize="14" textAnchor="middle" fill={C.burgundy} fontFamily="serif" fontWeight="bold">7</text>
      </g>
    ),
  },
  "sign-post": {
    vb: [60, 200],
    tint: "#2d3d4f",
    draw: (t, v) => {
      // Variant text, lines separated by "|", e.g. "LARKSPUR|EAST GATE".
      const lines = (v ?? "NO ENTRY").split("|");
      return (
        <g>
          <rect x="27" y="20" width="6" height="180" fill="#1d1f22" />
          <rect x="0" y="0" width="60" height="44" rx="3" fill={t} stroke="#e0c27a" />
          {lines.map((l, i) => (
            <text key={i} x="30" y={22 - (lines.length - 1) * 5 + i * 10} fontSize={lines.length > 2 ? 7 : 8} textAnchor="middle" fill="#efe4cc" fontFamily="serif" letterSpacing="0.5">
              {l}
            </text>
          ))}
        </g>
      );
    },
  },
  "market-stall": {
    vb: [220, 180],
    tint: "#6b2430",
    surfaces: [0.62],
    draw: (t) => (
      <g>
        <rect x="8" y="30" width="6" height="150" fill="#2a1d14" />
        <rect x="206" y="30" width="6" height="150" fill="#2a1d14" />
        <path d="M0 0 L220 0 L220 34 L0 34 Z" fill={t} />
        {Array.from({ length: 11 }).map((_, i) => (
          <path key={i} d={`M${i * 20} 0 L${i * 20 + 10} 0 L${i * 20 + 10} 34 Q${i * 20 + 5} 42 ${i * 20} 34 Z`} fill={i % 2 ? "#efe4cc" : t} />
        ))}
        <rect x="0" y="110" width="220" height="70" fill="#5a3a24" />
        <rect x="0" y="106" width="220" height="8" fill="#7a5a34" />
        {[20, 70, 120, 170].map((x, i) => (
          <g key={x}>
            <rect x={x} y="90" width="36" height="18" fill={["#c45a2a", "#7a8a3a", "#c4a03a", "#8a3a4a"][i]} rx="4" />
          </g>
        ))}
        <ellipse cx="110" cy="50" rx="18" ry="16" fill="#ffd98a" opacity="0.6" />
      </g>
    ),
  },
  awning: {
    vb: [200, 50],
    tint: "#2c3e5c",
    draw: (t) => (
      <g>
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={i} d={`M${i * 20} 0 L${i * 20 + 20} 0 L${i * 20 + 20} 38 Q${i * 20 + 10} 50 ${i * 20} 38 Z`} fill={i % 2 ? "#d8ccb0" : t} />
        ))}
      </g>
    ),
  },
  "shop-front": {
    vb: [260, 260],
    tint: "#2c3e5c",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="260" height="260" fill={shade(t, -0.3)} />
        <rect x="10" y="10" width="240" height="36" fill={t} />
        <text x="130" y="35" fontSize="18" textAnchor="middle" fill="#e0c27a" fontFamily="serif" letterSpacing="3">{v ?? "GROCER"}</text>
        <rect x="16" y="60" width="140" height="130" fill="#ffd98a" opacity="0.35" />
        <rect x="16" y="60" width="140" height="130" fill="url(#g-glass)" />
        <line x1="86" y1="60" x2="86" y2="190" stroke={shade(t, -0.4)} strokeWidth="4" />
        <rect x="172" y="60" width="70" height="200" fill={shade(t, -0.1)} />
        <rect x="180" y="70" width="54" height="80" fill="url(#g-glass)" />
        <circle cx="230" cy="170" r="3" fill="url(#g-brass)" />
      </g>
    ),
  },
  building: {
    vb: [200, 300],
    tint: "#2a2730",
    draw: (t, v) => {
      const r = seeded((v?.length ?? 4) * 41 + 11);
      return (
        <g>
          <rect x="0" y="0" width="200" height="300" fill={t} />
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 4 }).map((__, col) => {
              const lit = r() > 0.65;
              return (
                <rect key={`${row}${col}`} x={18 + col * 46} y={20 + row * 46} width="28" height="30" fill={lit ? "#e8c46a" : "#141821"} opacity={lit ? 0.85 : 1} />
              );
            }),
          )}
          <rect x="0" y="0" width="200" height="8" fill={shade(t, 0.15)} />
        </g>
      );
    },
  },
  "fire-escape": {
    vb: [150, 250],
    tint: "#1d1f22",
    draw: (t) => (
      <g stroke={t} strokeWidth="3" fill="none">
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="0" y={20 + i * 80} width="150" height="6" fill={t} />
            {Array.from({ length: 8 }).map((_, k) => (
              <line key={k} x1={k * 20 + 5} y1={i * 80 - 10} x2={k * 20 + 5} y2={20 + i * 80} />
            ))}
            <line x1="0" y1={i * 80 - 10} x2="150" y2={i * 80 - 10} />
            <line x1="20" y1={26 + i * 80} x2="120" y2={100 + i * 80} />
          </g>
        ))}
      </g>
    ),
  },
  dumpster: {
    vb: [140, 90],
    tint: "#2f4a3a",
    surfaces: [0.08],
    draw: (t) => (
      <g>
        <path d="M0 10 L140 10 L132 84 L8 84 Z" fill={t} />
        <path d="M-4 4 L144 4 L140 14 L0 14 Z" fill={shade(t, 0.15)} />
        <rect x="20" y="30" width="100" height="4" fill={shade(t, -0.2)} />
        <circle cx="20" cy="86" r="4" fill="#111" />
        <circle cx="120" cy="86" r="4" fill="#111" />
      </g>
    ),
  },
  puddle: {
    vb: [120, 20],
    tint: "#5a6a80",
    draw: (t) => (
      <g>
        <ellipse cx="60" cy="10" rx="60" ry="10" fill={t} opacity="0.5" />
        <ellipse cx="50" cy="8" rx="30" ry="3" fill="#ffd98a" opacity="0.25" />
      </g>
    ),
  },
  chimney: {
    vb: [60, 120],
    tint: "#5a3a30",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="60" height="12" fill={shade(t, 0.15)} />
        <rect x="4" y="12" width="52" height="108" fill={t} />
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1="4" y1={24 + i * 12} x2="56" y2={24 + i * 12} stroke={shade(t, -0.3)} />
        ))}
      </g>
    ),
  },
  "water-tank": {
    vb: [120, 160],
    tint: "#6d4a2c",
    draw: (t) => (
      <g>
        <path d="M10 10 L60 -10 L110 10 Z" fill={shade(t, -0.2)} />
        <rect x="10" y="10" width="100" height="90" fill={t} />
        {[30, 60].map((y) => (
          <rect key={y} x="8" y={y} width="104" height="4" fill="#1d1f22" />
        ))}
        {[20, 55, 90].map((x) => (
          <rect key={x} x={x} y="100" width="6" height="60" fill="#1d1f22" />
        ))}
        <path d="M20 160 L96 100 M26 100 L96 160" stroke="#1d1f22" strokeWidth="2" />
      </g>
    ),
  },
  "display-case": {
    vb: [100, 140],
    tint: "#2a2730",
    surfaces: [0.55],
    draw: (t, v) => (
      <g>
        <rect x="10" y="78" width="80" height="62" fill={t} />
        <rect x="6" y="74" width="88" height="8" fill="url(#g-brass)" />
        {v !== "open" && <rect x="10" y="0" width="80" height="76" fill="url(#g-glass)" stroke="#cfe3ea" strokeWidth="1" />}
        {v === "empty" && <rect x="36" y="62" width="28" height="12" fill={shade(t, 0.2)} />}
        <rect x="26" y="96" width="48" height="10" fill="#efe4cc" opacity="0.7" />
      </g>
    ),
  },
  pedestal: {
    vb: [50, 70],
    tint: "#d8d0bc",
    surfaces: [0.06],
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="50" height="8" fill={shade(t, 0.1)} />
        <rect x="8" y="8" width="34" height="54" fill={t} />
        <rect x="0" y="62" width="50" height="8" fill={shade(t, -0.1)} />
        {[16, 25, 34].map((x) => (
          <line key={x} x1={x} y1="10" x2={x} y2="60" stroke={shade(t, -0.15)} />
        ))}
      </g>
    ),
  },
  statue: {
    vb: [60, 160],
    tint: "#cfc8b8",
    draw: (t) => (
      <g>
        <rect x="6" y="130" width="48" height="30" fill={shade(t, -0.15)} />
        <circle cx="30" cy="20" r="11" fill={t} />
        <path d="M14 130 L18 60 Q12 40 30 34 Q48 40 42 60 L46 130 Z" fill={t} />
        <path d="M18 60 Q6 70 12 86" stroke={t} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M24 50 L26 128 M36 50 L34 128" stroke={shade(t, -0.15)} />
      </g>
    ),
  },
  easel: {
    vb: [80, 150],
    tint: "#8a6a44",
    draw: (t) => (
      <g>
        <path d="M40 0 L10 150 M40 0 L70 150 M40 0 L40 150" stroke={t} strokeWidth="5" />
        <rect x="6" y="20" width="68" height="70" fill="#efe4cc" />
        <path d="M14 70 Q30 40 46 60 T70 50 L70 84 L14 84 Z" fill="#7a8aa0" opacity="0.7" />
        <rect x="4" y="90" width="72" height="6" fill={shade(t, -0.2)} />
      </g>
    ),
  },
  workbench: {
    vb: [220, 90],
    tint: "#7a5a34",
    surfaces: [0.08],
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="220" height="12" fill={shade(t, 0.15)} />
        <rect x="8" y="12" width="10" height="78" fill={shade(t, -0.2)} />
        <rect x="202" y="12" width="10" height="78" fill={shade(t, -0.2)} />
        <rect x="8" y="60" width="204" height="6" fill={shade(t, -0.25)} />
        <rect x="150" y="66" width="40" height="24" fill="#5d6670" />
      </g>
    ),
  },
  toolboard: {
    vb: [140, 90],
    tint: "#a68a5e",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="140" height="90" fill={t} />
        {Array.from({ length: 7 }).map((_, r) =>
          Array.from({ length: 13 }).map((__, c) => <circle key={`${r}${c}`} cx={6 + c * 10.5} cy={6 + r * 12.5} r="1" fill={shade(t, -0.4)} />),
        )}
        <rect x="14" y="10" width="6" height="40" fill="#5d6670" />
        <rect x="10" y="10" width="14" height="8" fill="#5d6670" />
        <path d="M44 10 L50 50 L56 10" stroke="#3a3f46" strokeWidth="4" fill="none" />
        <circle cx="86" cy="28" r="12" fill="none" stroke="#7a6a5a" strokeWidth="4" />
        <rect x="108" y="12" width="5" height="44" fill="#b85a3a" />
        <rect x="104" y="8" width="13" height="10" fill="#3a3f46" />
      </g>
    ),
  },
  telescope: {
    vb: [120, 140],
    tint: "#b8924a",
    draw: () => (
      <g>
        <rect x="10" y="20" width="96" height="20" rx="6" fill="url(#g-brass)" transform="rotate(-28 58 30)" />
        <rect x="90" y="-6" width="20" height="28" rx="3" fill="url(#g-brass)" transform="rotate(-28 100 8)" />
        <path d="M58 50 L30 140 M58 50 L86 140 M58 50 L58 140" stroke="#3a2416" strokeWidth="5" />
        <circle cx="58" cy="50" r="6" fill="url(#g-brass)" />
      </g>
    ),
  },
  globe: {
    vb: [60, 80],
    tint: "#3a5a6a",
    surfaces: [0.0],
    draw: (t) => (
      <g>
        <circle cx="30" cy="30" r="24" fill={t} />
        <path d="M14 22 Q22 16 26 26 Q30 36 22 42 M34 14 Q44 20 40 30 Q48 34 46 44" stroke="#c9b48a" strokeWidth="3" fill="none" />
        <path d="M30 2 A28 28 0 0 1 30 58" stroke="url(#g-brass)" strokeWidth="3" fill="none" />
        <rect x="28" y="56" width="4" height="14" fill="url(#g-brass)" />
        <ellipse cx="30" cy="74" rx="16" ry="5" fill={C.woodDark} />
      </g>
    ),
  },
  "map-wall": {
    vb: [160, 110],
    tint: "#d9c8a2",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="160" height="110" fill={t} />
        <path d="M10 70 Q30 40 60 54 T110 40 Q140 30 150 60 L150 100 L10 100 Z" fill="#b8a77a" opacity="0.6" />
        <path d="M20 30 Q60 20 80 34 T150 24" stroke="#5a7a8a" strokeWidth="2" fill="none" />
        <path d="M30 86 L60 60 L96 70 L130 46" stroke={C.burgundy} strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
        {[[30, 86], [60, 60], [96, 70], [130, 46]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill={C.burgundy} />
        ))}
        <rect x="0" y="0" width="160" height="110" fill="none" stroke={C.woodDark} strokeWidth="3" />
      </g>
    ),
  },
  "map-table": {
    vb: [200, 80],
    tint: C.wood,
    surfaces: [0.06],
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="200" height="8" fill={shade(t, 0.15)} />
        <rect x="20" y="-4" width="160" height="8" fill="#d9c8a2" transform="skewX(-20)" />
        <rect x="10" y="8" width="10" height="72" fill={shade(t, -0.2)} />
        <rect x="180" y="8" width="10" height="72" fill={shade(t, -0.2)} />
        <rect x="10" y="40" width="180" height="6" fill={shade(t, -0.25)} />
      </g>
    ),
  },
  "train-seat": {
    vb: [120, 110],
    tint: "#5a2a30",
    draw: (t) => (
      <g>
        <rect x="6" y="0" width="108" height="64" rx="10" fill={shade(t, -0.05)} />
        <rect x="14" y="6" width="92" height="50" rx="8" fill={t} />
        <line x1="60" y1="8" x2="60" y2="54" stroke={shade(t, -0.3)} />
        <rect x="0" y="60" width="120" height="22" rx="6" fill={shade(t, 0.12)} />
        <rect x="8" y="82" width="104" height="28" fill={shade(t, -0.35)} />
        <rect x="8" y="2" width="104" height="8" rx="4" fill="#efe4cc" opacity="0.7" />
      </g>
    ),
  },
  "train-window": {
    vb: [140, 90],
    tint: "#6d4a2c",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="140" height="90" rx="14" fill={t} />
        <rect x="8" y="8" width="124" height="74" rx="10" fill={v === "snow" ? "url(#g-sky-snow)" : "url(#g-sky-night)"} />
        <path d="M8 62 L30 48 L54 56 L80 40 L104 54 L132 44 L132 82 L8 82 Z" fill="#0a0d14" />
        {v === "snow" ? (
          <path d="M8 70 Q70 58 132 70 L132 82 L8 82 Z" fill="#dfeaf0" opacity="0.8" />
        ) : (
          <g>
            <circle cx="104" cy="24" r="6" fill="url(#g-moon)" />
            <circle cx="40" cy="70" r="1.5" fill="#e8c46a" />
            <circle cx="64" cy="66" r="1.5" fill="#e8c46a" />
          </g>
        )}
        <rect x="8" y="8" width="124" height="74" rx="10" fill="url(#g-glass)" />
        <rect x="0" y="40" width="140" height="4" fill={shade(t, 0.15)} />
      </g>
    ),
  },
  "luggage-rack": {
    vb: [200, 30],
    tint: "#b8924a",
    surfaces: [0.2],
    draw: () => (
      <g>
        <rect x="0" y="4" width="200" height="4" fill="url(#g-brass)" />
        <rect x="0" y="16" width="200" height="3" fill="url(#g-brass)" />
        {Array.from({ length: 21 }).map((_, i) => (
          <line key={i} x1={i * 10} y1="6" x2={i * 10} y2="18" stroke="#8a6a3a" strokeWidth="1" />
        ))}
        <path d="M10 18 L4 30 M190 18 L196 30" stroke="url(#g-brass)" strokeWidth="3" />
      </g>
    ),
  },
  suitcase: {
    vb: [80, 55],
    tint: "#6d4a2c",
    surfaces: [0.08],
    draw: (t, v) => (
      <g>
        <path d="M28 8 L28 2 L52 2 L52 8" stroke={shade(t, -0.4)} strokeWidth="3" fill="none" />
        <rect x="0" y="8" width="80" height="47" rx="5" fill={t} />
        {v === "open" ? (
          <rect x="4" y="12" width="72" height="20" fill="#2a1d14" />
        ) : (
          <g>
            <rect x="14" y="8" width="5" height="47" fill={shade(t, -0.25)} />
            <rect x="61" y="8" width="5" height="47" fill={shade(t, -0.25)} />
            <rect x="34" y="14" width="12" height="8" rx="1" fill="url(#g-brass)" />
          </g>
        )}
      </g>
    ),
  },
  "ticket-window": {
    vb: [180, 160],
    tint: "#4a2f1d",
    surfaces: [0.62],
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="180" height="160" fill={t} />
        <rect x="10" y="8" width="160" height="26" fill="#1d1f22" />
        <text x="90" y="27" fontSize="14" textAnchor="middle" fill="#e0c27a" fontFamily="serif" letterSpacing="3">TICKETS</text>
        <path d="M30 100 L30 60 Q90 30 150 60 L150 100 Z" fill="#ffd98a" opacity="0.4" />
        <path d="M30 100 L30 60 Q90 30 150 60 L150 100 Z" fill="url(#g-glass)" stroke="url(#g-brass)" strokeWidth="2" />
        <rect x="16" y="98" width="148" height="8" fill={shade(t, 0.2)} />
        <rect x="70" y="92" width="40" height="8" fill="#0d0907" />
      </g>
    ),
  },
  timetable: {
    vb: [160, 90],
    tint: "#1d1f22",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="160" height="90" fill={t} stroke="url(#g-brass)" strokeWidth="3" />
        <text x="80" y="16" fontSize="10" textAnchor="middle" fill="#e0c27a" fontFamily="serif" letterSpacing="2">{v === "bus" ? "ROUTE 7 · NIGHT" : "DEPARTURES"}</text>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect x="10" y={24 + i * 12} width="34" height="8" fill="#2f3238" />
            <rect x="50" y={24 + i * 12} width="96" height="8" fill="#2f3238" />
          </g>
        ))}
      </g>
    ),
  },
  "platform-edge": {
    vb: [400, 40],
    tint: "#9a8a6a",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="400" height="10" fill="#e0c24a" opacity="0.8" />
        <rect x="0" y="10" width="400" height="30" fill={shade(t, -0.4)} />
      </g>
    ),
  },
  "train-car": {
    vb: [400, 160],
    tint: "#3a2430",
    draw: (t) => (
      <g>
        <rect x="0" y="10" width="400" height="130" rx="14" fill={t} />
        <rect x="0" y="10" width="400" height="14" rx="8" fill={shade(t, 0.15)} />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect x={30 + i * 72} y="40" width="52" height="40" rx="6" fill="#e8c46a" opacity="0.65" />
            <rect x={30 + i * 72} y="40" width="52" height="40" rx="6" fill="url(#g-glass)" />
          </g>
        ))}
        <rect x="0" y="100" width="400" height="6" fill="url(#g-brass)" />
        {[50, 110, 290, 350].map((x) => (
          <circle key={x} cx={x} cy="146" r="14" fill="#15161b" />
        ))}
      </g>
    ),
  },
  bench: {
    vb: [160, 60],
    tint: C.wood,
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="160" height="26" rx="4" fill={shade(t, -0.05)} />
        <rect x="0" y="26" width="160" height="10" rx="2" fill={shade(t, 0.15)} />
        <rect x="8" y="36" width="8" height="24" fill={shade(t, -0.3)} />
        <rect x="144" y="36" width="8" height="24" fill={shade(t, -0.3)} />
      </g>
    ),
  },
  locker: {
    vb: [50, 160],
    tint: "#5d6f6a",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="50" height="160" fill={shade(t, -0.25)} />
        <rect x="3" y="3" width="44" height="154" fill={v === "open" ? "#0e1012" : t} />
        {v !== "open" && (
          <g>
            {[12, 18, 24, 30].map((y) => (
              <rect key={y} x="12" y={y} width="26" height="3" fill={shade(t, -0.3)} />
            ))}
            <rect x="36" y="78" width="5" height="16" rx="2" fill="url(#g-silver)" />
            <rect x="12" y="130" width="26" height="10" fill="#efe4cc" opacity="0.7" />
          </g>
        )}
      </g>
    ),
  },
  car: {
    vb: [260, 110],
    tint: "#2a3a4a",
    draw: (t) => (
      <g>
        <path d="M10 60 Q20 30 70 26 L90 4 L180 4 L210 30 Q250 34 256 60 L256 86 L4 86 L4 64 Z" fill={t} />
        <path d="M96 10 L130 10 L130 32 L76 32 Z" fill="url(#g-glass)" stroke={shade(t, -0.4)} />
        <path d="M136 10 L176 10 L200 32 L136 32 Z" fill="url(#g-glass)" stroke={shade(t, -0.4)} />
        <rect x="4" y="66" width="252" height="6" fill="url(#g-silver)" />
        <circle cx="60" cy="86" r="22" fill="#111" />
        <circle cx="60" cy="86" r="9" fill="url(#g-silver)" />
        <circle cx="200" cy="86" r="22" fill="#111" />
        <circle cx="200" cy="86" r="9" fill="url(#g-silver)" />
        <ellipse cx="250" cy="56" rx="5" ry="7" fill="#ffe6a8" />
      </g>
    ),
  },
  pillar: {
    vb: [40, 300],
    tint: "#7a7a78",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="40" height="300" fill={t} />
        <rect x="0" y="0" width="10" height="300" fill={shade(t, 0.12)} />
        <rect x="30" y="0" width="10" height="300" fill={shade(t, -0.15)} />
        <rect x="0" y="120" width="40" height="18" fill="#e0c24a" opacity="0.6" />
      </g>
    ),
  },
  column: {
    vb: [50, 300],
    tint: "#d8d0bc",
    draw: (t) => (
      <g>
        <rect x="-4" y="0" width="58" height="16" fill={shade(t, 0.1)} />
        <rect x="4" y="16" width="42" height="268" fill={t} />
        {[12, 20, 28, 36].map((x) => (
          <line key={x} x1={x} y1="16" x2={x} y2="284" stroke={shade(t, -0.15)} strokeWidth="2" />
        ))}
        <rect x="-4" y="284" width="58" height="16" fill={shade(t, -0.1)} />
      </g>
    ),
  },
  arch: {
    vb: [200, 260],
    tint: "#5a5550",
    draw: (t) => (
      <g>
        <path d="M0 260 L0 90 Q100 -30 200 90 L200 260 L170 260 L170 96 Q100 10 30 96 L30 260 Z" fill={t} />
        <path d="M30 260 L30 96 Q100 10 170 96 L170 260 Z" fill="#06070a" opacity="0.85" />
      </g>
    ),
  },
  snowdrift: {
    vb: [200, 60],
    tint: "#e8f2f6",
    draw: (t) => (
      <g>
        <path d="M0 60 Q20 20 60 30 Q100 0 140 26 Q180 16 200 60 Z" fill={t} />
        <path d="M30 40 Q60 30 90 38" stroke="#b8d3df" strokeWidth="2" fill="none" />
      </g>
    ),
  },
  "tree-pine": {
    vb: [100, 200],
    tint: "#2a3a32",
    draw: (t, v) => (
      <g>
        <rect x="44" y="160" width="12" height="40" fill="#3a2a1a" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path d={`M50 ${i * 38} L${8 - i * 2} ${70 + i * 34} L${92 + i * 2} ${70 + i * 34} Z`} fill={shade(t, i * 0.04)} />
            {v === "snow" && <path d={`M50 ${i * 38} L${30 - i * 2} ${40 + i * 34} Q50 ${46 + i * 34} ${70 + i * 2} ${40 + i * 34} Z`} fill="#eef6f9" />}
          </g>
        ))}
      </g>
    ),
  },
  fence: {
    vb: [200, 80],
    tint: "#2a2a2a",
    draw: (t) => (
      <g>
        <rect x="0" y="20" width="200" height="5" fill={t} />
        <rect x="0" y="60" width="200" height="5" fill={t} />
        {Array.from({ length: 13 }).map((_, i) => (
          <g key={i}>
            <rect x={i * 16} y="8" width="4" height="72" fill={t} />
            <path d={`M${i * 16 - 2} 10 L${i * 16 + 2} 0 L${i * 16 + 6} 10 Z`} fill={t} />
          </g>
        ))}
      </g>
    ),
  },
  stove: {
    vb: [80, 110],
    tint: "#2a2d31",
    surfaces: [0.02],
    draw: (t, v) => (
      <g>
        <rect x="34" y="-60" width="12" height="62" fill={t} />
        <rect x="6" y="0" width="68" height="10" rx="3" fill={shade(t, 0.15)} />
        <path d="M10 10 L70 10 Q80 50 70 90 L10 90 Q0 50 10 10 Z" fill={t} />
        <rect x="24" y="40" width="32" height="26" rx="4" fill={v === "lit" ? "url(#g-fire)" : "#121416"} />
        <rect x="10" y="90" width="8" height="20" fill={t} />
        <rect x="62" y="90" width="8" height="20" fill={t} />
      </g>
    ),
  },
  "kitchen-stove": {
    vb: [130, 110],
    tint: "#e8e0cc",
    surfaces: [0.02],
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="130" height="10" fill="#2a2d31" />
        {[24, 60, 96].map((x) => (
          <ellipse key={x} cx={x} cy="4" rx="12" ry="3" fill="#15161b" />
        ))}
        <rect x="0" y="10" width="130" height="100" fill={t} />
        <rect x="10" y="30" width="110" height="60" rx="4" fill={shade(t, -0.15)} stroke="#2a2d31" />
        <rect x="40" y="36" width="50" height="6" rx="3" fill="url(#g-silver)" />
        <rect x="30" y="50" width="70" height="30" fill="#1a1a1a" opacity="0.6" />
      </g>
    ),
  },
  pots: {
    vb: [60, 40],
    tint: "#b87333",
    draw: (t) => (
      <g>
        <rect x="0" y="14" width="30" height="24" rx="3" fill={t} />
        <rect x="-4" y="12" width="38" height="4" fill={shade(t, 0.2)} />
        <rect x="34" y="20" width="24" height="18" rx="3" fill={shade(t, -0.15)} />
        <rect x="30" y="26" width="6" height="3" fill="#2a2d31" />
      </g>
    ),
  },
  cot: {
    vb: [180, 60],
    tint: "#5a6a4a",
    draw: (t) => (
      <g>
        <rect x="0" y="10" width="180" height="16" rx="4" fill={t} />
        <rect x="6" y="2" width="40" height="12" rx="5" fill="#d8d0bc" />
        <path d="M10 26 L30 60 M170 26 L150 60 M30 26 L10 60 M150 26 L170 60" stroke="#3a3f46" strokeWidth="3" />
        <path d="M70 12 L176 12 L176 24 L70 24 Z" fill="#8a3a3a" opacity="0.8" />
      </g>
    ),
  },
  icicles: {
    vb: [200, 30],
    tint: "#cfe6ef",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="200" height="5" fill={t} />
        {Array.from({ length: 20 }).map((_, i) => (
          <path key={i} d={`M${i * 10} 4 L${i * 10 + 5} ${10 + ((i * 7) % 20)} L${i * 10 + 10} 4 Z`} fill={t} opacity="0.9" />
        ))}
      </g>
    ),
  },
  "ice-wall": {
    vb: [200, 200],
    tint: "#9cc7d8",
    draw: (t) => (
      <g>
        <path d="M0 200 L0 60 L30 20 L80 40 L120 0 L170 30 L200 10 L200 200 Z" fill={t} opacity="0.75" />
        <path d="M20 200 L40 80 L80 120 L100 60 L150 110 L180 70 L200 200 Z" fill="url(#g-ice)" opacity="0.6" />
      </g>
    ),
  },
  hatch: {
    vb: [80, 30],
    tint: "#4a3a2a",
    draw: (t, v) => (
      <g>
        <ellipse cx="40" cy="15" rx="40" ry="15" fill={shade(t, -0.4)} />
        {v === "open" ? (
          <ellipse cx="40" cy="15" rx="34" ry="11" fill="#050608" />
        ) : (
          <g>
            <ellipse cx="40" cy="15" rx="34" ry="11" fill={t} />
            <path d="M8 15 L72 15" stroke={shade(t, -0.3)} strokeWidth="2" />
            <rect x="34" y="10" width="12" height="4" rx="2" fill="url(#g-brass)" />
          </g>
        )}
      </g>
    ),
  },
  vent: {
    vb: [60, 36],
    tint: "#7b8492",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="60" height="36" fill={shade(t, -0.2)} />
        {v === "open" ? (
          <rect x="4" y="4" width="52" height="28" fill="#060708" />
        ) : (
          [0, 1, 2, 3, 4].map((i) => <rect key={i} x="4" y={5 + i * 6} width="52" height="3" fill={t} />)
        )}
        {[[3, 3], [57, 3], [3, 33], [57, 33]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.3" fill="#2a2d31" />
        ))}
      </g>
    ),
  },
  lantern: {
    vb: [30, 50],
    tint: "#2a2d31",
    draw: (t, v) => (
      <g>
        {v !== "off" && <ellipse cx="15" cy="28" rx="30" ry="28" fill="url(#g-glow)" />}
        <path d="M10 4 Q15 -2 20 4" stroke={t} strokeWidth="2" fill="none" />
        <rect x="6" y="6" width="18" height="6" fill={t} />
        <rect x="7" y="12" width="16" height="28" fill={v === "off" ? "#2a2d31" : "#ffd98a"} opacity="0.8" />
        <path d="M7 12 L7 40 M23 12 L23 40 M15 12 L15 40" stroke={t} strokeWidth="1.5" />
        <rect x="5" y="40" width="20" height="6" fill={t} />
      </g>
    ),
  },
  "glass-roof": {
    vb: [400, 120],
    tint: "#3f5d3a",
    draw: (t) => (
      <g>
        <path d="M0 120 L200 0 L400 120" fill="url(#g-glass)" stroke={shade(t, -0.3)} strokeWidth="4" />
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={200} y1={0} x2={i * 50} y2={120} stroke={shade(t, -0.3)} strokeWidth="2" />
        ))}
      </g>
    ),
  },
  vines: {
    vb: [120, 200],
    tint: "#3f5d3a",
    draw: (t) => (
      <g>
        <path d="M60 0 Q30 50 60 100 T60 200" stroke={shade(t, -0.2)} strokeWidth="3" fill="none" />
        {Array.from({ length: 14 }).map((_, i) => (
          <ellipse key={i} cx={60 + (i % 2 ? 14 : -14) + Math.sin(i) * 10} cy={i * 14 + 6} rx="10" ry="5" fill={shade(t, (i % 3) * 0.08)} transform={`rotate(${i % 2 ? 30 : -30} ${60 + (i % 2 ? 14 : -14)} ${i * 14 + 6})`} />
        ))}
      </g>
    ),
  },
  "planter-box": {
    vb: [200, 70],
    tint: "#6d4a2c",
    surfaces: [0.2],
    draw: (t) => (
      <g>
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d={`M${14 + i * 24} 30 Q${8 + i * 24} 6 ${20 + i * 24} 0 Q${26 + i * 24} 14 ${22 + i * 24} 30`} fill={i % 2 ? "#4f7a46" : "#3f5d3a"} />
        ))}
        <rect x="0" y="26" width="200" height="44" fill={t} />
        <rect x="0" y="26" width="200" height="6" fill={shade(t, 0.15)} />
      </g>
    ),
  },
  cage: {
    vb: [60, 80],
    tint: "#b8924a",
    draw: () => (
      <g stroke="url(#g-brass)" strokeWidth="2" fill="none">
        <path d="M6 30 Q30 -6 54 30 L54 76 L6 76 Z" />
        {[14, 22, 30, 38, 46].map((x) => (
          <line key={x} x1={x} y1="14" x2={x} y2="76" />
        ))}
        <rect x="2" y="74" width="56" height="6" fill="url(#g-brass)" />
      </g>
    ),
  },
  bathtub: {
    vb: [180, 80],
    tint: "#efe4cc",
    draw: (t) => (
      <g>
        <path d="M0 10 L180 10 Q176 70 140 70 L40 70 Q4 70 0 10 Z" fill={t} />
        <rect x="-4" y="6" width="188" height="8" rx="4" fill={shade(t, 0.2)} />
        <path d="M30 70 L24 80 M150 70 L156 80" stroke="url(#g-brass)" strokeWidth="5" />
      </g>
    ),
  },
  sink: {
    vb: [70, 90],
    tint: "#efe4cc",
    surfaces: [0.06],
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="70" height="14" rx="4" fill={t} />
        <rect x="28" y="14" width="14" height="76" fill={shade(t, -0.1)} />
        <path d="M30 0 L30 -14 Q35 -20 44 -14" stroke="url(#g-silver)" strokeWidth="3" fill="none" />
      </g>
    ),
  },
  "cash-box": {
    vb: [60, 40],
    tint: "#3a4a5a",
    draw: (t) => (
      <g>
        <rect x="0" y="10" width="60" height="30" rx="2" fill={t} />
        <path d="M0 10 L6 0 L54 0 L60 10 Z" fill={shade(t, 0.15)} />
        <rect x="26" y="14" width="8" height="10" fill="url(#g-silver)" />
      </g>
    ),
  },
  "notice-board": {
    vb: [120, 90],
    tint: "#2a2730",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="120" height="90" fill={t} stroke="url(#g-brass)" strokeWidth="2" />
        <rect x="8" y="8" width="36" height="44" fill="#efe4cc" />
        <rect x="50" y="10" width="30" height="30" fill="#d9c8a2" />
        <rect x="84" y="8" width="28" height="40" fill="#efe4cc" />
        <rect x="20" y="58" width="80" height="24" fill="#e8dcc0" />
        {[[26, 8], [65, 10], [98, 8], [60, 58]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#b02a2a" />
        ))}
      </g>
    ),
  },
  sculpture: {
    vb: [80, 100],
    tint: "#9a8a6a",
    draw: (t) => (
      <g>
        <path d="M40 0 Q70 30 52 60 Q70 80 40 100 Q10 80 28 60 Q10 30 40 0 Z" fill={t} />
        <path d="M40 10 Q58 32 46 58" stroke={shade(t, 0.25)} strokeWidth="3" fill="none" />
      </g>
    ),
  },
  "artifact-plinth": {
    vb: [80, 120],
    tint: "#2a2730",
    surfaces: [0.08],
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="80" height="10" fill="url(#g-brass)" />
        <rect x="8" y="10" width="64" height="104" fill={t} />
        <rect x="0" y="112" width="80" height="8" fill={shade(t, 0.1)} />
        {v === "empty" && <circle cx="40" cy="-14" r="14" fill="none" stroke="#e0c27a" strokeDasharray="3 3" opacity="0.6" />}
        <rect x="18" y="40" width="44" height="14" fill="#efe4cc" opacity="0.8" />
      </g>
    ),
  },
  rope: {
    vb: [200, 40],
    tint: "#9a3a3a",
    draw: (t) => (
      <g>
        <path d="M10 10 Q100 40 190 10" stroke={t} strokeWidth="5" fill="none" />
        <rect x="4" y="6" width="12" height="34" fill="url(#g-brass)" />
        <rect x="184" y="6" width="12" height="34" fill="url(#g-brass)" />
      </g>
    ),
  },
  spotlight: {
    vb: [100, 200],
    tint: "#fff4d0",
    draw: (t) => (
      <g>
        <path d="M40 0 L60 0 L100 200 L0 200 Z" fill={t} opacity="0.12" />
      </g>
    ),
  },
};
