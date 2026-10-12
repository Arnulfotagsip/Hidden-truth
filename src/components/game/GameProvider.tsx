"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { exportSave as exportSaveJson, importSave as importSaveJson, loadFromStorage, saveToStorage } from "@/game/engine/persistence";
import {
  completeLevel as completeLevelRule,
  newProgress,
  startLevel as startLevelRule,
  updateRun as updateRunRule,
  type CompleteResult,
  type StartResult,
} from "@/game/engine/progression";
import type { InteractionProgress, PlayerProgress, PlayerSettings } from "@/game/types";
import { audio } from "@/lib/audio";

interface GameContextValue {
  ready: boolean;
  progress: PlayerProgress;
  warnings: string[];
  storageOk: boolean;
  reducedMotion: boolean;
  startLevel: (levelId: string, opts?: { fresh?: boolean }) => StartResult;
  commitRun: (run: InteractionProgress) => void;
  completeLevel: (run: InteractionProgress) => CompleteResult;
  newGame: () => void;
  updateSettings: (patch: Partial<PlayerSettings>) => void;
  markChapterSeen: (chapterId: string) => void;
  exportSave: () => string;
  importSave: (text: string) => { ok: boolean; message: string };
  dismissWarnings: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

function getStorage(): Storage | null {
  try {
    const s = window.localStorage;
    const k = "__casefiles_probe__";
    s.setItem(k, "1");
    s.removeItem(k);
    return s;
  } catch {
    return null;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [progress, setProgressState] = useState<PlayerProgress>(() => newProgress(0));
  const [ready, setReady] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [storageOk, setStorageOk] = useState(true);
  const [systemReduced, setSystemReduced] = useState(false);
  const ref = useRef(progress);

  const setProgress = useCallback((p: PlayerProgress) => {
    ref.current = p;
    setProgressState(p);
  }, []);

  // Load once, in the browser only (avoids SSR/hydration mismatches).
  useEffect(() => {
    const storage = getStorage();
    if (!storage) {
      setStorageOk(false);
      setWarnings(["Your browser is blocking local storage, so progress can't be saved in this session."]);
      setProgress(newProgress());
    } else {
      const res = loadFromStorage(storage);
      setProgress(res.progress);
      if (res.warnings.length) setWarnings(res.warnings);
    }
    setReady(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    const unlock = () => audio?.unlock();
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
    return () => {
      mq.removeEventListener?.("change", onChange);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [setProgress]);

  // Persist after every change (once loaded).
  useEffect(() => {
    if (!ready) return;
    const storage = getStorage();
    if (storage) setStorageOk(saveToStorage(storage, progress));
  }, [progress, ready]);

  // Apply settings to the document and the audio engine.
  const s = progress.settings;
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.motion = s.reducedMotion === "system" ? "" : s.reducedMotion;
    html.dataset.text = s.textSize;
    html.dataset.contrast = s.highContrast ? "high" : "normal";
    audio?.configure(s);
  }, [s]);

  const reducedMotion = s.reducedMotion === "on" || (s.reducedMotion === "system" && systemReduced);

  const startLevel = useCallback(
    (levelId: string, opts?: { fresh?: boolean }) => {
      const res = startLevelRule(ref.current, levelId, opts);
      if (res.ok) setProgress(res.progress);
      return res;
    },
    [setProgress],
  );

  const commitRun = useCallback((run: InteractionProgress) => setProgress(updateRunRule(ref.current, run)), [setProgress]);

  const completeLevel = useCallback(
    (run: InteractionProgress) => {
      const res = completeLevelRule(ref.current, run);
      if (res.ok) setProgress(res.progress);
      return res;
    },
    [setProgress],
  );

  const newGame = useCallback(() => setProgress(newProgress(Date.now(), ref.current.settings)), [setProgress]);

  const updateSettings = useCallback(
    (patch: Partial<PlayerSettings>) => setProgress({ ...ref.current, settings: { ...ref.current.settings, ...patch } }),
    [setProgress],
  );

  const markChapterSeen = useCallback(
    (chapterId: string) => {
      if (ref.current.chapterSummariesSeen.includes(chapterId)) return;
      setProgress({ ...ref.current, chapterSummariesSeen: [...ref.current.chapterSummariesSeen, chapterId] });
    },
    [setProgress],
  );

  const exportSave = useCallback(() => exportSaveJson(ref.current), []);

  const importSave = useCallback(
    (text: string) => {
      const res = importSaveJson(text);
      if (!res.ok) return { ok: false, message: res.reason };
      setProgress(res.result.progress);
      const done = Object.keys(res.result.progress.completed).length;
      return { ok: true, message: `Save imported: ${done} case${done === 1 ? "" : "s"} closed.${res.result.warnings.length ? " " + res.result.warnings.join(" ") : ""}` };
    },
    [setProgress],
  );

  const value = useMemo<GameContextValue>(
    () => ({
      ready,
      progress,
      warnings,
      storageOk,
      reducedMotion,
      startLevel,
      commitRun,
      completeLevel,
      newGame,
      updateSettings,
      markChapterSeen,
      exportSave,
      importSave,
      dismissWarnings: () => setWarnings([]),
    }),
    [ready, progress, warnings, storageOk, reducedMotion, startLevel, commitRun, completeLevel, newGame, updateSettings, markChapterSeen, exportSave, importSave],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}
