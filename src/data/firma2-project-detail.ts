// Per-project detail for the ProjectFirma 2.0 project page: description, work
// areas on the map, performance measures, funding sources, milestones, and the
// people and notes on the record.
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
//     construction milestone before its own start year;
//   - CONTACTS are seeded off the project's own name against a pool of invented
//     people, and each one's organization is read from the record — the lead
//     from the sponsor, the grant manager from whichever body actually funds
//     this project — so no roster can contradict the record it sits on;
//   - COMMENTS are seeded the same way, authored by those same contacts, and a
//     quarter of the portfolio has none at all, because an empty record is a
//     real state and one nobody can reach is one nobody reviews.
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
 * One reporting period of a measure — ProjectFirma reports a measure per
 * PERIOD, not as a single running total, and this is that period made real
 * data rather than a display-time guess.
 *
 * TWO INDEPENDENT FACTS, and keeping them apart is the point of this shape.
 * `status` is the CALENDAR fact — where the period sits relative to now —
 * and it is unchanged: same shape and same reading as an `ExpenditureYear`'s.
 * `value` is the RECORD fact — whether anybody filed against it. 2024 is
 * `complete` whether or not a report exists for it.
 */
export interface MeasureYear {
  year: number;
  /**
   * The reading for this period in the measure's own `unit`, or `null` when NO
   * REPORT EXISTS for it.
   *
   * `null` and `0` are different claims and the type keeps them apart: `0` is a
   * report that was filed and said nothing was accomplished; `null` is a period
   * nobody filed against — either because it has not closed yet, or because
   * this measure is not reported every year, or because the report is late.
   * The old shape used `0` for both, which is why an elapsed period with no
   * report was indistinguishable from a real zero and why nothing on the page
   * could draw the difference.
   */
  value: number | null;
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
  /** What the project has reported to date — equals the sum of the NON-NULL
   *  values in `series`, which is what `reportedTotal()` computes. */
  reported: number;
  /** Every period in the project's window, oldest first — INCLUDING the ones
   *  with no report. Real per-period data: `reported` is derived FROM this,
   *  not the other way around. */
  series: MeasureYear[];
}

/**
 * Sum of the periods that were actually reported. The invariant this module
 * holds is `measure.reported === reportedTotal(measure.series)`.
 *
 * `.toFixed(4)` because binary floating point does not agree with itself about
 * decimal tenths: 8.4 + 12.6 + 13.1 is 34.099999999999994, and a total that
 * disagrees with the headline figure by 6e-15 is a total that prints wrong the
 * first time somebody formats it without a maximumFractionDigits.
 */
export const reportedTotal = (series: MeasureYear[]): number =>
  Number(series.reduce((sum, period) => sum + (period.value ?? 0), 0).toFixed(4));

/**
 * The most recent period that carries a report, or `undefined` when the measure
 * has never been reported against. Defined here rather than in the component
 * that renders it because "the latest report" is a property of the series, and
 * two consumers computing it two ways is two answers.
 */
export const latestReport = (series: MeasureYear[]): MeasureYear | undefined =>
  [...series].reverse().find((period) => period.value !== null);

/**
 * Whether a period has CLOSED — the only kind a report can be missing from.
 * A `null` value on a closed period is a gap; a `null` on any other period is
 * simply nothing owed yet, and the difference is the whole of what the matrix
 * and the data table say about a period nobody filed against.
 *
 * `year < PRESENT_YEAR` is NOT redundant with the status test. milestoneStatus()
 * labels a DEFERRED project's current year `complete` — a deferred project could
 * have drawn money and filed values right up to its halt, which is the accrual
 * question, not the closure question — so a status-only test would accuse the
 * two deferred projects of missing a report for a year that has not ended, and
 * no other project of the same thing.
 *
 * Exported because three places need this answer and must not each derive it:
 * buildMeasures decides which periods can carry a value, the matrix decides
 * which cells are gaps, and the data table decides between "Not reported" and
 * "Not due". Three derivations of one rule is three chances to disagree.
 */
