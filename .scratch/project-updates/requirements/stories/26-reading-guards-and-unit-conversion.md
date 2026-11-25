# 26 — Unit conversion: a figure in another unit is converted in code, or flagged

Type: enabler
Epic: B — What a report can change
Release: later
Status: needs-triage
Built on proposals awaiting validation: Q-33, Q-61, Q-82, Q-95, Q-118, Q-147, Q-148
Revision: 1
Blocked by: 02, 04, 13, 14
Covers: RUL-34, RUL-35, RUL-209, RUL-210, RUL-211, RUL-212, RUL-213, RUL-214, RUL-215
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report` (developer-machine reader only); no spec decision; interview 2026-11-23, Q-62
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n)

Can start: nothing in the first release; this enabler is `later`. When it is taken up: R1 to R8, once enabler 02 returns each figure with the unit the document states, and stories 04, 13 and 14 are built (the quote and its arithmetic line, the total to date and the flagged change are theirs, used here). Waiting: a sample that states figures in other units, which is to be made (see Verification). Nothing waits on a question.

## Capability

This enabler adds unit conversion to the reading (enabler 02). What goes in: a figure and the unit the document states it in, and the unit and decimal places of the performance measure it is proposed for. What comes back: the figure in the measure's unit together with the arithmetic, or the same flagged change the first release shows when the figure cannot be converted. It owns all unit conversion in the feature. The other checks made on what the model returns are enabler 50.

## Description

In the first release nothing is converted: a figure the report states in another unit arrives flagged with an empty amount, and the person works it out and types it (story 14, R9; for a total to date, story 13, R1). This enabler replaces that for lengths and areas: code converts the figure before the person sees the change, and shows the arithmetic. Everything it cannot convert stays exactly as the first release has it. The model still converts nothing (enabler 02). It was confirmed as a requirement for a later release (Q-62) and exists only in the developer-machine reader; the deployed prototype's "Converted: …" lines are written by hand into its samples.

## Requirements

R1. When the document states a figure in a unit of the same kind as the performance measure's unit (two lengths, or two areas), the proposed change's amount is the figure converted to the measure's unit.
- When the reading adds several lines into one figure (enabler 02), the sum is what is converted.
- A total to date is converted first; the difference from the record (story 13) is then worked out in the measure's unit.

R2. A converted change shows the arithmetic with its quote: "Converted: `<figure>` `<unit as the document writes it>` = `<converted figure>` `<measure's unit>`", as in "Converted: 1.5 ha = 3.71 acres". After a sum, the "Added:" line of story 04, R5 comes first and the conversion follows it. A converted total to date shows both lines, in the order the arithmetic was done: the conversion ("Converted: 18,480 feet = 3.5 miles"), then the difference ("3.5 to date − 3 on record = 0.5"). The document's own unit is seen only in the quote and in the conversion line.

R3. Conversion does not change a change's state: a converted figure the reading settled is ready, like a figure stated in the measure's own unit, and one the reading did not settle stays flagged and empty.

R4. Conversion covers lengths (feet, miles, meters, kilometers, yards) and areas (acres, hectares, square feet, square meters, square miles) only, by the exact factors: 1 foot = 0.3048 m, 1 yard = 0.9144 m, 1 mile = 1,609.344 m, 1 acre = 4,046.8564224 m², 1 hectare = 10,000 m², 1 square foot = 0.09290304 m², 1 square mile = 2,589,988.110336 m².

R5. The document's unit and the measure's unit are both read the same way.
- A length or an area is recognised in any of these spellings, whatever the case: ft, foot, feet, lf; mi, mile, miles; m, meter, metre and their plurals; km, kilometer, kilometre and their plurals; yd, yard, yards; ac, acre, acres; ha, hectare, hectares; sq ft, sqft, sf, square foot, square feet, ft2, ft²; sq m, sqm, square meter, square metre and their plurals, m2, m²; sq mi, sqmi, square mile, square miles.
- Full stops and brackets in a unit, and the words of, stream, river, channel, linear, lineal and bank beside it, are ignored.
- Any other unit is the measure's own when the two are the same word, ignoring case, everything that is not a letter, and a final s; "hr" counts as "hour". So "hrs" is hours and "Plants" is plants, and nothing is converted or flagged.

R6. A converted figure is held to the measure's own decimal places, on the check step and on the record, and the "Converted:" line shows the same figure as the amount, never more or fewer decimals. A converted figure that would round to zero at that precision is not proposed as zero: the change is flagged, its amount empty, with a sentence stating the report's figure and that it is less than the measure can record.

