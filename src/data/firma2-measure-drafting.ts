// Drafting a performance measure with Claude — the scripted half.
//
// WHERE THIS CAME FROM. ProjectFirma2's hackathon team 6 built this flow
// against a live model: a program lead either types the claim they owe their
// funder, or — when they do not have that sentence yet — picks what their
// program works on and answers two clickable questions until the sentence
// exists. Either way the claim goes to one drafting call, and a person
// reviews the draft before anything is saved.
//
// THE PRINCIPLE IT RESTS ON, kept verbatim from the team's notes: a program
// lead can reliably RECOGNISE the right answer and cannot reliably COMPOSE
// it. So every question is answerable by clicking, and typing is offered
// but never required.
//
// THERE IS NO MODEL HERE. This is a static prototype, so the interview and
// the drafts are scripted: one entry per activity a program might describe,
// matched by keyword when the author types instead of clicks. A claim that
// matches nothing gets an honest "could not place that" rather than an
// invented measure. The real call's shape is the seam — the output of
// draftFromClaim() is what the endpoint returns.
//
// TWO REFINEMENTS OVER THE HACKATHON BUILD, both argued from this spoke's
// own model (docs/measure-model.md):
//
//   1. THEMES ARE THE CLASSIFICATION VOCABULARY. The hackathon added a
//      separate fifteen-row theme lookup; this spoke already has a goal
//      vocabulary measures and projects share, and a second one would split
//      every roll-up across the two. The chips are CLASSIFICATIONS.
//   2. DRAFTS REUSE SHARED LISTS. The hackathon drafted per-measure option
//      lists and told the model to reuse spellings. Here a split is either a
//      REFERENCE to a shared list that already exists, a system list that
//      costs the reporter nothing, or — only when neither fits — a new list,
//      and the draft says which of the three it is.
//
// INVENTED CONTENT. Every activity, measure and warning below is fabricated
// from public restoration practice. Deterministic: literal data, no
// randomness, no clock.

import type { ClassificationName } from './firma2-projects';
import type { CountingRule, MeasureKind, MeasureUnit } from './firma2-performance-measures';

// ---------------------------------------------------------------------------
// The activities — one scripted draft each
// ---------------------------------------------------------------------------

/** How a draft divides its number. Exactly one of the three sources. */
export type DraftSplit =
  /** A shared list this tenant already maintains — referenced, never copied. */
  | { source: 'shared'; schemaId: string; label: string }
  /** A list the system answers from the map or the record — free to the reporter. */
  | { source: 'system'; schemaId: string; label: string }
  /** No existing list fits, so the draft proposes one. */
  | { source: 'new'; name: string; label: string; options: string[] };

export interface DraftActivity {
  id: string;
  theme: ClassificationName;
  /** The answer chip in the interview — the work, in the author's words. */
  activity: string;
  /** Lower-case fragments that place a typed claim on this activity. */
  keywords: string[];
  name: string;
  kind: MeasureKind;
  /** Undefined when the claim's unit is not on the closed list — see warnings. */
  unit?: MeasureUnit;
  decimalPlaces: number;
  countingRule: CountingRule;
  definition: string;
  reporterGuidance: string;
  /** What the funder is told, completing "I need to tell my funder …". */
  say: string;
  /** The reporter's sentence, with [N] for the number. */
  sentence: string;
  /** The optional division of the number, and how the funder hears it. */
  split?: DraftSplit & { say: string };
  /** System lists attached regardless — they cost nobody anything. */
  automatic: string[];
  /** Five-test notes the draft always carries. */
  warnings: string[];
}

// System lists that fit almost any mapped output, and the one every measure gets.
const MAPPED = ['system-watershed', 'system-land-ownership', 'system-reporting-year'];
const UNMAPPED = ['system-reporting-year'];

