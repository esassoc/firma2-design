# 14 — A Contributor fills or leaves out a change the reading flagged

Type: story
Epic: B — What a report can change
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-33, Q-61, Q-78, Q-82, Q-89, Q-92, Q-113, Q-114, Q-122, Q-123, Q-170, Q-171
Revision: 1
Blocked by: 06, 07, 02, 32
Covers: STA-12, STA-13, STA-14, ACN-13, RUL-11, RUL-12, RUL-13, RUL-63, RUL-142, RUL-143, RUL-145, RUL-146, RUL-300, RUL-301, RUL-302, RUL-303, RUL-304
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #13; interview 2026-11-23, Q-25
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R11, on a check step where stories 04, 06, 07 and 32 are built (the tally, the checkbox, the amount field and "Already on file" are used here, not built here), against the recorded sample `deer-creek-flagged-figures-2025.pdf`, which stands in for enabler 02 until it is built. R9 and R10 have no sample and are built against data described by kind. Built here, not showable until a later story: the stop on a ticked change with no reporting period (story 30, R2). Waiting on a feature that is not built: nothing.

## Story

As a Contributor, I want every figure the reading could not settle left for me to fill or leave out, with the reason stated, so that nothing goes on the record that the report does not plainly say.

## Description

Most performance measure changes arrive ready. Some do not: the reading could not settle the figure, or the report files it under a reporting period the project does not offer. On the check step of Import a report each such change arrives flagged and unticked, with one badge, "Needs you", and a sentence that says why. The person reads the reason, checks the document, and either supplies what is missing or leaves the change out. A figure the reading could not settle is never written in for them. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report; the one badge, the empty amount on a change with two readings, and the cases of R9 and R10 are not in the prototype.

## Requirements

R1. As read, a performance measure change is either ready or flagged. The reading returns each figure as settled, or as not settled with its reason; there is no third verdict, and code decides everything else. A flagged change has one or more of the reasons of R2 to R4, R9 and R10. No confidence level is shown on any change, and no suggested figure is offered on a flagged one.

R2. When the reading cannot settle a figure, for example because the report gives no unit, the change is flagged: it arrives unticked, with the amount empty and the reason stated under the quote ("The table gives 40 with no unit. This measure is in pounds.").

R3. When the report counts a different quantity than the measure asks for, the change is flagged: it arrives unticked, with the amount empty and a sentence under the quote stating the difference ("The report counts events. This measure asks for hours.").

R4. When the report supports two readings, the change is flagged: it arrives unticked, with the amount empty, and the sentence under the quote states both readings and why they differ. Neither reading is written in. The person types the figure, which ticks the change (R6). There is no button for either reading and no choice control.

R5. A flagged change carries one badge, "Needs you", whatever its reason, and only one however many reasons it has. The badge goes when the change is ticked and comes back when it is unticked. Every reason and note stays throughout, because they explain the figure; a change with several reasons shows each sentence, the figure's first. While it is unticked the tally counts the change under "need you" ("1 needs you" for one); once ticked, under "ready to add".

R6. Entering a figure above zero in a change whose amount arrived empty ticks the change, if it is unticked.
- One reading of a typed figure decides both the tick and what is added (story 30, R2): outer spaces are trimmed, and commas and spaces between digits are ignored. So "1 000" ticks the change. A "$" is not part of a measure amount, so "$40" does not tick it. Zero, a negative figure and text that is not a number tick nothing.
- Clearing the figure of a change that ticked itself this way unticks it again. A change the person ticked by hand stays ticked whatever is typed or cleared.
- Whether the figure can be added (its decimals, its limit) is checked when "Add N changes" is pressed — story 30.

R7. A flagged change the person leaves unticked is left out of the import: nothing is saved for it.

R8. Where a flagged change meets "Already on file" (story 32):
- A change whose amount arrives empty is never "Already on file" on arrival: there is no figure to compare. So a figure the person filled in and added is not recognised when the same report is read again; the change arrives empty and flagged once more.
- When the person then types a figure that makes the change an entry the record already holds, the comparison of story 32, R5 marks it "Already on file", and the typing does not tick it. The person may still tick it by hand (story 32, R4).

