# Proposals, part 2 — Import a report (Q-29 to Q-54, Q-61 to Q-97)

Written 2026-11-23. 62 open questions, one block each. Q-62 is already answered and has no block. Interface wording in quotes is indicative: it states what the message must say and goes through the `microcopy` skill when the story is written.

## What is in the feature

### Q-29
Class: routine
Proposed: Not in the first release: several documents in one import, a document covering several projects, an entry from My Projects, setting up a data source from this layout, and filling a funder's form back out. One document, one project, started from the project page — spec #20 and the spec's Out of scope list already say so (confidence: high)
Digest: What is left out of the first release? → Several documents at once, a report covering several projects, and starting from My Projects all stay out, as the spec says.
Changes: none beyond filling the story; the story map's Out of scope row loses "Not confirmed".

## Where the prototype and the spec disagree

### Q-30
Class: worth-a-look
Proposed: The header entry is the prototype's: an always-visible icon button in the breadcrumb row, which moves into the "…" menu under phone width — the built page is the later decision and a reporting act should not sit behind a menu (confidence: medium)
Digest: Header entry: menu item or visible icon? → Visible icon in the header, folding into "…" on a phone, as built.
Changes: amends spec #8 ("an item in the '…' menu"); story 08 as written.

### Q-31
Class: routine
Proposed: Every entry point and the page title read "Import a report", including the button on the performance measures card — one name for one act (confidence: high)
Digest: "Import report" or "Import a report"? → "Import a report" everywhere.
Changes: none beyond filling the story (stories 01, 12).

### Q-32
Class: worth-a-look
Proposed: Figures are editable on the check step; facts and people are taken or left. A performance measure change (amount, reporting period, breakdown answers) and a funding source change (grant or program, organization, amount) can be edited before adding. A Key facts change (Timeline, County, any other built-in or custom field) and a contact change can only be ticked or left out; a wrong one is left out and typed on the project page — the check step would otherwise need an editor for every field type a workspace can define, and the project page already edits each in one click (confidence: medium)
Digest: Can every proposed value be edited before adding? → Figures and funding sources yes; Key facts and contacts are take it or leave it, as built.
Changes: amends spec #13 ("every proposed value is editable"). Stories 07 and 36 as written; consistent with Q-71 (a value that does not fit goes to "Not used", since it cannot be corrected in place).

### Q-33
Class: routine
Proposed: A change the reading could not settle always arrives with its amount empty and unticked, including one the report supports two readings of; neither reading is written in — spec #13 and the standing decision "never a pre-filled guess" (confidence: high)
Digest: Does an unsure change arrive empty? → Yes, always empty; no reading is written in for the person.
Changes: story 14, R4 changes (no reading written in; typing the figure ticks it, as for any empty change); fixtures row for the 6-or-12-acres change; the prototype sample is corrected. How the two readings are shown is Q-78.

### Q-34
Class: routine
Proposed: A contact is matched by email, ignoring capitals and outer spaces; by name only when the report gives no email (Q-73). A match with a person in the workspace changes one helper line and nothing else: the contact is stored as the name, role, organization and email the report gives, not linked to an account, and nobody is invited. The role is the text the report uses, as the Contacts panel already takes any role — spec #14, and the least new surface (confidence: medium)
Digest: How is a contact matched and stored? → By email, else by name; stored as plain text, never linked to an account; role is free text.
Changes: none beyond filling the story (story 18). Consistent with Q-73.

### Q-35
Class: routine
Proposed: A funding source whose organization the person did not pick stays on the check step as an unticked change with its badge, is counted under "need you", and is not saved. That is where it is "listed as not added"; nothing lists it again after adding, because the reading is not kept (Q-46) — it is never dropped from the person's sight before they decide, which is what the spec protects (confidence: medium)
Digest: Funder not in the workspace and none picked? → It stays listed, unticked, on the check step and is not added; no second list afterwards.
Changes: reads spec #15's "listed as not added" as the check step's list; fixes the prototype where the change is dropped. Story 75, R4 as written; no line added to story 19. Consistent with Q-46.

### Q-36
Class: routine
Proposed: The field is labelled "Note for the reviewer (optional)". "Reviewer" is the interface's word for whoever reviews and publishes the project; the role stays Manager in the roles reference and in stories — an Administrator reviews too, so the label names the act, not one role (confidence: medium)
Digest: Note label: "manager" or "reviewer"? → "Note for the reviewer (optional)", as built.
Changes: none beyond filling the story (story 21); spec #17's "note to the manager" is a description, not the label.

