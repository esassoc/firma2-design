# Proposals, part 1: product-wide (Q-1 to Q-19) and GIS data sources (Q-55 to Q-60)

Written 2026-11-23. Q-2 and Q-10 are already answered and are not proposed here. 23 questions proposed.

## Product-wide

### Q-1
Class: worth-a-look
Proposed: `performance-measures` stays and owns the Performance measure object; `pm2` is out and its four routes (`ws/pm2`, `ws/pm2/[measure]`, `ws/pm2/new`, `pm2/projects/[project]`) are removed from the map and the navigation. Nothing further is taken from `pm2`: the two points left out on 2026-10-09 (which breakdown allows several picks; freezing breakdowns at publish) stay out. — The original was reconciled with PM 2's model on 2026-10-09 (status, stored claim, sum or no-sum counting rule, breakdowns owned by the measure, reporting periods, change log), so it already holds what the comparison was for, and every other feature (classifications, dashboard, Import a report, review, public site) reads the original's data. (confidence: high)
Digest: Which performance measures build stays? → The original. The hackathon copy (PM 2) goes; its model was already folded in on 9 October.
Changes: The `pm2` feature leaves the system map, so no stories are written for it. Stories that say "`performance-measures` (or `pm2`, Q-1)" name `performance-measures` only (project-updates stories 01, 02, 06, 07, 13, 23, 26, 30, 32, 50, 65).

### Q-3
Class: routine
Proposed: Yes, it is out. `/prototypes/team-5` is deleted whole, including `mode="update"` on `firma2-my-projects`, and gets no requirements. — Spec decision 39 says so, and its condition (the Import a report page exists) is met. (confidence: high)
Digest: Is the hackathon team's project-updates sandbox out? → Yes. The Import a report page exists, so it is deleted, as already decided.
Changes: `team-5-sandbox` leaves the system map and the registry. Deleting it is a clean-up task, not a story. No story changes.

