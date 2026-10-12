import { SpriteIcon } from "@/game/art/sprites";
import type { EvidenceCategory, EvidenceItem } from "@/game/types";

export const CATEGORY_LABEL: Record<EvidenceCategory, string> = {
  physical: "Physical",
  document: "Document",
  photograph: "Photograph",
  testimony: "Testimony",
  record: "Record",
  environmental: "Environmental",
};

const CATEGORY_ART: Record<EvidenceCategory, string> = {
  physical: "evidence-bag",
  document: "paper",
  photograph: "photo",
  testimony: "note",
  record: "folder",
  environmental: "footprint",
};

export function evidenceArt(e: EvidenceItem): string {
  return CATEGORY_ART[e.category];
}

interface CardProps {
  evidence: EvidenceItem;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  isNew?: boolean;
}

export function EvidenceCard({ evidence, selected, onClick, compact, isNew }: CardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex w-full items-start gap-3 rounded-lg border p-2.5 text-left transition ${
        selected ? "selected-glow border-brass-2 bg-brass/15" : "border-brass/25 bg-white/[0.04] hover:border-brass/60 hover:bg-white/[0.07]"
      }`}
    >
      <span className="shrink-0 rounded-md bg-paper/90 p-1">
        <SpriteIcon art={evidenceArt(evidence)} size={compact ? 30 : 38} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-cream">{evidence.name}</span>
        <span className="block text-[11px] uppercase tracking-wider text-brass/80">{CATEGORY_LABEL[evidence.category]}</span>
        {!compact && <span className="mt-0.5 line-clamp-2 block text-xs text-cream/70">{evidence.significance}</span>}
      </span>
      {isNew && <span className="absolute right-2 top-2 rounded bg-burgundy-2 px-1.5 text-[10px] font-bold uppercase text-cream">New</span>}
    </button>
  );
}
