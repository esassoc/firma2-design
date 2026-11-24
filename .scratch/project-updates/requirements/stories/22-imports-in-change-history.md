# 22 — A Contributor's import is recorded and listed in the project's change history

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 01
Covers: SCR-4, STA-31, RUL-3, RUL-50, RUL-55, RUL-182, OBJ-1, OBJ-4, RUL-76, RUL-88, RUL-89, RUL-90
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement` (History, in the project page's header); spec #5, #18, #19
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R7, on story 01's page once it saves entries (its check step, "Add N changes" and the return to the project page are used here, not built here); like story 01, only against the recorded crew log reading in `../fixtures.md` until enabler 02 is built. Waiting: the day in R1, R4 and R5 on Q-53 and Q-86; the parts marked "Not decided", each on the question named beside it; where an import's row sits among the other rows, in R6, on Q-94; what a publish does to the row, in R6, on Q-76; who is shown the document's name, in R7, on Q-136; the count of six on Q-82.

## Story

As a Contributor, I want each import listed in the project's change history with how many changes it made, from which document, by whom and when, so that I can be sure what went on the record came from the report I think it did.

## Description

Story 01 ends with the person back on the project page and the entries on the record. This story adds what that act leaves behind: the import, which is the record of who added what from which document. It is also the first screen that shows that record: one row for the import in the project's change history, which `project-record` owns and which opens from History in the project page's header. The row says how many changes were added, from which document, by whom and on what day. It is also where this feature's wider rule is stated: wherever an imported change is shown, its document is named. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement`, under History, after adding the sample crew log. The record of the import (R1, R2, S1, S2) came on 2026-11-23 from a story whose number is retired (`../story-map.md`, Retired numbers); this story's own requirements moved down by two.

## Requirements

R1. Each press of "Add N changes" that adds changes records one import: the project, the person who added it, the day it was added, the document's name, that the document was a file, and each change it added. The document's name is the file's name as chosen, ending included. Nothing is merged: a second import from a file of the same name is a second import. An import with no change is never recorded. Not decided: whether an import is recorded, and with which changes, when an entry fails to save or the button is pressed twice (Q-44, Q-84). (open: Q-53, Q-86)

R2. Each change of an import records the section of the project page it belongs to ("Performance measures"), its label "`<Measure>` · `<reporting period>`", its value, the quote, where in the document it was read when the reading said, and which entry on the record it is. The label names the reporting period the entry was saved under. The value is the amount saved and the measure's unit, written with thousands separators and at most two decimals: "1,850 plants", "5.5 acres".

R3. The project's change history has one row for each import, not one for each change. The row is there as soon as the import is added, before anything is published. Every import has its own row: two imports read from the same document are two rows. A project with no import has no such row.

R4. An import's row fills the change history's three columns, "Date", "User" and "Change": the day the import was added, who added it, and "`<N>` changes from `<document name>`", where `<N>` is the number of changes the import added: "1 change from `<document name>`" for one, and "`<N>` changes from pasted text" when the document was pasted. The count is the one the toast gave (story 01, R12) and does not change afterwards. The day is written without a time, as the rest of the log writes it: "30 September 2026". The row is text: in the first release nothing on it can be pressed. (open: Q-86)

R5. The person and the day on the row are the import's own: who added it and the day it was added, whoever opens the change history and whenever. (open: Q-53)

R6. Imports' rows are in the order they were added, the latest first, two imports of one day included. Not decided: whether an import's row sits among the log's other rows by its day, or above them all as in the prototype (Q-94); whether the row changes or goes when the import's changes are published (Q-76).

R7. Wherever an imported change is shown, the document it came from is named. In this story that is the import's row in the change history. (open: Q-37) Not decided: whether the row names the document to someone who can open the change history but can neither edit nor publish the project (Q-136).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Opening the document from the row — story 29 (`later`).
- The toast — story 01.
- The row removed by "Undo" — story 23.
- The document named on a row of the review — story 24. On a funding source — story 17. On a contact — story 18.
- The note for the reviewer — story 21. Keeping the document itself — enabler 03.
- Pasted text as the document — story 40.
- The "`<N>` unpublished changes" badge — `publish-review`.
- The change history itself, History in the header, and every row that is not an import's — `project-record`.

## Needs to know from elsewhere

- "Add N changes" saves the entries and then returns the person to the project page — owned by story 01 (R10, R11). The import is recorded after the entries are saved and before the person is returned.
- How an amount is shown on the check step (plain digits, 1850) — owned by story 01 (R8). The value in R2 is the import's own text for the change, read later by stories 24 and 41.
- The change history, its columns, how it is opened and who can open it — owned by `project-record`. This story needs a place in it for a row that is not a hand edit.
- Nobody who can neither edit nor publish the project receives the document's name — enabler 03, R5. That enabler is not in `Blocked by`: this story shows a name the import records (R1), not the kept document.
- Added entries are on the record at once and unpublished until a Manager publishes — owned by `publish-review`.

## Scenarios

All run against the recorded crew log reading in `../fixtures.md`. No fixture gives a second import or an import of one change; S6 describes the second import by kind, and the one-change wording of R4 has no scenario. S1 and S2 are confirmed by a developer reading the import's record; S4 is the tester's proof of R1.

