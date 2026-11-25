// What a project's review still has to show, once this browser's imports are
// laid over the build's seeded changes: one row per field, however many edits
// and imports touched it.
//
// TWO READERS, ONE COUNT. The review's diff (firma2-review-changes) draws these
// rows and the project page's badge (firma2-project-publish-state) counts
// them, so "3 unpublished changes" and the three rows cannot disagree.
//
// THE NET DIFF RULE (.scratch/project-updates/spec.md, decision 30). An import
// that sets a field a hand edit already changed since the last publish is not
// a second row: it folds into the first, the published value from the hand
// edit's row, the current value and the source from the import. Two imports
// that set one field fold the same way, the later one's value standing.
//
// EVERY KEY STILL PUBLISHES. A folded row carries all the change keys behind
// it, and `pending` lists every key still waiting, so Publish records them all
// (src/lib/publish-store.ts) and an undo brings them all back.

import { pendingKeys, readPublishing } from '../../lib/publish-store';
import { readImports } from '../../lib/report-imports';
import type { ImportedChange, ReportImport } from '../../lib/report-imports';

export interface ImportedRow {
  /** Every imported change key this row stands for, oldest first. */
  keys: string[];
  /** The newest change on the row: its value is the record's. */
  change: ImportedChange;
  /** The import that change came from. */
  from: ReportImport;
  /** What the public page shows for it. Absent when the row adds something. */
  published?: string;
  /** The seeded row this one takes the place of, by its change key. */
  folds?: string;
}

export interface ReviewRows {
  /** Every change key still waiting, seeded and imported. */
  pending: string[];
  /** Seeded keys still waiting, folded ones included. */
  seeded: string[];
  imported: ImportedRow[];
  /** Rows in front of the manager: one per field. */
  count: number;
}

export const reviewRows = (slug: string, seededKeys: string[], state = readPublishing()): ReviewRows => {
  const imports = readImports(slug);
  const importedKeys = imports.flatMap((i) => i.changes.map((c) => c.key));
  const pending = pendingKeys(slug, [...seededKeys, ...importedKeys], state);
  const left = new Set(pending);
  const seeded = seededKeys.filter((k) => left.has(k));

  const imported: ImportedRow[] = [];
  const byField = new Map<string, ImportedRow>();
  for (const from of imports) {
    for (const change of from.changes) {
      if (!left.has(change.key)) continue;
      const field = change.field?.key;
      const earlier = field ? byField.get(field) : undefined;
      if (earlier) {
        earlier.keys.push(change.key);
        earlier.change = change;
        earlier.from = from;
        continue;
      }
      const row: ImportedRow = {
        keys: [change.key],
        change,
        from,
        published: change.from,
        folds: field && seeded.includes(field) ? field : undefined,
      };
      imported.push(row);
      if (field) byField.set(field, row);
    }
  }

  const folded = imported.filter((r) => r.folds).length;
  return { pending, seeded, imported, count: seeded.length - folded + imported.length };
};
