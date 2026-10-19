// Publishing, made to persist in this browser — what a steward published or
// reverted during a review, and each organization's review schedule.
//
// THE SEEDED STATE IS THE BUILD'S. firma2-publish-history says when every
// project was last published and what has changed since; this store only
// records what a reader did on top of that, so the queue, the project's badge,
// the review page and the public page can all agree after a Publish. Clear the
// key and the demo is back to its seed.
//
// A PUBLISH RECORDS WHAT WAS REVIEWED. It stores the change keys the steward
// had in front of them, not "everything as of now": if the record moved while
// they were reading, the newer change is not swept into a page nobody checked.
//
// Browser-local, one versioned key, same honesty terms as every store here.

import type { ReviewCadence } from '../data/firma2-review-cadence';

const KEY = 'firma2:publishing:v1';

export interface LocalPublish {
  /** ISO day — the fixture's present, so the queue's arithmetic stays on one calendar. */
  iso: string;
  by: string;
  /** The change keys that were on the review page when Publish was pressed. */
  keys: string[];
}

interface State {
  published: Record<string, LocalPublish>;
  /** Change keys put back to their published value, per project slug. */
  reverted: Record<string, string[]>;
  cadence: Record<string, ReviewCadence>;
  reminders: Record<string, boolean>;
}

const empty = (): State => ({ published: {}, reverted: {}, cadence: {}, reminders: {} });

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

export const readPublishing = (): State => {
  try {
    const parsed = JSON.parse(storage()?.getItem(KEY) ?? 'null');
    return parsed && typeof parsed === 'object' ? { ...empty(), ...parsed } : empty();
  } catch {
    return empty();
  }
};

const write = (next: State): void => {
  try {
    storage()?.setItem(KEY, JSON.stringify(next));
  } catch {
    // Blocked storage: the seed stands, which is the honest fallback.
  }
};

/** The change keys still waiting on a project, after this browser's publishes and reverts. */
export const pendingKeys = (slug: string, keys: string[], state: State = readPublishing()): string[] => {
  const published = new Set(state.published[slug]?.keys ?? []);
  const reverted = new Set(state.reverted[slug] ?? []);
  return keys.filter((k) => !published.has(k) && !reverted.has(k));
};

export const publish = (slug: string, record: LocalPublish): void => {
  const state = readPublishing();
  const before = state.published[slug]?.keys ?? [];
  write({ ...state, published: { ...state.published, [slug]: { ...record, keys: [...new Set([...before, ...record.keys])] } } });
};

export const revert = (slug: string, key: string): void => {
  const state = readPublishing();
  const list = new Set(state.reverted[slug] ?? []);
  list.add(key);
  write({ ...state, reverted: { ...state.reverted, [slug]: [...list] } });
};

export const writeCadence = (organization: string, cadence: ReviewCadence): void => {
  const state = readPublishing();
  write({ ...state, cadence: { ...state.cadence, [organization]: cadence } });
};

export const writeReminders = (organization: string, on: boolean): void => {
  const state = readPublishing();
  write({ ...state, reminders: { ...state.reminders, [organization]: on } });
};

export const PUBLISHING_KEY = KEY;
