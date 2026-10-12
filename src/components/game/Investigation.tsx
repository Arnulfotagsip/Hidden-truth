"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getChapter, getEvidence } from "@/game/content";
import { getItem } from "@/game/content/items";
import { isLevelComplete } from "@/game/engine/completion";
import { flag, hasAll } from "@/game/engine/flags";
import { requestHint } from "@/game/engine/hints";
import { clickObject, combineItems, moveToArea, submitDeduction, submitPuzzle, type GameEvent } from "@/game/engine/interactions";
import type { PuzzleAnswer } from "@/game/engine/puzzles";
import { knownEvidence } from "@/game/engine/progression";
import { getObject, isAreaAccessible } from "@/game/engine/run";
import type { HitRegion, InteractionProgress, InteractiveObject, LevelDefinition } from "@/game/types";
import { audio, playSfx } from "@/lib/audio";
import { useGame } from "./GameProvider";
import { SceneView, type SceneFlash } from "./SceneView";
import { InventoryBar } from "./InventoryBar";
import { ObjectivesPanel } from "./ObjectivesPanel";
import { InspectDialog, itemInspectTarget, type InspectTarget } from "./InspectDialog";
import { PuzzleDialog, type ClueNote } from "./PuzzleDialog";
import { DeductionBoard } from "./DeductionBoard";
import { Notebook } from "./Notebook";
import { Modal } from "@/components/ui/Modal";
import { QuickSettings } from "./QuickSettings";
import { IconBack, IconBoard, IconBulb, IconGear, IconLock, IconNotebook } from "@/components/ui/icons";

interface Toast {
  id: number;
  text: string;
  tone: "info" | "good" | "warn" | "hint";
}

interface Props {
  level: LevelDefinition;
  run: InteractionProgress;
  onCloseCase: (run: InteractionProgress) => void;
}

function ambientFor(level: LevelDefinition, areaId: string) {
  const a = level.scene.areas.find((x) => x.id === areaId)?.shell;
  if (!a) return "interior" as const;
  if (a.kind === "train") return "train" as const;
  if (a.weather === "rain") return "rain" as const;
  if (a.weather === "snow" || a.floor === "snow" || a.wall === "ice") return "wind" as const;
  return "interior" as const;
}

