# 21 — Reader reads a group's progress on its own page, with what it holds

Type: story
Epic: E-B Read progress against the tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-228
Revision: 1
Blocked by: 14, 19, 20
Covers: SCR-6, STA-27, STA-28, ACN-17, RUL-18, RUL-72, RUL-73, RUL-74, RUL-75
Sources: `/prototypes/classifications/groups/<group>` (Forests & fuels, Practice area); spec #3, #4, #5; Q-152, Q-184
Snapshot: not yet captured
Read with: `../epics/E-B-read-progress.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R11 (R10's empty-group wording rests on the proposal Q-228).

## Story

As a reader, I want a group to have a page that says what everything filed beneath it adds up to and what it holds, so that I can read one branch of the work (an area, a plan outcome) without adding up its classifications myself.

## Description

A classification's page (story 14) answers one goal. A group's page answers one level above: what does this whole branch add up to, and what is in it. It has the classification page's sections (summary, performance measures, projects, funders), added up across every classification beneath the group at any depth, each project once, plus a section for what the group holds. A group has no projects, measures or goals of its own (RUL-1). To see it: `/prototypes/classifications`, open the name "Forests & fuels" in the Outline, or "Practice area" for a group of groups (F1.2).

## Requirements

R1. The page's title is the group's name, led by the group's icon (or its colour square when it has none; relies on story 15, RUL-95; proposed, Q-235). The crumbs run "Classifications" (the workspace's word for the page, SR-2), then each group the group sits inside, outermost first, each a link to that group's page, then the group's own name as the current page. A top-level group has only "Classifications" and its own name.

R2. Below the header the page shows, in this order: the summary, what the group holds, "Performance measures", "Projects" and "Funders". The sections for measures, projects and funders have the headings and the contents of a classification's page (stories 19, 20).

R3. The summary shows the group's stored description and four figures: Projects, Estimated cost, Spent to date and Funders. Projects is the number of distinct projects that carry any classification in the group or in a group beneath it, at any depth, each counted once, with "of <N> in the portfolio". Estimated cost and Spent to date add those projects, each once; Spent carries "<N>% of estimated cost". Funders is the number of distinct organizations administering a funding source on them. A group's figure is therefore not the sum of its parts' figures when a project is filed under two of them.

R4. What the group holds is drawn as follows. The group's own classifications come first, one card each, in the group's order (story 07). The groups directly inside it come after, in their order, each as a section whose header is the group's name with a swatch in that group's colour, its description and a button "Open group"; a section holds its own classifications' cards and then the sections of the groups inside it, at any depth, each step indented.

R5. A card shows the classification's name as a link to its page, led by its icon or, when it has none, a swatch in its group's colour, its description (two lines at most), up to three performance measures as one line each (ring, name and the share of its goal as story 14 words it: "48%", "No goal" or "Not reported"), "+<N> more measures" (or "+1 more measure") when it has more than three, and a line "<N> projects · <N> funders" at the foot. A classification with no measures shows "No performance measures yet" in place of the lines. A card has no side-panel button on a group's page.

R6. Each nested group's section is open the first time a reader sees it. The name is the control that folds it ("Open group" is separate). A section a reader closes stays closed on that reader's later visits, wherever it appears, and a reader's closed sections do not affect other readers. The group's own page is not folded; only the groups inside it are.

R7. A nested group with no classification anywhere beneath it is not drawn. A group page with nothing beneath it shows "Nothing in this group" where its contents would be. The summary then reads 0 Projects, $0 Estimated cost, $0 Spent to date ("0% of estimated cost") and 0 Funders; "Performance measures" shows "No performance measures yet" and no Simple or Detailed toggle; "Funders" shows "No funding yet".

R8. "Open group" goes to that group's page. Pressing the section's name folds or opens the section and goes nowhere.

R9. "Performance measures" lists first each measure that any classification beneath the group tracks, then each measure reported by a project beneath the group that none of them tracks (decided, Q-234; RUL-75); each once (a measure tracked by two of them is one entry; a retired measure is not listed). A project counts toward a measure once, when it carries at least one classification beneath the group that tracks that measure, however many such classifications it carries, and each of its reports counts once. The group has no goal, so every measure reads against what its projects planned: the figure ends in "planned" ("9.2 of 9.2 miles planned"), the note is "No goal set", and there is no "Not yet planned" row in Detailed. A measure whose counting rule does not add is averaged over the projects that reported (relies on story 14, RUL-15). Simple and Detailed work as on a classification's page (story 19).

R10. "Projects" lists every distinct project beneath the group, and the count under it equals the Projects figure of the summary. For a group with no projects beneath it the section says "No projects yet." in place of a grid (proposed, Q-228, as for a classification, story 19).

R11. "Funders" draws one bar per funder over those projects, each project's grants counted once, whole-project dollars; the number of bars equals the summary's Funders figure. The overlap sentence follows story 20's rule.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The "Edit group" button in the header, and who is shown it — see story 13.
- The group's settings page, its colour and parent — see story 04.
- The Outline row of a group, which carries the same counts — see story 15.
- A removed group's address — see story 23.
- Which projects are counted for a Viewer with no organization — see story 22.
- The classification peek (a group has none; the cards here have no peek button).
- Setting targets on a group: a group has no targets and no measures of its own (RUL-1, Q-152).

## Needs to know from elsewhere

- A project is filed under classifications only, never under a group (RUL-1); a group's projects are the projects of the classifications beneath it.
- A classification's own figure arithmetic and wording are story 14's; the cards and the measures here use it, with no goal.
- The Outline's "Projects", "Funders" and "Performance measures" counts for a group agree with its page (story 15, RUL-23).

## Scenarios

**S1 — Title and crumbs** (proves R1)
- Given Ada opens the page of "Forests & fuels" from the Outline
- When she reads the header
- Then the title (led by its icon or colour square) is "Forests & fuels" and the crumbs read "Classifications", "Practice area" (a link), "Forests & fuels" (current)

**S2 — A top-level group's crumbs** (proves R1)
- Given Ada opens "Plan goal"
- When she reads the crumbs
- Then they are "Classifications" and "Plan goal"

**S3 — Summary** (proves R2, R3)
- Given Ada is on the page of "Forests & fuels" (F4)
- When she reads below the header
- Then the sections run summary, contents, "Performance measures", "Projects", "Funders"; the summary shows the description "Thinning, fuel breaks and burning that change how fire moves through a forest.", 2 Projects "of 24 in the portfolio", $11,330,000, $6,124,500 "54% of estimated cost" and 4 Funders

**S4 — Counted once** (proves R3)
- Given "Practice area" holds four groups of 10, 9, 2 and 4 projects (F4)
- When Ada opens its page
- Then Projects reads 24 (not 25), Spent to date $19,396,500 and Funders 33

**S5 — A group of classifications** (proves R4, R5)
- Given Ada is on the page of "Forests & fuels"
- When she reads what it holds
- Then three cards show in order, "Forest thinning", "Fuel breaks", "Prescribed fire"; "Prescribed fire" shows "No performance measures yet" and "1 project · 3 funders" (F2); "Fuel breaks" shows one measure line with its share

**S6 — A group of groups** (proves R4)
- Given Ada is on the page of "Practice area"
- When she reads what it holds
- Then there are no cards of its own, and four sections follow in order: "Channels & fish passage", "Vegetation & wetlands", "Forests & fuels", "Runoff & groundwater", each with its description, a swatch, "Open group" and its three cards

**S7 — More than three measures** (proves R5)
- Given a card whose classification tracks more than three measures (F9: Riparian & wetland habitat tracks five, F2; "Salmon & steelhead recovery" four)
- When Ada looks at it on the page of "Plan goal"
- Then it shows three measure lines and "+1 more measure", and no side-panel button

**S8 — Folding is remembered** (proves R6)
- Given the page of "Practice area" is open
- When Ada presses the name "Forests & fuels", leaves and returns
- Then that section is still closed, the other three are open, and for Cam, another reader, it is open

**S9 — Doors** (proves R8)
- Given the page of "Practice area"
- When Ada presses "Open group" in the "Forests & fuels" section, and later presses the section's name
- Then the first opens that group's page and the second only folds or opens the section

**S10 — Nothing beneath it** (proves R7, R10)
- Given Ada added an empty group at the top level with story 02 (F7)
- When she opens its page
- Then the contents say "Nothing in this group", the summary reads 0 Projects, $0 and 0 Funders, "Performance measures" says "No performance measures yet" with no toggle, "Projects" says "No projects yet.", and "Funders" says "No funding yet"

**S11 — An empty group inside is not drawn** (proves R7)
- Given the empty group of S10 was moved into "Practice area" (story 08)
- When Ada opens the page of "Practice area"
- Then no section for it shows among the contents

**S12 — Measures against what was planned** (proves R9)
- Given Ada is on the page of "Forests & fuels"
- When she reads "Performance measures"
- Then two measures are listed (F2), "Miles of fuel break completed" reads "9.2 of 9.2 miles planned" (F3.8) with the note "No goal set", and in Detailed no measure has a "Not yet planned" row

**S13 — A project filed under two classifications counts once** (proves R9)
- Given a project carries two classifications that both track one measure, both beneath one group (F9: a project carrying two classifications)
- When Ada reads that measure on the group's page
- Then the project's report is in the figure once, and the project is one row under the measure

**S14 — Projects and funders** (proves R10, R11)
- Given Ada is on the page of "Forests & fuels"
- When she reads "Projects" and "Funders"
- Then the grid lists 2 projects and the count under it reads "2 projects"; the chart has 4 bars, equal to the Funders figure

## UAT script

Preconditions: Ada and Cam (F5) are signed in in turn; the tree is F1.
Test data: F1.2, F2, F3.8, F4 (Forests & fuels, Practice area).
Reset: remove the group added in steps 9 and 10 with story 06.

| # | Do this | You should see |
|---|---|---|
| 1 | Open Classifications and the name "Forests & fuels". | Title "Forests & fuels"; crumbs "Classifications", "Practice area", "Forests & fuels". |
| 2 | Read the four figures. | 2 Projects "of 24 in the portfolio"; $11,330,000; $6,124,500 "54% of estimated cost"; 4 Funders. |
| 3 | Read what the group holds. | Cards "Forest thinning", "Fuel breaks", "Prescribed fire". "Prescribed fire" says "No performance measures yet". |
| 4 | Scroll to "Performance measures". | Two measures; the fuel break one reads "9.2 of 9.2 miles planned". |
| 5 | Press the crumb "Practice area". | Its page: Projects 24, Funders 33; four group sections, no cards of its own. |
| 6 | Press the name "Forests & fuels" in the contents. | The section folds. Reload: it is still folded. |
| 7 | Sign in as Cam and open "Practice area". | The section is open for Cam. |
| 8 | Press "Open group" in any section. | That group's page opens. |
| 9 | Sign in as Ada. In Settings, add a group at the top level (story 02) and open its page from Classifications. | "Nothing in this group"; 0 Projects; "No performance measures yet"; "No projects yet."; "No funding yet". |
| 10 | Open the page of "Plan goal". | Seven cards; "Salmon & steelhead recovery" shows three measure lines and "+1 more measure"; no side-panel button on any card. |

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-228 (proposed) — What does the Projects section say when no project carries the classification (or a group has none beneath)?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; decided (user, 2026-11-24, Q-235) | SCR-6; relies on story 15, RUL-95 |
| R2 | shown | SCR-6 |
| R3 | decided | RUL-18 |
| R4 | shown | SCR-6; ACN-17 |
| R5 | shown | RUL-72; RUL-74 |
| R6 | shown | STA-28 |
| R7 | shown | STA-27; RUL-73 |
| R8 | shown | ACN-17 |
| R9 | decided; shown; decided (user, 2026-11-24, Q-234) | RUL-18; RUL-75 |
| R10 | decided; proposed (Q-228) | RUL-18; RUL-18 |
| R11 | decided | RUL-18 |

- Prototype files: `src/pages/prototypes/classifications/groups/[group].astro`, `src/components/classifications/firma2-goal-board.astro` (`root`, `peek={false}`), `firma2-goal-board-group.astro`, `firma2-goal-card.astro`, `firma2-classification-summary.astro` (`kind="classificationGroup"`), `firma2-classification-measures.astro` (`figures` from `groupFigures`), `src/data/firma2-classification-rollup.ts` (`rollupGroup`, `groupFigures`, `groupMeasures`, `groupProgress`).
- Data shapes: a group roll-up has the classification roll-up's shape (projects, estimated cost, spent, funders, funding by funder, measures) over the union of its members' projects; its targets list is empty.
- Do not copy: the board is redrawn in the browser from saved edits over the build's cards (a static-site device); the closed-sections list lives in browser storage (the product keeps it per reader); a group added in the browser has no page here and opens its settings page instead (the built product has an ordinary page); the group page's roll-up ignores measures linked or unlinked in settings (an artifact).

</details>