### Q-37
Class: worth-a-look
Proposed: A row names its source only when the change came from a document or a data source. A hand edit shows who and when, with no source label: by hand is the default, and "only the exception names its source" — the dated note in the code is the later decision, and a label on every row says nothing on most of them (confidence: medium)
Digest: Does every change row name its source? → Only rows that came from a document or a data source; hand edits show who and when.
Changes: amends spec #5 and #31 ("every row, the same way"). Stories 22 and 24 as written; `publish-review` and `updates-feed` follow the same rule.

### Q-38
Class: routine
Proposed: One list everywhere (file control, drop on the project page, the reading): PDF, Word (.docx), Excel (.xlsx), CSV and plain text (.txt). The older .doc and .xls are refused before reading, with a message that says to save the file as .docx or .xlsx — it is what the reader can read reliably, and three lists that disagree is the bug (confidence: medium)
Digest: Which file types are accepted? → PDF, .docx, .xlsx, .csv and .txt, the same list everywhere; old .doc and .xls are refused with advice.
Changes: none beyond filling the stories (01, 08, 10); the control's label and accept list are corrected. Spatial types stay with story 11.

## What the prototype cannot show

### Q-39
Class: routine
Proposed: A person who can see the project but not edit it sees none of the three entry points (absent, not disabled), and a file dropped on the project page starts nothing. The page's address shows them the product's standard no-access page with a way back to the project; no document, reading or unpublished value is sent — standing rule: someone who may not act never receives the page (confidence: high)
Digest: Someone who can see but not edit the project? → No entry points; the page's address shows the standard no-access page.
Changes: none beyond filling the story (story 12). Consistent with Q-77 (a).

### Q-40
Class: routine
Proposed: Import a report is offered while the project page is being read; pressing Edit is not needed — the brief keeps reporting acts available while reading, because filing figures is not editing the record (confidence: high)
Digest: Offered while reading the page, or only after Edit? → While reading, like Record work.
Changes: none beyond filling the stories (01, 08, 12).

### Q-41
Class: routine
Proposed: Every failed reading returns the person to the choose step with the file still held and nothing saved, and says "Couldn't read <name>." followed by the reason: no text to read, it may be a scan; it is password-protected; the file is empty; reading took too long, try again; the reading service is not available, try again shortly; the connection was lost. A file over the limit never reaches the reading: the control refuses it with the limit stated — the person must be able to tell "fix the file" from "try again" (confidence: high)
Digest: What does the person see when a reading fails? → Back to choosing, file kept, with a plain reason for each case and whether to retry.
Changes: none beyond filling the stories (02, 10). Consistent with Q-66 (a) and Q-85 (c).

### Q-42
Class: routine
Proposed: A reading that proposes nothing is not a failure. The check step opens with the document, one line saying nothing in the report can be added to this project, and the "Not used" and "Skipped" lists if there are any. There is no commit action; "Read another" and "Cancel" remain — the person should see what was read and why none of it was used (confidence: high)
Digest: The reading finds nothing to add? → Show the document, a plain "nothing to add" line and the "Not used" list; nothing to commit.
Changes: none beyond filling the stories (02, 04, 19).

### Q-43
Class: routine
Proposed: Import is still offered on a project with no performance measures: Key facts, funding sources and contacts can be proposed, and every figure the report states goes under "Not used" with the reason that the project has no performance measure for it. When the project has no closed reporting period, its performance measure figures go under "Not used" with the reason that there is no closed reporting period to file them under — nothing is filed where the record cannot hold it, and nothing is dropped silently (confidence: medium)
Digest: No performance measures, or no closed reporting period? → Import still works for the rest; the figures are listed as not used, with the reason.
Changes: none beyond filling the stories (02, 07, 12).

### Q-44
Class: routine
Proposed: An import is all or nothing. If the save fails, nothing is on the record, the person stays on the check step with their ticks, edits and note intact, and a message says nothing was added and to try again. If the record changed underneath so that a ticked change no longer stands (Q-87 (b), Q-48), nothing is added, the changes concerned are updated and marked, and the person presses again — a half-added import cannot be undone as one and makes totals untrustworthy (confidence: high)
Digest: Is an import all or nothing? → Yes. On failure nothing is added and the person's ticks, edits and note are kept.
Changes: none beyond filling the stories (01, 22). Consistent with Q-48, Q-84, Q-87.

### Q-45
Class: needs-you
Proposed: Working assumption: the kept document is kept for as long as its project exists, because it is the evidence behind figures that may be published. People who can edit or publish the project can open and download it. Nobody deletes one on its own: it goes when its import is undone or its project is deleted. Opening it is not logged. Pasted text is held to the same rules — the retention period and any duty to delete or to log access are the organization's or a client's policy (confidence: medium)
Digest: How long is the kept document kept, and who can delete it? → Assumed: kept while the project exists, downloadable by editors and publishers, no separate delete, no access log.
Changes: none beyond filling the stories (03, 40) on the assumption; they stay `needs-info` until the retention period is given. Consistent with Q-77 (b) and Q-85 (b).

