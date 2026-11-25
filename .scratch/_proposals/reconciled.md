# Reconciled proposals

Written 2026-11-23 from `part-1.md` to `part-4.md`. Every block is a proposal awaiting validation; none is a decision. The same `Proposed` text is in `.scratch/open-questions.md` under each question, and the one page the user reads is `.scratch/proposed-answers.md`.

Counts: 147 questions. Needs you 3, worth a look 23, routine 121. Import a report (118): 3 / 16 / 99. Product-wide and GIS data sources (23): 0 / 6 / 17. Classification groups, another effort (6): 0 / 1 / 5.

## Reconciliations made

Proposals changed, and why. Order of the method: written decision, product purpose, consistency, safe default, least new surface.

1. **Q-17 with Q-60, and story 16.** Q-17 puts every `gis-data-sources` story in the later release; Q-56 says no other kind of data source is built. So nothing can make a field "kept" in the first release. Q-17 now says story 16 moves from `first` to `later`, and is flagged as an amendment to the story map the user approved on 2026-11-23 (which set story 16 `first`). Q-72, Q-126, Q-127 and Q-58 note that they apply when story 16 ships; Q-159's key facts sample no longer serves story 16; Q-110 notes that the "kept by a data source" part of the tally appears only then. Low confidence. If the user rejects it, story 16 stays `first` and is accepted against a stand-in.
2. **Q-99 (b) with Q-91.** Q-99 showed an arithmetic line with a negative result ("= −177"); Q-91 says a total to date that the record already exceeds shows no arithmetic line and states the figures in a sentence. Q-99 (b) rewritten to Q-91's form (purpose: never show false or confusing arithmetic).
3. **Q-99 Changes, against the fixtures.** Q-99 said the funder report holds both 1,850 and 12,400 for one measure and that its rows change. It does not: 1,850 is the crew log's row C2, 12,400 the funder report's row F6. No fixture row changes and "7 ready to add · 4 need you · 3 already on file" stands. The case needs a sample of its own (noted on Q-159).
4. **Q-99 (f) with Q-87.** Q-99 said a ticked change the record now holds is "passed over and not counted" and, two sentences on, that nothing is saved and the person presses again. Q-87 (b) says the import stops once. One rule now, in both: the press stops, the changes are re-marked, the person presses again on a true count; an entry may be ticked again on purpose (Q-87 (a)), a Key facts field, contact or funding source already on file has no checkbox (Q-87 (c) to (e)). Q-87 gained the funding source edited into a match (Q-50, Q-133 (c)).
5. **Q-118 with Q-82 (d).** Q-118's Changes said the pasted paragraph's multiplication "should be shown under a label". Q-82 (d) says the first release multiplies nothing, which follows the user's confirmation that the first release converts nothing and the rule that names only adding lines. Q-82 wins; Q-118 now says adding lines is the only arithmetic of the first release.
6. **Q-122 (b) with Q-131 (d).** Q-122 let a picked organization be cleared; Q-131 says it can be changed, not cleared (a funding source is left out by unticking). Q-131 wins (least new surface); the clearing clause is removed from Q-122.
7. **Q-149 with Q-115 (b); Q-150 with Q-71 and Q-125.** The first-release proposals already do half of what the later ones proposed. Q-149 now says the breakdown note exists from the first release with one wording, and the later check adds only the low-confidence note. Q-150 says the Timeline case is caught in the first release and the later check adds the field the project did not offer.
8. **Q-70, Q-69 and Q-47 with Q-106 and Q-38.** Q-70 now says only a file Upload shapes takes (a .zip) is passed; Q-69 (a) refuses a file that is neither on the report list nor spatial; Q-47's 20 MB is for reports, and a .zip passing through follows Upload shapes' 50 MB.
9. **Q-19 with the feature's terms.** The glossary draft called the project's log "Change log". The Import a report terms file and every story call it "change history", and "change log" is the performance measures' own log (Q-101). The draft is now "Change history", with "change log" under Avoid. 36 drafts in all.
10. **Q-16 with Q-134 and Q-135.** One owner and one story: `project-record` owns a project's funding rows and contacts in the first release and gets the single story Q-135 adds; Q-134's two rules are handed to `project-record` (store the organization, not its name) and `organizations-admin` (an organization a funding source names cannot be removed).
11. **Q-33 with Q-63, Q-99 and Q-114.** "A flagged change always arrives empty" contradicted three proposals in which an unticked change keeps its figure. Q-33 now scopes the empty amount to a figure the reading is unsure of.
12. **Q-110 with Q-63, Q-87 and Q-99.** The tally's parts are defined once: "need you" is every change that arrived unticked and waits on the person (flagged, repeats, another project's); "left out" is a change the person unticked; only an entry can be ticked while already on file.
13. **Q-98 (d) with Q-43, Q-65, Q-71, Q-125, Q-129.** The fixed set of "Not used" reasons now includes the reasons those proposals name.
14. **Q-49 with Q-136.** The Updates feed item names the document only to people allowed to read the name.
15. **Q-83 reclassified** from routine to worth-a-look: an accessibility standard is often set by contract, and it binds every screen.

Checked and found consistent, no change: Q-75 (a) with Q-137 (the hand edit stands; the toast counts what was removed and what was kept); Q-61 with Q-122 (one badge, "Needs you", which goes when the change is ticked); Q-32 with Q-116, Q-124 and Q-126 (Key facts and contacts are not edited on the check step; the markers apply to figures and funding sources); Q-33 with Q-78; Q-50 with Q-99 (e), (f) and Q-133; Q-63 with Q-130 and Q-74; Q-56 and Q-57 with Q-127; Q-64 with Q-157 and Q-75 (b); Q-44 with Q-84 and Q-140; Q-53 with Q-86, Q-94 and Q-144; Q-45 with Q-77, Q-85 and Q-137; Q-13 (tags has its own add page in the current build).

No proposal reverses an answer in the Answered section. Five narrow or lean on one and are flagged worth-a-look: Q-71, Q-114 and Q-115 (Q-62: guards are later), Q-106 (Q-26: spatial hand-off is first release), Q-64 and Q-135 (Q-24: Undo is toast only; both keep it).

## Scope effects

Every story added, removed, moved between releases or materially widened. Story numbers are project-updates stories unless a feature is named.

