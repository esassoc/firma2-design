# 75 — A Contributor picks an organization for a funding source whose organization the workspace does not hold

Type: story
Epic: B — What a report can change
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-35, Q-98, Q-122, Q-131, Q-132
Revision: 1
Blocked by: 17, 30
Covers: STA-15, RUL-17, ACN-22, RUL-175, RUL-407, RUL-408, RUL-409, RUL-410
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #15
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R5, once story 17 proposes funding source changes and story 30 checks ticked changes, against the recorded sample `deer-creek-funding-unheld-2025.pdf`, which stands in for enabler 02 until it is built. Built here, not showable until story 65: the stop on a funding source ticked by hand with no organization or no amount (R4, R5). Not released without story 65.

## Story

As a Contributor, I want a funding source whose organization my workspace does not hold to wait until I pick one that it does, so that the project shows who funded it without the import inventing an organization.

## Description

Story 17 proposes each funding source the report names and matches its organization against the workspace's. This story is the case where nothing matches: the change is flagged and waits until the person picks an organization the workspace holds, or leaves the funding source out. It also holds the two neighbouring cases, a funding source the report gives no organization for and one it gives no amount for, which wait in the same way. An import never creates an organization. Split from story 17 on 2026-11-23, by business-rule variation: its R1 to R4 were R3 to R6 of that story. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report, on the change for Community Streams Grant.

## Requirements

R1. On every funding source change, "Organization" offers every organization the person can see in the workspace's organization directory, connected organizations included, whichever the person belongs to, and nothing else.
- The list is in one order, A to Z by name, and the person can type to find one.
- It has no empty choice and no way to add an organization. An organization, once picked, can be changed to another but not cleared; a funding source is left out by unticking it.
- An import never creates an organization.

R2. When the report names an organization the workspace does not hold (story 17, R8 finds no match), the change is flagged: it arrives unticked, with the badge "Not in this workspace", "Organization" empty, and the sentence "“`<name>`” isn't an organization here. Pick one, or leave this out.", where `<name>` is the organization as the report writes it. While it is unticked the tally counts it under "need you". Its other fields can still be edited (story 17, R2). The sentence and the field's label take the workspace's word for Organization (SR-4).

R3. Picking an organization on a "Not in this workspace" change ticks it, and the tally then counts it under "ready to add".
- The badge and the sentence go once an organization is picked, and do not come back.
- Unticked after that, the change is counted under "left out", not under "need you".
- Picking an organization on a change in any other state leaves its tick as it is.

R4. A funding source whose organization is never picked is added in no case.
- Left unticked, it stays on the check step with its badge, counted under "need you", until the person adds the others or leaves. It is not saved, and nothing lists it after adding: the reading is not kept.
- Ticked by hand without a pick, it stops "Add N changes": "Organization" shows "Pick an organization.", and no change is added, the valid ones included (story 65, R1 and R4).

R5. A funding source the report gives no organization or no amount for is proposed, flagged with the badge "Needs you" and unticked. It is never dropped, and never added without both.
- No organization: "Organization" arrives empty and the change reads "The report names no organization for this funding source. Pick one, or leave this out." Picking one ticks the change, and the badge and the sentence go, as in R3.
- No amount: "Secured ($)" arrives empty and the change reads "The report gives no amount for this funding source." Typing an amount above zero ticks the change, and the badge and the sentence go.
- Neither: both sentences show, and the change ticks itself when it has both.
- Ticked by hand while either is missing, it stops "Add N changes" with the field's message (story 65, R1).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The funding source change, its three fields, how a name is matched, and "Already on file" — story 17.
- A ticked funding source with no name, no organization or no amount above zero, the limits on each field, its messages and its scenarios — story 65.
- Recording that the person picked the organization — story 36.
- The added funding source's row on the project page — story 17 (R9).
- A funding source on the record whose organization the workspace no longer holds: it cannot occur, because an organization a funding source names cannot be removed — `organizations-admin`.
- Creating an organization — `organizations-admin`.

## Needs to know from elsewhere

