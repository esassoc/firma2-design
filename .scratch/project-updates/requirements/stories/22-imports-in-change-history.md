# 22 — A Contributor's import is recorded and listed in the project's change history

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-37, Q-44, Q-45, Q-46, Q-50, Q-53, Q-76, Q-84, Q-86, Q-94, Q-101, Q-130, Q-136, Q-141
Revision: 1
Blocked by: 01
Covers: SCR-4, STA-31, RUL-3, RUL-50, RUL-55, RUL-182, OBJ-1, OBJ-4, RUL-76, RUL-88, RUL-89, RUL-90, RUL-345, RUL-346, RUL-347, RUL-348, RUL-349, RUL-350, RUL-351, RUL-352, RUL-353, RUL-354, RUL-355, RUL-25, RUL-454
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement` (History, in the project page's header); spec #5, #18, #42
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R7, on story 01's page once it saves entries (its check step, "Add N changes" and the return to the project page are used here, not built here), against the recorded samples `deer-creek-crew-log-2025.xlsx` and `deer-creek-treatments-2025.pdf`. Waiting: R8 on the performance measures' change log showing a source on a row (`performance-measures`; the log exists, the source on it is not built). Built here, not showable until story 24: what each change records (R2), first seen on a row of the review.

## Story

As a Contributor, I want each import listed in the project's change history with how many changes it made, from which document, by whom and when, so that I can be sure what went on the record came from the report I think it did.

## Description

Story 01 ends with the person back on the project page and the entries on the record. This story adds what that act leaves behind: the import, which is the record of who added what from which document. The file itself is not kept (spec #42): the import holds the document's name and, for each change, the words it was read from. This story is also the first screen that shows that record: one row for the import in the project's change history, which `project-record` owns and which opens from History in the project page's header. It states the feature's wider rule too: wherever an imported change is shown, its document is named, to the people allowed to read the name. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement`, under History, after adding the sample crew log. The prototype still keeps the file and puts import rows above every other row; neither is a requirement.

## Requirements

R1. Each press of "Add N changes" that adds changes records one import: the project, the person who added it, the exact time it was added, the document's name, that the document was a file, each change it added, and whether the report named another project, with that name as the report writes it (story 20 decides when it does). The document's name is the file's name as chosen, ending included. No file is recorded and none is kept. Nothing is merged: a second import from a file of the same name is a second import. An import with no change is never recorded. An import is all or nothing, and one press makes one import: a repeated request for the same press is ignored. When the save fails, nothing is on the record and no import exists; the person is still on the check step with their ticks, edits and note as they left them, and a message beside the commit action says "Nothing was added. Try again."

R2. Each change of an import records the section of the project page it belongs to, the parts it is made of, its quote, the place in the document it was read from when the reading gave one, and which thing on the record it is. For a performance measure entry the parts are the measure, the reporting period the entry was saved under and the amount saved; the parts of the other kinds are stated by stories 15, 17 and 18. A change that replaces a value the record held also records the value it replaced: a Key facts field (story 15), and the amount of a funding source row the record already held (story 86, R6, which puts it back on "Undo"). The import records parts, not a finished label: each screen words the change itself. Nothing else of the reading is recorded: not the changes left out, and not the "Not used" and "Skipped" lists.

R3. The project's change history has one row for each import, not one for each change. The row is there as soon as the import is added, before anything is published. Every import has its own row: two imports read from the same document are two rows. A project with no import has no such row.

R4. An import's row fills the change history's three columns, "Date", "User" and "Change": the day the import was added, who added it, and "`<N>` changes from `<document name>`", where `<N>` is the number of changes the import wrote; "1 change from `<document name>`" for one. The count is the one the toast gave (story 01, R12) and does not change afterwards. The day is written without a time, as the rest of the log writes it: "30 September 2026". The row is text: nothing on it can be pressed, and nothing opens.

R5. The person and the time on the row are the import's own: who added it and when, whoever opens the change history and whenever. Screens show the day alone, in the time zone of the person reading.

