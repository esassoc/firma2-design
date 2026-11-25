# 18 — A Contributor adds contacts the report names, with no invitation sent

Type: story
Epic: B — What a report can change
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-32, Q-34, Q-45, Q-73, Q-76, Q-87, Q-98, Q-99, Q-128, Q-135 (b), Q-136
Revision: 1
Blocked by: 04, 02, 32, 22, 81
Covers: STA-28, RUL-16, RUL-49, RUL-81, RUL-157, RUL-158, RUL-159, RUL-160, RUL-161, RUL-162, RUL-163, RUL-320, RUL-321, RUL-322, RUL-323, RUL-324
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #14, #42; interview 2026-11-23, Q-135
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R7, on a check step where stories 04, 06 and 32 are built, with story 22's record of the import and story 81's editing of a row (the group, the checkbox, "Already on file", the document's name and the hand edit are used here, not built here), against the recorded sample `deer-creek-contacts-2025.pdf`, which stands in for enabler 02 until it is built. Not released without story 81.

## Story

As a Contributor, I want the people a report names offered as contacts, so that the project lists who to ask about it, without anyone being invited to the workspace by a report.

## Description

This story adds the fourth kind of change to the check step of Import a report: a contact, read as a name, a role, an organization and an email. The person checks it against the document and adds it or leaves it out; a contact has no field to type in. Once added, the contact is a row in the project's Contacts that names the document it came from. The document itself is not kept (spec #42), so the name is text and opens nothing. The row can afterwards be corrected or removed by hand (story 81). Adding a contact gives nobody an account. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report.

## Requirements

R1. A person the report names as a contact is proposed as a change under Contacts, labelled "Contact · `<role>`". It shows the name and the organization on one line, "`<name>`, `<organization>`", and the email on the next, all as text.
- With no role the label is "Contact" alone, with no separator. With no organization the first line is the name alone, with no comma. With no email there is no second line.
- It has no field: the person can tick it or leave it out, and cannot edit it. A wrong one is left out, or corrected on the project page after adding (story 81).
- The heading and the label take the workspace's word for Contact (SR-4). The changes are listed in the order story 04, R4 gives.

R2. An added contact is saved on the project's record as a name, a role, an organization and an email, each as the report gives it, and nothing more. No invitation is sent, no account is created, and the contact is linked to no person in the workspace. The role is the report's text, not a choice from a list. The organization is text: it is not matched against the workspace's organizations, and none is created.

R3. A contact that is not "Already on file" carries one line about the workspace's people: "Matches `<name>` in this workspace.", with the name the workspace has for that person, or "No invitation is sent."
- When the report gives an email, only the email is compared: a person in the workspace with that email is the match.
- When the report gives no email, the name is compared, and a match is said only when exactly one person in the workspace has that name. When two share it, the line reads "No invitation is sent."
- Both comparisons ignore upper and lower case and spaces at either end.
- The match changes that line only: the contact is ticked and saved the same either way.

R4. A contact an import added is a row in the project's Contacts, after the contacts already there, in the order they were added. Its label is its role, and "From `<document name>`" is written under it. A contact with no organization has no organization line.
- "From `<document name>`" is plain text. Nothing opens from it: the document is not kept.
- The line stays after the row's change is published.
- The line is shown only to people who can edit or publish the project. Anyone else sees the row without it, and the document's name is left out of what they are sent.
- The row can be edited and removed by hand (story 81). Edited by hand, it keeps its "From …" line for as long as its import exists.

R5. A contact added with no role is labelled "Contact" in the project's Contacts, in the workspace's word.

R6. The project's Contacts never hold one contact twice because of an import.
- A contact that is "Already on file" (R7) has no checkbox. It cannot be added and is never counted as a change of the import.
- Two contacts in one reading that are the same contact by R7's test are one change: it shows what the first place gives, the first place's quote and "Also stated: `<the other place>`". One contact is added and counted.

R7. A contact is "Already on file" when the record holds that contact.
- The record's contacts are all of them: entered by hand or added by an earlier import, published or not.
- When the report gives an email, only the email is compared. The same email with another name, role or organization is still "Already on file".
- When the report gives no email, the name is compared, so a contact with no email is still proposed, and two with no email and different names are two contacts.
- Both comparisons ignore upper and lower case and spaces at either end.
- A contact "Already on file" shows neither line of R3.
- It is compared again when "Add N changes" is pressed: a ticked contact the record now holds stops the import once, loses its checkbox and is marked (story 32, R5).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Editing or removing a contact on the project page — story 81.
- What the row names as its document when the report was pasted text — story 40.
- Removing the row when the import is undone — story 41.
- A report that names another project, whose contacts arrive unticked — story 20.
- A named party that is neither a contact nor a funder — stories 19 and 27 (`later`).
- Inviting a person to the workspace — `users-and-security`.
- The row in the review — story 24.

## Needs to know from elsewhere

- The reading returns each contact the document names: the name, role, organization and email as written, the quote and where it was read. It is told nothing of the project's contacts or the workspace's people, and matches nothing — enabler 02, not built.
- The workspace's people, by name and email. This story asks for nothing else — owned by `users-and-security`.
- The "Already on file" badge, and the check at the press — story 32 (R3, R5).
- The Contacts group, last of the four, the order inside a group, the tally, the quote, and selecting a change to see its place in the document — story 04. Each change's checkbox — story 06.
- That a contact change has no fields on the check step is also story 07, R6; the scenario for it is S2 here.
- The import records the document's name, and for each change its parts, its quote and where it was read. No file is kept — story 22 (R1, R2).
- The Contacts panel of the project page — owned by `project-record`. Added changes are saved unpublished — owned by `publish-review`.

## Scenarios

S1, S2, S4, S7, S8, S10 and S12 run against the recorded sample `deer-creek-contacts-2025.pdf` (rows F3, F13, F14). No sample holds the data of the others, or the person of S9; they are described by kind.

**S1 — A contact is proposed** (proves R1)
- Given the contacts sample is read for Deer Creek
- When the reading comes back
- Then F14 is listed under Contacts, labelled "Contact · Monitoring contact", ticked, showing "Tomás Ibarra, Granite Bay Ecological Consulting" and t.ibarra@gbec.com

**S2 — Taken or left, not edited** (proves R1; also story 07, R6)
- Given the check step lists F14
- When the Contributor looks for a way to change the name, the role, the organization or the email
- Then all four are text with no field, and the only control on the change is its checkbox

**S3 — No role and no organization** (proves R1)
- Given a report that names a person and an email, with no role and no organization
- When the reading comes back
- Then the change is labelled "Contact", and its first line is the name alone

**S4 — Nobody is invited** (proves R2)
- Given nobody in the workspace has the email t.ibarra@gbec.com
- When the Contributor adds F14
- Then the workspace has no new person and no invitation for t.ibarra@gbec.com

**S5 — An email that matches a person in the workspace** (proves R3)
- Given a report that names a contact under another name, whose email is that of a person in the workspace
- When the reading comes back
- Then the change is ticked and reads "Matches `<name>` in this workspace." with the name the workspace has for that person

**S6 — A name two people share** (proves R3)
- Given a report that names a contact with no email, whose name two people in the workspace both have
- When the reading comes back
- Then the change reads "No invitation is sent." and names neither person

**S7 — No match in the workspace** (proves R3)
- Given nobody in the workspace is named Tomás Ibarra or has his email
- When the contacts sample's reading comes back
- Then F14 reads "No invitation is sent."

**S8 — The row on the project page** (proves R4)
- Given the Contributor added the contacts sample's two ready changes, F14 among them
- When the Deer Creek project page opens
- Then Contacts has a fourth row, for Tomás Ibarra, labelled "Monitoring contact", with "From deer-creek-contacts-2025.pdf" under it as text that opens nothing

**S9 — The document's name is not shown to someone who can neither edit nor publish** (proves R4)
- Given the same import, and a person who can see Deer Creek's record and can neither edit nor publish it, such as a Viewer
- When that person opens the project page
- Then Tomás Ibarra's row is shown with no "From …" line, and the page they were sent does not contain the document's name

**S10 — A row edited by hand keeps its line** (proves R4)
- Given the same import
- When the Contributor changes Tomás Ibarra's role to "Monitoring lead" on the project page
- Then the row is labelled "Monitoring lead" and still shows "From deer-creek-contacts-2025.pdf"

**S11 — A contact with no role, once added** (proves R5)
- Given a report that names a person and an email with no role, and the Contributor added that contact
- When the project page opens
- Then the contact's row is labelled "Contact"

**S12 — A contact the record already has** (proves R6, R7)
- Given Deer Creek's Contacts hold Alma Reyes, Field contact, a.reyes@dcwa.org
- When the contacts sample's reading comes back and the Contributor presses "Add 2 changes"
- Then F13, "Contact · Field contact", carries the badge "Already on file", has no checkbox and shows neither line of R3; afterwards Contacts has one row for a.reyes@dcwa.org, with no "From …" line

**S13 — One person named twice** (proves R6)
- Given a report that names one person with one email in two places, with a different role in each
- When the reading comes back
- Then one contact change is listed, with the first place's role and quote and "Also stated: `<the other place>`"

**S14 — A contact with no email** (proves R7)
- Given a project whose Contacts hold a person with no email, and a report that names that person, in other capitals, and another person, both with no email
- When the reading comes back
- Then the first is "Already on file", and the second is a ticked change with no email line

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person) and can open the workspace's people and its pending invitations. Nothing has been imported to Deer Creek. The test environment serves the recorded sample `deer-creek-contacts-2025.pdf`.
Test data: `../fixtures.md`: the contacts sample, rows F3, F13 and F14; Deer Creek's contacts. The sample is to be made. No sample has a contact who matches a person in the workspace, one with no role, no organization or no email, or one person named twice, and the sample workspace has no Viewer.
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and note the Contacts | Three contacts, Alma Reyes among them |
| 2 | Press "Import a report", choose `deer-creek-contacts-2025.pdf`, press "Read it" and wait | The check step, with a Contacts group last; the tally "2 ready to add · 1 already on file" |
| 3 | Find "Contact · Monitoring contact", and try to change the name | Ticked; "Tomás Ibarra, Granite Bay Ecological Consulting", t.ibarra@gbec.com, and "No invitation is sent."; all of it text, with nothing to type in |
| 4 | Find "Contact · Field contact" | Below the first; "Alma Reyes, Deer Creek Watershed Alliance", a.reyes@dcwa.org, the badge "Already on file", and no checkbox |
| 5 | Press "Add 2 changes" and go to Contacts | The Deer Creek project page; "2 changes added from deer-creek-contacts-2025.pdf"; four contacts |
| 6 | Read the last row | "Monitoring contact", Tomás Ibarra, with "From deer-creek-contacts-2025.pdf" under it; pressing the line opens nothing; Alma Reyes appears once |
| 7 | Open the workspace's people, then its pending invitations, and look for t.ibarra@gbec.com | He is in neither |
| 8 | Back on the project page, change the last row's role to "Monitoring lead" | The row is labelled "Monitoring lead", still with "From deer-creek-contacts-2025.pdf" |