R9. A figure the report states in another unit than the measure's, or one that would need multiplying to become the measure's quantity, is not settled: the first release converts nothing and multiplies nothing. The change is flagged, with the amount empty and a sentence stating the report's figure as written and the measure's unit ("The report gives 3,960 feet. This measure is in miles."; "The report gives 35 people for 4 hours each. This measure is in hours."). The person works the figure out and types it.

R10. When the report files a figure under a reporting period the project does not offer, the change is flagged: it arrives unticked, with its amount kept as read, "Reporting period" empty, and a sentence naming the period the report gives. Picking a reporting period ticks the change, if it is unticked and its amount holds a figure above zero. An entry is never saved under a period the project does not offer.

R11. Only a figure the reading could not settle arrives empty (R2 to R4, R9). A change that is unticked for another reason keeps its figure as read: a repeat inside one reading (story 32, R7), a reporting period the project does not offer (R10), and every change of a report that names another project (story 20, R2).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The amount field of a performance measure change, its reporting period and breakdown answers, which a flagged change has like any other — story 07. Recording that a figure was filled in after arriving empty — enabler 36.
- A ticked change with no figure above zero, with too many decimals, or with no reporting period — story 30.
- A flagged figure that is a total to date, and a total lower than the record's — story 13.
- A repeat inside one reading, which arrives unticked with its figure — story 32, R7. A report that names another project — story 20.
- A funding source whose organization the workspace does not hold, or that has no organization or no amount — story 75.
- Converting a unit in code — enabler 26 (`later`).
- What a Manager is shown about a filled-in figure — `publish-review`, build 2.

## Needs to know from elsewhere

- The reading says, for each figure, whether it is settled, and if not gives the reason. It returns a figure in another unit as written, with its unit, unconverted, and never fills a figure it could not settle — enabler 02.
- A flagged change arrives unticked; an unticked change is not added; the count on "Add N changes" follows every tick; with no change ticked the action reads "Nothing ticked" — story 06 (R1, R2, R4, R5).
- The tally counts every change in exactly one part, and leaves a part out when it counts none — story 04, R2.
- A performance measure change has an editable amount, shown with thousands separators; "Reporting period" offers the project's closed reporting periods and arrives empty when the report's period is not one of them — story 07 (R1, R3).
- When an entry is "Already on file", and that the comparison is made again after an edit and at the press — story 32 (R2, R5).
- "Add N changes" saves each added change as an entry, and the Performance measures card takes it in — story 01, R10 and R11.

## Scenarios

S1 to S10 and S13 run against the recorded sample "flagged figures" in `../fixtures.md` (rows F3, F7, F8 and F9). No sample holds the data of S11 and S12; they describe it by kind.

**S1 — No confidence level and no suggestion** (proves R1)
- Given the flagged figures sample has been read for Deer Creek
- When the Contributor reads F7, F8 and F9
- Then none shows a confidence level, a suggested figure or a control to take one

**S2 — A figure that is not settled arrives empty, with its reason** (proves R2, R3)
- Given the flagged figures sample is read for Deer Creek
- When the reading comes back
- Then F9, "Native seed collected · 2025", is unticked with an empty amount and reads "The table gives 40 with no unit. This measure is in pounds."; F8, "Volunteer hours contributed · 2025", is unticked with an empty amount and reads "The report counts events. This measure asks for hours."

**S3 — Two possible readings** (proves R4)
- Given the flagged figures sample is read for Deer Creek
- When the reading comes back
- Then F7, "Acres of riparian habitat restored · 2025", is unticked, its amount is empty, it shows the sentence `../fixtures.md` gives for F7, which states both readings (6 and 12), and it offers no control to take either

