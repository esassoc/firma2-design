# 14 — A Contributor fills or leaves out a change the reading flagged

Type: story
Epic: B — What a report can change
Release: first
Status: needs-info
Revision: 1
Blocked by: 06, 07, 02, 32
Covers: STA-12, STA-13, STA-14, ACN-13, RUL-11, RUL-12, RUL-13, RUL-63, RUL-142, RUL-143, RUL-144, RUL-145, RUL-146
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #13; interview 2026-11-23, Q-25
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R8, on a check step where stories 04, 06, 07 and 32 are built (the tally, the checkbox, the amount field and "Already on file" are used here, not built here), and only against the recorded funder report reading in `../fixtures.md`, which stands in for enabler 02 (not built). Waiting: the parts marked "Not decided" or "open", each on the question named beside it.

## Story

As a Contributor, I want every figure the reading could not settle left for me to fill or leave out, with the reason stated, so that nothing goes on the record that the report does not plainly say.

## Description

Most performance measure changes arrive ready. Three cases do not: the reading is unsure of the figure, the report supports two readings, or the report counts a different quantity than the measure asks for. On the check step of Import a report each such change arrives flagged and unticked. The person reads the reason, checks the document, and either types the figure or leaves the change out. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report.

## Requirements

R1. As read, a performance measure change is either ready or flagged, and a flagged one has one of the three reasons of R2 to R4. No confidence level is shown on any change, and no suggested figure is offered on a flagged one. (open: Q-89)

R2. When the reading is unsure of a figure, for example because the report gives no unit, the change is flagged: it arrives unticked, with the amount empty and the reason stated under the quote ("The table gives 40 with no unit. This measure is in pounds."). (open: Q-82)

R3. When the report counts a different quantity than the measure asks for, the change is flagged: it arrives unticked, with the amount empty and a note under the quote stating the difference ("The report counts events. This measure asks for hours.").

R4. When the report supports two readings, the change is flagged: it arrives unticked, with one reading written into the amount and a note stating the other. The person settles it by ticking it, with the figure as it arrived or changed; changing the figure does not tick it. (open: Q-33, Q-78)

R5. A flagged change says that it waits on the person. As shown, R4's change carries the badge "Needs a decision" and R3's the badge "No match". While it is unticked the tally counts it under "need you"; once ticked, under "ready to add". Not decided: the badge on R2's change, and whether the three cases share one badge and its wording (Q-61); whether the badge and the reason go once the person has filled or ticked the change (Q-122).

R6. Entering a figure above zero in a change whose amount arrived empty ticks the change, if it is unticked. Commas in the figure are ignored. Zero, a negative figure and text that is not a number tick nothing. Not decided: whether clearing the figure again unticks it (Q-92); a figure typed with a space or a currency sign, which the check on "Add N changes" accepts (Q-123).

R7. A flagged change the person leaves unticked is left out of the import: nothing is saved for it.

R8. Where a flagged change meets "Already on file" (story 32):
- A change the report supports two readings of, whose written-in figure the record already holds as an entry, is "Already on file" and not flagged: it carries that badge and no "Needs a decision" badge, and is never counted under "need you". Its note still shows.
- A change whose amount arrives empty (R2, R3) is never "Already on file": there is no figure to compare. So a figure the person filled in and added is not recognised when the same report is read again; the change arrives empty and flagged once more.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The amount field of a performance measure change, its reporting period and breakdown answers, which a flagged change has like any other — story 07. Recording that a figure was filled in after arriving empty — story 36.
- A ticked change with no figure above zero — story 30.
- A flagged figure that is a total to date — story 13, R6.
- A funding source whose organization the workspace does not hold — story 75.
- A unit the measure does not use, checked in code — story 26 (`later`).
- What a Manager is shown about a filled-in figure — `publish-review`, build 2.

## Needs to know from elsewhere

- The reading says, for each figure, whether the document counts what the measure asks, supports more than one reading, or counts something else, and gives the reason or note. It never fills a figure it is unsure of — enabler 02, not built.
- A flagged change arrives unticked; an unticked change is not added; the count on "Add N changes" follows every tick; with no change ticked the action reads "Nothing ticked", as when every change of a reading is flagged — story 06 (R1, R2, R4, R5).
- "need you" counts the flagged changes that are not ticked — story 04, R2.
- A performance measure change has an editable amount, and what is in it when the change is added is what is saved — story 07.
- When an entry is "Already on file", and that it is worked out once, when the check step opens — story 32 (R2, R5).
- "Add N changes" saves each added change as an entry, and the Performance measures card takes it in — story 01, R10 and R11.

## Scenarios

All run against the recorded funder report reading in `../fixtures.md`. Only rows F7 to F9 are used; the reading's other rows belong to other stories.

**S1 — No confidence level and no suggestion** (proves R1)
- Given the funder report's reading has come back
- When the Contributor reads F7, F8 and F9
- Then none shows a confidence level, a suggested figure or a control to take one

**S2 — A figure with no unit** (proves R2)
- Given the funder report is read for Deer Creek
- When the reading comes back
- Then F9, "Native seed collected · 2025", is unticked, its amount is empty, and it reads "The table gives 40 with no unit. This measure is in pounds."

**S3 — A different quantity** (proves R3)
- Given the funder report is read for Deer Creek
- When the reading comes back
- Then F8, "Volunteer hours contributed · 2025", is unticked, its amount is empty, and its note reads "The report counts events. This measure asks for hours."

**S4 — Two possible readings** (proves R4)
- Given the funder report is read for Deer Creek
- When the reading comes back
- Then F7, "Acres of riparian habitat restored · 2025", is unticked, its amount holds 6, and its note reads "The report totals riparian treatment at 6 acres, so both lines look like the same ground: 6, not 12."

