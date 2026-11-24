# Classifications

Status: needs-info

Started 2026-11-23 with nested classification groups. The earlier classification work (goals with performance measures and targets, groups, the board) has no numbered decisions; its reasons are in the route and component headers. Mock content is invented.

## Problem Statement

A workspace files its projects under classifications, and sorts those classifications into groups. Groups were one flat list with a name and a description. A workspace whose own taxonomy has three or four levels (an area of work, the kinds of work in it, the practices in each) could show only two of them, and nothing could be read at the levels above a classification: no page said what a whole branch of the work adds up to.

## Solution

Classification groups nest. A group can sit inside another group, to any depth, and each group carries what a classification does apart from measures: a colour, a description, and a progress page of its own that adds up everything filed beneath it.

## Who it is for

- **Administrator** (or whoever Security › Manage classifications lets in): arranges groups in Workspace settings.
- **Viewer, Contributor, Manager, Administrator**: read a group's page and the nested Classifications board.
- **Visitor**: not yet. The public classifications page still shows the Plan goal group only (Q-155).

## The brief's five (docs/product-brief.md §5), for the group page

1. One question: what does this whole branch of our work add up to, and what is in it?
2. Readers: the executive and program manager reading one level above a goal; a funder or partner sent the link. Not the administrator, who works in Workspace settings.
3. Series or scalar: description and four totals are scalars; the contents are the board scoped to the group; measures are a series; projects are the portfolio grid, filtered.
4. Irreversible: nothing on the reading page. In settings, removing a group, offered only once it is empty.
5. Cut: targets on a group, and measures of a group's own.

## Decisions

| # | Decision |
|---|----------|
| 1 | Classification groups nest to any depth: a group can sit inside another group. One tree; the workspace decides how many levels it needs. *(2026-11-23)* |
| 2 | A group carries a colour and a description, as a classification does. *(2026-11-23)* |
| 3 | A group has its own progress page: its projects, funding and performance measures, added up from everything filed beneath it. *(2026-11-23)* |
| 4 | A group has no performance measures or targets of its own. Rejected: letting a group list measures and set targets separate from its children's. *(2026-11-23)* |
| 5 | Projects are filed on classifications only, never directly on a group. A group's projects are the projects of the classifications beneath it. Rejected: filing at any level, which would put projects in a group that belong to none of its children. *(2026-11-23)* |

## What is faked

- Groups added, moved, recoloured or removed are kept in this browser only (`src/lib/taxonomy-edits.ts`).
- A group added in this browser has no progress page; "Open group" opens its settings page.
- A group's progress page is built from the seeded tree. Moving a classification or linking a measure in Workspace settings does not change its totals.
- A group's settings page shows its old crumbs after it is moved, until the page is opened again.

## Sample data for each state

| State | Sample |
|---|---|
| Top-level group holding classifications only | Plan goal |
| Top-level group holding groups only | Practice area |
| Group one level down | Channels & fish passage |
| Group holding a classification and a group | Forests & fuels |
| Group three levels down | Fire management |
| Empty group | none seeded; add one in Workspace settings |
