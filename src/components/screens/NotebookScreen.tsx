"use client";

import Link from "next/link";
import { useGame } from "@/components/game/GameProvider";
import { Notebook } from "@/components/game/Notebook";
import { IconBack } from "@/components/ui/icons";

export function NotebookScreen() {
  const game = useGame();
  return (
    <div className="mx-auto max-w-6xl px-3 py-5 sm:px-5 sm:py-8">
      <div className="mb-5 flex items-center gap-3">
        <Link href="/" className="btn btn-ghost px-2.5 py-1.5" aria-label="Home">
          <IconBack size={18} />
        </Link>
        <h1 className="font-display text-3xl text-brass-2">Case Notebook</h1>
      </div>
      <div className="panel rounded-xl p-4">{game.ready ? <Notebook progress={game.progress} /> : <p className="text-cream/60">Loading…</p>}</div>
    </div>
  );
}
