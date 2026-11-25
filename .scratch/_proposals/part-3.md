# Proposals, part 3: Q-98 to Q-130

Written 2026-11-23. 33 questions, all open, all proposed. None needs the user for a fact.

Interface wording quoted below is provisional: it states what the message must say and goes through the `microcopy` skill before it is written into a story.

Answers outside this range that these proposals lean on (each is named again in `Changes`):

- Q-87 and Q-48: "Add N changes" looks at the record again when it is pressed, and never saves in silence something the record already holds.
- Q-33 and Q-78: a change the report supports two readings of arrives with an empty amount and both readings offered.
- Q-50: a funding source the record already holds with another amount is proposed as a change to that row's amount.
- Q-63: the changes of a report that names another project arrive unticked.
- Q-70: a spatial file is handed over when the person follows the link, not when it is chosen.
- Q-83, Q-96, Q-68: a message sits by its control, is announced once, and goes as soon as its cause is put right; a stopped import moves focus to the first failing field.
- Q-38: Import a report reads no .zip.

---

### Q-98
Class: routine
Proposed: Every label and every sentence the product words takes the workspace's word. (a) The section headings take it ("Performance measures", "Funding sources", "Contacts", each in the workspace's plural). (b) So do the labels "Funding source" and "Contact · `<role>`", the field "Organization" and the row label "Contact". (c) So do sentences, with the workspace's word in the form the sentence needs (singular or plural, lower case inside a sentence): "“`<name>`” isn't an organization here…", "This report names another project", "Total from all sources" (which names no renameable noun and is unchanged). (d) The reading service does not word reasons. It returns each "Not used" item in the report's own words plus one reason from a fixed set (no measure asks for it; the project has no such field; not a contact or a funder; location changes only from a spatial file), and code writes the reason's sentence with the workspace's words. — SR-4 already says a label shows the workspace's word, a sentence that says "organization" beside a heading that says "Partner" would read as two different things, and a model must not be the one that words the interface (confidence: medium)
Digest: Do labels and sentences use the workspace's own words for Project, Organization and so on? → Yes, everywhere; code, not the model, words the "Not used" reasons.
Changes: SR-4 stops being `inferred` for this feature. Story 19, R1 and R2: the item stays in the report's words, the reason is no longer "in the reading's words". Enabler 02 gains the fixed set of reasons. Consistent with Q-129 (b) and Q-99 (g). Q-141 (the review row's label) should follow the same rule.

