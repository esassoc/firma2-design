# 07 — Administrator puts rows in order: move up or down, or sort A to Z

Type: story
Epic: E-A Set up and arrange the classification tree
Release: first
Status: needs-triage
Revision: 1
Blocked by: 02
Covers: OBJ-5, STA-35, ACN-19, ACN-22, ACN-27, RUL-7
Sources: `/prototypes/workspace-settings/classifications` (a row's grip menu, a group's "…" menu, the page header's "Sort A to Z"); spec #19, #26, #27; Q-190
Snapshot: not yet captured
Read with: `../epics/E-A-set-up-the-tree.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R10.

## Story

As an administrator, I want to put the rows of the tree in the order I choose, by menu or by alphabet, so that readers find the groups and classifications in the order that makes sense to the workspace.

## Description

Rows are added at the end of their list (story 02). This story is how an order is made and put right: a row's grip opens a menu with "Move up", "Move down", "Move to top" and "Move to bottom", and "Sort A to Z" puts one list back in alphabetical order. Dragging does the same moves (story 09), and the menu is the way to do them without dragging. Moving a row into another group is story 08. See it on the prototype at Workspace settings › Classifications with the tree of F1: put "Public access & recreation" (the last of Plan goal's seven) higher, then sort "Plan goal".

## Requirements

R1. Order belongs to a list, and each of these is its own list: the top-level groups; the groups directly inside one group; the classifications directly inside one group. A new row joins the end of its list (story 02). Inside a group the classifications are listed first, then its groups.

R2. Nothing sorts by itself. An order a person arranged does not change when rows are added, renamed, moved or removed elsewhere, or when the page is opened again.

R3. Every row, classification or group, has a grip at its start. It shows while the pointer is on the row or keyboard focus is inside it; on a device with no hover it always shows. The grip is named "Move <name>" for assistive technology and, on hover, says "Drag to move, or click for options". Clicking it, or pressing Enter, Space or Down on it, opens its menu.

R4. The menu offers "Move up", "Move down", "Move to top" and "Move to bottom", in that order. "Move up" and "Move to top" are off on the first row of its list; "Move down" and "Move to bottom" are off on the last; on the only row of a list all four are off. The moves are within the row's own list: a group in a group that also holds classifications is first of its groups even though classifications sit above it.

R5. Choosing a move puts the row in its new place at once, saves it, announces "<name> moved to <n> of <total>." (the place in its own list), and returns keyboard focus to that row's grip. The arrow keys walk the menu and Escape closes it.

R6. Every group's "…" menu (named "Actions for <name>") has "Sort A to Z". It puts what is directly inside that group in alphabetical order: its classifications among themselves, and its groups among themselves. It does not reach into the groups inside; each keeps its own order.

R7. The page header has "Sort A to Z", which puts the top-level groups in alphabetical order. It does not reorder what is inside any group.

R8. Alphabetical order ignores upper and lower case and reads numbers as numbers: "Biennium 2" comes before "Biennium 10".

R9. A sort is saved at once and announced: "<name> sorted A to Z." for a group, "Groups sorted A to Z." for the page header. On a list already in order it changes nothing that can be seen and is still announced.

R10. The order set here is the order every Classifications page uses (Outline and Browse, story 15 and story 17): it is not a second order kept for settings.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Dragging a row to reorder it, and the line and marking shown while dragging — see story 09.
- "Move to <group>" and "Move to top level" in the same menu — see story 08 (and story 11 for a classification sent to the top level).
- Adding rows, and the end-of-list rule's first use — see story 02.
- Folding a group so its rows are hidden — see story 10.
- Who sees the grips, the "…" menus and the header button — see story 13.

## Needs to know from elsewhere

- Names are unique among classifications and among groups, ignoring case and spacing (RUL-4, story 02/03), so two rows of one list never tie in a sort.
- A failed save puts the row back and shows "Couldn't save the change. Try again." (SR-7); every order change is in the change log (SR-6).

## Scenarios

**S1 — Move a row up** (proves R3, R4, R5)
- Given the tree of F1, with "Public access & recreation" last of Plan goal's seven classifications
- When the administrator opens its grip menu and chooses "Move up"
- Then it is sixth, above "Flood risk reduction", the page announces "Public access & recreation moved to 6 of 7.", and focus is on its grip

**S2 — Move to the top and to the bottom** (proves R4, R5)
- Given the same list
- When the administrator chooses "Move to top" on "Public access & recreation", then "Move to bottom" on "Salmon & steelhead recovery"
- Then "Public access & recreation" is first and "Salmon & steelhead recovery" is last

**S3 — Moves that cannot be made are off** (proves R4)
- Given "Salmon & steelhead recovery" first in Plan goal's classifications
- When the administrator opens its grip menu
- Then "Move up" and "Move to top" are off and "Move down" and "Move to bottom" are on

**S4 — The moves stay inside the list** (proves R1, R4)
- Given "Plan goal" with a group added inside it by story 02, so it holds 7 classifications and 1 group
- When the administrator opens the group's grip menu
- Then "Move up" and "Move to top" are off, although the classifications are listed above it

**S5 — An order survives and is saved for every page** (proves R2, R10)
- Given the order of S2
- When the administrator adds a classification to another group and opens the page again
- Then Plan goal's classifications are still in the order of S2, with nothing sorted; the order is saved for the tree, not for this page (story 15 shows it on the Classifications page)

**S6 — Sort one group** (proves R6, R9)
- Given "Practice area" and its four groups in the order of F1.2
- When the administrator opens "Actions for Practice area" and chooses "Sort A to Z"
- Then its groups read "Channels & fish passage", "Forests & fuels", "Runoff & groundwater", "Vegetation & wetlands"; the page announces "Practice area sorted A to Z."

**S7 — A sort stops at the group** (proves R6)
- Given the result of S6
- When the administrator reads "Vegetation & wetlands"
- Then its classifications are still "Native planting", "Invasive plant removal", "Meadow & marsh rewetting"

**S8 — Sort a group's classifications** (proves R6)
- Given "Plan goal" with its classifications in the order of F1.1
- When the administrator chooses "Sort A to Z" in "Actions for Plan goal"
- Then they read "Flood risk reduction", "Public access & recreation", "Riparian & wetland habitat", "Salmon & steelhead recovery", "Water quality", "Water supply reliability", "Wildfire resilience"

**S9 — Sort the top level** (proves R7, R9)
- Given "Practice area" moved above "Plan goal" with "Move up"
- When the administrator presses "Sort A to Z" in the page header
- Then "Plan goal" is first, "Practice area" second, and the page announces "Groups sorted A to Z."; the order inside each group is as it was

**S10 — Numbers and case** (proves R8)
- Given a group of classifications whose names differ only by a number and by case (for example three names ending 2, 10 and 1, one typed in lower case), a fixture addition
- When the administrator sorts the group
- Then the names run by the numbers 1, 2, 10, and the lower-case name sits among the others by its letters

**S11 — Sorting an ordered list** (proves R9)
- Given "Plan goal" and "Practice area" in the order of F1
- When the administrator presses the header's "Sort A to Z"
- Then nothing changes on screen and the page announces "Groups sorted A to Z."

**S12 — Without dragging or a pointer** (proves R3, R5)
- Given keyboard focus on the grip of a row
- When the person presses Enter, then Down, then Enter on "Move down"
- Then the row moves down one place and focus is back on its grip

## UAT script

Preconditions: Ada (Administrator, F5) is signed in. The tree is F1.
Test data: F1.1, F1.2; the group "Practice area" and "Plan goal". Note Plan goal's order before starting.
Reset: restore the test workspace's saved tree (F1).

| # | Do this | You should see |
|---|---|---|
| 1 | Open Workspace settings › Classifications; point at "Public access & recreation" | A grip at the start of the row |
| 2 | Click the grip | A menu: "Move up", "Move down", "Move to top", "Move to bottom" (and moves to groups, story 08); "Move down" and "Move to bottom" are off |
| 3 | Choose "Move up" | The row is one place higher; focus is on its grip |
| 4 | Open the same menu and choose "Move to top" | The row is first among Plan goal's classifications |
| 5 | Reload the page | The order is kept |
| 6 | Open "Actions for Plan goal" and choose "Sort A to Z" | Plan goal's seven classifications in alphabetical order, "Flood risk reduction" first |
| 7 | Open "Actions for Practice area" and choose "Sort A to Z" | Its four groups in alphabetical order, "Channels & fish passage" first |
| 8 | Open "Vegetation & wetlands" and read its classifications | "Native planting" is still first: sorting Practice area did not reach inside |
| 9 | Using the keyboard only, Tab to a row's grip, press Enter, then Down, then Enter on "Move down" | The row moves down; focus is on its grip |
| 10 | Use the grip of "Plan goal" to "Move down"; then press "Sort A to Z" in the page header | "Plan goal" is first again; what is inside each group is unchanged |
| 11 | (Classifications page, needs story 15) Open Classifications | The groups and classifications appear in the order set in settings |

## Open questions

None.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; decided | OBJ-5; RUL-7 |
| R2 | decided | RUL-7 |
| R3 | shown | STA-35; ACN-27 |
| R4 | shown | ACN-27 |
| R5 | shown | ACN-27 |
| R6 | shown | ACN-22; RUL-7 |
| R7 | shown | ACN-19; RUL-7 |
| R8 | decided | RUL-7 |
| R9 | shown | ACN-19; ACN-22 |
| R10 | shown | OBJ-5 |

- Prototype files: `src/components/shared/bcn-sortable-list.ts` (the grip, the menu, the announcement, the focus return), `src/components/settings/firma2-classification-roster.astro` (the lists, "…" menus, header button handler), `src/lib/taxonomy-edits.ts` (`sortAlphabetically`, `setOrder`, `listKey`), `src/pages/prototypes/workspace-settings/classifications.astro` (the header button).
- Data shapes: one order per list, a list of the rows' identifiers; the top-level groups are one list; each group has a list of groups and a list of classifications.
- Behavior read from the code: the menu's first and last items are off by position in the row's own list; sort uses a locale comparison ignoring case with numbers as numbers; a sort on a list already in order still saves and announces.
- Do not copy: browser storage of the order; the reading pages drawn from the original tree, so that settings' order does not show there (R10 requires it does); the grip being cloned from a template and its glyph swapped (a build detail).

</details>