### Q-4
Class: routine
Proposed: (a) `workspace-settings/vocabulary` is a leftover and goes: Terminology (`workspace-settings/labels`) replaced it and uses the same editor. (b) `workspace-settings/grid-defaults` (the workspace's default table columns) is kept as a `later` story of `workspace-look-and-language`; it is not in the first release because no navigation reaches it. (c) The registry row `report-import` is retitled "Import a report" and pointed at the Import a report page, since the side sheet it described was removed (spec decision 7). (d) The registry row `my-projects` takes the slug `map` to match its title; the `my-projects` address keeps redirecting to Map. — (a), (c) and (d) follow written decisions; (b) is the least new surface for a page nobody can reach today, and the plans spec still lists Grid defaults as a feature. (confidence: medium)
Digest: Are four leftovers still wanted? → Old Vocabulary page goes (Terminology replaced it). Default table columns come later. Two stale list entries are corrected.
Changes: `workspace-look-and-language` covers Terminology now and Grid defaults later; it gains no first-release story from this. Two registry rows corrected. No other story changes.

### Q-5
Class: worth-a-look
Proposed: Publish review is on every plan. On every plan the public page and reports show only published values, and a person publishes from the same review. What a higher plan adds is the governance around it: a manager per organization, the review schedule, and the Overdue marks and reminders. On a plan without managers, an administrator publishes. "Agency publishes directly" is struck from the plans spec, and its row "Publish review queue and schedule" becomes "Review schedule and per-organization managers". Until the plan split is settled, no story names a plan for review. — The published-values rule is the product's trust claim (project-updates spec, decision 2) and the plans spec's own rule is "never paywall the truth"; a plan that publishes directly would let unchecked figures reach reports. It also closes the gap noted on Import a report: nobody could import changes that nobody can publish. (confidence: medium)
Digest: Is publish review only on the top plan? → No, on every plan. An administrator publishes where there are no managers; the top plan adds schedules and per-organization managers.
Changes: Amends `.scratch/tiers/spec.md` (the "Publish review queue and schedule" row and "publishes directly"). `publish-review` stories carry no plan lock on the review itself; the plan lock moves to the review schedule page. `plans` stories lose "Agency publishes directly". Consistent with Q-6 (plans exist) and Q-7 (the row "Stewards" reads "Managers").

### Q-6
Class: routine
Proposed: There are plans: Free, Agency and Program, as the plans spec defines. The line in `docs/roles-and-permissions.md` ("No equivalent; we have no billing or plans") is corrected to say there is no separate Owner role, and that administrators see and change the workspace's plan. — The plans spec (2026-10-19) is later than the roles document's sentence (2026-10-02), and the roles document already speaks of "the plan's organization limit" further down. (confidence: high)
Digest: Do plans exist? → Yes: Free, Agency, Program. One outdated sentence in the roles document is corrected.
Changes: None beyond correcting one line of `docs/roles-and-permissions.md`. Which feature sits on which plan stays as the plans spec has it, apart from Q-5.

### Q-7
Class: routine
Proposed: A missed rename. Every "steward" in `.scratch/project-intake/spec.md` and `.scratch/tiers/spec.md` becomes "manager", including the plans table row "Stewards", which reads "Managers". Stories say Manager only. — Access-requests spec, decisions 21 and 23: the rename reaches the interface, documents and code in the same pass. (confidence: high)
Digest: "Steward" still appears in two specs. → A missed rename; both are corrected to Manager.
Changes: Wording only, in two specs. `project-intake` and `plans` stories use Manager.

### Q-8
Class: routine
Proposed: In the review inbox, under Proposals, beside Waiting and Held. The approver is unchanged: a manager of the lead organization, or an administrator when it has none. The acts are unchanged: Approve (the project moves to Planning & Design), or Return with a required comment that shows at the top of the proposer's intake page. The separate "Proposals to approve" block is gone. `project-intake` owns the proposal's states and the approval rule; `publish-review` owns the inbox that shows it. — The later decision wins (user, 2026-11-18, recorded in the project-updates spec), and the intake spec had already asked for approval "where I already review work". (confidence: high)
Digest: Where is a proposed project approved? → In the review inbox, under Proposals. Same approver, same Approve and Return; the separate approval block is gone.
Changes: `.scratch/project-intake/spec.md` is corrected where it describes its own approval block. `project-intake` stories state Approve and Return and depend on `publish-review` for the inbox; `publish-review` stories state the Proposals view. No story is added or lost.

### Q-9
Class: routine
Proposed: Standing requirements, not a feature. The grammar (add from a blank line with "/" or +, act from the grip, settings on the block, the same keys, light selection) is stated once as product-wide standing requirements whose source is ADR 0001. `project-intake` (the intake builder) and `custom-pages` (the page editor) each cite them and prove them in their own builder stories. How a builder saves stays out of the grammar, as the ADR says. — A grammar is a rule every builder obeys, not a goal a person has; a feature for it would hold no actor. This adds no feature, and any later builder inherits it by citing it. (confidence: medium)
Digest: Who owns the shared editing rules for the two builders? → Nobody new: written once as standing rules, and each builder's stories prove them.
Changes: A product-wide standing-requirements entry is added. No feature added. `project-intake` and `custom-pages` builder stories gain a citation and scenarios for the grammar.

### Q-11
Class: routine
Proposed: `public-site` owns both switches and what each does: Public access (published projects, pages and the map can be read without signing in) and Contact details (off by default; names always show). The controls stay where they are, in the Public site section of the Custom pages settings screen; `custom-pages` only hosts that section. — The owner is the feature whose behavior the switch changes; moving the screen would add work and decide nothing. (confidence: medium)
Digest: Who owns the two public site switches? → The public site feature. The switches stay on the Custom pages settings screen.
Changes: None beyond filling the stories: `public-site` gains the two switch stories; `custom-pages` stories mention the section and depend on `public-site`.

### Q-12
Class: routine
Proposed: Yes. `public-site` owns what a visitor sees in all five (unpublished project, private organization, hidden stage, public access off, page not shared). Each cause stays with the feature that sets it (`publish-review`, `organizations-admin`, `stages`, `public-site`, `custom-pages`), which depends on `public-site` for the result. In the four cases about one project or page, the visitor sees the same "not public" page whatever the cause, so the page never reveals that a private organization or an unpublished project exists. When public access is off, every public address asks the visitor to sign in. All five are in the first release of the public site. — One owner for one screen; a public site missing four of the five would show what the workspace chose to hide. (confidence: medium)
Digest: Who owns the five "not public" states? → The public site feature, all five. Visitors see one plain "not public" page that never says why.
Changes: `public-site` gains the four states not built today (noted as a gap in the public views inventory). The four causing features gain one dependency line each.

### Q-13
Class: routine
Proposed: `tags` owns the shared behavior: add on its own page, rename in place (a blank or duplicate name is refused and the stored name stands), saving as each field is left, and remove from the danger zone. `project-types` and `classifications` (classifications and groups) cite it and state only what they add: a project type's guidance and preview; a classification's performance measures and targets; a group's colour and parent. — A tag is the plainest use of the construction, so its stories state the shared part with nothing else mixed in. (confidence: medium)
Digest: Who owns the shared add, rename and remove pages for tags, project types and classifications? → Tags, the plainest of the three; the other two state only their extras.
Changes: None beyond filling the stories. `project-types` and `classifications` stories depend on the `tags` stories for add, rename and remove.

### Q-14
Class: routine
Proposed: `personal-settings` owns the notification switches and the one rule behind them: an email about an event is sent to a person only while that person's switch for it is on. Each event belongs to the feature that raises it (a proposal submitted or returned: `project-intake`; a revert: `publish-review`; a request waiting: `access-requests`). `organizations-admin` owns its own list, "Email to administrators", on the Organization settings page and reuses the same switches. — The surface was built for the person's own settings first; no one feature can own every event. (confidence: medium)
Digest: Who owns notification settings? → Personal settings owns the switches and the rule; each feature owns its own events; Organization settings reuses the switches.
Changes: None beyond filling the stories. Features that notify gain a dependency on `personal-settings`.

### Q-15
Class: routine
Proposed: The portfolio map as its own page is out and stays archived. The portfolio map as the map on Organization Home stays in the product, with its export. `map` owns the portfolio map, its export and the project set map; `organization-pages`, `projects-index` and `performance-measures` show them and depend on `map`. `work-areas` owns only how shapes get onto a project. — Organization Home's own header calls it "the Map page's map, scoped to the organization", and one feature should own everything that draws many projects on a map. (confidence: medium)
Digest: Is the portfolio map still in the product, and who owns the maps? → Its own page is gone; it remains on Organization Home. The Map feature owns all three.
Changes: None beyond filling the stories. `map` gains the export and the project set map; three features gain a dependency on `map`.

### Q-16
Class: worth-a-look
Proposed: A feature to add, later. For the first release `project-record` owns a project's funding sources (add, edit and remove a row: the grant or program, the organization behind it, the amount secured), and `custom-fields` keeps the funding source fields. A `funding-sources` feature (the workspace's list of funding sources, and Funding Status) is added to the system map as not built, release `later`. Its public pages wait for it, as decided on 2026-11-20. — The brief lists Funding Sources and Funding Status as screens the product has and has not built; until then the only place a funding source is made is the project page, so that is its owner. (confidence: medium)
Digest: Is funding sources a feature to add? → Yes, later. Until then a project's funding rows belong to the project page.
Changes: Adds `funding-sources` to the system map as a `later` feature with no stories yet. `project-record` gains the funding rows; Import a report's funding source stories (17, 65, 75) depend on `project-record`.

