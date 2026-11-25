# Story map — classifications

Approved: 2026-11-24
Epics: 2 — more than 8 stories and two actor journeys (an administrator setting the tree up; readers reading progress against it)

Written 2026-11-24 from `inventory.md` (every question answered; no story is `needs-info`).

## Epics

| Epic | What it delivers | Why it is its own epic |
|---|---|---|
| E-A Set up and arrange the classification tree | An administrator builds the tree in Settings: adds, describes, links performance measures and targets, arranges, converts and removes groups and classifications. | One actor journey; ships and is demonstrated from Workspace settings alone. |
| E-B Read progress against the tree | A reader sees how far along each goal is, across the whole tree (Outline), one branch at a time (Browse), and on a classification's and a group's own page. | A different actor journey, on different pages; could ship once the tree exists. |

## Goals

| Actor | Goal |
|---|---|
| Administrator, or anyone the "Manage classifications" setting lets in | Say what projects are filed under: build the tree of groups and classifications and keep it tidy. |
| Same | Make progress measurable: link performance measures to a classification and set the goal for each. |
| Same | Reach the right settings page from the page being read, and only if allowed. |
| Reader (any signed-in role) | Tell how far along every goal is, without opening each one. |
| Reader | Read one branch or one classification in full: its measures, its projects, who funds it. |
| Viewer with no organization | See the same figures the public sees. |

## Backbone

Set up the tree: add a group → add classifications → name and describe → arrange (reorder, move, drag, sort, fold) → convert one kind into the other → remove what is no longer used
Measure it: open a classification → link a performance measure → set its goal and year
Read the tree: open Classifications → scan the Outline → open a classification's measures → read a ring → switch to Browse → peek → open a page
Read one record: open its page → read the summary and measures → see its projects → see its funders
Edit from reading: open a record's page → follow the edit door (if allowed) → land on its settings page

## Stories, in build order

