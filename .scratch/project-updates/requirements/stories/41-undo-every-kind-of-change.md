# 41 — A Contributor's Undo takes back every kind of change the import added

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 03, 15, 17, 18, 23
Covers: RUL-22, RUL-186, RUL-187
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement`; spec #18
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R4, each once the story that adds its kind of change is built (15, 17, 18); only against the recorded funder report reading in `../fixtures.md` until enabler 02 is built. Can start only against a stand-in for enabler 03 (not built): R4. Waiting: a field edited by hand since the import, and "Undo" after a publish, in R3, on Q-75; a field a GIS subscription supplies, in R3, on Q-72; two imports of one field taken back one after the other, in R3, on Q-138; a funding source or contact changed since the import, and an "Undo" that fails part-way, in R1 and R2, on Q-137; the count of seven on Q-82.

## Story

As a Contributor, I want "Undo" to take back everything the import added, whatever kind of change it was, so that taking an import back leaves the project as it was before.

## Description

Story 23 puts "Undo" on the toast and takes back performance measure entries. Epic B lets an import also set Key facts fields and add funding sources and contacts, and enabler 03 keeps its document. This story extends "Undo" to all of them, so that the whole rule holds: "Undo" takes back everything that one import added, and nothing else. Split from story 23 on 2026-11-23; the change history row went back to story 23 (R7) the same day, and R5 became R4. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement`, after adding the sample funder report.

## Requirements

R1. "Undo" takes back everything that one import added, of every kind, and nothing that a person or another import put on the record: its performance measure entries (story 23), and what R2 to R4 name, and the change history row (story 23, R7). Each section of the project page follows without a reload. Not decided: whether it is all or nothing when part of it cannot be taken back (Q-137).

R2. Each funding source and each contact the import added leaves the project. A funding source or contact the record held before the import, which the import therefore did not add again (story 17, R13; story 18, R6), stays. "Total from all sources" goes with the last row an import added (story 17, R11). Not decided: a funding source two imports both added, where the prototype keeps the row with the other import's amount (Q-99).

R3. Each Key facts field the import set returns to the value it held before the import. Where a later import has set the same field since, the later import's value stands. Not decided: a field the person edited by hand after the import, which the prototype puts back to its value from before the import, so the hand edit is lost (Q-75); taking back that later import afterwards, which in the prototype puts the field back to the value of the import already taken back (Q-138); a field whose new value was already sent to a GIS system (Q-72); any of this once the import's changes have been published (Q-75).

R4. The import's kept document is no longer kept: nobody can open it.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- "Undo" on the toast, how long it lasts, the toast "`<N>` changes removed", and the import's row leaving the change history — story 23.
- Imported changes leaving the review — `publish-review`.
- The "`<N>` unpublished changes" badge — `publish-review`.
- Reverting one imported change in the review — `publish-review`, build 2.

## Needs to know from elsewhere

- The toast carries "Undo"; pressing it takes the import back at once with no confirmation, and it is offered once, on the toast only — owned by story 23.
- An import can set a Key facts field, and when two imports set one field the later value stands — owned by story 15.
- An import can add a funding source — owned by story 17 (and story 75, when its organization had to be picked). Its row on the project page, and "Total from all sources", which shows only while the table holds a row an import added — owned by story 17 (R9 to R13).
- An import can add a contact, and one whose email the project's Contacts already hold is not shown a second time — owned by story 18 (R6).
- The kept document — enabler 03, not built. It keeps the import's document for people who can edit or publish the project; this story tells it when an import is taken back.
- Each import records, for every change, what it put on the record and the value a field held before — owned by story 22 (R2) and, for each kind, the story that adds it.

## Scenarios

All run against the recorded funder report reading in `../fixtures.md`, starting from Deer Creek's starting state. Each begins with the funder report's seven ready changes added and the toast "7 changes added from deer-creek-completion-report-2025.pdf" showing. No fixture gives a second import that sets a field; S4 describes it by kind.

**S1 — A funding source is taken back** (proves R1, R2)
- Given the import added row F11, "Fisheries Habitat Fund", to Funding sources
- When the Contributor presses "Undo"
- Then Funding sources lists the two funding sources of the starting state and no "Fisheries Habitat Fund"

**S2 — A contact is taken back** (proves R2)
- Given the import added row F14, the contact Tomás Ibarra, to Contacts
- When the Contributor presses "Undo"
- Then Contacts lists the three contacts of the starting state and no Tomás Ibarra

