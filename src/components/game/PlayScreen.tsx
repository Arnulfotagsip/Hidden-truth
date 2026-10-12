"use client";

import Link from "next/link";
import { useState } from "react";
import { getLevel } from "@/game/content";
import { isLevelUnlocked, lockedReason } from "@/game/engine/progression";
import type { CaseCompletionResult, InteractionProgress } from "@/game/types";
import { playSfx } from "@/lib/audio";
import { useGame } from "./GameProvider";
import { Briefing } from "./Briefing";
import { Investigation } from "./Investigation";
import { Resolution } from "./Resolution";
import { ConfirmDialog } from "@/components/ui/Modal";
import { IconLock } from "@/components/ui/icons";

type Phase = { kind: "briefing" } | { kind: "investigate" } | { kind: "resolved"; result: CaseCompletionResult; run: InteractionProgress };

export function PlayScreen({ levelId }: { levelId: string }) {
  const game = useGame();
  const level = getLevel(levelId);
  const [phase, setPhase] = useState<Phase>({ kind: "briefing" });
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!game.ready) {
    return <div className="flex min-h-[60dvh] items-center justify-center text-cream/60">Opening the case file…</div>;
  }
  if (!level) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-2xl text-brass-2">Case not found</h1>
        <Link href="/cases" className="btn btn-primary mt-6">
          Case selection
        </Link>
      </div>
    );
  }

  const unlocked = isLevelUnlocked(game.progress, level.id);
  if (!unlocked && phase.kind !== "resolved") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <IconLock size={40} className="mx-auto text-brass-2" />
        <h1 className="mt-3 font-display text-2xl text-cream">Case {level.number} is sealed</h1>
        <p className="mt-2 text-cream/75">{lockedReason(game.progress, level.id)}</p>
        <Link href="/cases" className="btn btn-primary mt-6">
          Case selection
        </Link>
      </div>
    );
  }

  const run = game.progress.runs[level.id];

  const begin = (fresh = false) => {
    const res = game.startLevel(level.id, { fresh });
    if (!res.ok) {
      setError(res.reason);
      return;
    }
    setPhase({ kind: "investigate" });
  };

  const closeCase = (r: InteractionProgress) => {
    const res = game.completeLevel(r);
    if (!res.ok) {
      setError(res.reason);
      return;
    }
    playSfx("complete");
    setPhase({ kind: "resolved", result: res.result, run: r });
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      {error && (
        <div role="alert" className="mx-auto mt-3 max-w-3xl rounded-md bg-danger/20 px-4 py-2 text-sm text-[#f7dcd6]">
          {error}
        </div>
      )}
      {phase.kind === "briefing" && <Briefing level={level} progress={game.progress} resumable={Boolean(run)} onBegin={() => begin(false)} onRestart={() => setConfirmRestart(true)} />}
      {phase.kind === "investigate" && run && <Investigation level={level} run={run} onCloseCase={closeCase} />}
      {phase.kind === "resolved" && <Resolution level={level} result={phase.result} run={phase.run} progress={game.progress} onReplay={() => begin(true)} />}
      <ConfirmDialog
        open={confirmRestart}
        title="Restart this case?"
        message="Your in-progress search for this case will be cleared. Evidence already in your notebook and other cases are not affected."
        confirmLabel="Restart case"
        danger
        onCancel={() => setConfirmRestart(false)}
        onConfirm={() => {
          setConfirmRestart(false);
          begin(true);
        }}
      />
    </>
  );
}
