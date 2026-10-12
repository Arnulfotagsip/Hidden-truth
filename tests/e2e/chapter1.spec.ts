import { test } from "@playwright/test";
import { LEVELS } from "../../src/game/content";
import { installSave, playLevelThroughUI } from "./driver";

test("Chapter 1 is playable start to finish through the UI", async ({ page, isMobile }) => {
  test.setTimeout(600_000);
  await installSave(page, null);
  const known = new Set<string>();
  for (const level of LEVELS.filter((l) => l.chapterId === "ch1")) {
    await playLevelThroughUI(page, level, known, { touch: isMobile });
  }
});
