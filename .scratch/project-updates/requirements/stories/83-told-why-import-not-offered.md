# 83 — A Contributor is told why Import a report is not offered while reading is off or unavailable

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-165, Q-166, Q-109
Revision: 1
Blocked by: 01, 08, 12, 82
Covers: STA-39, RUL-428, RUL-429, STA-40, RUL-430, RUL-431, RUL-432, RUL-433
Sources: not in the prototype; spec #41; interview 2026-11-23, Q-52
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R7, on the entry points and page that stories 01 and 08 build, the no-access page of story 12 (S9 shows it) and the setting that story 82 builds (used here, not built here). Against the recorded crew log sample in `../fixtures.md`, which stands in for enabler 02 (not built): R5 and R6. The unavailable state only against story 82's stand-in for the operator. Nothing waits on a question.

## Story

As a Contributor, I want to be told why Import a report is not there when my workspace has reading by an outside AI service off, so that I know it is a setting and who can change it, and do not go looking for a button that is not coming.

## Description

Story 82 gives each workspace a setting with three states. This story is what the people who would use Import a report see in the two states where it does not exist: the three entry points are gone, the place the card button would be says why in one line, and the page's own address says the same and reads nothing. The setting is tested again at the moment a document would be sent, so a page left open does not send one after an Administrator has turned reading off. Not yet prototyped.

## Requirements

R1. While the workspace's setting is off or unavailable, none of the three entry points is offered to anyone. They are absent, not disabled: the Performance measures card has no "Import a report" button, the project page's header has no "Import a report" action, at any width, and a file dropped on the project page starts no import.

R2. Where the card button would be, the Performance measures card shows one line that says why:
- off: "Import a report is off for this workspace. An administrator can turn it on in workspace settings."
- unavailable: "Import a report is not available to this workspace."
The line names the role and never a person. To an Administrator, "workspace settings" in the off line is a link to the setting (story 82).

R3. The line, and everything else in this story, is shown only to a person who can edit the project. The right to edit is tested first: someone who cannot edit the project sees no button and no line on the project page, and at the page's address sees what story 12 (R6) shows them, whatever the setting.

R4. While the setting is off or unavailable, the Import a report page's address shows a person who can edit the project the line of R2 and a way back to the project. It shows no file control, no "Paste text", no "Read it", and reads nothing.

R5. The setting is tested again when "Read it" is pressed, before the document is sent. If it has been turned off or made unavailable since the page opened, nothing is sent, the choose step gives way to the line of R2 with a way back to the project, and the held file or pasted text is let go.

R6. Turning the setting off does not take away a reading the person already has. A check step that is already open can still be added with "Add N changes", and a reading already under way when the setting was turned off finishes and can be added: the document had already been sent, and nothing more leaves the workspace.

R7. A readable file dropped on the project page while the setting is off or unavailable is taken by the page, so the browser does not open it; the project page stays as it was and a toast says the line of R2. The same holds when the setting changed after the project page was opened: the test is made at the drop.

R8. When the setting is turned on, the entry points are offered and the line is gone from the person's next load of the project page. Nobody signs in again.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The setting, who may change it, and what an Administrator agrees to — story 82.
- Who is offered Import a report while the setting is on, and what a person who cannot edit the project sees — story 12.
- The entry points themselves — stories 01 and 08.
- Imports already on the record when the setting is turned off: they stay as they are, with their document names and quotes (story 82, R7). "Undo" on a toast that is still open works as story 23 says; it sends nothing.
- Telling people that the setting changed: nobody is notified.

## Needs to know from elsewhere

- The setting has three states, off, on and unavailable; it is off until an Administrator turns it on; only the product's operator makes it unavailable — owned by story 82. This story asks it one thing, for a workspace: which state.
- The three entry points are the "Import a report" button on the Performance measures card (story 01), the "Import a report" action in the project page's header and a readable file dropped on the project page (story 08).
- The project page takes every file dropped on it and says in a toast why one starts nothing — owned by story 08 (R5). R7 is that rule for this case.
- The right to edit is tested when the page opens and again on "Read it" and "Add N changes" — owned by stories 12 (R6) and 01 (R14). At "Read it" the right to edit is tested before the setting.
- The Performance measures card, the project page's header and its toasts — owned by `project-record`.

