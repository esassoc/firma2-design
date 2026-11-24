# 02 — Reading service: a model reads the document, code does the arithmetic

Type: enabler
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: none
Covers: RUL-33, RUL-70, RUL-130, RUL-131, RUL-132, RUL-133, RUL-134
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report` (scripted there; the developer-machine reader is the nearest thing to it); inventory RUL-33, RUL-70 (no spec decision number); interview 2026-11-23, Q-62
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R8, for performance measure entries read from a file, which is all story 01 needs. Nothing blocks it, and nothing here stands on a recording: this is the story the recordings stand in for. Waiting: what R2 does with a figure in another unit on Q-82; whether a sum is shown, and rounding, on Q-118; which kinds of file and how large, in R5, on Q-38 and Q-47; a project with no performance measure or no closed reporting period, in R5, on Q-43; whether R6 also returns the document as passages on Q-66; the time limit in R7 on Q-66; what happens to a reading and its document when the person leaves on Q-85; what goes in and comes back for funding sources and contacts on Q-89; whether a workspace must agree to model reading on Q-52.

## Capability

This enabler provides the reading: given one document and what one project can take, it returns the changes the document supports, each with the words it was read from. It unblocks stories 01, 13, 14, 15, 17, 18, 19, 20 and 32, and enablers 26 and 50. Story 01 needs only its thinnest slice (performance measure entries from a file); each of the others needs one more kind of change or one more case from it.

## Description

The reading sits between "Read it" and the check step. Its one rule is a division of work: a model reads the document and maps what it says to the project; code does every calculation; whether the record already holds a change is worked out afterwards, against the record; a person adds. Nothing the model returns is trusted as arithmetic or as a statement about the record. The checks code applies to what the model returns are enabler 50, and unit conversion is enabler 26 (both `later`), so the first release converts no unit. The prototype has no reading service: its readings are scripted, and those scripts are the recorded readings in `../fixtures.md`.

## Requirements

R1. Given one document and one project, the reading maps what the document states to that project: for a figure, which of the project's performance measures it answers and which reporting period it belongs to. The period is taken from dates in the document; when the document gives none, the figure is filed under the latest period the reading was given, and the change's note says so. A measure is named exactly as the project names it. (open: Q-52)

R2. A figure is reported as the document states it: the model returns the number and the unit as written. Every calculation on a figure is done by code, never by the model. In this story that is adding together the lines the model says belong to one entry. No unit is converted in the first release, by the model or by code. Not decided: whether the sum is shown to the person as arithmetic, and whether an amount is rounded to two decimals as the developer-machine reader rounds it (Q-118). (open: Q-82)

R3. The reading says nothing about whether the record already holds a change.

R4. The reading writes nothing to the project's record. Not decided: what the service does with a reading, and with the document it was sent, when the person leaves before it finishes (Q-85).

R5. What goes in: the document (a file with its name) and what the project can take: the project's name, its closed reporting periods, each of its performance measures with its unit and its breakdown questions and their options, and each Key facts field a change may be proposed for, with the field's label and format. The record's values do not go in (R3). The reading proposes nothing outside that list: no other measure, no other reporting period, no breakdown answer that is not one of the question's options. Not decided: which kinds of file must be read (Q-38) and how large a document may be (Q-47); a project with no performance measure or no closed reporting period (Q-43). (open: Q-89)

R6. What comes back: the proposed changes, the "Not used" lines, the "Skipped" lines, the project's name as the document writes it, and whether that is this project. Each proposed performance measure entry gives the measure, the reporting period, the amount, the number and unit as the document writes them, the breakdown answers the document states, whether the figure is a total to date, the quote, an optional note, and one verdict: the document counts what the measure asks, it supports more than one reading, or it counts something else. The quote is one line: where the words are, a dash, then the words in quotation marks ("Row 7 — “…”"). The changes come back in the order story 04, R4 shows them. (open: Q-66, Q-89)

R7. A reading that fails comes back as one sentence saying why, and proposes nothing. Not decided: how long a reading may run before it counts as failed (Q-66); which failures are told apart, and in what words (Q-41).

R8. A document that states nothing the project can take is not a failure: the reading comes back with no proposed change, and with whatever "Not used" and "Skipped" lines it has. (open: Q-42)

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Checks on what the model returns — enabler 50 (`later`). Unit conversion — enabler 26 (`later`).
- A figure stated as a total to date, and the difference filed — story 13.
- "Already on file" — story 32.
- What the person sees for each verdict, and a change the reading is unsure of — story 14. The order of the changes on the check step — story 04.
- Key facts, funding sources and contacts as kinds of change — stories 15, 17 and 18.
- The "Not used" and "Skipped" lists on the check step — story 19. The warning that the report names another project — story 20.
- The wait on the page — story 01. Pasted text as the document — story 09. What the person is told when a reading fails — story 10. What the check step shows for a reading with no change — not decided (Q-42).
- A reading the person can leave and come back to — story 28 (`later`).
- Keeping the document after the import is added — enabler 03.

## Needs to know from elsewhere

- The project's performance measures, their units, breakdown questions and options, and which reporting periods are closed — owned by `performance-measures`. The reading is given these as they are when "Read it" is pressed; it asks that feature nothing itself.
- A reading is asked for only by someone who can edit the project (SR-3) — owned by `users-and-security`.
- A change reaches the record only when a person presses "Add N changes" — owned by story 01.
- How the project's name as the document writes it is compared with this project's, which is what R6's "whether that is this project" returns — stated in story 20, R3 (open: Q-74).
- No reading proposes a change to a project's location, and coordinates in a report's text come back as a "Not used" line with the reason "Location changes only from a spatial file." — stated in story 11 (R5) and story 19 (R7), which a recorded reading can only show, not enforce.

## Scenarios

The recorded readings in `../fixtures.md` stand in for this enabler in every other story, so they cannot prove it. Each scenario below states something that must hold of any reading the service returns; the fixture rows named are examples of a result that conforms, not the result a model must give.

**S1 — A figure is mapped to a measure and a reporting period** (proves R1)
- Given the funder report, whose page 2 reads "Riparian invasive plant control, 4.2 acres", and Deer Creek, which is asked "Acres of invasive vegetation removed" and has 2025 among its closed reporting periods
- When the report is read for Deer Creek
- Then a proposed performance measure entry names that measure and a closed reporting period, with the amount 4.2 (row F3)

**S2 — Code adds the lines** (proves R2)
- Given the crew log, whose rows 4 and 6 read 3.5 ac and 2 ac of planting on the same reach
- When the model returns the two rows as lines of one entry
- Then the entry's amount is their sum, 5.5, and each figure in the quote is as the row writes it (row C1)

**S3 — The reading does not speak for the record** (proves R3)
- Given Deer Creek's record already holds an entry of 1,850 plants for "Native trees and shrubs planted" in 2025
- When the crew log is read for Deer Creek
- Then the entry read from row 7 comes back as a proposed change like any other, with no statement that the record holds it

**S4 — Reading changes nothing** (proves R4)
- Given Deer Creek's figures are the fixture's "Before" column
- When the crew log is read for Deer Creek and nothing is added
- Then the figures are still the "Before" column

**S5 — Nothing is proposed outside what the project can take** (proves R5)
- Given the funder report reads "Pools created, 14 pools", and no performance measure of Deer Creek asks for pools
- When the report is read for Deer Creek
- Then no proposed change is about pools, and the line comes back under "Not used"

**S6 — Every quote is the document's own words** (proves R6)
- Given the crew log, whose row 7 reads "Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)"
- When the crew log is read
- Then the quote of the entry read from that row holds those words exactly, with "Row 7" as where they are (row C2)

**S7 — A reading that fails says why** (proves R7)
- Given a file the service cannot read (no fixture is one)
- When the reading fails
- Then one sentence gives the reason and no change is proposed

**S8 — Nothing to propose is not a failure** (proves R8)
- Given a document that states no figure any performance measure of the project asks for, and no value for a field the project has (no fixture is one)
- When it is read for the project
- Then the reading comes back with no proposed change and no failure sentence

## Verification

S3, S7 and S8 cannot be run by a tester: nothing on a screen shows what a reading says about the record, no fixture fails, and none proposes nothing. A developer confirms them against the service.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Story 01 is built. The reading service itself is behind the page, not the recorded reading: this is the one script in the feature that is not run against the recording, so it checks what must hold of any reading and does not expect the fixture's rows one for one.
Test data: `../fixtures.md`: the crew log's rows 3 to 14; Deer Creek's "Before" figures, its seven performance measures and its closed reporting periods.
Reset: none needed; the script adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and note the seven figures on the Performance measures card | The "Before" column |
| 2 | Press "Import report", choose `deer-creek-crew-log-2025.xlsx` and press "Read it" | After the wait, a list of changes |
| 3 | Read each change's label | Each names one of Deer Creek's seven performance measures and one of 2025, 2024 and 2023 |
| 4 | Open the crew log on your computer and, for each change, find the quoted words in the row the quote names | They are there, word for word |
| 5 | Find a change whose quote names two rows, and add the two figures by hand | The change's amount is their sum |
| 6 | Look for a change about the stream temperature of row 9 or the crew lunch of row 11 | There is none |
| 7 | Go back to the project page by the breadcrumb, without pressing "Add N changes" | The seven figures of step 1 |

## Open questions

- Q-38, Q-47 — R5: the kinds of file the service must read, and the largest document; each adds a failure to R7.
- Q-41 — R7: which failures are told apart.
- Q-42 — R8: what the person is shown; the rule that it is not a failure does not wait on it.
- Q-43 — R5 and R1: what is read for a project with no performance measure, or with no closed reporting period to file under.
- Q-52 — R1: if a workspace must agree before a document is sent to a model, the reading has a condition this story does not state.
- Q-66 — R6: whether the document also comes back as passages for every kind of file, and whether a confidence comes back; R7: the time limit.
- Q-82 — R2 and S2: what comes back for a figure in another unit than the measure's; rows C3, C4, F4, F5 and P3 of the recordings.
- Q-85 — R4: whether the service stops when the person leaves, and whether it keeps the document it was sent.
- Q-88 — Preconditions: who provides an environment with the service, or the recording, behind the page.
- Q-89 — R5 and R6: what goes in and what comes back for funding sources and contacts, and whether "unsure" is a verdict the service returns.
- Q-118 — would change R2 and S2: whether the sum of added lines comes back as an arithmetic line for the person, and whether amounts are rounded to two decimals.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown; shown, developer-machine reader only | RUL-33; RUL-130 |
| R2 | shown; shown, developer-machine reader only | RUL-33; RUL-131 |
| R3 | shown | RUL-33 |
| R4 | shown | RUL-33 |
| R5 | shown, developer-machine reader only | RUL-70; RUL-134 |
| R6 | shown, developer-machine reader only | RUL-70; RUL-132 |
| R7 | shown, developer-machine reader only | RUL-70 |
| R8 | shown, developer-machine reader only | RUL-133 |

- Prototype files: `scripts/report-reader.mjs` (the developer-machine reader: what it asks the model at 46-80, what it accepts back at 82-140, which files it unpacks at 266-277, what it builds from the answer at 340-449; the nearest thing to a specification); `src/data/firma2-report-import.ts` (the reading as the prototype models it, and the scripted readings); `src/components/projects/firma2-project-report-import.astro` (where the page checks proposals against the record).
- Data shapes, as the prototype models them: a reading holds proposed changes, a "Not used" list and a "Skipped" list, and for the two sample documents only, the document as pages of passages. A proposed change holds its kind and values, the quote, an optional passage and page, any arithmetic done, an optional note and its flags.
- What the developer-machine reader does where nothing is decided (not requirements): it reads .pdf, .docx, .xlsx, .csv and .txt and refuses every other kind, among them the .xls the file control accepts (Q-38), and sets no size limit (Q-47); for a project with no closed reporting period it has no latest period to fall back on (Q-43); it returns a sum as "3.5 + 2 = 5.5 ac", which the page would show under "Converted:", while the recorded row C1 shows no such line, and it rounds every amount to two decimals (Q-118); the page sends each Key facts field's current value but the reader does not pass it to the model; it gives up on the model after four minutes (Q-66); it still asks the model for a confidence, which is no longer shown to the person (Q-25, Q-66); it returns no contacts, funding sources, "unsure" verdict, passages or page numbers (Q-89); it does nothing when the page that asked is closed (Q-85).
- Do not copy: the failure sentences that name the model ("No answer from Claude.", "Claude could not read it: …"); the scripted readings (any PDF or Word file reads as one sample, any spreadsheet as another, pasted text as a third) and the fixed 1.6-second wait; the reader running on one developer's machine under that developer's own login, and the page looking for it only from a localhost page; the samples' converted figures (Q-82).

</details>
