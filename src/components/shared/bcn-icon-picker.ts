// bcn-icon-picker — choose one icon from the whole Hugeicons free set: a
// shortlist to start from, and a search over all ~6,000 glyphs.
//
// bcn-lego-checked: no esa- component picks an icon (catalog walked:
// esa-button-toggle is a fixed, non-wrapping segment row; esa-select and
// esa-combobox draw text options only). Beacon is not cloned on this machine.
// Composed of legos: the search is esa-text-field and every glyph is an
// EsaButton the consumer supplies in a <template>, cloned with its glyph
// swapped — the same contract as bcn-sortable-list's grip. Due upstream as a
// /request-lego (`esa-icon-picker`) if a second spoke needs it.
//
// THE SET LOADS ON FIRST SEARCH, NOT WITH THE PAGE (src/lib/hugeicon-markup.ts
// loadCatalog: ~1.4 MB gzipped). The shortlist is the consumer's, with its
// markup inline, so a picker that is never searched costs nothing.
//
// A RADIO GROUP, like esa-color-picker's swatches: one tab stop, arrows move
// AND choose (Left/Right by one, Up/Down by a row, Home/End), and the choice
// is announced by name. Results are capped at RESULT_CAP — a grid of
// thousands is not scannable; the count says to keep typing.
//
// THE CONTRACT
//
//   <bcn-icon-picker label="Icon">
//     <template data-icon-option><EsaButton variant="chrome" size="md" iconOnly icon="star" …/></template>
//   </bcn-icon-picker>
//   picker.suggestions = [{ name, label, paths }, …];   // the shortlist
//   picker.value = 'Progress03Icon';                    // the current choice
//   picker.addEventListener('change', (e) => e.detail); // { name, label, paths }
//
// `--bcn-icon-picker-color` tints the glyphs (e.g. the colour being chosen
// beside it), so the shortlist previews the result.

import { announce } from '@esa/ecology/announcer';
import { loadCatalog } from '../../lib/hugeicon-markup';
import type { CatalogIcon } from '../../lib/hugeicon-markup';

const RESULT_CAP = 60;
const DEBOUNCE_MS = 150;

const STYLES = `
  bcn-icon-picker { display: block; }
  bcn-icon-picker [data-icon-grid] {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(2.5rem, 1fr));
    gap: var(--spacing-100, 0.25rem);
    max-height: 13.5rem;
    overflow-y: auto;
    color: var(--bcn-icon-picker-color, currentColor);
  }
  bcn-icon-picker [data-icon-grid] button[aria-checked='true'] {
    background: var(--color-background-elevation-sunken, #f0f0f0);
    box-shadow: inset 0 0 0 2px var(--bcn-icon-picker-color, currentColor);
  }
  bcn-icon-picker [data-icon-status],
  bcn-icon-picker [data-icon-selected] {
    color: var(--color-text-secondary);
  }
`;
let styled = false;
function ensureStyles(): void {
  if (styled) return;
  const style = document.createElement('style');
  style.dataset.bcnIconPicker = '';
  style.textContent = STYLES;
  document.head.appendChild(style);
  styled = true;
}

type Field = HTMLElement & { value?: unknown };

export class BcnIconPicker extends HTMLElement {
  #suggestions: CatalogIcon[] = [];
  #value = '';
  #selected: CatalogIcon | null = null;
  #shown: CatalogIcon[] = [];
  #built = false;
  #timer: ReturnType<typeof setTimeout> | null = null;
  #searchToken = 0;
  #grid!: HTMLElement;
  #status!: HTMLElement;
  #selectedLine!: HTMLElement;
  #search!: Field;

