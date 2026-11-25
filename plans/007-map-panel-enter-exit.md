# 007 — Map panel: decelerate in, shorter out

- **Commit:** e2b2986
- **Severity:** LOW
- **Category:** Easing & duration
- **Estimated scope:** 1 file, ~6 lines

## Problem

`firma2-map-panel` fades and slides 1rem toward its own edge when collapsed,
and back when restored. Both directions use `--transition-base` — 200ms on the
built-in `ease`. An element entering the screen should decelerate (`ease-out`),
and an exit should be shorter than the entry: the reader has already decided
to dismiss it.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `src/components/shared/firma2-map-panel.astro` | 193–196 | Resting (shown) transition — this is what plays on *return* |
| `src/components/shared/firma2-map-panel.astro` | 233–246 | Collapsed transition — this is what plays on *exit* |

### Current code

```css
/* src/components/shared/firma2-map-panel.astro:193 — on .firma2-map-panel */
transition:
  opacity var(--transition-base, 200ms ease),
  translate var(--transition-base, 200ms ease),
  visibility 0s;
}

/* :233 */
.firma2-map-panel[data-collapsed] {
  opacity: 0;
  visibility: hidden;
  transition:
    opacity var(--transition-base, 200ms ease),
    translate var(--transition-base, 200ms ease),
    /* …long comment… */
    visibility 0s var(--transition-base, 200ms ease);
}
```

## Target

```css
/* on .firma2-map-panel (return) */
transition:
  opacity var(--transition-base, 200ms ease),
  translate var(--transition-base, 200ms ease),
  visibility 0s;
transition-timing-function: var(--easing-enter, ease-out);

/* .firma2-map-panel[data-collapsed] (exit) */
transition:
  opacity var(--transition-fast, 150ms ease),
  translate var(--transition-fast, 150ms ease),
  /* …keep the existing comment, updated to name --transition-fast… */
  visibility 0s var(--transition-fast, 150ms ease);
transition-timing-function: var(--easing-enter, ease-out);
```

**Why these values:**
- Durations stay on the tier-2 tokens (`--transition-base` 200ms in, `--transition-fast` 150ms out) because those are the ones `@esa/tokens` zeroes under reduced motion. The tier-1 `--duration-*` tokens are *not* zeroed, so do not use them here.
- `transition-timing-function` after the shorthand overrides only the curve, keeping the reduced-motion-safe durations. `--easing-enter` is `ease-out` — the right curve for both arriving and leaving the screen.
- Do **not** use `--easing-exit`: it is `ease-in`, which delays the moment the reader is watching.
- The `visibility` delay must name the same token as the exit duration (`--transition-fast`) so the flip lands exactly when the fade ends — the existing comment explains why.

## Conventions to follow

- The file's comments explain every motion choice; update the collapsed-state comment so it names `--transition-fast` and says the exit is shorter on purpose.

## Steps

1. Add `transition-timing-function: var(--easing-enter, ease-out);` after the resting `transition` shorthand (line 196).
2. In `[data-collapsed]`, replace all three `--transition-base, 200ms ease` with `--transition-fast, 150ms ease`, and add the same `transition-timing-function` line after the shorthand.
3. Update the comment inside the collapsed transition to match.

## Out of scope

- `firma2-project-map.astro:782` — the map plates' `inset-inline-start` travel (absolutely positioned; exempt) stays on `--transition-base`.
- `firma2-project-atlas.astro` panel width variables.

## Verification

**Build**
- [ ] `npx astro check` passes.

**Behavior**
- [ ] On a project record's map/atlas view, hide the record chrome: the panel fades and slides 1rem toward its edge in 150ms; it is not clickable afterwards.
- [ ] Restore it: it slides back in 200ms, fast at the start and settling at the end.
- [ ] Toggle rapidly: the panel reverses from wherever it is (transitions retarget).
- [ ] Emulate reduced motion: both directions are instant, and the panel never swallows clicks while invisible.

**Feel**
- [ ] Record the exit together with the plates travelling to the edge (they stay 200ms). Scrub it: the panel should be gone just before the plates land. If it reads as two disconnected events rather than one hand-off, that is a human call — the fallback is leaving the exit at 200ms and keeping only the curve change.
