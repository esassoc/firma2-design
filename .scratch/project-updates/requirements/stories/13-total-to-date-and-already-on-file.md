# 13 — A Contributor sees a total to date filed as the difference from the record

Type: story
Epic: B — What a report can change
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-33, Q-48, Q-82, Q-91, Q-99, Q-118, Q-120, Q-121
Revision: 1
Blocked by: 01, 02, 32, 14
Covers: STA-18, RUL-14, RUL-135, RUL-136, RUL-137, RUL-138, RUL-139, RUL-296, RUL-297, RUL-298, RUL-299
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; no spec decision (shown in the prototype; completed by the proposals named above)
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n)

Can start: R1 to R9, on a check step where stories 01, 07, 32 and 14 are built (the amount field, "Already on file", the check at the press and the flagged state are used here, not built here), against the recorded sample `deer-creek-total-to-date-2025.pdf`, which stands in for enabler 02 until it is built. R8 and R9, and parts of R1, R2 and R6, have no sample and are built against data described by kind. Built here, not showable until a later story: that a figure typed over a total is recorded as changed (enabler 36). Waiting on a feature that is not built: nothing.

## Story

As a Contributor, I want a report's running total turned into what is new since the record was last brought up to date, so that what goes on the record is what the report says and reading the same report twice adds nothing.

## Description

Reports often restate a total to date instead of one period's amount. On the check step of Import a report, such a figure is compared with the project's record before the person sees it: the change proposes the difference and shows the arithmetic; when nothing is left it is "Already on file"; when the record already holds more than the report's total, the two disagree and the change is flagged for the person. The subtraction is done by code, exactly, and is done again when "Add N changes" is pressed. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report's row F6; the flag on a lower total, the check at the press and the cases of R8 and R9 are not in the prototype.

## Requirements

R1. When the reading says a figure for a performance measure is a total to date, and the measure is one whose values add up, the change's amount is that total minus what the record holds for the measure (R2). The difference is exact: nothing is rounded. In every other way it is a performance measure change: it is filed under the reporting period the reading gives, arrives ticked, and is saved as one entry of the difference. A total to date stated in another unit than the measure's is not subtracted: it arrives flagged and empty, as story 14, R9 has it.

R2. What the record holds is the sum of the measure's entries filed under reporting periods up to and including the change's own: recorded by hand or added by an import, published or not, with every breakdown answer. Entries filed under a later period are not counted. For a measure whose values do not add up, no difference is worked out: the figure is proposed as it stands, as that period's entry, with no arithmetic line.

R3. A change filed as a difference shows its arithmetic under the quote: "`<total>` to date − `<on record>` on record = `<difference>`", as in "12,400 to date − 10,727 on record = 1,673". When the record also holds entries under later periods, the line says which period it counted through: "`<total>` to date − `<on record>` on record through `<period>` = `<difference>`". The figures are written with thousands separators and as they are, unrounded. The line has no label in front of it.

R4. When the total to date equals what the record holds, nothing is left to add: the change is "Already on file", its amount is empty and its arithmetic ends "= 0". So a report whose total was added proposes nothing for that measure when it is read again. Like any entry already on file it keeps its checkbox (story 32, R4); ticked as it stands, it has no amount and stops the import (story 30, R2). A figure above zero typed into it ticks it, as story 14, R6 has it for any change that arrived empty.

R5. A total to date lower than what the record holds is a disagreement between the report and the record, not "Already on file". The change is flagged as story 14 has it: unticked, "Needs you", its amount empty, with a sentence stating both figures ("The report says 12,400 to date. The record holds 12,577."). It shows no arithmetic line.

R6. A total to date whose figure the reading could not settle (story 14, R2 to R4 and R9) arrives flagged with its amount empty and that story's sentence. No difference is worked out and no arithmetic line is shown.

