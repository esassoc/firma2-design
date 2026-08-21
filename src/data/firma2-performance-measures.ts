// Performance measures, modelled as a QUANTITY plus a set of DIMENSIONS, where
// every dimension declares WHERE ITS VALUE COMES FROM.
//
// THIS IS A PROPOSAL, NOT A PORT. ProjectFirma today stores a measure's
// breakdowns as per-measure subcategories that a reporter fills in by hand,
// every time. That has two costs the model below is built to remove:
//
//   1. THE SAME VOCABULARY IS RE-DECLARED PER MEASURE. Three measures that care
//      about land ownership each define their own option list, independently,
//      and they drift — one says Federal/State/Private/Tribal, the next says
//      Public/Private — so nothing can be grouped across them.
//   2. THE REPORTER IS ASKED FOR THINGS THE SYSTEM ALREADY KNOWS. If a
//      treatment's extent is mapped, whether it fell inside critical habitat is
//      a spatial question, not a question for the person who did the work.
//
// So a dimension carries a SOURCE. Four kinds, and the difference between them
// is who pays:
//
//   reported    — the person entering the record picks it.       COST: one choice
//   spatial     — a geospatial layer answers it, via the place.  COST: none
//   historical  — prior records on the same place answer it.     COST: none
//   record      — the project or the entry itself answers it.    COST: none
//
// Defining a measure is therefore: name the quantity, then for each dimension,
// name its source. Everything downstream — how heavy the reporting form is, what
// the program can slice by — falls out of that one set of declarations.
//
// A SPATIALLY DERIVED DIMENSION IS A SPLIT, NOT A LABEL. Twenty acres of biomass
// removal is not "in critical habitat" or "not" — it is 18 acres inside and 2
// outside. A reported dimension always resolves to exactly one value; a spatial
// one resolves to an allocation. That is strictly better than asking a human,
// who has to pick one and rounds to whichever is bigger.
//
// PRIMARY vs SUPPORTING. One reported dimension is primary: it is the thing that
// makes an entry an entry. You cannot report "20 acres" without saying what you
// did. The rest qualify it. This is not decoration — it decides the shape of the
// reporting form, where the primary is the row you add and the supporting ones
// are fields on that row.
//
// INVENTED CONTENT. Every measure, layer and option below is fabricated. The
// VOCABULARY is drawn from public fuels-and-restoration practice (treatment
// phases, critical zones, HUC watersheds); nothing is copied from a client
// system or any ProjectFirma tenant. This repo and its site are public.
//
// DETERMINISTIC — a literal array, no Math.random(), no Date.now().

import { projects, classifications } from './firma2-projects';
import type { Classification } from './firma2-projects';

// ---------------------------------------------------------------------------
// Dimension sources
// ---------------------------------------------------------------------------

/**
 * The geospatial layers this tenant has loaded. A spatial dimension names one
 * of these; the layer supplies the option vocabulary, so the measure author
 * never retypes it and two measures reading the same layer cannot disagree.
 */
export interface GeoLayer {
  id: string;
  name: string;
  /** The values the layer can return. Includes the outside-every-polygon case. */
  values: string[];
  /** What the layer actually is, for an author choosing between two similar ones. */
  description: string;
}

export const GEO_LAYERS: GeoLayer[] = [
  {
    id: 'critical-zone',
    name: 'Critical zone',
    values: ['Critical habitat', 'Critical headwater resources', 'Recreation area', 'Unspecified', 'None'],
    description: 'Designations the program treats as priority ground.',
  },
  {
    id: 'land-ownership',
    name: 'Land ownership',
    values: ['Federal', 'State', 'Private', 'Tribal', 'Unknown'],
    description: 'Surface ownership from the statewide parcel layer.',
  },
  {
    id: 'watershed',
    name: 'Watershed',
    values: ['North Yuba', 'Middle Fork Feather', 'Upper Butte', 'Deer Creek', 'Battle Creek'],
    description: 'HUC-12 subwatershed containing the treated extent.',
  },
  {
    id: 'county',
    name: 'County',
    values: ['Butte', 'Nevada', 'Plumas', 'Sierra', 'Tehama', 'Yuba'],
    description: 'County boundary containing the treated extent.',
  },
];

