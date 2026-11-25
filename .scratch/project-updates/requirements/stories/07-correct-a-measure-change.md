# 07 — A Contributor corrects a performance measure change before adding it

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-32, Q-90, Q-113, Q-114, Q-115
Revision: 1
Blocked by: 06
Covers: ACN-12, RUL-38, RUL-40, RUL-41, RUL-115, RUL-116, RUL-117, RUL-118, RUL-268, RUL-269, RUL-270, RUL-271, RUL-217, RUL-218
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #13
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R7, on the check step of stories 01, 04 and 06 (the list, the selection and the checkbox are used here, not built here), against the recorded sample `deer-creek-crew-log-2025.xlsx`. Built here, not showable until a later story: R3's empty "Reporting period" for a period the project does not offer (story 14 lists the change; story 30 stops it); what "Add N changes" does with an amount the measure cannot take (story 30); R6 for a Key facts change and a contact (stories 15 and 18).

## Story

As a Contributor, I want to change a proposed performance measure entry's amount, reporting period and breakdown answers before I add it, so that what goes on the record is right even where the reading or the report was not.

## Description

On the check step a performance measure change is not a fixed line: its figure, the reporting period it is filed under and its answers to the measure's breakdown questions can each be corrected in place. The person does this after checking the change against the document (story 04) and before pressing "Add N changes". What they leave in the fields is what is saved. Figures can be corrected here; facts and people (a Key facts change, a contact) are taken or left, which amends spec #13 ("every proposed value is editable"). That a figure was changed is also recorded with the import: enabler 36. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample crew log.

## Requirements

R1. A performance measure change shows its values as fields the person can edit, whatever state the change is in and whether or not it is ticked: "Amount (`<unit>`)", with the measure's unit, or "Amount" for a measure with none; "Reporting period"; and one choice per breakdown question the measure asks, labelled with the question. Each arrives holding what the reading proposed. The amount arrives with thousands separators and a decimal point where the figure has one: "1,850", "5.5".

R2. What the fields hold when "Add N changes" is pressed is what is saved as the entry: the amount, the reporting period and each breakdown answer given. A question left unanswered saves no answer.
- An amount is digits, thousands separators and at most one decimal point. Separators can be typed or left out; when the person leaves the field it shows them. Nothing the person types is changed for them beyond that: a figure is never rounded.
- An amount the measure cannot take (zero or less, more decimals than the measure allows, a currency sign or other characters) is refused when "Add N changes" is pressed, not while typing (story 30, R2).
- The amount can be cleared. Clearing it does not untick the change; a ticked change with no amount is stopped on "Add N changes" (story 30, R2).

R3. "Reporting period" offers the project's closed reporting periods and no other, newest first, each by its name. Once it holds a period the person can pick another but cannot clear it. It arrives holding the period the reading proposed, or empty when the report's period is not one the project offers. The change's label follows the period picked: "`<Measure>` · `<reporting period>`".

R4. Each breakdown choice offers that question's options as the measure has them now, and an empty choice, so an answer can be set back to unanswered. A question or an option the measure has retired is not offered.

R5. A breakdown question arrives answered only when the document states one of its options; otherwise it arrives unanswered, for the person to set or leave. Nothing is inferred. When the document gives an answer that is not one of the question's options, the question arrives unanswered and a note on the change reads "The report says “`<answer>`”, which is not an option."; the change stays ready.

R6. Of the four kinds of change, the person can edit two before adding: a performance measure change (amount, reporting period, breakdown answers) and a funding source change (grant or program, organization, amount). A Key facts change and a contact have no fields: they can only be ticked or left out, and a wrong one is left out and typed on the project page.

R7. An edit changes the field it is made in and nothing else on the check step, apart from the label in R3. It does not tick or untick the change, move it in the list, or change its badge; an edit to an unticked change is kept, and is what is saved if the change is ticked later.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Recording that a figure was changed from the document's, or filled in after arriving empty — enabler 36.
- Every check made when "Add N changes" is pressed, and its messages: an amount above zero, the measure's decimal places, "Pick a reporting period." — story 30.
- A change that arrives with an empty amount or an empty reporting period, its badge and sentence, and the one edit that does tick a change: a figure typed into it — story 14.
- A project with no closed reporting period: its figures are never proposed as changes — story 19 (R2).
- The funding source change's fields — story 17. The Key facts change — story 15. The contact — story 18.
- "Already on file" after an edit, which is worked out again when "Add N changes" is pressed — story 32 (R5).
- Two changes edited into the same measure and reporting period: each is saved as its own entry — story 01 (R11).

