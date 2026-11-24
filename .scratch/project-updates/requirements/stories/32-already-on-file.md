# 32 — A Contributor sees an entry the record already holds as "Already on file"

Type: story
Epic: B — What a report can change
Release: first
Status: needs-info
Revision: 1
Blocked by: 01, 02, 06
Covers: STA-11, RUL-15, RUL-140, RUL-141
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; no spec decision (shown in the prototype only)
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n)

Can start: R1 to R5, on a check step where stories 01, 04 and 06 are built (the list, the tally and each change's checkbox are used here, not built here), and only against the recorded crew log reading in `../fixtures.md`, which stands in for enabler 02 (not built). Waiting: the parts marked "Not decided", each on the question named beside it; the count of six on Q-82.

## Story

As a Contributor, I want what the record already holds set aside before I check the changes, so that the same report read twice does not put its figures on the record twice.

## Description

The same report is often read more than once, and a report often repeats what the record holds. When the check step of Import a report opens, each proposed performance measure entry is compared with the project's record; one the record already holds is marked "Already on file" and arrives unticked. This story holds the state and the test for a performance measure entry. The other three kinds of change each say when they count as already on file in their own story (15, 17, 18), and a total to date with nothing left arrives in the same state (story 13). Split from story 13 on 2026-11-23. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, by reading the sample crew log a second time after adding it.

## Requirements

R1. Whether the record already holds a change is worked out from the record. It is never taken from what the reading says.

R2. A performance measure entry is already on file when the record holds an entry with the same measure, the same reporting period, the same amount and the same breakdown answers.
- The record's entries are all of them: recorded by hand or added by an import, published or not.
- The amount is compared as a number, exactly: 5.5 matches 5.50 and does not match 5.49.
- Every breakdown question the measure asks is compared. An answer matches the same answer only, and an unanswered question matches an unanswered one only.
- One matching entry is enough. The change's quote and note play no part.
- Not decided: two changes in one reading that are the same entry, which are both proposed and both ready (Q-99).

R3. A change already on file carries the badge "Already on file" and arrives unticked, so it is set back visually like any unticked change (story 06, R6). The rest of the change is shown as for a ready one: its fields, its quote and its note.

R4. A change already on file keeps its checkbox, and the person can tick it. The badge stays when it is ticked, and nothing else the person does on the check step removes it. Not decided: what adding a ticked change the record already holds does: save it again, refuse, warn or pass over it (Q-87).

R5. The comparison is made when the check step opens, from the values as read, and not again while the step stays open. So a change the person edits into a match is not marked, a marked change edited away from its match keeps the badge, and a record that changes meanwhile changes nothing here. Not decided: whether it is made again when "Add N changes" is pressed (Q-87, Q-48).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- When a Key facts value, a funding source or a contact counts as already on file — stories 15, 17 and 18.
- A total to date with nothing left — story 13.
- An entry the reading also flagged, and a change whose amount arrives empty — story 14, R8.
- The tally's count of changes already on file, and a ticked one counted in two parts — stories 04 (R2) and 06 (R3).
- A field kept by a data source whose value equals the record's — story 16.
- Editing a change — story 07. A ticked change with an empty amount — story 30.

## Needs to know from elsewhere

- The reading returns the proposed entries; nothing it says about the record is trusted — enabler 02, not built.
- A change arrives ticked only when the record does not already hold it; an unticked change is not added and is set back visually; with nothing ticked the commit action reads "Nothing ticked" and cannot be pressed — story 06 (R4, R5, R6).
- The tally counts a change already on file under "already on file", ticked or not, and leaves that part out when no change is — story 04, R2.
- "Add N changes" saves each added change as a new entry beside any the record holds; it replaces and merges nothing — story 01, R11.
- The record's entries, including those recorded by hand — owned by `performance-measures`.

## Scenarios

All run against the recorded crew log reading in `../fixtures.md`. No fixture shows S1 or S3; their data is described by kind.

**S1 — The reading's own claim is ignored** (proves R1)
- Given a reading that returns an entry the record does not hold and describes it as already recorded
- When the check step opens
- Then the change arrives ready, with no "Already on file" badge

**S2 — An entry the record holds** (proves R2)
- Given the crew log's six changes were added to Deer Creek
- When the crew log is read again
- Then each of C1 to C6 carries the badge "Already on file"

**S3 — One breakdown answer differs** (proves R2)
- Given Deer Creek's only 2025 entry for "Acres of riparian habitat restored" is one of 5.5 acres recorded by hand with "Riparian treatment" answered Natural recruitment
- When the crew log's reading comes back
- Then C1, which reads Planting, arrives ready, with no "Already on file" badge

**S4 — It arrives unticked** (proves R3)
- Given the crew log's six changes were added to Deer Creek
- When the crew log is read again
- Then all six changes are unticked and the commit action reads "Nothing ticked"

**S5 — It can still be ticked** (proves R4)
- Given the check step of S4
- When the Contributor ticks C2
- Then C2 is ticked, still carries the badge "Already on file", and the commit action reads "Add 1 change"

**S6 — The comparison is made when the check step opens** (proves R5)
- Given the crew log's check step is open on Deer Creek's starting state, with C2 ready and ticked
- When an entry of 1,850 plants for 2025 is recorded by hand for "Native trees and shrubs planted" in another window, and nothing is reloaded here
- Then C2 still shows ready and ticked

The editing half of R5 has no scenario here: editing a change is story 07, which this story is not blocked by. Its check is "change C2's amount on the check step of S4, and the badge stays", run once story 07 is built.

## UAT script

The script stops before "Add 1 change" is pressed: what adding a change the record already holds does is not decided (Q-87).

Preconditions: story 01's UAT script has been run to its step 9, so the crew log's six entries are on Deer Creek's record. Signed in as the same person. The recorded crew log reading is served for the crew log file.
Test data: `../fixtures.md`: the crew log, rows C1 to C6; Deer Creek's "After C1–C6" figures. The count of six waits on Q-82.
Reset: not known (Q-88). The script itself adds nothing.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and look at the Performance measures card | The seven figures of the "After C1–C6" column |
| 2 | Press "Import report", choose `deer-creek-crew-log-2025.xlsx`, press "Read it" and wait | Six changes, each with the badge "Already on file" and each unticked; the tally reads "6 already on file" |
| 3 | Look at the page's action | "Nothing ticked", and it cannot be pressed |
| 4 | Tick "Native trees and shrubs planted · 2025" | The change is ticked and keeps its badge; the action reads "Add 1 change" |
| 5 | Untick it | The action reads "Nothing ticked" again |
| 6 | Go back to the project page by the breadcrumb | The figures are still those of step 1 |

On the prototype: press "Sample crew log" in place of choosing the file; see `../fixtures.md`, On the prototype.

## Open questions

- Q-87 — R4, R5 and where the script stops: what adding a ticked "Already on file" change does, and whether the comparison is made again on the press. An answer adds a scenario and a step.
- Q-48 — R5 and S6: whether the person is told when the record changed while the check step was open.
- Q-82 — S2, S4 and step 2: the count of six.
- Q-88 — the Reset line, and how the recorded reading is served.
- Q-99 — would change R2: whether the second of two identical entries in one reading is proposed, flagged or folded into the first.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | RUL-15 |
| R2 | shown | RUL-15; RUL-140 |
| R3 | shown | STA-11; relies on story 06, RUL-10 |
| R4 | shown | STA-11; RUL-141 |
| R5 | shown | RUL-15 |

- RUL-15 was split on 2026-11-23. The test for a Key facts value, a funding source and a contact is RUL-79, RUL-80 and RUL-81, covered by stories 15 (R8), 17 (R7) and 18 (R7), because their scenarios need those stories' changes.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the comparison with the record at 594-601; where each kind of change is resolved, once, when the check step is drawn, 652-691 and 912-915; the badge at 771; the checkbox at 836-845).
- Data shapes, as the prototype models them: "Already on file" is a state the page works out from the record for each proposed change. It is not a field of the reading.
- What the prototype does where nothing is decided (not requirements): a ticked "Already on file" entry is saved again on Add, as a second identical entry, because Add does not look at the record (Q-87).
- Do not copy: the record read from browser-local stores; the scripted readings; the comparison running in the browser. The prototype tests an entry against entries added in that browser only, not against its seeded figures, so a sample entry is "Already on file" only after it was added once there. It also compares the breakdown answers as written out in order, so the same answers held in another order would not match.

</details>
