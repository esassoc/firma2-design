# 41 — A Contributor's Undo takes back every kind of change the import added

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-72, Q-75, Q-137, Q-138, Q-179
Revision: 1
Blocked by: 15, 17, 18, 23, 84
Covers: RUL-22, RUL-186, RUL-187, RUL-402, RUL-403, RUL-404, RUL-405
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement`; spec #18, #42
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R3, each once the story that adds its kind of change is built (15, 17, 18) and story 84 words the toasts, against the recorded samples `deer-creek-all-kinds-2025.pdf` and `deer-creek-timeline-update-2026.pdf`. Waiting: the last sentence of R3 (a value also sent to a GIS system) on `gis-data-sources`, which is not built; it has no scenario here.

## Story

As a Contributor, I want "Undo" to take back everything the import added, whatever kind of change it was, so that taking an import back leaves the project as it would be had the import never been added.

## Description

Story 23 puts "Undo" on the toast and takes back performance measure entries; story 84 states what "Undo" does when the record has moved since. Epic B lets an import also set Key facts fields and add funding sources and contacts. This story extends "Undo" to those kinds, on the same rule: "Undo" takes back what that one import added and is still as the import left it, and nothing else. There is no document to take back: the file was never kept (spec #42), so the requirement that dropped it (R4) is gone and its number is not reused. One thing here reverses the prototype: a Key facts field edited by hand after the import keeps the hand edit. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement`, after adding the sample funder report.

## Requirements

R1. "Undo" takes back everything that one import added and that is still as the import left it, of every kind, and nothing that a person or another import put on the record: its performance measure entries (story 23), what R2 and R3 name, and the change history row (story 23, R7). Each section of the project page follows without a reload. It is all or nothing across the kinds, and the toasts, the failure, the publish and the lost right to edit are story 84's (R3 to R10), which hold for every kind of change.

R2. Each funding source and each contact the import added leaves the project. One that was edited by hand since the import (story 81) stays, as the person's own row, and loses its "From `<document name>`" line, because its import is gone; it counts as kept on the toast. One already removed by hand is passed over. A funding source or contact the record held before the import, which the import therefore did not add (story 17, R7 and R13; story 18, R6), stays. "Total from all sources" goes with the last row an import added (story 17, R11): a row that stayed and lost its line no longer counts as one. A funding source row that two imports touched is story 86's.

R3. After "Undo", each Key facts field the import set holds the value it would hold had that import never been added: the value of the latest change that remains, whether a later import's or a hand edit's, and when none remains, the value from before the earliest import that is now gone. So a field edited by hand since the import keeps the hand edit, and counts as kept on the toast; a field a later import has set keeps the later value, and the earlier import's change counts as removed; and two imports of one field, both taken back in either order, leave the field as it was before both. A value that was also sent to a GIS system is taken back as any other edit to that field would be, and the earlier value is sent the same way.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- "Undo" on the toast, how long it lasts, the toast "`<N>` changes removed", and the import's row leaving the change history — story 23.
- The toasts when something stayed or nothing could be taken back, the failure, a publish since, the right to edit lost — story 84.
- A funding source row whose amount an import changed, or that two imports touched, and its "Undo" — story 86.
- A review row for a field whose import was taken back — story 85.
- Imported changes leaving the review — `publish-review`.
- Reverting one imported change in the review — `publish-review`, build 2.

## Needs to know from elsewhere

- The toast carries "Undo"; pressing it takes the import back with no confirmation, and it is offered once, on the toast only — owned by story 23.
- "Undo" removes only what is still as the import left it; the toast reads "`<N>` changes removed. `<M>` you changed since were kept." when something stayed; nothing is taken back once any of the import's changes is published — owned by story 84 (R1, R3, R7).
- An import can set a Key facts field, and when two imports set one field the later value stands — owned by story 15.
- An import can add a funding source — owned by story 17 (and story 75, when its organization had to be picked). Its row on the project page, its "From `<document name>`" line, and "Total from all sources", which shows only while the table holds a row an import added — owned by story 17 (R9, R11).
- An import can add a contact, and one the project's Contacts already hold is not proposed again — owned by story 18 (R6).
- Anyone who can edit the project can edit or remove a funding source row and a contact row, whoever added it — owned by story 81. Editing a Key facts field by hand — owned by `project-record`.
- Each import records, for every change, what it put on the record — owned by story 22 (R2) and, for each kind, the story that adds it.
- How an edit to a field is sent to a GIS system — owned by `gis-data-sources` (not built). Story 16 states what an import does with such a field.

