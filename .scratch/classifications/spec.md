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
| 6 | The Classifications index has two views, switched by a toggle: **Outline**, the whole tree as one table, and **Browse**, one group at a time with every performance measure in full. Outline is the default; the view is remembered per reader. Rejected: the card board (too long once a workspace has dozens of classifications, nothing compares down a column, three measures per card) and a filter-by-state layout that flattened the tree into panels (nesting was only visible in a panel's title). *(2026-11-23)* |
| 7 | In Outline every column means one thing on every row: Name, Projects, Funders, Performance measures (a count), Progress (one ring per measure). A group's row counts what is beneath it and leaves Progress blank. *(2026-11-23; the first headers put a count of classifications under "Performance measures" on group rows)* |
| 8 | In Browse the list shows every level of the tree: groups and the classifications in them. Groups start folded and each has a chevron, so several branches can be open at once; choosing a name never folds anything. Choosing a group shows its whole branch; choosing a classification shows that classification alone. *(2026-11-23; the first list held groups only, and the second opened only the chosen branch)* |
| 9 | Wherever a classification is listed under, or tagged with, its group (the index's two views, a group's cards, the side panel), its swatch is its direct parent group's colour. A classification keeps a colour of its own only where the classifications of one group must be told apart: the map's colour-by and charts. Rejected: no colour of its own at all (the map could then colour by group only), and the outermost group's colour (a whole top-level branch would be one colour at every depth). *(2026-11-23)* |
| 10 | In the classification side panel the group's badge carries the group's colour, as a light tint under dark text, and the title has no colour square: the square only repeated the badge. *(2026-11-23)* |
| 11 | A classification's page and a group's page each carry an edit button in the header ("Edit classification", "Edit group") that opens the record's page in Workspace settings. The reading pages themselves still do not edit in place. *(2026-11-23)* |
| 12 | ~~A top-level group declares its levels: the name of each level beneath it, top down. The number of names is its depth. Levels are per top-level group, so one can be a flat list and another three deep.~~ **Withdrawn the same day: replaced by 20.** *(2026-11-23; refines 1: depth is still any number, but it is set up front instead of emerging as groups are nested)* |
| 13 | ~~Every branch of one top-level group is the same depth, and only the deepest level holds classifications. A group holds either the groups of the next level or, at the last group level, classifications; never both.~~ **Withdrawn the same day: replaced by 20.** *(2026-11-23; answers Q-151)* |
| 14 | ~~Everything below a top-level group is added from the row it goes inside, and the add names the level it makes ("Add area", "Add practice"). Only the page header adds a top-level group.~~ **Withdrawn the same day: replaced by 20.** *(2026-11-23)* |
| 15 | The settings list is one tree table per top-level group. A classification's row shows projects, performance measures and targets set; a group's row shows its name, how many classifications it holds, and its add. Names are links to the record. *(2026-11-23; replaces one table per group, with "Add classification" on each)* **Replaced by #31.** |
| 16 | ~~A level can be renamed at any time. Levels can be added or removed only while the top-level group is empty.~~ **Withdrawn the same day: replaced by 20.** *(2026-11-23; my default, not yet confirmed: see Q-157)* |
| 17 | ~~A level's name is optional. Unnamed, a level reads as "group", or "classification" at the last level, and that is the default. A top-level group is asked how many levels deep it goes, as a number; an administrator may name a level on that group's page if their taxonomy has its own word.~~ **Withdrawn the same day: replaced by 20.** *(2026-11-23; refines 12 and 14: the first build named every level, and named levels such as "Add area" beside "Add practice" read as two kinds of thing when they are all classifications)* |
| 18 | Adding a classification or a group inside a top-level group is adding a row in place, as on Tags: the add opens an empty row with the cursor in its name; Enter keeps it and opens the next; leaving the field keeps a named row and drops an empty one; Escape drops it; a name already in use is refused in the row. Measures, targets, colour and description are set on the record's own page. A new top-level group keeps its add page, because it is asked its number of levels. *(2026-11-23; an exception to "adds are pages", the same one Tags has)* **Replaced by #31.** |
| 19 | Classifications and groups are moved on the settings list as tags are: every row has a grip, shown on hover or focus. Dragging reorders a row or drops it into another group; clicking the grip opens a menu with the same moves, "Move to <group>" included. Levels limit where a row can land: a classification only into a group at the last level, a group only where its branch still fits. Every move saves at once. *(2026-11-23; replaces ordering on each group's own page as the only way)* **Replaced by #31.** |
| 20 | The classification tree is free. A group may hold groups and classifications together; any group may be moved under any other group or to the top level, at any depth, only never inside itself; a classification may sit in any group or in none. Projects are still filed on classifications only (5). *(2026-11-23; replaces 12, 13, 14, 16 and 17 — declared levels, a uniform depth and a groups-or-classifications rule each stopped a move the user expected to make: "if I want to move it I should be able to")* |
| 21 | A classification can become a group, and a group a classification, keeping its name, colour, description and place. A classification's performance measures and targets are removed (a group has none) and its projects lose it, so one that is in use asks first. A group that holds anything asks what becomes of it: kept, moved up to where the group was (the top level, for a top-level group), or removed. A conversion is refused when the other kind already has the name. *(2026-11-23)* |
| 22 | On the settings list each group has one "Add" (Classification, Group) that opens a row inside it, and the page header adds at the top level: a top-level group, or a classification in no group. Every add is a row in place; no add opens a page. *(2026-11-23; refines 18)* **Replaced by #31.** |
| 23 | Groups fold on the settings list: a chevron on each group's line hides what is inside it, and the folded set is remembered per reader. Adding into a folded group opens it. *(2026-11-23)* |
| 24 | The settings list has no "Targets set" column: a classification's row shows projects and performance measures. Targets are on each classification's own page. *(2026-11-23; refines 15)* |
| 25 | A classification is always in a group. Moved out of every group — "Move to top level", or dropped at the top level — it becomes a group there, asking first when it is in use (21). So the top level holds groups only, a top-level group cannot be converted to a classification, and the page header adds groups only. *(2026-11-23; refines 20 and 22, which allowed a classification in no group)* |
| 26 | Dragging on the settings list shows what will become part of what before anything moves, as Finder and Reminders do. Between rows an insertion line marks the gap, drawn at the indent of the group the row would join. Over a group's own line the group is marked and the row joins it; a thin band at the top or bottom of the line means beside it instead. The dragged row stays in place, dimmed, and a label with its name follows the pointer. The page scrolls when the pointer nears its top or bottom edge. Escape cancels. *(2026-11-23; replaces rows shuffling live under the pointer)* |
| 27 | An order arranged by hand can be put back to alphabetical. "Sort A to Z" in a group's menu sorts what is directly inside it, classifications among themselves and groups among themselves; the page header's "Sort A to Z" sorts the top-level groups. It does not sort inside nested groups. Numbers in names sort as numbers and case is ignored. *(2026-11-24)* |
| 28 | Inside the app the Classifications pages count every project. The public site's classification figures count only published projects. A Viewer with no organization sees the public site's figures, as the roles document says. *(2026-11-24; Q-187, Q-201)* |
| 29 | Converting a classification that projects use goes ahead only after a confirm that says what will happen (the projects lose it; its performance measures and targets stop), and the person can stop or continue. Converting a group to a classification offers "Remove them" only when no classification beneath it is in use; otherwise only "Keep them" and "Cancel". *(2026-11-24; confirms and narrows 21; Q-161, Q-185)* |
| 30 | Moving a client's ProjectFirma 1.x taxonomy into the product is out of scope for this feature. It will be scoped per client at a future date. *(2026-11-24; Q-198)* |
| 31 | The settings list is grouped rows on one column grid (the Tags construction): Name, Projects and Performance measures; every add and move is made in place; the page header has "Add group" and "Sort A to Z". Rows 15, 18, 19 and 22 are replaced by this row and by 20, 24 and 25. *(2026-11-24; Q-181, accepted as proposed)* |
| 32 | A classification or group rolls up every performance measure that any project beneath it reports toward, linked or not. A linked measure keeps its goal and shows first, in the catalog's order; an unlinked one follows, with "No goal set", measured against what its projects planned. Linking a measure to a classification now only sets a goal there. Retired measures stay out. *(2026-11-24, the user: "roll ups of the PMs of the projects … not only showing the ones that have a target"; Q-234, answered)* |
| 33 | A classification and a group can each have an icon, chosen on their own settings page (shortlist and search, as for project stages). It replaces the colour square beside the name wherever a name leads, tinted in the group's colour; a record has none until one is chosen; a conversion keeps it; an administrator can remove it, and the colour square leads again. A deliberate deviation from "icons mark structure, never items". *(2026-11-24, the user: "the ability to assign an icon to the classification as well"; Q-235, answered)* |
| 34 | Tags are removed from the product. A project is filed by project type and classifications only; there is no Tags settings page, no Tags field on a project, and no Tags filter, import column, export column, intake question or dashboard dimension. Rows 18, 19 and 31 describe the classifications list by comparison with Tags: the behavior stands, the comparison is history. *(2026-11-24)* |

## What is faked

- Groups added, moved, recoloured or removed are kept in this browser only (`src/lib/taxonomy-edits.ts`).
- A group added in this browser has no progress page; "Open group" opens its settings page.
- A group's progress page is built from the seeded tree. Moving a classification or linking a measure in Workspace settings does not change its totals.
- The index's two views are drawn from the seeded tree. Groups and classifications added, renamed, moved or removed in Workspace settings do not show there (the card board did follow them; it remains on a group's page).
- Anything moved or converted exists in this browser only. The reading pages (the index's two views, a group's page) are drawn from the seeded tree and do not show them.
- On the settings pages the crumbs show a record's full, current path of groups. The reading pages (a classification's and a group's) show the path from the seeded tree only.

## Sample data for each state

| State | Sample |
|---|---|
| Top-level group holding classifications | Plan goal |
| Top-level group holding groups | Practice area |
| Group inside a group | Channels & fish passage |
| Group holding both groups and classifications; a third level; a classification in no group; an empty group | none seeded; each is one move or add away in Workspace settings |