R7. The difference is worked out when the check step opens, and again when "Add N changes" is pressed, against the reporting period the change then holds.
- At the press, a ticked change whose amount is still the difference it arrived with, and whose difference is now another figure, stops the import once, as story 32, R5 and R6 have it: nothing is added, the change takes its new amount and line (or becomes "Already on file" by R4, or flagged by R5), and the person presses again.
- A figure the person typed is theirs: it is added as typed. The arithmetic line stays the document's arithmetic and gains what the person entered: "… = 1,673. You entered 1,500." It loses that addition when the amount is set back to the difference, or cleared.

R8. When one reading holds a period's amount and a total to date for the same measure, the period's amount is the change, whether or not it stays ticked. The total is then worked out against the record (R2) plus that amount.
- Nothing left: the total is not a second change. The period's change gains the line "Agrees with the report's total to date: `<total>`".
- Something left over, or the record plus the period's amount is more than the total: the total is listed as a second change, flagged, unticked, its amount empty, with a sentence stating the three figures ("The report says 12,400 to date. The record holds 10,727 and this report adds 1,850."). It shows no arithmetic line.

R9. Two totals to date for one measure in one reading: the same total twice is one change, from the first place, with "Also stated: `<the other place>`", because a total cannot be separate work. Two different totals are both listed flagged, unticked, with empty amounts, each with "The report also gives `<the other total>`."

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- What the record already holds for a change that is not a total to date, the "Already on file" state itself, and the same entry twice in one reading — story 32.
- The tally — story 04, R2. Ticking a change, and "Nothing ticked" — story 06.
- The amount field, and editing the amount of a change filed as a difference — story 07. Recording that it was edited — enabler 36.
- The "Needs you" badge and how a flagged change is filled — story 14.
- Converting a total to date stated in another unit — enabler 26 (`later`).

## Needs to know from elsewhere

- The reading says which figures are totals to date and gives each total as the document states it. The subtraction is done by code, never by the model — enabler 02.
- A change that is "Already on file" arrives unticked with that badge; an entry keeps its checkbox; the comparison with the record is made again at the press, and a press that no longer stands stops once with a message — story 32 (R3 to R6).
- A flagged change arrives unticked with the one badge "Needs you"; a figure typed into an empty amount ticks it; clearing it unticks it — story 14 (R5, R6).
- The amount field shows thousands separators: "1,673" — story 07, R1.
- A typed figure that replaces the document's arithmetic is recorded as changed from the document's figure, not as filled in — enabler 36, R5.
- Whether a measure's values add up, and its total as the sum of its entries; all seven Deer Creek measures add up — owned by `performance-measures`.
- A change filed as a difference is listed, added and saved as story 01 says (R8, R10, R11).

## Scenarios

S1 to S3, S6 to S8 and S11 run against the recorded sample "total to date" in `../fixtures.md` (rows F3 and F6). No sample holds the data of S4, S5, S9, S10 and S12 to S14; they describe it by kind.

**S1 — The amount is the difference** (proves R1)
- Given Deer Creek's record holds 10,727 for "Native trees and shrubs planted" (the "Before" column)
- When the total to date sample's reading comes back
- Then F6, "Native trees and shrubs planted · 2025", is ticked and its amount holds 1,673

**S2 — The arithmetic is shown** (proves R3)
- Given the same record
- When the total to date sample's reading comes back
- Then F6 shows "12,400 to date − 10,727 on record = 1,673" under its quote

**S3 — Unpublished entries count as on the record** (proves R2)
- Given a Contributor recorded by hand, and did not publish, an entry of 1,000 plants for 2024, so the measure stands at 11,727
- When the total to date sample's reading comes back
- Then F6's amount holds 673 and its arithmetic reads "12,400 to date − 11,727 on record = 673"

**S4 — Later entries are not counted** (proves R2, R3)
- Given a reading that returns a total to date filed under a reporting period, on a project whose record also holds entries for that measure under a later period
- When the check step opens
- Then the amount is the total minus the entries filed up to and including that period, and the line reads "… on record through `<period>` = `<difference>`"

**S5 — A measure whose values do not add up** (proves R2)
- Given a reading that returns a total to date for a measure whose values do not add up
- When the check step opens
- Then the change's amount is the figure as the report states it, and it shows no arithmetic line

