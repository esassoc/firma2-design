# 001 — Make the connections-graph highlight instant

- **Commit:** e2b2986
- **Severity:** HIGH
- **Category:** Purpose & frequency
- **Estimated scope:** 2 files, ~25 lines

## Problem

Hovering or Tab-focusing a node in `bcn-entity-graph` lights that node and its
neighbours and dims everything else. Every one of those changes fades over
150ms (`--transition-fast`). A highlight that tracks the cursor, or keyboard
focus, must be instant: a fade trails one step behind the pointer, and
keyboard-initiated changes never animate. On top of that, moving the pointer
from node A across empty space to node B clears the highlight and re-applies
it, so the whole graph flashes bright and dim between nodes.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `src/components/shared/bcn-entity-graph.css` | 24–29 | Link opacity + stroke transition |
| `src/components/shared/bcn-entity-graph.css` | 36–40 | Node opacity transition |
| `src/components/shared/bcn-entity-graph.css` | 70–81 | Label opacity transition |
| `src/components/shared/bcn-entity-graph.ts` | 402–409 | Pointer / focus handlers that drive `highlight()` |

### Current code

```css
/* src/components/shared/bcn-entity-graph.css:24 */
.bcn-entity-graph__link {
  stroke: var(--color-border-default, #bbb);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  transition: opacity var(--transition-fast, 150ms ease), stroke var(--transition-fast, 150ms ease);
}

/* :36 */
.bcn-entity-graph__node {
  --_kind: var(--color-background-dataviz-categorical-8, #167a7a);
  cursor: pointer;
  transition: opacity var(--transition-fast, 150ms ease);
}

/* :70 — inside .bcn-entity-graph__label { … } */
  opacity: 0;
  transition: opacity var(--transition-fast, 150ms ease);
```

```ts
// src/components/shared/bcn-entity-graph.ts:402
svg.addEventListener('pointerover', (e) => {
  if (!this.dragging) this.highlight(nodeOf(e.target)?.id ?? null);
});
svg.addEventListener('pointerleave', () => {
  if (!this.dragging) this.highlight(null);
});
svg.addEventListener('focusin', (e) => this.highlight(nodeOf(e.target)?.id ?? null));
svg.addEventListener('focusout', () => this.highlight(null));
```

## Target

CSS:

```css
.bcn-entity-graph__link {
  stroke: var(--color-border-default, #bbb);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  /* no transition */
}

.bcn-entity-graph__node {
  --_kind: var(--color-background-dataviz-categorical-8, #167a7a);
  cursor: pointer;
  /* no transition */
}

/* .bcn-entity-graph__label keeps `opacity: 0` and loses its transition line. */

/* New rule, placed directly after the "Who is named" block (after line 93):
   labels fade in only when zoom crosses LABEL_ZOOM — a rare, continuous
   gesture where a pop would be jarring. Zooming back out snaps them away. */
.bcn-entity-graph__svg[data-zoomed] .bcn-entity-graph__label {
  transition: opacity var(--transition-fast, 150ms ease);
}
```

TS (replace the four listeners above):

```ts
// Clearing waits a beat, so crossing the gap between two nodes does not
// flash the whole graph; lighting a node is immediate and cancels it.
let clearTimer = 0;
const clearSoon = () => {
  window.clearTimeout(clearTimer);
  clearTimer = window.setTimeout(() => this.highlight(null), 80);
};
svg.addEventListener('pointerover', (e) => {
  if (this.dragging) return;
  const node = nodeOf(e.target);
  if (node) {
    window.clearTimeout(clearTimer);
    this.highlight(node.id);
  } else clearSoon();
});
svg.addEventListener('pointerleave', () => {
  if (this.dragging) return;
  window.clearTimeout(clearTimer);
  this.highlight(null);
});
svg.addEventListener('focusin', (e) => this.highlight(nodeOf(e.target)?.id ?? null));
svg.addEventListener('focusout', () => this.highlight(null));
```

**Why these values:**
- No transition on node/link/label-lit changes: cursor- and keyboard-driven highlights must be instant (Audit §1).
- The zoom-only label fade uses `--transition-fast` (150ms `ease`): opacity changes take `ease`, 150ms is inside the hover/fade budget, and the token is zeroed under `prefers-reduced-motion` by `@esa/tokens`, so no media query is needed. Because the transition only exists while `[data-zoomed]` is set, it fades in and snaps out — exits simpler than entries.
- 80ms clear delay: long enough to cover a pointer crossing the gap between adjacent nodes, short enough that leaving a node for empty space still reads as immediate. It is a debounce, not an animation — nothing visually tweens.

## Conventions to follow

- Motion tokens come from `@esa/tokens` (`--transition-fast`, `--transition-base`); they zero out under reduced motion at the token layer. Use the token, never a raw duration, for any transition you keep.
- Comments in this file are explanatory prose in the house voice (see the existing block comments); keep the one-line comment above `clearSoon`.
- `src/components/shared/bcn-sortable-list.ts` is the exemplar for "motion only where the pointer isn't driving it".

## Steps

1. In `bcn-entity-graph.css`, delete the `transition:` line from `.bcn-entity-graph__link`.
2. Delete the `transition:` line from `.bcn-entity-graph__node`.
3. Delete the `transition:` line from `.bcn-entity-graph__label` (keep `opacity: 0`).
4. Add the `[data-zoomed]` label rule shown above directly after the selector block ending at line 93.
5. In `bcn-entity-graph.ts`, replace the four listeners at lines 402–409 with the Target block.
6. Update the module header's "LABELS." paragraph only if it now misdescribes behaviour (it does not mention fades today, so likely no change).

## Out of scope

- The drag, zoom, and simulation code (plan 008 covers those).
- The `:focus-visible` disc ring styling.
- Any other component's transitions, even ones that look similar (plan 002 covers row reveals).
- Do not introduce a new animation library.

## Verification

**Build**
- [ ] `npx astro check` passes.

**Behavior**
- [ ] Open `/prototypes/projects/<any project>` and find the Connections rail. Hover a node: neighbours light and the rest dims in the same frame.
- [ ] Sweep the pointer from node to node across gaps: no full-graph flash between nodes.
- [ ] Move the pointer off the graph: highlight clears immediately.
- [ ] Tab through nodes: each focus change is instant.
- [ ] Ctrl/⌘+wheel zoom past 1.6×: labels fade in over 150ms. Zoom back out: they disappear instantly.
- [ ] With `prefers-reduced-motion: reduce` emulated, the zoom-label fade is instant too.

**Feel**
- [ ] Record a screen capture of a fast sweep across the graph and scrub it frame by frame. The lit set should change on the frame the pointer enters a node, never a frame later.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

- Whether 80ms is the right clear delay depends on the graph's density; if a fast sweep still flashes, try 120ms. Do not go past 150ms — beyond that, leaving a node feels sticky.
