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
//   1. THE INTERVIEW OPENS ON CLASSIFICATIONS — the goal vocabulary measures
//      and projects share — and each draft also guesses one THEME (the
//      fifteen-row lookup the hackathon and PM 2 both carry; reconciled
//      2026-10-09).
//   2. A SPLIT IS A BREAKDOWN THE MEASURE OWNS: a question and its closed
//      list, as PM 2 drafts them. Shared, imported and system-answered lists
//      went with the PM 2 reconciliation (2026-10-09), so every split is the
//      measure's own copy and "Unspecified" is appended on save.
//
// INVENTED CONTENT. Every activity, measure and warning below is fabricated
// from public restoration practice. Deterministic: literal data, no
// randomness, no clock.

import type { ClassificationName } from './firma2-projects';
import { withUnspecified } from './firma2-performance-measures';
import type { Breakdown, CountingRule, MeasureUnit } from './firma2-performance-measures';

// ---------------------------------------------------------------------------
// The activities — one scripted draft each
// ---------------------------------------------------------------------------

/** How a draft divides its number: one breakdown the measure will own. */
export interface DraftSplit {
  /** The breakdown's question, as the reporter reads it. */
  question: string;
  /** How the split is named in a sentence — "by treatment type". */
  label: string;
  options: string[];
}

export interface DraftActivity {
  id: string;
  /** The interview chip this activity answers under. */
  classification: ClassificationName;
  /** The answer chip in the interview — the work, in the author's words. */
  activity: string;
  /** Lower-case fragments that place a typed claim on this activity. */
  keywords: string[];
  name: string;
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
  /** Five-test notes the draft always carries. */
  warnings: string[];
}

