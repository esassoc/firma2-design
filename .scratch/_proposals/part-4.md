# Proposals, part 4: Q-131 to Q-159

Written 2026-11-23. Covers all 29 open questions of the range: Q-131 to Q-150 and Q-157 to Q-159 (Import a report), then Q-151 to Q-156 (nested classification groups, which sit in the same number range under another feature), at the end of the file.

**One Undo rule, used by Q-135, Q-137, Q-138 and Q-157.** "Undo" takes off the record exactly what that import itself put there and that is still as the import left it. Anything a person changed or removed afterwards stands as that person's own change. A thing the import was passed over for because the record already held it was never the import's, so it stays. A field goes back to the value it would hold had the import never been added. The toast counts what was really removed. "Undo" either does all of this or nothing; when it does nothing the person is told and can press it again. This assumes the answers, outside this range, that a change the record already holds is passed over and not counted (Q-87, Q-99) and that a hand edit made after an import stands (Q-75 (a)).

### Q-131
Class: routine
Proposed: (a) Connected organizations are offered and matched exactly like the workspace's own, since a connected workspace acts as an organization (ADR 0002). (b) The list is every organization the person can see in the workspace's organization directory, whichever they belong to; nothing else is left out, and the report's name is matched against that same list. (c) The list is in one order, A to Z by name, and the person can type to find one. (d) A picked organization can be changed to another but not cleared; a funding source is left out by unticking it, as story 75, R1 says — a funder is rarely the person's own organization, so the list cannot be narrowed to theirs, and typing is needed at 38 or more names (confidence: medium)
Digest: Which organizations a funding source can pick → all the person can see, connected ones included, A to Z, type to find; change the pick but not clear it.
Changes: none beyond filling stories 17 and 75 (story 75, R1 gains the order and typing to find). Consistent with Q-133 and Q-134.

