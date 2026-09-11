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
  intentQuestions,
  journeys,
  journeysFromIntent,
  organizationFromFreeText,
  suggestedOrganizations,
  tenantOrganization,
} from '../data/firma2-setup';
import type { JourneyKey, JourneyStatus, Organization, OrganizationStatus } from '../data/firma2-setup';

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
}

const EMPTY: SetupDraft = { documentsUploaded: false, organizationStatus: {}, addedOrganizations: [], intent: {} };

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
}

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
 *   go-live         locked until every dependency is confirmed, then untouched
 *   measures        suggested only when intent names performance measures;
 *                   Mission 6 owns the page, so this slice never fills it
 */
export const journeyStatuses = (draft: SetupDraft = readSetupDraft()): Record<JourneyKey, JourneyProgress> => {
  const counts = draft.documentsUploaded ? candidateCountByJourney() : {};
  const wanted = journeysFromIntent(draft.intent);
  const classificationsWanted = classificationsFromIntent(draft.intent).length;
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
        };
        break;
      }
      case 'organizations': {
        let status: JourneyStatus = 'untouched';
        if (orgConfirmed > 0 && orgSuggested === 0) status = 'confirmed';
        else if (orgConfirmed > 0) status = 'in-progress';
        else if (orgSuggested > 0 || wanted.has('organizations')) status = 'suggested';
        progress = { status, confirmed: orgConfirmed, suggested: orgSuggested };
        break;
      }
      case 'measures':
        progress = { status: wanted.has('measures') ? 'suggested' : 'untouched', confirmed: 0, suggested: 0 };
        break;
      default: {
        let suggested = counts[journey.key] ?? 0;
        if (journey.key === 'classifications') suggested += classificationsWanted;
        const relevant = suggested > 0 || wanted.has(journey.key);
        progress = { status: relevant ? 'suggested' : 'untouched', confirmed: 0, suggested };
      }
    }
    result[journey.key] = progress;
  }

  // Locks are applied after the pass so a dependency's status is already known.
  for (const journey of journeys) {
    if (journey.dependsOn.length === 0) continue;
    const unmet = journey.dependsOn.some((dep) => result[dep].status !== 'confirmed');
    if (unmet) result[journey.key] = { ...result[journey.key], status: 'locked' };
  }

  return result;
};

/** Fraction of journeys this slice can mark confirmed, for the hub's meter. Measures is excluded: it is Mission 6's. */
export const setupCompletion = (draft: SetupDraft = readSetupDraft()): { done: number; total: number } => {
  const statuses = journeyStatuses(draft);
  const ours = journeys.filter((j) => !j.external);
  const done = ours.filter((j) => statuses[j.key].status === 'confirmed').length;
  return { done, total: ours.length };
};
