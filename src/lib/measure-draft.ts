// Local draft storage for performance-measure setup.
//
// WHY THIS EXISTS. The setup screen's whole argument is that defining a measure
// is NOT one sitting: you start it, ask a colleague what unit the program
// actually reports in, and come back tomorrow. A prototype that forgets
// everything on reload cannot demonstrate that argument — a reviewer clicks
// Save, reloads, sees the seed record, and the model stays theoretical.
//
// THERE IS NO BACKEND. This spoke is a static Astro build served from GitHub
// Pages, so "saving" is localStorage and nothing else. That is a real
// limitation and the UI says so rather than implying a server: drafts live in
// ONE browser, on ONE machine, and a link sent to a colleague shows them the
// seed record, not your edits. Do not let the demo pretend otherwise.
//
// PATCHES, NOT WHOLE RECORDS. Storage holds only the fields that were actually
// changed, merged over the seed at read time. A stored whole record would go
// stale the moment the seed data changed — someone's month-old draft would
// pin every field to the old catalog and silently mask edits made to the
// mock data since. A patch only overrides what its author touched.
//
// VERSIONED KEY. The stored shape is tied to KEY_VERSION. Bump it when the
// patch shape changes and every old entry is ignored rather than parsed into
// something that throws at render.

import type { PerformanceMeasureDefinition } from '../data/firma2-performance-measures';

const KEY_VERSION = 'v1';
const KEY_PREFIX = `firma2:measure-draft:${KEY_VERSION}:`;

/** The subset of a measure the setup screen can edit. */
export type MeasureDraft = Partial<
  Pick<
    PerformanceMeasureDefinition,
    | 'name'
    | 'definition'
    | 'program'
    | 'dataType'
    | 'unit'
    | 'decimalPlaces'
    | 'aggregation'
    | 'subcategories'
    | 'reportingFrequency'
    | 'required'
    | 'reporterGuidance'
  >
>;

const keyFor = (slug: string): string => `${KEY_PREFIX}${slug}`;

/**
 * SSR-safe. Every function here runs during `astro build` as well as in the
 * browser if a module is imported at the top level, and `localStorage` does not
 * exist in Node. Guard once, here, rather than at each call site.
 */
const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    // Safari in private mode throws on access rather than returning null.
    return null;
  }
};

export const readDraft = (slug: string): MeasureDraft | null => {
  const store = storage();
  if (!store) return null;
  const raw = store.getItem(keyFor(slug));
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    // A hand-edited or half-written entry must not take the page down with it.
    return parsed && typeof parsed === 'object' ? (parsed as MeasureDraft) : null;
  } catch {
    return null;
  }
};

export const writeDraft = (slug: string, draft: MeasureDraft): boolean => {
  const store = storage();
  if (!store) return false;
  try {
    store.setItem(keyFor(slug), JSON.stringify(draft));
    return true;
  } catch {
    // Quota exceeded, or storage disabled after the page loaded. The caller
    // reports this to the user rather than claiming a save that did not happen.
    return false;
  }
};

export const clearDraft = (slug: string): void => {
  storage()?.removeItem(keyFor(slug));
};

/** Slugs with a stored draft. Used by the catalog to show edited records. */
export const draftedSlugs = (): string[] => {
  const store = storage();
  if (!store) return [];
  const slugs: string[] = [];
  for (let i = 0; i < store.length; i += 1) {
    const key = store.key(i);
    if (key?.startsWith(KEY_PREFIX)) slugs.push(key.slice(KEY_PREFIX.length));
  }
  return slugs;
};

/** Drop every local draft. Backs the catalog's reset affordance. */
export const clearAllDrafts = (): number => {
  const store = storage();
  if (!store) return 0;
  const slugs = draftedSlugs();
  slugs.forEach((slug) => store.removeItem(keyFor(slug)));
  return slugs.length;
};

/**
 * The seed record with its stored draft laid over it.
 *
 * `undefined` in a patch means "not edited", so it must NOT overwrite the seed
 * — which is exactly what a spread of `{...seed, ...patch}` would do for any
 * key present-but-undefined. Filtering those out first is the whole reason this
 * is a function rather than an inline spread.
 */
export const mergeDraft = (
  seed: PerformanceMeasureDefinition,
  draft: MeasureDraft | null,
): PerformanceMeasureDefinition => {
  if (!draft) return seed;
  const patch = Object.fromEntries(
    Object.entries(draft).filter(([, value]) => value !== undefined),
  );
  return { ...seed, ...patch } as PerformanceMeasureDefinition;
};

/** Seed + whatever is stored for it. The one call a page needs on load. */
export const withDraft = (seed: PerformanceMeasureDefinition): PerformanceMeasureDefinition =>
  mergeDraft(seed, readDraft(seed.slug));

/** Fired on `document` whenever the working record changes. */
export const MEASURE_CHANGE_EVENT = 'firma2:measure-change';

export interface MeasureChangeDetail {
  measure: PerformanceMeasureDefinition;
}

/** One place builds the event, so no listener has to guess the detail shape. */
export const emitMeasureChange = (measure: PerformanceMeasureDefinition): void => {
  document.dispatchEvent(
    new CustomEvent<MeasureChangeDetail>(MEASURE_CHANGE_EVENT, { detail: { measure } }),
  );
};
