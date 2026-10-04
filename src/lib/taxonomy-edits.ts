// Browser-local edits to the three ways a project is filed — project types,
// classifications and tags — and to the groups classifications sort into: what was added, renamed, re-described or removed,
// and, for classifications, which KPIs track them and their goal targets.
// Same honesty terms as every other draft store in this prototype
// (src/lib/measure-draft.ts): localStorage, one browser, no backend.
//
// PATCHES OVER SEEDS, NOT COPIES. A seeded entry is never stored whole — only
// what this browser changed about it — so a seed fixed in code still reaches
// a browser that renamed something else. Entries added here are stored whole,
// with a `local-` slug so they can always be told from a seed.
//
// ONE MODULE FOR THE THREE because they are one shape (a name, a description,
// and for two of them a colour) and the settings screens that edit them are
// built from the same parts. Everything particular to a kind — fields and
// page sections for a type (src/lib/project-type-draft.ts), KPIs and targets
// for a classification (below) — keys off the same slug.
//
// CLASSIFICATION GROUPS ARE A FOURTH KIND, not a side table: a group is the
// same shape (a name and a line of description), is added, renamed and
// removed on the same screens, and a classification's `group` is a group
// slug. What only groups need is ORDER — the order groups appear in, and the
// order of the classifications within each — kept per list (see `order`).
//
// TAG GROUPS ARE A FIFTH KIND on the same terms: a tag's `group` is a tag
// group slug — or empty, for a tag in no group — groups and the tags within
// each are ordered per list, and both carry a colour an administrator can
// change in place. A new tag or group is dealt a colour at random.
//
// Every access is wrapped: storage can be missing or throw (private windows,
// blocked site data), and the page must still work — it just forgets.

import { PROJECT_TYPES } from '../data/firma2-project-types';
import { CLASSIFICATIONS, CLASSIFICATION_GROUPS } from '../data/firma2-classifications';
import type { GoalTarget } from '../data/firma2-classifications';
import { TAGS, TAG_GROUPS, randomTagColor } from '../data/firma2-tags';

export type TaxonomyKind = 'projectType' | 'classification' | 'tag' | 'classificationGroup' | 'tagGroup';

export interface TaxonomyEntry {
  slug: string;
  name: string;
  description: string;
  /** Project types, classifications, tags and tag groups: the swatch. */
  color?: string;
  /** Classifications: the CLASSIFICATION_GROUPS slug. Tags: the TAG_GROUPS slug. */
  group?: string;
}

interface KindEdits {
  added: TaxonomyEntry[];
  edited: Record<string, Partial<Pick<TaxonomyEntry, 'name' | 'description' | 'group' | 'color'>>>;
  removed: string[];
}

interface KpiEdits {
  /** Catalog measure slugs linked here, beyond the measure's own list. */
  added: string[];
  /** Catalog measure slugs unlinked here. */
  removed: string[];
}

interface Store {
  kinds: Record<TaxonomyKind, KindEdits>;
  /** Per classification slug. */
  kpis: Record<string, KpiEdits>;
  /** Per classification slug: the whole target list, once edited. */
  targets: Record<string, GoalTarget[]>;
  /**
   * Stored orders, by list key (see `listKey`): the slugs in the order a
   * reader arranged them. Slugs not listed keep their seeded order after the
   * listed ones, so a classification added or moved in joins its group last.
   */
  order: Record<string, string[]>;
}

const KEY = 'firma2:taxonomy-edits:v1';
const JUST_ADDED_KEY = 'firma2:taxonomy-just-added:v1';
const empty = (): KindEdits => ({ added: [], edited: {}, removed: [] });

const read = (): Store => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as Partial<Store>;
      return {
        kinds: { projectType: empty(), classification: empty(), tag: empty(), classificationGroup: empty(), tagGroup: empty(), ...(s.kinds ?? {}) },
        kpis: s.kpis ?? {},
        targets: s.targets ?? {},
        order: s.order ?? {},
      };
    }
  } catch {
    // Blocked or corrupt storage reads as no edits.
  }
  return {
    kinds: { projectType: empty(), classification: empty(), tag: empty(), classificationGroup: empty(), tagGroup: empty() },
    kpis: {},
    targets: {},
    order: {},
  };
};

