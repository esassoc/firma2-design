# System map

Updated: 2026-11-24

The level above a feature: what the features are, what they share, and who owns each shared thing. A behavior has one owner; other features depend on it.

Built from the prototype registry (`src/data/prototypes.ts`), the specs under `.scratch/`, `docs/product-brief.md`, `docs/roles-and-permissions.md`, the two decision records, and the header and imports of every route file. No component was read in full, so every ownership call below is a first reading that each harvest refines.

Reading notes:

- Routes are written relative to `/prototypes/`. `ws/` stands for `workspace-settings/`.
- Actors are the four readers of `docs/product-brief.md` §1 (marked not yet validated there), with the workspace role the specs name in brackets.
- † marks a term the glossary does not define yet. Each is a question for the interview.
- No feature has a `manifest.json`, so every state is `exploring`.
- Outside the map: `/`, `/design-system/**` and `/patterns` are the spoke's own index and component documentation, not product routes.

## Features

| Slug | Goal | Actors | Routes | Spec | State |
|---|---|---|---|---|---|
| `projects-index` | Find a project, or the way back to one in progress | Program staff, Sponsor / reporter | `projects` | `.scratch/projects-index/spec.md` | exploring |
| `project-record` | Read one project in full and correct what is wrong, field by field | Sponsor / reporter (Contributor), Program staff, Executive | `projects/[project]`, `projects/[project]/map` | `.scratch/project-detail-layout/spec.md` (exploration log, no numbered decisions) | exploring |
| `project-intake` | Propose a new project on the workspace's one intake form; build that form | Sponsor / reporter (Contributor), Program staff (Administrator, Manager) | `projects/new`, `projects/intake`, `ws/intake-form`, `ws/solicitations` | `.scratch/project-intake/spec.md`, revised by `.scratch/form-canvas/spec.md` | exploring |
| `import-projects` | Bring many projects in from a spreadsheet | Program staff (Administrator) | `projects/import` | none (brief §6) | exploring |
| `work-areas` | Give projects their footprint: draw, drop, paste, or upload one file for many | Sponsor / reporter, Program staff | `projects/import-work-areas`; placing one project happens on `projects/[project]` | none | exploring |
| `map` | Land on your projects, on a map | Sponsor / reporter (Contributor) | `map`, `my-projects` (redirect) | none | exploring |
| `project-updates` | Update a project from a report already filed, and record where every change came from | Sponsor / reporter (Contributor) | `projects/[project]/import-report` | `.scratch/project-updates/spec.md` (decisions 1 to 29) | exploring |
| `project-photos` | Say what each photo is: stage, photo point, collection, featured, public, date and place | Sponsor / reporter (Contributor), Public / partner | `projects/[project]` (Photos), `public/[project]` | `.scratch/project-photos/spec.md` (decisions 1 to 11) | exploring |
| `publish-review` | Check the net difference between a project's record and its public page, then publish | Program staff (Manager, Administrator) | `review`, `review/[project]`, `organizations/[organization]/review`, `ws/organization-settings/review` | `.scratch/project-updates/spec.md` (decisions 30 to 38 and "How a change reads in review"); brief §4 "Review the net diff" | exploring |
| `updates-feed` | See everything that changed, newest first | Program staff, Executive | none — the Updates pages were removed 2026-11-24; organization Home keeps Latest updates | none | exploring |
| `organization-pages` | Find an organization and read its work: the list of organizations, and each one's front page (with who it is and its members), projects and owed reports | Program staff, Executive, Public / partner | `organizations` (index), `organizations/[organization]` (index for every visible organization; `projects`, `review`, `reports` for the reader's own) | `.scratch/directory-pages/spec.md` | exploring |
| `members` | Find a person in the workspace and see their role and organizations | every signed-in reader | `members` (index), `members/[member]` | `.scratch/directory-pages/spec.md` | exploring |
| `support-requests` | Answer the questions and problems people send the workspace's administrators | Program staff (Administrator) | `support-requests` (inbox), `support-requests/new`, `support-requests/[request]`, `support-requests/draft` | `.scratch/directory-pages/spec.md` | exploring |
| `access-requests` | Get into the workspace and into an organization; ask for one that is not listed | Public / partner (newcomer, Viewer), Program staff (Manager, Administrator) | `sign-in`, `welcome`, `welcome/new-organization`, `join`, `join/new-organization`, `ws/organizations/requests/[id]` | `.scratch/access-requests/spec.md` | exploring |
| `organizations-admin` | Add, describe, open up and remove organizations; run one organization's members and settings | Program staff (Administrator, Manager) | `ws/organizations`, `ws/organizations/new`, `ws/organizations/[organization]`, `ws/organization-settings` (index, `general`, `members`, `access`, `notifications`) | `.scratch/access-requests/spec.md` (decisions 7, 10, 13, 19, 20), `docs/roles-and-permissions.md` | exploring |
| `users-and-security` | Decide who can sign in, with what role, and what each role may do | Program staff (Administrator) | `ws/users`, `ws/security` | `docs/roles-and-permissions.md`, `.scratch/users-and-security/spec.md` | exploring |
| `performance-measures` | Define a performance measure once, then read the portfolio's progress on it | Program staff (Administrator), Executive, Public / partner | `performance-measures`, `performance-measures/[measure]`, `performance-measures/new` (redirect), `ws/performance-measures` (index, `[measure]`, `draft`, `new`) | none (`docs/measure-model.md`) | exploring |
| `classifications` | Set the goals the workspace tracks, with the performance measures and targets for each; read progress against them | Program staff (Administrator), Executive, Public / partner | `classifications`, `classifications/[classification]`, `classifications/groups/[group]`, `ws/classifications` (index, `new`, `draft`, `[classification]`, `groups/new`, `groups/draft`, `groups/[group]`) | `.scratch/classifications/spec.md` (decisions 1 to 5: nested groups) | exploring |
| `project-types` | Define the kinds of work, and what each asks and shows | Program staff (Administrator) | `ws/project-types` (index, `new`, `draft`, `[type]`) | none | exploring |
| `stages` | Define the project lifecycle and what each stage switches on | Program staff (Administrator) | `ws/stages` | none | exploring |
| `custom-fields` | Add the workspace's own facts to projects and to funding sources | Program staff (Administrator) | `ws/custom-fields`, `ws/funding-source-fields` | none (`docs/field-patterns.md`) | exploring |
| `workspace-look-and-language` | Make the product look and speak like the workspace: brand colour, terminology, menu order, table columns | Program staff (Administrator) | `ws/branding`, `ws/labels`, `ws/vocabulary`, `ws/menu-order`, `ws/grid-defaults` | none | exploring |
| `gis-data-sources` | Keep projects and footprints current from the workspace's own GIS | Program staff (Administrator) | `ws/project-source`, `ws/gis-subscriptions`, `ws/gis-subscriptions/new`, `ws/gis-sync` | `.scratch/project-updates/spec.md` (decisions 22 to 29, specified not built) | exploring |
| `map-layers` | Set what every map is made of: base map, colours, reference boundaries | Program staff (Administrator) | `ws/map-layers` | `.scratch/map-layers/spec.md` (decisions 1–2) | exploring |
| `funding-sources` | Keep the list of funding sources; read what each has put into projects | Program staff (Administrator, Manager), Sponsor / reporter (Contributor) | `funding-sources`, `funding-sources/[source]`, `funding-sources/new`; a project's rows are on `projects/[project]` | `.scratch/funding-sources/spec.md` (decisions 1 to 8) | exploring |
| `geospatial-areas` | File projects by where they are: groups of areas read from reference layers | Program staff (Administrator) | `ws/geospatial-areas`, `ws/geospatial-areas/new`, `ws/geospatial-areas/group`, `ws/geospatial-areas/area`, `geospatial-areas`, `geospatial-areas/[group]/[area]` | `.scratch/geospatial-areas/spec.md` (decisions 1–4) | exploring |
| `progress-dashboard` | Put the workspace's figures on one screen; add more dashboards | Executive, Program staff (Administrator) | `progress-dashboard`, `pages/dashboard/[template]`, `pages/new-dashboard` | none (brief §6) | exploring |
| `custom-pages` | Keep the workspace's own pages, documents and folders | Program staff (Administrator), all readers | `pages/page`, `pages/document`, `pages/new`, `pages/new-document`, `pages/new-folder`, `ws/custom-pages` | `.scratch/form-canvas/spec.md`, `docs/adr/0001-one-editing-grammar-for-builder-canvases.md` | exploring |
| `public-site` | Show the public what is published, with no account | Public / partner | `public/` (index, `[project]`, `projects`, `organizations`, `classifications`, `performance-measures`, `dashboard`, `pages/[page]`) | `.scratch/public-views/inventory.md` (an inventory, not a `spec.md`), `.scratch/public-views/map-popup-decision.md` | exploring |
| `public-site-settings` | Make the public site the workspace's own: sections of the home, navigation, fonts and colours, footer, identity; draft then publish | Program staff (Administrator) | `ws/public-site/[part]` (`home`, `navigation`, `theme`, `footer`, `details`) | `.scratch/public-site-settings/spec.md` (decisions 1 to 14) | exploring |
| `connected-orgs` | Report one project record to every program it belongs to | Sponsor / reporter, Program staff (both workspaces' Administrators) | none of its own; the program section on `projects/[project]` | `.scratch/connected-orgs/spec.md`, `docs/adr/0002-a-workspace-can-act-as-an-organization.md` | exploring |
| `personal-settings` | Set how the product looks, signs in and emails for one person | every signed-in reader | `settings` (redirect), `settings/preferences`, `settings/profile`, `settings/notifications`, `settings/security` | none | exploring |
| `workspace-administration` | Name the workspace; get records in and out of it | Program staff (Administrator) | `workspace-settings` (redirect), `ws/general`, `ws/import-export` | none | exploring |
| `whats-new` | Read what changed in the product | every signed-in reader | `changelog` | none | exploring |
| `team-5-sandbox` | Hold the hackathon team's project-update screens until Import a report replaces them | Sponsor / reporter, Program staff (Administrator) | `team-5` (index, `changes`, `my-projects`, `projects/[project]`, `projects/[project]/update`) | `.scratch/project-updates/spec.md` decision 39 (delete whole) | exploring |

Specs that are not features: `.scratch/form-canvas/spec.md` (an editing grammar two features share; see Unowned) and `.scratch/mobile-foundation/spec.md` (a responsive pass over every route).

## Experiments (not features)

| Route | What it explores | Feeds feature |
|---|---|---|
| `/proto/project-showcase/[project]` | The public project page four ways | `public-site` |

## Shared objects

| Object | Lifecycle owned by | Read by |
|---|---|---|
| Workspace | `workspace-administration` | every feature |
| Organization | `organizations-admin` (only administrators create one; `access-requests` raises the request) | `organization-pages`, `access-requests`, `users-and-security`, `project-intake`, `project-record`, `publish-review`, `public-site`, `project-updates` |
| Connected organization, Shared project | `connected-orgs` | `project-record`, `publish-review`, `public-site` |
| Scope rule, Minimum | `connected-orgs` | `project-intake` (asks "Share with [program]?"), `project-record` (program section), `publish-review` (incomplete shared projects) |
| Crosswalk | `connected-orgs` | `performance-measures`, `project-types`, `custom-fields` |
| Performance measure | `performance-measures` | `project-record`, `classifications`, `progress-dashboard`, `project-updates`, `publish-review`, `public-site`, `connected-orgs`, `pm2` |
| Project † | `project-record` edits it. It is created in three places: `project-intake`, `import-projects`, `gis-data-sources` | nearly every feature |
| Proposal † (a draft project awaiting approval) | `project-intake` | `publish-review` (Proposals in the inbox), `access-requests` (decision 28), `map`, `public-site` |
| Change and change log † | `project-updates` (every change, with its source) | `publish-review`, `updates-feed`, `project-record` |
| Published version † (the snapshot the public reads) | `publish-review` | `public-site`, `project-record`, `organization-pages`, `connected-orgs` (frozen copy) |
| Role, Manager, membership † | `users-and-security` (membership edited in `organizations-admin`) | every feature that gates an action |
| Join request, new-organization request † | `access-requests` | `organizations-admin`, `users-and-security`, `project-record`, `project-intake` |
| Classification, classification group | `classifications` | `project-record`, `project-intake`, `performance-measures`, `progress-dashboard`, `public-site` |
| Project type † | `project-types` | `project-intake`, `project-record`, `import-projects`, `connected-orgs`, `public-site` |
| Stage † | `stages` | `project-record`, `projects-index`, `project-intake`, `public-site` |
| Custom field † | `custom-fields` | `project-intake` (places fields, never makes them), `project-record`, `project-types`, `import-projects`, `project-updates` |
| Work area † | `work-areas` | `project-record`, `map`, `gis-data-sources`, `public-site`, `organization-pages`, `performance-measures` |
| Data source † | `gis-data-sources` for the workspace kind, the only kind built | `project-updates`, `publish-review`, `project-record` |
| Map layer † | `map-layers` | every feature that draws a map; `geospatial-areas` reads one per area group |
| Geospatial area, area group | `geospatial-areas` | none yet; by decision 1, every feature that offers classification groups |
| Custom page, document, folder † | `custom-pages` | `public-site` |
| Dashboard † | `progress-dashboard` | `public-site` |
| Saved view † | `organization-pages` | `projects-index`, `public-site` (folds in as filter addresses) |
| Brand colour and terminology † | `workspace-look-and-language` | every feature (navigation labels), `public-site` |
| Funding source, project funding row | `funding-sources` | `project-record`, `classifications`, `project-updates`, `custom-fields`, `public-site` |

## Shared surfaces

| Surface | Owned by | Used by |
|---|---|---|
| Review queue and inbox, with the struck-and-marked change list (`firma2-review-queue`, `firma2-review-inbox`, `firma2-review-changes`) | `publish-review` | `project-intake` (Proposals), `project-updates` (source and note per row), `connected-orgs`, `organization-pages` (navigation door) |
| Publish state on the project page (`firma2-project-publish-state`) | `publish-review` | `project-record` |
| Request edit access on the project page (`firma2-project-edit-access`) | `access-requests` | `project-record` |
| Request list (`firma2-access-request-list`) | `access-requests` | `organizations-admin` (Members, Organizations), `users-and-security` (Users) |
| Program requirements section (`firma2-program-requirements`) | `connected-orgs` | `project-record` |
| Imported notice with Undo, and the Import a report entries on the project page (`firma2-project-imported`, measures card, "…" menu, file drop) | `project-updates` | `project-record` |
| GIS status on the project page (`firma2-project-gis-status`) | `gis-data-sources` | `project-record` |
| Project grid: search, filters, count, export (`firma2-project-grid`) | `projects-index` | `organization-pages` (Projects, one saved view) |
| Project peek panel (`firma2-project-peek-layout`) | `projects-index` | `map`, `classifications`, `performance-measures`, `organization-pages`, `organizations-admin` |
| Updates feed (`firma2-org-updates`) | `updates-feed` | `organization-pages` (Home) |
| Public project page (`firma2-public-project`) | `public-site` | `workspace-look-and-language` (Branding preview), `project-types` (live preview), `publish-review` (View public page) |
| Record rail, record bar and rail modes (`firma2-record-rail`, `firma2-record-bar`, `firma2-rail-modes`) | `project-record` (inferred) | `performance-measures` |

## Shared rules

| Rule | Owned by | Obeyed by | Source |
|---|---|---|---|
| The public page and reports show only published values. Nothing is published because time passed. | `publish-review` | `public-site`, `project-record`, `performance-measures`, `classifications`, `progress-dashboard`, `organization-pages`, `connected-orgs` | project-updates spec, decision 2; brief §3 |
| A public figure shows when it was last published. | `publish-review` | `public-site` | project-updates spec, decision 4 |
| Every edit saves to the record at once, however it arrived. There is no "project update" form or request. | `project-updates` | `project-record`, `gis-data-sources`, `import-projects`, `team-5-sandbox` (contradicts it; to be deleted) | project-updates spec, decisions 1, 6, 39 |
| Every change carries one of three sources: by hand, a named document, a named data source. | `project-updates` | `publish-review`, `updates-feed`, `project-record`, `gis-data-sources` | project-updates spec, decision 5 |
| A workspace data source publishes without review; organization and project sources are staged. | `publish-review` | `gis-data-sources`, `updates-feed` | project-updates spec, decisions 3, 24, 25 |
| A work area's shape changes only from spatial data, never from a report's prose. | `work-areas` | `project-updates`, `gis-data-sources` | project-updates spec, decision 11 |
| Roles are fixed: Administrator, Contributor, Viewer. Manager is a flag on one membership. What varies is a "who can" setting on the action. | `users-and-security` | every feature that gates an action | `docs/roles-and-permissions.md`; brief §4 |
| A Contributor edits projects led by an organization they belong to. Funding a project gives no edit rights. | `users-and-security` | `project-record`, `project-updates`, `project-intake`, `map` | access-requests spec, decision 3 |
| A Viewer reads published values everywhere; with no organization, a Viewer sees exactly what the public sees. | `access-requests` | `public-site`, `project-record`, `organization-pages` | access-requests spec, decisions 9, 14 |
| Only administrators create an organization or approve a request for one. | `organizations-admin` | `access-requests`, `project-intake` | access-requests spec, decisions 7, 11, 28 |
| An unverified organization cannot publish its own projects; an administrator publishes for it. | `access-requests` | `publish-review`, `public-site` | access-requests spec, decisions 6, 8 |
| Request surfaces name the role, never the managers or their emails, not even in page data. | `access-requests` | `project-record`, `public-site`, `organization-pages` | public-views inventory, "Rules already settled" |
| A private organization's projects are not public. | `organizations-admin` | `public-site`, `publish-review` | public-views inventory; `ws/organization-settings/access` |
| A stage decides whether its projects are shown on the public site. | `stages` | `public-site`, `map` | public-views inventory |
| A proposal does not count in reports or on the public map until a manager approves it. | `project-intake` | `publish-review`, `public-site`, `map`, `progress-dashboard` | project-intake spec, Problem Statement and Solution |
| Only the owning organization edits a shared project. The program reviews it, and edits only funder-owned fields. | `connected-orgs` | `project-record`, `publish-review` | connected-orgs spec, decisions 11, 12; ADR 0002 |
| A performance measure links to another, or adds up across organizations, only when the counting rules match. | `performance-measures` | `connected-orgs`, `classifications`, `progress-dashboard` | glossary (Crosswalk); connected-orgs spec, decision 16 |
| Projects are filed on classifications only, and a classification is always in a group. A group adds up what is beneath it, each project once. | `classifications` | `project-record`, `project-intake`, `map`, `progress-dashboard`, `public-site` | classifications spec, decisions 3, 5, 25 |
| A label naming a renameable noun shows the workspace's own word for it. | `workspace-look-and-language` | every feature | `src/data/firma2-nav.ts:34` (inferred) |

## Waiting on answers

Every item in this section is a question in `.scratch/open-questions.md`, where it is answered: the ten below are Q-9 to Q-18 in order, the standing questions are Q-1 to Q-4, and the conflicts are Q-5 to Q-8.

**Answered 2026-11-23 (spec decision 40):** Q-2 and Q-10. GIS subscriptions and GIS sync become one feature with a setting per subscription: authoritative (its fields are locked here) or not (edits here are sent back, two-way). `gis-data-sources` owns the one-owner-per-field rule.

Rules and surfaces with no clear owner:

- **One editing grammar for builder canvases** (add from a blank line, act from the grip, settings on the block, the same keys). Stated by `.scratch/form-canvas/spec.md` and ADR 0001, used by `project-intake` (the builder) and `custom-pages`. Neither is the obvious owner, and the spec is not a feature.
- **One owner per field: a field kept by a data source is read-only by hand** (project-updates spec, decision 27). `gis-data-sources` holds two rival builds: GIS subscriptions locks the fields a layer maintains, GIS sync lets either side edit and the latest change wins. The owner and the rule both wait on which one stays.
- **Public site switches** (*Public access*, *Contact details*). Moved on 2026-11-24 to `ws/public-site/details` (`public-site-settings`, decision 7); the behavior they govern is `public-site`'s and is not built.
- **Not-public states** (unpublished project, private organization, hidden stage, public access off, page not shared). One of five is built. Each is caused by a different feature and all are shown by `public-site`.
- **Taxonomy record pages** (`firma2-taxonomy-details`, `firma2-taxonomy-create-form`, `firma2-taxonomy-danger-zone`): the shared add, rename and remove behavior for `classifications`, `project-types` and `tags`.
- **Notification settings** (`firma2-settings-notifications`): one surface rendered by `personal-settings` and by `organizations-admin`. Who owns what the product emails about?
- **Portfolio map and its export** (`firma2-portfolio-map`, `firma2-portfolio-export`): their own route was deleted on 2026-11-24; Organization Home still renders them. **Project set map** (`firma2-project-set-map`) is rendered by `organization-pages` and `performance-measures`. Candidates: `map` or `work-areas`.
- **Funding source** has an owner since 2026-11-24: `funding-sources` (list, record and add built; editing a source is not). Its fields are still defined in `custom-fields`.
- **Project creation** has three doors (`project-intake`, `import-projects`, `gis-data-sources` through Project source) and no single owner for the rule that says which doors a workspace has open.
- **Reports.** The rule above says reports show only published values, but no report exists yet (brief §7); `organization-pages` holds only the list of reports owed.

Features whose standing the user must settle before any harvest:

- **`pm2` or `performance-measures`: settled 2026-11-24.** One measure model (`docs/data-model.md`, decision 2). The PM 2 comparison pages were removed from the prototype; they remain in git history.
- **GIS subscriptions or GIS sync**, inside `gis-data-sources`. Same situation.
- **`team-5-sandbox`.** Decision 39 deletes it once the Import a report page exists, and that page exists. It is a feature here only because it sits outside the experiments directories.
- **`ws/vocabulary` and `ws/grid-defaults`** use an older settings navigation and are not in the navigation model; `ws/labels` ("Terminology") appears to have replaced `ws/vocabulary`. Live, or left over?
- **Registry rows that no longer match a route's job:** `report-import` ("Report from a document") points at the project page, but the side sheet it described was removed (project-updates spec, decision 7); `my-projects` is titled Map.

Conflicts between sources (surfaced, not resolved):

- **Which projects the Classifications pages count.** Answered 2026-11-24 (classifications Q-187): inside the app every project is counted, on the public site only published ones. Left open: a Viewer with no organization, who "sees exactly what the public sees" (Q-201).
- **Review on plans without it.** The tiers spec puts the publish review queue on Program only ("Agency publishes directly"). The project-updates spec says the public sees only published values and nothing publishes by itself. What a Free or Agency workspace's public page shows after an edit is not stated.
- **Plans exist, or do not.** Answered 2026-11-24 (tiers spec, decision 13): there are none. Tags (classifications spec, decision 34) and the Security page's sign-in methods (`.scratch/users-and-security/spec.md`, decision 1) were removed the same day.
- **Steward.** Renamed Manager on 2026-11-02 (access-requests spec, decision 21), but the project-intake spec and the tiers spec still say steward.
- **Who approves a proposal, and where.** The project-intake spec has the lead organization's steward approve it from its own block; the project-updates spec (2026-11-18) moved proposals into the review inbox.
- **Glossary drift in the prototype.** The glossary says to avoid "KPI" and "tier"; route comments for the classifications pages say KPI, and the plan state is read from `?tier=`.