export const DRAFT_ACTIVITIES: DraftActivity[] = [
  // --- Riparian & wetland habitat -----------------------------------------
  {
    id: 'riparian-treatment',
    theme: 'Riparian & wetland habitat',
    activity: 'Planting and fencing along streams',
    keywords: ['riparian', 'streamside', 'streambank', 'planting', 'planted', 'willow', 'cottonwood', 'fenc'],
    name: 'Acres of riparian habitat treated',
    kind: 'output',
    unit: 'acres',
    decimalPlaces: 1,
    countingRule: 'sum',
    definition:
      'Acres inside the streamside corridor where native plants went in, livestock were fenced out, or invasives were cleared this year. Count the ground treated, not the ground planned.',
    reporterGuidance:
      'Report each treatment once, in the year the work finished. Ground that was both fenced and planted is one entry per treatment.',
    say: 'how many acres of streamside habitat we treated each year',
    sentence: 'On this project, this year, we treated [N] acres of riparian habitat',
    split: {
      source: 'shared',
      schemaId: 'riparian-treatments',
      label: 'treatment',
      say: 'broken down by how we treated it',
    },
    automatic: MAPPED,
    warnings: [
      '“Fencing” is not on your shared Riparian treatments list. Add it there and every measure using the list gains it; leave it off and reporters have nowhere to put fencing.',
    ],
  },
  {
    id: 'invasive-removal',
    theme: 'Riparian & wetland habitat',
    activity: 'Pulling out invasive plants',
    keywords: ['invasive', 'blackberry', 'arundo', 'weed', 'tamarisk'],
    name: 'Acres of invasive vegetation removed',
    kind: 'output',
    unit: 'acres',
    decimalPlaces: 1,
    countingRule: 'spatial-union',
    definition:
      'Acres where invasive plants were removed to the point that natives can establish. Re-treating the same ground in a later year does not add new acres.',
    reporterGuidance: 'Map the ground you cleared. Follow-up passes on the same patch are not new acres.',
    say: 'how many acres we cleared of invasive plants',
    sentence: 'On this project, this year, we cleared invasive plants from [N] acres',
    split: {
      source: 'new',
      name: 'Removal methods',
      label: 'method',
      options: ['Hand pulling', 'Mechanical', 'Herbicide', 'Grazing', 'Unspecified'],
      say: 'and how we removed them',
    },
    automatic: MAPPED,
    warnings: [],
  },
  {
    id: 'wetland-restoration',
    theme: 'Riparian & wetland habitat',
    activity: 'Restoring or creating wetlands',
    keywords: ['wetland', 'marsh', 'vernal pool'],
    name: 'Acres of wetland restored',
    kind: 'output',
    unit: 'acres',
    decimalPlaces: 1,
    countingRule: 'spatial-union',
    definition:
      'Acres of wetland where grading, plugging or planting is complete and the site holds water through its first wet season.',
    reporterGuidance: 'Report once the site has held water through one wet season, not when construction ends.',
    say: 'how many acres of wetland we restored',
    sentence: 'On this project, this year, we restored [N] acres of wetland',
    split: {
      source: 'shared',
      schemaId: 'restoration-actions',
      label: 'restoration action',
      say: 'and whether we created, enhanced or restored it',
    },
    automatic: MAPPED,
    warnings: [],
  },

  // --- Wildfire resilience -------------------------------------------------
  {
    id: 'goat-grazing',
    theme: 'Wildfire resilience',
    activity: 'Grazing goats or sheep on brush',
    keywords: ['goat', 'sheep', 'graz', 'herd', 'brush'],
    name: 'Acres of fuels treated by grazing',
    kind: 'output',
    unit: 'acres',
    decimalPlaces: 1,
    countingRule: 'sum',
    definition:
      'Acres where a contracted herd removed dry brush and ladder fuels to the grazing prescription. Ground grazed twice in a season counts twice — each pass is work done.',
    reporterGuidance:
      'Report acres from the grazing contractor’s map, one entry per pass. Herd size and herding days are not reported here.',
    say: 'how many acres of brush the herd cleared each year',
    sentence: 'On this project, this year, our herd cleared fuels from [N] acres',
    split: {
      source: 'new',
      name: 'Treatment settings',
      label: 'setting',
      options: ['Within 100 feet of a structure', 'Open ground', 'Unspecified'],
      say: 'and whether it was right behind homes or out on open ground',
    },
    automatic: MAPPED,
    warnings: [
      'Herd size and herding days describe effort, not ground treated, so they are left out. Two programs with the same acres and twice the goats did the same work.',
    ],
  },
  {
    id: 'fuels-thinning',
    theme: 'Wildfire resilience',
    activity: 'Thinning and prescribed burning',
    keywords: ['thin', 'prescribed', 'burn', 'mastication', 'fuels', 'ladder'],
    name: 'Acres of forest fuels treated',
    kind: 'output',
    unit: 'acres',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'Acres where fuels were thinned, masticated or burned under an approved prescription.',
    reporterGuidance: 'Report the extent actually treated, not the unit planned.',
    say: 'how many acres of forest we treated for wildfire',
    sentence: 'On this project, this year, we treated [N] acres of forest fuels',
    split: {
      source: 'shared',
      schemaId: 'fuels-treatment-types',
      label: 'treatment type',
      say: 'by treatment type',
    },
    automatic: MAPPED,
    warnings: [
      'This overlaps “Acres of forest fuels reduction treatment”, which is already collecting. Two measures for the same work split one number across two totals — consider asking projects to report on the existing one.',
    ],
  },
  {
    id: 'fuel-breaks',
    theme: 'Wildfire resilience',
    activity: 'Building and keeping up fuel breaks',
    keywords: ['fuel break', 'firebreak', 'shaded fuel', 'defensible'],
    name: 'Miles of fuel break built or maintained',
    kind: 'output',
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    definition: 'Miles of fuel break cut to its design width, or brought back to it by maintenance.',
    reporterGuidance: 'Measure along the centerline. A break maintained this year is reported again.',
    say: 'how many miles of fuel break we built or kept up',
    sentence: 'On this project, this year, we built or maintained [N] miles of fuel break',
    split: {
      source: 'system',
      schemaId: 'system-initial-vs-maintenance',
      label: 'new or maintained',
      say: 'and how much of it was new',
    },
    automatic: ['system-watershed', 'system-reporting-year'],
    warnings: [],
  },

  // --- Salmon & steelhead recovery ----------------------------------------
  {
    id: 'carcass-placement',
    theme: 'Salmon & steelhead recovery',
    activity: 'Placing salmon carcasses for nutrients',
    keywords: ['carcass', 'nutrient'],
    name: 'Pounds of salmon carcasses placed',
    kind: 'output',
    unit: 'pounds',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'Weight of spawned-out hatchery salmon placed in project streams to return nutrients to the food web.',
    reporterGuidance: 'Report the weight from the delivery ticket or tote tally, weighed the same way every time.',
    say: 'how many pounds of salmon carcasses we put back into the creeks',
    sentence: 'On this project, this year, we placed [N] pounds of salmon carcasses in streams',
    split: {
      source: 'shared',
      schemaId: 'focal-species',
      label: 'species',
      say: 'and which species they were',
    },
    automatic: ['system-watershed', 'system-reporting-year'],
    warnings: [
      'Your shared Focal species list also holds a frog, a turtle and a bird, and reporters will be offered all of them. A salmon-only list would be tidier, at the cost of one more list to keep in step.',
    ],
  },
  {
    id: 'habitat-opened',
    theme: 'Salmon & steelhead recovery',
    activity: 'Opening habitat above barriers',
    keywords: ['barrier', 'culvert', 'passage', 'dam removal', 'opened', 'upstream'],
    name: 'Stream miles opened to fish passage',
    kind: 'output',
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    definition: 'Miles of stream newly reachable by migrating fish once a barrier was removed or fixed, up to the next barrier.',
    reporterGuidance: 'Measure upstream to the next known barrier, after the passage assessment is signed.',
    say: 'how many miles of stream fish can reach now that weren’t open before',
    sentence: 'On this project, this year, we opened [N] miles of stream to fish',
    split: {
      source: 'shared',
      schemaId: 'barrier-types',
      label: 'barrier type',
      say: 'by the kind of barrier we removed',
    },
    automatic: ['system-watershed', 'system-reporting-year'],
    warnings: [
      'Barriers removed are already counted by “Fish passage barriers removed”. This one adds what each removal was worth — keep both only if your funder asks for miles.',
    ],
  },
  {
    id: 'instream-structures',
    theme: 'Salmon & steelhead recovery',
    activity: 'Adding wood and gravel to the channel',
    keywords: ['large wood', 'log', 'gravel', 'boulder', 'instream', 'in-stream'],
    name: 'Instream habitat structures installed',
    kind: 'output',
    unit: 'each',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'Engineered structures placed in the channel to create pools, cover or spawning gravel.',
    reporterGuidance: 'Count each structure on the as-built drawing once.',
    say: 'how many habitat structures we put in the stream',
    sentence: 'On this project, this year, we installed [N] instream structures',
    split: {
      source: 'new',
      name: 'Instream structure types',
      label: 'structure type',
      options: ['Large wood', 'Boulder cluster', 'Spawning gravel', 'Unspecified'],
      say: 'by structure type',
    },
    automatic: ['system-watershed', 'system-reporting-year'],
    warnings: [],
  },

  // --- Water quality -------------------------------------------------------
  {
    id: 'road-sediment',
    theme: 'Water quality',
    activity: 'Fixing roads that bleed sediment',
    keywords: ['road', 'sediment', 'erosion', 'crossing'],
    name: 'Tons of sediment prevented per year',
    kind: 'output',
    unit: 'tons per year',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'Estimated annual sediment no longer delivered to streams after road treatment, from the road inventory method.',
    reporterGuidance: 'Use the same inventory method before and after treatment. Report once, when the work is complete.',
    say: 'how much sediment we keep out of the creeks each year',
    sentence: 'On this project, this year, we prevented [N] tons per year of sediment',
    split: {
      source: 'new',
      name: 'Road treatments',
      label: 'road treatment',
      options: ['Decommissioned', 'Drainage upgraded', 'Crossing replaced', 'Unspecified'],
      say: 'by what we did to the road',
    },
    automatic: MAPPED,
    warnings: [
      'This is an estimate from a model, not a measurement. Name the inventory method in the definition so two projects compute it the same way.',
    ],
  },
  {
    id: 'stream-temperature',
    theme: 'Water quality',
    activity: 'Monitoring stream temperature',
    keywords: ['temperature', 'logger', '°f', '°c', 'degrees', 'cooler'],
    name: 'Summer stream temperature',
    kind: 'outcome',
    unit: 'degrees Celsius',
    decimalPlaces: 1,
    countingRule: 'latest-per-place',
    definition: 'Seven-day average of daily maximum water temperature in summer, from a logger at a fixed station.',
    reporterGuidance: 'Report the seven-day average maximum from the same station every year.',
    say: 'how warm our streams get in summer',
    sentence: 'At this station, this summer, the seven-day maximum was [N] °C',
    automatic: ['system-watershed', 'system-reporting-year'],
    warnings: [
      'A temperature is a condition, not work done. Readings do not add up, so this measure will show the latest reading per station and no program total.',
    ],
  },

  // --- Flood risk reduction ------------------------------------------------
  {
    id: 'floodplain',
    theme: 'Flood risk reduction',
    activity: 'Reconnecting floodplains',
    keywords: ['floodplain', 'levee', 'side channel', 'setback'],
    name: 'Acres of floodplain reconnected',
    kind: 'output',
    unit: 'acres',
    decimalPlaces: 0,
    countingRule: 'spatial-union',
    definition: 'Acres that flood at the two-year flow once a levee was set back, breached or lowered.',
    reporterGuidance: 'Use the inundation map from the project’s hydraulic model at the two-year flow.',
    say: 'how many acres of floodplain the river can reach again',
    sentence: 'On this project, this year, we reconnected [N] acres of floodplain',
    split: {
      source: 'new',
      name: 'Reconnection methods',
      label: 'method',
      options: ['Levee setback', 'Levee breach', 'Side channel', 'Unspecified'],
      say: 'by how we reconnected it',
    },
    automatic: MAPPED,
    warnings: [],
  },
  {
    id: 'crossings',
    theme: 'Flood risk reduction',
    activity: 'Upsizing culverts and crossings',
    keywords: ['upsiz', 'bridge', 'undersized'],
    name: 'Stream crossings upgraded',
    kind: 'output',
    unit: 'each',
    decimalPlaces: 0,
    countingRule: 'distinct-places',
    definition: 'Crossings rebuilt to pass the hundred-year flow.',
    reporterGuidance: 'Count a crossing once, when the replacement is in service.',
    say: 'how many crossings we rebuilt to handle big floods',
    sentence: 'On this project, this year, we upgraded [N] stream crossings',
    automatic: ['system-watershed', 'system-reporting-year'],
    warnings: [],
  },

  // --- Water supply reliability -------------------------------------------
  {
    id: 'water-conserved',
    theme: 'Water supply reliability',
    activity: 'Saving water on farms',
    keywords: ['acre-feet', 'acre feet', 'conserv', 'irrigation', 'saved water'],
    name: 'Water conserved',
    kind: 'output',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'Water no longer diverted each year because of efficiency upgrades, measured at the diversion.',
    reporterGuidance: 'Report the difference at the diversion meter against the three-year average before the upgrade.',
    say: 'how much water we saved',
    sentence: 'On this project, this year, we saved [N] of water',
    automatic: UNMAPPED,
    warnings: [
      'Water savings are reported in acre-feet, which is not on the unit list. The draft leaves the unit empty — ask an administrator to add acre-feet before this can collect.',
    ],
  },
  {
    id: 'meadow',
    theme: 'Water supply reliability',
    activity: 'Restoring meadows to hold water',
    keywords: ['meadow', 'groundwater', 'beaver'],
    name: 'Acres of meadow restored',
    kind: 'output',
    unit: 'acres',
    decimalPlaces: 0,
    countingRule: 'spatial-union',
    definition: 'Acres of meadow where the channel was raised or plugged so the surface holds water into summer.',
    reporterGuidance: 'Report the acres inside the design’s wetted footprint once the structures are complete.',
    say: 'how many acres of meadow we restored',
    sentence: 'On this project, this year, we restored [N] acres of meadow',
    split: {
      source: 'shared',
      schemaId: 'restoration-actions',
      label: 'restoration action',
      say: 'and whether we created, enhanced or restored it',
    },
    automatic: MAPPED,
    warnings: [],
  },

  // --- Public access & recreation -----------------------------------------
  {
    id: 'trails',
    theme: 'Public access & recreation',
    activity: 'Building and fixing trails',
    keywords: ['trail', 'path', 'boardwalk'],
    name: 'Miles of trail built or improved',
    kind: 'output',
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    definition: 'Miles of trail built new or brought back to standard.',
    reporterGuidance: 'Measure the finished tread with a wheel or GPS track.',
    say: 'how many miles of trail we built or fixed',
    sentence: 'On this project, this year, we built or improved [N] miles of trail',
    split: {
      source: 'system',
      schemaId: 'system-initial-vs-maintenance',
      label: 'new or maintained',
      say: 'and how much of it was new',
    },
    automatic: ['system-watershed', 'system-reporting-year'],
    warnings: [],
  },
  {
    id: 'outreach',
    theme: 'Public access & recreation',
    activity: 'Running outreach and volunteer events',
    keywords: ['outreach', 'event', 'volunteer', 'school', 'people reached', 'attend'],
    name: 'People reached at events',
    kind: 'output',
    unit: 'people',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'People who attended a project event, from the sign-in sheet.',
    reporterGuidance: 'Count sign-ins, not invitations. Someone at two events counts twice.',
    say: 'how many people came to our events',
    sentence: 'On this project, this year, [N] people came to our events',
    split: {
      source: 'new',
      name: 'Event types',
      label: 'event type',
      options: ['School program', 'Volunteer day', 'Public meeting', 'Unspecified'],
      say: 'by the kind of event',
    },
    automatic: UNMAPPED,
    warnings: [
      'Attendance says who showed up, not what they learned. If the funder wants to know what changed, that needs a survey, not this number.',
    ],
  },
];

