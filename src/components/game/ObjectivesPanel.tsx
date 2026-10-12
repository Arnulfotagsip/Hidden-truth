"use client";

import { SpriteIcon } from "@/game/art/sprites";
import { requirementStatus } from "@/game/engine/completion";
import { getObject } from "@/game/engine/run";
import type { InteractionProgress, LevelDefinition } from "@/game/types";
import { IconCheck } from "@/components/ui/icons";

export function ObjectivesPanel({ level, run, compact }: { level: LevelDefinition; run: InteractionProgress; compact?: boolean }) {
  const status = requirementStatus(level, run);
  const finds = status.filter((s) => s.requirement.kind === "find");
  const steps = status.filter((s) => s.requirement.kind !== "find");
  const done = status.filter((s) => s.done).length;
  const pct = Math.round((done / Math.max(1, status.length)) * 100);
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-brass-2">Objective</div>
        <p className="mt-0.5 text-sm leading-snug text-cream/90">{level.objective}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Case progress">
          <div className="h-full bg-gradient-to-r from-brass to-brass-2 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1 text-[11px] text-cream/60">
          {done} of {status.length} requirements met
        </div>
      </div>
      {finds.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brass-2">Search list</div>
          <ul className={`mt-1 grid gap-1 ${compact ? "grid-cols-2" : ""}`}>
            {finds.map(({ requirement: r, done: ok }) => {
              const o = getObject(level, r.target);
              return (
                <li key={r.id} className={`flex items-center gap-2 rounded px-1.5 py-1 text-sm ${ok ? "text-cream/50 line-through" : "text-cream"}`}>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded ${ok ? "bg-sage/20" : "bg-black/30"}`}>
                    {ok ? <IconCheck size={16} className="text-sage" /> : o ? <span className="opacity-40 grayscale brightness-[2.5] contrast-0"><SpriteIcon art={o.art} variant={o.variant} size={22} /></span> : null}
                  </span>
                  <span className="truncate">{o?.name ?? r.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {steps.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brass-2">Investigation</div>
          <ul className="mt-1 space-y-1">
            {steps.map(({ requirement: r, done: ok }) => (
              <li key={r.id} className={`flex items-start gap-2 text-sm ${ok ? "text-cream/50 line-through" : "text-cream"}`}>
                <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${ok ? "border-sage bg-sage/30" : "border-brass/50"}`}>{ok && <IconCheck size={12} />}</span>
                {r.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
