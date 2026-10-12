/**
 * Drives real gameplay through the browser UI. The solver chooses each next
 * legitimate action; a shadow copy of the engine state tells the driver
 * where on screen the target is. Every action is performed the way a
 * player would: clicking/tapping the scene, the inventory and dialogs.
 */
import { expect, type Page } from "@playwright/test";
import { EVIDENCE, LEVELS } from "../../src/game/content";
import { itemName } from "../../src/game/content/items";
import { hitTest, regionBounds, regionFor, sceneToClient } from "../../src/game/engine/hit-test";
import { newProgress, computeUnlocked } from "../../src/game/engine/progression";
import { createRun, isVisible } from "../../src/game/engine/run";
import { applyAction, nextActions, solveLevel, type PlanAction } from "../../src/game/engine/solver";
import { isLevelComplete } from "../../src/game/engine/completion";
import { SAVE_KEY } from "../../src/game/engine/persistence";
import type { InteractionProgress, LevelDefinition, PlayerProgress } from "../../src/game/types";
import { SCENE_HEIGHT, SCENE_WIDTH } from "../../src/game/types";

/** Evidence a player would hold before starting level index `idx`. */
export function knownBefore(idx: number): Set<string> {
  const known = new Set<string>();
  for (let i = 0; i < idx; i++) {
    const res = solveLevel(LEVELS[i], createRun(LEVELS[i]), known);
    res.run.evidence.forEach((e) => known.add(e));
  }
  return known;
}

/** A save in which every level before `idx` has been legitimately closed. */
export function saveBefore(idx: number): PlayerProgress {
  const p = newProgress(Date.now());
  const completed: PlayerProgress["completed"] = {};
  for (let i = 0; i < idx; i++) completed[LEVELS[i].id] = { completedAt: Date.now(), stars: 1, hintsUsed: 0, optionalFound: 0, optionalTotal: 0 };
  const known = knownBefore(idx);
  return { ...p, completed, evidence: [...known], unlockedLevels: computeUnlocked(completed), currentLevelId: LEVELS[idx].id };
}

export async function installSave(page: Page, progress: PlayerProgress | null) {
  // The Next.js dev-tools badge (dev server only) can sit over the inventory.
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent = "nextjs-portal{display:none!important}";
    document.addEventListener("DOMContentLoaded", () => document.head.appendChild(style));
  });
  await page.goto("/settings");
  await page.evaluate(
    ([key, value]) => {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    },
    [SAVE_KEY, progress ? JSON.stringify(progress) : null] as const,
  );
}

async function sceneRect(page: Page) {
  const svg = page.locator("svg.scene-svg");
  await svg.scrollIntoViewIfNeeded();
  const box = await svg.boundingBox();
  if (!box) throw new Error("scene not visible");
  return { left: box.x, top: box.y, width: box.width, height: box.height };
}

/** A scene point that hit-tests to `objectId` given the current state. */
function pointFor(level: LevelDefinition, run: InteractionProgress, objectId: string) {
  const visible = level.scene.objects.filter((o) => o.area === run.area && isVisible(o, run.flags));
  const target = level.scene.objects.find((o) => o.id === objectId)!;
  const b = regionBounds(regionFor(target));
  const candidates: [number, number][] = [[b.x + b.w / 2, b.y + b.h / 2]];
  for (let fy = 0.15; fy <= 0.85; fy += 0.1) for (let fx = 0.15; fx <= 0.85; fx += 0.1) candidates.push([b.x + b.w * fx, b.y + b.h * fy]);
  for (const [x, y] of candidates) {
    if (x < 2 || y < 2 || x > SCENE_WIDTH - 2 || y > SCENE_HEIGHT - 2) continue;
    if (hitTest(visible, x, y)?.id === objectId) return { x, y };
  }
  throw new Error(`No clickable point for ${objectId}`);
}

async function tapScene(page: Page, level: LevelDefinition, run: InteractionProgress, objectId: string, touch: boolean) {
  const p = pointFor(level, run, objectId);
  const rect = await sceneRect(page);
  const c = sceneToClient(p.x, p.y, rect, { x: 0, y: 0, w: SCENE_WIDTH, h: SCENE_HEIGHT });
  if (touch) await page.touchscreen.tap(c.x, c.y);
  else await page.mouse.click(c.x, c.y);
}

async function dismissInspect(page: Page) {
  const ret = page.getByRole("button", { name: "Return to the scene" });
  if (await ret.isVisible().catch(() => false)) await ret.click();
}

async function inventoryButton(page: Page, itemId: string) {
  return page.getByRole("list", { name: "Inventory items" }).getByRole("button", { name: itemName(itemId), exact: true });
}

