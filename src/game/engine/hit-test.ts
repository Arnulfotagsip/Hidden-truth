/**
 * Pointer → scene coordinate mapping and hit testing. Pure functions so
 * alignment can be verified at any element size, zoom or pan.
 */
import type { HitRegion, InteractiveObject, Rect } from "../types";

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ElementRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Maps a client (CSS pixel) point to scene coordinates for an SVG using
 * preserveAspectRatio="xMidYMid meet" with the given viewBox.
 */
export function clientToScene(clientX: number, clientY: number, rect: ElementRect, view: ViewBox): { x: number; y: number } {
  const scale = Math.min(rect.width / view.w, rect.height / view.h);
  const contentW = view.w * scale;
  const contentH = view.h * scale;
  const offX = (rect.width - contentW) / 2;
  const offY = (rect.height - contentH) / 2;
  return {
    x: view.x + (clientX - rect.left - offX) / scale,
    y: view.y + (clientY - rect.top - offY) / scale,
  };
}

/** Inverse of clientToScene (used by tests and keyboard cursor rendering). */
export function sceneToClient(x: number, y: number, rect: ElementRect, view: ViewBox): { x: number; y: number } {
  const scale = Math.min(rect.width / view.w, rect.height / view.h);
  const offX = (rect.width - view.w * scale) / 2;
  const offY = (rect.height - view.h * scale) / 2;
  return { x: rect.left + offX + (x - view.x) * scale, y: rect.top + offY + (y - view.y) * scale };
}

/** Minimum hit size in scene units so tiny clues stay tappable. */
export const MIN_HIT = 34;

export function regionFor(o: InteractiveObject, minHit = MIN_HIT): HitRegion {
  if (o.hit) return o.hit;
  const b = o.box;
  const w = Math.max(b.w, minHit);
  const h = Math.max(b.h, minHit);
  return { kind: "rect", x: b.x + b.w / 2 - w / 2, y: b.y + b.h / 2 - h / 2, w, h };
}

export function regionArea(r: HitRegion): number {
  switch (r.kind) {
    case "rect":
      return r.w * r.h;
    case "circle":
      return Math.PI * r.r * r.r;
    case "poly": {
      let a = 0;
      for (let i = 0; i < r.points.length; i++) {
        const [x1, y1] = r.points[i];
        const [x2, y2] = r.points[(i + 1) % r.points.length];
        a += x1 * y2 - x2 * y1;
      }
      return Math.abs(a) / 2;
    }
  }
}

export function regionContains(r: HitRegion, x: number, y: number): boolean {
  switch (r.kind) {
    case "rect":
      return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
    case "circle":
      return (x - r.cx) ** 2 + (y - r.cy) ** 2 <= r.r ** 2;
    case "poly": {
      let inside = false;
      const p = r.points;
      for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
        const [xi, yi] = p[i];
        const [xj, yj] = p[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    }
  }
}

export function regionBounds(r: HitRegion): Rect {
  switch (r.kind) {
    case "rect":
      return { x: r.x, y: r.y, w: r.w, h: r.h };
    case "circle":
      return { x: r.cx - r.r, y: r.cy - r.r, w: r.r * 2, h: r.r * 2 };
    case "poly": {
      const xs = r.points.map((p) => p[0]);
      const ys = r.points.map((p) => p[1]);
      return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
    }
  }
}

/**
 * Returns the object under the point. When regions overlap, the smallest
 * one wins, so a key lying on a desk beats the desk drawer behind it.
 */
export function hitTest(objects: readonly InteractiveObject[], x: number, y: number, minHit = MIN_HIT): InteractiveObject | null {
  let best: InteractiveObject | null = null;
  let bestArea = Infinity;
  for (const o of objects) {
    const r = regionFor(o, minHit);
    if (!regionContains(r, x, y)) continue;
    const a = regionArea(r);
    if (a < bestArea) {
      best = o;
      bestArea = a;
    }
  }
  return best;
}

/** Clamp a viewBox so panning never leaves the scene. */
export function clampView(v: ViewBox, sceneW: number, sceneH: number): ViewBox {
  const w = Math.min(sceneW, Math.max(sceneW / 4, v.w));
  const h = (w / sceneW) * sceneH;
  return {
    w,
    h,
    x: Math.min(sceneW - w, Math.max(0, v.x)),
    y: Math.min(sceneH - h, Math.max(0, v.y)),
  };
}

/** Zoom around a scene point by a factor (>1 zooms in). */
export function zoomAt(v: ViewBox, factor: number, px: number, py: number, sceneW: number, sceneH: number): ViewBox {
  const w = v.w / factor;
  const h = v.h / factor;
  const x = px - ((px - v.x) / v.w) * w;
  const y = py - ((py - v.y) / v.h) * h;
  return clampView({ x, y, w, h }, sceneW, sceneH);
}
