# 17 — A Contributor adds funding sources the report names and sees them on the project page

Type: story
Epic: B — What a report can change
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-45, Q-76, Q-87, Q-98, Q-113, Q-131, Q-133, Q-134, Q-135 (b), Q-136
Revision: 1
Blocked by: 06, 02, 32, 22, 81
Covers: ACN-15, RUL-80, RUL-169, RUL-170, RUL-171, RUL-172, RUL-173, RUL-174, STA-29, RUL-48, RUL-176, RUL-177, RUL-178, RUL-315, RUL-316, RUL-317, RUL-318, RUL-319
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; `/prototypes/projects/deer-creek-riparian-corridor-enhancement`, after adding the sample funder report; spec #15, #10, #42; interview 2026-11-23, Q-135
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (ACN, STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1, R2, R7 and R8, on a check step where stories 04, 06 and 32 are built (their groups, checkboxes, tally and "Already on file" badge are used here, not built here); R9 to R13, on the project page's Funding sources table, once story 22 records the import and its document's name and story 81 lets a row be edited by hand. All of it against the recorded sample `deer-creek-funding-2025.pdf`, which stands in for enabler 02 until it is built. Not released without stories 65, 75 and 81.

## Story

As a Contributor, I want the funding sources a report names offered as changes I can correct before adding, so that the project shows who funded it without my retyping the grant.

## Description

This story adds the third kind of change to the check step of Import a report: a funding source, made of a grant or program, an organization and an amount secured. The person can correct all three before adding, and a funding source the record already holds is marked "Already on file". Once added, the funding source is seen in the project page's Funding sources table: the row, the name of the document it came from, and a total row that appears because the sources may now exceed the estimated total cost. The document itself is not kept (spec #42), so the name is text and opens nothing. The row can afterwards be corrected or removed by hand (story 81).

Three neighbours hold the cases cut from this story; requirements R3 to R6 moved to story 75 on 2026-11-23 and their numbers are not reused. Story 75: an organization the workspace does not hold, and a funding source read with no organization or no amount. Story 65: what stops the import. Story 86: a funding source the record or the reading already holds with another amount. See the change at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report, and the row at `/prototypes/projects/deer-creek-riparian-corridor-enhancement`, after adding it.

## Requirements

R1. Each funding source the reading returns is proposed as one change under Funding sources, with three fields holding what was read: "Grant or program", "Organization" (as R8 matches it) and "Secured ($)". Every such change carries the same label, "Funding source"; the grant's name is shown in "Grant or program" and nowhere in the label. The heading, the label and "Organization" take the workspace's words for Funding source and Organization (SR-4). The changes are listed in the order story 04, R4 gives.

R2. The person can edit all three fields, whatever state the change is in and whether or not it is ticked. Editing a field neither ticks nor unticks the change. What the fields hold when the change is added is what is saved: a funding source on the project's record with that name, organization and amount.
- "Grant or program" is free text. Spaces at either end are dropped when it is saved.
- "Organization" is picked from the workspace's organizations, never typed. What the list offers is story 75, R1.
- "Secured ($)" is an amount in whole US dollars; there is no other currency. It shows thousands separators when it arrives and again when the person leaves the field: "48,000". A "$", separators and spaces typed into it are accepted.
- What each field refuses, and the stop, are story 65's.

R7. A funding source is "Already on file" when the record holds a funding source with the same grant or program, as R8 compares names, the same organization, and the same amount. The record's funding sources are all of them: entered by hand or added by an earlier import, published or not.
- The organization compared is the one the report's name was matched to, not the name as text, so an organization renamed since still matches.
- An "Already on file" funding source has no checkbox. It cannot be added and is never counted as a change of the import.
- When every funding source the reading returns is "Already on file", the group is still listed, and none of its changes has a checkbox.
- The same grant and organization with another amount is not "Already on file": it is a change to that row (story 86). The state follows the person's edits and is worked out again when "Add N changes" is pressed (story 86, R3 and R4).

R8. Two names match when they are the same letter for letter, ignoring upper and lower case and spaces at either end. A shorter form, an abbreviation or another spelling is not a match, and no near match is suggested. The report's organization is matched this way against every organization the person can see in the workspace's organization directory, connected organizations included; when one matches, "Organization" arrives holding it, in the workspace's spelling. When none matches — story 75.

R9. A funding source an import added is a row in the project's Funding sources table, after the rows entered by hand, in the order the funding sources were added. It shows its name, its organization in the table's organization column ("Administered by"), its amount in whole dollars ("$48,000"), and "From `<document name>`" under its name. The row is there when the person returns to the project page, before anything is published.
- "From `<document name>`" is plain text. Nothing opens from it: the document is not kept.
- The line stays after the row's change is published.
- The line is shown only to people who can edit or publish the project. Anyone else sees the row without it, and the document's name is left out of what they are sent.
- The row can be edited and removed by hand (story 81). Edited by hand, it keeps its "From …" line for as long as its import exists.

R10. That row shows no share of the estimated total cost: its "Share of total" is empty.

R11. While the table holds a row an import added, a "Total from all sources" row is shown above "Estimated total cost". It adds every row in the table once, those entered by hand and those an import added, and shows no share. With no such row, there is no "Total from all sources". The total row stays after a publish. Its wording names no renameable noun and does not change with the workspace's words.

R12. The estimated total cost, and the shares shown on the rows entered by hand, are not changed by adding a funding source from an import.

R13. An "Already on file" funding source changes nothing when the import is added: the table keeps its one row, unchanged, and the toast, the change history and the review count only the changes that were ticked.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- A funding source whose organization the workspace does not hold, or that the report gives no organization or no amount for: the "Organization" list, the badges and sentences, and a change left without an organization — story 75.
- A ticked funding source with no name, no organization, no amount above zero, cents or too long a name, and the messages — story 65.
- A funding source the record holds with another amount; one edited into or out of a match; two in one reading with the same name and organization; two imports of one row — story 86.
- Editing or removing a row on the project page — story 81.
- Recording that the person changed the name or the amount — story 36.
- Spend, and a budget table — story 19. A named party that is not a funder — stories 19 and 27 (`later`).
- What the row names as its document when the report was pasted text — story 40.
- Removing the row when the import is undone — story 41.
- The Funding sources table, "Estimated total cost" and how a share is worked out — `project-record`.
- The row in the review — story 24.

## Needs to know from elsewhere

- The reading returns each funding source the document names: the grant or program, the organization as written, the amount as a number, the quote and where it was read. It is told nothing of the project's funding sources or the workspace's organizations, and matches nothing — enabler 02, not built.
- The Funding sources heading, absent when the reading has no funding source; the quote under each change; the tally and its parts; the order inside a group (ready, "Needs you", "Not in this workspace", "Already on file") — story 04 (R2 to R5).
- An unticked change is not added; "ready to add" and the count on "Add N changes" follow every tick — story 06.
- The "Already on file" badge, and the check at the press — story 32 (R3, R5).
- The import records the document's name, and for each change its parts (the grant or program, the organization, the amount), its quote and where it was read. No file is kept — story 22 (R1, R2).
- The workspace's organizations, by name. This story asks for the list and nothing else. An organization a funding source names cannot be removed, and two organizations cannot have names that differ only in capitals — owned by `organizations-admin`.
- Added changes are saved unpublished: on the record at once, not public until a Manager publishes — owned by `publish-review`.
- The Funding sources table, its columns, the order of the rows entered by hand and the share each shows; a funding source on the record points at its organization, not at the organization's name as text — owned by `project-record`.

## Scenarios

S1 to S3 and S6 to S14 run against the recorded sample `deer-creek-funding-2025.pdf` (rows F3, F10, F11). No sample holds the data of S4 and S5, or the person of S7; they are described by kind.

**S1 — A funding source is proposed** (proves R1)
- Given the workspace holds Pacific Fisheries Trust
- When the funding sample's reading comes back
- Then F11 is listed under Funding sources, labelled "Funding source", ticked, with "Grant or program" holding Fisheries Habitat Fund, "Organization" holding Pacific Fisheries Trust and "Secured ($)" holding 48,000

**S2 — What the fields hold is what is saved** (proves R2)
- Given F11 is ticked and the Contributor typed "$50,000" over its "Secured ($)"
- When the Contributor presses "Add 2 changes"
- Then Deer Creek's record holds the funding source Fisheries Habitat Fund, Pacific Fisheries Trust, $50,000

**S3 — A funding source the record already has** (proves R7)
- Given Deer Creek's record holds Watershed Resilience Grant Program, California Watershed Restoration Board, $255,500
- When the funding sample's reading comes back
- Then F10 carries the badge "Already on file", has no checkbox, and the tally reads "2 ready to add · 1 already on file"

**S4 — Capitals and outer spaces do not prevent a match** (proves R8)
- Given a reading that writes a funding source's organization as Pacific Fisheries Trust in other capitals, with a space after it
- When the check step opens
- Then the change is ticked, and "Organization" holds Pacific Fisheries Trust as the workspace writes it

**S5 — A connected organization is matched** (proves R8)
- Given a connected organization the person can see in the directory, and a reading that names it as a funding source's organization
- When the check step opens
- Then the change is ticked and "Organization" holds that organization

**S6 — The row** (proves R9)
- Given the funding sample's two ready changes, F11 among them, were added to Deer Creek
- When the Contributor opens the Deer Creek project page
- Then Funding sources has a third row, Fisheries Habitat Fund, Pacific Fisheries Trust, $48,000, with "From deer-creek-funding-2025.pdf" under its name as text that opens nothing

**S7 — The document's name is not shown to someone who can neither edit nor publish** (proves R9)
- Given the same import, and a person who can see Deer Creek's record and can neither edit nor publish it, such as a Viewer
- When that person opens the project page
- Then the Fisheries Habitat Fund row is shown with no "From …" line, and the page they were sent does not contain the document's name

**S8 — A row edited by hand keeps its line** (proves R9)
- Given the same import
- When the Contributor changes the Fisheries Habitat Fund row's amount to $50,000 on the project page
- Then the row reads $50,000 and still shows "From deer-creek-funding-2025.pdf"

**S9 — After a publish** (proves R9, R11)
- Given the same import, and a Manager has published Deer Creek's waiting changes
- When the Contributor opens the project page
- Then the row still shows "From deer-creek-funding-2025.pdf", and "Total from all sources" is still shown

**S10 — No share on that row** (proves R10)
- Given the same import
- When the Contributor reads the Fisheries Habitat Fund row
- Then it shows no share of the estimated total cost

**S11 — The total row** (proves R11)
- Given the same import
- When the Contributor reads the foot of the table
- Then "Total from all sources" reads $460,000, above "Estimated total cost" at $412,000

**S12 — No imported row, no total row** (proves R11)
- Given nothing has been imported to Deer Creek, and its two funding sources were entered by hand
- When the project page opens
- Then Funding sources shows no "Total from all sources" row

**S13 — The estimate and the other shares stand** (proves R12)
- Given the estimated total cost and the shares of Deer Creek's two rows were noted before the import
- When the project page opens after it
- Then "Estimated total cost" still reads $412,000 and the two rows show the shares noted

**S14 — A funding source already on file is not added or counted** (proves R13)
- Given the check step lists F10 "Already on file", and the Contributor pressed "Add 2 changes"
- When the project page opens
- Then the toast reads "2 changes added from deer-creek-funding-2025.pdf", and Funding sources has one row for Watershed Resilience Grant Program, at $255,500, with no "From …" line

## UAT script

Steps 1 to 4 are the check step; steps 5 to 8 show, on the project page, that the funding source was saved; step 9 corrects it by hand.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Nothing has been imported to Deer Creek. The tester has noted, on the project page, the two Funding sources rows, their shares and "Estimated total cost". The test environment serves the recorded sample `deer-creek-funding-2025.pdf`.
Test data: `../fixtures.md`: the funding sample, rows F3, F10 and F11; Deer Creek's funding sources. The sample is to be made. Step 4 changes F11's amount to $50,000, so steps 6 and 7 read $50,000 and a total of $462,000 ($255,500, $156,500 and $50,000); step 9 sets it back, to the fixture's $48,000 and $460,000. No sample has the data of S4 or S5, and the sample workspace has no Viewer.
Reset: reset the sample project in the test environment.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import a report", choose `deer-creek-funding-2025.pdf`, press "Read it" and wait | The check step, with a Funding sources group of two changes, each labelled "Funding source"; the tally "2 ready to add · 1 already on file" |
| 2 | Find the one whose "Grant or program" holds Fisheries Habitat Fund | Ticked; "Organization" holds Pacific Fisheries Trust and "Secured ($)" holds 48,000 |
| 3 | Find the one whose "Grant or program" holds Watershed Resilience Grant Program | Below the first; the badge "Already on file"; no checkbox |
| 4 | Type "$50,000" over the first one's "Secured ($)" and leave the field | The field reads 50,000; the change is still ticked; the action still reads "Add 2 changes" |
| 5 | Press "Add 2 changes" and go to Funding sources | The Deer Creek project page; "2 changes added from deer-creek-funding-2025.pdf"; three rows |
| 6 | Read the third row | Fisheries Habitat Fund, Pacific Fisheries Trust, $50,000, "From deer-creek-funding-2025.pdf" under the name, and no share; pressing the line opens nothing |
| 7 | Read the foot of the table | "Total from all sources" $462,000, above "Estimated total cost" $412,000 |
| 8 | Read the two rows noted beforehand | Each as noted: one row for Watershed Resilience Grant Program, at $255,500, with its share unchanged |
| 9 | Change the third row's amount to $48,000 | $48,000, still with "From deer-creek-funding-2025.pdf"; "Total from all sources" $460,000 |

On the prototype: the sample does not exist there, and no row can be edited; see `../fixtures.md`, On the prototype.

## Open questions

None open. The story rests on these proposed answers:

- Q-98 (proposed) — R1, R11: the heading, the label and "Organization" take the workspace's words; "Total from all sources" does not change.
- Q-113 (proposed) — R2, S1: whole dollars; separators shown and accepted.
- Q-133 (proposed) — R7, R8, S4: the letter-for-letter match, and "Already on file" following the person's edits.
- Q-134 (proposed) — R7: the organization matched is compared, not its name as text.
- Q-87 (proposed) — R7, R13, S3, S14: an "Already on file" funding source has no checkbox and is never counted.
- Q-131 (proposed) — R8, S5: matched against every organization the person can see, connected ones included.
- Q-45 (proposed) — R9: the document's name stays with the row although the file is not kept.
- Q-76 (proposed) — R9, R11, S9: the line and the total row stay after a publish.
- Q-136 (proposed) — R9, S7: the name reaches only people who can edit or publish.
- Q-135 (b) (proposed) — R9, S8: an imported row edited by hand keeps its line while its import exists. That rows can be edited and removed is decided (Q-135).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown; proposed (Q-98) | ACN-15; RUL-169, RUL-170; RUL-315 |
| R2 | decided; shown; proposed (Q-113) | ACN-15; RUL-171, RUL-172; RUL-316 |
| R7 | shown; proposed (Q-87, Q-133, Q-134) | RUL-80, RUL-174; RUL-317; relies on story 32, STA-11, RUL-15 |
| R8 | proposed (Q-133); proposed (Q-131) | RUL-173; RUL-318 |
| R9 | decided; shown; decided (spec #42); proposed (Q-45, Q-76, Q-136); decided (interview 2026-11-23, Q-135); proposed (Q-135 (b)) | STA-29; RUL-176; RUL-319; relies on story 81, R1, R2 |
| R10 | decided; shown | STA-29; RUL-48 |
| R11 | decided; shown; proposed (Q-76, Q-98) | STA-29; RUL-48; RUL-178 |
| R12 | shown | RUL-48 |
| R13 | proposed (Q-87) | RUL-48, RUL-177 |
- R3 to R6 moved to story 75 on 2026-11-23: old R3 is 75's R1, R4 its R2, R5 its R3, R6 its R4. On the same day the cases of a match with another amount, an edit into a match, two in one reading and two imports of one row moved to story 86, and R13 was narrowed to what is left.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the comparison at line 345; "Already on file" at 618-621 and 657-664; the change, its label and its fields at 764-794 and 847-857; what is read and recorded on Add at 947 and 982-1001); `src/pages/prototypes/projects/[project]/import-report.astro` (which organizations and funding sources the page is given, 87-88); `src/data/firma2-report-import.ts` (the recorded reading, 394-428); `src/lib/report-imports.ts` (what an imported change wrote, 50-56 and 198-205); `src/components/projects/firma2-project-funding.astro` (why the estimate is not restated, 14-27; the columns, 283-306; the match, the order, imported rows and the "Total from all sources" row, 313-327; "Add source", not wired, 122-139); `src/lib/format.ts` (whole dollars, 31-35).
- Data shapes, as the prototype models them: a funding source change is a name, an organization and an amount. Whether the record holds the funding source is worked out by the page, not carried by the reading. An added funding source holds its name, organization and amount, and the import it came from, which gives the document's name.
- The prototype differs from the requirements in these: the amount arrives as plain digits and accepts decimals (R2); "Already on file" ignores the amount, has a checkbox and is worked out once (R7, R13); the organization is compared as text (R7); the "From …" line is shown to everyone (R9); no row can be edited or removed, which is unfinished, not decided (story 81).
- Do not copy: the organizations to match against are the whole seeded directory passed into the page; the scripted readings; imported rows laid over the table from a browser-local store on every load.

</details>
