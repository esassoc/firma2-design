# 11 — A Contributor who chooses a spatial file has it handed to Upload shapes

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-70, Q-106, Q-107
Revision: 1
Blocked by: 01, 09
Covers: STA-5, RUL-8, RUL-64, RUL-98, RUL-99, RUL-100, RUL-290, RUL-291, RUL-292
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #11; interview 2026-11-23, Q-26
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R3, and the link of R4 that opens Upload shapes empty. Against the recorded not-used sample in `../fixtures.md`, which stands in for enabler 02 (not built): R5. Waiting: the hand-off of a .zip in R4 on `work-areas`, whose Upload shapes cannot yet open with a file received. S8 uses story 09's "Paste text"; story 09 is in `Blocked by` for that reason. Nothing waits on a question.

## Story

As a Contributor, I want a spatial file I chose by mistake to be passed to Upload shapes, so that the project's location changes only from a spatial file and I do not have to choose the file a second time.

## Description

On the choose step that story 01 builds, a person may give a file of shapes where a report belongs. Import a report does not read it: it says so and points to Upload shapes, which `work-areas` owns. Upload shapes' own list decides what is handed over; today that is a .zip, so a .zip goes with the person and any other spatial file is explained and left for them to zip. The same rule binds the reading: a report never changes a project's location, even when it states coordinates. The box is at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report` when a spatial file is dropped on the file control; the hand-off is decided and not in the prototype.

## Requirements

R1. A file whose name ends in .shp, .zip, .geojson, .kml, .kmz or .gpkg, in capitals or not, is a spatial file. The ending alone decides, and it is decided before the file's size, so the 20 MB limit for reports (story 10, R3) never applies to one. Given to the file control, a spatial file is never read.
- A .zip is held, up to 50 MB, which is Upload shapes' limit. A .zip over 50 MB is not held, and under the control the person reads "`<file name>` is over the 50 MB limit of Upload shapes."
- A .shp, .geojson, .kml, .kmz or .gpkg is never held: Upload shapes would refuse it.

R2. A spatial file given to the control brings up an information box on the choose step. Its wording depends on the file:
- a .zip: titled "A .zip isn't read here", with "If it holds shapes, add them with Upload shapes. If it holds a report, unzip it and choose the report itself." The box does not call a .zip a spatial file.
- a spatial file Upload shapes does not take (the other five endings): titled "That's a spatial file", with "Shapes are added with Upload shapes, which takes a zipped shapefile (its .shp, .shx, .dbf and .prj together) or a zipped .gdb folder."
- a spatial file Upload shapes takes that is not a .zip: titled "That's a spatial file", with "Shapes are added with Upload shapes on the project." No ending reaches this wording today; an ending `work-areas` later takes moves here, and is held and handed over as a .zip is.
In all three, "Upload shapes" is a link. The box shows until the control next takes a file or the page is left. It is hidden with the file control while "Paste text" is chosen, and comes back, with the held file, when the person returns to "File".

R3. Pressing "Read it" while a .zip is held does nothing: no wait starts and no message is shown; the box is the message. After one of the other five endings the control holds no file, so "Read it" is as story 10 (R1) says. While "Paste text" is chosen, "Read it" reads the pasted text (story 09, R4).

R4. A held .zip is handed to Upload shapes for the same project when the person follows the box's "Upload shapes" link, not when it is chosen, so the person does not choose the file again.
- If the link is not followed, the file is let go when another file is chosen or the page is left. Nothing is uploaded or stored.
- For a spatial file that is not held, the link opens Upload shapes for the same project with no file.
- A .zip that Upload shapes refuses is refused there, in Upload shapes' own words, as if the person had chosen it there.
- After Upload shapes, finished or cancelled, the person is on the project page. They are not returned to Import a report.
- Nothing is read and nothing reaches the record from Import a report.

R5. No reading proposes a change to a project's location, whatever the document says.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Upload shapes, what it does with the file, and its own refusal message — `work-areas`.
- A spatial file dropped on the project page, which is not handed over — story 08 (R5).
- A file that is neither a report nor a spatial file — story 10.
- The "Not used" list on the check step, and coordinates listed there as a line not used — story 19.
- The Key facts an import can change — story 15.

## Needs to know from elsewhere

- Upload shapes — owned by `work-areas`. This story hands it one .zip for one project and needs it to open with that file received; it cannot receive a handed file today. It takes a .zip (a zipped shapefile or a zipped .gdb folder) up to 50 MB. Its list and limit decide R1 and R2: Import a report keeps no second list.
- The file picker offers only report types, so a spatial file reaches the control when it is dropped onto it — owned by story 10 (R2).
- One message at a time shows under the file control, and it goes when the control's content changes — owned by story 10 (R5). The over-50 MB message of R1 is one of those messages.
- The reading — enabler 02, not built. Beside the proposed changes it returns the lines it did not use, each with its reason. This story fixes one thing about the reading: a location is never a proposed change.
- The file control holds one file, and a second replaces the first — owned by story 01 (R5).

## Scenarios

No sample is a spatial file; S1 to S11 describe one by kind and size. S12 runs against the recorded not-used sample in `../fixtures.md` (to be made), whose report states site coordinates. R5 is a rule for the reading (enabler 02): the recording holds no location change, so against it S12 shows only that the page adds none; the reading itself is proven with enabler 02, on a real document that states coordinates.

**S1 — A .zip brings up its box** (proves R1, R2)
- Given a Contributor is on the choose step for Deer Creek
- When they drop a .zip file of 3 MB on the file control
- Then the control lists the .zip, and a box titled "A .zip isn't read here" shows, with "Upload shapes" as a link

**S2 — A spatial file Upload shapes does not take** (proves R1, R2)
- Given the choose step, and the file control holds no file
- When the Contributor drops a .geojson file on the control
- Then the control holds no file, and a box titled "That's a spatial file" says that Upload shapes takes a zipped shapefile or a zipped .gdb folder, with "Upload shapes" as a link

**S3 — Every other spatial ending is caught** (proves R1)
- Given the choose step
- When the Contributor drops, in turn, a file ending in .shp, .kml, .kmz and .gpkg
- Then each one brings up the "That's a spatial file" box and none is held

**S4 — The report limit does not apply to a .zip** (proves R1)
- Given the choose step
- When the Contributor drops a .zip file of 30 MB on the control
- Then the control lists the .zip and the box shows, with no size message

**S5 — A .zip over Upload shapes' limit** (proves R1)
- Given the choose step, and the file control holds no file
- When the Contributor drops a .zip file of 60 MB named `parcels.zip` on the control
- Then the control holds no file and "parcels.zip is over the 50 MB limit of Upload shapes." shows under it

**S6 — "Read it" does nothing** (proves R3)
- Given a .zip file is held and the box is showing
- When the Contributor presses "Read it"
- Then the choose step stays as it is, with no "Reading…" line and no message

**S7 — A report takes the box away** (proves R2, R4)
- Given a .zip file is held and the box is showing
- When the Contributor chooses `deer-creek-crew-log-2025.xlsx`
- Then the control lists the crew log alone and the box is gone

**S8 — The box is hidden under "Paste text"** (proves R2)
- Given a .zip file is held and the box is showing
- When the Contributor chooses "Paste text", and then "File" again
- Then the box is hidden with the file control, and both are back with the .zip still held

**S9 — The .zip is handed over** (proves R4)
- Given a .zip file is held and the box is showing
- When the Contributor follows the "Upload shapes" link
- Then Upload shapes opens for Deer Creek with that .zip received

**S10 — A file that is not handed over** (proves R4)
- Given the "That's a spatial file" box is showing after a .geojson was dropped
- When the Contributor follows the "Upload shapes" link
- Then Upload shapes opens for Deer Creek with no file

**S11 — Afterwards the person is on the project page** (proves R4)
- Given Upload shapes was opened for Deer Creek from the box, with a .zip received
- When the Contributor cancels Upload shapes
- Then they are on the Deer Creek project page, not on Import a report

**S12 — A report's coordinates change nothing** (proves R5)
- Given `deer-creek-not-used-2025.pdf`, which states site coordinates, has been sent to be read for Deer Creek
- When the reading comes back
- Then one change is listed, row F3, and it is not a change to the project's location

## UAT script

Steps 8 and 9 hand a file to Upload shapes, which waits on `work-areas`; until Upload shapes can open with a file received, stop after step 7.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Reading by an outside AI service is on for the workspace. The test environment serves the recorded sample `deer-creek-not-used-2025.pdf` (to be made).
Test data: `../fixtures.md`: the crew log file; the not-used sample, row F3. Brought by the tester, because no sample has them: a .geojson file, and a small .zip that holds a shapefile.
Reset: none needed for steps 1 to 7, which add nothing to the record. After steps 8 and 9, reset the sample project in the test environment if shapes were uploaded.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and press "Import a report" on the Performance measures card | The Import a report page, with the file control empty |
| 2 | Drop the .geojson file on the file control | A box, "That's a spatial file", saying Upload shapes takes a zipped shapefile or a zipped .gdb folder, with "Upload shapes" as a link; the control shows no file |
| 3 | Drop the .zip file on the file control | The control lists the .zip; the box now reads "A .zip isn't read here" |
| 4 | Press "Read it" | Nothing changes: no "Reading…" line and no message |
| 5 | Choose `deer-creek-crew-log-2025.xlsx` in the file control | The control lists the crew log alone, and the box is gone |
| 6 | Choose `deer-creek-not-used-2025.pdf`, press "Read it" and wait | One change, "Acres of invasive vegetation removed · 2025"; nothing listed is about where the project is |
| 7 | Leave by the breadcrumb without adding | The project page, unchanged |
| 8 | Open Import a report again, drop the .zip on the file control and follow "Upload shapes" in the box | Upload shapes for Deer Creek, with the .zip already in it |
| 9 | Cancel Upload shapes | The Deer Creek project page |

## Open questions

None open. The story rests on these proposed answers:

- Q-106 (proposed) — only what Upload shapes takes (a .zip, up to 50 MB) is held and handed over; the box's three wordings; a refusal is Upload shapes' own; the person ends on the project page (R1, R2, R4, S1 to S5, S9 to S11). It narrows the interview answer "spatial hand-off is first release" (Q-26) to the kinds Upload shapes takes, and amends spec #11.
- Q-70 (proposed) — the file is handed over when the link is followed, and let go otherwise (R4, S7, S9).
- Q-107 (proposed) — the box is hidden with the file control under "Paste text" (R2, S8).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown; proposed (Q-106) | RUL-8; STA-5, RUL-98; RUL-290 |
| R2 | decided; proposed (Q-106); proposed (Q-107) | STA-5, RUL-99; RUL-290; RUL-291 |
| R3 | shown; proposed (Q-106) | STA-5; RUL-290 |
| R4 | decided, not built; proposed (Q-70); proposed (Q-106) | RUL-64, RUL-100; RUL-292; RUL-290 |
| R5 | decided | RUL-8 |
- Wording provisional: the .zip box's title and text; the text of the "That's a spatial file" box for a file that is not handed over; "`<file name>` is over the 50 MB limit of Upload shapes." The title "That's a spatial file" and "Shapes are added with Upload shapes on the project." are the prototype's.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the information box, how a spatial file is told, "Read it" with a spatial file held); `src/components/projects/firma2-work-area-upload.astro` (Upload shapes: a dialog on the project page whose own file control takes .zip up to 50 MB).
- Data shapes, as the prototype models them: a spatial file is told by the end of its name alone, so every .zip counts as one whatever it holds.
- Where the prototype differs from the requirements above: all six endings are held and get one wording of the box; a spatial file over 20 MB gets the report size message and no box; the box sits outside the file control's panel, so it stays in view on "Paste text"; the box's link goes to the project page and carries no file.
- Do not copy: the box's link going to the project page with no file carried. That is the hand-off not built, not the requirement.

</details>
