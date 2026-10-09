// An organization's own pages — Home, Projects, Updates, Views, Reports — the
// five rows under each of the reader's organizations in the app rail. One
// module for the routes and everything those pages derive, so the rail, the
// pages and their links cannot disagree about where a page lives or what an
// organization's projects are.
//
// DERIVED WHERE THE FIXTURE ALREADY KNOWS. An organization's projects are the
// ones it leads or funds (projectsOf in firma2-directory); its updates are those
// projects' own change logs and comments; a report's coverage is read off the
// measure series the project pages draw. Only the saved views and the report
// definitions are INVENTED — names and owners — and their counts are computed,
// never typed, so a view that says "4 projects" opens four.
//
// DETERMINISTIC: no Math.random(), no wall clock. "This year" is the fixture's
// TODAY, the same fixed date every other page reads.

import { projectHref, projectSlug } from './firma2-projects';
import type { Project } from './firma2-projects';
import { getProjectDetail, isClosedPeriod } from './firma2-project-detail';
import { CURRENT_USER, CURRENT_USER_ORGANIZATIONS, TODAY, getOrganization, membersOf, organizationSlug, projectsOf } from './firma2-directory';
import type { Organization } from './firma2-directory';

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export type OrganizationPage = 'home' | 'projects' | 'updates' | 'views' | 'reports';

/** Root-relative and BASE-LESS, like every route in this spoke — wrap with withBase() at render. */
export const organizationPageHref = (slug: string, page: OrganizationPage = 'home'): string =>
  page === 'home' ? `/prototypes/organizations/${slug}` : `/prototypes/organizations/${slug}/${page}`;

export const organizationViewHref = (slug: string, view: string): string =>
  `${organizationPageHref(slug, 'views')}/${view}`;

/** The `active` key a page passes AppLayout — the rail's sub-row key for it. */
export const organizationNavKey = (slug: string, page: OrganizationPage): string => `org-${slug}-${page}`;

/** The organizations that have these pages: the reader's own. */
export const readerOrganizations = (): Organization[] =>
  CURRENT_USER_ORGANIZATIONS.map((name) => getOrganization(organizationSlug(name))!);

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export interface OrganizationProject {
  project: Project;
  /** True when the organization leads it; false when it funds it. */
  leads: boolean;
  /** What it put in, when it funds rather than leads. */
  amount: number;
}

export const organizationProjects = (organization: string): OrganizationProject[] =>
  projectsOf(organization).sort((a, b) => a.project.projectName.localeCompare(b.project.projectName));

// ---------------------------------------------------------------------------
// Reporting — who owes a report for a year
// ---------------------------------------------------------------------------

/** The last reporting period that has closed — the one a report can be missing from. */
export const LAST_CLOSED_YEAR = new Date(TODAY).getUTCFullYear() - 1;

export interface ReportingStatus {
  project: Project;
  /** The project had at least one measure period in the year, and the year has closed. */
  due: boolean;
  /** Names of the measures with no value filed for the year. Empty when it reported in full. */
  missing: string[];
}

/** Whether a project owed a report for `year`, and which of its measures went unfiled. */
export const reportingStatus = (project: Project, year: number): ReportingStatus => {
  const owed = getProjectDetail(project)
    .measures.map((measure) => ({ measure, period: measure.series.find((p) => p.year === year) }))
    .filter(({ period }) => period && isClosedPeriod(period));
  return {
    project,
    due: owed.length > 0,
    missing: owed.filter(({ period }) => period!.value === null).map(({ measure }) => measure.name),
  };
};

export interface Coverage {
  year: number;
  /** Projects that owed a report for the year. */
  due: number;
  /** Of those, the ones that filed every measure. */
  reported: number;
  /** The ones that did not, with what they left out. */
  gaps: ReportingStatus[];
}

