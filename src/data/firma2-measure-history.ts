// Reporting history per measure, off the portfolio fixture: how many period
// figures have been filed, and by how many projects. History is what makes a
// measure something to retire rather than delete (hackathon team 6).
//
// Built on the server and handed to the client as JSON (a data-history
// attribute) so projectDetails never ships to the browser; measureFiled()
// (src/lib/measure-history.ts) then adds the entries filed in this browser.
import { projectDetails } from './firma2-project-detail';

export type MeasureHistory = Record<string, { entries: number; projects: number }>;

/** Keyed by lower-cased measure name — the fixture's measures carry no slug. */
export const seededMeasureHistory = (): MeasureHistory => {
  const history: MeasureHistory = {};
  for (const detail of projectDetails.values()) {
    for (const m of detail.measures) {
      const filed = m.series.filter((p) => p.value !== null).length;
      if (!filed) continue;
      const key = m.name.toLowerCase();
      history[key] = { entries: (history[key]?.entries ?? 0) + filed, projects: (history[key]?.projects ?? 0) + 1 };
    }
  }
  return history;
};
