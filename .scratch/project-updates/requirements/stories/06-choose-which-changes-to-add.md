# 06 — A Contributor chooses which changes to add

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-61, Q-63, Q-99, Q-110, Q-114, Q-126
Revision: 1
Blocked by: 01, 04
Covers: STA-20, ACN-11, RUL-10, RUL-111, RUL-112, RUL-113, RUL-114, RUL-265, RUL-266, RUL-267
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #18
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R6, on story 01's check step with story 04's tally and selection (used here, not built here), against the recorded sample `deer-creek-crew-log-2025.xlsx`. Built here, not showable until a later story: every unticked arrival of R4 and the "need you" and "already on file" halves of R3 (stories 14, 20, 32, 75); "Nothing to add" in R5 (story 16).

## Story

As a Contributor, I want to tick the changes I mean to add and leave out the rest, so that only what I have checked against the report goes on the record.

## Description

On the check step each proposed change carries a checkbox. Story 01 adds every change listed; this story lets the person decide which, after they have read the changes against the document (story 04) and before the record is written. It also holds the one rule for which changes arrive ticked; each case that arrives unticked belongs to a later story, and with this story's blockers every change arrives ticked. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample crew log.

## Requirements

R1. Each change that can be added has a checkbox, named by the change's label. A ticked change is added when "Add N changes" is pressed; an unticked change is left out and nothing of it reaches the record.

R2. The count on "Add N changes" is the number of ticked changes, and follows every tick and untick at once.

R3. The tally follows every tick and untick at once, and counts each change in exactly one part.
- "ready to add" counts the ticked changes, whatever state they arrived in, so it always equals the number on "Add N changes". A change that arrived unticked and is ticked by hand is counted here.
- "left out" counts the changes that arrived ticked and that the person unticked.
- "need you" counts the changes that arrived unticked because they wait on the person (R4), while they are not ticked. Unticking one the person had ticked puts it back here, unless what it waited on has been settled in the meantime (stories 14 and 75), in which case it counts under "left out".
- "already on file" counts the changes the record already holds, while they are not ticked. "kept by a data source" does not follow ticks: such a change has no checkbox.

R4. A change arrives ticked only when all of these hold: the record does not already hold it, no data source keeps its field, and nothing about it waits on the person. Every other change that has a checkbox arrives unticked.
- A change waits on the person when the reading could not settle its figure (story 14); when it repeats an entry stated earlier in the same reading (story 32); when the report's reporting period is not one the project offers (story 14); when its organization is not in the workspace, or it lacks an organization or an amount (story 75); or when the report names another project, in which case every change that could be added arrives unticked (story 20).
- One badge, "Needs you", marks a flagged change. "Not in this workspace" keeps its own badge. The changes of a report that names another project carry no badge of their own.
- This is worked out when the check step opens. After that only the person changes a tick, apart from the edits that tick or untick a change for them (story 14, R6; story 75, R3) and the check made again when "Add N changes" is pressed (story 32, R5).
- A flagged change that the record already holds counts as already on file, not as flagged (story 32, R7).

R5. When no change is ticked, the commit action cannot be pressed. It reads "Nothing ticked" when at least one change has a checkbox, however the list came to have no tick, and "Nothing to add" when no change has a checkbox.

R6. An unticked change stays in the list, set back visually from the ticked ones, and can be ticked again. Everything else on it is as it was: its place in the order, whatever the person set on it, and its part in selecting (story 04, R7). There is no action that ticks or unticks every change at once.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- "Cancel" and "Read another" — story 35.
- The check that stops an import with an invalid ticked change, among them a change ticked while its amount is empty — story 30.
- Editing a performance measure change — story 07.
- Each change that arrives unticked, its badge and its sentence: a figure not settled, or a period the project does not offer — story 14; a repeat, and "Already on file" — story 32; an organization not in the workspace — story 75; a report that names another project — story 20.
- A change with no checkbox: a field kept by a data source — story 16; a Key facts field, a funding source or a contact the record already holds — stories 15, 17, 18.
- The toast after adding — story 01 (R12, R13). The record of the import — story 22.

## Needs to know from elsewhere

- "Add N changes" saves each added change as a new performance measure entry, with no confirmation, and returns the person to the project page — owned by story 01. Its wording for one change is "Add 1 change"; while it saves it reads "Adding…".
- The tally is one line above the changes that counts them in five parts, a part at zero is left out, and one reads "1 needs you" — owned by story 04 (R2).
- Clicking a change's checkbox also selects the change, as does moving keyboard focus into it, and selecting never scrolls the list — owned by story 04 (R7, R8). The checkbox is the first control on a change, so focus inside a change is first seen here (S9).
- Ticks last only while the check step is open: "Read another" and leaving the page discard them, and the changes left out are not kept after adding — owned by stories 35 and 22.
- The figure on the Performance measures card is the sum of a measure's entries — owned by `performance-measures`.

## Scenarios

All run against the recorded sample `deer-creek-crew-log-2025.xlsx` (`../fixtures.md`), rows C1 to C6, which all arrive ready. The unticked arrivals of R4, the "need you" and "already on file" parts of R3 and "Nothing to add" have no scenario here: no reading shows them with this story's blockers, and stories 14, 16, 20, 32 and 75 prove them.