// ---------------------------------------------------------------------------
// The interview
// ---------------------------------------------------------------------------

export const activitiesFor = (theme: string): DraftActivity[] =>
  DRAFT_ACTIVITIES.filter((a) => a.theme === theme);

export const getActivity = (id: string): DraftActivity | undefined =>
  DRAFT_ACTIVITIES.find((a) => a.id === id);

/** The cost question, as competing sentences the author would say. */
export const FUNDER_QUESTION = 'Which is closest to what you need to tell your funder?';

export interface FunderAnswer {
  split: boolean;
  label: string;
}

export const funderAnswers = (a: DraftActivity): FunderAnswer[] => {
  const total = { split: false, label: capitalise(a.say) };
  return a.split ? [total, { split: true, label: `${capitalise(a.say)}, ${a.split.say}` }] : [total];
};

/**
 * The line under the cost question — what the choice costs a reporter, said
 * while it is still open. A system split is free, and saying so is the point:
 * the author should not pay for a division nobody has to answer.
 */
export const costOfSplit = (a: DraftActivity): string => {
  if (!a.split) return 'One number per project, every year.';
  if (a.split.source === 'system')
    return `The ${a.split.label} split comes from the record, so either answer costs reporters the same: one number per project, every year.`;
  return `One total is one number per project, every year. Splitting by ${a.split.label} adds a pick to every entry, on every project, for as long as the measure runs.`;
};

