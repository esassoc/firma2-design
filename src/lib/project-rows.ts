// Hand edits to a project's funding sources and contacts, kept in THIS browser.
//
// WHY A STORE OF ITS OWN (.scratch/project-updates/requirements/stories/81-…,
// user decision 2026-11-23). An import's Undo lives only on its toast; once the
// toast is gone, what the import added is corrected by hand on the project
// page. Key facts and measure entries could already be corrected there. A
// funding source and a contact could not, so a wrong imported row had no way
// off the record. This store holds the two things a person can now do to a
// row: change its values, or remove it.
//
// IT IS AN OVERLAY, NOT A COPY. The rows themselves still come from where they
// always did: the build's seeded data, and src/lib/report-imports.ts for rows
// an import added. Each row has a stable id (`seed:<index>` or the import's
// change key), and this store says, per id, "these are its values now" or
// "it is gone". Clearing the store restores the page exactly as built.
//
// A ROW AN IMPORT ADDED, ONCE TOUCHED HERE, IS A HAND EDIT. The import's own
// record is not rewritten: its change still says what the document said, so
// the review and the change history keep the document's figure, and Undo can
// tell that the row is no longer as the import left it.
//
// Browser-local, one versioned key, same honesty terms as every store here.

import { recordChange } from './changes';

const KEY = 'firma2:project-rows:v1';

/** Fired on `document` whenever a project's rows change, with `{ slug }`. */
export const ROWS_EVENT = 'firma2:project-rows';

export interface FundingValues {
  /** The funding source's name: the grant or program the money comes through. */
  name: string;
  /** The organization offering it, read from the funding source. */
  organization: string;
  /** Whole dollars. */
  amount: number;
}

/** The id prefix of a funding row a person added on the project page. */
export const HAND_ROW = 'hand:';

export interface ContactValues {
  name: string;
  role: string;
  organization: string;
  email: string;
}

/** A row's values as edited, or `null` when the row was removed. */
type Overlay<V> = Record<string, V | null>;

interface ProjectRows {
  funding: Overlay<FundingValues>;
  contacts: Overlay<ContactValues>;
}

type State = Record<string, ProjectRows>;

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

const readAll = (): State => {
  try {
    const parsed = JSON.parse(storage()?.getItem(KEY) ?? '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const writeAll = (next: State, slug: string): void => {
  try {
    storage()?.setItem(KEY, JSON.stringify(next));
  } catch {
    // Blocked storage: nothing is kept past this page view.
  }
  if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent(ROWS_EVENT, { detail: { slug } }));
};

/** This project's hand edits to its funding and contact rows. */
export const readRows = (slug: string): ProjectRows => {
  const found = readAll()[slug];
  return { funding: found?.funding ?? {}, contacts: found?.contacts ?? {} };
};

const update = (slug: string, change: (rows: ProjectRows) => void): void => {
  const all = readAll();
  const rows = readRows(slug);
  change(rows);
  writeAll({ ...all, [slug]: rows }, slug);
};

// EVERY WRITE HERE IS A CHANGE in the record's one log (src/lib/changes.ts).
const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const saveFunding = (slug: string, id: string, values: FundingValues): void => {
  update(slug, (rows) => {
    rows.funding[id] = values;
  });
  recordChange(slug, { subject: 'funding', key: values.name, action: 'set', to: dollars.format(values.amount), summary: `Funding source changed: ${values.name}, ${dollars.format(values.amount)}` });
};

/** Add a funding row by hand. Its id is new to the project and never reused. */
export const addFunding = (slug: string, values: FundingValues): void => {
  update(slug, (rows) => {
    let n = Object.keys(rows.funding).filter((id) => id.startsWith(HAND_ROW)).length + 1;
    while (`${HAND_ROW}${n}` in rows.funding) n += 1;
    rows.funding[`${HAND_ROW}${n}`] = values;
  });
  recordChange(slug, { subject: 'funding', key: values.name, action: 'add', to: dollars.format(values.amount), summary: `Funding source added: ${values.name}` });
};

/** `was` names the row for the log: the store knows a removed row only by its id. */
export const removeFunding = (slug: string, id: string, was?: FundingValues): void => {
  update(slug, (rows) => {
    rows.funding[id] = null;
  });
  if (was) recordChange(slug, { subject: 'funding', key: was.name, action: 'remove', from: dollars.format(was.amount), summary: `Funding source removed: ${was.name}` });
};

export const saveContact = (slug: string, id: string, values: ContactValues): void => {
  update(slug, (rows) => {
    rows.contacts[id] = values;
  });
  recordChange(slug, { subject: 'contact', key: values.name, action: 'set', to: values.role || values.name, summary: `Contact changed: ${values.name}` });
};

export const removeContact = (slug: string, id: string, was?: ContactValues): void => {
  update(slug, (rows) => {
    rows.contacts[id] = null;
  });
  if (was) recordChange(slug, { subject: 'contact', key: was.name, action: 'remove', summary: `Contact removed: ${was.name}` });
};

// ---------------------------------------------------------------------------
// Opening the editor
// ---------------------------------------------------------------------------

/** Fired on `document` by a row's Edit control; firma2-project-row-editor listens. */
export const EDIT_ROW_EVENT = 'firma2:project-row-edit';

interface EditRequestBase {
  slug: string;
  /** The row's stable id. */
  id: string;
  /** The control that asked, so focus can go back to it. */
  opener?: HTMLElement;
}

export type EditRowRequest =
  | (EditRequestBase & {
      kind: 'funding';
      /** True when the row does not exist yet: Save adds it and there is nothing to remove. */
      adding?: boolean;
      values: FundingValues;
      /** Every OTHER funding row on the project, for the no-two-the-same rule. */
      others: FundingValues[];
    })
  | (EditRequestBase & {
      kind: 'contact';
      values: ContactValues;
      /** Every OTHER contact's email on the project. */
      others: string[];
    });

export const requestRowEdit = (request: EditRowRequest): void => {
  document.dispatchEvent(new CustomEvent<EditRowRequest>(EDIT_ROW_EVENT, { detail: request }));
};

/** Two names or addresses are the same when they match ignoring case and outer spaces. */
export const sameText = (a: string, b: string): boolean => a.trim().toLowerCase() === b.trim().toLowerCase();
