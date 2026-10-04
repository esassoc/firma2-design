// Organizations added in this browser — the prototype's stand-in for a POST.
//
// Add organization lives on a page of its own (/organizations/new), so the new
// row has to survive the navigation back to the list. It is kept in this
// viewer's localStorage, the same way GIS subscriptions keeps an added
// subscription, and the list prepends it. A one-shot sessionStorage note tells
// the list to confirm the add once, on arrival, and never again on reload.
//
// Every access is wrapped: storage can be missing or throw (private windows,
// blocked site data), and the page must still work — it just forgets.

import type { Organization } from '../data/firma2-directory';

const KEY = 'firma2:organizations-added:v1';
const JUST_ADDED_KEY = 'firma2:organization-just-added:v1';

export interface JustAdded {
  name: string;
  /** Name of the organization whose settings were copied, if any. */
  copiedFrom?: string;
}

export const readAddedOrganizations = (): Organization[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
};

export const addOrganization = (organization: Organization, note: JustAdded): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify([organization, ...readAddedOrganizations()]));
    sessionStorage.setItem(JUST_ADDED_KEY, JSON.stringify(note));
  } catch {
    /* storage unavailable — the add is forgotten, the flow still completes */
  }
};

/** Reads the arrival note and clears it, so the confirmation shows once. */
export const takeJustAdded = (): JustAdded | null => {
  try {
    const raw = sessionStorage.getItem(JUST_ADDED_KEY);
    sessionStorage.removeItem(JUST_ADDED_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