Added
- Q-135 (with Q-16): one first-release story in `project-record`: edit and remove a funding source row and a contact row on the project page. Stories 17 and 18 depend on it for release; story 23, R6 loses "Not decided".
- Q-159: no story, but ten recorded samples in `fixtures.md`; the scenarios and scripts of stories 03, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23, 31, 33, 36, 41, 51, 65, 75 and 80 are re-pointed.
- Q-79: story 27 (later) gains a blocker that does not exist yet: a partner organizations section on the project page (`project-record`, later).
- Q-155: one later story in `public-site` (a group's public page and group filters).
- Q-16: feature `funding-sources` added to the system map, later, no stories yet.
- Q-18: feature `reports` added to the system map, later, no stories yet.
- Q-12: `public-site` covers all five not-public states (four are not built).
- Q-4: Grid defaults becomes a later story of `workspace-look-and-language`.
- Q-55, Q-59: `gis-data-sources` gains the conflict list and the unsent-edits list (later).
- Q-9: one product-wide standing-requirements entry (the builders' editing grammar).

Removed
- Q-1: feature `pm2` leaves the system map; stories name `performance-measures` only.
- Q-3: `team-5-sandbox` leaves the map and the registry.
- Q-4: the old Vocabulary page goes.

Moved between releases
- Q-17: story 16 moves `first` to `later` (amends the approved story map). All `gis-data-sources` stories are later; the GIS door for creating projects is later.
- Q-71: the test "a Key facts value fits its field" moves from enabler 50 (later) into story 15 (first).
- Q-114: the test "the reporting period is one the project offers" moves from enabler 50 into stories 07, 14 and 30 (first).
- Q-115 (b): the test "a breakdown answer is one of the options" moves from enabler 50 into story 07 (first). Enabler 50 narrows by these three (Q-149, Q-150).

Materially widened
- Q-99, Q-87: stories 01, 04, 13, 15, 17, 18, 19, 32 and 41, and enabler 02 (repeats inside a reading; the check on the record at the press; no checkbox on a Key facts field, contact or funding source already on file).
- Q-66 (b): stories 04 and 31, enablers 02 and 03 (every file type shown as marked passages, kept with the file); 33 and 40 follow.
- Q-137, Q-75, Q-138, Q-157: stories 23 and 41 rewritten on one Undo rule; story 23 passes the scenario limit, so the hand-changed cases may split into a story of their own.
- Q-64: story 23, R1 (keyboard and announcement); the toast component needs work (a hub request).
- Q-106: story 11 (only a .zip is handed, three wordings of the box, 50 MB), story 10, R3; `work-areas` must open Upload shapes with a file received.
- Q-50: story 17 (a change to an existing row's amount), story 41.
- Q-82: story 14 gains the unit case; fixture rows C3, C4, F4, F5 restated and P3 flagged (the pasted paragraph reads 2 ready, 1 needs you).
- Q-110: stories 04 and 06 (a fifth tally part, "left out").
- Q-98, Q-129: story 19 and enabler 02 (reasons from a fixed set, worded in code; every unused item listed).
- Q-101: `performance-measures` change log rows show their source; stories 01 and 23.
- Q-130: stories 20, 21, 22 and 24 (the import records that the report named another project).
- Q-136: stories 17, 18, 22 and 24 (the document's name is withheld from people who can neither edit nor publish).
- Q-109: stories 01, 02 and 12 (the right to edit is checked again on "Read it" and "Add N changes").
- Q-80 (j): enabler 03, R2 amended for later story 28 (the document is held from "Read it").
- Q-5: `publish-review` and `plans` (the plan lock moves from the review to the review schedule; the plans spec is amended).
- Q-58: `gis-data-sources` and `publish-review` (spec decision 24 narrowed).
- Q-134, Q-133 (b): `organizations-admin` (an organization a funding source names cannot be removed; names unique ignoring capitals).
- Q-127: `gis-data-sources` (one supplier per field).
- Q-156: `map` and `progress-dashboard` name "top-level group".

Still `needs-info`
- Q-45: stories 03 and 40. Q-52: enabler 02. Q-88: the 34 stories whose Reset line cites it.

## Blocks

### Q-1
Class: worth-a-look
Proposed: `performance-measures` stays and owns the Performance measure object; `pm2` is out and its four routes (`ws/pm2`, `ws/pm2/[measure]`, `ws/pm2/new`, `pm2/projects/[project]`) are removed from the map and the navigation. Nothing further is taken from `pm2`: the two points left out on 2026-10-09 (which breakdown allows several picks; freezing breakdowns at publish) stay out. — The original was reconciled with PM 2's model on 2026-10-09 (status, stored claim, sum or no-sum counting rule, breakdowns owned by the measure, reporting periods, change log), so it already holds what the comparison was for, and every other feature (classifications, dashboard, Import a report, review, public site) reads the original's data. (confidence: high)
Changes: The `pm2` feature leaves the system map, so no stories are written for it. Stories that say "`performance-measures` (or `pm2`, Q-1)" name `performance-measures` only (project-updates stories 01, 02, 06, 07, 13, 23, 26, 30, 32, 50, 65).

### Q-3
Class: routine
Proposed: Yes, it is out. `/prototypes/team-5` is deleted whole, including `mode="update"` on `firma2-my-projects`, and gets no requirements. — Spec decision 39 says so, and its condition (the Import a report page exists) is met. (confidence: high)
Changes: `team-5-sandbox` leaves the system map and the registry. Deleting it is a clean-up task, not a story. No story changes.

### Q-4
Class: routine
Proposed: (a) `workspace-settings/vocabulary` is a leftover and goes: Terminology (`workspace-settings/labels`) replaced it and uses the same editor. (b) `workspace-settings/grid-defaults` (the workspace's default table columns) is kept as a `later` story of `workspace-look-and-language`; it is not in the first release because no navigation reaches it. (c) The registry row `report-import` is retitled "Import a report" and pointed at the Import a report page, since the side sheet it described was removed (spec decision 7). (d) The registry row `my-projects` takes the slug `map` to match its title; the `my-projects` address keeps redirecting to Map. — (a), (c) and (d) follow written decisions; (b) is the least new surface for a page nobody can reach today, and the plans spec still lists Grid defaults as a feature. (confidence: medium)
Changes: `workspace-look-and-language` covers Terminology now and Grid defaults later; it gains no first-release story from this. Two registry rows corrected. No other story changes.

### Q-5
Class: worth-a-look
Proposed: Publish review is on every plan. On every plan the public page and reports show only published values, and a person publishes from the same review. What a higher plan adds is the governance around it: a manager per organization, the review schedule, and the Overdue marks and reminders. On a plan without managers, an administrator publishes. "Agency publishes directly" is struck from the plans spec, and its row "Publish review queue and schedule" becomes "Review schedule and per-organization managers". Until the plan split is settled, no story names a plan for review. — The published-values rule is the product's trust claim (project-updates spec, decision 2) and the plans spec's own rule is "never paywall the truth"; a plan that publishes directly would let unchecked figures reach reports. It also closes the gap noted on Import a report: nobody could import changes that nobody can publish. (confidence: medium)
Changes: Amends `.scratch/tiers/spec.md` (the "Publish review queue and schedule" row and "publishes directly"). `publish-review` stories carry no plan lock on the review itself; the plan lock moves to the review schedule page. `plans` stories lose "Agency publishes directly". Consistent with Q-6 (plans exist) and Q-7 (the row "Stewards" reads "Managers").

### Q-6
Class: routine
Proposed: There are plans: Free, Agency and Program, as the plans spec defines. The line in `docs/roles-and-permissions.md` ("No equivalent; we have no billing or plans") is corrected to say there is no separate Owner role, and that administrators see and change the workspace's plan. — The plans spec (2026-10-19) is later than the roles document's sentence (2026-10-02), and the roles document already speaks of "the plan's organization limit" further down. (confidence: high)
Changes: None beyond correcting one line of `docs/roles-and-permissions.md`. Which feature sits on which plan stays as the plans spec has it, apart from Q-5.

### Q-7
Class: routine
Proposed: A missed rename. Every "steward" in `.scratch/project-intake/spec.md` and `.scratch/tiers/spec.md` becomes "manager", including the plans table row "Stewards", which reads "Managers". Stories say Manager only. — Access-requests spec, decisions 21 and 23: the rename reaches the interface, documents and code in the same pass. (confidence: high)
Changes: Wording only, in two specs. `project-intake` and `plans` stories use Manager.

### Q-8
Class: routine
Proposed: In the review inbox, under Proposals, beside Waiting and Held. The approver is unchanged: a manager of the lead organization, or an administrator when it has none. The acts are unchanged: Approve (the project moves to Planning & Design), or Return with a required comment that shows at the top of the proposer's intake page. The separate "Proposals to approve" block is gone. `project-intake` owns the proposal's states and the approval rule; `publish-review` owns the inbox that shows it. — The later decision wins (user, 2026-11-18, recorded in the project-updates spec), and the intake spec had already asked for approval "where I already review work". (confidence: high)
Changes: `.scratch/project-intake/spec.md` is corrected where it describes its own approval block. `project-intake` stories state Approve and Return and depend on `publish-review` for the inbox; `publish-review` stories state the Proposals view. No story is added or lost.

### Q-9
Class: routine
Proposed: Standing requirements, not a feature. The grammar (add from a blank line with "/" or +, act from the grip, settings on the block, the same keys, light selection) is stated once as product-wide standing requirements whose source is ADR 0001. `project-intake` (the intake builder) and `custom-pages` (the page editor) each cite them and prove them in their own builder stories. How a builder saves stays out of the grammar, as the ADR says. — A grammar is a rule every builder obeys, not a goal a person has; a feature for it would hold no actor. This adds no feature, and any later builder inherits it by citing it. (confidence: medium)
Changes: A product-wide standing-requirements entry is added. No feature added. `project-intake` and `custom-pages` builder stories gain a citation and scenarios for the grammar.

### Q-11
Class: routine
Proposed: `public-site` owns both switches and what each does: Public access (published projects, pages and the map can be read without signing in) and Contact details (off by default; names always show). The controls stay where they are, in the Public site section of the Custom pages settings screen; `custom-pages` only hosts that section. — The owner is the feature whose behavior the switch changes; moving the screen would add work and decide nothing. (confidence: medium)
Changes: None beyond filling the stories: `public-site` gains the two switch stories; `custom-pages` stories mention the section and depend on `public-site`.

### Q-12
Class: routine
Proposed: Yes. `public-site` owns what a visitor sees in all five (unpublished project, private organization, hidden stage, public access off, page not shared). Each cause stays with the feature that sets it (`publish-review`, `organizations-admin`, `stages`, `public-site`, `custom-pages`), which depends on `public-site` for the result. In the four cases about one project or page, the visitor sees the same "not public" page whatever the cause, so the page never reveals that a private organization or an unpublished project exists. When public access is off, every public address asks the visitor to sign in. All five are in the first release of the public site. — One owner for one screen; a public site missing four of the five would show what the workspace chose to hide. (confidence: medium)
Changes: `public-site` gains the four states not built today (noted as a gap in the public views inventory). The four causing features gain one dependency line each.

### Q-13
Class: routine
Proposed: `tags` owns the shared behavior: add on its own page, rename in place (a blank or duplicate name is refused and the stored name stands), saving as each field is left, and remove from the danger zone. `project-types` and `classifications` (classifications and groups) cite it and state only what they add: a project type's guidance and preview; a classification's performance measures and targets; a group's colour and parent. — A tag is the plainest use of the construction, so its stories state the shared part with nothing else mixed in. (confidence: medium)
Changes: None beyond filling the stories. `project-types` and `classifications` stories depend on the `tags` stories for add, rename and remove.

### Q-14
Class: routine
Proposed: `personal-settings` owns the notification switches and the one rule behind them: an email about an event is sent to a person only while that person's switch for it is on. Each event belongs to the feature that raises it (a proposal submitted or returned: `project-intake`; a revert: `publish-review`; a request waiting: `access-requests`). `organizations-admin` owns its own list, "Email to administrators", on the Organization settings page and reuses the same switches. — The surface was built for the person's own settings first; no one feature can own every event. (confidence: medium)
Changes: None beyond filling the stories. Features that notify gain a dependency on `personal-settings`.

### Q-15
Class: routine
Proposed: The portfolio map as its own page is out and stays archived. The portfolio map as the map on Organization Home stays in the product, with its export. `map` owns the portfolio map, its export and the project set map; `organization-pages`, `projects-index` and `performance-measures` show them and depend on `map`. `work-areas` owns only how shapes get onto a project. — Organization Home's own header calls it "the Map page's map, scoped to the organization", and one feature should own everything that draws many projects on a map. (confidence: medium)
Changes: None beyond filling the stories. `map` gains the export and the project set map; three features gain a dependency on `map`.

### Q-16
Class: worth-a-look
Proposed: A feature to add, later. For the first release `project-record` owns a project's funding sources (add, edit and remove a row: the grant or program, the organization behind it, the amount secured), and `custom-fields` keeps the funding source fields. A `funding-sources` feature (the workspace's list of funding sources, and Funding Status) is added to the system map as not built, release `later`. Its public pages wait for it, as decided on 2026-11-20. — The brief lists Funding Sources and Funding Status as screens the product has and has not built; until then the only place a funding source is made is the project page, so that is its owner. (confidence: medium)
Changes: Adds `funding-sources` to the system map as a `later` feature with no stories yet. `project-record` gains the funding rows; Import a report's funding source stories (17, 65, 75) depend on `project-record`. The row controls are the one story Q-135 adds (edit and remove a funding source row and a contact row); Q-134 hands `organizations-admin` the rule that an organization named by a funding source cannot be removed.

### Q-17
Class: worth-a-look
Proposed: (a) First release: two doors are open, New project (the intake form) and Import projects (a spreadsheet). The third, projects created from a GIS source, opens when `gis-data-sources` ships, which is later: the spec calls data sources "specified, not built". (b) `gis-data-sources` owns the rule for which doors a workspace offers, because its Project source setting is that rule: when an authoritative GIS subscription supplies the workspace's projects, New project and Import are withheld; otherwise both are offered. (c) Who may use an open door stays with `users-and-security` ("Create projects", "Import data"). (d) Import a report's handling of a field kept by a data source (project-updates story 16) has nothing to act on until a data source exists, so it moves to the later release with `gis-data-sources`; the first release keeps only the seam (the check step asks whether a field is kept, and the answer is always no). This amends the story map approved on 2026-11-23, which set story 16 `first`. — The first two doors are built and specified; the rule already lives on the Project source page. (confidence: medium on the owner, low on the release)
Changes: `gis-data-sources` stories are all `later`, and project-updates story 16 moves from `first` to `later` with them (an amendment to the approved story map; Q-72, Q-126 and Q-127 then describe the later release). Consistent with Q-60. `project-intake` and `import-projects` gain a dependency on `gis-data-sources` for being withheld.

### Q-18
Class: worth-a-look
Proposed: A feature to add, later: `reports` (the stakeholder report and the fact sheet as documents). It is inside this product; the brief says reports are the reason the product exists. In the first release the published-values rule is proved where published figures can be read today: the public site, the Progress Dashboard and export. `publish-review` keeps owning the rule; `organization-pages` keeps the list of reports owed. What the report holds is not proposed here: the brief says to answer that with the client. — No report is designed, so no story can be written for one yet, but leaving it off the map would hide the feature every other feature feeds. (confidence: medium)
Changes: Adds `reports` to the system map as a `later` feature with no stories yet. Stories that say "reports show only published values" name the public site, dashboard and export as where it is tested in the first release.

### Q-19
Class: routine
Proposed: Yes. The definitions below are drafted for `GLOSSARY.md`, one sentence each, in the glossary's own form; they are added on validation and stories cite them. Classification and Classification group are already defined and are left as they are. — Stories already use these words; the drafts follow how the specs, the roles document and the prototype use them. (confidence: medium)
Changes: `GLOSSARY.md` gains the terms below. The "Words from the rest of the product" table in the Import a report terms file points to the glossary instead of defining them again.

Drafted definitions:

The record and how it changes

- **Project** — one piece of work an organization leads, recorded once the work is done or under way so its progress can be published and added up. _Avoid:_ record (as the noun for the object).
- **Record** — everything the workspace holds about a project, published or not; saving to the record does not make a value public.
- **Lead organization** — the organization that leads a project; its Contributors can edit it. Funding a project gives no edit rights.
- **Proposal** — a project submitted through the intake form that waits for approval; it does not count in reports or on the public map until a manager approves it.
- **Change** — one difference made to a project's record, kept with who made it, when, and its source: by hand, a named document, or a named data source. _Avoid:_ project update (as a noun).
- **Change history** — every change to one project, newest first, opened with History on the project page. _Avoid:_ audit trail; change log (kept for the performance measures' own log).
- **Publish** — a manager's act of making a project's waiting changes public; nothing is published because time passed.
- **Published version** — a project as it stood when a manager last published it; the public and reports read only this. _Avoid:_ snapshot (in visible copy).
- **Review** — where a manager reads a project's unpublished changes as one difference from the published version, and publishes.
- **Entry** — one amount recorded for one performance measure of one project in one reporting period, with any breakdown answers.
- **Reporting period** — the named period an entry is filed under, usually a year.
- **Contact** — a person named on a project, with a role, an organization and an email; a contact is not an account.
- **Funding source** — a grant or program that pays for part of a project, with the organization behind it and the amount secured. _Avoid:_ funder (for the grant itself).

People

- **Role** — one of three fixed levels a person holds across the workspace: Administrator, Contributor or Viewer. There are no custom roles.
- **Administrator** — the role that configures the workspace and manages people; counts as a manager of every organization.
- **Contributor** — the role that edits the projects led by the organizations the person belongs to.
- **Viewer** — the role that reads published values only; with no organization, a Viewer sees exactly what the public sees.
- **Manager** — a Contributor who runs one organization's members, settings and publishing; a flag on one membership, not a role. _Avoid:_ steward.
- **Membership** — a person's belonging to one organization; a person can hold several, and their role is the same in all of them.
- **Join request** — a person's request to belong to an organization, to edit its projects or to follow it, answered by its managers.
- **New-organization request** — a person's request for an organization that is not listed, answered only by an administrator.

What a workspace sets up

- **Project type** — the kind of work a project is; it decides what the project asks and shows. Optional. _Avoid:_ category.
- **Tag** — a label from a closed list that a project can carry; it has no performance measures or targets.
- **Stage** — a step in the lifecycle projects move through; each stage decides whether its projects show on the public site. _Avoid:_ status.
- **Custom field** — a fact about projects, or about funding sources, that a workspace defines for itself.
- **Work area** — a place where a project's work happens, held as a shape on the map; a project can have several. _Avoid:_ footprint, location (for the shape).
- **Map layer** — something every map in the workspace is drawn from: the base map, or a reference boundary shown under the work areas.
- **Data source** — a system outside the product, such as a GIS layer, that keeps some of a project's fields current. _Avoid:_ connected (kept for connected organizations), integration.
- **GIS subscription** — a workspace's data source that is a GIS layer; it is either authoritative (the fields it supplies cannot be edited here) or not (edits here are sent back to the GIS system).
- **Custom page** — a page of written content a workspace keeps for its readers, beside the product's own pages.
- **Document** — a file, such as a PDF, kept among the workspace's pages and read in place. (The file given to Import a report is that feature's "report".)
- **Folder** — a named group of custom pages and documents; folders do not nest.
- **Dashboard** — one screen of tiles showing the workspace's published figures; a workspace can have several.
- **Saved view** — a named set of filters on the projects list that opens as its own page.
- **Terminology** — the workspace's own words for the product's nouns (Project, Organization, Performance measure and others), shown wherever those nouns appear. _Avoid:_ vocabulary, labels.
- **Brand colour** — the one colour a workspace chooses for its public site and the product's accents.

### Q-29
Class: routine
Proposed: Not in the first release: several documents in one import, a document covering several projects, an entry from My Projects, setting up a data source from this layout, and filling a funder's form back out. One document, one project, started from the project page — spec #20 and the spec's Out of scope list already say so (confidence: high)
Changes: none beyond filling the story; the story map's Out of scope row loses "Not confirmed".

### Q-30
Class: worth-a-look
Proposed: The header entry is the prototype's: an always-visible icon button in the breadcrumb row, which moves into the "…" menu under phone width — the built page is the later decision and a reporting act should not sit behind a menu (confidence: medium)
Changes: amends spec #8 ("an item in the '…' menu"); story 08 as written.

### Q-31
Class: routine
Proposed: Every entry point and the page title read "Import a report", including the button on the performance measures card — one name for one act (confidence: high)
Changes: none beyond filling the story (stories 01, 12).

### Q-32
Class: worth-a-look
Proposed: Figures are editable on the check step; facts and people are taken or left. A performance measure change (amount, reporting period, breakdown answers) and a funding source change (grant or program, organization, amount) can be edited before adding. A Key facts change (Timeline, County, any other built-in or custom field) and a contact change can only be ticked or left out; a wrong one is left out and typed on the project page — the check step would otherwise need an editor for every field type a workspace can define, and the project page already edits each in one click (confidence: medium)
Changes: amends spec #13 ("every proposed value is editable"). Stories 07 and 36 as written; consistent with Q-71 (a value that does not fit goes to "Not used", since it cannot be corrected in place).

### Q-33
Class: routine
Proposed: A change the reading could not settle always arrives with its amount empty and unticked, including one the report supports two readings of; neither reading is written in. This is for a figure the reading is unsure of; a change that is unticked for another reason (a repeat, Q-99; a reporting period the project does not offer, Q-114; a report that names another project, Q-63) keeps the figure as read — spec #13 and the standing decision "never a pre-filled guess" (confidence: high)
Changes: story 14, R4 changes (no reading written in; typing the figure ticks it, as for any empty change); fixtures row for the 6-or-12-acres change; the prototype sample is corrected. How the two readings are shown is Q-78.

### Q-34
Class: routine
Proposed: A contact is matched by email, ignoring capitals and outer spaces; by name only when the report gives no email (Q-73). A match with a person in the workspace changes one helper line and nothing else: the contact is stored as the name, role, organization and email the report gives, not linked to an account, and nobody is invited. The role is the text the report uses, as the Contacts panel already takes any role — spec #14, and the least new surface (confidence: medium)
Changes: none beyond filling the story (story 18). Consistent with Q-73.

### Q-35
Class: routine
Proposed: A funding source whose organization the person did not pick stays on the check step as an unticked change with its badge, is counted under "need you", and is not saved. That is where it is "listed as not added"; nothing lists it again after adding, because the reading is not kept (Q-46) — it is never dropped from the person's sight before they decide, which is what the spec protects (confidence: medium)
Changes: reads spec #15's "listed as not added" as the check step's list; fixes the prototype where the change is dropped. Story 75, R4 as written; no line added to story 19. Consistent with Q-46.

### Q-36
Class: routine
Proposed: The field is labelled "Note for the reviewer (optional)". "Reviewer" is the interface's word for whoever reviews and publishes the project; the role stays Manager in the roles reference and in stories — an Administrator reviews too, so the label names the act, not one role (confidence: medium)
Changes: none beyond filling the story (story 21); spec #17's "note to the manager" is a description, not the label.

### Q-37
Class: worth-a-look
Proposed: A row names its source only when the change came from a document or a data source. A hand edit shows who and when, with no source label: by hand is the default, and "only the exception names its source" — the dated note in the code is the later decision, and a label on every row says nothing on most of them (confidence: medium)
Changes: amends spec #5 and #31 ("every row, the same way"). Stories 22 and 24 as written; `publish-review` and `updates-feed` follow the same rule.

### Q-38
Class: routine
Proposed: One list everywhere (file control, drop on the project page, the reading): PDF, Word (.docx), Excel (.xlsx), CSV and plain text (.txt). The older .doc and .xls are refused before reading, with a message that says to save the file as .docx or .xlsx — it is what the reader can read reliably, and three lists that disagree is the bug (confidence: medium)
Changes: none beyond filling the stories (01, 08, 10); the control's label and accept list are corrected. Spatial types stay with story 11.

### Q-39
Class: routine
Proposed: A person who can see the project but not edit it sees none of the three entry points (absent, not disabled), and a file dropped on the project page starts nothing. The page's address shows them the product's standard no-access page with a way back to the project; no document, reading or unpublished value is sent — standing rule: someone who may not act never receives the page (confidence: high)
Changes: none beyond filling the story (story 12). Consistent with Q-77 (a).

### Q-40
Class: routine
Proposed: Import a report is offered while the project page is being read; pressing Edit is not needed — the brief keeps reporting acts available while reading, because filing figures is not editing the record (confidence: high)
Changes: none beyond filling the stories (01, 08, 12).

### Q-41
Class: routine
Proposed: Every failed reading returns the person to the choose step with the file still held and nothing saved, and says "Couldn't read <name>." followed by the reason: no text to read, it may be a scan; it is password-protected; the file is empty; reading took too long, try again; the reading service is not available, try again shortly; the connection was lost. A file over the limit never reaches the reading: the control refuses it with the limit stated — the person must be able to tell "fix the file" from "try again" (confidence: high)
Changes: none beyond filling the stories (02, 10). Consistent with Q-66 (a) and Q-85 (c).

### Q-42
Class: routine
Proposed: A reading that proposes nothing is not a failure. The check step opens with the document, one line saying nothing in the report can be added to this project, and the "Not used" and "Skipped" lists if there are any. There is no commit action; "Read another" and "Cancel" remain — the person should see what was read and why none of it was used (confidence: high)
Changes: none beyond filling the stories (02, 04, 19).

### Q-43
Class: routine
Proposed: Import is still offered on a project with no performance measures: Key facts, funding sources and contacts can be proposed, and every figure the report states goes under "Not used" with the reason that the project has no performance measure for it. When the project has no closed reporting period, its performance measure figures go under "Not used" with the reason that there is no closed reporting period to file them under — nothing is filed where the record cannot hold it, and nothing is dropped silently (confidence: medium)
Changes: none beyond filling the stories (02, 07, 12).

### Q-44
Class: routine
Proposed: An import is all or nothing. If the save fails, nothing is on the record, the person stays on the check step with their ticks, edits and note intact, and a message says nothing was added and to try again. If the record changed underneath so that a ticked change no longer stands (Q-87 (b), Q-48), nothing is added, the changes concerned are updated and marked, and the person presses again — a half-added import cannot be undone as one and makes totals untrustworthy (confidence: high)
Changes: none beyond filling the stories (01, 22). Consistent with Q-48, Q-84, Q-87.

### Q-45
Class: needs-you
Needs you: how long a kept document must be kept, and whether the organization or a client requires that documents can be deleted on request or that opening one is logged; these are policy or contract facts. Assumed meanwhile: kept for as long as its project exists; people who can edit or publish the project can open and download it; nobody deletes one on its own (it goes when its import is undone or its project is deleted); opening it is not logged; pasted text is held to the same rules.
Changes: none beyond filling the stories (03, 40) on the assumption; they stay `needs-info` until the retention period is given. Consistent with Q-77 (b) and Q-85 (b).

### Q-46
Class: routine
Proposed: The reading is not kept. After "Add N changes" the product holds the document, the note and the changes that were added; the changes left out and the "Not used" and "Skipped" lists are discarded — the document is kept and can be read again, and a stored reading is a new thing to own (confidence: medium)
Changes: none beyond filling the stories (01, 19). Consistent with Q-35; the later story 28 is the one place a reading is stored, for a time (Q-80).

### Q-47
Class: routine
Proposed: A report file is at most 20 MB (a .zip passing through to Upload shapes follows that screen's 50 MB limit, Q-106), and at most 100 pages or 5,000 spreadsheet rows; pasted text at most 50,000 characters; the note at most 500 characters. Each is refused at its own control with the limit stated, before anything is read; nothing is cut short silently, and the note field counts down near its limit — 20 MB is what the page already shows; the page and row figures are a common ceiling and are to be confirmed against the reading service when it is chosen (confidence: medium)
Changes: none beyond filling the stories (01, 02, 09, 10, 21).

### Q-48
Class: routine
Proposed: The last save stands, as for two hand edits, and nobody is notified. What prevents a wrong record is the check on "Add N changes" (Q-87 (b)): if another import or a hand edit has changed what a ticked change stands on (the entry is now on file; the value it would replace is no longer the one shown), nothing is added, those changes are updated and marked, and the person presses again. The second of two people importing the same report therefore finds its entries "Already on file" — never count twice, with no new screen (confidence: medium)
Changes: none beyond filling the stories (13, 15, 32). Consistent with Q-44 and Q-87.

### Q-49
Class: routine
Proposed: Adding an import notifies nobody. It raises the project's unpublished-changes count and puts the project in the review like any other change. In the Updates feed it appears when a hand edit would, as one item for the import, not one per change, and it names the document only to people allowed to read the name (Q-136) — spec #38 notifies nobody individually even on publish, and imported changes are ordinary changes with a source (confidence: medium)
Changes: none beyond filling the story; when the feed shows a change is `updates-feed`'s rule.

### Q-50
Class: routine
Proposed: A funding source the record already holds (same grant or program and organization) with a different amount is proposed as a change to that row: it shows the new amount with "Was <amount>", arrives ticked, and adding it replaces the amount on the existing row; no second row. With the same amount it is "Already on file" — today the new amount is lost, and a second row would count the grant twice (confidence: medium)
Changes: story 17 gains one requirement and one scenario; Undo (story 41) puts the earlier amount back. Consistent with Q-87 (e).

### Q-51
Class: routine
Proposed: No extra mark. "Was <value>" is all the check step shows of the value being replaced, whoever or whatever put it there — every edit is trusted alike, and the change history already says who set it (confidence: high)
Changes: none beyond filling the story (story 15).

### Q-52
Class: needs-you
Needs you: whether clients' documents (names, emails, budgets) may be sent to an outside model provider for every workspace, and on what contract terms. Assumed meanwhile: reading is on for every workspace, with a provider under terms that forbid training on the documents and keeping them after the reading; the choose step says once that the document is read by an AI service; there is no per-workspace switch in the first release; nothing of the workspace beyond the project's measures and fields is sent (Q-89).
Changes: none on the assumption. A "no" for some workspaces adds a workspace setting and a story; the client-sensitive part of the answer goes in `docs/private/requirements/project-updates/`. Enabler 02 stays `needs-info`.

### Q-53
Class: routine
Proposed: Confirmed: an import is recorded with the person who added it and when (the day is what screens show; the time is kept, Q-86) — spec #5 and #19 need both to show a source (confidence: high)
Changes: none beyond filling the stories (21, 22, 24).

### Q-54
Class: routine
Proposed: Confirmed, with the one flagged state of Q-61: in each section, ready changes first, then flagged ones, then the rest as Q-67 orders them. The check step sorts, in code, whatever order the reading returns — the person adds the clean ones and then settles what waits (confidence: medium)
Changes: none beyond filling the story (story 04). Consistent with Q-67.

### Q-55
Class: routine
Proposed: When only one side changed a field since the last sync, that change carries across (the newer value stands). When both sides changed it, nothing is overwritten: the value typed here stays on the record, nothing is sent back for that field, and the conflict is listed on the subscription's page with both values and when each was made, for an administrator to choose. The person is never asked while editing a project. — The prototype's own header says "a conflict is never guessed" and keeps both values; a silent overwrite would lose someone's work and put an unchosen value into totals. (confidence: medium)
Changes: None beyond filling the `gis-data-sources` stories: one story for the conflict list and choosing. Consistent with Q-59 (an unsent edit is also listed there).

### Q-56
Class: routine
Proposed: Only GIS subscriptions. A field kept by an organization's or a project's data source stays read-only by hand, as spec decision 27 has it; those sources are not built and their building is out of scope, so no setting is added for them. If they are built later, the question is asked again then. — Decision 40 is worded for a GIS subscription, and it adds no setting to something that does not exist yet. (confidence: medium)
Changes: None beyond filling the story: project-updates story 16, R7 stands as written (a field kept by a source that is not a GIS subscription is shown as kept).

### Q-57
Class: routine
Proposed: Per subscription, as recorded in spec decision 40: one setting covers every field that subscription supplies. Which fields a subscription supplies is still chosen field by field in its mapping. The per-field direction in the GIS sync prototype ("follows the layer", "follows ProjectFirma", "either way") is not a requirement. — The decision of 2026-11-23 says one setting per subscription, and one setting is easier to explain to the people whose fields lock. (confidence: high)
Changes: `gis-data-sources` stories describe one setting; the prototype's per-field direction gets no story. Consistent with Q-55 (a conflict can arise on any supplied field of a two-way subscription).

### Q-58
Class: worth-a-look
Proposed: The edit is sent to the GIS system at once, when it saves here; it does not wait for publish. Publishing is separate and unchanged: the hand edit still waits in the review before the public sees it, and it does not become published when the same value comes back from the GIS system at the next sync. Decision 24's "publishes without review" covers only values that originate in the GIS system. — Every edit saves at once (decision 1), and the GIS system is the organization's own record, not the public; holding the edit back would leave the two disagreeing and turn the next sync into a conflict. (confidence: medium)
Changes: Narrows spec decision 24 (a workspace source's own values publish without review; hand edits to its fields do not). Project-updates story 16, R5: the edit is sent when the change is added. `publish-review` stories treat such a hand edit like any other. Applies when story 16 ships, which Q-17 moves to the later release.

### Q-59
Class: routine
Proposed: The edit stays saved here; the save is never undone or blocked. The project page's GIS status says the change has not reached the GIS system and names the field. It is sent again at the next sync. The subscription's page lists every unsent edit with the project, the field, the reason the GIS system gave, and a Retry action, and administrators are told. A later change to that field arriving from the GIS system is then a conflict, handled as in Q-55. — The safe default: do not lose the person's work, and do not let two systems disagree without anyone seeing it. (confidence: medium)
Changes: None beyond filling the stories: `gis-data-sources` gains the unsent state and the list. Project-updates story 16, R5 shows nothing itself, as written. Consistent with Q-55 and Q-58.

### Q-60
Class: routine
Proposed: Yes. Import (and New project) are withheld only when an authoritative subscription supplies the workspace's projects. With a subscription that is not authoritative, both stay. A project created here under a two-way subscription is not created in the GIS system; it stays unlinked until a row of the layer matches it. — Import was hidden so a record would not get a second owner; a two-way subscription has no single owner to protect. (confidence: medium)
Changes: None beyond filling the stories: the rule sits in `gis-data-sources` (see Q-17), and `projects-index` shows or withholds the menu by it.

### Q-61
Class: routine
Proposed: "Needs a decision", "No match" and "Unsure" become one badge, "Needs you", the same words the tally uses; the sentence under the quote says why. "Not in this workspace" keeps its own wording, because what it asks for is different (pick an organization), and is still counted under "need you" — one state, named once (confidence: medium)
Changes: story 14, R5 and story 06 use the one badge; story 26's cases use it too.

### Q-63
Class: routine
Proposed: Yes. When the report names another project, every change that could be added arrives unticked, with its values as read and no badge of its own; the warning above the changes gives the reason and the tally counts them under "need you". Key facts changes are treated the same. "Already on file" and kept changes keep their own state — adding another project's figures is the costliest mistake here, and emptying every amount would punish a report that is merely named differently (confidence: medium)
Changes: stories 15 and 20 filled; the developer-machine reader's "needs a decision" on each change is not the rule. Consistent with Q-74.

### Q-64
Class: worth-a-look
Proposed: Yes. Undo stays on the toast only, as decided, and the toast is built so that the decision can stand: it is announced when it appears, "Undo" is a real button that is the next keyboard stop after the page loads, and the toast stays until dismissed — keyboard reach is required at the level proposed in Q-83, and the toast as prototyped does not have it (confidence: medium)
Changes: keeps the decision "Undo is toast only"; story 23, R1 gains the keyboard and announcement requirement, and the toast component needs work the prototype has not done. Consistent with Q-83.

### Q-65
Class: routine
Proposed: An import can set Timeline, County, Estimated total cost and any other built-in single-value Key fact, plus the workspace's custom fields. It never sets stage (spec #9), project type or lead organization: project type changes which performance measures the project is asked, and lead organization changes who can edit it (confidence: medium)
Changes: story 15 names the list; a report's value for an excluded field goes to "Not used".

### Q-66
Class: worth-a-look
Proposed: (a) A reading may take four minutes, as the reader does; then it fails as in Q-41 and the person can try again. (b) A PDF is shown as itself, opened at the change's page. Every other file type (Word, spreadsheet, CSV, text) comes back from the service as passages, which are kept with the stored file, so the document can be shown beside the changes and beside the review with the passage marked; "This file can't be shown here." is left for a failure only. (c) The first release keeps no confidence; when the later guards arrive it is internal to the service, never shown and never stored on a change — the decided check step is "the document beside the changes", and without (b) that is true only for PDFs, while the service must extract the text anyway (confidence: medium)
Changes: (b) widens stories 04 and 31 (a Word file or spreadsheet is shown, not "can't be shown") and enabler 02 and 03 (passages returned and kept); real build effort. Stories 33 and 40 follow.

### Q-67
Class: routine
Proposed: Inside a section the order is: ready, flagged ("Needs you", then "Not in this workspace"), "Already on file", "Kept by a data source". Within each group, the order the document states them; a change the person unticks stays where it is — what can be added first, what waits next, what needs nothing last (confidence: medium)
Changes: none beyond filling the stories (04, 16, 17, 75). Consistent with Q-54.

### Q-68
Class: routine
Proposed: (a) Yes: on a narrow screen "Show source" moves focus to the document's "Back", and "Back" returns focus to that change's "Show source", as the review already does. (b) Yes: when "Add N changes" is stopped, focus moves to the first failing field — same pane, same behavior, and a stopped action must lead somewhere (confidence: high)
Changes: none beyond filling the stories (05, 30, 65). Consistent with Q-83.

### Q-69
Class: routine
Proposed: (a) The file control refuses a dropped file whose type is not on the list and is not a spatial file (a spatial file gets its own box, Q-106): nothing is held and a message names the types it takes. (b) A file over 20 MB dropped on the project page opens Import a report on the choose step with the size message naming the file; nothing is read. (c) When a dropped file cannot be carried to the page, the choose step says so and asks the person to choose the file there — never fail later what can be refused now, and never drop the person's file without a word (confidence: high)
Changes: none beyond filling the stories (08, 10).

### Q-70
Class: routine
Proposed: A file that Upload shapes takes (a .zip, Q-106) is passed when the person follows "Upload shapes" in the "That's a spatial file" box, not when it is chosen. If they do not follow it, the file is let go when they choose another file or leave; nothing is uploaded or stored — nothing leaves the person's machine until they act (confidence: medium)
Changes: none beyond filling the story (story 11).

### Q-71
Class: worth-a-look
Proposed: A Key facts value that does not fit its field is never proposed and never saved. The check step tests it in code when it builds the list and puts it under "Not used" with the reason (no such option; not a number; a Timeline needs a start and an end year) — an invalid value must not reach the record, and since a Key facts change cannot be edited on the check step (Q-32) there is nothing for the person to fill (confidence: medium)
Changes: brings one small check forward from the later reading guards (enabler 50) into story 15, first release; narrows the decision "reading guards are later" by this one test. Consistent with Q-32 and Q-65.

### Q-72
Class: routine
Proposed: A field a two-way GIS subscription supplies is treated exactly as a hand edit to it would be. (a) The change is an ordinary ready change with one line naming the source the value is also sent to. (b) Undo is another edit: the earlier value is sent back the same way, and a failed send is handled as any failed send is — one rule for an edit, however it arrived (confidence: medium)
Changes: none beyond filling the stories (16, 41); when and how an edit is sent is `gis-data-sources`' rule. Applies when story 16 ships, which Q-17 moves to the later release.

### Q-73
Class: routine
Proposed: A contact with no email is proposed. It is matched by name, ignoring capitals and outer spaces, and is "Already on file" when the project has a contact of that name; two contacts with no email and different names are two contacts. When both sides have an email, only the email decides — the Contacts panel already tells such contacts apart by name (confidence: medium)
Changes: story 18's two tests change from email only to email, else name. Consistent with Q-34.

### Q-74
Class: routine
Proposed: (a) The report is about this project when the names are the same once case, spaces, punctuation and digits are ignored, when one name contains the other, or when the report gives this project's number; an abbreviation or an older name raises the warning, which costs the person some ticks and nothing else. (b) The service returns every project the report names. If this one is among them there is no warning; if not, the warning names the first and counts the rest — the warning should fire only when the report is plainly about something else (confidence: medium)
Changes: story 20 filled; enabler 02 returns a list of names, not one. Consistent with Q-63.

### Q-75
Class: routine
Proposed: (a) The hand edit stands. Undo takes back only what is still as the import left it, and the toast says how many changes were removed and how many were kept because they were edited since. (b) Once any of the import's changes is published, Undo is no longer offered; pressed from a toast that is still open, it changes nothing and says the changes were published and are corrected on the project page — never lose a person's later work, and never let a toast alter what a Manager has published (confidence: medium)
Changes: story 23 gains two scenarios; story 41, R3 follows. Q-137 proposes the same rule for every kind of change, so Key facts and performance measure figures behave alike.

### Q-76
Class: routine
Proposed: Confirmed as the prototype, each part. (a) A contact and a funding source keep "From <document name>" after a publish, for the people allowed to read it. (b) "Total from all sources" depends on the table's rows, not on publishing, so it stays. (c) The import's row stays in the change history. (d) The note leaves the review once none of the import's changes is waiting; it stays with the import's record. (e) Nothing leads from a published change to its document until the later story 29 — publishing changes what is public, not where a value came from (confidence: medium)
Changes: none beyond filling the stories (17, 18, 21, 22, 24).

### Q-77
Class: routine
Proposed: (a) Yes, at once: the right to open the document is checked each time against who can edit or publish the project now. (b) A deleted project's documents are deleted with it, and are gone for good when the deletion is. (c) The Manager sees that the document cannot be opened right now, with the change's quote and a way to try again; publishing is not blocked — access follows the project, and a missing file must not stop a review (confidence: high)
Changes: none beyond filling the stories (03, 33). Part (b) follows the retention assumption in Q-45.

### Q-78
Class: routine
Proposed: The amount arrives empty and the sentence under the quote states both readings and why they differ ("The report gives 6 acres in the table and 12 in the summary."). The person types the figure, which ticks the change like any other empty one. No buttons and no choice control — a button for each reading is "Use suggestion" again, which was dropped (confidence: medium)
Changes: story 14, R4 and its scenario rewritten with Q-33; no new control.

### Q-79
Class: worth-a-look
Proposed: For the later story: (a) partners sit in their own section of the check step, named and placed as the project page's partner section. (b) A change is the organization only; no part in the project. (c), (h) A partner the workspace does not hold arrives flagged "Not in this workspace" and unticked, and the person picks an existing organization, exactly as for a funding source. (d) "Already on file" when the project already has that organization as a partner. (e) Added partners show in the project page's partner list with "From <document name>". (f) An organization named as funder and as partner is proposed once in each section. (g) Matched by the funding source rule, connected organizations included. (i) Adding saves the organization on the project, unpublished; one the project gained meanwhile is passed over; Undo, the review row and the change history treat it as a contact. (j) `project-record` owns a project's partner organizations, and the project page does not show them today. (k) Ready first, and the same partner twice in one reading is one change. (l) The service returns the organization's name and its quote, and is told nothing of the workspace. (m) Does not arise — reuse the funding source construction, since nothing is built to follow (confidence: low)
Changes: story 27 (later) gains a blocker: a partner organizations section on the project page, owned by `project-record`, which does not exist yet.

### Q-80
Class: routine
Proposed: For the later story: (a) a waiting or finished reading is found on the project page, as a line beside the Import a report entry, and opens the page at its state. (b) The person gets one notification when it finishes or fails. (c), (h) One reading per project at a time; a second "Read it" is refused while one is reading or ready; another person who can edit the project can see that one is waiting but not open it. (d), (g) A ready or failed reading is kept 7 days; "Add N changes", "Cancel", "Read another" and the time limit end it; a failed one can be read again without choosing the file again. (e) "Already on file" and totals to date are worked out again on return. (f) Ticks, edits and the note are kept. (i) A change the project can no longer take is marked on return, and a person who can no longer edit the project gets the no-access page and the reading is discarded. (j) The document is held from "Read it" under the kept document's access rules and deleted when the reading is discarded. (k) The page says the person may leave; an unattended reading may run 15 minutes — the smallest stored reading that still lets someone leave (confidence: medium)
Changes: story 28 (later) filled; (j) amends enabler 03, R2 for that story only (the document is held from "Read it"). The 7 days falls under the retention question in Q-45.

### Q-81
Class: routine
Proposed: For the later story: (a) the document opens in place of the history list inside the same sheet, with "Back" to return. (b), (g) A file that cannot be shown or fetched says so and offers a download where the file exists. (c) It opens at its start. (d) Only people who can edit or publish the project are offered the control; anyone else sees the row as plain text. (e) The document's name in "N changes from <document name>" is the control; a pasted-text row opens the kept text the same way. (f) Yes, it still opens after a publish. (h) On a narrow screen it takes the sheet's whole width. (i) The document is shown whole; the import's changes are not listed there — the least new surface, and the one way back from a published change to its document (confidence: medium)
Changes: story 29 (later) filled. Consistent with Q-76 (e) and Q-77.

### Q-82
Class: worth-a-look
Proposed: (a) A figure in another unit than the measure's is flagged: the amount arrives empty and the sentence states the report's figure and the measure's unit ("The report gives 3,960 feet. This measure is in miles."); the person converts and types it. (b) The same for a total to date in another unit: flagged and empty, with no difference worked out. (c) The samples change, not the scenarios: the four rows that arrive converted are restated in the sample documents in the measure's own unit, so "6 ready to add" and "7 ready to add" stand. (d) No multiplication in the first release: "35 people for 4 hours" arrives flagged and empty with that sentence, and the person types 140 — spec #13 names a unit mismatch among the flagged cases, and the first release converts nothing (confidence: medium)
Changes: fixes four rows of two sample documents and one row of the pasted paragraph in the prototype and `fixtures.md` (the paragraph's ready count drops by one); the 28 stories' counts for the crew log and funder report are unchanged. Story 14 gains the unit case; story 26 (later) will need samples with other units again.

### Q-83
Class: worth-a-look
Proposed: (a) Every screen of the feature meets WCAG 2.2 at level AA. (b) Yes: every error state in the feature follows one pattern — the message is written next to the control it concerns, tied to it for assistive technology, and announced once — AA is the level public agencies are held to and 2.2 already matches the touch-target rule the mobile spec cites (confidence: medium)
Changes: `standing-requirements.md` gains the standard and SR-6 loses "inferred"; stories 09, 20, 30, 65 and 23 follow. If a client contract names another standard, that one replaces it. Raised to worth-a-look in reconciliation: the standard is often set by a client contract.

### Q-84
Class: routine
Proposed: (a) From the press until the project page opens, "Add N changes" is disabled and reads as busy ("Adding…"), and the page's other actions and the changes cannot be used. (b) Yes: one press makes one import; a second press or a repeated request is ignored — a double save counts every figure twice (confidence: high)
Changes: none beyond filling the stories (01, 22). Consistent with Q-44.

### Q-85
Class: routine
Proposed: (a) When the person leaves, the service stops where it can; a reading that finishes anyway is thrown away and never stored. (b) The document that was sent is deleted as soon as the reading ends without "Add N changes": on leaving, "Cancel", "Read another" or a failure. Only an added import keeps its document. (c) Yes: a dropped connection is a failed reading like any other, with its own reason (Q-41) — keep nothing the person did not add (confidence: high)
Changes: none beyond filling the stories (01, 02, 03, 35). What the model provider itself retains is part of Q-52.

### Q-86
Class: routine
Proposed: (b) The exact time is kept. (a) Screens show the day alone, in the time zone of the person reading, as the product shows every other date — no new setting, and the kept time gives two imports on one day an order (confidence: medium)
Changes: none beyond filling the stories (22, 24). Consistent with Q-94 and Q-53.

### Q-87
Class: routine
Proposed: (a) A performance measure entry that is "Already on file" arrives unticked; if the person ticks it on purpose it is added, because two equal entries can both be true. Reading the same report twice therefore adds nothing by default. (b) Yes: the check is made again when the button is pressed, for every kind of change and by the same tests (Q-99, rule 3); a ticked entry that has become "Already on file" since the check step opened stops the import once, is unticked and marked, and the person presses again on a true count (they may tick it again on purpose). (c), (d), (e) A Key facts field, a contact or a funding source that is "Already on file" has no checkbox, because adding it would change nothing; it is never recorded or counted as a change. A funding source the person edits into a match with a row on file becomes "Already on file" when the amount is the same, and a change to that row when it differs (Q-50, Q-133 (c)) — an import's count must equal what it changed (confidence: medium)
Changes: stories 15, 17, 18 and 32: "Already on file" loses its checkbox for the three kinds where adding changes nothing; story 01 gains the re-check. Consistent with Q-44, Q-48, Q-50.

### Q-88
Class: needs-you
Needs you: who hosts and pays for the test environment, and whether the client's testers may use it. Assumed meanwhile: (a) the development team provides one test environment whose reading service is a stand-in that returns the recorded readings for the sample documents, and the client's testers use that same environment; (b) it has a reset, outside the product, that returns the sample project to its starting state, so testers do not depend on Undo.
Changes: every story's Reset line reads "reset the sample project in the test environment" on the assumption; all 34 stories that cite it stay `needs-info` until confirmed.

### Q-89
Class: routine
Proposed: (a) The service is told the project's performance measures and fields, as today, and nothing about the project's funding sources and contacts or the workspace's organizations and people; it returns what the document names and every match is made by the check step in code. (b) For a funding source: grant or program, organization name, amount secured, quote and page. For a contact: name, role, organization, email, quote and page. (c) "Unsure" is not a fourth verdict: a figure either counts what the measure asks, or comes back unsettled with its reason, and the check step shows every unsettled one as flagged — send the model as little as the job needs, and let code decide (confidence: medium)
Changes: none beyond filling the stories (02, 14, 17, 18, 75). Bears on Q-52: no names or emails from the workspace are sent.

### Q-90
Class: routine
Proposed: A breakdown question arrives answered only when the document states one of its options; otherwise unanswered, for the person to set or leave. No inferred answers. Rows C5 and P3 arrive unanswered and without their note — never present a guess as a fact (confidence: high)
Changes: story 07 keeps the rule as harvested; `fixtures.md` rows C5 and P3 and the two prototype samples are corrected.

### Q-91
Class: routine
Proposed: A total to date lower than what the record holds is flagged: the amount arrives empty, unticked, and the sentence states both figures ("The report says 12,400 to date. The record holds 12,577."). It is not "Already on file" and shows no arithmetic line. Only an equal total is "Already on file" — the report and the record disagree, and the person must see that (confidence: high)
Changes: story 13 gains the rule and a scenario; the prototype's "= 0" line is a bug.

### Q-92
Class: routine
Proposed: Yes. Clearing the figure of a change that ticked itself unticks it again; a change the person ticked by hand stays as they left it — the tick should follow the figure that caused it (confidence: high)
Changes: story 14, R6 filled.

### Q-93
Class: routine
Proposed: The note cannot be changed or removed once the import is added. Undo, while the toast is there, removes it with the import; otherwise it stands as written until the changes are published — it is a short message to one reader, and editing it would need a new place to do so (confidence: medium)
Changes: none beyond filling the story (story 21).

### Q-94
Class: routine
Proposed: An import's row sits among the other rows by its time, latest first, like any other change; a hand edit made after an import shows above it — the prototype's order is an accident of its sample data (confidence: high)
Changes: none beyond filling the stories (22, 23). Relies on the time kept in Q-86.

### Q-95
Class: routine
Proposed: For the later story: an amount is held to the measure's own decimal places, on the check step and on the record. A converted figure that would round to zero at that precision is not proposed as zero: the change is flagged and empty, and the sentence states the report's figure and that it is less than the measure can record. The "Converted: …" line shows the same figures as the amount, never more or fewer decimals — a record cannot hold more precision than the measure allows, and "= 0 miles" beside 0.0023 is false (confidence: medium)
Changes: story 26 (later) filled.

### Q-96
Class: routine
Proposed: A message goes as soon as its field is corrected or its change is unticked, and every message is worked out afresh on the next press — a message beside a field that is now right is a false statement (confidence: high)
Changes: none beyond filling the stories (30, 65). Consistent with Q-68 and Q-83.

### Q-97
Class: routine
Proposed: Two rows. Each imported entry is its own row in the review, with its own "From <document name>" button, even when two imports add entries for the same performance measure and reporting period; the one-row rule is for a field, which holds one value, and an entry is a separate thing that adds to a total — folding them would hide one document from the Manager (confidence: medium)
Changes: stories 24 and 33 filled; story 51 stays about fields only; `publish-review`'s fold rule is stated as "fields, not entries".

### Q-98
Class: routine
Proposed: Every label and every sentence the product words takes the workspace's word. (a) The section headings take it ("Performance measures", "Funding sources", "Contacts", each in the workspace's plural). (b) So do the labels "Funding source" and "Contact · `<role>`", the field "Organization" and the row label "Contact". (c) So do sentences, with the workspace's word in the form the sentence needs (singular or plural, lower case inside a sentence): "“`<name>`” isn't an organization here…", "This report names another project", "Total from all sources" (which names no renameable noun and is unchanged). (d) The reading service does not word reasons. It returns each "Not used" item in the report's own words plus one reason from a fixed set (no measure asks for it; the project has no such field; not a contact or a funder; location changes only from a spatial file; plus the reasons the other proposals name, Q-43, Q-65, Q-71, Q-125 and Q-129), and code writes the reason's sentence with the workspace's words. — SR-4 already says a label shows the workspace's word, a sentence that says "organization" beside a heading that says "Partner" would read as two different things, and a model must not be the one that words the interface (confidence: medium)
Changes: SR-4 stops being `inferred` for this feature. Story 19, R1 and R2: the item stays in the report's words, the reason is no longer "in the reading's words". Enabler 02 gains the fixed set of reasons. Consistent with Q-129 (b) and Q-99 (g). Q-141 (the review row's label) should follow the same rule.

### Q-99
Class: worth-a-look
Proposed: Nothing is saved twice by default, and nothing is dropped without the person seeing it. Three rules, then the lettered cases. Rule 1, "the same thing": two changes are the same thing when they are the same performance measure, reporting period and breakdown answers; the same Key facts field; the same contact (the test story 18 uses for "Already on file"); the same funding source name and organization (the test story 17 uses). Rule 2, inside one reading: code compares every change with the changes before it, not only with the record. Where the record can hold the thing once only (a Key facts field, a contact, a funding source row), two changes with the same value are folded into one change that shows the first place's quote and "Also stated: `<the other place>`". Where the record can hold it many times (performance measure entries), the later one is kept in the list but arrives flagged and unticked, its amount as read, with the reason "Also stated at `<place of the first>`. Tick it only if it is separate work." Two changes for the same thing with different values all arrive flagged and unticked, each naming the other's value. Rule 3, on "Add N changes": the record is looked at again at the press (Q-87), by the same tests. The import's count, in the button, the toast, the change history and the review, is the number of things it actually wrote. (a) Two identical performance measure entries in one reading: both listed; the first is ready, the second flagged and unticked as in rule 2. By default one entry is saved and the total counts the figure once. The person can still tick the second when the report really counts two pieces of work. The reading service is also required to return a restated figure once and to add separate lines of one table together (the adding of Q-118), so this is the net under it, not the usual path. (b) One period's amount and a total to date for the same measure: the period's amount is the change. The total to date is worked out against the record plus that amount. If nothing is left, it is not a second change; the period's change gains the line "Agrees with the report's total to date: `<total>`". If the two disagree (something is left over, or the record plus this report would exceed the total), the total to date is listed as a second change, flagged and unticked with an empty amount and a sentence stating the three figures ("The report says 12,400 to date. The record holds 10,727 and this report adds 1,850."), for the person to settle; as in Q-91, no arithmetic line is shown for a difference below zero. Two totals to date for one measure: the same total twice is one change (a total cannot be separate work); two different totals are both flagged and unticked with empty amounts. (c) Two values for one Key facts field: the same value twice is one change. Two different values are both listed, flagged and unticked, each saying "The report also gives `<other value>`." Ticking one unticks the other, so one value at most is added. (d) Two contacts with one email: one change, from the first place, with "Also stated: …". One contact is added and counted. (e) Two funding sources with the same name and organization: the same amount twice is one change (a grant restated in a summary and a table). Different amounts are both listed, flagged and unticked, each naming the other's amount. One at most can be ticked, and its amount can be edited, so two awards of one grant are entered as their sum by the person, never added up by the product on a guess. (f) Across imports and after edits: at the press, a ticked change that the record now holds with the same value is not written and not counted (a performance measure entry is unticked and marked, and may be ticked again on purpose, Q-87 (a); a Key facts field, a contact or a funding source loses its checkbox, Q-87 (c) to (e)); a ticked funding source whose row now exists with another amount becomes a change to that row's amount (Q-50), counted once; a change the person edited into a match is tested the same way. If the press would write fewer changes than the button said, nothing is saved, the affected changes are re-marked ("Already on file", or "Was `<amount>`"), and the person presses again on a true count. "Undo" takes back only what that import wrote: if a later import has changed the same funding source row, the row stays with the later import's amount and its "From `<document name>`" line names the later document; undoing the later import puts back the amount it found. (g) A line returned twice under "Not used" or "Skipped" is shown once (same text once case and outer spaces are ignored). — The product exists so that totals reported to funders are true: a figure counted twice is the worst failure it can have, and a repeat thrown away unseen is the second worst. Flagging keeps the person as the one who commits (confidence: medium)
Changes: Costs real build effort. Stories 01 (R11), 04 (R3), 13 (R1, R4, R7), 15 (R7), 17, 18 (R6), 19 (R1), 32 (R2, R5) and 41 each gain a requirement and a scenario; story 15, R5 changes, since a Key facts change can now be flagged (kept still wins, Q-126 (d)). Enabler 02 gains "a restated figure is returned once". The flagged repeat keeps its amount, which is a stated exception to "a flagged change arrives empty" (Q-33): the reading is sure of the figure, only not of whether to count it. Depends on Q-87 and Q-48 (the check at the press) and Q-50; if either is answered otherwise, (f) changes with it. No recorded sample holds a period's amount and a total to date for one measure in one reading (the 1,850 is the crew log's, the 12,400 the funder report's), so no fixture row changes and the funder report's counts stand; case (b) and the repeats need a sample of their own (Q-159). Bears on Q-110 (flagged repeats count under "need you") and Q-91 (a total lower than the record's is flagged the same way).

### Q-100
Class: routine
Proposed: (a) Yes: the held file is listed with its name and size and can be removed; the control is then empty, with no message until "Read it" is pressed. (b) A drop of several files is refused: nothing is taken, a file already held stays held, and the control says that one file is read at a time ("Drop one file at a time."). — One document per import is decided (spec #20), and taking "the first" of several picks a document the person did not choose (confidence: medium)
Changes: Story 01, R5 gains the refusal. The shared file control keeps the first file today, so the page must handle the drop itself or the hub control gains a single-file refusal (a hub request, not a spoke edit). Consistent with Q-104.

### Q-101
Class: routine
Proposed: (a) Yes: each imported entry is a row in the performance measures' change log, like a hand entry. (b) The row names the document ("From `<document name>`") and carries the import's person and day. (c) "Undo" removes the import's rows; it leaves no added-then-removed pair. — Spec #5 says every change carries its source and the log shows it; story 23 already says an import taken back is no longer recorded anywhere (confidence: medium)
Changes: Story 01 gains the row's source; story 23, R2 and R7 extend to this log. `performance-measures` owns the log and gains "a row shows its source". The document's name there follows Q-136 (who may read it).

### Q-102
Class: routine
Proposed: The file control shows the dropped file as if it had been chosen there, with its name and size, so it can be seen, replaced, removed and read again. — "Read it" must never act on a file the person cannot see (confidence: high)
Changes: none beyond filling stories 08 and 35; story 10, R4 stands.

### Q-103
Class: routine
Proposed: The project page swallows every dropped file, so the browser never opens one in place of the page. A file Import a report does not read starts nothing, the page stays as it was, and a toast says why: for a spatial file, that shapes are added with Upload shapes; for anything else, "That file can't be read as a report." — Losing the project page to a stray drop is a loss of the person's place, and a drop that does nothing reads as broken (confidence: medium)
Changes: Story 08 gains the message and may now say "the project page stays as it was". No hand-off from the project page: the box on the choose step stays the one place that hands a spatial file over (Q-106).

### Q-104
Class: routine
Proposed: One message at a time under the file control; the latest event's message replaces the one before it. (a) A too-large file is refused and does not put out the file already held, which stays listed by name; the size message names the refused file. (b) So the size message and a page message never show together. (c) and (d) Every message goes when the control's content changes (a file chosen, replaced or removed), when a reading starts, and when the person switches between "File" and "Paste text"; none survives a reading and "Read another". — A message must describe the control as it is now; a stale one under an empty control is false (confidence: medium)
Changes: Story 10 gains the rule. The size message is the shared control's own and reads "File exceed 20 MB limit"; correcting its words is a hub request. Same rule as Q-108 and Q-96.

### Q-105
Class: routine
Proposed: The message shows by the text area, where "Paste the report text first." shows: "Couldn't read the pasted text. `<reason>`". The text stays in the text area and "Read it" reads it again. It is announced once and goes when the text is edited or a reading starts. — Today the message is written where nobody can see it (confidence: high)
Changes: none beyond filling stories 09 and 10. The reasons are Q-41's.

### Q-106
Class: worth-a-look
Proposed: Upload shapes' own list and limit decide what is handed over; Import a report keeps no second list. Today that is a .zip (a zipped shapefile or a zipped .gdb folder) up to 50 MB. (a) Two groups. A .zip is handed to Upload shapes. A .geojson, .kml, .kmz, .gpkg or bare .shp is not handed over, because Upload shapes would refuse it: the box still shows "That's a spatial file", says what Upload shapes takes (a zipped shapefile, with its .shp, .shx, .dbf and .prj together, or a zipped .gdb folder), and its link opens Upload shapes empty. If `work-areas` later takes more kinds, they move to the handed group with no change here. (b) Whether a file is spatial is decided before its size. The 20 MB limit is for reports only. A .zip is held up to 50 MB, Upload shapes' limit, and one over 50 MB is refused with a message naming that limit. The five endings that are not handed over are never held, so no size applies to them. (c) A handed file that Upload shapes refuses is refused there, in Upload shapes' own "This file was not accepted" message, exactly as if the person had chosen it there. (d) After Upload shapes, finished or cancelled, the person is on the project page. They are not returned to Import a report; nothing was read, so nothing is waiting there. (e) Yes, every .zip goes that way, because Import a report reads no .zip. But the box does not call a .zip a spatial file: it says a .zip is not read here, that shapes in it are added with Upload shapes (the link), and that a zipped report should be unzipped and chosen as itself. — One owner for the list (`work-areas`), no file sent to a flow that will refuse it, and no limit applied to a file that is only passing through (confidence: medium)
Changes: Amends story 11: R1 (the size test comes after the spatial test; the .zip limit is 50 MB), R2 (three wordings of the box: handed, not handed, .zip) and R4 (only a .zip is handed; scenario S5 uses a .zip, not a .geojson). Story 10, R3 no longer refuses a .zip between 20 and 50 MB. Narrows the user's decision "spatial hand-off is first release" to the kinds Upload shapes takes. `work-areas` must be able to open Upload shapes with a file received. Depends on Q-70 (handed when the link is followed; a file not handed is let go when it is replaced or the page is left) and Q-38 (no .zip on the report list).

### Q-107
Class: routine
Proposed: The box is hidden with the file control while "Paste text" is chosen and comes back, with the held file, when the person returns to "File". — The box is about the held file, which "Paste text" ignores (confidence: high)
Changes: none beyond filling story 11, R2.

### Q-108
Class: routine
Proposed: The message goes as soon as text is typed or pasted, and is cleared for good on a switch between "File" and "Paste text". It is announced once when it appears. — The same rule as the file control's messages: a message goes when its cause does (confidence: high)
Changes: none beyond filling story 09. Same rule as Q-104 and Q-96.

### Q-109
Class: routine
Proposed: (a) The right to edit the project is checked when the page opens, again on "Read it" before the document is sent, and again on "Add N changes" before anything is saved. (b) If it is gone, nothing is sent or saved, the reading and its document are discarded, and the person sees what story 12 shows anyone who cannot edit the project, with one line saying nothing was added. (c) Someone with no account is taken to sign in first; then the page opens if they can edit the project, and otherwise they see the same as (b). — A page left open must not outlive the right it was opened with, and a document must not be sent to be read for someone who may no longer see it (confidence: high)
Changes: Stories 12, 01 and 02 each gain the check. What the person without the right sees is Q-39's; what becomes of the document is Q-85's.

### Q-110
Class: routine
Proposed: Every change is counted in exactly one part, so the parts always add up to the changes listed. (a) A ready change the person unticks is counted under a fifth part, "`<N>` left out", placed after "need you"; the line is therefore never empty while changes are listed. (b) A change already on file is counted once: under "ready to add" while ticked, otherwise under "already on file". (c) Yes: a flagged change ticked by hand counts under "ready to add", so that part always equals the number on "Add N changes"; an empty amount is caught when the button is pressed (story 30). (d) One reads "1 needs you". A kept field whose value equals the record's counts under "kept by a data source" only. Only a performance measure entry can be ticked while already on file (Q-87). "Need you" holds every change that arrived unticked and waits on the person: flagged changes, repeats (Q-99) and the changes of a report that names another project (Q-63). "Left out" holds a change that arrived ticked, or was dealt with, and that the person unticked. "Kept by a data source" appears only once a data source exists (Q-17). — A tally that does not add up, or that says two different numbers for what will be added, teaches the person to ignore it (confidence: medium)
Changes: Story 04, R2 gains the fifth part and the one-part rule; story 06, R3 follows. Flagged repeats from Q-99 count under "need you". A funding source with its organization picked and then unticked counts under "left out" (Q-122 (b)).

### Q-111
Class: routine
Proposed: (a) A change with no control of its own takes keyboard focus itself, as one stop in the list's order, and focus selects it; a change with controls is selected when focus enters one, as now. (b) The selected change is marked as the current item for assistive technology, not by tint alone. The move of the document pane is not announced: it follows every focus move and would be noise; the pane is already a named region the person can go to. — Every change must be reachable and its selection perceivable without a pointer or colour (confidence: medium)
Changes: Story 04, R6 and R7 gain both. Assumes Q-83 names a standard that asks for this; if it names none, the proposal stands as the feature's own rule.

### Q-112
Class: routine
Proposed: (a) "Add N changes" stays available while the document shows. If the import is stopped, the document closes, the changes come back at the first failing one, and focus goes to its failing field. (b) Widening the window past 64rem closes the document, so narrowing again shows the changes. — A press must never leave the person with no visible result (confidence: high)
Changes: Stories 05 and 30 each gain one requirement. Consistent with Q-68 (b).

### Q-113
Class: routine
Proposed: (a) A performance measure amount is held to the measure's decimal places. A figure with more is refused when "Add N changes" is pressed, with a message naming what the measure takes; it is never rounded for the person. (b) "Secured ($)" is whole dollars. A figure with cents stops the import with a message; it is not rounded. (c) Each field has the limits of the hand-entry field for the same value on the project page; where none is set, an amount is below one trillion and "Grant or program" is at most 200 characters. (d) Both amounts show thousands separators on arrival and again when the person leaves the field, and accept them typed. (e) Neither is wanted: a measure amount accepts digits, separators and one decimal point only, so "$" and "1e3" are refused; a "$" is accepted in the dollar field alone. — Never save a value the measure cannot hold, and never change a typed figure in silence (confidence: medium)
Changes: Stories 07, 17, 30 and 65 gain the checks and messages. One reading of a typed figure serves both ticking and adding (Q-123). If funding sources are meant to keep cents, only (b) changes.

### Q-114
Class: worth-a-look
Proposed: (a) A change whose period the project does not offer arrives flagged and unticked, "Reporting period" empty, with the reason naming the period the report gives. A ticked change with no period stops "Add N changes" with "Pick a reporting period." An entry is never saved under a period the project does not offer. (b) Yes: the change's label follows the period picked. — Saving a figure under a period nobody can see on the page is a silent wrong total (confidence: high)
Changes: Brings one small check forward from the later reading guards (enabler 50) into the first release, on the page: it narrows the user's decision that the guards are later. Stories 07 and 30 gain it; story 14 gains a fourth reason for a flag.

### Q-115
Class: worth-a-look
Proposed: (a) Yes: every breakdown choice offers an empty choice, so an answer can be set back to unanswered. (b) An answer that is not one of the question's options arrives unanswered and is never saved; a note on the change says what the report said ("The report says “`<answer>`”, which is not an option."). The change stays ready. — An answer outside the list is an invalid value, and one dropped without a word hides what the document said (confidence: high)
Changes: (b) brings one check forward from enabler 50 into the first release, as Q-114 does. Story 07 gains both. Q-149 (the later half) should word its note the same way. Consistent with Q-90 if it rules that an answer arrives only when the document states it.

### Q-116
Class: routine
Proposed: Both markers are worked out when "Add N changes" is pressed, by comparing what arrived with what is added, not from the order of clicks. (a) A change the report supports two readings of is recorded as filled in after an unsure reading, whichever figure the person ends with, and not as changed from the document's figure. (b) No: a name that differs only in capitals or outer spaces is not recorded as changed. (c) Yes: any change that arrived with an empty amount and is added with a figure is recorded as filled in, however it came to be ticked. (d) As Q-121 (a). — The markers tell a Manager which figures a person stood behind alone, so they must not depend on which control was touched first (confidence: high)
Changes: Story 36 restated on that one rule. (a) assumes Q-33 follows the spec (arrives empty); it holds either way.

### Q-117
Class: routine
Proposed: (a) and (b) Selecting a change with no place takes the pane to the document's start on both screens, clears any mark left from another change, and shows one line in the pane: "No place marked for this change." The quote is on the change itself. (c) Yes: selecting a change always brings its place back, in a PDF as in passages, even when the pane last opened at the same page. — A pane left on another change's passage shows the wrong evidence for a figure (confidence: medium)
Changes: Stories 31 and 33 gain the rule. How often it arises depends on Q-66 (b).

### Q-118
Class: routine
Proposed: (a) Yes: the sum is shown under the quote with the label "Added:" ("Added: 3.5 + 2 = 5.5 acres"). "Converted:" is kept for unit conversion alone. The recorded crew log row C1 gains its line. Adding lines is the only arithmetic of the first release: nothing is converted and nothing is multiplied (Q-82). (b) No: the first release rounds nothing. A figure arrives as the document writes it, sums and differences are exact, and the measure's decimal places are enforced on adding (Q-113 (a)). — Arithmetic the person cannot see cannot be checked, and rounding is a change to the document's figure (confidence: medium)
Changes: Story 04, R5 gains the label; story 13, R1 loses "rounded to two decimals"; fixture row C1 changes. The pasted paragraph's multiplication is not done in the first release: that change arrives flagged and empty (Q-82 (d)).

### Q-119
Class: routine
Proposed: Exactly 64rem is narrow everywhere. The review's document pane changes to two columns only above 64rem. — The mobile foundation spec writes the gate as "64rem or narrower", and it is the written source (confidence: high)
Changes: Story 80, R1 and R2 reworded to "wider than 64rem"; stories 04, 05 and 31 stand. `publish-review`'s pane changes by one pixel of boundary.

### Q-120
Class: routine
Proposed: (a) A total to date is filed as a difference only for a measure whose values add up. For any other measure the figure is proposed as it stands, as that period's entry, with no arithmetic line. (b) Yes: only entries filed under reporting periods up to and including the change's period are counted, and when the record holds later entries the line says so ("… on record through `<period>`"). — A difference from a figure that is not a sum is meaningless, and a difference against later work understates what the report adds (confidence: medium)
Changes: Story 13, R2 changes (no longer "every reporting period"). With Q-99 (b) the same reading's own period amount is also subtracted. Consistent with Q-91.

### Q-121
Class: routine
Proposed: (a) Yes, a typed figure ticks it, and it is recorded as changed from the document's figure, not as filled in: the document's own arithmetic left nothing to add. (b) The arithmetic line stays as the document's arithmetic and gains what the person entered ("… = 1,673. You entered 1,500."); the addition goes if the figure is set back. — The person may add it, but a Manager must be able to see that the figure is theirs and not the report's (confidence: medium)
Changes: Story 13, R4 and R7, and story 36, R5 (the marker is "changed", not "filled in"). Answers Q-116 (d).

### Q-122
Class: routine
Proposed: (a) The badge goes when the change is ticked and comes back when it is unticked. The reason and the note stay throughout, because they explain the figure. (b) Once an organization is picked, the badge and the sentence go and do not return while one is picked; unticked after that, the change counts under "left out", not "need you". A picked organization can be changed but not cleared (Q-131 (d)). — A badge that says "waits on you" on a change the person has dealt with hides the ones that still wait (confidence: medium)
Changes: Stories 14, 65 and 75. Consistent with Q-110 (a) and (c); the badge's wording is Q-61's; there is no clearing, per Q-131 (d).

### Q-123
Class: routine
Proposed: Yes. One reading of a typed figure decides both ticking and adding: outer spaces are trimmed, commas and spaces between digits are ignored, and a "$" counts only in a dollar amount. So "1 000" ticks a measure change, and "$40" in a measure amount neither ticks nor adds. — Two readings of one field make a figure valid in one place and invalid in the other (confidence: high)
Changes: Story 14, R6 follows the rule of Q-113 (e). Largely settled by Q-113; kept separate only for the tick.

### Q-124
Class: routine
Proposed: A value is compared by its field's type. Text: ignoring capitals, outer spaces and repeated spaces, so "el dorado" is "Already on file" against "El Dorado" and "El Dorado County" is not. A choice field: by the option. A number: as a number. A date: as a date. A Timeline: as its two years. — The same matching the product already uses for a funding source's name and a contact's email, and a re-capitalised value is not a change worth a Manager's review (confidence: high)
Changes: Story 15, R8. A value that fits no option is Q-71's.

### Q-125
Class: routine
Proposed: The reading service returns only the year the report states. Code fills the other year from the record, after the reading, and the change shows both with "Was `<the record's Timeline>`". When the record has no Timeline, a one-year Timeline is not proposed as a change: it is listed under "Not used" with the reason that the project has no other year to pair it with. A pair that would end before it starts is a value that does not fit its field (Q-71). — The model reads and code computes; a year the report never stated must not look as if the report stated it (confidence: medium)
Changes: Story 15, R2; enabler 02 (the reading returns the stated year only); story 19 gains one reason in the fixed set (Q-98 (d)). Fixture row for the funder report's Timeline is unchanged in value.

### Q-126
Class: routine
Proposed: (a) No "Was …" on a kept change. When the value read differs, the line names the record's value as the source's: "`<source name>` has `<record's value>`. Change it there." (b) "there" stays plain text: a Contributor may not be able to open the source's settings, and the GIS system is outside the product. (c) When no change has a checkbox the action reads "Nothing to add", disabled; "Nothing ticked" is kept for when something could be ticked. (d) Kept always wins: one badge, "Kept by a data source", and no flag badge. — "Was" promises a replacement that will not happen (confidence: medium)
Changes: Story 16, R1 to R3; story 06, R5 gains the second wording. (d) holds for the flagged Key facts changes Q-99 (c) introduces. Applies when story 16 ships, which Q-17 moves to the later release.

### Q-127
Class: routine
Proposed: (a) No: one source supplies a field at a time. Spec #27 switches the narrower mapping off, and `gis-data-sources` refuses a second subscription mapping to a field another already supplies, so "Kept by `<source name>`" has one answer. (b) Yes: a data source can supply a custom field, and it is kept like a built-in one. (c) If the answer is not known when the check step opens, the change is proposed as ordinary; the guard is the check at the press. (d) Yes: kept is checked again when "Add N changes" is pressed. If a ticked field is now kept, nothing is saved, the change turns to kept, and the person presses again on a true count; if the answer still cannot be had, the import stops with a message to try again. — An authoritative source's lock must hold against an import exactly as it holds against a hand edit (confidence: medium)
Changes: Story 16, R6. `gis-data-sources` gains "one supplier per field" as a stated rule (consistent with spec #27 and #40). Same stop-and-re-mark behaviour as Q-99 (f); depends on Q-48. Applies when story 16 ships, which Q-17 moves to the later release.

### Q-128
Class: routine
Proposed: (a) "Contact" alone, with no separator. (b) The name alone, with no trailing comma. (c) An email match wins and names that person. With no email match, a name match is said only when exactly one person in the workspace has that name; when two share it, nothing is said and the line reads "No invitation is sent." — Spec #14 matches by email or name, and naming one of two people with the same name states a guess as a fact (confidence: high)
Changes: Story 18, R1 and R3. Consistent with Q-34 and Q-73, which settle matching as a whole.

### Q-129
Class: routine
Proposed: (a) Every quantity, attribute and party the report states about the project that the import did not use is listed; the reading service is asked for all of them, not "the notable ones", and the page makes no further claim. (b) Every skipped item carries a reason from the fixed set (Q-98 (d)). "Skipped" holds parts of the document passed over on purpose: a budget or spend table, a total or subtotal row (already counted in the rows above), and a part about another project. (c) One item per line, as a list like "Not used", not run together. — Story 19 promises nothing is silently dropped; a selection breaks that promise without saying so (confidence: medium)
Changes: Story 19, R1 and R4 (a list, not one line); enabler 02's instruction to the model. Consistent with Q-98 (d) and Q-99 (g).

### Q-130
Class: routine
Proposed: Yes. The import records that the report named another project, and the name as the report writes it. The review shows it above that import's changes, with the note when there is one: "This report names another project: “`<name>`”." The change history row is unchanged. — The Manager who publishes stands behind the figures and must know the document may be about other work (confidence: medium)
Changes: Story 20, R2; stories 21 and 24 gain the line; story 22's record of an import gains two fields. Consistent with Q-63 (changes arrive unticked) and Q-74 (how the name is matched).

### Q-131
Class: routine
Proposed: (a) Connected organizations are offered and matched exactly like the workspace's own, since a connected workspace acts as an organization (ADR 0002). (b) The list is every organization the person can see in the workspace's organization directory, whichever they belong to; nothing else is left out, and the report's name is matched against that same list. (c) The list is in one order, A to Z by name, and the person can type to find one. (d) A picked organization can be changed to another but not cleared; a funding source is left out by unticking it, as story 75, R1 says — a funder is rarely the person's own organization, so the list cannot be narrowed to theirs, and typing is needed at 38 or more names (confidence: medium)
Changes: none beyond filling stories 17 and 75 (story 75, R1 gains the order and typing to find). Consistent with Q-133 and Q-134.

### Q-132
Class: routine
Proposed: Both are proposed, flagged and unticked, never dropped. With no organization, "Organization" arrives empty and the change reads "The report names no organization for this funding source. Pick one, or leave this out." (it does not use the "Not in this workspace" sentence, which would quote an empty name). With no amount, "Secured ($)" arrives empty and the change reads "The report gives no amount for this funding source.", as an unsure figure does in story 14; typing an amount and picking an organization make it ready. A funding source is never added without both — nothing the report states is dropped silently, and nothing arrives as a guess (spec #13) (confidence: high)
Changes: none beyond filling stories 17 and 75; story 65 already stops an import on an empty organization or amount.

### Q-133
Class: routine
Proposed: (a) Exact matching is the rule: letter for letter, ignoring upper and lower case and spaces at either end. No near match is offered or suggested; an abbreviated funder arrives "Not in this workspace" and the person finds the right one by typing in "Organization" (Q-131). (b) It cannot occur: two organizations of one workspace may not have names that differ only in capitals, which `organizations-admin` holds; if a match were ever ambiguous the change is flagged for the person to pick. (c) "Already on file" follows the edit: it is worked out again whenever the person changes the name or the organization, and once more when "Add N changes" is pressed — a near match is a guess presented as a fact, and a badge that no longer describes the change misleads (confidence: medium)
Changes: story 17, R7 and R8 become decided, and R7 gains "worked out again after an edit". Consistent with Q-87 (checked again on adding) and Q-131.

### Q-134
Class: routine
Proposed: The case cannot occur, so no rule is needed for it. A funding source on the record points at its organization, not at the organization's name as text: a rename follows through, a connected organization counts as held (Q-131), and an organization named by a funding source cannot be removed while it is. "Already on file" therefore compares the funding source's name and the organization the report's name was matched to, not two pieces of text — matching text against text is what breaks on a rename (confidence: medium)
Changes: story 17, R7 is reworded to compare the matched organization. It hands two rules on: `project-record` (which owns a project's funding rows in the first release, Q-16) stores the organization, not its name; `organizations-admin` refuses to remove an organization a funding source names.

### Q-135
Class: worth-a-look
Proposed: Toast-only "Undo" stands. To keep it workable, one story is added to the first release: on the project page, anyone who can edit the project can edit and remove a funding source row and a contact row, whether an import or a person added it; each change saves at once and waits for publish like any other edit (spec #1). (a) Yes, as any other; `project-record` owns the two controls because it owns the project page, and funding sources and contacts from an import do not ship without it. If that story has to be cut down, the least that keeps the decision workable is "Remove" on each row. (b) An imported row edited by hand keeps "From `<document name>`" for as long as its import exists, and the review marks the figure as changed from the document's (spec #36). (c) Yes: toast-only "Undo" is acceptable once those rows can be corrected by hand; without the story it is not, because a wrong imported amount could never leave the record — totals must be correctable, and the page already shows "Add source" and "Add contact" unwired, so this is surface the product intended (confidence: medium)
Changes: adds one first-release story, owned by `project-record` ("edit or remove a funding source or a contact on the project page"); stories 17 and 18 gain it as a dependency for release, and story 23, R6 loses its "Not decided". Keeps the user's decision that Undo is toast only. Consistent with Q-137 (c). Q-16 names the same owner.

### Q-136
Class: routine
Proposed: One rule: the document's name is part of the document, so it is shown only to people who can edit or publish the project, on every screen, before and after a publish. (a) Anyone else, a Viewer included, never sees the name. (b) The "From …" line never reaches the public page or any published view. (c) In its place: a funding source or contact row is shown without the line; a change history row reads "`<N>` changes from a document", for a file and for pasted text alike. The name is also left out of the data sent to those people, not only hidden on screen — it is what spec #19 and enabler 03, R5 already say; file names often carry a funder's or a person's name (confidence: high)
Changes: none to the written decision. Stories 17 (R9), 18 (R4), 22 (R7) and 24 each gain one requirement and a scenario for a person who can neither edit nor publish; enabler 03, R5 loses its "Not decided".

### Q-137
Class: worth-a-look
Proposed: The Undo rule at the top of this file. (a) A performance measure figure corrected by hand since the import stands whole, as the person's own figure; "Undo" does not touch it. (b) An entry already removed by hand is passed over. (c) The same for a funding source or a contact: one edited by hand since stays, and loses its "From …" line because its import is gone; one already removed is passed over. In (a) to (c) the toast counts what was really removed and says what stayed: "4 changes removed. 2 you changed since were kept." When nothing is left to remove it reads "Nothing removed. You changed every one since." The import, its note, its change history row and its kept document go in every case. (d) An import already taken back from another window: the toast closes and a message reads "This import was already undone." (e) All or nothing: if any part cannot be taken back, nothing is, and the person is told and can try again (Q-157) — a person's later edit is never lost, a figure is never counted twice, and a toast never states a count that is not true (confidence: medium)
Changes: story 23, R2 and R3 and story 41, R1 and R2 are rewritten on this rule and gain about four scenarios (story 23 passes eight, so the hand-changed cases may be split into their own story). Reverses the prototype for a Key facts field, where the hand edit was lost. Depends on Q-75 (a) being answered "the hand edit stands" and on Q-87 and Q-99 passing over what the record already holds; consistent with Q-135, Q-138 and Q-157.

### Q-138
Class: routine
Proposed: Yes. After an "Undo", a field holds the value it would hold had that import never been added: the value of the latest change that remains (a later import or a hand edit), and when none remains, the value from before the earliest import that is now gone. So with two imports both taken back, in either order, the field returns to what it held before both — "leaves the project as it was before" is the story's own promise, and a value from an import that no longer exists has no source (confidence: high)
Changes: story 41, R3 gains this sentence and one scenario. Part of the one Undo rule (Q-137).

### Q-139
Class: routine
Proposed: (a) The name stays "pasted text". Two such imports are told apart by the person and the day, which every screen that names a document already shows beside it once the note's line carries the day (Q-144); two by one person on one day are told apart by opening them. (b) The text is kept exactly as it stood when "Read it" was pressed, unchanged. The cut into paragraphs is only how it is displayed — a kept document is the evidence behind a published figure and must not be altered; a made-up name from the first words would add wording to five screens for a rare case (confidence: medium)
Changes: none beyond filling story 40 (R3: the original is kept unchanged; the paragraphs are a display rule). Consistent with Q-144 and Q-158.

### Q-140
Class: routine
Proposed: The import is refused: changes, the import's record and its document are saved together or not at all. The person stays on the check step with every tick, edit and the note as they were, and reads "Couldn't add the changes because the document couldn't be saved. Nothing was added. Try again." — a change that names a document nobody can open breaks the promise that every imported figure leads back to its source (spec #19) (confidence: high)
Changes: none beyond filling enabler 03, R1. Consistent with an import being all or nothing (Q-44).

### Q-141
Class: routine
Proposed: One wording for the same kind of thing, and `publish-review` owns it: the review has one renderer for every row (spec, "How a change reads in review"). An imported row is worded as a hand-made one: an entry is "`<Measure>`, `<reporting period>`"; a funding source is labelled with the grant's name and reads "`<amount>` from `<organization>`". The import records the parts of each change (measure, period, name, organization, amount), not a finished label, and the check step keeps its own labels — the Manager judges the change, and how it arrived is already said by the source line (confidence: medium)
Changes: story 24, R1 and story 22, R2 are reworded (the import records parts; the review words the row). The label "Funding source" no longer appears on a review row, which settles that part of Q-98.

### Q-142
Class: routine
Proposed: Imported rows keep "`<who>` · `<day>`" and their "From `<document name>`" button on a project that has never been published. Hand-edit rows there stay without them — the import's person and day are real facts about that change, and every change carries its source (spec #5) (confidence: medium)
Changes: none beyond filling story 24, R2.

### Q-143
Class: routine
Proposed: The row shows the value now on the record, which is the hand edit's, with the person and day of the hand edit. It keeps the "From `<document name>`" button, so the Manager can compare, and carries the review's existing marker that the figure was changed from the document's (spec #36). A row that stands for two imports and then a hand edit does the same, with the later import's document — the latest change decides what the row says, and the document stays reachable because it is still the reason the field changed (confidence: medium)
Changes: story 24, R4 and story 51, R1 lose their "Not decided" and gain one scenario each. If "Undo" took the import back (Q-137), the row is a plain hand edit with no button.

### Q-144
Class: routine
Proposed: The line under a note carries the day: "`<who>` · `<day>`, with `<document name>`", written as the rows write it, so a note and its rows match on person, day and document. The note stays above the changes; it is not moved beside its rows. Two imports of one name by one person on one day stay alike, which is accepted as rare — one added word settles nearly every case without a new layout (confidence: medium)
Changes: story 21, R6 is reworded and R7 loses its "Not decided". Consistent with Q-139 (a).

### Q-145
Class: routine
Proposed: Yes. Pressing the button of the row whose document is open closes the document, and keyboard focus stays on that button — a control marked as expanded is expected to collapse on a second press (confidence: high)
Changes: story 33, R1 is corrected; story 80, R3 gains this as a fourth way to close.

### Q-146
Class: routine
Proposed: Escape closes the open document from anywhere in the review, unless a menu or dialog is open, which takes Escape first. On a wide screen focus stays on the row's button, as now, so the Manager can go on to the next row — moving focus into the document would break going from row to row (confidence: medium)
Changes: story 80, R3 loses its "Not decided".

### Q-147
Class: routine
Proposed: The amount arrives empty and the change is flagged with "The report gives `<figure>` with no unit. This measure is in `<unit>`.", as the funder report's seed row does. The figure is never written into the amount — a figure with no unit is an unsure reading, and an unsure reading is never pre-filled (spec #13) (confidence: high)
Changes: later story 26, R8 gains this case; story 14, R2 is unchanged. Consistent with Q-33.

### Q-148
Class: routine
Proposed: Both lines show, in the order the arithmetic was done: the conversion ("18,480 feet = 3.5 miles"), then the difference ("3.5 to date − 3 on record = 0.5") — the person checks the amount against the report's own figure, and that figure appears only in the conversion line (confidence: high)
Changes: later story 26, R2 loses its "Not decided"; story 13 is unchanged in the first release.

### Q-149
Class: routine
Proposed: Yes, the person is told in both cases. A breakdown answer that is not one of the question's options already arrives unanswered with a note in the first release (Q-115 (b)); the later check writes that same note and does not flag the change, because an answer is optional. A figure flagged for low confidence carries the note "The reading wasn't sure of this figure. Check it against the document."; no level of confidence is shown — a change must never wait on the person, or differ from the document, without saying why (confidence: medium)
Changes: Later story 50: R3 keeps the first-release note of Q-115 (b); R6 gains the low-confidence note. Keeps the user's decision of no confidence levels.

### Q-150
Class: routine
Proposed: Listed under "Not used", with a line the check writes, after the reading's own lines: "`<Field>`: `<value>`. This project has no `<Field>` field." and "Timeline: `<as read>`. A timeline needs a start year and an end year.". A Timeline that does not fit is already caught in the first release (Q-71, Q-125) with the same words; the later check adds the field the project did not offer — nothing the report states is dropped silently (story 19), and the sample already words the first case this way (confidence: high)
Changes: later story 50, R4 and R5 change from "dropped" to "listed under Not used"; story 19 is unchanged.

### Q-151
Class: routine
Proposed: Yes. A group may hold classifications and groups together; its section shows its own classifications first, then the groups inside it, as the prototype does — the workspace decides the shape of its tree (spec decision 1), and forbidding the mix would force an empty wrapper group around a lone classification (confidence: medium)
Changes: none beyond filling the add and move rules for groups.

### Q-152
Class: routine
Proposed: No target on a group's page. Each performance measure there reads reported against what its projects planned, as the prototype does — a group has no targets of its own (spec decision 4), and adding up targets due in different years would state a figure nobody set (confidence: high)
Changes: none; follows the written decision.

### Q-153
Class: routine
Proposed: Keep the prototype's rule: a group can be removed only once it holds no classifications and no groups, and until then "Remove" is not offered and the page says what it still holds — the spec already names removal as offered only once the group is empty, and removing a branch whole could unfile many projects in one press (confidence: high)
Changes: none; follows the spec.

### Q-154
Class: routine
Proposed: Unique in the whole workspace, ignoring upper and lower case, as the prototype does — a group's name appears alone, without its path, in places such as a map legend or a dashboard dimension, and loosening the rule later is easy while tightening it is not (confidence: medium)
Changes: none beyond filling validation on add and rename.

### Q-155
Class: routine
Proposed: Not in the first release. The public sees classifications as it does today; a group has no public page and public filters offer no groups. A public group page is a later story — the spec says "Visitor: not yet", and nothing public should appear that no one decided to publish (confidence: medium)
Changes: adds one `later` story to `public-site` (a group's public page and group filters).

### Q-156
Class: worth-a-look
Proposed: Every top-level group is offered as a map colouring and as a dashboard dimension, and it colours or splits by whatever sits directly inside it, groups or classifications. Deeper levels are not offered in those two places; a group's own page already reads one branch. Nowhere else does a group act as a filter or colour — it turns the sample's convention into one rule without adding a setting (confidence: low)
Changes: `map` and `progress-dashboard` requirements name "top-level group" where they now name two sample groups.

### Q-157
Class: routine
Proposed: (a) The person reads "Couldn't undo this import. Nothing was removed." (b) "Undo" is offered again on the same toast: the toast stays, and "Undo" is switched off only while the taking back runs, so it cannot be pressed twice. There is no second home for "Undo". (c) The right to edit is checked again when "Undo" is pressed. A person who has lost it reads "You can no longer edit this project, so the import stays." and the toast loses "Undo". (d) Yes: the first toast goes only once the taking back has succeeded, and "`<N>` changes removed" then takes its place — a failed "Undo" must not silently leave the import on the record with no way to try again (confidence: medium)
Changes: story 23, R2 is amended (the toast no longer goes at the press; "Undo" is switched off while it runs) and gains two scenarios. Keeps the user's decision that Undo is on the toast only. Part of the one Undo rule (Q-137 (e)).

### Q-158
Class: routine
Proposed: (a) The pane is headed "Pasted text". (b) Pasted text has no page label; its paragraphs sit directly under the heading — the same words twice add nothing, and pasted text has no pages (confidence: high)
Changes: none beyond filling story 31, R2 and story 04, R9.

### Q-159
Class: worth-a-look
Proposed: (a) Nothing is defined for the whole funder report on a partly built product, and no script is run that way. (b) Each story's script runs against a narrow recorded sample that needs only that story and its blockers. The whole funder report stays as the end-to-end script, run once every story of the epic is built. Ten samples, each its own invented file with its own recording; rows are the funder report's unless said, and none uses the two converted rows, so none waits on the unit question:

| Sample | Holds | Counts | For stories |
|---|---|---|---|
| `deer-creek-treatments-2025.pdf` | two ready entries: invasive removal 4.2 acres read from page 1, trees planted 1,850 from page 3 | 2 ready; "Add 2 changes" | 31, 33, 80, 03; the second import of 21, 22, 23 |
| `deer-creek-total-to-date-2025.pdf` | F3, F6 | 2 ready; "Add 2 changes" | 13 |
| `deer-creek-flagged-figures-2025.pdf` | F3, F7, F8, F9 | 1 ready, 3 need you; "Add 1 change" | 14, 36 |
| `deer-creek-key-facts-2025.pdf` | F1, F2, F3 | 2 ready, 1 already on file; "Add 2 changes" | 15 (and 16 when it ships, Q-17) |
| `deer-creek-funding-2025.pdf` | F3, F10, F11 | 2 ready, 1 already on file; "Add 2 changes" | 17 |
| `deer-creek-funding-unheld-2025.pdf` | F3, F10, F11, F12 | 2 ready, 1 need you, 1 already on file; "Add 2 changes" | 75, 65, 36 |
| `deer-creek-contacts-2025.pdf` | F3, F13, F14 | 2 ready, 1 already on file; "Add 2 changes" | 18 |
| `deer-creek-all-kinds-2025.pdf` | F1, F3, F11, F14: one ready change of each kind, nothing flagged | 4 ready; "Add 4 changes" | 41, 51 |
| `deer-creek-not-used-2025.pdf` | F3, with the funder report's "Not used" lines (the coordinates among them) and its "Skipped" line | 1 ready; "Add 1 change" | 19, 11 |
| `deer-creek-timeline-update-2026.pdf` | one Key facts change, Timeline 2023–2026 | 1 ready; "Add 1 change" | the second import of 15, 41, 51 |

— a story that can only be tested once five others are built cannot be accepted on its own (confidence: medium)
Changes: no story is added or removed. `fixtures.md` gains ten samples and their recorded readings; the scenarios and scripts of stories 03, 11, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 31, 33, 36, 41, 51, 65, 75 and 80 are re-pointed and their counts rewritten (story 41 reads "Add 4 changes", not 7). The exact tally wording for a count of one follows Q-110; who serves the recordings is Q-88. Two cases still have no sample: a figure in another unit arriving flagged (Q-82) and the repeats of Q-99; a row for each joins the flagged-figures sample once those are validated.

## Decided after the page was written

- **Q-52 (decided 2026-11-23, spec #41):** Reading a report with an outside AI service is a workspace setting. It is off until an administrator of the workspace agrees and turns it on; the administrator can turn it off again; and it can be made unavailable to a workspace altogether, where that client's terms do not allow its documents to go to an outside provider. While it is off or unavailable, Import a report is not offered for that workspace, and the place it would be says why.
  Scope effect: add first-release work to Import a report: (1) an administrator turns reading by an outside AI service on and off in workspace settings, with what they agree to stated; (2) the setting can be locked unavailable for a workspace, shown with the reason; (3) while off or unavailable, the three entry points to Import a report are not offered and the place says why; opening the page's address directly says the same. Enabler 02 (reading service) is no longer needs-info on Q-52.
- **Q-45 (decided 2026-11-23, spec #42; replaces #19, amends #31):** The report or spreadsheet is used only to read data from. The file is not kept after the import is added (or abandoned); pasted text likewise. What stays with each imported change is the document's name and the words it was read from (its quote). A manager sees the quote and the document's name beside the change, not the document.
  Scope effect (first release unless noted): REMOVE enabler 03 (kept document), story 33 (open the document beside the review), story 80 (keep it beside and close it), story 51 (which document on a row for two imports), story 29 (later: open the document from history), and the 'kept' half of story 40 (pasted text is named, not kept). CHANGE story 24: an imported row names its document and shows the quote it was read from; no button opens a file. CHANGE stories 22, 23, 41, 17, 18, 21: wherever a document is named there is nothing to open; Undo has no document to drop. The document pane on the check step (stories 04, 31, 05) is unaffected: the file is in hand while the person checks. Q-66's answer (show Word and spreadsheet text with the passage marked) applies to the check step only and nothing is stored. Q-136 (who sees the document's name) still applies to the name and the quote. Q-140 (import recorded when the file cannot be kept) and Q-77 (lost access to a kept document) no longer arise. Q-52's concern is narrower: the provider must not keep the file either.
- **Q-135 (decided 2026-11-23): yes.** Edit and remove a funding source and a contact on the project page, first release, owned by `project-record`.
- **Standing note from the user (2026-11-23):** several screens are not complete in the prototype yet, the project detail page among them. Something missing from an unfinished screen is unfinished work, not a decision and not a bug; propose the obvious completion and say it is not yet prototyped.
