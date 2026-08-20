// Portfolio rollup for one performance measure — the data behind the setup
// page's second preview panel: what this measure has actually accumulated
// across every project reporting it.
//
// WHY THIS IS ITS OWN MODULE. It JOINS two datasets that are otherwise
// independent — the measure catalog (firma2-performance-measures) and the
// per-project reported values (firma2-project-detail). Neither should import
// the other to get this, so the join lives here and both stay unaware of it.
//
// THE JOIN IS BY MEASURE NAME, and it is deliberately EXACT. A project reports
// "Acres treated with prescribed fire"; the catalog defines a measure with that
// name; those are the same measure. Fuzzy matching would quietly fold "Acres
// treated" into "Acres treated with prescribed fire" and inflate a total nobody
// could then explain. A catalog measure no project reports under that exact
// name returns an EMPTY rollup, which is the truthful answer and the state a
// brand-new draft is always in.
//
// DETERMINISM. No Date.now() — design-principles requires the same render on
// every run, and a chart whose bars move because the demo was opened in
// January would be worse than one anchored to a fixed year. TODAY_YEAR is that
// anchor and is the ONLY place the current year is stated.
//
// THE YEAR SPREAD IS DERIVED, NOT AUTHORED. A project stores one cumulative
// `reported` figure and its implementation window; it does not store per-year
// values. Rather than invent twenty-four per-year series by hand — which would
// drift out of agreement with the totals on the project pages the moment either
// changed — each project's reported total is spread evenly across the years it
// has actually been reporting, and the series is the sum of those spreads. The
// chart therefore always agrees with the project detail pages by construction.
// It is an approximation of shape, and it is labelled as one at the call site.

import { projects } from './firma2-projects';
import { getProjectDetail } from './firma2-project-detail';
import type { PerformanceMeasureDefinition } from './firma2-performance-measures';

/** The fixed "now" every derived series is anchored to. See the determinism note. */
export const TODAY_YEAR = 2026;

/** One year's total across every project reporting the measure. */
export interface RollupYear {
  year: number;
  /** Summed reported value for that year, in the measure's own unit. */
  value: number;
}

export interface MeasureRollup {
  /** Years in ascending order. Empty when no project reports this measure. */
  series: RollupYear[];
  /** Projects contributing to the series. */
  projectCount: number;
  /** Everything reported to date, across every year and project. */
  reportedTotal: number;
  /** What those projects collectively committed to. */
  expectedTotal: number;
  /** The unit the values carry, taken from the reporting projects. */
  unit: string;
}

const EMPTY: MeasureRollup = {
  series: [],
  projectCount: 0,
  reportedTotal: 0,
  expectedTotal: 0,
  unit: '',
};

/**
 * Round to the precision the measure itself declares, so a derived per-year
 * figure never renders more decimals than the measure would ever accept.
 */
const roundTo = (value: number, places: number): number => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

export const getMeasureRollup = (measure: PerformanceMeasureDefinition): MeasureRollup => {
  // A measure with no name cannot match anything — this is the draft case, and
  // it short-circuits before doing 24 project lookups to prove it.
  if (!measure.name.trim()) return EMPTY;

  const byYear = new Map<number, number>();
  let reportedTotal = 0;
  let expectedTotal = 0;
  let projectCount = 0;
  let unit = '';

  for (const project of projects) {
    const reported = getProjectDetail(project).measures.find((m) => m.name === measure.name);
    if (!reported) continue;

    projectCount += 1;
    reportedTotal += reported.reported;
    expectedTotal += reported.expected;
    unit ||= reported.unit;

    // The years this project has actually been reporting: from the year work
    // started to the year it finished, capped at TODAY_YEAR so a project
    // running to 2031 does not draw bars into the future it has not reached.
    const firstYear = project.implementationStartYear;
    const lastYear = Math.min(project.completionYear, TODAY_YEAR);
    if (lastYear < firstYear) continue;

    const span = lastYear - firstYear + 1;
    const perYear = reported.reported / span;
    for (let year = firstYear; year <= lastYear; year += 1) {
      byYear.set(year, (byYear.get(year) ?? 0) + perYear);
    }
  }

  if (projectCount === 0) return EMPTY;

  const series = [...byYear.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, value]) => ({ year, value: roundTo(value, measure.decimalPlaces) }));

  return {
    series,
    projectCount,
    reportedTotal: roundTo(reportedTotal, measure.decimalPlaces),
    expectedTotal: roundTo(expectedTotal, measure.decimalPlaces),
    unit: unit || measure.unit,
  };
};