export const isClosedPeriod = (period: Pick<MeasureYear, 'year' | 'status'>): boolean =>
  period.status !== 'upcoming' && period.year < PRESENT_YEAR;

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
 * One reporting year of the project's spend — the accrual half of the funding
 * commitment `FundingSource` records the promise of.
 *
 * ONE FIGURE, NOT TWO, and dropping the second is the point of this shape. It
 * used to carry a `budgeted` sibling: this year's slice of
 * `estimatedTotalCost`, spread by the same accrual curve, so the chart could
 * pair a planned bar against an actual one. That plan did not exist. A project
 * is budgeted ONCE, for the whole of itself — `estimatedTotalCost` is a
 * whole-project figure and nothing in the record divides it into annual
 * allocations — so a per-year "budgeted" bar was this module inventing an
 * authority the data never had, and inviting a reader to read "behind plan"
 * off a plan nobody wrote. What varies year to year is what the project
 * actually SPENT, and that is the only per-year money fact there is.
 *
 * SAME SHAPE AS A MeasureYear, deliberately: a project reports its spend for a
 * period exactly the way it reports a measure's activity for a period, so the
 * two series are the same kind of record and read the same way down the page.
 * The one difference is `null` — a measure distinguishes "reported zero" from
 * "nobody filed", money does not, because a year with no expenditure record
 * against it is a year the project drew nothing.
 */
export interface ExpenditureYear {
  year: number;
  /** Whole dollars drawn down in THIS year. Summed across every year, equals
   *  the project's spend to date. */
  spent: number;
  /** Same reading as a Milestone's status — where this year sits relative to
   *  today's position in the project's life. */
  status: 'complete' | 'current' | 'upcoming';
}

/**
 * A person on the project record. ProjectFirma stores project contacts by ROLE
 * — who to call about the work on the ground, who administers the grant — and
 * the role is what a reader scans for, so it is what a row leads with.
 */
export interface ProjectContact {
  /** Full name, as the record holds it. */
  name: string;
  /** What this person is to THIS project. "Project lead", "Grant manager". */
  role: string;
  /** The body they work for — sponsor or funder, and the row says which. */
  organization: string;
  /** mailto target. Invented, on an invented domain; see the note above. */
  email: string;
}

/**
 * One note on the project record. ProjectFirma comments are the running account
 * of coordination AROUND a project — a permit condition, a signed agreement, a
 * budget amendment — kept on the record instead of in somebody's inbox. They
 * are the one thing on this page with no number in it, which is exactly why a
 * reader who has just read the numbers goes looking for them.
 */
export interface ProjectComment {
  /**
   * THE WHOLE CONTACT, not a name and an organization copied off one. Everyone
   * who comments on a record is one of its own contacts — by construction here,
   * and in practice in a real tenant — so the comment carries the person rather
   * than a flattened copy of two of their fields. That is what lets a thread
   * render the same firma2-contact-card the Contacts tab renders: hover a
   * commenter and you get who they are, instead of the thread having to print
   * their organization under every note.
   */
  author: ProjectContact;
  /** Rendered label — "12 August 2026". Stored formatted; see determinism above. */
  date: string;
  /** The note itself. One or two sentences, never a paragraph. */
  body: string;
}

/**
 * One photo on the project record. No real project photography can appear in
 * this public repo — a photo of a real site is exactly the kind of asset mock
 * data must not borrow — so a photo here is its RECORD: what it shows, when it
 * was taken, and a seed the gallery uses to pick a deterministic stock
 * stand-in (a curated Unsplash landscape; the pools live in the gallery
 * component, the presentation half of this contract). The caption is the
 * datum a real tenant stores with an upload, and it is what the gallery reads
 * aloud.
 */
export interface ProjectPhoto {
  /** What the photo shows. A noun phrase of the work, never a sentence. */
  caption: string;
  /** Rendered label — "June 2025". Stored formatted; see determinism above. */
  date: string;
  /** What kind of ground is in frame — picks the gallery's stand-in pool. */
  scene: 'stream' | 'meadow' | 'forest' | 'channel';
  /**
   * Deterministic pick within the scene's pool. Sibling photos on one record
   * are spaced 11 apart (see buildPhotos), which the gallery relies on: 11 is
   * coprime with its pool lengths, so one project's gallery never shows the
   * same stand-in twice.
   */
  seed: number;
}

/**
 * One logged change to the project record — who touched it, when, and what
 * they did. This is the record-level change log the always-editable stance
 * owes its readers (the brief's §7 names it as the open debt of "no Save"):
 * a site with no edit mode has no moment where a change is announced, so the
 * account of what changed has to live somewhere a reader can open.
 */