### Q-99
Class: worth-a-look
Proposed: Nothing is saved twice by default, and nothing is dropped without the person seeing it. Three rules, then the lettered cases.
Rule 1, "the same thing": two changes are the same thing when they are the same performance measure, reporting period and breakdown answers; the same Key facts field; the same contact (the test story 18 uses for "Already on file"); the same funding source name and organization (the test story 17 uses).
Rule 2, inside one reading: code compares every change with the changes before it, not only with the record. Where the record can hold the thing once only (a Key facts field, a contact, a funding source row), two changes with the same value are folded into one change that shows the first place's quote and "Also stated: `<the other place>`". Where the record can hold it many times (performance measure entries), the later one is kept in the list but arrives flagged and unticked, its amount as read, with the reason "Also stated at `<place of the first>`. Tick it only if it is separate work." Two changes for the same thing with different values all arrive flagged and unticked, each naming the other's value.
Rule 3, on "Add N changes": the record is looked at again at the press (Q-87), by the same tests. The import's count, in the button, the toast, the change history and the review, is the number of things it actually wrote.
(a) Two identical performance measure entries in one reading: both listed; the first is ready, the second flagged and unticked as in rule 2. By default one entry is saved and the total counts the figure once. The person can still tick the second when the report really counts two pieces of work. The reading service is also required to return a restated figure once and to add separate lines of one table together (the adding of Q-118), so this is the net under it, not the usual path.
(b) One period's amount and a total to date for the same measure: the period's amount is the change. The total to date is worked out against the record plus that amount. If nothing is left, it is not a second change; the period's change gains the line "Agrees with the report's total to date: `<total>`". If something is left, or the record would exceed the total, the total to date is listed as a second change, flagged and unticked with an empty amount and the arithmetic in full ("12,400 to date − 10,727 on record − 1,850 in this report = −177"), for the person to settle. Two totals to date for one measure: the same total twice is one change (a total cannot be separate work); two different totals are both flagged and unticked with empty amounts.
(c) Two values for one Key facts field: the same value twice is one change. Two different values are both listed, flagged and unticked, each saying "The report also gives `<other value>`." Ticking one unticks the other, so one value at most is added.
(d) Two contacts with one email: one change, from the first place, with "Also stated: …". One contact is added and counted.
(e) Two funding sources with the same name and organization: the same amount twice is one change (a grant restated in a summary and a table). Different amounts are both listed, flagged and unticked, each naming the other's amount. One at most can be ticked, and its amount can be edited, so two awards of one grant are entered as their sum by the person, never added up by the product on a guess.
(f) Across imports and after edits: at the press, a ticked change that the record now holds with the same value is passed over and not counted; a ticked funding source whose row now exists with another amount becomes a change to that row's amount (Q-50), counted once; a change the person edited into a match is tested the same way. If the press would write fewer changes than the button said, nothing is saved, the affected changes are re-marked ("Already on file", or "Was `<amount>`"), and the person presses again on a true count. "Undo" takes back only what that import wrote: if a later import has changed the same funding source row, the row stays with the later import's amount and its "From `<document name>`" line names the later document; undoing the later import puts back the amount it found.
(g) A line returned twice under "Not used" or "Skipped" is shown once (same text once case and outer spaces are ignored).
— The product exists so that totals reported to funders are true: a figure counted twice is the worst failure it can have, and a repeat thrown away unseen is the second worst. Flagging keeps the person as the one who commits (confidence: medium)
Digest: The same thing twice, in one report or across imports → Never saved twice by default: repeats fold or arrive unticked, conflicts are flagged, adding rechecks the record.
Changes: Costs real build effort. Stories 01 (R11), 04 (R3), 13 (R1, R4, R7), 15 (R7), 17, 18 (R6), 19 (R1), 32 (R2, R5) and 41 each gain a requirement and a scenario; story 15, R5 changes, since a Key facts change can now be flagged (kept still wins, Q-126 (d)). Enabler 02 gains "a restated figure is returned once". The flagged repeat keeps its amount, which is a stated exception to "a flagged change arrives empty" (Q-33): the reading is sure of the figure, only not of whether to count it. Depends on Q-87 and Q-48 (the check at the press) and Q-50; if either is answered otherwise, (f) changes with it. The sample funder report's 1,850 and 12,400 for one measure fall under (b) and its fixture rows change. Bears on Q-110 (flagged repeats count under "need you") and Q-91 (a total lower than the record's is flagged the same way).