R7. A figure in a unit of another kind than the measure's (a length where an area is asked; kilograms where acres are asked) cannot be converted. The change stays as the first release has it (story 14, R9): flagged with "Needs you", its amount empty, and the sentence stating the report's figure and the measure's unit ("The report gives 300 feet. This measure is in acres."). A change the reading itself did not settle keeps the reading's sentence too.

R8. When neither unit is a length or an area and they are not the same word by R5 (kilograms where pounds are asked), nothing is converted and the change stays as in R7: flagged, empty, with the same sentence ("The report gives 18 kilograms. This measure is in pounds."). A figure the document gives with no unit at all arrives the same way, with "The report gives `<figure>` with no unit. This measure is in `<unit>`." The figure is never written into the amount.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The checks on what the model returns that are not about units (a measure the project is not asked, a field the project did not offer, a low-confidence reading) — enabler 50.
- What the first release does with a figure in another unit — story 14, R9, and story 13, R1. This enabler replaces it for lengths and areas only.
- What the person sees and does with a flagged change — story 14.
- Multiplication ("35 people for 4 hours each"): not done here either; the change stays flagged and empty (story 14, R9).
- Weights, volumes, counts and times: they are not converted (R4, R8).

## Needs to know from elsewhere

- The reading returns, for each figure, the number and the unit as the document writes them, and the model converts nothing — enabler 02 (R2).
- Each performance measure has one unit and a number of decimal places — owned by `performance-measures`.
- Every change shows its quote, and any arithmetic is shown with it; a sum reads "Added: 3.5 + 2 = 5.5 acres" — story 04, R5.
- On the check step and on the record an amount is written with thousands separators — story 07 (R1) for the check step; `performance-measures` for the record. A typed amount with more decimals than the measure takes is refused when "Add N changes" is pressed — story 30, R2.
- A change is ready or flagged; a flagged change carries the one badge "Needs you", arrives unticked with its amount empty when its figure is not settled, and the person fills it or leaves it out — story 14 (R2 to R6, R9).
- A total to date is filed as the difference from what the record holds, exactly, with its own arithmetic line — story 13 (R1 to R3).
- The other checks on what the model returns run on the same change; when several apply, the change is flagged once and their sentences follow one another — enabler 50 (R4).

## Scenarios

No recorded sample in `../fixtures.md` shows this enabler: every sample states its figures in the measure's own unit, because the first release converts nothing. Each scenario describes its data by kind, on measures as Deer Creek has them. S1, S2 and S5 assume a measure that takes two decimal places.

**S1 — Hectares become acres** (proves R1, R4)
- Given a measure in acres, and a document that states 1.5 ha for it
- When the reading comes back
- Then the change's amount is 3.71 acres

**S2 — The arithmetic is shown with the quote** (proves R2)
- Given a measure in miles, and a document line that states 3,960 feet for it
- When the reading comes back
- Then the change shows "Converted: 3,960 feet = 0.75 miles" with its quote

**S3 — A converted change is ready** (proves R3)
- Given a measure in miles, and a document that states 2,640 ft for it, which the reading settled
- When the reading comes back
- Then the change for 0.5 miles is ready and ticked, not flagged

**S4 — Words beside the unit are ignored** (proves R5)
- Given a measure in miles, and a document line that states "2,112 feet of stream" for it
- When the reading comes back
- Then the change's amount is 0.4 miles

**S5 — A result too small to record** (proves R6)
- Given a measure in miles and a document that states 12 feet for it
- When the reading comes back
- Then the change is flagged with an empty amount, and its sentence states 12 feet and that it is less than the measure can record; no line reads "= 0 miles"

**S6 — A length where an area is asked** (proves R7)
- Given a measure in acres, and a document that states 300 feet for it
- When the reading comes back
- Then the change is flagged with "Needs you", its amount is empty, and it reads "The report gives 300 feet. This measure is in acres."

**S7 — A unit that is not converted** (proves R4, R8)
- Given a measure in pounds, and a document that states 18 kilograms for it
- When the reading comes back
- Then the change is flagged, its amount is empty, and it reads "The report gives 18 kilograms. This measure is in pounds."

**S8 — A total to date in another unit** (proves R1, R2)
- Given a measure in miles with 3 miles on the record, and a document that states 18,480 feet as the total to date
- When the reading comes back
- Then the change's amount is 0.5 miles, and it shows "Converted: 18,480 feet = 3.5 miles" and then "3.5 to date − 3 on record = 0.5"

