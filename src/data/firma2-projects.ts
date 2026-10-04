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
// Post-Implementation / Completed / Deferred), classification systems,
// EstimatedTotalCost, and the
// ImplementationStartYear / CompletionYear pair. California county and
// watershed names are real geography; the organizations working in them are
// not.
//
// Deterministic by construction — a literal array, no generated values, so
// every demo run renders the identical table.

/**
 * THREE WAYS A PROJECT IS FILED, each answering a different question
 * (settled 2026-10-03, user-directed):
 *
 *   Project type     ONE per project. What kind of work it is, and so what
 *                    its page asks and shows (fields + section layout — see
 *                    src/data/firma2-project-types.ts).
 *   Classifications  ONE OR MORE. The initiative's goals (or another grouping,
 *                    like a species) the project works toward. They carry KPIs
 *                    — the catalog measures that track progress against them
 *                    (src/data/firma2-classifications.ts).
 *   Tags             ANY NUMBER, possibly none. Functional labels with no KPIs
 *                    — "is this an education and outreach project?"
 *                    (src/data/firma2-tags.ts).
 *
 * Union types rather than `string`, for the same reason AUTHORED keys are
 * checked against project names: a misspelled value would silently split a
 * roll-up bucket in two, and a type error at the literal is cheaper than a
 * chart with two half-sized bars. The labels are invented.
 */
export type ProjectTypeName =
  | 'Riparian revegetation'
  | 'Fish passage'
  | 'Forest health & fuels'
  | 'Meadow & wetland restoration'
  | 'Aquatic habitat restoration'
  | 'Stormwater & water quality';

export type TagName =
  | 'Education & outreach'
  | 'Volunteer-led'
  | 'Tribal partnership'
  | 'Private landowners'
  | 'Climate adaptation'
  | 'Post-fire recovery';