export const claimFor = (a: DraftActivity, split: boolean): string =>
  `I need to tell my funder ${a.say}${split && a.split ? `, ${a.split.say}` : ''}.`;

// ---------------------------------------------------------------------------
// Drafting from a claim
// ---------------------------------------------------------------------------

/** Wording that asks for a split — "by", "whether", "which", "broken down". */
const SPLIT_CUE = /\b(by|whether|which|broken down|split)\b/;

/**
 * Clauses that ask a measure to prove an outcome it cannot. The draft leaves
 * them out and says why — the hackathon's best moment on stage.
 */
const OUTCOME_CUES: { pattern: RegExp; warning: string }[] = [
  {
    pattern: /\b(more|extra)\b[^.]*\b(fish|salmon|juveniles?|young)\b|\bbecause of (it|this|them)\b/,
    warning:
      'Your claim also asks how much difference the work made. Proving that needs a study against untreated places, not a reporting field, so this measure leaves it out.',
  },
  {
    pattern: /\b(happier|healthier|better off|improv\w*)\b/,
    warning:
      'Your claim asks whether things got better. Reporters would each judge that differently, so this measure leaves it out. If it matters, give it its own outcome measure.',
  },
];

export interface MeasureDraftResult {
  activity: DraftActivity;
  claim: string;
  split: boolean;
  warnings: string[];
}

