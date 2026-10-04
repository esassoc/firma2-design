// Custom pages added in this browser, and the rail rows built from them.
//
// The prototype's stand-in for a POST, the same arrangement as
// added-organizations.ts: Add page and Add folder are pages of their own, so
// what they create has to survive the navigation away. It is kept in this
// viewer's localStorage and merged after the seeds, with a page's edits and
// deletes layered on top; a one-shot sessionStorage note lets the next screen
// confirm a new folder or a delete once, on arrival.
//
// Every access is wrapped: storage can be missing or throw (private windows,
// blocked site data), and the rail must still render — it just forgets.

import { seedEntries, itemRoute, PAGES_GROUP } from '../data/firma2-pages';
import type { CustomEntry, CustomFolder, CustomItem, CustomPage, CustomDocument, DocumentFile } from '../data/firma2-pages';
import { withBase } from './base';
import { deletePageFiles } from './page-files';

const KEY = 'firma2:custom-pages:v1';
const EDITS_KEY = 'firma2:custom-pages-edits:v1';
const REMOVED_KEY = 'firma2:custom-pages-removed:v1';
const ORDER_KEY = 'firma2:custom-pages-order:v1';
const JUST_ADDED_KEY = 'firma2:custom-page-just-added:v1';
const ENABLED_KEY = 'firma2:custom-pages-enabled:v1';

/** The one-shot note the next screen confirms with a toast. */
export interface JustAdded {
  kind: 'page' | 'folder' | 'deleted';
  label: string;
}

/** An entry's changes since it was made. `folderId: null` moves a page or
    document to the top of Pages; `name` renames a folder; `file` replaces a
    document's file. */
export interface PageEdit {
  title?: string;
  folderId?: string | null;
  body?: string;
  name?: string;
  file?: DocumentFile;
}

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '') ?? fallback;
  } catch {
    return fallback;
  }
};
const writeJSON = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — the change is forgotten, the page still works */
  }
};

const readAdded = (): CustomEntry[] => readJSON<CustomEntry[]>(KEY, []);

// THE FEATURE SWITCH — Administration › Custom pages › Availability. On unless
// this browser turned it off. Off hides the rail's Pages group; it deletes
// nothing, so turning it back on brings every page back where it was.
export const readPagesEnabled = (): boolean => readJSON<boolean>(ENABLED_KEY, true) !== false;
export const writePagesEnabled = (on: boolean): void => writeJSON(ENABLED_KEY, on);

// EDITS AND DELETES ARE LAYERED OVER THE ENTRIES, not written into them, so a
// seed can be edited or deleted without rewriting the build's own data — and
// clearing site data puts the seeds back as shipped.
const applyEdit = (entry: CustomEntry, edit: PageEdit | undefined): CustomEntry => {
  if (!edit) return entry;
  if (entry.kind === 'folder') return edit.name !== undefined ? { ...entry, name: edit.name } : entry;
  const next: CustomItem = { ...entry };
  if (edit.title !== undefined) next.title = edit.title;
  if (edit.folderId !== undefined) next.folderId = edit.folderId ?? undefined;
  if (next.kind === 'page' && edit.body !== undefined) next.body = edit.body;
  if (next.kind === 'document' && edit.file !== undefined) next.file = edit.file;
  return next;
};

// THE ORDER IS ONE FLAT LIST OF IDS, written whenever a page is dragged or
// moved: the rail's top level, each folder followed by its own pages. Entries
// it does not name yet (added since the last move) keep their place after it,
// in the order they were added — so a new page still lands at the bottom.
const ordered = (entries: CustomEntry[]): CustomEntry[] => {
  const order = readJSON<string[]>(ORDER_KEY, []);
  if (!order.length) return entries;
  const rank = new Map(order.map((id, i) => [id, i]));
  return entries
    .map((entry, i) => ({ entry, at: rank.get(entry.id) ?? order.length + i }))
    .sort((a, b) => a.at - b.at)
    .map(({ entry }) => entry);
};

/** Seeds, then everything added in this browser — edits applied, deletes gone, in the order last arranged. */
export const readEntries = (): CustomEntry[] => {
  const edits = readJSON<Record<string, PageEdit>>(EDITS_KEY, {});
  const removed = new Set(readJSON<string[]>(REMOVED_KEY, []));
  return ordered(
    [...seedEntries, ...readAdded()].filter((e) => !removed.has(e.id)).map((e) => applyEdit(e, edits[e.id])),
  );
};

