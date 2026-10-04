// Custom pages — the workspace's own pages, listed under Pages in the app rail.
//
// Three kinds of entry, one level deep: a PAGE (a title and some text, opened
// at /prototypes/pages/page?id=…), a DOCUMENT (a title and one file — a PDF by
// default — opened at /prototypes/pages/document?id=…, where a PDF is read on
// the site) and a FOLDER (a name that groups pages and documents in the rail).
// esa-sidebar-nav nests exactly one level of children, so a folder holds pages
// and documents and never another folder — the model says so rather than
// letting the rail flatten a second level silently.
//
// The seeds below ship with every build so the section shows both kinds before
// anyone adds one. Entries added in the browser live in src/lib/custom-pages.ts.
// Invented content, not drawn from any client document.

export interface CustomFolder {
  id: string;
  kind: 'folder';
  name: string;
}

export interface CustomPage {
  id: string;
  kind: 'page';
  title: string;
  /** The folder it sits in. Omit for a page at the top of Pages. */
  folderId?: string;
  /** HTML from firma2-rich-text. Plain text (pages saved before the editor)
      is still read: blank lines separate its paragraphs — see pageBodyHtml. */
  body?: string;
}

/** The file behind a document. */
export interface DocumentFile {
  name: string;
  /** MIME type, e.g. application/pdf. */
  type: string;
  /** Bytes. */
  size: number;
  /**
   * A file shipped with the build (seeds), root-relative under public/.
   * Absent for a file added in the browser — that one is kept in IndexedDB
   * under the document's id (src/lib/page-files.ts, kind 'document').
   */
  src?: string;
}

export interface CustomDocument {
  id: string;
  kind: 'document';
  title: string;
  /** The folder it sits in. Omit for a document at the top of Pages. */
  folderId?: string;
  file: DocumentFile;
}

/** What a folder holds — a page or a document. */
export type CustomItem = CustomPage | CustomDocument;

export type CustomEntry = CustomFolder | CustomItem;

export const seedEntries: CustomEntry[] = [
  { id: 'field-guides', kind: 'folder', name: 'Field guides' },
  {
    id: 'monitoring-protocol',
    kind: 'page',
    title: 'Monitoring protocol',
    folderId: 'field-guides',
    body:
      '<p>Photo points are revisited every <strong>spring and fall</strong>, from the same stake, facing the same bearing.</p>' +
      '<h2>At each point</h2>' +
      '<ol><li><p>Take one photo along the bearing and one of the ground.</p></li>' +
      '<li><p>Record vegetation cover in the four quadrants around the stake.</p></li>' +
      '<li><p>Note anything that changed since the last visit.</p></li></ol>' +
      '<p>Upload the photos to the project the same week.</p>',
  },
  {
    id: 'site-visit-checklist',
    kind: 'page',
    title: 'Site visit checklist',
    folderId: 'field-guides',
    body:
      '<p>Confirm landowner access two days ahead.</p>' +
      '<h2>Bring</h2>' +
      '<ul><li><p>The site map</p></li><li><p>A GPS unit</p></li><li><p>The last visit’s notes</p></li></ul>' +
      '<p>Before leaving, note anything that needs a follow-up visit on the project record.</p>',
  },
  {
    id: 'riparian-planting-guide',
    kind: 'document',
    title: 'Riparian planting guide',
    folderId: 'field-guides',
    file: {
      name: 'riparian-planting-guide.pdf',
      type: 'application/pdf',
      size: 61890,
      src: '/documents/riparian-planting-guide.pdf',
    },
  },
  {
    id: 'funding-calendar',
    kind: 'page',
    title: 'Funding calendar',
    body:
      '<p>State grant applications open in <strong>January</strong> and close in <strong>March</strong>.</p>' +
      '<blockquote><p>Federal match reports are due 30 days after each quarter ends.</p></blockquote>',
  },
];

/** A page's folder when it has none — it sits at the top of Pages. Shared by
    Add page's select and the page's own Folder field, so the two agree. */
export const NO_FOLDER_LABEL = 'No folder';

/** The rail group the entries sit under. */
export const PAGES_GROUP = 'Pages';

/** Where a page is opened. Base-less, like every route in firma2-nav. */
export const pageRoute = (id: string): string => `/prototypes/pages/page?id=${encodeURIComponent(id)}`;

/** Where a document is opened. Base-less, like pageRoute. */
export const documentRoute = (id: string): string => `/prototypes/pages/document?id=${encodeURIComponent(id)}`;

/** Where either kind is opened. */
export const itemRoute = (item: Pick<CustomItem, 'id' | 'kind'>): string =>
  item.kind === 'document' ? documentRoute(item.id) : pageRoute(item.id);

/** What Add document takes. PDF first: it is the one the site reads in place. */
export const DOCUMENT_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.rtf,.odt,.ods,.odp';

/** A PDF is read on the site; every other format is downloaded. */
export const isPdf = (file: Pick<DocumentFile, 'name' | 'type'>): boolean =>
  file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
