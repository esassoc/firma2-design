# 06 — A Contributor chooses which changes to add

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 01, 04
Covers: STA-20, ACN-11, RUL-10, RUL-111, RUL-112, RUL-113, RUL-114
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #18
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R6, on story 01's check step with story 04's tally and selection (used here, not built here); like story 01, only against the recorded crew log reading in `../fixtures.md` until enabler 02 is built. With these blockers every change arrives ticked, so the unticked arrivals of R4 are built here and first seen through stories 14, 16, 75 and 32. Waiting: what the flagged states in R4 are called on Q-61; the parts of R3 marked "Not decided" on Q-110; the count of six on Q-82.

## Story

As a Contributor, I want to tick the changes I mean to add and leave out the rest, so that only what I have checked against the report goes on the record.

## Description

On the check step each proposed change carries a checkbox. Story 01 adds every change listed; this story lets the person decide which, at the "Settle what waits on you" step, after they have read the changes against the document (story 04) and before the record is written. It also holds the rule for which changes arrive ticked; the cases that arrive unticked each belong to a later story. "Cancel" and "Read another" were split to story 35 on 2026-11-23. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample crew log.

## Requirements

R1. Each change that can be added has a checkbox, named by the change's label. A ticked change is added when "Add N changes" is pressed; an unticked change is left out and nothing of it reaches the record.

R2. The count on "Add N changes" is the number of ticked changes, and follows every tick and untick at once.

R3. The tally follows every tick and untick at once.
- "ready to add" counts the ticked changes, whatever state they arrived in.
- "need you" counts the flagged changes that are not ticked: ticking one takes it out of that part, unticking it puts it back.
- "already on file" and "kept by a data source" do not follow ticks.
- Not decided: a ready change the person unticked is counted in no part, and a ticked change the record already holds is counted in two (Q-110).

R4. A change arrives ticked only when all of these hold: the record does not already hold it, no data source keeps its field, and it is not flagged. A change is flagged when the report supports two readings of it, when the report counts another quantity than the measure asks for, when the reading could not settle the figure, or when its organization is not in the workspace. Every other change arrives unticked. (open: Q-61)
- This is worked out once, when the check step opens. After that only the person changes a tick, and the two edits that tick a change for them (story 14, R6; story 75, R3).
- A flagged change that the record already holds counts as already on file, not as flagged: it is counted under "already on file" and never under "need you".

R5. When no change is ticked, the commit action reads "Nothing ticked" and cannot be pressed. That is so however the list came to have no tick: the person unticked them all, or every change arrived unticked.

R6. An unticked change stays in the list, set back visually from the ticked ones, and can be ticked again. Everything else on it is as it was: its place in the order, whatever the person set on it, and its part in selecting (story 04, R7). There is no action that ticks or unticks every change at once.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- "Cancel" and "Read another" — story 35.
- The check that stops an import with an invalid ticked change, among them a flagged change ticked while its amount is empty — story 30.
- Editing a performance measure change — story 07.
- A change that arrives unticked: "Already on file", and what adding one the person ticked does — story 32; flagged, and a change that ticks itself once filled — story 14; an organization not in the workspace — story 75. A flagged change the record already holds, its badge and its scenario — story 14 (R8).
- A field kept by a data source, which has no checkbox — story 16.
- The toast after adding — story 01 (R12, R13). The record of the import — story 22.

## Needs to know from elsewhere

- "Add N changes" saves each added change as a new performance measure entry, with no confirmation, and returns the person to the project page — owned by story 01. Its wording for one change is "Add 1 change".
- The tally is one line above the changes that counts them in four parts, and a part at zero is left out — owned by story 04 (R2).
- Clicking a change's checkbox also selects the change — owned by story 04 (R7). So does moving keyboard focus into a change, and selecting never scrolls the list of changes — owned by story 04 (R7, R8). The checkbox of R1 is the first control on a change that takes keyboard focus, so that half of story 04 is first seen here (S8).
- With stories 01 and 04 alone every change is ready, so every change arrives ticked; each case that arrives unticked is proven in its own story (14, 16, 75, 32).
- Ticks last only while the check step is open: "Read another" and leaving the page discard them — owned by story 35.
- The figure on the Performance measures card is the sum of a measure's entries — owned by `performance-measures`.

## Scenarios

