# 004 — Measure, then protect the frame budget of rail open/close

- **Commit:** e2b2986
- **Severity:** MEDIUM
- **Category:** Performance
- **Estimated scope:** measurement first; then 0–3 files, ~10 lines

## Problem

The three docked rails animate `flex-basis` over 200ms (`--transition-base`)
when they collapse or open. `flex-basis` is a layout property: every frame of
that 200ms re-lays out the neighbouring content — an AG Grid, a Leaflet map,
an AG Charts canvas. Both maps and the measure-history chart also listen with
a `ResizeObserver` and re-run work on each frame of the resize
(`map.invalidateSize()` forces a layout read and a tile pass; the chart
repaints its options). That is the profile that drops frames. It has not been
measured — this plan measures first and only changes code if frames drop.

The docked-rail design itself is settled (rails push content; they are not
overlays — see memory "Peek panels are not modal"). Do **not** switch the rails
to `transform`; that would turn them into overlays.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `src/components/shared/firma2-record-rail.astro` | 418–422 | `transition: flex-basis var(--transition-base, 200ms ease)` |
| `src/components/projects/firma2-project-peek.astro` | 336–340 | same |
| `src/components/shared/firma2-side-panel.astro` | 100–104 | same |
| `src/components/projects/firma2-project-map.astro` | 506–513 | rAF-coalesced `ResizeObserver` → `map.invalidateSize()` |
| `src/lib/leaflet.ts` | 74–82 | same pattern for every other Leaflet map |
| `src/components/measures/firma2-measure-history.astro` | 272–281 | rAF-coalesced `ResizeObserver` → `paint()` (sets chart options) |

### Current code

```css
/* src/components/shared/firma2-record-rail.astro:418 */
transition: flex-basis var(--transition-base, 200ms ease);
}
.firma2-record-rail[data-resizing] {
  transition: none;
}
```

```ts
// src/components/measures/firma2-measure-history.astro:272
let lastWidth = 0;
let frame = 0;
new ResizeObserver(() => {
  const w = Math.round(slot.getBoundingClientRect().width);
  if (w === lastWidth || frame) return;
  lastWidth = w;
  frame = requestAnimationFrame(() => { frame = 0; paint(); });
}).observe(slot);
```

## Target

**Phase A — measure (required).** Record Chrome DevTools Performance traces
(CPU throttling 4×) of:

1. `/prototypes/projects/<any>` — collapse and re-open the record rail (map + chart beside it).
2. `/prototypes/projects` — open and close the peek beside the AG Grid.
3. `/prototypes/performance-measures/<any sum measure>` — collapse the rail with the history chart visible.

**Pass:** no frame during the 200ms transition exceeds 16.7ms, and the
Frames track shows no dropped or partially-presented frames. If every trace
passes, stop: mark this plan DONE with "measured, no change" and the trace
numbers in the README.

**Phase B — only for a trace that fails.** Attribute the long frames in the
Bottom-Up view, then apply only the matching fix:

- **Chart repaint dominates** → in `firma2-measure-history.astro`, switch the
  rAF coalescing to a trailing settle, so the chart repaints once after the
  width stops changing:

  ```ts
  let lastWidth = 0;
  let settle = 0;
  new ResizeObserver(() => {
    const w = Math.round(slot.getBoundingClientRect().width);
    if (w === lastWidth) return;
    lastWidth = w;
    window.clearTimeout(settle);
    settle = window.setTimeout(paint, 120);
  }).observe(slot);
  ```

  120ms: longer than the gap between resize frames, short enough that the
  repaint lands within a beat of the rail settling. The plan/reported tick is
  briefly mis-sized during the 200ms — acceptable; keep the comment above the
  observer and add one line saying why it settles instead of tracking.

- **`invalidateSize` dominates** → do **not** change it without a human
  decision. Not invalidating per frame leaves a grey band at the map edge
  during the transition. Record the trace numbers and raise it.

- **AG Grid layout dominates** → no code change in this plan. Record the
  numbers and raise the trade-off for a human: shorten the rail transition to
  `--transition-fast` (150ms) or accept the cost.

## Conventions to follow

- Every transition here uses `--transition-base` so `@esa/tokens` zeroes it under reduced motion; keep that.
- `[data-resizing]` (set by `bcn-edge-handle`) already turns the transition off during drags; do not touch it.

## Steps

1. Run Phase A; save the three traces' max frame time and dropped-frame count.
2. If all pass, update `plans/README.md` status to DONE (measured) with the numbers. Stop.
3. Otherwise apply only the Phase B branch that matches the attribution.
4. Re-record the failing trace and confirm it passes.

## Out of scope

- Changing `flex-basis` to `transform`, or making a rail overlay.
- `esa-sidebar-nav`'s own `width` transition (hub code; AppLayout already zeroes it during drags).
- Changing `--transition-base` (hub token).

## Verification

**Build**
- [ ] `npx astro check` passes (if Phase B ran).

**Behavior**
- [ ] Collapse and reopen each rail: content beside it settles to the correct size; the map shows no grey band after the transition ends; the history chart's ticks align to its bars after the transition ends.
- [ ] Drag the edge handle: the rail tracks the pointer with no ease (unchanged).

**Feel**
- [ ] Record the collapse at normal speed and scrub it: no hitches mid-transition.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

- Feel cannot be judged from code here; only the trace decides. The two human decisions (map invalidation, grid cost) are deliberately left open.
