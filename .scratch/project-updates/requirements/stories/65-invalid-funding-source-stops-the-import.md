# 65 — A Contributor is stopped before anything is added by an invalid funding source

Type: story
Epic: B — What a report can change
Release: first
Status: needs-info
Revision: 1
Blocked by: 17, 30, 75
Covers: RUL-122, RUL-123
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; no spec decision (shown in the prototype only); spec #15 for the organization that must be picked
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R4, once story 17's funding source change, story 75's "Not in this workspace" change and story 30's check are built (the three fields, the tick and the stop are used here, not built here), and only against the recorded funder report reading in `../fixtures.md`, which stands in for enabler 02 (not built). Waiting: the parts marked "Not decided", each on the question named beside it.

## Story

As a Contributor, I want to be stopped if a funding source I ticked has no name, no organization or no amount, so that the project never shows a funder with a blank where one of them belongs.

## Description

Story 30 checks every ticked change when "Add N changes" is pressed, and stops the import if one cannot be added. Story 17 adds the funding source change, with three fields the person can edit. This story is where the two meet: what a ticked funding source needs, and the message on each field that lacks it. It is also what makes story 75's rule safe: a funding source whose organization the workspace does not hold can be ticked by hand, and this check is what keeps it off the record until an organization is picked. Split from story 30 on 2026-11-23, where it was R3. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report.

## Requirements

R1. A ticked funding source change needs all three of its fields. Each field that fails shows its own message:
- "Grant or program" needs some text. Empty, or spaces alone, fails: "Name the grant or program."
- "Organization" needs one picked: "Pick an organization."
- "Secured ($)" needs an amount above zero. Empty, zero, a negative amount and text that is not a number all fail: "Enter an amount above zero." A dollar sign, commas and spaces in the amount are ignored. Not decided: cents and an upper limit (story 17, R2).

R2. When more than one field of a change fails, each shows its message at the same press.

R3. The check is story 30's, and its rules hold here unchanged: a funding source that is not ticked is not checked (story 30, R1); one failing funding source stops the whole import, changes of every other kind included (R4); the first failing change in the list is brought into view (R5); the next press checks afresh (R6).

R4. A funding source flagged "Not in this workspace" that the person ticked without picking an organization fails with "Pick an organization.", beside the badge and the sentence it already carries. Once an organization is picked, it passes like any other. A ticked funding source that is "Already on file" is checked like any other too.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The check itself: when it runs, what stops, what the person is left with — story 30.
- The funding source change, its three fields, what "Organization" offers, and the tick that picking an organization sets — stories 17 and 75.
- What adding a funding source the record already has does to the Funding sources table — story 17 (R13).
- A funding source left unticked for want of an organization, and whether it is listed as not added — story 75 (R4; Q-35).
- Creating an organization — `organizations-admin`.

## Needs to know from elsewhere

- Every ticked change is checked before anything is added; one failure stops the whole import and leaves the check step as the person set it; a message stays until the next press — owned by story 30 (R1, R4 to R6).
- A funding source change has three editable fields; "Organization" arrives empty when the report names one the workspace does not hold, and such a change arrives unticked but can be ticked by hand — owned by story 17 (R2) and story 75 (R2, R4). Story 75 is in `Blocked by`: of the two stories that state the hand-ticked case, this one is built second and holds its scenarios (S2, S5, S7).
- "Organization", once it holds one, cannot be cleared, so on a change that arrived with an organization that field cannot fail — owned by story 75 (R1).
- A change the record already holds can be ticked — owned by story 32 (R4).
- Each ticked performance measure change is saved as a new entry, and the card's figure is the sum of a measure's entries — owned by story 01 and `performance-measures`.

## Scenarios

All run against the recorded funder report reading in `../fixtures.md`, rows F3 and F10 to F12. "The commit action" is "Add N changes", whatever its count.

**S1 — A funding source with no name** (proves R1)
- Given F11 is ticked and the Contributor has cleared its "Grant or program", or left only spaces in it
- When they press the commit action
- Then in each case "Grant or program" on F11 shows "Name the grant or program."

**S2 — A funding source with no organization** (proves R1, R4)
- Given F12 as it arrived, with "Organization" empty, and the Contributor has ticked it by hand
- When they press the commit action
- Then "Organization" on F12 shows "Pick an organization."

