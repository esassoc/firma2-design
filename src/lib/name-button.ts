// Name a cloned icon-only EsaButton for the row it acts on — "Delete Upper
// meadow", not "Delete" six times over.
//
// EsaButton renders a wrapper <span> around the real <button> (or <a>), and
// `data-*` / `aria-*` land on the inner one. A clone's root is the wrapper,
// where an aria-label names nothing, so this finds the control. `title`
// follows the name: it is the hover tooltip icon-only chrome relies on,
// exactly as EsaButton's own `label` prop sets both.
export function nameButton(el: HTMLElement, name: string): void {
  const control = el.matches('button, a') ? el : (el.querySelector<HTMLElement>('button, a') ?? el);
  control.setAttribute('aria-label', name);
  control.setAttribute('title', name);
}