**S4 — One badge, and the tally** (proves R5)
- Given the flagged figures sample has been read
- When the Contributor looks at the check step
- Then F7, F8 and F9 each carry the badge "Needs you" and no other, F3 carries none, and the tally reads "1 ready to add · 3 need you"

**S5 — Filling a figure ticks the change** (proves R6, R5)
- Given F9 is unticked with an empty amount
- When the Contributor enters 40 in its amount
- Then F9 is ticked, its badge is gone, its sentence still shows, the tally reads "2 ready to add · 2 need you" and the action reads "Add 2 changes"

**S6 — Unticking brings the badge back** (proves R5)
- Given F9 holds 40 and is ticked, as after S5
- When the Contributor unticks it
- Then F9 carries "Needs you" again and the tally reads "1 ready to add · 3 need you"

**S7 — Clearing the figure unticks a change that ticked itself** (proves R6)
- Given F9 holds 40 and ticked itself, as after S5
- When the Contributor clears its amount
- Then F9 is unticked and the action reads "Add 1 change"

**S8 — A change ticked by hand stays ticked** (proves R6)
- Given the Contributor ticked F8 by hand while its amount was empty, then typed 72 into it
- When they clear the amount
- Then F8 is still ticked

**S9 — One reading of a typed figure** (proves R6)
- Given F9 is unticked with an empty amount
- When the Contributor types "$40", and then replaces it with "1 000"
- Then "$40" leaves F9 unticked, and "1 000" ticks it

**S10 — A flagged change left alone is left out** (proves R7)
- Given F8 is left unticked, and Deer Creek's "Volunteer hours contributed" stands at 1,478
- When the Contributor adds the ticked changes
- Then the Performance measures card still shows 1,478 for "Volunteer hours contributed"

**S11 — A figure in another unit** (proves R9)
- Given a reading that returns, for a measure recorded in miles, a figure the report states in feet
- When the check step opens
- Then the change is unticked with "Needs you", its amount is empty, and its sentence states the report's figure in feet and that the measure is in miles

**S12 — A reporting period the project does not offer** (proves R10, R11)
- Given a reading that files a settled figure under a year that is not one of the project's closed reporting periods
- When the check step opens
- Then the change is unticked with "Needs you", its amount holds the figure as read, "Reporting period" is empty, and its sentence names the year the report gives

**S13 — The same report read again** (proves R8)
- Given the Contributor filled F9 with 40 and added it, so the record holds 40 pounds for 2025
- When the flagged figures sample is read again and the Contributor types 40 into F9
- Then F9 arrived empty with "Needs you"; once 40 is typed it carries "Already on file" and is not ticked

Picking a reporting period ticking the change (R10) is checked on the data of S12: pick a period and the change is ticked and loses its badge.

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Deer Creek is in its starting state. The test environment serves the recorded sample `deer-creek-flagged-figures-2025.pdf`. Stories 01, 04, 06, 07 and 32 are built.
Test data: `../fixtures.md`: the flagged figures sample, rows F3, F7, F8 and F9; Deer Creek's "Before" figures. No sample holds a figure in another unit or a reporting period the project does not offer.
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and note three figures on the Performance measures card | "Native seed collected" 98; "Volunteer hours contributed" 1,478; "Acres of invasive vegetation removed" 12.6 |
| 2 | Press "Import a report", choose `deer-creek-flagged-figures-2025.pdf`, press "Read it" and wait | The check step, with four changes; the tally reads "1 ready to add · 3 need you"; the action reads "Add 1 change" |
| 3 | Find "Native seed collected · 2025" | Unticked, the badge "Needs you", an empty amount, and "The table gives 40 with no unit. This measure is in pounds." |
| 4 | Find "Volunteer hours contributed · 2025" | Unticked, the badge "Needs you", an empty amount, and "The report counts events. This measure asks for hours." |
| 5 | Look on that change for a suggested figure or a button that fills one in | There is none |
| 6 | Find "Acres of riparian habitat restored · 2025" | Unticked, the badge "Needs you", an empty amount, and one sentence that gives both readings, 6 and 12 |
| 7 | Enter 40 in the amount of "Native seed collected · 2025" | The change ticks itself and loses its badge; its sentence stays; the tally reads "2 ready to add · 2 need you"; the action reads "Add 2 changes" |
| 8 | Clear that amount | The change is unticked and carries "Needs you" again; the action reads "Add 1 change" |
| 9 | Enter 40 again | As in step 7 |
| 10 | Press "Add 2 changes" and look at the Performance measures card | The Deer Creek project page, with the toast "2 changes added from deer-creek-flagged-figures-2025.pdf"; "Native seed collected" reads 138; "Acres of invasive vegetation removed" reads 16.8; "Volunteer hours contributed" still reads 1,478 |

