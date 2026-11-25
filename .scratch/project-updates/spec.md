# Project updates — three ways in, one review

Status: ready-for-human

Settled in a product interview and a grilling session on 2026-11-13. Builds on
the publish review (2026-10-09) and sits beside
`.scratch/connected-orgs/spec.md`. Waiting on the user's read-through before
any build.

## Problem Statement

People who run projects keep the truth somewhere else: a spreadsheet, a GIS, the
progress reports they file with funders. They come here only to report. In
ProjectFirma 1 an update opened a form holding every field of the project and
was saved as a request an administrator had to approve, even to change one
contact name. Administrators could edit any field directly. Maintainers were
treated as applicants to their own projects, so they stopped reporting, and
projects trail by a year or more.

Reviewers still need what the public and reports consume to be something a
named person stood behind, because a maintainer can have a reason to inflate a
claim.

## Solution

A project changes in one of three ways, and all three end in the same place.

1. **By hand.** On the project page, a field saves as you leave it.
2. **From a document.** Import a report reads a file the maintainer already
   produced and proposes changes; the maintainer checks them and confirms once.
3. **From a data source.** A linked sheet, layer or tracker keeps mapped fields
   current.

Every change saves to the record at once and goes in one change log with its
source. The public and reports see only what has been published. A manager
reviews one net diff per project and publishes it.

## Decisions

### The rule

| # | Decision |
|---|----------|
| 1 | Maintainers are trusted members. Every edit saves to the record immediately, however it arrived. |
| 2 | The public page and reports show only published values. **Silence means no:** nothing is published because time passed. |
| 3 | One exception: a workspace data source publishes itself (decision 22). |
| 4 | A public figure shows when it was last published, so the lag is visible. |
| 5 | Every change carries one of three sources: edited by hand, from a named document, from a named data source. The change log and the review show it the same way. |
| 6 | There is no separate "project update" form or request. The words "project update" are not used as a noun in the interface. |

### Import a report (build 1)

| # | Decision |
|---|----------|
| 7 | Its own page: Projects › *Project* › Import a report. The side sheet is removed; one construction only. |
| 8 | Three entries: the button on the measures card, an item in the project page's "…" menu, and dropping a readable file anywhere on the project page, which opens the page with that file loaded. |
| 9 | It proposes changes to performance measures, timeline, contacts, partner organizations, funding sources, and named attributes such as county or watershed when the project has that field. Nothing else. Description, stage, photos and tags stay hand-edited. |
| 10 | Funding sources are proposed (who funded, how much secured). Spend is skipped and the page says so: funders report spend by grant, the record holds it by year. |
| 11 | **Location.** Shapes change only from spatial data. A report's prose never moves, adds or redraws a location. Coordinates typed in a form are text and are listed as not used. A spatial file is handed to the existing Upload shapes flow, with a link. |
| 12 | Layout: the document on one side, proposed changes on the other, grouped by the project page's sections; selecting a change shows its passage. On a phone, each change has "Show source". |
| 13 | Every proposed value is editable. When the reading is unsure (including a unit mismatch, or a to-date total the record cannot resolve), the field is left unchanged and shown as a flagged item to fill. Never a pre-filled guess. |
| 14 | A contact is matched to an existing person by email or name; otherwise added as a name and email only. No invitation, no account. |
| 15 | An organization not in the workspace is flagged for the maintainer to pick an existing one; otherwise listed as not added. Nothing is created. |
| 16 | A field kept by a data source appears as "Kept by *source*" with no proposed change. |
| 17 | One optional note to the manager per import. |
| 18 | One button in the top bar states the count ("Add 9 changes") and returns to the project page. A toast offers Undo for everything that import added. |
| 19 | The document is kept as the source of those changes, reachable from the change log and the review. No Files list. Visible only to people who can edit or publish that project; never public. *(Replaced by 42, 2026-11-23.)* |
| 20 | One document per import. A document covering several projects is later; the existing warning stays when a report names another project. |
| 21 | Available to anyone who can edit the project, on every plan. Typed or pasted text stays as a source; speech input is dropped. |
| 41 | Reading a report with an outside AI service is a workspace setting. It is off until an administrator of the workspace agrees and turns it on; the administrator can turn it off again; and it can be made unavailable to a workspace altogether, where that client's terms do not allow its documents to go to an outside provider. While it is off or unavailable, Import a report is not offered for that workspace, and the place it would be says why. *(2026-11-23.)* |
| 42 | The report or spreadsheet is used only to read data from. The file is not kept after the import is added (or abandoned); pasted text likewise. What stays with each imported change is the document's name and the words it was read from (its quote). A manager reviewing an imported change sees that quote and the document's name beside the change, not the document. Nothing opens the file later, because there is no file. *(2026-11-23; replaces 19, amends 31.)* |

