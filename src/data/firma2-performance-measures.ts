// Performance measures — a FLAT ATTRIBUTE LIST plus BREAKDOWNS.
//
// A measure is one number a reporter files: a name, the claim it answers,
// classifications, a unit, a precision, whether its values add up,
// guidance — and zero or more BREAKDOWNS, each a question with a closed
// option list that a reporter answers alongside the number.
//
// RECONCILED WITH PM 2 (user, 2026-10-09). The shape follows projectfirma2's
// build (src/data/firma2-pm2.ts, branch features/0010) wherever the two
// differed, except which breakdown takes several picks and what publishing
// freezes:
//
//   - Status reads Draft · Published · Retired.
//   - NO THEME, unlike the branch. It came in with the reconciliation and
//     went the same day (user, 2026-10-09): beside classifications it was a
//     second, near-identical picker ("Riparian habitat" next to "Riparian &
//     wetland habitat") that nothing used. Classifications group measures.
//   - The author's CLAIM — "what do you need to tell your funder?" — is kept
//     on the measure, not only used to draft it.
//   - The counting rule is the branch's yes/no: SUMS or DOES NOT SUM. The
//     output/outcome type and the five finer rules are gone.
//   - Breakdowns are OWNED by their measure — no shared lists, no imported
//     standards, no system-answered lists. This reverses the shared-schema
//     rule this module used to state (docs/measure-model.md rule 2); the team
//     chose the branch's simpler model, copy drift included.
//   - "Unspecified" is appended to every breakdown — added, never demanded.
//   - Reporting periods are tenant-wide records with real dates, shown by name.
//
// The evidence behind the original model is still docs/measure-model.md.
//
// INVENTED CONTENT. Every measure, breakdown and option below is fabricated.
// Nothing is copied from a client system or any ProjectFirma tenant. This repo
// and its site are public.
//
// DETERMINISTIC — literal arrays, no Math.random(), no Date.now().

import { classifications } from './firma2-projects';
import type { ClassificationName } from './firma2-projects';

// ---------------------------------------------------------------------------
// Breakdowns — the questions a reporter answers alongside the number
// ---------------------------------------------------------------------------

/** The escape option every breakdown carries. Added on save, never demanded. */
export const UNSPECIFIED = 'Unspecified';

/**
 * One question a measure's entries are broken down by, with its closed list.
 * Owned by its measure: editing it changes this measure and nothing else.
 */
export interface Breakdown {
  id: string;
  /** The question, as the reporter reads it. "Treatment type". */
  question: string;
  /** The choices, in the order offered. */
  options: string[];
  /**
   * Options retired on a published measure: kept in `options` so past entries
   * still read, never offered for a new entry.
   */
  retiredOptions?: string[];
  /**
   * Retired on a published measure: no longer asked, past answers kept.
   * A published measure cannot drop a question its entries already answer.
   */
  retired?: boolean;
}

/** Append Unspecified when a list lacks it (case-insensitive). Never removes anything. */
export const withUnspecified = (options: string[]): string[] =>
  options.length === 0 || options.some((o) => o.trim().toLowerCase() === UNSPECIFIED.toLowerCase())
    ? options
    : [...options, UNSPECIFIED];

/** The options a NEW entry may pick: every option but the retired ones. */
export const liveOptions = (b: Pick<Breakdown, 'options' | 'retiredOptions'>): string[] =>
  b.options.filter((o) => !b.retiredOptions?.includes(o));

/**
 * The seed lists, kept here only to build the seed measures' OWN copies —
 * nothing references them at runtime. The two "imported" ones imitate the
 * shape of public standards with fabricated content.
 */