**S6 — Nothing left** (proves R4)
- Given the total to date sample's two changes were added to the starting state, so the record holds 12,400 for the measure
- When the sample is read again
- Then F6 is "Already on file" and unticked, its amount is empty, and it shows "12,400 to date − 12,400 on record = 0"

**S7 — A figure typed where nothing was left** (proves R4, R7)
- Given the check step of S6
- When the Contributor types 100 into F6's amount
- Then F6 is ticked and its line reads "12,400 to date − 12,400 on record = 0. You entered 100."

**S8 — A total lower than the record's** (proves R5)
- Given the crew log's six changes were added to Deer Creek, so the measure stands at 12,577 (the "After C1–C6" column)
- When the total to date sample's reading comes back
- Then F6 is unticked with "Needs you", its amount is empty, it reads "The report says 12,400 to date. The record holds 12,577.", it shows no arithmetic line, and the tally reads "1 ready to add · 1 needs you"

**S9 — A total to date the reading could not settle** (proves R6)
- Given a reading that returns a total to date for a measure and says the figure is not settled, with its reason
- When the check step opens
- Then the change's amount is empty and it shows the reason, with no arithmetic line

**S10 — A total to date in another unit** (proves R1)
- Given a reading that returns, for a measure recorded in miles, a total to date the report states in feet
- When the check step opens
- Then the change is flagged with an empty amount and the sentence of story 14, R9, and no difference is shown

**S11 — Worked out again at the press** (proves R7)
- Given the check step shows F6 ticked with 1,673, and an entry of 1,000 plants for 2024 has since been recorded by hand in another window
- When the Contributor presses "Add 2 changes"
- Then nothing is added, F6's amount holds 673, its line reads "12,400 to date − 11,727 on record = 673", and pressing "Add 2 changes" again adds both changes, leaving the measure at 12,400

**S12 — A period's amount that agrees with the total** (proves R8)
- Given a reading that returns, for one measure, a period's amount and a total to date, and the record plus that amount equals the total
- When the check step opens
- Then one change is listed for the measure, the period's, and it shows "Agrees with the report's total to date: `<total>`"

**S13 — A period's amount that does not agree with the total** (proves R8)
- Given the same kind of reading, where the record plus the period's amount is less than the total
- When the check step opens
- Then the period's amount is listed ready, and the total is a second change, unticked with "Needs you" and an empty amount, with a sentence stating the total, what the record holds and what this report adds

**S14 — Two different totals for one measure** (proves R9)
- Given a reading that returns two totals to date for one measure, with different figures
- When the check step opens
- Then both are listed unticked with empty amounts, each reading "The report also gives `<the other total>`."

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Deer Creek is in its starting state. The test environment serves the recorded samples `deer-creek-total-to-date-2025.pdf` and `deer-creek-crew-log-2025.xlsx`. Stories 01, 04, 06, 07, 14 and 32 are built.
Test data: `../fixtures.md`: the total to date sample, rows F3 and F6; the crew log, for steps 10 to 12; Deer Creek's "Before" and "After C1–C6" figures. No sample holds a period's amount beside a total to date, or two totals.
Reset: reset the sample project in the test environment. Steps 10 to 12 start from a reset.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and note the figure for "Native trees and shrubs planted" on the Performance measures card | 10,727 |
| 2 | Press "Import a report", choose `deer-creek-total-to-date-2025.pdf`, press "Read it" and wait | The check step, with two changes; the tally reads "2 ready to add"; the action reads "Add 2 changes" |
| 3 | Find "Native trees and shrubs planted · 2025" | Ticked; the amount 1,673; under the quote, "12,400 to date − 10,727 on record = 1,673" |
| 4 | Press "Add 2 changes" and look at the Performance measures card | The Deer Creek project page, with the toast "2 changes added from deer-creek-total-to-date-2025.pdf"; "Native trees and shrubs planted" reads 12,400 |
| 5 | Press "Import a report" again, choose the same file, press "Read it" and wait | The check step; the tally reads "2 already on file"; the action reads "Nothing ticked" |
| 6 | Find "Native trees and shrubs planted · 2025" | The badge "Already on file", unticked, an empty amount, and "12,400 to date − 12,400 on record = 0" |
| 7 | Type 100 into its amount | The change ticks itself; its line ends "= 0. You entered 100."; the action reads "Add 1 change" |
| 8 | Clear the amount | The change is unticked; its line ends "= 0" again; the action reads "Nothing ticked" |
| 9 | Go back to the project page by the breadcrumb | "Native trees and shrubs planted" still reads 12,400 |
| 10 | Reset the sample project. Import `deer-creek-crew-log-2025.xlsx` and press "Add 6 changes" | The project page; "Native trees and shrubs planted" reads 12,577 |
| 11 | Press "Import a report", choose `deer-creek-total-to-date-2025.pdf`, press "Read it" and wait | The tally reads "1 ready to add · 1 needs you" |
| 12 | Find "Native trees and shrubs planted · 2025" | Unticked, the badge "Needs you", an empty amount, "The report says 12,400 to date. The record holds 12,577.", and no arithmetic line |