export const DRAFT_ACTIVITIES: DraftActivity[] = [
  // --- Riparian & wetland habitat -----------------------------------------
  {
    id: 'riparian-treatment',
    classification: 'Riparian & wetland habitat',
    activity: 'Planting and fencing along streams',
    keywords: ['riparian', 'streamside', 'streambank', 'planting', 'planted', 'willow', 'cottonwood', 'fenc'],
    name: 'Acres of riparian habitat treated',
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
      question: 'Riparian treatment',
      options: ['Planting', 'Fencing', 'Invasive removal', 'Natural recruitment'],
      label: 'treatment',
      say: 'broken down by how we treated it',
    },
    warnings: [
      'Fencing and planting the same ground are two entries, one per treatment. Say so in the guidance, or reporters will pick one and the other goes uncounted.',
    ],
  },
  {
    id: 'invasive-removal',
    classification: 'Riparian & wetland habitat',
    activity: 'Pulling out invasive plants',
    keywords: ['invasive', 'blackberry', 'arundo', 'weed', 'tamarisk'],
    name: 'Acres of invasive vegetation removed',
    unit: 'acres',
    decimalPlaces: 1,
    countingRule: 'sum',
    definition:
      'Acres where invasive plants were removed to the point that natives can establish. Re-treating the same ground in a later year does not add new acres.',
    reporterGuidance: 'Map the ground you cleared. Follow-up passes on the same patch are not new acres.',
    say: 'how many acres we cleared of invasive plants',
    sentence: 'On this project, this year, we cleared invasive plants from [N] acres',
    split: {
      question: 'Removal method',
      label: 'method',
      options: ['Hand pulling', 'Mechanical', 'Herbicide', 'Grazing', 'Unspecified'],
      say: 'and how we removed them',
    },
    warnings: [],
  },
  {
    id: 'wetland-restoration',
    classification: 'Riparian & wetland habitat',
    activity: 'Restoring or creating wetlands',
    keywords: ['wetland', 'marsh', 'vernal pool'],
    name: 'Acres of wetland restored',
    unit: 'acres',
    decimalPlaces: 1,
    countingRule: 'sum',
    definition:
      'Acres of wetland where grading, plugging or planting is complete and the site holds water through its first wet season.',
    reporterGuidance: 'Report once the site has held water through one wet season, not when construction ends.',
    say: 'how many acres of wetland we restored',
    sentence: 'On this project, this year, we restored [N] acres of wetland',
    split: {
      question: 'Restoration action',
      options: ['Created', 'Enhanced', 'Restored'],
      label: 'restoration action',
      say: 'and whether we created, enhanced or restored it',
    },
    warnings: [],
  },

  // --- Wildfire resilience -------------------------------------------------
  {
    id: 'goat-grazing',
    classification: 'Wildfire resilience',
    activity: 'Grazing goats or sheep on brush',
    keywords: ['goat', 'sheep', 'graz', 'herd', 'brush'],
    name: 'Acres of fuels treated by grazing',
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
      question: 'Treatment setting',
      label: 'setting',
      options: ['Within 100 feet of a structure', 'Open ground', 'Unspecified'],
      say: 'and whether it was right behind homes or out on open ground',
    },
    warnings: [
      'Herd size and herding days describe effort, not ground treated, so they are left out. Two programs with the same acres and twice the goats did the same work.',
    ],
  },
  {
    id: 'fuels-thinning',
    classification: 'Wildfire resilience',
    activity: 'Thinning and prescribed burning',
    keywords: ['thin', 'prescribed', 'burn', 'mastication', 'fuels', 'ladder'],
    name: 'Acres of forest fuels treated',
    unit: 'acres',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'Acres where fuels were thinned, masticated or burned under an approved prescription.',
    reporterGuidance: 'Report the extent actually treated, not the unit planned.',
    say: 'how many acres of forest we treated for wildfire',
    sentence: 'On this project, this year, we treated [N] acres of forest fuels',
    split: {
      question: 'Treatment type',
      options: ['Biomass removal', 'Broadcast burning', 'Pile burning', 'Mastication', 'Hand thinning'],
      label: 'treatment type',
      say: 'by treatment type',
    },
    // The overlap with the existing fuels measure is no longer scripted here:
    // the measure page's "You may already measure this" finds it, and every
    // other duplicate, from the catalog itself (src/lib/measure-similar.ts).
    warnings: [],
  },
  {
    id: 'fuel-breaks',
    classification: 'Wildfire resilience',
    activity: 'Building and keeping up fuel breaks',
    keywords: ['fuel break', 'firebreak', 'shaded fuel', 'defensible'],
    name: 'Miles of fuel break built or maintained',
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    definition: 'Miles of fuel break cut to its design width, or brought back to it by maintenance.',
    reporterGuidance: 'Measure along the centerline. A break maintained this year is reported again.',
    say: 'how many miles of fuel break we built or kept up',
    sentence: 'On this project, this year, we built or maintained [N] miles of fuel break',
    split: {
      question: 'New or maintained',
      options: ['New', 'Maintained'],
      label: 'new or maintained',
      say: 'and how much of it was new',
    },
    warnings: [],
  },

  // --- Salmon & steelhead recovery ----------------------------------------
  {
    id: 'carcass-placement',
    classification: 'Salmon & steelhead recovery',
    activity: 'Placing salmon carcasses for nutrients',
    keywords: ['carcass', 'nutrient'],
    name: 'Pounds of salmon carcasses placed',
    unit: 'pounds',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'Weight of spawned-out hatchery salmon placed in project streams to return nutrients to the food web.',
    reporterGuidance: 'Report the weight from the delivery ticket or tote tally, weighed the same way every time.',
    say: 'how many pounds of salmon carcasses we put back into the creeks',
    sentence: 'On this project, this year, we placed [N] pounds of salmon carcasses in streams',
    split: {
      question: 'Focal species',
      options: ['Chinook salmon', 'Steelhead', 'Coho salmon', 'Willow flycatcher', 'Foothill yellow-legged frog', 'Western pond turtle'],
      label: 'species',
      say: 'and which species they were',
    },
    warnings: [
      'This species list also holds a frog, a turtle and a bird. Cut it to the salmon you place carcasses for, so reporters are not offered species that never apply.',
    ],
  },
  {
    id: 'habitat-opened',
    classification: 'Salmon & steelhead recovery',
    activity: 'Opening habitat above barriers',
    keywords: ['barrier', 'culvert', 'passage', 'dam removal', 'opened', 'upstream'],
    name: 'Stream miles opened to fish passage',
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    definition: 'Miles of stream newly reachable by migrating fish once a barrier was removed or fixed, up to the next barrier.',
    reporterGuidance: 'Measure upstream to the next known barrier, after the passage assessment is signed.',
    say: 'how many miles of stream fish can reach now that weren’t open before',
    sentence: 'On this project, this year, we opened [N] miles of stream to fish',
    split: {
      question: 'Barrier type',
      options: ['Culvert', 'Dam', 'Weir', 'Push-up dam', 'Flashboard'],
      label: 'barrier type',
      say: 'by the kind of barrier we removed',
    },
    warnings: [
      'Barriers removed are already counted by “Fish passage barriers removed”. This one adds what each removal was worth — keep both only if your funder asks for miles.',
    ],
  },
  {
    id: 'instream-structures',
    classification: 'Salmon & steelhead recovery',
    activity: 'Adding wood and gravel to the channel',
    keywords: ['large wood', 'log', 'gravel', 'boulder', 'instream', 'in-stream'],
    name: 'Instream habitat structures installed',
    unit: 'each',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'Engineered structures placed in the channel to create pools, cover or spawning gravel.',
    reporterGuidance: 'Count each structure on the as-built drawing once.',
    say: 'how many habitat structures we put in the stream',
    sentence: 'On this project, this year, we installed [N] instream structures',
    split: {
      question: 'Instream structure type',
      label: 'structure type',
      options: ['Large wood', 'Boulder cluster', 'Spawning gravel', 'Unspecified'],
      say: 'by structure type',
    },
    warnings: [],
  },

  // --- Water quality -------------------------------------------------------
  {
    id: 'road-sediment',
    classification: 'Water quality',
    activity: 'Fixing roads that bleed sediment',
    keywords: ['road', 'sediment', 'erosion', 'crossing'],
    name: 'Tons of sediment prevented per year',
    unit: 'tons per year',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'Estimated annual sediment no longer delivered to streams after road treatment, from the road inventory method.',
    reporterGuidance: 'Use the same inventory method before and after treatment. Report once, when the work is complete.',
    say: 'how much sediment we keep out of the creeks each year',
    sentence: 'On this project, this year, we prevented [N] tons per year of sediment',
    split: {
      question: 'Road treatment',
      label: 'road treatment',
      options: ['Decommissioned', 'Drainage upgraded', 'Crossing replaced', 'Unspecified'],
      say: 'by what we did to the road',
    },
    warnings: [
      'This is an estimate from a model, not a measurement. Name the inventory method in the definition so two projects compute it the same way.',
    ],
  },
  {
    id: 'stream-temperature',
    classification: 'Water quality',
    activity: 'Monitoring stream temperature',
    keywords: ['temperature', 'logger', '°f', '°c', 'degrees', 'cooler'],
    name: 'Summer stream temperature',
    unit: 'degrees Celsius',
    decimalPlaces: 1,
    countingRule: 'no-sum',
    definition: 'Seven-day average of daily maximum water temperature in summer, from a logger at a fixed station.',
    reporterGuidance: 'Report the seven-day average maximum from the same station every year.',
    say: 'how warm our streams get in summer',
    sentence: 'At this station, this summer, the seven-day maximum was [N] °C',
    warnings: [
      'A temperature is a condition, not work done. Readings do not add up, so this measure shows each reading on its own and no program total.',
    ],
  },

  // --- Flood risk reduction ------------------------------------------------
  {
    id: 'floodplain',
    classification: 'Flood risk reduction',
    activity: 'Reconnecting floodplains',
    keywords: ['floodplain', 'levee', 'side channel', 'setback'],
    name: 'Acres of floodplain reconnected',
    unit: 'acres',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'Acres that flood at the two-year flow once a levee was set back, breached or lowered.',
    reporterGuidance: 'Use the inundation map from the project’s hydraulic model at the two-year flow.',
    say: 'how many acres of floodplain the river can reach again',
    sentence: 'On this project, this year, we reconnected [N] acres of floodplain',
    split: {
      question: 'Reconnection method',
      label: 'method',
      options: ['Levee setback', 'Levee breach', 'Side channel', 'Unspecified'],
      say: 'by how we reconnected it',
    },
    warnings: [],
  },
  {
    id: 'crossings',
    classification: 'Flood risk reduction',
    activity: 'Upsizing culverts and crossings',
    keywords: ['upsiz', 'bridge', 'undersized'],
    name: 'Stream crossings upgraded',
    unit: 'each',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'Crossings rebuilt to pass the hundred-year flow.',
    reporterGuidance: 'Count a crossing once, when the replacement is in service.',
    say: 'how many crossings we rebuilt to handle big floods',
    sentence: 'On this project, this year, we upgraded [N] stream crossings',
    warnings: [],
  },

  // --- Water supply reliability -------------------------------------------
  {
    id: 'water-conserved',
    classification: 'Water supply reliability',
    activity: 'Saving water on farms',
    keywords: ['acre-feet', 'acre feet', 'conserv', 'irrigation', 'saved water'],
    name: 'Water conserved',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'Water no longer diverted each year because of efficiency upgrades, measured at the diversion.',
    reporterGuidance: 'Report the difference at the diversion meter against the three-year average before the upgrade.',
    say: 'how much water we saved',
    sentence: 'On this project, this year, we saved [N] of water',
    warnings: [
      'Water savings are reported in acre-feet, which is not on the unit list. The draft leaves the unit empty — ask an administrator to add acre-feet before this can collect.',
    ],
  },
  {
    id: 'meadow',
    classification: 'Water supply reliability',
    activity: 'Restoring meadows to hold water',
    keywords: ['meadow', 'groundwater', 'beaver'],
    name: 'Acres of meadow restored',
    unit: 'acres',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'Acres of meadow where the channel was raised or plugged so the surface holds water into summer.',
    reporterGuidance: 'Report the acres inside the design’s wetted footprint once the structures are complete.',
    say: 'how many acres of meadow we restored',
    sentence: 'On this project, this year, we restored [N] acres of meadow',
    split: {
      question: 'Restoration action',
      options: ['Created', 'Enhanced', 'Restored'],
      label: 'restoration action',
      say: 'and whether we created, enhanced or restored it',
    },
    warnings: [],
  },

  // --- Public access & recreation -----------------------------------------
  {
    id: 'trails',
    classification: 'Public access & recreation',
    activity: 'Building and fixing trails',
    keywords: ['trail', 'path', 'boardwalk'],
    name: 'Miles of trail built or improved',
    unit: 'miles',
    decimalPlaces: 1,
    countingRule: 'sum',
    definition: 'Miles of trail built new or brought back to standard.',
    reporterGuidance: 'Measure the finished tread with a wheel or GPS track.',
    say: 'how many miles of trail we built or fixed',
    sentence: 'On this project, this year, we built or improved [N] miles of trail',
    split: {
      question: 'New or maintained',
      options: ['New', 'Maintained'],
      label: 'new or maintained',
      say: 'and how much of it was new',
    },
    warnings: [],
  },
  {
    id: 'outreach',
    classification: 'Public access & recreation',
    activity: 'Running outreach and volunteer events',
    keywords: ['outreach', 'event', 'volunteer', 'school', 'people reached', 'attend'],
    name: 'People reached at events',
    unit: 'people',
    decimalPlaces: 0,
    countingRule: 'sum',
    definition: 'People who attended a project event, from the sign-in sheet.',
    reporterGuidance: 'Count sign-ins, not invitations. Someone at two events counts twice.',
    say: 'how many people came to our events',
    sentence: 'On this project, this year, [N] people came to our events',
    split: {
      question: 'Event type',
      label: 'event type',
      options: ['School program', 'Volunteer day', 'Public meeting', 'Unspecified'],
      say: 'by the kind of event',
    },
    warnings: [
      'Attendance says who showed up, not what they learned. If the funder wants to know what changed, that needs a survey, not this number.',
    ],
  },
];

