# 003 — Honour reduced motion in scripted smooth scrolls

- **Commit:** e2b2986
- **Severity:** LOW
- **Category:** Accessibility
- **Estimated scope:** 3 files, 3 lines

## Problem

Three click handlers call `scrollIntoView({ behavior: 'smooth' })`
unconditionally. The spoke's reduced-motion strategy lives in the token layer
(`@esa/tokens` zeroes the transition tokens), but scripted scrolling never
reads a token, so a reader who has asked for less motion still gets an
animated page scroll. Smooth scroll must be gated on the preference.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `src/components/projects/firma2-work-areas.astro` | 660–663 | Edit button scrolls the map canvas into view |
| `src/components/projects/firma2-my-projects-map.astro` | 769–772 | Map click scrolls the project card into view |
| `src/components/pm2/firma2-pm2-setup.astro` | 414 | Alert scrolls the setup root into view |

### Current code

```ts
// src/components/projects/firma2-work-areas.astro:662
canvas.scrollIntoView({ behavior: 'smooth', block: 'center' });

// src/components/projects/firma2-my-projects-map.astro:771
cell.scrollIntoView({ behavior: 'smooth', block: 'center' });

// src/components/pm2/firma2-pm2-setup.astro:414
if (kind) root.scrollIntoView({ block: 'start', behavior: 'smooth' });
```

## Target

```ts
canvas.scrollIntoView({
  behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  block: 'center',
});
```

Same expression in the other two calls; keep each call's existing `block`.

**Why:** under `reduce`, the scroll still happens (the meaning survives) but
jumps instead of tweening — gentler, not removed.

## Conventions to follow

- The repo reads the query inline where it needs it — see `const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;` in `src/components/shared/bcn-sortable-list.ts:128` and `bcn-entity-graph.ts:124`. If a file needs it more than once, define the same `reducedMotion` arrow at the top of that script; otherwise inline it.
- `src/components/projects/firma2-project-measures.astro:933` documents a deliberate *no*-smooth scroll; do not touch it.

## Steps

1. Replace the `behavior` value in each of the three calls with the ternary above.
2. Read each query at call time (inside the handler), not once at module load, so a preference changed mid-session is honoured.

## Out of scope

- `firma2-project-measures.astro:1351` and `firma2-measure-editor.astro:754` — already non-smooth.
- Any CSS `scroll-behavior` (none exists in the spoke).

## Verification

**Build**
- [ ] `npx astro check` passes.

**Behavior**
- [ ] `/prototypes/my-projects` (map view): click a project on the map — the card list smooth-scrolls to its card.
- [ ] Emulate `prefers-reduced-motion: reduce` in DevTools → Rendering and repeat: the list jumps straight to the card.
- [ ] Same pair of checks for a work area's Edit button and a PM2 setup alert.

**Feel**
- [ ] With reduce emulated, nothing on the page tweens on these clicks.
