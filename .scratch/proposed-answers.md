# Proposed answers

2026-11-23. Every question has an answer or a proposed answer, and the stories have been written on them. Three are your decisions (section 1). The rest are proposals: nothing in sections 2 and 3 is decided until you say so. Reply with the numbers you disagree with, and what you want instead. Anything you do not mention is taken as yes.

165 questions: 3 you decided, 5 no longer arise, 29 are worth a look, 128 are routine. None needs a fact only you have. Of these, Import a report is 136 (3 decided, 5 gone, 22 worth a look, 106 routine), product-wide and GIS are 23 (6 worth a look, 17 routine), and classification groups, a separate effort, are 6 (1, 5). Eighteen are new since you last saw this page (Q-162 to Q-179): they came up while the answers were written into the stories.

## 1. Decided by you, 2026-11-23 (3)

**Q-52** Reading reports with an outside AI service is a workspace setting. Off until an administrator agrees and turns it on; can be turned off again; can be made unavailable to a workspace whose terms do not allow it. While off, Import a report is not offered and the page says why.
This meant: two pieces of work added to the first release, the setting (story 82) and what people see when it is off (story 83).

**Q-45** The file is not kept. It is used only to read data from.
This meant: five pieces of work removed (storing the document, opening it beside the review, keeping it open there, the document on a row for two imports, opening it from the history). Still a proposal, see section 2: that each imported change keeps the document's name and the words it was read from.

**Q-135** Yes: a funding source and a contact can be edited and removed on the project page. Undo stays on the toast only.
This meant: one piece of work added to the first release (story 81).

No longer arise, because the file is not kept: Q-77 (lost access to a kept document), Q-81 (opening it from the history), Q-140 (a document that cannot be saved), Q-145 and Q-146 (closing the document beside the review).

## 2. Worth a look (29)

### New since you last saw this page

**Q-45, second half** What stays of a document once the file is gone?
→ Its name, and for each change the words it was read from. A manager sees both beside the change; nothing opens.
This means: seven stories and one standing rule rest on this half, which you have not confirmed.

**Q-164** What does an administrator agree to when turning reading on, and how is it recorded?
→ The product's own three plain facts (reports are sent to an outside AI service; what goes with them; nobody keeps the file), a checkbox before "Turn on", and who turned it on and when shown in the setting.
This means: if any client requires its own wording, or a fuller record of the agreement, only you can say; that text would live in the private folder.

**Q-163** Which settings page holds the switch?
→ Security, in a section of its own, outside that page's plan lock.
This means: it reverses the earlier cut of AI switches from the Security page.

**Q-176** Editing and removing a funding source or a contact: what your yes on Q-135 did not say.
→ Anyone who can edit the project, for any row; the same checks as on the check step; "Remove" asks once; two rows cannot become the same; each change is a row in the change history.
This means: the new story is twelve scenarios of work on the project page, which is not prototyped.

**Q-165** Turning reading off while someone has a report open.
→ Nothing more is sent, but a report already read can still be added. (I am unsure about a reading still under way.)

**Q-80** Leaving and coming back to a reading (already later).
→ The proposal kept the file for up to 7 days while a reading waits. Written instead on your decision that the file is not kept: the file goes when the reading ends, and only the result waits.
This means: a failed reading cannot be retried without choosing the file again, and Q-173 follows.

**Q-173** Coming back to a waiting reading (later): what stands where the document would be?
→ The changes with the words each was read from, and one line saying the document is not kept. (I am unsure of this one.)
This means: the returning check step is weaker than the first release's.

**Q-34** A contact whose email matches nobody: fall back to the name?
→ No. A name is compared only when the report gives no email. Q-128 could be read the other way; the stories follow this one.

**Not questions, but changed since the stories you approved**

