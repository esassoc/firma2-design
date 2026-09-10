// Mock project portfolio for the ProjectFirma 2.0 prototypes.
//
// INVENTED CONTENT. Every project, organization, cost, and year below is
// fabricated. Nothing here is copied, derived, or sanitized from a client
// system, a real grant portfolio, or any ProjectFirma tenant's data — this repo
// and its deployed site are public.
//
// What IS borrowed is the domain VOCABULARY, taken from the open-source
// ProjectFirma data model so the screens speak the product's own language:
// ProjectStage (Proposal / Planning & Design / Implementation /
// Post-Implementation / Completed / Deferred), the taxonomy tier that groups
// projects into programs, EstimatedTotalCost, and the
// ImplementationStartYear / CompletionYear pair. California county and
// watershed names are real geography; the organizations working in them are
// not.
//
// Deterministic by construction — a literal array, no generated values, so
// every demo run renders the identical table.

/**
 * ProjectFirma classifications — the plan goals a project works toward, and the
 * portfolio's primary roll-up axis: "what did we buy toward salmon recovery"
 * is a classification question before it is a program one. The VOCABULARY
 * SHAPE is ProjectFirma's (a tenant-configured classification system that
 * projects associate with, distinct from the program taxonomy that files
 * them); these seven goal labels are invented for this portfolio.
 *
 * A union type rather than `string`, for the same reason AUTHORED keys are
 * checked against project names: a misspelled classification would silently
 * split a roll-up bucket in two, and a type error at the literal is cheaper
 * than a chart with two half-sized bars.
 */
export type Classification =
  | 'Salmon & steelhead recovery'
  | 'Riparian & wetland habitat'
  | 'Water quality'
  | 'Water supply reliability'
  | 'Wildfire resilience'
  | 'Flood risk reduction'
  | 'Public access & recreation';

/** ProjectFirma's project lifecycle ladder, in canonical (not alphabetical) order. */
export type ProjectStage =
  | 'Proposal'
  | 'Planning & Design'
  | 'Implementation'
  | 'Post-Implementation'
  | 'Completed'
  | 'Deferred';

/** Canonical lifecycle order — drives both the filter chips and the column sort. */
export const STAGE_ORDER: ProjectStage[] = [
  'Proposal',
  'Planning & Design',
  'Implementation',
  'Post-Implementation',
  'Completed',
  'Deferred',
];

/**
 * esa-pill variant per stage. Deferred takes `warning` so the off-track state
 * stands out; the two terminal stages share `success`, which is accurate —
 * both mean the work is done.
 */
export const STAGE_TONE: Record<ProjectStage, 'default' | 'info' | 'primary' | 'success' | 'warning'> = {
  'Proposal': 'default',
  'Planning & Design': 'info',
  'Implementation': 'primary',
  'Post-Implementation': 'success',
  'Completed': 'success',
  'Deferred': 'warning',
};

export interface Project {
  projectName: string;
  /** Taxonomy tier — the program a project rolls up into. */
  program: string;
  /**
   * The goal(s) the project works toward — one or two, never a keyword cloud.
   * See the Classification type above for what this axis is and is not.
   */
  classifications: Classification[];
  leadOrganization: string;
  county: string;
  stage: ProjectStage;
  implementationStartYear: number;
  completionYear: number;
  /**
   * Whole dollars. The WHOLE-PROJECT budget — what it costs to get the work
   * built, start to finish. It is NOT divided into yearly allocations: a
   * project is budgeted once, and what varies year to year is what it actually
   * spends. See ExpenditureYear in firma2-project-detail.ts.
   */
  estimatedTotalCost: number;
  /**
   * Whole dollars per year. What it costs to KEEP the work functioning once it
   * exists — screen cleaning, weed retreatment, fuel-break mowing — as distinct
   * from `estimatedTotalCost`, which builds it. ProjectFirma stores the two
   * side by side (EstimatedTotalCost / EstimatedAnnualOperatingCost) for
   * exactly this reason: a sponsor who can fund construction cannot always fund
   * the decades after it, and the second figure is the one that decides whether
   * the first was worth spending.
   *
   * Authored per project rather than derived from the capital cost, because the
   * RATIO is the interesting part and it is not constant: a barrier removal is
   * built once and forgotten, while an invasive-plant treatment or an urban
   * greenway costs a real fraction of its build every year forever. A formula
   * would flatten exactly the difference a reader is here to see.
   */
  estimatedAnnualOperatingCost: number;
}

