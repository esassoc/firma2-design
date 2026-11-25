// The Progress Dashboard's inventory, built once: every FIGURE the workspace
// holds and every DIMENSION it can be split or filtered by, flattened to what
// the browser needs to draw any tile (src/lib/dashboard-model.ts).
//
// It is assembled from the same modules the record pages read, so a tile and
// a project page cannot disagree:
//
//   FIGURES
//     Performance measures  every published measure, by project and year,
//                           reported against planned
//     Projects              how many; how many completed; milestones reached
//     Money                 estimated total cost, funding secured, annual
//                           operating cost, spent by year
//     Work areas            mapped acres and stream miles
//     Reporting             reports filed of those owed, by year
//     Custom fields         every NUMBER custom field, added up
//
//   DIMENSIONS
//     the project's own     project type, stage, lead organization and its
//                           type, county, start year, completion year
//     classifications       plan goal, and one dimension per practice group
//     who paid              funder, funding program
//     custom fields         every CHOICE custom field
//
// NOT IN IT, and why: date and text custom fields (nothing to add up or group
// by without binning), contacts, comments, photos and the audit log (records
// about the project, not figures of it), and geography beyond county (regions
// and subwatersheds are drawn on the map but not yet stored on a project).
import { projects } from './firma2-projects';
import { getProjectDetail, securedFunding } from './firma2-project-detail';
import { measures, isSummable, liveOptions, askedBreakdowns } from './firma2-performance-measures';
import { measurePortfolio } from './firma2-classification-rollup';
import { PRACTICE_GROUP, childGroups, classificationsUnderGroup, goalClassifications } from './firma2-classifications';
import { organizations } from './firma2-directory';
import { FIELD_DEFINITIONS, fieldValue, projectTypeFor } from './firma2-project-types';
import type { Dataset, DsDimension, DsMeasure, DsRow } from '../lib/dashboard-model';

/** The last reporting year that has closed. */
const LAST_CLOSED = 2025;
const DONE = ['Completed', 'Post-Implementation'];

// Deterministic 0–1 from a string, for the invented readings below.
const unit = (text: string): number => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return ((h >>> 0) % 10000) / 10000;
};

const hasField = (project: (typeof projects)[number], fieldId: string): boolean => projectTypeFor(project).fields.some((f) => f.fieldId === fieldId);

let built: Dataset | undefined;

