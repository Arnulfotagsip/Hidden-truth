"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { ShellBackground, ShellOverlay } from "@/game/art/shell";
import { Sprite } from "@/game/art/sprites";
import { flag } from "@/game/engine/flags";
import { clampView, clientToScene, hitTest, zoomAt, type ViewBox } from "@/game/engine/hit-test";
import { isDone, isOpenable, isVisible } from "@/game/engine/run";
import type { AreaDefinition, HitRegion, InteractionProgress, InteractiveObject, LevelDefinition } from "@/game/types";
import { SCENE_HEIGHT as H, SCENE_WIDTH as W } from "@/game/types";
import { IconReset, IconZoomIn, IconZoomOut } from "@/components/ui/icons";

export interface SceneFlash {
  key: number;
  x: number;
  y: number;
  kind: "found" | "miss";
}

interface SceneViewProps {
  level: LevelDefinition;
  run: InteractionProgress;
  highlight: { region: HitRegion; tier: number } | null;
  flashes: SceneFlash[];
  reducedMotion: boolean;
  disabled?: boolean;
  itemMode: boolean;
  onObject: (o: InteractiveObject, point: { x: number; y: number }) => void;
  onMiss: (point: { x: number; y: number }) => void;
}

const FULL: ViewBox = { x: 0, y: 0, w: W, h: H };
const DRAG_THRESHOLD = 8;

const Decor = memo(function Decor({ area }: { area: AreaDefinition }) {
  return (
    <g pointerEvents="none">
      {area.decor.map((d, i) => (
        <Sprite key={i} art={d.art} x={d.x} y={d.y} w={d.w} h={d.h} tint={d.tint} variant={d.variant} rotate={d.rotate} flip={d.flip} opacity={d.opacity} />
      ))}
    </g>
  );
});

