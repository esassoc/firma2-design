# 22 — Each reader sees the figures they are meant to see

Type: story
Epic: E-B Read progress against the tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-230, Q-231, Q-232
Revision: 1
Blocked by: 14, 15, 17, 18, 19, 20, 21
Covers: RUL-33, RUL-76
Sources: `/prototypes/classifications` and a classification's page (the prototype counts every project for everyone and has no published-only view); spec #28; interview 2026-11-24, Q-187, Q-201; `docs/roles-and-permissions.md`
Snapshot: not yet captured
Read with: `../epics/E-B-read-progress.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R6 (R2's Viewer-with-organization part, R3, R5 and R6 rest on the proposals Q-230, Q-231, Q-232).

## Story

As a reader, I want the figures I see to be the ones I am meant to see (every project for people who work on projects, published ones for Viewers), so that nobody quotes numbers the public has not been shown and members see the whole picture.

## Description

Inside the app, the Classifications pages count every project, published or not, for Contributors, Managers and Administrators, so a program manager sees the real portfolio. A Viewer reads published values (the roles document), so a Viewer's figures are the public site's: the same classification can read 5 projects for one reader and 2 for another. This story sets which projects count for whom, on every Classifications page. It is a rule across screens, not a screen. To see it: `/prototypes/classifications`, a classification's page and a group's page, as Ada and as Noor (F5), on "Flood risk reduction" (F6). The prototype counts every project for everyone; the published-only view is not built.

## Requirements

R1. For an Administrator, a Manager and a Contributor, every figure on the Classifications pages counts every project in the workspace that carries the classification, published or not and in whatever stage.

R2. For every Viewer, whether or not the Viewer belongs to an organization, every such figure counts only published projects, the same set the public site counts (decided, Q-233, for a Viewer who belongs to an organization; settled by Q-187 and Q-201 for one with no organization). It applies to every number and list on the Classifications pages that is worked out from projects: the Projects, Estimated cost, Spent to date and Funders figures; each performance measure's progress; the Outline's counts; the list of projects and the funders chart on a classification's and a group's page; the peek; Browse. A published project's figures are its published values. Both views are worked out with the same arithmetic, over a different set of projects.

R3. A reader whose figures are published-only sees one line under the page title on the Classifications page, a classification's page and a group's page: "Figures count published projects only." Readers whose figures count every project see no such line. (proposed, Q-230)

R4. Who is signed in decides the set. Nothing in the address, no setting on the page and no choice the reader makes changes it.

R5. A reader with published-only figures sees the same groups and classifications, in the same order, as everyone: the tree is the workspace's structure. A classification or group none of whose projects is published shows 0 where it would show a count. (proposed, Q-231)

R6. A reader with published-only figures sees the measures RUL-92 gives everyone, over the published projects: every measure a published project reports toward, linked or not, counted with the same arithmetic as everyone else. A measure no published project reported toward reads "Not reported". (proposed, Q-232)

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The public site's own classification pages and goals (they show no groups and one lead measure per goal) — owned by `public-site`.
- The edit buttons and settings pages, which Viewers never see — see story 13.
- What "published" means, who publishes and when — owned by `publish-review`.
- How an account becomes a Viewer with or without an organization — owned by `users-and-security`.

## Needs to know from elsewhere

- "Published" means a project whose values the public may see; the public site counts only those (`public-site`, `publish-review`).
- Groups are not public: the public site shows classifications and no groups (RUL-32); on the app's pages a published-only reader still sees groups (R5, proposed).
- Each page's sections and the figure arithmetic are stories 14, 15, 17, 18, 19, 20 and 21's; this story changes only which projects feed them.

## Scenarios

**S1 — An Administrator counts every project** (proves R1)
- Given Ada, signed in, opens the page of "Flood risk reduction" (F6)
- When she reads the Projects figure
- Then it reads 5

**S2 — A Contributor and a Manager** (proves R1)
- Given Cam (Contributor) and Max (Manager) open the same page (F5)
- When each reads the Projects figure
- Then each reads 5

**S3 — A Viewer with no organization** (proves R2)
- Given Noor (F5) opens the same page
- When she reads the Projects figure
- Then it reads 2, the public site's count (F6)

**S4 — A Viewer with an organization** (proves R2)
- Given Vera (Viewer, one organization) opens the same page
- When she reads the Projects figure
- Then it reads 2

**S5 — Both on the Outline** (proves R1, R2)
- Given Ada and Noor each open the Outline of F1
- When each reads the Projects count of "Flood risk reduction" and of "Public access & recreation"
- Then Ada reads 5 and 1, Noor reads 2 and 1

**S6 — Every figure follows** (proves R2)
- Given Noor is on the page of "Flood risk reduction"
- When she reads Estimated cost, Spent to date, Funders and the measures
- Then each is worked out over the 2 published projects (F9: the published-only figures to be computed)

**S7 — The projects and the funders** (proves R2)
- Given Noor is on the page of "Flood risk reduction"
- When she reads the "Projects" section and the "Funders" chart
- Then the grid lists 2 projects, "2 projects" is under it, and the bars are the funders of those 2 projects only

**S8 — The peek, Browse and a group's page** (proves R2)
- Given Noor opens the peek of "Flood risk reduction", then Browse on "Plan goal", then the page of "Plan goal"
- When she reads the project counts
- Then the peek shows 2 Projects, Browse lists "Flood risk reduction" with 2 projects, and the group page counts only published projects (F9: published count for Plan goal)

**S9 — The notice** (proves R3)
- Given Noor and Ada open the same classification's page
- When each reads under the title
- Then Noor sees "Figures count published projects only." and Ada sees no such line

**S10 — The reader cannot change it** (proves R4)
- Given Noor is on the page of "Flood risk reduction"
- When she reloads it, opens it by its address in a new window, and looks for any control that widens the figures
- Then it still reads 2, with the notice, and no such control exists

**S11 — The same tree** (proves R5)
- Given a classification with no published project (F9) and Noor on the Outline
- When she reads its row and its group's row
- Then both rows are there, in the same order as Ada's, with 0 Projects on the classification

**S12 — Measures** (proves R6)
- Given Noor is on the page of "Salmon & steelhead recovery", which tracks four measures (F2)
- When she reads "Performance measures"
- Then every measure the 9 published projects report toward is listed, linked or not, each counted over those projects (F6), and a measure no published project reported reads "Not reported"

## UAT script

Preconditions: Ada, Cam, Max, Vera and Noor (F5) can each sign in.
Test data: F5, F6 (Flood risk reduction 5 against 2; Public access & recreation 1 and 1), F9 (published-only figures).
Reset: none needed.

| # | Do this | You should see |
|---|---|---|
| 1 | Sign in as Ada. Open Classifications and read "Flood risk reduction" and "Public access & recreation". | Projects 5 and 1. |
| 2 | Open the page of "Flood risk reduction". Note Projects, Estimated cost, Spent to date and Funders. | Projects 5. No line about published projects. |
| 3 | Scroll to "Projects" and "Funders". Note the count and the number of bars. | 5 projects; as many bars as Funders. |
| 4 | Sign in as Cam, then as Max; repeat steps 1 and 2. | The same figures as Ada's. |
| 5 | Sign in as Noor. Open Classifications and read the same two rows. | Projects 2 and 1. |
| 6 | Open the page of "Flood risk reduction". | Under the title: "Figures count published projects only." Projects 2; the other figures equal to or smaller than Ada's. |
| 7 | Scroll to "Projects" and "Funders". | 2 projects; bars for their funders only. |
| 8 | Open the peek on that classification, then switch to Browse. | 2 Projects in the peek; 2 in Browse. |
| 9 | Open the page of "Plan goal". | The notice; a Projects figure below Ada's (F9). |
| 10 | Sign in as Vera; repeat steps 5 and 6. | The same as Noor's. |
| 11 | As Noor, find the classification with no published project. | Its row is there with 0 Projects. |

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-230 (proposed) — Does the page tell a reader whose figures are published-only that they are?
- Q-231 (proposed) — What does a reader with published-only figures see of the tree?
- Q-232 (proposed) — Which performance measures does a reader with published-only figures see, and how are they counted?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided | RUL-33 |
| R2 | decided; decided (user, 2026-11-24, Q-233) | RUL-33; RUL-76 |
| R3 | proposed (Q-230) | RUL-33 |
| R4 | decided | RUL-33 |
| R5 | proposed (Q-231) | RUL-33; RUL-32 |
| R6 | proposed (Q-232); decided (user, 2026-11-24, Q-234) | RUL-33; relies on story 14, RUL-92 |

- Prototype files: none for the split on these pages: every Classifications page uses all projects (`src/data/firma2-classification-rollup.ts`, `firma2-classification-tree.ts`). The public set is `src/data/firma2-public-site.ts` (`publicProjects`, `publicGoals`, `progressOver` over the published projects).
- Data shapes: a project carries a published flag and a set of published values; the public set is the published projects.
- Do not copy: the prototype's "everyone sees all projects"; the public goals' separate seeded list (`publicProjects`) stands in for publication.

</details>
