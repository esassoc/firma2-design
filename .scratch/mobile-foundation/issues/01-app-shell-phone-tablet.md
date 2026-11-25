# 01 — App shell on phone and tablet

Status: ready-for-human
Owns: `src/layouts/AppLayout.astro`, `src/components/shared/firma2-rail.astro` (unpin thresholds only)
Spec: `../spec.md` finding #1

## Problem

`esa-sidebar-nav` is always an in-flow 280px column. At 390px the content pane is 110px; at 768px it is 480px. No breakpoint ever collapses the nav or turns it into a drawer.

## Target

- **≤ 64rem (tablet):** the nav defaults to its collapsed 72px strip (the existing `collapsed` state, the existing hover-peek overlay keeps working). A user who expands it on a tablet gets it expanded; persist nothing new, just change the default when no stored preference exists. If a stored "expanded" preference exists and the viewport is ≤64rem, still start collapsed (the screen wins).
- **≤ 45rem (phone):** the nav becomes a drawer. The hub's `esa-sidebar-nav` already implements drawer mode (`drawer` / `drawer-open` reflected attributes, its own toggle, scrim, Escape, focus move, inert page — read `node_modules/@esa/ecology/src/components/esa-sidebar-nav.ts` lines 60–160 and the `:host([drawer])` styles). Its own comment says the host must drive `drawer` from a `matchMedia`; `esa-app-shell` does not, so `AppLayout` does: a `matchMedia('(max-width: 45rem)')` listener sets `nav.drawer`, and clears `drawer-open` when leaving phone width.
- In drawer mode the frame is one column; the nav host (which renders only its toggle at `width:auto`) sits at the leading edge of the 48px top-bar row, before the home glyph, as a 32px compact md icon button (`menu` glyph from the registry, accessible name "Menu"). Hide the frame's account foot and the edge handle in drawer mode (the drawer carries the account row instead — check what `.firma2-app-frame__account` holds and move or duplicate it into the drawer header slot).
- The scrim and the `.nav-content` panel are `position: fixed` in the lego; they must sit above the top bar (z-index) and pad for `env(safe-area-inset-top/bottom, 0px)`.
- Phone pane padding: the pane's `--spacing-500` inline padding becomes `--spacing-400` (16px) at ≤45rem; `--firma2-sticky-origin` must follow it (it is derived from that padding).
- `firma2-rail`: every rail's `unpinAt` must already fire once the pane is full width; verify the record rail, the peek, and the side panel unpin (stack) at 390 and 768 after the shell change. If a rail's threshold is tied to the old 110px pane, fix the prop value where the rail is placed, not the component.
- `bcn-side-sheet` at ≤64rem already goes full-pane per the comment at AppLayout line ~994; confirm it still does.

## Verify

```
cd /private/tmp/claude-501/-Users-mauricio-Documents-GitHub-firma2-design/e6d75c19-5384-48d9-bacc-9cf45a8116ee/scratchpad/pw
WIDTHS=390,768,1100 ROUTES=/prototypes/projects,/prototypes/projects/intake,/prototypes/performance-measures/acres-floodplain-habitat,/prototypes/workspace-settings/intake-form OUT=./shots-01 node audit.mjs
```

Before: `nav.width=280 paneW=110` (390), `paneW=480` (768). After: 390 → `nav.drawer=true`, pane ≥ 374; 768 → `nav.collapsed=true`, pane ≥ 680; 1100 → unchanged from today (280 nav).
Also drive the drawer: tap the toggle, assert `drawer-open`, Escape closes, focus returns to the toggle. Screenshot 390 open and closed.

## Hub gaps (for /request-lego)

- `esa-app-shell` should drive `esa-sidebar-nav[drawer]` from a media query itself.

## Comments

**2026-10-21 — implemented (agent).**

### Before / after (audit.mjs, the four ticket routes + the followed record)

| Width | Before | After |
|---|---|---|
| 390 (touch) | nav 280, not drawer; pane 110 on every route | `drawer=true`, host 48px (toggle only); **pane 390** on every route |
| 768 | nav 280; pane 480 | `collapsed=true`, nav 72; **pane 688** on every route |
| 1100 | nav 280; pane 812 | unchanged: nav 280, pane 812 |

Pane horizontal overflow at 390 dropped from +161…+344 to 0 on projects, intake, measure record and import; intake-form keeps **+56** (the rich-text toolbar, `firma2-rich-text__toolbar`) and the project record **+15** / intake **+29** (top-bar actions cluster) — tickets 02 / 04 territory, not the shell.

Drawer probe (`pw/drawer01.mjs`, 390 touch): toggle at (16, 8) 32×32, name "Menu", `aria-expanded=false`. Tap → `drawer-open`, `aria-expanded=true`, panel x 0 / 280 wide, focus on the panel's Close, pane + utility bar `inert`. Focusing the re-slotted workspace button keeps the drawer open. Escape → closed, focus back on the toggle, page un-inerted. Tap on the scrim → closed (focus to body — the lego's focusout-closes path, not ours). Resize 390 → 1100: drawer off, label back to "Sidebar", head items back in `slot="header"`, account menu back in the foot, rail 280. → 768: collapsed 72. Tablet peek still works (hover opens 280 over a 688 pane; click pins).
Screenshots: `pw/shots-01/drawer-390-closed.png`, `drawer-390-open.png`, `390-*.png`, `768-*.png`, `1100-*.png`, `coll-768-load.png`, `peek-768.png`, `sheet-390.png` / `sheet-768.png`.

