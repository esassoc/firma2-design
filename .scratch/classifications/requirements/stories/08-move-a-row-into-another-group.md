# 08 — Administrator moves rows into other groups from the grip menu

Type: story
Epic: E-A Set up and arrange the classification tree
Release: first
Status: needs-triage
Revision: 1
Blocked by: 02, 10
Covers: ACN-42, RUL-3, RUL-13, RUL-29, RUL-50, RUL-90
Sources: `/prototypes/workspace-settings/classifications` (a row's grip menu); spec #19, #20, #25; settings crumbs on each record's page
Snapshot: not yet captured
Read with: `../epics/E-A-set-up-the-tree.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R9.

## Story

As an administrator, I want to move a classification into another group, or a group into another group or to the top level, from its grip menu, so that the tree matches how the workspace thinks about its work without my having to drag.

## Description

The tree is free: a group may hold groups and classifications together, and a group may go under any other group, or to the top level, at any depth, as long as it does not go inside itself. The grip's menu (story 07 gives its four order moves) lists below them one "Move to <group>" for every place the row may go. Dragging does the same (story 09); the menu is the way that needs no dragging. See it on the prototype at Workspace settings › Classifications with the tree of F1: open the grip menu of "Fuel breaks" (in Forests & fuels), or of the group "Forests & fuels".

## Requirements

R1. Below the four order moves and a divider, a row's grip menu lists "Move to <group>" for every group the row may go into, in the order the groups appear on the page. For a classification that is every group except the one it is in. For a group it is every group except the one it is in, itself, and the groups beneath it, and "Move to top level" first, unless it is already at the top level.

R2. A group is never offered itself or a group beneath it, at any depth, whatever the tree looks like at that moment. The tree has no limit on depth and no rule about what a group holds: a group may hold classifications and groups together.

R3. Choosing "Move to <group>" puts the row at the end of that group's classifications (for a classification) or at the end of that group's groups (for a group), at once. Inside the group, classifications are still listed before groups (story 07).

R4. Choosing "Move to top level" on a group makes it a top-level group, shown as a section after the other top-level groups, and everything it holds goes with it.

R5. A move saves at once, announces "<name> moved to <group>, <n> of <total>." (the group's own name, or "Top level"; the place is among that group's classifications or groups) and returns keyboard focus to the moved row's grip after the list is redrawn.

R6. A move changes only the row's place; a moved group joins the end of its new parent's groups. A classification keeps its name, description, colour, projects, performance measures and goal targets; a group keeps its name, description, colour and everything it holds. The classification counts on the old and the new groups' lines, and on every group above them, change to match.

R7. After a move, the row's own settings page shows the full path of groups in its crumbs, outermost first, each a link to that group's page, then the row's name: "Classifications › Plan goal › Prescribed fire". A group's crumbs show the groups above it, not itself as a link.

R8. A name never collides in a move: names are unique among classifications and among groups (RUL-4), and a move does not rename anything.

R9. A folded group still takes a row sent to it with "Move to <group>": the row joins the end of its list and the group stays folded.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- "Move to top level" on a classification, which makes it a group and asks first when it is in use — see story 11. A classification's menu does not offer it until that story ships.
- Dragging a row, and the line and marking shown for where it would land — see story 09.
- Moving up, down, to the top or bottom, and sorting — see story 07.
- Choosing a new group from a record's own page (the "Group" and "Parent group" choices) — see story 03 and story 04.
- Folding and opening a group, and remembering which are folded — see story 10.
- Turning a group into a classification when it is moved — see story 12 (it is a conversion, not a move).

## Needs to know from elsewhere

- A classification is always in a group; a classification sent out of every group becomes a group (spec #25, story 11), and the top level holds groups only.
- Folding is story 10; this story only needs a folded group to take a row.
- The crumbs follow a change made on a record's own page at once (stories 03 and 04); this story proves the new path shows when the record is opened after a move.
- Each move is written to the change log with who and when (SR-6); a failed save puts the row back and shows "Couldn't save the change. Try again." (SR-7).

## Scenarios

**S1 — Move a classification into another group** (proves R1, R3, R5, R6)
- Given the tree of F1 with "Public access & recreation" in Plan goal (F1.1)
- When the administrator opens its grip menu and chooses "Move to Vegetation & wetlands"
- Then it is the last of that group's classifications, after "Meadow & marsh rewetting"; the page announces "Public access & recreation moved to Vegetation & wetlands, 4 of 4."; focus is on its grip; Plan goal's line reads "6 classifications" and Vegetation & wetlands "4 classifications"

**S2 — What a classification may go to** (proves R1)
- Given "Fuel breaks" in Forests & fuels (F1.2)
- When the administrator opens its grip menu
- Then, after the four order moves, it lists "Move to Plan goal", "Move to Practice area", "Move to Channels & fish passage", "Move to Vegetation & wetlands" and "Move to Runoff & groundwater", and does not list "Move to Forests & fuels"

**S3 — What a group may go to** (proves R1, R2)
- Given "Forests & fuels", inside Practice area
- When the administrator opens its grip menu
- Then it lists "Move to top level", "Move to Plan goal", "Move to Channels & fish passage", "Move to Vegetation & wetlands" and "Move to Runoff & groundwater"; it does not list "Move to Practice area" (where it is) or "Move to Forests & fuels" (itself)

**S4 — A top-level group goes only under another** (proves R1, R2)
- Given "Practice area", at the top level
- When the administrator opens its grip menu
- Then the only move to a group is "Move to Plan goal": no "Move to top level", not itself, and none of the four groups inside it

**S5 — A group under a group that holds classifications** (proves R2, R3)
- Given "Forests & fuels" and "Plan goal", which holds 7 classifications
- When the administrator chooses "Move to Plan goal" on "Forests & fuels"
- Then Plan goal holds its 7 classifications and then the group "Forests & fuels" with its 3 classifications; Plan goal's line reads "10 classifications" and Practice area's "9 classifications"

**S6 — A group to the top level** (proves R4, R5)
- Given "Forests & fuels" inside Practice area
- When the administrator chooses "Move to top level"
- Then "Forests & fuels" is a top-level section after "Practice area", still holding "Forest thinning", "Fuel breaks" and "Prescribed fire"; the page announces "Forests & fuels moved to Top level, 3 of 3."

**S7 — Nothing limits the depth** (proves R2)
- Given "Channels & fish passage" and "Forests & fuels", both inside Practice area
- When the administrator moves "Channels & fish passage" to "Forests & fuels", and then opens the grip menu of "Forests & fuels"
- Then "Channels & fish passage" now sits inside it, three levels down, and "Forests & fuels" does not offer "Move to Channels & fish passage"

**S8 — A move keeps what the row is** (proves R6)
- Given "Native planting" in Vegetation & wetlands, showing 2 projects and 2 performance measures
- When the administrator moves it to "Plan goal"
- Then its row in Plan goal still shows its name, description, 2 projects and 2 performance measures

**S9 — The crumbs show the new path** (proves R7)
- Given "Prescribed fire" moved to Plan goal, and "Forests & fuels" moved to Plan goal
- When the administrator opens each record's settings page
- Then the crumbs read "Classifications › Plan goal › Prescribed fire" and "Classifications › Plan goal › Forests & fuels", each group a link to that group's page

**S10 — Saved and kept** (proves R3, R5)
- Given the move of S1
- When the page is opened again
- Then "Public access & recreation" is still in Vegetation & wetlands, last

**S11 — A folded group takes the row** (proves R9)
- Given "Vegetation & wetlands" folded (story 10)
- When the administrator moves "Public access & recreation" to it from the grip menu
- Then the group stays folded, and when opened its classifications end with "Public access & recreation"

**S12 — A move renames nothing** (proves R8)
- Given "Native planting" in Vegetation & wetlands and no other classification of that name
- When the administrator moves it to "Plan goal"
- Then it keeps the name "Native planting" and no name error or rename appears

## UAT script

Preconditions: Ada (Administrator, F5) is signed in. The tree is F1.
Test data: F1.1, F1.2; "Public access & recreation", "Fuel breaks", "Forests & fuels", "Practice area", "Native planting" (F7).
Reset: restore the test workspace's saved tree (F1), or move each row back with the same menu.

| # | Do this | You should see |
|---|---|---|
| 1 | Open Workspace settings › Classifications, point at "Public access & recreation" and click its grip | A menu: the four order moves, a divider, then "Move to <group>" items; not "Move to Plan goal" |
| 2 | Choose "Move to Vegetation & wetlands" | The row is gone from Plan goal and is last in Vegetation & wetlands; Plan goal says "6 classifications"; focus is on the row's grip |
| 3 | Reload | The row is still in Vegetation & wetlands |
| 4 | Open the grip menu of "Forests & fuels" | "Move to top level", "Move to Plan goal", "Move to Channels & fish passage", "Move to Vegetation & wetlands", "Move to Runoff & groundwater"; no "Move to Practice area", no "Move to Forests & fuels" |
| 5 | Choose "Move to Plan goal" | "Forests & fuels" is inside Plan goal, after its classifications, holding its three |
| 6 | Select "Prescribed fire" | Its settings page, crumbs "Classifications › Plan goal › Forests & fuels › Prescribed fire" |
| 7 | Go back; open the grip menu of "Forests & fuels" and choose "Move to top level" | "Forests & fuels" is a section of its own after "Practice area" |
| 8 | Open the grip menu of "Practice area" | The only move to a group is "Move to Plan goal" |
| 9 | Open the grip menu of "Fuel breaks" | No "Move to Forests & fuels" among the groups listed; no "Move to top level" (story 11) |
| 9a | Fold "Vegetation & wetlands", then move "Fuel breaks" to it | The group stays folded; opened, it ends with "Fuel breaks" |
| 10 | Move "Native planting" to "Plan goal" | Its row still shows 2 projects and 2 performance measures |

## Open questions

None.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | ACN-42 |
| R2 | decided; shown | RUL-3; RUL-13 |
| R3 | shown | ACN-42 |
| R4 | shown | ACN-42 |
| R5 | shown | RUL-13 |
| R6 | shown | RUL-50 |
| R7 | shown | RUL-29 |
| R8 | decided | RUL-3 |
| R9 | decided | RUL-90 |

- Prototype files: `src/components/shared/bcn-sortable-list.ts` (the "Move to" items from the lists linked by `group`; `refuse`; the announcement and focus return), `src/components/settings/firma2-classification-roster.astro` (one list of classifications and one of groups per group, the top-level lists, how the arrangement is saved), `src/lib/taxonomy-edits.ts` (`arrangeClassifications`, `groupMoveTargets`, `groupTrail`), `src/lib/taxonomy-record.ts` (`pathCrumbs`), `src/components/settings/firma2-taxonomy-details.astro` (where the crumbs are drawn).
- Data shapes: a classification or group has the group it is in (empty for the top level); each group has two ordered lists, its groups and its classifications; a move rewrites the group and the lists' order.
- Behavior read from the code: the menu names each destination by the group's own name, not its path; a group's own list is not offered to it and the lists of itself and of groups beneath it are refused; the moved row joins the end.
- Do not copy: browser storage of the arrangement; the draft routes a record added in the browser opens on; the Classifications page and a group's reading page drawn from the original tree (they must show the moved row); the `local-` prefix on identifiers.

</details>
