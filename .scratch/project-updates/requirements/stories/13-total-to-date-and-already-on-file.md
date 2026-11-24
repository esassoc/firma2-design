# 13 — A Contributor sees a total to date filed as the difference from the record

Type: story
Epic: B — What a report can change
Release: first
Status: needs-info
Revision: 1
Blocked by: 01, 02, 32, 14
Covers: STA-18, RUL-14, RUL-135, RUL-136, RUL-137, RUL-138, RUL-139
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; no spec decision (shown in the prototype only)
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n)

Can start: R1 to R7, on a check step where stories 01, 07, 32 and 14 are built (the amount field, "Already on file" and the flagged states are used here, not built here), and only against the recorded funder report reading in `../fixtures.md`, which stands in for enabler 02 (not built). Waiting: the parts marked "Not decided" or "open", each on the question named beside it; the count "Add 7 changes" in the UAT script on Q-82.

## Story

As a Contributor, I want a report's running total turned into what is new since the record was last brought up to date, so that what goes on the record is what the report says and reading the same report twice adds nothing.

## Description

Reports often restate a total to date instead of one period's amount. On the check step of Import a report, such a figure is compared with the project's record before the person sees it: the change proposes the difference and shows the arithmetic, or, when nothing is left, it is "Already on file". The file slug is older than the split of 2026-11-23: what the record already holds for every other change is story 32, and this story is the total to date alone. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report.

## Requirements

R1. When the reading says a figure for a performance measure is a total to date, the change's amount is that total minus what the record holds for the measure (R2), rounded to two decimals. In every other way it is a performance measure change: it is filed under the reporting period the reading gives, arrives ticked, and is saved as one entry of the difference. (open: Q-82) Not decided: two changes for one measure in one reading, such as one period's amount and a total to date, which are each worked out against the record alone (Q-99).

R2. What the record holds is the measure's whole total: every entry, recorded by hand or added by an import, published or not, in every reporting period and with every breakdown answer. Not decided: a measure whose values do not add up, and entries filed under a period later than the report covers (Q-120).

R3. A change filed as a difference shows its arithmetic under the quote: "`<total>` to date − `<on record>` on record = `<difference>`", as in "12,400 to date − 10,727 on record = 1,673". The three figures are written with thousands separators and at most two decimals. The line has no label in front of it.

R4. When the total to date equals what the record holds, nothing is left to add: the change is "Already on file", its amount is empty and its arithmetic ends "= 0". So a report whose total was added proposes nothing for that measure when it is read again. Like any change already on file it keeps its checkbox (story 32, R4); ticked as it stands, it has no amount and stops the import (story 30, R2). Not decided: a figure typed into it (Q-121).

R5. A total to date lower than what the record holds is treated as nothing left, as in R4. Not decided: whether that is right, since the report and the record then disagree (Q-91).

R6. A total to date that the reading also flagged (story 14):
- When the report supports two readings, the amount is the difference for the reading written in, and the change stays flagged and unticked. With nothing left it is "Already on file" instead, as in R4. (open: Q-33)
- When the amount arrives empty, because the reading is unsure or the report counts another quantity, no difference is worked out and no arithmetic line is shown.

R7. The difference is worked out once, when the check step opens. It is not worked out again when the record changes meanwhile, when the person edits the change, or when "Add N changes" is pressed (open: Q-48). Not decided: what the arithmetic line says once the person has changed the amount (Q-121).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- What the record already holds for a change that is not a total to date, and the "Already on file" state itself — story 32.
- The tally's count of changes already on file — story 04, R2.
- Ticking a change, and "Nothing ticked" — story 06.
- The amount field, and editing the amount of a change filed as a difference — story 07. Recording that it was edited — story 36.
- A total to date stated in another unit than the measure's — story 26 (`later`).

## Needs to know from elsewhere

- The reading says which figures are totals to date and gives each total as the document states it. The subtraction is done by code, never by the model — enabler 02, not built.
- A change that is "Already on file" arrives unticked, with that badge, and is not added unless the person ticks it — story 32.
- The three flagged cases, what each shows, and that a flagged change arrives unticked — story 14 (R2 to R4).
- The amount field holds digits alone, 1673, with no separators — story 07, R1.
- A measure's total on the record is the sum of its entries, for a measure whose values add up; all seven Deer Creek measures are such — owned by `performance-measures`.
- A change filed as a difference is listed, added and saved as story 01 says (R8, R10, R11).

## Scenarios

S1 to S5 and S8 run against the recorded funder report reading in `../fixtures.md`. Only row F6 is used; the reading's other rows belong to other stories. No recording holds the data of S6 and S7, so they describe it by kind.

**S1 — The amount is the difference** (proves R1)
- Given Deer Creek's record holds 10,727 for "Native trees and shrubs planted" (the fixture's "Before" column)
- When the funder report's reading comes back
- Then F6, "Native trees and shrubs planted · 2025", is ticked and its amount holds 1673

**S2 — The arithmetic is shown** (proves R3)
- Given the same record
- When the funder report's reading comes back
- Then F6 shows "12,400 to date − 10,727 on record = 1,673" under its quote

