# 20 — A Contributor is warned when the report names another project

Type: story
Epic: B — What a report can change
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-63, Q-74, Q-83, Q-98, Q-130
Revision: 1
Blocked by: 04, 02, 06, 22
Covers: STA-19, RUL-27, RUL-166, RUL-167, RUL-168, RUL-334, RUL-335, RUL-336, RUL-337, RUL-338
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report` (the warning is not on the deployed prototype); spec #20; interview 2026-11-23, Q-26
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R4, on story 04's check step with story 06's checkbox (used here, not built here), against a recorded reading of a report that names another project. No recorded sample is one: the tester's two reports of the UAT script are to be made, with their recordings. Built here, not showable until a later story: what R4 records is first seen in the review (story 24).

## Story

As a Contributor, I want to be told when the report I chose is about a different project, so that I do not put one project's figures on another project's record.

## Description

An import is started from one project and reads one document, and a person can pick the wrong file. The reading returns every project name the report states; the check step works out, in code, whether one of them is this project. When none is, it says so above the changes, names the other project, and leaves every change unticked: the person can still add them, by ticking them on purpose. The import then carries the fact, so the Manager who publishes knows the document may be about other work. The warning is decided for the first release and cannot be seen on the deployed prototype: only the developer-machine reader raises it, and no sample document does.

## Requirements

R1. When the report names one or more projects and none of them is the project the import was started from, the check step shows a warning between the tally and the first group of changes, titled "This report names another project", with the text "It is about “`<name in the report>`”.", where the name is as the report writes it.
- When the report names several other projects, the text names the first and counts the rest: "It is about “`<name>`” and `<N>` other projects." ("and 1 other project" for one).
- It is there when the check step opens and stays for as long as that reading is on the page. The person cannot dismiss it, and nothing they do to the changes removes it.
- It is announced to assistive technology once, when the check step opens.
- It is the same whichever way the document was given, a file or pasted text. The title takes the workspace's own word for Project.

R2. The warning blocks nothing, and it unticks everything. Every change of such a report that could be added arrives unticked, with its values as read and no badge of its own, and is counted under "need you" in the tally. A change flagged for a reason of its own keeps its badge and sentence; an "Already on file" change and a change kept by a data source keep their own state. The person can tick any of them, and "Add N changes" then adds the ticked ones and asks nothing more because of the warning.

R3. When the report names this project, or names no project, no warning is shown and the changes arrive as under any report. Whether a name the report states is this project is worked out by the check step, in code. It is this project when any of these holds:
- the two names are the same once upper and lower case, spaces, punctuation and digits are ignored;
- one of the two names contains the other, compared the same way;
- the report gives this project's number.
When the report names several projects and this one is among them, there is no warning. An abbreviation or an older name of the project is not recognised and raises the warning.

R4. When changes of a report that named another project are added, the import records that it did, and the name as the report writes it (the first, when there are several).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Showing a Manager that the report named another project: the line "This report names another project: “`<name>`”." above the import's changes in the review — story 24. The change history row is unchanged — story 22.
- A document that covers several projects, and sending a change to the project the report names — not in build 1 (spec #20).
- Starting an import from somewhere the project is picked after the reading — not in build 1.
- Leaving the check step to read another document, which takes the warning away with the reading — story 35.
- Pasting text in place of choosing a file — story 09.
- The "Needs you" badge and what a flagged change shows — story 14.

## Needs to know from elsewhere

- The reading returns every project name the document states, as written, and any project number: a list, which may be empty. It does not say whether one of them is this project — enabler 02 (R6).
- The tally and its "need you" part, and the groups of changes the warning sits above — story 04 (R2, R3).
- Each change that can be added has a checkbox; which changes arrive ticked; a change ticked by hand is counted under "ready to add"; with nothing ticked the action reads "Nothing ticked" — story 06 (R1, R3, R4, R5).
- "Add N changes" saves the added changes to the project the import was started from, whatever the report names, with no confirmation step — story 01 (R10, R11).
- What an import records: who added it, when, the document's name, each change with its quote — story 22 (R1), which lists R4's two facts among them.

## Scenarios

No recorded sample shows this: every sample names Deer Creek Riparian Corridor Enhancement or no project. Each scenario describes its document by kind and runs against a recorded reading of it. "The other-project report" is a report that names one project with a wholly different name and proposes three performance measure entries for Deer Creek's measures, all of which would be ready under any other report.

**S1 — A report about another project** (proves R1)
- Given the import was started from Deer Creek Riparian Corridor Enhancement, and the other-project report has been read
- When the check step opens
- Then a warning titled "This report names another project" sits between the tally and the first group of changes and reads "It is about “`<name in the report>`”.", with the name as the report writes it

**S2 — Its changes arrive unticked, as read** (proves R2)
- Given the same reading
- When the check step opens
- Then the three changes are listed below the warning, each unticked, with its amount as read and no badge

**S3 — They count as needing the person** (proves R2)
- Given the same reading
- When the check step opens
- Then the tally reads "3 need you" and the action reads "Nothing ticked"

**S4 — A change ticked on purpose can be added** (proves R2)
- Given the same check step
- When the Contributor ticks one change and presses "Add 1 change"
- Then that one entry is on Deer Creek's record, with no further question asked

**S5 — The import carries the fact** (proves R4)
- Given the Contributor has added one change of the other-project report
- When the import is read back from the record
- Then it says the report named another project, and holds the name as the report writes it

**S6 — A report about this project** (proves R3)
- Given the import was started from Deer Creek Riparian Corridor Enhancement, and the document names "Deer Creek Riparian Corridor Enhancement"
- When the check step opens
- Then no warning is shown and the ready changes arrive ticked

**S7 — A report that names no project** (proves R3)
- Given a document with figures and no project name
- When the check step opens
- Then no warning is shown

**S8 — The same name, written differently** (proves R3)
- Given the import was started from Deer Creek Riparian Corridor Enhancement, and the document names "DEER CREEK riparian-corridor enhancement 2025"
- When the check step opens
- Then no warning is shown

**S9 — One name contains the other** (proves R3)
- Given the import was started from Deer Creek Riparian Corridor Enhancement, and the document names "Deer Creek Riparian Corridor"
- When the check step opens
- Then no warning is shown

**S10 — The project's number** (proves R3)
- Given a project that has a number, and a document that names another title and gives that number
- When the check step opens
- Then no warning is shown

**S11 — Several projects, this one among them** (proves R3)
- Given a document that names three projects, one of them Deer Creek Riparian Corridor Enhancement
- When the check step opens
- Then no warning is shown

**S12 — Several other projects** (proves R1)
- Given a document that names three projects, none of them this one
- When the check step opens
- Then the warning reads "It is about “`<first name>`” and 2 other projects."

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Stories 01, 04 and 06 are built. The test environment serves a recorded reading for each of the two reports below, which are to be made. Step 7's result is seen through story 24.
Test data: no sample in `../fixtures.md`. Two reports, each proposing three performance measure entries for Deer Creek's measures that would all be ready: one written about a project with a wholly different name, and one that names Deer Creek Riparian Corridor Enhancement in full.
Reset: reset the sample project in the test environment. The script leaves one entry on Deer Creek.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import a report", choose the report about the other project, press "Read it" and wait | The check step, with a warning under the tally and above the changes: "This report names another project" and "It is about “`<name in the report>`”." |
| 2 | Read the tally, the changes and the action | "3 need you"; three changes, each unticked, with its amount filled and no badge; the action reads "Nothing ticked" |
| 3 | Click another change, then look for a way to close the warning | The warning is still there, and has nothing to close it |
| 4 | Go back to the project page by the breadcrumb and press "Import a report" again | The choose step, with no file held |
| 5 | Choose the report about Deer Creek, press "Read it" and wait | The check step, with no warning; "3 ready to add" and "Add 3 changes" |
| 6 | Go back, and read the report about the other project again; tick the first change | The tally reads "1 ready to add · 2 need you" and the action "Add 1 change" |
| 7 | Press "Add 1 change" | The Deer Creek project page, with that one entry added. In the review (story 24), the line "This report names another project: “`<name>`”." stands above this import's change |

On the prototype: none of this can be walked on the deployed site; see `../fixtures.md`, Not in any fixture.

## Open questions

None open. The proposals this story rests on:

- Q-63 (proposed) — R2, S2 to S4: the changes arrive unticked, as read, with no badge of their own.
- Q-74 (proposed) — R1, R3, S8 to S12: how a name is matched, in code; several projects named.
- Q-83 (proposed) — R1: the warning is announced once.
- Q-98 (proposed) — R1: the title takes the workspace's word for Project.
- Q-130 (proposed) — R4, S5: the import records that the report named another project.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown; proposed (Q-74); proposed (Q-83); proposed (Q-98) | STA-19, RUL-27; RUL-166, RUL-167; RUL-334; RUL-335; RUL-336 |
| R2 | decided; proposed (Q-63) | RUL-27, RUL-168; RUL-337; relies on story 01, RUL-20; relies on story 06, RUL-10 |
| R3 | decided; proposed (Q-74) | STA-19, RUL-27; RUL-334 |
| R4 | proposed (Q-130) | RUL-338 |
- Wording provisional: "It is about “`<name>`” and `<N>` other projects." (R1).
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the warning box in the page, between the tally and the groups, 157-163; shown or hidden when a reading comes back, 512-514; hidden again when the next reading starts, 547); `scripts/report-reader.mjs` (the developer-machine reader, the only thing that raises it: how two names are compared, 169-174 and 337; what it does to the changes, 437-439).
- Data shapes, as the prototype models them: the reading carries the project's name as the document writes it, and whether that is this project.
- Where the developer-machine reader differs from the requirements above: it decides the match itself and returns one project name per document; its comparison also ignores a final "s" and does not test whether one name contains the other, nor a project number; it marks each change of such a report as supporting two readings, so each would carry a badge; nothing about the warning is kept with the import.
- Do not copy: the developer-machine reader is not the reading service.

</details>
