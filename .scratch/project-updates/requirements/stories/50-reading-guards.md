# 50 — Reading guards: what the model returns is checked against the project in code

Type: enabler
Epic: B — What a report can change
Release: later
Status: needs-info
Revision: 1
Blocked by: 02, 07, 14, 15, 19
Covers: RUL-78, RUL-216, RUL-217, RUL-218, RUL-219, RUL-220, RUL-221
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report` (developer-machine reader only); no spec decision; interview 2026-11-23, Q-62
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n)

Can start: nothing in the first release; this enabler is `later`. When it is taken up: R1 to R7, once enabler 02 exists and stories 07, 14, 15 and 19 are built (the breakdown choices, the flagged change, Key facts changes and "Not used" are theirs, used here). Every requirement here is what the developer-machine reader does, confirmed as a requirement for a later release and not otherwise written down. Waiting: the parts marked "Not decided" or "open", each on the question named beside it.

## Capability

This enabler adds checks in code to the reading (enabler 02). What goes in: what the model returned for one document, and what the project can take (its performance measures, their breakdown questions and options, its closed reporting periods, and the Key facts fields offered with their formats). What comes back: the same reading with whatever does not fit the project removed, moved to "Not used", or flagged. It unblocks nothing in the first release, which relies on the person checking each change (Q-62); once built, stories 14, 15 and 19 receive readings that have passed these checks. Split from enabler 26 on 2026-11-23, which keeps the checks on units.

## Description

The reading has a model read the document and map it to the project (enabler 02). A model can return something the project cannot hold: a measure it is not asked, a year it has no reporting period for, an answer that is not an option. This enabler is the code that catches those before the person sees any change. The checks exist only in the developer-machine reader, and were confirmed as requirements for a later release (Q-62).

## Requirements

R1. A figure the model returns for a performance measure the project is not asked is not proposed as a change. It is added to "Not used", after the lines the model listed there, as "`<figure>` `<unit as the document writes it>`: `<the words read>`". A measure is the project's when the model's name for it is the measure's name, or differs only in case, in characters that are not letters, or in a final s.

R2. A figure the model files under a year that is not one of the project's closed reporting periods is proposed under the latest closed reporting period, and "`<year>` is not a reporting period on this project, so this is under `<latest>`." is added after any note the reading gave. A change the reading called a match is then flagged as a change with two readings is (story 14, R4), its amount kept; one the reading had already flagged keeps its flag and gets the note too. Not decided: a project with no closed reporting period (Q-43).

R3. A breakdown answer the model returns is kept only when it names one of the measure's breakdown questions and one of that question's options, each letter for letter. Otherwise the change arrives with that question unanswered; it is not flagged for this. Not decided: whether the person is told that an answer was dropped (Q-149).

R4. A Key facts change is proposed only for a field the project offered to the reading. One for any other field is dropped. Not decided: whether it is listed under "Not used" instead (Q-150).

R5. A Timeline is proposed only when it is two years, each from 1900 to 2099; otherwise it is dropped, as in R4. No other field's value is checked. Not decided: a first year later than the second, and the check for every other kind of field (Q-71).

R6. A change the model marks as low-confidence does not arrive ticked: a performance measure change the reading called a match, or a Key facts change, is flagged: it arrives unticked with its value kept, as a figure with two readings does (story 14, R4), and no note says why. No confidence is shown to the person. Not decided: whether the reading keeps a confidence at all (Q-66), and what tells the person why such a change waits (Q-149).

R7. Each check runs on every change, with the unit checks of enabler 26. A change that trips several is flagged once and carries every note, in this order: the reading's own, the unit's (once enabler 26 is built), the reporting period's. A change that counts something else (story 14, R3) stays so whatever else applies.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- A figure in another unit: converting it, or flagging it — enabler 26.
- The model reading and mapping the document, and what passes to and from it — enabler 02.
- What the person sees and does with a flagged change — story 14.
- The "Not used" list — story 19.
- Which Key facts fields a project offers — story 15.

## Needs to know from elsewhere

- The reading is handed the project's performance measures with their breakdown questions and options, its closed reporting periods, and each Key facts field offered with its format; it returns proposed changes, "Not used" lines and "Skipped" lines — owned by enabler 02.
- An entry can be filed only under a closed reporting period — owned by `performance-measures`; story 07 holds the rule on the check step, and that a breakdown question may arrive unanswered for the person to set or leave (R3, R5).
- A change is ready or flagged; a ready change arrives ticked and a flagged one unticked — owned by stories 06 and 14. A change with two readings arrives with one reading in its amount; one that counts something else arrives with its amount empty — story 14 (R3, R4).
- What the document says that the import did not use is listed under "Not used", one line each — owned by story 19. Its fixture line "Watershed: South Fork American River. This project has no Watershed field." is the model's own line, not this enabler's.
- A figure in another unit is converted or flagged, and its note comes before the reporting period's — owned by enabler 26 (R7, R8).

## Scenarios

No recorded reading in `../fixtures.md` shows these checks: each recording is a reading that already fits Deer Creek. Each scenario describes what the model returns by kind, against Deer Creek as the fixture has it.

**S1 — A measure the project is not asked** (proves R1)
- Given the model returns a figure for a performance measure that is not one of Deer Creek's seven
- When the reading comes back
- Then no change is proposed for it, and "Not used" ends with a line made of the figure, its unit as written, a colon and the words read

**S2 — A year that is not a reporting period** (proves R2)
- Given Deer Creek's closed reporting periods are 2025, 2024 and 2023, and the model files a figure under 2021
- When the reading comes back
- Then the change is under 2025 and flagged, its amount holds the figure, and its note reads "2021 is not a reporting period on this project, so this is under 2025."

**S3 — A breakdown answer that is not an option** (proves R3)
- Given "Riparian treatment" offers Planting, Invasive removal and Natural recruitment, and the model answers it with a word that is none of the three
- When the reading comes back
- Then the change for "Acres of riparian habitat restored" arrives with "Riparian treatment" unanswered, and it is ready

**S4 — A field the project did not offer** (proves R4)
- Given Deer Creek has no Watershed field, and the model returns a Key facts change for Watershed
- When the reading comes back
- Then no change is proposed for Watershed, and this check adds no line to "Not used"

**S5 — A value in the wrong format** (proves R5)
- Given the Timeline is two years, and the model returns a Timeline that is one year
- When the reading comes back
- Then no change is proposed for the Timeline

**S6 — A low-confidence figure** (proves R6)
- Given the model calls one figure a match and marks it low-confidence
- When the reading comes back
- Then that change is flagged and not ticked, its amount holds the figure, and nothing on it shows a confidence

**S7 — A flagged change that also trips a check** (proves R7)
- Given the model returns a figure it says supports two readings, with a note of its own, and files it under 2021
- When the reading comes back
- Then the change is under 2025 and flagged once, and its note is the model's own followed by "2021 is not a reporting period on this project, so this is under 2025."

## Verification

Not runnable yet: no fixture holds a model answer with these cases. The steps are written against one made for the purpose, described under Test data, and stop at the cases a screen can show.

Preconditions: this enabler and enabler 02 are built; stories 07, 14, 15 and 19 are built, and with them 01, 04 and 06, so the check step shows the changes, their ticks, the reporting period, the flags and "Not used". Signed in as someone who can edit Deer Creek, which is in its starting state.
Test data: a recorded model answer for one document, holding: a figure for a measure Deer Creek is not asked; a figure filed under 2021; an answer to "Riparian treatment" that is not one of its options. `../fixtures.md` has none, so one is made for the purpose.
Reset: none needed if you leave by the breadcrumb without adding. Otherwise not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | On Deer Creek, open Import a report, choose the document and press "Read it" | The check step |
| 2 | Look for a change for the measure Deer Creek is not asked | None; "Not used" lists the figure |
| 3 | Find the change whose figure was filed under 2021 | Its reporting period is 2025; it is flagged and not ticked, with the note "2021 is not a reporting period on this project, so this is under 2025." |
| 4 | Find the change for "Acres of riparian habitat restored" | "Riparian treatment" has no answer chosen |

## Open questions

- Q-43 — R2: with no closed reporting period there is no "latest" to file under; the answer says what the check does then.
- Q-61 — R2, R6 and R7: if the flagged states become one, whether a kept amount and an empty one both survive.
- Q-66 — R6 and S6: if the reading keeps no confidence, R6 goes.
- Q-71 — R5 and S5: what the first release does with a value that does not fit its field may decide whether this check drops the change, as stated, or flags it; and which fields beside the Timeline are checked.
- Q-88 — the Reset line, and how a recorded model answer is served.
- Q-149 — would change R3 and R6: each would add a note to the change, and R3 might flag it.
- Q-150 — would change R4, R5, S4 and S5: a Key facts change turned away would become a "Not used" line.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown, developer-machine reader only | RUL-78, RUL-216 |
| R2 | shown, developer-machine reader only | RUL-78, RUL-217 |
| R3 | shown, developer-machine reader only | RUL-78, RUL-218 |
| R4 | shown, developer-machine reader only | RUL-78; RUL-219 |
| R5 | shown, developer-machine reader only | RUL-78, RUL-219 |
| R6 | shown, developer-machine reader only | RUL-78, RUL-220 |
| R7 | shown, developer-machine reader only | RUL-221 |

The six of RUL-78 were confirmed as requirements for a later release (interview 2026-11-23, Q-62).

- Prototype files: `scripts/report-reader.mjs` (a measure not asked, 365-367; the order of the checks and their notes, 372-391; breakdown answers, 395-399; Key facts fields and the Timeline's format, 419-435; how two names are compared, 169-174 and 337; runs on a developer's machine only).
- Data shapes, as the prototype models them: for each proposed figure the model returns the measure by name, the year, breakdown answers, a verdict (match, needs a decision, no match) and a confidence; for each Key facts change, the field and the value.
- What the reader does where nothing is decided (not requirements): with no closed reporting period the "latest" is not a year at all (Q-43); a dropped breakdown answer and a low-confidence flag leave no trace (Q-149); a Key facts change for a field not offered vanishes, while the funder report sample lists one under "Not used" in the model's words (Q-150). The reader also sorts the changes, ready first, then two readings, then counts something else (lines 441-443): that is the order of the reading, enabler 02 and Q-67, not a check.
- Do not copy: the developer-machine reader itself, which calls a model through one person's local login; the "Check this" and "Unsure" badges the prototype draws from a confidence (struck, Q-25).

</details>
