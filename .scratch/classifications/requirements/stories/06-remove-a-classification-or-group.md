# 06 — Administrator removes a classification or group nothing depends on

Type: story
Epic: E-A Set up and arrange the classification tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-207, Q-208
Revision: 1
Blocked by: 02
Covers: SCR-14, STA-36, STA-37, STA-40, STA-41, ACN-38, RUL-8, RUL-38, RUL-53
Sources: `/prototypes/workspace-settings/classifications/<classification>` and `/groups/<group>` (the "Danger zone"); spec #21; Q-153, Q-196
Snapshot: not yet captured
Read with: `../epics/E-A-set-up-the-tree.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R12 (R9's added sentence and R12 rest on proposals Q-207 and Q-208).

## Story

As an administrator, I want to remove a classification or a group that nothing depends on, so that the tree holds only what the workspace still files projects under.

## Description

Removal is the last step of keeping the tree tidy. It is offered only when it costs nothing: a classification no project carries, or a group that holds no classification and no group. Otherwise the button is off and the page says what to do first. The record's own settings page (story 03 for a classification, story 04 for a group) carries a "Danger zone" with the one act. See it on the prototype at Workspace settings › Classifications, then a record's name: "Native planting" (in use), a classification added with story 02 (not in use), "Plan goal" (a group that holds classifications), "Practice area" (holds only groups), and an empty group added with story 02 (F7).

## Requirements

R1. A classification's settings page and a group's settings page each end with a "Danger zone" holding one row: the title "Remove this classification" or "Remove this group", a line that says whether it can be removed, and the button "Remove". The button is described by that line, so assistive technology reads the reason with it.

R2. A classification is in use when any project carries it, in any stage and whether or not the project is published. The number in the messages counts those projects.

R3. For a classification in use, "Remove" is off and the line reads "Take it off its <N> projects first.", or "Take it off its project first." when N is 1.

R4. For a classification no project carries, the line reads "No project works toward this goal." and "Remove" is on.

R5. For a group that holds one or more classifications directly, "Remove" is off and the line reads "Move its <N> classifications to another group first.", or "Move its classification to another group first." when N is 1. Only the classifications directly in the group are counted, not those in groups inside it.

R6. For a group that holds no classification but holds one or more groups, "Remove" is off and the line reads "Move or remove the <N> groups inside it first.", or "Move or remove the group inside it first." when N is 1. A group that holds both classifications and groups shows the line of R5: the classifications are named first, and the line of R6 shows once they are gone.

R7. For a group that is the only group in the workspace and holds nothing, "Remove" is off and the line reads "The last group can’t be removed." (curved apostrophe).

R8. For a group that holds nothing and is not the last group, the line reads "Nothing is in this group." and "Remove" is on.

R9. Pressing an enabled "Remove" opens a question headed "Remove <name>?", whose message is the line of R4 or R8, with the buttons "Remove" and "Cancel". When the classification has performance measures linked, the message adds "Its <N> goal targets and measure links are removed too." The measures' figures are not lost: the pages keep showing a measure that projects report toward, reading "No goal set" (proposed, Q-207, Q-234). Focus starts on "Cancel". "Cancel" or Escape closes it and changes nothing.

R10. Confirming with "Remove" removes the record and goes to Workspace settings › Classifications, where it is no longer listed. A removed classification's performance-measure links and goal targets go with it. A removed group leaves its parent's list, and the other rows keep their order. The record's reading pages no longer list it (story 23 says what its old address shows).

R11. A record that is not in use or empty is removed by one confirmed act: there is no second question and no way to undo; a person puts the tree back by adding the record again (standing requirement SR-6).

R12. The rule of R3 to R8 is checked again when "Remove" is confirmed. If a project has since been filed under the classification, or something was moved into the group, nothing is removed and the page shows the reason line that now applies. (proposed, Q-208)

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Taking a classification off its projects, or moving what a group holds — see the project record and story 08 (move) and story 12 (convert a group, keeping or removing what it held).
- Removing a group together with what it holds ("Remove them") — see story 12.
- What a removed record's old address shows — see story 23.
- Who sees the "Danger zone" — see story 13.

## Needs to know from elsewhere

- Which projects carry a classification is the project record's and project intake's (`project-record`, `project-intake`); this story reads the number only.
- Every removal is written to the change log with who and when (SR-6).
- A classification must always sit in a group (spec #25), which is why a group that holds one cannot go.

## Scenarios

**S1 — A classification in use cannot be removed** (proves R1, R2, R3)
- Given "Native planting" (F7), carried by 2 projects
- When the administrator opens its settings page
- Then the "Danger zone" reads "Remove this classification" and "Take it off its 2 projects first.", and "Remove" is off
- And for "Prescribed fire" (F2, 1 project) the line reads "Take it off its project first." with "Remove" off

**S2 — A classification nobody works toward** (proves R4)
- Given a classification added with story 02 that no project carries
- When the administrator opens its page
- Then the line reads "No project works toward this goal." and "Remove" is on

**S3 — Cancel and Escape change nothing** (proves R9)
- Given the page of S2
- When the administrator presses "Remove", then "Cancel"
- Then the question "Remove <name>?" closes, with focus on "Cancel" while it was open, and the classification is still in the list
- And when the question is opened again and the administrator presses Escape, it closes and the classification is still listed

**S4 — Confirm removes** (proves R10, R11)
- Given the page of S2
- When the administrator presses "Remove" and then "Remove" in the question
- Then the administrator is on Workspace settings › Classifications and the classification is no longer listed, with no further question

**S5 — A group that holds classifications** (proves R5)
- Given "Plan goal" (F1.1), which holds 7 classifications, and "Forests & fuels", which holds 3
- When the administrator opens each page
- Then "Plan goal" reads "Move its 7 classifications to another group first." and "Forests & fuels" reads "Move its 3 classifications to another group first."; "Remove" is off on both

**S6 — A group that holds only groups** (proves R6)
- Given "Practice area" (F1.2), which holds 4 groups and no classification
- When the administrator opens its page
- Then the line reads "Move or remove the 4 groups inside it first." and "Remove" is off

**S7 — A group that holds both** (proves R5, R6)
- Given "Plan goal" with a group added inside it by story 02 (F9), so it holds 7 classifications and 1 group
- When the administrator opens its page
- Then the line is the one of S5, "Move its 7 classifications to another group first."

**S8 — An empty group** (proves R8, R9, R10)
- Given an empty top-level group added with story 02 (F7)
- When the administrator presses "Remove" and then "Remove" in the question headed "Remove <name>?" whose message is "Nothing is in this group."
- Then the list no longer shows the group and the other groups keep their order

**S9 — The last group** (proves R7)
- Given a workspace whose only group is empty (F9, an empty workspace with one group added)
- When the administrator opens that group's page
- Then the line reads "The last group can’t be removed." and "Remove" is off

**S10 — Checked again at confirm** (proves R12)
- Given the question open on a classification no project carries, and a project then filed under it by someone else
- When the administrator presses "Remove" in the question
- Then nothing is removed and the page shows "Take it off its project first."

**S11 — The question names what goes too** (proves R9, R10)
- Given a classification with two performance measures linked and no project (F9)
- When the administrator presses "Remove"
- Then the question says "Its 2 goal targets and measure links are removed too."; after confirming, its links and goal targets are gone

## UAT script

Preconditions: Ada (Administrator, F5) is signed in. The tree is F1. Step 12 needs a workspace whose only group is empty; skip it if the test workspace cannot be made so.
Test data: F1; Native planting (F7); Prescribed fire (F2); Plan goal, Practice area (F7); a classification and an empty top-level group the tester adds with story 02, named by the tester.
Reset: restore the test workspace's saved tree (F1).

| # | Do this | You should see |
|---|---|---|
| 1 | Open Workspace settings › Classifications and select "Native planting"; scroll to the end | "Remove this classification", "Take it off its 2 projects first.", and "Remove" off |
| 2 | Go back and select "Prescribed fire" | "Take it off its project first." |
| 3 | Go back. Use "Add" on "Vegetation & wetlands" to add a classification, type a name and press Enter; select it | "No project works toward this goal." and "Remove" on |
| 4 | Press "Remove" | A question headed "Remove <name>?" with "Remove" and "Cancel"; the focus is on "Cancel" |
| 5 | Press "Cancel", go back to the list | The classification is still there |
| 6 | Select it again, press "Remove", then "Remove" in the question | You are on Workspace settings › Classifications and the classification is gone |
| 7 | Select "Plan goal" and scroll to the end | "Move its 7 classifications to another group first." and "Remove" off |
| 8 | Go back and select "Practice area" | "Move or remove the 4 groups inside it first." and "Remove" off |
| 9 | Go back. Use "Add group" in the page header to add a top-level group, type a name, press Enter, select it | "Nothing is in this group." and "Remove" on |
| 10 | Press "Remove", then "Remove" in the question | The list, without the group |
| 11 | Open "Plan goal"'s "Add", choose "Group", add a group inside it, then open "Plan goal"'s page | Still "Move its 7 classifications to another group first." |
| 12 | (workspace with one empty group) Open that group | "The last group can’t be removed." and "Remove" off |
| 13 | (classification with two measures linked, no project) Press "Remove" | The question adds "Its 2 goal targets and measure links are removed too." |

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-207 (proposed) — Does the remove confirm name the performance measures and goal targets that go with a classification?
- Q-208 (proposed) — Is the removal rule checked again when "Remove" is confirmed?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | SCR-14 |
| R2 | decided | RUL-38 |
| R3 | shown | STA-36 |
| R4 | shown | STA-37; RUL-8 |
| R5 | shown | STA-40 |
| R6 | shown | STA-40 |
| R7 | shown | STA-41 |
| R8 | shown | RUL-8 |
| R9 | shown; proposed (Q-207); decided (Q-234) | SCR-14; RUL-53 |
| R10 | shown; shown | ACN-38; RUL-53 |
| R11 | shown | ACN-38 |
| R12 | proposed (Q-208) | RUL-8 |

- Prototype files: `src/components/settings/firma2-taxonomy-danger-zone.astro` (the act and its messages), `src/lib/taxonomy-edits.ts` (`removeEntry`, `groupRemovalBlock`, `classificationsIn`, `groupsIn`), `src/pages/prototypes/workspace-settings/classifications/[classification].astro` and `groups/[group].astro` (where it sits).
- Data shapes: an entry is a name, a description, a colour and the group it is in (empty for the top level); a removed classification also drops its links and goal targets, and a removed group drops its two lists' order.
- Do not copy: browser storage of removals ("removed" lists); the "in use" number computed when the page is built (the built product counts live); draft routes for records added in the browser; the group's block being worked out only when the page opens (R12: the rules hold when the person acts).

</details>
