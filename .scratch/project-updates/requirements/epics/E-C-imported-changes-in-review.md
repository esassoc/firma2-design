# E-C — A Manager judges an imported change against its document before publishing it

Feature: project-updates
Release: first
Status: needs-info

## Goal

In the project's review, a Manager can tell which waiting changes came from a document, read the note the importer left, and open the document beside the diff at the passage each change was read from. The Manager publishes on evidence, not on trust.

## Actors

- Manager (a Manager of the project's lead organization, or an Administrator): reads imported changes with the document beside them and the import's note above them, then publishes.
- Contributor: writes the note this epic shows, on the check step of Import a report (the first half of story 21).

## Decisions that shape every story

| Source | Decision |
|---|---|
| spec #31 | An imported change in the review names its document as its source, and the document opens beside the diff at the change's passage (open: Q-37). |
| spec #32 | The import's note sits above the changes that import produced, once per import. |
| spec #17 | One optional note per import. There is no note per change (open: Q-36). |
| spec #19 | The document is kept as the source of the import's changes. Only people who can edit or publish that project can open it. It is never public and is not listed as a file anywhere (open: Q-45). |
| spec #30 | An import over a hand edit of the same field is one review row, not two. Owned by `publish-review`. |
| system map | The review belongs to `publish-review`. This epic owns only the source and the note on imported rows, drawn inside that surface. |

## Out of scope

- The review itself: one row per field, the diff, Publish, the Review inbox — `publish-review`. The inbox draws the same review for the project selected in it, so the note (story 21) and the document (story 80) show there too.
- The one-row fold of an import over a hand edit, and the count the badge uses — `publish-review`.
- A publish including imported changes with the rest — `publish-review`.
- Hold, Revert with a reason, the row markers "Changed from the document's figure" and "Filled in after an unsure reading", and their notifications — `publish-review`, build 2.
- The check step the note is written on, and "Add N changes" — stories 01 and 04 (epic A).
- Storing the document and limiting who can open it — story 03 (epic A).
- Opening the document from the change history — story 29 (epic A), `later`.

## Stories, by dependency

| # | Story | Type | Release | Blocked by | Wave |
|---|---|---|---|---|---|
| 24 | A Manager sees which waiting changes came from a document, and which document | story | first | 22 | 4 |
| 21 | A Contributor leaves one note with an import, and the Manager reads it above the import's changes | story | first | 22, 24 | 5 |
| 33 | A Manager opens an imported change's document beside the difference, at its passage | story | first | 24, 03 | 5 |
| 80 | A Manager keeps the document beside the review while judging, and closes it | story | first | 33 | 6 |
| 51 | A Manager opens the later document on a review row that stands for two imports | story | first | 33, 15 | 7 |

The table is in dependency order; "Wave" is the story's wave in the map's Build order. Story 24 is blocked by story 22 (epic A), which records the import a row reads; 21 by 22 and by 24, whose rows its note sits above; 33 by enabler 03 (epic A), which keeps the document; 51 by story 15 (epic B), which lets an import set a Key facts field.

Merge pass, 2026-11-23: writing the note (once a story of epic A) and reading it (once its own story here) are one story, 21, with two actors: the Contributor writes the note on the check step and the Manager reads it above the import's changes. It is in this epic because its last blocker and its outcome are in the review. Earlier the same day: 33 split from 24, 51 from 33, and 80 from 33 (the document beside the review, and closing it).

## Depends on other features

- `publish-review`: the review surface (one row per field, the diff, Publish, the inbox), the one-row fold, and Publish including imported changes.
- `users-and-security`: who can publish a project, and so who can open its kept documents.

## Open questions

Every open question a story of this epic cites, with the stories that cite it, read from the story files on 2026-11-23, after the merge pass. The questions themselves are in `.scratch/open-questions.md`; the words after each ID are that question's heading. Each story says which of its requirements, scenarios or steps the answer would change.

- Q-36 — Note label (story 21)
- Q-37 — Does every change row name its source? (story 24)
- Q-47 — Limits (story 21)
- Q-53 — An import is recorded with the person who added it and the day (stories 21, 24)
- Q-66 — The reading service: three things the developer-machine reader leaves open (story 33)
- Q-76 — After a publish, what of an import still shows? (stories 21, 24)
- Q-77 — Access to the kept document that is lost or fails (story 33)
- Q-82 — A figure in another unit than the measure's, in the first release (stories 21, 24)
- Q-86 — The day an import is recorded with: which clock? (story 24)
- Q-88 — Running a UAT script: the recorded readings, and getting back to the start (stories 21, 24)
- Q-93 — Can the note for the reviewer be changed or removed once the import is added? (story 21)
- Q-97 — Two imports that each add an entry for the same performance measure and reporting period: one row in the review, or two? (stories 24, 33, 51, 80)
- Q-117 — A change that carries no page and points at no passage: what does the document pane show? (story 33)
- Q-141 — In the review, should a change read the same whether a person typed it or an import added it? (story 24)
- Q-142 — A project that has never been published: do imported rows in the review show who added them and the day? (story 24)
- Q-143 — A field an import set is then edited by hand before a publish (stories 24, 51)
- Q-144 — How does a Manager tell which rows a note speaks of? (story 21)
- Q-145 — In the review, pressing the button of the row whose document is already open: should it close the document? (story 33)
- Q-146 — Escape and keyboard focus when the document opens beside the review on a wide screen (story 80)
