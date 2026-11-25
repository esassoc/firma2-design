// Workspace "who can" thresholds — Administration › Security's per-act
// settings, made to persist and to be READ by the screens they govern.
//
// THE ACT HOLDS THE THRESHOLD, the role never changes (docs/product-brief.md
// §4, "Roles are fixed; who-can thresholds flex"). Security writes the choice
// here; a screen asks `can(act)` before offering the act. The first act read
// this way is setting a project's targets (user, 2026-10-09: "admins only set
// targets, or make a setting that can be adjusted by role").
//
// WHO IS ASKING. The signed-in reader is the directory's CURRENT_USER (an
// administrator). A prototype needs to show the other side of a threshold,
// so `?as=contributor` (or viewer) on any URL acts as that role for the
// session — a demonstration switch, not a feature, and nothing else in the
// spoke depends on it.
//
// Browser-local, one versioned key, same honesty terms as every store here.

import { CURRENT_USER, CURRENT_USER_ORGANIZATIONS, users } from '../data/firma2-directory';
import type { UserRole } from '../data/firma2-directory';
import { NEWCOMER } from '../data/firma2-access-requests';
import { readRequests } from './access-requests';
import { SECURITY_PERMISSIONS } from '../data/firma2-workspace-settings';

export type Audience = 'admins' | 'managers' | 'editors';
/** The workspace role. One type for it: the directory's (docs/data-model.md, decision 13). */
export type Role = UserRole;

const KEY = 'firma2:workspace-permissions:v1';
const AS_KEY = 'firma2:acting-as';

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

const readAll = (): Record<string, Audience> => {
  try {
    const parsed = JSON.parse(storage()?.getItem(KEY) ?? '{}');
    if (!parsed || typeof parsed !== 'object') return {};
    // Choices saved before Steward was renamed Manager (2026-11-02).
    for (const act of Object.keys(parsed)) if (parsed[act] === 'stewards') parsed[act] = 'managers';
    return parsed;
  } catch {
    return {};
  }
};

/** The threshold for an act: this browser's choice, else the seeded default. */
export const readPermission = (act: string): Audience =>
  readAll()[act] ?? ((SECURITY_PERMISSIONS.find((p) => p.key === act)?.value as Audience | undefined) ?? 'admins');

export const writePermission = (act: string, audience: Audience): void => {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(KEY, JSON.stringify({ ...readAll(), [act]: audience }));
  } catch {
    // Blocked storage: the seeded default stands, which is the honest fallback.
  }
};

export interface Actor {
  role: Role;
  /** Manages at least one organization — the middle threshold. */
  manager: boolean;
}

/**
 * Who is asking: the directory's signed-in reader, unless the prototype's
 * `?as=` switch says otherwise — admin, manager (a Contributor who manages
 * an organization), contributor or viewer. The switch sticks for the
 * session's browser until another `?as=` replaces it.
 */
/** The `?as=` value in force: this URL's, else the one this browser kept. */
export const actingAs = (): string => {
  try {
    const as = new URLSearchParams(window.location.search).get('as');
    if (as) storage()?.setItem(AS_KEY, as);
    return (as ?? storage()?.getItem(AS_KEY) ?? '').toLowerCase();
  } catch {
    return '';
  }
};

/**
 * Forget the kept `?as=` and take it off this URL, so the next read is the
 * directory's reader again. The caller reloads: every screen read its role on load.
 */
export const clearActingAs = (): void => {
  try {
    storage()?.removeItem(AS_KEY);
    const url = new URL(window.location.href);
    if (url.searchParams.has('as')) {
      url.searchParams.delete('as');
      history.replaceState(history.state, '', url);
    }
  } catch {
    /* no window or blocked storage: nothing was kept */
  }
};

/**
 * Who the reader is standing in for, as the screen should name them — or null
 * when it is the directory's own reader (no switch, or `?as=admin`, which is
 * who they already are). An unknown value names no one: currentActor ignores it too.
 */
export const actingLabel = (): string | null => {
  const as = actingAs();
  if (as === 'newcomer') return currentPerson().name;
  if (as === 'manager' || as === 'steward') return 'Manager';
  if (as === 'contributor') return 'Contributor';
  if (as === 'viewer') return 'Viewer';
  return null;
};

export interface Person {
  name: string;
  email: string;
  organizations: string[];
}

/**
 * THE NEWCOMER (`?as=newcomer`): the invented person the first sign-in pages
 * are shown as. They hold whatever their requests have earned — nothing until
 * one is approved, then the organization it names — so the access-request flow
 * can be walked end to end: ask, get approved, find the record editable.
 */
const newcomerGrants = () =>
  readRequests().filter((r) => r.email === NEWCOMER.email && r.status === 'approved');

/** Who is signed in, by name: the newcomer, or the directory's reader. */
export const currentPerson = (): Person => {
  if (actingAs() === 'newcomer') {
    return { ...NEWCOMER, organizations: newcomerGrants().map((r) => r.organization) };
  }
  return { name: CURRENT_USER.name, email: CURRENT_USER.email, organizations: CURRENT_USER_ORGANIZATIONS };
};

export const currentActor = (): Actor => {
  try {
    const acting = actingAs();
    if (acting === 'newcomer') {
      const grants = newcomerGrants();
      // A new organization makes them its first manager (decision 8).
      const manager = grants.some((r) => r.kind === 'organization');
      const contributor = manager || grants.some((r) => (r.granted ?? r.asked) === 'Contributor');
      return { role: contributor ? 'Contributor' : 'Viewer', manager };
    }
    if (acting === 'admin' || acting === 'administrator') return { role: 'Administrator', manager: true };
    if (acting === 'manager' || acting === 'steward') return { role: 'Contributor', manager: true };
    if (acting === 'contributor') return { role: 'Contributor', manager: false };
    if (acting === 'viewer') return { role: 'Viewer', manager: false };
  } catch {
    // No window (build time) or blocked storage: fall through to the directory.
  }
  const me = users.find((u) => u.email === CURRENT_USER.email);
  return { role: (me?.role as Role | undefined) ?? 'Administrator', manager: (me?.managerOf.length ?? 0) > 0 };
};

/** Whether the reader may take an act under its current threshold. */
export const can = (act: string): boolean => {
  const { role, manager } = currentActor();
  if (role === 'Administrator') return true;
  if (role === 'Viewer') return false;
  const audience = readPermission(act);
  return audience === 'editors' || (audience === 'managers' && manager);
};
