# 01 — A Contributor adds performance measure entries read from one report file

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 02
Covers: OBJ-2, OBJ-3, SCR-1, SCR-3, STA-1, STA-6, STA-10, ACN-1, ACN-5, ACN-6, ACN-17, RUL-1, RUL-5, RUL-20, RUL-26, RUL-54, RUL-60, RUL-71, RUL-72, RUL-73, RUL-75, RUL-77, RUL-84, RUL-85, RUL-86, RUL-87, STA-26, RUL-74, RUL-91
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #1, #7, #8, #18, #20; interview 2026-11-23, Q-23
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R5 and R7. Can start only against the recorded crew log reading in `../fixtures.md`, which stands in for enabler 02 (not built): R6 and R8 to R13. Waiting: the parts marked "Not decided", each on the question named beside it; the fixture's rows C3 and C4 on Q-82.

## Story

As a Contributor, I want to add the performance measure figures a report states to the project's record by choosing the report's file, so that what a report already filed says gets onto the record without retyping it.

## Description

This is the walking skeleton of Import a report: the thinnest path from a file to entries on the record. The Contributor starts on the project page, chooses one file, waits while it is read, sees the proposed performance measure entries, presses "Add N changes" and lands back on the project page with the entries on it. Only the reading service (enabler 02) comes before it. Story 22 adds the record of the import; every other story in epics A and B adds one control, case or kind of change to this path. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample crew log. The toast (R12, R13, S9, S10) came on 2026-11-23 from a story whose number is retired (`../story-map.md`, Retired numbers).

## Requirements

R1. The Performance measures card on the project page has a button, "Import report", that opens the Import a report page on its choose step. (open: Q-31, Q-40)

R2. Import a report is a page of its own, titled "Import a report", with the breadcrumb Projects › `<Project>` › Import a report. "Projects" leads to the list of projects and the project's name leads back to the project page. There is no side-sheet version.

R3. Two labels here name a renameable noun and show the workspace's word for it: "Projects" in the breadcrumb and the card's title, "Performance measures". Every other label quoted in this story is fixed wording.

R4. The choose step has one file control, labelled "Report or spreadsheet (.pdf, .docx, .xlsx, .xls or .csv)", with the line "Max 20 MB per file". The page's one action is "Read it". (open: Q-38, Q-47)

R5. The file control holds one file, chosen with the file picker or dropped onto it, and shows the held file's name. Choosing a second file replaces the first. An import reads one document. Not decided: taking a held file out of the control again, and several files dropped on the control together (Q-100). (open: Q-29)

R6. Pressing "Read it" with a file held starts the wait: the choose step gives way to a progress indicator and "Reading `<file name>`…", and the page has no action. The wait is announced to assistive technology once, as "Reading `<file name>`". The page shows no progress figure and no partial result, and waits until the reading or a failure comes back.

R7. The person waits on the page. A reading is not stored, so leaving the page before "Add N changes" is pressed ends it and nothing of it is kept. Leaving is anything that takes the page away: a link, the browser's Back, a reload, closing the tab. Opening Import a report again starts on the choose step with no file held. (open: Q-46, Q-85)

R8. When the reading comes back, the page moves to the check step and lists each proposed performance measure entry as a change. Each change shows the label "`<Measure>` · `<reporting period>`"; the amount under "Amount (`<unit>`)", or "Amount" alone for a measure with no unit; each breakdown answer the reading gave, with its question; the quote; and the change's note when it has one. The measure's name and unit are the project's own, and the reporting period is shown by its name. On the check step an amount is digits as read, with no thousands separator: 1850, 5.5. (open: Q-82)

R9. The page has one action at a time: "Read it" on the choose step, none during the wait, "Add N changes" on the check step. It stays in view however long the list of changes runs, at every screen width.

R10. "Add N changes" states how many changes it will add ("Add 6 changes"; "Add 1 change" for one), which in this story is every change listed. Pressing it adds them with no confirmation step and returns the person to the project page. Not decided: what the person sees while the import is saved and whether a second press is ignored (Q-84); what is left on the record when a save fails part-way (Q-44).