### Q-100
Class: routine
Proposed: (a) Yes: the held file is listed with its name and size and can be removed; the control is then empty, with no message until "Read it" is pressed. (b) A drop of several files is refused: nothing is taken, a file already held stays held, and the control says that one file is read at a time ("Drop one file at a time."). — One document per import is decided (spec #20), and taking "the first" of several picks a document the person did not choose (confidence: medium)
Digest: Taking a chosen file out again, and several files dropped together → It can be removed; a drop of several is refused with a message.
Changes: Story 01, R5 gains the refusal. The shared file control keeps the first file today, so the page must handle the drop itself or the hub control gains a single-file refusal (a hub request, not a spoke edit). Consistent with Q-104.

### Q-101
Class: routine
Proposed: (a) Yes: each imported entry is a row in the performance measures' change log, like a hand entry. (b) The row names the document ("From `<document name>`") and carries the import's person and day. (c) "Undo" removes the import's rows; it leaves no added-then-removed pair. — Spec #5 says every change carries its source and the log shows it; story 23 already says an import taken back is no longer recorded anywhere (confidence: medium)
Digest: Do imported entries show in the performance measures' own change log? → Yes, each naming its document and importer; Undo removes those rows.
Changes: Story 01 gains the row's source; story 23, R2 and R7 extend to this log. `performance-measures` owns the log and gains "a row shows its source". The document's name there follows Q-136 (who may read it).

### Q-102
Class: routine
Proposed: The file control shows the dropped file as if it had been chosen there, with its name and size, so it can be seen, replaced, removed and read again. — "Read it" must never act on a file the person cannot see (confidence: high)
Digest: A file dropped on the project page, once back on the choose step → The file control shows it like any chosen file.
Changes: none beyond filling stories 08 and 35; story 10, R4 stands.

### Q-103
Class: routine
Proposed: The project page swallows every dropped file, so the browser never opens one in place of the page. A file Import a report does not read starts nothing, the page stays as it was, and a toast says why: for a spatial file, that shapes are added with Upload shapes; for anything else, "That file can't be read as a report." — Losing the project page to a stray drop is a loss of the person's place, and a drop that does nothing reads as broken (confidence: medium)
Digest: A file dropped on the project page that is not a report → The page stays put and a short message says the file can't be read as a report.
Changes: Story 08 gains the message and may now say "the project page stays as it was". No hand-off from the project page: the box on the choose step stays the one place that hands a spatial file over (Q-106).

### Q-104
Class: routine
Proposed: One message at a time under the file control; the latest event's message replaces the one before it. (a) A too-large file is refused and does not put out the file already held, which stays listed by name; the size message names the refused file. (b) So the size message and a page message never show together. (c) and (d) Every message goes when the control's content changes (a file chosen, replaced or removed), when a reading starts, and when the person switches between "File" and "Paste text"; none survives a reading and "Read another". — A message must describe the control as it is now; a stale one under an empty control is false (confidence: medium)
Digest: Messages under the file control → One at a time, cleared whenever the file changes or a reading starts; a too-large file never replaces the file already chosen.
Changes: Story 10 gains the rule. The size message is the shared control's own and reads "File exceed 20 MB limit"; correcting its words is a hub request. Same rule as Q-108 and Q-96.

### Q-105
Class: routine
Proposed: The message shows by the text area, where "Paste the report text first." shows: "Couldn't read the pasted text. `<reason>`". The text stays in the text area and "Read it" reads it again. It is announced once and goes when the text is edited or a reading starts. — Today the message is written where nobody can see it (confidence: high)
Digest: A reading of pasted text that fails → The message shows by the text area; the text stays and can be read again.
Changes: none beyond filling stories 09 and 10. The reasons are Q-41's.

### Q-106
Class: worth-a-look
Proposed: Upload shapes' own list and limit decide what is handed over; Import a report keeps no second list. Today that is a .zip (a zipped shapefile or a zipped .gdb folder) up to 50 MB.
(a) Two groups. A .zip is handed to Upload shapes. A .geojson, .kml, .kmz, .gpkg or bare .shp is not handed over, because Upload shapes would refuse it: the box still shows "That's a spatial file", says what Upload shapes takes (a zipped shapefile, with its .shp, .shx, .dbf and .prj together, or a zipped .gdb folder), and its link opens Upload shapes empty. If `work-areas` later takes more kinds, they move to the handed group with no change here.
(b) Whether a file is spatial is decided before its size. The 20 MB limit is for reports only. A .zip is held up to 50 MB, Upload shapes' limit, and one over 50 MB is refused with a message naming that limit. The five endings that are not handed over are never held, so no size applies to them.
(c) A handed file that Upload shapes refuses is refused there, in Upload shapes' own "This file was not accepted" message, exactly as if the person had chosen it there.
(d) After Upload shapes, finished or cancelled, the person is on the project page. They are not returned to Import a report; nothing was read, so nothing is waiting there.
(e) Yes, every .zip goes that way, because Import a report reads no .zip. But the box does not call a .zip a spatial file: it says a .zip is not read here, that shapes in it are added with Upload shapes (the link), and that a zipped report should be unzipped and chosen as itself.
— One owner for the list (`work-areas`), no file sent to a flow that will refuse it, and no limit applied to a file that is only passing through (confidence: medium)
Digest: Spatial files that Upload shapes would refuse → Only a .zip (up to 50 MB) is handed over; other spatial files get a box saying what Upload shapes takes.
Changes: Amends story 11: R1 (the size test comes after the spatial test; the .zip limit is 50 MB), R2 (three wordings of the box: handed, not handed, .zip) and R4 (only a .zip is handed; scenario S5 uses a .zip, not a .geojson). Story 10, R3 no longer refuses a .zip between 20 and 50 MB. Narrows the user's decision "spatial hand-off is first release" to the kinds Upload shapes takes. `work-areas` must be able to open Upload shapes with a file received. Depends on Q-70 (handed when the link is followed; a file not handed is let go when it is replaced or the page is left) and Q-38 (no .zip on the report list).

### Q-107
Class: routine
Proposed: The box is hidden with the file control while "Paste text" is chosen and comes back, with the held file, when the person returns to "File". — The box is about the held file, which "Paste text" ignores (confidence: high)
Digest: The spatial file box while "Paste text" is chosen → Hidden with the file control; back when "File" is chosen again.
Changes: none beyond filling story 11, R2.

### Q-108
Class: routine
Proposed: The message goes as soon as text is typed or pasted, and is cleared for good on a switch between "File" and "Paste text". It is announced once when it appears. — The same rule as the file control's messages: a message goes when its cause does (confidence: high)
Digest: "Paste the report text first." → Goes as soon as text is typed, and for good when the person switches to "File".
Changes: none beyond filling story 09. Same rule as Q-104 and Q-96.

### Q-109
Class: routine
Proposed: (a) The right to edit the project is checked when the page opens, again on "Read it" before the document is sent, and again on "Add N changes" before anything is saved. (b) If it is gone, nothing is sent or saved, the reading and its document are discarded, and the person sees what story 12 shows anyone who cannot edit the project, with one line saying nothing was added. (c) Someone with no account is taken to sign in first; then the page opens if they can edit the project, and otherwise they see the same as (b). — A page left open must not outlive the right it was opened with, and a document must not be sent to be read for someone who may no longer see it (confidence: high)
Digest: Is the right to edit checked again after the page is open? → Yes, on "Read it" and on "Add N changes"; if lost, nothing is sent or saved.
Changes: Stories 12, 01 and 02 each gain the check. What the person without the right sees is Q-39's; what becomes of the document is Q-85's.

### Q-110
Class: routine
Proposed: Every change is counted in exactly one part, so the parts always add up to the changes listed. (a) A ready change the person unticks is counted under a fifth part, "`<N>` left out", placed after "need you"; the line is therefore never empty while changes are listed. (b) A change already on file is counted once: under "ready to add" while ticked, otherwise under "already on file". (c) Yes: a flagged change ticked by hand counts under "ready to add", so that part always equals the number on "Add N changes"; an empty amount is caught when the button is pressed (story 30). (d) One reads "1 needs you". A kept field whose value equals the record's counts under "kept by a data source" only. — A tally that does not add up, or that says two different numbers for what will be added, teaches the person to ignore it (confidence: medium)
Digest: The count line after ticking and unticking → Each change counted once; unticked ready changes read "N left out"; "1 needs you" for one.
Changes: Story 04, R2 gains the fifth part and the one-part rule; story 06, R3 follows. Flagged repeats from Q-99 count under "need you". A funding source with its organization picked and then unticked counts under "left out" (Q-122 (b)).

### Q-111
Class: routine
Proposed: (a) A change with no control of its own takes keyboard focus itself, as one stop in the list's order, and focus selects it; a change with controls is selected when focus enters one, as now. (b) The selected change is marked as the current item for assistive technology, not by tint alone. The move of the document pane is not announced: it follows every focus move and would be noise; the pane is already a named region the person can go to. — Every change must be reachable and its selection perceivable without a pointer or colour (confidence: medium)
Digest: Selecting a change by keyboard → Every change can take focus, including one with no checkbox; the selected one is marked for screen readers.
Changes: Story 04, R6 and R7 gain both. Assumes Q-83 names a standard that asks for this; if it names none, the proposal stands as the feature's own rule.

### Q-112
Class: routine
Proposed: (a) "Add N changes" stays available while the document shows. If the import is stopped, the document closes, the changes come back at the first failing one, and focus goes to its failing field. (b) Widening the window past 64rem closes the document, so narrowing again shows the changes. — A press must never leave the person with no visible result (confidence: high)
Digest: Narrow screen with the document showing → A stopped import brings the person back to the first failing change; widening the window closes the document.
Changes: Stories 05 and 30 each gain one requirement. Consistent with Q-68 (b).

### Q-113
Class: routine
Proposed: (a) A performance measure amount is held to the measure's decimal places. A figure with more is refused when "Add N changes" is pressed, with a message naming what the measure takes; it is never rounded for the person. (b) "Secured ($)" is whole dollars. A figure with cents stops the import with a message; it is not rounded. (c) Each field has the limits of the hand-entry field for the same value on the project page; where none is set, an amount is below one trillion and "Grant or program" is at most 200 characters. (d) Both amounts show thousands separators on arrival and again when the person leaves the field, and accept them typed. (e) Neither is wanted: a measure amount accepts digits, separators and one decimal point only, so "$" and "1e3" are refused; a "$" is accepted in the dollar field alone. — Never save a value the measure cannot hold, and never change a typed figure in silence (confidence: medium)
Digest: What may be typed into an amount → Held to the measure's decimal places and to whole dollars; a figure that does not fit is refused, never rounded.
Changes: Stories 07, 17, 30 and 65 gain the checks and messages. One reading of a typed figure serves both ticking and adding (Q-123). If funding sources are meant to keep cents, only (b) changes.

### Q-114
Class: worth-a-look
Proposed: (a) A change whose period the project does not offer arrives flagged and unticked, "Reporting period" empty, with the reason naming the period the report gives. A ticked change with no period stops "Add N changes" with "Pick a reporting period." An entry is never saved under a period the project does not offer. (b) Yes: the change's label follows the period picked. — Saving a figure under a period nobody can see on the page is a silent wrong total (confidence: high)
Digest: A reporting period the project does not offer → The change arrives flagged with the period empty; adding stops until one is picked. The label follows the pick.
Changes: Brings one small check forward from the later reading guards (enabler 50) into the first release, on the page: it narrows the user's decision that the guards are later. Stories 07 and 30 gain it; story 14 gains a fourth reason for a flag.

### Q-115
Class: worth-a-look
Proposed: (a) Yes: every breakdown choice offers an empty choice, so an answer can be set back to unanswered. (b) An answer that is not one of the question's options arrives unanswered and is never saved; a note on the change says what the report said ("The report says “`<answer>`”, which is not an option."). The change stays ready. — An answer outside the list is an invalid value, and one dropped without a word hides what the document said (confidence: high)
Digest: Breakdown answers → Can be set back to unanswered; an answer that is not an option arrives unanswered with a note, and is never saved.
Changes: (b) brings one check forward from enabler 50 into the first release, as Q-114 does. Story 07 gains both. Q-149 (the later half) should word its note the same way. Consistent with Q-90 if it rules that an answer arrives only when the document states it.

### Q-116
Class: routine
Proposed: Both markers are worked out when "Add N changes" is pressed, by comparing what arrived with what is added, not from the order of clicks. (a) A change the report supports two readings of is recorded as filled in after an unsure reading, whichever figure the person ends with, and not as changed from the document's figure. (b) No: a name that differs only in capitals or outer spaces is not recorded as changed. (c) Yes: any change that arrived with an empty amount and is added with a figure is recorded as filled in, however it came to be ticked. (d) As Q-121 (a). — The markers tell a Manager which figures a person stood behind alone, so they must not depend on which control was touched first (confidence: high)
Digest: When is a figure recorded as "changed" or "filled in"? → Decided at the moment of adding, by comparing what arrived with what is added.
Changes: Story 36 restated on that one rule. (a) assumes Q-33 follows the spec (arrives empty); it holds either way.

### Q-117
Class: routine
Proposed: (a) and (b) Selecting a change with no place takes the pane to the document's start on both screens, clears any mark left from another change, and shows one line in the pane: "No place marked for this change." The quote is on the change itself. (c) Yes: selecting a change always brings its place back, in a PDF as in passages, even when the pane last opened at the same page. — A pane left on another change's passage shows the wrong evidence for a figure (confidence: medium)
Digest: A change with no known place in the document → The document goes to its start and says no place is marked; selecting a change always returns to its place.
Changes: Stories 31 and 33 gain the rule. How often it arises depends on Q-66 (b).

### Q-118
Class: routine
Proposed: (a) Yes: the sum is shown under the quote with the label "Added:" ("Added: 3.5 + 2 = 5.5 acres"). "Converted:" is kept for unit conversion alone. The recorded crew log row C1 gains its line. (b) No: the first release rounds nothing. A figure arrives as the document writes it, sums and differences are exact, and the measure's decimal places are enforced on adding (Q-113 (a)). — Arithmetic the person cannot see cannot be checked, and rounding is a change to the document's figure (confidence: medium)
Digest: Arithmetic in the first release → A sum of lines is shown, labelled "Added:"; no figure is rounded.
Changes: Story 04, R5 gains the label; story 13, R1 loses "rounded to two decimals"; fixture row C1 changes. The pasted paragraph's multiplication (Q-82 (d)) should follow the same rule: shown, under a label that says what was done.

### Q-119
Class: routine
Proposed: Exactly 64rem is narrow everywhere. The review's document pane changes to two columns only above 64rem. — The mobile foundation spec writes the gate as "64rem or narrower", and it is the written source (confidence: high)
Digest: A screen exactly 64rem wide → Narrow layout everywhere, the review included.
Changes: Story 80, R1 and R2 reworded to "wider than 64rem"; stories 04, 05 and 31 stand. `publish-review`'s pane changes by one pixel of boundary.

### Q-120
Class: routine
Proposed: (a) A total to date is filed as a difference only for a measure whose values add up. For any other measure the figure is proposed as it stands, as that period's entry, with no arithmetic line. (b) Yes: only entries filed under reporting periods up to and including the change's period are counted, and when the record holds later entries the line says so ("… on record through `<period>`"). — A difference from a figure that is not a sum is meaningless, and a difference against later work understates what the report adds (confidence: medium)
Digest: What a total to date is compared with → Only entries up to the report's period, and only for measures whose values add up.
Changes: Story 13, R2 changes (no longer "every reporting period"). With Q-99 (b) the same reading's own period amount is also subtracted. Consistent with Q-91.

### Q-121
Class: routine
Proposed: (a) Yes, a typed figure ticks it, and it is recorded as changed from the document's figure, not as filled in: the document's own arithmetic left nothing to add. (b) The arithmetic line stays as the document's arithmetic and gains what the person entered ("… = 1,673. You entered 1,500."); the addition goes if the figure is set back. — The person may add it, but a Manager must be able to see that the figure is theirs and not the report's (confidence: medium)
Digest: A total to date after the person changes its figure → Recorded as changed from the document; the arithmetic line stays and adds what was entered.
Changes: Story 13, R4 and R7, and story 36, R5 (the marker is "changed", not "filled in"). Answers Q-116 (d).

### Q-122
Class: routine
Proposed: (a) The badge goes when the change is ticked and comes back when it is unticked. The reason and the note stay throughout, because they explain the figure. (b) Once an organization is picked, the badge and the sentence go and do not return while one is picked; unticked after that, the change counts under "left out", not "need you". Clearing the organization brings both back and unticks it. — A badge that says "waits on you" on a change the person has dealt with hides the ones that still wait (confidence: medium)
Digest: Badge on a flagged change once dealt with → The badge goes when it is ticked, or when the organization is picked; the reason stays.
Changes: Stories 14, 65 and 75. Consistent with Q-110 (a) and (c); the badge's wording is Q-61's; clearing an organization depends on Q-131 (d).

### Q-123
Class: routine
Proposed: Yes. One reading of a typed figure decides both ticking and adding: outer spaces are trimmed, commas and spaces between digits are ignored, and a "$" counts only in a dollar amount. So "1 000" ticks a measure change, and "$40" in a measure amount neither ticks nor adds. — Two readings of one field make a figure valid in one place and invalid in the other (confidence: high)
Digest: Which typed figures tick an empty flagged change? → The same ones "Add N changes" accepts: one rule for both.
Changes: Story 14, R6 follows the rule of Q-113 (e). Largely settled by Q-113; kept separate only for the tick.

### Q-124
Class: routine
Proposed: A value is compared by its field's type. Text: ignoring capitals, outer spaces and repeated spaces, so "el dorado" is "Already on file" against "El Dorado" and "El Dorado County" is not. A choice field: by the option. A number: as a number. A date: as a date. A Timeline: as its two years. — The same matching the product already uses for a funding source's name and a contact's email, and a re-capitalised value is not a change worth a Manager's review (confidence: high)
Digest: How a Key facts value is compared with the record's → By the field's type; differences of capitals or spacing alone are "Already on file".
Changes: Story 15, R8. A value that fits no option is Q-71's.

### Q-125
Class: routine
Proposed: The reading service returns only the year the report states. Code fills the other year from the record, after the reading, and the change shows both with "Was `<the record's Timeline>`". When the record has no Timeline, a one-year Timeline is not proposed as a change: it is listed under "Not used" with the reason that the project has no other year to pair it with. A pair that would end before it starts is a value that does not fit its field (Q-71). — The model reads and code computes; a year the report never stated must not look as if the report stated it (confidence: medium)
Digest: A report that states one year of a Timeline → Code takes the other year from the record; with none on record it is listed as not used.
Changes: Story 15, R2; enabler 02 (the reading returns the stated year only); story 19 gains one reason in the fixed set (Q-98 (d)). Fixture row for the funder report's Timeline is unchanged in value.

### Q-126
Class: routine
Proposed: (a) No "Was …" on a kept change. When the value read differs, the line names the record's value as the source's: "`<source name>` has `<record's value>`. Change it there." (b) "there" stays plain text: a Contributor may not be able to open the source's settings, and the GIS system is outside the product. (c) When no change has a checkbox the action reads "Nothing to add", disabled; "Nothing ticked" is kept for when something could be ticked. (d) Kept always wins: one badge, "Kept by a data source", and no flag badge. — "Was" promises a replacement that will not happen (confidence: medium)
Digest: What a field kept by a data source shows → No "Was …"; the source's value is named; no link; "Nothing to add" when nothing can be ticked.
Changes: Story 16, R1 to R3; story 06, R5 gains the second wording. (d) holds for the flagged Key facts changes Q-99 (c) introduces.

### Q-127
Class: routine
Proposed: (a) No: one source supplies a field at a time. Spec #27 switches the narrower mapping off, and `gis-data-sources` refuses a second subscription mapping to a field another already supplies, so "Kept by `<source name>`" has one answer. (b) Yes: a data source can supply a custom field, and it is kept like a built-in one. (c) If the answer is not known when the check step opens, the change is proposed as ordinary; the guard is the check at the press. (d) Yes: kept is checked again when "Add N changes" is pressed. If a ticked field is now kept, nothing is saved, the change turns to kept, and the person presses again on a true count; if the answer still cannot be had, the import stops with a message to try again. — An authoritative source's lock must hold against an import exactly as it holds against a hand edit (confidence: medium)
Digest: Fields kept by a data source, the edge cases → One source per field; custom fields can be kept; adding checks again and refuses a newly kept field.
Changes: Story 16, R6. `gis-data-sources` gains "one supplier per field" as a stated rule (consistent with spec #27 and #40). Same stop-and-re-mark behaviour as Q-99 (f); depends on Q-48.

### Q-128
Class: routine
Proposed: (a) "Contact" alone, with no separator. (b) The name alone, with no trailing comma. (c) An email match wins and names that person. With no email match, a name match is said only when exactly one person in the workspace has that name; when two share it, nothing is said and the line reads "No invitation is sent." — Spec #14 matches by email or name, and naming one of two people with the same name states a guess as a fact (confidence: high)
Digest: Contacts with no role or organization, or matching two people → No stray punctuation; an email match wins; a name shared by two people is not called a match.
Changes: Story 18, R1 and R3. Consistent with Q-34 and Q-73, which settle matching as a whole.

### Q-129
Class: routine
Proposed: (a) Every quantity, attribute and party the report states about the project that the import did not use is listed; the reading service is asked for all of them, not "the notable ones", and the page makes no further claim. (b) Every skipped item carries a reason from the fixed set (Q-98 (d)). "Skipped" holds parts of the document passed over on purpose: a budget or spend table, a total or subtotal row (already counted in the rows above), and a part about another project. (c) One item per line, as a list like "Not used", not run together. — Story 19 promises nothing is silently dropped; a selection breaks that promise without saying so (confidence: medium)
Digest: What "Not used" and "Skipped" must hold → Everything the import did not use, each skipped item with a reason, one per line.
Changes: Story 19, R1 and R4 (a list, not one line); enabler 02's instruction to the model. Consistent with Q-98 (d) and Q-99 (g).

### Q-130
Class: routine
Proposed: Yes. The import records that the report named another project, and the name as the report writes it. The review shows it above that import's changes, with the note when there is one: "This report names another project: “`<name>`”." The change history row is unchanged. — The Manager who publishes stands behind the figures and must know the document may be about other work (confidence: medium)
Digest: After adding from a report that names another project → The import records it, and the review tells the Manager above that import's changes.
Changes: Story 20, R2; stories 21 and 24 gain the line; story 22's record of an import gains two fields. Consistent with Q-63 (changes arrive unticked) and Q-74 (how the name is matched).
