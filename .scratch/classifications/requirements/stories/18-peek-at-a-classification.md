# 18 — Reader peeks at a classification from its row without leaving the list

Type: story
Epic: E-B Read progress against the tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-227
Revision: 1
Blocked by: 15, 17
Covers: SCR-4, STA-16, STA-17, ACN-5, ACN-10, RUL-64, RUL-65, RUL-87
Sources: `/prototypes/classifications` (Outline and Browse, the side-panel button on a classification); spec #9, #10
Snapshot: not yet captured
Read with: `../epics/E-B-read-progress.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R11 (R6 rests on the proposal Q-227; Browse parts need story 17, now in `Blocked by`).

## Story

As a reader, I want to open a classification's summary and every one of its performance measures in a panel beside the list, so that I can tell what a goal is made of and whether I need to open its page, without losing my place in the tree.

## Description

The Classifications page (story 15) lists every classification with a few counts and one ring per performance measure. The peek answers the next question: what is this goal made of, with how much work and money, and how far along is each measure. It sits beside the page, so the Outline or Browse view stays where it was. Its door leads on to the classification page (story 14). To see it: `/prototypes/classifications`, hover a classification row such as Salmon & steelhead recovery (F1.1), and press the side-panel button at the end of its name.

## Requirements

R1. Every classification row in the Outline carries a side-panel button, named "Preview <classification name>". In Browse the button sits on each classification listed under a chosen group; a classification chosen on its own shows no such button. A group's row has none. The button shows when the pointer is on its row or focus is in it, and is always visible on a device with no hover.

R2. The peek is closed until a side-panel button is pressed. Pressing one opens the peek beside the page; pressing the button of another classification while it is open replaces its content with that classification's, and the panel stays open.

R3. The peek's head shows the classification's name as a title that is a door to its page, led by the classification's icon (or its group's colour square when it has none; relies on story 15, RUL-95; proposed, Q-235), the name of the group the classification is in as a badge tinted with that group's colour under dark text, and a button "Open classification" that goes to the same page. A classification is always in a group, so the badge is always present; it names the group directly above the classification, not the whole path.

R4. Under the head the peek shows the classification's summary, the same as the top of its page (story 14): the description, then four figures: Projects ("of <N> in the portfolio"), Estimated cost ("Total across all years"), Spent to date ("<N>% of estimated cost") and Funders. Nothing in the peek is computed differently from the page.

R5. The peek has a section "Performance measures" that lists every performance measure the classification rolls up, with no cap: each measure any of its projects reports toward, linked or not, linked ones first (relies on story 14, RUL-92; proposed, Q-234), each as a ring, the measure's name, the full figure ("14.5 of 30 miles goal") and, as the page words them, "<N> not yet planned" or "No goal set". The figure, the ring and these notes follow story 14's rules (relies on story 14, STA-18 to STA-21, RUL-17). A measure no project reported shows "Not reported".

R6. A classification with no performance measures: the peek shows the head and the summary, and under the summary "No performance measures yet", as the page, the card and Browse do. (proposed, Q-227.)

R7. The peek holds only what is above. The projects, the funders and the year-by-year table are on the classification page, one door away (story 19, story 20). Every name in the peek is a door; the peek changes nothing.

R8. When the peek opens, keyboard focus moves to its title, which announces which classification opened. Escape, pressed with focus inside the peek, closes it. The close control, named "Close classification details" and in the panel's top corner, closes it. When it closes, focus returns to the side-panel button that opened it.

R9. A reader can drag the peek's inner edge to resize it, between 26rem and 45rem wide. The width is remembered for that reader.

R10. When the page is too narrow to hold the peek beside the list (a content area of 904 pixels or less), the peek opens under the page content, full width, without the resize edge, and keeps its close control.

R11. Opening the peek changes nothing behind it: the view (Outline or Browse), the chosen row in Browse and every fold stay as they were. Choosing another row in Browse does not change what the open peek shows.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The Outline and Browse themselves, their rows, folds and counts — see story 15 and story 17.
- How each performance measure's figure and ring are worked out — see story 14.
- The projects, the funders and Simple or Detailed — see stories 19, 20.
- The tooltip on a ring — see story 16.
- The project peek, which uses the same docked panel — owned by `projects-index`.
- Which projects the figures count for a Viewer with no organization — see story 22.

## Needs to know from elsewhere

- The summary's four figures, the figure wording per measure and the "not yet planned" rule are story 14's; the peek repeats them.
- A classification's colour in a list is its group's colour (spec #9); the badge tint is a light mix of that colour (spec #10).
- Which projects are counted is story 22's rule; the peek follows it.
- The docked panel itself (opening, closing, width memory) is a shared component of the product; this story states only what the reader sees.

## Scenarios

**S1 — The button is on classification rows only** (proves R1)
- Given Ada is on the Outline of F1
- When she moves the pointer over the row "Salmon & steelhead recovery" and then over the row "Plan goal"
- Then the first row shows a side-panel button named "Preview Salmon & steelhead recovery" and the group row "Plan goal" shows none

**S2 — The button in Browse** (proves R1)
- Given Ada has switched to Browse (story 17) and chosen the group "Forests & fuels"
- When she looks at the three classifications listed on the right
- Then each has a side-panel button; and when she chooses "Fuel breaks" in the list, its own detail shows no side-panel button

**S3 — No hover, button always visible** (proves R1)
- Given Ada uses a touch screen with no hover, on the Outline of F1
- When she looks at the row "Water quality"
- Then its side-panel button is visible without touching the row

**S4 — Opening the peek and swapping records** (proves R2)
- Given the peek is closed
- When Ada presses "Preview Salmon & steelhead recovery", then "Preview Water quality" on another row
- Then the peek opens beside the page showing Salmon & steelhead recovery, and then shows Water quality in the same open panel

**S5 — The head** (proves R3)
- Given the peek is open on "Fuel breaks"
- When Ada reads its head
- Then the title, led by its icon or colour square, reads "Fuel breaks", the badge reads "Forests & fuels" (not "Practice area"), and "Open classification" is present

**S6 — The summary matches the page** (proves R4)
- Given the peek is open on "Salmon & steelhead recovery"
- When Ada reads the summary
- Then it shows 11 Projects "of 24 in the portfolio", $19,507,000 Estimated cost, $10,904,000 Spent to date "56% of estimated cost", and 17 Funders (F4), the same as the top of that classification's page

**S7 — Every measure, uncapped** (proves R5)
- Given the peek is open on "Salmon & steelhead recovery", which tracks four performance measures (F2)
- When Ada reads "Performance measures"
- Then four measures are listed, including "14.5 of 30 miles goal" with a "not yet planned" line (F3.1) and "0 of 12 goal" (F3.2)

**S8 — Not reported, fully planned** (proves R5)
- Given the peek is open on "Wildfire resilience", then on "Fuel breaks"
- When Ada reads each measure
- Then Wildfire resilience shows "Not reported" for "Tons of biomass removed in fuels treatment" (F3.7), and Fuel breaks shows "9.2 of 9.2 miles planned" with no "not yet planned" line (F3.8)

**S9 — No performance measures** (proves R6)
- Given the peek is open on "Prescribed fire" (F3.11)
- When Ada reads it
- Then the title, the badge "Forests & fuels", the description and the four figures show (1 Project, $9,640,000, $4,434,500 "46% of estimated cost", 3 Funders), and under them "No performance measures yet"

**S10 — The peek only reads** (proves R7)
- Given the peek is open on "Salmon & steelhead recovery"
- When Ada looks for projects, funders or a year table in it
- Then there are none; the title and "Open classification" both go to the classification page

**S11 — Focus, Escape, close** (proves R8)
- Given Ada opened the peek with the keyboard, from the button on "Water quality"
- When the peek opens, then she presses Escape, then opens it again and presses "Close classification details"
- Then focus lands on the title when it opens; after each close, focus is back on the button on the Water quality row

**S12 — Resizing** (proves R9)
- Given the peek is open at its default width
- When Ada drags its edge towards the page until it stops, reloads the page and opens the peek again
- Then it stopped at 45rem, and after reloading it opens at the width she left

**S13 — A narrow page** (proves R10)
- Given Ada's content area is 800 pixels wide
- When she opens the peek
- Then it appears under the list at full width, has no resize edge and shows "Close classification details"

**S14 — The page behind does not move** (proves R11)
- Given Ada is on Browse with "Forests & fuels" chosen and the peek is open on "Water quality"
- When she chooses "Runoff & groundwater" in the list
- Then the right side switches to Runoff & groundwater and the peek still shows Water quality

## UAT script

Preconditions: Ada (F5) is signed in; the workspace holds the tree F1.
Test data: F1, F2, F3.1, F3.2, F3.7, F3.8, F4 (Salmon & steelhead recovery, Wildfire resilience, Fuel breaks, Prescribed fire).
Reset: none needed.

| # | Do this | You should see |
|---|---|---|
| 1 | Open Classifications. Move the pointer over the row "Salmon & steelhead recovery". | A side-panel button appears at the end of its name. |
| 2 | Move the pointer over the row "Plan goal". | No side-panel button. |
| 3 | Press the button on "Salmon & steelhead recovery". | A panel opens beside the page. Its title is "Salmon & steelhead recovery", a badge reads "Plan goal", and "Open classification" is present. The keyboard cursor is on the title. |
| 4 | Read the four figures. | 11 Projects "of 24 in the portfolio"; $19,507,000; $10,904,000 "56% of estimated cost"; 17 Funders. |
| 5 | Scroll to "Performance measures". | Four measures with rings; one reads "14.5 of 30 miles goal" with a "not yet planned" line, another "0 of 12 goal". |
| 6 | Press the button on "Wildfire resilience". | The panel stays open and now shows Wildfire resilience; one measure reads "Not reported". |
| 7 | Press Escape. | The panel closes and the cursor is back on the Wildfire resilience button. |
| 8 | Open the panel again, then press "Close classification details". | The panel closes. |
| 9 | Open the panel on any row. Drag its inner edge to the left as far as it goes, then to the right as far as it goes. | It stops at a narrowest and a widest width; it never covers the whole page. |
| 10 | Reload and open the panel. | It opens at the width you left it. |
| 11 | Press "Open classification" in the panel. | The classification's own page opens. |
| 12 | Back on the list, open the panel on "Prescribed fire". | Title, badge "Forests & fuels", description, four figures, and "No performance measures yet" under them. |
| 13 | Switch to Browse, choose "Forests & fuels", and look at the right side. | Each of its three classifications has a side-panel button. Choose "Fuel breaks" in the list: its detail has no such button. |
| 14 | Make the window narrower than about 900 pixels and open the panel. | It opens below the list at full width, with a close control and no drag edge. |

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-227 (proposed) — What does the peek show for a classification with no performance measures?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | ACN-5; RUL-87 |
| R2 | shown | STA-16 |
| R3 | shown; decided; decided (user, 2026-11-24, Q-235) | STA-17; relies on story 15, RUL-6; relies on story 15, RUL-95 |
| R4 | shown | STA-17; SCR-4 |
| R5 | shown; decided (user, 2026-11-24, Q-234) | STA-17; relies on story 14, RUL-92 |
| R6 | proposed (Q-227) | STA-17 |
| R7 | shown | STA-17 |
| R8 | shown | ACN-10 |
| R9 | shown | ACN-10 |
| R10 | shown | RUL-64 |
| R11 | shown | RUL-65 |

- Build gap: the prototype's peek head does not show the icon yet (RUL-95).
- Prototype files: `src/components/classifications/firma2-classification-peek.astro`, `src/components/shared/firma2-rail.astro` (`closes` mode, `unpinAt` 904, `floor` 26rem, `min` 416, `max` 720), `src/lib/record-peek.ts` (open, focus on name, Escape, focus back to opener), `src/components/projects/firma2-project-peek-button.astro` (`kind="classification"`), `src/components/classifications/firma2-classification-summary.astro`, `firma2-kpi-progress.astro`, `src/lib/kpi-row.ts`.
- Data shapes: one record per classification: name, group name, group colour, link, summary figures, measures with reported, planned, goal and year.
- Do not copy: the peek is painted from this browser's saved edits and one hidden template per classification (a static-site device); the built product reads the saved tree. The width memory is per browser in the prototype; the product keeps it per reader.

RUL-87 says a chosen classification's row in the list has a side-panel button; the prototype's code puts it only on the right-hand side (`firma2-classification-browse.astro:109-118`). R1 follows the code; see the report.

</details>
