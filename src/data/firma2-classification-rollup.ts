// What a classification adds up to. A classification is a GOAL (or another
// grouping, like a species); the catalog measures that list it are its KPIs;
// and progress against the goal is what the projects carrying it have
// reported toward those KPIs. Read by the classification index and detail
// pages.
//
// A PROJECT COUNTS TOWARD A KPI WHEN IT CARRIES THE CLASSIFICATION AND ONE OF
// ITS MEASURES REPORTS TOWARD THAT KPI (`PerformanceMeasure.kpi`). Both
// conditions: a project tagged with the goal but reporting nothing toward the
// KPI is counted as a project, not as progress; a project reporting the KPI
// under some other goal does not move this one.
//
// THREE FIGURES PER KPI, NEVER PAIRED BY THIS MODULE. Reported is what the
// projects filed. Committed is what they promised (their own targets). The
// goal target is what the initiative set on the classification. Each was
// authored by someone; the page draws them against one another, but none is
// derived to make a comparison possible (brief §4).
//
// THE COUNTING RULE DECIDES HOW PROJECTS COMBINE — PM 2's yes/no since the
// 2026-10-09 reconciliation (isSummable).
//   sums           add across projects.
//   does not sum   a condition, not an amount. Averaged over the reporting
//                  projects, and never given a committed total — promising
//                  "80%" twice is not 160%. A measure with no rule yet is
//                  treated the same way: false is the safe direction.
//
// Separate module (not firma2-classifications.ts) because it reads project
// detail, and project detail already imports the classification vocabulary.

import { projects } from './firma2-projects';
import type { ClassificationName, Project } from './firma2-projects';
import { projectSlug } from './firma2-projects';
import { getProjectDetail, isClosedPeriod } from './firma2-project-detail';
import type { PerformanceMeasure } from './firma2-project-detail';
import { measures as catalog } from './firma2-performance-measures';
import { isSummable } from './firma2-performance-measures';
import type { PerformanceMeasureDefinition } from './firma2-performance-measures';
import { CLASSIFICATIONS } from './firma2-classifications';
import type { Classification, GoalTarget } from './firma2-classifications';

/**
 * A project row's unit, as the project page prints it, against the catalog
 * unit it rolls up in. A row may say "barriers" where the KPI counts "each";
 * anything not listed here must match exactly or the build stops — a KPI
 * summing acres with miles is the failure this module exists to prevent.
 */
const UNIT_ALIASES: Record<string, string> = {
  barriers: 'each',
  trees: 'plants',
  'acre-feet': 'acre-feet per year',
  tons: 'tons per year',
};

export interface KpiContribution {
  project: Project;
  reported: number;
  /** The project's own target for this KPI; 0 when it set none. */
  committed: number;
  /** What it reported in each CLOSED period, oldest first; null where nothing was filed. */
  series: KpiYear[];
}

export interface KpiYear {
  year: number;
  value: number | null;
}

/**
 * One project's rows toward a KPI, summed per closed period. A period with no
 * filing on any row stays null — "nothing filed" is not "filed zero"
 * (see MeasureYear). Only closed periods: a year that has not ended has no
 * column on the project's own table either.
 */
const seriesOf = (rows: PerformanceMeasure[]): KpiYear[] =>
  (rows[0]?.series ?? []).filter(isClosedPeriod).map(({ year }) => {
    const values = rows
      .map((r) => r.series.find((p) => p.year === year)?.value ?? null)
      .filter((v): v is number => v !== null);
    return { year, value: values.length ? round(values.reduce((a, b) => a + b, 0)) : null };
  });

export interface KpiProgress {
  measure: PerformanceMeasureDefinition;
  unit: string;
  additive: boolean;
  /** Projects carrying the classification that report toward this KPI. */
  contributions: KpiContribution[];
  /** Additive: the total. Outcome: the average reading. Null with no reports. */
  reported: number | null;
  /** Sum of project targets. Null for an outcome, or when no project set one. */
  committed: number | null;
  /** The initiative's target on the classification, when it set one. */
  goal?: GoalTarget;
}

