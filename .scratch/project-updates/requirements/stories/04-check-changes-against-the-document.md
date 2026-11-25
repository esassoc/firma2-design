# 04 — A Contributor checks each change against the document beside it

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-42, Q-54, Q-66, Q-67, Q-98, Q-110, Q-111, Q-117, Q-118
Revision: 1
Blocked by: 01
Covers: SCR-2, STA-8, STA-22, STA-23, STA-25, ACN-9, RUL-9, RUL-36, RUL-51, RUL-56, RUL-104, RUL-105, RUL-106, RUL-107, RUL-127, RUL-128, RUL-253, RUL-254, RUL-255, RUL-256, RUL-257, RUL-258, RUL-259, RUL-260, RUL-261, OBJ-5
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #12, #42; interview 2026-11-23, Q-20
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R12, on story 01's check step (its list of changes, quote and commit action are used here, not built here), against the recorded sample `deer-creek-crew-log-2025.xlsx`.
Built here, not showable until a later story: R2's "need you" (stories 14 and 75), "left out" (story 06), "already on file" (story 32) and "kept by a data source" (story 16); R4's order past the ready changes (the same stories); R9's PDF form (story 31).

## Story

As a Contributor, I want the document open beside the changes read from it, and each change to take me to the place it was read from, so that I can be sure that what goes on the record is what the report says.

## Description

This is the check step of Import a report, between the reading and "Add N changes". Story 01 lists the changes, each with its quote; this story makes them checkable. It puts the source document beside them, counts them in a tally, groups and orders them, and lets the person select a change to see where it was read from. It also holds the form every document that is not a PDF takes in the pane: passages, with the selected change's passage marked. That form moved here from story 31 on 2026-11-23, because the crew log, a spreadsheet, is now shown and no longer "can't be shown". The document is in hand only while the person checks: nothing here is kept once the import is added (spec #42). This story describes a screen wider than 64rem; the narrow form is story 05. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with "Sample crew log".

## Requirements

R1. On a screen wider than 64rem, the check step shows the changes and the document pane side by side. The pane stays in view while the list of changes scrolls, and scrolls within itself. It is named "Source document" to assistive technology, and its content can be reached and scrolled by keyboard.

R2. One line above the changes, the tally, counts them in five parts, in this order, joined by " · ": "`<N>` ready to add · `<N>` need you · `<N>` left out · `<N>` already on file · `<N>` kept by a data source". For a count of one the second part reads "1 needs you"; the others do not change. A part whose count is zero is left out.
- "ready to add" counts the ticked changes, so it is always the number on "Add N changes". With story 01 alone that is every change.
- "need you" counts the changes that arrived unticked and wait on the person, while they are not ticked.
- "left out" counts the changes the person unticked.
- "already on file" counts the changes the record already holds, while they are not ticked.
- "kept by a data source" counts the Key facts fields a data source keeps.
- Every change is counted in exactly one part, so the parts add up to the changes listed and the line is never empty while a change is listed.

R3. Changes are grouped under headings named for the project page's sections, in that page's order: Key facts, Performance measures, Funding sources, Contacts. A change's kind decides its section. A section with no change has no heading. A heading that names a renameable noun shows the workspace's own word, in its plural.
- When the reading proposes nothing, the check step still opens, with the document in the pane, the line "Nothing in this report can be added to this project." in place of the tally and the changes, the "Not used" and "Skipped" lists if the reading has any (story 19), and no commit action.

R4. The check step sorts the changes itself, whatever order the reading returns them in. Inside a section the order is: ready changes; then "Needs you"; then "Not in this workspace"; then "Already on file"; then "Kept by a data source". Changes in the same state keep the order the document states them in. The order is set when the check step opens: nothing the person does there, unticking included, moves a change.

R5. The quote on each change is the document's words, copied exactly, with where they are written in front: "Row 7 — “Plants in ground: 1,850 …”". It is shown whole, however long. Where the amount is the sum of several lines, the sum is shown under the quote: "Added: 3.5 + 2 = 5.5 acres". The first release works out and shows no other arithmetic here (a total to date is story 13).

