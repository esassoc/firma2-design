// "Do we already measure this?" — the measures a new draft resembles.
//
// ASKED WHERE A DUPLICATE WOULD BE MADE (user, 2026-10-09): an admin does not
// browse the catalog before adding a measure, so the check runs on the New
// measure draft instead, against everything the catalog holds. Two measures
// of the same thing split every total that should have been one — the
// brief's trust failure (§0).
//
// SCRIPTED, like the drafting it sits beside: shared words (stop words
// dropped, plurals folded) score most, then the same unit, then a shared
// classification. It needs two shared words, or one plus the same unit AND a
// shared classification — every acres measure is not a duplicate of every
// other.
//
// THE CLAIM IS READ TOO, not only the drafted name: the draft can guess
// wrong, and what the author typed is what they meant to measure.

import { measureDisplayName } from '../data/firma2-performance-measures';
import type { PerformanceMeasureDefinition } from '../data/firma2-performance-measures';

const STOP = new Set([
  'of', 'the', 'a', 'an', 'and', 'or', 'in', 'on', 'to', 'for', 'per', 'by', 'with', 'from',
  'year', 'acres', 'acre', 'miles', 'mile', 'tons', 'ton', 'number', 'count', 'total',
  // claim phrasing: "I need to tell my funder how many…"
  'need', 'tell', 'funder', 'report', 'know', 'how', 'many', 'much', 'each', 'our', 'we', 'wants',
  'want', 'asks', 'board', 'program', 'what', 'give', 'gives', 'people',
]);

/** Significant words, lower-cased, with a trailing plural "s" folded. */
const words = (text: string): Set<string> =>
  new Set(
    text
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((w) => w.length > 2 && !STOP.has(w))
      .map((w) => (w.length > 4 && w.endsWith('s') ? w.slice(0, -1) : w)),
  );

export interface SimilarityProbe {
  name: string;
  /** The author's own sentence, read alongside the drafted name. */
  claim?: string;
  unit?: string;
  classifications?: string[];
}

/**
 * Up to `limit` measures that look like the probe, best first. Retired ones
 * are included — reactivating one beats re-creating it.
 */
export function similarMeasures(
  probe: SimilarityProbe,
  catalog: PerformanceMeasureDefinition[],
  limit = 3,
): PerformanceMeasureDefinition[] {
  const mine = words(`${probe.name} ${probe.claim ?? ''}`);
  if (mine.size === 0) return [];
  return catalog
    .map((m) => {
      const shared = [...words(measureDisplayName(m))].filter((w) => mine.has(w)).length;
      if (shared === 0) return { m, score: 0 };
      const score = shared * 2 + (probe.unit && m.unit === probe.unit ? 1 : 0) + (probe.classifications?.some((c) => (m.classifications as string[]).includes(c)) ? 1 : 0);
      return { m, score };
    })
    .filter((x) => x.score >= 4)
    .sort((a, b) => b.score - a.score || measureDisplayName(a.m).localeCompare(measureDisplayName(b.m)))
    .slice(0, limit)
    .map((x) => x.m);
}
