import { describe, it, expect } from "vitest";
import { validateRegistry, simulateFullPlaythrough } from "@/game/validation";

describe("scratch", () => {
  it("validates", () => {
    const errs = validateRegistry({ expectComplete: false }).filter((e) => !e.startsWith("Expected 10 chapters"));
    console.log(errs.join("\n"));
    const sim = simulateFullPlaythrough();
    console.log(sim.results.map((r) => `${r.levelId} ${r.complete} ${r.steps}`).join("\n"));
    expect(errs).toEqual([]);
  });
});