### Q-46
Class: routine
Proposed: The reading is not kept. After "Add N changes" the product holds the document, the note and the changes that were added; the changes left out and the "Not used" and "Skipped" lists are discarded — the document is kept and can be read again, and a stored reading is a new thing to own (confidence: medium)
Digest: Is the reading itself kept after adding? → No. Only the document, the note and the added changes.
Changes: none beyond filling the stories (01, 19). Consistent with Q-35; the later story 28 is the one place a reading is stored, for a time (Q-80).

### Q-47
Class: routine
Proposed: A file is at most 20 MB, and at most 100 pages or 5,000 spreadsheet rows; pasted text at most 50,000 characters; the note at most 500 characters. Each is refused at its own control with the limit stated, before anything is read; nothing is cut short silently, and the note field counts down near its limit — 20 MB is what the page already shows; the page and row figures are a common ceiling and are to be confirmed against the reading service when it is chosen (confidence: medium)
Digest: What are the limits? → 20 MB, 100 pages or 5,000 rows, 50,000 pasted characters, a 500-character note; each refused with the limit stated.
Changes: none beyond filling the stories (01, 02, 09, 10, 21).

### Q-48
Class: routine
Proposed: The last save stands, as for two hand edits, and nobody is notified. What prevents a wrong record is the check on "Add N changes" (Q-87 (b)): if another import or a hand edit has changed what a ticked change stands on (the entry is now on file; the value it would replace is no longer the one shown), nothing is added, those changes are updated and marked, and the person presses again. The second of two people importing the same report therefore finds its entries "Already on file" — never count twice, with no new screen (confidence: medium)
Digest: Two people import or edit at once? → Last save stands, nobody is told; adding re-checks the record so the same entries are not added twice.
Changes: none beyond filling the stories (13, 15, 32). Consistent with Q-44 and Q-87.

### Q-49
Class: routine
Proposed: Adding an import notifies nobody. It raises the project's unpublished-changes count and puts the project in the review like any other change. In the Updates feed it appears when a hand edit would, as one item for the import, not one per change — spec #38 notifies nobody individually even on publish, and imported changes are ordinary changes with a source (confidence: medium)
Digest: Does adding an import notify managers? → No. It raises the unpublished-changes count; the Updates feed treats it like a hand edit, as one item.
Changes: none beyond filling the story; when the feed shows a change is `updates-feed`'s rule.

### Q-50
Class: routine
Proposed: A funding source the record already holds (same grant or program and organization) with a different amount is proposed as a change to that row: it shows the new amount with "Was <amount>", arrives ticked, and adding it replaces the amount on the existing row; no second row. With the same amount it is "Already on file" — today the new amount is lost, and a second row would count the grant twice (confidence: medium)
Digest: Funding source already on the record with another amount? → Proposed as a change to that row, showing "Was …"; adding replaces the amount.
Changes: story 17 gains one requirement and one scenario; Undo (story 41) puts the earlier amount back. Consistent with Q-87 (e).

### Q-51
Class: routine
Proposed: No extra mark. "Was <value>" is all the check step shows of the value being replaced, whoever or whatever put it there — every edit is trusted alike, and the change history already says who set it (confidence: high)
Digest: Flag that a replaced value was typed by hand? → No; "Was …" is enough.
Changes: none beyond filling the story (story 15).

### Q-52
Class: needs-you
Proposed: Working assumption: reading is on for every workspace, with a provider under terms that forbid training on the documents and keeping them after the reading; the choose step says once that the document is read by an AI service; there is no per-workspace switch in the first release — whether client documents may leave the organization, and on what terms, is a policy and contract question only you or a client can answer (confidence: low)
Digest: May documents be sent to a model provider for every workspace? → Assumed yes, under no-training, no-retention terms, stated on the page; no switch yet.
Changes: none on the assumption. A "no" for some workspaces adds a workspace setting and a story; the client-sensitive part of the answer goes in `docs/private/requirements/project-updates/`. Enabler 02 stays `needs-info`.

## The harvester's readings

### Q-53
Class: routine
Proposed: Confirmed: an import is recorded with the person who added it and when (the day is what screens show; the time is kept, Q-86) — spec #5 and #19 need both to show a source (confidence: high)
Digest: Is an import recorded with who added it and the day? → Yes.
Changes: none beyond filling the stories (21, 22, 24).

