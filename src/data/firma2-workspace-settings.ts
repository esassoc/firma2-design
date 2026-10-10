// Workspace settings — the tenant's configuration, one list per section.
//
// The sections follow ProjectFirma's own tenant configuration (project stages,
// custom attributes, classification systems, organization types, funding
// source attributes, field definitions, roles), regrouped by the object they
// configure — see workspaceSettingsNavItems in firma2-nav.ts.
//
// DERIVED WHERE THE FIXTURE ALREADY KNOWS: stage counts are
// read off the project list, so a settings screen and the Projects index can
// never disagree about how many projects sit in a stage. Everything else is
// INVENTED — never copied or sanitized from a client document.

import { projects, STAGE_ORDER } from './firma2-projects';
import type { ProjectStage } from './firma2-projects';
import {
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PauseCircleIcon,
  Progress02Icon,
  Progress03Icon,
  Progress04Icon,
} from '@hugeicons/core-free-icons';
import { toMarkup } from '../lib/hugeicon-markup';
import type { CatalogIcon, IconNode } from '../lib/hugeicon-markup';

export interface SettingsRow {
  /** The record's slug, when a client script keeps the row in step with browser edits. */
  slug?: string;
  name: string;
  /** Makes the name a link to the record the row stands for. */
  href?: string;
  /** A project's slug: adds the button that opens it in the side panel. The
   *  page must use firma2-project-peek-layout. */
  peek?: string;
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

/**
 * The icons a stage picker offers before anyone searches: one family of
 * status circles, so a stage's icon can also say where it sits in the
 * lifecycle. Any of the ~6,000 Hugeicons free glyphs can be searched and
 * picked (bcn-icon-picker); these are only the shortlist.
 *
 * A stage stores the Hugeicons export name AND the glyph's markup, so a page
 * draws its stages without loading the whole set — the set loads only when
 * someone searches it.
 */
const SUGGESTED: [unknown, string, string][] = [
  [CircleDashedIcon, 'CircleDashedIcon', 'Dashed circle'],
  [CircleDotDashedIcon, 'CircleDotDashedIcon', 'Dashed circle with dot'],
  [CircleIcon, 'CircleIcon', 'Circle'],
  [CircleDotIcon, 'CircleDotIcon', 'Circle with dot'],
  [Progress02Icon, 'Progress02Icon', 'Quarter circle'],
  [Progress03Icon, 'Progress03Icon', 'Half circle'],
  [Progress04Icon, 'Progress04Icon', 'Three-quarter circle'],
  [CheckmarkCircle02Icon, 'CheckmarkCircle02Icon', 'Check circle'],
  [PauseCircleIcon, 'PauseCircleIcon', 'Pause circle'],
  [CancelCircleIcon, 'CancelCircleIcon', 'Cancel circle'],
];

export const STAGE_ICON_SUGGESTIONS: CatalogIcon[] = SUGGESTED.map(([node, name, label]) => ({
  name,
  label,
  paths: toMarkup(node as IconNode),
}));

const suggested = (name: string): CatalogIcon => STAGE_ICON_SUGGESTIONS.find((i) => i.name === name)!;

/**
 * Suggested stage colours, as the branding picker offers its swatches. All
 * are dark enough (step 11 of their ramps) to clear 3 : 1 as an icon on a
 * white page; a free hex can still be typed, and is warned about if it cannot.
 */
export const STAGE_SWATCHES = [
  { value: '#646464', label: 'Grey' },
  { value: '#0d74ce', label: 'Blue' },
  { value: '#167a7a', label: 'Teal' },
  { value: '#218358', label: 'Green' },
  { value: '#2a7e3b', label: 'Grass' },
  { value: '#ab6400', label: 'Amber' },
  { value: '#b5621f', label: 'Orange' },
  { value: '#a8324a', label: 'Red' },
  { value: '#6a5aa8', label: 'Purple' },
  { value: '#1f3a5f', label: 'Navy' },
];

export interface StageSetting {
  key: string;
  name: string;
  description: string;
  /** Hugeicons export name, e.g. "Progress03Icon". */
  icon: string;
  /** That glyph's inner-SVG markup, stored so drawing needs no icon set. */
  iconPaths: string;
  /** Hex, tints the icon. */
  color: string;
  reportsYearly: boolean;
  publicPage: boolean;
  /** Added in this browser — the only stages that can be removed (none hold projects). */
  added?: boolean;
}

const STAGE_LOOK: Record<ProjectStage, { icon: string; color: string }> = {
  Proposal: { icon: 'CircleDashedIcon', color: '#646464' },
  'Planning & Design': { icon: 'Progress02Icon', color: '#0d74ce' },
  Implementation: { icon: 'Progress03Icon', color: '#2a7e3b' },
  'Post-Implementation': { icon: 'Progress04Icon', color: '#167a7a' },
  Completed: { icon: 'CheckmarkCircle02Icon', color: '#218358' },
  Deferred: { icon: 'PauseCircleIcon', color: '#ab6400' },
};

export const stageSettings: StageSetting[] = STAGE_ORDER.map((stage) => ({
  key: stage,
  name: stage,
  description: STAGE_COPY[stage].description,
  ...STAGE_LOOK[stage],
  iconPaths: suggested(STAGE_LOOK[stage].icon).paths,
  reportsYearly: STAGE_COPY[stage].reports === 'Yes',
  publicPage: STAGE_COPY[stage].publicPage === 'Shown',
}));

// ---------------------------------------------------------------------------
// Custom fields
// ---------------------------------------------------------------------------

export const customFields: SettingsRow[] = [
  { name: 'Grant agreement number', description: 'The number on the signed agreement.', cells: { kind: 'Text', types: 'All types', required: 'Yes' } },
  { name: 'Stream miles opened', description: 'Upstream habitat made reachable by the work.', cells: { kind: 'Number', types: 'Fish passage', required: 'Yes' } },
  { name: 'Permits held', description: 'Permits secured before construction.', cells: { kind: 'Choice', types: '3 types', required: 'No' } },
  { name: 'CEQA document', description: 'The environmental review the project relied on.', cells: { kind: 'Choice', types: 'All types', required: 'No' } },
  { name: 'Landowner agreement signed', description: 'Whether access is secured for the life of the project.', cells: { kind: 'Yes or no', types: '4 types', required: 'No' } },
  { name: 'Burn window', description: 'The season prescribed fire is allowed.', cells: { kind: 'Date range', types: 'Forest health & fuels', required: 'No' } },
];

// ---------------------------------------------------------------------------
// Funding source fields
// ---------------------------------------------------------------------------

export const fundingSourceFields: SettingsRow[] = [
  { name: 'Award number', description: 'The funder’s reference for the award.', cells: { kind: 'Text', required: 'Yes' } },
  { name: 'Match required', description: 'Share of the award the grantee must raise.', cells: { kind: 'Percent', required: 'Yes' } },
  { name: 'Award period', description: 'When the money can be spent.', cells: { kind: 'Date range', required: 'Yes' } },
  { name: 'Program officer', description: 'Who to call at the funder.', cells: { kind: 'Text', required: 'No' } },
  { name: 'Restricted to', description: 'The only work the money can pay for.', cells: { kind: 'Choice', required: 'No' } },
];

// ---------------------------------------------------------------------------
// Security — Administration › Security
// ---------------------------------------------------------------------------

export interface SecurityChoice {
  value: string;
  label: string;
}

export interface SecuritySwitch {
  /** The switch's form name. */
  key: string;
  /** One or two words to scan down — also the switch's accessible name. */
  label: string;
  /** What turning it on does. */
  hint: string;
  on: boolean;
}

export interface SecurityPermission {
  key: string;
  label: string;
  hint: string;
  value: string;
}

export const workspaceSecurity = {
  inviteLinkOn: true,
  // Invented token; Reset swaps it client-side.
  inviteLink: `${workspaceGeneral.address}/join/k7q2-m9xd-4tpw`,
  idleTimeout: '7d',
};

export const SIGN_IN_METHODS: SecuritySwitch[] = [
  { key: 'signin-microsoft', label: 'Microsoft', hint: 'Agency and work accounts through Microsoft.', on: true },
  { key: 'signin-google', label: 'Google', hint: 'Google Workspace and personal Google accounts.', on: true },
  { key: 'signin-email', label: 'Email and password', hint: 'An email address and a password set in this workspace.', on: true },
];

export const SIGN_IN_RULES: SecuritySwitch[] = [
  { key: 'two-step', label: 'Two-step verification', hint: 'Everyone enters a code from an authenticator app when they sign in.', on: false },
];

export const IDLE_TIMEOUTS: SecurityChoice[] = [
  { value: '8h', label: '8 hours' },
  { value: '1d', label: '1 day' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
];

/** Who may take each workspace-wide action — the roles in rank order, widening. */
export const PERMISSION_AUDIENCES: SecurityChoice[] = [
  { value: 'admins', label: 'Only administrators' },
  { value: 'stewards', label: 'Administrators and stewards' },
  { value: 'editors', label: 'Everyone except viewers' },
];

// Workspace-wide acts only. What each role may edit and approve is fixed by the
// role itself (docs/roles-and-permissions.md), so it has no setting here.
export const SECURITY_PERMISSIONS: SecurityPermission[] = [
  { key: 'perm-invite', label: 'Invite people', hint: 'Send invitations to join the workspace. Stewards can always invite people into their own organization.', value: 'admins' },
  { key: 'perm-organizations', label: 'Add organizations', hint: 'Add organizations to the directory and the pickers.', value: 'stewards' },
  { key: 'perm-projects', label: 'Create projects', hint: 'Start a new project record.', value: 'editors' },
  // Goals are the initiative's to set, so administrators by default; a
  // workspace that has its program staff set up goals opens it wider.
  { key: 'perm-classifications', label: 'Manage classifications', hint: 'Set up classification groups and classifications, with their performance measures and goal targets.', value: 'admins' },
  // A target commits a project to an amount on a performance measure; PM 2
  // keeps that with administrators, so it starts there (user, 2026-10-09).
  { key: 'perm-targets', label: 'Set project targets', hint: 'Commit a project to an amount on a performance measure, or clear it. Anyone who can edit a project can still report against it.', value: 'admins' },
  { key: 'perm-import', label: 'Import data', hint: 'Bring in projects and records from a spreadsheet or GIS file.', value: 'admins' },
  { key: 'perm-export', label: 'Export data', hint: 'Download projects, funding and measures as a spreadsheet.', value: 'stewards' },
  { key: 'perm-api', label: 'Create API tokens', hint: 'Let another system read and change workspace data.', value: 'admins' },
];

export const PUBLIC_SITE: SecuritySwitch[] = [
  { key: 'public-pages', label: 'Public access', hint: 'Anyone can view published projects, public pages and the map without signing in.', on: true },
  { key: 'public-contacts', label: 'Contact details', hint: 'Show email addresses and phone numbers on public pages. Names always show.', on: false },
];

// ---------------------------------------------------------------------------
// Custom pages — Administration › Custom pages
// ---------------------------------------------------------------------------

// The workspace's own pages, the Pages group of the app rail (firma2-pages.ts).
// One switch turns the feature on; the rest only means something once it is.
export const customPagesSettings = {
  on: true,
  visibility: 'workspace',
  history: '1y',
  notifyWho: 'authors',
  notifyHow: 'daily',
};

// Same audiences as Security's workspace permissions, so "who can" reads the
// same ladder on both pages.
export const CUSTOM_PAGE_PERMISSIONS: SecurityPermission[] = [
  { key: 'pages-create', label: 'Create pages', hint: 'Add pages and folders to the rail.', value: 'editors' },
  { key: 'pages-edit', label: 'Edit any page', hint: 'Change any page’s title, text and folder. Authors can always edit their own.', value: 'stewards' },
  { key: 'pages-delete', label: 'Delete pages', hint: 'Remove pages and folders. Pages in a deleted folder move to the top of Pages.', value: 'admins' },
];

export const CUSTOM_PAGE_VISIBILITY: SecurityChoice[] = [
  { value: 'workspace', label: 'Everyone in the workspace' },
  { value: 'editors', label: 'Only people who can edit pages' },
  { value: 'public', label: 'Everyone, including the public site' },
];

export const CUSTOM_PAGE_PUBLISHING: SecuritySwitch[] = [
  { key: 'pages-review', label: 'Review before publishing', hint: 'New and changed pages stay drafts until someone who can edit any page approves them.', on: false },
];

export const CUSTOM_PAGE_HISTORY: SecurityChoice[] = [
  { value: '30d', label: '30 days' },
  { value: '1y', label: '1 year' },
  { value: 'forever', label: 'Forever' },
];

export const CUSTOM_PAGE_EVENTS: SecuritySwitch[] = [
  { key: 'notify-published', label: 'Page published', hint: 'A new page goes live, or a draft is approved.', on: true },
  { key: 'notify-edited', label: 'Page edited', hint: 'Someone changes a page’s title or text.', on: true },
  { key: 'notify-removed', label: 'Page moved or deleted', hint: 'A page changes folder or is removed.', on: false },
];

export const CUSTOM_PAGE_NOTIFY_WHO: SecurityChoice[] = [
  { value: 'authors', label: 'The page’s author and past editors' },
  { value: 'editors', label: 'Everyone who can edit any page' },
  { value: 'admins', label: 'Only administrators' },
];

export const CUSTOM_PAGE_NOTIFY_HOW: SecurityChoice[] = [
  { value: 'instant', label: 'As it happens' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly digest' },
];
