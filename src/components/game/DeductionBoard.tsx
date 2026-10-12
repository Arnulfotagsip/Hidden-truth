"use client";

import { useMemo, useState } from "react";
import { EVIDENCE } from "@/game/content";
import { flag, hasAll } from "@/game/engine/flags";
import type { DeductionPuzzle, EvidenceItem, InteractionProgress, LevelDefinition } from "@/game/types";
import { Modal } from "@/components/ui/Modal";
import { IconCheck, IconLock } from "@/components/ui/icons";
import { EvidenceCard } from "./EvidenceCard";

interface Props {
  open: boolean;
  level: LevelDefinition;
  run: InteractionProgress;
  known: string[];
  feedback: { deductionId: string; ok: boolean; message: string; key: number } | null;
  onSubmit: (deductionId: string, conclusion: string, evidence: string[]) => void;
  onClose: () => void;
}

export function DeductionBoard({ open, level, run, known, feedback, onSubmit, onClose }: Props) {
  const firstOpen = level.deductions.find((d) => !run.flags.includes(flag.deduced(d.id)))?.id ?? level.deductions[0]?.id;
  const [activeId, setActiveId] = useState<string | undefined>(firstOpen);
  const active = level.deductions.find((d) => d.id === activeId) ?? level.deductions[0];

  return (
    <Modal open={open} title="Deduction Board" onClose={onClose} size="xl">
      {level.deductions.length === 0 ? (
        <p className="text-sm text-cream/75">This case has no deductions to make. Focus on searching the scene and solving its mechanisms.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <nav aria-label="Deductions" className="space-y-2">
            {level.deductions.map((d) => {
              const solved = run.flags.includes(flag.deduced(d.id));
              const locked = !hasAll(run.flags, d.requires);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveId(d.id)}
                  aria-current={active?.id === d.id}
                  className={`flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm ${active?.id === d.id ? "border-brass-2 bg-brass/15" : "border-brass/25 bg-white/5 hover:border-brass/60"}`}
                >
                  {solved ? <IconCheck size={16} className="text-sage" /> : locked ? <IconLock size={16} className="text-cream/50" /> : <span className="h-2 w-2 rounded-full bg-burgundy-2" />}
                  <span className="flex-1">{d.title}</span>
                </button>
              );
            })}
          </nav>
          {active && (
            <DeductionPanel
              key={active.id}
              d={active}
              level={level}
              run={run}
              known={known}
              feedback={feedback?.deductionId === active.id ? feedback : null}
              onSubmit={onSubmit}
            />
          )}
        </div>
      )}
    </Modal>
  );
}

function DeductionPanel({ d, level, run, known, feedback, onSubmit }: { d: DeductionPuzzle; level: LevelDefinition; run: InteractionProgress; known: string[]; feedback: Props["feedback"]; onSubmit: Props["onSubmit"] }) {
  const solved = run.flags.includes(flag.deduced(d.id));
  const locked = !hasAll(run.flags, d.requires);
  const [conclusion, setConclusion] = useState<string | null>(solved ? d.answer : null);
  const [selected, setSelected] = useState<string[]>(solved ? d.evidence : []);
  const [scope, setScope] = useState<"chapter" | "all">("chapter");
  const [query, setQuery] = useState("");

  const pool = useMemo(() => {
    const items = known.map((id) => EVIDENCE[id]).filter((e): e is EvidenceItem => Boolean(e));
    const q = query.trim().toLowerCase();
    return items
      .filter((e) => scope === "all" || e.chapterId === level.chapterId || selected.includes(e.id))
      .filter((e) => !q || e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
      .sort((a, b) => (a.levelId === level.id ? -1 : 0) - (b.levelId === level.id ? -1 : 0));
  }, [known, scope, query, level.chapterId, level.id, selected]);

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const conclusionText = d.conclusions.find((c) => c.id === conclusion)?.text;

  if (locked) {
    return (
      <div className="rounded-md border border-brass/25 bg-white/5 p-4 text-sm text-cream/75">
        <p className="font-display text-base text-cream">{d.question}</p>
        <p className="mt-2">You haven&apos;t gathered enough to attempt this deduction yet. Keep investigating.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="font-display text-lg text-cream">{d.question}</p>
        <fieldset className="mt-2" disabled={solved}>
          <legend className="sr-only">Conclusion</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {d.conclusions.map((c) => (
              <label key={c.id} className={`flex cursor-pointer items-center gap-2 rounded-md border p-2.5 text-sm ${conclusion === c.id ? "border-brass-2 bg-brass/15" : "border-brass/25 bg-white/5 hover:border-brass/60"}`}>
                <input type="radio" name={`c-${d.id}`} checked={conclusion === c.id} onChange={() => setConclusion(c.id)} className="accent-[#c9a25a]" />
                {c.text}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Pinboard: the chosen conclusion with red string to each cited clue. */}
      <div className="relative overflow-hidden rounded-lg border border-[#6d4a2c] bg-[#a07a4e] p-3" aria-hidden>
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          {selected.map((_, i) => {
            const x = ((i + 0.5) / Math.max(1, selected.length)) * 100;
            return <line key={i} x1="50" y1="22" x2={x} y2="78" stroke="#b02a2a" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />;
          })}
        </svg>
        <div className="relative mx-auto w-fit max-w-[80%] rotate-[-1deg] bg-paper px-3 py-2 text-center text-sm text-[#2a2018] shadow">{conclusionText ?? "Choose a conclusion"}</div>
        <div className="relative mt-8 flex flex-wrap justify-around gap-2">
          {selected.length === 0 && <span className="text-xs text-[#2a2018]/70">Pin evidence below</span>}
          {selected.map((id, i) => (
            <span key={id} className="max-w-[9rem] truncate bg-[#efe4cc] px-2 py-1 text-xs text-[#2a2018] shadow" style={{ transform: `rotate(${(i % 3) - 1}deg)` }}>
              {EVIDENCE[id]?.name}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-brass-2">Your evidence</span>
          <div className="ml-auto flex items-center gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" aria-label="Search evidence" className="w-36 rounded-md border border-brass/30 bg-black/30 px-2 py-1 text-sm" />
            <select value={scope} onChange={(e) => setScope(e.target.value as "chapter" | "all")} aria-label="Evidence scope" className="rounded-md border border-brass/30 bg-black/30 px-2 py-1 text-sm">
              <option value="chapter">This chapter</option>
              <option value="all">Whole case</option>
            </select>
          </div>
        </div>
        <div className="scrollbar-thin grid max-h-64 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {pool.length === 0 && <p className="text-sm text-cream/60">No matching evidence. Try “Whole case” — the notebook keeps everything you&apos;ve found.</p>}
          {pool.map((e) => (
            <EvidenceCard key={e.id} evidence={e} compact selected={selected.includes(e.id)} onClick={() => !solved && toggle(e.id)} />
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {solved ? (
          <p className="rounded-md bg-sage/20 px-3 py-2 text-sm text-[#cfe8d6]">{d.successText}</p>
        ) : (
          feedback && (
            <p key={feedback.key} className={`rounded-md px-3 py-2 text-sm ${feedback.ok ? "bg-sage/20 text-[#cfe8d6]" : "shake bg-danger/15 text-[#f3c2bb]"}`}>
              {feedback.message}
            </p>
          )
        )}
      </div>
      {!solved && (
        <div className="flex justify-end">
          <button type="button" className="btn btn-primary" disabled={!conclusion || selected.length === 0} onClick={() => conclusion && onSubmit(d.id, conclusion, selected)}>
            Connect the evidence
          </button>
        </div>
      )}
    </div>
  );
}
