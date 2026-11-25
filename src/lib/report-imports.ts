// What Import a report added to a project, kept in THIS browser — the changes,
// the document they came from, and the note left for whoever reviews them.
//
// WHY A STORE OF ITS OWN (.scratch/project-updates/spec.md, decisions 5, 18,
// 19). A project changes three ways: by hand, from a document, from a data
// source. Every change carries which. The hand edits and the measure entries
// already have stores; this one holds what only an import knows: which
// document a value was read from, the passage, whether the person changed the
// figure from the reading, and everything needed to take the import back.
//
// THREE READERS, ONE LIST.
//   - the project page applies it on load: record fields, contacts and funding
//     sources the import added, and Undo straight after the import;
//   - the review shows each change with its source beside the diff;
//   - the change log names the document.
// They all go through the functions here, so they cannot disagree.
//
// MEASURE ENTRIES STAY IN THEIR OWN STORE (src/lib/entry-draft.ts). An import
// files them there like any other entry and keeps only their ids, so the
// measures table needs no second source and Undo knows what to remove.
//
// THE FILE ITSELF goes to IndexedDB through src/lib/page-files.ts, keyed by
// importFilesId(): localStorage cannot hold a PDF. A sample or pasted text has
// no file; its passages are stored here and are the whole document.
//
// Browser-local, one versioned key, same honesty terms as every store here.

import type { ImportDocument } from '../data/firma2-report-import';
import { removeEntry } from './entry-draft';
import { forgetChanges, recordChange } from './changes';
import type { ChangeSubject } from '../data/firma2-changes';
import { deletePageFiles, listFiles, putFile } from './page-files';
import { readPublishing } from './publish-store';
import type { PageFile } from './page-files';

const KEY = 'firma2:report-imports:v1';

/** Fired on `document` whenever the list changes, with `{ slug }`. */
export const IMPORTS_EVENT = 'firma2:report-imports';

/** The sections of the project page a change can land in, in page order. */
export type ImportGroup = 'Key facts' | 'Performance measures' | 'Funding sources' | 'Contacts';
export const IMPORT_GROUPS: ImportGroup[] = ['Key facts', 'Performance measures', 'Funding sources', 'Contacts'];

export interface ImportedContact {
  name: string;
  role: string;
  organization: string;
  email: string;
}

export interface ImportedFunding {
  /** The grant or program the money comes through. */
  name: string;
  organization: string;
  /** Whole dollars secured. */
  amount: number;
}

export interface ImportedChange {
  /** Stable within the project: `import:<import id>:<proposal id>`. */
  key: string;
  group: ImportGroup;
  /** What changed, in the record's own vocabulary: "County", "Acres of … · 2025". */
  label: string;
  /** The record's value before the import. Absent when the change adds something. */
  from?: string;
  /** The value the import left on the record, as it reads. */
  to: string;
  /** Where in the document it came from, verbatim. */
  quote: string;
  /** The passage to show beside the change: an id in the document's passages. */
  passage?: string;
  /** The page to open a stored PDF at, when the reading gave one. */
  page?: number;
  /** The person changed the figure from what the document said. */
  edited?: boolean;
  /** The reading was unsure and left this empty; the person filled it in. */
  filled?: boolean;
  /** A measure entry this change filed (src/lib/entry-draft.ts). */
  entryId?: string;
  /** A record field this change set, in firma2-editable-field's raw format. */
  field?: { key: string; raw: string; previousRaw: string };
  contact?: ImportedContact;
  funding?: ImportedFunding;
}

export interface ReportImport {
  id: string;
  slug: string;
  /** ISO day, the fixture's present. */
  iso: string;
  by: string;
  document: {
    name: string;
    /** `file`: the bytes are in IndexedDB. `sample` and `text`: `pages` is the document. */
    kind: 'file' | 'sample' | 'text';
    pages?: ImportDocument['pages'];
  };
  /** The optional note for the reviewer. Empty when none was written. */
  note: string;
  changes: ImportedChange[];
}

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