export function Investigation({ level, run, onCloseCase }: Props) {
  const game = useGame();
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  }, [run]);

  const [selected, setSelected] = useState<string | null>(null);
  const [combineFrom, setCombineFrom] = useState<string | null>(null);
  const [inspect, setInspect] = useState<InspectTarget | null>(null);
  const [puzzleId, setPuzzleId] = useState<string | null>(null);
  const [puzzleFeedback, setPuzzleFeedback] = useState<{ ok: boolean; message: string; key: number } | null>(null);
  const [dedOpen, setDedOpen] = useState(false);
  const [dedFeedback, setDedFeedback] = useState<{ deductionId: string; ok: boolean; message: string; key: number } | null>(null);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [flashes, setFlashes] = useState<SceneFlash[]>([]);
  const [highlight, setHighlight] = useState<{ region: HitRegion; tier: number; area?: string } | null>(null);
  const [newEvidence, setNewEvidence] = useState<string[]>([]);
  const seq = useRef(0);

  const known = useMemo(() => knownEvidence(game.progress, run), [game.progress, run]);
  const complete = isLevelComplete(level, run);
  const chapter = getChapter(level.chapterId);
  const anyModal = Boolean(inspect || puzzleId || dedOpen || notebookOpen || settingsOpen);

  useEffect(() => {
    audio?.setAmbient(ambientFor(level, run.area));
  }, [level, run.area]);
  useEffect(() => () => audio?.setAmbient("none"), []);

  const toast = useCallback((text: string, tone: Toast["tone"] = "info") => {
    const id = ++seq.current;
    setToasts((t) => [...t.slice(-2), { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === "hint" ? 9000 : 4200);
  }, []);

  const flash = useCallback((x: number, y: number, kind: SceneFlash["kind"]) => {
    const key = ++seq.current;
    setFlashes((f) => [...f.slice(-4), { key, x, y, kind }]);
    window.setTimeout(() => setFlashes((f) => f.filter((z) => z.key !== key)), 1000);
  }, []);

  const commit = useCallback(
    (next: InteractionProgress) => {
      if (next === runRef.current) return;
      const before = runRef.current;
      runRef.current = next;
      const added = next.evidence.filter((e) => !before.evidence.includes(e));
      if (added.length) setNewEvidence((n) => [...n, ...added]);
      game.commitRun(next);
    },
    [game],
  );

  const objectTarget = useCallback(
    (o: InteractiveObject, status?: string, notes?: string[]): InspectTarget => {
      const opened = run.flags.includes(flag.opened(o.id)) || runRef.current.flags.includes(flag.opened(o.id));
      return {
        title: o.name,
        art: opened && o.openArt ? o.openArt : o.art,
        tint: o.tint,
        variant: opened ? (o.openArt ? undefined : "open") : o.variant,
        description: o.description,
        observations: o.observations,
        document: o.document,
        status,
        notes,
      };
    },
    [run.flags],
  );

  const handleEvents = useCallback(
    (events: GameEvent[], point?: { x: number; y: number }) => {
      for (const ev of events) {
        switch (ev.type) {
          case "miss":
            if (point) flash(point.x, point.y, "miss");
            playSfx("miss");
            break;
          case "inspect": {
            const o = getObject(level, ev.objectId)!;
            playSfx(o.document ? "paper" : "click");
            setInspect(objectTarget(o));
            break;
          }
          case "collected": {
            const o = getObject(level, ev.objectId)!;
            flash(o.box.x + o.box.w / 2, o.box.y + o.box.h / 2, "found");
            playSfx(ev.document ? "paper" : "collect");
            const notes: string[] = [];
            if (ev.item) notes.push(`Added to your inventory: ${getItem(ev.item)?.name}.`);
            if (ev.evidence) notes.push("Recorded in your case notebook.");
            if (ev.collectible) {
              toast(`Collectible found: ${o.name}`, "good");
            } else if (ev.evidence || ev.document) {
              setInspect(objectTarget(o, "Discovered", notes));
            } else {
              toast(notes[0] ?? `Found: ${o.name}`, "good");
            }
            break;
          }
          case "opened": {
            const o = getObject(level, ev.objectId)!;
            flash(o.box.x + o.box.w / 2, o.box.y + o.box.h / 2, "found");
            playSfx("unlock");
            const extra = [ev.item ? `You take the ${getItem(ev.item)?.name}.` : "", ev.evidence ? "Recorded in your notebook." : ""].filter(Boolean).join(" ");
            toast(`${ev.text ?? `The ${o.name.toLowerCase()} is open.`} ${extra}`.trim(), "good");
            setSelected(null);
            break;
          }
          case "locked":
            playSfx("click");
            toast(`${ev.message}${runRef.current.inventory.length ? " (Select an item from your inventory, then tap here to use it.)" : ""}`, "warn");
            break;
          case "blocked":
          case "areaLocked":
            playSfx("click");
            toast(ev.message, "warn");
            break;
          case "openPuzzle":
            playSfx("click");
            setPuzzleFeedback(null);
            setPuzzleId(ev.puzzleId);
            break;
          case "invalidItem":
            playSfx("wrong");
            toast(ev.message, "warn");
            setSelected(null);
            break;
          case "combined":
            playSfx("combine");
            toast(`${ev.text} You now have: ${getItem(ev.output)?.name}.`, "good");
            setSelected(null);
            setCombineFrom(null);
            break;
          case "invalidCombination":
            playSfx("wrong");
            toast(ev.message, "warn");
            setCombineFrom(null);
            break;
          case "solved":
            playSfx("solve");
            setPuzzleFeedback({ ok: true, message: ev.text, key: ++seq.current });
            window.setTimeout(() => setPuzzleId(null), 900);
            toast(ev.text, "good");
            break;
          case "wrongAnswer":
            playSfx("wrong");
            setPuzzleFeedback({ ok: false, message: ev.message, key: ++seq.current });
            break;
          case "deduced":
            playSfx("solve");
            setDedFeedback({ deductionId: ev.deductionId, ok: true, message: ev.text, key: ++seq.current });
            break;
          case "deductionFailed":
            playSfx("wrong");
            setDedFeedback({ deductionId: ev.deductionId, ok: false, message: ev.message, key: ++seq.current });
            break;
          case "moved":
            playSfx("step");
            setHighlight((h) => (h?.area && h.area !== ev.area ? null : h));
            break;
          case "alreadySolved":
            break;
        }
      }
    },
    [flash, level, objectTarget, toast],
  );

  const onObject = useCallback(
    (o: InteractiveObject, point: { x: number; y: number }) => {
      if (combineFrom) setCombineFrom(null);
      const res = clickObject(level, runRef.current, o.id, selected);
      commit(res.run);
      handleEvents(res.events, point);
      setHighlight(null);
    },
    [level, selected, combineFrom, commit, handleEvents],
  );

  const onMiss = useCallback(
    (point: { x: number; y: number }) => {
      handleEvents([{ type: "miss" }], point);
      if (selected) setSelected(null);
    },
    [handleEvents, selected],
  );

  const onCombineWith = (b: string) => {
    if (!combineFrom) return;
    const res = combineItems(level, runRef.current, combineFrom, b);
    commit(res.run);
    handleEvents(res.events);
  };

  const onPuzzleSubmit = (answer: PuzzleAnswer) => {
    if (!puzzleId) return;
    const res = submitPuzzle(level, runRef.current, puzzleId, answer);
    commit(res.run);
    handleEvents(res.events);
  };

  const onDeduce = (id: string, conclusion: string, evidence: string[]) => {
    const res = submitDeduction(level, runRef.current, id, conclusion, evidence, known);
    commit(res.run);
    handleEvents(res.events);
  };

  const onMove = (areaId: string) => {
    const res = moveToArea(level, runRef.current, areaId);
    commit(res.run);
    handleEvents(res.events);
  };

  const onHint = () => {
    const res = requestHint(level, runRef.current, known);
    if (!res.ok) {
      toast(`You've used your free hints. The next one is ready in ${Math.ceil(res.waitMs / 1000)}s.`, "warn");
      return;
    }
    commit(res.run);
    playSfx("hint");
    toast(res.hint.text, "hint");
    if (res.hint.highlight) {
      setHighlight({ region: res.hint.highlight, tier: res.hint.tier, area: res.hint.area });
      if (res.hint.area && res.hint.area !== runRef.current.area) {
        const name = level.scene.areas.find((a) => a.id === res.hint.area)?.name;
        toast(`(That's in the ${name}.)`, "hint");
      }
    } else setHighlight(null);
  };

  const puzzle = level.puzzles.find((p) => p.id === puzzleId) ?? null;
  const clueNotes: ClueNote[] = useMemo(() => {
    if (!puzzle) return [];
    const out: ClueNote[] = [];
    for (const ref of puzzle.clueRefs) {
      const o = getObject(level, ref);
      if (o) {
        if (run.flags.includes(flag.found(o.id)) || run.flags.includes(flag.opened(o.id))) out.push({ id: o.id, name: o.name, text: [o.description, ...(o.observations ?? [])].join(" "), document: o.document });
      } else if (known.includes(ref)) {
        const e = getEvidence(ref);
        if (e) out.push({ id: e.id, name: e.name, text: e.description, document: e.document });
      }
    }
    return out;
  }, [puzzle, level, run.flags, known]);

  const deductionReady = level.deductions.some((d) => !run.flags.includes(flag.deduced(d.id)) && hasAll(run.flags, d.requires));
  const freeLeft = Math.max(0, level.freeHints - run.hintsUsed);

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-2 px-2 pb-3 pt-2 sm:px-3">
      {/* Top bar */}
      <header className="panel flex flex-wrap items-center gap-2 rounded-lg px-2 py-1.5">
        <Link href="/cases" className="btn btn-ghost px-2 py-1.5" aria-label="Back to case selection">
          <IconBack size={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[11px] uppercase tracking-wider text-brass/80">
            Case {level.number} · Chapter {chapter?.number}: {chapter?.title}
          </div>
          <h1 className="truncate font-display text-base text-cream sm:text-lg">{level.title}</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" className="btn btn-ghost relative px-2.5 py-1.5" onClick={() => setNotebookOpen(true)} aria-label="Case notebook">
            <IconNotebook size={18} />
            <span className="hidden md:inline">Notebook</span>
            {newEvidence.length > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-burgundy-2 px-1.5 text-[10px] font-bold">{newEvidence.length}</span>}
          </button>
          <button type="button" className="btn btn-ghost relative px-2.5 py-1.5" onClick={() => setDedOpen(true)} aria-label="Deduction board">
            <IconBoard size={18} />
            <span className="hidden md:inline">Deduce</span>
            {deductionReady && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-brass-2" aria-label="Deduction available" />}
          </button>
          <button type="button" className="btn btn-ghost px-2.5 py-1.5" onClick={onHint} aria-label={`Hint (${freeLeft} free left)`}>
            <IconBulb size={18} />
            <span className="hidden md:inline">Hint</span>
            <span className="rounded bg-black/40 px-1 text-[11px]">{freeLeft}</span>
          </button>
          <button type="button" className="btn btn-ghost px-2.5 py-1.5" onClick={() => setSettingsOpen(true)} aria-label="Pause and settings">
            <IconGear size={18} />
          </button>
        </div>
      </header>

      {level.scene.areas.length > 1 && (
        <nav aria-label="Rooms" className="flex gap-1.5 overflow-x-auto">
          {level.scene.areas.map((a) => {
            const open = isAreaAccessible(level, a.id, run.flags);
            const here = a.id === run.area;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onMove(a.id)}
                aria-current={here ? "location" : undefined}
                className={`btn shrink-0 px-3 py-1 text-sm ${here ? "btn-primary" : "btn-ghost"} ${open ? "" : "opacity-60"}`}
              >
                {!open && <IconLock size={14} />}
                {a.name}
              </button>
            );
          })}
        </nav>
      )}

      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="relative mx-auto w-full" style={{ maxWidth: "calc((100dvh - 230px) * 1.6)" }}>
            <div className="relative aspect-[16/10] w-full">
              <SceneView
                key={run.area}
                level={level}
                run={run}
                highlight={highlight && (!highlight.area || highlight.area === run.area) ? highlight : null}
                flashes={flashes}
                reducedMotion={game.reducedMotion}
                disabled={anyModal}
                itemMode={Boolean(selected)}
                onObject={onObject}
                onMiss={onMiss}
              />
              {/* Toasts */}
              <div className="pointer-events-none absolute inset-x-2 top-2 flex flex-col items-center gap-1.5" aria-live="polite">
                {toasts.map((t) => (
                  <div
                    key={t.id}
                    className={`toast-in max-w-xl rounded-md px-3 py-2 text-center text-sm shadow-lg ${
                      t.tone === "good" ? "bg-[#1f3a2c]/95 text-[#dff0e4]" : t.tone === "warn" ? "bg-[#3a1f22]/95 text-[#f7dcd6]" : t.tone === "hint" ? "border border-brass-2/60 bg-[#2a2414]/95 text-brass-2" : "bg-navy/95 text-cream"
                    }`}
                  >
                    {t.tone === "hint" && <IconBulb size={14} className="mr-1 inline" />}
                    {t.text}
                  </div>
                ))}
              </div>
              {complete && (
                <div className="absolute inset-x-0 bottom-3 flex justify-center">
                  <button type="button" className="btn btn-primary fade-in px-6 py-3 text-base shadow-2xl" onClick={() => onCloseCase(runRef.current)}>
                    Case requirements met — Close the case
                  </button>
                </div>
              )}
            </div>
          </div>
          <InventoryBar
            items={run.inventory}
            selected={selected}
            combineFrom={combineFrom}
            onSelect={(id) => {
              setSelected(id);
              setCombineFrom(null);
              if (id) playSfx("click");
            }}
            onInspect={(id) => setInspect(itemInspectTarget(id))}
            onStartCombine={(id) => {
              setCombineFrom(id);
              setSelected(null);
            }}
            onCombineWith={onCombineWith}
          />
        </div>
        <aside className="panel rounded-lg p-3 lg:max-h-[calc(100dvh-110px)] lg:overflow-y-auto">
          <ObjectivesPanel level={level} run={run} />
          {deductionReady && (
            <button type="button" className="btn btn-ghost mt-3 w-full text-sm" onClick={() => setDedOpen(true)}>
              <IconBoard size={16} /> You can make a deduction
            </button>
          )}
        </aside>
      </div>

      <InspectDialog target={inspect} onClose={() => setInspect(null)} />
      <PuzzleDialog puzzle={puzzle} feedback={puzzleFeedback} clues={clueNotes} onSubmit={onPuzzleSubmit} onClose={() => setPuzzleId(null)} />
      <DeductionBoard key={dedOpen ? "open" : "closed"} open={dedOpen} level={level} run={run} known={known} feedback={dedFeedback} onSubmit={onDeduce} onClose={() => setDedOpen(false)} />
      <Modal open={notebookOpen} title="Case Notebook" onClose={() => { setNotebookOpen(false); setNewEvidence([]); }} size="xl">
        <Notebook progress={game.progress} extra={run.evidence} chapterId={level.chapterId} newIds={newEvidence} />
      </Modal>
      <Modal open={settingsOpen} title="Paused" onClose={() => setSettingsOpen(false)} size="sm">
        <QuickSettings />
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary flex-1" onClick={() => setSettingsOpen(false)}>
            Resume
          </button>
          <Link href="/cases" className="btn btn-ghost flex-1">
            Case selection
          </Link>
        </div>
        <p className="mt-3 text-xs text-cream/60">Your progress in this case is saved automatically.</p>
      </Modal>
    </div>
  );
}