### Q-54
Class: routine
Proposed: Confirmed, with the one flagged state of Q-61: in each section, ready changes first, then flagged ones, then the rest as Q-67 orders them. The check step sorts, in code, whatever order the reading returns — the person adds the clean ones and then settles what waits (confidence: medium)
Digest: Order of changes in a section? → Ready first, then the ones that need you; the page sorts them.
Changes: none beyond filling the story (story 04). Consistent with Q-67.

## Raised while recording the answers

### Q-61
Class: routine
Proposed: "Needs a decision", "No match" and "Unsure" become one badge, "Needs you", the same words the tally uses; the sentence under the quote says why. "Not in this workspace" keeps its own wording, because what it asks for is different (pick an organization), and is still counted under "need you" — one state, named once (confidence: medium)
Digest: What does the one flagged badge say? → "Needs you", replacing three badges; the reason is the sentence beneath. "Not in this workspace" stays.
Changes: story 14, R5 and story 06 use the one badge; story 26's cases use it too.

### Q-63
Class: routine
Proposed: Yes. When the report names another project, every change that could be added arrives unticked, with its values as read and no badge of its own; the warning above the changes gives the reason and the tally counts them under "need you". Key facts changes are treated the same. "Already on file" and kept changes keep their own state — adding another project's figures is the costliest mistake here, and emptying every amount would punish a report that is merely named differently (confidence: medium)
Digest: Report names another project: do changes arrive unticked? → Yes, all unticked with their values kept; the warning explains, and the person ticks what belongs.
Changes: stories 15 and 20 filled; the developer-machine reader's "needs a decision" on each change is not the rule. Consistent with Q-74.

### Q-64
Class: worth-a-look
Proposed: Yes. Undo stays on the toast only, as decided, and the toast is built so that the decision can stand: it is announced when it appears, "Undo" is a real button that is the next keyboard stop after the page loads, and the toast stays until dismissed — keyboard reach is required at the level proposed in Q-83, and the toast as prototyped does not have it (confidence: medium)
Digest: Must the toast's Undo work by keyboard and screen reader? → Yes; Undo stays toast-only, but the toast must be built reachable and announced.
Changes: keeps the decision "Undo is toast only"; story 23, R1 gains the keyboard and announcement requirement, and the toast component needs work the prototype has not done. Consistent with Q-83.

### Q-65
Class: routine
Proposed: An import can set Timeline, County, Estimated total cost and any other built-in single-value Key fact, plus the workspace's custom fields. It never sets stage (spec #9), project type or lead organization: project type changes which performance measures the project is asked, and lead organization changes who can edit it (confidence: medium)
Digest: Which built-in Key facts can an import set? → Timeline, County and Estimated total cost, plus custom fields; never stage, project type or lead organization.
Changes: story 15 names the list; a report's value for an excluded field goes to "Not used".

## Raised while writing the stories

### Q-66
Class: worth-a-look
Proposed: (a) A reading may take four minutes, as the reader does; then it fails as in Q-41 and the person can try again. (b) A PDF is shown as itself, opened at the change's page. Every other file type (Word, spreadsheet, CSV, text) comes back from the service as passages, which are kept with the stored file, so the document can be shown beside the changes and beside the review with the passage marked; "This file can't be shown here." is left for a failure only. (c) The first release keeps no confidence; when the later guards arrive it is internal to the service, never shown and never stored on a change — the decided check step is "the document beside the changes", and without (b) that is true only for PDFs, while the service must extract the text anyway (confidence: medium)
Digest: Reading time limit; can Word and spreadsheet files be shown beside the changes? → Four minutes. Yes: non-PDF files are shown as marked passages, kept with the file.
Changes: (b) widens stories 04 and 31 (a Word file or spreadsheet is shown, not "can't be shown") and enabler 02 and 03 (passages returned and kept); real build effort. Stories 33 and 40 follow.

### Q-67
Class: routine
Proposed: Inside a section the order is: ready, flagged ("Needs you", then "Not in this workspace"), "Already on file", "Kept by a data source". Within each group, the order the document states them — what can be added first, what waits next, what needs nothing last (confidence: medium)
Digest: Where do the other states go in a section? → After ready and flagged: already on file, then kept by a data source; document order within each.
Changes: none beyond filling the stories (04, 16, 17, 75). Consistent with Q-54.

### Q-68
Class: routine
Proposed: (a) Yes: on a narrow screen "Show source" moves focus to the document's "Back", and "Back" returns focus to that change's "Show source", as the review already does. (b) Yes: when "Add N changes" is stopped, focus moves to the first failing field — same pane, same behavior, and a stopped action must lead somewhere (confidence: high)
Digest: Where does keyboard focus go? → Into the document and back to the same change; to the first failing field when adding is stopped.
Changes: none beyond filling the stories (05, 30, 65). Consistent with Q-83.

