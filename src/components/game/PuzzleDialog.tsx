"use client";

import { useMemo, useState } from "react";
import { getPicture, PICTURE_H, PICTURE_W } from "@/game/art/pictures";
import { SpriteIcon } from "@/game/art/sprites";
import { caesarShift, type PuzzleAnswer } from "@/game/engine/puzzles";
import type { CipherPuzzle, CodePuzzle, ChoicePuzzle, PuzzleDefinition, ReconstructPuzzle, SequencePuzzle, TimelinePuzzle } from "@/game/types";
import { Modal } from "@/components/ui/Modal";
import { DocumentView } from "./DocumentView";
import type { DocumentContent } from "@/game/types";

export interface ClueNote {
  id: string;
  name: string;
  text: string;
  document?: DocumentContent;
}

interface Props {
  puzzle: PuzzleDefinition | null;
  feedback: { ok: boolean; message: string; key: number } | null;
  clues: ClueNote[];
  onSubmit: (answer: PuzzleAnswer) => void;
  onClose: () => void;
}

export function PuzzleDialog({ puzzle, feedback, clues, onSubmit, onClose }: Props) {
  const [showNotes, setShowNotes] = useState(false);
  if (!puzzle) return null;
  return (
    <Modal open title={puzzle.title} onClose={onClose} size="lg">
      <p className="mb-4 text-sm text-cream/80">{puzzle.prompt}</p>
      <div key={puzzle.id}>
        {puzzle.kind === "code" && <CodeUI p={puzzle} onSubmit={onSubmit} />}
        {puzzle.kind === "cipher" && <CipherUI p={puzzle} onSubmit={onSubmit} />}
        {puzzle.kind === "sequence" && <SequenceUI p={puzzle} onSubmit={onSubmit} />}
        {puzzle.kind === "reconstruct" && <ReconstructUI p={puzzle} onSubmit={onSubmit} />}
        {puzzle.kind === "timeline" && <TimelineUI p={puzzle} onSubmit={onSubmit} />}
        {puzzle.kind === "choice" && <ChoiceUI p={puzzle} onSubmit={onSubmit} />}
      </div>
      <div aria-live="polite" className="min-h-[2.5rem]">
        {feedback && (
          <p key={feedback.key} className={`mt-4 rounded-md px-3 py-2 text-sm ${feedback.ok ? "bg-sage/20 text-[#cfe8d6]" : "shake bg-danger/15 text-[#f3c2bb]"}`}>
            {feedback.message}
          </p>
        )}
      </div>
      <div className="mt-2 border-t border-brass/20 pt-3">
        <button type="button" className="text-sm text-brass-2 underline-offset-2 hover:underline" onClick={() => setShowNotes((v) => !v)} aria-expanded={showNotes}>
          {showNotes ? "Hide" : "Show"} relevant case notes ({clues.length})
        </button>
        {showNotes && (
          <div className="mt-3 space-y-3">
            {clues.length === 0 && <p className="text-sm text-cream/60">You haven't found the information this needs yet. Keep searching.</p>}
            {clues.map((c) =>
              c.document ? (
                <DocumentView key={c.id} doc={c.document} />
              ) : (
                <div key={c.id} className="rounded-md border border-brass/20 bg-white/5 p-3 text-sm">
                  <div className="font-semibold text-brass-2">{c.name}</div>
                  <div className="text-cream/80">{c.text}</div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

function CodeUI({ p, onSubmit }: { p: CodePuzzle; onSubmit: (a: PuzzleAnswer) => void }) {
  const len = p.answer.replace(/\s/g, "").length;
  const [vals, setVals] = useState<string[]>(() => Array.from({ length: len }, () => (p.charset === "digits" ? "0" : "A")));
  const chars = p.charset === "digits" ? "0123456789" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const spin = (i: number, d: number) =>
    setVals((v) => v.map((c, k) => (k === i ? chars[(chars.indexOf(c) + d + chars.length) % chars.length] : c)));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(vals.join(""));
      }}
    >
      <div className="flex flex-wrap justify-center gap-2">
        {vals.map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <button type="button" className="btn btn-ghost px-3 py-1" onClick={() => spin(i, 1)} aria-label={`Dial ${i + 1} up`}>
              ▲
            </button>
            <input
              aria-label={`Dial ${i + 1}`}
              value={c}
              inputMode={p.charset === "digits" ? "numeric" : "text"}
              maxLength={1}
              onChange={(e) => {
                const ch = e.target.value.toUpperCase().slice(-1);
                if (ch && chars.includes(ch)) setVals((v) => v.map((x, k) => (k === i ? ch : x)));
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  spin(i, 1);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  spin(i, -1);
                }
              }}
              className="h-14 w-12 rounded-md border-2 border-brass/50 bg-[#0d0f16] text-center font-mono text-2xl text-brass-2 focus:border-brass-2"
            />
            <button type="button" className="btn btn-ghost px-3 py-1" onClick={() => spin(i, -1)} aria-label={`Dial ${i + 1} down`}>
              ▼
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <button type="submit" className="btn btn-primary">
          Try combination
        </button>
      </div>
    </form>
  );
}

function CipherUI({ p, onSubmit }: { p: CipherPuzzle; onSubmit: (a: PuzzleAnswer) => void }) {
  const [shift, setShift] = useState(0);
  const preview = caesarShift(p.cipherText, -shift);
  return (
    <div>
      <div className="paper paper-typed rounded px-4 py-3 text-center text-lg tracking-[0.2em]">{p.cipherText}</div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button type="button" className="btn btn-ghost" onClick={() => setShift((s) => (s + 25) % 26)} aria-label="Shift back one">
          −
        </button>
        <div className="text-center">
          <div className="text-xs uppercase tracking-wider text-cream/60">Shift each letter back by</div>
          <div className="font-mono text-2xl text-brass-2" aria-live="polite">
            {shift}
          </div>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => setShift((s) => (s + 1) % 26)} aria-label="Shift forward one">
          +
        </button>
      </div>
      <div className="mt-4 rounded-md border border-brass/30 bg-black/30 px-4 py-3 text-center font-mono text-lg tracking-[0.15em] text-cream">{preview}</div>
      <div className="mt-4 flex justify-center">
        <button type="button" className="btn btn-primary" onClick={() => onSubmit(preview)}>
          This is the message
        </button>
      </div>
    </div>
  );
}

function SequenceUI({ p, onSubmit }: { p: SequencePuzzle; onSubmit: (a: PuzzleAnswer) => void }) {
  const [seq, setSeq] = useState<string[]>([]);
  const press = (id: string) => {
    const next = [...seq, id];
    if (next.length >= p.answer.length) {
      onSubmit(next);
      setSeq([]);
    } else setSeq(next);
  };
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {p.symbols.map((s) => (
          <button key={s.id} type="button" onClick={() => press(s.id)} className="flex w-24 flex-col items-center gap-1 rounded-lg border border-brass/40 bg-white/5 p-3 hover:border-brass-2 hover:bg-white/10">
            <SpriteIcon art={s.art ?? "symbol-tile"} variant={s.id} size={44} />
            <span className="text-sm">{s.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex min-h-10 flex-wrap items-center justify-center gap-2" aria-live="polite">
        {Array.from({ length: p.answer.length }).map((_, i) => (
          <span key={i} className={`chip ${seq[i] ? "border-brass-2 text-brass-2" : "text-cream/40"}`}>
            {seq[i] ? p.symbols.find((s) => s.id === seq[i])?.label : `${i + 1}`}
          </span>
        ))}
      </div>
      <div className="mt-3 flex justify-center">
        <button type="button" className="btn btn-ghost text-sm" onClick={() => setSeq([])} disabled={seq.length === 0}>
          Start over
        </button>
      </div>
    </div>
  );
}

function ReconstructUI({ p, onSubmit }: { p: ReconstructPuzzle; onSubmit: (a: PuzzleAnswer) => void }) {
  const [tiles, setTiles] = useState<number[]>(p.start);
  const [sel, setSel] = useState<number | null>(null);
  const pic = getPicture(p.picture);
  const tw = PICTURE_W / p.cols;
  const th = PICTURE_H / p.rows;
  const click = (i: number) => {
    if (sel === null) return setSel(i);
    if (sel === i) return setSel(null);
    const next = [...tiles];
    [next[sel], next[i]] = [next[i], next[sel]];
    setTiles(next);
    setSel(null);
    if (next.every((v, k) => v === k)) onSubmit(next);
  };
  return (
    <div>
      <div className="mx-auto grid max-w-xl gap-1 rounded-md bg-black/50 p-1" style={{ gridTemplateColumns: `repeat(${p.cols}, minmax(0, 1fr))` }}>
        {tiles.map((piece, i) => {
          const px = (piece % p.cols) * tw;
          const py = Math.floor(piece / p.cols) * th;
          return (
            <button
              key={i}
              type="button"
              onClick={() => click(i)}
              aria-label={`Tile ${i + 1}${sel === i ? ", selected" : ""}`}
              className={`relative block overflow-hidden rounded-sm ${sel === i ? "selected-glow" : "hover:brightness-110"}`}
              style={{ aspectRatio: `${tw} / ${th}` }}
            >
              <svg viewBox={`${px} ${py} ${tw} ${th}`} className="block h-full w-full" preserveAspectRatio="none" aria-hidden>
                {pic.draw()}
              </svg>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-cream/60">Select a piece, then another to swap them.</p>
      <div className="mt-2 flex justify-center">
        <button type="button" className="btn btn-ghost text-sm" onClick={() => onSubmit(tiles)}>
          Check arrangement
        </button>
      </div>
    </div>
  );
}

function TimelineUI({ p, onSubmit }: { p: TimelinePuzzle; onSubmit: (a: PuzzleAnswer) => void }) {
  const [order, setOrder] = useState<string[]>(() => p.events.map((e) => e.id));
  const byId = useMemo(() => new Map(p.events.map((e) => [e.id, e])), [p.events]);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };
  return (
    <div>
      <ol className="space-y-2">
        {order.map((id, i) => (
          <li key={id} className="flex items-center gap-2 rounded-md border border-brass/25 bg-white/5 p-2">
            <span className="w-6 text-center font-display text-brass-2">{i + 1}</span>
            <span className="flex-1 text-sm">{byId.get(id)?.text}</span>
            <button type="button" className="btn btn-ghost px-2 py-1" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier">
              ▲
            </button>
            <button type="button" className="btn btn-ghost px-2 py-1" onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label="Move later">
              ▼
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex justify-center">
        <button type="button" className="btn btn-primary" onClick={() => onSubmit(order)}>
          Confirm timeline
        </button>
      </div>
    </div>
  );
}

function ChoiceUI({ p, onSubmit }: { p: ChoicePuzzle; onSubmit: (a: PuzzleAnswer) => void }) {
  const [pick, setPick] = useState<string | null>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (pick) onSubmit(pick);
      }}
    >
      <fieldset>
        <legend className="mb-3 font-display text-base text-cream">{p.question}</legend>
        <div className="space-y-2">
          {p.options.map((o) => (
            <label key={o.id} className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${pick === o.id ? "border-brass-2 bg-brass/15" : "border-brass/25 bg-white/5 hover:border-brass/60"}`}>
              <input type="radio" name={p.id} value={o.id} checked={pick === o.id} onChange={() => setPick(o.id)} className="accent-[#c9a25a]" />
              {o.text}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-4 flex justify-center">
        <button type="submit" className="btn btn-primary" disabled={!pick}>
          Confirm
        </button>
      </div>
    </form>
  );
}