export const coverage = (list: Project[], year: number): Coverage => {
  const owed = list.map((p) => reportingStatus(p, year)).filter((s) => s.due);
  const gaps = owed.filter((s) => s.missing.length > 0);
  return { year, due: owed.length, reported: owed.length - gaps.length, gaps };
};

// ---------------------------------------------------------------------------
// Updates — the organization's projects' change logs and comments, as one feed
// ---------------------------------------------------------------------------

export type UpdateKind = 'report' | 'stage' | 'comment' | 'edit';

/** The filter's choices, in the order a reader looks for them. */
export const UPDATE_KINDS: { value: UpdateKind; label: string }[] = [
  { value: 'report', label: 'Reports filed' },
  { value: 'stage', label: 'Stage changes' },
  { value: 'comment', label: 'Comments' },
  { value: 'edit', label: 'Record edits' },
];

export interface OrganizationUpdate {
  kind: UpdateKind;
  /** ISO day, so the feed sorts and groups chronologically. */
  iso: string;
  /** The record's own label — "4 January 2025". */
  date: string;
  /** Who made it. */
  author: string;
  /** The change in the record's vocabulary, or the comment's text. */
  text: string;
  projectName: string;
  projectSlug: string;
  /** Base-less route to the project's page. */
  projectHref: string;
}

