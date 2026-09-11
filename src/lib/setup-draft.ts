// Local draft storage for tenant setup.
//
// Same contract as measure-draft.ts: THERE IS NO BACKEND. This spoke is a static
// build, so "saving" is localStorage in one browser. Setup is the argument that
// a tenant is stood up over days, from bookmarked URLs, by more than one person —
// a prototype that forgot everything on reload could not show it. The demo says
// plainly that drafts live in this browser only.
//
// PATCHES OVER SEED. Storage holds only what the admin decided: which documents
// were uploaded, and each organization's status. Journey statuses are DERIVED
// from those at read time (see journeyStatuses), never stored, so the hub and
// the map can never disagree with the records beneath them.
//
// VERSIONED KEY. Bump KEY_VERSION when the stored shape changes; old entries are
// ignored rather than parsed into something that throws at render.

import {
  askExamples,
  candidateCountByJourney,
  classificationsFromIntent,
  intentQuestionById,
  intentQuestions,
  journeys,
  journeysFromIntent,
  organizationFromFreeText,
  suggestedOrganizations,
  tenantOrganization,
} from '../data/firma2-setup';
import type {
  IntentOption,
  JourneyKey,
  JourneyStatus,
  Organization,
  OrganizationStatus,
} from '../data/firma2-setup';

const KEY_VERSION = 'v1';
const KEY = `firma2:setup-draft:${KEY_VERSION}`;

export interface SetupDraft {
  /** True once the admin has uploaded documents — the canned extraction has run. */
  documentsUploaded: boolean;
  /** Status per organization id, for every organization the admin has touched. */
  organizationStatus: Record<string, OrganizationStatus>;
  /** Organizations minted in this browser (from Ask or by hand). Seed organizations are not stored. */
  addedOrganizations: Organization[];
  /** Intent answers: question id to the option ids chosen. A question the admin has not answered is absent. */
  intent: Record<string, string[]>;
  /**
   * Options typed into a question's "in your own words" field, by question id.
   * Built-in options are never stored — only what this browser added.
   */
  customIntentOptions: Record<string, IntentOption[]>;
}

const EMPTY: SetupDraft = {
  documentsUploaded: false,
  organizationStatus: {},
  addedOrganizations: [],
  intent: {},
  customIntentOptions: {},
};

/** SSR-safe: localStorage does not exist during `astro build`, and Safari private mode throws on access. */
const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

export const readSetupDraft = (): SetupDraft => {
  const store = storage();
  if (!store) return { ...EMPTY };
  const raw = store.getItem(KEY);
  if (!raw) return { ...EMPTY };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...EMPTY };
    return { ...EMPTY, ...(parsed as Partial<SetupDraft>) };
  } catch {
    return { ...EMPTY };
  }
};

/** Returns false when the browser is blocking storage — the one failure the admin cannot see, so callers should say so once. */
export const writeSetupDraft = (draft: SetupDraft): boolean => {
  const store = storage();
  if (!store) return false;
  try {
    store.setItem(KEY, JSON.stringify(draft));
    document.dispatchEvent(new CustomEvent('setup-draft-change', { detail: draft }));
    return true;
  } catch {
    return false;
  }
};

export const clearSetupDraft = (): void => {
  storage()?.removeItem(KEY);
  document.dispatchEvent(new CustomEvent('setup-draft-change', { detail: { ...EMPTY } }));
};

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export const markDocumentsUploaded = (): boolean => writeSetupDraft({ ...readSetupDraft(), documentsUploaded: true });

// ---------------------------------------------------------------------------
// Intent
// ---------------------------------------------------------------------------

/** Records the options chosen for one question. An empty choice removes the answer. */
export const setIntentAnswer = (questionId: string, optionIds: string[]): boolean => {
  const draft = readSetupDraft();
  const intent = { ...draft.intent };
  if (optionIds.length) intent[questionId] = optionIds;
  else delete intent[questionId];
  return writeSetupDraft({ ...draft, intent });
};

/**
 * Every option a question can show: the authored ones first, then the ones typed
 * into its ask field in this browser. The chip group renders exactly this list,
 * so a typed answer is one more chip rather than a second kind of control.
 */
export const intentOptionsFor = (questionId: string, draft: SetupDraft = readSetupDraft()): IntentOption[] => [
  ...(intentQuestionById(questionId)?.options ?? []),
  ...(draft.customIntentOptions[questionId] ?? []),
];

