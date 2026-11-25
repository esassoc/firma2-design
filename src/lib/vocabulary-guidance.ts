// Guidance on closed lists — one line per entry saying when to pick it and how
// to fill in the rest — and how much of each list this workspace has used.
//
// WRITTEN ONCE, SHOWN WHEREVER THE ENTRY IS PICKED. The seed lives on the list
// itself (ProjectType.guidance, FieldDefinition.optionGuidance in
// src/data/firma2-project-types.ts); an administrator's rewrite is kept here,
// per list and entry, over the seed. Pickers never hold guidance of their own:
// they ask `guidanceFor(list, entry)` and show it as the control's helper text.
//
// THE LISTS stay closed. Nothing here adds an entry; "Used here" only narrows
// what a picker shows, and the full list is one click away.
//
// Same honesty terms as every other draft store in this prototype:
// localStorage, one browser, no backend; every access is wrapped.

import { FIELD_DEFINITIONS, PROJECT_TYPES, fieldValue, type ChooserStep } from '../data/firma2-project-types';
import { projects } from '../data/firma2-projects';
import { entries } from './taxonomy-edits';
import { allFields } from './project-type-draft';

/** A closed list: the project types, or one choice field's choices. */
export type ListId = 'projectType' | `field:${string}`;

const KEY = 'firma2:vocabulary-guidance:v1';
export const GUIDANCE_CHANGE_EVENT = 'firma2:guidance-change';

type Store = Record<string, Record<string, string>>;

const read = (): Store => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? (parsed as Store) : {};
  } catch {
    return {};
  }
};

const write = (store: Store): boolean => {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent(GUIDANCE_CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
};

export const isGuidanceKey = (key: string | null): boolean => key === KEY;

const fieldOf = (list: ListId) => {
  const id = list.slice('field:'.length);
  try {
    return allFields().find((f) => f.id === id);
  } catch {
    return FIELD_DEFINITIONS.find((f) => f.id === id);
  }
};

/**
 * The list's entries, as pickers show them: the names a reader picks, each
 * with the key its guidance is kept under. A project type is kept by slug, so
 * renaming it keeps its guidance; a choice is its own text.
 */
export const listEntries = (list: ListId): { name: string; key: string }[] => {
  if (list === 'projectType') {
    try {
      return entries('projectType').map((e) => ({ name: e.name, key: e.slug }));
    } catch {
      return PROJECT_TYPES.map((t) => ({ name: t.name, key: t.slug }));
    }
  }
  return (fieldOf(list)?.options ?? []).map((o) => ({ name: o, key: o }));
};

const seedGuidance = (list: ListId, key: string): string => {
  if (list === 'projectType') return PROJECT_TYPES.find((t) => t.slug === key)?.guidance ?? '';
  const id = list.slice('field:'.length);
  return FIELD_DEFINITIONS.find((f) => f.id === id)?.optionGuidance?.[key] ?? fieldOf(list)?.optionGuidance?.[key] ?? '';
};

/** The guidance kept for one entry, by its key. Blank stored text means "none", not "the seed". */
export const guidanceByKey = (list: ListId, key: string): string => {
  const stored = read()[list];
  if (stored && Object.prototype.hasOwnProperty.call(stored, key)) return stored[key];
  return seedGuidance(list, key);
};

/** The guidance for an entry by the name a picker holds. */
export const guidanceFor = (list: ListId, name: unknown): string => {
  if (typeof name !== 'string' || !name) return '';
  const entry = listEntries(list).find((e) => e.name === name);
  return entry ? guidanceByKey(list, entry.key) : '';
};

/** Every entry's guidance, keyed by the name pickers hold — for a row that switches entries. */
export const guidanceMap = (list: ListId): Record<string, string> =>
  Object.fromEntries(listEntries(list).map((e) => [e.name, guidanceByKey(list, e.key)]).filter(([, g]) => g));

export const setGuidance = (list: ListId, key: string, text: string): boolean => {
  const store = read();
  const next = text.trim();
  const lists = { ...(store[list] ?? {}) };
  if (next === seedGuidance(list, key)) delete lists[key];
  else lists[key] = next;
  return write({ ...store, [list]: lists });
};

/** Whether the entry's guidance is the administrator's rewrite rather than the seed. */
export const isRewritten = (list: ListId, key: string): boolean => {
  const stored = read()[list];
  return !!stored && Object.prototype.hasOwnProperty.call(stored, key);
};

// ---------------------------------------------------------------------------
// Used in this workspace
// ---------------------------------------------------------------------------

/**
 * How many of the workspace's projects hold each entry. Project types count
 * projects of that type; a choice field counts the answers of projects whose
 * type asks it. Entries no project holds are absent.
 */
export const usedCounts = (list: ListId): Map<string, number> => {
  const counts = new Map<string, number>();
  const bump = (name: string) => name && counts.set(name, (counts.get(name) ?? 0) + 1);
  if (list === 'projectType') {
    projects.forEach((p) => bump(p.projectType));
    return counts;
  }
  const field = fieldOf(list);
  if (!field) return counts;
  projects
    .filter((p) => PROJECT_TYPES.find((t) => t.name === p.projectType)?.fields.some((f) => f.fieldId === field.id))
    .forEach((p) => bump(fieldValue(p, field)));
  return counts;
};

/** A list long enough that a picker offers "Used here". */
export const LONG_LIST = 12;

/** The "Help me choose" path a list carries, if any. */
export const chooserFor = (list: ListId): ChooserStep | undefined => {
  if (list === 'projectType') return undefined;
  const id = list.slice('field:'.length);
  return fieldOf(list)?.chooser ?? FIELD_DEFINITIONS.find((f) => f.id === id)?.chooser;
};

/**
 * A path whose every end is still on the list. An administrator may have
 * removed a choice since the path was written; an answer that would end at
 * it is dropped, and a question left with no answers drops with it.
 */
export const livePath = (step: ChooserStep, names: string[]): ChooserStep | undefined => {
  const answers = step.answers.flatMap((a) => {
    if (a.pick) return names.includes(a.pick) ? [a] : [];
    const next = a.next && livePath(a.next, names);
    return next ? [{ ...a, next }] : [];
  });
  return answers.length ? { ...step, answers } : undefined;
};
