# Open questions

Questions the requirements work has raised and nobody has answered yet. Answer one by writing under its **Answer** line (or tell Claude the answer and its number); it is then applied to the system map, inventories and stories, and moved to **Answered** with the date.

IDs are permanent. `Blocks` says what cannot be finished until the question is answered.

## Product-wide

Raised by the system map (`.scratch/system-map.md`), 2026-11-23.

### Which build stays

**Q-1. Performance measures: `pm2` or `performance-measures`?**
Two builds do the same job. `pm2` is the hackathon team's version kept beside the original for comparison.
Blocks: requirements for performance measures; which feature owns the Performance measure object.
Answer:

**Q-3. Is `team-5-sandbox` out?**
Spec decision 39 (`.scratch/project-updates/spec.md`) says delete it once Import a report exists, and it does.
Blocks: nothing if the answer is yes; it is then dropped from the map.
Answer:

**Q-4. Are these leftovers still wanted?**
`workspace-settings/vocabulary` and `workspace-settings/grid-defaults` are not in the navigation model. Two registry rows are stale: `report-import` and `my-projects`.
Blocks: whether `workspace-look-and-language` covers them.
Answer:

### Written sources disagree

**Q-5. Is publish review on every plan, or Program only?**
The plans spec (`.scratch/tiers/spec.md`) puts publish review on the Program plan only. The project-updates spec says nothing reaches the public or reports without it.
Blocks: `publish-review` and `plans` stories; what a workspace on a lower plan does to publish. Noted 2026-11-23 (project-updates, story 12): Import a report is on every plan, so on a plan without publish review a workspace could import changes that nobody can publish.
Answer:

**Q-6. Are there plans or not?**
`docs/roles-and-permissions.md` says "no billing or plans". The plans spec defines three.
Blocks: nothing in the pilot; one of the two documents needs correcting.
Answer:

**Q-7. "Steward" still appears after the rename to Manager.**
In `.scratch/project-intake/spec.md` and `.scratch/tiers/spec.md`. Presumably a missed rename; confirm and both get corrected.
Blocks: nothing; vocabulary in the `project-intake` and `plans` stories.
Answer:

**Q-8. Where is a proposed project approved?**
The intake spec has its own approval block. The project-updates spec moved approval into the review inbox.
Blocks: `project-intake` and `publish-review` stories (one of them owns approval).
Answer:

### Shared things with no owner

Each needs one feature whose stories state and test it.

**Q-9. The editing grammar for builder canvases** (form-canvas spec, ADR 0001). Used by `project-intake` and `custom-pages`; the spec is not a feature. Should it be standing requirements, or its own feature?
Answer:

**Q-11. Public site switches (Public access, Contact details).** The screen sits in `workspace-settings/custom-pages`; the behavior is all `public-site`. Which owns it?
Answer:

**Q-12. The not-public states** (five, one built). Each is caused by a different feature and all are shown by `public-site`. Does `public-site` own all five?
Answer:

**Q-13. Taxonomy record pages.** One construction shared by `classifications`, `project-types` and `tags`. Which owns the shared behavior?
Answer:

**Q-14. Notification settings.** Rendered by `personal-settings` and `organizations-admin`. Which owns it?
Answer:

**Q-15. Portfolio map and export, and the project set map.** The portfolio map's route is archived but Organization Home still renders it; three features render the project set map. Is the portfolio map still in the product, and who owns each?
Answer:

**Q-16. Funding source.** No feature owns its lifecycle because its screens are not built. Is it a feature to add, or out for now?
Answer:

**Q-17. Project creation has three doors** (`project-intake`, `import-projects`, `gis-data-sources`). Which are open in the first release, and who owns the rule for which a workspace offers?
Answer:

**Q-18. Reports.** The published-values rule names them, but no report exists in the prototype. Is reporting a feature to add, or outside this product?
Answer:

### Glossary

**Q-19. Nineteen nouns the product has and `GLOSSARY.md` does not define**, including Project, Classification, Project type, Tag, Stage, Custom field, Work area, Funding source, Manager, Proposal, Change and Data source (marked † in the system map). Should I draft definitions for you to correct?
Blocks: nothing yet; stories use these words and will cite the glossary.
Answer:

## By feature

Questions from a feature's interview are added here under the feature's slug.

### gis-data-sources

Raised by spec decision 40 (authoritative or two-way, per GIS subscription), 2026-11-23. The prototype does not show this setting yet: `workspace-settings/gis-subscriptions` always locks and `workspace-settings/gis-sync` always syncs both ways.

**Q-55 [cut]. Two-way: when the same field changes here and in the GIS system before a sync, which value stands?** The `gis-sync` prototype lets the latest change win. Alternatives: the GIS system wins; the person is asked.
Answer:

**Q-56 [cut]. Does the authoritative setting apply only to GIS subscriptions, or to every data source?** Spec decisions 22 to 29 also describe organization and project sources (a sheet, a tracker). Decision 27 still makes their fields read-only by hand.
Answer:

**Q-57 [cut]. Is the setting per subscription, or per field within a subscription?** As recorded it is per subscription.
Answer:

**Q-58 [detail]. A hand edit to a field a two-way subscription supplies: does it wait for publish review before it is sent to the GIS system, or go at once?** Spec decision 24 says workspace sources publish without review; that was written when their fields could not be hand-edited.
Answer:

**Q-59 [detail]. What does the person see when sending an edit back to the GIS system fails?**
Answer:

**Q-60 [detail]. The Import menu on the Projects index is hidden when the workspace is synced to a GIS source. Should that now apply only when the subscription is authoritative?**
Answer:

### project-updates — Import a report (build 1)

Raised by the harvest (`.scratch/project-updates/requirements/inventory.md`), 2026-11-23. "Spec #n" is a decision in `.scratch/project-updates/spec.md`.

**[cut]** changes which stories exist, so it is asked before the story map. **[detail]** only fills in a story; left open, that story is written and marked `needs-info`. "Suggest" is Claude's recommendation, not a decision.

#### What is in the feature

