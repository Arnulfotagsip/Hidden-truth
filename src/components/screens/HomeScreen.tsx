"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LEVELS, getLevel } from "@/game/content";
import { continueTarget, hasMeaningfulProgress } from "@/game/engine/progression";
import { useGame } from "@/components/game/GameProvider";
import { ConfirmDialog } from "@/components/ui/Modal";
import { HomeBackdrop } from "./HomeBackdrop";

export function HomeScreen() {
  const game = useGame();
  const router = useRouter();
  const [confirmNew, setConfirmNew] = useState(false);
  const has = game.ready && hasMeaningfulProgress(game.progress);
  const target = game.ready ? getLevel(continueTarget(game.progress)) : null;
  const closed = Object.keys(game.progress.completed).length;

  const startNew = () => {
    game.newGame();
    router.push(`/play/${LEVELS[0].id}`);
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="weather-anim">
        <HomeBackdrop />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/85" />
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-end px-5 pb-10 pt-16 sm:justify-center sm:pb-16">
        <div className="fade-in max-w-xl">
          <p className="font-display text-sm uppercase tracking-[0.5em] text-brass-2/90">Case Files</p>
          <h1 className="mt-2 font-display text-5xl leading-none text-cream drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] sm:text-7xl">Hidden Truths</h1>
          <p className="mt-3 font-display text-xl italic text-brass-2">Every clue tells a story.</p>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-cream/85">
            Inspector Margot Vance has vanished. Her last stop was Hollowmere House — shut for twenty years, since its owner died in a laboratory fire. Someone has been lighting candles there. Search, collect, deduce, and follow her trail through a hundred cases to the truth.
          </p>
          <nav className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap" aria-label="Main menu">
            {!game.ready ? (
              <span className="btn btn-ghost">Loading case files…</span>
            ) : has && target ? (
              <Link href={`/play/${target.id}`} className="btn btn-primary px-6 py-3 text-base">
                Continue Investigation
                <span className="text-xs font-normal opacity-80">· Case {target.number}</span>
              </Link>
            ) : (
              <Link href={`/play/${LEVELS[0].id}`} className="btn btn-primary px-6 py-3 text-base">
                Begin Investigation
              </Link>
            )}
            {has && (
              <button type="button" className="btn btn-ghost px-5 py-3" onClick={() => setConfirmNew(true)}>
                New Game
              </button>
            )}
            <Link href="/cases" className="btn btn-ghost px-5 py-3">
              Case Selection
            </Link>
            <Link href="/notebook" className="btn btn-ghost px-5 py-3">
              Notebook
            </Link>
            <Link href="/settings" className="btn btn-ghost px-5 py-3">
              Settings
            </Link>
          </nav>
          {game.ready && (
            <p className="mt-5 text-xs text-cream/55">
              {closed > 0 ? `${closed} of ${LEVELS.length} cases closed. ` : ""}Progress is saved in this browser only — use Settings › Export to back it up.
            </p>
          )}
          {game.warnings.length > 0 && (
            <div role="status" className="mt-4 rounded-md border border-brass/40 bg-black/50 p-3 text-xs text-cream/80">
              {game.warnings.map((w, i) => (
                <p key={i}>{w}</p>
              ))}
              <button type="button" className="mt-1 text-brass-2 underline" onClick={game.dismissWarnings}>
                Dismiss
              </button>
            </div>
          )}
        </div>
      </main>
      <ConfirmDialog
        open={confirmNew}
        title="Start a new game?"
        message={`This replaces your current progress (${closed} case${closed === 1 ? "" : "s"} closed, ${game.progress.evidence.length} pieces of evidence). Your settings are kept. Consider exporting a backup from Settings first.`}
        confirmLabel="Start over"
        danger
        onCancel={() => setConfirmNew(false)}
        onConfirm={() => {
          setConfirmNew(false);
          startNew();
        }}
      />
    </div>
  );
}
