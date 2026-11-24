# 18 — A Contributor adds contacts the report names, with no invitation sent

Type: story
Epic: B — What a report can change
Release: first
Status: needs-info
Revision: 1
Blocked by: 04, 02, 32, 22
Covers: STA-28, RUL-16, RUL-49, RUL-81, RUL-157, RUL-158, RUL-159, RUL-160, RUL-161, RUL-162, RUL-163
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #14
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R7, on a check step where stories 04, 06 and 32 are built and with story 22's record of the import (the group, the checkbox, "Already on file" and the document's name are used here, not built here), and only against the recorded funder report reading in `../fixtures.md`, which stands in for enabler 02 (not built). Waiting: the parts marked "Not decided" or "open", each on the question named beside it.

## Story

As a Contributor, I want the people a report names offered as contacts, so that the project lists who to ask about it, without anyone being invited to the workspace by a report.

## Description

This story adds the fourth kind of change to the check step of Import a report: a contact, read as a name, a role, an organization and an email. The person checks it against the document and adds it or leaves it out. Once added, the contact is a row in the project's Contacts that names the document it came from. Adding a contact gives nobody an account. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report.

## Requirements

R1. A person the report names as a contact is proposed as a change under Contacts, in the reading's order, labelled "Contact · `<role>`". It shows the name and the organization on one line, "`<name>`, `<organization>`", and the email on the next, all as text. Not decided: the label and the first line when the reading gives no role or no organization (Q-128); whether "Contact" takes the workspace's word (Q-98).

R2. An added contact is saved on the project's record as a name, a role, an organization and an email, each as the reading gave it, and nothing more. No invitation is sent and no account is created. The organization is text: it is not matched against the workspace's organizations, and none is created.

R3. A contact that is not "Already on file" carries one line about the workspace's people: "Matches `<name>` in this workspace." when its email or its name is that of a person in the workspace, with that person's name; otherwise "No invitation is sent." Either match is enough, and both ignore upper and lower case and spaces at either end. The match changes that line only: the contact is ticked and saved the same either way, and nothing links it to the person. (open: Q-34, Q-73) Not decided: which person is named when the email matches one and the name another (Q-128).

R4. A contact an import added is a row in the project's Contacts, after the contacts already there, in the order they were added. Its label is its role, and "From `<document name>`" is written under it. A contact with no organization has no organization line. Not decided: whether the row keeps the "From …" line after its change is published (Q-76).

R5. A contact added with no role is labelled "Contact" in the project's Contacts.

R6. A contact added when the project's Contacts already hold that email is not shown a second time: the contact already there is the one kept. (open: Q-34, Q-73) Not decided: whether such a contact still counts as a change of the import (Q-87); two contacts in one reading with one email, which are both proposed (Q-99).

R7. A contact is "Already on file" when its email is that of a contact on the record. (open: Q-34, Q-73)
- The record's contacts are all of them: entered by hand or added by an earlier import, published or not.
- Only the email is compared, ignoring upper and lower case and spaces at either end. The same email with another name, role or organization is still "Already on file".
- A contact "Already on file" shows neither line of R3.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Editing a contact before adding it: it can only be ticked or left out — story 07, R6.
- A contact read from pasted text, and what its row names as its document — story 40.
- Removing the row when the import is undone — story 41.
- A named party that is neither a contact nor a funder — stories 19 and 27 (`later`).
- Inviting a person to the workspace — `users-and-security`.

## Needs to know from elsewhere

- The reading returns each contact the document names: the name, role, organization and email as written, and the quote. It matches nothing to the workspace or the record — enabler 02, not built (Q-89).
- The workspace's people, by name and email. This story asks for nothing else — owned by `users-and-security`.
- The "Already on file" state: the badge, arriving unticked, that the person can still tick it, and that it is worked out once, when the check step opens — story 32 (R3 to R5).
- The Contacts group, last of the four, the quote, and selecting a change to see its passage — story 04. Each change's checkbox — story 06.
- The document's name is the file's name, as the import records it — story 22, R1.
- The Contacts panel of the project page — owned by `project-record`. Added changes are saved unpublished — owned by `publish-review`.

## Scenarios

S1, S2, S4, S5, S7 and S8 run against the recorded funder report reading in `../fixtures.md`, rows F13 and F14; the reading's other rows belong to other stories. No fixture shows S3 or S6; their data is described by kind.

**S1 — A contact is proposed** (proves R1)
- Given the funder report is read for Deer Creek
- When the reading comes back
- Then F14 is listed under Contacts, labelled "Contact · Monitoring contact", showing "Tomás Ibarra, Granite Bay Ecological Consulting" and t.ibarra@gbec.com

**S2 — Nobody is invited** (proves R2)
- Given nobody in the workspace has the email t.ibarra@gbec.com
- When the Contributor adds F14
- Then the workspace has no new person and no invitation for t.ibarra@gbec.com

**S3 — A match in the workspace** (proves R3)
- Given a report that names a contact under another name, whose email is that of a person in the workspace
- When the reading comes back
- Then the change is ticked and reads "Matches `<name>` in this workspace." with the name the workspace has for that person

**S4 — No match in the workspace** (proves R3)
- Given nobody in the workspace is named Tomás Ibarra or has his email
- When the funder report's reading comes back
- Then F14 reads "No invitation is sent."

