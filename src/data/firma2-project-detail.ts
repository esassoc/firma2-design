// Per-project detail for the ProjectFirma 2.0 project page: description, work
// areas on the map, performance measures, funding sources, and milestones.
//
// INVENTED CONTENT. Every description, grant program, funding agency, measured
// value, milestone and boundary below is fabricated. Nothing is copied,
// derived, or sanitized from a client system, a real grant portfolio, or any
// ProjectFirma tenant — this repo and its deployed site are public. The funding
// agencies in particular are invented names, deliberately not real California
// agencies or real grant programs.
//
// What IS real is the geography: the map centers sit on the actual watersheds
// and counties the projects are named for, because a Deer Creek project pinned
// to the wrong side of the state reads as broken rather than as fiction. The
// work-area BOUNDARIES around those centers are invented.
//
// What is borrowed, as in firma2-projects.ts, is the ProjectFirma VOCABULARY:
// performance measures with an expected and a reported value, funding sources
// contributing shares of a project's estimated total cost, and a project
// timeline of dated milestones.
//
// DETERMINISM. design-principles requires mock data to render identically on
// every run, so there is no Math.random() and no Date.now() here. The values a
// reader scans — descriptions, measure names, expected values, funder shares —
// are hand-authored per project. The values that are pure repetition are
// DERIVED by pure functions from those authored inputs:
//
//   - reported measure values come from the project's authored `progress`
//     fraction and its stage, so a Completed project cannot render a
//     half-finished bar and a Proposal cannot render progress it has not made;
//   - funding AMOUNTS come from authored shares times the project's
//     estimatedTotalCost, with the last funder absorbing the rounding
//     remainder, so the sources always sum to the cost exactly rather than
//     to a number a reader can catch us on;
//   - milestone DATES come from the project's implementation start and
//     completion years against a per-program template, so no project has a
//     construction milestone before its own start year.
//
// Derivation is what keeps 24 records internally consistent. Hand-typing 24
// funding tables that each sum correctly is a bug waiting to ship.

import {
  projects,
  type Project,
  type ProjectStage,
} from './firma2-projects';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A mapped work area. Restoration work is not one shape: a marsh enhancement
 * or a fuel-break unit is a polygon, while a revegetation or gravel
 * augmentation project is a linear treatment along a stream reach. Both render
 * on the same map, styled differently.
 */
export interface WorkArea {
  /** What the shape is on the ground. "Lower reach planting unit", "Tidal basin". */
  label: string;
  kind: 'area' | 'reach';
  /** [lat, lng] vertices. Closed automatically by Leaflet for `area`. */
  path: [number, number][];
  /** Acres for an area, stream miles for a reach — the extent the shape covers. */
  extent: number;
  extentUnit: 'acres' | 'miles';
}

/**
 * One year of a measure's reported value — ProjectFirma reports a measure
 * per REPORTING PERIOD, not as a single running total, and this is that
 * period made real data rather than a display-time guess. Same shape and
 * same reading as an `ExpenditureYear`'s `status`.
 */
export interface MeasureYear {
  year: number;
  /** In the measure's own `unit`. 0 for a year that has not been reported yet. */
  value: number;
  status: 'complete' | 'current' | 'upcoming';
}

/** A ProjectFirma performance measure: what was promised, and what has been reported. */
export interface PerformanceMeasure {
  /** The measure's name. "Acres of riparian habitat restored". */
  name: string;
  /** Unit of the two values. "acres", "miles", "barriers". */
  unit: string;
  /** The target the project committed to. */
  expected: number;
  /** What the project has reported to date — equals the sum of `series`. */
  reported: number;
  /** Reported value by year, oldest first. Real per-year data: `reported`
   *  is derived FROM this, not the other way around. */
  series: MeasureYear[];
}

/** One funder's contribution to a project's estimated total cost. */
export interface FundingSource {
  /** The grant or program the money comes through. */
  name: string;
  /** The body administering it. */
  organization: string;
  /** Whole dollars. Always sums, across a project's sources, to its estimated total cost. */
  amount: number;
  /** Share of the estimated total cost, 0–1. */
  share: number;
}

/**
 * Where one step of a project's life sits relative to today.
 *
 * `halted` is the fourth state and the reason this is a named type rather than
 * an inline union: a deferred project is not "between" two events, it STOPPED at
 * one, and a timeline that renders the stop as `upcoming` says nothing happened
 * yet when what actually happened is that the project quit. That is a different
 * claim, and it needs its own value to be drawn differently.
 */
export type LifecycleStatus = 'complete' | 'current' | 'upcoming' | 'halted';

/** A dated event on the project timeline. */
export interface Milestone {
  /** Rendered label — "March 2024". Stored formatted; see the note on determinism above. */
  date: string;
  /** What happened. A short noun phrase, never a sentence. */
  title: string;
  /** Where the milestone sits relative to today's position in the project's life. */
  status: LifecycleStatus;
}

/**
 * One year of the project's spend against its plan — the accrual half of the
 * funding commitment `FundingSource` records the promise of. `budgeted` is
 * this year's slice of `estimatedTotalCost`; `spent` is what the project has
 * actually drawn down, which is 0 for a year that has not arrived yet and the
 * full `budgeted` figure only once spending has caught up to the plan.
 */
export interface ExpenditureYear {
  year: number;
  /** Whole dollars. Summed across every year, equals `estimatedTotalCost`. */
  budgeted: number;
  /** Whole dollars. Never exceeds the project's cumulative spend to date. */
  spent: number;
  /** Same reading as a Milestone's status — where this year sits relative to
   *  today's position in the project's life. */
  status: 'complete' | 'current' | 'upcoming';
}

/** Everything the detail page renders beyond the row already in `projects`. */
export interface ProjectDetail {
  project: Project;
  /**
   * The project's own description, as its lead organization would have entered
   * it in ProjectFirma — a datum stored on the record, not page copy written
   * about the screen. ProjectFirma's field is ProjectDescription.
   */
  projectDescription: string;
  /** Map view: [lat, lng] and zoom that frame this project's work areas. */
  mapCenter: [number, number];
  mapZoom: number;
  workAreas: WorkArea[];
  measures: PerformanceMeasure[];
  funding: FundingSource[];
  expenditures: ExpenditureYear[];
  milestones: Milestone[];
}

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