async function solvePuzzleUI(page: Page, level: LevelDefinition, puzzleId: string) {
  const p = level.puzzles.find((x) => x.id === puzzleId)!;
  const dialog = page.getByRole("dialog", { name: p.title });
  await expect(dialog).toBeVisible();
  switch (p.kind) {
    case "code": {
      const chars = p.answer.replace(/\s/g, "").toUpperCase().split("");
      for (let i = 0; i < chars.length; i++) await dialog.getByLabel(`Dial ${i + 1}`, { exact: true }).fill(chars[i]);
      await dialog.getByRole("button", { name: "Try combination" }).click();
      break;
    }
    case "cipher":
      for (let i = 0; i < p.shift; i++) await dialog.getByRole("button", { name: "Shift forward one" }).click();
      await dialog.getByRole("button", { name: "This is the message" }).click();
      break;
    case "sequence":
      for (const id of p.answer) {
        const label = p.symbols.find((s) => s.id === id)!.label;
        await dialog.getByRole("button", { name: label, exact: true }).click();
      }
      break;
    case "reconstruct": {
      const tiles = [...p.start];
      for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === i) continue;
        const j = tiles.indexOf(i);
        await dialog.getByRole("button", { name: new RegExp(`^Tile ${i + 1}(,|$)`) }).click();
        await dialog.getByRole("button", { name: new RegExp(`^Tile ${j + 1}(,|$)`) }).click();
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
      }
      break;
    }
    case "timeline": {
      const order = p.events.map((e) => e.id);
      for (let i = 0; i < p.answer.length; i++) {
        let j = order.indexOf(p.answer[i]);
        while (j > i) {
          await dialog.getByRole("button", { name: "Move earlier" }).nth(j).click();
          [order[j - 1], order[j]] = [order[j], order[j - 1]];
          j--;
        }
      }
      await dialog.getByRole("button", { name: "Confirm timeline" }).click();
      break;
    }
    case "choice": {
      const text = p.options.find((o) => o.id === p.answer)!.text;
      await dialog.getByLabel(text, { exact: true }).check();
      await dialog.getByRole("button", { name: "Confirm" }).click();
      break;
    }
  }
  await expect(dialog).toBeHidden({ timeout: 5000 });
}

async function deduceUI(page: Page, level: LevelDefinition, deductionId: string) {
  const d = level.deductions.find((x) => x.id === deductionId)!;
  await page.getByRole("button", { name: "Deduction board" }).click();
  const dialog = page.getByRole("dialog", { name: "Deduction Board" });
  await expect(dialog).toBeVisible();
  if (level.deductions.length > 1) await dialog.getByRole("navigation", { name: "Deductions" }).getByRole("button", { name: d.title }).click();
  await dialog.getByLabel(d.conclusions.find((c) => c.id === d.answer)!.text, { exact: true }).check();
  await dialog.getByLabel("Evidence scope").selectOption("all");
  for (const ev of d.evidence) {
    const name = EVIDENCE[ev].name;
    await dialog.locator("button[aria-pressed]", { hasText: name }).first().click();
  }
  await dialog.getByRole("button", { name: "Connect the evidence" }).click();
  await expect(dialog.getByText(d.successText)).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
}

/** Plays a level from its briefing to the resolution screen. */
export async function playLevelThroughUI(page: Page, level: LevelDefinition, known: Set<string>, opts: { touch?: boolean } = {}) {
  await page.goto(`/play/${level.id}`);
  await page.getByRole("button", { name: /investigation/i }).first().click();
  await expect(page.locator("svg.scene-svg")).toBeVisible();
  let run = createRun(level);
  const steps: PlanAction[] = [];
  for (let guard = 0; guard < 200 && !isLevelComplete(level, run); guard++) {
    const a = nextActions(level, run, known)[0];
    if (!a) throw new Error(`[${level.id}] solver found no next action`);
    steps.push(a);
    switch (a.kind) {
      case "click":
        await tapScene(page, level, run, a.objectId, Boolean(opts.touch));
        break;
      case "use":
        await (await inventoryButton(page, a.itemId)).click();
        await tapScene(page, level, run, a.objectId, Boolean(opts.touch));
        break;
      case "combine":
        await (await inventoryButton(page, a.a)).click();
        await page.getByRole("button", { name: "Combine", exact: true }).click();
        await (await inventoryButton(page, a.b)).click();
        break;
      case "puzzle":
        await tapScene(page, level, run, a.objectId, Boolean(opts.touch));
        await solvePuzzleUI(page, level, a.puzzleId);
        break;
      case "deduce":
        await deduceUI(page, level, a.deductionId);
        break;
      case "move":
        await page.getByRole("navigation", { name: "Rooms" }).getByRole("button", { name: level.scene.areas.find((x) => x.id === a.area)!.name }).click();
        break;
    }
    run = applyAction(level, run, a, known);
    await page.waitForTimeout(60);
    await dismissInspect(page);
  }
  await page.getByRole("button", { name: /Close the case/ }).click();
  await expect(page.getByText(`Case ${level.number} closed`, { exact: false })).toBeVisible();
  run.evidence.forEach((e) => known.add(e));
  return steps;
}
