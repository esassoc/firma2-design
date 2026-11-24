# Terms — Import a report (project-updates, build 1)

Every word the stories use that a newcomer would not know. Stories use these words exactly and do not define them again. Written 2026-11-23; "Review inbox", "Not in this workspace" and "set back" added the same day, after the builder's checklist pass.

## How to read a story

| Notation | Means | Look it up in |
|---|---|---|
| `R1`, `R2` … | A numbered requirement of the story you are reading. **Every numbered requirement is binding, whatever its tag.** | the story |
| `S1`, `S2` … | A scenario (Given / When / Then). Each names the requirements it proves. | the story |
| `story 06, R5` | A requirement of another story. | `stories/06-….md` |
| `SR-1` … | A standing requirement: a rule every story must meet, stated once. | `standing-requirements.md` |
| `SCR-n`, `STA-n`, `ACN-n`, `RUL-n`, `OBJ-n`, `ACT-n` | An inventory item: a screen, a state of a screen, an action, a rule, an object, an actor. The inventory records what the prototype and the written decisions say, with the file and line. | `inventory.md` |
| `Q-n` | An open question nobody has answered yet. A story cites the ID and never restates the question: each Q-ID's question, in full, is in the open-questions file under its number. | `../../open-questions.md` |
| `spec #n` | A numbered decision in the feature's spec. | `../spec.md` |
| `interview <date>, Q-n` | A question the product owner answered on that date. | `../../open-questions.md`, under Answered |
| `(open: Q-n)` after a requirement | Part of the requirement waits on that question. The part that is stated is still binding. | |
| `relies on story NN, <ID>` | The requirement leans on an item another story covers. | that story |
| `<Measure>`, `<document name>`, `<N>` | A placeholder inside quoted interface wording: the real value goes there. | |
| `C2`, `F7`, `P1` | A row of a recorded reading: the crew log, the funder report, the pasted paragraph. | `fixtures.md` |
| Trace table | The table in a story's collapsed notes that gives each requirement's tag and the inventory items it states. | the story |
| Text in "double quotes" | Interface wording. It is the required wording unless the requirement says otherwise. | |

**Tags say where a requirement came from, not how optional it is.**

| Tag | Means |
|---|---|
| `shown` | Observed in the prototype and not yet confirmed in writing. Binding. |
| `decided` | Written in the spec, a decision record or an interview answer. Binding. |
| `decided, not built` | Decided in writing; the prototype does not do it, so there is nothing to look at. Binding. |
| `inferred` | The writer's reading, always with an open question beside it. Build it as stated and expect the answer to confirm or change it. |
| `shown, developer-machine reader only` | Observed only in the reader script a developer runs locally, not on the deployed prototype. Binding as far as it is stated. |

**Header lines of a story.**

| Line | Means |
|---|---|
| `Release` | When the story ships within build 1: `first`, `later` or `undecided`. |
| build 1 | The scope of this whole feature, in the spec's words: the Import a report page and the source and note in the review. Build 2 (Hold, Revert, row markers) belongs to `publish-review`. A build is not a release: build 1 holds `first` and `later` stories. |
| `Status` | Where the story stands. `needs-info`: it cites at least one open question. |
| `Revision` | How many times the story has been changed to follow the prototype since it was written. It starts at 1. |
| `Blocked by` | Stories that must be built before this one can be built or shown. |
| `Covers` | The inventory items this story is the one home of. No other story lists them. |
| `Sources` | Where the behavior comes from: the prototype's address, and the spec decisions or interview answers the story rests on. |
| `Snapshot` | The screenshots of the prototype this story was written against. "Not yet captured" until the prototype is declared finished. |
| `Can start / Waiting` | Which requirements can be built today, which only against a recorded reading, and which wait, and on what. |
| `Reset` (in a UAT script) | How a tester returns to the starting state after the script. |

## Who

| Term | Meaning |
|---|---|
| Contributor | In these stories: anyone who can edit the project. That is a person with the Contributor role on a project one of their organizations leads, or an Administrator. |
| Manager | In these stories: someone who can publish the project. That is a Manager of the project's lead organization, or an Administrator. |
| Administrator, Viewer | The other two fixed workspace roles. An Administrator can edit and publish every project; a Viewer can do neither. |
| visitor | Someone with no account. |
| lead organization | The organization that leads a project. Its members with the Contributor role can edit the project. |

