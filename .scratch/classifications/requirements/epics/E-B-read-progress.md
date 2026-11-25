# Epic E-B — Read progress against the tree

Feature: classifications
Release: first
Status: needs-triage

## Goal

A reader tells how far along every goal is without opening each one, then reads one branch or one classification in full: its performance measures, the projects behind them, and who funds them. The Classifications page offers the whole tree as an Outline and one branch at a time as Browse; a classification and a group each have their own page.

## Actors

- Reader (Administrator, Contributor, Viewer): scans, drills in, peeks, opens a page.
- Viewer with no organization: reads the same pages with the public site's figures (story 22).

## Decisions that shape every story

| Source | Decision |
|---|---|
| spec #3, #4, #5 | A group has its own page and adds up everything beneath it, each project once; it has no targets, so its measures read against what projects planned. |
| spec #6, #7, #8 | Two views, Outline (default) and Browse, remembered per reader; every Outline column means one thing on every row; Browse lists every level. |
| spec #9, #10 | A classification's swatch in any list is its group's colour; the peek's group badge is a tint of that colour. |
| spec #28; interview 2026-11-24, Q-187, Q-201 | Inside the app every project is counted; the public site counts only published projects; a Viewer with no organization sees the public figures. |
| inventory RUL-14 to RUL-19 | How progress is counted: a project counts toward a measure only if it carries the classification and reports toward the measure; measures that add are summed, the rest averaged; the share of the goal never shows 100% before it is reached; funding is whole-project dollars. |
| standing requirements | SR-2 to SR-4, SR-11, SR-12: the workspace's word for "Classifications", phone and touch, nothing reachable by hover alone, keyboard and announcements. |

## Out of scope

- Setting up the tree, measures and goals — epic E-A.
- Search or filter on the Classifications pages — not in the first release (Q-200).
- The public site's classification pages and public goals — `public-site`.
- The project record's classification chips and the map and dashboard splits by group — `project-record`, `map`, `progress-dashboard`.

## Stories, by dependency

| # | Story | Type | Release | Blocked by |
|---|---|---|---|---|
| 14 | Reader sees how far along a classification is on its own page | story | first | 05 |
| 15 | Reader scans the whole tree in Outline and opens a classification's measures | story | first | 14 |
| 19 | Reader sees which projects make up a classification's figures, in Simple and in Detailed | story | first | 14 |
| 20 | Reader sees who funds a classification's projects | story | first | 14 |
| 16 | Reader reads a ring's measure name and figure by hovering it | story | first | 15 |
| 17 | Reader switches to Browse and reads one group or classification in full | story | first | 15 |
| 18 | Reader peeks at a classification from its row without leaving the list | story | first | 15, 17 |
| 21 | Reader reads a group's progress on its own page, with what it holds | story | first | 14, 19, 20 |
| 22 | Each reader sees the figures they are meant to: every project inside the app, the published projects' figures for a Viewer | story | first | 14, 15, 17, 18, 19, 20, 21 |
| 23 | Reader sees a sensible page when nothing is set up, and when a record has been removed | story | first | 15, 17, 06 |

## Depends on other features

- `project-record`, `projects-index`: projects, their funding and expenditures; the docked peek, the project grid and the project peek button.
- `performance-measures`: the catalog, units, counting rules, and each project's reports toward a measure.
- `public-site`, `publish-review`: published-only figures (story 22).
- `organizations-admin`: funders.

## Open questions

None. Every question is answered (see `../../open-questions.md`, Answered).
