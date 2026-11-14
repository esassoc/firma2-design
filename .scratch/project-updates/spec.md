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
| 19 | The document is kept as the source of those changes, reachable from the change log and the review. No Files list. Visible only to people who can edit or publish that project; never public. |
| 20 | One document per import. A document covering several projects is later; the existing warning stays when a report names another project. |
| 21 | Available to anyone who can edit the project, on every plan. Typed or pasted text stays as a source; speech input is dropped. |

### Data sources (specified, not built)

| # | Decision |
|---|----------|
| 22 | Three owners. **Workspace:** an administrator links a source covering every project (the existing GIS subscription is one). **Organization:** its managers link the organization's own tracker, in Organization settings. **Project:** a maintainer links a source for one project. |
| 23 | "Data source" is the term. "Connected" stays for the workspace link in the connected-organizations spec. |
| 24 | Workspace sources publish without review: an administrator approved the source and mapping at setup. Their changes appear in the log and Updates feed, not in the review diff. |
| 25 | Organization and project sources are staged for publish like any other change. |
| 26 | Setup for an organization or project source is mapped and confirmed once, on the Import a report layout with a "keep this connected" choice. After that, clear changes are staged without the owner; unsure ones wait as flagged items. |
| 27 | One owner per field. A field kept by a source is read-only by hand. When two sources want one field, the wider owner wins (workspace, then organization, then project); the narrower mapping is switched off and its owner told. |
| 28 | A row matching no project is listed for a manager to match or create. Organization and project sources never create projects. |
| 29 | An organization's own manager may publish its staged changes, as roles work today. A program that wants its own staff to certify everything gives no organization a manager. |

### Review

| # | Decision |
|---|----------|
| 30 | The existing review is the one stream: workspace queue, one net-diff page per project, Publish and next, Skip. No second queue. |
| 31 | Each row shows its source. For a document, it opens beside the diff at the passage. (Build 1.) |
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

## Build order

1. **Build 1.** The Import a report page (decisions 7 to 21) and the source and note in review (31, 32). New invented sample documents covering contacts, funders and named attributes.
2. **Build 2.** Hold, Revert with a reason, and row markers (33, 34, 36, 38). Built after watching a manager review a real import.

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
