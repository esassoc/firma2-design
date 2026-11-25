# Form canvas — one editing grammar for every builder

Status: ready-for-agent

Settled in a grilling session on 2026-10-19 (25 decisions), after comparing the
intake builder with Tally (Mobbin) and with the custom-page editor. Decision
record: `docs/adr/0001-one-editing-grammar-for-builder-canvases.md`.
Supersedes parts of `.scratch/project-intake/spec.md` — see "Changes to the
intake spec" below.

## Problem Statement

The intake builder borrowed Tally's parts (in-place labels, a `/` line, hover
grips) but kept a configurator's shape: a 25rem docked sidebar holding the
palette and every setting, a single add line at the end of each screen, screens
as headings with Move up/down buttons, and a heavy selected state. It reads as
a canvas plus a settings panel, not as a document you type into.

It also does not feel like the product's other builder. Custom pages offer an
empty-line toolbar and no `/`; the intake builder offers `/` and no toolbar.
Custom pages have no block grips; the intake builder does. An administrator
who learns one has to relearn the other.

## Solution

One **editing grammar** for every builder canvas, shared by the intake builder
and custom pages:

- **Add from any blank line.** A blank line offers `/` (type to filter) and a +.
  Both open the same list: one shared `bcn-insert-menu`. Enter at the end of a
  block opens a blank line beneath it.
- **Act from the grip.** Hovering a block shows its grip. The grip drags, and
  clicking it opens an `esa-dropdown-menu` of actions.
- **Settings live on the block they belong to,** not in a sidebar.
- **The same keys everywhere:** ⌘D duplicate, Backspace on an empty new block
  removes it, ⌥↑/⌥↓ move.
- **Selection is light:** the hover tint plus a focus ring. Escape deselects.

The intake builder loses its sidebar entirely. Free workspaces keep the Intake
form page, locked, showing the fixed form and a call to upgrade.

## Decisions

