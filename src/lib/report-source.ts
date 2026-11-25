// The runtime half of firma2-report-source
// (src/components/shared/firma2-report-source.astro): paint a document into the
// pane, and move it to the passage a change was read from.
//
// TWO KINDS OF DOCUMENT, ONE PANE.
//   - PASSAGES: a sample or pasted text has no file. Its pages of passages are
//     the document, drawn as text, and the passage a change came from is
//     marked and scrolled to.
//   - A FILE: a stored PDF is shown in the browser's own viewer, opened at the
//     page the reading gave. Any other file (a spreadsheet, a Word document)
//     has no viewer here, so the pane shows the quote and says so.
//
// The pane never invents a passage: with nothing to point at it shows the
// document from the top.

import type { ImportDocument } from '../data/firma2-report-import';

export interface SourceDocument {
  name: string;
  pages?: ImportDocument['pages'];
  /** An object URL for a stored file. */
  fileUrl?: string;
  fileType?: string;
}

export interface SourceAt {
  passage?: string;
  page?: number;
  /** The words read, shown when the document itself cannot be. */
  quote?: string;
}

const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const isPdf = (doc: SourceDocument): boolean => /pdf/i.test(doc.fileType ?? '') || /\.pdf$/i.test(doc.name);

/** Draw `doc` into the pane. Call once per document; move within it with showAt(). */
export const paintSource = (pane: HTMLElement, doc: SourceDocument): void => {
  const name = pane.querySelector<HTMLElement>('[data-source-name]');
  const body = pane.querySelector<HTMLElement>('[data-source-body]');
  if (!name || !body) return;
  name.textContent = doc.name;
  pane.dataset.sourceKind = doc.pages ? 'passages' : doc.fileUrl && isPdf(doc) ? 'pdf' : 'none';

  if (doc.pages) {
    body.innerHTML = doc.pages
      .map(
        (page) => `
        <section class="firma2-report-source__page stack" data-gap="md">
          <p class="firma2-report-source__page-label typography-body-sm">${esc(page.label)}</p>
          ${page.passages
            .map(
              (passage) => `
            <div class="firma2-report-source__passage stack" data-gap="2xs" data-passage="${esc(passage.id)}">
              ${passage.heading ? `<p class="typography-label-md-strong">${esc(passage.heading)}</p>` : ''}
              ${passage.lines.map((line) => `<p class="typography-body-md">${esc(line)}</p>`).join('')}
            </div>`,
            )
            .join('')}
        </section>`,
      )
      .join('');
    return;
  }

  if (doc.fileUrl && isPdf(doc)) {
    body.innerHTML = `<iframe class="firma2-report-source__file" title="${esc(doc.name)}" src="${esc(doc.fileUrl)}"></iframe>`;
    return;
  }

  body.innerHTML = `
    <div class="stack" data-gap="sm">
      <p class="typography-body-md">This file can’t be shown here.</p>
      <p class="firma2-report-source__quote typography-body-md" data-source-quote hidden></p>
    </div>`;
};

/** Move the pane to where a change was read from. */
export const showAt = (pane: HTMLElement, doc: SourceDocument, at: SourceAt): void => {
  const body = pane.querySelector<HTMLElement>('[data-source-body]');
  if (!body) return;

  body.querySelectorAll<HTMLElement>('[data-passage][data-current]').forEach((el) => el.removeAttribute('data-current'));
  if (at.passage) {
    const target = body.querySelector<HTMLElement>(`[data-passage="${CSS.escape(at.passage)}"]`);
    if (target) {
      target.setAttribute('data-current', '');
      // Scroll the pane, never the page: the changes beside it must stay put.
      const top = target.offsetTop - body.offsetTop - 16;
      body.scrollTo({ top: Math.max(top, 0), behavior: 'auto' });
    }
  }

  const frame = body.querySelector<HTMLIFrameElement>('iframe');
  if (frame && doc.fileUrl && at.page) {
    const next = `${doc.fileUrl}#page=${at.page}`;
    if (frame.getAttribute('src') !== next) frame.setAttribute('src', next);
  }

  const quote = body.querySelector<HTMLElement>('[data-source-quote]');
  if (quote) {
    quote.textContent = at.quote ?? '';
    quote.hidden = !at.quote;
  }
};
