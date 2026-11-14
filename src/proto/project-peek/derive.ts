// PROTOTYPE — /proto/project-peek. Throwaway; deleted when a direction is picked.
// The few readings the Overview arrangements share. Same rules as production's
// firma2-project-peek, so the arrangements differ only in layout.
import type { ProjectDetail, Milestone } from '../../data/firma2-project-detail';

export const fmt = (n: number): string => n.toLocaleString('en-US');

export const spentToDate = (detail: ProjectDetail): number =>
  detail.expenditures.reduce((sum, y) => sum + y.spent, 0);

/** Production's milestoneRow: underway wins, else next, else where it stopped. */
export const pickMilestone = (
  ms: Milestone[],
): { label: string; milestone: Milestone } | null => {
  const current = ms.find((m) => m.status === 'current');
  if (current) return { label: 'Current milestone', milestone: current };
  const next = ms.find((m) => m.status === 'upcoming');
  if (next) return { label: 'Next milestone', milestone: next };
  const last = ms.at(-1);
  return last ? { label: 'Last milestone', milestone: last } : null;
};
