// Browser-local edits to project types and the tenant's field definitions —
// same honesty terms as every other draft store in this prototype
// (src/lib/measure-draft.ts): localStorage, one browser, no backend.
//
// WHOLE RECORDS, NOT PATCHES. A project type's editable state is two short
// lists, and a stored copy that drifted from a changed seed would be visible
// at once in the studio — the case measure drafts guard against with patches
// does not pay for its complexity here. The versioned key is the escape hatch.
//
// THE STORAGE EVENT IS THE PREVIEW'S WIRE. The studio previews the real
// public page in an iframe; a write here fires `storage` in that frame (a
// different document on the same origin), which re-resolves the page. One
// renderer, two windows, nothing to keep in sync by hand.

import { FIELD_DEFINITIONS, getProjectType } from '../data/firma2-project-types';
import { getEntry } from './taxonomy-edits';
import type { ProjectType, FieldDefinition } from '../data/firma2-project-types';

const KEY_VERSION = 'v1';
// Work-type slugs carried over as project-type slugs unchanged, so edits
// made while they were classifications carry over.
const TYPE_PREFIX = `firma2:project-type:${KEY_VERSION}:`;
const FIELDS_KEY = `firma2:custom-fields:${KEY_VERSION}`;
// Edits to the SEEDED definitions, and the seeds deleted — kept apart from the
// browser-defined fields so a seed can always be told from a local one.
const OVERRIDES_KEY = `firma2:custom-field-overrides:${KEY_VERSION}`;

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
  !!key && (key.startsWith(TYPE_PREFIX) || key === FIELDS_KEY || key === OVERRIDES_KEY || key === 'firma2:taxonomy-edits:v1');

/**
 * The project type as this browser sees it: the seed (or, for a type added
 * here, its entry in src/lib/taxonomy-edits.ts) with this browser's name,
 * description, fields and sections over it.
 */
export const withProjectTypeDraft = (slug: string): ProjectType | undefined => {
  const entry = getEntry('projectType', slug);
  if (!entry) return undefined;
  const base = getProjectType(slug);
  const seed: ProjectType = {
    ...(base ?? { slug, fields: [], sections: {} }),
    name: entry.name as ProjectType['name'],
    description: entry.description,
    color: entry.color ?? base?.color ?? '#666666',
  } as ProjectType;
  const stored = readJson<Pick<ProjectType, 'fields' | 'sections'>>(TYPE_PREFIX + slug);
  return stored && Array.isArray(stored.fields) ? { ...seed, fields: stored.fields, sections: stored.sections ?? {} } : seed;
};

export const persistProjectType = (t: ProjectType): boolean =>
  writeJson(TYPE_PREFIX + t.slug, { fields: t.fields, sections: t.sections });

export const resetProjectType = (slug: string): void => {
  storage()?.removeItem(TYPE_PREFIX + slug);
};

/** Fields defined in this browser, appended after the seeds. */
export const readLocalFields = (): FieldDefinition[] => {
  const stored = readJson<FieldDefinition[]>(FIELDS_KEY);
  return Array.isArray(stored) ? stored.filter((f) => typeof f?.id === 'string' && typeof f?.label === 'string') : [];
};

interface Overrides {
  edits: Record<string, FieldDefinition>;
  deleted: string[];
}

const readOverrides = (): Overrides => {
  const stored = readJson<Overrides>(OVERRIDES_KEY);
  return { edits: stored?.edits ?? {}, deleted: Array.isArray(stored?.deleted) ? stored!.deleted : [] };
};

/** Every field the workspace defines: the seeds as edited, then this browser's own. */
export const allFields = (): FieldDefinition[] => {
  const { edits, deleted } = readOverrides();
  return [...FIELD_DEFINITIONS.map((f) => edits[f.id] ?? f), ...readLocalFields()].filter((f) => !deleted.includes(f.id));
};

/** Save an edit to any field, seeded or local. */
export const updateField = (field: FieldDefinition): boolean => {
  if (!FIELD_DEFINITIONS.some((f) => f.id === field.id)) return writeLocalField(field);
  const overrides = readOverrides();
  return writeJson(OVERRIDES_KEY, { ...overrides, edits: { ...overrides.edits, [field.id]: field } });
};

/** Delete a field. Callers check it is on no project type first. */
export const deleteField = (id: string): boolean => {
  if (!FIELD_DEFINITIONS.some((f) => f.id === id)) return writeJson(FIELDS_KEY, readLocalFields().filter((f) => f.id !== id));
  const overrides = readOverrides();
  return writeJson(OVERRIDES_KEY, { ...overrides, deleted: [...new Set([...overrides.deleted, id])] });
};

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