On the prototype: see `../fixtures.md`, On the prototype. Steps 7, 8, 11 and 12 differ there.

## Open questions

None open. The story rests on these proposed answers:

- Q-118 (proposed) — R1, R3: nothing is rounded.
- Q-120 (proposed) — R2, R3: only a measure whose values add up; only entries up to the change's period; "on record through `<period>`".
- Q-91 (proposed) — R5: a lower total is flagged, not "Already on file".
- Q-33 (proposed) — R6: a total the reading could not settle arrives empty.
- Q-82 (proposed) — R1: a total in another unit is flagged and empty.
- Q-121 (proposed) — R4, R7: a typed figure ticks a change with nothing left; "You entered `<figure>`."
- Q-48 (proposed) — R7: the difference is worked out again at the press.
- Q-99 (proposed) — R8, R9: a period's amount beside a total to date; two totals.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; proposed (Q-118, Q-82) | RUL-14, STA-18; RUL-135 |
| R2 | shown; proposed (Q-120) | RUL-14; RUL-296 |
| R3 | shown; proposed (Q-120, Q-118) | STA-18; RUL-136 |
| R4 | shown; proposed (Q-121) | RUL-14, STA-18; relies on story 32, STA-11; relies on story 14, ACN-13 |
| R5 | proposed (Q-91) | RUL-14 (reworded: a lower total is flagged), STA-18; RUL-297 |
| R6 | proposed (Q-33) | RUL-137, RUL-138 (reworded: no reading is written in); relies on story 14, STA-12 to STA-14 |
| R7 | proposed (Q-48, Q-121) | RUL-139 (reworded: worked out again at the press); RUL-298 |
| R8 | proposed (Q-99) | RUL-299 |
| R9 | proposed (Q-99) | RUL-299 |
- Wording provisional: "… on record through `<period>`" and "You entered `<figure>`." are the proposals' own examples; the sentence of R9 is the wording shared across the stories.
- Not yet prototyped: R2's two limits, R5's flag, R7's check at the press and "You entered", R8 and R9.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the record's total at 607-612; the difference, the "= 0" case and the line at 674-683, where an unsettled change returns before any subtraction; the line drawn with no label at 822); `scripts/report-reader.mjs` (a figure that counts another quantity is never passed on as a total to date, 409-415); `src/data/firma2-report-import.ts` (the "stated as a total to date" flag, and the sample that carries it).
- Data shapes, as the prototype models them: a proposed measure entry carries the total to date as a number. The page reads the measure's total from the record, subtracts, and keeps the arithmetic as one line of text on the change.
- Do not copy: rounding the difference to two decimals; the whole total of every period as "on record"; a lower total drawn as "Already on file" with a subtraction that does not equal 0; the arithmetic line never changing after the check step opens; the record read from browser-local stores; the scripted readings; the subtraction running in the browser; the "Check this" badge on F6 (struck, Q-25).

</details>
