// Files kept with a custom page — the images placed in its text and the
// documents attached under it — in this viewer's IndexedDB.
//
// IndexedDB, NOT localStorage: localStorage holds about 5 MB of strings for the
// whole site, which one photograph from a phone fills. IndexedDB stores the
// Blob itself and is sized for this. Same contract as the rest of the
// prototype's storage otherwise: this browser only, nothing reaches a server,
// and every call fails soft — a blocked or missing database means files are
// not kept, never that the page breaks.
//
// Two kinds share one store. `inline` files — images and files placed in a
// page's text — are referenced from its HTML by `data-file-id` (see
// firma2-rich-text); a `document` file is the one file behind a document entry
// (keyed by the document's id, so removePage's cleanup takes it too).
// `attachment` is a retired kind: a page's separate Files list, now folded into
// its text (adoptAttachments).

import type { CustomDocument } from '../data/firma2-pages';
import { withBase } from './base';

export type PageFileKind = 'inline' | 'attachment' | 'document';

export interface PageFile {
  id: string;
  pageId: string;
  kind: PageFileKind;
  name: string;
  type: string;
  size: number;
  blob: Blob;
  /** ISO timestamp. */
  added: string;
}

const DB = 'firma2-page-files';
const STORE = 'files';

let opening: Promise<IDBDatabase> | null = null;
const open = (): Promise<IDBDatabase> => {
  opening ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore(STORE, { keyPath: 'id' });
      store.createIndex('pageId', 'pageId');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return opening;
};

const run = async <T,>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T | undefined> => {
  try {
    const db = await open();
    return await new Promise<T>((resolve, reject) => {
      const req = fn(db.transaction(STORE, mode).objectStore(STORE));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return undefined;
  }
};

export const putFile = async (pageId: string, kind: PageFileKind, file: File): Promise<PageFile | undefined> => {
  const record: PageFile = {
    id: crypto.randomUUID(),
    pageId,
    kind,
    name: file.name,
    type: file.type,
    size: file.size,
    blob: file,
    added: new Date().toISOString(),
  };
  const ok = await run('readwrite', (s) => s.put(record));
  return ok === undefined ? undefined : record;
};

export const listFiles = async (pageId: string, kind?: PageFileKind): Promise<PageFile[]> => {
  const all = (await run<PageFile[]>('readonly', (s) => s.index('pageId').getAll(pageId))) ?? [];
  return all.filter((f) => !kind || f.kind === kind).sort((a, b) => a.added.localeCompare(b.added));
};

export const deleteFile = async (id: string): Promise<void> => {
  await run('readwrite', (s) => s.delete(id));
};

export const deletePageFiles = async (pageId: string): Promise<void> => {
  for (const f of await listFiles(pageId)) await deleteFile(f.id);
};

// One object URL per file for the life of the page, so the same image is not
// decoded into memory twice and a URL handed out stays valid.
const urls = new Map<string, string>();
export const fileUrl = (file: PageFile): string => {
  let url = urls.get(file.id);
  if (!url) {
    url = URL.createObjectURL(file.blob);
    urls.set(file.id, url);
  }
  return url;
};

/**
 * Points every stored image in a page's HTML at this session's copy of its
 * file. Saved HTML carries a `blob:` URL that died with the tab it was made
 * in; `data-file-id` is what survives. Parsed in an inert <template>, so
 * nothing in the HTML runs here — firma2-rich-text's schema cleans it after.
 */
export const resolveInlineImages = async (pageId: string, html: string): Promise<string> => {
  if (!html.includes('data-file-id')) return html;
  const files = new Map((await listFiles(pageId, 'inline')).map((f) => [f.id, f]));
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  tpl.content.querySelectorAll<HTMLImageElement>('img[data-file-id]').forEach((img) => {
    const file = files.get(img.dataset.fileId ?? '');
    if (file) img.src = fileUrl(file);
    else img.remove();
  });
  return tpl.innerHTML;
};

/** Inline images no longer referenced by the page's text are deleted. */
export const pruneInlineImages = async (pageId: string, html: string): Promise<void> => {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  const used = new Set(Array.from(tpl.content.querySelectorAll<HTMLElement>('[data-file-id]')).map((el) => el.dataset.fileId));
  for (const f of await listFiles(pageId, 'inline')) if (!used.has(f.id)) await deleteFile(f.id);
};

/**
 * Where a document's file is read from: the build's own copy for a seed, this
 * browser's stored copy for one added here. Undefined when the stored copy is
 * gone (site data cleared) — the document view says so.
 */
export const documentFileUrl = async (doc: CustomDocument): Promise<string | undefined> => {
  if (doc.file.src) return withBase(doc.file.src);
  const [stored] = (await listFiles(doc.id, 'document')).slice(-1);
  return stored && fileUrl(stored);
};

/** Keeps a document's file, replacing whatever file it had. */
export const putDocumentFile = async (docId: string, file: File): Promise<boolean> => {
  const before = await listFiles(docId, 'document');
  const stored = await putFile(docId, 'document', file);
  if (!stored) return false;
  for (const f of before) await deleteFile(f.id);
  return true;
};

/** The saved form of a file placed in a page's text — what firma2-rich-text's file block parses. */
export const fileEmbedHtml = (file: Pick<PageFile, 'id' | 'name' | 'type' | 'size'>): string => {
  const div = document.createElement('div');
  div.setAttribute('data-file-embed', '');
  div.setAttribute('data-file-id', file.id);
  div.setAttribute('data-name', file.name);
  div.setAttribute('data-type', file.type);
  div.setAttribute('data-size', String(file.size));
  return div.outerHTML;
};

/**
 * Pages used to keep files in a separate list under the text. Files now live
 * only in the text, so any this browser still holds that way become inline
 * files — the same records, re-filed — and are returned for the page to place
 * at the end of its text. Nothing is lost; each is moved once.
 */
export const adoptAttachments = async (pageId: string): Promise<PageFile[]> => {
  const old = await listFiles(pageId, 'attachment');
  const moved: PageFile[] = [];
  for (const f of old) {
    const record: PageFile = { ...f, kind: 'inline' };
    if ((await run('readwrite', (s) => s.put(record))) !== undefined) moved.push(record);
  }
  return moved;
};

/** "2.4 MB", "380 KB" — for a file row's size. */
export const formatSize = (bytes: number): string =>
  bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`;
