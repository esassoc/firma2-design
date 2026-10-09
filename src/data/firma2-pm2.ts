// firma2-pm2 — "PM 2": the performance-measure model as ProjectFirma2 BUILT it,
// ported from projectfirma2 branch `features/0010_project_performance_measures`
// (Team 6's measures build plus story 0010's targets and change log), so it can
// be compared, screen for screen, with this spoke's own measure model in
// firma2-performance-measures.ts. The two prototypes share nothing on purpose:
// neither one's decisions leak into the other while the team chooses.
//
// THE SHAPE, in the branch's own words (tickets/0010, naming-the-measure-parts):
//   Measure   — the thing tracked, ONE unit. Theme groups measures.
//   Category  — a breakdown question with a closed option list. NOT
//               "subcategory": there is no level above it for it to be a sub of.
//               The UI calls it a "breakdown", and its name the "Question".
//   Option    — one choice in one category's list. Owned by that category; no
//               shared vocabulary table (built, then removed — KISS).
//   Entry     — one project's value for one measure in one reporting period,
//               tagged with at most one option per category. Categories are
//               optional at entry: an untagged entry is legitimate.
//   Reporting period — tenant-wide, real dates, always shown by NAME.
//   Target    — per project per measure, for the project's LIFE (never per
//               period). Its existence is what attaches a measure to a project.
//   Change    — an audit row for every target and entry write.
//
// IDS ARE NUMBERS and the field names are the DTOs' (PascalCase dropped to
// camelCase) so a reader can hold this file against the C# side line for line.
// Lookups keep the database's fixed ids.
//
// Mock data is the branch's own demo seed (release 0020), moved onto this
// spoke's invented projects. Deterministic: no Math.random(), no Date.now().

// ── Lookups (global, fixed ids) ─────────────────────────────────────────────

export interface Pm2Status { id: 1 | 2 | 3; name: 'Draft' | 'Published' | 'Retired' }
export const PM2_STATUSES: Pm2Status[] = [
  { id: 1, name: 'Draft' },
  { id: 2, name: 'Published' },
  { id: 3, name: 'Retired' },
];
export const PM2_STATUS_TONE: Record<Pm2Status['name'], 'info' | 'success' | 'default'> = {
  Draft: 'info',
  Published: 'success',
  Retired: 'default',
};

export interface Pm2Theme { id: number; displayName: string }
export const PM2_THEMES: Pm2Theme[] = [
  { id: 1, displayName: 'Riparian habitat' },
  { id: 2, displayName: 'Instream habitat' },
  { id: 3, displayName: 'Fish passage' },
  { id: 4, displayName: 'Fuels reduction' },
  { id: 5, displayName: 'Forest health' },
  { id: 6, displayName: 'Invasive species' },
  { id: 7, displayName: 'Water quality' },
  { id: 8, displayName: 'Water conservation' },
  { id: 9, displayName: 'Land protection' },
  { id: 10, displayName: 'Wetlands and floodplains' },
  { id: 11, displayName: 'Roads and sediment' },
  { id: 12, displayName: 'Upland habitat' },
  { id: 13, displayName: 'Outreach and education' },
  { id: 14, displayName: 'Planning and monitoring' },
  { id: 15, displayName: 'Program capacity' },
];

/** Replaces 1.x's IsSummable + CanBeChartedCumulatively pair. */
export interface Pm2CountingRule { id: 1 | 2; displayName: string; optionLabel: string; description: string }
export const PM2_COUNTING_RULES: Pm2CountingRule[] = [
  {
    id: 1,
    displayName: 'Sums',
    optionLabel: 'Yes — totals and cumulative figures are meaningful',
    description: 'Values add up. Totals and cumulative figures across projects and periods are meaningful — acres treated, barriers removed, hours contributed.',
  },
  {
    id: 2,
    displayName: 'Does not sum',
    optionLabel: 'No — report each value on its own',
    description: 'Values do not add up. Report them individually or as an average, never as a total — a temperature, a percentage, a survival rate. Cumulative figures are not offered.',
  },
];

