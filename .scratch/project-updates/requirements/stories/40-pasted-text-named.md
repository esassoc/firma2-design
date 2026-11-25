# 40 — A Contributor's import from pasted text names "pasted text" as its document

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-45, Q-139
Revision: 1
Blocked by: 09, 22
Covers: RUL-29, RUL-189, RUL-190, RUL-400, RUL-401
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement`; spec #21, #42
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R3, once story 09 reads pasted text and story 22 records an import and lists it in the change history, against the recorded reading of the pasted paragraph in `../fixtures.md`. Waiting: the change log half of R2 on `performance-measures` showing a source on its change log rows (story 22, R8).

## Story

As a Contributor, I want an import I made from pasted text to say so wherever its document would be named, so that the changes I add from it can be traced back to the words they came from.

## Description

Story 09 takes pasted text as far as the check step. This story covers what pressing "Add N changes" leaves behind when the document was pasted: an import that records its document as pasted text, the words "pasted text" wherever a file's name would stand, and each change's quote. The text itself is not kept, as no file is (spec #42). Narrowed on 2026-11-23: the story used to keep the text and open it in the review; how pasted text is drawn on the check step is story 31's. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement`, after adding the pasted paragraph.

## Requirements

R1. An import added from pasted text records that its document was pasted text, not a file. The document has no file name. A file left in the file control when the text was read (story 09, R4) is no part of the import.

R2. Wherever the import's document is named, the words "pasted text" stand in place of a file name. The toast on the project page reads "`<N>` changes added from pasted text", or "1 change added from pasted text" for one; the change history row reads "`<N>` changes from pasted text"; a row of the performance measures' change log reads "From pasted text". The name is the same for every such import: two of them on one project are told apart by the person and the day shown beside the name. The same words stand on the screens other stories own: "From pasted text" on a row of the review (story 24, R3), on a funding source's row (story 17) and on a contact's row (story 18), and "`<who>` · `<day>`, with pasted text" under a note (story 21, R6).

R3. The pasted text is not kept. Once the import is added, or the reading is abandoned, nothing of the text stays but the quote of each change that was added: the words the change was read from, with no place in front.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The change history row, the performance measures' change log row and who is shown the document's name on them (someone who can neither edit nor publish reads "`<N>` changes from a document") — story 22 (R4, R7, R8).
- The review row, the funding source row, the contact row and the note's line themselves — stories 24, 17, 18 and 21.
- Pasted text shown beside the changes on the check step, under the heading "Pasted text" — story 31.
- "Undo" on the toast — story 23.
- Opening the text again after adding: not in the product (spec #42).

## Needs to know from elsewhere

- "Add N changes" saves the entries and returns the person to the project page — owned by story 01.
- Each press of "Add N changes" records one import: the project, who added it, the time, the document's name and, for each change, its parts, its quote and the place it was read from — owned by story 22 (R1, R2). The toast counts the changes the import added, and the person can dismiss it — owned by story 01 (R12, R13).
- An import has one row in the change history, whose "Change" reads "`<N>` changes from `<document name>`", and each of its entries has a row in the performance measures' change log with "From `<document name>`" — owned by story 22 (R3, R4, R8).
- What the check step lists for pasted text, and that the text is read whatever the file control holds — owned by story 09 (R4).

## Scenarios

All start from Deer Creek's starting state and run against the recorded reading of the pasted paragraph in `../fixtures.md`. It proposes only performance measure entries, and three of them, so the one-change wording of R2 has no scenario.

**S1 — The import's document is pasted text** (proves R1)
- Given the check step lists the pasted paragraph's three changes for Deer Creek, which has no import
- When the Contributor presses "Add 3 changes"
- Then Deer Creek has one import, whose document is recorded as pasted text with no file name

**S2 — The toast says "pasted text"** (proves R2)
- Given the check step lists the pasted paragraph's three changes
- When the Contributor presses "Add 3 changes"
- Then the Deer Creek project page shows a success toast, "3 changes added from pasted text"

**S3 — The change history says "pasted text"** (proves R2)
- Given the pasted paragraph's three changes were added to Deer Creek
- When the Contributor opens the change history
- Then the import's row reads "3 changes from pasted text"

**S4 — Only the quotes stay** (proves R3)
- Given the pasted paragraph's three changes were added to Deer Creek
- When the import's record is read
- Then it holds no copy of the paragraph; the change for row P1 holds the quote "“This spring we planted 6 acres of willow and cottonwood along the east bank”", with no place in front; and the sentence about the logger, which no change was read from, is held nowhere

## UAT script

R3 is confirmed by a developer (S4); the quote is first seen on a row of the review, story 24. Step 5 can be run only once `performance-measures` shows a source on its change log rows.

Preconditions: the test environment serves the recorded reading of the pasted paragraph for that text. Deer Creek is in its starting state. Signed in as someone who can edit Deer Creek.
Test data: `../fixtures.md`: the pasted paragraph, rows P1 to P3. No sample has a pasted text that proposes a single change.
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and press "Import a report" on the Performance measures card | The choose step |
| 2 | Choose "Paste text", paste the paragraph from `../fixtures.md`, press "Read it" and wait | The check step, with the button "Add 3 changes" |
| 3 | Press "Add 3 changes" | The Deer Creek project page, with a message "3 changes added from pasted text" |
| 4 | Press History in the header, read the top row, and close the change history | Today's date, your name, and "3 changes from pasted text" |
| 5 | Open the performance measures' change log for Acres of riparian habitat restored | A row for the entry of 6 acres, with your name, today's date and "From pasted text" |
| 6 | Look through the project page and the change history for a way to read the pasted paragraph again | There is none |

On the prototype: under "Paste text" the old paragraph is already in the text area; see `../fixtures.md`, On the prototype.

## Open questions

None open. This story rests on these proposed answers:

- Q-139 (proposed) — R2: the name stays "pasted text" for every such import. Its other half, keeping the text exactly as typed, no longer arises: nothing is kept (decided, spec #42).
- Q-45 (proposed) — R3 and S4: each change's quote is what stays of the text.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | RUL-29; RUL-189, RUL-190; relies on story 22, OBJ-1, RUL-76 |
| R2 | decided; shown; proposed (Q-139) | RUL-29; RUL-190; RUL-400; relies on story 01, STA-26 |
| R3 | decided (spec #42); proposed (Q-45) | RUL-29; RUL-401 |
- RUL-188 (pasted text cut into paragraphs at blank lines) left this story on 2026-11-23: it is a display rule of the check step's pane, story 31.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (which document a reading has, 531-538; the import recorded on Add, 1048-1063); `src/lib/report-imports.ts` ("From pasted text", 203-205); `src/components/projects/firma2-project-imported.astro` (the toast, 103-114).
- Data shapes, as the prototype models them: a document has a name and a kind (file or pasted text). A pasted document has no file; the import records the name "Pasted text" beside the kind, which no screen shows.
- Where the prototype differs from the requirements: it keeps the pasted text as one page of passages with the import and opens it from the review (R3 keeps nothing but the quotes).
- Do not copy: imports and their documents kept in the browser; the document kind "sample".

</details>