export type ClassificationName =
  | 'Salmon & steelhead recovery'
  | 'Riparian & wetland habitat'
  | 'Water quality'
  | 'Water supply reliability'
  | 'Wildfire resilience'
  | 'Flood risk reduction'
  | 'Public access & recreation'
  // Practice areas — one group each (src/data/firma2-classifications.ts).
  | 'Barrier removal & fish screens'
  | 'Instream habitat structures'
  | 'Side channels & floodplains'
  | 'Native planting'
  | 'Invasive plant removal'
  | 'Meadow & marsh rewetting'
  | 'Forest thinning'
  | 'Fuel breaks'
  | 'Prescribed fire'
  | 'Erosion & sediment control'
  | 'Stormwater capture'
  | 'Groundwater recharge';

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
  /** What kind of work it is. Decides the project's fields and page layout. */
  projectType: ProjectTypeName;
  /**
   * Its classifications across every group — the plan goals it works toward
   * (never none) and the practices it uses. Each counts toward that
   * classification's KPIs, where it has any.
   */
  classifications: ClassificationName[];
  /** Functional labels. May be empty. */
  tags: TagName[];
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
  { projectName: 'Deer Creek Riparian Corridor Enhancement', projectType: 'Riparian revegetation', classifications: ['Salmon & steelhead recovery', 'Riparian & wetland habitat', 'Native planting'], tags: ['Volunteer-led', 'Private landowners', 'Education & outreach'], leadOrganization: 'Deer Creek Watershed Alliance', county: 'Tehama', stage: 'Implementation', implementationStartYear: 2023, completionYear: 2027, estimatedTotalCost: 412000, estimatedAnnualOperatingCost: 18000 },
  { projectName: 'Scott River Fish Passage Barrier Removal', projectType: 'Fish passage', classifications: ['Salmon & steelhead recovery', 'Barrier removal & fish screens'], tags: ['Private landowners'], leadOrganization: 'Scott Valley Resource District', county: 'Siskiyou', stage: 'Planning & Design', implementationStartYear: 2025, completionYear: 2028, estimatedTotalCost: 1240000, estimatedAnnualOperatingCost: 6500 },
  { projectName: 'Suisun Slough Tidal Marsh Enhancement', projectType: 'Meadow & wetland restoration', classifications: ['Riparian & wetland habitat', 'Flood risk reduction', 'Meadow & marsh rewetting'], tags: ['Climate adaptation'], leadOrganization: 'Suisun Basin Conservancy', county: 'Solano', stage: 'Implementation', implementationStartYear: 2022, completionYear: 2026, estimatedTotalCost: 876500, estimatedAnnualOperatingCost: 41000 },
  { projectName: 'Red Clover Valley Meadow Reconnection', projectType: 'Meadow & wetland restoration', classifications: ['Water supply reliability', 'Riparian & wetland habitat', 'Meadow & marsh rewetting'], tags: ['Tribal partnership', 'Climate adaptation'], leadOrganization: 'Feather Headwaters Trust', county: 'Plumas', stage: 'Completed', implementationStartYear: 2018, completionYear: 2023, estimatedTotalCost: 305000, estimatedAnnualOperatingCost: 9500 },
  { projectName: 'Cosumnes Floodplain Reconnection', projectType: 'Aquatic habitat restoration', classifications: ['Salmon & steelhead recovery', 'Flood risk reduction', 'Side channels & floodplains'], tags: ['Private landowners', 'Climate adaptation'], leadOrganization: 'Cosumnes Valley Conservancy', county: 'Sacramento', stage: 'Proposal', implementationStartYear: 2027, completionYear: 2031, estimatedTotalCost: 2150000, estimatedAnnualOperatingCost: 62000 },
  { projectName: 'Bear River Gravel Augmentation', projectType: 'Aquatic habitat restoration', classifications: ['Salmon & steelhead recovery', 'Instream habitat structures'], tags: [], leadOrganization: 'Bear River Watershed Council', county: 'Nevada', stage: 'Implementation', implementationStartYear: 2024, completionYear: 2026, estimatedTotalCost: 528000, estimatedAnnualOperatingCost: 4000 },
  { projectName: 'Yuba Headwaters Fuels Reduction', projectType: 'Forest health & fuels', classifications: ['Wildfire resilience', 'Water supply reliability', 'Forest thinning', 'Prescribed fire'], tags: ['Tribal partnership'], leadOrganization: 'Yuba Headwaters Partnership', county: 'Sierra', stage: 'Implementation', implementationStartYear: 2019, completionYear: 2033, estimatedTotalCost: 9640000, estimatedAnnualOperatingCost: 185000 },
  { projectName: 'Butte Creek Canyon Fuel Break', projectType: 'Forest health & fuels', classifications: ['Wildfire resilience', 'Fuel breaks'], tags: ['Post-fire recovery', 'Education & outreach'], leadOrganization: 'Upper Butte Fire Safe Alliance', county: 'Butte', stage: 'Post-Implementation', implementationStartYear: 2019, completionYear: 2024, estimatedTotalCost: 1690000, estimatedAnnualOperatingCost: 74000 },
  { projectName: 'Navarro River Large Wood Placement', projectType: 'Aquatic habitat restoration', classifications: ['Salmon & steelhead recovery', 'Instream habitat structures'], tags: ['Tribal partnership'], leadOrganization: 'Navarro Coastal Stewardship', county: 'Mendocino', stage: 'Completed', implementationStartYear: 2020, completionYear: 2024, estimatedTotalCost: 447000, estimatedAnnualOperatingCost: 8000 },
  { projectName: 'Salinas River Arundo Removal', projectType: 'Riparian revegetation', classifications: ['Water supply reliability', 'Riparian & wetland habitat', 'Invasive plant removal'], tags: ['Private landowners'], leadOrganization: 'Salinas Basin Water Alliance', county: 'Monterey', stage: 'Implementation', implementationStartYear: 2022, completionYear: 2027, estimatedTotalCost: 962000, estimatedAnnualOperatingCost: 55000 },
  { projectName: 'Alameda Creek Culvert Retrofit', projectType: 'Fish passage', classifications: ['Salmon & steelhead recovery', 'Flood risk reduction', 'Barrier removal & fish screens'], tags: ['Education & outreach'], leadOrganization: 'East Bay Stream Partners', county: 'Alameda', stage: 'Planning & Design', implementationStartYear: 2026, completionYear: 2029, estimatedTotalCost: 1875000, estimatedAnnualOperatingCost: 21000 },
  { projectName: 'Truckee River Streambank Stabilization', projectType: 'Stormwater & water quality', classifications: ['Water quality', 'Erosion & sediment control'], tags: [], leadOrganization: 'Truckee Basin Conservancy', county: 'Placer', stage: 'Implementation', implementationStartYear: 2024, completionYear: 2027, estimatedTotalCost: 734000, estimatedAnnualOperatingCost: 16500 },
  { projectName: 'Elk River Sediment Reduction', projectType: 'Stormwater & water quality', classifications: ['Water quality', 'Flood risk reduction', 'Erosion & sediment control'], tags: ['Private landowners'], leadOrganization: 'Humboldt Bay Watershed Trust', county: 'Humboldt', stage: 'Deferred', implementationStartYear: 2025, completionYear: 2029, estimatedTotalCost: 1120000, estimatedAnnualOperatingCost: 28000 },
  { projectName: 'Carmel Valley Steelhead Habitat', projectType: 'Aquatic habitat restoration', classifications: ['Salmon & steelhead recovery', 'Instream habitat structures'], tags: ['Volunteer-led'], leadOrganization: 'Carmel Watershed Collaborative', county: 'Monterey', stage: 'Post-Implementation', implementationStartYear: 1999, completionYear: 2023, estimatedTotalCost: 4260000, estimatedAnnualOperatingCost: 96000 },
  { projectName: 'Owens Valley Spring Channel Restoration', projectType: 'Meadow & wetland restoration', classifications: ['Riparian & wetland habitat', 'Water supply reliability', 'Meadow & marsh rewetting', 'Groundwater recharge'], tags: ['Tribal partnership'], leadOrganization: 'Eastern Sierra Land Coalition', county: 'Inyo', stage: 'Planning & Design', implementationStartYear: 2026, completionYear: 2030, estimatedTotalCost: 1340000, estimatedAnnualOperatingCost: 34000 },
  { projectName: 'Putah Creek Riparian Planting', projectType: 'Riparian revegetation', classifications: ['Riparian & wetland habitat', 'Native planting'], tags: ['Volunteer-led', 'Education & outreach'], leadOrganization: 'Lower Putah Stewardship Group', county: 'Yolo', stage: 'Completed', implementationStartYear: 2019, completionYear: 2022, estimatedTotalCost: 218000, estimatedAnnualOperatingCost: 11500 },
  { projectName: 'San Luis Rey Arroyo Toad Habitat', projectType: 'Aquatic habitat restoration', classifications: ['Riparian & wetland habitat', 'Invasive plant removal'], tags: [], leadOrganization: 'Inland Rivers Conservancy', county: 'San Diego', stage: 'Proposal', implementationStartYear: 2027, completionYear: 2030, estimatedTotalCost: 845000, estimatedAnnualOperatingCost: 19000 },
  { projectName: 'Klamath Tributary Thermal Refugia', projectType: 'Aquatic habitat restoration', classifications: ['Salmon & steelhead recovery', 'Instream habitat structures'], tags: ['Tribal partnership', 'Climate adaptation'], leadOrganization: 'Klamath Tributaries Stewardship Group', county: 'Siskiyou', stage: 'Implementation', implementationStartYear: 2023, completionYear: 2028, estimatedTotalCost: 1560000, estimatedAnnualOperatingCost: 37500 },
  { projectName: 'Mokelumne Meadow Rewetting', projectType: 'Meadow & wetland restoration', classifications: ['Water supply reliability', 'Riparian & wetland habitat', 'Meadow & marsh rewetting'], tags: ['Private landowners'], leadOrganization: 'Highland Sierra Trust', county: 'Amador', stage: 'Planning & Design', implementationStartYear: 2026, completionYear: 2029, estimatedTotalCost: 597000, estimatedAnnualOperatingCost: 14000 },
  { projectName: 'Pescadero Marsh Tidal Exchange', projectType: 'Meadow & wetland restoration', classifications: ['Salmon & steelhead recovery', 'Water quality', 'Meadow & marsh rewetting'], tags: ['Climate adaptation'], leadOrganization: 'Coastside Wetlands Group', county: 'San Mateo', stage: 'Deferred', implementationStartYear: 2024, completionYear: 2028, estimatedTotalCost: 2310000, estimatedAnnualOperatingCost: 68000 },
  { projectName: 'Battle Creek Diversion Screening', projectType: 'Fish passage', classifications: ['Salmon & steelhead recovery', 'Barrier removal & fish screens'], tags: ['Private landowners'], leadOrganization: 'North Valley Fisheries Trust', county: 'Shasta', stage: 'Implementation', implementationStartYear: 2022, completionYear: 2026, estimatedTotalCost: 1985000, estimatedAnnualOperatingCost: 89000 },
  { projectName: 'Cache Creek Floodplain Terracing', projectType: 'Aquatic habitat restoration', classifications: ['Riparian & wetland habitat', 'Flood risk reduction', 'Side channels & floodplains'], tags: ['Tribal partnership'], leadOrganization: 'Capay Valley Land Council', county: 'Yolo', stage: 'Proposal', implementationStartYear: 2028, completionYear: 2032, estimatedTotalCost: 1470000, estimatedAnnualOperatingCost: 33000 },
  { projectName: 'Trinity River Side-Channel Construction', projectType: 'Aquatic habitat restoration', classifications: ['Salmon & steelhead recovery', 'Side channels & floodplains'], tags: ['Tribal partnership'], leadOrganization: 'Trinity Restoration Alliance', county: 'Trinity', stage: 'Post-Implementation', implementationStartYear: 2017, completionYear: 2022, estimatedTotalCost: 2740000, estimatedAnnualOperatingCost: 12000 },
  { projectName: 'Arroyo Seco Urban Greenway', projectType: 'Stormwater & water quality', classifications: ['Water quality', 'Public access & recreation', 'Stormwater capture'], tags: ['Education & outreach', 'Volunteer-led'], leadOrganization: 'Central LA Watershed Coalition', county: 'Los Angeles', stage: 'Planning & Design', implementationStartYear: 2026, completionYear: 2030, estimatedTotalCost: 3120000, estimatedAnnualOperatingCost: 115000 },
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

/** Classifications present in the data, alphabetical — a filter never lists an empty bucket. */
export const classifications: ClassificationName[] = Array.from(
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