### Q-69
Class: routine
Proposed: (a) The file control refuses a dropped file whose type is not on the list: nothing is held and a message names the types it takes. (b) A file over 20 MB dropped on the project page opens Import a report on the choose step with the size message naming the file; nothing is read. (c) When a dropped file cannot be carried to the page, the choose step says so and asks the person to choose the file there — never fail later what can be refused now, and never drop the person's file without a word (confidence: high)
Digest: A wrong, oversized or lost dropped file? → Refused at once with the reason; the person is asked to choose again.
Changes: none beyond filling the stories (08, 10).

### Q-70
Class: routine
Proposed: The file is passed when the person follows "Upload shapes" in the "That's a spatial file" box, not when it is chosen. If they do not follow it, the file is let go when they choose another file or leave; nothing is uploaded or stored — nothing leaves the person's machine until they act (confidence: medium)
Digest: When is a spatial file handed to Upload shapes? → Only when the person follows the link; otherwise it is let go and nothing is stored.
Changes: none beyond filling the story (story 11).

### Q-71
Class: worth-a-look
Proposed: A Key facts value that does not fit its field is never proposed and never saved. The check step tests it in code when it builds the list and puts it under "Not used" with the reason (no such option; not a number; a Timeline needs a start and an end year) — an invalid value must not reach the record, and since a Key facts change cannot be edited on the check step (Q-32) there is nothing for the person to fill (confidence: medium)
Digest: A Key fact value that does not fit its field? → Listed under "Not used" with the reason; never added.
Changes: brings one small check forward from the later reading guards (enabler 50) into story 15, first release; narrows the decision "reading guards are later" by this one test. Consistent with Q-32 and Q-65.

### Q-72
Class: routine
Proposed: A field a two-way GIS subscription supplies is treated exactly as a hand edit to it would be. (a) The change is an ordinary ready change with one line naming the source the value is also sent to. (b) Undo is another edit: the earlier value is sent back the same way, and a failed send is handled as any failed send is — one rule for an edit, however it arrived (confidence: medium)
Digest: A field synced two ways with a GIS system? → Treated like a hand edit: the change names the source; Undo sends the old value back.
Changes: none beyond filling the stories (16, 41); when and how an edit is sent is `gis-data-sources`' rule.

### Q-73
Class: routine
Proposed: A contact with no email is proposed. It is matched by name, ignoring capitals and outer spaces, and is "Already on file" when the project has a contact of that name; two contacts with no email and different names are two contacts. When both sides have an email, only the email decides — the Contacts panel already tells such contacts apart by name (confidence: medium)
Digest: A contact with no email? → Still proposed; matched by name, so two different names are two contacts.
Changes: story 18's two tests change from email only to email, else name. Consistent with Q-34.

### Q-74
Class: routine
Proposed: (a) The report is about this project when the names are the same once case, spaces, punctuation and digits are ignored, when one name contains the other, or when the report gives this project's number; an abbreviation or an older name raises the warning, which costs the person some ticks and nothing else. (b) The service returns every project the report names. If this one is among them there is no warning; if not, the warning names the first and counts the rest — the warning should fire only when the report is plainly about something else (confidence: medium)
Digest: How is "names another project" decided? → Same or contained name, or the project number, means this project; several others are named first plus a count.
Changes: story 20 filled; enabler 02 returns a list of names, not one. Consistent with Q-63.

### Q-75
Class: routine
Proposed: (a) The hand edit stands. Undo takes back only what is still as the import left it, and the toast says how many changes were removed and how many were kept because they were edited since. (b) Once any of the import's changes is published, Undo is no longer offered; pressed from a toast that is still open, it changes nothing and says the changes were published and are corrected on the project page — never lose a person's later work, and never let a toast alter what a Manager has published (confidence: medium)
Digest: Undo after a hand edit, or after a publish? → The hand edit stays; after a publish Undo is no longer offered.
Changes: story 23 gains two scenarios; story 41, R3 follows. The same rule is proposed to whoever answers Q-137 (a), so Key facts and performance measure figures behave alike.

### Q-76
Class: routine
Proposed: Confirmed as the prototype, each part. (a) A contact and a funding source keep "From <document name>" after a publish, for the people allowed to read it. (b) "Total from all sources" depends on the table's rows, not on publishing, so it stays. (c) The import's row stays in the change history. (d) The note leaves the review once none of the import's changes is waiting; it stays with the import's record. (e) Nothing leads from a published change to its document until the later story 29 — publishing changes what is public, not where a value came from (confidence: medium)
Digest: What of an import still shows after publishing? → The "From …" lines, the total row and the history row stay; the note leaves the review.
Changes: none beyond filling the stories (17, 18, 21, 22, 24).

