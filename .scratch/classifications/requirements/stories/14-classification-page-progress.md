# 14 — Reader sees how far along a classification is on its own page

Type: story
Epic: E-B Read progress against the tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-219, Q-220, Q-221, Q-222
Revision: 1
Blocked by: 05
Covers: OBJ-6, SCR-5, STA-18, STA-19, STA-20, STA-21, STA-22, STA-47, RUL-14, RUL-15, RUL-16, RUL-17, RUL-54, RUL-55, RUL-56, RUL-57, RUL-92
Sources: `/prototypes/classifications/<classification>` (reading page); spec #3, #4, #11; Q-152, Q-197
Snapshot: not yet captured
Read with: `../epics/E-B-read-progress.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R13, on proposals Q-219 to Q-222 (R4, R9, R11 and R13 rest on them).

## Story

As a reader, I want a classification's own page to say what it is, how much work stands under it and how far along each of its performance measures is, so that I can tell whether the goal is on track without opening any project.

## Description

This is the first thing a reader meets after choosing a classification: its summary (description and four totals) and its performance measures as tiles, one per measure, each saying how much of the goal has been reported. Everything about how a figure is counted and worded is stated here once; the Outline (story 15) and Browse (story 17) draw the same figures and rely on these rules. The page's projects, funders, the "Simple / Detailed" switch and a group's own page belong to stories 19, 20 and 21. To see it in the prototype, open the Classifications page and choose Salmon & steelhead recovery (F1.1; its figures are F3.1 to F3.3 and F4); Water quality, Fuel breaks and Wildfire resilience show the other states.

## Requirements

R1. The page is headed by the classification's name, led by its icon when one has been chosen and by nothing when not (relies on story 15, R14, and story 03; proposed, Q-235). Above it is a trail: "Classifications" (in the workspace's own word, SR-2), then every group it sits in, outermost first, each a link to that group's page (story 21), then the classification's name as the current page.

R2. Under the heading the page shows the classification's description as plain text, then four figures, each stated once:
- "Projects": how many projects carry this classification, with the line "of `<N>` in the portfolio" where `<N>` is every project in the workspace.
- "Estimated cost": the sum of those projects' estimated total cost, in whole dollars, with the line "Total across all years".
- "Spent to date": what those projects have spent so far, in whole dollars, with the line "`<N>`% of estimated cost" (a whole percent; 0% when the estimated cost is 0).
- "Funders": how many distinct organizations administer a funding source on those projects.

R3. A project is counted in the Projects, Estimated cost, Spent to date and Funders figures when it carries the classification, whether or not it reports anything toward any of the classification's performance measures. It counts toward a measure's progress only when it carries the classification and has reported toward that measure; a project that carries the classification and reports nothing toward the measure adds nothing to that measure's figure.

R4. Under the heading "Performance measures" the page shows one tile for each performance measure that any project carrying the classification reports toward, whether or not it is linked to the classification (decided, Q-234). The measures linked to it (story 05) come first, in the measure catalog's order, then the unlinked ones in the catalog's order (proposed, Q-219, Q-234). A measure no project reports and no one linked is not shown, and a retired one is not shown (story 05, RUL-39). A tile of an unlinked measure reads like any measure with no goal (R6, R9): "No goal set", measured against what projects planned; nothing else marks it as unlinked. The tiles are drawn four to a row at the full page width, fewer on narrower screens. Simple is the way the page opens; the switch to Detailed is story 19.

R5. Each tile holds, in this order: a ring, the big figure, the measure's name as the tile's heading, the figure line, and the "not yet planned" line. The ring's solid arc is how much has been reported against what the figure is measured against (R6); its lighter arc is how much of the goal projects have planned; the grey that is left is the part of the goal nobody has planned yet. With no goal the ring measures against what is planned and has no lighter arc.

R6. A measure is measured against its goal target (story 05). With a goal, the figure line reads "`<reported>` of `<goal>` `<unit>` goal", for example "14.5 of 30 miles goal". With no goal, the figure line measures against what projects planned and ends in "planned", for example "11.1 of 18 acres planned", and the line under it reads "No goal set". The line always ends in the word for what it is measured against. Numbers use thousands separators and as many decimals as the measure defines, without trailing zeros ("1,478 of 2,400 hours planned"). The unit is written after the goal or plan only, not after the reported amount; a measure counted in percent writes "%" on both ("62% of 80% goal"); a measure counted in single items ("each") writes no unit ("0 of 12 goal").

R7. The big figure is the share of what the figure is measured against, as a whole percent, rounded to the nearest. It reads 99% for anything that rounds to 100% before the goal is reached, 100% once it is reached, and 100% where more than the goal has been reported. It reads "0%" where 0 has been reported, and "—" where nothing has been reported toward the measure.

R8. The line "`<N>` not yet planned" (a number in the measure's format, without a unit) shows where the goal is larger than what projects have planned, with `<N>` the goal minus what is planned. It is not shown where what is planned meets or passes the goal, where no project has planned anything toward the measure, where the measure has no goal, or where the measure does not add (R10).

R9. Where a measure has no goal and nothing is planned, there is nothing to measure it against: the big figure is the reported amount with its unit, or "—" when nothing has been reported; the figure line reads the reported amount with its unit, or "Not reported" when nothing has been reported; the ring stays empty; and the line "No goal set" shows. The words are the same on every page that draws the measure (proposed, Q-220).

R10. A measure whose counting rule is to add (sum) shows the total of what projects reported, and what they planned is the total of their own targets. A measure that does not add (a rate, a condition) shows the average over only the projects that reported, never a planned total, so it has no "planned" comparison and no "not yet planned" line; it reads "—" while no project has reported. A project that has reported 0 toward a measure that adds counts toward the total (the total can be 0); a project that has reported 0 toward one that does not add is left out of the average.

R11. A project's figures are added to a measure only in that measure's own unit: acres are never added to miles. A few spellings count as the same unit (barriers as each, trees as plants, acre-feet as acre-feet per year, tons as tons per year). A project's row in any other unit is left out of that measure's figures and is listed for the administrator in Performance measures, where measures and units are defined (proposed, Q-221).

R12. A classification that no project reports any measure toward and that has none linked shows the words "No performance measures yet" under the heading and no tiles. The switch between Simple and Detailed (story 19) is not offered then.

R13. The date a goal is due is set with the goal (story 05) and is not shown on this page or on any Classifications page; it is seen on the settings page only (proposed, Q-222).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Which projects make up a figure, the Simple / Detailed switch and the table by year — see story 19.
- Who funds the projects, and the funding note "Whole-project amounts, so totals overlap across classifications." — see story 20.
- A group's own page, which adds up what is beneath it with no goal — see story 21.
- The figures a Viewer with no organization sees (published projects only) — see story 22.
- The page of a classification that has been removed — see story 23.
- The "Edit classification" button — see story 13.
- Opening a project from the page, or its side panel — see story 19.

## Needs to know from elsewhere

- A goal target is a number and a year on one measure of one classification, set by an administrator; a measure may be linked with none — owned by story 05.
- Only measures that are not retired are shown; the link and goal are kept when a measure is retired — owned by story 05 (RUL-39).
- Which projects carry a classification, what they have reported toward each measure, their own targets, estimated cost, spending and funding sources — owned by the `project-record` and `performance-measures` features.
- A measure's counting rule (adds, or does not) and its unit and decimals are set in the measure catalog — owned by the `performance-measures` feature.

## Scenarios

**S1 — The page names where it sits** (proves R1)
- Given F1 and a reader on the Classifications page
- When they choose Fuel breaks, which sits in Forests & fuels inside Practice area
- Then the heading reads "Fuel breaks" and the trail reads Classifications, Practice area, Forests & fuels, Fuel breaks; the first three are links and the last is not.

**S2 — The summary states four figures** (proves R2)
- Given F1 and F4
- When the reader opens Wildfire resilience
- Then the page shows its description, then Projects 2 "of 24 in the portfolio", Estimated cost $11,330,000 "Total across all years", Spent to date $6,124,500 "54% of estimated cost" and Funders 4.

**S3 — Nothing spent reads 0%** (proves R2)
- Given F4
- When the reader opens Public access & recreation
- Then Spent to date reads $0 with the line "0% of estimated cost".

**S4 — A project is counted though it reports nothing** (proves R3, R12)
- Given F4 and F3.11: Prescribed fire is carried by 1 project, which reports toward no measure, and has none linked
- When the reader opens Prescribed fire
- Then Projects reads 1 "of 24 in the portfolio" and the page shows "No performance measures yet" with no tile.

**S5 — A measure with a goal, partly reported** (proves R4, R5, R6, R7, R8, R10)
- Given F3.1 to F3.3 and F3.3a, the fourth measure of Salmon & steelhead recovery, "Stream miles reopened to fish" (0 of 25 miles goal, 6.5 not yet planned)
- When the reader opens Salmon & steelhead recovery at full page width
- Then four tiles stand in one row. The tile "Stream miles of instream habitat improved" shows a ring filled to 48% with a lighter arc beyond it, the big figure "48%", the heading, the line "14.5 of 30 miles goal" and the line "14.8 not yet planned".

**S6 — A goal with nothing reported toward it** (proves R6, R7)
- Given F3.2
- When the reader looks at the tile "Fish passage barriers removed"
- Then it reads "0%", "0 of 12 goal" (no unit, the measure counts single items) and "5 not yet planned".

**S7 — A goal that projects have planned past** (proves R8)
- Given F3.3: a goal of 1,000 acres with more than that planned
- When the reader looks at the tile "Acres of floodplain habitat reconnected"
- Then it reads "11%" and "106 of 1,000 acres goal", and no "not yet planned" line.

**S8 — A measure with no goal** (proves R6)
- Given F3.6
- When the reader opens Water quality and looks at "Acres of riparian habitat restored"
- Then the tile reads "62%", "11.1 of 18 acres planned" and "No goal set"; the ring has no lighter arc.

**S9 — A measure that does not add, with nothing reported** (proves R10)
- Given F3.5: Plant survival rate, a percentage that does not add, goal 80%, no project has reported
- When the reader opens Riparian & wetland habitat
- Then its tile reads "—", "— of 80% goal" and no "not yet planned" line; the ring is empty.

**S10 — Nothing to measure against and nothing reported** (proves R9)
- Given F3.7: Tons of biomass removed in fuels treatment, no goal, nothing planned, nothing reported
- When the reader opens Wildfire resilience
- Then its tile reads "—", "Not reported" and "No goal set", with an empty ring.

**S11 — A share that rounds to 100 reads 99, and more than the goal reads 100** (proves R7)
- Given two measures with a goal: one reported at 99.6% of it and one reported above it (F9: still to be added)
- When the reader opens their classifications
- Then the first big figure reads "99%"; the second reads "100%" and its figure line shows the real amounts.

**S12 — An unlinked measure is rolled up** (proves R4)
- Given a measure that a project carrying a classification reports toward and that is not linked to it (F9: still to be added)
- When the reader opens the classification
- Then its tile follows the linked measures' tiles and reads like a measure with no goal: "No goal set" and a figure line ending "planned".

**S13 — The goal's year is not on the page** (proves R13)
- Given F3.1 with a goal set for a year
- When the reader looks at its tile
- Then no year appears in the tile.

**S14 — A unit that does not match is left out** (proves R11)
- Given a measure counted in miles and a project whose row for it is in acres (F9: still to be added)
- When the reader opens the classification
- Then the measure's figures do not include that project's acres.

## UAT script

Preconditions: Ada, Cam or Vera (any signed-in reader, F5) is signed in. Tester's browser is at the full width of a laptop screen.
Test data: F1; F3.1 to F3.3, F3.6, F3.7, F3.11; F4 (rows Salmon & steelhead recovery, Wildfire resilience, Prescribed fire). The tester notes the four tiles' names before step 4.
Reset: none needed.

| # | Do this | You should see |
|---|---|---|
| 1 | Open Classifications, then choose the name "Salmon & steelhead recovery" | The heading "Salmon & steelhead recovery"; above it the trail Classifications, Plan goal, Salmon & steelhead recovery |
| 2 | Read the four figures under its description | Projects 11 "of 24 in the portfolio"; Estimated cost $19,507,000; Spent to date $10,904,000 "56% of estimated cost"; Funders 17 |
| 3 | Scroll to "Performance measures" | Four tiles in one row, each with a ring, a percentage, a heading and a figure line |
| 4 | Find the tile "Stream miles of instream habitat improved" | "48%", "14.5 of 30 miles goal", "14.8 not yet planned" |
| 5 | Find "Fish passage barriers removed" | "0%", "0 of 12 goal", "5 not yet planned" |
| 6 | Find "Acres of floodplain habitat reconnected" | "11%", "106 of 1,000 acres goal", and no "not yet planned" line |
| 7 | Go back to Classifications and open Water quality | The tile "Acres of riparian habitat restored" reads "62%", "11.1 of 18 acres planned", "No goal set" |
| 8 | Go back and open Wildfire resilience | The tile "Tons of biomass removed in fuels treatment" reads "—", "Not reported" and "No goal set" |
| 9 | Go back and open Prescribed fire | Projects 1 "of 24 in the portfolio"; under "Performance measures" the words "No performance measures yet" and no tiles |

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-219 (proposed) — In what order are a classification's performance measures listed?
- Q-220 (proposed) — A Simple tile with nothing to measure against and nothing reported: what does it say?
- Q-221 (proposed) — A project's row in a different unit than its performance measure.
- Q-222 (proposed) — Should a measure's tile show the year its goal is due?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; decided (user, 2026-11-24, Q-235) | SCR-5; relies on story 15, RUL-95 |
| R2 | shown | OBJ-6 |
| R3 | decided | RUL-14; OBJ-6 |
| R4 | shown; shown; proposed (Q-219); decided (user, 2026-11-24, Q-234) | STA-47; SCR-5; SCR-5; RUL-92 |
| R5 | shown; decided | STA-47; RUL-17 |
| R6 | shown; decided | STA-18; STA-19; RUL-17 |
| R7 | decided | RUL-17 |
| R8 | shown; decided; shown; shown | STA-18; RUL-17; STA-21; RUL-54 |
| R9 | shown; shown; proposed (Q-220) | STA-19; STA-20; STA-20 |
| R10 | decided; shown; shown | RUL-15; RUL-55; RUL-56 |
| R11 | decided; proposed (Q-221) | RUL-16; RUL-16 |
| R12 | shown | STA-22 |
| R13 | shown; proposed (Q-222) | RUL-57; RUL-57 |

- Prototype files: `src/pages/prototypes/classifications/[classification].astro`; `src/components/classifications/firma2-classification-summary.astro` (summary; `spentShare` = rounded spent / estimated cost, 0 when cost is 0); `firma2-classification-measures.astro` (tiles, lines 99 to 125, 352 to 392); `src/lib/kpi-row.ts` (`kpiRowView`: denominator = goal, else planned total, else 0; percent rule; `lead`; `highlight`); `src/lib/goal-kpis.ts` (repaint from edits); `src/data/firma2-classification-rollup.ts` (`progressOver`, `kpisFor`, `UNIT_ALIASES`, `rollupClassification`, lines 1 to 30, 45 to 60, 200 to 232, 306 to 360).
- Data shapes: a measure's progress is `reported` (sum of project figures, or the average over projects whose reported figure is above 0), `committed` (sum of project targets, null for a measure that does not add or when none set one), and an optional goal `{value, year}`. `highlight.value` is the percent when the denominator is above 0, else the reading with its unit, else "—"; `highlight.label` is the figure line (empty with no denominator); `highlight.sub` is "No goal set", "`<N>` not yet planned", or empty.
- Do not copy: the build-time error for a unit mismatch (R11 states the product rule); the repaint from browser edits (`goal-kpis.ts`); "Removed in Workspace settings." warning (story 23); the page being generated once per classification at build.

</details>
