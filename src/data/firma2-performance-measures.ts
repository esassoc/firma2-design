// Performance measures, modelled on THE GRAMMAR OF A REPORTED RESULT:
//
//   "On this project, in this period, we accomplished [quantity] [unit] of
//    [concept] — [qualifier], [qualifier], …"
//
// A measure IS that sentence, declared once: a result concept, quantified by
// one or more ASPECTS (unit + precision + counting rule each), qualified by
// zero or more DIMENSIONS whose options come from SHARED VOCABULARIES. The
// grammar is not asserted — it is what five production tenant catalogs of the
// predecessor product reduce to (152 measures, 222 subcategories, 1,047
// options). The model, its evidence and its rules live in
// docs/measure-model.md; the constraints that shape this file:
//
//   1. ASPECTS ARE 1..n. The old one-unit-per-measure shape is why tenants
//      ship "(area)/(length)" clone families of one concept. The counting rule
//      lives ON the aspect, because an area can union where a count can only
//      sum.
//   2. VOCABULARIES ARE SHARED, REFERENCED, NEVER COPIED. The observed
//      catalogs paste the same option list onto up to 11 measures by hand and
//      the copies drift by typo — which silently splits roll-up buckets. A
//      reported dimension carries a vocabularyId, not its own options array.
//   3. THERE IS NO PRIMARY DIMENSION. There was, on the argument that "you
//      cannot report 20 acres without saying what you did" — but that job
//      belongs to the CONCEPT ("20 acres of fuels reduction" is already a
//      complete statement), and a forced dimension slot is exactly how 20% of
//      observed subcategory rows came to be Default/Default filler. Every
//      dimension is an optional qualifier.
//
// A dimension still carries a SOURCE — the one idea here that goes beyond the
// evidence (whose catalogs are 100% hand-reported). Four kinds, and the
// difference is who pays:
//
//   reported    — the person entering the record picks it.       COST: one choice
//   spatial     — a geospatial layer answers it, via the place.  COST: none
//   historical  — prior records on the same place answer it.     COST: none
//   record      — the project or the entry itself answers it.    COST: none
//
// Derived sources are the answer to the tension optionality creates: if
// tagging is optional and expensive, nobody tags and the portfolio cannot be
// sliced. So the system tags what it already knows, and humans are asked only
// what only humans know.
//
// A SPATIALLY DERIVED DIMENSION IS A SPLIT, NOT A LABEL. Twenty acres of
// biomass removal is not "in critical habitat" or "not" — it is 18 acres
// inside and 2 outside. A reported dimension resolves to one value; a spatial
// one resolves to an allocation.
//
// INVENTED CONTENT. Every measure, layer, vocabulary and option below is
// fabricated. Vocabulary is drawn from public fuels-and-restoration practice;
// the "imported standard" entries imitate the SHAPE of public standards
// (practice-code lists, species lists) with fabricated content. Nothing is
// copied from a client system or any ProjectFirma tenant. This repo and its
// site are public.
//
// DETERMINISTIC — literal arrays, no Math.random(), no Date.now().

import { classifications } from './firma2-projects';
import type { Classification } from './firma2-projects';

// ---------------------------------------------------------------------------
// Shared vocabularies — the option lists dimensions REFERENCE
// ---------------------------------------------------------------------------

/**
 * One tenant-level option list. `house` lists are authored by this tenant and
 * reused across measures; `imported` lists mirror an external standard, whose
 * name rides in `standard` so an author can tell "our words" from "the
 * state's words". Referenced by MeasureDimension.vocabularyId — never copied
 * onto a measure, which is what makes cross-measure rollups by the same axis
 * possible and kills the observed copy-drift failure.
 */
export interface Vocabulary {
  id: string;
  name: string;
  origin: 'house' | 'imported';
  /** The external standard an imported list mirrors. Absent on house lists. */
  standard?: string;
  options: string[];
}

