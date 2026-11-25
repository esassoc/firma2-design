# 04 — Data surfaces scroll inside themselves

Status: ready-for-human
Owns: the components listed below only (`src/components/**`); not layouts, not the top bar
Spec: `../spec.md` finding #6

## Problem

Wide content widens the pane instead of scrolling inside its own box, so the whole page pans sideways on a phone or tablet:

- AG Grid: `.ag-header-container` / `.ag-center-cols-container` measured 870–1107px wide at 768 on `/prototypes/projects`, `/performance-measures`, `/workspace-settings/users`, `/workspace-settings/pm2`, `/classifications/[slug]` (grid wrappers: find the spoke components that host `ag-grid`, e.g. `firma2-project-grid`, `firma2-data-grid`, `firma2-user-grid`, `firma2-pm2-catalog`, `firma2-measure-table`). The grid must own horizontal scroll (its viewport scrolls; the host has `min-width: 0` / `overflow: hidden` on the track).
- `table.firma2-settings-table` (`/prototypes/review`, 479px in a 480px pane at 768 — borderline, and the custom-fields `<table>` at 331px in a 110px pane at 390). Wrap tables in a scroll container with `overflow-x: auto; overscroll-behavior-x: contain; -webkit-overflow-scrolling: touch` — in the shared `firma2-settings-table.css` so every settings table gets it, and in `firma2-custom-fields` if it has its own table.
- `div.firma2-data-grid__controls-filters.cluster` (200px at x=304 in a 390 viewport on `/workspace-settings/users`): the filter cluster must wrap (`flex-wrap`) and the search `esa-text-field` must be allowed to shrink (`min-width: 0`, `flex: 1 1 12rem`), on every page that uses the data-grid controls.
- Leaflet tiles/SVG extending past the pane on map pages are clipped by the map box; confirm the map host has `overflow: hidden` and leave them.

Prefer a layout primitive or an existing `firma2-`/`bcn-` wrapper over a new class (`extend-spoke-components-first`). If a scroll wrapper is needed in more than one place, make it one small component or one shared stylesheet rule, not five copies.

## Verify

```
cd /private/tmp/claude-501/-Users-mauricio-Documents-GitHub-firma2-design/e6d75c19-5384-48d9-bacc-9cf45a8116ee/scratchpad/pw
WIDTHS=390,768 ROUTES=/prototypes/projects,/prototypes/review,/prototypes/workspace-settings/users,/prototypes/workspace-settings/custom-fields,/prototypes/workspace-settings/pm2,/prototypes/performance-measures OUT=./shots-04 node audit.mjs
```

Metric: `pane+N` → `pane+0` on every listed route at both widths, and the `WIDE` list no longer contains `ag-header-container`, `firma2-settings-table`, `firma2-custom-fields__table`, or `firma2-data-grid__controls-filters`. Ticket 01 is widening the pane concurrently; `pane+0` is the target regardless of pane width.

## Comments

### Result (2026-10-21)

