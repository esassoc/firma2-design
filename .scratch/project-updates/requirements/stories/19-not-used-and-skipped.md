# 19 — A Contributor sees what the report says that the import did not use, and why

Type: story
Epic: B — What a report can change
Release: first
Status: needs-info
Revision: 1
Blocked by: 04, 02
Covers: RUL-7, RUL-42, RUL-164, RUL-165, RUL-223
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #10, #11
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R7, on story 04's check step (its groups of changes are used here, not built here), and only against the recorded readings in `../fixtures.md`, which stand in for enabler 02 (not built). Waiting: the parts marked "Not decided", each on the question named beside it; the count of six on Q-82.

## Story

As a Contributor, I want to see what the report says that the import left alone, with the reason for each, so that I can trust that nothing was silently dropped and can record by hand anything that still belongs on the project.

## Description

On the check step of Import a report, below the last group of changes, the page accounts for the rest of the document. A "Not used" list names what the report states that no change was made from. A "Skipped:" line names what was passed over on purpose, such as a budget table, because spend is never proposed. Nothing in either can be added to the record. R7, coordinates as a line not used, moved here from story 11 on 2026-11-23. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with either sample document.

## Requirements

R1. What the document reports that the import does not use is listed in a box titled "Not used", below the last group of changes, one line of text each, in the reading's order and in the reading's words. It is not dropped. Not decided: whether the list holds every such thing or the notable ones, and what is done with a line the reading returns twice (Q-129; Q-99); whether the list is kept or shown anywhere once the import is added (Q-46).

R2. "Not used" holds at least these: a quantity no performance measure of the project asks for, listed as the report states it ("Pools created, 14 pools"); a named attribute the project has no field for, with that reason ("Watershed: South Fork American River. This project has no Watershed field."); a named party that is neither a contact nor a funder, with that reason ("Landowner: Hollis Family Ranch. Not a contact or a funder."). Not decided: whether a reason that names a renameable noun takes the workspace's word (Q-98).

R3. Spend is never proposed as a change, whatever the document says about it.

R4. What the reading passed over on purpose, and did not read as data, is named in one "Skipped:" line below "Not used": the word "Skipped:", then each item in the reading's order, one after another. A budget or expenditure table is named there once, with the reason: "Budget table, page 4: spend is recorded by year, not by grant." Not decided: whether every item must carry a reason (Q-129).

R5. A line under "Not used" or "Skipped:" cannot be added to the record and is never counted in "Add N changes" or in the tally. It has no checkbox, it cannot be selected to show a passage in the document, and on a narrow screen it has no "Show source".

R6. With nothing to list, the "Not used" box is absent. With nothing skipped, the "Skipped:" line is absent. Both are the same whichever way the document was given, a file or pasted text. Not decided: what the check step shows when a reading proposes no change and has only these lines (Q-42).

R7. Coordinates stated in a report's text are among the lines the reading did not use, with the reason "Location changes only from a spatial file."

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Why a location is never changed from a report — story 11 (R5).
- Partner organizations as a kind of change — story 27 (`later`).
- A measure the project is not asked, moved to "Not used" by a check in code — enabler 50 (`later`).
- A change the person left unticked, which joins neither list — story 06.
- "Note for the reviewer (optional)", which follows these lists — story 21.
- Reaching the check step from pasted text — story 09.
- Recording spend — `project-record`.

## Needs to know from elsewhere

- The reading returns, beside the proposed changes, the "Not used" lines and the "Skipped" lines, each already worded with its reason — enabler 02, not built.
- An import proposes four kinds of change only, and an attribute the project has no field for is not proposed — story 15 (R1, R4).
- The groups of changes these lists sit below, and selecting a change to see its passage — story 04. "Show source" on a narrow screen — story 05.
- No reading proposes a change to a project's location, whatever the document says — story 11 (R5).
- A reading is not stored: leaving the page before "Add N changes" ends it, lists included — story 01, R7.

## Scenarios

All run against the recorded readings in `../fixtures.md`: the funder report's "Not used" and "Skipped" lines for S1 to S5 and S9, the crew log for S6. The lists are drawn from the reading whatever changes stand above them, so S1 to S5 and S9 do not wait for the stories that show the funder report's other kinds of change. R7 is a rule for the reading (enabler 02): the recording already holds the coordinates line, so against it S9 shows that the page lists it; the reading itself is proven with enabler 02, on a real document that states coordinates. No fixture read from a file shows S7, and none shows S8; their data is described by kind.

**S1 — A quantity no measure asks for** (proves R1, R2)
- Given none of Deer Creek's seven performance measures asks for pools
- When the funder report's reading comes back
- Then "Not used" lists "Pools created, 14 pools"

**S2 — An attribute the project has no field for** (proves R2)
- Given Deer Creek has no Watershed field
- When the funder report's reading comes back
- Then "Not used" lists "Watershed: South Fork American River. This project has no Watershed field."