### Q-17
Class: worth-a-look
Proposed: (a) First release: two doors are open, New project (the intake form) and Import projects (a spreadsheet). The third, projects created from a GIS source, opens when `gis-data-sources` ships, which is later: the spec calls data sources "specified, not built". (b) `gis-data-sources` owns the rule for which doors a workspace offers, because its Project source setting is that rule: when an authoritative GIS subscription supplies the workspace's projects, New project and Import are withheld; otherwise both are offered. (c) Who may use an open door stays with `users-and-security` ("Create projects", "Import data"). — The first two doors are built and specified; the rule already lives on the Project source page. (confidence: medium on the owner, low on the release)
Digest: Three ways to create a project: which ship first, who owns the rule? → New project and spreadsheet import first; GIS-created projects later. The GIS feature owns which are offered.
Changes: `gis-data-sources` stories are all `later`, which makes project-updates story 16 (fields kept by a data source) runnable only against a stand-in in the first release. Consistent with Q-60. `project-intake` and `import-projects` gain a dependency on `gis-data-sources` for being withheld.

### Q-18
Class: worth-a-look
Proposed: A feature to add, later: `reports` (the stakeholder report and the fact sheet as documents). It is inside this product; the brief says reports are the reason the product exists. In the first release the published-values rule is proved where published figures can be read today: the public site, the Progress Dashboard and export. `publish-review` keeps owning the rule; `organization-pages` keeps the list of reports owed. What the report holds is not proposed here: the brief says to answer that with the client. — No report is designed, so no story can be written for one yet, but leaving it off the map would hide the feature every other feature feeds. (confidence: medium)
Digest: Is reporting a feature to add? → Yes, later. For now the "published values only" rule is tested on the public site, the dashboard and export.
Changes: Adds `reports` to the system map as a `later` feature with no stories yet. Stories that say "reports show only published values" name the public site, dashboard and export as where it is tested in the first release.