const isoOf = (label: string): string => {
  const d = new Date(`${label} 00:00 UTC`);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

const kindOf = (change: string): UpdateKind =>
  change.startsWith('Reported value filed') ? 'report' : change.startsWith('Stage set to') ? 'stage' : 'edit';

/** Every update on the organization's projects, newest first. */
export const organizationUpdates = (organization: string): OrganizationUpdate[] =>
  organizationProjects(organization)
    .flatMap(({ project }) => {
      const detail = getProjectDetail(project);
      const about = { projectName: project.projectName, projectSlug: projectSlug(project), projectHref: projectHref(project) };
      return [
        ...detail.audit.map((entry) => ({
          kind: kindOf(entry.change),
          iso: isoOf(entry.date),
          date: entry.date,
          author: entry.user,
          text: entry.change,
          ...about,
        })),
        ...detail.comments.map((comment) => ({
          kind: 'comment' as const,
          iso: isoOf(comment.date),
          date: comment.date,
          author: comment.author.name,
          text: comment.body,
          ...about,
        })),
      ];
    })
    .sort((a, b) => b.iso.localeCompare(a.iso) || a.projectName.localeCompare(b.projectName));

// ---------------------------------------------------------------------------
// Views — saved slices of the organization's projects
// ---------------------------------------------------------------------------

export interface SavedView {
  slug: string;
  name: string;
  /** The view's filter, in words — what the view is defined as, not a description of the page. */
  filter: string;
  /** Who can open it. */
  sharedWith: 'Organization' | 'Only me';
  createdBy: string;
  matches: (row: OrganizationProject) => boolean;
}

const has = (classification: Project['classifications'][number]) => (row: OrganizationProject) =>
  row.project.classifications.includes(classification);

// Invented per organization. The host board's are a funder's questions; the
// trust's are a small lead organization's. A view's owner is a member of the
// organization, picked by position so a demo always shows the same names.
const VIEW_SEEDS: Record<string, Omit<SavedView, "createdBy">[]> = {
  'california-watershed-restoration-board': [
    { slug: 'missing-a-report', name: `Missing a ${LAST_CLOSED_YEAR} report`, filter: `Owed a ${LAST_CLOSED_YEAR} report and left a measure unfiled`, sharedWith: 'Organization', matches: (r) => reportingStatus(r.project, LAST_CLOSED_YEAR).missing.length > 0 },
    { slug: 'in-implementation', name: 'In implementation', filter: 'Stage is Implementation', sharedWith: 'Organization', matches: (r) => r.project.stage === 'Implementation' },
    { slug: 'proposals', name: 'Proposals to review', filter: 'Stage is Proposal', sharedWith: 'Organization', matches: (r) => r.project.stage === 'Proposal' },
    { slug: 'grants-over-500k', name: 'Grants over $500,000', filter: 'Our funding is more than $500,000', sharedWith: 'Organization', matches: (r) => r.amount > 500_000 },
    { slug: 'salmon-and-steelhead', name: 'Salmon & steelhead', filter: 'Classification is Salmon & steelhead recovery', sharedWith: 'Only me', matches: has('Salmon & steelhead recovery') },
  ],
  'feather-headwaters-trust': [
    { slug: 'meadows', name: 'Meadow rewetting', filter: 'Classification is Meadow & marsh rewetting', sharedWith: 'Organization', matches: has('Meadow & marsh rewetting') },
    { slug: 'completed', name: 'Completed work', filter: 'Stage is Completed', sharedWith: 'Organization', matches: (r) => r.project.stage === 'Completed' },
  ],
};

export const savedViews = (organization: Organization): SavedView[] => {
  const members = membersOf(organization.name);
  return (VIEW_SEEDS[organization.slug] ?? []).map((seed, i) => ({
    ...seed,
    // A private view can only be the reader's own: nobody else's would be listed.
    createdBy: seed.sharedWith === 'Only me' ? CURRENT_USER.name : members[i % Math.max(members.length, 1)]?.name ?? organization.primaryContact,
  }));
};

export const viewProjects = (organization: Organization, view: SavedView): Project[] =>
  organizationProjects(organization.name).filter(view.matches).map((r) => r.project);

// ---------------------------------------------------------------------------
// Reports — the organization's rerunnable reports
// ---------------------------------------------------------------------------

export interface OrganizationReport {
  slug: string;
  name: string;
  /** Whose projects it covers, in words. */
  scope: string;
  /** The reporting year it states. */
  year: number;
  /** "Annual", "One page" — how it is produced. */
  format: string;
  owner: string;
  /** Computed from the records — never typed. */
  coverage: Coverage;
}

const REPORT_SEEDS: Record<string, { slug: string; name: string; scope: string; year: number; format: string; matches: (row: OrganizationProject) => boolean }[]> = {
  'california-watershed-restoration-board': [
    { slug: 'grant-annual-report', name: 'Watershed Resilience Grant annual report', scope: 'Every project the grant program funds', year: LAST_CLOSED_YEAR, format: 'Annual', matches: (r) => !r.leads },
    { slug: 'legislative-summary', name: 'Legislative summary', scope: 'Projects in implementation or later', year: LAST_CLOSED_YEAR, format: 'Annual', matches: (r) => ['Implementation', 'Post-Implementation', 'Completed', 'Deferred'].includes(r.project.stage) },
    { slug: 'salmon-fact-sheet', name: 'Salmon & steelhead fact sheet', scope: 'Projects classified Salmon & steelhead recovery', year: LAST_CLOSED_YEAR, format: 'One page', matches: has('Salmon & steelhead recovery') },
  ],
  'feather-headwaters-trust': [
    { slug: 'red-clover-close-out', name: 'Red Clover Valley close-out report', scope: 'Red Clover Valley Meadow Reconnection', year: 2023, format: 'One time', matches: (r) => r.project.projectName.startsWith('Red Clover') },
    { slug: 'board-fact-sheet', name: 'Board fact sheet', scope: 'Every project the trust leads', year: 2023, format: 'One page', matches: (r) => r.leads },
  ],
};

export const organizationReports = (organization: Organization): OrganizationReport[] => {
  const rows = organizationProjects(organization.name);
  const members = membersOf(organization.name);
  return (REPORT_SEEDS[organization.slug] ?? []).map((seed, i) => ({
    slug: seed.slug,
    name: seed.name,
    scope: seed.scope,
    year: seed.year,
    format: seed.format,
    owner: members[(i + 1) % Math.max(members.length, 1)]?.name ?? organization.primaryContact,
    coverage: coverage(rows.filter(seed.matches).map((r) => r.project), seed.year),
  }));
};
