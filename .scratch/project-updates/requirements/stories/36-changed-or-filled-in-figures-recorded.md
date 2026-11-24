# 36 — An import records which figures the Contributor changed or filled in

Type: enabler
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 07, 14, 17, 22, 75
Covers: RUL-39, RUL-124, RUL-125, RUL-126
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; no spec decision (shown in the prototype only); spec #33 and #36 for what later reads it
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1, R3 and R4 for a performance measure change, once stories 07 and 22 are built (the edit and the import's record are used here, not built here). Waiting: R2 and the organization in R5 on story 75; the typed figure in R5 on story 14; the cases of R1, R2 and R5 marked "Not decided" on Q-116; which changes can arrive empty, in R5, on Q-33; whether R1 and R2 reach Key facts and contacts on Q-32. All of it only against the recorded readings in `../fixtures.md` until enabler 02 is built.

## Capability

For each change an import adds, the import records two facts: that its figure was changed from the document's, and that it was filled in after arriving empty. It unblocks the row markers of `publish-review`, build 2, which tell whoever reviews an import which values are the Contributor's and not the document's. It unblocks no story of this feature.

## Description

Stories 07, 14 and 17 let the person edit a change before adding it. When the change is added, the import (story 22) records two facts about it: that its figure is not the document's, and that it was filled in after arriving empty. Nothing in build 1 shows either fact; `publish-review`, build 2, reads them to mark rows in the review. Split from story 07 on 2026-11-23, and retyped as an enabler the same day: nothing it records shows on a screen of this feature. See the edits at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; the record has no screen.

## Requirements

R1. An imported performance measure change records that it was changed from the document's figure when it arrived with an amount and the amount added is another number. The two are compared as numbers: 1,850 typed over 1850 is no change. Not decided: a change the report supports two readings of, where the person replaces the reading written in with the other (Q-116).

R2. An imported funding source records the same when its amount is another number than the reading proposed, or its name is not the reading's. Spaces at either end of the name are not a difference. Not decided: whether a name that differs only in capitals is a change (Q-116).

R3. The comparison is made when the change is added, between what the reading proposed and what is added. A figure changed and then put back is not recorded as changed.

R4. Changing only the reporting period, a breakdown answer or a funding source's organization is not recorded as a change.

R5. An imported change records that it was filled in after arriving empty in two cases: the person typed a figure above zero into a performance measure change whose amount arrived empty, which ticked it (story 14, R6); or the person picked the organization of a funding source flagged "Not in this workspace" (story 75, R3). (open: Q-33)
- The fact stays once set, whatever the person does to the change afterwards, and is recorded if the change is added.
- A change that arrived empty is never recorded as changed from the document's figure (R1); a funding source can carry both facts.
- Not decided: a figure typed into an empty change the person had already ticked by hand, and a figure typed into a total to date that arrived empty because nothing was left (Q-116).

R6. Both facts belong to one change of one import. A change that is not added records nothing, and neither fact is recorded for a Key facts change or a contact.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Showing either fact to a Manager — `publish-review`, build 2.
- Editing a performance measure change — story 07. A change that arrives with an empty amount — story 14. The funding source change — story 17. Picking its organization — story 75.
- Everything else an import records about a change — story 22.

## Needs to know from elsewhere

- Each change of an import records its section, label, value, quote and the entry it saved — owned by story 22 (R2). This enabler adds two facts to that record.
- A change whose amount arrived empty ticks itself when the person types a figure above zero — owned by story 14 (R6).
- Picking an organization on a funding source flagged "Not in this workspace" ticks it; a funding source's name is saved without the spaces at its ends — owned by story 75 (R3) and story 17 (R2).
- A Key facts change and a contact cannot be edited, so neither fact arises for them — owned by story 07 (R6).
- A figure the report states as a total to date arrives as the difference from the record; that difference is "what the reading proposed" in R1 and R3 — owned by story 13.

## Scenarios

S1 to S4 run against the recorded crew log reading in `../fixtures.md`, S5 to S8 against the recorded funder report reading.

**S1 — A changed amount is recorded** (proves R1)
- Given C2's amount arrived as 1850
- When the Contributor changes it to 1800 and adds the changes
- Then the import's change for C2 records that it was changed from the document's figure

**S2 — An untouched amount is not** (proves R1)
- Given C2's amount is as it arrived, 1850
- When the Contributor adds the changes
- Then the import's change for C2 does not record a change from the document's figure

**S3 — Changed and put back** (proves R3)
- Given the Contributor changed C2's amount to 1800 and then typed "1,850" over it
- When they add the changes
- Then the import's change for C2 does not record a change from the document's figure

**S4 — A changed reporting period alone** (proves R4)
- Given the Contributor picked 2024 on C2 and left its amount at 1850
- When they add the changes
- Then the import's change for C2 does not record a change from the document's figure

**S5 — A funding source's changed amount** (proves R2)
- Given F11 arrived with 48000 secured
- When the Contributor changes the amount to $50,000 and adds the ticked changes
- Then the import's change for F11 records that it was changed from the document's figure

**S6 — A figure typed into an empty change** (proves R5)
- Given F9 arrived unticked with an empty amount
- When the Contributor types 40 into it and adds the ticked changes
- Then the import's change for F9 records that it was filled in after arriving empty, and does not record a change from the document's figure

**S7 — An organization picked** (proves R5)
- Given F12 arrived with no organization
- When the Contributor picks Pacific Fisheries Trust on it and adds the ticked changes
- Then the import's change for F12 records that it was filled in after arriving empty

**S8 — A change left out records nothing** (proves R6)
- Given the Contributor typed 40 into F9, which ticked it, and then unticked it
- When they add the ticked changes
- Then the import has no change for F9

## Verification

Nothing here can be seen on any screen until `publish-review`, build 2, marks the review's rows; there is no step a tester can run. A developer confirms each scenario by reading the import's record.

Preconditions: stories 07, 14, 17, 22 and 75 are built. No story of this feature shows either fact, so there is no screen to verify through.
Test data: `../fixtures.md`: the crew log, row C2; the funder report, rows F9, F11 and F12.
Reset: none needed for a tester; a developer's run leaves imports on Deer Creek, and how those are taken off is not known (Q-88).

## Open questions

- Q-32 — R1 and R2: if a Key facts change and a contact become editable, whether a changed value is recorded for them too; R6 changes with it.
- Q-33 — R5 and S6: if a change the report supports two readings of is to arrive empty, filling it is a third case of R5.
- Q-88 — the Reset line.
- Q-116 — would change R1, R2 and R5 and add scenarios: which of four edge cases record a fact (the other of two readings; a name changed only in capitals; a figure typed after ticking by hand; a figure typed into an empty total to date).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | RUL-39; RUL-124 |
| R2 | shown | RUL-39; RUL-125 |
| R3 | shown | RUL-39 |
| R4 | shown | RUL-39 |
| R5 | shown | RUL-39; RUL-126 |
| R6 | shown | RUL-39 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (where "filled in" is set: 858-864 for an organization, 895-903 for a typed figure; where both facts are written on Add: 969, 998, 1030); `src/lib/report-imports.ts` (the two facts on an imported change, 74-77); `src/components/review/firma2-review-changes.astro` (544, where the prototype's review already draws the two markers that build 2 owns; when a change carries both it shows only "Changed from the document's figure").
- Data shapes, as the prototype models them: an imported change holds two yes/no facts, "changed from the document's figure" and "filled in after an unsure reading".
- What the prototype does where nothing is decided (not requirements), all four in Q-116: replacing the written-in reading with the other is recorded as changed; a name changed only in capitals is recorded as changed; a figure typed into an empty change that is already ticked is not recorded as filled in, and such a change is then recorded as neither; a figure typed into an empty total to date is recorded as "filled in after an unsure reading".
- Do not copy: "a taken suggestion" as a third way to fill a change, struck with "Use suggestion" (Q-25); imports kept in the browser.

</details>