// Normalized shapes in degrees, applied as offsets from a project's map center.
// Hand-drawn once and reused, rather than 24 hand-typed rings that would each
// be equally fictional: the honest part of the geography is the CENTER, which
// is authored per project against the real watershed. At the zoom these render
// at, roughly 0.01 degrees is a kilometre.
const AREA_SHAPES: [number, number][][] = [
  // A broad basin, wider than it is tall.
  [[0.016, -0.030], [0.021, 0.004], [0.011, 0.028], [-0.008, 0.031], [-0.019, 0.012], [-0.017, -0.017], [-0.002, -0.032]],
  // A narrow unit following a valley bottom.
  [[0.024, -0.011], [0.019, 0.008], [0.001, 0.016], [-0.016, 0.013], [-0.023, -0.004], [-0.011, -0.017], [0.007, -0.019]],
  // A lobed parcel with a notch — reads as a real boundary rather than a blob.
  [[0.018, -0.021], [0.022, 0.009], [0.006, 0.014], [0.004, 0.027], [-0.013, 0.022], [-0.020, 0.001], [-0.009, -0.024]],
];

const REACH_SHAPES: [number, number][][] = [
  // A meandering reach running roughly north–south.
  [[0.028, -0.014], [0.017, -0.004], [0.008, -0.012], [-0.003, -0.006], [-0.012, 0.007], [-0.024, 0.011]],
  // A reach running east–west with a tight bend.
  [[0.009, -0.031], [0.004, -0.014], [-0.006, -0.006], [-0.004, 0.010], [0.005, 0.021], [0.003, 0.034]],
  // A shallower, straighter reach — a leveed or channelized segment.
  [[-0.021, -0.026], [-0.011, -0.013], [-0.002, -0.002], [0.008, 0.010], [0.019, 0.019], [0.027, 0.030]],
];

/** Translate a normalized shape onto a center, with an optional nudge so a
 *  project's second work area does not sit on top of its first. */
const placeShape = (
  shape: [number, number][],
  center: [number, number],
  nudge: [number, number] = [0, 0],
): [number, number][] =>
  shape.map(([dLat, dLng]) => [
    Number((center[0] + dLat + nudge[0]).toFixed(5)),
    Number((center[1] + dLng + nudge[1]).toFixed(5)),
  ]);

// ---------------------------------------------------------------------------
// Milestone templates
// ---------------------------------------------------------------------------

// Where a milestone falls, as an offset in years. `start` is the project's
// implementationStartYear, `end` its completionYear; the pre- offsets are
// planning and permitting that precede construction, the post- offsets are
// monitoring that follows it. Resolving against the project's OWN years is why
// no project can show a permit issued after its work finished.
type MilestoneAnchor = 'start-2' | 'start-1' | 'start' | 'mid' | 'end' | 'end+1';

interface MilestoneTemplate {
  title: string;
  anchor: MilestoneAnchor;
}

// Restoration programs genuinely share a shape — scope, permit, build, monitor
// — so the templates differ in the WORK each names rather than in structure.
const MILESTONE_TEMPLATES: Record<string, MilestoneTemplate[]> = {
  'Riparian Revegetation': [
    { title: 'Site assessment and planting plan complete', anchor: 'start-2' },
    { title: 'Landowner access agreements signed', anchor: 'start-1' },
    { title: 'First planting season', anchor: 'start' },
    { title: 'Irrigation and browse protection installed', anchor: 'mid' },
    { title: 'Final planting and site closeout', anchor: 'end' },
    { title: 'Year-one survivorship survey', anchor: 'end+1' },
  ],
  'Fish Passage': [
    { title: 'Barrier inventory and passage assessment complete', anchor: 'start-2' },
    { title: 'Streambed simulation design at 90%', anchor: 'start-1' },
    { title: 'Permits issued and contractor mobilized', anchor: 'start' },
    { title: 'In-water work window opens', anchor: 'mid' },
    { title: 'Structure removed and channel reconnected', anchor: 'end' },
    { title: 'Post-project passage monitoring', anchor: 'end+1' },
  ],
  'Meadow & Wetland Restoration': [
    { title: 'Hydrologic and vegetation baseline survey', anchor: 'start-2' },
    { title: 'Grading and hydrology design complete', anchor: 'start-1' },
    { title: 'Earthwork begins', anchor: 'start' },
    { title: 'Channel plugs and grade control placed', anchor: 'mid' },
    { title: 'Revegetation and site closeout', anchor: 'end' },
    { title: 'Groundwater monitoring, year one', anchor: 'end+1' },
  ],
  'Aquatic Habitat Restoration': [
    { title: 'Geomorphic assessment complete', anchor: 'start-2' },
    { title: 'Habitat design and permitting package submitted', anchor: 'start-1' },
    { title: 'Construction access and staging established', anchor: 'start' },
    { title: 'Instream structures placed', anchor: 'mid' },
    { title: 'Channel shaping complete and site revegetated', anchor: 'end' },
    { title: 'Juvenile salmonid response survey', anchor: 'end+1' },
  ],
  'Forest Health & Fuels': [
    { title: 'Stand exams and treatment prescription complete', anchor: 'start-2' },
    { title: 'Environmental review and burn plan approved', anchor: 'start-1' },
    { title: 'Mechanical thinning begins', anchor: 'start' },
    { title: 'Pile burning in first treatment unit', anchor: 'mid' },
    { title: 'Final unit treated', anchor: 'end' },
    { title: 'Post-treatment fuels monitoring', anchor: 'end+1' },
  ],
  'Stormwater & Water Quality': [
    { title: 'Source assessment and load reduction targets set', anchor: 'start-2' },
    { title: 'Treatment design at 90% and permits filed', anchor: 'start-1' },
    { title: 'Construction begins', anchor: 'start' },
    { title: 'Treatment features online', anchor: 'mid' },
    { title: 'Final grading and planting complete', anchor: 'end' },
    { title: 'First full water-year monitoring report', anchor: 'end+1' },
  ],
};

// Fixed months, cycled by milestone position. Real restoration milestones are
// seasonal — permits in winter, in-water work in late summer — and a timeline
// where every event lands in January reads as placeholder data.
const MILESTONE_MONTHS = ['February', 'September', 'May', 'August', 'October', 'June'];

const resolveMilestoneYear = (project: Project, anchor: MilestoneAnchor): number => {
  const { implementationStartYear: start, completionYear: end } = project;
  switch (anchor) {
    case 'start-2': return start - 2;
    case 'start-1': return start - 1;
    case 'start': return start;
    case 'mid': return Math.round((start + end) / 2);
    case 'end': return end;
    case 'end+1': return end + 1;
  }
};

