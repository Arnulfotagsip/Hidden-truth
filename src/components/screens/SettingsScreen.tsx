"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useGame } from "@/components/game/GameProvider";
import { QuickSettings } from "@/components/game/QuickSettings";
import { ConfirmDialog } from "@/components/ui/Modal";
import { IconBack } from "@/components/ui/icons";

export function SettingsScreen() {
  const game = useGame();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const download = () => {
    const blob = new Blob([game.exportSave()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `case-files-save-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ ok: true, text: "Backup downloaded." });
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    const text = await f.text();
    const res = game.importSave(text);
    setMessage({ ok: res.ok, text: res.message });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
      <div className="mb-5 flex items-center gap-3">
        <Link href="/" className="btn btn-ghost px-2.5 py-1.5" aria-label="Home">
          <IconBack size={18} />
        </Link>
        <h1 className="font-display text-3xl text-brass-2">Settings</h1>
      </div>

      <section className="panel rounded-xl p-5">
        <h2 className="mb-2 font-display text-lg text-cream">Sound & accessibility</h2>
        <QuickSettings />
      </section>

      <section className="panel mt-4 rounded-xl p-5">
        <h2 className="font-display text-lg text-cream">Saved progress</h2>
        <p className="mt-1 text-sm leading-relaxed text-cream/75">
          Progress is stored only in this browser&apos;s local storage. It is not uploaded anywhere and does not sync between devices or browsers. Export a backup file to move it or keep it safe.
        </p>
        {!game.storageOk && <p className="mt-2 rounded bg-danger/20 px-3 py-2 text-sm text-[#f7dcd6]">Local storage is unavailable right now, so changes won&apos;t persist.</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary" onClick={download}>
            Export save file
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
            Import save file
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} aria-label="Import save file" />
          <button type="button" className="btn btn-danger ml-auto" onClick={() => setConfirmReset(true)}>
            Reset progress
          </button>
        </div>
        {message && (
          <p role="status" className={`mt-3 rounded px-3 py-2 text-sm ${message.ok ? "bg-sage/20 text-[#cfe8d6]" : "bg-danger/20 text-[#f7dcd6]"}`}>
            {message.text}
          </p>
        )}
      </section>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all progress?"
        message="Every closed case, your notebook and all in-progress investigations will be erased from this browser. Settings are kept. This cannot be undone unless you have exported a backup."
        confirmLabel="Erase progress"
        danger
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          game.newGame();
          setConfirmReset(false);
          setMessage({ ok: true, text: "Progress reset. Case 1 awaits." });
        }}
      />
    </div>
  );
}
