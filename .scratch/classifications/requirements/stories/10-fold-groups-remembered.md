# 10 — Administrator folds groups on the settings list, and the folds are remembered

Type: story
Epic: E-A Set up and arrange the classification tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-211
Revision: 1
Blocked by: 02
Covers: OBJ-7, STA-29, ACN-28, RUL-28
Sources: `/prototypes/workspace-settings/classifications`; spec #23
Snapshot: not yet captured
Read with: `../epics/E-A-set-up-the-tree.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R9. Waiting: nothing; R6 rests on a proposal (Q-211).

## Story

As the person who may change classifications, I want to fold a group so what is inside it is hidden, and find it folded the next time I come back, so that I can see less of a long tree at once and work on the part I came for.

## Description

The settings list shows the whole tree open. With a dozen groups it is long, so each group's line has a chevron that hides what is inside it. Which groups are folded is a reader's own preference: it is remembered for that reader, and it changes nothing in the tree and nothing any other reader sees. The preferences the Classifications page keeps (the chosen view, the chosen row in Browse) belong to stories 15 and 17; this story keeps only the folded set of the settings list. To see it in the prototype, open `/prototypes/workspace-settings/classifications` with the tree in F1 and press a chevron.

## Requirements

R1. Every group's line, at every depth including the top level, has a chevron button. Pressing it hides everything inside that group: its classifications, its groups, and for a top-level group also the column heads under its heading. Pressing it again shows them. The chevron points up while the group is open and down while it is folded.

R2. The group's own line stays when it is folded: its name, its count ("<N> classifications", counted beneath it at any depth), its "Add" and its "…" menu. A top-level group's description stays under its heading.

R3. The chevron names its state to assistive technology: its label is "Hide what is in <group name>" while the group is open and "Show what is in <group name>" while it is folded, and it says whether it is expanded.

R4. Every group is open the first time a reader sees the list, and a group added later is open.

R5. The folded set is remembered for the reader who made it: after a reload, or on a later visit, the same groups are folded and the rest are open. One reader's folds never change what another reader sees.

R6. The folds are kept on the device and browser the reader used; they do not follow the person to another device, where every group is open. When they cannot be remembered, every group is open.

R7. Each group folds on its own. A group inside another keeps its own state while the group around it is folded: folding Practice area and opening it again shows "Forests & fuels" as it was left.

R8. "Add" in a folded group opens the group first, and the new empty row shows inside it; the group then stays open on later visits. Adding to a group that is open changes nothing about folds. (relies on story 02, ACN-20)

R9. Folded top-level groups sit directly under each other, with no gap between them; an open top-level group leaves room under its contents.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Dragging a row over a folded group (it is not a place to drop) — see story 09. Sending a row to a folded group with "Move to <group>" (it joins and the group stays folded) — see story 08.
- The chosen view and the chosen row on the Classifications page, and the closed groups on the goal board — see stories 15, 17 and 21.
- Telling a reader how many groups are folded, or a "fold all" / "open all" control: nothing in the prototype or the spec has one.

## Needs to know from elsewhere

- A group's "Add" menu offers "Classification" and "Group" and opens an empty row with a name field — owned by story 02 (ACN-20, STA-31).
- A refusal message on a group's line (for example the name refusals in stories 11 and 12) stays visible when the group is folded.

## Scenarios

**S1 — Fold a group** (proves R1, R2, R3)
- Given the tree in F1, everything open
- When the person presses the chevron whose label is "Hide what is in Forests & fuels"
- Then "Fuel breaks", "Forest thinning" and "Prescribed fire" are no longer shown; the line "Forests & fuels 3 classifications" with its "Add" and "…" stays; the chevron's label is now "Show what is in Forests & fuels" and it points down

**S2 — Open it again** (proves R1)
- Given "Forests & fuels" folded
- When the person presses its chevron
- Then its three classifications are shown again in their order and the chevron points up

**S3 — Folding a top-level group** (proves R1, R2)
- Given the tree in F1
- When the person folds Plan goal
- Then its seven classifications and its column heads (Name, Projects, Performance measures) are hidden; its heading, its description and "7 classifications" stay

**S4 — First visit, and a group added later, are open** (proves R4)
- Given a reader who has never folded anything on this list
- When the person opens Workspace settings › Classifications and then adds a group inside Practice area (story 02)
- Then every group is open, and so is the new group

**S5 — Remembered** (proves R5)
- Given the person has folded "Channels & fish passage" and "Plan goal"
- When the page is reloaded, or the person returns to it on a later visit
- Then those two are folded and every other group is open

**S6 — Folds are one reader's own** (proves R5)
- Given Ada has folded Plan goal
- When a second person who may change classifications opens the list
- Then Plan goal is open for that person

**S7 — Cannot be remembered, or a new device** (proves R6)
- Given a reader whose browser cannot keep the preference
- When the person folds a group and reloads
- Then every group is open and nothing is reported as an error; the same when Ada opens the list on a different device


**S8 — An inner fold survives the outer one** (proves R7)
- Given "Forests & fuels" folded inside Practice area
- When the person folds Practice area, then opens it again
- Then "Forests & fuels" is still folded and the other three groups inside are open

**S9 — Adding opens a folded group** (proves R8)
- Given "Vegetation & wetlands" folded
- When the person chooses "Add" › "Classification" on its line
- Then the group opens, its three classifications show, and an empty row with a cursor in its name field shows after them; on the next visit the group is open

**S10 — Folded groups sit together** (proves R9)
- Given the tree in F1
- When the person folds Plan goal and Practice area
- Then the two headings sit directly under each other with no gap between them, and with Plan goal open again the room under its contents returns

## UAT script

Preconditions: signed in as Ada (an Administrator); the test workspace holds the tree in F1; Ada has no folds saved (first visit, or the preference cleared).
Test data: F1, F1.1, F1.2.
Reset: press every chevron that shows "Show what is in <name>" until none does; the tree itself is unchanged.

| # | Do this | You should see |
|---|---|---|
| 1 | Open Workspace settings › Classifications. | Plan goal and Practice area, every group open. |
| 2 | Press the chevron "Hide what is in Forests & fuels". | Its three classifications disappear; the line "Forests & fuels 3 classifications" stays with "Add" and "…". The chevron now reads "Show what is in Forests & fuels". |
| 3 | Press "Hide what is in Plan goal". | Its seven classifications and the column heads disappear; its description and "7 classifications" stay. |
| 4 | Press "Hide what is in Practice area", then "Show what is in Practice area". | Practice area closes and opens; "Forests & fuels" is still folded. |
| 5 | Reload the page. | Plan goal and Forests & fuels are folded; everything else is open. |
| 6 | On the Forests & fuels line press "Add", then "Classification". | The group opens and an empty name row appears after its classifications. Press Escape to drop the row. |
| 7 | Press "Show what is in Plan goal", then reload. | Plan goal is open; Forests & fuels stays open as step 6 left it. |

Exception: sign in as a second person who may change classifications and open the list: every group is open (their folds are their own).

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-211 (proposed) — Do a reader's folds follow them to another device?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; decided | ACN-28; STA-29 |
| R2 | shown | STA-29 |
| R3 | shown | ACN-28 |
| R4 | shown | STA-29 |
| R5 | decided | OBJ-7; RUL-28 |
| R6 | proposed (Q-211) | OBJ-7 |
| R7 | shown | STA-29 |
| R8 | decided | RUL-28; relies on story 02, ACN-20 |
| R9 | shown | STA-29 |

- Prototype files: `src/components/settings/firma2-classification-roster.astro` (`foldButton`, `addMenu`, the `__roots` spacing rule), `src/components/shared/bcn-sortable-list.ts` (no part in folding).
- Data shapes: the folded set is a list of group identifiers; a group missing from it is open.
- Do not copy: the folded set is kept in browser storage under one key and falls back to all-open when storage throws; that is a build choice for the prototype (Q-211 proposes device-local). An identifier left behind by a removed group does nothing.
- Inventory additions: none beyond the map. Behavior not in the inventory and not a requirement: a group that holds nothing still has its chevron (folding it hides only a top-level group's column heads), and a top-level group's description sits outside what folds — `firma2-classification-roster.astro:742-745`.
- OBJ-7 is covered here only as the settings list's folded set. It also lists the chosen view, the closed groups on the goal board and the chosen row in Browse; this story states only the settings list's folded set (the others are in stories 15, 17 and 21).

</details>
