# 11 — A Contributor who chooses a spatial file has it handed to Upload shapes

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 01
Covers: STA-5, RUL-8, RUL-64, RUL-98, RUL-99, RUL-100
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #11; interview 2026-11-23, Q-26
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R3. Can start only against the recorded funder report reading in `../fixtures.md`, which stands in for enabler 02 (not built): R5. Waiting: R4 on `work-areas`, whose Upload shapes cannot yet receive a file handed to it, and on Q-70 and Q-106; the box while "Paste text" is chosen, in R2, on Q-107.

## Story

As a Contributor, I want a spatial file I chose by mistake to be passed to Upload shapes, so that the project's location changes only from a spatial file and I do not have to choose the file a second time.

## Description

On the choose step that story 01 builds, a person may give a file of shapes where a report belongs. Import a report does not read it: it says so and hands the file to Upload shapes, which `work-areas` owns. The same rule binds the reading: a report never changes a project's location, even when it states coordinates. The box is at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report` when a spatial file is dropped on the file control; the hand-off is decided and not in the prototype. The line that lists a report's coordinates as not used (once R6 here) moved to story 19 (R7) on 2026-11-23.

## Requirements

R1. A file whose name ends in .shp, .zip, .geojson, .kml, .kmz or .gpkg, in capitals or not, is a spatial file. The ending alone decides: a .zip is a spatial file whatever it holds. Given to the file control, it is held and is not read. Not decided: a spatial file over the control's 20 MB limit, which story 10 (R3) refuses before this story sees it (Q-106).

R2. While a spatial file is held, the choose step shows an information box titled "That's a spatial file", with the text "Shapes are added with Upload shapes on the project.", in which "Upload shapes" is a link. The box shows for as long as the control holds a spatial file, and goes when a file that is not spatial takes its place. Not decided: whether the box shows while "Paste text" is chosen (Q-107).

R3. Pressing "Read it" while a spatial file is held does nothing: no wait starts and no message is shown; the box is the message. Where story 09 is built and "Paste text" is chosen, "Read it" reads the pasted text as that story says (story 09, R4).

R4. The spatial file is handed to Upload shapes for the same project, and the box's link leads there, so the person does not choose the file again. Nothing is read and nothing reaches the record from Import a report. Not decided: a file Upload shapes does not take, and where the person is afterwards (Q-106). (open: Q-70)

R5. No reading proposes a change to a project's location, whatever the document says.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Upload shapes, and what it does with the file — `work-areas`.
- A spatial file dropped on the project page — story 08.
- A file that is neither a report nor a spatial file — story 10.
- The "Not used" list on the check step — story 19.
- Coordinates listed as a line not used — story 19 (R7).
- The Key facts an import can change — story 15.

## Needs to know from elsewhere

- Upload shapes — owned by `work-areas`. This story hands it one file for one project and needs it to open with that file received. It cannot receive a handed file today, and as prototyped it takes a .zip only, up to 50 MB: four of the six endings in R1 are files it would refuse (Q-106).
- A file over 20 MB is not held by the file control — owned by story 10 (R3).
- The file picker offers only report types, so a spatial file reaches the control when it is dropped onto it — owned by story 10 (R2). What the control does with a dropped file that is neither kind is Q-69.
- The reading — enabler 02, not built. Beside the proposed changes it returns the lines it did not use, each with its reason. This story fixes one thing about the reading: a location is never a proposed change. That stated coordinates are one of the lines not used is story 19 (R7).
- The file control holds one file, and a second replaces the first — owned by story 01 (R5).

## Scenarios

No fixture is a spatial file; S1 to S5 describe one by kind. S6 runs against the recorded funder report reading in `../fixtures.md`. R5 is a rule for the reading (enabler 02): the recording already holds no location change, so against it S6 shows only that the page adds none; the reading itself is proven with enabler 02, on a real document that states coordinates. With story 01 alone the check step lists the reading's performance measure entries; S6 holds for whatever it lists.

