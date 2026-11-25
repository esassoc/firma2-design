// An organization's own pages — Home, Projects, Review, Reports — the rows
// under each of the reader's organizations in the app rail. (Updates went
// earlier; Views were removed 2026-11-24, user.) One
// module for the routes and everything those pages derive, so the rail, the
// pages and their links cannot disagree about where a page lives or what an
// organization's projects are.
//
// DERIVED WHERE THE FIXTURE ALREADY KNOWS. An organization's projects are the
// ones it leads or funds (projectsOf in firma2-directory); its updates are those
// projects' own change logs and comments; a report's coverage is read off the
// measure series the project pages draw. Only the report definitions are
// INVENTED — names and owners — and their counts are computed, never typed.
//
// DETERMINISTIC: no Math.random(), no wall clock. "This year" is the fixture's
// TODAY, the same fixed date every other page reads.

import { projectHref, projectSlug } from './firma2-projects';
import type { Project } from './firma2-projects';
import { getProjectDetail, isClosedPeriod } from './firma2-project-detail';
import { PUBLISHED_CHANGE } from './firma2-publish-history';
import { CURRENT_USER_ORGANIZATIONS, TODAY, getOrganization, membersOf, organizationSlug, projectsOf } from './firma2-directory';
import type { Organization } from './firma2-directory';

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export type OrganizationPage = 'home' | 'projects' | 'review' | 'reports';

/** Root-relative and BASE-LESS, like every route in this spoke — wrap with withBase() at render. */
export const organizationPageHref = (slug: string, page: OrganizationPage = 'home'): string =>
  page === 'home' ? `/prototypes/organizations/${slug}` : `/prototypes/organizations/${slug}/${page}`;

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

export type UpdateKind = 'report' | 'stage' | 'publish' | 'comment' | 'edit';

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
  /**
   * A SESSION of record edits — one person, one project, one day — folds into
   * one update, and these are its log sentences, oldest first. Absent for a
   * single entry. Reports filed, stage changes and publishes never fold: they
   * are what the feed's readers are watching for.
   */
  lines?: string[];
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
  change.startsWith('Reported value filed')
    ? 'report'
    : change.startsWith('Stage set to')
      ? 'stage'
      : change === PUBLISHED_CHANGE
        ? 'publish'
        : 'edit';

/** Every update on a set of projects, newest first, edit sessions folded. */
export const projectUpdates = (list: Project[]): OrganizationUpdate[] =>
  list
    .flatMap((project) => {
      const detail = getProjectDetail(project);
      const about = { projectName: project.projectName, projectSlug: projectSlug(project), projectHref: projectHref(project) };
      const log: OrganizationUpdate[] = [];
      // The log is newest first, so a session's entries arrive newest first;
      // `lines` is reversed at the end to read in the order they were made.
      for (const entry of detail.audit) {
        const kind = kindOf(entry.change);
        const iso = isoOf(entry.date);
        const last = log.at(-1);
        if (kind === 'edit' && last?.kind === 'edit' && last.author === entry.user && last.iso === iso) {
          last.lines = [...(last.lines ?? [last.text]), entry.change];
          continue;
        }
        log.push({ kind, iso, date: entry.date, author: entry.user, text: entry.change, ...about });
      }
      for (const u of log) {
        if (!u.lines) continue;
        u.lines.reverse();
        u.text = `${u.lines.length} record edits`;
      }
      return [
        ...log,
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

/** Every update on the organization's projects, newest first. */
export const organizationUpdates = (organization: string): OrganizationUpdate[] =>
  projectUpdates(organizationProjects(organization).map(({ project }) => project));

// ---------------------------------------------------------------------------
// Reports — the organization's rerunnable reports
// ---------------------------------------------------------------------------

const has = (classification: Project['classifications'][number]) => (row: OrganizationProject) =>
  row.project.classifications.includes(classification);

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
