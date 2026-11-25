# E-A — A Contributor gets a report's figures onto the project's record, and can take them back

Feature: project-updates
Release: mixed
Status: needs-triage

## Goal

Someone who can edit a project takes one report from a file (or pasted text) to changes on the project's record without retyping it, checks each change against the document first, and can take the whole import back. The first release ships with performance measure entries alone; epic B adds the other kinds of change.

## Actors

- Contributor (anyone who can edit the project: a Contributor on a project an organization of theirs leads, or an Administrator): chooses a report, checks what was read against the document, adds the changes, may undo them.
- Administrator: reads what is agreed and turns reading by an outside AI service on or off for the workspace (story 82).
- Viewer and visitor: get nothing here. They never see the page, a document's name, a quote or an imported value until it is published (story 12).

## Decisions that shape every story

| Source | Decision |
|---|---|
| spec #1 | Changes added by an import save to the record at once. Nothing here is a request for approval. |
| spec #2 | Imported values are not public until a publish; until then they count as unpublished changes on the project. Owned by `publish-review`. |
| spec #6 | The interface never uses "project update" as a noun. |
| spec #7 | Import a report is a page of its own. There is no side-sheet version. |
| spec #12; interview 2026-11-23, Q-20 | The check step is the built page: the document beside the proposed changes, grouped by the project page's sections. The three experiment layouts are not requirements. |
| spec #18 | The commit button states the count ("Add 9 changes"). There is no second confirmation. A toast on the project page offers Undo. |
| spec #20 | One document per import. Several documents at once, a document covering several projects and an entry from My Projects stay out (proposed, Q-29). |
| spec #21; interview 2026-11-23, Q-22 | Available to anyone who can edit the project, on every plan. The workspace permission "Import data" governs bulk project import, not this. |
| interview 2026-11-23, Q-23 | First release: the person waits on the page while the document is read. A reading is not stored. |
| interview 2026-11-23, Q-24 | Undo is offered on the toast only. |
| interview 2026-11-23, Q-28 | Offered on any project the person can edit, whatever its stage, including proposals, completed projects and shared projects. |
| spec #41 (the user, 2026-11-23, Q-52) | Reading by an outside AI service is a workspace setting: off until an Administrator agrees and turns it on; it can be turned off again, and can be unavailable to a workspace. While off or unavailable, Import a report is not offered and the place it would be says why (stories 82, 83). Nothing of the first release ships without them. |
| spec #42 (the user, 2026-11-23, Q-45) | The file is not kept after the import is added or abandoned; pasted text likewise. The document's name and each change's quote stay (proposed, Q-45). Replaces spec #19. |
| interview 2026-11-23, Q-135 | A funding source and a contact can be edited and removed on the project page (story 81, owned by `project-record`). |
| proposed, Q-64 | Undo stays on the toast only; the toast is announced and its "Undo" is a button reachable by keyboard. |
| proposed, Q-109 | The right to edit is checked again on "Read it" and on "Add N changes". |
| proposed, Q-38, Q-47 | File types: PDF, .docx, .xlsx, .csv, .txt. Limits: 20 MB; 100 pages or 5,000 rows; 50,000 pasted characters. |
| inventory RUL-33 (shown) | A model reads and maps; code does the arithmetic; the page checks against the record; a person commits. |

## Out of scope