  get suggestions(): CatalogIcon[] {
    return this.#suggestions;
  }
  set suggestions(list: CatalogIcon[]) {
    this.#suggestions = list;
    if (!this.#selected) this.#selected = list.find((i) => i.name === this.#value) ?? null;
    if (this.#built && !this.#query()) this.#paint(list);
  }

  get value(): string {
    return this.#value;
  }
  set value(name: string) {
    this.#value = name;
    this.#selected = [...this.#shown, ...this.#suggestions].find((i) => i.name === name) ?? this.#selected;
    if (this.#built) this.#sync();
  }

  connectedCallback(): void {
    ensureStyles();
    if (this.#built) return;
    this.#built = true;

    this.#search = document.createElement('esa-text-field') as Field;
    this.#search.setAttribute('label', this.getAttribute('label') ?? 'Icon');
    this.#search.setAttribute('size', 'md');
    this.#search.setAttribute('placeholder', 'Search 6,000 icons');
    // The field's own `change` (every keystroke, bubbling and composed) must
    // not escape: this element's `change` means "an icon was chosen".
    this.#search.addEventListener('change', (e) => {
      e.stopPropagation();
      this.#onSearch();
    });

    this.#grid = document.createElement('div');
    this.#grid.setAttribute('data-icon-grid', '');
    this.#grid.setAttribute('role', 'radiogroup');
    this.#grid.setAttribute('aria-label', this.getAttribute('label') ?? 'Icon');
    this.#grid.addEventListener('keydown', this.#onKeydown);

    this.#status = document.createElement('p');
    this.#status.setAttribute('data-icon-status', '');
    this.#status.className = 'typography-body-sm';
    this.#status.hidden = true;

    this.#selectedLine = document.createElement('p');
    this.#selectedLine.setAttribute('data-icon-selected', '');
    this.#selectedLine.className = 'typography-body-sm';

    const wrap = document.createElement('div');
    wrap.className = 'stack';
    wrap.dataset.gap = 'sm';
    wrap.append(this.#search, this.#grid, this.#status, this.#selectedLine);
    this.append(wrap);
    this.#paint(this.#suggestions);
  }

  #query(): string {
    return String(this.#search?.value ?? '').trim().toLowerCase();
  }

  // ---- search ---------------------------------------------------------------------
  #onSearch(): void {
    if (this.#timer) clearTimeout(this.#timer);
    this.#timer = setTimeout(() => void this.#runSearch(), DEBOUNCE_MS);
  }

  async #runSearch(): Promise<void> {
    const query = this.#query();
    const token = ++this.#searchToken;
    if (!query) {
      this.#status.hidden = true;
      this.#paint(this.#suggestions);
      return;
    }
    this.#status.hidden = false;
    this.#status.textContent = 'Loading icons…';
    const all = await loadCatalog();
    if (token !== this.#searchToken) return;
    const words = query.split(/\s+/);
    const matches = all.filter((icon) => {
      const hay = `${icon.label} ${icon.name}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
    // Names that START with the query read as the best answers.
    matches.sort((a, b) => Number(!a.label.toLowerCase().startsWith(words[0])) - Number(!b.label.toLowerCase().startsWith(words[0])));
    const shown = matches.slice(0, RESULT_CAP);
    this.#paint(shown);
    const text =
      matches.length === 0
        ? `No icons match “${query}”.`
        : matches.length > RESULT_CAP
          ? `Showing ${RESULT_CAP} of ${matches.length}. Keep typing to narrow.`
          : `${matches.length} ${matches.length === 1 ? 'icon' : 'icons'}.`;
    this.#status.textContent = text;
    announce(text);
  }

  // ---- grid -----------------------------------------------------------------------
  #paint(list: CatalogIcon[]): void {
    const template = this.querySelector<HTMLTemplateElement>(':scope > template[data-icon-option]');
    if (!template || !this.#grid) return;
    this.#shown = list;
    this.#grid.replaceChildren(
      ...list.map((icon) => {
        const node = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const button = (node.matches('button') ? node : node.querySelector('button'))!;
        const svg = node.querySelector('svg');
        if (svg) svg.innerHTML = icon.paths;
        button.dataset.iconName = icon.name;
        button.setAttribute('role', 'radio');
        button.setAttribute('aria-label', icon.label);
        button.setAttribute('title', icon.label);
        button.addEventListener('click', () => this.#choose(icon));
        return node;
      }),
    );
    this.#sync();
  }

  #buttons(): HTMLButtonElement[] {
    return Array.from(this.#grid.querySelectorAll<HTMLButtonElement>('button[data-icon-name]'));
  }

  /** aria-checked, the single tab stop, and the "Selected" line. */
  #sync(): void {
    const buttons = this.#buttons();
    const current = buttons.find((b) => b.dataset.iconName === this.#value);
    buttons.forEach((b) => {
      b.setAttribute('aria-checked', String(b === current));
      b.tabIndex = b === (current ?? buttons[0]) ? 0 : -1;
    });
    this.#selectedLine.textContent = this.#selected ? `Selected: ${this.#selected.label}` : '';
  }

  #choose(icon: CatalogIcon, focus = false): void {
    this.#value = icon.name;
    this.#selected = icon;
    this.#sync();
    if (focus) this.#buttons().find((b) => b.dataset.iconName === icon.name)?.focus();
    this.dispatchEvent(new CustomEvent('change', { detail: icon, bubbles: true }));
  }

  #onKeydown = (event: KeyboardEvent): void => {
    const buttons = this.#buttons();
    const from = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (from < 0) return;
    // Columns = how many buttons share the first row's top edge.
    const top = buttons[0].offsetTop;
    const cols = Math.max(1, buttons.filter((b) => b.offsetTop === top).length);
    const moves: Record<string, number> = {
      ArrowLeft: from - 1,
      ArrowRight: from + 1,
      ArrowUp: from - cols,
      ArrowDown: from + cols,
      Home: 0,
      End: buttons.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const to = Math.max(0, Math.min(buttons.length - 1, moves[event.key]));
    const icon = this.#shown[to];
    if (icon) this.#choose(icon, true);
  };
}

if (!customElements.get('bcn-icon-picker')) {
  customElements.define('bcn-icon-picker', BcnIconPicker);
}