const write = (store: Store): boolean => {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
};

const seeds = (kind: TaxonomyKind): TaxonomyEntry[] =>
  kind === 'projectType'
    ? PROJECT_TYPES.map((t) => ({ slug: t.slug, name: t.name, description: t.description, color: t.color }))
    : kind === 'classification'
      ? CLASSIFICATIONS.map((c) => ({ slug: c.slug, name: c.name, description: c.description, color: c.color, group: c.group }))
      : kind === 'classificationGroup'
        ? CLASSIFICATION_GROUPS.map((g) => ({ slug: g.slug, name: g.name, description: g.description }))
        : kind === 'tagGroup'
          ? TAG_GROUPS.map((g) => ({ slug: g.slug, name: g.name, description: g.description, color: g.color }))
          : TAGS.map((t) => ({ slug: t.slug, name: t.name, description: t.description, group: t.group, color: t.color }));

export const isLocal = (slug: string): boolean => slug.startsWith('local-');

/**
 * The list an entry is ordered within: groups are one list; classifications
 * and tags are one list PER GROUP. Project types are not reorderable.
 */
export const listKey = (kind: TaxonomyKind, e?: Pick<TaxonomyEntry, 'group'>): string | null =>
  kind === 'classificationGroup' || kind === 'tagGroup'
    ? kind
    : kind === 'classification' || kind === 'tag'
      ? `${kind}:${e?.group ?? ''}`
      : null;

/**
 * Every entry of a kind as this browser sees it: seeds as edited, then this
 * browser's own — in each list's stored order where a reader set one.
 */
export const entries = (kind: TaxonomyKind): TaxonomyEntry[] => {
  const store = read();
  const k = store.kinds[kind];
  const list = [...seeds(kind), ...k.added]
    .filter((e) => !k.removed.includes(e.slug))
    .map((e) => ({ ...e, ...(k.edited[e.slug] ?? {}) }));
  // Tags read group by group, in the groups' own order, so every picker
  // offers them as the settings page arranges them.
  const groupRank = new Map<string, number>(kind === 'tag' ? entries('tagGroup').map((g, i) => [g.slug, i]) : []);
  const rank = (e: TaxonomyEntry, i: number): number => {
    const key = listKey(kind, e);
    const at = key ? (store.order[key] ?? []).indexOf(e.slug) : -1;
    // Listed slugs first, in their stored order; the rest after, as they came.
    const within = at >= 0 ? at : 1e6 + i;
    // Tags in no group come first, as the settings page lists them.
    return kind === 'tag' ? (groupRank.get(e.group ?? '') ?? -1) * 1e7 + within : within;
  };
  return list.map((e, i) => ({ e, r: rank(e, i) })).sort((a, b) => a.r - b.r).map((x) => x.e);
};

/** Store the order of one list — the slugs of a group's classifications, or of the groups. */
export const setOrder = (key: string, slugs: string[]): boolean => {
  const store = read();
  store.order[key] = slugs;
  return write(store);
};

export const getEntry = (kind: TaxonomyKind, slug: string): TaxonomyEntry | undefined =>
  entries(kind).find((e) => e.slug === slug);

/** Was this seeded entry removed in this browser? */
export const isRemoved = (kind: TaxonomyKind, slug: string): boolean => read().kinds[kind].removed.includes(slug);

/** Names compare without case or surrounding space: "Tribal Partnership" is taken. */
export const nameTaken = (kind: TaxonomyKind, name: string, exceptSlug?: string): boolean => {
  const n = name.trim().toLowerCase();
  return entries(kind).some((e) => e.slug !== exceptSlug && e.name.trim().toLowerCase() === n);
};

