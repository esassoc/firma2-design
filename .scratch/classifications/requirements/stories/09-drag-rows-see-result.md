# 09 — Administrator drags rows and sees what will join what before letting go

Type: story
Epic: E-A Set up and arrange the classification tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-209, Q-210
Revision: 1
Blocked by: 07, 08, 10
Covers: STA-33, ACN-26, RUL-12, RUL-79, RUL-80, RUL-81, RUL-91
Sources: `/prototypes/workspace-settings/classifications`; spec #20, #26 (#19 and #22 are replaced by #31); interview 2026-11-24, Q-190
Snapshot: not yet captured
Read with: `../epics/E-A-set-up-the-tree.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R12. Waiting: nothing; R7 and R10 rest on proposals (Q-210, Q-209).

## Story

As the person who may change classifications, I want to drag a row and see, before I let go, which group it will join and where, so that I never have to guess what a drop will do to the tree.

## Description

The settings list lets a row be moved two ways that reach the same result: the grip's menu (stories 07 and 08) and dragging by the grip (this story). The tree is free, so a row's drop can mean "beside that row", "inside that group" or "into another list at its end", and a drop that moves rows silently under the pointer is unreadable. This story is about the preview: nothing moves until the drop, and what the drop will do is drawn first. Dropping a classification out of every group, which makes it a group, belongs to story 11. To see it in the prototype, open `/prototypes/workspace-settings/classifications` with the tree in F1 and drag a row by its grip.

## Requirements

R1. While a row is dragged, nothing in the list moves. The dragged row stays where it is, dimmed, and a small label with its name travels beside and below the pointer; a name too long for the label is cut with an ellipsis. A dragged group stays whole: its contents do not travel or move.

R2. Held between rows, the drag shows an insertion line at the gap the row would take. The line starts at the left edge of the list the row would join and is as wide as that list, so its indent says which group the row would join.

R3. Held over the middle of a group's own line, the group is marked (tinted and ringed) and no insertion line shows. Released there, the row joins the end of that group's list of its own kind: a classification at the end of the group's classifications (before the group's groups), a group at the end of the group's groups.

R4. A thin band at the top and at the bottom edge of a group's line (10 pixels, or a quarter of the line if it is shorter) means beside it, not inside it. For a dragged group, the top band shows the line above the group; the bottom band shows the line below it when the group shows nothing inside, and otherwise counts as inside it (R3). The same holds for a top-level group's heading.

R5. A dragged classification is only ever dropped among classifications or into a group; it is never placed among a group's groups. So over any part of a group's own line, including the bands, the classification marks the group and no line shows beside it.

R6. A group is never marked, lined or dropped inside itself or inside a group beneath it: held over anything inside the dragged group, nothing is offered. (relies on story 08, RUL-13)

R7. Held over a classification's row, the line shows the gap before it in the top half of the row and the gap after it in the bottom half.

R8. Released, the row moves to what the preview showed, the move saves at once, the page announces it once ("<name> moved to <group name>, <n> of <total>." for another list, "<name> moved to <n> of <total>." within the same list) and keyboard focus returns to the moved row's grip. The counts on the group lines ("<N> classifications") follow. Released where the row already stands, nothing changes, nothing saves and nothing is announced.

R9. Escape, or the drag being cancelled by the device, puts the row back exactly where it was; nothing is saved and nothing is announced.

R10. A folded group is not a place to drop a row by dragging: it is not marked and the row never joins it. Held over its line, the row goes beside it: the line shows above the group in the top half of its line and below it in the bottom half. A dragged classification, which is never placed among groups (R5), joins the classifications of the group the folded group stands in, at their end. (relies on story 10, RUL-28)

R11. Near the top or bottom edge of whatever scrolls the list (the settings list's own scrolling area, or the page when nothing else scrolls), the area scrolls toward that edge, faster the nearer the pointer is to it, so a row can be carried to a group that was off the screen when the drag began. After each scroll the line or the marked group is drawn again for what is now under the pointer.

R12. A drag begins only after the pointer has travelled a few pixels up or down from the press. Sideways-only movement never starts one.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The grip's menu, "Sort A to Z" and the "Move to <group>" items — see stories 07 and 08.
- Dropping a classification on the row "Drop here to make it a group", and the question asked when it is in use — see story 11.
- Folding groups — see story 10. Sending a row to a folded group from the grip's menu — see story 08.
- Whether a grip appears only on hover — see story 07.

## Needs to know from elsewhere

- A press on the grip that travels less than a few pixels is a click and opens the grip's menu instead of dragging — owned by story 07.
- A group may go under any other group or to the top level, never inside itself; a classification goes into any group — owned by story 08 (RUL-13, RUL-3).
- Inside a group the classifications come before its groups; new things join the end of their list — owned by story 07 (RUL-7).
- A name is unique among classifications and, separately, among groups; a move never changes a name — owned by story 02.
- If the save fails, the row returns to where it was and a message says so — standing requirement SR-7.

## Scenarios

**S1 — Nothing moves during a drag** (proves R1)
- Given the tree in F1, all groups open
- When the person presses the grip of "Water quality" and moves the pointer down 40 pixels without releasing
- Then "Water quality" stays in its place in Plan goal, dimmed, a label reading "Water quality" follows the pointer, and no other row has moved

**S2 — A line marks the gap** (proves R2)
- Given the same list
- When the person holds the dragged "Water quality" over the upper part of the row "Wildfire resilience"
- Then a line shows directly above "Wildfire resilience", as wide as Plan goal's classifications and starting at their left edge

**S3 — A group is marked, and the row joins its end** (proves R3, R8)
- Given the tree in F1
- When the person drags "Wildfire resilience" to the middle of the line of "Forests & fuels" and releases
- Then while held, "Forests & fuels" was tinted and ringed with no line showing; after release "Wildfire resilience" is the last of Forests & fuels's classifications, after "Prescribed fire"; the lines read Plan goal "6 classifications", Forests & fuels "4 classifications", Practice area "13 classifications"; after a reload it is still there; the page announced "Wildfire resilience moved to Forests & fuels, 4 of 4."

**S4 — The band at a group's edge means beside it** (proves R4)
- Given the tree in F1
- When the person drags the group "Forests & fuels" to the thin band at the top of the line of "Vegetation & wetlands"
- Then a line shows above "Vegetation & wetlands" at the indent of Practice area's groups and no group is marked; released, "Forests & fuels" stands between "Channels & fish passage" and "Vegetation & wetlands"

**S5 — A classification never goes beside a group** (proves R5)
- Given the tree in F1
- When the person drags "Native planting" over the top band, the middle and the bottom band of the line of "Runoff & groundwater" in turn
- Then each time "Runoff & groundwater" is marked and no line shows beside it

**S6 — Never inside itself** (proves R6)
- Given the tree in F1, all groups open
- When the person drags "Practice area" over the line of "Forests & fuels" and over its classifications
- Then nothing is marked and no line shows anywhere inside Practice area

**S7 — A classification's row: before in the top half, after in the bottom** (proves R7)
- Given the tree in F1
- When the person drags "Water quality" over the top half of the row "Flood risk reduction", then over its bottom half
- Then the line shows above "Flood risk reduction" the first time and below it the second

**S8 — Releasing where it stands changes nothing** (proves R8)
- Given the tree in F1
- When the person drags "Water quality" a little way and releases it over its own place
- Then the order is unchanged and nothing is announced

**S9 — Escape puts it back** (proves R9)
- Given a drag of "Wildfire resilience" held over the line of "Forests & fuels"
- When the person presses Escape
- Then the marking and label disappear, "Wildfire resilience" is still in Plan goal in its old place, and a reload shows the same

**S10 — The list scrolls under the pointer** (proves R11)
- Given the tree in F1 with every group open and a window too short to show all rows
- When the person drags "Water quality" and holds the pointer within the bottom edge of the scrolling area for about a second
- Then the list scrolls down, and a line or a marked group shows for the row now under the pointer

**S11 — A folded group is not a drop place** (proves R10)
- Given "Forests & fuels" folded (story 10)
- When the person drags the group "Vegetation & wetlands" to the middle of its line, first in the top half and then in the bottom half, and releases in the bottom half
- Then "Forests & fuels" is never tinted or ringed; a line shows above it, then below it; after release "Vegetation & wetlands" stands after "Forests & fuels" in Practice area and "Forests & fuels" is still folded and holds only its own three classifications

**S12 — Sideways movement does not start a drag** (proves R12)
- Given the tree in F1
- When the person presses the grip of "Water quality" and moves the pointer 40 pixels sideways only
- Then no label follows the pointer and nothing is dimmed

## UAT script

Preconditions: signed in as Ada (an Administrator); the test workspace holds the tree in F1; the window is tall enough to show Plan goal and Practice area open.
Test data: F1, F1.1, F1.2.
Reset: restore the test workspace's saved tree (F1).

| # | Do this | You should see |
|---|---|---|
| 1 | Open Workspace settings › Classifications. Press and hold the grip of "Water quality" (it appears when the pointer is on the row) and move down about 40 pixels. | The row stays where it is, dimmed. A label "Water quality" follows the pointer. |
| 2 | Move over the upper part of "Wildfire resilience". | A line above that row, the width of Plan goal's rows. |
| 3 | Move to the middle of the "Forests & fuels" line. | The line disappears and "Forests & fuels" is tinted and ringed. |
| 4 | Press Escape. | The label and marking go; "Water quality" has not moved. |
| 5 | Drag "Wildfire resilience" to the middle of the "Forests & fuels" line and release. | "Wildfire resilience" is the last row under "Forests & fuels". Plan goal says "6 classifications", Forests & fuels "4 classifications". |
| 6 | Reload the page. | The same arrangement. |
| 7 | Drag "Practice area" and hold it over "Forests & fuels" and its rows. | Nothing is marked and no line shows inside Practice area. |
| 8 | Drag "Wildfire resilience" back over the upper part of the row "Flood risk reduction" and release. | It stands between "Water supply reliability" and "Flood risk reduction" in Plan goal; the counts return to "7 classifications" and "3 classifications". |

Exceptions: fold "Forests & fuels" (story 10) and drag "Water quality" onto its line: the group is not tinted and a line shows beside it (R10). Press the grip of any row and move only sideways: no drag starts (R12).

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-209 (proposed) — Dragging a row over a folded group: where does it go?
- Q-210 (proposed) — Dragging a row over the lower half of a classification row: before or after?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided | STA-33; RUL-12 |
| R2 | decided | RUL-12 |
| R3 | decided | RUL-12; ACN-26 |
| R4 | decided; shown | RUL-12; RUL-79 |
| R5 | shown | ACN-26 |
| R6 | shown | relies on story 08, RUL-13 |
| R7 | proposed (Q-210) | RUL-80 |
| R8 | shown | ACN-26; STA-33 |
| R9 | decided | RUL-12; ACN-26 |
| R10 | proposed (Q-209) | RUL-91; relies on story 10, RUL-28 |
| R11 | shown | STA-33 |
| R12 | shown | RUL-81 |

- Prototype files: `src/components/shared/bcn-sortable-list.ts` (the `drop="line"` mode, `overRow`, `autoScroll`), `src/components/settings/firma2-classification-roster.astro` (the lists, the marking styles, the `sort-change` handler), `src/lib/taxonomy-edits.ts` (`arrangeClassifications`).
- Data shapes: each list is a home group and the ordered keys of its rows; the drop saves the whole arrangement.
- Do not copy: the order and the folded set are kept in browser storage; the rows are drawn in the browser from that store. The prototype marks a folded group and drops the row into it; R10 replaces that (Q-209). The prototype draws the line "before" a classification row except in its bottom band; R7 replaces that (Q-210). A row's grip dims to nothing until hover only as a style (story 07).

</details>
