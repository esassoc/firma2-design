# Mobile foundation — responsive and native-feel pass

Status: ready-for-human
Date: 2026-10-21
Audit method: `mobile-native` skill (`.claude/skills/mobile-native/SKILL.md`) symptom table + a Playwright pass over 19 routes at 390×844 (touch) and 768×844 on the dev server. Results and screenshots live in the session scratchpad (`pw/results.json`, `pw/shots/`).

## What the audit found

Measured, not guessed. Every number below is from the browser pass.

| # | Symptom | Where | Evidence |
|---|---------|-------|----------|
| 1 | **Sidebar never leaves.** `esa-sidebar-nav` stays 280px wide at 390px and 768px. The content pane is 110px wide on a phone, 480px on a tablet. Every other mobile problem is downstream of this. | `src/layouts/AppLayout.astro` | `nav.width=280, paneW=110` on all 19 routes at 390 |
| 2 | **Top bar actions overflow the bar.** The actions cluster is pushed past the right edge; the "…" fold only takes the toolbar, not the actions. Crumbs overflow too (parent + current are kept but still wider than the trail). | `src/components/shared/firma2-top-bar.astro` | bar overflow 60–300px on intake-form, users, pm2, custom-fields, projects, measure record |
| 3 | **Inputs zoom the page on iOS.** Field value text is the `typography-body-md` composite → `--font-size-200` → 12.3px at 390, 13.9px at 768. iOS zooms any focused input under 16px. | hub token clamp, read inside `esa-text-field` / `esa-select` / `esa-textarea` shadow roots | `inputMinFont 12.276` at 390 |
| 4 | **Every `:hover` is ungated.** 54 hover rules in 32 spoke files, 0 inside `(hover: hover)`. Hub: 34 components, 0 gated. Tapped controls keep their hover state. | spoke components; hub (file a lego request) | stylesheet walk: `gated 0 / total 15–25` per page |
| 5 | **No native baseline.** Viewport meta lacks `viewport-fit=cover` / `interactive-widget`; no `theme-color`; no `-webkit-tap-highlight-color`, `text-size-adjust`, `touch-action: manipulation`, or `user-select: none` on controls; no `env(safe-area-inset-*)` anywhere. `overscroll-behavior` is set on the pane only. | `src/layouts/BaseLayout.astro`, `src/styles/theme-firma2.css` | grep: 0 hits for each |
| 6 | **Tables and filter clusters widen the pane.** AG Grid headers, `firma2-settings-table`, the custom-fields `<table>`, and `firma2-data-grid__controls-filters` extend past the pane, so the pane scrolls sideways instead of the table. | `src/components/**` | `pane+114…344` at 390; `pane+60…86` at 768 |
| 7 | **Tap targets under 44px.** 85–100% of tappables are under 44px (40px md controls, 32px compact bar buttons). | design decision, not a bug — see "Deliberately left" | `tapsUnder44` ≈ `taps` |

Already right (keep): the pane is the scroller (`overscroll-behavior` on it), `100dvh` not `100vh` everywhere except one docs page, `--firma2-fold` for fold-tall panels, the ≤40rem rule that drops the inset sheet and the utility bar, the ≤45rem rule that hides the edge handle, the top bar's 45rem toolbar fold and crumb trimming.

## Breakpoints (use these, nothing else)

| Token | Value | Meaning |
|-------|-------|---------|
| phone | `(max-width: 45rem)` (720px) | nav is a drawer; one column; actions fold; sheet already edge-to-edge (40rem rule stays as is) |
| tablet | `(max-width: 64rem)` (1024px) | nav defaults to the 72px collapsed strip |
| touch | `(pointer: coarse)` | 16px field text, press feedback, no hover |
| mouse | `(hover: hover) and (pointer: fine)` | the only place a `:hover` rule may live |

Capability queries over width wherever the symptom is about input, width queries only for layout.

## Work packages

One file-owner per package so they run in parallel. Each ticket is in `issues/`.

