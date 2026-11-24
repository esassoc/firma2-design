# 30 — A Contributor is stopped before anything is added by an invalid change

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 06, 07
Covers: STA-21, RUL-21, RUL-119, RUL-120, RUL-121
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; no spec decision (shown in the prototype only)
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1, R2 and R4 to R6, on the check step of stories 06 and 07 (the checkbox, the count on the action and the amount field are used here, not built here); like story 01, only against the recorded crew log reading in `../fixtures.md` until enabler 02 is built. R3 moved to story 65. Waiting: the parts marked "Not decided" or "open", each on the question named beside it.

## Story

As a Contributor, I want to be stopped if a change I ticked cannot be added, so that nothing half-finished goes on the record.

## Description

This is the check that runs when the person presses "Add N changes". It comes after they have ticked what they mean to add (story 06) and corrected what they wanted to (story 07), and before anything is saved. A performance measure change becomes invalid when the person clears or mistypes its amount, or ticks one that arrived empty. One invalid change stops the whole import, and the person is shown which fields to put right. Split from story 06 on 2026-11-23; the checks on a funding source were split to story 65 the same day. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample crew log.

## Requirements

R1. When "Add N changes" is pressed, every ticked change is checked before anything is added. A change that is not ticked is not checked, whatever its fields hold.

R2. A ticked performance measure change needs an amount above zero. An empty amount, zero, a negative figure and text that is not a number all fail, and the amount then shows "Enter a figure above zero." Commas and spaces in a figure are ignored. Nothing else on the change is checked: a breakdown answer is not required. Not decided: decimals and an upper limit (Q-113); a reporting period the project does not offer (Q-114).

(R3 moved to story 65 on 2026-11-23, where it is R1: what a ticked funding source change needs. The number is not reused, so that R4 to R6 stay as other stories cite them.)

R4. One failing change stops the whole import: no change is added, not even the valid ones, and the person stays on the check step with everything as they had set it: ticks, edits, the selected change and the note for the reviewer.

R5. After a failed check every failing field shows its message, and the first change in the list with a failing field is brought into view. Not decided: whether keyboard focus moves to the first failing field (Q-68); whether the messages are announced to assistive technology, as SR-6 asks (Q-83); what the person sees when the check fails while the document pane covers the changes on a narrow screen (Q-112).

R6. Every press of "Add N changes" checks the ticked changes afresh: a message on a ticked change that now passes is gone, and once every ticked change passes, they are added. Not decided: whether a message goes as soon as its field is corrected, or when its change is unticked. (open: Q-96)

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Ticking and unticking, and "Nothing ticked" — story 06.
- Editing a performance measure change — story 07.
- Which changes arrive with an empty amount — stories 13 and 14. Ticked, they are checked by R2 like any other.
- The funding source change and its fields — story 17. What a ticked funding source needs, and its three messages — story 65.
- A ticked change the record already holds: it passes this check; what adding it does — story 32 (R4).
- A save that fails after the check has passed — not decided (Q-44); story 01, R10.

## Needs to know from elsewhere

- Only ticked changes are added, and the action counts them — owned by story 06.
- The amount of a performance measure change is a field the person can edit and clear — owned by story 07.
- When every ticked change passes, "Add N changes" saves each as a new entry and returns the person to the project page — owned by story 01.
- A message about a problem is written next to the control it concerns and announced once (SR-6) — owned by the standing requirements.
- The figure on the Performance measures card is the sum of a measure's entries — owned by `performance-measures`.
- Key facts changes and contacts have nothing the person can edit, so nothing of theirs is checked — owned by story 07 (R6).

## Scenarios

All run against the recorded crew log reading in `../fixtures.md`.

**S1 — An amount of zero is refused** (proves R2)
- Given the check step lists the crew log's six ticked changes, and the Contributor has changed C2's amount to 0
- When they press "Add 6 changes"
- Then C2's amount shows "Enter a figure above zero."

**S2 — Nothing is added** (proves R4)
- Given the same six ticked changes with C2's amount at 0, and Deer Creek's figures are the fixture's "Before" column
- When the Contributor presses "Add 6 changes"
- Then they are still on the check step, and Deer Creek's figures are still the "Before" column

**S3 — An unticked change is not checked** (proves R1)
- Given C2's amount is 0 and C2 is unticked, so the action reads "Add 5 changes"
- When the Contributor presses "Add 5 changes"
- Then the Deer Creek project page opens

