# 07 — A Contributor corrects a performance measure change before adding it

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 06
Covers: ACN-12, RUL-38, RUL-40, RUL-41, RUL-115, RUL-116, RUL-117, RUL-118
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #13
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R7, on the check step of stories 01, 04 and 06 (the list, the selection and the checkbox are used here, not built here); like story 01, only against the recorded crew log reading in `../fixtures.md` until enabler 02 is built. Waiting: the parts marked "Not decided" or "open", each on the question named beside it; the largest are a reporting period the project does not offer (Q-114) and whether Key facts and contacts become editable (Q-32).

## Story

As a Contributor, I want to change a proposed performance measure entry's amount, reporting period and breakdown answers before I add it, so that what goes on the record is right even where the reading or the report was not.

## Description

On the check step a performance measure change is not a fixed line: its figure, the reporting period it is filed under and its answers to the measure's breakdown questions can each be corrected in place. The person does this after checking the change against the document (story 04) and before pressing "Add N changes". What they leave in the fields is what is saved. That a figure was changed is also recorded with the import; that was split to story 36 on 2026-11-23. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample crew log.

## Requirements

R1. A performance measure change shows its values as fields the person can edit, whatever state the change is in and whether or not it is ticked: "Amount (`<unit>`)", with the measure's unit, or "Amount" for a measure with none; "Reporting period"; and one choice per breakdown question the measure asks, labelled with the question. Each arrives holding what the reading proposed.

R2. What the fields hold when "Add N changes" is pressed is what is saved as the entry: the amount, the reporting period and each breakdown answer given. A question left unanswered saves no answer.
- The amount arrives as digits alone, with a decimal point where the figure has one: 1850, 5.5. The person can type any figure; commas and spaces in it are ignored when the change is added. Not decided: how many decimals an amount may have, an upper limit, and separators in the field (Q-113).
- The amount can be cleared. Clearing it does not untick the change; a ticked change with no amount is stopped on "Add N changes" (story 30, R2).

R3. "Reporting period" offers the project's closed reporting periods and no other, newest first, each by its name. One is always held: the person can pick another but cannot clear it. Not decided: a reading that proposes a period the project does not offer, and the change's label after the person picks another period (Q-114). (open: Q-43)

R4. Each breakdown choice offers that question's options as the measure has them now: a question or an option the measure has retired is not offered. Not decided: whether an answer, once set, can be set back to unanswered (Q-115).

R5. A breakdown question arrives answered only when the document states the answer; otherwise it arrives unanswered, for the person to set or leave. (open: Q-90)

R6. Of the four kinds of change, the person can edit two before adding: a performance measure change (amount, reporting period, breakdown answers) and a funding source change (name, organization, amount). A Key facts change and a contact can only be ticked or left out. (open: Q-32)

R7. An edit changes the field it is made in and nothing else on the check step. It does not tick or untick the change, move it in the list, or change its badge; an edit to an unticked change is kept, and is what is saved if the change is ticked later.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Recording that a figure was changed from the document's, or filled in after arriving empty — story 36.
- The check that an amount is above zero, and its message — story 30.
- A change that arrives with an empty amount, and the one edit that does tick a change: a figure typed into it — story 14.
- The funding source change's fields — story 17. The Key facts change — story 15. The contact — story 18.
- "Already on file", which is not worked out again after an edit — story 32 (R5).
- Two changes edited into the same measure and reporting period: each is saved as its own entry — story 01 (R11).

## Needs to know from elsewhere

