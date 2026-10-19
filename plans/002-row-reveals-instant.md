# 002 — Make row hover-reveals instant

- **Commit:** e2b2986
- **Severity:** MEDIUM
- **Category:** Purpose & frequency
- **Estimated scope:** 9 files, ~45 lines removed

## Problem

Tables and boards across the spoke hide their row affordances — the "…" menu,
the peek button, the drag grip, Record / Clear target, the field's open icon,
the gallery's expand button — until the row is hovered or focused, then fade
them in over 120ms (gallery: 200ms). Moving the pointer down a table fades one
row's icon in while the previous fades out, so the reveal trails the cursor;
and the `:focus-within` path animates on every Tab press. A hover reveal on a
row hit dozens of times a day should be instant, and keyboard-driven changes
never animate.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `src/components/settings/firma2-settings-table.css` | 77–95 | "…" reveal + reduced-motion block |
| `src/components/projects/firma2-project-grid.astro` | 259–281 | Grid peek reveal + reduced-motion block |
| `src/components/projects/firma2-project-peek-button.css` | 24–44 | Peek button reveal + reduced-motion block |
| `src/components/settings/firma2-tag-board.astro` | 209–236 | Grip / remove reveal + reduced-motion block |
| `src/components/settings/firma2-user-grid.astro` | 597–619 | "…" reveal + reduced-motion block |
| `src/components/measures/firma2-schema-board.astro` | 205–232 | Grip / "…" reveal + reduced-motion block |
| `src/components/projects/firma2-project-measures.astro` | 646–665+ | Record / Clear target reveal (check for a reduced-motion block below line 665) |
| `src/components/shared/firma2-editable-field.astro` | 726–760 | Open-icon reveal + reduced-motion block |
| `src/components/projects/firma2-project-gallery.astro` | 273–279 | Expand button reveal (uses `--transition-base`, no reduced-motion block) |

### Current code (the pattern, repeated in every file)

```css
/* src/components/settings/firma2-settings-table.css:77 */
.firma2-settings-table__menu {
  opacity: 0;
  transition: opacity 120ms ease;
}
/* …hover / focus-within / [open] rule sets opacity: 1… */
@media (hover: none) {
  .firma2-settings-table__menu {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .firma2-settings-table__menu {
    transition: none;
  }
}
```

```css
/* src/components/projects/firma2-project-gallery.astro:273 */
.firma2-project-gallery__frame :global(.firma2-project-gallery__expand) {
  position: absolute;
  inset-block-start: var(--spacing-200, 0.5rem);
  inset-inline-end: var(--spacing-200, 0.5rem);
  opacity: 0;
  transition: opacity var(--transition-base, 0.2s ease);
}
```

## Target

In each file: the `opacity: 0` resting rule stays, the hover/focus rule that
sets `opacity: 1` stays, the `@media (hover: none)` block stays — and the
`transition: opacity …` line is deleted. The `@media (prefers-reduced-motion:
reduce)` block whose only job was `transition: none` on that same selector is
now dead and is deleted too.

```css
/* src/components/settings/firma2-settings-table.css — after */
.firma2-settings-table__menu {
  opacity: 0;
}
.firma2-settings-table tbody tr:hover .firma2-settings-table__menu,
.firma2-settings-table tbody tr:focus-within .firma2-settings-table__menu,
.firma2-settings-table__menu[open] {
  opacity: 1;
}
@media (hover: none) {
  .firma2-settings-table__menu {
    opacity: 1;
  }
}
```

**Why:** an instant reveal is the correct answer for a high-frequency,
cursor-tracking affordance (Audit §1). Opacity-not-display stays, because that
choice is about tab order and no-reflow, not motion.

## Conventions to follow

- Each file's comment above the reveal explains *why opacity, not display*. Keep it. If a comment mentions the fade, trim only that phrase.
- `firma2-schema-board.astro` and `firma2-tag-board.astro` deliberately share one rule ("the firma2-tag-board rule"); keep them identical after the change.

## Steps

1. For each file in the table, in order: delete the `transition: opacity …;` declaration on the reveal selector.
2. In the same file, find the `@media (prefers-reduced-motion: reduce)` block that sets `transition: none` on that same selector. If that is the block's only rule, delete the whole block; if it contains other rules, delete only that rule.
3. In `firma2-project-measures.astro`, read below line 665 to find its reduced-motion block (if any) and apply step 2.
4. In `firma2-project-gallery.astro`, delete only the `transition:` line (no reduced-motion block exists).
5. Grep afterwards: `grep -n "transition: opacity 120ms" src/components` should return nothing from these nine files.

## Out of scope

- `firma2-editable-field.astro:637` — the field's `border-color 120ms ease` hover. It is a colour change on the control under the pointer, within the 100–150ms hover budget. Leave it.
- `firma2-my-projects.astro:347` and `firma2-my-projects-map.astro:551` — card border hover. Leave them.
- Any `esa-*` lego in `node_modules/@esa/ecology` (hub code; spoke sessions must not edit it).
- Do not change opacity values, selectors, or the `(hover: none)` blocks.

## Verification

**Build**
- [ ] `npx astro check` passes.

**Behavior**
- [ ] `/prototypes/projects` (AG Grid): move the pointer down the rows — the peek button appears on the hovered row in the same frame and vanishes from the previous one.
- [ ] Workspace settings tables, Tags board, Members grid, a measure's schema board, a project's Measures table, an editable linked field, a project gallery: same check on each.
- [ ] Tab into a row: its affordances appear instantly.
- [ ] Emulate `hover: none` (DevTools → Rendering → or a touch device): all affordances visible at rest.

**Feel**
- [ ] Record a fast sweep down the project grid and scrub it: no half-opacity frames.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

- If an instant reveal reads as flicker on a fast sweep in practice, the alternative is asymmetric: instant in, `opacity var(--transition-fast)` out. That is a human call after seeing it; do not ship it without one.