### Data sources (specified, not built)

| # | Decision |
|---|----------|
| 22 | Three owners. **Workspace:** an administrator links a source covering every project (the existing GIS subscription is one). **Organization:** its managers link the organization's own tracker, in Organization settings. **Project:** a maintainer links a source for one project. |
| 23 | "Data source" is the term. "Connected" stays for the workspace link in the connected-organizations spec. |
| 24 | Workspace sources publish without review: an administrator approved the source and mapping at setup. Their changes appear in the log and Updates feed, not in the review diff. |
| 25 | Organization and project sources are staged for publish like any other change. |
| 26 | Setup for an organization or project source is mapped and confirmed once, on the Import a report layout with a "keep this connected" choice. After that, clear changes are staged without the owner; unsure ones wait as flagged items. |
| 27 | One owner per field. A field kept by a source is read-only by hand. When two sources want one field, the wider owner wins (workspace, then organization, then project); the narrower mapping is switched off and its owner told. *(Amended by 40, 2026-11-23.)* |
| 28 | A row matching no project is listed for a manager to match or create. Organization and project sources never create projects. |
| 29 | An organization's own manager may publish its staged changes, as roles work today. A program that wants its own staff to certify everything gives no organization a manager. |
| 40 | A GIS subscription has one setting: whether it is the authoritative source for the fields it supplies. **Authoritative:** those fields cannot be edited here; fields the source does not supply, such as most custom fields, stay editable. **Not authoritative:** the fields can be edited here and each edit is sent back to the GIS system, so changes travel both ways. *(2026-11-23; amends 27, which made every source-kept field read-only.)* |

### Review

| # | Decision |
|---|----------|
| 30 | The existing review is the one stream: workspace queue, one net-diff page per project, Publish and next, Skip. No second queue. |
| 31 | Each row shows its source. For a document, it opens beside the diff at the passage. (Build 1.) *(Amended by 42, 2026-11-23.)* |
| 32 | An import's note sits above the changes that import produced. (Build 1.) |
| 33 | **Hold** one row with a required note and publish the rest. The held value stays on the record and returns in the next review with its note. This partly reverses the earlier cut of a "send back" state. (Build 2.) |
| 34 | **Revert** requires a reason and extends to measure entries filed since the last publish. Boundaries stay without one. (Build 2.) |
| 35 | Editing stays out of the review. Each row links to its field on the project page. |
| 36 | The queue stays oldest first. Rows are marked, with the reason stated, in three cases worked out in code: a measure or funding figure with no document behind it; a figure the maintainer changed from the document's; a value filled in after an unsure reading. No scoring of projects or people. (Build 2.) |
| 37 | Bulk publish stays cut. |
| 38 | A hold or revert notifies the person who made the change. A publish notifies nobody individually. |

### Team 5 sandbox

| # | Decision |
|---|----------|
| 39 | `/prototypes/team-5` stays untouched until the Import a report page exists, then is deleted whole, including `mode="update"` on `firma2-my-projects`. Its update form and per-change approval queue have no place under decision 6. |

### How a change reads in review (decided 2026-11-17, from /proto/review-sweep)

- **Struck and marked.** The published value struck, the record's marked, and how far it moved: `~~$398,500~~ → $412,000 +$13,500 (+3.4%)`; years mark only the year that moved and say so ("ends a year later"); prose shows the words that went in or out, in context; something new reads `New: 0.6 miles`. One renderer, `src/lib/review-diff.ts`, for seeded and imported rows.
- On a first publish a field shows its value alone. No "Goes public as", "Record" or "New" label: the page already says "Not public yet".
- Rejected: "Public page / Record" side by side (the reader compares the two); a Before / After / Difference table (prose squeezes into narrow columns; poor on a phone); a sentence per change ("Up $13,500 (+3.4%): $412,000, was $398,500"), which reads well cold but runs long and still needs the marked passage for text.
- **Where the sweep happens: the inbox, on the Review page** (user: "admins very rarely will go to an individual project and do that review there"). The waiting list on the left, each row showing its first changes struck and marked; the selected project's full review on the right (firma2-review-inbox, which renders firma2-review-changes); Publish and next moves down the list in place, with Undo on the toast. The project's own review page stays for links from the project.
- Rejected layouts: the list then a page per project (a page load per project, and the list said nothing about what changed); expanding rows in the list (a first publish opens into a very tall block, and Publish on a closed row invites publishing unseen); publishing from a summary list (Hold and Revert still meant leaving for the project page).

