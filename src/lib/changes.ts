// The change log, in THIS browser — one row per write to a project's record,
// whatever was changed and however it arrived (docs/data-model.md, section 5
// and decision 3; src/data/firma2-changes.ts is the shape).
//
// ONE LOG. A target, a measure entry, a funding row, a contact, a key fact and
// everything an import adds all append here, each with its source. It replaced
// the measure-only log (src/lib/measure-changes.ts, removed 2026-11-24).
//
// The build's seeded history is the same shape (ProjectDetail.audit); the
// history sheet shows this log above it.
//
// FAKED: localStorage, one browser, one versioned key for the whole log. "You"
// stands for the signed-in person. The seed carries the history up to the
// build; this log starts with the first edit made here.

import type { Change, ChangeFacts, ChangeSource } from '../data/firma2-changes';

const KEY = 'firma2:changes:v1';

/** Fired on `document` when the log gains or loses rows, with `{ slug }`. */
export const CHANGES_EVENT = 'firma2:changes';

/** Who the prototype says made a change: there is no sign-in. */
export const CURRENT_USER = 'You';

/** A logged change knows its project; a seeded one lives on its project's record. */
export interface LoggedChange extends Change {
  project: string;
}

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

const readAll = (): LoggedChange[] => {
  try {
    const parsed = JSON.parse(storage()?.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? (parsed as LoggedChange[]) : [];
  } catch {
    return [];
  }
};

const writeAll = (rows: LoggedChange[], slug: string): void => {
  try {
    storage()?.setItem(KEY, JSON.stringify(rows));
  } catch {
    // Quota or blocked storage: the edit itself still stands.
  }
  if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent(CHANGES_EVENT, { detail: { slug } }));
};

/** A project's changes made in this browser, oldest first. */
export const readChanges = (slug?: string): LoggedChange[] => {
  const rows = readAll();
  return slug ? rows.filter((row) => row.project === slug) : rows;
};

/**
 * Append one change. A `set` that changes nothing (the same value before and
 * after) is not a change and is not logged. `id` is given only when the caller
 * needs to find the row again (an import, to take it back).
 */
export const recordChange = (slug: string, facts: ChangeFacts, options: { source?: ChangeSource; id?: string; reverts?: string } = {}): void => {
  if (facts.action === 'set' && facts.from !== undefined && facts.from === facts.to) return;
  const rows = readAll();
  rows.push({
    ...facts,
    id: options.id ?? `local:${rows.length + 1}:${Date.now().toString(36)}`,
    project: slug,
    by: CURRENT_USER,
    at: new Date().toISOString(),
    source: options.source ?? { kind: 'hand' },
    ...(options.reverts ? { reverts: options.reverts } : {}),
  });
  writeAll(rows, slug);
};

/** Take rows out of the log: an import undone from its toast never happened. */
export const forgetChanges = (slug: string, matches: (change: LoggedChange) => boolean): void => {
  const rows = readAll();
  const kept = rows.filter((row) => row.project !== slug || !matches(row));
  if (kept.length !== rows.length) writeAll(kept, slug);
};

/** A number as the log keeps it: at most four places, no trailing zeros. Undefined when there is none. */
export const numberText = (n: number | null | undefined): string | undefined =>
  n == null || !Number.isFinite(n) ? undefined : String(Number(n.toFixed(4)));
