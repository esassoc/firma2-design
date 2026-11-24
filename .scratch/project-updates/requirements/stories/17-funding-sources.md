# 17 — A Contributor adds funding sources the report names and sees them on the project page

Type: story
Epic: B — What a report can change
Release: first
Status: needs-info
Revision: 1
Blocked by: 06, 02, 32, 22
Covers: ACN-15, RUL-80, RUL-169, RUL-170, RUL-171, RUL-172, RUL-173, RUL-174, STA-29, RUL-48, RUL-176, RUL-177, RUL-178
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; `/prototypes/projects/deer-creek-riparian-corridor-enhancement`, after adding the sample funder report; spec #15, #10
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (ACN, STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1, R2, R7 and R8, on a check step where stories 04, 06 and 32 are already built (their groups, checkboxes, tally and "Already on file" badge are used here, not built here); R9 to R13, on the project page's Funding sources table, which `project-record` owns (used here, not built here), once story 22 records the import and its document's name. All of it only against the recorded funder report reading in `../fixtures.md`, which stands in for enabler 02 (not built). Waiting: the parts marked "Not decided", "open" or "awaiting confirmation", each on the question named beside it.

## Story

As a Contributor, I want the funding sources a report names offered as changes I can correct before adding, so that the project shows who funded it without my retyping the grant.

## Description

This story adds the third kind of change to the check step of Import a report: a funding source, made of a grant or program, an organization and an amount secured. The person can correct all three before adding, and a funding source the record already holds is marked "Already on file". A funding source whose organization the workspace does not hold is story 75, split from this story on 2026-11-23 (requirements R3 to R6 moved there; their numbers are not reused here). Once added, the funding source is seen in the project page's Funding sources table: the row, the document it came from, and a total row that appears because the sources may now exceed the estimated total cost. Merged on 2026-11-23 with a story whose number is retired (`../story-map.md`, Retired numbers); that story's R1 to R5 are R9 to R13 here. See the change at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample funder report, and the row at `/prototypes/projects/deer-creek-riparian-corridor-enhancement`, after adding it.

## Requirements

R1. Each funding source the reading returns is proposed as one change under Funding sources, with three fields holding what was read: "Grant or program", "Organization" (as R8 matches it) and "Secured ($)". Every such change carries the same label, "Funding source"; the grant's name is shown in "Grant or program" and nowhere in the label. The changes keep the reading's order (open: Q-67). Not decided: a funding source read without an organization or without an amount (Q-132); two in one reading with the same name and organization (Q-99); whether these labels take the workspace's own words (Q-98).

R2. The person can edit all three fields, whatever state the change is in and whether or not it is ticked. Editing a field neither ticks nor unticks the change. What the fields hold when the change is added is what is saved: a funding source on the project's record with that name, organization and amount.
- "Grant or program" is free text. Spaces at either end are dropped when it is saved.
- "Organization" is picked from the workspace's organizations. What the list offers and leaves out is story 75, R1.
- "Secured ($)" is an amount in US dollars; there is no other currency. It arrives as digits alone: 48000. A "$", commas and spaces typed into it are ignored when the change is added. Not decided: cents, an upper limit, the longest name, and separators in the field (Q-113).
- The import records the change (story 22) under Funding sources, with the label "Funding source" and the value "`<name>`, `<organization>`, `<amount>`", the amount in whole dollars: "Fisheries Habitat Fund, Pacific Fisheries Trust, $48,000".

R7. A funding source is "Already on file" when its name and its organization, as the report writes them, both match, as R8 compares names, a funding source on the record, including one an earlier import added and nobody has published. The amount is not compared: the same name and organization with another amount is still "Already on file" (open: Q-50).
- Awaiting confirmation (Q-133): it is worked out once, when the check step opens (story 32, R5). Editing the name or changing the organization afterwards neither adds nor removes the badge.
- When every funding source the reading returns is "Already on file", the group is still listed, with every change unticked.
- Not decided: which state shows when a funding source is on the record and its organization is one the workspace does not hold. No sample can produce it, because every funding source on the sample record names an organization the workspace holds (Q-134).

R8. Awaiting confirmation (Q-133): two names match when they are the same letter for letter, ignoring upper and lower case and spaces at either end. A shorter form, an abbreviation or another spelling is not a match. The report's organization is matched this way against the workspace's organizations, by name alone; when one matches, "Organization" arrives holding it, in the workspace's spelling. When none matches — story 75.

R9. A funding source an import added is a row in the project's Funding sources table, after the rows entered by hand, in the order the funding sources were added. It shows its name, its organization in the table's organization column ("Administered by"), its amount in whole dollars ("$48,000"), and "From `<document name>`" under its name. The row is there when the person returns to the project page, before anything is published. Not decided: whether the row keeps that line after its change is published, and who then reads the document's name (Q-76, Q-136); how an amount with cents is shown and added up (Q-113); whether the person can edit or remove the row by hand, which the project page does not yet offer for any funding source (Q-135).

R10. That row shows no share of the estimated total cost: its "Share of total" is empty.

R11. While the table holds a row an import added, a "Total from all sources" row is shown above "Estimated total cost". It adds every row in the table once, those entered by hand and those an import added, and shows no share. With no such row, there is no "Total from all sources"; a funding source that R13 does not add is not such a row. Not decided: whether the total row stays after a publish (Q-76); whether "Total from all sources" takes the workspace's word for Funding source (Q-98).

R12. The estimated total cost, and the shares shown on the rows entered by hand, are not changed by an import.

R13. A funding source added when the table already has a row entered by hand with the same name and organization is not added again: the table keeps that one row, unchanged. Names are compared as R8 compares them: letter for letter, ignoring case and outer spaces. Not decided: what becomes of the report's amount when it differs from the row's (Q-50); two imports, or two changes of one import, that add the same new funding source, where the prototype keeps one row, in the first one's place, with the later amount, and where a change that adds no row is still counted in the toast, the change history and the review (Q-99).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- A funding source whose organization the workspace does not hold: what "Organization" offers, the "Not in this workspace" badge and message, picking an organization, and a change left without one — story 75.
- A ticked funding source with no name or no amount above zero, and its messages — story 65.
- Recording that the person changed the name or the amount — story 36.
- Spend, and a budget table — story 19. A named party that is not a funder — stories 19 and 27 (`later`).
- A funding source read from pasted text, and what its row names as its document — story 40.
- Removing the row when the import is undone — story 41.
- The Funding sources table, "Estimated total cost" and how a share is worked out — `project-record`.
- The row in the review — story 24.

## Needs to know from elsewhere

- The reading returns each funding source the document names: the grant or program, the organization as written, the amount as a number, and the quote. It matches nothing to the workspace or the record — enabler 02, not built (Q-89).
- The Funding sources heading, absent when the reading has no funding source; the quote under each change; the tally and its parts — story 04 (R2, R3, R5), built before this story because story 06 is blocked by it.
- An unticked change is not added; "ready to add" and the count on "Add N changes" follow every tick — story 06.
- A change "Already on file" carries that badge, arrives unticked and can still be ticked — story 32 (R3, R4). What adding one does to the Funding sources table — R13.
- "Add N changes" is stopped when a ticked funding source has no name ("Name the grant or program.") or no amount above zero ("Enter an amount above zero.") — story 65 (R1), which is built after this story, story 30 and story 75. Until it ships such a change is not handled (SR-7), so this story is not released without it.
- The workspace's organizations, by name. This story asks for the list and nothing else — owned by `organizations-admin`.
- Added changes are saved unpublished: on the record at once, not public until a Manager publishes — owned by `publish-review`.
- The document's name is the file's name, as the import records it — story 22, R1. Who may receive the document or its name — enabler 03, R5.
- The Funding sources table, its columns, the order of the rows entered by hand and the share each shows — owned by `project-record`. Nobody owns adding, editing or removing a funding source by hand yet (Q-16).

## Scenarios

S1 to S3 run against the recorded funder report reading in `../fixtures.md`, rows F10 and F11. No recording holds the data of S4 and S5, so they describe it by kind. S6 to S11 run against the same reading, and use what the fixture says the project holds after the seven ready changes are added.

**S1 — A funding source is proposed** (proves R1)
- Given the workspace holds Pacific Fisheries Trust
- When the funder report's reading comes back
- Then F11 is listed under Funding sources, labelled "Funding source", with "Grant or program" holding Fisheries Habitat Fund, "Organization" holding Pacific Fisheries Trust and "Secured ($)" holding 48000

**S2 — What the fields hold is what is saved** (proves R2)
- Given F11 is ticked and the Contributor typed "$50,000" over its "Secured ($)"
- When the Contributor adds the ticked changes
- Then Deer Creek's record holds the funding source Fisheries Habitat Fund, Pacific Fisheries Trust, $50,000

**S3 — A funding source the record already has** (proves R7)
- Given Deer Creek's record holds Watershed Resilience Grant Program, California Watershed Restoration Board, $255,500
- When the funder report's reading comes back
- Then F10 carries the badge "Already on file" and is unticked

**S4 — The amount is not compared** (proves R7)
- Given the same record, and a reading that names Watershed Resilience Grant Program, California Watershed Restoration Board with an amount other than $255,500
- When the check step opens
- Then that change carries the badge "Already on file" and is unticked

**S5 — Capitals and outer spaces do not prevent a match** (proves R8)
- Given a reading that writes a funding source's organization as Pacific Fisheries Trust in other capitals, with a space after it
- When the check step opens
- Then the change is ticked, and "Organization" holds Pacific Fisheries Trust as the workspace writes it

**S6 — The row** (proves R9)
- Given the funder report's ready changes, F11 among them, were added to Deer Creek
- When the Deer Creek project page opens
- Then Funding sources has a row Fisheries Habitat Fund, Pacific Fisheries Trust, $48,000, with "From deer-creek-completion-report-2025.pdf" under its name

**S7 — No share on that row** (proves R10)
- Given the same import
- When the Contributor reads the Fisheries Habitat Fund row
- Then it shows no share of the estimated total cost

**S8 — The total row** (proves R11)
- Given the same import
- When the Contributor reads the foot of the table
- Then "Total from all sources" reads $460,000, above "Estimated total cost" at $412,000

**S9 — No imported row, no total row** (proves R11)
- Given nothing has been imported to Deer Creek, and its two funding sources were entered by hand
- When the project page opens
- Then Funding sources shows no "Total from all sources" row

**S10 — The estimate and the other shares stand** (proves R12)
- Given the estimated total cost and the shares of Deer Creek's two rows were noted before the import
- When the project page opens after it
- Then "Estimated total cost" still reads $412,000 and the two rows show the shares noted

**S11 — A funding source the table already has** (proves R13)
- Given the Contributor ticked F10, which arrived "Already on file", and added it with the ready changes
- When the project page opens
- Then Funding sources has one row for Watershed Resilience Grant Program, at $255,500

## UAT script

Steps 1 to 4 are the check step; steps 5 to 8 show, on the project page, that the funding source was saved. The tally and the count in steps 1, 4 and 5 assume stories 13, 14, 15, 18 and 75 are built, so the whole reading is listed and F12 arrives unticked; none of them is in `Blocked by`, and what the script counts with this story's blockers alone is not stated anywhere (Q-159).

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Nothing has been imported to Deer Creek. The tester has noted, on the project page, the two Funding sources rows, their shares and "Estimated total cost". The recorded funder report reading is served for the funder report file.
Test data: `../fixtures.md`: the funder report, rows F10 and F11; Deer Creek's funding sources. The fixture's "Change" column names each grant so the rows can be told apart; on the screen every one is labelled "Funding source". The counts wait on Q-82. Step 4 changes F11's amount to $50,000, so steps 6 and 7 read $50,000 and a total of $462,000 ($255,500, $156,500 and $50,000), where the fixture, which leaves the amount as read, gives $48,000 and $460,000. The script does not walk S11, which ticks F10. No fixture has the data of S4 or S5, or of any "Not decided" case.
Reset: not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import report", choose `deer-creek-completion-report-2025.pdf`, press "Read it" and wait | The check step, with a Funding sources group of three changes, each labelled "Funding source"; the tally "7 ready to add · 4 need you · 3 already on file" |
| 2 | Find the one whose "Grant or program" holds Watershed Resilience Grant Program | The badge "Already on file"; unticked |
| 3 | Find the one whose "Grant or program" holds Fisheries Habitat Fund | Ticked; "Organization" holds Pacific Fisheries Trust and "Secured ($)" holds 48000 |
| 4 | Type "$50,000" over its "Secured ($)" | The change is still ticked; the action still reads "Add 7 changes" |
| 5 | Press "Add 7 changes" and go to Funding sources | The Deer Creek project page; three rows |
| 6 | Read the third row | Fisheries Habitat Fund, Pacific Fisheries Trust, $50,000, "From deer-creek-completion-report-2025.pdf" under the name, and no share |
| 7 | Read the foot of the table | "Total from all sources" $462,000, above "Estimated total cost" $412,000 |
| 8 | Read the two rows noted beforehand | Each as noted: one row for Watershed Resilience Grant Program, at $255,500, with its share unchanged |

On the prototype: press "Sample funder report" in place of choosing the file; see `../fixtures.md`, On the prototype.

## Open questions

- Q-50 — R7 and S4: whether a match with another amount is "Already on file" or a change to the funding source the record has. R13, S11 and step 8: whether such a match changes the row the table has.
- Q-67 — R1: where an "Already on file" change goes in the group's order.
- Q-76 — R9 and R11: parts (a) and (b), whether "From `<document name>`" and "Total from all sources" stay once the change is published; an answer adds a scenario.
- Q-82 — steps 1, 4 and 5: the counts.
- Q-88 — the Reset line, and how the recorded reading is served.
- Q-89 — R1 and R8 assume the reading returns the organization as written and matches nothing; if the service matches, R8 moves to it.
- Q-131 — would change R8: which organizations the report's organization is matched against (connected organizations, any left out).
- Q-113 — would change R2, S1 and step 3: whole dollars or cents, an upper limit, the longest name, and whether the field shows separators. Would change R9 and R11: how an amount with cents is shown, and whether the total adds the cents.
- Q-132 — would change R1: whether a funding source read with no organization or no amount is proposed, and in what state.
- Q-99 — would change R1 and R7: what two matching funding sources in one reading, or a ticked "Already on file" one, come to on "Add N changes". Would change R13: adds the rule for the same new funding source added twice, and a scenario.
- Q-98 — would change R1: whether "Funding source", "Funding sources" and "Organization" take the workspace's words. Would change R11: the wording of "Total from all sources".
- Q-133 — would change R7 and R8: confirms or replaces the letter-for-letter match and "worked out once"; a looser match changes S5 and adds scenarios.
- Q-134 — would change R7: adds the rule for "Already on file" meeting "Not in this workspace", or says it cannot occur.
- Q-135 — would change R9: whether an imported row can be edited or removed by hand, and what then becomes of its "From …" line.
- Q-136 — would change R9: who is shown "From `<document name>`"; enabler 03, R5 says the name reaches nobody who cannot edit or publish.
- Q-159 — would change the script's opening line and steps 1, 4 and 5: the tally and the counts with this story's blockers alone, or a narrower recording to run it against.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | ACN-15; RUL-169, RUL-170 |
| R2 | decided; shown | ACN-15; RUL-171, RUL-172 |
| R7 | shown | RUL-80, RUL-174; relies on story 32, STA-11, RUL-15 |
| R8 | shown | RUL-173 |
| R9 | decided; shown | STA-29; RUL-176 |
| R10 | decided; shown | STA-29; RUL-48 |
| R11 | decided; shown | STA-29; RUL-48; RUL-178 |
| R12 | shown | RUL-48 |
| R13 | shown | RUL-48, RUL-177 |

- R3 to R6 moved to story 75 on 2026-11-23: old R3 is 75's R1, R4 its R2, R5 its R3, R6 its R4.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the comparison at line 345; "Already on file" at 618-621 and 657-664; the change, its label and its fields at 764-794 and 847-857; what is read and recorded on Add at 947 and 982-1001); `src/pages/prototypes/projects/[project]/import-report.astro` (which organizations and funding sources the page is given, 87-88); `src/data/firma2-report-import.ts` (the recorded reading, 394-428); `src/lib/report-imports.ts` (what an imported change wrote, 50-56 and 198-205); `src/components/projects/firma2-project-funding.astro` (why the estimate is not restated, 14-27; the columns, 283-306; the match, the order, imported rows and the "Total from all sources" row, 313-327; "Add source", not wired, 122-139); `src/lib/format.ts` (whole dollars, 31-35).
- Data shapes, as the prototype models them: a funding source change is a name, an organization and an amount, all three always present. Whether the record holds the funding source is worked out by the page, not carried by the reading. An added funding source holds its name, organization and amount, and the import it came from, which gives the document's name.
- What the prototype does where nothing is decided (not requirements): the amount accepts decimals and saves them as typed while every screen shows whole dollars (Q-113); two matching funding sources in one reading are both proposed, ticked (Q-99); where two of the workspace's organizations differ only in capitals, the first in the list is the one matched (Q-133); the "From …" line and the total row stay after a publish (Q-76); a matching source's different amount is lost (Q-50); when two imports add the same new source, the later one's figure is the one shown (Q-99); an amount saved with cents is shown rounded to whole dollars while the total adds the cents (Q-113); no funding source row, imported or not, can be edited or removed (Q-135).
- Do not copy: the organizations to match against are the whole seeded directory passed into the page; the scripted readings; imported rows laid over the table from a browser-local store on every load.

</details>
