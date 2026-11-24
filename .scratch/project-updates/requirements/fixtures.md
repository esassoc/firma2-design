# Fixtures — Import a report (project-updates, build 1)

The sample project, person and documents every scenario and UAT script in this feature uses. A story names a fixture and its rows (`C2`, `F7`) and does not repeat them. Written 2026-11-23 from `inventory.md`, Sample data, and the prototype's fixture file. Everything here is invented.

**Readings are recorded, not live.** A model reads the document, and a model does not return the same reading twice. So each "What it proposes" table below is a recorded reading: the one result every scenario and UAT script in this feature is run against. A test environment serves that recording for the named document, whatever stands behind it. A scenario checks what the product does with the reading, never whether a model produced it. How a tester gets the recording served, and how they return to the starting state, is Q-88.

**Rows that depend on Q-82 (unit conversion).** The first release converts no unit, and nobody has decided what it does with a figure stated in another unit. The recordings below are the prototype's, which arrive already converted. These rows, and every count and total that includes them, may change when Q-82 is answered:

- Crew log: `C3` (1.5 ha read as 3.7 acres) and `C4` (2,640 ft read as 0.5 miles); so also "6 changes" and the "After" totals of those two measures.
- Funder report: `F4` (3,960 feet read as 0.75 miles) and `F5` (2,112 feet read as 0.4 miles); so also "7 ready to add".
- Pasted paragraph: `P3` (35 people × 4 hours shown as 140 hours; Q-82 part d).

## The project

Deer Creek Riparian Corridor Enhancement ("Deer Creek"). Lead organization: Deer Creek Watershed Alliance. Stage: Implementation. Starting state: nothing has been imported to it.

- Key facts: Timeline 2023–2027; County El Dorado; estimated total cost $412,000.
- Reporting periods: closed 2025, 2024, 2023 (an entry can be filed under these); open 2026, 2027. Each is named by its year.
- Breakdown questions: "Riparian treatment" (Planting, Invasive removal, Natural recruitment) on Acres of riparian habitat restored; "Activity type" (Planting, Monitoring, Site preparation, Outreach event) on Volunteer hours contributed. The other five measures ask none.
- Contacts: Renata Alvarez, Project lead, Deer Creek Watershed Alliance, r.alvarez@dcwa.org · Ivy Nakamura, Grant manager, California Watershed Restoration Board, i.nakamura@cwrb.org · Alma Reyes, Field contact, Deer Creek Watershed Alliance, a.reyes@dcwa.org.
- Funding sources: Watershed Resilience Grant Program, California Watershed Restoration Board, $255,500 · Local Sponsor Match, Deer Creek Watershed Alliance, $156,500.
- Waiting hand edits (last published 2 March 2026): Timeline (2023–2026 to 2023–2027), estimated total cost ($398,500 to $412,000), the description.
- The workspace holds California Watershed Restoration Board, Pacific Fisheries Trust, Deer Creek Watershed Alliance and Granite Bay Ecological Consulting among its organizations. It does not hold Placerville Community Foundation or Hollis Family Ranch. No person in it is named Alma Reyes or Tomás Ibarra or has either one's email.

Performance measures. All seven are measures whose values add up, so the figure shown is the sum of the entries. "After C1–C6" is the figure once the crew log's six changes are added to the starting state.

| Performance measure | Unit | Before | After C1–C6 |
|---|---|---|---|
| Acres of riparian habitat restored | acres | 34.1 | 41.6 |
| Stream miles revegetated | miles | 2 | 2 |
| Native trees and shrubs planted | plants | 10,727 | 12,577 |
| Acres of invasive vegetation removed | acres | 12.6 | 16.3 (Q-82) |
| Miles of livestock exclusion fencing | miles | 3 | 3.5 (Q-82) |
| Volunteer hours contributed | hours | 1,478 | 1,618 |
| Native seed collected | pounds | 98 | 98 |

## The person

A tester signs in as someone who can edit Deer Creek: a Contributor in Deer Creek Watershed Alliance, or an Administrator. The prototype has no sign-in: every import carries the name Dana Whitfield and the day 30 September 2026.

## Crew log — `deer-creek-crew-log-2025.xlsx`

A spreadsheet of one sheet, "2025 crew log". Each row is one line of text. Rows 1, 2 and 13 hold nothing.

