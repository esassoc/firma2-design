# 01 — A Contributor adds performance measure entries read from one report file

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-31, Q-38, Q-40, Q-45, Q-46, Q-47, Q-84, Q-85, Q-99, Q-100, Q-109, Q-113
Revision: 1
Blocked by: 02
Covers: OBJ-2, OBJ-3, SCR-1, SCR-3, STA-1, STA-6, STA-10, ACN-1, ACN-5, ACN-6, ACN-17, RUL-1, RUL-5, RUL-20, RUL-26, RUL-54, RUL-60, RUL-71, RUL-72, RUL-73, RUL-75, RUL-77, RUL-84, RUL-85, RUL-86, RUL-87, STA-26, RUL-74, RUL-91, RUL-224, RUL-225, RUL-226, RUL-227, RUL-228, RUL-229, RUL-230, RUL-231, RUL-232, RUL-233, RUL-234, RUL-235, RUL-236
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #1, #7, #8, #18, #20, #41, #42; interview 2026-11-23, Q-23
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R5, R7 and R15. Against the recorded crew log sample in `../fixtures.md`, which stands in for enabler 02 (not built): R6 and R8 to R13. Against a stand-in for `users-and-security` that says whether the person can still edit the project: R14. Built here, not showable until a later story: the quote that stays with each change (recorded by story 22, first seen in story 24). Nothing waits on a question.

## Story

As a Contributor, I want to add the performance measure figures a report states to the project's record by choosing the report's file, so that what a report already filed says gets onto the record without retyping it.

## Description

This is the walking skeleton of Import a report: the thinnest path from a file to entries on the record. The Contributor starts on the project page, chooses one file, waits while it is read, sees the proposed performance measure entries, presses "Add N changes" and lands back on the project page with the entries on it. Only the reading service (enabler 02) comes before it. The file is used to read from and is not kept (spec #42). Story 22 adds the record of the import; every other story in epics A and B adds one control, case or kind of change to this path. The page exists only in a workspace where reading by an outside AI service is on (SR-9; stories 82 and 83 hold the other states). See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`.

## Requirements

R1. The Performance measures card on the project page has a button, "Import a report", that opens the Import a report page on its choose step. The button shows while the project page is being read: the person does not press Edit first.

R2. Import a report is a page of its own, titled "Import a report", with the breadcrumb Projects › `<Project>` › Import a report. "Projects" leads to the list of projects and the project's name leads back to the project page. There is no side-sheet version.

R3. Two labels here name a renameable noun and show the workspace's word for it: "Projects" in the breadcrumb and the card's title, "Performance measures". Every other label quoted in this story is fixed wording.

R4. The choose step has one file control, labelled "Report or spreadsheet (.pdf, .docx, .xlsx, .csv or .txt)", with the line "Max 20 MB per file". The page's one action is "Read it".

R5. The file control holds one file, chosen with the file picker or dropped onto it. An import reads one document.
- The held file is listed with its name and size.
- Choosing a second file replaces the first.
- The held file can be removed; the control is then empty and shows no message.
- Several files dropped on the control together are refused: none is taken, a file already held stays held, and the control says "Drop one file at a time."

R6. Pressing "Read it" with a file held starts the wait: the choose step gives way to a progress indicator and "Reading `<file name>`…", and the page has no action. The wait is announced to assistive technology once, as "Reading `<file name>`". The page shows no progress figure and no partial result, and waits until the reading or a failure comes back.

R7. The person waits on the page, and nothing of a reading or of the file outlives it.
- A reading is never stored. Leaving the page before "Add N changes" is pressed ends it: the reading service stops where it can, and the file it was sent is deleted (enabler 02, R4). Leaving is anything that takes the page away: a link, the browser's Back, a reload, closing the tab.
- Opening Import a report again starts on the choose step with no file held.
- After "Add N changes" the file is discarded too. What stays is the document's name and, with each change, its quote (the import's record is story 22).

