# 02 — Top bar overflow at narrow widths

Status: ready-for-human
Owns: `src/components/shared/firma2-top-bar.astro`
Spec: `../spec.md` finding #2

## Problem

At ≤768px the `.firma2-top-bar__actions` cluster overflows the bar by 36–300px (intake-form 174px at 390; pm2 265px at 390, 86px at 768; projects 60px at 768). The existing `(max-width: 45rem)` rule folds only the toolbar into the "…" `esa-dropdown-menu` and trims crumbs to parent + current, but the crumbs still overflow (`li.esa-breadcrumbs__item` measured 156px wide starting at x=352 in a 390px viewport) and actions never fold.

## Target

- The bar never scrolls or clips its own controls: `bar.scrollWidth === bar.clientWidth` at 390 and 768 on every route.
- **Crumbs:** the trail is `min-width: 0` and the current crumb ellipsises. At ≤45rem show only the parent as a back link (its label ellipsised) and the current crumb; the home glyph stays. If the parent alone does not fit, drop it and keep current.
- **Actions at ≤45rem:** the primary action stays visible as an icon-only or short-label 32px button (keep md size, compact pin, see `thin-top-bar` memory). Secondary actions join the existing "…" fold menu (same `esa-dropdown-menu`, after the toolbar items). Status badges stay; if status + primary + "…" do not fit, the status badge shows its dot/short form only.
- **Actions at ≤64rem:** secondary actions with long labels fold; the primary keeps its label.
- Do not add a new slot or a panel toggle (the top bar has no panel slot — standing rule). Keep the parse-time slot swap from `firma2-page-header` working.
- Any label you introduce goes through the microcopy skill.

## Verify

```
cd /private/tmp/claude-501/-Users-mauricio-Documents-GitHub-firma2-design/e6d75c19-5384-48d9-bacc-9cf45a8116ee/scratchpad/pw
WIDTHS=390,768 ROUTES=/prototypes/projects,/prototypes/workspace-settings/intake-form,/prototypes/workspace-settings/pm2,/prototypes/workspace-settings/users,/prototypes/performance-measures/acres-floodplain-habitat,/prototypes/projects/intake OUT=./shots-02 node audit.mjs
```

Note: ticket 01 is changing the shell concurrently; until it lands the pane at 390 is 110px wide, so measure the bar's own `overflow` number (reported as `bar={overflow}`) and the `WIDE` list for `firma2-top-bar` descendants, not the pane. The target is `bar.overflow 0` with the pane at ≥374px; if 01 has not landed, prove it at 768 and at 390 with the nav collapsed (`localStorage` key the shell uses, or set `collapsed` on the nav in the page before measuring).

## Hub gaps

- `esa-breadcrumbs` has no overflow strategy of its own (no ellipsis, no min-width:0).

## Comments

**2026-10-21 — implemented (agent, ticket 02).** Only `src/components/shared/firma2-top-bar.astro` changed.

### Before → after (`bar.scrollWidth − bar.clientWidth`, px)

Measured with ticket 01 landed (pane 390 wide at 390, nav collapsed to 72px at 768). "Before" is the same file before this ticket, with the nav forced out of the way so the pane was full width.

| Route | 390 before | 390 after | 768 before (nav open, pane 480) | 768 after |
|---|---|---|---|---|
| projects | 72 | 0 | 60 | 0 |
| workspace-settings/intake-form | 55 | 0 | 0 | 0 |
| workspace-settings/pm2 | 103 | 0 | 86 | 0 |
| workspace-settings/users | 0 (78 with nav) | 0 | 0 | 0 |
| workspace-settings/custom-fields | 0 (84 with nav) | 0 | 0 | 0 |
| performance-measures/acres-floodplain-habitat | 42 | 0 | 40 | 0 |
| projects/intake, projects/new | 37 | 0 | 36 | 0 |

Also checked: project record, measure draft, my-projects, updates — 0 at 390/768/1440. Every route: bar height 48, every bar button 32px tall, no `firma2-top-bar` descendant in the audit's WIDE list (the WIDE entries left are AG Grid and Leaflet, ticket 04). 1440: the bar looks the same as before on all 11 routes.

The "+15 to +29px at 390" the shell agent reported came from a run before these changes landed. The final audit run (`shots-02/`) and `bar02.mjs` (`shots-02-final/`) both show 0.

### What changed (firma2-top-bar.astro)