| # | Decision |
|---|---|
| 1 | One shared grammar for the intake builder AND custom pages, not intake only. |
| 2 | ~~The intake builder's docked sidebar is removed: no palette, no settings rail.~~ *Partly reversed 2026-10-20 (#31): a Fields drawer is back on the right; settings still sit on the blocks.* |
| 3 | Save models stay different: intake saves as you go and goes live on **Publish changes**; a custom page keeps read → **Edit** → **Update**. Only the top bar matches (#19). |
| 4 | The canvas draws questions exactly as members see them (`typography-label-md` labels from the legos). The member form is not restyled. |
| 5 | Screens are divider blocks inserted from `/` or +, draggable like any block. Nothing screen-related shows until a second screen exists. |
| 6 | Settings are split across the canvas: `*` toggles Required; a "Saves to *Field*" line on the selected question; a "When … is …" condition row under its block. The grip opens `esa-dropdown-menu` with actions only. |
| 7 | `/` and + open one inline grouped list. Standard questions already on the form stay listed, greyed with "In form". No insert dialog. |
| 8 | ~~Dragging new types onto the canvas from outside goes away (no palette).~~ *Reversed 2026-10-20 (#31): fields drag in from the drawer.* Reordering by drag stays. |
| 9 | One `bcn-insert-menu` component serves both editors. Custom pages drive it through `@tiptap/suggestion`; intake drives it from its add lines. Filed upstream with `/request-lego`. |
| 10 | Adding a second screen makes a title line appear for screen 1, too. Each divider carries the title of the screen after it. |
| 11 | ~~Clicking "Saves to" opens the field picker, field name and unit inline under it.~~ *Superseded 2026-10-20 by #26–#30:* "Saves to *Field*" is a link to that field in Custom fields. |
| 12 | "Add condition" (grip menu of a question, text block or divider) draws a row: **When** [earlier question ▾] **is** [answers ▾] [×]. It stays visible whenever a condition exists and replaces the "Shown when" badge. Answers use `esa-filter-dropdown` if it fits a multi-select; otherwise `esa-checkbox-group`. |
| 13 | Selection = hover tint + focus ring. No green border or fill. Escape deselects. |
| 14 | Locked standard questions: no Remove or Add condition in their grip menu; a lock icon beside the label on hover with a tooltip; "Choices come from *Organizations*" link where "Saves to" would be. |
| 15 | Custom-page grip menu: Duplicate, Move up, Move down, Turn into (paragraph, heading, list), Delete. |
| 16 | Shortcuts in both editors: ⌘D, Backspace-on-empty, ⌥↑/⌥↓. Pasting several lines into a choice splits them into choices. |
| 17 | "Message after submitting" becomes a fixed final divider, **After submitting**, with its text below it. It is not draggable and has no grip menu. |
| 18 | The free tier gets **no** intake customization: not a reduced builder. |
| 19 | One top-bar grammar: status, Preview, primary. Intake: "Unpublished changes" or "Published *date*" · Preview · **Publish changes**. Custom page: "Editing" · **Update** · "…". |
| 20 | Delivery: this spec and the ADR first, then build in order: `bcn-insert-menu` → intake rework → custom-pages side. Verify in the browser after each step. The product-brief principle is added once the screens have proved it (brief §8). |
| 21 | Free workspaces keep the Intake form item in Workspace settings. The page is locked: a tease and a CTA, not removed. (Plan locks differ from admin feature switches, which do remove.) |
| 22 | The fixed free form: one screen with Project name, Project type, Lead organization, Classifications, Description, Location, and the default after-submit message. |
| 23 | The locked page draws the real canvas with the fixed form, read-only: no grips, no +, no `/`. One info `esa-alert-box` above it pitches the upgrade with one CTA. The top bar shows a "Standard form" badge and **Upgrade** where Publish changes would be. |
| 24 | Upgrade leads to a new **Workspace settings › Plan** page. In the prototype, its button switches the workspace to the paid tier. |
| 25 | The Plan page lists only what is actually plan-locked today (intake form customization), one section per locked feature. No pricing table and no plan names beyond Free and Pro. |
| 26 | **Fields are made in Custom fields, never in the builder** (2026-10-20). The builder only places existing fields. Making a field, its kind and its choices while also writing the question asked for two designs in one gesture. |
| 27 | ~~`/` and + list a **Custom fields** group~~ *(moved to the drawer, #31)*: every workspace field by name, greyed "In form" once placed (a field is asked at most once per form), then **New custom field**. |
| 28 | New custom field goes to Custom fields (`?new=1&for=intake`), its Add button reads **Add to intake form**, and Add returns to the builder with the field placed where it was asked for. |
| 29 | A placed field arrives with its name as the question, selected, so typing rewords it ("How many acres will this restore?"). Choices are the field's and are drawn read-only; Duplicate is for text blocks only. |
| 31 | A **Fields drawer** docks on the right (firma2-side-panel, toggled by **Fields** in the top bar), as Jira's work-item layout does: search, Custom fields then Standard questions as neutral name-only tiles (ghost + outline, no type icons), "In form" greyed, New custom field at the end. Click places below the selection; drag drops where a line shows. **The drawer is the only way a question reaches the form** — custom or standard. The per-block + is gone and `/` lists Layout only (Text, New screen) (amends #7, #10, #27). It only lists, no settings. Absent below Agency. |
| 30 | A first-time **Set up your intake form** guide sits above the canvas: create fields → add them → word them as questions → publish. Each step ticks from real state; the guide goes when all are done or it is hidden. |

## User Stories

### Administrator (paid): building the intake form

1. As an administrator, I want to open a blank line under any block by pressing Enter at its end, so that I can add exactly where I am.
2. As an administrator, I want `/` on a blank line to list what I can add, filtered as I type, so that I never reach for the mouse.
3. As an administrator, I want a + on a blank line that opens the same list, so that I can add without knowing the shortcut.
4. As an administrator, I want standard questions already on the form to stay in the list, greyed and marked "In form", so that I can see everything there is.
5. As an administrator, I want to click a question's `*` to make it required or optional, so that I set it where I see it.
6. As an administrator, I want a selected question to show "Saves to *Field*", and to change the field, its name and unit right there, so that the canvas is the only place I look.
7. As an administrator, I want to add a condition from the grip menu and see it as a "When … is …" row under the block, so that the form's logic is visible on the form.
8. As an administrator, I want to add a screen break like any other block and drag it, so that restructuring screens is the same act as moving a question.
9. As an administrator, I want a title line for every screen to appear as soon as there are two, so that members always see named steps.
10. As an administrator, I want the after-submit message as a final **After submitting** divider, so that the whole member journey reads top to bottom.
11. As an administrator, I want to duplicate, move and remove a block from its grip menu or with ⌘D, ⌥↑/⌥↓ and Backspace, so that editing is fast either way.
12. As an administrator, I want to paste a list of lines into a choice and get one choice per line, so that long lists take one step.
13. As an administrator, I want a locked standard question to explain why it can't be removed or renamed, and link to where its choices live, so that I am not left guessing.
14. As an administrator, I want a light selection, so that the form still reads as the form while I edit it.

### Administrator: custom pages

15. As an administrator editing a page, I want `/` on a blank line to list what I can insert (heading, lists, image, file), so that pages and forms are built the same way.
16. As an administrator editing a page, I want a grip beside each block to drag it or open Duplicate, Move, Turn into and Delete, so that rearranging a page is as direct as rearranging a form.
17. As an administrator editing a page, I want ⌘D, ⌥↑/⌥↓ and Backspace to work as they do in the intake builder, so that one set of keys works everywhere.

### Administrator (free): the locked intake form

18. As a free-workspace administrator, I want to still find Intake form in Workspace settings, so that I know the product can do this.
19. As a free-workspace administrator, I want to see the form my members fill in, read-only, so that I know what they are asked.
20. As a free-workspace administrator, I want one clear way to upgrade, so that I can unlock customization when I need it.
21. As a free-workspace administrator, I want a Plan page listing what an upgrade unlocks, so that I can judge it.

### Member (free)

22. As a member of a free workspace, I want New project to ask only the fixed six questions, so that I can propose a project without a custom form.

## Implementation Decisions

- **`bcn-insert-menu`** (new, `src/components/shared/`): a floating listbox anchored to a caret or element. It has grouped options, type-to-filter, disabled items carrying a trailing note ("In form"), and keyboard behaviour (↑↓ Enter Escape, aria-activedescendant on the owner). It takes `esa-popover`'s surface tokens. It is extracted from the intake builder's current menu, which already does most of this.
- **Intake builder** (`firma2-intake-builder.astro`):
  - Remove `Firma2RecordRail`, the palette, the settings section and palette drag.
  - Hold every block (questions, text, dividers) in ONE flat `bcn-sortable-list`, and derive screens from the divider positions. `bcn-sortable-list` is untyped, so a divider row sorts like any row. `src/lib/intake-form.ts` keeps `screens[]` as the stored shape; the builder converts between the two.
  - The grip is the `esa-dropdown-menu` trigger, using `menu-action` events.
  - **Ecology deviation:** `esa-popover` cannot anchor to an arbitrary element (slotted trigger only; `show()`/`hide()` are private), so the insert menu stays bespoke. This is why it gets `/request-lego`.
- **Custom pages** (`firma2-rich-text.astro`):
  - Add `@tiptap/suggestion` for `/`.
  - Add `@tiptap/extension-drag-handle` for the grip, version-matched to `@tiptap/core ^3.31`.
  - The grip menu runs Tiptap commands.
  - The empty-line FloatingMenu stays as the + equivalent.
- **Tier:** `readTier()` already reads `?tier=`. The free page renders the fixed form through the same renderer, inert, so the read-only canvas matches the member page.
- **Plan page:** `src/pages/prototypes/workspace-settings/plan.astro` is a settings surface (rail mode, width="reading"). Add a nav item for it.
- **Copy:** all strings go through the `microcopy` skill at build time. None are fixed in this spec.

## Changes to the intake spec

`.scratch/project-intake/spec.md` said free workspaces get "the same builder
limited to built-in attributes" (Solution, story 33). That is replaced by
decisions 18, 21–25: no customization, a locked page, a fixed six-question
form.

## Testing Decisions

There is no test tooling in the repo. Verify in the browser with playwright-core
and system Chrome from the scratchpad, after each build step:

- Every add path (Enter, `/`, +) lands the block where expected.
- Grip menu actions.
- Shortcuts.
- Paste-to-split.
- Conditions are added, edited and removed inline.
- Dividers: adding a second screen titles screen 1, and a member preview shows the steps.
- The free page has no grips, + or `/`, and its CTA reaches Plan.
- The custom-page `/` and grip.

Check all of these across siblings (every block type), not one instance.

## Built — 2026-10-19

All three steps are built and verified in Chrome, and `npm run build` is
clean. Where the build departs from the decisions above:

- **No `@tiptap/extension-drag-handle`.** Its v3 lists the Yjs collaboration
  packages as peers. The page grip is an `esa-dropdown-menu` placed beside the
  hovered block, and it drags with ProseMirror's own node drag. Only
  `@tiptap/suggestion@3.31.4` was added, pinned exactly: `^` resolves to 3.32,
  which needs a newer `@tiptap/pm`.
- **Ecology deviations (flagged):**
  - The `*` Required switch is a bespoke glyph switch (`role="switch"`); no
    lego is glyph-sized.
  - `bcn-insert-menu` is bespoke because `esa-popover` and
    `esa-dropdown-menu` cannot anchor to a caret.
  - The condition's answers use `esa-checkbox-group`, not
    `esa-filter-dropdown`, which cannot be preset with a value.
- **Also changed:**
  - `bcn-sortable-list` takes per-row `data-sort-actions` (backward-compatible).
  - AppLayout's 40px control pins now reach fields created after load.
    Before, every runtime `md` field came back at 46px.
  - The page editor's `canvas` prop keeps the grammar off the intake builder's
    own text blocks.
  - A pointer press selects a builder block on click, not on focus. Selecting
    on focus changed the layout mid-click and sent clicks astray.
- **Not done here:**
  - `/request-lego` (a user-run command) for `bcn-insert-menu` and the block grip.
  - The product-brief principle, which waits until the screens have been used.

## Click anywhere, and formatted labels — 2026-10-19 (second pass)

User feedback on the first build: "it doesn't feel like I can just click
somewhere and type, because I can't", and "I can't even change the style of
the text like bold, italics."

- **Click anywhere and type.** A click on no control puts the caret in the
  nearest text, where it was clicked:
  - beside a label → the end of the label
  - a block's padding, the gaps between blocks, the margins → the nearest text
    on that line
  - below the last block → the blank line
  - around "After submitting" → that message
- **Type into the box.** Clicking a free-text question's input (short text,
  long text, number, money) edits its placeholder in place, as Tally does
  (`placeholder` on the block; the member page renders it).
- **Formatted labels and help (user chose: render in the spoke now).**
  - What it does: bold, italic and links in a question's label and help, from
    a selection toolbar or ⌘B ⌘I ⌘K.
  - Where it's stored: `labelHtml` and `helpHtml`, next to plain `label` and
    `help`, which every other surface keeps reading. It passes through
    `src/lib/inline-format.ts` (`<strong>`, `<em>` and safe `<a>` only) on the
    way in and on the way out.
  - How members see it: on their page, a formatted question's label and help
    are drawn by `controlMarkup` around the lego, and the lego keeps the plain
    wording as its `aria-label`.
  - What stays plain: choices (the shared field's values), screen titles and
    the fixed standard names.
  - **Ecology deviation.** The esa-* controls take plain-string labels; due
    upstream as a request for a formatted label and help slot.
- **Hub bug found, worked around in the spoke.** `esa-entity-search`'s "/"
  hotkey checks `event.target`, which a shadow root retargets to the field's
  host. So "/" typed in any esa-text-field (a web address) opened search.
  AppLayout now stops "/" on `<html>` when the real target is editable. Due
  upstream.

## Out of Scope

- Pricing and plan comparison.
- Restyling member-facing question labels.
- An insert dialog with previews.
- Dragging new types in from outside the canvas.