- Each funding source is proposed as a change with "Grant or program", "Organization" and "Secured ($)"; the report's organization is matched against the organizations the person can see by name, letter for letter, ignoring case and outer spaces, and when one matches "Organization" arrives holding it — story 17 (R1, R8).
- Every ticked change is checked when "Add N changes" is pressed, and one failure stops the whole import; a message goes as soon as its field is corrected or its change unticked — story 30 (R1, R4, R6). That a ticked funding source with no organization or no amount fails is story 65's (R1, R4), which is built after this story: without it a change ticked by hand would be added incomplete.
- A flagged change arrives unticked; an unticked change is not added; a flagged change ticked by hand counts under "ready to add"; "ready to add" and the count on "Add N changes" follow every tick — story 06 (R1 to R4). The tally, its five parts and the order inside a group ("Not in this workspace" after "Needs you", before "Already on file") — story 04 (R2, R4).
- The workspace's organization directory, and which organizations a person can see in it — owned by `organizations-admin`.

## Scenarios

S1 to S8 run against the recorded sample `deer-creek-funding-unheld-2025.pdf` (rows F3, F10, F11, F12), which arrives "2 ready to add · 1 needs you · 1 already on file". No sample holds the data of S9 and S10; it is described by kind.

**S1 — What "Organization" offers** (proves R1)
- Given the check step lists F12
- When the Contributor opens its "Organization" and types "Pla"
- Then the list is the organizations the person can see, A to Z, narrowed as they type; Placerville Community Foundation is not among them, and nothing offers to add an organization

**S2 — Changed, not cleared** (proves R1)
- Given F11 arrived with "Organization" holding Pacific Fisheries Trust
- When the Contributor opens its "Organization"
- Then they can pick another organization, and nothing offers to empty the field

**S3 — An organization the workspace does not hold** (proves R2)
- Given the workspace holds no Placerville Community Foundation
- When the funding unheld sample's reading comes back
- Then F12 is unticked, carries the badge "Not in this workspace", has "Organization" empty, and reads "“Placerville Community Foundation” isn't an organization here. Pick one, or leave this out."

**S4 — Picking an organization ticks the change** (proves R3)
- Given F12 as it arrived
- When the Contributor picks Deer Creek Watershed Alliance in its "Organization"
- Then F12 is ticked, its badge and its sentence are gone, the tally reads "3 ready to add · 1 already on file", and the action reads "Add 3 changes"

**S5 — Unticked after the pick** (proves R3)
- Given F12 after S4
- When the Contributor unticks it
- Then the badge and the sentence do not come back, and the tally reads "2 ready to add · 1 left out · 1 already on file"

**S6 — A pick on another change leaves its tick** (proves R3)
- Given the Contributor unticked F11, which arrived ticked with Pacific Fisheries Trust
- When they pick Deer Creek Watershed Alliance in its "Organization"
- Then F11 is still unticked

**S7 — An organization never picked** (proves R4)
- Given F12 is left as it arrived, still listed with its badge and counted under "need you"
- When the Contributor presses "Add 2 changes"
- Then Deer Creek's record holds no funding source named Community Streams Grant

**S8 — No organization is created** (proves R1)
- Given the Contributor added the ticked changes with F12 left as it arrived
- When the workspace's organizations are listed
- Then none is named Placerville Community Foundation

**S9 — A funding source with no organization named** (proves R5)
- Given a report that names a grant and an amount and no organization for it
- When the reading comes back
- Then the change is unticked, carries "Needs you", has "Organization" empty, and reads "The report names no organization for this funding source. Pick one, or leave this out."

**S10 — A funding source with no amount** (proves R5)
- Given a report that names a grant and an organization the workspace holds, and no amount
- When the reading comes back, and the Contributor then types an amount above zero in "Secured ($)"
- Then the change arrives unticked with "Needs you", "Secured ($)" empty and "The report gives no amount for this funding source."; once the amount is typed it is ticked, and the badge and the sentence are gone

## UAT script

