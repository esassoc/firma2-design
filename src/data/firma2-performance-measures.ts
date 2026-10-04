// Performance measures — a FLAT ATTRIBUTE LIST plus SUBCATEGORY SCHEMAS.
//
// A measure is one number a reporter files: a name, a type (output or
// outcome), classifications, a unit, a precision, a counting rule, guidance —
// and zero or more SUBCATEGORY SCHEMAS, the named option lists its entries can
// be divided by. The shape is what five production tenant catalogs of the
// predecessor product reduce to (152 measures, 222 subcategories, 1,047
// options); the evidence lives in docs/measure-model.md. Constraints:
//
//   1. A MEASURE IS ONE NUMBER. Every published name in the observed catalogs
//      names one figure ("Acres of riparian habitat restored"); the measure's
//      name IS the number's label, so there is no separate quantity label and
//      no repeatable amount slot.
//   2. SCHEMAS ARE SHARED, REFERENCED, NEVER COPIED. The observed catalogs
//      paste the same option list onto up to 11 measures by hand and the
//      copies drift by typo — which silently splits roll-up buckets. A measure
//      carries schema IDS; the options live on the schema, once.
//   3. NO SCHEMA IS REQUIRED. A forced subcategory slot is exactly how 20% of
//      observed subcategory rows came to be Default/Default filler.
//
// Schemas come in three origins, and the difference is who maintains the list:
//
//   user      — authored by this tenant, edited here, reusable across measures
//   imported  — mirrors an external standard; the standard's name rides along
//   system    — created and maintained by the system (map layers, the record's
//               own fields, entry history). Attachable like any other schema;
//               the system fills in the value, so it costs the reporter nothing.
//
// INVENTED CONTENT. Every measure, schema and option below is fabricated.
// Vocabulary is drawn from public fuels-and-restoration practice; the
// "imported standard" entries imitate the SHAPE of public standards with
// fabricated content. Nothing is copied from a client system or any
// ProjectFirma tenant. This repo and its site are public.
//
// DETERMINISTIC — literal arrays, no Math.random(), no Date.now().

import { classifications } from './firma2-projects';
import type { ClassificationName } from './firma2-projects';

// ---------------------------------------------------------------------------
// Subcategory schemas — the shared option lists measures reference
// ---------------------------------------------------------------------------

export type SchemaOrigin = 'user' | 'imported' | 'system';

/**
 * One named option list a measure's entries can be divided by. Referenced by
 * PerformanceMeasureDefinition.subcategorySchemaIds — never copied onto a
 * measure, which is what makes cross-measure rollups by the same axis possible
 * and kills the observed copy-drift failure.
 */
export interface SubcategorySchema {
  id: string;
  name: string;
  origin: SchemaOrigin;
  /** The external standard an imported list mirrors. Imported schemas only. */
  standard?: string;
  /** How the system answers it. System schemas only. */
  description?: string;
  /**
   * The values an entry can take. Empty on system schemas whose values come
   * from the record itself (every project name, every year) — an open list the
   * system resolves, not a blank one.
   */
  options: string[];
}

