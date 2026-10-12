"use client";

import { SpriteIcon } from "@/game/art/sprites";
import { getItem } from "@/game/content/items";
import { IconCombine, IconEye, IconClose } from "@/components/ui/icons";

interface Props {
  items: string[];
  selected: string | null;
  combineFrom: string | null;
  onSelect: (id: string | null) => void;
  onInspect: (id: string) => void;
  onStartCombine: (id: string) => void;
  onCombineWith: (id: string) => void;
}

export function InventoryBar({ items, selected, combineFrom, onSelect, onInspect, onStartCombine, onCombineWith }: Props) {
  const slots = Math.max(6, items.length);
  const sel = selected ? getItem(selected) : null;
  return (
    <div className="panel rounded-lg p-2">
      <div className="mb-1.5 flex min-h-7 flex-wrap items-center gap-2 px-1 text-xs">
        <span className="font-semibold uppercase tracking-wider text-brass-2">Inventory</span>
        <span aria-live="polite" className="text-cream/75">
          {combineFrom
            ? `Combine ${getItem(combineFrom)?.name} with… (choose another item)`
            : sel
              ? `Using: ${sel.name} — tap where to use it, or combine it.`
              : items.length
                ? "Select an item to use it in the scene."
                : "Items you pick up appear here."}
        </span>
        {(sel || combineFrom) && (
          <div className="ml-auto flex gap-1.5">
            {sel && !combineFrom && (
              <>
                <button type="button" className="btn btn-ghost px-2 py-1 text-xs" onClick={() => onInspect(sel.id)}>
                  <IconEye size={14} /> Inspect
                </button>
                <button type="button" className="btn btn-ghost px-2 py-1 text-xs" onClick={() => onStartCombine(sel.id)} disabled={items.length < 2}>
                  <IconCombine size={14} /> Combine
                </button>
              </>
            )}
            <button type="button" className="btn btn-ghost px-2 py-1 text-xs" onClick={() => onSelect(null)}>
              <IconClose size={14} /> {combineFrom ? "Cancel" : "Put away"}
            </button>
          </div>
        )}
      </div>
      <ul className="scrollbar-thin flex gap-2 overflow-x-auto pb-1" aria-label="Inventory items">
        {Array.from({ length: slots }).map((_, i) => {
          const id = items[i];
          const def = id ? getItem(id) : null;
          if (!id || !def)
            return <li key={`empty-${i}`} className="h-14 w-14 shrink-0 rounded-md border border-dashed border-brass/20 bg-black/20" aria-hidden />;
          const isSel = selected === id || combineFrom === id;
          return (
            <li key={id} className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (combineFrom && combineFrom !== id) onCombineWith(id);
                  else onSelect(isSel ? null : id);
                }}
                aria-pressed={isSel}
                aria-label={def.name}
                title={def.name}
                className={`flex h-14 w-14 items-center justify-center rounded-md border bg-gradient-to-b from-[#2a2f42] to-[#171a25] transition ${isSel ? "selected-glow border-brass-2" : "border-brass/30 hover:border-brass/70"}`}
              >
                <SpriteIcon art={def.art} tint={def.tint} size={44} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
