# 30 — A Contributor is stopped before anything is added by an invalid change

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-68, Q-83, Q-96, Q-112, Q-113, Q-114, Q-123, Q-172
Revision: 1
Blocked by: 06, 07, 05
Covers: STA-21, RUL-21, RUL-119, RUL-120, RUL-121, RUL-389, RUL-390, RUL-391
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; no spec decision (shown in the prototype; completed by the proposals named above)
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1, R2 and R4 to R6, on the check step of stories 06 and 07 (the checkbox, the count on the action and the amount field are used here, not built here), against the recorded sample `deer-creek-crew-log-2025.xlsx`, which stands in for enabler 02 until it is built. R3 moved to story 65. The narrow-screen part of R5 uses story 05's "Show source"; story 05 is in `Blocked by` for that reason. Built here, not showable until a later story: a change that arrives with no reporting period, in R2 (story 14, R10); the order of this check and the check against the record, in R1 (story 32). Waiting on a feature that is not built: nothing.

## Story

As a Contributor, I want to be stopped if a change I ticked cannot be added, so that nothing half-finished goes on the record.

## Description

This is the check that runs when the person presses "Add N changes". It comes after they have ticked what they mean to add (story 06) and corrected what they wanted to (story 07), and before anything is saved. A performance measure change is invalid when its amount is empty, mistyped or more precise than the measure takes, or when it has no reporting period. One invalid change stops the whole import, and the person is taken to the first field to put right. The checks on a funding source are story 65. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample crew log; the checks on decimals and the reporting period, the move of focus and the message going as the field is corrected are not in the prototype.

## Requirements

R1. When "Add N changes" is pressed, every ticked change is checked before anything is added. A change that is not ticked is not checked, whatever its fields hold. This check comes first: the check against the record (story 32, R5) is made only once every ticked change passes this one.

R2. A ticked performance measure change needs an amount and a reporting period. Each failing field shows one message.
- The amount must be a figure above zero. An empty amount, zero, a negative figure and text that is not a number fail with "Enter a figure above zero."
- A typed figure is read one way, here and where it ticks a change (story 14, R6): outer spaces are trimmed, and commas and spaces between digits are ignored. Digits, separators and one decimal point are a figure; anything else is not, so "$40" and "1e3" fail.
- A figure with more decimal places than the measure takes fails, with a message naming how many it takes. It is never rounded for the person.
- A figure of one trillion or more fails, with a message naming the limit. Where the project page's own field for the same value sets a lower limit, that limit applies.
- An empty "Reporting period" fails with "Pick a reporting period."
- Nothing else on the change is checked: a breakdown answer is not required.

(R3 moved to story 65 on 2026-11-23, where it is R1: what a ticked funding source change needs. The number is not reused, so that R4 to R6 stay as other stories cite them.)

R4. One failing change stops the whole import: no change is added, not even the valid ones, and the person stays on the check step with everything as they had set it: ticks, edits, the selected change and the note for the reviewer.

R5. After a failed check every failing field shows its message, the first change in the list with a failing field is brought into view, and keyboard focus moves to that change's first failing field. The messages are announced to assistive technology once (SR-6). On a narrow screen with the document showing in place of the changes (story 05), the document closes and the changes come back at the first failing one, with focus in its failing field.

R6. A message goes as soon as its field is corrected, and when its change is unticked. Every press of "Add N changes" checks the ticked changes afresh; once every ticked change passes, they are added.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Ticking and unticking, and "Nothing ticked" — story 06.
- Editing a performance measure change — story 07.
- Which changes arrive with an empty amount or an empty reporting period — stories 13 and 14. Ticked, they are checked by R2 like any other.
- The funding source change and its fields — story 17. What a ticked funding source needs, and its messages — story 65.
- A ticked change the record already holds, and a record that changed while the check step was open — story 32 (R4, R5).
- A save that fails after every check has passed — story 22, R1.

## Needs to know from elsewhere

