// The workspace's plan — Free, Agency or Program — and what each includes.
// Spec: .scratch/tiers/spec.md. A plan lock keeps its page and says what would
// unlock it; an admin feature switch removes the feature (different thing).

export type Plan = 'free' | 'agency' | 'program';

export const PLANS: readonly Plan[] = ['free', 'agency', 'program'];

export const PLAN_NAME: Record<Plan, string> = { free: 'Free', agency: 'Agency', program: 'Program' };

const PLAN_KEY = 'firma2:tier';

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

// `paid` is the old two-plan switch's value: it meant what Agency includes now.
const parse = (value: string | null | undefined): Plan | null => {
  if (value === 'paid') return 'agency';
  return PLANS.includes(value as Plan) ? (value as Plan) : null;
};

/**
 * The workspace's plan. The prototype's `?tier=free|agency|program` switch sets
 * it and it sticks, the way `?as=` sets the role. Program by default, so a first
 * visit sees everything unlocked.
 */
export const readPlan = (): Plan => {
  try {
    const param = parse(new URLSearchParams(window.location.search).get('tier'));
    if (param) storage()?.setItem(PLAN_KEY, param);
    return parse(storage()?.getItem(PLAN_KEY)) ?? 'program';
  } catch {
    return 'program';
  }
};

/** Whether the workspace's plan includes a feature that needs `needs` or above. */
export const planIncludes = (needs: Plan): boolean => PLANS.indexOf(readPlan()) >= PLANS.indexOf(needs);
