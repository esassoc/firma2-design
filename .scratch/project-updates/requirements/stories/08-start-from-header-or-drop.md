# 08 — A Contributor starts an import from the project header, or by dropping a file on the project page

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 01
Covers: ACN-2, ACN-3, RUL-32, RUL-92, RUL-93, RUL-94
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement` (the two entry points); spec #8
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1, R2 and R5 to R7. Can start only against the recorded crew log reading in `../fixtures.md`, which stands in for enabler 02 (not built): R3 and R4. Waiting: where the header action sits, in R1 and R2, on Q-30; whether both entry points show before Edit is pressed on Q-40; the list of types in R4 on Q-38; a dropped file that is too large, or that does not reach the Import a report page, on Q-69; what the file control shows for a dropped file, in R3, on Q-102; what the page does with a dropped file it does not read, in R5, on Q-103.

## Story

As a Contributor, I want to start an import from the project page's header, or just by dropping the report onto the project page, so that getting a report onto the record takes no hunting for the right card.

## Description

Story 01 gives one way in: the button on the Performance measures card. This story adds the other two entry points. The header action is there wherever the person is on the project page. Dropping a file skips the choose step: the Import a report page opens with the file already being read. Both lead into the same page and the same steps as story 01. See them at `/prototypes/projects/deer-creek-riparian-corridor-enhancement`.

## Requirements

R1. The project page's header has an action, "Import a report", shown as an icon with that name as its tooltip and its accessible name. It comes straight after "Review changes" when the project has changes waiting for review, and first among the header's actions when it has none. It opens the Import a report page on the choose step, with no file held. (open: Q-30, Q-40)

R2. On a screen narrower than 45rem, "Import a report" is an item of the header's "…" menu, with the header's other actions. (open: Q-30)

R3. Dropping a readable file anywhere on the project page opens the Import a report page with that file held and its reading already started: the person does not press "Read it". From there the wait, the check step and a failed reading are as for a file chosen on the page. When several files are dropped together, the first readable one, in the order the browser hands them over, is read and the rest are ignored without a message. Not decided: what the person sees when the dropped file does not reach the Import a report page (Q-69); whether the file control shows the dropped file once the page is back on the choose step (Q-102). (open: Q-29, Q-40)

R4. A dropped file is readable when its name ends in .pdf, .doc, .docx, .xls, .xlsx or .csv, in capitals or not. Nothing else about the file is looked at before it is read. Not decided: what the person sees when a dropped file is over the size limit (Q-69). (open: Q-38)

R5. A dropped file that is not readable, such as an image or a spatial file, starts no import: the Import a report page does not open and nothing is read. Not decided: whether the project page must also keep the browser from opening such a file in its place (Q-103).

R6. A drop aimed at a part of the project page that takes files or text itself (a file control, a text editor, another drop zone) goes to that part and starts no import.

R7. The project page does not change while a file is dragged over it: no overlay is drawn. The one sign is the pointer, which shows the copy mark while a readable file is over a part of the page that will take it.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The "Import report" button on the Performance measures card, and everything after the page opens — story 01.
- Who is offered the entry points, and on which projects — story 12.
- A file refused for its type or size on the Import a report page, and what a reading that fails shows — story 10 (R4). A dropped file's failed reading is that story's case; this one adds nothing to it.
- A spatial file chosen on the Import a report page — story 11.
- An entry from My Projects — not in build 1 by the spec; not confirmed (Q-29).

## Needs to know from elsewhere

- The Import a report page: its choose step, the wait ("Reading `<file name>`…") and the check step — owned by story 01.
- The file control on the Import a report page names its own types (.pdf, .docx, .xlsx, .xls or .csv) and a 20 MB limit — owned by story 01. The list for a drop in R4 is not the same list (Q-38).
- The header's other actions, their order and the "…" menu; which parts of the project page take a file or text themselves — owned by `project-record`.
- 45rem is the phone boundary (SR-2) — owned by the mobile foundation spec.

## Scenarios

S3 and S5 run against the recorded crew log reading in `../fixtures.md`.

**S1 — From the header** (proves R1)
- Given a Contributor is on the Deer Creek project page on a screen 45rem wide or wider
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
- Given a Contributor is on the Deer Creek project page, with one file of each ending: .pdf, .doc, .docx, .xls, .xlsx and .csv
- When they drop one of them on the page
- Then the Import a report page opens showing "Reading `<file name>`…" for that file, whichever of the six it is

**S5 — Several files at once** (proves R3)
- Given a Contributor is on the Deer Creek project page
- When they drop a photograph (.jpg) and `deer-creek-crew-log-2025.xlsx` together
- Then the Import a report page opens showing "Reading deer-creek-crew-log-2025.xlsx…", and nothing is said of the photograph

**S6 — A file that is not readable is ignored** (proves R5)
- Given a Contributor is on the Deer Creek project page
- When they drop a photograph (.jpg) or a spatial file (.geojson) on a part of the page that takes no file itself
- Then the Import a report page does not open and nothing is read

**S7 — A drop on something that takes files is left to it** (proves R6)
- Given a Contributor is editing the description on the Deer Creek project page
- When they drop `deer-creek-crew-log-2025.xlsx` onto the description's editor
- Then the Import a report page does not open

**S8 — Nothing is drawn while dragging** (proves R7)
- Given a Contributor is on the Deer Creek project page
- When they drag `deer-creek-crew-log-2025.xlsx` over the page without letting go
- Then the page looks as it did before the drag

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person), on a laptop or desktop. Story 01 is built. The recorded crew log reading is served for the crew log file.
Test data: `../fixtures.md`: the crew log. Any photograph of your own, as a .jpg file; no fixture is an image. The count of six waits on Q-82.
Reset: none needed; the script adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and point at the icons in the header | The second one, after "Review changes", has the tooltip "Import a report" (Deer Creek starts with hand edits waiting for review) |
| 2 | Press it | The Import a report page, with no file in the file control |
| 3 | Go back to the project page by the breadcrumb | The project page |
| 4 | Drag `deer-creek-crew-log-2025.xlsx` from your computer over the middle of the project page, without letting go | The page looks the same as before |
| 5 | Let go | The Import a report page, already showing "Reading deer-creek-crew-log-2025.xlsx…" |
| 6 | Wait | Six changes, and "Add 6 changes" |
| 7 | Go back to the project page by the breadcrumb, then drop the photograph on the middle of the page | No Import a report page and no "Reading…" line. What else the browser does with the photograph is not decided (Q-103); come back to the project page if it opened the photograph |
| 8 | Narrow the browser window to about phone width and open "…" in the header | "Import a report" is in the menu |
| 9 | Choose it | The Import a report page, with no file in the file control |

On the prototype: any spreadsheet dropped reads as the crew log; see `../fixtures.md`, On the prototype.

## Open questions

- Q-29 — R3 and S5: if an import may take several documents, several files dropped together are not cut down to one; today two readable files dropped together are read in an order the person cannot see.
- Q-30 — R1, R2, S1, S2 and steps 1, 8 and 9: a visible header icon, or an item of "…" at every width.
- Q-38 — R4 and S4: which endings count as readable.
- Q-40 — R1 and R3: whether the header action and the drop work before Edit is pressed on the project page.
- Q-69 — R3 and R4: a dropped file over the size limit, and a dropped file that does not reach the Import a report page; each answer adds a scenario.
- Q-82 — step 6: the count of six.
- Q-88 — Preconditions: how the recorded reading is served.
- Q-102 — would change R3: whether the file control shows a dropped file when the page is back on the choose step (after a failed reading, or "Read another" in story 35); adds a scenario.
- Q-103 — would change R5, S6 and step 7: whether the page stops the browser from opening a dropped file it does not read.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | ACN-2 |
| R2 | decided | ACN-2 |
| R3 | decided | ACN-3; RUL-94 |
| R4 | shown | RUL-32; RUL-92 |
| R5 | shown | RUL-32; RUL-93 |
| R6 | shown | RUL-32 |
| R7 | shown | RUL-32, RUL-92 |

- Prototype files: `src/components/projects/firma2-project-actions.astro` (the header action and its place in "…"); `src/components/projects/firma2-project-imported.astro` (the drop on the project page); `src/components/projects/firma2-project-report-import.astro` (picking up a dropped file and starting its reading); `src/pages/prototypes/projects/[project].astro` (where the entry points are offered).
- Data shapes: none of its own. A drop hands one file to the Import a report page.
- What the prototype does where nothing is decided (not requirements): the header icon is an upload arrow, and the header's actions run Review changes, Import a report, Share, Fact sheet, History (Q-30); a drop is not checked against the 20 MB limit (Q-69); when the dropped file cannot be carried to the Import a report page, that page opens on the choose step with no file and says nothing (Q-69); a dropped file is held by the page but never shown in the file control, so after a failed reading or "Read another" the control looks empty while "Read it" reads the dropped file again (Q-102); a drop the page does not take is left to the browser, which usually opens the file in place of the project page or in a new tab (Q-103); during the drag the page decides by the file's type as the browser reports it, and on the drop by the ending of its name, so the copy mark can show for a file that is then not read.
- Do not copy: the dropped file parked in the browser and flagged by `?dropped=1` on the address; the entry points showing for one project only; the absence of any permission check on the entry points.

</details>