/**
 * Turns typed text into one more option on a question, already chosen.
 *
 * The journeys are the UNION of everything the question's authored options light:
 * the choices could not be exhaustive, but they do bound what the question is
 * about, so an answer nobody anticipated opens the same milestones its siblings
 * would. That is deliberately generous — setup suggests, the admin confirms.
 *
 * Returns the option, or null when there is nothing to add: blank text, or a
 * label this question already carries.
 */
export const addIntentOption = (questionId: string, label: string): IntentOption | null => {
  const question = intentQuestionById(questionId);
  if (!question) return null;

  const text = label.trim().replace(/\s+/g, ' ');
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!slug) return null;
  const id = `custom-${slug}`;

  const draft = readSetupDraft();
  const custom = draft.customIntentOptions[questionId] ?? [];
  const taken = [...question.options, ...custom];
  if (taken.some((o) => o.id === id || o.label.toLowerCase() === text.toLowerCase())) return null;

  const option: IntentOption = {
    id,
    label: text,
    journeys: [...new Set(question.options.flatMap((o) => o.journeys))],
    phrase: text.toLowerCase(),
  };

  // A single-select question replaces its answer, exactly as picking another chip
  // would; a multi-select one gains a choice.
  const chosen = draft.intent[questionId] ?? [];
  writeSetupDraft({
    ...draft,
    customIntentOptions: { ...draft.customIntentOptions, [questionId]: [...custom, option] },
    intent: { ...draft.intent, [questionId]: question.multiple ? [...chosen, id] : [id] },
  });
  return option;
};

/** True once every intent question has an answer. */
export const intentComplete = (draft: SetupDraft = readSetupDraft()): boolean =>
  intentQuestions.every((q) => (draft.intent[q.id] ?? []).length > 0);

/** Number of intent questions answered, for the first journey's count. */
export const intentAnswered = (draft: SetupDraft = readSetupDraft()): number =>
  intentQuestions.filter((q) => (draft.intent[q.id] ?? []).length > 0).length;

// ---------------------------------------------------------------------------
// Organizations
// ---------------------------------------------------------------------------

/**
 * Every organization the tenant knows about, with the draft's statuses applied.
 * Document-sourced suggestions only appear once documents have been uploaded;
 * before that the cast is the tenant itself and whatever was added by hand.
 */
export const listOrganizations = (draft: SetupDraft = readSetupDraft()): Organization[] => {
  const seed = draft.documentsUploaded ? suggestedOrganizations : [];
  return [tenantOrganization, ...seed, ...draft.addedOrganizations].map((org) => ({
    ...org,
    status: draft.organizationStatus[org.id] ?? org.status,
  }));
};

export const setOrganizationStatus = (id: string, status: OrganizationStatus): boolean => {
  const draft = readSetupDraft();
  return writeSetupDraft({ ...draft, organizationStatus: { ...draft.organizationStatus, [id]: status } });
};

/** Adds organizations minted in this browser as `suggested`; ids already present are skipped. */
export const addOrganizations = (organizations: Organization[]): boolean => {
  const draft = readSetupDraft();
  const known = new Set(listOrganizations(draft).map((o) => o.id));
  const fresh = organizations.filter((o) => !known.has(o.id));
  return writeSetupDraft({ ...draft, addedOrganizations: [...draft.addedOrganizations, ...fresh] });
};

/**
 * Answers a typed request with proposed organizations. Canned: the first example
 * whose keywords appear in the text wins; otherwise one organization named after
 * the text itself. Proposals are returned, not stored — the caller adds the ones
 * the admin picks.
 */
export const proposeOrganizations = (text: string): Organization[] => {
  const lower = text.toLowerCase();
  const match = askExamples.find((ex) => ex.keywords.some((k) => lower.includes(k)));
  return match ? match.organizations.map((o) => ({ ...o })) : [organizationFromFreeText(text)];
};

// ---------------------------------------------------------------------------
// Journey status — derived, never stored
// ---------------------------------------------------------------------------

export interface JourneyProgress {
  status: JourneyStatus;
  /** Records confirmed on this journey. */
  confirmed: number;
  /** Candidates still awaiting review. */
  suggested: number;
  /**
   * How far through the milestone the admin is, in the milestone's own units:
   * screens answered for the start step, records resolved for a record
   * milestone. `total` is 0 when nothing is on the table yet, which is the
   * case for every milestone this slice has not opened.
   */
  steps: { done: number; total: number };
}

/** The number of marks a card's progress row draws. */
export const MILESTONE_DOTS = 5;