export interface ClassificationRollup {
  classification: Classification;
  projects: Project[];
  estimatedTotalCost: number;
  spentToDate: number;
  /** Distinct organizations administering a funding source on these projects. */
  funders: number;
  /** Who pays for these projects, largest total first. See FunderTotal. */
  funding: FunderTotal[];
  kpis: KpiProgress[];
}

/** One funding source on one project carrying the classification. */
export interface FunderGrant {
  project: Project;
  /** The grant or program the money comes through. */
  program: string;
  amount: number;
}

/**
 * One funder's money across the projects carrying a classification.
 *
 * WHOLE-PROJECT DOLLARS, NOT MONEY FOR THIS GOAL. A funding source funds a
 * project, and a project can carry several classifications; nothing on the
 * record splits a grant between them. So `amount` is the full value of this
 * funder's sources on these projects, and the same dollars appear again on
 * every other classification those projects carry. Summing funders across
 * classifications double-counts — the funding section says so beside the chart.
 */
export interface FunderTotal {
  organization: string;
  amount: number;
  grants: FunderGrant[];
  /** Distinct projects this funder appears on. */
  projectCount: number;
}

const round = (n: number) => Number(n.toFixed(4));

/** The catalog measures that list this classification — its KPIs. */
export const kpisFor = (name: ClassificationName): PerformanceMeasureDefinition[] =>
  catalog.filter((m) => m.status !== 'Retired' && m.classifications.includes(name));

// Ties break on name so the order is stable build to build.
const funderTotals = (sources: { project: Project; organization: string; name: string; amount: number }[]): FunderTotal[] => {
  const byFunder = new Map<string, FunderGrant[]>();
  for (const s of sources) {
    const grants = byFunder.get(s.organization) ?? [];
    grants.push({ project: s.project, program: s.name, amount: s.amount });
    byFunder.set(s.organization, grants);
  }
  return Array.from(byFunder, ([organization, grants]) => ({
    organization,
    amount: grants.reduce((sum, g) => sum + g.amount, 0),
    grants: grants.sort((a, b) => b.amount - a.amount),
    projectCount: new Set(grants.map((g) => g.project)).size,
  })).sort((a, b) => b.amount - a.amount || a.organization.localeCompare(b.organization));
};

/** Progress toward one measure under one classification, from the projects carrying it. */
export const kpiProgress = (
  name: ClassificationName,
  measure: PerformanceMeasureDefinition,
  goal?: GoalTarget,
): KpiProgress => progressOver(projects.filter((p) => p.classifications.includes(name)), measure, goal);

/**
 * Progress toward one measure across the WHOLE portfolio — every project that
 * reports toward it, whatever its classifications. Backs the reader-facing
 * Performance measures pages (user, 2026-10-09), the measure-shaped twin of a
 * classification's KPI figure; same arithmetic, wider set of projects.
 */
export const measurePortfolio = (measure: PerformanceMeasureDefinition): KpiProgress => progressOver(projects, measure);

/** The classifications a measure reports toward, in the workspace's order. */
export const goalsOf = (measure: PerformanceMeasureDefinition): Classification[] =>
  CLASSIFICATIONS.filter((c) => measure.classifications.includes(c.name));

