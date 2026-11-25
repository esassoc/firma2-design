// The side-panel button for project rows built at runtime — map popups,
// tables repainted from browser edits. Clones the server-rendered
// firma2-project-peek-button that firma2-project-peek-layout leaves in a
// <template>, so it is the same esa-button markup a static row renders.
//
// Returns null on a page without the layout (no panel to open), so a caller
// simply leaves the button out.

const template = (): HTMLTemplateElement | null =>
  document.querySelector<HTMLTemplateElement>('template[data-project-peek-button]');

/** A fresh button that opens `slug` in the side panel. */
export const projectPeekButton = (slug: string, name: string): HTMLElement | null => {
  const source = template()?.content.querySelector<HTMLElement>('[data-open-project]');
  if (!source) return null;
  const el = source.cloneNode(true) as HTMLElement;
  el.dataset.openProject = slug;
  const button = el.querySelector('[aria-label]');
  button?.setAttribute('aria-label', `Preview ${name}`);
  button?.setAttribute('title', `Preview ${name}`);
  return el;
};

/** The same, as an HTML string — for libraries that take markup (Leaflet popups). */
export const projectPeekButtonHTML = (slug: string, name: string): string =>
  projectPeekButton(slug, name)?.outerHTML ?? '';