/**
 * How many of a card's marks are filled. A confirmed milestone fills every
 * mark whatever its counts say, an untouched one fills none, and in
 * between the row rounds the fraction but never rounds a started milestone
 * down to nothing or an unfinished one up to full.
 */
export const milestoneDotsFilled = (progress: JourneyProgress, dots = MILESTONE_DOTS): number => {
  if (progress.status === 'confirmed') return dots;
  const { done, total } = progress.steps;
  if (total === 0 || done === 0) return 0;
  if (done >= total) return dots;
  return Math.min(dots - 1, Math.max(1, Math.round((done / total) * dots)));
};

/**
 * The hub's and the map's single source of truth.
 *
 *   documents       the first step holds two halves, documents and intent:
 *                   confirmed when both are done, in-progress when one is
 *   organizations   confirmed when every suggestion is resolved and at least one
 *                   organization beyond the tenant itself is confirmed; in-progress
 *                   when some are; suggested when the documents produced candidates
 *                   or the intent answers call for partners
 *   other build     suggested once the documents produced candidates or an intent
 *                   answer made the journey relevant, untouched otherwise
 *   go-live         untouched until its own screen is built; dependsOn is for
 *                   data entry, never for the hub, so nothing here is locked
 *   measures        suggested only when intent names performance measures;
 *                   Mission 6 owns the page, so this slice never fills it
 */
export const journeyStatuses = (draft: SetupDraft = readSetupDraft()): Record<JourneyKey, JourneyProgress> => {
  const counts = draft.documentsUploaded ? candidateCountByJourney() : {};
  const wanted = journeysFromIntent(draft.intent, draft.customIntentOptions);
  const classificationsWanted = classificationsFromIntent(draft.intent, draft.customIntentOptions).length;
  const orgs = listOrganizations(draft).filter((o) => o.id !== tenantOrganization.id);
  const orgConfirmed = orgs.filter((o) => o.status === 'confirmed').length;
  const orgSuggested = orgs.filter((o) => o.status === 'suggested').length;

  const result = {} as Record<JourneyKey, JourneyProgress>;

  for (const journey of journeys) {
    let progress: JourneyProgress;
    switch (journey.key) {
      case 'documents': {
        const docs = draft.documentsUploaded ? 3 : 0;
        const answers = intentAnswered(draft);
        const done = docs > 0 && intentComplete(draft);
        const started = docs > 0 || answers > 0;
        progress = {
          status: done ? 'confirmed' : started ? 'in-progress' : 'untouched',
          confirmed: docs + answers,
          suggested: 0,
          // One screen for the documents, one per intent question.
          steps: { done: (docs > 0 ? 1 : 0) + answers, total: 1 + intentQuestions.length },
        };
        break;
      }
      case 'organizations': {
        let status: JourneyStatus = 'untouched';
        if (orgConfirmed > 0 && orgSuggested === 0) status = 'confirmed';
        else if (orgConfirmed > 0) status = 'in-progress';
        else if (orgSuggested > 0 || wanted.has('organizations')) status = 'suggested';
        progress = {
          status,
          confirmed: orgConfirmed,
          suggested: orgSuggested,
          steps: { done: orgConfirmed, total: orgConfirmed + orgSuggested },
        };
        break;
      }
      case 'measures':
        progress = {
          status: wanted.has('measures') ? 'suggested' : 'untouched',
          confirmed: 0,
          suggested: 0,
          steps: { done: 0, total: 0 },
        };
        break;
      default: {
        let suggested = counts[journey.key] ?? 0;
        if (journey.key === 'classifications') suggested += classificationsWanted;
        const relevant = suggested > 0 || wanted.has(journey.key);
        progress = {
          status: relevant ? 'suggested' : 'untouched',
          confirmed: 0,
          suggested,
          steps: { done: 0, total: suggested },
        };
      }
    }
    result[journey.key] = progress;
  }

  return result;
};

/**
 * Fraction of milestones complete, for the hub's meter. Every milestone counts,
 * measures included: the hub collects all eleven, and setup is not stood up
 * until Mission 6's screen confirms that one too, so the total tops out at
 * ten of eleven from this slice alone. That is the honest number.
 */
export const setupCompletion = (draft: SetupDraft = readSetupDraft()): { done: number; total: number } => {
  const statuses = journeyStatuses(draft);
  const done = journeys.filter((j) => statuses[j.key].status === 'confirmed').length;
  return { done, total: journeys.length };
};
