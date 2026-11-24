# 20 — A Contributor is warned when the report names another project

Type: story
Epic: B — What a report can change
Release: first
Status: needs-info
Revision: 1
Blocked by: 04, 02
Covers: STA-19, RUL-27, RUL-166, RUL-167, RUL-168
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report` (the warning is not on the deployed prototype); spec #20; interview 2026-11-23, Q-26
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R3, on story 04's check step (its tally and groups are used here, not built here), and only against a recorded reading that says the document names another project; no fixture has one, and enabler 02, which says so for a real document, is not built. Waiting: the parts marked "Not decided" or "open", each on the question named beside it.

## Story

As a Contributor, I want to be told when the report I chose is about a different project, so that I do not put one project's figures on another project's record.

## Description

An import is started from one project and reads one document, and a person can pick the wrong file. When the reading finds that the document names a different project, the check step of Import a report says so above the changes and names that project. The changes are still shown, and the person decides what to do. The warning is decided for the first release and cannot be seen on the deployed prototype: only the developer-machine reader raises it, and no sample document does.

## Requirements

R1. When the report names a project other than the one the import was started from, the check step shows a warning between the tally and the first group of changes, titled "This report names another project", with the text "It is about “`<name in the report>`”.", where the name is as the report writes it.
- It is there when the check step opens and stays for as long as that reading is on the page. The person cannot dismiss it, and nothing they do to the changes removes it.
- It is the same whichever way the document was given, a file or pasted text.
- Not decided: whether it is announced to assistive technology (Q-83); whether the title takes the workspace's word for Project (Q-98).

R2. The warning blocks nothing: the report's changes are listed below it, each in the state it would have under any report, and can be added. "Add N changes" asks nothing more because of the warning. Not decided: whether the changes arrive unticked, and if so how each is marked (Q-63); whether the import, the review or the change history says afterwards that the report named another project (Q-130).

R3. When the report names this project, or names no project, no warning is shown. The reading service compares the two names and says whether they are the same project (enabler 02). As the developer-machine reader does it, they are the same when they match once upper and lower case, spaces, punctuation and digits are ignored, and a final "s". (open: Q-74) Not decided: what the warning says when the report names several other projects (Q-74).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- A document that covers several projects, and sending a change to the project the report names — not in build 1 (spec #20).
- Starting an import from somewhere the project is picked after the reading — not in build 1.
- Leaving the check step to read another document, which takes the warning away with the reading — story 35.
- Pasting text in place of choosing a file — story 09.

## Needs to know from elsewhere

- The reading is told the project's name. It returns the project's name as the document writes it, and whether that is this project — enabler 02 (R5, R6), not built. Story 02 does not state how the two names are compared; R3 holds the rule until it does.
- The tally and the groups of changes on the check step, which the warning sits between — story 04 (R2, R3).
- "Add N changes" saves the added changes to the project the import was started from, whatever the report names, with no confirmation step — story 01, R10 and R11.

## Scenarios

No fixture shows this: none of the three sample documents names another project. Each scenario describes its document by kind and runs against a recorded reading of it.

**S1 — A report about another project** (proves R1)
- Given the import was started from Deer Creek Riparian Corridor Enhancement, and the reading says the document names a different project
- When the check step opens
- Then a warning titled "This report names another project" sits between the tally and the first group of changes and reads "It is about “`<name in the report>`”.", with the other project's name as the report writes it

**S2 — The changes are still listed** (proves R2)
- Given the same reading, which proposes performance measure entries
- When the check step opens
- Then each proposed change is listed below the warning, with its label, amount and quote

**S3 — A report about this project** (proves R3)
- Given the import was started from Deer Creek Riparian Corridor Enhancement, and the document names "Deer Creek Riparian Corridor Enhancement"
- When the check step opens
- Then no warning is shown above the changes

**S4 — A report that names no project** (proves R3)
- Given a document with figures and no project name
- When the check step opens
- Then no warning is shown above the changes

**S5 — The same name, written differently** (proves R3)
- Given the import was started from Deer Creek Riparian Corridor Enhancement, and the document names "DEER CREEK riparian-corridor enhancement 2025"
- When the check step opens
- Then no warning is shown above the changes

## UAT script

The script stops at the check step: whether the changes under the warning arrive ticked is not decided (Q-63), so the step that adds them cannot be written yet.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). A recorded reading is served for each of the two documents below.
Test data: no fixture. One report written about a project with a wholly different name, and one that names Deer Creek Riparian Corridor Enhancement in full, each proposing performance measure entries for Deer Creek's measures.
Reset: none needed. The script adds nothing.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import report", choose the report about the other project, press "Read it" and wait | The check step, with a warning under the tally and above the changes: "This report names another project" and "It is about “`<name in the report>`”." with that project's name |
| 2 | Read below the warning | The changes read from the report |
| 3 | Click another change, then look for a way to close the warning | The warning is still there, and has nothing to close it |
| 4 | Go back to the project page by the breadcrumb and press "Import report" again | The choose step, with no file held |
| 5 | Choose the report about Deer Creek, press "Read it" and wait | The check step, with no warning above the changes |

On the prototype: none of this can be walked on the deployed site; see `../fixtures.md`, Not in any fixture.

## Open questions

- Q-63 — R2, S2 and where the script stops: whether the changes of such a report arrive unticked. The developer-machine reader marks each one as supporting two readings, so each would carry story 14's "Needs a decision" badge.
- Q-74 — R3, S3, S5 and the Test data: part (a), how a name is matched to this project (an abbreviation, an older name, a project number); part (b), the warning's words when several other projects are named.
- Q-83 — R1: part (b), whether a warning like this one is announced.
- Q-88 — how a recorded reading is served.
- Q-98 — would change R1 and S1: the title names a renameable noun.
- Q-130 — would change R2: adds what is kept and shown, after the changes are added, about the report having named another project.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | STA-19, RUL-27; RUL-166, RUL-167 |
| R2 | decided | RUL-27; RUL-168; relies on story 01, RUL-20 |
| R3 | decided; shown, developer-machine reader only | STA-19; RUL-27 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the warning box in the page, between the tally and the groups, 157-163; shown or hidden when a reading comes back, 512-514; hidden again when the next reading starts, 547); `scripts/report-reader.mjs` (the developer-machine reader, the only thing that raises it: how two names are compared, 169-174 and 337; what it does to the changes, 437-439).
- Data shapes, as the prototype models them: the reading carries the project's name as the document writes it, and whether that is this project.
- What the developer-machine reader does where nothing is decided (not requirements): every change of such a report that does not count another quantity is marked as supporting two readings, so it arrives unticked (Q-63); it returns one project name per document (Q-74). Nothing about the warning is kept with the import (Q-130).
- Do not copy: the developer-machine reader is not the reading service.

</details>
