# Funding sources

Started 2026-11-24. Mock content is invented.

## Problem

A funding source was a name typed on each project's funding row, so one grant on twelve projects was twelve strings, with no page, no total and no way to say whether it was still taking requests. A workspace that runs calls for proposals had nowhere to open or close one, and a project had no way to say it had asked for money it did not yet have.

## Solution

A funding source is its own record: money one organization offers that can fund many projects. A project's funding row links to one and carries the amount and a status. A source can accept requests until an optional closing date. That, with the row's status, is how a call for proposals is run; there is no solicitation entity.

For: Program staff (Administrator, Manager) who track who funds the portfolio and run calls; Sponsor / reporter (Contributor) who records a project's funding and asks a source for money.

The brief's five questions are answered in each route's header (`funding-sources`, `funding-sources/[source]`). The model is `docs/data-model.md`, sections 2 and "Settled".

## Decisions

| # | Decision | Date |
|---|----------|------|
| 1 | A funding source is an entity, offered by one organization. A project's funding row links to it and carries the amount; the funder is read from the source, never typed. | 2026-11-24 |
| 2 | A funding row has a status: requested, secured or not awarded. Every funding total counts secured rows only. Requested money is shown beside secured money and never added to it. | 2026-11-24 |
| 3 | One row per funding source on a project. | 2026-11-24 |
| 4 | A funding source can accept requests, with an optional last day to submit. The day is inclusive and governs submitting: a request already on a project stays when the source closes. | 2026-11-24 |
| 5 | A new requested row can only go to a source that is accepting requests today. Money already secured can be recorded against any source. | 2026-11-24 |
| 6 | No solicitation, application or review entities. Rejected: a Solicitation record with an Application per project and per-reviewer scoring. One client runs scored calls; it is served by decisions 2 and 4, a custom field for the outcome score, and a saved view for the slate. Revisit when more clients need per-reviewer scoring or answers kept per application. | 2026-11-24 |
| 7 | Funding keeps one amount per row, and spend per year for the whole project, not per funding source. ProjectFirma 1's separate targeted amount does not return; `requested` carries it. | 2026-11-24 |
| 8 | A lead organization's own contribution is a funding source too, one per organization, named Local Sponsor Match. | 2026-11-24 (proposed, built) |
| 9 | On the project page the organization reads as the second line under the source's name, not a column: with Status added, five columns did not fit the card beside the rail. | 2026-11-24 (proposed, built) |

## Built

- `funding-sources`: the index table (name, offered by, requests, projects, secured, requested).
- `funding-sources/[source]`: description, three totals, the recorded funding source fields, the accepting switch and last day, and each project's amount and status.
- `projects/[project]`: the funding card shows Status and a Total secured row; Add source opens the row sheet; the sheet picks a funding source and a status.
- Classification, group, area, organization, dashboard and public totals count secured rows only.

## Not built

- Adding a funding source, and editing its name, organization, description or field values. The index has no New funding source page yet.
- The Review step for a request's outcome: a row's status is changed by hand in the row sheet by anyone who can edit the project. Who may mark a row secured or not awarded is open (`.scratch/open-questions.md`).
- Asking for funding from inside project intake. A project asks from its own page after it is entered.
- A score field and a saved view for the slate (decision 6) are not seeded.

## What is faked

- Whether a source is accepting requests, once changed, is kept in this browser (`src/lib/funding-source-edits.ts`).
- Rows added or changed by hand are kept in this browser (`src/lib/project-rows.ts`). The source's own page and every total are built from the seed, so a row added in the browser does not appear on the source's page or in a total.
- "Today" is the prototype's fixed date, 2026-09-30.
- Imported rows (Import a report) name a source by its words and are not matched to the workspace's list.

## Sample data for each state

| State | Sample |
|---|---|
| Accepting, closing date ahead | Watershed Resilience Grant Program (Feb 26, 2027); Sierra Meadows Restoration Initiative (Dec 11, 2026) |
| Accepting, no closing date | Anadromous Fisheries Recovery Fund |
| Accepting, closing date passed (reads Closed) | Wildfire Resilience Block Grant (Aug 14, 2026) |
| Not accepting | Coastal Wetlands Conservation Fund |
| Row requested | Cosumnes Floodplain Reconnection, Cache Creek Floodplain Terracing, San Luis Rey Arroyo Toad Habitat (every project in the Proposal stage) |
| Row not awarded | Scott River Fish Passage Barrier Removal; Suisun Slough Tidal Marsh Enhancement |
| Source with no field values | Local Sponsor Match (any organization) |
