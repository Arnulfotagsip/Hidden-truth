/**
 * Global SVG gradient/filter/pattern definitions shared by every scene,
 * sprite icon and picture. Rendered once at the app root.
 */
export function ArtDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <linearGradient id="g-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1d993" />
          <stop offset="0.45" stopColor="#b8924a" />
          <stop offset="1" stopColor="#6e5326" />
        </linearGradient>
        <linearGradient id="g-silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f4f7" />
          <stop offset="0.5" stopColor="#a5adb8" />
          <stop offset="1" stopColor="#5c6470" />
        </linearGradient>
        <linearGradient id="g-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4ead2" />
          <stop offset="1" stopColor="#d9c8a2" />
        </linearGradient>
        <linearGradient id="g-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d6ecf3" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#8fb6c6" stopOpacity="0.25" />
          <stop offset="1" stopColor="#d6ecf3" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="g-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9aa3ae" />
          <stop offset="1" stopColor="#4d5560" />
        </linearGradient>
        <linearGradient id="g-ice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2fbff" />
          <stop offset="1" stopColor="#9cc7d8" />
        </linearGradient>
        <radialGradient id="g-fire" cx="0.5" cy="0.8" r="0.7">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="0.35" stopColor="#f39a3c" />
          <stop offset="0.75" stopColor="#a8361b" />
          <stop offset="1" stopColor="#3a1208" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.85" />
          <stop offset="0.4" stopColor="#f0b860" stopOpacity="0.3" />
          <stop offset="1" stopColor="#f0b860" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g-vignette" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.75" />
        </radialGradient>
        <radialGradient id="g-moon" cx="0.4" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset="1" stopColor="#d9d2b3" />
        </radialGradient>
        <linearGradient id="g-sky-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1020" />
          <stop offset="1" stopColor="#25304a" />
        </linearGradient>
        <linearGradient id="g-sky-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1b33" />
          <stop offset="0.7" stopColor="#5a3a52" />
          <stop offset="1" stopColor="#b9705a" />
        </linearGradient>
        <linearGradient id="g-sky-storm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#11151d" />
          <stop offset="1" stopColor="#3a4250" />
        </linearGradient>
        <linearGradient id="g-sky-snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3a52" />
          <stop offset="1" stopColor="#8aa3b8" />
        </linearGradient>
        <linearGradient id="g-sky-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#25304d" />
          <stop offset="0.6" stopColor="#7d6a8a" />
          <stop offset="1" stopColor="#e3b38a" />
        </linearGradient>
        <linearGradient id="g-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f6b4a" />
          <stop offset="1" stopColor="#123222" />
        </linearGradient>
        <filter id="f-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="f-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="f-highlight" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b" />
          <feFlood floodColor="#f5d78e" floodOpacity="0.9" />
          <feComposite in2="b" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="f-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
