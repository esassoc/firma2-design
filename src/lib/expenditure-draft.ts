// Browser-local EXPENDITURES — the spend recorded against a project, one
// figure per reporting period. Same store, same honesty terms as every other
// draft in this prototype: localStorage, ONE browser, and the UI says so where
// the reader can see it.
//
// THE ATOM MATCHES entry-draft's, deliberately. An entry is one figure, for one
// measure, in one period; an expenditure is one figure, for the project, in one
// period. A project reports money the way it reports work, so the two stores
// are the same shape minus the parts money does not have — no measure key,
// because spend files against the project itself, and no subcategory answers,
// because dollars have no schema to qualify them.
//
// WHAT IS NOT HERE: the funding source. ProjectFirma's real atom is
// ProjectFundingSourceExpenditure — spend per SOURCE per year, which is what
// makes "$226,500 of $412,000" decompose into a per-funder draw-down. This
// store is flat because the section it feeds is flat, and adding the dimension
// later is one field here plus one control on the sheet. It is named so the
// omission is a decision on the record rather than an oversight.

export interface ExpenditureDraft {
  id: string;
  /** The reporting period this figure was filed against. */
  year: number;
  /** Whole dollars. Always > 0 — a period with nothing to report is not filed. */
  amount: number;
}

const KEY_VERSION = 'v1';
const keyFor = (projectSlug: string): string =>
  `firma2:expenditures:${KEY_VERSION}:${projectSlug}`;

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    // Safari in private mode throws on access rather than returning null.
    return null;
  }
};

const isExpenditure = (v: unknown): v is ExpenditureDraft => {
  if (typeof v !== 'object' || v === null) return false;
  const c = v as Partial<ExpenditureDraft>;
  return (
    typeof c.id === 'string' &&
    typeof c.year === 'number' &&
    Number.isFinite(c.year) &&
    typeof c.amount === 'number' &&
    Number.isFinite(c.amount)
  );
};

/** Every expenditure recorded against this project in this browser, oldest first. */
export const readExpenditures = (projectSlug: string): ExpenditureDraft[] => {
  const store = storage();
  if (!store) return [];
  try {
    const parsed = JSON.parse(store.getItem(keyFor(projectSlug)) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isExpenditure) : [];
  } catch {
    return [];
  }
};

/** What was recorded here against one year — 0 when nothing was. */
export const recordedInYear = (projectSlug: string, year: number): number =>
  readExpenditures(projectSlug)
    .filter((e) => e.year === year)
    .reduce((sum, e) => sum + e.amount, 0);

/** Record one expenditure. The id is minted here, deterministically per store. */
export const addExpenditure = (
  projectSlug: string,
  expenditure: Omit<ExpenditureDraft, 'id'>,
): ExpenditureDraft | null => {
  const store = storage();
  if (!store) return null;
  try {
    const existing = readExpenditures(projectSlug);
    const taken = new Set(existing.map((e) => e.id));
    let n = 1;
    while (taken.has(`spend-${n}`)) n += 1;
    const full: ExpenditureDraft = { ...expenditure, id: `spend-${n}` };
    store.setItem(keyFor(projectSlug), JSON.stringify([...existing, full]));
    return full;
  } catch {
    return null;
  }
};

export const removeExpenditure = (projectSlug: string, id: string): void => {
  const store = storage();
  if (!store) return;
  try {
    const rest = readExpenditures(projectSlug).filter((e) => e.id !== id);
    store.setItem(keyFor(projectSlug), JSON.stringify(rest));
  } catch {
    // A blocked store also had nothing to remove.
  }
};
