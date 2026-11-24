// Importing projects from a spreadsheet — the engine behind
// firma2-project-import. Pure functions from a sheet and the importer's
// decisions to a proposal of rows, plus the browser store that keeps what an
// import wrote so the Projects index shows it and Undo can take it back.
//
// THE PROPOSAL IS RECOMPUTED, NEVER PATCHED. Every decision (a column's
// field, a value's match, a fixed cell, a skipped row) is an input, and
// `proposeRows` derives every row's fate from all of them at once. A screen
// that edits the proposal in place drifts from what the decisions say; this
// one cannot.
//
// WHAT COUNTS AS THE SAME PROJECT. Name, compared without case or extra
// spaces. A row that names an existing project updates it (or is skipped, the
// importer's call), and a blank cell never clears a value: an import fills
// and corrects, it does not erase.
//
// Browser-local, one versioned key, every access wrapped — same honesty
// terms as every store in this spoke.

import { projects as seedProjects, STAGE_ORDER } from '../data/firma2-projects';
import type { Project } from '../data/firma2-projects';
import { PROJECT_TYPES } from '../data/firma2-project-types';
import { CLASSIFICATIONS } from '../data/firma2-classifications';
import { organizations } from '../data/firma2-directory';
import { IMPORT_FIELDS, IMPORT_SUGGESTIONS } from '../data/firma2-project-import';
import type { ImportField, ImportSheet, ImportVocabulary } from '../data/firma2-project-import';
import { readAddedOrganizations } from './added-organizations';
import { currentTags } from './project-tags';

// ---------------------------------------------------------------------------
// Reading a file
// ---------------------------------------------------------------------------

/** RFC 4180: quoted fields, doubled quotes, CRLF or LF. Trailing empty rows dropped. */
export const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  while (rows.length && rows[rows.length - 1].every((c) => !c.trim())) rows.pop();
  return rows;
};

const filled = (row: string[] | undefined): number => (row ?? []).filter((c) => c.trim()).length;

/**
 * The row the headings are in: the fullest of the first ten. Title rows above
 * a table hold one cell; the headings hold one per column.
 */
export const headerRowOf = (cells: string[][]): number => {
  let best = 0;
  for (let i = 0; i < Math.min(10, cells.length); i += 1) if (filled(cells[i]) > filled(cells[best])) best = i;
  return best;
};

export const columnsOf = (sheet: ImportSheet, headerRow: number): string[] =>
  (sheet.cells[headerRow] ?? []).map((h, i) => h.trim() || `Column ${i + 1}`);

/** Rows below the headings that hold anything, with their sheet row number (1-based). */
export const dataRowsOf = (sheet: ImportSheet, headerRow: number): { row: number; cells: string[] }[] =>
  sheet.cells
    .map((cells, i) => ({ row: i + 1, cells }))
    .slice(headerRow + 1)
    .filter((r) => filled(r.cells) > 0);

// ---------------------------------------------------------------------------
// Columns
// ---------------------------------------------------------------------------

export const norm = (s: string): string =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/\s+/g, ' ').trim();

export const fieldOf = (key: string): ImportField | undefined => IMPORT_FIELDS.find((f) => f.key === key);

/** Each column's field, matched from its heading. A field is claimed by one column at most; '' is "Don't import". */
export const autoMap = (columns: string[]): string[] => {
  const taken = new Set<string>();
  return columns.map((heading) => {
    const h = norm(heading);
    const field = IMPORT_FIELDS.find((f) => !taken.has(f.key) && (norm(f.label) === h || f.synonyms.some((s) => norm(s) === h)));
    if (!field) return '';
    taken.add(field.key);
    return field.key;
  });
};

/** Required fields no column is mapped to. */
export const unmappedRequired = (mapping: string[]): ImportField[] =>
  IMPORT_FIELDS.filter((f) => f.required && !mapping.includes(f.key));

