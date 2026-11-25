# 17 — Reader switches to Browse and reads one group or classification in full

Type: story
Epic: E-B Read progress against the tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-224, Q-225, Q-226
Revision: 1
Blocked by: 15
Covers: SCR-3, STA-2, STA-10, STA-11, STA-12, STA-13, STA-14, ACN-1, ACN-7, ACN-8, ACN-9, RUL-24, RUL-61, RUL-62, RUL-63
Sources: `/prototypes/classifications` (Browse); spec #6, #8; Q-192
Snapshot: not yet captured
Read with: `../epics/E-B-read-progress.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R15; R3, R5 and R10 rest on proposals Q-225, Q-226 and Q-224.

## Story

As a reader, I want to switch from the whole-tree table to a list where I choose one group or classification and read it in full, so that I can see a branch's measures, counts and description without the rest of the tree.

## Description

The Classifications page has two views over the same tree. Outline (story 15) compares everything down columns; Browse lists the tree down the left and shows the chosen group or classification on the right, with every performance measure drawn in full. This story adds the switch between them, the reader's remembered choice, and Browse itself. A link can name one record and opens Browse on it. The peek button on a name is story 18. To see it in the prototype, open `/prototypes/classifications`, choose "Browse", and choose Plan goal, Practice area and Salmon & steelhead recovery in turn (F1, F2, F3).

## Requirements

R1. Above the tree is a switch with two choices, "Outline" and "Browse", named "Classifications view". Choosing one shows that view and hides the other. The switch stays in place above whichever view shows, and shows the view in use as chosen.

R2. The page opens in Outline for a reader who has never chosen. The reader's choice is remembered and used the next time they open the page. Where the choice cannot be remembered, the page opens in Outline. The page opens straight into the right view, with no flash of the other one.

R3. A link to the page ending `#g:<group>` or `#c:<classification>` opens Browse on that record, whatever view the reader last chose. Following such a link opens Browse this once and does not change the reader's remembered view (proposed, Q-225). The same link followed while the page is already open, when only the end of the address changes, switches to Browse as well and the switch follows.

R4. Choosing "Outline" removes a `#g:` or `#c:` end from the address, so that reloading the page stays in Outline. Outline has no link to a single row.

R5. When the reader goes from Browse to Outline and back in one visit, Browse shows the record that was chosen before, and the address names it again (`#g:` or `#c:`), so a reload or a copied link keeps it (proposed, Q-226).

R6. Browse has two parts side by side: the list of the whole tree on the left and the chosen record on the right. On a phone (45rem or narrower) the list stands above the record.

R7. With no link and nothing chosen, Browse opens on the first top-level group, chosen, and open in the list so that what it holds shows. A link naming something that does not exist opens the same.

R8. The list holds every group and every classification, in the tree's order (a group, its own classifications, then the groups inside it), each indented one step per level. A group's row has a chevron, a swatch in its own colour, its name and the number of classifications beneath it, at any depth. A classification's row has a swatch in the colour of its parent group and its name, and no chevron. A group with no classification beneath it has no chevron. The top-level groups always show; every other row shows only when each group above it is open.

R9. Every group starts folded except the branch that leads to the chosen row. A group's chevron is named "Show `<group name>`" while it is folded and "Hide `<group name>`" while it is open, with its open state announced. Pressing it opens or folds only what is directly in that group (and so hides or shows everything below), changes nothing else, and does not choose the group. Any number of groups can be open at once.

R10. Choosing a name in the list (a group or a classification, not its chevron) shows that record on the right, marks its row as the current one, and announces "Showing `<name>`." to assistive technology. It puts `#g:<group>` or `#c:<classification>` in the address, so a reload or a shared link comes back to it. Choosing a name does not fold or open any other group, except that the groups above the chosen row are opened so that its row shows. A row is opened into view when it is chosen. The reader may fold a group that holds the chosen row: the row hides with its group and comes back when the group is opened, and the record on the right stays shown (proposed, Q-224).

R11. When a group is chosen, the right side shows, from the top: its name with the button "Open group"; its description; "`<N>` classifications · `<N>` projects · `<N>` funders", counted as the Outline counts a group (story 15, R4), with singular forms ("1 classification", "1 project", "1 funder"). Below that it shows every classification of the group, then each group inside it under its own name: the name is the path below the chosen group, with " › " between levels. Under each classification are its name (a link to its page, with its swatch), its description, "`<N>` projects · `<N>` funders", and every performance measure with its ring, name, figure and "not yet planned" or "No goal set" line, worded as story 14 words them; or the words "No performance measures yet". A group with no classification beneath it shows its name, description and counts and nothing below.

R12. When a classification is chosen, the right side shows, from the top: the path of groups it sits in, outermost first, with " › " between levels; its name with the button "Open classification"; its description; "`<N>` projects · `<N>` funders"; and every performance measure as in R11, or "No performance measures yet".

