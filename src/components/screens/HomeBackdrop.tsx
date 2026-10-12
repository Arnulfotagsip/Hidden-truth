import { seeded } from "@/game/art/color";

/** Illustrated title backdrop: Hollowmere House at night, in the rain. */
export function HomeBackdrop() {
  const r = seeded(42);
  const stars = Array.from({ length: 70 }, () => ({ x: r() * 1600, y: r() * 380, s: r() * 1.4 + 0.3 }));
  const rain = Array.from({ length: 140 }, () => ({ x: r() * 1700, y: r() * 1000 }));
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="hb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#070a14" />
          <stop offset="0.6" stopColor="#1a2238" />
          <stop offset="1" stopColor="#2b2a3a" />
        </linearGradient>
        <radialGradient id="hb-moon-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3cf" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff3cf" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hb-fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9aa8c0" stopOpacity="0" />
          <stop offset="1" stopColor="#9aa8c0" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id="hb-window" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffb44a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#hb-sky)" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#fff" opacity={0.55} />
      ))}
      <circle cx="1240" cy="190" r="190" fill="url(#hb-moon-glow)" />
      <circle cx="1240" cy="190" r="62" fill="url(#g-moon)" />
      {/* distant hills */}
      <path d="M0 720 Q200 640 420 690 T860 660 T1300 690 T1600 650 L1600 1000 L0 1000 Z" fill="#11151f" />
      {/* the house */}
      <g fill="#07090f">
        <path d="M520 760 L520 470 L700 380 L700 330 L740 330 L740 360 L880 300 L1060 400 L1060 470 L1120 470 L1120 760 Z" />
        <path d="M600 470 L800 360 L1000 470 Z" />
        <rect x="910" y="250" width="40" height="110" />
        <rect x="630" y="300" width="30" height="90" />
        <path d="M1060 470 L1160 430 L1260 470 L1260 760 L1060 760 Z" />
      </g>
      {[
        [575, 520], [650, 520], [575, 610], [740, 600], [820, 600], [900, 600], [980, 520], [1180, 540], [1180, 620],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="34" height="48" fill={i === 4 || i === 7 ? "#ffcf74" : "#141a28"} opacity={i === 4 || i === 7 ? 0.95 : 1} />
          {(i === 4 || i === 7) && <circle cx={x + 17} cy={y + 24} r="60" fill="url(#hb-window)" />}
          <path d={`M${x + 17} ${y} V${y + 48} M${x} ${y + 24} H${x + 34}`} stroke="#07090f" strokeWidth="3" />
        </g>
      ))}
      {/* trees */}
      <g fill="#05070c">
        <path d="M170 780 L250 420 L330 780 Z" />
        <path d="M80 800 L160 520 L240 800 Z" />
        <path d="M1330 790 L1420 400 L1510 790 Z" />
        <path d="M1460 800 L1540 520 L1620 800 Z" />
      </g>
      {/* gate and ground */}
      <path d="M0 780 L1600 760 L1600 1000 L0 1000 Z" fill="#0a0c12" />
      <g stroke="#0d1018" strokeWidth="5">
        {Array.from({ length: 30 }).map((_, i) => (
          <line key={i} x1={i * 56} y1={800} x2={i * 56} y2={700 + (i % 2) * 8} />
        ))}
        <line x1="0" y1="730" x2="1600" y2="715" />
      </g>
      <rect width="1600" height="1000" fill="url(#hb-fog)" />
      <g className="weather-rain" stroke="#b9cbe0" strokeWidth="1.2" opacity="0.3">
        {rain.map((d, i) => (
          <line key={i} x1={d.x} y1={d.y} x2={d.x - 10} y2={d.y + 32} />
        ))}
      </g>
    </svg>
  );
}
