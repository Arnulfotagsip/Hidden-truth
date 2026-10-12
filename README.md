# CASE FILES: Hidden Truths

*Every clue tells a story.*

A frontend-only detective hidden-object and puzzle adventure built with Next.js (App Router), TypeScript and Tailwind CSS. No backend, no database — progress is saved in the browser's LocalStorage (with JSON export/import).

## Status (work in progress)

- Engine, UI, save system, hints, deductions and all puzzle types: implemented.
- Content: Chapters 1–3 (levels 1–30) written and validated. Chapters 4–10 still to be authored.
- Chapter 1 has been played end-to-end through the real UI with Playwright.

## Scripts

```bash
npm install
npm run dev          # http://localhost:3000
npx vitest run       # registry validation + automated solver for every level
npx playwright test  # browser playthroughs (needs a running server, see playwright.config.ts)
```

## Layout

- `src/game/types.ts` — data model
- `src/game/engine/` — pure game rules (interactions, puzzles, hints, solver, progression, persistence)
- `src/game/content/` — chapters, items and level definitions (`levels/chNN.ts`)
- `src/game/art/` — procedural SVG sprites, room shells and pictures
- `src/components/` — React UI
- `tests/` — unit (Vitest) and end-to-end (Playwright) tests
