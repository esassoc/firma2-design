# 04 — Administrator edits a group's name, description, parent group and colour

Type: story
Epic: E-A Set up and arrange the classification tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-203
Revision: 1
Blocked by: 02, 03
Covers: SCR-9, STA-46, ACN-33, ACN-34, ACN-44, ACN-45, RUL-42, RUL-45
Sources: `/prototypes/workspace-settings/classifications/groups/<group>` (for example Forests & fuels, F1.2); spec #1, #5, #9, #20; Q-154, Q-182, Q-183, Q-203
Snapshot: not yet captured
Read with: `../epics/E-A-set-up-the-tree.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R9. Waiting: none. R3 relies on proposal Q-203 (a description shows under every group line), which story 02 builds on.

## Story

As the person who may change classifications, I want to change a group's name, description, parent group and colour on its own page, so that the tree is named and arranged the way the workspace thinks about its goals.

## Description

A group is added in the settings list with a name only (story 02). Its page in Workspace settings opens from its name in the list and has a section "Details" with Name, Description, Parent group and Color. A group's page holds nothing else of the group's contents: what it holds is arranged on the settings list (stories 07 to 09), and its removal is story 06. Name and description work as a classification's do (story 03: RUL-46, RUL-47, RUL-48), with the group's own message. To see it, open `/prototypes/workspace-settings/classifications/groups/` and choose Forests & fuels (F1.2) on the invented sample.

## Requirements

R1. A group's page has a section "Details" with five fields: "Name", "Description", "Parent group", "Color" and "Icon". Each saves by itself when the person leaves it or, for a choice, when they pick. There is no Save button. The page shows no lists of what the group holds.

R2. Name: a blank name is refused with "Enter a name."; a name another group already has is refused with "A group already has this name.", ignoring upper and lower case and spaces around it. A refused name is not saved and the saved name stands. A group's own name in other letters is not refused (relies on story 03, RUL-46). A classification may have the same name as the group (relies on story 03, R2, ACN-30).

R3. An accepted name is saved trimmed and shows at once as the page's title, its last crumb and the browser tab. Description is saved trimmed when the person leaves it and may be left empty (relies on story 03, R4, ACN-31). A group's description shows under its line, or under its heading at the top level, in the settings list (relies on story 02, RUL-89, proposed Q-203).

R4. Parent group: the choice offers "None" and every group that is not this group and not beneath it, each by its full path ("Practice area › Forests & fuels"). The current parent is selected: "None" for a top-level group. A group is never offered itself or any group inside it.

R5. Choosing a parent moves the group, with everything inside it, into that group, to the end of that group's groups; choosing "None" moves it to the top level, to the end of the top-level groups, where it becomes a section of its own in the settings list. The change saves at once, and the counts of the old and new parents follow.

R6. A group that is moved keeps its name, description, colour and contents.

R7. The crumbs at the top of the page carry the group's full, current path of groups above it, outermost first, each a link to that group's settings page: "Classifications › Practice area › Forests & fuels" for a group inside Practice area, "Classifications › Practice area" for Practice area itself. After a new parent is chosen the crumbs show the new path at once.

R8. Color: a colour control with a text entry beside it, saved when it is changed if it is a valid colour value. A value that is not valid is not saved and the colour stands. The colour is the group's swatch in the settings list, whether it is a section heading or a nested line.

R10. Icon: a group has no icon until one is chosen, and the "Icon" field works as a classification's does (relies on story 03, RUL-94): a shortlist and a search over the whole icon set, saved at once, and a "Remove icon" button that shows only while an icon is chosen and clears it, so the colour square leads the name again (decided, Q-235).

R9. Each field is saved on its own: a refused name does not stop a description, a parent or a colour from being saved (relies on story 03, RUL-47). A colour that is not a valid three- or six-digit value is not saved (relies on story 03, RUL-48). Every change is saved to the workspace and recorded with who and when (story 01, SR-6).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Adding a group — see story 02.
- Moving a group from its row, by menu or by dragging — see stories 08 and 09.
- Removing a group, and what a group that holds something is told — see story 06.
- Turning a group into a classification — see story 12.
- Member lists on a group's page — struck (Q-183).
- Who sees the "Edit group" button that leads here — see story 13.

## Needs to know from elsewhere

- A group's name is unique among all groups in the workspace, not only among its neighbours (Q-154); it may match a classification until one is converted — owned by story 02, R12.
- A group has no performance measures, goal targets or projects of its own; its figures add up what is beneath it — owned by story 02, R4, and E-B.
- A classification in a reading list takes its group's colour (spec #9) — owned by E-B.
- Name at most 100 characters, description at most 300 — owned by SR-9.

## Scenarios

**S1 — Rename shows everywhere on the page** (proves R2, R3)
- Given Ada, Administrator, opens the page of Forests & fuels
- When she changes Name to a name no group has and leaves the field
- Then the title, the last crumb and the tab show the new name, and the settings list shows it on the group's line

**S2 — A blank name is refused** (proves R2)
- Given the page of Forests & fuels
- When Ada empties Name and leaves the field
- Then "Enter a name." shows and the saved name is unchanged after a reload

**S3 — A taken group name is refused** (proves R2)
- Given the page of Forests & fuels
- When Ada types "plan GOAL " in Name and leaves the field
- Then "A group already has this name." shows and the saved name is unchanged

**S4 — A group may take a classification's name** (proves R2)
- Given the page of Forests & fuels
- When Ada types "Water quality" in Name and leaves the field
- Then no message shows and the name is saved (conversion of either is story 11 and 12)

**S5 — A group's description shows in the list** (proves R3)
- Given the page of Forests & fuels, a nested group
- When Ada types a sentence in Description and leaves the field
- Then the settings list shows it under the group's line, cut to two lines if long

**S6 — Parent group offers the right groups** (proves R4)
- Given the page of Practice area, which holds four groups
- When Ada opens Parent group
- Then "None" is listed and is selected; Plan goal is offered; Practice area and its four groups are not

**S7 — A nested group's parent is selected and its descendants are not offered** (proves R4)
- Given the page of Forests & fuels, inside Practice area
- When Ada opens Parent group
- Then "Practice area" is selected, "None" and "Plan goal" are offered, and Forests & fuels is not

**S8 — Moving a group under another** (proves R5, R6, R7)
- Given the page of Forests & fuels
- When Ada chooses "Plan goal" in Parent group
- Then the crumbs read "Classifications › Plan goal › Forests & fuels"; in the settings list Forests & fuels is the last line inside Plan goal with its three classifications; Plan goal says "10 classifications" and Practice area "9 classifications"

**S9 — Choosing "None" makes it a top-level section** (proves R5)
- Given the page of Forests & fuels
- When Ada chooses "None" in Parent group
- Then the settings list shows a third section, Forests & fuels, after Practice area, and the crumbs read "Classifications › Forests & fuels"

**S10 — The colour is saved and is the swatch; an invalid one is not** (proves R8)
- Given the page of Forests & fuels
- When Ada picks a new colour in Color and reloads, then types text that is not a colour into the entry beside Color and reloads again
- Then after the first reload Color shows it and the group's line carries a swatch of that colour; after the second it is unchanged

**S11 — An icon is chosen, kept and removed** (proves R10)
- Given the page of Forests & fuels, which has no icon
- When Ada opens Icon, searches, chooses an icon and reloads
- Then Icon shows the chosen icon; when she then presses "Remove icon" and reloads, no icon shows, "Remove icon" is gone and the colour square leads the name

**S12 — Fields save on their own** (proves R1, R9)
- Given the page of Forests & fuels
- When Ada enters a taken name, then a description, and leaves each field
- Then the name is refused and the description is saved

## UAT script

Preconditions: Ada, Administrator, is signed in; the test workspace holds F1.
Test data: F1.2 (Forests & fuels inside Practice area, with Forest thinning, Fuel breaks and Prescribed fire); F1 (Plan goal, 7 classifications); F2 (the count lines).
Reset: set Forests & fuels' Name, Description, Parent group (Practice area) and Color back to what you noted before step 1; then move it to the end of Practice area's groups if the order matters (story 07). Or restore the test workspace's saved tree to F1.

| # | Do this | You should see |
|---|---|---|
| 1 | Open Settings › Classifications and choose "Forests & fuels"; note its Color | A page titled Forests & fuels with a "Details" section: Name, Description, Parent group (Practice area), Color; crumbs "Classifications › Practice area › Forests & fuels"; no lists of what it holds |
| 2 | Empty Name and press Tab | "Enter a name." |
| 3 | Type "plan goal" and press Tab | "A group already has this name." |
| 4 | Type a name no group has and press Tab | No message; the title, the last crumb and the tab show the new name |
| 5 | Open Parent group | "None", "Plan goal" and the other groups of Practice area are offered, by full path; the group itself is not |
| 6 | Choose "Plan goal" | The crumbs read "Classifications › Plan goal › <new name>" |
| 7 | Open Settings › Classifications | The group is the last line inside Plan goal, with its three classifications; Plan goal says "10 classifications" |
| 8 | Return to its page, choose "None" in Parent group | The crumbs read "Classifications › <new name>"; the list shows it as a third section |
| 9a | Open Icon, search for a word and choose an icon, then press "Remove icon" | The control shows it with "Remove icon"; after pressing, the icon clears and the button goes |
| 9 | Pick another colour in Color and reload | The control shows it; the group's line carries a swatch of that colour |
| 10 | Put Name, Parent group and Color back as noted | The list is as before |

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-203 (proposed) — Does a nested group's description show under its line on the settings list?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | SCR-9 |
| R2 | shown | ACN-44 |
| R3 | shown; shown; proposed (Q-203) | ACN-44; ACN-45; relies on story 02, RUL-89 |
| R4 | shown | ACN-33 |
| R5 | shown | ACN-33 |
| R6 | shown | ACN-33 |
| R7 | shown; shown | STA-46; RUL-45 |
| R8 | shown; shown | ACN-34; RUL-42 |
| R9 | shown; decided, not built | ACN-34; SR-6 (standing) |
| R10 | decided (user, 2026-11-24, Q-235) | relies on story 03, RUL-94 |

- Prototype files: `src/pages/prototypes/workspace-settings/classifications/groups/[group].astro`; `src/components/settings/firma2-taxonomy-details.astro` (`kind="classificationGroup"`: name, description, `data-parent`, `data-color`); `src/lib/taxonomy-edits.ts` (`groupMoveTargets`, `groupOutline`, `groupAndDescendants`, `editEntry`); `src/lib/taxonomy-record.ts` (`pathCrumbs`).
- Data shapes: a group carries name, description, colour and the group it sits inside (empty at the top level). "None" stands for empty because the choice control has no empty value in the prototype.
- Do not copy: the member lists (classifications and groups) the prototype's group page still shows (struck, Q-183); the `draft` route; the build's static crumb path that the browser redraws.

</details>