## The feature's own words

| Term | Meaning |
|---|---|
| Import a report | The feature, and the page of that name: a person gives one document, the system reads it, the person checks what was read and adds it to the project. |
| report, document | The file (or pasted text) a person gives to be read. "Report" is the person's word for it; "document" is the same thing once the system holds it. |
| reading | What the system read from one document, before anything is added: the proposed changes, the "Not used" lines and the "Skipped" lines. Also the act of producing it. |
| reading service | The capability that produces a reading: a model reads the document, code does the arithmetic (enabler story 02). |
| choose step | The first step of the Import a report page: the person chooses the document. |
| the wait | The second step: the page shows "Reading *file name*…" until the reading comes back. |
| check step | The third step: the page lists the proposed changes for the person to check and add. |
| change, proposed change | One thing a reading proposes to put on the record. Four kinds exist: a performance measure entry, a Key facts field, a funding source, a contact. |
| imported change | A proposed change once it has been added to the record. |
| import | One act of adding changes from one document, and the record of it: the project, who added it, the day, the document, the note and the imported changes. |
| quote | The words in the document a change was read from, copied exactly, with where they are written in front: "Row 7 — “Plants in ground: 1,850 …”". |
| passage | One block of the document (a heading and the lines under it) that a change points at, so the document can be opened at that place. |
| page (of a document) | The page number a change was read from, kept so a PDF can be opened there. |
| source document, document pane | The document shown beside the changes read from it (story 04), and later beside the review (stories 33 and 80). |
| held as passages | A document the system holds as pages of passages, not as a file: in the first release, pasted text. It is drawn as its pages and passages (story 31); a PDF file is shown as itself, and any other file cannot be shown (story 04). Whether a file's reading ever comes back as passages is Q-66. |
| kept document | The document as stored with its import after the changes are added (enabler story 03). |
| ready | A change the person can add as it stands. It arrives ticked. |
| flagged | A change that waits on the person: the reading could not settle it. It arrives unticked. |
| ticked, unticked | Whether a change's checkbox is on. Only ticked changes are added (story 06). |
| "Not in this workspace" | The badge on a funding source change whose organization the workspace does not hold. It arrives unticked and waits until the person picks an organization (story 75). |
| set back | How an unticked change is drawn: still in its place and still editable, visually receded from the ticked ones (story 06). |
| "Already on file" | The badge on a change the record already holds. It arrives unticked (story 32). |
| "Kept by a data source" | The badge on a Key facts field that an authoritative data source supplies. It cannot be added (story 16). |
| total to date | A figure the report states as a running total, not as one period's amount. It is filed as the difference from what the record holds (story 13). |
| tally | The one line above the changes that counts them by state: "6 ready to add · 3 need you" (story 04). |
| "Not used", "Skipped" | Two lists on the check step: what the document says that the import did not use, and what was deliberately passed over, each with its reason (story 19). |
| note for the reviewer | One optional note the Contributor leaves with an import for whoever reviews it, shown to the Manager above the import's changes in the review (story 21). |
| commit action | The page's primary button on the check step, "Add N changes". |
| the page's actions, pinned top bar | The buttons that act on the whole page. They sit in the bar at the top of the page, which stays in view when the page scrolls. |
| toast | A short message that appears over the page after an act and stays until the person dismisses it. |
| Undo | The action on the toast that takes back everything one import added (stories 23 and 41). |
| entry points | The three ways to open Import a report from the project page: the card button (story 01), the header action and dropping a file (story 08). |
| spatial file | A file of shapes (.shp, .zip, .geojson, .kml, .kmz, .gpkg). It is not read; it goes to Upload shapes (story 11). |
| sample crew log, sample funder report, sample paragraph | The three invented documents the prototype reads. What each proposes is listed in `fixtures.md`. |
| fixture, recorded reading | A sample document together with the one reading of it that every scenario and UAT script is run against. A model's reading is not the same twice, so tests use the recording (`fixtures.md`). |
| Deer Creek | Deer Creek Riparian Corridor Enhancement, the one invented project the prototype offers Import a report on. |
| developer-machine reader | A script that reads a real file with a model on a developer's own machine. It is the nearest thing to a specification of the reading service and is not part of the deployed prototype. |
| walking skeleton | Story 01: the thinnest path through every step, which the other stories add to. A control or case another story owns is absent from it until that story ships (SR-7). |
| enabler | A story with no actor that provides a capability other stories need (02, 03 and 36, and the later 26 and 50). |
| Capability, Verification | In an enabler, the two sections that take the place of Story and UAT script: what the enabler provides and which stories it unblocks, and how a developer or tester confirms it. |
| retired number | 25, 34 and 45: stories merged into others on 2026-11-23. A number is never reused; `story-map.md`, Retired numbers, says where each went. |
| stub | A story the prototype does not show, written from a decision alone: the rules that are decided, and the questions that must be answered before it can be built. Its script cannot be run yet (27, 28, 29). |
| stand-in | Something put in place of a capability that is not built yet (an enabler, or another feature), so that a requirement can be built and shown before the real thing exists. For the reading service, the stand-in is the recorded readings. |