/** Fields the entry or its project already carries. No layer, no lookup. */
export const RECORD_FIELDS = [
  { id: 'reporting-year', name: 'Reporting year', description: "The entry's own date." },
  { id: 'project', name: 'Project', description: 'The project the entry belongs to.' },
  { id: 'lead-organization', name: 'Lead organization', description: "The project's lead organization." },
  { id: 'program', name: 'Program', description: 'The taxonomy branch the project rolls up into.' },
] as const;

/** Questions answered by looking at earlier entries on the same place. */
export const HISTORICAL_RULES = [
  {
    id: 'treatment-phase',
    name: 'Initial vs maintenance',
    description: 'First entry on a place is Initial; a re-entry inside the program window is Maintenance.',
    values: ['Initial', 'Maintenance'],
  },
  {
    id: 'first-treatment-year',
    name: 'First treated',
    description: 'The year this place first appeared in any entry.',
    values: [],
  },
] as const;

export type DimensionSourceKind = 'reported' | 'spatial' | 'historical' | 'record';

export interface DimensionSource {
  kind: DimensionSourceKind;
  /** GEO_LAYERS id for `spatial`, HISTORICAL_RULES id for `historical`, RECORD_FIELDS id for `record`. */
  ref?: string;
}

export interface MeasureDimension {
  /** What the dimension is called on the form and in the report. */
  name: string;
  source: DimensionSource;
  /**
   * The vocabulary. Authored ONLY for `reported` dimensions — every other kind
   * takes its values from the source it names, which is the point of naming one.
   */
  options?: string[];
  /**
   * The dimension that makes an entry an entry. Exactly one per measure, and it
   * must be `reported` — the system cannot derive what someone chose to do.
   */
  primary?: boolean;
}


// ---------------------------------------------------------------------------
// The fork: what KIND of statement a measure makes
// ---------------------------------------------------------------------------

/**
 * An OUTPUT records what someone did. An OUTCOME records what is true.
 *
 * These are not two flavours of one thing, and the difference is not cosmetic —
 * it changes who reports, what a record must carry, and which counting rules
 * are even meaningful:
 *
 *   - An output has an actor and a primary reported dimension: you cannot report
 *     "20 acres" without saying what you did to them. Outputs sum, and mapped
 *     outputs can be unioned.
 *   - An outcome has no actor. Nobody "did" a water temperature. There is no
 *     "what did you do" to ask, summing readings is meaningless, and the record
 *     belongs to a PLACE and a monitoring effort rather than to a project — a
 *     fish count in a watershed is not caused by one grant.
 *
 * This is why the two are forked at creation rather than distinguished by a
 * checkbox on one form: they need different fields, so they get different
 * shapes.
 */
export type MeasureKind = 'output' | 'outcome';

export const MEASURE_KINDS: {
  id: MeasureKind;
  name: string;
  /** What the measure records, in the author's terms. */
  description: string;
  /** Who files the record. */
  reportedBy: string;
  /** Whether a primary reported dimension is required. */
  requiresPrimaryDimension: boolean;
}[] = [
  {
    id: 'output',
    name: 'Output',
    description: 'work someone did — acres treated, barriers removed, hours contributed',
    reportedBy: 'the project',
    requiresPrimaryDimension: true,
  },
  {
    id: 'outcome',
    name: 'Outcome',
    description: 'a condition someone measured — survival rate, water temperature, fish density',
    reportedBy: 'a monitoring effort, about a place',
    requiresPrimaryDimension: false,
  },
];

export const measureKind = (id: MeasureKind) => MEASURE_KINDS.find((k) => k.id === id)!;

