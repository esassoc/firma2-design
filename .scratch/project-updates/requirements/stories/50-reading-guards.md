# 50 — Reading guards: what the model returns is checked against the project in code

Type: enabler
Epic: B — What a report can change
Release: later
Status: needs-triage
Built on proposals awaiting validation: Q-33, Q-61, Q-66, Q-98, Q-149, Q-150
Revision: 1
Blocked by: 02, 07, 14, 15, 19
Covers: RUL-78, RUL-216, RUL-219, RUL-220, RUL-221
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report` (developer-machine reader only); no spec decision; interview 2026-11-23, Q-62
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n)

Can start: nothing in the first release; this enabler is `later`. When it is taken up: R1 to R4, once enabler 02 exists and stories 07, 14, 15 and 19 are built (the flagged change, Key facts changes and "Not used" are theirs, used here). Waiting: a recorded model answer that trips these checks, which is to be made (see Verification). Nothing waits on a question.

Renumbered on 2026-11-23, when three checks moved to the first release. Old to new: R1 is R1; R2 left (stories 07, 14 and 30); R3 left (story 07); R4 is R2; R5 left (story 15); R6 is R3; R7 is R4.

## Capability

This enabler adds checks in code to the reading (enabler 02). What goes in: what the model returned for one document, and what the project can take (its performance measures and the Key facts fields it offered). What comes back: the same reading with whatever does not fit the project moved to "Not used", or flagged. It unblocks nothing in the first release; once built, stories 14, 15 and 19 receive readings that have passed these checks. The checks on units are enabler 26.

## Description

The reading has a model read the document and map it to the project (enabler 02). A model can return something the project cannot hold. The first release already catches three such cases on the check step, in code, and this enabler does not repeat them: a reporting period the project does not offer, a breakdown answer that is not an option, and a Key facts value that does not fit its field (see Needs to know). What is left for later is here: a measure the project is not asked, a Key facts field the project did not offer, and a figure the model itself is not confident of. These checks exist only in the developer-machine reader, and were confirmed as requirements for a later release (Q-62).

## Requirements

R1. A figure the model returns for a performance measure the project is not asked is not proposed as a change. It is listed under "Not used", after the items the model listed there, in the report's own words and with the reason that no performance measure asks for it, as story 19 words that reason. A measure is the project's when the model's name for it is the measure's name, or differs only in case, in characters that are not letters, or in a final s.

R2. A Key facts change is proposed only for a field the project offered to the reading. One for any other field is not dropped: it is listed under "Not used", after the reading's own items, as "`<Field>`: `<value>`. This project has no `<Field>` field."

R3. A change the model is not confident of does not arrive ticked, and the person is told why. The confidence is internal to the reading: no level is shown to the person and none is stored on a change.
- A performance measure figure the reading otherwise settled arrives flagged as story 14 has it: unticked, "Needs you", with the note "The reading wasn't sure of this figure. Check it against the document." Its amount is empty, as for any figure that is not settled; the figure is in the quote.
- A Key facts change, which has nothing to fill, arrives unticked with "Needs you", its value shown, and the same note with "value" in place of "figure". The person ticks it or leaves it out.

R4. Each check runs on every change, with the unit checks of enabler 26. A change that trips several is flagged once, carries one badge and shows every sentence, in this order: the reading's own, the unit's (once enabler 26 is built), the low-confidence note. A change the reading did not settle stays so whatever else applies.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- A figure in another unit: converting it, or flagging it — enabler 26.
- The model reading and mapping the document, and what passes to and from it — enabler 02.
- What the person sees and does with a flagged change — story 14.
- The "Not used" list and its fixed set of reasons — story 19.
- Which Key facts fields a project offers — story 15.

## Needs to know from elsewhere

Three checks that were this enabler's are in the first release, each made in code on the check step. This enabler no longer states them:

- A reporting period the project does not offer: the change arrives with "Reporting period" empty (story 07, R3), flagged and unticked with its amount kept (story 14, R10), and cannot be added until a period is picked (story 30, R2). It is never filed under the latest period, which is what the developer-machine reader did.
- A breakdown answer that is not one of the question's options: the question arrives unanswered, with the note "The report says “`<answer>`”, which is not an option."; the change stays ready (story 07, R5).
- A Key facts value that does not fit its field, a one-year Timeline among them: it is never proposed and is listed under "Not used" with its reason (story 15; the reasons are story 19's).

Also:

- The reading is handed the project's performance measures with their breakdown questions and options, its closed reporting periods, and each Key facts field offered; it returns proposed changes, "Not used" items and "Skipped" items — enabler 02.
- A change is ready or flagged; a flagged change carries the one badge "Needs you" and arrives unticked; a figure that is not settled arrives with its amount empty — stories 06 and 14 (R2 to R5).
- A Key facts change can be ticked or left out, not edited — story 07 (R6) and story 15.
- "Not used" lists each item in the report's words with a reason worded by the product, a line shown once however often it is returned — story 19 (R1, R2). The sample line "Watershed: South Fork American River. This project has no Watershed field." is the reading's own item; R2 writes the same form for a field the model proposed as a change.
- A figure in another unit is converted or flagged, and its sentence comes before the low-confidence note — enabler 26 (R7, R8).

## Scenarios

No recorded sample in `../fixtures.md` shows these checks: each recording is a reading that already fits Deer Creek. Each scenario describes what the model returns by kind, against Deer Creek as the fixture has it.

**S1 — A measure the project is not asked** (proves R1)
- Given the model returns a figure for a performance measure that is not one of Deer Creek's seven
- When the reading comes back
- Then no change is proposed for it, and "Not used" lists it after the reading's own items, in the report's words, with the reason that no performance measure asks for it

**S2 — A field the project did not offer** (proves R2)
- Given Deer Creek has no Watershed field, and the model returns a Key facts change for Watershed with the value South Fork American River
- When the reading comes back
- Then no change is proposed for Watershed, and "Not used" ends with "Watershed: South Fork American River. This project has no Watershed field."

**S3 — A figure the model is not confident of** (proves R3)
- Given the model returns a settled figure for one of Deer Creek's measures and marks it low-confidence
- When the reading comes back
- Then that change is unticked with "Needs you", its amount is empty, it reads "The reading wasn't sure of this figure. Check it against the document.", and nothing on it shows a level of confidence

**S4 — A Key facts value the model is not confident of** (proves R3)
- Given the model returns a County for Deer Creek that differs from the record's and marks it low-confidence
- When the reading comes back
- Then the change is unticked with "Needs you", shows its value, and carries the low-confidence note

**S5 — A change that trips more than one check** (proves R4)
- Given the model returns a figure it did not settle, with a reason of its own, and also marks it low-confidence
- When the reading comes back
- Then the change is flagged once, with one badge, and shows the reading's reason followed by the low-confidence note

## Verification

Not runnable yet: no sample holds a model answer with these cases. One is to be made when this enabler is taken up, as described under Test data. The steps stop at the cases a screen can show.

Preconditions: this enabler and enabler 02 are built; stories 07, 14, 15 and 19 are built, and with them 01, 04 and 06, so the check step shows the changes, their ticks, the badge and "Not used". Signed in as someone who can edit Deer Creek, which is in its starting state. The test environment serves the model answer described below, before these checks are applied.
Test data: a recorded model answer for one document (to be made), holding: a figure for a measure Deer Creek is not asked; a Key facts change for a field Deer Creek does not have; a settled figure for one of Deer Creek's measures marked low-confidence.
Reset: none needed if you leave by the breadcrumb without adding. Otherwise reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | On Deer Creek, open Import a report, choose the document and press "Read it" | The check step |
| 2 | Look for a change for the measure Deer Creek is not asked | None; "Not used" lists the figure with the reason that no performance measure asks for it |
| 3 | Look for a change for the field Deer Creek does not have | None; "Not used" ends with a line naming the field, its value, and "This project has no `<Field>` field." |
| 4 | Find the change whose figure was marked low-confidence | Unticked, "Needs you", an empty amount, and "The reading wasn't sure of this figure. Check it against the document." |

## Open questions

None open. The enabler rests on these proposed answers:

- Q-98 (proposed) — R1: the item is in the report's words and the reason is one of story 19's fixed set, worded by the product.
- Q-150 (proposed) — R2: a field the project did not offer is listed under "Not used", not dropped.
- Q-149 (proposed) — R3: the low-confidence note.
- Q-66 (proposed) — R3: confidence is internal, never shown or stored.
- Q-33 (proposed) — R3: a figure that is not settled arrives with its amount empty, a low-confidence one included.
- Q-61 (proposed) — R3, R4: the one badge, "Needs you".

Three more proposals took checks out of this enabler: Q-114 (the reporting period), Q-115 (the breakdown answer), Q-71 with Q-125 (a Key facts value that does not fit). If the user disagrees with one, its check comes back here.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown, developer-machine reader only; proposed (Q-98) | RUL-78, RUL-216 (reworded: the line is the report's words and a fixed reason) |
| R2 | proposed (Q-150) | RUL-78; RUL-219 (reworded: listed under "Not used"; the Timeline half left for story 15) |
| R3 | shown, developer-machine reader only; proposed (Q-149, Q-66, Q-33, Q-61) | RUL-78, RUL-220 (reworded: the note; the amount is empty) |
| R4 | shown, developer-machine reader only; proposed (Q-61) | RUL-221 (reworded: no reporting period note) |
The checks of RUL-78 were confirmed as requirements for a later release (interview 2026-11-23, Q-62); three of them were then brought into the first release by Q-71, Q-114 and Q-115.

- Left this enabler's Covers: RUL-217 (the reporting period; reversed by Q-114) and RUL-218 (the breakdown answer; now story 07).
- Prototype files: `scripts/report-reader.mjs` (a measure not asked, 365-367; the order of the checks and their notes, 372-391; Key facts fields, 419-435; how two names are compared, 169-174 and 337; runs on a developer's machine only).
- Data shapes, as the prototype models them: for each proposed figure the model returns the measure by name, the year, breakdown answers, a verdict and a confidence; for each Key facts change, the field and the value.
- Do not copy: the developer-machine reader itself, which calls a model through one person's local login; a figure for a year the project does not offer filed under the latest period; a Key facts change for a field not offered vanishing without a line; a low-confidence flag that leaves no trace and keeps its figure in the amount; the "Check this" and "Unsure" badges the prototype draws from a confidence (struck, Q-25).

</details>
