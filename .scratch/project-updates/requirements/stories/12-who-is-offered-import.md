# 12 — A Contributor is offered Import a report on every project they can edit, and nobody else is

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 01, 08
Covers: RUL-28, RUL-57, RUL-59, RUL-67
Sources: not in the prototype, which checks no role and offers the page on one project; spec #21; interview 2026-11-23, Q-22 and Q-28
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R6, on the entry points and page that stories 01 and 08 build (used here, not built here), once `users-and-security` can say whether a person can edit a project; until it can, only against a stand-in that answers that one question. Waiting: what someone who cannot edit the project is shown at the page's address, in R6, on Q-39; confirmation of R5 and R6, which are the writer's reading of spec #21, on Q-39; a project with no performance measures, in R3, on Q-43; when the right to edit is checked again, in R6, on Q-109.

## Story

As a Contributor, I want Import a report on every project I can edit, whatever its stage and whatever plan the workspace is on, so that I can get what a report says onto any record I am responsible for without retyping it.

## Description

Stories 01 and 08 build the three entry points and the page for one project and one person. This story says who is offered them and where: everyone who can edit the project, on every such project, on every plan, and nobody else. It adds no role and no permission; whether a person can edit a project is answered by `users-and-security`, and for a shared project by `connected-orgs`. Nothing of this can be seen in the prototype.

## Requirements

R1. Anyone who can edit a project is offered Import a report on it: they see the three entry points on the project page and can open the Import a report page.

R2. Import a report is on every plan. No part of it is locked by plan, and nothing about it asks the person to upgrade.

R3. It is offered on every project the person can edit, whatever the project's stage. That includes a proposal, a completed project and a shared project from a connected organization. Not decided: whether it is offered on a project with no performance measure or no closed reporting period, where there is nothing to file an entry under (Q-43).

R4. The workspace permission "Import data" governs bulk project import. It does not govern Import a report: a Contributor is offered Import a report on a project they can edit when "Import data" is set to administrators only.

R5. A person who cannot edit the project is offered none of the three entry points: the project page shows them no "Import report" button and no "Import a report" action, in the header or in its "…" menu, and a readable file they drop on it starts nothing. (open: Q-39)

R6. A person who cannot edit the project cannot open the Import a report page by its address, and receives none of its content. Not decided: what they are shown in its place (Q-39); whether the right to edit is checked again on "Read it" and on "Add N changes", and what a person who lost it since opening the page then sees (Q-109).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The card button — story 01. The header action and dropping a file — story 08.
- Who can open the kept document — enabler 03.
- Who can open an imported change in the review, and publish it — story 24.
- What the check step offers when a project has no closed reporting period — story 07 (R3, Q-43).
- Roles, the Manager flag, and who can edit a shared project — `users-and-security` and `connected-orgs`.

## Needs to know from elsewhere

- A person can edit a project when they have the Contributor role in an organization that leads it, or are an Administrator; a Viewer cannot — owned by `users-and-security`. This story asks one thing of it, for a person and a project: can they edit it.
- Who can edit a shared project from a connected organization — owned by `connected-orgs`.
- Someone who may not act never receives the page, the document or an unpublished value (SR-3); R6 is that rule for this page.
- The three entry points are the "Import report" button on the Performance measures card (story 01), the "Import a report" action in the project page's header, and a readable file dropped on the project page (story 08).
- Which plans a workspace can be on — owned by `plans`.
- A draft project a person can edit is a proposal — owned by `project-intake`.

## Scenarios

`../fixtures.md` has Deer Creek and one person who can edit it. It has no Viewer, no second organization's Contributor, no proposal, no completed or shared project and no second plan; the scenarios describe those by kind.

**S1 — A Contributor of the lead organization sees the entry points** (proves R1)
- Given a Contributor in Deer Creek Watershed Alliance, which leads Deer Creek
- When they open the Deer Creek project page
- Then the Performance measures card has the "Import report" button and the header has the "Import a report" action

**S2 — An Administrator opens the page** (proves R1)
- Given an Administrator who is in no organization that leads Deer Creek, on the Deer Creek project page
- When they press "Import report"
- Then the Import a report page opens for Deer Creek

**S3 — Every plan** (proves R2)
- Given one workspace on each plan the product has, each with a project its Contributor can edit
- When each Contributor opens their project page
- Then each is offered the "Import report" button, with no lock and no prompt to upgrade