- Six stories added: 81 (edit or remove a funding source or contact), 82 (the setting), 83 (told why import is not offered), 84 (Undo when the record has moved, split from 23), 85 (which document a review row names when a field was set twice, what is left of 51), 86 (a funding source already held with another amount, split from 17).
- Five removed with the kept file: 03, 29, 33, 51, 80. 41 stories became 42. The story map needs your approval again.
- Story 16 ("Kept by a data source") stays in the first release, tested against a stand-in. The proposal on Q-17 to move it later was not applied, because you approved it for the first.
- Sample reports, four choices that depart from the proposals so that counts do not depend on what is built: the pasted paragraph's volunteer sentence needs no multiplication; the second sample's planting is filed under 2024; the crew log's late-season line sits in row 13, not row 3; the timeline sample reads 2023–2029, not 2023–2026.
- In the review, the line "This report names another project" also carries who added the import, the day and the document's name (an addition to Q-130).

### Changes to what you decided

**Q-17** Three ways to create a project: which ship first?
→ New project and spreadsheet import first. Projects created from a GIS source come later, with GIS data sources. (I am unsure of this one.)
This means: "Kept by a data source" on Import a report has nothing real to act on until then. It was left in the first release, as you approved, and is tested against a stand-in.

**Q-5** Is publish review only on the top plan?
→ No, on every plan. Where there are no managers an administrator publishes; the top plan adds the review schedule and a manager per organization.
This means: the plans spec loses "Agency publishes directly".

**Q-71, Q-114, Q-115** A report gives a value the record cannot hold: a key fact that does not fit its field, a reporting period the project does not offer, a breakdown answer that is not an option.
→ None is ever saved. The key fact is listed under "Not used"; the period arrives empty and flagged; the answer arrives unanswered with a note.
This means: three small checks move into the first release, though you put the reading's checks in the later one.

**Q-106** Which spatial files are handed to Upload shapes?
→ Only a .zip, up to 50 MB, because that is all Upload shapes takes. Other spatial files get a box saying what Upload shapes needs.
This means: the hand-off you put in the first release is narrower than "any spatial file".

**Q-32** Can every proposed value be edited before adding?
→ Figures and funding sources, yes. Key facts and contacts are take it or leave it, as built; a wrong one is left out and typed on the project page.
This means: the spec's "every proposed value is editable" changes.

**Q-37** Does every change row name its source?
→ Only rows that came from a document or a data source. A hand edit shows who and when.
This means: the spec's "every row, the same way" changes.

**Q-58** Does a hand edit to a field synced two ways wait for review before it goes to the GIS system?
→ No, it goes at once. It still waits for review before the public sees it.
This means: "data sources publish without review" now covers only values that start in the GIS system.

**Q-30** Import a report in the project header: menu item or visible icon?
→ A visible icon, folding into "…" on a phone, as built. The spec said a menu item.

### Adds or moves work

**Q-99** The same thing stated twice in one report, or added by two imports.
→ Never saved twice by default. An exact repeat folds into one or arrives unticked; two different values for one thing are both flagged; adding checks the record again.
This means: real build effort, across most of the check step.

**Q-66** Can a Word file or a spreadsheet be shown beside the changes, like a PDF?
→ Yes, as text with the passage marked, on the check step only; nothing is stored. A reading may take four minutes before it fails.
This means: the reading service must return the text of every file type, not only read it.

**Q-159** Each part is tested against one sample report that mixes every kind of change, so nothing can be accepted until everything is built.
→ Add ten small sample reports, one per kind of change. Nothing is added to the product. The ten are named and counted, and still to be made.

**Q-64** Must Undo on the toast work by keyboard and screen reader?
→ Yes. It stays on the toast only, but the toast is announced, its Undo is a real button, and it stays until dismissed.
This means: the toast needs work the prototype has not done.

**Q-16** Is Funding sources a feature to add?
→ Yes, later. Until then a project's funding rows belong to the project page.

**Q-18** Is reporting a feature to add?
→ Yes, later. Until then "published values only" is tested on the public site, the dashboard and export.

**Q-1** Which performance measures build stays?
→ The original. The hackathon copy goes; its model was folded in on 9 October.

**Q-79** Partner organizations from a report (already later).
→ Same pattern as a funding source, the organization only. (I am unsure of this one.)
This means: it cannot be built until the project page has a partners list, which does not exist.

