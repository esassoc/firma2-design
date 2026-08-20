// The tenant's performance-measure catalog — the records behind the Performance
// Measures index, and the vocabulary the setup drawer collects.
//
// INVENTED CONTENT. Every measure, definition, guidance string and count below
// is fabricated. Nothing is copied, derived, or sanitized from a client system
// or any ProjectFirma tenant — this repo and its deployed site are public.
//
// What IS borrowed is the ProjectFirma data model for a performance measure:
// a measure has a data type and a unit, values roll up across projects by a
// declared aggregation, a measure may be split into SUBCATEGORIES, each carrying its own
// option list, and reporting is governed by
// a frequency and a required flag. That is the shape the setup drawer walks a
// user through, one step per group.
//
// DETERMINISM. design-principles requires mock data to render identically on
// every run: this is a literal array with no Math.random() and no Date.now().
//
// `projectCount` is AUTHORED rather than derived from firma2-project-detail.
// Derivation would have to match measures by NAME across two files, and a
// near-miss ("Acres treated" vs "Acres treated with prescribed fire") would
// silently report zero rather than fail loudly. An authored int cannot drift
// into a wrong answer the way a fragile join can.

import { projects } from './firma2-projects';

/** How a measure's values are typed. Drives the unit field and the value input. */
export type MeasureDataType = 'Number' | 'Percent' | 'Currency';

/** How values from many projects combine into a program-level total. */
export type MeasureAggregation = 'Sum' | 'Average' | 'Most recent';

/** How often a project is expected to report the measure. */
export type ReportingFrequency = 'Annually' | 'Quarterly' | 'On completion';

/** Where a measure sits in its own lifecycle. */
export type MeasureStatus = 'Active' | 'Draft' | 'Retired';

/**
 * A subcategory: one dimension a measure can be split along, plus the closed
 * list of values that dimension accepts. "Habitat type" -> Riparian / Wetland /
 * Upland. A measure with no subcategories is reported as a single number.
 */
export interface MeasureSubcategory {
  /** The dimension's name, as a reporter sees it above the option list. */
  name: string;
  /** The closed vocabulary. Order is the order reporters see. */
  options: string[];
}

export interface PerformanceMeasureDefinition {
  /** URL-safe id. */
  slug: string;
  /**
   * The measure's name. EMPTY until the author names it: creating a measure asks
   * only for its data type, so the record exists — and is shareable — before it
   * has a name. Render it through measureDisplayName(), never raw.
   */
  name: string;
  /** What counts toward this measure, and what does not. Stored on the record. */
  definition: string;
  /** Taxonomy branch the measure rolls up into. Matches a project `program`. */
  program?: string;
  dataType: MeasureDataType;
  /** Unit of the reported value. Empty for Percent and Currency, which carry their own. */
  unit: string;
  /** Decimal places the value input accepts. */
  decimalPlaces: number;
  aggregation?: MeasureAggregation;
  subcategories: MeasureSubcategory[];
  reportingFrequency?: ReportingFrequency;
  /** Whether a project in this program must report the measure to close a period. */
  required: boolean;
  /** Instruction shown to the reporter at the moment they enter a value. */
  reporterGuidance: string;
  status: MeasureStatus;
  /** Projects currently reporting this measure. */
  projectCount: number;
}

/**
 * esa-pill variant per status. Draft takes `info` (unfinished, not wrong) and
 * Retired takes `default` — a retired measure is quiet, not alarming, because
 * nothing is broken about it.
 */
export const MEASURE_STATUS_TONE: Record<MeasureStatus, 'default' | 'info' | 'primary' | 'success' | 'warning'> = {
  Active: 'success',
  Draft: 'info',
  Retired: 'default',
};