export interface AuditEntry {
  /** Rendered label — "12 August 2026". Stored formatted; see determinism above. */
  date: string;
  /** Who made the change. Always one of the record's own contacts. */
  user: string;
  /** What changed, named by the record's own field vocabulary. One sentence. */
  change: string;
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
  /** Who to call about this project. Always three; see buildContacts. */
  contacts: ProjectContact[];
  /** Notes on the record, newest first. May be empty — that is a real state. */
  comments: ProjectComment[];
  /** Photos of the work, oldest first. May be empty — a proposal has little to show. */
  photos: ProjectPhoto[];
  /** The record's change log, newest first. Never empty — creation is a change. */
  audit: AuditEntry[];
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
 * Spread `total` across an explicit set of year INDICES, proportional to each
 * one's own accrual weight, so a total running ahead of or behind an even pace
 * still tracks the plan's shape rather than a flat average. The last index
 * absorbs the rounding remainder, via the caller's own `round`, so the spread
 * always sums to `total` exactly.
 *
 * INDICES RATHER THAN STATUSES, because Measures and Expenditures no longer
 * select the same years. Money accrues in every elapsed year; a measure only
 * carries a value in the years a report was actually filed, which is a smaller
 * and differently-shaped set (see buildMeasures). The CURVE is still shared —
 * both callers weight with accrualWeights() — and the curve was the thing worth
 * sharing. `weights` and the returned array are parallel, one entry per year.
 */
const spreadAcrossIndices = (
  total: number,
  weights: number[],
  indices: number[],
  round: (n: number) => number,
): number[] => {
  const values = weights.map(() => 0);
  if (indices.length === 0 || total <= 0) return values;
  const weightSum = indices.reduce((sum, i) => sum + weights[i], 0);

  // CUMULATIVE TARGETS, DIFFERENCED — not per-period shares with the remainder
  // dumped on the last one. Each period gets the difference between the running
  // total rounded at its own end and the running total rounded at the previous
  // one, which has two properties the naive version does not:
  //
  //   1. NO PERIOD CAN GO NEGATIVE. The cumulative target is non-decreasing
  //      (every weight is positive), so every difference is >= 0. The old shape
  //      rounded each period independently and gave the last one `total -
  //      allocated`, so a long window could round its way past the total and
  //      hand the final period the overshoot as a NEGATIVE reading — a
  //      twenty-five-year project reported "-2 pools" in its closing year, which
  //      is not a thing that can happen and read as exactly the kind of made-up
  //      figure invented data must never produce. It stayed hidden while every
  //      project was six years or fewer: it needs enough periods for the
  //      per-period rounding error to accumulate past one whole unit.
  //   2. THE SUM IS STILL EXACT. The final cumulative target is `round(total)`,
  //      and `total` already arrives at the caller's precision, so the
  //      differences telescope to it.
  //
  // The difference goes through `round` as noise removal, not a second rounding:
  // both operands are already at the caller's precision, and it is binary
  // floating point that turns 1.7 - 1.6 into 0.09999999999999987.
  let allocated = 0;
  let cumulativeWeight = 0;
  indices.forEach((i) => {
    cumulativeWeight += weights[i];
    const cumulativeTarget = round((total * cumulativeWeight) / weightSum);
    values[i] = round(cumulativeTarget - allocated);
    allocated = cumulativeTarget;
  });
  return values;
};

/**
 * Spread `total` across the years that have actually happened — a year whose
 * `status` is 'upcoming' gets none of it. buildExpenditures' selection rule,
 * unchanged; the arithmetic itself now lives in spreadAcrossIndices above.
 */
const spreadAcrossElapsedYears = (
  total: number,
  weights: number[],
  statuses: ('complete' | 'current' | 'upcoming')[],
  round: (n: number) => number,
): number[] =>
  spreadAcrossIndices(
    total,
    weights,
    weights.map((_, i) => i).filter((i) => statuses[i] !== 'upcoming'),
    round,
  );

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
//
// EIGHT FACTORS, NOT FOUR, and the first four are unchanged. At four indexed
// `i % 4`, a project's fifth measure drew the same skew as its first — so on an
// eight-measure project rows 1 and 5, 2 and 6, 3 and 7, 4 and 8 filled their
// rings to the identical percent and reported the identical ratio, on a card
// whose whole job is comparing delivery ACROSS measures. That reads as a data
// bug, and it only became reachable once a project could author more than four.
// Holding the first four fixed means every project that authored three or four
// renders exactly the figures it rendered before.
const MEASURE_SKEW = [1, 0.9, 1.06, 0.82, 0.95, 1.12, 0.74, 1.02];

/**
 * How often this measure is reported, in years. Annual is the norm; every third
 * measure in a project's list runs on a two-year cycle, which is what a
 * survey-based measure — a redd count, a vegetation transect, a survival check —
 * actually costs to run.
 *
 * DERIVED, NEVER STORED. docs/measure-model.md models a period as a COORDINATE
 * of a reported result (`ReportedResult = (project, period, concept, aspect,
 * value, …)`), not as a property of the measure, and its rule 4 evicts workflow
 * state from the model outright. So there is no `frequency` field to read here
 * and there should not be one: the cadence a reader sees is whatever the filed
 * periods imply. Indexed off the measure's position for the same reason
 * MEASURE_SKEW is — a fixed factor per slot gives the list texture with no
 * randomness.
 *
 * (What a real product WOULD eventually need is a reporting obligation on the
 * project↔measure link, because "no report filed" and "no report due" are
 * different states and only the first is late. That is not a property of the
 * measure either, and it is not modelled here.)
 */
const reportingInterval = (i: number): number => (i % 3 === 2 ? 2 : 1);

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