R6. When the check step opens, the first change in the list is selected, whatever its state. The selected change is marked: the whole change has a tinted background, no other change has it, and it is marked as the current item for assistive technology. One change is selected at a time, and while the list has a change one always is: nothing clears the selection, and ticking, editing or a stopped import leaves it where it was.

R7. Clicking anywhere on a change, including a control on it, or moving keyboard focus into it, selects it. A change with no control of its own takes keyboard focus itself, as one stop in the list's order. The document pane then moves to the place that change was read from. The pane's move is not announced.

R8. Selecting a change moves the document pane only. The selection never scrolls the list of changes, so the change being checked stays where the person left it. One thing still moves the list: when keyboard focus goes to a change, or a control on it, that is out of view, the browser brings it into view, as it does on any page. The page adds no scrolling of its own to that and does not prevent it.

R9. The document pane shows the document in one of two forms: a PDF as itself (story 31, R1), and every other document as passages (R11). In both the pane is headed by the document's name; the heading for pasted text is story 31's (R2).

R10. When the document fails to show in the pane, the pane shows "This file can't be shown here." and, under it, the selected change's quote. Selecting another change replaces the quote with that change's. Nothing else on the check step is affected: the changes can still be added.

R11. A document shown as passages shows each page under its label, and each passage with its heading and its lines. When a change is selected, the whole passage it points at is marked, not the quoted words inside it, and is brought to the top of the pane; the mark leaves the passage marked before. Selecting the same change again brings its passage back if the person had scrolled the pane away. Several changes may point at one passage.