const SEED_LISTS: Record<string, { question: string; options: string[] }> = {
  'fuels-treatment-types': { question: 'Treatment type', options: ['Biomass removal', 'Broadcast burning', 'Pile burning', 'Mastication', 'Hand thinning'] },
  'treatment-phases': { question: 'Treatment phase', options: ['Planning', 'Initial', 'Maintenance', 'Completed'] },
  'riparian-treatments': { question: 'Riparian treatment', options: ['Planting', 'Invasive removal', 'Natural recruitment'] },
  'volunteer-activities': { question: 'Activity type', options: ['Planting', 'Monitoring', 'Site preparation', 'Outreach event'] },
  'barrier-types': { question: 'Barrier type', options: ['Culvert', 'Dam', 'Weir', 'Push-up dam', 'Flashboard'] },
  'survey-intervals': { question: 'Survey interval', options: ['Year 1', 'Year 3', 'Year 5'] },
  'restoration-actions': { question: 'Restoration action', options: ['Created', 'Enhanced', 'Restored'] },
  'conservation-practices': {
    question: 'Conservation practice',
    options: ['210 Brush management', '218 Prescribed burning', '341 Riparian planting', '355 Streambank protection', '362 In-channel structure', '410 Access control', '447 Tree and shrub establishment'],
  },
  'focal-species': { question: 'Focal species', options: ['Chinook salmon', 'Steelhead', 'Coho salmon', 'Willow flycatcher', 'Foothill yellow-legged frog', 'Western pond turtle'] },
};

/** A seed measure's own copies of the named lists, Unspecified appended. */
let seedBreakdownSeq = 0;
const owned = (...ids: string[]): Breakdown[] =>
  ids.map((id) => ({
    id: `bd-${(seedBreakdownSeq += 1)}`,
    question: SEED_LISTS[id].question,
    options: withUnspecified([...SEED_LISTS[id].options]),
  }));

// ---------------------------------------------------------------------------
// The number — how a measure is quantified
// ---------------------------------------------------------------------------

/** Whether values add up. PM 2's yes/no, replacing five finer rules. */
export type CountingRule = 'sum' | 'no-sum';

export const COUNTING_RULES: {
  id: CountingRule;
  /** The short form a table cell or summary uses. */
  name: string;
  /** The answer to "Do these values add up?", as the select offers it. */
  optionLabel: string;
  description: string;
}[] = [
  {
    id: 'sum',
    name: 'Sums',
    optionLabel: 'Yes — totals and cumulative figures are meaningful',
    description: 'Values add up. Totals and cumulative figures across projects and periods are meaningful — acres treated, barriers removed, hours contributed.',
  },
  {
    id: 'no-sum',
    name: 'Does not sum',
    optionLabel: 'No — report each value on its own',
    description: 'Values do not add up. Report them individually or as an average, never as a total — a temperature, a percentage, a survival rate.',
  },
];

/** Derived, never stored. False until a rule is chosen — the safe direction. */
export const isSummable = (m: Pick<PerformanceMeasureDefinition, 'countingRule'>): boolean => m.countingRule === 'sum';

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
  // condition readings
  'percent', 'degrees Celsius', 'cubic feet per second', 'parts per million',
] as const;
export type MeasureUnit = (typeof UNITS)[number];

// ---------------------------------------------------------------------------
// Reporting periods — tenant-wide, real dates, always shown by NAME
// ---------------------------------------------------------------------------

export interface ReportingPeriod {
  id: number;
  /** What every screen shows. Never derive a label from the dates. */
  name: string;
  startDate: string;
  endDate: string;
}

/** Calendar years, as PM 2 seeds them, wide enough for every seeded project window. */
export const REPORTING_PERIODS: ReportingPeriod[] = Array.from({ length: 2035 - 2010 + 1 }, (_, i) => {
  const y = 2010 + i;
  return { id: i + 1, name: String(y), startDate: `${y}-01-01`, endDate: `${y}-12-31` };
});

/** The period a calendar year falls in — the bridge from the projects' year windows. */
export const periodForYear = (year: number): ReportingPeriod | undefined =>
  REPORTING_PERIODS.find((p) => p.startDate.startsWith(`${year}-`));

/** A period's name for a year; the year itself when no period covers it. */
export const periodName = (year: number): string => periodForYear(year)?.name ?? String(year);

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