**S5 — The row on the project page** (proves R4)
- Given the Contributor added F14
- When the Deer Creek project page opens
- Then Contacts has a fourth row, for Tomás Ibarra, labelled "Monitoring contact", with "From deer-creek-completion-report-2025.pdf" under it

**S6 — A contact with no role** (proves R5)
- Given a report that names a person and an email with no role, and the Contributor added that contact
- When the project page opens
- Then the contact's row is labelled "Contact"

**S7 — An email already in Contacts** (proves R6)
- Given Deer Creek's Contacts hold Alma Reyes, Field contact, a.reyes@dcwa.org, and the Contributor ticked F13, which arrived "Already on file", and added it
- When the project page opens
- Then Contacts has one row for a.reyes@dcwa.org, with no "From …" line

**S8 — A contact the record already has** (proves R7)
- Given Deer Creek's Contacts hold a.reyes@dcwa.org
- When the funder report's reading comes back
- Then F13, "Contact · Field contact", is unticked, carries the badge "Already on file", and shows neither "No invitation is sent." nor a "Matches …" line

## UAT script

Step 5 adds the funder report's seven ready changes, which needs stories 13, 14, 15, 17 and 75 built as well (75 for the funding source that arrives unticked). Without them, stop after step 4.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person) and can open the workspace's people and its pending invitations. Nothing has been imported to Deer Creek. The recorded funder report reading is served for the funder report file.
Test data: `../fixtures.md`: the funder report, rows F13 and F14; Deer Creek's contacts. The count of seven waits on Q-82. No fixture has a contact who matches a person in the workspace, one with no role, one with no organization, or one with no email.
Reset: not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and note the Contacts | Three contacts, Alma Reyes among them |
| 2 | Press "Import report", choose `deer-creek-completion-report-2025.pdf`, press "Read it" and wait | The check step, with a Contacts group last |
| 3 | Find "Contact · Field contact" | Unticked; "Alma Reyes, Deer Creek Watershed Alliance", a.reyes@dcwa.org, and the badge "Already on file" |
| 4 | Find "Contact · Monitoring contact" | Ticked; "Tomás Ibarra, Granite Bay Ecological Consulting", t.ibarra@gbec.com, and "No invitation is sent." |
| 5 | Press "Add 7 changes" and go to Contacts | The Deer Creek project page; four contacts |
| 6 | Read the last row | "Monitoring contact", Tomás Ibarra, with "From deer-creek-completion-report-2025.pdf" under it; Alma Reyes appears once |
| 7 | Open the workspace's people, then its pending invitations, and look for t.ibarra@gbec.com | He is in neither |

On the prototype: press "Sample funder report" in place of choosing the file; see `../fixtures.md`, On the prototype. Step 7 cannot be walked there: the prototype has no invitations.

## Open questions

- Q-34 — R3, R6, R7 and S3: whether a contact is matched by name as well as email, whether a matched contact is linked to the person, and whether the role is picked from a list.
- Q-73 — R1, R6 and R7: whether a contact with no email is proposed, and how it is then matched; it adds a requirement and a scenario.
- Q-76 — R4 and S5: part (a), whether "From `<document name>`" stays once the change is published.
- Q-89 — R1 and R3 assume the reading returns the contact as written and matches nothing.
- Q-82 — step 5: the count of seven.
- Q-88 — the Reset line, and how the recorded reading is served.
- Q-99 — would change R6: whether the second of two contacts with one email in a reading is proposed.
- Q-87 — would change R6 and S7: whether a ticked "Already on file" contact is added, refused or passed over, and whether the import counts it.
- Q-128 — would change R1 and R3: the label and first line of a contact with no role or no organization; which person "Matches …" names when two match.
- Q-98 — would change R1, R4 and R5: "Contact" in the label, and as the row's label, would read as the workspace's word.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | RUL-16; RUL-157, RUL-163 |
| R2 | decided; shown | RUL-16; RUL-161 |
| R3 | decided; shown | RUL-16; RUL-158, RUL-159 |
| R4 | decided; shown | STA-28; RUL-162; relies on story 22, OBJ-1 |
| R5 | shown | RUL-49 |
| R6 | shown | RUL-49 |
| R7 | shown | RUL-81, RUL-160; relies on story 32, STA-11 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the comparison of names and emails at 345; the match with the workspace's people and with the record's contacts, 614-617 and 665-672; the label at 766-767; the two lines and the match line, absent when on file, 795-804; what an added contact records, 1003-1011); `src/components/projects/firma2-project-contacts.astro` (imported contacts as rows after the others; one row per email; the "Contact" label; the organization line dropped when empty, 160-196); `src/lib/report-imports.ts` (what an imported change wrote; the "From …" line, 203-205).
- Data shapes, as the prototype models them: a contact change is a name, a role, an organization and an email, all text. An added contact holds the same, and the import it came from. Nothing links it to a person in the workspace.
- What the prototype does where nothing is decided (not requirements): it matches the record by email only, where spec #14 says email or name (Q-34); two contacts with no email would count as one on the check step (Q-73); the "From …" line stays after a publish (Q-76); a contact with no role is labelled "Contact · " on the check step, and one with no organization reads "`<name>`, " (Q-128); "Matches …" names the first person in the workspace's list that matches on either count (Q-128); a ticked "Already on file" contact is recorded and counted by the import and draws no row (Q-87).
- Do not copy: the people to match against are the whole seeded directory passed into the page; imported contacts laid over the Contacts panel from a browser-local store, where the panel knows only the seeded contacts' emails.

</details>
