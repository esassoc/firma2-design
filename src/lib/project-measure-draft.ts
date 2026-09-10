// Browser-local "measures added to a project" — the project side of the
// measure catalog, persisted the same way and on the same honesty terms as
// measure drafts (src/lib/measure-draft.ts): localStorage, ONE browser, and
// the UI never pretends a backend saved anything.
//
// WHAT IS STORED: a reference and a commitment — the catalog measure's slug
// and the target this project signed up to deliver. NOT the name or unit:
// those belong to the measure and are resolved at read time through
// withDraft(), so a measure renamed in the catalog is renamed on every
// project that carries it. Same reference-not-copy rule as subcategory
// schemas, same reason.
//
// ONE KEY PER PROJECT, versioned. The seed measures a project ships with are
// built data (firma2-project-detail's buildMeasures) and are not stored here;
// this list holds only what was added in this browser, appended after them.

export interface ProjectMeasureDraft {
  /** The catalog measure's slug — resolve with withDraft() at read time. */
  measureSlug: string;
  /** The target the project committed to, in the measure's own unit. */
  target: number;
}

const KEY_VERSION = 'v1';
const keyFor = (projectSlug: string): string =>
  `firma2:project-measures:${KEY_VERSION}:${projectSlug}`;

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    // Safari in private mode throws on access rather than returning null.
    return null;
  }
};

const isEntry = (v: unknown): v is ProjectMeasureDraft => {
  if (typeof v !== 'object' || v === null) return false;
  const c = v as Partial<ProjectMeasureDraft>;
  return typeof c.measureSlug === 'string' && typeof c.target === 'number' && Number.isFinite(c.target);
};

/** The measures added to this project in this browser, in the order added. */
export const readProjectMeasures = (projectSlug: string): ProjectMeasureDraft[] => {
  const store = storage();
  if (!store) return [];
  try {
    const parsed = JSON.parse(store.getItem(keyFor(projectSlug)) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch {
    return [];
  }
};

/** Append one measure. Replaces an existing entry for the same measure. */
export const addProjectMeasure = (projectSlug: string, entry: ProjectMeasureDraft): boolean => {
  const store = storage();
  if (!store) return false;
  try {
    const rest = readProjectMeasures(projectSlug).filter((e) => e.measureSlug !== entry.measureSlug);
    store.setItem(keyFor(projectSlug), JSON.stringify([...rest, entry]));
    return true;
  } catch {
    return false;
  }
};

export const removeProjectMeasure = (projectSlug: string, measureSlug: string): void => {
  const store = storage();
  if (!store) return;
  try {
    const rest = readProjectMeasures(projectSlug).filter((e) => e.measureSlug !== measureSlug);
    store.setItem(keyFor(projectSlug), JSON.stringify(rest));
  } catch {
    // A blocked store also had nothing to remove.
  }
};

// ---------------------------------------------------------------------------
// TARGET OVERRIDES — the goal, edited after the fact. Rows ADDED in this
// browser keep their target on their own record (addProjectMeasure replaces
// it); a project's SEED measures ship their target as built data, so an edit
// to one lives here, keyed the same way entries key measures (catalog slug,
// or `name:<display name>` for a seed row).
// ---------------------------------------------------------------------------

const targetsKeyFor = (projectSlug: string): string =>
  `firma2:project-targets:${KEY_VERSION}:${projectSlug}`;

/** The goals edited in this browser, by measure key. */
export const readTargetOverrides = (projectSlug: string): Record<string, number> => {
  const store = storage();
  if (!store) return {};
  try {
    const parsed = JSON.parse(store.getItem(targetsKeyFor(projectSlug)) ?? '{}');
    if (typeof parsed !== 'object' || parsed === null) return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
};

/** Set one goal; null removes the override (edited back to the built value). */
export const setTargetOverride = (
  projectSlug: string,
  measureKey: string,
  target: number | null,
): void => {
  const store = storage();
  if (!store) return;
  try {
    const all = readTargetOverrides(projectSlug);
    if (target === null) delete all[measureKey];
    else all[measureKey] = target;
    store.setItem(targetsKeyFor(projectSlug), JSON.stringify(all));
  } catch {
    // A blocked store keeps the built value, which is the honest fallback.
  }
};