function ObjectSprite({ o, flags }: { o: InteractiveObject; flags: readonly string[] }) {
  const opened = isOpenable(o) && flags.includes(flag.opened(o.id));
  const done = isDone(o, flags);
  const art = opened && o.openArt ? o.openArt : o.art;
  const variant = opened ? (o.openArt ? undefined : "open") : o.variant;
  const isLight = art === "light-beam";
  return (
    <g pointerEvents="none">
      <Sprite art={art} x={o.box.x} y={o.box.y} w={o.box.w} h={o.box.h} tint={o.tint} variant={variant} rotate={o.rotate} flip={o.flip} opacity={isLight ? 0.6 : o.opacity} />
      {o.obscured && !done && <Sprite art="dust" x={o.box.x - 6} y={o.box.y - 4} w={o.box.w + 12} h={o.box.h + 8} opacity={0.55} />}
      {done && !isOpenable(o) && o.category !== "environment" && (
        <g transform={`translate(${o.box.x + o.box.w - 4} ${o.box.y - 4})`}>
          <circle r="8" fill="#1b2235" stroke="#e0c27a" strokeWidth="1.5" />
          <path d="M-3.5 0 L-1 2.8 L3.8 -2.6" stroke="#e0c27a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

function HighlightShape({ region, tier }: { region: HitRegion; tier: number }) {
  const stroke = tier >= 3 ? "#f5d78e" : "#e0c27a";
  const common = { fill: tier >= 3 ? "#f5d78e22" : "#e0c27a14", stroke, strokeWidth: tier >= 3 ? 3 : 2, strokeDasharray: tier >= 3 ? undefined : "8 6", className: "hint-pulse", pointerEvents: "none" as const };
  if (region.kind === "circle") return <circle cx={region.cx} cy={region.cy} r={region.r} {...common} />;
  if (region.kind === "rect") return <rect x={region.x} y={region.y} width={region.w} height={region.h} rx={8} {...common} />;
  return <polygon points={region.points.map((p) => p.join(",")).join(" ")} {...common} />;
}

export function SceneView({ level, run, highlight, flashes, reducedMotion, disabled, itemMode, onObject, onMiss }: SceneViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<ViewBox>(FULL);
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number; sx: number; sy: number }>());
  const gesture = useRef<{ dragged: boolean; pinchDist: number | null; pinchView: ViewBox | null }>({ dragged: false, pinchDist: null, pinchView: null });

  const area = useMemo(() => level.scene.areas.find((a) => a.id === run.area) ?? level.scene.areas[0], [level, run.area]);
  const visible = useMemo(() => level.scene.objects.filter((o) => o.area === area.id && isVisible(o, run.flags)), [level, area.id, run.flags]);

  const toScene = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return clientToScene(clientX, clientY, { left: r.left, top: r.top, width: r.width, height: r.height }, viewRef.current);
  }, []);

  const activate = useCallback(
    (pt: { x: number; y: number }) => {
      if (disabled) return;
      const hit = hitTest(visible, pt.x, pt.y);
      if (hit) onObject(hit, pt);
      else onMiss(pt);
    },
    [disabled, visible, onObject, onMiss],
  );

  // Wheel zoom needs a non-passive listener to prevent page scroll.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = toScene(e.clientX, e.clientY);
      setView((v) => zoomAt(v, e.deltaY < 0 ? 1.15 : 1 / 1.15, p.x, p.y, W, H));
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [toScene]);

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    svgRef.current?.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY });
    if (pointers.current.size === 1) gesture.current = { dragged: false, pinchDist: null, pinchView: null };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      gesture.current.pinchView = viewRef.current;
      gesture.current.dragged = true;
    }
  };

  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const p = pointers.current.get(e.pointerId);
    if (!p) return;
    const prev = { x: p.x, y: p.y };
    p.x = e.clientX;
    p.y = e.clientY;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = Math.min(rect.width / viewRef.current.w, rect.height / viewRef.current.h);
    if (pointers.current.size === 2 && gesture.current.pinchDist && gesture.current.pinchView) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = toScene((a.x + b.x) / 2, (a.y + b.y) / 2);
      const factor = dist / gesture.current.pinchDist;
      setView(zoomAt(gesture.current.pinchView, factor, mid.x, mid.y, W, H));
      return;
    }
    if (!gesture.current.dragged && Math.hypot(p.x - p.sx, p.y - p.sy) > DRAG_THRESHOLD) gesture.current.dragged = true;
    if (gesture.current.dragged && viewRef.current.w < W) {
      const dx = (p.x - prev.x) / scale;
      const dy = (p.y - prev.y) / scale;
      setView((v) => clampView({ ...v, x: v.x - dx, y: v.y - dy }, W, H));
    }
  };

  const onPointerUp = (e: ReactPointerEvent<SVGSVGElement>) => {
    const p = pointers.current.get(e.pointerId);
    pointers.current.delete(e.pointerId);
    if (!p) return;
    if (pointers.current.size === 0 && !gesture.current.dragged) {
      setCursor(null);
      activate(toScene(e.clientX, e.clientY));
    }
    if (pointers.current.size < 2) {
      gesture.current.pinchDist = null;
      gesture.current.pinchView = null;
    }
  };

  const onPointerCancel = (e: ReactPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
  };

  const onKeyDown = (e: ReactKeyboardEvent<SVGSVGElement>) => {
    const step = e.shiftKey ? 60 : 20;
    const c = cursor ?? { x: view.x + view.w / 2, y: view.y + view.h / 2 };
    const move = (dx: number, dy: number) => {
      e.preventDefault();
      const next = { x: Math.min(W, Math.max(0, c.x + dx)), y: Math.min(H, Math.max(0, c.y + dy)) };
      setCursor(next);
      // Keep the cursor inside the zoomed view.
      setView((v) => clampView({ ...v, x: next.x < v.x ? next.x - 20 : next.x > v.x + v.w ? next.x - v.w + 20 : v.x, y: next.y < v.y ? next.y - 20 : next.y > v.y + v.h ? next.y - v.h + 20 : v.y }, W, H));
    };
    switch (e.key) {
      case "ArrowLeft":
        return move(-step, 0);
      case "ArrowRight":
        return move(step, 0);
      case "ArrowUp":
        return move(0, -step);
      case "ArrowDown":
        return move(0, step);
      case "Enter":
      case " ":
        e.preventDefault();
        if (!cursor) setCursor(c);
        else activate(cursor);
        return;
      case "+":
      case "=":
        e.preventDefault();
        setView((v) => zoomAt(v, 1.25, c.x, c.y, W, H));
        return;
      case "-":
      case "_":
        e.preventDefault();
        setView((v) => zoomAt(v, 1 / 1.25, c.x, c.y, W, H));
        return;
      case "Escape":
        setCursor(null);
        return;
    }
  };

  const zoomBy = (f: number) => setView((v) => zoomAt(v, f, v.x + v.w / 2, v.y + v.h / 2, W, H));
  const zoomed = view.w < W - 0.5;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-black">
      <svg
        ref={svgRef}
        className={`scene-svg block h-full w-full ${itemMode ? "cursor-copy" : "cursor-crosshair"}`}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        preserveAspectRatio="xMidYMid meet"
        role="application"
        aria-roledescription="investigation scene"
        aria-label={`${area.name}. Click or tap to search. Keyboard: arrow keys move the magnifier, Enter inspects, plus and minus zoom.`}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onKeyDown={onKeyDown}
        onBlur={() => setCursor(null)}
      >
        <rect x={0} y={0} width={W} height={H} fill="#07080c" />
        <ShellBackground shell={area.shell} uid={`${level.id}-${area.id}`} />
        <Decor area={area} />
        {visible.map((o) => (
          <ObjectSprite key={o.id} o={o} flags={run.flags} />
        ))}
        <ShellOverlay shell={area.shell} reducedMotion={reducedMotion} />
        {highlight && <HighlightShape region={highlight.region} tier={highlight.tier} />}
        {flashes.map((f) =>
          f.kind === "found" ? (
            <circle key={f.key} cx={f.x} cy={f.y} r={30} fill="none" stroke="#f5d78e" strokeWidth={3} className="obj-found-ring" style={{ transformOrigin: `${f.x}px ${f.y}px`, transformBox: "view-box" }} pointerEvents="none" />
          ) : (
            <circle key={f.key} cx={f.x} cy={f.y} r={10} fill="none" stroke="#efe4cc" strokeWidth={2} className="miss-ripple" pointerEvents="none" />
          ),
        )}
        {cursor && (
          <g pointerEvents="none" transform={`translate(${cursor.x} ${cursor.y})`}>
            <circle r="18" fill="#e0c27a18" stroke="#f5d78e" strokeWidth="2.5" />
            <path d="M-26 0 H-12 M12 0 H26 M0 -26 V-12 M0 12 V26" stroke="#f5d78e" strokeWidth="2" />
          </g>
        )}
      </svg>
      <div className="absolute right-2 top-2 flex flex-col gap-1.5">
        <button type="button" className="rounded-md bg-black/55 p-2 text-cream hover:bg-black/75" onClick={() => zoomBy(1.35)} aria-label="Zoom in">
          <IconZoomIn size={18} />
        </button>
        <button type="button" className="rounded-md bg-black/55 p-2 text-cream hover:bg-black/75 disabled:opacity-40" onClick={() => zoomBy(1 / 1.35)} disabled={!zoomed} aria-label="Zoom out">
          <IconZoomOut size={18} />
        </button>
        {zoomed && (
          <button type="button" className="rounded-md bg-black/55 p-2 text-cream hover:bg-black/75" onClick={() => setView(FULL)} aria-label="Reset zoom">
            <IconReset size={18} />
          </button>
        )}
      </div>
      {zoomed && <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/55 px-2 py-0.5 text-[11px] text-cream/80">Drag to pan</div>}
    </div>
  );
}