On the prototype: the sample does not exist there, the prototype has no invitations, and no row can be edited; see `../fixtures.md`, On the prototype.

## Open questions

None open. The story rests on these proposed answers:

- Q-128 (proposed) — R1, R3, S3, S6: the label and first line with no role or organization; a name match is said only when one person has the name.
- Q-32 (proposed) — R1, S2: a contact cannot be edited on the check step. Amends spec #13.
- Q-98 (proposed) — R1, R5: "Contact" takes the workspace's word.
- Q-34 (proposed) — R2, R3, R7: matched by email, by name only without one; stored as the report gives it and linked to nobody. Narrows spec #14.
- Q-73 (proposed) — R7, S14: a contact with no email is proposed and matched by name.
- Q-45 (proposed) — R4: the document's name stays with the row although the file is not kept.
- Q-76 (proposed) — R4: the line stays after a publish.
- Q-136 (proposed) — R4, S9: the name reaches only people who can edit or publish.
- Q-135 (b) (proposed) — R4, S10: an imported row edited by hand keeps its line while its import exists. That rows can be edited and removed is decided (Q-135).
- Q-87 (proposed) — R6, R7, S12: an "Already on file" contact has no checkbox and is never counted.
- Q-99 (proposed) — R6, S13: one contact named twice in a reading is one change.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown; proposed (Q-32, Q-98, Q-128) | RUL-16; RUL-157, RUL-163; RUL-320 |
| R2 | decided; shown; proposed (Q-34) | RUL-16; RUL-161 |
| R3 | decided; shown; proposed (Q-34, Q-128) | RUL-16; RUL-158, RUL-159; RUL-321 |
| R4 | decided; shown; decided (spec #42); proposed (Q-45, Q-76, Q-136); decided (interview 2026-11-23, Q-135); proposed (Q-135 (b)) | STA-28; RUL-162; RUL-322; relies on story 22, OBJ-1; relies on story 81, R3, R4 |
| R5 | shown; proposed (Q-98) | RUL-49 |
| R6 | proposed (Q-87, Q-99) | RUL-49; RUL-323 |
| R7 | shown; proposed (Q-34, Q-73, Q-87) | RUL-81, RUL-160; RUL-324; relies on story 32, STA-11 |
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the comparison of names and emails at 345; the match with the workspace's people and with the record's contacts, 614-617 and 665-672; the label at 766-767; the two lines and the match line, absent when on file, 795-804; what an added contact records, 1003-1011); `src/components/projects/firma2-project-contacts.astro` (imported contacts as rows after the others; one row per email; the "Contact" label; the organization line dropped when empty, 160-196); `src/lib/report-imports.ts` (what an imported change wrote; the "From …" line, 203-205).
- Data shapes, as the prototype models them: a contact change is a name, a role, an organization and an email, all text. An added contact holds the same, and the import it came from. Nothing links it to a person in the workspace.
- The prototype differs from the requirements in these: it matches the record by email only, so two contacts with no email count as one (R7); a contact with no role is labelled "Contact · " and one with no organization reads "`<name>`, " (R1); "Matches …" names the first person who matches on email or name (R3); an "Already on file" contact has a checkbox, and ticked it is counted by the import (R6); the "From …" line is shown to everyone (R4); no row can be edited or removed, which is unfinished, not decided (story 81).
- Do not copy: the people to match against are the whole seeded directory passed into the page; imported contacts laid over the Contacts panel from a browser-local store, where the panel knows only the seeded contacts' emails.

</details>