export const measures: PerformanceMeasureDefinition[] = [
  {
    slug: 'acres-riparian-habitat-restored',
    name: 'Acres of riparian habitat restored',
    definition:
      'Acres within the streamside corridor where native vegetation has been planted or released and the site has passed its first survival check.',
    program: 'Riparian Revegetation',
    dataType: 'Number',
    unit: 'acres',
    decimalPlaces: 1,
    aggregation: 'Sum',
    subcategories: [
      { name: 'Treatment', options: ['Planting', 'Invasive removal', 'Natural recruitment'] },
      { name: 'Bank', options: ['Left bank', 'Right bank', 'Both banks'] },
    ],
    reportingFrequency: 'Annually',
    required: true,
    reporterGuidance:
      'Count acres where planting is complete and the first survival check has passed. Do not count acres prepared but not yet planted.',
    status: 'Active',
    projectCount: 14,
  },
  {
    slug: 'fish-passage-barriers-removed',
    name: 'Fish passage barriers removed',
    definition:
      'Structures no longer impeding upstream or downstream passage at any life stage, confirmed by a post-construction passage assessment.',
    program: 'Fish Passage',
    dataType: 'Number',
    unit: 'barriers',
    decimalPlaces: 0,
    aggregation: 'Sum',
    subcategories: [
      { name: 'Barrier type', options: ['Culvert', 'Dam', 'Weir', 'Push-up dam', 'Flashboard'] },
    ],
    reportingFrequency: 'On completion',
    required: true,
    reporterGuidance:
      'Report a barrier once its passage assessment is signed. A barrier replaced with a passable structure counts; one modified but still rated impassable does not.',
    status: 'Active',
    projectCount: 9,
  },
  {
    slug: 'stream-miles-habitat-restored',
    name: 'Stream miles of habitat restored',
    definition:
      'Channel length where instream structure, gradient, or substrate has been altered to restore rearing or spawning function.',
    program: 'Aquatic Habitat Restoration',
    dataType: 'Number',
    unit: 'miles',
    decimalPlaces: 2,
    aggregation: 'Sum',
    subcategories: [
      { name: 'Habitat function', options: ['Spawning', 'Rearing', 'Holding', 'Migration'] },
    ],
    reportingFrequency: 'Annually',
    required: true,
    reporterGuidance:
      'Measure along the channel centerline, not bank to bank. Where treated reaches overlap, report the union once rather than each reach separately.',
    status: 'Active',
    projectCount: 11,
  },
  {
    slug: 'acres-treated-prescribed-fire',
    name: 'Acres treated with prescribed fire',
    definition:
      'Acres carried by an ignition under an approved burn plan, measured from the perimeter actually burned rather than the unit planned.',
    program: 'Forest Health & Fuels',
    dataType: 'Number',
    unit: 'acres',
    decimalPlaces: 0,
    aggregation: 'Sum',
    subcategories: [
      { name: 'Burn type', options: ['Broadcast', 'Pile', 'Understory', 'Jackpot'] },
      { name: 'Ownership', options: ['Federal', 'State', 'Private', 'Tribal'] },
    ],
    reportingFrequency: 'Quarterly',
    required: true,
    reporterGuidance:
      'Report the perimeter that carried fire, not the unit planned. A unit re-entered in a later season is reported again for that season.',
    status: 'Active',
    projectCount: 7,
  },
  {
    slug: 'native-trees-planted',
    name: 'Native trees and shrubs planted',
    definition:
      'Individual native woody plants installed, counted at installation and not adjusted for later mortality.',
    program: 'Riparian Revegetation',
    dataType: 'Number',
    unit: 'plants',
    decimalPlaces: 0,
    aggregation: 'Sum',
    subcategories: [
      { name: 'Growth form', options: ['Tree', 'Shrub', 'Cutting'] },
      { name: 'Stock', options: ['Container', 'Bare root', 'Live stake', 'Seed'] },
    ],
    reportingFrequency: 'Annually',
    required: false,
    reporterGuidance:
      'Count plants installed, not plants ordered. Mortality is tracked by the survival measure, so do not reduce this count after a die-off.',
    status: 'Active',
    projectCount: 12,
  },
  {
    slug: 'plant-survival-rate',
    name: 'Plant survival rate',
    definition:
      'Share of installed plants alive at the survey, against the count installed on the same unit.',
    program: 'Riparian Revegetation',
    dataType: 'Percent',
    unit: '',
    decimalPlaces: 0,
    aggregation: 'Average',
    subcategories: [
      { name: 'Years since planting', options: ['Year 1', 'Year 3', 'Year 5'] },
    ],
    reportingFrequency: 'Annually',
    required: false,
    reporterGuidance:
      'Survey the same units each year so the series stays comparable. Report the plot average, not a whole-site estimate.',
    status: 'Active',
    projectCount: 8,
  },
  {
    slug: 'acres-tidal-marsh-restored',
    name: 'Acres of tidal marsh restored',
    definition:
      'Acres reconnected to tidal exchange and holding marsh plain elevation, measured after the first full tidal year.',
    program: 'Meadow & Wetland Restoration',
    dataType: 'Number',
    unit: 'acres',
    decimalPlaces: 1,
    aggregation: 'Sum',
    subcategories: [
      { name: 'Marsh zone', options: ['Low marsh', 'Mid marsh', 'High marsh', 'Transition'] },
    ],
    reportingFrequency: 'Annually',
    required: true,
    reporterGuidance:
      'Report acres after the first full tidal year, so subsided ground that has not yet accreted is not counted as marsh.',
    status: 'Active',
    projectCount: 6,
  },
  {
    slug: 'sediment-load-reduced',
    name: 'Sediment load reduced',
    definition:
      'Annual sediment delivery avoided at the treated site, from the road or bank assessment protocol used at design.',
    program: 'Stormwater & Water Quality',
    dataType: 'Number',
    unit: 'tons per year',
    decimalPlaces: 0,
    aggregation: 'Sum',
    subcategories: [
      { name: 'Source', options: ['Road surface', 'Streambank', 'Gully', 'Landslide'] },
    ],
    reportingFrequency: 'On completion',
    required: true,
    reporterGuidance:
      'Use the same protocol the design estimate used, so the reported reduction can be compared against what was promised.',
    status: 'Active',
    projectCount: 5,
  },
  {
    slug: 'cost-per-acre-treated',
    name: 'Cost per acre treated',
    definition:
      'Delivered cost divided by acres treated, including implementation labor and materials but excluding planning and permitting.',
    program: 'Forest Health & Fuels',
    dataType: 'Currency',
    unit: '',
    decimalPlaces: 2,
    aggregation: 'Average',
    subcategories: [],
    reportingFrequency: 'Annually',
    required: false,
    reporterGuidance:
      'Exclude planning and permitting so the figure compares across projects that scoped those phases differently.',
    status: 'Draft',
    projectCount: 0,
  },
  {
    slug: 'volunteer-hours-contributed',
    name: 'Volunteer hours contributed',
    definition:
      'Hours worked on site by unpaid participants, from the signed field log for each work day.',
    program: 'Riparian Revegetation',
    dataType: 'Number',
    unit: 'hours',
    decimalPlaces: 0,
    aggregation: 'Sum',
    subcategories: [],
    reportingFrequency: 'Quarterly',
    required: false,
    reporterGuidance:
      'Count hours on site from the signed field log. Travel and training time are not reported here.',
    status: 'Retired',
    projectCount: 3,
  },
  {
    // THE HALF-FINISHED DRAFT. Everything except `dataType` is unset, because
    // creating a measure asks ONE question and this is the record that answer
    // produces. It sits in the catalog unnamed and incomplete on purpose: the
    // setup model assumes you leave, consult someone, and come back, so the
    // list has to be able to show you a measure you have not finished. Delete
    // this row and the empty-draft state has no specimen on any screen.
    slug: 'draft-untitled-number-measure',
    name: '',
    definition: '',
    dataType: 'Number',
    unit: '',
    decimalPlaces: 0,
    subcategories: [],
    required: false,
    reporterGuidance: '',
    status: 'Draft',
    projectCount: 0,
  },
];

