import type { ReactNode } from "react";

/** Illustrated photographs, all drawn in a 300 × 200 viewBox. */
export const PICTURE_W = 300;
export const PICTURE_H = 200;

const sepia = {
  bg: "#d8c7a4",
  mid: "#a68c66",
  dark: "#4a3a28",
  ink: "#2a2018",
  light: "#efe2c4",
};

function Figure({ x, h = 1, hat, coat = sepia.dark, label }: { x: number; h?: number; hat?: boolean; coat?: string; label?: string }) {
  const y = 190 - 120 * h;
  return (
    <g>
      <ellipse cx={x} cy={y + 18} rx="11" ry="13" fill={sepia.light} />
      {hat && <path d={`M${x - 16} ${y + 8} L${x + 16} ${y + 8} L${x + 10} ${y - 4} L${x - 10} ${y - 4} Z`} fill={sepia.ink} />}
      {!hat && <path d={`M${x - 11} ${y + 14} Q${x} ${y - 2} ${x + 11} ${y + 14}`} fill={sepia.mid} />}
      <path d={`M${x - 22} 192 L${x - 18} ${y + 40} Q${x} ${y + 28} ${x + 18} ${y + 40} L${x + 22} 192 Z`} fill={coat} />
      {label && (
        <text x={x} y={y - 10} fontSize="9" textAnchor="middle" fill={sepia.ink} fontFamily="serif" fontStyle="italic">
          {label}
        </text>
      )}
    </g>
  );
}

