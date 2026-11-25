# 65 — A Contributor is stopped before anything is added by an invalid funding source

Type: story
Epic: B — What a report can change
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-68, Q-83, Q-96, Q-113, Q-122
Revision: 1
Blocked by: 17, 30, 75
Covers: RUL-122, RUL-123, RUL-406
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; no spec decision (shown in the prototype only); spec #15 for the organization that must be picked
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R4, once story 17's funding source change, story 75's "Not in this workspace" change and story 30's check are built (the three fields, the tick and the stop are used here, not built here), against the recorded sample `deer-creek-funding-unheld-2025.pdf`, which stands in for enabler 02 until it is built. Nothing waits.

## Story

As a Contributor, I want to be stopped if a funding source I ticked has no name, no organization or no amount, so that the project never shows a funder with a blank where one of them belongs.

## Description

Story 30 checks every ticked change when "Add N changes" is pressed, and stops the import if one cannot be added. Story 17 adds the funding source change, with three fields the person can edit. This story is where the two meet: what a ticked funding source needs, the limits on each field, and the message on each field that fails. It is also what makes story 75's rule safe: a funding source that waits on an organization or an amount can be ticked by hand, and this check is what keeps it off the record until it has both. Split from story 30 on 2026-11-23, where it was R3. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report.

## Requirements

R1. A ticked funding source change needs all three of its fields, each within its limits. Each field that fails shows its own message:
- "Grant or program" needs some text. Empty, or spaces alone, fails: "Name the grant or program." More than 200 characters fails: "Use 200 characters or fewer."
- "Organization" needs one picked: "Pick an organization."
- "Secured ($)" needs an amount above zero. Empty, zero, a negative amount and text that is not a number all fail: "Enter an amount above zero." A dollar sign, separators and spaces in the amount are accepted.
- "Secured ($)" is whole dollars. An amount with cents fails: "Enter whole dollars, without cents." It is never rounded for the person.
- An amount of one trillion dollars or more fails: "Enter an amount below one trillion."
- Where the project page's own field for the same value has a tighter limit (story 81), that limit holds here too.

R2. When more than one field of a change fails, each shows its message at the same press.

R3. The check is story 30's, and its rules hold here unchanged:
- A funding source that is not ticked is not checked (story 30, R1). One failing funding source stops the whole import, changes of every other kind included (R4).
- Keyboard focus moves to the first failing field, and the messages are announced once to assistive technology (R5). On a narrow screen with the document showing, the document closes and the changes come back at that field (R5).
- A message goes as soon as its field is corrected or its change is unticked, and every message is worked out afresh at the next press (R6).

R4. A funding source that waits on the person and is ticked by hand fails like any other: one flagged "Not in this workspace", or one the report gave no organization for, fails with "Pick an organization."; one the report gave no amount for fails with "Enter an amount above zero." (story 75, R4 and R5). The message shows beside the badge and the sentence the change already carries. Once the organization is picked or the amount typed, the badge and the sentence go (story 75, R3 and R5) and the change passes. An "Already on file" funding source has no checkbox (story 17, R7), so it is never checked.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The check itself: when it runs, what stops, what the person is left with, focus and announcement — story 30.
- The funding source change, its three fields, what "Organization" offers, and the tick that picking an organization sets — stories 17 and 75.
- A funding source left unticked for want of an organization: it is not checked and not saved — story 75 (R4).
- A funding source whose row the record already holds, with the same amount or another — stories 17 (R7) and 86.
- The same limits on the project page's own fields — story 81.
- Creating an organization — `organizations-admin`.

## Needs to know from elsewhere

- Every ticked change is checked before anything is added; one failure stops the whole import and leaves the check step as the person set it, with ticks, edits and note intact — owned by story 30 (R1, R4 to R6).
- A funding source change has three editable fields; "Secured ($)" shows thousands separators; "Organization" arrives empty when the report names one the workspace does not hold or names none, and such a change arrives unticked but can be ticked by hand — owned by story 17 (R2) and story 75 (R2, R4, R5). Story 75 is in `Blocked by`: of the two stories that state the hand-ticked case, this one is built second and holds its scenarios (S2, S6, S10).
- "Organization", once it holds one, cannot be cleared, so on a change that arrived with an organization that field cannot fail — owned by story 75 (R1).
- A flagged change ticked by hand counts under "ready to add" and in "Add N changes" — owned by story 06 (R3).
- Each ticked performance measure change is saved as a new entry, and the card's figure is the sum of a measure's entries — owned by story 01 and `performance-measures`.

## Scenarios

All run against the recorded sample `deer-creek-funding-unheld-2025.pdf` (rows F3, F10, F11, F12), which arrives "2 ready to add · 1 needs you · 1 already on file". "The commit action" is "Add N changes", whatever its count.

**S1 — A funding source with no name** (proves R1)
- Given F11 is ticked and the Contributor has cleared its "Grant or program", or left only spaces in it
- When they press the commit action
- Then in each case "Grant or program" on F11 shows "Name the grant or program."

**S2 — A funding source with no organization** (proves R1, R4)
- Given F12 as it arrived, with "Organization" empty, and the Contributor has ticked it by hand
- When they press the commit action
- Then "Organization" on F12 shows "Pick an organization.", beside the badge "Not in this workspace" and its sentence

**S3 — A funding source with no amount above zero** (proves R1)
- Given F11 is ticked and its "Secured ($)" is empty, or 0, or −100, or "abc"
- When the Contributor presses the commit action
- Then in each case "Secured ($)" on F11 shows "Enter an amount above zero."

