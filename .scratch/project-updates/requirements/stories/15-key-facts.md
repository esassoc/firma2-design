# 15 — A Contributor adds Key facts the report names

Type: story
Epic: B — What a report can change
Release: first
Status: needs-info
Revision: 1
Blocked by: 04, 02, 32
Covers: STA-37, RUL-6, RUL-43, RUL-66, RUL-79, RUL-147, RUL-148, RUL-149, RUL-150, RUL-151
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #9; interview 2026-11-23, Q-21 and Q-27
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1, R2 and R4 to R8, on a check step where stories 04, 06 and 32 are built (the groups, the checkbox and "Already on file" are used here, not built here), and only against the recorded funder report reading in `../fixtures.md`, which stands in for enabler 02 (not built). R3 can start for County; for any other field it waits on Q-65 (which fields are built-in) and on `custom-fields` for a custom field. Waiting: the parts marked "Not decided" or "open", each on the question named beside it.

## Story

As a Contributor, I want the Timeline and the other Key facts a report names offered as changes, so that the project's record matches the report without my retyping each field.

## Description

Story 01 adds performance measure entries. This story adds the second kind of change, a value for a Key facts field, and sets the limit on what an import may ever propose. On the check step of Import a report, Key facts changes are the first group. Once added, the field on the project page holds the value read. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report; the prototype builds Timeline and County only.

## Requirements

R1. An import proposes four kinds of change only: performance measure entries, Key facts, funding sources and contacts. It never proposes a change to the project's description, stage, photos or tags, whatever the report says about them.

R2. When the report states the project's timeline, the import proposes a change to the Timeline field. A Timeline is a start year and a completion year, written "2023–2025", and a Timeline change sets both. Not decided: where the other year comes from when the report states only one, as the sample report does (Q-125).

R3. When the report names a value for a built-in Key facts field or for one of the workspace's custom fields, and the project has that field, the import proposes a change to it, labelled with the field's name as the workspace has it. (open: Q-65, Q-71)

R4. A named attribute the project has no field for is not proposed as a change.

