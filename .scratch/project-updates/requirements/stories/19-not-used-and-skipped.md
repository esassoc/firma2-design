# 19 — A Contributor sees what the report says that the import did not use, and why

Type: story
Epic: B — What a report can change
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-35, Q-42, Q-43, Q-46, Q-65, Q-71, Q-98, Q-99, Q-125, Q-129
Revision: 1
Blocked by: 04, 02
Covers: RUL-7, RUL-42, RUL-164, RUL-165, RUL-223, RUL-325, RUL-326, RUL-327, RUL-328, RUL-329, RUL-330, RUL-331, RUL-332, RUL-333
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #10, #11
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R7, on story 04's check step (its groups of changes are used here, not built here), against the recorded sample `deer-creek-not-used-2025.pdf` (to be made), which stands in for enabler 02 until that is built. Built here, not showable until a later story: three of R2's reasons, which only a Key facts change can raise (story 15).

## Story

As a Contributor, I want to see what the report says that the import left alone, with the reason for each, so that I can trust that nothing was silently dropped and can record by hand anything that still belongs on the project.

## Description

On the check step of Import a report, below the last group of changes, the page accounts for the rest of the document. A "Not used" list names everything the report states about the project that no change was made from. A "Skipped" list names the parts of the document passed over on purpose, such as a budget table, because spend is never proposed. Each line is the report's own words followed by a reason, and the product, not the reading, words the reason. Nothing in either list can be added to the record. This amends spec #10: the lists are complete, and the skipped parts are a list too. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with either sample document; there the reading words the reasons itself and "Skipped:" is one line.

## Requirements

R1. Everything the document states about the project that the import does not use is listed in a box titled "Not used", below the last group of changes: every quantity, attribute and party, not a selection. Each is one line: the report's own words, then the reason. The lines are in the reading's order.
- A line the reading returns twice is shown once. Two lines are the same when their text matches once capitals and outer spaces are ignored.
- A change the person left unticked joins neither list. That holds for a funding source left unticked because no organization was picked for it: it stays on the check step as an unticked change (story 75) and is not a line here.
- Neither list is kept: once the import is added, or the page is left, nothing stores or shows them.

R2. Each "Not used" line carries one reason from a fixed set. The reading picks the reason; the product words its sentence, with the workspace's own words for the renameable nouns in it. The set, and the story that proves each:

| The reason | The sentence | Proven in |
|---|---|---|
| No performance measure of the project asks for the quantity | "No performance measure asks for this." | here, S1 |
| The project has no field for the attribute | "This project has no `<attribute>` field." | here, S2 |
| The party is neither a contact nor a funder | "Not a contact or a funder." | here, S3 |
| Location changes only from a spatial file | "Location changes only from a spatial file." | here, S9 |
| The project has no performance measure at all | "This project has no performance measures." | here, as S10, by kind |
| The project has no closed reporting period to file the figure under | "This project has no closed reporting period to file this under." | here, S10 |
| The field is one an import never sets (stage, project type, lead organization) | "An import does not change a project's `<field>`." | story 15 |
| The value does not fit its field | "This value does not fit the `<field>` field." | story 15 |
| A Timeline year with no other year on the record to pair it with | "This project has no Timeline to pair this year with." | story 15 |

R3. Spend is never proposed as a change, whatever the document says about it.

R4. The parts of the document the reading passed over on purpose, and did not read as data, are listed in a box titled "Skipped", below "Not used": one item a line, each the reading's name for the part, then its reason. The reason is one of three, worded by the product: a budget or spend table ("Spend is recorded by year, not by grant."); a total or subtotal row ("A total of the rows above."); a part about another project ("About another project.").

R5. A line under "Not used" or "Skipped" cannot be added to the record and is never counted in "Add N changes" or in the tally. It has no checkbox, it cannot be selected to show a place in the document, and on a narrow screen it has no "Show source".

R6. With nothing to list, the "Not used" box is absent. With nothing skipped, the "Skipped" box is absent. Both are the same whichever way the document was given, a file or pasted text, and both show as usual when the reading proposes no change at all (story 04, R3).

