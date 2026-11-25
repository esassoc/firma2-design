# 03 — Administrator edits a classification's name, description, group and colour

Type: story
Epic: E-A Set up and arrange the classification tree
Release: first
Status: needs-triage
Revision: 1
Blocked by: 02
Covers: SCR-8, STA-42, ACN-30, ACN-31, ACN-32, ACN-43, RUL-43, RUL-44, RUL-46, RUL-47, RUL-48, RUL-49, RUL-94
Sources: `/prototypes/workspace-settings/classifications/<classification>` (for example Water quality, F1); spec #9, #25; Q-154, Q-195
Snapshot: not yet captured
Read with: `../epics/E-A-set-up-the-tree.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R9. Waiting: none. R6 and R7 can be seen on the Details section only; the colour shows elsewhere through the map and charts (other features).

## Story

As the person who may change classifications, I want to change a classification's name, description, group and colour on its own page, so that the tree says what I mean and each goal sits where it belongs.

## Description

An add (story 02) takes only a name. This story is where that record is described: its page in Workspace settings opens from its name in the list. The page has a section "Details" with the fields Name, Description, Group and Color. Its performance measures and goal targets are story 05, and removing it is story 06; both sit on the same page and are not described here. To see it, open `/prototypes/workspace-settings/classifications/` and choose Water quality (F1.1) on the invented sample.

## Requirements

R1. A classification's page has a section "Details" with five fields: "Name", "Description", "Group", "Color" and "Icon". Each field saves by itself when the person leaves it or, for a choice, when they pick. There is no Save button.

R2. Name: a name that is blank is refused with "Enter a name."; a name another classification already has is refused with "A classification already has this name.", ignoring upper and lower case and spaces around it. A refused name is not saved, the saved name stands, and the message sits under the field until the person types again. The classification's own name, in other letters (for example "water quality" for "Water quality"), is not refused.

R3. A name that is accepted is saved trimmed, and the page shows it everywhere at once: the title, the last crumb and the browser tab. The settings list shows the new name the next time it is opened (story 02).

R4. Description: saved trimmed when the person leaves the field, and may be left empty. A classification with a description shows it under its name in the settings list; with none, the row shows no description line.

R5. Group: the choice offers every group in the tree, each by its full path ("Practice area › Forests & fuels", and a top-level group by its name alone), with the classification's current group selected. A classification is always in a group, so there is no "None". Choosing another group moves the classification there, to the end of that group's classifications, and saves at once. Its performance measures, goal targets and projects do not change.

R6. The crumbs at the top of the page carry the classification's full, current path of groups, outermost first, each group a link to that group's settings page: "Classifications › Practice area › Forests & fuels › Prescribed fire". After a new Group is chosen the crumbs show the new path at once.

R7. Color: a colour control with a text entry beside it, the same as a group's (story 04). A colour is saved when it is changed, if it is a valid colour value; a value that is not valid is not saved and the colour stands. Nothing in the settings list changes with it: the list shows a classification under its group's colour. The map and charts use the classification's own colour to tell the classifications of one group apart (other features).

R10. Icon: a classification has no icon until one is chosen. The "Icon" field is a picker that offers a shortlist and a search over the whole icon set; choosing one saves at once, like the other fields. A button "Remove icon" shows only while an icon is chosen; pressing it clears the icon, hides the button, and the colour square leads the name again (decided, Q-235).

R8. Each field is saved on its own. A refused name does not stop a description, a group or a colour from being saved, and none of them waits for the others.

R9. Every change here is a change to the tree: it is saved to the workspace (story 01) and recorded with who and when (SR-6).

Standing requirements apply: see `../standing-requirements.md` (names at most 100 characters, descriptions at most 300; a failed save returns the field and says "Couldn't save the change. Try again.").

## Out of scope

- Adding a classification — see story 02.
- Linking performance measures and setting goal targets, which sit on the same page — see story 05.
- Removing the classification — see story 06.
- Moving a row from the list, by its menu or by dragging — see stories 08 and 09.
- Turning it into a group — see story 11.
- Who sees the "Edit classification" button that leads here — see story 13.

## Needs to know from elsewhere

- A name is unique among classifications and among groups separately; the two may match until one is converted — owned by story 02, R12, and story 11.
- Where a classification is listed under its group, its swatch is that group's colour, not its own (spec #9) — owned by E-B.
- A group's settings page holds a group's own fields — owned by story 04.
- Settings pages open only to people the "Manage classifications" setting lets in — owned by story 13.

## Scenarios

**S1 — Rename shows everywhere on the page** (proves R2, R3)
- Given Ada, Administrator, opens the page of Water quality (F1.1)
- When she changes Name to a name no classification has and leaves the field
- Then the title, the last crumb and the tab show the new name, and the settings list shows it after a reload

**S2 — A blank name is refused** (proves R2)
- Given the page of Water quality
- When Ada empties Name and leaves the field
- Then "Enter a name." shows under the field and, after a reload, the name is still Water quality

**S3 — A taken name is refused, ignoring case and spaces** (proves R2)
- Given the page of Water quality
- When Ada types " flood RISK reduction" in Name and leaves the field
- Then "A classification already has this name." shows and the saved name is unchanged

**S4 — Changing only the letters of its own name is allowed** (proves R2)
- Given the page of Water quality
- When Ada types "water quality" in Name and leaves the field
- Then no message shows and the title reads "water quality"

**S5 — Description is saved, and can be cleared** (proves R4)
- Given the page of Water quality
- When Ada types "  A line of her own.  " in Description and leaves the field, and then later empties it and leaves again
- Then after the first the settings list shows "A line of her own." under the name; after the second the row shows no description line

**S6 — Choosing another group moves it** (proves R5, R6)
- Given the page of Water quality, in Plan goal
- When Ada opens Group, sees every group by its full path, and chooses "Practice area › Forests & fuels"
- Then the crumbs read "Classifications › Practice area › Forests & fuels › Water quality", each group a link to its settings page (opening "Forests & fuels" there opens the group's page), and the settings list shows Water quality as the fourth classification of Forests & fuels and no longer in Plan goal

**S7 — Moving keeps its measures** (proves R5)
- Given the page of Salmon & steelhead recovery, which has four performance measures (F2)
- When Ada chooses another group in Group
- Then its page still shows four performance measures and the settings list shows 4 under "Performance measures" for the row

**S8 — Every group is offered, and there is no empty choice** (proves R5)
- Given F1 with an empty group inside a group added (F9)
- When Ada opens the Group choice
- Then every group is listed by its path, the empty group among them, and there is no "None"

**S9 — The colour is saved, and an invalid one is not** (proves R7)
- Given the page of Water quality
- When Ada picks a new colour in Color and reloads, then types text that is not a colour into the entry beside Color and reloads again
- Then after the first reload Color shows the new colour; after the second it is unchanged

**S11 — Fields save on their own** (proves R1, R8)
- Given the page of Water quality
- When Ada enters a taken name, then a description, and leaves each field
- Then the name is refused and the description is saved

**S12 — An icon is chosen, found by search, kept and removed** (proves R10)
- Given the page of Water quality, which has no icon
- When Ada opens Icon, types a word in the search, chooses an icon from the results and reloads the page
- Then the shortlist and the search were offered, and after the reload Icon shows the chosen icon and "Remove icon" is shown; when she then presses "Remove icon" and reloads, no icon shows, "Remove icon" is gone and the colour square leads the name

**S13 — A change is recorded with who and when** (proves R9)
- Given Ada renames Water quality
- When a developer reads the saved record of that change
- Then it names Ada and the time of the change

## UAT script

Preconditions: Ada, Administrator, is signed in; the test workspace holds F1.
Test data: F1.1 (Water quality, Flood risk reduction); F1.2 (Forests & fuels, Prescribed fire); F2 (Salmon & steelhead recovery has 4 performance measures).
Reset: set Water quality's Name, Description, Group (Plan goal) and Color back to what you saw at the start; or restore the test workspace's saved tree to F1. Note them before step 1.

| # | Do this | You should see |
|---|---|---|
| 1 | Open Settings › Classifications and choose "Water quality"; note its Color | A page titled Water quality with a "Details" section: Name, Description, Group (Plan goal), Color; crumbs "Classifications › Plan goal › Water quality" |
| 2 | Empty Name and press Tab | "Enter a name." under the field |
| 3 | Type "flood risk reduction" and press Tab | "A classification already has this name." |
| 4 | Type a name no classification has and press Tab | No message; the title, the last crumb and the tab show the new name |
| 5 | Type a sentence in Description and press Tab | No message |
| 6 | Open Group and choose "Practice area › Forests & fuels" | The crumbs read "Classifications › Practice area › Forests & fuels › <new name>" |
| 7 | Pick another colour in Color | The control shows it |
| 7a | Open Icon, search for a word and choose an icon | The control shows it, and "Remove icon" appears |
| 7b | Press "Remove icon" | The icon clears and "Remove icon" goes |
| 8 | Reload the page | Name, Description, Group and Color are as you left them |
| 9 | Open Settings › Classifications | The classification is the fourth under Forests & fuels with your sentence under its name; Plan goal says "6 classifications" |
| 10 | Open the page again and put Name, Description, Group and Color back as noted | The list is as before |

## Open questions

None.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | SCR-8 |
| R2 | shown; shown | ACN-30; RUL-46 |
| R3 | shown | ACN-30 |
| R4 | shown | ACN-31 |
| R5 | shown; shown | ACN-32; RUL-49 |
| R6 | shown; shown | STA-42; RUL-44 |
| R7 | decided, not built; decided, not built; shown | ACN-43; RUL-43; RUL-48 |
| R8 | shown | RUL-47 |
| R10 | decided (user, 2026-11-24, Q-235) | RUL-94 |
| R9 | decided, not built | SR-6 (standing) |

- Prototype files: `src/pages/prototypes/workspace-settings/classifications/[classification].astro`; `src/components/settings/firma2-taxonomy-details.astro` (the fields, validation messages, crumbs); `src/lib/taxonomy-record.ts` (`retitle`, `pathCrumbs`); `src/lib/taxonomy-edits.ts` (`editEntry`, `nameTaken`, `groupOutline`).
- Data shapes: a classification carries name, description, colour and group; its measures and targets hang on its identity, not on its group.
- The prototype has no Color field on a classification's page; R7 follows Q-195 and the group's control (story 04).
- Do not copy: the `draft` route a new record opens on; the build's static crumb path that the browser redraws; the group's member lists that sit on the group's page.

</details>
