import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LEVELS, getLevel } from "@/game/content";
import { PlayScreen } from "@/components/game/PlayScreen";

export function generateStaticParams() {
  return LEVELS.map((l) => ({ levelId: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/play/[levelId]">): Promise<Metadata> {
  const { levelId } = await params;
  const level = getLevel(levelId);
  return { title: level ? `Case ${level.number}: ${level.title} · CASE FILES` : "Case not found · CASE FILES" };
}

async function PlayRoute({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId } = await params;
  if (!getLevel(levelId)) notFound();
  return <PlayScreen levelId={levelId} />;
}

export default function Page({ params }: PageProps<"/play/[levelId]">) {
  return (
    <Suspense fallback={<div className="flex min-h-[60dvh] items-center justify-center text-cream/60">Opening the case file…</div>}>
      <PlayRoute params={params} />
    </Suspense>
  );
}
