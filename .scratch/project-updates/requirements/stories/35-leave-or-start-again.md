# 35 — A Contributor leaves Import a report, or starts again, without adding anything

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 01
Covers: ACN-7, ACN-8, RUL-53
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; no spec decision (shown in the prototype only)
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R5, on story 01's page (its three steps and its one action are used here, not built here); like story 01, the wait and the check step only against the recorded crew log reading in `../fixtures.md` until enabler 02 is built. Waiting: what the reading service does when "Cancel" ends a reading, in R3, on Q-85; a file that was dropped on the project page, in R4, on Q-102.

## Story

As a Contributor, I want a plain way out of Import a report and a way to read a different document, so that a wrong file or a poor reading costs me nothing.

## Description

Story 01's page has one action at a time and no way back but the breadcrumb. This story adds the two secondary actions of the page: "Cancel", on every step, and "Read another", on the check step. Neither asks for confirmation, because nothing reaches the record before "Add N changes" is pressed. Split from story 06 on 2026-11-23. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample crew log.

## Requirements

R1. "Cancel" is offered on every step of the page: the choose step, the wait and the check step. It sits with the page's action and stays in view with it.

R2. "Cancel" returns the person to the project page the import was started for. Nothing has been added to the record, and nothing of the visit is kept: opening Import a report again starts on the choose step with no file held.

R3. During the wait, "Cancel" ends the reading, as any other way of leaving the page does. (open: Q-85)

R4. "Read another" is offered on the check step only. It returns the person to the choose step, and the reading is discarded with everything the person set on the check step. Nothing has been added to the record.
- The choose step is as the person left it: the file control still holds the file that was read and shows its name, and no message shows. Where story 09 is built, the choice between "File" and "Paste text" is as it was, and pasted text is still in the text area; no fixture of this story's reaches that case.
- Pressing "Read it" without choosing again reads the same file again, as a new reading: the changes arrive as read, and nothing set on the first reading comes back.
- Choosing another file first replaces the held one (story 01, R5).
- Not decided: what the file control shows when the file that was read had been dropped on the project page (Q-102).

R5. Neither action asks for confirmation or shows a warning, whatever step the page is on and whatever the person has set on the check step.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Ticking and unticking changes — story 06. Editing a change — story 07. The note for the reviewer — story 21.
- "Undo", after the changes have been added — story 23.
- A reading that fails returns to the choose step by itself — story 10.
- A reading the person can leave and come back to — story 28 (`later`).

## Needs to know from elsewhere

- The page has one primary action at a time ("Read it", none during the wait, "Add N changes"), in view at every width — owned by story 01. This story's two actions sit beside it and are never the primary one.
- A reading is not stored: leaving the page before "Add N changes" ends it, nothing of it is kept, and opening the page again starts on the choose step with no file held — owned by story 01.
- What the person sets on the check step, which "Read another" discards: ticks (story 06), edits to a change (story 07) and the note for the reviewer (story 21).

## Scenarios

S2 to S6 run against the recorded crew log reading in `../fixtures.md`.

**S1 — "Cancel" on the choose step** (proves R1, R2)
- Given a Contributor is on the choose step of Import a report for Deer Creek
- When they press "Cancel"
- Then the Deer Creek project page opens

**S2 — "Cancel" during the wait** (proves R1, R3)
- Given `deer-creek-crew-log-2025.xlsx` is being read, and the page offers "Cancel" and no other action
- When the Contributor presses "Cancel" and then opens Import a report again
- Then the page is on the choose step with no file held

**S3 — "Cancel" on the check step adds nothing** (proves R2)
- Given the check step lists the crew log's six changes, and Deer Creek's figures are the fixture's "Before" column
- When the Contributor presses "Cancel"
- Then the Deer Creek project page opens and its figures are still the "Before" column

**S4 — "Read another" goes back to the choose step** (proves R4)
- Given the check step lists the six changes read from `deer-creek-crew-log-2025.xlsx`, chosen in the file control
- When the Contributor presses "Read another"
- Then the choose step shows, with "Read it" as the page's action, the file control still holding `deer-creek-crew-log-2025.xlsx`, and none of the six changes on the page

**S5 — The same file is read again** (proves R4)
- Given the Contributor pressed "Read another" after reading `deer-creek-crew-log-2025.xlsx`
- When they press "Read it" without choosing a file
- Then the page shows "Reading deer-creek-crew-log-2025.xlsx…", and the check step then lists the six changes as rows C1 to C6 say

**S6 — No confirmation is asked** (proves R5)
- Given the check step lists the crew log's six changes
- When the Contributor presses "Read another", reads the crew log again and presses "Cancel"
- Then neither press is followed by a question or a warning

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Story 01 is built. The recorded crew log reading is served for the crew log file.
Test data: `../fixtures.md`: the crew log; Deer Creek's "Before" figures. The count of six waits on Q-82.
Reset: none needed; the script adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and note the seven figures on the Performance measures card | The "Before" column |
| 2 | Press "Import report" | The choose step, with "Cancel" beside "Read it" |
| 3 | Press "Cancel" | The project page, with no question asked |
| 4 | Press "Import report", choose `deer-creek-crew-log-2025.xlsx` and press "Read it" | "Reading deer-creek-crew-log-2025.xlsx…", with "Cancel" and no other button at the top of the page |
| 5 | Press "Cancel" while "Reading…" shows, then press "Import report" | The project page, then the choose step with no file in the file control |
| 6 | Choose the crew log, press "Read it" and wait | Six changes, with "Cancel", "Read another" and "Add 6 changes" |
| 7 | Press "Read another" | The choose step, with no question asked, no changes listed, and the crew log's name still in the file control |
| 8 | Press "Read it" without choosing a file, wait, then press "Cancel" | The six changes again; then the project page, with no question asked |
| 9 | Look at the Performance measures card | The seven figures of step 1 |

On the prototype: press "Sample crew log" in place of choosing the file; the wait lasts 1.6 seconds, so step 5 needs a quick hand. See `../fixtures.md`, On the prototype.

## Open questions

- Q-82 — S3 to S6 and steps 6 and 8: the count of six.
- Q-85 — R3: whether "Cancel" during the wait must also stop the reading service; no scenario covers it yet.
- Q-88 — Preconditions: how the recorded reading is served.
- Q-102 — would change R4: what the file control shows, and whether "Read it" reads the file again, after "Read another" on a file that was dropped on the project page.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | ACN-7 |
| R2 | shown | ACN-7, RUL-53 |
| R3 | shown | ACN-7 |
| R4 | shown | ACN-8, RUL-53 |
| R5 | shown | RUL-53 |

- Prototype files: `src/components/projects/firma2-report-import-actions.astro` ("Cancel" and "Read another", and which step shows which); `src/components/projects/firma2-project-report-import.astro` (what "Read another" discards).
- Data shapes: none of its own.
- What the prototype does where nothing is decided (not requirements): it sends nothing to stop a reading when "Cancel" is pressed during the wait (Q-85); after "Read another" on a file dropped on the project page it still holds the file and reads it again on "Read it", but the file control shows no file (Q-102).
- In the prototype "Cancel" is a link to the project page, and "Read another" clears any message on the choose step and the note for the reviewer (stories 10 and 21).
- Do not copy: nothing specific to this story.

</details>