const progressOver = (
  over: Project[],
  measure: PerformanceMeasureDefinition,
  goal?: GoalTarget,
): KpiProgress => {
  const details = over.map(getProjectDetail);
  const unit = measure.unit ?? '';
  const additive = isSummable(measure);
  const contributions: KpiContribution[] = [];
  for (const detail of details) {
    const rows = detail.measures.filter((m) => m.kpi === measure.slug);
    if (rows.length === 0) continue;
    for (const row of rows) {
      if ((UNIT_ALIASES[row.unit] ?? row.unit) !== unit) {
        throw new Error(`"${row.name}" on ${detail.project.projectName} is in ${row.unit}; ${measure.slug} counts ${unit}`);
      }
    }
    contributions.push({
      project: detail.project,
      reported: round(rows.reduce((s, r) => s + r.reported, 0)),
      committed: round(rows.reduce((s, r) => s + r.expected, 0)),
      series: seriesOf(rows),
    });
  }
  const reporting = contributions.filter((c) => c.reported > 0);
  const reported = additive
    ? contributions.length
      ? round(contributions.reduce((s, c) => s + c.reported, 0))
      : null
    : reporting.length
      ? round(reporting.reduce((s, c) => s + c.reported, 0) / reporting.length)
      : null;
  const committedSum = contributions.reduce((s, c) => s + c.committed, 0);
  return {
    measure,
    unit,
    additive,
    contributions,
    reported,
    committed: additive && committedSum > 0 ? round(committedSum) : null,
    goal,
  };
};

export const rollupClassification = (classification: Classification): ClassificationRollup => {
  const { name } = classification;
  const carrying = projects.filter((p) => p.classifications.includes(name));
  const details = carrying.map(getProjectDetail);
  return {
    classification,
    projects: carrying,
    estimatedTotalCost: carrying.reduce((sum, p) => sum + p.estimatedTotalCost, 0),
    spentToDate: details.reduce((sum, d) => sum + d.expenditures.reduce((s, y) => s + y.spent, 0), 0),
    funders: new Set(details.flatMap((d) => d.funding.map((f) => f.organization))).size,
    funding: funderTotals(details.flatMap((d) => d.funding.map((f) => ({ project: d.project, ...f })))),
    kpis: kpisFor(name).map((m) => kpiProgress(name, m, classification.targets?.find((t) => t.measure === m.slug))),
  };
};

/**
 * Everything a page needs to show ANY catalog measure as a KPI of ANY
 * classification, serialized for the browser. The build only knows the
 * seeded links; a KPI linked in Workspace settings has to be drawable too,
 * and its figures come from project data only the build has.
 */
export interface KpiFigures {
  name: string;
  unit: string;
  decimals: number;
  additive: boolean;
  reported: number | null;
  committed: number | null;
  from: { name: string; slug: string; href: string; reported: number; committed: number; series: KpiYear[] }[];
}

export const kpiFigureTable = (
  hrefOf: (p: Project) => string,
): Record<string, { kpis: string[]; targets: GoalTarget[]; figures: Record<string, KpiFigures> }> =>
  Object.fromEntries(
    CLASSIFICATIONS.map((c) => [
      c.slug,
      {
        kpis: kpisFor(c.name).map((m) => m.slug),
        targets: c.targets ?? [],
        figures: Object.fromEntries(
          catalog
            .filter((m) => m.status !== 'Retired' && m.name.trim())
            .map((m) => {
              const k = kpiProgress(c.name, m);
              return [
                m.slug,
                {
                  name: m.name,
                  unit: k.unit,
                  decimals: m.decimalPlaces,
                  additive: k.additive,
                  reported: k.reported,
                  committed: k.committed,
                  from: k.contributions.map((x) => ({
                    name: x.project.projectName,
                    slug: projectSlug(x.project),
                    href: hrefOf(x.project),
                    reported: x.reported,
                    committed: x.committed,
                    series: x.series,
                  })),
                },
              ];
            }),
        ),
      },
    ]),
  );

/** The app-side page for one classification. */
export const classificationHref = (slug: string): string => `/prototypes/classifications/${slug}`;


// A goal target on a measure that does not list the classification is a
// target nobody can report toward. Catch it at build.
for (const c of CLASSIFICATIONS) {
  for (const t of c.targets ?? []) {
    if (!kpisFor(c.name).some((m) => m.slug === t.measure)) {
      throw new Error(`${c.name} sets a target on ${t.measure}, which is not one of its performance measures`);
    }
  }
}
