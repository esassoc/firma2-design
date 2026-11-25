# 81 — A Contributor edits or removes a funding source or a contact on the project page

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-16, Q-113, Q-131, Q-134, Q-135 (b), Q-136, Q-137, Q-176
Revision: 1
Blocked by: none
Covers: RUL-411, RUL-412, RUL-413, RUL-414, RUL-415, RUL-416, RUL-417, RUL-418, RUL-419, RUL-420
Sources: not in the prototype (the project page is unfinished: "Add source" and "Add contact" are drawn and not wired, and no row can be edited or removed); interview 2026-11-23, Q-135; spec #1
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Owned by `project-record`; written here so that toast-only Undo is workable; not yet prototyped.

Can start: R1 to R10, on Deer Creek's starting state; no import and no recorded sample is needed. Built here, not showable until stories 17 and 18: an imported row edited by hand keeps its "From …" line (R8), and removing the last imported row takes "Total from all sources" away (R9). Not showable until stories 23, 84 and 41: Undo leaves a row changed by hand alone (R8).

## Story

As a Contributor, I want to correct or remove a funding source or a contact on the project page, so that a wrong row, whether I typed it or an import added it, does not stay on the project's record.

## Description

An import's Undo lives only on the toast. Once the toast is gone, what the import added is corrected by hand on the project page. For performance measure entries and Key facts that is already possible; for a funding source and a contact it is not, because the project page does not yet let anyone change or remove a row. The user decided on 2026-11-23 that it will, in the first release (Q-135). This story is that work. It belongs to `project-record`, which owns the project page, and is written here because funding sources and contacts from an import (stories 17 and 18) do not ship without it.

It is not yet prototyped: the project page is unfinished, and what is missing from it is work not yet done, not a decision. Everything below the decision itself is a proposal. If the story has to be cut down, the least that keeps toast-only Undo workable is "Remove" on each row.

## Requirements

R1. On the project page, a person who can edit the project can change each value of a funding source row: the grant or program, the organization and the amount secured. It makes no difference who or what added the row.

R2. The same person can remove a funding source row. "Remove" asks once, naming the row, before anything is removed; confirmed, the row leaves the table at once.

R3. A person who can edit the project can change each value of a contact row: the name, the role, the organization and the email. It makes no difference who or what added the row.

R4. The same person can remove a contact row, confirmed in the same way.

R5. A value is saved only when it is valid. One that is not is not saved: the row keeps the value it had, and a message says why next to the field (SR-6). The rules are those of the check step's fields (story 65, R1), so a value is held to one rule wherever it is typed:
- Grant or program: some text, at most 200 characters; spaces at either end are dropped. "Name the grant or program."
- Organization: picked from every organization the person can see in the workspace's organization directory, connected organizations included, A to Z, with typing to find one. It is never typed in, and it can be changed but not cleared.
- Amount secured: whole US dollars, above zero and below one trillion; a "$" and separators are accepted and the amount is shown with separators. "Enter an amount above zero."; "Enter whole dollars, without cents."
- Contact name: some text. "Enter a name."
- Email: empty, or an email address. "Enter an email address, such as name@example.org."
- Role and contact organization: free text, and either can be empty. The organization of a contact is text, not a choice from the workspace's organizations (story 18, R2).

R6. A change that would make two rows the same is refused, with a message next to the field: a funding source given the grant or program and organization of another row on the project ("This project already has that funding source."), or a contact given the email of another contact on the project ("This project already has a contact with that email."). Names and emails are compared ignoring upper and lower case and spaces at either end.

R7. Each change and each removal saves at once and is unpublished, like any hand edit: on the record straight away, in the review as a waiting change, and not public until a Manager publishes. The project's change history gains a row for it with the person, the day and what changed, and names no source.

R8. A row an import added, once changed or removed by hand, is a hand edit from then on.
- Changed, it keeps its "From `<document name>`" line for as long as its import exists. Who is shown that line is unchanged (stories 17, R9 and 18, R4).
- The import's Undo leaves a row changed by hand as it is, and passes over one removed by hand (story 84). When the import is undone, a row that stayed loses its "From …" line (story 41).
- The import's own record, its row in the change history and its count are not changed by the hand edit.

R9. The Funding sources table follows the change at once. "Total from all sources", when it shows, adds the amounts as they now stand, and it goes when the table no longer holds a row an import added (story 17, R11). The estimated total cost is not changed by editing or removing a row. The share a row shows is `project-record`'s to work out.

