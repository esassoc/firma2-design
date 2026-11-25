# 36 — An import records which figures the Contributor changed or filled in

Type: enabler
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-32, Q-116, Q-121
Revision: 1
Blocked by: 07, 13, 14, 17, 22, 75
Covers: RUL-39, RUL-124, RUL-125, RUL-126
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; no spec decision (shown in the prototype; completed by the proposals named above); spec #33 and #36 for what later reads it
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R6, once stories 07, 13, 14, 17, 22 and 75 are built (the edits, the total to date and the import's record are used here, not built here), against the recorded samples `deer-creek-crew-log-2025.xlsx`, `deer-creek-flagged-figures-2025.pdf` and `deer-creek-funding-unheld-2025.pdf`. Waiting on a feature that is not built: every requirement is seen on a screen only once `publish-review`, build 2, marks the review's rows.

## Capability

For each change an import adds, the import records two facts: that its figure was changed from the document's, and that it was filled in after arriving empty. It unblocks the row markers of `publish-review`, build 2, which tell whoever reviews an import which values are the Contributor's and not the document's. It unblocks no story of this feature.

## Description

Stories 07, 14, 17 and 75 let the person edit or fill a change before adding it. When the change is added, the import (story 22) records two facts about it. Both are worked out at that moment by one rule: compare what arrived on the check step with what is added. Which control the person touched first, and what they did in between, plays no part. Nothing in build 1 shows either fact; `publish-review`, build 2, reads them to mark rows in the review. See the edits at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; the record has no screen.

## Requirements

R1. Both facts are worked out when "Add N changes" is pressed, by comparing what the change arrived with on the check step with what is added. An imported performance measure change records that it was changed from the document's figure when it arrived with an amount and the amount added is another number. The two are compared as numbers: "1,850" typed over 1,850 is no change.

R2. An imported funding source records the same when its amount is another number than it arrived with, or its name is not the one it arrived with. A name that differs only in capitals, or in spaces at either end, is not a change.

R3. A figure changed and then put back is not recorded as changed: only the two ends are compared.

R4. Changing only the reporting period, a breakdown answer or a funding source's organization is not recorded as a change.

R5. An imported change records that it was filled in after arriving empty when it arrived with something empty and is added with it filled, however the change came to be ticked:
- a performance measure change whose amount arrived empty (story 14: a figure that was not settled, another quantity, two readings, another unit; story 13: a total lower than the record's), added with a figure. A change the report supports two readings of is filled in, whichever figure the person ends with;
- a funding source that arrived with no amount, or with "Organization" empty, added with both (story 75).
- A change that arrived with an empty amount is never recorded as changed from the document's figure. A funding source can carry both facts: an organization picked and a name or amount changed.
- One exception: a total to date with nothing left (story 13, R4) arrives empty because the document's own arithmetic left nothing to add. A figure typed into it is recorded as changed from the document's figure, not as filled in.

R6. Both facts belong to one change of one import. A change that is not added records nothing. Neither fact is recorded for a Key facts change or a contact, which can only be taken or left on the check step.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Showing either fact to a Manager — `publish-review`, build 2.
- Editing a performance measure change — story 07. A change that arrives with an empty amount — story 14. The funding source change — story 17. Picking its organization, and a funding source with no organization or no amount — story 75.
- Everything else an import records about a change — story 22.
- A row edited by hand on the project page after the import was added — story 81 and `publish-review` (spec #36).

## Needs to know from elsewhere

- Each change of an import records its parts (measure, period, name, organization, amount), its quote and the place it was read from — story 22 (R2). This enabler adds two facts to that record.
- A change whose amount arrived empty ticks itself when the person types a figure above zero, and can also be ticked by hand — story 14 (R6).
- Picking an organization on a funding source flagged "Not in this workspace" ticks it; a funding source's name is saved without the spaces at its ends — story 75 (R3) and story 17 (R2).
- A Key facts change and a contact cannot be edited on the check step — story 07 (R6).
- A figure the report states as a total to date arrives as the difference from the record; that difference is "what arrived" in R1 and R3. One with nothing left arrives empty — story 13 (R1, R4).

## Scenarios

S1 to S4 run against the recorded sample crew log in `../fixtures.md`; S5, S6 and S10 against the "funding unheld" sample; S7 to S9 and S12 against the "flagged figures" sample. S11 describes its data by kind and uses story 13's total to date.

**S1 — A changed amount is recorded** (proves R1)
- Given C2's amount arrived as 1,850
- When the Contributor changes it to 1,800 and adds the changes
- Then the import's change for C2 records that it was changed from the document's figure

**S2 — An untouched amount is not** (proves R1)
- Given C2's amount is as it arrived, 1,850
- When the Contributor adds the changes
- Then the import's change for C2 records neither fact

**S3 — Changed and put back** (proves R3)
- Given the Contributor changed C2's amount to 1,800 and then typed "1,850" over it
- When they add the changes
- Then the import's change for C2 does not record a change from the document's figure

**S4 — A changed reporting period alone** (proves R4)
- Given the Contributor picked 2024 on C2 and left its amount at 1,850
- When they add the changes
- Then the import's change for C2 does not record a change from the document's figure

**S5 — A funding source's changed amount** (proves R2)
- Given F11 arrived with 48,000 secured
- When the Contributor changes the amount to 50,000 and adds the ticked changes
- Then the import's change for F11 records that it was changed from the document's figure

**S6 — A name changed only in capitals** (proves R2)
- Given F11 arrived named "Fisheries Habitat Fund"
- When the Contributor retypes the name as "fisheries habitat fund" and adds the ticked changes
- Then the import's change for F11 does not record a change from the document's figure

**S7 — A figure typed into an empty change** (proves R5)
- Given F9 arrived unticked with an empty amount
- When the Contributor types 40 into it and adds the ticked changes
- Then the import's change for F9 records that it was filled in after arriving empty, and does not record a change from the document's figure

**S8 — A change with two readings** (proves R5)
- Given F7 arrived unticked with an empty amount and a sentence giving 6 and 12
- When the Contributor types 12 into it and adds the ticked changes
- Then the import's change for F7 records that it was filled in after arriving empty, and does not record a change from the document's figure

**S9 — Ticked by hand first, then filled** (proves R5, R1)
- Given the Contributor ticked F9 by hand while its amount was empty
- When they then type 40 into it and add the ticked changes
- Then the import's change for F9 records that it was filled in after arriving empty

**S10 — An organization picked** (proves R5)
- Given F12 arrived with "Organization" empty
- When the Contributor picks Pacific Fisheries Trust on it and adds the ticked changes
- Then the import's change for F12 records that it was filled in after arriving empty

**S11 — A figure typed where the total left nothing** (proves R5)
- Given a total to date that arrived "Already on file" with an empty amount, because the record already holds the total
- When the Contributor types a figure into it and adds it
- Then the import's change records that it was changed from the document's figure, and does not record that it was filled in

**S12 — A change left out records nothing** (proves R6)
- Given the Contributor typed 40 into F9, which ticked it, and then unticked it
- When they add the ticked changes
- Then the import has no change for F9

## Verification

Nothing here can be seen on any screen until `publish-review`, build 2, marks the review's rows; there is no step a tester can run. A developer confirms each scenario by reading the import's record after running it.

Preconditions: stories 07, 13, 14, 17, 22 and 75 are built. The test environment serves the recorded samples `deer-creek-crew-log-2025.xlsx`, `deer-creek-flagged-figures-2025.pdf` and `deer-creek-funding-unheld-2025.pdf`. No story of this feature shows either fact, so there is no screen to verify through.
Test data: `../fixtures.md`: the crew log, row C2; the flagged figures sample, rows F7 and F9; the funding unheld sample, rows F11 and F12.
Reset: reset the sample project in the test environment, between scenarios.

## Open questions

None open. The enabler rests on these proposed answers:

- Q-116 (proposed) — R1, R2, R3 and R5: both facts are worked out at the press from what arrived and what is added; a change with two readings is filled in; capitals alone are not a change; filled in however the change was ticked.
- Q-121 (proposed) — R5, last part: a figure typed into a total with nothing left is changed, not filled in.
- Q-32 (proposed) — R6: a Key facts change and a contact are taken or left, so neither fact arises for them.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; proposed (Q-116) | RUL-39; RUL-124 |
| R2 | shown; proposed (Q-116) | RUL-39; RUL-125 (reworded: capitals alone are not a change) |
| R3 | shown | RUL-39 |
| R4 | shown | RUL-39 |
| R5 | proposed (Q-116, Q-121) | RUL-39; RUL-126 (reworded: worked out at the press, not set when a control is touched) |
| R6 | shown; proposed (Q-32) | RUL-39 |
- S11 uses story 13's total to date; story 13 is in `Blocked by` for that reason.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (where "filled in" is set: 858-864 for an organization, 895-903 for a typed figure; where both facts are written on Add: 969, 998, 1030); `src/lib/report-imports.ts` (the two facts on an imported change, 74-77); `src/components/review/firma2-review-changes.astro` (544, where the prototype's review already draws the two markers that build 2 owns; when a change carries both it shows only "Changed from the document's figure").
- Data shapes, as the prototype models them: an imported change holds two yes/no facts, "changed from the document's figure" and "filled in after an unsure reading".
- Do not copy: "filled in" set at the moment a control is touched and kept whatever follows; a name changed only in capitals recorded as changed; a figure typed into an empty change that was already ticked recorded as neither; a figure typed into an empty total to date recorded as filled in; "a taken suggestion" as a third way to fill a change, struck with "Use suggestion" (Q-25); imports kept in the browser.

</details>