### Q-132
Class: routine
Proposed: Both are proposed, flagged and unticked, never dropped. With no organization, "Organization" arrives empty and the change reads "The report names no organization for this funding source. Pick one, or leave this out." (it does not use the "Not in this workspace" sentence, which would quote an empty name). With no amount, "Secured ($)" arrives empty and the change reads "The report gives no amount for this funding source.", as an unsure figure does in story 14; typing an amount and picking an organization make it ready. A funding source is never added without both — nothing the report states is dropped silently, and nothing arrives as a guess (spec #13) (confidence: high)
Digest: A funding source read with no organization or no amount → proposed but flagged and empty; the person fills it in or leaves it out.
Changes: none beyond filling stories 17 and 75; story 65 already stops an import on an empty organization or amount.

### Q-133
Class: routine
Proposed: (a) Exact matching is the rule: letter for letter, ignoring upper and lower case and spaces at either end. No near match is offered or suggested; an abbreviated funder arrives "Not in this workspace" and the person finds the right one by typing in "Organization" (Q-131). (b) It cannot occur: two organizations of one workspace may not have names that differ only in capitals, which `organizations-admin` holds; if a match were ever ambiguous the change is flagged for the person to pick. (c) "Already on file" follows the edit: it is worked out again whenever the person changes the name or the organization, and once more when "Add N changes" is pressed — a near match is a guess presented as a fact, and a badge that no longer describes the change misleads (confidence: medium)
Digest: How a funder's name is matched → exactly, ignoring capitals; no near matches offered. "Already on file" updates when the person edits the name or organization.
Changes: story 17, R7 and R8 become decided, and R7 gains "worked out again after an edit". Consistent with Q-87 (checked again on adding) and Q-131.

### Q-134
Class: routine
Proposed: The case cannot occur, so no rule is needed for it. A funding source on the record points at its organization, not at the organization's name as text: a rename follows through, a connected organization counts as held (Q-131), and an organization named by a funding source cannot be removed while it is. "Already on file" therefore compares the funding source's name and the organization the report's name was matched to, not two pieces of text — matching text against text is what breaks on a rename (confidence: medium)
Digest: A funding source whose organization the workspace no longer holds → cannot happen; a funding source points at the organization itself, so renames follow.
Changes: story 17, R7 is reworded to compare the matched organization. It hands two rules to whichever feature comes to own funding sources and organizations (Q-16): an organization in use by a funding source cannot be removed.

### Q-135
Class: worth-a-look
Proposed: Toast-only "Undo" stands. To keep it workable, one story is added to the first release: on the project page, anyone who can edit the project can edit and remove a funding source row and a contact row, whether an import or a person added it; each change saves at once and waits for publish like any other edit (spec #1). (a) Yes, as any other; `project-record` owns the two controls because it owns the project page, and funding sources and contacts from an import do not ship without it. If that story has to be cut down, the least that keeps the decision workable is "Remove" on each row. (b) An imported row edited by hand keeps "From `<document name>`" for as long as its import exists, and the review marks the figure as changed from the document's (spec #36). (c) Yes: toast-only "Undo" is acceptable once those rows can be corrected by hand; without the story it is not, because a wrong imported amount could never leave the record — totals must be correctable, and the page already shows "Add source" and "Add contact" unwired, so this is surface the product intended (confidence: medium)
Digest: Undo is toast only, but imported funding sources and contacts cannot be fixed by hand → add one story: edit and remove those rows on the project page.
Changes: adds one first-release story, owned by `project-record` ("edit or remove a funding source or a contact on the project page"); stories 17 and 18 gain it as a dependency for release, and story 23, R6 loses its "Not decided". Keeps the user's decision that Undo is toast only. Consistent with Q-137 (c).

### Q-136
Class: routine
Proposed: One rule: the document's name is part of the document, so it is shown only to people who can edit or publish the project, on every screen, before and after a publish. (a) Anyone else, a Viewer included, never sees the name. (b) The "From …" line never reaches the public page or any published view. (c) In its place: a funding source or contact row is shown without the line; a change history row reads "`<N>` changes from a document", for a file and for pasted text alike. The name is also left out of the data sent to those people, not only hidden on screen — it is what spec #19 and enabler 03, R5 already say; file names often carry a funder's or a person's name (confidence: high)
Digest: Who sees the document's name → only people who can edit or publish the project. Everyone else sees the row without it, or "from a document".
Changes: none to the written decision. Stories 17 (R9), 18 (R4), 22 (R7) and 24 each gain one requirement and a scenario for a person who can neither edit nor publish; enabler 03, R5 loses its "Not decided".

### Q-137
Class: worth-a-look
Proposed: The Undo rule at the top of this file. (a) A performance measure figure corrected by hand since the import stands whole, as the person's own figure; "Undo" does not touch it. (b) An entry already removed by hand is passed over. (c) The same for a funding source or a contact: one edited by hand since stays, and loses its "From …" line because its import is gone; one already removed is passed over. In (a) to (c) the toast counts what was really removed and says what stayed: "4 changes removed. 2 you changed since were kept." When nothing is left to remove it reads "Nothing removed. You changed every one since." The import, its note, its change history row and its kept document go in every case. (d) An import already taken back from another window: the toast closes and a message reads "This import was already undone." (e) All or nothing: if any part cannot be taken back, nothing is, and the person is told and can try again (Q-157) — a person's later edit is never lost, a figure is never counted twice, and a toast never states a count that is not true (confidence: medium)
Digest: Undo after things changed → removes only what is still as the import left it; your later edits stay; the message counts what was really removed.
Changes: story 23, R2 and R3 and story 41, R1 and R2 are rewritten on this rule and gain about four scenarios (story 23 passes eight, so the hand-changed cases may be split into their own story). Reverses the prototype for a Key facts field, where the hand edit was lost. Depends on Q-75 (a) being answered "the hand edit stands" and on Q-87 and Q-99 passing over what the record already holds; consistent with Q-135, Q-138 and Q-157.

### Q-138
Class: routine
Proposed: Yes. After an "Undo", a field holds the value it would hold had that import never been added: the value of the latest change that remains (a later import or a hand edit), and when none remains, the value from before the earliest import that is now gone. So with two imports both taken back, in either order, the field returns to what it held before both — "leaves the project as it was before" is the story's own promise, and a value from an import that no longer exists has no source (confidence: high)
Digest: Two imports set one field and both are undone → the field returns to its value from before both, whichever is undone first.
Changes: story 41, R3 gains this sentence and one scenario. Part of the one Undo rule (Q-137).

### Q-139
Class: routine
Proposed: (a) The name stays "pasted text". Two such imports are told apart by the person and the day, which every screen that names a document already shows beside it once the note's line carries the day (Q-144); two by one person on one day are told apart by opening them. (b) The text is kept exactly as it stood when "Read it" was pressed, unchanged. The cut into paragraphs is only how it is displayed — a kept document is the evidence behind a published figure and must not be altered; a made-up name from the first words would add wording to five screens for a rare case (confidence: medium)
Digest: Pasted text as a document → still named "pasted text", told apart by person and day; the text is kept exactly as pasted.
Changes: none beyond filling story 40 (R3: the original is kept unchanged; the paragraphs are a display rule). Consistent with Q-144 and Q-158.

### Q-140
Class: routine
Proposed: The import is refused: changes, the import's record and its document are saved together or not at all. The person stays on the check step with every tick, edit and the note as they were, and reads "Couldn't add the changes because the document couldn't be saved. Nothing was added. Try again." — a change that names a document nobody can open breaks the promise that every imported figure leads back to its source (spec #19) (confidence: high)
Digest: The document cannot be saved → nothing is added; the person stays on the check step, keeps their work and can try again.
Changes: none beyond filling enabler 03, R1. Consistent with an import being all or nothing (Q-44).

### Q-141
Class: routine
Proposed: One wording for the same kind of thing, and `publish-review` owns it: the review has one renderer for every row (spec, "How a change reads in review"). An imported row is worded as a hand-made one: an entry is "`<Measure>`, `<reporting period>`"; a funding source is labelled with the grant's name and reads "`<amount>` from `<organization>`". The import records the parts of each change (measure, period, name, organization, amount), not a finished label, and the check step keeps its own labels — the Manager judges the change, and how it arrived is already said by the source line (confidence: medium)
Digest: Review rows typed by hand or imported → worded the same way, in the review's own wording.
Changes: story 24, R1 and story 22, R2 are reworded (the import records parts; the review words the row). The label "Funding source" no longer appears on a review row, which settles that part of Q-98.

### Q-142
Class: routine
Proposed: Imported rows keep "`<who>` · `<day>`" and their "From `<document name>`" button on a project that has never been published. Hand-edit rows there stay without them — the import's person and day are real facts about that change, and every change carries its source (spec #5) (confidence: medium)
Digest: A never-published project in review → imported rows still show who added them, the day and the document.
Changes: none beyond filling story 24, R2.

### Q-143
Class: routine
Proposed: The row shows the value now on the record, which is the hand edit's, with the person and day of the hand edit. It keeps the "From `<document name>`" button, so the Manager can compare, and carries the review's existing marker that the figure was changed from the document's (spec #36). A row that stands for two imports and then a hand edit does the same, with the later import's document — the latest change decides what the row says, and the document stays reachable because it is still the reason the field changed (confidence: medium)
Digest: Imported value then edited by hand → the review shows the hand-edited value and its editor, keeps the document button, and marks it as changed from the document.
Changes: story 24, R4 and story 51, R1 lose their "Not decided" and gain one scenario each. If "Undo" took the import back (Q-137), the row is a plain hand edit with no button.

### Q-144
Class: routine
Proposed: The line under a note carries the day: "`<who>` · `<day>`, with `<document name>`", written as the rows write it, so a note and its rows match on person, day and document. The note stays above the changes; it is not moved beside its rows. Two imports of one name by one person on one day stay alike, which is accepted as rare — one added word settles nearly every case without a new layout (confidence: medium)
Digest: Telling which rows a note is about → the note's line also shows the day, matching the rows.
Changes: story 21, R6 is reworded and R7 loses its "Not decided". Consistent with Q-139 (a).

### Q-145
Class: routine
Proposed: Yes. Pressing the button of the row whose document is open closes the document, and keyboard focus stays on that button — a control marked as expanded is expected to collapse on a second press (confidence: high)
Digest: Pressing an open document's button again → closes the document.
Changes: story 33, R1 is corrected; story 80, R3 gains this as a fourth way to close.

### Q-146
Class: routine
Proposed: Escape closes the open document from anywhere in the review, unless a menu or dialog is open, which takes Escape first. On a wide screen focus stays on the row's button, as now, so the Manager can go on to the next row — moving focus into the document would break going from row to row (confidence: medium)
Digest: Escape with the document open beside the review → closes it wherever focus is.
Changes: story 80, R3 loses its "Not decided".

### Q-147
Class: routine
Proposed: The amount arrives empty and the change is flagged with "The report gives `<figure>` with no unit. This measure is in `<unit>`.", as the funder report's seed row does. The figure is never written into the amount — a figure with no unit is an unsure reading, and an unsure reading is never pre-filled (spec #13) (confidence: high)
Digest: A figure with no unit (later release) → flagged with an empty amount and a sentence saying no unit was given.
Changes: later story 26, R8 gains this case; story 14, R2 is unchanged. Consistent with Q-33.

### Q-148
Class: routine
Proposed: Both lines show, in the order the arithmetic was done: the conversion ("18,480 feet = 3.5 miles"), then the difference ("3.5 to date − 3 on record = 0.5") — the person checks the amount against the report's own figure, and that figure appears only in the conversion line (confidence: high)
Digest: A total to date in another unit (later release) → show the conversion line, then the difference line.
Changes: later story 26, R2 loses its "Not decided"; story 13 is unchanged in the first release.

### Q-149
Class: routine
Proposed: Yes, the person is told in both cases. A dropped breakdown answer adds the note "The report's answer “`<answer>`” isn't an option for `<question>`, so it's left unanswered."; the change is not flagged for it, because an answer is optional. A figure flagged for low confidence carries the note "The reading wasn't sure of this figure. Check it against the document."; no level of confidence is shown — a change must never wait on the person, or differ from the document, without saying why (confidence: medium)
Digest: A check quietly changes the reading (later release) → the change gets a note saying what was done; a dropped answer does not flag it.
Changes: later story 50, R3 and R6 gain the two notes. Keeps the user's decision of no confidence levels.

### Q-150
Class: routine
Proposed: Listed under "Not used", with a line the check writes, after the reading's own lines: "`<Field>`: `<value>`. This project has no `<Field>` field." and "Timeline: `<as read>`. A timeline needs a start year and an end year." — nothing the report states is dropped silently (story 19), and the sample already words the first case this way (confidence: high)
Digest: A Key facts value the checks turn away (later release) → listed under "Not used" with the reason, not dropped.
Changes: later story 50, R4 and R5 change from "dropped" to "listed under Not used"; story 19 is unchanged.

### Q-157
Class: routine
Proposed: (a) The person reads "Couldn't undo this import. Nothing was removed." (b) "Undo" is offered again on the same toast: the toast stays, and "Undo" is switched off only while the taking back runs, so it cannot be pressed twice. There is no second home for "Undo". (c) The right to edit is checked again when "Undo" is pressed. A person who has lost it reads "You can no longer edit this project, so the import stays." and the toast loses "Undo". (d) Yes: the first toast goes only once the taking back has succeeded, and "`<N>` changes removed" then takes its place — a failed "Undo" must not silently leave the import on the record with no way to try again (confidence: medium)
Digest: Undo itself fails → the message says nothing was removed and Undo stays on it to try again; someone who lost edit rights is told the import stays.
Changes: story 23, R2 is amended (the toast no longer goes at the press; "Undo" is switched off while it runs) and gains two scenarios. Keeps the user's decision that Undo is on the toast only. Part of the one Undo rule (Q-137 (e)).

### Q-158
Class: routine
Proposed: (a) The pane is headed "Pasted text". (b) Pasted text has no page label; its paragraphs sit directly under the heading — the same words twice add nothing, and pasted text has no pages (confidence: high)
Digest: Pasted text beside the changes → headed "Pasted text" once, with no page label.
Changes: none beyond filling story 31, R2 and story 04, R9.

### Q-159
Class: worth-a-look
Proposed: (a) Nothing is defined for the whole funder report on a partly built product, and no script is run that way. (b) Each story's script runs against a narrow recorded sample that needs only that story and its blockers. The whole funder report stays as the end-to-end script, run once every story of the epic is built. Ten samples, each its own invented file with its own recording; rows are the funder report's unless said, and none uses the two converted rows, so none waits on the unit question:

| Sample | Holds | Counts | For stories |
|---|---|---|---|
| `deer-creek-treatments-2025.pdf` | two ready entries: invasive removal 4.2 acres read from page 1, trees planted 1,850 from page 3 | 2 ready; "Add 2 changes" | 31, 33, 80, 03; the second import of 21, 22, 23 |
| `deer-creek-total-to-date-2025.pdf` | F3, F6 | 2 ready; "Add 2 changes" | 13 |
| `deer-creek-flagged-figures-2025.pdf` | F3, F7, F8, F9 | 1 ready, 3 need you; "Add 1 change" | 14, 36 |
| `deer-creek-key-facts-2025.pdf` | F1, F2, F3 | 2 ready, 1 already on file; "Add 2 changes" | 15, 16 |
| `deer-creek-funding-2025.pdf` | F3, F10, F11 | 2 ready, 1 already on file; "Add 2 changes" | 17 |
| `deer-creek-funding-unheld-2025.pdf` | F3, F10, F11, F12 | 2 ready, 1 need you, 1 already on file; "Add 2 changes" | 75, 65, 36 |
| `deer-creek-contacts-2025.pdf` | F3, F13, F14 | 2 ready, 1 already on file; "Add 2 changes" | 18 |
| `deer-creek-all-kinds-2025.pdf` | F1, F3, F11, F14: one ready change of each kind, nothing flagged | 4 ready; "Add 4 changes" | 41, 51 |
| `deer-creek-not-used-2025.pdf` | F3, with the funder report's "Not used" lines (the coordinates among them) and its "Skipped" line | 1 ready; "Add 1 change" | 19, 11 |
| `deer-creek-timeline-update-2026.pdf` | one Key facts change, Timeline 2023–2026 | 1 ready; "Add 1 change" | the second import of 15, 41, 51 |

— a story that can only be tested once five others are built cannot be accepted on its own (confidence: medium)
Digest: Stories tested against one report that mixes every kind of change → add ten small recorded samples, one per kind, so each story is tested alone.
Changes: no story is added or removed. `fixtures.md` gains ten samples and their recorded readings; the scenarios and scripts of stories 03, 11, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 31, 33, 36, 41, 51, 65, 75 and 80 are re-pointed and their counts rewritten (story 41 reads "Add 4 changes", not 7). The exact tally wording for a count of one follows Q-110; who serves the recordings is Q-88.

## Nested classification groups (Q-151 to Q-156)

Proposed from `.scratch/classifications/spec.md` (decisions 1 to 5) and the prototype.

### Q-151
Class: routine
Proposed: Yes. A group may hold classifications and groups together; its section shows its own classifications first, then the groups inside it, as the prototype does — the workspace decides the shape of its tree (spec decision 1), and forbidding the mix would force an empty wrapper group around a lone classification (confidence: medium)
Digest: May a group hold both classifications and groups → yes, classifications listed first, then the groups.
Changes: none beyond filling the add and move rules for groups.

### Q-152
Class: routine
Proposed: No target on a group's page. Each performance measure there reads reported against what its projects planned, as the prototype does — a group has no targets of its own (spec decision 4), and adding up targets due in different years would state a figure nobody set (confidence: high)
Digest: Should a group's page show a target → no; it shows reported against planned.
Changes: none; follows the written decision.

### Q-153
Class: routine
Proposed: Keep the prototype's rule: a group can be removed only once it holds no classifications and no groups, and until then "Remove" is not offered and the page says what it still holds — the spec already names removal as offered only once the group is empty, and removing a branch whole could unfile many projects in one press (confidence: high)
Digest: Removing a group that still holds something → refused until the group is empty.
Changes: none; follows the spec.

### Q-154
Class: routine
Proposed: Unique in the whole workspace, ignoring upper and lower case, as the prototype does — a group's name appears alone, without its path, in places such as a map legend or a dashboard dimension, and loosening the rule later is easy while tightening it is not (confidence: medium)
Digest: Must a group's name be unique → yes, across the whole workspace.
Changes: none beyond filling validation on add and rename.

### Q-155
Class: routine
Proposed: Not in the first release. The public sees classifications as it does today; a group has no public page and public filters offer no groups. A public group page is a later story — the spec says "Visitor: not yet", and nothing public should appear that no one decided to publish (confidence: medium)
Digest: Does the public see groups → not yet; public pages stay as they are, and a public group page is later.
Changes: adds one `later` story to `public-site` (a group's public page and group filters).

### Q-156
Class: worth-a-look
Proposed: Every top-level group is offered as a map colouring and as a dashboard dimension, and it colours or splits by whatever sits directly inside it, groups or classifications. Deeper levels are not offered in those two places; a group's own page already reads one branch. Nowhere else does a group act as a filter or colour — it turns the sample's convention into one rule without adding a setting (confidence: low)
Digest: Where a group acts as a colour or filter → each top-level group is a map colouring and a dashboard dimension, split by what sits directly inside it.
Changes: `map` and `progress-dashboard` requirements name "top-level group" where they now name two sample groups.