**S1 — A spatial file brings up the box** (proves R1, R2)
- Given a Contributor is on the choose step for Deer Creek
- When they drop a .geojson file on the file control
- Then the box "That's a spatial file" shows, with "Shapes are added with Upload shapes on the project." and "Upload shapes" as a link

**S2 — Every spatial type is caught** (proves R1)
- Given the choose step
- When the Contributor drops, in turn, a file ending in .shp, .zip, .kml, .kmz and .gpkg
- Then each one brings up the "That's a spatial file" box

**S3 — "Read it" does nothing** (proves R3)
- Given a .geojson file is held and the box is showing
- When the Contributor presses "Read it"
- Then the choose step stays as it is, with no "Reading…" line and no message

**S4 — A report takes the box away** (proves R2)
- Given a .geojson file is held and the box is showing
- When the Contributor chooses `deer-creek-crew-log-2025.xlsx`
- Then the control holds the crew log and the box is gone

**S5 — The file is handed over** (proves R4)
- Given a .geojson file is held and the box is showing
- When the Contributor follows the "Upload shapes" link
- Then Upload shapes opens for Deer Creek with that .geojson file received

**S6 — A report's coordinates change nothing** (proves R5)
- Given the funder report, whose page 1 states site coordinates, has been sent to be read for Deer Creek
- When the reading comes back
- Then none of the changes listed is a change to the project's location

## UAT script

The script stops before the hand-off (R4), which waits on `work-areas` and Q-70.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). The recorded funder report reading is served for the funder report file.
Test data: `../fixtures.md`: the crew log file; the funder report file. Brought by the tester, because no fixture has one: a .geojson file and a .zip file.
Reset: none needed. The script stops on the check step; leave by the breadcrumb without adding and nothing is kept.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and press "Import report" on the Performance measures card | The Import a report page, with the file control empty |
| 2 | Drop the .geojson file on the file control | A box, "That's a spatial file": "Shapes are added with Upload shapes on the project.", with "Upload shapes" as a link |
| 3 | Press "Read it" | Nothing changes: no "Reading…" line and no message |
| 4 | Drop the .zip file on the file control | The same box |
| 5 | Choose `deer-creek-crew-log-2025.xlsx` in the file control | The control shows the crew log's name, and the box is gone |
| 6 | Choose `deer-creek-completion-report-2025.pdf`, press "Read it" and wait | A list of changes; none of them is about where the project is |

On the prototype: the box's link opens the project page and carries no file. Press "Sample funder report" in place of step 6; see `../fixtures.md`, On the prototype.

## Open questions

- Q-70 — R4, S5 and where the script stops: whether the file is handed over when it is chosen or when the link is followed, and what becomes of it if the link is not followed.
- Q-88 — how the recorded reading is served for step 6.
- Q-106 — would change R1 and R4: which endings are handed over, the size limit that applies to them, what the person sees when Upload shapes refuses the file, and where they are afterwards.
- Q-107 — would change R2: whether the box is hidden with the file control while "Paste text" is chosen.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | RUL-8; STA-5, RUL-98 |
| R2 | decided | STA-5; RUL-99 |
| R3 | shown | STA-5 |
| R4 | decided, not built | RUL-64; RUL-100 |
| R5 | decided | RUL-8 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the information box, how a spatial file is told, "Read it" with a spatial file held).
- Data shapes, as the prototype models them: a spatial file is told by the end of its name alone, so every .zip counts as one whatever it holds.
- What the prototype does where nothing is decided (not requirements): the box sits outside the file control's panel, so it stays in view when the person switches to "Paste text" (Q-107); a spatial file over 20 MB gets the size message and no box (Q-106); Upload shapes is a dialog on the project page whose own file control takes .zip up to 50 MB (`src/components/projects/firma2-work-area-upload.astro`).
- Do not copy: the box's link going to the project page with no file carried. That is the hand-off not built, not the requirement.

</details>
