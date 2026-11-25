# E-C — A Manager judges an imported change against the words it was read from before publishing it

Feature: project-updates
Release: first
Status: needs-triage

## Goal

In the project's review, a Manager can tell which waiting changes came from a document, read the words each was read from (its quote) beside the document's name, and read the note the importer left. Nothing opens: the file is not kept (spec #42). The Manager publishes on evidence, not on trust.

## Actors

- Manager (a Manager of the project's lead organization, or an Administrator): reads imported changes with the document's name and the quote on each row and the import's note above them, then publishes.
- Contributor: writes the note this epic shows, on the check step of Import a report (the first half of story 21).

## Decisions that shape every story

| Source | Decision |
|---|---|
| spec #31, amended by spec #42 | An imported change in the review names its document as its source, as text, and shows the quote it was read from. Nothing opens (showing the quote is proposed, Q-45). A hand edit's row names no source (proposed, Q-37). |
| spec #32 | The import's note sits above the changes that import produced, once per import. |
| spec #17 | One optional note per import. There is no note per change. Its label is "Note for the reviewer (optional)" (proposed, Q-36). |
| spec #42 (replaces spec #19) | The file is not kept. The document's name and each change's quote stay, and reach only people who can edit or publish the project (proposed, Q-45, Q-136). |
| spec #30 | An import over a hand edit of the same field is one review row, not two. Owned by `publish-review`. |
| system map | The review belongs to `publish-review`. This epic owns only the source and the note on imported rows, drawn inside that surface. |

## Out of scope

- The review itself: one row per field, the diff, Publish, the Review inbox — `publish-review`. The inbox draws the same review for the project selected in it, so the source line, the quote (story 24) and the note (story 21) show there too.
- The one-row fold of an import over a hand edit, and the count the badge uses — `publish-review`.
- A publish including imported changes with the rest — `publish-review`.
- Hold, Revert with a reason, the row markers "Changed from the document's figure" and "Filled in after an unsure reading", and their notifications — `publish-review`, build 2.
- The check step the note is written on, and "Add N changes" — stories 01 and 04 (epic A).
- Opening the document, beside the review or from the change history — not in the product (spec #42).

## Stories, by dependency

| # | Story | Type | Release | Blocked by | Wave |
|---|---|---|---|---|---|
| 24 | A Manager sees which waiting changes came from a document, and the words each was read from | story | first | 22 | 4 |
| 21 | A Contributor leaves one note with an import, and the Manager reads it above the import's changes | story | first | 22, 24 | 5 |
| 85 | A Manager sees which document a review row names when a field was set more than once | story | first | 24, 15, 41 | 8 |

The table is in dependency order; "Wave" is the story's wave in the map's Build order. Story 24 is blocked by story 22 (epic A), which records the import a row reads; 21 by 22 and by 24, whose rows its note sits above; 85 by story 15 (epic B), which lets an import set a Key facts field, and by story 41 (epic A), whose "Undo" its last two scenarios use. It is still its own epic: a second actor's journey.

2026-11-23: answers written in; stories built on proposals awaiting the user's validation (see `.scratch/proposed-answers.md`). Scope changes that day: removed 33, 51 and 80 (the file is not kept, spec #42); added 85, which is what remains of 51 (which import a review row names when a field was set more than once).

## Depends on other features

- `publish-review`: the review surface (one row per field, the diff, Publish, the inbox), the one-row fold, and Publish including imported changes.
- `users-and-security`: who can publish a project, and so who is sent a document's name and a change's quote.

## Proposals these stories rest on

No question is open in any story of this epic. Each story is built on proposed answers awaiting the user's validation (`.scratch/proposed-answers.md`), and is `needs-triage` until they are validated. Listed here: every question a story of this epic cites in its Open questions section, with the stories that cite it, read from the story files on 2026-11-23. Q-45, Q-52 and Q-135 are the user's decisions; where a story lists one, it leans on the part still proposed. The words after each ID are the question's heading in `.scratch/open-questions.md`.

- Q-36 — Note label (story 21)
- Q-37 — Does every change row name its source? (story 24)
- Q-45 — The kept document (stories 24, 21, 85)
- Q-47 — Limits (story 21)
- Q-53 — An import is recorded with the person who added it and the day (stories 24, 21)
- Q-76 — After a publish, what of an import still shows? (story 21)
- Q-86 — The day an import is recorded with: which clock? (story 24)
- Q-93 — Can the note for the reviewer be changed or removed once the import is added? (story 21)
- Q-97 — Two imports that each add an entry for the same performance measure and reporting period: one row in the review, or two? (stories 24, 85)
- Q-130 — After adding the changes of a report that names another project, is anything recorded? (story 24)
- Q-136 — Who may read the document's name? (story 24)
- Q-141 — In the review, should a change read the same whether a person typed it or an import added it? (story 24)
- Q-142 — A project that has never been published: do imported rows in the review show who added them and the day? (story 24)
- Q-143 — A field an import set is then edited by hand before a publish (story 85)
- Q-144 — How does a Manager tell which rows a note speaks of? (story 21)

