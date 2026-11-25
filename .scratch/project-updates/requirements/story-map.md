# Story map — Import a report (project-updates, build 1)

Approved: 2026-11-23 (the user; with story 26 set to `later`, story 16 `first`, stories 24 and 25 kept in this feature, and story 01 blocked by enabler 02; story 25 has since merged into 21). **Scope changed after that approval, on the same day, and this map has not been approved again.** The authority for the changes is the user's own decisions of 2026-11-23 on Q-45 (the file is not kept, spec #42: stories 03, 29, 33, 51 and 80 removed), Q-52 (reading by an outside AI service is a workspace setting, spec #41: stories 82 and 83 added) and Q-135 (a funding source and a contact can be edited and removed on the project page: story 81 added). Stories 84, 85 and 86 repackage scope. The map as it now stands awaits the user's approval.
2026-11-23: splits after writing repackage approved scope; no scope added or moved between releases. Checked against the approved map: every inventory item the approved stories covered is still covered, by a story of the same release; the seven item IDs that are new (RUL-78 to RUL-83, ACN-21) are parts of items that were already covered, split so that each story covers its own part.
Epics: 3 — 42 stories, three actor journeys (the person who imports, the manager who reviews, the administrator who allows reading), and parts that could ship separately

Built from `inventory.md` as recorded on 2026-11-23 (interview answers Q-20 to Q-28, Q-29 in part). IDs are the inventory's. Since the stories were revised, the story files are the source of truth and this map is rebuilt from them: every row of the Stories table, the open questions and the build order below are read from the story headers, not kept by hand.

