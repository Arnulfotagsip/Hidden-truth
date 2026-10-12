import { memo, type ReactNode } from "react";
import type { ShellDefinition } from "../types";
import { SCENE_HEIGHT as H, SCENE_WIDTH as W } from "../types";
import { seeded, shade } from "./color";

const SKY: Record<string, string> = {
  night: "url(#g-sky-night)",
  dusk: "url(#g-sky-dusk)",
  storm: "url(#g-sky-storm)",
  snow: "url(#g-sky-snow)",
  dawn: "url(#g-sky-dawn)",
};

function wallPattern(id: string, s: ShellDefinition): ReactNode {
  const base = s.wallColor;
  const a = s.accent;
  switch (s.wall) {
    case "damask":
      return (
        <pattern id={id} width="60" height="80" patternUnits="userSpaceOnUse">
          <rect width="60" height="80" fill={base} />
          <path d="M30 6 Q42 20 30 34 Q18 20 30 6 Z M30 46 Q42 60 30 74 Q18 60 30 46 Z" fill={a} opacity="0.18" />
          <path d="M0 40 Q12 26 0 12 M60 40 Q48 26 60 12 M0 40 Q12 54 0 68 M60 40 Q48 54 60 68" stroke={a} strokeOpacity="0.15" fill="none" strokeWidth="2" />
          <circle cx="30" cy="40" r="3" fill={a} opacity="0.2" />
        </pattern>
      );
    case "stripes":
      return (
        <pattern id={id} width="48" height="10" patternUnits="userSpaceOnUse">
          <rect width="48" height="10" fill={base} />
          <rect width="16" height="10" fill={a} opacity="0.22" />
          <rect x="22" width="2" height="10" fill={a} opacity="0.3" />
        </pattern>
      );
    case "brick":
      return (
        <pattern id={id} width="60" height="30" patternUnits="userSpaceOnUse">
          <rect width="60" height="30" fill={shade(base, -0.35)} />
          <rect x="1" y="1" width="28" height="13" fill={base} />
          <rect x="31" y="1" width="28" height="13" fill={shade(base, -0.06)} />
          <rect x="-14" y="16" width="28" height="13" fill={shade(base, 0.05)} />
          <rect x="16" y="16" width="28" height="13" fill={shade(base, -0.1)} />
          <rect x="46" y="16" width="28" height="13" fill={shade(base, 0.05)} />
        </pattern>
      );
    case "tiles":
      return (
        <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill={shade(base, -0.15)} />
          <rect x="1" y="1" width="38" height="38" fill={base} />
          <path d="M3 3 L20 3" stroke="#fff" strokeOpacity="0.25" />
        </pattern>
      );
    case "planks":
      return (
        <pattern id={id} width="240" height="36" patternUnits="userSpaceOnUse">
          <rect width="240" height="36" fill={base} />
          <rect y="0" width="240" height="2" fill={shade(base, -0.4)} />
          <rect x="90" y="0" width="2" height="36" fill={shade(base, -0.35)} />
          <path d="M10 14 Q60 10 80 16 M120 22 Q170 18 230 24" stroke={shade(base, -0.15)} fill="none" />
          <rect y="18" width="240" height="1" fill={a} opacity="0.1" />
        </pattern>
      );
    case "concrete":
      return (
        <pattern id={id} width="260" height="150" patternUnits="userSpaceOnUse">
          <rect width="260" height="150" fill={base} />
          <path d="M20 30 Q60 10 110 34 T200 40 Q230 70 190 96 T80 110 Q30 100 20 30 Z" fill={shade(base, -0.035)} />
          <path d="M140 100 Q170 84 220 110 Q240 140 200 146 Q150 150 140 100 Z" fill={shade(base, 0.03)} />
          <path d="M60 60 L72 74 L68 92" stroke={shade(base, -0.15)} strokeWidth="0.8" fill="none" />
          <rect x="0" y="148" width="260" height="2" fill={shade(base, -0.22)} />
          <rect x="258" y="0" width="2" height="150" fill={shade(base, -0.22)} />
          <circle cx="12" cy="12" r="1.8" fill={shade(base, -0.28)} />
          <circle cx="246" cy="12" r="1.8" fill={shade(base, -0.28)} />
        </pattern>
      );
    case "metal":
      return (
        <pattern id={id} width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill={base} />
          <rect x="0" y="0" width="100" height="2" fill={shade(base, -0.35)} />
          <rect x="0" y="0" width="2" height="100" fill={shade(base, -0.35)} />
          <rect x="2" y="2" width="96" height="3" fill={shade(base, 0.15)} />
          {[[8, 10], [92, 10], [8, 92], [92, 92]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2" fill={shade(base, 0.25)} />
          ))}
        </pattern>
      );
    case "stone":
      return (
        <pattern id={id} width="120" height="80" patternUnits="userSpaceOnUse">
          <rect width="120" height="80" fill={shade(base, -0.35)} />
          <path d="M2 2 L56 2 L54 38 L2 36 Z" fill={base} />
          <path d="M60 2 L118 2 L118 34 L58 38 Z" fill={shade(base, -0.07)} />
          <path d="M2 40 L36 42 L38 78 L2 78 Z" fill={shade(base, 0.05)} />
          <path d="M40 42 L92 40 L90 78 L42 78 Z" fill={shade(base, -0.04)} />
          <path d="M96 38 L118 38 L118 78 L94 78 Z" fill={base} />
        </pattern>
      );
    case "ice":
      return (
        <pattern id={id} width="160" height="160" patternUnits="userSpaceOnUse">
          <rect width="160" height="160" fill={base} />
          <path d="M0 40 L50 60 L80 30 L130 70 L160 50 M20 160 L40 110 L90 120 L110 90 L160 120" stroke="#ffffff" strokeOpacity="0.35" fill="none" />
          <path d="M60 0 L70 40 M120 160 L130 120" stroke={a} strokeOpacity="0.35" fill="none" />
        </pattern>
      );
    case "glass":
      return (
        <pattern id={id} width="80" height="100" patternUnits="userSpaceOnUse">
          <rect width="80" height="100" fill={base} opacity="0.25" />
          <rect x="0" y="0" width="80" height="100" fill="none" stroke={a} strokeWidth="4" />
          <path d="M8 10 L30 4" stroke="#fff" strokeOpacity="0.2" strokeWidth="3" />
        </pattern>
      );
    case "panels":
    case "plaster":
    default:
      return (
        <pattern id={id} width="200" height="200" patternUnits="userSpaceOnUse">
          <rect width="200" height="200" fill={base} />
          <path d="M30 40 Q50 60 44 90 M150 120 L160 150 L154 170" stroke={shade(base, -0.15)} fill="none" />
          <circle cx="120" cy="40" r="40" fill={shade(base, 0.04)} />
        </pattern>
      );
  }
}