## Needs to know from elsewhere

- "Add N changes" saves each ticked change as a new entry and returns the person to the project page — owned by stories 01 and 06.
- A breakdown answer is not required: a change can be added with a question left unanswered. A reporting period is required — owned by story 30.
- The reading proposes only a reporting period it was given, and answers a breakdown question only with what the document states — owned by enabler 02 (R5, R6). The check step, not the reading, tests the period and the answer against what the project offers; those two tests were brought forward from enabler 50 (`later`).
- The project's closed reporting periods and their names, each measure's unit and decimal places, the breakdown questions it asks and their options, where one entry can be seen, and the figure the card shows (the sum of the measure's entries) — owned by `performance-measures`. This story asks for those lists when the check step opens and nothing else.
- Showing a Manager that a figure was changed — owned by `publish-review`, build 2.

## Scenarios

S1 to S10 and S12 run against the recorded sample `deer-creek-crew-log-2025.xlsx` (`../fixtures.md`). No sample holds an answer that is not an option (S11): its document is described by kind. R3's empty arrival is proven in story 14, and R6 in story 15 (a Key facts change has no fields) and story 18 (a contact has none).

**S1 — The fields of a measure change** (proves R1)
- Given the check step lists the crew log's six changes
- When the Contributor looks at C1
- Then it has "Amount (acres)" holding 5.5, "Reporting period" holding 2025, and a choice "Riparian treatment" holding Planting

**S2 — A corrected amount is what is saved** (proves R2)
- Given C2's amount arrived as "1,850", all six changes are ticked, and Deer Creek's figures are the fixture's "Before" column
- When the Contributor changes C2's amount to 1800 and presses "Add 6 changes"
- Then "Native trees and shrubs planted" on the project page reads 12,527

**S3 — Separators are shown, typed or not** (proves R1, R2)
- Given C2's amount holds "1,850"
- When the Contributor types 12500 in it and moves to another field
- Then the field holds "12,500"

**S4 — Only closed reporting periods are offered** (proves R3)
- Given Deer Creek's closed reporting periods are 2025, 2024 and 2023, and 2026 and 2027 are open
- When the Contributor opens "Reporting period" on C2
- Then 2025, 2024 and 2023 are offered, in that order, and nothing else: no 2026, no 2027 and no empty choice

**S5 — A changed reporting period is where the entry is filed** (proves R2)
- Given C2 is proposed for 2025
- When the Contributor picks 2023 on C2 and adds the changes
- Then the entry of 1,850 plants is on the record under 2023 and not under 2025

**S6 — The label follows the period picked** (proves R3)
- Given C2's label reads "Native trees and shrubs planted · 2025"
- When the Contributor picks 2023 in its "Reporting period"
- Then the label reads "Native trees and shrubs planted · 2023"

**S7 — The question's own options** (proves R4)
- Given "Acres of riparian habitat restored" asks "Riparian treatment" with the options Planting, Invasive removal and Natural recruitment
- When the Contributor opens "Riparian treatment" on C1
- Then those three options are offered, and an empty choice

**S8 — A changed answer is what is saved** (proves R2)
- Given C1 arrived with "Riparian treatment" holding Planting
- When the Contributor picks Natural recruitment on C1 and adds the changes
- Then the entry of 5.5 acres on the record carries Riparian treatment: Natural recruitment

**S9 — An answer the document does not state** (proves R5)
- Given the crew log's row 12 gives 140 hours and states none of the options of "Activity type"
- When the check step opens
- Then C5's "Activity type" arrives unanswered, and C5 is ticked

**S10 — An answer set back to unanswered** (proves R4, R2)
- Given C6 arrived with "Riparian treatment" holding Planting
- When the Contributor picks the empty choice on C6 and adds the changes
- Then the entry of 2 acres under 2024 is on the record with no answer to "Riparian treatment"

**S11 — An answer that is not an option** (proves R5)
- Given a measure that asks one breakdown question, and a reading in which the document's answer to it is not one of the question's options
- When the check step opens
- Then the choice arrives unanswered, a note on the change reads "The report says “`<answer>`”, which is not an option.", and the change is ticked

**S12 — An edit to an unticked change is kept** (proves R7)
- Given the Contributor has unticked C2, and the action reads "Add 5 changes"
- When they change C2's amount to 1800
- Then C2 is still unticked, the action still reads "Add 5 changes", and after they tick C2 its amount still holds "1,800"

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). The test environment serves the recorded sample `deer-creek-crew-log-2025.xlsx`. Stories 01, 04 and 06 are built.
Test data: `../fixtures.md`: the crew log, rows C1, C2 and C5; Deer Creek's "Before" figures, its reporting periods and its breakdown questions.
Reset: reset the sample project in the test environment. The script leaves one entry on Deer Creek.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import a report", choose `deer-creek-crew-log-2025.xlsx`, press "Read it" and wait; look at the first change, "Acres of riparian habitat restored · 2025" | "Amount (acres)" holding 5.5, "Reporting period" holding 2025, "Riparian treatment" holding Planting |
| 2 | Look at "Native trees and shrubs planted · 2025" and at "Volunteer hours contributed · 2025" | The first amount reads "1,850"; on the second, "Activity type" is unanswered |
| 3 | On the first change, open "Reporting period" | 2025, 2024, 2023, in that order; no 2026 or 2027 |
| 4 | Pick 2023 | The field holds 2023 and the change's label reads "Acres of riparian habitat restored · 2023" |
| 5 | Open "Riparian treatment" | Planting, Invasive removal, Natural recruitment, and an empty choice |
| 6 | Pick Natural recruitment | The field holds Natural recruitment |
| 7 | Change the amount to 5 | The field holds 5; the change is still ticked and still first in the list |
| 8 | Untick the other five changes and press "Add 1 change" | The Deer Creek project page |
| 9 | Look at "Acres of riparian habitat restored" on the Performance measures card | 39.1; the other six figures are the "Before" column |
| 10 | Open that measure's entries | An entry of 5 acres under 2023, with Riparian treatment: Natural recruitment |

