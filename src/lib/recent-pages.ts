// recent-pages — this browser's history of app pages, newest first. Per
// browser, like the rail's own arrangement: the prototype has no account to
// store it on.
//
// ONE HISTORY, TWO READERS (2026-11-24). AppLayout records every app page
// visit here; the global search shows it as Recent when its query is empty,
// and the Projects table's search shows the projects in it
// (firma2-recent-projects). The footer's Recent menu, which read the same
// store, was removed the same day: two searches already show it.

const STORE = 'firma2:recent-pages';
const LIMIT = 12;

export interface RecentVisit {
  /** Path and query, with the base — what location gives. */
  href: string;
  /** The page's own name, without the " — section — product" tail. */
  title: string;
  /** When it was last opened, ms since epoch. Absent on visits recorded before 2026-11-24. */
  at?: number;
}

export const readRecentVisits = (): RecentVisit[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((v) => v && typeof v.href === 'string') : [];
  } catch {
    return [];
  }
};

/** Records the page being shown. Call once per page load. */
export const recordRecentVisit = (): void => {
  const href = location.pathname + location.search;
  // Page titles read "Stages — Workspace settings — ProjectFirma 2.0";
  // only the page's own name fits a row.
  const title = document.title.split(' — ')[0].trim() || 'Untitled page';
  const visits = [{ href, title, at: Date.now() }, ...readRecentVisits().filter((v) => v.href !== href)].slice(0, LIMIT);
  try {
    localStorage.setItem(STORE, JSON.stringify(visits));
  } catch {
    /* private window — the history keeps what it can */
  }
};

/** "Today", "Yesterday", "3 days ago", "2 weeks ago" — by calendar day. */
export const viewedLabel = (at: number | undefined, now = Date.now()): string => {
  if (!at) return 'Earlier';
  const day = (t: number) => Math.floor((t - new Date(t).getTimezoneOffset() * 60_000) / 86_400_000);
  const days = day(now) - day(at);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 14) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
};