function floorLayer(s: ShellDefinition, horizon: number, pid: string): ReactNode {
  const base = s.floorColor;
  const vpX = W / 2;
  const vpY = horizon - 380;
  const t = (horizon - vpY) / (H - vpY);
  const fan = (n: number, spacing: number, stroke: string, width = 1.5, opacity = 0.5) => (
    <g stroke={stroke} strokeWidth={width} opacity={opacity}>
      {Array.from({ length: n }).map((_, i) => {
        const bx = -spacing * 4 + i * spacing;
        const hx = vpX + (bx - vpX) * t;
        return <line key={i} x1={hx} y1={horizon} x2={bx} y2={H} />;
      })}
    </g>
  );
  const rows = (ys: number[], stroke: string, opacity = 0.35) => (
    <g stroke={stroke} opacity={opacity}>
      {ys.map((y) => (
        <line key={y} x1="0" y1={y} x2={W} y2={y} />
      ))}
    </g>
  );
  const depthRows = (count: number) => {
    const out: number[] = [];
    for (let i = 1; i <= count; i++) {
      const k = i / count;
      out.push(horizon + (H - horizon) * k * k);
    }
    return out;
  };
  switch (s.floor) {
    case "boards":
      return (
        <g>
          <rect x="0" y={horizon} width={W} height={H - horizon} fill={base} />
          {fan(22, 70, shade(base, -0.45), 2, 0.6)}
          <rect x="0" y={horizon} width={W} height={H - horizon} fill="url(#g-floor-sheen)" />
        </g>
      );
    case "checker": {
      const ys = [horizon, ...depthRows(6)];
      const cells: ReactNode[] = [];
      for (let r = 0; r < ys.length - 1; r++) {
        const y0 = ys[r];
        const y1 = ys[r + 1];
        const t0 = (y0 - vpY) / (H - vpY);
        const t1 = (y1 - vpY) / (H - vpY);
        for (let c = -6; c < 16; c++) {
          if ((r + c) % 2 === 0) continue;
          const bx0 = c * 90;
          const bx1 = (c + 1) * 90;
          const p = (bx: number, tt: number) => vpX + (bx - vpX) * tt;
          cells.push(
            <path
              key={`${r}-${c}`}
              d={`M${p(bx0, t0)} ${y0} L${p(bx1, t0)} ${y0} L${p(bx1, t1)} ${y1} L${p(bx0, t1)} ${y1} Z`}
              fill={shade(base, -0.55)}
            />,
          );
        }
      }
      return (
        <g>
          <rect x="0" y={horizon} width={W} height={H - horizon} fill={base} />
          {cells}
        </g>
      );
    }
    case "carpet":
      return (
        <g>
          <rect x="0" y={horizon} width={W} height={H - horizon} fill={base} />
          <rect x="0" y={horizon} width={W} height={H - horizon} fill={`url(#${pid}-carpet)`} />
        </g>
      );
    case "tiles":
      return (
        <g>
          <rect x="0" y={horizon} width={W} height={H - horizon} fill={base} />
          {fan(20, 80, shade(base, -0.3), 1.2, 0.7)}
          {rows(depthRows(7), shade(base, -0.3), 0.7)}
        </g>
      );
    case "cobbles": {
      const r = seeded(7);
      const stones: ReactNode[] = [];
      const ys = depthRows(9);
      ys.forEach((y, i) => {
        const size = 8 + (i / ys.length) * 26;
        for (let x = -20; x < W + 20; x += size * 2.1) {
          stones.push(
            <ellipse key={`${i}-${x}`} cx={x + (i % 2) * size + r() * 4} cy={y - size * 0.4} rx={size} ry={size * 0.45} fill={shade(base, (r() - 0.5) * 0.25)} />,
          );
        }
      });
      return (
        <g>
          <rect x="0" y={horizon} width={W} height={H - horizon} fill={shade(base, -0.4)} />
          {stones}
          <rect x="0" y={horizon} width={W} height={H - horizon} fill="url(#g-floor-sheen)" />
        </g>
      );
    }
    case "snow":
      return (
        <g>
          <rect x="0" y={horizon} width={W} height={H - horizon} fill={base} />
          <path d={`M0 ${horizon + 30} Q200 ${horizon} 400 ${horizon + 26} T800 ${horizon + 20} T1000 ${horizon + 30} L1000 ${H} L0 ${H} Z`} fill={shade(base, 0.25)} />
          <path d={`M0 ${horizon + 110} Q300 ${horizon + 80} 600 ${horizon + 120} T1000 ${horizon + 100}`} stroke={shade(base, -0.12)} strokeWidth="3" fill="none" />
        </g>
      );
    case "stone":
      return (
        <g>
          <rect x="0" y={horizon} width={W} height={H - horizon} fill={base} />
          {fan(14, 120, shade(base, -0.4), 2, 0.6)}
          {rows(depthRows(5), shade(base, -0.4), 0.6)}
        </g>
      );
    case "grate":
      return (
        <g>
          <rect x="0" y={horizon} width={W} height={H - horizon} fill={base} />
          {fan(40, 30, shade(base, -0.5), 1, 0.7)}
          {rows(depthRows(12), shade(base, -0.5), 0.6)}
        </g>
      );
    case "asphalt":
      return (
        <g>
          <rect x="0" y={horizon} width={W} height={H - horizon} fill={base} />
          <rect x="0" y={horizon} width={W} height="16" fill={shade(base, 0.25)} />
          <g stroke="#d8c46a" strokeWidth="6" opacity="0.45">
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={80 + i * 220} y1={H - 60} x2={180 + i * 220} y2={H - 60} />
            ))}
          </g>
          <rect x="0" y={horizon} width={W} height={H - horizon} fill="url(#g-floor-sheen)" />
        </g>
      );
    case "concrete":
    default:
      return (
        <g>
          <rect x="0" y={horizon} width={W} height={H - horizon} fill={base} />
          {fan(8, 220, shade(base, -0.3), 2, 0.5)}
          {rows(depthRows(4), shade(base, -0.3), 0.5)}
        </g>
      );
  }
}

