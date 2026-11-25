# 15 — A Contributor adds Key facts the report names

Type: story
Epic: B — What a report can change
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-32, Q-48, Q-51, Q-65, Q-71, Q-87, Q-99, Q-124, Q-125
Revision: 1
Blocked by: 04, 02, 32, 19
Covers: STA-37, RUL-6, RUL-43, RUL-66, RUL-79, RUL-147, RUL-148, RUL-149, RUL-150, RUL-151, RUL-305, RUL-306, RUL-307, RUL-308, RUL-309, RUL-310
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #9; interview 2026-11-23, Q-21 and Q-27
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R9, on a check step where stories 04, 06, 19 and 32 are built (the groups, the checkbox, the "Needs you" badge, "Already on file" and the "Not used" list are used here, not built here), against the recorded samples `deer-creek-key-facts-2025.pdf` and `deer-creek-timeline-update-2026.pdf`, which stand in for enabler 02 until it is built. Waiting: R3 for a custom field, on `custom-fields`.

## Story

As a Contributor, I want the Timeline and the other Key facts a report names offered as changes, so that the project's record matches the report without my retyping each field.

## Description

Story 01 adds performance measure entries. This story adds the second kind of change, a value for a Key facts field, and sets the limit on what an import may ever propose. On the check step of Import a report, Key facts changes are the first group. A Key facts change is taken or left: it has no field to type in. Once added, the field on the project page holds the value read. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report; the prototype builds Timeline and County only.

## Requirements

R1. An import proposes four kinds of change only: performance measure entries, Key facts, funding sources and contacts. It never proposes a change to the project's description, stage, photos or tags, whatever the report says about them.

R2. When the report states the project's timeline, the import proposes a change to the Timeline field. A Timeline is a start year and a completion year, written "2023–2025", and a Timeline change sets both.
- The reading gives only the year or years the report states. When the report states one, the other is taken from the record's Timeline, and the change shows both years.
- When the report states one year and the record has no Timeline, no change is proposed: the statement is handed to the "Not used" list with the reason that there is no other year to pair it with (story 19).
- A pair that would end before it starts does not fit the field (R9).

R3. When the report names a value for a Key facts field the project has, the import proposes a change to it, labelled with the field's name as the workspace has it. The fields are Timeline, County, Estimated total cost, any other built-in Key facts field that holds a single value, and the workspace's custom fields. An import never sets the stage, the project type or the lead organization: what the report says of them is handed to the "Not used" list (story 19).

R4. A named attribute the project has no field for is not proposed as a change.