| # | Story (actor + outcome) | Type | Epic | Step(s) | Release | Blocked by | Unblocks (enablers) | Covers |
|---|---|---|---|---|---|---|---|---|
| 01 | The workspace's classification tree is saved, and every Classifications page reads what is saved | enabler |  | persistence | first | none | 02 | artifacts: browser store, draft routes, reading pages built from seeded data, seeded targets |
| 02 | Administrator adds a group and a classification in place and sees them on the settings list (walking skeleton) | story | E-A | add a group; add classifications | first | 01 |  | OBJ-1, OBJ-2, SCR-7, STA-30, STA-31, STA-32, ACN-18, ACN-20, ACN-21, ACN-29, RUL-1, RUL-4, RUL-5, RUL-11, RUL-27, RUL-51, RUL-88, RUL-89 |
| 03 | Administrator edits a classification's name, description, group and colour | story | E-A | name and describe | first | 02 |  | SCR-8, STA-42, ACN-30, ACN-31, ACN-32, ACN-43, RUL-43, RUL-44, RUL-46, RUL-47, RUL-48, RUL-49, RUL-94 |
| 04 | Administrator edits a group's name, description, parent group and colour | story | E-A | name and describe | first | 02, 03 |  | SCR-9, STA-46, ACN-33, ACN-34, RUL-42, ACN-44, ACN-45, RUL-45 |
| 05 | Administrator links performance measures to a classification and sets a goal target for each | story | E-A | link a measure; set its goal | first | 03 |  | OBJ-3, OBJ-4, STA-38, STA-39, ACN-35, ACN-36, ACN-37, RUL-20, RUL-21, RUL-22, RUL-39, RUL-52, RUL-93 |
| 06 | Administrator removes a classification or a group that nothing depends on | story | E-A | remove | first | 02 |  | SCR-14, STA-36, STA-37, STA-40, STA-41, ACN-38, RUL-8, RUL-38, RUL-53 |
| 07 | Administrator puts rows in order: moves them up, down, to the top or bottom, or sorts A to Z | story | E-A | arrange | first | 02 |  | OBJ-5, STA-35, ACN-19, ACN-22, ACN-27, RUL-7 |
| 08 | Administrator moves a row into another group, or a group to the top level, from its menu | story | E-A | arrange | first | 02, 10 |  | ACN-42, RUL-3, RUL-13, RUL-29, RUL-50, RUL-90 |
| 09 | Administrator drags rows and sees what will become part of what before letting go | story | E-A | arrange | first | 07, 08, 10 |  | STA-33, ACN-26, RUL-12, RUL-79, RUL-80, RUL-81, RUL-91 |
| 10 | Administrator folds groups to see less at once, and the folds are remembered | story | E-A | arrange | first | 02 |  | OBJ-7, STA-29, ACN-28, RUL-28 |
| 11 | Administrator turns a classification into a group, after being told what will happen | story | E-A | convert | first | 05, 08, 09 |  | SCR-12, STA-34, STA-44, ACN-24, RUL-2, RUL-9, RUL-82, RUL-83, RUL-84, RUL-86, RUL-96 |
| 12 | Administrator turns a group into a classification, keeping or removing what it held | story | E-A | convert | first | 08, 11 |  | SCR-13, STA-45, ACN-23, ACN-25, RUL-10, RUL-41, RUL-85 |
| 13 | Only people the "Manage classifications" setting lets in see the edit buttons and can open the settings | story | E-A | edit from reading | first | 03, 04 |  | ACN-15, ACN-16, RUL-30, RUL-31 |
| 14 | Reader sees how far along a classification is on its own page (reading skeleton) | story | E-B | open a classification; read its measures | first | 05 |  | OBJ-6, SCR-5, STA-18, STA-19, STA-20, STA-21, STA-22, STA-47, RUL-14, RUL-15, RUL-16, RUL-17, RUL-54, RUL-55, RUL-56, RUL-57, RUL-92 |
| 15 | Reader scans the whole tree in Outline and opens a classification's measures | story | E-B | open Classifications; scan; open measures | first | 14 |  | SCR-1, SCR-2, STA-1, STA-3, STA-4, STA-5, STA-6, STA-7, STA-9, ACN-2, ACN-3, ACN-4, RUL-6, RUL-23, RUL-25, RUL-58, RUL-59, RUL-95 |
| 16 | Reader reads a ring's measure name and figure by hovering it | story | E-B | read a ring | first | 15 |  | STA-8, ACN-6, RUL-26, RUL-60 |
| 17 | Reader switches to Browse and reads one group or classification in full | story | E-B | switch view; browse a branch | first | 15 |  | SCR-3, STA-2, STA-10, STA-11, STA-12, STA-13, STA-14, ACN-1, ACN-7, ACN-8, ACN-9, RUL-24, RUL-61, RUL-62, RUL-63 |
| 18 | Reader peeks at a classification from its row without leaving the list | story | E-B | peek | first | 15, 17 |  | SCR-4, STA-16, STA-17, ACN-5, ACN-10, RUL-64, RUL-65, RUL-87 |
| 19 | Reader sees which projects make up a classification's figures, in Simple and in Detailed | story | E-B | see its projects | first | 14 |  | STA-23, ACN-11, ACN-12, ACN-13, STA-48, RUL-66, RUL-67, RUL-68 |
| 20 | Reader sees who funds a classification's projects | story | E-B | see its funders | first | 14 |  | STA-24, STA-25, ACN-14, RUL-19, RUL-69, RUL-70, RUL-71 |
| 21 | Reader reads a group's progress on its own page, with what it holds | story | E-B | open a group | first | 14, 19, 20 |  | SCR-6, STA-27, STA-28, ACN-17, RUL-18, RUL-72, RUL-73, RUL-74, RUL-75 |
| 22 | Each reader sees the figures they are meant to: every project inside the app, the public's figures for a Viewer with no organization | story | E-B | read figures | first | 14, 15, 17, 18, 19, 20, 21 |  | RUL-33, RUL-76 |
| 23 | Reader sees a sensible page when nothing is set up, and when a record has been removed | story | E-B | open Classifications; open a removed record | first | 15, 17, 06 |  | STA-15, STA-26, RUL-77, RUL-78 |

## Open questions by story