**S4 — Empty, negative and not a number** (proves R2)
- Given C2 is ticked and its amount is empty, or −5, or "abc"
- When the Contributor presses "Add 6 changes"
- Then in each case C2's amount shows "Enter a figure above zero."

**S5 — Commas are ignored** (proves R2)
- Given C2 is ticked and the Contributor has typed "1,800" as its amount, and Deer Creek's figures are the "Before" column
- When they press "Add 6 changes"
- Then the project page opens and "Native trees and shrubs planted" reads 12,527

**S6 — Every failing field shows its message** (proves R5)
- Given the amounts of C1 and C6 are both empty and all six changes are ticked
- When the Contributor presses "Add 6 changes"
- Then C1's amount and C6's amount each show "Enter a figure above zero."

**S7 — The first failing change is brought into view** (proves R5)
- Given the amounts of C1 and C6 are both empty, and the list is scrolled so that C1 is out of view
- When the Contributor presses "Add 6 changes"
- Then C1 is brought into view

**S8 — Put right and pressed again** (proves R6)
- Given C2 shows "Enter a figure above zero." after a failed check, and Deer Creek's figures are the "Before" column
- When the Contributor sets C2's amount back to 1850 and presses "Add 6 changes"
- Then the project page opens with the fixture's "After C1–C6" figures

## UAT script

Preconditions: story 01's UAT script has been run to its step 5 in a window wider than 64rem, so the check step lists the crew log's changes. Stories 06 and 07 are built. A second browser tab is open on the Deer Creek project page.
Test data: `../fixtures.md`: the crew log, rows C1 to C6; Deer Creek's "Before" and "After C1–C6" figures. Rows C3 and C4, and so the count of six and two of the "After" figures, wait on Q-82.
Reset: not known (Q-88). The script leaves six entries on Deer Creek.

| # | Do this | You should see |
|---|---|---|
| 1 | Set the amount of "Native trees and shrubs planted · 2025" to 0 | No message yet |
| 2 | Press "Add 6 changes" | "Enter a figure above zero." on that amount; you are still on the same page, with all six changes still ticked |
| 3 | In the second tab, reload the project page and look at the Performance measures card | The seven figures of the "Before" column |
| 4 | Back on the check step, clear the amount of the last change too, scroll to the end of the list, and press "Add 6 changes" | The same message on both amounts, and the list moved to show "Native trees and shrubs planted · 2025" |
| 5 | Set the two amounts back to 1850 and 2, and press "Add 6 changes" | The Deer Creek project page |
| 6 | Look at the Performance measures card | The seven figures of the "After C1–C6" column |

On the prototype: press "Sample crew log"; see `../fixtures.md`, On the prototype.

## Open questions

- Q-68 — R5 and S7: whether keyboard focus moves to the first failing field; an answer adds a scenario.
- Q-82 — every scenario and steps 2, 4 and 5: the count of six; S8 and step 6: two of the "After" figures.
- Q-83 — R5: whether SR-6's "announced once" holds for these messages; an answer adds a scenario.
- Q-88 — the Reset line, and how the recorded reading is served for the Preconditions.
- Q-96 — R6: whether a message goes as soon as its field is corrected, and when its change is unticked; an answer changes R6 and adds a scenario.
- Q-112 — would change R5: on a narrow screen with the document pane showing, a failed check must show the person something.
- Q-113 — would change R2 and S4: an amount with more decimals than the measure allows, or over a limit, would fail with its own message.
- Q-114 — would add a check to R2: a reporting period the project does not offer.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | RUL-21 |
| R2 | shown | RUL-21 |
| R4 | shown | RUL-21; RUL-119 |
| R5 | shown | STA-21, RUL-21; RUL-120 |
| R6 | shown | RUL-21; RUL-121 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (how a typed figure is read at 947; the check at 953-960 and 1013-1016; stopping and bringing the first failing change into view at 1035-1039); `src/components/projects/firma2-report-import-actions.astro` (the commit action).
- Data shapes: none of its own. The check reads what the person left in each ticked change; a message belongs to one field of one change.
- What the prototype does where nothing is decided (not requirements): it leaves keyboard focus on the commit action after a failed check (Q-68); it marks the field invalid and ties the message to it but announces nothing (Q-83); it keeps a message until the next press, and clears messages only on changes that are ticked at that press, so a failing change the person unticks keeps its message for as long as the check step is open (Q-96); it ignores a "$" in a measure amount, as it does in a funding source's, and reads "1e3" as 1000 (Q-113); it checks in the browser only, so it cannot know that the record changed while the check step was open (Q-44, Q-48).
- Do not copy: the check reading browser-local stores.

</details>
