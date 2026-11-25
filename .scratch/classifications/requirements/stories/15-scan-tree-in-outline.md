# 15 — Reader scans the whole tree in Outline and opens a classification's measures

Type: story
Epic: E-B Read progress against the tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-219
Revision: 1
Blocked by: 14
Covers: SCR-1, SCR-2, STA-1, STA-3, STA-4, STA-5, STA-6, STA-7, STA-9, ACN-2, ACN-3, ACN-4, RUL-6, RUL-23, RUL-25, RUL-58, RUL-59, RUL-95
Sources: `/prototypes/classifications` (the Outline); spec #6, #7, #9; Q-192
Snapshot: not yet captured
Read with: `../epics/E-B-read-progress.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R13; R7 rests on proposal Q-219.

## Story

As a reader, I want the whole tree on one page, with a count and a ring for every row, so that I can tell how far along every goal is without opening each one.

## Description

The Classifications page is where a reader starts. Its first view, Outline, shows every group and classification as one table: counts of projects, funders and performance measures, and one ring for each performance measure of a classification. A group folds away what is beneath it; a classification opens to one line for each of its measures. The figures follow story 14's rules. The switch to Browse and the remembered choice of view are story 17, the tooltip on a ring is story 16, and the side-panel button on a row is story 18. To see it in the prototype, open `/prototypes/classifications` with F1 (counts in F2, figures in F3).

## Requirements

R1. "Classifications" in the main navigation opens the Classifications page, titled with the workspace's own word for it (SR-2). Any signed-in reader may open it. The page opens in Outline unless the reader chose Browse (story 17).

R2. Outline is one table with five columns, in this order: "Name", "Projects", "Funders", "Performance measures" and "Progress". Each column means one thing on every row: Name is the group's or classification's name; Projects, Funders and Performance measures are counts; Progress holds one ring for each performance measure.

R3. The rows are in tree order: the top-level groups in their order; under each group, its own classifications in their order, then the groups inside it, each with its own classifications and groups in the same way. A row is indented one step for each level it sits below the top. Every row of the tree is a row of the table; nothing is left out.

R4. A group's row has: a chevron, a swatch (or icon, R14) in the group's own colour, its name, and beside the name how many classifications are beneath it at any depth ("7 classifications", "1 classification", "0 classifications"). Its Projects, Funders and Performance measures cells count what is beneath it, the measures being those of every classification beneath it and then those projects report that none tracks (story 21, RUL-75; proposed, Q-234), each project counted once, each funder once and each distinct performance measure once, however many classifications carry it. Its Progress cell is empty: a group has no goal and so no ring. Its name is set in the heavier weight and its row is shaded.

R5. A classification's row has: a chevron when it has performance measures, a swatch in the colour of its parent group (not its own colour), its name, then Projects (the projects carrying it), Funders (the distinct organizations administering a funding source on those projects) and Performance measures (how many it has, not counting a retired measure) as counts, and in Progress one ring for each measure.

R6. A ring shows how far along its measure is by story 14's rules: solid arc for what is reported, a lighter arc for what is planned, against the goal or, with no goal, against what is planned. A ring is named for assistive technology "`<measure name>`: `<figure>`", for example "Stream miles of instream habitat improved: 14.5 of 30 miles goal". The list of rings is named "`<N>` performance measures". When the rings of one row do not fit on one line they wrap onto the next.

R7. The rings of a row, and the measure lines in R9, follow one order: the measure catalog's order, the same as the tiles on the classification's page (story 14, R4) (proposed, Q-219), and includes the measures that projects report but nobody linked, after the linked ones (decided, Q-234).

R8. Each name is a link: a classification's goes to its own page (story 14), a group's goes to its own page (story 21).

R9. The chevron of a classification that has measures is named "Show measures for `<name>`" and is not expanded. Pressing it opens one line under the row for each performance measure: the measure's ring and name in the Name column and its figure, worded as story 14 words it ("14.5 of 30 miles goal", "11.1 of 18 acres planned", "Not reported"), in the Progress column; the other cells of the line are empty. The chevron then reads "Hide measures for `<name>`" and is expanded; pressing it again closes the lines.

R10. A classification with no performance measures shows 0 in Performance measures, an empty Progress cell and no chevron, and its name starts at the same place as its neighbours' names.

R11. The chevron of a group is named "Hide `<group name>`" and is expanded. Pressing it hides every row beneath the group, at every depth, measure lines included, and the chevron then reads "Show `<group name>`" and points the other way; pressing it again shows what was beneath. Where two states of the page's rows meet: a group folded inside another folds only its own branch, and when the outer group is shown again the inner one is still folded; a classification whose measure lines were open stays open while its group is folded and shows its lines again when the group is shown. A folded group always wins over an opened classification.

R12. The page opens with every group open and every classification closed, so the first read is the tree and its counts. Folding and opening are not kept: opening the page again starts that way again.

R13. On a phone (45rem or narrower) the table scrolls sideways and the Name column stays in view.

R14. Where a name leads in the Outline, the record's icon (stories 03 and 04), when one has been chosen, replaces the colour square and is tinted in the group's colour; a record with no icon shows the square. This is the rule for every list, heading and card that leads with a name; stories 02, 14, 17, 18 and 21 rely on it (decided, Q-235).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The switch between Outline and Browse, the remembered choice, and a link that opens one record — see story 17.
- The tooltip on a ring when hovered or focused — see story 16.
- The side-panel button beside a classification's name and the peek it opens — see story 18.
- The page a group's name opens — see story 21; a classification's page figures — see story 14.
- The page when nothing is set up, and the page of a record that was removed — see story 23.
- Figures a Viewer with no organization sees (published projects only) — see story 22.
- Searching or filtering the table: not in the first release.

## Needs to know from elsewhere

- How each measure's figure and ring are worked out, and the words of the figure — owned by story 14.
- A swatch is its parent group's colour wherever a classification is listed; a group shows its own colour — owned by this story (R4, R5); the colour is set in story 03 and story 04.
- The tree's order and nesting are arranged in Settings — owned by stories 07, 08 and 09.
- Counts of projects and funders come from the projects that carry each classification — owned by the `project-record` and `projects-index` features.

## Scenarios

**S1 — Outline is the page's first view** (proves R1, R2)
- Given F1 and a signed-in reader
- When they choose "Classifications" in the main navigation
- Then the page opens in Outline: one table whose column heads read Name, Projects, Funders, Performance measures, Progress.

**S2 — Rows follow the tree** (proves R3)
- Given F1
- When the reader reads down the Name column without folding anything
- Then it reads Plan goal, its seven classifications in F1.1 order, Practice area, Channels & fish passage, its three classifications, Vegetation & wetlands and so on; each classification is one step in from its group.

**S3 — A group's row counts what is beneath it** (proves R4)
- Given F1 and F2
- When the reader looks at the row "Plan goal"
- Then beside the name it reads "7 classifications", and Projects 24, Funders 33, Performance measures 19; the Progress cell is empty and its swatch is the group's blue.

**S4 — A project is counted once in a group** (proves R4)
- Given F2: Practice area's four groups hold 10, 9, 2 and 4 projects, and one project carries classifications in two of them
- When the reader looks at the row "Practice area"
- Then Projects reads 24, not 25, and it reads "12 classifications".

**S5 — A classification's row** (proves R5, R6)
- Given F2 and F3
- When the reader looks at the row "Salmon & steelhead recovery"
- Then it reads Projects 11, Funders 17, Performance measures 4; Progress holds four rings; its swatch has the colour of Plan goal's row; a screen reader reads the third ring as "Stream miles of instream habitat improved: 14.5 of 30 miles goal".

**S6 — Names open pages** (proves R8)
- Given F1
- When the reader chooses the name "Water quality" and then, from the Classifications page, "Forests & fuels"
- Then the first opens the page of the classification Water quality and the second the page of the group Forests & fuels.

**S7 — Open a classification's measures** (proves R9, R12)
- Given F1 on first opening, where no classification is open
- When the reader presses "Show measures for Salmon & steelhead recovery"
- Then four lines appear under the row, each with a ring and a measure name and, in Progress, its figure, among them "Stream miles of instream habitat improved" with "14.5 of 30 miles goal"; the chevron now reads "Hide measures for Salmon & steelhead recovery". Pressing it hides the four lines.

**S8 — A measure with no goal shows what is planned** (proves R9)
- Given F3.6
- When the reader opens the measures of Water quality
- Then the line "Acres of riparian habitat restored" reads "11.1 of 18 acres planned".

**S9 — A classification with no measures** (proves R10)
- Given F2 and F3.11
- When the reader looks at the row "Prescribed fire"
- Then Performance measures reads 0, the Progress cell is empty and the row has no chevron; the name starts at the same place as "Fuel breaks" above it.

**S10 — Fold a group** (proves R11, R12)
- Given F1 on first opening
- When the reader presses "Hide Plan goal"
- Then the seven classifications beneath it disappear and the button reads "Show Plan goal"; Practice area and its rows are untouched; pressing it again shows the seven.

**S11 — An inner fold is kept** (proves R11)
- Given Practice area open and Forests & fuels folded inside it
- When the reader presses "Hide Practice area" and then "Show Practice area"
- Then Channels & fish passage's rows are open as before and Forests & fuels is still folded.

**S12 — A folded group wins over an open classification** (proves R11)
- Given the measures of Salmon & steelhead recovery are open
- When the reader presses "Hide Plan goal" and then "Show Plan goal"
- Then while it is folded neither the row nor its four lines show, and after it is shown again the four lines are there.

**S13 — Rings and lines keep one order** (proves R7)
- Given F3.1 to F3.3a on Salmon & steelhead recovery
- When the reader opens its measure lines and compares them with its four rings, left to right
- Then the lines top to bottom and the rings left to right name the same measures in the same order as the tiles on its page (story 14).

**S14 — A phone keeps the name in view; an icon replaces the square** (proves R13, R14)
- Given a phone-width window (45rem or narrower)
- When the reader scrolls the table sideways
- Then the Name column stays in place and the other columns move under it.
- Given also that Water quality has an icon chosen and Public access & recreation has none
- When the reader looks at both names
- Then Water quality leads with its icon in Plan goal's colour and Public access & recreation with the colour square.

## UAT script

Preconditions: A signed-in reader (F5). A laptop-width window first; step 9 uses a narrow one.
Test data: F1 and F2 (rows Plan goal, Practice area, Salmon & steelhead recovery, Prescribed fire); F3.1 and F3.6.
Reset: none needed (folds and openings are not kept; reload the page).

| # | Do this | You should see |
|---|---|---|
| 1 | Choose "Classifications" in the main navigation | A table with the columns Name, Projects, Funders, Performance measures, Progress; every group open |
| 2 | Read the row "Plan goal" | "7 classifications" beside the name; 24, 33 and 19 in the three count columns; nothing in Progress |
| 3 | Read the row "Practice area" | "12 classifications"; 24 Projects (not 25) |
| 4 | Read the row "Salmon & steelhead recovery" | 11, 17, 4 and four rings in Progress |
| 5 | Press "Show measures for Salmon & steelhead recovery" | Four lines under the row; one reads "Stream miles of instream habitat improved" with "14.5 of 30 miles goal" |
| 6 | Press "Hide Plan goal" | Plan goal's seven rows and the four lines disappear; the button now reads "Show Plan goal" |
| 7 | Press "Show Plan goal" | The seven rows are back and the four lines are still open |
| 8 | Find "Prescribed fire" | 0 in Performance measures, nothing in Progress, no chevron |
| 9 | Make the window narrow (phone width) and scroll the table sideways | The Name column stays; the counts and rings slide under it |
| 10 | Choose the name "Water quality" | That classification's own page opens |

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-219 (proposed) — In what order are a classification's performance measures listed?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | SCR-1; STA-1 |
| R2 | decided | SCR-2; RUL-23 |
| R3 | shown; shown | SCR-2; RUL-59 |
| R4 | shown; decided; shown | STA-7; RUL-23; RUL-6 |
| R5 | decided; decided | RUL-23; RUL-6 |
| R6 | shown | SCR-2 |
| R7 | proposed (Q-219); decided (user, 2026-11-24, Q-234) | SCR-2; relies on story 14, RUL-92 |
| R8 | shown | ACN-4 |
| R9 | shown | STA-5; ACN-3 |
| R10 | shown | STA-6 |
| R11 | shown; shown; shown | STA-4; ACN-2; RUL-58 |
| R12 | shown | STA-3; RUL-25 |
| R13 | shown | STA-9 |
| R14 | decided (user, 2026-11-24, Q-235) | RUL-95 |

- Prototype files: `src/pages/prototypes/classifications.astro`; `src/components/classifications/firma2-classification-index.astro` (hosts Outline and Browse); `firma2-classification-outline.astro` (rows 52 to 130; fold logic in the script, lines 300 to 330); `src/data/firma2-classification-tree.ts` (counts, lines 76 to 127; `line()` shapes a measure line, a figure of `kpiRowView(...).totalText` with no projects); `src/lib/kpi-row.ts`.
- Data shapes: a group node has `projects`, `funders`, `total` (classifications beneath, any depth), `measureCount` (distinct measures beneath); a classification node has `projects`, `funders` and `measures[]` of `{name, percent, plannedPercent, total}`.
- Do not copy: the data being drawn from the build ("Groups and classifications edited in Workspace settings in this browser do not show here"); the folds living only in the page's memory is not a decision, it is what R12 states (nothing is stored).

</details>
