"use client";

import { useGame } from "./GameProvider";
import { playSfx } from "@/lib/audio";

function Toggle({ label, checked, onChange, desc }: { label: string; checked: boolean; onChange: (v: boolean) => void; desc?: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5">
      <span>
        <span className="block text-sm text-cream">{label}</span>
        {desc && <span className="block text-xs text-cream/60">{desc}</span>}
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-9 cursor-pointer accent-[#c9a25a]" />
    </label>
  );
}

function Slider({ label, value, onChange, disabled }: { label: string; value: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <label className={`flex items-center gap-3 py-1 ${disabled ? "opacity-50" : ""}`}>
      <span className="w-28 text-sm text-cream/85">{label}</span>
      <input type="range" min={0} max={1} step={0.05} value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 accent-[#c9a25a]" aria-label={label} />
      <span className="w-10 text-right font-mono text-xs text-cream/70">{Math.round(value * 100)}%</span>
    </label>
  );
}

export function QuickSettings() {
  const { progress, updateSettings } = useGame();
  const s = progress.settings;
  return (
    <div className="divide-y divide-brass/15">
      <div className="pb-2">
        <Toggle label="Sound effects" checked={s.sfx} onChange={(v) => { updateSettings({ sfx: v }); if (v) window.setTimeout(() => playSfx("click"), 50); }} />
        <Slider label="Effects volume" value={s.sfxVolume} disabled={!s.sfx} onChange={(v) => updateSettings({ sfxVolume: v })} />
        <Toggle label="Ambient music" checked={s.music} onChange={(v) => updateSettings({ music: v })} desc="Soft procedural ambience; starts after your first click." />
        <Slider label="Music volume" value={s.musicVolume} disabled={!s.music} onChange={(v) => updateSettings({ musicVolume: v })} />
      </div>
      <div className="pt-2">
        <label className="flex items-center justify-between gap-3 py-1.5">
          <span className="text-sm text-cream">Reduce motion</span>
          <select value={s.reducedMotion} onChange={(e) => updateSettings({ reducedMotion: e.target.value as typeof s.reducedMotion })} className="rounded-md border border-brass/30 bg-black/30 px-2 py-1 text-sm">
            <option value="system">Follow system</option>
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </label>
        <Toggle label="Larger text" checked={s.textSize === "large"} onChange={(v) => updateSettings({ textSize: v ? "large" : "normal" })} />
        <Toggle label="Higher contrast" checked={s.highContrast} onChange={(v) => updateSettings({ highContrast: v })} />
      </div>
    </div>
  );
}