R5. A Key facts change is listed under Key facts, labelled with the field's name ("Timeline", "County"), and shows the value read as text.
- It has no field: the person can tick it or leave it out, and cannot edit the value. A wrong value is left out and typed on the project page.
- When it replaces a value, the record's value is shown beside it as "Was `<the record's value>`": "2023–2025 Was 2023–2027". Nothing else is said of the value being replaced, whoever or whatever set it. When the field is empty on the record, no "Was …" is shown.
- When the reading returns the same value for one field twice, they are one change: it shows the first place's quote and "Also stated: `<the other place>`".
- It arrives ready, flagged (R7), "Already on file" (R8) or kept (story 16), and is listed in that order (story 04, R4).

R6. An added Key facts change sets the field on the record to the value read, and the project page's Key facts section shows it.

R7. One field never takes two values from one press.
- Two imports of one field: the value of the import added later is the one on the record. When two people add at the same moment the last save stands, as for two hand edits, and nobody is notified.
- Two different values for one field in one reading: both are listed, flagged with the badge "Needs you" and unticked, each with the line "The report also gives `<other value>`." Ticking one unticks the other, so one value at most is added. The tally counts both under "need you" until one is ticked.
- When "Add N changes" is pressed and the field no longer holds the value the change shows as "Was …", nothing is added, the change is shown against the record's present value, and the person presses again (story 32, R5).

R8. A Key facts change is "Already on file" when the value read is the field's value on the record. It then shows no "Was …" and has no checkbox: it cannot be added and is never counted as a change of the import.
- The record's value is the one the field holds when the check step opens, published or not, whether a person or an earlier import set it. It is compared again when "Add N changes" is pressed: a ticked change the record now holds stops the import once, loses its checkbox and is marked (story 32, R5).
- Values are compared by the field's type. Text: ignoring capitals, spaces at either end and repeated spaces, so "el dorado" is "Already on file" against "El Dorado" and "El Dorado County" is not. A field with options: by the option. A number: as a number. A date: as a date. A Timeline: as its two years.

R9. A value that does not fit its field is never proposed and never saved: an answer that is not one of the field's options, text where the field holds a number, a Timeline that would end before it starts. It is handed to the "Not used" list with the reason that the value does not fit the field (story 19).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- A field an authoritative data source supplies, which wins over every state here — story 16.
- A report that names another project, whose Key facts changes arrive unticked — story 20.
- The "Not used" list, its lines and the wording of each reason — story 19.
- Partner organizations — story 27 (`later`). A location — story 11.
- A field the reading returns that the project was not offered — enabler 50 (`later`).
- Putting a field back when an import is undone — story 41.
- Two imports of one field, or an import over a hand edit, as one row in the review — story 85.

## Needs to know from elsewhere

- The reading is told each Key facts field the project has, with its label and format, and returns a value only for those. For a Timeline it returns only the year the report states — enabler 02, not built.
- The "Already on file" badge, and the rule that the record is compared again when "Add N changes" is pressed: nothing is saved, the changes that no longer stand are marked, and the person presses again on a true count — story 32 (R3, R5).
- The Key facts group, its place before the other groups, the order inside a group, the tally, the quote, and selecting a change to see its place in the document — story 04.
- Each change that can be added has a checkbox; only ticked changes are added; a flagged change arrives unticked with the badge "Needs you" and is counted under "need you" — story 06 (R1, R3, R4).
- That a Key facts change has no fields on the check step is also story 07, R6; the scenario for it is S8 here.
- Added changes are saved unpublished: on the record at once, not public until a Manager publishes — owned by `publish-review`.
- The Key facts section of the project page, its built-in fields, and editing a field by hand — owned by `project-record`. Which custom fields a project has — owned by `custom-fields`.
- Deer Creek's Timeline carries a waiting hand edit (2023–2026 to 2023–2027); how an import over it reads in the review is story 85's.

## Scenarios

S2, S8, S10 and S13 run against the recorded sample `deer-creek-key-facts-2025.pdf` (rows F1, F2, F3); S11 adds `deer-creek-timeline-update-2026.pdf` (row U1) after it. No sample holds the data of the others; it is described by kind.

**S1 — Only four kinds of change** (proves R1)
- Given a report that states a new description and a new stage, and names photos and tags, along with a timeline
- When the reading comes back
- Then no change is offered for the description, the stage, the photos or the tags

**S2 — The Timeline, with the year the report did not state** (proves R2, R5)
- Given Deer Creek's Timeline is 2023–2027, and the report states only "Completion: September 2025"
- When the key facts sample's reading comes back
- Then F1 is listed under Key facts, labelled "Timeline", ticked, showing "2023–2025" and "Was 2023–2027"

**S3 — One year stated, and no Timeline on the record** (proves R2)
- Given a project whose Timeline is empty, and a report that states a completion year and no start year
- When the reading comes back
- Then no Timeline change is listed, and the statement is a line under "Not used" with the reason "This project has no Timeline to pair this year with." (story 19, R2)

**S4 — A built-in field the project has** (proves R3)
- Given a project with a County field, and a report that names a county other than the record's
- When the reading comes back
- Then a change labelled "County" is listed under Key facts, showing the county read and "Was `<the record's county>`"

**S5 — A custom field the project has** (proves R3)
- Given a workspace custom field that the project has, and a report that names a value for it
- When the reading comes back
- Then a change labelled with that field's name is listed under Key facts

**S6 — A field an import never sets** (proves R3)
- Given a report that names a stage, a project type and a lead organization other than the record's
- When the reading comes back
- Then no change is listed for any of the three, and each is a line under "Not used" with the reason "An import does not change a project's `<field>`." (story 19, R2)

**S7 — A field the project does not have** (proves R4)
- Given a project with no Watershed field, and a report that names a watershed
- When the reading comes back
- Then no change is offered for the watershed

**S8 — Taken or left, not edited** (proves R5; also story 07, R6)
- Given the check step lists F1
- When the Contributor looks for a way to change "2023–2025"
- Then the value is text with no field, and the only control on the change is its checkbox

**S9 — The same value stated twice** (proves R5)
- Given a report that states the same county in two places, other than the record's
- When the reading comes back
- Then one "County" change is listed, with the first place's quote and "Also stated: `<the other place>`"

**S10 — An added change sets the field** (proves R6)
- Given the check step lists F1, ticked, and Deer Creek's Timeline is 2023–2027
- When the Contributor presses "Add 2 changes"
- Then the Key facts section of the Deer Creek project page shows the Timeline 2023–2025

**S11 — The later import stands** (proves R7)
- Given F1 was added, so Deer Creek's Timeline is 2023–2025, and the timeline update sample's U1 reads "2023–2029" with "Was 2023–2025"
- When the Contributor presses "Add 1 change"
- Then the project page shows the Timeline 2023–2029

**S12 — Two different values in one reading** (proves R7)
- Given a report that states one county on its cover and another in a table, neither the record's
- When the reading comes back, and the Contributor ticks the first and then the second
- Then both arrive unticked with "Needs you", each reads "The report also gives `<other value>`.", and ticking the second unticks the first

**S13 — A value the record already has** (proves R8)
- Given Deer Creek's County is El Dorado
- When the key facts sample's reading comes back
- Then F2, "County", carries the badge "Already on file", shows "El Dorado" with no "Was …", has no checkbox, and the action reads "Add 2 changes"

**S14 — Capitals and spacing are not a change** (proves R8)
- Given a project whose County is El Dorado, and a report that writes it "el  dorado"
- When the reading comes back
- Then the County change is "Already on file"