// The prototype's "now". A static build has no live clock, and a timeline that
// re-labels itself as the deploy ages would drift out of agreement with the
// stages in firma2-projects.ts, which are literals. Pinning it makes the whole
// portfolio tell one consistent story.
const PRESENT_YEAR = 2026;

const milestoneStatus = (year: number, stage: ProjectStage): 'complete' | 'current' | 'upcoming' => {
  // A deferred project has stopped where it stopped: nothing after the present
  // is in progress, because nobody is progressing it.
  if (stage === 'Deferred') return year <= PRESENT_YEAR ? 'complete' : 'upcoming';
  if (year < PRESENT_YEAR) return 'complete';
  if (year === PRESENT_YEAR) return 'current';
  return 'upcoming';
};

const buildMilestones = (project: Project): Milestone[] => {
  const template = MILESTONE_TEMPLATES[project.program];
  if (!template) {
    throw new Error(`No milestone template for program "${project.program}"`);
  }

  // A DEFERRED PROJECT'S STATUSES ARE DECIDED HERE, NOT BY milestoneStatus().
  //
  // A halt happens at ONE point on a sequence, and "the first event that has not
  // happened" is positional — milestoneStatus() reads a single year with no idea
  // what came before it, so it cannot express that. Left to it, a deferred
  // project's `year <= PRESENT_YEAR` branch marks the current year's milestone
  // COMPLETE: Pescadero Marsh rendered "Treatment features online, 2026" as done
  // on a project that has not moved. A milestone is an event — it happened or it
  // did not — and a stalled project's next event has not.
  //
  // So: everything genuinely in the past stands, the NEXT event is where the
  // project stopped, and the rest are upcoming. Nothing is ever `current`,
  // because nothing is in progress.
  //
  // This deliberately does NOT change milestoneStatus() itself, which Measures
  // and Expenditures also call. For those two the old reading is the correct
  // one: a deferred project's PRESENT_YEAR is still an ELAPSED year — money
  // could be drawn and values reported right up to the halt — and an accrual
  // asks "could this year have received any?", not "did this event occur?".
  // Same word, two questions, and only the event question has a wrong answer.
  const isDeferred = project.stage === 'Deferred';
  let haltMarked = false;

  return template.map((entry, i) => {
    const year = resolveMilestoneYear(project, entry.anchor);

    let status: LifecycleStatus;
    if (!isDeferred) {
      status = milestoneStatus(year, project.stage);
    } else if (year < PRESENT_YEAR) {
      status = 'complete';
    } else if (!haltMarked) {
      haltMarked = true;
      status = 'halted';
    } else {
      status = 'upcoming';
    }

    return {
      date: `${MILESTONE_MONTHS[i % MILESTONE_MONTHS.length]} ${year}`,
      title: entry.title,
      status,
    };
  });
};

// ---------------------------------------------------------------------------
// Shared accrual curve — used by Measures below AND by Expenditures further
// down, so both series accrue on the same shape rather than two hand-tuned
// curves that happen to agree today and drift the first time one changes.
// ---------------------------------------------------------------------------

// The accrual shape, computed rather than authored: low at mobilization and
// closeout, highest mid-project, for every project regardless of length.
// sin() is positive across the whole (0, π) span for any window, so an
// n-year project always gets n positive weights with no per-length table to
// hand-type and no risk of a zero or negative share. Reads equally well as
// "how a project spends money" and "how a project delivers physical work" —
// both ramp up once mobilized and taper as the work closes out.
const accrualWeights = (yearCount: number): number[] => {
  const raw = Array.from({ length: yearCount }, (_, i) =>
    Math.sin((Math.PI * (i + 0.5)) / yearCount),
  );
  const total = raw.reduce((sum, w) => sum + w, 0);
  return raw.map((w) => w / total);
};

/**
 * Spread `total` across the years that have actually happened — a year whose
 * `status` is 'upcoming' gets none of it — proportional to each elapsed
 * year's own accrual weight, so a total running ahead of or behind an even
 * pace still tracks the plan's shape rather than a flat average. The last
 * elapsed year absorbs the rounding remainder, via the caller's own `round`,
 * so the spread always sums to `total` exactly. `weights` and `statuses` are
 * parallel arrays, one entry per year.
 */
const spreadAcrossElapsedYears = (
  total: number,
  weights: number[],
  statuses: ('complete' | 'current' | 'upcoming')[],
  round: (n: number) => number,
): number[] => {
  const values = weights.map(() => 0);
  const elapsedIndices = weights.map((_, i) => i).filter((i) => statuses[i] !== 'upcoming');
  if (elapsedIndices.length === 0 || total <= 0) return values;
  const elapsedWeightSum = elapsedIndices.reduce((sum, i) => sum + weights[i], 0);
  let allocated = 0;
  elapsedIndices.forEach((i, position) => {
    const last = position === elapsedIndices.length - 1;
    const amount = last ? total - allocated : round((total * weights[i]) / elapsedWeightSum);
    allocated += amount;
    values[i] = amount;
  });
  return values;
};

// ---------------------------------------------------------------------------
// Measures
// ---------------------------------------------------------------------------

// How much of its expected value a project has reported, by stage. A project
// that has not broken ground has reported nothing; the authored `progress`
// fraction only applies where work is actually underway.
const stageCompletion = (stage: ProjectStage, progress: number): number => {
  switch (stage) {
    case 'Proposal':
    case 'Planning & Design':
      return 0;
    case 'Implementation':
      return progress;
    case 'Deferred':
      return progress;
    case 'Post-Implementation':
    case 'Completed':
      return 1;
  }
};

// Measures within one project do not move in lockstep — acres treated can run
// ahead of structures installed. A fixed factor per measure position keeps that
// texture without randomness.
const MEASURE_SKEW = [1, 0.9, 1.06, 0.82];

// Units a partial value can legitimately carry a decimal in. Everything else a
// project measures is a COUNT — trees, structures, crossings, volunteer hours,
// residents — and "10,727.2 native trees planted" is exactly the detail that
// tells a reader the data is fabricated. Keyed off the unit rather than the
// magnitude because the two do not correlate: 4.1 miles wants a decimal and 4
// crossings does not, at the same size.
const CONTINUOUS_UNITS = new Set(['acres', 'miles', 'acre-feet', 'cfs']);

