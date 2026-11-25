# Coverage — Import a report (project-updates, build 1)

Checked: 2026-11-23
Stories: 42 · Open questions they cite: 131

## How this was verified

By `scripts/coverage.py`, which parses the inventory, the story map, the epics and every story. An item counts as covered only when a story lists it under `Covers` and that story's Trace table gives it to a requirement; a `relies on` citation does not count. An item with no covering requirement must be excluded by the map (standing requirements, dependencies on other features, out of scope) or struck in the inventory. A spec decision is covered through the inventory items that name it as their source.

Not checked by script: whether a requirement states its inventory item correctly, glossary use, and whether a scenario's Given truly needs only the story's blockers. Those are for the cold read and the reviewer.

## Result

| Kind | Items | Covered by a requirement | Excluded with a reason | Unmapped |
|---|---|---|---|---|
| Screens (SCR) | 6 | 6 | 0 | 0 |
| States (STA) | 40 | 36 | 4 | 0 |
| Actions (ACN) | 22 | 18 | 4 | 0 |
| Rules (RUL) | 454 | 436 | 18 | 0 |
| Objects (OBJ) | 6 | 6 | 0 | 0 |
| Actors (ACT) | 4 | 0 | 4 | 0 |
| Spec decisions | 42 | 23 | 19 | 0 |

Screens, states, actions and rules together: 496 covered, 26 excluded, 0 unmapped, of 522.

## Screens

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| SCR-1 | Import a report page: Projects › *Project* › Import a report, with its acts in the pinned top bar | 01 R2 |  |
| SCR-2 | Source document pane: the document the changes were read from, beside those changes | 04 R1 |  |
| SCR-3 | Project page, as an import leaves it: a toast with Undo, the imported values in Key facts, Performance measures, … | 01 R11 |  |
| SCR-4 | Change history sheet on the project page, with one row per import | 22 R3 |  |
| SCR-5 | The project's review (the diff of unpublished changes), with imported rows, the import's note and the document beside … | 24 R1 |  |
| SCR-6 | Section "Reading by an outside AI service" on the Security page of workspace settings (not yet prototyped). The setting … | 82 R2 |  |