## Words from the rest of the product

The first two are defined in `../../../GLOSSARY.md`. The others are used across the product and not yet defined there (Q-19); the meaning below is the one these stories rely on.

| Term | Meaning |
|---|---|
| Workspace | Glossary. One customer's whole account: its projects, organizations, people and settings. |
| Performance measure | Glossary. A question asked of every project, answered with a number in a unit ("Native trees and shrubs planted", in plants). Never "KPI". |
| Organization, Connected organization, Shared project, Plan | Glossary. Used as defined there. |
| project page | The page of one project, in sections: Key facts, Performance measures, Funding sources, Contacts and others. |
| the record | What the workspace holds about a project, whether or not it has been published. Saving to the record does not make a value public. |
| publish, unpublished changes | A Manager publishes a project's waiting changes to make them public. Until then they are unpublished and only people in the workspace who can see the project's record see them. Owned by the `publish-review` feature. |
| the review | The screen where a Manager reads a project's unpublished changes as a difference from the published version, and publishes. Owned by `publish-review`. |
| Review inbox | The screen that lists every project with changes waiting for review and shows the review of the one selected in it. An imported row, its source button, the import's note and the document beside the review appear there as they do on the project's own review (stories 24, 21, 33, 80). Owned by `publish-review`. |
| change history | The log of changes on a project, opened with History in the project page's header. Owned by `project-record`. |
| hand edit | A change a person typed on the project page, as opposed to one an import added. |
| entry (performance measure entry) | One amount recorded for one performance measure of one project in one reporting period, with any breakdown answers. For a measure whose values add up, its total is the sum of its entries. |
| reporting period | The period an entry is filed under. It has a name, which is what every screen shows; in the sample data each is a calendar year named by its year ("2025"). |
| closed reporting period | A reporting period that has ended. Entries from a report can be filed only under these. |
| breakdown question | A question a performance measure asks about each entry, answered from a fixed list of options ("Riparian treatment": Planting, Invasive removal, Natural recruitment). |
| Key facts | The section of the project page that holds single-value fields such as Timeline and County. |
| funding source | A grant or program that funds a project, with the organization behind it and the amount secured. |
| contact | A person named on a project, with a role, an organization and an email. A contact is not an account. |
| data source, authoritative | A system outside the product that supplies some of a project's fields. When a source is authoritative, the fields it supplies cannot be changed here. Owned by `gis-data-sources`. |
| custom field | A field a workspace defined for its own projects. |
| proposal | A draft project awaiting approval. |
| Upload shapes | The project page's flow for adding a project's shapes from a spatial file. Owned by `work-areas`. |
| renameable noun | One of the nouns a workspace may replace with its own word: Project, Organization, Classification, Performance measure, Funding source, Expenditure, Milestone, Work area, Contact. A label that names one shows the workspace's word (SR-4). Scenarios quote the default words. |
| feature names in `code style` | Other parts of the product, named as the system map names them (`publish-review`, `project-record`, `performance-measures`, `users-and-security` and so on). "Owned by" one of them means its stories state and test the rule. |
