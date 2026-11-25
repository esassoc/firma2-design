# 02 — Reading service: a model reads the document, code does the arithmetic

Type: enabler
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-38, Q-41, Q-42, Q-43, Q-47, Q-66, Q-74, Q-82, Q-85, Q-89, Q-98, Q-99, Q-118, Q-125, Q-129
Revision: 1
Blocked by: none
Covers: RUL-33, RUL-70, RUL-130, RUL-131, RUL-132, RUL-133, RUL-134, RUL-237, RUL-238, RUL-239, RUL-240, RUL-241, RUL-242, RUL-243, RUL-244, RUL-245, RUL-246, RUL-247, RUL-248, RUL-249, RUL-250, RUL-251, RUL-252
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report` (scripted there; the developer-machine reader is the nearest thing to it); inventory RUL-33, RUL-70 (no spec decision number); spec #41, #42; interview 2026-11-23, Q-62
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R8. Nothing blocks it, and nothing here stands on a recording: this is the story the recordings stand in for. Story 01 needs only its thinnest slice (performance measure entries read from a file); the rest is first used by the story named beside each part. Built here, not showable until a later story: R1's workspace setting (stories 82 and 83); funding sources and contacts in R6 (stories 17, 18); the project names of R6 (story 20). To confirm when a reading service is chosen: R5's 100 pages and 5,000 rows.

## Capability

This enabler provides the reading: given one document and what one project can take, it returns the changes the document supports, each with the words it was read from. It unblocks stories 01, 13, 14, 15, 17, 18, 19, 20 and 32, and enablers 26 and 50. Story 01 needs only its thinnest slice; each of the others needs one more kind of change or one more case from it.

## Description

The reading sits between "Read it" and the check step. Its one rule is a division of work: a model reads the document and maps what it says to the project; code does every calculation and every comparison; a person adds. Nothing the model returns is trusted as arithmetic, as a statement about the record or as interface wording. The service is outside the workspace (an outside AI service), so it reads only for a workspace that has turned that on, is sent as little as the job needs, and keeps nothing. The first release converts no unit and multiplies nothing; the later checks on what the model returns are enabler 50, and unit conversion is enabler 26. The prototype has no reading service: its readings are scripted, and corrected copies of those scripts are the recorded readings in `../fixtures.md`.

## Requirements

R1. Given one document and one project, the reading maps what the document states to that project: for a figure, which of the project's performance measures it answers and which reporting period it belongs to. The period is taken from dates in the document; when the document gives none, the figure is filed under the latest period the reading was given, and the change's note says so. A measure is named exactly as the project names it. A document is read only for a workspace where reading by an outside AI service is on; for any other workspace nothing is sent.

R2. A figure is reported as the document states it: the number and the unit as written. Every calculation is done by code, never by the model, and the first release has one: adding together the lines the model says belong to one entry. The sum is exact and never rounded, and it comes back with its parts, so the person can be shown the arithmetic. Nothing is converted and nothing is multiplied: a figure in another unit than the measure's, or one that would need multiplying, comes back as written, with its unit, as a figure that is not settled, with that reason.

R3. The reading says nothing about whether the record already holds a change.

R4. The reading writes nothing to the project's record, and nothing of it is kept. When the person leaves before it finishes, the service stops where it can, and a reading that finishes anyway is thrown away. Whatever the outcome (added, cancelled, failed, left), the service keeps neither the reading nor the document once the reading has ended, and the outside provider keeps neither.

R5. What goes in: the document, and what the project can take: the project's name, its closed reporting periods, each of its performance measures with its unit and its breakdown questions and their options, and each Key facts field a change may be proposed for, with the field's label and format.
- The record's values do not go in (R3). Nothing about the project's funding sources or contacts goes in, and nothing about the workspace's organizations or people.
- The document is a PDF, a Word file (.docx), an Excel file (.xlsx), a CSV file, a plain text file (.txt), or pasted text. A file is at most 20 MB and at most 100 pages or 5,000 spreadsheet rows; pasted text is at most 50,000 characters. Anything else is refused before it is sent (stories 09, 10).
- The reading proposes nothing outside what it was given: no other measure, no other reporting period, no breakdown answer that is not one of the question's options.
- A project with no performance measure, or with no closed reporting period, is still read. Its figures come back as "Not used" items with that reason, and Key facts, funding sources and contacts are proposed as for any project.

R6. What comes back:
- The proposed changes, in the order the document states them. A performance measure entry gives the measure, the reporting period, the amount, the number and unit as the document writes them, the lines added together when there are several, the breakdown answers the document states, whether the figure is a total to date, an optional note, and one of two verdicts: the figure is settled, or it is not, with the reason (the document supports more than one reading; it counts another quantity; the unit is missing or is not the measure's; it would need multiplying). There is no third verdict and no confidence. A Key facts change gives the field and the value; for a Timeline, only the year the report states. A funding source gives the grant or program, the organization as the report writes it and the amount secured. A contact gives the name, role, organization and email.
- For every change, the quote and the place it was read from. The quote is one line: where the words are, a dash, then the words in quotation marks ("Row 7 — “…”"). The place is the page, for a PDF, or the passage, for any other document.
- For every document that is not a PDF, the document itself as passages, for the check step to show. It is not stored.
- A figure the document restates is returned once. Separate lines of one table that belong to one entry are returned as one entry, added (R2).
- The "Not used" items: every quantity, attribute and party the document states about the project that no change was made from, each in the document's own words with one reason from the fixed set story 19 lists (R2 there). The service picks the reason; it does not word it.
- The "Skipped" items: each part of the document passed over on purpose, with its reason (story 19, R4).
- Every project name the document states, as written, and any project number: a list, which may be empty. Whether one of them is this project is worked out afterwards (story 20, R3).

R7. A reading that has not come back after four minutes has failed. A failed reading proposes nothing and comes back with one of six reasons, told apart: the document has no text to read (it may be a scan); it is password-protected; it is empty; the reading took too long; the reading service is not available; the connection was lost.

R8. A document that states nothing the project can take is not a failure: the reading comes back with no proposed change, and with whatever "Not used" and "Skipped" items it has.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Checks on what the model returns — enabler 50 (`later`). Unit conversion — enabler 26 (`later`).
- A figure stated as a total to date, and the difference filed — story 13.
- "Already on file", and a thing stated twice in one reading as the person sees it — story 32 (and 15, 18, 86).
- What the person sees for a figure that is not settled — story 14. The order of the changes on the check step — story 04 (R4).
- Key facts, funding sources and contacts as kinds of change — stories 15, 17 and 18.
- The "Not used" and "Skipped" lists on the check step, and the wording of each reason — story 19. The warning that the report names another project — story 20.
- The wait on the page — story 01. Pasted text as the document — story 09. What the person is told when a file is refused or a reading fails — story 10. The check step for a reading with no change — story 04 (R3).
- Turning reading by an outside AI service on or off — story 82. What a person sees while it is off — story 83.
- A reading the person can leave and come back to — story 28 (`later`).

## Needs to know from elsewhere

- The project's performance measures, their units, breakdown questions and options, and which reporting periods are closed — owned by `performance-measures`. The reading is given these as they are when "Read it" is pressed; it asks that feature nothing itself.
- A reading is asked for only by someone who can edit the project (SR-3). The right is checked again on "Read it", before the document is sent — owned by story 01; what the person then sees is story 12, R6.
- Reading by an outside AI service is a workspace setting with the states off, on and unavailable; off is the default — owned by story 82. R1's rule is proven in story 83.
- A change reaches the record only when a person presses "Add N changes" — owned by story 01. The file is not kept after that either (spec #42): what stays is the document's name and each change's quote — story 22.
- No reading proposes a change to a project's location; coordinates in a report's text come back as a "Not used" item with the reason that location changes only from a spatial file — stated in story 11 (R5) and story 19 (R7).

## Scenarios

The recorded readings in `../fixtures.md` stand in for this enabler in every other story, so they cannot prove it. Each scenario states something that must hold of any reading the service returns; the rows named are examples of a result that conforms, not the result a model must give. Where no sample holds the data, the document is described by kind.

**S1 — A figure is mapped to a measure and a reporting period** (proves R1)
- Given a report that reads "Riparian invasive plant control, 4.2 acres", and Deer Creek, which is asked "Acres of invasive vegetation removed" and has 2025 among its closed reporting periods
- When the report is read for Deer Creek
- Then a proposed performance measure entry names that measure and a closed reporting period, with the amount 4.2 (row F3)

**S2 — Code adds the lines, and returns the parts** (proves R2)
- Given the crew log, whose rows 4 and 6 read 3.5 ac and 2 ac of planting on the same reach
- When the model returns the two rows as lines of one entry
- Then the entry's amount is 5.5, exactly, and the parts 3.5 and 2 come back with it (row C1)

**S3 — A figure in another unit is not converted** (proves R2)
- Given a document that gives a length in feet for a measure whose unit is miles
- When it is read
- Then the entry comes back with the number and "feet" as written, not settled, with the reason that the unit is not the measure's, and no figure in miles

**S4 — The reading does not speak for the record** (proves R3)
- Given Deer Creek's record already holds an entry of 1,850 plants for "Native trees and shrubs planted" in 2025
- When the crew log is read for Deer Creek
- Then the entry read from row 7 comes back as a proposed change like any other, with no statement that the record holds it

**S5 — Reading changes nothing and keeps nothing** (proves R4)
- Given Deer Creek's figures are the fixture's "Before" column
- When the crew log is read for Deer Creek and the person leaves without adding
- Then the figures are still the "Before" column, and the service holds neither the reading nor the file

**S6 — Nothing is proposed outside what the project can take** (proves R5, R6)
- Given a report that reads "Pools created, 14 pools", and no performance measure of Deer Creek asks for pools
- When the report is read for Deer Creek
- Then no proposed change is about pools, and "Pools created, 14 pools" comes back as a "Not used" item with the reason that no performance measure asks for it (line NU2)

**S7 — A project with no closed reporting period is still read** (proves R5)
- Given a project whose reporting periods are all open, and a report that states one figure for one of its performance measures and a county
- When the report is read for that project
- Then the figure comes back as a "Not used" item with the reason that there is no closed reporting period, and the county comes back as a proposed Key facts change

**S8 — Every quote is the document's own words, with its place** (proves R6)
- Given the crew log, whose row 7 reads "Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)"
- When the crew log is read
- Then the quote of the entry read from that row holds those words exactly, with "Row 7" in front, and the entry points at row 7's passage (row C2)

**S9 — A document that is not a PDF comes back as passages** (proves R6)
- Given the crew log, a spreadsheet of one sheet
- When it is read
- Then the reading holds the sheet as one page of passages, one for each row that holds text

**S10 — A restated figure comes back once** (proves R6)
- Given a report that gives one figure for one measure and period in a summary and again in a table
- When it is read
- Then one entry comes back for it, not two

**S11 — Only the year the report states** (proves R6)
- Given a report that reads "Completion: September 2025" and states no start year
- When it is read for Deer Creek
- Then the Timeline change comes back with the year 2025 and no start year (row F1)

**S12 — A reading that fails says which way** (proves R7)
- Given a PDF that is a scan with no text in it
- When it is sent to be read
- Then the reading fails with the reason that the document has no text to read, and no change is proposed

**S13 — Four minutes** (proves R7)
- Given a document whose reading has not come back four minutes after it was sent
- When the four minutes are up
- Then the reading has failed with the reason that it took too long

**S14 — Nothing to propose is not a failure** (proves R8)
- Given a document that states no figure any performance measure of the project asks for, and no value for a field the project has
- When it is read for the project
- Then the reading comes back with no proposed change and no failure

## Verification

S4, S5, S10, S12, S13 and S14 cannot be run by a tester from a screen: a developer confirms them against the service. R1's workspace setting is verified through story 83. R6's project names are verified through story 20, its funding sources and contacts through stories 17 and 18.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Stories 01 and 04 are built. For this script only, the real reading service is behind the page, not the test environment's stand-in: it checks what must hold of any reading and does not expect the sample's rows one for one.
Test data: `../fixtures.md`: the crew log's rows 4 to 14; Deer Creek's "Before" figures, its seven performance measures and its closed reporting periods.
Reset: none needed; the script adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and note the seven figures on the Performance measures card | The "Before" column |
| 2 | Press "Import a report", choose `deer-creek-crew-log-2025.xlsx` and press "Read it" | Within four minutes, a list of changes with the crew log's rows beside them |
| 3 | Read each change's label | Each names one of Deer Creek's seven performance measures and one of 2025, 2024 and 2023 |
| 4 | For each change, find the quoted words in the row the quote names | They are there, word for word |
| 5 | Find a change whose quote names two rows, and add the two figures by hand | The change's amount is their sum, and a line under the quote shows the sum's parts |
| 6 | Look for a change about the stream temperature of row 9 or the crew lunch of row 11 | There is none |
| 7 | Go back to the project page by the breadcrumb, without pressing "Add N changes" | The seven figures of step 1 |

## Open questions

None open. The proposals this enabler rests on:

- Q-38 (proposed) — R5: the five file types and pasted text.
- Q-47 (proposed) — R5: 20 MB, 100 pages or 5,000 rows, 50,000 characters; the page and row figures are to be confirmed against the service chosen.
- Q-43 (proposed) — R5, S7: a project with no performance measure or no closed reporting period is still read.
- Q-89 (proposed) — R5, R6: nothing of the project's funding sources and contacts or the workspace's organizations and people is sent; the fields of a funding source and a contact; two verdicts, not three.
- Q-82 (proposed) — R2, S3: no conversion and no multiplication; such a figure comes back as written, not settled.
- Q-118 (proposed) — R2, S2: adding lines is the only arithmetic; exact, never rounded; the sum comes back with its parts.
- Q-66 (proposed) — R6, S9: every document that is not a PDF comes back as passages; no confidence. R7, S13: four minutes.
- Q-99 (proposed) — R6, S10: a restated figure comes back once; lines of one table are added.
- Q-129 (proposed) — R6: every unused item is listed, and every skipped part has a reason.
- Q-98 (proposed) — R6, S6: each "Not used" item is in the document's words with a reason from a fixed set the service does not word.
- Q-74 (proposed) — R6: every project name the document states, as a list.
- Q-125 (proposed) — R6, S11: only the stated year of a Timeline.
- Q-85 (proposed) — R4, S5: the service stops when the person leaves and keeps nothing.
- Q-41 (proposed) — R7, S12: the six reasons.
- Q-42 (proposed) — R8: what the person is then shown is story 04, R3.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; shown, developer-machine reader only; decided (spec #41) | RUL-33; RUL-130; RUL-237 |
| R2 | shown; shown, developer-machine reader only; proposed (Q-82); proposed (Q-118) | RUL-33; RUL-131; RUL-238; RUL-239 |
| R3 | shown | RUL-33 |
| R4 | shown; proposed (Q-85); decided (spec #42) | RUL-33; RUL-240; RUL-241 |
| R5 | shown, developer-machine reader only; proposed (Q-38); proposed (Q-47); proposed (Q-43); proposed (Q-89) | RUL-70, RUL-134; RUL-242; RUL-243; RUL-244; RUL-245 |
| R6 | shown, developer-machine reader only; proposed (Q-66); proposed (Q-89); proposed (Q-74); proposed (Q-125); proposed (Q-99); proposed (Q-129); proposed (Q-98) | RUL-70, RUL-132; RUL-246; RUL-245; RUL-247; RUL-248; RUL-249; RUL-250; RUL-251 |
| R7 | shown, developer-machine reader only; proposed (Q-66); proposed (Q-41) | RUL-70; RUL-246; RUL-252 |
| R8 | shown, developer-machine reader only; proposed (Q-42) | RUL-133; relies on story 04 |
- Prototype files: `scripts/report-reader.mjs` (the developer-machine reader: what it asks the model at 46-80, what it accepts back at 82-140, which files it unpacks at 266-277, what it builds from the answer at 340-449; the nearest thing to a specification); `src/data/firma2-report-import.ts` (the reading as the prototype models it, and the scripted readings); `src/components/projects/firma2-project-report-import.astro` (where the page checks proposals against the record).
- Data shapes, as the prototype models them: a reading holds proposed changes, a "Not used" list and a "Skipped" list, and for the two sample documents only, the document as pages of passages. A proposed change holds its kind and values, the quote, an optional passage and page, any arithmetic done, an optional note and its flags.
- Where the developer-machine reader differs from the requirements above (it is not the specification where they disagree): it sets no size limit; it has no latest period to fall back on for a project with no closed reporting period; it returns a sum as "3.5 + 2 = 5.5 ac" and rounds every amount to two decimals; it converts units; it words the "Not used" reasons itself and keeps the list to the notable quantities; it returns one project name and its own verdict on whether that is this project; it still asks the model for a confidence; it returns no contacts, funding sources, passages or page numbers; it does nothing when the page that asked is closed.
- Do not copy: the failure sentences that name the model ("No answer from Claude.", "Claude could not read it: …"); the scripted readings (any PDF or Word file reads as one sample, any spreadsheet as another, pasted text as a third) and the fixed 1.6-second wait; the reader running on one developer's machine under that developer's own login, and the page looking for it only from a localhost page; the samples' converted figures and inferred breakdown answers.

</details>