**Q-29 [cut]. What is explicitly not in build 1?** Candidates: several documents at once; a document covering several projects; an entry from My Projects; setting up a data source from this layout (spec #26); filling a funder's form back out. Confirm or add.
Partly answered (2026-11-23): setting up a data source from this layout is out. The other three were not marked out. Spec #20 already says one document per import and that a document covering several projects is later, so the stories follow the spec until this is confirmed. Still open: are several documents at once, a multi-project document, and an entry from My Projects really wanted in the first release?
Answer:

#### Where the prototype and the spec disagree

**Q-30 [detail]. Header entry.** Spec #8: an item in the "…" menu. Prototype: an always-visible icon in the breadcrumb row that folds into "…" under phone width. Suggest: the prototype.
Answer:

**Q-31 [detail]. Button label.** The measures card says "Import report"; everywhere else says "Import a report". Suggest: "Import a report".
Answer:

**Q-32 [detail]. Is every proposed value editable?** Spec #13 says yes. Timeline, County and contact changes can only be ticked or left out.
Answer:

**Q-33 [detail]. Does an unsure change arrive empty?** Spec #13: "never a pre-filled guess". A "Needs a decision" change arrives with one of its two readings already in the amount. Suggest: the spec; arrive empty with both readings offered.
Answer:

**Q-34 [detail]. How is a contact matched?** Spec #14: by email or name. The prototype's duplicate check is by email only, and a workspace match only changes a helper line. Related: is a matched contact linked to that person or stored as text, and is the contact's role free text or picked from a list?
Answer:

**Q-35 [detail]. An organization the person did not pick.** Spec #15: "listed as not added". The prototype leaves it out silently. Suggest: the spec.
Answer:

**Q-36 [detail]. Note label.** Spec #17: "note to the manager". Page: "Note for the reviewer (optional)". Also settles the word for the person who publishes.
Answer:

**Q-37 [detail]. Does every change row name its source?** Spec #5 and #31: every row, the same way. The prototype names a source only on imported rows, and a code comment argues that is deliberate ("only the exception names its source").
Answer:

**Q-38 [detail]. File types.** The file control accepts .xls; the page drop accepts .doc and .xls; the reader refuses both; the reader accepts .txt, which the control does not. What is the list?
Answer:

#### What the prototype cannot show

**Q-39 [detail]. Someone who can see the project but not edit it.** Are the three entry points hidden, and what does the page's address show them?
Answer:

**Q-40 [detail]. Reading state or edit state.** Is import offered while the project page is being read, or only after Edit is pressed?
Answer:

**Q-41 [detail]. What can fail while reading, and what does the person see for each?** A scanned or password-protected PDF, an empty file, a file over the limit, a timeout, the reading service down. Today: one generic "Couldn't read *name*".
Answer:

**Q-42 [detail]. Nothing to propose.** What does the check step show when the reading finds nothing, or only "Not used" lines?
Answer:

**Q-43 [detail]. A project with no performance measures, or no closed reporting period to file under.**
Answer:

**Q-44 [detail]. Failure on "Add N changes".** The record changed underneath, or the save fails part-way. Is an import all-or-nothing?
Answer:

**Q-45 [detail]. The kept document.** How long is it kept, can it be downloaded, who can delete it, is opening it logged? Is pasted text held to the same rules?
Answer:

**Q-46 [detail]. Is the reading itself kept?** The changes the person left out, and the "Not used" and "Skipped" lists. Nothing stores or shows them after Add.
Answer:

**Q-47 [detail]. Limits.** File size (20 MB shown), pages or rows, length of pasted text, length of the note, and what the person sees at each.
Answer:

**Q-48 [detail]. Two people at once.** Two people import the same report, or someone edits a field while another has the check step open. Which value stands, and is anyone told?
Answer:

**Q-49 [detail]. Notifications and the Updates feed.** Does adding an import notify the organization's managers, or only raise the unpublished-changes count? Does it appear in the Updates feed, and on Add or on publish?
Answer:

**Q-50 [detail]. A funding source already on the record with a different amount.** A change to the existing source, or "Already on file"? Today the new amount is lost.
Answer:

**Q-51 [detail]. Overwriting a hand edit.** Does the person see that the value being replaced was typed by hand, beyond "Was …"?
Answer:

**Q-52 [detail]. Sending documents to a model provider.** For every workspace, or must a workspace agree or be able to switch it off? The documents hold names, emails and budgets. If the answer is client-sensitive it goes in `docs/private/requirements/project-updates/`.
Answer:

#### The harvester's readings, to confirm

**Q-53 [detail]. An import is recorded with the person who added it and the day.** (RUL-55) Confirm.
Answer:

**Q-54 [detail]. Proposals are ordered in each section: ready first, then needing a decision, then no match.** (RUL-56; only the developer-machine reader sorts.) Confirm.
Answer:

#### Raised while recording the answers

**Q-61 [detail]. What does the one flagged state read as?** After Q-25 a change is ready or flagged. The prototype has four badges on changes that wait on the person: "Needs a decision", "No match", "Unsure", "Not in this workspace". Do the first three become one badge, and with what wording?
Answer:

**Q-63 [detail]. When a report names another project, do its changes arrive unticked?** The developer-machine reader does this. Added 2026-11-23 (builder's checklist): if they do, how is each marked? The developer-machine reader marks every such change "needs a decision", Key facts changes included, unless it counts another quantity. Stories: 15, 20.
Answer:

**Q-64 [detail]. Must the toast's Undo work by keyboard and assistive technology in the first release?** Undo sits only on the toast (Q-24), and the component's own note says a toast action is not reachable by keyboard. If yes, toast-only Undo needs a different construction.
Answer:

**Q-65 [detail]. Which Key facts fields count as "built-in" for an import?** Q-27 allows built-in fields and custom fields; stage is kept out (spec #9). Added 2026-11-23 (builder's checklist): beyond Timeline and County the project page holds three Key facts: project type, lead organization and estimated total cost.
Answer:

#### Raised while writing the stories

Raised by the gap pass that ends the write stage, 2026-11-23. Each was a gap a story hit that the prototype does not settle. Where the prototype does something, it is stated, so the answer can be "as the prototype". "Stories" names the stories that cite the question.

**Q-66 [detail]. The reading service: three things the developer-machine reader leaves open.** (a) How long may a reading take before the person is told it failed? The reader gives up after four minutes. (b) Does the service return the document as passages for every file type, so a Word file or spreadsheet can be shown beside the changes with the passage marked, and are those passages kept with the stored file? Today only the two sample documents mark a passage; a real PDF is shown in the browser's viewer, pasted text is shown with nothing marked, and any other real file shows "This file can't be shown here." with the quote. (c) Does the service keep a confidence of its own? Q-25 removed confidence from what the person sees, but the reader still asks the model for one and never lets a low-confidence figure arrive ticked (enabler 50). Stories: 02, 03, 04, 10, 31, 33, 40, 50.
Answer:

**Q-67 [detail]. Order of changes inside a section: where do the other states go?** Q-54 asks to confirm "ready, then needing a decision, then no match". Nothing places a change that is already on file, kept by a data source, unsure, or "Not in this workspace"; the page shows them wherever the reading returned them. The hand-ordered samples put the unsure change last and a change already on file wherever its line fell in the report. Stories: 04, 16, 17, 75.
Answer:

**Q-68 [detail]. Keyboard focus on the Import a report page.** (a) On a narrow screen, should focus move to the document when "Show source" opens it, and back to the change's "Show source" on "Back"? The review does this for its own document pane; this page moves nothing. (b) After "Add N changes" is stopped by an invalid change, should focus move to the first failing field? Today the change is scrolled into view and focus stays on the button. Stories: 05, 30, 65.
Answer:

**Q-69 [detail]. A file the control or the page should refuse.** (a) A file of a type not on the list, dropped onto the file control: the file picker hides other types, but a dropped one is held like any other, with no message, and fails only when it is read. Should the control refuse it, and with what words? (The list itself is Q-38.) (b) A file over 20 MB dropped on the project page: the drop is not checked against the limit. What does the person see? (c) A file dropped on the project page that cannot be carried to the Import a report page: the page opens on the choose step and says nothing. Should the person be told? Stories: 08, 10.
Answer:

**Q-70 [detail]. Handing a spatial file to Upload shapes: when, and how?** Q-26 put the hand-off in the first release and it is not built. Is the file passed when the person follows the "Upload shapes" link in the "That's a spatial file" box, or at once when the file is chosen? And what becomes of the file if the person does not follow the link? Stories: 11.
Answer:

**Q-71 [detail]. A Key facts value that does not fit its field.** The report names a value for a field the project has, but the field cannot hold it: a choice field with no such option, a number field given words, a Timeline that is not two years. In the first release, before the later format check (enabler 50), is the change proposed as read, flagged for the person, or listed under "Not used"? Only Timeline and County are built, and neither sample shows a misfit. Stories: 15, 50.
Answer:

**Q-72 [detail]. A field a GIS subscription supplies (spec #40), on the check step and on Undo.** Not built. (a) For a subscription that is not authoritative, does the change say anything about its source on the check step, for example that the value will be sent to the GIS system? (b) What does Undo of the import do to a change that was already sent back to the GIS system? Stories: 16, 41.
Answer:

**Q-73 [detail]. A contact the report names with no email.** Is it proposed at all? If so, how is it matched to a person and when is it "Already on file"? Today both tests on the check step use the email, so two contacts with no email would count as the same one, while the Contacts panel tells such contacts apart by name. No sample has one. Related: Q-34. Stories: 18.
Answer:

**Q-74 [detail]. "This report names another project": how is the name matched, and what if there are several?** (a) The developer-machine reader counts the report as about this project only when the two names are the same once case, spaces, punctuation and digits are ignored. Should an abbreviation, an older name or a project number also count? (b) The reader returns one project name per document. What does the warning say when a report names several other projects? No sample raises the warning. Related: Q-63. Stories: 20.
Answer:

**Q-75 [detail]. Undo in two cases the toast allows.** (a) A field the import set was then edited by hand, and the toast is still open: Undo puts the field back to its value from before the import, so the hand edit is lost. Is that right, or should the hand edit stand? (b) The import's changes were published while the toast was still open: is Undo still offered, and what does it do to values that are now public? Related: Q-64. Stories: 23, 41.
Answer:

**Q-76 [detail]. After a publish, what of an import still shows?** The prototype does not change these on publish; confirm or correct each. (a) A contact row and a funding source row keep "From *document name*". (b) "Total from all sources" stays for as long as the table holds a row an import added. (c) The import's row stays in the change history. (d) The note is no longer shown anywhere once none of the import's changes is waiting. (e) No screen leads from a published change to its document until the later story 29. Stories: 17, 18, 21, 22, 24.
Answer:

**Q-77 [detail]. Access to the kept document that is lost or fails.** (a) A person who could edit or publish the project when the import was added and no longer can: do they lose the document at once? (b) What happens to the documents of a project that is deleted? (c) What does a Manager see in the review when the document cannot be fetched? Today a file the browser no longer holds shows "This file can't be shown here." with the quote. Related: Q-39, Q-45. Stories: 03, 33.
Answer:

**Q-78 [detail]. If Q-33 follows the spec, how are two readings offered?** Spec #13 says a flagged change is never pre-filled. The prototype writes one reading in and states the other in a note (in the sample: 6 acres written in, "6, not 12" in the note). If the change is to arrive empty with both readings offered, how does the person choose: two buttons, a choice between the two figures, or typing the figure? Depends on Q-33. Stories: 14.
Answer:

**Q-79 [detail]. Partner organizations, the later story (Q-21).** Nothing is built. (a) Which section of the check step holds them? The four groups follow the project page's sections. (b) What is a partner organization change made of: the organization only, or also its part in the project, such as landowner? (c) For a partner the workspace does not hold, does the person pick an existing organization, as for a funding source? (d) When is a partner "Already on file"? (e) How is an added partner shown on the project page, and does it name its document? (f) How is a partner told from a funder or a contact's organization when one organization is named in two parts? Added 2026-11-23 (builder's checklist): (g) How is the partner's name matched to the workspace's organizations: by the rule for a funder (story 17, R8: letter for letter, ignoring case and outer spaces), and are connected organizations matched too? (h) Can the person change or pick the organization before adding, as for a funding source? Does a partner the workspace does not hold arrive flagged and unticked, with which badge and sentence, and can the organization be cleared once picked? (i) What does "Add N changes" save (the organization on the project, unpublished), what if the project already has that partner by then, and how do Undo (story 41), the review row's label and value (story 24) and the change history (story 22) treat it? (j) Which feature owns a project's partner organizations, and does the project page show them today? (k) Order inside the section, and the same partner named twice in one reading (Q-99). (l) What the reading service is told and returns for a partner (compare Q-89). (m) If (b) gives a partner a part in the project: free text, or a fixed list, and is "Organization" there a renameable noun in the sentence (Q-98)? Stories: 27.
Answer:

**Q-80 [detail]. A reading the person can leave and come back to, the later story (Q-23).** Nothing is built. (a) Where does the person find a waiting or finished reading: the Import a report page, the project page, a notice? (b) Are they told when it finishes or fails while they are away? (c) How many readings can wait for one project or one person, and can another person who can edit the project see or use a reading they did not start? (d) How long is a ready or failed reading kept, and what discards it? (e) Are "Already on file" and the difference from a total to date worked out again when the person returns? (f) Are ticks, edits and the note kept if the person leaves a ready reading before adding? Related: Q-41, Q-46, Q-48. Added 2026-11-23 (builder's checklist): (g) What ends a stored reading: "Add N changes", "Cancel" (story 35, R3 ends it today), "Read another", a time limit? Can a failed one be read again without choosing the file again? (h) A second "Read it" on the same project while one reading is in progress or ready: allowed, queued, or does it replace the first? The same document twice? (i) While the person is away the project changes in what it can take (a reporting period closes, a breakdown option is removed, a data source starts keeping a field), or the person loses the right to edit it: what does the ready reading show on return? (j) The document must be held from "Read it", not from "Add N changes": is it under enabler 03's access rules from then, and deleted when the reading is discarded? This changes enabler 03, R2 and bears on Q-85. (k) Does the page say that the person may leave, and how long may a reading nobody is waiting on run before it fails (Q-66 (a))? Stories: 28.
Answer:

**Q-81 [detail]. Opening the document from the change history, the later story (Q-26).** Nothing is built. (a) Where does the document open (beside the history, in its place, on a page of its own) and how is it closed? (b) What is shown for a file that cannot be shown? The review falls back on the selected change's quote, and a history row has no selected change. (c) With no change selected, does it open at its start? (d) Who can open the Change history sheet at all? If only people who can edit the project can, nobody else is ever offered the row. Related: Q-45. Added 2026-11-23 (builder's checklist): (e) What the control on the row is and reads: does the document's name in "N changes from *document name*" become it, and what does a row for pasted text offer? (f) Once the import's changes are published, does the row still open the document? With Q-76 (c) and (e) it would be the only way from a published change back to its document. (g) A kept document that cannot be fetched (Q-77 (c)). (h) On a narrow screen, where the document goes relative to the Change history sheet. (i) Whether the changes the import made, and each one's place in the document, can be reached from here, or the document is shown whole only. Stories: 29.
Answer:

**Q-82 [detail]. A figure in another unit than the measure's, in the first release.** Raised by the slice repair, 2026-11-23. Q-62 put unit conversion in a later release (story 26), and the user confirmed that the first release converts nothing, in the model or in code. (a) What does the first release do with a figure the report states in another unit, for example "3,960 feet" for a measure recorded in miles: propose the figure as written, flag the change with an empty amount for the person to fill, or list it under "Not used"? Spec #13 counts "a unit mismatch" among the unsure readings that are flagged and left to fill; nothing says whether that covers two known units of one kind. (b) Does the same hold for a total to date stated in another unit (story 13)? (c) The prototype's scripted samples arrive already converted: two of the sample crew log's six changes and two of the sample funder report's seven ready ones. The stories' sample counts ("6 ready to add", "7 ready to add") therefore assume a conversion the first release does not do. Should those scenarios be rewritten once (a) is answered, or should the samples change? (d) The sample paragraph shows "Converted: 35 people × 4 hours = 140 hours", a multiplication under the same label. Is that arithmetic the first release does and shows, and under what label? RUL-33 names adding lines together and unit conversion only. Related: Q-62, Q-33. Stories: 01, 02, 03, 04, 05, 06, 07, 08, 09, 13, 14, 15, 17, 18, 19, 21, 22, 23, 24, 26, 29, 30, 32, 35, 40, 41, 65, 75. The rows that wait on it are named in `.scratch/project-updates/requirements/fixtures.md`.
Answer:

**Q-83 [detail]. Two standing requirements with no written source.** Raised by the check stage, 2026-11-23. (a) Which accessibility standard, and which level of it, must every screen of this feature meet? No source read names one; the mobile foundation spec cites one criterion, for touch targets only. Story 23 is where it bites first (Q-64). (b) SR-6 in `standing-requirements.md` (a message about a problem is written next to the control it concerns and announced once) is the harvester's reading of one rule, RUL-52, which is about the file control. Is it a rule for every error state in the feature? The first part reaches past this feature; it is filed here because this feature's standing requirements raised it. Stories: all, through `standing-requirements.md`; cited by name in 09, 20, 30, 65 (2026-11-23: which messages are announced).
Answer:

**Q-84 [detail]. "Add N changes" pressed twice, and what the person sees while an import is saved.** Raised by the rewrite of story 01, 2026-11-23. In the prototype the save is instant, the button stays enabled until the page changes, and nothing stops a second press; a second press that got through would save the entries again. In a build the save takes time. (a) What does the person see between the press and the project page: the button disabled, a "saving" state, something else? (b) Must a second press, or a repeated request, be ignored so that one press makes one import? Related: Q-44. Stories: 01, 22.
Answer:

**Q-85 [detail]. A reading the person walks away from.** Raised by the rewrite of story 01, 2026-11-23. Q-23 settled that the person waits on the page and that leaving ends the reading. The prototype's page sends one request, waits for one answer, and sends nothing when it is left. (a) When the person leaves during a reading, must the service stop reading, or may it finish and throw the result away? (b) What becomes of the document that was sent: is it deleted at once, and is that true of every reading that is not followed by "Add N changes"? (c) If the connection drops while the page is still open, is that a failed reading like any other (Q-41)? Related: Q-52, Q-66. Stories: 01, 02, 03, 35.
Answer:

**Q-86 [detail]. The day an import is recorded with: which clock?** Raised by the rewrite of story 01, 2026-11-23. An import is recorded with the day alone, no time of day (the prototype stamps one fixed date on every import). (a) Whose time zone decides the day: the person's, the workspace's, or one fixed zone? (b) Is the time kept as well, even though only the day is shown? Related: Q-53. Stories: 22, 24.
Answer:

**Q-87 [detail]. An entry the record already holds, on "Add N changes".** Raised by the exemplar rewrite of story 01, 2026-11-23. In the prototype "Add N changes" does not look at the record: the "Already on file" check runs once, when the check step opens, and only decides whether a change arrives ticked (story 32). So the same report added twice saves every entry twice, and so does ticking a change that is "Already on file". (a) Must adding refuse, warn about or pass over an entry the record already holds for the same measure, reporting period, amount and answers, or is saving it again intended? (b) Is the check made again when the button is pressed, since the record may have changed while the check step was open? Related: Q-48, Q-50. Added 2026-11-23 (builder's checklist), for the other kinds of change: (c) a ticked "Already on file" Key facts field is set to the value it already has, and the import records and counts it as a change with the same value before and after, so the toast, the change history and the review count it; (d) a ticked "Already on file" contact is recorded and counted by the import and draws no row in Contacts, because the email is already there; (e) a ticked "Already on file" funding source leaves the table's row entered by hand as it is, and the import still counts a change that drew nothing. Should such a change be refused, passed over without being counted, or added as now? The same thing twice within one reading, or from two imports, is Q-99. Stories: 01, 15, 18, 32.
Answer:

**Q-88 [detail]. Running a UAT script: the recorded readings, and getting back to the start.** Raised by the exemplar rewrite of story 01, 2026-11-23. A model does not read a document the same way twice, so every scenario and UAT script runs against the recorded readings in `.scratch/project-updates/requirements/fixtures.md`. (a) Who provides the test environment that serves those recordings for the sample documents, and is it the one the client's testers use? (b) How does a tester return Deer Creek to its starting state after a script has added an import? The prototype is reset by clearing the browser's data. In a build, "Undo" exists only on the toast (story 23) and is gone once the toast is dismissed. No written source gives a procedure, so each story's Reset line says "not known". Stories: 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 30, 31, 32, 35, 36, 40, 41, 50, 65, 75. It bears on every UAT script in the feature.
Answer:

Raised by the revision of the stories, 2026-11-23 (five writers, one question each as they hit it; numbered afterwards).

**Q-89 [detail]. The reading service, for the kinds of change the developer-machine reader does not return.** What goes in and what comes back is recorded for performance measure figures and Key facts fields only (RUL-70). Funding sources, contacts and a change the reading is "unsure" of exist only in the scripted samples. (a) Is the service told anything about the project's funding sources and contacts, or the workspace's organizations and people, or does it return what the document names and leave every match to the check step? (b) What does it return for a funding source and for a contact? (c) Is "unsure" a fourth verdict the service returns, beside "counts what the measure asks", "supports more than one reading" and "counts something else", or is it worked out from those three? Related: Q-52, Q-66. Stories: 02, 14, 17, 18, 75.
Answer:

**Q-90 [detail]. May a breakdown answer arrive inferred?** The rule as harvested (RUL-41): the reading answers a breakdown question only when the document states the answer; otherwise the question arrives unanswered for the person to set or leave. Two rows of the recorded readings do otherwise: the crew log's row C5 and the pasted paragraph's row P3 arrive answered "Planting" with the note "“Planting” is inferred.", for a volunteer workday whose text names no activity. Which is the rule: unanswered unless the document states an option, or the reading may infer an answer and say so in the note? The answer also decides rows C5 and P3 of `.scratch/project-updates/requirements/fixtures.md`. Stories: 07.
Answer:

**Q-91 [detail]. A total to date that is lower than the record's.** A figure the report states as a total to date is filed as the difference from what the record holds. The sample funder report says 12,400 plants to date. Once the record holds 12,577, the prototype shows "12,400 to date − 12,577 on record = 0" and marks the change "Already on file". That line is false arithmetic, and the report and the record disagree. Should such a change be flagged for the person instead of treated as nothing left, and what should its arithmetic line say? Stories: 13.
Answer:

**Q-92 [detail]. A flagged change that ticked itself, then was emptied.** A change that arrives with an empty amount ticks itself when the person types a figure above zero. In the prototype, clearing that figure afterwards leaves the change ticked, and "Add N changes" is then stopped by the check on ticked changes (story 30). Should clearing the figure untick the change again? Stories: 14.
Answer:

**Q-93 [detail]. Can the note for the reviewer be changed or removed once the import is added?** In the prototype nothing does it: the text area exists only on the check step, and the one thing that removes a note is "Undo", which takes the whole import back and is gone with the toast (Q-24). Is that intended, or should the note be editable until the import's changes are published, and if so from where? Stories: 21.
Answer:

**Q-94 [detail]. In the change history, where does an import's row sit among the other rows?** Imports' rows are in the order they were added, the latest first. The prototype lists them above every other row of the log, because it lays them over a seeded log, so a hand edit made after an import shows below it. Is an import's row placed by its day among the hand edits, or do imports always come first? Related: Q-86 (two imports on one day can be ordered only if the time is kept). Stories: 22, 23.
Answer:

**Q-95 [detail]. A converted figure under 0.01 (later release).** Unit conversion (enabler 26, `later`) rounds a converted figure to two decimals and keeps a result under 0.01 to two significant figures: 12 feet is 0.0023 miles. But an amount is shown with at most two decimals (story 01), which would show it as 0. How is such an amount shown on the check step and saved on the record: with the extra decimals, or rounded to two? If it rounds to 0, is the change still proposed? Added 2026-11-23 (builder's checklist): the arithmetic line has the same problem as the amount. The reader writes both figures of "Converted: …" with at most two decimals, so 12 feet for a measure in miles reads "Converted: 12 feet = 0 miles" while the amount it proposes is 0.0023. Whatever is decided for the amount should be decided for the line. The reader also rounds a figure that needed no conversion to two decimals (3.456 acres for a measure in acres arrives as 3.46); whether the first release rounds a figure as written is Q-118 (b). Stories: 26.
Answer:

**Q-96 [detail]. When does a message from the check on "Add N changes" go?** When a ticked change is invalid, "Add N changes" adds nothing and each failing field shows a message. In the prototype a message stays on its field until the button is pressed again, even after the person has put the field right; every message is then cleared and worked out afresh. Is that the requirement, or should a message go as soon as its field is corrected? Related: Q-68. Added 2026-11-23 (builder's checklist): and when its change is unticked? The prototype clears messages only on changes that are ticked at the press, so a failing change the person then unticks keeps its message for as long as the check step is open. The same holds for the three messages on a funding source (story 65). The messages are not announced to assistive technology (Q-83). Stories: 30, 65.
Answer:

**Q-97 [detail]. Two imports that each add an entry for the same performance measure and reporting period: one row in the review, or two?** `publish-review` owns the rule that two imports of one field are one row, and that rule speaks of fields. An entry is not a field: the sample crew log's row C3 and the sample funder report's row F3 are both "Acres of invasive vegetation removed · 2025", and each adds its own entry. Does the review show two rows, each with its own "From *document name*" button, or one row as for two imports of one field, whose button then names and opens the later import's document? Stories: 24, 33, 51, 80. It bears on story 24, which draws the row.
Answer:

#### Raised by the builder's checklist

Raised by the builder's checklist pass over all 44 stories, 2026-11-23 (five writers; numbered and merged by the closing pass). Each is something a builder would have to ask: the prototype shows the clean case once and either does nothing off it, or does something by accident. Where the prototype does something, it is stated, so the answer can be "as the prototype". The first two are asked once for the whole feature. "Stories" names the stories that cite the question.

**Q-98 [detail]. Asked once for the feature: do labels and sentences that contain a renameable noun take the workspace's word?** A workspace can rename Project, Organization, Classification, Performance measure, Funding source, Expenditure, Milestone, Work area and Contact, and SR-4 (itself only inferred) says a label naming one shows the workspace's word. The prototype marks two labels (the "Projects" breadcrumb and the "Performance measures" card title, story 01) and writes everything else as fixed text (RUL-77). The cases: (a) the check step's section headings "Performance measures", "Funding sources" and "Contacts" (story 04); (b) the labels "Funding source" on a funding source change and "Contact · `<role>`" on a contact change, the field "Organization", and the row label "Contact" on the project page (stories 17, 18, 75); (c) sentences: "“`<name>`” isn't an organization here. Pick one, or leave this out." (story 75), the warning's title "This report names another project" (story 20), and the row "Total from all sources" (story 17); (d) lines the reading itself words under "Not used", such as "This project has no Watershed field." and "Not a contact or a funder." (story 19): is the reading service told the workspace's words, or are those lines left as written? One answer is wanted for labels, one for sentences, one for what the reading writes. Related: Q-83, Q-141 (the label "Funding source" on a review row). Stories: 04, 17, 18, 19, 20, 75.
Answer:

**Q-99 [detail]. Asked once for the feature: the same thing twice. Can two identical entries both appear in a list, and what happens when one input holds the same thing twice?** Each change of a reading is compared with the record alone, never with the other changes of the same reading, and "Add N changes" does not look at the record at all. So in the prototype: (a) two identical performance measure entries in one reading (the same measure, reporting period, amount and answers, as when a report states a figure in two places) are both listed, both ticked, and adding saves two entries, so the measure's total counts the figure twice (stories 01, 04, 32); (b) one period's amount and a total to date for the same measure ("1,850 planted this year; 12,400 to date") are both proposed, and adding both puts 1,850 and 1,673 on the record; two totals to date for one measure are each filed as the full difference (story 13); (c) two values for one Key facts field are both proposed, both are added, and the one later in the list stands (story 15); (d) two contacts with one email are both proposed and added, and the project page shows one row (story 18); (e) two funding sources with the same name and organization in one reading (two awards of one grant) are both proposed, ticked, and after adding the project page keeps one row, in the first one's place, with the later amount, while the import counts two changes in its toast, its change history row and the review (story 17); (f) nothing looks at the record on "Add N changes", so the same happens when two imports add the same new funding source, or when the person edits a change into a match; and after "Undo" of one of two imports that added the same funding source, the row stays with the other import's amount (stories 41, 17); (g) a line the reading returns twice under "Not used" or "Skipped" is shown twice (story 19, with Q-129). For each: are both listed, is the second flagged, or are they folded into one (two rows, one row with the amounts added)? Adding a change the record already holds is Q-87, which now covers every kind of change. Related: Q-50, Q-87. Stories: 01, 04, 13, 15, 17, 18, 19, 32, 41.
Answer:

**Q-100 [detail]. The file control on the choose step: a held file taken out again, and several files dropped together.** Two things the prototype does only because of the shared file control it uses. (a) The control lists the held file with its name and size and a "Remove `<name>`" button; removing it leaves the control empty, and "Read it" then says "Choose a file, or switch to Paste text." Is taking a held file out again required, and is the size shown? (b) When several files are dropped on the control together, it holds the first one that is under the size limit and drops the others without a word (a too-large one is named in the size message). Should the person be told that only one was taken, or should the drop be refused? Related: Q-29 (several documents in one import), Q-69. Stories: 01. It bears on story 10 (a file taken out leaves a message behind; see Q-104).
Answer:

**Q-101 [detail]. Does each imported entry get a row in the performance measures' own change log?** In the prototype every entry an import saves is written to the performance measures' change log exactly as a hand entry is (measure, reporting period, the new amount), and "Undo" writes a removal row. That log names no document, and it is separate from the project's change history, where an import is one row (story 22). Spec #5 says every change carries its source and the change log shows it. (a) Must each imported entry appear in the performance measures' change log? (b) If so, does the row name the document, and does the person's name on it match the import's? (c) Does "Undo" leave two rows there (added, removed) or none? Stories: 01. It bears on stories 22 and 23.
Answer:

**Q-102 [detail]. A file dropped on the project page, once the Import a report page is back on the choose step.** A dropped file is read at once (story 08). The page can then return to the choose step in two ways: its reading fails (story 10), or the person presses "Read another" (story 35). For a file chosen in the file control, the control still shows the file and "Read it" reads it again. For a dropped file the prototype keeps the file and reads it again on "Read it", but the file control shows no file, so the person presses "Read it" on what looks like an empty control. Should the control show the dropped file as if it had been chosen there (so it can be seen, replaced and read again), or should the dropped file be let go so the choose step is truly empty? Stories: 08, 35. It bears on story 10, R4 (the file is still held after a failed reading).
Answer:

**Q-103 [detail]. A file dropped on the project page that Import a report does not read** (an image, a spatial file). The prototype starts no import, which is decided. It also does nothing to stop the browser, and a browser given a dropped file it was not stopped from taking usually opens the file in place of the project page or in a new tab. So story 08 cannot say "the project page stays as it was". Must the project page swallow such a drop so nothing happens, say something ("That file can't be read as a report"), or leave it to the browser? Related: Q-69. Stories: 08.
Answer:

**Q-104 [detail]. The messages under the file control: when does each go, and can two show at once?** The choose step has three: "Choose a file, or switch to Paste text." and "Couldn't read `<name>`. `<reason>`" are the page's; "File exceed 20 MB limit: `<name>`" is the shared file control's own. In the prototype: (a) choosing a too-large file while another file is held leaves the held file in place, so "Read it" reads the earlier file while the size message names the later one; (b) the size message can show together with either of the page's messages, on two lines; (c) the size message stays until the control is next given a file, so it is still there after a reading and "Read another"; (d) removing the held file from the control removes neither kind of message, so "Couldn't read report.pdf." can sit under an empty control. What is the rule: one message at a time, and which wins; does a too-large file put out the file already held; and does every message go when the control's content changes? Related: Q-47, Q-83, Q-96 (the same question for the messages on "Add N changes"), Q-108. Stories: 10.
Answer:

**Q-105 [detail]. A reading of pasted text that fails: what is shown, and where?** Story 10 says what a failed reading of a file shows: back on the choose step, "Couldn't read `<file name>`." and the reason, under the file control. Pasted text has no file name and no file control in view. The prototype builds "Couldn't read your report." with the reason and writes it under the file control, which is hidden while "Paste text" is chosen, so the person sees the choose step with their text and no message at all; only the announcement to assistive technology is made. What is shown, in what words, and where (by the text area, as "Paste the report text first." is)? The pasted text is still in the text area and "Read it" can be pressed again; confirm. Related: Q-41. Stories: 09, 10.
Answer:

**Q-106 [detail]. Handing a spatial file to Upload shapes: what is handed, and what if it is not taken?** Import a report calls six endings spatial (.shp, .zip, .geojson, .kml, .kmz, .gpkg) and its file control refuses anything over 20 MB. Upload shapes, as prototyped by `work-areas`, takes a .zip only (a zipped shapefile or geodatabase), up to 50 MB. (a) Is a .geojson, .kml, .kmz, .gpkg or bare .shp handed over although Upload shapes would refuse it, or does the box say something else for those? (b) A spatial .zip between 20 and 50 MB is refused by Import a report for its size before it is seen as spatial, though Upload shapes would take it: which limit applies to a file that is only passing through? (c) When Upload shapes refuses the handed file, where is the person told: there, or back on Import a report? (d) After Upload shapes, is the person on the project page, or returned to Import a report? (e) Every .zip counts as spatial whatever it holds, so a zipped report is turned away too: intended? Related: Q-70 (when the file is passed, and what becomes of it if the link is not followed). Stories: 11.
Answer:

**Q-107 [detail]. The "That's a spatial file" box while "Paste text" is chosen.** With a spatial file held, the person can switch to "Paste text" and read pasted text; the held file is ignored, which is decided (story 09, R4). In the prototype the box stays in view above the text area, because it sits outside the part of the page the switch hides. Should the box be hidden with the file control and come back when the person returns to "File", or stay? Stories: 11. It bears on story 09.
Answer:

**Q-108 [detail]. "Paste the report text first." when the person types, or switches away and back.** Switching between "File" and "Paste text" removes the messages under the file control for good. The text area's message is only hidden with the text area: switch to "File" and back, and it is there again, until "Read it" is pressed with text. It also stays while the person types. Is the message cleared for good on a switch (as the file control's are), and should it go as soon as text is typed? The prototype does not announce this message at all. Related: Q-83, Q-96, Q-104. Stories: 09.
Answer:

**Q-109 [detail]. When is the right to edit checked, once the Import a report page is open?** Story 12 says a person who cannot edit the project is offered no entry point and cannot open the page. The prototype checks nothing, and no source says what happens to a person who could edit the project when they opened the page and cannot when they press "Read it" or "Add N changes" (their role changed, the project's lead organization changed, a shared project was withdrawn). (a) Is the right checked again on "Read it" (before a document is sent to be read) and on "Add N changes" (before anything is saved)? (b) If it is gone, what does the person see, and is the reading discarded? (c) Does the same answer hold for someone with no account who opens the address: sign-in first, then the page? Related: Q-39, Q-48, Q-77. Stories: 12. It bears on stories 01 and 02 (the reading and the save).
Answer:

**Q-110 [detail]. The tally after the person ticks and unticks.** The prototype's four parts are: "ready to add" = every ticked change; "need you" = flagged changes that are unticked; "already on file" = every change the record holds, ticked or not; "kept by a data source". Four things follow that nobody decided. (a) A ready change the person unticks is counted in no part, so the parts no longer add up to the changes listed, and with everything unticked the line is empty (the crew log with all six unticked shows nothing above the changes). Should an unticked ready change be counted somewhere, and what does the line read when every part is zero? (b) A change that is "Already on file" and ticked is counted twice, under "ready to add" and under "already on file". Intended? (c) A flagged change ticked by hand moves from "need you" to "ready to add" although its amount may still be empty and its badge still shows (the badge is Q-122). Intended? (d) The wording for a count of one: the prototype writes "1 need you". Related: the prototype's known double count of a kept field whose value equals the record's. Stories: 04, 06.
Answer:

**Q-111 [detail]. Selecting a change by keyboard, and telling assistive technology.** A change is selected by a click anywhere on it or by keyboard focus entering one of its controls; the document pane then moves. (a) A change with no control cannot take focus: a field kept by a data source has no checkbox, and on a wide screen no "Show source", so a keyboard user can never see where it was read from. The same is true of every change in the walking skeleton before stories 06 and 07 add a checkbox and fields. How is such a change selected by keyboard? (b) The selected change is shown by a background tint alone, and nothing announces that the selection or the document moved. Must the selection be exposed to assistive technology, and how? Related: Q-68, Q-83. Stories: 04.
Answer:

**Q-112 [detail]. A narrow screen while the document is showing on the check step.** On a screen 64rem or narrower "Show source" puts the document in place of the changes, and the page's actions stay in the top bar. (a) "Add N changes" can be pressed there. If story 30's check stops it, the messages are on fields that are hidden and the change brought "into view" is hidden too, so the person presses and nothing visible happens. Should the action be unavailable while the document shows, or should a stopped import return the person to the changes at the first failing one? (b) If the window is widened past 64rem while the document shows, both columns appear; the prototype then still treats the document as open, so narrowing the window again shows the document and not the changes. Should widening close it? Related: Q-68. Stories: 05, 30.
Answer:

**Q-113 [detail]. What may be typed into an amount: a performance measure change's "Amount", and a funding source's "Secured ($)" and "Grant or program".** Both amount fields take any text and arrive as plain digits (1850; 48000). On "Add N changes" commas, spaces and a "$" are dropped and the rest must be a number above zero. (a) Decimals of a performance measure amount: a measure has a setting for decimal places (whole numbers, 1, 2 or 3 places), and the import ignores it, so 1850.5 plants is accepted and saved as typed. Must the amount be held to the measure's decimal places, and is a figure with more rounded or refused, with what message? (b) Decimals of a funding source amount: the prototype accepts and saves them as typed, although every screen that shows the saved amount rounds to whole dollars (the Funding sources row, the import's recorded value) while "Total from all sources" adds the unrounded amounts. Whole dollars only, or cents kept; if whole, is 12500.50 rounded or refused? (c) Is there an upper limit on either amount, and a longest "Grant or program"? (d) Do the fields show thousands separators, on arrival and as typed? Today neither does; separators appear only in the imported change's value and in the arithmetic line. (e) The prototype also drops a "$" from a performance measure amount and reads "1e3" as 1000; presumably neither is wanted. Related: Q-47, Q-123. Stories: 07, 17, 30, 65.
Answer:

**Q-114 [detail]. The reporting period of a performance measure change, in two cases.** (a) The reading proposes a period the project does not offer (an open period, or a year the project has none for). Enabler 02 says the reading must not, and the check that would catch it is enabler 50, `later`. In the first release the prototype shows "Reporting period" empty, checks nothing, and saves the entry under the period the reading named. What should the change show, and should "Add N changes" stop on it ("Pick a reporting period.")? (b) When the person picks another period, the change's label keeps the one it arrived with ("… · 2025" over a field holding 2024), while the entry and the import's record use the one picked. Should the label follow? Related: Q-43. Stories: 07, 30.
Answer:

**Q-115 [detail]. A breakdown answer, in two cases.** (a) Once a breakdown choice holds an answer, the person can pick another but cannot set it back to unanswered, only because the select the prototype uses has no empty choice. A breakdown answer is not required, and the reading may have answered wrongly or by inference (Q-90). Should each choice offer a way back to unanswered? (b) The reading returns an answer that is not one of the question's options (an option since retired, or a wording of its own). Enabler 50 drops such an answer, `later` (Q-149 asks whether the person is told). In the first release the prototype shows the choice empty and still saves the answer. Should it arrive unanswered? Stories: 07.
Answer:

**Q-116 [detail]. What counts as "changed from the document's figure" and "filled in after arriving empty", in cases the prototype settles by accident.** (a) A change the report supports two readings of arrives with one written in (6 acres) and the other in its note (12). The person types 12: recorded as changed from the document's figure, though 12 is the document's too. Right? (b) A funding source whose name the person changed only in capitals is recorded as changed. Right? (c) A change that arrived empty which the person first ticked by hand and then typed a figure into is recorded as neither filled in nor changed, because "filled in" is set only when the typing does the ticking. Should any figure typed into a change that arrived empty count as filled in? (d) A total to date with nothing left, typed into: asked as Q-121 (a). The answers reach `publish-review`, build 2, which words the two markers. Related: Q-33, Q-92. Stories: 36.
Answer:

**Q-117 [detail]. A change that carries no page and points at no passage: what does the document pane show?** Every change has a quote; the page and the passage are optional. The same pane is used on the check step (story 31) and beside the review (story 33). The rule written in the code is that with nothing to point at the document shows from its start, and that is what happens when the document is first opened from such a row in the review. But when the pane is already showing another change's place, selecting or pressing a change with no place leaves it there: a PDF stays on the earlier change's page, a document held as passages loses its mark and does not move, and nothing says the place is not this change's. (a) What should the pane show: the top of the document, a line saying the place is not known, the quote? (b) Should it go back to the start when moved to such a change, on both screens? (c) A PDF the person has scrolled away from does not return when they select another change read from the page the pane last opened at; should selecting always bring the place back, as it does for passages? Depends on Q-66 (b) for how often a change has no place. Stories: 31, 33.
Answer:

**Q-118 [detail]. Arithmetic the first release does, and how it is shown.** (a) Adding lines is the one calculation left in the first release. The developer-machine reader returns the sum as a line ("3.5 + 2 = 5.5 ac"), which the page would print under the label "Converted:"; the recorded crew log row C1 (rows 4 and 6 added to 5.5) shows no arithmetic line at all. Is the sum shown to the person, and under what label? Q-82 (d) asks the same of the pasted paragraph's multiplication. (b) The reader rounds every amount to two decimals, converted or not (3.456 acres for a measure in acres arrives as 3.46). Is that a requirement of the first release, and does it hold when the measure allows three decimal places? Related: Q-82, Q-95, Q-113. Stories: 02, 04.
Answer:

**Q-119 [detail]. Which layout does a screen exactly 64rem wide get?** The Import a report page goes to one column at `max-width: 64rem`, as the mobile foundation spec writes its tablet gate, so exactly 64rem is narrow. The review's document pane uses `min-width: 64rem`, so there exactly 64rem is wide. Stories 04, 05 and 31 follow the page's code ("wider than 64rem" is two columns), and story 80 follows the review's ("64rem wide or more" is two columns). Is the boundary inclusive on the narrow side everywhere? Stories: 05. It also decides the wording of story 04, R1 and story 80, R1 and R2.
Answer:

**Q-120 [detail]. What is a total to date compared with?** The prototype subtracts the measure's whole reported figure: every entry, in every reporting period, open ones included. (a) All seven sample measures add up. For a measure whose values do not add up (the project page shows its latest entry, not a sum), is a total to date compared with that latest figure, proposed as it stands, or flagged? (b) A report dated September 2025 states a total as of then. If the record already holds entries for a later period, the difference is too small. Are only entries up to the change's reporting period counted? Related: Q-91. Stories: 13.
Answer:

**Q-121 [detail]. A total to date after the person acts on it.** (a) A change with nothing left arrives "Already on file" with an empty amount. In the prototype, typing a figure into it ticks it and records it as "filled in after arriving empty", exactly as for a flagged change (story 14, R6; story 36, R5), though the reading was not unsure of anything. Should a typed figure tick it, and is it recorded as filled in? (b) The arithmetic line is written once. After the person changes the amount of a change filed as a difference, the line still reads "12,400 to date − 10,727 on record = 1,673" beside another figure. Does it stay, go, or say that the figure was changed? Related: Q-116. Stories: 13.
Answer:

**Q-122 [detail]. A flagged change the person has dealt with: do the badge and the reason go?** In the prototype the badge ("Needs a decision", "No match", "Not in this workspace"), the reason or sentence and the note stay on a flagged change after the person has dealt with it, for as long as the check step is open. (a) A flagged performance measure change whose figure the person filled, or which they ticked: do the badge and the reason go once it is ticked, and do they come back if it is unticked? (b) A funding source flagged "Not in this workspace" once the person has picked an organization: do the badge and the sentence "“`<name>`” isn't an organization here. Pick one, or leave this out." go? In the prototype a change unticked after the pick is counted under "need you" again although it has its organization, and picking another organization ticks it again. Related: Q-61, Q-110 (c). Stories: 14, 65, 75.
Answer:

**Q-123 [detail]. Which typed figures tick an empty flagged change?** The tick reads the figure with commas removed, so "1,000" ticks and "1 000" or "$40" does not; "Add N changes" removes commas, spaces and a dollar sign, so it accepts all three. Should both read a figure the same way? Related: Q-92, Q-113. Stories: 14.
Answer:

**Q-124 [detail]. How exactly is a Key facts value compared with the record's?** The prototype compares the two texts letter for letter, so "el dorado" or "El Dorado County" against "El Dorado" is a ready change that replaces the value, while a funding source's name and a contact's email are matched ignoring capitals and outer spaces. Should a value that differs only in capitals or spacing be "Already on file"? For a choice field or a custom field of another type, is the comparison made on the option, the number or the date, not the text? Related: Q-71. Stories: 15.
Answer:

**Q-125 [detail]. A Timeline when the report states one year.** A Timeline change sets the start year and the completion year together. The sample funder report says only "Completion: September 2025", and the recorded reading proposes 2023–2025: the start year is the record's. Nothing says who fills in the missing year. The page tells the developer-machine reader the field's current value, but the reader does not pass it to the model. Is the missing year always the record's, and is that done by the reading service or in code afterwards? If the record has no Timeline yet, is a one-year Timeline proposed at all? Stories: 15.
Answer:

**Q-126 [detail]. What a change kept by a data source shows.** (a) When the value read differs from the record's, the prototype shows "Was `<the record's value>`" beside it, which reads as if the value were about to be replaced; nothing will be. Is "Was …" shown on a kept change, or other words (for example the record's value named as the source's)? (b) "Change it there." is plain text. Should "there" lead somewhere (the source's settings, the GIS system), and for whom, since a Contributor may not be able to open either? (c) When every change of a reading is kept, no change has a checkbox and the commit action reads "Nothing ticked", disabled. Are those the right words when there is nothing to tick? (d) If Q-71 or Q-63 ever makes a Key facts change flagged, does kept still win, with no flag badge? The prototype would draw both badges. Stories: 16.
Answer:

**Q-127 [detail]. What `gis-data-sources` answers, for a field kept by a data source.** The prototype reads one workspace-wide setting and the first GIS subscription, so none of these arise in it. (a) Can two sources supply the same field of one project, one authoritative and one not? If so which wins, and which is named in "Kept by `<source name>`"? Story 16 assumes one answer per field. (b) Can a data source supply a custom field? The story treats a custom field like a built-in one. (c) If the answer is not known when the check step opens (the feature is slow or down), is the change proposed as ordinary, held back, or is the reading stopped? (d) Kept is worked out when the check step opens. If the source becomes authoritative, or starts supplying the field, before "Add N changes" is pressed, must adding refuse the change? In the prototype it is added. Related: Q-48, Q-56, Q-57. Stories: 16.
Answer:

**Q-128 [detail]. Contacts the reading returns incomplete, and a contact that matches two people.** (a) With no role, the check step's label reads "Contact · " in the prototype, with a trailing separator, while the project page labels the row "Contact". Is the check step's label "Contact" alone? (b) With no organization, the first line reads "`<name>`, " with a trailing comma; the project page drops the organization line. What does the check step show? (c) "Matches `<name>` in this workspace." names the first person in the workspace's list whose email or name matches. When the email is one person's and the name another's, or two people share the name, which is named, and is a name-only match worth saying at all? Related: Q-34, Q-73. Stories: 18.
Answer:

**Q-129 [detail]. What "Not used" and "Skipped" must hold.** (a) Story 19 says nothing the report states is silently dropped, but the developer-machine reader asks the model to keep "Not used" to "the notable ones". Is the list every quantity, attribute and party the import did not use, or a selection, and if a selection, what is the person told? (b) The reader asks for a reason "in a few words" with each skipped item, and the budget table has one; the crew log's recorded reading skips "Row 14, “TOTAL”." with none. Must every skipped item carry a reason, and what besides a budget table and a total row belongs there? (c) Several skipped items are run together in one "Skipped:" line. Is one line right for many items? A line returned twice is asked in Q-99 (g). Stories: 19.
Answer:

**Q-130 [detail]. After adding the changes of a report that names another project, is anything recorded?** The warning exists only on the check step. Nothing is kept with the import, so the change history, the review and the note show no sign that the document was about another project, and the Manager who publishes is not told. Should the import record it, and should the review (stories 24, 21) show it? Related: Q-63, Q-74. Stories: 20. Stories 24 and 22 lean on the answer.
Answer:

**Q-131 [detail]. Which organizations does "Organization" on a funding source change offer and match against, and in what order?** The prototype uses all 38 of the sample workspace, whatever their visibility and whichever the person belongs to, in the directory's order (lead organizations A to Z, then funders A to Z, then the rest), with no typing to find one, no empty choice, and no way to clear a pick; the sample has no connected organization. (a) Are connected organizations offered and matched like the workspace's own? (b) Is any organization left out? (c) In what order, and can the person type to find one? (d) Can a picked organization be cleared? Stories: 17, 75.
Answer:

**Q-132 [detail]. A funding source the report names with no organization, or with no amount.** No recording has one. Is it proposed? With no organization, is it "Not in this workspace" (the sentence would read "“” isn't an organization here") or flagged in other words? With no amount, does it arrive flagged and empty like an unsure figure (story 14)? Related: Q-33, Q-89. Stories: 17, 75.
Answer:

**Q-133 [detail]. How a funding source's name and organization are matched: two rules nobody wrote down.** Story 17 states them as R7 and R8 awaiting this answer. (a) Names match letter for letter, ignoring upper and lower case and spaces at either end; "CA Watershed Restoration Board" does not match "California Watershed Restoration Board", so a report that abbreviates a funder is flagged "Not in this workspace" and an abbreviated grant is not "Already on file". Is exact matching the rule, or should a near match be offered (and how)? (b) Where two of the workspace's organizations differ only in capitals, the first in the list is taken. Can that occur? (c) "Already on file" is worked out once, when the check step opens: after the person edits the name or picks another organization, the badge neither appears nor goes. Confirm, or should it follow the edit? Q-87 and Q-48 ask whether the check is made again on "Add N changes". Stories: 17.
Answer:

**Q-134 [detail]. Can a project's record hold a funding source whose organization the workspace does not hold?** (The organization was removed or renamed after the funding source was entered, or it is a connected organization's.) In the sample it cannot: every funding source is built from the organization directory. The prototype's code would show such a change as "Already on file" only, with no "Not in this workspace" badge or message. If the case can occur, is that the rule? If an organization can be renamed, matching by name alone (Q-133) also stops finding it. Related: Q-16 (nobody owns the funding source's lifecycle). Stories: 17.
Answer:

**Q-135 [cut]. Correcting by hand what an import added.** Story 23, R6 (interview Q-24) says that once the toast is gone "each thing it added is corrected by hand on the project page". In the prototype a person can correct or clear a performance measure figure and edit a Key facts field on the project page, but the Funding sources table has no way to edit or remove a row ("Add source" is not wired), and Contacts offers nothing to edit or remove an imported contact ("Add contact" only). (a) Can a person edit and remove a funding source and a contact an import added, as any other? Which feature owns that (Q-16)? (b) If an imported row is edited by hand, does it keep "From `<document name>`"? (c) Until that exists, is toast-only "Undo" still acceptable for an import that added a funding source or a contact? Marked [cut] because the answer can add a story, or move funding sources and contacts out of the first release. Related: Q-64, Q-88 (a tester cannot get back to the start either). Stories: 17, 23. It bears on story 18.
Answer:

**Q-136 [detail]. Who may read the document's name?** Enabler 03, R5 (from spec #19) says nobody but the people who can edit or publish the project receives anything of the document, "not its content and not its name". But the name is written in the change history ("6 changes from deer-creek-crew-log-2025.xlsx", story 22), under a funding source and a contact on the project page ("From …", stories 17 and 18) and in the review (story 24), and the prototype keeps those lines after a publish (Q-76). (a) Does a Viewer, or anyone who can see the project page or open its change history without being able to edit or publish, see the name? (b) After a publish, does the "From …" line reach the public page? (c) If the name must be hidden from them, what do they see in its place: the row without the line, "From a document", nothing? Related: Q-39, Q-76 (a), Q-81 (d). Stories: 03, 17, 22. It bears on stories 18 and 24.
Answer:

**Q-137 [detail]. "Undo" when what the import added has changed since, or cannot all be taken back.** Q-75 (a) asks this for a Key facts field edited by hand. The same toast allows: (a) a performance measure figure the import added was then corrected by hand: in the prototype the correction replaces the entries for that measure, reporting period and answer with one new entry, so "Undo" no longer finds the import's entry and the corrected figure stays whole, the imported amount still in it (the opposite of the Key facts case, where the hand edit is lost); (b) an entry the import added was already removed by hand: the prototype passes over it; in both cases the toast still says "`<N>` changes removed" with the import's full count; (c) the same for a funding source or a contact, if they can be edited (Q-135); (d) the import was already taken back from another window: the prototype closes the toast and says nothing; (e) part of the "Undo" fails: all or nothing, and what is the person told (Q-44 asks this for adding)? An answer would take story 23 past eight scenarios. Stories: 23, 41.
Answer:

**Q-138 [detail]. Two imports set the same Key facts field and both are taken back, the earlier first** (possible only while both toasts are open, in two windows). The earlier import's "Undo" leaves the later import's value, as story 41, R3 says. The later import's "Undo" then puts back the value it found, which is the earlier import's value, although that import is gone; the field does not return to what it held before either import. Should the field return to the value before the earliest import that is no longer there? Story 15, R7 and Q-48 cover which value stands while both exist. Stories: 41.
Answer:

**Q-139 [detail]. Pasted text as a kept document: two details.** (a) Every import from pasted text is named "pasted text", so two such imports on one project read alike in the change history, on review rows and under notes; only the day and the person tell them apart. Should a pasted document carry something of its own (its first words, the day)? (b) The prototype keeps the text cut into paragraphs at blank lines, drops the spaces around each paragraph and any extra blank lines, and keeps single line breaks inside a paragraph; it does not keep the text exactly as typed. Is the paragraph cut the rule, and must the original text be kept unchanged beside it? Related: Q-45, Q-66 (b), Q-144. Stories: 40.
Answer:

**Q-140 [detail]. An import whose document cannot be kept.** In the prototype the entries are saved first, then the file, then the import's record; when the browser cannot keep the file the import is recorded without it and nothing is said, so its changes name a document nobody can open. In a build: is an import refused when its document cannot be kept (changes and document all or nothing), or added with a warning? Related: Q-44 (a save that fails part-way), Q-77 (c) (what a Manager sees when the document cannot be fetched). Stories: 03.
Answer:

**Q-141 [detail]. In the review, should a change read the same whether a person typed it or an import added it?** Today they differ for the same kind of thing. A hand-filed entry's row is labelled "Native trees and shrubs planted, 2025" and an imported one "Native trees and shrubs planted · 2025". A hand-added funding source's row is labelled with the grant's name and reads "$48,000 from Pacific Fisheries Trust"; an imported one is labelled "Funding source" and reads "Fisheries Habitat Fund, Pacific Fisheries Trust, $48,000". Which wording is the rule, and does `publish-review` or this feature own it? Related: Q-37, Q-98 (the label "Funding source"). Stories: 24. It bears on story 22, which records the label and the value.
Answer:

**Q-142 [detail]. A project that has never been published: do imported rows in the review show who added them and the day?** The review leaves the person and day off every hand edit's row there (all rows share the record's creation), but an imported row always shows "who · day". Should imported rows follow the same rule, or keep theirs because the import's person and day are real? Stories: 24.
Answer:

**Q-143 [detail]. A field an import set is then edited by hand before a publish.** `publish-review` folds the two into one row. Whose value, person and day does the row show, and does it still carry "From `<document name>`"? The written rule (spec #30) and the prototype cover only the other order, a hand edit first and the import after it: the row then shows the import's value and source. The prototype cannot show a hand edit after an import, because its hand edits are fixed sample data. The same question applies to a row that stands for two imports and then a hand edit (story 51). Related: Q-37, Q-75. Stories: 24, 51.
Answer:

**Q-144 [detail]. How does a Manager tell which rows a note speaks of?** The line under a note reads "`<who>`, with `<document name>`", with no day; each imported row shows "who · day" and "From `<document name>`". Two imports of documents with the same name by the same person (a report corrected and read again, or pasted text twice: both read "with pasted text") give two notes with identical lines, and rows that cannot be told apart by import. Should the line carry the day, or the note sit with its rows, or is the document's name enough? Related: Q-86 (whether a time is kept), Q-139 (a). Stories: 21. It bears on story 24.
Answer:

**Q-145 [detail]. In the review, pressing the button of the row whose document is already open: should it close the document?** The button is marked expanded for assistive technology, which by convention means a second press collapses it. In the prototype the second press does nothing, and the document is closed only with "Close document", "Back" or Escape. Stories: 33. It bears on story 80, which holds the closing.
Answer:

**Q-146 [detail]. Escape and keyboard focus when the document opens beside the review on a wide screen.** Focus stays on the row's button (so the Manager can go on to the next row), and in the prototype Escape closes the document only while focus is inside it; pressed from the row, it does nothing. On a narrow screen focus moves to "Back", so Escape works at once. Should Escape close the document from anywhere in the review, or should focus move into the document on a wide screen too? Related: Q-68 (the same pane on the Import a report page), Q-83 (no accessibility standard is named). Stories: 80.
Answer:

**Q-147 [detail]. A figure the document gives with no unit at all, once unit conversion is built (later release).** The developer-machine reader treats it like an unknown unit: the change is flagged, the amount keeps the figure, and the note reads "The report says “”. This measure counts pounds.", with nothing between the quotation marks. The funder report sample's row F9 ("Seed collected, 40") is the same case and arrives differently: flagged, amount empty, with the sentence "The table gives 40 with no unit. This measure is in pounds." (story 14, R2). Which is the rule: amount kept or empty, and whose sentence? Related: Q-33, Q-61, Q-89 (c) (whether "unsure" is a verdict the service returns). Stories: 26. It bears on story 14.
Answer:

**Q-148 [detail]. A total to date stated in another unit, once unit conversion is built (later release).** The reader converts the total and the check step then files the difference from the record. The check step shows only the difference's arithmetic ("3.5 to date − 3 on record = 0.5"); the conversion line ("18,480 feet = 3.5 miles") is dropped, so the person never sees the report's own figure against the converted one except in the quote. Should both lines show? Related: Q-82 (b), which asks the first-release half. Stories: 26. It bears on story 13.
Answer:

**Q-149 [detail]. When a check in code quietly changes what the model returned, is the person told? (later release)** Two checks leave no trace in the developer-machine reader: a breakdown answer that is not one of the question's options is dropped, and the change arrives ready with the question unanswered; a low-confidence figure is flagged with no note saying why. Should each add a note to the change, and should a dropped answer flag the change? Related: Q-66 (c), Q-90 (whether an answer may arrive inferred), Q-115 (b) (the first-release half). Stories: 50. It bears on stories 07 and 14.
Answer:

**Q-150 [detail]. A Key facts change the checks turn away (later release): dropped, or listed under "Not used"?** The cases: a field the project did not offer; a Timeline that is not two years. The reader drops it without a word, while a figure for a measure the project is not asked is moved to "Not used". The funder report sample lists "Watershed: South Fork American River. This project has no Watershed field." under "Not used", but as the model's own line, not from this check. Should the check write such a line, and with what words? Related: Q-71. Stories: 50. It bears on stories 15 and 19.
Answer:

Raised by the merge pass of 2026-11-23 (44 stories became 41: 25 merged into 21, 34 dissolved into 01 and 22, 45 merged into 17). The same day the `Stories` lists above were brought in line with the story files.

**Q-157 [detail]. What does the person see when "Undo" itself fails, and can they try again?** Story 23, R2 says the toast goes as "Undo" is pressed, so that it cannot be pressed twice, and R6 says "Undo" is on the toast and nowhere else. So if the taking back fails as a whole (a server error, a lost connection, or the person no longer being able to edit the project since they added the import), the import and everything it added are still on the record and there is no "Undo" left. In the prototype the toast is closed and the listener removed before the taking back runs, and no failure is handled (`src/components/projects/firma2-project-imported.astro`, 115-120; `src/lib/report-imports.ts`, 164-181): nothing would be said, and "6 changes removed" would not show. Nothing checks again, when "Undo" is pressed, that the person may still edit the project. (a) What is the person told when "Undo" fails? (b) Is "Undo" offered again, and where: the first toast kept or brought back, an action on the failure message, somewhere else? (c) Is the edit right checked again when "Undo" is pressed, and what does a person who has lost it see? (d) Does the toast go only once the taking back has succeeded? Related: Q-137 (e) asks the part-way case (all or nothing); Q-44 asks the same for adding; Q-64 already asks whether "Undo" needs a second home. Would change story 23, R2, R3 and R6, and adds at least one scenario. Stories: 23. It bears on story 41, which extends "Undo" to the other kinds of change.
Answer:

**Q-158 [detail]. Pasted text beside the changes: what heads the document pane, and what labels its page?** Story 04, R9 says the pane is headed by the document's name, and story 31, R2 says each page of a document held as passages sits under its label. Pasted text has no file name and no pages of its own. The prototype heads the pane "Pasted text" and labels the one page "Pasted text" as well, so the same words show twice (`firma2-project-report-import.astro:512-535`). Story 40 names the import "pasted text", in lower case, once the changes are added; nothing names the document on the check step before that. (a) What heads the pane for pasted text? (b) Does pasted text have a page label at all? Related: Q-139 (the name of a pasted import, and the cut into paragraphs), Q-66 (b). Stories: 31. It bears on story 04, R9.
Answer:

**Q-159 [detail]. A UAT script run with only its story's blockers built: what does the funder report's check step list, and what do the tally and the action read?** Story 17's UAT script reads the whole funder report: the tally "7 ready to add · 4 need you · 3 already on file", "Add 7 changes", and a Funding sources group of three changes with F12 unticked. Those figures need stories 13, 14, 15, 18 and 75, none of which is in story 17's `Blocked by` (06, 02, 32, 22). (a) What does the check step list, and what do the tally and the action read, when the funder report is read with only story 17 and its blockers built? (b) Or is the script to be run against a narrower recording (performance measure entries plus F10 and F11), and what are its counts? The same question stands for the other scripts that assume the whole funder report; they are listed in `.scratch/project-updates/requirements/coverage.md`, Findings, "Not demonstrable with blockers alone", and the samples that would settle it in `fixtures.md`, "Samples the feature still needs". Until it is answered, steps 5 to 8 of story 17 (the row on the project page) are demonstrable with its blockers, and the counts in steps 1, 4 and 5 are not. Related: Q-88. Stories: 17. It bears on stories 03, 13, 14, 15, 18, 65 and 75.
Answer:

## classifications — nested groups

Raised while building nested classification groups, 2026-11-23. Spec: `.scratch/classifications/spec.md`.

**Q-151. May one group hold both classifications and groups?** The prototype allows it: Forests & fuels holds the classification Forest thinning and the group Fire management, and its board section shows its own classifications first, then the groups inside it. The other rule would be: a group holds either groups or classifications.
Blocks: the add and move rules for groups and classifications.
Answer:

**Q-152. A group's page shows no target. Should it?** Targets are set on classifications (spec #4). Two classifications in a group can set targets on the same measure, due in different years, so the prototype does not add them up; each measure on a group's page reads reported against what its projects planned. Options: no target; the sum when every target on that measure is due the same year; always the sum, with the latest year.
Blocks: the measures section of the group page.
Answer:

**Q-153. Removing a group that still holds something.** The prototype refuses until the group holds no classifications and no groups. Options: keep that; move what it holds up one level; remove the whole branch after a confirm that counts it.
Blocks: the remove story for groups.
Answer:

**Q-154. Must a group's name be unique in the whole workspace, or only among the groups beside it?** The prototype refuses a name any other group has. Group pickers already show each group by its full path.
Blocks: validation on add and rename.
Answer:

**Q-155. Does the public see groups?** The public classifications page shows the classifications of the Plan goal group and nothing of the tree. Does a group get a public page, and do public filters offer groups?
Blocks: `public-site` requirements for classifications.
Answer:

**Q-156. Where else does a group act as a filter or a colour?** The map colours by "Plan goal" and by "Practice area" (the groups directly inside one sample group), and the dashboard offers one dimension per area of work. Both are sample-data conventions, not a rule. Should any group be offered as a map colouring and a dashboard dimension, and at which level?
Blocks: `map` and `progress-dashboard` requirements that name groups.
Answer:

## Answered

### Product-wide

**Q-2. GIS: subscriptions or two-way sync?**
`workspace-settings/gis-subscriptions` locks the fields a source keeps; `workspace-settings/gis-sync` lets the latest change win. They cannot both be the product.
Blocks: requirements for `gis-data-sources`; who owns the rule "one owner per field; a source-kept field is read-only by hand" (Q-10).
Answer: Both, as one feature. Each GIS subscription has a setting: authoritative or not. Authoritative locks the fields the source supplies and leaves the rest editable; not authoritative lets them be edited here and sends each edit back to the GIS system (two-way). Recorded as spec decision 40. (2026-11-23)

**Q-10. "One owner per field; a source-kept field is read-only by hand."** Waits on Q-2.
Answer: `gis-data-sources` owns it, as amended by spec decision 40: a field is read-only by hand only when an authoritative source supplies it. (2026-11-23)

### project-updates — Import a report (build 1)

**Q-20 [cut]. Which check step is the requirement?** The built page shows the document beside the proposed changes grouped by the project page's sections. Three experiment layouts exist at `/proto/import-report`: exceptions first (clean changes collapse to one line), annotated document (changes in the report's margin), and on the record (proposed values inside the project's own sections). Suggest: the built page; the experiments are not requirements.
Answer: The built page: document beside the proposed changes, grouped by the project page's sections. The three experiment layouts are not requirements. (2026-11-23)

**Q-21 [cut]. Are partner organizations proposed in build 1?** Spec #9 lists them. The prototype proposes four kinds of change only (Key facts, Performance measures, Funding sources, Contacts) and sends any other named party to "Not used".
Answer: Not in build 1. Four kinds of change only (Key facts, Performance measures, Funding sources, Contacts). Partner organizations become a `later` story and spec #9 is corrected. (2026-11-23)

**Q-22 [cut]. Who may import?** Spec #21 says anyone who can edit the project. `docs/roles-and-permissions.md` has a workspace permission "Import data — Only administrators". The prototype checks no role. Suggest: spec #21; "Import data" is about bulk project import.
Answer: Anyone who can edit the project (spec #21). The workspace permission "Import data" is about bulk project import; the roles document is corrected to say so. (2026-11-23)

**Q-23 [cut]. Does the person wait for the reading, or can they leave and come back?** A real reading can take minutes. Leaving means a reading is a stored thing with its own states (reading, ready, failed) and probably a notification.
Answer: First release: the person waits on the page. Leave-and-come-back (a stored reading with its own states) is a `later` story. (2026-11-23)

**Q-24 [cut]. How long is Undo available, and to whom?** Today it exists only on the toast; once dismissed, an import cannot be taken back. Options: toast only; from the change log by the person who imported; until the next publish.
Answer: Toast only. After the toast is gone, changes are corrected by hand on the project page. (2026-11-23)

**Q-25 [cut]. Do "Use suggestion" and the confidence badges stay?** "Use suggestion" on a no-match change is a hackathon carry-over, and spec #13 mentions no suggested figure. The badges "Check this" and "Unsure" give three confidence levels the spec does not have. Suggest: drop "Use suggestion" (it is a pre-filled guess); keep one flagged state.
Answer: Drop "Use suggestion". A change is either ready or flagged for the person to fill; no confidence levels. (2026-11-23)

**Q-26 [cut]. Are these promised-but-unbuilt parts in the first release?** (a) Opening the document from the change log (spec #19; today it is plain text there). (b) Handing a spatial file to Upload shapes (spec #11; today a link to the project page). (c) The "another project" warning (spec #20; only the developer-machine reader raises it).
Answer: First release: (b) hand a spatial file to Upload shapes, and (c) the "another project" warning. Later: (a) opening the document from the change log. (2026-11-23)

**Q-27 [cut]. Which attributes can an import set besides Timeline and County?** Spec #9 says "such as county or watershed when the project has that field". Does that include custom fields a workspace defined?
Answer: Built-in key facts and the workspace's custom fields, when the report names a value for a field the project has. (2026-11-23)

**Q-28 [cut]. On which projects is import offered?** Every project the person can edit regardless of stage (a proposal, a completed project, a shared project from a connected organization), or a subset?
Answer: Any project the person can edit, regardless of stage, including proposals, completed projects and shared projects from a connected organization. (2026-11-23)

**Q-62 [cut]. Are the reading's guards and unit conversion requirements for the real reading service?** They exist only in the developer-machine reader (`scripts/report-reader.mjs`): checks on what the model returned, and a table that converts units. One guard depends on a confidence level, which Q-25 removed from what the person sees.
Answer: Yes, they are requirements, in a later release. The first release relies on the person checking each change. Story 26 stays a separate enabler marked `later`. (2026-11-23)