// ---------------------------------------------------------------------------
// Values — the workspace's closed lists
// ---------------------------------------------------------------------------

/** Every value a list accepts, in the list's own order. */
export const vocabularyValues = (vocabulary: ImportVocabulary): string[] => {
  switch (vocabulary) {
    case 'stage':
      return [...STAGE_ORDER];
    case 'projectType':
      return PROJECT_TYPES.map((t) => t.name);
    case 'classifications':
      return CLASSIFICATIONS.map((c) => c.name);
    case 'tags':
      return currentTags().map((t) => t.name);
    case 'leadOrganization':
      return [...new Set([...organizations.map((o) => o.name), ...readAddedOrganizations().map((o) => o.name)])].sort((a, b) => a.localeCompare(b));
  }
};

/** A multi-value cell's members: semicolons or line breaks, and commas when there are none. */
export const splitMulti = (raw: string): string[] =>
  (/[;\n]/.test(raw) ? raw.split(/[;\n]/) : raw.split(',')).map((s) => s.trim()).filter(Boolean);

/** The marker a lead-organization decision carries when the importer adds it as new. */
export const NEW_ORGANIZATION = '__new__';

export const decisionKey = (vocabulary: ImportVocabulary, value: string): string => `${vocabulary}|${norm(value)}`;

export interface DistinctValue {
  key: string;
  vocabulary: ImportVocabulary;
  field: ImportField;
  /** As the file spells it (the first spelling met). */
  value: string;
  /** Sheet rows it appears in. */
  rows: number[];
  /** The list value it equals, ignoring case, spacing and "&"/"and". */
  exact?: string;
  /** A pre-picked match the importer confirms or changes. */
  suggested?: string;
}

/** Every distinct value the mapped list columns hold. */
export const distinctValues = (sheet: ImportSheet, headerRow: number, mapping: string[], skipped: Set<number>): DistinctValue[] => {
  const byKey = new Map<string, DistinctValue>();
  const rows = dataRowsOf(sheet, headerRow).filter((r) => !isTotalRow(r.cells) && !skipped.has(r.row));
  mapping.forEach((key, col) => {
    const field = fieldOf(key);
    if (!field?.vocabulary) return;
    const vocabulary = field.vocabulary;
    const listed = vocabularyValues(vocabulary);
    rows.forEach(({ row, cells }) => {
      const raw = (cells[col] ?? '').trim();
      if (!raw) return;
      for (const value of field.kind === 'multi' ? splitMulti(raw) : [raw]) {
        const k = decisionKey(vocabulary, value);
        const hit = byKey.get(k);
        if (hit) {
          if (!hit.rows.includes(row)) hit.rows.push(row);
          continue;
        }
        const exact = listed.find((v) => norm(v) === norm(value));
        const suggestion = IMPORT_SUGGESTIONS[vocabulary][value.toLowerCase().trim()];
        byKey.set(k, {
          key: k,
          vocabulary,
          field,
          value,
          rows: [row],
          exact,
          suggested: !exact && suggestion && listed.includes(suggestion) ? suggestion : undefined,
        });
      }
    });
  });
  return [...byKey.values()];
};

// ---------------------------------------------------------------------------
// Rows
// ---------------------------------------------------------------------------

/** A project as an import writes it: the record's fields plus custom-field answers. */
export interface ImportedProject extends Omit<Project, 'projectType' | 'classifications' | 'tags'> {
  projectType: string;
  classifications: string[];
  tags: string[];
  description?: string;
  custom: Record<string, string>;
  /** Created by an import; has no static detail page in this prototype. */
  imported?: true;
}

export interface Problem {
  field: ImportField;
  /** What the file holds, for the message and the fix box. */
  raw: string;
  message: string;
  /** The file's spelling, when the problem is a list value with no match. It is
      answered once, in the values table, never per row. */
  unmatched?: string;
  /** The other field in a conflict between two (a completion year before the
      start): fixing either clears it, so both get a box. */
  also?: ImportField;
}

