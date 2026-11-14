# 03 — Native-feel baseline

Status: ready-for-human
Owns: `src/layouts/BaseLayout.astro`, `src/styles/theme-firma2.css`, `src/lib/scheme.ts`
Spec: `../spec.md` findings #3 and #5. Apply the `mobile-native` skill at `.claude/skills/mobile-native/SKILL.md` — read it first.

## Changes (each one line, each with its reason from the skill)

1. **Viewport meta** (`BaseLayout.astro` line ~72): `width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content`. Never `maximum-scale` / `user-scalable=no`.
2. **theme-color per scheme**: two `<meta name="theme-color" media="(prefers-color-scheme: …)">` tags. The value is the colour at the very top of the page = the app frame background (light: the rail's sunken surface token; dark: `#0d0e0c`, see `--firma2-frame*` in AppLayout / theme-firma2.css — read the actual values, do not guess). Because the app also switches scheme by `html[data-scheme]`, `applyScheme()` in `src/lib/scheme.ts` must update the active theme-color content on toggle. `<meta name="color-scheme" content="light dark">` already exists as CSS; add the meta if absent.
3. **Global html rules** in `theme-firma2.css` (or the `is:global` block in BaseLayout, whichever already holds html-level rules — pick one, do not add a third place):
   - `-webkit-tap-highlight-color: transparent;`
   - `-webkit-text-size-adjust: 100%; text-size-adjust: 100%;`
   - `overscroll-behavior: none;` on `html, body` — correct here because the pane is the scroller, not the document (memory `inset-sheet-layout`). Keep the pane's existing `overscroll-behavior` as is.
4. **Controls**: `button, a, [role="button"] { touch-action: manipulation; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }`. Light-DOM only (esa-button renders in light DOM; Lit legos' inner buttons are in shadow roots and are a hub gap — list them). Never on body or on content text.
5. **Press feedback**: a `:active` transform/background on `.esa-button__native` is a hub concern; do NOT add one in the spoke. List as hub gap.
6. **16px field text on touch** (finding #3): the field value inside `esa-text-field`, `esa-select`, `esa-textarea` is the `typography-${FIELD_TYPE[size]}` composite (check `FIELD_TYPE` / `VALUE_TYPE` in each lego for md) and resolves to `--font-size-200` = 12.3px at 390. Re-pin the composite's font-size custom property at `:root` under `@media (pointer: coarse)` to `max(1rem, <current var>)` in `theme-firma2.css`. This is a token re-pin, not a hard-coded size; it will also lift any light-DOM text using the same composite on touch devices — note which composites that affects. Do not touch `CONTROL_PINS` unless the token route cannot reach the shadow root (prove it with a computed-style read before choosing that route).
7. **Safe areas**: `env(safe-area-inset-top, 0px)` on the top bar's padding-top only in phone layout (≤45rem; coordinate by reading how ticket 01 positions the bar — if 01 has not landed, add it in `firma2-top-bar.astro`'s existing 45rem block only if that file is not being edited by ticket 02 — otherwise leave a note in this ticket's Comments for the lead to place it). `env(safe-area-inset-bottom, 0px)` on `esa-dialog`/`esa-side-dialog`/`bcn-side-sheet` bottoms is deferred to a follow-up; list it.
8. **Hover sweep is NOT this ticket** (ticket 05).

## Verify

```
cd /private/tmp/claude-501/-Users-mauricio-Documents-GitHub-firma2-design/e6d75c19-5384-48d9-bacc-9cf45a8116ee/scratchpad/pw
WIDTHS=390 ROUTES=/prototypes/settings/profile,/prototypes/workspace-settings/general,/prototypes/projects/new OUT=./shots-03 node audit.mjs
```

Before: `inputMinFont 12.276`, `theme-color tags: 0`, meta without viewport-fit. After: `inputMinFont ≥ 16` at 390 with touch, 2 theme-color tags, meta string as in change 1. Also assert with a small Playwright eval that `getComputedStyle(document.documentElement).webkitTapHighlightColor` is transparent and that a light-DOM `.esa-button__native` has `touch-action: manipulation`.

Say explicitly which of 1–7 need a real phone to confirm (the skill's rule 5).

## Comments

Verified at 390x844 touch with the ticket command plus `scratchpad/pw/probe03.mjs`.

**Before / after**
- `inputMinFont` 12.276 -> 16 (inputs under 16: 0 on all 3 routes). Theme-color tags 0 -> 2. Viewport meta now `width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content`.
- Probe: html `-webkit-tap-highlight-color` rgba(0,0,0,0); `.esa-button__native` `touch-action: manipulation`, `user-select: none`; html `overscroll-behavior: none`.
- Theme-color after `applyScheme`: dark -> both tags `#0d0e0c`; light -> both `#eff1ef`; system -> light tag `#eff1ef`, dark tag `#0d0e0c`.

**Files**
- `src/layouts/BaseLayout.astro`: viewport meta; two theme-color tags (`#eff1ef` = olive-3, the light `--color-background-elevation-sunken`; `#0d0e0c` = dark `--firma2-neutral-0`) plus `color-scheme` meta; head script pins the tags when the stored preference is explicit light/dark; global block gains the html rules (tap highlight, text-size-adjust, overscroll), the button/a/[role=button] control rule, and the `@media (pointer: coarse)` re-pin. All html-level rules live in BaseLayout's global block because `theme-firma2.css` is generated by `theme:make` and a hand edit would be overwritten (its own header says so).
- `src/lib/scheme.ts`: `syncThemeColor()` called from `applyScheme()`.

**Touch re-pin** is on `html[data-theme]` (outranks the hub's `:root`) and re-points only `--typography-body-md-font-size` and `--typography-microcopy-md-subtle-font-size` to `max(1rem, var(--font-size-200))`. Token route reached the shadow roots; `CONTROL_PINS` untouched. Side effects on touch devices: every `.typography-body-md` (textarea value, radio/checkbox item labels, general body-md copy) and every `.typography-microcopy-md-subtle` (text-field and select values, esa-select trigger) goes from ~12.3px to 16px. Not touched: label-md, microcopy-md, code-md, which also resolve to --font-size-200.

**Change 7 (not done, for the lead)**: `padding-top: env(safe-area-inset-top, 0px)` on `.firma2-top-bar` inside its phone block (<=45rem) lives in `firma2-top-bar.astro`, which ticket 02 owns. `viewport-fit=cover` is now on, so the inset becomes non-zero on notched phones and the bar will sit under the notch until placed. Bar is 48px tall, so grow its height by the same inset. Deferred follow-up: `env(safe-area-inset-bottom)` on esa-dialog / esa-side-dialog / bcn-side-sheet bottoms, and the utility bar / frame foot.

**Needs a real phone**: all of 1-7. Specifically: input zoom gone on focus (iOS), theme-color status bar in both schemes and after a manual toggle, tap highlight gone, no long-press callout on buttons, overscroll/pull-to-refresh, `interactive-widget` keyboard resize (Android), safe-area insets. Computed styles are verified; behaviour is not.

**Hub gaps**
- Lit legos' inner buttons (esa-icon-button, esa-sidebar-nav items, esa-select/esa-dropdown-menu triggers, esa-tab-layout tabs, etc.) sit in shadow roots with no `touch-action: manipulation` / `user-select: none` / `-webkit-touch-callout: none`.
- No `:active` press feedback on `.esa-button__native` or the Lit controls (ticket change 5).
- Hub text-size-adjust / tap-highlight could live in `@esa/tokens` base so every spoke gets them.