R8. When the reading comes back, the page moves to the check step and lists each proposed performance measure entry as a change. Each change shows the label "`<Measure>` · `<reporting period>`"; the amount under "Amount (`<unit>`)", or "Amount" alone for a measure with no unit; each breakdown answer the reading gave, with its question; the quote; and the change's note when it has one. The measure's name and unit are the project's own, and the reporting period is shown by its name. An amount shows thousands separators: 1,850; 5.5.

R9. The page has one action at a time: "Read it" on the choose step, none during the wait, "Add N changes" on the check step. It stays in view however long the list of changes runs, at every screen width.

R10. "Add N changes" states how many changes it will add ("Add 6 changes"; "Add 1 change" for one), which in this story is every change listed. Pressing it adds them with no confirmation step and returns the person to the project page. From the press until the project page opens, the action reads "Adding…" and cannot be pressed, and nothing else on the page can be used. A save that fails is story 22 (R1).

R11. Each change is saved as a new performance measure entry (the measure, the reporting period, the amount, the breakdown answers) beside any entry the record already holds for that measure and reporting period. Nothing is replaced or merged, so two changes of one reading for the same measure and reporting period are two entries. The entries are on the record at once, like an entry recorded by hand, and the figures on the Performance measures card take them in. The number of changes an import states, on the action and on the toast, is the number of entries it wrote.