export interface Change {
  label: string;
  from: string;
  to: string;
  /** Said instead of from → to, for a value too long to quote ("added", "rewritten"). */
  note?: string;
}

export type RowStatus = 'new' | 'update' | 'same' | 'fix' | 'total' | 'existing' | 'skipped';

export interface RowOutcome {
  row: number;
  status: RowStatus;
  name: string;
  values: Partial<ImportedProject>;
  problems: Problem[];
  changes: Change[];
  /** The original cells, for the skipped-rows download. */
  cells: string[];
}

export interface ImportDecisions {
  mapping: string[];
  /** decisionKey → list value, '' to leave blank, or NEW_ORGANIZATION. */
  values: Map<string, string>;
  /** `${row}|${fieldKey}` → the corrected cell. */
  fixes: Map<string, string>;
  skipped: Set<number>;
  existing: 'update' | 'skip';
}

const TOTAL = /^(grand\s+)?totals?:?$/i;
export const isTotalRow = (cells: string[]): boolean => TOTAL.test((cells.find((c) => c.trim()) ?? '').trim());

/** A four-digit year, or the year of a date ("6/1/2025", "2025-06-01"). */
export const parseYear = (raw: string): number | null => {
  const s = raw.trim();
  const m = s.match(/^(\d{4})$/) ?? s.match(/^\d{1,2}\/\d{1,2}\/(\d{4})$/) ?? s.match(/^(\d{4})-\d{1,2}-\d{1,2}$/);
  if (!m) return null;
  const y = Number(m[1]);
  return y >= 1900 && y <= 2100 ? y : null;
};

/** Dollars: "$1,310,000", "640K", "$2.4M". Whole dollars. */
export const parseMoney = (raw: string): number | null => {
  const m = raw.trim().replace(/[$,\s]/g, '').match(/^(\d+(?:\.\d+)?)([kmb])?$/i);
  if (!m) return null;
  const scale = { k: 1e3, m: 1e6, b: 1e9 }[(m[2] ?? '').toLowerCase() as 'k' | 'm' | 'b'] ?? 1;
  return Math.round(Number(m[1]) * scale);
};

export const parseNumber = (raw: string): number | null => {
  const s = raw.trim().replace(/,/g, '');
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
};

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export const formatMoney = (n: number): string => money.format(n);

/** How a field's value reads in a change line. */
export const show = (field: ImportField, value: unknown): string => {
  if (value === undefined || value === null || value === '') return 'blank';
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'none';
  if (field.kind === 'money' && typeof value === 'number') return formatMoney(value);
  return String(value);
};

const valueOf = (project: ImportedProject, key: string): unknown =>
  key.startsWith('custom:') ? project.custom?.[key.slice(7)] : (project as unknown as Record<string, unknown>)[key];

/** The workspace's projects as they stand: seeds and earlier imports, with imported updates laid over. */
export const currentProjects = (): ImportedProject[] => {
  const batches = readBatches();
  const overlay = new Map<string, Partial<ImportedProject>>();
  for (const b of batches) for (const u of b.updated) overlay.set(norm(u.name), { ...overlay.get(norm(u.name)), ...u.after });
  const apply = (p: ImportedProject): ImportedProject => {
    const o = overlay.get(norm(p.projectName));
    return o ? { ...p, ...o, custom: { ...p.custom, ...(o.custom ?? {}) } } : p;
  };
  return [
    ...seedProjects.map((p) => apply({ ...p, custom: {} })),
    ...batches.flatMap((b) => b.created).map(apply),
  ];
};

/**
 * Every data row's fate under the importer's decisions. A row is `fix` while
 * any problem stands; fixing or skipping it is the importer's act.
 */