// New swatches: categorical steps no seed uses, in turn.
const NEW_COLORS = ['#8a5a2b', '#3b7d8c', '#7a4fa0', '#9a7b1c', '#4a6b3d', '#b04a5a'];

export const addEntry = (
  kind: TaxonomyKind,
  input: { name: string; description: string; group?: string; color?: string },
): TaxonomyEntry => {
  const store = read();
  const base = input.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
  const taken = new Set([...seeds(kind), ...store.kinds[kind].added].map((e) => e.slug));
  let slug = `local-${base}`;
  for (let n = 2; taken.has(slug); n++) slug = `local-${base}-${n}`;
  const entry: TaxonomyEntry = {
    slug,
    name: input.name.trim(),
    description: input.description.trim(),
    ...(kind === 'projectType' || kind === 'classification'
      ? { color: NEW_COLORS[store.kinds[kind].added.length % NEW_COLORS.length] }
      : {}),
    ...(kind === 'classification' ? { group: input.group || entries('classificationGroup')[0]?.slug || 'plan-goal' } : {}),
    ...(kind === 'tag' || kind === 'tagGroup' ? tagLook(kind, input) : {}),
  };
  store.kinds[kind].added.push(entry);
  write(store);
  return entry;
};

/**
 * A new tag joins the group it was added in, or none; a new tag or group
 * wears a colour dealt at random until given its own.
 */
const tagLook = (kind: TaxonomyKind, input: { group?: string; color?: string }): Partial<TaxonomyEntry> => {
  const color = input.color || randomTagColor();
  if (kind === 'tagGroup') return { color };
  return { group: entries('tagGroup').some((g) => g.slug === input.group) ? input.group : '', color };
};

export const editEntry = (
  kind: TaxonomyKind,
  slug: string,
  patch: Partial<Pick<TaxonomyEntry, 'name' | 'description' | 'group' | 'color'>>,
): boolean => {
  const store = read();
  const k = store.kinds[kind];
  const local = k.added.find((e) => e.slug === slug);
  if (local) Object.assign(local, patch);
  else k.edited[slug] = { ...(k.edited[slug] ?? {}), ...patch };
  return write(store);
};

/** Remove an entry: a local one is forgotten, a seed is marked removed. */
export const removeEntry = (kind: TaxonomyKind, slug: string): boolean => {
  const store = read();
  const k = store.kinds[kind];
  if (isLocal(slug)) k.added = k.added.filter((e) => e.slug !== slug);
  else k.removed = [...new Set([...k.removed, slug])];
  delete k.edited[slug];
  if (kind === 'classification') {
    delete store.kpis[slug];
    delete store.targets[slug];
  }
  if (kind === 'classificationGroup' || kind === 'tagGroup') {
    const member = kind === 'tagGroup' ? 'tag' : 'classification';
    delete store.order[`${member}:${slug}`];
    if (store.order[kind]) store.order[kind] = store.order[kind].filter((s) => s !== slug);
  }
  return write(store);
};

// ---------------------------------------------------------------------------
// Classification groups
// ---------------------------------------------------------------------------

/** A group's classifications, in their stored order. */
export const classificationsIn = (groupSlug: string): TaxonomyEntry[] =>
  entries('classification').filter((e) => e.group === groupSlug);

/**
 * Why a group cannot be removed, or null when it can. A classification must
 * sort into some group, so a group that still holds any — or the last group
 * left — stays until its classifications are moved.
 */
export const groupRemovalBlock = (groupSlug: string): string | null => {
  const held = classificationsIn(groupSlug).length;
  if (held > 0) {
    return `${held} ${held === 1 ? 'classification is' : 'classifications are'} in this group. Move ${held === 1 ? 'it' : 'them'} to another group first.`;
  }
  if (entries('classificationGroup').length <= 1) return 'Every classification needs a group, so the last one stays.';
  return null;
};

// ---------------------------------------------------------------------------
// Tag groups
// ---------------------------------------------------------------------------

/**
 * A group's tags, in their stored order. The empty slug is the tags in no
 * group — including any whose group is gone.
 */