**S5 — A flagged change is marked** (proves R5)
- Given the funder report's reading has come back
- When the Contributor looks at F7 and F8
- Then F7 carries the badge "Needs a decision" and F8 the badge "No match"

**S6 — Filling a figure ticks the change** (proves R6, R5)
- Given F9 is unticked with an empty amount
- When the Contributor enters 40 in its amount
- Then F9 is ticked, and the tally counts one more under "ready to add" and one fewer under "need you"

**S7 — A flagged change left alone is left out** (proves R7)
- Given F8 is left unticked, and Deer Creek's "Volunteer hours contributed" stands at 1,478
- When the Contributor adds the ticked changes
- Then the Performance measures card still shows 1,478 for "Volunteer hours contributed"

**S8 — The record already holds the figure written in** (proves R8)
- Given the Contributor ticked F7 as it arrived and added it, so the record holds 6 acres for 2025 with "Riparian treatment" answered Planting
- When the funder report is read again
- Then F7 carries the badge "Already on file" and no "Needs a decision" badge, and the tally does not count it under "need you"

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Nothing has been imported to Deer Creek. The recorded funder report reading is served for the funder report file. Stories 13, 15, 17, 18 and 75 are built, so the whole reading is listed; the counts in steps 7 and 8 assume it.
Test data: `../fixtures.md`: the funder report, rows F7, F8 and F9; Deer Creek's "Before" figures. The counts of seven and eight wait on Q-82; the badges in steps 4 and 6 on Q-61; the 6 in step 6 on Q-33.
Reset: not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and note two figures on the Performance measures card | "Native seed collected" 98; "Volunteer hours contributed" 1,478 |
| 2 | Press "Import report", choose `deer-creek-completion-report-2025.pdf`, press "Read it" and wait | The check step, with the funder report's changes; the tally reads "7 ready to add · 4 need you · 3 already on file" |
| 3 | Find "Native seed collected · 2025" | Unticked, an empty amount, and "The table gives 40 with no unit. This measure is in pounds." |
| 4 | Find "Volunteer hours contributed · 2025" | Unticked, the badge "No match", an empty amount, and "The report counts events. This measure asks for hours." |
| 5 | Look on that change for a suggested figure or a button that fills one in | There is none |
| 6 | Find "Acres of riparian habitat restored · 2025" | Unticked, the badge "Needs a decision", 6 in the amount, and a note that ends "6, not 12." |
| 7 | Enter 40 in the amount of "Native seed collected · 2025" and leave the field | The change ticks itself; the tally reads "8 ready to add · 3 need you · 3 already on file"; the action goes from "Add 7 changes" to "Add 8 changes" |
| 8 | Press "Add 8 changes" and look at the Performance measures card | The Deer Creek project page; "Native seed collected" reads 138; "Volunteer hours contributed" still reads 1,478 |

On the prototype: press "Sample funder report" in place of choosing the file. Step 5 fails there: the prototype still draws "Suggested: 720 hours." with "Use suggestion", and the "Check this" and "Unsure" badges; see `../fixtures.md`, On the prototype.

## Open questions

- Q-33 — R4, S4, S8 and step 6: if the spec holds, the change arrives with an empty amount, and the first part of R8 falls away.
- Q-78 — R4: how the two readings are then offered; it adds a requirement and a scenario.
- Q-61 — R5, S5 and steps 4 and 6: the badge or badges, and their wording.
- Q-82 — R2: part (a) may make a figure in another unit a flagged change with an empty amount, which adds fixture rows to this story; it also decides the counts in steps 2, 7 and 8.
- Q-88 — the Reset line, and how the recorded reading is served.
- Q-89 — R1: part (c), whether "unsure" is a reason the reading returns beside the other two.
- Q-92 — R6: whether clearing the figure unticks the change again; an answer adds a scenario.
- Q-122 — would change R5: whether a flagged change keeps its badge and reason once it is filled or ticked.
- Q-123 — would change R6: which typed figures tick a change, so that the tick and the check on "Add N changes" read a figure the same way.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided | RUL-63 |
| R2 | decided | RUL-11, STA-14; RUL-146 |
| R3 | shown | RUL-13, STA-13; RUL-146 |
| R4 | shown | RUL-12, STA-12; RUL-142 |
| R5 | shown | STA-12, STA-13, STA-14; relies on story 04, STA-8 |
| R6 | decided; shown | ACN-13; RUL-142, RUL-143 |
| R7 | decided; shown | RUL-11; RUL-13 |
| R8 | shown | RUL-144, RUL-145; relies on story 32, STA-11, RUL-15; relies on story 06, RUL-10 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (what each flagged case resolves to, and why an empty amount is never on file, 674 and 684-690; which changes wait on the person, 693-695; the badges, hidden when the record holds the change, 771-773; the reason and the note, 823-824; the change ticking itself on an entered figure, 895-903); `src/data/firma2-report-import.ts` (the flags on a proposed change, and the sample that carries them).
- Data shapes, as the prototype models them: a proposed change carries three flags (needs a decision, no match, unsure) and, for unsure, a reason. A flagged change has no amount, except "needs a decision", which carries one of the two readings.
- What the prototype does where nothing is decided (not requirements): a self-ticked change stays ticked when its figure is cleared (Q-92); the badge, the reason and the note stay whatever the person does (Q-122); "1 000" or "$40" does not tick a change, though Add reads both as figures (Q-123); the "Unsure" badge on F9 is the struck low-confidence badge, so the unsure flag has no badge of its own (Q-61).
- Do not copy: the suggested figure and "Use suggestion", and a "No match" change counting as already on file once its suggestion was added; the confidence levels and their "Check this" and "Unsure" badges (all struck, Q-25); the scripted readings.

</details>