export const USER_SCHEMAS: SubcategorySchema[] = [
  {
    id: 'fuels-treatment-types',
    name: 'Fuels treatment types',
    origin: 'user',
    options: ['Biomass removal', 'Broadcast burning', 'Pile burning', 'Mastication', 'Hand thinning'],
  },
  {
    id: 'treatment-phases',
    name: 'Treatment phases',
    origin: 'user',
    options: ['Planning', 'Initial', 'Maintenance', 'Completed', 'Unspecified'],
  },
  {
    id: 'riparian-treatments',
    name: 'Riparian treatments',
    origin: 'user',
    options: ['Planting', 'Invasive removal', 'Natural recruitment'],
  },
  {
    id: 'volunteer-activities',
    name: 'Volunteer activities',
    origin: 'user',
    options: ['Planting', 'Monitoring', 'Site preparation', 'Outreach event'],
  },
  {
    id: 'barrier-types',
    name: 'Barrier types',
    origin: 'user',
    options: ['Culvert', 'Dam', 'Weir', 'Push-up dam', 'Flashboard'],
  },
  {
    id: 'survey-intervals',
    name: 'Survey intervals',
    origin: 'user',
    options: ['Year 1', 'Year 3', 'Year 5'],
  },
  {
    id: 'restoration-actions',
    name: 'Restoration actions',
    origin: 'user',
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

/**
 * The system-maintained schemas. Each is a question the system can already
 * answer — from a geospatial layer, from the record's own fields, or from
 * earlier entries on the same place — so attaching one costs the reporter
 * nothing. Read-only: their options are maintained with the source they read.
 */
export const SYSTEM_SCHEMAS: SubcategorySchema[] = [
  {
    id: 'system-critical-zone',
    name: 'Critical zone',
    origin: 'system',
    description: 'Answered from the map — designations the program treats as priority ground.',
    options: ['Critical habitat', 'Critical headwater resources', 'Recreation area', 'Unspecified', 'None'],
  },
  {
    id: 'system-land-ownership',
    name: 'Land ownership',
    origin: 'system',
    description: 'Answered from the map — surface ownership from the statewide parcel layer.',
    options: ['Federal', 'State', 'Private', 'Tribal', 'Unknown'],
  },
  {
    id: 'system-watershed',
    name: 'Watershed',
    origin: 'system',
    description: 'Answered from the map — the HUC-12 subwatershed containing the treated extent.',
    options: ['North Yuba', 'Middle Fork Feather', 'Upper Butte', 'Deer Creek', 'Battle Creek'],
  },
  {
    id: 'system-county',
    name: 'County',
    origin: 'system',
    description: 'Answered from the map — the county boundary containing the treated extent.',
    options: ['Butte', 'Nevada', 'Plumas', 'Sierra', 'Tehama', 'Yuba'],
  },
  {
    id: 'system-initial-vs-maintenance',
    name: 'Initial vs maintenance',
    origin: 'system',
    description:
      'Answered from entry history — the first entry on a place is Initial; a re-entry inside the program window is Maintenance.',
    options: ['Initial', 'Maintenance'],
  },
  {
    id: 'system-first-treatment-year',
    name: 'First treated',
    origin: 'system',
    description: 'Answered from entry history — the year this place first appeared in any entry.',
    options: [],
  },
  {
    id: 'system-reporting-year',
    name: 'Reporting year',
    origin: 'system',
    description: "Answered from the record — the entry's own date.",
    options: [],
  },
  {
    id: 'system-project',
    name: 'Project',
    origin: 'system',
    description: 'Answered from the record — the project the entry belongs to.',
    options: [],
  },
  {
    id: 'system-lead-organization',
    name: 'Lead organization',
    origin: 'system',
    description: "Answered from the record — the project's lead organization.",
    options: [],
  },
  {
    id: 'system-primary-classification',
    name: 'Primary classification',
    origin: 'system',
    description: "Answered from the record — the project's first classification.",
    options: [],
  },
];

/** Every seeded schema, user-authored first. Browser-local ones layer on via src/lib/schema-draft.ts. */
export const SCHEMAS: SubcategorySchema[] = [...USER_SCHEMAS, ...SYSTEM_SCHEMAS];

/**
 * Resolve a schema id against the seeds plus any browser-local schemas.
 * LOCAL WINS: a browser-local schema with a seed's id is that seed EDITED, and
 * the edit has to show everywhere the schema is read or "editable" is a lie.
 */
export const getSchema = (id: string, extra: SubcategorySchema[] = []): SubcategorySchema | undefined =>
  extra.find((s) => s.id === id) ?? SCHEMAS.find((s) => s.id === id);

export const SCHEMA_ORIGIN_LABEL: Record<SchemaOrigin, string> = {
  user: 'User',
  imported: 'Imported',
  system: 'System',
};

// ---------------------------------------------------------------------------
// The type fork: what KIND of statement a measure makes
// ---------------------------------------------------------------------------

/**
 * An OUTPUT records what someone did. An OUTCOME records what is true.
 * The fork changes who reports, and which counting rules are meaningful:
 * nobody "did" a water temperature, and summing readings is meaningless.
 * Displayed as "Type" everywhere a reader sees it.
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

export const kindName = (id: MeasureKind): string => measureKind(id).name;

export const kindFromName = (name: string): MeasureKind | undefined =>
  MEASURE_KINDS.find((k) => k.name === name.trim())?.id;

// ---------------------------------------------------------------------------
// The number — how a measure is quantified
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
 * aggregated — `acres`, `Acres` and `ac` do not total. It has to be COMPLETE,
 * though: anything this list omits is a measure the product cannot express, so
 * the bar for leaving something out is high.
 */
export const UNITS = [
  // extent and length
  'acres', 'square feet', 'miles', 'linear feet',
  // counts
  'each', 'plants', 'people', 'events',
  // mass and load
  'pounds', 'tons', 'tons per year',
  // water
  'acre-feet per year',
  // effort and money
  'hours', 'dollars',
  // condition readings — outcome measures live here
  'percent', 'degrees Celsius', 'cubic feet per second', 'parts per million',
] as const;
export type MeasureUnit = (typeof UNITS)[number];

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

export type MeasureStatus = 'Active' | 'Draft' | 'Retired';

export const MEASURE_STATUSES: MeasureStatus[] = ['Draft', 'Active', 'Retired'];

export const MEASURE_STATUS_TONE: Record<MeasureStatus, 'default' | 'info' | 'primary' | 'success' | 'warning'> = {
  Active: 'success',
  Draft: 'info',
  Retired: 'default',
};

// ---------------------------------------------------------------------------
// The measure
// ---------------------------------------------------------------------------

export interface PerformanceMeasureDefinition {
  slug: string;
  /** Output (work done) or outcome (a condition measured). Shown as "Type". */
  kind: MeasureKind;
  /** Empty until named — a measure exists before it is finished. */
  name: string;
  /** What counts toward this measure and what does not. */
  definition: string;
  /**
   * The plan goals this measure reports toward — ProjectFirma's classification
   * vocabulary, the same one projects associate with. A SET: one measure
   * serves several goals at once. Empty is a real state on a draft, and one
   * outstandingFields() flags.
   */
  classifications: ClassificationName[];
  /**
   * THE NUMBER. A measure is one figure a reporter types, so the unit, its
   * precision and its counting rule sit directly on the measure. `unit` and
   * `countingRule` are optional because a blank draft has decided neither;
   * outstandingFields() is what makes emptiness cost something.
   */
  unit?: MeasureUnit;
  decimalPlaces: number;
  countingRule?: CountingRule;
  /**
   * The subcategory schemas whose lists divide this measure's entries, in
   * reporting order. REFERENCES, never copies — see rule 2 in the module
   * header. System schemas mix in freely; their origin says who answers.
   */
  subcategorySchemaIds: string[];
  /** Instruction shown at the moment a value is entered. */
  reporterGuidance: string;
  status: MeasureStatus;
}

export const measures: PerformanceMeasureDefinition[] = [
  {
    slug: 'acres-forest-fuels-reduction-treatment',
    kind: 'output',
    name: 'Acres of forest fuels reduction treatment',
    definition:
      'Acres where surface or ladder fuels were removed, rearranged, or consumed under an approved prescription. Measured as the extent actually treated, not the unit planned.',
    classifications: ['Wildfire resilience', 'Forest thinning'],
    unit: 'acres',
    decimalPlaces: 0,
    countingRule: 'sum',
    subcategorySchemaIds: [
      'fuels-treatment-types',
      'treatment-phases',
      'system-critical-zone',
      'system-land-ownership',
      'system-watershed',
      'system-reporting-year',
    ],
    reporterGuidance:
      'Report the extent that was actually treated, not the unit planned. A unit re-entered in a later season is a new entry for that season.',
    status: 'Active',
  },
  {
    slug: 'tons-biomass-removed-fuels-treatment',
    kind: 'output',
    name: 'Tons of biomass removed in fuels treatment',
    definition:
      'Woody material hauled off the treatment unit, weighed at the landing. Material chipped or lopped and scattered on site stays on site and is not counted here.',
    classifications: ['Wildfire resilience'],
    unit: 'tons',
    decimalPlaces: 0,
    countingRule: 'sum',
    // No treatment-phases here: phase divides acres meaningfully but says
    // nothing about tonnage. Per-measure schema sets are the point.
    subcategorySchemaIds: [
      'fuels-treatment-types',
      'system-land-ownership',
      'system-watershed',
      'system-reporting-year',
    ],
    reporterGuidance:
      'Report the weight ticketed at the landing. Estimates scaled from acreage are not reportable here.',
    status: 'Active',
  },
  {
    slug: 'acres-riparian-habitat-restored',
    kind: 'output',
    name: 'Acres of riparian habitat restored',
    definition:
      'Acres within the streamside corridor where native vegetation was planted or released and the site has passed its first survival check.',
    classifications: ['Riparian & wetland habitat', 'Water quality'],
    unit: 'acres',
    decimalPlaces: 1,
    countingRule: 'spatial-union',
    subcategorySchemaIds: [
      'riparian-treatments',
      'system-critical-zone',
      'system-watershed',
      'system-reporting-year',
    ],
    reporterGuidance:
      'Count acres where planting is complete and the first survival check has passed. Do not count acres prepared but not yet planted.',
    status: 'Active',
  },
  {
    // THE COUNTER-EXAMPLE, on purpose: no place, so nothing spatial. One user
    // schema and one record fact. A model that only works for mapped ground is
    // not a model.
    slug: 'volunteer-hours-contributed',
    kind: 'output',
    name: 'Volunteer hours contributed',
    definition: 'Hours worked on site by unpaid participants, from the signed field log for each work day.',
    classifications: ['Riparian & wetland habitat', 'Public access & recreation'],
    unit: 'hours',
    decimalPlaces: 0,
    countingRule: 'sum',
    subcategorySchemaIds: ['volunteer-activities', 'system-reporting-year'],
    reporterGuidance: 'Count hours on site from the signed field log. Travel and training time are not reported here.',
    status: 'Active',
  },
  {
    slug: 'fish-passage-barriers-removed',
    kind: 'output',
    name: 'Fish passage barriers removed',
    definition:
      'Structures no longer impeding passage at any life stage, confirmed by a post-construction passage assessment.',
    classifications: ['Salmon & steelhead recovery', 'Barrier removal & fish screens'],
    unit: 'each',
    decimalPlaces: 0,
    countingRule: 'distinct-places',
    subcategorySchemaIds: ['barrier-types', 'system-watershed', 'system-reporting-year'],
    reporterGuidance:
      'Report a barrier once its passage assessment is signed. A barrier modified but still rated impassable does not count.',
    status: 'Active',
  },
  {
    // THE OUTCOME. Here to prove the fork is real rather than a label: nobody
    // DID a survival rate — it was measured, and its counting rule is one no
    // output can use.
    slug: 'plant-survival-rate',
    kind: 'outcome',
    name: 'Plant survival rate',
    definition:
      'Share of installed plants alive at the survey, against the count installed on the same unit.',
    classifications: ['Riparian & wetland habitat'],
    unit: 'percent',
    decimalPlaces: 0,
    countingRule: 'latest-per-place',
    subcategorySchemaIds: [
      'survey-intervals',
      'system-critical-zone',
      'system-watershed',
      'system-reporting-year',
    ],
    reporterGuidance:
      'Survey the same units each year so the series stays comparable. Report the plot average, not a whole-site estimate.',
    status: 'Active',
  },
  // ---- KPIs added so every goal is tracked (2026-10-03). A classification is
  // a goal; the measures that list it are its KPIs, two to five each. Work
  // types carry none: they are becoming tags, which track without KPIs. ----
  {
    slug: 'native-plants-installed',
    kind: 'output',
    name: 'Native plants installed',
    definition: 'Container stock, cuttings and stakes of native species set in the ground. Seed is reported by weight elsewhere, not here.',
    classifications: ['Riparian & wetland habitat', 'Native planting'],
    unit: 'plants',
    decimalPlaces: 0,
    countingRule: 'sum',
    subcategorySchemaIds: ['riparian-treatments', 'system-watershed', 'system-reporting-year'],
    reporterGuidance: 'Count plants installed this season, including replacements for losses. Survival is a separate measure.',
    status: 'Active',
  },
  {
    slug: 'stream-miles-reopened',
    kind: 'output',
    name: 'Stream miles reopened to fish',
    definition: 'Miles of stream upstream of a fixed or removed barrier that migrating fish can now reach, to the next barrier or the natural limit.',
    classifications: ['Salmon & steelhead recovery'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'spatial-union',
    subcategorySchemaIds: ['barrier-types', 'system-watershed', 'system-reporting-year'],
    reporterGuidance: 'Measure to the next barrier upstream, not to the headwaters. Report a reach once, the year its barrier is cleared.',
    status: 'Active',
  },
  {
    slug: 'miles-fuel-break',
    kind: 'output',
    name: 'Miles of fuel break completed',
    definition: 'Shaded or cleared fuel break built to its prescribed width along a ridge, road or community edge.',
    classifications: ['Wildfire resilience', 'Fuel breaks'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'spatial-union',
    subcategorySchemaIds: ['treatment-phases', 'system-land-ownership', 'system-reporting-year'],
    reporterGuidance: 'Report a segment once it meets prescribed width end to end. Maintenance passes are entered as maintenance, not new miles.',
    status: 'Active',
  },
  {
    slug: 'acres-wetland-meadow-restored',
    kind: 'output',
    name: 'Acres of wetland and meadow restored',
    definition: 'Acres of tidal marsh, wet meadow or seasonal wetland where hydrology was restored and wetland vegetation is establishing.',
    classifications: ['Riparian & wetland habitat', 'Flood risk reduction', 'Meadow & marsh rewetting'],
    unit: 'acres',
    decimalPlaces: 0,
    countingRule: 'spatial-union',
    subcategorySchemaIds: ['restoration-actions', 'system-watershed', 'system-reporting-year'],
    reporterGuidance: 'Count acres once water is back on the ground — breach open, plugs in, or channel raised. Graded but still dry ground is not reported yet.',
    status: 'Active',
  },
  {
    slug: 'stream-miles-floodplain-reconnected',
    kind: 'output',
    name: 'Stream miles reconnected to floodplain',
    definition: 'Miles of channel that now spill onto their floodplain at a typical winter high flow.',
    classifications: ['Water supply reliability'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'spatial-union',
    subcategorySchemaIds: ['restoration-actions', 'system-watershed', 'system-reporting-year'],
    reporterGuidance: 'Report the reach once the first overbank flow is observed or modeled at the design discharge.',
    status: 'Active',
  },
  {
    slug: 'stream-miles-instream-habitat',
    kind: 'output',
    name: 'Stream miles of instream habitat improved',
    definition: 'Miles of channel where wood, gravel, pools or side channels were added to give fish places to spawn, rear or hold.',
    classifications: ['Salmon & steelhead recovery', 'Instream habitat structures'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'spatial-union',
    subcategorySchemaIds: ['restoration-actions', 'focal-species', 'system-watershed', 'system-reporting-year'],
    reporterGuidance: 'Measure the treated reach along the thalweg. A reach treated again in a later year is not new miles.',
    status: 'Active',
  },
  {
    slug: 'acres-floodplain-habitat',
    kind: 'output',
    name: 'Acres of floodplain habitat reconnected',
    definition: 'Acres of floodplain, side channel or off-channel rearing habitat that floods at the design flow.',
    classifications: ['Flood risk reduction', 'Salmon & steelhead recovery', 'Side channels & floodplains'],
    unit: 'acres',
    decimalPlaces: 0,
    countingRule: 'spatial-union',
    subcategorySchemaIds: ['restoration-actions', 'system-watershed', 'system-reporting-year'],
    reporterGuidance: 'Count acres inside the inundation boundary at the design flow, from the as-built survey.',
    status: 'Active',
  },
  {
    slug: 'tons-sediment-prevented',
    kind: 'output',
    name: 'Tons of fine sediment prevented per year',
    definition: 'Estimated annual load of fine sediment kept out of the stream by a stabilized bank, upgraded crossing or treated road.',
    classifications: ['Water quality', 'Erosion & sediment control'],
    unit: 'tons per year',
    decimalPlaces: 0,
    countingRule: 'sum',
    subcategorySchemaIds: ['conservation-practices', 'system-watershed', 'system-reporting-year'],
    reporterGuidance: 'Use the approved load-reduction calculator for the practice. Report once, the year the practice is complete.',
    status: 'Active',
  },
  {
    slug: 'miles-road-decommissioned',
    kind: 'output',
    name: 'Miles of road decommissioned',
    definition: 'Miles of unpaved road ripped, outsloped and closed so it no longer routes runoff and sediment to streams.',
    classifications: ['Water quality'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    subcategorySchemaIds: ['system-land-ownership', 'system-watershed', 'system-reporting-year'],
    reporterGuidance: 'Report miles once the closure is complete and crossings are pulled. Seasonal gates do not count.',
    status: 'Active',
  },
  {
    slug: 'stormwater-captured',
    kind: 'output',
    name: 'Stormwater captured per year',
    definition: 'Estimated average annual runoff held, infiltrated or treated before it reaches a stream.',
    classifications: ['Water quality', 'Stormwater capture'],
    unit: 'acre-feet per year',
    decimalPlaces: 0,
    countingRule: 'sum',
    subcategorySchemaIds: ['conservation-practices', 'system-watershed', 'system-reporting-year'],
    reporterGuidance: 'Use the design capture volume for an average rainfall year, not the largest storm.',
    status: 'Active',
  },
  {
    slug: 'water-supply-gained',
    kind: 'output',
    name: 'Water supply gained per year',
    definition: 'Acre-feet added to dry-season supply each year — by raised groundwater, new storage, or water use avoided.',
    classifications: ['Water supply reliability', 'Groundwater recharge'],
    unit: 'acre-feet per year',
    decimalPlaces: 0,
    countingRule: 'sum',
    subcategorySchemaIds: ['restoration-actions', 'system-watershed', 'system-reporting-year'],
    reporterGuidance: 'Report the modeled average-year gain once the work is complete. Do not add a site again for a wet year.',
    status: 'Active',
  },
  {
    slug: 'miles-levee-setback',
    kind: 'output',
    name: 'Miles of levee set back',
    definition: 'Miles of levee moved back from the channel to give high water room, measured along the old alignment.',
    classifications: ['Flood risk reduction'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    subcategorySchemaIds: ['system-land-ownership', 'system-watershed', 'system-reporting-year'],
    reporterGuidance: 'Report once the new levee is certified and the old one is breached.',
    status: 'Active',
  },
  {
    slug: 'miles-trail-opened',
    kind: 'output',
    name: 'Miles of trail and greenway opened',
    definition: 'Miles of trail, greenway or river access route opened to the public.',
    classifications: ['Public access & recreation'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    subcategorySchemaIds: ['system-land-ownership', 'system-reporting-year'],
    reporterGuidance: 'Report miles the day the route opens to the public, not when construction ends.',
    status: 'Active',
  },
];

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

/**
 * The classification vocabulary, re-exported from the projects module rather
 * than rebuilt: a measure and a project must offer the SAME list, or a roll-up
 * across the two silently splits a bucket.
 */
export const CLASSIFICATION_NAMES: ClassificationName[] = [...classifications];

export const measureDisplayName = (m: PerformanceMeasureDefinition): string =>
  m.name.trim() || 'Untitled measure';

export const getMeasure = (slug: string): PerformanceMeasureDefinition | undefined =>
  measures.find((m) => m.slug === slug);

/**
 * A fresh, entirely undecided measure — what the blank sidesheet edits.
 * Everything empty is a field outstandingFields() flags, so a new measure
 * starts short of publishable rather than silently classified.
 */
export const blankMeasure = (slug: string): PerformanceMeasureDefinition => ({
  slug,
  kind: 'output',
  name: '',
  definition: '',
  classifications: [],
  decimalPlaces: 0,
  subcategorySchemaIds: [],
  reporterGuidance: '',
  status: 'Draft',
});

/**
 * This measure's schemas, resolved and in its own order. Ids that resolve to
 * nothing (a local schema on another browser) are dropped rather than rendered
 * as holes. `extra` carries browser-local schemas; server renders pass none.
 */
export const schemasFor = (
  m: PerformanceMeasureDefinition,
  extra: SubcategorySchema[] = [],
): SubcategorySchema[] =>
  m.subcategorySchemaIds
    .map((id) => getSchema(id, extra))
    .filter((s): s is SubcategorySchema => Boolean(s));

/** The schemas a reporter answers by hand. The measure's real cost. */
export const reportedSchemas = (
  m: PerformanceMeasureDefinition,
  extra: SubcategorySchema[] = [],
): SubcategorySchema[] => schemasFor(m, extra).filter((s) => s.origin !== 'system');

/** The schemas the system fills in. The measure's leverage. */
export const systemSchemas = (
  m: PerformanceMeasureDefinition,
  extra: SubcategorySchema[] = [],
): SubcategorySchema[] => schemasFor(m, extra).filter((s) => s.origin === 'system');

/** The measures whose entries a schema divides. Backs the "Used by" column. */
export const measuresUsingSchema = (
  schemaId: string,
  list: PerformanceMeasureDefinition[] = measures,
): PerformanceMeasureDefinition[] => list.filter((m) => m.subcategorySchemaIds.includes(schemaId));

/**
 * THE DISPLAY STRINGS the form's selects trade in, and the maps back to
 * storage. One spelling per fact: what the select offers is what the table
 * and the resting form show.
 */
export const DECIMALS_LABELS = [
  'Whole numbers',
  '1 decimal place',
  '2 decimal places',
  '3 decimal places',
] as const;

export const decimalsLabel = (n: number): string => DECIMALS_LABELS[n] ?? DECIMALS_LABELS[0];

/** Unknown text falls back to 0 — a hand-edited DOM must not store NaN. */
export const decimalsFromLabel = (label: string): number => {
  const i = (DECIMALS_LABELS as readonly string[]).indexOf(label.trim());
  return i < 0 ? 0 : i;
};

export const countingRuleName = (id: CountingRule | undefined): string =>
  id ? COUNTING_RULES.find((r) => r.id === id)?.name ?? '' : '';

export const countingRuleFromName = (name: string): CountingRule | undefined =>
  COUNTING_RULES.find((r) => r.name === name.trim())?.id;

/** A unit is stored as its own display string, so this is only a guard. */
export const unitFromLabel = (label: string): MeasureUnit | undefined =>
  (UNITS as readonly string[]).includes(label.trim()) ? (label.trim() as MeasureUnit) : undefined;

export interface OutstandingField {
  label: string;
}

/**
 * What still stands between this measure and Active.
 *
 * SIX FIELDS, AND NOTHING ABOUT SCHEMAS. Schemas are deliberately absent: they
 * are optional, and a gate that demanded one is exactly the forcing function
 * that filled the observed catalogs with Default/Default filler
 * (docs/measure-model.md, PM2).
 */
export const outstandingFields = (m: PerformanceMeasureDefinition): OutstandingField[] => {
  // Form order, so any rendering of this list walks the sheet top to bottom.
  const missing: OutstandingField[] = [];
  if (!m.name.trim()) missing.push({ label: 'Measure name' });
  if (m.classifications.length === 0) missing.push({ label: 'Classifications' });
  if (!m.definition.trim()) missing.push({ label: 'Definition' });
  if (!m.unit) missing.push({ label: 'Unit' });
  if (!m.countingRule) missing.push({ label: 'Counting rule' });
  if (!m.reporterGuidance.trim()) missing.push({ label: 'Reporter guidance' });
  return missing;
};

export const isReadyToActivate = (m: PerformanceMeasureDefinition): boolean =>
  outstandingFields(m).length === 0;

export const measuresByName = (): PerformanceMeasureDefinition[] =>
  [...measures].sort((a, b) => a.name.localeCompare(b.name));
