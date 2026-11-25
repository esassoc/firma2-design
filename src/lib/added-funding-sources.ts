// Funding sources added in this browser — the prototype's stand-in for a POST.
//
// Add funding source lives on a page of its own (/funding-sources/new), so the
// new row has to survive the navigation back to the list. It is kept in this
// viewer's localStorage, as an added organization is
// (src/lib/added-organizations.ts), and the list shows it first. A one-shot
// sessionStorage note tells the list to confirm the add once, on arrival.
//
// FAKED: one browser. An added source has no page of its own (pages are built
// ahead of time), so its name in the list is not a link; it can be picked on a
// project's funding row like any other.
//
// Every access is wrapped: storage can be missing or throw, and the page must
// still work — it just forgets.

import type { FundingSource } from '../data/firma2-funding-sources';

const KEY = 'firma2:funding-sources-added:v1';
const JUST_ADDED_KEY = 'firma2:funding-source-just-added:v1';

export const readAddedFundingSources = (): FundingSource[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addFundingSource = (source: FundingSource): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify([source, ...readAddedFundingSources()]));
    sessionStorage.setItem(JUST_ADDED_KEY, source.name);
  } catch {
    /* storage unavailable — the add is forgotten, the flow still completes */
  }
};

/** Reads the arrival note and clears it, so the confirmation shows once. */
export const takeJustAddedFundingSource = (): string | null => {
  try {
    const name = sessionStorage.getItem(JUST_ADDED_KEY);
    sessionStorage.removeItem(JUST_ADDED_KEY);
    return name;
  } catch {
    return null;
  }
};
