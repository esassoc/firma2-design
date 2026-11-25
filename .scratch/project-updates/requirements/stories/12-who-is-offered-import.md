# 12 — A Contributor is offered Import a report on every project they can edit, and nobody else is

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-39, Q-43, Q-109
Revision: 1
Blocked by: 01, 08
Covers: RUL-28, RUL-57, RUL-59, RUL-67, RUL-293, RUL-294, RUL-295
Sources: not in the prototype, which checks no role and offers the page on one project; spec #21, #41; interview 2026-11-23, Q-22 and Q-28
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R6, on the entry points and page that stories 01 and 08 build (used here, not built here), once `users-and-security` can say whether a person can edit a project; until it can, only against a stand-in that answers that one question. The standard no-access page of R6 is `users-and-security`'s; until it exists, against a stand-in page. Nothing waits on a question.

## Story

As a Contributor, I want Import a report on every project I can edit, whatever its stage and whatever plan the workspace is on, so that I can get what a report says onto any record I am responsible for without retyping it.

## Description

Stories 01 and 08 build the three entry points and the page for one project and one person. This story says who is offered them and where: everyone who can edit the project, on every such project, on every plan, and nobody else. The right is checked when the page opens and again at each step that sends or saves something, so a page left open does not outlive the right it was opened with. It adds no role and no permission; whether a person can edit a project is answered by `users-and-security`, and for a shared project by `connected-orgs`. Nothing of this can be seen in the prototype.

## Requirements

R1. In a workspace where reading by an outside AI service is on, anyone who can edit a project is offered Import a report on it: they see the three entry points on the project page and can open the Import a report page.

R2. Import a report is on every plan. No part of it is locked by plan, and nothing about it asks the person to upgrade.

R3. It is offered on every project the person can edit, whatever the project's stage. That includes a proposal, a completed project and a shared project from a connected organization. It is also offered on a project with no performance measure, or with no closed reporting period: Key facts, funding sources and contacts can still be proposed, and the report's figures are listed under "Not used" with the reason (story 19).

R4. The workspace permission "Import data" governs bulk project import. It does not govern Import a report: a Contributor is offered Import a report on a project they can edit when "Import data" is set to administrators only.

R5. A person who cannot edit the project is offered none of the three entry points. They are absent, not disabled: the project page shows them no "Import a report" button on the Performance measures card and no "Import a report" action, in the header or in its "…" menu. A file they drop on the project page starts nothing and brings up none of story 08's messages.

R6. A person who cannot edit the project cannot use the Import a report page.
- At the page's address they are shown the product's standard no-access page, with a way back to the project. Nothing of the Import a report page, no document's name, no quote and no unpublished value is sent to them.
- The right is checked when the page opens, again when "Read it" is pressed, before the document is sent, and again when "Add N changes" is pressed, before anything is saved.
- When the right is gone at either press, nothing is sent or saved, the reading and the file are discarded, and the person is shown the no-access page with one more line: "Nothing was added."
- Someone with no account is taken to sign in first. The page then opens if they can edit the project; otherwise they see the no-access page.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The card button — story 01. The header action and dropping a file — story 08.
- A workspace where reading by an outside AI service is off or unavailable: no entry point, and a line that says why — story 83. Who may change the setting — story 82.
- Who is shown a document's name and a change's quote after an import — stories 22 and 24.
- Who can publish an imported change — `publish-review`.
- What the check step lists when a project has no performance measure or no closed reporting period — story 19.
- Roles, the Manager flag, and who can edit a shared project — `users-and-security` and `connected-orgs`.

## Needs to know from elsewhere

