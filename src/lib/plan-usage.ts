// What each plan includes, counted — and how much of it the workspace uses.
// Spec: .scratch/tiers/spec.md (Limits, #5, #9). Limits are few and on volume
// only; measures, fields and map layers are gated by feature, never by count.
//
// OVER A LIMIT, NOTHING GOES. A workspace over a cap (a downgrade, or the
// prototype's plan switch) keeps everything and can still edit it; it just
// can't add more of that thing until it upgrades or removes some.

import { projects } from '../data/firma2-projects';
import { organizations, users } from '../data/firma2-directory';
import { readAddedOrganizations } from './added-organizations';
import { PLANS, readPlan, type Plan } from './workspace-plan';

export type Metric = 'organizations' | 'projects' | 'contributors' | 'viewers' | 'storage';

export const METRICS: readonly Metric[] = ['organizations', 'projects', 'contributors', 'viewers', 'storage'];

/** `null` is unlimited. Program's organizations and storage are priced in bands, so unlimited here. Storage is in GB. */
export const LIMITS: Record<Plan, Record<Metric, number | null>> = {
  free: { organizations: 1, projects: 50, contributors: 5, viewers: null, storage: 2 },
  agency: { organizations: 4, projects: null, contributors: null, viewers: null, storage: 100 },
  program: { organizations: null, projects: null, contributors: null, viewers: null, storage: null },
};

// Invented: the mock workspace's files.
const STORAGE_USED_GB = 1.4;

const seats = (role: string): number => users.filter((u) => u.role === role && u.status !== 'Suspended').length;

/** How much the workspace uses. Contributors count administrators too: both edit. Suspended people don't count. */
export const readUsage = (): Record<Metric, number> => ({
  organizations: organizations.length + readAddedOrganizations().length,
  projects: projects.length,
  contributors: seats('Administrator') + seats('Contributor'),
  viewers: seats('Viewer'),
  storage: STORAGE_USED_GB,
});

export const limitOf = (metric: Metric, plan: Plan = readPlan()): number | null => LIMITS[plan][metric];

/** Whether the workspace can't add another of `metric` on its plan. */
export const atLimit = (metric: Metric, plan: Plan = readPlan()): boolean => {
  const limit = limitOf(metric, plan);
  return limit !== null && readUsage()[metric] >= limit;
};

/** The next plan up that raises or removes `metric`'s limit. */
export const nextPlanFor = (metric: Metric, plan: Plan): Plan | null => {
  const limit = LIMITS[plan][metric];
  return PLANS.slice(PLANS.indexOf(plan) + 1).find((p) => LIMITS[p][metric] === null || (limit !== null && LIMITS[p][metric]! > limit)) ?? null;
};