// ---------------------------------------------------------------------------
// The interview
// ---------------------------------------------------------------------------

export const activitiesFor = (classification: string): DraftActivity[] =>
  DRAFT_ACTIVITIES.filter((a) => a.classification === classification);

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
 * while it is still open.
 */
export const costOfSplit = (a: DraftActivity): string => {
  if (!a.split) return 'One number per project, every year.';
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

/** A draft's split as the breakdown its measure will own, "Unspecified" appended. */
export const breakdownFromSplit = (split: DraftSplit, id: string): Breakdown => ({
  id,
  question: split.question,
  options: withUnspecified([...split.options]),
});

/** The reporter's sentence, finished with the split when there is one. */
export const sentenceFor = (d: MeasureDraftResult): string =>
  `${d.activity.sentence}${d.split && d.activity.split ? `, by ${d.activity.split.label}` : ''}.`;

/** How many picks the draft asks of a reporter on every entry. */
export const reporterPicks = (d: MeasureDraftResult): number =>
  d.split && d.activity.split ? 1 : 0;


export const payoff = (d: MeasureDraftResult): string => {
  const sums = d.activity.countingRule === 'sum';
  const by = d.split && d.activity.split ? `, split by ${d.activity.split.label}` : '';
  return sums
    ? `A program total${by}, for any year and any project.`
    : `Each reading on its own${by}. No program total, because readings do not add up.`;
};

const capitalise = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
