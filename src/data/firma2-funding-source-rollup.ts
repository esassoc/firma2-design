// What each funding source adds up to across the projects that link to it.
//
// DERIVED, NEVER STORED: the rows are the projects' own funding rows
// (firma2-project-detail.ts), read from the source's side. A total counts
// SECURED rows only (docs/data-model.md, decision 7); what was asked for and
// not yet decided is shown beside it, never added in.
//
// Kept apart from firma2-funding-sources.ts so the catalogue has no project
// detail in its import graph (the detail builds its rows from the catalogue).

import { fundingSources, isAcceptingRequests } from './firma2-funding-sources';
import type { FundingSource, FundingStatus } from './firma2-funding-sources';
import { getProjectDetail } from './firma2-project-detail';
import { projectHref, projectSlug, projects } from './firma2-projects';
import type { Project } from './firma2-projects';
import { TODAY_ISO } from './firma2-publish-history';

/** One project's row against a funding source. */
export interface FundingSourceProject {
  project: Project;
  slug: string;
  href: string;
  amount: number;
  status: FundingStatus;
}

export interface FundingSourceRollup {
  source: FundingSource;
  /** Largest amount first; ties by project name. */
  rows: FundingSourceProject[];
  /** Whole dollars on secured rows. */
  secured: number;
  /** Whole dollars on requested rows: asked for, not decided. */
  requested: number;
  /** Projects with a secured or requested row. A not-awarded row is not a project it funds. */
  projects: number;
  /** Whether a project may ask it for money today. */
  open: boolean;
}

const sumOf = (rows: FundingSourceProject[], status: FundingStatus): number =>
  rows.filter((row) => row.status === status).reduce((total, row) => total + row.amount, 0);

export const fundingSourceRollup = (source: FundingSource): FundingSourceRollup => {
  const rows = projects
    .flatMap((project) =>
      getProjectDetail(project)
        .funding.filter((row) => row.source === source.slug)
        .map((row) => ({ project, slug: projectSlug(project), href: projectHref(project), amount: row.amount, status: row.status })),
    )
    .sort((a, b) => b.amount - a.amount || a.project.projectName.localeCompare(b.project.projectName));
  return {
    source,
    rows,
    secured: sumOf(rows, 'secured'),
    requested: sumOf(rows, 'requested'),
    projects: new Set(rows.filter((row) => row.status !== 'not-awarded').map((row) => row.slug)).size,
    open: isAcceptingRequests(source, TODAY_ISO),
  };
};

/** Every funding source with its totals, A to Z. */
export const fundingSourceRollups = (): FundingSourceRollup[] =>
  fundingSources.map(fundingSourceRollup).sort((a, b) => a.source.name.localeCompare(b.source.name) || a.source.organization.localeCompare(b.source.organization));

const DAY = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** A closing date as a reader sees it: "Feb 26, 2027". */
export const closingDay = (iso: string): string => DAY.format(new Date(`${iso}T00:00:00Z`));

/**
 * Whether a source takes requests, in the fewest words that say until when.
 * "Open until Feb 26, 2027", "Open", or "Closed".
 */
export const acceptingLabel = (rollup: Pick<FundingSourceRollup, 'source' | 'open'>): string =>
  !rollup.open ? 'Closed' : rollup.source.closes ? `Open until ${closingDay(rollup.source.closes)}` : 'Open';