/** The closed unit list. Ids 1–4 are legacy hydrology units the branch keeps. */
export interface Pm2Unit { id: number; displayName: string; abbreviation: string }
export const PM2_UNITS: Pm2Unit[] = [
  { id: 1, displayName: 'inches', abbreviation: 'in' },
  { id: 2, displayName: 'millimeters', abbreviation: 'mm' },
  { id: 3, displayName: 'acre-feet', abbreviation: 'ac-ft' },
  { id: 4, displayName: 'acre-feet/acre', abbreviation: 'ac-ft/ac' },
  { id: 5, displayName: 'acres', abbreviation: 'ac' },
  { id: 6, displayName: 'square feet', abbreviation: 'sq ft' },
  { id: 7, displayName: 'miles', abbreviation: 'mi' },
  { id: 8, displayName: 'linear feet', abbreviation: 'lin ft' },
  { id: 9, displayName: 'each', abbreviation: 'each' },
  { id: 10, displayName: 'plants', abbreviation: 'plants' },
  { id: 11, displayName: 'people', abbreviation: 'people' },
  { id: 12, displayName: 'events', abbreviation: 'events' },
  { id: 13, displayName: 'pounds', abbreviation: 'lb' },
  { id: 14, displayName: 'tons', abbreviation: 'tons' },
  { id: 15, displayName: 'tons per year', abbreviation: 'tons/yr' },
  { id: 16, displayName: 'hours', abbreviation: 'hr' },
  { id: 17, displayName: 'dollars', abbreviation: 'USD' },
  { id: 18, displayName: 'percent', abbreviation: 'pct' },
  { id: 19, displayName: 'degrees Celsius', abbreviation: 'deg C' },
  { id: 20, displayName: 'cubic feet per second', abbreviation: 'cfs' },
  { id: 21, displayName: 'parts per million', abbreviation: 'ppm' },
  { id: 22, displayName: 'degrees Fahrenheit', abbreviation: 'deg F' },
  { id: 23, displayName: 'cubic yards', abbreviation: 'cu yd' },
];

// ── Tenant records ──────────────────────────────────────────────────────────

export interface Pm2ReportingPeriod { id: number; name: string; startDate: string; endDate: string }

export interface Pm2Option { id: number; name: string; sortOrder: number }
export interface Pm2Category { id: number; name: string; sortOrder: number; options: Pm2Option[] }

export interface Pm2Measure {
  id: number;
  name: string;
  definition: string;
  reporterGuidance: string;
  /** The author's original sentence to their funder. */
  claimText: string;
  themeId: number | null;
  unitId: number | null;
  countingRuleId: 1 | 2 | null;
  statusId: Pm2Status['id'];
  categories: Pm2Category[];
}

export interface Pm2Entry {
  id: number;
  projectSlug: string;
  measureId: number;
  periodId: number;
  value: number;
  /** One per answered category, at most. Empty = untagged, which is allowed. */
  optionIds: number[];
}

export interface Pm2Target { projectSlug: string; measureId: number; value: number }

export interface Pm2Change {
  id: number;
  projectSlug: string;
  measureId: number;
  /** null = a target edit; set = an entry edit. */
  periodId: number | null;
  field: 'TargetValue' | 'EntryValue';
  /** null old = create; null new = delete; both = update. Invariant `0.####`. */
  oldValue: string | null;
  newValue: string | null;
  changedBy: string;
  changedDate: string;
}

export const UNSPECIFIED = 'Unspecified';

/** "Today" for period defaults — fixed, so the build is deterministic. */
export const PM2_TODAY = '2026-10-08';

export const PM2_PERIODS: Pm2ReportingPeriod[] = [2023, 2024, 2025, 2026].map((y, i) => ({
  id: i + 1,
  name: String(y),
  startDate: `${y}-01-01`,
  endDate: `${y}-12-31`,
}));