### Fixes to things the prototype gets wrong

**Q-137** Undo after the person has changed something the import added.
→ Undo removes only what is still as the import left it. Later edits stay, and the message counts what was really removed.
This means: today the prototype throws away a hand edit to a key fact.

**Q-82** A figure in another unit than the measure's, in the first release.
→ It arrives flagged and empty for the person to convert. Nothing is multiplied either ("35 people for 4 hours").
This means: four sample rows are restated in the measure's own unit, so the sample counts you have seen stand.

### I am unsure

**Q-83** Which accessibility standard must every screen meet?
→ WCAG 2.2, level AA. If a client contract names another, tell me and that one replaces it.

**Q-156** (classification groups) Where does a group act as a map colour or a dashboard split?
→ Every top-level group, split by what sits directly inside it. Deeper levels are not offered.

## 3. Routine (128)

You can skip this section: each is the spec, the prototype as built, or the plainly safer choice.

**What is in the first release, and who is offered it**

- Q-29 — What is left out of the first release? → Several documents at once, a report covering several projects, and starting from My Projects all stay out, as the spec says.
- Q-39 — Someone who can see but not edit the project? → No entry points; the page's address shows the standard no-access page.
- Q-40 — Offered while reading the page, or only after Edit? → While reading, like Record work.
- Q-109 — Is the right to edit checked again after the page is open? → Yes, on "Read it" and on "Add N changes"; if lost, nothing is sent or saved.
- Q-162 — Who makes reading unavailable for a workspace? → The product's operator, outside the workspace's settings; no screen for it in the first release. Made available again, it is off.
- Q-166 — A file dropped on the project page while reading is off → The page takes it and a short message says why; the line names the role, and links an administrator to the setting.
- Q-43 — No performance measures, or no closed reporting period? → Import still works for the rest; the figures are listed as not used, with the reason.

**Files and limits**

- Q-38 — Which file types are accepted? → PDF, .docx, .xlsx, .csv and .txt, the same list everywhere; old .doc and .xls are refused with advice.
- Q-47 — What are the limits? → 20 MB, 100 pages or 5,000 rows, 50,000 pasted characters, a 500-character note; each refused with the limit stated.
- Q-41 — What does the person see when a reading fails? → Back to choosing, file kept, with a plain reason for each case and whether to retry.
- Q-69 — A wrong, oversized or lost dropped file? → Refused at once with the reason; the person is asked to choose again.
- Q-100 — Taking a chosen file out again, and several files dropped together → It can be removed; a drop of several is refused with a message.
- Q-102 — A file dropped on the project page, once back on the choose step → The file control shows it like any chosen file.
- Q-103 — A file dropped on the project page that is not a report → The page stays put and a short message says the file can't be read as a report.
- Q-104 — Messages under the file control → One at a time, cleared whenever the file changes or a reading starts; a too-large file never replaces the file already chosen.
- Q-70 — When is a spatial .zip handed to Upload shapes? → Only when the person follows the link; otherwise it is let go and nothing is stored.
- Q-107 — The spatial file box while "Paste text" is chosen → Hidden with the file control; back when "File" is chosen again.
- Q-105 — A reading of pasted text that fails → The message shows by the text area; the text stays and can be read again.
- Q-108 — "Paste the report text first." → Goes as soon as text is typed, and for good when the person switches to "File".
- Q-85 — A reading the person walks away from? → Its result and the document are discarded at once; a dropped connection is a failed reading.
- Q-88 — The environment the features are tested in → An assumption, not a question for you: the development team's, serving recorded readings of the sample reports, with a reset for the sample project.

**What the reading returns**

- Q-89 — What is the reading service told and what does it return? → Told only the project's measures and fields; returns what the document names; matching is done in code.
- Q-129 — What "Not used" and "Skipped" must hold → Everything the import did not use, each skipped item with a reason, one per line.
- Q-42 — The reading finds nothing to add? → Show the document, a plain "nothing to add" line and the "Not used" list; nothing to commit.
- Q-46 — Is the reading itself kept after adding? → No. Only the document's name, each change's words, the note and the added changes.