const buildMeasures = (
  project: Project,
  authored: [name: string, unit: string, expected: number][],
  progress: number,
): PerformanceMeasure[] => {
  const base = stageCompletion(project.stage, progress);
  const { implementationStartYear: start, completionYear: end, stage } = project;
  const years: number[] = [];
  for (let year = start; year <= end; year += 1) years.push(year);
  const weights = accrualWeights(years.length);
  const statuses = years.map((year) => milestoneStatus(year, stage));

  return authored.map(([name, unit, expected], i) => {
    const fraction = Math.min(1, base * MEASURE_SKEW[i % MEASURE_SKEW.length]);
    const raw = expected * fraction;
    // A decimal on a continuous unit, but only while the number is small enough
    // for the tenth to mean anything — "3,100 acre-feet" does not want ".4".
    const decimal = CONTINUOUS_UNITS.has(unit) && expected < 1000;
    const round = (n: number) => (decimal ? Number(n.toFixed(1)) : Math.round(n));
    const reported = round(raw);

    // REPORTED BY YEAR — the reporting period ProjectFirma actually stores,
    // not a single running total re-guessed at render time. Spread across
    // the years work could have reached, on the same accrual curve
    // buildExpenditures uses, so a measure's per-year shape agrees with the
    // project's own spend curve rather than telling a separate story.
    const spread = spreadAcrossElapsedYears(reported, weights, statuses, round);
    const series: MeasureYear[] = years.map((year, yi) => ({
      year,
      value: spread[yi],
      status: statuses[yi],
    }));

    return {
      name,
      unit,
      expected,
      reported,
      series,
    };
  });
};

// ---------------------------------------------------------------------------
// Funding
// ---------------------------------------------------------------------------

// Invented grant programs and administering bodies. Named to read like
// California restoration funding without being any real program or agency.
// `LOCAL_MATCH` resolves its organization to the project's own lead org, which
// is how a local sponsor match actually appears on a funding table.
const LOCAL_MATCH = '__local__';

const FUNDERS: Record<string, string> = {
  'Watershed Resilience Grant Program': 'California Watershed Restoration Board',
  'Anadromous Fisheries Recovery Fund': 'Pacific Fisheries Trust',
  'Wildfire Resilience Block Grant': 'California Forest Health Authority',
  'Coastal Wetlands Conservation Fund': 'Pacific Coast Wetlands Board',
  'Regional Water Quality Improvement Fund': 'Central Valley Water Alliance',
  'Sierra Meadows Restoration Initiative': 'Sierra Headwaters Conservancy',
  'Federal Habitat Partnership Program': 'National Watershed Partnership',
  'Delta Ecosystem Restoration Fund': 'Delta Conservancy Board',
  'Urban Greening Program': 'Southern California Rivers Authority',
  'Local Sponsor Match': LOCAL_MATCH,
};

const buildFunding = (
  project: Project,
  authored: [name: string, share: number][],
): FundingSource[] => {
  const total = project.estimatedTotalCost;
  let allocated = 0;
  return authored.map(([name, share], i) => {
    const organization = FUNDERS[name];
    if (organization === undefined) {
      throw new Error(`Unknown funder "${name}" on "${project.projectName}"`);
    }
    // Every source but the last rounds to the nearest $500; the last takes the
    // remainder, so the column sums to estimatedTotalCost to the dollar.
    const last = i === authored.length - 1;
    const amount = last
      ? total - allocated
      : Math.round((total * share) / 500) * 500;
    allocated += amount;
    return {
      name,
      organization: organization === LOCAL_MATCH ? project.leadOrganization : organization,
      amount,
      share: amount / total,
    };
  });
};

// ---------------------------------------------------------------------------
// Expenditures
// ---------------------------------------------------------------------------

const buildExpenditures = (project: Project, progress: number): ExpenditureYear[] => {
  const { implementationStartYear: start, completionYear: end, estimatedTotalCost: total, stage } = project;
  const years: number[] = [];
  for (let year = start; year <= end; year += 1) years.push(year);

  const weights = accrualWeights(years.length);
  const statuses = years.map((year) => milestoneStatus(year, stage));

  // BUDGETED — the plan. Every year but the last rounds to the nearest $500;
  // the last absorbs the remainder, so the column sums to estimatedTotalCost
  // to the dollar. Same rounding buildFunding uses, for the same reason: the
  // two totals — what was promised in funding, what is planned to be spent —
  // have to agree exactly, not to the nearest rounding error.
  const budgeted: number[] = [];
  {
    let allocated = 0;
    weights.forEach((weight, i) => {
      const last = i === weights.length - 1;
      const amount = last ? total - allocated : Math.round((total * weight) / 500) * 500;
      allocated += amount;
      budgeted.push(amount);
    });
  }

  // SPENT — the accrual. Total spent to date is the SAME completion fraction
  // the measures section reports against (stageCompletion, above): a project
  // that has delivered 55% of its measures has spent 55% of its budget, not a
  // second figure that could disagree with the one already on screen.
  //
  // Spread across the years that have actually happened, on the same shared
  // curve buildMeasures uses for its own per-year series — see
  // spreadAcrossElapsedYears above. $500 steps, matching buildFunding's and
  // this function's own BUDGETED rounding.
  const totalSpent = Math.round(total * stageCompletion(stage, progress));
  const spent = spreadAcrossElapsedYears(totalSpent, weights, statuses, (n) => Math.round(n / 500) * 500);

  return years.map((year, i) => ({
    year,
    budgeted: budgeted[i],
    spent: spent[i],
    status: statuses[i],
  }));
};

// ---------------------------------------------------------------------------
// Authored per-project detail
// ---------------------------------------------------------------------------

interface AuthoredDetail {
  /** The stored project description. Two sentences: what the work is, and why. */
  description: string;
  /** [lat, lng] on the real watershed the project is named for. */
  center: [number, number];
  zoom?: number;
  /** Work areas: label, kind, which shape template, extent, and an optional nudge. */
  areas: {
    label: string;
    kind: 'area' | 'reach';
    shape: 0 | 1 | 2;
    extent: number;
    nudge?: [number, number];
  }[];
  /** [measure name, unit, expected value]. */
  measures: [string, string, number][];
  /** [funder name, share of estimated total cost]. Shares should sum to ~1. */
  funders: [string, number][];
  /** How far along the work is, 0–1. Only read for Implementation and Deferred. */
  progress: number;
}

