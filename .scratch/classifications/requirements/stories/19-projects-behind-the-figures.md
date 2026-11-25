# 19 — Reader sees which projects make up a classification's figures

Type: story
Epic: E-B Read progress against the tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-228, Q-229
Revision: 1
Blocked by: 14
Covers: STA-23, ACN-11, ACN-12, ACN-13, STA-48, RUL-66, RUL-67, RUL-68
Sources: `/prototypes/classifications`, a classification's page (Detailed, and the Projects section); spec #3
Snapshot: not yet captured
Read with: `../epics/E-B-read-progress.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R9. R3's order and R9's wording rest on the proposals Q-229 and Q-228.

## Story

As a reader, I want to see which projects a performance measure's figure is made of, year by year, and every project filed under the classification, so that I can trace a number to the work behind it before I quote it.

## Description

A classification's page (story 14) opens on Simple: one tile per performance measure. This story is the way down from a tile to the projects. Detailed switches the tiles for a table with a row per measure, a row per project beneath it and a column per year; the Projects section lower on the page lists every project filed under the classification, in the same grid the Projects index uses. To see it: `/prototypes/classifications`, open the name "Salmon & steelhead recovery" (F1.1), press "Detailed" above the measures, then scroll to "Projects".

## Requirements

R1. Above the performance measures, a toggle with the choices "Simple" and "Detailed" (named "Performance measures view" to assistive technology) switches between the tiles and the table. The page always opens on Simple; the choice is not remembered. Choosing Detailed opens every measure's project rows, including any the reader had folded earlier in the same visit. The toggle is hidden only when no project reports any measure and none is linked (STA-48; proposed, Q-234).

R2. Detailed is one table with the hidden caption "Performance measures, by project and year" and the column heads "Measure" and "Progress", then one column per year, newest first. The years are the years in which any project reported toward any measure of the classification, the same columns under every measure. Each measure the projects report toward has a parent row, linked to the classification or not, linked ones first (relies on story 14, RUL-92; proposed, Q-234). A measure nobody linked has no goal and no "Not yet planned" row, and reads against what its projects planned with "No goal set". Each parent row has: its ring, its name, its figure as story 14 words it ("14.5 of 30 miles goal") and, in each year's column, the measure's own figure for that year: the sum across its projects, or the average for a measure that does not add (RUL-15, story 14).

R3. Under a measure's parent row, one row per project that reported toward that measure. Each shows the project's name as a link to the project, a side-panel button named "Preview <project name>", its share as "<reported> of <planned> planned" (only the reported figure when the project planned nothing), and its own figure in each year's column. A year cell reads "—" when the project filed nothing for a year inside its span, and is empty when the year is outside it or is on the page only because another measure reported in it. The project rows are ordered by the amount reported, largest first, equal amounts by project name A to Z (proposed, Q-229).

R4. A project filed under the classification that reported nothing toward a measure is not listed under that measure. It is in the Projects section (R8), and its absence under the measure is the finding (relies on story 14, RUL-14).

R5. The last row under a measure is "Not yet planned": the part of the goal no project has planned, with its unit ("14.8 miles"). It shows only while the goal exceeds what projects planned. A measure with no goal has no such row, nor one planned to its goal or beyond (relies on story 14, RUL-17).

R6. Each measure's chevron is named "Hide projects for <measure name>" while its project rows (and its "Not yet planned" row) are showing and "Show projects for <measure name>" while folded, and states whether it is expanded. Pressing it folds or opens that measure's rows only.

R7. A project's name goes to that project's page. Its side-panel button opens the project peek beside the page and leaves the table as it was (the peek is `projects-index`'s).

R8. The page ends in a section headed "Projects" (above "Funders", story 20) that lists every project filed under the classification, whether or not it reported toward a measure, in the Projects index's grid: columns Project, Project type, Classifications, Lead organization, County, Stage, Timeline and Estimated cost, with that grid's search "Search projects", its Stage filter and its CSV download, and a count under it ("<N> projects"). The number of projects listed equals the Projects figure at the top of the page. The section is the same in Simple and in Detailed.

R9. A classification no project carries: the "Projects" heading shows. Beneath it, in place of an empty grid, the section says "No projects yet." (proposed, Q-228).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The tiles of Simple, the figure arithmetic and the "not yet planned" rule on the tile — see story 14.
- The funders section — see story 20.
- A group's page, which uses the same table with no goals — see story 21.
- The grid's own behaviors (search matching, the filters, CSV, sorting) and the project peek — owned by `projects-index`.
- Which projects count for a Viewer with no organization — see story 22.

## Needs to know from elsewhere

- Which projects are listed and counted for a given reader (all projects, or published ones only for a Viewer with no organization) is story 22's rule; the table and the section follow it.
- A project counts toward a measure only if it carries the classification and reports toward the measure; a measure that adds is summed, one that does not is averaged (story 14, RUL-14, RUL-15).
- The Projects grid is the same grid as the Projects index, handed this classification's projects (`projects-index`); it needs the side-panel project peek on the page.
- A project's periods (the years it filed figures in) come from its own record (`project-record`, `performance-measures`).

## Scenarios

**S1 — Opens on Simple, switches to Detailed** (proves R1)
- Given Ada opens the page of "Salmon & steelhead recovery"
- When she presses "Detailed"
- Then the tiles give way to a table, and after reloading the page it opens on "Simple" again

**S2 — Detailed re-opens every measure** (proves R1)
- Given Detailed is chosen and Ada has folded the first measure
- When she presses "Simple" and then "Detailed"
- Then every measure shows its project rows again

**S3 — Table structure** (proves R2)
- Given Detailed is chosen on "Salmon & steelhead recovery", which tracks four measures (F2)
- When Ada reads the head row
- Then the heads are "Measure", "Progress", then year columns, newest year first, and each measure's parent row (linked or not; one that nobody linked reads "No goal set" and has no "Not yet planned" row) has ring, name, a figure such as "14.5 of 30 miles goal" (F3.1) and a figure in each year in which any of its projects reported

**S4 — A measure that does not add** (proves R2)
- Given Detailed is chosen on "Riparian & wetland habitat", whose "Plant survival rate" is a percentage that does not add (F3.5)
- When Ada reads that measure's year cells
- Then each is the average of what the projects reporting that year filed, not their sum

**S5 — Project rows and shares** (proves R3)
- Given Detailed is chosen on "Salmon & steelhead recovery"
- When Ada reads the rows under "Stream miles of instream habitat improved" (F3.1)
- Then each row is a project name with a side-panel button, a share such as "<N> of <M> planned", and its own figures by year, with the project that reported most first; a project that planned nothing shows only its reported figure

**S6 — Blank and dash cells** (proves R3)
- Given a project, among the rows of F3.1, whose span covers a year in which it filed nothing toward that measure (F9: a project with a year inside its span in which nothing was filed)
- When Ada reads that year's cell
- Then it shows "—"; and a year outside the project's span, which is on the page because another measure reported in it, shows an empty cell

**S7 — A project that reported nothing is not under the measure** (proves R4)
- Given "Salmon & steelhead recovery" has 11 projects (F4)
- When Ada counts the project rows under "Fish passage barriers removed" (F3.2) and then the rows of the "Projects" section
- Then fewer than 11 are listed under the measure, and every one of the 11 is in the section

**S8 — Not yet planned** (proves R5)
- Given Detailed is chosen on "Salmon & steelhead recovery"
- When Ada reads the last row under "Stream miles of instream habitat improved" (F3.1, goal 30 miles) and then looks under "Acres of riparian habitat restored" on "Water quality" (F3.6, no goal)
- Then the first ends with a "Not yet planned" row giving the goal minus what is planned, in miles; the second has none

**S9 — Folding one measure** (proves R6)
- Given Detailed is chosen on "Salmon & steelhead recovery"
- When Ada presses the chevron named "Hide projects for Stream miles of instream habitat improved"
- Then that measure's project rows and gap row are hidden, the others are unchanged, and the chevron is now named "Show projects for Stream miles of instream habitat improved" and reports collapsed

**S10 — Doors in a project row** (proves R7)
- Given Detailed is chosen
- When Ada presses a project's name, and later, from the page, "Preview <that project>"
- Then the name opens the project's page, and the button opens the project peek beside the table without changing it

**S11 — The Projects section** (proves R8)
- Given Ada is on the page of "Salmon & steelhead recovery"
- When she scrolls to "Projects"
- Then 11 projects are listed with the eight columns, "11 projects" is under the grid, and the figure at the top reads 11 Projects (F4)

**S12 — The same in Detailed** (proves R8)
- Given Detailed is chosen
- When Ada scrolls to "Projects"
- Then the same 11 projects are listed

**S13 — Nothing carries it** (proves R9)
- Given a classification added by story 02 that no project carries (F7)
- When Ada opens its page
- Then the "Projects" heading shows with "No projects yet." beneath it and no grid

## UAT script

Preconditions: Ada (F5) is signed in; the tree is F1.
Test data: F1.1, F2, F3.1, F3.2, F3.6, F4 (Salmon & steelhead recovery, Water quality).
Reset: remove the classification added in step 11 with story 06.

| # | Do this | You should see |
|---|---|---|
| 1 | Open Classifications, then the name "Salmon & steelhead recovery". | Its page, with the measures as tiles and "Simple" chosen. |
| 2 | Press "Detailed". | A table: "Measure", "Progress", then year columns, newest first; one parent row per measure. |
| 3 | Read the row for "Stream miles of instream habitat improved". | "14.5 of 30 miles goal" with project rows beneath and a last row "Not yet planned". |
| 4 | Press the chevron on that measure. | Its project rows and "Not yet planned" row hide; the other measures keep theirs. |
| 5 | Press "Simple", then "Detailed". | Every measure's rows are showing again. |
| 6 | Press a project's name in a row. | That project's page opens. Go back. |
| 7 | Press "Preview <project name>" on a row. | The project peek opens beside the table. Close it. |
| 8 | Reload the page. | It opens on "Simple". |
| 9 | Scroll to "Projects". | A grid of 11 projects, with "11 projects" under it. |
| 10 | Type part of a project's name into "Search projects". | The grid narrows; the count follows. |
| 11 | Go to Settings and add a classification (story 02), then open its page from Classifications. | Its "Projects" heading shows, with "No projects yet." beneath it. |
| 12 | Open "Water quality" and press "Detailed". | The measure "Acres of riparian habitat restored" shows "11.1 of 18 acres planned" and has no "Not yet planned" row. |

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-228 (proposed) — What does the Projects section say when no project carries the classification (or a group has none beneath)?
- Q-229 (proposed) — In what order are the project rows under a performance measure?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; decided (user, 2026-11-24, Q-234) | ACN-11; RUL-66; STA-48 |
| R2 | shown; decided (user, 2026-11-24, Q-234) | STA-23; relies on story 14, RUL-15; relies on story 14, RUL-92 |
| R3 | shown; proposed (Q-229) | STA-23; RUL-67; ACN-13 |
| R4 | decided | relies on story 14, RUL-14 |
| R5 | decided | relies on story 14, RUL-17 |
| R6 | shown | ACN-12 |
| R7 | shown | ACN-13 |
| R8 | shown | STA-23; RUL-68 |
| R9 | proposed (Q-228) | STA-23 |

- Prototype files: `src/components/classifications/firma2-classification-measures.astro` (Simple tiles, Detailed table, chevrons), `src/lib/kpi-row.ts` (`kpiRowView`, `yearAxis`: shares, year cells, gap), `src/lib/goal-kpis.ts` (`renderKpiTable`), `src/components/classifications/firma2-classification-projects.astro`, `src/components/projects/firma2-project-grid.astro`, `firma2-project-peek-button.astro`, `src/data/firma2-classification-rollup.ts` (`kpiFigureTable`, contributions).
- Data shapes: per measure, a figure (reported, planned, additive or not) and `from`: the projects that reported, each with reported, planned and a series of closed periods (year, value or none).
- Do not copy: the table is repainted in the browser from the saved edits over figures the build computed (a static-site device); the built product reads the saved tree and the current records.

</details>