**S4 — Cents, and the limits** (proves R1)
- Given F11 is ticked and its "Secured ($)" holds 48,000.50, or 1,000,000,000,000, or its "Grant or program" holds 201 characters
- When the Contributor presses the commit action
- Then the field shows "Enter whole dollars, without cents.", "Enter an amount below one trillion." or "Use 200 characters or fewer." in turn, nothing is added, and the field still holds what was typed

**S5 — Three messages at once** (proves R2)
- Given F12 is ticked by hand with "Organization" empty, and the Contributor has cleared its "Grant or program" and its "Secured ($)"
- When they press the commit action
- Then F12 shows "Name the grant or program.", "Pick an organization." and "Enter an amount above zero.", each on its field

**S6 — Nothing is added** (proves R3)
- Given F3 is ticked and valid, F12 is ticked by hand with "Organization" empty, and "Acres of invasive vegetation removed" reads 12.6 on the project page
- When the Contributor presses "Add 3 changes"
- Then they are still on the check step, and "Acres of invasive vegetation removed" still reads 12.6

**S7 — An unticked funding source is not checked** (proves R3)
- Given F12 is left as it arrived, unticked, with "Organization" empty
- When the Contributor presses "Add 2 changes"
- Then the Deer Creek project page opens

**S8 — Focus and announcement** (proves R3)
- Given the check step of S5
- When the Contributor presses the commit action
- Then keyboard focus is in F12's "Grant or program", the first failing field, and the three messages are announced once

**S9 — A message goes when its field is put right** (proves R3)
- Given F12 shows its three messages after a failed check
- When the Contributor types Community Streams Grant into "Grant or program"
- Then "Name the grant or program." goes at once, and the other two stay

**S10 — Put right and pressed again** (proves R3, R4)
- Given F12, ticked by hand, shows "Pick an organization." after a failed check
- When the Contributor picks Deer Creek Watershed Alliance on it and presses "Add 3 changes"
- Then the message, the badge and the sentence go at the pick; the Deer Creek project page opens; and the record holds the funding source Community Streams Grant, Deer Creek Watershed Alliance, $12,500

## UAT script

The added funding source is seen on the project page through story 17; this script checks the stop through a performance measure figure, which story 01 already shows.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person), in a window wider than 64rem. Nothing has been imported to Deer Creek. The test environment serves the recorded sample `deer-creek-funding-unheld-2025.pdf`. A second browser tab is open on the Deer Creek project page.
Test data: `../fixtures.md`: the funding unheld sample, rows F3, F11 and F12; Deer Creek's "Before" figure for "Acres of invasive vegetation removed", 12.6. The sample is to be made.
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import a report", choose `deer-creek-funding-unheld-2025.pdf`, press "Read it" and wait | The check step, with a Funding sources group of three changes; the tally "2 ready to add · 1 needs you · 1 already on file"; the action "Add 2 changes" |
| 2 | Tick the change for Community Streams Grant without touching its "Organization" | The change is ticked; "Organization" is still empty; the action reads "Add 3 changes" |
| 3 | Press "Add 3 changes" | "Pick an organization." on that "Organization", with the cursor in that field; you are still on the same page |
| 4 | In the second tab, reload the project page and look at "Acres of invasive vegetation removed" | 12.6 |
| 5 | Back on the check step, clear "Grant or program" and "Secured ($)" on the same change and press "Add 3 changes" | Three messages on that change: "Name the grant or program.", "Pick an organization.", "Enter an amount above zero." |
| 6 | Type Community Streams Grant into "Grant or program" | "Name the grant or program." goes; the other two messages stay |
| 7 | Type 12,500.50 into "Secured ($)" and press "Add 3 changes" | "Enter whole dollars, without cents." on that field; still the same page; the field still holds 12,500.50 |
| 8 | Type $12,500 over it and pick Deer Creek Watershed Alliance | No message is left on the change; the badge "Not in this workspace" and its sentence are gone |
| 9 | Press "Add 3 changes" | The Deer Creek project page; "3 changes added from deer-creek-funding-unheld-2025.pdf" |
| 10 | Look at "Acres of invasive vegetation removed" | 16.8: the 12.6 of step 4 and row F3's 4.2 |

On the prototype: the sample does not exist there; see `../fixtures.md`, On the prototype.

## Open questions

None open. The story rests on these proposed answers:

- Q-113 (proposed) — R1, S4: whole dollars, never rounded; below one trillion; a name of at most 200 characters; the project page's own limits where they are tighter.
- Q-68 (proposed) — R3, S8: focus moves to the first failing field.
- Q-83 (proposed) — R3, S8: the messages are announced once.
- Q-96 (proposed) — R3, S9: a message goes as soon as its field is corrected or its change unticked.
- Q-122 (proposed) — R4, S10: the "Not in this workspace" badge and sentence go once an organization is picked.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; proposed (Q-113) | RUL-122; RUL-406 |
| R2 | shown | RUL-122 |
| R3 | shown; proposed (Q-68, Q-83, Q-96) | relies on story 30, RUL-21, STA-21 |
| R4 | shown; proposed (Q-122) | RUL-123; relies on story 75, STA-15, RUL-17 |
- Wording provisional: "Use 200 characters or fewer.", "Enter whole dollars, without cents." and "Enter an amount below one trillion." (R1). An amount typed with a decimal part of zero, such as 12,500.00, is whole dollars and passes; say otherwise if cents are to be refused by form alone.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (how a typed amount is read at 947; the three checks and their messages at 982-992; the stop at 1035-1039).
- Data shapes: none of its own. A message belongs to one field of one funding source change.
- The prototype differs from the requirements in these: an amount with cents is saved as typed, and nothing limits the amount or the name's length (R1); focus does not move, nothing is announced, and a message stays until the next press (R3); a hand-ticked "Not in this workspace" change keeps its badge and its sentence after an organization is picked (R4).
- Do not copy: the check reading browser-local stores.

</details>
