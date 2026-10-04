// Which tags each project carries, as this browser sees it — the assignment
// half of tags. The list of tags itself (added, renamed, removed) lives in
// src/lib/taxonomy-edits.ts; this records who has which, from either side:
// a project's Tags row, or a tag's Projects section in Workspace settings.
// Same honesty terms as every other draft store: localStorage, one browser.
//
// STORED BY TAG SLUG, NOT NAME, so a rename in settings carries through to
// every project that has the tag, and a removed tag simply stops resolving —
// it drops off every project without a second write.
//
// A project nobody has edited reads its seeded tags (src/data/firma2-projects.ts).

import { projects, projectSlug } from '../data/firma2-projects';
import { TAGS } from '../data/firma2-tags';
import { entries } from './taxonomy-edits';
import type { TaxonomyEntry } from './taxonomy-edits';

const KEY = 'firma2:project-tags:v1';

const read = (): Record<string, string[]> => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
};

const write = (store: Record<string, string[]>): boolean => {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
};

const seededSlugs = (slug: string): string[] => {
  const project = projects.find((p) => projectSlug(p) === slug);
  return (project?.tags ?? []).map((name) => TAGS.find((t) => t.name === name)?.slug).filter((s): s is string => !!s);
};

/** The tags list as this browser sees it, in its order. */
export const currentTags = (): TaxonomyEntry[] => entries('tag');

/** A project's tags, as entries, in the tags list's order. */
export const tagsOfProject = (slug: string): TaxonomyEntry[] => {
  const held = new Set(read()[slug] ?? seededSlugs(slug));
  return currentTags().filter((t) => held.has(t.slug));
};

export const setProjectTags = (slug: string, tagSlugs: string[]): boolean => {
  const store = read();
  store[slug] = [...new Set(tagSlugs)];
  return write(store);
};

/** Every project slug carrying a tag. */
export const projectsWithTag = (tagSlug: string): string[] =>
  projects.map(projectSlug).filter((slug) => tagsOfProject(slug).some((t) => t.slug === tagSlug));

/** Give or take one tag on one project. */
export const toggleProjectTag = (projectSlugValue: string, tagSlug: string, on: boolean): boolean => {
  const held = tagsOfProject(projectSlugValue).map((t) => t.slug).filter((s) => s !== tagSlug);
  return setProjectTags(projectSlugValue, on ? [...held, tagSlug] : held);
};

/** Names → slugs, for a control that speaks names (the Tags row's combobox). */
export const tagSlugsFromNames = (names: string[]): string[] =>
  names.map((n) => currentTags().find((t) => t.name === n)?.slug).filter((s): s is string => !!s);
