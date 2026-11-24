# 04 — A Contributor checks each change against the document beside it

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 01
Covers: SCR-2, STA-8, STA-22, STA-25, ACN-9, RUL-9, RUL-36, RUL-51, RUL-56, RUL-104, RUL-105, RUL-106, RUL-107, RUL-127
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #12; interview 2026-11-23, Q-20
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R10, on story 01's check step (its list of changes, quote and commit action are used here, not built here), against the recorded crew log reading in `../fixtures.md`, which stands in for enabler 02 (not built).
Built here, not showable until a later story: R2's "need you" (stories 14 and 75), "already on file" (story 32) and "kept by a data source" (story 16); R4 for a flagged change (story 14); R7's selecting by keyboard focus (story 06, which brings the first control on a change); R9's other two forms, the PDF and passages (story 31).
Waiting: the parts marked "Not decided" or "open", on Q-42, Q-54, Q-66, Q-67, Q-82, Q-98, Q-99, Q-110, Q-111 and Q-118, as named beside each.

## Story

As a Contributor, I want the document open beside the changes read from it, and each change to take me to the place it was read from, so that I can be sure that what goes on the record is what the report says.

## Description

This is the check step of Import a report, between the reading and "Add N changes". Story 01 lists the changes, each with its quote; this story makes them checkable. It puts the source document beside them, counts them in a tally, groups them, and lets the person select a change to see where it was read from. For a file that cannot be shown, such as the crew log's spreadsheet, the pane shows the selected change's quote. It describes a screen wider than 64rem; the narrow form is story 05. A PDF and a document held as passages are story 31. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`: choose a spreadsheet of your own to see R10. R9 and R10 moved here from story 31 on 2026-11-23.

## Requirements

R1. On a screen wider than 64rem, the check step shows the changes and the document pane side by side. The pane stays in view while the list of changes scrolls, and scrolls within itself. It is named "Source document" to assistive technology, and its content can be reached and scrolled by keyboard.

R2. One line above the changes, the tally, counts them in four parts, in this order, joined by " · ": "`<N>` ready to add · `<N>` need you · `<N>` already on file · `<N>` kept by a data source". A part whose count is zero is left out.
- "ready to add" counts the changes that "Add N changes" would add if pressed now, so it is always the number on that action. With story 01 alone that is every change.
- "need you" counts the flagged changes that are not ticked.
- "already on file" counts the changes the record already holds, ticked or not.
- "kept by a data source" counts the Key facts fields a data source keeps.
- Not decided: what the line shows when every part is zero, the wording for a count of one ("1 need you"), and a change that falls in two parts or in none (Q-110).

R3. Changes are grouped under headings named for the project page's sections, in that page's order: Key facts, Performance measures, Funding sources, Contacts. A change's kind decides its section. A section with no change has no heading. Not decided: what the check step shows when the reading proposes nothing (Q-42); whether the headings take the workspace's own words (Q-98); two identical changes in one reading, which are both listed (Q-99).

R4. The check step does not sort. Inside a section it lists the changes in the order the reading returned them. That order is set when the check step opens: nothing the person does there moves a change. The order itself is the reading's to give (enabler 02), and this story states it because story 02 leaves it here: changes that are ready come first, then flagged changes, those the report supports two readings of, then those where it counts another quantity; changes in the same state keep the order the document gave them. That ordering is `inferred`: only the developer-machine reader does it, and it waits to be confirmed (open: Q-54). Not decided: where a change in any other state goes (Q-67).

R5. The quote on each change is the document's words, copied exactly, with where they are written in front: "Row 7 — “Plants in ground: 1,850 …”". It is shown whole, however long. Where code did arithmetic to reach the amount, the arithmetic is shown with the quote. (open: Q-82, Q-118)

R6. When the check step opens, the first change in the list is selected, whatever its state. The selected change is marked: the whole change has a tinted background, and no other change has it. One change is selected at a time, and while the list has a change one always is: nothing clears the selection, and ticking, editing or a stopped import leaves it where it was. The tint is the only mark. Not decided: how the selection is conveyed to assistive technology (Q-111).

R7. Clicking anywhere on a change, including a control on it, or moving keyboard focus into it, selects it. The document pane then moves to the place that change was read from (R10 for a file that cannot be shown; story 31 for a PDF and for passages). With story 01 alone a change has no control that takes keyboard focus: story 01 shows the amount as read, the checkbox arrives with story 06 and the fields with story 07. Until then a change is selected by a click only. Not decided: how a change with no control on it is selected by keyboard, and how the selection is conveyed to assistive technology (Q-111).

R8. Selecting a change moves the document pane only. The selection never scrolls the list of changes, so the change being checked stays where the person left it. One thing still moves the list: when keyboard focus goes to a control on a change that is out of view, the browser brings that control into view, as it does on any page. The page adds no scrolling of its own to that and does not prevent it.

R9. The document pane shows the document in one of three forms. Which of the three it is follows from the document, in this order: a document held as passages is shown as passages; otherwise a PDF file is shown as itself; any other file cannot be shown. In all three the pane is headed by the document's name. Passages and the PDF are story 31 (R2, R1).

R10. A file that cannot be shown (a spreadsheet, a Word file, or a file that is no longer held) shows "This file can't be shown here." and, under it, the selected change's quote. Selecting another change replaces the quote with that change's. (open: Q-66)

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- A PDF shown as itself, and a document held as passages — story 31.
- The check step on a screen 64rem wide or narrower, and "Show source" — story 05.
- The checkbox on each change, and what a tick does to the tally — story 06. Editing a change — story 07.
- The Key facts, Funding sources and Contacts sections — stories 15, 17 and 18.
- Which changes are flagged — stories 14 and 75; "Already on file" — story 32; "Kept by a data source" — story 16.
- The arithmetic lines: the difference from a total to date — story 13; "Converted: …" — enabler 26 (`later`).
- "Not used" and "Skipped" — story 19. The note for the reviewer — story 21. The warning that the report names another project — story 20.
- The same document opened from the review, where a file may no longer be held — story 33.
- Which files can be chosen and read — stories 01 and 10. Keeping the document once the import is added — enabler 03.

## Needs to know from elsewhere

- The check step lists each proposed performance measure entry with its label, amount, breakdown answers, quote and note, and the page's one action stays in view — owned by story 01. Story 01 shows the amount as read, not in a field (story 01, R8).
- A ready change is one the person can add as it stands; with story 01 alone every change is ready — owned by story 06 (what arrives ticked) and story 14 (what is flagged).
- Each change that can be added has a checkbox — owned by story 06 (R1). A performance measure change shows its values as fields the person can edit — owned by story 07 (R1). These are the controls R7 and R8 speak of.
- The reading service produces the order R4 states; story 02 names no order of its own and points here — enabler 02, not built (Q-54).
- The reading gives each change its quote, and may give the page it was read from and the passage it points at — owned by enabler 02. Whether a reading of a file comes back with passages at all is not decided (Q-66): as recorded, a reading of a file has none, so a spreadsheet or a Word file cannot be shown.
- The document pane shows the file the person chose; nothing is kept until the import is added — owned by enabler 03.
- The breakpoints of phone, tablet and wider screens (SR-2) — owned by the mobile foundation spec. Its tablet layout runs up to and including 64rem.

## Scenarios

All run against the recorded crew log reading in `../fixtures.md`, on a screen wider than 64rem, with the crew log chosen as a file. Three things have no scenario here, because nothing shows them with story 01 alone:
- R2's other three parts. Each is proven where its state arrives (stories 14, 16, 75, 32).
- R4's order of ready and flagged changes. The recording arrives already in that order and holds no flagged change; the sort is the reading service's (Q-54).
- R7's keyboard focus, and R8's exception for it. No change has a control until story 06. Story 06 holds the scenario (its S8) and the step.

**S1 — The document pane sits beside the changes** (proves R1)
- Given the check step lists the crew log's six changes in a window too short to show all six
- When the Contributor scrolls the list to the last change
- Then the document pane is still in view beside the list

**S2 — The tally** (proves R2)
- Given the crew log's six changes, all ready
- When the check step opens
- Then the line above the changes reads "6 ready to add" and names no other part

**S3 — One section, one heading** (proves R3)
- Given the crew log proposes six performance measure entries and nothing else
- When the check step opens
- Then the changes sit under the heading "Performance measures", and no other section heading shows

**S4 — Changes keep the reading's order** (proves R4)
- Given the crew log's six changes, all ready
- When the check step opens
- Then they are listed in the fixture's order, C1 to C6

**S5 — The quote is the document's own words** (proves R5)
- Given the crew log's row 7 as the fixture gives it
- When the Contributor reads the quote on C2
- Then it is "Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”": the row's words exactly, with the row named in front

**S6 — The first change is selected on opening** (proves R6)
- Given the crew log has been sent to be read
- When the check step opens
- Then C1 has the tinted background that marks the selected change, and no other change has it

**S7 — Clicking a change selects it** (proves R7)
- Given the check step lists the crew log's six changes, with C1 selected
- When the Contributor clicks C5
- Then C5 is marked as selected and C1 no longer is

**S8 — Selecting does not move the list** (proves R7, R8)
- Given the list is scrolled so that C5 is in the middle of the window
- When the Contributor clicks C5
- Then C5 is where it was in the window

**S9 — A spreadsheet cannot be shown** (proves R9, R10)
- Given the crew log, `deer-creek-crew-log-2025.xlsx`, has been read from the file control
- When the check step opens with C1 selected
- Then the document pane is headed `deer-creek-crew-log-2025.xlsx` and shows "This file can't be shown here." and C1's quote

**S10 — The quote follows the selection** (proves R10)
- Given the document pane shows "This file can't be shown here." and C1's quote
- When the Contributor selects C2
- Then the quote in the pane is C2's: "Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”"

## UAT script

A PDF and a document held as passages are story 31. Selecting a change by keyboard has no step: no change has a control to take focus until story 06 is built (Q-111).

Preconditions: story 01's UAT script has been run to its step 5 in a laptop or desktop window wider than 64rem, so the check step lists the crew log's changes.
Test data: `../fixtures.md`: the crew log's rows 3 to 14 and rows C1 to C6. Rows C3 and C4, and so the count of six, wait on Q-82. No fixture has a flagged change, a second section or an arithmetic line that this story's blockers can show: see stories 13, 14, 15, 17 and 18.
Reset: none needed if you stop here; the script adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Look at the page | The changes on one side and the document pane on the other |
| 2 | Read the line above the changes | "6 ready to add" |
| 3 | Read the heading above the changes | "Performance measures", and no other section heading |
| 4 | Compare the order of the changes with rows C1 to C6 | The same order |
| 5 | Open the crew log on your computer, find row 7, and compare it with the quote on "Native trees and shrubs planted · 2025" | The same words, with "Row 7 — " in front |
| 6 | Look at the first change | It has a tinted background; no other change has |
| 7 | Look at the document pane | The file's name, "This file can't be shown here." and, under it, the quote of the first change, C1 |
| 8 | Click "Native trees and shrubs planted · 2025" | That change is tinted and the first no longer is; the quote in the pane is now that change's, row C2 |
| 9 | Click "Volunteer hours contributed · 2025" | That change is tinted and no other is; the quote in the pane is row C5's; the change you clicked has not jumped |
| 10 | Make the window short and scroll the list to its end | The document pane is still in view |

On the prototype: choose a spreadsheet from your computer; any spreadsheet reads as the crew log. "Sample crew log" shows the sample as passages instead, which is story 31. The prototype also draws a "Converted: …" line on C3 and C4, and gives every change a checkbox and fields from the start (stories 06 and 07). See `../fixtures.md`, On the prototype.

## Open questions

- Q-42 — R3: the state for a reading that proposes nothing; no scenario covers it yet.
- Q-54 — R4: the order the reading returns is the writer's reading of the developer-machine reader and waits to be confirmed. That the check step itself does not sort is not in question.
- Q-66 — R10, S9, S10 and steps 7 and 8: if a reading returns every kind of file as passages, a spreadsheet or Word file is shown as passages with the passage marked (story 31, R2), R10 is left with the file that is no longer held, and S9, S10 and the two steps change.
- Q-67 — R4: where a change that is already on file, kept by a data source, unsure or "Not in this workspace" is placed.
- Q-82 — S2 to S4 and steps 2 and 4: the count of six; R5: which arithmetic the first release does and shows.
- Q-88 — Preconditions: how the recorded reading is served.
- Q-110 — would change R2: what the tally reads with every part at zero, for a count of one, and for a change in two parts or in none; an answer adds a scenario here or in story 06.
- Q-111 — would change R6 and R7: a way to select a change that has no control by keyboard, which would add a scenario and a step here; and whether the selection, which a tint alone shows, is conveyed to assistive technology.
- Q-99 — would change R3: whether two identical changes in one reading are both listed, or one is folded or flagged.
- Q-98 — would change R3 and S3: the headings would read as the workspace's words for Performance measure, Funding source and Contact.
- Q-118 — would change R5: whether a sum of added lines is shown as arithmetic, and under what label.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | STA-8, SCR-2; RUL-107 |
| R2 | decided; shown | STA-8; RUL-104 |
| R3 | decided | RUL-9, STA-8 |
| R4 | shown; inferred | RUL-105; RUL-56 |
| R5 | shown | RUL-36 |
| R6 | shown | STA-22; RUL-106 |
| R7 | decided; shown | ACN-9; RUL-106 |
| R8 | shown | RUL-51 |
| R9 | shown | RUL-127 |
| R10 | shown | STA-25 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the tally at 725-739; groups at 340, 354-355 and 912-933, which filter by section and never sort; selection at 698-713 and 942-943, which marks the change and moves the pane and scrolls nothing else; the tint at 257-260; the two columns at 207-228; what the pane is given, 531-539); `src/components/shared/firma2-report-source.astro` (the pane) and `src/lib/report-source.ts` (which of the three forms is shown at 37-76; the quote under "This file can't be shown here." at 72-76 and 101-105); `scripts/report-reader.mjs` (441-443, the only place proposals are sorted).
- Data shapes, as the prototype models them: each proposed change carries its quote and any arithmetic, and may point at one passage and one page of the document. The document is a name plus either a file or pages of passages; a chosen file is held as the file alone, with no passages.
- What the prototype does where nothing is decided (not requirements): a reading that proposes nothing shows an empty tally line, no heading and "Nothing ticked" (Q-42); its samples are ordered by hand, and only the developer-machine reader sorts (Q-54, Q-67); the tally line is empty when every part is zero, reads "1 need you" for one, counts a ticked "Already on file" change in two parts and an unticked ready change in none (Q-110); the selected change is shown by a tint alone, and a change with no checkbox or field cannot take keyboard focus (Q-111); a file is a PDF when its type says so or its name ends in ".pdf".
- Do not copy: the samples' hand-written "Converted: …" lines (enabler 26, `later`; Q-82); the "Check this" and "Unsure" badges, which were struck (Q-25); a kept field whose value equals the record's being counted twice in the tally; every change carrying a checkbox, an amount field and a reporting period from the start, which in these stories arrive with 06 and 07; the scripted readings, which give a chosen file the sample's changes whatever it holds.

</details>