export const VOCABULARIES: Vocabulary[] = [
  {
    id: 'fuels-treatment-types',
    name: 'Fuels treatment types',
    origin: 'house',
    options: ['Biomass removal', 'Broadcast burning', 'Pile burning', 'Mastication', 'Hand thinning'],
  },
  {
    id: 'treatment-phases',
    name: 'Treatment phases',
    origin: 'house',
    options: ['Planning', 'Initial', 'Maintenance', 'Completed', 'Unspecified'],
  },
  {
    id: 'riparian-treatments',
    name: 'Riparian treatments',
    origin: 'house',
    options: ['Planting', 'Invasive removal', 'Natural recruitment'],
  },
  {
    id: 'volunteer-activities',
    name: 'Volunteer activities',
    origin: 'house',
    options: ['Planting', 'Monitoring', 'Site preparation', 'Outreach event'],
  },
  {
    id: 'barrier-types',
    name: 'Barrier types',
    origin: 'house',
    options: ['Culvert', 'Dam', 'Weir', 'Push-up dam', 'Flashboard'],
  },
  {
    id: 'survey-intervals',
    name: 'Survey intervals',
    origin: 'house',
    options: ['Year 1', 'Year 3', 'Year 5'],
  },
  {
    id: 'restoration-actions',
    name: 'Restoration actions',
    origin: 'house',
    options: ['Created', 'Enhanced', 'Restored'],
  },
  {
    // The SHAPE of a practice-code standard — numbered entries an agency
    // publishes — with fabricated numbers and names, per the confidentiality
    // rule in the module header.
    id: 'conservation-practices',
    name: 'Conservation practice codes',
    origin: 'imported',
    standard: 'State conservation practice catalog',
    options: [
      '210 Brush management',
      '218 Prescribed burning',
      '341 Riparian planting',
      '355 Streambank protection',
      '362 In-channel structure',
      '410 Access control',
      '447 Tree and shrub establishment',
    ],
  },
  {
    // Public species names; the list itself is invented.
    id: 'focal-species',
    name: 'Focal species',
    origin: 'imported',
    standard: 'State special-status species list',
    options: [
      'Chinook salmon',
      'Steelhead',
      'Coho salmon',
      'Willow flycatcher',
      'Foothill yellow-legged frog',
      'Western pond turtle',
    ],
  },
];

/** Resolve a vocabulary id against the seeds plus any browser-local lists. */
export const getVocabulary = (id: string, extra: Vocabulary[] = []): Vocabulary | undefined =>
  VOCABULARIES.find((v) => v.id === id) ?? extra.find((v) => v.id === id);

// ---------------------------------------------------------------------------
// Dimension archetypes — the ~10 qualifier questions
// ---------------------------------------------------------------------------

/**
 * Every observed subcategory name (83 distinct, 222 uses) codes into one of
 * these questions. The archetype is CLASSIFICATION, not behaviour — it exists
 * so an author picking a new dimension is choosing from a closed set of
 * questions rather than inventing a taxonomy, and so future rollup surfaces
 * can group unlike-named dimensions that ask the same thing.
 */
export type DimensionArchetype =
  | 'object-kind'
  | 'activity-method'
  | 'land-tenure'
  | 'action-verb'
  | 'place-context'
  | 'species'
  | 'status-phase'
  | 'purpose'
  | 'regulatory-status'
  | 'audience';

export const DIMENSION_ARCHETYPES: {
  id: DimensionArchetype;
  /** The qualifier question, stated as the author would ask it. */
  question: string;
  example: string;
}[] = [
  { id: 'object-kind', question: 'What kind of thing?', example: 'habitat type, barrier type' },
  { id: 'activity-method', question: 'Done how, by what practice?', example: 'treatment type, practice code' },
  { id: 'land-tenure', question: 'On what kind of land?', example: 'ownership, land use' },
  { id: 'action-verb', question: 'What was done to it?', example: 'created / enhanced / restored' },
  { id: 'place-context', question: 'Where?', example: 'watershed, side of stream' },
  { id: 'species', question: 'For which species?', example: 'focal species' },
  { id: 'status-phase', question: 'At what stage?', example: 'treatment phase, survey year' },
  { id: 'purpose', question: 'Why?', example: 'project objective' },
  { id: 'regulatory-status', question: 'Under what legal status?', example: 'listing status' },
  { id: 'audience', question: 'For whom?', example: 'participant type' },
];

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
  /**
   * Which qualifier question this answers — see DIMENSION_ARCHETYPES.
   * Optional: derived dimensions get their meaning from their source, and a
   * draft dimension may not have declared one yet.
   */
  archetype?: DimensionArchetype;
  source: DimensionSource;
  /**
   * For `reported` dimensions: the SHARED vocabulary the reporter picks from.
   * A reference, never a copy — see rule 2 in the module header. Every other
   * source kind takes its values from the source it names.
   */
  vocabularyId?: string;
}

