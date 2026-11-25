# 27 — A Contributor adds partner organizations the report names

Type: story
Epic: B — What a report can change
Release: later
Status: needs-triage
Built on proposals awaiting validation: Q-79
Revision: 1
Blocked by: 17, 41, 75, and a partner organizations section on the project page (`project-record`, later, not built)
Covers: RUL-58, RUL-369, RUL-370, RUL-371, RUL-372, RUL-373, RUL-374, RUL-375, RUL-376, RUL-377, RUL-378
Sources: not in the prototype; spec #9 (to be corrected); interview 2026-11-23, Q-21
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: nothing in the first release; this story is `later`. When it is taken up: R1 to R11, once story 17 and the stories it stands on are built. Waiting on a feature that is not built: a partner organizations section on the project page, owned by `project-record`, which the page does not have today; R9 and R10 have nowhere to show until it exists. Nothing waits on a question.

## Story

As a Contributor, I want the partner organizations a report names offered as changes, so that the project shows who worked on it without my adding each one by hand.

## Description

In the first release an import proposes four kinds of change, and a partner organization is not one of them: a party the report names that is neither a funder nor a contact goes to "Not used". This later story makes a partner organization a fifth kind. Nothing of it is prototyped and nothing in the product shows a project's partners yet, so every rule below except R1 is a proposal that reuses the funding source construction (stories 17 and 75), made with low confidence: there is no built behavior to follow. It has no UAT script until the project page's partner section exists.

## Requirements

R1. When a report names an organization as a partner of the project, the import proposes adding it to the project as a partner organization.

R2. Partner changes sit in their own section of the check step, named and placed as the project page's partner section is, with the workspace's own word in the heading.

R3. A partner change is the organization alone. It carries no part in the project (landowner, contractor), and the check step shows one field, "Organization".

R4. The organization the report names is matched to the workspace's organizations by the funding source rule (story 17, R8): letter for letter, ignoring upper and lower case and spaces at either end, against every organization the person can see in the workspace's directory, connected organizations included. No near match is offered.

R5. A partner whose organization the workspace does not hold arrives flagged "Not in this workspace" and unticked, with "Organization" empty, exactly as a funding source does (story 75): the person picks an existing organization, which ticks the change and removes the badge and its sentence; a picked organization can be changed but not cleared; a partner is never added without one. On a partner that did match, the person can pick another organization the same way.

R6. A partner is "Already on file" when the project already has that organization as a partner. It then has no checkbox and is never counted as a change, because adding it would change nothing. This is worked out again when the person changes the organization and when "Add N changes" is pressed, as story 32, R5 has it: a ticked partner the project gained meanwhile stops the import once and is re-marked.

R7. An organization the report names both as a funder and as a partner is proposed once in each section: a funding source change and a partner change, each ticked or left on its own.

R8. Inside the section the changes are in the check step's order: ready, "Not in this workspace", "Already on file", and within each the document's order. The same partner named twice in one reading is one change, from the first place, with "Also stated: `<the other place>`".

R9. Adding a partner change saves the organization on the project as a partner, unpublished, like any other change. Undo, the review row and the change history treat it as they treat a contact (stories 41 and 84, 24, 22).

R10. A partner an import added shows in the project page's partner list with "From `<document name>`", as text; nothing opens. The line is shown only to people who can edit or publish the project.

R11. For a partner the reading service returns the organization's name as the report writes it, its quote and the place it was read from, and nothing else. It is told nothing about the workspace's organizations; every match is made in code.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Funding sources and their organizations — stories 17, 75 and 86. Contacts — story 18.
- The partner section of the project page itself, and adding, editing or removing a partner there by hand — `project-record`, later, not built.
- A party the report names that is not a partner, a funder or a contact: still listed under "Not used" — story 19.
- Creating an organization — `organizations-admin`.

## Needs to know from elsewhere

- An import proposes four kinds of change in the first release — story 15, R1. This story adds a fifth when it ships.
- How a funding source's organization is matched, picked and flagged; "Organization" offers every organization the person can see, A to Z, with typing to find one — stories 17 (R8) and 75 (R1 to R4).
- The check at the press, which stops an import once when a ticked change no longer stands — story 32 (R5, R6).
- A change read twice from one document that the record can hold only once is folded into one, with "Also stated: …" — stories 18 and 86 for a contact and a funding source.
- "From `<document name>`" is plain text and is shown only to people who can edit or publish the project; the file is not kept — stories 17 (R9) and 22 (R7); the standing requirements.
- `project-record` owns a project's partner organizations. The project page does not show them today.
- A party that is neither a contact nor a funder is listed under "Not used" with that reason — story 19. Once this story ships, the funder report's "Landowner: Hollis Family Ranch" stays there unless the report calls the landowner a partner.