/** Pages as the rail shows them: the top level (folders and loose pages), and each folder's pages, in order. */
export interface PagesTree {
  top: string[];
  folders: Record<string, string[]>;
}

export const readTree = (entries: CustomEntry[] = readEntries()): PagesTree => {
  const folderIds = new Set(entries.filter((e) => e.kind === 'folder').map((e) => e.id));
  const tree: PagesTree = { top: [], folders: Object.fromEntries([...folderIds].map((id) => [id, []])) };
  for (const e of entries) {
    if (e.kind !== 'folder' && e.folderId && folderIds.has(e.folderId)) tree.folders[e.folderId].push(e.id);
    else tree.top.push(e.id);
  }
  return tree;
};

/**
 * Sets the whole order of one place — a folder, or the top of Pages when
 * `folderId` is null. A page or document in `ids` that sat somewhere else is moved here.
 * The Move dialog saves with this; a drag goes through movePage.
 */
export const arrange = (folderId: string | null, ids: string[]): void => {
  const tree = readTree();
  const moving = new Set(ids);
  tree.top = tree.top.filter((id) => !moving.has(id));
  for (const key of Object.keys(tree.folders)) tree.folders[key] = tree.folders[key].filter((id) => !moving.has(id));
  if (folderId) tree.folders[folderId] = [...ids, ...(tree.folders[folderId] ?? [])];
  else tree.top = [...ids, ...tree.top];
  writeJSON(ORDER_KEY, tree.top.flatMap((id) => [id, ...(tree.folders[id] ?? [])]));
  for (const id of ids) {
    const item = findItem(id);
    if (item && (item.folderId ?? null) !== folderId) updatePage(id, { folderId });
  }
};

/** Puts a page or document in a folder (null: the top of Pages), just before `beforeId` — or last when that is null. */
export const movePage = (id: string, folderId: string | null, beforeId: string | null): void => {
  const tree = readTree();
  const list = (folderId ? tree.folders[folderId] ?? [] : tree.top).filter((e) => e !== id);
  const at = beforeId ? list.indexOf(beforeId) : -1;
  list.splice(at < 0 ? list.length : at, 0, id);
  arrange(folderId, list);
};

export const updatePage = (id: string, edit: PageEdit): void => {
  const edits = readJSON<Record<string, PageEdit>>(EDITS_KEY, {});
  writeJSON(EDITS_KEY, { ...edits, [id]: { ...edits[id], ...edit } });
};

export const renameFolder = (id: string, name: string): void => updatePage(id, { name });

/**
 * Deletes a folder and moves its pages and documents to the top of Pages —
 * never with it: a folder is only a name, and deleting a name should not take
 * the work filed under it. Returns how many moved, for the confirmation.
 */
export const removeFolder = (id: string): number => {
  const inside = readEntries().filter((e) => e.kind !== 'folder' && e.folderId === id);
  inside.forEach((p) => updatePage(p.id, { folderId: null }));
  writeJSON(REMOVED_KEY, [...readJSON<string[]>(REMOVED_KEY, []), id]);
  return inside.length;
};

/** Deletes a page or document and, unless told not to, leaves a note so the next screen confirms it. */
export const removePage = (id: string, title: string, note = true): void => {
  writeJSON(REMOVED_KEY, [...readJSON<string[]>(REMOVED_KEY, []), id]);
  // Its images and files (a document: its file) go with it. Not awaited: the delete is already
  // done as far as the reader is concerned, and IndexedDB finishes on its own.
  if (typeof indexedDB !== 'undefined') void deletePageFiles(id);
  if (!note) return;
  try {
    sessionStorage.setItem(JUST_ADDED_KEY, JSON.stringify({ kind: 'deleted', label: title } satisfies JustAdded));
  } catch {
    /* no confirmation, the delete still happened */
  }
};

export const readFolders = (): CustomFolder[] =>
  readEntries().filter((e): e is CustomFolder => e.kind === 'folder');

// With custom pages switched off there IS no page behind any link — the page
// view, its files and its actions all read this, so all three say "not found"
// together, the same as a link to a deleted page.
export const findItem = (id: string): CustomItem | undefined =>
  readPagesEnabled()
    ? readEntries().find((e): e is CustomItem => e.kind !== 'folder' && e.id === id)
    : undefined;