// ---------------------------------------------------------------------------
// The fork: what KIND of statement a measure makes
// ---------------------------------------------------------------------------

/**
 * An OUTPUT records what someone did. An OUTCOME records what is true.
 *
 * KEPT, KNOWINGLY, AGAINST THE GRAIN OF THE EVIDENCE. The grammar this module
 * is built on is output-shaped ("we accomplished…"), and the sampled exports
 * lacked the action/outcome field — so outcomes are the evidence's blind spot,
 * not its refutation. The fork still changes who reports, what a record must
 * carry, and which counting rules are meaningful: nobody "did" a water
 * temperature, summing readings is meaningless, and the record belongs to a
 * PLACE and a monitoring effort rather than to one grant. An outcome's
 * sentence reads "we measured", not "we accomplished".
 */
export type MeasureKind = 'output' | 'outcome';

export const MEASURE_KINDS: {
  id: MeasureKind;
  name: string;
  /** What the measure records, in the author's terms. */
  description: string;
  /** Who files the record. */
  reportedBy: string;
}[] = [
  {
    id: 'output',
    name: 'Output',
    description: 'work someone did — acres treated, barriers removed, hours contributed',
    reportedBy: 'the project',
  },
  {
    id: 'outcome',
    name: 'Outcome',
    description: 'a condition someone measured — survival rate, water temperature, fish density',
    reportedBy: 'a monitoring effort, about a place',
  },
];

export const measureKind = (id: MeasureKind) => MEASURE_KINDS.find((k) => k.id === id)!;

// ---------------------------------------------------------------------------
// Aspects — how a concept is quantified
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

/**
 * ONE way a concept is quantified. A measure carries 1..n of these — acres AND
 * linear feet AND a count of the same practice are one concept, not three
 * suffix-named clones. The counting rule is here rather than on the measure
 * because it is a property of the QUANTITY: a mapped area can be unioned, a
 * count of barriers can only be summed or de-duplicated by place.
 *
 * `unit` and `countingRule` are optional because a blank draft's first aspect
 * is legitimately empty — the same reasoning that made the old flat `unit`
 * optional. outstandingFields() is what makes emptiness cost something.
 */