export const projects: Project[] = [
  { projectName: 'Deer Creek Riparian Corridor Enhancement', program: 'Riparian Revegetation', classifications: ['Salmon & steelhead recovery', 'Riparian & wetland habitat'], leadOrganization: 'Deer Creek Watershed Alliance', county: 'Tehama', stage: 'Implementation', implementationStartYear: 2023, completionYear: 2027, estimatedTotalCost: 412000, estimatedAnnualOperatingCost: 18000 },
  { projectName: 'Scott River Fish Passage Barrier Removal', program: 'Fish Passage', classifications: ['Salmon & steelhead recovery'], leadOrganization: 'Scott Valley Resource District', county: 'Siskiyou', stage: 'Planning & Design', implementationStartYear: 2025, completionYear: 2028, estimatedTotalCost: 1240000, estimatedAnnualOperatingCost: 6500 },
  { projectName: 'Suisun Slough Tidal Marsh Enhancement', program: 'Meadow & Wetland Restoration', classifications: ['Riparian & wetland habitat', 'Flood risk reduction'], leadOrganization: 'Suisun Basin Conservancy', county: 'Solano', stage: 'Implementation', implementationStartYear: 2022, completionYear: 2026, estimatedTotalCost: 876500, estimatedAnnualOperatingCost: 41000 },
  { projectName: 'Red Clover Valley Meadow Reconnection', program: 'Meadow & Wetland Restoration', classifications: ['Water supply reliability', 'Riparian & wetland habitat'], leadOrganization: 'Feather Headwaters Trust', county: 'Plumas', stage: 'Completed', implementationStartYear: 2018, completionYear: 2023, estimatedTotalCost: 305000, estimatedAnnualOperatingCost: 9500 },
  { projectName: 'Cosumnes Floodplain Reconnection', program: 'Aquatic Habitat Restoration', classifications: ['Salmon & steelhead recovery', 'Flood risk reduction'], leadOrganization: 'Cosumnes Valley Conservancy', county: 'Sacramento', stage: 'Proposal', implementationStartYear: 2027, completionYear: 2031, estimatedTotalCost: 2150000, estimatedAnnualOperatingCost: 62000 },
  { projectName: 'Bear River Gravel Augmentation', program: 'Aquatic Habitat Restoration', classifications: ['Salmon & steelhead recovery'], leadOrganization: 'Bear River Watershed Council', county: 'Nevada', stage: 'Implementation', implementationStartYear: 2024, completionYear: 2026, estimatedTotalCost: 528000, estimatedAnnualOperatingCost: 4000 },
  { projectName: 'Yuba Headwaters Fuels Reduction', program: 'Forest Health & Fuels', classifications: ['Wildfire resilience', 'Water supply reliability'], leadOrganization: 'Yuba Headwaters Partnership', county: 'Sierra', stage: 'Implementation', implementationStartYear: 2019, completionYear: 2033, estimatedTotalCost: 9640000, estimatedAnnualOperatingCost: 185000 },
  { projectName: 'Butte Creek Canyon Fuel Break', program: 'Forest Health & Fuels', classifications: ['Wildfire resilience'], leadOrganization: 'Upper Butte Fire Safe Alliance', county: 'Butte', stage: 'Post-Implementation', implementationStartYear: 2019, completionYear: 2024, estimatedTotalCost: 1690000, estimatedAnnualOperatingCost: 74000 },
  { projectName: 'Navarro River Large Wood Placement', program: 'Aquatic Habitat Restoration', classifications: ['Salmon & steelhead recovery'], leadOrganization: 'Navarro Coastal Stewardship', county: 'Mendocino', stage: 'Completed', implementationStartYear: 2020, completionYear: 2024, estimatedTotalCost: 447000, estimatedAnnualOperatingCost: 8000 },
  { projectName: 'Salinas River Arundo Removal', program: 'Riparian Revegetation', classifications: ['Water supply reliability', 'Riparian & wetland habitat'], leadOrganization: 'Salinas Basin Water Alliance', county: 'Monterey', stage: 'Implementation', implementationStartYear: 2022, completionYear: 2027, estimatedTotalCost: 962000, estimatedAnnualOperatingCost: 55000 },
  { projectName: 'Alameda Creek Culvert Retrofit', program: 'Fish Passage', classifications: ['Salmon & steelhead recovery', 'Flood risk reduction'], leadOrganization: 'East Bay Stream Partners', county: 'Alameda', stage: 'Planning & Design', implementationStartYear: 2026, completionYear: 2029, estimatedTotalCost: 1875000, estimatedAnnualOperatingCost: 21000 },
  { projectName: 'Truckee River Streambank Stabilization', program: 'Stormwater & Water Quality', classifications: ['Water quality'], leadOrganization: 'Truckee Basin Conservancy', county: 'Placer', stage: 'Implementation', implementationStartYear: 2024, completionYear: 2027, estimatedTotalCost: 734000, estimatedAnnualOperatingCost: 16500 },
  { projectName: 'Elk River Sediment Reduction', program: 'Stormwater & Water Quality', classifications: ['Water quality', 'Flood risk reduction'], leadOrganization: 'Humboldt Bay Watershed Trust', county: 'Humboldt', stage: 'Deferred', implementationStartYear: 2025, completionYear: 2029, estimatedTotalCost: 1120000, estimatedAnnualOperatingCost: 28000 },
  { projectName: 'Carmel Valley Steelhead Habitat', program: 'Aquatic Habitat Restoration', classifications: ['Salmon & steelhead recovery'], leadOrganization: 'Carmel Watershed Collaborative', county: 'Monterey', stage: 'Post-Implementation', implementationStartYear: 1999, completionYear: 2023, estimatedTotalCost: 4260000, estimatedAnnualOperatingCost: 96000 },
  { projectName: 'Owens Valley Spring Channel Restoration', program: 'Meadow & Wetland Restoration', classifications: ['Riparian & wetland habitat', 'Water supply reliability'], leadOrganization: 'Eastern Sierra Land Coalition', county: 'Inyo', stage: 'Planning & Design', implementationStartYear: 2026, completionYear: 2030, estimatedTotalCost: 1340000, estimatedAnnualOperatingCost: 34000 },
  { projectName: 'Putah Creek Riparian Planting', program: 'Riparian Revegetation', classifications: ['Riparian & wetland habitat'], leadOrganization: 'Lower Putah Stewardship Group', county: 'Yolo', stage: 'Completed', implementationStartYear: 2019, completionYear: 2022, estimatedTotalCost: 218000, estimatedAnnualOperatingCost: 11500 },
  { projectName: 'San Luis Rey Arroyo Toad Habitat', program: 'Aquatic Habitat Restoration', classifications: ['Riparian & wetland habitat'], leadOrganization: 'Inland Rivers Conservancy', county: 'San Diego', stage: 'Proposal', implementationStartYear: 2027, completionYear: 2030, estimatedTotalCost: 845000, estimatedAnnualOperatingCost: 19000 },
  { projectName: 'Klamath Tributary Thermal Refugia', program: 'Aquatic Habitat Restoration', classifications: ['Salmon & steelhead recovery'], leadOrganization: 'Klamath Tributaries Stewardship Group', county: 'Siskiyou', stage: 'Implementation', implementationStartYear: 2023, completionYear: 2028, estimatedTotalCost: 1560000, estimatedAnnualOperatingCost: 37500 },
  { projectName: 'Mokelumne Meadow Rewetting', program: 'Meadow & Wetland Restoration', classifications: ['Water supply reliability', 'Riparian & wetland habitat'], leadOrganization: 'Highland Sierra Trust', county: 'Amador', stage: 'Planning & Design', implementationStartYear: 2026, completionYear: 2029, estimatedTotalCost: 597000, estimatedAnnualOperatingCost: 14000 },
  { projectName: 'Pescadero Marsh Tidal Exchange', program: 'Meadow & Wetland Restoration', classifications: ['Salmon & steelhead recovery', 'Water quality'], leadOrganization: 'Coastside Wetlands Group', county: 'San Mateo', stage: 'Deferred', implementationStartYear: 2024, completionYear: 2028, estimatedTotalCost: 2310000, estimatedAnnualOperatingCost: 68000 },
  { projectName: 'Battle Creek Diversion Screening', program: 'Fish Passage', classifications: ['Salmon & steelhead recovery'], leadOrganization: 'North Valley Fisheries Trust', county: 'Shasta', stage: 'Implementation', implementationStartYear: 2022, completionYear: 2026, estimatedTotalCost: 1985000, estimatedAnnualOperatingCost: 89000 },
  { projectName: 'Cache Creek Floodplain Terracing', program: 'Aquatic Habitat Restoration', classifications: ['Riparian & wetland habitat', 'Flood risk reduction'], leadOrganization: 'Capay Valley Land Council', county: 'Yolo', stage: 'Proposal', implementationStartYear: 2028, completionYear: 2032, estimatedTotalCost: 1470000, estimatedAnnualOperatingCost: 33000 },
  { projectName: 'Trinity River Side-Channel Construction', program: 'Aquatic Habitat Restoration', classifications: ['Salmon & steelhead recovery'], leadOrganization: 'Trinity Restoration Alliance', county: 'Trinity', stage: 'Post-Implementation', implementationStartYear: 2017, completionYear: 2022, estimatedTotalCost: 2740000, estimatedAnnualOperatingCost: 12000 },
  { projectName: 'Arroyo Seco Urban Greenway', program: 'Stormwater & Water Quality', classifications: ['Water quality', 'Public access & recreation'], leadOrganization: 'Central LA Watershed Coalition', county: 'Los Angeles', stage: 'Planning & Design', implementationStartYear: 2026, completionYear: 2030, estimatedTotalCost: 3120000, estimatedAnnualOperatingCost: 115000 },
];