// ---------------------------------------------------------------------------
// The measure
// ---------------------------------------------------------------------------

/** How entries combine. Replaces a summable/not-summable flag, which is too coarse. */
export type CountingRule =
  | 'sum'
  | 'spatial-union'
  | 'distinct-places'
  | 'latest-per-place'
  | 'average-per-place';

export const COUNTING_RULES: {
  id: CountingRule;
  name: string;
  description: string;
  /** Which kinds of measure this rule is meaningful for. */
  appliesTo: MeasureKind[];
}[] = [
  {
    id: 'sum',
    name: 'Sum every entry',
    description: 'Work delivered. Ground treated twice counts twice — correct for effort and cost.',
    appliesTo: ['output'],
  },
  {
    id: 'spatial-union',
    name: 'Union the mapped extent',
    description: 'Ground in a treated condition. Treating the same acre twice counts once.',
    appliesTo: ['output'],
  },
  {
    id: 'distinct-places',
    name: 'Count distinct places',
    description: 'How many sites were reached, regardless of how much was done at each.',
    appliesTo: ['output'],
  },
  {
    id: 'latest-per-place',
    name: 'Most recent reading per place',
    description: 'The current condition. An older reading is superseded, never added to.',
    appliesTo: ['outcome'],
  },
  {
    id: 'average-per-place',
    name: 'Average across places',
    description: 'A typical condition over the places measured. Unweighted, so compare like sites.',
    appliesTo: ['outcome'],
  },
];

/** The rules worth offering for a given kind. Summing temperatures is not a choice. */
export const countingRulesFor = (kind: MeasureKind) =>
  COUNTING_RULES.filter((r) => r.appliesTo.includes(kind));

/**
 * Every unit a quantity can carry. CLOSED, because an open list cannot be
 * aggregated — `acres`, `Acres` and `ac` do not total.
 *
 * It has to be COMPLETE, though, and an earlier five-item shortlist was not: it
 * covered mapped restoration work and nothing else, so a water-quality, cost or
 * outreach measure hit a wall on the first question anyone asked. Anything this
 * list omits is a measure the product cannot express, so the bar for leaving
 * something out is high.
 */
export const UNITS = [
  // extent and length
  'acres', 'square feet', 'miles', 'linear feet',
  // counts
  'each', 'plants', 'people', 'events',
  // mass and load
  'pounds', 'tons', 'tons per year',
  // effort and money
  'hours', 'dollars',
  // condition readings — outcome measures live here
  'percent', 'degrees Celsius', 'cubic feet per second', 'parts per million',
] as const;
export type MeasureUnit = (typeof UNITS)[number];

export type MeasureStatus = 'Active' | 'Draft' | 'Retired';

export const MEASURE_STATUS_TONE: Record<MeasureStatus, 'default' | 'info' | 'primary' | 'success' | 'warning'> = {
  Active: 'success',
  Draft: 'info',
  Retired: 'default',
};

export interface PerformanceMeasureDefinition {
  slug: string;
  /** Output (work done) or outcome (a condition measured). Set at creation. */
  kind: MeasureKind;
  /** Empty until named — a measure exists before it is finished. */
  name: string;
  /** What counts toward this measure and what does not. */
  definition: string;
  /**
   * The plan goals this measure reports toward — ProjectFirma's classification
   * vocabulary, the same one projects associate with.
   *
   * A SET, NOT ONE BRANCH, and that is the whole reason it replaced `program`.
   * A program is where a project FILES; a classification is what it is FOR, and
   * one measure serves several at once — acres of riparian planting counts
   * toward habitat and toward water quality without being two measures. The old
   * single `program` forced a choice that the portfolio's real roll-up axis does
   * not ask for, and made "what did we buy toward salmon recovery" answerable
   * only by hand.
   *
   * Empty is a real state on a draft, and the one outstandingFields() flags.
   */
  classifications: Classification[];
  /** What is being counted, in words. "Treated extent", "Hours worked". */
  quantity: string;
  unit?: MeasureUnit;
  decimalPlaces: number;
  countingRule?: CountingRule;
  /** Every dimension, reported and derived alike, in reporting-form order. */
  dimensions: MeasureDimension[];
  /** Instruction shown at the moment a value is entered. */
  reporterGuidance: string;
  status: MeasureStatus;
  projectCount: number;
}