**S3 — A party that is neither a contact nor a funder** (proves R2)
- Given the funder report names Hollis Family Ranch as the landowner
- When the reading comes back
- Then "Not used" lists "Landowner: Hollis Family Ranch. Not a contact or a funder."

**S4 — Spend is not proposed** (proves R3)
- Given page 4 of the funder report holds the table "Budget by activity"
- When the reading comes back
- Then no change is offered for any figure in that table

**S5 — A budget table is named as skipped** (proves R4)
- Given the same table
- When the reading comes back
- Then one line below "Not used" reads "Skipped: Budget table, page 4: spend is recorded by year, not by grant."

**S6 — Nothing here can be added** (proves R5)
- Given the crew log's check step lists six changes, two "Not used" lines and a "Skipped:" line
- When the Contributor reads the commit action
- Then it reads "Add 6 changes"

**S7 — Nothing to list, nothing shown** (proves R6)
- Given a reading that returns changes, one "Not used" line and nothing skipped
- When the check step opens
- Then "Not used" shows that line and the page has no "Skipped:" line

**S8 — Several things skipped** (proves R4)
- Given a reading that returns two skipped items, each a sentence
- When the check step opens
- Then one line reads "Skipped:", then the first sentence, then the second

**S9 — The coordinates are a line not used** (proves R7)
- Given the funder report has been read for Deer Creek
- When the lines the reading did not use are read
- Then one of them is "Site coordinates 38.742, −120.681. Location changes only from a spatial file."

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). The recorded funder report reading is served for the funder report file. The script adds nothing. It reads the two lists only: which of the funder report's 14 changes the check step lists above them depends on stories 13 to 18, 32 and 75, and does not matter here.
Test data: `../fixtures.md`: the funder report's "Not used" and "Skipped" lines. No fixture read from a file has nothing skipped; the pasted paragraph does (story 09). No fixture skips two things.
Reset: none needed.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import report", choose `deer-creek-completion-report-2025.pdf`, press "Read it" and wait | The check step |
| 2 | Scroll below the last group of changes | A box titled "Not used", then a line that starts "Skipped:" |
| 3 | Read "Not used" | Five lines, in the fixture's order, among them "Pools created, 14 pools", "Site coordinates 38.742, −120.681. Location changes only from a spatial file." and "Landowner: Hollis Family Ranch. Not a contact or a funder." |
| 4 | Read the "Skipped:" line | "Skipped: Budget table, page 4: spend is recorded by year, not by grant." |
| 5 | Read the labels of every change | None is for a budget figure, pools, a watershed, the site's coordinates or Hollis Family Ranch |
| 6 | Click a "Not used" line, then look on it for a checkbox | The document beside the changes does not move; there is no checkbox |
| 7 | Go back to the project page by the breadcrumb | The project page, with nothing added |

On the prototype: press "Sample funder report" in place of choosing the file; see `../fixtures.md`, On the prototype.

## Open questions

- Q-46 — R1: whether the two lists are kept with the import; if so, a requirement, a scenario and a step say where they are shown after adding.
- Q-42 — R6: the check step when the reading proposes nothing and lists only these lines.
- Q-35 — R1: if a funding source left out for want of an organization is "listed as not added", whether that is a line here.
- Q-82 — S6: the count of six. Part (a) may also send a figure in another unit to "Not used", which adds a case to R2.
- Q-88 — how the recorded reading is served.
- Q-98 — would change R2: the reasons, which the reading words, name the project, a contact and a funder.
- Q-129 — would change R1 and R4: whether "Not used" is complete, whether every skipped item needs a reason (the crew log's "Row 14, “TOTAL”." has none), and a line returned twice.
- Q-99 — R1: whether a line the reading returns twice is listed twice (its part g).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | RUL-42; RUL-164, RUL-165 |
| R2 | shown | RUL-42 |
| R3 | decided | RUL-7 |
| R4 | decided; shown | RUL-7; RUL-164, RUL-165 |
| R5 | shown | RUL-42 |
| R6 | shown | RUL-42 |
| R7 | decided | RUL-223 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the "Not used" box and the "Skipped:" line in the page at 164-169; how they are filled and when they are absent, 935-939); `src/data/firma2-report-import.ts` (the samples' lists); `scripts/report-reader.mjs` (what the model is asked to put in each list, 74-76; a full stop added to a skipped item that lacks one, 446).
- Data shapes, as the prototype models them: a reading carries two lists of plain text beside its proposed changes, not used and skipped. Each line already holds its reason.
- What the prototype does where nothing is decided (not requirements): the lists are gone once the import is added; nothing stores or shows them (Q-46). The developer-machine reader asks the model to keep "Not used" to the notable quantities (Q-129).
- Do not copy: the samples' lists are hand-written mock data.

</details>