## Scenarios

`../fixtures.md` gives the sample workspace with the setting on, and no second account; the scenarios need an Administrator to change the setting (story 82) and describe a Viewer and an unavailable workspace by kind. S6 and S7 run against the recorded crew log sample.

**S1 — Off: no entry point, and a line that says why** (proves R1, R2)
- Given a workspace whose setting is off, and a Contributor who can edit Deer Creek
- When they open the Deer Creek project page
- Then the Performance measures card has no "Import a report" button and reads "Import a report is off for this workspace. An administrator can turn it on in workspace settings.", and the header has no "Import a report" action

**S2 — Unavailable: the other line** (proves R2)
- Given a workspace the product's operator has made unavailable, and a Contributor who can edit a project in it
- When they open that project's page
- Then the Performance measures card reads "Import a report is not available to this workspace.", with no button

**S3 — An Administrator gets a link to the setting** (proves R2)
- Given a workspace whose setting is off, and an Administrator on the Deer Creek project page
- When they follow "workspace settings" in the line on the Performance measures card
- Then the Security page of workspace settings opens, at the section "Reading by an outside AI service"

**S4 — A dropped file starts nothing** (proves R1, R7)
- Given a workspace whose setting is off, and a Contributor on the Deer Creek project page
- When they drop `deer-creek-crew-log-2025.xlsx` on the page
- Then the project page stays as it was, no reading starts, and a toast says "Import a report is off for this workspace. An administrator can turn it on in workspace settings."

**S5 — The page's address says the same** (proves R4)
- Given a workspace whose setting is off, and a Contributor who has the address of Deer Creek's Import a report page
- When they open that address
- Then the page shows the off line and a way back to Deer Creek, with no file control and no "Read it"

**S6 — Turned off between opening the page and "Read it"** (proves R5)
- Given a Contributor on the choose step for Deer Creek with `deer-creek-crew-log-2025.xlsx` held, and an Administrator has since turned the setting off
- When the Contributor presses "Read it"
- Then no reading starts, and the page shows the off line and a way back to Deer Creek in place of the file control

**S7 — A check step already open can still be added** (proves R6)
- Given a Contributor on the check step with the crew log's six changes listed, and an Administrator has since turned the setting off
- When the Contributor presses "Add 6 changes"
- Then the Deer Creek project page opens with the toast "6 changes added from deer-creek-crew-log-2025.xlsx", its figures are the fixture's "After C1–C6" column, and the Performance measures card shows the off line and no button

**S8 — Someone who cannot edit sees none of it** (proves R3)
- Given a workspace whose setting is off, and a Viewer who can see Deer Creek
- When they open the Deer Creek project page
- Then the Performance measures card shows no button and no line about Import a report

**S9 — Someone who cannot edit, at the address** (proves R3)
- Given a workspace whose setting is off, and a Viewer who has the address of Deer Creek's Import a report page
- When they open that address
- Then they see the product's standard no-access page, not the off line

**S10 — Turned on again** (proves R8)
- Given a Contributor is on the Deer Creek project page, which shows the off line, and an Administrator then turns the setting on
- When the Contributor reloads the page
- Then the Performance measures card has the "Import a report" button and no line, and the header has the "Import a report" action

## UAT script

The unavailable state (S2) needs a second workspace the operator has made unavailable (to be made); the script covers the off state.

Preconditions: stories 01, 08 and 82 are built. Two accounts in the sample workspace, in two browser windows: an Administrator, on the Security page of workspace settings, and a Contributor who can edit Deer Creek and is not an Administrator. The sample workspace starts with reading by an outside AI service on. The test environment serves the recorded sample `deer-creek-crew-log-2025.xlsx`.
Test data: `../fixtures.md`: Deer Creek's "Before" and "After C1–C6" figures; the crew log, rows C1 to C6. The two accounts are to be made; no sample holds them.
Reset: reset the sample project in the test environment, and leave the setting on (step 12 turns it on again).