export interface MeasureAspect {
  /** Stable within the measure; used by drafts and (later) by targets. */
  id: string;
  /** What is being counted, in words. "Treated extent", "Hours worked". */
  quantity: string;
  unit?: MeasureUnit;
  decimalPlaces: number;
  countingRule?: CountingRule;
}

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
   * toward habitat and toward water quality without being two measures.
   *
   * Empty is a real state on a draft, and one outstandingFields() flags.
   */
  classifications: Classification[];
  /** How the concept is quantified — 1..n. See MeasureAspect. */
  aspects: MeasureAspect[];
  /** Every dimension, reported and derived alike, in reporting-form order. ALL optional at entry. */
  dimensions: MeasureDimension[];
  /** Instruction shown at the moment a value is entered. */
  reporterGuidance: string;
  status: MeasureStatus;
  projectCount: number;
  /** Library provenance, when the measure was created from the concept library. */
  conceptId?: string;
  theme?: string;
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
    // TWO ASPECTS — the catalog's standing proof of the 1..n rule: one
    // concept, measured as ground covered AND material removed, where the old
    // model would have shipped "(area)/(tons)" clone measures.
    aspects: [
      {
        id: 'treated-extent',
        quantity: 'Treated extent',
        unit: 'acres',
        decimalPlaces: 0,
        countingRule: 'sum',
      },
      {
        id: 'biomass-removed',
        quantity: 'Biomass removed',
        unit: 'tons',
        decimalPlaces: 0,
        countingRule: 'sum',
      },
    ],
    dimensions: [
      {
        name: 'Treatment type',
        archetype: 'activity-method',
        source: { kind: 'reported' },
        vocabularyId: 'fuels-treatment-types',
      },
      {
        // REPORTED, and it is the interesting one: Initial vs Maintenance is
        // derivable from the place's own history, but Planning and Completed are
        // programme judgements no record can supply. So the whole dimension stays
        // reported, and the form offers the derived answer as a prompt rather
        // than filling it in — see the reporting-form preview.
        name: 'Treatment phase',
        archetype: 'status-phase',
        source: { kind: 'reported' },
        vocabularyId: 'treatment-phases',
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
    aspects: [
      {
        id: 'restored-extent',
        quantity: 'Restored extent',
        unit: 'acres',
        decimalPlaces: 1,
        countingRule: 'spatial-union',
      },
    ],
    dimensions: [
      {
        name: 'Treatment type',
        archetype: 'activity-method',
        source: { kind: 'reported' },
        vocabularyId: 'riparian-treatments',
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
    aspects: [
      {
        id: 'hours-worked',
        quantity: 'Hours worked',
        unit: 'hours',
        decimalPlaces: 0,
        countingRule: 'sum',
      },
    ],
    dimensions: [
      {
        name: 'Activity',
        archetype: 'activity-method',
        source: { kind: 'reported' },
        vocabularyId: 'volunteer-activities',
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
    aspects: [
      {
        id: 'barriers-cleared',
        quantity: 'Barriers cleared',
        unit: 'each',
        decimalPlaces: 0,
        countingRule: 'distinct-places',
      },
    ],
    dimensions: [
      {
        name: 'Barrier type',
        archetype: 'object-kind',
        source: { kind: 'reported' },
        vocabularyId: 'barrier-types',
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
    // THE OUTCOME. Here to prove the fork is real rather than a label: it has
    // no "what did you do", because nobody DID a survival rate — it was
    // measured. Its counting rule is one no output can use, and its dimensions
    // are conditions of the reading, not choices by an actor.
    slug: 'plant-survival-rate',
    kind: 'outcome',
    name: 'Plant survival rate',
    definition:
      'Share of installed plants alive at the survey, against the count installed on the same unit.',
    classifications: ['Riparian & wetland habitat'],
    aspects: [
      {
        id: 'survival-at-survey',
        quantity: 'Survival at survey',
        unit: 'percent',
        decimalPlaces: 0,
        countingRule: 'latest-per-place',
      },
    ],
    dimensions: [
      {
        // Reported — it qualifies a reading rather than naming an action.
        name: 'Years since planting',
        archetype: 'status-phase',
        source: { kind: 'reported' },
        vocabularyId: 'survey-intervals',
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
    // outstandingFields() flags, so a new measure starts short of publishable
    // rather than silently classified.
    classifications: [],
    // ONE BLANK ASPECT, NOT ZERO. A measure quantifies something by
    // definition (aspects are 1..n), so the empty state is an aspect with
    // nothing decided — which outstandingFields() flags field by field —
    // rather than the absence of the slot itself.
    aspects: [{ id: 'a1', quantity: '', decimalPlaces: 0 }],
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
    aspects: [{ id: 'a1', quantity: '', decimalPlaces: 0 }],
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

/**
 * THE ONE SANCTIONED `aspects[0]`. Several surfaces genuinely need a single
 * scale — the split chart's axis, the catalog's counting-rule column, the
 * preview's illustrative total — and v1 gives them the first aspect. Routing
 * every such read through this function keeps "which aspect is the headline"
 * one grep-able decision instead of a dozen inlined `[0]`s, and is where a
 * real "featured aspect" flag would land if one is ever needed.
 */
export const primaryAspect = (m: PerformanceMeasureDefinition): MeasureAspect | undefined =>
  m.aspects[0];

/** Dimensions the reporter has to answer. The measure's real cost. */
export const reportedDimensions = (m: PerformanceMeasureDefinition): MeasureDimension[] =>
  m.dimensions.filter((d) => d.source.kind === 'reported');

/** Dimensions the system fills in. The measure's leverage. */
export const derivedDimensions = (m: PerformanceMeasureDefinition): MeasureDimension[] =>
  m.dimensions.filter((d) => d.source.kind !== 'reported');

/**
 * Values a dimension can take, wherever they come from. `extra` carries
 * browser-local vocabularies (see src/lib/vocabulary-draft.ts) — the server
 * render never has any, the client may.
 */
export const dimensionValues = (d: MeasureDimension, extra: Vocabulary[] = []): string[] => {
  if (d.source.kind === 'reported')
    return d.vocabularyId ? getVocabulary(d.vocabularyId, extra)?.options ?? [] : [];
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

/**
 * What still stands between this measure and being publishable.
 *
 * PER-ASPECT, AND NOTHING ABOUT DIMENSIONS. Each aspect owes a quantity, a
 * unit and a counting rule; with more than one aspect the label says which,
 * because "Unit" alone would send the author to the wrong row. Dimensions are
 * deliberately absent: they are optional qualifiers now, and a gate that
 * demanded one is exactly the forcing function that filled the observed
 * catalogs with Default/Default filler (docs/measure-model.md, PM2). The old
 * "Primary subcategory" requirement is retired with the primary itself.
 */
export const outstandingFields = (m: PerformanceMeasureDefinition): OutstandingField[] => {
  // Page order — name, the About card (classifications, definition), then the
  // form card (guidance preamble, per-aspect fields) — so any rendering of
  // this list walks the column top to bottom.
  const missing: OutstandingField[] = [];
  if (!m.name.trim()) missing.push({ label: 'Measure name' });
  if (m.classifications.length === 0) missing.push({ label: 'Classifications' });
  if (!m.definition.trim()) missing.push({ label: 'Definition' });
  if (!m.reporterGuidance.trim()) missing.push({ label: 'Reporter guidance' });
  m.aspects.forEach((aspect, index) => {
    const at = m.aspects.length > 1 ? ` (amount ${index + 1})` : '';
    if (!aspect.quantity.trim()) missing.push({ label: `Quantity${at}` });
    if (!aspect.unit) missing.push({ label: `Unit${at}` });
    if (!aspect.countingRule) missing.push({ label: `Counting rule${at}` });
  });
  return missing;
};

export const isReadyToPublish = (m: PerformanceMeasureDefinition): boolean =>
  outstandingFields(m).length === 0;

/**
 * THE ANSWERABILITY LINE — what this measure costs a reporter and whether the
 * questions can actually be answered, as one quiet sentence of facts.
 *
 * This is the compliance loop (product brief §0) made visible at authoring
 * time: the admin's goal fails silently when the ask is heavy or unanswerable,
 * so the form editor keeps this line under the form. FACTS, not verdicts — no
 * score, no red ink. Two of the checks come straight from the evidence
 * (docs/measure-model.md): a question whose vocabulary has fewer than two real
 * options is the Default/Default filler pattern (PM2), and an escape option is
 * the forced-choice artifact (PM7) — reported as information, since 41% of
 * observed lists carry one and it is often the right call.
 *
 * `extra` carries browser-local vocabularies; the server render passes none.
 */
export const answerabilityLine = (
  m: PerformanceMeasureDefinition,
  extra: Vocabulary[] = [],
): string => {
  const asked = reportedDimensions(m);
  const free = derivedDimensions(m).length;
  const parts: string[] = [];

  parts.push(
    asked.length === 0
      ? 'Asks the reporter nothing beyond the amounts'
      : `Asks ${asked.length} question${asked.length === 1 ? '' : 's'} per entry`,
  );
  if (free > 0) parts.push(`${free} split${free === 1 ? '' : 's'} arrive free`);

  const unanswerable = asked.filter((d) => dimensionValues(d, extra).filter((o) => o.trim()).length < 2).length;
  if (unanswerable > 0)
    parts.push(`${unanswerable} question${unanswerable === 1 ? '' : 's'} without answerable options yet`);

  const ESCAPES = new Set(['unspecified', 'other', 'unknown', 'not applicable', 'n/a']);
  const withEscape = asked.filter((d) =>
    dimensionValues(d, extra).some((o) => ESCAPES.has(o.trim().toLowerCase())),
  ).length;
  if (withEscape > 0)
    parts.push(
      `${withEscape} list${withEscape === 1 ? '' : 's'} include${withEscape === 1 ? 's' : ''} an escape option`,
    );

  if (!m.reporterGuidance.trim()) parts.push('no reporter guidance yet');

  return `${parts.join(' · ')}.`;
};

/**
 * The readiness line rendered in the page header. ONE copy, shared by the
 * page's server render and the controller's live updates — two copies of this
 * sentence would drift, and the drifted one is always the one a reviewer reads.
 */
export const outstandingLine = (n: number): string =>
  n === 0 ? 'Ready to publish' : `${n} setting${n === 1 ? '' : 's'} needed before publishing`;

export const measuresByName = (): PerformanceMeasureDefinition[] =>
  [...measures].sort((a, b) => a.name.localeCompare(b.name));