**S9 — A figure with no unit** (proves R8)
- Given a measure in pounds, and a document that states 40 for it with no unit
- When the reading comes back
- Then the change is flagged, its amount is empty, and it reads "The report gives 40 with no unit. This measure is in pounds."

## Verification

Not runnable yet: it needs a recorded sample that states figures in other units, which is to be made when this enabler is taken up. The simplest is the crew log with rows 8 and 10 as they were before they were restated: "1.5 ha" and "2,640 ft". The steps are written against that sample. R6 to R8 are checked with S5 to S7 and S9, against data a developer makes.

Preconditions: this enabler and enabler 02 are built; stories 01, 04 and 14 are built, so the check step shows the changes, the quote and the tally. Signed in as someone who can edit Deer Creek, which is in its starting state. The test environment serves the sample described above.
Test data: the crew log restated in other units (to be made): row 8 "1.5 ha", row 10 "2,640 ft", the other rows as in `../fixtures.md`.
Reset: none needed if you leave by the breadcrumb without pressing "Add 6 changes". Otherwise reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | On Deer Creek, open Import a report, choose the sample and press "Read it" | The check step, with six changes |
| 2 | Find "Acres of invasive vegetation removed · 2025" | 3.71 in the amount, and with the quote of row 8 the line "Converted: 1.5 ha = 3.71 acres" |
| 3 | Find "Miles of livestock exclusion fencing · 2025" | 0.5 in the amount, and with the quote of row 10 the line "Converted: 2,640 ft = 0.5 miles" |
| 4 | Read the tally | "6 ready to add": both converted changes are counted as ready |

## Open questions

None open. The enabler rests on these proposed answers:

- Q-82 (proposed) — the Description, R7 and R8: what the first release does with a figure in another unit, which this enabler replaces or leaves standing; no multiplication.
- Q-148 (proposed) — R2: a converted total to date shows the conversion, then the difference.
- Q-118 (proposed) — R2: a sum is shown on its own "Added:" line; "Converted:" is for conversion alone.
- Q-95 (proposed) — R6: the measure's own decimal places; a figure that would round to zero is flagged and empty.
- Q-61 (proposed) — R7, R8: the one badge, "Needs you".
- Q-33 (proposed) — R7, R8: a figure that cannot be converted is not written into the amount.
- Q-147 (proposed) — R8: a figure with no unit.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown, developer-machine reader only | RUL-35, RUL-210 |
| R2 | shown, developer-machine reader only; proposed (Q-118, Q-148) | RUL-35, RUL-209 |
| R3 | shown, developer-machine reader only | RUL-34 |
| R4 | shown, developer-machine reader only | RUL-35 |
| R5 | shown, developer-machine reader only | RUL-35, RUL-211, RUL-212 |
| R6 | proposed (Q-95) | RUL-35, RUL-213 (reworded: the measure's decimal places, not two) |
| R7 | shown, developer-machine reader only; proposed (Q-61, Q-82) | RUL-34, RUL-214 (reworded: the first release's sentence) |
| R8 | proposed (Q-33, Q-82, Q-147) | RUL-34, RUL-215 (reworded: the amount is empty) |
R1 to R5 were confirmed as requirements for a later release (interview 2026-11-23, Q-62).

- Wording provisional: the sentence of R6 for a figure too small to record.
- Prototype files: `scripts/report-reader.mjs` (the factors, 145-146; how a unit is read, 149-174; rounding, 175-176; conversion and its four outcomes, 185-197; the sum, the two flags and their notes, the arithmetic line and a total to date, 369-394 and 405-415; runs on a developer's machine only); `src/components/projects/firma2-project-report-import.astro` (where the "Converted: …" line is drawn); `src/data/firma2-report-import.ts` (the samples' hand-written lines).
- Data shapes, as the prototype models them: for each proposed figure the model returns the number and the unit as written. Code produces the converted amount and the text of the arithmetic.
- Do not copy: the developer-machine reader itself, which calls a model through one person's local login; rounding every figure to two decimals, and "12 feet = 0 miles" beside an amount of 0.0023; a figure in an unconvertible unit kept in the amount; the note "The report says “”. This measure counts pounds." for a figure with no unit; the samples' hand-written "Converted:" lines; the multiplication shown under "Converted:" on the old pasted paragraph; the "No match" and "Needs a decision" badges.

</details>
