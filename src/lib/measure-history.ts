// The client half of a measure's reporting history: the server's seeded
// counts (src/data/firma2-measure-history.ts) plus the entries filed in this
// browser. A separate module so the fixture behind the seed never ships.
import { measureDisplayName } from '../data/firma2-performance-measures';
import type { PerformanceMeasureDefinition } from '../data/firma2-performance-measures';
import type { MeasureHistory } from '../data/firma2-measure-history';

/** Figures filed against one measure: the portfolio's plus this browser's. Client-side. */
export const measureFiled = (
  record: PerformanceMeasureDefinition,
  seeded: MeasureHistory,
): { entries: number; projects: number } => {
  const name = measureDisplayName(record).toLowerCase();
  const base = seeded[name] ?? { entries: 0, projects: 0 };
  let { entries, projects } = base;
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i) ?? '';
      if (!key.startsWith('firma2:entries:v1:')) continue;
      const mine = (JSON.parse(localStorage.getItem(key) ?? '[]') as { measureKey: string }[]).filter(
        (e) => e.measureKey === record.slug || e.measureKey.toLowerCase() === `name:${name}`,
      );
      if (mine.length) {
        entries += mine.length;
        if (!base.entries) projects += 1;
      }
    }
  } catch {
    // Blocked storage: the portfolio's figures are the whole history.
  }
  return { entries, projects };
};
