# 32 — A Contributor sees an entry the record already holds as "Already on file"

Type: story
Epic: B — What a report can change
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-48, Q-87, Q-99, Q-110, Q-168, Q-169
Revision: 1
Blocked by: 01, 02, 06
Covers: STA-11, RUL-15, RUL-140, RUL-141, RUL-394, RUL-395, RUL-396, RUL-397
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; no spec decision (shown in the prototype; completed by the proposals named above)
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n)

Can start: R1 to R7, on a check step where stories 01, 04 and 06 are built (the list, the tally and each change's checkbox are used here, not built here), against the recorded sample `deer-creek-crew-log-2025.xlsx`, which stands in for enabler 02 until it is built. Built here, not showable until a later story: the "Needs you" badge on a repeat (story 14, R5); the comparison after an edit, in R5 (story 07); the same check at the press for the other kinds of change (stories 13, 15, 16, 17, 18). Waiting on a feature that is not built: nothing.

## Story

As a Contributor, I want what the record already holds set aside before I check the changes, so that the same report read twice does not put its figures on the record twice.

## Description

The same report is often read more than once, and a report often repeats itself or what the record holds. On the check step of Import a report each proposed performance measure entry is compared with the project's record and with the entries before it in the same reading. One the record already holds is marked "Already on file" and arrives unticked; one the same reading already stated arrives unticked with a sentence that says so. The comparison with the record is made again when "Add N changes" is pressed, so two people importing one report cannot both add it. This story holds the state and the tests for a performance measure entry. The other kinds of change say when they are already on file in their own stories (15, 17, 18), and a total to date with nothing left arrives in the same state (story 13). See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, by reading the sample crew log a second time after adding it; the check at the press and the repeat inside one reading are not in the prototype.

## Requirements

R1. Whether the record already holds a change is worked out from the record, in code. It is never taken from what the reading says.

R2. Two performance measure entries are the same thing when they have the same measure, the same reporting period and the same breakdown answers. An entry is already on file when the record holds an entry that is the same thing with the same amount.
- The record's entries are all of them: recorded by hand or added by an import, published or not.
- The amount is compared as a number, exactly: 5.5 matches 5.50 and does not match 5.49.
- Every breakdown question the measure asks is compared. An answer matches the same answer only, and an unanswered question matches an unanswered one only.
- One matching entry is enough. The change's quote and note play no part.

R3. A change already on file carries the badge "Already on file" and arrives unticked, so it is set back visually like any unticked change (story 06, R6). The rest of the change is shown as for a ready one: its fields, its quote and its note.

R4. An entry already on file keeps its checkbox, and the person can tick it. The badge stays when it is ticked. A ticked one is added as a new entry beside the one the record holds, because two equal entries can both be true; reading the same report twice therefore adds nothing unless the person ticks something. The tally counts it once: under "ready to add" while ticked, otherwise under "already on file" (story 04, R2).

R5. The comparison with the record is made when the check step opens, again whenever the person edits a change's amount, reporting period or breakdown answers, and again when "Add N changes" is pressed.
- After an edit, a change edited into a match gains the badge and one edited away from its match loses it. An edit never ticks or unticks a change for this reason.
- At the press, a ticked change that does not carry the badge and that the record now holds stops the import once: nothing is added, not even the other ticked changes; the change is unticked and marked "Already on file"; the count on the action and the tally follow. The person presses again, and what is then added is what the action counts. They may first tick the marked change again on purpose (R4).
- A ticked change that already carried the badge at the press is not stopped: the person chose it (R4).
- The same check is made at the press for every kind of change, each by its own test (stories 13, 15, 16, 17 and 18 state theirs and cite this rule).

R6. When the press is stopped by R5, one message beside the commit action says that the record changed since the report was read, that nothing was added, and that the changes now marked should be checked before pressing again. The first change that was re-marked is brought into view. The message is announced once and goes at the next press or when the person ticks or unticks a change.

R7. A reading that states the same thing twice does not arrive as two ready changes. Code compares each entry with the entries before it in the reading.
- The same thing with the same amount: the first is ready; the later one is listed in its place, unticked, its amount as read, with the sentence "Also stated at `<place of the first>`. Tick it only if it is separate work." under its quote. The tally counts it under "need you". Ticked, it is added as a second entry.
- The same thing with different amounts: each is listed unticked, its amount as read, with the sentence "The report also gives `<the other amount>`." The tally counts each under "need you". The person may tick either or both.
- When the record already holds the entry (R2), "Already on file" wins on each of them: that badge, no "Needs you" badge, counted under "already on file". The later one still shows its "Also stated at …" sentence.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- When a Key facts value, a funding source or a contact counts as already on file, and their repeats inside one reading — stories 15, 17, 18 and 86.
- A total to date with nothing left, and a total to date beside one period's amount for the same measure — story 13.
- The "Needs you" badge a repeat carries, and a change whose amount arrives empty — story 14.
- The tally's parts — stories 04 (R2) and 06 (R3).
- A field kept by a data source whose value equals the record's — story 16.
- Editing a change — story 07. A ticked change with an empty or invalid amount — story 30.
- A save that fails after every check has passed — story 22, R1.

## Needs to know from elsewhere

- The reading returns the proposed entries; nothing it says about the record is trusted. The reading service is asked to return a restated figure once and to add the separate lines of one table together, so R7 is the net under it, not the usual path — enabler 02.
- A change arrives ticked only when the record does not already hold it and nothing else leaves it waiting; an unticked change is not added and is set back visually; with nothing ticked the commit action reads "Nothing ticked" while something could be ticked — story 06 (R4, R5, R6).
- The tally counts every change in exactly one part; "need you" holds every change that arrived unticked and waits on the person — story 04, R2.
- "Add N changes" saves each added change as a new entry beside any the record holds, all or nothing; it replaces and merges nothing — story 01, R11, and story 22, R1.
- Two imports, or an import and a hand edit, made at the same time: the last save stands and nobody is notified. R5's check at the press is what keeps the record right — this story.
- The record's entries, including those recorded by hand — owned by `performance-measures`.

## Scenarios

S2, S4 to S9 run against the recorded sample crew log in `../fixtures.md`. No sample holds the data of S1, S3 and S10 to S12; they describe it by kind.

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
- Then all six changes are unticked, the tally reads "6 already on file" and the commit action reads "Nothing ticked"

**S5 — It can still be ticked** (proves R4)
- Given the check step of S4
- When the Contributor ticks C2
- Then C2 is ticked and still carries the badge, the tally reads "1 ready to add · 5 already on file", and the commit action reads "Add 1 change"

**S6 — A ticked one is added again** (proves R4)
- Given the check step of S5, and "Native trees and shrubs planted" stands at 12,577
- When the Contributor presses "Add 1 change"
- Then the project page opens with the toast "1 change added from deer-creek-crew-log-2025.xlsx", and "Native trees and shrubs planted" reads 14,427

**S7 — The record changed while the check step was open** (proves R5)
- Given the crew log's check step is open on Deer Creek's starting state with six ticked changes, and in another window the same person has since read the crew log and added its six changes
- When the Contributor presses "Add 6 changes" in the first window
- Then nothing is added, they are still on the check step, all six changes are unticked and carry "Already on file", the tally reads "6 already on file" and the action reads "Nothing ticked"

**S8 — The person is told why** (proves R6)
- Given the press of S7
- When the check step is shown again
- Then a message beside the commit action says the record changed since the report was read and nothing was added, and C1 is in view

**S9 — Pressing again adds what the action counts** (proves R5)
- Given the check step is open with six ticked changes, and an entry of 1,850 plants for 2025 has since been recorded by hand for "Native trees and shrubs planted", so the first press left C2 unticked and marked and the action reading "Add 5 changes"
- When the Contributor presses "Add 5 changes"
- Then the project page opens with the toast "5 changes added from deer-creek-crew-log-2025.xlsx", and "Native trees and shrubs planted" reads 12,577

**S10 — The same entry twice in one reading** (proves R7)
- Given a reading that returns two entries for one measure and reporting period with the same amount and breakdown answers, read from two places in the document, on a project whose record holds neither
- When the check step opens
- Then the first is ready and ticked; the second is unticked, holds its amount, and reads "Also stated at `<place of the first>`. Tick it only if it is separate work."; the tally counts one under "ready to add" and one under "need you"

**S11 — The same thing with two amounts** (proves R7)
- Given a reading that returns two entries for one measure and reporting period with the same breakdown answers and different amounts
- When the check step opens
- Then both are unticked with their amounts as read, each reads "The report also gives `<the other amount>`.", and the tally counts two under "need you"

**S12 — A repeat the record already holds** (proves R7)
- Given the reading of S10, on a project whose record already holds that entry
- When the check step opens
- Then both changes carry "Already on file", neither is counted under "need you", and the second still reads "Also stated at `<place of the first>`. Tick it only if it is separate work."

The comparison after an edit (R5) has no scenario here: editing a change is story 07, which this story is not blocked by. Its check is "on the check step of S4, change C2's amount and the badge goes; set it back to 1,850 and the badge returns", run once story 07 is built.

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person), with two browser windows open. Deer Creek is in its starting state. The test environment serves the recorded sample `deer-creek-crew-log-2025.xlsx`. Stories 01, 04 and 06 are built.
Test data: `../fixtures.md`: the crew log, rows C1 to C6; Deer Creek's "Before" and "After C1–C6" figures.
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | In the first window, open the Deer Creek project page, press "Import a report", choose `deer-creek-crew-log-2025.xlsx`, press "Read it" and wait | Six ticked changes; the tally reads "6 ready to add"; the action reads "Add 6 changes" |
| 2 | In the second window, do the same, then press "Add 6 changes" | The Deer Creek project page, the toast "6 changes added from deer-creek-crew-log-2025.xlsx", and the seven figures of the "After C1–C6" column |
| 3 | Back in the first window, press "Add 6 changes" | You are still on the check step. A message says the record changed and nothing was added. All six changes are unticked with the badge "Already on file"; the tally reads "6 already on file"; the action reads "Nothing ticked" and cannot be pressed |
| 4 | In the second window, reload the project page | The figures are still those of the "After C1–C6" column: nothing was added twice |
| 5 | In the first window, tick "Native trees and shrubs planted · 2025" | The change is ticked and keeps its badge; the tally reads "1 ready to add · 5 already on file"; the action reads "Add 1 change" |
| 6 | Untick it, then tick it again | "Nothing ticked", then "Add 1 change" again |
| 7 | Press "Add 1 change" | The project page, with the toast "1 change added from deer-creek-crew-log-2025.xlsx"; "Native trees and shrubs planted" reads 14,427 |

