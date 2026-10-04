// Keeps a server-rendered list of project types, classifications or tags in
// step with this browser's edits (src/lib/taxonomy-edits.ts): removed rows go,
// renamed and re-described rows update, and rows added here are appended —
// cloned from the first row so they are the same markup, their figures filled
// by the caller (a record added here has no projects yet). Rows then follow
// the stored order (a classification group's arrangement, src/lib/taxonomy-edits.ts).
//
// Rows carry `data-slug`; inside a row, `[data-row-name]` (the link),
// `[data-row-desc]`, and `[data-cell="<key>"]` per figure.

import { entries } from './taxonomy-edits';
import type { TaxonomyEntry, TaxonomyKind } from './taxonomy-edits';
import { recordHref } from './taxonomy-record';

export const syncTaxonomyList = (
  tbody: HTMLElement,
  kind: TaxonomyKind,
  opts: {
    /** Base-less list path, "/prototypes/workspace-settings/tags". */
    listPath: string;
    /** Only entries this list shows (a classification table shows one group). */
    include?: (e: TaxonomyEntry) => boolean;
    /** Figures for a row added in this browser. */
    cells?: (e: TaxonomyEntry) => Record<string, string>;
    /** Anything else a row shows (a swatch colour). */
    paint?: (row: HTMLElement, e: TaxonomyEntry) => void;
    /** A row to clone when this list has none of its own — an empty group's table. */
    template?: HTMLElement;
  },
): void => {
  const current = entries(kind).filter((e) => opts.include?.(e) ?? true);
  const bySlug = new Map(current.map((e) => [e.slug, e]));
  const rows = [...tbody.querySelectorAll<HTMLElement>('tr[data-slug]')];
  const template = rows[0] ?? opts.template;

  for (const row of rows) {
    const e = bySlug.get(row.dataset.slug ?? '');
    if (!e) {
      row.remove();
      continue;
    }
    const name = row.querySelector('[data-row-name]');
    const desc = row.querySelector('[data-row-desc]');
    if (name) name.textContent = e.name;
    if (desc) desc.textContent = e.description;
    opts.paint?.(row, e);
  }

  const shown = new Set(rows.map((r) => r.dataset.slug));
  for (const e of current.filter((x) => !shown.has(x.slug))) {
    if (!template) break;
    const row = template.cloneNode(true) as HTMLElement;
    row.dataset.slug = e.slug;
    const name = row.querySelector<HTMLAnchorElement>('[data-row-name]');
    if (name) {
      name.textContent = e.name;
      name.href = recordHref(opts.listPath, e.slug);
    }
    const desc = row.querySelector('[data-row-desc]');
    if (desc) desc.textContent = e.description;
    for (const [key, value] of Object.entries(opts.cells?.(e) ?? {})) {
      const cell = row.querySelector(`[data-cell="${key}"]`);
      if (cell) cell.textContent = value;
    }
    opts.paint?.(row, e);
    tbody.append(row);
  }

  // Stored order: re-append in `current` order (append moves an existing node).
  const bySlugRow = new Map([...tbody.querySelectorAll<HTMLElement>('tr[data-slug]')].map((r) => [r.dataset.slug, r]));
  for (const e of current) {
    const row = bySlugRow.get(e.slug);
    if (row) tbody.append(row);
  }
};
