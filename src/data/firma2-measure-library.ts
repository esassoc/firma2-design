// The standard measure library — result concepts a tenant SELECTS rather than
// authors from scratch.
//
// WHY A LIBRARY EXISTS AT ALL: the cross-tenant evidence
// (docs/measure-model.md, PM10). Concepts cluster into ~15 themes across every
// sampled catalog, and near-identical measures recur across tenants under
// trivially different names, with the SAME option lists retyped by hand. A
// library with tenant selection covers most of a catalog and — because its
// concepts reference the shared VOCABULARIES — a tenant that starts from the
// library starts aggregable, instead of converging on the standard by typo.
//
// A CONCEPT IS A PREFILLED MEASURE, NOT A LOCKED ONE. Creating from a concept
// writes a normal draft (name, definition, aspects, dimensions,
// classifications, guidance) that the setup page edits like any other; the
// provenance rides along as conceptId/theme. Nothing here constrains later
// editing — the library's value is a good starting shape, not governance.
//
// ITS OWN MODULE, deliberately: the setup page never reads the library, and
// the catalog page should not ship ~20 concept definitions to render a table.
// Only the create dialog imports this file.
//
// INVENTED CONTENT, same rule as every dataset in this public repo: themes
// echo the evidence's anonymized theme list; every concept, definition and
// guidance line is fabricated from public restoration practice. Dimension
// vocabularies REFERENCE the seeds in firma2-performance-measures.ts — never
// copied, which is the model's own rule 2 demonstrated at library scale.

import type {
  MeasureAspect,
  MeasureDimension,
  MeasureKind,
} from './firma2-performance-measures';
import type { Classification } from './firma2-projects';

export interface LibraryTheme {
  id: string;
  name: string;
  /** What lands under this theme — one line, read cold in the dialog. */
  description: string;
}

export interface MeasureConcept {
  id: string;
  theme: string;
  kind: MeasureKind;
  name: string;
  definition: string;
  aspects: MeasureAspect[];
  dimensions: MeasureDimension[];
  classifications: Classification[];
  reporterGuidance: string;
}

/**
 * ~15 themes, matching the evidence's clusters. Every theme renders in the
 * create dialog whether or not it has concepts yet — an empty theme is the
 * honest state of a library this young, and hiding it would misstate the
 * standard's coverage.
 */
export const LIBRARY_THEMES: LibraryTheme[] = [
  { id: 'habitat-restoration', name: 'Habitat restoration', description: 'Ground and channel brought back toward function.' },
  { id: 'fire-fuels', name: 'Fire & fuels', description: 'Fuel loads reduced and fire readiness built.' },
  { id: 'species-habitat', name: 'Species & habitat', description: 'Conditions for named species, measured or built.' },
  { id: 'water-quality', name: 'Water quality', description: 'Loads reduced and conditions in the water column.' },
  { id: 'water-quantity', name: 'Water quantity', description: 'Water conserved, recharged, or kept instream.' },
  { id: 'community-engagement', name: 'Community engagement', description: 'People reached, trained, and contributing.' },
  { id: 'recreation-infrastructure', name: 'Recreation & infrastructure', description: 'Built assets the public uses.' },
  { id: 'planning-monitoring', name: 'Planning & monitoring', description: 'Documents, surveys, and designs delivered.' },
  { id: 'invasives', name: 'Invasive species', description: 'Infestations found, treated, and kept down.' },
  { id: 'land-protection', name: 'Land protection', description: 'Acres and easements brought under protection.' },
  { id: 'carbon', name: 'Carbon & greenhouse gas', description: 'Emissions avoided and carbon held.' },
  { id: 'agricultural-practice', name: 'Agricultural practice', description: 'Working-lands practices installed.' },
  { id: 'funding', name: 'Funding & leverage', description: 'Dollars raised and matched.' },
  { id: 'socioeconomic', name: 'Socioeconomic', description: 'Jobs, contracts, and local benefit.' },
  { id: 'flood-risk', name: 'Flood risk', description: 'Exposure reduced and capacity restored.' },
];

