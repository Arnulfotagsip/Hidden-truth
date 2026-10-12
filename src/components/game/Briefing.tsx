"use client";

import Link from "next/link";
import { getChapter, getEvidence } from "@/game/content";
import { getItem } from "@/game/content/items";
import type { LevelDefinition, PlayerProgress } from "@/game/types";
import { IconBack, IconLock, IconStar } from "@/components/ui/icons";

export function Difficulty({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Difficulty ${value} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`h-1.5 w-3 rounded-sm ${i < value ? "bg-burgundy-2" : "bg-white/15"}`} />
      ))}
    </span>
  );
}

export function Briefing({ level, progress, resumable, onBegin, onRestart }: { level: LevelDefinition; progress: PlayerProgress; resumable: boolean; onBegin: () => void; onRestart: () => void }) {
  const chapter = getChapter(level.chapterId)!;
  const record = progress.completed[level.id];
  const recall = level.recall.map((id) => ({ id, ev: getEvidence(id), found: progress.evidence.includes(id) }));
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <Link href="/cases" className="mb-4 inline-flex items-center gap-1 text-sm text-brass-2 hover:underline">
        <IconBack size={16} /> Case selection
      </Link>
      <article className="paper fade-in relative overflow-hidden rounded-lg p-6 sm:p-9">
        <div className="absolute right-5 top-5 rotate-6 rounded border-2 border-[#8e2f3f] px-2 py-0.5 font-display text-xs font-bold uppercase tracking-[0.25em] text-[#8e2f3f] opacity-80">Confidential</div>
        <p className="text-xs uppercase tracking-[0.25em] text-black/60">
          Chapter {chapter.number} · {chapter.title}
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#1d1610] sm:text-4xl">
          Case {level.number}: {level.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-black/70">
          <span>{level.location}</span>
          <span className="flex items-center gap-1.5">
            Difficulty <Difficulty value={level.difficulty} />
          </span>
          {record && (
            <span className="flex items-center gap-0.5 text-[#8a6a20]" aria-label={`${record.stars} stars`}>
              {Array.from({ length: 3 }).map((_, i) => (
                <IconStar key={i} size={16} filled={i < record.stars} />
              ))}
              <span className="ml-1">Closed</span>
            </span>
          )}
        </div>
        <p className="mt-5 text-[15px] leading-relaxed text-[#2a2018] sm:text-base">{level.briefing}</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <section>
            <h2 className="font-display text-lg text-[#6b2430]">Objective</h2>
            <p className="mt-1 text-sm text-[#2a2018]">{level.objective}</p>
            <ul className="mt-2 space-y-1 text-sm text-[#2a2018]/85">
              {level.requirements.map((r) => (
                <li key={r.id} className="flex gap-2">
                  <span className="text-[#6b2430]">▸</span>
                  {r.kind === "find" ? `Find: ${level.scene.objects.find((o) => o.id === r.target)?.name ?? r.label}` : r.label}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-display text-lg text-[#6b2430]">Known facts</h2>
            <ul className="mt-1 space-y-1 text-sm text-[#2a2018]">
              {level.knownFacts.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#6b2430]">•</span>
                  {f}
                </li>
              ))}
            </ul>
            {level.startingItems.length > 0 && (
              <p className="mt-2 text-sm text-[#2a2018]">
                <span className="font-semibold">You carry:</span> {level.startingItems.map((s) => getItem(s.item)?.name).join(", ")}
              </p>
            )}
          </section>
        </div>
        {recall.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-lg text-[#6b2430]">From your notebook</h2>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {recall.map(({ id, ev, found }) => (
                <li key={id} className="rounded border border-black/15 bg-white/40 p-2 text-sm text-[#2a2018]">
                  {found && ev ? (
                    <>
                      <span className="font-semibold">{ev.name}</span>
                      <span className="block text-xs text-black/70">{ev.significance}</span>
                    </>
                  ) : (
                    <span className="flex items-center gap-1 text-black/55">
                      <IconLock size={14} /> A clue from an earlier case you haven&apos;t recorded in this notebook.
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary px-6 py-3 text-base" onClick={onBegin} autoFocus>
            {resumable ? "Resume investigation" : record ? "Replay investigation" : "Begin investigation"}
          </button>
          {resumable && (
            <button type="button" className="btn border border-black/25 bg-black/5 px-4 text-[#2a2018] hover:bg-black/10" onClick={onRestart}>
              Restart this case
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
