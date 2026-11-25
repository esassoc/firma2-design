# Inventory — classifications

Harvested: 2026-11-24 · Prototype commit: bfaeff1, plus uncommitted changes (line numbers refer to the files as read) · Spec: `.scratch/classifications/spec.md` (decisions 1 to 27; 12, 13, 14, 16 and 17 are struck)
Covers: the whole feature as built today: the Classifications page (Outline and Browse views, peek panel), a classification's page, a group's page, and Settings › Classifications (the list, the record pages, the add pages, the performance measures and targets editor, remove).

Tags: `shown` the prototype does it · `decided` a spec, decision record, reasoned code comment or interview says so (`decided, not built` when the prototype does not do it yet) · `inferred` the harvester's reading, to be confirmed.

Sources name a file by its basename and line; full paths are under Scope. `spec #n` is a row of the spec's Decisions table. Every name in this file is invented sample data; the dev-only real-workspace switch (see Prototype artifacts) is never quoted here.

## Scope

Owned files (watched for drift, read in full):
- `src/pages/prototypes/classifications.astro`
- `src/pages/prototypes/classifications/[classification].astro`
- `src/pages/prototypes/classifications/groups/[group].astro`
- `src/pages/prototypes/workspace-settings/classifications.astro`
- `src/pages/prototypes/workspace-settings/classifications/new.astro`
- `src/pages/prototypes/workspace-settings/classifications/draft.astro`
- `src/pages/prototypes/workspace-settings/classifications/[classification].astro`
- `src/pages/prototypes/workspace-settings/classifications/groups/new.astro`
- `src/pages/prototypes/workspace-settings/classifications/groups/draft.astro`
- `src/pages/prototypes/workspace-settings/classifications/groups/[group].astro`
- `src/components/classifications/` (firma2-classification-index, -outline, -browse, -summary, -measures, -funding, -projects, -peek; firma2-goal-board, -goal-board-group, -goal-card; firma2-kpi-progress)
- `src/components/settings/firma2-classification-roster.astro`
- `src/components/settings/firma2-classification-group-members.astro`
- `src/components/settings/firma2-classification-kpi-editor.astro`
- `src/data/firma2-classifications.ts`
- `src/data/firma2-classification-rollup.ts`
- `src/data/firma2-classification-tree.ts`
- `src/lib/goal-kpis.ts`
- `src/lib/kpi-row.ts`
- `.scratch/classifications/spec.md`

Shared files, watched (hold a block that exists only for this feature):
- `src/components/settings/firma2-taxonomy-details.astro`, `firma2-taxonomy-create-form.astro`, `firma2-taxonomy-danger-zone.astro` — the `classification` and `classificationGroup` branches (colour, parent, path crumbs, group removal block). The rest belongs to `project-types` and `tags`.
- `src/lib/taxonomy-edits.ts` — the classification, classification-group and goal-target regions: ordering, `arrangeClassifications`, `convertTo*`, `sortAlphabetically`, group removal, KPI links and targets.
- `src/lib/taxonomy-record.ts` — `pathCrumbs`.
- `src/components/shared/bcn-sortable-list.ts` — the `drop="line"` mode, the nested-list targeting and the edge auto-scroll (built for this list).
- `src/components/shared/bcn-tooltip.ts` — written for the Outline's rings; used nowhere else yet.

Shared files read (not watched):
- `src/components/shared/bcn-progress-ring.astro`, `src/components/shared/firma2-rail.astro`, `src/lib/record-peek.ts` — the ring, the docked rail and the peek mechanics.
- `src/components/projects/firma2-project-grid.astro`, `firma2-project-peek-button.astro`, `firma2-project-peek-layout.astro` — the projects section and the side-panel button.
- `src/components/settings/firma2-tag-board.astro` — the construction the list copies (grips, in-place rows, convert).
- `src/data/firma2-workspace-settings.ts` (line 246) — the Security setting "Manage classifications".
- `src/data/firma2-performance-measures.ts` — the measure catalog, units, counting rule (`isSummable`), status.
- `src/data/firma2-projects.ts`, `firma2-project-detail.ts` — what a project carries and reports.
- `src/data/firma2-real-data.ts` — the dev-only real-workspace switch (see Prototype artifacts).

Unused by any route, so not a requirement: `src/components/shared/bcn-goal-meter.astro`, `src/lib/goal-meter.ts` (a bullet meter that the ring replaced).

## Actors

| ID | Actor | Does what here | Source | Tag |
|---|---|---|---|---|
| ACT-1 | Administrator | Sets up the workspace's classifications and groups, links performance measures to them, sets goal targets, removes them. Counts as a manager of everything. | classifications.astro (workspace-settings):3-9; firma2-workspace-settings.ts:246 | shown |
| ACT-2 | Person the Security setting "Manage classifications" lets in | Does what ACT-1 does here. The setting starts at administrators and a workspace can open it wider. | firma2-workspace-settings.ts:243-246; groups/[group].astro (workspace-settings):10 | decided, not built (no screen checks it) |
| ACT-3 | Anyone signed in who reads progress (Viewer, Contributor, Manager, Administrator) | Reads the Classifications page, a group's page and a classification's page; opens the peek; follows a name to a record. The brief's readers: the executive, the program manager, a funder or partner sent a link. | classifications.astro:7-10; classifications/[classification].astro (reading):2-13 | shown (no role is checked) |
| ACT-4 | Visitor (no account) | Sees the public classifications page, which is the `public-site` feature's. Not here. | system-map | out of scope |

## Objects