**S3 — Unpublished entries count as on the record** (proves R2)
- Given a Contributor recorded by hand, and did not publish, an entry of 1,000 plants for 2024, so the measure stands at 11,727
- When the funder report's reading comes back
- Then F6's amount holds 673 and its arithmetic reads "12,400 to date − 11,727 on record = 673"

**S4 — Nothing left** (proves R4)
- Given F6's entry of 1,673 was added to the starting state, so the record holds 12,400 for the measure
- When the funder report is read again
- Then F6 is "Already on file" and unticked, its amount is empty, and it shows "12,400 to date − 12,400 on record = 0"

**S5 — A total lower than the record's** (proves R5)
- Given the crew log's six changes were added to Deer Creek, so the measure stands at 12,577 (the "After C1–C6" column)
- When the funder report's reading comes back
- Then F6 is "Already on file", its amount is empty, and its arithmetic ends "= 0"

**S6 — A total to date the report supports two readings of** (proves R6)
- Given a reading that returns a total to date of 12,400 for the same measure, flagged as supporting two readings, and the record holds 10,727
- When the check step opens
- Then the change is unticked and flagged as story 14 shows it, its amount holds 1673, and it shows the arithmetic line

**S7 — A total to date the reading is unsure of** (proves R6)
- Given a reading that returns a total to date for a measure and says it is unsure of the figure
- When the check step opens
- Then the change's amount is empty and it shows the reason, with no arithmetic line

**S8 — Not worked out again** (proves R7)
- Given the check step shows F6 with 1673 and its arithmetic line
- When the Contributor picks 2024 as F6's reporting period
- Then the amount still holds 1673 and the line still reads "12,400 to date − 10,727 on record = 1,673"

## UAT script

Steps 4 to 6 add the funder report's seven ready changes, which needs stories 06, 15, 17 and 18 built as well. Without them, stop after step 3.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Nothing has been imported to Deer Creek. The recorded funder report reading is served for the funder report file.
Test data: `../fixtures.md`: the funder report, row F6; Deer Creek's "Before" figure for "Native trees and shrubs planted". The count of seven waits on Q-82. No fixture has a total to date that is also flagged.
Reset: not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and note the figure for "Native trees and shrubs planted" on the Performance measures card | 10,727 |
| 2 | Press "Import report", choose `deer-creek-completion-report-2025.pdf`, press "Read it" and wait | The check step, with the funder report's changes |
| 3 | Find "Native trees and shrubs planted · 2025" | Ticked; the amount 1673; under the quote, "12,400 to date − 10,727 on record = 1,673" |
| 4 | Press "Add 7 changes" and look at the Performance measures card | The Deer Creek project page; "Native trees and shrubs planted" reads 12,400 |
| 5 | Press "Import report" again, choose the same file, press "Read it" and wait | The check step |
| 6 | Find "Native trees and shrubs planted · 2025" | The badge "Already on file", unticked, an empty amount, and "12,400 to date − 12,400 on record = 0" |

On the prototype: press "Sample funder report" in place of choosing the file; see `../fixtures.md`, On the prototype.

## Open questions

- Q-82 — R1, and step 4: part (b) decides what is proposed for a total to date stated in another unit; part (a) decides the count of seven.
- Q-48 — R7 and S8: if the record changes while the check step is open, whether the difference is worked out again before it is added.
- Q-33 — R6 and S6: if a change the report supports two readings of arrives empty, it shows no difference.
- Q-88 — the Reset line, and how the recorded reading is served.
- Q-91 — R5 and S5: whether a total to date lower than the record's is flagged for the person, and what its arithmetic line says.
- Q-99 — would change R1: what is proposed when one reading holds two changes for one measure and one of them is a total to date; it adds a scenario.
- Q-120 — would change R2: which figure a total is compared with for a measure whose values do not add up, and whether entries of later periods count.
- Q-121 — would change R4 and R7: whether a figure typed into a change with nothing left ticks it, and what the arithmetic line says after the amount is edited.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | RUL-14, STA-18; RUL-135 |
| R2 | shown | RUL-14 |
| R3 | shown | STA-18; RUL-136 |
| R4 | shown | RUL-14, STA-18; relies on story 32, STA-11 |
| R5 | shown | RUL-14, STA-18 |
| R6 | shown; shown, developer-machine reader only | RUL-137, RUL-138; relies on story 14, STA-12 to STA-14 |
| R7 | shown | RUL-139 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the record's total at 607-612; the difference, the "= 0" case and the line at 674-683, where an unsure change returns before any subtraction; the line drawn with no label at 822); `scripts/report-reader.mjs` (a figure that counts another quantity is never passed on as a total to date, 409-415); `src/data/firma2-report-import.ts` (the "stated as a total to date" flag, and the sample that carries it).
- Data shapes, as the prototype models them: a proposed measure entry carries the total to date as a number. The page reads the measure's total from the record, subtracts, and keeps the arithmetic as one line of text on the change.
- What the prototype does where nothing is decided (not requirements): a lower total shows a subtraction that does not equal 0 (R5); a figure typed into a change with nothing left ticks it and marks it as filled in after arriving empty, as if it had been flagged (Q-121); the arithmetic line never changes after the check step opens.
- Do not copy: the record read from browser-local stores; the scripted readings; the subtraction running in the browser; the "Check this" badge on F6 (struck, Q-25).

</details>