R5. A Key facts change is listed under Key facts, in the reading's order, labelled with the field's name ("Timeline", "County"), and shows the value read as text. (open: Q-51)
- When it replaces a value, the record's value is shown beside it as "Was `<the record's value>`": "2023–2025 Was 2023–2027". When the field is empty on the record, no "Was …" is shown.
- It arrives ready, "Already on file" (R8) or kept (story 16). No Key facts change arrives flagged in this story; whether one ever does is Q-71 and Q-63.

R6. An added Key facts change sets the field on the record to the value read, and the project page's Key facts section shows it.

R7. When two imports set the same field, the value of the import added later is the one on the record. (open: Q-48) Not decided: two changes for one field in one reading, which are both proposed (Q-99).

R8. A Key facts change is "Already on file" when the value read is the field's value on the record. It then shows no "Was …".
- The record's value is the one the field holds when the check step opens, published or not, whether a person or an earlier import set it.
- The two values are compared exactly, letter for letter. Not decided: a value that differs only in capitals or spacing (Q-124).
- Not decided: what adding a ticked one does (Q-87).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- A field an authoritative data source supplies — story 16.
- Editing a Key facts value before adding it: it can only be ticked or left out — story 07, R6.
- An attribute the project has no field for, listed under "Not used" — story 19.
- Partner organizations — story 27 (`later`). A location — story 11.
- A value checked against its field's format in code — enabler 50 (`later`).
- Putting a field back when an import is undone — story 41.
- Two imports of one field, or an import over a hand edit, as one row in the review — `publish-review`.

## Needs to know from elsewhere

- The reading is told each Key facts field the project has, with its label, format and current value, and returns a value only for those — enabler 02, not built.
- The "Already on file" state: the badge, arriving unticked, that the person can still tick it, and that it is worked out once, when the check step opens — story 32 (R3 to R5).
- The Key facts group, its place before the other groups, the order inside a group, the quote, and selecting a change to see its passage — story 04.
- Each change has a checkbox, and only ticked changes are added — story 06.
- Added changes are saved unpublished: on the record at once, not public until a Manager publishes — owned by `publish-review`.
- The Key facts section of the project page and its built-in fields — owned by `project-record`. Which custom fields a project has — owned by `custom-fields`.
- Deer Creek's Timeline carries a waiting hand edit (2023–2026 to 2023–2027); how an import over it reads in the review is `publish-review`'s.

## Scenarios

S2, S5, S6 and S8 run against the recorded funder report reading in `../fixtures.md`, rows F1 and F2 and its "Not used" lines; the reading's other rows belong to other stories. No fixture shows S1, S3, S4 or S7; their data is described by kind.

**S1 — Only four kinds of change** (proves R1)
- Given a report that states a new description and a new stage, and names photos and tags, along with a timeline
- When the reading comes back
- Then no change is offered for the description, the stage, the photos or the tags

**S2 — The Timeline** (proves R2, R5)
- Given Deer Creek's Timeline is 2023–2027
- When the funder report's reading comes back
- Then F1 is listed under Key facts, labelled "Timeline", ticked, showing "2023–2025" and "Was 2023–2027"

**S3 — A built-in field the project has** (proves R3)
- Given a project with a County field, and a report that names a county other than the record's
- When the reading comes back
- Then a change labelled "County" is listed under Key facts, showing the county read

**S4 — A custom field the project has** (proves R3)
- Given a workspace custom field that the project has, and a report that names a value for it
- When the reading comes back
- Then a change labelled with that field's name is listed under Key facts

**S5 — A field the project does not have** (proves R4)
- Given Deer Creek has no Watershed field, and the funder report reads "Watershed: South Fork American River"
- When the reading comes back
- Then no change is offered for the watershed

**S6 — An added change sets the field** (proves R6)
- Given the check step lists F1, and Deer Creek's Timeline is 2023–2027
- When the Contributor adds F1
- Then the Key facts section of the Deer Creek project page shows the Timeline 2023–2025

**S7 — The later import stands** (proves R7)
- Given F1 was added, so Deer Creek's Timeline is 2023–2025, and a second report states a completion in 2026
- When the Contributor adds the Timeline change read from the second report
- Then the project page shows the Timeline 2023–2026

**S8 — A value the record already has** (proves R8)
- Given Deer Creek's County is El Dorado
- When the funder report's reading comes back
- Then F2, "County", is unticked, carries the badge "Already on file", and shows "El Dorado" with no "Was …"

## UAT script

Step 6 adds the funder report's seven ready changes, which needs stories 13, 14, 17, 18 and 75 built as well (75 for the funding source that arrives unticked). Without them, stop after step 5.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Nothing has been imported to Deer Creek. The recorded funder report reading is served for the funder report file.
Test data: `../fixtures.md`: the funder report, rows F1 and F2, and its "Not used" lines; Deer Creek's Key facts. The count of seven waits on Q-82. No fixture has a county that differs from the record's, a custom field, a field that is empty on the record, or a second report that sets the Timeline.
Reset: not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and note the Key facts section | Timeline 2023–2027; County El Dorado |
| 2 | Press "Import report", choose `deer-creek-completion-report-2025.pdf`, press "Read it" and wait | The check step, with a Key facts group first: "Timeline", then "County" |
| 3 | Read the "Timeline" change | Ticked; "2023–2025" and "Was 2023–2027" |
| 4 | Read the "County" change | Unticked; "El Dorado", the badge "Already on file", and no "Was …" |
| 5 | Read the labels of every change in every group | None is for the description, the stage, photos, tags or a watershed |
| 6 | Press "Add 7 changes" and look at the Key facts section | The Deer Creek project page; Timeline 2023–2025; County El Dorado |

On the prototype: press "Sample funder report" in place of choosing the file; see `../fixtures.md`, On the prototype.

## Open questions

- Q-65 — R3 and S3: which built-in fields a change can be proposed for. The project page's Key facts also hold the project type, the lead organization and the estimated total cost.
- Q-71 — R3 and R5: what is proposed when the report's value does not fit the field, and whether such a change is flagged; it adds a requirement and a scenario.
- Q-63 — R5: whether the Key facts changes of a report that names another project arrive unticked (story 20).
- Q-51 — R5, S2 and step 3: whether the change also says that the value it replaces was typed by hand.
- Q-48 — R7 and S7: which value stands when two people import or edit at the same moment.
- Q-82 — step 6: the count of seven.
- Q-88 — the Reset line, and how the recorded reading is served.
- Q-99 — would change R7: which of two values for one field in one reading is proposed, or whether both are flagged.
- Q-124 — would change R8 and S8: whether a value that differs from the record's only in capitals or spacing is "Already on file".
- Q-125 — would change R2, S2 and step 3: what a Timeline change holds when the report states one of the two years.
- Q-87 — would change R8: whether a ticked "Already on file" field is set again and counted as a change of the import.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided | RUL-6 |
| R2 | decided; shown | RUL-6; STA-37, RUL-147 |
| R3 | decided, not built beyond Timeline and County | RUL-66 |
| R4 | decided | RUL-6, RUL-66 |
| R5 | shown | STA-37; RUL-151 |
| R6 | shown | RUL-6; relies on story 01, SCR-3 |
| R7 | shown | RUL-43 |
| R8 | shown | RUL-79, RUL-148, RUL-149, RUL-150; relies on story 32, STA-11 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the record's value of a field, 479-481; the fields the reading is offered, 484-497; the comparison and "Was …" at 653-656 and 780-783; what an added change records, 971-980); `src/components/projects/firma2-project-imported.astro` (the imported value on the project page; the later import standing, 82-98); `src/lib/report-imports.ts` (an imported change records the field and the value it replaced); `scripts/report-reader.mjs` (the model is given each field's label and format, not its current value, 354).
- Data shapes, as the prototype models them: a Key facts change is a field, a label, the value to set and the value as it reads. A Timeline's value to set is its two years. Once added it records the value the field held before, read again at the moment of adding.
- What the prototype does where nothing is decided (not requirements): two changes for one field in one reading are both ticked, and the one later in the list stands (Q-99); a ticked "Already on file" field is set to the value it has and counted as a change (Q-87).
- Do not copy: only Timeline and County are built; imported field values are laid over the project page on every load from a browser-local store, where the product's record holds the value; the record's value on the check step is the seeded one with imports laid over it, so a hand edit made in the browser is not seen; spec #9 still lists partner organizations and is to be corrected.

</details>
