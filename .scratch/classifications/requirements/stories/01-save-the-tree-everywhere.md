# 01 — The classification tree is saved, and every page reads what is saved

Type: enabler
Epic: none
Release: first
Status: needs-triage
Revision: 1
Blocked by: none
Covers: artifacts: browser store, draft routes, reading pages built from seeded data, seeded targets
Sources: `/prototypes/workspace-settings/classifications` (the list that shows a saved change first); spec #3, #4, #25, #31; Q-186, Q-188, Q-198, Q-199
Snapshot: not yet captured
Read with: `../epics/E-A-set-up-the-tree.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R7. Waiting: none. R2 and R3 can be shown on the reading pages only once stories 14, 15, 17 and 21 exist; until then they are verified through the settings list (story 02).

## Capability

The workspace's classification tree is kept as saved information that belongs to the workspace, not to one person's browser. Once it exists, a group, a classification, a name, a description, a colour, an order, a place in the tree, a linked performance measure and a goal target stay after the page is closed, are the same for every administrator and every reader of that workspace, and carry who made the change and when.

It unblocks every story in this feature. Story 02 is the first screen that shows it: an add made there must still be there tomorrow, on another computer, for another administrator.

## Description

Today the prototype keeps every change in the browser that made it, shows reading pages from a fixed original sample, builds a separate address for anything added at run time, and carries a set of goal targets written into the sample. None of that is behavior. This story states the behavior those stand in for: one saved tree per workspace, read by the settings list and by every Classifications page, with an ordinary page for every record. To see the settings list that shows it, open `/prototypes/workspace-settings/classifications` on the invented sample (F1); the other pages are `/prototypes/classifications`, a classification's page and a group's page.

## Requirements

R1. Every change to the tree is saved when it is made, to the workspace: an add, a rename, a change of description or colour, a move, a new order, a conversion, a removal, a performance measure linked or unlinked, a goal target set or cleared. After the page is closed and opened again, in the same or another browser or on another device, the tree is as the last change left it.

R2. Every administrator of the workspace, and every reader, sees the same tree: a change saved by one person is what the next page opened by anyone shows. Nothing a person arranged is kept on that person's device alone.

R3. Every page that shows classifications reads the saved tree and not a fixed original: the settings list, the Classifications page (Outline and Browse), the peek, a classification's page and a group's page. A group or classification added, renamed, moved, converted or removed shows that way on all of them the next time each is opened.

R4. A record added after the workspace was set up has an ordinary address and an ordinary page, the same as a record that was there from the start. No address or page marks a record as new or temporary.

R5. The order of every list is saved with the tree: the order of the top-level groups, and, inside each group, the order of its classifications and the order of its groups. A list reads back in the order it was last arranged in.

R6. Every saved change records who made it and when. Where those records are shown is not decided by this feature (see the standing requirements, SR-6).

R7. A workspace starts with no groups, no classifications, no linked performance measures and no goal targets. The sample tree and its goal targets in `../fixtures.md` are data loaded into the test workspace, not something the product supplies. Two workspaces never share a tree.

R8. Goal targets are saved with their classification and read back with it: the figure a reader sees against a goal is the one an administrator last saved. A performance measure unlinked from a classification takes its goal target with it.

Standing requirements apply: see `../standing-requirements.md` (SR-7 failed saves, SR-8 two people at once, SR-9 limits).

## Out of scope

- Adding a group or a classification — see story 02.
- Setting or clearing a goal target and linking a measure — see story 05.
- How a reader sees a saved change on the reading pages — see stories 14, 15, 17 and 21.
- Where the change log is shown — `updates-feed` (to confirm; SR-6).
- A record that was removed: what its old address shows — see story 23.
- Which readers see which figures (published against every project) — see story 22.
- Importing a client's ProjectFirma 1.x tree — out of scope (Q-198).
- A reader's own preferences (folded groups, Outline or Browse): they are not part of the tree — see stories 10 and 17.

## Needs to know from elsewhere

- A failed save returns the row or field to where it was and says "Couldn't save the change. Try again." — owned by the standing requirements, SR-7.
- Two people changing the tree at once: the last save wins and a row someone else moved returns to its place with "Someone else changed this." — owned by SR-8.
- Who may change the tree (the Security setting "Manage classifications") — owned by story 13 and `users-and-security`.
- The performance measure catalog a classification links to, and each project's reports toward a measure — owned by `performance-measures`.

## Scenarios

**S1 — A saved add is still there after a reload** (proves R1)
- Given the test workspace holds F1 and Ada, Administrator, has added a classification inside Plan goal with story 02
- When Ada closes the browser and opens Settings › Classifications again
- Then the new classification is listed in Plan goal

**S2 — Another computer sees it** (proves R1, R2)
- Given the same added classification and Ada signed in on a second computer
- When she opens Settings › Classifications there
- Then the new classification is listed in Plan goal, with the same name

**S3 — A second administrator sees it** (proves R2)
- Given a second person who may change classifications and the same added classification
- When that person opens Settings › Classifications
- Then the new classification is listed in Plan goal

**S4 — An order is kept** (proves R5)
- Given Ada added two classifications to Plan goal, "first" then "second" (kinds of name only; a tester picks the names)
- When she reloads the settings list
- Then both follow the seven classifications of F1.1 and appear in the order added

**S5 — A new record opens on an ordinary page** (proves R4)
- Given a group added in story 02
- When Ada opens its name from the settings list
- Then the page opens at its own address with the group's name as its title, and the address contains no word such as "draft"

**S6 — Reading pages read the saved tree** (proves R3)
- Given a classification added in story 02
- When a reader opens the Classifications page, and a group's page that holds it
- Then the classification is among what each shows (this scenario needs stories 14, 15, 17 or 21 to run in full; until then the settings list is the only page that can be read)

**S7 — Each change says who and when** (proves R6)
- Given Ada added a group
- When a developer reads the saved record of that change
- Then it names Ada and the time of the change

**S8 — A new workspace starts empty** (proves R7)
- Given a workspace created with nothing loaded
- When an administrator opens Settings › Classifications
- Then no group or classification is listed (the first-run state is story 02, R13)

**S9 — A goal target is saved with its classification** (proves R8)
- Given the test workspace holds F1 with its goal targets (F3.1: 30 miles for Salmon & steelhead recovery)
- When any person opens that classification on the reading page (story 14)
- Then the figure shows "14.5 of 30 miles goal", the target as saved

## Verification

Preconditions: the test workspace holds F1; Ada, Administrator, is signed in on two computers. The screen is Settings › Classifications from story 02. Reading-page steps (marked below) wait for story 14, 15, 17 or 21.
Test data: F1, F1.1; F3.1 (step 8 only).
Reset: remove what the steps added with story 06; or restore the test workspace's saved tree to F1.

| # | Do this | You should see |
|---|---|---|
| 1 | On computer A, open Settings › Classifications and add a group at the top level with story 02 | The new group is listed after Practice area |
| 2 | Add a classification inside Plan goal | It is listed at the foot of Plan goal's classifications, before any groups |
| 3 | Close the browser, open it again, open Settings › Classifications | Both are still listed, in the same places |
| 4 | On computer B, signed in as Ada, open Settings › Classifications | Both are listed there too |
| 5 | Sign in as a second administrator and open it | Both are listed |
| 6 | Open the new classification's name | Its page opens at an ordinary address of its own, with no word such as "draft" in it |
| 7 | Ask a developer for the saved record of step 2 | It names Ada and the time |
| 8 | (needs story 14) Open Salmon & steelhead recovery on the Classifications page | "14.5 of 30 miles goal" is shown against Stream miles of instream habitat improved |

## Open questions

None.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided | artifact: browser store |
| R2 | decided | artifact: browser store |
| R3 | decided | artifact: reading pages built from seeded data |
| R4 | decided | artifact: draft routes |
| R5 | decided | artifact: browser store; RUL-7 |
| R6 | decided, not built | artifact: browser store; RUL-34 |
| R7 | decided | artifact: seeded targets; artifact: browser store |
| R8 | decided | artifact: seeded targets |

- Prototype files: `src/lib/taxonomy-edits.ts` (the store, key `firma2:taxonomy-edits:v1`: added, edited and removed entries, measure links, targets, orders); `src/lib/taxonomy-record.ts` (`recordHref`, the draft address); `src/pages/prototypes/workspace-settings/classifications/draft.astro`, `.../groups/draft.astro`; `src/lib/firma2-classification-tree.ts` and `src/data/firma2-classification-rollup.ts` (reading pages, seeded only); `src/data/firma2-classifications.ts:151-185` (`GOAL_TARGETS`).
- Data shapes the prototype models: entry = slug, name, description, colour, group (a classification's group; a group's parent, empty at the top); per-list stored order keyed by kind and home group; per-classification added and removed measure slugs; per-classification target list (measure, value, year).
- Do not copy: browser storage and its "patches over seeds" shape; the `local-` slugs and the `draft` routes; reading pages built from the original sample (the card board alone follows some settings edits); the invented targets as product defaults; the dev-only real-workspace switch (out of scope, Q-198).

</details>
