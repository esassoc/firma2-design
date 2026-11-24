# 03 — Kept document: stored with its import, opened only by people who can edit or publish the project

Type: enabler
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 22
Covers: OBJ-5, RUL-25, RUL-191
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #19
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R5, once story 22 records an import; like story 01, only against the recorded readings in `../fixtures.md` until enabler 02 is built. Waiting: what else is kept beside the file in R1 on Q-66; the reading service's copy of an abandoned document in R2 on Q-85; how long a document is kept, and who loses it when, in R4 on Q-45 and Q-77; an import whose document cannot be kept, in R1, on Q-140; the document's name on screens other people read, in R5, on Q-136.

## Capability

This enabler keeps the document an import was read from, and lets only people who can edit or publish that project open it. It unblocks stories 33 (a Manager opens the document in the review), 40 (pasted text kept as a document) and 41 ("Undo" stops keeping the document), and the `later` stories 28 and 29.

## Description

When a Contributor presses "Add N changes", the document they read from becomes the source of every change that import made (story 22 records the import). The document has to outlive the page, so that a Manager can open it later, in the review, at the place a change was read from. Until story 33 is built no screen opens a kept document, so this enabler is confirmed through the review. The prototype keeps the file in the importing person's browser, which nobody else can reach; this enabler is the real capability behind that. See the prototype at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`.

## Requirements

R1. When an import is recorded, the document it was read from is kept with it: the file as it was chosen or dropped, whole, under its name and with its type. Every file that could be read is kept; the limits on what can be read are story 10's. Not decided: whether the passages a reading found are kept beside the file (Q-66); what happens to the import when its document cannot be kept, where the prototype adds the changes without it (Q-140).

R2. A document is kept only once its import exists. A document that was read and never added is not a document of the project: nobody can open it afterwards. Not decided: what the reading service does with the copy it was sent (Q-85).

R3. The kept document stays tied to its import as the source of that import's changes, so that each of those changes leads back to it. Each import keeps its own document: two imports read from the same file, or from two files of one name, each lead back to their own.

R4. Anyone who can edit or publish the project can open the kept document, whoever added the import, before and after the import's changes are published. Not decided: how long it is kept, whether it can be downloaded, who can delete it and whether opening it is logged (Q-45); what happens when a person loses the right to edit or publish, or the project is deleted (Q-77).

R5. Nobody else receives anything of the document, by any route: not its content and not its name. It is never public, before or after the import's changes are published. Not decided: the document's name where it is written on a screen other people may read: the change history row (story 22) and the "From `<document name>`" line on a funding source or contact (stories 17 and 18) (Q-136).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The document beside the changes on the check step, before anything is kept — story 04.
- Pasted text kept as a document, and what it is named — story 40.
- Opening the document from the review — story 33. That it is not listed as a file anywhere — story 24.
- Opening the document from the change history — story 29 (`later`).
- "Undo", which takes the document back with the import — story 41.

## Needs to know from elsewhere

- "Add N changes" records one import, with the document's name — owned by story 22 (R1). The entries it saves are story 01's.
- Leaving the page before "Add N changes" ends the reading and keeps nothing of it — owned by story 01.
- Who can edit a project and who can publish it — owned by `users-and-security`. In these stories a Contributor can edit and a Manager can publish; a Viewer and a visitor can do neither.
- When an import is undone its document is no longer kept and can no longer be opened — owned by story 41 (R4), which is blocked by this enabler and does not hand the case back.
- Which files can be read at all (type, and 20 MB at most) — owned by story 10.

## Scenarios

All run against the recorded crew log reading in `../fixtures.md`.

**S1 — The document is kept with the import** (proves R1)
- Given the check step lists the crew log's six changes for Deer Creek
- When the Contributor presses "Add 6 changes"
- Then the import holds the file `deer-creek-crew-log-2025.xlsx`, the same file that was chosen, under that name

**S2 — A document never added is not kept** (proves R2)
- Given the check step lists the crew log's six changes for Deer Creek, which has no import
- When the Contributor goes back to the project page by the breadcrumb
- Then Deer Creek has no kept document