## Scenarios

No sample shows a partner organization change; every scenario describes its data by kind.

**S1 — A partner the report names is proposed** (proves R1, R2, R3)
- Given a report that names, as a partner on the project, an organization the workspace holds and the project does not have as a partner
- When the reading comes back
- Then the check step lists one ready change under the partner section's heading, showing that organization in "Organization" and nothing else to fill

**S2 — Matched whatever the capitals** (proves R4)
- Given a report that writes the name of an organization the workspace holds in other capitals
- When the reading comes back
- Then the partner change arrives ready with that organization in "Organization"

**S3 — A partner the workspace does not hold** (proves R5)
- Given a report that names as a partner an organization the workspace does not hold
- When the reading comes back
- Then the change is unticked with "Not in this workspace", "Organization" is empty, and the tally counts it under "need you"

**S4 — Picking an organization** (proves R5)
- Given the change of S3
- When the Contributor picks an organization in "Organization"
- Then the change is ticked, and its badge and sentence are gone

**S5 — A partner the project already has** (proves R6)
- Given a report that names as a partner an organization the project already has as a partner
- When the reading comes back
- Then the change carries "Already on file", has no checkbox, and is not counted on the commit action

**S6 — A funder that is also a partner** (proves R7)
- Given a report that names one organization as the funder of a grant and as a partner
- When the reading comes back
- Then the check step lists a funding source change and a partner change for it, each with its own checkbox

**S7 — The same partner named twice** (proves R8)
- Given a report that names one partner in two places
- When the reading comes back
- Then one partner change is listed, with the first place's quote and "Also stated: `<the other place>`"

**S8 — Adding a partner** (proves R9, R10)
- Given a ready partner change is ticked
- When the Contributor adds the changes
- Then the project page's partner list shows that organization with "From `<document name>`", and the project has one more unpublished change

**S9 — Undo takes the partner back** (proves R9)
- Given the import of S8 was just added and its toast is showing
- When the Contributor presses "Undo"
- Then the organization is no longer in the project's partner list

**S10 — Someone who can neither edit nor publish** (proves R10)
- Given the partner of S8 is on the project
- When a person who can see the project but neither edit nor publish it opens the project page
- Then the partner's row shows no "From …" line

**S11 — What the reading is told** (proves R11)
- Given a report that names a partner
- When the document is sent to be read
- Then nothing about the workspace's organizations is sent, and the reading returns the partner's name as written, its quote and its place

## Open questions

None open. The story rests on one proposed answer, given with low confidence because nothing is built to follow:

- Q-79 (proposed) — R2 to R11, each part: the section (a); the organization alone (b), so its part in the project does not arise (m); the pick for one the workspace does not hold (c, h); "Already on file" (d); the "From …" line (e); funder and partner both (f); the matching rule (g); what is saved, and Undo, review and history as for a contact (i); the owner, `project-record` (j); order and repeats (k); what the reading returns (l). If the user wants a partner to carry its part in the project, R3 changes and the section needs a second field.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided, not built | RUL-58 |
| R2 | proposed (Q-79) | RUL-369 |
| R3 | proposed (Q-79) | RUL-370 |
| R4 | proposed (Q-79) | RUL-371 |
| R5 | proposed (Q-79) | RUL-372 |
| R6 | proposed (Q-79) | RUL-373 |
| R7 | proposed (Q-79) | RUL-374 |
| R8 | proposed (Q-79) | RUL-375 |
| R9 | proposed (Q-79) | RUL-376 |
| R10 | proposed (Q-79); decided (spec #42) for "nothing opens" | RUL-377 |
| R11 | proposed (Q-79) | RUL-378 |
- Not yet prototyped: all of it. The project page has no partner section; that section belongs to `project-record` and blocks this story.
- R6 departs from the letter of Q-79 (i), which says a partner the project gained meanwhile is "passed over". It is written on the one rule every other kind of change follows (story 32, R5): the press stops once and the change is re-marked, so the count on the action is always what is written.
- Prototype files: none for this story. `src/data/firma2-report-import.ts` holds the sample "Not used" line for a landowner.
- Data shapes: none. The prototype has no partner organization change.
- Do not copy: spec #9 lists partner organizations among what an import proposes; that is being corrected, since they are not in the first release.

</details>
