"use client";

import Link from "next/link";
import { getChapter, getEvidence, LEVELS } from "@/game/content";
import { EPILOGUE } from "@/game/content/epilogue";
import { chapterProgress } from "@/game/engine/progression";
import type { CaseCompletionResult, InteractionProgress, LevelDefinition, PlayerProgress } from "@/game/types";
import { flag } from "@/game/engine/flags";
import { IconStar } from "@/components/ui/icons";

interface Props {
  level: LevelDefinition;
  result: CaseCompletionResult;
  run: InteractionProgress;
  progress: PlayerProgress;
  onReplay: () => void;
}

export function Resolution({ level, result, run, progress, onReplay }: Props) {
  const chapter = getChapter(level.chapterId)!;
  const next = result.nextLevelId ? LEVELS.find((l) => l.id === result.nextLevelId) : null;
  const discoveries = run.evidence.map((id) => getEvidence(id)).filter(Boolean);
  const solved = [
    ...level.puzzles.filter((p) => run.flags.includes(flag.solved(p.id))).map((p) => p.title),
    ...level.deductions.filter((d) => run.flags.includes(flag.deduced(d.id))).map((d) => `Deduction: ${d.title}`),
  ];
  const cp = chapterProgress(progress, chapter.id);
  const final = level.number === LEVELS.length && LEVELS.length === 100;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <article className="panel fade-in rounded-xl p-5 sm:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-brass/80">
          Case {level.number} closed · Chapter {chapter.number}
        </p>
        <h1 className="mt-1 font-display text-3xl text-brass-2 sm:text-4xl">{level.title}</h1>
        <div className="mt-3 flex items-center gap-1 text-brass-2" aria-label={`${result.stars} of 3 stars`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <IconStar key={i} size={28} filled={i < result.stars} />
          ))}
          <span className="ml-2 text-sm text-cream/70">{result.completeness}% thorough</span>
        </div>

        <section className="mt-6">
          <h2 className="font-display text-xl text-cream">What you established</h2>
          <p className="mt-2 leading-relaxed text-cream/90">{level.summary}</p>
          <p className="mt-3 rounded-md border-l-2 border-burgundy-2 bg-white/5 px-3 py-2 italic text-cream/85">{level.reveal}</p>
        </section>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Requirements", `${result.requiredFound}/${result.requiredTotal}`],
            ["Optional finds", `${result.optionalFound}/${result.optionalTotal}`],
            ["Puzzles & deductions", String(result.puzzlesSolved)],
            ["Hints used", String(result.hintsUsed)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-brass/20 bg-white/5 p-3 text-center">
              <dt className="text-[11px] uppercase tracking-wider text-cream/60">{k}</dt>
              <dd className="mt-1 font-display text-2xl text-brass-2">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-cream/55">Stars reward thoroughness (optional evidence and brass wren tokens). Hints never cost you stars.</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <section>
            <h2 className="font-display text-lg text-cream">Important discoveries</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {discoveries.length === 0 && <li className="text-cream/60">No new evidence this time.</li>}
              {discoveries.map((e) => (
                <li key={e!.id}>
                  <span className="font-semibold text-cream">{e!.name}</span>
                  <span className="block text-cream/65">{e!.significance}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-display text-lg text-cream">Solved</h2>
            <ul className="mt-2 space-y-1 text-sm text-cream/85">
              {solved.length === 0 && <li className="text-cream/60">This case was solved through careful searching.</li>}
              {solved.map((s) => (
                <li key={s}>✓ {s}</li>
              ))}
            </ul>
          </section>
        </div>

        {result.chapterComplete && (
          <section className="mt-8 rounded-lg border border-brass/40 bg-gradient-to-b from-brass/10 to-transparent p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-brass-2">Chapter {chapter.number} complete</p>
            <h2 className="font-display text-2xl text-cream">{chapter.title}</h2>
            <p className="mt-2 leading-relaxed text-cream/90">{chapter.closing}</p>
            <p className="mt-2 text-sm text-cream/65">
              {cp.done}/{cp.total} cases closed · {cp.stars}/{cp.maxStars} stars
            </p>
          </section>
        )}

        {final && (
          <section className="mt-8 rounded-lg border border-brass-2/60 bg-black/30 p-5 sm:p-7">
            <h2 className="font-display text-3xl text-brass-2">{EPILOGUE.title}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-cream/90">
              {EPILOGUE.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-5 font-display text-lg italic text-brass-2">Every clue tells a story.</p>
          </section>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {next && (
            <Link href={`/play/${next.id}`} className="btn btn-primary px-6 py-3">
              {result.chapterComplete ? `Next chapter: ${getChapter(next.chapterId)?.title}` : `Next case: ${next.title}`}
            </Link>
          )}
          <button type="button" className="btn btn-ghost" onClick={onReplay}>
            Replay this case
          </button>
          <Link href="/cases" className="btn btn-ghost">
            Case selection
          </Link>
          <Link href="/notebook" className="btn btn-ghost">
            Open notebook
          </Link>
        </div>
      </article>
    </div>
  );
}