2026-11-23: ACN-7, ACN-8, RUL-53 moved from 01 to 06 after writing (01 was over size).
2026-11-23: the gap pass after writing added three inventory items, each to the story that raised it: RUL-70 (02), STA-36 (10), STA-37 (15); and questions Q-66 to Q-81.
2026-11-23: stories 30–33 split from 04, 06, 13, 24 after writing (each was over the scenario limit). 30 from 06, 31 from 04, 32 from 13, 33 from 24. Each old story keeps its number and a narrowed scope.
2026-11-23: unit conversion taken out of the first release (the user, confirming Q-62): story 02 no longer converts, and the "Converted: …" line moved from 04 to 26. What the first release does with a figure in another unit is Q-82.
2026-11-23: story 01 rewritten to the tightened write standard. A second gap pass added seven inventory items, all to story 01: RUL-71 (the write rule for an entry), RUL-72 (the order of the save), RUL-73 (how the page waits, and what leaving is), RUL-74 (the toast in detail), RUL-75 (how a measure change is labelled and valued), RUL-76 (the import's fields), RUL-77 (labels that name a renameable noun); and questions Q-84 to Q-86. Nothing left story 01's `Covers`. Under the slice rule that a skeleton carries only the controls it makes work, story 01 now has no "Cancel", "Read another", checkbox or "Undo"; its Out of scope says what its screens do until stories 06 and 23 arrive. Stories 02, 06, 22 and 23 were not edited and still describe the old division in places.
2026-11-23: story 34 split from 01 after writing. Rewritten once more as the exemplar of the settled write standard (one behavior per scenario), story 01 needed ten scenarios. Cut by workflow step: 01 keeps the path from the card to the entries on the record (eight scenarios); 34 takes what the act leaves behind, the import's record and the toast (OBJ-1, OBJ-4, STA-26, RUL-74, RUL-76; four scenarios). SCR-3 stays with 01, which states the return to the project page. Approved scope only is repackaged. Also new: `fixtures.md` (the sample project and the recorded readings), SR-7 (a control or case another story owns is absent until that story ships), and questions Q-87 and Q-88. Not yet corrected, because the other stories were not edited: 23 leans on 34 for the toast, and 22, 23 and 24 on 34 for the import's record, so their `Blocked by` should name 34; stories 02, 06, 13, 22 and 23 point at story 01 for the toast or the import in places.
2026-11-23: seven stories split after writing, when all stories were revised to the settled write standard (one behavior per scenario). Each old story keeps its number and a narrowed scope; requirements and scenarios moved. 35 from 06 ("Cancel" and "Read another": ACN-7, ACN-8, RUL-53). 36 from 07 (recording that a figure was changed or filled in: RUL-39). 40 from 09 (pasted text kept and named as the import's document: RUL-29). 41 from 23 ("Undo" of Key facts fields, funding sources, contacts, the change history row and the kept document: RUL-22). 45 from 17 (the funding source's row on the project page and "Total from all sources": STA-29, RUL-48). 50 from 26 (the reading guards that are not about units; both stay `later`). 51 from 33 (the review row that stands for two imports). Numbers 37 to 39, 42 to 44 and 46 to 49 are not used.
2026-11-23: reconcile pass after those splits. Five inventory items whose parts fell to different stories were split, so that no story covers nothing and none cites as `relies on` an item a later story covers: RUL-15 (the test for a performance measure entry stays, story 32; a Key facts field is RUL-79, story 15; a funding source RUL-80, story 17; a contact RUL-81, story 18); RUL-22 (stays with 41; the measure entries and the import's own record are RUL-83, story 23); RUL-29 (stays with 40; that pasted text is read like a file is RUL-82, story 09); RUL-34 (the unit guards stay, story 26; the other guards are RUL-78, story 50); ACN-19 (stays with 33; the row for two imports is ACN-21, story 51). 34 cross-story pointers were corrected in 22 stories (Out of scope, Needs to know, Capability and notes). `Blocked by` changed in one story: 41 now names 45, because its funding source scenario reads the row story 45 draws. Nine questions the writers raised were numbered Q-89 to Q-97. The stale notes above ("were not edited", "not yet corrected") are settled: stories 21, 22, 23 and 24 are blocked by 34, and enabler 03 is too.
2026-11-23: story 51 kept as its own story, though it is small (two requirements, two scenarios). Folding it into 33 would put 33 at ten scenarios and make 33 wait on story 15, which it does not otherwise need; folding it into 15 would give a Contributor's story a Manager's scenarios. It differs from 33 in what it is blocked by, and Q-97 may widen it.
2026-11-23: two rows added to Out of scope for spec decisions #3, #4, #35 and #37. They were already excluded in `coverage.md`, by a list inside the check script; the list now lives here, where the script reads it. No scope changed.
2026-11-23: builder's checklist pass; stories 65, 75, 80 split from 30, 17, 33. Each was over the scenario limit once the checklist's cases were written: 65 takes story 30's R3 (what a ticked funding source needs; business-rule variation), 75 takes story 17's R3 to R6 (an organization the workspace does not hold; business-rule variation), 80 takes story 33's R5 to R7 (the layout beside the review, and closing; workflow step). Numbers 52 to 64, 66 to 74 and 76 to 79 are not used. No scope moved between releases and no story was added beyond the three splits: all three are `first`, like the stories they came from, and every item the approved stories covered is still covered by a story of the same release. Two inventory items were split so that each story covers its own part (RUL-21 into RUL-122, story 65; ACN-15 into ACN-22, story 75), and STA-15 and RUL-17 moved from 17 to 75, STA-35 and ACN-20 from 33 to 80. What did grow is the inventory, by 139 items (RUL-84 to RUL-221, ACN-22): rules the writers read in the prototype's code behind behavior the approved stories already covered, each tagged `shown`, each covered by the story that raised it. They are detail of approved scope, not new scope; five of them describe an accident of the prototype and are tagged so (RUL-97, RUL-152, RUL-156, RUL-163, RUL-187), with a question beside each. `Blocked by` changed in nine stories (13, 14, 18, 26, 28, 36, 50 gained blockers; 65 and 75 are new), which moved story 13 from wave 6 to wave 7 and story 36 from wave 7 to wave 8. One scenario moved: the hand-ticked "Not in this workspace" case was stated by both 65 and 75; it is settled in 65, the one built second, and 75's copy (its old S6) was removed. 53 questions were numbered Q-98 to Q-150.
2026-11-23: merge pass; a story's own effect must be observable with its blockers alone; the scenario limit is about 12. 44 stories became 41, and three numbers are retired and never reused: 25 merged into 21 (the note is written and read in one story, with two actors), 34 was dissolved into 01 (the toast) and 22 (the import's record), 45 merged into 17 (a funding source is added and seen on the project page). Parts moved so that each can be seen where it is built: the change history row's removal from 41 to 23; "This file can't be shown here.", its quote and the rule for which form a document takes from 31 to 04; coordinates as a "Not used" line from 11 to 19. Story 36 became an enabler; story 21 moved from epic A to epic C; story 40 now waits for the review, where its kept text is seen. `Blocked by` changed in eleven stories: 03, 18 and 24 (34 became 22), 17 (gained 22), 21 (now 22, 24), 22 (now 01), 23 (now 01, 22), 31 (gained 09), 36 (34 became 22), 40 (now 03, 09, 22, 31, 33) and 41 (lost 22 and 45). That moved 22 and 41 a wave earlier and 21 and 40 a wave later; the first release is still 8 waves and the longest chain 8 stories. Two inventory items were split so that each story covers its own part (RUL-22 into RUL-222, the change history row, story 23; RUL-8 into RUL-223, coordinates as a "Not used" line, story 19); RUL-51 was narrowed and STA-22 reworded from story 04's reading of the code. One scenario and one UAT step were added to story 06: selecting a change by keyboard focus, which story 04 states (R7, R8) and could not show, because no change has a control before story 06's checkbox. Three questions were numbered Q-157 to Q-159. No scope moved between releases: every story is in the release it was in, and all three merges joined stories of the first release. No scope was added: every inventory item the 44 stories covered is covered by one of the 41, in the same release, and the two new item IDs are parts of items that were already covered. What the pass could not settle is listed in `coverage.md`, Findings, under "Not demonstrable with blockers alone", and the samples that would settle most of it in `fixtures.md`, "Samples the feature still needs".

2026-11-23: answers written in; stories built on proposals awaiting the user's validation (see `.scratch/proposed-answers.md`). Every question a story touched has a proposed answer, written into the story as a requirement tagged `proposed`; every story is `needs-triage`, none is `needs-info`. Three answers are the user's decisions, not proposals: Q-52 (spec #41), Q-45 (spec #42; keeping the document's name and each change's quote is still a proposal) and Q-135. Questions Q-162 to Q-179 were raised while the answers were written in, each with a proposal.
2026-11-23: scope changes that follow those decisions. Removed: 03, 29, 33, 51, 80 (the file is not kept, spec #42). Added: 81 (Q-135), 82 and 83 (Q-52, spec #41), 84 (split from 23: Undo when the record or the right has moved), 85 (what remains of 51: which import a folded review row names), 86 (split from 17: a funding source the record holds with another amount). 41 stories became 42. No story changed release; story 16 stays `first`, against a stand-in for `gis-data-sources` (the proposal on Q-17 that would move it was not applied: the user's approval stands).
2026-11-23: parts moved when the answers were written in. The passages form of the document pane (STA-23, RUL-128) from 31 to 04, because every document that is not a PDF is now shown as passages; 40 narrowed to naming a pasted import "pasted text" (nothing is kept); the failed save and the performance measures' change log row are stated in 22; the check at the press and a repeat inside one reading in 32; the folded-row rules of 24 in 85; three checks of later enabler 50 (a reporting period not offered, a breakdown answer that is not an option, a Key facts value that does not fit) are in the first release, in 07, 14, 30 and 15 (Q-114, Q-115, Q-71: proposals).
2026-11-23: blockers changed. By the plan for writing the answers in: 17 and 18 gained 81; 20 gained 06; 40 lost 03, 31 and 33; 41 lost 03 and gained 84; 28 lost 03. By the closing pass, so that each scenario can be reached with the story's blockers: 08 gained 10; 11 gained 09; 15 gained 19; 20 gained 22; 30 gained 05; 36 gained 13; 83 gained 12; 85 gained 41; the later 27 gained 41 and 75, and the later 28 gained 06, 07, 10, 12, 21 and 32. The graph has no cycle and the first release is still 8 waves.
2026-11-23: sample U1 (the timeline update) changed from 2023–2026 to 2023–2029 in `fixtures.md` and in stories 15, 41 and 85: 2023–2026 is the Timeline Deer Creek last published, so the review might have shown no row.

Actors are roles (adapter, "Actor vocabulary for stories"). **Contributor** below means anyone who can edit the project: a Contributor on a project an organization of theirs leads, or an Administrator (ACT-1, ACT-3). **Manager** means a Manager of the project's lead organization, or an Administrator (ACT-2, ACT-3). A Viewer and a visitor have no goal here: they never see the page, the document or an unpublished imported value (ACT-4); story 12 holds what they get instead.

## Epics

| Epic | What it delivers | Why it is its own epic |
|---|---|---|
| A — Import a report | One person takes one report from a file to changes on the record, and can take them back | The Contributor's journey from start to finish; ships with performance measure entries alone |
| B — What a report can change | Every kind of change beyond a clean measure entry, and every case that waits on the person | Each story adds one kind or one case to A's check step; each can ship after A without the others |
| C — Imported changes in review | The Manager judges an imported change against the words it was read from before publishing | A second actor's journey, drawn inside a surface another feature owns |

## Goals

| Actor | Goal |
|---|---|
| Contributor | Get what a report already filed says onto the project's record without retyping it |
| Contributor | Be sure that what goes on the record is what the report says, and decide the cases the reading could not |
| Contributor | Take back an import that should not have been added |
| Manager | Judge an imported change against the words it was read from before publishing it |
| Administrator | Decide whether the workspace's reports may be read by an outside AI service |

## Backbone

Get a report onto the record: Start → Choose the document → Wait for the reading → Check each change against the document → Settle what waits on you → Add → See it on the project

Take an import back: See it on the project → Undo

Judge an imported change: Open the project's review → See what came from a document, the words read and its note

Allow reading: Open workspace settings → Read what is agreed → Turn reading by an outside AI service on (or off)

Correct by hand what an import added: See it on the project → Edit or remove the row

## Stories, in build order

Read from the story headers on 2026-11-23, after the answers were written in. Order: the waves of the first release (see Build order), then the `later` stories. Numbers are permanent, so they do not run in order. "Unblocks" is filled for enablers only and lists the stories whose `Blocked by` names the enabler.

42 stories: 38 in the first release (36 stories and 2 enablers: 02, 36) and 4 `later` (stories 27, 28; enablers 26, 50).

Retired numbers, never reused: 25 merged into 21, 34 dissolved into 01 and 22, 45 merged into 17 (merge pass); 03, 29, 33, 51 and 80 removed because the file is not kept (spec #42; what survives of 51 is story 85, and of 03 the rule about who sees a document's name and quote, in 22, 24 and SR-3). Numbers 37 to 39, 42 to 44, 46 to 49, 52 to 64, 66 to 74, 76 to 79 and 87 to 91 were never used.

| # | Story (actor + outcome) | Type | Epic | Step | Release | Blocked by | Unblocks (enablers) | Covers |
|---|---|---|---|---|---|---|---|---|
| 02 | Reading service: a model reads the document, code does the arithmetic | enabler | A | Wait for the reading | first | none | 01, 13, 14, 15, 17, 18, 19, 20, 26, 32, 50 | RUL-33, RUL-70, RUL-130, RUL-131, RUL-132, RUL-133, RUL-134, RUL-237, RUL-238, RUL-239, RUL-240, RUL-241, RUL-242, RUL-243, RUL-244, RUL-245, RUL-246, RUL-247, RUL-248, RUL-249, RUL-250, RUL-251, RUL-252 |
| 81 | A Contributor edits or removes a funding source or a contact on the project page | story | A | See it (correct by hand) | first | none |  | RUL-411, RUL-412, RUL-413, RUL-414, RUL-415, RUL-416, RUL-417, RUL-418, RUL-419, RUL-420 |
| 82 | An Administrator agrees to reading by an outside AI service and turns it on or off for the workspace | story | A | Allow reading (the setting) | first | none |  | OBJ-6, SCR-6, RUL-421, STA-38, RUL-422, RUL-423, RUL-424, RUL-425, RUL-426, RUL-427 |
| 01 | Walking skeleton. A Contributor adds performance measure entries read from one report file | story | A | Start → See it | first | 02 |  | OBJ-2, OBJ-3, SCR-1, SCR-3, STA-1, STA-6, STA-10, ACN-1, ACN-5, ACN-6, ACN-17, RUL-1, RUL-5, RUL-20, RUL-26, RUL-54, RUL-60, RUL-71, RUL-72, RUL-73, RUL-75, RUL-77, RUL-84, RUL-85, RUL-86, RUL-87, STA-26, RUL-74, RUL-91, RUL-224, RUL-225, RUL-226, RUL-227, RUL-228, RUL-229, RUL-230, RUL-231, RUL-232, RUL-233, RUL-234, RUL-235, RUL-236 |
| 04 | A Contributor checks each change against the document beside it | story | A | Check | first | 01 |  | SCR-2, STA-8, STA-22, STA-23, STA-25, ACN-9, RUL-9, RUL-36, RUL-51, RUL-56, RUL-104, RUL-105, RUL-106, RUL-107, RUL-127, RUL-128, RUL-253, RUL-254, RUL-255, RUL-256, RUL-257, RUL-258, RUL-259, RUL-260, RUL-261, OBJ-5 |
| 09 | A Contributor pastes the report's text instead of choosing a file | story | A | Choose | first | 01 |  | STA-2, STA-4, ACN-4, RUL-30, RUL-82, RUL-101, RUL-102, RUL-103, RUL-279, RUL-280, RUL-281, RUL-282 |
| 10 | A Contributor is told why a file was not read | story | A | Choose | first | 01 |  | STA-3, STA-7, STA-36, RUL-31, RUL-52, RUL-95, RUL-96, RUL-97, RUL-283, RUL-284, RUL-285, RUL-286, RUL-287, RUL-288, RUL-289 |
| 22 | A Contributor's import is recorded and listed in the project's change history | story | A | Add → See it | first | 01 |  | SCR-4, STA-31, RUL-3, RUL-50, RUL-55, RUL-182, OBJ-1, OBJ-4, RUL-76, RUL-88, RUL-89, RUL-90, RUL-345, RUL-346, RUL-347, RUL-348, RUL-349, RUL-350, RUL-351, RUL-352, RUL-353, RUL-354, RUL-355, RUL-25, RUL-454 |
| 35 | A Contributor leaves Import a report, or starts again, without adding anything | story | A | Choose → Settle | first | 01 |  | ACN-7, ACN-8, RUL-53, RUL-398, RUL-399 |
| 05 | A Contributor on a narrow screen opens a change's source and comes back to the same change | story | A | Check | first | 04 |  | STA-9, ACN-10, RUL-108, RUL-109, RUL-110, RUL-262, RUL-263, RUL-264 |
| 06 | A Contributor chooses which changes to add | story | A | Settle | first | 01, 04 |  | STA-20, ACN-11, RUL-10, RUL-111, RUL-112, RUL-113, RUL-114, RUL-265, RUL-266, RUL-267 |
| 08 | A Contributor starts an import from the project header, or by dropping a file on the project page | story | A | Start | first | 01, 10 |  | ACN-2, ACN-3, RUL-32, RUL-92, RUL-93, RUL-94, RUL-272, RUL-273, RUL-274, RUL-275, RUL-276, RUL-277, RUL-278 |
| 11 | A Contributor who chooses a spatial file has it handed to Upload shapes | story | A | Choose | first | 01, 09 |  | STA-5, RUL-8, RUL-64, RUL-98, RUL-99, RUL-100, RUL-290, RUL-291, RUL-292 |
| 19 | A Contributor sees what the report says that the import did not use, and why | story | B | Check | first | 04, 02 |  | RUL-7, RUL-42, RUL-164, RUL-165, RUL-223, RUL-325, RUL-326, RUL-327, RUL-328, RUL-329, RUL-330, RUL-331, RUL-332, RUL-333 |
| 23 | A Contributor takes back an import from the toast | story | A | Undo | first | 01, 22 |  | STA-27, ACN-18, RUL-23, RUL-62, RUL-83, RUL-183, RUL-184, RUL-185, RUL-222, RUL-356, RUL-357, RUL-358, RUL-359, RUL-360 |
| 24 | A Manager sees which waiting changes came from a document, and the words each was read from | story | C | See what came from a document | first | 22 |  | SCR-5, STA-32, RUL-24, RUL-192, RUL-193, RUL-194, RUL-195, RUL-361, RUL-362, RUL-363, RUL-364, RUL-365, RUL-366, RUL-367, RUL-368 |
| 31 | A Contributor sees a PDF report as itself, at the page each change was read from | story | A | Check | first | 04, 09 |  | STA-24, RUL-129, RUL-188, RUL-392, RUL-393 |
| 40 | A Contributor's import from pasted text names "pasted text" as its document | story | A | Add → See it | first | 09, 22 |  | RUL-29, RUL-189, RUL-190, RUL-400, RUL-401 |
| 07 | A Contributor corrects a performance measure change before adding it | story | A | Settle | first | 06 |  | ACN-12, RUL-38, RUL-40, RUL-41, RUL-115, RUL-116, RUL-117, RUL-118, RUL-268, RUL-269, RUL-270, RUL-271, RUL-217, RUL-218 |
| 12 | A Contributor is offered Import a report on every project they can edit, and nobody else is | story | A | Start | first | 01, 08 |  | RUL-28, RUL-57, RUL-59, RUL-67, RUL-293, RUL-294, RUL-295 |
| 20 | A Contributor is warned when the report names another project | story | B | Check | first | 04, 02, 06, 22 |  | STA-19, RUL-27, RUL-166, RUL-167, RUL-168, RUL-334, RUL-335, RUL-336, RUL-337, RUL-338 |
| 21 | A Contributor leaves one note with an import, and the Manager reads it above the import's changes | story | C | Add → See what came from a document | first | 22, 24 |  | ACN-16, RUL-19, RUL-179, RUL-180, RUL-181, STA-34, RUL-45, RUL-196, RUL-197, RUL-198, RUL-199, RUL-339, RUL-340, RUL-341, RUL-342, RUL-343, RUL-344 |
| 32 | A Contributor sees an entry the record already holds as "Already on file" | story | B | Check | first | 01, 02, 06 |  | STA-11, RUL-15, RUL-140, RUL-141, RUL-394, RUL-395, RUL-396, RUL-397 |
| 84 | A Contributor's Undo keeps what was changed by hand since, and says so when it cannot take the import back | story | A | Undo | first | 23 |  | RUL-434, RUL-435, RUL-436, RUL-437, RUL-438, RUL-439, RUL-440, RUL-441, RUL-442, RUL-443, RUL-444 |
| 14 | A Contributor fills or leaves out a change the reading flagged | story | B | Settle | first | 06, 07, 02, 32 |  | STA-12, STA-13, STA-14, ACN-13, RUL-11, RUL-12, RUL-13, RUL-63, RUL-142, RUL-143, RUL-145, RUL-146, RUL-300, RUL-301, RUL-302, RUL-303, RUL-304 |
| 15 | A Contributor adds Key facts the report names | story | B | Check | first | 04, 02, 32, 19 |  | STA-37, RUL-6, RUL-43, RUL-66, RUL-79, RUL-147, RUL-148, RUL-149, RUL-150, RUL-151, RUL-305, RUL-306, RUL-307, RUL-308, RUL-309, RUL-310 |
| 17 | A Contributor adds funding sources the report names and sees them on the project page | story | B | Check → See it | first | 06, 02, 32, 22, 81 |  | ACN-15, RUL-80, RUL-169, RUL-170, RUL-171, RUL-172, RUL-173, RUL-174, STA-29, RUL-48, RUL-176, RUL-177, RUL-178, RUL-315, RUL-316, RUL-317, RUL-318, RUL-319 |
| 18 | A Contributor adds contacts the report names, with no invitation sent | story | B | Check → See it | first | 04, 02, 32, 22, 81 |  | STA-28, RUL-16, RUL-49, RUL-81, RUL-157, RUL-158, RUL-159, RUL-160, RUL-161, RUL-162, RUL-163, RUL-320, RUL-321, RUL-322, RUL-323, RUL-324 |
| 30 | A Contributor is stopped before anything is added by an invalid change | story | A | Settle | first | 06, 07, 05 |  | STA-21, RUL-21, RUL-119, RUL-120, RUL-121, RUL-389, RUL-390, RUL-391 |
| 83 | A Contributor is told why Import a report is not offered while reading is off or unavailable | story | A | Start | first | 01, 08, 12, 82 |  | STA-39, RUL-428, RUL-429, STA-40, RUL-430, RUL-431, RUL-432, RUL-433 |
| 13 | A Contributor sees a total to date filed as the difference from the record | story | B | Check | first | 01, 02, 32, 14 |  | STA-18, RUL-14, RUL-135, RUL-136, RUL-137, RUL-138, RUL-139, RUL-296, RUL-297, RUL-298, RUL-299 |
| 16 | A Contributor sees a Key facts field an authoritative data source supplies as kept | story | B | Check | first | 15 |  | STA-16, RUL-18, RUL-69, RUL-152, RUL-153, RUL-154, RUL-155, RUL-156, RUL-311, RUL-312, RUL-313, RUL-314 |
| 41 | A Contributor's Undo takes back every kind of change the import added | story | A | Undo | first | 15, 17, 18, 23, 84 |  | RUL-22, RUL-186, RUL-187, RUL-402, RUL-403, RUL-404, RUL-405 |
| 75 | A Contributor picks an organization for a funding source whose organization the workspace does not hold | story | B | Settle | first | 17, 30 |  | STA-15, RUL-17, ACN-22, RUL-175, RUL-407, RUL-408, RUL-409, RUL-410 |
| 36 | An import records which figures the Contributor changed or filled in | enabler | A | Add | first | 07, 13, 14, 17, 22, 75 | none | RUL-39, RUL-124, RUL-125, RUL-126 |
| 65 | A Contributor is stopped before anything is added by an invalid funding source | story | B | Settle | first | 17, 30, 75 |  | RUL-122, RUL-123, RUL-406 |
| 85 | A Manager sees which document a review row names when a field was set more than once | story | C | See what came from a document | first | 24, 15, 41 |  | RUL-208, RUL-445, RUL-446 |
| 86 | A Contributor sees a funding source the record already holds with another amount as a change to that row | story | B | Check → See it | first | 17, 41 |  | RUL-447, RUL-448, RUL-449, RUL-450, RUL-451, RUL-452, RUL-453 |
| 26 | Unit conversion: a figure in another unit is converted in code, or flagged | enabler | B | Wait for the reading | later | 02, 04, 13, 14 | none | RUL-34, RUL-35, RUL-209, RUL-210, RUL-211, RUL-212, RUL-213, RUL-214, RUL-215 |
| 50 | Reading guards: what the model returns is checked against the project in code | enabler | B | Wait for the reading | later | 02, 07, 14, 15, 19 | none | RUL-78, RUL-216, RUL-219, RUL-220, RUL-221 |
| 27 | A Contributor adds partner organizations the report names | story | B | Check | later | 17, 41, 75, and a partner organizations section on the project page (`project-record`, later, not built) |  | RUL-58, RUL-369, RUL-370, RUL-371, RUL-372, RUL-373, RUL-374, RUL-375, RUL-376, RUL-377, RUL-378 |
| 28 | A Contributor leaves while a report is read and comes back to the finished reading | story | A | Wait for the reading | later | 01, 35, 06, 07, 10, 12, 21, 32 |  | RUL-61, RUL-379, RUL-380, RUL-381, RUL-382, RUL-383, RUL-384, RUL-385, RUL-386, RUL-387, RUL-388 |

What each enabler unblocks:

- 02 unblocks 01, 13, 14, 15, 17, 18, 19, 20, 26, 32, 50. Story 01 needs only its thinnest slice (performance measure entries from a file).
- 36 (`first`) is in no story's `Blocked by`. It records two facts about a change (its figure was changed from the document's; it was filled in after arriving empty) that no screen of build 1 shows; the row markers of `publish-review`, build 2, read them. The check script lists it under "enabler that no story is blocked by"; whether it stays whole or is folded into 07, 14, 17 and 75 is for the user (see Cuts I was least sure of).
- 26 (`later`) is in no story's `Blocked by`. It holds unit conversion and its "Converted: …" line. In the first release a figure in another unit arrives flagged and empty (story 14, R9; proposed, Q-82).
- 50 (`later`) is in no story's `Blocked by`. Once built, stories 14, 15 and 19 receive readings that have passed its checks; the first release relies on the person checking each change (Q-62), with the three checks the proposals bring forward (see the dated line above).

## Build order

The first release as waves: a story is in the first wave in which every story in its `Blocked by` is already built, so the stories of one wave can be built in parallel. Worked out from the `Blocked by` lines by `coverage.py`; the graph has no cycle (checked 2026-11-23, after the answers were written in).

1. 02, 81, 82 — the reading service (enabler 02), and two stories that need nothing of the import: editing and removing a funding source or a contact on the project page (81), and the workspace setting (82). Until 02 exists, every story below is built against the recorded samples in `fixtures.md`.
2. 01 — the walking skeleton, which ends with the toast on the project page.
3. 04, 09, 10, 22, 35 — what needs only the skeleton: the check step with the document pane, pasted text, the reasons a file is not read, the import's record and its row in the change history, and leaving.
4. 05, 06, 08, 11, 19, 23, 24, 31, 40 — what needs the check step (04), the import's record (22), pasted text (09) or the file messages (10): the narrow screen, ticking, the header action and the drop (08, which now waits on 10), the spatial file (11, which now waits on 09), "Not used", "Undo" from the toast, the Manager's rows, the PDF as itself, and the pasted import's name.
5. 07, 12, 20, 21, 32, 84 — correcting a change, who is offered import (12), the another-project warning, the note, "Already on file", and Undo when the record has moved.
6. 14, 15, 17, 18, 30, 83 — the kinds of change, the flagged cases, the check that stops an invalid change, and being told why import is not offered (83, which now waits on 12).
7. 13, 16, 41, 75 — what needs a kind of change or a flagged case to exist first, and Undo of every kind of change.
8. 36, 65, 85, 86 — what is recorded of a figure changed or filled in (enabler 36), the check on a ticked funding source (65), the review row for a field set more than once (85, which needs 41's Undo), and a funding source held with another amount (86).

Later release, each after its own blockers: 26 (after 02, 04, 13, 14), 50 (after 02, 07, 14, 15, 19), 27 (after 17, 41, 75, and a partner organizations section on the project page, `project-record`, not built), 28 (after 01, 35, 06, 07, 10, 12, 21, 32).

The longest chain is 8 stories: 02 → 01 → 04 → 06 → 32 → 17 → 75 → 36.

Release rules the stories state: nothing of the first release ships without 82 and 83 (spec #41); funding sources and contacts (17, 18) do not ship without 81; 17 not without 65 and 75.

## Open questions by story: the proposals each story rests on

Read from each story's Open questions section on 2026-11-23. **No question is open in any story.** Each story's section lists the proposed answers it is built on (and, where it leans on one, a decision: Q-45, Q-52, Q-135), and its header names them on the line `Built on proposals awaiting validation`. Together the 42 stories rest on 131 questions; the user validates them on one page, `.scratch/proposed-answers.md`. If a proposal is rejected, the stories listed beside it here are the ones that change.

| # | Open questions (none is open; these are the proposals the story rests on) |
|---|---|
| 01 | Q-31, Q-38, Q-40, Q-45, Q-46, Q-47, Q-52, Q-84, Q-85, Q-99, Q-100, Q-109, Q-113 |
| 02 | Q-38, Q-41, Q-42, Q-43, Q-47, Q-66, Q-74, Q-82, Q-85, Q-89, Q-98, Q-99, Q-118, Q-125, Q-129 |
| 04 | Q-42, Q-54, Q-66, Q-67, Q-98, Q-110, Q-111, Q-117, Q-118, Q-167 |
| 05 | Q-68, Q-112, Q-119 |
| 06 | Q-61, Q-63, Q-99, Q-110, Q-114, Q-126 |
| 07 | Q-32, Q-90, Q-113, Q-114, Q-115 |
| 08 | Q-30, Q-38, Q-40, Q-69, Q-100, Q-102, Q-103 |
| 09 | Q-47, Q-83, Q-105, Q-108 |
| 10 | Q-38, Q-41, Q-47, Q-66, Q-69, Q-83, Q-104 |
| 11 | Q-70, Q-106, Q-107 |
| 12 | Q-39, Q-43, Q-109 |
| 13 | Q-33, Q-48, Q-82, Q-91, Q-99, Q-118, Q-120, Q-121 |
| 14 | Q-33, Q-61, Q-78, Q-82, Q-89, Q-92, Q-113, Q-114, Q-122, Q-123, Q-170, Q-171 |
| 15 | Q-32, Q-48, Q-51, Q-65, Q-71, Q-87, Q-99, Q-124, Q-125 |
| 16 | Q-56, Q-58, Q-59, Q-72, Q-126, Q-127 |
| 17 | Q-45, Q-76, Q-87, Q-98, Q-113, Q-131, Q-133, Q-134, Q-135, Q-136 |
| 18 | Q-32, Q-34, Q-45, Q-73, Q-76, Q-87, Q-98, Q-99, Q-128, Q-135, Q-136 |
| 19 | Q-35, Q-42, Q-43, Q-46, Q-65, Q-71, Q-98, Q-99, Q-125, Q-129 |
| 20 | Q-63, Q-74, Q-83, Q-98, Q-130 |
| 21 | Q-36, Q-45, Q-47, Q-53, Q-76, Q-93, Q-144 |
| 22 | Q-37, Q-44, Q-45, Q-46, Q-50, Q-53, Q-76, Q-84, Q-86, Q-94, Q-101, Q-130, Q-136, Q-141 |
| 23 | Q-64, Q-94, Q-101, Q-157, Q-177 |
| 24 | Q-37, Q-45, Q-53, Q-86, Q-97, Q-130, Q-136, Q-141, Q-142 |
| 26 | Q-33, Q-61, Q-82, Q-95, Q-118, Q-147, Q-148 |
| 27 | Q-79 |
| 28 | Q-80, Q-173 |
| 30 | Q-68, Q-83, Q-96, Q-112, Q-113, Q-114, Q-123, Q-172 |
| 31 | Q-117, Q-158 |
| 32 | Q-48, Q-87, Q-99, Q-110, Q-168, Q-169 |
| 35 | Q-85 |
| 36 | Q-32, Q-116, Q-121 |
| 40 | Q-45, Q-139 |
| 41 | Q-72, Q-75, Q-137, Q-138, Q-179 |
| 50 | Q-33, Q-61, Q-66, Q-98, Q-149, Q-150 |
| 65 | Q-68, Q-83, Q-96, Q-113, Q-122 |
| 75 | Q-35, Q-98, Q-122, Q-131, Q-132 |
| 81 | Q-16, Q-113, Q-131, Q-134, Q-135, Q-136, Q-137, Q-176 |
| 82 | Q-89, Q-162, Q-163, Q-164, Q-165 |
| 83 | Q-109, Q-165, Q-166 |
| 84 | Q-64, Q-75, Q-137, Q-157, Q-178 |
| 85 | Q-45, Q-97, Q-143 |
| 86 | Q-45, Q-48, Q-50, Q-87, Q-99, Q-133, Q-137, Q-138, Q-174, Q-175 |

## Covered by standing requirements

- RUL-4 — SR-1. See `standing-requirements.md`. SR-4, SR-6 and SR-8 rest on proposals (Q-98, Q-83); SR-9 and SR-10 are the user's decisions (spec #41, #42); SR-11 is the test environment assumption (Q-88).

## Dependencies on other features

| Needs | Owned by | Used by stories |
|---|---|---|
| The review: one row per field, the diff, Publish, the inbox; imported rows, their source line and quote, and the note are drawn inside it (no document pane: spec #42). One renderer words imported rows as hand-made ones (Q-141); the fold is for fields, never for entries (Q-97) | `publish-review` | 21, 24, 85 |
| Imported values are not public until a publish, and count in the project's "N unpublished changes" badge (RUL-2, STA-30) | `publish-review` | 01, 15, 17, 18, 22, 23, 41 |
| An import over a hand edit of the same field, or two imports of one field, is one review row; the badge uses the same count (RUL-44, STA-33). Two entries for one performance measure and reporting period are two rows (proposed, Q-97) | `publish-review` | 15, 24, 85 |
| A publish includes the imported changes with the rest, and a published change leaves the review (RUL-47) | `publish-review` | 21, 24 |
| Hold, Revert with a reason, and the row markers that read the two facts enabler 36 records about a change | `publish-review`, build 2 | 07, 14, 21, 36 |
| The project page: sections and their order, the pinned top bar, header actions and the "…" overflow, Key facts fields that can be set from outside, the Funding sources table, the Contacts panel, the Change history sheet, toasts. Story 81 (a funding source row and a contact row can be edited and removed) is written here and owned there; the project page is not finished in the prototype | `project-record` | 01, 08, 15, 17, 18, 19, 22, 23, 81, 86 |
| The project's performance measures: units, breakdown questions and options, closed reporting periods, entries, the total reported to date; its change log showing a source on a row (story 22, R8; not built) | `performance-measures` | 01, 02, 06, 07, 13, 22, 23, 26, 30, 32, 40, 50, 65, 84 |
| Upload shapes, able to receive a file handed to it | `work-areas` | 11 |
| Which fields a data source keeps, whether it is authoritative, and the source's name | `gis-data-sources` (spec #40; not built: story 16 is built and accepted against a stand-in) | 16, 41 |
| The workspace's custom fields and which of them a project has | `custom-fields` | 15 |
| The workspace's organizations and people, to match a funder or a contact against | `organizations-admin`, `users-and-security` | 17, 18, 27, 65, 75 |
| Who can edit a project, who can publish it | `users-and-security` | 01, 02, 12, 24, 82, 83, 84 |
| The Security page of workspace settings, which holds the setting of story 82 (proposed, Q-163) | `users-and-security` | 82, 83 |
| Shared projects: who may edit one | `connected-orgs` | 12 |
| Proposals: a draft project a person can edit | `project-intake` | 12 |
| Every plan includes recording performance measures; nothing here is plan-locked | `plans` | 12 |

"Used by stories" lists the stories that name the feature.

For `publish-review`, noted by the builder's checklist pass (2026-11-23) and not a requirement of this feature: the Review inbox's list of projects previews each project's first two changes from its hand edits only, so an imported change never shows in that preview though it is counted; and a project whose only waiting changes are imported is not in the prototype's inbox at all, because its list is built from the sample hand edits.

## Out of scope

The check script reads this table: an inventory ID or `spec #n` in the Item cell is excluded for the reason beside it, unless a requirement covers it. `part of <ID>` excludes part of an item that is otherwise covered.

| Item | Why |
|---|---|
| STA-30, STA-33, RUL-2, RUL-44, RUL-47 | owned elsewhere: `publish-review` (system map, shared surfaces and shared rules). Listed as dependencies above |
| STA-17, ACN-14, RUL-37; part of STA-13 and part of RUL-13 (the suggestion); part of OBJ-3 (the confidence) | dropped in interview (Q-25) |
| The three experiment layouts at `/proto/import-report` | dropped in interview (Q-20) |
| Setting up a data source from this layout (RUL-68, spec #26) | dropped from build 1 in interview (Q-29) |
| Several documents in one import; a document covering several projects; an entry from My Projects | spec #20 and the spec's Out of scope list. Proposed on Q-29: all three stay out |
| Filling a funder's form back out; self-serve reports | the spec's Out of scope list |
| Speech input | spec #21. Story 09 states that it is not offered (RUL-30) |
| Data sources (spec #22 to #29) | owned elsewhere: `gis-data-sources`; specified, not built |
| A workspace data source that publishes itself; the date a public figure was last published (spec #3, #4) | owned elsewhere: `publish-review` (and `gis-data-sources` for #3), shown by `public-site`. The inventory read both as context and has no item for them |
| Editing kept out of the review; bulk publish (spec #35, #37) | owned elsewhere: `publish-review`; not part of Import a report |
| Hold, Revert, row markers, notifications on hold or revert (spec #33, #34, #36, #38) | owned elsewhere: `publish-review`, build 2 |
| Opening or keeping the document after the import is added: in the review, from the change history, or anywhere (STA-35, ACN-19, ACN-20, ACN-21, RUL-46, RUL-65, RUL-191, RUL-200 to RUL-207, all struck) | not in the product: the file is not kept (spec #42, which replaces spec #19) |
| Deleting `/prototypes/team-5` (spec #39) | owned elsewhere: `team-5-sandbox`; Q-3 |
| Every row of the inventory's "Prototype artifacts" table | prototype artifact. Story 02 names the real capability behind the scripted readings; the browser-kept document stands in for nothing (spec #42); the rest stand in for other features' storage |

## Cuts I was least sure of

- **Story 01 against enablers 02 and 03.** The skeleton is "blocked by none" and carries a thin slice of the reading service and of document storage, so it is real end to end. The alternative is to build 02 and 03 first and block 01 on them; then story 01 is not the first thing built.
- **Enabler 02 covers one rule (RUL-33).** It exists because the scripted readings stand in for a whole service. The alternative is to fold RUL-33 into story 01 and have no reading enabler.
- **Enabler 26 is `undecided`** because nobody was asked whether the developer-machine reader's guards and unit table are requirements. If they are, 26 merges into 02 as `first`. If not, story 14 loses the stated cause of two of its cases. Answered 2026-11-23 (Q-62): requirements, `later`; 26 stays separate, and the first release converts nothing (Q-82).
- **The boundary with `publish-review`.** The unpublished-changes badge (STA-30), "not public until a publish" (RUL-2), the one-row fold (RUL-44, STA-33) and "a publish includes imported changes" (RUL-47) were removed as that feature's, on the system map's word. The alternative is one story here, "imported changes wait for a publish like any other", so that this feature's testers check the join themselves.
- **Story 24 sits inside another feature's surface.** The system map gives the review to `publish-review` and "source and note per row" to this feature. The alternative is to move 24, and the Manager's half of 21, to `publish-review` and leave this feature with one actor.
- **Stories 21 and 25 split the note by role**: writing it (Contributor) and reading it (Manager). Story 21 is thin alone. The alternative is one story with two actors. Taken on 2026-11-23: the two are one story, 21, in epic C (see the merge pass, below).
- **Story 05 (narrow screen) is a surface split with two items.** The alternative is to merge it into 04 and rely on the standing phone requirement.
- **Stories 19 and 20 are thin** (two items each). 19 could merge into 04 as part of the check step; 20 could merge into 04 as a warning state.
- **Story 16 depends on a feature that is specified, not built**, and on spec #40 (authoritative or two-way) and Q-56. It may belong in `later` until data sources exist; no answer says so, so it is `first` with the rest of spec #16.
- **Story 17 runs from the check step to the project page** (the funding row and "Total from all sources", RUL-48). The alternative is to split what the check step does from what the Funding sources table shows, and give the second half to `project-record`.
- **Story 12 is a story, not a standing requirement.** Who may import is specific to this feature; the general permission pattern is in `standing-requirements.md`.
- **Story 23 keeps Undo on a toast only** (Q-24), which the component's own note says is not reachable by keyboard. The story cannot pass the standing accessibility line as built; see Q-64.
- **Story 01 covers 23 items.** Eight are objects and screens named once. If it needs more than about 8 scenarios, the first cut is to move Cancel and "Read another" (ACN-7, ACN-8, RUL-53) to story 06. Done 2026-11-23: it had nine; see the note at the top.
- **The four splits of 2026-11-23 (30 to 33).** Each follows the first cut that worked in the slice method: business-rule variation (30 from 06, 32 from 13), input type (31 from 04) and workflow step (33 from 24). Story 04 still has nine scenarios after it, one over the limit. Story 13 is left with three scenarios and leans on 32 for the "Already on file" state; the alternative is to give "reading a report twice adds nothing" to 32 and merge what is left of 13 into it, which puts 32 over the limit again.
- **The seven splits of 2026-11-23 (35, 36, 40, 41, 45, 50, 51).** Each follows a cut from the slice method: workflow step (35 from 06; 40 from 09; 45 from 17), what is recorded against what is edited (36 from 07), kind of change (41 from 23), business-rule variation (50 from 26; 51 from 33). Story 17's alternative above was taken: the project page half is story 45, kept in this feature and not given to `project-record`. Story 36 can be shown on no screen in build 1; it has scenarios and no step a tester can run. Story 51 is small and stays on its own (see the note at the top). Stories 26 and 50 are `later` enablers that no story is blocked by. Two of the seven were undone by the merge pass of 2026-11-23: 45 went back into 17, and the change history row went back from 41 to 23.
- **Story 30, R3 has no scenario in any story.** Settled 2026-11-23: R3 moved to the new story 65, which is blocked by 17, 30 and 75 and holds the scenarios for all three messages.
- **The three splits of 2026-11-23 (65, 75, 80).** 65 and 75 both follow business-rule variation; 80 follows workflow step. 65 and 75 each stated the hand-ticked "Not in this workspace" case; 65 was made the second one built (blocked by 75), which puts it in the last wave. The alternative is to fold 65 into 75, which would put 75 well over the scenario limit. Story 17 is left with four requirements and must not be released without 65 and 75.
- **The merge pass of 2026-11-23.** Three merges and three moved parts, each so that a story's own effect shows with its blockers alone. What it leaves for the user:
  - **36 as an enabler.** Nothing it records shows on any screen in build 1. The alternative is to fold it into the stories where each fact arises: R1, R3, R4 and R6 into 07 (13 scenarios), R5 into 14 and 75, R2 into 17 (12 scenarios), with RUL-39 split four ways. Nothing becomes visible either way, so it stays whole; as an enabler it unblocks only `publish-review`, build 2.
  - **21 with two actors.** The note has one reader, the Manager, and one screen, the review; what the Contributor's half records can be seen nowhere else in build 1. If one actor per story must hold, the two halves come apart again and the Contributor's half is "recorded, seen through the Manager's story".
  - **21's epic.** C, because its last blocker and its outcome are in the review. A is defensible: the note is written in the Contributor's journey.
  - **Not merged, on purpose:** 06 with 35, 09 with 40, 33 with 80, 65 with 30 or 75, 26 with 50 (each half is demonstrable alone, or the merge would hold a story back by waves); 13 with 32 (14 is blocked by 32 and blocks 13, so a merge would make a cycle); 24 with 51 (51 needs 33, which is blocked by 24).
  - **Built in one story, first seen in another.** Three of the tally's four parts (04, R2) and the unticked arrivals (06, R4) are first seen in 14, 16, 32 and 75; what each change records (22, R2) is first seen on a review row, story 24; the editing half of 32's R5 needs 07, which 32 is not blocked by (blocking it would add a ninth wave); that a kept document is no longer kept after "Undo" (41, R4) shows on no screen. Each is stated in its story and left as it is.
  - **Scripts that need the whole funder report.** A fixture problem, not a slicing one: see `coverage.md`, Findings, "Not demonstrable with blockers alone", `fixtures.md`, "Samples the feature still needs", and Q-159.
  - **Story 01** runs to 195 lines with the toast; it stays whole.
- **The changes of 2026-11-23, when the answers were written in.** What they leave for the user:
  - **84 from 23** (happy path against exception). 23 keeps the plain Undo; 84 holds what happens when the record or the right has moved. The alternative is one story of about 18 scenarios.
  - **86 from 17** (business-rule variation). 86 holds a funding source the record or the reading already holds; it waits on 41 for its Undo scenarios, which puts it in the last wave.
  - **85 is what is left of 51.** Small (five scenarios), kept apart from 24 because it needs 15 and 41, which 24 must not wait for. If the user would rather keep the number, its content goes back under 51.
  - **81 is written here and owned by `project-record`**, so that toast-only Undo is workable. It is not prototyped.
  - **82 and 83** follow spec #41. Four points of 82 rest on proposals (Q-162 to Q-165), among them which settings page holds the control.
  - **Story 16 stays `first`** against a stand-in, though no `gis-data-sources` story is in the first release (Q-17's proposal). It cannot be accepted against the real thing until that feature exists.
  - **Blockers added by the closing pass** (08 on 10, 11 on 09, 15 on 19, 20 on 22, 30 on 05, 36 on 13, 83 on 12, 85 on 41) move 08, 11, 12 and 83 a wave later and add no wave. The alternative for each was to leave one scenario marked "run once story NN is built".
  - **Still seen only through another story**: see `coverage.md`, Added by hand.

## Orphans

- none