**S15 — A value that does not fit its field** (proves R9)
- Given a project with a Key facts field that takes one of a list of options, and a report that names a value that is not one of them
- When the reading comes back
- Then no change is listed for that field, and the statement is a line under "Not used" with the reason "This value does not fit the `<field>` field." (story 19, R2)

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Nothing has been imported to Deer Creek. The test environment serves the recorded samples `deer-creek-key-facts-2025.pdf` and `deer-creek-timeline-update-2026.pdf`.
Test data: `../fixtures.md`: the key facts sample, rows F1, F2 and F3; the timeline update sample, row U1; Deer Creek's Key facts. Both samples are to be made. No sample has a county that differs from the record's, a custom field, a field that is empty on the record, a value that does not fit, or one field stated twice.
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and note the Key facts section | Timeline 2023–2027; County El Dorado |
| 2 | Press "Import a report", choose `deer-creek-key-facts-2025.pdf`, press "Read it" and wait | The check step, with a Key facts group first: "Timeline", then "County"; the tally "2 ready to add · 1 already on file" |
| 3 | Read the "Timeline" change, and try to change its value | Ticked; "2023–2025" and "Was 2023–2027"; the value is text, with nothing to type in |
| 4 | Read the "County" change | "El Dorado", the badge "Already on file", no "Was …" and no checkbox |
| 5 | Press "Add 2 changes" and look at the Key facts section | The Deer Creek project page; "2 changes added from deer-creek-key-facts-2025.pdf"; Timeline 2023–2025; County El Dorado |
| 6 | Press "Import a report", choose `deer-creek-timeline-update-2026.pdf`, press "Read it" and wait | One change, "Timeline", ticked: "2023–2029" and "Was 2023–2025"; the tally "1 ready to add" |
| 7 | Press "Add 1 change" and look at the Key facts section | Timeline 2023–2029 |

On the prototype: neither sample exists there; see `../fixtures.md`, On the prototype.

## Open questions

None open. The story rests on these proposed answers:

- Q-125 (proposed) — R2, S2, S3: code takes the year the report did not state from the record; with no Timeline on the record nothing is proposed.
- Q-65 (proposed) — R3, S6: which fields an import can set, and the three it never sets.
- Q-32 (proposed) — R5, S8: a Key facts change cannot be edited on the check step. Amends spec #13.
- Q-51 (proposed) — R5: "Was …" is all that is said of the value replaced.
- Q-99 (proposed) — R5, R7, S9, S12: one field stated twice in a reading: folded when the values agree, both flagged when they differ.
- Q-48 (proposed) — R7: the last save stands; the guard is the check at the press.
- Q-87 (proposed) — R8, S13: an "Already on file" field has no checkbox and is never counted.
- Q-124 (proposed) — R8, S14: values are compared by the field's type.
- Q-71 (proposed) — R9, S15: a value that does not fit is never proposed. Brings one check forward from enabler 50.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided | RUL-6 |
| R2 | decided; shown; proposed (Q-125) | RUL-6; STA-37, RUL-147; RUL-305 |
| R3 | decided (interview 2026-11-23, Q-27), not built beyond Timeline and County; proposed (Q-65) | RUL-66; RUL-306 |
| R4 | decided | RUL-6, RUL-66 |
| R5 | shown; proposed (Q-32, Q-51, Q-99) | STA-37, RUL-151; RUL-307 |
| R6 | shown | RUL-6; relies on story 01, SCR-3 |
| R7 | shown; proposed (Q-48, Q-99) | RUL-43; RUL-308; relies on story 32, R5 |
| R8 | shown; proposed (Q-87, Q-124) | RUL-79, RUL-148, RUL-149, RUL-150; RUL-309; relies on story 32, STA-11 |
| R9 | proposed (Q-71) | RUL-310 |
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the record's value of a field, 479-481; the fields the reading is offered, 484-497; the comparison and "Was …" at 653-656 and 780-783; what an added change records, 971-980); `src/components/projects/firma2-project-imported.astro` (the imported value on the project page; the later import standing, 82-98); `src/lib/report-imports.ts` (an imported change records the field and the value it replaced); `scripts/report-reader.mjs` (the model is given each field's label and format, not its current value, 354).
- Data shapes, as the prototype models them: a Key facts change is a field, a label, the value to set and the value as it reads. A Timeline's value to set is its two years. Once added it records the value the field held before, read again at the moment of adding.
- The prototype differs from the requirements in these: the comparison is letter for letter (R8); an "Already on file" field has a checkbox, and ticked it is set again and counted (R8); two changes for one field in one reading are both ticked and the later one stands (R7); the reading supplies both Timeline years (R2).
- Do not copy: only Timeline and County are built; imported field values are laid over the project page on every load from a browser-local store, where the product's record holds the value; the record's value on the check step is the seeded one with imports laid over it, so a hand edit made in the browser is not seen; spec #9 still lists partner organizations and is to be corrected.

</details>
