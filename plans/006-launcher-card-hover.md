# 006 — Fix the launcher card hover lift

- **Commit:** e2b2986
- **Severity:** LOW
- **Category:** Physicality & origin / Accessibility
- **Estimated scope:** 1 file, ~10 lines

## Problem

On the prototype launcher (`src/pages/index.astro`), the `.layer` card lifts
itself `translateY(-2px)` on hover. Lifting the hover target itself can loop at
its bottom edge: the card moves out from under the cursor, hover ends, it drops
back, hover starts again. The hover motion is also ungated — a tap on touch
triggers it — and has no reduced-motion variant. The arrow nudge
(`translateX(3px)`) has the same two gaps.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `src/pages/index.astro` | 118–129 | `.layer` transition + hover lift |
| `src/pages/index.astro` | 150–151 | Arrow nudge |

### Current code

```css
/* src/pages/index.astro:118 */
.layer {
  /* …layout… */
  transition: border-color 0.14s ease, box-shadow 0.14s ease, transform 0.14s ease;
}
.layer:hover {
  border-color: var(--color-border-brand, #cfe2ee);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--color-background-brand, #43608a) 12%, transparent);
  transform: translateY(-2px);
}
/* :150 */
.layer__go svg { transition: transform 0.14s ease; }
.layer:hover .layer__go svg { transform: translateX(3px); }
```

## Target

```css
.layer {
  /* …layout unchanged… */
  transition: border-color 0.14s ease, box-shadow 0.14s ease;
}
.layer:hover {
  border-color: var(--color-border-brand, #cfe2ee);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--color-background-brand, #43608a) 12%, transparent);
}

.layer__go svg { transition: transform 0.14s ease; }
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .layer:hover .layer__go svg { transform: translateX(3px); }
}
```

**Why these values:**
- Lift removed: the border + shadow already say "this card is the link"; the lift on the target is the flicker risk. Remedy #1 is delete.
- Arrow nudge kept (a child, so no flicker loop), 3px and 140ms `ease` unchanged — within the hover budget — but gated to fine pointers and to readers who have not asked for reduced motion.

## Conventions to follow

- This page uses raw seconds (`0.14s`) rather than tokens; keep its local style, do not tokenise in this plan.

## Steps

1. Remove `, transform 0.14s ease` from `.layer`'s transition.
2. Remove `transform: translateY(-2px);` from `.layer:hover`.
3. Wrap the `.layer:hover .layer__go svg` rule in the media query shown.

## Out of scope

- `.proto-card` hover (colour only — fine).
- `src/pages/design-system/index.astro` card hovers (colour/opacity only).
- Moving this page's `<style>` into a component.

## Verification

**Build**
- [ ] `npx astro check` passes.

**Behavior**
- [ ] `/` : hover a layer card — border and shadow change, the card does not move; the arrow nudges 3px right.
- [ ] Park the cursor on the card's bottom 2px: no flicker.
- [ ] Emulate reduced motion: arrow does not move; border and shadow still change.
- [ ] Device mode (touch): tapping a card does not nudge the arrow.

**Feel**
- [ ] Look at it again with fresh eyes — the shadow alone should still read as lift.
