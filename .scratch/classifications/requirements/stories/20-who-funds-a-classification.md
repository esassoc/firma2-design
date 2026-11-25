# 20 — Reader sees who funds a classification's projects

Type: story
Epic: E-B Read progress against the tree
Release: first
Status: needs-triage
Revision: 1
Blocked by: 14
Covers: STA-24, STA-25, ACN-14, RUL-19, RUL-69, RUL-70, RUL-71
Sources: `/prototypes/classifications`, a classification's page, section "Funders"; spec none (code comments in the funding section)
Snapshot: not yet captured
Read with: `../epics/E-B-read-progress.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R9.

## Story

As a reader, I want to see which funders pay for the projects filed under a classification and how much, so that I can answer a funder who asks how much of the work was theirs and who else is in it.

## Description

A classification's page ends with its funders: a ranked bar for each organization that administers a funding source on these projects, and underneath, a table of the grants behind the bars. Funding on these pages is whole-project money, because a grant pays for a project and a project can carry several classifications; the section says so whenever that applies. It sits last because a funder reads the performance measures first and asks "how much of that was us?" second. To see it: `/prototypes/classifications`, open "Salmon & steelhead recovery" (F1.1) and scroll to "Funders".

## Requirements

R1. The page ends with a section headed "Funders", below "Projects" (story 19).

R2. The section draws one bar for each funder: an organization that administers a funding source on at least one project filed under the classification. Bars are horizontal, funders down the left, dollars along the bottom with short figures ("$1.5M"), largest total first; funders with equal totals are ordered A to Z by name. The chart is labelled "Funding by funder". Hovering or focusing a bar names the funder and gives "Funding" as an exact dollar amount and "Projects" as the number of these projects the funder funds.

R3. A funder's bar is the whole value of every funding source it administers on these projects: each grant's full amount, with no share set aside for any other classification the project carries. The number of bars equals the Funders figure at the top of the page (relies on story 14, summary).

R4. When any project filed under the classification carries another classification as well, the section shows the sentence "Whole-project amounts, so totals overlap across classifications." below the chart, and the chart is described by it to assistive technology. When no project does, the sentence is absent. No figure in the section adds the funders into one total.

R5. Beneath the chart a collapsed disclosure "View as data" opens a table with the columns "Funder", "Program", "Project" and "Amount": one row per grant. Rows are ordered by funder in the chart's order, each funder's grants largest first. Amounts are whole dollars with a dollar sign. A funder's rows add up to its bar. The table is the chart's text alternative: every exact figure can be read there.

R6. In the table, a reader can sort by any column by choosing its head. Closing the disclosure and opening it again shows the same rows.

R7. A classification whose projects carry no funding shows the heading "Funders" and the message "No funding yet" in place of the chart, the sentence and the table.

R8. A funder that administers more than one funding source on the same project has one bar; each source is a row in the table, and the funder counts the project once in "Projects".

R9. The same project's grants appear, with the same amounts, in the table of every classification the project carries.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The summary's Funders figure and the other summary figures — see story 14.
- Which projects are listed and counted for a Viewer with no organization — see story 22.
- The group page's funders, which count each project once across the group — see story 21.
- Funders as organizations: their own pages and names — owned by `organizations-admin`.
- A funder-to-project flow diagram: not wanted; it would read as money that went to the goal, which the data cannot say.

## Needs to know from elsewhere

- A funding source, its amount, its program name and the organization that administers it are part of a project's record (`project-record`).
- A "funder" here is that administering organization; the amount is the source's whole value.
- Which projects are counted for a given reader is story 22's rule; this section follows it.

## Scenarios

**S1 — Ranked bars** (proves R1, R2)
- Given Ada opens the page of "Salmon & steelhead recovery"
- When she scrolls to the end
- Then the last section is "Funders" and shows 17 horizontal bars, the longest at the top, with dollar ticks along the bottom

**S2 — Tooltip** (proves R2)
- Given the chart of "Salmon & steelhead recovery" is shown
- When Ada hovers or focuses the top bar
- Then a tip names the funder and shows "Funding" with an exact dollar amount and "Projects" with a count no larger than 11

**S3 — Equal totals** (proves R2)
- Given two funders on a classification have the same total (F9: two funders with equal totals on one classification)
- When Ada reads the chart
- Then the two are in A to Z order

**S4 — Bars equal the Funders figure** (proves R3)
- Given the page of "Salmon & steelhead recovery" shows 17 Funders at the top (F4)
- When Ada counts the bars
- Then there are 17

**S5 — Whole-project dollars** (proves R3, R9)
- Given a project carries both "Salmon & steelhead recovery" and another classification (F9: a project carrying two classifications and one grant)
- When Ada reads that grant's row in the data table on each of the two pages
- Then it is the same full amount on both

**S6 — The overlap sentence** (proves R4)
- Given Ada is on the page of "Salmon & steelhead recovery" (F4)
- When she looks under the chart
- Then "Whole-project amounts, so totals overlap across classifications." is there, and no total of all funders is anywhere

**S7 — No sentence without overlap** (proves R4)
- Given a classification all of whose projects carry only that classification (F9: a classification all of whose projects carry only it, to be added)
- When Ada opens its page
- Then the Funders section has the chart and the table and no overlap sentence

**S8 — View as data** (proves R5, R6)
- Given the Funders section of "Salmon & steelhead recovery" is shown
- When Ada opens "View as data" and chooses the head "Amount"
- Then a table with "Funder", "Program", "Project" and "Amount" shows one row per grant, amounts as dollars, and sorts by Amount

**S9 — A funder's rows add up** (proves R5)
- Given the table is open
- When Ada adds the "Amount" of every row of the funder with the top bar
- Then the sum is that bar's "Funding" in the tooltip

**S10 — Two sources, one bar** (proves R8)
- Given a funder administers two funding sources on one project (F9: a funder with two sources on one project)
- When Ada reads the chart and the table
- Then it has one bar, two rows for that project, and the tooltip's "Projects" counts the project once

**S11 — No funding** (proves R7)
- Given a classification added by story 02, with no projects (F7)
- When Ada opens its page
- Then "Funders" shows "No funding yet" and no chart, no sentence and no "View as data"

## UAT script

Preconditions: Ada (F5) is signed in; the tree is F1.
Test data: F1.1, F2, F4 (Salmon & steelhead recovery); a classification added with story 02 (F7).
Reset: remove the classification added in step 10 with story 06.

| # | Do this | You should see |
|---|---|---|
| 1 | Open Classifications, then "Salmon & steelhead recovery", and scroll to the end. | The last section is "Funders" with horizontal bars, largest on top. |
| 2 | Count the bars; compare with the "Funders" figure at the top. | 17 bars; the figure reads 17. |
| 3 | Hover the top bar. | A tip with the funder's name, "Funding" in dollars, "Projects" as a number. |
| 4 | Read under the chart. | "Whole-project amounts, so totals overlap across classifications." |
| 5 | Press "View as data". | A table: "Funder", "Program", "Project", "Amount". |
| 6 | Choose the head "Amount", then "Funder". | The rows reorder by amount, then by funder. |
| 7 | Add the amounts of the top funder's rows. | The sum equals the top bar's "Funding". |
| 8 | Open another classification that carries one of the same projects and find that project's grant row. | The same amount as on the first page. |
| 9 | Press "View as data" again to close it. | The table hides; opening it shows the same rows. |
| 10 | In Settings, add a classification in any group (story 02), then open its page from Classifications. | "Funders" reads "No funding yet"; no chart, no sentence. |

## Open questions

None.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | STA-24 |
| R2 | shown | ACN-14; RUL-69; RUL-70 |
| R3 | decided | RUL-19 |
| R4 | decided | STA-25; RUL-19 |
| R5 | shown | ACN-14 |
| R6 | shown | ACN-14; RUL-71 |
| R7 | shown | STA-24 |
| R8 | shown | RUL-19 |
| R9 | decided | RUL-19 |

- Prototype files: `src/components/classifications/firma2-classification-funding.astro` (bars, sentence, "View as data" grid), `src/data/firma2-classification-rollup.ts` (`funderTotals`: grouped by organization, ranked by amount then name; `funding`, `funders`).
- Data shapes: per funder: organization, total amount, count of projects, grants (project, program, amount).
- Do not copy: the chart and the grid are created by a script on page load; the grid is built on first open because one built inside a closed disclosure measures zero width (a component detail, not a rule). The table order is the rollup's grant order (largest first), stated as R5.

</details>