On the prototype: see `../fixtures.md`, On the prototype. It serves the whole funder report, draws three badges and "Use suggestion", and writes 6 into F7.

## Open questions

None open. The story rests on these proposed answers:

- Q-33 (proposed) — R4, R11: a figure the reading could not settle always arrives empty, two readings included; other unticked changes keep their figure.
- Q-78 (proposed) — R4: the two readings are stated in one sentence; no buttons.
- Q-61 (proposed) — R5: one badge, "Needs you".
- Q-122 (proposed) — R5: the badge goes when the change is ticked; reasons stay.
- Q-89 (proposed) — R1: settled or not settled; no "unsure" verdict.
- Q-92 (proposed) — R6: clearing the figure unticks a change that ticked itself.
- Q-123, Q-113 (proposed) — R6: one reading of a typed figure for the tick and for adding.
- Q-82 (proposed) — R9: a figure in another unit, or one needing multiplication, is flagged and empty.
- Q-114 (proposed) — R10: a reporting period the project does not offer.
- Q-170 (proposed) — R8, second part: a typed figure the record already holds marks the change and does not tick it.
- Q-171 (proposed) — R10: picking a reporting period ticks a change flagged for its period; and R5: several reasons on one change.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; proposed (Q-89) | RUL-63 |
| R2 | decided | RUL-11, STA-14; RUL-146 |
| R3 | shown | RUL-13, STA-13; RUL-146 |
| R4 | proposed (Q-33, Q-78) | RUL-12, STA-12; RUL-142 (reworded: no reading is written in) |
| R5 | proposed (Q-61, Q-122; Q-171 for several reasons) | STA-12, STA-13, STA-14; relies on story 04, STA-8 |
| R6 | decided; shown; proposed (Q-92, Q-123, Q-113) | ACN-13; RUL-142, RUL-143; RUL-300 |
| R7 | decided; shown | RUL-11; RUL-13 |
| R8 | shown; proposed (Q-170) | RUL-145; relies on story 32, STA-11, RUL-15; RUL-301 |
| R9 | proposed (Q-82) | RUL-302 |
| R10 | proposed (Q-114; Q-171 for the tick) | RUL-303 |
| R11 | proposed (Q-33) | RUL-304 |
- Wording provisional: the sentences of R9 and R10 other than the quoted examples; the example for multiplication in R9.
- Not yet prototyped: the one badge; F7's empty amount; the unticking of R6; R8's second part; R9; R10.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (what each flagged case resolves to, and why an empty amount is never on file, 674 and 684-690; which changes wait on the person, 693-695; the badges, 771-773; the reason and the note, 823-824; the change ticking itself on an entered figure, 895-903); `src/data/firma2-report-import.ts` (the flags on a proposed change, and the sample that carries them).
- Data shapes, as the prototype models them: a proposed change carries three flags (needs a decision, no match, unsure) and, for unsure, a reason. The stories need one: settled or not, with a reason.
- Do not copy: the three badges "Needs a decision", "No match" and "Unsure"; the reading written into F7; the suggested figure and "Use suggestion", and a "No match" change counting as already on file once its suggestion was added; the confidence levels and their "Check this" badge (struck, Q-25); a self-ticked change staying ticked when its figure is cleared; "1 000" not ticking a change; the scripted readings.

</details>
