// Inline formatting for a single line of form copy — a question's label or its
// help text: bold, italic and links, nothing else. The intake builder writes
// it (firma2-intake-builder's selection toolbar) and the member's page reads it
// (src/lib/intake-render.ts). Spec: .scratch/form-canvas/spec.md, "Formatted
// labels".
//
// EVERYTHING GOES THROUGH `sanitizeInline`, on the way in AND on the way out.
// What a contenteditable produces (Chrome writes <b>, <i>, <div>, <br>, spans
// with inline styles) is reduced to <strong>, <em> and <a href> with a safe
// protocol; every other tag is dropped and its text kept. Stored copy lives in
// localStorage, so it is sanitized again before it is rendered.

const SAFE_HREF = /^(https?:|mailto:)/i;

/** The formatted HTML (strong / em / a only) and its plain text. */
export const sanitizeInline = (html: string): { html: string; text: string } => {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return esc(node.textContent ?? '');
    if (!(node instanceof Element)) return '';
    const inner = [...node.childNodes].map(walk).join('');
    const tag = node.tagName.toLowerCase();
    if (tag === 'b' || tag === 'strong') return inner ? `<strong>${inner}</strong>` : '';
    if (tag === 'i' || tag === 'em') return inner ? `<em>${inner}</em>` : '';
    if (tag === 'a') {
      const href = node.getAttribute('href') ?? '';
      return SAFE_HREF.test(href) && inner ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${inner}</a>` : inner;
    }
    // A line break inside one line of copy is a space.
    if (tag === 'br') return ' ';
    return inner;
  };
  const out = [...tpl.content.childNodes].map(walk).join('').replace(/\s+/g, ' ').trim();
  return { html: out, text: tpl.content.textContent?.replace(/\s+/g, ' ').trim() ?? '' };
};

/** Does this HTML carry any formatting, or is it plain text? */
export const isFormatted = (html: string | undefined): boolean => !!html && /<(strong|em|a)\b/.test(html);

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
