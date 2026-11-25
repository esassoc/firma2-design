# 23 — Reader sees a sensible page when nothing is set up and when a record is removed

Type: story
Epic: E-B Read progress against the tree
Release: first
Status: needs-triage
Revision: 1
Blocked by: 15, 17, 06
Covers: STA-15, STA-26, RUL-77, RUL-78
Sources: `/prototypes/classifications` with no groups; a removed classification's or group's page (the prototype draws an empty table and a "Removed in Workspace settings." alert); Q-193, Q-194
Snapshot: not yet captured
Read with: `../epics/E-B-read-progress.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R7. Both states are decided in writing and not built in the prototype, so a builder works from the requirements and scenarios, not from a screen.

## Story

As a reader, I want a page that says plainly when nothing is set up yet, or when the record I followed a link to has been removed, so that I know what happened and where to go next instead of staring at an empty table.

## Description

The Classifications page (story 15) reads the tree an administrator built. Two moments leave it with nothing real to show. The first is a new workspace in which no group exists yet: the page says so, and to someone who may set classifications up it offers the way in. The second is a link or bookmark to a classification's or group's page after that record has been removed (story 06): the page is the ordinary "not found" page, with a way back. Neither can be seen in the sample tree: the first needs a workspace with no groups, the second a record that existed and was removed. To see them: a new empty workspace at Classifications; and `/prototypes/classifications`, a page address kept before the record was removed in Settings.

## Requirements

R1. When the workspace has no groups (and so no classifications, since a classification is always in a group), the Classifications page shows the message "No classifications yet" in place of the Outline or Browse view, whichever view is chosen. No empty table or empty list is drawn.

R2. To a reader who may change classifications (an Administrator, or anyone the Security setting "Manage classifications" lets in, story 13), the message is followed by a link "Set up classifications" that goes to Settings › Classifications, where "No groups yet. Add one to start." and "Add group" wait (story 02).

R3. To any other reader the message stands alone, with no link and no mention of settings.

R4. As soon as one group exists, the page stops showing this message and shows the Outline or Browse view of the tree, even when that group holds no classification yet (the view then draws the group with zero counts, story 15).

R5. A classification's page whose classification has been removed is the ordinary "not found" page of the product, with a link back to Classifications (the workspace's own word for the page, SR-2). It shows no figures, no summary and no measures, and no notice that a record was removed.

R6. A group's page whose group has been removed is the same page with the same link.

R7. An address for a classification or a group that never existed is that same "not found" page: the page does not tell a removed record from one that never was.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Adding the first group — see story 02.
- Removing a classification or group, and when it is refused — see story 06.
- The wording and look of the product's ordinary "not found" page: owned by the application shell, used here as is.
- Who may set up classifications, and what the others never see — see story 13.
- A classification chip on a project that names a removed classification — owned by `project-record`.

## Needs to know from elsewhere

- A group cannot be removed while it holds anything, and the last group cannot be removed at all (story 06). A workspace with no groups is therefore a new workspace, never a tree emptied by removal.
- The product's ordinary "not found" page exists for every missing address and carries a link back to a parent page (application shell).
- Who counts as able to change classifications is story 13's rule.

## Scenarios

**S1 — A new workspace** (proves R1)
- Given a workspace in which no group has been added (F9: an empty workspace), and Ada opens Classifications
- When she looks at the page
- Then it says "No classifications yet" and draws no table and no list

**S2 — Either view says it** (proves R1)
- Given the same workspace and Ada has chosen Browse (story 17)
- When she opens Classifications
- Then it says "No classifications yet" in the same place

**S3 — The way in, for those who may** (proves R2)
- Given the same workspace
- When Ada presses "Set up classifications"
- Then Settings › Classifications opens, showing "No groups yet. Add one to start." and "Add group"

**S4 — Nothing for those who may not** (proves R3)
- Given the same workspace, and Cam (Contributor, F5) opens Classifications
- When he reads the page
- Then it says "No classifications yet" and has no "Set up classifications" link

**S5 — The first group ends it** (proves R4)
- Given Ada added one group with no classifications in it (story 02)
- When she opens Classifications
- Then the message is gone and the Outline shows that group with zero counts

**S6 — A removed classification** (proves R5)
- Given Ada added a classification in any group (story 02), opened its page and kept its address, then removed it in Settings (story 06)
- When she opens the kept address
- Then the ordinary "not found" page shows with a link back to Classifications, and no figures

**S7 — A removed group** (proves R6)
- Given Ada added an empty group at the top level, opened its page, kept its address, and removed it (story 06)
- When she opens the kept address
- Then the same "not found" page and link show

**S8 — An address that never existed** (proves R7)
- Given Ada types the address of a classification page with a name no record ever had
- When she opens it
- Then the same "not found" page shows, worded as for S6

**S9 — The way back** (proves R5)
- Given the "not found" page of S6
- When Ada presses the link back to Classifications
- Then the Classifications page opens with the tree as it now is

## UAT script

Preconditions: two workspaces: the test workspace with F1 and an empty one with no groups (F9). Ada and Cam (F5) can sign in to each.
Test data: F5, F7 (a classification and a group the script adds).
Reset: the empty workspace cannot be emptied again (the last group cannot be removed, story 06): after step 4 ask the development team for a fresh one. In the F1 workspace the added classification and group are removed in steps 6 and 9.

| # | Do this | You should see |
|---|---|---|
| 1 | In the empty workspace, sign in as Ada and open Classifications. | "No classifications yet". No table, no list. |
| 2 | Press "Set up classifications". | Settings › Classifications: "No groups yet. Add one to start." and "Add group". |
| 3 | Sign in as Cam and open Classifications. | "No classifications yet" and no link. |
| 4 | As Ada, add one group (story 02) and open Classifications. | The message is gone; the Outline shows the group with zero counts. |
| 5 | In the F1 workspace, as Ada, add a classification to any group (story 02), open its page from Classifications, and copy its address. | The new classification's page. |
| 6 | In Settings, open that classification and remove it (story 06). | It leaves the list. |
| 7 | Paste the copied address. | The "not found" page with a link back to Classifications; no figures. |
| 8 | Press the link. | The Classifications page opens, without the removed classification. |
| 9 | Add an empty group, keep its page address, remove it, and open the address. | The same "not found" page and link. |
| 10 | Change a letter of any classification address and open it. | The same "not found" page. |

## Open questions

None.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided, not built | STA-15 |
| R2 | decided, not built | STA-15 |
| R3 | decided, not built | STA-15 |
| R4 | decided, not built | RUL-77 |
| R5 | decided, not built | STA-26 |
| R6 | decided, not built | STA-26 |
| R7 | decided, not built | RUL-78 |

- Prototype files: `src/components/classifications/firma2-classification-outline.astro` and `firma2-classification-browse.astro` (draw an empty table and list), `src/components/classifications/firma2-classification-summary.astro` (the "Removed in Workspace settings." alert, `isRemoved`), `src/pages/prototypes/classifications/[classification].astro`, `groups/[group].astro`, `src/components/settings/firma2-classification-roster.astro` (first-run copy "No groups yet. Add one to start.").
- Data shapes: none beyond the tree; the empty state is "no groups".
- Do not copy: the "Removed in Workspace settings." warning (it stands in for the real "not found" page, Q-194); the removal is known only to the browser that removed it; a static site cannot build a page for a new record.

</details>
