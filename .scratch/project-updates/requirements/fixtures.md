# Fixtures — Import a report (project-updates, build 1)

The sample project, person and documents every scenario and UAT script in this feature uses. A story names a sample and its rows (`C2`, `F7`, `T1`) and does not repeat them. Written 2026-11-23 from `inventory.md`, Sample data, and the prototype's fixture file; rewritten the same day on the answers to the open questions. Everything here is invented.

**Readings are recorded, not live.** A model reads the document, and a model does not return the same reading twice. So each "What it proposes" table below is a recorded reading: the one result every scenario and UAT script in this feature is run against. A scenario checks what the product does with the reading, never whether a model produced it. Only enabler 02's Verification is run against the real reading service.

**The test environment.** An assumption, not a question: the development team provides one test environment. Its reading service is a stand-in that serves the recorded reading for each sample file below, by the file's name, and the recorded reading of the pasted paragraph for that text. It has a reset, outside the product, that returns the sample project to its starting state; a script's `Reset:` line reads "reset the sample project in the test environment". In it, reading by an outside AI service is **on** for the sample workspace (stories 82 and 83 hold the other states).

**The file is not kept (spec #42).** A sample file is something the tester chooses from their own computer. The product holds it only while its reading and its check step last. Once the import is added, or abandoned, the file is gone from the product: what stays is the document's name and each imported change's quote (the name and the quote are a proposal, Q-45). No script opens a document after the import is added.

**Samples corrected, and samples added.** The three samples the prototype serves were corrected on the answers (see each section), and ten narrow samples were added so that each story's script needs only that story and its blockers (Q-159). The ten are **to be made**: none exists in the prototype. Their names, row IDs and counts are fixed here and the stories rely on them.

## The project

Deer Creek Riparian Corridor Enhancement ("Deer Creek"). Lead organization: Deer Creek Watershed Alliance. Stage: Implementation. Starting state: nothing has been imported to it.

- Key facts: Timeline 2023–2027; County El Dorado; estimated total cost $412,000.
- Reporting periods: closed 2025, 2024, 2023 (an entry can be filed under these); open 2026, 2027. Each is named by its year.
- Breakdown questions: "Riparian treatment" (Planting, Invasive removal, Natural recruitment) on Acres of riparian habitat restored; "Activity type" (Planting, Monitoring, Site preparation, Outreach event) on Volunteer hours contributed. The other five measures ask none.
- Contacts: Renata Alvarez, Project lead, Deer Creek Watershed Alliance, r.alvarez@dcwa.org · Ivy Nakamura, Grant manager, California Watershed Restoration Board, i.nakamura@cwrb.org · Alma Reyes, Field contact, Deer Creek Watershed Alliance, a.reyes@dcwa.org.
- Funding sources: Watershed Resilience Grant Program, California Watershed Restoration Board, $255,500 · Local Sponsor Match, Deer Creek Watershed Alliance, $156,500.
- Waiting hand edits (last published 2 March 2026): Timeline (2023–2026 to 2023–2027), estimated total cost ($398,500 to $412,000), the description.
- The workspace holds California Watershed Restoration Board, Pacific Fisheries Trust, Deer Creek Watershed Alliance and Granite Bay Ecological Consulting among its organizations. It does not hold Placerville Community Foundation or Hollis Family Ranch. No person in it is named Alma Reyes or Tomás Ibarra or has either one's email.
- Workspace setting: reading by an outside AI service is on.

Performance measures. All seven are measures whose values add up, so the figure shown is the sum of the entries. "After C1–C6" is the figure once the crew log's six changes are added to the starting state.

| Performance measure | Unit | Before | After C1–C6 |
|---|---|---|---|
| Acres of riparian habitat restored | acres | 34.1 | 41.6 |
| Stream miles revegetated | miles | 2 | 2 |
| Native trees and shrubs planted | plants | 10,727 | 12,577 |
| Acres of invasive vegetation removed | acres | 12.6 | 16.3 |
| Miles of livestock exclusion fencing | miles | 3 | 3.5 |
| Volunteer hours contributed | hours | 1,478 | 1,618 |
| Native seed collected | pounds | 98 | 98 |

## The person

A tester signs in as someone who can edit Deer Creek: a Contributor in Deer Creek Watershed Alliance, or an Administrator. Imports carry that person's name and the day they were added. (The prototype has no sign-in: every import there carries the name Dana Whitfield and the day 30 September 2026.)

## What a recording holds, and what the product works out

This holds for every sample. It keeps the input apart from the expected result.

**In the recording** (the input, as enabler 02 returns it): for each proposed change, its kind and its values as the document writes them; its quote and the place it was read from (a page of a PDF, a passage of any other document); for a performance measure entry, the measure, the reporting period, the breakdown answers the document states, whether the figure is a total to date, the lines that were added together when there are several, an optional note, and either that the figure is settled or that it is not, with the reason; for a Timeline, only the year the report states; for a funding source, the grant's name, the organization as the report writes it and the amount as a number; for a contact, the name, role, organization and email. Beside the changes: each "Not used" item in the report's words with one reason from the fixed set (story 19, R2), each "Skipped" item with its reason, every project name the report states, and, for a document that is not a PDF, the document as passages. Every sample here names Deer Creek Riparian Corridor Enhancement or no project.

**Worked out by the product** (the expected result; none of it is in the recording): which changes are ready, "Needs you", "Not in this workspace" or "Already on file", and so which arrive ticked; the order of the changes; the tally and the count on the action; the "Added:" line of a sum (C1); the difference of a total to date and its arithmetic line (F6); "Was …" on a Key facts change and the Timeline's other year (F1, U1); the empty "Organization" and its message (F12); the sentence of each "Not used" and "Skipped" reason, which code words with the workspace's words.

**What is displayed, and what a field holds.** In every table the "Amount" or "Value as read" column is the value as displayed: the amount with thousands separators and its unit ("1,850 plants", "$48,000"). The imported change records its parts (story 22, R2); each screen words the value. On the check step an amount shows thousands separators too, without the unit, which is in the label: "Amount (plants)" holds "1,850" (C2); "Secured ($)" holds "48,000" (F11). With story 01 alone the amount is shown as text, not in a field (story 01, R8); it is a field from story 07 (R1). In the funder report's table the "Change" column of F10 to F12 is the grant's name, which the check step shows in "Grant or program"; the on-screen label of all three is "Funding source" (story 17, R1).

**Toasts.** "`<N>` changes added from `<file name>`"; for one change, "1 change added from `<file name>`".

## Crew log — `deer-creek-crew-log-2025.xlsx`

A spreadsheet of one sheet, "2025 crew log". Each row is one line of text. Rows 1, 2 and 3 hold nothing. Two things are restated from the prototype's sheet. Rows 8 and 10 are in the measure's own unit (they were 1.5 ha and 2,640 ft), because the first release converts nothing. The late-season line sits in row 13 (it was row 3), so that the order the document states the changes in is C1 to C6, the order every story uses.

| Row | Text |
|---|---|
| 4 | Willow stakes, east bank reach 2, 3.5 ac |
| 5 | Irrigation line repair, east bank |
| 6 | Cottonwood poles, east bank reach 2, 2 ac |
| 7 | Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250) |
| 8 | Blackberry pull below county bridge, 3.7 ac |
| 9 | Stream temperature, 7-day maximum 64.9 °F at logger LC-2 |
| 10 | Exclusion fence, upland pasture, 0.5 mi. Notes: ~4 ac fenced off |
| 11 | Crew lunch, $180 |
| 12 | Saturday workday, sign-in sheet, 140 hrs |
| 13 | 10/28/2024, late-season planting, west bank, 2 ac |
| 14 | TOTAL |

