/**
 * Opt-in visual review helper: SHOTS="c2-01,c2-03" captures every room of
 * the listed levels into test-results/shots. Skipped unless SHOTS is set.
 */
import { test } from "@playwright/test";
import { LEVELS } from "../../src/game/content";
import { installSave, saveBefore } from "./driver";

const ids = (process.env.SHOTS ?? "").split(",").filter(Boolean);

test.describe("scene screenshots", () => {
  test.skip(ids.length === 0, "set SHOTS to capture scenes");
  for (const id of ids) {
    test(`shot ${id}`, async ({ page }, info) => {
      const idx = LEVELS.findIndex((l) => l.id === id);
      const level = LEVELS[idx];
      await installSave(page, saveBefore(idx));
      await page.goto(`/play/${id}`);
      await page.getByRole("button", { name: /investigation/i }).first().click();
      await page.locator("svg.scene-svg").waitFor();
      for (const area of level.scene.areas) {
        if (level.scene.areas.length > 1) {
          await page.getByRole("navigation", { name: "Rooms" }).getByRole("button", { name: area.name }).click();
        }
        await page.waitForTimeout(250);
        await page.locator("svg.scene-svg").screenshot({ path: `test-results/shots/${info.project.name}-${id}-${area.id}.png` });
      }
    });
  }
});