| ID | Object | Fields shown | Lifecycle | Source | Tag |
|---|---|---|---|---|---|
| OBJ-1 | Classification | name · description · own colour (used by the map and charts; lists show its group's colour) · the group it is in · its performance measures, each with a goal target · counts: projects, funders | added (row, or page) → renamed, described, moved, ordered, converted to a group → removed (only when no project works toward it) | firma2-classifications.ts:139-149; taxonomy-edits.ts:195 | shown |
| OBJ-2 | Classification group | name · description · colour · the group it sits inside (none = top level) · what it holds (classifications and groups, ordered) · counts of what is beneath it. No measures, targets or projects of its own. | added → renamed, recoloured, moved, ordered, sorted, converted to a classification → removed (only when empty and not the last group) | firma2-classifications.ts:40-61; spec #1-#5 | shown |
| OBJ-3 | Goal target | value (a number above zero) · year due · belongs to one classification and one performance measure; one per measure | set, changed, cleared; goes with the link when the measure is unlinked | firma2-classification-kpi-editor.astro:126-147; firma2-classifications.ts:131-137; spec #4 | shown |
| OBJ-4 | Performance-measure link (a KPI) | which catalog measure tracks the classification | linked from the catalog (never created here), unlinked ("Stop tracking") | firma2-classification-kpi-editor.astro:7-14,164-168 | shown |
| OBJ-5 | Order | one order per list: the top-level groups; the groups in each group; the classifications in each group | arranged by hand, put back to A to Z; new things join at the end | taxonomy-edits.ts:142-147,334-340 | shown |
| OBJ-6 | Roll-up (derived, never stored) | for a classification or a group: projects, estimated cost, spent to date, funders, funding by funder, each performance measure's progress | recomputed from project records | firma2-classification-rollup.ts:1-30,306-360 | shown |
| OBJ-7 | Reader preferences (stored on the reader's device) | the view chosen (Outline or Browse); which groups are folded on the settings list; which groups are closed on the card board; the chosen row in Browse (kept in the web address) | set by use | firma2-classification-index.astro:67; firma2-classification-roster.astro:575; firma2-goal-board.astro:231; firma2-classification-browse.astro:364 | shown |

## Screens

| ID | Screen | Reached from | Source | Tag |
|---|---|---|---|---|
| SCR-1 | Classifications page: a toggle (Outline, Browse) over the chosen view, with the classification peek docked beside it | the main navigation "Classifications"; the crumb "Classifications" | classifications.astro:7-45; firma2-classification-index.astro:28-37 | shown |
| SCR-2 | Outline view: the whole tree as one table (Name, Projects, Funders, Performance measures, Progress) | SCR-1, the default | firma2-classification-outline.astro:1-50; spec #6, #7 | shown |
| SCR-3 | Browse view: a list of every group and classification on the left, one chosen record on the right | SCR-1; a link ending `#g:<group>` or `#c:<classification>` | firma2-classification-browse.astro:1-45; spec #6, #8 | shown |
| SCR-4 | Classification peek: a docked side panel with a classification's name, its group's badge, summary figures and every performance measure | the side-panel button on a classification's row in SCR-2 or SCR-3 | firma2-classification-peek.astro:1-30,62-80; classifications.astro:39 | shown |
| SCR-5 | Classification page: summary, performance measures (Simple or Detailed), projects, funders | a name in SCR-1; a classification chip on a project; "Open classification" in SCR-3 and SCR-4; crumbs | classifications/[classification].astro (reading):1-99 | shown |
| SCR-6 | Group page: summary, contents (the card board scoped to the group), performance measures, projects, funders | a group's name in SCR-2; "Open group"; crumbs | classifications/groups/[group].astro:1-95 | shown |
| SCR-7 | Settings › Classifications: one section per top-level group, each its groups and classifications as rows | Workspace settings navigation; "Edit …" buttons go to SCR-8 and SCR-9 instead | firma2-classification-roster.astro:1-103; workspace-settings/classifications.astro | shown |
| SCR-8 | Settings › a classification: details (name, description, group), performance measures with goal targets, remove | its name in SCR-7; "Edit classification" on SCR-5 | workspace-settings/classifications/[classification].astro:1-60 | shown |
| SCR-9 | Settings › a group: details (name, description, parent group, colour) and remove (its two member lists are struck, Q-183) | its name in SCR-7; "Edit group" on SCR-6 | workspace-settings/classifications/groups/[group].astro:1-60 | shown |
| SCR-10 | Add classification page: name, description, group | the "Add classification" button on SCR-9; no-script links from SCR-7 | workspace-settings/classifications/new.astro; firma2-taxonomy-create-form.astro | struck (Q-182) |
| SCR-11 | Add group page: name, description, parent group | the "Add group" button on SCR-9; no-script links from SCR-7 | workspace-settings/classifications/groups/new.astro; firma2-taxonomy-create-form.astro:80 | struck (Q-182) |
| SCR-12 | Dialog: "Convert … to a group?" (confirm) | SCR-7 | firma2-classification-roster.astro:636-664 | shown |
| SCR-13 | Dialog: "Convert … to a classification?" with Keep them, Remove them, Cancel | SCR-7 | firma2-classification-roster.astro:666-701 | shown |
| SCR-14 | Dialog: "Remove …?" (confirm) | SCR-8, SCR-9 | firma2-taxonomy-danger-zone.astro:104-120 | shown |

## States

| ID | Screen or element | State | What the user sees | Source | Tag |
|---|---|---|---|---|---|
| STA-1 | SCR-1 | Outline chosen (default) | the Outline table; the toggle on "Outline" | firma2-classification-index.astro:28-37,67-80 | shown |
| STA-2 | SCR-1 | Browse chosen, or opened by a link ending `#g:` or `#c:` | the Browse view; the toggle on "Browse"; a link wins over the remembered choice | firma2-classification-index.astro:39-49,86-90 | shown |
| STA-3 | SCR-2 | at rest | every group open, every classification closed (its measure lines hidden) | firma2-classification-outline.astro:92-130 | shown |
| STA-4 | SCR-2 group row | folded | the group's rows (its classifications and groups, at every depth) are hidden; the chevron points down | firma2-classification-outline.astro:78 | shown |
| STA-5 | SCR-2 classification row | opened | one line per performance measure under the row: its ring, name and figure ("14 of 30 miles goal") | firma2-classification-outline.astro:97-130 | shown |
| STA-6 | SCR-2 classification row | no performance measures | the measure count reads 0 and the Progress cell is empty; no chevron | firma2-classification-outline.astro:92-130 | shown |
| STA-7 | SCR-2 group row | any | Projects, Funders and Performance measures count what is beneath it, each counted once; Progress is empty; "N classifications" beside the name | firma2-classification-outline.astro:82; firma2-classification-tree.ts:98-120 | shown |
| STA-8 | SCR-2 a ring | hovered or focused | a tooltip: the measure's name on one line, its figure on the next | firma2-classification-outline.astro:115; bcn-tooltip.ts | shown |
| STA-9 | SCR-2 on a phone | narrow screen | the table scrolls sideways and the Name column stays in place | firma2-classification-outline.astro:272 | shown |
| STA-10 | SCR-3 | on arrival with no link | the first group is chosen; the list shows the top level and that group's contents | firma2-classification-browse.astro:351,385 | shown |
| STA-11 | SCR-3 right side | a group chosen | its name, "Open group", description, "N classifications · N projects · N funders", then every classification beneath with every measure; groups inside under their own names | firma2-classification-browse.astro:80-135 | shown |
| STA-12 | SCR-3 right side | a classification chosen | its path of groups, name, "Open classification", description, counts, every measure; or "No performance measures yet" | firma2-classification-browse.astro:139-160 | shown |
| STA-13 | SCR-3 list | groups open or folded | each group has a chevron; any number can be open; a chosen row is never hidden inside a folded group | firma2-classification-browse.astro:349-363 | shown |
| STA-14 | SCR-3 list | many branches open | the list scrolls on its own, pinned, never taller than the window | firma2-classification-browse.astro:183 | shown |
| STA-15 | SCR-1 | no groups and no classifications at all | the Classifications page says "No classifications yet" and, to people who may set them up, adds a link "Set up classifications" to Settings (narrowed by Q-193); the prototype draws an empty table and an empty list | firma2-classification-outline.astro; firma2-classification-browse.astro | decided, not built (validated 2026-11-24, Q-193) |
| STA-16 | SCR-4 | closed | hidden until a side-panel button opens it; remembers its width | firma2-classification-peek.astro:48-61 | shown |
| STA-17 | SCR-4 | open | the title (a door to SCR-5), the group's badge tinted with the group's colour, "Open classification", the summary, every measure with its full figure | firma2-classification-peek.astro:62-110; spec #10 | shown |
| STA-18 | SCR-5 | a measure with a goal | "14 of 30 miles goal", the share as the tile's big figure ("47%"), "16 not yet planned" | kpi-row.ts:96-140 | shown |
| STA-19 | SCR-5 | a measure with no goal | measured against what projects planned ("14 of 20 planned"); "No goal set" | kpi-row.ts:96-140 | shown |
| STA-20 | SCR-5 | a measure nobody reported | "Not reported" | kpi-row.ts:117-121 | shown |
| STA-21 | SCR-5 | a measure fully planned | the "not yet planned" line is gone; the ring says so | kpi-row.ts:131-137 | shown |
| STA-22 | SCR-5 | no performance measures | "No performance measures yet"(narrowed 2026-11-24: the toggle's absence is STA-48) | firma2-classification-measures.astro:99-104,409-414 | shown |
| STA-23 | SCR-5 | Detailed (narrowed 2026-11-24: Simple is STA-47) | a table with a row per project and a column per year; each measure folds | firma2-classification-measures.astro:416-461 | shown |
| STA-24 | SCR-5 | no funding on its projects | "No funding yet" | firma2-classification-funding.astro:60-64 | shown |
| STA-25 | SCR-5 | a project carries more than one classification | the note "Whole-project amounts, so totals overlap across classifications." | firma2-classification-funding.astro:47,77-81 | shown |
| STA-26 | SCR-5 and SCR-6 | the record was removed in this browser | the ordinary "not found" page with a link back to Classifications (narrowed by Q-194); the prototype shows a warning "Removed in Workspace settings." in place of the figures | firma2-classification-summary.astro:72-84 | decided, not built (validated 2026-11-24, Q-194) |
| STA-27 | SCR-6 | a group with nothing beneath it | "Nothing in this group" | firma2-goal-board.astro:63-65 | shown |
| STA-28 | SCR-6 contents | groups open or closed | each group is a collapsible card section, closed ones remembered per reader | firma2-goal-board.astro:231-247; firma2-goal-board-group.astro:41 | shown |
| STA-29 | SCR-7 | all open / some folded | a chevron on each group's line hides what is inside; the folded set is remembered; folded top-level groups sit directly under each other | firma2-classification-roster.astro:575-606 | shown; spec #23 |
| STA-30 | SCR-7 | no groups at all | "No groups yet. Add one to start." with "Add group" (narrowed by Q-193); the prototype also offers "a classification on its own" | firma2-classification-roster.astro:139-142,953 | decided, not built (validated 2026-11-24, Q-193) |
| STA-31 | SCR-7 | an add row is open | one name field where the new thing will sit, cursor in it; only one at a time | firma2-classification-roster.astro:811-860 | shown; spec #18 |
| STA-32 | SCR-7 | a name is refused in an open add row | the message sits in the row ("A group already has this name."); narrowed 2026-11-24: conversion refusals are STA-44 and STA-45 | firma2-classification-roster.astro:629,826,636-641 | shown |
| STA-33 | SCR-7 | a row is dragged | nothing moves; a line marks the gap at the indent of the list it would join; a group under the pointer is tinted and ringed; a label with the row's name follows the pointer; the row stays, dimmed; the page scrolls near its top and bottom edges | bcn-sortable-list.ts:51-75,557-580; spec #26 | shown |
| STA-34 | SCR-7 | a classification is dragged | a drop row "Drop here to make it a group" appears above the groups | firma2-classification-roster.astro:948 | shown |
| STA-35 | SCR-7 | the pointer is on a row | its grip and "…" show; on a device with no hover they always show | firma2-classification-roster.astro (hover rules in the style block) | shown |
| STA-36 | SCR-8 | in use | "Remove" is off with the reason "Take it off its N projects first." | firma2-taxonomy-danger-zone.astro:34-43 | shown |
| STA-37 | SCR-8 | not in use | "No project works toward this goal." and "Remove" is on | firma2-taxonomy-danger-zone.astro:40-41 | shown |
| STA-38 | SCR-8 measures | none linked | "No performance measures yet" and the "Add a performance measure" choice | firma2-classification-kpi-editor.astro:51-54 | shown |
| STA-39 | SCR-8 a measure | target cleared | the measure keeps tracking without a goal line; the Outline's share cell says "No goal" and the measure line says "No goal set" | firma2-classification-kpi-editor.astro:14,131-134 | shown |
| STA-40 | SCR-9 | holds something | "Remove" is off: "Move its classification to another group first." / "Move or remove the N groups inside it first." | taxonomy-edits.ts:383-394; firma2-taxonomy-danger-zone.astro:89-103 | shown |
| STA-41 | SCR-9 | the last group | "The last group can’t be removed." | taxonomy-edits.ts:392 | shown |
| STA-42 | SCR-8 | any | crumbs carry the classification's full, current path of groups | firma2-taxonomy-details.astro:84-95; taxonomy-record.ts:23-55 | shown |
| STA-43 | SCR-9 lists | empty | "No classifications in this group" / "No groups inside this group" | firma2-classification-group-members.astro (empty states) | struck (Q-183) |
| STA-44 | SCR-7 classification row | a conversion to a group is refused because a group already has the name | "A group already has this name." under the row; nothing changes | firma2-classification-roster.astro:636-641 | shown |
| STA-45 | SCR-7 group line | a conversion to a classification is refused because a classification already has the name | "A classification already has this name." under the line; nothing changes | firma2-classification-roster.astro:666-671 | shown |
| STA-46 | SCR-9 | any | crumbs carry the group's full, current path of groups; narrowed 2026-11-24: STA-42 now covers the classification's page | firma2-taxonomy-details.astro:84-95 | shown |
| STA-47 | SCR-5 | Simple (the default) | one tile per performance measure, four to a row: its ring, the share of the goal, its name, "14 of 30 miles goal", "16 not yet planned" | firma2-classification-measures.astro:352-392 | shown |
| STA-48 | SCR-5 | no performance measures | the Simple/Detailed toggle is not offered | firma2-classification-measures.astro:409-414 | shown |

## Actions

| ID | Screen | Action (control and label) | Result | Source | Tag |
|---|---|---|---|---|---|
| ACN-1 | SCR-1 | the toggle "Outline" / "Browse" | switches the view; remembered per reader; choosing Outline clears a Browse link from the web address | firma2-classification-index.astro:78-100 | shown |
| ACN-2 | SCR-2 | a group row's chevron "Hide …" / "Show …" | folds or opens everything beneath the group | firma2-classification-outline.astro:78,300-330 | shown |
| ACN-3 | SCR-2 | a classification row's chevron "Show measures for …" | opens or closes its measure lines | firma2-classification-outline.astro:97 | shown |
| ACN-4 | SCR-2 | a name link | goes to SCR-5 (classification) or SCR-6 (group) | firma2-classification-outline.astro:82,100 | shown |
| ACN-5 | SCR-2, SCR-3 | the side-panel button on a classification | opens SCR-4 beside the page | firma2-classification-outline.astro:92; firma2-classification-browse.astro:118 | shown |
| ACN-6 | SCR-2 | hover (mouse) or focus a ring | opens the tooltip after 300 ms (at once if another just closed); Esc closes it; moving onto the bubble keeps it open | bcn-tooltip.ts:104-175 | shown |
| ACN-7 | SCR-3 | a name in the list | chooses it: the right side shows it; the web address holds the choice; a screen reader hears "Showing …" | firma2-classification-browse.astro:365-390 | shown |
| ACN-8 | SCR-3 | a group's chevron in the list | opens or folds the group's rows only | firma2-classification-browse.astro:349-363 | shown |
| ACN-9 | SCR-3 | "Open group" / "Open classification" | goes to SCR-6 / SCR-5 | firma2-classification-browse.astro:80-90,146 | shown |
| ACN-10 | SCR-4 | the title door, "Open classification", close, drag the edge, Esc | goes to SCR-5; closes; resizes between 26rem and 45rem | firma2-classification-peek.astro:48-61,62-110 | shown |
| ACN-11 | SCR-5 | the toggle "Simple" / "Detailed" | switches tiles and table; Detailed opens every measure | firma2-classification-measures.astro:416-447 | shown |
| ACN-12 | SCR-5 | a measure's chevron in Detailed | folds its project rows | firma2-classification-measures.astro:449-461 | shown |
| ACN-13 | SCR-5 | a project's name, its side-panel button | goes to the project; opens the project peek | firma2-classification-measures.astro:430-440 | shown |
| ACN-14 | SCR-5 | "View as data" under the funders chart | opens the table of grants | firma2-classification-funding.astro:87-90 | shown |
| ACN-15 | SCR-5 | "Edit classification" (top bar) | goes to SCR-8 | classifications/[classification].astro (reading):27-30 | shown to everyone; decided, not built: shown only to people the setting lets in (validated 2026-11-24, Q-180) |
| ACN-16 | SCR-6 | "Edit group" (top bar) | goes to SCR-9 | classifications/groups/[group].astro:25-28 | shown to everyone; decided, not built: shown only to people the setting lets in (validated 2026-11-24, Q-180) |
| ACN-17 | SCR-6 | a card group's title; "Open group" | closes or opens the group's cards; goes to that group's page | firma2-goal-board-group.astro:41-44 | shown |
| ACN-18 | SCR-7 | the top bar's "Add group" | opens a top-level group's row at the foot of the list | firma2-classification-roster.astro:970-995; classifications.astro (workspace-settings):23-34 | shown; spec #22, #25 |
| ACN-19 | SCR-7 | the top bar's "Sort A to Z" | puts the top-level groups in alphabetical order | firma2-classification-roster.astro:978-983; taxonomy-edits.ts:334 | shown; spec #27 |
| ACN-20 | SCR-7 | a group's "Add" menu: "Classification", "Group" | opens a row for that kind inside the group; opens the group first if it is folded | firma2-classification-roster.astro:611-625 | shown; spec #22 |
| ACN-21 | SCR-7 | typing in an add row | Enter keeps it and opens the next row; leaving the field keeps a named row and drops an empty one; Esc drops it | firma2-classification-roster.astro:811-860 | shown; spec #18 |
| ACN-22 | SCR-7 | a group's "…" menu: "Sort A to Z" | sorts what is directly inside the group: classifications among themselves, groups among themselves; does not reach into nested groups | firma2-classification-roster.astro:729-735,778-790; spec #27 | shown |
| ACN-23 | SCR-7 | a group's "…" menu: "Convert to classification" (not on a top-level group) | SCR-13 when it holds anything, else converts at once | firma2-classification-roster.astro:666-701; spec #21, #25 | shown |
| ACN-24 | SCR-7 | a classification's "…" menu: "Convert to group" | SCR-12 when it is in use, else converts at once; keeps name, colour, description and place | firma2-classification-roster.astro:636-664; spec #21 | shown |
| ACN-25 | SCR-7 | SCR-13's "Keep them" / "Remove them" / "Cancel" | keeps: what the group held moves up to where the group was; removes: every group and classification beneath it goes; cancel changes nothing | firma2-classification-roster.astro:687-701; taxonomy-edits.ts:363-376 | shown |
| ACN-26 | SCR-7 | drag a row by its grip | reorders it, drops it into a group (the group is marked), or beside a row (a line); Esc cancels; a classification dropped on the top-level drop row becomes a top-level group, asking first when it is in use | firma2-classification-roster.astro:998-1020; bcn-sortable-list.ts:51-75; spec #19, #25, #26 | shown |
| ACN-27 | SCR-7 | a row's grip menu: "Move up", "Move down", "Move to top", "Move to bottom" | the same reordering as dragging, without dragging (narrowed 2026-11-24: "Move to <group>" and "Move to top level" are ACN-42) | bcn-sortable-list.ts:318-350; spec #19, #20 | shown |
| ACN-28 | SCR-7 | a group's chevron | folds or opens it; remembered | firma2-classification-roster.astro:575-606 | shown; spec #23 |
| ACN-29 | SCR-7 | a name link | goes to SCR-8 or SCR-9 | firma2-classification-roster.astro (nameLink) | shown |
| ACN-30 | SCR-8 | the Name field of a classification | saved when the reader leaves it; blank ("Enter a name.") or taken ("A classification already has this name.") is refused and the old name stands; the title, crumb and tab follow | firma2-taxonomy-details.astro:115-130 | shown |
| ACN-31 | SCR-8 | the Description field of a classification | saved when the reader leaves it | firma2-taxonomy-details.astro:131 | shown |
| ACN-32 | SCR-8 | the Group choice | moves the classification to that group (every group is offered, by full path); crumbs follow | firma2-taxonomy-details.astro:88-100,132 | shown |
| ACN-33 | SCR-9 | the Parent group choice | "None" (top level) or any group that is not itself or beneath it; crumbs follow | firma2-taxonomy-details.astro:101-112 | shown |
| ACN-34 | SCR-9 | the Color picker | sets the group's colour; saved on change | firma2-taxonomy-details.astro (color) | shown |
| ACN-35 | SCR-8 | "Add a performance measure" | links a catalog measure; it leaves the choices | firma2-classification-kpi-editor.astro:158-168 | shown |
| ACN-36 | SCR-8 | "Goal target" and "Due by" fields | saved together when either is left; blank value clears the target | firma2-classification-kpi-editor.astro:126-149 | shown |
| ACN-37 | SCR-8 | "Stop tracking" | unlinks the measure and removes its target | firma2-classification-kpi-editor.astro:150-153 | shown |
| ACN-38 | SCR-8, SCR-9 | "Remove" in the danger zone | SCR-14; confirm removes the record and goes to SCR-7 | firma2-taxonomy-danger-zone.astro:104-120 | shown |
| ACN-39 | SCR-9 | drag or "…" a row in its classifications list or groups list | reorders it within that list | firma2-classification-group-members.astro:133-140 | struck (Q-183) |
| ACN-40 | SCR-9 | "Add classification" / "Add group" | goes to SCR-10 / SCR-11 with this group chosen | firma2-classification-group-members.astro:46 | struck (Q-182, Q-183) |
| ACN-41 | SCR-10, SCR-11 | "Add classification" / "Add group", "Cancel" | validates the name, adds, and opens the new record's page (a draft route here) | firma2-taxonomy-create-form.astro:140-160 | struck (Q-182) |
| ACN-42 | SCR-7 | a row's grip menu: "Move to <group>", "Move to top level" | moves the row into that group at its end, or to the top level (for a classification that is a conversion, ACN-24); "Move to <group>" lists every group except itself and the ones beneath it | bcn-sortable-list.ts:318-350; taxonomy-edits.ts:322-326; spec #19, #20 | shown |
| ACN-43 | SCR-8 | the Color control (a classification's colour) | sets the colour the map and charts use for the classification | Q-195 | decided, not built (validated 2026-11-24, Q-195) |
| ACN-44 | SCR-9 | the Name field of a group | saved when the reader leaves it; blank ("Enter a name.") or taken ("A group already has this name.") is refused and the old name stands; the title, crumb and tab follow | firma2-taxonomy-details.astro:115-130 | shown |
| ACN-45 | SCR-9 | the Description field of a group | saved when the reader leaves it | firma2-taxonomy-details.astro:131 | shown |

## Rules

| ID | Rule | Source | Tag |
|---|---|---|---|
| RUL-1 | Projects are filed on classifications only, never on a group. A group's projects are those of the classifications beneath it. A group has no performance measures or targets of its own. | spec #3, #4, #5; firma2-classifications.ts:21-27 | decided |
| RUL-2 | A classification is always in a group. Moved out of every group it becomes a group at the top level, asking first when it is in use. The top level holds groups only. (Narrowed 2026-11-24: the top-level group's missing "Convert to classification" is RUL-41.) | spec #25; firma2-classification-roster.astro:778-790,998-1020 | decided |
| RUL-3 | The tree is free: a group may hold groups and classifications together; any group goes under any other group or to the top level, at any depth, never inside itself. Declared levels, a uniform depth and a groups-or-classifications rule were built and withdrawn. | spec #20; taxonomy-edits.ts:322-326 | decided |
| RUL-4 | A name is unique among classifications, and among groups, ignoring upper and lower case and surrounding space. A classification and a group may share a name only until one is converted: a conversion is refused when the other kind already has the name. | taxonomy-edits.ts:187-190,349-376; firma2-taxonomy-details.astro:122 | decided (validated 2026-11-24, Q-154) |
| RUL-5 | A new classification or group is dealt the next of six colours. (A group's colour: RUL-42. A classification's colour control: RUL-43.) A classification's own colour is used by the map and by charts. | taxonomy-edits.ts:193,209; firma2-taxonomy-details.astro | shown |
| RUL-6 | In the Classifications page's lists, on the group page's cards and in the peek, a classification's swatch is its parent group's colour (the settings list draws no swatch on a classification's row); the side panel's group badge is a light tint of the group's colour under dark text. | spec #9, #10; firma2-classifications.ts:248-255 | decided |
| RUL-7 | Order is stored per list. A new thing joins the end of its list. Inside a group the classifications come before its groups. "Sort A to Z" orders one list, ignoring case and reading numbers as numbers ("Biennium 2" before "Biennium 10"); it does not reach into groups inside. Nothing sorts by itself, so an order someone arranged never changes underneath them (Q-190). | taxonomy-edits.ts:142-147,334-340; spec #27 | decided (spec #27; validated 2026-11-24, Q-190) |
| RUL-8 | A classification can be removed only when no project works toward it. A group can be removed only when it holds no classification and no group, and is not the last group. | firma2-taxonomy-danger-zone.astro:34-43; taxonomy-edits.ts:383-394 | decided (validated 2026-11-24, Q-153) |
| RUL-9 | Classification to group: keeps name, colour, description and place; its performance measures and goal targets are removed (a group has none) and its projects lose it. Asks first when it is in use: the confirm says what will happen (the projects lose it; its measures and targets stop), and the person can stop or continue (Q-161). | taxonomy-edits.ts:349-354; firma2-classification-roster.astro:636-664; spec #21 | decided (spec #21; validated 2026-11-24, Q-161) |
| RUL-10 | Group to classification: keeps name, colour, description and place. What it held is kept (moved up to where the group was) or removed (every group and classification beneath it), and it asks which whenever the group holds anything. "Remove them" is offered only when no classification beneath the group is in use; otherwise the dialog says how many are and offers only "Keep them" and "Cancel" (narrowed by Q-185; the prototype removes them even when projects use them). | taxonomy-edits.ts:363-376; firma2-classification-roster.astro:666-701; spec #21 | decided, not built (validated 2026-11-24, Q-185) |
| RUL-11 | An add takes only a name. Description, colour, performance measures and targets are set on the record's own page. | spec #18; firma2-classification-roster.astro:49-59 | decided |
| RUL-12 | A drag shows before it changes anything: an insertion line at the indent of the list the row would join; over a group's own line the group is marked and the row joins it; a thin band at the top or bottom of a line means beside it. Esc cancels. | spec #26; bcn-sortable-list.ts:51-75 | decided |
| RUL-13 | Every move saves at once, by drag or by menu. A group is never offered, or dropped, inside itself or a group beneath it. | firma2-classification-roster.astro:998-1020; bcn-sortable-list.ts:318-350 | shown |
| RUL-14 | A project counts toward a performance measure under a classification only when it carries the classification and one of its measures reports toward that measure. A project carrying the classification but reporting nothing is counted as a project, not as progress. | firma2-classification-rollup.ts:7-12 | decided |
| RUL-15 | A measure that adds (its counting rule is "sum") adds across projects. One that does not add is averaged over the projects that reported and never gets a committed total. | firma2-classification-rollup.ts:16-24,214-232 | decided |
| RUL-16 | A project's row must use the measure's unit; a mismatch stops the build rather than adding acres to miles (a few named aliases are allowed). | firma2-classification-rollup.ts:45-60,200-204 | decided |
| RUL-17 | The ring and the figure measure against the goal target; with none, against what projects planned, and the note says "No goal set". The share of the goal never shows 100% before it is reached (99%). "N not yet planned" shows only while the goal exceeds what is planned. | kpi-row.ts:96-140 | decided |
| RUL-18 | A group's page adds up everything filed beneath it, each project once, each report counted once however many of its classifications a project carries. Its measures read reported against what its projects planned, because a group has no target (Q-152). | firma2-classification-rollup.ts:306-360; groups/[group].astro:29-35; spec #3, #4 | decided (validated 2026-11-24, Q-152) |
| RUL-19 | Funding on these pages is whole-project dollars: a grant funds a project and a project carries several classifications, so the same dollars appear under each. The note says so when any project carries more than one. Funders are ranked by total; totals must not be added across classifications. | firma2-classification-funding.astro:20-28,47,77-81 | decided |
| RUL-20 | A goal target is a number above zero and a year due from this year to fifty years on; both are saved together when either field is left; a blank value clears the target; a blank year takes five years from now; one target per measure; unlinking the measure removes it. | firma2-classification-kpi-editor.astro:126-153; taxonomy-edits.ts:475-487 | shown |
| RUL-21 | Only catalog measures that are not retired and have a name can be linked; a measure is defined in Performance measures, never here; a linked measure leaves the choices. | firma2-classification-kpi-editor.astro:7-14,36-38,158-161 | decided |
| RUL-22 | Per-year interim targets are not part of this feature: one target and one due year per measure. | workspace-settings/[classification].astro:16-17 | decided |
| RUL-23 | The Outline's counts: Projects are the distinct projects beneath; Funders the distinct organizations administering a funding source on them; Performance measures the number of measures that apply (for a group, the distinct measures of what is beneath it); one ring per measure for a classification, none for a group. Every column means one thing on every row. | firma2-classification-tree.ts:76-127; spec #7 | decided |
| RUL-24 | The Classifications page defaults to Outline and remembers each reader's choice; a link ending `#g:` or `#c:` opens Browse; choosing Outline clears that link so a reload stays on Outline. Browse shows every level of the tree; groups start folded except the chosen one's own branch; a chosen row is never hidden. Outline has no link to a single row (Q-192). | spec #6, #8; firma2-classification-index.astro:39-100; firma2-classification-browse.astro:349-390 | decided (validated 2026-11-24, Q-192) |
| RUL-25 | Outline groups start open and classification measure lines start closed; folding a group hides the whole branch. | firma2-classification-outline.astro:92-130,300-330 | shown |
| RUL-26 | The ring tooltip is never the only way to a fact: opening the row shows the same name and figure. It opens after 300 ms, closes on Esc, and stays open while the pointer is on it. | bcn-tooltip.ts:104-175; firma2-classification-outline.astro:97-130 | shown |
| RUL-27 | The settings list shows what is wrong with setup: a classification with no performance measures shows 0; setup is read down the Performance measures column. A "Targets set" column was cut as not relevant here. | firma2-classification-roster.astro:61-68; spec #24 | decided |
| RUL-28 | A folded group stays folded across visits; adding into a folded group opens it. (Narrowed 2026-11-24: a folded group taking a row sent with "Move to" is RUL-90; its not being a place to drop one by dragging is RUL-91.) | firma2-classification-roster.astro:28-33,597-624; spec #23 | decided |
| RUL-29 | The settings crumbs show a record's full path of groups, outermost first, each a link, and show the new path when the record is opened after a move (narrowed 2026-11-24: changing the Group or Parent group on the record's own page is RUL-44 and RUL-45). | firma2-taxonomy-details.astro:84-95,132-140; taxonomy-record.ts:23-55 | shown |
| RUL-30 | The reading pages' record pages carry an edit door: "Edit classification" and "Edit group" go to the record's settings page; the reading pages never edit in place. | spec #11; classifications/[classification].astro (reading):27-30 | decided |
| RUL-31 | Who may change the tree is the Security setting "Manage classifications" (administrators by default; a workspace may open it wider). Others do not see the edit doors or the settings. | firma2-workspace-settings.ts:243-246 | decided, not built (spec; validated 2026-11-24, Q-180) |
| RUL-32 | A group is not public in the first cut: the public sees classifications as today and a group has no public page. | spec "Who it is for": "Visitor: not yet"; Q-155 | decided (validated 2026-11-24, Q-155) (owned by `public-site`; out of scope here) |
| RUL-33 | The figures on the Classifications pages inside the app count every project. The public site's classification figures count only published projects. A Viewer with no organization sees the public site's figures (published projects only), as the roles document says; every other signed-in reader sees the all-projects figures (Q-201). Proposed (Q-233, following the roles document's "a Viewer reads published values everywhere"): every Viewer, with or without an organization, sees the published-only figures; Contributors, Managers and Administrators see the all-projects figures. | interview 2026-11-24, Q-187, Q-201 | decided (interview 2026-11-24, Q-187, Q-201); proposed (Q-233) |
| RUL-34 | Each structure change (add, rename, move, convert, remove, sort, target set) is written to the change log with who and when, visible to administrators. There is no undo beyond the confirms shown; a person puts things back by moving or converting them again. | Q-186 | decided, not built (validated 2026-11-24, Q-186) |
| RUL-35 | Two people changing the tree at once: each change saves on its own and the last save wins; a row someone else already moved or removed returns to its current place when the page next refreshes, with a message ("Someone else changed this."). No locks. | Q-188 | decided, not built (validated 2026-11-24, Q-188) |
| RUL-36 | A name is at most 100 characters and a description at most 300; at the limit the field shows how many are left and takes no more. There is no limit on depth or count (designed for six levels and five hundred classifications). | Q-189 | decided, not built (validated 2026-11-24, Q-189) |
| RUL-37 | Nobody is notified when the tree changes. | Q-191 | decided (validated 2026-11-24, Q-191) |
| RUL-38 | A classification is "in use" when any project carries it, in any stage and whether or not the project is published; the removal and conversion messages give that number. | Q-196 | decided (validated 2026-11-24, Q-196) |
| RUL-39 | A performance measure that is retired while linked leaves the pages and the editor's choices; its link and goal target are kept, so bringing the measure back restores them. | Q-197 | decided, not built (validated 2026-11-24, Q-197) |
| RUL-40 | When a save fails the row returns to where it was and a message under the page title says "Couldn't save the change. Try again."; nothing else the person did is lost. | Q-199 | decided, not built (validated 2026-11-24, Q-199) |
| RUL-41 | A top-level group has no "Convert to classification": a classification cannot stand at the top level, so there is nowhere for it to become one. | spec #25; firma2-classification-roster.astro:778-790 | decided |
| RUL-42 | A group's colour is chosen with a Color control on its settings page and saved on change. | firma2-taxonomy-details.astro (color) | shown |
| RUL-43 | A classification's colour is changed with a Color control on its settings page, as a group's is; the map and charts use it, lists use the group's. | Q-195 | decided, not built (validated 2026-11-24, Q-195) |
| RUL-44 | On a classification's own page in Settings, changing its Group updates its crumbs at once. | firma2-taxonomy-details.astro:84-95,132-140 | shown |
| RUL-45 | On a group's own page in Settings, changing its Parent group updates its crumbs at once. | firma2-taxonomy-details.astro:84-95,132-140 | shown |
| RUL-46 | A rename is checked against every other record of the same kind and never against the record itself, so the same name in different letters is accepted. | taxonomy-edits.ts:187-190 | shown |
| RUL-47 | Each details field saves on its own as it is left; a refused name blocks nothing else (description, group, colour still save). | firma2-taxonomy-details.astro:115-140 | shown |
| RUL-48 | A colour typed in that is not a three- or six-digit hex value is not saved; the old colour stands. | firma2-taxonomy-details.astro (colour change handler) | shown |
| RUL-49 | Changing a classification's group leaves its performance measures, goal targets and projects alone. | taxonomy-edits.ts:219-229 | shown |
| RUL-50 | A move changes only the row's place: a moved group joins the end of its new parent's groups and keeps its name, description, colour and contents; a moved classification keeps its measures, targets and projects. | taxonomy-edits.ts:219-229,403-417 | shown |
| RUL-51 | A group's name may equal a classification's name; the two kinds are checked apart, and a conversion is refused when the other kind has the name (RUL-4). | taxonomy-edits.ts:187-190 | shown |
| RUL-52 | A year typed with no goal number is emptied and not saved; both the number and the year are checked before either is kept. | firma2-classification-kpi-editor.astro:126-149 | shown |
| RUL-53 | Removing a classification also removes its performance-measure links and goal targets. | taxonomy-edits.ts:248-267 | shown |
| RUL-54 | "N not yet planned" carries no unit and is rounded to four decimals before it is shown. | kpi-row.ts:93,106-107 | shown |
| RUL-55 | A measure that adds reads 0 when a project reported 0 toward it, and "—" when no project reports toward it at all. | firma2-classification-rollup.ts:214-232 | shown |
| RUL-56 | For a measure that does not add, the average leaves out the projects that reported 0. | firma2-classification-rollup.ts:214-232 | shown |
| RUL-57 | The date a goal is due is never shown on the Classifications pages (the year is set and seen on the settings page only). | kpi-row.ts; firma2-classification-measures.astro | shown (open question closed by Q-222: stays as built) |
| RUL-58 | In Outline a group's fold state is kept apart from each classification's open state, so an inner fold survives its parent being hidden and shown. | firma2-classification-outline.astro:300-330 | shown |
| RUL-59 | In every list a group's own classifications come before the groups inside it. | firma2-classification-outline.astro:44-49; firma2-classification-roster.astro | shown |
| RUL-60 | The ring tooltip opens for a mouse only (touch and pen are ignored); Esc, a scroll and a resize each close it; only one bubble exists at a time. | bcn-tooltip.ts:104-175 | shown |
| RUL-61 | An unknown `#` key on the Classifications page falls back to the first group. | firma2-classification-browse.astro:365-390 | shown |
| RUL-62 | Only a click on a name in Browse changes the address and announces; following a link never writes the remembered view. | firma2-classification-browse.astro:365-390; firma2-classification-index.astro:67-100 | shown |
| RUL-63 | In Browse's list a group with no classification beneath it has no chevron. | firma2-classification-browse.astro:84 | shown |
| RUL-64 | At a content width of 904 px or less the peek drops under the page instead of sitting beside it. | firma2-classification-peek.astro (unpinAt); firma2-rail.astro:292-324 | shown |
| RUL-65 | The peek is independent of Browse's chosen row. | firma2-classification-peek.astro | shown |
| RUL-66 | A classification's page opens on Simple every time; the Simple/Detailed choice is not stored. | firma2-classification-measures.astro (script) | shown |
| RUL-67 | In Detailed a project's year cell reads "—" for a year inside its span with nothing filed and is empty outside its span. | kpi-row.ts | shown |
| RUL-68 | The Projects section lists every project that carries the classification. | firma2-classification-projects.astro | shown |
| RUL-69 | Funders with equal totals are ordered by name, A to Z. | firma2-classification-rollup.ts (funderTotals) | shown |
| RUL-70 | The funders chart's tooltip counts distinct projects. | firma2-classification-funding.astro | shown |
| RUL-71 | The funding data table's columns sort. | firma2-classification-funding.astro | shown |
| RUL-72 | Cards on a group's page have no side-panel button. | groups/[group].astro:57 | shown |
| RUL-73 | On a group's page a nested group with nothing beneath it is not shown. | firma2-goal-board.astro:147 | shown |
| RUL-74 | A card shows the classification's name as a door to its page, its description cut to two lines, the first three performance measures as one-line rows with their share, "+N more measures" when there are more, and a footer "N projects · N funders". | firma2-goal-card.astro | shown |
| RUL-75 | A group's performance measures are the non-retired measures tracked by any classification beneath it, then those reported by a project beneath it that none tracks (Q-234). | firma2-classification-rollup.ts (groupMeasures) | shown |
| RUL-76 | The public site reuses the same progress arithmetic over published projects only. | firma2-public-site.ts:217-232 | shown |
| RUL-77 | The first-run state of the settings list ends at the first group, even a group holding no classification. | derived; nothing draws it today | decided, not built (Q-193) |
| RUL-78 | An address that never existed shows the same page as a removed record. | derived | decided, not built (Q-194) |
| RUL-79 | Dragging a group onto another group's thin bottom band means "after it" only when that group shows nothing inside; otherwise it means "inside it". | bcn-sortable-list.ts:566-574 | shown |
| RUL-80 | Over a classification row the drag line is "before" the row except in its bottom band (proposed in Q-210: before in the top half, after in the bottom half). | bcn-sortable-list.ts:556-566 | shown (proposed change: Q-210) |
| RUL-81 | A drag starts only after vertical travel: a sideways-only press never starts one. | bcn-sortable-list.ts:540-542 | shown |
| RUL-82 | The product asks before converting a classification that has projects or measures linked (proposed in Q-212; the spec speaks only of projects). | firma2-classification-roster.astro:652 | shown (proposed: Q-212) |
| RUL-83 | A converted row lands at the end of its list, because it is removed and re-added; the rows kept from a converted group join the end of theirs. | taxonomy-edits.ts:349-376 | shown (proposed: Q-213) |
| RUL-84 | A name clash is checked before any question on both conversion paths. | firma2-classification-roster.astro:636-641,666-671 | shown |
| RUL-85 | The group-to-classification question counts every depth; "Keep them" moves only what is directly inside. | firma2-classification-roster.astro:677-684; taxonomy-edits.ts:363-376 | shown |
| RUL-86 | Declining the question when a classification is dropped on the top-level row leaves the row exactly where it was (the prototype puts it at the end of its old group). | firma2-classification-roster.astro:998-1020 | decided (spec #25: "asking first"; the prototype differs) |
| RUL-87 | A classification chosen on its own in Browse shows an "Open classification" button and no side-panel button on the right; the side-panel button is on each classification's block inside a group's detail (firma2-classification-browse.astro:109-118). The left list has none. | firma2-classification-browse.astro:139-160 | shown |
| RUL-88 | The settings list draws a swatch on a group's line and none on a classification's row; a classification's own colour appears nowhere in it. | firma2-classification-roster.astro:699-715,770-776 | shown |
| RUL-89 | A description shows under every group line and every classification row on the settings list, cut to two lines (the prototype shows none under a nested group; proposed in Q-203). | firma2-classification-roster.astro:920-936 | shown (proposed: Q-203) |
| RUL-90 | A folded group still takes a row sent to it with "Move to": the row joins it and the group stays folded. | firma2-classification-roster.astro:597-624 | decided (spec #23) |
| RUL-91 | A folded group is not a place to drop a row by dragging: it is not marked and the row does not join it; the row goes beside it (proposed in Q-209; the prototype marks the group and drops the row in). | firma2-classification-roster.astro:597-624; bcn-sortable-list.ts | decided (spec #23); proposed change: Q-209 |
| RUL-92 | A classification's page and every list that draws its measures show each performance measure that any project carrying the classification reports toward, linked or not. A linked measure shows first, in the catalog's order, then the unlinked ones in catalog order. A measure no project reports and no one linked is not shown. | firma2-classification-rollup.ts (reportedMeasures, linkedThenReported, rollupClassification) | shown (proposed: Q-234) |
| RUL-93 | Linking a performance measure to a classification only sets where a goal can be set; it does not decide whether the measure is shown. Unlinking keeps the measure on the pages while projects report toward it, now with "No goal set". | goal-kpis.ts (linkedKpis); firma2-classification-rollup.ts | shown (proposed: Q-234) |
| RUL-94 | A classification and a group can each have an icon: chosen on its settings page with a picker offering a shortlist and a search over the whole icon set; none until chosen; a Remove option clears it and the colour square leads the name again (Q-235). | firma2-taxonomy-details.astro; firma2-classification-icons.ts | shown (decided: Q-235) |
| RUL-95 | Where a name leads (Outline, Browse list and detail, cards, the settings list, page headings, the peek), the icon replaces the colour square, tinted in the group's colour; a classification in the settings list shows it in the text colour. A record with no icon shows the colour square as before. | firma2-class-mark.astro; firma2-classification-roster.astro:701-725 | shown for Outline, Browse, cards and the settings list; decided for page headings and the peek, not built (decided: Q-235) |
| RUL-96 | A conversion between classification and group keeps the record's icon. | taxonomy-edits.ts (convertToGroup, convertToClassification) | decided, not built (decided: Q-235) |

## Prototype artifacts (not requirements)

| Artifact | Where | Stands in for |
|---|---|---|
| Browser-local store `firma2:taxonomy-edits:v1`: added, edited and removed groups and classifications, KPI links, targets, orders | taxonomy-edits.ts:1-120 | a saved taxonomy, per workspace, with every change attributable (enabler: save the tree) |
| `local-` slugs and the "draft" routes (`/classifications/draft?slug=`, `/groups/draft?slug=`) | taxonomy-record.ts; workspace-settings/.../draft.astro | a real page for a record created at run time (a static site cannot build one) |
| Reading pages built from seeded data only (Outline, Browse, group page, peek, classification page) | firma2-classification-tree.ts; firma2-classification-rollup.ts | reading pages that always read the saved tree (the card board alone follows some settings edits) |
| "Removed in Workspace settings." alert | firma2-classification-summary.astro:72-84 | what a removed record's page really does: the ordinary "not found" page (Q-194) |
| Reader preferences in localStorage: `firma2:classification-index:view`, `firma2:classification-roster:closed`, `firma2:goal-board:closed` | the index, roster and goal board scripts | a per-person preference, stored with the account or the device |
| Seeded targets `GOAL_TARGETS` (invented, uneven on purpose) | firma2-classifications.ts:151-185 | targets set by an administrator |
| The Security setting "Manage classifications" shown on a Security screen but checked nowhere | firma2-workspace-settings.ts:246 | role-based visibility of the edit doors and the settings |
| The dev-only real-workspace switch: in `astro dev`, a gitignored file under `docs/private/` replaces the invented groups and classifications with a tenant's own taxonomy; a build never uses it | firma2-real-data.ts:1-20; firma2-classifications.ts:63-88,231-244 | an import from ProjectFirma 1.x, which is out of scope (Q-198); nothing from it is in this inventory |
| "Edit classification" / "Edit group" shown to everyone; no screen checks a role | the two reading pages | gating (RUL-31) |

## Sample data

| What | Name or value in the prototype | Where | Useful for |
|---|---|---|---|
| A top-level group of classifications | Plan goal, holding seven goals: Salmon & steelhead recovery, Riparian & wetland habitat, Water quality, Water supply reliability, Wildfire resilience, Flood risk reduction, Public access & recreation | firma2-classifications.ts:63-65,186-204 | the goal view; targets; a flat group |
| A top-level group of groups | Practice area, holding Channels & fish passage, Vegetation & wetlands, Forests & fuels, Runoff & groundwater, each with three practices (for example Forest thinning, Fuel breaks, Prescribed fire) | firma2-classifications.ts:63-70,205-228 | a two-level tree; classifications with no measures or targets |
| Goal targets, uneven on purpose | for example Salmon & steelhead recovery: barriers removed 12 by 2030, stream miles reopened 25 by 2030; some goals ahead of what their projects planned, some behind; a few measures with no target | firma2-classifications.ts:151-185 | STA-18 to STA-21; the "not yet planned" line |
| A classification with no measures | the practices (no targets; measures only where the catalog lists them) | firma2-classifications.ts:205-228 | STA-6, STA-22 |
| A project carrying several classifications | projects tagged with more than one goal | firma2-projects.ts | the funding overlap note (STA-25); counted-once rules (RUL-18) |
| Shapes with no sample | an empty group; a group holding both groups and classifications; a third level; a classification in use being converted | none seeded; each is one add, move or conversion away in Workspace settings | STA-27, RUL-3, RUL-9, RUL-10 |

## Conflicts

| One source says | Another says | Resolution |
|---|---|---|
| spec #15: "The settings list is one tree table per top-level group… a classification's row shows projects, performance measures and targets set" | spec #24 cuts "Targets set"; the built list is grouped rows on one column grid (the Tags construction), not a table | the built list and #24 win; #15 needs its text corrected — corrected in the spec (Q-181) |
| spec #18: "A new top-level group keeps its add page, because it is asked its number of levels" | levels were withdrawn (#20); #22 and #25 say every add is a row and the header adds a top-level group in place | #22 and #25 win; #18's last sentence is stale — corrected in the spec (Q-181) |
| spec #19: "Levels limit where a row can land: a classification only into a group at the last level…" | #20: the tree is free | #20 wins; #19's levels sentence is stale — corrected in the spec (Q-181) |
| spec #22: "the page header adds … a classification in no group" | #25: a classification is always in a group; the header adds groups only | #25 wins; #22 needs its text corrected — corrected in the spec (Q-181) |
| Group page and add-page comments: "the administrator, or whoever Security › Manage classifications lets in" | no screen checks the permission; the edit doors show to everyone | the written rule is the requirement (RUL-31); the prototype is unfinished (Q-180) |
| The glossary says to avoid "KPI"; code comments in the editor and rollup call the measures KPIs | visible copy says "performance measures" throughout | visible copy wins; no requirement uses "KPI" |
| Removing a classification is refused while projects work toward it (RUL-8) | converting a group with "Remove them" removes its classifications whatever projects use them (RUL-10) | resolved: "Remove them" is offered only when nothing beneath is in use (Q-185) |

## Shown but uncommitted

| Item | Why it looks uncommitted | Release |
|---|---|---|
| Add pages for a classification and a group (SCR-10, SCR-11) | every add is now a row in place (#22); the pages remain only as the no-script path and from SCR-9 | dropped (Q-182) |
| The member lists on a group's settings page (ACN-39, ACN-40) | the settings list now does ordering and adding in place; the group page repeats it | dropped (Q-183) |
| The card board on a group's page (SCR-6 contents) | the index replaced cards with Outline and Browse (#6); the board stays as the group page's contents | first (Q-184) |
| Settings and edit doors for every reader | RUL-31 says they are for people the setting lets in | first, for people the setting lets in (Q-180) |
| The empty first-run copy "Add a group, or a classification on its own." (STA-30) | a classification cannot stand alone at the top level (#25) | first, reworded (Q-193) |
| A classification's own colour with no way to change it | it drives map and chart colour | first (Q-195) |
| Hand-set order versus A to Z as the starting order | seeded order is not alphabetical; a new item joins the end | first, as built (Q-190) |

## Out of scope for this harvest

- The public classifications page and public goals (`public-site`): it counts published projects only and shows no groups.
- The project record's classification chips, hover cards and the "Key facts" field, and the intake form's classification question (`project-record`, `project-intake`): they use this feature's vocabulary.
- The map's colour-by and the progress dashboard's dimensions that name groups (`map`, `progress-dashboard`): see Q-156.
- Defining and retiring performance measures, units and counting rules (`performance-measures`).
- The Security screen where "Manage classifications" is set (`users-and-security`).
- Importing a tenant's classifications from ProjectFirma 1.x (dev-only in the prototype): out of scope; it will be scoped per client at a future date (Q-198, answered 2026-11-24).
- Project types and tags, which share the three record-page components with this feature.
- Search or filter on the Classifications pages: not in the first release (Q-200).
- The add pages and a group's member lists (struck, Q-182, Q-183).

## Terms to define

- **Outline** and **Browse** — the two views of the Classifications page.
- **Convert** (a classification to a group, a group to a classification).
- **Top level** — where a group stands when it is inside no other group.
- **Peek** — already used by the project peek; the glossary has no entry for it.
- **Goal target** — a value and a due year on one performance measure for one classification. (The glossary defines "Performance measure" and "Classification" but not "goal target".)

## Dependencies on other features

| Needs | Owned by |
|---|---|
| Projects, their classifications, stages, funding sources and expenditures (the figures being summed) | `project-record`, `projects-index` |
| The measure catalog: names, units, decimals, counting rule, status; each project's reports toward a measure | `performance-measures` |
| The classification chips and the "Key facts" question that file a project under a classification | `project-record`, `project-intake` |
| Colour-by and group-based dimensions: every top-level group is offered as a map colouring and a dashboard dimension, splitting by whatever sits directly inside it; deeper levels are not (Q-156) | `map`, `progress-dashboard` |
| The public classifications page and what is published | `public-site`, `publish-review` |
| The Security setting "Manage classifications" and the role model | `users-and-security` |
| Funders (organizations administering a funding source) | `organizations-admin`, `project-record` |
| The docked peek, the project grid and the project peek button | `projects-index` |

## Gaps (questions for the interview)

1. ~~Who may open the settings screens and the edit doors, and what does everyone else see? — RUL-31 is written but unbuilt (Q-180).~~ Answered 2026-11-24.
2. ~~Which projects do the figures count?~~ Answered 2026-11-24 (Q-187): every project inside the app, published only on the public site. Left: a Viewer with no organization (Q-201).
3. ~~Which pages and panels are still wanted now that the list adds and moves in place (Q-182, Q-183, Q-184)?~~ Answered 2026-11-24.
4. ~~What happens when a conversion or a "Remove them" reaches classifications that projects work toward (Q-161, Q-185)?~~ Answered 2026-11-24.
5. ~~Is a structure change recorded, and can it be undone (Q-186)?~~ Answered 2026-11-24.
6. ~~Two administrators arranging the tree at once (Q-188).~~ Answered 2026-11-24.
7. ~~Limits on name, description, depth and count (Q-189).~~ Answered 2026-11-24.
8. ~~What reading pages show with nothing set up, and for a removed record (Q-193, Q-194).~~ Answered 2026-11-24.
9. ~~Where does a classification's own colour get changed (Q-195)?~~ Answered 2026-11-24.
10. ~~How do the app pages and the public site differ in what they count?~~ Answered (Q-187, RUL-33).
11. ~~What counts as "in use" — every stage, published or not (Q-196)?~~ Answered 2026-11-24.
12. ~~A measure that is retired while linked (Q-197).~~ Answered 2026-11-24.
13. ~~Moving a tenant's existing taxonomy in~~ Answered: out of scope (Q-198).
14. ~~What a person sees when a save fails (Q-199).~~ Answered 2026-11-24.
15. ~~Searching or filtering the reading pages (Q-200).~~ Answered 2026-11-24.

## Interview

| Date | Question | Answer |
|---|---|---|
| 2026-11-24 | Q-187 Which projects do the figures count? | Every project inside the app; only published projects on the public site (RUL-33). |
| 2026-11-24 | Q-198 Is moving a client's ProjectFirma 1.x taxonomy in scope? | No. Scoped per client at a future date. |
| 2026-11-24 | Q-180 Who may open the settings and see the edit doors? | Only people the "Manage classifications" setting lets in. |
| 2026-11-24 | Q-181 Four stale spec decisions | Corrected; recorded in the spec (#31). |
| 2026-11-24 | Q-182 Add pages | Struck; every add is a row in place. |
| 2026-11-24 | Q-183 Member lists on a group's settings page | Struck. |
| 2026-11-24 | Q-184 Card board on a group's page | Kept. |
| 2026-11-24 | Q-185 "Remove them" when projects use the classifications | Offered only when none is in use. Confirmed. |
| 2026-11-24 | Q-161 Converting a classification that projects use | Goes ahead after a confirm that says what will happen; the person can stop or continue. Confirmed. |
| 2026-11-24 | Q-201 A Viewer with no organization | Sees the public site's figures. Confirmed. |
| 2026-11-24 | Q-186, Q-188, Q-189, Q-191, Q-199 | Change record, last save wins, limits, no notifications, save-failure message: as proposed (RUL-34 to RUL-40). |
| 2026-11-24 | Q-152, Q-153, Q-154, Q-155, Q-156, Q-190, Q-192, Q-193, Q-194, Q-195, Q-196, Q-197, Q-200 | As proposed. |

## Open questions

IDs only; the questions live in `.scratch/open-questions.md`. The first set is answered (see Interview). The story writers raised Q-202 to Q-233, each with a proposed answer written into the stories as a requirement tagged `proposed (Q-n)`:

- Q-202, Q-203 — settings list: refused add row; nested group's description (RUL-89)
- Q-204, Q-205, Q-206 — performance measure editor: all linked; retired; target size
- Q-207, Q-208 — remove: what the confirm names; checked again at confirm
- Q-209, Q-210 — drag: folded group (RUL-91); lower half of a row (RUL-80)
- Q-211 — folds across devices
- Q-212, Q-213, Q-214 — conversion: measures with no projects (RUL-82); where it stands (RUL-83); a project left with none
- Q-215 — group to classification: the question's wording
- Q-216, Q-217, Q-218 — edit doors: navigation, other links, access withdrawn
- Q-219, Q-220, Q-221, Q-222 — figures: measure order; nothing to measure against; unit mismatch; goal year (RUL-57)
- Q-223 — a ring and the keyboard (RUL-60)
- Q-224, Q-225, Q-226 — Browse: folding the chosen row; a link and the remembered view; the address after Outline and back
- Q-227 — the peek with no measures
- Q-228, Q-229 — Projects section empty; project row order
- Q-230, Q-231, Q-232, Q-233 — published-only figures: notice; the tree; measures; Viewers with an organization (RUL-33)