- **Markup (~97–110):** the "…" `esa-dropdown-menu` now renders whenever the bar has a toolbar **or** actions. It starts as `data-empty`, and the script clears that once something folds into it. The actions cluster gains `data-top-bar-actions`.
- **Script (`layout()`, ~147–420):** this replaces `collapseTrail` + `wireFold`. On each bar resize, breakpoint change, or `hidden`/`style` mutation in the actions, one pass starts from a clean slate and gives way in this order:
  1. long trail → middle collapses to "…" (wide only, as before);
  2. actions: the **primary** is the first `esa-button--variant-primary`, or else the last control, and it never folds. At ≤45rem every secondary folds. At ≤64rem secondaries fold longest label first, and only while the bar is short. Free text riding the actions (intake-form's "Published …") leaves the row. A page's own nested "…" menu (intake's More actions) folds too: its items join the bar's menu, and picking one replays `menu-action` on the page's menu;
  3. at ≤45rem the parent crumb drops if the trail still clips. Then on any short bar at ≤64rem the primary goes icon-only, but only if it has an icon. The label is clipped, not removed, so the accessible name stays (pm2 "New measure" at 390).
  - The fold is a **mirror**: choosing an item clicks the real control. Verified: pm2 → "View on a project" navigates, and record → "History" opens the sheet.
- **Toolbar fix (coordinator finding 2):** at ≤45rem the toolbar is no longer `display:none`. Each toolbar *button's box* folds (`data-top-bar-folded`), and the toolbar itself stays rendered as a zero-width, absolutely positioned box. Its `bcn-side-sheet` and snackbar keep their layout. The history sheet now opens at 390×796 (it was 0×0). Toolbar controls are found excluding anything inside `bcn-side-sheet`/dialogs/snackbar/menus.
- **CSS:**
  - `--_bleed` is read from `--firma2-sticky-origin`, so the bar follows ticket 01's 16px phone gutter. `--_bar-pad-x` = bleed.
  - Badge wrappers inside the status may shrink, so a wrapped badge ellipsizes instead of clipping.
  - `[data-top-bar-folded]` → `display:none !important`; `[data-top-bar-compact]` → 32px square.
  - **≤64rem:** the start slot takes the shrink first (`flex-shrink:1000`, floor = home + current-crumb floor). On a short bar the old proportional split pushed the buttons out while the trail still had slack. The empty `esa-app-bar__main` and an empty status no longer hold a gap open. Status notes stay on one line and ellipsize.
  - **≤45rem:** `padding-block-start: env(safe-area-inset-top)` plus the sheet background on the bar (coordinator finding 1). `publishHeight` measures the outer box, so `--firma2-band-height` and scroll-padding grow by the inset, and stickies stay aligned. Trail = home + parent (ellipsized, 4.5rem floor, dropped below that) + current (5rem floor). Status badge floor is 3.5rem ("3 un…"). Status notes are hidden; `aria-describedby` still reads them.

### Decisions to review

- At ≤64rem, folding is driven by measurement, not by a fixed label-length rule. At 768 with the nav collapsed, nothing needs to fold, so nothing does. Under artificial narrowing (bar 416 wide), pm2 folds "View on a project" and compacts "New measure".
- At 390, the measure record drops the parent crumb ("Performance measures") so that "Edit measure" can keep its label. The alternative is to keep the parent and compact the primary.
- `esa-button-toggle` (My Projects' variant switch) never folds, because a segmented switch has no menu form.
- Status "short form" is ellipsis, not `esa-badge dot`. Dot mode is server-rendered and has no runtime switch.
- No new strings. The fold keeps its "More actions" name, which now covers both the toolbar and the actions.

### For ticket 01 / the lead

- The drawer rule in AppLayout sets the bar's `padding-inline-start: calc(var(--firma2-pane-padding) + 32px + 8px)`. The bar's row already pads by the gutter (`--_bar-pad-x`), so the home glyph lands at x=72 instead of 56: the gutter is counted twice. `calc(32px + var(--spacing-200))` would fix it. That leaves 16px more for the trail at 390 and could keep pm2's "New measure" label.
- The 1px edge case: at ≤64rem on a bar narrowed to ~416px (only reachable with a pane-narrowing rail, which overlays at that width), intake can clip its trail by 1px.

### Needs a real phone

- The safe-area inset under a notch: emulation reports 0. Check the bar's height, the sticky offsets, and that nothing shows through the inset strip.
- Tapping fold items on iOS Safari: activation through the shadow-root menu, and a folded `<a target=_blank>` (intake-form Preview, when it folds) opening a tab.
- The landscape notch (left/right insets) is not handled by the bar.

### Hub gaps (/request-lego)

- `esa-breadcrumbs`: no overflow strategy (no `min-width:0`, ellipsis, or collapse). The spoke does all of it.
- `esa-dropdown-menu`: no way to mirror or host other controls. Folding needs the click-replay shim above. A built-in "overflow menu" mode (an `esa-toolbar`/priority+ pattern) would retire most of `layout()`.
- `esa-app-bar`: no compact density (existing note). Its empty `__main` slot costs a gap.
- `esa-badge`: no runtime short/dot form for tight bars.

Screenshots (scratchpad `pw/`): `shots-02-final/` (after, 390/768/1440), `shots-02-before/`, `shots-02-fold/` (390 menus open: pm2, projects, intake, project record; history sheet opened from the fold).