export const measures: PerformanceMeasureDefinition[] = [
  {
    // THE WORKED EXAMPLE. Two reported dimensions, four derived — so a reporter
    // answers three questions and the program can slice six ways.
    slug: 'acres-forest-fuels-reduction-treatment',
    kind: 'output',
    name: 'Acres of forest fuels reduction treatment',
    definition:
      'Acres where surface or ladder fuels were removed, rearranged, or consumed under an approved prescription. Measured as the extent actually treated, not the unit planned.',
    classifications: ['Wildfire resilience'],
    quantity: 'Treated extent',
    unit: 'acres',
    decimalPlaces: 0,
    countingRule: 'sum',
    dimensions: [
      {
        name: 'Treatment type',
        source: { kind: 'reported' },
        primary: true,
        options: ['Biomass removal', 'Broadcast burning', 'Pile burning', 'Mastication', 'Hand thinning'],
      },
      {
        // REPORTED, and it is the interesting one: Initial vs Maintenance is
        // derivable from the place's own history, but Planning and Completed are
        // programme judgements no record can supply. So the whole dimension stays
        // reported, and the form offers the derived answer as a prompt rather
        // than filling it in — see the reporting-form preview.
        name: 'Treatment phase',
        source: { kind: 'reported' },
        options: ['Planning', 'Initial', 'Maintenance', 'Completed', 'Unspecified'],
      },
      { name: 'Critical zone', source: { kind: 'spatial', ref: 'critical-zone' } },
      { name: 'Land ownership', source: { kind: 'spatial', ref: 'land-ownership' } },
      { name: 'Watershed', source: { kind: 'spatial', ref: 'watershed' } },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    reporterGuidance:
      'Report the extent that was actually treated, not the unit planned. A unit re-entered in a later season is a new entry for that season.',
    status: 'Active',
    projectCount: 7,
  },
  {
    slug: 'acres-riparian-habitat-restored',
    kind: 'output',
    name: 'Acres of riparian habitat restored',
    definition:
      'Acres within the streamside corridor where native vegetation was planted or released and the site has passed its first survival check.',
    classifications: ['Riparian & wetland habitat', 'Water quality'],
    quantity: 'Restored extent',
    unit: 'acres',
    decimalPlaces: 1,
    countingRule: 'spatial-union',
    dimensions: [
      {
        name: 'Treatment type',
        source: { kind: 'reported' },
        primary: true,
        options: ['Planting', 'Invasive removal', 'Natural recruitment'],
      },
      { name: 'Critical zone', source: { kind: 'spatial', ref: 'critical-zone' } },
      { name: 'Watershed', source: { kind: 'spatial', ref: 'watershed' } },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    reporterGuidance:
      'Count acres where planting is complete and the first survival check has passed. Do not count acres prepared but not yet planted.',
    status: 'Active',
    projectCount: 14,
  },
  {
    // THE COUNTER-EXAMPLE, and it is here on purpose: no place, so nothing
    // derives. Every dimension is reported and there are only two. A model that
    // only works for mapped ground is not a model.
    slug: 'volunteer-hours-contributed',
    kind: 'output',
    name: 'Volunteer hours contributed',
    definition: 'Hours worked on site by unpaid participants, from the signed field log for each work day.',
    classifications: ['Riparian & wetland habitat', 'Public access & recreation'],
    quantity: 'Hours worked',
    unit: 'hours',
    decimalPlaces: 0,
    countingRule: 'sum',
    dimensions: [
      {
        name: 'Activity',
        source: { kind: 'reported' },
        primary: true,
        options: ['Planting', 'Monitoring', 'Site preparation', 'Outreach event'],
      },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    reporterGuidance: 'Count hours on site from the signed field log. Travel and training time are not reported here.',
    status: 'Active',
    projectCount: 12,
  },
  {
    slug: 'fish-passage-barriers-removed',
    kind: 'output',
    name: 'Fish passage barriers removed',
    definition:
      'Structures no longer impeding passage at any life stage, confirmed by a post-construction passage assessment.',
    classifications: ['Salmon & steelhead recovery'],
    quantity: 'Barriers cleared',
    unit: 'each',
    decimalPlaces: 0,
    countingRule: 'distinct-places',
    dimensions: [
      {
        name: 'Barrier type',
        source: { kind: 'reported' },
        primary: true,
        options: ['Culvert', 'Dam', 'Weir', 'Push-up dam', 'Flashboard'],
      },
      { name: 'Watershed', source: { kind: 'spatial', ref: 'watershed' } },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    reporterGuidance:
      'Report a barrier once its passage assessment is signed. A barrier modified but still rated impassable does not count.',
    status: 'Active',
    projectCount: 9,
  },
  {
    // THE OUTCOME. Here to prove the fork is real rather than a label: it has no
    // primary dimension and no "what did you do", because nobody DID a survival
    // rate — it was measured. Its counting rule is one no output can use, and
    // its dimensions are conditions of the reading, not choices by an actor.
    slug: 'plant-survival-rate',
    kind: 'outcome',
    name: 'Plant survival rate',
    definition:
      'Share of installed plants alive at the survey, against the count installed on the same unit.',
    classifications: ['Riparian & wetland habitat'],
    quantity: 'Survival at survey',
    unit: 'percent',
    decimalPlaces: 0,
    countingRule: 'latest-per-place',
    dimensions: [
      {
        // Reported, but NOT primary — it qualifies a reading rather than naming
        // an action. An outcome has no primary dimension at all.
        name: 'Years since planting',
        source: { kind: 'reported' },
        options: ['Year 1', 'Year 3', 'Year 5'],
      },
      { name: 'Critical zone', source: { kind: 'spatial', ref: 'critical-zone' } },
      { name: 'Watershed', source: { kind: 'spatial', ref: 'watershed' } },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    reporterGuidance:
      'Survey the same units each year so the series stays comparable. Report the plot average, not a whole-site estimate.',
    status: 'Active',
    projectCount: 8,
  },
  {
    // TWO DRAFTS, ONE PER KIND. The create dialog routes to the one matching the
    // answer, so the fork is something you can SEE — you land on a different
    // shape depending on what you said. A single shared draft would have made
    // the question decorative, which is exactly the fault it replaced.
    slug: 'draft-untitled-output',
    kind: 'output',
    name: '',
    definition: '',
    // Empty, like every other field on a fresh draft — and empty is what
    // outstandingFields() flags, so a new measure starts one item short of
    // publishable rather than silently classified.
    classifications: [],
    quantity: '',
    decimalPlaces: 0,
    dimensions: [],
    reporterGuidance: '',
    status: 'Draft',
    projectCount: 0,
  },
  {
    slug: 'draft-untitled-outcome',
    kind: 'outcome',
    name: '',
    definition: '',
    classifications: [],
    quantity: '',
    decimalPlaces: 0,
    dimensions: [],
    reporterGuidance: '',
    status: 'Draft',
    projectCount: 0,
  },
];

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

/**
 * The classification vocabulary, re-exported from the projects module rather
 * than rebuilt: a measure and a project must offer the SAME list, or a roll-up
 * across the two silently splits a bucket. It replaced PROGRAMS, which was
 * derived the same way from `p.program`.
 */
export const CLASSIFICATIONS: Classification[] = [...classifications];

export const measureHref = (m: PerformanceMeasureDefinition): string =>
  `/prototypes/measures/${m.slug}`;

export const measureDisplayName = (m: PerformanceMeasureDefinition): string =>
  m.name.trim() || 'Untitled measure';

export const getMeasure = (slug: string): PerformanceMeasureDefinition | undefined =>
  measures.find((m) => m.slug === slug);

/** Dimensions the reporter has to answer. The measure's real cost. */
export const reportedDimensions = (m: PerformanceMeasureDefinition): MeasureDimension[] =>
  m.dimensions.filter((d) => d.source.kind === 'reported');

/** Dimensions the system fills in. The measure's leverage. */
export const derivedDimensions = (m: PerformanceMeasureDefinition): MeasureDimension[] =>
  m.dimensions.filter((d) => d.source.kind !== 'reported');

export const primaryDimension = (m: PerformanceMeasureDefinition): MeasureDimension | undefined =>
  m.dimensions.find((d) => d.primary);

/** Values a dimension can take, wherever they come from. */
export const dimensionValues = (d: MeasureDimension): string[] => {
  if (d.source.kind === 'reported') return d.options ?? [];
  if (d.source.kind === 'spatial') return GEO_LAYERS.find((l) => l.id === d.source.ref)?.values ?? [];
  if (d.source.kind === 'historical')
    return [...(HISTORICAL_RULES.find((r) => r.id === d.source.ref)?.values ?? [])];
  return [];
};

/** Human label for where a dimension's value comes from. */
export const sourceLabel = (d: MeasureDimension): string => {
  switch (d.source.kind) {
    case 'reported':
      return 'Reported';
    case 'spatial':
      return GEO_LAYERS.find((l) => l.id === d.source.ref)?.name ?? 'Map layer';
    case 'historical':
      return HISTORICAL_RULES.find((r) => r.id === d.source.ref)?.name ?? 'Entry history';
    case 'record':
      return RECORD_FIELDS.find((f) => f.id === d.source.ref)?.name ?? 'Record';
  }
};

export interface OutstandingField {
  label: string;
}

/** What still stands between this measure and being publishable. */
export const outstandingFields = (m: PerformanceMeasureDefinition): OutstandingField[] => {
  const missing: OutstandingField[] = [];
  if (!m.name.trim()) missing.push({ label: 'Measure name' });
  if (!m.definition.trim()) missing.push({ label: 'Definition' });
  if (m.classifications.length === 0) missing.push({ label: 'Classifications' });
  if (!m.quantity.trim()) missing.push({ label: 'Quantity' });
  if (!m.unit) missing.push({ label: 'Unit' });
  if (!m.countingRule) missing.push({ label: 'Counting rule' });
  // Only an OUTPUT needs one. An outcome has no actor to name, so demanding a
  // subcategory would block every outcome measure from ever publishing. The
  // label is the record section's own word for it, verbatim — the UI's one
  // noun for this concept is "subcategory"; "dimension" stays a data-model
  // term and "category" is retired.
  if (measureKind(m.kind).requiresPrimaryDimension && !primaryDimension(m)) {
    missing.push({ label: 'Primary subcategory' });
  }
  if (!m.reporterGuidance.trim()) missing.push({ label: 'Reporter guidance' });
  return missing;
};

export const isReadyToPublish = (m: PerformanceMeasureDefinition): boolean =>
  outstandingFields(m).length === 0;

/**
 * The readiness line rendered beside Save. ONE copy, shared by the page's
 * server render and the controller's live updates — two copies of this sentence
 * would drift, and the drifted one is always the one a reviewer reads.
 */
export const outstandingLine = (n: number): string =>
  n === 0 ? 'Ready to publish' : `${n} setting${n === 1 ? '' : 's'} needed before publishing`;

export const measuresByName = (): PerformanceMeasureDefinition[] =>
  [...measures].sort((a, b) => a.name.localeCompare(b.name));
