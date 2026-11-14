# 05 — Hover gating sweep

Status: ready-for-human
Owns: every spoke file with a `:hover` rule (32 files, 54 rules — `command grep -rln ":hover" src`)
Spec: `../spec.md` finding #4

## Change

Wrap every `:hover` rule in `@media (hover: hover) and (pointer: fine) { … }`. Where a rule already sits in a `(hover: none)` block, leave it. Where `:hover` is combined with `:focus-visible` in one selector list, split: the focus half stays ungated. Keep Astro scoped-style semantics (a media block inside `<style>` keeps the scope). The one existing `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)` block is the pattern.

Touch users must keep press feedback: the hub owns `:active` on legos (hub gap); for spoke-owned controls that lose their only feedback, add an `:active` state with the same tokens the hover used.

## Verify

The audit script reports `hover=gated/total` from a stylesheet walk. Target: `gated === total` on every route. Run the full default route list at 390.

## Hub gaps

- 34 hub components have ungated `:hover` (0 gated). Lego request: gate hover in `esa-button`, `esa-sidebar-nav`, `esa-card`, … behind `(hover: hover) and (pointer: fine)` and add `:active` press feedback.

## Comments

Done. Every spoke-owned `:hover` rule is now inside `@media (hover: hover) and (pointer: fine)`.

Files (32): firma2-org-updates, firma2-tag-board, firma2-settings-link-list, firma2-intake-builder, firma2-settings-table.css, firma2-classification-roster, firma2-work-areas, firma2-project-map, firma2-project-peek, firma2-project-gallery, firma2-project-measures, firma2-recent-projects, firma2-my-projects-map, firma2-my-projects, firma2-project-peek-button.css, firma2-editable-field, bcn-side-sheet.ts (Lit), firma2-contact-card, bcn-edge-handle.ts (Lit), firma2-data-grid-chrome.css, firma2-pages-nav (Lit string), firma2-portfolio-map, firma2-classification-peek, firma2-goal-card, firma2-measure-board, firma2-schema-board, firma2-work-picker, firma2-measure-claim-help, pages/index, pages/design-system/index, and the esa-app-shell and esa-rich-text-editor doc pages.

Counts (audit at 390, hover=gated/total, includes hub and AG Grid sheets): before 0 of 15-25 per route; after 5-13 gated of 15-25. Every remaining ungated rule is hub or AG Grid (`.esa-button__native`, `.esa-app-shell__*`, `.esa-breadcrumbs__link`, `.esa-pill__remove`, `.esa-alert-box__dismiss`, `.esa-filter-clear-button`, `.ag-header-cell`, `.ag-chart-*`). Spoke-owned ungated: 0 (probe on 5 routes, including shadow roots). `gated === total` is therefore not reachable from the spoke; it needs the hub gap below.

Splits: mixed `:hover` + `:focus-visible`/`:focus-within`/`[data-selected]`/`[open]`/`[data-dragging]` lists keep the focus half ungated. The editable-field locked-state override keeps its hover selectors in a gated copy. firma2-pages-nav hid its row "..." unless hovered; that hide rule is now gated, so touch shows the "..." outright (like the other reveal-on-hover controls).

`:active` added (same tokens as the hover): settings-link-list row, work-areas result and tool, project-map leaflet-bar, my-projects and my-projects-map cards, recent-projects link, portfolio-map row and result, work-picker row, claim-help choice, bcn-side-sheet toggle, index proto-card, design-system ds-card.

Left as is: AppLayout.astro:698 (`matches(':hover')` in JS, not CSS) and two comments (user-grid, editable-field). user-grid uses AG's `.ag-row-hover` class, not `:hover`.

Hub gap unchanged: esa-button, esa-app-shell, esa-breadcrumbs, esa-pill, esa-alert-box, esa-filter-clear-button need the same gating.
