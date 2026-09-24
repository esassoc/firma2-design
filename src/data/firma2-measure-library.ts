// ---------------------------------------------------------------------------
// Measure library — kinds of work, and what each usually counts
// ---------------------------------------------------------------------------
//
// THE LIBRARY behind the Performance measures setup walk: fifteen kinds of work
// a conservation program does, and for each the counts programs of that kind
// usually report. The walk asks which kinds the program does, then offers the
// counts for the kinds confirmed. It is a fixed list asked as a preference
// (product brief section 4): the admin picks from it and adds what it lacks.
//
// SOURCE. A teammate's 2026-09-24 Performance measures interview mock (Mission 4
// by Mission 6), constants LIB and UNITS, written for the invented Cascade
// Headwaters tenant. Names, units and splits are taken verbatim; a count's name
// is the mock's "thing" and "verb" joined ("Streamside land restored"). The one
// reading, stream temperature, is the mock's outcome measure, filed under water
// quality because that is where the mock shows it.
//
// NOT HERE. Which kinds and counts the documents suggest, with their quotes, and
// the measures the mock considered and left out: those are the tenant's
// evidence, and live in firma2-setup.ts beside the other suggestions.
//
// MOCK DATA. Invented for the prototype, never drawn from client material.

export interface WorkKind {
  id: string;
  /** Tile label, the mock's theme name. */
  name: string;
}

export interface MeasureUnit {
  id: string;
  /** Lowercase, as it reads after a number: "12 acres", "3 linear feet". */
  label: string;
}

/**
 * The one way a count can be split. Every split also carries the fixed
 * "Unspecified" choice, for work a project cannot place; it is added where the
 * split is rendered or stored, never listed here, so no split can forget it.
 */
export interface MeasureSplit {
  /** What the split is by: "Type of work", "Kind of barrier". */
  label: string;
  choices: string[];
}

/**
 * How a count combines across projects and years. `sum` is an amount of work
 * (acres, people) that adds up to a program total; `reading` is a measurement
 * (a temperature) that is shown per project and never totaled.
 */
export type CountingRule = 'sum' | 'reading';

export interface LibraryCount {
  id: string;
  /** A WorkKind id. */
  kindId: string;
  /** Sentence-case name: "Streamside land restored". */
  name: string;
  /** A MeasureUnit id. */
  unitId: string;
  countingRule: CountingRule;
  /** The split the mock suggests for this count; absent when it reports a single total. */
  split?: MeasureSplit;
  /** What one unit counts, where the mock wrote a definition. */
  definition?: string;
}

export const workKinds: WorkKind[] = [
  { id: 'streamside-restoration', name: 'Streamside restoration' },
  { id: 'in-stream-habitat', name: 'In-stream habitat' },
  { id: 'fish-passage', name: 'Fish passage' },
  { id: 'wildfire-fuels', name: 'Wildfire fuels' },
  { id: 'forest-health', name: 'Forest health' },
  { id: 'invasive-plants', name: 'Invasive plants' },
  { id: 'water-quality', name: 'Water quality' },
  { id: 'water-supply-and-flow', name: 'Water supply and flow' },
  { id: 'land-conservation', name: 'Land conservation' },
  { id: 'wetlands-and-floodplains', name: 'Wetlands and floodplains' },
  { id: 'roads-and-erosion', name: 'Roads and erosion' },
  { id: 'upland-and-grassland-habitat', name: 'Upland and grassland habitat' },
  { id: 'community-outreach', name: 'Community outreach' },
  { id: 'planning-and-monitoring', name: 'Planning and monitoring' },
  { id: 'volunteers-and-funding', name: 'Volunteers and funding' },
];

export const measureUnits: MeasureUnit[] = [
  { id: 'acres', label: 'acres' },
  { id: 'square-feet', label: 'square feet' },
  { id: 'miles', label: 'miles' },
  { id: 'linear-feet', label: 'linear feet' },
  { id: 'each', label: 'each' },
  { id: 'plants', label: 'plants' },
  { id: 'people', label: 'people' },
  { id: 'events', label: 'events' },
  { id: 'pounds', label: 'pounds' },
  { id: 'tons', label: 'tons' },
  { id: 'tons-per-year', label: 'tons per year' },
  { id: 'hours', label: 'hours' },
  { id: 'dollars', label: 'dollars' },
  { id: 'percent', label: 'percent' },
  { id: 'degrees-fahrenheit', label: 'degrees Fahrenheit' },
  { id: 'cubic-feet-per-second', label: 'cubic feet per second' },
  { id: 'acre-feet', label: 'acre-feet' },
];

const sum = (
  kindId: string,
  id: string,
  name: string,
  unitId: string,
  split?: MeasureSplit,
  definition?: string,
): LibraryCount => ({
  id,
  kindId,
  name,
  unitId,
  countingRule: 'sum',
  ...(split ? { split } : {}),
  ...(definition ? { definition } : {}),
});