**The check step**

- Q-54 — Order of changes in a section? → Ready first, then the ones that need you; the page sorts them.
- Q-67 — Where do the other states go in a section? → After ready and flagged: already on file, then kept by a data source; document order within each.
- Q-110 — The count line after ticking and unticking → Each change counted once; unticked ready changes read "N left out"; "1 needs you" for one.
- Q-68 — Where does keyboard focus go? → Into the document and back to the same change; to the first failing field when adding is stopped.
- Q-111 — Selecting a change by keyboard → Every change can take focus, including one with no checkbox; the selected one is marked for screen readers.
- Q-112 — Narrow screen with the document showing → A stopped import brings the person back to the first failing change; widening the window closes the document.
- Q-117 — A change with no known place in the document → The document goes to its start and says no place is marked; selecting a change always returns to its place.
- Q-158 — Pasted text beside the changes → headed "Pasted text" once, with no page label.
- Q-119 — A screen exactly at the tablet width → the narrow layout everywhere, the review included.
- Q-167 — A change read from two places in the document → the first is marked; the words shown name both.

**Flags**

- Q-33 — Does a figure the reading is unsure of arrive empty? → Yes, always; no guess is written in for the person.
- Q-78 — How are two readings offered? → Both stated in one sentence; the person types the figure. No buttons.
- Q-61 — What does the one flagged badge say? → "Needs you", replacing three badges; the reason is the sentence beneath. "Not in this workspace" stays.
- Q-122 — Badge on a flagged change once dealt with → The badge goes when it is ticked, or when the organization is picked; the reason stays.
- Q-92 — Emptying a figure that ticked the change? → It unticks again.
- Q-123 — Which typed figures tick an empty flagged change? → The same ones "Add N changes" accepts: one rule for both.
- Q-63 — Report names another project: do changes arrive unticked? → Yes, all unticked with their values kept; the warning explains, and the person ticks what belongs.
- Q-74 — How is "names another project" decided? → Same or contained name, or the project number, means this project; several others are named first plus a count.
- Q-130 — After adding from a report that names another project → The import records it, and the review tells the Manager above that import's changes.
- Q-170 — A figure typed into an empty change that the record already holds → marked "Already on file" and not ticked; the person can still tick it.
- Q-171 — A change flagged for its reporting period → picking a period ticks it; a change with several reasons shows each and is ready when all are dealt with.

**Performance measure figures**

- Q-90 — May a breakdown answer be inferred? → No. Unanswered unless the document states it.
- Q-91 — A total to date lower than the record's? → Flagged, with both figures stated; not "Already on file".
- Q-120 — What a total to date is compared with → Only entries up to the report's period, and only for measures whose values add up.
- Q-121 — A total to date after the person changes its figure → Recorded as changed from the document; the arithmetic line stays and adds what was entered.
- Q-118 — Arithmetic in the first release → A sum of lines is shown, labelled "Added:"; no figure is rounded.
- Q-113 — What may be typed into an amount → Held to the measure's decimal places and to whole dollars; a figure that does not fit is refused, never rounded.
- Q-116 — When is a figure recorded as "changed" or "filled in"? → Decided at the moment of adding, by comparing what arrived with what is added.

**Key facts**

- Q-65 — Which built-in Key facts can an import set? → Timeline, County and Estimated total cost, plus custom fields; never stage, project type or lead organization.
- Q-124 — How a Key facts value is compared with the record's → By the field's type; differences of capitals or spacing alone are "Already on file".
- Q-125 — A report that states one year of a Timeline → Code takes the other year from the record; with none on record it is listed as not used.
- Q-51 — Flag that a replaced value was typed by hand? → No; "Was …" is enough.

**Funding sources**