export const findPage = (id: string): CustomPage | undefined => {
  const item = findItem(id);
  return item?.kind === 'page' ? item : undefined;
};

export const findDocument = (id: string): CustomDocument | undefined => {
  const item = findItem(id);
  return item?.kind === 'document' ? item : undefined;
};

export const findFolder = (id: string | undefined): CustomFolder | undefined =>
  id ? readFolders().find((f) => f.id === id) : undefined;

/** A slug that no entry has ever used — the label, then -2, -3… Deleted ids
    stay taken, so a new page can never inherit a deleted one's edits. */
export const newEntryId = (label: string): string => {
  const base = label.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'page';
  const taken = new Set([...seedEntries, ...readAdded()].map((e) => e.id));
  let id = base;
  for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
  return id;
};

export const addEntry = (entry: CustomEntry, note?: JustAdded): void => {
  writeJSON(KEY, [...readAdded(), entry]);
  try {
    if (note) sessionStorage.setItem(JUST_ADDED_KEY, JSON.stringify(note));
  } catch {
    /* no confirmation, the add still happened */
  }
};

/** Reads the arrival note and clears it, so the confirmation shows once. */
export const takeJustAdded = (): JustAdded | null => {
  try {
    const raw = sessionStorage.getItem(JUST_ADDED_KEY);
    sessionStorage.removeItem(JUST_ADDED_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** The shape esa-sidebar-nav renders — EsaSidebarNavItem, plus the key AppLayout matches on. */
export interface PagesNavItem {
  key?: string;
  label: string;
  href?: string;
  icon?: string;
  group?: string;
  active?: boolean;
  disabled?: boolean;
  children?: PagesNavItem[];
}

// What an empty folder shows when opened. esa-sidebar-nav draws a row with no
// children as a plain inert row with no chevron, so an empty folder would look
// like a broken link rather than a folder; one dimmed child keeps it a folder
// and says why nothing is in it.
const EMPTY_FOLDER = 'No pages yet';

/**
 * The Pages group's rows: top-level entries in order, each folder carrying its
 * pages as children. `activeId` marks the page being read. Hrefs are based
 * here, because these rows are appended after AppLayout's own base pass.
 */
export const pagesNavItems = (entries: CustomEntry[], activeId?: string): PagesNavItem[] => {
  const pages = entries.filter((e): e is CustomItem => e.kind !== 'folder');
  const folderIds = new Set(entries.filter((e) => e.kind === 'folder').map((e) => e.id));
  const pageRow = (p: CustomItem, nested: boolean): PagesNavItem => ({
    key: `${p.kind}:${p.id}`,
    label: p.title,
    href: withBase(itemRoute(p)),
    // Children are indented under the folder's icon; a second icon there is
    // noise. At the top level the icon tells a page from a document.
    icon: nested ? undefined : p.kind === 'document' ? 'file-text' : 'file',
    group: PAGES_GROUP,
    active: p.id === activeId,
    disabled: false,
  });

  return entries.flatMap((e): PagesNavItem[] => {
    if (e.kind === 'folder') {
      const inside = pages.filter((p) => p.folderId === e.id);
      return [{
        key: `folder:${e.id}`,
        label: e.name,
        icon: 'folder',
        group: PAGES_GROUP,
        disabled: false,
        children: inside.length ? inside.map((p) => pageRow(p, true)) : [{ label: EMPTY_FOLDER, disabled: true }],
      }];
    }
    // A page whose folder is gone falls back to the top level rather than vanishing.
    return e.folderId && folderIds.has(e.folderId) ? [] : [pageRow(e, false)];
  });
};

/** The page or document a rail row's href opens, if it is one. */
export const pageIdFromHref = (href: string | null | undefined): string | undefined => {
  if (!href || !/\/prototypes\/pages\/(page|document)\b/.test(href)) return undefined;
  return new URL(href, location.href).searchParams.get('id') ?? undefined;
};

/**
 * A page's body as HTML for firma2-rich-text. Bodies saved before the editor
 * are plain text — those become one escaped paragraph per blank-line block.
 * HTML passes through as-is: the editor's schema cleans it on the way in.
 */
export const pageBodyHtml = (body: string | undefined): string => {
  const text = (body ?? '').trim();
  if (!text || text.startsWith('<')) return text;
  const escape = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return text
    .split(/\n\s*\n/)
    .map((p) => `<p>${escape(p.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('');
};
