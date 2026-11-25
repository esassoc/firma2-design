// bcn-radio-group — esa-radio-group, plus a line of description under each
// option. For a choice whose options need a sentence to be understood before
// picking (Project source: what "Created in ProjectFirma" commits everyone to).
//
// bcn-lego-checked: esa-radio-group is the lego and this IS esa-radio-group —
// a subclass, so its circle, keyboard model, form association, legend naming
// and error handling are the hub's, untouched. All it adds is the description:
// the hub's option type is { label, value, disabled } and nothing renders
// under a label (catalog walked; only esa-command-palette has per-item
// descriptions, and it is not a form control). Beacon is not cloned on this
// machine. Requested upstream as esassoc/ecology#42 (`description` on
// esa-radio-group options); once it ships, swap the tag and delete this file.
//
// HOW: after each of the base class's renders, a description <span> is placed
// in each option's <label> and the radio points at it with aria-describedby —
// the name stays the short label, the sentence is read after it. Lit leaves
// nodes it did not render alone, and it binds no aria-describedby on the
// radio, so neither is undone by the next render.
//
// THE CONTRACT: exactly esa-radio-group's, with an optional `description` on
// each option.
//   el.options = [{ value: 'app', label: 'Created in ProjectFirma', description: '…' }, …];

import { EsaRadioGroup } from '@esa/ecology/esa-radio-group';

interface DescribedOption {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
}

// ADOPTED, NOT `static styles`: extending the base's styles would need `css`
// from lit, which this spoke does not depend on (the hub does — it resolves in
// dev through the symlink and fails the build). A constructed sheet added to
// the shadow root is the spoke's established way into a lego's shadow DOM
// (src/lib/side-dialog-fix.ts), and needs no lit.
const EXTRA = `
  /* Options with a sentence each need more air between them than bare labels
     do, or the sentence reads as belonging to the next option. */
  .items { gap: var(--spacing-400, 16px); }

  /* The base lays an option out as circle + label in a row. A grid keeps that
     first row as it was and puts the description under the LABEL, not under
     the circle. */
  .item {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: var(--spacing-200, 8px);
  }

  .item-desc {
    grid-column: 2;
    margin-block-start: var(--spacing-100, 4px);
    color: var(--color-content-default-secondary, #646464);
  }
`;
let sheet: CSSStyleSheet | null = null;

export class BcnRadioGroup extends EsaRadioGroup {
  #styled = false;

  updated(): void {
    super.updated();
    this.#adoptStyles();
    this.#describe();
  }

  #adoptStyles(): void {
    if (this.#styled || !this.shadowRoot) return;
    sheet ??= new CSSStyleSheet();
    if (!sheet.cssRules.length) sheet.replaceSync(EXTRA);
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, sheet];
    this.#styled = true;
  }

  #describe(): void {
    const items = this.renderRoot.querySelectorAll<HTMLElement>('label.item');
    (this.options as DescribedOption[]).forEach((option, i) => {
      const item = items[i];
      if (!item) return;
      const radio = item.querySelector<HTMLElement>('[role="radio"]');
      let desc = item.querySelector<HTMLElement>('.item-desc');
      if (!option.description) {
        desc?.remove();
        radio?.removeAttribute('aria-describedby');
        return;
      }
      if (!desc) {
        desc = document.createElement('span');
        desc.className = 'item-desc typography-body-md';
        desc.id = `opt-${i}-desc`;
        item.append(desc);
      }
      desc.textContent = option.description;
      radio?.setAttribute('aria-describedby', desc.id);
    });
  }
}

if (!customElements.get('bcn-radio-group')) {
  customElements.define('bcn-radio-group', BcnRadioGroup);
}