/** Every library count, in kind order and, within a kind, the mock's order. */
export const libraryCounts: LibraryCount[] = [
  sum(
    'streamside-restoration',
    'streamside-land-restored',
    'Streamside land restored',
    'acres',
    { label: 'Type of work', choices: ['Native planting', 'Livestock fencing', 'Weed removal'] },
    'Acres of land along a stream where the project planted natives, fenced out livestock, or removed weeds during the reporting year. Each acre is counted once, even if it had more than one kind of work.',
  ),
  sum('streamside-restoration', 'eroding-streambank-repaired', 'Eroding streambank repaired', 'linear-feet', {
    label: 'Approach',
    choices: ['Plantings and soft materials', 'Rock'],
  }),
  sum('in-stream-habitat', 'in-stream-habitat-structures-installed', 'In-stream habitat structures installed', 'each', {
    label: 'Kind of structure',
    choices: ['Logs and woody debris', 'Boulders', 'Beaver dam analogs'],
  }),
  sum('in-stream-habitat', 'side-channel-reopened', 'Side channel reopened', 'linear-feet'),
  sum('fish-passage', 'fish-barriers-removed-or-replaced', 'Fish barriers removed or replaced', 'each', {
    label: 'Kind of barrier',
    choices: ['Culvert', 'Dam', 'Irrigation diversion'],
  }),
  sum(
    'fish-passage',
    'stream-reopened-to-fish',
    'Stream reopened to fish',
    'miles',
    undefined,
    'Miles of stream that fish can reach because of barrier work finished this year, measured up to the next barrier.',
  ),
  sum('wildfire-fuels', 'land-treated-to-lower-wildfire-risk', 'Land treated to lower wildfire risk', 'acres', {
    label: 'Method',
    choices: ['Thinning', 'Prescribed burning', 'Mowing or chipping'],
  }),
  sum('forest-health', 'forest-treated-for-health', 'Forest treated for health', 'acres', {
    label: 'Type of work',
    choices: ['Thinning', 'Replanting', 'Disease control'],
  }),
  sum('forest-health', 'trees-planted', 'Trees planted', 'plants'),
  sum('invasive-plants', 'land-cleared-of-invasive-plants', 'Land cleared of invasive plants', 'acres', {
    label: 'Target plant',
    choices: ['Blackberry', 'Knotweed', 'Scotch broom'],
  }),
  sum('water-quality', 'sediment-kept-out-of-streams', 'Sediment kept out of streams', 'tons-per-year', {
    label: 'Where it came from',
    choices: ['Roads', 'Streambanks', 'Farm fields'],
  }),
  {
    id: 'stream-temperature-summer-peak',
    kindId: 'water-quality',
    name: 'Stream temperature (summer peak)',
    unitId: 'degrees-fahrenheit',
    countingRule: 'reading',
    definition:
      "The highest weekly average water temperature recorded at the project's monitoring site between July and August.",
  },
  sum('water-supply-and-flow', 'water-saved-or-returned-to-streams', 'Water saved or returned to streams', 'acre-feet', {
    label: 'How',
    choices: ['More efficient irrigation', 'Water rights lease', 'Storage'],
  }),
  sum('land-conservation', 'land-permanently-protected', 'Land permanently protected', 'acres', {
    label: "How it's protected",
    choices: ['Conservation easement', 'Purchase'],
  }),
  sum('wetlands-and-floodplains', 'wetland-restored', 'Wetland restored', 'acres'),
  sum('wetlands-and-floodplains', 'floodplain-reconnected-to-the-river', 'Floodplain reconnected to the river', 'acres'),
  sum('roads-and-erosion', 'road-closed-or-removed', 'Road closed or removed', 'miles'),
  sum('roads-and-erosion', 'stream-crossings-upgraded', 'Stream crossings upgraded', 'each'),
  sum('upland-and-grassland-habitat', 'upland-habitat-improved', 'Upland habitat improved', 'acres', {
    label: 'Type of work',
    choices: ['Seeding and planting', 'Grazing changes', 'Weed removal'],
  }),
  sum('community-outreach', 'people-reached', 'People reached', 'people', {
    label: 'Who they were',
    choices: ['Students', 'Landowners', 'Volunteers', 'Community members'],
  }),
  sum('community-outreach', 'events-held', 'Events held', 'events'),
  sum('planning-and-monitoring', 'plans-or-designs-finished', 'Plans or designs finished', 'each'),
  sum('planning-and-monitoring', 'sites-monitored', 'Sites monitored', 'each'),
  sum('volunteers-and-funding', 'volunteer-time-given', 'Volunteer time given', 'hours'),
  sum('volunteers-and-funding', 'matching-funds-raised', 'Matching funds raised', 'dollars', {
    label: 'Source',
    choices: ['Federal', 'State', 'Private'],
  }),
];

/** The fixed choice every split carries after its own, for work a project cannot place. */
export const UNSPECIFIED_CHOICE = 'Unspecified';

export const workKindById = new Map(workKinds.map((kind) => [kind.id, kind]));
export const measureUnitById = new Map(measureUnits.map((unit) => [unit.id, unit]));
export const libraryCountById = new Map(libraryCounts.map((count) => [count.id, count]));
