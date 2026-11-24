# 33 — A Manager opens an imported change's document beside the difference, at its passage

Type: story
Epic: C — Imported changes in review
Release: first
Status: needs-info
Revision: 1
Blocked by: 24, 03
Covers: ACN-19, RUL-46, RUL-200, RUL-201, RUL-202, RUL-203
Sources: the project's review, `/prototypes/review/deer-creek-riparian-corridor-enhancement`, after adding a report; spec #31
Snapshot: not yet captured
Read with: `../epics/E-C-imported-changes-in-review.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R4 and R8, once story 24 is built (it puts the button on imported rows) and enabler 03 is built (it keeps the document and decides who may open it); only against the recorded readings in `../fixtures.md` until enabler 02 is built. Waiting: the parts marked "Not decided", each on the question named beside it. R5 to R7 moved to story 80 on 2026-11-23; their numbers are not reused.

## Story

As a Manager, I want to open the document an imported change came from, at the place it was read from, so that I can judge the change against its source before I publish it.

## Description

In the project's review an imported row has a button that names its document (story 24). This story is what the button does: the document opens beside the difference at the place the change was read from, and moves when another row's button is pressed. The document is the one kept with the import (enabler 03). Story 80 is how the document sits beside the review on a wide and a narrow screen and how it closes; story 51 adds the row that stands for two imports. Split from story 24 on 2026-11-23, and story 80 split from this one the same day. See it at `/prototypes/review/deer-creek-riparian-corridor-enhancement`, after adding a PDF and a spreadsheet in the same browser.

## Requirements

R1. Pressing "From `<document name>`" on an imported row opens that import's document beside the difference, under the document's name. Pressing the button of the row the document is already open from leaves it open. Not decided: whether that second press should close it (Q-145).

R2. The document opens at the place the change was read from. A PDF opens at the page the change was read from. A change with no place recorded opens the document at its start. Not decided: such a change pressed while the document is already open at another row's place (Q-117).

R3. While a document is open, the button it was opened from is marked as expanded for assistive technology, and no other button is. With no document open, none is.

R4. Pressing the button on another row while a document is open moves the document to that row's place, and to that row's document when the row came from another import. One document is open at a time.

R8. A PDF is the only kind of file shown as itself. For any other file (a spreadsheet, a Word file), the document's place reads "This file can't be shown here." and shows the quote of the change it was opened from; pressing another row of the same document changes the quote to that row's. Not decided: whether such a file is shown as passages instead (Q-66), and what the Manager sees when the document cannot be fetched (Q-77).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The imported row and the button's wording — story 24.
- The document side by side with the review or in its place, Close, "Back", Escape, where keyboard focus goes, and the document closing when its row leaves the review — story 80.
- A row that stands for two imports of one field — story 51.
- A document that was pasted text, opened from "From pasted text" — story 40 keeps one; story 31 owns how passages are drawn.
- The import's note above the changes — story 21.
- Keeping the document, and who may open it — enabler 03.
- Opening the document from the change history — story 29 (`later`).
- The review itself, Publish and the Review inbox — `publish-review`.

## Needs to know from elsewhere

- Each imported change records its quote and, when the reading said, where in the document it was read — owned by story 22 (R2).
- The import's document is kept with it, and only people who can edit or publish the project can open it — owned by enabler 03.
- A document kept as passages is drawn as its pages and passages; for pasted text no passage is marked — owned by story 31.
- The review lists a project's unpublished changes, one row per field, each with the difference from the published version — owned by `publish-review`.
- The Review inbox shows the same review for the project selected in it, so every requirement here holds there — owned by `publish-review`.

## Scenarios

All run against the recorded readings in `../fixtures.md`: the crew log's changes were added to Deer Creek, then the funder report's in a second import, and none is published. The scenarios use rows F3, C2 and C5 only.

**S1 — The document opens beside the difference** (proves R1)
- Given a Manager has Deer Creek's review open on a wide screen
- When they press "From deer-creek-completion-report-2025.pdf" on row F3, "Acres of invasive vegetation removed · 2025"
- Then `deer-creek-completion-report-2025.pdf` is shown beside the difference

**S2 — A PDF opens at the change's page** (proves R2)
- Given the same review, and row F3 was read from page 2
- When the Manager presses the button on row F3
- Then the PDF is at page 2

**S3 — The button is marked expanded** (proves R3)
- Given the document is open from row F3
- When the Manager presses "From deer-creek-crew-log-2025.xlsx" on row C5, "Volunteer hours contributed · 2025"
- Then row C5's button is marked expanded and row F3's is not

**S4 — Another row moves the document** (proves R4)
- Given the crew log is open from row C5
- When the Manager presses the button on row F3
- Then the document's place shows `deer-creek-completion-report-2025.pdf` at page 2

**S5 — A file that cannot be shown** (proves R8)
- Given the same review on a wide screen
- When the Manager presses "From deer-creek-crew-log-2025.xlsx" on row C5
- Then the document's place reads "This file can't be shown here." and shows "Row 12 — “Saturday workday, sign-in sheet, 140 hrs”"

**S6 — The quote follows the row** (proves R8)
- Given the crew log is open from row C5
- When the Manager presses "From deer-creek-crew-log-2025.xlsx" on row C2, "Native trees and shrubs planted · 2025"
- Then the document's place still reads "This file can't be shown here." and now shows "Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”"

**S7 — The same button again** (proves R1)
- Given the document is open from row F3
- When the Manager presses row F3's button again
- Then the document is still open, at page 2

## UAT script

Preconditions: stories 24 and 03 are built. From Deer Creek's starting state, a Contributor has added the crew log's changes and then, in a second import, the funder report's ready changes; nothing has been published since. Signed in as a Manager of Deer Creek Watershed Alliance, or an Administrator, on a laptop or desktop screen.
Test data: `../fixtures.md`: the crew log, row C5; the funder report, row F3. The funder report's other rows need stories 06 and 13 to 18; before those ship, any import that holds row F3 will do.
Reset: none needed: the script changes nothing on the record.

The script leaves the document open; closing it is story 80's script.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and press "Review changes" | The review, with the imported rows under their sections |
| 2 | Press "From deer-creek-completion-report-2025.pdf" on the row "Acres of invasive vegetation removed · 2025" that shows 4.2 acres | The PDF beside the review, under its name, at page 2 |
| 3 | Press the same button again | The PDF is still open, at page 2 |
| 4 | Press "From deer-creek-crew-log-2025.xlsx" on the row "Volunteer hours contributed · 2025" | In the PDF's place, under the crew log's name: "This file can't be shown here." and "Row 12 — “Saturday workday, sign-in sheet, 140 hrs”" |
| 5 | Press the same button on the row "Native trees and shrubs planted · 2025" | The quote changes to "Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”" |
| 6 | Press the button of step 2 again | The PDF again, at page 2 |

On the prototype: add both documents in the same browser first, by choosing a .xlsx file and then a PDF file from your computer; a "Sample" button keeps no file. See `../fixtures.md`, On the prototype.

## Open questions

- Q-66 — R8, S5, S6 and steps 4 and 5: if the reading returns passages for every file type, a spreadsheet or Word file opens at its passage, and R2 gains that case.
- Q-77 — R8: what the Manager sees when the kept document cannot be fetched; no scenario covers it yet.
- Q-97 — S1 and step 2: whether two entries for one performance measure and reporting period are two rows or one; both pick the row by its document's name so that they hold either way.
- Q-145 — would change R1, S7 and step 3: a second press would close the document.
- Q-117 — would change R2: where the document stands after moving to a change with no place recorded; adds a scenario.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | ACN-19, RUL-46; RUL-200, RUL-201 |
| R2 | decided; shown | ACN-19, RUL-46; RUL-202 |
| R3 | decided | ACN-19 |
| R4 | decided | ACN-19 |
| R8 | decided; shown | RUL-46; RUL-203 |

- Prototype files: `src/components/review/firma2-review-changes.astro` (which document a row opens, 620-626; opening and moving, 628-645; the expanded mark, 615-619; the click, 728-735); `src/lib/report-source.ts` (what is shown for each kind of document, 36-77; moving to a place, and the quote, 80-106); `src/components/shared/firma2-report-source.astro` (the document's name above it, 41-49); `src/lib/report-imports.ts` (the imported change and its document).
- Data shapes, as the prototype models them: an imported change holds its quote, and optionally a passage and a page. Its import holds the document: a name, and either the file or pages of passages.
- What the prototype does where nothing is decided (not requirements): a second press of the open row's button does nothing (Q-145); a PDF moved to a change with no page stays on the page it was at, although the rule written in the code is "with nothing to point at it shows the document from the top" (Q-117).
- Do not copy: the file read from the browser's own database, so the review shows documents only in the browser that imported them; a file the browser no longer holds shown as "This file can't be shown here." (Q-77); the PDF drawn by the browser's viewer from an in-memory address; the absence of any permission check.

</details>
