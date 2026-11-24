# 80 — A Manager keeps the document beside the review while judging, and closes it

Type: story
Epic: C — Imported changes in review
Release: first
Status: needs-info
Revision: 1
Blocked by: 33
Covers: STA-35, ACN-20, RUL-204, RUL-205, RUL-206, RUL-207
Sources: the project's review, `/prototypes/review/deer-creek-riparian-corridor-enhancement`, after adding a report; the Review inbox, `/prototypes/review`; spec #31
Snapshot: not yet captured
Read with: `../epics/E-C-imported-changes-in-review.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, ACN) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R5, once story 33 is built (it opens the document from a row's button and moves it; this story does not) and inside the review and the Review inbox that `publish-review` owns. Only against the recorded readings in `../fixtures.md` until enabler 02 is built. Waiting: Escape with focus outside the document, in R3, on Q-146.

## Story

As a Manager, I want the document to stay beside the changes while I read down them, and to close it and be back where I was, so that I can judge one change after another against its source without losing my place.

## Description

Story 33 opens an imported change's document from the row's button and moves it from row to row. This story is where the document sits and how it goes away: beside the review on a wide screen, in the review's place on a narrow one, closed by the person or by its row leaving the review, with keyboard focus put back. Split from story 33 on 2026-11-23, when the builder's checklist took that story past eight scenarios; its R5, R6 and R7 are R1, R2 and R3 here. See it at `/prototypes/review/deer-creek-riparian-corridor-enhancement`, after adding a PDF in the same browser, and in the Review inbox at `/prototypes/review`.

## Requirements

R1. On a screen 64rem wide or more, the review and the open document are side by side. The document stays in view while the review scrolls, scrolls inside itself, and has a button named "Close document". Opening the document, or moving it to another row, does not scroll the review. Keyboard focus stays on the button that was pressed.

R2. On a narrower screen the open document takes the review's place, starting at the top of the screen under the top bar, with "Back" as its first control. Keyboard focus moves to "Back". Which of R1 and R2 applies follows the screen's width at every moment, also while a document is open.

R3. "Close document", "Back" and the Escape key each close the document. Keyboard focus returns to the button the document was last opened from, and on a narrow screen that row is brought back into view. With the document closed the review has its full width again. Not decided: Escape while keyboard focus is outside the document, which is where R1 leaves it (Q-146).

R4. The document closes by itself when the row it was opened from leaves the review: its change was published, or its import was taken back. This close does not move keyboard focus.

R5. In the Review inbox, the list of projects steps aside while a document is open, so that the changes and the document have the two columns, and returns when the document closes.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Opening the document from a row, the place it opens at, moving it to another row, the expanded mark, and a file that cannot be shown — story 33.
- The imported row and the button's wording — story 24. A row that stands for two imports — story 51.
- The same pane beside the proposed changes on the Import a report page, and "Show source" there — stories 04 and 05.
- Keeping the document, and who may open it — enabler 03.
- The review itself, Publish, the Review inbox and its list — `publish-review`.

## Needs to know from elsewhere

- Pressing "From `<document name>`" on an imported row opens that import's document at the place the change was read from; pressing another row's button moves it — owned by story 33.
- A published change leaves the review; Publish, and where keyboard focus goes after it — owned by `publish-review`. An import taken back takes its rows with it — owned by story 23, not needed here.
- The Review inbox lists the projects that have changes waiting and shows, beside the list, the review of the one selected — owned by `publish-review`.
- 64rem is the width at which a second column is given room (SR-2) — owned by the mobile foundation spec.

## Scenarios

All run against the recorded readings in `../fixtures.md`: the crew log's changes were added to Deer Creek, then the funder report's in a second import, and none is published. Every scenario opens the document from row F3, "Acres of invasive vegetation removed · 2025", whose button reads "From deer-creek-completion-report-2025.pdf".

**S1 — Wide: side by side, and it stays** (proves R1)
- Given the document is open from row F3 on a screen 64rem wide or more
- When the Manager scrolls the review to its last row
- Then the document is still in view beside the review, with a "Close document" button

**S2 — Narrow: in the review's place** (proves R2)
- Given Deer Creek's review is open on a screen narrower than 64rem
- When the Manager presses the button on row F3
- Then the document is shown in the review's place, with "Back" first

**S3 — Narrow: focus goes to "Back"** (proves R2)
- Given the same narrow screen, with keyboard focus on row F3's button
- When the Manager presses that button with the keyboard
- Then keyboard focus is on "Back"

**S4 — Closing returns focus** (proves R3)
- Given the document is open from row F3 and keyboard focus is inside the document
- When the Manager presses Escape
- Then the document closes, the review has its full width, and keyboard focus is on row F3's button

**S5 — The document closes with its row** (proves R4)
- Given the document is open from row F3
- When the Manager publishes Deer Creek
- Then row F3 has left the review and the document is closed

**S6 — In the Review inbox the list steps aside** (proves R5)
- Given Deer Creek is selected in the Review inbox on a wide screen
- When the Manager presses the button on row F3
- Then the list of projects is not shown, and Deer Creek's changes and the document are side by side

## UAT script

Preconditions: story 33 is built. From Deer Creek's starting state, a Contributor has added the crew log's changes and then, in a second import, the funder report's ready changes; nothing has been published since. Signed in as a Manager of Deer Creek Watershed Alliance, or an Administrator, on a laptop or desktop screen with a keyboard.
Test data: `../fixtures.md`: the funder report, row F3. Before the stories that add its other rows ship, any import that holds row F3 will do.
Reset: none needed: the script changes nothing on the record. S5 publishes, so the script does not walk it.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Review changes", and press "From deer-creek-completion-report-2025.pdf" on the row "Acres of invasive vegetation removed · 2025" that shows 4.2 acres | The PDF beside the review, with a "Close document" button |
| 2 | Scroll the review to its last row | The PDF is still in view |
| 3 | Press "Close document" | The document closes; the review has its full width; keyboard focus is on the button you pressed in step 1 |
| 4 | Narrow the window below 64rem and press the same button with the keyboard | The PDF takes the review's place, with "Back" first and keyboard focus on it |
| 5 | Press "Back" | The review, with that row in view and keyboard focus on its button |
| 6 | Widen the window again, open the Review inbox, select Deer Creek and press the same button | The list of projects steps aside; the changes and the PDF are side by side |
| 7 | Press Tab until focus is inside the document, then press Escape | The document closes, the list of projects is back, and keyboard focus is on the button |

On the prototype: add both documents in the same browser first, by choosing a .xlsx file and then a PDF file from your computer; a "Sample" button keeps no file. See `../fixtures.md`, On the prototype.

## Open questions

- Q-97 — the scenarios and step 1: whether two entries for one performance measure and reporting period are two rows or one; each picks the row by its document's name so that it holds either way.
- Q-146 — would change R3, S4 and step 7: Escape would close the document from anywhere in the review, or focus would move into the document on opening.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | STA-35; RUL-204 |
| R2 | decided; shown | STA-35; RUL-204, RUL-205 |
| R3 | shown | ACN-20; RUL-205 |
| R4 | shown | RUL-206 |
| R5 | shown | RUL-207 |

- Prototype files: `src/components/review/firma2-review-changes.astro` (the two layouts, 264-286; opening, and focus on a narrow screen, 628-645; closing and focus, 647-666; closing when the row has left, 595-596); `src/components/review/firma2-review-inbox.astro` (the list steps aside, 216-221); `src/components/shared/firma2-report-source.astro` (the document scrolls inside itself; "Back", 41-49 and 74-92).
- Data shapes: none of its own. The open document is a state of the screen, not of the record.
- What the prototype does where nothing is decided (not requirements): Escape closes the document only while keyboard focus is inside it; on a wide screen focus stays on the row's button after opening, so Escape there does nothing (Q-146).
- Do not copy: the PDF drawn by the browser's viewer from an in-memory address; the absence of any permission check.

</details>
