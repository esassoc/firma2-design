// Where a measure's figure comes from, as edited in THIS browser — the
// `source` and `estimateMethod` of a PerformanceMeasureDefinition
// (src/data/firma2-performance-measures.ts).
//
// A SIDE STORE, NOT A FIELD OF THE DRAFT. The measure draft store
// (src/lib/measure-draft.ts) persists a fixed list of fields; the estimated
// source arrived after it (2026-11-12) and lives here, overlaid the same way:
// seed first, this browser's choice on top. Everything that reads a measure's
// source goes through withSource(), so the editor and the project page can
// never disagree. Folding it into the draft patch (and its versioned key) is
// the clean follow-up.
//
// SSR-safe: every read guards localStorage.

import type { MeasureSource, PerformanceMeasureDefinition } from '../data/firma2-performance-measures';

const KEY = 'firma2:measure-source:v1';

interface SourceChoice {
  source: MeasureSource;
  estimateMethod?: string;
}

const readAll = (): Record<string, SourceChoice> => {
  try {
    if (typeof localStorage === 'undefined') return {};
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, SourceChoice>;
  } catch {
    return {};
  }
};

export const readSourceChoice = (slug: string): SourceChoice | null => readAll()[slug] ?? null;

/** Store a choice, or clear it when it matches the seed (null). */
export const writeSourceChoice = (slug: string, choice: SourceChoice | null): void => {
  try {
    const all = readAll();
    if (choice) all[slug] = choice;
    else delete all[slug];
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage blocked: the choice lasts this page view */
  }
};

/** A measure with this browser's source choice laid over it. */
export const withSource = (m: PerformanceMeasureDefinition): PerformanceMeasureDefinition => {
  const choice = readSourceChoice(m.slug);
  if (!choice) return m;
  return {
    ...m,
    source: choice.source,
    estimateMethod: choice.source === 'estimated' ? choice.estimateMethod : undefined,
  };
};
