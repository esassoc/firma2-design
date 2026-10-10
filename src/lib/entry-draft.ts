// Browser-local ENTRIES — the observations recorded against a project's
// performance measures. Same store, same honesty terms as every other draft
// in this prototype: localStorage, one browser, and the UI says so.
//
// AN ENTRY IS THE MODEL'S ATOM: one figure, for one measure on one project in
// one period, qualified by the reporter's answers to the measure's
// breakdowns — at most one option per question, and none is legitimate.
//
// EVERY WRITE IS LOGGED (src/lib/measure-changes.ts, the PM 2 change log):
// filing an entry is a create, removing one a delete. A caller that rewrites
// entries as one act — a corrected amount, a re-keyed answer — passes
// `{ log: false }` and logs the act itself, once.
//
// THE MEASURE KEY. Added measures reference the catalog by slug. A project's
// SEED measures are authored display data with no catalog id, so they key by
// `name:<measure name>` — good enough for a prototype whose seed names are
// stable, and the seam where a real backend would put ProjectFirma's integer
// MeasureID.

export interface EntryDraft {
  id: string;
  /** Catalog slug, or `name:<display name>` for a seed row. */
  measureKey: string;
  year: number;
  amount: number;
  /** Breakdown answers, keyed by the question. Only what was answered. */
  answers: Record<string, string>;
}

import { periodName } from '../data/firma2-performance-measures';
import { logChange } from './measure-changes';

/** `{ log: false }` when the caller logs the act itself. */
interface WriteOptions {
  log?: boolean;
}

const KEY_VERSION = 'v1';
const keyFor = (projectSlug: string): string => `firma2:entries:${KEY_VERSION}:${projectSlug}`;

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

const isEntry = (v: unknown): v is EntryDraft => {
  if (typeof v !== 'object' || v === null) return false;
  const c = v as Partial<EntryDraft>;
  return (
    typeof c.id === 'string' &&
    typeof c.measureKey === 'string' &&
    typeof c.year === 'number' &&
    typeof c.amount === 'number' &&
    Number.isFinite(c.amount) &&
    typeof c.answers === 'object' &&
    c.answers !== null
  );
};

/** Every entry recorded against this project in this browser, oldest first. */
export const readEntries = (projectSlug: string): EntryDraft[] => {
  const store = storage();
  if (!store) return [];
  try {
    const parsed = JSON.parse(store.getItem(keyFor(projectSlug)) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch {
    return [];
  }
};

/** Record one entry. The id is minted here, deterministically per store. */
export const addEntry = (
  projectSlug: string,
  entry: Omit<EntryDraft, 'id'>,
  { log = true }: WriteOptions = {},
): EntryDraft | null => {
  const store = storage();
  if (!store) return null;
  try {
    const existing = readEntries(projectSlug);
    const taken = new Set(existing.map((e) => e.id));
    let n = 1;
    while (taken.has(`entry-${n}`)) n += 1;
    const full: EntryDraft = { ...entry, id: `entry-${n}` };
    store.setItem(keyFor(projectSlug), JSON.stringify([...existing, full]));
    if (log) logEntry(projectSlug, full, null, full.amount);
    return full;
  } catch {
    return null;
  }
};

export const removeEntry = (projectSlug: string, id: string, { log = true }: WriteOptions = {}): void => {
  const store = storage();
  if (!store) return;
  try {
    const all = readEntries(projectSlug);
    const gone = all.find((e) => e.id === id);
    store.setItem(keyFor(projectSlug), JSON.stringify(all.filter((e) => e.id !== id)));
    if (log && gone) logEntry(projectSlug, gone, gone.amount, null);
  } catch {
    // A blocked store also had nothing to remove.
  }
};

/**
 * One EntryValue row in the change log. The measure is named by the entry's
 * key — a catalog slug, or `name:<display name>` for a seed row.
 */
export const logEntry = (
  projectSlug: string,
  entry: Pick<EntryDraft, 'measureKey' | 'year'>,
  oldValue: number | null,
  newValue: number | null,
): void =>
  logChange({
    projectSlug,
    measureSlug: entry.measureKey,
    periodName: periodName(entry.year),
    field: 'EntryValue',
    oldValue,
    newValue,
  });
