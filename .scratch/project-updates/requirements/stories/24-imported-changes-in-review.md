# 24 — A Manager sees which waiting changes came from a document, and which document

Type: story
Epic: C — Imported changes in review
Release: first
Status: needs-info
Revision: 1
Blocked by: 22
Covers: SCR-5, STA-32, RUL-24, RUL-192, RUL-193, RUL-194, RUL-195
Sources: the project's review, `/prototypes/review/deer-creek-riparian-corridor-enhancement`, after adding the sample crew log; spec #19, #31
Snapshot: not yet captured
Read with: `../epics/E-C-imported-changes-in-review.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (SCR, STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R6, once story 22 is built (it records the import, and the label and value each row reads) and inside the review that `publish-review` owns: its rows, its differences and Publish are used here, not built here, and its requirements are not written yet. Like story 22, only against the recorded crew log reading in `../fixtures.md` until enabler 02 is built. Waiting: the parts marked "Not decided" or "open", each on the question named beside it; the count of six on Q-82.

## Story

As a Manager, I want each waiting change that came from a document to name that document, so that I know which changes I can judge against a source before I publish them.

## Description

Changes an import adds are on the record at once and are not public until a publish. The Manager meets them in the project's review, which `publish-review` owns. This story adds what an imported change carries inside that screen: its row, who added it and when, and a button that names its document. Story 22 comes before it, because the row reads the import's record. Story 33 is what the button opens, and story 21 is the import's note above the changes. See it at `/prototypes/review/deer-creek-riparian-corridor-enhancement`, after adding the sample crew log in the same browser.

## Requirements

R1. In the project's review, each change an import added that is still waiting is one row, in the section of the project page it belongs to. The row carries the label and the value the import recorded for the change, drawn as the review draws any difference. A section with no other waiting change appears, under its heading, when an import adds to it. (open: Q-97) Not decided: whether an imported row and a hand-made row for the same kind of thing are worded alike (Q-141).

R2. An imported row shows "`<who>` · `<date>`": the person who added the import and the day it was added, the day written as "30 September 2026" (no leading zero, the month in full). A row that stands for an import over a hand edit shows the import's person and day, not the hand edit's. (open: Q-53, Q-86) Not decided: a project that has never been published, where rows for hand edits show no person or day (Q-142).

R3. An imported row has a button, "From `<document name>`", naming the import's document: the file's name, or "From pasted text" when the document was pasted text.
- To assistive technology the button's name is "From `<document name>`, `<row label>`", so the buttons of one import can be told apart.
- A name too long for the row is cut short on screen and never widens the page; the button's full name stays available to assistive technology.

R4. A row for a hand edit names no source and has no such button. (open: Q-37) Not decided: a field an import set that a person then edits by hand before a publish (Q-143).

R5. The document is not listed as a file anywhere on the project. Its name appears only as the source of the changes its import added.

R6. Within a section, imported rows come after the rows for hand edits: in the order the imports were added, and within one import in the order the check step listed its changes. A row that stands for an import over a hand edit stays where the hand edit's row was.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- What the button opens — story 33.
- The import's note above the changes — story 21.
- Pasting a report's text — story 09. The pasted text kept and named "pasted text" as the import's document — story 40.
- A row that stands for two imports of one field — story 51.
- Keeping the document, and who may open it — enabler 03. Opening it from the change history — story 29 (`later`).
- The review itself, its rows for hand edits, Publish and the Review inbox — `publish-review`. Hold, Revert and row markers — `publish-review`, build 2.

## Needs to know from elsewhere

- The review lists a project's unpublished changes by section of the project page, one row per field, each with the difference from the published version. It is opened with "Review changes" on the project page, and the Review inbox shows the same review for the project selected in it, so R1 to R6 hold in both — owned by `publish-review`.
- How a difference is drawn: a value the public page does not have reads "New: `<value>`"; a changed value reads the published value struck, then the record's; on a project never published each row is the value alone — owned by `publish-review`.
- An import that set a field a hand edit had already changed is one row: the hand edit's label and published value, the import's value and source — owned by `publish-review`.
- A change waits from the moment it is added until it is published; a published change leaves the review, and no screen then leads from it to its document — owned by `publish-review`; whether one should is Q-76. A row also goes when its import is taken back — owned by story 23, not needed here.
- An import records who added it, the day, the document's name and, for each change, its section, label ("`<Measure>` · `<reporting period>`") and value ("1,850 plants") — owned by story 22 (R1, R2). The labels and values of the other kinds of change are owned by stories 15, 17 and 18.
- Only someone who can publish the project sees its review (SR-3) — owned by `users-and-security`.

## Scenarios

All run against the recorded crew log reading in `../fixtures.md`, added to Deer Creek from its starting state and not yet published.

**S1 — An imported change is a row in its section** (proves R1)
- Given the crew log's six changes were added to Deer Creek
- When a Manager opens Deer Creek's review
- Then a Performance measures section, which had no waiting change before, holds six rows, each with the label of its fixture row; C2's row reads "Native trees and shrubs planted · 2025" and "New: 1,850 plants"

**S2 — The row says who and when** (proves R2)
- Given a Contributor added the crew log's six changes to Deer Creek
- When a Manager opens Deer Creek's review on a later day
- Then each of the six rows shows that Contributor's name, " · ", and the day the import was added, written like "30 September 2026"

**S3 — The row names its document** (proves R3)
- Given the crew log's six changes were added from `deer-creek-crew-log-2025.xlsx`
- When a Manager opens Deer Creek's review
- Then each of the six rows has a button "From deer-creek-crew-log-2025.xlsx"

**S4 — A hand edit names no source** (proves R4)
- Given the crew log's six changes and Deer Creek's waiting hand edit to estimated total cost
- When a Manager opens Deer Creek's review
- Then the row "Estimated total cost" has no "From …" button

**S5 — The document is not a project file** (proves R5)
- Given the crew log's six changes were added to Deer Creek
- When someone who can edit Deer Creek reads every section of its project page
- Then no section lists `deer-creek-crew-log-2025.xlsx` as a file or offers it for download

**S6 — Imported rows keep the order they were listed in** (proves R6)
- Given the crew log's six changes were added to Deer Creek in one import
- When a Manager opens Deer Creek's review
- Then the six rows under Performance measures are in the order C1, C2, C3, C4, C5, C6

**S7 — The buttons can be told apart without sight** (proves R3)
- Given the crew log's six changes were added from `deer-creek-crew-log-2025.xlsx`
- When a Manager reads the row for C2 with a screen reader
- Then its button is named "From deer-creek-crew-log-2025.xlsx, Native trees and shrubs planted · 2025"

## UAT script

Preconditions: story 01's UAT script has been run to its end by a Contributor, so the crew log's six changes are on Deer Creek; nothing has been published since. Note that Contributor's name and the day. Signed in as a Manager of Deer Creek Watershed Alliance, or an Administrator.
Test data: `../fixtures.md`: the crew log, rows C1 to C6; Deer Creek's waiting hand edits. Rows C3 and C4, and so the count of six, wait on Q-82. No fixture puts an imported row and a hand edit's row in one section, so the first sentence of R6 is checked with data made for the purpose; its last sentence shows once story 15 lets the funder report's row F1 set the Timeline.
Reset: none needed for this script, which changes nothing. Taking the six entries off again is not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and press "Review changes" | The review, with the waiting changes under the project page's sections |
| 2 | Read the rows under Performance measures | Six rows, labelled as rows C1 to C6 and in that order |
| 3 | Find the row "Native trees and shrubs planted · 2025" | "New: 1,850 plants"; the Contributor's name, " · " and the day you noted; a button "From deer-creek-crew-log-2025.xlsx" |
| 4 | Find the row "Estimated total cost" under Key facts, which was typed by hand | No "From …" button on it |
| 5 | Open the Review inbox and select Deer Creek | The same six rows, with the same buttons |
| 6 | Go back to the project page and read every section, looking for the crew log as a file or a download | It is not listed anywhere |

On the prototype: add the crew log in the same browser first; every row is signed Dana Whitfield, 30 September 2026. See `../fixtures.md`, On the prototype.

## Open questions

- Q-37 — R4, S4 and step 4: if every row names its source the same way, a hand edit's row names one too.
- Q-53, Q-86 — R2, S2 and step 3: whether an import records the person and the day, and which clock decides the day.
- Q-76 — the fourth line of Needs to know: if a published change must still lead to its document, a requirement is added here.
- Q-82 — S1 to S3, S6 and steps 2 and 3: the count of six.
- Q-88 — the Preconditions: how the recorded reading is served, and how Deer Creek is returned to its starting state.
- Q-97 — R1: if two entries for one performance measure and reporting period are one row, "one row for each change" gains that exception.
- Q-141 — would change R1, S1 and step 3: the label and value an imported row shows, if they must match a hand-made row's wording.
- Q-142 — would change R2: on a project never published, an imported row would lose its person and day, or every row would gain them.
- Q-143 — would change R3 and R4: which rows carry the button once a hand edit follows an import of the same field; adds a scenario.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | SCR-5, STA-32; RUL-192 |
| R2 | decided; shown | STA-32; RUL-193 |
| R3 | decided; shown | STA-32; RUL-194 |
| R4 | shown | STA-32 |
| R5 | decided | RUL-24 |
| R6 | shown | RUL-195 |

- Prototype files: `src/components/review/firma2-review-changes.astro` (the imported row and its button, 179-198 and 522-552; where rows are placed, 569-590; the cut-short name, 288-302); `src/components/review/review-rows.ts` (imported changes laid over hand edits, 46-80); `src/components/review/firma2-review-inbox.astro` (the same review inside the inbox, 13-19); `src/lib/review-diff.ts` (how a difference is drawn, `publish-review`'s); `src/lib/report-imports.ts` (the imported change and its document; the button's words, 204-205).
- Data shapes, as the prototype models them: an imported change holds its section, label, the value before (absent when it adds something) and the value left on the record. Its import holds who added it, the day and the document's name and kind.
- What the prototype does where nothing is decided (not requirements): a hand-filed entry's row is labelled "`<Measure>`, `<year>`" and a hand-added funding source's row by its name with "`<amount>` from `<organization>`", while imported rows read "`<Measure>` · `<reporting period>`" and "Funding source" (Q-141); an imported row always shows its person and day (Q-142); a hand edit made after an import cannot be made to show, because the sample's hand edits are fixed (Q-143). The Hold and Revert buttons and the "Changed from the document's figure" badge on an imported row are build 2.
- Do not copy: a "Sample" document named on the button like a file; imports read from the browser's localStorage, so the review shows imported rows only in the browser that imported them; the hard-coded person and day; the absence of any permission check.

</details>
