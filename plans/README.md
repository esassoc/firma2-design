# Animation plans

From an `/improve-animations` audit of the whole spoke at commit `e2b2986`
(2026-10-18). Each plan is self-contained and written for an executor with no
context: exact files, current code, target values, and a feel-check.

## Recommended order

| # | Plan | Severity | Depends on | Status |
| --- | --- | --- | --- | --- |
| 001 | [Make the connections-graph highlight instant](001-graph-highlight-instant.md) | HIGH | — | TODO |
| 002 | [Make row hover-reveals instant](002-row-reveals-instant.md) | MEDIUM | — | TODO |
| 003 | [Honour reduced motion in scripted smooth scrolls](003-smooth-scroll-reduced-motion.md) | LOW | — | TODO |
| 004 | [Measure, then protect the frame budget of rail open/close](004-rail-resize-frame-budget.md) | MEDIUM | — (measurement first) | TODO |
| 005 | [44px touch targets for the peek button and graph nodes](005-touch-target-hitboxes.md) | MEDIUM | 001 (same file, `bcn-entity-graph.ts`) | TODO |
| 006 | [Fix the launcher card hover lift](006-launcher-card-hover.md) | LOW | — | TODO |
| 007 | [Map panel: decelerate in, shorter out](007-map-panel-enter-exit.md) | LOW | — | TODO |
| 008 | [Graph: shorter settle after a drag, exact zoom steps](008-graph-drag-settle-and-zoom-target.md) | LOW | 001, 005 (same file) | TODO |

001–003 are the cheapest high-leverage wins. 001, 005 and 008 all edit
`src/components/shared/bcn-entity-graph.ts` — run them in that order, not in
parallel. 004 may end as "measured, no change"; record its trace numbers here
either way.

## Not filed

- **Progress-ring draw-in** (`bcn-progress-ring.astro`, 1100ms + stagger) — a user decision of 2026-10-03. Note: it replays every time a peek opens. Open question for the user whether to scope it to first page load.
- **Hub tokens** — `--easing-standard` is the built-in `ease` and `--easing-exit` is `ease-in`. Both live in `@esa/tokens`; changes go through `/request-lego`, not a spoke plan.
- Already right: `bcn-sortable-list` FLIP and drop, rail and prose chevron rotations, map-plate inset travel, sidenav drag freeze, editable-field border hover.