Rails: record rail, peek and the intake Fields side panel all report `data-unpinned` at 390 (parent 358) and 768 (parent 640); no prop changes were needed — every `unpinAt` (664 / 904 / 1064) is above the new widths. `bcn-side-sheet` at ≤64rem: full pane (390: x 0 w 390; 768: x 72 w 688).

### Files changed

- `src/layouts/AppLayout.astro`
  - ~L573–635: `RAIL_HEAD_CSS` gains drawer-only shadow rules (toggle label visually hidden, Close → 40px icon in the panel corner, safe-area padding on the panel, `--elevation-3` shadow) and `placeDrawerSlots()` injects `drawer-head` / `drawer-foot` slots into `.nav-content` (outside Lit's parts).
  - ~L781–902: `mountResponsiveShell()` — `matchMedia` 45rem / 64rem; drives `drawer`, `label`, re-slots the head items + account menu, tablet default collapsed (screen wins; desktop restores bcn-edge-handle's stored `c`), inerts pane + utility bar on `drawerchange`, and a capture `focusout` guard so focus on re-slotted light-DOM items does not close the drawer.
  - L1000–1005: `--firma2-pane-padding` published; `--firma2-sticky-origin` derives from it. L1126: pane `padding: var(--firma2-pane-padding)`.
  - L1510–1585: phone block — pane padding → `--spacing-400`; no 280px flash before upgrade; host absolute on the top-bar row at `--z-modal`; foot hidden; top bar's leading padding makes room for the toggle; in-panel styling for workspace / search / account.
- `--_bleed` / bleed margins now read `var(--firma2-pane-padding, var(--spacing-500, 1.5rem))` (one line each): `src/components/shared/firma2-rail.astro` (L154 + comment), `src/components/projects/firma2-project-atlas.astro` L221, `firma2-my-projects-map.astro` L286, `firma2-work-areas.astro` L208, `firma2-project-map.astro` L662. The top bar already derives its bleed from `--firma2-sticky-origin` (ticket 02's change), so it follows with no edit.
- `src/components/shared/firma2-pages-nav.astro` L239–242: the row-menu label margin is scoped to `:host(:not([collapsed]))`. **Pre-existing bug** surfaced by this ticket: on any collapsed rail every icon sat off the 72px strip's left edge (label kept a 32–48px margin). With tablets now defaulting to collapsed it was the first thing a tablet saw.

(Unrelated uncommitted diffs in AppLayout / firma2-rail / bcn-side-sheet — the "sheet takes the rail's place" work — predate this ticket and were left as found.)

### Decisions the ticket left open

1. **Where the head items go.** The lego's only slot (`header`) sits beside the toggle, outside the sliding panel. Rather than show the workspace menu + search in the top bar, they are re-slotted into a `drawer-head` slot injected at the top of the panel, and the account menu into a `drawer-foot` slot at its foot (moved, not rebuilt, and moved back on widen). Collapse toggle is not carried — meaningless on a drawer.
2. **Toggle name "Menu"** (vs "Navigation" — reads "Navigation navigation" as a landmark — and "Open navigation" — wrong once open, `aria-expanded` already says it). The lego names the toggle and the landmark from one `label`, so the landmark reads "Menu" on phones; desktop keeps "Sidebar".
3. **Close button restyled** to a 40px icon-only square in the panel's top-trailing corner (name "Close" kept), so the workspace row owns the first line. **Ecology deviation** — flag.
4. **No visible scrim.** `theme-firma2` sets `--color-background-overlay-backdrop: transparent`, so the scrim catches the tap but draws nothing; the panel lifts on `--elevation-3` (the peek's shadow) instead. design-principles asks for a scrim covering the viewport — **deviation, user's call** (theme file belongs to ticket 03).
5. Pane padding published as `--firma2-pane-padding` rather than each band restating `--spacing-500`.

### Needs a real phone

Safe-area padding on the panel (notch / home indicator), the toggle's top inset under a notch in landscape (the host sits at the frame's top, not `env(safe-area-inset-top)` — it follows whatever ticket 03 does to the frame), the 250ms slide feel, tap-through on the transparent scrim, and VoiceOver/TalkBack reading the "Menu" button → group.

### Hub gaps (for /request-lego)

- `esa-app-shell` should drive `esa-sidebar-nav[drawer]` from a media query itself (and inert the page on `drawerchange`).
- `esa-sidebar-nav` drawer panel needs slots inside the panel (head / foot); its `header` slot is outside it. Today spoke-injected slots stand in.
- `esa-sidebar-nav`'s drawer focusout check uses `renderRoot.contains()`, so focus moving to any slotted light-DOM child closes the drawer. Should test the host (`this.contains(next) || renderRoot.contains(next)`).
- A compact/icon-only option for the drawer toggle and Close button.

### Noticed, not mine

- On the project record at ≤45rem, the toolbar's `bcn-side-sheet` lives inside `.firma2-top-bar__toolbar`, which the top bar hides under 45rem — that sheet opens at 0×0. Ticket 02.
- The collapsed rail's workspace row is an empty highlight (no brand mark exists), pre-existing.
