// Which classifications a performance measure reports toward — read from the
// GOAL side, the one place the link is set (user, 2026-10-09).
//
// A CLASSIFICATION PICKS ITS MEASURES, not the other way round: the link
// carries the goal's target, which only the goal's owner can set, and a
// measure is defined to be reused by goals that may not exist yet. So the
// link is edited in Workspace settings › Classifications (the KPI editor)
// and nowhere else; the measure's page only reads it.
//
// ONE FACT, SEED PLUS EDITS: the catalog's seeded links (a seed measure's
// `classifications`) overlaid with this browser's goal-side edits
// (kpiSlugs in src/lib/taxonomy-edits.ts) — exactly what the goal board and
// the classification pages draw, so the measure page can never disagree
// with them.

import { CLASSIFICATIONS } from '../data/firma2-classifications';
import { measures } from '../data/firma2-performance-measures';
import { entries, kpiSlugs } from './taxonomy-edits';
import type { TaxonomyEntry } from './taxonomy-edits';

/** A classification's seeded measures: the catalog links the build knows. */
const seededKpis = (classificationSlug: string): string[] => {
  const seed = CLASSIFICATIONS.find((c) => c.slug === classificationSlug);
  return seed ? measures.filter((m) => m.status !== 'Retired' && m.classifications.includes(seed.name)).map((m) => m.slug) : [];
};

/** The classifications tracking a measure, in the workspace's order. Browser only. */
export const goalsTracking = (measureSlug: string): TaxonomyEntry[] =>
  entries('classification').filter((c) => kpiSlugs(c.slug, seededKpis(c.slug)).includes(measureSlug));