| Row | Text |
|---|---|
| 3 | 10/28/2024, late-season planting, west bank, 2 ac |
| 4 | Willow stakes, east bank reach 2, 3.5 ac |
| 5 | Irrigation line repair, east bank |
| 6 | Cottonwood poles, east bank reach 2, 2 ac |
| 7 | Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250) |
| 8 | Blackberry pull below county bridge, 1.5 ha |
| 9 | Stream temperature, 7-day maximum 64.9 °F at logger LC-2 |
| 10 | Exclusion fence, upland pasture, 2,640 ft. Notes: ~4 ac fenced off |
| 11 | Crew lunch, $180 |
| 12 | Saturday workday, sign-in sheet, 140 hrs |
| 14 | TOTAL |

What it proposes: six performance measure entries, all ready. Each quote is the rows, a dash, then each row's text in quotation marks: C2's is "Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”".

| Row | Label | Amount | Breakdown answer | Quote is of | Note |
|---|---|---|---|---|---|
| C1 | Acres of riparian habitat restored · 2025 | 5.5 acres | Riparian treatment: Planting | Rows 4 and 6 | none |
| C2 | Native trees and shrubs planted · 2025 | 1,850 plants | none | Row 7 | none |
| C3 | Acres of invasive vegetation removed · 2025 | 3.7 acres (Q-82) | none | Row 8 | none |
| C4 | Miles of livestock exclusion fencing · 2025 | 0.5 miles (Q-82) | none | Row 10 | Used the fence length, not the note’s “~4 ac”. |
| C5 | Volunteer hours contributed · 2025 | 140 hours | Activity type: Planting | Row 12 | Undated, so filed under 2025 from the sheet title. “Planting” is inferred. |
| C6 | Acres of riparian habitat restored · 2024 | 2 acres | Riparian treatment: Planting | Row 3 | Filed by its date, not the sheet title. |

**Which column is what is displayed, and what a field holds.** In all three "What it proposes" tables, the "Amount" or "Value as read" column is the value as it is displayed once on the record: the amount with its unit and thousands separators ("1,850 plants", "$48,000"), which is also the imported change's recorded value (story 22, R2). It is not what the check step shows. There the amount is plain digits with no separator and no unit, as the reading gave it: 1850 for C2, 1673 for F6. With story 01 alone the check step shows that amount as read, and it is not a field (story 01, R8); it is a field only from story 07 (R1). A funding source's "Secured ($)" is a field that holds 48000 for F11 (story 17). The unit is in the amount's label, "Amount (plants)". Whether the field should show separators is Q-113. In the funder report's table the "Change" column of F10 to F12 is the grant's name, which the check step shows in "Grant or program"; the on-screen label of all three is "Funding source" (story 17, R1).

Not used: "Stream temperature, 7-day maximum 64.9 °F at logger LC-2"; "Crew lunch, $180". Skipped: "Row 14, “TOTAL”." Tally "6 ready to add"; action "Add 6 changes"; toast "6 changes added from deer-creek-crew-log-2025.xlsx" (story 01, R12). Read again after C1–C6 were added, every change is "Already on file".

## Funder report — `deer-creek-completion-report-2025.pdf`

A completion report of four pages: page 1 (Project dates; Project location; Participants and funding), page 2 (Results; Treatments and metrics), page 3 (Narrative; Monitoring), page 4 (Budget by activity).

What it proposes: 14 changes, in the order the check step shows them. Each quote is the section and page, a dash, then the words: F3's is "Treatments table, page 2 — “Riparian invasive plant control, 4.2 acres”".