export type MeasureStatus = 'Draft' | 'Published' | 'Retired';

export const MEASURE_STATUSES: MeasureStatus[] = ['Draft', 'Published', 'Retired'];

export const MEASURE_STATUS_TONE: Record<MeasureStatus, 'default' | 'info' | 'primary' | 'success' | 'warning'> = {
  Published: 'success',
  Draft: 'info',
  Retired: 'default',
};

// ---------------------------------------------------------------------------
// The measure
// ---------------------------------------------------------------------------

export interface PerformanceMeasureDefinition {
  slug: string;
  /** Empty until named — a measure exists before it is finished. */
  name: string;
  /** The author's sentence to their funder — what this measure lets them say. */
  claim: string;
  /** What counts toward this measure and what does not. */
  definition: string;
  /**
   * The SEEDED goal links — which classifications track this measure in the
   * built data. Not edited from the measure: a classification picks its
   * measures in Workspace settings (user, 2026-10-09), and browser edits to
   * the link live goal-side (src/lib/measure-goals.ts reads both). Not
   * required to publish: a measure is valid before any goal tracks it.
   */
  classifications: ClassificationName[];
  /**
   * THE NUMBER. `unit` and `countingRule` are optional because a blank draft
   * has decided neither; outstandingFields() is what makes emptiness cost
   * something.
   */
  unit?: MeasureUnit;
  decimalPlaces: number;
  countingRule?: CountingRule;
  /** The questions this measure's entries are broken down by, in reporting order. */
  breakdowns: Breakdown[];
  /** Instruction shown at the moment a value is entered. */
  reporterGuidance: string;
  status: MeasureStatus;
}