// ---------------------------------------------------------------------------
// Option vocabularies — one source for the index filters AND the setup drawer,
// so a value the table can show is always a value the form can produce.
// ---------------------------------------------------------------------------

export const DATA_TYPES: MeasureDataType[] = ['Number', 'Percent', 'Currency'];

export const AGGREGATIONS: MeasureAggregation[] = ['Sum', 'Average', 'Most recent'];

export const REPORTING_FREQUENCIES: ReportingFrequency[] = ['Annually', 'Quarterly', 'On completion'];

/**
 * The taxonomy branches a measure can roll up into, taken from the project
 * portfolio rather than typed again — a program with no projects is not a
 * program a measure should be able to pick.
 */
export const PROGRAMS: string[] = [...new Set(projects.map((p) => p.program))].sort();

/**
 * Units already in use across the catalog, offered as suggestions rather than a
 * closed list: a new measure may legitimately need a unit no existing measure
 * uses, and forcing it through an admin request to add one is the kind of
 * friction that gets worked around with a wrong pick.
 */
export const UNIT_SUGGESTIONS: string[] = [
  ...new Set(measures.map((m) => m.unit).filter(Boolean)),
].sort();

/** Newest-authored first is meaningless for a catalog; measures read alphabetically. */
export const measuresByName = (): PerformanceMeasureDefinition[] =>
  [...measures].sort((a, b) => a.name.localeCompare(b.name));