export const proposeRows = (sheet: ImportSheet, headerRow: number, d: ImportDecisions): RowOutcome[] => {
  const existing = new Map(currentProjects().map((p) => [norm(p.projectName), p]));
  const firstSeen = new Map<string, number>();
  const matchOf = (vocabulary: ImportVocabulary, value: string): string => {
    const decided = d.values.get(decisionKey(vocabulary, value));
    if (decided !== undefined) return decided === NEW_ORGANIZATION ? value.trim() : decided;
    const listed = vocabularyValues(vocabulary);
    return listed.find((v) => norm(v) === norm(value)) ?? '';
  };

  return dataRowsOf(sheet, headerRow).map(({ row, cells }): RowOutcome => {
    const base = { row, cells, problems: [] as Problem[], changes: [] as Change[], values: {} as Partial<ImportedProject> };
    if (isTotalRow(cells)) return { ...base, status: 'total', name: (cells.find((c) => c.trim()) ?? '').trim() };

    const values: Partial<ImportedProject> & { custom: Record<string, string> } = { custom: {} };
    const problems: Problem[] = [];
    const cellOf = (key: string): string => {
      const fixed = d.fixes.get(`${row}|${key}`);
      if (fixed !== undefined) return fixed;
      const col = d.mapping.indexOf(key);
      return col === -1 ? '' : (cells[col] ?? '').trim();
    };

    for (const key of d.mapping) {
      const field = fieldOf(key);
      if (!field) continue;
      const raw = cellOf(key);
      const fixedHere = d.fixes.has(`${row}|${key}`);
      const set = (v: unknown) => {
        if (key.startsWith('custom:')) values.custom[key.slice(7)] = String(v);
        else (values as Record<string, unknown>)[key] = v;
      };
      if (!raw) continue;
      switch (field.kind) {
        case 'year': {
          const y = parseYear(raw);
          if (y === null) problems.push({ field, raw, message: `“${raw}” isn’t a year` });
          else set(y);
          break;
        }
        case 'money': {
          const n = parseMoney(raw);
          if (n === null) problems.push({ field, raw, message: `“${raw}” isn’t an amount` });
          else set(n);
          break;
        }
        case 'number': {
          const n = parseNumber(raw);
          if (n === null) problems.push({ field, raw, message: `“${raw}” isn’t a number` });
          else set(n);
          break;
        }
        case 'choice': {
          // A fixed cell holds a list value already; the file's holds its own spelling.
          const v = fixedHere ? raw : matchOf(field.vocabulary!, raw);
          if (v) set(v);
          break;
        }
        case 'multi': {
          const list = [...new Set(splitMulti(raw).map((v) => matchOf(field.vocabulary!, v)).filter(Boolean))];
          if (list.length) set(list);
          break;
        }
        default:
          set(raw);
      }
    }

    const name = (values.projectName ?? '').trim();
    if (!name) problems.push({ field: fieldOf('projectName')!, raw: '', message: 'No project name' });
    for (const key of ['leadOrganization', 'stage'] as const) {
      if (d.mapping.includes(key) && !values[key] && !problems.some((p) => p.field.key === key)) {
        const field = fieldOf(key)!;
        const raw = cells[d.mapping.indexOf(key)]?.trim() ?? '';
        problems.push(raw
          ? { field, raw: '', message: `“${raw}” has no match`, unmatched: raw }
          : { field, raw: '', message: `No ${field.label.toLowerCase()}` });
      }
    }
    const start = values.implementationStartYear;
    const end = values.completionYear;
    if (start && end && end < start) {
      problems.push({ field: fieldOf('completionYear')!, raw: String(end), message: `Completion year ${end} is before the start, ${start}`, also: fieldOf('implementationStartYear')! });
    }
    if (name) {
      const seenAt = firstSeen.get(norm(name));
      if (seenAt !== undefined && !d.skipped.has(row)) problems.push({ field: fieldOf('projectName')!, raw: name, message: `Same name as row ${seenAt}` });
      else if (!d.skipped.has(row)) firstSeen.set(norm(name), row);
    }

    const outcome = { ...base, name: name || `Row ${row}`, values, problems };
    if (d.skipped.has(row)) return { ...outcome, status: 'skipped' };
    if (problems.length) return { ...outcome, status: 'fix' };

    const match = existing.get(norm(name));
    if (!match) return { ...outcome, status: 'new' };
    if (d.existing === 'skip') return { ...outcome, status: 'existing' };

    const changes: Change[] = [];
    for (const key of d.mapping) {
      const field = fieldOf(key);
      if (!field || key === 'projectName') continue;
      const next = valueOf(values as ImportedProject, key);
      if (next === undefined) continue;
      const before = valueOf(match, key);
      if (JSON.stringify(before ?? '') === JSON.stringify(next)) continue;
      changes.push(
        field.kind === 'long-text'
          ? { label: field.label, from: before ? String(before) : '', to: String(next), note: before ? 'rewritten' : 'added' }
          : { label: field.label, from: show(field, before), to: show(field, next) },
      );
    }
    return { ...outcome, name: match.projectName, changes, status: changes.length ? 'update' : 'same' };
  });
};

