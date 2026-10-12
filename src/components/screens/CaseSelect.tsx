"use client";

import Link from "next/link";
import { useState } from "react";
import { CHAPTERS, LEVELS, getLevel } from "@/game/content";
import { chapterProgress, isChapterUnlocked, isLevelUnlocked, lockedReason } from "@/game/engine/progression";
import { useGame } from "@/components/game/GameProvider";
import { Difficulty } from "@/components/game/Briefing";
import { IconBack, IconCheck, IconLock, IconStar } from "@/components/ui/icons";

export function CaseSelect() {
  const game = useGame();
  const p = game.progress;
  const current = getLevel(p.currentLevelId);
  const [openChapter, setOpenChapter] = useState<string | null>(null);
  const [lockMsg, setLockMsg] = useState<{ id: string; text: string } | null>(null);
  const totalClosed = Object.keys(p.completed).length;
  const activeChapter = openChapter ?? current?.chapterId ?? CHAPTERS[0].id;

  return (
    <div className="mx-auto max-w-6xl px-3 py-5 sm:px-5 sm:py-8">
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <Link href="/" className="btn btn-ghost px-2.5 py-1.5" aria-label="Home">
          <IconBack size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-3xl text-brass-2">Case Selection</h1>
          <p className="text-sm text-cream/70">
            {totalClosed} of {LEVELS.length} cases closed · {CHAPTERS.length} chapters
          </p>
        </div>
        <Link href="/notebook" className="btn btn-ghost">
          Notebook
        </Link>
      </div>

      {!game.ready ? (
        <p className="text-cream/60">Loading your case files…</p>
      ) : (
        <div className="space-y-3">
          {CHAPTERS.map((c) => {
            const unlocked = isChapterUnlocked(p.completed, c.id);
            const cp = chapterProgress(p, c.id);
            const expanded = activeChapter === c.id;
            const isCurrent = current?.chapterId === c.id;
            const levels = LEVELS.filter((l) => l.chapterId === c.id);
            return (
              <section key={c.id} className={`panel overflow-hidden rounded-xl ${expanded ? "" : "opacity-95"}`} style={{ borderLeft: `4px solid ${c.accent}` }}>
                <button type="button" className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left" onClick={() => setOpenChapter(expanded ? "__none__" : c.id)} aria-expanded={expanded}>
                  <span className="font-display text-2xl text-brass-2/80">{String(c.number).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg text-cream">{c.title}</span>
                      {isCurrent && <span className="chip border-brass-2 text-brass-2">Current</span>}
                      {!unlocked && (
                        <span className="chip text-cream/60">
                          <IconLock size={12} /> Sealed
                        </span>
                      )}
                      {cp.done === cp.total && <span className="chip border-sage text-sage">Complete</span>}
                    </span>
                    <span className="block text-xs text-cream/60">{c.subtitle}</span>
                  </span>
                  <span className="flex items-center gap-3 text-sm text-cream/75">
                    <span>
                      {cp.done}/{cp.total}
                    </span>
                    <span className="flex items-center gap-1 text-brass-2">
                      <IconStar size={14} filled /> {cp.stars}/{cp.maxStars}
                    </span>
                  </span>
                  <span className="h-1 w-full overflow-hidden rounded bg-white/10">
                    <span className="block h-full bg-brass" style={{ width: `${(cp.done / cp.total) * 100}%` }} />
                  </span>
                </button>
                {expanded && (
                  <div className="border-t border-brass/15 px-4 pb-4 pt-3">
                    <p className="mb-3 max-w-3xl text-sm leading-relaxed text-cream/80">{unlocked ? c.summary : lockedReason(p, levels[0].id)}</p>
                    {cp.done === cp.total && <p className="mb-3 max-w-3xl rounded-md bg-white/5 px-3 py-2 text-sm italic text-cream/80">{c.closing}</p>}
                    <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                      {levels.map((l) => {
                        const open = isLevelUnlocked(p, l.id);
                        const rec = p.completed[l.id];
                        const inProgress = Boolean(p.runs[l.id]);
                        const status = rec ? "Completed" : inProgress ? "In progress" : open ? "Unlocked" : "Locked";
                        const body = (
                          <>
                            <span className="flex items-center justify-between text-xs">
                              <span className="font-display text-base text-brass-2">{l.number}</span>
                              <span className={`flex items-center gap-1 ${rec ? "text-sage" : inProgress ? "text-brass-2" : open ? "text-cream/70" : "text-cream/45"}`}>
                                {rec ? <IconCheck size={13} /> : !open ? <IconLock size={13} /> : null}
                                {status}
                              </span>
                            </span>
                            <span className={`mt-1 block text-sm font-semibold leading-tight ${open ? "text-cream" : "text-cream/55"}`}>{l.title}</span>
                            <span className="mt-2 flex items-center justify-between">
                              <Difficulty value={l.difficulty} />
                              {rec && (
                                <span className="flex text-brass-2" aria-label={`${rec.stars} stars`}>
                                  {Array.from({ length: 3 }).map((_, i) => (
                                    <IconStar key={i} size={13} filled={i < rec.stars} />
                                  ))}
                                </span>
                              )}
                            </span>
                          </>
                        );
                        const cls = `block h-full rounded-lg border p-3 text-left transition ${
                          open ? (l.id === p.currentLevelId && !rec ? "border-brass-2 bg-brass/10 hover:bg-brass/15" : "border-brass/25 bg-white/[0.04] hover:border-brass/60") : "cursor-not-allowed border-white/10 bg-black/20"
                        }`;
                        return (
                          <li key={l.id}>
                            {open ? (
                              <Link href={`/play/${l.id}`} className={cls} aria-label={`Case ${l.number}: ${l.title}. ${status}.${rec ? " Replay available." : ""}`}>
                                {body}
                              </Link>
                            ) : (
                              <button type="button" className={cls + " w-full"} aria-disabled="true" onClick={() => setLockMsg({ id: l.id, text: lockedReason(p, l.id) ?? "Locked." })}>
                                {body}
                                {lockMsg?.id === l.id && <span className="mt-2 block text-xs text-cream/70">{lockMsg.text}</span>}
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
