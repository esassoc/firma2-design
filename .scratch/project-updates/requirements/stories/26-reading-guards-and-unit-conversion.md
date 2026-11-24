# 26 — Unit conversion: a figure in another unit is converted in code, or flagged

Type: enabler
Epic: B — What a report can change
Release: later
Status: needs-info
Revision: 1
Blocked by: 02, 04, 13, 14
Covers: RUL-34, RUL-35, RUL-209, RUL-210, RUL-211, RUL-212, RUL-213, RUL-214, RUL-215
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report` (developer-machine reader only); no spec decision; interview 2026-11-23, Q-62
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n)

Can start: nothing in the first release; this enabler is `later`. When it is taken up: R1 to R8, once enabler 02 returns each figure with the unit the document states, and its verdict, and stories 04, 13 and 14 are built (the quote and its arithmetic line, the total to date and the flagged change are theirs, used here). Every requirement here is what the developer-machine reader does, confirmed as a requirement for a later release and not otherwise written down. Waiting: the small figure in R6 on Q-95; the names of the flags in R7 and R8 on Q-61; a figure with no unit, in R8, on Q-147; the fixture rows this enabler changes on Q-82.

## Capability

This enabler adds unit conversion to the reading (enabler 02). What goes in: a figure and the unit the document states it in, and the unit of the performance measure it is proposed for. What comes back: the figure in the measure's unit together with the arithmetic, or a flagged change when the figure cannot be converted. It owns all unit conversion in the feature: nothing is converted in the first release. It gives two cases of story 14 (a unit of another kind, a unit that is not known) a stated cause. The other checks made on what the model returns are enabler 50, split from this one on 2026-11-23.

## Description

The reading has a model read the document and map it to the project, and the model never converts a unit (enabler 02). This enabler is the code that does: it runs on what the model returns, before the person sees any change. It was confirmed as a requirement for a later release (Q-62). It exists only in the developer-machine reader; the deployed prototype's "Converted: …" lines are written by hand into its samples.

## Requirements

R1. When the document states a figure in a unit of the same kind as the performance measure's unit (two lengths, or two areas), the proposed change's amount is the figure converted to the measure's unit.
- When the reading adds several lines into one figure (enabler 02), the sum is what is converted.
- A total to date is converted first; the difference from the record (story 13) is then worked out in the measure's unit.

R2. A converted change shows the arithmetic with its quote: "Converted: `<figure>` `<unit as the document writes it>` = `<converted figure>` `<measure's unit>`", as in "Converted: 1.5 ha = 3.71 acres". Both figures have thousands separators and at most two decimals. After a sum, the sum is written first: "Converted: 1 + 0.5 = 1.5 ha; 1.5 ha = 3.71 acres". The document's own unit is seen only in the quote and in this line. Not decided: which arithmetic a converted total to date shows (Q-148).

R3. Conversion does not change a change's state: a converted figure the reading called a match is ready, like a figure stated in the measure's own unit, and one the reading flagged stays flagged.

R4. Conversion covers lengths (feet, miles, meters, kilometers, yards) and areas (acres, hectares, square feet, square meters, square miles) only, by the exact factors: 1 foot = 0.3048 m, 1 yard = 0.9144 m, 1 mile = 1,609.344 m, 1 acre = 4,046.8564224 m², 1 hectare = 10,000 m², 1 square foot = 0.09290304 m², 1 square mile = 2,589,988.110336 m².

R5. The document's unit and the measure's unit are both read the same way.
- A length or an area is recognised in any of these spellings, whatever the case: ft, foot, feet, lf; mi, mile, miles; m, meter, metre and their plurals; km, kilometer, kilometre and their plurals; yd, yard, yards; ac, acre, acres; ha, hectare, hectares; sq ft, sqft, sf, square foot, square feet, ft2, ft²; sq m, sqm, square meter, square metre and their plurals, m2, m²; sq mi, sqmi, square mile, square miles.
- Full stops and brackets in a unit, and the words of, stream, river, channel, linear, lineal and bank beside it, are ignored.
- Any other unit is the measure's own when the two are the same word, ignoring case, everything that is not a letter, and a final s; "hr" counts as "hour". So "hrs" is hours and "Plants" is plants, and nothing is converted or flagged.

R6. A converted figure is rounded to two decimals. A result under 0.01 is kept to two significant figures. A figure already in the measure's unit is rounded the same way. Not decided: how a figure under 0.01 is shown, in the amount and in the line of R2, since both show at most two decimals (Q-95).

