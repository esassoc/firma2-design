# E-A — A Contributor gets a report's figures onto the project's record, and can take them back

Feature: project-updates
Release: mixed
Status: needs-info

## Goal

Someone who can edit a project takes one report from a file (or pasted text) to changes on the project's record without retyping it, checks each change against the document first, and can take the whole import back. The first release ships with performance measure entries alone; epic B adds the other kinds of change.

## Actors

- Contributor (anyone who can edit the project: a Contributor on a project an organization of theirs leads, or an Administrator): chooses a report, checks what was read against the document, adds the changes, may undo them.
- Viewer and visitor: get nothing here. They never see the page, the document or an imported value until it is published (story 12).

## Decisions that shape every story

| Source | Decision |
|---|---|
| spec #1 | Changes added by an import save to the record at once. Nothing here is a request for approval. |
| spec #2 | Imported values are not public until a publish; until then they count as unpublished changes on the project. Owned by `publish-review`. |
| spec #6 | The interface never uses "project update" as a noun. |
| spec #7 | Import a report is a page of its own. There is no side-sheet version. |
| spec #12; interview 2026-11-23, Q-20 | The check step is the built page: the document beside the proposed changes, grouped by the project page's sections. The three experiment layouts are not requirements. |
| spec #18 | The commit button states the count ("Add 9 changes"). There is no second confirmation. A toast on the project page offers Undo. |
| spec #20 | One document per import (open: Q-29). |
| spec #21; interview 2026-11-23, Q-22 | Available to anyone who can edit the project, on every plan. The workspace permission "Import data" governs bulk project import, not this. |
| interview 2026-11-23, Q-23 | First release: the person waits on the page while the document is read. A reading is not stored. |
| interview 2026-11-23, Q-24 | Undo is offered on the toast only. |
| interview 2026-11-23, Q-28 | Offered on any project the person can edit, whatever its stage, including proposals, completed projects and shared projects. |
| inventory RUL-33 (shown) | A model reads and maps; code does the arithmetic; the page checks against the record; a person commits. |

## Out of scope

