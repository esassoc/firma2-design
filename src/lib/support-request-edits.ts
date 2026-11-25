// What this browser did to support requests: sent one, assigned one, marked
// one resolved or reopened it, and the replies typed on its page. Same honesty
// terms as every other draft store in this prototype: localStorage, one
// browser, no backend — a request or a reply is not emailed to anyone.
//
// PATCHES OVER SEEDS. For a seeded request only what changed is stored, keyed
// by request id, so a seed fixed in code still reaches a browser that replied
// to another request. A request SENT here is stored whole, with a `local-`
// slug so it can always be told from a seed; it opens on the `draft` route
// with its slug in the query, because a static site cannot build it a page
// (the taxonomy records' pattern, src/lib/taxonomy-record.ts).

import { supportRequests } from '../data/firma2-support-requests';
import type { SupportReply, SupportRequest, SupportRequestKind, SupportRequestStatus } from '../data/firma2-support-requests';
import { withBase } from './base';

interface Edit {
  status?: SupportRequestStatus;
  /** `YYYY-MM-DD`, set with `resolved`. */
  resolved?: string;
  /** '' is unassigned; absent is "as seeded". */
  assignedTo?: string;
  replies?: SupportReply[];
}

const KEY = 'firma2:support-requests:v1';
const ADDED_KEY = 'firma2:support-requests-added:v1';
const JUST_SENT_KEY = 'firma2:support-request-just-sent:v1';

const readJson = <T>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

const read = (): Record<string, Edit> => readJson(KEY, {});
const write = (store: Record<string, Edit>): boolean => writeJson(KEY, store);

export const supportEdit = (id: string): Edit => read()[id] ?? {};

/** A request's status as this browser sees it. */
export const statusOf = (id: string, seeded: SupportRequestStatus): SupportRequestStatus => supportEdit(id).status ?? seeded;

/** Who is answering a request as this browser sees it; '' is nobody. */
export const assigneeOf = (id: string, seeded: string): string => supportEdit(id).assignedTo ?? seeded;

// The reader's own date, not UTC's: an evening on the west coast is not tomorrow.
const today = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const setSupportStatus = (id: string, status: SupportRequestStatus): boolean => {
  const store = read();
  store[id] = { ...(store[id] ?? {}), status, resolved: status === 'resolved' ? today() : undefined };
  return write(store);
};

export const setSupportAssignee = (id: string, name: string): boolean => {
  const store = read();
  store[id] = { ...(store[id] ?? {}), assignedTo: name };
  return write(store);
};

export const addSupportReply = (id: string, author: string, body: string): SupportReply | null => {
  const store = read();
  const reply: SupportReply = { author, date: today(), body: body.trim() };
  store[id] = { ...(store[id] ?? {}), replies: [...(store[id]?.replies ?? []), reply] };
  return write(store) ? reply : null;
};

// ---------------------------------------------------------------------------
// Requests sent in this browser
// ---------------------------------------------------------------------------

export const LOCAL_PREFIX = 'local-';

/** Requests sent in this browser, newest first. */
export const addedSupportRequests = (): SupportRequest[] => readJson<SupportRequest[]>(ADDED_KEY, []);

/** A sent request's slug: `local-` and its number, so "SR-1049" opens `?id=local-1049`. */
export const localSlug = (id: string): string => `${LOCAL_PREFIX}${id.replace(/^SR-/, '')}`;

export const getAddedSupportRequest = (slug: string): SupportRequest | undefined =>
  addedSupportRequests().find((r) => localSlug(r.id) === slug);

/** Where a request opens, seeded or sent here. */
export const supportRequestPath = (request: Pick<SupportRequest, 'id'>, local: boolean): string =>
  withBase(local ? `/prototypes/support-requests/draft?id=${localSlug(request.id)}` : `/prototypes/support-requests/${request.id.toLowerCase()}`);

/** Send a request: stored whole, numbered after the newest one there is. */
export const addSupportRequest = (input: {
  subject: string;
  kind: SupportRequestKind;
  message: string;
  requester: SupportRequest['requester'];
}): SupportRequest | null => {
  const added = addedSupportRequests();
  const highest = Math.max(...[...supportRequests, ...added].map((r) => Number(r.id.replace(/\D/g, '')) || 0));
  const request: SupportRequest = {
    id: `SR-${highest + 1}`,
    subject: input.subject.trim(),
    kind: input.kind,
    message: input.message.trim(),
    requester: input.requester,
    received: today(),
    status: 'open',
    assignedTo: '',
    replies: [],
  };
  return writeJson(ADDED_KEY, [request, ...added]) ? request : null;
};

// ---- arrival note: the list confirms a send once ------------------------------

export const noteJustSent = (id: string): void => {
  try {
    sessionStorage.setItem(JUST_SENT_KEY, id);
  } catch {
    /* forgotten — the request was still sent */
  }
};

export const takeJustSent = (): string | null => {
  try {
    const v = sessionStorage.getItem(JUST_SENT_KEY);
    sessionStorage.removeItem(JUST_SENT_KEY);
    return v;
  } catch {
    return null;
  }
};
