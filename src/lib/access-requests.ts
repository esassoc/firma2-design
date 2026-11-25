// Access requests, kept in this browser — the prototype's stand-in for a
// server, on the same honesty terms as every store in the spoke: one versioned
// key, every access wrapped, and a page that still works (and forgets) when
// storage is blocked.
//
// WHAT IS STORED: requests made here, and the answers given here to any
// request, seeded or not. The seeds stay in code; an answer is laid over them.
//
// LIVE ACROSS SURFACES. Every write fires `firma2:access-requests` on window,
// so a welcome page and a Members page open side by side agree without reload
// (and the storage event carries it between tabs).

import {
  SEED_REQUESTS,
  REASK_DAYS,
  daysSince,
  isoDaysAgo,
  organizationRequestId,
  type AccessRequest,
  type AskedAccess,
} from '../data/firma2-access-requests';

const KEY = 'firma2:access-requests:v1';
export const CHANGED = 'firma2:access-requests';

interface Stored {
  added: AccessRequest[];
  answers: Record<string, Pick<AccessRequest, 'status' | 'granted' | 'reason' | 'answeredBy' | 'answered'>>;
}

const read = (): Stored => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return { added: Array.isArray(parsed.added) ? parsed.added : [], answers: parsed.answers ?? {} };
  } catch {
    return { added: [], answers: {} };
  }
};

const write = (stored: Stored): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(stored));
  } catch {
    /* blocked storage — this page still shows the change until reload */
  }
  window.dispatchEvent(new CustomEvent(CHANGED));
};

/** Every request: added here first (newest), then the seeds, answers applied. */
export const readRequests = (): AccessRequest[] => {
  const { added, answers } = read();
  return [...added, ...SEED_REQUESTS].map((r) => (answers[r.id] ? { ...r, ...answers[r.id] } : r));
};

export const getRequest = (id: string): AccessRequest | undefined => readRequests().find((r) => r.id === id);

const sameOrg = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** A pending request this person already has with this organization. */
export const pendingRequest = (email: string, organization: string): AccessRequest | undefined =>
  readRequests().find((r) => r.status === 'pending' && r.email === email && sameOrg(r.organization, organization));

/** Days until this person may ask this organization again, or 0 if they may now. */
export const daysUntilReask = (email: string, organization: string): number => {
  const declined = readRequests()
    .filter((r) => r.status === 'declined' && r.email === email && sameOrg(r.organization, organization) && r.answered)
    .map((r) => daysSince(r.answered!));
  if (declined.length === 0) return 0;
  return Math.max(0, REASK_DAYS - Math.min(...declined));
};

export type NewRequest = Omit<AccessRequest, 'id' | 'created' | 'status'>;

/** One pending request per organization (decision 26): asking twice returns the first. */
export const createRequest = (request: NewRequest): AccessRequest => {
  const existing = pendingRequest(request.email, request.organization);
  if (existing) return existing;
  const stored = read();
  // A new organization's id is its name's, so its review page can be built
  // ahead of time (FLOW_REQUESTS); taken already, it falls back to a fresh one.
  const named = request.kind === 'organization' ? organizationRequestId(request.organization) : '';
  const taken = new Set(readRequests().map((r) => r.id));
  const made: AccessRequest = {
    ...request,
    id: named && !taken.has(named) ? named : `rq-${Date.now().toString(36)}`,
    created: isoDaysAgo(0),
    status: 'pending',
  };
  write({ ...stored, added: [made, ...stored.added] });
  return made;
};

const answer = (id: string, patch: Stored['answers'][string]): void => {
  const stored = read();
  write({ ...stored, answers: { ...stored.answers, [id]: patch } });
};

export const withdrawRequest = (id: string): void =>
  answer(id, { status: 'withdrawn', answered: isoDaysAgo(0) });

export const approveRequest = (id: string, granted: AskedAccess, by: string): void =>
  answer(id, { status: 'approved', granted, answeredBy: by, answered: isoDaysAgo(0) });

export const declineRequest = (id: string, by: string, reason?: string): void =>
  answer(id, { status: 'declined', reason: reason?.trim() || undefined, answeredBy: by, answered: isoDaysAgo(0) });

/** Back to the seeded state — the demo's reset, not a product feature. */
export const resetRequests = (): void => write({ added: [], answers: {} });