**S3 — A field goes back to what it held** (proves R3)
- Given the import set the Timeline to 2023–2025 (row F1), from 2023–2027
- When the Contributor presses "Undo"
- Then Key facts shows the Timeline 2023–2027

**S4 — A later import's value stands** (proves R3)
- Given the toast of a first import that set the Timeline is still showing in one window, and a second import, added since in another window, set the Timeline to another value
- When the Contributor presses "Undo" on the first import's toast
- Then Key facts shows the Timeline the second import set

**S5 — The document is no longer kept** (proves R4)
- Given the import's document, `deer-creek-completion-report-2025.pdf`, is kept
- When the Contributor presses "Undo", and someone who can edit Deer Creek then asks for that import's document
- Then there is no document to open

## UAT script

R4 cannot be seen on a screen: once the import is taken back, nothing leads to its document. Steps 1 to 5 cover R1 to R3.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Deer Creek is in its starting state. The recorded funder report reading is served for the funder report file. Before step 1, note the Timeline in Key facts, and the rows of Funding sources and of Contacts.
Test data: `../fixtures.md`: The project (its starting state); the funder report, rows F1, F11 and F14, and the paragraph under its table that says what the project shows after the seven ready changes are added. Rows F4 and F5, and so the count of seven, wait on Q-82.
Reset: none needed when step 5 passes: the script ends in the starting state. Otherwise not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | Open Import a report for Deer Creek, choose `deer-creek-completion-report-2025.pdf`, press "Read it" and wait | The check step, with the button "Add 7 changes" |
| 2 | Press "Add 7 changes" | The Deer Creek project page, with the message "7 changes added from deer-creek-completion-report-2025.pdf" and "Undo" |
| 3 | Without touching the message, look at Key facts, Funding sources and Contacts | Timeline 2023–2025; a funding source "Fisheries Habitat Fund"; a contact Tomás Ibarra |
| 4 | Press "Undo" on the message | A message, "7 changes removed" |
| 5 | Look at Key facts, Funding sources and Contacts | What you noted before step 1: Timeline 2023–2027, two funding sources, three contacts |

On the prototype: press "Sample funder report" in place of choosing the file in step 1; see `../fixtures.md`, On the prototype.

## Open questions

- Q-72 — R3: what "Undo" does to a field whose value was sent back to a GIS system (story 16); no scenario covers it yet.
- Q-75 — R3: whether a hand edit made since the import stands, and what "Undo" does after a publish; either answer adds a scenario.
- Q-82 — every scenario and steps 1 to 4: the count of seven.
- Q-99 — would change R2: what "Undo" leaves of a funding source two imports both added.
- Q-137 — would change R1 and R2: a funding source or contact changed by hand since the import, and an "Undo" that fails part-way.
- Q-138 — would change R3: which value a field returns to when two imports of it are taken back, the earlier first; an answer adds a scenario.
- Q-88 — the Reset line when the script fails part-way, and how the recorded reading is served.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided | RUL-22 |
| R2 | decided; shown | RUL-22; RUL-186; relies on story 17, RUL-48; relies on story 18, RUL-49 |
| R3 | decided | RUL-22; RUL-187 |
| R4 | decided | RUL-22; relies on story 03, OBJ-5 |

- Prototype files: `src/lib/report-imports.ts` (taking an import back whole, 164-181; funding sources and contacts read from the imports that remain, 193-201); `src/components/projects/firma2-project-imported.astro` ("Undo" on the toast, each field put back and the remaining imports' values laid on again, 115-128); `src/components/projects/firma2-project-report-import.astro` (the value a field held before, 479-481 and 978).
- Data shapes, as the prototype models them: each imported change records what it wrote: an entry, a field with the value it held before, a contact, or a funding source. "Undo" walks those records for one import, then drops the import and its document.
- What the prototype does where nothing is decided (not requirements): a field edited by hand since the import is put back to its value from before the import (Q-75); a later import remembers, as the value from before it, what the earlier import set, and puts that back even when the earlier import is gone (Q-138).
- Do not copy: imports and their documents kept in the browser; imported field values laid over the project page again on every load; "the value it held before" read from the seeded project and earlier imports only, so a hand edit made before the import is not what "Undo" puts back.

</details>