function Weather({ kind }: { kind: "rain" | "snow" }) {
  const r = seeded(kind === "rain" ? 11 : 23);
  if (kind === "rain") {
    return (
      <g className="weather-rain" stroke="#b9cbe0" strokeWidth="1.1" opacity="0.35" pointerEvents="none">
        {Array.from({ length: 90 }).map((_, i) => {
          const x = r() * (W + 100);
          const y = r() * H;
          return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 26} />;
        })}
      </g>
    );
  }
  return (
    <g className="weather-snow" fill="#fff" opacity="0.75" pointerEvents="none">
      {Array.from({ length: 80 }).map((_, i) => (
        <circle key={i} cx={r() * W} cy={r() * H} r={1 + r() * 2.2} />
      ))}
    </g>
  );
}

/** Background: walls, floor, sky, structure. Rendered under decor. */
export const ShellBackground = memo(function ShellBackground({ shell, uid }: { shell: ShellDefinition; uid: string }) {
  const horizon = shell.horizon ?? 440;
  const pid = `wp-${uid}`;
  const sky = SKY[shell.sky ?? "night"];
  const skyline = (
    <g fill="#0b0e17" opacity="0.9">
      <path d={`M0 ${horizon - 120} L60 ${horizon - 120} L60 ${horizon - 180} L130 ${horizon - 180} L130 ${horizon - 140} L190 ${horizon - 140} L190 ${horizon - 230} L240 ${horizon - 250} L290 ${horizon - 230} L290 ${horizon - 150} L380 ${horizon - 150} L380 ${horizon - 200} L450 ${horizon - 200} L450 ${horizon - 130} L560 ${horizon - 130} L560 ${horizon - 210} L600 ${horizon - 210} L600 ${horizon - 260} L612 ${horizon - 260} L612 ${horizon - 210} L660 ${horizon - 210} L660 ${horizon - 160} L760 ${horizon - 160} L760 ${horizon - 190} L850 ${horizon - 190} L850 ${horizon - 140} L1000 ${horizon - 140} L1000 ${horizon} L0 ${horizon} Z`} />
    </g>
  );
  return (
    <g pointerEvents="none">
      <defs>
        {wallPattern(pid, shell)}
        <pattern id={`${pid}-carpet`} width="80" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20 L20 0 L40 20 L20 40 Z M40 20 L60 0 L80 20 L60 40 Z" fill={shell.accent} opacity="0.18" />
        </pattern>
        <linearGradient id="g-floor-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {shell.kind === "interior" && (
        <g>
          <rect x="0" y="0" width={W} height={horizon} fill={`url(#${pid})`} />
          {shell.wall === "panels" && (
            <g>
              <rect x="0" y={horizon - 170} width={W} height="170" fill={shade(shell.accent, -0.1)} />
              {Array.from({ length: 8 }).map((_, i) => (
                <rect key={i} x={14 + i * 125} y={horizon - 156} width="105" height="130" fill="none" stroke={shade(shell.accent, 0.18)} strokeWidth="3" />
              ))}
              <rect x="0" y={horizon - 176} width={W} height="10" fill={shade(shell.accent, 0.12)} />
            </g>
          )}
          <rect x="0" y="0" width={W} height="16" fill={shade(shell.wallColor, -0.35)} />
          <rect x="0" y="16" width={W} height="5" fill={shade(shell.wallColor, 0.12)} />
          <rect x="0" y={horizon - 14} width={W} height="14" fill={shade(shell.accent, -0.3)} />
          <rect x="0" y={horizon - 14} width={W} height="3" fill={shade(shell.accent, 0.1)} />
        </g>
      )}

      {shell.kind === "exterior" && (
        <g>
          <rect x="0" y="0" width={W} height={horizon} fill={sky} />
          {shell.sky !== "storm" && shell.sky !== "snow" && <circle cx="840" cy="80" r="34" fill="url(#g-moon)" opacity="0.85" />}
          {shell.sky !== "snow" && Array.from({ length: 24 }).map((_, i) => {
            const r = seeded(i + 3);
            return <circle key={i} cx={r() * W} cy={r() * 160} r={r() * 1.2 + 0.3} fill="#fff" opacity={0.6} />;
          })}
          {skyline}
          {shell.wall !== "glass" && shell.wall !== "plaster" && (
            <rect x="0" y="150" width={W} height={horizon - 150} fill={`url(#${pid})`} opacity="0.97" />
          )}
          {shell.wall === "glass" && (
            <g>
              <rect x="0" y="0" width={W} height={horizon} fill={`url(#${pid})`} />
            </g>
          )}
        </g>
      )}

      {shell.kind === "train" && (
        <g>
          <rect x="0" y="0" width={W} height={horizon} fill={`url(#${pid})`} />
          <path d={`M0 0 L${W} 0 L${W} 50 Q${W / 2} 10 0 50 Z`} fill={shade(shell.wallColor, -0.5)} />
          <rect x="0" y="120" width={W} height="6" fill="url(#g-brass)" opacity="0.7" />
          <rect x="0" y={horizon - 20} width={W} height="20" fill={shade(shell.accent, -0.3)} />
        </g>
      )}

      {shell.kind === "tunnel" && (
        <g>
          <rect x="0" y="0" width={W} height={horizon} fill={`url(#${pid})`} />
          <path d={`M0 0 L${W} 0 L${W} ${horizon} L${W - 60} ${horizon} Q${W - 60} 60 ${W / 2} 50 Q60 60 60 ${horizon} L0 ${horizon} Z`} fill={shade(shell.wallColor, -0.45)} opacity="0.7" />
        </g>
      )}

      {floorLayer(shell, horizon, pid)}
      <rect x="0" y={horizon} width={W} height="40" fill="#000" opacity="0.18" />
    </g>
  );
});

/** Foreground: lights, weather, vignette, darkness. Never intercepts input. */
export const ShellOverlay = memo(function ShellOverlay({ shell, reducedMotion }: { shell: ShellDefinition; reducedMotion: boolean }) {
  const dark = shell.darkness ?? 0.25;
  return (
    <g pointerEvents="none">
      {(shell.lights ?? []).map((l, i) => (
        <ellipse
          key={i}
          cx={l.x}
          cy={l.y}
          rx={l.r}
          ry={l.r * 0.85}
          fill="url(#g-glow)"
          opacity={l.strength ?? 0.55}
          style={{ mixBlendMode: "screen" }}
        />
      ))}
      {shell.weather && shell.weather !== "none" && (
        <g className={reducedMotion ? undefined : "weather-anim"}>
          <Weather kind={shell.weather} />
        </g>
      )}
      <rect x="0" y="0" width={W} height={H} fill="url(#g-vignette)" opacity={0.6 + dark * 0.4} />
      {dark > 0.3 && <rect x="0" y="0" width={W} height={H} fill="#05060c" opacity={(dark - 0.3) * 0.5} />}
    </g>
  );
});