- "Add N changes" saves each ticked change as a new entry and returns the person to the project page — owned by stories 01 and 06.
- A breakdown answer is not required, and the reporting period is not checked: a change can be added with a question left unanswered — owned by story 30.
- The reading proposes only a reporting period it was given, and answers a breakdown question only with one of its options — owned by enabler 02 (R5, R6), not built. Nothing checks that until enabler 50 (`later`).
- The project's closed reporting periods and their names, each measure's unit, the breakdown questions it asks and their options, where one entry can be seen, and the figure the card shows (the sum of the measure's entries) — owned by `performance-measures`. This story asks for those lists when the check step opens and nothing else.
- Showing a Manager that a figure was changed — owned by `publish-review`, build 2.

## Scenarios

All run against the recorded crew log reading in `../fixtures.md`.

**S1 — The fields of a measure change** (proves R1, R5)
- Given the check step lists the crew log's six changes
- When the Contributor looks at C1
- Then it has "Amount (acres)" holding 5.5, "Reporting period" holding 2025, and a choice "Riparian treatment" holding Planting

**S2 — A corrected amount is what is saved** (proves R2)
- Given C2's amount arrived as 1850, all six changes are ticked, and Deer Creek's figures are the fixture's "Before" column
- When the Contributor changes C2's amount to 1800 and presses "Add 6 changes"
- Then "Native trees and shrubs planted" on the project page reads 12,527

**S3 — Only closed reporting periods are offered** (proves R3)
- Given Deer Creek's closed reporting periods are 2025, 2024 and 2023, and 2026 and 2027 are open
- When the Contributor opens "Reporting period" on C2
- Then 2025, 2024 and 2023 are offered, in that order, and nothing else: no 2026, no 2027 and no empty choice

**S4 — A changed reporting period is where the entry is filed** (proves R2)
- Given C2 is proposed for 2025
- When the Contributor picks 2024 on C2 and adds the changes
- Then the entry of 1,850 plants is on the record under 2024 and not under 2025

**S5 — The question's own options** (proves R4)
- Given "Acres of riparian habitat restored" asks "Riparian treatment" with the options Planting, Invasive removal and Natural recruitment
- When the Contributor opens "Riparian treatment" on C1
- Then those three options are offered

**S6 — A changed answer is what is saved** (proves R2)
- Given C1 arrived with "Riparian treatment" holding Planting
- When the Contributor picks Natural recruitment on C1 and adds the changes
- Then the entry of 5.5 acres on the record carries Riparian treatment: Natural recruitment

**S7 — An answer the document does not state** (proves R5)
- Given a measure that asks one breakdown question, and a reading of a document that gives the figure and states none of the question's options (no fixture has such a row)
- When the check step opens
- Then the change's choice for that question arrives unanswered

**S8 — An edit to an unticked change is kept** (proves R7)
- Given the Contributor has unticked C2, and the action reads "Add 5 changes"
- When they change C2's amount to 1800
- Then C2 is still unticked, the action still reads "Add 5 changes", and after they tick C2 its amount still holds 1800

## UAT script

Preconditions: story 01's UAT script has been run to its step 5, so the check step lists the crew log's changes. Story 06 is built.
Test data: `../fixtures.md`: the crew log, row C1; Deer Creek's "Before" figures, its reporting periods and its breakdown questions. No fixture has a breakdown question that arrives unanswered (S7): rows C1, C5 and C6 all arrive holding Planting.
Reset: not known (Q-88). The script leaves one entry on Deer Creek.

| # | Do this | You should see |
|---|---|---|
| 1 | Look at the first change, "Acres of riparian habitat restored · 2025" | "Amount (acres)" holding 5.5, "Reporting period" holding 2025, "Riparian treatment" holding Planting |
| 2 | Open "Reporting period" | 2025, 2024, 2023, in that order; no 2026 or 2027 |
| 3 | Pick 2024 | The field holds 2024 |
| 4 | Open "Riparian treatment" | Planting, Invasive removal, Natural recruitment |
| 5 | Pick Natural recruitment | The field holds Natural recruitment |
| 6 | Change the amount to 5 | The field holds 5; the change is still ticked and still first in the list |
| 7 | Untick the other five changes and press "Add 1 change" | The Deer Creek project page |
| 8 | Look at "Acres of riparian habitat restored" on the Performance measures card | 39.1; the other six figures are the "Before" column |
| 9 | Open that measure's entries | An entry of 5 acres under 2024, with Riparian treatment: Natural recruitment |

On the prototype: press "Sample crew log"; see `../fixtures.md`, On the prototype. After step 3 the prototype's label still reads "· 2025" (Q-114).

## Open questions

- Q-32 — R6: if every proposed value is to be editable, a Key facts change and a contact gain fields, and R6 changes.
- Q-43 — R3 and S3: what the change offers when the project has no closed reporting period; no scenario covers it yet.
- Q-82 — S2 and S8: the counts on the action.
- Q-88 — the Reset line, and how the recorded reading is served for the Preconditions.
- Q-90 — R5 and S7: whether a breakdown answer may arrive inferred; it also decides rows C5 and P3 of `../fixtures.md`.
- Q-113 — would change R2, S1 and S2: decimals and an upper limit for an amount, and whether the field shows separators (story 01, R8: the field arrives as plain digits, 1850).
- Q-114 — would change R3 and add a scenario: what a change shows and saves when the reading's reporting period is not one the project offers; whether the label follows the period picked.
- Q-115 — would change R4 and R5: a way to set a breakdown answer back to unanswered; an answer that is not one of the question's options.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | ACN-12; relies on story 01, RUL-75 |
| R2 | decided; shown | ACN-12; RUL-115, RUL-117 |
| R3 | shown | RUL-40; RUL-116 |
| R4 | shown | RUL-41; RUL-117 |
| R5 | shown | RUL-41 |
| R6 | shown | RUL-38 |
| R7 | shown | RUL-118 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the measure change's fields at 805-808; the breakdown choices at 347-352 and 878-888; the amount and the list of periods at 890-908; what is read on Add at 947 and 1013-1025); `src/pages/prototypes/projects/[project]/import-report.astro` (which periods the page is given, 55); `src/data/firma2-performance-measures.ts` (retired options and questions left out, 76-77 and 598-599).
- Data shapes, as the prototype models them: a proposed measure entry holds the measure, the year of its reporting period, the amount and answers keyed by breakdown question.
- What the prototype does where nothing is decided (not requirements): it saves an amount with every decimal typed, sets no upper limit, and reads "1e3" as 1000 (Q-113); a reading's period that is not offered leaves "Reporting period" looking empty while the entry is still saved under that period, and the change's label keeps the period it arrived with after another is picked (Q-114); neither choice has an empty option, because of the select component used, so an answer cannot be cleared; an answer that is not an option leaves the choice looking empty and is saved all the same (Q-115).
- Do not copy: the periods and breakdown questions passed into the page from seed data; the entry saved to a browser-local store; "Use suggestion" as a way to fill a change, which was struck (Q-25).

</details>
