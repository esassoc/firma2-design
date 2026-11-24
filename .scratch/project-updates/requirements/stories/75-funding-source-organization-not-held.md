# 75 — A Contributor picks an organization for a funding source whose organization the workspace does not hold

Type: story
Epic: B — What a report can change
Release: first
Status: needs-info
Revision: 1
Blocked by: 17, 30
Covers: STA-15, RUL-17, ACN-22, RUL-175
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #15
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R4, once story 17 proposes funding source changes and story 30 checks ticked changes; like story 17, only against the recorded funder report reading in `../fixtures.md` until enabler 02 is built. Waiting: the parts marked "Not decided" or "open", each on the question named beside it.

## Story

As a Contributor, I want a funding source whose organization my workspace does not hold to wait until I pick one that it does, so that the project shows who funded it without the import inventing an organization.

## Description

Story 17 proposes each funding source the report names and matches its organization against the workspace's. This story is the case where nothing matches: the change is flagged and waits until the person picks an organization the workspace holds, or leaves the funding source out. An import never creates an organization. Split from story 17 on 2026-11-23, by business-rule variation: its R1 to R4 were R3 to R6 of that story. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report, on the change for Community Streams Grant.

## Requirements

R1. On every funding source change, "Organization" offers the organizations the workspace holds and nothing else: all of them, whichever the person belongs to, with no empty choice and no way to add one. An organization, once picked, can be changed to another but not cleared; a funding source is left out by unticking it. An import never creates an organization. (open: Q-131)

R2. When the report names an organization the workspace does not hold (story 17, R8 finds no match), the change is flagged: it arrives unticked, with the badge "Not in this workspace", "Organization" empty, and the message "“`<name>`” isn't an organization here. Pick one, or leave this out.", where `<name>` is the organization as the report writes it. While it is unticked the tally counts it under "need you". Its other fields can still be edited (story 17, R2). Not decided: a funding source the report names with no organization at all (Q-132); whether the sentence takes the workspace's word for Organization (Q-98).

R3. Picking an organization on a "Not in this workspace" change ticks it, and the tally then counts it under "ready to add". Picking one on a change in any other state leaves its tick as it is. Not decided: whether the badge and the message go once an organization is picked, and what a change unticked again after the pick is counted as (Q-122).

R4. A funding source whose organization is never picked is added in no case.
- Left unticked, it is left out when the others are added, and nothing says so afterwards (open: Q-35).
- Ticked by hand without a pick, it stops "Add N changes": "Organization" shows "Pick an organization.", and no change is added, the valid ones included (story 65, R1 and R4; story 30, R4). Story 65 is built after this story and holds the scenario for it; until it ships this case is not handled (SR-7), so this story is not released without it.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The funding source change, its three fields, how a name is matched, and "Already on file" — story 17.
- "Already on file" meeting "Not in this workspace" on one change — story 17, R7 (Q-134).
- A ticked funding source with no name, no organization or no amount above zero, its messages and its scenarios — story 65.
- Recording that the person picked the organization — story 36.
- The added funding source's row on the project page — story 17 (R9).
- Creating an organization — `organizations-admin`.

## Needs to know from elsewhere

- Each funding source is proposed as a change with "Grant or program", "Organization" and "Secured ($)"; the report's organization is matched against the workspace's by name, letter for letter, ignoring case and outer spaces, and when one matches "Organization" arrives holding it — story 17 (R1, R8).
- Every ticked change is checked when "Add N changes" is pressed, and one failure stops the whole import — story 30 (R1, R4). That a ticked funding source with no organization fails, with "Pick an organization.", is story 65's (R1, R4), which is built after this story: without it a change ticked by hand would be added with no organization. When the message goes is story 30's (Q-96).
- A flagged change arrives unticked; an unticked change is not added; "ready to add" and the count on "Add N changes" follow every tick — story 06. The tally and its parts — story 04.
- The workspace's organizations, by name. This story asks for the list and nothing else — owned by `organizations-admin`.

## Scenarios

All run against the recorded funder report reading in `../fixtures.md`, rows F11 and F12.

**S1 — Only organizations the workspace holds** (proves R1)
- Given the check step lists F11
- When the Contributor opens its "Organization"
- Then it offers the workspace's organizations, Placerville Community Foundation is not among them, and it offers no empty choice and nothing to add an organization

**S2 — An organization the workspace does not hold** (proves R2)
- Given the workspace holds no Placerville Community Foundation
- When the funder report's reading comes back
- Then F12 is unticked, carries the badge "Not in this workspace", has "Organization" empty, and reads "“Placerville Community Foundation” isn't an organization here. Pick one, or leave this out."

