// Whether this workspace lets Import a report send documents to an outside AI
// service to be read. One setting, three states, kept in THIS browser.
//
// THE DECISION (.scratch/project-updates/spec.md, decision 41; user,
// 2026-11-23). A report holds names, emails and budgets, and reading it means
// sending it to a service outside the product. So it is the workspace's call:
// OFF until an administrator agrees and turns it on, ON until one turns it off
// again, and UNAVAILABLE where the workspace's own terms do not allow its
// documents to leave. While it is off or unavailable Import a report is not
// offered, and the place it would be says why.
//
// THE SAMPLE WORKSPACE ARRIVES WITH IT ON. A real workspace starts off. This
// one is seeded as already turned on by its administrator, the way every other
// setting here is seeded with a plausible value, so the Import a report screens
// can be walked without a detour through settings. Turn it off on Security to
// see the other state; clearing this browser's storage restores the seed.
//
// UNAVAILABLE HAS NO SCREEN. The product's operator sets it from outside the
// workspace (stories 82 and 83). To see that state in the prototype, open any
// page with `?ai-reading=unavailable`; `?ai-reading=reset` puts the seed back.
// That switch is a prototype artifact, like `?as=`.
//
// Browser-local, one versioned key, same honesty terms as every store here.

import { TODAY_ISO } from '../data/firma2-publish-history';

const KEY = 'firma2:ai-reading:v1';

/** Fired on `document` whenever the setting changes. */
export const AI_READING_EVENT = 'firma2:ai-reading';

export type AiReadingState = 'off' | 'on' | 'unavailable';

export interface AiReading {
  state: AiReadingState;
  /** Who last turned it on or off. Absent while unavailable. */
  by?: string;
  /** ISO day of that act. */
  iso?: string;
}

const SEED: AiReading = { state: 'on', by: 'Dana Whitfield', iso: '2026-09-12' };

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

const write = (next: AiReading | null): void => {
  try {
    if (next) storage()?.setItem(KEY, JSON.stringify(next));
    else storage()?.removeItem(KEY);
  } catch {
    // Blocked storage: the seed stands for this page view.
  }
  if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent(AI_READING_EVENT));
};

/** The prototype's `?ai-reading=` switch, applied once per page load. */
const applySwitch = (): void => {
  if (typeof location === 'undefined') return;
  const asked = new URLSearchParams(location.search).get('ai-reading');
  if (asked === 'unavailable') write({ state: 'unavailable' });
  else if (asked === 'reset') write(null);
};
applySwitch();

export const readAiReading = (): AiReading => {
  try {
    const parsed = JSON.parse(storage()?.getItem(KEY) ?? 'null') as AiReading | null;
    if (parsed && (parsed.state === 'on' || parsed.state === 'off' || parsed.state === 'unavailable')) return parsed;
  } catch {
    // Unreadable: fall through to the seed.
  }
  return SEED;
};

/** Whether a document may be sent to be read, right now. */
export const aiReadingOn = (): boolean => readAiReading().state === 'on';

/** An administrator agreed and turned it on. Nothing happens while unavailable. */
export const turnOnAiReading = (by: string): void => {
  if (readAiReading().state === 'unavailable') return;
  write({ state: 'on', by, iso: TODAY_ISO });
};

/** An administrator turned it off. Nothing happens while unavailable. */
export const turnOffAiReading = (by: string): void => {
  if (readAiReading().state === 'unavailable') return;
  write({ state: 'off', by, iso: TODAY_ISO });
};

/**
 * Why Import a report is not offered, in one line. Names the role and never a
 * person (request surfaces never name the people who decide). Null while on.
 */
export const aiReadingReason = (state: AiReadingState = readAiReading().state): string | null => {
  if (state === 'off') return 'Import a report is off for this workspace. An administrator can turn it on in workspace settings.';
  if (state === 'unavailable') return 'Import a report is not available to this workspace.';
  return null;
};
