# Open questions

Questions the requirements work has raised and nobody has answered yet. Answer one by writing under its **Answer** line (or tell Claude the answer and its number); it is then applied to the system map, inventories and stories, and moved to **Answered** with the date.

IDs are permanent. `Blocks` says what cannot be finished until the question is answered.

## Product-wide

Raised by the system map (`.scratch/system-map.md`), 2026-11-23.

### Which build stays

**Q-1. Performance measures: `pm2` or `performance-measures`?**
Two builds do the same job. `pm2` is the hackathon team's version kept beside the original for comparison.
Blocks: requirements for performance measures; which feature owns the Performance measure object.
Proposed: `performance-measures` stays and owns the Performance measure object; `pm2` is out and its four routes (`ws/pm2`, `ws/pm2/[measure]`, `ws/pm2/new`, `pm2/projects/[project]`) are removed from the map and the navigation. Nothing further is taken from `pm2`: the two points left out on 2026-10-09 (which breakdown allows several picks; freezing breakdowns at publish) stay out. — The original was reconciled with PM 2's model on 2026-10-09 (status, stored claim, sum or no-sum counting rule, breakdowns owned by the measure, reporting periods, change log), so it already holds what the comparison was for, and every other feature (classifications, dashboard, Import a report, review, public site) reads the original's data. (confidence: high)
Answer:

**Q-3. Is `team-5-sandbox` out?**
Spec decision 39 (`.scratch/project-updates/spec.md`) says delete it once Import a report exists, and it does.
Blocks: nothing if the answer is yes; it is then dropped from the map.
Proposed: Yes, it is out. `/prototypes/team-5` is deleted whole, including `mode="update"` on `firma2-my-projects`, and gets no requirements. — Spec decision 39 says so, and its condition (the Import a report page exists) is met. (confidence: high)
Answer:

**Q-4. Are these leftovers still wanted?**
`workspace-settings/vocabulary` and `workspace-settings/grid-defaults` are not in the navigation model. Two registry rows are stale: `report-import` and `my-projects`.
Blocks: whether `workspace-look-and-language` covers them.
Proposed: (a) `workspace-settings/vocabulary` is a leftover and goes: Terminology (`workspace-settings/labels`) replaced it and uses the same editor. (b) `workspace-settings/grid-defaults` (the workspace's default table columns) is kept as a `later` story of `workspace-look-and-language`; it is not in the first release because no navigation reaches it. (c) The registry row `report-import` is retitled "Import a report" and pointed at the Import a report page, since the side sheet it described was removed (spec decision 7). (d) The registry row `my-projects` takes the slug `map` to match its title; the `my-projects` address keeps redirecting to Map. — (a), (c) and (d) follow written decisions; (b) is the least new surface for a page nobody can reach today, and the plans spec still lists Grid defaults as a feature. (confidence: medium)
Answer:

### Written sources disagree

**Q-5. Is publish review on every plan, or Program only?**
The plans spec (`.scratch/tiers/spec.md`) puts publish review on the Program plan only. The project-updates spec says nothing reaches the public or reports without it.
Blocks: `publish-review` and `plans` stories; what a workspace on a lower plan does to publish. Noted 2026-11-23 (project-updates, story 12): Import a report is on every plan, so on a plan without publish review a workspace could import changes that nobody can publish.
Proposed: Publish review is on every plan. On every plan the public page and reports show only published values, and a person publishes from the same review. What a higher plan adds is the governance around it: a manager per organization, the review schedule, and the Overdue marks and reminders. On a plan without managers, an administrator publishes. "Agency publishes directly" is struck from the plans spec, and its row "Publish review queue and schedule" becomes "Review schedule and per-organization managers". Until the plan split is settled, no story names a plan for review. — The published-values rule is the product's trust claim (project-updates spec, decision 2) and the plans spec's own rule is "never paywall the truth"; a plan that publishes directly would let unchecked figures reach reports. It also closes the gap noted on Import a report: nobody could import changes that nobody can publish. (confidence: medium)
Answer:

**Q-6. Are there plans or not?**
`docs/roles-and-permissions.md` says "no billing or plans". The plans spec defines three.
Blocks: nothing in the pilot; one of the two documents needs correcting.
Proposed: There are plans: Free, Agency and Program, as the plans spec defines. The line in `docs/roles-and-permissions.md` ("No equivalent; we have no billing or plans") is corrected to say there is no separate Owner role, and that administrators see and change the workspace's plan. — The plans spec (2026-10-19) is later than the roles document's sentence (2026-10-02), and the roles document already speaks of "the plan's organization limit" further down. (confidence: high)
Answer:

**Q-7. "Steward" still appears after the rename to Manager.**
In `.scratch/project-intake/spec.md` and `.scratch/tiers/spec.md`. Presumably a missed rename; confirm and both get corrected.
Blocks: nothing; vocabulary in the `project-intake` and `plans` stories.
Proposed: A missed rename. Every "steward" in `.scratch/project-intake/spec.md` and `.scratch/tiers/spec.md` becomes "manager", including the plans table row "Stewards", which reads "Managers". Stories say Manager only. — Access-requests spec, decisions 21 and 23: the rename reaches the interface, documents and code in the same pass. (confidence: high)
Answer:

**Q-8. Where is a proposed project approved?**
The intake spec has its own approval block. The project-updates spec moved approval into the review inbox.
Blocks: `project-intake` and `publish-review` stories (one of them owns approval).
Proposed: In the review inbox, under Proposals, beside Waiting and Held. The approver is unchanged: a manager of the lead organization, or an administrator when it has none. The acts are unchanged: Approve (the project moves to Planning & Design), or Return with a required comment that shows at the top of the proposer's intake page. The separate "Proposals to approve" block is gone. `project-intake` owns the proposal's states and the approval rule; `publish-review` owns the inbox that shows it. — The later decision wins (user, 2026-11-18, recorded in the project-updates spec), and the intake spec had already asked for approval "where I already review work". (confidence: high)
Answer:

### Shared things with no owner

Each needs one feature whose stories state and test it.

**Q-9. The editing grammar for builder canvases** (form-canvas spec, ADR 0001). Used by `project-intake` and `custom-pages`; the spec is not a feature. Should it be standing requirements, or its own feature?
Proposed: Standing requirements, not a feature. The grammar (add from a blank line with "/" or +, act from the grip, settings on the block, the same keys, light selection) is stated once as product-wide standing requirements whose source is ADR 0001. `project-intake` (the intake builder) and `custom-pages` (the page editor) each cite them and prove them in their own builder stories. How a builder saves stays out of the grammar, as the ADR says. — A grammar is a rule every builder obeys, not a goal a person has; a feature for it would hold no actor. This adds no feature, and any later builder inherits it by citing it. (confidence: medium)
Answer:

**Q-11. Public site switches (Public access, Contact details).** The screen sits in `workspace-settings/custom-pages`; the behavior is all `public-site`. Which owns it?
Proposed: `public-site` owns both switches and what each does: Public access (published projects, pages and the map can be read without signing in) and Contact details (off by default; names always show). The controls stay where they are, in the Public site section of the Custom pages settings screen; `custom-pages` only hosts that section. — The owner is the feature whose behavior the switch changes; moving the screen would add work and decide nothing. (confidence: medium)
Answer:

**Q-12. The not-public states** (five, one built). Each is caused by a different feature and all are shown by `public-site`. Does `public-site` own all five?
Proposed: Yes. `public-site` owns what a visitor sees in all five (unpublished project, private organization, hidden stage, public access off, page not shared). Each cause stays with the feature that sets it (`publish-review`, `organizations-admin`, `stages`, `public-site`, `custom-pages`), which depends on `public-site` for the result. In the four cases about one project or page, the visitor sees the same "not public" page whatever the cause, so the page never reveals that a private organization or an unpublished project exists. When public access is off, every public address asks the visitor to sign in. All five are in the first release of the public site. — One owner for one screen; a public site missing four of the five would show what the workspace chose to hide. (confidence: medium)
Answer:

**Q-13. Taxonomy record pages.** One construction shared by `classifications`, `project-types` and `tags`. Which owns the shared behavior?
Proposed: `tags` owns the shared behavior: add on its own page, rename in place (a blank or duplicate name is refused and the stored name stands), saving as each field is left, and remove from the danger zone. `project-types` and `classifications` (classifications and groups) cite it and state only what they add: a project type's guidance and preview; a classification's performance measures and targets; a group's colour and parent. — A tag is the plainest use of the construction, so its stories state the shared part with nothing else mixed in. (confidence: medium)
Answer:

**Q-14. Notification settings.** Rendered by `personal-settings` and `organizations-admin`. Which owns it?
Proposed: `personal-settings` owns the notification switches and the one rule behind them: an email about an event is sent to a person only while that person's switch for it is on. Each event belongs to the feature that raises it (a proposal submitted or returned: `project-intake`; a revert: `publish-review`; a request waiting: `access-requests`). `organizations-admin` owns its own list, "Email to administrators", on the Organization settings page and reuses the same switches. — The surface was built for the person's own settings first; no one feature can own every event. (confidence: medium)
Answer:

**Q-15. Portfolio map and export, and the project set map.** The portfolio map's route is archived but Organization Home still renders it; three features render the project set map. Is the portfolio map still in the product, and who owns each?
Proposed: The portfolio map as its own page is out and stays archived. The portfolio map as the map on Organization Home stays in the product, with its export. `map` owns the portfolio map, its export and the project set map; `organization-pages`, `projects-index` and `performance-measures` show them and depend on `map`. `work-areas` owns only how shapes get onto a project. — Organization Home's own header calls it "the Map page's map, scoped to the organization", and one feature should own everything that draws many projects on a map. (confidence: medium)
Answer:

**Q-16. Funding source.** No feature owns its lifecycle because its screens are not built. Is it a feature to add, or out for now?
Proposed: A feature to add, later. For the first release `project-record` owns a project's funding sources (add, edit and remove a row: the grant or program, the organization behind it, the amount secured), and `custom-fields` keeps the funding source fields. A `funding-sources` feature (the workspace's list of funding sources, and Funding Status) is added to the system map as not built, release `later`. Its public pages wait for it, as decided on 2026-11-20. — The brief lists Funding Sources and Funding Status as screens the product has and has not built; until then the only place a funding source is made is the project page, so that is its owner. (confidence: medium)
Answer:

**Q-17. Project creation has three doors** (`project-intake`, `import-projects`, `gis-data-sources`). Which are open in the first release, and who owns the rule for which a workspace offers?
Proposed: (a) First release: two doors are open, New project (the intake form) and Import projects (a spreadsheet). The third, projects created from a GIS source, opens when `gis-data-sources` ships, which is later: the spec calls data sources "specified, not built". (b) `gis-data-sources` owns the rule for which doors a workspace offers, because its Project source setting is that rule: when an authoritative GIS subscription supplies the workspace's projects, New project and Import are withheld; otherwise both are offered. (c) Who may use an open door stays with `users-and-security` ("Create projects", "Import data"). (d) Import a report's handling of a field kept by a data source (project-updates story 16) has nothing to act on until a data source exists, so it moves to the later release with `gis-data-sources`; the first release keeps only the seam (the check step asks whether a field is kept, and the answer is always no). This amends the story map approved on 2026-11-23, which set story 16 `first`. — The first two doors are built and specified; the rule already lives on the Project source page. (confidence: medium on the owner, low on the release)
Answer:

**Q-18. Reports.** The published-values rule names them, but no report exists in the prototype. Is reporting a feature to add, or outside this product?
Proposed: A feature to add, later: `reports` (the stakeholder report and the fact sheet as documents). It is inside this product; the brief says reports are the reason the product exists. In the first release the published-values rule is proved where published figures can be read today: the public site, the Progress Dashboard and export. `publish-review` keeps owning the rule; `organization-pages` keeps the list of reports owed. What the report holds is not proposed here: the brief says to answer that with the client. — No report is designed, so no story can be written for one yet, but leaving it off the map would hide the feature every other feature feeds. (confidence: medium)
Answer:

### Glossary

**Q-19. Nineteen nouns the product has and `GLOSSARY.md` does not define**, including Project, Classification, Project type, Tag, Stage, Custom field, Work area, Funding source, Manager, Proposal, Change and Data source (marked † in the system map). Should I draft definitions for you to correct?
Blocks: nothing yet; stories use these words and will cite the glossary.
Proposed: Yes. The definitions below are drafted for `GLOSSARY.md`, one sentence each, in the glossary's own form; they are added on validation and stories cite them. Classification and Classification group are already defined and are left as they are. — Stories already use these words; the drafts follow how the specs, the roles document and the prototype use them. (confidence: medium)

Drafted definitions (proposed, for `GLOSSARY.md`; added on validation):

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

Answer:

## By feature

Questions from a feature's interview are added here under the feature's slug.

### gis-data-sources

Raised by spec decision 40 (authoritative or two-way, per GIS subscription), 2026-11-23. The prototype does not show this setting yet: `workspace-settings/gis-subscriptions` always locks and `workspace-settings/gis-sync` always syncs both ways.

**Q-55 [cut]. Two-way: when the same field changes here and in the GIS system before a sync, which value stands?** The `gis-sync` prototype lets the latest change win. Alternatives: the GIS system wins; the person is asked.
Proposed: When only one side changed a field since the last sync, that change carries across (the newer value stands). When both sides changed it, nothing is overwritten: the value typed here stays on the record, nothing is sent back for that field, and the conflict is listed on the subscription's page with both values and when each was made, for an administrator to choose. The person is never asked while editing a project. — The prototype's own header says "a conflict is never guessed" and keeps both values; a silent overwrite would lose someone's work and put an unchosen value into totals. (confidence: medium)
Answer:

**Q-56 [cut]. Does the authoritative setting apply only to GIS subscriptions, or to every data source?** Spec decisions 22 to 29 also describe organization and project sources (a sheet, a tracker). Decision 27 still makes their fields read-only by hand.
Proposed: Only GIS subscriptions. A field kept by an organization's or a project's data source stays read-only by hand, as spec decision 27 has it; those sources are not built and their building is out of scope, so no setting is added for them. If they are built later, the question is asked again then. — Decision 40 is worded for a GIS subscription, and it adds no setting to something that does not exist yet. (confidence: medium)
Answer:

**Q-57 [cut]. Is the setting per subscription, or per field within a subscription?** As recorded it is per subscription.
Proposed: Per subscription, as recorded in spec decision 40: one setting covers every field that subscription supplies. Which fields a subscription supplies is still chosen field by field in its mapping. The per-field direction in the GIS sync prototype ("follows the layer", "follows ProjectFirma", "either way") is not a requirement. — The decision of 2026-11-23 says one setting per subscription, and one setting is easier to explain to the people whose fields lock. (confidence: high)
Answer:

**Q-58 [detail]. A hand edit to a field a two-way subscription supplies: does it wait for publish review before it is sent to the GIS system, or go at once?** Spec decision 24 says workspace sources publish without review; that was written when their fields could not be hand-edited.
Proposed: The edit is sent to the GIS system at once, when it saves here; it does not wait for publish. Publishing is separate and unchanged: the hand edit still waits in the review before the public sees it, and it does not become published when the same value comes back from the GIS system at the next sync. Decision 24's "publishes without review" covers only values that originate in the GIS system. — Every edit saves at once (decision 1), and the GIS system is the organization's own record, not the public; holding the edit back would leave the two disagreeing and turn the next sync into a conflict. (confidence: medium)
Answer:

**Q-59 [detail]. What does the person see when sending an edit back to the GIS system fails?**
Proposed: The edit stays saved here; the save is never undone or blocked. The project page's GIS status says the change has not reached the GIS system and names the field. It is sent again at the next sync. The subscription's page lists every unsent edit with the project, the field, the reason the GIS system gave, and a Retry action, and administrators are told. A later change to that field arriving from the GIS system is then a conflict, handled as in Q-55. — The safe default: do not lose the person's work, and do not let two systems disagree without anyone seeing it. (confidence: medium)
Answer:

**Q-60 [detail]. The Import menu on the Projects index is hidden when the workspace is synced to a GIS source. Should that now apply only when the subscription is authoritative?**
Proposed: Yes. Import (and New project) are withheld only when an authoritative subscription supplies the workspace's projects. With a subscription that is not authoritative, both stay. A project created here under a two-way subscription is not created in the GIS system; it stays unlinked until a row of the layer matches it. — Import was hidden so a record would not get a second owner; a two-way subscription has no single owner to protect. (confidence: medium)
Answer:

### project-updates — Import a report (build 1)

Raised by the harvest (`.scratch/project-updates/requirements/inventory.md`), 2026-11-23. "Spec #n" is a decision in `.scratch/project-updates/spec.md`.

**[cut]** changes which stories exist, so it is asked before the story map. **[detail]** only fills in a story; left open, that story is written and marked `needs-info`. "Suggest" is Claude's recommendation, not a decision.

#### What is in the feature