**How it is shown on the check step.** As passages, under its name: one page labelled "2025 crew log", and each row that holds text as one passage, in row order, with the row's number as its heading ("Row 7"). Each change points at the passage of the row it was read from. C1 was read from two rows and points at the first, row 4.

What it proposes: six performance measure entries, all ready, listed C1 to C6 on the check step (the document's order). Each quote is the rows, a dash, then each row's text in quotation marks: C2's is "Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”".

| Row | Label | Amount | Breakdown answer | Quote is of | Points at | Note |
|---|---|---|---|---|---|---|
| C1 | Acres of riparian habitat restored · 2025 | 5.5 acres, with the line "Added: 3.5 + 2 = 5.5 acres" | Riparian treatment: Planting | Rows 4 and 6 | Row 4 | none |
| C2 | Native trees and shrubs planted · 2025 | 1,850 plants | none asked | Row 7 | Row 7 | none |
| C3 | Acres of invasive vegetation removed · 2025 | 3.7 acres | none asked | Row 8 | Row 8 | none |
| C4 | Miles of livestock exclusion fencing · 2025 | 0.5 miles | none asked | Row 10 | Row 10 | Used the fence length, not the note’s “~4 ac”. |
| C5 | Volunteer hours contributed · 2025 | 140 hours | Activity type: unanswered (the row states none) | Row 12 | Row 12 | Undated, so filed under 2025 from the sheet title. |
| C6 | Acres of riparian habitat restored · 2024 | 2 acres | Riparian treatment: Planting | Row 13 | Row 13 | Filed by its date, not the sheet title. |

Not used, two lines: "Stream temperature, 7-day maximum 64.9 °F at logger LC-2. No performance measure asks for this." · "Crew lunch, $180. No performance measure asks for this." Skipped, one line: "Row 14, “TOTAL”. A total of the rows above."

Tally "6 ready to add"; action "Add 6 changes"; toast "6 changes added from deer-creek-crew-log-2025.xlsx" (story 01, R12). Read again after C1–C6 were added, every change is "Already on file" (story 32).

## Pasted paragraph

Three sentences, one paragraph, pasted as text: "This spring we planted 6 acres of willow and cottonwood along the east bank, and fenced off another half mile of the upland pasture from the cattle. Volunteers put in 140 hours on a workday. Our logger showed a 7-day max of 65°F in late July."

The second sentence is restated so that it needs no multiplication (it was "35 people for 4 hours each"). This departs from the proposal on Q-82 (d), which would have P3 arrive flagged: stories 09, 31 and 40 use the paragraph and none is blocked by story 14, so a flagged P3 could not be shown. The multiplication case is described by kind in story 14.

**How it is shown on the check step.** Under the heading "Pasted text", with no page label: the one paragraph, as one passage with no heading. P1 to P3 all point at it.

What it proposes: three performance measure entries, all ready. The quote is the words alone, in quotation marks, with no place in front.

| Row | Label | Amount | Breakdown answer | Words read | Note |
|---|---|---|---|---|---|
| P1 | Acres of riparian habitat restored · 2025 | 6 acres | Riparian treatment: Planting | This spring we planted 6 acres of willow and cottonwood along the east bank | none |
| P2 | Miles of livestock exclusion fencing · 2025 | 0.5 miles | none asked | fenced off another half mile of the upland pasture from the cattle | none |
| P3 | Volunteer hours contributed · 2025 | 140 hours | Activity type: unanswered | Volunteers put in 140 hours on a workday | none |

Not used, one line: "Our logger showed a 7-day max of 65°F in late July. No performance measure asks for this." Nothing skipped. Tally "3 ready to add"; action "Add 3 changes"; toast "3 changes added from pasted text".

## The ten narrow samples (to be made)

Each is its own invented PDF with its own recording, named for the one thing it shows. None exists in the prototype yet. Nine are cut from the funder report below: each keeps the funder report's four pages and holds only the sections its rows are read from, so a row with an F number is the funder report's row of that number, with the same value, the same words, the same page and the same arrival. Unless a line below says otherwise, a narrow sample has no "Not used" line and nothing skipped. Rows are listed in the order the check step shows them.

| Short name | File | Rows | Tally · action | Used by |
|---|---|---|---|---|
| treatments | `deer-creek-treatments-2025.pdf` | T1, T2 (below) | "2 ready to add" · "Add 2 changes" | 31; 24 and 84 where they name it; the second import in 21, 22, 23 |
| total to date | `deer-creek-total-to-date-2025.pdf` | F3, F6 | "2 ready to add" · "Add 2 changes" | 13 |
| flagged figures | `deer-creek-flagged-figures-2025.pdf` | F3, F7, F8, F9 | "1 ready to add · 3 need you" · "Add 1 change" | 14, 36 |
| key facts | `deer-creek-key-facts-2025.pdf` | F1, F2, F3 | "2 ready to add · 1 already on file" · "Add 2 changes" | 15, 16, 85 |
| funding | `deer-creek-funding-2025.pdf` | F3, F11, F10 | "2 ready to add · 1 already on file" · "Add 2 changes" | 17, 86 |
| funding unheld | `deer-creek-funding-unheld-2025.pdf` | F3, F11, F12, F10 | "2 ready to add · 1 needs you · 1 already on file" · "Add 2 changes" | 75, 65, 36 |
| contacts | `deer-creek-contacts-2025.pdf` | F3, F14, F13 | "2 ready to add · 1 already on file" · "Add 2 changes" | 18 |
| all kinds | `deer-creek-all-kinds-2025.pdf` | F1, F3, F11, F14 | "4 ready to add" · "Add 4 changes" | 41 |
| not used | `deer-creek-not-used-2025.pdf` | F3; "Not used" lines NU1 to NU5; "Skipped" line SK1 | "1 ready to add" · "Add 1 change" | 19, 11 |
| timeline update | `deer-creek-timeline-update-2026.pdf` | U1 (below) | "1 ready to add" · "Add 1 change" | the second import in 15, 41, 85 |

**treatments.** A report of three pages: page 1 (Treatments), page 2 (Site photographs; nothing is read from it), page 3 (Planting). Two performance measure entries, both ready.

| Row | Label | Amount | Quote | Page |
|---|---|---|---|---|
| T1 | Acres of invasive vegetation removed · 2025 | 4.2 acres | Treatments, page 1 — “Riparian invasive plant control, 4.2 acres” | 1 |
| T2 | Native trees and shrubs planted · 2024 | 1,850 plants | Planting, page 3 — “During the 2024 season the crew planted 1,850 native trees and shrubs” | 3 |

T2 is filed under **2024**, because the report dates the planting to the 2024 season. This departs from the proposal on Q-159, which left it under 2025: there it would equal crew log row C2, and as a second import after the crew log it would arrive "Already on file" once story 32 is built, so the scripts of stories 21, 22 and 23 would count differently by build state. T1 and C3 differ in amount (4.2 and 3.7), so neither is the other's repeat.

**timeline update.** A report of one page, dated 2026. One Key facts change, ready.

| Row | Change | Value as read | Quote | Page |
|---|---|---|---|---|
| U1 | Timeline | 2023–2029 | Schedule, page 1 — “Completion is now expected in September 2029” | 1 |

The recording holds the year 2029 only; the product takes 2023 from the record. On the starting state U1 shows "Was 2023–2027". Read after F1 was added it shows "Was 2023–2025". The year was 2026 in the proposal on Q-159; it is 2029 here (changed 2026-11-23) because 2023–2026 is the Timeline Deer Creek last published, so after U1 the record would have equalled the published page and the review might have shown no Timeline row (story 85). 2029 differs from every Timeline another sample or script sets (2025, 2026, 2027, 2028).

**not used.** Row F3, and below it the funder report's two lists, in this order:

| Line | Shown as |
|---|---|
| NU1 | Large wood structures placed, 14 structures. No performance measure asks for this. |
| NU2 | Pools created, 14 pools. No performance measure asks for this. |
| NU3 | Watershed: South Fork American River. This project has no Watershed field. |
| NU4 | Site coordinates 38.742, −120.681. Location changes only from a spatial file. |
| NU5 | Landowner: Hollis Family Ranch. Not a contact or a funder. |
| SK1 | Budget table, page 4. Spend is recorded by year, not by grant. |

In each line the first sentence is the report's own words and the second is the reason, worded by the product (story 19, R2 and R4).

**What each sample leaves on the record**, added whole to the starting state:

| Sample | Ticked on arrival | After "Add N changes" | Toast |
|---|---|---|---|
| treatments | T1, T2 | Acres of invasive vegetation removed 12.6 → 16.8; Native trees and shrubs planted 10,727 → 12,577 (an entry of 1,850 under 2024) | "2 changes added from deer-creek-treatments-2025.pdf" |
| total to date | F3, F6 | Acres of invasive vegetation removed 12.6 → 16.8; Native trees and shrubs planted 10,727 → 12,400 | "2 changes added from deer-creek-total-to-date-2025.pdf" |
| flagged figures | F3 | Acres of invasive vegetation removed 12.6 → 16.8 | "1 change added from deer-creek-flagged-figures-2025.pdf" |
| key facts | F1, F3 | Timeline 2023–2025; Acres of invasive vegetation removed 12.6 → 16.8 | "2 changes added from deer-creek-key-facts-2025.pdf" |
| funding | F3, F11 | Acres of invasive vegetation removed 12.6 → 16.8; a funding source row "Fisheries Habitat Fund", Pacific Fisheries Trust, $48,000; "Total from all sources" $460,000 | "2 changes added from deer-creek-funding-2025.pdf" |
| funding unheld | F3, F11 | as funding | "2 changes added from deer-creek-funding-unheld-2025.pdf" |
| contacts | F3, F14 | Acres of invasive vegetation removed 12.6 → 16.8; a contact row "Monitoring contact", Tomás Ibarra | "2 changes added from deer-creek-contacts-2025.pdf" |
| all kinds | F1, F3, F11, F14 | all four of the above | "4 changes added from deer-creek-all-kinds-2025.pdf" |
| not used | F3 | Acres of invasive vegetation removed 12.6 → 16.8 | "1 change added from deer-creek-not-used-2025.pdf" |
| timeline update | U1 | Timeline 2023–2029 | "1 change added from deer-creek-timeline-update-2026.pdf" |

The treatments sample added after the crew log: Acres of invasive vegetation removed 16.3 → 20.5; Native trees and shrubs planted 12,577 → 14,427.

## Funder report — `deer-creek-completion-report-2025.pdf` (end to end only)

**This sample is the end-to-end script.** It proposes every kind of change at once, so it is run once every first-release story is built, and no story's own script uses it. A story that names an F row means that row in one of the narrow samples above.

A completion report of four pages: page 1 (Project dates; Project location; Participants and funding), page 2 (Results; Treatments and metrics), page 3 (Narrative; Monitoring), page 4 (Budget by activity). It is a PDF and is shown as itself, at the page each change was read from.

What it proposes: 14 changes, listed here in the document's order within each section. Each quote is the section and page, a dash, then the words: F3's is "Treatments table, page 2 — “Riparian invasive plant control, 4.2 acres”". F4 and F5 are restated in miles (they were 3,960 feet and 2,112 feet).

| Row | Section | Change | Value as read | Words read | Arrives |
|---|---|---|---|---|---|
| F1 | Key facts | Timeline | 2023–2025 ("Was 2023–2027") | Project dates, page 1: "Completion: September 2025" | ready |
| F2 | Key facts | County | El Dorado | Project location, page 1: "County: El Dorado" | "Already on file"; no checkbox |
| F3 | Performance measures | Acres of invasive vegetation removed · 2025 | 4.2 acres | Treatments table, page 2: "Riparian invasive plant control, 4.2 acres" | ready |
| F4 | Performance measures | Miles of livestock exclusion fencing · 2025 | 0.75 miles | Treatments table, page 2: "Livestock exclusion fence installed, 0.75 miles" | ready |
| F5 | Performance measures | Stream miles revegetated · 2025 | 0.4 miles | Treatments table, page 2: "Riparian planting, 0.4 miles of stream" | ready |
| F6 | Performance measures | Native trees and shrubs planted · 2025 | 1,673 plants, with the line "12,400 to date − 10,727 on record = 1,673" | Narrative, page 3: "To date the Alliance has planted 12,400 native trees and shrubs" | ready; a total to date |
| F7 | Performance measures | Acres of riparian habitat restored · 2025 | amount empty; Riparian treatment: Planting. Sentence: "The table gives riparian tree planting, 6 acres, and riparian shrub planting, 6 acres, and the report totals riparian treatment at 6 acres: if both lines are the same ground the figure is 6; if not, 12." | Treatments table, page 2: "Riparian tree planting, 6 acres" and "Riparian shrub planting, 6 acres" | "Needs you": two readings |
| F8 | Performance measures | Volunteer hours contributed · 2025 | amount empty; Activity type unanswered. Sentence: "The report counts events. This measure asks for hours." | Results table, page 2: "Volunteer events held, 9" | "Needs you": another quantity |
| F9 | Performance measures | Native seed collected · 2025 | amount empty. Sentence: "The table gives 40 with no unit. This measure is in pounds." | Results table, page 2: "Seed collected, 40" | "Needs you": the figure is not settled |
| F10 | Funding sources | Watershed Resilience Grant Program | California Watershed Restoration Board; $255,500 | Participants and funding, page 1: "California Watershed Restoration Board, Watershed Resilience Grant Program, $255,500" | "Already on file"; no checkbox |
| F11 | Funding sources | Fisheries Habitat Fund | Pacific Fisheries Trust; $48,000 | Participants and funding, page 1: "Pacific Fisheries Trust, Fisheries Habitat Fund, $48,000" | ready |
| F12 | Funding sources | Community Streams Grant | Placerville Community Foundation; $12,500 | Participants and funding, page 1: "Placerville Community Foundation, Community Streams Grant, $12,500" | "Not in this workspace"; "Organization" empty |
| F13 | Contacts | Contact · Field contact | Alma Reyes, Deer Creek Watershed Alliance, a.reyes@dcwa.org | Participants and funding, page 1: "Alma Reyes, a.reyes@dcwa.org, primary project coordinator" | "Already on file"; no checkbox |
| F14 | Contacts | Contact · Monitoring contact | Tomás Ibarra, Granite Bay Ecological Consulting, t.ibarra@gbec.com | Monitoring, page 3: "Monitoring contact: Tomás Ibarra, Granite Bay Ecological Consulting, t.ibarra@gbec.com" | ready |

For F1 the recording holds the year 2025 only; the product takes 2023 from the record. For F7 to F9 the recording holds that the figure is not settled, and the reason. F7 to F9 carry the one badge "Needs you" (Q-61); F12 carries "Not in this workspace".

Order on the check step (ready, "Needs you", "Not in this workspace", "Already on file"; then the document's order): Key facts F1, F2 · Performance measures F3, F4, F5, F6, F7, F8, F9 · Funding sources F11, F12, F10 · Contacts F14, F13.

Not used: lines NU1 to NU5 above. Skipped: line SK1 above.

Tally "7 ready to add · 4 need you · 3 already on file"; action "Add 7 changes"; toast "7 changes added from deer-creek-completion-report-2025.pdf". After the seven ready changes (F1, F3 to F6, F11, F14) are added to the starting state: Timeline 2023–2025; four new performance measure entries (Acres of invasive vegetation removed 16.8; Miles of livestock exclusion fencing 3.75; Stream miles revegetated 2.4; Native trees and shrubs planted 12,400); a funding source row "Fisheries Habitat Fund", Pacific Fisheries Trust, $48,000, and "Total from all sources" $460,000 above "Estimated total cost" $412,000; a contact row "Monitoring contact", Tomás Ibarra.

## Not in any fixture

Behaviors no sample document or recorded reading shows. A scenario that needs one of these describes its data by kind and size, never with invented names, and its story says so. Rebuilt on 2026-11-23, when the answers were written in.

Readings no recording holds:

- A figure in another unit than the measure's, and a figure that would need multiplying ("35 people for 4 hours each") (story 14; Q-82). A total to date in another unit (story 13).
- Every repeat: two identical performance measure entries in one reading; one period's amount beside a total to date for the same measure; two values for one Key facts field; two contacts with one email; two funding sources with one name and organization; a "Not used" line returned twice (stories 32, 13, 15, 18, 86, 19; Q-99).
- A reporting period the project does not offer (stories 07, 14, 30; Q-114).
- A breakdown answer that is not one of the question's options (story 07; Q-115).
- A Key facts value that does not fit its field; a one-year Timeline for a project with no Timeline on record; a value for stage, project type or lead organization (stories 15, 19; Q-71, Q-125, Q-65).
- A report that names another project, several other projects, or Deer Creek in other capitals or with a year (story 20; Q-74).
- A failed reading, for each of the six reasons (stories 02, 10; Q-41).
- A reading that proposes nothing (stories 02, 04, 19; Q-42).
- A funding source with no organization, with no amount, or one the record already holds with another amount (stories 75, 86; Q-132, Q-50).
- A change with no place: no page in a PDF, no passage in any other document (stories 04, 31; Q-117).
- A document that fails to show in the pane (story 04, R10).
- A reading with two skipped items; a part about another project among the skipped (story 19; Q-129).
- A project with no performance measure, or with no closed reporting period (stories 02, 12, 19; Q-43).
- An entry that matches the record in all but one breakdown answer (story 32).
- A custom field; a contact with no role, no organization or no email; a contact who matches a person in the workspace (stories 15, 18).
- A partner organization change; a reading that takes minutes (later stories 27, 28). Figures before conversion and answers that trip the later guards (later enablers 26, 50).

Files a tester has to bring or make:

- A file over 20 MB; one over 100 pages or 5,000 rows; a `.doc` or `.xls`; a file of a type the control does not name, such as an image (stories 08, 10).
- A second readable file, for several files dropped together (stories 01, 08); any narrow sample serves.
- A spatial file: a .geojson and a .zip; a .zip over 50 MB; one Upload shapes would refuse (story 11).
- A pasted text over 50,000 characters; one of several paragraphs (stories 09, 31).

People, projects and settings the sample workspace lacks:

- A note for the reviewer: the tester writes one (story 21).
- A Viewer, an Administrator in no organization that leads Deer Creek, and a Contributor of another organization; a proposal and a completed project; a shared project (story 12).
- An Administrator account and a second, non-Administrator Contributor in the sample workspace; a workspace where reading by an outside AI service is off, and a second workspace made unavailable (stories 82, 83).
- A stand-in for `gis-data-sources` that keeps a Key facts field of the project, can be set authoritative or not, and can be read for what it was handed (story 16).
- A way, outside this feature, to take away a person's right to edit the project while a page is open (`users-and-security`; stories 01, 12, 84).

## Samples the feature still needs

The ten narrow samples above are named and counted but not made: whoever builds the test environment writes each PDF and records its reading as its table says. Beyond those, these would turn "by kind" scenarios into runnable ones, most useful first:

- A row for the flagged-figures sample with a figure in another unit, and one that needs multiplying (Q-82), once the proposal is validated.
- A sample with each repeat of Q-99: two identical entries; a period's amount beside a total to date; two values for one Key facts field.
- A report that names another project, and one that names Deer Creek in other capitals with a year (story 20, every scenario and its script).
- A file whose reading fails, one per reason the tester can cause (a scan with no text; a password-protected PDF; an empty file), and two small PDFs the stand-in answers with a failure: `locked.pdf` (password-protected) and `slow-report.pdf` (took too long); a pasted text the stand-in fails (stories 09, 10; enabler 02). To be made.
- A document that proposes nothing and has "Not used" lines (stories 04, 19).
- A reading with a period the project does not offer, and one with a breakdown answer that is not an option (story 07).

## On the prototype

The prototype serves only the three old recordings (crew log, funder report, pasted paragraph), unrestated: its crew log still has 1.5 ha and 2,640 ft, its funder report feet, its paragraph "35 people for 4 hours each". None of the ten narrow samples exists there. On the choose step, "Sample crew log" and "Sample funder report" start the reading at once; under "Paste text" the paragraph is already in the text area. Any spreadsheet chosen as a file reads as the crew log and any PDF or Word file as the funder report, whatever it holds. To return to the starting state, clear the site's data in the browser.

The prototype also draws things that are not requirements: three flagged badges ("Needs a decision", "No match", "Unsure") and the struck "Check this"; "Suggested: 720 hours." with "Use suggestion" on F8; a "Converted: …" line on C3, C4, F4, F5 and P3 (enabler 26, `later`); inferred breakdown answers on C5 and P3; a filled amount of 6 on F7; a checkbox on F2, F10 and F13; a chosen spreadsheet shown as "This file can't be shown here."; the kept document, opened from the change history and the review, and the review's document pane (spec #42: not in the product).