const AUTHORED: Record<string, AuthoredDetail> = {
  'Deer Creek Riparian Corridor Enhancement': {
    description:
      'Replanting native cottonwood, willow and valley oak along six miles of the lower Deer Creek corridor, on parcels where grazing has kept the streambank bare for decades. The shaded corridor is intended to lower summer water temperatures for the creek’s spring-run Chinook.',
    center: [40.0231, -122.0654],
    zoom: 12,
    areas: [
      { label: 'Lower corridor planting reach', kind: 'reach', shape: 0, extent: 4.1 },
      { label: 'Upland buffer unit', kind: 'area', shape: 1, extent: 62, nudge: [0.014, 0.022] },
    ],
    measures: [
      ['Acres of riparian habitat restored', 'acres', 62],
      ['Stream miles revegetated', 'miles', 4.1],
      ['Native trees and shrubs planted', 'plants', 18400],
    ],
    funders: [
      ['Watershed Resilience Grant Program', 0.62],
      ['Local Sponsor Match', 0.38],
    ],
    progress: 0.55,
  },

  'Scott River Fish Passage Barrier Removal': {
    description:
      'Removing a failing irrigation diversion and two undersized crossings that block coho access to eleven miles of Scott River tributary habitat. A roughened channel will replace the diversion while preserving the water right it serves.',
    center: [41.5194, -122.9061],
    zoom: 12,
    areas: [
      { label: 'Diversion removal site', kind: 'area', shape: 2, extent: 9 },
      { label: 'Reconnected tributary reach', kind: 'reach', shape: 1, extent: 11.3, nudge: [-0.018, 0.016] },
    ],
    measures: [
      ['Fish passage barriers removed', 'barriers', 3],
      ['Stream miles reopened to anadromy', 'miles', 11.3],
      ['Acres of channel habitat restored', 'acres', 14],
    ],
    funders: [
      ['Anadromous Fisheries Recovery Fund', 0.48],
      ['Federal Habitat Partnership Program', 0.37],
      ['Local Sponsor Match', 0.15],
    ],
    progress: 0,
  },

  'Suisun Slough Tidal Marsh Enhancement': {
    description:
      'Breaching an exterior levee to return tidal exchange to 240 acres of subsided managed wetland at the edge of Suisun Slough. Sediment placement raises the interior to marsh-plain elevation before the breach so vegetation establishes rather than the basin converting to open water.',
    center: [38.1547, -122.0402],
    zoom: 12,
    areas: [
      { label: 'Tidal restoration basin', kind: 'area', shape: 0, extent: 240 },
      { label: 'Levee breach and transition zone', kind: 'area', shape: 1, extent: 31, nudge: [-0.021, -0.014] },
    ],
    measures: [
      ['Acres of tidal marsh restored', 'acres', 240],
      ['Acres of upland transition zone graded', 'acres', 31],
      ['Cubic yards of sediment placed', 'cubic yards', 410000],
    ],
    funders: [
      ['Coastal Wetlands Conservation Fund', 0.44],
      ['Delta Ecosystem Restoration Fund', 0.4],
      ['Local Sponsor Match', 0.16],
    ],
    progress: 0.72,
  },

  'Red Clover Valley Meadow Reconnection': {
    description:
      'Filling two miles of incised gully to reconnect Red Clover Creek with its meadow floodplain, raising the water table across 380 acres of degraded wet meadow. The rewetted meadow holds snowmelt into late summer and releases it to the Feather River below.',
    center: [39.9548, -120.5342],
    zoom: 12,
    areas: [
      { label: 'Meadow restoration unit', kind: 'area', shape: 0, extent: 380 },
      { label: 'Filled gully alignment', kind: 'reach', shape: 2, extent: 2.2, nudge: [0.008, 0.004] },
    ],
    measures: [
      ['Acres of montane meadow restored', 'acres', 380],
      ['Stream miles reconnected to floodplain', 'miles', 2.2],
      ['Acre-feet of additional summer storage', 'acre-feet', 640],
    ],
    funders: [
      ['Sierra Meadows Restoration Initiative', 0.7],
      ['Local Sponsor Match', 0.3],
    ],
    progress: 1,
  },

  'Cosumnes Floodplain Reconnection': {
    description:
      'Setting back three miles of agricultural levee on the lower Cosumnes to reopen 1,100 acres of seasonal floodplain, the rearing habitat that juvenile Chinook lose on a leveed river. Landowners retain farming on the terrace behind the new alignment.',
    center: [38.2731, -121.4407],
    zoom: 12,
    areas: [
      { label: 'Reconnected floodplain', kind: 'area', shape: 0, extent: 1100 },
      { label: 'Setback levee alignment', kind: 'reach', shape: 2, extent: 3.4, nudge: [0.012, -0.008] },
    ],
    measures: [
      ['Acres of seasonal floodplain reconnected', 'acres', 1100],
      ['Miles of levee set back', 'miles', 3.4],
      ['Acres of riparian forest planted', 'acres', 145],
    ],
    funders: [
      ['Delta Ecosystem Restoration Fund', 0.5],
      ['Federal Habitat Partnership Program', 0.33],
      ['Local Sponsor Match', 0.17],
    ],
    progress: 0,
  },

  'Bear River Gravel Augmentation': {
    description:
      'Placing spawning-sized gravel into two miles of Bear River downstream of a dam that has cut off the river’s natural sediment supply. Placement is staged across three high-flow seasons so the river distributes the material rather than the project shaping it.',
    center: [39.1204, -121.2078],
    zoom: 13,
    areas: [
      { label: 'Gravel injection reach', kind: 'reach', shape: 0, extent: 2.1 },
    ],
    measures: [
      ['Stream miles of spawning habitat improved', 'miles', 2.1],
      ['Tons of spawning gravel placed', 'tons', 9500],
      ['Redd count, post-placement survey', 'redds', 120],
    ],
    funders: [
      ['Anadromous Fisheries Recovery Fund', 0.65],
      ['Local Sponsor Match', 0.35],
    ],
    progress: 0.68,
  },

  'Yuba Headwaters Fuels Reduction': {
    description:
      'Thinning and prescribed burning across 4,200 acres of overstocked mixed-conifer forest in the North Yuba headwaters, above two communities and the reservoir that supplies them. Treatment is sequenced to build a connected fuel break rather than isolated units.',
    center: [39.5748, -120.7161],
    zoom: 11,
    areas: [
      { label: 'Treatment unit — north ridge', kind: 'area', shape: 0, extent: 2400 },
      { label: 'Treatment unit — reservoir slope', kind: 'area', shape: 2, extent: 1800, nudge: [-0.026, 0.024] },
    ],
    measures: [
      ['Acres mechanically thinned', 'acres', 2900],
      ['Acres treated with prescribed fire', 'acres', 1300],
      ['Miles of shaded fuel break completed', 'miles', 17],
    ],
    funders: [
      ['Wildfire Resilience Block Grant', 0.58],
      ['Federal Habitat Partnership Program', 0.29],
      ['Local Sponsor Match', 0.13],
    ],
    progress: 0.46,
  },

  'Butte Creek Canyon Fuel Break': {
    description:
      'A nine-mile shaded fuel break along the Butte Creek canyon rim, tied into existing roads so it can be held during an incident. Post-treatment maintenance is contracted through the local fire safe council rather than left to the grant to renew.',
    center: [39.7692, -121.7093],
    zoom: 12,
    areas: [
      { label: 'Fuel break alignment', kind: 'reach', shape: 2, extent: 9.2 },
      { label: 'Canyon rim treatment unit', kind: 'area', shape: 1, extent: 640, nudge: [0.016, 0.018] },
    ],
    measures: [
      ['Miles of shaded fuel break completed', 'miles', 9.2],
      ['Acres treated', 'acres', 640],
      ['Structures within the protected footprint', 'structures', 310],
    ],
    funders: [
      ['Wildfire Resilience Block Grant', 0.72],
      ['Local Sponsor Match', 0.28],
    ],
    progress: 1,
  },

  'Navarro River Large Wood Placement': {
    description:
      'Anchoring 140 engineered log structures across five miles of the Navarro mainstem and its tributaries, rebuilding the pool habitat lost to a century of stream cleaning. Wood was sourced from the adjacent conservation forest rather than trucked in.',
    center: [39.1571, -123.5386],
    zoom: 12,
    areas: [
      { label: 'Mainstem wood placement reach', kind: 'reach', shape: 1, extent: 3.4 },
      { label: 'Tributary placement reach', kind: 'reach', shape: 0, extent: 1.9, nudge: [0.019, 0.012] },
    ],
    measures: [
      ['Stream miles treated with large wood', 'miles', 5.3],
      ['Log structures installed', 'structures', 140],
      ['Pools created or deepened', 'pools', 88],
    ],
    funders: [
      ['Anadromous Fisheries Recovery Fund', 0.6],
      ['Watershed Resilience Grant Program', 0.25],
      ['Local Sponsor Match', 0.15],
    ],
    progress: 1,
  },

  'Salinas River Arundo Removal': {
    description:
      'Removing giant reed from 1,050 acres of the Salinas River channel and replanting with native willow and mulefat, working from the top of the watershed down so treated reaches are not reinfested from upstream. Follow-up treatment runs three years past initial removal.',
    center: [35.9412, -120.9721],
    zoom: 11,
    areas: [
      { label: 'Upper reach treatment corridor', kind: 'reach', shape: 2, extent: 12.5 },
      { label: 'Confluence revegetation unit', kind: 'area', shape: 0, extent: 210, nudge: [-0.022, 0.019] },
    ],
    measures: [
      ['Acres of arundo removed', 'acres', 1050],
      ['Stream miles treated', 'miles', 12.5],
      ['Acres revegetated with natives', 'acres', 210],
      ['Acre-feet of water use avoided annually', 'acre-feet', 3100],
    ],
    funders: [
      ['Regional Water Quality Improvement Fund', 0.55],
      ['Watershed Resilience Grant Program', 0.3],
      ['Local Sponsor Match', 0.15],
    ],
    progress: 0.61,
  },

  'Alameda Creek Culvert Retrofit': {
    description:
      'Replacing four undersized road crossings in the upper Alameda Creek watershed with bridges and open-bottom arches sized to pass a hundred-year flow. The retrofits reopen seven miles of habitat above the flood-control channel now being reconnected downstream.',
    center: [37.5842, -121.8368],
    zoom: 12,
    areas: [
      { label: 'Crossing retrofit corridor', kind: 'reach', shape: 0, extent: 7.2 },
    ],
    measures: [
      ['Crossings replaced', 'crossings', 4],
      ['Stream miles reopened', 'miles', 7.2],
      ['Fish passage barriers removed', 'barriers', 4],
    ],
    funders: [
      ['Anadromous Fisheries Recovery Fund', 0.41],
      ['Federal Habitat Partnership Program', 0.38],
      ['Local Sponsor Match', 0.21],
    ],
    progress: 0,
  },

  'Truckee River Streambank Stabilization': {
    description:
      'Rebuilding 1.6 miles of eroding Truckee River bank with bioengineered treatments in place of the riprap that failed here twice. The work cuts the fine-sediment load reaching Lake Tahoe’s outlet reach and restores the willow fringe along the bank.',
    center: [39.3277, -120.1834],
    zoom: 13,
    areas: [
      { label: 'Bank stabilization reach', kind: 'reach', shape: 1, extent: 1.6 },
    ],
    measures: [
      ['Stream miles of bank stabilized', 'miles', 1.6],
      ['Tons of fine sediment avoided annually', 'tons', 480],
      ['Acres of riparian vegetation established', 'acres', 18],
    ],
    funders: [
      ['Regional Water Quality Improvement Fund', 0.66],
      ['Local Sponsor Match', 0.34],
    ],
    progress: 0.58,
  },

  'Elk River Sediment Reduction': {
    description:
      'Decommissioning 22 miles of legacy logging road and upgrading stream crossings in the Elk River watershed, where road-derived sediment has aggraded the lower river and flooded downstream residents. Work is currently deferred pending a landowner access agreement.',
    center: [40.7089, -124.0271],
    zoom: 12,
    areas: [
      { label: 'Road decommissioning unit', kind: 'area', shape: 1, extent: 2100 },
      { label: 'Crossing upgrade corridor', kind: 'reach', shape: 2, extent: 6.4, nudge: [0.017, -0.019] },
    ],
    measures: [
      ['Miles of road decommissioned', 'miles', 22],
      ['Stream crossings upgraded', 'crossings', 19],
      ['Cubic yards of sediment delivery avoided', 'cubic yards', 74000],
    ],
    funders: [
      ['Regional Water Quality Improvement Fund', 0.47],
      ['Watershed Resilience Grant Program', 0.36],
      ['Local Sponsor Match', 0.17],
    ],
    progress: 0.18,
  },

  'Carmel Valley Steelhead Habitat': {
    description:
      'Rebuilding pool and spawning habitat across four miles of the Carmel River in the reach exposed by a dam removal upstream. Structures were placed after two winters of channel adjustment rather than immediately, so the design responded to where the river actually settled.',
    center: [36.4841, -121.7328],
    zoom: 12,
    areas: [
      { label: 'Post-dam adjustment reach', kind: 'reach', shape: 0, extent: 4.0 },
      { label: 'Floodplain planting unit', kind: 'area', shape: 2, extent: 44, nudge: [-0.015, 0.017] },
    ],
    measures: [
      ['Stream miles of habitat restored', 'miles', 4.0],
      ['Pools created or deepened', 'pools', 52],
      ['Acres of riparian floodplain planted', 'acres', 44],
    ],
    funders: [
      ['Anadromous Fisheries Recovery Fund', 0.57],
      ['Watershed Resilience Grant Program', 0.28],
      ['Local Sponsor Match', 0.15],
    ],
    progress: 1,
  },

  'Owens Valley Spring Channel Restoration': {
    description:
      'Restoring flow and native vegetation to five spring-fed channels on the Owens Valley floor that were straightened for irrigation delivery. Design balances the restored channels against the delivery obligations the ditches still carry.',
    center: [36.9612, -118.2094],
    zoom: 12,
    areas: [
      { label: 'Spring channel complex', kind: 'reach', shape: 1, extent: 5.8 },
      { label: 'Wet meadow unit', kind: 'area', shape: 0, extent: 190, nudge: [0.013, 0.021] },
    ],
    measures: [
      ['Stream miles of spring channel restored', 'miles', 5.8],
      ['Acres of wet meadow rewetted', 'acres', 190],
      ['Acres of saltcedar removed', 'acres', 76],
    ],
    funders: [
      ['Watershed Resilience Grant Program', 0.54],
      ['Sierra Meadows Restoration Initiative', 0.31],
      ['Local Sponsor Match', 0.15],
    ],
    progress: 0,
  },

  'Putah Creek Riparian Planting': {
    description:
      'Planting 14 acres of valley oak and sycamore riparian forest on three parcels along lower Putah Creek, filling the gaps between reaches restored under earlier phases. Volunteer crews from the adjacent university handled planting and three years of follow-up watering.',
    center: [38.5127, -121.8341],
    zoom: 13,
    areas: [
      { label: 'Planting parcels', kind: 'area', shape: 2, extent: 14 },
    ],
    measures: [
      ['Acres of riparian forest planted', 'acres', 14],
      ['Native trees planted', 'trees', 2600],
      ['Volunteer hours contributed', 'hours', 1900],
    ],
    funders: [
      ['Watershed Resilience Grant Program', 0.6],
      ['Local Sponsor Match', 0.4],
    ],
    progress: 1,
  },

  'San Luis Rey Arroyo Toad Habitat': {
    description:
      'Clearing invasive tamarisk and restoring the braided sandy channel the arroyo toad breeds in across three miles of the upper San Luis Rey. Timing avoids the breeding season, which constrains work to a narrow late-summer window each year.',
    center: [33.3421, -116.9134],
    zoom: 12,
    areas: [
      { label: 'Braided channel treatment reach', kind: 'reach', shape: 2, extent: 3.1 },
      { label: 'Terrace tamarisk removal unit', kind: 'area', shape: 1, extent: 88, nudge: [0.014, -0.017] },
    ],
    measures: [
      ['Stream miles of breeding habitat restored', 'miles', 3.1],
      ['Acres of tamarisk removed', 'acres', 88],
      ['Breeding pools documented, post-project', 'pools', 24],
    ],
    funders: [
      ['Watershed Resilience Grant Program', 0.52],
      ['Federal Habitat Partnership Program', 0.33],
      ['Local Sponsor Match', 0.15],
    ],
    progress: 0,
  },

  'Klamath Tributary Thermal Refugia': {
    description:
      'Protecting and enlarging cold-water refugia at eight tributary confluences on the middle Klamath, where mainstem temperatures now exceed what salmon can hold in through late summer. Each site combines shade planting with channel work that keeps the cold plume intact.',
    center: [41.7913, -123.0442],
    zoom: 11,
    areas: [
      { label: 'Confluence refugia complex', kind: 'area', shape: 0, extent: 130 },
      { label: 'Tributary shading reach', kind: 'reach', shape: 1, extent: 8.6, nudge: [-0.024, 0.021] },
    ],
    measures: [
      ['Cold-water refugia sites enhanced', 'sites', 8],
      ['Stream miles shaded', 'miles', 8.6],
      ['Acres of riparian canopy established', 'acres', 130],
    ],
    funders: [
      ['Anadromous Fisheries Recovery Fund', 0.45],
      ['Federal Habitat Partnership Program', 0.38],
      ['Local Sponsor Match', 0.17],
    ],
    progress: 0.51,
  },

  'Mokelumne Meadow Rewetting': {
    description:
      'Plug-and-pond treatment across 210 acres of incised meadow in the upper Mokelumne, raising the water table to within a foot of the surface through the growing season. The site sits above a reservoir that supplies two foothill districts.',
    center: [38.5124, -120.0187],
    zoom: 12,
    areas: [
      { label: 'Meadow rewetting unit', kind: 'area', shape: 1, extent: 210 },
    ],
    measures: [
      ['Acres of montane meadow rewetted', 'acres', 210],
      ['Stream miles reconnected to floodplain', 'miles', 1.7],
      ['Acre-feet of additional summer storage', 'acre-feet', 340],
    ],
    funders: [
      ['Sierra Meadows Restoration Initiative', 0.64],
      ['Local Sponsor Match', 0.36],
    ],
    progress: 0,
  },

  'Pescadero Marsh Tidal Exchange': {
    description:
      'Restoring tidal exchange to Pescadero Marsh by replacing an undersized culvert under the coast highway and regrading the interior channel network, addressing the low-oxygen events that have repeatedly killed steelhead here. Deferred while the highway crossing is redesigned.',
    center: [37.2612, -122.4074],
    zoom: 13,
    areas: [
      { label: 'Marsh channel network', kind: 'area', shape: 0, extent: 265 },
      { label: 'Highway crossing replacement', kind: 'reach', shape: 2, extent: 0.4, nudge: [-0.012, -0.011] },
    ],
    measures: [
      ['Acres of tidal marsh reconnected', 'acres', 265],
      ['Miles of tidal channel regraded', 'miles', 3.2],
      ['Crossings replaced', 'crossings', 1],
    ],
    funders: [
      ['Coastal Wetlands Conservation Fund', 0.49],
      ['Regional Water Quality Improvement Fund', 0.34],
      ['Local Sponsor Match', 0.17],
    ],
    progress: 0.22,
  },

  'Battle Creek Diversion Screening': {
    description:
      'Screening eleven unscreened agricultural diversions on Battle Creek and its north fork to end juvenile salmonid entrainment, paired with measurement devices at each headgate. Screens are sized to the diverter’s existing right so no water delivery changes.',
    center: [40.4127, -122.1483],
    zoom: 12,
    areas: [
      { label: 'Diversion screening corridor', kind: 'reach', shape: 0, extent: 14.8 },
    ],
    measures: [
      ['Diversions screened', 'diversions', 11],
      ['Stream miles with entrainment eliminated', 'miles', 14.8],
      ['Cubic feet per second screened', 'cfs', 96],
    ],
    funders: [
      ['Anadromous Fisheries Recovery Fund', 0.53],
      ['Federal Habitat Partnership Program', 0.31],
      ['Local Sponsor Match', 0.16],
    ],
    progress: 0.79,
  },

  'Cache Creek Floodplain Terracing': {
    description:
      'Grading inset floodplain terraces into 2.5 miles of over-widened Cache Creek channel left by a century of aggregate mining. The terraces are designed to inundate in a two-year flow, rebuilding riparian forest that the current channel is too incised to support.',
    center: [38.7204, -122.1128],
    zoom: 12,
    areas: [
      { label: 'Terrace grading reach', kind: 'reach', shape: 1, extent: 2.5 },
      { label: 'Riparian planting unit', kind: 'area', shape: 2, extent: 96, nudge: [0.016, 0.014] },
    ],
    measures: [
      ['Acres of inset floodplain created', 'acres', 96],
      ['Stream miles regraded', 'miles', 2.5],
      ['Acres of riparian forest planted', 'acres', 62],
    ],
    funders: [
      ['Watershed Resilience Grant Program', 0.58],
      ['Delta Ecosystem Restoration Fund', 0.26],
      ['Local Sponsor Match', 0.16],
    ],
    progress: 0,
  },

  'Trinity River Side-Channel Construction': {
    description:
      'Excavating six perennial side channels totalling 3.8 miles along the Trinity between Lewiston and Douglas City, the rearing habitat a regulated flow regime no longer builds on its own. Each channel is fed at a stage that keeps it wetted through the summer base flow.',
    center: [40.6748, -122.9331],
    zoom: 12,
    areas: [
      { label: 'Side-channel complex', kind: 'reach', shape: 2, extent: 3.8 },
      { label: 'Floodplain lowering unit', kind: 'area', shape: 0, extent: 118, nudge: [-0.019, 0.018] },
    ],
    measures: [
      ['Stream miles of side channel constructed', 'miles', 3.8],
      ['Acres of rearing habitat created', 'acres', 118],
      ['Cubic yards excavated', 'cubic yards', 265000],
    ],
    funders: [
      ['Anadromous Fisheries Recovery Fund', 0.42],
      ['Federal Habitat Partnership Program', 0.42],
      ['Local Sponsor Match', 0.16],
    ],
    progress: 1,
  },

  'Arroyo Seco Urban Greenway': {
    description:
      'Converting 2.8 miles of concrete-lined Arroyo Seco channel margin into a vegetated greenway with infiltration basins that capture street runoff before it reaches the river. Flood capacity in the channel is preserved; the treatment sits entirely on the terrace above it.',
    center: [34.1121, -118.1874],
    zoom: 13,
    areas: [
      { label: 'Greenway corridor', kind: 'reach', shape: 0, extent: 2.8 },
      { label: 'Infiltration basin cluster', kind: 'area', shape: 1, extent: 22, nudge: [-0.013, 0.012] },
    ],
    measures: [
      ['Miles of urban greenway created', 'miles', 2.8],
      ['Acre-feet of stormwater captured annually', 'acre-feet', 185],
      ['Acres of native habitat established', 'acres', 22],
      ['Residents within a half-mile walk', 'residents', 41000],
    ],
    funders: [
      ['Urban Greening Program', 0.51],
      ['Regional Water Quality Improvement Fund', 0.33],
      ['Local Sponsor Match', 0.16],
    ],
    progress: 0,
  },
};

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