**S1 — Every ready change arrives ticked** (proves R4)
- Given the crew log's six changes, all ready, read for Deer Creek in its starting state
- When the check step opens
- Then all six are ticked and the action reads "Add 6 changes"

**S2 — Unticking lowers the count** (proves R2)
- Given the check step lists the crew log's six changes, all ticked
- When the Contributor unticks C6
- Then the action reads "Add 5 changes"

**S3 — Ticking raises it again** (proves R2)
- Given C6 is unticked and the action reads "Add 5 changes"
- When the Contributor ticks C6
- Then the action reads "Add 6 changes"

**S4 — An unticked ready change is counted as left out** (proves R3)
- Given the check step lists the crew log's six changes, all ticked, under the tally "6 ready to add"
- When the Contributor unticks C6
- Then the tally reads "5 ready to add · 1 left out"

**S5 — The tally never empties** (proves R3)
- Given the check step lists the crew log's six changes, all ticked
- When the Contributor unticks all six
- Then the tally reads "6 left out"

**S6 — Only ticked changes are added** (proves R1)
- Given every change is unticked except C2, the action reads "Add 1 change", and Deer Creek's figures are the fixture's "Before" column
- When the Contributor presses "Add 1 change"
- Then on the Deer Creek project page "Native trees and shrubs planted" reads 12,577 and the other six figures are still the "Before" column

**S7 — Nothing ticked** (proves R5)
- Given the check step lists the crew log's six changes, all ticked
- When the Contributor unticks all six
- Then the commit action reads "Nothing ticked" and cannot be pressed

**S8 — An unticked change stays and can be ticked again** (proves R6)
- Given the check step lists the crew log's six changes in the order C1 to C6
- When the Contributor unticks C3
- Then C3 is still third in the list, set back from the others, with its checkbox there to tick

**S9 — Keyboard focus in a change selects it** (proves R1)
- Given the list is scrolled so that C5 is in the middle of the window
- When the Contributor moves keyboard focus to C5's checkbox
- Then C5 is marked as selected and is where it was in the window

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). The test environment serves the recorded sample `deer-creek-crew-log-2025.xlsx`. Stories 01 and 04 are built.
Test data: `../fixtures.md`: the crew log, rows C1 to C6; Deer Creek's "Before" figures.
Reset: reset the sample project in the test environment. The script leaves one entry on Deer Creek.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import a report", choose `deer-creek-crew-log-2025.xlsx`, press "Read it" and wait | Six changes, each with a ticked checkbox; the tally "6 ready to add" and the action "Add 6 changes" |
| 2 | Untick "Acres of riparian habitat restored · 2024" | The action reads "Add 5 changes" and the tally "5 ready to add · 1 left out"; the change is still last in the list, set back |
| 3 | Untick the other five | The tally reads "6 left out"; the action reads "Nothing ticked" and does nothing when pressed |
| 4 | Tick "Native trees and shrubs planted · 2025" | The action reads "Add 1 change" and the tally "1 ready to add · 5 left out" |
| 5 | Press Tab until keyboard focus is on the next change's checkbox | That change is marked as selected |
| 6 | Press "Add 1 change" | The Deer Creek project page |
| 7 | Look at the Performance measures card | "Native trees and shrubs planted" reads 12,577; the other six figures are the "Before" column |

On the prototype: press "Sample crew log"; see `../fixtures.md`, On the prototype.

## Open questions

None open. The proposals this story rests on:

- Q-110 (proposed) — R3, S4, S5, steps 2 to 4: the "left out" part; each change in exactly one part.
- Q-61 (proposed) — R4: one flagged badge, "Needs you".
- Q-99 (proposed) — R4: a repeat of an entry arrives unticked (story 32).
- Q-114 (proposed) — R4: a period the project does not offer arrives unticked (story 14).
- Q-63 (proposed) — R4: the changes of a report that names another project arrive unticked (story 20).
- Q-126 (proposed) — R5: "Nothing to add" when no change has a checkbox (story 16).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | ACN-11; RUL-111 |
| R2 | shown | ACN-11 |
| R3 | shown; proposed (Q-110) | ACN-11; RUL-265; relies on story 04, RUL-104 |
| R4 | shown; proposed (Q-61); proposed (Q-99); proposed (Q-114); proposed (Q-63) | RUL-10, RUL-113, RUL-114; RUL-266; relies on story 32; relies on story 14; relies on story 20 |
| R5 | shown; proposed (Q-126) | STA-20; RUL-267 |
| R6 | shown | RUL-112 |
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (which changes count as ticked at 398-399; the tally at 725-746; the rule for what arrives ticked at 693-695 and 751-759; the checkbox at 836-845; the set-back look at 252-255); `src/components/projects/firma2-report-import-actions.astro` (the commit action's wording and its disabled state, 61-63).
- Data shapes, as the prototype models them: each proposed change carries the flags the rule reads (needs a decision, no match, unsure, and for a funding source an organization the workspace does not hold); whether the record already holds it is worked out on the check step, not carried by the reading.
- Where the prototype differs from the requirements above: an unticked ready change is counted in no part, so the tally can be empty; a ticked change the record already holds is counted in two; three flagged badges; "Nothing ticked" in every case; a flagged change ticked by hand keeps its badge (story 14, R5).
- Do not copy: the rule reads the record from browser-local stores; the struck "Check this" and "Unsure" badges (Q-25), which play no part in what arrives ticked.

</details>
