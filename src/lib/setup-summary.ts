// The finish of setup, as data: what the tenant set up, read back as one
// paragraph about the program, and the next steps that have a screen.
//
// TWO LAYERS, BOTH PURE. programPortrait() reads a draft into one flat record of
// names, counts and labels; finishRuns() turns that record into the paragraph,
// as a list of runs. No DOM, no storage write, no import.meta.env, so a bun
// script can run the whole file against completeSetupDraft() or the empty draft
// and print what the hub will say. The panel stays thin: it calls these and
// builds nodes.
//
// ONE PARAGRAPH WITH TOKENS, 2026-09-23. Andy redirected the finish the same
// day it was built: no separate page, and no three columns of body copy. The
// portrait is one paragraph of four or five sentences, set large, where the
// facts are TOKENS the eye lands on: the program's name, its site, its color,
// its noun, and one token per milestone fact. So the output is runs, not
// strings. A text run is plain prose; every other run is a token and carries
// what the panel needs to draw it, and nothing it does not.
//
// THE MONEY AND YEAR RULES STAY PROSE. Both are plain text in the third
// sentence, so the paragraph does not become a wall of chips. Tokens are the
// facts a reader would look for; the rules are how the program works. The
// proposals answer is not on the paragraph at all (Andy, 2026-09-23).
//
// SENTENCES SKIP WHAT IS UNANSWERED. A clause whose answer is null or zero is
// dropped rather than printed with a placeholder, so the empty draft yields the
// first sentence and little else, and never "0 stages" or "undefined".
//
// ROUTES ARE BASE-LESS. A next step names a root-relative route; the panel
// applies withBase(), because withBase reads import.meta.env and this module
// has to run outside Astro.

import {
  defaultProjectNoun,
  journeyByKey,
  siteVisibilities,
  stageOptions,
  tenantColors,
  tenantOrganization,
} from '../data/firma2-setup';
import type {
  ClassificationLimit,
  JourneyKey,
  OutsidePolicy,
  PersonRole,
  SiteVisibility,
  SpatialAreaKind,
  Stewardship,
} from '../data/firma2-setup';
import {
  confirmedClassifications,
  confirmedFundingSources,
  confirmedImportProjects,
  confirmedMeasures,
  confirmedPeople,
  confirmedSpatialAreas,
  intentOptionsFor,
  journeyStatuses,
  listOrganizations,
  readSetupDraft,
  setupCompletion,
  usedStages,
} from './setup-draft';
import type { SetupDraft } from './setup-draft';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** One chosen intent option, as the admin saw it. */
export interface ShapeAnswer {
  optionId: string;
  label: string;
}

/** A confirmed record list, reduced to what a sentence can carry. */
export interface RecordTally {
  count: number;
  /** Every confirmed name, in roster order. Composers pick from it; they never print it whole. */
  names: string[];
}

export interface ProgramPortrait {
  /** dbo.Tenant display name, or the directory name while unanswered. */
  name: string;
  shortName: string;
  /** The project label, both forms, and whether the tenant changed it from "Project". */
  noun: { singular: string; plural: string; renamed: boolean };
  /** The chosen swatch; null until answered. */
  color: { label: string; hue: number } | null;
  visibility: SiteVisibility | null;
  /** The visibility option's label, "Public site" or "Signed-in only". */
  visibilityLabel: string | null;
  /** The three Program shape answers. Null where unanswered. */
  shape: { money: ShapeAnswer | null; time: ShapeAnswer | null; proposals: ShapeAnswer | null };
  /** Confirmed organizations, the tenant's own included. */
  organizations: RecordTally;
  fundingSources: RecordTally;
  classifications: RecordTally & {
    limit: ClassificationLimit | null;
    /** What one classification is called, from Start's grouping answer: "program area". */
    termSingular: string;
    termPlural: string;
  };
  stages: RecordTally & { defaultStage: string | null };
  spatialAreas: RecordTally & {
    /** The areas' shared kind, "watershed"; "area" when kinds are mixed or none. */
    termSingular: string;
    termPlural: string;
    outsidePolicy: OutsidePolicy | null;
    /** True once the Spatial areas milestone is confirmed, which is when zero areas is an answer. */
    answered: boolean;
  };
  projects: RecordTally;
  people: RecordTally & {
    roles: Record<PersonRole, number>;
    /** Confirmed people with no email; an invitation needs one. */
    withoutEmail: number;
    stewardship: Stewardship | null;
  };
  /** Confirmed performance measures. */
  measures: RecordTally;
  milestones: { done: number; total: number };
}

