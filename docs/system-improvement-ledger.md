# System improvement ledger

Friction this spoke hit in `@esa/ecology` that is the SYSTEM's to fix, not this
repo's. Each line is: what was missing → where it bit → the proposed hub fix.
Everything here is currently worked around locally; the workaround should be
deleted when the hub lands the fix.

Raised via `/request-lego` unless noted otherwise.

## Open

### Theming hooks that do not exist

- **`esa-card` has no hook for its header divider.** It routes `--card-bg`,
  `--card-border-color` and `--card-header-bg` through public hooks, then
  declares `--_card-header-border: var(--color-border-default-subtle)` with no
  hook one line below them. *Bit:* the project detail page wanted six section
  cards with no internal rule; the only token in the chain is a tier-2 semantic
  role that would move every subtle border in the app. *Fix:* a public
  `--card-header-border-color`, mirroring the `--card-header-bg` hook directly
  above it. *Workaround:* `src/components/shared/firma2-card-section.css`.

- **`esa-card` hardcodes its title as `<h3>`.** *Bit:* on a detail page whose
  `<h1>` is the project name, all six sections want `<h2>`, so the document
  outline skips a level on every section. *Fix:* a `headingLevel` / `titleAs`
  prop. *Workaround:* none — the outline is simply wrong.

- **`esa-card` accepts no `class` and does not spread rest props.** *Bit:* every
  consumer that needs to scope a style must add a wrapper element it does not
  otherwise want (`firma2-project-description` has one purely for this). *Fix:*
  accept `class`, or spread rest onto the root.

- **`.sidebar` (layouts.css) has no cross-axis alignment knob.** It exposes
  `--gap`, `--sidebar-width` and `--sidebar-content-min`; `data-align` sets
  `--align`, which `.sidebar` never reads. *Bit:* the detail page's aside
  stretched to the full height of a five-section main column and rendered as a
  mostly-empty box. *Fix:* have `.sidebar` read `--align`. *Workaround:* wrap the
  aside in a `.stack`.

- **No measure / prose-width token.** `--content-max-width` is page-container
  width, not line length. *Bit:* the description paragraph needs a 65–75
  character measure; `68ch` is a commented hard-code. *Fix:* a `--measure-prose`
  semantic token.

- **No height/size token scale.** Spacing tops out far below a major surface's
  footprint. *Bit:* the work-areas map needs one stable height; `640px` is a
  commented hard-code. *Fix:* a size/frame scale for fixed footprints.

### Legos that should exist

- **No map lego.** `esa-map` is a `type="reference"` documentation page marked
  non-functional, with nothing importable — the same situation as `esa-grid` vs
  AG Grid. *Bit:* `firma2-project-map` hand-rolls a Leaflet loader; cb-fish-design
  already hand-rolls the same one, so this is TWO spokes duplicating it. *Fix:*
  an `esa-map` Lit island wrapping Leaflet with token-themed chrome.

- **No `esa-table`.** *Bit:* the funding section is three rows with a total — far
  below AG Grid's weight class, and the spoke's AG Grid precedent is explicitly
  scoped to the hundreds-row portfolio table. *Fix:* a small semantic table lego
  (`<th scope>` headers, right-aligned tabular-nums numerics, `<tfoot>` total).

- **No `esa-inline-edit` / editable-field.** *Bit:* `firma2-editable-field` ports
  cb-fish-design's `cbf-invoice-field` — the SECOND spoke to build this
  read↔edit row. *Fix:* promote it. See the decomposition notes before doing so.

- **No `esa-timeline`.** *Bit:* `firma2-project-timeline` renders
  `{date, title, status}[]` and is domain-free; any permit track, grant lifecycle
  or review workflow wants the same shape. *Fix:* promote, with a
  `--timeline-marker-*` token trio so a spoke can re-point the status colours.

### Component defects

- **`esa-select` option labels do not align with its own trigger.** `.option` is a
  flex row padded 12px whose FIRST child is an 18px `.check` present for every
  option (merely `opacity: 0` when unselected), so labels start 34px in while the
  trigger's value sits at its field padding — 10px at `md`. *Bit:* the selected
  value visibly jumps left when the panel closes. *Fix:* order the check to the
  trailing edge. *Workaround:* shadow-root stylesheet in
  `firma2-editable-field.astro`.

- **Form controls do not agree in height or type size at ANY shared rung.**
  Measured: at `sm`, `esa-text-field` is 36px/12px and `esa-select` 43px/16px; at
  `md`, 44px/15px vs 47px/16px vs `esa-filter-dropdown`'s 40px. **12px is below
  the 13px floor design-principles sets for any text.** No token can reach it —
  `--form-height-*` and `--form-padding-*` were both deleted 2026-08-14, so a
  field's height is padding read straight off `--spacing-*` with no hook. *Bit:*
  every control row in this spoke. *Fix:* one shared field-height token, or make
  the ramps agree. *Workaround:* `CONTROL_PINS` in `AppLayout.astro`.

