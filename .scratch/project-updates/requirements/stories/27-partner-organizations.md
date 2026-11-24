# 27 — A Contributor adds partner organizations the report names

Type: story
Epic: B — What a report can change
Release: later
Status: needs-info
Revision: 1
Blocked by: 17
Covers: RUL-58
Sources: not in the prototype; spec #9 (to be corrected); interview 2026-11-23, Q-21
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: nothing. Waiting: R1 on Q-79.

**This story is a stub.** The prototype does not show it. It states the one rule that is decided and lists what must be decided before it can be built or signed off.

## Story

As a Contributor, I want the partner organizations a report names offered as changes, so that the project shows who worked on it without my adding each one by hand.

## Description

In the first release an import proposes four kinds of change, and a partner organization is not one of them. This later story makes it a fifth. It follows story 17 because a partner, like a funder, has to be an organization. Nothing of it is built: the interview (Q-21) decided that it comes later and nothing more.

## Requirements

R1. When a report names a partner organization of the project, the import proposes adding it to the project as a partner organization.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Funding sources and their organizations — story 17. Contacts — story 18.
- The "Not used" list — story 19.
- Creating an organization — `organizations-admin`.

## Needs to know from elsewhere

- An import proposes four kinds of change: performance measure entries, Key facts, funding sources and contacts — owned by story 15.
- A party the report names that is neither a contact nor a funder is listed under "Not used" — owned by story 19. The funder report's "Landowner: Hollis Family Ranch. Not a contact or a funder." is such a line.
- How a funding source's organization is matched to one the workspace holds — owned by story 17. Whether a partner follows the same rule is not decided (Q-79).

## Scenarios

One scenario, for the one rule that is settled. No fixture shows a partner organization change.

**S1 — A partner the report names is proposed** (proves R1)
- Given a report that names an organization as a partner on the project
- When the reading comes back
- Then the check step lists a change that proposes adding that organization to the project as a partner organization

## Open questions

Q-79 holds everything that must be decided. Each part adds requirements, scenarios and the script:

- Q-79 (a) — the section of the check step a partner change sits in.
- Q-79 (b) — what a partner change is made of: the organization alone, or also its part in the project.
- Q-79 (c) — a partner the workspace does not hold: whether the person picks an organization, as for a funding source.
- Q-79 (d) — when a partner is "Already on file".
- Q-79 (e) — how an added partner is shown on the project page, and whether it names its document.
- Q-79 (f) — how a partner is told from a funder or a contact's organization when one organization is named in two parts; it decides which "Not used" lines become changes.
- Q-79, parts (g) to (m) — how a partner's name is matched to the workspace's organizations; whether the person can change or pick the organization, and what a partner the workspace does not hold arrives as; what is saved on "Add N changes", what Undo, the review row and the change history make of it; which feature owns a project's partner organizations; order and repeats inside the section; what the reading returns for a partner. Each adds requirements and scenarios.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided, not built | RUL-58 |

- Prototype files: none for this story. `src/data/firma2-report-import.ts` holds the sample "Not used" line for a landowner.
- Data shapes: none. The prototype has no partner organization change.
- Do not copy: spec #9 lists partner organizations among what an import proposes; that is being corrected, since they are not in the first release.

</details>
