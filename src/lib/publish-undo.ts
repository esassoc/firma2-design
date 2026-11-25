// Undo publish — taking back the last publish on a project, as its own entry
// in the publish history rather than an erasure of the publish.
//
// WHAT UNDO MEANS. The public page goes back to the snapshot it showed before
// the publish: the changes that publish carried are unpublished again and
// return to the review diff. The record is not touched — the editors' work is
// still there, waiting for the next sweep. Reverts made on the review page are
// edits to the record, not part of the publish, so they stay.
//
// HOW LONG IT IS OFFERED. Only the newest publish on a project can be undone,
// and only until something newer happens to it: another publish, or the undo
// itself. One step back, never a chain — the history is a log of what the
// public saw, and walking it backwards several steps would make the public
// page a moving target nobody reviewed. There is no clock: the fixture's
// calendar has none, and a stale undo is already prevented by "nothing newer".
//
// LOGGED, NOT ERASED. A publish and its undo are both events, so the history
// reads "Published … · Publish undone …" and anyone can see the public page
// was briefly ahead.
//
// Browser-local, beside publish-store's own key; same honesty terms. The
// publish itself still goes through publish-store, so every reader of that
// store (queue, badge, public page) agrees without knowing this module exists.

import { PUBLISHING_KEY, publish, readPublishing } from './publish-store';
import type { LocalPublish } from './publish-store';

const KEY = 'firma2:publish-log:v1';

/** Fired on document when the log changes in this tab. */
export const PUBLISH_LOG_CHANGED = 'firma2:publish-log-changed';

export interface PublishEvent {
  id: string;
  slug: string;
  kind: 'publish' | 'undo';
  iso: string;
  by: string;
  /** For a publish: what this browser's store held for the project before it — null when nothing. */
  before?: LocalPublish | null;
}

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

export const readLog = (): PublishEvent[] => {
  try {
    const parsed = JSON.parse(storage()?.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLog = (log: PublishEvent[]): void => {
  try {
    storage()?.setItem(KEY, JSON.stringify(log));
  } catch {
    // Blocked storage: the publish still happened in publish-store's terms, or didn't at all.
  }
  if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent(PUBLISH_LOG_CHANGED));
};

/** This browser's events on one project, oldest first. */
export const eventsFor = (slug: string): PublishEvent[] => readLog().filter((e) => e.slug === slug);

/** Publish, remembering what it replaced so it can be taken back. */
export const publishWithUndo = (slug: string, record: LocalPublish): void => {
  const before = readPublishing().published[slug] ?? null;
  publish(slug, record);
  const log = readLog();
  writeLog([...log, { id: `${slug}:${log.length}`, slug, kind: 'publish', iso: record.iso, by: record.by, before }]);
};

/** The publish that can still be undone on this project: its newest event, when that is a publish. */
export const undoablePublish = (slug: string): PublishEvent | null => {
  const last = eventsFor(slug).at(-1);
  return last && last.kind === 'publish' ? last : null;
};

/** Put the public page back to what it showed before the newest publish. */
export const undoPublish = (slug: string, by: string, iso: string): PublishEvent | null => {
  const target = undoablePublish(slug);
  if (!target) return null;
  const state = readPublishing();
  const published = { ...state.published };
  if (target.before) published[slug] = target.before;
  else delete published[slug];
  try {
    storage()?.setItem(PUBLISHING_KEY, JSON.stringify({ ...state, published }));
  } catch {
    return null;
  }
  const log = readLog();
  const event: PublishEvent = { id: `${slug}:${log.length}`, slug, kind: 'undo', iso, by };
  writeLog([...log, event]);
  return target;
};