export type DraftOutcome = { ok: true; draft: MeasureDraftResult } | { ok: false };

const score = (a: DraftActivity, text: string): number =>
  a.keywords.reduce((n, k) => n + (text.includes(k) ? 1 : 0), 0);

/** Which scripted activity a free-text description is about, if any. */
export const matchActivity = (text: string): DraftActivity | undefined => {
  const lower = text.toLowerCase();
  let best: DraftActivity | undefined;
  let bestScore = 0;
  for (const a of DRAFT_ACTIVITIES) {
    const s = score(a, lower);
    if (s > bestScore) {
      best = a;
      bestScore = s;
    }
  }
  return best;
};

/**
 * The one drafting call both doors end at. An interview hands it the
 * activity it already resolved; the claim box hands it only text.
 */
export const draftFromClaim = (claim: string, known?: DraftActivity): DraftOutcome => {
  const activity = known ?? matchActivity(claim);
  if (!activity) return { ok: false };
  const lower = claim.toLowerCase();
  const split = Boolean(activity.split) && (SPLIT_CUE.test(lower) || lower.includes(activity.split!.say.toLowerCase()));
  const extra = OUTCOME_CUES.filter((c) => c.pattern.test(lower)).map((c) => c.warning);
  return { ok: true, draft: { activity, claim, split, warnings: [...extra, ...activity.warnings] } };
};

/** The reporter's sentence, finished with the split when there is one. */
export const sentenceFor = (d: MeasureDraftResult): string =>
  `${d.activity.sentence}${d.split && d.activity.split ? `, by ${d.activity.split.label}` : ''}.`;

/** How many picks the draft asks of a reporter on every entry. */
export const reporterPicks = (d: MeasureDraftResult): number =>
  d.split && d.activity.split && d.activity.split.source !== 'system' ? 1 : 0;


export const payoff = (d: MeasureDraftResult): string => {
  const sums = d.activity.kind === 'output';
  const by = d.split && d.activity.split ? `, split by ${d.activity.split.label}` : '';
  return sums
    ? `A program total${by}, for any year and any project.`
    : `The latest reading at every station${by}. No program total, because readings do not add up.`;
};

const capitalise = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
