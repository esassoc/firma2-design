# Coverage — Import a report (project-updates, build 1)

Checked: 2026-11-23
Stories: 41 · Open questions they cite: 120

## How this was verified

By `scripts/coverage.py`, which parses the inventory, the story map, the epics and every story. An item counts as covered only when a story lists it under `Covers` and that story's Trace table gives it to a requirement; a `relies on` citation does not count. An item with no covering requirement must be excluded by the map (standing requirements, dependencies on other features, out of scope) or struck in the inventory. A spec decision is covered through the inventory items that name it as their source.

Not checked by script: whether a requirement states its inventory item correctly, glossary use, and whether a scenario's Given truly needs only the story's blockers. Those are for the cold read and the reviewer.

## Result

| Kind | Items | Covered by a requirement | Excluded with a reason | Unmapped |
|---|---|---|---|---|
| Screens (SCR) | 5 | 5 | 0 | 0 |
| States (STA) | 37 | 34 | 3 | 0 |
| Actions (ACN) | 22 | 21 | 1 | 0 |
| Rules (RUL) | 223 | 217 | 6 | 0 |
| Objects (OBJ) | 5 | 5 | 0 | 0 |
| Actors (ACT) | 4 | 0 | 4 | 0 |
| Spec decisions | 40 | 21 | 19 | 0 |

Screens, states, actions and rules together: 277 covered, 10 excluded, 0 unmapped, of 287.

## Screens

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| SCR-1 | Import a report page: Projects › *Project* › Import a report, with its acts in the pinned top bar | 01 R2 |  |
| SCR-2 | Source document pane: the document the changes were read from, beside those changes | 04 R1 |  |
| SCR-3 | Project page, as an import leaves it: a toast with Undo, the imported values in Key facts, Performance measures, … | 01 R11 |  |
| SCR-4 | Change history sheet on the project page, with one row per import | 22 R3 |  |
| SCR-5 | The project's review (the diff of unpublished changes), with imported rows, the import's note and the document beside … | 24 R1 |  |

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
| STA-23 | A document with passages (a sample or pasted text) | 31 R2 |  |
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
| STA-35 | The document open beside the diff | 80 R1, R2 |  |
| STA-36 | A file over the size limit is chosen or dropped in the file control | 10 R3 |  |
| STA-37 | A Key facts change that replaces a value | 15 R2, R5 |  |

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
| ACN-19 | "From *document name*" button on an imported row | 33 R1, R2, R3, R4 |  |
| ACN-20 | Close document (icon button), "Back" (narrow) or Escape | 80 R3 |  |
| ACN-21 | "From *document name*" button on a row that folds two imports of one field | 51 R1, R2 |  |
| ACN-22 | Pick an organization on a funding source change | 75 R3 |  |