R7. When the figure cannot be converted and at least one of the two units is a length or an area this enabler knows (a length where an area is asked; kilograms where acres are asked), the change is flagged as a change that counts something else is (story 14, R3): its amount is empty, and "The report gives `<unit as the document writes it>`. This measure asks for `<measure's unit>`." is added after any note the reading gave. A change the reading already said counts something else is left as it is. (open: Q-61)

R8. When neither unit is a length or an area and they are not the same word by R5 (kilograms where pounds are asked), nothing is converted. A change the reading called a match is flagged as a change with two readings is (story 14, R4): its amount holds the figure as the document writes it, and "The report says “`<unit as the document writes it>`”. This measure counts `<measure's unit>`." is added after any note the reading gave. A change the reading had already flagged keeps its flag and gets no such note. (open: Q-61) Not decided: a figure the document gives with no unit at all (Q-147).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The checks on what the model returns that are not about units (a measure the project is not asked, a year that is not a reporting period, a breakdown answer, a Key facts field, a low-confidence reading) — enabler 50.
- What the first release does with a figure in another unit — not decided (Q-82); enabler 02 holds the rule that it converts nothing.
- What the person sees and does with a flagged change — story 14.
- What the first release does with a total to date stated in another unit — story 13; not decided (Q-82). Once this enabler is built, R1 converts it.
- The multiplication on fixture row P3 ("35 people × 4 hours") — not decided (Q-82).
- Weights, volumes, counts and times: they are not converted (R4, R8).

## Needs to know from elsewhere

- The reading returns, for each figure, the number and the unit as the document writes them, and the model converts nothing — owned by enabler 02.
- Each performance measure has one unit, which is the project's own — owned by `performance-measures`.
- Every change shows its quote, and any arithmetic is shown with it — owned by story 04.
- An imported change's value is written with thousands separators and at most two decimals — owned by story 22, R2. On the check step the amount field holds plain digits (1850) — owned by story 01, R8.
- A change is ready or flagged; a flagged change arrives unticked and waits on the person, who fills it or leaves it out. One that counts something else arrives with its amount empty; one with two readings arrives with one reading in the amount — owned by story 14 (R3, R4).
- A total to date is filed as the difference from what the record holds — owned by story 13.
- The other checks on what the model returns run on the same change; when several apply, their notes follow one another — owned by enabler 50 (R7).

## Scenarios

No recorded reading in `../fixtures.md` shows this enabler's output: rows C3, C4, F4 and F5 are recorded as the prototype's samples have them, already converted and rounded by hand. Each scenario starts from the words of the fixture document, or from data described by kind.

**S1 — Hectares become acres** (proves R1, R4)
- Given "Acres of invasive vegetation removed", in acres, and the crew log's row 8, "Blackberry pull below county bridge, 1.5 ha"
- When the reading comes back
- Then the change's amount is 3.71 acres

**S2 — The arithmetic is shown with the quote** (proves R2)
- Given "Miles of livestock exclusion fencing", in miles, and the funder report's line "Livestock exclusion fence installed, 3,960 feet"
- When the reading comes back
- Then the change shows "Converted: 3,960 feet = 0.75 miles" with its quote, "Treatments table, page 2 — “Livestock exclusion fence installed, 3,960 feet”"

**S3 — A converted change is ready** (proves R3)
- Given "Miles of livestock exclusion fencing", in miles, and the crew log's row 10, "Exclusion fence, upland pasture, 2,640 ft. Notes: ~4 ac fenced off"
- When the reading comes back
- Then the change for 0.5 miles is ready, not flagged

**S4 — Words beside the unit are ignored** (proves R5)
- Given "Stream miles revegetated", in miles, and the funder report's line "Riparian planting, 2,112 feet of stream"
- When the reading comes back
- Then the change's amount is 0.4 miles

**S5 — A very small result** (proves R6)
- Given a performance measure in miles and a document that states 12 feet for it
- When the reading comes back
- Then the converted figure is 0.0023 miles, not 0

**S6 — A length where an area is asked** (proves R7)
- Given "Acres of invasive vegetation removed", in acres, and a document that states 300 feet for it, which the reading calls a match
- When the reading comes back
- Then the change is flagged, its amount is empty, and its note reads "The report gives feet. This measure asks for acres."

**S7 — A unit that is not converted** (proves R4, R8)
- Given "Native seed collected", in pounds, and a document that states 18 kilograms for it, which the reading calls a match
- When the reading comes back
- Then the change is flagged, its amount holds 18, and its note reads "The report says “kilograms”. This measure counts pounds."

