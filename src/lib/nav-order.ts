// The app rail's own rows in order — the product's rows (src/data/firma2-nav.ts),
// not the Pages group, which keeps its order in custom-pages.ts.
//
// TWO LAYERS. The workspace's order is the administrator's (Workspace settings
// › Menu order): it is where everyone starts. Each person can then rearrange
// their own menu in the rail; that order is theirs alone and wins over the
// workspace's until they reset it. Neither touches the other: an administrator
// changing the default does not undo anyone's own order.
//
// FOUR SECTIONS, and a row moves only where it means the same thing. The
// unheaded rows at the top and the Workspace rows are both "the workspace's
// destinations", so a row passes freely between them and into or out of More.
// The reader's organizations are their memberships, not destinations, so those
// rows reorder among themselves and nowhere else — and only in a person's own
// order, since every person's list is different. More itself can move but never
// into itself.
//
// Both kept in this viewer's localStorage, the same stand-in for a POST as
// custom-pages.ts, with every access wrapped so the rail still renders when
// storage is missing or throws. What is stored is keys only: labels, hrefs and
// the tenant's renamed nouns stay the nav model's. A key the model no longer has
// is dropped; a row a stored order never saw joins the section it has one layer
// down, at the end, so a new product row is never lost behind an old arrangement.

import { navItems, organizationNavItems } from '../data/firma2-nav';

export type NavSection = 'top' | 'workspace' | 'more' | 'orgs';
export type NavLayout = Record<NavSection, string[]>;

const KEY = 'firma2:nav-order:v1';
const WORKSPACE_KEY = 'firma2:nav-order-workspace:v1';
export const MORE_KEY = 'more';
export const WORKSPACE_GROUP = 'Workspace';

/** The sections a row of this section may move to, in the rail's order. */
export const sectionsFor = (section: NavSection, key: string): NavSection[] => {
  if (section === 'orgs') return ['orgs'];
  return key === MORE_KEY ? ['top', 'workspace'] : ['top', 'workspace', 'more'];
};

/** The product's own order: the nav model as written. */
export const standardLayout = (): NavLayout => ({
  top: navItems.filter((i) => !i.group).map((i) => i.key),
  workspace: navItems.filter((i) => i.group === WORKSPACE_GROUP).map((i) => i.key),
  more: navItems.find((i) => i.key === MORE_KEY)?.children?.map((c) => c.key) ?? [],
  orgs: organizationNavItems.map((i) => i.key),
});

const SECTIONS: NavSection[] = ['top', 'workspace', 'more', 'orgs'];

const readStored = (key: string): Partial<NavLayout> | null => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '') ?? null;
  } catch {
    return null;
  }
};
const writeStored = (key: string, layout: NavLayout): void => {
  try {
    localStorage.setItem(key, JSON.stringify(layout));
  } catch {
    /* storage unavailable — the order is forgotten, the rail still works */
  }
};
const removeStored = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* nothing stored to remove */
  }
};

/** A stored order laid over `base`, reconciled against the nav model as it is today. */
const reconcile = (stored: Partial<NavLayout> | null, base: NavLayout): NavLayout => {
  if (!stored) return base;
  const homeOf = new Map<string, NavSection>();
  for (const s of SECTIONS) for (const k of base[s]) homeOf.set(k, s);
  const seen = new Set<string>();
  const layout: NavLayout = { top: [], workspace: [], more: [], orgs: [] };
  for (const s of SECTIONS) {
    for (const k of stored[s] ?? []) {
      const home = homeOf.get(k);
      // Unknown, repeated, or somewhere it may not go: the layer below wins.
      if (!home || seen.has(k) || !sectionsFor(home, k).includes(s)) continue;
      seen.add(k);
      layout[s].push(k);
    }
  }
  for (const s of SECTIONS) for (const k of base[s]) if (!seen.has(k)) layout[s].push(k);
  return layout;
};

const same = (a: NavLayout, b: NavLayout): boolean => SECTIONS.every((s) => a[s].join() === b[s].join());

// ---- the workspace's order: the administrator's default ----

export const readWorkspaceLayout = (): NavLayout => {
  const layout = reconcile(readStored(WORKSPACE_KEY), standardLayout());
  // The organizations are each person's own; the workspace never orders them.
  return { ...layout, orgs: standardLayout().orgs };
};
export const writeWorkspaceLayout = (layout: NavLayout): void => writeStored(WORKSPACE_KEY, layout);
export const resetWorkspaceLayout = (): void => removeStored(WORKSPACE_KEY);
export const isStandardWorkspace = (): boolean => same(readWorkspaceLayout(), standardLayout());

// ---- a person's own order ----

/** The order this person sees: their own, over the workspace's. */
export const readLayout = (): NavLayout => reconcile(readStored(KEY), readWorkspaceLayout());
export const writeLayout = (layout: NavLayout): void => writeStored(KEY, layout);
/** Back to the workspace's order. */
export const resetLayout = (): void => removeStored(KEY);
export const isCustomLayout = (): boolean => !same(readLayout(), readWorkspaceLayout());

export const sectionOf = (layout: NavLayout, key: string): NavSection | undefined =>
  SECTIONS.find((s) => layout[s].includes(key));

/** Moves `key` into `section`, before `beforeKey` (null: at the end). Returns the new layout. */
export const moveKey = (layout: NavLayout, key: string, section: NavSection, beforeKey: string | null): NavLayout => {
  const next: NavLayout = { top: [], workspace: [], more: [], orgs: [] };
  for (const s of SECTIONS) next[s] = layout[s].filter((k) => k !== key);
  const list = next[section];
  const at = beforeKey ? list.indexOf(beforeKey) : -1;
  list.splice(at < 0 ? list.length : at, 0, key);
  return next;
};