R7. Coordinates stated in a report's text are among the lines not used, with the reason that location changes only from a spatial file.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Why a location is never changed from a report — story 11 (R5).
- Which Key facts fields an import sets, and the tests that send a Key facts value to "Not used" — story 15.
- Partner organizations as a kind of change — story 27 (`later`).
- A field the project did not offer to the reading, moved to "Not used" by a check in code — enabler 50 (`later`).
- A change the person left unticked — story 06. A funding source with no organization picked — story 75.
- "Note for the reviewer (optional)", which follows these lists — story 21.
- Reaching the check step from pasted text — story 09.
- Recording spend — `project-record`.

## Needs to know from elsewhere

- The reading returns, beside the proposed changes, every "Not used" item in the document's own words with one reason from R2's set, and every "Skipped" item with one of R4's reasons; it words no sentence — enabler 02 (R6). A project with no performance measure or no closed reporting period is still read, and its figures come back as "Not used" items (enabler 02, R5).
- Import a report is offered on a project with no performance measure or no closed reporting period — story 12 (R3).
- An import proposes four kinds of change only — story 15 (R1).
- The groups of changes these lists sit below, selecting a change, and the check step for a reading that proposes nothing — story 04. "Show source" on a narrow screen — story 05.
- A reading is not stored, and the file is not kept: leaving the page, or adding the import, ends both lists — stories 01 (R7) and 22.
- A label or sentence that names a renameable noun takes the workspace's word (SR-4).

## Scenarios

S1 to S6 and S9 run against the recorded sample `deer-creek-not-used-2025.pdf` (`../fixtures.md`): row F3, lines NU1 to NU5 and SK1. S7 runs against the crew log. No sample holds the data of S8, S10 and S11; each describes its document by kind. The three reasons a Key facts change raises are proven in story 15.

**S1 — A quantity no measure asks for** (proves R1, R2)
- Given none of Deer Creek's seven performance measures asks for pools
- When the not-used sample's reading comes back
- Then "Not used" lists "Pools created, 14 pools. No performance measure asks for this."

**S2 — An attribute the project has no field for** (proves R2)
- Given Deer Creek has no Watershed field
- When the not-used sample's reading comes back
- Then "Not used" lists "Watershed: South Fork American River. This project has no Watershed field."

**S3 — A party that is neither a contact nor a funder** (proves R2)
- Given the report names Hollis Family Ranch as the landowner
- When the reading comes back
- Then "Not used" lists "Landowner: Hollis Family Ranch. Not a contact or a funder."

**S4 — Spend is not proposed** (proves R3)
- Given page 4 of the report holds the table "Budget by activity"
- When the reading comes back
- Then the one change offered is F3, and none is for a figure in that table

**S5 — A budget table is named as skipped, with its reason** (proves R4)
- Given the same table
- When the reading comes back
- Then a box titled "Skipped", below "Not used", holds one line: "Budget table, page 4. Spend is recorded by year, not by grant."

**S6 — Nothing here can be added** (proves R5)
- Given the not-used sample's check step lists one change, five "Not used" lines and one "Skipped" line
- When the Contributor reads the tally and the commit action
- Then they read "1 ready to add" and "Add 1 change"

**S7 — A total row is skipped** (proves R4)
- Given the crew log's row 14 reads "TOTAL"
- When the crew log's reading comes back
- Then "Skipped" holds one line: "Row 14, “TOTAL”. A total of the rows above."

**S8 — Nothing skipped, nothing shown** (proves R6)
- Given a reading that returns changes, one "Not used" item and nothing skipped
- When the check step opens
- Then "Not used" shows that line and the page has no "Skipped" box

**S9 — The coordinates are a line not used** (proves R7)
- Given the not-used sample has been read for Deer Creek
- When the "Not used" lines are read
- Then one of them is "Site coordinates 38.742, −120.681. Location changes only from a spatial file."

**S10 — No closed reporting period** (proves R2)
- Given a project whose reporting periods are all open, and a report that states one figure for one of its performance measures
- When the check step opens
- Then no performance measure change is listed, and "Not used" lists the figure in the report's words, followed by "This project has no closed reporting period to file this under."

