# 40 — A Contributor's pasted text is kept and named as the import's document

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 03, 09, 22, 31, 33
Covers: RUL-29, RUL-188, RUL-189, RUL-190
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement`; spec #19, #21
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 and R2, once story 09 reads pasted text and story 22 records an import and lists it in the change history; only against the recorded reading of the pasted paragraph in `../fixtures.md` until enabler 02 is built. Can start only against a stand-in for enabler 03 (not built): R3, which is seen in the review once stories 33 and 31 are built (opening an import's document there, and how passages are drawn, are used here, not built here). Waiting: the rules for keeping the text in R3 on Q-45; whether the reading service's own passages are kept in its place, in R3, on Q-66; a name that tells two pasted documents apart, in R2, and exactly what is kept, in R3, on Q-139; the count of three on Q-82.

## Story

As a Contributor, I want text I pasted to count as the import's document just as a file would, so that the changes I add from it can be traced back to the words they came from.

## Description

Story 09 takes pasted text as far as the check step. This story covers what pressing "Add N changes" leaves behind when the document was pasted: an import whose document is the pasted text, the text kept so it can be opened later, and the words "pasted text" wherever a file's name would stand. Split from story 09 on 2026-11-23. Reordered on 2026-11-23: it is also blocked by stories 22, 31 and 33, so the document's name is seen in the change history and the kept text in the review. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement`, after adding the pasted paragraph.

## Requirements

R1. An import added from pasted text records that its document was pasted text, not a file. The document has no file name. A file left in the file control when the text was read (story 09, R4) is no part of the import and is not kept.

R2. Wherever the import's document is named, the words "pasted text" stand in place of a file name. The toast on the project page reads "`<N>` changes added from pasted text", or "1 change added from pasted text" for one. On the screens other stories own, once each is built, the same words stand: "`<N>` changes from pasted text" in the change history (story 22), "From pasted text" on a row of the review (story 24), on a funding source's row (story 17) and on a contact's row (story 18), and "`<who>`, with pasted text" under the note (story 21). Not decided: anything that tells one pasted document from another; two such imports on one project are named alike (Q-139).

R3. The pasted text is kept as the import's document, as a file is: the text as it stood when "Read it" was pressed, paragraph by paragraph in the order pasted. A paragraph ends at a blank line; a single line break stays inside its paragraph. The people who can open a kept file can open it. Not decided: whether the text is kept exactly as typed, where the prototype drops the spaces around each paragraph and the extra blank lines between them (Q-139); whether passages the reading service returns for the text are kept in place of this cut (Q-66); whether pasted text is held to the same rules as a file for how long it is kept, downloading, deleting and logging (Q-45).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The change history row, the review row, the funding source row, the contact row and the note's line themselves — stories 22, 24, 17, 18 and 21. Each states its own wording for pasted text or leaves it to R2 here; none hands the rule back.
- The pasted text shown beside the changes, on the check step and in the review — stories 31 and 33.
- "Undo" on the toast — story 23.

## Needs to know from elsewhere

- "Add N changes" saves the entries and returns the person to the project page — owned by story 01.
- Each press of "Add N changes" records one import: the project, who added it, the day, the document and each change — owned by story 22 (R1). The toast counts the changes the import added, and the person can dismiss it — owned by story 01 (R12, R13).
- An import has one row in the change history, whose "Change" reads "`<N>` changes from `<document name>`" — owned by story 22 (R3, R4).
- An imported row of the review has a button, "From `<document name>`"; pressing it opens that import's document beside the difference, for a Manager or an Administrator — owned by stories 24 (R3) and 33 (R1).
- A document kept as passages is drawn as its pages and passages; for pasted text no passage is marked — owned by story 31 (R2).
- The kept document — enabler 03, not built. This story hands it the pasted text when the import is added. It gives the text back to anyone who can edit or publish the project, and to nobody else.
- What the check step lists for pasted text, and that text is read whatever the file control holds — owned by story 09 (R4).

## Scenarios

All run against the recorded reading of the pasted paragraph in `../fixtures.md`. It is one paragraph and proposes only performance measure entries, so the paragraph rule of R3 and the funding source and contact wording of R2 have no scenario; no fixture has a pasted text of several paragraphs.

**S1 — The import's document is pasted text** (proves R1)
- Given the check step lists the pasted paragraph's three changes for Deer Creek, which has no import
- When the Contributor presses "Add 3 changes"
- Then Deer Creek has one import, whose document is recorded as pasted text with no file name

**S2 — The toast says "pasted text"** (proves R2)
- Given the check step lists the pasted paragraph's three changes
- When the Contributor presses "Add 3 changes"
- Then the Deer Creek project page shows a success toast, "3 changes added from pasted text"

**S3 — The text is kept** (proves R3)
- Given the pasted paragraph's three changes were added to Deer Creek, and none is published
- When a Manager presses "From pasted text" on one of their rows in Deer Creek's review
- Then it is the paragraph as pasted: its four sentences, word for word, as one paragraph

## UAT script

Preconditions: story 09's UAT script has been run to its step 10, so the check step lists the pasted paragraph's three changes. Nothing has been imported to Deer Creek. A second account exists for steps 3 and 4: a Manager of Deer Creek Watershed Alliance, or an Administrator.
Test data: `../fixtures.md`: the pasted paragraph. The count of three waits on Q-82. No fixture has a pasted text of several paragraphs, or one that proposes a single change.
Reset: not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | Press "Add 3 changes" | The Deer Creek project page, with a message "3 changes added from pasted text" |
| 2 | Press History in the header, read the top row, and close the change history | "3 changes from pasted text" |
| 3 | Sign in as a Manager of Deer Creek Watershed Alliance, open the Deer Creek project page and press "Review changes" | The review; under Performance measures, three rows labelled as rows P1 to P3, each with a button "From pasted text" |
| 4 | Press "From pasted text" on the row "Acres of riparian habitat restored · 2025" | Beside the review, the paragraph as pasted: its four sentences, word for word, as one paragraph |

Step 1 covers R2; step 2, R1 and R2; steps 3 and 4, R2 and R3.

## Open questions

- Q-45 — R3: if pasted text is held to other rules than a file, R3 states them.
- Q-82 — S1 to S3 and steps 1 and 2: the count of three.
- Q-88 — the Reset line.
- Q-66 — R3: part (b), whether the reading service's passages for pasted text are what is kept.
- Q-139 — would change R2 and R3: a name that tells pasted documents apart, and whether the text is kept exactly as typed.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | RUL-29; RUL-189, RUL-190; relies on story 22, OBJ-1, RUL-76 |
| R2 | decided; shown | RUL-29; RUL-190; relies on story 01, STA-26 |
| R3 | decided; shown | RUL-29; RUL-188; relies on story 03, OBJ-5 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (pasted text cut into paragraphs, 517-529; which document a reading has, 531-538; the import recorded on Add, with the file kept only for a file, 1048-1063); `src/lib/report-imports.ts` ("From pasted text", 203-205); `src/components/projects/firma2-project-imported.astro` (the toast, 103-114).
- Data shapes, as the prototype models them: a document has a name and a kind (file or pasted text). A pasted document has no file; it is held as one page labelled "Pasted text" with one passage for each paragraph, and the import records the name "Pasted text" beside the kind, which no screen shows.
- Do not copy: imports and their documents kept in the browser; the document kind "sample".

</details>