/**
 * One run of the finish paragraph. A discriminated union rather than one run
 * with optional fields, so a token cannot exist without what draws it: a
 * milestone token always has its journey, icon and hue; a color token always
 * has its hue; a tenant token (name, site, noun) has the tenant's hue, or null
 * before a color is chosen, which draws it in the brand's own color.
 *
 * Counts and states are one kind, `milestone`: "12 organizations" and
 * "performance measures" draw the same way, from the same journey record, and
 * a split kind would be a distinction the panel never renders.
 */
export type PortraitRun =
  | { kind: 'text'; text: string }
  | { kind: 'name' | 'visibility' | 'noun'; text: string; hue: number | null }
  | { kind: 'color'; text: string; hue: number }
  | { kind: 'milestone'; text: string; journey: JourneyKey; icon: string; hue: number };

export type PortraitRunKind = PortraitRun['kind'];

export type NextStepId = 'projects' | 'measures' | 'people';

/** A next step is a button and nothing else: a label and where it goes. */
export interface NextStep {
  id: NextStepId;
  /** Verb first, under 30 characters. */
  label: string;
  route: string;
}

// ---------------------------------------------------------------------------
// Portrait
// ---------------------------------------------------------------------------

const tally = (names: string[]): RecordTally => ({ count: names.length, names });

const firstAnswer = (questionId: string, draft: SetupDraft): ShapeAnswer | null => {
  const chosen = draft.intent[questionId]?.[0];
  if (!chosen) return null;
  const option = intentOptionsFor(questionId, draft).find((o) => o.id === chosen);
  return option ? { optionId: option.id, label: option.label } : null;
};

/** "Program area" to "program areas"; species and other invariant nouns keep their form. */
const pluralize = (singular: string): string => {
  if (/species$/i.test(singular)) return singular;
  if (/[^aeiou]y$/i.test(singular)) return `${singular.slice(0, -1)}ies`;
  if (/(s|x|ch|sh)$/i.test(singular)) return `${singular}es`;
  return `${singular}s`;
};

const AREA_TERM: Record<SpatialAreaKind, { singular: string; plural: string }> = {
  watershed: { singular: 'watershed', plural: 'watersheds' },
  county: { singular: 'county or district', plural: 'counties and districts' },
  own: { singular: 'area', plural: 'areas' },
};

export const programPortrait = (draft: SetupDraft = readSetupDraft()): ProgramPortrait => {
  const noun = draft.projectNoun ?? defaultProjectNoun;
  const color = tenantColors.find((c) => c.id === draft.tenantColorId) ?? null;
  const visibility = siteVisibilities.find((v) => v.id === draft.siteVisibility) ?? null;

  // The classification term comes from Start's grouping answer when it names
  // exactly one system; two systems, or none, fall back to the generic word.
  const systems = intentOptionsFor('slices', draft)
    .filter((o) => (draft.intent.slices ?? []).includes(o.id) && o.classification)
    .map((o) => o.classification as string);
  const termSingular = systems.length === 1 ? systems[0].toLowerCase() : 'classification';

  const areas = confirmedSpatialAreas(draft);
  const kinds = new Set(areas.map((a) => a.kind));
  const [onlyKind] = [...kinds];
  const areaTerm = kinds.size === 1 && onlyKind ? AREA_TERM[onlyKind] : AREA_TERM.own;

  const people = confirmedPeople(draft);
  const roles: Record<PersonRole, number> = { admin: 0, editor: 0, viewer: 0 };
  for (const person of people) roles[person.role] += 1;

  const defaultStage = stageOptions.find((s) => s.id === draft.defaultStage)?.name ?? null;

  return {
    name: draft.tenantName ?? tenantOrganization.name,
    shortName: draft.tenantShortName ?? draft.tenantName ?? tenantOrganization.name,
    noun: {
      singular: noun.singular,
      plural: noun.plural,
      renamed: noun.singular.toLowerCase() !== defaultProjectNoun.singular.toLowerCase(),
    },
    color: color ? { label: color.label, hue: color.hue } : null,
    visibility: visibility?.id ?? null,
    visibilityLabel: visibility?.label ?? null,
    shape: {
      money: firstAnswer('money', draft),
      time: firstAnswer('time', draft),
      proposals: firstAnswer('proposals', draft),
    },
    organizations: tally(listOrganizations(draft).filter((o) => o.status === 'confirmed').map((o) => o.name)),
    fundingSources: tally(confirmedFundingSources(draft).map((f) => f.name)),
    classifications: {
      ...tally(confirmedClassifications(draft).map((c) => c.name)),
      limit: draft.classificationLimit,
      termSingular,
      termPlural: pluralize(termSingular),
    },
    stages: { ...tally(usedStages(draft).map((s) => s.name)), defaultStage },
    spatialAreas: {
      ...tally(areas.map((a) => a.name)),
      termSingular: areaTerm.singular,
      termPlural: areaTerm.plural,
      outsidePolicy: draft.outsidePolicy,
      answered: journeyStatuses(draft)['spatial-areas'].status === 'confirmed',
    },
    projects: tally(confirmedImportProjects(draft).map((row) => row.project.projectName)),
    people: {
      ...tally(people.map((p) => p.name)),
      roles,
      withoutEmail: people.filter((p) => !p.email).length,
      stewardship: draft.stewardship,
    },
    measures: tally(confirmedMeasures(draft).map((m) => m.name)),
    milestones: setupCompletion(draft),
  };
};


