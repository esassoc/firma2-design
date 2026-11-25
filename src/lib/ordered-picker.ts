// The behaviour of firma2-ordered-picker: a short ordered list a person
// builds from a closed set — the home's sections, the bar's destinations, the
// results an introduction shows.
//
// THE CONSUMER OWNS THE LIST. This paints rows from `keys()`, hands every
// change back through `set()`, and repaints; it stores nothing. Reordering is
// bcn-sortable-list's (drag, or the grip's menu); adding is a menu of what is
// not in the list yet; removing is the row's own button.

import '../components/shared/bcn-sortable-list';
import '@esa/ecology/esa-dropdown-menu';

export interface PickerChoice {
  label: string;
  /** Handed back to `add()`. */
  action: string;
  divider?: boolean;
}

export interface PickerOptions {
  keys(): string[];
  set(keys: string[]): void;
  labelOf(key: string): string;
  /** A short state beside the name ("Nothing to show yet"); '' for none. */
  noteOf?(key: string): string;
  /** What can be added now. */
  choices(): PickerChoice[];
  /** Turn a chosen action into the key to append — the consumer may create something here. */
  add(action: string): string | null;
  onEdit?(key: string): void;
  onRemove?(key: string): void;
  /** After any change, whoever made it. */
  onChange?(): void;
}

type Menu = HTMLElement & { items: unknown[] };

export interface Picker {
  paint(): void;
  /** Move focus to a row's Edit button (or its grip). */
  focusRow(key: string): void;
}

export const orderedPicker = (root: HTMLElement, options: PickerOptions): Picker => {
  const rows = root.querySelector<HTMLElement>('[data-picker-rows]')!;
  const template = root.querySelector<HTMLTemplateElement>('template[data-picker-row]')!;
  const empty = root.querySelector<HTMLElement>('[data-picker-empty]');
  const full = root.querySelector<HTMLElement>('[data-picker-full]');
  const addWrap = root.querySelector<HTMLElement>('[data-picker-add]');
  const menu = root.querySelector<Menu>('esa-dropdown-menu');
  const max = Number(root.dataset.max ?? 0) || Infinity;

  const rowOf = (key: string): HTMLElement | undefined => [...rows.querySelectorAll<HTMLElement>('li[data-sort-key]')].find((li) => li.dataset.sortKey === key);

  const paintMenu = (): void => {
    const choices = options.choices();
    const atMax = options.keys().length >= max;
    if (addWrap) addWrap.hidden = atMax || choices.length === 0;
    if (full) full.hidden = !atMax;
    void customElements.whenDefined('esa-dropdown-menu').then(() => {
      if (menu) menu.items = choices.map((c) => (c.divider ? { label: '', divider: true } : { label: c.label, action: c.action }));
    });
  };

  const paint = (): void => {
    const keys = options.keys();
    rows.replaceChildren(
      ...keys.map((key) => {
        const li = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const label = options.labelOf(key);
        li.dataset.sortKey = key;
        li.dataset.sortLabel = label;
        li.querySelector('[data-picker-label]')!.textContent = label;
        const note = li.querySelector<HTMLElement>('[data-picker-note]');
        const noted = options.noteOf?.(key) ?? '';
        if (note) {
          note.textContent = noted;
          note.hidden = !noted;
        }
        li.querySelector('[data-picker-edit]')?.setAttribute('aria-label', `Edit ${label}`);
        li.querySelector('[data-picker-remove]')?.setAttribute('aria-label', `Remove ${label}`);
        return li;
      }),
    );
    if (empty) empty.hidden = keys.length > 0;
    paintMenu();
  };

  const change = (keys: string[]): void => {
    options.set(keys);
    paint();
    options.onChange?.();
  };

  root.addEventListener('sort-change', () => {
    change([...rows.querySelectorAll<HTMLElement>('li[data-sort-key]')].map((li) => li.dataset.sortKey!));
  });

  rows.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const key = target.closest<HTMLElement>('li[data-sort-key]')?.dataset.sortKey;
    if (!key) return;
    if (target.closest('[data-picker-edit]')) options.onEdit?.(key);
    if (target.closest('[data-picker-remove]')) {
      const at = options.keys().indexOf(key);
      options.onRemove?.(key);
      change(options.keys().filter((k) => k !== key));
      // The button is gone: focus goes to the row that took its place, or the Add button.
      const next = options.keys()[Math.min(at, options.keys().length - 1)];
      requestAnimationFrame(() => {
        const to = next ? rowOf(next)?.querySelector<HTMLElement>('[data-picker-remove]') : addWrap?.querySelector<HTMLElement>('button');
        to?.focus();
      });
    }
  });

  menu?.addEventListener('menu-action', (event) => {
    // The grip's own menu fires the same event from inside a row.
    if ((event.target as HTMLElement).closest('li[data-sort-key]')) return;
    const key = options.add((event as CustomEvent<string>).detail);
    if (!key) return;
    change([...options.keys().filter((k) => k !== key), key]);
    if (options.onEdit && root.dataset.editOnAdd !== undefined) options.onEdit(key);
  });

  paint();
  return {
    paint,
    focusRow: (key) => rowOf(key)?.querySelector<HTMLElement>('[data-picker-edit], [data-sort-grip] button')?.focus(),
  };
};
