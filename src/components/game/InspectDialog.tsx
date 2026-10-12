"use client";

import { SpriteIcon } from "@/game/art/sprites";
import { getItem } from "@/game/content/items";
import type { DocumentContent } from "@/game/types";
import { Modal } from "@/components/ui/Modal";
import { DocumentView } from "./DocumentView";

export interface InspectTarget {
  title: string;
  art: string;
  tint?: string;
  variant?: string;
  description: string;
  observations?: string[];
  document?: DocumentContent;
  notes?: string[];
  status?: string;
}

export function InspectDialog({ target, onClose }: { target: InspectTarget | null; onClose: () => void }) {
  if (!target) return null;
  return (
    <Modal
      open
      title={target.title}
      onClose={onClose}
      size={target.document ? "lg" : "md"}
      footer={
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Return to the scene
        </button>
      }
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex shrink-0 items-center justify-center self-center rounded-lg bg-gradient-to-b from-paper to-paper-dark p-3 sm:self-start">
          <SpriteIcon art={target.art} tint={target.tint} variant={target.variant} size={120} />
        </div>
        <div className="min-w-0 flex-1 space-y-2 text-sm leading-relaxed">
          {target.status && <div className="chip border-brass-2 text-brass-2">{target.status}</div>}
          <p className="text-cream/90">{target.description}</p>
          {target.observations?.map((o, i) => (
            <p key={i} className="border-l-2 border-brass/50 pl-3 italic text-cream/80">
              {o}
            </p>
          ))}
          {target.notes?.map((n, i) => (
            <p key={`n${i}`} className="text-brass-2">
              {n}
            </p>
          ))}
        </div>
      </div>
      {target.document && (
        <div className="mt-4">
          <DocumentView doc={target.document} />
        </div>
      )}
    </Modal>
  );
}

export function itemInspectTarget(id: string): InspectTarget | null {
  const it = getItem(id);
  if (!it) return null;
  return { title: it.name, art: it.art, tint: it.tint, description: it.description, observations: it.inspect ? [it.inspect] : undefined, status: "In your inventory" };
}
