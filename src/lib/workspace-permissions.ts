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

import { CURRENT_USER, users } from '../data/firma2-directory';
import { SECURITY_PERMISSIONS } from '../data/firma2-workspace-settings';

export type Audience = 'admins' | 'stewards' | 'editors';
export type Role = 'Administrator' | 'Contributor' | 'Viewer';

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
    return parsed && typeof parsed === 'object' ? parsed : {};
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
  /** Stewards at least one organization — the middle threshold. */
  steward: boolean;
}

/**
 * Who is asking: the directory's signed-in reader, unless the prototype's
 * `?as=` switch says otherwise — admin, steward (a Contributor who stewards
 * an organization), contributor or viewer. The switch sticks for the
 * session's browser until another `?as=` replaces it.
 */
export const currentActor = (): Actor => {
  try {
    const as = new URLSearchParams(window.location.search).get('as');
    if (as) storage()?.setItem(AS_KEY, as);
    const acting = (as ?? storage()?.getItem(AS_KEY) ?? '').toLowerCase();
    if (acting === 'admin' || acting === 'administrator') return { role: 'Administrator', steward: true };
    if (acting === 'steward') return { role: 'Contributor', steward: true };
    if (acting === 'contributor') return { role: 'Contributor', steward: false };
    if (acting === 'viewer') return { role: 'Viewer', steward: false };
  } catch {
    // No window (build time) or blocked storage: fall through to the directory.
  }
  const me = users.find((u) => u.email === CURRENT_USER.email);
  return { role: (me?.role as Role | undefined) ?? 'Administrator', steward: (me?.stewardOf.length ?? 0) > 0 };
};

/** Whether the reader may take an act under its current threshold. */
export const can = (act: string): boolean => {
  const { role, steward } = currentActor();
  if (role === 'Administrator') return true;
  if (role === 'Viewer') return false;
  const audience = readPermission(act);
  return audience === 'editors' || (audience === 'stewards' && steward);
};
