# 35 — A Contributor leaves Import a report, or starts again, without adding anything

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-85
Revision: 1
Blocked by: 01
Covers: ACN-7, ACN-8, RUL-53, RUL-398, RUL-399
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #42; otherwise no spec decision (shown in the prototype only)
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R5, on story 01's page (its three steps and its one action are used here, not built here); like story 01, the wait and the check step only against the recorded crew log sample in `../fixtures.md` until enabler 02 is built. Built here, not showable until story 08: the file control after "Read another" on a file that was dropped on the project page (R4). Nothing waits on a question.

## Story

As a Contributor, I want a plain way out of Import a report and a way to read a different document, so that a wrong file or a poor reading costs me nothing.

## Description

Story 01's page has one action at a time and no way back but the breadcrumb. This story adds the two secondary actions of the page: "Cancel", on every step, and "Read another", on the check step. Neither asks for confirmation, because nothing reaches the record before "Add N changes" is pressed, and neither leaves anything behind: the reading is thrown away and the file that was sent to be read is deleted (spec #42). See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`.

## Requirements

R1. "Cancel" is offered on every step of the page: the choose step, the wait and the check step. It sits with the page's action and stays in view with it.

R2. "Cancel" returns the person to the project page the import was started for. Nothing has been added to the record, and nothing of the visit is kept: opening Import a report again starts on the choose step with no file held.

R3. During the wait, "Cancel" ends the reading, as any other way of leaving the page does (story 01, R7): the reading service stops where it can, a reading that finishes anyway is thrown away and never shown, and the file that was sent is deleted.

R4. "Read another" is offered on the check step only. It returns the person to the choose step, and the reading is discarded with everything the person set on the check step. Nothing has been added to the record, and the file that was sent to be read is deleted.
- The choose step is as the person left it: the file control still holds the person's file and lists its name and size, and no message shows. Where story 09 is built, the choice between "File" and "Paste text" is as it was, and pasted text is still in the text area.
- Pressing "Read it" without choosing again reads the same file again, as a new reading: the changes arrive as read, and nothing set on the first reading comes back.
- Choosing another file first replaces the held one (story 01, R5).
- A file that had been dropped on the project page is listed in the file control in the same way (story 08, R3).

R5. Neither action asks for confirmation or shows a warning, whatever step the page is on and whatever the person has set on the check step.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Ticking and unticking changes — story 06. Editing a change — story 07. The note for the reviewer — story 21.
- "Undo", after the changes have been added — story 23.
- A reading that fails returns to the choose step by itself — story 10.
- A reading the person can leave and come back to — story 28 (`later`).

## Needs to know from elsewhere

- The page has one primary action at a time ("Read it", none during the wait, "Add N changes"), in view at every width — owned by story 01. This story's two actions sit beside it and are never the primary one.
- A reading is not stored: leaving the page before "Add N changes" ends it, nothing of it is kept, and opening the page again starts on the choose step with no file held — owned by story 01 (R7).
- The reading service stops a reading where it can and keeps neither the reading nor the file, whatever the outcome — owned by enabler 02 (R4), not built. This story tells it that the person cancelled or asked to read another.
- What the person sets on the check step, which "Read another" discards: ticks (story 06), edits to a change (story 07) and the note for the reviewer (story 21).

## Scenarios

S2 to S7 run against the recorded crew log sample in `../fixtures.md`.

**S1 — "Cancel" on the choose step** (proves R1, R2)
- Given a Contributor is on the choose step of Import a report for Deer Creek
- When they press "Cancel"
- Then the Deer Creek project page opens

**S2 — "Cancel" during the wait** (proves R1, R2)
- Given `deer-creek-crew-log-2025.xlsx` is being read, and the page offers "Cancel" and no other action
- When the Contributor presses "Cancel" and then opens Import a report again
- Then the page is on the choose step with no file held

**S3 — A cancelled reading never arrives** (proves R3)
- Given the Contributor pressed "Cancel" while `deer-creek-crew-log-2025.xlsx` was being read, and is on the Deer Creek project page
- When the time the reading would have taken has passed
- Then no check step and no toast appears, and Deer Creek's figures are the fixture's "Before" column

