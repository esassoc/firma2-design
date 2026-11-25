// bcn-insert-menu — the list of what can be added at a spot on a builder
// canvas, opened by typing `/` on a blank line or by pressing a +. One menu for
// every builder (docs/adr/0001-one-editing-grammar-for-builder-canvases.md):
// the intake form builder and the custom-page editor open this same element,
// so adding reads the same everywhere.
//
// GROUPED, FILTERED AS YOU TYPE, NOTHING HIDDEN. Options sit under their group
// heading. Typing after `/` narrows them by label or group. An option that
// can't be added here (a standard question already on the form) stays listed,
// greyed and carrying a note ("In form"), so the list always shows everything
// there is. The arrow keys pass over it.
//
// TWO WAYS TO DRIVE IT. From a caret: the owner (the contenteditable line, or
// the editor) keeps focus and forwards its keys through `handleKey(e)`; this
// sets aria-activedescendant on the owner, the combobox contract. From a +:
// no owner, so the menu takes focus itself and handles its own keys until it
// closes — typing filters it, Backspace un-types.
//
// THE CONTRACT
//   el.items = [{ id, label, group, disabled?, note? }]
//   el.open(anchor, { owner?, query? })   anchor: an Element or a DOMRect
//   el.filter(query)                      repaint for what is typed after `/`
//   el.close()
//   el.handleKey(e) → true when the key was the menu's
//   out `insert-choose` {id} · `insert-close` (Escape, outside click, choose)
//   A trigger outside the menu marked [data-insert-trigger] does not count as
//   an outside click (the + that opens it).
//
// bcn-lego-checked: walked `ls node_modules/@esa/ecology/src/components/`.
// esa-popover anchors only to its own slotted trigger (show()/hide() are
// private), esa-dropdown-menu likewise and cannot filter, esa-combobox is a
// form field, esa-command-palette is a modal. None opens at a text caret. Beacon
// is not cloned here. The surface takes esa-popover's tokens and the options
// take esa-select's states, token for token. Due upstream with /request-lego.
// Extracted from firma2-intake-builder's slash menu (2026-10-19).

export interface InsertItem {
  id: string;
  label: string;
  group: string;
  disabled?: boolean;
  /** Shown at the end of a disabled option: why it can't be added. */
  note?: string;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const STYLES = `
  bcn-insert-menu {
    position: fixed;
    z-index: var(--z-popover, 1000);
    min-width: 16rem;
    max-height: 22rem;
    overflow-y: auto;
    padding: var(--spacing-100);
    background: var(--color-background-elevation-raised);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    box-shadow: var(--elevation-4, 0 8px 24px rgb(0 0 0 / 0.12));
  }
  bcn-insert-menu:not([open]) { display: none; }
  bcn-insert-menu:focus-visible {
    outline: 2px solid var(--color-border-default-focus);
    outline-offset: 2px;
  }
  bcn-insert-menu .bcn-insert-menu__group {
    margin: 0;
    padding: var(--spacing-200) var(--spacing-300) var(--spacing-100);
    color: var(--color-text-secondary);
  }
  bcn-insert-menu .bcn-insert-menu__option {
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-300);
    padding: var(--spacing-200) var(--spacing-300);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background var(--transition-fast, 150ms ease);
  }
  bcn-insert-menu .bcn-insert-menu__option[aria-selected='true'] {
    background: var(--color-background-elevation-sunken);
  }
  bcn-insert-menu .bcn-insert-menu__option[aria-disabled='true'] {
    color: var(--color-text-secondary);
    cursor: default;
  }
  bcn-insert-menu .bcn-insert-menu__empty {
    margin: 0;
    padding: var(--spacing-200) var(--spacing-300);
    color: var(--color-text-secondary);
  }
  @media (prefers-reduced-motion: reduce) {
    bcn-insert-menu .bcn-insert-menu__option { transition: none; }
  }
`;
let styled = false;
function ensureStyles(): void {
  if (styled) return;
  const style = document.createElement('style');
  style.dataset.bcnInsertMenu = '';
  style.textContent = STYLES;
  document.head.appendChild(style);
  styled = true;
}

let menus = 0;

export class BcnInsertMenu extends HTMLElement {
  items: InsertItem[] = [];
  #shown: InsertItem[] = [];
  #active = 0;
  #owner: HTMLElement | null = null;
  #query = '';
  #prefix = `bcn-insert-${++menus}`;

