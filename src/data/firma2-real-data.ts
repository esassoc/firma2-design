// A REAL WORKSPACE, WHEN ONE IS ON DISK — and only in `astro dev`.
//
// `scripts/pull-projectfirma.mjs` writes one ProjectFirma tenant to
// docs/private/<tenant>/workspace.json, which is gitignored. astro.config.mjs
// serves that file as `virtual:firma2-workspace` in dev and as `null` in every
// build, so the public site always renders the invented fixtures. Nothing from
// a tenant is written in this file or anywhere else under src/.
//
// THE SWITCH IS AT THE ROOTS. Each fixture module that owns a vocabulary —
// projects, their detail, classifications, measures, organizations — asks
// `REAL` once and builds the same shape from it. Everything downstream reads
// those modules as before.
//
// WHAT A TENANT'S PUBLIC DATA DOES NOT HOLD stays invented, because the app
// still needs it to render: the people (users, project contacts, who made each
// change), the change log, the publishing state, and operating costs. What is
// INFERRED rather than read is marked where it is inferred: `projectTypeOf`
// and `countyOf` below, and the measure-to-classification link in
// firma2-performance-measures.ts.

import raw from 'virtual:firma2-workspace';
import type { ClassificationName, Project, ProjectStage, ProjectTypeName, TagName } from './firma2-projects';

export interface RealMeasureRow {
  measure: string;
  measureId: number | null;
}

export interface RealProject {
  id: number;
  name: string;
  taxonomyBranch: string;
  taxonomyLeaf: string;
  description: string;
  planningStartYear: number | null;
  implementationStartYear: number | null;
  completionYear: number | null;
  stage: string;
  latitude: number | null;
  longitude: number | null;
  /** GeoJSON geometries, [lng, lat]. */
  geometries: { type: string; coordinates: any }[];
  /** False when the tenant's own site does not show the project to the public. */
  publicPage: boolean;
  organizations: { role: string; id: number; name: string }[];
  expected: (RealMeasureRow & { subcategories: { name: string; option: string }[]; value: number | null; unit: string })[];
  reported: (RealMeasureRow & { dimensions: string[]; unit: string; rows: { options: string[]; byYear: Record<string, number> }[] })[];
  estimatedTotalCost: number | null;
  securedFunding: number | null;
  targetedFunding: number | null;
  funding: { fund: string; secured: number; targeted: number }[];
  expenditures: { fund: string; byYear: Record<string, number> }[];
  /** Classification system name → what the project is filed under. */
  classifications: Record<string, { name: string; note: string }[]>;
  notes: { date: string; author: string; text: string }[];
  photos: { url: string; caption: string; timing: string; credit: string }[];
  /** Listed in a signed-in user's Excel export, which adds the four fields below. */
  fromExport?: boolean;
  primaryContact?: { name: string; email: string } | null;
  /** Limiting factors beyond the taxonomy leaf. */
  otherLimitingFactors?: string[];
  biennium?: string;
  federalFunding?: string;
  locationNotes?: string;
}

export interface RealWorkspace {
  source: { host: string; tenant: string; name: string; pulled: string };
  projects: RealProject[];
  organizations: { id: number; name: string; shortName: string; type: string; primaryContact: string; projectCount: number; fundCount: number }[];
  measures: { id: number; name: string; description: string; unit: string; subcategories: { name: string; options: number }[] }[];
}

/** The workspace on disk, or null — always null in a build. */
export const REAL: RealWorkspace | null = raw as RealWorkspace | null;

export const slugOf = (name: string): string =>
  name.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

// The projects with a record to build: the ones the tenant shows the public,
// and the ones a signed-in user's export lists (deferred and terminated work).
// The web services also list proposals with neither; those carry no
// organization, cost or measures.
const visible: RealProject[] = (REAL?.projects ?? []).filter(
  (p) => (p.publicPage || p.fromExport) && p.organizations.some((o) => o.role === 'Lead Implementer'),
);

export const realRecords: Map<string, RealProject> = new Map(visible.map((p) => [p.name, p]));

// "Terminated" has no stage here and reads as Deferred, the nearest one.
const STAGES: Record<string, ProjectStage> = {
  Proposal: 'Proposal',
  'Planning/Design': 'Planning & Design',
  Implementation: 'Implementation',
  'Post-Implementation': 'Post-Implementation',
  Completed: 'Completed',
};

/**
 * INFERRED. ProjectFirma has no project type in this spoke's sense — the thing
 * that decides a project's fields and page layout — so each project takes the
 * prototype type nearest its limiting factor. A tenant would choose these.
 */