const buildDetail = (project: Project): ProjectDetail => {
  const authored = AUTHORED[project.projectName];
  if (!authored) {
    throw new Error(`No authored detail for "${project.projectName}"`);
  }
  return {
    project,
    projectDescription: authored.description,
    mapCenter: authored.center,
    mapZoom: authored.zoom ?? 12,
    workAreas: authored.areas.map((area) => ({
      label: area.label,
      kind: area.kind,
      extent: area.extent,
      extentUnit: area.kind === 'area' ? 'acres' : 'miles',
      path: placeShape(
        (area.kind === 'area' ? AREA_SHAPES : REACH_SHAPES)[area.shape],
        authored.center,
        area.nudge,
      ),
    })),
    measures: buildMeasures(project, authored.measures, authored.progress),
    funding: buildFunding(project, authored.funders),
    expenditures: buildExpenditures(project, authored.progress),
    milestones: buildMilestones(project),
  };
};

/**
 * Every project's detail, keyed by project name.
 *
 * Built eagerly rather than on demand so a project added to firma2-projects.ts
 * without a matching AUTHORED entry fails the BUILD, not the request for its
 * detail page. The alternative — a page that renders with empty sections — is
 * the failure mode that ships.
 */
export const projectDetails: Map<string, ProjectDetail> = new Map(
  projects.map((project) => [project.projectName, buildDetail(project)]),
);

/** Detail for one project. Throws rather than returning undefined: every
 *  project in the portfolio has detail, by the invariant above. */
export const getProjectDetail = (project: Project): ProjectDetail => {
  const detail = projectDetails.get(project.projectName);
  if (!detail) {
    throw new Error(`No detail for "${project.projectName}"`);
  }
  return detail;
};

// An AUTHORED key that matches no project is a typo that silently does nothing
// — the detail it holds is never rendered and never missed. Catch it here.
{
  const names = new Set(projects.map((p) => p.projectName));
  for (const key of Object.keys(AUTHORED)) {
    if (!names.has(key)) {
      throw new Error(`AUTHORED has no matching project: "${key}"`);
    }
  }
}
