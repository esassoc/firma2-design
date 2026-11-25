// Whether a funding source is accepting requests, as changed in THIS browser.
//
// The build seeds each source's `accepting` and `closes`
// (src/data/firma2-funding-sources.ts). An administrator opens or closes a
// source on its page; that choice is kept here, per source, and laid over the
// seed wherever the answer is read: the source's page, the index, and the
// project page's funding row sheet, which refuses a new request to a closed
// source (docs/data-model.md, decision 16).
//
// FAKED: localStorage in one browser stands in for the workspace's record, so
// a second person never sees the change. Clearing the key restores the seed.

const KEY = 'firma2:funding-sources:v1';

/** Fired on `document` when a source's accepting state changes, with `{ slug }`. */
export const FUNDING_SOURCES_EVENT = 'firma2:funding-sources';

export interface AcceptingState {
  accepting: boolean;
  /** The last day a request may be submitted, `YYYY-MM-DD`. Empty or absent: no closing date. */
  closes?: string;
}

type State = Record<string, AcceptingState>;

const readAll = (): State => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

/** This browser's choice for a source, or the seed when it has made none. */
export const acceptingState = (slug: string, seed: AcceptingState): AcceptingState => readAll()[slug] ?? seed;

export const saveAcceptingState = (slug: string, next: AcceptingState): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...readAll(), [slug]: { accepting: next.accepting, ...(next.closes ? { closes: next.closes } : {}) } }));
  } catch {
    // Blocked storage: nothing is kept past this page view.
  }
  document.dispatchEvent(new CustomEvent(FUNDING_SOURCES_EVENT, { detail: { slug } }));
};

/** Whether a request may be submitted on `today` (`YYYY-MM-DD`). The date is inclusive. */
export const isOpen = (state: AcceptingState, today: string): boolean => state.accepting && (!state.closes || today <= state.closes);

const DAY = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** "Open until Feb 26, 2027", "Open" or "Closed": the same words the build prints. */
export const openLabel = (state: AcceptingState, today: string): string =>
  !isOpen(state, today) ? 'Closed' : state.closes ? `Open until ${DAY.format(new Date(`${state.closes}T00:00:00Z`))}` : 'Open';
