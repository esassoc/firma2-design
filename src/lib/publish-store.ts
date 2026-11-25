// Publishing, made to persist in this browser — what a manager published or
// reverted during a review, and each organization's review schedule.
//
// THE SEEDED STATE IS THE BUILD'S. firma2-publish-history says when every
// project was last published and what has changed since; this store only
// records what a reader did on top of that, so the queue, the project's badge,
// the review page and the public page can all agree after a Publish. Clear the
// key and the demo is back to its seed.
//
// A PUBLISH RECORDS WHAT WAS REVIEWED. It stores the change keys the manager
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

/**
 * A manager's word on one change (.scratch/project-updates/spec.md, decisions
 * 33, 34, 38): why it is held back from the publish, or why it was reverted.
 * Required either way, and sent to the people who made the change.
 */
export interface ReviewNote {
  note: string;
  by: string;
  iso: string;
  /** Who was told: the change's editors. */
  told: string[];
  /** The field, as the review names it, for the history line. */
  label: string;
}

interface State {
  published: Record<string, LocalPublish>;
  /** Change keys put back to their published value, per project slug. */
  reverted: Record<string, string[]>;
  /** Why each revert was made, per slug, by change key. */
  revertNotes: Record<string, Record<string, ReviewNote>>;
  /** Changes held back from publish with a note, per slug, by change key. They
      stay on the record and stay pending, so they come back next review. */
  held: Record<string, Record<string, ReviewNote>>;
  cadence: Record<string, ReviewCadence>;
  reminders: Record<string, boolean>;
}

const empty = (): State => ({ published: {}, reverted: {}, revertNotes: {}, held: {}, cadence: {}, reminders: {} });

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

/** Put changes back to their published value. One row can stand for several keys. */
export const revert = (slug: string, keys: string[], note?: ReviewNote): void => {
  const state = readPublishing();
  const list = new Set(state.reverted[slug] ?? []);
  keys.forEach((k) => list.add(k));
  const notes = { ...(state.revertNotes[slug] ?? {}) };
  const held = { ...(state.held[slug] ?? {}) };
  keys.forEach((k) => {
    if (note) notes[k] = note;
    // A reverted change is no longer waiting, so no longer held.
    delete held[k];
  });
  write({ ...state, reverted: { ...state.reverted, [slug]: [...list] }, revertNotes: { ...state.revertNotes, [slug]: notes }, held: { ...state.held, [slug]: held } });
};

/** Hold changes back from the publish, with the note their editors are sent. */
export const hold = (slug: string, keys: string[], note: ReviewNote): void => {
  const state = readPublishing();
  const held = { ...(state.held[slug] ?? {}) };
  keys.forEach((k) => (held[k] = note));
  write({ ...state, held: { ...state.held, [slug]: held } });
};

/** Let held changes go out with the next publish again. */
export const release = (slug: string, keys: string[]): void => {
  const state = readPublishing();
  const held = { ...(state.held[slug] ?? {}) };
  keys.forEach((k) => delete held[k]);
  write({ ...state, held: { ...state.held, [slug]: held } });
};

/** The held changes still waiting on a project. */
export const heldKeys = (slug: string, keys: string[], state: State = readPublishing()): string[] => {
  const held = state.held[slug] ?? {};
  return pendingKeys(slug, keys, state).filter((k) => held[k]);
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