R12. Selecting a change that points at no passage takes the pane to the document's start, clears the mark left from another change, and shows one line in the pane: "No place marked for this change." The quote stays on the change itself.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- A PDF shown as itself, and pasted text's heading — story 31.
- The check step on a screen 64rem wide or narrower, and "Show source" — story 05.
- The checkbox on each change, and what a tick does to the tally — story 06. Editing a change — story 07.
- The Key facts, Funding sources and Contacts sections — stories 15, 17 and 18.
- Which changes need the person — stories 14 and 75; "Already on file" — story 32; "Kept by a data source" — story 16.
- A thing the reading states twice: an entry is listed twice, the second unticked (story 32); a Key facts field, a contact or a funding source is one change with "Also stated: …" (stories 15, 18, 86).
- The arithmetic line of a total to date — story 13. "Converted: …" — enabler 26 (`later`).
- "Not used" and "Skipped" — story 19. The note for the reviewer — story 21. The warning that the report names another project — story 20.
- Which files can be chosen and read — stories 01 and 10.
- The document after the import is added: it is not kept, and nothing opens it (spec #42). What stays is its name and each change's quote — story 22.

## Needs to know from elsewhere

- The check step lists each proposed performance measure entry with its label, amount, breakdown answers, quote and note, and the page's one action stays in view — owned by story 01. Story 01 shows the amount as read, not in a field (story 01, R8).
- A ready change is one the person can add as it stands; with story 01 alone every change is ready and counts as ticked — owned by story 06 (what arrives ticked) and story 14 (what needs the person).
- Each change that can be added has a checkbox — owned by story 06 (R1). A performance measure change shows its values as fields — owned by story 07 (R1). These are the controls R7 and R8 speak of.
- The reading returns the changes in the document's order, each with its quote and the place it was read from, and returns every document that is not a PDF as passages — owned by enabler 02 (R6). The stand-in for it is the recorded sample.
- "Read another" and "Cancel" stay available when the reading proposes nothing — owned by story 35.
- The breakpoints of phone, tablet and wider screens (SR-2) — owned by the mobile foundation spec. 64rem or narrower is narrow.

## Scenarios

S1 to S11 run against the recorded sample `deer-creek-crew-log-2025.xlsx` (`../fixtures.md`), on a screen wider than 64rem. Every one of its changes is ready, so R2's other four parts and R4's order past the ready changes have no scenario here: each is proven where its state arrives (stories 06, 14, 16, 32, 75). No sample holds the data of S12 to S14; each describes its document by kind.

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

**S4 — Ready changes keep the document's order** (proves R4)
- Given the crew log's six changes, all ready, read from rows 4 to 13 of the sheet
- When the check step opens
- Then they are listed in the order of the rows they were read from: C1 to C6

**S5 — The quote is the document's own words** (proves R5)
- Given the crew log's row 7 as the fixture gives it
- When the Contributor reads the quote on C2
- Then it is "Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”"

**S6 — A sum is shown** (proves R5)
- Given C1's amount, 5.5, is the sum of rows 4 and 6
- When the Contributor reads C1
- Then under its quote a line reads "Added: 3.5 + 2 = 5.5 acres", and no other change has an arithmetic line

**S7 — The first change is selected on opening** (proves R6)
- Given the crew log has been sent to be read
- When the check step opens
- Then the first change listed has the tinted background and is the current item for assistive technology, and no other change is

**S8 — Clicking a change selects it, in place** (proves R7, R8)
- Given the list is scrolled so that C5 is in the middle of the window, with the first change selected
- When the Contributor clicks C5
- Then C5 is marked as selected, the first change no longer is, and C5 is where it was in the window

**S9 — Keyboard focus selects a change** (proves R7)
- Given the first change is selected and no change has a control of its own
- When the Contributor moves keyboard focus to the next change with the Tab key
- Then that change takes focus as one stop and is marked as selected

**S10 — A spreadsheet is shown as passages** (proves R9, R11)
- Given the crew log has been read from the file control
- When the check step opens
- Then the pane is headed `deer-creek-crew-log-2025.xlsx` and shows one page labelled "2025 crew log" with a passage for each row that holds text; "This file can't be shown here." is not shown

**S11 — The selected change's passage is marked** (proves R11)
- Given the crew log's check step, with row 7's passage out of view in the pane
- When the Contributor selects C2
- Then row 7's passage is marked, no other passage is, and it is at the top of the pane

**S12 — Selecting again brings the passage back** (proves R11)
- Given C2 is selected, row 7's passage is marked, and the Contributor has scrolled the pane until it is out of view
- When they click C2 again
- Then row 7's passage is at the top of the pane again

**S13 — A change with no place** (proves R12)
- Given a document shown as passages, one change that points at a passage, selected, and another change that points at none
- When the Contributor selects the second change
- Then the pane is at the document's start, no passage is marked, and the pane shows "No place marked for this change."

**S14 — A reading that proposes nothing** (proves R3)
- Given a document whose reading comes back with no proposed change and two "Not used" items
- When the check step opens
- Then it shows the document, the line "Nothing in this report can be added to this project.", the "Not used" list, and no commit action

R10 has no scenario a tester can cause on purpose: a developer verifies it by making the pane's display fail, and then sees "This file can't be shown here." with the selected change's quote under it, and the quote following the selection.

## UAT script

A PDF shown as itself is story 31. S12 to S14 have no step: no sample holds their data.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person), in a laptop or desktop window wider than 64rem. The test environment serves the recorded sample `deer-creek-crew-log-2025.xlsx`. Story 01 is built.
Test data: `../fixtures.md`: the crew log's rows 4 to 14 and changes C1 to C6.
Reset: none needed; the script adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import a report", choose `deer-creek-crew-log-2025.xlsx`, press "Read it" and wait | The changes on one side and the document pane on the other |
| 2 | Read the line above the changes | "6 ready to add" |
| 3 | Read the heading above the changes | "Performance measures", and no other section heading |
| 4 | Compare the order of the changes with the sheet's rows | The order of the rows they were read from: C1 to C6, with "Acres of riparian habitat restored · 2024" (row 13) last |
| 5 | Look at the document pane | The file's name, a page labelled "2025 crew log", and the sheet's rows as passages, with the first change's row marked |
| 6 | Read "Acres of riparian habitat restored · 2025" | Its quote names rows 4 and 6, and under it "Added: 3.5 + 2 = 5.5 acres" |
| 7 | Click "Native trees and shrubs planted · 2025" | That change is tinted and no other is; in the pane row 7 is marked, at the top; the quote on the change has the same words as row 7, with "Row 7 — " in front |
| 8 | Scroll the pane until row 7 is out of view, then click the same change | Row 7 is at the top of the pane again |
| 9 | Press Tab until focus is on the next change | That change is tinted, and its row is marked in the pane; the list has not jumped |
| 10 | Make the window short and scroll the list to its end | The document pane is still in view |