- A person can edit a project when they have the Contributor role in an organization that leads it, or are an Administrator; a Viewer cannot — owned by `users-and-security`. This story asks one thing of it, for a person and a project: can they edit it. It also uses its standard no-access page and its sign-in.
- Who can edit a shared project from a connected organization — owned by `connected-orgs`.
- Someone who may not act never receives the page, a document's name, a change's quote or an unpublished value (SR-3); R6 is that rule for this page.
- The three entry points are the "Import a report" button on the Performance measures card (story 01), the "Import a report" action in the project page's header, and a readable file dropped on the project page (story 08). Story 01 (R14) makes the same two checks at the presses; what the person then sees is R6 here.
- Import a report exists only while the workspace's setting is on (SR-9) — owned by story 82. Where the right to edit and the setting would both stop a person, the right to edit is tested first (story 83, R3).
- Which plans a workspace can be on — owned by `plans`.
- A draft project a person can edit is a proposal — owned by `project-intake`.

## Scenarios

`../fixtures.md` has Deer Creek and one person who can edit it. It has no Viewer, no second organization's Contributor, no proposal, no completed or shared project and no second plan; the scenarios describe those by kind. All assume reading by an outside AI service is on.

**S1 — A Contributor of the lead organization sees the entry points** (proves R1)
- Given a Contributor in Deer Creek Watershed Alliance, which leads Deer Creek
- When they open the Deer Creek project page
- Then the Performance measures card has the "Import a report" button and the header has the "Import a report" action

**S2 — An Administrator opens the page** (proves R1)
- Given an Administrator who is in no organization that leads Deer Creek, on the Deer Creek project page
- When they press "Import a report" on the card
- Then the Import a report page opens for Deer Creek

**S3 — Every plan** (proves R2)
- Given one workspace on each plan the product has, each with a project its Contributor can edit
- When each Contributor opens their project page
- Then each is offered the "Import a report" button, with no lock and no prompt to upgrade

**S4 — Every stage** (proves R3)
- Given a Contributor who can edit a proposal, a completed project and a shared project from a connected organization
- When they open each project page
- Then the "Import a report" action is in the header of all three

**S5 — A project with no performance measure** (proves R3)
- Given a Contributor who can edit a project that has no performance measure
- When they open its project page
- Then the "Import a report" action is in the header, and it opens the Import a report page

**S6 — "Import data" does not apply** (proves R4)
- Given a workspace where "Import data" is set to administrators only, and a Contributor in Deer Creek Watershed Alliance
- When the Contributor opens the Deer Creek project page and presses "Import a report" on the card
- Then the Import a report page opens

**S7 — A Viewer is shown no entry point** (proves R5)
- Given a Viewer who can see Deer Creek
- When they open the Deer Creek project page
- Then the Performance measures card has no "Import a report" button, enabled or disabled, and the header has no "Import a report" action

**S8 — A drop by someone who cannot edit starts nothing** (proves R5)
- Given a Contributor whose organizations do not lead Deer Creek and who cannot edit it, on the Deer Creek project page
- When they drop `deer-creek-crew-log-2025.xlsx` on the page
- Then the project page stays as it was, no reading starts and no message about a report shows

**S9 — The address gives the no-access page** (proves R6)
- Given a Viewer who can see Deer Creek and has the address of its Import a report page
- When they open that address
- Then they see the product's standard no-access page with a way back to Deer Creek: no file control, no "Read it", and nothing of a reading

**S10 — The right is gone before "Read it"** (proves R6)
- Given a Contributor on the choose step for Deer Creek with `deer-creek-crew-log-2025.xlsx` held, whose right to edit Deer Creek an Administrator has since taken away
- When they press "Read it"
- Then no reading starts, and they see the no-access page with "Nothing was added."

**S11 — The right is gone before "Add N changes"** (proves R6)
- Given a Contributor on the check step with the crew log's six changes listed, whose right to edit Deer Creek an Administrator has since taken away
- When they press "Add 6 changes"
- Then they see the no-access page with "Nothing was added.", and to someone who can see Deer Creek its figures are still the fixture's "Before" column

**S12 — No account** (proves R6)
- Given a visitor with no session who has the address of Deer Creek's Import a report page
- When they open that address and sign in as the Contributor of Deer Creek Watershed Alliance
- Then they are asked to sign in first, and the Import a report page then opens on the choose step

## UAT script