- Q-50 — Funding source already on the record with another amount? → Proposed as a change to that row, showing "Was …"; adding replaces the amount.
- Q-35 — Funder not in the workspace and none picked? → It stays listed, unticked, on the check step and is not added; no second list afterwards.
- Q-131 — Which organizations a funding source can pick → all the person can see, connected ones included, A to Z, type to find; change the pick but not clear it.
- Q-132 — A funding source read with no organization or no amount → proposed but flagged and empty; the person fills it in or leaves it out.
- Q-133 — How a funder's name is matched → exactly, ignoring capitals; no near matches offered. "Already on file" updates when the person edits the name or organization.
- Q-134 — A funding source whose organization the workspace no longer holds → cannot happen; a funding source points at the organization itself, so renames follow.
- Q-174 — A funding row whose amount an import changed → keeps its place and gains "From …"; the total row shows while any row was added or changed by an import.
- Q-175 — Editing an "Already on file" funding source into something new → it gains a checkbox, ticked.

**Contacts**

- Q-73 — A contact with no email? → Still proposed; matched by name, so two different names are two contacts.
- Q-128 — Contacts with no role or organization, or matching two people → No stray punctuation; an email match wins; a name shared by two people is not called a match.

**Adding the changes**

- Q-44 — Is an import all or nothing? → Yes. On failure nothing is added and the person's ticks, edits and note are kept.
- Q-84 — "Add N changes" pressed twice? → The button goes busy and disabled; one press makes exactly one import.
- Q-87 — Adding something the record already holds? → Entries arrive unticked and are re-checked on Add; facts, contacts and funders already on file cannot be ticked.
- Q-48 — Two people import or edit at once? → Last save stands, nobody is told; adding re-checks the record so the same entries are not added twice.
- Q-96 — When does an error message go? → As soon as the field is fixed or the change is unticked.
- Q-168 — "Add N changes" stopped because the record changed meanwhile → one message beside the button says so, and the first re-marked change comes into view.
- Q-169 — A repeat inside one report that the record also holds → "Already on file" wins on both.
- Q-172 — Which check runs first on "Add N changes"? → The person's own entries first; the record is checked only once those pass.

**The note**

- Q-36 — Note label: "manager" or "reviewer"? → "Note for the reviewer (optional)", as built.
- Q-93 — Can the note be edited after adding? → No; only Undo removes it, with the import.
- Q-144 — Telling which rows a note is about → the note's line also shows the day, matching the rows.

**History**

- Q-53 — Is an import recorded with who added it and the day? → Yes.
- Q-86 — Which clock gives an import its day? → The exact time is stored; each reader sees the day in their own time zone.
- Q-94 — Where does an import sit in the change history? → In time order with every other change.
- Q-101 — Do imported entries show in the performance measures' own change log? → Yes, each naming its document and importer; Undo removes those rows.
- Q-49 — Does adding an import notify managers? → No. It raises the unpublished-changes count; the Updates feed treats it like a hand edit, as one item.
- Q-76 — What of an import still shows after publishing? → The "From …" lines, the total row and the history row stay; the note leaves the review.

**Undo**

- Q-75 — Undo after a hand edit, or after a publish? → The hand edit stays; after a publish Undo is no longer offered.
- Q-138 — Two imports set one field and both are undone → the field returns to its value from before both, whichever is undone first.
- Q-157 — Undo itself fails → the message says nothing was removed and Undo stays on it to try again; someone who lost edit rights is told the import stays.
- Q-177 — Keyboard focus after Undo → on the new message's dismiss control.
- Q-178 — Undo when several things are true at once → one message: lost rights first, then already undone, then published, then the counts.
- Q-179 — Undo of a field a later import has set since → counted as removed, not as kept.

**The document's name**

- Q-136 — Who sees the document's name → only people who can edit or publish the project. Everyone else sees the row without it, or "from a document".
- Q-139 — Pasted text as a document → still named "pasted text", told apart by person and day. Nothing of the text is kept but the words each change was read from.

**The review**

- Q-97 — Two imports add entries for the same measure and period: one review row or two? → Two rows, each naming its own document.
- Q-141 — Review rows typed by hand or imported → worded the same way, in the review's own wording.
- Q-143 — Imported value then edited by hand → the review shows the hand-edited value and its editor, and keeps the document's name and the words read.
- Q-142 — A never-published project in review → imported rows still show who added them, the day and the document.