- **01 — App shell on phone and tablet** (`AppLayout.astro`, `firma2-rail.astro` thresholds)
- **02 — Top bar overflow** (`firma2-top-bar.astro`)
- **03 — Native baseline** (`BaseLayout.astro`, `theme-firma2.css`, `src/lib/scheme.ts`)
- **04 — Data surfaces scroll inside themselves** (tables, grids, filter clusters in `src/components/**`)
- **05 — Hover gating sweep** (32 component files; runs AFTER 01–04 land to avoid edit races)

## Rules for every package

- Lookup order from `CLAUDE.md`: Ecology lego → Beacon → `bcn-`. Media queries and token re-pins are not bespoke UI, but if the hook blocks an edit, write a real `bcn-lego-checked:` reason.
- Never edit anything under `node_modules/@esa` (hub). Gaps go in the ticket's "Hub gaps" section; the lead files `/request-lego`.
- Use `Edit`, never `Write`, on existing files. Sibling agents are editing other files in the same tree.
- Do not run `astro build` or start a second dev server. The dev server on **http://localhost:4330** hot-reloads.
- Verify with the audit script (path in each ticket). Report the before/after numbers for the metric the ticket names. "Looks fine in emulation" is not done; say which fixes still need a phone.
- Memory rules that bind: controls are md and 40px (`CONTROL_PINS`); the top bar is 48px with 32px compact buttons; every docked rail is `firma2-rail`; the pane scrolls, not the document; stickies use `--firma2-sticky-origin`; no new rail toggles outside the rail.
- Microcopy: any new string (a "Menu" label, an overflow menu name) follows `.claude/skills/microcopy/`.

## Deliberately left

- **40px controls on touch.** The md=40px rule is a standing decision. WCAG 2.5.8 needs 24px; Apple's 44pt is a recommendation. Flag to the user, do not change.
- **Body text under 16px at 390px.** The hub's `clamp()` floor. Re-pinning composites spoke-wide would hard-code sizes; only the field-value composite is re-pinned (ticket 03) because it causes a real defect (zoom).
- **Hub hover gating** and **esa-app-shell not driving `drawer`**: hub work. The spoke drives the drawer itself (ticket 01) until the hub does.

## Needs a real phone

Sticky hover, tap highlight, input zoom, safe-area insets, keyboard resize, and overscroll do not reproduce in emulation. After the packages land: `astro dev --host`, open by LAN IP on an iPhone and an Android, test with the keyboard open and once in landscape.

## Results (2026-10-21, after tickets 01–05 plus lead fixes)

Same 19 routes plus two records, 390×844 touch and 768×844, dev server.

| Metric | Before | After |
|--------|--------|-------|
| Nav width at 390 / pane width | 280 / 110 | drawer (48px toggle) / 390 |
| Nav width at 768 / pane width | 280 / 480 | 72 collapsed / 688 |
| Pane horizontal overflow | 0–344px | 0 on every route, both widths |
| Top bar overflow | 0–295px | 0 on every route, both widths |
| Smallest field font at 390 (touch) | 12.3px | 16px (0 fields under 16) |
| theme-color tags | 0 | 2, synced to the scheme toggle |
| Spoke `:hover` rules gated | 0 of 54 | 54 of 54 (remaining ungated are hub + AG Grid) |
| Home glyph x in drawer mode | 72 | 56 |

Lead fixes outside the tickets: `position: relative` on the shared table scroll wrapper and the PM2 scroll box (an absolutely positioned visually-hidden label escaped the clip and widened the pane); the hidden Tiptap toolbar pinned and capped before placement (`firma2-rich-text`); three `size="sm"` fields moved to md (project-type preview select, two map search fields, PM2 target field) per the md-only rule, which is also what removed the last sub-16px inputs.

Open decisions for the user: drawer scrim (theme backdrop is transparent), restyled drawer Close button (Ecology deviation), body-md text lifted to 16px on touch, 40px targets on touch. Hub gaps are listed per ticket.