- Every kind of change beyond a clean performance measure entry, and every case that waits on the person — epic B.
- The Manager's view of imported changes in the review, and the note for the reviewer, written on the check step and read there — epic C (stories 24, 21, 85).
- The unpublished-changes badge, "not public until a publish", the one-row fold in the review, and Publish itself — `publish-review`.
- Hold, Revert with a reason, row markers and their notifications — `publish-review`, build 2.
- Setting up a data source from this layout (spec #26) — not in build 1 (interview 2026-11-23, Q-29).
- Several documents in one import; a document covering several projects; an entry from My Projects — the spec's Out of scope list (proposed, Q-29).
- Keeping or opening the document after the import is added — not in the product (spec #42).
- Speech input — not offered (spec #21; story 09 states it).
- The three experiment layouts at `/proto/import-report` — dropped (Q-20).
- Deleting `/prototypes/team-5` (spec #39) — `team-5-sandbox`; Q-3.

## Stories, by dependency

| # | Story | Type | Release | Blocked by | Wave |
|---|---|---|---|---|---|
| 02 | Reading service: a model reads the document, code does the arithmetic | enabler | first | none | 1 |
| 81 | A Contributor edits or removes a funding source or a contact on the project page | story | first | none | 1 |
| 82 | An Administrator agrees to reading by an outside AI service and turns it on or off for the workspace | story | first | none | 1 |
| 01 | Walking skeleton. A Contributor adds performance measure entries read from one report file | story | first | 02 | 2 |
| 04 | A Contributor checks each change against the document beside it | story | first | 01 | 3 |
| 09 | A Contributor pastes the report's text instead of choosing a file | story | first | 01 | 3 |
| 10 | A Contributor is told why a file was not read | story | first | 01 | 3 |
| 22 | A Contributor's import is recorded and listed in the project's change history | story | first | 01 | 3 |
| 35 | A Contributor leaves Import a report, or starts again, without adding anything | story | first | 01 | 3 |
| 05 | A Contributor on a narrow screen opens a change's source and comes back to the same change | story | first | 04 | 4 |
| 06 | A Contributor chooses which changes to add | story | first | 01, 04 | 4 |
| 08 | A Contributor starts an import from the project header, or by dropping a file on the project page | story | first | 01, 10 | 4 |
| 11 | A Contributor who chooses a spatial file has it handed to Upload shapes | story | first | 01, 09 | 4 |
| 23 | A Contributor takes back an import from the toast | story | first | 01, 22 | 4 |
| 31 | A Contributor sees a PDF report as itself, at the page each change was read from | story | first | 04, 09 | 4 |
| 40 | A Contributor's import from pasted text names "pasted text" as its document | story | first | 09, 22 | 4 |
| 07 | A Contributor corrects a performance measure change before adding it | story | first | 06 | 5 |
| 12 | A Contributor is offered Import a report on every project they can edit, and nobody else is | story | first | 01, 08 | 5 |
| 84 | A Contributor's Undo keeps what was changed by hand since, and says so when it cannot take the import back | story | first | 23 | 5 |
| 30 | A Contributor is stopped before anything is added by an invalid change | story | first | 06, 07, 05 | 6 |
| 83 | A Contributor is told why Import a report is not offered while reading is off or unavailable | story | first | 01, 08, 12, 82 | 6 |
| 41 | A Contributor's Undo takes back every kind of change the import added | story | first | 15, 17, 18, 23, 84 | 7 |
| 36 | An import records which figures the Contributor changed or filled in | enabler | first | 07, 13, 14, 17, 22, 75 | 8 |
| 28 | A Contributor leaves while a report is read and comes back to the finished reading | story | later | 01, 35, 06, 07, 10, 12, 21, 32 | later |

Story numbers are the map's and are permanent; the table is in dependency order, so a story never comes before one that blocks it. "Wave" is the story's wave in the map's Build order: stories of one wave can be built in parallel. Enabler 02 comes first because story 01 is blocked by it. Story 81 is written here and owned by `project-record`; stories 17 and 18 of epic B wait on it. Stories 41, 36, 85 and 86 wait on stories of epic B (15, 17, 18; 13, 14, 75). Enabler 36 unblocks no story of this feature: what it records is read by the row markers of `publish-review`, build 2.

2026-11-23: answers written in; stories built on proposals awaiting the user's validation (see `.scratch/proposed-answers.md`). Scope changes that day, each following a decision of the user: removed 03 and 29 (the file is not kept, spec #42); added 81 (Q-135), 82 and 83 (Q-52, spec #41), and 84, split from 23. Story 40 narrowed to naming a pasted import "pasted text" and moved up; 28 lost enabler 03. Retired numbers, never reused: 03, 25, 29, 34, 45 (`../story-map.md`, Retired numbers).

A control or case that a later story in this table owns is absent until that story ships (SR-7). Sample data and the recorded readings every scenario runs against are in `../fixtures.md`.

## Depends on other features

- `project-record`: the project page's sections and their order, the pinned top bar, header actions and the "…" overflow, the Change history sheet. It owns story 81 (rows editable and removable on the project page; not prototyped).
- `performance-measures`: the project's performance measures, their units, breakdown questions and options, closed reporting periods, entries, the total reported to date, and a source shown on its change log rows (story 22, R8; not built).
- `publish-review`: imported values are not public until a publish and count in the project's "N unpublished changes" badge.
- `work-areas`: Upload shapes, able to open with a .zip received (story 11).
- `users-and-security`: who can edit a project, who can publish it; the no-access page; the Security page that holds story 82's setting (proposed, Q-163).
- `@esa/ecology` (hub requests): a toast action reachable by keyboard and announced (story 23); the file control's refusal of several files and the wording of its size message (stories 01, 10).
- `connected-orgs`: who may edit a shared project (story 12).
- `project-intake`: a proposal a person can edit (story 12).
- `plans`: nothing here is plan-locked (story 12).

## Proposals these stories rest on

No question is open in any story of this epic. Each story is built on proposed answers awaiting the user's validation (`.scratch/proposed-answers.md`), and is `needs-triage` until they are validated. Listed here: every question a story of this epic cites in its Open questions section, with the stories that cite it, read from the story files on 2026-11-23. Q-45, Q-52 and Q-135 are the user's decisions; where a story lists one, it leans on the part still proposed. The words after each ID are the question's heading in `.scratch/open-questions.md`.

- Q-16 — Funding source (story 81)
- Q-30 — Header entry (story 08)
- Q-31 — Button label (story 01)
- Q-32 — Is every proposed value editable? (stories 07, 36)
- Q-37 — Does every change row name its source? (story 22)
- Q-38 — File types (stories 02, 01, 10, 08)
- Q-39 — Someone who can see the project but not edit it (story 12)
- Q-40 — Reading state or edit state (stories 01, 08)
- Q-41 — What can fail while reading, and what does the person see for each? (stories 02, 10)
- Q-42 — Nothing to propose (stories 02, 04)
- Q-43 — A project with no performance measures, or no closed reporting period to file under (stories 02, 12)
- Q-44 — Failure on "Add N changes" (story 22)
- Q-45 — The kept document (stories 01, 22, 40)
- Q-46 — Is the reading itself kept? (stories 01, 22)
- Q-47 — Limits (stories 02, 01, 09, 10)
- Q-50 — A funding source already on the record with a different amount (story 22)
- Q-52 — Sending documents to a model provider (story 01)
- Q-53 — An import is recorded with the person who added it and the day (story 22)
- Q-54 — Proposals are ordered in each section: ready first, then needing a decision, then no match (story 04)
- Q-61 — What does the one flagged state read as? (story 06)
- Q-63 — When a report names another project, do its changes arrive unticked? (story 06)
- Q-64 — Must the toast's Undo work by keyboard and assistive technology in the first release? (stories 23, 84)
- Q-66 — The reading service: three things the developer-machine reader leaves open (stories 02, 04, 10)
- Q-67 — Order of changes inside a section: where do the other states go? (story 04)
- Q-68 — Keyboard focus on the Import a report page (stories 05, 30)
- Q-69 — A file the control or the page should refuse (stories 10, 08)
- Q-70 — Handing a spatial file to Upload shapes: when, and how? (story 11)
- Q-72 — A field a GIS subscription supplies (spec #40), on the check step and on Undo (story 41)
- Q-74 — "This report names another project": how is the name matched, and what if there are several? (story 02)
- Q-75 — Undo in two cases the toast allows (stories 84, 41)
- Q-76 — After a publish, what of an import still shows? (story 22)
- Q-80 — A reading the person can leave and come back to, the later story (Q-23) (story 28)
- Q-82 — A figure in another unit than the measure's, in the first release (story 02)
- Q-83 — Two standing requirements with no written source (stories 09, 10, 30)
- Q-84 — "Add N changes" pressed twice, and what the person sees while an import is saved (stories 01, 22)
- Q-85 — A reading the person walks away from (stories 02, 01, 35)
- Q-86 — The day an import is recorded with: which clock? (story 22)
- Q-89 — The reading service, for the kinds of change the developer-machine reader does not return (stories 02, 82)
- Q-90 — May a breakdown answer arrive inferred? (story 07)
- Q-94 — In the change history, where does an import's row sit among the other rows? (stories 22, 23)
- Q-96 — When does a message from the check on "Add N changes" go? (story 30)
- Q-98 — Asked once for the feature: do labels and sentences that contain a renameable noun take the workspace's word? (stories 02, 04)
- Q-99 — Asked once for the feature: the same thing twice. Can two identical entries both appear in a list, and what happens when one input holds the same thing twice? (stories 02, 01, 06)
- Q-100 — The file control on the choose step: a held file taken out again, and several files dropped together (stories 01, 08)
- Q-101 — Does each imported entry get a row in the performance measures' own change log? (stories 22, 23)
- Q-102 — A file dropped on the project page, once the Import a report page is back on the choose step (story 08)
- Q-103 — A file dropped on the project page that Import a report does not read (story 08)
- Q-104 — The messages under the file control: when does each go, and can two show at once? (story 10)
- Q-105 — A reading of pasted text that fails: what is shown, and where? (story 09)
- Q-106 — Handing a spatial file to Upload shapes: what is handed, and what if it is not taken? (story 11)
- Q-107 — The "That's a spatial file" box while "Paste text" is chosen (story 11)
- Q-108 — "Paste the report text first." when the person types, or switches away and back (story 09)
- Q-109 — When is the right to edit checked, once the Import a report page is open? (stories 01, 12, 83)
- Q-110 — The tally after the person ticks and unticks (stories 04, 06)
- Q-111 — Selecting a change by keyboard, and telling assistive technology (story 04)
- Q-112 — A narrow screen while the document is showing on the check step (stories 05, 30)
- Q-113 — What may be typed into an amount: a performance measure change's "Amount", and a funding source's "Secured ($)" and "Grant or program" (stories 81, 01, 07, 30)
- Q-114 — The reporting period of a performance measure change, in two cases (stories 06, 07, 30)
- Q-115 — A breakdown answer, in two cases (story 07)
- Q-116 — What counts as "changed from the document's figure" and "filled in after arriving empty", in cases the prototype settles by accident (story 36)
- Q-117 — A change that carries no page and points at no passage: what does the document pane show? (stories 04, 31)
- Q-118 — Arithmetic the first release does, and how it is shown (stories 02, 04)
- Q-119 — Which layout does a screen exactly 64rem wide get? (story 05)
- Q-121 — A total to date after the person acts on it (story 36)
- Q-123 — Which typed figures tick an empty flagged change? (story 30)
- Q-125 — A Timeline when the report states one year (story 02)
- Q-126 — What a change kept by a data source shows (story 06)
- Q-129 — What "Not used" and "Skipped" must hold (story 02)
- Q-130 — After adding the changes of a report that names another project, is anything recorded? (story 22)
- Q-131 — Which organizations does "Organization" on a funding source change offer and match against, and in what order? (story 81)
- Q-134 — Can a project's record hold a funding source whose organization the workspace does not hold? (story 81)
- Q-135 — Correcting by hand what an import added (story 81)
- Q-136 — Who may read the document's name? (stories 81, 22)
- Q-137 — "Undo" when what the import added has changed since, or cannot all be taken back (stories 81, 84, 41)
- Q-138 — Two imports set the same Key facts field and both are taken back, the earlier first (story 41)
- Q-139 — Pasted text as a kept document: two details (story 40)
- Q-141 — In the review, should a change read the same whether a person typed it or an import added it? (story 22)
- Q-157 — What does the person see when "Undo" itself fails, and can they try again? (stories 23, 84)
- Q-158 — Pasted text beside the changes: what heads the document pane, and what labels its page? (story 31)
- Q-162 — Who makes reading by an outside AI service unavailable for a workspace, and where? (story 82)
- Q-163 — Which settings page holds the control? (story 82)
- Q-164 — What text does the Administrator agree to, and how is agreeing given and recorded? (story 82)
- Q-165 — What does turning the setting off do to work already under way? (stories 82, 83)
- Q-166 — While the setting is off, what does a file dropped on the project page do, and does the "why" line lead an Administrator to the setting? (story 83)
- Q-167 — A change read from more than one passage: which passage is marked? (story 04)
- Q-172 — On one press of "Add N changes", which runs first: the check that every ticked change is valid (story 30), or the check against the record (story 32, R5)? (story 30)
- Q-173 — Later story 28: what does a person who comes back to a ready reading see where the document would be? (story 28)
- Q-176 — Editing and removing a funding source or a contact on the project page: what the user's decision on Q-135 did not say (story 81)
- Q-177 — Keyboard focus after "Undo" (story 23)
- Q-178 — "Undo" when more than one condition holds, and the words after a publish (story 84)
- Q-179 — What the Undo toast counts for a field a later import has set since (story 41)