**S1 — One import is recorded** (proves R1)
- Given the check step lists the crew log's six changes for Deer Creek, which has no import
- When the Contributor presses "Add 6 changes"
- Then Deer Creek has one import, with the Contributor as the person who added it, today as its day, the document `deer-creek-crew-log-2025.xlsx` as a file, and six changes

**S2 — Each change keeps where it came from** (proves R2)
- Given the crew log's six changes were added to Deer Creek
- When the import's change for row C2 is read
- Then it holds the section "Performance measures", the label "Native trees and shrubs planted · 2025", the value "1,850 plants" (the check step showed 1850), the quote "Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”", and the entry of 1,850 it saved

**S3 — One row for one import** (proves R3)
- Given the crew log's six changes were added to Deer Creek a moment ago and nothing has been published since
- When the Contributor opens the change history
- Then the import has one row, not six

**S4 — What the row says** (proves R1, R4, R7)
- Given a Contributor added the crew log's six changes to Deer Creek today
- When they open the change history
- Then the import's row shows today's date written as day, month and year, the Contributor's name, and "6 changes from deer-creek-crew-log-2025.xlsx"

**S5 — Who and when are the import's own** (proves R5)
- Given a Contributor added the crew log's six changes to Deer Creek
- When an Administrator opens Deer Creek's change history on a later day
- Then the row still shows the Contributor's name and the day the import was added

**S6 — The latest import first** (proves R3, R6)
- Given the crew log's six changes were added to Deer Creek, and then a second import was added from another spreadsheet
- When the Contributor opens the change history
- Then there are two rows for imports, and the second import's row is above the row "6 changes from deer-creek-crew-log-2025.xlsx"

## UAT script

R2 (each change's label, value and quote) is first seen on a row of the review, story 24; R1 is seen here as the row.

Preconditions: story 01's UAT script has been run to its end, so the crew log's six changes were added to Deer Creek today by the person signed in. A second account that can edit Deer Creek exists for step 4.
Test data: `../fixtures.md`: the crew log; The person. The count of six waits on Q-82.
Reset: not known (Q-88). The script itself changes nothing; the import it reads was left by story 01's script.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and press History in the header | The change history |
| 2 | Find the row for the import | Under "Date", today's date as day, month and year; under "User", your name; under "Change", "6 changes from deer-creek-crew-log-2025.xlsx" |
| 3 | Count the rows that name the crew log | One, though six changes were added |
| 4 | Sign in with the second account and open Deer Creek's change history | The same row, with the first person's name and the same date |

On the prototype: every import shows Dana Whitfield and 30 September 2026, whoever added it and whenever; see `../fixtures.md`, The person.

## Open questions

- Q-37 — R7: if every row of the log names a source, R7 covers hand edits too and gains a scenario.
- Q-44, Q-84 — R1: whether a failed save or a second press leaves an import, and with which changes; no scenario covers either yet.
- Q-53 — R1, S1, R5 and S5: confirming that an import records the person and the day.
- Q-76 — R6: whether the row stays as it is after a publish; no scenario covers it yet.
- Q-82 — S1 to S6 and steps 2 and 3: the count of six.
- Q-86 — R1, S1, R4, S4 and step 2: which clock decides the day, and whether the time is kept as well; R6 and S6: two imports on one day can be ordered only if the time is kept.
- Q-88 — the Reset line.
- Q-94 — R6 and S6's Then: where an import's row sits among the other rows of the change history.
- Q-136 — would change R7 and step 4: whether someone who cannot edit or publish the project is shown the document's name on the row.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | OBJ-1; RUL-76, RUL-88, RUL-89 |
| R2 | shown | OBJ-4, RUL-76, RUL-90 |
| R3 | decided; shown | RUL-50, SCR-4; RUL-182 |
| R4 | decided; shown | STA-31; RUL-182 |
| R5 | inferred | RUL-55 |
| R6 | decided | STA-31 |
| R7 | decided | RUL-3 |

- Prototype files: `src/lib/report-imports.ts` (the import as the prototype models it; imports in the order added, 129-130); `src/components/projects/firma2-project-report-import.astro` (where the import is recorded on Add); `src/components/projects/firma2-project-actions.astro` (the three columns, 113-119; the import rows above the seeded log, 120-122; one row per import, latest first, its day, person, count and document, 251-277).
- Data shapes, as the prototype models them: an import holds an id unique within the project, the project, the day with no time of day, the person's name, the document (name; kind: file or pasted text), a note (empty until story 21) and its changes. An imported change holds a key unique within the project, its section, label, value, quote, passage, page and the id of the entry it saved. The row is drawn from the import (person, day, document, number of changes), not from its changes.
- What the prototype does where nothing is decided (not requirements): import rows sit above every other row of the log; a publish leaves the row as it is (Q-76); an entry that could not be saved is passed over without a word and its change is still recorded and counted (Q-44); the person's name is stored as text, not as a link to the person (Q-53).
- Do not copy: the hard-coded person (Dana Whitfield) and fixed day (30 September 2026) on every import; imports kept in the browser's localStorage, and import rows read from it and laid over a seeded log; the document kind "sample"; import ids that are reused after an import is undone ("import-1", "import-2").

</details>
