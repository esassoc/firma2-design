// The drafting call's warnings, kept with the draft they were written about.
// The drafter shows them; "Open in setup" used to drop them on the way to the
// sheet, which is where someone actually decides whether to publish. Keyed by
// measure slug, cleared when the measure is published.

const KEY = 'firma2:measure-warnings:v1';

const read = (): Record<string, string[]> => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, string[]>;
  } catch {
    return {};
  }
};

const write = (all: Record<string, string[]>): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // Blocked storage: the warnings stay on the drafting page only.
  }
};

export const readMeasureWarnings = (slug: string): string[] => read()[slug] ?? [];

export const writeMeasureWarnings = (slug: string, warnings: string[]): void => write({ ...read(), [slug]: warnings });

export const clearMeasureWarnings = (slug: string): void => {
  const all = read();
  delete all[slug];
  write(all);
};