/**
 * URL-safe id for a project, derived from its name rather than stored beside it.
 *
 * Derived because a hand-maintained slug column is a second name to keep in
 * sync, and the two drift the first time somebody fixes a typo in one of them.
 * The real ProjectFirma keys projects by an integer ProjectID; a slug is the
 * prototype's stand-in, and it reads in the address bar, which an integer does
 * not.
 *
 * This is the SINGLE source for the id: the detail route's getStaticPaths and
 * every link into it both call this, so a link can never point at a slug the
 * route did not generate.
 */
export const projectSlug = (project: Project): string =>
  project.projectName
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Route to a project's detail page. Root-relative and BASE-LESS — wrap with
 * withBase() at render, the same contract src/data/prototypes.ts and
 * firma2-nav.ts use, because dev serves at / and the Pages build at
 * /firma2-design/.
 */
export const projectHref = (project: Project): string =>
  `/prototypes/projects/${projectSlug(project)}`;

// Two projects whose names slugify identically would silently collapse into one
// detail page and one working link, which is the kind of bug that surfaces as
// "why does this card open the wrong project" long after the row was added.
// Fail the build instead.
{
  const seen = new Map<string, string>();
  for (const project of projects) {
    const slug = projectSlug(project);
    const clash = seen.get(slug);
    if (clash) {
      throw new Error(
        `projectSlug collision on "${slug}": "${clash}" and "${project.projectName}"`,
      );
    }
    seen.set(slug, project.projectName);
  }
}

