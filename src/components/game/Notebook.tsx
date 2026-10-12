"use client";

import { useMemo, useState } from "react";
import { CHAPTERS, EVIDENCE, LEVELS, getLevel } from "@/game/content";
import type { EvidenceCategory, EvidenceItem, PlayerProgress } from "@/game/types";
import { CATEGORY_LABEL, EvidenceCard } from "./EvidenceCard";
import { DocumentView } from "./DocumentView";
import { IconLock } from "@/components/ui/icons";

interface Props {
  progress: PlayerProgress;
  /** Evidence discovered in the current run (may not be merged yet). */
  extra?: string[];
  /** Focus a chapter by default (e.g. the current case's chapter). */
  chapterId?: string;
  newIds?: string[];
}

/** The persistent case notebook: evidence, documents and story recaps. */
export function Notebook({ progress, extra = [], chapterId, newIds = [] }: Props) {
  const discovered = useMemo(() => new Set([...progress.evidence, ...extra]), [progress.evidence, extra]);
  const [tab, setTab] = useState<"evidence" | "recap">("evidence");
  const [chapter, setChapter] = useState<string>(chapterId ?? "all");
  const [category, setCategory] = useState<EvidenceCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const all = useMemo(() => Object.values(EVIDENCE), []);
  const inScope = all.filter((e) => chapter === "all" || e.chapterId === chapter);
  const found = inScope.filter((e) => discovered.has(e.id));
  const missing = inScope.length - found.length;
  const q = query.trim().toLowerCase();
  const shown = found
    .filter((e) => category === "all" || e.category === category)
    .filter((e) => !q || e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
  const open = openId ? EVIDENCE[openId] : null;

  return (
    <div>
      <div role="tablist" className="mb-3 flex gap-2">
        <button role="tab" aria-selected={tab === "evidence"} className={`btn ${tab === "evidence" ? "btn-primary" : "btn-ghost"} py-1.5 text-sm`} onClick={() => setTab("evidence")}>
          Evidence ({discovered.size})
        </button>
        <button role="tab" aria-selected={tab === "recap"} className={`btn ${tab === "recap" ? "btn-primary" : "btn-ghost"} py-1.5 text-sm`} onClick={() => setTab("recap")}>
          Case recap
        </button>
      </div>

      {tab === "evidence" && (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <select value={chapter} onChange={(e) => setChapter(e.target.value)} aria-label="Chapter" className="rounded-md border border-brass/30 bg-black/30 px-2 py-1 text-sm">
                <option value="all">All chapters</option>
                {CHAPTERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.number}. {c.title}
                  </option>
                ))}
              </select>
              <select value={category} onChange={(e) => setCategory(e.target.value as EvidenceCategory | "all")} aria-label="Category" className="rounded-md border border-brass/30 bg-black/30 px-2 py-1 text-sm">
                <option value="all">All types</option>
                {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes…" aria-label="Search notebook" className="min-w-0 flex-1 rounded-md border border-brass/30 bg-black/30 px-2 py-1 text-sm" />
            </div>
            <div className="scrollbar-thin grid max-h-[55dvh] gap-2 overflow-y-auto pr-1">
              {shown.map((e) => (
                <EvidenceCard key={e.id} evidence={e} selected={openId === e.id} onClick={() => setOpenId(e.id)} isNew={newIds.includes(e.id)} />
              ))}
              {shown.length === 0 && <p className="text-sm text-cream/60">No discovered evidence matches.</p>}
              {missing > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-brass/25 p-3 text-sm text-cream/55">
                  <IconLock size={16} /> {missing} piece{missing === 1 ? "" : "s"} of evidence {chapter === "all" ? "in the case" : "in this chapter"} not yet discovered.
                </div>
              )}
            </div>
          </div>
          <div className="min-h-40">{open ? <EvidenceDetail e={open} discovered={discovered} onOpen={setOpenId} /> : <p className="text-sm text-cream/60">Select a piece of evidence to read it.</p>}</div>
        </div>
      )}

      {tab === "recap" && <Recap progress={progress} />}
    </div>
  );
}

function EvidenceDetail({ e, discovered, onOpen }: { e: EvidenceItem; discovered: Set<string>; onOpen: (id: string) => void }) {
  const lvl = getLevel(e.levelId);
  return (
    <div className="fade-in space-y-3">
      <div>
        <h3 className="font-display text-xl text-brass-2">{e.name}</h3>
        <p className="text-xs uppercase tracking-wider text-cream/60">
          {CATEGORY_LABEL[e.category]} · {e.location} {lvl ? `· Case ${lvl.number}` : ""}
        </p>
      </div>
      <p className="text-sm leading-relaxed text-cream/90">{e.description}</p>
      <p className="rounded-md border-l-2 border-burgundy-2 bg-white/5 px-3 py-2 text-sm text-cream/85">
        <span className="font-semibold text-brass-2">Significance: </span>
        {e.significance}
      </p>
      {e.document && <DocumentView doc={e.document} />}
      {e.related.length > 0 && (
        <div>
          <div className="mb-1 text-xs uppercase tracking-wider text-cream/60">Related</div>
          <div className="flex flex-wrap gap-2">
            {e.related.map((r) =>
              discovered.has(r) && EVIDENCE[r] ? (
                <button key={r} type="button" className="chip hover:border-brass-2" onClick={() => onOpen(r)}>
                  {EVIDENCE[r].name}
                </button>
              ) : (
                <span key={r} className="chip text-cream/45">
                  <IconLock size={12} /> Undiscovered
                </span>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Recap({ progress }: { progress: PlayerProgress }) {
  const closed = LEVELS.filter((l) => l.id in progress.completed);
  if (closed.length === 0) return <p className="text-sm text-cream/65">Close your first case to start the recap.</p>;
  return (
    <div className="scrollbar-thin max-h-[60dvh] space-y-5 overflow-y-auto pr-1">
      {CHAPTERS.map((c) => {
        const lv = closed.filter((l) => l.chapterId === c.id);
        if (lv.length === 0) return null;
        const done = lv.length === LEVELS.filter((l) => l.chapterId === c.id).length;
        return (
          <section key={c.id}>
            <h3 className="font-display text-lg text-brass-2">
              Chapter {c.number}: {c.title}
            </h3>
            <ol className="mt-2 space-y-2 border-l border-brass/30 pl-4">
              {lv.map((l) => (
                <li key={l.id} className="text-sm">
                  <span className="font-semibold text-cream">
                    {l.number}. {l.title}
                  </span>
                  <span className="block text-cream/75">{l.reveal}</span>
                </li>
              ))}
            </ol>
            {done && <p className="mt-2 rounded-md bg-white/5 px-3 py-2 text-sm italic text-cream/85">{c.closing}</p>}
          </section>
        );
      })}
    </div>
  );
}