// ── Seed: release 0020's catalog ────────────────────────────────────────────

const opts = (startId: number, names: string[]): Pm2Option[] =>
  names.map((name, i) => ({ id: startId + i, name, sortOrder: i }));

export const PM2_SEED_MEASURES: Pm2Measure[] = [
  {
    id: 1,
    name: 'Riparian habitat treated',
    definition: 'Acres within the streamside corridor where native vegetation was planted, released, or protected from grazing, and the site has passed its first survival check. Ground treated twice in different years counts in each year.',
    reporterGuidance: 'Report the extent you actually treated this year, not the area of the whole project. If you fenced and planted the same acre, report it once and pick the treatment that took the most effort.',
    claimText: 'I need to tell my funder how much riparian habitat we treat each year, and by what method.',
    themeId: 1,
    unitId: 5,
    countingRuleId: 1,
    statusId: 2,
    categories: [
      { id: 1, name: 'Treatment type', sortOrder: 0, options: opts(1, ['Planting', 'Fencing', 'Invasive removal', UNSPECIFIED]) },
      { id: 2, name: 'Habitat type', sortOrder: 1, options: opts(5, ['In-stream', 'Streambank', 'Upland', UNSPECIFIED]) },
    ],
  },
  {
    id: 2,
    name: 'Stream miles fenced',
    definition: 'Miles of stream bank along which livestock exclusion fencing was completed and closed this year, measured along the bank on one side. A reach fenced on both banks counts once per bank.',
    reporterGuidance: 'Report only fence that is finished and holding stock out. Do not count fence line that is staked or partly strung, and do not count repairs to fence reported in an earlier year.',
    claimText: 'The district wants to know how much stream we have taken out of grazing pressure.',
    themeId: 1,
    unitId: 7,
    countingRuleId: 1,
    statusId: 2,
    categories: [],
  },
  {
    id: 3,
    name: 'Instream structures placed',
    definition: 'Count of engineered log jams, boulder clusters, and other habitat structures installed in the active channel this year and signed off by the project engineer.',
    reporterGuidance: 'Count each structure once, in the year it was placed. A structure rebuilt after a flood is a repair, not a new structure, unless it was fully replaced.',
    claimText: 'Our fisheries partners ask how much complex habitat we have put back in the channel.',
    themeId: 2,
    unitId: 9,
    countingRuleId: 1,
    statusId: 2,
    categories: [],
  },
  {
    id: 4,
    name: 'Late-summer stream temperature',
    definition: 'The seven-day average of daily maximum water temperature at the project reach, taken during the warmest week of the year. Reported per project per year; the readings are not combined.',
    reporterGuidance: "Report the reading from your own logger, in degrees Celsius. If you did not monitor this year, leave it blank rather than repeating last year's figure.",
    claimText: 'The committee wants to know whether the water is getting cooler where we have worked.',
    themeId: 7,
    unitId: 19,
    countingRuleId: 2,
    statusId: 2,
    categories: [],
  },
  {
    id: 5,
    name: 'Volunteer hours contributed',
    definition: '',
    reporterGuidance: '',
    claimText: 'The board keeps asking how much of this work is done by the community.',
    themeId: null,
    unitId: null,
    countingRuleId: null,
    statusId: 1,
    categories: [],
  },
];

// ── Seed: release 0020's project data, on this spoke's projects ─────────────
// Hat Creek → Deer Creek (over-delivered riparian, plus temperature);
// Cottonwood Creek → Navarro River (structures, 28 of 30);
// Dry Fork Ranch → Truckee River (fencing at 48%, riparian target untouched);
// Cow Creek → Bear River (published measures, nothing attached: the empty case).
// Salinas and Klamath add a second reporter each so the catalog's roll-up has
// more than one project behind it. Nothing is reported in 2026, the current period.