export const dashboardDataset = (): Dataset => {
  if (built) return built;
  const all = projects.map((p, i) => ({ p, i, detail: getProjectDetail(p) }));
  const goals = new Set(goalClassifications().map((c) => c.name));
  // One dimension per area of work, each holding every practice beneath it.
  const practiceGroups = childGroups(PRACTICE_GROUP).map((g) => ({ ...g, members: classificationsUnderGroup(g.slug).map((c) => c.name) }));
  const choiceFields = FIELD_DEFINITIONS.filter((d) => d.kind === 'choice' || d.kind === 'multi-choice' || d.kind === 'yes-no');
  const numberFields = FIELD_DEFINITIONS.filter((d) => (d.kind === 'number' || d.kind === 'money') && d.range);

  const dimensions: DsDimension[] = [
    { key: 'type', label: 'Project type', plural: 'project types' },
    { key: 'stage', label: 'Stage', plural: 'stages' },
    { key: 'lead', label: 'Lead organization', plural: 'lead organizations' },
    { key: 'orgtype', label: 'Lead organization type', plural: 'organization types' },
    { key: 'county', label: 'County', plural: 'counties' },
    { key: 'goal', label: 'Plan goal', plural: 'plan goals', overlapping: true },
    ...practiceGroups.map((g) => ({ key: `cg-${g.slug}`, label: g.name, plural: g.name.toLowerCase(), overlapping: true })),
    { key: 'funder', label: 'Funder', plural: 'funders', overlapping: true, shares: true },
    { key: 'program', label: 'Funding source', plural: 'funding sources', overlapping: true, shares: true },
    { key: 'start', label: 'Start year', plural: 'start years' },
    { key: 'end', label: 'Completion year', plural: 'completion years' },
    ...choiceFields.map((d) => ({ key: `cf-${d.id}`, label: d.label, plural: d.label.toLowerCase() })),
  ];

  const dsProjects = all.map(({ p, detail }) => {
    const sum = (key: 'organization' | 'name') => {
      const out: Record<string, number> = {};
      securedFunding(detail.funding).forEach((f) => (out[f[key]] = Number(((out[f[key]] ?? 0) + f.share).toFixed(6))));
      return out;
    };
    const funder = sum('organization');
    const program = sum('name');
    const dims: Record<string, string[]> = {
      type: [p.projectType],
      stage: [p.stage],
      lead: [p.leadOrganization],
      orgtype: organizations.filter((o) => o.name === p.leadOrganization).map((o) => o.type),
      county: [p.county],
      goal: p.classifications.filter((c) => goals.has(c)),
      funder: Object.keys(funder),
      program: Object.keys(program),
      start: [String(p.implementationStartYear)],
      end: [String(p.completionYear)],
    };
    practiceGroups.forEach((g) => (dims[`cg-${g.slug}`] = p.classifications.filter((c) => g.members.includes(c))));
    // A custom field belongs to a project type; other projects have no value for it.
    choiceFields.forEach((d) => {
      const value = hasField(p, d.id) ? fieldValue(p, d) : '';
      dims[`cf-${d.id}`] = value ? [value] : [];
    });
    return { name: p.projectName, dims, shares: { funder, program } };
  });

  const base = { decimals: 0, additive: true, breakdowns: [] };
  const each = (value: (x: (typeof all)[number]) => number): DsRow[] =>
    all.map((x) => ({ p: x.i, committed: value(x), series: [], plan: [] })).filter((r) => r.committed > 0);

  // ---- performance measures ------------------------------------------------
  const performance: DsMeasure[] = measures
    .filter((m) => m.status === 'Published')
    .map((m) => {
      const progress = measurePortfolio(m);
      return {
        slug: m.slug,
        name: m.name,
        unit: progress.unit,
        decimals: m.decimalPlaces,
        additive: isSummable(m),
        group: 'Performance measures' as const,
        breakdowns: askedBreakdowns(m).map((b) => ({ question: b.question, options: liveOptions(b) })),
        rows: progress.contributions.map((c) => ({
          p: projects.indexOf(c.project),
          committed: c.committed,
          series: c.series.map((y) => [y.year, y.value] as [number, number | null]),
          plan: c.plan.map((y) => [y.year, y.planned] as [number, number]),
        })),
      };
    });

  // INVENTED. The catalog's one measure that does not sum — plant survival
  // rate — has no project reporting toward it in the seed data, and the
  // dashboard's hardest rule (never total or accumulate an average) cannot be
  // seen without one. The planting projects get a survival reading for each
  // year they filed acres, against the goal's 80% target.
  const survival = performance.find((m) => m.slug === 'plant-survival-rate');
  const planting = performance.find((m) => m.slug === 'acres-riparian-habitat-restored');
  if (survival && planting && survival.rows.length === 0) {
    survival.rows = planting.rows.map((r) => ({
      p: r.p,
      committed: 80,
      series: r.series.map(([year, value]) => [year, value == null ? null : Math.round(64 + unit(`${dsProjects[r.p].name}|${year}`) * 28)] as [number, number | null]),
      plan: r.plan.map(([year]) => [year, 80] as [number, number]),
    }));
  }
  const reporting = performance.filter((m) => m.rows.length > 0);

  // ---- reporting: of the measure-years a project owed, how many it filed ----
  const filings = new Map<number, Map<number, { owed: number; filed: number }>>();
  reporting.forEach((m) =>
    m.rows.forEach((r) =>
      r.series.forEach(([year, value]) => {
        const years = filings.get(r.p) ?? new Map<number, { owed: number; filed: number }>();
        const cell = years.get(year) ?? { owed: 0, filed: 0 };
        years.set(year, { owed: cell.owed + 1, filed: cell.filed + (value == null ? 0 : 1) });
        filings.set(r.p, years);
      }),
    ),
  );

  built = {
    projects: dsProjects,
    dimensions,
    measures: [
      ...reporting,
      {
        ...base,
        slug: 'projects',
        name: 'Projects',
        unit: 'projects',
        group: 'Projects',
        timeless: true,
        whole: true,
        rows: each(() => 1),
      },
      {
        ...base,
        slug: 'projects-completed',
        name: 'Projects completed',
        unit: 'projects',
        group: 'Projects',
        whole: true,
        filed: 'Completed',
        // A project due by now that is not done is a year owed and not filed.
        rows: all.map(({ p, i }) => ({
          p: i,
          committed: 1,
          series: p.completionYear <= LAST_CLOSED ? [[p.completionYear, DONE.includes(p.stage) ? 1 : null] as [number, number | null]] : [],
          plan: [[p.completionYear, 1] as [number, number]],
        })),
      },
      {
        ...base,
        slug: 'milestones-reached',
        name: 'Milestones reached',
        unit: 'milestones',
        group: 'Projects',
        whole: true,
        filed: 'Reached',
        rows: all.map(({ i, detail }) => {
          const byYear = new Map<number, { all: number; done: number }>();
          detail.milestones.forEach((m) => {
            const year = Number(m.date.slice(-4));
            if (!year) return;
            const cell = byYear.get(year) ?? { all: 0, done: 0 };
            byYear.set(year, { all: cell.all + 1, done: cell.done + (m.status === 'complete' ? 1 : 0) });
          });
          const years = [...byYear].sort((a, b) => a[0] - b[0]);
          return {
            p: i,
            committed: detail.milestones.length,
            series: years.filter(([year]) => year <= LAST_CLOSED).map(([year, c]) => [year, c.done] as [number, number | null]),
            plan: years.map(([year, c]) => [year, c.all] as [number, number]),
          };
        }),
      },
      {
        ...base,
        slug: 'estimated-total-cost',
        name: 'Estimated total cost',
        unit: 'dollars',
        group: 'Money',
        timeless: true,
        shared: true,
        rows: each(({ p }) => p.estimatedTotalCost),
      },
      {
        ...base,
        slug: 'funding-secured',
        name: 'Funding secured',
        unit: 'dollars',
        group: 'Money',
        timeless: true,
        shared: true,
        rows: each(({ detail }) => securedFunding(detail.funding).reduce((a, f) => a + f.amount, 0)),
      },
      {
        ...base,
        slug: 'annual-operating-cost',
        name: 'Estimated annual operating cost',
        unit: 'dollars',
        group: 'Money',
        timeless: true,
        rows: each(({ p }) => p.estimatedAnnualOperatingCost),
      },
      {
        ...base,
        slug: 'spent',
        name: 'Spent',
        unit: 'dollars',
        group: 'Money',
        budgeted: true,
        filed: 'Spent',
        planned: 'Budgeted',
        // A project is budgeted once, not per year: the plan is its whole cost.
        rows: all.map(({ p, i, detail }) => ({
          p: i,
          committed: p.estimatedTotalCost,
          series: detail.expenditures.filter((y) => y.status !== 'upcoming' && y.year <= LAST_CLOSED).map((y) => [y.year, y.spent] as [number, number | null]),
          plan: [],
        })),
      },
      {
        ...base,
        decimals: 1,
        slug: 'work-area-acres',
        name: 'Work area mapped',
        unit: 'acres',
        group: 'Work areas',
        timeless: true,
        rows: each(({ detail }) => detail.workAreas.filter((w) => w.extentUnit === 'acres').reduce((a, w) => a + w.extent, 0)),
      },
      {
        ...base,
        decimals: 1,
        slug: 'work-area-miles',
        name: 'Stream reach mapped',
        unit: 'miles',
        group: 'Work areas',
        timeless: true,
        rows: each(({ detail }) => detail.workAreas.filter((w) => w.extentUnit === 'miles').reduce((a, w) => a + w.extent, 0)),
      },
      {
        ...base,
        slug: 'reports-filed',
        name: 'Reports filed',
        unit: 'reports',
        group: 'Reporting',
        whole: true,
        filed: 'Filed',
        planned: 'Owed',
        rows: [...filings].map(([p, years]) => {
          const sorted = [...years].sort((a, b) => a[0] - b[0]);
          return {
            p,
            committed: sorted.reduce((a, [, c]) => a + c.owed, 0),
            series: sorted.map(([year, c]) => [year, c.filed] as [number, number | null]),
            plan: sorted.map(([year, c]) => [year, c.owed] as [number, number]),
          };
        }),
      },
      // Every number custom field, added up across the projects whose type asks for it.
      ...numberFields.map(
        (d): DsMeasure => ({
          ...base,
          slug: `cf-${d.id}`,
          name: d.label,
          unit: d.unit ?? '',
          group: 'Custom fields',
          timeless: true,
          rows: each(({ p }) => (hasField(p, d.id) ? Number.parseFloat(fieldValue(p, d).replace(/,/g, '')) || 0 : 0)),
        }),
      ),
    ].filter((m) => m.rows.length > 0),
  };
  return built;
};