**S11 — A line returned twice is shown once** (proves R1)
- Given a reading whose "Not used" items include the same text twice, once in other capitals
- When the check step opens
- Then "Not used" shows that line once

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). The test environment serves the recorded sample `deer-creek-not-used-2025.pdf`. Stories 01 and 04 are built. The script adds nothing.
Test data: `../fixtures.md`: the not-used sample (to be made): row F3, lines NU1 to NU5 and SK1.
Reset: none needed.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import a report", choose `deer-creek-not-used-2025.pdf`, press "Read it" and wait | The check step, with one change, "Acres of invasive vegetation removed · 2025" |
| 2 | Look below the change | A box titled "Not used", then a box titled "Skipped" |
| 3 | Read "Not used" | Five lines, NU1 to NU5 in the fixture's order; each is the report's words followed by a reason, among them "Pools created, 14 pools. No performance measure asks for this." and "Landowner: Hollis Family Ranch. Not a contact or a funder." |
| 4 | Read "Skipped" | One line: "Budget table, page 4. Spend is recorded by year, not by grant." |
| 5 | Read the tally and the action | "1 ready to add" and "Add 1 change": no line of either list is counted |
| 6 | Click a "Not used" line, then look on it for a checkbox | The document beside the changes does not move; there is no checkbox |
| 7 | Go back to the project page by the breadcrumb | The project page, with nothing added |

On the prototype: the not-used sample does not exist there. Press "Sample funder report" to see the same five lines and the skipped line below all 14 of its changes, with the reasons as the scripted reading words them; see `../fixtures.md`, On the prototype.

## Open questions

None open. The proposals this story rests on:

- Q-129 (proposed) — R1, R4, S5, S7: "Not used" is complete; "Skipped" is a list, each item with a reason from three.
- Q-98 (proposed) — R1, R2: the item in the report's words; the reason from a fixed set, worded by the product with the workspace's words.
- Q-99 (proposed) — R1, S11: a line returned twice is shown once.
- Q-46 (proposed) — R1: neither list is kept after adding.
- Q-35 (proposed) — R1: a funding source with no organization picked is not a line here.
- Q-43 (proposed) — R2, S10: the two reasons for a project with no performance measure or no closed reporting period.
- Q-65 (proposed) — R2: the reason for a field an import never sets (story 15).
- Q-71 (proposed) — R2: the reason for a value that does not fit its field (story 15).
- Q-125 (proposed) — R2: the reason for a Timeline year with nothing to pair it with (story 15).
- Q-42 (proposed) — R6: the lists still show when the reading proposes nothing (story 04, R3).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; proposed (Q-129); proposed (Q-98); proposed (Q-99); proposed (Q-46); proposed (Q-35) | RUL-42, RUL-164, RUL-165; RUL-325; RUL-326; RUL-327; RUL-328; RUL-329 |
| R2 | shown; proposed (Q-98); proposed (Q-43); proposed (Q-65); proposed (Q-71); proposed (Q-125) | RUL-42; RUL-326; RUL-330; RUL-331; RUL-332; RUL-333 |
| R3 | decided | RUL-7 |
| R4 | decided; shown; proposed (Q-129) | RUL-7; RUL-164, RUL-165; RUL-325 |
| R5 | shown | RUL-42 |
| R6 | shown; proposed (Q-42) | RUL-42; relies on story 04 |
| R7 | decided | RUL-223 |
- Wording provisional: every reason sentence in R2 and R4 that the prototype's samples do not already show ("No performance measure asks for this.", "This project has no performance measures.", "This project has no closed reporting period to file this under.", "An import does not change a project's `<field>`.", "This value does not fit the `<field>` field.", "This project has no Timeline to pair this year with.", "A total of the rows above.", "About another project."), and the box title "Skipped" in place of the line "Skipped:".
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the "Not used" box and the "Skipped:" line in the page at 164-169; how they are filled and when they are absent, 935-939); `src/data/firma2-report-import.ts` (the samples' lists); `scripts/report-reader.mjs` (what the model is asked to put in each list, 74-76; a full stop added to a skipped item that lacks one, 446).
- Data shapes, as the prototype models them: a reading carries two lists of plain text beside its proposed changes, not used and skipped. Each line already holds its reason.
- Where the prototype differs from the requirements above: the reading words each reason, and two of the funder report's five lines have none; "Skipped:" is one run-on line and the crew log's item has no reason; the developer-machine reader asks the model to keep "Not used" to the notable quantities; a line returned twice is shown twice.
- Do not copy: the samples' lists are hand-written mock data.

</details>