  // A PERIOD A REPORT CAN EXIST FOR: one that has CLOSED. isClosedPeriod holds
  // the rule and its own doc comment explains why the year test is not redundant
  // with the status test; the matrix cells and the data table ask it too.
  //
  // This is also, on its own, the whole of "the current period is not reported
  // yet", and it is ALWAYS rather than usually: a period that has not closed
  // cannot carry a final reported value, and making it sometimes-filed would
  // invent a mid-period filing rule the model has no field for and a reader
  // could not infer. Every in-progress project's year table therefore ends with
  // a period reading "Not reported", which is the honest, visible form of that
  // fact rather than a caveat sentence about it.
  const closedIndices = years
    .map((_, i) => i)
    .filter((i) => isClosedPeriod({ year: years[i], status: statuses[i] }));

  return authored.map(([name, unit, expected], i) => {
    const fraction = Math.min(1, base * MEASURE_SKEW[i % MEASURE_SKEW.length]);
    // A decimal on a continuous unit, but only while the number is small enough
    // for the tenth to mean anything — "3,100 acre-feet" does not want ".4".
    const decimal = CONTINUOUS_UNITS.has(unit) && expected < 1000;
    const round = (n: number) => (decimal ? Number(n.toFixed(1)) : Math.round(n));

    // WHICH PERIODS CARRY A REPORT. Two gates, and they answer different
    // questions. `base > 0` is whether this PROJECT has reported at all: a
    // Proposal or Planning & Design project has filed nothing, so every period
    // is null rather than a row of zeros claiming somebody filed a report that
    // said nothing was done — which is what the old all-zeros series quietly
    // asserted. The interval is the CADENCE.
    const interval = reportingInterval(i);
    const reportedIndices =
      base > 0 ? closedIndices.filter((_, k) => k % interval === 0) : [];

    // `reported` IS THE SUM OF WHAT WAS FILED, so a measure with no filed
    // periods reports 0 no matter what its stage fraction says. Deriving it the
    // other way round would let the headline figure disagree with the year table
    // underneath it, which is the one disagreement this section cannot survive.
    const reported = reportedIndices.length === 0 ? 0 : round(expected * fraction);

    // REPORTED BY PERIOD — the reporting period ProjectFirma actually stores,
    // not a single running total re-guessed at render time. Spread across the
    // periods a report was filed for, on the same accrual curve
    // buildExpenditures uses, so a measure's per-period shape agrees with the
    // project's own spend curve rather than telling a separate story.
    const spread = spreadAcrossIndices(reported, weights, reportedIndices, round);
    const filed = new Set(reportedIndices);
    // An INCIDENTAL zero stays a zero, deliberately: if a long spread rounds one
    // period's share of a count measure down to 0, that is a report that was
    // filed and said zero — exactly the state `value: number | null` exists to
    // express, and distinct from the null beside it.
    const series: MeasureYear[] = years.map((year, yi) => ({
      year,
      value: filed.has(yi) ? spread[yi] : null,
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

  // NO BUDGETED COLUMN. `estimatedTotalCost` is a whole-project figure and
  // this module does not slice it into annual allocations — see the note on
  // ExpenditureYear for why the old per-year `budgeted` was a plan nobody
  // wrote. The curve below still uses the total, because how MUCH has been
  // spent is a fraction of it; what the curve no longer does is claim the
  // shape was ever committed to.

  // SPENT — the accrual. Total spent to date is the SAME completion fraction
  // the measures section reports against (stageCompletion, above): a project
  // that has delivered 55% of its measures has spent 55% of its budget, not a
  // second figure that could disagree with the one already on screen.
  //
  // Spread across the years that have actually happened, on the same shared
  // curve buildMeasures uses for its own per-year series — see
  // spreadAcrossElapsedYears above. $500 steps, matching buildFunding's own
  // rounding, so a year's expenditure reads like a filed figure rather than a
  // number carried to the dollar by arithmetic.
  const totalSpent = Math.round(total * stageCompletion(stage, progress));
  const spent = spreadAcrossElapsedYears(totalSpent, weights, statuses, (n) => Math.round(n / 500) * 500);

  return years.map((year, i) => ({
    year,
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
      ['Acres of invasive vegetation removed', 'acres', 28],
      ['Miles of livestock exclusion fencing', 'miles', 5.8],
      ['Volunteer hours contributed', 'hours', 2400],
      ['Native seed collected', 'pounds', 240],
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
      ['Linear feet of levee breached', 'linear feet', 1850],
      ['Acres of invasive cordgrass treated', 'acres', 46],
      ['Water control structures installed', 'structures', 7],
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
      ['Acres surveyed for cultural resources', 'acres', 4200],
      ['Miles of road decommissioned', 'miles', 12],
      ['Landowner agreements signed', 'agreements', 34],
      ['Slash piles burned', 'piles', 1450],
      ['Defensible space assessments completed', 'assessments', 380],
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
      ['Miles of stream fenced from grazing', 'miles', 6.4],
      ['Instream flow agreements signed', 'agreements', 4],
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
// Contacts and comments
// ---------------------------------------------------------------------------

// INVENTED PEOPLE, INVENTED NOTES, INVENTED DOMAINS. Nobody named below exists,
// no address below resolves, and no note below was written by anyone about any
// real project. This is the part of the mock data that would be most damaging to
// source from life, so it is the part most deliberately made up: the names are
// assembled to be plausibly Californian and plausibly diverse, the domains are
// acronyms of already-invented organizations, and the notes are the shape of
// project coordination without the substance of any.
//
// DERIVED, NOT AUTHORED, for the same reason the funding table is: 24 projects
// × 3 contacts is 72 hand-typed rows that each have to agree with the record
// they sit on — the sponsor's lead has to work for the sponsor, the grant
// manager has to work for a funder that actually funds this project. A seeded
// pick off the project's OWN name cannot get that wrong, and it renders
// identically on every build.

/** A stable, non-negative hash of a string. The same seed for the life of the
 *  record's name — which is the point: a project's people do not change because
 *  the site was rebuilt. Same construction esa-avatar uses for its hue. */
const hashOf = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (value.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  }
  return Math.abs(hash);
};

// 12 names, so three picks off one project never collide (the stride below is
// coprime with the length) and two projects rarely share a whole roster.
//
// NONE OF THEM IS THE SIGNED-IN USER. AppLayout's account menu says "Dana
// Whitfield", and that name was in this pool until it turned up as a field
// contact at a watershed district on one project and a grant manager at a
// funder on another — the reader's own account, holding two jobs neither of
// which is theirs. A mock that contradicts the chrome around it is worse than a
// mock with one fewer name in it.
const PEOPLE = [
  'Renata Alvarez',
  'Thomas Okafor',
  'Priya Raman',
  'Gabriel Sandoval',
  'Marcus Lindqvist',
  'Ivy Nakamura',
  'Cole Barrera',
  'Simone Achebe',
  'Nadia Fontaine',
  'Benjamin Kowalczyk',
  'Alma Reyes',
  'Theo Brandt',
];

// The three roles every ProjectFirma record carries, and WHOSE payroll each sits
// on. `sponsor` is the project's lead organization — the body doing the work.
// `funder` is the administering body behind the grant, which is a different
// organization and a different phone call: a question about the work goes to the
// sponsor, a question about the money goes to the funder.
const CONTACT_ROLES: { role: string; at: 'sponsor' | 'funder' }[] = [
  { role: 'Project lead', at: 'sponsor' },
  { role: 'Grant manager', at: 'funder' },
  { role: 'Field contact', at: 'sponsor' },
];

/** first-initial.lastname@<org acronym>.org — the shape a work address actually
 *  takes, on a domain built from an organization that is itself invented. */
const emailFor = (name: string, organization: string): string => {
  const parts = name.toLowerCase().split(' ');
  const domain = organization
    .split(/\s+/)
    .filter((word) => !/^(of|the|and|for|&)$/i.test(word))
    .map((word) => word[0])
    .join('')
    .toLowerCase();
  return `${parts[0][0]}.${parts[parts.length - 1]}@${domain}.org`;
};

const buildContacts = (project: Project, funding: FundingSource[]): ProjectContact[] => {
  // The first funder that is NOT the sponsor itself. Every project's last
  // funding source is its own local match, whose organization resolves to the
  // lead org — so taking funding[0] blindly would give a project whose only
  // outside funder sits second a "Grant manager" at the sponsor's own address.
  const funderOrg =
    funding.find((source) => source.organization !== project.leadOrganization)?.organization ??
    funding[0].organization;

  const seed = hashOf(project.projectName);
  return CONTACT_ROLES.map((entry, i) => {
    const organization = entry.at === 'sponsor' ? project.leadOrganization : funderOrg;
    // Stride 5 against a pool of 12: coprime, so three consecutive picks are
    // always three different people.
    const name = PEOPLE[(seed + i * 5) % PEOPLE.length];
    return { name, role: entry.role, organization, email: emailFor(name, organization) };
  });
};

// Notes that hold for a project at ANY stage, which is the constraint that
// decided every one of them: a seeded pick cannot know whether this record has
// broken ground, so a note about reconciling invoices would land on a proposal.
// What survives that test is coordination — access, permits, scheduling,
// budget mechanics — and that is what project comments mostly are anyway.
const COMMENT_NOTES = [
  'Access agreement with the downstream landowner is signed. No further constraint on the lower units.',
  'Permit condition on the in-water work window is unchanged: 15 June to 15 October.',
  'Budget amendment approved — the sponsor match moved onto the capital line.',
  'Survey crew is booked for the fall window. Reported values stay provisional until they close out.',
  'Coordination call with the county is set for the first week of the month. Agenda is the haul route.',
  'Landowner outreach on the upper parcel is still open — two owners have not responded.',
];

// Newest first, pinned to the same 2026 the rest of this module treats as the
// present. Fixed dates rather than offsets from a clock, for the determinism
// reason stated at the top of the file.
const COMMENT_DATES = ['12 August 2026', '30 June 2026', '4 May 2026'];

const buildComments = (project: Project, contacts: ProjectContact[]): ProjectComment[] => {
  const seed = hashOf(project.projectName);
  // 0 TO 3, AND THE ZERO IS DELIBERATE. A quarter of the portfolio has no notes
  // on it, because that is true of every real record set and because an empty
  // state nobody can reach is an empty state nobody reviews.
  const count = seed % 4;
  return Array.from({ length: count }, (_, i) => {
    // The conversation alternates between the two people who would actually be
    // having it: the sponsor's lead and the funder's grant manager.
    return {
      author: contacts[i % 2],
      date: COMMENT_DATES[i],
      body: COMMENT_NOTES[(seed + i * 3) % COMMENT_NOTES.length],
    };
  });
};

// ---------------------------------------------------------------------------
// Photos
// ---------------------------------------------------------------------------

// Captions in the order the WORK produces them — site before, mobilization,
// treatment, result — because the prefix a project is allowed to show is how the
// gallery stays honest. A Proposal has only the "before" photo to show; an
// Implementation project can show the crew but not the finished reach; only a
// completed project reaches the end of its pool. Taking a stage-bounded PREFIX
// of a chronologically-ordered pool makes a contradiction (a proposal showing
// finished work) unrepresentable, the same way deriving reported values from
// stage does.
const PHOTO_POOLS: Record<string, { scene: ProjectPhoto['scene']; captions: string[] }> = {
  'Riparian Revegetation': {
    scene: 'stream',
    captions: [
      'Bare streambank on the lower corridor, before planting',
      'Container stock staged at the site access',
      'Volunteer crew planting willow stakes',
      'Browse protection installed on first-season plantings',
      'Irrigation line run to the upland buffer',
      'Second-season growth along the planted reach',
    ],
  },
  'Fish Passage': {
    scene: 'stream',
    captions: [
      'The barrier before removal',
      'Site access and staging area',
      'Crew relocating fish ahead of dewatering',
      'Excavator placing boulders in the roughened channel',
      'Reconnected channel at first fall flow',
      'Adult salmon holding above the former barrier site',
    ],
  },
  'Meadow & Wetland Restoration': {
    scene: 'meadow',
    captions: [
      'Incised channel before treatment',
      'Baseline vegetation transect',
      'Channel plug under construction',
      'Ponded water behind the first plug after fall rains',
      'Sedge plugs going into the rewetted surface',
      'Meadow surface holding water into early summer',
    ],
  },
  'Aquatic Habitat Restoration': {
    scene: 'stream',
    captions: [
      'The reach before treatment, at summer base flow',
      'Log structures staged at the site access',
      'Excavator anchoring large wood in the mainstem',
      'Side-channel excavation in progress',
      'Completed structure at summer base flow',
      'Survey crew at the post-project cross-section',
    ],
  },
  'Forest Health & Fuels': {
    scene: 'forest',
    captions: [
      'Pre-treatment stand density',
      'Crew briefing at the north unit landing',
      'Hand crew thinning ladder fuels',
      'Masticator working the ridge unit',
      'Pile burning in the first treatment unit',
      'The completed fuel break, looking down the alignment',
    ],
  },
  'Stormwater & Water Quality': {
    scene: 'channel',
    captions: [
      'The channel margin before conversion',
      'Native container stock staged for planting',
      'Infiltration basin excavation',
      'Bioswale planting along the terrace',
      'First storm flows entering the treatment train',
      'The completed basin holding runoff after a winter storm',
    ],
  },
};

// Field season months, cycled by position — restoration photography is as
// seasonal as its milestones, and six photos all dated January read as
// placeholder data.
const PHOTO_MONTHS = ['April', 'July', 'September', 'June', 'October', 'May'];

// How many photos a record at each stage carries, and how far into the pool's
// arc it may reach. `limit` is the honesty bound (see PHOTO_POOLS); `count` is
// seeded so the portfolio has texture — including proposals with NO photos,
// because an empty gallery is a real state and one nobody can reach is one
// nobody reviews.
const photoCount = (stage: ProjectStage, seed: number): { count: number; limit: number } => {
  switch (stage) {
    case 'Proposal':
      return { count: seed % 2, limit: 1 };
    case 'Planning & Design':
      return { count: 1 + (seed % 2), limit: 2 };
    case 'Implementation':
      return { count: 3 + (seed % 3), limit: 5 };
    case 'Deferred':
      return { count: 2 + (seed % 2), limit: 3 };
    case 'Post-Implementation':
    case 'Completed':
      return { count: 4 + (seed % 3), limit: 6 };
  }
};

const buildPhotos = (project: Project): ProjectPhoto[] => {
  const pool = PHOTO_POOLS[project.program];
  if (!pool) {
    throw new Error(`No photo pool for program "${project.program}"`);
  }

  const seed = hashOf(project.projectName);
  const { count, limit } = photoCount(project.stage, seed);
  const taken = Math.min(count, limit);
  if (taken === 0) return [];

  // Dated across the record's own span, oldest first: the "before" photo lands
  // around site assessment (start − 2, same anchor the milestones use) and the
  // latest never postdates the prototype's pinned present. A proposal whose
  // start year is still ahead therefore dates its site photo in the past, which
  // is when an assessment photo is actually taken.
  const { implementationStartYear: start, completionYear: end } = project;
  const firstYear = Math.min(PRESENT_YEAR, start - 2);
  const lastYear = Math.min(PRESENT_YEAR, end);

  return Array.from({ length: taken }, (_, i) => {
    const t = taken === 1 ? 0 : i / (taken - 1);
    const year = Math.round(firstYear + t * (lastYear - firstYear));
    return {
      caption: pool.captions[i],
      date: `${PHOTO_MONTHS[i % PHOTO_MONTHS.length]} ${year}`,
      scene: pool.scene,
      seed: seed + i * 11,
    };
  });
};

// ---------------------------------------------------------------------------
// Change log
// ---------------------------------------------------------------------------

// Whole dollars in a change string, matching how every component renders money.
// Local rather than imported from lib/format: the data module stays
// dependency-free, and the format is one option object either way.
const AUDIT_CURRENCY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

// Ascending, because they are assigned by position WITHIN a year (see the end
// of buildAudit): the log is sorted by year, and a month cycle that ignored
// year boundaries dated November before March inside the same year. A seeded
// offset per year keeps every run from opening on February.
const AUDIT_MONTHS = ['January', 'March', 'May', 'July', 'September', 'November'];

// When the record's CURRENT stage was set, per stage — the newest entry in the
// log has to agree with the pill in the page header, and its date has to agree
// with the timeline. Clamped to the pinned present everywhere below.
const stageSetYear = (project: Project): number => {
  const { implementationStartYear: start, completionYear: end, stage } = project;
  switch (stage) {
    case 'Proposal':
      return start - 2;
    case 'Planning & Design':
      return start - 1;
    case 'Implementation':
      return start;
    case 'Deferred':
      return PRESENT_YEAR;
    case 'Post-Implementation':
    case 'Completed':
      return end;
  }
};

/**
 * The record's change log, derived from the record itself so no entry can
 * contradict the page it sits behind: the stage entry names the stage the
 * header shows, the cost entry ends at the cost the rail shows, the funding
 * entry names a funder from the table, and "Reported value filed" only appears
 * on a project that has actually reported. Users are the record's own contacts
 * — the people who would be editing it — with the sponsor's lead carrying the
 * record work, the grant manager the money, and the field contact the ground.
 */
const buildAudit = (
  project: Project,
  contacts: ProjectContact[],
  funding: FundingSource[],
  measures: PerformanceMeasure[],
  firstAreaLabel: string,
): AuditEntry[] => {
  const seed = hashOf(project.projectName);
  const { implementationStartYear: start, estimatedTotalCost: total } = project;
  const [lead, grantManager, fieldContact] = contacts;

  // The prior cost, seeded to a $500 step like every figure in the funding
  // table, in either direction — budgets get revised up and down.
  const delta = 500 * (8 + (seed % 24));
  const previousCost = seed % 2 === 0 ? total - delta : total + delta;

  const outsideFunder =
    funding.find((source) => source.organization !== project.leadOrganization) ?? funding[0];

  // Chronological, oldest first; reversed on return. Years clamp to the pinned
  // present so no change postdates the prototype's "now".
  const year = (y: number): number => Math.min(PRESENT_YEAR, y);
  const entries: { year: number; user: string; change: string }[] = [
    { year: year(start - 2), user: lead.name, change: 'Project created' },
    { year: year(start - 2), user: lead.name, change: 'Description updated' },
    {
      year: year(start - 1),
      user: grantManager.name,
      change: `Funding source added: ${outsideFunder.name}`,
    },
    {
      year: year(start - 1),
      user: grantManager.name,
      change: `Estimated total cost changed from ${AUDIT_CURRENCY.format(previousCost)} to ${AUDIT_CURRENCY.format(total)}`,
    },
    {
      year: year(start),
      user: fieldContact.name,
      change: `Work area boundary revised: ${firstAreaLabel}`,
    },
  ];

  // Only a project that has reported has a filing to log — same gate the
  // measures section renders under, read from the same derived data.
  const reportedMeasure = measures.find((measure) => measure.reported > 0);
  if (reportedMeasure) {
    const latest = latestReport(reportedMeasure.series);
    if (latest) {
      entries.push({
        year: latest.year,
        user: lead.name,
        change: `Reported value filed: ${reportedMeasure.name}, ${latest.year}`,
      });
    }
  }

  entries.push({
    year: year(stageSetYear(project)),
    user: lead.name,
    change: `Stage set to ${project.stage}`,
  });

  // A derived year can land out of sequence (a Completed project's stage entry
  // predates its last filing's year, say) — sort restores the chronology, and
  // the sort is stable so same-year entries keep their authored order.
  entries.sort((a, b) => a.year - b.year);

  // Months ascend WITHIN each year-run, so the rendered dates agree with the
  // order the list presents them in — the one thing a change log cannot get
  // wrong. The per-year seeded offset varies which month a year opens on;
  // runs are at most three entries, so the index never leaves the list.
  let runStart = 0;
  return entries
    .map((entry, i) => {
      if (i > 0 && entries[i - 1].year !== entry.year) runStart = i;
      const month = AUDIT_MONTHS[((seed + entry.year) % 3) + (i - runStart)];
      return {
        date: `${1 + ((seed + i * 7) % 27)} ${month} ${entry.year}`,
        user: entry.user,
        change: entry.change,
      };
    })
    .reverse();
};

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

const buildDetail = (project: Project): ProjectDetail => {
  const authored = AUTHORED[project.projectName];
  if (!authored) {
    throw new Error(`No authored detail for "${project.projectName}"`);
  }
  // Hoisted out of the literal below: the contacts read the funding table to
  // find which body administers this project's grant, the comments read the
  // contacts to find who is talking, and the change log reads all of it — its
  // entries name the funders, measures and work areas the page renders, which
  // is what keeps the log unable to contradict the record it accounts for.
  const funding = buildFunding(project, authored.funders);
  const contacts = buildContacts(project, funding);
  const measures = buildMeasures(project, authored.measures, authored.progress);

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
    measures,
    funding,
    expenditures: buildExpenditures(project, authored.progress),
    milestones: buildMilestones(project),
    contacts,
    comments: buildComments(project, contacts),
    photos: buildPhotos(project),
    audit: buildAudit(project, contacts, funding, measures, authored.areas[0].label),
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

/**
 * How many projects in the portfolio carry this person as a contact — the fact
 * that makes a contact's hover card worth raising, exactly as the project count
 * is what makes a classification's worth raising. Keyed by EMAIL rather than by
 * name: an address is the identifier a directory would actually dedupe on, and
 * two people can share a name.
 *
 * Reads `projectDetails`, which is already fully built by the time any page
 * calls this (the map above is eager, for the build-time-failure reason stated
 * on it), so there is no ordering hazard and no cycle — this module never
 * imports a component.
 */
export const contactProjectCount = (email: string): number => {
  let count = 0;
  for (const detail of projectDetails.values()) {
    if (detail.contacts.some((contact) => contact.email === email)) count += 1;
  }
  return count;
};

/** How many projects there are, for the "3 of 24" denominator on that card. */
export const projectCount = (): number => projects.length;

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