// ---------------------------------------------------------------------------
// Record access and readiness
// ---------------------------------------------------------------------------

/** Route for one measure's setup page. Base-less; wrap with withBase() at render. */
export const measureHref = (m: PerformanceMeasureDefinition): string =>
  `/prototypes/measures/${m.slug}`;

/**
 * What to SHOW for a measure's name. A measure is created by answering one
 * question — its data type — so it reaches the catalog before it is named, and
 * every surface that lists measures has to render that honestly rather than as
 * a blank cell. "Untitled measure" is the same string the setup page's own
 * heading falls back to, so the row you clicked and the page you land on agree.
 */
export const measureDisplayName = (m: PerformanceMeasureDefinition): string =>
  m.name.trim() || 'Untitled measure';

export const getMeasure = (slug: string): PerformanceMeasureDefinition | undefined =>
  measures.find((m) => m.slug === slug);

/** A required value the measure does not have yet. */
export interface OutstandingField {
  /**
   * The field's name, WORD FOR WORD as its label reads on the setup page. Same
   * datum, same word, in both places — a reader told "Reporter guidance" is
   * missing must not then have to work out which differently-named field that is.
   */
  label: string;
  /** id of the setup section that collects it, so the readiness list can link to it. */
  section: 'identity' | 'measurement' | 'reporting';
}

/**
 * What still stands between this measure and being publishable.
 *
 * THE SETUP MODEL DEPENDS ON THIS FUNCTION. Setup is not a sitting — it is a
 * draft you leave, ask a colleague about, and come back to. What makes that
 * survivable is that the record can always tell you what it is still waiting
 * for, so returning after a week costs no re-reading. An empty list means ready
 * to publish.
 *
 * Subcategories are deliberately absent: a measure with no subcategories is
 * reported as a single number, which is a complete and common answer, not a
 * gap. Unit is conditional for the same reason — percent and currency carry
 * their own, so demanding one would be demanding a value that does not exist.
 */
export const outstandingFields = (m: PerformanceMeasureDefinition): OutstandingField[] => {
  const missing: OutstandingField[] = [];
  if (!m.name.trim()) missing.push({ label: 'Measure name', section: 'identity' });
  if (!m.definition.trim()) missing.push({ label: 'Definition', section: 'identity' });
  if (!m.program) missing.push({ label: 'Program', section: 'identity' });
  if (m.dataType === 'Number' && !m.unit.trim()) missing.push({ label: 'Unit', section: 'measurement' });
  if (!m.aggregation) missing.push({ label: 'Aggregation', section: 'measurement' });
  if (!m.reportingFrequency) missing.push({ label: 'Reporting frequency', section: 'reporting' });
  if (!m.reporterGuidance.trim()) missing.push({ label: 'Reporter guidance', section: 'reporting' });
  return missing;
};

/** A measure with nothing outstanding can be published. */
export const isReadyToPublish = (m: PerformanceMeasureDefinition): boolean =>
  outstandingFields(m).length === 0;
