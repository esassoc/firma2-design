// Workspace settings — the tenant's configuration, one list per section.
//
// The sections follow ProjectFirma's own tenant configuration (project stages,
// custom attributes, classification systems, organization types, funding
// source attributes, field definitions, roles), regrouped by the object they
// configure — see workspaceSettingsNavItems in firma2-nav.ts.
//
// DERIVED WHERE THE FIXTURE ALREADY KNOWS: stage and classification counts are
// read off the project list, so a settings screen and the Projects index can
// never disagree about how many projects sit in a stage; organization-type and
// role counts are read off the directory (firma2-directory.ts) for the same
// reason. Everything else is INVENTED — never copied or sanitized from a client
// document.

import { projects, STAGE_ORDER } from './firma2-projects';
import { organizations, users } from './firma2-directory';
import type { OrganizationType, UserRole } from './firma2-directory';
import type { Classification, ProjectStage } from './firma2-projects';

export interface SettingsRow {
  name: string;
  /** Makes the name a link to the record the row stands for. */
  href?: string;
  description?: string;
  /** Cell text by column key. */
  cells: Record<string, string | number>;
}

// ---------------------------------------------------------------------------
// General
// ---------------------------------------------------------------------------

export const workspaceGeneral = {
  name: 'Sierra–Coast Watershed Restoration Program',
  address: 'restoration.projectfirma.org',
  contact: 'program-office@example.org',
  fiscalYearStart: 'July',
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ---------------------------------------------------------------------------
// Labels and definitions
// ---------------------------------------------------------------------------

/** `label` is what the workspace calls it; `cells.default` is ProjectFirma's own word. */
export const fieldDefinitions: SettingsRow[] = [
  { name: 'Project', description: 'A discrete body of work with a budget, a lead, and a place on the map.', cells: { default: 'Project' } },
  { name: 'Lead implementer', description: 'The organization accountable for delivering the project.', cells: { default: 'Lead implementer' } },
  { name: 'Program', description: 'The funding program a project rolls up into for reporting.', cells: { default: 'Taxonomy branch' } },
  { name: 'Goal', description: 'The outcome a project works toward. Each project has one or two.', cells: { default: 'Classification' } },
  { name: 'Performance measure', description: 'A quantity a project reports each year, such as acres treated.', cells: { default: 'Performance measure' } },
  { name: 'Expenditure', description: 'Money spent in a year, by funding source.', cells: { default: 'Expenditure' } },
  { name: 'Work area', description: 'A mapped footprint where the project does its work.', cells: { default: 'Project location' } },
].map((r) => ({ ...r, cells: { ...r.cells, changed: r.name === r.cells.default ? 'No' : 'Yes' } }));

// ---------------------------------------------------------------------------
// Stages — counted from the fixture
// ---------------------------------------------------------------------------

const STAGE_COPY: Record<ProjectStage, { description: string; reports: string; publicPage: string }> = {
  Proposal: { description: 'Submitted for review. Not yet funded.', reports: 'No', publicPage: 'Hidden' },
  'Planning & Design': { description: 'Funded and being designed or permitted.', reports: 'No', publicPage: 'Shown' },
  Implementation: { description: 'On the ground. Reports measures and spending each year.', reports: 'Yes', publicPage: 'Shown' },
  'Post-Implementation': { description: 'Built, and still monitored or maintained.', reports: 'Yes', publicPage: 'Shown' },
  Completed: { description: 'Closed out. Its record is final.', reports: 'No', publicPage: 'Shown' },
  Deferred: { description: 'Paused. It keeps its record but drops out of reports.', reports: 'No', publicPage: 'Hidden' },
};

export const stages: SettingsRow[] = STAGE_ORDER.map((stage) => ({
  name: stage,
  description: STAGE_COPY[stage].description,
  cells: {
    projects: projects.filter((p) => p.stage === stage).length,
    reports: STAGE_COPY[stage].reports,
    publicPage: STAGE_COPY[stage].publicPage,
  },
}));

// ---------------------------------------------------------------------------
// Custom fields
// ---------------------------------------------------------------------------

export const customFields: SettingsRow[] = [
  { name: 'Grant agreement number', description: 'The number on the signed agreement.', cells: { kind: 'Text', types: 'All types', required: 'Yes' } },
  { name: 'Stream miles opened', description: 'Upstream habitat made reachable by the work.', cells: { kind: 'Number', types: 'Fish Passage', required: 'Yes' } },
  { name: 'Permits held', description: 'Permits secured before construction.', cells: { kind: 'Pick list', types: '3 types', required: 'No' } },
  { name: 'CEQA document', description: 'The environmental review the project relied on.', cells: { kind: 'Pick list', types: 'All types', required: 'No' } },
  { name: 'Landowner agreement signed', description: 'Whether access is secured for the life of the project.', cells: { kind: 'Yes or no', types: '4 types', required: 'No' } },
  { name: 'Burn window', description: 'The season prescribed fire is allowed.', cells: { kind: 'Date range', types: 'Forest Health & Fuels', required: 'No' } },
];

// ---------------------------------------------------------------------------
// Classifications — the Goals system, counted from the fixture
// ---------------------------------------------------------------------------

const GOAL_COPY: Record<Classification, string> = {
  'Salmon & steelhead recovery': 'Spawning and rearing habitat for listed runs.',
  'Riparian & wetland habitat': 'Streamside and wetland vegetation and the wildlife it holds.',
  'Water quality': 'Sediment, temperature, and nutrient loads.',
  'Water supply reliability': 'Groundwater recharge and dry-year flows.',
  'Wildfire resilience': 'Fuel loads and fire behavior near communities and habitat.',
  'Flood risk reduction': 'Room for high water away from homes and roads.',
  'Public access & recreation': 'Trails, river access, and places to learn.',
};

export const classifications: SettingsRow[] = (Object.keys(GOAL_COPY) as Classification[]).map((goal) => ({
  name: goal,
  description: GOAL_COPY[goal],
  cells: { projects: projects.filter((p) => p.classifications.includes(goal)).length },
}));

// ---------------------------------------------------------------------------
// Organization types
// ---------------------------------------------------------------------------

const ORGANIZATION_TYPE_COPY: { name: OrganizationType; description?: string; lead: string; fund: string }[] = [
  { name: 'Nonprofit', description: 'Land trusts, watershed councils, and conservancies.', lead: 'Yes', fund: 'Yes' },
  { name: 'Resource conservation district', lead: 'Yes', fund: 'No' },
  { name: 'Tribal government', lead: 'Yes', fund: 'Yes' },
  { name: 'Local government', description: 'Counties, cities, and special districts.', lead: 'Yes', fund: 'Yes' },
  { name: 'State agency', lead: 'Yes', fund: 'Yes' },
  { name: 'Federal agency', lead: 'Yes', fund: 'Yes' },
  { name: 'Private company', description: 'Contractors and consultants.', lead: 'No', fund: 'No' },
];

export const organizationTypes: SettingsRow[] = ORGANIZATION_TYPE_COPY.map(({ name, description, lead, fund }) => ({
  name,
  description,
  cells: { organizations: organizations.filter((o) => o.type === name).length, lead, fund },
}));

// ---------------------------------------------------------------------------
// Funding source fields
// ---------------------------------------------------------------------------

export const fundingSourceFields: SettingsRow[] = [
  { name: 'Award number', description: 'The funder’s reference for the award.', cells: { kind: 'Text', required: 'Yes' } },
  { name: 'Match required', description: 'Share of the award the grantee must raise.', cells: { kind: 'Percent', required: 'Yes' } },
  { name: 'Award period', description: 'When the money can be spent.', cells: { kind: 'Date range', required: 'Yes' } },
  { name: 'Program officer', description: 'Who to call at the funder.', cells: { kind: 'Text', required: 'No' } },
  { name: 'Restricted to', description: 'Work the money may not be spent outside of.', cells: { kind: 'Pick list', required: 'No' } },
];

// ---------------------------------------------------------------------------
// Roles and permissions
// ---------------------------------------------------------------------------

const ROLE_COPY: { name: UserRole; description: string; edit: string; approve: string; settings: string }[] = [
  { name: 'Administrator', description: 'Configures the workspace and manages people.', edit: 'All projects', approve: 'Yes', settings: 'Yes' },
  { name: 'Project steward', description: 'Reviews and approves updates for their organization.', edit: 'Their organization’s', approve: 'Yes', settings: 'No' },
  { name: 'Contributor', description: 'Drafts updates on the projects they work on.', edit: 'Their own', approve: 'No', settings: 'No' },
  { name: 'Viewer', description: 'Signed in, read-only.', edit: 'None', approve: 'No', settings: 'No' },
];

export const roles: SettingsRow[] = ROLE_COPY.map(({ name, description, ...cells }) => ({
  name,
  description,
  cells: { people: users.filter((u) => u.role === name).length, ...cells },
}));
