// A performance measure's reading page, as arithmetic: the portfolio's figure
// per closed year, and who filed for the last one. Shared by the page's
// summary, its chart and its projects table so the three cannot disagree.
//
// THE COUNTING RULE DECIDES THE YEAR'S FIGURE ([[measure-counting-rule-framing]]):
// a measure that sums adds the projects' values; one that does not averages
// them. A year with nothing filed is null — "nothing filed" is not zero.

import type { KpiProgress } from '../data/firma2-classification-rollup';

export interface MeasureYearFigure {
  year: number;
  /** Sum (or average) of what was filed; null when no project filed, or the
   *  year has not closed. */
  value: number | null;
  /**
   * What the projects planned for the year — their yearly targets added (for
   * a measure that sums) or averaged (for one that does not, where a target is
   * a reading to hold, the same each year). Null when no project planned it.
   */
  planned: number | null;
  /** The year has closed, so a value can exist for it. */
  closed: boolean;
  /** Projects that owed a value for the year (closed years only). */
  owed: number;
  /** Of those, the ones that filed one. */
  filed: number;
}

/**
 * Every year any reporting project's window covers, oldest first — closed
 * years with what was filed against what was planned, open years with the
 * plan alone (a plan is made ahead).
 */
export const measureByYear = (progress: KpiProgress): MeasureYearFigure[] => {
  const { contributions, additive } = progress;
  const years = [...new Set(contributions.flatMap((c) => [...c.plan.map((y) => y.year), ...c.series.map((y) => y.year)]))].sort((a, b) => a - b);
  const round = (n: number) => Number(n.toFixed(4));
  return years.map((year) => {
    const cells = contributions
      .map((c) => c.series.find((y) => y.year === year))
      .filter((cell): cell is NonNullable<typeof cell> => Boolean(cell));
    const values = cells.map((c) => c.value).filter((v): v is number => v != null);
    const sum = values.reduce((s, v) => s + v, 0);
    const value = values.length ? round(additive ? sum : sum / values.length) : null;

    const planning = contributions.filter((c) => c.plan.some((y) => y.year === year) && c.committed > 0);
    const planned = !planning.length
      ? null
      : additive
        ? round(planning.reduce((s, c) => s + (c.plan.find((y) => y.year === year)?.planned ?? 0), 0))
        : round(planning.reduce((s, c) => s + c.committed, 0) / planning.length);

    return { year, value, planned, closed: cells.length > 0, owed: cells.length, filed: values.length };
  });
};

export type FilingState = 'filed' | 'missing' | 'not-due';

/** Whether one project filed this measure for `year`. */
export const filingFor = (series: { year: number; value: number | null }[], year: number): FilingState => {
  const cell = series.find((y) => y.year === year);
  if (!cell) return 'not-due';
  return cell.value == null ? 'missing' : 'filed';
};
