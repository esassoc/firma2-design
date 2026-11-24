# 51 — A Manager opens the later document on a review row that stands for two imports

Type: story
Epic: C — Imported changes in review
Release: first
Status: needs-info
Revision: 1
Blocked by: 33, 15
Covers: ACN-21, RUL-208
Sources: the project's review, `/prototypes/review/deer-creek-riparian-corridor-enhancement`; spec #30, #31
Snapshot: not yet captured
Read with: `../epics/E-C-imported-changes-in-review.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (ACN, STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 and R2, once story 33 is built (it opens a document from a row's button) and story 15 is built (it lets an import set a Key facts field, and decides that the later import's value stands); the one row for two imports is `publish-review`'s and is used here, not built here. No fixture gives two documents that set one field, so they can be tested only with data made for the purpose. Waiting: the reach of R1 on Q-97; a hand edit made after the imports on Q-143.

## Story

As a Manager, I want a row that stands for two imports of one field to lead to the document its value came from, so that I judge the value against the right source.

## Description

When two imports set the same field before a publish, the review shows one row, and the later import's value is the one on the record. Stories 24 and 33 give every imported row a button that names and opens its document. This story says which document that is when a row stands for two. Split from story 33 on 2026-11-23, because its scenarios need a Key facts field set by an import (story 15). See it at `/prototypes/review/deer-creek-riparian-corridor-enhancement`, after two imports that set the Timeline.

## Requirements

R1. On a row that stands for two or more imports of one field, the button names the document of the latest of those imports whose change is still waiting. The person and day on the row are that import's too. The same holds when the row also stands for a hand edit made before the imports. (open: Q-97) Not decided: a hand edit made after them (Q-143).

R2. Pressing that button opens that import's document, at the place its change was read from.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The button on a row for one import — story 24. What it opens, and a file that cannot be shown — story 33. How the document sits beside the review and closes — story 80.
- An import setting a Key facts field — story 15.
- Two imports of one field, or an import over a hand edit, shown as one row — `publish-review`.
- The earlier import's document: no screen leads to it from this row. Opening it from the change history — story 29 (`later`).

## Needs to know from elsewhere

- Two imports of one field are one row in the review, and so is an import over a hand edit of the same field; that row carries the import's value and source — owned by `publish-review`.
- When two imports set the same field, the later one's value stands — owned by story 15. The row's difference runs from the published value to that value.
- An imported row shows the person who added the import and the day — owned by story 24 (R2).
- A note left with the earlier import is still shown above the changes while its change waits behind this row — owned by story 21 (R9). Nothing on the row says so.
- Publishing the row publishes every change it stands for — owned by `publish-review`.
- A row for one import has a button "From `<document name>`" — owned by story 24. It opens the document beside the difference at the place the change was read from — owned by story 33.

## Scenarios

No fixture shows this: of the three recorded readings only the funder report sets a Key facts field (row F1, the Timeline). The scenarios describe the second document by kind.

**S1 — The button names the later document** (proves R1)
- Given the funder report's row F1 set Deer Creek's Timeline, a second import from another document then set the Timeline again, and neither is published
- When a Manager opens Deer Creek's review
- Then the Timeline is one row, its button reads "From" and the second document's name, and the person and day on it are the second import's

**S2 — The button opens the later document** (proves R2)
- Given the same two imports and the same row
- When the Manager presses the row's button
- Then the second document is shown beside the difference, at the place its Timeline was read from

## UAT script

Not runnable against `../fixtures.md` as it stands: it needs a second document whose recorded reading sets Deer Creek's Timeline. The steps are written for when one exists.

Preconditions: stories 33 and 15 are built. From Deer Creek's starting state, a Contributor has added the funder report's ready changes and then, in a second import, a change to the Timeline from the second document; nothing has been published since. Signed in as a Manager of Deer Creek Watershed Alliance, or an Administrator.
Test data: `../fixtures.md`: the funder report, row F1. The second document is not a fixture yet.
Reset: none needed: the script changes nothing on the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and press "Review changes" | The review; under Key facts, one row for the Timeline |
| 2 | Read that row's button | "From" and the second document's name, not "From deer-creek-completion-report-2025.pdf" |
| 3 | Press the button | The second document beside the review, at the place its Timeline was read from |

## Open questions

- Q-97 — R1: if two entries for one performance measure and reporting period are also one row, R1 and R2 hold for that row too, and the crew log and funder report become a fixture for this story.
- Q-143 — would change R1: after a hand edit of the field, the row might name no document at all; adds a scenario.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | ACN-21; RUL-208 |
| R2 | decided | ACN-21; relies on story 33, ACN-19 |

- Prototype files: `src/components/review/review-rows.ts` (imported changes laid over hand edits and over each other; the later change and its import replace the earlier on the row, 55-76); `src/components/review/firma2-review-changes.astro` (the row's person, day and button read from that import, 522-536; what the button opens, 628-639).
- Data shapes, as the prototype models them: each imported change holds the field it set and the value before; the review keeps the latest imported change for a field.
- What the prototype does where nothing is decided (not requirements): two entries for one performance measure and reporting period are two rows, because an entry sets no field (Q-97); a hand edit cannot follow an import, because the sample's hand edits are fixed (Q-143).
- Do not copy: imports read from the browser's localStorage, so the review shows them only in the browser that imported.

</details>