On the prototype: press "Sample crew log"; see `../fixtures.md`, On the prototype. There the amounts arrive as plain digits, C5 arrives holding Planting, the choices have no empty choice, and after step 4 the label still reads "· 2025".

## Open questions

None open. The proposals this story rests on:

- Q-113 (proposed) — R1, R2, S3: separators shown and accepted; digits, separators and one decimal point; never rounded.
- Q-114 (proposed) — R3, S6: an empty "Reporting period" for a period the project does not offer; the label follows the period picked.
- Q-115 (proposed) — R4, R5, S10, S11: an empty choice; an answer that is not an option arrives unanswered with a note.
- Q-90 (proposed) — R5, S9: no inferred answers; row C5 arrives unanswered.
- Q-32 (proposed) — R6: a Key facts change and a contact are taken or left, not edited; amends spec #13.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown; proposed (Q-113) | ACN-12; relies on story 01, RUL-75; RUL-268 |
| R2 | decided; shown; proposed (Q-113) | ACN-12; RUL-115, RUL-117; RUL-268 |
| R3 | shown; proposed (Q-114) | RUL-40, RUL-116; RUL-217 |
| R4 | shown; proposed (Q-115) | RUL-41, RUL-117; RUL-269 |
| R5 | shown; proposed (Q-90); proposed (Q-115) | RUL-41; RUL-270; RUL-218 |
| R6 | shown; proposed (Q-32) | RUL-38; RUL-271 |
| R7 | shown | RUL-118 |
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the measure change's fields at 805-808; the breakdown choices at 347-352 and 878-888; the amount and the list of periods at 890-908; what is read on Add at 947 and 1013-1025); `src/pages/prototypes/projects/[project]/import-report.astro` (which periods the page is given, 55); `src/data/firma2-performance-measures.ts` (retired options and questions left out, 76-77 and 598-599).
- Data shapes, as the prototype models them: a proposed measure entry holds the measure, the year of its reporting period, the amount and answers keyed by breakdown question.
- Where the prototype differs from the requirements above: the amount arrives as plain digits and shows no separators; it saves an amount with every decimal typed and reads "1e3" as 1000; a reading's period that is not offered leaves "Reporting period" looking empty while the entry is still saved under that period, and the label keeps the period it arrived with; neither choice has an empty option, because of the select component used; an answer that is not an option leaves the choice looking empty and is saved all the same; rows C5 and P3 arrive with an inferred answer.
- Do not copy: the periods and breakdown questions passed into the page from seed data; the entry saved to a browser-local store; "Use suggestion" as a way to fill a change, which was struck (Q-25).

</details>
