# Epic E-A — Set up and arrange the classification tree

Feature: classifications
Release: first
Status: needs-triage

## Goal

An administrator builds and keeps the tree that projects are filed under: groups and classifications, how they are arranged, which performance measures track each classification and what the goal is for each. Everything a reader sees on the Classifications pages starts here. Done in Workspace settings, in place, with nothing moving until the administrator has seen what will become part of what.

## Actors

- Administrator, or anyone the "Manage classifications" setting lets in: sets up, arranges, converts and removes groups and classifications; links measures and sets goals.
- Every other reader gets nothing from this epic except, through story 13, not being shown the controls.

## Decisions that shape every story

| Source | Decision |
|---|---|
| spec #1, #5, #20 | Groups nest to any depth and move anywhere (never inside themselves); a group may hold groups and classifications together; projects are filed on classifications only. No levels, no depth rule. |
| spec #25 | A classification is always in a group; moved out of every group it becomes a group at the top level. The top level holds groups only. |
| spec #18, #22, #31 | Every add is a row in place that takes only a name; the page header adds a top-level group; the list is grouped rows on one column grid. |
| spec #21, #29 | Converting asks first and names the cost; "Remove them" is offered only when nothing beneath is in use. |
| spec #26, #27 | A drag shows what will join what before anything moves; "Sort A to Z" orders one list on demand and nothing sorts by itself. |
| interview 2026-11-24 | Q-180 gating by "Manage classifications"; Q-182, Q-183 no add pages and no member lists on a group's page; Q-195 a Color control on a classification. |
| standing requirements | SR-4 to SR-10: keyboard way to every move, who may act, change log, failed saves, concurrency, limits, no notifications. |

## Out of scope

- Reading the tree and its progress — epic E-B.
- Defining or retiring a performance measure — `performance-measures` feature.
- Importing a client's ProjectFirma 1.x taxonomy — out of scope, scoped per client later (Q-198).
- Add pages for a classification or a group; member lists on a group's settings page — struck (Q-182, Q-183).

## Stories, by dependency

| # | Story | Type | Release | Blocked by |
|---|---|---|---|---|
| 01 | The workspace's classification tree is saved, and every Classifications page reads what is saved (belongs to no epic; unblocks every story here and in E-B) | enabler | first | none |
| 02 | Administrator adds a group and a classification in place and sees them listed | story | first | 01 |
| 03 | Administrator edits a classification's name, description, group and colour | story | first | 02 |
| 04 | Administrator edits a group's name, description, parent group and colour | story | first | 02, 03 |
| 05 | Administrator links performance measures to a classification and sets a goal target for each | story | first | 03 |
| 06 | Administrator removes a classification or a group that nothing depends on | story | first | 02 |
| 07 | Administrator puts rows in order: moves them up, down, to the top or bottom, or sorts A to Z | story | first | 02 |
| 10 | Administrator folds groups to see less at once | story | first | 02 |
| 08 | Administrator moves a row into another group, or a group to the top level, from its menu | story | first | 02, 10 |
| 09 | Administrator drags rows and sees what will become part of what before letting go | story | first | 07, 08, 10 |
| 12 | Administrator turns a group into a classification, keeping or removing what it held | story | first | 08, 11 |
| 11 | Administrator turns a classification into a group, after being told what will happen | story | first | 05, 08, 09 |
| 13 | Only people the "Manage classifications" setting lets in see the edit buttons and can open the settings | story | first | 03, 04 |

## Depends on other features

- `performance-measures`: the catalog a classification links to (story 05).
- `project-record`, `project-intake`: what "in use" counts (stories 06, 11, 12).
- `users-and-security`: the Security setting "Manage classifications" (story 13).
- `updates-feed` (to confirm): where the change log is shown (SR-6).

## Open questions

None. Every question is answered (see `../../open-questions.md`, Answered).
