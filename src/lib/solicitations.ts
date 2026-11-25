// Browser-local edits to the workspace's solicitations — same honesty terms
// as every other draft store in this prototype (src/lib/stage-draft.ts):
// localStorage, one browser, no backend. FAKED: a real workspace keeps them on
// the server, and turning one off reaches every member at once.

import { SEED_SOLICITATIONS } from '../data/firma2-solicitations';
import type { Solicitation } from '../data/firma2-solicitations';

const KEY = 'firma2:solicitations:v1';

export const readSolicitations = (): Solicitation[] => {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Solicitation[];
  } catch {
    // Blocked or corrupt storage falls back to the seed.
  }
  return SEED_SOLICITATIONS.map((s) => ({ ...s }));
};

export const writeSolicitations = (list: Solicitation[]): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Unsaved in this browser; the page still shows the change.
  }
};

/** The solicitations the intake form offers, by name, in the list's order. */
export const activeSolicitationNames = (): string[] => readSolicitations().filter((s) => s.active).map((s) => s.name);