`pane+` before -> after (real layout, pane still 110px at 390 / 480 at 768 because ticket 01 has not landed; every residual `pane+N` now equals the top bar's own overflow, which ticket 02 owns):

| Route | 390 before -> after | 768 before -> after |
|---|---|---|
| /prototypes/projects | 234 -> 234 (bar 233) | 60 -> 60 (bar 60) |
| /prototypes/review | 353 -> 69 (bar 69) | 23 -> 0 |
| /workspace-settings/users | 114 -> 78 (bar 78) | 0 -> 0 |
| /workspace-settings/custom-fields | 245 -> 303* | 0 -> 0 |
| /workspace-settings/pm2 | 265 -> 265 (bar 265) | 86 -> 86 (bar 86) |
| /performance-measures | 114 -> 53 | 0 -> 0 |

\* custom-fields at 390: non-bar content no longer exceeds the pane (probe `nonBarOverPane` is -24 on every route at 768 and on custom-fields/review/pm2 at 390). The remaining number is `.esa-container`'s hub `min-width: 320px` inside the 110px pane (a sibling-ticket artifact), not the table. Residuals at 390 on projects/users/performance-measures are likewise the 320px container and a 131px filter trigger in a 110px pane. With the nav removed (probe NONAV=1, pane ~340-390) users, review, custom-fields and performance-measures are `pane+0`; projects and pm2 keep only the top bar's overflow (36 / 57).

Grids: `.ag-center-cols-viewport` / `.ag-body-horizontal-scroll-viewport` now report `scrollWidth > clientWidth` with `overflow-x: auto|scroll` on all four grid routes (e.g. 1107 in 318 on projects at 390; 930 in 366 on users at 768). Tables: `.firma2-settings-table-scroll` reports 531 in 62 (review, 390), 389 in 62 (custom-fields, 390).
`ag-header-container` still appears in the WIDE list; it is clipped by the grid viewport, as expected. `firma2-settings-table`, `firma2-custom-fields__table` and `firma2-data-grid__controls-filters` no longer widen the pane.

### Files changed

- `src/components/shared/firma2-data-grid-chrome.css`: `.firma2-data-grid__grid` gets `min-width: 0; max-width: 100%` (the real cause: its intrinsic header width propped the pane open); `__controls-filters` gets `flex-wrap: wrap; min-width: 0`; `__search` is `flex: 1 1 12rem; min-width: 0` (was 260px basis / 200px min); AG viewports get `overscroll-behavior-x: contain`. One shared file serves all five grid hosts (project, user, organization, measure table, progress grid, and pm2 catalog through the same chrome).
- `src/components/settings/firma2-settings-table.css`: new shared `.firma2-settings-table-scroll` (`overflow-x: auto; overscroll-behavior-x: contain; -webkit-overflow-scrolling: touch; min-width: 0; max-width: 100%`), with a `bcn-lego-checked` note.
- Wrapped in that div: `firma2-settings-table.astro`, `firma2-organization-members.astro`, `firma2-review-queue.astro` (3 tables), `firma2-custom-fields-editor.astro` (now imports the shared CSS).

Why a wrapper div and not `display:block` on the table: that makes the table shrink-wrap and stops its columns filling the width.

### Not done / needs a real phone

- Other hand-rolled tables (vocabulary editor, tenant branding, project-source, work-area import, measure row tables, public project, etc.) were out of the ticket's list and are not wrapped; the same class can be applied.
- Momentum scroll feel and back-swipe containment on the grid and table wrappers need a real iPhone/Android.
- Leaflet: not changed; its tiles/SVG are clipped by the map box.
- Hub: `.esa-container { min-width: 320px }` is a floor that fights narrow panes; fine once ticket 01 widens the pane.

### Extension: every remaining hand-rolled table wrapped

Wrapped in `.firma2-settings-table-scroll` (shared CSS imported where missing), table semantics untouched, verified at 390 (pane 390px, ticket 01 landed): `pane+0` and the wrapper scrolls inside (scrollWidth > clientWidth where content is wider).

| Component | Verified route |
|---|---|
| settings/firma2-project-type-roster | /workspace-settings/project-types (400 in 358) |
| settings/firma2-vocabulary-editor | /workspace-settings/vocabulary |
| settings/firma2-project-source | /workspace-settings/project-source (473 in 358) |
| settings/firma2-organization-domains | /workspace-settings/organization-settings/access |
| settings/firma2-tenant-branding | /workspace-settings/branding |
| settings/firma2-settings-table (labels etc.) | /workspace-settings/labels |
| projects/firma2-work-area-import (2), firma2-work-area-upload | /projects/import-work-areas (tables hidden until a file is loaded) |
| projects/firma2-work-areas, firma2-project-actions | /projects/deer-creek-riparian-corridor-enhancement (310 in 308, 362 in 358) |
| map/firma2-portfolio-map (2) | /map (pane+2 = top bar) |
| public/firma2-public-project (3) | /public/deer-creek-riparian-corridor-enhancement (299/314 in 276) |
| gis wizard | /workspace-settings/gis-subscriptions/new: not wrapped (see below) |

Deliberately NOT wrapped (already scroll in a parent, and sticky columns depend on that parent being the scroller): `firma2-pm2-project-measures` (`__scroll`), `firma2-classification-measures` (`__scroller`), `firma2-project-measures` (`__scroller`), `firma2-gis-subscription-steps` (`__scroll`, overflow-y auto). `firma2-project-measures` placeholder `<table>` is a template holder, skipped. Not verified: /classifications/plan-goal is a 404 in dev, so firma2-classification-measures was left alone anyway.

Open: `/pm2/projects/deer-creek-...` reports pane+371 at 390 with the pm2 table inside its own `__scroll` (732 in 308); no visible element outside the scroller exceeds the pane, so this looks pre-existing and is not from the wrapper work. Needs a look.
