# 31 — A Contributor sees a PDF report as itself, and a document held as passages with the change's passage marked

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 04, 09
Covers: STA-23, STA-24, RUL-128, RUL-129
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #12
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 and R2, in story 04's document pane (the pane, the selection and the choice between the three forms are used here, not built here). R1 is shown with a PDF whose recorded reading proposes performance measure entries only, which no fixture has. R2's drawing of pages and passages is shown with the pasted paragraph of story 09. Waiting: which files, if any, come back from a reading as passages, in R2, on Q-66, and with it any way to show R2's mark in the first release; a change with no page or passage, in R1 and R2, on Q-117; what heads the pane for pasted text on Q-158.

## Story

As a Contributor, I want the document I chose shown beside the changes in the fullest form its kind of file allows, so that I can check each change against the report's own words.

## Description

Story 04 puts the document pane beside the proposed changes, moves it when a change is selected, and shows the quote alone for a file that cannot be shown. This story is the two fuller forms: a PDF file shown as itself, and a document held as passages. It says what "the place a change was read from" is for each. The same pane is used on a narrow screen (story 05) and in the review (story 33). Split from story 04 on 2026-11-23; on the same day the file that cannot be shown, and the rule for which form a document takes, moved back to story 04 (R10, R9). See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`: choose a PDF of your own for R1, and press "Sample funder report" for R2.

## Requirements

R1. A PDF file is shown as the PDF itself, at the page the selected change was read from. Selecting another change moves it to that change's page. Not decided: what the pane does for a change that carries no page (Q-117).

R2. A document held as passages shows each page under its label, and each passage with its heading and its lines. When the selected change points at a passage, the whole passage is marked, not the quoted words inside it, and is brought to the top of the pane; the mark leaves the passage marked before. Selecting the same change again brings its passage back if the person had scrolled the pane away. Several changes may point at one passage. Not decided: what the pane does for a change that points at no passage (Q-117). (open: Q-66)

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Putting the document pane beside the changes, and selecting a change — story 04.
- Which of the three forms a document takes, the document's name at the head of the pane, and a file that cannot be shown — story 04 (R9, R10).
- The document pane on a screen 64rem wide or narrower — story 05.
- Pasting text and reading it — story 09. Pasted text is this story's one document held as passages in the first release.
- The same pane opened from the review, where a file may no longer be held — story 33.
- Which files can be chosen and read — stories 01 and 10.
- Keeping the document once the import is added — enabler 03.

## Needs to know from elsewhere

- The first change is selected when the check step opens, one change is always selected, and clicking a change or moving keyboard focus into it selects it — owned by story 04.
- Which of the three forms a document takes, and a file that cannot be shown — owned by story 04 (R9, R10). A document held as passages is shown as passages; otherwise a PDF file is shown as itself; any other file shows "This file can't be shown here." and the selected change's quote. The pane is headed by the document's name.
- The reading gives each change its quote, and may give the page it was read from and the passage it points at — owned by enabler 02. Whether a reading of a file comes back with passages at all is not decided (Q-66): as recorded, a reading of a file has none, so in the first release the only document held as passages is pasted text (story 09).
- Pasting text and having it read — owned by story 09 (R4), which leaves the text shown beside the changes to this story. Pasted text is this story's one document held as passages in the first release. As recorded, the changes read from it point at no passage.
- The document pane shows the file the person chose; nothing is kept until the import is added — owned by enabler 03.

## Scenarios

No fixture shows S1 and S2 with this story's blockers alone: the one PDF fixture, the funder report, also proposes changes of stories 13, 14, 15, 17, 18, 32 and 75. They describe the PDF by kind: its recorded reading proposes performance measure entries only. S3 describes its document by kind too, and can be run against the pasted paragraph of `../fixtures.md` once story 09 is built: that document is one page holding one passage, the paragraph, with no heading. S4 and S5 have no fixture and cannot be run in the first release: no file comes back as passages, and the pasted paragraph's changes point at no passage (Q-66).

**S1 — A PDF is shown as itself** (proves R1)
- Given a PDF file of three pages has been read, and its first change was read from page 1
- When the check step opens
- Then the document pane shows the PDF itself, at page 1

**S2 — The PDF follows the selection** (proves R1)
- Given the document pane shows that PDF at page 1, and another change was read from page 3
- When the Contributor selects that change
- Then the PDF shows page 3

**S3 — A document held as passages** (proves R2)
- Given a document held as passages, of two pages or more
- When the check step opens
- Then the document pane shows the document's name, each page under its label, and each passage with its heading and lines

**S4 — The selected change's passage is marked** (proves R2)
- Given a document held as passages, and a change that points at one of its passages, out of view in the pane
- When the Contributor selects that change
- Then that passage is marked, no other passage is, and it is at the top of the pane

**S5 — Selecting again brings the passage back** (proves R2)
- Given a change is selected, its passage is marked, and the Contributor has scrolled the pane until the passage is out of view
- When they click the same change
- Then its passage is at the top of the pane again

## UAT script

Steps 1 to 3 need a PDF the tester brings, with a recorded reading served for it; without one, start at step 4. R2's mark has no step: no file comes back as passages, and the pasted paragraph's changes point at no passage (Q-66). The file that cannot be shown is story 04's script.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person), in a laptop or desktop window wider than 64rem. Stories 04 and 09 are built. The recorded reading of the pasted paragraph is served for that text.
Test data: `../fixtures.md`: the pasted paragraph, rows P1 to P3. Brought by the tester, because no fixture has one: a PDF of three pages or more whose recorded reading proposes performance measure entries only, the first read from page 1 and another from page 3. The funder report will not do: it needs stories 13, 14, 15, 17, 18, 32 and 75.
Reset: none needed; the script adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import report", choose the PDF, press "Read it" and wait | The changes, and beside them the PDF itself, at page 1 |
| 2 | Click the change that was read from page 3 | The PDF shows page 3 |
| 3 | Click the first change | The PDF shows page 1 |
| 4 | Go back to the project page by the breadcrumb and press "Import report" | The choose step, with no file held |
| 5 | Choose "Paste text", paste the paragraph from the fixture, press "Read it" and wait | Three changes, and beside them the paragraph itself as text, under one page label; "This file can't be shown here." is not shown |

On the prototype: choose a PDF from your computer for steps 1 to 3; any PDF reads as the funder report, with all 14 of its changes ("Native trees and shrubs planted · 2025" was read from page 3, "Timeline" from page 1). The paragraph is already in the text area. "Sample crew log" and "Sample funder report" show the samples as passages, with the selected change's passage marked: that is the mark of R2, and the only place to see it. See `../fixtures.md`, On the prototype.

## Open questions

- Q-66 — R2 and S3 to S5: whether any file comes back as passages. If every kind does, a spreadsheet or Word file is shown as passages with the passage marked, S4 and S5 can be run, and story 04's R10 is left with the file that is no longer held.
- Q-88 — Preconditions: how the recorded readings are served, the tester's PDF included.
- Q-117 — would change R1 and R2 and add a scenario: what the pane shows for a selected change that carries no page or passage, and whether a PDF returns to a change's page when the person has scrolled it away.
- Q-158 — would change S3 and step 5, and story 04, R9: what heads the pane, and labels the page, when the document is pasted text.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | STA-24; RUL-129; relies on story 04, RUL-127 |
| R2 | shown | STA-23; RUL-128; relies on story 04, RUL-127 |

- Prototype files: `src/lib/report-source.ts` (drawing the PDF and the passages at 46-70; moving to a change's place at 79-99) and `src/components/shared/firma2-report-source.astro` (the pane); `src/components/projects/firma2-project-report-import.astro` (what the pane is given, 512-539 and 698-703).
- Data shapes, as the prototype models them: the document is a name plus either a file or pages (a label, and passages each with an optional heading and lines). A chosen file is held as the file alone, with no passages; a sample or pasted text has no file and is held as its passages. A change may point at one passage and carry one page number.
- What the prototype does where nothing is decided (not requirements): for a change with no page the PDF stays on the page of the change selected before, and for a change with no passage the mark is taken off and the pane stays where it was, with nothing saying so; a PDF the person has scrolled away from a page does not go back when another change of that same page is selected (Q-117); for pasted text the pane is headed "Pasted text" and its one page is labelled "Pasted text" too (Q-158); pasted text is cut into passages at blank lines, one passage a paragraph, with no heading (Q-139).
- Do not copy: the PDF shown from the page's memory in the browser's own viewer, which stands in for a document viewer served from storage; the scripted readings, which give a chosen file the sample's changes and page numbers whatever it holds; the demo buttons, the only route by which a document reaches the pane as passages with a passage marked.

</details>
