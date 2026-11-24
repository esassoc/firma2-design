# 21 — A Contributor leaves one note with an import, and the Manager reads it above the import's changes

Type: story
Epic: C — Imported changes in review
Release: first
Status: needs-info
Revision: 1
Blocked by: 22, 24
Covers: ACN-16, RUL-19, RUL-179, RUL-180, RUL-181, STA-34, RUL-45, RUL-196, RUL-197, RUL-198, RUL-199
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; the project's review, `/prototypes/review/deer-creek-riparian-corridor-enhancement`, after adding an import with a note; spec #17, #32
Snapshot: not yet captured
Read with: `../epics/E-C-imported-changes-in-review.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (ACN, STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R4, once story 22 records an import (the check step itself is story 01's, built before story 22; the clauses of R4 that name stories 06, 35 and 30 hold once each is built); R5 to R11, once story 24 puts imported changes in the review, which `publish-review` owns (the review, Publish and the Review inbox are used here, not built here). All of it only against the recorded readings in `../fixtures.md` until enabler 02 is built. Waiting: the label in R1 on Q-36; the length limit in R3 on Q-47; whether the note can be changed after adding, in R3 and R5, on Q-93; the name in R6 on Q-53; the part of R7 marked "Not decided" on Q-144; the last part of R9 on Q-76; the count of six on Q-82.

## Story

As a Contributor, I want to leave one note with an import, so that whoever reviews it knows what I checked or decided without asking me.

## Description

On the check step, below the changes, the person may write a note before pressing "Add N changes". The note belongs to the import as a whole, not to any one change, and writing one is never required. It is recorded with the import (story 22) and shown to the Manager in the project's review, the screen `publish-review` owns and story 24 adds imported rows to: once, above the changes, wherever that review is shown, and gone when none of its import's changes is still waiting. This story has two actors, the Contributor who writes the note and the Manager who reads it, because the note's only observable effect is the Manager's reading; the Manager's reading is its last scenarios and the second half of its UAT script. Merged on 2026-11-23 with a story whose number is retired (`../story-map.md`, Retired numbers); that story's R1 to R7 are R5 to R11 here. See the field at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, on the check step of the sample crew log, and the note at `/prototypes/review/deer-creek-riparian-corridor-enhancement`, after adding the sample crew log with a note in the same browser.

## Requirements

R1. The check step has one text area, labelled "Note for the reviewer (optional)", below the list of changes and below everything else the check step lists (story 19's "Not used" and "Skipped", once built). It is the only place to write a note: an import has one note, and no change has a note field of its own. It is there whatever the changes' states, and it opens empty for every reading. (open: Q-36)

R2. The note is optional. "Add N changes" adds the changes with the text area empty, and the import then has no note. A note typed and then cleared is no note.

R3. When the changes are added, the note is recorded with the import as the person wrote it: plain text of any number of lines, with its line breaks and the spacing inside it kept. Spaces and line breaks at its start and end are dropped, so a note of spaces alone is no note. Not decided: a limit on its length and what the person sees at it (Q-47); whether the person can change or remove the note once the import is added, which nothing in the prototype does (Q-93).

R4. A note exists only with an import. Nothing is recorded of a note when nothing is added: when no change is ticked, so "Add N changes" cannot be pressed (story 06, R5); when the person leaves the page (story 01, R7); or when they press "Read another" (story 35, R4). When "Add N changes" is stopped by an invalid change (story 30, R4), the note stays in the text area as typed.

R5. In the project's review, a note left with an import is shown above the changes: above every section, as it was written, with its line breaks. Whatever was typed is shown as plain text, and a word too long for the line wraps. (open: Q-93)

R6. Under the note is "`<who>`, with `<document name>`": the person who added the import and its document ("`<who>`, with pasted text" when the document was pasted text). (open: Q-53)

R7. A note is shown once per import, however many of that import's changes are waiting. Two imports that each left a note each show theirs, even when the words or the document's name are the same. Not decided: how the Manager tells which rows a note speaks of when two notes read alike (Q-144).

R8. When several imports left a note, the notes are in the order the imports were added, oldest first.

R9. A note is shown while at least one change from its import is waiting, and at no other time: it goes with the last of them, and it is back if they wait again because a publish was undone. A change still counts as waiting while a later import of the same field stands for it in one row. Once none waits, the note is shown nowhere. (open: Q-76)

R10. An import with no note shows nothing above the changes.

R11. The note is shown wherever the project's review is: on the project's own review and, in the Review inbox, above the changes of the project selected there. The inbox's list of projects shows no note.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- "Cancel" and "Read another" — story 35.
- The note the reading writes on a change — story 01. On a flagged change — story 14.
- Imported rows — story 24. Opening the document — story 33.
- Pasting a report's text — story 09. The pasted text kept and named "pasted text" as the import's document — story 40.
- "Undo", which takes an import back, and its note with it — story 23.
- Replying to a note, and a reason given with a Hold or a Revert — `publish-review`, build 2.

## Needs to know from elsewhere

- Each press of "Add N changes" that adds changes records one import: the project, who added it, the day, the document and each change. This story adds the note to that record, and reads from it who added the import and its document's name for the line under the note (R6) — owned by story 22 (R1).
- Leaving the page before adding keeps nothing of a reading — owned by story 01 (R7). "Read another" discards the reading with everything the person set on the check step — owned by story 35 (R4), which names this story for the note and does not hand it back.
- When no change is ticked the commit action reads "Nothing ticked" and cannot be pressed — owned by story 06 (R5). One invalid ticked change stops the whole import and leaves the person on the check step with what they had set — owned by story 30 (R4). Neither is in `Blocked by`: R4 states what each means for the note once it is built.
- "Undo" takes the note back with the import — owned by story 23 (R2).
- The check step and its list of changes — owned by story 01 (R8).
- A change stops waiting when it is published, and a published change leaves the review; undoing the last publish puts its changes back in the review — owned by `publish-review`.
- The Review inbox lists the projects that have changes waiting and shows, beside the list, the review of the one selected — owned by `publish-review`.
- Each imported row shows who added it, the day, and "From `<document name>`", which is how a note's line under it is matched to rows — owned by story 24.

## Scenarios

All run against the recorded readings in `../fixtures.md`: the crew log, and for S9 the funder report's performance measure entries as a second import. No fixture has a note: S1 to S5 describe one by kind, and in S6 to S12 each note is two lines the tester writes. S1 to S5 are the Contributor's; S6 to S12 are the Manager's reading.

**S1 — One note field, below the changes** (proves R1)
- Given the check step lists the crew log's six changes for Deer Creek
- When the Contributor reads down the page to its end
- Then below the last change there is one text area, labelled "Note for the reviewer (optional)", and none of the six changes has a text area for a note

**S2 — Adding with no note** (proves R2)
- Given the check step lists the crew log's six changes and the note is empty
- When the Contributor presses "Add 6 changes"
- Then the six changes are added, and the import has no note

**S3 — A note of spaces is no note** (proves R3)
- Given the check step lists the crew log's six changes and the note holds three spaces and a line break
- When the Contributor presses "Add 6 changes"
- Then the import has no note

**S4 — The note is recorded as written** (proves R3)
- Given the check step lists the crew log's six changes, and the note holds two short lines with a space typed before the first word and after the last
- When the Contributor presses "Add 6 changes"
- Then the import's note is those two lines, on two lines, with no space before the first word or after the last

**S5 — A new reading opens with an empty note** (proves R1, R4)
- Given the Contributor typed a note on the check step of the crew log, went back to the project page without adding, and Deer Creek has no import
- When they open Import a report again and read the crew log
- Then the text area is empty, and Deer Creek still has no import and no note

**S6 — The note is above the changes** (proves R5)
- Given a Contributor added the crew log's changes to Deer Creek with a note of two lines, and none is published
- When a Manager opens Deer Creek's review
- Then the note is above the changes, word for word, on two lines

**S7 — Who wrote it, and with which document** (proves R6)
- Given the same import and note
- When a Manager opens Deer Creek's review
- Then under the note is that Contributor's name, then ", with deer-creek-crew-log-2025.xlsx"

**S8 — Once, not once per change** (proves R7)
- Given the same import and note, with every change of the import waiting
- When the Manager reads the whole review
- Then the note appears one time

**S9 — Two imports, two notes** (proves R8)
- Given the crew log's changes were added to Deer Creek with a note, then the funder report's row F3 with another note, and none is published
- When a Manager opens Deer Creek's review
- Then both notes are above the changes, the crew log's first, each with its own line under it

**S10 — The note goes with its last waiting change** (proves R9)
- Given the import and note of S6, all of whose changes have since been published, and a hand edit made after that
- When a Manager opens Deer Creek's review
- Then the review shows the hand edit and no note

**S11 — No note, nothing shown** (proves R10)
- Given the crew log's changes were added to Deer Creek with the note left empty
- When a Manager opens Deer Creek's review
- Then nothing sits above the changes for that import

**S12 — In the Review inbox, with the selected project's changes** (proves R11)
- Given the import and note of S6, with its changes waiting
- When the Manager selects Deer Creek in the Review inbox
- Then the note and its line are above Deer Creek's changes there, and Deer Creek's entry in the list of projects shows no note

## UAT script

Steps 1 to 5 are the Contributor's: R1, the empty text area of R4, and that adding goes through with a note written. Steps 6 to 12 are the Manager's, and are where what the import holds (R2, R3) is seen, with R5 to R7, R9 and R11.

Preconditions: story 01's UAT script has been run to its step 7 by a Contributor, so the check step lists the crew log's six changes. Nothing has been imported to Deer Creek. Note that Contributor's name. A second account exists for steps 6 to 12: a Manager of Deer Creek Watershed Alliance, or an Administrator. Someone who can edit Deer Creek is at hand for step 12.
Test data: `../fixtures.md`: the crew log. The count of six waits on Q-82. No fixture has a note; the tester writes any two short lines and notes their words. The script does not walk S9, which needs a second import (the funder report's row F3 will do). The case with no note (S11) is what story 24's script shows: there, nothing sits above the changes.
Reset: not known (Q-88). The script publishes Deer Creek.

| # | Do this | You should see |
|---|---|---|
| 1 | Scroll to the end of the page | Below the last change, one text area labelled "Note for the reviewer (optional)" |
| 2 | Look at each of the six changes | None has a text area of its own for a note |
| 3 | Type two short lines in the text area | The two lines, as typed |
| 4 | Go back to the project page by the breadcrumb, then run story 01's UAT script to its step 7 again and scroll to the end | The text area, empty |
| 5 | Type the two short lines again and press "Add 6 changes" | The Deer Creek project page, with the message "6 changes added from deer-creek-crew-log-2025.xlsx" and no complaint about the note |
| 6 | Sign in as a Manager of Deer Creek Watershed Alliance, open the Deer Creek project page and press "Review changes" | The review; above the changes, the note on two lines, as it was typed |
| 7 | Read the line under the note | The Contributor's name, then ", with deer-creek-crew-log-2025.xlsx" |
| 8 | Read down the whole review | The note appears once, although several changes from that import are listed |
| 9 | Open the Review inbox and read Deer Creek's entry in the list | No note in the list |
| 10 | Select Deer Creek there | The same note and line, above Deer Creek's changes |
| 11 | Publish Deer Creek | The changes are published |
| 12 | Have someone who can edit Deer Creek change its description by hand, then open Deer Creek's review again | The hand edit, and no note |

On the prototype: add the crew log with a note in the same browser first; the note is signed Dana Whitfield. See `../fixtures.md`, On the prototype.

## Open questions

- Q-36 — R1, S1 and step 1: the label of the text area, and with it the word for the person who reads the note.
- Q-47 — R3: a length limit and the message at it would add a requirement and a scenario.
- Q-53 — R6, S7 and step 7: whether an import records the person who added it.
- Q-76 — R9, S10 and step 12: if a published import's note must stay readable, R9 says where.
- Q-82 — S1 to S5 and step 5: the count of six.
- Q-88 — the Reset line, and how the recorded reading is served for the Preconditions.
- Q-93 — R3: whether the note can be changed or removed after adding, and from where; an answer adds a requirement and a scenario. R5: if it can, the review shows the note as it stands, not as first written.
- Q-144 — would change R6 and R7: the line under a note would gain the day or another way to tie it to its rows.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | ACN-16, RUL-19; RUL-179 |
| R2 | decided | RUL-19 |
| R3 | decided; shown | ACN-16; RUL-181; relies on story 22, OBJ-1 |
| R4 | shown | RUL-180 |
| R5 | decided; shown | STA-34, RUL-45; RUL-196 |
| R6 | decided | STA-34, RUL-45 |
| R7 | decided; shown | RUL-45, STA-34; RUL-197 |
| R8 | decided | STA-34, RUL-45 |
| R9 | decided; shown | RUL-45, STA-34; RUL-198 |
| R10 | decided | RUL-45 |
| R11 | shown | STA-34, RUL-199 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the text area, last on the check step, 170; emptied when a reading is listed, 940; nothing added and nothing recorded when no change is ticked or one is invalid, 1035-1039; the note recorded on Add, 1059); `src/lib/report-imports.ts` (the import as the prototype models it, with its note, 86-101); `src/components/review/firma2-review-changes.astro` (where the notes sit, 121-122; which notes show and their words, 554-567; kept line breaks and wrapping, 313-323); `src/components/review/firma2-review-inbox.astro` (the inbox draws the same review, note included, for the selected project, 13-19); `src/components/review/review-rows.ts` (every change behind a row counts as waiting, 55-65).
- R11 was written the other way round ("not in the Review inbox") from the inventory's STA-34; the code shows the note in the inbox's pane, and only the inbox's list has none.
- Data shapes, as the prototype models them: an import holds a note beside its project, person, day, document and changes; the note is one optional text, empty when none was written. It is attached to no change.
- What the prototype does where nothing is decided (not requirements): nothing lets the person change or remove the note after Add; a run of spaces inside the note is shown as one space; the line under a note carries no day (Q-144).
- Do not copy: imports, and their notes, kept in the browser's localStorage, so a note shows only in the browser that imported; the hard-coded person.

</details>