const projectTypeOf = (p: RealProject): ProjectTypeName => {
  const filed = `${p.taxonomyBranch} ${p.taxonomyLeaf}`;
  if (/passage|crossing|dams|diversion|reservoir/i.test(filed)) return 'Fish passage';
  if (/toxin|sediment|hydrology|stormwater|chemical|upslope/i.test(filed)) return 'Stormwater & water quality';
  if (/riparian|temperature|macrodetrital/i.test(p.taxonomyLeaf)) return 'Riparian revegetation';
  return 'Aquatic habitat restoration';
};

/**
 * INFERRED from the project's coordinates: the Clackamas–Multnomah line runs
 * east–west near 45.4615° N across this basin. ProjectFirma's web services
 * carry no county, and a project with no coordinates takes the basin's own.
 */
const countyOf = (p: RealProject): string => (p.latitude !== null && p.latitude > 45.4615 ? 'Multnomah' : 'Clackamas');

/** The classification systems a project is filed in, beyond its taxonomy leaf.
 *  "Project Types" is left out: it is a set of labels, read as tags. */
const TAG_SYSTEM = 'Project Types';
export const realSystems = (): string[] =>
  Array.from(new Set(visible.flatMap((p) => Object.keys(p.classifications)))).filter((s) => s !== TAG_SYSTEM);

export const realTagNames: string[] = Array.from(
  new Set(visible.flatMap((p) => (p.classifications[TAG_SYSTEM] ?? []).map((c) => c.name))),
).sort();

export const realProjects: Project[] | null = REAL
  ? visible.map((p) => {
      const start = p.implementationStartYear ?? p.planningStartYear ?? 0;
      return {
        projectName: p.name,
        projectType: projectTypeOf(p),
        classifications: [
          p.taxonomyLeaf,
          ...(p.otherLimitingFactors ?? []),
          ...realSystems().flatMap((s) => (p.classifications[s] ?? []).map((c) => c.name)),
        ] as ClassificationName[],
        tags: (p.classifications[TAG_SYSTEM] ?? []).map((c) => c.name) as TagName[],
        leadOrganization: p.organizations.find((o) => o.role === 'Lead Implementer')!.name,
        county: countyOf(p),
        stage: STAGES[p.stage] ?? 'Deferred',
        implementationStartYear: start,
        completionYear: p.completionYear ?? start,
        estimatedTotalCost: p.estimatedTotalCost ?? 0,
        // Not a field the tenant's public pages show.
        estimatedAnnualOperatingCost: 0,
      };
    })
  : null;

// ---------------------------------------------------------------------------
// Funds and units
// ---------------------------------------------------------------------------

/** "OWEB Grant (OWEB)" → the fund and the organization behind it. The part in
 *  the last brackets is the organization's short name. */
export const realFund = (label: string): { name: string; organization: string } => {
  const m = /^(.*) \(([^()]*)\)$/.exec(label.trim());
  const short = m?.[2].trim();
  const organization = REAL?.organizations.find((o) => o.shortName.trim() === short)?.name;
  return { name: (m?.[1] ?? label).trim(), organization: organization ?? (m?.[1] ?? label).trim() };
};

/** A tenant's unit, in the spoke's unit vocabulary. "Linear Foot (lf)" and
 *  "lf" both read "linear feet". */
const UNIT_NAMES: Record<string, string> = {
  lf: 'linear feet',
  acres: 'acres',
  'sq ft': 'square feet',
  miles: 'miles',
  number: 'each',
};
export const realUnit = (unit: string): string => {
  const short = (/\(([^()]*)\)\s*$/.exec(unit)?.[1] ?? unit).trim();
  return UNIT_NAMES[short] ?? short;
};

/** The catalog measure a project's row reports toward, by id and then name. */
export const realMeasureFor = (row: RealMeasureRow) =>
  REAL?.measures.find((m) => m.id === row.measureId) ?? REAL?.measures.find((m) => m.name === row.measure.trim());

// ---------------------------------------------------------------------------
// Where the workspace is
// ---------------------------------------------------------------------------

const located = visible.filter((p) => p.latitude !== null && p.longitude !== null);

/** The middle of the workspace's located projects — where an unplaced map opens. */
export const realCenter: [number, number] | null = located.length
  ? [
      Number((located.reduce((sum, p) => sum + p.latitude!, 0) / located.length).toFixed(4)),
      Number((located.reduce((sum, p) => sum + p.longitude!, 0) / located.length).toFixed(4)),
    ]
  : null;