| Row | Section | Change | Value as read | Words read | Arrives |
|---|---|---|---|---|---|
| F1 | Key facts | Timeline | 2023–2025 ("Was 2023–2027") | Project dates, page 1: "Completion: September 2025" | ready |
| F2 | Key facts | County | El Dorado | Project location, page 1: "County: El Dorado" | already on file |
| F3 | Performance measures | Acres of invasive vegetation removed · 2025 | 4.2 acres | Treatments table, page 2: "Riparian invasive plant control, 4.2 acres" | ready |
| F4 | Performance measures | Miles of livestock exclusion fencing · 2025 | 0.75 miles (Q-82) | Treatments table, page 2: "Livestock exclusion fence installed, 3,960 feet" | ready |
| F5 | Performance measures | Stream miles revegetated · 2025 | 0.4 miles (Q-82) | Treatments table, page 2: "Riparian planting, 2,112 feet of stream" | ready |
| F6 | Performance measures | Native trees and shrubs planted · 2025 | 1,673 plants: "12,400 to date − 10,727 on record = 1,673" | Narrative, page 3: "To date the Alliance has planted 12,400 native trees and shrubs" | ready; a total to date |
| F7 | Performance measures | Acres of riparian habitat restored · 2025 | 6 acres; Riparian treatment: Planting. Note: "The report totals riparian treatment at 6 acres, so both lines look like the same ground: 6, not 12." | Treatments table, page 2: "Riparian tree planting, 6 acres" and "Riparian shrub planting, 6 acres" | flagged: two readings |
| F8 | Performance measures | Volunteer hours contributed · 2025 | amount empty. Note: "The report counts events. This measure asks for hours." | Results table, page 2: "Volunteer events held, 9" | flagged: another quantity |
| F9 | Performance measures | Native seed collected · 2025 | amount empty: "The table gives 40 with no unit. This measure is in pounds." | Results table, page 2: "Seed collected, 40" | flagged: unsure |
| F10 | Funding sources | Watershed Resilience Grant Program | California Watershed Restoration Board; $255,500 | Participants and funding, page 1: "California Watershed Restoration Board, Watershed Resilience Grant Program, $255,500" | already on file |
| F11 | Funding sources | Fisheries Habitat Fund | Pacific Fisheries Trust; $48,000 | Participants and funding, page 1: "Pacific Fisheries Trust, Fisheries Habitat Fund, $48,000" | ready |
| F12 | Funding sources | Community Streams Grant | Placerville Community Foundation; $12,500 | Participants and funding, page 1: "Placerville Community Foundation, Community Streams Grant, $12,500" | flagged: "Not in this workspace" |
| F13 | Contacts | Contact · Field contact | Alma Reyes, Deer Creek Watershed Alliance, a.reyes@dcwa.org | Participants and funding, page 1: "Alma Reyes, a.reyes@dcwa.org, primary project coordinator" | already on file |
| F14 | Contacts | Contact · Monitoring contact | Tomás Ibarra, Granite Bay Ecological Consulting, t.ibarra@gbec.com | Monitoring, page 3: "Monitoring contact: Tomás Ibarra, Granite Bay Ecological Consulting, t.ibarra@gbec.com" | ready |

**What the recording holds, and what the product works out.** The first five columns are the recording: the input. It also holds, for F6, that 12,400 is a total to date, and for F7 to F9 the flag and its reason. "Arrives" is the expected result, and the product works these parts of it out from the record and the workspace in the starting state above; none is in the recording: "already on file" (F2, F10, F13); "Not in this workspace", its message and the empty "Organization" (F12); F6's difference and its arithmetic line; "Was 2023–2027" on F1; and that every other row is ready. For F10 to F12 the recording holds the name, the organization as the report writes it and the amount as a number (255500, 48000, 12500), nothing else.

Not used: "Large wood structures placed, 14 structures"; "Pools created, 14 pools"; "Watershed: South Fork American River. This project has no Watershed field."; "Site coordinates 38.742, −120.681. Location changes only from a spatial file."; "Landowner: Hollis Family Ranch. Not a contact or a funder." Skipped: "Budget table, page 4: spend is recorded by year, not by grant."

Tally "7 ready to add · 4 need you · 3 already on file"; action "Add 7 changes"; toast "7 changes added from deer-creek-completion-report-2025.pdf". After the seven ready changes (F1, F3 to F6, F11, F14) are added to the starting state: Timeline 2023–2025; four new performance measure entries; a funding source row "Fisheries Habitat Fund", Pacific Fisheries Trust, $48,000, and "Total from all sources" $460,000 above "Estimated total cost" $412,000; a contact row "Monitoring contact", Tomás Ibarra.

## Pasted paragraph

Four sentences, one paragraph, pasted as text: "This spring we planted 6 acres of willow and cottonwood along the east bank, and fenced off another half mile of the upland pasture from the cattle. A volunteer day brought out 35 people for 4 hours each. Our logger showed a 7-day max of 65°F in late July."

What it proposes: three performance measure entries, all ready. The quote is the words alone, in quotation marks.

| Row | Label | Amount | Breakdown answer | Words read | Note |
|---|---|---|---|---|---|
| P1 | Acres of riparian habitat restored · 2025 | 6 acres | Riparian treatment: Planting | This spring we planted 6 acres of willow and cottonwood along the east bank | none |
| P2 | Miles of livestock exclusion fencing · 2025 | 0.5 miles | none | fenced off another half mile of the upland pasture from the cattle | none |
| P3 | Volunteer hours contributed · 2025 | 140 hours (Q-82) | Activity type: Planting | A volunteer day brought out 35 people for 4 hours each | “Planting” is inferred. |

Not used: "Stream temperature, 7-day maximum 65 °F". Nothing skipped. Tally "3 ready to add"; toast "3 changes added from pasted text".