**S3 — Picking an organization ticks the change** (proves R3)
- Given F12 as it arrived
- When the Contributor picks Deer Creek Watershed Alliance in its "Organization"
- Then F12 is ticked, and the tally counts one more under "ready to add" and one fewer under "need you"

**S4 — A pick on another change leaves its tick** (proves R3)
- Given the Contributor unticked F11, which arrived ticked with Pacific Fisheries Trust
- When they pick Deer Creek Watershed Alliance in its "Organization"
- Then F11 is still unticked

**S5 — An organization never picked** (proves R4)
- Given F12 is left as it arrived
- When the Contributor adds the ticked changes
- Then Deer Creek's record holds no funding source named Community Streams Grant

**S6 — No organization is created** (proves R1)
- Given the Contributor added the ticked changes with F12 left as it arrived
- When the workspace's organizations are listed
- Then none is named Placerville Community Foundation

## UAT script

The added funding sources are seen on the project page through story 17; this script ends at the workspace's organizations. The tally and counts assume stories 13, 14, 15 and 18 are built, so the whole reading is listed. Steps 4 and 5 show the stop on a change ticked by hand, which is the check of the story built next (65, R4); until that ships, go from step 3 to step 6.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person) and can open the workspace's list of organizations. Nothing has been imported to Deer Creek. The recorded funder report reading is served for the funder report file.
Test data: `../fixtures.md`: the funder report, rows F11 and F12; the organizations the workspace holds and does not hold. The counts wait on Q-82. No fixture has the data of any "Not decided" case.
Reset: not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import report", choose `deer-creek-completion-report-2025.pdf`, press "Read it" and wait | The check step; the tally "7 ready to add · 4 need you · 3 already on file" |
| 2 | Under Funding sources, find the change whose "Grant or program" holds Community Streams Grant | Unticked; the badge "Not in this workspace"; "Organization" empty; "“Placerville Community Foundation” isn't an organization here. Pick one, or leave this out." |
| 3 | Open its "Organization" and look for Placerville Community Foundation, an empty choice, or a way to add an organization | None is there |
| 4 | Close the list without picking, tick the change by hand and press "Add 8 changes" | Still the check step; "Organization" shows "Pick an organization." |
| 5 | Untick the change | The tally reads "7 ready to add · 4 need you · 3 already on file" again |
| 6 | Pick Deer Creek Watershed Alliance in its "Organization" | The change ticks itself; the tally reads "8 ready to add · 3 need you · 3 already on file"; the action reads "Add 8 changes" |
| 7 | Press "Add 8 changes" | The Deer Creek project page |
| 8 | Open the workspace's organizations | No Placerville Community Foundation |

On the prototype: press "Sample funder report" in place of choosing the file; see `../fixtures.md`, On the prototype.

## Open questions

- Q-35 — R4 and S5: if the spec holds, a funding source left out for want of an organization is also listed as not added; it adds a requirement and a step.
- Q-67 — R2: where a "Not in this workspace" change goes in the group's order.
- Q-82 — steps 1 and 4 to 7: the counts.
- Q-88 — the Reset line, and how the recorded reading is served.
- Q-89 — R2 assumes the reading returns the organization as written and matches nothing.
- Q-131 — would change R1 and S1: which organizations are offered and matched, in what order, and whether the person can type to find one.
- Q-132 — would change R2: the state and the sentence for a funding source read with no organization.
- Q-122 — would change R3, S3 and step 6: whether the badge and the message go after a pick.
- Q-98 — would change R2 and S2: whether "isn't an organization here" and the field's label take the workspace's word.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | RUL-17; RUL-175 |
| R2 | decided; shown | STA-15, RUL-17 |
| R3 | decided; shown | ACN-22 |
| R4 | decided | RUL-17; relies on story 30, RUL-21 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (whether the workspace holds the organization, 662; what waits on the person, 693-695; the badge and the message, 774 and 790-793; the list and the pick, 854-864; the check on Add, 987-991); `src/pages/prototypes/projects/[project]/import-report.astro` (which organizations the page is given, 88); `src/data/firma2-report-import.ts` (the recorded reading, 394-428).
- Data shapes, as the prototype models them: whether the workspace holds the organization is worked out by the page from the organization's name, not carried by the reading.
- What the prototype does where nothing is decided (not requirements): a funding source left without an organization is dropped without a word (Q-35); the list is the directory's order, all 38 sample organizations, with no typing to find one (Q-131); the badge and the message stay after a pick, every later pick on the change ticks it again, and a change unticked after its pick is counted under "need you" (Q-122).
- Do not copy: the organizations to match against are the whole seeded directory passed into the page; the scripted readings.

</details>