| # | Do this | You should see |
|---|---|---|
| 1 | As the Contributor, open the Deer Creek project page and press "Import a report" on the Performance measures card | The Import a report page. Note its address, then go back to the project page |
| 2 | As the Administrator, press "Turn off" in the section "Reading by an outside AI service" | The section shows "Off" |
| 3 | As the Contributor, reload the Deer Creek project page | No "Import a report" button on the card and none in the header. The card reads "Import a report is off for this workspace. An administrator can turn it on in workspace settings." |
| 4 | Drop `deer-creek-crew-log-2025.xlsx` on the middle of the page | The project page, unchanged, and a message with the same sentence. No "Reading…" |
| 5 | Open the address noted in step 1 | The same sentence and a way back to Deer Creek. No file control and no "Read it" |
| 6 | As the Administrator, tick the checkbox and press "Turn on" | The section shows "On" |
| 7 | As the Contributor, reload the project page, press "Import a report" and choose the crew log. Do not press "Read it" yet | The button is back; the file control lists the crew log |
| 8 | As the Administrator, press "Turn off" | The section shows "Off" |
| 9 | As the Contributor, press "Read it" | No "Reading…". The page shows the off sentence and a way back to Deer Creek |
| 10 | As the Administrator, turn it on again. As the Contributor, open Import a report, choose the crew log, press "Read it" and wait | Six changes, and "Add 6 changes" |
| 11 | As the Administrator, press "Turn off". As the Contributor, press "Add 6 changes" | The Deer Creek project page with "6 changes added from deer-creek-crew-log-2025.xlsx"; the card's figures are the "After C1–C6" column; the card shows the off sentence and no button |
| 12 | As the Administrator, tick the checkbox and press "Turn on" | The section shows "On", as at the start |

## Open questions

None open. The story rests on these proposed answers:

- Q-165 (proposed) — a reading the person already has when the setting is turned off can still be added (R6, S7, step 11). If the user would rather it be discarded, R6 reverses and the person sees the line of R2 on "Add N changes".
- Q-166 (proposed) — a file dropped on the project page while the setting is off is taken by the page and answered with a toast (R7, S4, step 4), and the off line links an Administrator to the setting (R2, S3).
- Q-109 (proposed) — a test made when the page opens is made again on "Read it"; here the test is the setting (R5, S6, step 9).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided (spec #41) | STA-39 (not yet prototyped) |
| R2 | decided (spec #41); proposed (Q-166) | RUL-428 (not yet prototyped) |
| R3 | decided (spec #41); relies on story 12, RUL-57 | RUL-429 (not yet prototyped) |
| R4 | decided (spec #41) | STA-40 (not yet prototyped) |
| R5 | decided (spec #41); proposed (Q-109) | RUL-430 (not yet prototyped) |
| R6 | proposed (Q-165) | RUL-431 (not yet prototyped) |
| R7 | proposed (Q-166) | RUL-432 (not yet prototyped) |
| R8 | decided (spec #41) | RUL-433 (not yet prototyped) |
- Wording provisional: the two lines of R2. That the place says why is decided; the sentences are placeholders for the microcopy pass.
- Prototype files: none show this state. The places it touches are `src/components/projects/firma2-project-measures.astro` (the card and its button), `src/components/projects/firma2-project-actions.astro` (the header action), `src/components/projects/firma2-project-imported.astro` (the drop on the project page) and `src/pages/prototypes/projects/[project]/import-report.astro` (the page).
- Data shapes: none of its own. The one question is the state of the workspace's setting.
- The project page on a project with no performance measure may not show the Performance measures card in the same form (story 12, S5). Where the card is absent, the line of R2 has no place on the project page, and the person meets it at the page's address (R4) or on a drop (R7).
- Do not copy: nothing; there is nothing to copy.

</details>
