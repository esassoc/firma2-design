// How far a published measure reaches: how many projects it appears on, and
// how many of them have committed to it with a target. Backs the measure
// page's status line and its Publish dialog (user, 2026-10-09) — "Reporters
// are filing values" was untrue on the day a measure was published, and hid
// the admin's real next step: projects setting targets.
//
// A PUBLISHED MEASURE APPEARS ON EVERY PROJECT (the PM 2 reconciliation), so
// reach is the project count. COMMITMENT is a target above zero, from two
// places: the seeded project rows that report toward the measure (built
// data, passed in, with this browser's edits to them in the override store)
// and measures a project committed to in this browser.

import { readProjectMeasures, readTargetOverrides } from './project-measure-draft';

/** A seeded project row that reports toward a catalog measure. */
export interface SeedTarget {
  project: string;
  /** The row's key in the override store: `name:<row name>`. */
  key: string;
  expected: number;
}

export function projectsWithTarget(measureSlug: string, seeds: SeedTarget[], projectSlugs: string[]): number {
  const committed = new Set<string>();
  for (const s of seeds) {
    const target = readTargetOverrides(s.project)[s.key] ?? s.expected;
    if (target > 0) committed.add(s.project);
  }
  for (const project of projectSlugs) {
    if (readProjectMeasures(project).some((e) => e.measureSlug === measureSlug && e.target > 0)) committed.add(project);
  }
  return committed.size;
}