// ---------------------------------------------------------------------------
// Words
// ---------------------------------------------------------------------------

const lower = (value: string): string => value.charAt(0).toLowerCase() + value.slice(1);

/** "1 funding source", "4 funding sources". */
const count = (n: number, singular: string, plural: string): string => `${n} ${n === 1 ? singular : plural}`;

/** "a and b"; "a, b, and c". The paragraph's clause lists keep the serial comma. */
const joinClauses = (items: PortraitRun[][]): PortraitRun[] => {
  if (items.length <= 2) return items.flatMap((item, i) => (i === 0 ? item : [text(' and '), ...item]));
  return items.flatMap((item, i) =>
    i === 0 ? item : i === items.length - 1 ? [text(', and '), ...item] : [text(', '), ...item],
  );
};

const text = (value: string): PortraitRun => ({ kind: 'text', text: value });

/** A milestone fact as a token, drawn in that milestone's icon and hue. */
const fact = (journey: JourneyKey, value: string): PortraitRun => {
  const { icon, hue } = journeyByKey(journey);
  return { kind: 'milestone', text: value, journey, icon, hue };
};

/** Flattens runs to plain text: the test harness's view, and the panel's accessible name source. */
export const finishText = (runs: PortraitRun[]): string => runs.map((run) => run.text).join('');

// ---------------------------------------------------------------------------
// The paragraph
// ---------------------------------------------------------------------------

/**
 * The year, two ways: as a clause riding the money rule ("on a year that runs
 * July to June"), and as its own lead when money is unanswered ("Its year runs
 * July to June"). An unknown option falls back to its own label.
 */
const YEAR: Record<string, { riding: string; leading: string }> = {
  'calendar': { riding: 'on a year that runs January 1 to December 31', leading: 'Its year runs January 1 to December 31' },
  'fiscal-july': { riding: 'on a year that runs July 1 to June 30', leading: 'Its year runs July 1 to June 30' },
  'fiscal-october': { riding: 'on a year that runs October 1 to September 30', leading: 'Its year runs October 1 to September 30' },
  'biennium': { riding: 'on a two-year biennium', leading: 'It runs on a two-year biennium' },
};

/**
 * The finish paragraph, composed from the portrait. Sentence one is the
 * celebration; the rest is the portrait, in the hub's group order.
 *
 *   [Cascade Headwaters Partnership] is set up. Its projects are called
 *   [restoration actions]. It funds partners' work and delivers its own, on a
 *   year that runs July 1 to June 30. Each restoration action
 *   belongs to one of [12 organizations], draws on [4 funding sources],
 *   carries one of [5 program areas], moves through [4 stages], and sits in
 *   one of [4 watersheds]. The program tracks [24 restoration actions] and
 *   [6 performance measures].
 */