## Rules

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| RUL-1 | Changes added by an import save to the record at once. Nothing here is a request for approval. | 01 R11 |  |
| RUL-2 | Imported values are not public until a publish; until then they count as unpublished changes on the project. | | out of scope: owned elsewhere: `publish-review` (system map, shared surfaces and shared rules). Listed as dependencies above |
| RUL-3 | Every imported change carries its document as its source, and shows it wherever the change is shown: the review row, … | 22 R7 |  |
| RUL-4 | The interface never uses "project update" as a noun. | | standing requirement: SR-1, SR-4 (`standing-requirements.md`) |
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
| RUL-22 | Undo takes back everything that one import added, of every kind, and nothing else. Beyond its measure entries (RUL-83, … | 41 R1, R2, R3, R4 |  |
| RUL-23 | The toast that offers Undo has no timer; it stays until dismissed. It is shown once: reloading the project page does … | 23 R4, R5 |  |
| RUL-24 | The document is kept as the source of the import's changes and can be opened from the review at each change's passage. … | 24 R5 |  |
| RUL-25 | The document is visible only to people who can edit or publish that project. It is never public. | 03 R4, R5 |  |
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
| RUL-43 | When two imports set the same field, the later one's value stands. | 15 R7 |  |
| RUL-44 | In the review, an import that set a field a hand edit had already changed since the last publish is one row, not two; … | | out of scope: owned elsewhere: `publish-review` (system map, shared surfaces and shared rules). Listed as dependencies above |
| RUL-45 | In the review, the import's note sits above the changes, once per import that left one and still has a change waiting, … | 21 R5, R6, R7, R8, R9, R10 |  |
| RUL-46 | In the review, an imported change's source is a button naming the document; it opens the document beside the diff at … | 33 R1, R2, R8 |  |
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
| RUL-57 | A person who cannot edit the project sees none of the three entry points and cannot open the page. | 12 R5, R6 |  |
| RUL-58 | Partner organizations are not proposed in the first release. Proposing them is `later`. Until then a named party that … | 27 R1 |  |
| RUL-59 | The workspace permission "Import data" governs bulk project import. It does not govern Import a report. | 12 R4 |  |
| RUL-60 | In the first release the person waits on the page while the document is read. A reading is not stored: leaving the page … | 01 R7 |  |
| RUL-61 | `later`: a reading is a stored thing with its own states (reading, ready, failed), so the person can leave and come … | 28 R1, R2 |  |
| RUL-62 | Undo is offered on the toast only. Once the toast is gone an import cannot be taken back as a whole; its changes are … | 23 R6 |  |
| RUL-63 | As read, a change is either ready or flagged for the person to fill. No confidence level is shown, and no suggested … | 14 R1 |  |
| RUL-64 | A spatial file chosen on the Import a report page is handed to Upload shapes, with a link. First release. Not built: … | 11 R4 |  |
| RUL-65 | `later`: the document can be opened from its import's row in the change history. In the first release that row names … | 29 R1 |  |
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
| RUL-78 | Guards applied in code to what the model returns, other than those on units (split from RUL-34, 2026-11-23): a measure … | 50 R1, R2, R3, R4, R5, R6 |  |
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
| RUL-98 | A spatial file is told by the ending of its name, capitals ignored | 11 R1 |  |
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
| RUL-113 | What arrives ticked is worked out once, when the check step opens | 06 R4 |  |
| RUL-114 | A flagged change the record already holds counts as already on file: it is never counted under "need you" | 06 R4 |  |
| RUL-115 | On "Add N changes" a typed figure is read with commas, spaces and "$" removed | 07 R2 |  |
| RUL-116 | "Reporting period" lists the closed periods by name, holds the reading's period, and has no empty choice | 07 R3 |  |
| RUL-117 | Breakdown choices are the measure's questions that are not retired, each with its options that are not retired; an … | 07 R2, R4 |  |
| RUL-118 | An edit changes nothing but its field: no tick, no move, no badge; an edit to an unticked change is kept | 07 R7 |  |
| RUL-119 | A failed check leaves ticks, edits, the selection and the note as they were (it returns before anything is written) | 30 R4 |  |
| RUL-120 | Changes are checked in list order; the "first failing" change is the one nearest the top | 30 R5 |  |
| RUL-121 | Messages are cleared only on changes that are ticked at the press, so a failing change the person then unticks keeps … | 30 R6 |  |
| RUL-122 | The check on a ticked funding source (split from RUL-21, 2026-11-23). It needs a name ("Name the grant or program."; … | 65 R1, R2 |  |
| RUL-123 | A "Not in this workspace" change ticked by hand with no organization stops "Add N changes" with "Pick an organization." | 65 R4 |  |
| RUL-124 | "Changed from the document's figure" on a performance measure change is recorded only when the change arrived with an … | 36 R1 |  |
| RUL-125 | "Changed" on a funding source: the amount differs as a number, or the name, trimmed, differs letter for letter | 36 R2 |  |
| RUL-126 | "Filled in" is set by a figure above zero typed into a change that arrived empty and is unticked, or by an organization … | 36 R5 |  |
| RUL-127 | The document pane shows passages when the document has them, else the PDF when the file is one (by type, or a name … | 04 R9 |  |
| RUL-128 | The whole passage is marked and brought to the top of the pane; the earlier mark is removed; selecting the same change … | 31 R2 |  |
| RUL-129 | A PDF moves only when the change carries a page and it differs from the page shown | 31 R1 |  |
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
| RUL-141 | The "Already on file" badge is drawn once and stays when the change is ticked or edited | 32 R4 |  |
| RUL-142 | A "Needs a decision" change is not ticked by editing its figure: the self-tick applies only to a change whose amount … | 14 R4, R6 |  |
| RUL-143 | The self-tick reads the figure with commas ignored; zero, a negative figure and text tick nothing | 14 R6 |  |
| RUL-144 | A flagged change the record already holds shows "Already on file" and neither flag badge, and does not wait on the … | 14 R8 |  |
| RUL-145 | A change whose amount arrives empty is never "Already on file" by comparison: there is nothing to compare | 14 R8 |  |
| RUL-146 | The reason of an unsure change and the note are two lines under the quote, the reason first | 14 R2, R3 |  |
| RUL-147 | A Timeline change sets both years; its value to set is the two years together | 15 R2 |  |
| RUL-148 | "Was …" is not shown when the field is empty on the record | 15 R8 |  |
| RUL-149 | A Key facts value is compared with the record's exactly, capitals and spaces included (a funding source and a contact … | 15 R8 |  |
| RUL-150 | The record's value of a field is the one it holds when the check step opens, earlier imports' values included | 15 R8 |  |
| RUL-151 | Key facts changes keep the reading's order inside their group | 15 R5 |  |
| RUL-152 | A kept change whose value differs from the record's still shows "Was …" | 16 R1 |  |
| RUL-153 | "Kept by *source name*. Change it there." is plain text, not a link | 16 R1 |  |
| RUL-154 | A Timeline is kept when the source supplies either of its two years | 16 R6 |  |
| RUL-155 | Kept is worked out when the check step is drawn; "Add N changes" excludes only the changes drawn as kept, so a field … | 16 R6 |  |
| RUL-156 | A kept change the reading flagged would carry both badges (no sample can produce it) | 16 R2 |  |
| RUL-157 | A contact change shows "*name*, *organization*" on one line and the email on the next | 18 R1 |  |
| RUL-158 | A contact "Already on file" shows neither "Matches …" nor "No invitation is sent." | 18 R3 |  |
| RUL-159 | A workspace person matches on email or on name, either one, ignoring case and outer spaces; the first match in the list … | 18 R3 |  |
| RUL-160 | The record's contacts for "Already on file" include those earlier imports added; only the email is compared, ignoring … | 18 R7 |  |
| RUL-161 | A contact's organization is text: never matched against the workspace's organizations, never created | 18 R2 |  |
| RUL-162 | Imported contact rows come after the contacts already there, in the order added; a contact with no organization has no … | 18 R4 |  |
| RUL-163 | A contact with no role is labelled "Contact · " on the check step, with a trailing separator | 18 R1 |  |
| RUL-164 | "Not used" is a titled box of lines in the reading's order; every skipped item is joined into one "Skipped:" line | 19 R1, R4 |  |
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
| RUL-188 | Pasted text is cut into paragraphs at blank lines; a single line break stays inside a paragraph; outer spaces of each … | 40 R3 |  |
| RUL-189 | A file left in the file control when pasted text is read is not kept with the import | 40 R1 |  |
| RUL-190 | The import of pasted text records the name "Pasted text" beside the kind "text"; every screen writes "pasted text" from … | 40 R1, R2 |  |
| RUL-191 | Each import keeps its own copy of its file (name, type, bytes), keyed by the import; the import is recorded even when … | 03 R1, R3 |  |
| RUL-192 | A section of the review with no other waiting change appears, under its heading, when an import adds to it | 24 R1 |  |
| RUL-193 | An imported row always shows "who · day"; a row that folds an import over a hand edit shows the import's person and … | 24 R2 |  |
| RUL-194 | The source button's accessible name is "From *document name*, *row label*"; a name too long for the row is cut short on … | 24 R3 |  |
| RUL-195 | Imported rows are placed after the hand edits' rows of their section, in the order the imports were added and, within … | 24 R6 |  |
| RUL-196 | The note is drawn as plain text above every section; a long word wraps | 21 R5 |  |
| RUL-197 | Two imports that each left a note each show it, even with the same words or the same document name; the line under a … | 21 R7 |  |
| RUL-198 | A note is shown whenever a change of its import is waiting: it returns when a publish is undone, and it stays while a … | 21 R9 |  |
| RUL-199 | The note is shown in the Review inbox, above the selected project's changes; only the inbox's list of projects has none | 21 R11 |  |
| RUL-200 | The document's place is headed by the document's name ("Pasted text" for pasted text) | 33 R1 |  |
| RUL-201 | Pressing the button of the row the document is already open from leaves it open | 33 R1 |  |
| RUL-202 | A change with no place recorded opens the document at its start (the rule as the code states it) | 33 R2 |  |
| RUL-203 | Only a PDF is shown as itself; any other file shows "This file can't be shown here." with the quote of the row it was … | 33 R8 |  |
| RUL-204 | On a wide screen opening or moving the document does not scroll the review and focus stays on the button pressed; on a … | 80 R1, R2 |  |
| RUL-205 | Which layout applies follows the width while the document is open; with it closed the review has its full width | 80 R2, R3 |  |
| RUL-206 | The document closes by itself, without moving focus, when the row it was opened from leaves the review | 80 R4 |  |
| RUL-207 | In the Review inbox the list of projects steps aside while a document is open | 80 R5 |  |
| RUL-208 | On a row for several imports of one field the person and day, like the button, are the latest waiting import's; the … | 51 R1 |  |
| RUL-209 | A sum of lines is converted as a sum, and the line reads "*a* + *b* = *sum* *unit*; *sum* *unit* = *converted* … | 26 R2 |  |
| RUL-210 | A total to date is converted before the difference from the record is taken | 26 R1 |  |
| RUL-211 | The measure's unit is read by the same spellings as the document's; full stops and brackets are ignored; sqft, sqm and … | 26 R5 |  |
| RUL-212 | A unit that is not a length or an area is the measure's own when the two are the same word ignoring case, non-letters … | 26 R5 |  |
| RUL-213 | A figure already in the measure's unit is rounded like a converted one | 26 R6 |  |
| RUL-214 | Cannot convert, at least one unit a known length or area: the change becomes "counts something else", amount empty, … | 26 R7 |  |
| RUL-215 | Neither unit known and not the same word: a match becomes "two readings", the amount keeps the figure as written, note … | 26 R8 |  |
| RUL-216 | A measure is the project's when the names are equal, or equal ignoring case, non-letters and a final s; the "Not used" … | 50 R1 |  |
| RUL-217 | The note for a year that is not a reporting period reads "*year* is not a reporting period on this project, so this is … | 50 R2 |  |
| RUL-218 | A breakdown answer is kept only when question and option both match letter for letter; a dropped answer leaves no note … | 50 R3 |  |
| RUL-219 | Only the Timeline's format is checked: two years, each 1900 to 2099; a field not offered, or a Timeline in another … | 50 R4, R5 |  |
| RUL-220 | Low confidence flags a matched figure, and any Key facts change, as "two readings", value kept, no note | 50 R6 |  |
| RUL-221 | A change that trips several checks is flagged once; its notes are joined in the order: the reading's own, the unit's, … | 50 R7 |  |
| RUL-222 | Undo takes the import's row out of the change history. Split from RUL-22, 2026-11-23 | 23 R7 |  |
| RUL-223 | Coordinates stated in a report's text are listed under "Not used", with the reason "Location changes only from a … | 19 R7 |  |

## Objects

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| OBJ-1 | Import (one act of adding changes from one document) | 22 R1 |  |
| OBJ-2 | Reading (what was read from one document, before anything is added) | 01 R7 |  |
| OBJ-3 | Proposed change | 01 R8 | part excluded: dropped in interview (Q-25) |
| OBJ-4 | Imported change (a proposed change once added to the record) | 22 R2 |  |
| OBJ-5 | Source document | 03 R1, R2, R3 |  |

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
| spec #1 | Maintainers are trusted members. Every edit saves to the record immediately, however it arrived. | 01 R11 (through RUL-1) | |
| spec #2 | The public page and reports show only published values. **Silence means no:** nothing is published because … | | through ACT-4, STA-30, RUL-2: actor: covered by the map's Goals table, not by a requirement; out of scope: owned elsewhere: `publish-review` (system map, shared surfaces and shared rules). Listed as dependencies above |
| spec #3 | One exception: a workspace data source publishes itself (decision 22). | | out of scope: owned elsewhere: `publish-review` (and `gis-data-sources` for #3), shown by `public-site`. The inventory read both as context and has no item for them |
| spec #4 | A public figure shows when it was last published, so the lag is visible. | | out of scope: owned elsewhere: `publish-review` (and `gis-data-sources` for #3), shown by `public-site`. The inventory read both as context and has no item for them |
| spec #5 | Every change carries one of three sources: edited by hand, from a named document, from a named data source. … | 22 R3, R4, R6, R7 (through SCR-4, STA-31, RUL-3, RUL-50) | |
| spec #6 | There is no separate "project update" form or request. The words "project update" are not used as a noun in … | standing requirement: SR-1, SR-4 (`standing-requirements.md`) (through RUL-4) | |
| spec #7 | Its own page: Projects › *Project* › Import a report. The side sheet is removed; one construction only. | 01 R2 (through SCR-1, RUL-5) | |
| spec #8 | Three entries: the button on the measures card, an item in the project page's "…" menu, and dropping a … | 01 R1, R2; 08 R1, R2, R3 (through SCR-1, ACN-1, ACN-2, ACN-3) | |
| spec #9 | It proposes changes to performance measures, timeline, contacts, partner organizations, funding sources, and … | 15 R1, R2, R3, R4, R6; 27 R1 (through RUL-6, RUL-58, RUL-66) | |
| spec #10 | Funding sources are proposed (who funded, how much secured). Spend is skipped and the page says so: funders … | 17 R9, R10, R11, R12, R13; 19 R3, R4 (through STA-29, RUL-7, RUL-48) | |
| spec #11 | **Location.** Shapes change only from spatial data. A report's prose never moves, adds or redraws a location. … | 11 R1, R2, R3, R4, R5; 19 R7 (through STA-5, RUL-8, RUL-64, RUL-223) | |
| spec #12 | Layout: the document on one side, proposed changes on the other, grouped by the project page's sections; … | 04 R1, R2, R3, R7; 05 R1, R2, R3, R4, R5, R6 (through SCR-2, STA-8, STA-9, ACN-9, ACN-10, RUL-9) | |
| spec #13 | Every proposed value is editable. When the reading is unsure (including a unit mismatch, or a to-date total … | 07 R1, R2; 14 R2, R5, R6, R7 (through STA-14, ACN-12, ACN-13, RUL-11) | |
| spec #14 | A contact is matched to an existing person by email or name; otherwise added as a name and email only. No … | 18 R1, R2, R3, R4 (through STA-28, RUL-16) | |
| spec #15 | An organization not in the workspace is flagged for the maintainer to pick an existing one; otherwise listed … | 17 R1, R2; 75 R1, R2, R3, R4 (through STA-15, ACN-15, ACN-22, RUL-17) | |
| spec #16 | A field kept by a data source appears as "Kept by *source*" with no proposed change. | 16 R1, R2, R3, R6, R7 (through STA-16, RUL-18) | |
| spec #17 | One optional note to the manager per import. | 21 R1, R2, R3 (through ACN-16, RUL-19) | |
| spec #18 | One button in the top bar states the count ("Add 9 changes") and returns to the project page. A toast offers … | 01 R10, R11, R12; 22 R1; 23 R1, R2, R7; 41 R1, R2, R3, R4 (through OBJ-1, SCR-3, STA-26, ACN-17, ACN-18, RUL-20, RUL-22, RUL-83, RUL-222) | |
| spec #19 | The document is kept as the source of those changes, reachable from the change log and the review. No Files … | 03 R1, R2, R3, R4, R5; 22 R1; 24 R5; 29 R1 (through OBJ-1, OBJ-5, RUL-24, RUL-25, RUL-65) | |
| spec #20 | One document per import. A document covering several projects is later; the existing warning stays when a … | 01 R5; 20 R1, R2, R3 (through STA-19, RUL-26, RUL-27) | |
| spec #21 | Available to anyone who can edit the project, on every plan. Typed or pasted text stays as a source; speech … | 09 R1, R2, R4, R5; 12 R1, R2, R5, R6; 40 R1, R2, R3 (through STA-2, ACN-4, RUL-28, RUL-29, RUL-30, RUL-57, RUL-82) | |
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
| spec #31 | Each row shows its source. For a document, it opens beside the diff at the passage. (Build 1.) | 04 R1; 24 R1, R2, R3, R4; 33 R1, R2, R3, R4, R8; 51 R1, R2; 80 R1, R2 (through SCR-2, SCR-5, STA-32, STA-35, ACN-19, ACN-21, RUL-46) | |
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
| 01 | A Contributor adds performance measure entries read from one report file | story | first | 195 | 13 | 10 | needs-info | 02 |
| 02 | Reading service: a model reads the document, code does the arithmetic | enabler | first | 160 | 8 | 8 | needs-info | none |
| 03 | Kept document: stored with its import, opened only by people who can edit or publish the project | enabler | first | 135 | 5 | 7 | needs-info | 22 |
| 04 | A Contributor checks each change against the document beside it | story | first | 193 | 10 | 10 | needs-info | 01 |
| 05 | A Contributor on a narrow screen opens a change's source and comes back to the same change | story | first | 148 | 7 | 8 | needs-info | 04 |
| 06 | A Contributor chooses which changes to add | story | first | 151 | 6 | 8 | needs-info | 01, 04 |
| 07 | A Contributor corrects a performance measure change before adding it | story | first | 155 | 7 | 8 | needs-info | 06 |
| 08 | A Contributor starts an import from the project header, or by dropping a file on the project page | story | first | 152 | 7 | 8 | needs-info | 01 |
| 09 | A Contributor pastes the report's text instead of choosing a file | story | first | 145 | 5 | 8 | needs-info | 01 |
| 10 | A Contributor is told why a file was not read | story | first | 140 | 5 | 7 | needs-info | 01 |
| 11 | A Contributor who chooses a spatial file has it handed to Upload shapes | story | first | 132 | 5 | 6 | needs-info | 01 |
| 12 | A Contributor is offered Import a report on every project they can edit, and nobody else is | story | first | 145 | 6 | 8 | needs-info | 01, 08 |
| 13 | A Contributor sees a total to date filed as the difference from the record | story | first | 154 | 7 | 8 | needs-info | 01, 02, 32, 14 |
| 14 | A Contributor fills or leaves out a change the reading flagged | story | first | 159 | 8 | 8 | needs-info | 06, 07, 02, 32 |
| 15 | A Contributor adds Key facts the report names | story | first | 166 | 8 | 8 | needs-info | 04, 02, 32 |
| 16 | A Contributor sees a Key facts field an authoritative data source supplies as kept | story | first | 155 | 7 | 8 | needs-info | 15 |
| 17 | A Contributor adds funding sources the report names and sees them on the project page | story | first | 197 | 9 | 11 | needs-info | 06, 02, 32, 22 |
| 18 | A Contributor adds contacts the report names, with no invitation sent | story | first | 158 | 7 | 8 | needs-info | 04, 02, 32, 22 |
| 19 | A Contributor sees what the report says that the import did not use, and why | story | first | 157 | 7 | 9 | needs-info | 04, 02 |
| 20 | A Contributor is warned when the report names another project | story | first | 121 | 3 | 5 | needs-info | 04, 02 |
| 21 | A Contributor leaves one note with an import, and the Manager reads it above the import's changes | story | first | 194 | 11 | 12 | needs-info | 22, 24 |
| 22 | A Contributor's import is recorded and listed in the project's change history | story | first | 143 | 7 | 6 | needs-info | 01 |
| 23 | A Contributor takes back an import from the toast | story | first | 161 | 7 | 9 | needs-info | 01, 22 |
| 24 | A Manager sees which waiting changes came from a document, and which document | story | first | 146 | 6 | 7 | needs-info | 22 |
| 26 | Unit conversion: a figure in another unit is converted in code, or flagged | enabler | later | 158 | 8 | 8 | needs-info | 02, 04, 13, 14 |
| 27 | A Contributor adds partner organizations the report names | story | later | 77 | 1 | 1 | needs-info | 17 |
| 28 | A Contributor leaves while a report is read and comes back to the finished reading | story | later | 92 | 2 | 3 | needs-info | 01, 03, 35 |
| 29 | A Contributor opens an import's document from its row in the change history | story | later | 75 | 1 | 1 | needs-info | 22, 03 |
| 30 | A Contributor is stopped before anything is added by an invalid change | story | first | 147 | 5 | 8 | needs-info | 06, 07 |
| 31 | A Contributor sees a PDF report as itself, and a document held as passages with the change's passage marked | story | first | 118 | 2 | 5 | needs-info | 04, 09 |
| 32 | A Contributor sees an entry the record already holds as "Already on file" | story | first | 141 | 5 | 6 | needs-info | 01, 02, 06 |
| 33 | A Manager opens an imported change's document beside the difference, at its passage | story | first | 140 | 5 | 7 | needs-info | 24, 03 |
| 35 | A Contributor leaves Import a report, or starts again, without adding anything | story | first | 134 | 5 | 6 | needs-info | 01 |
| 36 | An import records which figures the Contributor changed or filled in | enabler | first | 134 | 6 | 8 | needs-info | 07, 14, 17, 22, 75 |
| 40 | A Contributor's pasted text is kept and named as the import's document | story | first | 106 | 3 | 3 | needs-info | 03, 09, 22, 31, 33 |
| 41 | A Contributor's Undo takes back every kind of change the import added | story | first | 125 | 4 | 5 | needs-info | 03, 15, 17, 18, 23 |
| 50 | Reading guards: what the model returns is checked against the project in code | enabler | later | 143 | 7 | 7 | needs-info | 02, 07, 14, 15, 19 |
| 51 | A Manager opens the later document on a review row that stands for two imports | story | first | 95 | 2 | 2 | needs-info | 33, 15 |
| 65 | A Contributor is stopped before anything is added by an invalid funding source | story | first | 139 | 4 | 7 | needs-info | 17, 30, 75 |
| 75 | A Contributor picks an organization for a funding source whose organization the workspace does not hold | story | first | 137 | 4 | 6 | needs-info | 17, 30 |
| 80 | A Manager keeps the document beside the review while judging, and closes it | story | first | 127 | 5 | 6 | needs-info | 33 |
| | **41 stories** | | | 5850 | 240 | 284 | | |

## Build order

1. 02
2. 01
3. 04, 08, 09, 10, 11, 22, 35
4. 03, 05, 06, 12, 19, 20, 23, 24, 31
5. 07, 21, 32, 33
6. 14, 15, 17, 18, 30, 40, 80
7. 13, 16, 41, 51, 75
8. 36, 65

## Findings

- **requirement line that says what the prototype does (judgement: context for an undecided part, or a requirement?)** (10)
  - 02 R2
  - 03 R1
  - 04 R4
  - 17 R13
  - 20 R3
  - 21 R3
  - 22 R6
  - 40 R3
  - 41 R2
  - 41 R3
- **UAT Preconditions need a story outside Blocked by (directly or through its blockers)** (4)
  - 02: needs 01; Blocked by none
  - 03: needs 13, 14, 15, 17, 18, 24, 32, 33, 75; Blocked by 22
  - 14: needs 13, 15, 17, 18, 75; Blocked by 06, 07, 02, 32
  - 19: needs 13, 18, 32, 75; Blocked by 04, 02
- **Scenarios section names a story outside Blocked by (read: does a Given need it?)** (4)
  - 04: names 06, 14, 16, 32, 75
  - 06: names 14, 32, 75
  - 31: names 13, 14, 15, 17, 18, 32, 75
  - 32: names 07
- **requirement with no scenario** (1)
  - 07 R6
- **enabler that no story is blocked by** (3)
  - 26 (later)
  - 36 (first)
  - 50 (later)
- **Not demonstrable with blockers alone** (17)
  - Read by hand on 2026-11-23, after the merge pass; the script does not do this check, so this entry is written back by hand after every `--write`. For every story, each scenario's Given and each UAT step was read against the story's own behavior plus its `Blocked by` closure. The 24 stories not named here pass. Most of what fails is a fixture problem: the one PDF sample, the funder report, proposes every kind of change at once (Q-159; `fixtures.md`, "Samples the feature still needs").
  - 03: Verification assumes the whole funder report (13, 14, 15, 17, 18, 32, 75) and opens it in the review (24, 33)
  - 11: S6 and step 6 read the whole funder report with story 01 alone
  - 13: steps 4 to 6 assume the whole funder report (15, 17, 18)
  - 14: the tally and counts of steps 2, 7 and 8 assume the whole funder report (13, 15, 17, 18, 75)
  - 15: step 6 assumes the whole funder report (13, 14, 17, 18, 75)
  - 17: S6 to S10 and steps 1, 4 and 5 assume the whole funder report (13, 14, 15, 18, 75)
  - 18: step 5 assumes the whole funder report (13, 14, 15, 17, 75)
  - 19: the script reads the funder report with 04 and 02 alone; what is listed above the two lists is not stated
  - 21: S9 needs a second import of one row (story 06 to add F3 alone, or a second small document)
  - 31: S1, S2 and steps 1 to 3 need a PDF of performance measure entries only, which no fixture has; S4 and S5 cannot run in the first release (Q-66)
  - 33: S1 to S4, S7 and steps 2, 3 and 6 open the funder report's PDF, whose import assumes 06 and 13 to 18
  - 36: no screen of build 1 shows what it records; S5 to S8 read the whole funder report (13, 15, 18)
  - 41: every scenario and steps 1 to 5 assume "Add 7 changes" (13, 14, 75)
  - 51: the script assumes the funder report's ready changes (13, 14, 17, 18, 75) and a second document that sets the Timeline, which no fixture has
  - 65: the script reads the whole funder report (13, 14, 15, 18); its count is left unquoted
  - 75: the tally and counts assume the whole funder report (13, 14, 15, 18); steps 4 and 5 need 65, which is built after it
  - 80: every scenario and step opens the funder report's PDF, as in 33
- **Own effect seen only through a later story, another feature or no screen** (8)
  - Read by hand the same day; each is stated in its story and listed in the map under "Cuts I was least sure of".
  - 02: its Verification runs through story 01, which it unblocks (the write standard allows this for an enabler)
  - 04: three of the tally's four parts (R2) and the order of flagged changes (R4) are first seen in 14, 16, 32 and 75
  - 06: the unticked arrivals of R4 are first seen in 14, 16, 32 and 75
  - 07: R6 has no scenario; that a Key facts change and a contact cannot be edited shows only with 15 and 18
  - 16: needs a stand-in for `gis-data-sources` and a sample no fixture has
  - 22: R2 (what each change records) is first seen on a review row, story 24
  - 32: the editing half of R5 needs story 07
  - 41: R4 (the kept document is no longer kept) shows on no screen

## Accepted by the user

None yet. Each finding the user accepts is listed here with the date.
