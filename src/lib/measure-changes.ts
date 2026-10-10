// The measure change log — an audit row for every target and entry write on a
// project, as PM 2 keeps one (src/data/firma2-pm2.ts, Pm2Change; projectfirma2
// story 0010). Reconciled 2026-10-09.
//
// WRITTEN, NOT YET READ, exactly as on the branch: every target set, changed or
// cleared and every entry filed, changed or cleared appends a row here, and no
// screen shows them yet. The log exists so a history view can be built on
// facts rather than reconstructed.
//
// Same honesty terms as every store in this spoke: localStorage, ONE browser,
// one versioned key for the whole log. The seed carries no history; the log
// starts with the first edit made here.

export interface MeasureChange {
  id: number;
  projectSlug: string;
  /** The catalog measure's slug. */
  measureSlug: string;
  /** null = a target edit; set = an entry edit, keyed by the period's NAME. */
  periodName: string | null;
  field: 'TargetValue' | 'EntryValue';
  /** null old = create; null new = delete; both = update. Invariant `0.####`. */
  oldValue: string | null;
  newValue: string | null;
  changedBy: string;
  /** ISO timestamp. */
  changedDate: string;
}

const KEY = 'firma2:measure-changes:v1';

/** Who the prototype says made a change — there is no sign-in. */
export const CURRENT_USER = 'You';

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

/** Invariant decimal text, at most four places, no trailing zeros. */
const invariant = (n: number | null | undefined): string | null =>
  n == null || !Number.isFinite(n) ? null : String(Number(n.toFixed(4)));

export const readChanges = (projectSlug?: string): MeasureChange[] => {
  try {
    const parsed = JSON.parse(storage()?.getItem(KEY) ?? '[]');
    const rows = Array.isArray(parsed) ? (parsed as MeasureChange[]) : [];
    return projectSlug ? rows.filter((r) => r.projectSlug === projectSlug) : rows;
  } catch {
    return [];
  }
};

/**
 * Append one row. A write that changes nothing (same old and new value) is
 * not a change and is not logged.
 */
export const logChange = (
  change: Pick<MeasureChange, 'projectSlug' | 'measureSlug' | 'periodName' | 'field'> & {
    oldValue: number | null | undefined;
    newValue: number | null | undefined;
  },
): void => {
  const oldValue = invariant(change.oldValue);
  const newValue = invariant(change.newValue);
  if (oldValue === newValue) return;
  const store = storage();
  if (!store) return;
  try {
    const rows = readChanges();
    rows.push({
      id: (rows.at(-1)?.id ?? 0) + 1,
      projectSlug: change.projectSlug,
      measureSlug: change.measureSlug,
      periodName: change.periodName,
      field: change.field,
      oldValue,
      newValue,
      changedBy: CURRENT_USER,
      changedDate: new Date().toISOString(),
    });
    store.setItem(KEY, JSON.stringify(rows));
  } catch {
    // Quota or blocked storage: the edit itself still stands.
  }
};