### Q-19
Class: routine
Proposed: Yes. The definitions below are drafted for `GLOSSARY.md`, one sentence each, in the glossary's own form; they are added on validation and stories cite them. Classification and Classification group are already defined and are left as they are. — Stories already use these words; the drafts follow how the specs, the roles document and the prototype use them. (confidence: medium)
Digest: Draft the missing glossary definitions? → Yes. About thirty short drafts are ready; correct any that read wrong.
Changes: `GLOSSARY.md` gains the terms below. The "Words from the rest of the product" table in the Import a report terms file points to the glossary instead of defining them again.

Drafted definitions:

The record and how it changes

- **Project** — one piece of work an organization leads, recorded once the work is done or under way so its progress can be published and added up. _Avoid:_ record (as the noun for the object).
- **Record** — everything the workspace holds about a project, published or not; saving to the record does not make a value public.
- **Lead organization** — the organization that leads a project; its Contributors can edit it. Funding a project gives no edit rights.
- **Proposal** — a project submitted through the intake form that waits for approval; it does not count in reports or on the public map until a manager approves it.
- **Change** — one difference made to a project's record, kept with who made it, when, and its source: by hand, a named document, or a named data source. _Avoid:_ project update (as a noun).
- **Change log** — every change to one project, newest first, opened with History on the project page. _Avoid:_ audit trail.
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

## GIS data sources

### Q-55
Class: routine
Proposed: When only one side changed a field since the last sync, that change carries across (the newer value stands). When both sides changed it, nothing is overwritten: the value typed here stays on the record, nothing is sent back for that field, and the conflict is listed on the subscription's page with both values and when each was made, for an administrator to choose. The person is never asked while editing a project. — The prototype's own header says "a conflict is never guessed" and keeps both values; a silent overwrite would lose someone's work and put an unchosen value into totals. (confidence: medium)
Digest: Two-way: the same field changed in both places. → Neither is overwritten; an administrator picks from both values on the subscription's page. One-sided changes just carry across.
Changes: None beyond filling the `gis-data-sources` stories: one story for the conflict list and choosing. Consistent with Q-59 (an unsent edit is also listed there).

