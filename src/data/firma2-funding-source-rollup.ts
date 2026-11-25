// What each funding source adds up to across the projects that link to it.
//
// DERIVED, NEVER STORED: the rows are the projects' own funding rows
// (firma2-project-detail.ts), read from the source's side.
//
// Kept apart from firma2-funding-sources.ts so the catalogue has no project
// detail in its import graph (the detail builds its rows from the catalogue).

import { fundingSources } from './firma2-funding-sources';
import type { FundingSource } from './firma2-funding-sources';
import { getProjectDetail } from './firma2-project-detail';
import { projectHref, projectSlug, projects } from './firma2-projects';
import type { Project } from './firma2-projects';

/** One project's row against a funding source. */
export interface FundingSourceProject {
  project: Project;
  slug: string;
  href: string;
  amount: number;
}

export interface FundingSourceRollup {
  source: FundingSource;
  /** Largest amount first; ties by project name. */
  rows: FundingSourceProject[];
  /** Whole dollars across the rows. */
  amount: number;
  /** Projects with a row. */
  projects: number;
}

export const fundingSourceRollup = (source: FundingSource): FundingSourceRollup => {
  const rows = projects
    .flatMap((project) =>
      getProjectDetail(project)
        .funding.filter((row) => row.source === source.slug)
        .map((row) => ({ project, slug: projectSlug(project), href: projectHref(project), amount: row.amount })),
    )
    .sort((a, b) => b.amount - a.amount || a.project.projectName.localeCompare(b.project.projectName));
  return {
    source,
    rows,
    amount: rows.reduce((total, row) => total + row.amount, 0),
    projects: new Set(rows.map((row) => row.slug)).size,
  };
};

/** Every funding source with its totals, A to Z. */
export const fundingSourceRollups = (): FundingSourceRollup[] =>
  fundingSources.map(fundingSourceRollup).sort((a, b) => a.source.name.localeCompare(b.source.name) || a.source.organization.localeCompare(b.source.organization));