On the prototype: press "Sample crew log", the only route there that shows a document as passages; a spreadsheet chosen as a file shows "This file can't be shown here." See `../fixtures.md`, On the prototype.

## Open questions

None open. The proposals this story rests on:

- Q-110 (proposed) — R2: five parts, each change in exactly one, "1 needs you".
- Q-42 (proposed) — R3, S14: the check step for a reading that proposes nothing.
- Q-98 (proposed) — R3: headings in the workspace's words.
- Q-54 (proposed) — R4, S4: the check step sorts; the reading's order is not relied on.
- Q-67 (proposed) — R4: the order of the five states.
- Q-118 (proposed) — R5, S6: the "Added:" line; no other arithmetic.
- Q-111 (proposed) — R6, R7, S7, S9: selection by keyboard and for assistive technology.
- Q-66 (proposed) — R9 to R11, S10 to S12: every document that is not a PDF is shown as passages.
- Q-117 (proposed) — R12, S13: a change with no place.
- Q-167 (proposed) — R11: a change read from two passages (C1, rows 4 and 6) marks the first of them.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | STA-8, SCR-2; RUL-107 |
| R2 | decided; shown; proposed (Q-110) | STA-8; RUL-104; RUL-253 |
| R3 | decided; proposed (Q-98); proposed (Q-42) | RUL-9, STA-8; RUL-254; RUL-255 |
| R4 | proposed (Q-54); proposed (Q-67) | RUL-105, RUL-56; RUL-256 |
| R5 | shown; proposed (Q-118) | RUL-36; RUL-257 |
| R6 | shown; proposed (Q-111) | STA-22, RUL-106; RUL-258 |
| R7 | decided; shown; proposed (Q-111) | ACN-9; RUL-106; RUL-258 |
| R8 | shown | RUL-51 |
| R9 | shown; proposed (Q-66) | RUL-127, OBJ-5; RUL-259 |
| R10 | shown; proposed (Q-66) | STA-25; RUL-259 |
| R11 | shown; proposed (Q-66); proposed (Q-167) | STA-23, RUL-128; RUL-259; RUL-260 |
| R12 | proposed (Q-117) | RUL-261 |
- Wording provisional: "Nothing in this report can be added to this project." (R3).
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the tally at 725-739; groups at 340, 354-355 and 912-933, which filter by section and never sort; selection at 698-713 and 942-943; the tint at 257-260; the two columns at 207-228; what the pane is given, 531-539); `src/components/shared/firma2-report-source.astro` (the pane) and `src/lib/report-source.ts` (which form is shown at 37-76; drawing the passages at 46-70; moving to a change's place at 79-99; the quote under "This file can't be shown here." at 72-76 and 101-105); `scripts/report-reader.mjs` (441-443, the only place proposals are sorted).
- Data shapes, as the prototype models them: each proposed change carries its quote and any arithmetic, and may point at one passage and one page of the document. The document is a name plus either a file or pages (a label, and passages each with an optional heading and lines).
- Where the prototype differs from the requirements above: it never sorts (its samples are ordered by hand); its tally has four parts, is empty when every part is zero, reads "1 need you", counts a ticked "Already on file" change twice and an unticked ready change nowhere; a reading that proposes nothing shows an empty tally and "Nothing ticked"; the selection is a tint alone and a change with no control cannot take keyboard focus; a chosen spreadsheet or Word file is "This file can't be shown here."; for a change with no passage the mark is taken off and the pane stays where it was; C1 has no "Added:" line.
- Do not copy: the samples' hand-written "Converted: …" lines; the "Check this" and "Unsure" badges, which were struck (Q-25); every change carrying a checkbox, an amount field and a reporting period from the start, which in these stories arrive with 06 and 07; the scripted readings, which give a chosen file the sample's changes whatever it holds; the demo button as the only way a document reaches the pane as passages.

</details>
