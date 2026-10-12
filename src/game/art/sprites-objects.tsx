/* eslint-disable react/jsx-key */
import { C, shade } from "./color";
import type { SpriteDef } from "./sprites-furniture";

/** Small objects: clues, items, documents, tools. */
export const OBJECTS: Record<string, SpriteDef> = {
  key: {
    vb: [60, 24],
    tint: "#b8924a",
    draw: () => (
      <g>
        <circle cx="12" cy="12" r="10" fill="url(#g-brass)" />
        <circle cx="12" cy="12" r="4.5" fill="#1a140c" />
        <rect x="20" y="9" width="38" height="6" rx="2" fill="url(#g-brass)" />
        <rect x="44" y="15" width="5" height="8" fill="url(#g-brass)" />
        <rect x="52" y="15" width="4" height="6" fill="url(#g-brass)" />
      </g>
    ),
  },
  "key-ornate": {
    vb: [60, 24],
    tint: "#c8c8c8",
    draw: () => (
      <g>
        <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="url(#g-silver)" />
        <circle cx="12" cy="12" r="3.5" fill="#1a1a1a" />
        <rect x="21" y="10" width="36" height="4" rx="2" fill="url(#g-silver)" />
        <path d="M46 14 L46 22 L50 22 L50 18 L54 18 L54 14 Z" fill="url(#g-silver)" />
      </g>
    ),
  },
  "key-small": {
    vb: [40, 18],
    tint: "#b8924a",
    draw: () => (
      <g>
        <circle cx="8" cy="9" r="7" fill="url(#g-brass)" />
        <circle cx="8" cy="9" r="3" fill="#1a140c" />
        <rect x="14" y="7" width="24" height="4" rx="1.5" fill="url(#g-brass)" />
        <rect x="30" y="11" width="4" height="5" fill="url(#g-brass)" />
      </g>
    ),
  },
  keyring: {
    vb: [50, 40],
    tint: "#b8924a",
    draw: () => (
      <g>
        <circle cx="14" cy="14" r="11" fill="none" stroke="url(#g-silver)" strokeWidth="2.5" />
        <rect x="18" y="18" width="28" height="5" rx="2" fill="url(#g-brass)" transform="rotate(30 18 18)" />
        <rect x="10" y="22" width="26" height="5" rx="2" fill="url(#g-silver)" transform="rotate(70 10 22)" />
      </g>
    ),
  },
  "card-calling": {
    vb: [60, 36],
    tint: "#efe4cc",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="60" height="36" rx="2" fill={t} stroke="#8a7a5a" strokeWidth="0.8" />
        <rect x="8" y="10" width="44" height="3" fill={C.ink} opacity="0.7" />
        <rect x="14" y="18" width="32" height="2" fill={C.ink} opacity="0.5" />
        <rect x="18" y="24" width="24" height="2" fill={C.ink} opacity="0.5" />
      </g>
    ),
  },
  "card-access": {
    vb: [60, 38],
    tint: "#2c5a7a",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="60" height="38" rx="4" fill={t} />
        <rect x="0" y="6" width="60" height="7" fill="#1a1a1a" />
        <rect x="6" y="18" width="14" height="16" fill="#efe4cc" />
        <circle cx="13" cy="24" r="3.5" fill="#8a7a6a" />
        <rect x="24" y="20" width="30" height="3" fill="#efe4cc" opacity="0.85" />
        <rect x="24" y="27" width="20" height="3" fill="#efe4cc" opacity="0.6" />
      </g>
    ),
  },
  letter: {
    vb: [60, 40],
    tint: "#e8dcc0",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="60" height="40" fill={t} stroke="#9a8a6a" strokeWidth="0.8" />
        <path d="M0 0 L30 22 L60 0" fill="none" stroke="#9a8a6a" strokeWidth="1" />
        <circle cx="30" cy="22" r="5" fill={C.burgundy} />
        <rect x="40" y="4" width="14" height="10" fill="#7a9a8a" opacity="0.8" />
      </g>
    ),
  },
  note: {
    vb: [40, 50],
    tint: "#efe4cc",
    draw: (t) => (
      <g>
        <path d="M0 0 L40 0 L40 42 L32 50 L0 50 Z" fill={t} stroke="#9a8a6a" strokeWidth="0.6" />
        <path d="M32 50 L32 42 L40 42" fill={shade(t, -0.15)} />
        {[8, 14, 20, 26, 32].map((y) => (
          <path key={y} d={`M5 ${y} Q15 ${y - 2} 22 ${y} T35 ${y}`} stroke="#2a3a5a" strokeWidth="0.9" fill="none" opacity="0.7" />
        ))}
      </g>
    ),
  },
  "note-torn": {
    vb: [40, 40],
    tint: "#efe4cc",
    draw: (t) => (
      <g>
        <path d="M0 0 L40 0 L38 10 L40 18 L36 26 L40 34 L36 40 L0 40 Z" fill={t} stroke="#9a8a6a" strokeWidth="0.6" />
        {[8, 15, 22, 29].map((y) => (
          <path key={y} d={`M5 ${y} Q15 ${y - 2} 30 ${y}`} stroke="#2a3a5a" strokeWidth="0.9" fill="none" opacity="0.7" />
        ))}
      </g>
    ),
  },
  paper: {
    vb: [44, 56],
    tint: "#efe4cc",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="44" height="56" fill={t} stroke="#9a8a6a" strokeWidth="0.6" />
        <rect x="6" y="6" width="24" height="3" fill={C.ink} opacity="0.7" />
        {[14, 19, 24, 29, 34, 39, 44].map((y) => (
          <rect key={y} x="6" y={y} width={y % 2 ? 30 : 32} height="1.6" fill={C.ink} opacity="0.45" />
        ))}
      </g>
    ),
  },
  "paper-burnt": {
    vb: [44, 50],
    tint: "#d9c8a2",
    draw: (t) => (
      <g>
        <path d="M0 4 L18 0 L44 6 L40 30 L44 44 L26 50 L10 44 L2 30 Z" fill={t} />
        <path d="M26 50 L10 44 L2 30 L8 36 L20 40 Z" fill="#3a2416" opacity="0.8" />
        <path d="M44 6 L40 30 L44 44 L36 34 L38 14 Z" fill="#3a2416" opacity="0.6" />
        {[12, 18, 24].map((y) => (
          <rect key={y} x="8" y={y} width="24" height="1.5" fill={C.ink} opacity="0.5" />
        ))}
      </g>
    ),
  },
  photo: {
    vb: [56, 44],
    tint: "#4a4a50",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="56" height="44" fill="#f2ead8" />
        <rect x="4" y="4" width="48" height="32" fill={t} />
        <circle cx="18" cy="16" r="5" fill="#a8a8a8" />
        <path d="M10 36 Q18 22 26 36 Z" fill="#a8a8a8" />
        <circle cx="38" cy="15" r="5" fill="#c8c8c8" />
        <path d="M30 36 Q38 21 46 36 Z" fill="#c8c8c8" />
      </g>
    ),
  },
  "photo-torn": {
    vb: [40, 44],
    tint: "#4a4a50",
    draw: (t) => (
      <g>
        <path d="M0 0 L40 0 L34 10 L40 20 L32 30 L38 44 L0 44 Z" fill="#f2ead8" />
        <path d="M4 4 L36 4 L31 10 L36 20 L29 30 L33 36 L4 36 Z" fill={t} />
        <circle cx="16" cy="16" r="5" fill="#a8a8a8" />
        <path d="M8 36 Q16 22 24 36 Z" fill="#a8a8a8" />
      </g>
    ),
  },
  negative: {
    vb: [70, 22],
    tint: "#3a2a1a",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="70" height="22" fill={t} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={4 + i * 22} y="5" width="18" height="12" fill="#c87a3a" opacity="0.55" />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i}>
            <rect x={2 + i * 6} y="1" width="2.5" height="2" fill="#e8dcc0" />
            <rect x={2 + i * 6} y="19" width="2.5" height="2" fill="#e8dcc0" />
          </g>
        ))}
      </g>
    ),
  },
  book: {
    vb: [50, 36],
    tint: "#6b2430",
    draw: (t) => (
      <g>
        <rect x="0" y="4" width="50" height="32" rx="2" fill={shade(t, -0.25)} />
        <rect x="2" y="0" width="46" height="30" rx="2" fill={t} />
        <rect x="2" y="26" width="46" height="5" fill="#efe4cc" />
        <rect x="10" y="8" width="30" height="10" fill="none" stroke="url(#g-brass)" strokeWidth="1.2" />
      </g>
    ),
  },
  "book-open": {
    vb: [70, 40],
    tint: "#6b2430",
    draw: (t) => (
      <g>
        <path d="M0 6 L35 10 L70 6 L70 38 L35 40 L0 38 Z" fill={t} />
        <path d="M3 4 Q18 0 35 8 L35 36 Q18 30 3 34 Z" fill="#f2ead8" />
        <path d="M67 4 Q52 0 35 8 L35 36 Q52 30 67 34 Z" fill="#e8dcc0" />
        {[12, 17, 22, 27].map((y) => (
          <g key={y}>
            <line x1="8" y1={y - 2} x2="30" y2={y} stroke={C.ink} strokeWidth="0.7" opacity="0.5" />
            <line x1="40" y1={y} x2="62" y2={y - 2} stroke={C.ink} strokeWidth="0.7" opacity="0.5" />
          </g>
        ))}
      </g>
    ),
  },
  journal: {
    vb: [44, 54],
    tint: "#4a2f1d",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="44" height="54" rx="3" fill={t} />
        <rect x="40" y="0" width="4" height="54" fill="#efe4cc" />
        <rect x="0" y="22" width="44" height="6" fill={C.burgundy} />
        <rect x="8" y="8" width="24" height="8" fill="none" stroke="url(#g-brass)" />
      </g>
    ),
  },
  ledger: {
    vb: [56, 44],
    tint: "#2c3e5c",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="56" height="44" rx="2" fill={t} />
        <rect x="0" y="0" width="10" height="44" fill={shade(t, -0.3)} />
        <rect x="18" y="10" width="30" height="10" fill="#efe4cc" />
        <text x="33" y="18" fontSize="7" textAnchor="middle" fill={C.ink} fontFamily="serif">LEDGER</text>
      </g>
    ),
  },
  folder: {
    vb: [60, 44],
    tint: "#c9a86a",
    draw: (t) => (
      <g>
        <path d="M0 4 L20 4 L24 0 L60 0 L60 44 L0 44 Z" fill={shade(t, -0.15)} />
        <rect x="0" y="6" width="60" height="38" fill={t} />
        <rect x="8" y="14" width="30" height="8" fill="#efe4cc" />
        <rect x="8" y="30" width="20" height="4" fill={C.burgundy} opacity="0.8" />
      </g>
    ),
  },
  newspaper: {
    vb: [60, 44],
    tint: "#d9d2c2",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="60" height="44" fill={t} />
        <rect x="4" y="4" width="52" height="7" fill={C.ink} opacity="0.8" />
        <rect x="4" y="14" width="24" height="16" fill="#8a8a8a" />
        {[14, 18, 22, 26, 30, 34, 38].map((y) => (
          <rect key={y} x="31" y={y} width="25" height="1.6" fill={C.ink} opacity="0.5" />
        ))}
        {[34, 38].map((y) => (
          <rect key={y} x="4" y={y} width="24" height="1.6" fill={C.ink} opacity="0.5" />
        ))}
      </g>
    ),
  },
  telegram: {
    vb: [56, 40],
    tint: "#e6d79a",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="56" height="40" fill={t} />
        <rect x="4" y="4" width="48" height="6" fill={C.burgundy} opacity="0.8" />
        {[16, 22, 28, 34].map((y) => (
          <rect key={y} x="6" y={y} width="44" height="3" fill="#efe4cc" stroke="#8a7a4a" strokeWidth="0.3" />
        ))}
      </g>
    ),
  },
  ticket: {
    vb: [56, 26],
    tint: "#c9a86a",
    draw: (t) => (
      <g>
        <path d="M0 0 L56 0 L56 9 A4 4 0 0 0 56 17 L56 26 L0 26 L0 17 A4 4 0 0 0 0 9 Z" fill={t} />
        <line x1="40" y1="2" x2="40" y2="24" stroke={C.ink} strokeDasharray="2 2" opacity="0.6" />
        <rect x="5" y="5" width="28" height="4" fill={C.ink} opacity="0.7" />
        <rect x="5" y="13" width="20" height="2.5" fill={C.ink} opacity="0.5" />
        <text x="48" y="17" fontSize="8" textAnchor="middle" fill={C.burgundy} fontFamily="serif">№</text>
      </g>
    ),
  },
  receipt: {
    vb: [30, 50],
    tint: "#f2ecdc",
    draw: (t) => (
      <g>
        <path d="M0 0 L30 0 L30 46 L26 50 L22 46 L18 50 L14 46 L10 50 L6 46 L2 50 L0 46 Z" fill={t} />
        {[6, 11, 16, 21, 26, 31].map((y) => (
          <rect key={y} x="4" y={y} width={y === 31 ? 22 : 18} height="1.8" fill={C.ink} opacity="0.5" />
        ))}
      </g>
    ),
  },
  map: {
    vb: [60, 44],
    tint: "#d9c8a2",
    draw: (t) => (
      <g>
        <path d="M0 4 L20 0 L40 4 L60 0 L60 40 L40 44 L20 40 L0 44 Z" fill={t} />
        <path d="M20 0 L20 40 M40 4 L40 44" stroke={shade(t, -0.2)} />
        <path d="M6 30 Q20 10 34 24 T56 12" stroke="#5a7a8a" strokeWidth="1.5" fill="none" />
        <path d="M44 30 L50 36 M50 30 L44 36" stroke={C.burgundy} strokeWidth="2" />
      </g>
    ),
  },
  blueprint: {
    vb: [60, 44],
    tint: "#2a4a7a",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="60" height="44" fill={t} />
        <rect x="6" y="6" width="48" height="32" fill="none" stroke="#cfe3ff" strokeWidth="0.8" />
        <path d="M6 22 L30 22 L30 38 M30 22 L54 22 M40 6 L40 22" stroke="#cfe3ff" strokeWidth="0.8" />
        <circle cx="18" cy="14" r="4" fill="none" stroke="#cfe3ff" strokeWidth="0.8" />
      </g>
    ),
  },
  "star-chart": {
    vb: [56, 56],
    tint: "#1b2235",
    draw: (t) => (
      <g>
        <circle cx="28" cy="28" r="27" fill={t} stroke="url(#g-brass)" strokeWidth="2" />
        {[[14, 18], [24, 12], [36, 20], [40, 34], [22, 38], [30, 28]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill="#f2e6b8" />
        ))}
        <path d="M14 18 L24 12 L36 20 L40 34 M36 20 L30 28 L22 38" stroke="#f2e6b8" strokeWidth="0.6" opacity="0.7" fill="none" />
      </g>
    ),
  },
  envelope: {
    vb: [56, 36],
    tint: "#c9a86a",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="56" height="36" fill={t} />
        <path d="M0 0 L28 20 L56 0" fill={shade(t, -0.12)} />
        <rect x="6" y="22" width="22" height="2" fill={C.ink} opacity="0.5" />
      </g>
    ),
  },
  "wax-seal": {
    vb: [30, 30],
    tint: "#8e2f2f",
    draw: (t) => (
      <g>
        <path d="M15 1 Q22 2 26 6 Q30 12 28 18 Q27 25 20 28 Q13 30 7 26 Q1 21 2 14 Q3 6 9 3 Z" fill={t} />
        <circle cx="15" cy="15" r="8" fill={shade(t, 0.15)} />
        <text x="15" y="19" fontSize="10" textAnchor="middle" fill={shade(t, -0.4)} fontFamily="serif" fontWeight="bold">H</text>
      </g>
    ),
  },
  stamp: {
    vb: [30, 36],
    tint: "#3a5a7a",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="30" height="36" fill="#efe4cc" stroke="#efe4cc" strokeDasharray="2 2" strokeWidth="2" />
        <rect x="4" y="4" width="22" height="28" fill={t} />
        <circle cx="15" cy="16" r="6" fill="#efe4cc" opacity="0.6" />
      </g>
    ),
  },
  coin: {
    vb: [24, 24],
    tint: "#b8924a",
    draw: () => (
      <g>
        <circle cx="12" cy="12" r="11" fill="url(#g-brass)" />
        <circle cx="12" cy="12" r="8" fill="none" stroke="#6e5326" strokeWidth="0.8" />
        <path d="M8 12 L12 7 L16 12 L12 17 Z" fill="#6e5326" opacity="0.6" />
      </g>
    ),
  },
  token: {
    vb: [26, 26],
    tint: "#b8924a",
    draw: () => (
      <g>
        <circle cx="13" cy="13" r="12" fill="url(#g-brass)" />
        <path d="M13 5 Q17 9 13 13 Q9 17 13 21 M7 13 L19 13" stroke="#5a3a14" strokeWidth="1.4" fill="none" />
      </g>
    ),
  },
  ring: {
    vb: [26, 26],
    tint: "#b8924a",
    draw: () => (
      <g>
        <circle cx="13" cy="15" r="9" fill="none" stroke="url(#g-brass)" strokeWidth="3.5" />
        <path d="M9 6 L13 1 L17 6 L13 9 Z" fill="#9fd3e0" stroke="#fff" strokeWidth="0.6" />
      </g>
    ),
  },
  locket: {
    vb: [26, 34],
    tint: "#b8924a",
    draw: () => (
      <g>
        <path d="M13 0 Q4 4 8 12" stroke="url(#g-brass)" strokeWidth="1.2" fill="none" />
        <path d="M13 0 Q22 4 18 12" stroke="url(#g-brass)" strokeWidth="1.2" fill="none" />
        <ellipse cx="13" cy="22" rx="10" ry="11" fill="url(#g-brass)" />
        <ellipse cx="13" cy="22" rx="6" ry="7" fill="none" stroke="#6e5326" />
      </g>
    ),
  },
  pocketwatch: {
    vb: [30, 38],
    tint: "#b8924a",
    draw: () => (
      <g>
        <circle cx="15" cy="4" r="3" fill="none" stroke="url(#g-brass)" strokeWidth="1.6" />
        <circle cx="15" cy="22" r="14" fill="url(#g-brass)" />
        <circle cx="15" cy="22" r="11" fill="#f2ead8" />
        <line x1="15" y1="22" x2="15" y2="14" stroke={C.ink} strokeWidth="1.2" />
        <line x1="15" y1="22" x2="21" y2="24" stroke={C.ink} strokeWidth="1.2" />
      </g>
    ),
  },
  cufflink: {
    vb: [24, 20],
    tint: "#c8c8c8",
    draw: () => (
      <g>
        <rect x="2" y="2" width="20" height="14" rx="3" fill="url(#g-silver)" />
        <text x="12" y="13" fontSize="8" textAnchor="middle" fill="#3a3f46" fontFamily="serif" fontWeight="bold">JR</text>
      </g>
    ),
  },
  button: {
    vb: [20, 20],
    tint: "#3a2a1a",
    draw: (t) => (
      <g>
        <circle cx="10" cy="10" r="9" fill={t} />
        {[[7, 7], [13, 7], [7, 13], [13, 13]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.4" fill="#0c0806" />
        ))}
      </g>
    ),
  },
  brooch: {
    vb: [30, 30],
    tint: "#6b2430",
    draw: (t) => (
      <g>
        <circle cx="15" cy="15" r="13" fill="url(#g-brass)" />
        <circle cx="15" cy="15" r="7" fill={t} />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <circle key={i} cx={15 + Math.cos(a) * 10} cy={15 + Math.sin(a) * 10} r="1.4" fill="#f2f2f2" />;
        })}
      </g>
    ),
  },
  earring: {
    vb: [16, 30],
    tint: "#f2f2f2",
    draw: () => (
      <g>
        <path d="M8 0 Q2 4 8 8" stroke="url(#g-brass)" strokeWidth="1.2" fill="none" />
        <circle cx="8" cy="20" r="7" fill="url(#g-silver)" />
      </g>
    ),
  },
  glove: {
    vb: [40, 50],
    tint: "#2a2d31",
    draw: (t) => (
      <g>
        <path d="M8 50 L6 24 L4 8 Q6 4 9 8 L11 20 L12 4 Q15 0 17 4 L18 20 L20 2 Q23 0 25 4 L25 20 L28 8 Q31 6 32 10 L30 30 Q34 26 36 30 L30 42 L28 50 Z" fill={t} />
        <rect x="6" y="42" width="24" height="8" fill={shade(t, 0.15)} />
      </g>
    ),
  },
  scarf: {
    vb: [60, 30],
    tint: "#6b2430",
    draw: (t) => (
      <g>
        <path d="M0 10 Q30 0 60 10 L58 22 Q30 14 2 22 Z" fill={t} />
        {[10, 22, 34, 46].map((x) => (
          <line key={x} x1={x} y1="8" x2={x} y2="22" stroke={shade(t, -0.25)} strokeWidth="2" />
        ))}
        <path d="M48 20 L50 30 M52 19 L54 29 M56 18 L58 28" stroke={t} strokeWidth="1.5" />
      </g>
    ),
  },
  hat: {
    vb: [60, 30],
    tint: "#3a3a40",
    draw: (t) => (
      <g>
        <ellipse cx="30" cy="24" rx="30" ry="6" fill={shade(t, -0.2)} />
        <path d="M12 24 L14 6 Q30 -2 46 6 L48 24 Z" fill={t} />
        <rect x="13" y="16" width="34" height="5" fill={C.burgundy} />
      </g>
    ),
  },
  umbrella: {
    vb: [30, 70],
    tint: "#1d1f22",
    draw: (t) => (
      <g>
        <path d="M15 4 L6 50 Q15 56 24 50 Z" fill={t} />
        <rect x="14" y="0" width="2" height="6" fill="url(#g-silver)" />
        <path d="M15 50 L15 62 Q15 70 9 66" stroke="#5a3a24" strokeWidth="3" fill="none" />
      </g>
    ),
  },
  handkerchief: {
    vb: [40, 30],
    tint: "#efe4cc",
    draw: (t) => (
      <g>
        <path d="M0 6 Q20 0 40 4 L36 26 Q20 30 4 26 Z" fill={t} />
        <text x="30" y="22" fontSize="8" fill={C.burgundy} fontFamily="serif" fontStyle="italic">M.V.</text>
      </g>
    ),
  },
  spectacles: {
    vb: [50, 20],
    tint: "#2a2d31",
    draw: (t) => (
      <g fill="url(#g-glass)" stroke={t} strokeWidth="2">
        <circle cx="12" cy="10" r="8" />
        <circle cx="38" cy="10" r="8" />
        <path d="M20 10 Q25 6 30 10" fill="none" />
      </g>
    ),
  },
  cane: {
    vb: [20, 90],
    tint: "#3a2416",
    draw: (t) => (
      <g>
        <path d="M4 10 Q4 0 12 2 Q18 4 16 12" stroke="url(#g-silver)" strokeWidth="4" fill="none" />
        <rect x="14" y="10" width="4" height="80" fill={t} />
      </g>
    ),
  },
  lighter: {
    vb: [24, 36],
    tint: "#c8c8c8",
    draw: () => (
      <g>
        <rect x="2" y="12" width="20" height="24" rx="3" fill="url(#g-silver)" />
        <rect x="2" y="2" width="20" height="10" rx="2" fill="url(#g-silver)" />
        <circle cx="16" cy="7" r="2.5" fill="#5c6470" />
        <text x="12" y="28" fontSize="7" textAnchor="middle" fill="#3a3f46" fontFamily="serif" fontWeight="bold">J.R.</text>
      </g>
    ),
  },
  matchbook: {
    vb: [30, 24],
    tint: "#8e2f2f",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="30" height="24" rx="2" fill={t} />
        <rect x="0" y="16" width="30" height="8" fill="#2a2d31" />
        <rect x="4" y="4" width="22" height="7" fill="#efe4cc" opacity="0.9" />
      </g>
    ),
  },
  "cigarette-case": {
    vb: [40, 28],
    tint: "#c8c8c8",
    draw: () => (
      <g>
        <rect x="0" y="0" width="40" height="28" rx="3" fill="url(#g-silver)" />
        <path d="M6 6 L34 22 M34 6 L6 22" stroke="#7a828c" strokeWidth="0.8" />
      </g>
    ),
  },
  candle: {
    vb: [16, 40],
    tint: "#efe4cc",
    draw: (t, v) => (
      <g>
        {v === "lit" && <ellipse cx="8" cy="6" rx="10" ry="12" fill="url(#g-glow)" />}
        <rect x="4" y="12" width="8" height="26" fill={t} />
        <path d="M8 6 L8 12" stroke="#1a1a1a" strokeWidth="1" />
        {v === "lit" && <ellipse cx="8" cy="5" rx="2.5" ry="4.5" fill="#ffc95a" />}
        <ellipse cx="8" cy="38" rx="8" ry="2.5" fill="url(#g-brass)" />
      </g>
    ),
  },
  "candle-stub": {
    vb: [20, 20],
    tint: "#efe4cc",
    draw: (t) => (
      <g>
        <ellipse cx="10" cy="17" rx="10" ry="3" fill="url(#g-brass)" />
        <rect x="6" y="6" width="8" height="10" fill={t} />
        <path d="M6 7 Q8 10 7 13" stroke={shade(t, -0.15)} fill="none" />
        <line x1="10" y1="2" x2="10" y2="6" stroke="#1a1a1a" strokeWidth="1" />
      </g>
    ),
  },
  flashlight: {
    vb: [60, 22],
    tint: "#2a2d31",
    draw: (t) => (
      <g>
        <rect x="0" y="5" width="38" height="12" rx="3" fill={t} />
        <path d="M38 3 L56 0 L56 22 L38 19 Z" fill="url(#g-silver)" />
        <rect x="16" y="2" width="8" height="4" fill="#7a2a2a" />
      </g>
    ),
  },
  battery: {
    vb: [40, 20],
    tint: "#b8924a",
    draw: (t) => (
      <g>
        <rect x="0" y="2" width="34" height="16" rx="2" fill="#2a2d31" />
        <rect x="0" y="2" width="14" height="16" rx="2" fill={t} />
        <rect x="34" y="6" width="5" height="8" fill="url(#g-silver)" />
        <text x="24" y="14" fontSize="8" textAnchor="middle" fill="#efe4cc">+</text>
      </g>
    ),
  },
  fuse: {
    vb: [40, 16],
    tint: "#b8924a",
    draw: () => (
      <g>
        <rect x="0" y="3" width="8" height="10" fill="url(#g-brass)" />
        <rect x="8" y="2" width="24" height="12" rx="2" fill="url(#g-glass)" stroke="#cfe3ea" />
        <path d="M8 8 Q20 2 32 8" stroke="#b8924a" fill="none" />
        <rect x="32" y="3" width="8" height="10" fill="url(#g-brass)" />
      </g>
    ),
  },
  wire: {
    vb: [50, 30],
    tint: "#b87333",
    draw: (t) => (
      <g>
        <path d="M2 20 Q12 0 24 16 T48 10" stroke={t} strokeWidth="3" fill="none" />
        <path d="M2 24 Q14 6 26 20 T48 14" stroke="#2a2d31" strokeWidth="2" fill="none" />
      </g>
    ),
  },
  magnifier: {
    vb: [44, 44],
    tint: "#b8924a",
    draw: () => (
      <g>
        <circle cx="16" cy="16" r="13" fill="url(#g-glass)" stroke="url(#g-brass)" strokeWidth="4" />
        <rect x="26" y="26" width="18" height="6" rx="3" fill={C.woodDark} transform="rotate(45 26 26)" />
      </g>
    ),
  },
  pen: {
    vb: [60, 12],
    tint: "#1d1f22",
    draw: (t) => (
      <g>
        <path d="M0 6 L10 2 L10 10 Z" fill="url(#g-brass)" />
        <rect x="10" y="2" width="44" height="8" rx="3" fill={t} />
        <rect x="40" y="0" width="3" height="11" fill="url(#g-brass)" />
      </g>
    ),
  },
  badge: {
    vb: [34, 40],
    tint: "#b8924a",
    draw: () => (
      <g>
        <path d="M17 0 L22 8 L32 8 L26 16 L30 26 L17 22 L4 26 L8 16 L2 8 L12 8 Z" fill="url(#g-brass)" transform="translate(0 6)" />
        <circle cx="17" cy="20" r="5" fill="#6e5326" />
      </g>
    ),
  },
  "id-badge": {
    vb: [36, 48],
    tint: "#efe4cc",
    draw: (t) => (
      <g>
        <rect x="14" y="0" width="8" height="8" fill="#2a2d31" />
        <rect x="0" y="6" width="36" height="42" rx="3" fill={t} />
        <rect x="0" y="6" width="36" height="9" rx="3" fill={C.burgundy} />
        <rect x="6" y="19" width="12" height="15" fill="#8a8a8a" />
        <rect x="21" y="21" width="11" height="2.5" fill={C.ink} opacity="0.6" />
        <rect x="21" y="27" width="9" height="2.5" fill={C.ink} opacity="0.6" />
        <rect x="6" y="38" width="24" height="5" fill={C.ink} opacity="0.7" />
      </g>
    ),
  },
  gear: {
    vb: [36, 36],
    tint: "#b8924a",
    draw: () => (
      <g>
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x="15" y="0" width="6" height="8" fill="url(#g-brass)" transform={`rotate(${i * 36} 18 18)`} />
        ))}
        <circle cx="18" cy="18" r="12" fill="url(#g-brass)" />
        <circle cx="18" cy="18" r="4" fill="#2a1d10" />
      </g>
    ),
  },
  lens: {
    vb: [30, 30],
    tint: "#9fc3d1",
    draw: () => (
      <g>
        <circle cx="15" cy="15" r="14" fill="url(#g-brass)" />
        <circle cx="15" cy="15" r="11" fill="#5d7f8c" />
        <circle cx="15" cy="15" r="11" fill="url(#g-glass)" />
        <path d="M8 10 Q12 6 16 6" stroke="#fff" strokeWidth="1.5" opacity="0.7" fill="none" />
      </g>
    ),
  },
  crowbar: {
    vb: [80, 20],
    tint: "#7a2a2a",
    draw: (t) => (
      <g>
        <rect x="8" y="8" width="66" height="5" rx="2" fill={t} />
        <path d="M74 8 Q82 4 78 0" stroke={t} strokeWidth="5" fill="none" />
        <path d="M8 8 L0 14 L4 16 L10 13" fill={t} />
      </g>
    ),
  },
  screwdriver: {
    vb: [60, 14],
    tint: "#b8924a",
    draw: (t) => (
      <g>
        <rect x="0" y="2" width="22" height="10" rx="4" fill={t} />
        <rect x="22" y="5" width="34" height="4" fill="url(#g-silver)" />
        <rect x="56" y="5.5" width="4" height="3" fill="#5c6470" />
      </g>
    ),
  },
  wrench: {
    vb: [60, 22],
    tint: "#7b8492",
    draw: () => (
      <g>
        <rect x="12" y="8" width="42" height="6" rx="3" fill="url(#g-steel)" />
        <path d="M0 4 Q4 -2 14 2 L14 6 L8 8 L8 14 L14 16 L14 20 Q4 24 0 18 Z" fill="url(#g-steel)" />
      </g>
    ),
  },
  "brush": {
    vb: [50, 18],
    tint: "#8a6a44",
    draw: (t) => (
      <g>
        <rect x="0" y="5" width="30" height="8" rx="3" fill={t} />
        <rect x="30" y="4" width="6" height="10" fill="url(#g-silver)" />
        <path d="M36 2 L50 0 L50 18 L36 16 Z" fill="#d8c39a" />
      </g>
    ),
  },
  tweezers: {
    vb: [50, 14],
    tint: "#c8c8c8",
    draw: () => (
      <g fill="url(#g-silver)">
        <path d="M0 6 L50 1 L50 3 L0 8 Z" />
        <path d="M0 6 L50 11 L50 13 L0 8 Z" />
      </g>
    ),
  },
  cloth: {
    vb: [40, 30],
    tint: "#c9b48a",
    draw: (t) => (
      <g>
        <path d="M2 8 Q14 0 30 4 Q40 10 36 22 Q22 30 6 26 Q-2 18 2 8 Z" fill={t} />
        <path d="M8 12 Q18 8 28 12 M8 18 Q20 14 30 18" stroke={shade(t, -0.2)} fill="none" />
      </g>
    ),
  },
  vial: {
    vb: [16, 44],
    tint: "#5fa58a",
    draw: (t) => (
      <g>
        <rect x="3" y="0" width="10" height="6" fill="#3a2a1a" />
        <rect x="2" y="6" width="12" height="36" rx="5" fill="url(#g-glass)" stroke="#cfe3ea" strokeWidth="0.8" />
        <rect x="3" y="20" width="10" height="21" rx="4" fill={t} opacity="0.85" />
      </g>
    ),
  },
  "test-tube": {
    vb: [14, 50],
    tint: "#c85a4a",
    draw: (t) => (
      <g>
        <rect x="2" y="0" width="10" height="48" rx="5" fill="url(#g-glass)" stroke="#cfe3ea" strokeWidth="0.8" />
        <rect x="3" y="24" width="8" height="23" rx="4" fill={t} opacity="0.85" />
      </g>
    ),
  },
  "sample-jar": {
    vb: [30, 40],
    tint: "#c9b04a",
    draw: (t) => (
      <g>
        <rect x="3" y="0" width="24" height="7" rx="1" fill="#5c6470" />
        <rect x="1" y="7" width="28" height="33" rx="4" fill="url(#g-glass)" stroke="#cfe3ea" strokeWidth="0.8" />
        <rect x="3" y="18" width="24" height="20" rx="3" fill={t} opacity="0.7" />
        <rect x="6" y="11" width="18" height="6" fill="#efe4cc" />
      </g>
    ),
  },
  bottle: {
    vb: [20, 56],
    tint: "#2b3a2a",
    draw: (t) => (
      <g>
        <rect x="7" y="0" width="6" height="16" fill={t} />
        <path d="M7 16 Q2 20 2 28 L2 54 L18 54 L18 28 Q18 20 13 16 Z" fill={t} />
        <rect x="4" y="32" width="12" height="12" fill="#efe4cc" />
      </g>
    ),
  },
  teacup: {
    vb: [40, 26],
    tint: "#efe4cc",
    draw: (t) => (
      <g>
        <ellipse cx="18" cy="23" rx="18" ry="3" fill={shade(t, -0.1)} />
        <path d="M4 4 L32 4 Q30 20 18 20 Q6 20 4 4 Z" fill={t} />
        <path d="M32 7 Q40 8 36 15 Q34 17 30 16" stroke={t} strokeWidth="2.5" fill="none" />
        <ellipse cx="18" cy="5" rx="14" ry="2.5" fill="#6b4a2a" />
      </g>
    ),
  },
  mug: {
    vb: [30, 30],
    tint: "#2c3e5c",
    draw: (t) => (
      <g>
        <rect x="2" y="4" width="20" height="24" rx="2" fill={t} />
        <path d="M22 9 Q30 10 28 18 Q26 22 22 21" stroke={t} strokeWidth="3" fill="none" />
        <ellipse cx="12" cy="5" rx="10" ry="2" fill="#3a2416" />
      </g>
    ),
  },
  "music-box": {
    vb: [50, 36],
    tint: "#6b2430",
    draw: (t, v) => (
      <g>
        {v === "open" ? (
          <path d="M0 14 L4 0 L46 0 L50 14 Z" fill={shade(t, 0.12)} />
        ) : (
          <rect x="0" y="6" width="50" height="10" rx="2" fill={shade(t, 0.12)} />
        )}
        <rect x="0" y="14" width="50" height="22" rx="2" fill={t} />
        <rect x="18" y="20" width="14" height="8" fill="url(#g-brass)" />
        <rect x="48" y="22" width="6" height="3" fill="url(#g-brass)" />
      </g>
    ),
  },
  "chess-piece": {
    vb: [20, 40],
    tint: "#efe4cc",
    draw: (t) => (
      <g>
        <path d="M4 8 L6 0 L10 4 L14 0 L16 8 Z" fill={t} />
        <path d="M6 8 L14 8 L12 30 L8 30 Z" fill={t} />
        <rect x="2" y="30" width="16" height="8" rx="2" fill={t} />
      </g>
    ),
  },
  compass: {
    vb: [34, 34],
    tint: "#b8924a",
    draw: () => (
      <g>
        <circle cx="17" cy="17" r="16" fill="url(#g-brass)" />
        <circle cx="17" cy="17" r="12" fill="#f2ead8" />
        <path d="M17 6 L20 17 L17 28 L14 17 Z" fill="#8e2f2f" />
        <path d="M17 17 L20 17 L17 28 L14 17 Z" fill="#2a2d31" />
      </g>
    ),
  },
  rose: {
    vb: [24, 50],
    tint: "#6b2430",
    draw: (t) => (
      <g>
        <path d="M12 50 Q10 30 12 14" stroke="#4a5a3a" strokeWidth="2" fill="none" />
        <path d="M12 26 Q4 22 4 30" stroke="#4a5a3a" fill="#4a5a3a" />
        <circle cx="12" cy="10" r="8" fill={t} />
        <path d="M8 8 Q12 4 16 8 Q12 12 8 8" fill={shade(t, -0.3)} />
      </g>
    ),
  },
  feather: {
    vb: [50, 20],
    tint: "#d8d0bc",
    draw: (t) => (
      <g>
        <path d="M0 18 Q20 -2 50 2 Q30 18 0 18 Z" fill={t} />
        <path d="M0 18 L48 3" stroke={shade(t, -0.3)} />
      </g>
    ),
  },
  "luggage-tag": {
    vb: [40, 26],
    tint: "#c9a86a",
    draw: (t) => (
      <g>
        <path d="M8 0 L40 0 L40 26 L8 26 L0 13 Z" fill={t} />
        <circle cx="8" cy="13" r="2.5" fill="#2a1d14" />
        <path d="M8 13 Q-4 4 -2 -6" stroke="#8a2a2a" strokeWidth="1.5" fill="none" />
        <rect x="14" y="7" width="20" height="3" fill={C.ink} opacity="0.6" />
        <rect x="14" y="14" width="16" height="3" fill={C.ink} opacity="0.5" />
      </g>
    ),
  },
  padlock: {
    vb: [30, 36],
    tint: "#b8924a",
    draw: () => (
      <g>
        <path d="M7 16 L7 10 Q15 0 23 10 L23 16" stroke="url(#g-silver)" strokeWidth="4" fill="none" />
        <rect x="2" y="15" width="26" height="21" rx="3" fill="url(#g-brass)" />
        <circle cx="15" cy="24" r="3" fill="#2a1d10" />
        <rect x="14" y="25" width="2" height="6" fill="#2a1d10" />
      </g>
    ),
  },
  "combo-lock": {
    vb: [34, 40],
    tint: "#3c434c",
    draw: () => (
      <g>
        <path d="M8 16 L8 9 Q17 -2 26 9 L26 16" stroke="url(#g-silver)" strokeWidth="4" fill="none" />
        <circle cx="17" cy="27" r="13" fill="url(#g-steel)" />
        <circle cx="17" cy="27" r="9" fill="#1d2126" />
        <line x1="17" y1="20" x2="17" y2="24" stroke="#fff" />
      </g>
    ),
  },
  "lockbox": {
    vb: [50, 36],
    tint: "#3c434c",
    draw: (t, v) => (
      <g>
        <rect x="0" y="6" width="50" height="30" rx="2" fill={t} />
        {v === "open" ? (
          <path d="M0 6 L4 -8 L46 -8 L50 6 Z" fill={shade(t, 0.15)} />
        ) : (
          <g>
            <rect x="0" y="6" width="50" height="8" fill={shade(t, 0.15)} />
            <rect x="20" y="16" width="10" height="12" rx="2" fill="url(#g-brass)" />
          </g>
        )}
      </g>
    ),
  },
  "jewelry-box": {
    vb: [46, 32],
    tint: "#4a2f4f",
    draw: (t, v) => (
      <g>
        <rect x="0" y="12" width="46" height="20" rx="2" fill={t} />
        {v === "open" ? (
          <path d="M0 12 L4 -2 L42 -2 L46 12 Z" fill={shade(t, 0.15)} />
        ) : (
          <path d="M0 14 Q23 2 46 14 Z" fill={shade(t, 0.15)} />
        )}
        <rect x="20" y="16" width="6" height="6" fill="url(#g-brass)" />
      </g>
    ),
  },
  drawer: {
    vb: [60, 28],
    tint: "#5a3a24",
    draw: (t, v) => (
      <g>
        {v === "open" ? (
          <g>
            <path d="M-4 -6 L64 -6 L60 4 L0 4 Z" fill="#120c08" />
            <rect x="-4" y="4" width="68" height="24" fill={shade(t, 0.05)} stroke={shade(t, -0.4)} />
            <rect x="24" y="12" width="12" height="4" rx="2" fill="url(#g-brass)" />
          </g>
        ) : (
          <g>
            <rect x="0" y="0" width="60" height="28" fill={shade(t, 0.02)} stroke={shade(t, -0.4)} />
            <rect x="24" y="10" width="12" height="4" rx="2" fill="url(#g-brass)" />
            <circle cx="30" cy="20" r="2.2" fill="#120c08" />
          </g>
        )}
      </g>
    ),
  },
  floorboard: {
    vb: [80, 14],
    tint: "#5a3a24",
    draw: (t, v) => (
      <g>
        {v === "open" ? (
          <g>
            <rect x="0" y="2" width="80" height="12" fill="#0a0705" />
            <rect x="4" y="-8" width="76" height="8" fill={shade(t, 0.1)} transform="rotate(-6 4 0)" />
          </g>
        ) : (
          <g>
            <rect x="0" y="2" width="80" height="12" fill={shade(t, 0.06)} stroke={shade(t, -0.35)} />
            <rect x="0" y="2" width="80" height="2" fill="#000" opacity="0.35" />
            <circle cx="6" cy="8" r="1.2" fill="#2a1d14" />
            <circle cx="74" cy="8" r="1.2" fill="#2a1d14" />
          </g>
        )}
      </g>
    ),
  },
  "wall-panel": {
    vb: [60, 70],
    tint: "#5a3a24",
    draw: (t, v) => (
      <g>
        {v === "open" ? (
          <g>
            <rect x="0" y="0" width="60" height="70" fill="#0a0705" />
            <path d="M0 0 L-14 6 L-14 64 L0 70 Z" fill={shade(t, 0.1)} />
          </g>
        ) : (
          <g>
            <rect x="0" y="0" width="60" height="70" fill={t} stroke={shade(t, -0.3)} />
            <rect x="8" y="8" width="44" height="54" fill="none" stroke={shade(t, 0.15)} />
          </g>
        )}
      </g>
    ),
  },
  brick: {
    vb: [40, 20],
    tint: "#7a3a2a",
    draw: (t, v) =>
      v === "open" ? (
        <rect x="0" y="0" width="40" height="20" fill="#0a0705" />
      ) : (
        <g>
          <rect x="0" y="0" width="40" height="20" fill={shade(t, 0.08)} stroke="#2a1a14" strokeWidth="1.5" />
          <line x1="4" y1="4" x2="34" y2="4" stroke={shade(t, 0.3)} opacity="0.4" />
        </g>
      ),
  },
  footprint: {
    vb: [40, 26],
    tint: "#3a2a1a",
    draw: (t) => (
      <g fill={t} opacity="0.75">
        <ellipse cx="10" cy="14" rx="7" ry="11" transform="rotate(-70 10 14)" />
        <ellipse cx="30" cy="12" rx="5" ry="6" transform="rotate(-70 30 12)" />
      </g>
    ),
  },
  scratches: {
    vb: [50, 30],
    tint: "#c9b48a",
    draw: (t) => (
      <g stroke={t} strokeWidth="1.5" opacity="0.85">
        <line x1="2" y1="28" x2="40" y2="4" />
        <line x1="8" y1="28" x2="46" y2="6" />
        <line x1="14" y1="28" x2="48" y2="10" />
      </g>
    ),
  },
  ash: {
    vb: [40, 16],
    tint: "#4a4a4a",
    draw: (t) => (
      <g>
        <ellipse cx="20" cy="10" rx="20" ry="6" fill={t} opacity="0.7" />
        <path d="M8 8 L14 5 L18 9 L26 4 L32 9" stroke="#2a2a2a" fill="none" />
        <rect x="16" y="2" width="8" height="5" fill="#d9c8a2" opacity="0.6" transform="rotate(12 20 4)" />
      </g>
    ),
  },
  "wax-drip": {
    vb: [30, 14],
    tint: "#efe4cc",
    draw: (t) => (
      <g fill={t}>
        <ellipse cx="15" cy="9" rx="14" ry="5" />
        <circle cx="25" cy="10" r="3" />
      </g>
    ),
  },
  stain: {
    vb: [50, 24],
    tint: "#6a4a3a",
    draw: (t) => <ellipse cx="25" cy="12" rx="24" ry="10" fill={t} opacity="0.55" />,
  },
  fingerprint: {
    vb: [24, 30],
    tint: "#9fc3d1",
    draw: (t) => (
      <g stroke={t} fill="none" strokeWidth="1" opacity="0.85">
        {[4, 7, 10].map((r) => (
          <ellipse key={r} cx="12" cy="15" rx={r} ry={r * 1.3} />
        ))}
      </g>
    ),
  },
  "tire-track": {
    vb: [120, 24],
    tint: "#2a2a2a",
    draw: (t) => (
      <g fill={t} opacity="0.6">
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={i * 8.5} y="4" width="5" height="16" transform={`skewX(-20)`} />
        ))}
      </g>
    ),
  },
  "chalk-mark": {
    vb: [40, 40],
    tint: "#efe4cc",
    draw: (t) => (
      <g stroke={t} strokeWidth="2.5" fill="none" opacity="0.85">
        <circle cx="20" cy="20" r="14" />
        <path d="M10 20 L30 20 M20 10 L20 30" />
      </g>
    ),
  },
  "reel-tape": {
    vb: [40, 40],
    tint: "#2a2d31",
    draw: (t) => (
      <g>
        <circle cx="20" cy="20" r="19" fill={t} />
        <circle cx="20" cy="20" r="14" fill="#5a3a24" />
        {[0, 120, 240].map((a) => (
          <circle key={a} cx={20 + Math.cos((a * Math.PI) / 180) * 8} cy={20 + Math.sin((a * Math.PI) / 180) * 8} r="3.5" fill={t} />
        ))}
        <circle cx="20" cy="20" r="3" fill="url(#g-silver)" />
      </g>
    ),
  },
  camera: {
    vb: [50, 36],
    tint: "#2a2d31",
    draw: (t) => (
      <g>
        <rect x="0" y="8" width="50" height="28" rx="3" fill={t} />
        <rect x="6" y="2" width="14" height="8" fill={t} />
        <circle cx="26" cy="22" r="10" fill="url(#g-silver)" />
        <circle cx="26" cy="22" r="6" fill="#1a2a33" />
        <rect x="38" y="12" width="7" height="4" fill="#efe4cc" />
      </g>
    ),
  },
  "vinyl": {
    vb: [40, 40],
    tint: "#15161b",
    draw: (t) => (
      <g>
        <circle cx="20" cy="20" r="19" fill={t} />
        {[15, 12, 9].map((r) => (
          <circle key={r} cx="20" cy="20" r={r} fill="none" stroke="#33343a" strokeWidth="0.6" />
        ))}
        <circle cx="20" cy="20" r="6" fill={C.burgundy} />
      </g>
    ),
  },
  orrery: {
    vb: [60, 60],
    tint: "#b8924a",
    draw: () => (
      <g>
        <ellipse cx="30" cy="30" rx="27" ry="10" fill="none" stroke="url(#g-brass)" strokeWidth="1.6" />
        <ellipse cx="30" cy="30" rx="18" ry="22" fill="none" stroke="url(#g-brass)" strokeWidth="1.6" transform="rotate(30 30 30)" />
        <circle cx="30" cy="30" r="8" fill="url(#g-brass)" />
        <circle cx="56" cy="30" r="3.5" fill="#6aa2c0" />
        <circle cx="18" cy="12" r="3" fill="#c0704a" />
        <rect x="28" y="38" width="4" height="16" fill="url(#g-brass)" />
        <ellipse cx="30" cy="56" rx="12" ry="4" fill={C.woodDark} />
      </g>
    ),
  },
  "orrery-part": {
    vb: [40, 40],
    tint: "#b8924a",
    draw: () => (
      <g>
        <path d="M4 20 A16 16 0 0 1 36 20" stroke="url(#g-brass)" strokeWidth="3" fill="none" />
        <circle cx="36" cy="20" r="4" fill="#6aa2c0" />
        <circle cx="20" cy="30" r="5" fill="url(#g-brass)" />
      </g>
    ),
  },
  artifact: {
    vb: [40, 50],
    tint: "#b8924a",
    draw: () => (
      <g>
        <path d="M8 50 L12 30 Q4 22 10 10 Q20 0 30 10 Q36 22 28 30 L32 50 Z" fill="url(#g-brass)" />
        <circle cx="20" cy="18" r="5" fill="#6a2a3a" />
      </g>
    ),
  },
  "figurine": {
    vb: [24, 44],
    tint: "#d8d0bc",
    draw: (t) => (
      <g>
        <circle cx="12" cy="7" r="6" fill={t} />
        <path d="M4 44 L6 16 Q12 12 18 16 L20 44 Z" fill={t} />
      </g>
    ),
  },
  thermos: {
    vb: [20, 50],
    tint: "#3f5d3a",
    draw: (t) => (
      <g>
        <rect x="3" y="0" width="14" height="10" rx="2" fill="url(#g-silver)" />
        <rect x="1" y="10" width="18" height="40" rx="4" fill={t} />
        <rect x="1" y="22" width="18" height="4" fill="url(#g-silver)" />
      </g>
    ),
  },
  mitten: {
    vb: [30, 40],
    tint: "#8e2f2f",
    draw: (t) => (
      <g>
        <path d="M6 40 L4 14 Q4 2 14 2 Q24 2 24 14 L24 20 Q30 16 30 24 L24 34 L24 40 Z" fill={t} />
        <rect x="4" y="32" width="20" height="8" fill="#efe4cc" />
      </g>
    ),
  },
  "ice-pick": {
    vb: [60, 30],
    tint: "#7b8492",
    draw: () => (
      <g>
        <rect x="4" y="12" width="44" height="6" rx="2" fill="#5a3a24" />
        <path d="M44 4 L60 0 L50 14 L58 28 L44 22 Z" fill="url(#g-steel)" />
      </g>
    ),
  },
  "frozen-block": {
    vb: [50, 40],
    tint: "#cfe6ef",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="50" height="40" rx="4" fill={t} opacity="0.8" />
        <rect x="0" y="0" width="50" height="40" rx="4" fill="url(#g-ice)" opacity="0.6" />
        <rect x="14" y="12" width="22" height="16" fill="#5a3a24" opacity="0.4" />
        <path d="M6 6 L18 4" stroke="#fff" strokeWidth="2" opacity="0.8" />
      </g>
    ),
  },
  "snow-mound": {
    vb: [60, 24],
    tint: "#eef6f9",
    draw: (t) => (
      <g>
        <path d="M0 24 Q10 4 30 6 Q50 2 60 24 Z" fill={t} />
        <path d="M14 14 Q26 8 38 12" stroke="#b8d3df" fill="none" />
      </g>
    ),
  },
  sextant: {
    vb: [44, 40],
    tint: "#b8924a",
    draw: () => (
      <g>
        <path d="M22 2 L4 36 Q22 42 40 36 Z" fill="none" stroke="url(#g-brass)" strokeWidth="2.5" />
        <path d="M4 36 Q22 42 40 36" stroke="url(#g-brass)" strokeWidth="4" fill="none" />
        <circle cx="22" cy="4" r="3" fill="url(#g-brass)" />
        <rect x="18" y="14" width="10" height="5" fill="url(#g-steel)" />
      </g>
    ),
  },
  "radio-handheld": {
    vb: [24, 46],
    tint: "#3a3f46",
    draw: (t) => (
      <g>
        <rect x="16" y="0" width="3" height="12" fill="#1a1a1a" />
        <rect x="2" y="10" width="20" height="36" rx="3" fill={t} />
        <rect x="5" y="14" width="14" height="10" fill="#8fb08a" />
        {[28, 32, 36].map((y) => (
          <rect key={y} x="5" y={y} width="14" height="2" fill="#1a1a1a" />
        ))}
      </g>
    ),
  },
  "punch-card": {
    vb: [56, 26],
    tint: "#e6d79a",
    draw: (t) => (
      <g>
        <path d="M6 0 L56 0 L56 26 L0 26 L0 6 Z" fill={t} />
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={i} x={6 + (i % 10) * 5} y={6 + Math.floor(i / 10) * 9 + ((i * 3) % 4)} width="2" height="4" fill="#3a2a1a" />
        ))}
      </g>
    ),
  },
  "evidence-bag": {
    vb: [40, 50],
    tint: "#cfe3ea",
    draw: () => (
      <g>
        <rect x="0" y="0" width="40" height="50" rx="2" fill="url(#g-glass)" stroke="#cfe3ea" />
        <rect x="0" y="0" width="40" height="8" fill="#b02a2a" opacity="0.8" />
        <rect x="6" y="38" width="28" height="8" fill="#efe4cc" />
        <rect x="12" y="16" width="16" height="14" fill="#5a3a24" opacity="0.6" />
      </g>
    ),
  },
  "cipher-wheel": {
    vb: [44, 44],
    tint: "#b8924a",
    draw: () => (
      <g>
        <circle cx="22" cy="22" r="21" fill="url(#g-brass)" />
        <circle cx="22" cy="22" r="15" fill="#efe4cc" />
        <circle cx="22" cy="22" r="9" fill="url(#g-brass)" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="22" y1="2" x2="22" y2="7" stroke="#6e5326" transform={`rotate(${i * 30} 22 22)`} />
        ))}
      </g>
    ),
  },
  "sealed-envelope": {
    vb: [56, 36],
    tint: "#e8dcc0",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="56" height="36" fill={t} stroke="#9a8a6a" strokeWidth="0.6" />
        <path d="M0 0 L28 20 L56 0" fill="none" stroke="#9a8a6a" />
        <circle cx="28" cy="20" r="6" fill={C.burgundy} />
        <text x="28" y="23" fontSize="7" textAnchor="middle" fill="#efe4cc" fontFamily="serif">H</text>
      </g>
    ),
  },
  "crest": {
    vb: [40, 46],
    tint: "#6b2430",
    draw: (t) => (
      <g>
        <path d="M0 0 L40 0 L40 24 Q40 40 20 46 Q0 40 0 24 Z" fill="url(#g-brass)" />
        <path d="M5 5 L35 5 L35 24 Q35 36 20 41 Q5 36 5 24 Z" fill={t} />
        <path d="M20 10 Q26 16 20 22 Q14 28 20 34 M12 22 L28 22" stroke="#e0c27a" strokeWidth="2" fill="none" />
      </g>
    ),
  },
  "plaque": {
    vb: [80, 30],
    tint: "#b8924a",
    draw: () => (
      <g>
        <rect x="0" y="0" width="80" height="30" rx="3" fill="url(#g-brass)" />
        <rect x="4" y="4" width="72" height="22" rx="2" fill="none" stroke="#6e5326" />
        <rect x="14" y="10" width="52" height="3" fill="#6e5326" />
        <rect x="22" y="17" width="36" height="3" fill="#6e5326" />
      </g>
    ),
  },
  "symbol-tile": {
    vb: [30, 30],
    tint: "#3a3f46",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="30" height="30" rx="3" fill={t} stroke="url(#g-brass)" />
        {v === "sun" && <circle cx="15" cy="15" r="7" fill="#e0c27a" />}
        {v === "moon" && <path d="M18 6 A9 9 0 1 0 18 24 A7 7 0 1 1 18 6" fill="#e0c27a" />}
        {v === "star" && <path d="M15 5 L18 13 L26 13 L20 18 L22 26 L15 21 L8 26 L10 18 L4 13 L12 13 Z" fill="#e0c27a" />}
        {(!v || v === "eye") && <ellipse cx="15" cy="15" rx="9" ry="5" fill="none" stroke="#e0c27a" strokeWidth="2" />}
      </g>
    ),
  },
  "symbol-dial": {
    vb: [80, 80],
    tint: "#3a3f46",
    draw: (t) => (
      <g>
        <circle cx="40" cy="40" r="38" fill={t} stroke="url(#g-brass)" strokeWidth="4" />
        <circle cx="40" cy="40" r="14" fill="url(#g-brass)" />
        <circle cx="40" cy="14" r="6" fill="#e0c27a" />
        <path d="M66 34 A7 7 0 1 0 66 46 A5 5 0 1 1 66 34" fill="#e0c27a" />
        <path d="M40 60 L42 65 L47 65 L43 68 L45 73 L40 70 L35 73 L37 68 L33 65 L38 65 Z" fill="#e0c27a" />
        <ellipse cx="14" cy="40" rx="6" ry="3.5" fill="none" stroke="#e0c27a" strokeWidth="1.5" />
      </g>
    ),
  },
  keypad: {
    vb: [40, 54],
    tint: "#3a3f46",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="40" height="54" rx="3" fill={t} />
        <rect x="5" y="5" width="30" height="9" fill={v === "open" ? "#3a8a5a" : "#5a1a1a"} />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={6 + (i % 3) * 10} y={18 + Math.floor(i / 3) * 9} width="8" height="7" rx="1" fill="url(#g-silver)" />
        ))}
      </g>
    ),
  },
  "card-reader": {
    vb: [30, 44],
    tint: "#2a2d31",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="30" height="44" rx="3" fill={t} />
        <rect x="6" y="6" width="18" height="4" fill={v === "open" ? "#4ad07a" : "#d04a4a"} />
        <rect x="4" y="18" width="22" height="3" fill="#0a0a0a" />
        <rect x="8" y="26" width="14" height="12" fill="#3a3f46" />
      </g>
    ),
  },
  lever: {
    vb: [30, 50],
    tint: "#3a3f46",
    draw: (t, v) => (
      <g>
        <rect x="4" y="30" width="22" height="20" rx="2" fill={t} />
        <rect x="13" y="6" width="4" height="30" fill="url(#g-silver)" transform={v === "open" ? "rotate(40 15 36)" : "rotate(-30 15 36)"} />
        <circle cx={v === "open" ? 32 : 2} cy="12" r="5" fill="#8e2f2f" />
      </g>
    ),
  },
  "switch": {
    vb: [24, 36],
    tint: "#d8d0bc",
    draw: (t, v) => (
      <g>
        <rect x="0" y="0" width="24" height="36" rx="2" fill={t} />
        <rect x="8" y="8" width="8" height="20" rx="2" fill="#2a2d31" />
        <rect x="9" y={v === "open" ? 9 : 18} width="6" height="9" rx="2" fill="url(#g-silver)" />
      </g>
    ),
  },
  "light-beam": {
    vb: [100, 100],
    tint: "#fff4d0",
    draw: (t) => <ellipse cx="50" cy="50" rx="50" ry="50" fill={t} opacity="0.12" />,
  },
  shadow: {
    vb: [100, 100],
    tint: "#000",
    draw: () => <ellipse cx="50" cy="50" rx="50" ry="50" fill="#04050a" opacity="0.88" />,
  },
  dust: {
    vb: [100, 60],
    tint: "#8a8070",
    draw: (t) => <ellipse cx="50" cy="30" rx="50" ry="30" fill={t} opacity="0.7" filter="url(#f-soft)" />,
  },
  frost: {
    vb: [100, 60],
    tint: "#e8f4f8",
    draw: (t) => <rect x="0" y="0" width="100" height="60" rx="10" fill={t} opacity="0.85" filter="url(#f-soft)" />,
  },
  cobweb: {
    vb: [60, 60],
    tint: "#d8d0bc",
    draw: (t) => (
      <g stroke={t} strokeWidth="0.7" fill="none" opacity="0.55">
        {[0, 15, 30, 45, 60, 75, 90].map((a) => (
          <line key={a} x1="0" y1="0" x2={60 * Math.cos((a * Math.PI) / 180)} y2={60 * Math.sin((a * Math.PI) / 180)} />
        ))}
        {[14, 26, 40, 54].map((r) => (
          <path key={r} d={`M${r} 0 Q${r * 0.75} ${r * 0.75} 0 ${r}`} />
        ))}
      </g>
    ),
  },
  rat: {
    vb: [40, 20],
    tint: "#5a5550",
    draw: (t) => (
      <g>
        <ellipse cx="18" cy="13" rx="12" ry="7" fill={t} />
        <circle cx="30" cy="10" r="5" fill={t} />
        <circle cx="32" cy="9" r="1" fill="#000" />
        <path d="M6 14 Q-2 18 2 8" stroke={t} fill="none" />
      </g>
    ),
  },
  cat: {
    vb: [50, 40],
    tint: "#1d1f22",
    draw: (t) => (
      <g>
        <ellipse cx="24" cy="28" rx="18" ry="11" fill={t} />
        <circle cx="38" cy="16" r="9" fill={t} />
        <path d="M32 10 L34 2 L38 8 M40 8 L44 2 L45 11" fill={t} />
        <circle cx="41" cy="15" r="1.5" fill="#e0c24a" />
        <path d="M6 30 Q-2 20 6 12" stroke={t} strokeWidth="3" fill="none" />
      </g>
    ),
  },
  "pocket-diary": {
    vb: [30, 40],
    tint: "#2c3e5c",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="30" height="40" rx="2" fill={t} />
        <rect x="26" y="4" width="4" height="32" fill="#efe4cc" />
        <rect x="6" y="8" width="16" height="4" fill="url(#g-brass)" />
        <path d="M14 40 L14 46 L16 44 L18 46 L18 40" fill={C.burgundy} />
      </g>
    ),
  },
  coat: {
    vb: [50, 90],
    tint: "#3a3328",
    draw: (t, v) => (
      <g>
        <path d="M18 6 Q25 0 32 6" stroke="url(#g-silver)" strokeWidth="2" fill="none" />
        <path d="M6 14 L25 8 L44 14 L48 88 L2 88 Z" fill={t} />
        <path d="M25 8 L18 40 L25 88 M25 8 L32 40" stroke={shade(t, -0.35)} fill="none" strokeWidth="1.5" />
        <path d="M6 14 L0 60 L6 62 L10 22 M44 14 L50 60 L44 62 L40 22" fill={shade(t, -0.1)} />
        {v === "scorched" && (
          <g>
            <path d="M0 52 L6 62 L10 58 L4 48 Z" fill="#1a1008" />
            <path d="M30 70 Q38 64 46 72 L48 88 L30 88 Z" fill="#1a1008" opacity="0.85" />
            <rect x="30" y="20" width="10" height="4" fill="#efe4cc" />
          </g>
        )}
      </g>
    ),
  },
  toolbox: {
    vb: [60, 36],
    tint: "#8e2f2f",
    draw: (t, v) => (
      <g>
        <path d="M18 8 L18 2 L42 2 L42 8" stroke="#2a2d31" strokeWidth="3" fill="none" />
        {v === "open" ? (
          <g>
            <rect x="0" y="12" width="60" height="24" rx="2" fill={t} />
            <rect x="2" y="12" width="56" height="6" fill="#1a0c0c" />
            <path d="M0 12 L-6 2 L30 2 L30 12 Z" fill={shade(t, 0.12)} />
          </g>
        ) : (
          <g>
            <rect x="0" y="8" width="60" height="28" rx="2" fill={t} />
            <rect x="0" y="8" width="60" height="7" fill={shade(t, 0.12)} />
            <rect x="26" y="16" width="8" height="5" fill="url(#g-silver)" />
          </g>
        )}
      </g>
    ),
  },
  valves: {
    vb: [120, 60],
    tint: "#7a6a5a",
    draw: (t, v) => (
      <g>
        <rect x="0" y="38" width="120" height="12" fill={t} />
        {[20, 60, 100].map((x, i) => (
          <g key={x}>
            <rect x={x - 3} y="22" width="6" height="18" fill={shade(t, -0.2)} />
            <circle cx={x} cy="20" r="13" fill="none" stroke={["#8e2f2f", "#3f5d3a", "#d8d0bc"][i]} strokeWidth="4" />
            <path d={`M${x - 13} 20 L${x + 13} 20 M${x} 7 L${x} 33`} stroke={["#8e2f2f", "#3f5d3a", "#d8d0bc"][i]} strokeWidth="2.5" transform={v === "open" ? `rotate(45 ${x} 20)` : undefined} />
          </g>
        ))}
        <rect x="0" y="50" width="120" height="10" fill={shade(t, -0.3)} />
      </g>
    ),
  },
  telephone: {
    vb: [50, 40],
    tint: "#15161b",
    draw: (t) => (
      <g>
        <path d="M6 40 L10 18 L40 18 L44 40 Z" fill={t} />
        <circle cx="25" cy="29" r="7" fill="#efe4cc" />
        <circle cx="25" cy="29" r="2" fill={t} />
        <path d="M2 12 Q2 4 10 4 L40 4 Q48 4 48 12 L42 14 L38 10 L12 10 L8 14 Z" fill={t} />
      </g>
    ),
  },
  teapot: {
    vb: [50, 40],
    tint: "#efe4cc",
    draw: (t) => (
      <g>
        <ellipse cx="22" cy="26" rx="16" ry="13" fill={t} />
        <path d="M37 22 Q48 16 48 8" stroke={t} strokeWidth="4" fill="none" />
        <path d="M6 18 Q-2 22 4 32" stroke={t} strokeWidth="4" fill="none" />
        <rect x="14" y="9" width="16" height="5" rx="2" fill={shade(t, -0.1)} />
        <circle cx="22" cy="8" r="3" fill={shade(t, -0.2)} />
        <path d="M10 26 Q22 32 34 26" stroke="#3f5d7a" strokeWidth="1.5" fill="none" />
      </g>
    ),
  },
  wastebin: {
    vb: [40, 50],
    tint: "#4d5560",
    draw: (t) => (
      <g>
        <path d="M2 4 L38 4 L34 50 L6 50 Z" fill={t} />
        {[10, 18, 26].map((x) => (
          <line key={x} x1={x} y1="8" x2={x - 1} y2="46" stroke={shade(t, -0.3)} />
        ))}
        <path d="M6 4 Q12 -4 18 3 Q24 -6 30 3" fill="#efe4cc" opacity="0.9" />
      </g>
    ),
  },
  chain: {
    vb: [60, 20],
    tint: "#7b8492",
    draw: () => (
      <g fill="none" stroke="url(#g-steel)" strokeWidth="3">
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={i} cx={8 + i * 11} cy="10" rx="7" ry={i % 2 ? 3 : 6} />
        ))}
      </g>
    ),
  },
  extinguisher: {
    vb: [24, 60],
    tint: "#9a2a2a",
    draw: (t) => (
      <g>
        <rect x="4" y="12" width="16" height="48" rx="6" fill={t} />
        <rect x="8" y="4" width="8" height="10" fill="#2a2d31" />
        <path d="M16 6 Q24 8 22 22" stroke="#2a2d31" strokeWidth="2.5" fill="none" />
        <rect x="6" y="28" width="12" height="10" fill="#efe4cc" />
      </g>
    ),
  },
  "tape-recorder": {
    vb: [90, 60],
    tint: "#4a3a2a",
    draw: (t, v) => (
      <g>
        <rect x="0" y="14" width="90" height="46" rx="4" fill={t} />
        <rect x="4" y="18" width="82" height="22" fill={shade(t, -0.3)} />
        {[22, 68].map((x) => (
          <g key={x}>
            <circle cx={x} cy="14" r="13" fill={v === "open" ? "#15161b" : "#2a2d31"} stroke="url(#g-silver)" />
            <circle cx={x} cy="14" r="3" fill="url(#g-silver)" />
          </g>
        ))}
        {v === "open" && <path d="M22 26 L45 34 L68 26" stroke="#5a3a24" strokeWidth="2" fill="none" />}
        {[14, 30, 46, 62].map((x) => (
          <rect key={x} x={x} y="46" width="10" height="8" rx="1" fill="#d8d0bc" />
        ))}
        <circle cx="80" cy="50" r="3" fill={v === "open" ? "#e0a84a" : "#5a1a1a"} />
      </g>
    ),
  },
  "time-clock": {
    vb: [50, 70],
    tint: "#5d6670",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="50" height="70" rx="4" fill={t} />
        <circle cx="25" cy="22" r="15" fill="#efe4cc" stroke="url(#g-brass)" strokeWidth="2" />
        <path d="M25 22 L25 12 M25 22 L32 25" stroke={C.ink} strokeWidth="1.6" />
        <rect x="10" y="44" width="30" height="5" fill="#1a1a1a" />
        <rect x="16" y="54" width="18" height="10" fill={shade(t, -0.25)} />
      </g>
    ),
  },
  "card-rack": {
    vb: [80, 90],
    tint: "#6c747e",
    draw: (t) => (
      <g>
        <rect x="0" y="0" width="80" height="90" fill={shade(t, -0.25)} />
        {Array.from({ length: 4 }).map((_, r) =>
          Array.from({ length: 3 }).map((__, c) => (
            <g key={`${r}${c}`}>
              <rect x={6 + c * 25} y={6 + r * 21} width="20" height="18" fill={t} />
              <rect x={9 + c * 25} y={2 + r * 21} width="14" height="14" fill="#e6d79a" opacity={((r + c) % 4 === 1) ? 0 : 1} />
            </g>
          )),
        )}
      </g>
    ),
  },
  binoculars: {
    vb: [50, 30],
    tint: "#2a2d31",
    draw: (t) => (
      <g>
        <rect x="4" y="6" width="16" height="22" rx="5" fill={t} />
        <rect x="30" y="6" width="16" height="22" rx="5" fill={t} />
        <rect x="18" y="10" width="14" height="8" fill={shade(t, 0.2)} />
        <circle cx="12" cy="26" r="5" fill="url(#g-glass)" stroke="url(#g-silver)" />
        <circle cx="38" cy="26" r="5" fill="url(#g-glass)" stroke="url(#g-silver)" />
      </g>
    ),
  },
  bucket: {
    vb: [40, 40],
    tint: "#9a2a2a",
    draw: (t) => (
      <g>
        <path d="M4 8 L36 8 L32 40 L8 40 Z" fill={t} />
        <ellipse cx="20" cy="8" rx="16" ry="4" fill={shade(t, -0.35)} />
        <path d="M4 8 Q20 -10 36 8" stroke="#2a2d31" strokeWidth="2" fill="none" />
        <text x="20" y="30" fontSize="8" textAnchor="middle" fill="#efe4cc" fontFamily="serif">FIRE</text>
      </g>
    ),
  },
  "file-box": {
    vb: [60, 40],
    tint: "#a68a5e",
    draw: (t) => (
      <g>
        <rect x="0" y="6" width="60" height="34" fill={t} />
        <rect x="-2" y="0" width="64" height="8" fill={shade(t, 0.12)} />
        <rect x="18" y="16" width="24" height="10" fill="#efe4cc" />
        <rect x="24" y="30" width="12" height="4" rx="2" fill={shade(t, -0.4)} />
      </g>
    ),
  },
};