const readAll = (): ReportImport[] => {
  try {
    const parsed = JSON.parse(storage()?.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAll = (next: ReportImport[], slug: string): void => {
  try {
    storage()?.setItem(KEY, JSON.stringify(next));
  } catch {
    // Blocked storage: nothing is kept, which the page states.
  }
  if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent(IMPORTS_EVENT, { detail: { slug } }));
};

/** This project's imports in this browser, oldest first. */
export const readImports = (slug: string): ReportImport[] => readAll().filter((i) => i.slug === slug);

export const findImport = (slug: string, id: string): ReportImport | undefined =>
  readImports(slug).find((i) => i.id === id);

/** A new import's id: the next free `import-N` for the project. */
export const nextImportId = (slug: string): string => {
  const taken = new Set(readImports(slug).map((i) => i.id));
  let n = 1;
  while (taken.has(`import-${n}`)) n += 1;
  return `import-${n}`;
};

export const changeKey = (importId: string, proposalId: string): string => `import:${importId}:${proposalId}`;

/** The import a change key belongs to, or null for a change that was not imported. */
export const importOfKey = (slug: string, key: string): ReportImport | undefined => {
  const id = /^import:([^:]+):/.exec(key)?.[1];
  return id ? findImport(slug, id) : undefined;
};

/** Where an import's file lives in src/lib/page-files.ts. */
export const importFilesId = (slug: string, importId: string): string => `report-import:${slug}:${importId}`;

/** Record an import, and keep its file when it has one. */
export const addImport = async (record: ReportImport, file: File | null): Promise<void> => {
  if (file) await putFile(importFilesId(record.slug, record.id), 'document', file);
  writeAll([...readAll(), record], record.slug);
  // EACH THING THE IMPORT ADDED IS A CHANGE in the record's one log
  // (src/lib/changes.ts), with the document as its source and the words it was
  // read from. Its id is the imported change's key, so Undo can find it.
  const name = record.document.kind === 'text' ? 'pasted text' : record.document.name;
  record.changes.forEach((c) => {
    const subject: ChangeSubject = c.entryId
      ? 'measure-entry'
      : c.contact
        ? 'contact'
        : c.funding
          ? 'funding'
          : c.field?.key.startsWith('field:')
            ? 'custom-field'
            : 'field';
    recordChange(
      record.slug,
      {
        subject,
        key: c.field?.key ?? c.funding?.name ?? c.contact?.name ?? c.label,
        action: c.from === undefined ? 'add' : 'set',
        from: c.from,
        to: c.to,
        summary: c.from === undefined ? `${c.label} set to ${c.to}` : `${c.label} changed from ${c.from} to ${c.to}`,
      },
      { id: c.key, source: { kind: 'document', name, quote: c.quote, passage: c.passage, page: c.page } },
    );
  });
};

/** The stored file behind an import, when it had one and this browser kept it. */
export const importFile = async (slug: string, importId: string): Promise<PageFile | undefined> =>
  (await listFiles(importFilesId(slug, importId), 'document'))[0];

/**
 * Take an import back: its measure entries leave the entry store, the record
 * is removed, and its file is dropped. The caller puts record fields back from
 * each change's `field.previousRaw`, because only the project page holds them.
 */
export const undoImport = async (slug: string, importId: string): Promise<ReportImport | undefined> => {
  const record = findImport(slug, importId);
  if (!record) return undefined;
  record.changes.forEach((c) => {
    // Not logged as a removal: an import undone from its toast never happened,
    // so its rows leave the log instead (below).
    if (c.entryId) removeEntry(slug, c.entryId, { log: false });
  });
  forgetChanges(slug, (change) => change.id.startsWith(`import:${importId}:`));
  await deletePageFiles(importFilesId(slug, importId));
  writeAll(
    readAll().filter((i) => !(i.slug === slug && i.id === importId)),
    slug,
  );
  return record;
};

/** Every imported change on the project, oldest import first. */
export const importedChanges = (slug: string): ImportedChange[] => readImports(slug).flatMap((i) => i.changes);

/** The raw value each record field was last set to by an import. A later import wins. */
export const importedFields = (slug: string): Record<string, string> =>
  Object.fromEntries(importedChanges(slug).flatMap((c) => (c.field ? [[c.field.key, c.field.raw]] : [])));

/** Changes a manager reverted in the review: the record no longer holds them. */
const revertedKeys = (slug: string): Set<string> => new Set(readPublishing().reverted[slug] ?? []);

export const importedContacts = (slug: string): { change: ImportedChange; contact: ImportedContact; from: ReportImport }[] => {
  const gone = revertedKeys(slug);
  return readImports(slug).flatMap((from) => from.changes.flatMap((change) => (change.contact && !gone.has(change.key) ? [{ change, contact: change.contact, from }] : [])));
};

export const importedFunding = (slug: string): { change: ImportedChange; funding: ImportedFunding; from: ReportImport }[] => {
  const gone = revertedKeys(slug);
  return readImports(slug).flatMap((from) => from.changes.flatMap((change) => (change.funding && !gone.has(change.key) ? [{ change, funding: change.funding, from }] : [])));
};

/** "From deer-creek-completion-report-2025.pdf" — the one-line source of an imported change. */
export const sourceLine = (from: ReportImport): string =>
  from.document.kind === 'text' ? 'From pasted text' : `From ${from.document.name}`;

// ---------------------------------------------------------------------------
// Handing a dropped file from the project page to the import page
// ---------------------------------------------------------------------------

const handoffId = (slug: string): string => `report-handoff:${slug}`;

/** Keep a file dropped on the project page for the import page to pick up. */
export const stashHandoff = async (slug: string, file: File): Promise<boolean> => {
  await deletePageFiles(handoffId(slug));
  return (await putFile(handoffId(slug), 'document', file)) !== undefined;
};

/** Take the dropped file, once. Null when there is none. */
export const takeHandoff = async (slug: string): Promise<File | null> => {
  const kept = (await listFiles(handoffId(slug), 'document'))[0];
  if (!kept) return null;
  await deletePageFiles(handoffId(slug));
  return new File([kept.blob], kept.name, { type: kept.type });
};
