# 86 — A Contributor sees a funding source the record already holds with another amount as a change to that row

Type: story
Epic: B — What a report can change
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-45, Q-48, Q-50, Q-87, Q-99, Q-133, Q-137, Q-138, Q-174, Q-175
Revision: 1
Blocked by: 17, 41
Covers: RUL-447, RUL-448, RUL-449, RUL-450, RUL-451, RUL-452, RUL-453
Sources: not in the prototype, where a matching funding source's different amount is lost; spec #15, #42
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (ACN, STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R5, on story 17's funding source change; R6 and R7, once stories 41 and 84 take an import back. The script runs against the recorded sample `deer-creek-funding-2025.pdf`, by editing a change on the check step; no sample holds a funding source with another amount, two in one reading, or a second import of one row, and those scenarios describe their data by kind. Nothing waits.

## Story

As a Contributor, I want a grant the project already lists, reported with a new amount, offered as a change to that row, so that the award is corrected in place and never counted twice.

## Description

Story 17 proposes each funding source a report names and marks one the record already holds, with the same amount, "Already on file". This story holds the cases where a funding source meets one the record or the reading already holds and something differs: the record has the row with another amount; the person edits a change into or out of a match; one reading names the same funding source twice; two imports touch one row, and one of them is undone. In each the rule is the same: one grant from one organization is one row, and the amount on it is the one a person saw and chose. Split from story 17 on 2026-11-23, by business-rule variation. It is built after story 41, because its Undo cases are the joint cases of the two. Not in the prototype, which keeps the row and loses the report's amount.

## Requirements

R1. A funding source whose grant or program and organization match a funding source on the record (story 17, R7 and R8), with another amount, is proposed as a change to that row. It is an ordinary ready change: ticked, labelled "Funding source", with its three fields, and "Was `<the row's amount>`" beside "Secured ($)". Amounts are compared as numbers. With the same amount it is "Already on file" (story 17, R7).

R2. Adding a change of R1 replaces the amount on the row the record has. No second row is added, and the import counts it as one change.
- The row keeps its place in the Funding sources table and gains "From `<document name>`" under its name, under the same rules as an added row's line (story 17, R9).
- "Total from all sources" is shown while the table holds a row an import added or changed.
- The share the row shows is `project-record`'s to work out, as after a hand edit of the amount (story 81, R9).

R3. A change's state follows the person's edits. It is worked out again whenever the person changes "Grant or program", "Organization" or "Secured ($)":
- A ticked change edited into a match with the same amount becomes "Already on file": it loses its checkbox and leaves the count.
- A change edited into a match with another amount becomes a change to that row and gains "Was `<the row's amount>`"; its tick stays as it was.
- An "Already on file" change edited so that only its amount differs becomes a change to that row, gains a checkbox, and is ticked.
- An "Already on file" change edited so that its name or its organization no longer matches becomes a new funding source, gains a checkbox, and is ticked.
- Set back to what the record holds, it is "Already on file" again.

R4. The state is worked out once more when "Add N changes" is pressed, by the same tests, against the record as it then stands (story 32, R5). If a ticked funding source is now on the record with the same amount, or its row now exists with another amount, or the amount it shows as "Was …" is no longer the row's, nothing is saved; the changes are marked afresh ("Already on file", or "Was `<amount>`"), and the person presses again on a true count.

R5. One reading never proposes one funding source twice as two ready changes.
- Two with the same name, organization and amount are one change: it shows the first place's quote and "Also stated: `<the other place>`".
- Two with the same name and organization and different amounts are both listed, flagged with the badge "Needs you" and unticked, each with the line "The report also gives `<other amount>`." Ticking one unticks the other, so one at most is added. Its amount can be edited, so two awards of one grant are entered as their sum by the person; the product never adds them up.
- The tally counts both under "need you" until one is ticked. When the record already holds the row, the one that is ticked also shows "Was `<the row's amount>`".

R6. "Undo" of an import that changed a row's amount puts back the amount the import found, and the row's "From …" line is again what it was before: none, or the earlier document's name.
- When the amount was changed by hand since the import, it stays, the row loses its "From …" line, and the toast says what was kept (story 84, R3).
- When the row was removed by hand since, it is passed over.

R7. When two imports have set one row's amount, the row shows the later import's amount and its "From …" line names the later document.
- Undoing the earlier import leaves the row with the later import's amount and line.
- Undoing the later import puts back the amount it found, with the earlier document's name on the line.
- With both undone, in either order, the table is as it was before both: a row the earlier import added is gone, and a row that was there before holds the amount it held then.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Proposing a funding source, its fields, the match of names and organizations, "Already on file", and the row an added funding source makes — story 17.
- An organization the workspace does not hold; a funding source with no organization or no amount — story 75.
- What stops a ticked funding source from being added — story 65.
- Undo itself, its toasts, and the other kinds of change — stories 23, 84 and 41.
- Editing or removing the row on the project page — story 81.
- How a change to a row's amount reads in the review — story 24 and `publish-review`.
- Recording that the person changed the amount on the check step — story 36.

## Needs to know from elsewhere

- A funding source change has three fields the person can edit, whatever its state; editing does not otherwise tick or untick it. Names match letter for letter, ignoring case and outer spaces; the organization compared is the one matched. An "Already on file" funding source has no checkbox — story 17 (R2, R7, R8).
- The check at the press: nothing is saved, the changes that no longer stand are marked, and the person presses again on a true count — story 32, R5.
- A flagged change arrives unticked with the badge "Needs you" and is counted under "need you"; ticked by hand it counts under "ready to add" — story 06 (R3, R4).
- "Undo" takes back only what is still as the import left it; what was changed by hand since stays; a field returns to the value it would hold had the import never been added. The toasts: "`<N>` changes removed" and "`<N>` changes removed. `<M>` you changed since were kept." — stories 23, 84 and 41.
- The import records, for a change to a row, the amount it replaced as well as its parts — story 22, R2. The document's name is kept, the file is not (spec #42).
- The Funding sources table and how a share is worked out — owned by `project-record`.

## Scenarios

No recorded sample holds this data. S1 to S3, S5, S9 and S10 start from Deer Creek's starting state, whose record holds Watershed Resilience Grant Program, California Watershed Restoration Board, $255,500, entered by hand, and describe the reading by kind. S4 and S6 run on the recorded sample `deer-creek-funding-2025.pdf` (rows F3, F10, F11).

**S1 — Another amount is a change to the row** (proves R1)
- Given a reading that names Watershed Resilience Grant Program, California Watershed Restoration Board, with an amount other than $255,500
- When the check step opens
- Then that change is ticked, carries no "Already on file" badge, and shows "Was $255,500" beside "Secured ($)"

**S2 — Adding it replaces the amount on the one row** (proves R2)
- Given the check step of S1
- When the Contributor adds the ticked changes
- Then Funding sources still has two rows; Watershed Resilience Grant Program holds the new amount, in its old place, with "From `<document name>`" under its name; and "Total from all sources" is shown

**S3 — The same amount is "Already on file"** (proves R1)
- Given a reading that names the same grant and organization with 255500
- When the check step opens
- Then that change is "Already on file" and has no checkbox

**S4 — Edited into a match with the same amount** (proves R3)
- Given the funding sample's check step, where F11 is ticked and the action reads "Add 2 changes"
- When the Contributor changes F11's "Grant or program" to Watershed Resilience Grant Program, its "Organization" to California Watershed Restoration Board and its "Secured ($)" to 255,500
- Then F11 becomes "Already on file" with no checkbox, and the action reads "Add 1 change"

**S5 — Edited into a match with another amount** (proves R3)
- Given a ticked funding source change that matches no row
- When the Contributor changes its name and organization to those of a row on the record, leaving an amount that differs from the row's
- Then the change stays ticked and gains "Was `<the row's amount>`"

**S6 — An "Already on file" funding source given another amount** (proves R3)
- Given the funding sample's check step, where F10 is "Already on file" and the tally reads "2 ready to add · 1 already on file"
- When the Contributor types 260,000 over F10's "Secured ($)"
- Then F10 loses the badge, gains a checkbox, ticked, and "Was $255,500", and the tally reads "3 ready to add"

**S7 — The record changed before the press** (proves R4)
- Given a ticked funding source change for a new funding source, and since the check step opened another person has added that funding source to the project with the same amount
- When the Contributor presses "Add N changes"
- Then nothing is saved, the change is marked "Already on file" with no checkbox, and the action's count is one lower

**S8 — The same funding source twice, with one amount** (proves R5)
- Given a report that states one grant, organization and amount in a summary and again in a table
- When the reading comes back
- Then one funding source change is listed, with the summary's quote and "Also stated: `<the table's place>`"

**S9 — The same funding source twice, with two amounts** (proves R5)
- Given a report that names one grant and organization with two different amounts
- When the reading comes back, and the Contributor ticks the first and then the second
- Then both arrive unticked with "Needs you", each reads "The report also gives `<other amount>`.", and ticking the second unticks the first

**S10 — Undo puts the earlier amount back** (proves R6)
- Given the import of S2 was just added, and its toast is showing
- When the Contributor presses "Undo"
- Then Watershed Resilience Grant Program holds $255,500 again, with no "From …" line, and "Total from all sources" is gone

**S11 — Undo leaves an amount changed by hand** (proves R6)
- Given the import of S2, and the Contributor has since changed that row's amount by hand on the project page
- When they press "Undo" on the import's toast
- Then the row keeps the amount typed by hand, loses its "From …" line, and the toast says one change was kept

**S12 — The earlier of two imports undone** (proves R7)
- Given a first import added a funding source, a second import changed its amount, and the first import's toast is still open in another window
- When the Contributor presses "Undo" on the first import's toast
- Then the row stays, with the second import's amount and "From `<the second document's name>`"

**S13 — The later of two imports undone** (proves R7)
- Given the same two imports
- When the Contributor presses "Undo" on the second import's toast
- Then the row holds the first import's amount, with "From `<the first document's name>`"

## UAT script

The funding sample holds no funding source with another amount, so the script makes one by editing a change on the check step (R3), then adds it and takes it back.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Nothing has been imported to Deer Creek. The test environment serves the recorded sample `deer-creek-funding-2025.pdf`. Stories 17, 41 and what they are blocked by are built.
Test data: `../fixtures.md`: the funding sample, rows F3, F10 and F11; Deer Creek's funding sources. The sample is to be made. After step 5 the total is $464,500: $260,000, $156,500 and $48,000. No sample has two funding sources of one name in a reading, or a second import of one row.
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import a report", choose `deer-creek-funding-2025.pdf`, press "Read it" and wait | The check step; the tally "2 ready to add · 1 already on file"; the action "Add 2 changes" |
| 2 | On the change whose "Grant or program" holds Watershed Resilience Grant Program, type 260,000 over "Secured ($)" and leave the field | The badge "Already on file" goes; the change has a checkbox, ticked; "Was $255,500" shows; the tally reads "3 ready to add"; the action reads "Add 3 changes" |
| 3 | Type 255,500 back and leave the field | "Already on file" again, with no checkbox and no "Was …"; "Add 2 changes" |
| 4 | Type 260,000 again and press "Add 3 changes", then go to Funding sources | The Deer Creek project page; "3 changes added from deer-creek-funding-2025.pdf"; three rows |
| 5 | Read the Watershed Resilience Grant Program row and the foot of the table | One such row, in its old place, at $260,000, with "From deer-creek-funding-2025.pdf" under its name; "Total from all sources" $464,500 |
| 6 | Press "Undo" on the toast | "3 changes removed"; Watershed Resilience Grant Program at $255,500 with no "From …" line; two rows; no "Total from all sources" |

## Open questions

None open. The story rests on these proposed answers:

- Q-50 (proposed) — R1, R2, S1 to S3: a match with another amount is a change to the row, not a second row and not "Already on file".
- Q-87 (proposed) — R1, R3: an "Already on file" funding source has no checkbox; one edited into a match is tested the same way.
- Q-133 (proposed) — R3, R4, S4 to S7: the state follows the person's edits and is worked out again at the press.
- Q-48 (proposed) — R4: the last save stands, and the guard is the check at the press.
- Q-99 (proposed) — R4, R5, R7, S7 to S9, S12, S13: parts (e) and (f): one funding source twice in a reading, and a row two imports touched.
- Q-137, Q-138 (proposed) — R6, R7, S10 to S13: Undo leaves a hand edit alone, and puts back what would be there had the import never been added.
- Q-45 (proposed) — R2, R6, R7: the document's name stays on the row although the file is not kept.
- Q-174 (proposed) — R2: what a row whose amount an import changed shows: the "From …" line, its place, its share, and the total row.
- Q-175 (proposed) — R3, S6: an edit that turns an "Already on file" funding source into a change ticks it.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | proposed (Q-50, Q-87) | RUL-447; relies on story 17, RUL-80, RUL-173, RUL-174 |
| R2 | proposed (Q-50); proposed (Q-174); proposed (Q-45) | RUL-448; relies on story 17, STA-29, RUL-48 |
| R3 | proposed (Q-133, Q-87); proposed (Q-175) | RUL-449 |
| R4 | proposed (Q-133, Q-48, Q-99) | RUL-450; relies on story 32, R5 |
| R5 | proposed (Q-99) | RUL-451 |
| R6 | proposed (Q-50, Q-137) | RUL-452; relies on story 41 and story 84 |
| R7 | proposed (Q-99, Q-138) | RUL-453 |
- Came from story 17 on 2026-11-23: the "Not decided" clauses of its R1, R7 and R13 (Q-50, Q-99, Q-133). Story 17's inventory item RUL-177 (one row per name and organization) describes what the prototype does in these cases and may be split between the two stories.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the comparison at 345; "Already on file" at 618-621 and 657-664; what is recorded on Add at 982-1001); `src/components/projects/firma2-project-funding.astro` (one row per name and organization, and which amount it shows, 313-327); `src/lib/report-imports.ts` (what an imported change wrote, 50-56 and 198-205).
- Data shapes: none in the prototype for a change to a row. The import needs, for such a change, the row it changed and the amount it found, so that Undo can put it back.
- The prototype differs from the requirements in these: a match is "Already on file" whatever the amount, and the report's amount is lost (R1); the state is worked out once and does not follow edits (R3, R4); two matching funding sources in one reading are both proposed, ticked (R5); when two imports add one new funding source the row keeps the first one's place with the later amount, and each import counts a change (R7).
- Do not copy: the scripted readings; imported rows laid over the table from a browser-local store.

</details>