**S4 — Every stage** (proves R3)
- Given a Contributor who can edit a proposal, a completed project and a shared project from a connected organization
- When they open each project page
- Then the "Import a report" action is in the header of all three

**S5 — "Import data" does not apply** (proves R4)
- Given a workspace where "Import data" is set to administrators only, and a Contributor in Deer Creek Watershed Alliance
- When the Contributor opens the Deer Creek project page and presses "Import report"
- Then the Import a report page opens

**S6 — A Viewer is shown no entry point** (proves R5)
- Given a Viewer who can see Deer Creek
- When they open the Deer Creek project page
- Then the Performance measures card has no "Import report" button and the header has no "Import a report" action

**S7 — A drop by someone who cannot edit starts nothing** (proves R5)
- Given a Contributor whose organizations do not lead Deer Creek and who cannot edit it, on the Deer Creek project page
- When they drop `deer-creek-crew-log-2025.xlsx` on the page
- Then the project page stays as it was and no reading starts

**S8 — The address is refused** (proves R6)
- Given a Viewer who can see Deer Creek and has the address of its Import a report page
- When they open that address
- Then they are not shown the Import a report page: no file control, no "Read it", and nothing of a reading

## UAT script

Preconditions: a workspace where "Import data" is set to administrators only, holding Deer Creek, a proposal and a completed project, all three led by Deer Creek Watershed Alliance. Four accounts: a Contributor in that organization, an Administrator in no organization that leads Deer Creek, a Viewer, and a Contributor in another organization only. Keep the address of Deer Creek's Import a report page from step 2.
Test data: `../fixtures.md`: Deer Creek, and the crew log file for step 7. No fixture has the accounts or the two extra projects; whoever sets up the test creates them. The script does not cover a shared project or a second plan, which need a second workspace.
Reset: none needed. The script reads nothing and adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Sign in as the Contributor of Deer Creek Watershed Alliance and open Deer Creek | "Import report" on the Performance measures card, and "Import a report" in the header |
| 2 | Press "Import report" | The Import a report page for Deer Creek. Note its address |
| 3 | Open the proposal, then the completed project | "Import a report" in the header of both |
| 4 | Sign in as the Administrator, open Deer Creek and press "Import report" | The Import a report page for Deer Creek |
| 5 | Sign in as the Viewer and open Deer Creek | No "Import report" button on the card and no "Import a report" in the header |
| 6 | As the Viewer, open the address noted in step 2 | Not the Import a report page: no file control and no "Read it" |
| 7 | Sign in as the Contributor of the other organization, open Deer Creek and drop the crew log on the page | No entry point; after the drop the project page is as it was |

On the prototype: none of this can be walked; see `../fixtures.md`, The person.

## Open questions

- Q-39 — R5, R6, S6 to S8 and steps 5 to 7: confirms that the entry points are hidden, and decides what step 6 shows in place of the page.
- Q-30, Q-31 — S1, S4, S6 and steps 1, 3 and 5: the label of the card button and where the header action sits.
- Q-40 — steps 1, 3 and 4: whether the tester must press Edit on the project page before the entry points show.
- Q-43 — R3, S4 and step 3: whether a project with no performance measure or no closed reporting period still shows the entry points; a proposal may be such a project.
- Q-109 — would change R6: adds when the right to edit is checked after the page is open, and what is shown when it is gone; adds a scenario.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided | RUL-28 |
| R2 | decided | RUL-28 |
| R3 | decided | RUL-67 |
| R4 | decided | RUL-59 |
| R5 | inferred | RUL-57 |
| R6 | inferred | RUL-57 |

- Prototype files: `src/pages/prototypes/projects/[project]/import-report.astro` (the page exists only for a project with a scripted reading); `docs/roles-and-permissions.md` (the "Import data" permission, to be corrected to say it is about bulk project import).
- Data shapes: none. The one question is whether this person can edit this project.
- What the prototype does where nothing is decided (not requirements): the "Import report" button is on the Performance measures card, which a project with no performance measure may not show in the same form (Q-43); nothing is checked at any point, so there is no behavior to read for Q-109.
- Do not copy: the absence of any permission check; the page and its entry points existing for one project only; the hard-coded signed-in person.

</details>
