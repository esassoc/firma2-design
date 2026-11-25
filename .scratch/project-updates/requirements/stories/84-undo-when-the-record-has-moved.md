# 84 — A Contributor's Undo keeps what was changed by hand since, and says so when it cannot take the import back

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-64, Q-75, Q-137, Q-157, Q-178
Revision: 1
Blocked by: 23
Covers: RUL-434, RUL-435, RUL-436, RUL-437, RUL-438, RUL-439, RUL-440, RUL-441, RUL-442, RUL-443, RUL-444
Sources: not in the prototype (its "Undo" handles none of these cases); spec #18; interview 2026-11-23, Q-24
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R11, once story 23 puts "Undo" on the toast, against the recorded samples `deer-creek-crew-log-2025.xlsx` and `deer-creek-treatments-2025.pdf`. R1 to R4 use the hand correction and removal of an entry that `performance-measures` owns, and R7 a publish that `publish-review` owns: both are used here, not built here.

## Story

As a Contributor, I want "Undo" to leave alone whatever I changed by hand after the import, and to tell me plainly when it could not take the import back, so that I never lose later work and never believe an import is gone when it is not.

## Description

Story 23 puts "Undo" on the toast and takes an import back when nothing has moved since it was added. The toast has no timer, so the person can work on the project page, and others can work on the project, while "Undo" is still offered. This story states the one rule for that time: "Undo" removes only what is still as the import left it, it is all or nothing, and its toast always says what really happened. It covers performance measure entries; story 41 applies the same rule to the other kinds of change. Split from story 23 on 2026-11-23, when the answers to the open questions took that story past the scenario limit. None of this is in the prototype, whose "Undo" closes its toast before anything runs.

## Requirements

R1. "Undo" removes only what is still as the import left it. An entry the person corrected by hand since the import (its amount, its reporting period or a breakdown answer) stays whole, as the person's own entry: "Undo" does not touch it.

R2. An entry already removed by hand since the import is passed over. It is counted neither as removed nor as kept.

R3. The toast after "Undo" counts what was really removed and says what stayed: "`<N>` changes removed. `<M>` you changed since were kept.", where `<N>` is the number of changes this "Undo" removed and `<M>` the number left because they were changed by hand. The singular forms are "1 change removed." and "1 you changed since was kept." When nothing was kept, the toast is story 23's "`<N>` changes removed".

R4. When "Undo" finds nothing left to remove, because every change of the import was changed or removed by hand, the toast reads "Nothing removed. You changed every one since."

R5. In each of R1 to R4 the import itself goes: it is no longer recorded, its note goes (story 21), its row leaves the change history, and the rows of the entries removed leave the performance measures' change log (story 23, R7). An entry that was kept is from then on an entry recorded by hand: no screen names a document for it.

R6. When the import was already taken back, from another window, pressing "Undo" changes nothing. The toast closes and a message reads "This import was already undone."

R7. Once any of the import's changes has been published, "Undo" takes nothing back, whatever else is true of the import. Pressed from a toast that was open before the publish, it changes nothing, the toast reads "These changes were published. Correct them on the project page.", and the toast loses "Undo".

R8. "Undo" is all or nothing. If any part of what it should remove cannot be removed (the connection is lost, the save fails), nothing is removed and the import stays recorded as it was. The toast reads "Couldn't undo this import. Nothing was removed.", stays, and keeps "Undo", which can be pressed again. There is no other place to retry from.

R9. The right to edit the project is checked again when "Undo" is pressed. A person who has lost it reads "You can no longer edit this project, so the import stays.", nothing is removed, and the toast loses "Undo".

R10. When more than one of these holds at one press, one message shows, in this order: the right to edit lost (R9); the import already taken back (R6); a change published (R7); then R1 to R4.

R11. Each of these messages is announced to assistive technology once, when it appears. Where the toast keeps "Undo" (R8), "Undo" is still a button and a keyboard stop, and keyboard focus stays on it.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- "Undo" on the toast, the plain path, the toast "`<N>` changes removed", how long the toast lasts and who is shown it — story 23.
- The same rule for a Key facts field, a funding source and a contact — story 41.
- Correcting or removing an entry by hand — `performance-measures`. Editing or removing a funding source or a contact — story 81.
- Publishing — `publish-review`. Reverting one published change — `publish-review`, build 2.

## Needs to know from elsewhere