**S3 — Each change leads back to the document** (proves R3)
- Given the crew log's six changes were added to Deer Creek
- When the import's change for row C2 is read
- Then its document is the kept `deer-creek-crew-log-2025.xlsx`

**S4 — Someone else who can edit opens it** (proves R4)
- Given one Contributor added an import from the crew log to Deer Creek
- When a second person who can edit Deer Creek asks for that import's document
- Then they receive the crew log

**S5 — A Manager opens it** (proves R4)
- Given an import on Deer Creek holds the crew log
- When a Manager who can publish Deer Creek asks for that import's document
- Then they receive the crew log

**S6 — A Viewer receives nothing** (proves R5)
- Given an import on Deer Creek holds the crew log
- When a Viewer in the same workspace asks for that import's document
- Then they receive none of its content and not its name

**S7 — A visitor receives nothing** (proves R5)
- Given an import on Deer Creek holds the crew log
- When someone with no account asks for that import's document
- Then they receive none of its content and not its name

## Verification

No screen opens a kept document until stories 24 and 33 are built, and there a spreadsheet is not shown (story 04, R10), so the script needs the one PDF fixture, the funder report, whose changes also need stories 13, 14, 15, 17, 18, 32 and 75. The script stops after step 3: S2, S6 and S7 have no screen a tester can try them from, and a developer confirms them by asking for the document directly.

Preconditions: two accounts: someone who can edit Deer Creek, and a Manager who can publish it. Stories 13, 14, 15, 17, 18, 24, 32, 33 and 75 are built. Nothing has been imported to Deer Creek. The recorded funder report reading is served for the funder report file.
Test data: `../fixtures.md`: the funder report; "Add 7 changes" waits on Q-82.
Reset: not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | As the person who can edit, open Import a report on Deer Creek, choose `deer-creek-completion-report-2025.pdf` and press "Read it" | After the wait, the changes and "Add 7 changes" |
| 2 | Press "Add 7 changes" | The Deer Creek project page |
| 3 | Sign in as the Manager, open Deer Creek's review and press "From deer-creek-completion-report-2025.pdf" on an imported change | The report itself, beside the changes |

## Open questions

- Q-45 — R4: retention, download, deletion and logging would each add a requirement here.
- Q-66 — R1: whether what is kept includes the passages a reading found.
- Q-77 — R4, S4 and S5: who loses the document, and when.
- Q-82 — step 1: the count of seven.
- Q-85 — R2 and S2: whether a copy of a document that was never added survives anywhere.
- Q-88 — the Reset line, and how the recorded reading is served for the Preconditions.
- Q-136 — would change R5, S6 and S7: whether the document's name may be read by people who cannot open the document.
- Q-140 — would change R1: whether an import whose document cannot be kept is refused; an answer adds a scenario.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | OBJ-5; RUL-191 |
| R2 | decided | OBJ-5 |
| R3 | decided; shown | OBJ-5; RUL-191 |
| R4 | decided | RUL-25 |
| R5 | decided | RUL-25 |

- Prototype files: `src/lib/report-imports.ts` (the import and its document, 86-101; one kept file per import, the import recorded even when the file was not kept, and the file dropped on "Undo", 151-181); `src/lib/page-files.ts` (where the prototype keeps the file); `src/lib/report-source.ts` and `src/components/shared/firma2-report-source.astro` (how a kept document is shown); `src/data/firma2-report-import.ts` (the document as the prototype models it).
- Data shapes, as the prototype models them: a source document holds a name and either the file or pages, each with a label and passages (optional heading, lines). A chosen or dropped file is kept as the file and nothing else; pasted text has no file and is kept as its passages (story 40). The import records the document's name and its kind.
- What the prototype does where nothing is decided (not a requirement): when the browser cannot keep the file, the import is recorded without it and nothing is said (Q-140).
- Do not copy: the file kept in the importing browser only; the preview read from the page's memory; the document kind "sample", which exists for the demo buttons; the absence of any permission check on the document. The prototype keeps nothing before "Add N changes" only because the chosen file never leaves the page; a build that sends the file away to be read has to meet R2 on purpose.

</details>
