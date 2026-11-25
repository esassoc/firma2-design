# 008 — Graph: shorter settle after a drag, exact zoom steps

- **Commit:** e2b2986
- **Severity:** LOW
- **Category:** Interruptibility & springs
- **Estimated scope:** 1 file, ~20 lines

## Problem

Two things in `bcn-entity-graph.ts`:

1. **Long settle tail.** After a drag, `alphaTarget(0)` lets the simulation cool
   at d3's default `alphaDecay` (0.0228). From alpha 0.3 to `alphaMin` (0.001)
   that is about 250 ticks — roughly 4 seconds of neighbours drifting after the
   reader let go. A response to a gesture should settle in about a second.
2. **Zoom steps that probably undershoot (unverified).** `zoomIn()`/`zoomOut()`
   call `scaleBy` on a 200ms transition. d3 computes `scaleBy` from the
   transform at the moment the transition starts, which after an interrupt is
   the mid-flight value — so three quick clicks may land short of 1.5³.
   This is inferred from d3's behaviour, not observed; verify before fixing.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `src/components/shared/bcn-entity-graph.ts` | 418–445 | d3-drag start / drag / end |
| `src/components/shared/bcn-entity-graph.ts` | 158–181 | `zoomIn` / `zoomOut` / `fit` / `target()` |
| `src/components/shared/bcn-entity-graph.ts` | 462–466 | `.on('zoom', …)` handler |

### Current code

```ts
// :420
.on('start', (event, d) => {
  this.dragging = true;
  svg.dataset.dragging = '';
  this.highlight(d.id);
  if (!event.active && !reducedMotion()) sim.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
})
// :438
.on('end', (event, d) => {
  this.dragging = false;
  delete svg.dataset.dragging;
  if (!event.active) sim.alphaTarget(0);
  d.fx = null;
  d.fy = null;
});
```

```ts
// :158
zoomIn(): void {
  this.zoomTo((z) => z.scaleBy(this.target(), ZOOM_STEP));
}
zoomOut(): void {
  this.zoomTo((z) => z.scaleBy(this.target(), 1 / ZOOM_STEP));
}
```

## Target

**1. Settle (always apply):**

```ts
/** Cooling rate after a drag: alpha 0.3 → 0.001 in ~100 ticks (~1.7s at 60fps). */
const SETTLE_DECAY = 0.055;
```

In `start`, before `alphaTarget(0.3).restart()`: `sim.alphaDecay(1 - Math.pow(0.001, 1 / 300));` — d3's default (≈0.0228), restored explicitly so a drag that starts mid-settle heats normally.
In `end`, replace `sim.alphaTarget(0)` with `sim.alphaTarget(0).alphaDecay(SETTLE_DECAY)`.

`settle()` (the synchronous ticking before first paint, line 231) reads `sim.alphaDecay()`; confirm it runs before any drag so it still uses the default.

**2. Zoom target (only if verification shows undershoot):**

```ts
/** The scale the buttons are heading to, so quick clicks compound exactly. */
private zoomGoal = ZOOM_MIN;

zoomIn(): void {
  this.zoomGoal = Math.min(ZOOM_MAX, this.zoomGoal * ZOOM_STEP);
  this.zoomTo((z) => z.scaleTo(this.target(), this.zoomGoal));
}
zoomOut(): void {
  this.zoomGoal = Math.max(ZOOM_MIN, this.zoomGoal / ZOOM_STEP);
  this.zoomTo((z) => z.scaleTo(this.target(), this.zoomGoal));
}
fit(): void {
  this.zoomGoal = ZOOM_MIN;
  this.zoomTo((z) => z.transform(this.target(), zoomIdentity));
}
```

And keep the goal honest when the reader pinches or ctrl-wheels: in the
`.on('zoom', …)` handler, add `if (event.sourceEvent) this.zoomGoal = event.transform.k;`
(`sourceEvent` is null for programmatic transitions, set for user gestures —
add `sourceEvent: Event | null` to the handler's event type).

**Why these values:** 0.055 brings the post-drag drift to ~100 ticks (~1.7s
at 60fps), most of it visible only in the first ~0.5s because alpha decays
exponentially. The 200ms zoom transition and d3's default cubic in-out stay —
correct for an on-screen move and already interruptible.

## Conventions to follow

- Constants are top-level `const`s with a `/** … */` doc line (see `ZOOM_STEP`, `LABEL_ZOOM` near line 115). Put `SETTLE_DECAY` beside them.
- Reduced motion: the drag path skips the simulation entirely under `reduce`; keep that untouched.

## Steps

1. Add `SETTLE_DECAY` beside the other constants.
2. In drag `start`, call `sim.alphaDecay(1 - Math.pow(0.001, 1 / 300))` before reheating.
3. In drag `end`, chain `.alphaDecay(SETTLE_DECAY)` after `alphaTarget(0)`.
4. Verify the zoom undershoot (see Verification). Only if it reproduces, apply Target 2.

## Out of scope

- Plan 001's highlight changes (do them first or separately; they do not conflict).
- Force strengths, link distances, the deterministic layout.

## Verification

**Build**
- [ ] `npx astro check` passes.

**Behavior**
- [ ] Drag a node and release: neighbours visibly settle within about a second and are still within ~2s.
- [ ] Drag again during that settle: the graph reheats and follows normally.
- [ ] Zoom undershoot check (before Target 2): log `event.transform.k` in the zoom handler, triple-click zoom-in fast from the fitted view. If the final k is below 3.375 (1.5³), the bug is real.
- [ ] After Target 2: the same triple-click lands at exactly 3.375; ctrl-wheel to some k, then click zoom-in — it steps from the pinched k, not from a stale goal.
- [ ] Emulate reduced motion: zoom is instant; dragging moves only the dragged node.

**Feel**
- [ ] Record a drag-and-release and scrub it: the settle should start fast and come to rest gently, not drift.
- [ ] On a trackpad, test pinch then button zoom together.

## Notes

- Whether ~1.7s of settle reads as "alive" or still too long is a feel call; if it drags, try 0.08 (~70 ticks). Do not go higher than 0.1 — the neighbours stop looking pulled and start looking snapped.