- Every kind of change beyond a clean performance measure entry, and every case that waits on the person — epic B.
- The Manager's view of imported changes in the review, and the note for the reviewer, written on the check step and read there — epic C (stories 24, 21, 33, 80, 51).
- The unpublished-changes badge, "not public until a publish", the one-row fold in the review, and Publish itself — `publish-review`.
- Hold, Revert with a reason, row markers and their notifications — `publish-review`, build 2.
- Setting up a data source from this layout (spec #26) — not in build 1 (interview 2026-11-23, Q-29).
- Several documents in one import; a document covering several projects; an entry from My Projects — the spec's Out of scope list. Not confirmed (Q-29).
- Speech input — not offered (spec #21; story 09 states it).
- The three experiment layouts at `/proto/import-report` — dropped (Q-20).
- Deleting `/prototypes/team-5` (spec #39) — `team-5-sandbox`; Q-3.

## Stories, by dependency

| # | Story | Type | Release | Blocked by | Wave |
|---|---|---|---|---|---|
| 02 | Reading service: a model reads the document, code does the arithmetic | enabler | first | none | 1 |
| 01 | Walking skeleton. A Contributor adds performance measure entries read from one report file | story | first | 02 | 2 |
| 04 | A Contributor checks each change against the document beside it | story | first | 01 | 3 |
| 08 | A Contributor starts an import from the project header, or by dropping a file on the project page | story | first | 01 | 3 |
| 09 | A Contributor pastes the report's text instead of choosing a file | story | first | 01 | 3 |
| 10 | A Contributor is told why a file was not read | story | first | 01 | 3 |
| 11 | A Contributor who chooses a spatial file has it handed to Upload shapes | story | first | 01 | 3 |
| 22 | A Contributor's import is recorded and listed in the project's change history | story | first | 01 | 3 |
| 35 | A Contributor leaves Import a report, or starts again, without adding anything | story | first | 01 | 3 |
| 03 | Kept document: stored with its import, opened only by people who can edit or publish the project | enabler | first | 22 | 4 |
| 05 | A Contributor on a narrow screen opens a change's source and comes back to the same change | story | first | 04 | 4 |
| 06 | A Contributor chooses which changes to add | story | first | 01, 04 | 4 |
| 12 | A Contributor is offered Import a report on every project they can edit, and nobody else is | story | first | 01, 08 | 4 |
| 23 | A Contributor takes back an import from the toast | story | first | 01, 22 | 4 |
| 31 | A Contributor sees a PDF report as itself, and a document held as passages with the change's passage marked | story | first | 04, 09 | 4 |
| 07 | A Contributor corrects a performance measure change before adding it | story | first | 06 | 5 |
| 30 | A Contributor is stopped before anything is added by an invalid change | story | first | 06, 07 | 6 |
| 40 | A Contributor's pasted text is kept and named as the import's document | story | first | 03, 09, 22, 31, 33 | 6 |
| 41 | A Contributor's Undo takes back every kind of change the import added | story | first | 03, 15, 17, 18, 23 | 7 |
| 36 | An import records which figures the Contributor changed or filled in | enabler | first | 07, 14, 17, 22, 75 | 8 |
| 28 | A Contributor leaves while a report is read and comes back to the finished reading | story | later | 01, 03, 35 | later |
| 29 | A Contributor opens an import's document from its row in the change history | story | later | 22, 03 | later |

Story numbers are the map's and are permanent; the table is in dependency order, so a story never comes before one that blocks it. "Wave" is the story's wave in the map's Build order: stories of one wave can be built in parallel. Enabler 02 comes first because story 01 is blocked by it; enabler 03 is blocked by story 22, which records the import a document is kept with. Story 40 also waits on stories 24 and 33 of epic C, where its kept text is seen; story 41 on stories of epic B (15, 17, 18); enabler 36 on stories of epic B (14, 17, 75); and the `later` story 28 on 35. Enabler 36 unblocks no story of this feature: what it records is read by the row markers of `publish-review`, build 2.

Merge pass, 2026-11-23 (a story's own effect must be observable with its blockers alone): the story that recorded and announced an import was dissolved, its toast into 01 and its record into 22; 23 took the change history row's removal from 41; 04 took "This file can't be shown here." and the rule for which form a document takes from 31; the note for the reviewer, story 21, left this epic for epic C, where it is read; 36 became an enabler. Three numbers are retired and never reused: 25, 34, 45 (`../story-map.md`, Retired numbers). Earlier the same day, split after writing: 30 and 35 from 06, 31 from 04, 36 from 07, 40 from 09, 41 from 23; and story 30's check on a ticked funding source moved to story 65 (epic B).

A control or case that a later story in this table owns is absent until that story ships (SR-7). Sample data and the recorded readings every scenario runs against are in `../fixtures.md`.

## Depends on other features

- `project-record`: the project page's sections and their order, the pinned top bar, header actions and the "…" overflow, the Change history sheet.
- `performance-measures` (or `pm2`, Q-1): the project's performance measures, their units, breakdown questions and options, closed reporting periods, entries, and the total reported to date.
- `publish-review`: imported values are not public until a publish and count in the project's "N unpublished changes" badge.
- `work-areas`: Upload shapes, able to receive a file handed to it (story 11).
- `users-and-security`: who can edit a project, who can publish it.
- `connected-orgs`: who may edit a shared project (story 12).
- `project-intake`: a proposal a person can edit (story 12).
- `plans`: nothing here is plan-locked (story 12).

## Open questions

Every open question a story of this epic cites, with the stories that cite it, read from the story files on 2026-11-23, after the merge pass. The questions themselves are in `.scratch/open-questions.md`; the words after each ID are that question's heading. Each story says which of its requirements, scenarios or steps the answer would change.

- Q-29 — What is explicitly not in build 1? (stories 01, 08)
- Q-30 — Header entry (stories 08, 12)
- Q-31 — Button label (stories 01, 12)
- Q-32 — Is every proposed value editable? (stories 07, 36)
- Q-33 — Does an unsure change arrive empty? (story 36)
- Q-37 — Does every change row name its source? (story 22)
- Q-38 — File types (stories 01, 02, 08, 10)
- Q-39 — Someone who can see the project but not edit it (story 12)
- Q-40 — Reading state or edit state (stories 01, 08, 12)
- Q-41 — What can fail while reading, and what does the person see for each? (stories 02, 10)
- Q-42 — Nothing to propose (stories 02, 04)
- Q-43 — A project with no performance measures, or no closed reporting period to file under (stories 02, 07, 12)
- Q-44 — Failure on "Add N changes" (stories 01, 22)
- Q-45 — The kept document (stories 03, 40)
- Q-46 — Is the reading itself kept? (story 01)
- Q-47 — Limits (stories 01, 02, 09, 10)
- Q-52 — Sending documents to a model provider (story 02)
- Q-53 — An import is recorded with the person who added it and the day (story 22)
- Q-54 — Proposals are ordered in each section: ready first, then needing a decision, then no match (story 04)
- Q-61 — What does the one flagged state read as? (story 06)
- Q-64 — Must the toast's Undo work by keyboard and assistive technology in the first release? (story 23)
- Q-66 — The reading service: three things the developer-machine reader leaves open (stories 02, 03, 04, 10, 31, 40)
- Q-67 — Order of changes inside a section: where do the other states go? (story 04)
- Q-68 — Keyboard focus on the Import a report page (stories 05, 30)
- Q-69 — A file the control or the page should refuse (stories 08, 10)
- Q-70 — Handing a spatial file to Upload shapes: when, and how? (story 11)
- Q-72 — A field a GIS subscription supplies (spec #40), on the check step and on Undo (story 41)
- Q-75 — Undo in two cases the toast allows (stories 23, 41)
- Q-76 — After a publish, what of an import still shows? (story 22)
- Q-77 — Access to the kept document that is lost or fails (story 03)
- Q-80 — A reading the person can leave and come back to, the later story (Q-23) (story 28)
- Q-81 — Opening the document from the change history, the later story (Q-26) (story 29)
- Q-82 — A figure in another unit than the measure's, in the first release (16 stories of this epic)
- Q-83 — Two standing requirements with no written source (stories 09, 30)
- Q-84 — "Add N changes" pressed twice, and what the person sees while an import is saved (stories 01, 22)
- Q-85 — A reading the person walks away from (stories 01, 02, 03, 35)
- Q-86 — The day an import is recorded with: which clock? (story 22)
- Q-87 — An entry the record already holds, on "Add N changes" (story 01)
- Q-88 — Running a UAT script: the recorded readings, and getting back to the start (19 stories of this epic)
- Q-89 — The reading service, for the kinds of change the developer-machine reader does not return (story 02)
- Q-90 — May a breakdown answer arrive inferred? (story 07)
- Q-94 — In the change history, where does an import's row sit among the other rows? (stories 22, 23)
- Q-96 — When does a message from the check on "Add N changes" go? (story 30)
- Q-98 — Asked once for the feature: do labels and sentences that contain a renameable noun take the workspace's word? (story 04)
- Q-99 — Asked once for the feature: the same thing twice. Can two identical entries both appear in a list, and what happens when one input holds the same thing twice? (stories 01, 04, 41)
- Q-100 — The file control on the choose step: a held file taken out again, and several files dropped together (story 01)
- Q-101 — Does each imported entry get a row in the performance measures' own change log? (story 01)
- Q-102 — A file dropped on the project page, once the Import a report page is back on the choose step (stories 08, 35)
- Q-103 — A file dropped on the project page that Import a report does not read (story 08)
- Q-104 — The messages under the file control: when does each go, and can two show at once? (story 10)
- Q-105 — A reading of pasted text that fails: what is shown, and where? (stories 09, 10)
- Q-106 — Handing a spatial file to Upload shapes: what is handed, and what if it is not taken? (story 11)
- Q-107 — The "That's a spatial file" box while "Paste text" is chosen (story 11)
- Q-108 — "Paste the report text first." when the person types, or switches away and back (story 09)
- Q-109 — When is the right to edit checked, once the Import a report page is open? (story 12)
- Q-110 — The tally after the person ticks and unticks (stories 04, 06)
- Q-111 — Selecting a change by keyboard, and telling assistive technology (story 04)
- Q-112 — A narrow screen while the document is showing on the check step (stories 05, 30)
- Q-113 — What may be typed into an amount: a performance measure change's "Amount", and a funding source's "Secured ($)" and "Grant or program" (stories 07, 30)
- Q-114 — The reporting period of a performance measure change, in two cases (stories 07, 30)
- Q-115 — A breakdown answer, in two cases (story 07)
- Q-116 — What counts as "changed from the document's figure" and "filled in after arriving empty", in cases the prototype settles by accident (story 36)
- Q-117 — A change that carries no page and points at no passage: what does the document pane show? (story 31)
- Q-118 — Arithmetic the first release does, and how it is shown (stories 02, 04)
- Q-119 — Which layout does a screen exactly 64rem wide get? (story 05)
- Q-135 — Correcting by hand what an import added (story 23)
- Q-136 — Who may read the document's name? (stories 03, 22)
- Q-137 — "Undo" when what the import added has changed since, or cannot all be taken back (stories 23, 41)
- Q-138 — Two imports set the same Key facts field and both are taken back, the earlier first (story 41)
- Q-139 — Pasted text as a kept document: two details (story 40)
- Q-140 — An import whose document cannot be kept (story 03)
- Q-157 — What does the person see when "Undo" itself fails, and can they try again? (story 23)
- Q-158 — Pasted text beside the changes: what heads the document pane, and what labels its page? (story 31)