## Scenarios

All start from Deer Creek's starting state in `../fixtures.md`. Each begins with the all kinds sample's four changes added (rows F1, F3, F11, F14) and the toast "4 changes added from deer-creek-all-kinds-2025.pdf" showing. S5 and S6 add the timeline update sample (row U1) as a second import from a second window, so that the first toast is still open.

**S1 — A funding source is taken back** (proves R1, R2)
- Given the import added row F11, "Fisheries Habitat Fund", to Funding sources
- When the Contributor presses "Undo"
- Then the toast reads "4 changes removed", and Funding sources lists the two funding sources of the starting state and no "Fisheries Habitat Fund"

**S2 — A contact is taken back** (proves R2)
- Given the import added row F14, the contact Tomás Ibarra, to Contacts
- When the Contributor presses "Undo"
- Then Contacts lists the three contacts of the starting state and no Tomás Ibarra

**S3 — A field goes back to what it held** (proves R3)
- Given the import set the Timeline to 2023–2025 (row F1), from 2023–2027
- When the Contributor presses "Undo"
- Then Key facts shows the Timeline 2023–2027

**S4 — The total goes with the last imported row** (proves R2)
- Given Funding sources shows "Total from all sources" $460,000 since the import added row F11
- When the Contributor presses "Undo"
- Then Funding sources shows no "Total from all sources"

**S5 — A later import's value stands** (proves R3)
- Given the all kinds toast is still showing in one window, and the timeline update sample was added since in another window, setting the Timeline to 2023–2029
- When the Contributor presses "Undo" on the all kinds toast
- Then Key facts shows the Timeline 2023–2029, and the toast reads "4 changes removed"

**S6 — Two imports of one field, both taken back** (proves R3)
- Given the state after S5, with the timeline update's toast still showing in the other window
- When the Contributor presses "Undo" on that toast
- Then Key facts shows the Timeline 2023–2027, the value from before both imports

**S7 — A field edited by hand since keeps the hand edit** (proves R1, R3)
- Given the Contributor has since edited the Timeline by hand to 2023–2028
- When they press "Undo"
- Then Key facts shows the Timeline 2023–2028, and the toast reads "3 changes removed. 1 you changed since was kept."

**S8 — A funding source edited by hand stays, without its source line** (proves R2)
- Given the Contributor has since edited the amount of "Fisheries Habitat Fund" by hand to $50,000
- When they press "Undo"
- Then the row "Fisheries Habitat Fund" stays with $50,000 and no "From …" line, "Total from all sources" is not shown, and the toast reads "3 changes removed. 1 you changed since was kept."

**S9 — A contact already removed is passed over** (proves R2)
- Given the Contributor has since removed the contact Tomás Ibarra by hand
- When they press "Undo"
- Then Contacts lists the three contacts of the starting state, and the toast reads "3 changes removed"

## UAT script

Preconditions: the test environment serves the recorded samples `deer-creek-all-kinds-2025.pdf` and `deer-creek-timeline-update-2026.pdf`. Deer Creek is in its starting state. Signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Before step 1, note the Timeline in Key facts, and the rows of Funding sources and of Contacts.
Test data: `../fixtures.md`: The project (its starting state); the all kinds sample, rows F1, F3, F11 and F14, and the table that says what each sample leaves on the record. Both samples are to be made. The script does not walk S5 and S6, which need two windows.
Reset: reset the sample project in the test environment. The script ends with one funding source edited by hand.

