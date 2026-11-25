# 1. One editing grammar for every builder canvas

Date: 2026-10-19
Status: accepted

## Context

The product has two builders an administrator edits in place: the intake form
builder and the custom-page editor. They grew separately.

- The intake builder borrowed Tally's parts but kept a docked sidebar for adding
  and for settings.
- Custom pages offer an empty-line toolbar, with no `/` and no block grips.

Compared with Tally on Mobbin (2026-10-19), the intake builder read as a
configurator, and the two builders read as two products.

## Decision

Every canvas where an administrator builds something in place uses one grammar:

1. **Add from a blank line:** `/` (type to filter) or a +. Both open the same
   `bcn-insert-menu`. Enter at the end of a block opens a blank line below it.
2. **Act from the grip:** it drags, and clicking it opens an `esa-dropdown-menu`
   of actions (Duplicate, Move, Remove, and per-editor extras such as Add
   condition or Turn into).
3. **Settings sit on the block they configure.** There is no settings sidebar.
4. **The same keys:** ⌘D, ⌥↑/⌥↓, and Backspace on an empty block.
5. **Light selection:** a tint plus a focus ring.

How a builder saves is NOT part of the grammar. Intake saves as you go and
publishes; a page edits and updates. Only the top bar's slots match: status,
Preview, primary.

## Consequences

- New builders adopt this grammar instead of inventing one. Likely next
  candidates: performance measure setup and custom fields.
- A setting that needs more room than a block can give is a design problem to
  solve on the canvas, not a reason to bring a sidebar back.
- `bcn-insert-menu` and the block handle are spoke components until the hub
  takes them (`/request-lego`).
- Spec: `.scratch/form-canvas/spec.md`.
