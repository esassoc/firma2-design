# 005 — 44px touch targets for the peek button and graph nodes

- **Commit:** e2b2986
- **Severity:** MEDIUM
- **Category:** Accessibility
- **Estimated scope:** 2 files, ~15 lines

## Problem

Two interactive targets are smaller than 44×44px on touch devices. The peek
button is pinned to a 28px square, and on `hover: none` devices it is always
visible — so it is a primary touch target at 28px. Connections-graph nodes
have a hit circle of radius `max(12, r + 3)`, about 24px across. Both are hard
to tap accurately.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `src/components/projects/firma2-project-peek-button.css` | 14–20 | 28px pin on the native button |
| `src/components/shared/bcn-entity-graph.ts` | 312–314 | Hit circle radius |

### Current code

```css
/* src/components/projects/firma2-project-peek-button.css:14 */
/* Pinned to a 28px square so it sits inside a line of text or a table row
   without setting its height — the grid's measured pin. */
.firma2-peek-button .esa-button__native {
  block-size: 28px;
  inline-size: 28px;
  padding: 0;
}
```

```ts
// src/components/shared/bcn-entity-graph.ts:312
const hit = document.createElementNS(SVG, 'circle');
hit.setAttribute('class', 'bcn-entity-graph__hit');
hit.setAttribute('r', String(Math.max(12, node.r + 3)));
```

## Target

```css
/* Append after the 28px pin rule. The visible box stays 28px; on a coarse
   pointer an invisible hitbox reaches 44px without moving anything. */
@media (pointer: coarse) {
  .firma2-peek-button .esa-button__native {
    position: relative;
  }
  .firma2-peek-button .esa-button__native::before {
    content: '';
    position: absolute;
    inset: -8px;
  }
}
```

```ts
// Coarse pointers get a 44px hit circle; fine pointers keep the tight one so
// dense neighbourhoods stay precise.
const minHit = window.matchMedia('(pointer: coarse)').matches ? 22 : 12;
hit.setAttribute('r', String(Math.max(minHit, node.r + 3)));
```

**Why these values:** 28px + 8px × 2 = 44px. Radius 22 = 44px diameter. Gated
on `(pointer: coarse)` so mouse users keep precise, non-overlapping targets.

## Conventions to follow

- `firma2-project-peek-button.css` already carries a `bcn-lego-checked:` header — no new token needed.
- Keep the existing comment on the 28px pin; add the one-line comment shown above the new block.

## Steps

1. Append the `@media (pointer: coarse)` block to `firma2-project-peek-button.css` after the 28px rule.
2. In `bcn-entity-graph.ts`, replace the `hit.setAttribute('r', …)` line with the two lines above (the comment goes above `minHit`).

## Out of scope

- `.firma2-grid-peek` in `firma2-project-grid.astro` and the various row "…" menus — they may also be under 44px; measure them in a follow-up rather than guessing here.
- Changing any visible size.

## Verification

**Build**
- [ ] `npx astro check` passes.

**Behavior**
- [ ] DevTools device mode (touch, coarse pointer) on `/prototypes/projects`: the peek button's hit area measures 44×44 (inspect the `::before` box); the row height is unchanged.
- [ ] Connections graph in device mode: tapping just outside a disc still selects the node.
- [ ] Desktop mouse: graph hit areas unchanged; adjacent nodes still individually hoverable.

**Feel**
- [ ] On a real phone or tablet, tap the peek button and five graph nodes: no misses, no wrong-node taps.

## Notes

- In a very dense graph, 22px hit circles can overlap; the later-drawn node wins the tap. If that causes wrong-node taps on device, it is a human call whether to shrink to 18 or accept it (the "View as list" alternative already exists).