/** Programs present in the data, alphabetical — the filter never lists an empty bucket. */
export const programs: string[] = Array.from(new Set(projects.map((p) => p.program))).sort();

/** Classifications present in the data, alphabetical — same contract as `programs`. */
export const classifications: Classification[] = Array.from(
  new Set(projects.flatMap((p) => p.classifications)),
).sort();

/**
 * One entry in the signed-in user's "Recently viewed" row.
 *
 * Recency is SESSION state, not a project attribute: a project is recent for
 * one person and not for the next. Keeping it beside the portfolio rather than
 * as a column on Project also keeps it out of the row data the grid serializes
 * into the page, where no column would read it.
 */
export interface RecentlyViewedProject {
  project: Project;
  /** Relative label — "Today", "Yesterday", "4 days ago". */
  viewedAt: string;
}

/**
 * `viewedAt` stores the rendered LABEL, not a timestamp, on purpose. This spoke
 * is a static build: a stored date formatted against build time would read
 * "Today" on deploy day and "47 days ago" a month later, and formatting it
 * against the visitor's clock would need client JS to avoid disagreeing with
 * the server-rendered string. A literal label is deterministic in the way
 * design-principles asks mock data to be — the demo reads identically forever.
 */
const RECENTLY_VIEWED: { projectName: string; viewedAt: string }[] = [
  { projectName: 'Yuba Headwaters Fuels Reduction', viewedAt: 'Today' },
  { projectName: 'Scott River Fish Passage Barrier Removal', viewedAt: 'Yesterday' },
  { projectName: 'Elk River Sediment Reduction', viewedAt: '2 days ago' },
  { projectName: 'Cosumnes Floodplain Reconnection', viewedAt: '4 days ago' },
];

const projectsByName = new Map(projects.map((p) => [p.projectName, p]));

/**
 * Most recent first — the order the Recently viewed row renders. Resolved by
 * name against `projects` so the row can never drift into showing a stage,
 * organization, or cost the table disagrees with; renaming a project without
 * updating RECENTLY_VIEWED fails the build instead of silently dropping a card.
 */
export const recentlyViewed: RecentlyViewedProject[] = RECENTLY_VIEWED.map(
  ({ projectName, viewedAt }) => {
    const project = projectsByName.get(projectName);
    if (!project) {
      throw new Error(`recentlyViewed: no project named "${projectName}" in projects`);
    }
    return { project, viewedAt };
  },
);