export const MEASURE_CONCEPTS: MeasureConcept[] = [
  // ---- fire & fuels --------------------------------------------------------
  {
    id: 'fuels-reduction',
    theme: 'fire-fuels',
    kind: 'output',
    name: 'Fuels reduction treatment',
    definition:
      'Extent where surface or ladder fuels were removed, rearranged, or consumed under an approved prescription.',
    // TWO ASPECTS OUT OF THE BOX — the library's showpiece for the multi-aspect
    // rule: the evidence's "(area)/(length)" clone families collapse into one
    // concept measured two ways.
    aspects: [
      { id: 'treated-area', quantity: 'Treated area', unit: 'acres', decimalPlaces: 0, countingRule: 'sum' },
      { id: 'fuel-break-length', quantity: 'Fuel break length', unit: 'miles', decimalPlaces: 1, countingRule: 'sum' },
    ],
    dimensions: [
      { name: 'Treatment type', archetype: 'activity-method', source: { kind: 'reported' }, vocabularyId: 'fuels-treatment-types' },
      { name: 'Land ownership', source: { kind: 'spatial', ref: 'land-ownership' } },
      { name: 'Watershed', source: { kind: 'spatial', ref: 'watershed' } },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    classifications: ['Wildfire resilience'],
    reporterGuidance: 'Report the extent actually treated, not the unit planned.',
  },
  {
    id: 'defensible-space-assessments',
    theme: 'fire-fuels',
    kind: 'output',
    name: 'Defensible space assessments',
    definition: 'Parcels assessed against the defensible-space standard, with a written result left with the owner.',
    aspects: [{ id: 'parcels-assessed', quantity: 'Parcels assessed', unit: 'each', decimalPlaces: 0, countingRule: 'distinct-places' }],
    dimensions: [
      { name: 'Land ownership', source: { kind: 'spatial', ref: 'land-ownership' } },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    classifications: ['Wildfire resilience'],
    reporterGuidance: 'Count a parcel once per assessment visit, whether or not it passed.',
  },

  // ---- habitat restoration -------------------------------------------------
  {
    id: 'riparian-restoration',
    theme: 'habitat-restoration',
    kind: 'output',
    name: 'Riparian habitat restored',
    definition:
      'Extent within the streamside corridor where native vegetation was planted or released and has passed its first survival check.',
    aspects: [
      { id: 'restored-extent', quantity: 'Restored extent', unit: 'acres', decimalPlaces: 1, countingRule: 'spatial-union' },
      { id: 'plants-installed', quantity: 'Plants installed', unit: 'plants', decimalPlaces: 0, countingRule: 'sum' },
    ],
    dimensions: [
      { name: 'Treatment type', archetype: 'activity-method', source: { kind: 'reported' }, vocabularyId: 'riparian-treatments' },
      { name: 'Action', archetype: 'action-verb', source: { kind: 'reported' }, vocabularyId: 'restoration-actions' },
      { name: 'Critical zone', source: { kind: 'spatial', ref: 'critical-zone' } },
      { name: 'Watershed', source: { kind: 'spatial', ref: 'watershed' } },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    classifications: ['Riparian & wetland habitat', 'Water quality'],
    reporterGuidance: 'Count extent where planting is complete and the first survival check has passed.',
  },
  {
    id: 'stream-corridor-restored',
    theme: 'habitat-restoration',
    kind: 'output',
    name: 'Stream corridor restored',
    definition: 'Channel length re-shaped, re-connected, or structurally treated to restore process.',
    aspects: [{ id: 'channel-length', quantity: 'Channel length treated', unit: 'linear feet', decimalPlaces: 0, countingRule: 'spatial-union' }],
    dimensions: [
      { name: 'Practice', archetype: 'activity-method', source: { kind: 'reported' }, vocabularyId: 'conservation-practices' },
      { name: 'Watershed', source: { kind: 'spatial', ref: 'watershed' } },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    classifications: ['Riparian & wetland habitat'],
    reporterGuidance: 'Measure along the thalweg of the treated reach, not the project boundary.',
  },

  // ---- species & habitat ---------------------------------------------------
  {
    id: 'fish-passage-barriers',
    theme: 'species-habitat',
    kind: 'output',
    name: 'Fish passage barrier treatment',
    definition: 'Structures no longer impeding passage at any life stage, confirmed by post-construction assessment.',
    aspects: [
      { id: 'barriers-treated', quantity: 'Barriers treated', unit: 'each', decimalPlaces: 0, countingRule: 'distinct-places' },
      { id: 'stream-opened', quantity: 'Stream miles opened', unit: 'miles', decimalPlaces: 1, countingRule: 'sum' },
    ],
    dimensions: [
      { name: 'Barrier type', archetype: 'object-kind', source: { kind: 'reported' }, vocabularyId: 'barrier-types' },
      { name: 'Focal species', archetype: 'species', source: { kind: 'reported' }, vocabularyId: 'focal-species' },
      { name: 'Watershed', source: { kind: 'spatial', ref: 'watershed' } },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    classifications: ['Salmon & steelhead recovery'],
    reporterGuidance: 'Report a barrier once its passage assessment is signed.',
  },
  {
    id: 'survival-rate',
    theme: 'species-habitat',
    kind: 'outcome',
    name: 'Plant survival rate',
    definition: 'Share of installed plants alive at the survey, against the count installed on the same unit.',
    aspects: [{ id: 'survival', quantity: 'Survival at survey', unit: 'percent', decimalPlaces: 0, countingRule: 'latest-per-place' }],
    dimensions: [
      { name: 'Years since planting', archetype: 'status-phase', source: { kind: 'reported' }, vocabularyId: 'survey-intervals' },
      { name: 'Watershed', source: { kind: 'spatial', ref: 'watershed' } },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    classifications: ['Riparian & wetland habitat'],
    reporterGuidance: 'Survey the same units each year; report the plot average.',
  },

  // ---- water quality -------------------------------------------------------
  {
    id: 'sediment-load-reduction',
    theme: 'water-quality',
    kind: 'output',
    name: 'Sediment load reduction',
    definition: 'Estimated sediment kept out of the channel by completed treatments, per the program calculator.',
    aspects: [{ id: 'sediment-avoided', quantity: 'Sediment avoided', unit: 'tons per year', decimalPlaces: 0, countingRule: 'sum' }],
    dimensions: [
      { name: 'Practice', archetype: 'activity-method', source: { kind: 'reported' }, vocabularyId: 'conservation-practices' },
      { name: 'Watershed', source: { kind: 'spatial', ref: 'watershed' } },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    classifications: ['Water quality'],
    reporterGuidance: 'Use the program calculator; report the modelled annual rate, not a one-time mass.',
  },

  // ---- community engagement ------------------------------------------------
  {
    id: 'volunteer-effort',
    theme: 'community-engagement',
    kind: 'output',
    name: 'Volunteer effort',
    definition: 'Hours worked on site by unpaid participants, from the signed field log.',
    aspects: [
      { id: 'hours', quantity: 'Hours worked', unit: 'hours', decimalPlaces: 0, countingRule: 'sum' },
      { id: 'participants', quantity: 'Participants', unit: 'people', decimalPlaces: 0, countingRule: 'sum' },
    ],
    dimensions: [
      { name: 'Activity', archetype: 'activity-method', source: { kind: 'reported' }, vocabularyId: 'volunteer-activities' },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    classifications: ['Public access & recreation'],
    reporterGuidance: 'Count hours on site from the signed log; travel and training are not reported here.',
  },
  {
    id: 'training-events',
    theme: 'community-engagement',
    kind: 'output',
    name: 'Training and workshops delivered',
    definition: 'Events held with a sign-in sheet, and the people they reached.',
    aspects: [
      { id: 'events', quantity: 'Events held', unit: 'events', decimalPlaces: 0, countingRule: 'sum' },
      { id: 'attendees', quantity: 'Attendees', unit: 'people', decimalPlaces: 0, countingRule: 'sum' },
    ],
    dimensions: [{ name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } }],
    classifications: ['Public access & recreation'],
    reporterGuidance: 'One row per event; attendees from the sign-in sheet.',
  },

  // ---- invasives -----------------------------------------------------------
  {
    id: 'invasive-treatment',
    theme: 'invasives',
    kind: 'output',
    name: 'Invasive species treatment',
    definition: 'Extent surveyed or treated for target invasive species.',
    aspects: [{ id: 'treated-extent', quantity: 'Treated extent', unit: 'acres', decimalPlaces: 1, countingRule: 'spatial-union' }],
    dimensions: [
      { name: 'Action', archetype: 'action-verb', source: { kind: 'reported' }, vocabularyId: 'restoration-actions' },
      { name: 'Land ownership', source: { kind: 'spatial', ref: 'land-ownership' } },
      { name: 'Initial vs maintenance', source: { kind: 'historical', ref: 'treatment-phase' } },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    classifications: ['Riparian & wetland habitat'],
    reporterGuidance: 'Map the treated polygon; re-treatments are new entries on the same place.',
  },

  // ---- water quantity ------------------------------------------------------
  {
    id: 'water-conserved',
    theme: 'water-quantity',
    kind: 'output',
    name: 'Water conserved',
    definition: 'Modelled annual savings from completed efficiency or forbearance projects.',
    aspects: [{ id: 'flow-restored', quantity: 'Flow restored', unit: 'cubic feet per second', decimalPlaces: 1, countingRule: 'sum' }],
    dimensions: [
      { name: 'Watershed', source: { kind: 'spatial', ref: 'watershed' } },
      { name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } },
    ],
    classifications: ['Water supply reliability'],
    reporterGuidance: 'Report the modelled annual rate from the signed agreement, not the design maximum.',
  },

  // ---- funding -------------------------------------------------------------
  {
    id: 'match-leveraged',
    theme: 'funding',
    kind: 'output',
    name: 'Match funding leveraged',
    definition: 'Dollars of non-program match committed in executed agreements.',
    aspects: [{ id: 'match', quantity: 'Match committed', unit: 'dollars', decimalPlaces: 0, countingRule: 'sum' }],
    dimensions: [{ name: 'Reporting year', source: { kind: 'record', ref: 'reporting-year' } }],
    // Deliberately unclassified: which plan goals leveraged match reports
    // toward is the tenant's call, and the blank is what routes them to make
    // it — a prefilled wrong answer would never get corrected.
    classifications: [],
    reporterGuidance: 'Count match only when the agreement is executed, at its committed value.',
  },
];

export const conceptsForTheme = (themeId: string): MeasureConcept[] =>
  MEASURE_CONCEPTS.filter((c) => c.theme === themeId);
