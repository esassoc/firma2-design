// Browser-local edits to project types and the tenant's field definitions —
// same honesty terms as every other draft store in this prototype
// (src/lib/measure-draft.ts): localStorage, one browser, no backend.
//
// WHOLE TYPES, NOT PATCHES. A type's editable state is two short lists, and a
// stored copy that drifted from a changed seed would be visible at once in
// the studio — the case measure drafts guard against with patches does not
// pay for its complexity here. The versioned key is the escape hatch.
//
// THE STORAGE EVENT IS THE PREVIEW'S WIRE. The studio previews the real
// public page in an iframe; a write here fires `storage` in that frame (a
// different document on the same origin), which re-resolves the page. One
// renderer, two windows, nothing to keep in sync by hand.

import { FIELD_DEFINITIONS, getProjectType } from '../data/firma2-project-types';
import type { FieldDefinition, ProjectType } from '../data/firma2-project-types';

const KEY_VERSION = 'v1';
const TYPE_PREFIX = `firma2:project-type:${KEY_VERSION}:`;
const FIELDS_KEY = `firma2:custom-fields:${KEY_VERSION}`;

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

const readJson = <T>(key: string): T | null => {
  try {
    const raw = storage()?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeJson = (key: string, value: unknown): boolean => {
  try {
    storage()?.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/** Is this key one the preview should react to? */
export const isProjectTypeKey = (key: string | null): boolean =>
  !!key && (key.startsWith(TYPE_PREFIX) || key === FIELDS_KEY);

/** The type as this browser sees it: the stored copy, else the seed. */
export const withTypeDraft = (slug: string): ProjectType | undefined => {
  const seed = getProjectType(slug);
  if (!seed) return undefined;
  const stored = readJson<Pick<ProjectType, 'fields' | 'sections'>>(TYPE_PREFIX + slug);
  return stored && Array.isArray(stored.fields) ? { ...seed, fields: stored.fields, sections: stored.sections ?? {} } : seed;
};

export const persistType = (type: ProjectType): boolean =>
  writeJson(TYPE_PREFIX + type.slug, { fields: type.fields, sections: type.sections });

export const resetType = (slug: string): void => {
  storage()?.removeItem(TYPE_PREFIX + slug);
};

/** Fields defined in this browser, appended after the seeds. */
export const readLocalFields = (): FieldDefinition[] => {
  const stored = readJson<FieldDefinition[]>(FIELDS_KEY);
  return Array.isArray(stored) ? stored.filter((f) => typeof f?.id === 'string' && typeof f?.label === 'string') : [];
};

export const allFields = (): FieldDefinition[] => [...FIELD_DEFINITIONS, ...readLocalFields()];

export const getField = (id: string): FieldDefinition | undefined => allFields().find((f) => f.id === id);

export const writeLocalField = (field: FieldDefinition): boolean =>
  writeJson(FIELDS_KEY, [...readLocalFields().filter((f) => f.id !== field.id), field]);

export const nextLocalFieldId = (label: string): string => {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'field';
  const taken = new Set(allFields().map((f) => f.id));
  let id = `local-${slug}`;
  let n = 2;
  while (taken.has(id)) id = `local-${slug}-${n++}`;
  return id;
};