- The toast carries "Undo", has no timer, is shown once to the person who added the import, and is switched off while the taking back runs; the first toast goes only once the taking back has succeeded — owned by story 23 (R1 to R5).
- Each import records each change and the entry it saved — owned by story 22 (R2). "Undo" compares each entry with what the import saved to know whether it is still as the import left it.
- A person who can edit the project can correct an entry's figure or remove the entry on the Performance measures card — owned by `performance-measures`. However that feature stores a correction, the corrected entry is the person's own from then on (R1).
- A Manager publishes all of a project's waiting changes; a published change is public — owned by `publish-review`.
- Who can edit a project, and how that right is taken away — owned by `users-and-security`.

## Scenarios

All start from Deer Creek's starting state in `../fixtures.md`. S1, S2, S4 and S7 to S9 use the crew log; S3 the treatments sample. S5, S6, S10 and S11 describe by kind something no sample gives: a second window, a publish in another session, two conditions at once.

**S1 — A corrected entry stands** (proves R1, R3)
- Given the crew log's six changes were added to Deer Creek, the toast with "Undo" is showing, and the Contributor has since corrected the entry of row C2 by hand from 1,850 to 1,800 plants
- When they press "Undo"
- Then the toast reads "5 changes removed. 1 you changed since was kept.", Native trees and shrubs planted shows 12,527 (10,727 and the 1,800), and the other six figures are the fixture's "Before" column

**S2 — An entry removed by hand is passed over** (proves R2, R3)
- Given the crew log's six changes were added, the toast is showing, and the Contributor has since removed the entry of row C5 (140 hours) by hand
- When they press "Undo"
- Then the toast reads "5 changes removed", and all seven figures are the "Before" column

**S3 — Every change was changed since** (proves R4)
- Given the treatments sample's two changes were added to Deer Creek, the toast is showing, and the Contributor has since corrected both entries by hand (T1 to 4 acres, T2 to 1,800 plants)
- When they press "Undo"
- Then the toast reads "Nothing removed. You changed every one since.", and Acres of invasive vegetation removed shows 16.6 and Native trees and shrubs planted 12,527

**S4 — The import goes all the same** (proves R5)
- Given the "Undo" of S1 has run
- When the Contributor opens the change history, and then the performance measures' change log for Native trees and shrubs planted
- Then no row of the change history names `deer-creek-crew-log-2025.xlsx`, and the entry of 1,800 plants names no document

**S5 — Already taken back in another window** (proves R6)
- Given the toast with "Undo" is showing in one window, and the same import has already been taken back from another window
- When the Contributor presses "Undo" in the first window
- Then nothing on the record changes, the toast closes, and a message reads "This import was already undone."

**S6 — Published since** (proves R7)
- Given the crew log's six changes were added, the Contributor's toast is still showing, and a Manager has since published Deer Creek
- When the Contributor presses "Undo"
- Then the six entries stay, the toast reads "These changes were published. Correct them on the project page.", and it no longer carries "Undo"

**S7 — "Undo" fails** (proves R8)
- Given the crew log's six changes were added, the toast is showing, and the taking back cannot complete (the connection is lost)
- When the Contributor presses "Undo"
- Then the toast reads "Couldn't undo this import. Nothing was removed." and still carries "Undo", all seven figures are the "After C1–C6" column, and the change history still has the import's row

**S8 — "Undo" can be tried again** (proves R8)
- Given the toast of S7, and the connection is back
- When the Contributor presses "Undo" again
- Then the import is taken back and the toast "6 changes removed" takes the first one's place

**S9 — The right to edit was lost** (proves R9)
- Given the crew log's six changes were added, the toast is showing, and an Administrator has since taken away the Contributor's right to edit Deer Creek
- When the Contributor presses "Undo"
- Then nothing is removed, the toast reads "You can no longer edit this project, so the import stays.", and it no longer carries "Undo"

**S10 — Published, and one entry changed by hand** (proves R10)
- Given an import of several entries, one of them corrected by hand since, and a Manager has then published the project while the toast was open
- When the Contributor presses "Undo"
- Then nothing is removed, and the one message is that the changes were published

**S11 — The failure is announced, and "Undo" keeps focus** (proves R11)
- Given a Contributor using a screen reader and the keyboard, with focus on "Undo", and the taking back cannot complete
- When they press Enter
- Then "Couldn't undo this import. Nothing was removed." is read out once, and keyboard focus is still on "Undo"