R6. An import's row sits among the change history's other rows by its time, latest first: a hand edit made after an import shows above it, and two imports of one day are in the order they were added. A publish changes nothing on the row and does not remove it.

R7. Wherever an imported change is shown, the document it came from is named. In this story that is the import's row. Only a change from a document or a data source names a source: a hand edit's row shows who and when, and no source. To someone who can open the change history but can neither edit nor publish the project, the import's row reads "`<N>` changes from a document", for a file and for pasted text alike, and the document's name is not sent to them.

R8. Each entry an import added is a row in the performance measures' change log, as an entry recorded by hand is. The row shows "From `<document name>`" and the import's person and day. Who is shown the name follows R7.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The toast — story 01. The button that reads "Adding…" and cannot be pressed while the import is saved — story 01 (R10).
- The row and the change log rows removed by "Undo" — story 23.
- The document named on a row of the review, with the quote — story 24. On a funding source — story 17. On a contact — story 18.
- The note for the reviewer — story 21.
- Pasted text as the document, and its row "`<N>` changes from pasted text" — story 40.
- Opening the document: not in the product (spec #42).
- The "`<N>` unpublished changes" badge — `publish-review`.
- The change history itself, History in the header, and every row that is not an import's — `project-record`.

## Needs to know from elsewhere

- "Add N changes" saves the entries and then returns the person to the project page — owned by story 01 (R10, R11). The import is recorded with the entries, in the same all-or-nothing save, before the person is returned.
- When the record changed underneath so that a ticked change no longer stands, the import stops once, the changes are re-marked and the person presses again — owned by story 32. That is not a failed save.
- The change history, its columns, how it is opened and who can open it — owned by `project-record`. This story needs a place in it for a row that is not a hand edit.
- The performance measures' change log, and who can open it — owned by `performance-measures`. This story needs its rows to carry a source line.
- Added entries are on the record at once and unpublished until a Manager publishes — owned by `publish-review`.
- Adding an import notifies nobody. The Updates feed shows one item for an import, not one per change, and names the document only to people allowed to read the name — owned by `updates-feed` (proposed, Q-49).

## Scenarios

All start from Deer Creek's starting state in `../fixtures.md`. The second import is the treatments sample. No sample fails to save or names another project; S9 and S10 describe those by kind. S1, S2 and S10 are confirmed by a developer reading the import's record.

**S1 — One import is recorded** (proves R1)
- Given the check step lists the crew log's six changes for Deer Creek, which has no import
- When the Contributor presses "Add 6 changes"
- Then Deer Creek has one import, with the Contributor as the person who added it, the time of the press, the document's name `deer-creek-crew-log-2025.xlsx` as a file, six changes, and no stored file

**S2 — Each change keeps where it came from** (proves R2)
- Given the crew log's six changes were added to Deer Creek
- When the import's change for row C2 is read
- Then it holds the section "Performance measures", the measure Native trees and shrubs planted, the reporting period 2025, the amount 1,850, the quote "Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”", the place row 7, and the entry it saved; and the import holds none of the crew log's "Not used" or "Skipped" lines

**S3 — One row for one import** (proves R3)
- Given the crew log's six changes were added to Deer Creek a moment ago and nothing has been published since
- When the Contributor opens the change history
- Then the import has one row, not six

**S4 — What the row says** (proves R4, R7)
- Given a Contributor added the crew log's six changes to Deer Creek today
- When they open the change history
- Then the import's row shows today's date written as day, month and year, the Contributor's name, and "6 changes from deer-creek-crew-log-2025.xlsx", and nothing on the row can be pressed

**S5 — Who and when are the import's own** (proves R5)
- Given a Contributor added the crew log's six changes to Deer Creek
- When an Administrator opens Deer Creek's change history on a later day
- Then the row still shows the Contributor's name and the day the import was added

**S6 — The row sits by its time** (proves R6)
- Given the crew log's six changes were added to Deer Creek, then the description was edited by hand, then the treatments sample's two changes were added
- When the Contributor opens the change history
- Then, from the top: "2 changes from deer-creek-treatments-2025.pdf", the hand edit of the description, "6 changes from deer-creek-crew-log-2025.xlsx"

**S7 — A publish leaves the row** (proves R6)
- Given the crew log's six changes were added to Deer Creek and a Manager has since published the project
- When the Contributor opens the change history
- Then the row "6 changes from deer-creek-crew-log-2025.xlsx" is still there, with the same person and day

**S8 — A hand edit names no source** (proves R7)
- Given the crew log's six changes were added to Deer Creek, then the description was edited by hand
- When the Contributor reads the hand edit's row in the change history
- Then it shows who made the edit and the day, and no document

**S9 — The name is withheld from someone who can neither edit nor publish** (proves R7)
- Given the crew log's six changes were added to Deer Creek
- When a person who can open Deer Creek's change history but can neither edit nor publish the project opens it
- Then the import's row reads "6 changes from a document", and nothing sent to that person holds the file's name

**S10 — A failed save leaves nothing** (proves R1)
- Given the check step lists the crew log's six changes, one is unticked, a note is typed, and the save cannot complete (the connection is lost)
- When the Contributor presses "Add 5 changes"
- Then they are still on the check step with the same ticks and the note, a message reads "Nothing was added. Try again.", Deer Creek's figures are the fixture's "Before" column, and Deer Creek has no import

**S11 — One press, one import** (proves R1)
- Given the check step lists the crew log's six changes
- When the request of one press of "Add 6 changes" reaches the product twice
- Then Deer Creek has one import of six changes, and each figure is the fixture's "After C1–C6" column

**S12 — Each entry is a row in the performance measures' change log** (proves R8)
- Given a Contributor added the crew log's six changes to Deer Creek today
- When they open the performance measures' change log for Native trees and shrubs planted
- Then the entry of 1,850 plants is a row that shows "From deer-creek-crew-log-2025.xlsx", the Contributor's name and today's date

## UAT script

R2 (what each change records) is first seen on a row of the review, story 24. Step 9 can be run only once `performance-measures` shows a source on its change log rows.

Preconditions: the test environment serves the recorded samples `deer-creek-crew-log-2025.xlsx` and `deer-creek-treatments-2025.pdf`. Deer Creek is in its starting state. Signed in as someone who can edit Deer Creek. Two more accounts exist: a second one that can edit Deer Creek (step 10), and one that can open its change history but can neither edit nor publish it (step 11).
Test data: `../fixtures.md`: the crew log (rows C1 to C6); the treatments sample (rows T1, T2); The person. The two narrow samples are to be made.
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import a report" on the Performance measures card, choose `deer-creek-crew-log-2025.xlsx`, press "Read it" and wait | The check step, with the button "Add 6 changes" |
| 2 | Press "Add 6 changes" | The Deer Creek project page, with the message "6 changes added from deer-creek-crew-log-2025.xlsx" |
| 3 | Press History in the header | The change history |
| 4 | Read the top row | Under "Date", today's date as day, month and year; under "User", your name; under "Change", "6 changes from deer-creek-crew-log-2025.xlsx" |
| 5 | Count the rows that name the crew log, and try to press the one there is | One, though six changes were added. Nothing happens when it is pressed |
| 6 | Close the change history and change the project's description by hand | The description as you changed it |
| 7 | Import `deer-creek-treatments-2025.pdf` as in steps 1 and 2, pressing "Add 2 changes" | The message "2 changes added from deer-creek-treatments-2025.pdf" |
| 8 | Press History in the header and read the top three rows | "2 changes from deer-creek-treatments-2025.pdf"; then your edit of the description, with your name and no document; then "6 changes from deer-creek-crew-log-2025.xlsx" |
| 9 | Open the performance measures' change log for Native trees and shrubs planted | Two new rows, each with your name and today's date: 1,850 plants "From deer-creek-crew-log-2025.xlsx" and 1,850 plants "From deer-creek-treatments-2025.pdf" |
| 10 | Sign in with the second account that can edit and open Deer Creek's change history | The same rows, with the first person's name and the same date |
| 11 | Sign in with the account that can neither edit nor publish and open Deer Creek's change history | "6 changes from a document" and "2 changes from a document"; neither file's name |

On the prototype: only the crew log can be added (press "Sample crew log"); every import shows Dana Whitfield and 30 September 2026; see `../fixtures.md`, On the prototype.

## Open questions

None open. This story rests on these proposed answers:

- Q-37 (proposed) — R7 and S8: a hand edit's row names no source. It amends spec #5.
- Q-44, Q-84 (proposed) — R1, S10 and S11: all or nothing, the failed save, one press one import.
- Q-45 (proposed) — R1, R2 and S1, S2: the document's name and each change's quote are what stay of a document. That no file is kept is decided (spec #42).
- Q-46 (proposed) — R2: the changes left out and the two lists are not recorded.
- Q-50 (proposed) — R2: a change to a funding source row the record already held records the amount it replaced (story 86).
- Q-53, Q-86 (proposed) — R1, R4, R5: the person and the exact time are recorded; screens show the day in the reader's time zone.
- Q-76 (proposed) — R6 and S7: a publish leaves the row.
- Q-94 (proposed) — R6, S6 and step 8: the row sits by its time.
- Q-101 (proposed) — R8, S12 and step 9: the row in the performance measures' change log.
- Q-130 (proposed) — R1: the import records that the report named another project.
- Q-136 (proposed) — R7, R8, S9 and step 11: who is shown the document's name.
- Q-141 (proposed) — R2 and S2: the import records parts, not a label.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown; decided (spec #42); proposed (Q-45); proposed (Q-44, Q-84); proposed (Q-53, Q-86); proposed (Q-130) | OBJ-1; RUL-76, RUL-88, RUL-89; RUL-345; RUL-346; RUL-347; RUL-348; RUL-349 |
| R2 | shown; proposed (Q-141); proposed (Q-45); proposed (Q-46); proposed (Q-50) | OBJ-4, RUL-76; RUL-90; RUL-346; RUL-350; RUL-454 |
| R3 | decided; shown | RUL-50, SCR-4; RUL-182 |
| R4 | decided; shown; decided (spec #42) | STA-31; RUL-182; RUL-351 |
| R5 | proposed (Q-53, Q-86) | RUL-55 |
| R6 | decided; proposed (Q-94); proposed (Q-76) | STA-31; RUL-352; RUL-353 |
| R7 | decided; proposed (Q-37); proposed (Q-136) | RUL-3; RUL-354; RUL-25 |
| R8 | proposed (Q-101), not yet prototyped | RUL-355 |
- Wording provisional: "Nothing was added. Try again."
- Prototype files: `src/lib/report-imports.ts` (the import as the prototype models it; imports in the order added, 129-130); `src/components/projects/firma2-project-report-import.astro` (where the import is recorded on Add); `src/components/projects/firma2-project-actions.astro` (the three columns, 113-119; the import rows above the seeded log, 120-122; one row per import, latest first, its day, person, count and document, 251-277).
- Data shapes, as the prototype models them: an import holds an id unique within the project, the project, the day with no time of day, the person's name, the document (name; kind: file or pasted text), a note (empty until story 21) and its changes. An imported change holds a key unique within the project, its section, a finished label and value, quote, passage, page and the id of the entry it saved. The row is drawn from the import (person, day, document, number of changes), not from its changes.
- Where the prototype differs from the requirements: import rows sit above every other row of the log (R6); an entry that could not be saved is passed over without a word and its change is still recorded and counted (R1); the day is stored with no time and the person's name as text (R1, R5); a change stores a finished label and value (R2); nothing withholds the name (R7); the performance measures' change log shows no source (R8).
- Do not copy: the kept file; the hard-coded person (Dana Whitfield) and fixed day (30 September 2026) on every import; imports kept in the browser's localStorage, and import rows read from it and laid over a seeded log; the document kind "sample"; import ids that are reused after an import is undone ("import-1", "import-2").

</details>