export const finishRuns = (p: ProgramPortrait): PortraitRun[] => {
  // THE NAME AND THE NOUN WEAR NAMES AND APPEARANCE'S HUE (Andy, 2026-09-23),
  // not the tenant's chosen color: every token carries the color of the
  // milestone that produced it, and the program name in Forest green read as
  // the wrong family beside the red-to-gold Describe your program cards.
  const lookHue = journeyByKey('appearance').hue;
  const singular = lower(p.noun.singular);
  const plural = lower(p.noun.plural);
  const sentences: PortraitRun[][] = [];

  // 1. The celebration.
  sentences.push([{ kind: 'name', text: p.name, hue: lookHue }, text(' is set up.')]);

  // 2. The noun, only when the tenant renamed "Project". SITE VISIBILITY AND
  // THE ACCENT COLOR STAY OFF THE PARAGRAPH (Andy, 2026-09-23): "runs a public
  // site" read as the lead fact and "Its site is Forest green" read as a place.
  // Both are settings, not what the program is, and both show on Names and
  // appearance. The 'color' run kind stays in the type for a caller that wants
  // the disc.
  if (p.noun.renamed) sentences.push([text('Its projects are called '), { kind: 'noun', text: plural, hue: lookHue }, text('.')]);

  // 3. The money and year rules, as prose. Money leads when it is answered;
  // the year rides it as a trailing clause.
  const { money, time } = p.shape;
  const MONEY: Record<string, string> = {
    'funds-others': `It funds ${plural} that partners deliver`,
    'delivers': `It delivers its own ${plural}`,
    'both': "It funds partners' work and delivers its own",
  };
  const lead = money ? MONEY[money.optionId] : undefined;
  const year = time ? (YEAR[time.optionId] ?? { riding: `on a ${lower(time.label)}`, leading: `It runs on a ${lower(time.label)}` }) : undefined;
  // THE PROPOSALS ANSWER STAYS OFF THE PARAGRAPH (Andy, 2026-09-23): whether
  // a proposal stage exists is a rule the stage list already shows, not a fact
  // about the program worth a clause here.
  const shape = lead ? (year ? `${lead}, ${year.riding}` : lead) : year?.leading;
  if (shape) sentences.push([text(`${shape}.`)]);

  // 4. What one project is made of: one clause per confirmed vocabulary.
  const made: PortraitRun[][] = [];
  const { organizations: o, fundingSources: f, classifications: c, stages: s, spatialAreas: a } = p;
  if (o.count) made.push([text(o.count === 1 ? 'belongs to ' : 'belongs to one of '), fact('organizations', count(o.count, 'organization', 'organizations'))]);
  if (f.count) made.push([text('draws on '), fact('funding-sources', count(f.count, 'funding source', 'funding sources'))]);
  if (c.count) {
    const reach = c.count === 1 ? 'carries ' : c.limit === 2 ? 'carries up to two of ' : 'carries one of ';
    made.push([text(reach), fact('classifications', count(c.count, c.termSingular, c.termPlural))]);
  }
  if (s.count) made.push([text('moves through '), fact('lifecycle', count(s.count, 'stage', 'stages'))]);
  if (a.count) made.push([text(a.count === 1 ? 'sits in ' : 'sits in one of '), fact('spatial-areas', count(a.count, a.termSingular, a.termPlural))]);
  else if (a.answered) made.push([text('sits on '), fact('spatial-areas', 'a point on the map')]);
  if (made.length) sentences.push([text(`Each ${singular} `), ...joinClauses(made), text('.')]);

  // 5. The work the program tracks, in the active voice (Andy, 2026-09-23:
  // "are in" and "are defined" read passive). People are not on the paragraph;
  // the invite button under it carries their count.
  const work: PortraitRun[][] = [];
  if (p.projects.count) work.push([fact('import-projects', count(p.projects.count, singular, plural))]);
  if (p.measures.count) work.push([fact('measures', count(p.measures.count, 'performance measure', 'performance measures'))]);
  if (work.length) sentences.push([text('The program tracks '), ...joinClauses(work), text('.')]);

  return sentences.flatMap((sentence, i) => (i === 0 ? sentence : [text(' '), ...sentence]));
};

// ---------------------------------------------------------------------------
// Next steps
// ---------------------------------------------------------------------------

/**
 * Up to three buttons, one per next step that has a screen: the work that came
 * in, the measures reporters will answer, and the people waiting on an
 * invitation. The people step is left out when nobody is on the list.
 */
export const nextSteps = (p: ProgramPortrait): NextStep[] => {
  const candidates: { id: NextStepId; label: string; route: string | undefined }[] = [
    { id: 'projects', label: `View ${lower(p.noun.plural)}`, route: '/prototypes/projects' },
    // Pinned 2026-09-24: the measures journey now routes to its setup walk, and
    // after setup the measures live on the Performance measures prototype.
    { id: 'measures', label: 'Open performance measures', route: '/prototypes/performance-measures' },
  ];
  if (p.people.count) {
    candidates.push({
      id: 'people',
      label: `Invite ${count(p.people.count, 'person', 'people')}`,
      route: journeyByKey('people').route,
    });
  }
  // A step whose journey has no route has no screen, so it gets no button.
  return candidates.flatMap(({ id, label, route }) => (route ? [{ id, label, route }] : []));
};