**Q-29 [cut]. What is explicitly not in build 1?** Candidates: several documents at once; a document covering several projects; an entry from My Projects; setting up a data source from this layout (spec #26); filling a funder's form back out. Confirm or add.
Partly answered (2026-11-23): setting up a data source from this layout is out. The other three were not marked out. Spec #20 already says one document per import and that a document covering several projects is later, so the stories follow the spec until this is confirmed. Still open: are several documents at once, a multi-project document, and an entry from My Projects really wanted in the first release?
Proposed: Not in the first release: several documents in one import, a document covering several projects, an entry from My Projects, setting up a data source from this layout, and filling a funder's form back out. One document, one project, started from the project page — spec #20 and the spec's Out of scope list already say so (confidence: high)
Answer:

#### Where the prototype and the spec disagree

**Q-30 [detail]. Header entry.** Spec #8: an item in the "…" menu. Prototype: an always-visible icon in the breadcrumb row that folds into "…" under phone width. Suggest: the prototype.
Proposed: The header entry is the prototype's: an always-visible icon button in the breadcrumb row, which moves into the "…" menu under phone width — the built page is the later decision and a reporting act should not sit behind a menu (confidence: medium)
Answer:

**Q-31 [detail]. Button label.** The measures card says "Import report"; everywhere else says "Import a report". Suggest: "Import a report".
Proposed: Every entry point and the page title read "Import a report", including the button on the performance measures card — one name for one act (confidence: high)
Answer:

**Q-32 [detail]. Is every proposed value editable?** Spec #13 says yes. Timeline, County and contact changes can only be ticked or left out.
Proposed: Figures are editable on the check step; facts and people are taken or left. A performance measure change (amount, reporting period, breakdown answers) and a funding source change (grant or program, organization, amount) can be edited before adding. A Key facts change (Timeline, County, any other built-in or custom field) and a contact change can only be ticked or left out; a wrong one is left out and typed on the project page — the check step would otherwise need an editor for every field type a workspace can define, and the project page already edits each in one click (confidence: medium)
Answer:

**Q-33 [detail]. Does an unsure change arrive empty?** Spec #13: "never a pre-filled guess". A "Needs a decision" change arrives with one of its two readings already in the amount. Suggest: the spec; arrive empty with both readings offered.
Proposed: A change the reading could not settle always arrives with its amount empty and unticked, including one the report supports two readings of; neither reading is written in. This is for a figure the reading is unsure of; a change that is unticked for another reason (a repeat, Q-99; a reporting period the project does not offer, Q-114; a report that names another project, Q-63) keeps the figure as read — spec #13 and the standing decision "never a pre-filled guess" (confidence: high)
Answer:

**Q-34 [detail]. How is a contact matched?** Spec #14: by email or name. The prototype's duplicate check is by email only, and a workspace match only changes a helper line. Related: is a matched contact linked to that person or stored as text, and is the contact's role free text or picked from a list?
Proposed: A contact is matched by email, ignoring capitals and outer spaces; by name only when the report gives no email (Q-73). A match with a person in the workspace changes one helper line and nothing else: the contact is stored as the name, role, organization and email the report gives, not linked to an account, and nobody is invited. The role is the text the report uses, as the Contacts panel already takes any role — spec #14, and the least new surface (confidence: medium)
Answer:

**Q-35 [detail]. An organization the person did not pick.** Spec #15: "listed as not added". The prototype leaves it out silently. Suggest: the spec.
Proposed: A funding source whose organization the person did not pick stays on the check step as an unticked change with its badge, is counted under "need you", and is not saved. That is where it is "listed as not added"; nothing lists it again after adding, because the reading is not kept (Q-46) — it is never dropped from the person's sight before they decide, which is what the spec protects (confidence: medium)
Answer:

**Q-36 [detail]. Note label.** Spec #17: "note to the manager". Page: "Note for the reviewer (optional)". Also settles the word for the person who publishes.
Proposed: The field is labelled "Note for the reviewer (optional)". "Reviewer" is the interface's word for whoever reviews and publishes the project; the role stays Manager in the roles reference and in stories — an Administrator reviews too, so the label names the act, not one role (confidence: medium)
Answer:

**Q-37 [detail]. Does every change row name its source?** Spec #5 and #31: every row, the same way. The prototype names a source only on imported rows, and a code comment argues that is deliberate ("only the exception names its source").
Proposed: A row names its source only when the change came from a document or a data source. A hand edit shows who and when, with no source label: by hand is the default, and "only the exception names its source" — the dated note in the code is the later decision, and a label on every row says nothing on most of them (confidence: medium)
Answer:

**Q-38 [detail]. File types.** The file control accepts .xls; the page drop accepts .doc and .xls; the reader refuses both; the reader accepts .txt, which the control does not. What is the list?
Proposed: One list everywhere (file control, drop on the project page, the reading): PDF, Word (.docx), Excel (.xlsx), CSV and plain text (.txt). The older .doc and .xls are refused before reading, with a message that says to save the file as .docx or .xlsx — it is what the reader can read reliably, and three lists that disagree is the bug (confidence: medium)
Answer:

#### What the prototype cannot show

**Q-39 [detail]. Someone who can see the project but not edit it.** Are the three entry points hidden, and what does the page's address show them?
Proposed: A person who can see the project but not edit it sees none of the three entry points (absent, not disabled), and a file dropped on the project page starts nothing. The page's address shows them the product's standard no-access page with a way back to the project; no document, reading or unpublished value is sent — standing rule: someone who may not act never receives the page (confidence: high)
Answer:

**Q-40 [detail]. Reading state or edit state.** Is import offered while the project page is being read, or only after Edit is pressed?
Proposed: Import a report is offered while the project page is being read; pressing Edit is not needed — the brief keeps reporting acts available while reading, because filing figures is not editing the record (confidence: high)
Answer:

**Q-41 [detail]. What can fail while reading, and what does the person see for each?** A scanned or password-protected PDF, an empty file, a file over the limit, a timeout, the reading service down. Today: one generic "Couldn't read *name*".
Proposed: Every failed reading returns the person to the choose step with the file still held and nothing saved, and says "Couldn't read <name>." followed by the reason: no text to read, it may be a scan; it is password-protected; the file is empty; reading took too long, try again; the reading service is not available, try again shortly; the connection was lost. A file over the limit never reaches the reading: the control refuses it with the limit stated — the person must be able to tell "fix the file" from "try again" (confidence: high)
Answer:

**Q-42 [detail]. Nothing to propose.** What does the check step show when the reading finds nothing, or only "Not used" lines?
Proposed: A reading that proposes nothing is not a failure. The check step opens with the document, one line saying nothing in the report can be added to this project, and the "Not used" and "Skipped" lists if there are any. There is no commit action; "Read another" and "Cancel" remain — the person should see what was read and why none of it was used (confidence: high)
Answer:

**Q-43 [detail]. A project with no performance measures, or no closed reporting period to file under.**
Proposed: Import is still offered on a project with no performance measures: Key facts, funding sources and contacts can be proposed, and every figure the report states goes under "Not used" with the reason that the project has no performance measure for it. When the project has no closed reporting period, its performance measure figures go under "Not used" with the reason that there is no closed reporting period to file them under — nothing is filed where the record cannot hold it, and nothing is dropped silently (confidence: medium)
Answer:

**Q-44 [detail]. Failure on "Add N changes".** The record changed underneath, or the save fails part-way. Is an import all-or-nothing?
Proposed: An import is all or nothing. If the save fails, nothing is on the record, the person stays on the check step with their ticks, edits and note intact, and a message says nothing was added and to try again. If the record changed underneath so that a ticked change no longer stands (Q-87 (b), Q-48), nothing is added, the changes concerned are updated and marked, and the person presses again — a half-added import cannot be undone as one and makes totals untrustworthy (confidence: high)
Answer:

**Q-46 [detail]. Is the reading itself kept?** The changes the person left out, and the "Not used" and "Skipped" lists. Nothing stores or shows them after Add.
Proposed: The reading is not kept. After "Add N changes" the product holds the document, the note and the changes that were added; the changes left out and the "Not used" and "Skipped" lists are discarded — the document is kept and can be read again, and a stored reading is a new thing to own (confidence: medium)
Answer:

**Q-47 [detail]. Limits.** File size (20 MB shown), pages or rows, length of pasted text, length of the note, and what the person sees at each.
Proposed: A report file is at most 20 MB (a .zip passing through to Upload shapes follows that screen's 50 MB limit, Q-106), and at most 100 pages or 5,000 spreadsheet rows; pasted text at most 50,000 characters; the note at most 500 characters. Each is refused at its own control with the limit stated, before anything is read; nothing is cut short silently, and the note field counts down near its limit — 20 MB is what the page already shows; the page and row figures are a common ceiling and are to be confirmed against the reading service when it is chosen (confidence: medium)
Answer:

**Q-48 [detail]. Two people at once.** Two people import the same report, or someone edits a field while another has the check step open. Which value stands, and is anyone told?
Proposed: The last save stands, as for two hand edits, and nobody is notified. What prevents a wrong record is the check on "Add N changes" (Q-87 (b)): if another import or a hand edit has changed what a ticked change stands on (the entry is now on file; the value it would replace is no longer the one shown), nothing is added, those changes are updated and marked, and the person presses again. The second of two people importing the same report therefore finds its entries "Already on file" — never count twice, with no new screen (confidence: medium)
Answer:

**Q-49 [detail]. Notifications and the Updates feed.** Does adding an import notify the organization's managers, or only raise the unpublished-changes count? Does it appear in the Updates feed, and on Add or on publish?
Proposed: Adding an import notifies nobody. It raises the project's unpublished-changes count and puts the project in the review like any other change. In the Updates feed it appears when a hand edit would, as one item for the import, not one per change, and it names the document only to people allowed to read the name (Q-136) — spec #38 notifies nobody individually even on publish, and imported changes are ordinary changes with a source (confidence: medium)
Answer:

**Q-50 [detail]. A funding source already on the record with a different amount.** A change to the existing source, or "Already on file"? Today the new amount is lost.
Proposed: A funding source the record already holds (same grant or program and organization) with a different amount is proposed as a change to that row: it shows the new amount with "Was <amount>", arrives ticked, and adding it replaces the amount on the existing row; no second row. With the same amount it is "Already on file" — today the new amount is lost, and a second row would count the grant twice (confidence: medium)
Answer:

**Q-51 [detail]. Overwriting a hand edit.** Does the person see that the value being replaced was typed by hand, beyond "Was …"?
Proposed: No extra mark. "Was <value>" is all the check step shows of the value being replaced, whoever or whatever put it there — every edit is trusted alike, and the change history already says who set it (confidence: high)
Answer:

#### The harvester's readings, to confirm

**Q-53 [detail]. An import is recorded with the person who added it and the day.** (RUL-55) Confirm.
Proposed: Confirmed: an import is recorded with the person who added it and when (the day is what screens show; the time is kept, Q-86) — spec #5 and #19 need both to show a source (confidence: high)
Answer:

**Q-54 [detail]. Proposals are ordered in each section: ready first, then needing a decision, then no match.** (RUL-56; only the developer-machine reader sorts.) Confirm.
Proposed: Confirmed, with the one flagged state of Q-61: in each section, ready changes first, then flagged ones, then the rest as Q-67 orders them. The check step sorts, in code, whatever order the reading returns — the person adds the clean ones and then settles what waits (confidence: medium)
Answer:

#### Raised while recording the answers

**Q-61 [detail]. What does the one flagged state read as?** After Q-25 a change is ready or flagged. The prototype has four badges on changes that wait on the person: "Needs a decision", "No match", "Unsure", "Not in this workspace". Do the first three become one badge, and with what wording?
Proposed: "Needs a decision", "No match" and "Unsure" become one badge, "Needs you", the same words the tally uses; the sentence under the quote says why. "Not in this workspace" keeps its own wording, because what it asks for is different (pick an organization), and is still counted under "need you" — one state, named once (confidence: medium)
Answer:

**Q-63 [detail]. When a report names another project, do its changes arrive unticked?** The developer-machine reader does this. Added 2026-11-23 (builder's checklist): if they do, how is each marked? The developer-machine reader marks every such change "needs a decision", Key facts changes included, unless it counts another quantity. Stories: 06, 20.
Proposed: Yes. When the report names another project, every change that could be added arrives unticked, with its values as read and no badge of its own; the warning above the changes gives the reason and the tally counts them under "need you". Key facts changes are treated the same. "Already on file" and kept changes keep their own state — adding another project's figures is the costliest mistake here, and emptying every amount would punish a report that is merely named differently (confidence: medium)
Answer:

**Q-64 [detail]. Must the toast's Undo work by keyboard and assistive technology in the first release?** Undo sits only on the toast (Q-24), and the component's own note says a toast action is not reachable by keyboard. If yes, toast-only Undo needs a different construction.
Proposed: Yes. Undo stays on the toast only, as decided, and the toast is built so that the decision can stand: it is announced when it appears, "Undo" is a real button that is the next keyboard stop after the page loads, and the toast stays until dismissed — keyboard reach is required at the level proposed in Q-83, and the toast as prototyped does not have it (confidence: medium)
Answer:

**Q-65 [detail]. Which Key facts fields count as "built-in" for an import?** Q-27 allows built-in fields and custom fields; stage is kept out (spec #9). Added 2026-11-23 (builder's checklist): beyond Timeline and County the project page holds three Key facts: project type, lead organization and estimated total cost.
Proposed: An import can set Timeline, County, Estimated total cost and any other built-in single-value Key fact, plus the workspace's custom fields. It never sets stage (spec #9), project type or lead organization: project type changes which performance measures the project is asked, and lead organization changes who can edit it (confidence: medium)
Answer:

#### Raised while writing the stories

Raised by the gap pass that ends the write stage, 2026-11-23. Each was a gap a story hit that the prototype does not settle. Where the prototype does something, it is stated, so the answer can be "as the prototype". "Stories" names the stories that cite the question.

**Q-66 [detail]. The reading service: three things the developer-machine reader leaves open.** (a) How long may a reading take before the person is told it failed? The reader gives up after four minutes. (b) Does the service return the document as passages for every file type, so a Word file or spreadsheet can be shown beside the changes with the passage marked, and are those passages kept with the stored file? Today only the two sample documents mark a passage; a real PDF is shown in the browser's viewer, pasted text is shown with nothing marked, and any other real file shows "This file can't be shown here." with the quote. (c) Does the service keep a confidence of its own? Q-25 removed confidence from what the person sees, but the reader still asks the model for one and never lets a low-confidence figure arrive ticked (enabler 50). Stories: 02, 04, 10, 50.
Proposed: (a) A reading may take four minutes, as the reader does; then it fails as in Q-41 and the person can try again. (b) A PDF is shown as itself, opened at the change's page. Every other file type (Word, spreadsheet, CSV, text) comes back from the service as passages, which are kept with the stored file, so the document can be shown beside the changes and beside the review with the passage marked; "This file can't be shown here." is left for a failure only. (c) The first release keeps no confidence; when the later guards arrive it is internal to the service, never shown and never stored on a change — the decided check step is "the document beside the changes", and without (b) that is true only for PDFs, while the service must extract the text anyway (confidence: medium)
Answer:

**Q-67 [detail]. Order of changes inside a section: where do the other states go?** Q-54 asks to confirm "ready, then needing a decision, then no match". Nothing places a change that is already on file, kept by a data source, unsure, or "Not in this workspace"; the page shows them wherever the reading returned them. The hand-ordered samples put the unsure change last and a change already on file wherever its line fell in the report. Stories: 04.
Proposed: Inside a section the order is: ready, flagged ("Needs you", then "Not in this workspace"), "Already on file", "Kept by a data source". Within each group, the order the document states them; a change the person unticks stays where it is — what can be added first, what waits next, what needs nothing last (confidence: medium)
Answer:

**Q-68 [detail]. Keyboard focus on the Import a report page.** (a) On a narrow screen, should focus move to the document when "Show source" opens it, and back to the change's "Show source" on "Back"? The review does this for its own document pane; this page moves nothing. (b) After "Add N changes" is stopped by an invalid change, should focus move to the first failing field? Today the change is scrolled into view and focus stays on the button. Stories: 05, 30, 65.
Proposed: (a) Yes: on a narrow screen "Show source" moves focus to the document's "Back", and "Back" returns focus to that change's "Show source", as the review already does. (b) Yes: when "Add N changes" is stopped, focus moves to the first failing field — same pane, same behavior, and a stopped action must lead somewhere (confidence: high)
Answer:

**Q-69 [detail]. A file the control or the page should refuse.** (a) A file of a type not on the list, dropped onto the file control: the file picker hides other types, but a dropped one is held like any other, with no message, and fails only when it is read. Should the control refuse it, and with what words? (The list itself is Q-38.) (b) A file over 20 MB dropped on the project page: the drop is not checked against the limit. What does the person see? (c) A file dropped on the project page that cannot be carried to the Import a report page: the page opens on the choose step and says nothing. Should the person be told? Stories: 08, 10.
Proposed: (a) The file control refuses a dropped file whose type is not on the list and is not a spatial file (a spatial file gets its own box, Q-106): nothing is held and a message names the types it takes. (b) A file over 20 MB dropped on the project page opens Import a report on the choose step with the size message naming the file; nothing is read. (c) When a dropped file cannot be carried to the page, the choose step says so and asks the person to choose the file there — never fail later what can be refused now, and never drop the person's file without a word (confidence: high)
Answer:

**Q-70 [detail]. Handing a spatial file to Upload shapes: when, and how?** Q-26 put the hand-off in the first release and it is not built. Is the file passed when the person follows the "Upload shapes" link in the "That's a spatial file" box, or at once when the file is chosen? And what becomes of the file if the person does not follow the link? Stories: 11.
Proposed: A file that Upload shapes takes (a .zip, Q-106) is passed when the person follows "Upload shapes" in the "That's a spatial file" box, not when it is chosen. If they do not follow it, the file is let go when they choose another file or leave; nothing is uploaded or stored — nothing leaves the person's machine until they act (confidence: medium)
Answer:

**Q-71 [detail]. A Key facts value that does not fit its field.** The report names a value for a field the project has, but the field cannot hold it: a choice field with no such option, a number field given words, a Timeline that is not two years. In the first release, before the later format check (enabler 50), is the change proposed as read, flagged for the person, or listed under "Not used"? Only Timeline and County are built, and neither sample shows a misfit. Stories: 15, 19, 50.
Proposed: A Key facts value that does not fit its field is never proposed and never saved. The check step tests it in code when it builds the list and puts it under "Not used" with the reason (no such option; not a number; a Timeline needs a start and an end year) — an invalid value must not reach the record, and since a Key facts change cannot be edited on the check step (Q-32) there is nothing for the person to fill (confidence: medium)
Answer:

**Q-72 [detail]. A field a GIS subscription supplies (spec #40), on the check step and on Undo.** Not built. (a) For a subscription that is not authoritative, does the change say anything about its source on the check step, for example that the value will be sent to the GIS system? (b) What does Undo of the import do to a change that was already sent back to the GIS system? Stories: 16, 41.
Proposed: A field a two-way GIS subscription supplies is treated exactly as a hand edit to it would be. (a) The change is an ordinary ready change with one line naming the source the value is also sent to. (b) Undo is another edit: the earlier value is sent back the same way, and a failed send is handled as any failed send is — one rule for an edit, however it arrived (confidence: medium)
Answer:

**Q-73 [detail]. A contact the report names with no email.** Is it proposed at all? If so, how is it matched to a person and when is it "Already on file"? Today both tests on the check step use the email, so two contacts with no email would count as the same one, while the Contacts panel tells such contacts apart by name. No sample has one. Related: Q-34. Stories: 18.
Proposed: A contact with no email is proposed. It is matched by name, ignoring capitals and outer spaces, and is "Already on file" when the project has a contact of that name; two contacts with no email and different names are two contacts. When both sides have an email, only the email decides — the Contacts panel already tells such contacts apart by name (confidence: medium)
Answer:

**Q-74 [detail]. "This report names another project": how is the name matched, and what if there are several?** (a) The developer-machine reader counts the report as about this project only when the two names are the same once case, spaces, punctuation and digits are ignored. Should an abbreviation, an older name or a project number also count? (b) The reader returns one project name per document. What does the warning say when a report names several other projects? No sample raises the warning. Related: Q-63. Stories: 02, 20.
Proposed: (a) The report is about this project when the names are the same once case, spaces, punctuation and digits are ignored, when one name contains the other, or when the report gives this project's number; an abbreviation or an older name raises the warning, which costs the person some ticks and nothing else. (b) The service returns every project the report names. If this one is among them there is no warning; if not, the warning names the first and counts the rest — the warning should fire only when the report is plainly about something else (confidence: medium)
Answer:

**Q-75 [detail]. Undo in two cases the toast allows.** (a) A field the import set was then edited by hand, and the toast is still open: Undo puts the field back to its value from before the import, so the hand edit is lost. Is that right, or should the hand edit stand? (b) The import's changes were published while the toast was still open: is Undo still offered, and what does it do to values that are now public? Related: Q-64. Stories: 41, 84.
Proposed: (a) The hand edit stands. Undo takes back only what is still as the import left it, and the toast says how many changes were removed and how many were kept because they were edited since. (b) Once any of the import's changes is published, Undo is no longer offered; pressed from a toast that is still open, it changes nothing and says the changes were published and are corrected on the project page — never lose a person's later work, and never let a toast alter what a Manager has published (confidence: medium)
Answer:

**Q-76 [detail]. After a publish, what of an import still shows?** The prototype does not change these on publish; confirm or correct each. (a) A contact row and a funding source row keep "From *document name*". (b) "Total from all sources" stays for as long as the table holds a row an import added. (c) The import's row stays in the change history. (d) The note is no longer shown anywhere once none of the import's changes is waiting. (e) No screen leads from a published change to its document until the later story 29. Stories: 17, 18, 21, 22.
Proposed: Confirmed as the prototype, each part. (a) A contact and a funding source keep "From <document name>" after a publish, for the people allowed to read it. (b) "Total from all sources" depends on the table's rows, not on publishing, so it stays. (c) The import's row stays in the change history. (d) The note leaves the review once none of the import's changes is waiting; it stays with the import's record. (e) Nothing leads from a published change to its document until the later story 29 — publishing changes what is public, not where a value came from (confidence: medium)
Answer:

**Q-77 [detail]. Access to the kept document that is lost or fails.** (a) A person who could edit or publish the project when the import was added and no longer can: do they lose the document at once? (b) What happens to the documents of a project that is deleted? (c) What does a Manager see in the review when the document cannot be fetched? Today a file the browser no longer holds shows "This file can't be shown here." with the quote. Related: Q-39, Q-45. Stories: none since the answers were written in (2026-11-23).
Proposed: (a) Yes, at once: the right to open the document is checked each time against who can edit or publish the project now. (b) A deleted project's documents are deleted with it, and are gone for good when the deletion is. (c) The Manager sees that the document cannot be opened right now, with the change's quote and a way to try again; publishing is not blocked — access follows the project, and a missing file must not stop a review (confidence: high)
Answer: (2026-11-23) Withdrawn: no longer arises. The file is not kept (spec #42), so there is no kept document to lose access to.

**Q-78 [detail]. If Q-33 follows the spec, how are two readings offered?** Spec #13 says a flagged change is never pre-filled. The prototype writes one reading in and states the other in a note (in the sample: 6 acres written in, "6, not 12" in the note). If the change is to arrive empty with both readings offered, how does the person choose: two buttons, a choice between the two figures, or typing the figure? Depends on Q-33. Stories: 14.
Proposed: The amount arrives empty and the sentence under the quote states both readings and why they differ ("The report gives 6 acres in the table and 12 in the summary."). The person types the figure, which ticks the change like any other empty one. No buttons and no choice control — a button for each reading is "Use suggestion" again, which was dropped (confidence: medium)
Answer:

**Q-79 [detail]. Partner organizations, the later story (Q-21).** Nothing is built. (a) Which section of the check step holds them? The four groups follow the project page's sections. (b) What is a partner organization change made of: the organization only, or also its part in the project, such as landowner? (c) For a partner the workspace does not hold, does the person pick an existing organization, as for a funding source? (d) When is a partner "Already on file"? (e) How is an added partner shown on the project page, and does it name its document? (f) How is a partner told from a funder or a contact's organization when one organization is named in two parts? Added 2026-11-23 (builder's checklist): (g) How is the partner's name matched to the workspace's organizations: by the rule for a funder (story 17, R8: letter for letter, ignoring case and outer spaces), and are connected organizations matched too? (h) Can the person change or pick the organization before adding, as for a funding source? Does a partner the workspace does not hold arrive flagged and unticked, with which badge and sentence, and can the organization be cleared once picked? (i) What does "Add N changes" save (the organization on the project, unpublished), what if the project already has that partner by then, and how do Undo (story 41), the review row's label and value (story 24) and the change history (story 22) treat it? (j) Which feature owns a project's partner organizations, and does the project page show them today? (k) Order inside the section, and the same partner named twice in one reading (Q-99). (l) What the reading service is told and returns for a partner (compare Q-89). (m) If (b) gives a partner a part in the project: free text, or a fixed list, and is "Organization" there a renameable noun in the sentence (Q-98)? Stories: 27.
Proposed: For the later story: (a) partners sit in their own section of the check step, named and placed as the project page's partner section. (b) A change is the organization only; no part in the project. (c), (h) A partner the workspace does not hold arrives flagged "Not in this workspace" and unticked, and the person picks an existing organization, exactly as for a funding source. (d) "Already on file" when the project already has that organization as a partner. (e) Added partners show in the project page's partner list with "From <document name>". (f) An organization named as funder and as partner is proposed once in each section. (g) Matched by the funding source rule, connected organizations included. (i) Adding saves the organization on the project, unpublished; one the project gained meanwhile is passed over; Undo, the review row and the change history treat it as a contact. (j) `project-record` owns a project's partner organizations, and the project page does not show them today. (k) Ready first, and the same partner twice in one reading is one change. (l) The service returns the organization's name and its quote, and is told nothing of the workspace. (m) Does not arise — reuse the funding source construction, since nothing is built to follow (confidence: low)
Answer:

**Q-80 [detail]. A reading the person can leave and come back to, the later story (Q-23).** Nothing is built. (a) Where does the person find a waiting or finished reading: the Import a report page, the project page, a notice? (b) Are they told when it finishes or fails while they are away? (c) How many readings can wait for one project or one person, and can another person who can edit the project see or use a reading they did not start? (d) How long is a ready or failed reading kept, and what discards it? (e) Are "Already on file" and the difference from a total to date worked out again when the person returns? (f) Are ticks, edits and the note kept if the person leaves a ready reading before adding? Related: Q-41, Q-46, Q-48. Added 2026-11-23 (builder's checklist): (g) What ends a stored reading: "Add N changes", "Cancel" (story 35, R3 ends it today), "Read another", a time limit? Can a failed one be read again without choosing the file again? (h) A second "Read it" on the same project while one reading is in progress or ready: allowed, queued, or does it replace the first? The same document twice? (i) While the person is away the project changes in what it can take (a reporting period closes, a breakdown option is removed, a data source starts keeping a field), or the person loses the right to edit it: what does the ready reading show on return? (j) The document must be held from "Read it", not from "Add N changes": is it under enabler 03's access rules from then, and deleted when the reading is discarded? This changes enabler 03, R2 and bears on Q-85. (k) Does the page say that the person may leave, and how long may a reading nobody is waiting on run before it fails (Q-66 (a))? Stories: 28.
Proposed: For the later story: (a) a waiting or finished reading is found on the project page, as a line beside the Import a report entry, and opens the page at its state. (b) The person gets one notification when it finishes or fails. (c), (h) One reading per project at a time; a second "Read it" is refused while one is reading or ready; another person who can edit the project can see that one is waiting but not open it. (d), (g) A ready or failed reading is kept 7 days; "Add N changes", "Cancel", "Read another" and the time limit end it; a failed one can be read again without choosing the file again. (e) "Already on file" and totals to date are worked out again on return. (f) Ticks, edits and the note are kept. (i) A change the project can no longer take is marked on return, and a person who can no longer edit the project gets the no-access page and the reading is discarded. (j) The document is held from "Read it" under the kept document's access rules and deleted when the reading is discarded. (k) The page says the person may leave; an unattended reading may run 15 minutes — the smallest stored reading that still lets someone leave (confidence: medium)
Answer:

**Q-81 [detail]. Opening the document from the change history, the later story (Q-26).** Nothing is built. (a) Where does the document open (beside the history, in its place, on a page of its own) and how is it closed? (b) What is shown for a file that cannot be shown? The review falls back on the selected change's quote, and a history row has no selected change. (c) With no change selected, does it open at its start? (d) Who can open the Change history sheet at all? If only people who can edit the project can, nobody else is ever offered the row. Related: Q-45. Added 2026-11-23 (builder's checklist): (e) What the control on the row is and reads: does the document's name in "N changes from *document name*" become it, and what does a row for pasted text offer? (f) Once the import's changes are published, does the row still open the document? With Q-76 (c) and (e) it would be the only way from a published change back to its document. (g) A kept document that cannot be fetched (Q-77 (c)). (h) On a narrow screen, where the document goes relative to the Change history sheet. (i) Whether the changes the import made, and each one's place in the document, can be reached from here, or the document is shown whole only. Stories: none since the answers were written in (2026-11-23).
Proposed: For the later story: (a) the document opens in place of the history list inside the same sheet, with "Back" to return. (b), (g) A file that cannot be shown or fetched says so and offers a download where the file exists. (c) It opens at its start. (d) Only people who can edit or publish the project are offered the control; anyone else sees the row as plain text. (e) The document's name in "N changes from <document name>" is the control; a pasted-text row opens the kept text the same way. (f) Yes, it still opens after a publish. (h) On a narrow screen it takes the sheet's whole width. (i) The document is shown whole; the import's changes are not listed there — the least new surface, and the one way back from a published change to its document (confidence: medium)
Answer: (2026-11-23) Withdrawn: no longer arises. The file is not kept (spec #42), so nothing opens from the change history; later story 29 is retired.

**Q-82 [detail]. A figure in another unit than the measure's, in the first release.** Raised by the slice repair, 2026-11-23. Q-62 put unit conversion in a later release (story 26), and the user confirmed that the first release converts nothing, in the model or in code. (a) What does the first release do with a figure the report states in another unit, for example "3,960 feet" for a measure recorded in miles: propose the figure as written, flag the change with an empty amount for the person to fill, or list it under "Not used"? Spec #13 counts "a unit mismatch" among the unsure readings that are flagged and left to fill; nothing says whether that covers two known units of one kind. (b) Does the same hold for a total to date stated in another unit (story 13)? (c) The prototype's scripted samples arrive already converted: two of the sample crew log's six changes and two of the sample funder report's seven ready ones. The stories' sample counts ("6 ready to add", "7 ready to add") therefore assume a conversion the first release does not do. Should those scenarios be rewritten once (a) is answered, or should the samples change? (d) The sample paragraph shows "Converted: 35 people × 4 hours = 140 hours", a multiplication under the same label. Is that arithmetic the first release does and shows, and under what label? RUL-33 names adding lines together and unit conversion only. Related: Q-62, Q-33. Stories: 02, 13, 14, 26. The rows that wait on it are named in `.scratch/project-updates/requirements/fixtures.md`.
Proposed: (a) A figure in another unit than the measure's is flagged: the amount arrives empty and the sentence states the report's figure and the measure's unit ("The report gives 3,960 feet. This measure is in miles."); the person converts and types it. (b) The same for a total to date in another unit: flagged and empty, with no difference worked out. (c) The samples change, not the scenarios: the four rows that arrive converted are restated in the sample documents in the measure's own unit, so "6 ready to add" and "7 ready to add" stand. (d) No multiplication in the first release: "35 people for 4 hours" arrives flagged and empty with that sentence, and the person types 140 — spec #13 names a unit mismatch among the flagged cases, and the first release converts nothing (confidence: medium)
Answer:

**Q-83 [detail]. Two standing requirements with no written source.** Raised by the check stage, 2026-11-23. (a) Which accessibility standard, and which level of it, must every screen of this feature meet? No source read names one; the mobile foundation spec cites one criterion, for touch targets only. Story 23 is where it bites first (Q-64). (b) SR-6 in `standing-requirements.md` (a message about a problem is written next to the control it concerns and announced once) is the harvester's reading of one rule, RUL-52, which is about the file control. Is it a rule for every error state in the feature? The first part reaches past this feature; it is filed here because this feature's standing requirements raised it. Stories: 09, 10, 20, 30, 65.md`; cited by name in 09, 20, 30, 65 (2026-11-23: which messages are announced).
Proposed: (a) Every screen of the feature meets WCAG 2.2 at level AA. (b) Yes: every error state in the feature follows one pattern — the message is written next to the control it concerns, tied to it for assistive technology, and announced once — AA is the level public agencies are held to and 2.2 already matches the touch-target rule the mobile spec cites (confidence: medium)
Answer:

**Q-84 [detail]. "Add N changes" pressed twice, and what the person sees while an import is saved.** Raised by the rewrite of story 01, 2026-11-23. In the prototype the save is instant, the button stays enabled until the page changes, and nothing stops a second press; a second press that got through would save the entries again. In a build the save takes time. (a) What does the person see between the press and the project page: the button disabled, a "saving" state, something else? (b) Must a second press, or a repeated request, be ignored so that one press makes one import? Related: Q-44. Stories: 01, 22.
Proposed: (a) From the press until the project page opens, "Add N changes" is disabled and reads as busy ("Adding…"), and the page's other actions and the changes cannot be used. (b) Yes: one press makes one import; a second press or a repeated request is ignored — a double save counts every figure twice (confidence: high)
Answer:

**Q-85 [detail]. A reading the person walks away from.** Raised by the rewrite of story 01, 2026-11-23. Q-23 settled that the person waits on the page and that leaving ends the reading. The prototype's page sends one request, waits for one answer, and sends nothing when it is left. (a) When the person leaves during a reading, must the service stop reading, or may it finish and throw the result away? (b) What becomes of the document that was sent: is it deleted at once, and is that true of every reading that is not followed by "Add N changes"? (c) If the connection drops while the page is still open, is that a failed reading like any other (Q-41)? Related: Q-52, Q-66. Stories: 01, 02, 35.
Proposed: (a) When the person leaves, the service stops where it can; a reading that finishes anyway is thrown away and never stored. (b) The document that was sent is deleted as soon as the reading ends without "Add N changes": on leaving, "Cancel", "Read another" or a failure. Only an added import keeps its document. (c) Yes: a dropped connection is a failed reading like any other, with its own reason (Q-41) — keep nothing the person did not add (confidence: high)
Answer:

**Q-86 [detail]. The day an import is recorded with: which clock?** Raised by the rewrite of story 01, 2026-11-23. An import is recorded with the day alone, no time of day (the prototype stamps one fixed date on every import). (a) Whose time zone decides the day: the person's, the workspace's, or one fixed zone? (b) Is the time kept as well, even though only the day is shown? Related: Q-53. Stories: 22, 24.
Proposed: (b) The exact time is kept. (a) Screens show the day alone, in the time zone of the person reading, as the product shows every other date — no new setting, and the kept time gives two imports on one day an order (confidence: medium)
Answer:

**Q-87 [detail]. An entry the record already holds, on "Add N changes".** Raised by the exemplar rewrite of story 01, 2026-11-23. In the prototype "Add N changes" does not look at the record: the "Already on file" check runs once, when the check step opens, and only decides whether a change arrives ticked (story 32). So the same report added twice saves every entry twice, and so does ticking a change that is "Already on file". (a) Must adding refuse, warn about or pass over an entry the record already holds for the same measure, reporting period, amount and answers, or is saving it again intended? (b) Is the check made again when the button is pressed, since the record may have changed while the check step was open? Related: Q-48, Q-50. Added 2026-11-23 (builder's checklist), for the other kinds of change: (c) a ticked "Already on file" Key facts field is set to the value it already has, and the import records and counts it as a change with the same value before and after, so the toast, the change history and the review count it; (d) a ticked "Already on file" contact is recorded and counted by the import and draws no row in Contacts, because the email is already there; (e) a ticked "Already on file" funding source leaves the table's row entered by hand as it is, and the import still counts a change that drew nothing. Should such a change be refused, passed over without being counted, or added as now? The same thing twice within one reading, or from two imports, is Q-99. Stories: 15, 17, 18, 32, 86.
Proposed: (a) A performance measure entry that is "Already on file" arrives unticked; if the person ticks it on purpose it is added, because two equal entries can both be true. Reading the same report twice therefore adds nothing by default. (b) Yes: the check is made again when the button is pressed, for every kind of change and by the same tests (Q-99, rule 3); a ticked entry that has become "Already on file" since the check step opened stops the import once, is unticked and marked, and the person presses again on a true count (they may tick it again on purpose). (c), (d), (e) A Key facts field, a contact or a funding source that is "Already on file" has no checkbox, because adding it would change nothing; it is never recorded or counted as a change. A funding source the person edits into a match with a row on file becomes "Already on file" when the amount is the same, and a change to that row when it differs (Q-50, Q-133 (c)) — an import's count must equal what it changed (confidence: medium)
Answer:

**Q-88 [detail]. Running a UAT script: the recorded readings, and getting back to the start.** Raised by the exemplar rewrite of story 01, 2026-11-23. A model does not read a document the same way twice, so every scenario and UAT script runs against the recorded readings in `.scratch/project-updates/requirements/fixtures.md`. (a) Who provides the test environment that serves those recordings for the sample documents, and is it the one the client's testers use? (b) How does a tester return Deer Creek to its starting state after a script has added an import? The prototype is reset by clearing the browser's data. In a build, "Undo" exists only on the toast (story 23) and is gone once the toast is dismissed. No written source gives a procedure, so each story's Reset line says "not known". Stories: none since the answers were written in (2026-11-23). It bears on every UAT script in the feature.
Proposed: (a) The development team provides one test environment whose reading service is a stand-in that returns the recorded readings for the sample documents, and the client's testers use that same environment; (b) it has a reset, outside the product, that returns the sample project to its starting state, so testers do not depend on Undo — an assumption, not a question for the user (the user, 2026-11-23): who hosts the environment is the development team's to arrange. Written once as standing requirement SR-11 and in `fixtures.md`; no story cites this question any more (confidence: medium)
Answer:

Raised by the revision of the stories, 2026-11-23 (five writers, one question each as they hit it; numbered afterwards).

**Q-89 [detail]. The reading service, for the kinds of change the developer-machine reader does not return.** What goes in and what comes back is recorded for performance measure figures and Key facts fields only (RUL-70). Funding sources, contacts and a change the reading is "unsure" of exist only in the scripted samples. (a) Is the service told anything about the project's funding sources and contacts, or the workspace's organizations and people, or does it return what the document names and leave every match to the check step? (b) What does it return for a funding source and for a contact? (c) Is "unsure" a fourth verdict the service returns, beside "counts what the measure asks", "supports more than one reading" and "counts something else", or is it worked out from those three? Related: Q-52, Q-66. Stories: 02, 14, 82.
Proposed: (a) The service is told the project's performance measures and fields, as today, and nothing about the project's funding sources and contacts or the workspace's organizations and people; it returns what the document names and every match is made by the check step in code. (b) For a funding source: grant or program, organization name, amount secured, quote and page. For a contact: name, role, organization, email, quote and page. (c) "Unsure" is not a fourth verdict: a figure either counts what the measure asks, or comes back unsettled with its reason, and the check step shows every unsettled one as flagged — send the model as little as the job needs, and let code decide (confidence: medium)
Answer:

**Q-90 [detail]. May a breakdown answer arrive inferred?** The rule as harvested (RUL-41): the reading answers a breakdown question only when the document states the answer; otherwise the question arrives unanswered for the person to set or leave. Two rows of the recorded readings do otherwise: the crew log's row C5 and the pasted paragraph's row P3 arrive answered "Planting" with the note "“Planting” is inferred.", for a volunteer workday whose text names no activity. Which is the rule: unanswered unless the document states an option, or the reading may infer an answer and say so in the note? The answer also decides rows C5 and P3 of `.scratch/project-updates/requirements/fixtures.md`. Stories: 07.
Proposed: A breakdown question arrives answered only when the document states one of its options; otherwise unanswered, for the person to set or leave. No inferred answers. Rows C5 and P3 arrive unanswered and without their note — never present a guess as a fact (confidence: high)
Answer:

**Q-91 [detail]. A total to date that is lower than the record's.** A figure the report states as a total to date is filed as the difference from what the record holds. The sample funder report says 12,400 plants to date. Once the record holds 12,577, the prototype shows "12,400 to date − 12,577 on record = 0" and marks the change "Already on file". That line is false arithmetic, and the report and the record disagree. Should such a change be flagged for the person instead of treated as nothing left, and what should its arithmetic line say? Stories: 13.
Proposed: A total to date lower than what the record holds is flagged: the amount arrives empty, unticked, and the sentence states both figures ("The report says 12,400 to date. The record holds 12,577."). It is not "Already on file" and shows no arithmetic line. Only an equal total is "Already on file" — the report and the record disagree, and the person must see that (confidence: high)
Answer:

**Q-92 [detail]. A flagged change that ticked itself, then was emptied.** A change that arrives with an empty amount ticks itself when the person types a figure above zero. In the prototype, clearing that figure afterwards leaves the change ticked, and "Add N changes" is then stopped by the check on ticked changes (story 30). Should clearing the figure untick the change again? Stories: 14.
Proposed: Yes. Clearing the figure of a change that ticked itself unticks it again; a change the person ticked by hand stays as they left it — the tick should follow the figure that caused it (confidence: high)
Answer:

**Q-93 [detail]. Can the note for the reviewer be changed or removed once the import is added?** In the prototype nothing does it: the text area exists only on the check step, and the one thing that removes a note is "Undo", which takes the whole import back and is gone with the toast (Q-24). Is that intended, or should the note be editable until the import's changes are published, and if so from where? Stories: 21.
Proposed: The note cannot be changed or removed once the import is added. Undo, while the toast is there, removes it with the import; otherwise it stands as written until the changes are published — it is a short message to one reader, and editing it would need a new place to do so (confidence: medium)
Answer:

**Q-94 [detail]. In the change history, where does an import's row sit among the other rows?** Imports' rows are in the order they were added, the latest first. The prototype lists them above every other row of the log, because it lays them over a seeded log, so a hand edit made after an import shows below it. Is an import's row placed by its day among the hand edits, or do imports always come first? Related: Q-86 (two imports on one day can be ordered only if the time is kept). Stories: 22, 23.
Proposed: An import's row sits among the other rows by its time, latest first, like any other change; a hand edit made after an import shows above it — the prototype's order is an accident of its sample data (confidence: high)
Answer:

**Q-95 [detail]. A converted figure under 0.01 (later release).** Unit conversion (enabler 26, `later`) rounds a converted figure to two decimals and keeps a result under 0.01 to two significant figures: 12 feet is 0.0023 miles. But an amount is shown with at most two decimals (story 01), which would show it as 0. How is such an amount shown on the check step and saved on the record: with the extra decimals, or rounded to two? If it rounds to 0, is the change still proposed? Added 2026-11-23 (builder's checklist): the arithmetic line has the same problem as the amount. The reader writes both figures of "Converted: …" with at most two decimals, so 12 feet for a measure in miles reads "Converted: 12 feet = 0 miles" while the amount it proposes is 0.0023. Whatever is decided for the amount should be decided for the line. The reader also rounds a figure that needed no conversion to two decimals (3.456 acres for a measure in acres arrives as 3.46); whether the first release rounds a figure as written is Q-118 (b). Stories: 26.
Proposed: For the later story: an amount is held to the measure's own decimal places, on the check step and on the record. A converted figure that would round to zero at that precision is not proposed as zero: the change is flagged and empty, and the sentence states the report's figure and that it is less than the measure can record. The "Converted: …" line shows the same figures as the amount, never more or fewer decimals — a record cannot hold more precision than the measure allows, and "= 0 miles" beside 0.0023 is false (confidence: medium)
Answer:

**Q-96 [detail]. When does a message from the check on "Add N changes" go?** When a ticked change is invalid, "Add N changes" adds nothing and each failing field shows a message. In the prototype a message stays on its field until the button is pressed again, even after the person has put the field right; every message is then cleared and worked out afresh. Is that the requirement, or should a message go as soon as its field is corrected? Related: Q-68. Added 2026-11-23 (builder's checklist): and when its change is unticked? The prototype clears messages only on changes that are ticked at the press, so a failing change the person then unticks keeps its message for as long as the check step is open. The same holds for the three messages on a funding source (story 65). The messages are not announced to assistive technology (Q-83). Stories: 30, 65.
Proposed: A message goes as soon as its field is corrected or its change is unticked, and every message is worked out afresh on the next press — a message beside a field that is now right is a false statement (confidence: high)
Answer:

**Q-97 [detail]. Two imports that each add an entry for the same performance measure and reporting period: one row in the review, or two?** `publish-review` owns the rule that two imports of one field are one row, and that rule speaks of fields. An entry is not a field: the sample crew log's row C3 and the sample funder report's row F3 are both "Acres of invasive vegetation removed · 2025", and each adds its own entry. Does the review show two rows, each with its own "From *document name*" button, or one row as for two imports of one field, whose button then names and opens the later import's document? Stories: 24, 85. It bears on story 24, which draws the row.
Proposed: Two rows. Each imported entry is its own row in the review, with its own "From <document name>" button, even when two imports add entries for the same performance measure and reporting period; the one-row rule is for a field, which holds one value, and an entry is a separate thing that adds to a total — folding them would hide one document from the Manager (confidence: medium)
Answer:

#### Raised by the builder's checklist

Raised by the builder's checklist pass over all 44 stories, 2026-11-23 (five writers; numbered and merged by the closing pass). Each is something a builder would have to ask: the prototype shows the clean case once and either does nothing off it, or does something by accident. Where the prototype does something, it is stated, so the answer can be "as the prototype". The first two are asked once for the whole feature. "Stories" names the stories that cite the question.

**Q-98 [detail]. Asked once for the feature: do labels and sentences that contain a renameable noun take the workspace's word?** A workspace can rename Project, Organization, Classification, Performance measure, Funding source, Expenditure, Milestone, Work area and Contact, and SR-4 (itself only inferred) says a label naming one shows the workspace's word. The prototype marks two labels (the "Projects" breadcrumb and the "Performance measures" card title, story 01) and writes everything else as fixed text (RUL-77). The cases: (a) the check step's section headings "Performance measures", "Funding sources" and "Contacts" (story 04); (b) the labels "Funding source" on a funding source change and "Contact · `<role>`" on a contact change, the field "Organization", and the row label "Contact" on the project page (stories 17, 18, 75); (c) sentences: "“`<name>`” isn't an organization here. Pick one, or leave this out." (story 75), the warning's title "This report names another project" (story 20), and the row "Total from all sources" (story 17); (d) lines the reading itself words under "Not used", such as "This project has no Watershed field." and "Not a contact or a funder." (story 19): is the reading service told the workspace's words, or are those lines left as written? One answer is wanted for labels, one for sentences, one for what the reading writes. Related: Q-83, Q-141 (the label "Funding source" on a review row). Stories: 02, 04, 17, 18, 19, 20, 50, 75.
Proposed: Every label and every sentence the product words takes the workspace's word. (a) The section headings take it ("Performance measures", "Funding sources", "Contacts", each in the workspace's plural). (b) So do the labels "Funding source" and "Contact · `<role>`", the field "Organization" and the row label "Contact". (c) So do sentences, with the workspace's word in the form the sentence needs (singular or plural, lower case inside a sentence): "“`<name>`” isn't an organization here…", "This report names another project", "Total from all sources" (which names no renameable noun and is unchanged). (d) The reading service does not word reasons. It returns each "Not used" item in the report's own words plus one reason from a fixed set (no measure asks for it; the project has no such field; not a contact or a funder; location changes only from a spatial file; plus the reasons the other proposals name, Q-43, Q-65, Q-71, Q-125 and Q-129), and code writes the reason's sentence with the workspace's words. — SR-4 already says a label shows the workspace's word, a sentence that says "organization" beside a heading that says "Partner" would read as two different things, and a model must not be the one that words the interface (confidence: medium)
Answer:

**Q-99 [detail]. Asked once for the feature: the same thing twice. Can two identical entries both appear in a list, and what happens when one input holds the same thing twice?** Each change of a reading is compared with the record alone, never with the other changes of the same reading, and "Add N changes" does not look at the record at all. So in the prototype: (a) two identical performance measure entries in one reading (the same measure, reporting period, amount and answers, as when a report states a figure in two places) are both listed, both ticked, and adding saves two entries, so the measure's total counts the figure twice (stories 01, 04, 32); (b) one period's amount and a total to date for the same measure ("1,850 planted this year; 12,400 to date") are both proposed, and adding both puts 1,850 and 1,673 on the record; two totals to date for one measure are each filed as the full difference (story 13); (c) two values for one Key facts field are both proposed, both are added, and the one later in the list stands (story 15); (d) two contacts with one email are both proposed and added, and the project page shows one row (story 18); (e) two funding sources with the same name and organization in one reading (two awards of one grant) are both proposed, ticked, and after adding the project page keeps one row, in the first one's place, with the later amount, while the import counts two changes in its toast, its change history row and the review (story 17); (f) nothing looks at the record on "Add N changes", so the same happens when two imports add the same new funding source, or when the person edits a change into a match; and after "Undo" of one of two imports that added the same funding source, the row stays with the other import's amount (stories 41, 17); (g) a line the reading returns twice under "Not used" or "Skipped" is shown twice (story 19, with Q-129). For each: are both listed, is the second flagged, or are they folded into one (two rows, one row with the amounts added)? Adding a change the record already holds is Q-87, which now covers every kind of change. Related: Q-50, Q-87. Stories: 01, 02, 06, 13, 15, 18, 19, 32, 86.
Proposed: Nothing is saved twice by default, and nothing is dropped without the person seeing it. Three rules, then the lettered cases. Rule 1, "the same thing": two changes are the same thing when they are the same performance measure, reporting period and breakdown answers; the same Key facts field; the same contact (the test story 18 uses for "Already on file"); the same funding source name and organization (the test story 17 uses). Rule 2, inside one reading: code compares every change with the changes before it, not only with the record. Where the record can hold the thing once only (a Key facts field, a contact, a funding source row), two changes with the same value are folded into one change that shows the first place's quote and "Also stated: `<the other place>`". Where the record can hold it many times (performance measure entries), the later one is kept in the list but arrives flagged and unticked, its amount as read, with the reason "Also stated at `<place of the first>`. Tick it only if it is separate work." Two changes for the same thing with different values all arrive flagged and unticked, each naming the other's value. Rule 3, on "Add N changes": the record is looked at again at the press (Q-87), by the same tests. The import's count, in the button, the toast, the change history and the review, is the number of things it actually wrote. (a) Two identical performance measure entries in one reading: both listed; the first is ready, the second flagged and unticked as in rule 2. By default one entry is saved and the total counts the figure once. The person can still tick the second when the report really counts two pieces of work. The reading service is also required to return a restated figure once and to add separate lines of one table together (the adding of Q-118), so this is the net under it, not the usual path. (b) One period's amount and a total to date for the same measure: the period's amount is the change. The total to date is worked out against the record plus that amount. If nothing is left, it is not a second change; the period's change gains the line "Agrees with the report's total to date: `<total>`". If the two disagree (something is left over, or the record plus this report would exceed the total), the total to date is listed as a second change, flagged and unticked with an empty amount and a sentence stating the three figures ("The report says 12,400 to date. The record holds 10,727 and this report adds 1,850."), for the person to settle; as in Q-91, no arithmetic line is shown for a difference below zero. Two totals to date for one measure: the same total twice is one change (a total cannot be separate work); two different totals are both flagged and unticked with empty amounts. (c) Two values for one Key facts field: the same value twice is one change. Two different values are both listed, flagged and unticked, each saying "The report also gives `<other value>`." Ticking one unticks the other, so one value at most is added. (d) Two contacts with one email: one change, from the first place, with "Also stated: …". One contact is added and counted. (e) Two funding sources with the same name and organization: the same amount twice is one change (a grant restated in a summary and a table). Different amounts are both listed, flagged and unticked, each naming the other's amount. One at most can be ticked, and its amount can be edited, so two awards of one grant are entered as their sum by the person, never added up by the product on a guess. (f) Across imports and after edits: at the press, a ticked change that the record now holds with the same value is not written and not counted (a performance measure entry is unticked and marked, and may be ticked again on purpose, Q-87 (a); a Key facts field, a contact or a funding source loses its checkbox, Q-87 (c) to (e)); a ticked funding source whose row now exists with another amount becomes a change to that row's amount (Q-50), counted once; a change the person edited into a match is tested the same way. If the press would write fewer changes than the button said, nothing is saved, the affected changes are re-marked ("Already on file", or "Was `<amount>`"), and the person presses again on a true count. "Undo" takes back only what that import wrote: if a later import has changed the same funding source row, the row stays with the later import's amount and its "From `<document name>`" line names the later document; undoing the later import puts back the amount it found. (g) A line returned twice under "Not used" or "Skipped" is shown once (same text once case and outer spaces are ignored). — The product exists so that totals reported to funders are true: a figure counted twice is the worst failure it can have, and a repeat thrown away unseen is the second worst. Flagging keeps the person as the one who commits (confidence: medium)
Answer:

**Q-100 [detail]. The file control on the choose step: a held file taken out again, and several files dropped together.** Two things the prototype does only because of the shared file control it uses. (a) The control lists the held file with its name and size and a "Remove `<name>`" button; removing it leaves the control empty, and "Read it" then says "Choose a file, or switch to Paste text." Is taking a held file out again required, and is the size shown? (b) When several files are dropped on the control together, it holds the first one that is under the size limit and drops the others without a word (a too-large one is named in the size message). Should the person be told that only one was taken, or should the drop be refused? Related: Q-29 (several documents in one import), Q-69. Stories: 01, 08. It bears on story 10 (a file taken out leaves a message behind; see Q-104).
Proposed: (a) Yes: the held file is listed with its name and size and can be removed; the control is then empty, with no message until "Read it" is pressed. (b) A drop of several files is refused: nothing is taken, a file already held stays held, and the control says that one file is read at a time ("Drop one file at a time."). — One document per import is decided (spec #20), and taking "the first" of several picks a document the person did not choose (confidence: medium)
Answer:

**Q-101 [detail]. Does each imported entry get a row in the performance measures' own change log?** In the prototype every entry an import saves is written to the performance measures' change log exactly as a hand entry is (measure, reporting period, the new amount), and "Undo" writes a removal row. That log names no document, and it is separate from the project's change history, where an import is one row (story 22). Spec #5 says every change carries its source and the change log shows it. (a) Must each imported entry appear in the performance measures' change log? (b) If so, does the row name the document, and does the person's name on it match the import's? (c) Does "Undo" leave two rows there (added, removed) or none? Stories: 22, 23. It bears on stories 22 and 23.
Proposed: (a) Yes: each imported entry is a row in the performance measures' change log, like a hand entry. (b) The row names the document ("From `<document name>`") and carries the import's person and day. (c) "Undo" removes the import's rows; it leaves no added-then-removed pair. — Spec #5 says every change carries its source and the log shows it; story 23 already says an import taken back is no longer recorded anywhere (confidence: medium)
Answer:

**Q-102 [detail]. A file dropped on the project page, once the Import a report page is back on the choose step.** A dropped file is read at once (story 08). The page can then return to the choose step in two ways: its reading fails (story 10), or the person presses "Read another" (story 35). For a file chosen in the file control, the control still shows the file and "Read it" reads it again. For a dropped file the prototype keeps the file and reads it again on "Read it", but the file control shows no file, so the person presses "Read it" on what looks like an empty control. Should the control show the dropped file as if it had been chosen there (so it can be seen, replaced and read again), or should the dropped file be let go so the choose step is truly empty? Stories: 08, 35. It bears on story 10, R4 (the file is still held after a failed reading).
Proposed: The file control shows the dropped file as if it had been chosen there, with its name and size, so it can be seen, replaced, removed and read again. — "Read it" must never act on a file the person cannot see (confidence: high)
Answer:

**Q-103 [detail]. A file dropped on the project page that Import a report does not read** (an image, a spatial file). The prototype starts no import, which is decided. It also does nothing to stop the browser, and a browser given a dropped file it was not stopped from taking usually opens the file in place of the project page or in a new tab. So story 08 cannot say "the project page stays as it was". Must the project page swallow such a drop so nothing happens, say something ("That file can't be read as a report"), or leave it to the browser? Related: Q-69. Stories: 08.
Proposed: The project page swallows every dropped file, so the browser never opens one in place of the page. A file Import a report does not read starts nothing, the page stays as it was, and a toast says why: for a spatial file, that shapes are added with Upload shapes; for anything else, "That file can't be read as a report." — Losing the project page to a stray drop is a loss of the person's place, and a drop that does nothing reads as broken (confidence: medium)
Answer:

**Q-104 [detail]. The messages under the file control: when does each go, and can two show at once?** The choose step has three: "Choose a file, or switch to Paste text." and "Couldn't read `<name>`. `<reason>`" are the page's; "File exceed 20 MB limit: `<name>`" is the shared file control's own. In the prototype: (a) choosing a too-large file while another file is held leaves the held file in place, so "Read it" reads the earlier file while the size message names the later one; (b) the size message can show together with either of the page's messages, on two lines; (c) the size message stays until the control is next given a file, so it is still there after a reading and "Read another"; (d) removing the held file from the control removes neither kind of message, so "Couldn't read report.pdf." can sit under an empty control. What is the rule: one message at a time, and which wins; does a too-large file put out the file already held; and does every message go when the control's content changes? Related: Q-47, Q-83, Q-96 (the same question for the messages on "Add N changes"), Q-108. Stories: 10.
Proposed: One message at a time under the file control; the latest event's message replaces the one before it. (a) A too-large file is refused and does not put out the file already held, which stays listed by name; the size message names the refused file. (b) So the size message and a page message never show together. (c) and (d) Every message goes when the control's content changes (a file chosen, replaced or removed), when a reading starts, and when the person switches between "File" and "Paste text"; none survives a reading and "Read another". — A message must describe the control as it is now; a stale one under an empty control is false (confidence: medium)
Answer:

**Q-105 [detail]. A reading of pasted text that fails: what is shown, and where?** Story 10 says what a failed reading of a file shows: back on the choose step, "Couldn't read `<file name>`." and the reason, under the file control. Pasted text has no file name and no file control in view. The prototype builds "Couldn't read your report." with the reason and writes it under the file control, which is hidden while "Paste text" is chosen, so the person sees the choose step with their text and no message at all; only the announcement to assistive technology is made. What is shown, in what words, and where (by the text area, as "Paste the report text first." is)? The pasted text is still in the text area and "Read it" can be pressed again; confirm. Related: Q-41. Stories: 09.
Proposed: The message shows by the text area, where "Paste the report text first." shows: "Couldn't read the pasted text. `<reason>`". The text stays in the text area and "Read it" reads it again. It is announced once and goes when the text is edited or a reading starts. — Today the message is written where nobody can see it (confidence: high)
Answer:

**Q-106 [detail]. Handing a spatial file to Upload shapes: what is handed, and what if it is not taken?** Import a report calls six endings spatial (.shp, .zip, .geojson, .kml, .kmz, .gpkg) and its file control refuses anything over 20 MB. Upload shapes, as prototyped by `work-areas`, takes a .zip only (a zipped shapefile or geodatabase), up to 50 MB. (a) Is a .geojson, .kml, .kmz, .gpkg or bare .shp handed over although Upload shapes would refuse it, or does the box say something else for those? (b) A spatial .zip between 20 and 50 MB is refused by Import a report for its size before it is seen as spatial, though Upload shapes would take it: which limit applies to a file that is only passing through? (c) When Upload shapes refuses the handed file, where is the person told: there, or back on Import a report? (d) After Upload shapes, is the person on the project page, or returned to Import a report? (e) Every .zip counts as spatial whatever it holds, so a zipped report is turned away too: intended? Related: Q-70 (when the file is passed, and what becomes of it if the link is not followed). Stories: 11.
Proposed: Upload shapes' own list and limit decide what is handed over; Import a report keeps no second list. Today that is a .zip (a zipped shapefile or a zipped .gdb folder) up to 50 MB. (a) Two groups. A .zip is handed to Upload shapes. A .geojson, .kml, .kmz, .gpkg or bare .shp is not handed over, because Upload shapes would refuse it: the box still shows "That's a spatial file", says what Upload shapes takes (a zipped shapefile, with its .shp, .shx, .dbf and .prj together, or a zipped .gdb folder), and its link opens Upload shapes empty. If `work-areas` later takes more kinds, they move to the handed group with no change here. (b) Whether a file is spatial is decided before its size. The 20 MB limit is for reports only. A .zip is held up to 50 MB, Upload shapes' limit, and one over 50 MB is refused with a message naming that limit. The five endings that are not handed over are never held, so no size applies to them. (c) A handed file that Upload shapes refuses is refused there, in Upload shapes' own "This file was not accepted" message, exactly as if the person had chosen it there. (d) After Upload shapes, finished or cancelled, the person is on the project page. They are not returned to Import a report; nothing was read, so nothing is waiting there. (e) Yes, every .zip goes that way, because Import a report reads no .zip. But the box does not call a .zip a spatial file: it says a .zip is not read here, that shapes in it are added with Upload shapes (the link), and that a zipped report should be unzipped and chosen as itself. — One owner for the list (`work-areas`), no file sent to a flow that will refuse it, and no limit applied to a file that is only passing through (confidence: medium)
Answer:

**Q-107 [detail]. The "That's a spatial file" box while "Paste text" is chosen.** With a spatial file held, the person can switch to "Paste text" and read pasted text; the held file is ignored, which is decided (story 09, R4). In the prototype the box stays in view above the text area, because it sits outside the part of the page the switch hides. Should the box be hidden with the file control and come back when the person returns to "File", or stay? Stories: 11. It bears on story 09.
Proposed: The box is hidden with the file control while "Paste text" is chosen and comes back, with the held file, when the person returns to "File". — The box is about the held file, which "Paste text" ignores (confidence: high)
Answer:

**Q-108 [detail]. "Paste the report text first." when the person types, or switches away and back.** Switching between "File" and "Paste text" removes the messages under the file control for good. The text area's message is only hidden with the text area: switch to "File" and back, and it is there again, until "Read it" is pressed with text. It also stays while the person types. Is the message cleared for good on a switch (as the file control's are), and should it go as soon as text is typed? The prototype does not announce this message at all. Related: Q-83, Q-96, Q-104. Stories: 09.
Proposed: The message goes as soon as text is typed or pasted, and is cleared for good on a switch between "File" and "Paste text". It is announced once when it appears. — The same rule as the file control's messages: a message goes when its cause does (confidence: high)
Answer:

**Q-109 [detail]. When is the right to edit checked, once the Import a report page is open?** Story 12 says a person who cannot edit the project is offered no entry point and cannot open the page. The prototype checks nothing, and no source says what happens to a person who could edit the project when they opened the page and cannot when they press "Read it" or "Add N changes" (their role changed, the project's lead organization changed, a shared project was withdrawn). (a) Is the right checked again on "Read it" (before a document is sent to be read) and on "Add N changes" (before anything is saved)? (b) If it is gone, what does the person see, and is the reading discarded? (c) Does the same answer hold for someone with no account who opens the address: sign-in first, then the page? Related: Q-39, Q-48, Q-77. Stories: 01, 12, 83. It bears on stories 01 and 02 (the reading and the save).
Proposed: (a) The right to edit the project is checked when the page opens, again on "Read it" before the document is sent, and again on "Add N changes" before anything is saved. (b) If it is gone, nothing is sent or saved, the reading and its document are discarded, and the person sees what story 12 shows anyone who cannot edit the project, with one line saying nothing was added. (c) Someone with no account is taken to sign in first; then the page opens if they can edit the project, and otherwise they see the same as (b). — A page left open must not outlive the right it was opened with, and a document must not be sent to be read for someone who may no longer see it (confidence: high)
Answer:

**Q-110 [detail]. The tally after the person ticks and unticks.** The prototype's four parts are: "ready to add" = every ticked change; "need you" = flagged changes that are unticked; "already on file" = every change the record holds, ticked or not; "kept by a data source". Four things follow that nobody decided. (a) A ready change the person unticks is counted in no part, so the parts no longer add up to the changes listed, and with everything unticked the line is empty (the crew log with all six unticked shows nothing above the changes). Should an unticked ready change be counted somewhere, and what does the line read when every part is zero? (b) A change that is "Already on file" and ticked is counted twice, under "ready to add" and under "already on file". Intended? (c) A flagged change ticked by hand moves from "need you" to "ready to add" although its amount may still be empty and its badge still shows (the badge is Q-122). Intended? (d) The wording for a count of one: the prototype writes "1 need you". Related: the prototype's known double count of a kept field whose value equals the record's. Stories: 04, 06, 32.
Proposed: Every change is counted in exactly one part, so the parts always add up to the changes listed. (a) A ready change the person unticks is counted under a fifth part, "`<N>` left out", placed after "need you"; the line is therefore never empty while changes are listed. (b) A change already on file is counted once: under "ready to add" while ticked, otherwise under "already on file". (c) Yes: a flagged change ticked by hand counts under "ready to add", so that part always equals the number on "Add N changes"; an empty amount is caught when the button is pressed (story 30). (d) One reads "1 needs you". A kept field whose value equals the record's counts under "kept by a data source" only. Only a performance measure entry can be ticked while already on file (Q-87). "Need you" holds every change that arrived unticked and waits on the person: flagged changes, repeats (Q-99) and the changes of a report that names another project (Q-63). "Left out" holds a change that arrived ticked, or was dealt with, and that the person unticked. "Kept by a data source" appears only once a data source exists (Q-17). — A tally that does not add up, or that says two different numbers for what will be added, teaches the person to ignore it (confidence: medium)
Answer:

**Q-111 [detail]. Selecting a change by keyboard, and telling assistive technology.** A change is selected by a click anywhere on it or by keyboard focus entering one of its controls; the document pane then moves. (a) A change with no control cannot take focus: a field kept by a data source has no checkbox, and on a wide screen no "Show source", so a keyboard user can never see where it was read from. The same is true of every change in the walking skeleton before stories 06 and 07 add a checkbox and fields. How is such a change selected by keyboard? (b) The selected change is shown by a background tint alone, and nothing announces that the selection or the document moved. Must the selection be exposed to assistive technology, and how? Related: Q-68, Q-83. Stories: 04.
Proposed: (a) A change with no control of its own takes keyboard focus itself, as one stop in the list's order, and focus selects it; a change with controls is selected when focus enters one, as now. (b) The selected change is marked as the current item for assistive technology, not by tint alone. The move of the document pane is not announced: it follows every focus move and would be noise; the pane is already a named region the person can go to. — Every change must be reachable and its selection perceivable without a pointer or colour (confidence: medium)
Answer:

**Q-112 [detail]. A narrow screen while the document is showing on the check step.** On a screen 64rem or narrower "Show source" puts the document in place of the changes, and the page's actions stay in the top bar. (a) "Add N changes" can be pressed there. If story 30's check stops it, the messages are on fields that are hidden and the change brought "into view" is hidden too, so the person presses and nothing visible happens. Should the action be unavailable while the document shows, or should a stopped import return the person to the changes at the first failing one? (b) If the window is widened past 64rem while the document shows, both columns appear; the prototype then still treats the document as open, so narrowing the window again shows the document and not the changes. Should widening close it? Related: Q-68. Stories: 05, 30.
Proposed: (a) "Add N changes" stays available while the document shows. If the import is stopped, the document closes, the changes come back at the first failing one, and focus goes to its failing field. (b) Widening the window past 64rem closes the document, so narrowing again shows the changes. — A press must never leave the person with no visible result (confidence: high)
Answer:

**Q-113 [detail]. What may be typed into an amount: a performance measure change's "Amount", and a funding source's "Secured ($)" and "Grant or program".** Both amount fields take any text and arrive as plain digits (1850; 48000). On "Add N changes" commas, spaces and a "$" are dropped and the rest must be a number above zero. (a) Decimals of a performance measure amount: a measure has a setting for decimal places (whole numbers, 1, 2 or 3 places), and the import ignores it, so 1850.5 plants is accepted and saved as typed. Must the amount be held to the measure's decimal places, and is a figure with more rounded or refused, with what message? (b) Decimals of a funding source amount: the prototype accepts and saves them as typed, although every screen that shows the saved amount rounds to whole dollars (the Funding sources row, the import's recorded value) while "Total from all sources" adds the unrounded amounts. Whole dollars only, or cents kept; if whole, is 12500.50 rounded or refused? (c) Is there an upper limit on either amount, and a longest "Grant or program"? (d) Do the fields show thousands separators, on arrival and as typed? Today neither does; separators appear only in the imported change's value and in the arithmetic line. (e) The prototype also drops a "$" from a performance measure amount and reads "1e3" as 1000; presumably neither is wanted. Related: Q-47, Q-123. Stories: 01, 07, 14, 17, 30, 65, 81.
Proposed: (a) A performance measure amount is held to the measure's decimal places. A figure with more is refused when "Add N changes" is pressed, with a message naming what the measure takes; it is never rounded for the person. (b) "Secured ($)" is whole dollars. A figure with cents stops the import with a message; it is not rounded. (c) Each field has the limits of the hand-entry field for the same value on the project page; where none is set, an amount is below one trillion and "Grant or program" is at most 200 characters. (d) Both amounts show thousands separators on arrival and again when the person leaves the field, and accept them typed. (e) Neither is wanted: a measure amount accepts digits, separators and one decimal point only, so "$" and "1e3" are refused; a "$" is accepted in the dollar field alone. — Never save a value the measure cannot hold, and never change a typed figure in silence (confidence: medium)
Answer:

**Q-114 [detail]. The reporting period of a performance measure change, in two cases.** (a) The reading proposes a period the project does not offer (an open period, or a year the project has none for). Enabler 02 says the reading must not, and the check that would catch it is enabler 50, `later`. In the first release the prototype shows "Reporting period" empty, checks nothing, and saves the entry under the period the reading named. What should the change show, and should "Add N changes" stop on it ("Pick a reporting period.")? (b) When the person picks another period, the change's label keeps the one it arrived with ("… · 2025" over a field holding 2024), while the entry and the import's record use the one picked. Should the label follow? Related: Q-43. Stories: 06, 07, 14, 30, 50.
Proposed: (a) A change whose period the project does not offer arrives flagged and unticked, "Reporting period" empty, with the reason naming the period the report gives. A ticked change with no period stops "Add N changes" with "Pick a reporting period." An entry is never saved under a period the project does not offer. (b) Yes: the change's label follows the period picked. — Saving a figure under a period nobody can see on the page is a silent wrong total (confidence: high)
Answer:

**Q-115 [detail]. A breakdown answer, in two cases.** (a) Once a breakdown choice holds an answer, the person can pick another but cannot set it back to unanswered, only because the select the prototype uses has no empty choice. A breakdown answer is not required, and the reading may have answered wrongly or by inference (Q-90). Should each choice offer a way back to unanswered? (b) The reading returns an answer that is not one of the question's options (an option since retired, or a wording of its own). Enabler 50 drops such an answer, `later` (Q-149 asks whether the person is told). In the first release the prototype shows the choice empty and still saves the answer. Should it arrive unanswered? Stories: 07, 50.
Proposed: (a) Yes: every breakdown choice offers an empty choice, so an answer can be set back to unanswered. (b) An answer that is not one of the question's options arrives unanswered and is never saved; a note on the change says what the report said ("The report says “`<answer>`”, which is not an option."). The change stays ready. — An answer outside the list is an invalid value, and one dropped without a word hides what the document said (confidence: high)
Answer:

**Q-116 [detail]. What counts as "changed from the document's figure" and "filled in after arriving empty", in cases the prototype settles by accident.** (a) A change the report supports two readings of arrives with one written in (6 acres) and the other in its note (12). The person types 12: recorded as changed from the document's figure, though 12 is the document's too. Right? (b) A funding source whose name the person changed only in capitals is recorded as changed. Right? (c) A change that arrived empty which the person first ticked by hand and then typed a figure into is recorded as neither filled in nor changed, because "filled in" is set only when the typing does the ticking. Should any figure typed into a change that arrived empty count as filled in? (d) A total to date with nothing left, typed into: asked as Q-121 (a). The answers reach `publish-review`, build 2, which words the two markers. Related: Q-33, Q-92. Stories: 36.
Proposed: Both markers are worked out when "Add N changes" is pressed, by comparing what arrived with what is added, not from the order of clicks. (a) A change the report supports two readings of is recorded as filled in after an unsure reading, whichever figure the person ends with, and not as changed from the document's figure. (b) No: a name that differs only in capitals or outer spaces is not recorded as changed. (c) Yes: any change that arrived with an empty amount and is added with a figure is recorded as filled in, however it came to be ticked. (d) As Q-121 (a). — The markers tell a Manager which figures a person stood behind alone, so they must not depend on which control was touched first (confidence: high)
Answer:

**Q-117 [detail]. A change that carries no page and points at no passage: what does the document pane show?** Every change has a quote; the page and the passage are optional. The same pane is used on the check step (story 31) and beside the review (story 33). The rule written in the code is that with nothing to point at the document shows from its start, and that is what happens when the document is first opened from such a row in the review. But when the pane is already showing another change's place, selecting or pressing a change with no place leaves it there: a PDF stays on the earlier change's page, a document held as passages loses its mark and does not move, and nothing says the place is not this change's. (a) What should the pane show: the top of the document, a line saying the place is not known, the quote? (b) Should it go back to the start when moved to such a change, on both screens? (c) A PDF the person has scrolled away from does not return when they select another change read from the page the pane last opened at; should selecting always bring the place back, as it does for passages? Depends on Q-66 (b) for how often a change has no place. Stories: 04, 31.
Proposed: (a) and (b) Selecting a change with no place takes the pane to the document's start on both screens, clears any mark left from another change, and shows one line in the pane: "No place marked for this change." The quote is on the change itself. (c) Yes: selecting a change always brings its place back, in a PDF as in passages, even when the pane last opened at the same page. — A pane left on another change's passage shows the wrong evidence for a figure (confidence: medium)
Answer:

**Q-118 [detail]. Arithmetic the first release does, and how it is shown.** (a) Adding lines is the one calculation left in the first release. The developer-machine reader returns the sum as a line ("3.5 + 2 = 5.5 ac"), which the page would print under the label "Converted:"; the recorded crew log row C1 (rows 4 and 6 added to 5.5) shows no arithmetic line at all. Is the sum shown to the person, and under what label? Q-82 (d) asks the same of the pasted paragraph's multiplication. (b) The reader rounds every amount to two decimals, converted or not (3.456 acres for a measure in acres arrives as 3.46). Is that a requirement of the first release, and does it hold when the measure allows three decimal places? Related: Q-82, Q-95, Q-113. Stories: 02, 04, 13, 26.
Proposed: (a) Yes: the sum is shown under the quote with the label "Added:" ("Added: 3.5 + 2 = 5.5 acres"). "Converted:" is kept for unit conversion alone. The recorded crew log row C1 gains its line. Adding lines is the only arithmetic of the first release: nothing is converted and nothing is multiplied (Q-82). (b) No: the first release rounds nothing. A figure arrives as the document writes it, sums and differences are exact, and the measure's decimal places are enforced on adding (Q-113 (a)). — Arithmetic the person cannot see cannot be checked, and rounding is a change to the document's figure (confidence: medium)
Answer:

**Q-119 [detail]. Which layout does a screen exactly 64rem wide get?** The Import a report page goes to one column at `max-width: 64rem`, as the mobile foundation spec writes its tablet gate, so exactly 64rem is narrow. The review's document pane uses `min-width: 64rem`, so there exactly 64rem is wide. Stories 04, 05 and 31 follow the page's code ("wider than 64rem" is two columns), and story 80 follows the review's ("64rem wide or more" is two columns). Is the boundary inclusive on the narrow side everywhere? Stories: 05. It also decides the wording of story 04, R1 and story 80, R1 and R2.
Proposed: Exactly 64rem is narrow everywhere. The review's document pane changes to two columns only above 64rem. — The mobile foundation spec writes the gate as "64rem or narrower", and it is the written source (confidence: high)
Answer:

**Q-120 [detail]. What is a total to date compared with?** The prototype subtracts the measure's whole reported figure: every entry, in every reporting period, open ones included. (a) All seven sample measures add up. For a measure whose values do not add up (the project page shows its latest entry, not a sum), is a total to date compared with that latest figure, proposed as it stands, or flagged? (b) A report dated September 2025 states a total as of then. If the record already holds entries for a later period, the difference is too small. Are only entries up to the change's reporting period counted? Related: Q-91. Stories: 13.
Proposed: (a) A total to date is filed as a difference only for a measure whose values add up. For any other measure the figure is proposed as it stands, as that period's entry, with no arithmetic line. (b) Yes: only entries filed under reporting periods up to and including the change's period are counted, and when the record holds later entries the line says so ("… on record through `<period>`"). — A difference from a figure that is not a sum is meaningless, and a difference against later work understates what the report adds (confidence: medium)
Answer:

**Q-121 [detail]. A total to date after the person acts on it.** (a) A change with nothing left arrives "Already on file" with an empty amount. In the prototype, typing a figure into it ticks it and records it as "filled in after arriving empty", exactly as for a flagged change (story 14, R6; story 36, R5), though the reading was not unsure of anything. Should a typed figure tick it, and is it recorded as filled in? (b) The arithmetic line is written once. After the person changes the amount of a change filed as a difference, the line still reads "12,400 to date − 10,727 on record = 1,673" beside another figure. Does it stay, go, or say that the figure was changed? Related: Q-116. Stories: 13, 36.
Proposed: (a) Yes, a typed figure ticks it, and it is recorded as changed from the document's figure, not as filled in: the document's own arithmetic left nothing to add. (b) The arithmetic line stays as the document's arithmetic and gains what the person entered ("… = 1,673. You entered 1,500."); the addition goes if the figure is set back. — The person may add it, but a Manager must be able to see that the figure is theirs and not the report's (confidence: medium)
Answer:

**Q-122 [detail]. A flagged change the person has dealt with: do the badge and the reason go?** In the prototype the badge ("Needs a decision", "No match", "Not in this workspace"), the reason or sentence and the note stay on a flagged change after the person has dealt with it, for as long as the check step is open. (a) A flagged performance measure change whose figure the person filled, or which they ticked: do the badge and the reason go once it is ticked, and do they come back if it is unticked? (b) A funding source flagged "Not in this workspace" once the person has picked an organization: do the badge and the sentence "“`<name>`” isn't an organization here. Pick one, or leave this out." go? In the prototype a change unticked after the pick is counted under "need you" again although it has its organization, and picking another organization ticks it again. Related: Q-61, Q-110 (c). Stories: 14, 65, 75.
Proposed: (a) The badge goes when the change is ticked and comes back when it is unticked. The reason and the note stay throughout, because they explain the figure. (b) Once an organization is picked, the badge and the sentence go and do not return while one is picked; unticked after that, the change counts under "left out", not "need you". A picked organization can be changed but not cleared (Q-131 (d)). — A badge that says "waits on you" on a change the person has dealt with hides the ones that still wait (confidence: medium)
Answer:

**Q-123 [detail]. Which typed figures tick an empty flagged change?** The tick reads the figure with commas removed, so "1,000" ticks and "1 000" or "$40" does not; "Add N changes" removes commas, spaces and a dollar sign, so it accepts all three. Should both read a figure the same way? Related: Q-92, Q-113. Stories: 14, 30.
Proposed: Yes. One reading of a typed figure decides both ticking and adding: outer spaces are trimmed, commas and spaces between digits are ignored, and a "$" counts only in a dollar amount. So "1 000" ticks a measure change, and "$40" in a measure amount neither ticks nor adds. — Two readings of one field make a figure valid in one place and invalid in the other (confidence: high)
Answer:

**Q-124 [detail]. How exactly is a Key facts value compared with the record's?** The prototype compares the two texts letter for letter, so "el dorado" or "El Dorado County" against "El Dorado" is a ready change that replaces the value, while a funding source's name and a contact's email are matched ignoring capitals and outer spaces. Should a value that differs only in capitals or spacing be "Already on file"? For a choice field or a custom field of another type, is the comparison made on the option, the number or the date, not the text? Related: Q-71. Stories: 15.
Proposed: A value is compared by its field's type. Text: ignoring capitals, outer spaces and repeated spaces, so "el dorado" is "Already on file" against "El Dorado" and "El Dorado County" is not. A choice field: by the option. A number: as a number. A date: as a date. A Timeline: as its two years. — The same matching the product already uses for a funding source's name and a contact's email, and a re-capitalised value is not a change worth a Manager's review (confidence: high)
Answer:

**Q-125 [detail]. A Timeline when the report states one year.** A Timeline change sets the start year and the completion year together. The sample funder report says only "Completion: September 2025", and the recorded reading proposes 2023–2025: the start year is the record's. Nothing says who fills in the missing year. The page tells the developer-machine reader the field's current value, but the reader does not pass it to the model. Is the missing year always the record's, and is that done by the reading service or in code afterwards? If the record has no Timeline yet, is a one-year Timeline proposed at all? Stories: 02, 15, 19, 50.
Proposed: The reading service returns only the year the report states. Code fills the other year from the record, after the reading, and the change shows both with "Was `<the record's Timeline>`". When the record has no Timeline, a one-year Timeline is not proposed as a change: it is listed under "Not used" with the reason that the project has no other year to pair it with. A pair that would end before it starts is a value that does not fit its field (Q-71). — The model reads and code computes; a year the report never stated must not look as if the report stated it (confidence: medium)
Answer:

**Q-126 [detail]. What a change kept by a data source shows.** (a) When the value read differs from the record's, the prototype shows "Was `<the record's value>`" beside it, which reads as if the value were about to be replaced; nothing will be. Is "Was …" shown on a kept change, or other words (for example the record's value named as the source's)? (b) "Change it there." is plain text. Should "there" lead somewhere (the source's settings, the GIS system), and for whom, since a Contributor may not be able to open either? (c) When every change of a reading is kept, no change has a checkbox and the commit action reads "Nothing ticked", disabled. Are those the right words when there is nothing to tick? (d) If Q-71 or Q-63 ever makes a Key facts change flagged, does kept still win, with no flag badge? The prototype would draw both badges. Stories: 06, 16.
Proposed: (a) No "Was …" on a kept change. When the value read differs, the line names the record's value as the source's: "`<source name>` has `<record's value>`. Change it there." (b) "there" stays plain text: a Contributor may not be able to open the source's settings, and the GIS system is outside the product. (c) When no change has a checkbox the action reads "Nothing to add", disabled; "Nothing ticked" is kept for when something could be ticked. (d) Kept always wins: one badge, "Kept by a data source", and no flag badge. — "Was" promises a replacement that will not happen (confidence: medium)
Answer:

**Q-127 [detail]. What `gis-data-sources` answers, for a field kept by a data source.** The prototype reads one workspace-wide setting and the first GIS subscription, so none of these arise in it. (a) Can two sources supply the same field of one project, one authoritative and one not? If so which wins, and which is named in "Kept by `<source name>`"? Story 16 assumes one answer per field. (b) Can a data source supply a custom field? The story treats a custom field like a built-in one. (c) If the answer is not known when the check step opens (the feature is slow or down), is the change proposed as ordinary, held back, or is the reading stopped? (d) Kept is worked out when the check step opens. If the source becomes authoritative, or starts supplying the field, before "Add N changes" is pressed, must adding refuse the change? In the prototype it is added. Related: Q-48, Q-56, Q-57. Stories: 16.
Proposed: (a) No: one source supplies a field at a time. Spec #27 switches the narrower mapping off, and `gis-data-sources` refuses a second subscription mapping to a field another already supplies, so "Kept by `<source name>`" has one answer. (b) Yes: a data source can supply a custom field, and it is kept like a built-in one. (c) If the answer is not known when the check step opens, the change is proposed as ordinary; the guard is the check at the press. (d) Yes: kept is checked again when "Add N changes" is pressed. If a ticked field is now kept, nothing is saved, the change turns to kept, and the person presses again on a true count; if the answer still cannot be had, the import stops with a message to try again. — An authoritative source's lock must hold against an import exactly as it holds against a hand edit (confidence: medium)
Answer:

**Q-128 [detail]. Contacts the reading returns incomplete, and a contact that matches two people.** (a) With no role, the check step's label reads "Contact · " in the prototype, with a trailing separator, while the project page labels the row "Contact". Is the check step's label "Contact" alone? (b) With no organization, the first line reads "`<name>`, " with a trailing comma; the project page drops the organization line. What does the check step show? (c) "Matches `<name>` in this workspace." names the first person in the workspace's list whose email or name matches. When the email is one person's and the name another's, or two people share the name, which is named, and is a name-only match worth saying at all? Related: Q-34, Q-73. Stories: 18.
Proposed: (a) "Contact" alone, with no separator. (b) The name alone, with no trailing comma. (c) An email match wins and names that person. With no email match, a name match is said only when exactly one person in the workspace has that name; when two share it, nothing is said and the line reads "No invitation is sent." — Spec #14 matches by email or name, and naming one of two people with the same name states a guess as a fact (confidence: high)
Answer:

**Q-129 [detail]. What "Not used" and "Skipped" must hold.** (a) Story 19 says nothing the report states is silently dropped, but the developer-machine reader asks the model to keep "Not used" to "the notable ones". Is the list every quantity, attribute and party the import did not use, or a selection, and if a selection, what is the person told? (b) The reader asks for a reason "in a few words" with each skipped item, and the budget table has one; the crew log's recorded reading skips "Row 14, “TOTAL”." with none. Must every skipped item carry a reason, and what besides a budget table and a total row belongs there? (c) Several skipped items are run together in one "Skipped:" line. Is one line right for many items? A line returned twice is asked in Q-99 (g). Stories: 02, 19.
Proposed: (a) Every quantity, attribute and party the report states about the project that the import did not use is listed; the reading service is asked for all of them, not "the notable ones", and the page makes no further claim. (b) Every skipped item carries a reason from the fixed set (Q-98 (d)). "Skipped" holds parts of the document passed over on purpose: a budget or spend table, a total or subtotal row (already counted in the rows above), and a part about another project. (c) One item per line, as a list like "Not used", not run together. — Story 19 promises nothing is silently dropped; a selection breaks that promise without saying so (confidence: medium)
Answer:

**Q-130 [detail]. After adding the changes of a report that names another project, is anything recorded?** The warning exists only on the check step. Nothing is kept with the import, so the change history, the review and the note show no sign that the document was about another project, and the Manager who publishes is not told. Should the import record it, and should the review (stories 24, 21) show it? Related: Q-63, Q-74. Stories: 20, 22, 24. Stories 24 and 22 lean on the answer.
Proposed: Yes. The import records that the report named another project, and the name as the report writes it. The review shows it above that import's changes, with the note when there is one: "This report names another project: “`<name>`”." The change history row is unchanged. — The Manager who publishes stands behind the figures and must know the document may be about other work (confidence: medium)
Answer:

**Q-131 [detail]. Which organizations does "Organization" on a funding source change offer and match against, and in what order?** The prototype uses all 38 of the sample workspace, whatever their visibility and whichever the person belongs to, in the directory's order (lead organizations A to Z, then funders A to Z, then the rest), with no typing to find one, no empty choice, and no way to clear a pick; the sample has no connected organization. (a) Are connected organizations offered and matched like the workspace's own? (b) Is any organization left out? (c) In what order, and can the person type to find one? (d) Can a picked organization be cleared? Stories: 17, 75, 81.
Proposed: (a) Connected organizations are offered and matched exactly like the workspace's own, since a connected workspace acts as an organization (ADR 0002). (b) The list is every organization the person can see in the workspace's organization directory, whichever they belong to; nothing else is left out, and the report's name is matched against that same list. (c) The list is in one order, A to Z by name, and the person can type to find one. (d) A picked organization can be changed to another but not cleared; a funding source is left out by unticking it, as story 75, R1 says — a funder is rarely the person's own organization, so the list cannot be narrowed to theirs, and typing is needed at 38 or more names (confidence: medium)
Answer:

**Q-132 [detail]. A funding source the report names with no organization, or with no amount.** No recording has one. Is it proposed? With no organization, is it "Not in this workspace" (the sentence would read "“” isn't an organization here") or flagged in other words? With no amount, does it arrive flagged and empty like an unsure figure (story 14)? Related: Q-33, Q-89. Stories: 75.
Proposed: Both are proposed, flagged and unticked, never dropped. With no organization, "Organization" arrives empty and the change reads "The report names no organization for this funding source. Pick one, or leave this out." (it does not use the "Not in this workspace" sentence, which would quote an empty name). With no amount, "Secured ($)" arrives empty and the change reads "The report gives no amount for this funding source.", as an unsure figure does in story 14; typing an amount and picking an organization make it ready. A funding source is never added without both — nothing the report states is dropped silently, and nothing arrives as a guess (spec #13) (confidence: high)
Answer:

**Q-133 [detail]. How a funding source's name and organization are matched: two rules nobody wrote down.** Story 17 states them as R7 and R8 awaiting this answer. (a) Names match letter for letter, ignoring upper and lower case and spaces at either end; "CA Watershed Restoration Board" does not match "California Watershed Restoration Board", so a report that abbreviates a funder is flagged "Not in this workspace" and an abbreviated grant is not "Already on file". Is exact matching the rule, or should a near match be offered (and how)? (b) Where two of the workspace's organizations differ only in capitals, the first in the list is taken. Can that occur? (c) "Already on file" is worked out once, when the check step opens: after the person edits the name or picks another organization, the badge neither appears nor goes. Confirm, or should it follow the edit? Q-87 and Q-48 ask whether the check is made again on "Add N changes". Stories: 17, 86.
Proposed: (a) Exact matching is the rule: letter for letter, ignoring upper and lower case and spaces at either end. No near match is offered or suggested; an abbreviated funder arrives "Not in this workspace" and the person finds the right one by typing in "Organization" (Q-131). (b) It cannot occur: two organizations of one workspace may not have names that differ only in capitals, which `organizations-admin` holds; if a match were ever ambiguous the change is flagged for the person to pick. (c) "Already on file" follows the edit: it is worked out again whenever the person changes the name or the organization, and once more when "Add N changes" is pressed — a near match is a guess presented as a fact, and a badge that no longer describes the change misleads (confidence: medium)
Answer:

**Q-134 [detail]. Can a project's record hold a funding source whose organization the workspace does not hold?** (The organization was removed or renamed after the funding source was entered, or it is a connected organization's.) In the sample it cannot: every funding source is built from the organization directory. The prototype's code would show such a change as "Already on file" only, with no "Not in this workspace" badge or message. If the case can occur, is that the rule? If an organization can be renamed, matching by name alone (Q-133) also stops finding it. Related: Q-16 (nobody owns the funding source's lifecycle). Stories: 17, 81.
Proposed: The case cannot occur, so no rule is needed for it. A funding source on the record points at its organization, not at the organization's name as text: a rename follows through, a connected organization counts as held (Q-131), and an organization named by a funding source cannot be removed while it is. "Already on file" therefore compares the funding source's name and the organization the report's name was matched to, not two pieces of text — matching text against text is what breaks on a rename (confidence: medium)
Answer:

**Q-136 [detail]. Who may read the document's name?** Enabler 03, R5 (from spec #19) says nobody but the people who can edit or publish the project receives anything of the document, "not its content and not its name". But the name is written in the change history ("6 changes from deer-creek-crew-log-2025.xlsx", story 22), under a funding source and a contact on the project page ("From …", stories 17 and 18) and in the review (story 24), and the prototype keeps those lines after a publish (Q-76). (a) Does a Viewer, or anyone who can see the project page or open its change history without being able to edit or publish, see the name? (b) After a publish, does the "From …" line reach the public page? (c) If the name must be hidden from them, what do they see in its place: the row without the line, "From a document", nothing? Related: Q-39, Q-76 (a), Q-81 (d). Stories: 17, 18, 22, 24, 81. It bears on stories 18 and 24.
Proposed: One rule: the document's name is part of the document, so it is shown only to people who can edit or publish the project, on every screen, before and after a publish. (a) Anyone else, a Viewer included, never sees the name. (b) The "From …" line never reaches the public page or any published view. (c) In its place: a funding source or contact row is shown without the line; a change history row reads "`<N>` changes from a document", for a file and for pasted text alike. The name is also left out of the data sent to those people, not only hidden on screen — it is what spec #19 and enabler 03, R5 already say; file names often carry a funder's or a person's name (confidence: high)
Answer:

**Q-137 [detail]. "Undo" when what the import added has changed since, or cannot all be taken back.** Q-75 (a) asks this for a Key facts field edited by hand. The same toast allows: (a) a performance measure figure the import added was then corrected by hand: in the prototype the correction replaces the entries for that measure, reporting period and answer with one new entry, so "Undo" no longer finds the import's entry and the corrected figure stays whole, the imported amount still in it (the opposite of the Key facts case, where the hand edit is lost); (b) an entry the import added was already removed by hand: the prototype passes over it; in both cases the toast still says "`<N>` changes removed" with the import's full count; (c) the same for a funding source or a contact, if they can be edited (Q-135); (d) the import was already taken back from another window: the prototype closes the toast and says nothing; (e) part of the "Undo" fails: all or nothing, and what is the person told (Q-44 asks this for adding)? An answer would take story 23 past eight scenarios. Stories: 41, 81, 84, 86.
Proposed: The Undo rule at the top of this file. (a) A performance measure figure corrected by hand since the import stands whole, as the person's own figure; "Undo" does not touch it. (b) An entry already removed by hand is passed over. (c) The same for a funding source or a contact: one edited by hand since stays, and loses its "From …" line because its import is gone; one already removed is passed over. In (a) to (c) the toast counts what was really removed and says what stayed: "4 changes removed. 2 you changed since were kept." When nothing is left to remove it reads "Nothing removed. You changed every one since." The import, its note, its change history row and its kept document go in every case. (d) An import already taken back from another window: the toast closes and a message reads "This import was already undone." (e) All or nothing: if any part cannot be taken back, nothing is, and the person is told and can try again (Q-157) — a person's later edit is never lost, a figure is never counted twice, and a toast never states a count that is not true (confidence: medium)
Answer:

**Q-138 [detail]. Two imports set the same Key facts field and both are taken back, the earlier first** (possible only while both toasts are open, in two windows). The earlier import's "Undo" leaves the later import's value, as story 41, R3 says. The later import's "Undo" then puts back the value it found, which is the earlier import's value, although that import is gone; the field does not return to what it held before either import. Should the field return to the value before the earliest import that is no longer there? Story 15, R7 and Q-48 cover which value stands while both exist. Stories: 41, 86.
Proposed: Yes. After an "Undo", a field holds the value it would hold had that import never been added: the value of the latest change that remains (a later import or a hand edit), and when none remains, the value from before the earliest import that is now gone. So with two imports both taken back, in either order, the field returns to what it held before both — "leaves the project as it was before" is the story's own promise, and a value from an import that no longer exists has no source (confidence: high)
Answer:

**Q-139 [detail]. Pasted text as a kept document: two details.** (a) Every import from pasted text is named "pasted text", so two such imports on one project read alike in the change history, on review rows and under notes; only the day and the person tell them apart. Should a pasted document carry something of its own (its first words, the day)? (b) The prototype keeps the text cut into paragraphs at blank lines, drops the spaces around each paragraph and any extra blank lines, and keeps single line breaks inside a paragraph; it does not keep the text exactly as typed. Is the paragraph cut the rule, and must the original text be kept unchanged beside it? Related: Q-45, Q-66 (b), Q-144. Stories: 40.
Proposed: (a) The name stays "pasted text". Two such imports are told apart by the person and the day, which every screen that names a document already shows beside it once the note's line carries the day (Q-144); two by one person on one day are told apart by opening them. (b) The text is kept exactly as it stood when "Read it" was pressed, unchanged. The cut into paragraphs is only how it is displayed — a kept document is the evidence behind a published figure and must not be altered; a made-up name from the first words would add wording to five screens for a rare case (confidence: medium)
Answer:

**Q-140 [detail]. An import whose document cannot be kept.** In the prototype the entries are saved first, then the file, then the import's record; when the browser cannot keep the file the import is recorded without it and nothing is said, so its changes name a document nobody can open. In a build: is an import refused when its document cannot be kept (changes and document all or nothing), or added with a warning? Related: Q-44 (a save that fails part-way), Q-77 (c) (what a Manager sees when the document cannot be fetched). Stories: none since the answers were written in (2026-11-23).
Proposed: The import is refused: changes, the import's record and its document are saved together or not at all. The person stays on the check step with every tick, edit and the note as they were, and reads "Couldn't add the changes because the document couldn't be saved. Nothing was added. Try again." — a change that names a document nobody can open breaks the promise that every imported figure leads back to its source (spec #19) (confidence: high)
Answer: (2026-11-23) Withdrawn: no longer arises. The file is not kept (spec #42), so an import never waits on storing a document.

**Q-141 [detail]. In the review, should a change read the same whether a person typed it or an import added it?** Today they differ for the same kind of thing. A hand-filed entry's row is labelled "Native trees and shrubs planted, 2025" and an imported one "Native trees and shrubs planted · 2025". A hand-added funding source's row is labelled with the grant's name and reads "$48,000 from Pacific Fisheries Trust"; an imported one is labelled "Funding source" and reads "Fisheries Habitat Fund, Pacific Fisheries Trust, $48,000". Which wording is the rule, and does `publish-review` or this feature own it? Related: Q-37, Q-98 (the label "Funding source"). Stories: 22, 24. It bears on story 22, which records the label and the value.
Proposed: One wording for the same kind of thing, and `publish-review` owns it: the review has one renderer for every row (spec, "How a change reads in review"). An imported row is worded as a hand-made one: an entry is "`<Measure>`, `<reporting period>`"; a funding source is labelled with the grant's name and reads "`<amount>` from `<organization>`". The import records the parts of each change (measure, period, name, organization, amount), not a finished label, and the check step keeps its own labels — the Manager judges the change, and how it arrived is already said by the source line (confidence: medium)
Answer:

**Q-142 [detail]. A project that has never been published: do imported rows in the review show who added them and the day?** The review leaves the person and day off every hand edit's row there (all rows share the record's creation), but an imported row always shows "who · day". Should imported rows follow the same rule, or keep theirs because the import's person and day are real? Stories: 24.
Proposed: Imported rows keep "`<who>` · `<day>`" and their "From `<document name>`" button on a project that has never been published. Hand-edit rows there stay without them — the import's person and day are real facts about that change, and every change carries its source (spec #5) (confidence: medium)
Answer:

**Q-143 [detail]. A field an import set is then edited by hand before a publish.** `publish-review` folds the two into one row. Whose value, person and day does the row show, and does it still carry "From `<document name>`"? The written rule (spec #30) and the prototype cover only the other order, a hand edit first and the import after it: the row then shows the import's value and source. The prototype cannot show a hand edit after an import, because its hand edits are fixed sample data. The same question applies to a row that stands for two imports and then a hand edit (story 51). Related: Q-37, Q-75. Stories: 85.
Proposed: The row shows the value now on the record, which is the hand edit's, with the person and day of the hand edit. It keeps the "From `<document name>`" button, so the Manager can compare, and carries the review's existing marker that the figure was changed from the document's (spec #36). A row that stands for two imports and then a hand edit does the same, with the later import's document — the latest change decides what the row says, and the document stays reachable because it is still the reason the field changed (confidence: medium)
Answer:

**Q-144 [detail]. How does a Manager tell which rows a note speaks of?** The line under a note reads "`<who>`, with `<document name>`", with no day; each imported row shows "who · day" and "From `<document name>`". Two imports of documents with the same name by the same person (a report corrected and read again, or pasted text twice: both read "with pasted text") give two notes with identical lines, and rows that cannot be told apart by import. Should the line carry the day, or the note sit with its rows, or is the document's name enough? Related: Q-86 (whether a time is kept), Q-139 (a). Stories: 21. It bears on story 24.
Proposed: The line under a note carries the day: "`<who>` · `<day>`, with `<document name>`", written as the rows write it, so a note and its rows match on person, day and document. The note stays above the changes; it is not moved beside its rows. Two imports of one name by one person on one day stay alike, which is accepted as rare — one added word settles nearly every case without a new layout (confidence: medium)
Answer:

**Q-145 [detail]. In the review, pressing the button of the row whose document is already open: should it close the document?** The button is marked expanded for assistive technology, which by convention means a second press collapses it. In the prototype the second press does nothing, and the document is closed only with "Close document", "Back" or Escape. Stories: none since the answers were written in (2026-11-23). It bears on story 80, which holds the closing.
Proposed: Yes. Pressing the button of the row whose document is open closes the document, and keyboard focus stays on that button — a control marked as expanded is expected to collapse on a second press (confidence: high)
Answer: (2026-11-23) Withdrawn: no longer arises. The file is not kept (spec #42); the review opens no document (stories 33 and 80 are retired).

**Q-146 [detail]. Escape and keyboard focus when the document opens beside the review on a wide screen.** Focus stays on the row's button (so the Manager can go on to the next row), and in the prototype Escape closes the document only while focus is inside it; pressed from the row, it does nothing. On a narrow screen focus moves to "Back", so Escape works at once. Should Escape close the document from anywhere in the review, or should focus move into the document on a wide screen too? Related: Q-68 (the same pane on the Import a report page), Q-83 (no accessibility standard is named). Stories: none since the answers were written in (2026-11-23).
Proposed: Escape closes the open document from anywhere in the review, unless a menu or dialog is open, which takes Escape first. On a wide screen focus stays on the row's button, as now, so the Manager can go on to the next row — moving focus into the document would break going from row to row (confidence: medium)
Answer: (2026-11-23) Withdrawn: no longer arises. The file is not kept (spec #42); the review opens no document (story 80 is retired).

**Q-147 [detail]. A figure the document gives with no unit at all, once unit conversion is built (later release).** The developer-machine reader treats it like an unknown unit: the change is flagged, the amount keeps the figure, and the note reads "The report says “”. This measure counts pounds.", with nothing between the quotation marks. The funder report sample's row F9 ("Seed collected, 40") is the same case and arrives differently: flagged, amount empty, with the sentence "The table gives 40 with no unit. This measure is in pounds." (story 14, R2). Which is the rule: amount kept or empty, and whose sentence? Related: Q-33, Q-61, Q-89 (c) (whether "unsure" is a verdict the service returns). Stories: 26. It bears on story 14.
Proposed: The amount arrives empty and the change is flagged with "The report gives `<figure>` with no unit. This measure is in `<unit>`.", as the funder report's seed row does. The figure is never written into the amount — a figure with no unit is an unsure reading, and an unsure reading is never pre-filled (spec #13) (confidence: high)
Answer:

**Q-148 [detail]. A total to date stated in another unit, once unit conversion is built (later release).** The reader converts the total and the check step then files the difference from the record. The check step shows only the difference's arithmetic ("3.5 to date − 3 on record = 0.5"); the conversion line ("18,480 feet = 3.5 miles") is dropped, so the person never sees the report's own figure against the converted one except in the quote. Should both lines show? Related: Q-82 (b), which asks the first-release half. Stories: 26. It bears on story 13.
Proposed: Both lines show, in the order the arithmetic was done: the conversion ("18,480 feet = 3.5 miles"), then the difference ("3.5 to date − 3 on record = 0.5") — the person checks the amount against the report's own figure, and that figure appears only in the conversion line (confidence: high)
Answer:

**Q-149 [detail]. When a check in code quietly changes what the model returned, is the person told? (later release)** Two checks leave no trace in the developer-machine reader: a breakdown answer that is not one of the question's options is dropped, and the change arrives ready with the question unanswered; a low-confidence figure is flagged with no note saying why. Should each add a note to the change, and should a dropped answer flag the change? Related: Q-66 (c), Q-90 (whether an answer may arrive inferred), Q-115 (b) (the first-release half). Stories: 50. It bears on stories 07 and 14.
Proposed: Yes, the person is told in both cases. A breakdown answer that is not one of the question's options already arrives unanswered with a note in the first release (Q-115 (b)); the later check writes that same note and does not flag the change, because an answer is optional. A figure flagged for low confidence carries the note "The reading wasn't sure of this figure. Check it against the document."; no level of confidence is shown — a change must never wait on the person, or differ from the document, without saying why (confidence: medium)
Answer:

**Q-150 [detail]. A Key facts change the checks turn away (later release): dropped, or listed under "Not used"?** The cases: a field the project did not offer; a Timeline that is not two years. The reader drops it without a word, while a figure for a measure the project is not asked is moved to "Not used". The funder report sample lists "Watershed: South Fork American River. This project has no Watershed field." under "Not used", but as the model's own line, not from this check. Should the check write such a line, and with what words? Related: Q-71. Stories: 50. It bears on stories 15 and 19.
Proposed: Listed under "Not used", with a line the check writes, after the reading's own lines: "`<Field>`: `<value>`. This project has no `<Field>` field." and "Timeline: `<as read>`. A timeline needs a start year and an end year.". A Timeline that does not fit is already caught in the first release (Q-71, Q-125) with the same words; the later check adds the field the project did not offer — nothing the report states is dropped silently (story 19), and the sample already words the first case this way (confidence: high)
Answer:

Raised by the merge pass of 2026-11-23 (44 stories became 41: 25 merged into 21, 34 dissolved into 01 and 22, 45 merged into 17). The same day the `Stories` lists above were brought in line with the story files.

**Q-157 [detail]. What does the person see when "Undo" itself fails, and can they try again?** Story 23, R2 says the toast goes as "Undo" is pressed, so that it cannot be pressed twice, and R6 says "Undo" is on the toast and nowhere else. So if the taking back fails as a whole (a server error, a lost connection, or the person no longer being able to edit the project since they added the import), the import and everything it added are still on the record and there is no "Undo" left. In the prototype the toast is closed and the listener removed before the taking back runs, and no failure is handled (`src/components/projects/firma2-project-imported.astro`, 115-120; `src/lib/report-imports.ts`, 164-181): nothing would be said, and "6 changes removed" would not show. Nothing checks again, when "Undo" is pressed, that the person may still edit the project. (a) What is the person told when "Undo" fails? (b) Is "Undo" offered again, and where: the first toast kept or brought back, an action on the failure message, somewhere else? (c) Is the edit right checked again when "Undo" is pressed, and what does a person who has lost it see? (d) Does the toast go only once the taking back has succeeded? Related: Q-137 (e) asks the part-way case (all or nothing); Q-44 asks the same for adding; Q-64 already asks whether "Undo" needs a second home. Would change story 23, R2, R3 and R6, and adds at least one scenario. Stories: 23, 84. It bears on story 41, which extends "Undo" to the other kinds of change.
Proposed: (a) The person reads "Couldn't undo this import. Nothing was removed." (b) "Undo" is offered again on the same toast: the toast stays, and "Undo" is switched off only while the taking back runs, so it cannot be pressed twice. There is no second home for "Undo". (c) The right to edit is checked again when "Undo" is pressed. A person who has lost it reads "You can no longer edit this project, so the import stays." and the toast loses "Undo". (d) Yes: the first toast goes only once the taking back has succeeded, and "`<N>` changes removed" then takes its place — a failed "Undo" must not silently leave the import on the record with no way to try again (confidence: medium)
Answer:

**Q-158 [detail]. Pasted text beside the changes: what heads the document pane, and what labels its page?** Story 04, R9 says the pane is headed by the document's name, and story 31, R2 says each page of a document held as passages sits under its label. Pasted text has no file name and no pages of its own. The prototype heads the pane "Pasted text" and labels the one page "Pasted text" as well, so the same words show twice (`firma2-project-report-import.astro:512-535`). Story 40 names the import "pasted text", in lower case, once the changes are added; nothing names the document on the check step before that. (a) What heads the pane for pasted text? (b) Does pasted text have a page label at all? Related: Q-139 (the name of a pasted import, and the cut into paragraphs), Q-66 (b). Stories: 31. It bears on story 04, R9.
Proposed: (a) The pane is headed "Pasted text". (b) Pasted text has no page label; its paragraphs sit directly under the heading — the same words twice add nothing, and pasted text has no pages (confidence: high)
Answer:

**Q-159 [detail]. A UAT script run with only its story's blockers built: what does the funder report's check step list, and what do the tally and the action read?** Story 17's UAT script reads the whole funder report: the tally "7 ready to add · 4 need you · 3 already on file", "Add 7 changes", and a Funding sources group of three changes with F12 unticked. Those figures need stories 13, 14, 15, 18 and 75, none of which is in story 17's `Blocked by` (06, 02, 32, 22). (a) What does the check step list, and what do the tally and the action read, when the funder report is read with only story 17 and its blockers built? (b) Or is the script to be run against a narrower recording (performance measure entries plus F10 and F11), and what are its counts? The same question stands for the other scripts that assume the whole funder report; they are listed in `.scratch/project-updates/requirements/coverage.md`, Findings, "Not demonstrable with blockers alone", and the samples that would settle it in `fixtures.md`, "Samples the feature still needs". Until it is answered, steps 5 to 8 of story 17 (the row on the project page) are demonstrable with its blockers, and the counts in steps 1, 4 and 5 are not. Related: Q-88. Stories: none since the answers were written in (2026-11-23). It bears on stories 03, 13, 14, 15, 18, 65 and 75.
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
Answer:

#### Raised while writing the answers in

Raised 2026-11-23 by the five writers who wrote the proposed answers into the stories, and numbered by the closing pass. Each has a proposal and is written into its story as a requirement tagged `proposed`.

**Q-162 [detail]. Who makes reading by an outside AI service unavailable for a workspace, and where?** Spec #41 says it "can be made unavailable to a workspace altogether, where that client's terms do not allow its documents to go to an outside provider". It does not say who does it, on what screen, or what happens to a workspace that was on. Stories: 82.
Blocks: story 82, R8 and R9; story 83, S2.
Proposed: The product's operator sets it, from outside the workspace's own settings; there is no screen for it in the first release. No Administrator of the workspace can change it. A workspace made unavailable while the setting was on is treated as turned off from that moment. A workspace made available again is off, not on, and an Administrator agrees and turns it on again — the lock exists because of a client's terms, which the workspace's own Administrator must not be able to override, and no operator console exists to put a screen in (least new surface) (confidence: medium)
Answer:

**Q-163 [detail]. Which settings page holds the control?** Nothing in the prototype holds it. The Security page (`workspace-settings/security`) answers "who can get in, and what can they do once in", sits under a plan lock below Agency, and its header comment lists "AI and compliance toggles" among the things cut from it. Import and export is about bulk project import. Import a report is on every plan (spec #21; story 12, R2). Stories: 82.
Blocks: story 82, R2, R3, R10.
Proposed: The Security page of workspace settings, in a section of its own headed "Reading by an outside AI service", outside that page's plan lock; only an Administrator sees it; a change saves at once like the page's other controls, and a failed save leaves the state as it was with a message — it is a decision about what may leave the organization, which is what an Administrator looks for under Security; a page of its own would be new surface for one control. It amends that page's earlier cut of AI toggles (confidence: medium)
Answer:

**Q-164 [detail]. What text does the Administrator agree to, and how is agreeing given and recorded?** Spec #41 says "agrees and turns it on" and stops there. A client's contract terms cannot be written in this public repository. Stories: 82.
Blocks: story 82, R4, R5, R7.
Proposed: The product's own plain statement, the same for every workspace, of three facts: reports and pasted text given to Import a report are sent to an outside AI service to be read; what goes with each document (the project's performance measures, closed reporting periods and fields) and what does not (funding sources, contacts, the workspace's organizations and people; Q-89 (a)); neither the product nor the provider keeps the document (spec #42). Agreeing is a checkbox the Administrator ticks before "Turn on" can be pressed. The setting records who turned it on or off and when, and the section shows it. Turning it on again after turning it off takes the agreement again. A client-specific text, if one is ever required, lives in `docs/private/`, not in the product — state only what the product itself can guarantee, and keep the consent visible to the next Administrator (confidence: medium). Worth a look: whether any client requires its own wording, or a record of the agreement beyond who and when, is a contract fact only the user can give; the proposal is what is assumed until then.
Answer:

**Q-165 [detail]. What does turning the setting off do to work already under way?** A person may have a check step open, or a reading in the wait, when an Administrator turns reading off. Stories: 82, 83.
Blocks: story 82, R7; story 83, R5, R6.
Proposed: From the moment it is turned off no document is sent: "Read it" tests the setting again and sends nothing. A check step already open can still be added, and a reading already under way finishes and can be added, because the document had already left and nothing more leaves. Imports already on the record stay as they are — turning off is about what leaves the workspace from now on; throwing away a reading the person has already checked loses their work for no gain (confidence: medium for the open check step; low for the reading under way, where "stop it where the service can" is the other reasonable answer)
Answer:

**Q-166 [detail]. While the setting is off, what does a file dropped on the project page do, and does the "why" line lead an Administrator to the setting?** Spec #41 says the entry points are not offered and "the place it would be says why". A drop has no place. Stories: 83.
Blocks: story 83, R2, R7.
Proposed: The project page takes the dropped file, so the browser does not open it; the page stays as it was and a toast gives the same one line as the card. The line names the role ("An administrator"), never a person; to an Administrator its "workspace settings" is a link to the setting — the same rule as Q-103 (a drop that does nothing reads as broken), and the product's rule that people are pointed at a role, not at named managers (confidence: medium)
Answer:

**Q-167 [detail]. A change read from more than one passage: which passage is marked?** Crew log row C1 is the sum of rows 4 and 6, and each row is a passage. Story 04, R11 says a change points at one passage and the whole passage is marked; nothing says what is marked when the quote covers two. Stories: 04.
Proposed: the first passage the change was read from is marked and brought to the top; the quote on the change names every row ("Rows 4 and 6 — …"), and the "Added:" line shows the parts — a change keeps one place, as the prototype models it, and the second row is two lines below the first in every case seen (confidence: medium)
Changes: story 04, R11 and `fixtures.md` (C1 points at row 4). If the answer is "mark all of them", R11 and S11 change and a change carries a list of passages.
Answer:

**Q-168 [detail]. What tells the person why "Add N changes" added nothing, when the record changed while the check step was open?** Q-87 (b), Q-48 and Q-99 (f) say the press stops once and the changes are re-marked; none says what the person reads. Stories: 32.
Proposed: one message beside the commit action says that the record changed since the report was read, that nothing was added, and to check the changes now marked before pressing again; the first re-marked change is brought into view; the message is announced once and goes at the next press or the next tick — a press must never leave the person with no visible result (the reason given for Q-112), and it follows SR-6. Wording provisional. (confidence: medium)
Answer:

**Q-169 [detail]. A repeat inside one reading whose entry the record also holds: which state shows?** Q-99 (a) flags the second of two identical entries; story 32, R2 marks an entry the record holds "Already on file". Both can be true of the same change. Stories: 32.
Proposed: "Already on file" wins on both changes (that badge, no "Needs you", counted under "already on file"); the later one still shows its "Also stated at …" sentence, because it explains the change — the same order as Q-126 (d), where the state that needs nothing from the person wins, and Q-122 (a), where the reason stays. (confidence: medium)
Answer:

**Q-170 [detail]. A figure typed into an empty change that makes it an entry the record already holds: is the change ticked?** Story 14, R6 ticks a change when a figure is typed into an empty amount; story 32, R5 compares again after an edit. Reading the flagged figures sample a second time and typing the same 40 meets both. Stories: 14.
Proposed: the change is marked "Already on file" and the typing does not tick it; the person may tick it by hand (Q-87 (a)) — never count twice by default. (confidence: medium)
Answer:

**Q-171 [detail]. A change flagged for its reporting period (Q-114): does picking a period tick it? And a change with more than one reason?** Q-114 says the change arrives flagged and unticked with "Reporting period" empty, and does not say what picking a period does. A change can also have two reasons at once (a figure that is not settled, under a period the project does not offer). Stories: 14.
Proposed: (a) picking a reporting period ticks the change, if it is unticked and its amount holds a figure above zero — as typing a figure ticks an empty change and picking an organization ticks a "Not in this workspace" one. (b) A change with several reasons carries one badge and shows every sentence, the figure's first; it is ready only when each is dealt with, and story 30 stops whatever is still missing. (confidence: medium)
Answer:

**Q-172 [detail]. On one press of "Add N changes", which runs first: the check that every ticked change is valid (story 30), or the check against the record (story 32, R5)?** Neither story blocks the other. Stories: 30.
Proposed: validity first; the record is looked at only once every ticked change passes, so the person never sees two kinds of stop at once — the person's own typing is the cheaper thing to put right. No scenario in either story until both are built; its check is written in story 30's notes. (confidence: medium)
Answer:

**Q-173 [detail]. Later story 28: what does a person who comes back to a ready reading see where the document would be?** Follows from spec #42 overriding Q-80 (j): the file is not held, so there is nothing to show beside the changes. Stories: 28.
Proposed: the changes with their quotes, and one line where the document would be saying the document is not kept and each change shows the words it was read from; "Show source" is not offered on a narrow screen. A person who stays on the page keeps the document beside the changes, as in the first release — the least new surface; choosing the file again only to look at it would be a new act. Worth the user's eye: it makes the returning check step weaker than the first release's. (confidence: low)
Answer:

**Q-174 [detail]. What does the Funding sources table show for a row whose amount an import changed?** Q-50 makes a funding source the record holds with another amount a change to that row, and Q-99 (f) says the row's "From `<document name>`" line then names the later document. Nothing says whether a row entered by hand gains that line, where the row sits, whether it still shows a share, or whether "Total from all sources" appears (story 17, R11 shows it only for a row an import *added*). Story 86, R2. Stories: 86.
Proposed: The row keeps its place and gains "From `<document name>`" under its name, under the same rules as an added row's line (who sees it, that it stays after a publish, that Undo takes it away). "Total from all sources" is shown while the table holds a row an import added or changed. The share is `project-record`'s to work out, exactly as after a hand edit of the amount. — Consistency: an import that changed a figure is that figure's source, as for a Key facts field; and the total row exists because the sources may no longer add up to the estimate, which a changed amount causes as surely as a new row (confidence: medium)
Answer:

**Q-175 [detail]. When an edit on the check step turns an "Already on file" funding source into something that can be added, is it ticked?** An "Already on file" funding source has no checkbox (Q-87 (e)) and its state follows the person's edits (Q-133 (c)). So typing another amount, name or organization gives it a checkbox. Story 17, R2 says editing a field neither ticks nor unticks a change. Story 86, R3. Stories: 86.
Proposed: Yes, it is ticked, and counted under "ready to add". — Consistency: wherever a change could not be added and the person's own entry makes it addable, the entry ticks it (picking an organization, story 75, R3; typing a figure into an empty amount, story 14); the person has just typed the value on purpose. The reverse holds too: a ticked change edited into an exact match loses its checkbox (confidence: medium)
Answer:

**Q-176 [detail]. Editing and removing a funding source or a contact on the project page: what the user's decision on Q-135 did not say.** The decision is that the rows can be edited and removed, in the first release, owned by `project-record`. Story 81 needs five more things. Not yet prototyped: the project page is unfinished. Stories: 81.
Proposed: (a) Who: anyone who can edit the project, for any row, whoever or whatever added it; the right is checked again when the change is saved. (b) What is validated: the rules of the check step's fields (Q-113 (b) to (e); story 65, R1), so one value has one rule wherever it is typed: a grant's name is required and at most 200 characters; the organization is picked from the organizations the person can see, never typed, changed but not cleared; the amount is whole dollars above zero and below one trillion. For a contact, which the check step does not edit: a name is required; the email is empty or an email address; role and organization are free text and may be empty. An invalid value is not saved and the row keeps what it had. (c) "Remove" asks once, naming the row, before removing. (d) A change that would make two rows the same is refused: a funding source with another row's name and organization, a contact with another contact's email. (e) The change history gains one row per change or removal, with the person, the day and what changed, and names no source (Q-37). — (a) and (e) follow what the product does for every hand edit; (b) is one rule per value; (c) is the safe default, since a removed row cannot be brought back by any Undo; (d) keeps the rule the import already holds, that the record holds a funding source or a contact once (Q-99, rule 2) (confidence: medium; (c) could as well be no question and an "Undo" of the removal)
Answer:

**Q-177 [detail]. Keyboard focus after "Undo".** Q-64 makes "Undo" a keyboard stop. When it is pressed by keyboard and succeeds, the toast that held it is replaced by "`<N>` changes removed", so the focused button is gone. Where is focus then? Stories: 23.
Proposed: focus is on the new toast's dismiss control — the safe default: focus is never dropped to the top of the page, and the person can dismiss the message they were just read (confidence: medium)
Answer:

**Q-178 [detail]. "Undo" when more than one condition holds, and the words after a publish.** Q-75, Q-137 and Q-157 each give one message. (a) Which shows when two hold at one press (for example a change published and another changed by hand)? (b) Q-75 (b) says the toast "says the changes were published and are corrected on the project page" but no shared wording was given for it. Stories: 84.
Proposed: (a) one message, in this order: the right to edit lost; the import already undone; a change published; then the counts of what was removed and kept — a person who may not act is told that first, and a publish stops everything else, so nothing is half taken back. (b) "These changes were published. Correct them on the project page.", and the toast loses "Undo" (wording provisional) (confidence: medium)
Answer:

**Q-179 [detail]. What the Undo toast counts for a field a later import has set since.** Q-137 words the toast for changes "you changed since". A Key facts field that a later import set is neither as the first import left it nor changed by hand. Is the first import's change counted as removed or as kept? Stories: 41.
Proposed: counted as removed. The first import's change is gone from the record and nothing of the person's was kept by hand, so "`<M>` you changed since were kept" would be untrue; the field keeps the later import's value by Q-138 (confidence: medium)
Answer:

## classifications — nested groups

Raised while building nested classification groups, 2026-11-23. Spec: `.scratch/classifications/spec.md`. Harvest and interview pass 2026-11-24 (inventory: `.scratch/classifications/requirements/inventory.md`): Q-180 to Q-200.

All answered 2026-11-24; the questions are under Answered.

### Stories pass, 2026-11-24 (Q-202 to Q-233)

Raised by the story writers; each has a proposed answer and the stories are written on it. Awaiting validation.

**Q-202 [detail]. A refused add row: what happens when the person clicks away or opens another add?** The prototype leaves a refused row open with its message, then drops it without a word when another add replaces it.
Blocks: Story 02 R12, S9.
Proposed: Leaving a refused row (clicking elsewhere, or opening another add) drops it and says why once, to everyone including assistive technology: "Not added. A <group or classification> already has this name." Escape drops it silently. Only one add row is ever open — nothing disappears without a word, and no row is stuck open (confidence: low)
Answer:

**Q-203 [detail]. Does a nested group's description show under its line on the settings list?** The prototype shows a description under a top-level group's heading and under every classification row, never under a nested group.
Blocks: Story 02 R2; story 04.
Proposed: Yes: under every group line and every classification row, cut to two lines — the same everywhere, and the description is the only place a person is told what a group is for (confidence: medium)
Answer:

**Q-204 [detail]. What does "Add a performance measure" show when every measure in the catalog is already linked?** 
Blocks: Story 05 R4.
Proposed: The choice stays and says "Every performance measure is already tracking this classification"; there is nothing to pick (confidence: medium)
Answer:

**Q-205 [detail]. When a linked performance measure is retired, does its row stay in the editor?** RUL-39 says its link and target are kept and it leaves the choices and the pages.
Blocks: Story 05 R12, S12.
Proposed: Its row stays in the editor, marked "Retired", so the administrator can still "Stop tracking" it; it leaves the list of measures to add and the pages (confidence: low)
Answer:

**Q-206 [detail]. How large may a goal target be, and how many decimals does it keep?** The prototype accepts any number above zero.
Blocks: Story 05 R6, S5.
Proposed: A number above zero and at most 1,000,000,000, kept to the measure's own number of decimals; beyond that the field says "Enter a number up to 1,000,000,000." (confidence: low)
Answer:

**Q-207 [detail]. Does the remove confirm name the performance measures and goal targets that go with a classification?** The prototype repeats only the page line.
Blocks: Story 06 R9, S5.
Proposed: Yes, when it has any: "Its <N> performance measures and their goal targets are removed too." — converting already says this, and removing should be no quieter (confidence: medium)
Answer:

**Q-208 [detail]. Is the removal rule checked again when "Remove" is confirmed?** The prototype works it out once, when the page opens.
Blocks: Story 06 R10.
Proposed: Yes. If a project has since been filed under the classification, or something was moved into the group, the removal is refused with the same reason line and nothing is removed (confidence: high)
Answer:

**Q-209 [detail]. Dragging a row over a folded group: where does it go?** The prototype marks the folded group and drops the row into it, against RUL-28.
Blocks: Story 09 R10, S11.
Proposed: A folded group is not a drop place: it is not marked, and the row goes beside it (before or after, by the thin-band rule), never inside (confidence: high)
Answer:

**Q-210 [detail]. Dragging a row over the lower half of a classification row: before or after?** The prototype draws the line before the row except in a thin band at the bottom.
Blocks: Story 09 R7.
Proposed: Before in the top half of the row, after in the bottom half (confidence: medium)
Answer:

**Q-211 [detail]. Do a reader's folds follow them to another device?** The spec says "per reader"; the prototype keeps them on the device.
Blocks: Story 10 R6, S5, S6.
Proposed: No: kept on the device and browser they used, as built; they are a convenience and all groups are open on a new device (confidence: medium)
Answer:

**Q-212 [cut]. Converting a classification that has performance measures linked but no projects: ask first?** Spec #29 and Q-161 speak of classifications projects use; the prototype also asks when only measures are linked.
Blocks: Story 11 R2.
Proposed: Ask first, naming the measures that stop tracking it — it loses the setup work of whoever linked them (confidence: medium)
Answer:

**Q-213 [detail]. Where does a converted row, and a kept row, stand in its new list?** Spec #21 says a conversion keeps its "place". The prototype adds the new record at the end of its list.
Blocks: Stories 11 R5, 12 R8.
Proposed: "Place" means the group it stands in; the converted record and the rows kept from a converted group join the end of their lists, and Sort A to Z puts them in order (confidence: medium)
Answer:

**Q-214 [cut]. A project left with no classification by a conversion.** The intake form treats a classification as required; converting a classification that was a project's only one leaves it with none.
Blocks: Story 11 R7.
Proposed: Allowed after the confirm, which also says how many projects are left with none. The project stays valid; no rule forces an existing project to carry one, and its page lets an editor file it again (confidence: low)
Answer:

**Q-215 [detail]. What does the group-to-classification question say when classifications beneath are in use?** Q-185 settled the buttons and that it says how many.
Blocks: Story 12 R5.
Proposed: "<N> classifications beneath <name> are in use by projects, so they can't be removed. Keep them, or cancel." with "Keep them" and "Cancel"; they are not listed by name (confidence: medium)
Answer:

**Q-216 [detail]. A person the setting lets in who is not an Administrator: what do they see of Workspace settings?** 
Blocks: Story 13 R4, R5.
Proposed: The Workspace settings navigation shows them only Classifications, the section the setting lets them into (confidence: low)
Answer:

**Q-217 [detail]. Are the other links to Settings › Classifications hidden from people who are not let in?** The project form's Classifications field and the performance measure page's list of classifications link there.
Blocks: Story 13 R5.
Proposed: Yes: for them those links are plain text, like the edit doors are absent (confidence: medium)
Answer:

**Q-218 [detail]. What does a person see when a save is refused because their access was withdrawn while the page was open?** 
Blocks: Story 13 R8, S10.
Proposed: The permission page replaces the settings page: "You don't have permission to change classifications." with a link back to Classifications (confidence: medium)
Answer:

**Q-219 [detail]. In what order are a classification's performance measures listed?** The prototype uses the catalog's order, everywhere.
Blocks: Stories 14 R4, 15 R7.
Proposed: The catalog's order, the same on the classification's page, in the Outline's rings and lines, in Browse and in the peek (confidence: medium)
Answer:

**Q-220 [detail]. A Simple tile with nothing to measure against and nothing reported: what does it say?** The tile shows "—" and "No goal set"; the Outline and Browse say "Not reported".
Blocks: Story 14 R9.
Proposed: "Not reported" with "No goal set", the same words as everywhere else (confidence: medium)
Answer:

**Q-221 [detail]. A project's row in a different unit than its performance measure.** The prototype stops its build; a product cannot.
Blocks: Story 14 R11.
Proposed: The project's row is left out of that measure's figures and is listed for the administrator in Performance measures, where measures and units are defined; units are never added together (confidence: low)
Answer:

**Q-222 [detail]. Should a measure's tile show the year its goal is due?** The year is set with the goal; no page shows it. The public site shows "by 2030".
Blocks: Story 14 R13.
Proposed: Not in the first release; the year is on the settings page. Adding it to every figure line is a wording change across pages (confidence: low)
Answer:

**Q-223 [detail]. Can a ring take keyboard focus?** In the prototype it cannot, so a keyboard reader never meets the tooltip.
Blocks: Story 16 R3.
Proposed: No. A ring is not a keyboard stop; a keyboard reader opens the row's measure lines (its chevron), which give the same name and figure as text. The tooltip is for a mouse (confidence: medium)
Answer:

**Q-224 [detail]. Folding a group that holds Browse's chosen row.** RUL-24 and STA-13 say a chosen row is never hidden; the code only guarantees it at the moment of choosing.
Blocks: Story 17 R10.
Proposed: Folding is allowed. The chosen row hides with its group and comes back when it is opened; the record on the right stays shown. "Never hidden" means a row is opened into view when it is chosen (confidence: medium)
Answer:

**Q-225 [detail]. Does following a `#g:` or `#c:` link make Browse the remembered view?** The prototype does not change the remembered choice.
Blocks: Story 17 R3.
Proposed: No, as built: the link opens Browse this once; the reader's own choice stays (confidence: medium)
Answer:

**Q-226 [detail]. Outline and back to Browse in one visit: what does the address say?** Browse comes back on the record chosen, but the address no longer names it.
Blocks: Story 17 R5.
Proposed: Going back to Browse writes the chosen record into the address again, so a reload or a copied link matches the screen (confidence: medium)
Answer:

**Q-227 [detail]. What does the peek show for a classification with no performance measures?** The page, the card and Browse say "No performance measures yet"; the peek leaves the section out.
Blocks: Story 18 R6.
Proposed: "No performance measures yet", under the summary, as everywhere else (confidence: high)
Answer:

**Q-228 [detail]. What does the Projects section say when no project carries the classification (or a group has none beneath)?** The prototype's grid shows "No matching projects", which names a filter nobody used.
Blocks: Stories 19 R9, 21 R10.
Proposed: "No projects yet." (confidence: medium)
Answer:

**Q-229 [detail]. In what order are the project rows under a performance measure?** The prototype uses the portfolio's own order, by no stated rule.
Blocks: Story 19 R3.
Proposed: Largest reported amount first; equal amounts by project name, A to Z (confidence: low)
Answer:

**Q-230 [detail]. Does the page tell a reader whose figures are published-only that they are?** Without it, two readers see different numbers on the same page with no explanation.
Blocks: Story 22 R3.
Proposed: Yes: one line under the page title, "Figures count published projects only.", shown only to readers whose figures are published-only (confidence: medium)
Answer:

**Q-231 [cut]. What does a reader with published-only figures see of the tree?** The public site hides a goal with no published project and shows no groups.
Blocks: Story 22 R5.
Proposed: The same groups and classifications as everyone, with figures over published projects only (0 where there are none). The tree is the workspace's structure, not project data (confidence: low)
Answer:

**Q-232 [cut]. Which performance measures does a reader with published-only figures see, and how are they counted?** The public site shows one lead measure per goal.
Blocks: Story 22 R6.
Proposed: Every linked measure, counted over published projects with the same arithmetic as everyone else (confidence: low)
Answer:

**Q-233 [cut]. Does a Viewer who belongs to an organization see the published-only figures too?** Q-201 settled a Viewer with no organization. The roles document says a Viewer "reads published values everywhere".
Blocks: Stories 22, 14 to 21 (who sees which figures).
Proposed: Yes. Every Viewer, with or without an organization, sees the published-only figures; Contributors, Managers and Administrators see the all-projects figures. It follows the roles document and refines the answers to Q-187 and Q-201 (confidence: medium)
Answer: Yes. Every Viewer, with or without an organization, sees published-only figures. (user, 2026-11-24)

**Q-234 [cut]. Which performance measures does a classification or group roll up: only the ones linked to it, or every measure its projects report?** Today a measure shows on a classification only when an administrator linked it (with or without a goal); a group shows the measures linked to any classification beneath it. A measure that projects report toward but nobody linked is invisible, so the figures understate what the work achieved. Raised by the user 2026-11-24 ("roll ups of the PMs of the projects within a classification or group, not only the ones that have a target").
Blocks: stories 05, 06, 11, 14, 15, 16, 17, 18, 19, 21, 22; RUL-39.
Proposed: Every measure that any project under the classification (or under any classification beneath a group) reports toward is rolled up, by the measure's counting rule, whether or not it is linked. A linked measure keeps its goal, and shows first, in the catalog's order; an unlinked one follows, with no goal ("No goal set"), measured against what its projects planned; nothing else marks it as unlinked. Linking now means only "set a goal here". Retired measures stay out of the pages (RUL-39). Published-only readers count the same way over published projects. (confidence: medium)
Answer: Yes, as proposed: every measure the projects report toward, linked first, unlinked after with "No goal set". (user, 2026-11-24)

## geospatial-areas

Raised while building the settings pages, 2026-11-24. Each is built as proposed.

**Q-235 [cut]. Does an area group read a layer from Map layers, or take its own file or service?**
Blocks: the add page's fields; whether the layer is styled in one place or two.
Proposed: It reads a layer that already exists on Map layers. The layer is set up, checked and styled once, there. — The user's "separate to set up, the same to use" keeps the group light; a second upload would be the double setup the discussion wanted to avoid.
Answer: Yes, as proposed (classifications and groups; icon replaces the colour square), with one change: an administrator CAN remove an icon, which falls back to the colour square. (user, 2026-11-24)

**Q-236 [detail]. Which layers can a group read, and can two groups read the same one?**
Blocks: the layer picker's rules.
Proposed: Only layers that send shapes (feature services, GeoJSON); a WMS or a map server sends a picture and is not offered. One group per layer.
Answer:

**Q-237 [cut]. How is a project filed when its work crosses several areas, falls outside all of them, or has no location?**
Blocks: what the counts mean; performance-measure totals per area.
Proposed: It is filed under every area its work touches, whole each time, with no share of overlap. One outside every area, or with no location, is filed under none and counted as such on the group's page.
Answer:

**Q-238 [detail]. What happens to an area group when its layer is deleted on Map layers?**
The prototype keeps the group, marks it "Layer deleted", and files nothing under it. Map layers deletes without mentioning the group.
Blocks: Map layers' delete confirm.
Proposed: Map layers' confirm names the area group that reads the layer; the group stays, marked, until it is given another layer or removed.
Answer:

**Q-239 [cut]. Can a person correct one project's filing by hand?**
Not built. ProjectFirma 1 is believed to allow it with a note; unchecked.
Blocks: the project page's part of this feature.
Proposed: Yes: an area can be added to or taken off a project, the change is marked as made by hand, and it survives a re-count. A project with no location is filed by hand.
Answer:

**Q-235 [cut]. Can a classification and a group be given an icon?** Raised by the user 2026-11-24 ("we should have the ability to assign an icon to the classification as well"). Not settled: whether groups too, what the choice is, where it shows, and what a record has before one is chosen. Design principles say icons mark structure, not items; the user asked for it explicitly, so this is a deliberate deviation.
Blocks: stories 03, 04, 11, 12, 14, 15, 17, 18, 21.
Proposed: Both a classification and a group can have one icon, chosen on their own settings page with the same picker the project stages use (a shortlist, and a search over the whole Hugeicons free set). A new record has none; until one is chosen the colour square leads its name as today. The icon replaces the square beside the name wherever a name leads (Outline, Browse, cards, the settings list, page headings), tinted in the group's colour. A conversion keeps the icon. An administrator can remove the icon; the colour square then leads the name again. (confidence: medium)
Answer:

## funding-sources

Raised while making funding source an entity, 2026-11-24. Each is built as proposed unless it says not built. Q-240, Q-241 and Q-243 were about a funding row's status and requests to a source; both were taken out the same day, and the questions with them.

**Q-242 [detail]. Is a lead organization's own match a funding source in the list?**
Built as one source per organization, named Local Sponsor Match, so every row links to something. It makes the index long.
Blocks: the index's default contents.
Proposed: Yes, but the index hides them behind a filter that is off by default.
Answer:

**Q-244 [detail]. What does a contributor see where New project used to be, when the workspace is not accepting new projects?**
Built: the button is absent, and the New project page shows "This workspace isn’t accepting new projects. Ask an administrator to add yours."
Blocks: the Projects index and the intake page.
Proposed: As built.
Answer:

## Answered

### classifications — nested groups

**Q-152 [detail]. A group's page shows no target. Should it?** Targets are set on classifications (spec #4). Two classifications in a group can set targets on the same measure, due in different years, so the prototype does not add them up; each measure on a group's page reads reported against what its projects planned. Options: no target; the sum when every target on that measure is due the same year; always the sum, with the latest year.
Blocks: the measures section of the group page.
Proposed: No target on a group's page. Each performance measure there reads reported against what its projects planned, as the prototype does — a group has no targets of its own (spec decision 4), and adding up targets due in different years would state a figure nobody set (confidence: high)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). No target on a group's page. Each performance measure there reads reported against what its projects planned, as the prototype does — a group has no targets of its own (spec decision 4), and adding up targets due in different years would state a figure nobody set

**Q-153 [detail]. Removing a group that still holds something.** The prototype refuses until the group holds no classifications and no groups. Options: keep that; move what it holds up one level; remove the whole branch after a confirm that counts it.
Blocks: the remove story for groups.
Proposed: Keep the prototype's rule: a group can be removed only once it holds no classifications and no groups, and until then "Remove" is not offered and the page says what it still holds — the spec already names removal as offered only once the group is empty, and removing a branch whole could unfile many projects in one press (confidence: high)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Keep the prototype's rule: a group can be removed only once it holds no classifications and no groups, and until then "Remove" is not offered and the page says what it still holds — the spec already names removal as offered only once the group is empty, and removing a branch whole could unfile many projects in one press

**Q-154 [detail]. Must a group's name be unique in the whole workspace, or only among the groups beside it?** The prototype refuses a name any other group has. Group pickers already show each group by its full path.
Blocks: validation on add and rename.
Proposed: Unique in the whole workspace, ignoring upper and lower case, as the prototype does — a group's name appears alone, without its path, in places such as a map legend or a dashboard dimension, and loosening the rule later is easy while tightening it is not (confidence: medium)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Unique in the whole workspace, ignoring upper and lower case, as the prototype does — a group's name appears alone, without its path, in places such as a map legend or a dashboard dimension, and loosening the rule later is easy while tightening it is not

**Q-155 [cut]. Does the public see groups?** The public classifications page shows the classifications of the Plan goal group and nothing of the tree. Does a group get a public page, and do public filters offer groups?
Blocks: `public-site` requirements for classifications.
Proposed: Not in the first release. The public sees classifications as it does today; a group has no public page and public filters offer no groups. A public group page is a later story — the spec says "Visitor: not yet", and nothing public should appear that no one decided to publish (confidence: medium)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Not in the first release. The public sees classifications as it does today; a group has no public page and public filters offer no groups. A public group page is a later story — the spec says "Visitor: not yet", and nothing public should appear that no one decided to publish

**Q-157. What happens to a top-level group's contents when its levels change?** The prototype lets a level be renamed at any time, and lets levels be added or removed only while the group is empty (spec #16, my default). Options for a group that already holds things: keep refusing; add a level by putting everything under one new group at that level; remove a level by lifting its contents up one.
Blocks: the edit-levels story.
Answer: (2026-11-23) Withdrawn: levels were withdrawn (spec #20).

**Q-158. May a group be moved to a different top-level group?** The prototype allows it when the branch still fits the new place's levels (same number of levels beneath it), and refuses otherwise. A top-level group itself cannot be moved inside another.
Blocks: the move rules for groups.
Answer: (2026-11-23) Withdrawn: any group may move under any other (spec #20).

**Q-159. Where do level names show to readers?** They are used in Workspace settings (the levels line, every add). Candidates on the reading side: column headers and crumbs on the Classifications pages, the question on the intake form, the map's colour-by list. Related: Q-156.
Blocks: wording on the reading pages and the intake form.
Answer: (2026-11-23) Withdrawn: levels were withdrawn (spec #20).

**Q-160. A classification in no group: where does it show to readers?** The settings list puts them above the groups. The Classifications page's Outline and Browse are built from groups and have no place for one yet.
Blocks: the reading pages' treatment of ungrouped classifications.
Answer: (2026-11-23) Withdrawn: a classification is always in a group; moved out of every group it becomes a group (spec #25).

**Q-161 [cut]. Converting a classification that is in use: what happens to the projects filed under it?** The prototype says they lose it and removes its performance measures and targets after a confirm. Alternative: refuse until it is unused, as removing a classification does.
Blocks: the convert story.
Proposed: Go ahead after a confirm that names every cost, as built ("72 projects filed under it lose it. Its 3 performance measures stop tracking it.") — a person who drags a classification out of every group, or chooses "Convert to group", has said what they mean, and refusing would block the move for most classifications, since most are in use; the confirm is the guard, and the change is recorded (Q-186) (confidence: medium)
Answer (2026-11-24): Confirmed. Converting a classification that projects use goes ahead only after a confirm that tells the person what will happen (projects lose it; its performance measures and targets stop), and they can stop or continue. The user: "I like just letting people know what will happen and they can abort or continue."

**Q-156 [cut]. Where else does a group act as a filter or a colour?** The map colours by "Plan goal" and by "Practice area" (the groups directly inside one sample group), and the dashboard offers one dimension per area of work. Both are sample-data conventions, not a rule. Should any group be offered as a map colouring and a dashboard dimension, and at which level?
Blocks: `map` and `progress-dashboard` requirements that name groups.
Proposed: Every top-level group is offered as a map colouring and as a dashboard dimension, and it colours or splits by whatever sits directly inside it, groups or classifications. Deeper levels are not offered in those two places; a group's own page already reads one branch. Nowhere else does a group act as a filter or colour — it turns the sample's convention into one rule without adding a setting (confidence: low)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Every top-level group is offered as a map colouring and as a dashboard dimension, and it colours or splits by whatever sits directly inside it, groups or classifications. Deeper levels are not offered in those two places; a group's own page already reads one branch. Nowhere else does a group act as a filter or colour — it turns the sample's convention into one rule without adding a setting

**Q-180 [cut]. Who may open Settings › Classifications and see the "Edit classification" / "Edit group" buttons?** The Security setting "Manage classifications" starts at administrators, and a workspace can open it wider. The prototype checks nothing: every reader sees the edit buttons and can open the settings pages.
Blocks: whether readers see edit doors at all (ACN-15, ACN-16); the permission story for SCR-7 to SCR-11.
Proposed: Only people the setting lets in (Administrators by default) see the edit buttons and can open Settings › Classifications; for everyone else the buttons are not shown, and a settings address opened directly says "You don't have permission to change classifications." with a link back to the Classifications page — the setting and its default are already decided, and a button the reader can never use only invites a request nobody can grant (confidence: high)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Only people the setting lets in (Administrators by default) see the edit buttons and can open Settings › Classifications; for everyone else the buttons are not shown, and a settings address opened directly says "You don't have permission to change classifications." with a link back to the Classifications page — the setting and its default are already decided, and a button the reader can never use only invites a request nobody can grant

**Q-181 [detail]. Four spec decisions no longer match what is built.** #15 says one tree table with a "Targets set" column; #18 says a new top-level group keeps its add page because it asks its levels; #19 says levels limit where a row can land; #22 says the header adds a classification in no group. Later decisions (#20, #22, #24, #25) replaced all four.
Blocks: nothing; the stories read the later decisions. A document that disagrees with the product is a trap for whoever reads it next.
Proposed: Correct the four rows: leave the old text, mark each "replaced by #n", and add one new row for the settings list as built (grouped rows, Name, Projects, Performance measures; adds and moves in place) — the later decisions were the user's and the earlier text is the stale one (confidence: high)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Correct the four rows: leave the old text, mark each "replaced by #n", and add one new row for the settings list as built (grouped rows, Name, Projects, Performance measures; adds and moves in place) — the later decisions were the user's and the earlier text is the stale one

**Q-182 [cut]. Are the "Add classification" and "Add group" pages still wanted?** Every add is now a row in place (#22). The pages (SCR-10, SCR-11) remain as the no-script links and as buttons on a group's settings page.
Blocks: whether two page stories exist.
Proposed: Drop both pages. Every add is a row in place, which is what the user asked for ("like tags"), and a second way to add the same thing is more surface to build, test and explain (confidence: medium)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Drop both pages. Every add is a row in place, which is what the user asked for ("like tags"), and a second way to add the same thing is more surface to build, test and explain

**Q-183 [cut]. Does a group's settings page keep its two member lists?** The page lists the group's classifications and its groups, each reorderable, each with an "Add" that opens an add page. The settings list now orders, adds, moves and converts in place.
Blocks: whether SCR-9 has two sections or none beyond details and remove (ACN-39, ACN-40).
Proposed: Remove the member lists. The group's page keeps its details, parent group, colour and remove; ordering and adding live in one place, the list (confidence: medium)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Remove the member lists. The group's page keeps its details, parent group, colour and remove; ordering and adding live in one place, the list

**Q-184 [cut]. Does a group's page keep a card board of what is inside it?** The Classifications page replaced cards with Outline and Browse (#6). A group's page still shows its contents as cards (each classification with up to three measure rows, groups inside as collapsible sections with "Open group").
Blocks: SCR-6's contents section.
Proposed: Keep it. It is the group page's answer to "what is in this group, and how far along is each", and removing it would leave a page of totals with no way into its contents but the settings list (confidence: medium)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Keep it. It is the group page's answer to "what is in this group, and how far along is each", and removing it would leave a page of totals with no way into its contents but the settings list

**Q-185 [cut]. Converting a group with "Remove them": what if projects work toward the classifications beneath it?** Removing a classification alone is refused while a project works toward it. The conversion's "Remove them" removes every classification beneath the group, in use or not.
Blocks: the group-to-classification story; RUL-10.
Proposed: "Remove them" is offered only when no classification beneath the group is in use. Otherwise the dialog says how many are, and offers only "Keep them" and "Cancel" — a conversion must not delete what a removal would refuse to (confidence: medium)
Answer (2026-11-24): Confirmed ("that makes sense"). "Remove them" is offered only when no classification beneath the group is in use. Otherwise the dialog says how many are, and offers only "Keep them" and "Cancel" — a conversion must not delete what a removal would refuse to

**Q-186 [detail]. Is each structure change recorded, and can any be undone?** Adds, renames, moves, conversions, removals, sorts and target changes. The prototype keeps no history and has no undo.
Blocks: an enabler story for the change record.
Proposed: Each change is written to the change log the workspace keeps, with who and when, visible to administrators. There is no undo in the first release beyond the confirms shown; a person puts things back by moving or converting them again (confidence: low)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Each change is written to the change log the workspace keeps, with who and when, visible to administrators. There is no undo in the first release beyond the confirms shown; a person puts things back by moving or converting them again

**Q-188 [detail]. Two administrators arranging the tree at the same time.**
Blocks: the save behavior for moves, adds and conversions.
Proposed: Each change saves on its own and the last save wins. A row someone else already moved or removed returns to its current place the next time the page refreshes, and the person is told "Someone else changed this." There are no locks (confidence: low)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Each change saves on its own and the last save wins. A row someone else already moved or removed returns to its current place the next time the page refreshes, and the person is told "Someone else changed this." There are no locks

**Q-189 [detail]. Limits on names, descriptions, depth and count.** The prototype has none.
Blocks: validation text on every add and rename.
Proposed: A name up to 100 characters and a description up to 300; no limit on depth or count, designed for six levels and five hundred classifications. At a limit the field says how many characters are left and does not accept more (confidence: low)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). A name up to 100 characters and a description up to 300; no limit on depth or count, designed for six levels and five hundred classifications. At a limit the field says how many characters are left and does not accept more

**Q-190 [detail]. In what order do lists start, and does anything sort by itself?** Seeded lists are in the order they were written; a new item joins the end; "Sort A to Z" is the way back (#27).
Blocks: the default order story.
Proposed: As built: lists start in the order things were created, a new item joins the end, and nothing sorts by itself, so an order someone arranged never changes underneath them. "Sort A to Z" is on demand only (confidence: high)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). As built: lists start in the order things were created, a new item joins the end, and nothing sorts by itself, so an order someone arranged never changes underneath them. "Sort A to Z" is on demand only

**Q-191 [detail]. Does anyone get notified when the tree changes?**
Blocks: nothing unless yes.
Proposed: No. The change record (Q-186) is where a change is seen; a notification for every rename would be noise to everyone but the person who made it (confidence: medium)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). No. The change record (Q-186) is where a change is seen; a notification for every rename would be noise to everyone but the person who made it

**Q-192 [detail]. Sharing a link to one group or classification in Browse.** The chosen row is kept in the web address (`#g:<group>`, `#c:<classification>`), so a link opens Browse on it. Outline has no link to a row.
Blocks: the Browse story's last scenario.
Proposed: Keep it as built: a link ending `#g:` or `#c:` opens Browse on that record, whatever view the reader last chose; Outline has no per-row link (confidence: medium)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Keep it as built: a link ending `#g:` or `#c:` opens Browse on that record, whatever view the reader last chose; Outline has no per-row link

**Q-193 [detail]. What do the Classifications page and the settings list show before anything is set up?** The page draws an empty table and an empty list. The settings list says "No classifications yet — Add a group, or a classification on its own", although a classification can no longer stand alone (#25).
Blocks: STA-15, STA-30.
Proposed: The Classifications page says "No classifications yet" and, to people who may set them up, adds a link "Set up classifications" to Settings. The settings list says "No groups yet. Add one to start." with "Add group" (confidence: medium)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). The Classifications page says "No classifications yet" and, to people who may set them up, adds a link "Set up classifications" to Settings. The settings list says "No groups yet. Add one to start." with "Add group"

**Q-194 [detail]. What does a removed classification's or group's page show?** The prototype shows a warning "Removed in Workspace settings." in place of the figures. A record can be removed only when nothing depends on it, so the only way to reach its page is an old link.
Blocks: STA-26.
Proposed: The same "not found" page as any removed record, with a link back to Classifications (confidence: low)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). The same "not found" page as any removed record, with a link back to Classifications

**Q-195 [cut]. Where does a classification's own colour get changed?** A new one is dealt a colour; the map and charts use it to tell classifications of one group apart; lists use the group's colour (#9). No screen edits it.
Blocks: a field on SCR-8.
Proposed: Add a Color control to a classification's settings page, the same one a group has. The map and charts keep using the classification's own colour; lists keep the group's (confidence: medium)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Add a Color control to a classification's settings page, the same one a group has. The map and charts keep using the classification's own colour; lists keep the group's

**Q-196 [detail]. What counts as "in use" for removing or converting a classification?**
Blocks: the removal and conversion messages.
Proposed: Any project that carries it, in any stage and whether or not it is published, counts; the messages give that number (confidence: medium)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Any project that carries it, in any stage and whether or not it is published, counts; the messages give that number

**Q-197 [detail]. A performance measure retired while it is linked to a classification.** The pages and the editor's list leave retired measures out.
Blocks: nothing visible unless a measure is retired and brought back.
Proposed: The measure drops off the pages and the editor, and its link and target are kept, so bringing the measure back restores them as they were (confidence: low)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). The measure drops off the pages and the editor, and its link and target are kept, so bringing the measure back restores them as they were

**Q-199 [detail]. A save fails (the connection drops, the saved tree changed under you).** Every change in the prototype saves in the browser and cannot fail.
Blocks: the failure scenario on every add, move, convert and remove.
Proposed: The row returns to where it was and a message under the page title says "Couldn't save the change. Try again." Nothing else the person did is lost (confidence: medium)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). The row returns to where it was and a message under the page title says "Couldn't save the change. Try again." Nothing else the person did is lost

**Q-200 [cut]. Search or filter on the Classifications pages?** The pages have none; Outline folds and Browse lists.
Blocks: whether a search story exists.
Proposed: Not in the first release. Folding and the Browse list are how a reader narrows a tree of dozens; add search when a workspace's tree outgrows them (confidence: medium)
Answer (2026-11-24): Accepted as proposed (no objection on the validation page). Not in the first release. Folding and the Browse list are how a reader narrows a tree of dozens; add search when a workspace's tree outgrows them

**Q-201 [detail]. A Viewer with no organization: what do the app's classification figures count?** Q-187 settled that the app counts every project and the public site only published ones. The roles document says a Viewer with no organization "sees exactly what the public sees".
Blocks: the last scenario on the figures for that one reader.
Proposed: That Viewer sees the public site's figures (published projects only) on the Classifications pages, as the roles document already says; every other signed-in reader sees the all-projects figures — the Viewer's rule is written and decided, and a person with no organization has no claim to unpublished work (confidence: medium)
Answer (2026-11-24): Confirmed ("that's exactly right"). That Viewer sees the public site's figures (published projects only) on the Classifications pages, as the roles document already says; every other signed-in reader sees the all-projects figures — the Viewer's rule is written and decided, and a person with no organization has no claim to unpublished work

**Q-187 [cut]. Which projects do the figures on the Classifications pages count?** The prototype sums every project in the workspace, whatever its stage and whether it is published. The public classifications page counts published projects only, and the roles document says a Viewer with no organization "sees exactly what the public sees".
Blocks: every figure on SCR-2 to SCR-6; the dependency on `publish-review`.
Proposed: The same figures for everyone: published values, matching the public page, so one number never differs between two places a funder might look. Staff see live values on the project record, as before — never present a number as the whole when it is only some of it (confidence: low)
Answer (2026-11-24): The pages inside the app count every project. Only the public site counts published projects alone. (A Viewer with no organization: see Q-201.)

**Q-198 [cut]. Is bringing in a tenant's existing ProjectFirma 1.x classifications part of the first release?** In dev only, the prototype can fill the tree from a tenant's own classification systems and taxonomy. No build does.
Blocks: an import story and its mapping rules.
Proposed: Later release. The first release starts a workspace with an empty tree built in Settings; migration is its own feature with its own stories (confidence: medium)
Answer (2026-11-24): Out of scope. Migrating a client's ProjectFirma 1.x data will be scoped per client at a future date; the dev-only import in the prototype is not a requirement.

**Q-151. May one group hold both classifications and groups?** The prototype allows it: Forests & fuels holds the classification Forest thinning and the group Fire management, and its board section shows its own classifications first, then the groups inside it. The other rule would be: a group holds either groups or classifications.
Blocks: the add and move rules for groups and classifications.
Proposed: Yes. A group may hold classifications and groups together; its section shows its own classifications first, then the groups inside it, as the prototype does — the workspace decides the shape of its tree (spec decision 1), and forbidding the mix would force an empty wrapper group around a lone classification (confidence: medium)
Answer (2026-11-23): Yes. First answered no, with declared levels; reversed the same day. The tree is free (spec #20).

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

**Q-52 [detail]. Sending documents to a model provider.** For every workspace, or must a workspace agree or be able to switch it off? The documents hold names, emails and budgets. If the answer is client-sensitive it goes in `docs/private/requirements/project-updates/`.
Needs you: whether clients' documents (names, emails, budgets) may be sent to an outside model provider for every workspace, and on what contract terms. Assumed meanwhile: reading is on for every workspace, with a provider under terms that forbid training on the documents and keeping them after the reading; the choose step says once that the document is read by an AI service; there is no per-workspace switch in the first release; nothing of the workspace beyond the project's measures and fields is sent (Q-89).
Answer: Reading a report with an outside AI service is a workspace setting. It is off until an administrator of the workspace agrees and turns it on; the administrator can turn it off again; and it can be made unavailable to a workspace altogether, where that client's terms do not allow its documents to go to an outside provider. While it is off or unavailable, Import a report is not offered for that workspace, and the place it would be says why. (2026-11-23; the user chose options 2, 3 and 4: agree first, can switch off, not allowed for some clients. Recorded as spec decision 41.)

**Q-45 [detail]. The kept document.** How long is it kept, can it be downloaded, who can delete it, is opening it logged? Is pasted text held to the same rules?
Needs you: how long a kept document must be kept, and whether the organization or a client requires that documents can be deleted on request or that opening one is logged; these are policy or contract facts. Assumed meanwhile: kept for as long as its project exists; people who can edit or publish the project can open and download it; nobody deletes one on its own (it goes when its import is undone or its project is deleted); opening it is not logged; pasted text is held to the same rules.
Answer: The report or spreadsheet is used only to read data from. The file is not kept after the import is added (or abandoned); pasted text likewise. What stays with each imported change is the document's name and the words it was read from (its quote). (2026-11-23; the user: "these reports and spreadsheets are only used for data extraction, we don't have to keep the files". Keeping the name and quote is Claude's proposal, awaiting confirmation. Recorded as spec decision 42, which replaces 19 and amends 31.)

**Q-135 [cut]. Correcting by hand what an import added.** Story 23, R6 (interview Q-24) says that once the toast is gone "each thing it added is corrected by hand on the project page". In the prototype a person can correct or clear a performance measure figure and edit a Key facts field on the project page, but the Funding sources table has no way to edit or remove a row ("Add source" is not wired), and Contacts offers nothing to edit or remove an imported contact ("Add contact" only). (a) Can a person edit and remove a funding source and a contact an import added, as any other? Which feature owns that (Q-16)? (b) If an imported row is edited by hand, does it keep "From `<document name>`"? (c) Until that exists, is toast-only "Undo" still acceptable for an import that added a funding source or a contact? Marked [cut] because the answer can add a story, or move funding sources and contacts out of the first release. Related: Q-64, Q-88 (a tester cannot get back to the start either). Stories: 17, 23. It bears on story 18.
Proposed: Toast-only "Undo" stands. To keep it workable, one story is added to the first release: on the project page, anyone who can edit the project can edit and remove a funding source row and a contact row, whether an import or a person added it; each change saves at once and waits for publish like any other edit (spec #1). (a) Yes, as any other; `project-record` owns the two controls because it owns the project page, and funding sources and contacts from an import do not ship without it. If that story has to be cut down, the least that keeps the decision workable is "Remove" on each row. (b) An imported row edited by hand keeps "From `<document name>`" for as long as its import exists, and the review marks the figure as changed from the document's (spec #36). (c) Yes: toast-only "Undo" is acceptable once those rows can be corrected by hand; without the story it is not, because a wrong imported amount could never leave the record — totals must be correctable, and the page already shows "Add source" and "Add contact" unwired, so this is surface the product intended (confidence: medium)
Answer: Yes: on the project page a person can edit and remove a funding source, and edit and remove a contact. Undo stays on the toast only. The project page is not finished in the prototype, so its absence there was not a decision. (2026-11-23)