R12. After adding, the project page the person is returned to shows a success toast: "`<N>` changes added from `<document name>`", or "1 change added from `<document name>`" for one. `<N>` is the number of changes the import recorded (the import's record is story 22) and the document name is the file's name. The toast announces the import just added and no other; when that import is not on the record, no toast is shown. The sentence is fixed wording.

R13. The person can dismiss the toast. Dismissing it changes nothing on the record.

R14. The right to edit the project is checked again when "Read it" is pressed, before the document is sent, and when "Add N changes" is pressed, before anything is saved. Without it, nothing is sent and nothing is saved. What the person then sees is story 12 (R6).

R15. The choose step says once, under the document control, that the document is read by an outside AI service and that the file is not kept: "Read by an outside AI service. The file is not kept."

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The record of the import, its row in the change history, a save that fails, and the row each entry gets in the performance measures' change log — story 22.
- "Cancel" and "Read another" — story 35. The checkboxes and "Nothing ticked" — story 06. Editing a change — story 07. The check that stops an import with an invalid change — story 30.
- The document beside the changes, the tally, the section headings, the order of changes, selecting a change, and a reading that proposes nothing — story 04. "Show source" — story 05.
- Pasted text — story 09. No file held, a file refused for its size or type (a .doc or .xls among them), and a reading that fails or takes too long — story 10. A spatial file — story 11.
- The header action and dropping a file on the project page — story 08. Who is offered the button and the page — story 12. The project page and the page's address while reading is off or unavailable — story 83. The setting itself — story 82.
- "Already on file", the check on the record when "Add N changes" is pressed, and the same entry stated twice in one reading — story 32. A total to date — story 13. A flagged change, a figure in another unit among them — story 14. Converting a unit — enabler 26 (`later`). A measure the project is not asked — enabler 50 (`later`).
- Key facts, funding sources and contacts — stories 15, 17 and 18. "Not used" and "Skipped" — story 19. The warning that the report names another project — story 20.
- The note for the reviewer — story 21. "Undo" on the toast — story 23.
- The "`<N>` unpublished changes" badge and publishing — `publish-review`.

## Needs to know from elsewhere

- The reading — enabler 02, not built. This story hands it the file and what the project can take: its performance measures with their units, breakdown questions and options, and its closed reporting periods. Nothing about the project's funding sources or contacts, or the workspace's organizations and people, is sent. It gets back the proposed entries: for each, the measure, the reporting period, the amount, the breakdown answers the document states, the quote and an optional note. The reading writes nothing to the record, and neither the service nor its provider keeps the file or the reading.
- An import is all or nothing, and one press makes one import. When the save fails nothing is on the record, and the person is on the check step with a message that nothing was added — owned by story 22 (R1).
- Added entries are saved unpublished: on the record at once, not public until a Manager publishes — owned by `publish-review`.
- The project's performance measures, their closed reporting periods, how an entry is saved, and the figure the card shows and how it is written (10,727) — owned by `performance-measures`. For a measure whose values add up, the figure is the sum of its entries; all seven Deer Creek measures are such. On a project with no performance measure or no closed reporting period, a report's figures are listed under "Not used" (story 19).
- Only someone who can edit the project may change its record (SR-3) — owned by `users-and-security`. R14 asks it one thing, twice: can this person edit this project.
- Import a report exists only while the workspace's setting is on (SR-9) — owned by story 82. Every scenario here assumes it on.
- The project page, its Performance measures card, the pinned top bar, the breadcrumb and its toasts — owned by `project-record`.
- The toast is shown once, to the person who added the import: reloading the project page does not show it again — owned by story 23.

## Scenarios

All run against the recorded crew log sample in `../fixtures.md`, in a workspace where reading by an outside AI service is on.

**S1 — Open from the Performance measures card** (proves R1, R2, R4, R15)
- Given a Contributor is reading the Deer Creek Riparian Corridor Enhancement project page and has not pressed Edit
- When they press "Import a report" on the Performance measures card
- Then a page titled "Import a report" opens, with the breadcrumb Projects › Deer Creek Riparian Corridor Enhancement › Import a report, one file control labelled "Report or spreadsheet (.pdf, .docx, .xlsx, .csv or .txt)" with "Max 20 MB per file", the line "Read by an outside AI service. The file is not kept." once, and one action, "Read it"

**S2 — The workspace's own words** (proves R3)
- Given a workspace that has its own word for Project and for Performance measure
- When a Contributor opens Import a report from a project's card
- Then the card's title and the first step of the breadcrumb show the workspace's words, and "Import a report" and "Read it" read as written here

**S3 — A second file replaces the first** (proves R5)
- Given the Contributor chose `deer-creek-treatments-2025.pdf` in the file control
- When they choose `deer-creek-crew-log-2025.xlsx`
- Then the control lists the crew log alone, with its name and size

**S4 — The held file can be removed** (proves R5)
- Given the file control holds `deer-creek-crew-log-2025.xlsx`
- When the Contributor removes it
- Then the control is empty and shows no message

**S5 — Several files at once are refused** (proves R5)
- Given the file control holds `deer-creek-crew-log-2025.xlsx`
- When the Contributor drops `deer-creek-treatments-2025.pdf` and `deer-creek-funding-2025.pdf` on it together
- Then the control still holds the crew log alone and says "Drop one file at a time."

**S6 — The page waits while the file is read** (proves R6)
- Given the file control holds `deer-creek-crew-log-2025.xlsx`
- When the Contributor presses "Read it"
- Then the page shows a progress indicator and "Reading deer-creek-crew-log-2025.xlsx…", with no action

**S7 — Leaving ends the reading** (proves R7)
- Given `deer-creek-crew-log-2025.xlsx` is being read
- When the Contributor reloads the page
- Then the page is on the choose step with no file held, and Deer Creek's figures are the fixture's "Before" column

**S8 — The check step lists what was read** (proves R8)
- Given the crew log has been sent to be read for Deer Creek
- When the reading comes back
- Then six changes are listed, each with the label, amount, breakdown answer, quote and note of its fixture row; C2 reads "Native trees and shrubs planted · 2025", with 1,850 under "Amount (plants)" and the quote "Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”"

**S9 — The action stays in view** (proves R9)
- Given the check step lists the crew log's six changes on a phone-width screen
- When the Contributor scrolls to the last change
- Then "Add 6 changes" is still in view, and it is the page's only action

**S10 — The action is busy while the import is saved** (proves R10)
- Given the check step lists the crew log's six changes
- When the Contributor presses "Add 6 changes" and the project page has not yet opened
- Then the action reads "Adding…" and cannot be pressed again

**S11 — The changes are added as entries** (proves R10, R11)
- Given the check step lists the crew log's six changes, and Deer Creek's figures are the fixture's "Before" column
- When the Contributor presses "Add 6 changes"
- Then no confirmation is asked, the Deer Creek project page opens, and each figure on the Performance measures card is the fixture's "After C1–C6" column

**S12 — The toast says what was added** (proves R11, R12)
- Given the check step lists the crew log's six changes
- When the Contributor presses "Add 6 changes"
- Then the Deer Creek project page shows a success toast, "6 changes added from deer-creek-crew-log-2025.xlsx"

**S13 — Dismissing the toast** (proves R13)
- Given the toast "6 changes added from deer-creek-crew-log-2025.xlsx" is showing and the Performance measures card shows the fixture's "After C1–C6" figures
- When the Contributor dismisses the toast
- Then the toast goes and the figures are unchanged

**S14 — The right to edit is gone before adding** (proves R14)
- Given the check step lists the crew log's six changes for a Contributor, and an Administrator has since taken away that Contributor's right to edit Deer Creek
- When the Contributor presses "Add 6 changes"
- Then nothing is saved: to someone who can see Deer Creek, its figures are still the fixture's "Before" column

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Deer Creek is in its starting state: nothing has been imported to it, and reading by an outside AI service is on for the workspace. The test environment serves the recorded sample `deer-creek-crew-log-2025.xlsx`.
Test data: `../fixtures.md`: Deer Creek's "Before" and "After C1–C6" figures; the crew log, rows C1 to C6. Two more sample files, used only to be dropped and never read: `deer-creek-treatments-2025.pdf` and `deer-creek-funding-2025.pdf` (to be made, as `../fixtures.md` says).
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, without pressing Edit, and find the Performance measures card | The seven figures of the "Before" column, and a button, "Import a report" |
| 2 | Press "Import a report" | A page titled "Import a report", under Projects › Deer Creek Riparian Corridor Enhancement, with a file control that names .pdf, .docx, .xlsx, .csv and .txt, the line "Read by an outside AI service. The file is not kept.", and one button, "Read it" |
| 3 | Choose `deer-creek-treatments-2025.pdf` in the file control, then choose `deer-creek-crew-log-2025.xlsx` | The control lists the crew log alone, with its size |
| 4 | Drop the treatments file and the funding file on the control together | "Drop one file at a time."; the control still lists the crew log alone |
| 5 | Remove the crew log from the control, then choose it again | The control is empty, with no message; then it lists the crew log |
| 6 | Press "Read it" | "Reading deer-creek-crew-log-2025.xlsx…" and no button at the top of the page |
| 7 | Wait for the reading to finish | Six changes, and one button, "Add 6 changes" |
| 8 | Compare each change with rows C1 to C6 | Each label, amount, breakdown answer, quote and note is as its row says; C2's amount reads 1,850 under "Amount (plants)" |
| 9 | Scroll to the last change | "Add 6 changes" is still in view |
| 10 | Press "Add 6 changes" | The button reads "Adding…" for a moment; then the Deer Creek project page, with no question asked first, and a message "6 changes added from deer-creek-crew-log-2025.xlsx" |
| 11 | Look at the Performance measures card | The seven figures of the "After C1–C6" column |
| 12 | Dismiss the message | The message goes; the Performance measures card still shows the "After C1–C6" figures |
| 13 | Press "Import a report" again, choose the crew log, press "Read it" and reload the page while "Reading…" shows | The file control, with no file in it |
| 14 | Go back to the project page by the breadcrumb | The figures are still those of step 11 |

## Open questions

None open. The story rests on these proposed answers:

- Q-31 (proposed) — the card button reads "Import a report" (R1, S1, steps 1 and 2).
- Q-40 (proposed) — the button shows without pressing Edit (R1, S1, step 1).
- Q-38 (proposed) — the five file types the control names (R4, S1).
- Q-47 (proposed) — the 20 MB limit the control names (R4, S1).
- Q-100 (proposed) — the held file's size, removing it, and the refusal of several files (R5, S4, S5, steps 4 and 5).
- Q-46 (proposed) — a reading is never stored (R7, S7).
- Q-85 (proposed) — on leaving, the reading service stops where it can and the file sent is deleted (R7, S7).
- Q-45 (proposed) — the document's name and each change's quote stay after the file is discarded (R7). That the file is not kept is decided (spec #42).
- Q-113 (proposed) — amounts show thousands separators on the check step (R8, S8, step 8).
- Q-84 (proposed) — "Adding…" from the press until the project page opens (R10, S10).
- Q-99 (proposed) — the count an import states is what it wrote (R11).
- Q-109 (proposed) — the right to edit is checked again on "Read it" and on "Add N changes" (R14, S14).
- Q-52 (proposed, the notice only) — the choose step's line about the outside AI service (R15). The setting itself is decided (spec #41).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; proposed (Q-31); proposed (Q-40) | ACN-1; RUL-224; RUL-225 |
| R2 | decided | SCR-1, RUL-5 |
| R3 | shown | RUL-77 |
| R4 | shown; proposed (Q-38); proposed (Q-47) | STA-1; RUL-226; RUL-227 |
| R5 | shown; decided; proposed (Q-100) | ACN-5; RUL-26; RUL-87; RUL-228 |
| R6 | decided; shown | STA-6, ACN-6; RUL-73; RUL-84 |
| R7 | decided; shown; proposed (Q-46, Q-85); decided (spec #42); proposed (Q-45) | RUL-60, OBJ-2; RUL-73; RUL-229; RUL-230; RUL-231 |
| R8 | shown; proposed (Q-113) | STA-10, OBJ-3, RUL-75; RUL-232 |
| R9 | shown | RUL-54 |
| R10 | decided; shown; proposed (Q-84) | ACN-17, RUL-20; RUL-72; RUL-233 |
| R11 | decided; shown; proposed (Q-99) | RUL-1, SCR-3; RUL-71, RUL-85, RUL-86; RUL-234 |
| R12 | decided; shown | STA-26; RUL-74; RUL-91 |
| R13 | shown | RUL-74 |
| R14 | proposed (Q-109) | RUL-235 |
| R15 | proposed (Q-52) | RUL-236 |
- Wording provisional: the control's label in R4 (the five types are the proposal; the sentence is the prototype's, corrected); "Read by an outside AI service. The file is not kept." (R15).
- Prototype files: `src/pages/prototypes/projects/[project]/import-report.astro` (the page and its breadcrumb); `src/components/projects/firma2-project-report-import.astro` (the three steps and the save); `src/components/projects/firma2-report-import-actions.astro` (the top-bar actions); `src/components/projects/firma2-project-measures.astro` (the card and its button); `src/lib/entry-draft.ts` (how an entry is saved); `src/components/projects/firma2-project-imported.astro` (the toast on the project page); `src/data/firma2-report-import.ts` (the reading's shape and the scripted readings); `scripts/report-reader.mjs` (the developer-machine reader).
- Data shapes, as the prototype models them: a reading holds proposed changes, a "Not used" list and a "Skipped" list. A proposed measure entry holds the measure by name, the year of its reporting period, the amount, answers keyed by breakdown question, the quote, an optional note, an optional passage and page. An entry holds the measure, the year, the amount and the answers.
- Where the prototype differs from the requirements above: its card button reads "Import report"; its control names .xls and not .txt; the check step shows amounts as plain digits; the button stays enabled while it saves and the entries are saved one after another; nothing is sent to stop a reading when the page is left; of several files dropped together the control holds the first; no right is checked at any point; the choose step says nothing about an outside AI service.
- The shared file control keeps the first of several dropped files today. R5's refusal needs the page to handle the drop itself or the hub control to gain a single-file refusal (a hub request).
- The prototype's toast is the hub's toast component: it has a close button and also closes on Escape while keyboard focus is inside it.
- Do not copy: entries kept in a browser-local store; `?imported=<id>` on the address to tell the project page which import to announce; the scripted readings and the fixed 1.6-second wait; the "Sample crew log" and "Sample funder report" buttons; the route and button existing for one project only; the "Check this" badges (struck, interview Q-25).

</details>
