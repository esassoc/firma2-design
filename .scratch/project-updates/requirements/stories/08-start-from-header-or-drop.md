# 08 — A Contributor starts an import from the project header, or by dropping a file on the project page

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-30, Q-38, Q-40, Q-69, Q-100, Q-102, Q-103
Revision: 1
Blocked by: 01, 10
Covers: ACN-2, ACN-3, RUL-32, RUL-92, RUL-93, RUL-94, RUL-272, RUL-273, RUL-274, RUL-275, RUL-276, RUL-277, RUL-278
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement` (the two entry points); spec #8, #20
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1, R2 and R5 to R7. Against the recorded crew log sample in `../fixtures.md`, which stands in for enabler 02 (not built): R3 and R4. S7 and S9 use story 10's size message and its return to the choose step after a failed reading; story 10 is in `Blocked by` for that reason. Nothing waits on a question.

## Story

As a Contributor, I want to start an import from the project page's header, or just by dropping the report onto the project page, so that getting a report onto the record takes no hunting for the right card.

## Description

Story 01 gives one way in: the button on the Performance measures card. This story adds the other two entry points. The header action is there wherever the person is on the project page. Dropping a file skips the choose step: the Import a report page opens with the file already being read. Both lead into the same page and the same steps as story 01, and both are offered while the project page is being read, with no Edit press. A file the page does not read never costs the person the project page: the page takes the drop and says why nothing started. See the entry points at `/prototypes/projects/deer-creek-riparian-corridor-enhancement`.

## Requirements

R1. The project page's header has an action, "Import a report", shown as an always-visible icon in the breadcrumb row, with that name as its tooltip and its accessible name. It comes straight after "Review changes" when the project has changes waiting for review, and first among the header's actions when it has none. It shows while the page is being read, with no Edit press. It opens the Import a report page on the choose step, with no file held.

R2. On a screen narrower than 45rem, "Import a report" is an item of the header's "…" menu, with the header's other actions.

R3. Dropping one readable file anywhere on the project page, while the page is being read or edited, opens the Import a report page with that file held and its reading already started: the person does not press "Read it". From there the wait, the check step and a failed reading are as for a file chosen on the page.
- Several files dropped together start nothing: the project page stays as it was and a toast says "Drop one file at a time."
- Whenever the page is back on the choose step (after a failed reading, story 10; after "Read another", story 35), the file control lists the dropped file as if it had been chosen there, with its name and size, so it can be seen, replaced, removed and read again.
- A dropped file that cannot be carried to the Import a report page: the page opens on the choose step with no file held and says "That file didn't come through. Choose it here."

R4. A dropped file is readable when its name ends in .pdf, .docx, .xlsx, .csv or .txt, in capitals or not.
- A file ending in .doc or .xls starts nothing: the project page stays as it was and a toast says "Older Word and Excel files can't be read. Save it as .docx or .xlsx."
- A readable file over 20 MB is not read: the Import a report page opens on the choose step with no file held and the file control's size message naming the file (the message is story 10, R3).

R5. The project page takes every file dropped on it, so the browser never opens a dropped file in place of the page. A dropped file that is not readable starts no import: the Import a report page does not open, nothing is read, the project page stays as it was, and a toast says why.
- A spatial file (a name ending in .shp, .zip, .geojson, .kml, .kmz or .gpkg): "Shapes are added with Upload shapes."
- Any other file: "That file can't be read as a report."
Nothing is handed to Upload shapes from the project page.

R6. A drop aimed at a part of the project page that takes files or text itself (a file control, a text editor, another drop zone) goes to that part and starts no import, and shows none of this story's toasts.

R7. The project page does not change while a file is dragged over it: no overlay is drawn. The one sign is the pointer, which shows the copy mark while a readable file is over a part of the page that will take it.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The "Import a report" button on the Performance measures card, and everything after the page opens — story 01.
- Who is offered the entry points, and on which projects — story 12.
- No entry point while reading by an outside AI service is off or unavailable — story 83.
- A file refused for its type or size on the Import a report page, the wording of the size message, and what a reading that fails shows — story 10. A dropped file's failed reading is that story's case; this one adds only what the file control then lists (R3).
- A spatial file chosen on the Import a report page, and the hand-off to Upload shapes — story 11.
- An entry from My Projects, and several documents in one import — not in the first release (spec #20).

## Needs to know from elsewhere

- The Import a report page: its choose step, the wait ("Reading `<file name>`…") and the check step — owned by story 01.
- The file control on the Import a report page names the same five types and a 20 MB limit, and lists a held file with its name and size — owned by story 01 (R4, R5).
- The header's other actions, their order and the "…" menu; which parts of the project page take a file or text themselves; the project page's toasts — owned by `project-record`.
- 45rem is the phone boundary (SR-2) — owned by the mobile foundation spec.
- Which endings make a spatial file — owned by story 11 (R1); R5 lists them so this story stands alone.

## Scenarios

S3, S4 and S9 run against recorded samples in `../fixtures.md`. No sample is over 20 MB, an older Word file, an image or a spatial file, and none fails to be read; S6 to S11 describe those by kind.

**S1 — From the header** (proves R1)
- Given a Contributor is reading the Deer Creek project page, without having pressed Edit, on a screen 45rem wide or wider
- When they press the header action whose tooltip reads "Import a report"
- Then the Import a report page opens for Deer Creek on the choose step, with no file held

**S2 — From the "…" menu on a phone** (proves R2)
- Given the Deer Creek project page on a screen narrower than 45rem
- When the Contributor opens the header's "…" menu and chooses "Import a report"
- Then the Import a report page opens on the choose step

**S3 — A dropped report is read at once** (proves R3)
- Given a Contributor is on the Deer Creek project page
- When they drop `deer-creek-crew-log-2025.xlsx` on a part of the page that takes no file itself
- Then the Import a report page opens showing "Reading deer-creek-crew-log-2025.xlsx…", without "Read it" being pressed

**S4 — Each readable ending starts a reading** (proves R4)
- Given a Contributor is on the Deer Creek project page, with one file of each ending: .pdf, .docx, .xlsx, .csv and .txt
- When they drop one of them on the page
- Then the Import a report page opens showing "Reading `<file name>`…" for that file, whichever of the five it is

**S5 — Several files at once start nothing** (proves R3)
- Given a Contributor is on the Deer Creek project page
- When they drop `deer-creek-crew-log-2025.xlsx` and `deer-creek-treatments-2025.pdf` together
- Then the project page stays as it was and a toast says "Drop one file at a time."

**S6 — An older Word or Excel file** (proves R4)
- Given a Contributor is on the Deer Creek project page, with a file named `old-report.doc`
- When they drop it on the page
- Then the project page stays as it was and a toast says "Older Word and Excel files can't be read. Save it as .docx or .xlsx."

**S7 — A readable file that is too large** (proves R4)
- Given a Contributor is on the Deer Creek project page, with a PDF of 25 MB named `big-report.pdf`
- When they drop it on the page
- Then the Import a report page opens on the choose step with no file held and a message under the file control that names big-report.pdf and the 20 MB limit, and no reading starts

**S8 — A file that does not come through** (proves R3)
- Given a Contributor drops a readable file on the Deer Creek project page, and the file cannot be carried to the Import a report page
- When the Import a report page opens
- Then it is on the choose step with no file held and says "That file didn't come through. Choose it here."

**S9 — The dropped file is listed after a failed reading** (proves R3)
- Given a Contributor dropped a PDF named `unreadable.pdf`, whose reading will fail, on the Deer Creek project page
- When the reading fails and the page returns to the choose step
- Then the file control lists unreadable.pdf with its name and size

**S10 — A file that is not a report** (proves R5)
- Given a Contributor is on the Deer Creek project page
- When they drop a photograph (.jpg) on a part of the page that takes no file itself
- Then the project page stays as it was, the browser does not open the photograph, and a toast says "That file can't be read as a report."

**S11 — A spatial file** (proves R5)
- Given a Contributor is on the Deer Creek project page
- When they drop a .geojson file on a part of the page that takes no file itself
- Then the project page stays as it was and a toast says "Shapes are added with Upload shapes."

**S12 — A drop on something that takes files is left to it** (proves R6)
- Given a Contributor is editing the description on the Deer Creek project page
- When they drop `deer-creek-crew-log-2025.xlsx` onto the description's editor
- Then the Import a report page does not open and no toast of this story shows

**S13 — Nothing is drawn while dragging** (proves R7)
- Given a Contributor is on the Deer Creek project page
- When they drag `deer-creek-crew-log-2025.xlsx` over the page without letting go
- Then the page looks as it did before the drag

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person), on a laptop or desktop. Reading by an outside AI service is on for the workspace. The test environment serves the recorded sample `deer-creek-crew-log-2025.xlsx`.
Test data: `../fixtures.md`: the crew log, rows C1 to C6; `deer-creek-treatments-2025.pdf` (to be made), used only to be dropped beside the crew log. Brought by the tester, because no sample has them: a photograph as a .jpg file, and any file whose name ends in .doc.
Reset: none needed; the script adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, without pressing Edit, and point at the icons in the header | The second one, after "Review changes", has the tooltip "Import a report" (Deer Creek starts with hand edits waiting for review) |
| 2 | Press it | The Import a report page, with no file in the file control |
| 3 | Go back to the project page by the breadcrumb | The project page |
| 4 | Drag `deer-creek-crew-log-2025.xlsx` from your computer over the middle of the project page, without letting go | The page looks the same as before |
| 5 | Let go | The Import a report page, already showing "Reading deer-creek-crew-log-2025.xlsx…" |
| 6 | Wait | Six changes, and "Add 6 changes" |
| 7 | Go back to the project page by the breadcrumb, then drop the photograph on the middle of the page | The project page, unchanged, and a message "That file can't be read as a report." The browser has not opened the photograph |
| 8 | Drop the .doc file on the middle of the page | The project page, unchanged, and a message "Older Word and Excel files can't be read. Save it as .docx or .xlsx." |
| 9 | Drop the crew log and the treatments file together | The project page, unchanged, and a message "Drop one file at a time." |
| 10 | Narrow the browser window to about phone width and open "…" in the header | "Import a report" is in the menu |
| 11 | Choose it | The Import a report page, with no file in the file control |

## Open questions

None open. The story rests on these proposed answers:

- Q-30 (proposed) — the header entry is an always-visible icon, inside "…" only under 45rem (R1, R2, S1, S2, steps 1, 10 and 11). It amends spec #8, which says an item of the "…" menu.
- Q-40 (proposed) — the header action and the drop work without pressing Edit (R1, R3, S1, step 1).
- Q-38 (proposed) — which endings are readable, and that .doc and .xls are refused (R4, S4, S6, step 8).
- Q-100 (proposed) — several files dropped together start nothing (R3, S5, step 9).
- Q-69 (proposed) — a dropped file over 20 MB, and one that does not reach the page (R3, R4, S7, S8).
- Q-102 (proposed) — the file control lists a dropped file when the page is back on the choose step (R3, S9).
- Q-103 (proposed) — the page takes every dropped file and says why one is not read (R5, S10, S11, step 7).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; proposed (Q-30); proposed (Q-40) | ACN-2; RUL-272; RUL-273 |
| R2 | decided; proposed (Q-30) | ACN-2; RUL-272 |
| R3 | decided; proposed (Q-100); proposed (Q-102); proposed (Q-69) | ACN-3, RUL-94; RUL-274; RUL-275; RUL-276 |
| R4 | shown; proposed (Q-38); proposed (Q-69) | RUL-32, RUL-92; RUL-277; RUL-276 |
| R5 | shown; proposed (Q-103) | RUL-32, RUL-93; RUL-278 |
| R6 | shown | RUL-32 |
| R7 | shown | RUL-32, RUL-92 |
- Wording provisional: "That file didn't come through. Choose it here."; "Older Word and Excel files can't be read. Save it as .docx or .xlsx."; "Shapes are added with Upload shapes." The other two toasts are the feature's shared wording.
- Prototype files: `src/components/projects/firma2-project-actions.astro` (the header action and its place in "…"); `src/components/projects/firma2-project-imported.astro` (the drop on the project page); `src/components/projects/firma2-project-report-import.astro` (picking up a dropped file and starting its reading); `src/pages/prototypes/projects/[project].astro` (where the entry points are offered).
- Data shapes: none of its own. A drop hands one file to the Import a report page.
- Where the prototype differs from the requirements above: it takes .doc and .xls and not .txt; of several files dropped together it reads the first readable one and says nothing; a drop is not checked against the 20 MB limit; when the dropped file cannot be carried over, the page opens on the choose step and says nothing; a dropped file is held by the page but never listed in the file control; a drop the page does not take is left to the browser, which usually opens the file; no toast is shown for any drop. During the drag the prototype decides by the file's type as the browser reports it, and on the drop by the ending of its name, so the copy mark can show for a file that is then not read: R7 wants one test for both.
- The prototype's header icon is an upload arrow, and the header's actions run Review changes, Import a report, Share, Fact sheet, History.
- Do not copy: the dropped file parked in the browser and flagged by `?dropped=1` on the address; the entry points showing for one project only; the absence of any permission check on the entry points.

</details>