### Q-77
Class: routine
Proposed: (a) Yes, at once: the right to open the document is checked each time against who can edit or publish the project now. (b) A deleted project's documents are deleted with it, and are gone for good when the deletion is. (c) The Manager sees that the document cannot be opened right now, with the change's quote and a way to try again; publishing is not blocked — access follows the project, and a missing file must not stop a review (confidence: high)
Digest: Document access lost, project deleted, or file not fetched? → Access ends at once; documents go with the project; the reviewer sees the quote and can retry.
Changes: none beyond filling the stories (03, 33). Part (b) follows the retention assumption in Q-45.

### Q-78
Class: routine
Proposed: The amount arrives empty and the sentence under the quote states both readings and why they differ ("The report gives 6 acres in the table and 12 in the summary."). The person types the figure, which ticks the change like any other empty one. No buttons and no choice control — a button for each reading is "Use suggestion" again, which was dropped (confidence: medium)
Digest: How are two readings offered? → Both stated in one sentence; the person types the figure. No buttons.
Changes: story 14, R4 and its scenario rewritten with Q-33; no new control.

### Q-79
Class: worth-a-look
Proposed: For the later story: (a) partners sit in their own section of the check step, named and placed as the project page's partner section. (b) A change is the organization only; no part in the project. (c), (h) A partner the workspace does not hold arrives flagged "Not in this workspace" and unticked, and the person picks an existing organization, exactly as for a funding source. (d) "Already on file" when the project already has that organization as a partner. (e) Added partners show in the project page's partner list with "From <document name>". (f) An organization named as funder and as partner is proposed once in each section. (g) Matched by the funding source rule, connected organizations included. (i) Adding saves the organization on the project, unpublished; one the project gained meanwhile is passed over; Undo, the review row and the change history treat it as a contact. (j) `project-record` owns a project's partner organizations, and the project page does not show them today. (k) Ready first, and the same partner twice in one reading is one change. (l) The service returns the organization's name and its quote, and is told nothing of the workspace. (m) Does not arise — reuse the funding source construction, since nothing is built to follow (confidence: low)
Digest: Partner organizations, the later story? → Reuse the funding-source pattern, organization only. It cannot be built until the project page has a partners list.
Changes: story 27 (later) gains a blocker: a partner organizations section on the project page, owned by `project-record`, which does not exist yet.

### Q-80
Class: routine
Proposed: For the later story: (a) a waiting or finished reading is found on the project page, as a line beside the Import a report entry, and opens the page at its state. (b) The person gets one notification when it finishes or fails. (c), (h) One reading per project at a time; a second "Read it" is refused while one is reading or ready; another person who can edit the project can see that one is waiting but not open it. (d), (g) A ready or failed reading is kept 7 days; "Add N changes", "Cancel", "Read another" and the time limit end it; a failed one can be read again without choosing the file again. (e) "Already on file" and totals to date are worked out again on return. (f) Ticks, edits and the note are kept. (i) A change the project can no longer take is marked on return, and a person who can no longer edit the project gets the no-access page and the reading is discarded. (j) The document is held from "Read it" under the kept document's access rules and deleted when the reading is discarded. (k) The page says the person may leave; an unattended reading may run 15 minutes — the smallest stored reading that still lets someone leave (confidence: medium)
Digest: Leave and come back to a reading, the later story? → One reading per project, found on the project page, kept 7 days with its ticks; one notice when done.
Changes: story 28 (later) filled; (j) amends enabler 03, R2 for that story only (the document is held from "Read it"). The 7 days falls under the retention question in Q-45.

### Q-81
Class: routine
Proposed: For the later story: (a) the document opens in place of the history list inside the same sheet, with "Back" to return. (b), (g) A file that cannot be shown or fetched says so and offers a download where the file exists. (c) It opens at its start. (d) Only people who can edit or publish the project are offered the control; anyone else sees the row as plain text. (e) The document's name in "N changes from <document name>" is the control; a pasted-text row opens the kept text the same way. (f) Yes, it still opens after a publish. (h) On a narrow screen it takes the sheet's whole width. (i) The document is shown whole; the import's changes are not listed there — the least new surface, and the one way back from a published change to its document (confidence: medium)
Digest: Opening the document from the change history, the later story? → The name on the row opens it inside the history sheet, whole, for editors and publishers, also after publish.
Changes: story 29 (later) filled. Consistent with Q-76 (e) and Q-77.