- **`esa-text-field` / `esa-textarea` / `esa-select` have no `hideLabel`.** They
  render no `<label>` when `label` is empty, but then have nothing naming them.
  `esa-text-field`'s own nameless warning blesses `aria-label` — but setting it on
  the HOST does not cross the shadow boundary, so the blessed path is inert.
  *Bit:* `firma2-editable-field`'s rows already show the field name in a `<dt>`;
  passing `label` prints it twice. cb-fish-design filed this too — second spoke.
  *Fix:* a `hideLabel` prop, or honour a host `aria-label`.

- **`esa-progress-bar` forwards nothing beyond its six declared props** (no index
  signature), so `aria-label`, `aria-describedby`, `id` and `class` are silently
  dropped. *Bit:* a bar can only be named via its VISIBLE label, and there is no
  way to substitute a domain readout ("34.1 of 62 acres") for the `%`. *Fix:* an
  index signature, plus a `valueText` prop rendered in the value slot and set as
  `aria-valuetext`.

- **`esa-app-shell`'s scroll pane is `position: static`.** `.visually-hidden`
  (a11y.css) is `position: absolute` with auto offsets, so every screen-reader-only
  string in the app takes `<body>` as its containing block: it does not scroll
  with the pane, and it is not clipped by it. *Bit:* a `<caption
  class="visually-hidden">` ~1490px down the detail page gave the 100dvh app frame
  a second outer scrollbar that scrolled the whole UI off-screen, leaving 490px of
  blank page. Clean build, no warning. *Fix:* the shell's scroll pane should
  establish a containing block. *Workaround:* `position: relative` in
  `AppLayout.astro`.

- **`esa-sidebar-nav` hardcodes its collapse glyph** (`chevrons-left/right`) with
  no `part=` and no slot, and the registry has no panel/sidebar glyph — the one
  wanted exists only as a raw inline SVG inside `esa-app-shell`'s own bar toggle.
  *Fix:* expose a part or a slot, and register the panel glyph. *Workaround:*
  mask-image via an adopted stylesheet in `AppLayout.astro`.

- **`icon-registry.ts` is missing `circle` and `circle-dot`** — the other two
  members of the `circle-check` family, and the natural trio for any sequence or
  step state. *Bit:* `firma2-project-timeline`'s status markers. *Fix:* two Lucide
  bodies, additive. *Workaround:* `esa-icon`'s `paths` extension point, passing
  both `name` and `paths` so the registry wins once they land.

- **`esa-page-header` has no slot for a status marker.** *Bit:* the project's stage
  pill has nowhere to go but the `actions` cluster, which is for actions. *Fix:* a
  `status` slot beside the title.

- **`esa-select.onKeydown` calls `preventDefault()` on Escape even when closed**,
  which makes `defaultPrevented` useless as a signal to a host. *Bit:*
  `firma2-editable-field` must listen in the capture phase to tell "close the
  listbox" from "abandon the edit". *Fix:* only preventDefault when open. Minor —
  fold into any select ticket.

- **`esa-popover` has no block/full-width anchor mode.** Its host and shadow
  `.esa-popover-anchor` are both `inline-block`, so a slotted trigger that
  needs `width: 100%` (an editable-field's display box) collapses to
  max-content inside the anchor. *Bit:* the project rail's Lead organization
  row cannot raise an entity hover card the way the classification chips do —
  wrapping its full-width display button in the popover breaks the box
  geometry. *Fix:* honour a `block` attribute (host + anchor become
  `display: block`), or read the host's own computed display. Also wanted:
  a chip-skin hook on `esa-combobox` (its multi-select chips ship one
  hard-coded green capsule skin; `firma2-editable-field` re-skins them via an
  adopted sheet to match `esa-pill`).

### Tooling

- **`check-verbal-restraint.mjs` skips silently** when the design-gate corpus is
  not installed on the machine (`~/.claude/hooks/design-gate`). It reports
  `"ok": true` alongside `"skipped": true`. *Bit:* a `/design-qa` run reads as
  green when the gate never ran. *Fix:* exit non-zero, or make `ok` false when
  skipped — a missing tool is not a pass.

## Notes

- `esa-icon-button` is deprecated (2026-08-14) into a shim over
  `<EsaButton variant="chrome" iconOnly>`. Not a gap — recorded so the next person
  reading a spoke's older components knows why both names appear.
