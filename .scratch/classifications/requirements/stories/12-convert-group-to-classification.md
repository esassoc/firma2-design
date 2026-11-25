# 12 — Administrator turns a group into a classification, keeping or removing what it held

Type: story
Epic: E-A Set up and arrange the classification tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-213, Q-215
Revision: 1
Blocked by: 08, 11
Covers: SCR-13, STA-45, ACN-23, ACN-25, RUL-10, RUL-41, RUL-85
Sources: `/prototypes/workspace-settings/classifications`; spec #21, #25, #29; interview 2026-11-24, Q-185
Snapshot: not yet captured
Read with: `../epics/E-A-set-up-the-tree.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R10. Waiting: nothing; R5 and R8 rest on proposals (Q-215, Q-213, Q-235).

## Story

As the person who may change classifications, I want to turn a group into a classification and choose what happens to what it held, so that a heading that turns out to be a single goal does not leave an empty branch or lose work I meant to keep.

## Description

The reverse of story 11. A group inside another group can become a classification of the same name, colour and description, in the same place. If the group holds anything, the person is asked what becomes of it: kept, moved up to where the group was, or removed. Removal is offered only when nothing beneath is in use, because removing a classification on its own is refused while a project works toward it, and a conversion must not delete what a removal would refuse to. A top-level group has no such item. To see it in the prototype, open `/prototypes/workspace-settings/classifications` with the tree in F1 and open the "…" menu of "Forests & fuels".

## Requirements

R1. A group's "…" menu (accessible name "Actions for <group name>") offers "Sort A to Z" and, after a divider, "Convert to classification". A top-level group's menu offers only "Sort A to Z": a classification cannot stand at the top level, so there is nowhere for it to become one.

R2. A group that holds no classification and no group is converted at once, with no question.

R3. A group that holds anything asks first, before anything changes. The question is titled "Convert <group name> to a classification?" and says what the group holds, counting everything beneath it at any depth (the count reaches every depth, while "Keep them" moves only what is directly inside, R4): "It holds <N> classifications and <M> groups." (only the kinds present; "1 classification", "1 group"). Its choices are "Keep them", "Remove them" (when R5 allows) and "Cancel".

R4. "Keep them": what is directly inside the group moves up to the group the converted group was in, one level, and keeps its own contents. Classifications become classifications of that group, groups become groups of it. Everything the group held stays as it was, in use or not.

R5. "Remove them" is offered only when no classification beneath the group, at any depth, is in use by a project. When one or more are, the question reads "<N> classifications beneath <name> are in use by projects, so they can't be removed. Keep them, or cancel." and offers only "Keep them" and "Cancel"; the classifications are not listed by name.

R6. "Remove them": every group and every classification beneath the group, at any depth, is removed, with its performance measures and goal targets. Nothing a project works toward is ever removed this way (R5).

R7. "Cancel", Escape, or closing the question changes nothing: the group stays a group, with everything it held.

R8. When the conversion goes ahead, the group becomes a classification of the same name, colour, description and icon (if it has one), in the group it was in. It has no projects and no performance measures yet; its row shows 0 and 0, and its "…" menu offers "Convert to group". The group it was in counts it among its classifications. The new classification, and the rows kept from the group, join the end of their lists in the group it stood in; "place" means that group, and Sort A to Z puts them in order. (relies on story 11, RUL-83)

R9. A conversion is refused when a classification already has the name, ignoring case and spaces at the ends, checked before any question (relies on story 11, RUL-84): "A classification already has this name." shows under the group's line, nothing changes, and no question is asked first, whether or not the group holds anything. The message goes away at the next change to the list.

R10. The page announces "<name> is now a classification." once when the conversion goes ahead.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Turning a classification into a group, and the drop row for taking a classification out of every group — see story 11.
- Removing a group on its own, and what "in use" counts — see story 06.
- Moving a group, or its contents, with the grip menu or by dragging — see stories 08 and 09.
- A top-level group's own "Convert to classification": none exists (R1), and nothing is open about it.

## Needs to know from elsewhere

- A classification is in use when any project carries it, in any stage, published or not — owned by story 06 (RUL-38).
- Names are unique among classifications and, separately, among groups; so kept rows never clash with their new neighbours — owned by story 02.
- Inside a group the classifications come before its groups — owned by story 07 (RUL-7).
- A folded group is converted like an open one; the question counts what is hidden — owned by story 10.
- Every conversion and removal is recorded in the change log; there is no undo — standing requirement SR-6.

## Scenarios

**S1 — A top-level group has no conversion** (proves R1)
- Given the tree in F1
- When the person opens the "…" menu of Plan goal, then of "Forests & fuels"
- Then Plan goal's menu has only "Sort A to Z"; "Forests & fuels" has "Sort A to Z", a divider and "Convert to classification"

**S2 — An empty group converts at once** (proves R2, R8, R10)
- Given the F9 empty group inside Practice area
- When the person chooses "Convert to classification" on it
- Then no question is asked; it is a classification inside Practice area with the same name, reading 0 projects and 0 performance measures; the page announces "<name> is now a classification."; Practice area reads "13 classifications"

**S3 — A group that holds things asks, counting all depths** (proves R3)
- Given the F9 group "<G>" inside Practice area that holds two classifications no project works toward and a group "<H>" that holds one such classification (made with story 02)
- When the person chooses "Convert to classification" on "<G>"
- Then a question titled "Convert <G> to a classification?" says "It holds 3 classifications and 1 group." with the buttons "Keep them", "Remove them" and "Cancel"; nothing has changed

**S4 — Keep them: moved up one level** (proves R4, R8)
- Given the question of S3 is open
- When the person presses "Keep them"
- Then "<G>" is a classification in Practice area; its two classifications are classifications of Practice area; "<H>" is a group of Practice area and still holds its one classification

**S5 — Remove them** (proves R6)
- Given the question of S3 is open
- When the person presses "Remove them"
- Then "<G>" is a classification in Practice area and the two classifications, "<H>" and its classification are gone; Practice area reads "13 classifications"

**S6 — Something beneath is in use: no removal** (proves R5)
- Given the tree in F1
- When the person chooses "Convert to classification" on "Forests & fuels"
- Then the question reads "3 classifications beneath Forests & fuels are in use by projects, so they can't be removed. Keep them, or cancel." and offers only "Keep them" and "Cancel"

**S7 — Keep, with classifications in use** (proves R4)
- Given the question of S6 is open
- When the person presses "Keep them"
- Then "Forest thinning", "Fuel breaks" and "Prescribed fire" are classifications of Practice area with their projects (1, 1 and 1) and measures (1, 1 and 0) unchanged, and "Forests & fuels" is a classification there too

**S8 — Cancel changes nothing** (proves R7)
- Given the question of S6 is open
- When the person presses "Cancel", then reopens it and presses Escape
- Then "Forests & fuels" is still a group with its three classifications, both times; the same after a reload

**S9 — A classification already has the name** (proves R9)
- Given a group named "Water quality" added inside Practice area, holding nothing, and the classification "Water quality" in Plan goal
- When the person chooses "Convert to classification" on the group
- Then "A classification already has this name." shows under the group's line, no question is asked, and the group is unchanged

**S10 — The refusal comes before the question** (proves R9)
- Given a group named "Water quality" added inside Practice area that holds one classification
- When the person chooses "Convert to classification" on it
- Then the same message shows and no question is asked

## UAT script

Preconditions: signed in as Ada (an Administrator); the test workspace holds the tree in F1; inside Practice area the script adds (story 02) a group, call it G, holding two classifications and a group H that holds one classification; none of the added classifications is used by a project.
Test data: F1, F1.2, F7 ("A group the script adds", "A classification the script adds").
Reset: restore the test workspace's saved tree (F1).

| # | Do this | You should see |
|---|---|---|
| 1 | Open Settings › Classifications and open the "…" menu of Plan goal. | Only "Sort A to Z". |
| 2 | Open the "…" menu of G. | "Sort A to Z", a divider, "Convert to classification". |
| 3 | Choose "Convert to classification". | A question "Convert G to a classification?" saying "It holds 3 classifications and 1 group." with "Keep them", "Remove them", "Cancel". |
| 4 | Press "Cancel". | Nothing changed. |
| 5 | Repeat step 3 and press "Keep them". | G is a classification in Practice area; its two classifications sit in Practice area; H is a group there holding its classification. |
| 6 | Open the "…" menu of "Forests & fuels" and choose "Convert to classification". | A question reading "3 classifications beneath Forests & fuels are in use by projects, so they can't be removed. Keep them, or cancel." with only "Keep them" and "Cancel". |
| 7 | Press "Cancel". | "Forests & fuels" is unchanged. |

Exception: make a second group like G (steps in Preconditions) and press "Remove them" at step 3: G becomes a classification and what it held is gone.

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-213 (proposed) — Where does a converted row, and a kept row, stand in its new list?
- Q-215 (proposed) — What does the group-to-classification question say when classifications beneath are in use?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided | ACN-23; RUL-41 |
| R2 | shown | ACN-23; RUL-10 |
| R3 | shown | SCR-13; RUL-10; RUL-85 |
| R4 | shown | ACN-25; RUL-10; RUL-85 |
| R5 | decided, not built; proposed (Q-215) | RUL-10 |
| R6 | shown | ACN-25; RUL-10 |
| R7 | shown | ACN-25; SCR-13 |
| R8 | decided; proposed (Q-213, Q-235) | RUL-10; relies on story 11, RUL-83, RUL-96 |
| R9 | shown | STA-45; relies on story 11, RUL-84 |
| R10 | shown | ACN-23 |

- Prototype files: `src/components/settings/firma2-classification-roster.astro` (`toClassification`, `settle`, the `data-contents` dialog), `src/lib/taxonomy-edits.ts` (`convertToClassification`, `classificationsUnder`, `groupAndDescendants`, `nameTaken`).
- Data shapes: a group has a name, description, colour and parent (empty for top level); the conversion creates a classification with the same name, description and colour in the parent and discards the group.
- Do not copy: the prototype offers "Remove them" even when projects use the classifications beneath (R5 replaces this). Closing the dialog with its close button or Escape leaves the group as it was; the prototype keeps a stale pointer to it, which is a build detail. The prototype's second sentence, "Keep them, moved up one level, or remove them.", is not required wording; R3 and R5 govern the message.

</details>