## Not in any fixture

Behaviors the stories say no sample document or recorded reading shows. Collected on 2026-11-23 from each story's Test data line and the note that opens its Scenarios, and brought up to date the same day after the builder's checklist pass, so the gap is visible in one place; no fixture was added. Pointers were brought in line with the merge pass of 2026-11-23 (44 stories became 41); the samples worth making first are under "Samples the feature still needs", below. A scenario that needs one of these describes its data by kind and size, and its story says so. The prototype's own list is in `inventory.md`, "What no sample shows".

Files and documents a tester has to bring or make:

- A file the reading fails on, and so a failed reading (stories 02, 10; later story 28). Which failures are told apart is Q-41.
- A file over 20 MB; a file of a type the control does not name, such as an image (stories 08, 10). A second file under the limit to hold first, for a too-large file chosen over a held one (story 10; Q-104).
- A second readable file, for several files dropped together on the project page or on the control (stories 08, 01; Q-100); the funder report file serves.
- A spatial file: a .geojson and a .zip (story 11). A spatial file over 20 MB, and one Upload shapes would refuse (story 11; Q-106).
- A pasted text at a length limit (story 09; Q-47); a pasted text of several paragraphs, with single line breaks inside one of them (story 40, R3; Q-139); a pasted text that proposes one change (story 40).
- A report that names another project; one that names Deer Creek in full; one that names it in other capitals and with a year (story 20; Q-74).
- A second document for a second import: any second import (stories 22, 23); one that sets a Key facts field the funder report sets, the Timeline (stories 15, 41, 51); one whose import carries a second note (story 21); a second import that adds the same new funding source as the first (stories 41, 17; Q-99); two imports of one Key facts field, both taken back in turn (story 41; Q-138).
- A report whose reading takes minutes (later story 28).

Readings no recording holds:

- A reading with one change, or with none: a document with nothing to propose (stories 02, 22, 40; Q-42).
- A reading with the same thing twice: two identical performance measure entries, one period's amount beside a total to date for the same measure, two values for one Key facts field, two contacts with one email (stories 04, 13, 15, 18; Q-99).
- A change with no page and no passage (stories 31, 33; Q-117).
- A reading whose reporting period the project does not offer; a breakdown answer that is not one of the question's options; a typed amount with more decimals than the measure's setting allows (story 07; Q-113, Q-114, Q-115).
- A total to date that the reading also flagged (story 13, S6 and S7).
- A reading made only of performance measure entries that has a flagged change, a second section or an arithmetic line. The funder report has all three, and needs stories 13, 14, 15, 17 and 18 before it can be shown (stories 04, 31).
- A ready change with a breakdown question that arrives unanswered: rows C1, C5, C6, P1 and P3 all arrive answered (story 07; Q-90). One flagged row does arrive unanswered: F8, whose measure asks "Activity type" and whose recording answers nothing. It is seen once story 14 lists flagged changes.
- An entry that matches the record in all but one breakdown answer; a reading that itself claims the record already holds a change (story 32).
- A Key facts value that differs from the record's for a field other than the Timeline; a custom field; a field kept by a data source, authoritative or not (stories 15, 16).
- A funding source that matches the record's in different capitals, or with another amount; one whose organization matches the workspace's in different capitals; two with the same name and organization in one reading (Q-99); one with no organization or no amount (Q-132); one whose organization is on the record but not in the workspace (story 17, R7; Q-134).
- A contact who matches a person in the workspace, or two of them; a contact with no role; a contact with no organization; a contact with no email (story 18; Q-73, Q-128).
- A reading from a file with nothing skipped; only the pasted paragraph has none (story 19). A reading with two skipped items (story 19, S8; Q-129).
- A reading of a file that comes back as passages, with a passage marked (story 31; Q-66).
- A PDF whose recorded reading proposes performance measure entries only, read from two different pages (story 31, S1, S2 and UAT steps 1 to 3).
- The crew log's reading as it arrives before conversion, a figure in a unit of another kind or in an unknown unit; a total to date in another unit; a figure with no unit as the reading service returns it (later enabler 26; Q-82, Q-147, Q-148).
- A model answer that trips the reading guards: a measure Deer Creek is not asked, a year that is not a closed reporting period, a breakdown answer that is not an option, a field not offered, a value in the wrong format such as a one-year Timeline, a low-confidence figure (later enabler 50; Q-149, Q-150).
- A partner organization change (later story 27).
- The performance measure figures after the funder report's ready changes are added: the tables above give "After C1–C6" only. Story 65's script works its one figure out itself (12.6 and F3's 4.2 make 16.8).
- In the review: a section with both a hand edit's row and an imported row that is not folded onto it (story 24, R6); a project that has never been published, with an import (story 24; Q-142); a field an import set that is then edited by hand (stories 24, 51; Q-143).

People, projects and settings the sample workspace lacks:

- A note for the reviewer: the tester writes one (story 21).
- A Viewer, an Administrator in no organization that leads Deer Creek, and a Contributor of another organization; a proposal and a completed project; a shared project; a workspace on a second plan (story 12).
- A GIS subscription that supplies a Key facts field of the project, set authoritative and then not (story 16). Two sources supplying one field is Q-127.

## Samples the feature still needs

Collected on 2026-11-23, after the merge pass, from the stories' UAT preambles and Test data lines. The rule since that pass is that a story's own effect must be observable with its blockers alone; several scripts cannot meet it with the three samples above, most of them because the one PDF, the funder report, proposes every kind of change at once. Each line names a sample by kind and the stories it would unblock. None exists yet and no contents are given here: whoever makes one records its reading and adds its table above. What the whole funder report lists and counts with only a story's blockers built is Q-159; a sample per kind is the other way to settle it.

- A PDF whose recorded reading proposes performance measure entries only, read from two different pages, the first from page 1 and another from page 3 (story 31, S1, S2 and steps 1 to 3; stories 33 and 80, every scenario that opens a PDF in the review; enabler 03's Verification, which needs a document the review can show).
- The funder report's performance measure entries with its total to date, row F6, and no other kind of change (story 13, steps 4 to 6).
- The funder report's three flagged performance measure changes, rows F7 to F9, with ready ones and no other kind of change, and the tally and counts that go with them (story 14, steps 2, 7 and 8; enabler 36, S6 and S8).
- The funder report's Key facts rows, F1 and F2, with performance measure entries and no other kind (story 15, step 6; story 16's S2 and S8, on a project set up for it).
- The funder report's funding source rows F10 and F11, with performance measure entries and no other kind (story 17, S6 to S10 and steps 1, 4 and 5); the same with row F12 (story 75, steps 1, 5 and 6; story 65, whose script leaves the count unquoted; enabler 36, S5 and S7).
- The funder report's contact rows, F13 and F14, with performance measure entries and no other kind (story 18, step 5).
- One reading with a ready Key facts field, funding source and contact, and no flagged change, total to date or funding source the workspace does not hold (story 41, every scenario and steps 1 to 5: its count of seven assumes stories 13, 14 and 75).
- A reading of a file that has "Not used" and "Skipped" lines above performance measure entries only, one of the lines stating coordinates (story 19, steps 1 to 7; story 11, S6 and step 6).
- A second small document for a second import: one of performance measure entries only (story 22, S6; story 23, S3; story 21, S9, which otherwise needs story 06 to add row F3 alone); one that sets the Timeline (story 15, S7; story 41, S4; story 51, both scenarios and its script).
- A note for the reviewer, of two short lines (story 21, S4 and S6 to S12; today the tester writes one).
- A model answer that trips a reading guard: a measure Deer Creek is not asked, a year that is not a closed reporting period, a breakdown answer that is not an option (later enabler 50, its whole Verification).
- A figure before conversion: the crew log's reading as it arrives before any unit is converted, and figures in a unit of another kind, in an unknown unit and as a total to date in another unit (later enabler 26, Verification steps 1 to 4 and S5 to S8; it would also settle the rows marked Q-82 above).
- A file whose reading comes back as passages, with a change that points at one (story 31, S4 and S5; not possible in the first release unless Q-66 says a file is returned as passages).
- A file whose reading fails (story 10, S5, S6 and the end of its script; enabler 02, S7; later story 28). How a tester makes a reading fail is Q-41.
- A report that names another project, and one that names Deer Creek in full (story 20, every scenario and its script).
- A project with a Key facts field kept by an authoritative data source, and a report that names another value for it (story 16; it also needs a stand-in for `gis-data-sources`).

## On the prototype

The prototype serves these recordings itself. On the choose step, "Sample crew log" and "Sample funder report" start the reading at once; under "Paste text" the paragraph is already in the text area. Any spreadsheet chosen as a file reads as the crew log and any PDF or Word file as the funder report, whatever it holds. To return to the starting state, clear the site's data in the browser. The prototype also draws things that are not requirements: "Check this" and "Unsure" badges, "Suggested: 720 hours." with "Use suggestion" on F8, and a "Converted: …" line on C3, C4, F4, F5 and P3 (story 26, `later`).
