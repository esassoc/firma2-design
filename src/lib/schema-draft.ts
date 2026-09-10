// Browser-local subcategory schemas — the tenant's option lists authored IN
// THIS BROWSER, layered beside (never over) the seeded ones.
//
// WHY THIS STORE EXISTS. The measure model's rule is that schemas are shared
// and referenced, never copied per measure — which only means something if a
// schema created while setting up one measure is OFFERED when setting up the
// next. A static build cannot mint tenant records, so the tenant-level store is
// localStorage: same trick, same honesty terms as measure drafts ("in this
// browser"; a colleague opening the site sees the seeds).
//
// ONE KEY FOR THE WHOLE SET, not a key per schema — unlike measure drafts,
// which key per slug. Schemas are a tenant-level LIST whose whole point is
// being read together (every picker shows all of them), so one array under one
// versioned key is the shape every read actually wants.
//
// LOCAL IDS ARE PREFIXED (`local-`), so a locally authored schema can never
// collide with a seed id shipped later. System schemas are never stored here —
// they are maintained with the sources they read, not authored.

import { SCHEMAS } from '../data/firma2-performance-measures';
import type { SubcategorySchema } from '../data/firma2-performance-measures';

const KEY_VERSION = 'v2';
const KEY = `firma2:subcategory-schemas:${KEY_VERSION}`;

/** Shape-check one stored entry; a malformed one is dropped, not thrown on. */
const isSchema = (v: unknown): v is SubcategorySchema => {
  if (typeof v !== 'object' || v === null) return false;
  const c = v as Partial<SubcategorySchema>;
  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    // Only authorable origins — a stored "system" schema is a forgery.
    (c.origin === 'user' || c.origin === 'imported') &&
    Array.isArray(c.options) &&
    c.options.every((o) => typeof o === 'string')
  );
};

/** The schemas authored in this browser. Empty everywhere else. */
export function readLocalSchemas(): SubcategorySchema[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isSchema) : [];
  } catch {
    // Blocked storage or corrupt JSON — the seeds still work, so this
    // degrades to "no local schemas" rather than failing anything.
    return [];
  }
}

/**
 * Add or replace one local schema. Returns false when the browser blocks
 * storage — the caller decides whether that is worth a toast (silent on
 * success, loud once on failure).
 */
export function writeLocalSchema(schema: SubcategorySchema): boolean {
  try {
    const rest = readLocalSchemas().filter((s) => s.id !== schema.id);
    window.localStorage.setItem(KEY, JSON.stringify([...rest, schema]));
    return true;
  } catch {
    return false;
  }
}

/** Remove one local schema. Seeds cannot be removed, so only `local-` ids. */
export function removeLocalSchema(id: string): void {
  try {
    const rest = readLocalSchemas().filter((s) => s.id !== id);
    window.localStorage.setItem(KEY, JSON.stringify(rest));
  } catch {
    // Nothing to do — a blocked store also had nothing to remove.
  }
}

/** Mint an id for a newly authored schema. Deterministic given existing ids. */
export function nextLocalSchemaId(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'schema';
  const taken = new Set([...SCHEMAS, ...readLocalSchemas()].map((s) => s.id));
  let id = `local-${slug}`;
  let n = 2;
  while (taken.has(id)) id = `local-${slug}-${n++}`;
  return id;
}

/**
 * Every schema a picker should offer: seeds first (stable order), then local
 * ones. A local schema carrying a SEED's id is that seed EDITED — it takes the
 * seed's place rather than appearing twice, which is what makes user schemas
 * editable in a static build. THE read path for anything client-side; server
 * renders use the seeds alone, which is correct — a build cannot know one
 * browser's schemas.
 */
export function allSchemas(): SubcategorySchema[] {
  const locals = readLocalSchemas();
  const byId = new Map(locals.map((s) => [s.id, s]));
  return [
    ...SCHEMAS.map((seed) => byId.get(seed.id) ?? seed),
    ...locals.filter((s) => !SCHEMAS.some((seed) => seed.id === s.id)),
  ];
}

/** Fired on `document` whenever a schema is written or removed. */
export const SCHEMA_CHANGE_EVENT = 'firma2:schema-change';

export const emitSchemaChange = (): void => {
  document.dispatchEvent(new Event(SCHEMA_CHANGE_EVENT));
};