### Q-56
Class: routine
Proposed: Only GIS subscriptions. A field kept by an organization's or a project's data source stays read-only by hand, as spec decision 27 has it; those sources are not built and their building is out of scope, so no setting is added for them. If they are built later, the question is asked again then. — Decision 40 is worded for a GIS subscription, and it adds no setting to something that does not exist yet. (confidence: medium)
Digest: Does "authoritative or not" apply to every data source? → Only GIS subscriptions. Fields kept by any other source stay locked, as already decided.
Changes: None beyond filling the story: project-updates story 16, R7 stands as written (a field kept by a source that is not a GIS subscription is shown as kept).

### Q-57
Class: routine
Proposed: Per subscription, as recorded in spec decision 40: one setting covers every field that subscription supplies. Which fields a subscription supplies is still chosen field by field in its mapping. The per-field direction in the GIS sync prototype ("follows the layer", "follows ProjectFirma", "either way") is not a requirement. — The decision of 2026-11-23 says one setting per subscription, and one setting is easier to explain to the people whose fields lock. (confidence: high)
Digest: Is the setting per subscription or per field? → Per subscription. The per-field direction in the GIS sync prototype is dropped.
Changes: `gis-data-sources` stories describe one setting; the prototype's per-field direction gets no story. Consistent with Q-55 (a conflict can arise on any supplied field of a two-way subscription).

### Q-58
Class: worth-a-look
Proposed: The edit is sent to the GIS system at once, when it saves here; it does not wait for publish. Publishing is separate and unchanged: the hand edit still waits in the review before the public sees it, and it does not become published when the same value comes back from the GIS system at the next sync. Decision 24's "publishes without review" covers only values that originate in the GIS system. — Every edit saves at once (decision 1), and the GIS system is the organization's own record, not the public; holding the edit back would leave the two disagreeing and turn the next sync into a conflict. (confidence: medium)
Digest: Does a hand edit to a two-way field wait for review before going to the GIS system? → No, it goes at once. It still waits for review before the public sees it.
Changes: Narrows spec decision 24 (a workspace source's own values publish without review; hand edits to its fields do not). Project-updates story 16, R5: the edit is sent when the change is added. `publish-review` stories treat such a hand edit like any other.

### Q-59
Class: routine
Proposed: The edit stays saved here; the save is never undone or blocked. The project page's GIS status says the change has not reached the GIS system and names the field. It is sent again at the next sync. The subscription's page lists every unsent edit with the project, the field, the reason the GIS system gave, and a Retry action, and administrators are told. A later change to that field arriving from the GIS system is then a conflict, handled as in Q-55. — The safe default: do not lose the person's work, and do not let two systems disagree without anyone seeing it. (confidence: medium)
Digest: Sending an edit back to the GIS system fails. → The edit stays saved; the project page says it was not sent; it is retried, and administrators see a list.
Changes: None beyond filling the stories: `gis-data-sources` gains the unsent state and the list. Project-updates story 16, R5 shows nothing itself, as written. Consistent with Q-55 and Q-58.

### Q-60
Class: routine
Proposed: Yes. Import (and New project) are withheld only when an authoritative subscription supplies the workspace's projects. With a subscription that is not authoritative, both stay. A project created here under a two-way subscription is not created in the GIS system; it stays unlinked until a row of the layer matches it. — Import was hidden so a record would not get a second owner; a two-way subscription has no single owner to protect. (confidence: medium)
Digest: Hide the Import menu only when the GIS subscription is authoritative? → Yes. With a two-way subscription, Import and New project stay.
Changes: None beyond filling the stories: the rule sits in `gis-data-sources` (see Q-17), and `projects-index` shows or withholds the menu by it.
