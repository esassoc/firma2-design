# 11 — Administrator turns a classification into a group, after being told what happens

Type: story
Epic: E-A Set up and arrange the classification tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-212, Q-213, Q-214
Revision: 1
Blocked by: 05, 08, 09
Covers: SCR-12, STA-34, STA-44, ACN-24, RUL-2, RUL-9, RUL-82, RUL-83, RUL-84, RUL-86, RUL-96
Sources: `/prototypes/workspace-settings/classifications`; spec #21, #25, #29; interview 2026-11-24, Q-161
Snapshot: not yet captured
Read with: `../epics/E-A-set-up-the-tree.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R12. Waiting: nothing; R2, R3, R5 and R7 rest on proposals (Q-212, Q-213, Q-214, Q-234, Q-235).

## Story

As the person who may change classifications, I want to turn a classification into a group, and be told what it will cost before it happens, so that I can start filing things beneath it without losing work by surprise.

## Description

A classification is one goal that projects are filed under; a group holds classifications and other groups and has no measures, targets or projects of its own. When a goal turns out to be a heading, the administrator converts it: from the "…" menu on its row, or by dragging it out of every group, since a classification is always in a group and the top level holds groups only. A classification nobody uses converts at once. One that projects use asks first and says what will happen; the person can stop or go on. To see it in the prototype, open `/prototypes/workspace-settings/classifications` with the tree in F1 and open the "…" menu of "Native planting".

## Requirements

R1. A classification's "…" menu (accessible name "Actions for <classification name>") has one item, "Convert to group".

R2. A classification that no project carries and that has no performance measures linked is converted at once, with no question. One that has projects or performance measures linked asks first (R3).

R3. A classification that is in use asks first, before anything changes. The question's heading is "Convert <name> to a group?", its message names every cost that applies, in this order, each as its own sentence: "<N> projects filed under it lose it." ("1 project filed under it loses it.") and "Its <N> goals and measure links are removed." ("Its performance measure stops tracking it."), and its buttons are "Convert" and "Cancel". A classification with no projects but with measures names only the measures. When a project would be left with no classification, the question also says how many projects are (R7). "In use" counts a project in any stage, published or not (relies on story 06, RUL-38).

R4. "Cancel", Escape, or closing the question changes nothing: the classification stays a classification, in its place, with its projects, measures and targets.

R5. When the conversion goes ahead (at once, or after "Convert"), the classification becomes a group of the same name, colour and description, inside the group it was in. It is open, holds nothing, and its line reads "0 classifications" with "Add" and "…". The group it left no longer counts it. The page announces "<name> is now a group." The new group joins the end of the groups of the group it stands in; "place" means that group, and Sort A to Z puts it in order.

R6. A converted classification's measure links are removed and its goal targets cleared: a group has neither. A performance measure that projects report toward stays on the pages that roll it up, with "No goal set"; what is lost is the goal and the link. (decided, Q-234)

R13. A converted classification keeps its icon, if it has one. (decided, Q-235)

R7. The projects that were filed under the converted classification no longer carry it. A project that carried only this one is left with no classification: that is allowed after the question, which says how many projects are left with none; the project stays valid and its page lets an editor file it again. (relies on `project-record`)

R8. A conversion is refused when a group already has the name, ignoring case and spaces at the ends. The name is checked before any question on both paths (menu and drop): the message "A group already has this name." shows under the row, nothing changes, and no question is asked first. The message goes away at the next change to the list.

R9. While a classification is dragged, a row appears above the top-level groups reading "Drop here to make it a group". It does not show while a group is dragged or when nothing is dragged. Held over it, the row is marked (a solid outline and a tint), and no insertion line shows.

R10. A classification dropped on that row, or sent with its grip menu's "Move to top level" (story 08), is moved out of every group, so it becomes a top-level group, added at the foot of the top-level groups. A classification is always in a group and the top level holds groups only, so it never stays a classification at the top level.

R11. A classification that is in use, moved out of every group, asks first as R3 does, with the heading "Make <name> a group?", the message beginning "Outside every group, a classification becomes a group. " followed by the costs, and the buttons "Make it a group" and "Cancel". One that is not in use becomes the group at once. A refusal (R8) comes first and applies here too.

R12. Declining that question, or a refusal, leaves the classification exactly where it was: in the group it was in, at its own place in that group's list, unchanged and with its projects, measures and targets.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Turning a group into a classification — see story 12.
- Removing a classification — see story 06; the grip menu's "Move to <group>" and the rest of the drag preview — see stories 08 and 09.
- Setting a group's name, description, colour or parent afterward — see story 04.
- What a project's own page shows once it has lost a classification, and the project's prompt to file it again — owned by `project-record`.

## Needs to know from elsewhere

- Names are unique among classifications and, separately, among groups: a group and a classification may share a name; two groups may not — owned by story 02.
- A group has no performance measures, targets or projects; its figures add up what is beneath it — owned by story 14 and story 21.
- A classification is "in use" when any project carries it, whether or not the project is published — owned by story 06 (RUL-38).
- Every conversion is recorded in the change log; a person who converts by mistake converts back, and the performance measures and targets are not restored — standing requirement SR-6.
- A "…" menu and the drag are reachable by keyboard through the grip menu — standing requirement SR-4.

## Scenarios

**S1 — Not in use: converted at once** (proves R1, R2, R5)
- Given the tree in F1 and a classification added inside Vegetation & wetlands that no project works toward (F7), with no measures linked
- When the person opens its "…" menu and chooses "Convert to group"
- Then no question is asked; it is now a group inside Vegetation & wetlands, open, reading "0 classifications"; the page announces "<name> is now a group."; Vegetation & wetlands reads "3 classifications"

**S2 — In use: the question names every cost** (proves R2, R3)
- Given the tree in F1
- When the person chooses "Convert to group" on "Native planting" (F7: 2 projects, 2 performance measures)
- Then a question titled "Convert Native planting to a group?" reads "2 projects filed under it lose it. Its 2 goals and measure links are removed." with the buttons "Convert" and "Cancel"; nothing has changed yet; for the F9 classification with measures linked and no project the question names only "Its <N> goals and measure links are removed." and no projects

**S3 — Cancel changes nothing** (proves R4)
- Given the question of S2 is open
- When the person presses "Cancel"
- Then "Native planting" is still a classification in Vegetation & wetlands, with 2 projects and 2 performance measures; the same after a reload

**S4 — Convert: what is kept and what goes** (proves R5, R6)
- Given the question of S2 is open
- When the person presses "Convert"
- Then a group "Native planting" stands in Vegetation & wetlands with the same colour and description, reading "0 classifications"; Vegetation & wetlands reads "2 classifications" and Practice area "11 classifications"; no measure link or goal target; its icon, if it had one, is kept remains on it

**S5b — Its icon is kept** (proves R13)
- Given a classification with an icon chosen (story 03) that is converted to a group
- When the conversion goes ahead
- Then the new group shows the same icon beside its name

**S5 — Projects lose it, and may be left with none** (proves R7)
- Given a project that carries only one classification, and the person chooses "Convert to group" on it (project record data, by kind)
- When the question is read and "Convert" is pressed, and the project's page is opened
- Then the question says 1 project is left with no classification; afterwards the project's page lists none, the project is otherwise unchanged, and an editor can file it again

**S6 — A group already has the name** (proves R8)
- Given the F9 group that shares a name with a classification, and that classification in use
- When the person chooses "Convert to group" on the classification "Water quality"
- Then no question is asked; "A group already has this name." shows under its row; the classification is unchanged; at the next change to the list the message is gone

**S7 — The drop row shows for a classification only** (proves R9)
- Given the tree in F1
- When the person starts dragging "Water quality", then drops it back and starts dragging the group "Forests & fuels"
- Then the row "Drop here to make it a group" showed above the top-level groups during the first drag and does not show during the second or when nothing is dragged

**S8 — Dropped on it, in use: asked, then a top-level group** (proves R10, R11)
- Given the tree in F1
- When the person drags "Native planting" onto "Drop here to make it a group" and releases
- Then a question titled "Make Native planting a group?" begins "Outside every group, a classification becomes a group. 2 projects filed under it lose it." with the buttons "Make it a group" and "Cancel"; on "Make it a group", "Native planting" is a group after "Practice area" at the top level with no classifications in it

**S9 — Move to top level, not in use: at once** (proves R10, R11)
- Given a classification no project works toward (F7), in Plan goal
- When the person chooses "Move to top level" on its grip menu
- Then it becomes a top-level group at once, with no question

**S10 — Declining the drop** (proves R12)
- Given the question of S8 is open
- When the person presses "Cancel"
- Then "Native planting" is still a classification in Vegetation & wetlands, still first in that group's list, with its projects and measures; no top-level group of that name exists

**S11 — Refused at the top level** (proves R8, R11)
- Given a top-level group named "Water quality" (story 02)
- When the person drops the classification "Water quality" on the drop row
- Then no question is asked, "A group already has this name." shows under its row and it stays a classification in Plan goal

## UAT script

Preconditions: signed in as Ada (an Administrator); the test workspace holds the tree in F1; a classification no project works toward exists inside Vegetation & wetlands (make one with story 02, call it what you like).
Test data: F1, F1.2, F7 (Native planting; "A classification the script adds").
Reset: restore the test workspace's saved tree (F1).

| # | Do this | You should see |
|---|---|---|
| 1 | Open Settings › Classifications. Open the "…" menu on the classification you added and choose "Convert to group". | No question. It is now a group inside Vegetation & wetlands, reading "0 classifications". |
| 2 | Open the "…" menu on "Native planting" and choose "Convert to group". | A question "Convert Native planting to a group?" saying "2 projects filed under it lose it. Its 2 goals and measure links are removed." |
| 3 | Press "Cancel". | Native planting is unchanged. |
| 4 | Repeat step 2 and press "Convert". | A group "Native planting" in Vegetation & wetlands, "0 classifications". Vegetation & wetlands has one fewer classification. |
| 5 | Using the F9 group that shares a name with a classification, open the "…" menu on that classification and choose "Convert to group". | "A group already has this name." under the row; nothing changed. |
| 6 | Start dragging "Salmon & steelhead recovery". | A row "Drop here to make it a group" appears above the top-level groups. Drop it back where it was. |
| 7 | Drag "Prescribed fire" onto that row and release. | A question "Make Prescribed fire a group?" starting "Outside every group, a classification becomes a group." |
| 8 | Press "Cancel". | "Prescribed fire" is still a classification inside Forests & fuels, in its old place. |
| 9 | Open the "…" menu of the F9 classification that has performance measures and no project; choose "Convert to group". | A question naming only its goals and measure links. Press "Cancel". |

Exception worth a client's attention: repeat step 7 and press "Make it a group". "Prescribed fire" becomes a top-level group after "Practice area", Forests & fuels reads "2 classifications", and the one project that was filed under it no longer lists it on its page.

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-212 (proposed) — Converting a classification that has performance measures linked but no projects: ask first?
- Q-213 (proposed) — Where does a converted row, and a kept row, stand in its new list?
- Q-214 (proposed) — A project left with no classification by a conversion.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | ACN-24 |
| R2 | decided; proposed (Q-212) | RUL-9; RUL-82 |
| R3 | decided; proposed (Q-212, Q-214) | RUL-9; SCR-12; RUL-82 |
| R4 | decided | RUL-9; SCR-12 |
| R5 | decided; proposed (Q-213) | RUL-9; ACN-24; RUL-83 |
| R6 | decided; decided (user, 2026-11-24, Q-234) | RUL-9; relies on story 05, RUL-93 |
| R13 | decided (user, 2026-11-24, Q-235) | RUL-96 |
| R7 | proposed (Q-214) | RUL-9 |
| R8 | shown | STA-44; RUL-84 |
| R9 | shown | STA-34 |
| R10 | decided | RUL-2; ACN-24 |
| R11 | decided; shown | RUL-9; RUL-2; RUL-84 |
| R12 | decided | RUL-86 |

- Prototype files: `src/components/settings/firma2-classification-roster.astro` (`toGroup`, `sort-change` handler, the drop row `outHost`, `refused`), `src/lib/taxonomy-edits.ts` (`convertToGroup`, `nameTaken`, `arrangeClassifications`), `src/components/shared/bcn-sortable-list.ts` (the empty-list placeholder as drop row).
- Data shapes: a classification has a name, description, colour, group and slug; the conversion creates a group of the same name, description, colour and parent and discards the classification.
- Do not copy: declining the drop question leaves the arrangement saved without the row, so the prototype puts the classification at the end of its old group; the built product restores its exact place (R12). The question's wording about targets is carried by "goals and measure links are removed"; do not add a separate sentence. The prototype's drop row is drawn from an empty linked list; any build that shows a drop target while a classification is dragged satisfies R9.

</details>
