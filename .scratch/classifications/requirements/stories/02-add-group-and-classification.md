# 02 — Administrator adds a group and a classification in place and sees them listed

Type: story
Epic: E-A Set up and arrange the classification tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-202, Q-203
Revision: 1
Blocked by: 01
Covers: OBJ-1, OBJ-2, SCR-7, STA-30, STA-31, STA-32, ACN-18, ACN-20, ACN-21, ACN-29, RUL-1, RUL-4, RUL-5, RUL-11, RUL-27, RUL-51, RUL-88, RUL-89
Sources: `/prototypes/workspace-settings/classifications` (the invented sample, F1); spec #1, #3, #4, #9, #18, #22, #25, #31; Q-154, Q-189, Q-190, Q-193, Q-202, Q-203
Snapshot: not yet captured
Read with: `../epics/E-A-set-up-the-tree.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R14. Waiting: none. R2 (description under every line) and R12 (a refused row is dropped, with a message) rest on proposals Q-203 and Q-202.

## Story

As the person who may change classifications, I want to add a group or a classification where it will sit and see it in the settings list at once, so that I can say what projects are filed under and build the tree one name at a time.

## Description

This is the walking skeleton of the epic: it shows the settings list, and the one way things get into it. Story 01 saves the tree. Every later story in the epic (edit, arrange, convert, remove) works on rows this story makes. An add takes only a name; description, colour, performance measures and goal targets are set afterwards on the record's own page (stories 03, 04, 05). To see it, open Workspace settings › Classifications at `/prototypes/workspace-settings/classifications` on the invented sample (F1).

## Requirements

R1. Workspace settings › Classifications lists the tree as one section per top-level group, in the saved order. A top-level group's section starts with its name as a heading, a swatch in the group's colour, and the group's description under it when it has one. Under the heading come column heads "Name", "Projects" and "Performance measures", and then what the group holds.

R2. Inside a group, its classifications come first and its groups after, each in the saved order. A group inside a group is a line of the same kind as a top-level one, one step further in, and holds its own contents the same way. A description shows under every group line and every classification row, cut to two lines; a nested group's line is no exception (proposed, Q-203).

R3. A classification's row shows its name, its description under the name when it has one, and two figures: "Projects" (how many projects carry it) and "Performance measures" (how many are linked to it). A classification with no measures shows 0, so setup is read down the Performance measures column.

R4. A group's line shows how many classifications are beneath it, at any depth: "1 classification", "3 classifications", "0 classifications". It shows no projects figure and no performance measures figure, because projects, measures and goal targets belong to classifications only. A group's count follows an add made anywhere beneath it.

R5. A group's name and a classification's name are links. A classification's name opens its page in Workspace settings (story 03); a group's name opens the group's page in Workspace settings (story 04).

R6. The page header's "Add group" opens an empty row at the foot of the list, where a new top-level group will sit. The top level holds groups only; the header offers no add for a classification.

R7. Each group's line has an "Add" menu named "Add to <group name>" with two choices, "Classification" and "Group". Each opens an empty row for that kind inside that group: a classification's row after the group's classifications and before its groups; a group's row after the group's groups. A group that is folded opens first (relies on story 10, RUL-28).

R8. An open add row is one field for the name, with the cursor in it. Its placeholder is "Classification name" or "Group name" and its accessible name is "Name of the new classification" or "Name of the new group". Only one add row is open at a time: opening another keeps the first one if it has a name, and drops it if it is empty or refused (R12).

R9. In an open add row: Enter keeps the row and opens the next empty row in the same place, so a list can be typed in one go; leaving the field keeps a row that has a name and drops one that is empty; Escape drops the row and saves nothing. A name of spaces only counts as empty.

R10. An add takes only a name. The new record is saved (story 01) with an empty description, no performance measures, no goal targets and, for a classification, 0 projects. A classification joins the group it was added in; a group joins the group it was added in, or the top level. It joins the end of its list (relies on story 07, RUL-7). Nothing else changes in the tree.

R11. A new group or classification is dealt a colour: the next of six, in turn, so groups or classifications added one after another differ. The list draws a swatch on a group's line, in the group's colour, and none on a classification's row. A classification's own colour is not shown in this list; it is used by the map and by charts, and can be changed on its page (story 03).

R12. A name is refused in the open row when another record of the same kind already has it, ignoring upper and lower case and spaces around it: "A classification already has this name." in a classification's row, "A group already has this name." in a group's. The row stays open with the message, nothing is saved, and Enter and leaving the field do not keep it. The message goes when the person types again. A classification and a group may have the same name; the two kinds are checked apart.

R12a. Leaving a refused row, by clicking elsewhere or by opening another add, drops it and says why once, to everyone including assistive technology: "Not added. A classification already has this name." or "Not added. A group already has this name." Escape drops a row silently. No refused row is left open, and nothing disappears without a word (proposed, Q-202).

R13. While the workspace has no groups, the list shows "No groups yet. Add one to start." with a button "Add group", which opens the same top-level row as the header's. The message is hidden while a row is open, comes back if that row is dropped empty, and goes for good once a group exists.

R14. An add shows in the list at once, in place, with the rest of the list unchanged. The group it was added in, and every group above it, count it.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Description, colour, group, performance measures and goal targets of a record — see stories 03, 04 and 05.
- Folding a group, and the remembered folds — see story 10.
- Order, moving, dragging and "Sort A to Z" — see stories 07, 08 and 09.
- Converting a classification and a group — see stories 11 and 12.
- Removing a record — see story 06.
- Who sees the controls on this page — see story 13.
- Add pages for a group or a classification — struck (Q-182).

## Needs to know from elsewhere

- Every add is saved with who made it and when, and a failed save returns the row and says "Couldn't save the change. Try again." — owned by story 01 and the standing requirements (SR-6, SR-7).
- A name is at most 100 characters; at the limit the field shows what is left and takes no more — owned by SR-9.
- A group's colour swatch and a classification's swatch in reading lists follow the group (spec #9) — owned by E-B.
- The count "Projects" for a classification comes from the projects that carry it — owned by `project-record`, `project-intake`.
- A new list starts with nothing sorted: a new thing joins the end and nothing sorts by itself — owned by story 07 (Q-190).

## Scenarios

**S1 — The list shows F1 as arranged** (proves R1, R2, R3, R4)
- Given the test workspace holds F1 and Ada, Administrator, opens Settings › Classifications
- When the page has loaded
- Then it shows two sections, Plan goal and Practice area, in that order; Plan goal holds seven classifications in the order of F1.1, each with "Projects" and "Performance measures" figures and its description under its name; a swatch on each group's line and none on a classification row; Plan goal's line says "7 classifications" and Practice area's says "12 classifications"; Invasive plant removal shows 0 under "Performance measures"; no group line shows a projects or performance measures figure

**S2 — A name opens the record's page** (proves R5)
- Given the same list
- When Ada opens "Water quality", and then, from the list, "Forests & fuels"
- Then the first opens a classification's page and the second a group's page, each titled with the name

**S3 — Add a group at the top level** (proves R6, R10, R11, R14)
- Given F1
- When Ada presses "Add group" in the page header, types a name no group has, and presses Enter
- Then a new section with that name appears after Practice area, saying "0 classifications", with a swatch in a colour no other top-level group has, and a new empty row is open under it

**S4 — Add a classification inside a group** (proves R7, R8, R9, R10, R14)
- Given F1
- When Ada opens "Add to Plan goal", chooses "Classification", types a name no classification has and leaves the field by clicking elsewhere
- Then the row was open with the cursor in a field with placeholder "Classification name"; after leaving, the name is the eighth classification of Plan goal, with 0 under "Projects" and 0 under "Performance measures"; Plan goal says "8 classifications"

**S5 — Add a group inside a group** (proves R2, R7, R14)
- Given F1
- When Ada opens "Add to Forests & fuels", chooses "Group" and keeps a new name with Enter then Escape
- Then the group sits after Prescribed fire as a nested line with "0 classifications", and the empty row that Enter opened is gone

**S6 — Counts rise through the whole branch** (proves R4, R14)
- Given Ada added a classification to Forests & fuels (S4's kind)
- When she reads the lines
- Then Forests & fuels says "4 classifications" and Practice area says "13 classifications"; Plan goal still says "7 classifications"

**S7 — Enter types a list in one go** (proves R9)
- Given an open classification row inside Plan goal
- When Ada types a name, presses Enter, types another name, presses Enter and presses Escape
- Then both are listed in that order and no empty row remains

**S8 — Empty and cancelled rows leave nothing** (proves R8, R9)
- Given Ada opens "Add group" and types nothing
- When she leaves the field, and then opens it again, types spaces only and presses Escape
- Then no group has been added either time

**S9 — A taken name is refused in the row** (proves R12)
- Given F1
- When Ada opens "Add to Plan goal", chooses "Classification", types "water QUALITY " (spaces around it) and presses Enter
- Then "A classification already has this name." shows in the row, the row stays open, and the list has no new classification; typing again clears the message

**S13 — Leaving a refused row drops it and says why** (proves R12a)
- Given a refused row, as in S9, with the message showing
- When Ada clicks elsewhere on the page
- Then the row is gone, nothing was added, and "Not added. A classification already has this name." is shown once and announced; pressing Escape in a refused row instead drops it with no message

**S10 — The same name twice in one sitting is refused** (proves R12)
- Given Ada keeps a new group name with Enter
- When she types the same name in the next open row and presses Enter
- Then "A group already has this name." shows and only one group of that name is listed

**S11 — A classification and a group may share a name** (proves R12)
- Given F1 (F9: a group that shares a name with a classification)
- When Ada adds a group named "Water quality"
- Then it is kept, because only a classification has that name

**S12 — Nothing yet** (proves R13)
- Given a workspace with no groups
- When Ada opens Settings › Classifications, presses "Add group" beside "No groups yet. Add one to start.", and then presses Escape in the open row
- Then the message is hidden while the row is open and shown again after Escape

## UAT script

Preconditions: Ada, Administrator, is signed in; the test workspace holds F1. The first-run steps (12 and 13) need a workspace with no groups: F9's empty workspace, used once.
Test data: F1, F1.1, F1.2; F2 (the count lines); F7 ("A group the script adds").
Reset: remove each record the script added with story 06 (a classification first, then the group), or restore the test workspace's saved tree to F1.

| # | Do this | You should see |
|---|---|---|
| 1 | Open Workspace settings › Classifications | Two sections, Plan goal and Practice area; "7 classifications" and "12 classifications" |
| 2 | Under "Performance measures", read Invasive plant removal | 0 |
| 3 | Press "Add group" in the page header | An empty row at the foot of the list, the cursor in its field "Group name" |
| 4 | Type a name no group has and press Enter | A section with that name, "0 classifications", and a new empty row open |
| 5 | Press Escape | The empty row goes; the new section stays |
| 6 | Open "Add to Plan goal" and choose "Classification" | An empty row after the seven classifications, the cursor in its field "Classification name" |
| 7 | Type "water quality" and press Enter | "A classification already has this name." in the row; nothing added |
| 8 | Click elsewhere on the page | The row goes; "Not added. A classification already has this name." is shown once; nothing was added |
| 9 | Open "Add to Plan goal", choose "Classification", type a name no classification has and press Enter | The classification is listed as the eighth, with 0 and 0; Plan goal says "8 classifications"; a new empty row is open |
| 10 | Click elsewhere on the page | The empty row goes; the new classification stays |
| 11 | Close the browser, reopen Settings › Classifications | Everything added is still listed |
| 12 | In the empty workspace, open Settings › Classifications | "No groups yet. Add one to start." and "Add group" |
| 13 | Press that "Add group" | A group row opens and the message is hidden |

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-202 (proposed) — A refused add row: what happens when the person clicks away or opens another add?
- Q-203 (proposed) — Does a nested group's description show under its line on the settings list?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | SCR-7 |
| R2 | shown; proposed (Q-203) | SCR-7; RUL-89 |
| R3 | shown; decided | OBJ-1; RUL-27 |
| R4 | decided; shown | RUL-1; OBJ-2 |
| R5 | shown | ACN-29 |
| R6 | shown | ACN-18 |
| R7 | shown | ACN-20 |
| R8 | shown | STA-31 |
| R9 | shown | ACN-21 |
| R10 | decided; shown; shown | RUL-11; OBJ-1; OBJ-2 |
| R11 | shown; shown | RUL-5; RUL-88 |
| R12 | shown; decided; shown | STA-32; RUL-4; RUL-51 |
| R12a | proposed (Q-202) | STA-32 |
| R13 | decided, not built | STA-30 |
| R14 | shown | SCR-7 |

- Prototype files: `src/components/settings/firma2-classification-roster.astro` (the list, `addRow`, `addMenu`, `keep`, `paint`, the blank state); `src/pages/prototypes/workspace-settings/classifications.astro` (page header: "Sort A to Z" and "Add group"); `src/lib/taxonomy-edits.ts` (`addEntry`, `nameTaken`, `NEW_COLORS`, `classificationsUnder`); `src/data/firma2-classifications.ts`.
- Data shapes: classification = name, description, colour, group, measures with targets, counts; group = name, description, colour, parent (none at the top level), contents. The add passes name, empty description and the group it was added in.
- Where the prototype and the written rule differ: the empty state in the prototype reads "No classifications yet" with "Add a group, or a classification on its own." (decided otherwise, Q-193); R13 follows Q-193. The page header's "Add group" is a link to an add page when no script runs; the add pages are struck (Q-182).
- Do not copy: browser storage; the draft route a new record opens on; the "a classification on its own" wording in the empty state.

</details>