export const tagsIn = (groupSlug: string): TaxonomyEntry[] => {
  if (groupSlug) return entries('tag').filter((e) => e.group === groupSlug);
  const groups = new Set(entries('tagGroup').map((g) => g.slug));
  return entries('tag').filter((e) => !groups.has(e.group ?? ''));
};

/**
 * Store a whole arrangement at once: the groups' order, and each group's tags
 * in order — the empty slug for tags in no group. A tag found under another
 * group has moved there.
 */
export const arrangeTags = (groups: { slug: string; tags: string[] }[]): boolean => {
  const store = read();
  const k = store.kinds.tag;
  const current = new Map(entries('tag').map((e) => [e.slug, e.group]));
  store.order.tagGroup = groups.map((g) => g.slug).filter(Boolean);
  for (const g of groups) {
    store.order[`tag:${g.slug}`] = g.tags;
    for (const slug of g.tags) {
      if (current.get(slug) === g.slug) continue;
      const local = k.added.find((e) => e.slug === slug);
      if (local) local.group = g.slug;
      else k.edited[slug] = { ...(k.edited[slug] ?? {}), group: g.slug };
    }
  }
  return write(store);
};

// ---------------------------------------------------------------------------
// Classifications: KPIs and goal targets
// ---------------------------------------------------------------------------

/** The measures tracking a classification: the catalog's own links, as edited here. */
export const kpiSlugs = (classificationSlug: string, seeded: string[]): string[] => {
  const e = read().kpis[classificationSlug];
  if (!e) return seeded;
  return [...seeded.filter((s) => !e.removed.includes(s)), ...e.added.filter((s) => !seeded.includes(s))];
};

export const linkKpi = (classificationSlug: string, measureSlug: string): boolean => {
  const store = read();
  const e = store.kpis[classificationSlug] ?? { added: [], removed: [] };
  e.removed = e.removed.filter((s) => s !== measureSlug);
  if (!e.added.includes(measureSlug)) e.added.push(measureSlug);
  store.kpis[classificationSlug] = e;
  return write(store);
};

export const unlinkKpi = (classificationSlug: string, measureSlug: string): boolean => {
  const store = read();
  const e = store.kpis[classificationSlug] ?? { added: [], removed: [] };
  e.added = e.added.filter((s) => s !== measureSlug);
  if (!e.removed.includes(measureSlug)) e.removed.push(measureSlug);
  store.kpis[classificationSlug] = e;
  // A target on a KPI that no longer tracks the goal is a target nobody can
  // report toward — it goes with the link.
  if (store.targets[classificationSlug]) {
    store.targets[classificationSlug] = store.targets[classificationSlug].filter((t) => t.measure !== measureSlug);
  }
  return write(store);
};

/** Goal targets as this browser sees them. */
export const targetsFor = (classificationSlug: string, seeded: GoalTarget[] = []): GoalTarget[] =>
  read().targets[classificationSlug] ?? seeded;

/** Set (or, with `null`, clear) one KPI's target. */
export const setTarget = (
  classificationSlug: string,
  seeded: GoalTarget[],
  measure: string,
  target: { value: number; year: number } | null,
): boolean => {
  const store = read();
  const rest = targetsFor(classificationSlug, seeded).filter((t) => t.measure !== measure);
  store.targets[classificationSlug] = target ? [...rest, { measure, ...target }] : rest;
  return write(store);
};

// ---------------------------------------------------------------------------
// Arrival notes
// ---------------------------------------------------------------------------

/** One-shot note so the page an add lands on can confirm it once. */
export const noteJustAdded = (name: string): void => {
  try {
    sessionStorage.setItem(JUST_ADDED_KEY, name);
  } catch {
    /* forgotten — the add still happened */
  }
};

export const takeJustAdded = (): string | null => {
  try {
    const v = sessionStorage.getItem(JUST_ADDED_KEY);
    sessionStorage.removeItem(JUST_ADDED_KEY);
    return v;
  } catch {
    return null;
  }
};