- Only ticked changes are added, and the action counts them — story 06.
- The amount of a performance measure change is a field the person can edit and clear; it shows thousands separators and accepts them typed; "Reporting period" offers the project's closed reporting periods — story 07 (R1, R3).
- How many decimal places a measure takes — owned by `performance-measures`.
- When every check passes, "Add N changes" saves each ticked change as a new entry, all or nothing, and returns the person to the project page — story 01 (R10, R11) and story 22 (R1).
- A message about a problem is written next to the control it concerns, tied to it, announced once, and goes when its cause does (SR-6) — the standing requirements.
- On a screen 64rem or narrower, "Show source" puts the document in place of the changes, and "Add N changes" stays available — story 05.
- Key facts changes and contacts have nothing the person can edit, so nothing of theirs is checked — story 07 (R6).

## Scenarios

S1 to S5 and S8 to S13 run against the recorded sample crew log in `../fixtures.md`. No sample holds the data of S6 and S7; they describe it by kind. S11 needs story 05 as well.

**S1 — An amount of zero is refused** (proves R2)
- Given the check step lists the crew log's six ticked changes, and the Contributor has changed C2's amount to 0
- When they press "Add 6 changes"
- Then C2's amount shows "Enter a figure above zero."

**S2 — Nothing is added** (proves R4)
- Given the same six ticked changes with C2's amount at 0, and Deer Creek's figures are the "Before" column
- When the Contributor presses "Add 6 changes"
- Then they are still on the check step with all six changes ticked, and Deer Creek's figures are still the "Before" column

**S3 — An unticked change is not checked** (proves R1)
- Given C2's amount is 0 and C2 is unticked, so the action reads "Add 5 changes"
- When the Contributor presses "Add 5 changes"
- Then the Deer Creek project page opens

**S4 — Empty, negative and not a figure** (proves R2)
- Given C2 is ticked and its amount is empty, or −5, or "abc", or "$40", or "1e3"
- When the Contributor presses "Add 6 changes"
- Then in each case C2's amount shows "Enter a figure above zero."

**S5 — Commas are ignored** (proves R2)
- Given C2 is ticked and the Contributor has typed "1,800" as its amount, and Deer Creek's figures are the "Before" column
- When they press "Add 6 changes"
- Then the project page opens and "Native trees and shrubs planted" reads 12,527

**S6 — More decimals than the measure takes** (proves R2)
- Given a ticked change for a measure that takes whole numbers, whose amount the Contributor has changed to a figure with one decimal
- When they press the commit action
- Then nothing is added, the amount shows a message naming how many decimal places the measure takes, and the figure in the field is as they typed it

**S7 — No reporting period** (proves R2)
- Given a change that arrived with "Reporting period" empty and its amount as read, which the Contributor ticked without picking a period
- When they press the commit action
- Then nothing is added and "Reporting period" shows "Pick a reporting period."

**S8 — Every failing field shows its message** (proves R5)
- Given the amounts of C1 and C6 are both empty and all six changes are ticked
- When the Contributor presses "Add 6 changes"
- Then C1's amount and C6's amount each show "Enter a figure above zero."

**S9 — The first failing field is brought into view and takes focus** (proves R5)
- Given the amounts of C1 and C6 are both empty, and the list is scrolled so that C1 is out of view
- When the Contributor presses "Add 6 changes"
- Then C1 is brought into view and keyboard focus is in C1's amount

**S10 — The messages are announced once** (proves R5)
- Given the state of S8, with a screen reader running
- When the Contributor presses "Add 6 changes"
- Then each message is announced once, and is read again with its field when focus enters it

**S11 — On a narrow screen with the document showing** (proves R5)
- Given a screen 64rem or narrower, C2's amount at 0, and the document showing after "Show source" on another change
- When the Contributor presses "Add 6 changes"
- Then the document closes, the changes are shown with C2 in view, C2's amount shows its message and has keyboard focus

**S12 — A message goes when its field is corrected** (proves R6)
- Given C2 shows "Enter a figure above zero." after a failed check
- When the Contributor types 1850 into C2's amount
- Then the message is gone, before anything is pressed