**S4 — "Cancel" on the check step adds nothing** (proves R2)
- Given the check step lists the crew log's six changes, and Deer Creek's figures are the fixture's "Before" column
- When the Contributor presses "Cancel"
- Then the Deer Creek project page opens and its figures are still the "Before" column

**S5 — "Read another" goes back to the choose step** (proves R4)
- Given the check step lists the six changes read from `deer-creek-crew-log-2025.xlsx`, chosen in the file control
- When the Contributor presses "Read another"
- Then the choose step shows, with "Read it" as the page's action, the file control still listing `deer-creek-crew-log-2025.xlsx`, and none of the six changes on the page

**S6 — The same file is read again** (proves R4)
- Given the Contributor pressed "Read another" after reading `deer-creek-crew-log-2025.xlsx`
- When they press "Read it" without choosing a file
- Then the page shows "Reading deer-creek-crew-log-2025.xlsx…", and the check step then lists the six changes as rows C1 to C6 say

**S7 — No confirmation is asked** (proves R5)
- Given the check step lists the crew log's six changes
- When the Contributor presses "Read another", reads the crew log again and presses "Cancel"
- Then neither press is followed by a question or a warning

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Story 01 is built. Reading by an outside AI service is on for the workspace. The test environment serves the recorded sample `deer-creek-crew-log-2025.xlsx`.
Test data: `../fixtures.md`: the crew log, rows C1 to C6; Deer Creek's "Before" figures.
Reset: none needed; the script adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and note the seven figures on the Performance measures card | The "Before" column |
| 2 | Press "Import a report" on the card | The choose step, with "Cancel" beside "Read it" |
| 3 | Press "Cancel" | The project page, with no question asked |
| 4 | Press "Import a report", choose `deer-creek-crew-log-2025.xlsx` and press "Read it" | "Reading deer-creek-crew-log-2025.xlsx…", with "Cancel" and no other button at the top of the page |
| 5 | Press "Cancel" while "Reading…" shows, and wait a minute on the project page | The project page; nothing more appears, and the figures are those of step 1 |
| 6 | Press "Import a report" | The choose step with no file in the file control |
| 7 | Choose the crew log, press "Read it" and wait | Six changes, with "Cancel", "Read another" and "Add 6 changes" |
| 8 | Press "Read another" | The choose step, with no question asked, no changes listed, and the crew log's name still in the file control |
| 9 | Press "Read it" without choosing a file, wait, then press "Cancel" | The six changes again; then the project page, with no question asked |
| 10 | Look at the Performance measures card | The seven figures of step 1 |

## Open questions

None open. The story rests on this proposed answer:

- Q-85 (proposed) — "Cancel" during the wait stops the reading service where it can, a reading that finishes anyway is thrown away, and the file sent is deleted (R3, R4, S3, step 5). That no file is kept is decided (spec #42).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | ACN-7 |
| R2 | shown | ACN-7, RUL-53 |
| R3 | shown; proposed (Q-85) | ACN-7; RUL-398 |
| R4 | shown; decided (spec #42); proposed (Q-85) | ACN-8, RUL-53; RUL-399; RUL-398; relies on story 08, R3 (Q-102) |
| R5 | shown | RUL-53 |
- Prototype files: `src/components/projects/firma2-report-import-actions.astro` ("Cancel" and "Read another", and which step shows which); `src/components/projects/firma2-project-report-import.astro` (what "Read another" discards).
- Data shapes: none of its own.
- Where the prototype differs from the requirements above: it sends nothing to stop a reading when "Cancel" is pressed during the wait; after "Read another" on a file dropped on the project page it still holds the file and reads it again on "Read it", but the file control shows no file (story 08, R3 corrects that).
- In the prototype "Cancel" is a link to the project page, and "Read another" clears any message on the choose step and the note for the reviewer (stories 10 and 21).
- Do not copy: nothing specific to this story.

</details>