### Q-82
Class: worth-a-look
Proposed: (a) A figure in another unit than the measure's is flagged: the amount arrives empty and the sentence states the report's figure and the measure's unit ("The report gives 3,960 feet. This measure is in miles."); the person converts and types it. (b) The same for a total to date in another unit: flagged and empty, with no difference worked out. (c) The samples change, not the scenarios: the four rows that arrive converted are restated in the sample documents in the measure's own unit, so "6 ready to add" and "7 ready to add" stand. (d) No multiplication in the first release: "35 people for 4 hours" arrives flagged and empty with that sentence, and the person types 140 — spec #13 names a unit mismatch among the flagged cases, and the first release converts nothing (confidence: medium)
Digest: A figure in another unit, first release? → Flagged and empty for the person to convert; the samples are restated so the story counts stand.
Changes: fixes four rows of two sample documents and one row of the pasted paragraph in the prototype and `fixtures.md` (the paragraph's ready count drops by one); the 28 stories' counts for the crew log and funder report are unchanged. Story 14 gains the unit case; story 26 (later) will need samples with other units again.

### Q-83
Class: routine
Proposed: (a) Every screen of the feature meets WCAG 2.2 at level AA. (b) Yes: every error state in the feature follows one pattern — the message is written next to the control it concerns, tied to it for assistive technology, and announced once — AA is the level public agencies are held to and 2.2 already matches the touch-target rule the mobile spec cites (confidence: medium)
Digest: Which accessibility standard? → WCAG 2.2 AA for every screen; every error message sits by its control and is announced once.
Changes: `standing-requirements.md` gains the standard and SR-6 loses "inferred"; stories 09, 20, 30, 65 and 23 follow. If a client contract names another standard, that one replaces it.

### Q-84
Class: routine
Proposed: (a) From the press until the project page opens, "Add N changes" is disabled and reads as busy ("Adding…"), and the page's other actions and the changes cannot be used. (b) Yes: one press makes one import; a second press or a repeated request is ignored — a double save counts every figure twice (confidence: high)
Digest: "Add N changes" pressed twice? → The button goes busy and disabled; one press makes exactly one import.
Changes: none beyond filling the stories (01, 22). Consistent with Q-44.

### Q-85
Class: routine
Proposed: (a) When the person leaves, the service stops where it can; a reading that finishes anyway is thrown away and never stored. (b) The document that was sent is deleted as soon as the reading ends without "Add N changes": on leaving, "Cancel", "Read another" or a failure. Only an added import keeps its document. (c) Yes: a dropped connection is a failed reading like any other, with its own reason (Q-41) — keep nothing the person did not add (confidence: high)
Digest: A reading the person walks away from? → Its result and the document are discarded at once; a dropped connection is a failed reading.
Changes: none beyond filling the stories (01, 02, 03, 35). What the model provider itself retains is part of Q-52.

### Q-86
Class: routine
Proposed: (b) The exact time is kept. (a) Screens show the day alone, in the time zone of the person reading, as the product shows every other date — no new setting, and the kept time gives two imports on one day an order (confidence: medium)
Digest: Which clock gives an import its day? → The exact time is stored; each reader sees the day in their own time zone.
Changes: none beyond filling the stories (22, 24). Consistent with Q-94 and Q-53.

### Q-87
Class: routine
Proposed: (a) A performance measure entry that is "Already on file" arrives unticked; if the person ticks it on purpose it is added, because two equal entries can both be true. Reading the same report twice therefore adds nothing by default. (b) Yes: the check is made again when the button is pressed; a ticked entry that has become "Already on file" since the check step opened stops the import once, is unticked and marked, and the person presses again. (c), (d), (e) A Key facts field, a contact or a funding source that is "Already on file" has no checkbox, because adding it would change nothing; it is never recorded or counted as a change — an import's count must equal what it changed (confidence: medium)
Digest: Adding something the record already holds? → Entries arrive unticked and are re-checked on Add; facts, contacts and funders already on file cannot be ticked.
Changes: stories 15, 17, 18 and 32: "Already on file" loses its checkbox for the three kinds where adding changes nothing; story 01 gains the re-check. Consistent with Q-44, Q-48, Q-50.

### Q-88
Class: needs-you
Proposed: Working assumption: (a) the development team provides one test environment whose reading service is a stand-in that returns the recorded readings for the three sample documents, and the client's testers use that same environment. (b) That environment has a reset, outside the product, that returns the sample project to its starting state; testers do not depend on Undo — who hosts and pays for the environment, and whether client testers may use it, is for the organization to say (confidence: low)
Digest: Who provides the test environment, and how is a test reset? → Assumed: the development team's environment with recorded readings and a reset of the sample project.
Changes: every story's Reset line reads "reset the sample project in the test environment" on the assumption; all 34 stories that cite it stay `needs-info` until confirmed.

### Q-89
Class: routine
Proposed: (a) The service is told the project's performance measures and fields, as today, and nothing about the project's funding sources and contacts or the workspace's organizations and people; it returns what the document names and every match is made by the check step in code. (b) For a funding source: grant or program, organization name, amount secured, quote and page. For a contact: name, role, organization, email, quote and page. (c) "Unsure" is not a fourth verdict: a figure either counts what the measure asks, or comes back unsettled with its reason, and the check step shows every unsettled one as flagged — send the model as little as the job needs, and let code decide (confidence: medium)
Digest: What is the reading service told and what does it return? → Told only the project's measures and fields; returns what the document names; matching is done in code.
Changes: none beyond filling the stories (02, 14, 17, 18, 75). Bears on Q-52: no names or emails from the workspace are sent.

### Q-90
Class: routine
Proposed: A breakdown question arrives answered only when the document states one of its options; otherwise unanswered, for the person to set or leave. No inferred answers. Rows C5 and P3 arrive unanswered and without their note — never present a guess as a fact (confidence: high)
Digest: May a breakdown answer be inferred? → No. Unanswered unless the document states it.
Changes: story 07 keeps the rule as harvested; `fixtures.md` rows C5 and P3 and the two prototype samples are corrected.

### Q-91
Class: routine
Proposed: A total to date lower than what the record holds is flagged: the amount arrives empty, unticked, and the sentence states both figures ("The report says 12,400 to date. The record holds 12,577."). It is not "Already on file" and shows no arithmetic line. Only an equal total is "Already on file" — the report and the record disagree, and the person must see that (confidence: high)
Digest: A total to date lower than the record's? → Flagged, with both figures stated; not "Already on file".
Changes: story 13 gains the rule and a scenario; the prototype's "= 0" line is a bug.

### Q-92
Class: routine
Proposed: Yes. Clearing the figure of a change that ticked itself unticks it again; a change the person ticked by hand stays as they left it — the tick should follow the figure that caused it (confidence: high)
Digest: Emptying a figure that ticked the change? → It unticks again.
Changes: story 14, R6 filled.

### Q-93
Class: routine
Proposed: The note cannot be changed or removed once the import is added. Undo, while the toast is there, removes it with the import; otherwise it stands as written until the changes are published — it is a short message to one reader, and editing it would need a new place to do so (confidence: medium)
Digest: Can the note be edited after adding? → No; only Undo removes it, with the import.
Changes: none beyond filling the story (story 21).

### Q-94
Class: routine
Proposed: An import's row sits among the other rows by its time, latest first, like any other change; a hand edit made after an import shows above it — the prototype's order is an accident of its sample data (confidence: high)
Digest: Where does an import sit in the change history? → In time order with every other change.
Changes: none beyond filling the stories (22, 23). Relies on the time kept in Q-86.

### Q-95
Class: routine
Proposed: For the later story: an amount is held to the measure's own decimal places, on the check step and on the record. A converted figure that would round to zero at that precision is not proposed as zero: the change is flagged and empty, and the sentence states the report's figure and that it is less than the measure can record. The "Converted: …" line shows the same figures as the amount, never more or fewer decimals — a record cannot hold more precision than the measure allows, and "= 0 miles" beside 0.0023 is false (confidence: medium)
Digest: A converted figure too small to show (later)? → Flagged, not rounded to zero; the amount and its line always show the same figure.
Changes: story 26 (later) filled.

### Q-96
Class: routine
Proposed: A message goes as soon as its field is corrected or its change is unticked, and every message is worked out afresh on the next press — a message beside a field that is now right is a false statement (confidence: high)
Digest: When does an error message go? → As soon as the field is fixed or the change is unticked.
Changes: none beyond filling the stories (30, 65). Consistent with Q-68 and Q-83.

### Q-97
Class: routine
Proposed: Two rows. Each imported entry is its own row in the review, with its own "From <document name>" button, even when two imports add entries for the same performance measure and reporting period; the one-row rule is for a field, which holds one value, and an entry is a separate thing that adds to a total — folding them would hide one document from the Manager (confidence: medium)
Digest: Two imports add entries for the same measure and period: one review row or two? → Two rows, each opening its own document.
Changes: stories 24 and 33 filled; story 51 stays about fields only; `publish-review`'s fold rule is stated as "fields, not entries".