export const PM2_DEMO_PROJECTS = [
  'deer-creek-riparian-corridor-enhancement',
  'navarro-river-large-wood-placement',
  'truckee-river-streambank-stabilization',
  'salinas-river-arundo-removal',
  'klamath-tributary-thermal-refugia',
  'bear-river-gravel-augmentation',
];

const [DEER, NAVARRO, TRUCKEE, SALINAS, KLAMATH] = PM2_DEMO_PROJECTS;

// Option ids: 1 Planting, 2 Fencing, 3 Invasive removal, 4 Unspecified;
// 5 In-stream, 6 Streambank, 7 Upland, 8 Unspecified.
const e = (id: number, projectSlug: string, measureId: number, periodId: number, value: number, optionIds: number[] = []): Pm2Entry =>
  ({ id, projectSlug, measureId, periodId, value, optionIds });

export const PM2_SEED_ENTRIES: Pm2Entry[] = [
  e(1, DEER, 1, 1, 32, [1, 6]),
  e(2, DEER, 1, 1, 9.5, [3]),
  e(3, DEER, 1, 2, 41, [1, 6]),
  e(4, DEER, 1, 2, 12, [2, 7]),
  e(5, DEER, 1, 3, 30, [1, 6]),
  e(6, DEER, 4, 1, 19.4),
  e(7, DEER, 4, 2, 18.9),
  e(8, DEER, 4, 3, 18.2),
  e(9, NAVARRO, 3, 1, 8),
  e(10, NAVARRO, 3, 2, 14),
  e(11, NAVARRO, 3, 3, 6),
  e(12, TRUCKEE, 2, 3, 1.2),
  e(13, SALINAS, 1, 1, 6.5, [3]),
  e(14, SALINAS, 1, 2, 8, [3]),
  e(15, SALINAS, 1, 3, 10, [3]),
  e(16, KLAMATH, 4, 1, 21.1),
  e(17, KLAMATH, 4, 2, 20.6),
  e(18, KLAMATH, 4, 3, 20.1),
];

export const PM2_SEED_TARGETS: Pm2Target[] = [
  { projectSlug: DEER, measureId: 1, value: 96 },
  { projectSlug: NAVARRO, measureId: 3, value: 30 },
  { projectSlug: TRUCKEE, measureId: 2, value: 2.5 },
  { projectSlug: TRUCKEE, measureId: 1, value: 40 },
];

/** The seed carries no history; the log starts with the first edit made here. */
export const PM2_SEED_CHANGES: Pm2Change[] = [];

// ── Small lookups ───────────────────────────────────────────────────────────

export const pm2Theme = (id: number | null) => PM2_THEMES.find((t) => t.id === id) ?? null;
export const pm2Unit = (id: number | null) => PM2_UNITS.find((u) => u.id === id) ?? null;
export const pm2Rule = (id: number | null) => PM2_COUNTING_RULES.find((r) => r.id === id) ?? null;
export const pm2Status = (id: number) => PM2_STATUSES.find((s) => s.id === id) ?? PM2_STATUSES[0];
/** Derived, never stored. False when no rule is chosen — the safe direction. */
export const pm2IsSummable = (m: Pm2Measure) => m.countingRuleId === 1;
export const pm2MeasureName = (m: Pm2Measure) => m.name.trim() || 'Untitled measure';

export const PM2_ROUTES = {
  catalog: '/prototypes/workspace-settings/pm2',
  newMeasure: '/prototypes/workspace-settings/pm2/new',
  /** Seeded measures have a built page; one made in this browser opens on new?id=. */
  measure: (id: number) =>
    PM2_SEED_MEASURES.some((m) => m.id === id)
      ? `/prototypes/workspace-settings/pm2/${id}`
      : `/prototypes/workspace-settings/pm2/new?id=${id}`,
  project: (slug: string) => `/prototypes/pm2/projects/${slug}`,
};
