// Review and publishing — the sweep a steward or administrator runs to bring
// public pages up to date. One module for the routes, the queues and the
// review schedules, so the org's Review page, the workspace's, the project's
// badge and the review page itself count the same projects the same way.
//
// The per-project facts (last publish, the net diff) are built with each
// record in firma2-publish-history; this module only gathers them.
//
// A QUEUE IS EVERY PROJECT, NOT ONLY THE PENDING ONES. "Did we get to all of
// them?" is the steward's question, so a queue knows its whole set and says
// how much of it is published. Oldest waiting first: the page that has been
// behind longest is the one a reader is most likely to have misread.
//
// SCHEDULES ARE OPTIONAL. "Whenever they feel like it" is the default (no
// schedule): the queue and how long each project has waited are the whole
// story. An organization that wants a rhythm sets one in Organization settings
// › Review schedule, and only then does anything read as Overdue.

import { getProjectDetail } from './firma2-project-detail';
import type { UnpublishedChange } from './firma2-publish-history';
import { daysBetween } from './firma2-publish-history';
import { projectHref, projectSlug, projects } from './firma2-projects';
import type { Project } from './firma2-projects';
import { organizationProjects } from './firma2-organization-pages';
import { organizations } from './firma2-directory';
import { REVIEW_CADENCES, type ReviewCadence } from './firma2-review-cadence';

// ---------------------------------------------------------------------------
// Routes — base-less, like every route in this spoke
// ---------------------------------------------------------------------------

export const WORKSPACE_REVIEW_HREF = '/prototypes/review';
export const WORKSPACE_UPDATES_HREF = '/prototypes/updates';
export const reviewHref = (project: Project): string => `${WORKSPACE_REVIEW_HREF}/${projectSlug(project)}`;
export const publicHref = (project: Project): string => `/prototypes/public/${projectSlug(project)}`;

// ---------------------------------------------------------------------------
// Schedules
// ---------------------------------------------------------------------------

export type { ReviewCadence } from './firma2-review-cadence';
export { REVIEW_CADENCES } from './firma2-review-cadence';

// Invented. The host board sweeps quarterly; two other funders keep a rhythm;
// everyone else publishes when they get to it.
const CADENCE_SEEDS: Record<string, ReviewCadence> = {
  'California Watershed Restoration Board': 'quarterly',
  'Pacific Fisheries Trust': 'twice-yearly',
  'National Watershed Partnership': 'yearly',
};

export const reviewCadence = (organization: string): ReviewCadence => CADENCE_SEEDS[organization] ?? 'none';
export const cadenceDays = (cadence: ReviewCadence): number | null => REVIEW_CADENCES.find((c) => c.value === cadence)!.days;
export const cadenceLabel = (cadence: ReviewCadence): string => REVIEW_CADENCES.find((c) => c.value === cadence)!.label;

// ---------------------------------------------------------------------------
// Queue items
// ---------------------------------------------------------------------------

export interface ReviewItem {
  project: Project;
  slug: string;
  projectHref: string;
  reviewHref: string;
  publishedIso: string | null;
  publishedBy: string | null;
  changes: UnpublishedChange[];
  /** Log entries since the last publish. */
  edits: number;
  editors: string[];
  /** Days since the oldest unpublished entry; 0 when nothing waits. */
  waitingDays: number;
  waitingSinceIso: string | null;
}

export const reviewItem = (project: Project): ReviewItem => {
  const { publishing } = getProjectDetail(project);
  const editors = [...new Set(publishing.changes.flatMap((c) => c.editors))];
  return {
    project,
    slug: projectSlug(project),
    projectHref: projectHref(project),
    reviewHref: reviewHref(project),
    publishedIso: publishing.publishedIso,
    publishedBy: publishing.publishedBy,
    changes: publishing.changes,
    edits: publishing.edits,
    editors,
    waitingDays: publishing.waitingSinceIso ? daysBetween(publishing.waitingSinceIso) : 0,
    waitingSinceIso: publishing.waitingSinceIso,
  };
};

const byWaiting = (a: ReviewItem, b: ReviewItem) =>
  b.waitingDays - a.waitingDays || a.project.projectName.localeCompare(b.project.projectName);

export interface ReviewQueue {
  /** Every project in scope, pending first (oldest waiting first), then the published ones by name. */
  items: ReviewItem[];
  pending: ReviewItem[];
  total: number;
  /** null when the scope keeps no schedule. */
  cadenceDays: number | null;
  overdue: ReviewItem[];
}

const queueOf = (list: Project[], days: number | null): ReviewQueue => {
  const items = list.map(reviewItem);
  const pending = items.filter((i) => i.changes.length > 0).sort(byWaiting);
  const done = items.filter((i) => i.changes.length === 0).sort((a, b) => a.project.projectName.localeCompare(b.project.projectName));
  return {
    items: [...pending, ...done],
    pending,
    total: items.length,
    cadenceDays: days,
    overdue: days === null ? [] : pending.filter((i) => i.waitingDays > days),
  };
};

/** One organization's sweep: the projects it leads or funds, against its own schedule. */
export const organizationQueue = (organization: string): ReviewQueue =>
  queueOf(organizationProjects(organization).map((r) => r.project), cadenceDays(reviewCadence(organization)));

/** Every project's organizations — its lead, then its funders. */
const organizationsOf = (project: Project): string[] => {
  const funders = getProjectDetail(project).funding.map((f) => f.organization);
  return [...new Set([project.leadOrganization, ...funders])];
};

/** Each project's organizations, by slug — what the workspace's overdue test reads. */
export const organizationsByProject = (): Map<string, string[]> =>
  new Map(projects.map((p) => [projectSlug(p), organizationsOf(p)]));

/**
 * The workspace's sweep. A project is overdue when ANY organization it
 * belongs to keeps a schedule it has missed — the administrator answers for
 * every schedule at once.
 */
export const workspaceQueue = (): ReviewQueue & { overdueFor: Map<string, string[]> } => {
  const queue = queueOf(projects, null);
  const overdueFor = new Map<string, string[]>();
  for (const item of queue.pending) {
    const late = organizationsOf(item.project).filter((org) => {
      const days = cadenceDays(reviewCadence(org));
      return days !== null && item.waitingDays > days;
    });
    if (late.length) overdueFor.set(item.slug, late);
  }
  return { ...queue, overdue: queue.pending.filter((i) => overdueFor.has(i.slug)), overdueFor };
};

export interface OrganizationBacklog {
  organization: string;
  slug: string;
  cadence: ReviewCadence;
  pending: number;
  total: number;
  oldestDays: number;
  overdue: number;
}

/** Each organization with something waiting, worst first — which sweeps have fallen behind. */
export const organizationBacklogs = (): OrganizationBacklog[] =>
  organizations
    .map((o) => {
      const q = organizationQueue(o.name);
      return {
        organization: o.name,
        slug: o.slug,
        cadence: reviewCadence(o.name),
        pending: q.pending.length,
        total: q.total,
        oldestDays: q.pending[0]?.waitingDays ?? 0,
        overdue: q.overdue.length,
      };
    })
    .filter((b) => b.pending > 0)
    .sort((a, b) => b.overdue - a.overdue || b.oldestDays - a.oldestDays || a.organization.localeCompare(b.organization));

/** "4 months", "12 days" — how long a page has been behind, at the grain a steward plans in. */
export const waitingLabel = (days: number): string => {
  if (days < 1) return 'Today';
  if (days < 45) return `${days} day${days === 1 ? '' : 's'}`;
  const months = Math.round(days / 30.4);
  return months < 24 ? `${months} months` : `${Math.floor(months / 12)} years`;
};