R10. Someone who cannot edit the project sees the rows with no way to change or remove them. The right is checked again when a change or a removal is saved: if the person has lost it since the page opened, nothing is saved and the page says they can no longer edit the project.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Adding a funding source or a contact by hand ("Add source", "Add contact") — `project-record`, not part of what Q-135 decided.
- Proposing funding sources and contacts from a report, and their rows on the project page — stories 17 and 18.
- What Undo says when a row was changed by hand since — story 84. Undo of each kind of change — story 41.
- How a changed or removed row reads in the review, and that the review marks an imported figure changed by hand as differing from the document's (spec #36) — `publish-review`.
- Removing an organization that a funding source names: refused — `organizations-admin`.
- The workspace's list of funding sources, and Funding Status — the `funding-sources` feature (`later`, not built).

## Needs to know from elsewhere

- Every edit on the project page saves at once and waits for publish (spec #1) — owned by `project-record` and `publish-review`.
- Who can edit a project: a Contributor of an organization that leads it, or an Administrator — owned by `users-and-security` (SR-3).
- A funding source on the record points at its organization, not at the organization's name as text, so a rename follows through — owned by `project-record`.
- A hand edit's row in the change history shows who and when and names no source; only a change from a document or a data source names one — story 22, R7.
- An imported row's "From `<document name>`" line, and that it is shown only to people who can edit or publish the project — stories 17 (R9) and 18 (R4), built after this story; they hold the scenarios for an imported row edited by hand.
- The Funding sources table, its columns and shares, and the Contacts panel — owned by `project-record`.

## Scenarios

All run on Deer Creek's starting state in `../fixtures.md`: two funding sources and three contacts, all entered by hand, and no import. S11 and S12 need a person the sample workspace lacks, described by kind. R8 has no scenario here: it needs an imported row, so its scenarios are story 17, S8 and story 18, S10 (the line is kept) and stories 84 and 41 (Undo).

**S1 — Change a funding source's amount** (proves R1, R7)
- Given Deer Creek's Local Sponsor Match row reads $156,500
- When the Contributor changes its amount to $160,000, then reloads the project page
- Then the row reads $160,000, and the change is waiting in the review, not public

**S2 — Change a funding source's organization** (proves R1, R5)
- Given the Local Sponsor Match row names Deer Creek Watershed Alliance
- When the Contributor opens its organization and types "Pac"
- Then the list offers the organizations they can see, narrowed to those that match, with no way to type in a new one or to leave the field empty; picking Pacific Fisheries Trust saves it

**S3 — An invalid amount is not saved** (proves R5)
- Given the Local Sponsor Match row reads $156,500
- When the Contributor types 0, or 156,500.50, as its amount
- Then the field shows "Enter an amount above zero." or "Enter whole dollars, without cents.", and after a reload the row still reads $156,500

**S4 — Remove a funding source** (proves R2, R9)
- Given Deer Creek's Funding sources has two rows
- When the Contributor presses "Remove" on Local Sponsor Match and confirms
- Then the table has one row, Watershed Resilience Grant Program, and "Estimated total cost" still reads $412,000

**S5 — Remove, then think better of it** (proves R2)
- Given the Contributor pressed "Remove" on Local Sponsor Match
- When they cancel at the question
- Then the row is still there, unchanged

**S6 — Change a contact** (proves R3, R7)
- Given Deer Creek's Contacts hold Ivy Nakamura, Grant manager
- When the Contributor changes her role to "Program officer", then reloads the project page
- Then her row is labelled "Program officer"

**S7 — An invalid email is not saved** (proves R5)
- Given Ivy Nakamura's email is i.nakamura@cwrb.org
- When the Contributor types "nakamura at cwrb" over it
- Then the field shows "Enter an email address, such as name@example.org.", and after a reload the email is still i.nakamura@cwrb.org

**S8 — Remove a contact** (proves R4)
- Given Deer Creek's Contacts hold three people
- When the Contributor presses "Remove" on Alma Reyes and confirms
- Then Contacts hold two people, and Alma Reyes is not one of them

**S9 — Two rows cannot become the same** (proves R6)
- Given Deer Creek's two funding sources, and its contacts Ivy Nakamura and Alma Reyes
- When the Contributor gives Local Sponsor Match the name Watershed Resilience Grant Program and the organization California Watershed Restoration Board, or gives Ivy Nakamura the email A.Reyes@dcwa.org
- Then neither is saved, and the field shows "This project already has that funding source." or "This project already has a contact with that email."

**S10 — The change history** (proves R7)
- Given the Contributor changed Local Sponsor Match to $160,000
- When they open History on the project page
- Then a row shows their name, today's date and the change from $156,500 to $160,000 on Local Sponsor Match, and names no source

**S11 — Someone who cannot edit** (proves R10)
- Given a person who can see Deer Creek's record and cannot edit it, such as a Viewer
- When they open the project page
- Then the funding source and contact rows show no way to change or remove them

**S12 — The right to edit lost before saving** (proves R10)
- Given a Contributor has the project page open, and their right to edit Deer Creek is taken away
- When they change a funding source's amount
- Then nothing is saved, and the page says they can no longer edit this project

## UAT script

This cannot be walked on the prototype: the project page does not yet offer any of it.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Nothing has been imported to Deer Creek.
Test data: `../fixtures.md`: Deer Creek's funding sources and contacts in the starting state. No recorded sample is used. The sample workspace has no Viewer, so S11 and S12 are not walked.
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and read Funding sources | Two rows: Watershed Resilience Grant Program, $255,500, and Local Sponsor Match, $156,500 |
| 2 | Change the amount of Local Sponsor Match to $160,000, then reload the page | The row reads $160,000 |
| 3 | Type 0 as its amount | "Enter an amount above zero."; after a reload the row still reads $160,000 |
| 4 | Open its organization and type a name the workspace does not hold | Nothing matches, and nothing offers to add an organization or to empty the field |
| 5 | Open History | A row with your name, today's date and the change from $156,500 to $160,000; no source is named |
| 6 | Press "Remove" on Local Sponsor Match, and cancel | The row is still there |
| 7 | Press "Remove" on it again, and confirm | One row is left; "Estimated total cost" still reads $412,000 |
| 8 | In Contacts, change Ivy Nakamura's role to "Program officer" | Her row is labelled "Program officer" |
| 9 | Give her the email a.reyes@dcwa.org | "This project already has a contact with that email."; her email is unchanged |
| 10 | Press "Remove" on Alma Reyes and confirm | Two contacts are left |

## Open questions

None open. One part of this story is decided: that a funding source and a contact can be edited and removed on the project page, in the first release, owned by `project-record` (interview 2026-11-23, Q-135). The rest stands on these proposed answers:

- Q-176 (proposed) — everything Q-135 did not say: (a) who may do it, R1 to R4 and R10; (b) what is validated, R5; (c) that "Remove" asks first, R2 and R4; (d) that two rows cannot become the same, R6; (e) what the change history shows, R7.
- Q-113 (proposed) — R5: the limits on a grant's name and its amount, the same as on the check step.
- Q-131, Q-134 (proposed) — R5: the organization is picked from the organizations the person can see, never typed, and the record points at the organization.
- Q-135 (b) (proposed) — R8: an imported row edited by hand keeps its "From …" line while its import exists.
- Q-137 (proposed) — R8: Undo leaves alone a row changed or removed by hand.
- Q-136 (proposed) — R8: who is shown the "From …" line.
- Q-16 (proposed) — the owner: `project-record` owns a project's funding sources until the `funding-sources` feature exists.

<details>
<summary>Notes for whoever builds it</summary>

Every requirement is not yet prototyped.

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided (interview 2026-11-23, Q-135); proposed (Q-176 (a)) — not yet prototyped | RUL-411 |
| R2 | decided (interview 2026-11-23, Q-135); proposed (Q-176 (c)) — not yet prototyped | RUL-412 |
| R3 | decided (interview 2026-11-23, Q-135); proposed (Q-176 (a)) — not yet prototyped | RUL-413 |
| R4 | decided (interview 2026-11-23, Q-135); proposed (Q-176 (c)) — not yet prototyped | RUL-414 |
| R5 | proposed (Q-176 (b), Q-113, Q-131, Q-134) — not yet prototyped | RUL-415 |
| R6 | proposed (Q-176 (d)) — not yet prototyped | RUL-416 |
| R7 | decided (spec #1); proposed (Q-176 (e)) — not yet prototyped | RUL-417 |
| R8 | proposed (Q-135 (b), Q-137, Q-136) — not yet prototyped | RUL-418 |
| R9 | proposed (Q-176 (b)) — not yet prototyped | RUL-419; the total row is story 17's (R11), which is built after this story |
| R10 | decided (SR-3); proposed (Q-176 (a)) — not yet prototyped | RUL-420 |
- Wording provisional: "Remove" and its question; "Enter a name."; "Enter an email address, such as name@example.org."; "This project already has that funding source."; "This project already has a contact with that email."; the line that says the person can no longer edit the project. "Name the grant or program.", "Enter an amount above zero." and "Enter whole dollars, without cents." are story 65's and must match it.
- Prototype files, for where the rows are drawn today: `src/components/projects/firma2-project-funding.astro` ("Add source", not wired, 122-139; the columns, 283-306; imported rows and the total row, 313-327); `src/components/projects/firma2-project-contacts.astro` (the rows, 160-196).
- Data shapes: none in the prototype. A funding source is a grant or program, an organization and an amount; a contact is a name, a role, an organization and an email, all text.
- How a value is edited (in place, or in a form for the row) is the team's to decide with `project-record`; the story only asks that each change saves at once.

</details>