export const PICTURES: Record<string, { title: string; draw: () => ReactNode }> = {
  trio: {
    title: "Three colleagues at Larkspur",
    draw: () => (
      <g>
        <rect width="300" height="200" fill={sepia.bg} />
        <rect x="20" y="30" width="260" height="110" fill={sepia.mid} />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={34 + i * 42} y="46" width="24" height="34" fill={sepia.dark} opacity="0.7" />
        ))}
        <rect x="120" y="96" width="60" height="44" fill={sepia.dark} />
        <text x="150" y="26" fontSize="12" textAnchor="middle" fill={sepia.ink} fontFamily="serif" letterSpacing="3">LARKSPUR INSTITUTE</text>
        <Figure x={78} h={1.05} coat="#3a2e22" />
        <Figure x={150} h={0.95} coat="#5a4630" />
        <Figure x={222} h={1.1} hat coat="#2a2018" />
        <rect x="200" y="140" width="10" height="6" fill={sepia.light} />
        <text x="150" y="196" fontSize="8" textAnchor="middle" fill={sepia.ink} fontFamily="serif">E.H. · H.C. · J.R. — opening day</text>
      </g>
    ),
  },
  mansion: {
    title: "Hollowmere House",
    draw: () => (
      <g>
        <rect width="300" height="200" fill="#c9b894" />
        <rect y="150" width="300" height="50" fill="#8a7a5a" />
        <path d="M40 150 L40 70 L150 30 L260 70 L260 150 Z" fill="#5a4a36" />
        <path d="M30 74 L150 22 L270 74" stroke="#2a2018" strokeWidth="6" fill="none" />
        <rect x="140" y="110" width="20" height="40" fill="#2a2018" />
        {[60, 95, 190, 225].map((x) => (
          <g key={x}>
            <rect x={x} y="80" width="18" height="24" fill="#2a2018" />
            <rect x={x} y="116" width="18" height="24" fill="#2a2018" />
          </g>
        ))}
        <rect x="200" y="20" width="16" height="40" fill="#4a3a28" />
        <circle cx="150" cy="70" r="10" fill="#efe2c4" opacity="0.8" />
        <path d="M144 70 L156 70 M150 64 L150 76" stroke="#4a3a28" />
      </g>
    ),
  },
  orrery: {
    title: "The Hollowmere Orrery",
    draw: () => (
      <g>
        <rect width="300" height="200" fill="#1b2235" />
        <ellipse cx="150" cy="100" rx="120" ry="40" fill="none" stroke="#e0c27a" strokeWidth="2" />
        <ellipse cx="150" cy="100" rx="80" ry="70" fill="none" stroke="#e0c27a" strokeWidth="2" transform="rotate(25 150 100)" />
        <ellipse cx="150" cy="100" rx="50" ry="18" fill="none" stroke="#e0c27a" strokeWidth="1.5" transform="rotate(-20 150 100)" />
        <circle cx="150" cy="100" r="20" fill="#e0c27a" />
        <circle cx="270" cy="100" r="8" fill="#6aa2c0" />
        <circle cx="100" cy="40" r="7" fill="#c0704a" />
        <circle cx="196" cy="84" r="5" fill="#d8d0bc" />
        <text x="150" y="190" fontSize="10" textAnchor="middle" fill="#e0c27a" fontFamily="serif" letterSpacing="2">SUN · MOON · STAR · EYE</text>
      </g>
    ),
  },
  train: {
    title: "The Northern Night Mail",
    draw: () => (
      <g>
        <rect width="300" height="200" fill="#25304a" />
        <circle cx="240" cy="40" r="16" fill="#efe2c4" opacity="0.8" />
        <rect y="150" width="300" height="50" fill="#14161f" />
        <rect x="10" y="90" width="230" height="60" rx="8" fill="#3a2430" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={24 + i * 54} y="102" width="38" height="24" fill="#e8c46a" opacity="0.7" />
        ))}
        <path d="M240 150 L240 80 L290 80 L296 150 Z" fill="#1d1f22" />
        <rect x="250" y="60" width="14" height="22" fill="#1d1f22" />
        <ellipse cx="258" cy="50" rx="18" ry="10" fill="#8a8a9a" opacity="0.5" />
        <text x="125" y="84" fontSize="9" textAnchor="middle" fill="#e0c27a" fontFamily="serif" letterSpacing="2">PLATFORM 4 · NORTHBOUND</text>
      </g>
    ),
  },
  museum: {
    title: "Opening night, Wrenmoor Museum",
    draw: () => (
      <g>
        <rect width="300" height="200" fill="#2a2730" />
        <rect x="0" y="150" width="300" height="50" fill="#3a3530" />
        {[30, 250].map((x) => (
          <rect key={x} x={x} y="20" width="20" height="130" fill="#d8d0bc" />
        ))}
        <path d="M150 20 L120 150 L180 150 Z" fill="#fff4d0" opacity="0.15" />
        <rect x="125" y="110" width="50" height="40" fill="#1d1a20" />
        <rect x="120" y="106" width="60" height="6" fill="#b8924a" />
        <circle cx="150" cy="92" r="12" fill="none" stroke="#e0c27a" strokeWidth="2" />
        <circle cx="150" cy="92" r="4" fill="#e0c27a" />
        <Figure x={80} h={0.9} coat="#1d1d24" />
        <Figure x={212} h={0.95} hat coat="#15161b" />
        <text x="150" y="190" fontSize="8" textAnchor="middle" fill="#d8d0bc" fontFamily="serif">Curator J. Reed presents the Hollowmere Orrery</text>
      </g>
    ),
  },
  observatory: {
    title: "Northreach Observatory",
    draw: () => (
      <g>
        <rect width="300" height="200" fill="#5a6f88" />
        <rect y="140" width="300" height="60" fill="#e8f2f6" />
        <path d="M0 150 Q80 120 160 146 T300 136 L300 200 L0 200 Z" fill="#f6fbfd" />
        <rect x="100" y="90" width="100" height="56" fill="#3a4250" />
        <path d="M96 92 A54 54 0 0 1 204 92 Z" fill="#9aa3ae" />
        <rect x="146" y="40" width="10" height="40" fill="#2a2d31" transform="rotate(25 150 70)" />
        <rect x="140" y="112" width="18" height="34" fill="#1a1d22" />
        <rect x="170" y="112" width="16" height="14" fill="#e8c46a" opacity="0.8" />
        {Array.from({ length: 20 }).map((_, i) => (
          <circle key={i} cx={(i * 47) % 300} cy={(i * 31) % 130} r="1.5" fill="#fff" />
        ))}
      </g>
    ),
  },
  vance: {
    title: "Inspector Margot Vance",
    draw: () => (
      <g>
        <rect width="300" height="200" fill="#cdbb98" />
        <rect x="100" y="0" width="100" height="200" fill="#b8a47e" />
        <ellipse cx="150" cy="78" rx="28" ry="34" fill="#efe2c4" />
        <path d="M110 58 L190 58 L176 34 L124 34 Z" fill="#2a2018" />
        <rect x="100" y="56" width="100" height="8" rx="4" fill="#2a2018" />
        <path d="M122 82 Q122 112 150 116 Q178 112 178 82 Q176 104 150 106 Q124 104 122 82" fill="#5a4630" />
        <path d="M84 200 L96 136 Q150 112 204 136 L216 200 Z" fill="#3a2e22" />
        <path d="M140 130 L150 160 L160 130" fill="#efe2c4" />
        <text x="150" y="194" fontSize="9" textAnchor="middle" fill="#efe2c4" fontFamily="serif">M. VANCE · WRENMOOR C.I.D.</text>
      </g>
    ),
  },
  fire: {
    title: "The Larkspur fire",
    draw: () => (
      <g>
        <rect width="300" height="200" fill="#2a2018" />
        <rect x="50" y="70" width="200" height="110" fill="#4a3a28" />
        {[70, 120, 170, 210].map((x) => (
          <rect key={x} x={x} y="90" width="22" height="30" fill="#f0a040" opacity="0.85" />
        ))}
        <path d="M60 70 Q80 20 110 60 Q130 10 160 56 Q190 0 220 60 Q240 30 250 70 Z" fill="#f08a30" opacity="0.6" />
        <path d="M100 66 Q120 30 140 62 Q160 26 190 62 Z" fill="#ffd27a" opacity="0.6" />
        <rect x="132" y="140" width="30" height="40" fill="#1a1410" />
        <rect x="128" y="150" width="38" height="5" fill="#8a8a8a" />
        <text x="150" y="196" fontSize="8" textAnchor="middle" fill="#d8c7a4" fontFamily="serif">Wrenmoor Gazette archive — the night of the fire</text>
      </g>
    ),
  },
  meeting: {
    title: "Two figures at the café",
    draw: () => (
      <g>
        <rect width="300" height="200" fill="#c9b894" />
        <rect x="0" y="0" width="300" height="110" fill="#8a7a5a" />
        <rect x="20" y="20" width="120" height="70" fill="#d8c7a4" opacity="0.6" />
        <text x="80" y="60" fontSize="12" textAnchor="middle" fill="#4a3a28" fontFamily="serif">CAFÉ LUNE</text>
        <rect x="100" y="130" width="100" height="8" fill="#4a3a28" />
        <rect x="146" y="138" width="8" height="52" fill="#4a3a28" />
        <Figure x={80} h={0.85} coat="#3a2e22" hat />
        <Figure x={222} h={0.85} coat="#2a2018" />
        <rect x="120" y="120" width="12" height="10" fill="#efe2c4" />
        <rect x="168" y="120" width="12" height="10" fill="#efe2c4" />
      </g>
    ),
  },
  map: {
    title: "Vance's route map",
    draw: () => (
      <g>
        <rect width="300" height="200" fill="#d9c8a2" />
        <path d="M0 140 Q60 100 120 120 T300 90" stroke="#5a7a8a" strokeWidth="6" fill="none" opacity="0.6" />
        {[
          [50, 160, "Manor"],
          [130, 70, "Larkspur"],
          [210, 150, "Station"],
          [250, 40, "Northreach"],
          [160, 170, "Museum"],
        ].map(([x, y, l]) => (
          <g key={String(l)}>
            <circle cx={Number(x)} cy={Number(y)} r="6" fill="#6b2430" />
            <text x={Number(x)} y={Number(y) - 10} fontSize="10" textAnchor="middle" fill="#2a2018" fontFamily="serif">{String(l)}</text>
          </g>
        ))}
        <path d="M50 160 L130 70 L210 150 L250 40" stroke="#6b2430" strokeWidth="2" strokeDasharray="5 4" fill="none" />
      </g>
    ),
  },
  archive: {
    title: "The Hidden Archive",
    draw: () => (
      <g>
        <rect width="300" height="200" fill="#2a2018" />
        {Array.from({ length: 5 }).map((_, i) => (
          <g key={i}>
            <rect x={10 + i * 58} y="20" width="48" height="160" fill="#4a3a28" />
            {Array.from({ length: 6 }).map((__, k) => (
              <rect key={k} x={14 + i * 58} y={26 + k * 26} width="40" height="18" fill="#a68c66" opacity="0.8" />
            ))}
          </g>
        ))}
        <path d="M150 0 L110 200 L190 200 Z" fill="#fff4d0" opacity="0.12" />
        <Figure x={150} h={0.8} coat="#15161b" hat />
      </g>
    ),
  },
  "note-r": {
    title: "Instructions for Webb",
    draw: () => (
      <g>
        <rect width="300" height="200" fill="#efe4cc" />
        {[40, 70, 100, 130, 160].map((y) => (
          <line key={y} x1="20" y1={y + 6} x2="280" y2={y + 6} stroke="#b8c8d8" strokeWidth="1" />
        ))}
        <g fontFamily="'Segoe Print', 'Bradley Hand', cursive" fontSize="17" fill="#1f2a48">
          <text x="24" y="40">W. —</text>
          <text x="24" y="70">Say she took the 23:58 south.</text>
          <text x="24" y="100">Say she was alone. Say it rained.</text>
          <text x="24" y="130">Platform 1. Remember it.</text>
          <text x="190" y="166">— R.</text>
        </g>
        <path d="M250 20 L270 40 M270 20 L250 40" stroke="#6b2430" strokeWidth="3" opacity="0.5" />
      </g>
    ),
  },
  letterhead: {
    title: "Hollowmere crest",
    draw: () => (
      <g>
        <rect width="300" height="200" fill="#efe2c4" />
        <path d="M110 30 L190 30 L190 90 Q190 140 150 160 Q110 140 110 90 Z" fill="#6b2430" stroke="#b8924a" strokeWidth="5" />
        <path d="M150 50 Q166 70 150 90 Q134 110 150 130 M126 90 L174 90" stroke="#e0c27a" strokeWidth="5" fill="none" />
        <text x="150" y="186" fontSize="14" textAnchor="middle" fill="#4a3a28" fontFamily="serif" letterSpacing="4">HOLLOWMERE</text>
      </g>
    ),
  },
};

export function getPicture(key: string) {
  return PICTURES[key] ?? PICTURES.letterhead;
}
