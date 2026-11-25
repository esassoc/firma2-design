# 31 — A Contributor sees a PDF report as itself, at the page each change was read from

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-117, Q-158
Revision: 1
Blocked by: 04, 09
Covers: STA-24, RUL-129, RUL-188, RUL-392, RUL-393
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #12, #42
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 and R2, in story 04's document pane (the pane, the selection and the passages form are used here, not built here). R1 against the recorded sample `deer-creek-treatments-2025.pdf` (to be made); R2 against the recorded reading of the pasted paragraph, with story 09. Nothing waits.

## Story

As a Contributor, I want the PDF I chose shown as itself beside the changes, at the page each change was read from, so that I can check each change against the report's own pages.

## Description

Story 04 puts the document pane beside the proposed changes, moves it when a change is selected, and shows every document that is not a PDF as passages. This story is the other form: a PDF file shown as the PDF itself, where "the place a change was read from" is a page. It also says how pasted text, which has no file name and no pages, is headed and laid out in the pane. The same pane is used on a narrow screen (story 05). The PDF is shown from the file the person chose, while they check; it is not kept after the import is added (spec #42). The passages form, which this story held until 2026-11-23, is now story 04's (R11). See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`: choose a PDF of your own for R1, and "Paste text" for R2.

## Requirements

R1. A PDF file is shown as the PDF itself, at the page the selected change was read from. Selecting another change moves it to that change's page.
- Selecting a change always brings its page back: also when the person has scrolled the PDF away and the change they select was read from the page the pane last opened at.
- Selecting a change that carries no page takes the PDF to its start and shows one line in the pane: "No place marked for this change." The quote stays on the change itself.

R2. Pasted text is shown as passages (story 04, R11) under the heading "Pasted text", which stands where a file's name would. It has no page label: its paragraphs sit directly under the heading. Each paragraph is one passage with no heading. A blank line in the pasted text starts a new paragraph; a single line break stays inside its paragraph; spaces around a paragraph, and empty paragraphs, are dropped.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Putting the document pane beside the changes, and selecting a change — story 04.
- A document shown as passages, the mark on the selected change's passage, a change that points at no passage, and a document that fails to show — story 04 (R9 to R12).
- The document pane on a screen 64rem wide or narrower — story 05.
- Pasting text and reading it — story 09. Naming an import from pasted text once it is added — story 40.
- Which files can be chosen and read — stories 01 and 10.
- The document after the import is added: it is not kept, and nothing opens it (spec #42).

## Needs to know from elsewhere

- The first change is selected when the check step opens, one change is always selected, and clicking a change or moving keyboard focus to it selects it — owned by story 04 (R6, R7).
- The pane shows a PDF as itself and every other document as passages, headed by the document's name; a selected change's passage is marked and brought to the top — owned by story 04 (R9, R11).
- The reading gives each change its quote and the place it was read from: a page for a PDF, a passage for any other document — owned by enabler 02 (R6). For pasted text the quote has no place in front.
- Pasting text and having it read, which leaves the text shown beside the changes to this story — owned by story 09 (R4).

## Scenarios

S1 to S3 run against the recorded sample `deer-creek-treatments-2025.pdf` (`../fixtures.md`): three pages, T1 read from page 1 and T2 from page 3. S5 runs against the pasted paragraph, rows P1 to P3. No sample holds the data of S4 and S6; each describes its document by kind.

**S1 — A PDF is shown as itself** (proves R1)
- Given the treatments sample has been sent to be read
- When the check step opens, with T1 selected
- Then the document pane shows the PDF itself, at page 1

**S2 — The PDF follows the selection** (proves R1)
- Given the document pane shows the treatments sample at page 1
- When the Contributor selects T2
- Then the PDF shows page 3

**S3 — Selecting brings the page back** (proves R1)
- Given T2 is selected, and the Contributor has scrolled the PDF back to page 1
- When they click T2 again
- Then the PDF shows page 3

**S4 — A change with no page** (proves R1)
- Given a PDF of several pages shown at page 3, and a change whose reading carries no page
- When the Contributor selects that change
- Then the PDF is at its first page and the pane shows "No place marked for this change."

**S5 — Pasted text is headed "Pasted text"** (proves R2)
- Given the pasted paragraph has been read
- When the check step opens
- Then the document pane is headed "Pasted text" and shows the paragraph directly under it, with no page label

**S6 — Paragraphs are cut at blank lines** (proves R2)
- Given a pasted text of three blocks separated by blank lines, the second holding one single line break
- When it has been read and the check step opens
- Then the pane shows three paragraphs, and the second still holds its line break

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person), in a laptop or desktop window wider than 64rem. The test environment serves the recorded sample `deer-creek-treatments-2025.pdf` and the recorded reading of the pasted paragraph. Stories 01, 04 and 09 are built.
Test data: `../fixtures.md`: the treatments sample (to be made), rows T1 and T2; the pasted paragraph, rows P1 to P3.
Reset: none needed; the script adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import a report", choose `deer-creek-treatments-2025.pdf`, press "Read it" and wait | Two changes, "2 ready to add", and beside them the PDF itself, at page 1, under the file's name |
| 2 | Click "Native trees and shrubs planted · 2024" | The PDF shows page 3 |
| 3 | Scroll the PDF back to page 1, then click the same change again | The PDF shows page 3 again |
| 4 | Click "Acres of invasive vegetation removed · 2025" | The PDF shows page 1 |
| 5 | Go back to the project page by the breadcrumb and press "Import a report" | The choose step, with no file held |
| 6 | Choose "Paste text", paste the paragraph from the fixture, press "Read it" and wait | Three changes, and beside them the paragraph as text under the heading "Pasted text", with no page label above it; "This file can't be shown here." is not shown |

On the prototype: choose a PDF from your computer for steps 1 to 4; any PDF reads as the funder report, with all 14 of its changes ("Native trees and shrubs planted · 2025" was read from page 3, "Timeline" from page 1). The paragraph is already in the text area, and its one page is labelled "Pasted text" a second time. See `../fixtures.md`, On the prototype.

## Open questions

None open. The proposals this story rests on:

- Q-117 (proposed) — R1, S3, S4: a change with no page; selecting a change always brings its page back.
- Q-158 (proposed) — R2, S5, step 6: the heading "Pasted text", and no page label.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; proposed (Q-117) | STA-24, RUL-129; RUL-392; relies on story 04, RUL-127 |
| R2 | shown; proposed (Q-158) | RUL-188; RUL-393; relies on story 04, RUL-128 |
- R2 was the passages form until 2026-11-23; that rule, with STA-23 and RUL-128, is now story 04, R11. RUL-188 came here from story 40 the same day.
- Prototype files: `src/lib/report-source.ts` (drawing the PDF at 67-70; moving to a change's place at 79-99) and `src/components/shared/firma2-report-source.astro` (the pane); `src/components/projects/firma2-project-report-import.astro` (what the pane is given, 512-539 and 698-703; pasted text cut into paragraphs, 517-538).
- Data shapes, as the prototype models them: the document is a name plus either a file or pages (a label, and passages each with an optional heading and lines). A change may point at one passage and carry one page number.
- Where the prototype differs from the requirements above: for a change with no page the PDF stays on the page of the change selected before, with nothing saying so; a PDF the person has scrolled away from a page does not go back when a change of that same page is selected; for pasted text the one page is labelled "Pasted text" under a heading that already says so.
- Do not copy: the PDF shown from the page's memory in the browser's own viewer, which stands in for a document viewer; the scripted readings, which give a chosen file the sample's changes and page numbers whatever it holds.

</details>