export const measures: PerformanceMeasureDefinition[] = [
  {
    slug: 'acres-forest-fuels-reduction-treatment',
    claim: 'I need to tell my funder how many acres of forest we treat for fuels each year, and by what method.',
    name: 'Acres of forest fuels reduction treatment',
    definition:
      'Acres where surface or ladder fuels were removed, rearranged, or consumed under an approved prescription. Measured as the extent actually treated, not the unit planned.',
    classifications: ['Wildfire resilience', 'Forest thinning'],
    unit: 'acres',
    decimalPlaces: 0,
    countingRule: 'sum',
    breakdowns: owned('fuels-treatment-types', 'treatment-phases'),
    reporterGuidance:
      'Report the extent that was actually treated, not the unit planned. A unit re-entered in a later season is a new entry for that season.',
    status: 'Published',
  },
  {
    slug: 'tons-biomass-removed-fuels-treatment',
    claim: 'Our air district grant asks how much woody material we haul off instead of burning.',
    name: 'Tons of biomass removed in fuels treatment',
    definition:
      'Woody material hauled off the treatment unit, weighed at the landing. Material chipped or lopped and scattered on site stays on site and is not counted here.',
    classifications: ['Wildfire resilience'],
    unit: 'tons',
    decimalPlaces: 0,
    countingRule: 'sum',
    // No treatment phase here: phase divides acres meaningfully but says
    // nothing about tonnage.
    breakdowns: owned('fuels-treatment-types'),
    reporterGuidance:
      'Report the weight ticketed at the landing. Estimates scaled from acreage are not reportable here.',
    status: 'Published',
  },
  {
    slug: 'acres-riparian-habitat-restored',
    claim: 'I need to tell my funder how much streamside habitat we restore each year.',
    name: 'Acres of riparian habitat restored',
    definition:
      'Acres within the streamside corridor where native vegetation was planted or released and the site has passed its first survival check.',
    classifications: ['Riparian & wetland habitat', 'Water quality'],
    unit: 'acres',
    decimalPlaces: 1,
    countingRule: 'sum',
    breakdowns: owned('riparian-treatments'),
    reporterGuidance:
      'Count acres where planting is complete and the first survival check has passed. Do not count acres prepared but not yet planted.',
    status: 'Published',
  },
  {
    // THE COUNTER-EXAMPLE, on purpose: no place, so nothing spatial. A model
    // that only works for mapped ground is not a model.
    slug: 'volunteer-hours-contributed',
    claim: 'The board keeps asking how much of this work the community does.',
    name: 'Volunteer hours contributed',
    definition: 'Hours worked on site by unpaid participants, from the signed field log for each work day.',
    classifications: ['Riparian & wetland habitat', 'Public access & recreation'],
    unit: 'hours',
    decimalPlaces: 0,
    countingRule: 'sum',
    breakdowns: owned('volunteer-activities'),
    reporterGuidance: 'Count hours on site from the signed field log. Travel and training time are not reported here.',
    status: 'Published',
  },
  {
    slug: 'fish-passage-barriers-removed',
    claim: 'Our fisheries funder wants to know how many barriers we take out.',
    name: 'Fish passage barriers removed',
    definition:
      'Structures no longer impeding passage at any life stage, confirmed by a post-construction passage assessment.',
    classifications: ['Salmon & steelhead recovery', 'Barrier removal & fish screens'],
    unit: 'each',
    decimalPlaces: 0,
    countingRule: 'sum',
    breakdowns: owned('barrier-types'),
    reporterGuidance:
      'Report a barrier once its passage assessment is signed. A barrier modified but still rated impassable does not count.',
    status: 'Published',
  },
  {
    // THE MEASURE THAT DOES NOT SUM: a survival rate is a reading, and
    // adding two of them reports nothing.
    slug: 'plant-survival-rate',
    claim: 'Funders ask whether the plants we put in are still alive a few years later.',
    name: 'Plant survival rate',
    definition:
      'Share of installed plants alive at the survey, against the count installed on the same unit.',
    classifications: ['Riparian & wetland habitat'],
    unit: 'percent',
    decimalPlaces: 0,
    countingRule: 'no-sum',
    breakdowns: owned('survey-intervals'),
    reporterGuidance:
      'Survey the same units each year so the series stays comparable. Report the plot average, not a whole-site estimate.',
    status: 'Published',
  },
  // ---- KPIs added so every goal is tracked (2026-10-03). A classification is
  // a goal; the measures that list it are its KPIs, two to five each. Work
  // types carry none: they are becoming tags, which track without KPIs. ----
  {
    slug: 'native-plants-installed',
    claim: 'I need to report how many native plants we put in the ground each season.',
    name: 'Native plants installed',
    definition: 'Container stock, cuttings and stakes of native species set in the ground. Seed is reported by weight elsewhere, not here.',
    classifications: ['Riparian & wetland habitat', 'Native planting'],
    unit: 'plants',
    decimalPlaces: 0,
    countingRule: 'sum',
    breakdowns: owned('riparian-treatments'),
    reporterGuidance: 'Count plants installed this season, including replacements for losses. Survival is a separate measure.',
    status: 'Published',
  },
  {
    slug: 'stream-miles-reopened',
    claim: 'The recovery plan tracks how many miles of stream salmon can reach again.',
    name: 'Stream miles reopened to fish',
    definition: 'Miles of stream upstream of a fixed or removed barrier that migrating fish can now reach, to the next barrier or the natural limit.',
    classifications: ['Salmon & steelhead recovery'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    breakdowns: owned('barrier-types'),
    reporterGuidance: 'Measure to the next barrier upstream, not to the headwaters. Report a reach once, the year its barrier is cleared.',
    status: 'Published',
  },
  {
    slug: 'miles-fuel-break',
    claim: 'The fire safe council wants to know how many miles of fuel break we finish.',
    name: 'Miles of fuel break completed',
    definition: 'Shaded or cleared fuel break built to its prescribed width along a ridge, road or community edge.',
    classifications: ['Wildfire resilience', 'Fuel breaks'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    breakdowns: owned('treatment-phases'),
    reporterGuidance: 'Report a segment once it meets prescribed width end to end. Maintenance passes are entered as maintenance, not new miles.',
    status: 'Published',
  },
  {
    slug: 'acres-wetland-meadow-restored',
    claim: 'I need to tell my funder how many acres of wetland and meadow we rewet.',
    name: 'Acres of wetland and meadow restored',
    definition: 'Acres of tidal marsh, wet meadow or seasonal wetland where hydrology was restored and wetland vegetation is establishing.',
    classifications: ['Riparian & wetland habitat', 'Flood risk reduction', 'Meadow & marsh rewetting'],
    unit: 'acres',
    decimalPlaces: 0,
    countingRule: 'sum',
    breakdowns: owned('restoration-actions'),
    reporterGuidance: 'Count acres once water is back on the ground — breach open, plugs in, or channel raised. Graded but still dry ground is not reported yet.',
    status: 'Published',
  },
  {
    slug: 'stream-miles-floodplain-reconnected',
    claim: 'Our water agency asks how much channel we reconnect to its floodplain.',
    name: 'Stream miles reconnected to floodplain',
    definition: 'Miles of channel that now spill onto their floodplain at a typical winter high flow.',
    classifications: ['Water supply reliability'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    breakdowns: owned('restoration-actions'),
    reporterGuidance: 'Report the reach once the first overbank flow is observed or modeled at the design discharge.',
    status: 'Published',
  },
  {
    slug: 'stream-miles-instream-habitat',
    claim: 'Fisheries partners ask how many miles of channel we give fish better habitat in.',
    name: 'Stream miles of instream habitat improved',
    definition: 'Miles of channel where wood, gravel, pools or side channels were added to give fish places to spawn, rear or hold.',
    classifications: ['Salmon & steelhead recovery', 'Instream habitat structures'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    breakdowns: owned('restoration-actions', 'focal-species'),
    reporterGuidance: 'Measure the treated reach along the thalweg. A reach treated again in a later year is not new miles.',
    status: 'Published',
  },
  {
    slug: 'acres-floodplain-habitat',
    claim: 'The flood program wants acres of floodplain that flood again at high water.',
    name: 'Acres of floodplain habitat reconnected',
    definition: 'Acres of floodplain, side channel or off-channel rearing habitat that floods at the design flow.',
    classifications: ['Flood risk reduction', 'Salmon & steelhead recovery', 'Side channels & floodplains'],
    unit: 'acres',
    decimalPlaces: 0,
    countingRule: 'sum',
    breakdowns: owned('restoration-actions'),
    reporterGuidance: 'Count acres inside the inundation boundary at the design flow, from the as-built survey.',
    status: 'Published',
  },
  {
    slug: 'tons-sediment-prevented',
    claim: 'The water board asks how much sediment we keep out of the creek each year.',
    name: 'Tons of fine sediment prevented per year',
    definition: 'Estimated annual load of fine sediment kept out of the stream by a stabilized bank, upgraded crossing or treated road.',
    classifications: ['Water quality', 'Erosion & sediment control'],
    unit: 'tons per year',
    decimalPlaces: 0,
    countingRule: 'sum',
    breakdowns: owned('conservation-practices'),
    reporterGuidance: 'Use the approved load-reduction calculator for the practice. Report once, the year the practice is complete.',
    status: 'Published',
  },
  {
    slug: 'miles-road-decommissioned',
    claim: 'I need to report how many miles of old road we close for good.',
    name: 'Miles of road decommissioned',
    definition: 'Miles of unpaved road ripped, outsloped and closed so it no longer routes runoff and sediment to streams.',
    classifications: ['Water quality'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    breakdowns: owned(),
    reporterGuidance: 'Report miles once the closure is complete and crossings are pulled. Seasonal gates do not count.',
    status: 'Published',
  },
  {
    slug: 'stormwater-captured',
    claim: 'Our stormwater grant asks how much runoff our projects catch in an average year.',
    name: 'Stormwater captured per year',
    definition: 'Estimated average annual runoff held, infiltrated or treated before it reaches a stream.',
    classifications: ['Water quality', 'Stormwater capture'],
    unit: 'acre-feet per year',
    decimalPlaces: 0,
    countingRule: 'sum',
    breakdowns: owned('conservation-practices'),
    reporterGuidance: 'Use the design capture volume for an average rainfall year, not the largest storm.',
    status: 'Published',
  },
  {
    slug: 'water-supply-gained',
    claim: 'The water agency wants to know how much dry-season supply we add each year.',
    name: 'Water supply gained per year',
    definition: 'Acre-feet added to dry-season supply each year — by raised groundwater, new storage, or water use avoided.',
    classifications: ['Water supply reliability', 'Groundwater recharge'],
    unit: 'acre-feet per year',
    decimalPlaces: 0,
    countingRule: 'sum',
    breakdowns: owned('restoration-actions'),
    reporterGuidance: 'Report the modeled average-year gain once the work is complete. Do not add a site again for a wet year.',
    status: 'Published',
  },
  {
    slug: 'miles-levee-setback',
    claim: 'The flood program tracks how many miles of levee we move back from the river.',
    name: 'Miles of levee set back',
    definition: 'Miles of levee moved back from the channel to give high water room, measured along the old alignment.',
    classifications: ['Flood risk reduction'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    breakdowns: owned(),
    reporterGuidance: 'Report once the new levee is certified and the old one is breached.',
    status: 'Published',
  },
  {
    slug: 'miles-trail-opened',
    claim: 'Our parks funder asks how many miles of trail we open to the public.',
    name: 'Miles of trail and greenway opened',
    definition: 'Miles of trail, greenway or river access route opened to the public.',
    classifications: ['Public access & recreation'],
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    breakdowns: owned(),
    reporterGuidance: 'Report miles the day the route opens to the public, not when construction ends.',
    status: 'Published',
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
 * A fresh, entirely undecided measure. Everything empty is a field
 * outstandingFields() flags, so a new measure starts short of publishable
 * rather than silently classified.
 */
export const blankMeasure = (slug: string): PerformanceMeasureDefinition => ({
  slug,
  name: '',
  claim: '',
  definition: '',
  classifications: [],
  decimalPlaces: 0,
  breakdowns: [],
  reporterGuidance: '',
  status: 'Draft',
});

/** The breakdowns a NEW entry is asked: every one but the retired. */
export const askedBreakdowns = (m: Pick<PerformanceMeasureDefinition, 'breakdowns'>): Breakdown[] =>
  m.breakdowns.filter((b) => !b.retired);

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
  COUNTING_RULES.find((r) => r.name === name.trim() || r.optionLabel === name.trim())?.id;

/** A unit is stored as its own display string, so this is only a guard. */
export const unitFromLabel = (label: string): MeasureUnit | undefined =>
  (UNITS as readonly string[]).includes(label.trim()) ? (label.trim() as MeasureUnit) : undefined;

export interface OutstandingField {
  label: string;
}

/**
 * What still stands between this measure and Published.
 *
 * NOTHING ABOUT BREAKDOWNS. They are optional, and a gate that demanded one
 * is the forcing function that filled the observed catalogs with
 * Default/Default filler (docs/measure-model.md).
 */
export const outstandingFields = (m: PerformanceMeasureDefinition): OutstandingField[] => {
  // Form order, so any rendering of this list walks the page top to bottom.
  const missing: OutstandingField[] = [];
  if (!m.name.trim()) missing.push({ label: 'Measure name' });
  if (!m.definition.trim()) missing.push({ label: 'Definition' });
  if (!m.reporterGuidance.trim()) missing.push({ label: 'Reporter guidance' });
  if (!m.unit) missing.push({ label: 'Unit' });
  if (!m.countingRule) missing.push({ label: 'Whether values add up' });
  return missing;
};

export const isReadyToPublish = (m: PerformanceMeasureDefinition): boolean =>
  outstandingFields(m).length === 0;

export const measuresByName = (): PerformanceMeasureDefinition[] =>
  [...measures].sort((a, b) => a.name.localeCompare(b.name));
