# Funding sources

Started 2026-11-24. Mock content is invented.

## Problem

A funding source was a name typed on each project's funding row, so one grant on twelve projects was twelve strings, with no page and no total.

## Solution

A funding source is its own record: money one organization offers that can fund many projects. A project's funding row links to one and carries the amount.

For: Program staff (Administrator, Manager) who track who funds the portfolio; Sponsor / reporter (Contributor) who records a project's funding.

The brief's five questions are answered in each route's header (`funding-sources`, `funding-sources/[source]`). The model is `docs/data-model.md`, sections 2 and "Settled".

## Decisions

| # | Decision | Date |
|---|----------|------|
| 1 | A funding source is an entity, offered by one organization. A project's funding row links to it and carries the amount; the funder is read from the source, never typed. (user) | 2026-11-24 |
| 2 | A funding row is money the project has. It has no status. Rejected, after being built: a requested / secured / not awarded status on the row, secured-only totals, and a funding source that accepts requests until a closing date. These were the assistant's proposal for running calls for proposals without a solicitation entity; the user had not agreed to them and had them taken out. | 2026-11-24 |
| 3 | Calls for proposals are not modelled: no solicitation, application or review records. One client runs them; revisit when more do. (user) *Replaced in part the same day: a solicitation is now a name and an Active switch that a project picks at intake (`.scratch/project-intake/spec.md`, Solicitations). Still true: no application or review records, and nothing on funding rows or funding sources.* | 2026-11-24 |
| 4 | One row per funding source on a project. (proposed, built) | 2026-11-24 |
| 5 | A lead organization's own contribution is a funding source too, one per organization, named Local Sponsor Match. (proposed, built) | 2026-11-24 |
| 6 | On the project page the organization reads as the second line under the source's name, not a column: it comes with the source and is not a fact of the row. (proposed, built) | 2026-11-24 |
| 7 | Two funding sources may share a name only under different organizations. (proposed, built) | 2026-11-24 |
| 8 | Funding rows need not add up to the estimated total cost; the rest is the funding gap, derived and shown on the project. (`docs/data-model.md`, decision 19) | 2026-11-24 |

## Built

- `funding-sources`: the index table (name, offered by, projects, funding).
- `funding-sources/[source]`: description, two totals, the recorded funding source fields, and each project's amount.
- `projects/[project]`: each funding row links to its source; Add source opens the row sheet; the sheet picks a funding source and takes an amount.
- `funding-sources/new`: add a funding source (name, offered by, description). Kept in this browser.
- The funding gap: where a project's rows add up to less than its estimated total cost, its funding table shows Total funding and Funding gap (`docs/data-model.md`, decision 19). The three projects in the Proposal stage hold only their own match and are the sample.

## Not built

- Editing a funding source's name, organization, description or field values. An added source has no page of its own.
- Amounts by year on a funding row, and spend by funding source (`docs/data-model.md`, decision 7).

## What is faked

- Rows added or changed by hand are kept in this browser (`src/lib/project-rows.ts`). The source's own page and every total are built from the seed, so a row added in the browser does not appear on the source's page or in a total.
- Imported rows (Import a report) name a source by its words and are not matched to the workspace's list.

## Sample data for each state

| State | Sample |
|---|---|
| Source with every field answered | Watershed Resilience Grant Program |
| Source with some fields unanswered | Delta Ecosystem Restoration Fund |
| Source with no field values | Local Sponsor Match (any organization) |