**S3 — A funding source with no amount above zero** (proves R1)
- Given F11 is ticked and its "Secured ($)" is empty, or 0, or −100, or "abc"
- When the Contributor presses the commit action
- Then in each case "Secured ($)" on F11 shows "Enter an amount above zero."

**S4 — Three messages at once** (proves R2)
- Given F12 is ticked by hand with "Organization" empty, and the Contributor has cleared its "Grant or program" and its "Secured ($)"
- When they press the commit action
- Then F12 shows "Name the grant or program.", "Pick an organization." and "Enter an amount above zero.", each on its field

**S5 — Nothing is added** (proves R3)
- Given F3 is ticked and valid, F12 is ticked by hand with "Organization" empty, and "Acres of invasive vegetation removed" reads 12.6 on the project page
- When the Contributor presses the commit action
- Then they are still on the check step, and "Acres of invasive vegetation removed" still reads 12.6

**S6 — An unticked funding source is not checked** (proves R3)
- Given F12 is left as it arrived, unticked, with "Organization" empty
- When the Contributor presses the commit action
- Then the Deer Creek project page opens

**S7 — Put right and pressed again** (proves R3, R4)
- Given F12 shows "Pick an organization." after a failed check
- When the Contributor picks Deer Creek Watershed Alliance on it and presses the commit action
- Then the Deer Creek project page opens, and the record holds the funding source Community Streams Grant, Deer Creek Watershed Alliance, $12,500

## UAT script

The added funding source is seen on the project page through story 17; this script checks the stop through a performance measure figure, which story 01 already shows. The count on the commit action assumes stories 13, 14, 15 and 18 are built, so it is not quoted.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person), in a window wider than 64rem. Nothing has been imported to Deer Creek. Stories 17, 30 and 75 are built. The recorded funder report reading is served for the funder report file. A second browser tab is open on the Deer Creek project page.
Test data: `../fixtures.md`: the funder report, rows F3, F11 and F12; Deer Creek's "Before" figure for "Acres of invasive vegetation removed", 12.6.
Reset: not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import report", choose `deer-creek-completion-report-2025.pdf`, press "Read it" and wait | The check step, with a Funding sources group of three changes |
| 2 | Tick the change for Community Streams Grant without touching its "Organization" | The change is ticked; "Organization" is still empty |
| 3 | Press the commit action | "Pick an organization." on that "Organization"; you are still on the same page |
| 4 | In the second tab, reload the project page and look at "Acres of invasive vegetation removed" | 12.6 |
| 5 | Back on the check step, clear "Grant or program" and "Secured ($)" on the same change and press the commit action | Three messages on that change: "Name the grant or program.", "Pick an organization.", "Enter an amount above zero." |
| 6 | Type Community Streams Grant and $12,500 back in, pick Deer Creek Watershed Alliance, and press the commit action | The Deer Creek project page |
| 7 | Look at "Acres of invasive vegetation removed" | 16.8: the 12.6 of step 4 and row F3's 4.2 |

On the prototype: press "Sample funder report" in place of choosing the file; see `../fixtures.md`, On the prototype.

## Open questions

- Q-35 — R4: if a funding source left out for want of an organization is to be listed as not added, the hand-ticked case may be told the same way.
- Q-68, Q-83, Q-96 — R3: as they change story 30's R5 and R6, they change them here.
- Q-82 — the count on the commit action, which the scenarios and steps leave out.
- Q-88 — the Reset line, and how the recorded reading is served.
- Q-113 — R1: limits on what is typed in "Secured ($)" and "Grant or program".
- Q-122 — R4: whether the "Not in this workspace" badge and sentence go once an organization is picked.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | RUL-122 |
| R2 | shown | RUL-122 |
| R3 | shown | relies on story 30, RUL-21, STA-21 |
| R4 | shown | RUL-123; relies on story 75, STA-15, RUL-17 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (how a typed amount is read at 947; the three checks and their messages at 982-992; the stop at 1035-1039).
- Data shapes: none of its own. A message belongs to one field of one funding source change.
- What the prototype does where nothing is decided (not requirements): as story 30's notes say for focus, announcing and when a message goes; a hand-ticked "Not in this workspace" change keeps its badge and its sentence after an organization is picked.
- Do not copy: the check reading browser-local stores.

</details>