## UAT script

The script walks the hand correction (R1, R3, R5) and the publish (R7). The failure, the second window and the lost right are checked by a developer (S5, S7 to S9).

Preconditions: story 23 is built. The test environment serves the recorded samples `deer-creek-crew-log-2025.xlsx` and `deer-creek-treatments-2025.pdf`. Deer Creek is in its starting state. Signed in as someone who can edit Deer Creek. A second account, a Manager of Deer Creek Watershed Alliance or an Administrator, is signed in in another browser for step 8.
Test data: `../fixtures.md`: the crew log (row C2) and Deer Creek's "Before" figures; the treatments sample. The treatments sample is to be made.
Reset: reset the sample project in the test environment. The script publishes Deer Creek.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import a report" on the Performance measures card, choose `deer-creek-crew-log-2025.xlsx`, press "Read it", wait, and press "Add 6 changes" | The project page, with the message "6 changes added from deer-creek-crew-log-2025.xlsx" and "Undo" |
| 2 | Leave the message where it is. On the Performance measures card, correct the 2025 entry of 1,850 for Native trees and shrubs planted to 1,800 | The figure for that measure is 12,527; the message is still there, with "Undo" |
| 3 | Press "Undo" | "5 changes removed. 1 you changed since was kept." |
| 4 | Look at the Performance measures card | Native trees and shrubs planted 12,527; the other six figures as the "Before" column |
| 5 | Press History in the header | No row names the crew log |
| 6 | Dismiss the message. Import `deer-creek-treatments-2025.pdf` the same way, pressing "Add 2 changes" | The message "2 changes added from deer-creek-treatments-2025.pdf" with "Undo" |
| 7 | Leave the message where it is | It stays |
| 8 | In the other browser, as the Manager, open Deer Creek's review and publish | The changes are published |
| 9 | Back in the first browser, press "Undo" | "These changes were published. Correct them on the project page."; the message has no "Undo" any more |
| 10 | Look at the Performance measures card | Acres of invasive vegetation removed 16.8: the entry of 4.2 acres is still there |

## Open questions

None open. This story rests on these proposed answers:

- Q-75 (proposed) — R1, R7, S1 and S6: a hand change made since stands; nothing is taken back once a change is published.
- Q-137 (proposed) — R1 to R6, R8 and S1 to S5: the one Undo rule, its counts, "already undone", all or nothing.
- Q-157 (proposed) — R8, R9 and S7 to S9: the failure toast that keeps "Undo", and the right to edit checked at the press.
- Q-64 (proposed) — R11: every message announced, "Undo" still a keyboard stop.
- Q-178 (proposed) — R10 and S10: which message shows when two of these conditions hold at one press; R7's wording for a press after a publish.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | proposed (Q-137, Q-75) | RUL-434 |
| R2 | proposed (Q-137) | RUL-435 |
| R3 | proposed (Q-137) | RUL-436 |
| R4 | proposed (Q-137) | RUL-437 |
| R5 | proposed (Q-137) | RUL-438 |
| R6 | proposed (Q-137) | RUL-439 |
| R7 | proposed (Q-75) | RUL-440 |
| R8 | proposed (Q-137, Q-157) | RUL-441 |
| R9 | proposed (Q-157) | RUL-442 |
| R10 | proposed (Q-178) | RUL-443 |
| R11 | proposed (Q-64) | RUL-444 |
All not yet prototyped.

- Wording provisional: the singular forms in R3; "These changes were published. Correct them on the project page." (R7). The other five toasts are the feature's shared wording.
- Prototype files: `src/components/projects/firma2-project-imported.astro` (the toast closes and stops listening before the taking back runs, 115-120); `src/lib/report-imports.ts` (taking an import back whole, with no failure handled, 164-181); `src/components/projects/firma2-project-measures.astro` (a hand correction replaces the entries it covers with one new entry, 1460-1472).
- What the prototype does, none of it a requirement: a figure corrected by hand is a new entry in the old one's place, so "Undo" passes over it, yet the toast still counts every change the import added; when the import is already gone the toast closes and says nothing; a failure would leave the import in place with no toast and no "Undo"; nothing checks the right to edit or a publish.
- R1 must hold however a hand correction is stored. If, as in the prototype, a correction replaces several entries of one measure and period with one, the figure the person typed stands whole and none of it is subtracted.

</details>