Preconditions: a workspace where reading by an outside AI service is on and "Import data" is set to administrators only, holding Deer Creek, a proposal and a completed project, all three led by Deer Creek Watershed Alliance. Four accounts: a Contributor in that organization, an Administrator in no organization that leads Deer Creek, a Viewer, and a Contributor in another organization only. The test environment serves the recorded sample `deer-creek-crew-log-2025.xlsx`. Two browser windows for steps 8 to 10.
Test data: `../fixtures.md`: Deer Creek and its "Before" figures; the crew log, rows C1 to C6. The accounts and the two extra projects are to be made; no sample holds them. The script does not cover a shared project or a second plan, which need a second workspace.
Reset: none needed for the record; nothing is added. After step 10, give the Contributor back the right to edit Deer Creek.

| # | Do this | You should see |
|---|---|---|
| 1 | Sign in as the Contributor of Deer Creek Watershed Alliance and open Deer Creek | "Import a report" on the Performance measures card, and "Import a report" in the header |
| 2 | Press "Import a report" on the card | The Import a report page for Deer Creek. Note its address |
| 3 | Open the proposal, then the completed project | "Import a report" in the header of both |
| 4 | Sign in as the Administrator, open Deer Creek and press "Import a report" on the card | The Import a report page for Deer Creek |
| 5 | Sign in as the Viewer and open Deer Creek | No "Import a report" button on the card, not even a greyed one, and no "Import a report" in the header |
| 6 | As the Viewer, open the address noted in step 2 | The no-access page, with a way back to Deer Creek: no file control and no "Read it" |
| 7 | Sign in as the Contributor of the other organization, open Deer Creek and drop the crew log on the page | No entry point; after the drop the project page is as it was, with no message |
| 8 | In the first window, sign in as the Contributor of Deer Creek Watershed Alliance, open Import a report for Deer Creek, choose the crew log, press "Read it" and wait | Six changes, and "Add 6 changes" |
| 9 | In the second window, as the Administrator, take away that Contributor's right to edit Deer Creek (for example, make them a Viewer) | The change is saved |
| 10 | In the first window, press "Add 6 changes" | The no-access page, with "Nothing was added." As the Administrator, Deer Creek's figures are still the "Before" column |

## Open questions

None open. The story rests on these proposed answers:

- Q-39 (proposed) — the entry points are absent, not disabled, and the address gives the standard no-access page (R5, R6, S7 to S9, steps 5 to 7).
- Q-43 (proposed) — Import a report is offered on a project with no performance measure or no closed reporting period (R3, S5).
- Q-109 (proposed) — the right to edit is checked again on "Read it" and on "Add N changes", and what the person sees when it is gone (R6, S10 to S12, steps 8 to 10).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; decided (spec #41) | RUL-28; RUL-293 |
| R2 | decided | RUL-28 |
| R3 | decided; proposed (Q-43) | RUL-67; RUL-294 |
| R4 | decided | RUL-59 |
| R5 | proposed (Q-39) | RUL-57 |
| R6 | proposed (Q-39); proposed (Q-109) | RUL-57; RUL-295 |
- Wording provisional: "Nothing was added." on the no-access page (R6). The rest of that page is `users-and-security`'s.
- The labels and placement of the entry points are stories 01 and 08's (the card button reads "Import a report"; the header action is a visible icon; neither needs Edit pressed).
- Prototype files: `src/pages/prototypes/projects/[project]/import-report.astro` (the page exists only for a project with a scripted reading); `docs/roles-and-permissions.md` (the "Import data" permission, to be corrected to say it is about bulk project import).
- Data shapes: none. The one question is whether this person can edit this project.
- Where the prototype differs from the requirements above: nothing is checked at any point, so there is no behavior to read; its card button sits on the Performance measures card, which a project with no performance measure may not show in the same form, so on such a project the header action is the sure way in (S5).
- Do not copy: the absence of any permission check; the page and its entry points existing for one project only; the hard-coded signed-in person.

</details>
