# 05 — Administrator sets a goal for a performance measure on a classification

Type: story
Epic: E-A Set up and arrange the classification tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-204, Q-205, Q-206
Revision: 1
Blocked by: 03
Covers: OBJ-3, OBJ-4, STA-38, STA-39, ACN-35, ACN-36, ACN-37, RUL-20, RUL-21, RUL-22, RUL-39, RUL-52, RUL-93
Sources: `/prototypes/workspace-settings/classifications/<classification>` (the "Performance measures" section); spec #4, #24; Q-197
Snapshot: not yet captured
Read with: `../epics/E-A-set-up-the-tree.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R13 (R4, R6, R10, R12 and R13 rest on proposals Q-204, Q-206 and Q-205).

## Story

As an administrator, I want to choose the performance measures I can set a goal for on a classification and set each goal, so that readers can see how far along the classification is.

## Description

This is the second half of setting a classification up: story 03 gives it a name, a description and a group; this story says which performance measures it has a goal for (linking one means "set a goal for it here") and what the workspace means to reach on each. The pages show every measure its projects report toward, linked or not; an unlinked one reads "No goal set" (Q-234). The performance measures come from the catalog (defined in the Performance measures feature) and are never made here. A goal target is a number and a year on one measure for one classification; the reading pages (story 14) draw each goal and the progress toward it from what is set here. See it on the prototype at Workspace settings › Classifications, then a classification's name: use "Invasive plant removal" (F7, F3.11) to start from nothing and "Salmon & steelhead recovery" (F3.2) to see a measure that already has a goal.

## Requirements

R1. A classification's settings page has a section "Performance measures" with one row per linked measure, that is, per measure that has a place for a goal here. A row shows the measure's name, a line under it with its unit ("Count" for a measure counted in each, "Percent" for a percentage, otherwise "In <unit>", for example "In acres"), the field "Goal target", the field "Due by", and the button "Stop tracking".

R2. When no measure is linked the section shows "No performance measures yet" and, under it, the choice "Add a performance measure" (placeholder "Choose a measure"). The choice is shown whether or not any measure is linked.

R3. Choosing a measure in "Add a performance measure" links it to the classification at once. Its row joins the end of the rows with "Goal target" and "Due by" empty, the measure leaves the choice, and the choice returns to its placeholder. Nothing can be created here: the choice offers only measures from the catalog.

R13. Linking a measure only sets where a goal can be set on this classification; it does not decide whether the measure is shown. The pages show every measure that projects under the classification report toward, linked or not, a linked one first. (decided, Q-234)

R4. The choice offers only catalog measures that have a name, are not retired and are not already linked to this classification. A measure can be linked to a classification once. When every such measure is linked the choice stays and says "Every performance measure is already tracking this classification"; there is nothing to pick. (proposed, Q-204)

R5. A goal target is two facts on one measure: a number ("Goal target") and a year ("Due by"). Both are saved together when the person leaves either field. There is one goal target and one due year per measure; interim targets per year are not part of this feature.

R6. "Goal target" takes a number above zero, in the measure's own unit; a comma typed in it is ignored. The saved number is shown back as digits. Anything else ("0", a negative number, letters) is not saved: the field shows "Enter a number above zero." and the goal target already saved, if any, stands. A number above 1,000,000,000 is not saved: the field shows "Enter a number up to 1,000,000,000." The number is kept to the measure's own number of decimals. (proposed, Q-206)

R7. "Due by" takes a whole-number year from this year to fifty years on. When "Goal target" holds a valid number and "Due by" is empty, the year becomes five years from this year and is shown in the field. A year outside the range, or not a whole number, is not saved: "Due by" shows "Enter a year from <this year> to <this year + 50>." and the goal target already saved, if any, stands. The two fields do not show an error at once for one entry: the number is checked first.

R8. When either field is invalid, nothing is saved from that entry: a valid number typed beside an invalid year is not kept, and the earlier goal target, if there was one, is what readers see.

R9. Clearing "Goal target" and leaving the field clears the goal target and empties "Due by". The measure stays linked, without a goal: the reading pages measure it against what projects have planned and say "No goal set" (relies on story 14, F3.6). A year typed with no number is not kept.

R10. "Stop tracking" removes the measure's goal target and its link at once, with no question asked. The measure's figures are not lost: while projects report toward it, the pages still show it, now reading "No goal set" (decided, Q-234). The row leaves, "No performance measures yet" shows if it was the last, and the measure is offered in the choice again. Linking it again starts with no goal target.

R11. Linking, setting, changing, clearing and unlinking each save when they are made, one at a time (standing requirement SR-7); nothing waits for a button.

R12. A measure that is retired in the catalog while linked leaves the reading pages and is not offered in the choice. Its link and goal target are kept, so when the measure is brought back both return as they were. Its row stays in the editor, marked "Retired", so the administrator can still change its goal target or "Stop tracking" it. (decided, not built; row proposed, Q-205)

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Naming a classification, its description, group and colour — see story 03.
- Defining, renaming or retiring a performance measure — owned by the Performance measures feature.
- How the rings, shares and "not yet planned" lines read once a goal is set — see story 14 and story 15.
- Controls shown only to people the setting lets in — see story 13.
- Removing the classification and the links it holds — see story 06.

## Needs to know from elsewhere

- The catalog is the Performance measures feature's: each measure has a name, a unit, a counting rule and a status (Retired or not). This story reads it and never writes it.
- A group has no performance measures or goal targets of its own (spec #4); a classification turned into a group loses them (story 11).
- Every change here is written to the change log with who and when (SR-6); where it is shown belongs to `updates-feed`.

## Scenarios

**S1 — Nothing linked yet** (proves R2)
- Given Invasive plant removal (F7), which has no performance measures
- When the administrator opens its settings page
- Then the "Performance measures" section shows "No performance measures yet" and the choice "Add a performance measure"

**S2 — Link a measure from the catalog** (proves R1, R3, R4)
- Given the page of S1 and the catalog of F8
- When the administrator opens "Add a performance measure" and picks "Native plants installed"
- Then a row for it shows the line "In plants", empty "Goal target" and "Due by", and "Stop tracking"; "Native plants installed" is no longer in the choice; the choice shows "Choose a measure"

**S3 — Set a goal target** (proves R5, R6, R11)
- Given the row of S2
- When the administrator types 20000 in "Goal target", a year three years from now in "Due by", and leaves the field
- Then no save button is pressed and no error shows; after the page is opened again both values are there, and the row has no other target fields

**S4 — A blank year is filled in** (proves R7)
- Given a linked measure with both fields empty
- When the administrator types 20000 in "Goal target" and leaves it
- Then "Due by" shows the year five years from this year, and both survive a reload

**S5 — A number that is not above zero** (proves R6, R8)
- Given a measure with a saved goal target of 20000
- When the administrator types 0 in "Goal target" and leaves it
- Then "Goal target" shows "Enter a number above zero."; after a reload the field shows 20000 again

**S6 — A year out of range** (proves R7, R8)
- Given the same measure
- When the administrator types a year sixty years from now in "Due by" and leaves it
- Then "Due by" shows "Enter a year from <this year> to <this year + 50>."; after a reload the earlier year shows

**S7 — Clearing the goal target** (proves R9)
- Given a measure with a saved goal target and year
- When the administrator empties "Goal target" and leaves it
- Then "Due by" is empty too, the row stays, and after a reload both are still empty
- And when the administrator instead types only a year in "Due by" with "Goal target" empty and leaves it, "Due by" is emptied and nothing is saved

**S8 — Stop tracking removes the goal** (proves R10)
- Given a linked measure with a goal target
- When the administrator presses "Stop tracking"
- Then the row leaves at once with no question, and the measure is in the choice again; where projects report toward it, the Classifications pages still show it, reading "No goal set" (story 14)
- And when the administrator links the same measure again, its "Goal target" and "Due by" are empty

**S9 — A retired measure is not offered** (proves R4, R12)
- Given a catalog measure that is marked Retired and not linked
- When the administrator opens the choice
- Then that measure is not in it
- And with every catalog measure linked (F9), the choice says "Every performance measure is already tracking this classification" and offers nothing

**S10 — A retired measure keeps its link and goal** (proves R12)
- Given a linked measure with a goal target, which the catalog then retires (F9, a retired measure that is linked)
- When the administrator opens the classification's page
- Then its row is there, marked "Retired", with its goal target, and "Stop tracking" works; once the measure is brought back the row is as before, without the mark

**S11 — An unlinked measure still shows** (proves R13)
- Given Salmon & steelhead recovery, where projects report toward "Volunteer hours contributed" and no goal is set for it (F3.12)
- When the administrator opens its settings page and then the Classifications page (story 14)
- Then the settings page has no row for that measure, and the Classifications page shows it after the linked measures, reading "No goal set"

**S12 — A number that is too large** (proves R6)
- Given a linked measure
- When the administrator types 1000000001 in "Goal target" and leaves it
- Then the field shows "Enter a number up to 1,000,000,000." and nothing is saved

## UAT script

Preconditions: Ada (Administrator, F5) is signed in. The tree is F1. Steps 11 and 12 need story 14 built.
Test data: F1; Invasive plant removal (F7, F3.11); the catalog measure "Native plants installed" (F8); Salmon & steelhead recovery, its measure "Fish passage barriers removed" (F3.2).
Reset: restore the test workspace's saved tree (F1); unlink anything linked here.

| # | Do this | You should see |
|---|---|---|
| 1 | Open Workspace settings › Classifications and select "Invasive plant removal" | Its page, with a "Performance measures" section reading "No performance measures yet" and "Add a performance measure" |
| 2 | Open "Add a performance measure" and pick "Native plants installed" | A row: the name, "In plants", empty "Goal target" and "Due by", and "Stop tracking"; the measure is gone from the choice |
| 3 | Type 20000 in "Goal target" and press Tab | "Due by" fills with the year five years from this year, no error |
| 4 | Change "Due by" to the year two years on from that and press Tab; reload the page | Both values are still there after the reload |
| 5 | Type 0 in "Goal target" and press Tab | "Enter a number above zero." under the field |
| 6 | Reload the page | "Goal target" shows 20000 again |
| 7 | Type a year sixty years from now in "Due by" and press Tab | "Enter a year from <this year> to <this year + 50>." under "Due by" |
| 8 | Empty "Goal target" and press Tab | "Due by" empties; the row stays |
| 9 | Press "Stop tracking" | The row leaves; "No performance measures yet" shows; "Native plants installed" is in the choice again |
| 9a | Type 1000000001 in "Goal target" of any linked measure and press Tab | "Enter a number up to 1,000,000,000." |
| 10 | Open "Salmon & steelhead recovery" | "Fish passage barriers removed" with "Goal target" 12 |
| 11 | (needs story 14) Open Classifications, then the peek or page of Salmon & steelhead recovery | The ring and "0 of 12 goal" for that measure |
| 11b | Link a measure that the catalog has since retired (F9) — open its classification | Its row is there, marked "Retired", with its goal target and "Stop tracking" |
| 12 | (needs story 14) Back in settings, change that "Goal target" to 24 and reload the reading page | "0 of 24 goal" |

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-204 (proposed) — What does "Add a performance measure" show when every measure in the catalog is already linked?
- Q-205 (proposed) — When a linked performance measure is retired, does its row stay in the editor?
- Q-206 (proposed) — How large may a goal target be, and how many decimals does it keep?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | OBJ-4 |
| R2 | shown | STA-38 |
| R3 | shown | ACN-35; OBJ-4 |
| R4 | decided; proposed (Q-204) | RUL-21; RUL-21 |
| R5 | shown; shown | OBJ-3; ACN-36 |
| R6 | shown; proposed (Q-206) | RUL-20; RUL-20 |
| R7 | shown | RUL-20 |
| R8 | shown; shown | ACN-36; RUL-52 |
| R9 | shown; shown; shown | STA-39; RUL-20; RUL-52 |
| R10 | shown; shown; decided (user, 2026-11-24, Q-234) | ACN-37; OBJ-3; RUL-93 |
| R11 | shown | ACN-36 |
| R12 | decided, not built; proposed (Q-205) | RUL-39; RUL-39 |
| R13 | decided (user, 2026-11-24, Q-234) | RUL-93 |
| R5 | decided | RUL-22 |

- Prototype files: `src/components/settings/firma2-classification-kpi-editor.astro` (the section; value and year checks are in its script), `src/lib/taxonomy-edits.ts` (`kpiSlugs`, `linkKpi`, `unlinkKpi`, `targetsFor`, `setTarget`), `src/pages/prototypes/workspace-settings/classifications/[classification].astro` (where it sits), `src/data/firma2-performance-measures.ts` (the catalog), `src/data/firma2-classifications.ts` (seeded targets).
- Data shapes: a link is a measure; a goal target is `{ measure, value, year }`, one per measure per classification; unlinking drops its target.
- Behavior read from the code: a year entered alone empties on save; both fields are checked before either is kept; the unit line is "Count", "Percent" or "In <unit>"; linked rows are kept in the order linked, seeded ones first.
- Do not copy: browser storage of links and targets; the measures made in the browser (`measure-draft`) that can be linked here; "KPI" in comments and file names (visible wording says performance measures); the editor rendering a retired linked measure's raw identifier as its name (R12 says what it does).

</details>
