# 24 — A Manager sees which waiting changes came from a document, and the words each was read from

Type: story
Epic: C — Imported changes in review
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-37, Q-45, Q-53, Q-86, Q-97, Q-130, Q-136, Q-141, Q-142
Revision: 1
Blocked by: 22
Covers: SCR-5, STA-32, RUL-24, RUL-192, RUL-193, RUL-194, RUL-195, RUL-361, RUL-362, RUL-363, RUL-364, RUL-365, RUL-366, RUL-367, RUL-368
Sources: the project's review, `/prototypes/review/deer-creek-riparian-corridor-enhancement`, after adding the sample crew log; spec #31, #42
Snapshot: not yet captured
Read with: `../epics/E-C-imported-changes-in-review.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (SCR, STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R8, once story 22 is built (it records the import, and the parts, quote and document name each row reads), inside the review that `publish-review` owns: its rows, its differences and Publish are used here, not built here, and its requirements are not written yet. Against the recorded samples `deer-creek-crew-log-2025.xlsx` and `deer-creek-treatments-2025.pdf`. R7 can be built against an import recorded as naming another project; it is shown with a real report only once story 20 is built.

## Story

As a Manager, I want each waiting change that came from a document to name that document and show the words it was read from, so that I can judge the change against its source before I publish it.

## Description

Changes an import adds are on the record at once and are not public until a publish. The Manager meets them in the project's review, which `publish-review` owns. This story adds what an imported change carries inside that screen: its row, who added it and when, the name of its document, and the quote, which is the words the change was read from. The file is not kept (spec #42), so nothing on the row opens a document: the quote is what the Manager judges the change against. Story 22 comes before this one, because the row reads the import's record. Story 21 is the import's note above the changes, and story 85 the row for a field that was set more than once. See it at `/prototypes/review/deer-creek-riparian-corridor-enhancement`, after adding the sample crew log in the same browser. The prototype draws a button that opens the document, and no quote on the row; the button is not in the product and the quote on the row is not yet prototyped.

## Requirements

R1. In the project's review, each change an import added that is still waiting is one row, in the section of the project page it belongs to. The review words an imported row as it words a hand-made one of the same kind, from the parts the import recorded: an entry is "`<Measure>`, `<reporting period>`" with its amount and unit; a funding source is labelled with the grant's name and reads "`<amount>` from `<organization>`". The value is drawn as the review draws any difference. Each imported entry is its own row, even when two imports add entries for one performance measure and reporting period: rows are folded for a field, never for an entry. A section with no other waiting change appears, under its heading, when an import adds to it.

R2. An imported row shows "`<who>` · `<day>`": the person who added the import and the day it was added, in the time zone of the person reading, written as "30 September 2026" (no leading zero, the month in full). It shows them on a project that has never been published too, where rows for hand edits show no person or day.

R3. An imported row names its document as plain text, "From `<document name>`": the file's name, or "From pasted text" when the document was pasted text. Under it the row shows the change's quote, as recorded: where the words are written, then the words. Nothing on the row opens a document, and the row has no button for one.
- The quote is plain text and wraps; it is shown whole.
- A name too long for the row wraps or is cut short on screen and never widens the page; the full name stays available to assistive technology.

R4. A row for a hand edit names no source and shows no quote.

R5. No file exists anywhere: the document is not stored, not listed on the project and not offered for download on any screen. Its name appears only as the source of the changes its import added.

R6. Within a section, imported rows come after the rows for hand edits: in the order the imports were added, and within one import in the order the check step listed its changes.

R7. When an import's report named another project, the review shows, above the changes and once for that import, "This report names another project: “`<name>`”.", with the name as the report writes it. The line carries the same line as a note does, "`<who>` · `<day>`, with `<document name>`", so the Manager can tell which rows it speaks of; when the import also left a note (story 21), the two stand together over one such line. The line is shown while at least one change of that import is waiting.

R8. The document's name and the quote reach only people who can edit or publish the project. The review is seen only by someone who can publish it (SR-3); nobody else is sent a name or a quote from it, by any route, before or after a publish.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The import's note above the changes — story 21.
- Pasting a report's text — story 09. An import whose document is pasted text — story 40.
- A row that stands for two imports of one field, for an import over a hand edit, or for a hand edit made after an import — story 85.
- Opening or keeping the document: not in the product (spec #42).
- Warning the Contributor that the report names another project — story 20.
- The review itself, its rows for hand edits, Publish and the Review inbox — `publish-review`. Hold, Revert and row markers — `publish-review`, build 2.

## Needs to know from elsewhere

- The review lists a project's unpublished changes by section of the project page, each with the difference from the published version. It is opened with "Review changes" on the project page, and the Review inbox shows the same review for the project selected in it, so R1 to R8 hold in both — owned by `publish-review`.
- How a difference is drawn: a value the public page does not have reads "New: `<value>`"; a changed value reads the published value struck, then the record's; on a project never published each row is the value alone — owned by `publish-review`. It has one way of wording every row, which is what R1 relies on.
- A change waits from the moment it is added until it is published; a published change leaves the review, and nothing then leads from it to its document's name or quote on this screen — owned by `publish-review`. A row also goes when its import is taken back — owned by story 23.
- An import records who added it, the time, the document's name, whether the report named another project, and for each change its section, its parts, its quote and its place — owned by story 22 (R1, R2). The parts of the other kinds of change are owned by stories 15, 17 and 18.
- When a report names another project, and how the name is matched — owned by story 20.
- Only someone who can publish the project sees its review (SR-3) — owned by `users-and-security`.

## Scenarios

All start from Deer Creek's starting state in `../fixtures.md`, with the crew log added and nothing published since. S8 adds the treatments sample as a second import. No sample gives a project never published or a report that names another project; S9 and S10 describe those by kind.

**S1 — An imported change is a row in its section** (proves R1)
- Given the crew log's six changes were added to Deer Creek
- When a Manager opens Deer Creek's review
- Then a Performance measures section, which had no waiting change before, holds six rows; C2's row reads "Native trees and shrubs planted, 2025" and "New: 1,850 plants"

**S2 — The row says who and when** (proves R2)
- Given a Contributor added the crew log's six changes to Deer Creek
- When a Manager opens Deer Creek's review on a later day
- Then each of the six rows shows that Contributor's name, " · ", and the day the import was added, written like "30 September 2026"

**S3 — The row names its document** (proves R3)
- Given the crew log's six changes were added from `deer-creek-crew-log-2025.xlsx`
- When a Manager opens Deer Creek's review and tries to press the source line of a row
- Then each of the six rows reads "From deer-creek-crew-log-2025.xlsx" as text, and pressing it does nothing

**S4 — The row shows the words the change was read from** (proves R3)
- Given the crew log's six changes were added to Deer Creek
- When a Manager reads the row for C2
- Then under "From deer-creek-crew-log-2025.xlsx" it shows "Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”"

**S5 — A hand edit names no source** (proves R4)
- Given the crew log's six changes and Deer Creek's waiting hand edit to estimated total cost
- When a Manager opens Deer Creek's review
- Then the row "Estimated total cost" has no "From …" line and no quote

**S6 — The document is not a file anywhere** (proves R5)
- Given the crew log's six changes were added to Deer Creek
- When a Manager reads the review, and someone who can edit Deer Creek reads every section of its project page
- Then nothing lists `deer-creek-crew-log-2025.xlsx` as a file, opens it or offers it for download

**S7 — Imported rows keep the order they were listed in** (proves R6)
- Given the crew log's six changes were added to Deer Creek in one import
- When a Manager opens Deer Creek's review
- Then the six rows under Performance measures are in the order C1, C2, C3, C4, C5, C6

**S8 — Two entries for one measure and period are two rows** (proves R1, R6)
- Given the crew log's six changes were added to Deer Creek, then the treatments sample's two
- When a Manager opens Deer Creek's review
- Then Performance measures holds eight rows, the treatments rows last; two of them read "Acres of invasive vegetation removed, 2025": one "New: 3.7 acres" "From deer-creek-crew-log-2025.xlsx", one "New: 4.2 acres" "From deer-creek-treatments-2025.pdf" with the quote "Treatments, page 1 — “Riparian invasive plant control, 4.2 acres”"

**S9 — A project never published** (proves R2)
- Given a project that has never been published, with one hand edit and one import of two entries
- When a Manager opens its review
- Then the two imported rows show the person, the day, "From `<document name>`" and their quotes, and the hand edit's row shows none of them

**S10 — The report named another project** (proves R7)
- Given an import recorded as naming another project, with no note, whose changes are waiting
- When a Manager opens the project's review
- Then above the changes is "This report names another project: “`<name>`”.", once, with the name as the report writes it, and under it the import's person, day and document name

**S11 — Nobody else receives the name or the quote** (proves R8)
- Given the crew log's six changes were added to Deer Creek
- When a person who can neither edit nor publish Deer Creek opens the address of its review
- Then they are given no review, and nothing sent to them holds the file's name or any quote

## UAT script

Preconditions: the test environment serves the recorded samples `deer-creek-crew-log-2025.xlsx` and `deer-creek-treatments-2025.pdf`. Deer Creek is in its starting state. Two accounts: a Contributor who can edit Deer Creek (steps 1 and 2), and a Manager of Deer Creek Watershed Alliance or an Administrator (steps 3 to 10). Note the Contributor's name and the day.
Test data: `../fixtures.md`: the crew log, rows C1 to C6; the treatments sample, rows T1 and T2; Deer Creek's waiting hand edits. The treatments sample is to be made. No sample puts an imported row and a hand edit's row in one section, so the first sentence of R6 is checked with data made for the purpose.
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | As the Contributor, open the Deer Creek project page, press "Import a report" on the Performance measures card, choose `deer-creek-crew-log-2025.xlsx`, press "Read it", wait, and press "Add 6 changes" | The project page, with the message "6 changes added from deer-creek-crew-log-2025.xlsx" |
| 2 | Import `deer-creek-treatments-2025.pdf` the same way, pressing "Add 2 changes" | The message "2 changes added from deer-creek-treatments-2025.pdf" |
| 3 | Sign in as the Manager, open the Deer Creek project page and press "Review changes" | The review, with the waiting changes under the project page's sections |
| 4 | Read the rows under Performance measures | Eight rows: the crew log's six in the order of rows C1 to C6, then the two of the treatments sample |
| 5 | Find the row "Native trees and shrubs planted, 2025" | "New: 1,850 plants"; the Contributor's name, " · " and the day you noted; "From deer-creek-crew-log-2025.xlsx"; under it "Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”" |
| 6 | Press "From deer-creek-crew-log-2025.xlsx" on that row | Nothing opens |
| 7 | Find the rows "Acres of invasive vegetation removed, 2025" | Two rows: 3.7 acres from the crew log, and 4.2 acres "From deer-creek-treatments-2025.pdf" with "Treatments, page 1 — “Riparian invasive plant control, 4.2 acres”" |
| 8 | Find the row "Estimated total cost" under Key facts, which was typed by hand | No "From …" line and no quote on it |
| 9 | Open the Review inbox and select Deer Creek | The same eight rows, with the same source lines and quotes |
| 10 | Go back to the project page and read every section, looking for either file as a file or a download | Neither is listed anywhere |

On the prototype: add the crew log in the same browser first; every row is signed Dana Whitfield, 30 September 2026; the row has a button that opens the kept document and no quote. See `../fixtures.md`, On the prototype.

## Open questions

None open. This story rests on these proposed answers:

- Q-45 (proposed) — R3, S3, S4 and steps 5 to 7: the document's name and the quote are what the row shows. That no file is kept and nothing opens is decided (spec #42).
- Q-141 (proposed) — R1, S1 and step 5: an imported row is worded as a hand-made one.
- Q-97 (proposed) — R1, S8 and step 7: each imported entry is its own row.
- Q-53, Q-86 (proposed) — R2 and S2: the person and the day, in the reader's time zone.
- Q-142 (proposed) — R2 and S9: an imported row keeps its person, day and source on a project never published.
- Q-37 (proposed) — R4 and S5: a hand edit's row names no source. It amends spec #31.
- Q-130 (proposed) — R7 and S10: the line that says the report named another project.
- Q-136 (proposed) — R8 and S11: who receives the name and the quote.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown; proposed (Q-141); proposed (Q-97) | SCR-5, STA-32; RUL-192; RUL-361; RUL-362 |
| R2 | decided; shown; proposed (Q-53, Q-86); proposed (Q-142) | STA-32; RUL-193; RUL-363; RUL-364 |
| R3 | decided (spec #42); proposed (Q-45), the quote on the row not yet prototyped | STA-32, RUL-194; RUL-365 |
| R4 | shown; proposed (Q-37) | STA-32; RUL-366 |
| R5 | decided (spec #42) | RUL-24 |
| R6 | shown | RUL-195 |
| R7 | proposed (Q-130), not yet prototyped | RUL-367 |
| R8 | proposed (Q-136) | RUL-368 |
- Prototype files: `src/components/review/firma2-review-changes.astro` (the imported row and its button, 179-198 and 522-552; where rows are placed, 569-590; the cut-short name, 288-302); `src/components/review/review-rows.ts` (imported changes laid over hand edits, 46-80); `src/components/review/firma2-review-inbox.astro` (the same review inside the inbox, 13-19); `src/lib/review-diff.ts` (how a difference is drawn, `publish-review`'s); `src/lib/report-imports.ts` (the imported change and its document; the source line's words, 204-205).
- Data shapes, as the prototype models them: an imported change holds its section, a finished label, the value before (absent when it adds something), the value left on the record, its quote, passage and page. Its import holds who added it, the day and the document's name and kind.
- Where the prototype differs from the requirements: imported rows read "`<Measure>` · `<reporting period>`" and "Funding source" while hand-made rows read "`<Measure>`, `<year>`" and the grant's name (R1 words both alike); the source is a button that opens the kept document, and the quote is shown only in that pane (R3); there is no permission check (R8). The Hold and Revert buttons and the "Changed from the document's figure" badge on an imported row are build 2.
- Do not copy: the document pane and its button; a "Sample" document named like a file; imports read from the browser's localStorage, so the review shows imported rows only in the browser that imported them; the hard-coded person and day.

</details>