R11. Each change is saved as a new performance measure entry (the measure, the reporting period, the amount, the breakdown answers) beside any entry the record already holds for that measure and reporting period. Nothing is replaced or merged, so two changes of one reading for the same measure and reporting period are two entries. The entries are on the record at once, like an entry recorded by hand, and the figures on the Performance measures card take them in. Not decided: whether adding must refuse or warn about an entry the record already holds (Q-87); whether each entry is also a row of its own in the performance measures' change log (Q-101).

R12. After adding, the project page the person is returned to shows a success toast: "`<N>` changes added from `<document name>`", or "1 change added from `<document name>`" for one. `<N>` is the number of changes the import recorded (the import's record is story 22) and the document name is the file's name. The toast announces the import just added and no other; when that import is not on the record, no toast is shown. The sentence is fixed wording.

R13. The person can dismiss the toast. Dismissing it changes nothing on the record.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The record of the import, and its row in the change history — story 22.
- "Cancel" and "Read another" — story 35. The checkboxes and "Nothing ticked" — story 06. Editing a change — story 07. The check that stops an import with an invalid change — story 30.
- The document beside the changes, the tally, the section headings, the order of changes, selecting a change, and a reading that proposes nothing — story 04. "Show source" — story 05.
- Pasted text — story 09. No file held, a file refused for its size or type, and a reading that fails or never comes back — story 10. A spatial file — story 11.
- The header action and dropping a file on the project page — story 08. Who is offered the button and the page — story 12.
- "Already on file" — story 32. A total to date — story 13. A flagged change — story 14. A figure stated in another unit — story 26 (`later`). A measure the project is not asked — enabler 50 (`later`).
- Key facts, funding sources and contacts — stories 15, 17 and 18. "Not used" and "Skipped" — story 19. The warning that the report names another project — story 20.
- The note for the reviewer — story 21. "Undo" on the toast — story 23. Keeping the document — enabler 03.
- The "`<N>` unpublished changes" badge and publishing — `publish-review`.

## Needs to know from elsewhere

- The reading — enabler 02, not built. This story hands it the file and what the project can take: its performance measures with their units, breakdown questions and options, and its closed reporting periods. It gets back the proposed entries: for each, the measure, the reporting period, the amount, the breakdown answers the document states, the quote and an optional note. The reading writes nothing to the record.
- Added entries are saved unpublished: on the record at once, not public until a Manager publishes — owned by `publish-review`.
- The project's performance measures, their closed reporting periods, how an entry is saved, and the figure the card shows and how it is written (10,727) — owned by `performance-measures`. For a measure whose values add up, the figure is the sum of its entries; all seven Deer Creek measures are such. A project with no performance measure or no closed reporting period is Q-43 (stories 07 and 12).
- Only someone who can edit the project may change its record (SR-3) — owned by `users-and-security`. This story is tested signed in as someone who can.
- The project page, its Performance measures card, the pinned top bar and the breadcrumb — owned by `project-record`.
- The toast has no timer and is shown once, to the person who added the import: reloading the project page does not show it again — owned by story 23.
- Toasts on the project page — owned by `project-record`.

## Scenarios

All run against the recorded crew log reading in `../fixtures.md`.

**S1 — Open from the Performance measures card** (proves R1, R2, R4)
- Given a Contributor is on the Deer Creek Riparian Corridor Enhancement project page
- When they press "Import report" on the Performance measures card
- Then a page titled "Import a report" opens, with the breadcrumb Projects › Deer Creek Riparian Corridor Enhancement › Import a report, one file control labelled "Report or spreadsheet (.pdf, .docx, .xlsx, .xls or .csv)" with "Max 20 MB per file", and one action, "Read it"

**S2 — The workspace's own words** (proves R3)
- Given a workspace that has its own word for Project and for Performance measure
- When a Contributor opens Import a report from a project's card
- Then the card's title and the first step of the breadcrumb show the workspace's words, and "Import report", "Import a report" and "Read it" read as written here

**S3 — A second file replaces the first** (proves R5)
- Given the Contributor chose `deer-creek-completion-report-2025.pdf` in the file control
- When they choose `deer-creek-crew-log-2025.xlsx`
- Then the control holds the crew log alone

**S4 — The page waits while the file is read** (proves R6)
- Given the file control holds `deer-creek-crew-log-2025.xlsx`
- When the Contributor presses "Read it"
- Then the page shows a progress indicator and "Reading deer-creek-crew-log-2025.xlsx…", with no action

**S5 — Leaving ends the reading** (proves R7)
- Given `deer-creek-crew-log-2025.xlsx` is being read
- When the Contributor reloads the page
- Then the page is on the choose step with no file held, and Deer Creek's figures are the fixture's "Before" column

**S6 — The check step lists what was read** (proves R8)
- Given the crew log has been sent to be read for Deer Creek
- When the reading comes back
- Then six changes are listed, each with the label, amount, breakdown answer, quote and note of its fixture row; C2 reads "Native trees and shrubs planted · 2025", with 1850 under "Amount (plants)" and the quote "Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”"

**S7 — The action stays in view** (proves R9)
- Given the check step lists the crew log's six changes on a phone-width screen
- When the Contributor scrolls to the last change
- Then "Add 6 changes" is still in view, and it is the page's only action

**S8 — The changes are added as entries** (proves R10, R11)
- Given the check step lists the crew log's six changes, and Deer Creek's figures are the fixture's "Before" column
- When the Contributor presses "Add 6 changes"
- Then no confirmation is asked, the Deer Creek project page opens, and each figure on the Performance measures card is the fixture's "After C1–C6" column

**S9 — The toast says what was added** (proves R12)
- Given the check step lists the crew log's six changes
- When the Contributor presses "Add 6 changes"
- Then the Deer Creek project page shows a success toast, "6 changes added from deer-creek-crew-log-2025.xlsx"

**S10 — Dismissing the toast** (proves R13)
- Given the toast "6 changes added from deer-creek-crew-log-2025.xlsx" is showing and the Performance measures card shows the fixture's "After C1–C6" figures
- When the Contributor dismisses the toast
- Then the toast goes and the figures are unchanged

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Nothing has been imported to Deer Creek. The recorded crew log reading is served for the crew log file.
Test data: `../fixtures.md`: Deer Creek's "Before" and "After C1–C6" figures; the crew log, rows C1 to C6. Rows C3 and C4 and their two figures wait on Q-82.
Reset: not known. The script leaves six entries on Deer Creek, and nobody has said how a tester takes them off again (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and find the Performance measures card | The seven figures of the "Before" column, and a button, "Import report" |
| 2 | Press "Import report" | A page titled "Import a report", under Projects › Deer Creek Riparian Corridor Enhancement, with a file control and one button, "Read it" |
| 3 | Choose `deer-creek-completion-report-2025.pdf` in the file control, then choose `deer-creek-crew-log-2025.xlsx` | The control shows the crew log's name alone |
| 4 | Press "Read it" | "Reading deer-creek-crew-log-2025.xlsx…" and no button at the top of the page |
| 5 | Wait for the reading to finish | Six changes, and one button, "Add 6 changes" |
| 6 | Compare each change with rows C1 to C6 | Each label, amount, breakdown answer, quote and note is as its row says; C2's amount reads 1850, with no comma, under "Amount (plants)" |
| 7 | Scroll to the last change | "Add 6 changes" is still in view |
| 8 | Press "Add 6 changes" | The Deer Creek project page, with no question asked first, and a message "6 changes added from deer-creek-crew-log-2025.xlsx" |
| 9 | Look at the Performance measures card | The seven figures of the "After C1–C6" column |
| 10 | Dismiss the message | The message goes; the Performance measures card still shows the "After C1–C6" figures |
| 11 | Press "Import report" again, choose the crew log, press "Read it" and reload the page while "Reading…" shows | The file control, with no file in it |
| 12 | Go back to the project page by the breadcrumb | The figures are still those of step 9 |

On the prototype: press "Sample crew log" in place of steps 3 and 4, and pass over what other stories add; the message also offers "Undo" (story 23); see `../fixtures.md`, On the prototype.

## Open questions

- Q-29 — R5 and S3: if an import may take several documents, the control holds more than one file.
- Q-31 — R1, S1 and steps 1 and 2: the button's label.
- Q-38, Q-47 — R4 and S1: the file types and the size limit the control names.
- Q-40 — R1 and step 1: whether the button shows before Edit is pressed on the project page.
- Q-44 — R10: what a failed save leaves on the record; R12: the count the toast states after a failed save; no scenario covers either yet.
- Q-46, Q-85 — R7 and S5: whether anything of a reading, or of the file sent, is kept after the person leaves.
- Q-82 — R8, S6 to S10 and steps 5 to 10: what is proposed for rows C3 and C4, so the count of six and two of the "After" figures.
- Q-84 — R10: what shows while the import is saved, and whether a second press is ignored; R12: the count the toast states after a second press; no scenario covers either yet.
- Q-87 — R11: whether an entry the record already holds, or a second identical change of one reading, is saved again.
- Q-100 — would change R5 and S3: whether a held file can be taken out again, and what several files dropped together do.
- Q-101 — would change R11: adds or removes a row per entry in the performance measures' change log, and whether it names the document.
- Q-88 — the Reset line, and how the recorded reading is served for the Preconditions.
- Q-99 — R11: whether two like changes of one reading are both saved as entries (its part a).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided | ACN-1 |
| R2 | decided | SCR-1, RUL-5 |
| R3 | shown | RUL-77 |
| R4 | shown | STA-1 |
| R5 | shown; decided | ACN-5; RUL-26; RUL-87 |
| R6 | decided; shown | STA-6, ACN-6; RUL-73; RUL-84 |
| R7 | decided; shown | RUL-60, OBJ-2; RUL-73 |
| R8 | shown | STA-10, OBJ-3, RUL-75 |
| R9 | shown | RUL-54 |
| R10 | decided; shown | ACN-17, RUL-20; RUL-72 |
| R11 | decided; shown | RUL-1, SCR-3; RUL-71, RUL-85, RUL-86 |
| R12 | decided; shown | STA-26; RUL-74; RUL-91 |
| R13 | shown | RUL-74 |

- Prototype files: `src/pages/prototypes/projects/[project]/import-report.astro` (the page and its breadcrumb); `src/components/projects/firma2-project-report-import.astro` (the three steps and the save); `src/components/projects/firma2-report-import-actions.astro` (the top-bar actions); `src/components/projects/firma2-project-measures.astro` (the card and its button); `src/lib/entry-draft.ts` (how an entry is saved); `src/components/projects/firma2-project-imported.astro` (the toast on the project page); `src/data/firma2-report-import.ts` (the reading's shape and the scripted readings); `scripts/report-reader.mjs` (the developer-machine reader).
- Data shapes, as the prototype models them: a reading holds proposed changes, a "Not used" list and a "Skipped" list. A proposed measure entry holds the measure by name, the year of its reporting period, the amount, answers keyed by breakdown question, the quote, an optional note, an optional passage and page. An entry holds the measure, the year, the amount and the answers.
- What the prototype does where nothing is decided (not requirements): it saves the entries one after another and then leaves the page, undoes nothing if a later step fails, and keeps the button enabled while it saves (Q-44, Q-84); it does not look at the record on Add, so the same report added twice saves its entries twice (Q-87); it sends nothing to stop a reading when the page is left (Q-85); its file control lets a held file be removed, shows the file's size, and of several files dropped together holds the first (Q-100); each saved entry also writes a row to the performance measures' own change log, as a hand entry does, naming no document (Q-101); it sets no time limit on the wait (story 10); an entry that could not be saved is passed over without a word and its change is still counted, so the toast can state more changes than there are entries (Q-44).
- What the prototype's toast does (the hub's toast component, not a requirement of this story): it has a close button and also closes on Escape while keyboard focus is inside it. The accessibility standard is Q-83.
- Do not copy: entries kept in a browser-local store; `?imported=<id>` on the address to tell the project page which import to announce; the scripted readings and the fixed 1.6-second wait; the "Sample crew log" and "Sample funder report" buttons; the route and button existing for one project only; the absence of any permission check; the "Check this" badges (struck, Q-25).

</details>