## Build order

1. **Build 1.** The Import a report page (decisions 7 to 21) and the source and note in review (31, 32). New invented sample documents covering contacts, funders and named attributes.
2. **Build 2.** Hold, Revert with a reason, and row markers (33, 34, 36, 38). Built 2026-11-17 on the user's call, before watching a manager review a real import.
   - Hold: per row, required note, held keys stay pending and leave the publish; Release puts them back; "Publish and next" skips a project whose every change is held.
   - Hold takes no note and tells nobody (user, 2026-11-18): review is a pre-publish accuracy check, and Hold is the reviewer's own "I'll come back to this". Revert keeps its required reason, sent to the editors. This narrows decisions 33 and 38.
   - Snapshot model (user, 2026-11-18): a publish is the whole project as it stands, minus what was held. A held change counts as if it arrived after that snapshot: decided on, just deferred. It leaves Waiting for the inbox's **Held** view (Waiting / Held switch, `?view=held`), which shows who held it and for how long; held changes don't age toward Overdue. Release returns it to Waiting; Revert ends it. The project page badge reads "2 unpublished changes · 1 held". Considered and dropped: whole-project-only publishing with "Send back" in place of Hold (one disputed figure would block the rest).
   - Proposals moved into the inbox (user, 2026-11-18): Proposals / Waiting / Held. A proposal is a different decision (should this project exist: Approve, or Return with what needs to change), so it keeps its own buttons, but it is made in the same inbox. The "Proposals to approve" block above the page is gone. In the prototype an approved proposal does not yet appear in Waiting as a first publish (the queue is seeded).
   - The inbox has the project rail (firma2-side-panel holding firma2-review-project-rail): the selected project's Key facts, read-only, "Changing" beside each field in this review (none on a first publish). It collapses from its corner and stays out of the page in Proposals. The work areas map is left out.
   - Project status in the inbox, decided from /proto/review-meta (user, 2026-11-18): a **byline** under the project name — "Last published 2 March 2026 · Changes by Ivy Nakamura and Renata Alvarez" or "Not public yet", plus Overdue. Not who published last: it doesn't help judge accuracy, and the publish history keeps it. No waiting time, there or in the list ("not necessary"). Rejected: the bold "Last published" row and "Not public yet" box as built (heavier than the changes they introduce), a strip of four equal properties (most height, repeats the list), a Public page section in the rail (gone when the rail is collapsed), a line under Publish ("Replaces the page from …"; drops who published).
   - The three figures above the inbox are gone (user, 2026-11-18): the toggle counts what waits, the list is oldest first and marks Overdue. "15 of 24 up to date" belongs on a dashboard, not in the sweep.
   - Open: a hold has no end date yet. Proposed: after one review cycle untouched it returns to Waiting marked "Held since …", and an editor's new edit to the field clears it.
   - Revert: required reason, kept in the review's history. Imported rows revert their field, measure entry, contact or funding source; a row folded over a hand edit reverts both, to the published value.
   - Not yet: a *seeded* measure filing has Hold but no Revert. It is fixture data in the measures table, which has no way to drop one year's figure; imported filings revert.
   - Notify (38) is stated, not sent: the dialog and toast name who gets the note. There is no outbox in the prototype.

## Testing

The deployed page reads invented samples only. Two real funder reports, one that
reads cleanly and one whose tables do not, are used locally through
`scripts/report-reader.mjs` and stay in `docs/private/`. The test is one
maintainer checking a reading of their own report: count the corrections, and
ask whether they would send the next one unasked.

## Out of scope

- Self-serve reports for maintainers, and filling a funder's form back out.
- Building organization or project data sources, and Google Sheets.
- A document covering several projects, and an entry from My Projects.
- Purging content from history.
- Plan rules for data sources.

## Not resolved

- What brings a maintainer back between funder deadlines. The bet is reports they cannot make alone; it is untested.
- How funder money, stated by grant, could ever reach spend recorded by year.
- Whether purge has a real case.
- No reviewer incident was named; the governance need rests on the stated fear that reported figures can be inflated.
