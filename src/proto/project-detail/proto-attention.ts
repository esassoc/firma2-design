// PROTOTYPE — what a project record is asking of its editors, derived from the
// record alone. Throwaway with src/proto/project-detail/.
//
// Every item is a fact the record already holds, never an invented deadline:
// a closed period with no report (isClosedPeriod, the same rule the measures
// matrix uses), a closed year with no spend after spending had started, a
// milestone whose date has passed while it is still open, changes waiting to
// be published, and empty sections. Each carries the door that fixes it — an
// existing control on the page, addressed by a selector, so the strip never
// grows a second copy of a workflow.
import { isClosedPeriod } from '../../data/firma2-project-detail';
import type { ProjectDetail } from '../../data/firma2-project-detail';

export type AttentionKind = 'report' | 'spend' | 'milestone' | 'publish' | 'empty';

export interface AttentionItem {
  kind: AttentionKind;
  /** Front-loaded sentence: the thing, then the gap. */
  text: string;
  /** Button label — the verb that fixes it. */
  action: string;
  /** A control already on the page to click, or a section to go to. */
  click?: string;
  scrollTo?: string;
  href?: string;
  /** Sort weight: lower is more urgent. */
  weight: number;
}

export const TODAY = new Date('2026-11-02');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const parseMonthYear = (s: string): Date | null => {
  const [m, y] = s.split(' ');
  const mi = MONTHS.indexOf(m);
  return mi >= 0 && Number(y) ? new Date(Number(y), mi + 1, 0) : null;
};

/** The latest closed reporting period across the project's measures. */
export const duePeriod = (detail: ProjectDetail): number | null => {
  const years = detail.measures.flatMap((m) => m.series.filter(isClosedPeriod).map((p) => p.year));
  return years.length ? Math.max(...years) : null;
};

export const missingReports = (detail: ProjectDetail, year: number) =>
  detail.measures.filter((m) => m.series.some((p) => p.year === year && isClosedPeriod(p) && p.value === null));

export const attentionFor = (detail: ProjectDetail, reviewHref?: string): AttentionItem[] => {
  const items: AttentionItem[] = [];
  const year = duePeriod(detail);

  if (year !== null) {
    const missing = missingReports(detail, year);
    if (missing.length) {
      const names = missing.map((m) => m.name);
      const list = names.length > 2 ? `${names[0]} and ${names.length - 1} more` : names.join(' and ');
      items.push({
        kind: 'report',
        text: `${year} report: ${missing.length} of ${detail.measures.length} measures missing — ${list}`,
        action: `Report ${year}`,
        click: '[data-pm-due-report]',
        weight: 0,
      });
    }
  }

  const closedSpend = detail.expenditures.filter((y) => y.status !== 'upcoming' && y.year < 2026);
  const started = closedSpend.some((y) => y.spent > 0);
  const lastClosed = closedSpend.at(-1);
  if (started && lastClosed && lastClosed.spent === 0) {
    items.push({
      kind: 'spend',
      text: `${lastClosed.year} spending not recorded`,
      action: 'Record spend',
      click: '[data-firma2-spend-record]',
      weight: 1,
    });
  }

  const overdue = detail.milestones.filter((m) => {
    const d = parseMonthYear(m.date);
    return (m.status === 'current' || m.status === 'upcoming') && d !== null && d < TODAY;
  });
  if (overdue.length) {
    items.push({
      kind: 'milestone',
      text: `${overdue[0].title} — due ${overdue[0].date}, still open${overdue.length > 1 ? ` (+${overdue.length - 1})` : ''}`,
      action: 'Update milestone',
      scrollTo: 'milestones',
      weight: 2,
    });
  }

  const changes = detail.publishing.changes.length;
  if (changes) {
    items.push({
      kind: 'publish',
      text: `${changes} ${changes === 1 ? 'change' : 'changes'} not yet on the public page`,
      action: 'Review changes',
      href: reviewHref,
      weight: 3,
    });
  }

  if (!detail.photos.length) items.push({ kind: 'empty', text: 'No photos yet', action: 'Add photo', scrollTo: 'photos', weight: 4 });
  if (!detail.milestones.length) items.push({ kind: 'empty', text: 'No milestones yet', action: 'Add milestone', scrollTo: 'milestones', weight: 4 });

  return items.sort((a, b) => a.weight - b.weight);
};

/** Per-section state for tile headers: what a section needs, or that it is fine. */
export type SectionState = { tone: 'attention' | 'quiet'; text: string };
export const sectionStates = (detail: ProjectDetail): Record<string, SectionState> => {
  const year = duePeriod(detail);
  const missing = year !== null ? missingReports(detail, year).length : 0;
  const items = attentionFor(detail);
  const has = (k: AttentionKind) => items.find((i) => i.kind === k);
  return {
    measures: missing
      ? { tone: 'attention', text: `${missing} missing for ${year}` }
      : { tone: 'quiet', text: year ? `${year} reported` : 'Nothing due' },
    expenditures: has('spend') ? { tone: 'attention', text: 'Last year not recorded' } : { tone: 'quiet', text: 'Up to date' },
    milestones: has('milestone') ? { tone: 'attention', text: 'Past due' } : { tone: 'quiet', text: 'On schedule' },
    photos: detail.photos.length ? { tone: 'quiet', text: `${detail.photos.length} added` } : { tone: 'attention', text: 'None yet' },
    comments: { tone: 'quiet', text: detail.comments.length ? `${detail.comments.length} total` : 'None yet' },
  };
};