On the prototype: see `../fixtures.md`, On the prototype. Steps 3 and 7 differ there: it does not look at the record when the action is pressed.

## Open questions

None open. The story rests on these proposed answers:

- Q-87 (proposed) — R4 and R5: a ticked "Already on file" entry is added; the comparison is made again at the press and stops the import once. If the user disagrees, S6 to S9 and steps 3 and 7 change.
- Q-48 (proposed) — R5: the last save stands and the check at the press is the only guard; no notice to the other person.
- Q-99 (proposed) — R2's "the same thing" and all of R7: a repeat inside one reading is listed, unticked, with its amount kept.
- Q-110 (proposed) — R4 and R7: which part of the tally counts an "Already on file" entry and a repeat.
- Q-168 (proposed) — R6: what tells the person why a press added nothing.
- Q-169 (proposed) — R7, last part: which state wins when a repeat is also on the record.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | RUL-15 |
| R2 | shown; proposed (Q-99) | RUL-15; RUL-140 |
| R3 | shown | STA-11; relies on story 06, RUL-10 |
| R4 | shown; proposed (Q-87, Q-110) | STA-11; RUL-141; RUL-394 |
| R5 | proposed (Q-87, Q-48, Q-99) | RUL-15 (reworded: no longer "once, when the check step opens"); RUL-395 |
| R6 | proposed (Q-168) | RUL-396 |
| R7 | proposed (Q-99; Q-169 for the last part) | RUL-397 |
- Wording provisional: the message of R6 has no fixed words yet. The two sentences of R7 are the wording shared across the stories.
- RUL-15 was split on 2026-11-23. The test for a Key facts value, a funding source and a contact is RUL-79, RUL-80 and RUL-81, covered by stories 15 (R8), 17 (R7) and 18 (R7), because their scenarios need those stories' changes.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the comparison with the record at 594-601; where each kind of change is resolved, once, when the check step is drawn, 652-691 and 912-915; the badge at 771; the checkbox at 836-845).
- Data shapes, as the prototype models them: "Already on file" is a state the page works out from the record for each proposed change. It is not a field of the reading.
- Not yet prototyped: the comparison after an edit and at the press (R5), the message (R6), and every part of R7. The prototype compares once, when the check step opens, and its Add does not look at the record.
- Do not copy: the record read from browser-local stores; the scripted readings; the comparison running in the browser. The prototype tests an entry against entries added in that browser only, not against its seeded figures, so a sample entry is "Already on file" only after it was added once there. It also compares the breakdown answers as written out in order, so the same answers held in another order would not match.

</details>