The questions in the first outline are all answered (Q-161, Q-185, Q-187, Q-198 and Q-201 in the user's words; the rest accepted as proposed). The story writers raised thirty-two more (Q-202 to Q-233), each with a proposed answer written in as a requirement tagged `proposed (Q-n)`; every story that touches one carries the line "Built on proposals awaiting validation". By story: 02 Q-202, Q-203 · 05 Q-204, Q-205, Q-206 · 06 Q-207, Q-208 · 09 Q-209, Q-210 · 10 Q-211 · 11 Q-212, Q-213, Q-214 · 12 Q-213, Q-215 · 13 Q-216, Q-217, Q-218 · 14 Q-219, Q-220, Q-221, Q-222 · 15 Q-219 · 16 Q-223 · 17 Q-224, Q-225, Q-226 · 18 Q-227 · 19 Q-228, Q-229 · 21 Q-228 · 22 Q-230, Q-231, Q-232, Q-233 (also 14 to 21).

Two things remain unspecified by any source and go into `standing-requirements.md` as questions, not stories: Two things remain unspecified by any source and go into `standing-requirements.md` as questions, not stories: an accessibility standard for these pages (the product-wide Q-83), and the exact copy for the permission-denied page in story 13.

## Covered by standing requirements

- ACT-1, ACT-2, ACT-3 (the goals table).
- RUL-34 every structure change is recorded in the change log; RUL-35 two people at once, last save wins; RUL-36 name and description limits; RUL-37 no notifications; RUL-40 a failed save returns the row and says so.
- Phone layout (the settings list and Outline at narrow widths), keyboard operation (the grip menu is the keyboard way to move a row), and the pattern for hiding what a person may not use (the rule itself is story 13) are written once there.

## Dependencies on other features

| Needs | Owned by | Used by stories |
|---|---|---|
| Projects, their classifications, funding sources, expenditures, stages | `project-record`, `projects-index` | 14, 15, 19, 20, 21 |
| The measure catalog: names, units, decimals, counting rule, status; each project's reports toward a measure | `performance-measures` | 05, 14, 15 |
| The classification chips and the question that file a project under a classification | `project-record`, `project-intake` | 06, 11, 12 (what "in use" counts) |
| Docked peek, project grid, project peek button | `projects-index` | 18, 19 |
| Funders (organizations administering a funding source) | `organizations-admin`, `project-record` | 15, 20, 21 |
| The Security setting "Manage classifications" and the role model | `users-and-security` | 13 |
| Published-only figures and the public classifications page; groups are not public (RUL-32) | `public-site`, `publish-review` | 22 |
| Group-based map colouring and dashboard dimensions (every top-level group is offered; Q-156) | `map`, `progress-dashboard` | none: their own stories |
| The change log that records structure changes | `updates-feed` (to confirm) | standing requirement |

## Out of scope

| Item | Why |
|---|---|
| ACT-4 (visitor), RUL-32 | owned by `public-site` |
| SCR-10, SCR-11, ACN-39, ACN-40, ACN-41, STA-43 | struck in the interview (Q-182, Q-183): adds are rows in place and a group's settings page has no member lists |
| Search or filter on the Classifications pages | not in the first release (Q-200) |
| Importing a client's ProjectFirma 1.x taxonomy; the dev-only real-workspace switch | out of scope; scoped per client later (Q-198) |
| `bcn-goal-meter`, `goal-meter.ts` | not used by any route |

## Cuts I was least sure of

- **02 holds both the list and the add rows** (about 11 scenarios). The list cannot be seen without something to list, so they stayed one story; if it runs long, the first-run state and the name rules are the part to split off.
- **14 holds the figure arithmetic and the Simple view together** (about 11 scenarios). The alternative is one story for "a measure with a goal" and one for "no goal, not reported, fully planned, not summable"; they cannot be told apart on screen until the second exists.
- **08 and 09 are separate, and 09 comes after 07 and 08.** The menu moves and the drag moves reach the same result by two means. If you would rather have one "move a row" story that ships both, it will be about 14 scenarios.
- **11 depends on the drag story (09)** because dropping a classification on the top-level row is one way to convert it. The menu path alone would need only 08; say if the drag path should be its own later story.
- **15, 16, 17 and 18 split the Classifications page by what the reader does** (scan, read a ring, switch view, peek). The page cannot be tested as one story without the toggle, so the toggle arrives with Browse (17).
- **22 is a story about a rule, not a screen.** It is how Q-187 and Q-201 become testable; the alternative is to fold it into 14 and 15 as one scenario each.
- **23 joins two unrelated states** (nothing set up; a record removed). They are both "a page with nothing real to show"; the alternative is two stories of one scenario each.
- **Folding groups (10) is its own story** though it is small, because it differs in what it stores (a per-reader preference).

## Orphans

None. Every in-scope inventory item is under one story, under standing requirements, under dependencies, or under out of scope; items split on 2026-11-24 to make that true: STA-32, STA-42, STA-23, STA-22, ACN-27, ACN-30, ACN-31, RUL-2, RUL-5, RUL-29 (new: STA-44 to STA-48, ACN-42 to ACN-45, RUL-41 to RUL-89, the last forty-six added from the writers' reports).
