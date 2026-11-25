# 85 — A Manager sees which document a review row names when a field was set more than once

Type: story
Epic: C — Imported changes in review
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-45, Q-97, Q-143
Revision: 1
Blocked by: 24, 15, 41
Covers: RUL-208, RUL-445, RUL-446
Sources: the project's review, `/prototypes/review/deer-creek-riparian-corridor-enhancement` (two imports of one field, and an import over a hand edit; a hand edit after an import is not in the prototype); spec #30, #31, #42
Snapshot: not yet captured
Read with: `../epics/E-C-imported-changes-in-review.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R5, once story 24 is built (it puts the document's name and the quote on an imported row) and story 15 is built (it lets an import set a Key facts field, and decides that the later import's value stands); the one row for several changes of one field is `publish-review`'s and is used here, not built here. Against the recorded samples `deer-creek-key-facts-2025.pdf` and `deer-creek-timeline-update-2026.pdf`. R4 and R5 need an import of a Key facts field taken back, which is story 41's "Undo"; story 41 is in `Blocked by` for that reason.

## Story

As a Manager, I want a row that stands for several changes of one field to name the document its value came from and show the words read there, so that I judge the value against the right source.

## Description

A field holds one value, so when it is changed more than once before a publish the review shows one row for it. Story 24 gives every imported row its document's name and its quote. This story says whose name, quote, person and day that one row carries when it stands for two imports, for an import over a hand edit, or for a hand edit made after an import. It is what is left of an earlier story, since retired, that opened the later document from such a row: nothing opens (spec #42), and the rule about which import the row names stays. It needs a Key facts field set by an import (story 15), which story 24 must not wait for. See the first two cases at `/prototypes/review/deer-creek-riparian-corridor-enhancement`, after two imports that set the Timeline; the hand edit after an import is not yet prototyped.

## Requirements

R1. A review row that stands for two or more imports of one field carries the value, the person, the day, the document's name and the quote of the latest of those imports whose change is still waiting. Nothing on the row names an earlier import's document or shows its quote.

R2. The same holds when the row also stands for a hand edit made before the imports: the row carries the import's value, person, day, document name and quote, not the hand edit's person and day. The row stays where the hand edit's row was in its section.

R3. When a person edits the field by hand after an import set it, and neither is published, the row shows the hand edit's value and the hand edit's person and day, and keeps "From `<document name>`" and the quote of the latest import still waiting behind it, so the Manager can compare the value with the words read.

R4. When the latest import behind a row is taken back, the row falls back to what still waits: the value, person, day, document name and quote of the import before it, or, when no import is left, the hand edit alone.

R5. A row whose only import was taken back, leaving a hand edit, is a plain hand edit's row: it names no source and shows no quote (story 24, R4).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The source line and the quote on a row for one import, who is sent them, and the order of imported rows — story 24 (R3, R6, R8).
- Two entries for one performance measure and reporting period: they are two rows, each with its own source, and never fold — story 24 (R1).
- An import setting a Key facts field, and which value stands when two imports set it — story 15.
- Showing several changes of one field as one row, and its difference — `publish-review`.
- A marker that the value was changed from the document's figure — `publish-review`, build 2.
- Taking an import back, and the value a field then holds — stories 23 and 41.
- Opening a document: not in the product (spec #42).

## Needs to know from elsewhere

- Several waiting changes of one field are one row in the review, whose difference runs from the published value to the value on the record — owned by `publish-review`. Publishing the row publishes every change it stands for, and the row then leaves the review.
- When two imports set the same field, the later one's value stands — owned by story 15.
- An imported row shows "`<who>` · `<day>`", "From `<document name>`" as text, and the change's quote — owned by story 24 (R2, R3).
- A note left with the earlier import is still shown above the changes while its change waits behind this row — owned by story 21 (R9). Nothing on the row says so.
- Both imports keep their rows in the change history, each with its own document's name — owned by story 22 (R3).
- After "Undo", a field holds the value it would hold had that import never been added — owned by story 41 (R3).

## Scenarios

All start from Deer Creek's starting state in `../fixtures.md`, where the Timeline already has a waiting hand edit (published 2023–2026, on the record 2023–2027). The first import is the key facts sample (row F1 sets the Timeline to 2023–2025); the second is the timeline update sample (row U1 sets it to 2023–2029). S4 and S5 use story 41's "Undo" of a Key facts field.

**S1 — An import over a hand edit** (proves R2)
- Given the key facts sample's two changes were added to Deer Creek and nothing is published
- When a Manager opens Deer Creek's review
- Then the Timeline is one row, in the place the hand edit's row had, with the value 2023–2025, the person and day of the import, "From deer-creek-key-facts-2025.pdf" and the quote "Project dates, page 1 — “Completion: September 2025”"

**S2 — Two imports of one field** (proves R1)
- Given the key facts sample's two changes were added to Deer Creek, then the timeline update sample's one change, and nothing is published
- When a Manager opens Deer Creek's review
- Then the Timeline is one row, with the person and day of the second import, "From deer-creek-timeline-update-2026.pdf" and the quote "Schedule, page 1 — “Completion is now expected in September 2029”", and nothing on the row names `deer-creek-key-facts-2025.pdf`

**S3 — A hand edit after an import** (proves R3)
- Given the key facts sample's two changes were added to Deer Creek, a person who can edit the project then set the Timeline by hand to 2023–2028, and nothing is published
- When a Manager opens Deer Creek's review
- Then the Timeline row shows 2023–2028 with that person's name and the day of the hand edit, and still "From deer-creek-key-facts-2025.pdf" with the quote "Project dates, page 1 — “Completion: September 2025”"

**S4 — The later import is taken back** (proves R4)
- Given the two imports of S2, and the second has since been taken back with "Undo"
- When a Manager opens Deer Creek's review
- Then the Timeline row is the row of S1: 2023–2025, the first import's person and day, "From deer-creek-key-facts-2025.pdf" and its quote

**S5 — The only import is taken back** (proves R5)
- Given the key facts import of S1 has since been taken back with "Undo"
- When a Manager opens Deer Creek's review
- Then the Timeline row is the hand edit's row of the starting state, 2023–2027, with no "From …" line and no quote

## UAT script

The script walks R2, R3 and R1. R4 and R5 are checked with story 41's "Undo" once that story is built.

Preconditions: stories 24, 15 and 41 are built. The test environment serves the recorded samples `deer-creek-key-facts-2025.pdf` and `deer-creek-timeline-update-2026.pdf`. Deer Creek is in its starting state. Two accounts: a Contributor who can edit Deer Creek (steps 1, 4 and 6), and a Manager of Deer Creek Watershed Alliance or an Administrator (the other steps). Note the Contributor's name and the day.
Test data: `../fixtures.md`: The project (the waiting hand edit of the Timeline); the key facts sample, row F1; the timeline update sample, row U1. Both samples are to be made. Row U1's value, 2023–2029, differs from the published Timeline (2023–2026), from the record's (2023–2027), from F1's (2023–2025) and from the hand edit of step 4 (2023–2028), so the review shows a Timeline row at every step.
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | As the Contributor, open Import a report for Deer Creek, choose `deer-creek-key-facts-2025.pdf`, press "Read it", wait, and press "Add 2 changes" | The project page, with the message "2 changes added from deer-creek-key-facts-2025.pdf"; Timeline 2023–2025 |
| 2 | As the Manager, open the Deer Creek project page and press "Review changes" | The review; under Key facts, one row for the Timeline |
| 3 | Read that row | 2023–2026 struck, then 2023–2025; the Contributor's name and the day; "From deer-creek-key-facts-2025.pdf"; "Project dates, page 1 — “Completion: September 2025”" |
| 4 | As the Contributor, change the Timeline on the project page by hand to 2023–2028 | Timeline 2023–2028 |
| 5 | As the Manager, open the review again and read the Timeline row | 2023–2028; the Contributor's name and today's date; still "From deer-creek-key-facts-2025.pdf" and the same quote |
| 6 | As the Contributor, import `deer-creek-timeline-update-2026.pdf`, pressing "Add 1 change" | The message "1 change added from deer-creek-timeline-update-2026.pdf"; Timeline 2023–2029 |
| 7 | As the Manager, open the review again and read the Timeline row | One row for the Timeline: "From deer-creek-timeline-update-2026.pdf" and "Schedule, page 1 — “Completion is now expected in September 2029”"; nothing names the key facts file |
| 8 | Press History on the project page | Both imports have their own row, each with its own file's name |

On the prototype: only the funder report sets the Timeline, and a hand edit cannot follow an import, because the sample's hand edits are fixed; see `../fixtures.md`, On the prototype.

## Open questions

None open. This story rests on these proposed answers:

- Q-143 (proposed) — R3, R5, S3, S5 and step 5: a hand edit after an import shows the hand edit's value, person and day and keeps the import's source line and quote.
- Q-97 (proposed) — R1 and Out of scope: rows fold for a field, never for an entry.
- Q-45 (proposed) — R1 to R4: the document's name and the quote are what the row carries; nothing opens (decided, spec #42).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown; proposed (Q-45) | RUL-208; RUL-445 |
| R2 | shown; proposed (Q-45) | RUL-208; RUL-445 |
| R3 | proposed (Q-143), not yet prototyped | RUL-446 |
| R4 | proposed (Q-143), not yet prototyped | RUL-446 |
| R5 | proposed (Q-143), not yet prototyped | RUL-446 |
- Prototype files: `src/components/review/review-rows.ts` (imported changes laid over hand edits and over each other; the later change and its import replace the earlier on the row, 55-76); `src/components/review/firma2-review-changes.astro` (the row's person, day and source read from that import, 522-536).
- Data shapes, as the prototype models them: each imported change holds the field it set and the value before; the review keeps the latest imported change for a field.
- Where the prototype differs from the requirements: the source is a button that opens the kept document (not in the product); a hand edit cannot follow an import, so R3 to R5 cannot be seen there.
- Do not copy: imports read from the browser's localStorage, so the review shows them only in the browser that imported.

</details>