**S8 — A total to date in another unit** (proves R1)
- Given "Miles of livestock exclusion fencing", in miles, with 3 miles on the record, and a document that states 18,480 feet as the total to date
- When the reading comes back
- Then the change's amount is 0.5 miles: 18,480 feet is 3.5 miles, less the 3 on record

## Verification

Steps 1 to 4 run once `../fixtures.md` holds the crew log's reading as it arrives before conversion; today it holds only the converted rows. R7 and R8 have no fixture document: check them with S6 and S7, against data a developer makes.

Preconditions: this enabler and enabler 02 are built; stories 01, 04 and 14 are built, so the check step shows the changes, the quote and the tally. Signed in as someone who can edit Deer Creek, which is in its starting state.
Test data: `../fixtures.md`: the crew log, its rows 8 and 10 and its recorded rows C3 and C4. Expect C3 to read 3.71 acres here, where the recording says 3.7 (Q-82).
Reset: none needed if you leave by the breadcrumb without pressing "Add 6 changes". Otherwise not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | On Deer Creek, open Import a report, choose `deer-creek-crew-log-2025.xlsx` and press "Read it" | The check step, with six changes |
| 2 | Find "Acres of invasive vegetation removed · 2025" | 3.71 acres, and with the quote of row 8 the line "Converted: 1.5 ha = 3.71 acres" |
| 3 | Find "Miles of livestock exclusion fencing · 2025" | 0.5 miles, and with the quote of row 10 the line "Converted: 2,640 ft = 0.5 miles" |
| 4 | Read the tally | "6 ready to add": both converted changes are counted as ready |

## Open questions

- Q-95 — R6 and S5: how a converted figure under 0.01 is shown and saved, and whether a change that rounds to 0 is still proposed. The same question now asks it of the line of R2.
- Q-61 — R7, R8, S6 and S7: if the flagged states become one, whether R7's empty amount and R8's kept figure both survive.
- Q-82 — S1 to S4 and the Verification steps: when the first release's handling of these figures is settled, fixture rows C3, C4, F4 and F5 are recorded again and these scenarios name them. Its part (b) decides whether this enabler also converts a total to date; its part (d) whether it shows a multiplication.
- Q-88 — the Reset line, and how a recorded reading is served.
- Q-148 — would change R2 and S8: a converted total to date would show the conversion as well as the difference.
- Q-147 — would change R8 and S7: a figure with no unit would arrive empty with a sentence of its own, as fixture row F9 does, and not as R8 has it.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown, developer-machine reader only | RUL-35, RUL-210 |
| R2 | shown, developer-machine reader only | RUL-35, RUL-209 |
| R3 | shown, developer-machine reader only | RUL-34 |
| R4 | shown, developer-machine reader only | RUL-35 |
| R5 | shown, developer-machine reader only | RUL-35, RUL-211, RUL-212 |
| R6 | shown, developer-machine reader only | RUL-35, RUL-213 |
| R7 | shown, developer-machine reader only | RUL-34, RUL-214 |
| R8 | shown, developer-machine reader only | RUL-34, RUL-215 |

All eight were confirmed as requirements for a later release (interview 2026-11-23, Q-62).

- Prototype files: `scripts/report-reader.mjs` (the factors, 145-146; how a unit is read, 149-174; rounding, 175-176; conversion and its four outcomes, 185-197; the sum, the two flags and their notes, the arithmetic line and a total to date, 369-394 and 405-415; runs on a developer's machine only); `src/components/projects/firma2-project-report-import.astro` (where the "Converted: …" line is drawn); `src/data/firma2-report-import.ts` (the samples' hand-written lines).
- Data shapes, as the prototype models them: for each proposed figure the model returns the number and the unit as written. Code produces the converted amount and the text of the arithmetic, and sets the verdict (match, needs a decision, no match).
- What the reader does where nothing is decided (not requirements): a figure with no unit gets the note "The report says “”. This measure counts pounds." and keeps its figure (Q-147); the line of R2 writes a figure under 0.01 as 0, "12 feet = 0 miles", while the amount is 0.0023 (Q-95).
- Do not copy: the developer-machine reader itself, which calls a model through one person's local login; the samples' hand-written "Converted:" lines ("1.5 ha = 3.7 acres", "3,960 ft = 0.75 miles"), which this rule would write "3.71 acres" and "3,960 feet"; the "No match" and "Needs a decision" badges as names (Q-61).

</details>