  connectedCallback(): void {
    ensureStyles();
    this.setAttribute('role', 'listbox');
    if (!this.id) this.id = this.#prefix;
    this.addEventListener('mousedown', (e) => e.preventDefault()); // the owner keeps its caret
    this.addEventListener('mousemove', this.#onHover);
    this.addEventListener('click', this.#onClick);
    this.addEventListener('keydown', (e) => this.handleKey(e));
    document.addEventListener('pointerdown', this.#onOutside, true);
  }

  disconnectedCallback(): void {
    document.removeEventListener('pointerdown', this.#onOutside, true);
  }

  get isOpen(): boolean {
    return this.hasAttribute('open');
  }

  get owner(): HTMLElement | null {
    return this.#owner;
  }

  open(anchor: Element | DOMRect, { owner, query = '' }: { owner?: HTMLElement; query?: string } = {}): void {
    this.#owner?.setAttribute('aria-expanded', 'false');
    this.#owner = owner ?? null;
    this.#active = -1;
    this.setAttribute('open', '');
    this.filter(query);
    const r = anchor instanceof Element ? anchor.getBoundingClientRect() : anchor;
    // Below the anchor, or above it when it would run off the window.
    const h = this.offsetHeight;
    const below = r.bottom + 4;
    this.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - this.offsetWidth - 8))}px`;
    this.style.top = `${below + h > window.innerHeight - 8 && r.top - h - 4 > 8 ? r.top - h - 4 : below}px`;
    if (owner) {
      owner.setAttribute('aria-controls', this.id);
      owner.setAttribute('aria-expanded', 'true');
    } else {
      this.tabIndex = -1;
      this.focus();
    }
  }

  filter(query: string): void {
    this.#query = query;
    const q = query.trim().toLowerCase();
    this.#shown = this.items.filter((i) => !q || i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q));
    if (this.#active < 0 || !this.#enabled(this.#active)) this.#active = this.#shown.findIndex((i) => !i.disabled);
    this.#paint();
  }

  close(): void {
    if (!this.isOpen) return;
    this.removeAttribute('open');
    this.#owner?.setAttribute('aria-expanded', 'false');
    this.#owner?.removeAttribute('aria-activedescendant');
    this.#owner = null;
    this.dispatchEvent(new CustomEvent('insert-close'));
  }

  handleKey(e: KeyboardEvent): boolean {
    if (!this.isOpen) return false;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.#step(e.key === 'ArrowDown' ? 1 : -1);
      return true;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      this.#choose(this.#active);
      return true;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.close();
      return true;
    }
    if (e.key === 'Tab') this.close();
    // Opened from a +, nothing holds a caret: typing filters here, as `/` does on a line.
    if (!this.#owner && !e.metaKey && !e.ctrlKey && !e.altKey && (e.key.length === 1 || e.key === 'Backspace')) {
      e.preventDefault();
      this.filter(e.key === 'Backspace' ? this.#query.slice(0, -1) : this.#query + e.key);
      return true;
    }
    return false;
  }

  #enabled(i: number): boolean {
    return i >= 0 && i < this.#shown.length && !this.#shown[i].disabled;
  }

  #step(by: 1 | -1): void {
    const n = this.#shown.length;
    if (!this.#shown.some((i) => !i.disabled)) return;
    let i = this.#active;
    do i = (i + by + n) % n;
    while (!this.#enabled(i));
    this.#active = i;
    this.#paint();
  }

  #choose(i: number): void {
    if (!this.#enabled(i)) return;
    const { id } = this.#shown[i];
    this.close();
    this.dispatchEvent(new CustomEvent('insert-choose', { detail: { id } }));
  }

  #paint(): void {
    if (!this.#shown.length) {
      this.innerHTML = `<p class="bcn-insert-menu__empty typography-body-md">Nothing matches “${esc(this.#query)}”.</p>`;
      this.#owner?.removeAttribute('aria-activedescendant');
      return;
    }
    let html = '';
    let group = '';
    this.#shown.forEach((item, i) => {
      if (item.group !== group) {
        group = item.group;
        html += `<p class="bcn-insert-menu__group typography-label-md-strong" role="presentation">${esc(group)}</p>`;
      }
      const note = item.note ? `<span class="typography-body-sm">${esc(item.note)}</span>` : '';
      html += `<div class="bcn-insert-menu__option typography-body-md" role="option" id="${this.#prefix}-opt-${i}" data-i="${i}" aria-selected="${i === this.#active}"${
        item.disabled ? ' aria-disabled="true"' : ''
      }><span>${esc(item.label)}</span>${note}</div>`;
    });
    this.innerHTML = html;
    const active = this.querySelector<HTMLElement>(`#${this.#prefix}-opt-${this.#active}`);
    if (active) {
      this.#owner?.setAttribute('aria-activedescendant', active.id);
      active.scrollIntoView({ block: 'nearest' });
    }
  }

  // Hover moves the active option too, so the mouse and the arrow keys always
  // agree on what Enter picks: one highlight, never two.
  #onHover = (e: MouseEvent): void => {
    const opt = (e.target as HTMLElement).closest<HTMLElement>('[data-i]');
    const i = Number(opt?.dataset.i);
    if (!opt || i === this.#active || !this.#enabled(i)) return;
    this.querySelector(`#${this.#prefix}-opt-${this.#active}`)?.setAttribute('aria-selected', 'false');
    this.#active = i;
    opt.setAttribute('aria-selected', 'true');
    this.#owner?.setAttribute('aria-activedescendant', opt.id);
  };

  #onClick = (e: MouseEvent): void => {
    const opt = (e.target as HTMLElement).closest<HTMLElement>('[data-i]');
    if (opt) this.#choose(Number(opt.dataset.i));
  };

  #onOutside = (e: Event): void => {
    if (!this.isOpen) return;
    const t = e.target as Node;
    if (this.contains(t) || this.#owner?.contains(t) || (t as HTMLElement).closest?.('[data-insert-trigger]')) return;
    this.close();
  };
}

if (!customElements.get('bcn-insert-menu')) customElements.define('bcn-insert-menu', BcnInsertMenu);