R13. "Open group" goes to the group's own page (story 21); "Open classification" and a classification's name go to its own page (story 14).

R14. When many branches are open, the list stays in view while the record scrolls, is never taller than the window, and scrolls on its own so its last rows can be reached. (On a phone the list is not pinned.)

R15. The figures in Browse count what the Outline counts, by the same rules (story 14, story 15); the page's counts for a Viewer with no organization are story 22's.

R16. Wherever a name leads in Browse (the list, a record's heading, each classification under a group) the icon leads it as in the Outline, or the colour square when the record has none (relies on story 15, R14; proposed, Q-235). The measures drawn for a record are those of story 14, R4: every measure its projects report, linked ones first (decided, Q-234).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The side-panel button beside a classification's name in Browse and the peek it opens — see story 18.
- The Outline's rows, folds, rings and counts — see stories 15 and 16.
- A group's own page and a classification's own page — see stories 21 and 14.
- The page when nothing is set up (Browse then has nothing to choose) — see story 23.
- Which figures a Viewer with no organization sees — see story 22.
- Searching or filtering the list: not in the first release.

## Needs to know from elsewhere

- How each measure's figure, ring and note are worded — owned by story 14.
- The counts of projects, funders and classifications and the colours of swatches are those of the Outline — owned by story 15.
- The tree's order and nesting are arranged in Settings — owned by stories 07, 08 and 09.
- A phone layout rule: a list above its detail at 45rem or narrower; touch-sized chevrons — owned by the mobile foundation spec (SR-3).

## Scenarios

**S1 — Switching shows one view** (proves R1)
- Given F1 and a reader on the Classifications page in Outline
- When they choose "Browse"
- Then the list and a chosen record show and the Outline table does not; choosing "Outline" brings the table back and hides Browse.

**S2 — The choice is remembered, or Outline where it cannot be** (proves R2)
- Given a reader who chose "Browse" and closed the page, and a reader whose browser keeps nothing between visits who did the same
- When each opens the Classifications page again with no link
- Then the first opens in Browse without showing the table first; the second opens in Outline; a reader who never chose sees Outline.

**S3 — The list scrolls on its own** (proves R14)
- Given F1 with every group open in the list and a window shorter than the list
- When the reader scrolls the record on the right
- Then the list stays in view, is no taller than the window and scrolls by itself to reach its last row.

**S4 — A link opens Browse on a record** (proves R3)
- Given a reader whose remembered view is Outline, and a link to the page ending in `#c:<Fuel breaks>`
- When they follow it
- Then Browse opens with Fuel breaks chosen, its row visible in the list.

**S5 — Choosing Outline clears the link** (proves R4)
- Given Browse opened by a link ending `#c:<Fuel breaks>`, and the reader's remembered view is Outline
- When the reader follows the link, chooses "Outline" and reloads the page
- Then the table shows and the address has no `#c:` end.

**S6 — Back to Browse keeps the choice** (proves R5)
- Given Browse with Salmon & steelhead recovery chosen
- When the reader chooses "Outline" and then "Browse"
- Then Salmon & steelhead recovery is still the record on the right and the address ends `#c:<Salmon & steelhead recovery>`.

**S7 — First opening** (proves R6, R7)
- Given F1, no link, nothing chosen
- When the reader opens Browse
- Then Plan goal is chosen and open in the list with its seven classifications, Practice area is shown folded below it, and the right side shows Plan goal.

**S8 — The list's rows** (proves R8)
- Given F1, with Practice area and Forests & fuels open
- When the reader reads the list
- Then Practice area shows "12", Forests & fuels shows "3", Prescribed fire has a swatch and a name and no chevron, and Channels & fish passage, Vegetation & wetlands and Runoff & groundwater show folded.

**S9 — A chevron opens one group only** (proves R9)
- Given Plan goal open and Practice area folded
- When the reader presses "Show Practice area" and then "Show Forests & fuels"
- Then both are open with their rows shown, Plan goal is still open, and the record on the right has not changed.

**S10 — Choosing a group** (proves R10, R11)
- Given Browse
- When the reader chooses the name "Practice area"
- Then the right side shows "Practice area" with "Open group", its description, "12 classifications · 24 projects · 33 funders", and a section for each of the four groups, headed "Channels & fish passage", "Vegetation & wetlands", "Forests & fuels" and "Runoff & groundwater", with their classifications and every measure; the row is marked current; the address ends `#g:<Practice area>`; a screen reader hears "Showing Practice area."

**S11 — A classification's record, with or without measures** (proves R12, R13)
- Given F3.11
- When the reader chooses "Salmon & steelhead recovery", presses "Open classification", goes back and chooses "Prescribed fire"
- Then the first shows the path "Plan goal", the name, "11 projects · 17 funders" and four measures, and "Open classification" opens that classification's page; the second shows the path "Practice area › Forests & fuels", "1 project · 3 funders" and "No performance measures yet".

**S12 — Figures and icons match the Outline** (proves R15, R16)
- Given F2
- When the reader reads Practice area in Browse and then in Outline
- Then "24 projects · 33 funders" in Browse equals the Projects and Funders cells of its Outline row, and a record with an icon leads with it in the list and heading as in the Outline.

**S13 — Folding the chosen row's group** (proves R10)
- Given Salmon & steelhead recovery chosen inside an open Plan goal
- When the reader presses "Hide Plan goal" and then "Show Plan goal"
- Then while folded the row is not in the list and the record on the right is still Salmon & steelhead recovery; after it is shown again the row is back and marked current.

**S14 — A link to nothing** (proves R7)
- Given a link ending `#c:` with the name of a classification that does not exist
- When the reader follows it
- Then Browse opens on Plan goal, chosen and open.

## UAT script

Preconditions: A signed-in reader (F5), on a laptop-width window, who has never chosen a view on this browser.
Test data: F1, F2, F3.1 and F3.11 (rows Plan goal, Practice area, Salmon & steelhead recovery, Prescribed fire).
Reset: none needed; to be a reader who never chose, clear the site's data in the browser.

| # | Do this | You should see |
|---|---|---|
| 1 | Open Classifications | The table (Outline) and, above it, a switch with "Outline" shown as chosen and "Browse" |
| 2 | Choose "Browse" | A list down the left and a record on the right; the table is gone |
| 3 | Read the list | Plan goal is open with seven classifications under it; Practice area is below it and folded; Plan goal is the record on the right |
| 4 | Press "Show Practice area" | Its four groups appear in the list; the record on the right is unchanged |
| 5 | Choose the name "Practice area" | The right side shows "Practice area", "Open group", its description and "12 classifications · 24 projects · 33 funders", then four sections with their classifications and measures |
| 6 | Choose "Salmon & steelhead recovery" | The right side shows "Plan goal" above the name, "Open classification", "11 projects · 17 funders" and four measures; one reads "Stream miles of instream habitat improved" with "14.5 of 30 miles goal" |
| 7 | Copy the address, then open it in a new tab | Browse opens with Salmon & steelhead recovery chosen |
| 8 | Reload this page | It still opens in Browse |
| 9 | Press "Show Practice area" if folded, then "Show Forests & fuels", then choose "Prescribed fire" | The path "Practice area › Forests & fuels", "1 project · 3 funders", "No performance measures yet" |
| 10 | Choose "Outline", then reload | The table shows and the address has no `#c:` or `#g:` end |
| 11 | Choose "Browse" again | Prescribed fire is still the record on the right and the address ends with its `#c:` name |
| 12 | Press "Open classification" after choosing Salmon & steelhead recovery in Browse | The classification's own page opens |

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-224 (proposed) — Folding a group that holds Browse's chosen row.
- Q-225 (proposed) — Does following a `#g:` or `#c:` link make Browse the remembered view?
- Q-226 (proposed) — Outline and back to Browse in one visit: what does the address say?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | ACN-1 |
| R2 | decided; shown | RUL-24; ACN-1 |
| R3 | decided; shown; proposed (Q-225) | RUL-24; STA-2; RUL-62 |
| R4 | decided | RUL-24 |
| R5 | proposed (Q-226) | ACN-1 |
| R6 | shown | SCR-3 |
| R7 | shown; shown | STA-10; RUL-61 |
| R8 | shown; shown; shown | STA-13; SCR-3; RUL-63 |
| R9 | shown; shown; decided | STA-13; ACN-8; RUL-24 |
| R10 | shown; decided; proposed (Q-224); shown | ACN-7; RUL-24; STA-13; RUL-62 |
| R11 | shown; shown | STA-11; ACN-9 |
| R12 | shown; shown | STA-12; ACN-9 |
| R13 | shown | ACN-9 |
| R14 | shown | STA-14 |
| R15 | decided | RUL-24 |
| R16 | decided (user, 2026-11-24, Q-235); decided (user, 2026-11-24, Q-234) | relies on story 15, RUL-95; relies on story 14, RUL-92 |

- Prototype files: `src/components/classifications/firma2-classification-index.astro` (the switch; before-first-paint script lines 36 to 49; `hashchange` and `change` handlers; storage key `firma2:classification-index:view`); `firma2-classification-browse.astro` (list 76 to 99, right side 101 to 160, script 349 to 390, `select()` and `paint()`); `src/data/firma2-classification-tree.ts` (`flatGroups`, `plural`); `firma2-kpi-progress.astro` (a measure line in full form); `src/pages/prototypes/classifications.astro`.
- Data shapes: the address end is `#g:<group slug>` or `#c:<classification slug>`; `data-detail` keys on the right pane are the same strings; the sub-heading of an inner group is its path below the chosen group joined by " › ".
- Do not copy: the remembered view kept in the browser's own storage (the product says where a reader's choice lives; whether it follows the reader across devices is the team's); the page built from the build's data; the bare-slug link form.

</details>