The added funding sources are seen on the project page through story 17; this script ends at the workspace's organizations. Steps 4 and 5 show the stop on a change ticked by hand, which is the check of the story built next (65, R4); until that ships, go from step 3 to step 6.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person) and can open the workspace's list of organizations. Nothing has been imported to Deer Creek. The test environment serves the recorded sample `deer-creek-funding-unheld-2025.pdf`.
Test data: `../fixtures.md`: the funding unheld sample, rows F3 and F10 to F12; the organizations the workspace holds and does not hold. The sample is to be made. No sample has a funding source with no organization or no amount.
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import a report", choose `deer-creek-funding-unheld-2025.pdf`, press "Read it" and wait | The check step; the tally "2 ready to add · 1 needs you · 1 already on file"; the action "Add 2 changes" |
| 2 | Under Funding sources, find the change whose "Grant or program" holds Community Streams Grant | Unticked; the badge "Not in this workspace"; "Organization" empty; "“Placerville Community Foundation” isn't an organization here. Pick one, or leave this out." |
| 3 | Open its "Organization", type "Pla", and look for Placerville Community Foundation or a way to add an organization | The list narrows as you type, in A to Z order; neither is there |
| 4 | Close the list without picking, tick the change by hand and press "Add 3 changes" | Still the check step; "Organization" shows "Pick an organization." |
| 5 | Untick the change | The message goes; the tally reads "2 ready to add · 1 needs you · 1 already on file" again |
| 6 | Pick Deer Creek Watershed Alliance in its "Organization" | The change ticks itself; the badge and the sentence go; the tally reads "3 ready to add · 1 already on file"; the action reads "Add 3 changes" |
| 7 | Untick the change, read the tally, and tick it again | "2 ready to add · 1 left out · 1 already on file", then "3 ready to add · 1 already on file"; the badge does not come back |
| 8 | Press "Add 3 changes" | The Deer Creek project page; "3 changes added from deer-creek-funding-unheld-2025.pdf" |
| 9 | Open the workspace's organizations | No Placerville Community Foundation |

On the prototype: the sample does not exist there; see `../fixtures.md`, On the prototype.

## Open questions

None open. The story rests on these proposed answers:

- Q-131 (proposed) — R1, S1, S2: which organizations are offered, their order, typing to find one, and changing but not clearing.
- Q-98 (proposed) — R2: the sentence and the field's label take the workspace's word for Organization.
- Q-122 (proposed) — R3, S4, S5: the badge and the sentence go after a pick; unticked afterwards the change is "left out".
- Q-35 (proposed) — R4, S7: a funding source left without an organization stays in sight on the check step and is listed nowhere after adding. Reads spec #15's "listed as not added" as the check step's own list.
- Q-132 (proposed) — R5, S9, S10: a funding source with no organization or no amount is proposed, flagged, and never added without both.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown; proposed (Q-131) | RUL-17; RUL-175; RUL-407 |
| R2 | decided; shown; proposed (Q-98) | STA-15, RUL-17 |
| R3 | decided; shown; proposed (Q-122) | ACN-22; RUL-408 |
| R4 | decided; proposed (Q-35) | RUL-17; RUL-409; relies on story 30, RUL-21 |
| R5 | proposed (Q-132) | RUL-410 |
- R5 arrived from story 17 on 2026-11-23, when that story was cut. Its badge is the one flagged badge, "Needs you" (story 06, R4), because "Not in this workspace" would say something untrue of a report that names no organization. That an amount typed in ticks the change follows story 14's rule for a figure the reading left empty; story 14 is not in `Blocked by`, so the rule is stated here in full.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (whether the workspace holds the organization, 662; what waits on the person, 693-695; the badge and the message, 774 and 790-793; the list and the pick, 854-864; the check on Add, 987-991); `src/pages/prototypes/projects/[project]/import-report.astro` (which organizations the page is given, 88); `src/data/firma2-report-import.ts` (the recorded reading, 394-428).
- Data shapes, as the prototype models them: whether the workspace holds the organization is worked out by the page from the organization's name, not carried by the reading.
- The prototype differs from the requirements in these: a funding source left without an organization is dropped from the list without a word (R4); the list is in the directory's order, all 38 sample organizations, with no typing to find one (R1); the badge and the sentence stay after a pick, every later pick ticks the change again, and a change unticked after its pick is counted under "need you" (R3); a funding source always has an organization name and an amount (R5).
- Do not copy: the organizations to match against are the whole seeded directory passed into the page; the scripted readings.

</details>