All run against the recorded crew log reading in `../fixtures.md`. The "need you" and "already on file" clauses of R3 and R4 have no scenario here: no reading shows them with this story's blockers, and stories 14, 75 and 32 prove them. S8 was added on 2026-11-23: it is the keyboard half of story 04's R7, with the exception in its R8, which story 04 cannot show because no change has a control before the checkbox of R1.

**S1 — Every ready change arrives ticked** (proves R4)
- Given the crew log's six changes, all ready, read for a Deer Creek that has no import
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

**S4 — The tally follows** (proves R3)
- Given the check step lists the crew log's six changes, all ticked, under the tally "6 ready to add"
- When the Contributor unticks C6
- Then the tally reads "5 ready to add"

**S5 — Only ticked changes are added** (proves R1)
- Given every change is unticked except C2, the action reads "Add 1 change", and Deer Creek's figures are the fixture's "Before" column
- When the Contributor presses "Add 1 change"
- Then on the Deer Creek project page "Native trees and shrubs planted" reads 12,577 and the other six figures are still the "Before" column

**S6 — Nothing ticked** (proves R5)
- Given the check step lists the crew log's six changes, all ticked
- When the Contributor unticks all six
- Then the commit action reads "Nothing ticked" and cannot be pressed

**S7 — An unticked change stays and can be ticked again** (proves R6)
- Given the check step lists the crew log's six changes in the order C1 to C6
- When the Contributor unticks C3
- Then C3 is still third in the list, set back from the others, with its checkbox there to tick

**S8 — Keyboard focus in a change selects it** (proves R1)
- Given the list is scrolled so that C5 is in the middle of the window
- When the Contributor moves keyboard focus into C5
- Then C5 is marked as selected and is where it was in the window

## UAT script

Preconditions: story 01's UAT script has been run to its step 5, so the check step lists the crew log's changes. Story 04 is built.
Test data: `../fixtures.md`: the crew log, rows C1 to C6; Deer Creek's "Before" and "After C1–C6" figures. The count of six waits on Q-82.
Reset: not known (Q-88). The script leaves one entry on Deer Creek.

| # | Do this | You should see |
|---|---|---|
| 1 | Look at the six changes | Each has a ticked checkbox; the tally reads "6 ready to add" and the action "Add 6 changes" |
| 2 | Untick "Acres of riparian habitat restored · 2024" | The action reads "Add 5 changes" and the tally "5 ready to add"; the change is still last in the list, set back |
| 3 | Untick the other five | The action reads "Nothing ticked" and does nothing when pressed |
| 4 | Tick "Native trees and shrubs planted · 2025" | The action reads "Add 1 change" |
| 5 | Press Tab until keyboard focus is inside the next change | That change is marked |
| 6 | Press "Add 1 change" | The Deer Creek project page |
| 7 | Look at the Performance measures card | "Native trees and shrubs planted" reads 12,577; the other six figures are the "Before" column |

On the prototype: press "Sample crew log"; see `../fixtures.md`, On the prototype.

## Open questions

- Q-61 — R4: the names of the flagged states; the rule itself does not wait on it.
- Q-82 — S1 to S4, S6 and steps 1 to 3: the count of six.
- Q-88 — the Reset line, and how the recorded reading is served for the Preconditions.
- Q-110 — would change R3 and step 3: which part an unticked ready change is counted in, whether a ticked change the record already holds is counted twice, and what the tally reads when nothing is counted (after step 3 the prototype's line is empty).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | ACN-11; RUL-111 |
| R2 | shown | ACN-11 |
| R3 | shown | ACN-11; relies on story 04, RUL-104 |
| R4 | shown | RUL-10; RUL-113, RUL-114 |
| R5 | shown | STA-20 |
| R6 | shown | RUL-112 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (which changes count as ticked at 398-399; the tally at 725-746; the rule for what arrives ticked at 693-695 and 751-759; the checkbox at 836-845; the set-back look at 252-255); `src/components/projects/firma2-report-import-actions.astro` (the commit action's wording and its disabled state, 61-63).
- Data shapes, as the prototype models them: each proposed change carries the flags the rule reads (needs a decision, no match, unsure, and for a funding source an organization the workspace does not hold); whether the record already holds it is worked out on the check step, not carried by the reading.
- What the prototype does where nothing is decided (not requirements): the cases of Q-110; a flagged change ticked by hand keeps its badge and its message.
- Do not copy: the rule reads the record from browser-local stores; the struck "Check this" and "Unsure" badges (Q-25), which play no part in what arrives ticked.

</details>