// ---------------------------------------------------------------------------
// The store — what each import wrote, so it shows and can be undone
// ---------------------------------------------------------------------------

export interface ImportBatch {
  id: string;
  /** ISO timestamp. */
  at: string;
  fileName: string;
  created: ImportedProject[];
  updated: { name: string; after: Partial<ImportedProject> }[];
  /** Organizations this import added, so Undo removes them too. */
  organizations: string[];
}

const KEY = 'firma2:project-imports:v1';
export const IMPORTS_CHANGE_EVENT = 'firma2:project-imports-change';

export const readBatches = (): ImportBatch[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeBatches = (batches: ImportBatch[]): boolean => {
  try {
    localStorage.setItem(KEY, JSON.stringify(batches));
    document.dispatchEvent(new Event(IMPORTS_CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
};

/** Writes the rows the proposal says will go in. Returns the batch, or null when storage is blocked. */
export const commitImport = (fileName: string, rows: RowOutcome[], organizationsAdded: string[]): ImportBatch | null => {
  const batch: ImportBatch = {
    id: `import-${Date.now().toString(36)}`,
    at: new Date().toISOString(),
    fileName,
    created: rows
      .filter((r) => r.status === 'new')
      .map((r) => ({
        projectName: r.name,
        projectType: '',
        classifications: [],
        tags: [],
        leadOrganization: '',
        county: '',
        stage: 'Proposal',
        implementationStartYear: 0,
        completionYear: 0,
        estimatedTotalCost: 0,
        estimatedAnnualOperatingCost: 0,
        ...r.values,
        custom: r.values.custom ?? {},
        imported: true,
      }) as ImportedProject),
    // The match is by name, so the name is never what an update changes.
    updated: rows.filter((r) => r.status === 'update').map((r) => {
      const { projectName: _, ...after } = r.values;
      return { name: r.name, after };
    }),
    organizations: organizationsAdded,
  };
  return writeBatches([...readBatches(), batch]) ? batch : null;
};

export const undoImport = (id: string): ImportBatch | undefined => {
  const batches = readBatches();
  const batch = batches.find((b) => b.id === id);
  writeBatches(batches.filter((b) => b.id !== id));
  return batch;
};

/** Projects created by imports, overlays applied — what the Projects index appends. */
export const importedProjects = (): ImportedProject[] => currentProjects().filter((p) => p.imported);

/** Imported updates to the seeded projects, by name — what the Projects index lays over its rows. */
export const importedUpdates = (): Map<string, Partial<ImportedProject>> => {
  const overlay = new Map<string, Partial<ImportedProject>>();
  for (const b of readBatches()) for (const u of b.updated) overlay.set(norm(u.name), { ...overlay.get(norm(u.name)), ...u.after });
  return overlay;
};