**Wording**

- Q-31 — "Import report" or "Import a report"? → "Import a report" everywhere.
- Q-98 — Do labels and sentences use the workspace's own words for Project, Organization and so on? → Yes, everywhere; code, not the model, words the "Not used" reasons.

**Later release**

- Q-95 — A converted figure too small to show (later)? → Flagged, not rounded to zero; the amount and its line always show the same figure.
- Q-147 — A figure with no unit (later release) → flagged with an empty amount and a sentence saying no unit was given.
- Q-148 — A total to date in another unit (later release) → show the conversion line, then the difference line.
- Q-149 — A later check quietly changes the reading → the change gets a note saying what was done; the note for a breakdown answer is already in the first release.
- Q-150 — A key fact the later checks turn away → listed under "Not used" with the reason, not dropped.

**Fields kept by a data source (first release, against a stand-in)**

- Q-126 — What a field kept by a data source shows → No "Was …"; the source's value is named; no link; "Nothing to add" when nothing can be ticked.
- Q-127 — Fields kept by a data source, the edge cases → One source per field; custom fields can be kept; adding checks again and refuses a newly kept field.
- Q-72 — A field synced two ways with a GIS system? → Treated like a hand edit: the change names the source; Undo sends the old value back.

**GIS data sources**

- Q-57 — Is the setting per subscription or per field? → Per subscription. The per-field direction in the GIS sync prototype is dropped.
- Q-56 — Does "authoritative or not" apply to every data source? → Only GIS subscriptions. Fields kept by any other source stay locked, as already decided.
- Q-55 — Two-way: the same field changed in both places. → Neither is overwritten; an administrator picks from both values on the subscription's page. One-sided changes just carry across.
- Q-59 — Sending an edit back to the GIS system fails. → The edit stays saved; the project page says it was not sent; it is retried, and administrators see a list.
- Q-60 — Hide the Import menu only when the GIS subscription is authoritative? → Yes. With a two-way subscription, Import and New project stay.

**Product-wide: ownership and clean-up**

- Q-8 — Where is a proposed project approved? → In the review inbox, under Proposals. Same approver, same Approve and Return; the separate approval block is gone.
- Q-6 — Do plans exist? → Yes: Free, Agency, Program. One outdated sentence in the roles document is corrected.
- Q-7 — "Steward" still appears in two specs. → A missed rename; both are corrected to Manager.
- Q-3 — Is the hackathon team's project-updates sandbox out? → Yes. The Import a report page exists, so it is deleted, as already decided.
- Q-4 — Are four leftovers still wanted? → Old Vocabulary page goes (Terminology replaced it). Default table columns come later. Two stale list entries are corrected.
- Q-9 — Who owns the shared editing rules for the two builders? → Nobody new: written once as standing rules that both builders must meet.
- Q-11 — Who owns the two public site switches? → The public site feature. The switches stay on the Custom pages settings screen.
- Q-12 — Who owns the five "not public" states? → The public site feature, all five. Visitors see one plain "not public" page that never says why.
- Q-13 — Who owns the shared add, rename and remove pages for tags, project types and classifications? → Tags, the plainest of the three; the other two state only their extras.
- Q-14 — Who owns notification settings? → Personal settings owns the switches and the rule; each feature owns its own events; Organization settings reuses the switches.
- Q-15 — Is the portfolio map still in the product, and who owns the maps? → Its own page is gone; it remains on Organization Home. The Map feature owns all three.
- Q-19 — Draft the missing glossary definitions? → Yes. 36 short drafts are ready under the question; correct any that read wrong.

**Classification groups (a separate effort, not counted under Import a report)**

- Q-151 — May a group hold both classifications and groups → yes, classifications listed first, then the groups.
- Q-152 — Should a group's page show a target → no; it shows reported against planned.
- Q-153 — Removing a group that still holds something → refused until the group is empty.
- Q-154 — Must a group's name be unique → yes, across the whole workspace.
- Q-155 — Does the public see groups → not yet; public pages stay as they are, and a public group page is later.