**S13 — Put right and pressed again** (proves R6)
- Given C2 was corrected as in S12, and Deer Creek's figures are the "Before" column
- When the Contributor presses "Add 6 changes"
- Then the project page opens with the "After C1–C6" figures

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person), in a window wider than 64rem. Deer Creek is in its starting state. The test environment serves the recorded sample `deer-creek-crew-log-2025.xlsx`. Stories 01, 04, 06 and 07 are built. A second browser tab is open on the Deer Creek project page.
Test data: `../fixtures.md`: the crew log, rows C1 to C6; Deer Creek's "Before" and "After C1–C6" figures.
Reset: reset the sample project in the test environment. The script leaves six entries on Deer Creek.

| # | Do this | You should see |
|---|---|---|
| 1 | On the Deer Creek project page press "Import a report", choose `deer-creek-crew-log-2025.xlsx`, press "Read it" and wait | Six ticked changes; the action reads "Add 6 changes" |
| 2 | Set the amount of "Native trees and shrubs planted · 2025" to 0 | No message yet |
| 3 | Press "Add 6 changes" | "Enter a figure above zero." on that amount, and the cursor in that field; you are still on the same page, with all six changes still ticked |
| 4 | In the second tab, reload the project page and look at the Performance measures card | The seven figures of the "Before" column |
| 5 | Back on the check step, type 1850 into that amount | The message goes as you type; the field shows 1,850 when you leave it |
| 6 | Clear the amounts of the first and the last change, scroll to the end of the list, and press "Add 6 changes" | The same message on both amounts; the list has moved to the first change and the cursor is in its amount |
| 7 | Set the two amounts back to 5.5 and 2, and press "Add 6 changes" | The Deer Creek project page, with the toast "6 changes added from deer-creek-crew-log-2025.xlsx" |
| 8 | Look at the Performance measures card | The seven figures of the "After C1–C6" column |

On the prototype: press "Sample crew log"; see `../fixtures.md`, On the prototype. Steps 3, 5 and 6 differ there: focus stays on the action and a message stays until the next press.

## Open questions

None open. The story rests on these proposed answers:

- Q-113 (proposed) — R2: decimals are refused, not rounded; the one-trillion limit; "$" and "1e3" are not figures.
- Q-123 (proposed) — R2: one reading of a typed figure, shared with the tick of story 14.
- Q-114 (proposed) — R2: a ticked change with no reporting period fails with "Pick a reporting period."
- Q-68 (proposed) — R5: focus moves to the first failing field.
- Q-83 (proposed) — R5: the messages are announced once.
- Q-112 (proposed) — R5: on a narrow screen the document closes and the changes come back.
- Q-96 (proposed) — R6: a message goes when its field is corrected or its change unticked.
- Q-172 (proposed) — R1: this check runs before the check against the record.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; proposed (Q-172) | RUL-21; RUL-389 |
| R2 | shown; proposed (Q-113, Q-114, Q-123) | RUL-21; RUL-390 |
| R4 | shown | RUL-21; RUL-119 |
| R5 | shown; proposed (Q-68, Q-83, Q-112) | STA-21, RUL-21; RUL-120; RUL-391 |
| R6 | shown; proposed (Q-96) | RUL-21; RUL-121 (reworded: a message goes when its field is corrected or its change unticked) |
- Wording provisional: the message for too many decimals and the message for the limit have no fixed words yet. "Enter a figure above zero." and "Pick a reporting period." are the wording shared across the stories.
- R1's order has no scenario here: it needs story 32, which does not block this story. Its check is "with one ticked change invalid and another the record now holds, the press shows only the invalid field's message; once that is put right, the next press is stopped by story 32, R5".
- Not yet prototyped: the decimals, limit and reporting period checks; the move of focus; the announcement; the narrow-screen return; a message going before the next press.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (how a typed figure is read at 947; the check at 953-960 and 1013-1016; stopping and bringing the first failing change into view at 1035-1039); `src/components/projects/firma2-report-import-actions.astro` (the commit action).
- Data shapes: none of its own. The check reads what the person left in each ticked change; a message belongs to one field of one change.
- Do not copy: focus left on the commit action after a failed check; a message kept until the next press, or for good on a change the person unticked; a "$" ignored in a measure amount and "1e3" read as 1000; the check reading browser-local stores.

</details>