## States

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| STA-1 | Choose a document, File | 01 R4 |  |
| STA-2 | Choose a document, Paste text | 09 R1, R4 |  |
| STA-3 | Read pressed with no file | 10 R1 |  |
| STA-4 | Read pressed with no pasted text | 09 R3 |  |
| STA-5 | A spatial file is chosen | 11 R1, R2, R3 |  |
| STA-6 | Reading | 01 R6 |  |
| STA-7 | The reading failed | 10 R4, R5 |  |
| STA-8 | Check, wide (wider than 64rem) | 04 R1, R2, R3 |  |
| STA-9 | Check, narrow (64rem or narrower; corrected 2026-11-23, builder's checklist) | 05 R1, R2, R4 |  |
| STA-10 | A change ready to add | 01 R8 |  |
| STA-11 | A change already on file | 32 R3, R4 |  |
| STA-12 | A change that needs a decision (the report supports two readings) | 14 R4, R5 |  |
| STA-13 | A change with no match (the report counts a different quantity) | 14 R3, R5 | part excluded: dropped in interview (Q-25) |
| STA-14 | A change the reading was unsure of | 14 R2, R5 |  |
| STA-15 | A funding source whose organization the workspace does not hold | 75 R2 |  |
| STA-16 | A Key facts field a data source keeps | 16 R1, R2, R6 |  |
| STA-17 | (struck) | | struck in the inventory: interview 2026-11-23, Q-25: no confidence levels |
| STA-18 | A figure the report states as a total to date | 13 R1, R3, R4, R5 |  |
| STA-19 | The report names another project | 20 R1, R3 |  |
| STA-20 | Nothing ticked | 06 R5 |  |
| STA-21 | Add pressed with an invalid change | 30 R5 |  |
| STA-22 | A change is selected | 04 R6 |  |
| STA-23 | A document with passages (a sample or pasted text) | 04 R11 |  |
| STA-24 | A PDF file | 31 R1 |  |
| STA-25 | A file that cannot be shown (a spreadsheet, a Word file, or a file no longer held) | 04 R10 |  |
| STA-26 | Just imported | 01 R12 |  |
| STA-27 | Import undone | 23 R3 |  |
| STA-28 | A contact an import added | 18 R4 |  |
| STA-29 | A funding source an import added | 17 R9, R10, R11 |  |
| STA-30 | Imported changes waiting for a publish | | out of scope: owned elsewhere: `publish-review` (system map, shared surfaces and shared rules). Listed as dependencies above |
| STA-31 | An import in the history | 22 R4, R6 |  |
| STA-32 | An imported change in the review | 24 R1, R2, R3, R4 |  |
| STA-33 | An import over a hand edit of the same field | | out of scope: owned elsewhere: `publish-review` (system map, shared surfaces and shared rules). Listed as dependencies above |
| STA-34 | An import that left a note | 21 R5, R6, R7, R8, R9, R11 |  |
| STA-35 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: The document open beside the … |
| STA-36 | A file over the size limit is chosen or dropped in the file control | 10 R3 |  |
| STA-37 | A Key facts change that replaces a value | 15 R2, R5 |  |
| STA-38 | The setting's section, by state: off, on, unavailable | 82 R4 |  |
| STA-39 | Import a report not offered: the project page | 83 R1 |  |
| STA-40 | Import a report not offered: the page's address | 83 R4 |  |

## Actions

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| ACN-1 | "Import report" button on the Performance measures card | 01 R1 |  |
| ACN-2 | "Import a report" action in the project page's header (an icon with a tooltip; inside the bar's "…" menu under 45rem). | 08 R1, R2 |  |
| ACN-3 | Drop a readable file anywhere on the project page | 08 R3 |  |
| ACN-4 | File / Paste text toggle | 09 R1, R2 |  |
| ACN-5 | Choose or drop one file in the file control | 01 R5 |  |
| ACN-6 | "Read it" (primary, top bar) | 01 R6 |  |
| ACN-7 | "Cancel" (top bar, a link) | 35 R1, R2, R3 |  |
| ACN-8 | "Read another" (top bar, check step) | 35 R4 |  |
| ACN-9 | Click or focus a change | 04 R7 |  |
| ACN-10 | "Show source" on a change (narrow screens) | 05 R2, R3, R5, R6 |  |
| ACN-11 | Tick or untick a change's checkbox | 06 R1, R2, R3 |  |
| ACN-12 | Edit a measure change: Amount (*unit*), Reporting period, and one select per breakdown question | 07 R1, R2 |  |
| ACN-13 | Type a figure above zero into a change that arrived empty | 14 R6 |  |
| ACN-14 | (struck) | | struck in the inventory: interview 2026-11-23, Q-25: "Use suggestion" dropped |
| ACN-15 | Edit a funding source change: Grant or program, Organization (the workspace's organizations), Secured ($) | 17 R1, R2 |  |
| ACN-16 | "Note for the reviewer (optional)" text area | 21 R1, R3 |  |
| ACN-17 | "Add N changes" (primary, top bar; "Add 1 change") | 01 R10 |  |
| ACN-18 | "Undo" on the toast | 23 R1, R2 |  |
| ACN-19 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: "From *document name*" button on an imported … |
| ACN-20 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: Close document (icon button), "Back" (narrow) or … |
| ACN-21 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: "From *document name*" button on a row that folds two imports of one … |
| ACN-22 | Pick an organization on a funding source change | 75 R3 |  |

## Rules

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| RUL-1 | Changes added by an import save to the record at once. Nothing here is a request for approval. | 01 R11 |  |
| RUL-2 | Imported values are not public until a publish; until then they count as unpublished changes on the project. | | out of scope: owned elsewhere: `publish-review` (system map, shared surfaces and shared rules). Listed as dependencies above |
| RUL-3 | Every imported change carries its document as its source, and shows it wherever the change is shown: the review row, … | 22 R7 |  |
| RUL-4 | The interface never uses "project update" as a noun. | | standing requirement: SR-1, SR-4, SR-6, SR-8, SR-9, SR-10, SR-11 (`standing-requirements.md`) |
| RUL-5 | Import a report is a page of its own; there is no side-sheet version. | 01 R2 |  |
| RUL-6 | An import proposes four kinds of change only: performance measure entries, Key facts (the Timeline and named attributes … | 15 R1, R2, R4, R6 |  |
| RUL-7 | Spend is never proposed. A budget or expenditure table is named once under "Skipped" with the reason ("spend is … | 19 R3, R4 |  |
| RUL-8 | A location is never proposed from a report. A spatial file (.shp, .zip, .geojson, .kml, .kmz, .gpkg) is not read; it is … | 11 R1, R5 |  |
| RUL-9 | Proposed changes are grouped by the project page's sections, in that page's order: Key facts, Performance measures, … | 04 R3 |  |
| RUL-10 | A change arrives ticked only when the record does not already hold it, no data source keeps its field, and it is not … | 06 R4 |  |
| RUL-11 | When the reading is unsure of a figure (a missing unit, for one), nothing is written in: the amount is empty, the … | 14 R2, R7 |  |
| RUL-12 | When the report supports two readings, one is written in, the other is stated in a note, and the change arrives … | 14 R4 |  |
| RUL-13 | When the report counts a different quantity than the measure asks for, nothing is written in. The person fills the … | 14 R3, R7 | part excluded: dropped in interview (Q-25) |
| RUL-14 | A figure stated as a total to date is filed as the difference from what the record already holds for that measure, with … | 13 R1, R2, R4, R5 |  |
| RUL-15 | Whether the record already holds a change is worked out from the record, never taken from the reading. A measure entry … | 32 R1, R2, R5 |  |
| RUL-16 | A contact is added as a name, role, organization and email only. No invitation is sent and no account is created. When … | 18 R1, R2, R3 |  |
| RUL-17 | An organization is never created by an import. A funding source naming one the workspace does not hold is flagged; it … | 75 R1, R2, R4 |  |
| RUL-18 | A Key facts field kept by a data source is shown as kept, names the source, and cannot be ticked or added. | 16 R1, R3, R7 |  |
| RUL-19 | One optional note per import, for whoever reviews it. There is no note per change. | 21 R1, R2 |  |
| RUL-20 | The commit button states the count ("Add 9 changes"). It is disabled only when nothing is ticked, and then reads … | 01 R10 |  |
| RUL-21 | Every ticked change is checked before anything is written. A measure amount must be above zero ("Enter a figure above … | 30 R1, R2, R4, R5, R6 |  |
| RUL-22 | Undo takes back everything that one import added, of every kind, and nothing else. Beyond its measure entries (RUL-83, … | 41 R1, R2, R3 |  |
| RUL-23 | The toast that offers Undo has no timer; it stays until dismissed. It is shown once: reloading the project page does … | 23 R4, R5 |  |
| RUL-24 | The document is kept as the source of the import's changes and can be opened from the review at each change's passage. … | 24 R5 |  |
| RUL-25 | The document is visible only to people who can edit or publish that project. It is never public. Answers written in … | 22 R7 |  |
| RUL-26 | One document per import. | 01 R5 |  |
| RUL-27 | When the report names a different project, the page warns and names it; the changes are still shown. With the local … | 20 R1, R2, R3 |  |
| RUL-28 | Import a report is available to anyone who can edit the project, on every plan. | 12 R1, R2 |  |
| RUL-29 | Typed or pasted text, once its import is added, is kept as the document (one page, one passage per paragraph) and named … | 40 R1, R2, R3 |  |
| RUL-30 | Speech input is not offered. | 09 R5 |  |
| RUL-31 | The file control takes one file of type .pdf, .docx, .xlsx, .xls or .csv, up to 20 MB. | 10 R2, R3 |  |
| RUL-32 | A file dropped on the project page starts an import only when it is readable by name (.pdf, .doc, .docx, .xls, .xlsx, … | 08 R4, R5, R6, R7 |  |
| RUL-33 | The model reads and maps; code does the arithmetic (unit conversion, adding lines); the page checks against the record; … | 02 R1, R2, R3, R4 |  |
| RUL-34 | Guards on units, applied in code to what the model returns: two known units of different kinds (a length and an area) … | 26 R3, R7, R8 |  |
| RUL-35 | Unit conversion covers lengths (feet, miles, meters, kilometers, yards) and areas (acres, hectares, square feet, square … | 26 R1, R2, R4, R5, R6 |  |
| RUL-36 | Every change shows the words it was read from, verbatim, with where in the document they are; any arithmetic is shown … | 04 R5 |  |
| RUL-37 | (struck) | | struck in the inventory: interview 2026-11-23, Q-25: no confidence levels |
| RUL-38 | What the person can edit before adding: a measure change's amount, reporting period and breakdown answers; a funding … | 07 R6 |  |
| RUL-39 | An added change records whether the person changed the figure from the document's (a measure amount; a funding source's … | 36 R1, R2, R3, R4, R5, R6 |  |
| RUL-40 | A measure entry can be filed only in one of the project's closed reporting periods, offered newest first. | 07 R3 |  |
| RUL-41 | A measure change offers the measure's live breakdown questions, each with its options; the reading pre-answers one only … | 07 R4, R5 |  |
| RUL-42 | What the document reports that the import does not use is listed under "Not used", not dropped: quantities no measure … | 19 R1, R2, R5, R6 |  |
| RUL-43 | When two imports set the same field, the later one's value stands. Answers written in (2026-11-23): The last save … | 15 R7 |  |
| RUL-44 | In the review, an import that set a field a hand edit had already changed since the last publish is one row, not two; … | | out of scope: owned elsewhere: `publish-review` (system map, shared surfaces and shared rules). Listed as dependencies above |
| RUL-45 | In the review, the import's note sits above the changes, once per import that left one and still has a change waiting, … | 21 R5, R6, R7, R8, R9, R10 |  |
| RUL-46 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: In the review, an imported change's source is a button naming the document; it opens the … |
| RUL-47 | A publish includes the imported changes in front of the manager with the rest. | | out of scope: owned elsewhere: `publish-review` (system map, shared surfaces and shared rules). Listed as dependencies above |
| RUL-48 | A funding source an import added shows its amount and no share of the estimated total cost. While any such row exists, … | 17 R10, R11, R12, R13 |  |
| RUL-49 | A contact an import added whose email is already in the project's Contacts is not shown twice. A contact with no role … | 18 R5, R6 |  |
| RUL-50 | The change history has one row per import, not one per change: how many changes, from which document, who and when. | 22 R3 |  |
| RUL-51 | Selecting a change moves the document, never the page: the change being checked stays where the reader left it. … | 04 R8 |  |
| RUL-52 | A problem with the chosen file is written under the control and announced once, assertively. Corrected 2026-11-23 … | 10 R5 |  |
| RUL-53 | Leaving the page before Add (Cancel, Read another) needs no warning, because nothing has been written. | 35 R2, R4, R5 |  |
| RUL-54 | The commit stays in the pinned top bar so it is in reach however long the list of changes runs. One primary button at a … | 01 R9 |  |
| RUL-55 | An import is recorded with the person who added it and the day. | 22 R5 |  |
| RUL-56 | The proposals are ordered inside each section with the ready ones first, then those needing a decision, then those with … | 04 R4 |  |
| RUL-57 | A person who cannot edit the project sees none of the three entry points and cannot open the page. Answers written in … | 12 R5, R6 |  |
| RUL-58 | Partner organizations are not proposed in the first release. Proposing them is `later`. Until then a named party that … | 27 R1 |  |
| RUL-59 | The workspace permission "Import data" governs bulk project import. It does not govern Import a report. | 12 R4 |  |
| RUL-60 | In the first release the person waits on the page while the document is read. A reading is not stored: leaving the page … | 01 R7 |  |
| RUL-61 | `later`: a reading is a stored thing with its own states (reading, ready, failed), so the person can leave and come … | 28 R1, R2 |  |
| RUL-62 | Undo is offered on the toast only. Once the toast is gone an import cannot be taken back as a whole; its changes are … | 23 R6 |  |
| RUL-63 | As read, a change is either ready or flagged for the person to fill. No confidence level is shown, and no suggested … | 14 R1 |  |
| RUL-64 | A spatial file chosen on the Import a report page is handed to Upload shapes, with a link. First release. Not built: … | 11 R4 |  |
| RUL-65 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: `later`: the document can be opened from its import's row in the change history. In the … |
| RUL-66 | An import can propose a value for a built-in Key facts field or one of the workspace's custom fields, when the report … | 15 R3, R4 |  |
| RUL-67 | Import a report is offered on any project the person can edit, whatever its stage, including a proposal, a completed … | 12 R3 |  |
| RUL-68 | Setting up a data source from the Import a report layout (spec #26) is not part of build 1. | | out of scope: dropped from build 1 in interview (Q-29) |
| RUL-69 | Only a field supplied by an authoritative source is shown as kept and cannot be added. A field supplied by a GIS … | 16 R1, R4, R5, R7 |  |
| RUL-70 | What passes between the page and the reading, as the developer-machine reader has it. Sent: the document (a file with … | 02 R5, R6, R7 |  |
| RUL-71 | The write rule for a performance measure entry on Add (ACN-17). Each added measure change is saved as a new entry of … | 01 R11 |  |
| RUL-72 | What Add does in order, and what it leaves undefended. Every ticked change is checked first (RUL-21). Then each measure … | 01 R10 |  |
| RUL-73 | How the page waits for a reading, and what leaving is. The page sends one request and waits for one answer: there is no … | 01 R6, R7 |  |
| RUL-74 | The toast after Add (STA-26), in detail. It counts the changes the import added: "1 change added from *document name*" … | 01 R12, R13 |  |
| RUL-75 | How a performance measure change is labelled and valued. The label is "*Measure* · *reporting period*", where the … | 01 R8 |  |
| RUL-76 | What an import's record holds (OBJ-1), field by field. An identifier unique within the project; the project; the day it … | 22 R1, R2 |  |
| RUL-77 | Which of this feature's labels name a renameable noun (standing requirement SR-4). The prototype marks two: "Projects" … | 01 R3 |  |
| RUL-78 | Guards applied in code to what the model returns, other than those on units (split from RUL-34, 2026-11-23): a measure … | 50 R1, R2, R3 |  |
| RUL-79 | A Key facts change is already on file when the value read is the field's value on the record. Worked out from the … | 15 R8 |  |
| RUL-80 | A funding source is already on file when its name and its organization match a funding source on the record, case … | 17 R7 |  |
| RUL-81 | A contact is already on file when its email matches a contact on the record. Worked out from the record when the check … | 18 R7 |  |
| RUL-82 | Typed or pasted text is a source like a file: "Read it" on "Paste text" reads the text as the document, whatever the … | 09 R4 |  |
| RUL-83 | Undo takes back the measure entries that one import added, and the import is then no longer recorded; entries recorded … | 23 R2 |  |
| RUL-84 | The wait is announced to assistive technology as "Reading *name*" (no ellipsis), politely, once. The page sets no time … | 01 R6 |  |
| RUL-85 | Two changes of one reading for the same performance measure and reporting period are saved as two entries; nothing on … | 01 R11 |  |
| RUL-86 | Each entry an import saves also writes a row to the performance measures' own change log (measure, reporting period, no … | 01 R11 |  |
| RUL-87 | The file control lists the held file with its name and size and a "Remove *name*" button; removing it leaves the … | 01 R5 |  |
| RUL-88 | "Add N changes" with no change to add records no import | 22 R1 |  |
| RUL-89 | A second import from a file of the same name is a separate import with its own identifier; nothing is merged by … | 22 R1 |  |
| RUL-90 | The imported change's value is "*amount* *unit*", the amount written with thousands separators and at most two decimals … | 22 R2 |  |
| RUL-91 | The toast is shown only when the import named on the return exists; its count is the number of changes the import … | 01 R12 |  |
| RUL-92 | A file dropped on the project page is readable by the ending of its name, capitals ignored. While the file is dragged … | 08 R4, R7 |  |
| RUL-93 | A drop the project page does not take is not stopped, so the browser does what it does with a dropped file (usually … | 08 R5 |  |
| RUL-94 | A file that arrives from a drop on the project page is held by the Import a report page and read, but is never put into … | 08 R3 |  |
| RUL-95 | A failure that carries no reason shows "Couldn't read *name*." alone | 10 R4 |  |
| RUL-96 | The size message in detail. A too-large file leaves a file the control already held in place and fires no change, so … | 10 R3, R5 |  |
| RUL-97 | A failed reading of pasted text writes "Couldn't read your report. *reason*" into the line inside the file control's … | 10 R4 |  |
| RUL-98 | A spatial file is told by the ending of its name, capitals ignored Answers written in (2026-11-23): Narrowed: spatial … | 11 R1 |  |
| RUL-99 | The "That's a spatial file" box sits outside the File and Paste text panels, so it stays in view after a switch to … | 11 R2 |  |
| RUL-100 | Upload shapes, as prototyped by `work-areas`, is a dialog on the project page whose file control takes .zip only, up to … | 11 R4 |  |
| RUL-101 | The File / Paste text choice is named "Report source" for assistive technology and is set to File whenever the page … | 09 R1 |  |
| RUL-102 | "Paste the report text first." is the text area's own error: shown, not announced (the lego's live error is off), … | 09 R2, R3 |  |
| RUL-103 | Pasted text is sent whole, as typed (only the emptiness test trims); its wait is announced as "Reading your report" | 09 R4 |  |
| RUL-104 | The tally has four parts in a fixed order, joined by " · ": "ready to add" counts the ticked changes that are not kept … | 04 R2 |  |
| RUL-105 | The check step does not sort: each section shows its changes in the order the reading returned them, and nothing the … | 04 R4 |  |
| RUL-106 | The first change in the list is selected on opening, whatever its state; a click anywhere on a change (a control … | 04 R6, R7 |  |
| RUL-107 | The document pane is named "Source document" to assistive technology, and its content takes keyboard focus so it can be … | 04 R1 |  |
| RUL-108 | "Show source" selects its change, hides the whole changes column (tally, changes, "Not used", "Skipped", the note) and … | 05 R2, R3, R4 |  |
| RUL-109 | "Back" puts the selected change in the middle of the window | 05 R5 |  |
| RUL-110 | Widening past 64rem while the document shows gives both columns; the open state is kept, so narrowing again shows the … | 05 R7 |  |
| RUL-111 | A change's checkbox is labelled with the change's label | 06 R1 |  |
| RUL-112 | An unticked change stays in its place, set back, with its fields still editable. Every unticked change is drawn set … | 06 R6 |  |
| RUL-113 | What arrives ticked is worked out once, when the check step opens Answers written in (2026-11-23): Restated with RUL-10 … | 06 R4 |  |
| RUL-114 | A flagged change the record already holds counts as already on file: it is never counted under "need you" Answers … | 06 R4 |  |
| RUL-115 | On "Add N changes" a typed figure is read with commas, spaces and "$" removed | 07 R2 |  |
| RUL-116 | "Reporting period" lists the closed periods by name, holds the reading's period, and has no empty choice | 07 R3 |  |
| RUL-117 | Breakdown choices are the measure's questions that are not retired, each with its options that are not retired; an … | 07 R2, R4 |  |
| RUL-118 | An edit changes nothing but its field: no tick, no move, no badge; an edit to an unticked change is kept | 07 R7 |  |
| RUL-119 | A failed check leaves ticks, edits, the selection and the note as they were (it returns before anything is written) | 30 R4 |  |
| RUL-120 | Changes are checked in list order; the "first failing" change is the one nearest the top Answers written in … | 30 R5 |  |
| RUL-121 | Messages are cleared only on changes that are ticked at the press, so a failing change the person then unticks keeps … | 30 R6 |  |
| RUL-122 | The check on a ticked funding source (split from RUL-21, 2026-11-23). It needs a name ("Name the grant or program."; … | 65 R1, R2 |  |
| RUL-123 | A "Not in this workspace" change ticked by hand with no organization stops "Add N changes" with "Pick an organization." … | 65 R4 |  |
| RUL-124 | "Changed from the document's figure" on a performance measure change is recorded only when the change arrived with an … | 36 R1 |  |
| RUL-125 | "Changed" on a funding source: the amount differs as a number, or the name, trimmed, differs letter for letter Answers … | 36 R2 |  |
| RUL-126 | "Filled in" is set by a figure above zero typed into a change that arrived empty and is unticked, or by an organization … | 36 R5 |  |
| RUL-127 | The document pane shows passages when the document has them, else the PDF when the file is one (by type, or a name … | 04 R9 |  |
| RUL-128 | The whole passage is marked and brought to the top of the pane; the earlier mark is removed; selecting the same change … | 04 R11 |  |
| RUL-129 | A PDF moves only when the change carries a page and it differs from the page shown Answers written in (2026-11-23): … | 31 R1 |  |
| RUL-130 | A figure with no date in the document is filed under the latest period the reading was given, and the change's note … | 02 R1 |  |
| RUL-131 | The model returns the number and unit as written, and the lines to add; code sums them | 02 R2 |  |
| RUL-132 | The quote is "*where* — “*words*”", the first letter of where in capitals | 02 R6 |  |
| RUL-133 | A reading with no proposed change is returned as a reading, not a failure | 02 R8 |  |
| RUL-134 | Files the reader reads: .pdf (whole), .xlsx (each row as "Row n" and its cells by column letter), .docx (paragraphs), … | 02 R5 |  |
| RUL-135 | A total to date's difference is rounded to two decimals; the change is filed under the reporting period the reading … | 13 R1 |  |
| RUL-136 | The arithmetic line's three figures use thousands separators and at most two decimals; the line sits under the quote … | 13 R3 |  |
| RUL-137 | A change the reading is unsure of is resolved before any subtraction, so an unsure total to date shows no difference … | 13 R6 |  |
| RUL-138 | A figure that counts another quantity is never passed on as a total to date; one the report supports two readings of … | 13 R6 |  |
| RUL-139 | The difference and its line are worked out once, when the check step is drawn; nothing reworks them on an edit or on … | 13 R7 |  |
| RUL-140 | For "Already on file" the amount is compared as a number, exactly; every breakdown answer must be the same; one … | 32 R2 |  |
| RUL-141 | The "Already on file" badge is drawn once and stays when the change is ticked or edited Answers written in … | 32 R4 |  |
| RUL-142 | A "Needs a decision" change is not ticked by editing its figure: the self-tick applies only to a change whose amount … | 14 R4, R6 |  |
| RUL-143 | The self-tick reads the figure with commas ignored; zero, a negative figure and text tick nothing Answers written in … | 14 R6 |  |
| RUL-144 | (struck) | | struck in the inventory: superseded by the proposal on Q-33 and Q-78, awaiting validation: no reading is written into the amount, so "the written-in figure already on file" no longer arises; story 14 |
| RUL-145 | A change whose amount arrives empty is never "Already on file" by comparison: there is nothing to compare | 14 R8 |  |
| RUL-146 | The reason of an unsure change and the note are two lines under the quote, the reason first | 14 R2, R3 |  |
| RUL-147 | A Timeline change sets both years; its value to set is the two years together | 15 R2 |  |
| RUL-148 | "Was …" is not shown when the field is empty on the record Answers written in (2026-11-23): Replaced by comparison by … | 15 R8 |  |
| RUL-149 | A Key facts value is compared with the record's exactly, capitals and spaces included (a funding source and a contact … | 15 R8 |  |
| RUL-150 | The record's value of a field is the one it holds when the check step opens, earlier imports' values included Answers … | 15 R8 |  |
| RUL-151 | Key facts changes keep the reading's order inside their group | 15 R5 |  |
| RUL-152 | A kept change whose value differs from the record's still shows "Was …" Answers written in (2026-11-23): No "Was …" on … | 16 R1 |  |
| RUL-153 | "Kept by *source name*. Change it there." is plain text, not a link Answers written in (2026-11-23): As RUL-152 … | 16 R1 |  |
| RUL-154 | A Timeline is kept when the source supplies either of its two years | 16 R6 |  |
| RUL-155 | Kept is worked out when the check step is drawn; "Add N changes" excludes only the changes drawn as kept, so a field … | 16 R6 |  |
| RUL-156 | A kept change the reading flagged would carry both badges (no sample can produce it) Answers written in (2026-11-23): … | 16 R2 |  |
| RUL-157 | A contact change shows "*name*, *organization*" on one line and the email on the next | 18 R1 |  |
| RUL-158 | A contact "Already on file" shows neither "Matches …" nor "No invitation is sent." Answers written in (2026-11-23): … | 18 R3 |  |
| RUL-159 | A workspace person matches on email or on name, either one, ignoring case and outer spaces; the first match in the list … | 18 R3 |  |
| RUL-160 | The record's contacts for "Already on file" include those earlier imports added; only the email is compared, ignoring … | 18 R7 |  |
| RUL-161 | A contact's organization is text: never matched against the workspace's organizations, never created | 18 R2 |  |
| RUL-162 | Imported contact rows come after the contacts already there, in the order added; a contact with no organization has no … | 18 R4 |  |
| RUL-163 | A contact with no role is labelled "Contact · " on the check step, with a trailing separator Answers written in … | 18 R1 |  |
| RUL-164 | "Not used" is a titled box of lines in the reading's order; every skipped item is joined into one "Skipped:" line … | 19 R1, R4 |  |
| RUL-165 | The model is asked to keep "Not used" to the notable quantities, and to put under "Skipped" anything it deliberately … | 19 R1, R4 |  |
| RUL-166 | The "another project" warning sits between the tally and the first group, cannot be dismissed, and is hidden only when … | 20 R1 |  |
| RUL-167 | The warning is raised for pasted text as for a file | 20 R1 |  |
| RUL-168 | Every change of a report that names another project, Key facts changes included, is marked "needs a decision" unless it … | 20 R2 |  |
| RUL-169 | Every funding source change carries the label "Funding source"; the grant's name is shown only in its "Grant or … | 17 R1 |  |
| RUL-170 | "Secured ($)" arrives as plain digits (48000); on "Add N changes" a "$", commas and spaces in it are ignored | 17 R1 |  |
| RUL-171 | Editing a funding source's name or amount neither ticks nor unticks the change; all three fields stay editable in every … | 17 R2 |  |
| RUL-172 | An added funding source is recorded with the import under Funding sources, label "Funding source", value "name, … | 17 R2 |  |
| RUL-173 | Two names match when equal after dropping outer spaces and ignoring case; used for a funding source's name and … | 17 R8 |  |
| RUL-174 | "Already on file" for a funding source is tested against the record's funding sources plus those earlier imports added, … | 17 R7 |  |
| RUL-175 | "Organization" lists every organization the page is given (the whole directory), with no empty option and nothing to … | 75 R1 |  |
| RUL-176 | An imported funding source row sits after the rows entered by hand, in the order added; its organization is in the … | 17 R9 |  |
| RUL-177 | The match that stops a second row compares name and organization, case and outer spaces ignored, against rows entered … | 17 R13 |  |
| RUL-178 | "Total from all sources" shows no share, and is absent when the only imported funding source matched a row entered by … | 17 R11 |  |
| RUL-179 | The note's text area is the last thing in the check step's changes column, below "Not used" and "Skipped"; it is … | 21 R1 |  |
| RUL-180 | Nothing is recorded of a note when nothing is added: no change ticked; or an invalid change stops "Add N changes", and … | 21 R4 |  |
| RUL-181 | The note is plain text; line breaks and inner spacing are kept, outer spaces and line breaks dropped | 21 R3 |  |
| RUL-182 | The import's row fills the log's three columns, Date, User and Change; two imports of one document are two rows; the … | 22 R3, R4 |  |
| RUL-183 | Pressing "Undo" closes its toast at once (it cannot be pressed twice); the "N changes removed" toast is an information … | 23 R2, R3 |  |
| RUL-184 | The toast is shown only on the load that follows "Add N changes": leaving the project page and coming back does not … | 23 R5 |  |
| RUL-185 | "Undo" removes each entry by its identifier and counts every change the import added, whatever has happened to the … | 23 R2, R3 |  |
| RUL-186 | After "Undo", a funding source or contact the record held before the import stays (the import never drew a second row … | 41 R2 |  |
| RUL-187 | A later import remembers the earlier import's value as "the value before"; undoing the earlier and then the later puts … | 41 R3 |  |
| RUL-188 | Pasted text is cut into paragraphs at blank lines; a single line break stays inside a paragraph; outer spaces of each … | 31 R2 |  |
| RUL-189 | A file left in the file control when pasted text is read is not kept with the import | 40 R1 |  |
| RUL-190 | The import of pasted text records the name "Pasted text" beside the kind "text"; every screen writes "pasted text" from … | 40 R1, R2 |  |
| RUL-191 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: Each import keeps its own copy of its file (name, type, bytes), keyed by the import; the … |
| RUL-192 | A section of the review with no other waiting change appears, under its heading, when an import adds to it | 24 R1 |  |
| RUL-193 | An imported row always shows "who · day"; a row that folds an import over a hand edit shows the import's person and … | 24 R2 |  |
| RUL-194 | The source button's accessible name is "From *document name*, *row label*"; a name too long for the row is cut short on … | 24 R3 |  |
| RUL-195 | Imported rows are placed after the hand edits' rows of their section, in the order the imports were added and, within … | 24 R6 |  |
| RUL-196 | The note is drawn as plain text above every section; a long word wraps | 21 R5 |  |
| RUL-197 | Two imports that each left a note each show it, even with the same words or the same document name; the line under a … | 21 R7 |  |
| RUL-198 | A note is shown whenever a change of its import is waiting: it returns when a publish is undone, and it stays while a … | 21 R9 |  |
| RUL-199 | The note is shown in the Review inbox, above the selected project's changes; only the inbox's list of projects has none | 21 R11 |  |
| RUL-200 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: The document's place is headed by the document's name ("Pasted text" for pasted … |
| RUL-201 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: Pressing the button of the row the document is already open from leaves it … |
| RUL-202 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: A change with no place recorded opens the document at its start (the rule as the code … |
| RUL-203 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: Only a PDF is shown as itself; any other file shows "This file can't be shown here." with … |
| RUL-204 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: On a wide screen opening or moving the document does not scroll the review and focus … |
| RUL-205 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: Which layout applies follows the width while the document is open; with it closed the … |
| RUL-206 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: The document closes by itself, without moving focus, when the row it was opened from … |
| RUL-207 | (struck) | | struck in the inventory: spec #42: the file is not kept, so nothing is stored or opened; was: In the Review inbox the list of projects steps aside while a document is … |
| RUL-208 | On a row for several imports of one field the person and day, like the button, are the latest waiting import's; the … | 85 R1, R2 |  |
| RUL-209 | A sum of lines is converted as a sum, and the line reads "*a* + *b* = *sum* *unit*; *sum* *unit* = *converted* … | 26 R2 |  |
| RUL-210 | A total to date is converted before the difference from the record is taken | 26 R1 |  |
| RUL-211 | The measure's unit is read by the same spellings as the document's; full stops and brackets are ignored; sqft, sqm and … | 26 R5 |  |
| RUL-212 | A unit that is not a length or an area is the measure's own when the two are the same word ignoring case, non-letters … | 26 R5 |  |
| RUL-213 | A figure already in the measure's unit is rounded like a converted one Answers written in (2026-11-23): Held to the … | 26 R6 |  |
| RUL-214 | Cannot convert, at least one unit a known length or area: the change becomes "counts something else", amount empty, … | 26 R7 |  |
| RUL-215 | Neither unit known and not the same word: a match becomes "two readings", the amount keeps the figure as written, note … | 26 R8 |  |
| RUL-216 | A measure is the project's when the names are equal, or equal ignoring case, non-letters and a final s; the "Not used" … | 50 R1 |  |
| RUL-217 | The note for a year that is not a reporting period reads "*year* is not a reporting period on this project, so this is … | 07 R3 |  |
| RUL-218 | A breakdown answer is kept only when question and option both match letter for letter; a dropped answer leaves no note … | 07 R5 |  |
| RUL-219 | Only the Timeline's format is checked: two years, each 1900 to 2099; a field not offered, or a Timeline in another … | 50 R2 |  |
| RUL-220 | Low confidence flags a matched figure, and any Key facts change, as "two readings", value kept, no note Answers written … | 50 R3 |  |
| RUL-221 | A change that trips several checks is flagged once; its notes are joined in the order: the reading's own, the unit's, … | 50 R4 |  |
| RUL-222 | Undo takes the import's row out of the change history. Split from RUL-22, 2026-11-23 | 23 R7 |  |
| RUL-223 | Coordinates stated in a report's text are listed under "Not used", with the reason "Location changes only from a … | 19 R7 |  |
| RUL-224 | The card button reads "Import a report". Stated in full in story 01, R1. | 01 R1 |  |
| RUL-225 | The button shows without pressing Edit. Stated in full in story 01, R1. | 01 R1 |  |
| RUL-226 | The five file types the control names. Stated in full in story 01, R4. | 01 R4 |  |
| RUL-227 | The 20 MB limit the control names. Stated in full in story 01, R4. | 01 R4 |  |
| RUL-228 | The held file's size, removing it, and the refusal of several files. Stated in full in story 01, R5. | 01 R5 |  |
| RUL-229 | A reading is never stored. On leaving, the reading service stops where it can and the file sent is deleted. Stated in … | 01 R7 |  |
| RUL-230 | After "Add N changes" the file is discarded as well: nothing of the file outlives the import. Stated in full in story … | 01 R7 |  |
| RUL-231 | The document's name and each change's quote stay after the file is discarded. Stated in full in story 01, R7. | 01 R7 |  |
| RUL-232 | Amounts show thousands separators on the check step. Stated in full in story 01, R8. | 01 R8 |  |
| RUL-233 | "Adding…" from the press until the project page opens. Stated in full in story 01, R10. | 01 R10 |  |
| RUL-234 | The count an import states is what it wrote. Stated in full in story 01, R11. | 01 R11 |  |
| RUL-235 | The right to edit is checked again on "Read it" and on "Add N changes". Stated in full in story 01, R14. | 01 R14 |  |
| RUL-236 | The choose step's line about the outside AI service. Stated in full in story 01, R15. | 01 R15 |  |
| RUL-237 | A document is read only for a workspace where reading by an outside AI service is on. Stated in full in story 02, R1. | 02 R1 |  |
| RUL-238 | No conversion and no multiplication; such a figure comes back as written, not settled. Stated in full in story 02, R2. | 02 R2 |  |
| RUL-239 | Adding lines is the only arithmetic; exact, never rounded; the sum comes back with its parts. Stated in full in story … | 02 R2 |  |
| RUL-240 | The service stops when the person leaves and keeps nothing. Stated in full in story 02, R4. | 02 R4 |  |
| RUL-241 | Whatever the outcome (added, cancelled, failed, left), the reading service keeps neither the reading nor the document … | 02 R4 |  |
| RUL-242 | The five file types and pasted text. Stated in full in story 02, R5. | 02 R5 |  |
| RUL-243 | 20 MB, 100 pages or 5,000 rows, 50,000 characters; the page and row figures are to be confirmed against the service … | 02 R5 |  |
| RUL-244 | A project with no performance measure or no closed reporting period is still read. Stated in full in story 02, R5. | 02 R5 |  |
| RUL-245 | Nothing of the project's funding sources and contacts or the workspace's organizations and people is sent; the fields … | 02 R5, R6 |  |
| RUL-246 | Every document that is not a PDF comes back as passages; no confidence. four minutes. Stated in full in story 02, R6, … | 02 R6, R7 |  |
| RUL-247 | Every project name the document states, as a list. Stated in full in story 02, R6. | 02 R6 |  |
| RUL-248 | Only the stated year of a Timeline. Stated in full in story 02, R6. | 02 R6 |  |
| RUL-249 | A restated figure comes back once; lines of one table are added. Stated in full in story 02, R6. | 02 R6 |  |
| RUL-250 | Every unused item is listed, and every skipped part has a reason. Stated in full in story 02, R6. | 02 R6 |  |
| RUL-251 | Each "Not used" item is in the document's words with a reason from a fixed set the service does not word. Stated in … | 02 R6 |  |
| RUL-252 | The six reasons. Stated in full in story 02, R7. | 02 R7 |  |
| RUL-253 | Five parts, each change in exactly one, "1 needs you". Stated in full in story 04, R2. | 04 R2 |  |
| RUL-254 | Headings in the workspace's words. Stated in full in story 04, R3. | 04 R3 |  |
| RUL-255 | The check step for a reading that proposes nothing. Stated in full in story 04, R3. | 04 R3 |  |
| RUL-256 | The order of the five states. Stated in full in story 04, R4. | 04 R4 |  |
| RUL-257 | The "Added:" line; no other arithmetic. Stated in full in story 04, R5. | 04 R5 |  |
| RUL-258 | Selection by keyboard and for assistive technology. Stated in full in story 04, R6, R7. | 04 R6, R7 |  |
| RUL-259 | Every document that is not a PDF is shown as passages. Stated in full in story 04, R9, R10, R11. | 04 R9, R10, R11 |  |
| RUL-260 | A change read from two passages (C1, rows 4 and 6) marks the first of them. Stated in full in story 04, R11. | 04 R11 |  |
| RUL-261 | A change with no place. Stated in full in story 04, R12. | 04 R12 |  |
| RUL-262 | Exactly 64rem is narrow. Stated in full in story 05, R1. | 05 R1 |  |
| RUL-263 | Where keyboard focus goes on "Show source" and on "Back". Stated in full in story 05, R3, R5. | 05 R3, R5 |  |
| RUL-264 | The action stays available while the document shows; widening closes the narrow document view. Stated in full in story … | 05 R7, R8 |  |
| RUL-265 | The "left out" part; each change in exactly one part. Stated in full in story 06, R3. | 06 R3 |  |
| RUL-266 | One flagged badge, "Needs you". Stated in full in story 06, R4. | 06 R4 |  |
| RUL-267 | "Nothing to add" when no change has a checkbox (story 16). Stated in full in story 06, R5. | 06 R5 |  |
| RUL-268 | Separators shown and accepted; digits, separators and one decimal point; never rounded. Stated in full in story 07, R1, … | 07 R1, R2 |  |
| RUL-269 | Every breakdown choice on a performance measure change offers an empty choice, so an answer can be set back to none. … | 07 R4 |  |
| RUL-270 | No inferred answers; row C5 arrives unanswered. Stated in full in story 07, R5. | 07 R5 |  |
| RUL-271 | A Key facts change and a contact are taken or left, not edited; amends spec #13. Stated in full in story 07, R6. | 07 R6 |  |
| RUL-272 | The header entry is an always-visible icon, inside "…" only under 45rem. Stated in full in story 08, R1, R2. | 08 R1, R2 |  |
| RUL-273 | The header action and the drop work without pressing Edit. Stated in full in story 08, R1. | 08 R1 |  |
| RUL-274 | Several files dropped together start nothing. Stated in full in story 08, R3. | 08 R3 |  |
| RUL-275 | The file control lists a dropped file when the page is back on the choose step. Stated in full in story 08, R3. | 08 R3 |  |
| RUL-276 | A dropped file over 20 MB, and one that does not reach the page. Stated in full in story 08, R3, R4. | 08 R3, R4 |  |
| RUL-277 | Which endings are readable, and that .doc and .xls are refused. Stated in full in story 08, R4. | 08 R4 |  |
| RUL-278 | The page takes every dropped file and says why one is not read. Stated in full in story 08, R5. | 08 R5 |  |
| RUL-279 | "Paste the report text first." goes as soon as text is typed, and a switch clears it for good. Stated in full in story … | 09 R2, R3 |  |
| RUL-280 | The messages are announced once, as SR-6 now says of every error state. Stated in full in story 09, R3. | 09 R3 |  |
| RUL-281 | What a failed reading of pasted text shows, and where. Stated in full in story 09, R4. | 09 R4 |  |
| RUL-282 | The 50,000-character limit and what the person sees at it. Stated in full in story 09, R6. | 09 R6 |  |
| RUL-283 | The five types, and the refusal of .doc and .xls. Stated in full in story 10, R2. | 10 R2 |  |
| RUL-284 | A dropped file of another type is refused, not held. Stated in full in story 10, R2. | 10 R2 |  |
| RUL-285 | One message at a time, what removes each, and a too-large file leaving the held file in place. Stated in full in story … | 10 R3, R5 |  |
| RUL-286 | 20 MB, 100 pages and 5,000 rows, each refused with the limit stated. Stated in full in story 10, R3. | 10 R3 |  |
| RUL-287 | The six reasons a reading fails, told apart. Stated in full in story 10, R4. | 10 R4 |  |
| RUL-288 | A reading fails after four minutes. Stated in full in story 10, R4. | 10 R4 |  |
| RUL-289 | Every message is announced once, as SR-6 now says of every error state. Stated in full in story 10, R5. | 10 R5 |  |
| RUL-290 | Only what Upload shapes takes (a .zip, up to 50 MB) is held and handed over; the box's three wordings; a refusal is … | 11 R1, R2, R3, R4 |  |
| RUL-291 | The box is hidden with the file control under "Paste text". Stated in full in story 11, R2. | 11 R2 |  |
| RUL-292 | The file is handed over when the link is followed, and let go otherwise. Stated in full in story 11, R4. | 11 R4 |  |
| RUL-293 | Import a report is offered only in a workspace where reading by an outside AI service is on; the other two states are … | 12 R1 |  |
| RUL-294 | Import a report is offered on a project with no performance measure or no closed reporting period. Stated in full in … | 12 R3 |  |
| RUL-295 | The right to edit is checked again on "Read it" and on "Add N changes", and what the person sees when it is gone. … | 12 R6 |  |
| RUL-296 | Only a measure whose values add up; only entries up to the change's period; "on record through `<period>`". Stated in … | 13 R2 |  |
| RUL-297 | A lower total is flagged, not "Already on file". Stated in full in story 13, R5. | 13 R5 |  |
| RUL-298 | The difference is worked out again at the press. A typed figure ticks a change with nothing left; "You entered … | 13 R7 |  |
| RUL-299 | A period's amount beside a total to date; two totals. Stated in full in story 13, R8, R9. | 13 R8, R9 |  |
| RUL-300 | Clearing the figure unticks a change that ticked itself. One reading of a typed figure for the tick and for adding. … | 14 R6 |  |
| RUL-301 | A typed figure the record already holds marks the change and does not tick it. Stated in full in story 14, R8. | 14 R8 |  |
| RUL-302 | A figure in another unit, or one needing multiplication, is flagged and empty. Stated in full in story 14, R9. | 14 R9 |  |
| RUL-303 | A reporting period the project does not offer. Stated in full in story 14, R10. | 14 R10 |  |
| RUL-304 | A figure the reading could not settle always arrives empty, two readings included; other unticked changes keep their … | 14 R11 |  |
| RUL-305 | Code takes the year the report did not state from the record; with no Timeline on the record nothing is proposed. … | 15 R2 |  |
| RUL-306 | Which fields an import can set, and the three it never sets. Stated in full in story 15, R3. | 15 R3 |  |
| RUL-307 | A Key facts change cannot be edited on the check step. "Was …" is all that is said of the value replaced. One field … | 15 R5 |  |
| RUL-308 | The last save stands; the guard is the check at the press. One field stated twice in a reading: folded when the values … | 15 R7 |  |
| RUL-309 | An "Already on file" field has no checkbox and is never counted. Values are compared by the field's type. Stated in … | 15 R8 |  |
| RUL-310 | A value that does not fit is never proposed. Stated in full in story 15, R9. | 15 R9 |  |
| RUL-311 | No "Was …" on a kept change, the line that names the record's value, plain text, kept wins over a flag, "Nothing to … | 16 R1, R2, R3 |  |
| RUL-312 | A field of a subscription that is not authoritative is an ordinary change with one line naming the source. Stated in … | 16 R4 |  |
| RUL-313 | The edit is handed over when it is saved, not at publish. A failed send never undoes the save, and this story shows … | 16 R5 |  |
| RUL-314 | One source for a field, a custom field can be kept, no answer means ordinary, and kept is asked again at the press. … | 16 R6 |  |
| RUL-315 | The heading, the label and "Organization" take the workspace's words; "Total from all sources" does not change. Stated … | 17 R1 |  |
| RUL-316 | Whole dollars; separators shown and accepted. Stated in full in story 17, R2. | 17 R2 |  |
| RUL-317 | An "Already on file" funding source has no checkbox and is never counted. The letter-for-letter match, and "Already on … | 17 R7 |  |
| RUL-318 | Matched against every organization the person can see, connected ones included. Stated in full in story 17, R8. | 17 R8 |  |
| RUL-319 | "From `<document name>`" under a funding source row an import added is plain text and nothing opens (decided, spec … | 17 R9 |  |
| RUL-320 | A contact cannot be edited on the check step. "Contact" takes the workspace's word. The label and first line with no … | 18 R1 |  |
| RUL-321 | Matched by email, by name only without one; stored as the report gives it and linked to nobody. The label and first … | 18 R3 |  |
| RUL-322 | "From `<document name>`" under a contact an import added is plain text and nothing opens (decided, spec #42). It stays … | 18 R4 |  |
| RUL-323 | An "Already on file" contact has no checkbox and is never counted. One contact named twice in a reading is one change. … | 18 R6 |  |
| RUL-324 | Matched by email, by name only without one; stored as the report gives it and linked to nobody. A contact with no email … | 18 R7 |  |
| RUL-325 | "Not used" is complete; "Skipped" is a list, each item with a reason from three. Stated in full in story 19, R1, R4. | 19 R1, R4 |  |
| RUL-326 | The item in the report's words; the reason from a fixed set, worded by the product with the workspace's words. Stated … | 19 R1, R2 |  |
| RUL-327 | A line returned twice is shown once. Stated in full in story 19, R1. | 19 R1 |  |
| RUL-328 | Neither list is kept after adding. Stated in full in story 19, R1. | 19 R1 |  |
| RUL-329 | A funding source with no organization picked is not a line here. Stated in full in story 19, R1. | 19 R1 |  |
| RUL-330 | The two reasons for a project with no performance measure or no closed reporting period. Stated in full in story 19, R2. | 19 R2 |  |
| RUL-331 | The reason for a field an import never sets (story 15). Stated in full in story 19, R2. | 19 R2 |  |
| RUL-332 | The reason for a value that does not fit its field (story 15). Stated in full in story 19, R2. | 19 R2 |  |
| RUL-333 | The reason for a Timeline year with nothing to pair it with (story 15). Stated in full in story 19, R2. | 19 R2 |  |
| RUL-334 | How a name is matched, in code; several projects named. Stated in full in story 20, R1, R3. | 20 R1, R3 |  |
| RUL-335 | The warning is announced once. Stated in full in story 20, R1. | 20 R1 |  |
| RUL-336 | The title takes the workspace's word for Project. Stated in full in story 20, R1. | 20 R1 |  |
| RUL-337 | The changes arrive unticked, as read, with no badge of their own. Stated in full in story 20, R2. | 20 R2 |  |
| RUL-338 | The import records that the report named another project. Stated in full in story 20, R4. | 20 R4 |  |
| RUL-339 | The label, and "reviewer" as the interface's word. Stated in full in story 21, R1. | 21 R1 |  |
| RUL-340 | The limit of 500 characters and what the person sees at it. Stated in full in story 21, R3. | 21 R3 |  |
| RUL-341 | The note cannot be changed or removed once added. Stated in full in story 21, R3. | 21 R3 |  |
| RUL-342 | The line under the note carries the person, the day and the document's name. Stated in full in story 21, R6. | 21 R6 |  |
| RUL-343 | The line under the note carries the person, the day and the document's name. Stated in full in story 21, R7. | 21 R7 |  |
| RUL-344 | The note leaves the review with its last waiting change and stays with the import's record. Stated in full in story 21, … | 21 R9 |  |
| RUL-345 | An import records no file. Of the document it holds the name, and whether it was a file or pasted text. Stated in full … | 22 R1 |  |
| RUL-346 | The document's name and each change's quote are what stay of a document. Stated in full in story 22, R1, R2. | 22 R1, R2 |  |
| RUL-347 | All or nothing, the failed save, one press one import. Stated in full in story 22, R1. | 22 R1 |  |
| RUL-348 | The person and the exact time are recorded; screens show the day in the reader's time zone. Stated in full in story 22, … | 22 R1 |  |
| RUL-349 | The import records that the report named another project. Stated in full in story 22, R1. | 22 R1 |  |
| RUL-350 | The changes left out and the two lists are not recorded. Stated in full in story 22, R2. | 22 R2 |  |
| RUL-351 | In the change history an import's row names its document as text; nothing opens from it. Stated in full in story 22, R4. | 22 R4 |  |
| RUL-352 | The row sits by its time. Stated in full in story 22, R6. | 22 R6 |  |
| RUL-353 | A publish leaves the row. Stated in full in story 22, R6. | 22 R6 |  |
| RUL-354 | A hand edit's row names no source. Stated in full in story 22, R7. | 22 R7 |  |
| RUL-355 | The row in the performance measures' change log. Stated in full in story 22, R8. | 22 R8 |  |
| RUL-356 | "Undo" stays on the toast only (decided, interview Q-24), and the toast is announced and its button a keyboard stop. … | 23 R1, R3 |  |
| RUL-357 | "Undo" is switched off while it runs, and the first toast goes only on success. Stated in full in story 23, R2, R3. | 23 R2, R3 |  |
| RUL-358 | Once the toast is gone, a funding source or a contact an import added is corrected or removed by hand on its own row on … | 23 R6 |  |
| RUL-359 | The entries' rows leave the performance measures' change log. Stated in full in story 23, R7. | 23 R7 |  |
| RUL-360 | Where keyboard focus is once the toast with "Undo" has been replaced. Stated in full in story 23, R8. | 23 R8 |  |
| RUL-361 | An imported row is worded as a hand-made one. Stated in full in story 24, R1. | 24 R1 |  |
| RUL-362 | Each imported entry is its own row. Stated in full in story 24, R1. | 24 R1 |  |
| RUL-363 | The person and the day, in the reader's time zone. Stated in full in story 24, R2. | 24 R2 |  |
| RUL-364 | An imported row keeps its person, day and source on a project never published. Stated in full in story 24, R2. | 24 R2 |  |
| RUL-365 | The document's name and the quote are what the row shows. Stated in full in story 24, R3. | 24 R3 |  |
| RUL-366 | A hand edit's row names no source. Stated in full in story 24, R4. | 24 R4 |  |
| RUL-367 | The line that says the report named another project. Stated in full in story 24, R7. | 24 R7 |  |
| RUL-368 | Who receives the name and the quote. Stated in full in story 24, R8. | 24 R8 |  |
| RUL-369 | Partner changes sit in their own section of the check step, named and placed as the project page's partner section is, … | 27 R2 |  |
| RUL-370 | A partner change is the organization alone. It carries no part in the project (landowner, contractor), and the check … | 27 R3 |  |
| RUL-371 | The organization the report names is matched to the workspace's organizations by the funding source rule (story 17, … | 27 R4 |  |
| RUL-372 | A partner whose organization the workspace does not hold arrives flagged "Not in this workspace" and unticked, with … | 27 R5 |  |
| RUL-373 | A partner is "Already on file" when the project already has that organization as a partner. It then has no checkbox and … | 27 R6 |  |
| RUL-374 | An organization the report names both as a funder and as a partner is proposed once in each section: a funding source … | 27 R7 |  |
| RUL-375 | Inside the section the changes are in the check step's order: ready, "Not in this workspace", "Already on file", and … | 27 R8 |  |
| RUL-376 | Adding a partner change saves the organization on the project as a partner, unpublished, like any other change. Undo, … | 27 R9 |  |
| RUL-377 | A partner an import added shows in the project page's partner list with "From `<document name>`", as text; nothing … | 27 R10 |  |
| RUL-378 | For a partner the reading service returns the organization's name as the report writes it, its quote and the place it … | 27 R11 |  |
| RUL-379 | A reading that is waiting or finished is found on the project page, as one line beside the "Import a report" entry on … | 28 R3 |  |
| RUL-380 | The person who started the reading gets one notification when it becomes ready or fails. Nobody else is notified. … | 28 R4 |  |
| RUL-381 | A project has one reading at a time. While one is reading or ready, a second "Read it" for that project is refused, for … | 28 R5 |  |
| RUL-382 | A ready or failed reading is held for 7 days. It ends, and is discarded, when its changes are added with "Add N … | 28 R6 |  |
| RUL-383 | The file itself is not held. It is sent to be read and is deleted as soon as the reading ends, whether it succeeded or … | 28 R7 |  |
| RUL-384 | A person who stays on the page sees the check step as in the first release, with the document beside the changes. A … | 28 R8 |  |
| RUL-385 | Ticks, edits and the note for the reviewer are kept when the person leaves a ready reading, and are there when they … | 28 R9 |  |
| RUL-386 | What depends on the record is worked out again on return: "Already on file", the difference of a total to date, and … | 28 R10 |  |
| RUL-387 | The right to edit the project is checked on return. A person who can no longer edit it gets what story 12, R6 shows … | 28 R11 |  |
| RUL-388 | During the wait the page says the person may leave and where the reading will be found. A reading nobody is waiting on … | 28 R12 |  |
| RUL-389 | This check runs before the check against the record. Stated in full in story 30, R1. | 30 R1 |  |
| RUL-390 | Decimals are refused, not rounded; the one-trillion limit; "$" and "1e3" are not figures. A ticked change with no … | 30 R2 |  |
| RUL-391 | Focus moves to the first failing field. The messages are announced once. On a narrow screen the document closes and the … | 30 R5 |  |
| RUL-392 | A change with no page; selecting a change always brings its page back. Stated in full in story 31, R1. | 31 R1 |  |
| RUL-393 | The heading "Pasted text", and no page label. Stated in full in story 31, R2. | 31 R2 |  |
| RUL-394 | A ticked "Already on file" entry is added; the comparison is made again at the press and stops the import once. Which … | 32 R4 |  |
| RUL-395 | A ticked "Already on file" entry is added; the comparison is made again at the press and stops the import once. The … | 32 R5 |  |
| RUL-396 | What tells the person why a press added nothing. Stated in full in story 32, R6. | 32 R6 |  |
| RUL-397 | A repeat inside one reading is listed, unticked, with its amount kept. Stated in full in story 32, R7. | 32 R7 |  |
| RUL-398 | "Cancel" during the wait stops the reading service where it can, a reading that finishes anyway is thrown away, and the … | 35 R3, R4 |  |
| RUL-399 | On "Read another" the file that was sent to be read is deleted; nothing of it is kept. Stated in full in story 35, R4. | 35 R4 |  |
| RUL-400 | The name stays "pasted text" for every such import. Stated in full in story 40, R2. | 40 R2 |  |
| RUL-401 | Each change's quote is what stays of the text. Stated in full in story 40, R3. | 40 R3 |  |
| RUL-402 | A row or field changed by hand since stays, a row that stays loses its source line, one already removed is passed over, … | 41 R1, R2 |  |
| RUL-403 | A Key facts field edited by hand since keeps the hand edit. Stated in full in story 41, R3. | 41 R3 |  |
| RUL-404 | A field a later import has set since counts as removed on the toast, not as kept. Stated in full in story 41, R3. | 41 R3 |  |
| RUL-405 | A value also sent to a GIS system is taken back as another edit. Stated in full in story 41, R3. | 41 R3 |  |
| RUL-406 | Whole dollars, never rounded; below one trillion; a name of at most 200 characters; the project page's own limits where … | 65 R1 |  |
| RUL-407 | Which organizations are offered, their order, typing to find one, and changing but not clearing. Stated in full in … | 75 R1 |  |
| RUL-408 | The badge and the sentence go after a pick; unticked afterwards the change is "left out". Stated in full in story 75, … | 75 R3 |  |
| RUL-409 | A funding source left without an organization stays in sight on the check step and is listed nowhere after adding. … | 75 R4 |  |
| RUL-410 | A funding source with no organization or no amount is proposed, flagged, and never added without both. Stated in full … | 75 R5 |  |
| RUL-411 | On the project page, a person who can edit the project can change each value of a funding source row: the grant or … | 81 R1 |  |
| RUL-412 | The same person can remove a funding source row. "Remove" asks once, naming the row, before anything is removed; … | 81 R2 |  |
| RUL-413 | A person who can edit the project can change each value of a contact row: the name, the role, the organization and the … | 81 R3 |  |
| RUL-414 | The same person can remove a contact row, confirmed in the same way. Stated in full in story 81, R4. | 81 R4 |  |
| RUL-415 | A value is saved only when it is valid. One that is not is not saved: the row keeps the value it had, and a message … | 81 R5 |  |
| RUL-416 | A change that would make two rows the same is refused, with a message next to the field: a funding source given the … | 81 R6 |  |
| RUL-417 | Each change and each removal saves at once and is unpublished, like any hand edit: on the record straight away, in the … | 81 R7 |  |
| RUL-418 | A row an import added, once changed or removed by hand, is a hand edit from then on. Stated in full in story 81, R8. | 81 R8 |  |
| RUL-419 | The Funding sources table follows the change at once. "Total from all sources", when it shows, adds the amounts as they … | 81 R9 |  |
| RUL-420 | Someone who cannot edit the project sees the rows with no way to change or remove them. The right is checked again when … | 81 R10 |  |
| RUL-421 | Only an Administrator of the workspace sees the section and can change the setting. Nobody else is shown it, by any … | 82 R3 |  |
| RUL-422 | Turning the setting on takes an agreement. The section has a checkbox, "I agree to this on behalf of this workspace", … | 82 R5 |  |
| RUL-423 | Once the setting is on, Import a report is offered in the workspace as the other stories say, to everyone who can edit … | 82 R6 |  |
| RUL-424 | While the setting is on, the section has an action, "Turn off". Pressing it sets the state to off, with no agreement … | 82 R7 |  |
| RUL-425 | While the setting is unavailable, the section shows "Not available" and one line with the reason, "This workspace's … | 82 R8 |  |
| RUL-426 | Only the product's operator makes the setting unavailable for a workspace, or available again, from outside the … | 82 R9 |  |
| RUL-427 | When a change to the setting cannot be saved, the state stays as it was and a message by the control says so and to try … | 82 R10 |  |
| RUL-428 | Where the card button would be, the Performance measures card shows one line that says why: Stated in full in story 83, … | 83 R2 |  |
| RUL-429 | The line, and everything else in this story, is shown only to a person who can edit the project. The right to edit is … | 83 R3 |  |
| RUL-430 | The setting is tested again when "Read it" is pressed, before the document is sent. If it has been turned off or made … | 83 R5 |  |
| RUL-431 | Turning the setting off does not take away a reading the person already has. A check step that is already open can … | 83 R6 |  |
| RUL-432 | A readable file dropped on the project page while the setting is off or unavailable is taken by the page, so the … | 83 R7 |  |
| RUL-433 | When the setting is turned on, the entry points are offered and the line is gone from the person's next load of the … | 83 R8 |  |
| RUL-434 | "Undo" removes only what is still as the import left it. An entry the person corrected by hand since the import (its … | 84 R1 |  |
| RUL-435 | An entry already removed by hand since the import is passed over. It is counted neither as removed nor as kept. Stated … | 84 R2 |  |
| RUL-436 | The toast after "Undo" counts what was really removed and says what stayed: "`<N>` changes removed. `<M>` you changed … | 84 R3 |  |
| RUL-437 | When "Undo" finds nothing left to remove, because every change of the import was changed or removed by hand, the toast … | 84 R4 |  |
| RUL-438 | In each of R1 to R4 the import itself goes: it is no longer recorded, its note goes (story 21), its row leaves the … | 84 R5 |  |
| RUL-439 | When the import was already taken back, from another window, pressing "Undo" changes nothing. The toast closes and a … | 84 R6 |  |
| RUL-440 | Once any of the import's changes has been published, "Undo" takes nothing back, whatever else is true of the import. … | 84 R7 |  |
| RUL-441 | "Undo" is all or nothing. If any part of what it should remove cannot be removed (the connection is lost, the save … | 84 R8 |  |
| RUL-442 | The right to edit the project is checked again when "Undo" is pressed. A person who has lost it reads "You can no … | 84 R9 |  |
| RUL-443 | When more than one of these holds at one press, one message shows, in this order: the right to edit lost (R9); the … | 84 R10 |  |
| RUL-444 | Each of these messages is announced to assistive technology once, when it appears. Where the toast keeps "Undo" (R8), … | 84 R11 |  |
| RUL-445 | The document's name and the quote are what the row carries; nothing opens (decided, spec #42). Stated in full in story … | 85 R1, R2 |  |
| RUL-446 | A hand edit after an import shows the hand edit's value, person and day and keeps the import's source line and quote. … | 85 R3, R4, R5 |  |
| RUL-447 | A funding source whose grant or program and organization match a funding source on the record (story 17, R7 and R8), … | 86 R1 |  |
| RUL-448 | Adding a change of R1 replaces the amount on the row the record has. No second row is added, and the import counts it … | 86 R2 |  |
| RUL-449 | A change's state follows the person's edits. It is worked out again whenever the person changes "Grant or program", … | 86 R3 |  |
| RUL-450 | The state is worked out once more when "Add N changes" is pressed, by the same tests, against the record as it then … | 86 R4 |  |
| RUL-451 | One reading never proposes one funding source twice as two ready changes. Stated in full in story 86, R5. | 86 R5 |  |
| RUL-452 | "Undo" of an import that changed a row's amount puts back the amount the import found, and the row's "From …" line is … | 86 R6 |  |
| RUL-453 | When two imports have set one row's amount, the row shows the later import's amount and its "From …" line names the … | 86 R7 |  |
| RUL-454 | A change to a funding source row the record already held records the amount it replaced, as a Key facts change records … | 22 R2 |  |

## Objects

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| OBJ-1 | Import (one act of adding changes from one document) | 22 R1 |  |
| OBJ-2 | Reading (what was read from one document, before anything is added) | 01 R7 |  |
| OBJ-3 | Proposed change | 01 R8 | part excluded: dropped in interview (Q-25) |
| OBJ-4 | Imported change (a proposed change once added to the record) | 22 R2 |  |
| OBJ-5 | Source document | 04 R9 |  |
| OBJ-6 | Workspace setting "reading by an outside AI service" | 82 R1 |  |

## Actors

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| ACT-1 | Anyone who can edit the project: a Contributor on a project their organization leads, or an Administrator (the spec's … | | actor: covered by the map's Goals table, not by a requirement |
| ACT-2 | Manager (of the project's lead organization) | | actor: covered by the map's Goals table, not by a requirement |
| ACT-3 | Administrator | | actor: covered by the map's Goals table, not by a requirement |
| ACT-4 | Viewer and the public | | actor: covered by the map's Goals table, not by a requirement |

## Spec decisions

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| spec #1 | Maintainers are trusted members. Every edit saves to the record immediately, however it arrived. | 01 R11; 81 R7 (through RUL-1, RUL-417) | |
| spec #2 | The public page and reports show only published values. **Silence means no:** nothing is published because … | | through ACT-4, STA-30, RUL-2: actor: covered by the map's Goals table, not by a requirement; out of scope: owned elsewhere: `publish-review` (system map, shared surfaces and shared rules). Listed as dependencies above |
| spec #3 | One exception: a workspace data source publishes itself (decision 22). | | out of scope: owned elsewhere: `publish-review` (and `gis-data-sources` for #3), shown by `public-site`. The inventory read both as context and has no item for them |
| spec #4 | A public figure shows when it was last published, so the lag is visible. | | out of scope: owned elsewhere: `publish-review` (and `gis-data-sources` for #3), shown by `public-site`. The inventory read both as context and has no item for them |
| spec #5 | Every change carries one of three sources: edited by hand, from a named document, from a named data source. … | 22 R3, R4, R6, R7 (through SCR-4, STA-31, RUL-3, RUL-50) | |
| spec #6 | There is no separate "project update" form or request. The words "project update" are not used as a noun in … | standing requirement: SR-1, SR-4, SR-6, SR-8, SR-9, SR-10, SR-11 (`standing-requirements.md`) (through RUL-4) | |
| spec #7 | Its own page: Projects › *Project* › Import a report. The side sheet is removed; one construction only. | 01 R2 (through SCR-1, RUL-5) | |
| spec #8 | Three entries: the button on the measures card, an item in the project page's "…" menu, and dropping a … | 01 R1, R2; 08 R1, R2, R3 (through SCR-1, ACN-1, ACN-2, ACN-3) | |
| spec #9 | It proposes changes to performance measures, timeline, contacts, partner organizations, funding sources, and … | 15 R1, R2, R3, R4, R6; 27 R1 (through RUL-6, RUL-58, RUL-66) | |
| spec #10 | Funding sources are proposed (who funded, how much secured). Spend is skipped and the page says so: funders … | 17 R9, R10, R11, R12, R13; 19 R3, R4 (through STA-29, RUL-7, RUL-48) | |
| spec #11 | **Location.** Shapes change only from spatial data. A report's prose never moves, adds or redraws a location. … | 11 R1, R2, R3, R4, R5; 19 R7 (through STA-5, RUL-8, RUL-64, RUL-223) | |
| spec #12 | Layout: the document on one side, proposed changes on the other, grouped by the project page's sections; … | 04 R1, R2, R3, R7; 05 R1, R2, R3, R4, R5, R6 (through SCR-2, STA-8, STA-9, ACN-9, ACN-10, RUL-9) | |
| spec #13 | Every proposed value is editable. When the reading is unsure (including a unit mismatch, or a to-date total … | 07 R1, R2, R6; 14 R2, R5, R6, R7 (through STA-14, ACN-12, ACN-13, RUL-11, RUL-271) | |
| spec #14 | A contact is matched to an existing person by email or name; otherwise added as a name and email only. No … | 18 R1, R2, R3, R4 (through STA-28, RUL-16) | |
| spec #15 | An organization not in the workspace is flagged for the maintainer to pick an existing one; otherwise listed … | 17 R1, R2; 75 R1, R2, R3, R4 (through STA-15, ACN-15, ACN-22, RUL-17) | |
| spec #16 | A field kept by a data source appears as "Kept by *source*" with no proposed change. | 16 R1, R2, R3, R6, R7 (through STA-16, RUL-18) | |
| spec #17 | One optional note to the manager per import. | 21 R1, R2, R3 (through ACN-16, RUL-19) | |
| spec #18 | One button in the top bar states the count ("Add 9 changes") and returns to the project page. A toast offers … | 01 R10, R11, R12; 22 R1; 23 R1, R2, R7; 41 R1, R2, R3 (through OBJ-1, SCR-3, STA-26, ACN-17, ACN-18, RUL-20, RUL-22, RUL-83, RUL-222) | |
| spec #19 | The document is kept as the source of those changes, reachable from the change log and the review. No Files … | 04 R9; 22 R1, R7; 24 R5 (through OBJ-1, OBJ-5, RUL-24, RUL-25) | |
| spec #20 | One document per import. A document covering several projects is later; the existing warning stays when a … | 01 R5; 20 R1, R2, R3 (through STA-19, RUL-26, RUL-27) | |
| spec #21 | Available to anyone who can edit the project, on every plan. Typed or pasted text stays as a source; speech … | 09 R1, R2, R4, R5; 12 R1, R2, R5, R6; 40 R1, R2, R3 (through STA-2, ACN-4, RUL-28, RUL-29, RUL-30, RUL-57, RUL-82) | |
| spec #41 | Reading a report with an outside AI service is a workspace setting. It is off until an administrator of the … | 02 R1, R2, R3, R4, R5, R6, R7; 12 R1; 82 R1, R3, R4, R5, R6, R7, R8; 83 R1, R2, R3, R4, R5, R8 (through OBJ-6, STA-38, STA-39, STA-40, RUL-33, RUL-70, RUL-237, RUL-293, RUL-421, RUL-422, RUL-423, RUL-424, RUL-425, RUL-428, RUL-429, RUL-430, RUL-433) | |
| spec #42 | The report or spreadsheet is used only to read data from. The file is not kept after the import is added (or … | 01 R7; 02 R4; 04 R9; 17 R9; 18 R4; 22 R1, R4, R7; 24 R1, R2, R3, R4, R5; 28 R7; 35 R4; 40 R1, R2, R3; 41 R1, R2, R3; 85 R1, R2 (through OBJ-5, SCR-5, STA-32, RUL-22, RUL-24, RUL-25, RUL-29, RUL-187, RUL-194, RUL-208, RUL-230, RUL-241, RUL-319, RUL-322, RUL-345, RUL-351, RUL-383, RUL-399, RUL-445) | |
| spec #22 | Three owners. **Workspace:** an administrator links a source covering every project (the existing GIS … | | out of scope: owned elsewhere: `gis-data-sources`; specified, not built |
| spec #23 | "Data source" is the term. "Connected" stays for the workspace link in the connected-organizations spec. | | out of scope: owned elsewhere: `gis-data-sources`; specified, not built |
| spec #24 | Workspace sources publish without review: an administrator approved the source and mapping at setup. Their … | | out of scope: owned elsewhere: `gis-data-sources`; specified, not built |
| spec #25 | Organization and project sources are staged for publish like any other change. | | out of scope: owned elsewhere: `gis-data-sources`; specified, not built |
| spec #26 | Setup for an organization or project source is mapped and confirmed once, on the Import a report layout with … | | out of scope: dropped from build 1 in interview (Q-29) |
| spec #27 | One owner per field. A field kept by a source is read-only by hand. When two sources want one field, the … | | out of scope: owned elsewhere: `gis-data-sources`; specified, not built |
| spec #28 | A row matching no project is listed for a manager to match or create. Organization and project sources never … | | out of scope: owned elsewhere: `gis-data-sources`; specified, not built |
| spec #29 | An organization's own manager may publish its staged changes, as roles work today. A program that wants its … | | out of scope: owned elsewhere: `gis-data-sources`; specified, not built |
| spec #40 | A GIS subscription has one setting: whether it is the authoritative source for the fields it supplies. … | 16 R1, R4, R5, R7 (through RUL-69) | |
| spec #30 | The existing review is the one stream: workspace queue, one net-diff page per project, Publish and next, … | | through STA-33, RUL-44: out of scope: owned elsewhere: `publish-review` (system map, shared surfaces and shared rules). Listed as dependencies above |
| spec #31 | Each row shows its source. For a document, it opens beside the diff at the passage. (Build 1.) *(Amended by … | 04 R1; 24 R1, R2, R3, R4 (through SCR-2, SCR-5, STA-32) | |
| spec #32 | An import's note sits above the changes that import produced. (Build 1.) | 21 R5, R6, R7, R8, R9, R10, R11; 24 R1 (through SCR-5, STA-34, RUL-45) | |
| spec #33 | **Hold** one row with a required note and publish the rest. The held value stays on the record and returns in … | | out of scope: owned elsewhere: `publish-review`, build 2 |
| spec #34 | **Revert** requires a reason and extends to measure entries filed since the last publish. Boundaries stay … | | out of scope: owned elsewhere: `publish-review`, build 2 |
| spec #35 | Editing stays out of the review. Each row links to its field on the project page. | | out of scope: owned elsewhere: `publish-review`; not part of Import a report |
| spec #36 | The queue stays oldest first. Rows are marked, with the reason stated, in three cases worked out in code: a … | | out of scope: owned elsewhere: `publish-review`, build 2 |
| spec #37 | Bulk publish stays cut. | | out of scope: owned elsewhere: `publish-review`; not part of Import a report |
| spec #38 | A hold or revert notifies the person who made the change. A publish notifies nobody individually. | | out of scope: owned elsewhere: `publish-review`, build 2 |
| spec #39 | `/prototypes/team-5` stays untouched until the Import a report page exists, then is deleted whole, including … | | out of scope: owned elsewhere: `team-5-sandbox`; Q-3 |

## Counts per story

| # | Story | Type | Release | Lines | Requirements | Scenarios | Status | Blocked by |
|---|---|---|---|---|---|---|---|---|
| 01 | A Contributor adds performance measure entries read from one report file | story | first | 233 **(over 220)** | 15 | 14 **(over 12)** | needs-triage | 02 |
| 02 | Reading service: a model reads the document, code does the arithmetic | enabler | first | 207 | 8 | 14 **(over 12)** | needs-triage | none |
| 04 | A Contributor checks each change against the document beside it | story | first | 221 **(over 220)** | 12 | 14 **(over 12)** | needs-triage | 01 |
| 05 | A Contributor on a narrow screen opens a change's source and comes back to the same change | story | first | 172 | 8 | 12 | needs-triage | 04 |
| 06 | A Contributor chooses which changes to add | story | first | 161 | 6 | 9 | needs-triage | 01, 04 |
| 07 | A Contributor corrects a performance measure change before adding it | story | first | 177 | 7 | 12 | needs-triage | 06 |
| 08 | A Contributor starts an import from the project header, or by dropping a file on the project page | story | first | 189 | 7 | 13 **(over 12)** | needs-triage | 01, 10 |
| 09 | A Contributor pastes the report's text instead of choosing a file | story | first | 166 | 6 | 11 | needs-triage | 01 |
| 10 | A Contributor is told why a file was not read | story | first | 184 | 5 | 12 | needs-triage | 01 |
| 11 | A Contributor who chooses a spatial file has it handed to Upload shapes | story | first | 175 | 5 | 12 | needs-triage | 01, 09 |
| 12 | A Contributor is offered Import a report on every project they can edit, and nobody else is | story | first | 174 | 6 | 12 | needs-triage | 01, 08 |
| 13 | A Contributor sees a total to date filed as the difference from the record | story | first | 200 | 9 | 14 **(over 12)** | needs-triage | 01, 02, 32, 14 |
| 14 | A Contributor fills or leaves out a change the reading flagged | story | first | 206 | 11 | 13 **(over 12)** | needs-triage | 06, 07, 02, 32 |
| 15 | A Contributor adds Key facts the report names | story | first | 211 | 9 | 15 **(over 12)** | needs-triage | 04, 02, 32, 19 |
| 16 | A Contributor sees a Key facts field an authoritative data source supplies as kept | story | first | 189 | 7 | 12 | needs-triage | 15 |
| 17 | A Contributor adds funding sources the report names and sees them on the project page | story | first | 217 | 9 | 14 **(over 12)** | needs-triage | 06, 02, 32, 22, 81 |
| 18 | A Contributor adds contacts the report names, with no invitation sent | story | first | 209 | 7 | 14 **(over 12)** | needs-triage | 04, 02, 32, 22, 81 |
| 19 | A Contributor sees what the report says that the import did not use, and why | story | first | 189 | 7 | 11 | needs-triage | 04, 02 |
| 20 | A Contributor is warned when the report names another project | story | first | 170 | 4 | 12 | needs-triage | 04, 02, 06, 22 |
| 21 | A Contributor leaves one note with an import, and the Manager reads it above the import's changes | story | first | 202 | 11 | 13 **(over 12)** | needs-triage | 22, 24 |
| 22 | A Contributor's import is recorded and listed in the project's change history | story | first | 190 | 8 | 12 | needs-triage | 01 |
| 23 | A Contributor takes back an import from the toast | story | first | 181 | 8 | 12 | needs-triage | 01, 22 |
| 24 | A Manager sees which waiting changes came from a document, and the words each was read from | story | first | 177 | 8 | 11 | needs-triage | 22 |
| 26 | Unit conversion: a figure in another unit is converted in code, or flagged | enabler | later | 165 | 8 | 9 | needs-triage | 02, 04, 13, 14 |
| 27 | A Contributor adds partner organizations the report names | story | later | 156 | 11 | 11 | needs-triage | 17, 41, 75, and a partner organizations section on the project page (`project-record`, later, not built) |
| 28 | A Contributor leaves while a report is read and comes back to the finished reading | story | later | 167 | 12 | 12 | needs-triage | 01, 35, 06, 07, 10, 12, 21, 32 |
| 30 | A Contributor is stopped before anything is added by an invalid change | story | first | 185 | 5 | 13 **(over 12)** | needs-triage | 06, 07, 05 |
| 31 | A Contributor sees a PDF report as itself, at the page each change was read from | story | first | 123 | 2 | 6 | needs-triage | 04, 09 |
| 32 | A Contributor sees an entry the record already holds as "Already on file" | story | first | 188 | 7 | 12 | needs-triage | 01, 02, 06 |
| 35 | A Contributor leaves Import a report, or starts again, without adding anything | story | first | 138 | 5 | 7 | needs-triage | 01 |
| 36 | An import records which figures the Contributor changed or filled in | enabler | first | 157 | 6 | 12 | needs-triage | 07, 13, 14, 17, 22, 75 |
| 40 | A Contributor's import from pasted text names "pasted text" as its document | story | first | 115 | 3 | 4 | needs-triage | 09, 22 |
| 41 | A Contributor's Undo takes back every kind of change the import added | story | first | 150 | 3 | 9 | needs-triage | 15, 17, 18, 23, 84 |
| 50 | Reading guards: what the model returns is checked against the project in code | enabler | later | 139 | 4 | 5 | needs-triage | 02, 07, 14, 15, 19 |
| 65 | A Contributor is stopped before anything is added by an invalid funding source | story | first | 166 | 4 | 10 | needs-triage | 17, 30, 75 |
| 75 | A Contributor picks an organization for a funding source whose organization the workspace does not hold | story | first | 170 | 5 | 10 | needs-triage | 17, 30 |
| 81 | A Contributor edits or removes a funding source or a contact on the project page | story | first | 200 | 10 | 12 | needs-triage | none |
| 82 | An Administrator agrees to reading by an outside AI service and turns it on or off for the workspace | story | first | 191 | 10 | 12 | needs-triage | none |
| 83 | A Contributor is told why Import a report is not offered while reading is off or unavailable | story | first | 169 | 8 | 10 | needs-triage | 01, 08, 12, 82 |
| 84 | A Contributor's Undo keeps what was changed by hand since, and says so when it cannot take the import back | story | first | 180 | 11 | 11 | needs-triage | 23 |
| 85 | A Manager sees which document a review row names when a field was set more than once | story | first | 132 | 5 | 5 | needs-triage | 24, 15, 41 |
| 86 | A Contributor sees a funding source the record already holds with another amount as a change to that row | story | first | 197 | 7 | 13 **(over 12)** | needs-triage | 17, 41 |
| | **42 stories** | | | 7488 | 309 | 471 | | |

## Build order

1. 02, 81, 82
2. 01
3. 04, 09, 10, 22, 35
4. 05, 06, 08, 11, 19, 23, 24, 31, 40
5. 07, 12, 20, 21, 32, 84
6. 14, 15, 17, 18, 30, 83
7. 13, 16, 41, 75
8. 36, 65, 85, 86

## Findings

- **story with more than 12 scenarios** (12)
  - 01: 14
  - 02: 14
  - 04: 14
  - 08: 13
  - 13: 14
  - 14: 13
  - 15: 15
  - 17: 14
  - 18: 14
  - 21: 13
  - 30: 13
  - 86: 13
- **story longer than 220 lines** (2)
  - 01: 233
  - 04: 221
- **UAT Preconditions need a story outside Blocked by (directly or through its blockers)** (2)
  - 02: needs 01, 04; Blocked by none
  - 20: needs 24; Blocked by 04, 02, 06, 22
- **requirement with no scenario** (3)
  - 04 R10
  - 07 R6
  - 81 R8
- **Scenarios section names a story outside Blocked by (read: does a Given need it?)** (8)
  - 04: names 06, 14, 16, 32, 75
  - 06: names 14, 16, 20, 32, 75
  - 07: names 14, 15, 18
  - 15: names 07
  - 18: names 07
  - 19: names 15
  - 32: names 07
  - 81: names 17, 18, 41, 84
- **missing section** (2)
  - 27: UAT script or Verification
  - 28: UAT script or Verification
- **story with open questions whose status is not needs-info** (1)
  - 28: needs-triage
- **enabler that no story is blocked by** (3)
  - 26 (later)
  - 36 (first)
  - 50 (later)

## Accepted by the user

None yet. Each finding the user accepts is listed here with the date.

## Added by hand

Written 2026-11-23, after the answers were written in. Kept when the script rewrites this file. The earlier list (scripts that needed the whole funder report) is gone: each story now names a narrow sample that needs only the story and its blockers. The ten narrow samples are still to be made (`fixtures.md`).

### Not reachable with the story's blockers alone

Read story by story (three readers, each with the story, its blockers' closure and `fixtures.md`). What is left:

| Story | What | Needs | Why it is left |
|---|---|---|---|
| 01 | S8 and UAT step 8 compare each change with its fixture row; row C1's "Added: 3.5 + 2 = 5.5 acres" line | story 04 (R5) | 04 is blocked by 01. With 01 alone C1 shows 5.5 and no "Added:" line; the tester skips that line until 04 ships |
| 04 | S14's Then looks at the "Not used" list of a reading that proposes nothing | story 19 | 19 is blocked by 04. The rest of S14 is 04's own |
| 04, 06 | Three of the tally's five parts and the unticked arrivals (04, R2; 06, R4) are first seen in 14, 32, 75 and 16 | 14, 16, 32, 75 | each is blocked by 04 or 06; stated in both stories |
| 07 | R6 (a Key facts change and a contact have no fields) has no scenario here | 15 (S8), 18 (S2) | the joint scenarios are in the stories built second |
| 09 | S10 shows a failed reading's reason, worded as story 10 words it | story 10 (R4) | adding 10 to 09's blockers would move 09, 11, 31 and 40 a wave later; left for the user |
| 20 | UAT step 7, second half: the line in the review that says the report named another project | story 24 (R7) | 24 shows what 20 records; named under 20's Preconditions |
| 22 | S10 (a failed save keeps ticks, edits and note) unticks a change and types a note | stories 06 and 21 | 21 is blocked by 22; 06 could be added to 22's blockers, which would move 22 and everything after it a wave later |
| 22 | R2 (what each change records) is first seen on a review row | story 24 | 24 is blocked by 22 |
| 30 | S7 (a ticked change with no reporting period) is by kind; a real one arrives through story 14 (R10). The order against the record check (R1) has no scenario | 14, 32 | blocking 30 on 14 would add a ninth wave |
| 32 | The editing half of R5 (compared again after an edit) | story 07 | blocking 32 on 07 would add a ninth wave |
| 36 | Nothing it records shows on any screen of build 1 | `publish-review`, build 2 | an enabler; stated in the story |
| 41 | The last sentence of R3 (Undo of a value also sent to a GIS system) has a rule and no scenario | story 16 and `gis-data-sources` | 16 and 41 do not block one another |
| 75 | UAT steps 4 and 5 ("Pick an organization." on a hand-ticked change) | story 65 | 65 is blocked by 75; the script says to go from step 3 to step 6 until 65 ships |
| 81 | R8 (an imported row edited by hand keeps its "From …" line) has no scenario here | 17 (S8), 18 (S10) | the joint scenarios are in the stories built second |
| 82 | R7, second part (a reading already back can still be added after the setting is turned off) | story 83 (S7) | 83 is blocked by 82 |
| 04 | R10 (a document that fails to show) has no tester scenario | none | a developer verifies it; no file a tester can bring fails to show |

Needing another feature, not a story of this one: taking away a person's right to edit while a page is open (`users-and-security`: 01 S14, 12 S10 to S12, 84 S9); a publish (`publish-review`: 17, 21, 22, 84); a hand correction of an entry and the change log's source (`performance-measures`: 22, 23, 40, 84); Upload shapes receiving a .zip (`work-areas`: 11); the stand-in for `gis-data-sources` (16); the operator's stand-in for "unavailable" (82, 83). The later stubs 27 and 28 have no UAT script.

### Fixed by the closing pass, 2026-11-23

Blockers added so that a scenario's Given is reachable: 08 on 10 (S7, S9); 11 on 09 (S8); 15 on 19 (S3, S6, S15 now show the "Not used" line, in story 19's words); 20 on 22 (S5); 30 on 05 (S11); 36 on 13 (S11); 83 on 12 (S9); 85 on 41 (S4, S5); later 27 on 41 and 75; later 28 on 06, 07, 10, 12, 21, 32.

### What the script reports that is not a defect (it predates proposals)

- "story with open questions whose status is not needs-info" (42): every story's Open questions section reads "None open" and then lists the proposals it rests on as `- Q-n (proposed) — …`. The script reads each such line as an open question and expects `needs-info`. The stories are `needs-triage`, as `references/proposals.md` says.
- "story cites a question that is already answered": Q-45, Q-52 and Q-135 are decided, and the stories that list them lean on the part still proposed (the name and quote; the notice; part (b)). Q-157 and Q-158 are false: `open-questions.md` uses Q-157, Q-158 and Q-159 twice (Import a report, and classification groups, where they are withdrawn), and the script keeps the later block.
- "Scenarios section names a story outside Blocked by": each is a pointer in a Test data or "first seen in" line, covered by the table above.
- "missing section: UAT script" for 27 and 28: later stubs.
- "enabler that no story is blocked by" for 26, 36, 50: see the map, "What each enabler unblocks".