| # | Do this | You should see |
|---|---|---|
| 1 | Open Import a report for Deer Creek, choose `deer-creek-all-kinds-2025.pdf`, press "Read it" and wait | The check step, with the button "Add 4 changes" |
| 2 | Press "Add 4 changes" | The Deer Creek project page, with the message "4 changes added from deer-creek-all-kinds-2025.pdf" and "Undo" |
| 3 | Without touching the message, look at Key facts, Funding sources, Contacts and the Performance measures card | Timeline 2023–2025; a funding source "Fisheries Habitat Fund", $48,000, with "From deer-creek-all-kinds-2025.pdf", and "Total from all sources" $460,000; a contact Tomás Ibarra; Acres of invasive vegetation removed 16.8 |
| 4 | Press "Undo" on the message | A message, "4 changes removed" |
| 5 | Look at the same four places | What you noted before step 1: Timeline 2023–2027, two funding sources and no "Total from all sources", three contacts; Acres of invasive vegetation removed 12.6 |
| 6 | Dismiss the message, and repeat steps 1 and 2 | The message "4 changes added from deer-creek-all-kinds-2025.pdf" and "Undo" |
| 7 | Leave the message where it is. On the row "Fisheries Habitat Fund", change the amount to $50,000 | The row shows $50,000 and still "From deer-creek-all-kinds-2025.pdf" |
| 8 | Press "Undo" | "3 changes removed. 1 you changed since was kept." |
| 9 | Look at Funding sources, Key facts and Contacts | "Fisheries Habitat Fund", $50,000, with no "From …" line, and no "Total from all sources"; Timeline 2023–2027; three contacts |

On the prototype: only the funder report holds these kinds of change (press "Sample funder report", which adds seven changes); see `../fixtures.md`, On the prototype.

## Open questions

None open. This story rests on these proposed answers:

- Q-137 (proposed) — R1, R2 and S7 to S9: a row or field changed by hand since stays, a row that stays loses its source line, one already removed is passed over, all or nothing.
- Q-75 (proposed) — R3 and S7: a Key facts field edited by hand since keeps the hand edit. This reverses the prototype.
- Q-138 (proposed) — R3, S5 and S6: a field returns to the value it would hold had the import never been added.
- Q-72 (proposed) — R3, last sentence: a value also sent to a GIS system is taken back as another edit. No scenario here: it needs story 16, which does not block this story and is not blocked by it.
- Q-179 (proposed) — R3 and S5: a field a later import has set since counts as removed on the toast, not as kept.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; proposed (Q-137) | RUL-22; RUL-402 |
| R2 | decided; shown; proposed (Q-137) | RUL-22; RUL-186; RUL-402; relies on story 17, RUL-48; relies on story 18, RUL-49 |
| R3 | decided; proposed (Q-138); proposed (Q-75); proposed (Q-179); proposed (Q-72) | RUL-22; RUL-187; RUL-403; RUL-404; RUL-405 |
R4 (the kept document is dropped) was removed on 2026-11-23: no document is kept (decided, spec #42). The number is not reused.

- Prototype files: `src/lib/report-imports.ts` (taking an import back whole, 164-181; funding sources and contacts read from the imports that remain, 193-201); `src/components/projects/firma2-project-imported.astro` ("Undo" on the toast, each field put back and the remaining imports' values laid on again, 115-128); `src/components/projects/firma2-project-report-import.astro` (the value a field held before, 479-481 and 978).
- Data shapes, as the prototype models them: each imported change records what it wrote: an entry, a field with the value it held before, a contact, or a funding source. "Undo" walks those records for one import, then drops the import.
- Where the prototype differs from the requirements: a field edited by hand since the import is put back to its value from before the import, so the hand edit is lost (R3 keeps it); a later import remembers, as the value from before it, what the earlier import set, and puts that back even when the earlier import is gone (R3 does not); a funding source or contact cannot be edited by hand at all (story 81 is not yet prototyped).
- Do not copy: imports and their documents kept in the browser; imported field values laid over the project page again on every load; "the value it held before" read from the seeded project and earlier imports only, so a hand edit made before the import is not what "Undo" puts back.

</details>
