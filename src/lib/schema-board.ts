// The behaviour of firma2-schema-board: a measure's subcategories as group
// headings and their options as rows, built the way firma2-tag-board builds
// tag groups and tags. See the component's header for the pattern.
//
// The board owns the DOM and writes user schemas to the local schema store
// (src/lib/schema-draft.ts) once each is a real list — named, two options or
// more. The measure editor that mounts it owns the measure: it reads `ids()`
// for the record, `lists()` for the reporter preview, and saves on `onChange`.

import { announce } from '@esa/ecology/announcer';
import { liveOptions } from '../data/firma2-performance-measures';
import type { SubcategorySchema } from '../data/firma2-performance-measures';
import { nameButton } from './name-button';
import { allSchemas, emitSchemaChange, nextLocalSchemaId, writeLocalSchema } from './schema-draft';

const ERR_NAME = 'Name this subcategory to save it.';
const ERR_OPTIONS = 'Add at least two options to save it — one option splits nothing.';
const ERR_OPTION_NAME = 'Name the option.';
const ERR_OPTION_TAKEN = 'Already in this subcategory.';

type Field = HTMLElement & { value?: string; errorText?: string; focus: () => void };
type MenuItem = { label: string; action: string; variant?: 'danger'; divider?: boolean };

export interface SchemaBoardHooks {
  /** The origin marker and the line under it, for a schema (null = a new one). */
  marker: (schema: SubcategorySchema | null) => { label: string; note: string };
  /** Anything the measure records or previews changed. */
  onChange: () => void;
}

export interface SchemaList {
  origin: SubcategorySchema['origin'];
  name: string;
  options: string[];
}

export interface SchemaBoard {
  /** Attach a schema (retired, when the measure has retired it), or (null) open a new, empty subcategory with its name focused. */
  add: (schema: SubcategorySchema | null, retired?: boolean) => void;
  /** Ids of the subcategories retired on this measure, in order. */
  retired: () => string[];
  /** Ids of the saved subcategories, in order — a heading still short of a list is left out. */
  ids: () => string[];
  /** Every subcategory a reporter is still asked, as it stands on screen, saved or not. */
  lists: () => SchemaList[];
  clear: () => void;
  /** Published: no adding, renaming or removing — retiring instead. Repaints when it changes. */
  setLocked: (locked: boolean) => void;
}

/** What a retired subcategory says in place of its origin marker. */
const RETIRED_MARKER = {
  label: 'Retired',
  note: 'Reporters are no longer asked this. Entries already filed keep their answers.',
};

export function mountSchemaBoard(root: HTMLElement, hooks: SchemaBoardHooks): SchemaBoard {
  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const groupsOl = $<HTMLOListElement>('[data-groups]');
  const clone = (name: string) =>
    $<HTMLTemplateElement>(`[data-tpl-${name}]`).content.firstElementChild!.cloneNode(true) as HTMLElement;
  const button = (el: HTMLElement) => el.querySelector<HTMLElement>('button, a') ?? el;
  let locked = false;
  let seq = 0;

  const schemaById = (id: string) => allSchemas().find((s) => s.id === id);

  // ---- shared parts (firma2-tag-board's, without colour) ----------------------

  const textField = (label: string, value: string): Field => {
    const f = document.createElement('esa-text-field') as Field;
    f.className = 'firma2-schema-board__name';
    f.setAttribute('size', 'md');
    f.setAttribute('aria-label', label);
    // Set once the lego is defined: before, `value` would shadow its accessor.
    // Until then the value is read from `data-initial` (see fieldValue).
    f.dataset.initial = value;
    void customElements.whenDefined('esa-text-field').then(() => {
      f.value = value;
      delete f.dataset.initial;
    });
    return f;
  };

  const staticText = (text: string, cls: string): HTMLElement => {
    const p = document.createElement('p');
    p.className = `firma2-schema-board__name firma2-schema-board__static ${cls}`;
    p.textContent = text;
    return p;
  };

  /** The row's "…" menu; `items` is asked again each time it opens. */
  const rowMenu = (label: string, items: () => MenuItem[], onAction: (action: string) => void): HTMLElement => {
    const el = clone('menu') as HTMLElement & { items: MenuItem[] };
    el.classList.add('firma2-schema-board__menu');
    nameButton(el, label);
    const refresh = () => void customElements.whenDefined('esa-dropdown-menu').then(() => (el.items = items()));
    refresh();
    el.addEventListener('click', refresh, true);
    el.addEventListener('menu-action', (e) => {
      e.stopPropagation();
      onAction((e as CustomEvent<string>).detail);
    });
    return el;
  };

  const only = (label: string, variant?: 'danger') => () => [{ label, action: 'pick', variant }];

  /** Focus after a menu has closed — it restores focus to its own trigger first. */
  const focusLater = (el: HTMLElement | null | undefined) =>
    requestAnimationFrame(() => requestAnimationFrame(() => el?.focus()));

  /** Commit a field when focus leaves it or Enter is pressed. */
  const onCommit = (f: Field, commit: (viaEnter: boolean) => void) => {
    let busy = false;
    const run = (viaEnter: boolean) => {
      if (busy) return;
      busy = true;
      try {
        commit(viaEnter);
      } finally {
        busy = false;
      }
    };
    f.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        e.preventDefault();
        run(true);
      }
    });
    f.addEventListener('focusout', () => run(false));
  };

  const fieldValue = (f: Field) => String(f.dataset.initial ?? f.value ?? '').trim();

  // ---- reading a subcategory off the page ----------------------------------------

  const groups = () => [...groupsOl.querySelectorAll<HTMLLIElement>(':scope > li[data-origin]')];
  const groupOf = (el: Element) => el.closest<HTMLLIElement>('.firma2-schema-board__groups > li');

  const groupName = (li: HTMLLIElement): string => {
    const name = li.querySelector<Field>('.firma2-schema-board__head > .firma2-schema-board__name');
    return (name?.matches('esa-text-field') ? fieldValue(name) : name?.textContent ?? '').trim();
  };

  const optionRows = (li: HTMLLIElement) =>
    [...li.querySelectorAll<HTMLLIElement>('.firma2-schema-board__options > li[data-option]')];

  const groupOptions = (li: HTMLLIElement): string[] => [
    ...new Set(optionRows(li).map((r) => r.dataset.option!.trim()).filter(Boolean)),
  ];

  const groupRetired = (li: HTMLLIElement): string[] =>
    optionRows(li).filter((r) => 'retired' in r.dataset).map((r) => r.dataset.option!);

  const setError = (li: HTMLLIElement, message: string | null) => {
    const p = li.querySelector<HTMLElement>('.firma2-schema-board__error')!;
    p.hidden = !message;
    p.textContent = message ?? '';
  };

  const paintMarker = (li: HTMLLIElement, schema: SubcategorySchema | null) => {
    const m = 'retired' in li.dataset ? RETIRED_MARKER : hooks.marker(schema);
    const label = li.querySelector<HTMLElement>('.firma2-schema-board__marker .esa-pill__label');
    if (label) label.textContent = m.label;
    li.querySelector<HTMLElement>('.firma2-schema-board__meta')!.textContent = m.note;
  };

  /**
   * Write a user subcategory once it is a real list. A blank new one is a
   * change of mind, not an error; a half-made one says what it still needs
   * and stays off the measure until it has it.
   */
  const commitGroup = (li: HTMLLIElement | null) => {
    if (!li || li.dataset.origin !== 'user') return;
    const name = groupName(li);
    const options = groupOptions(li);
    const retired = groupRetired(li).filter((o) => options.includes(o));
    const live = options.length - retired.length;
    const isNew = !li.dataset.schemaId;
    // A new one says what it still needs in its meta line, which is always
    // on screen: an error line appearing on blur pushes "Add option" down
    // between press and release, and the click misses.
    if (isNew && (!name || live < 2)) return setError(li, null);
    if (!name) return setError(li, ERR_NAME);
    if (live < 2) return setError(li, ERR_OPTIONS);
    setError(li, null);
    const id = li.dataset.schemaId || nextLocalSchemaId(name);
    const stored = schemaById(id);
    const same = (a: string[] = [], b: string[] = []) => a.join('\u0000') === b.join('\u0000');
    if (stored && stored.name === name && same(stored.options, options) && same(stored.retiredOptions, retired)) return;
    writeLocalSchema({ id, name, origin: 'user', options, ...(retired.length ? { retiredOptions: retired } : {}) });
    emitSchemaChange();
    if (isNew) {
      li.dataset.schemaId = id;
      li.dataset.sortKey = id;
      li.removeAttribute('data-sort-locked');
      li.querySelector(':scope > [data-sort-spacer]')?.remove();
      paintMarker(li, schemaById(id) ?? null);
      announce(`${name} saved.`);
    }
  };

  // ---- an option row ---------------------------------------------------------------

  /**
   * `editable`: a user schema's option — renamed, reordered, moved, removed.
   * Removal depends on the measure: a draft's option is deleted; a published
   * one's is RETIRED — no longer offered to reporters, still there for the
   * entries that used it — and can be restored.
   */
  const optionRow = (option: string, editable: boolean, retired = false): HTMLLIElement => {
    const li = document.createElement('li');
    li.className = 'firma2-schema-board__row';
    li.dataset.option = option;
    if (retired) li.dataset.retired = '';
    const tag = clone('marker');
    const paintRetired = () => {
      tag.hidden = !('retired' in li.dataset);
      const label = tag.querySelector<HTMLElement>('.esa-pill__label');
      if (label) label.textContent = 'Retired';
    };
    paintRetired();
    if (!editable) {
      li.append(staticText(option, 'typography-body-md'), tag);
      return li;
    }
    li.dataset.sortKey = `option-${(seq += 1)}`;
    li.dataset.sortLabel = option;

    const name = textField(`Option ${option}`, option);
    onCommit(name, () => {
      const next = fieldValue(name);
      if (next === li.dataset.option) return void (name.errorText = '');
      const group = groupOf(li)!;
      const taken = optionRows(group).some((r) => r !== li && r.dataset.option === next);
      name.errorText = !next ? ERR_OPTION_NAME : taken ? ERR_OPTION_TAKEN : '';
      if (name.errorText) return;
      li.dataset.option = next;
      li.dataset.sortLabel = next;
      name.setAttribute('aria-label', `Option ${next}`);
      nameButton(menu, `Actions for ${next}`);
      commitGroup(group);
      hooks.onChange();
    });

    const menu = rowMenu(
      `Actions for ${option}`,
      () =>
        !locked
          ? [{ label: 'Delete option', action: 'delete', variant: 'danger' }]
          : 'retired' in li.dataset
            ? [{ label: 'Restore option', action: 'restore' }]
            : [{ label: 'Retire option', action: 'retire', variant: 'danger' }],
      (action) => {
        const group = groupOf(li)!;
        const label = li.dataset.option;
        if (action === 'delete') {
          li.remove();
          announce(`${label} deleted.`);
          focusLater(addButtonOf(group));
        } else {
          li.toggleAttribute('data-retired', action === 'retire');
          paintRetired();
          announce(action === 'retire' ? `${label} retired. Past entries keep it.` : `${label} restored.`);
        }
        commitGroup(group);
        hooks.onChange();
      },
    );

    li.append(name, tag, menu);
    return li;
  };

  /** An empty row for a new option: kept once named, dropped if left empty. */
  const pendingOptionRow = (group: HTMLLIElement) => {
    const list = group.querySelector<HTMLElement>('.firma2-schema-board__options')!;
    const li = document.createElement('li');
    li.className = 'firma2-schema-board__row';
    // Locked: a row with no name cannot be moved; it gets the grip's width as
    // a spacer so its field lines up with the rest.
    li.dataset.sortLocked = '';
    const name = textField(`New option in ${groupName(group) || 'the new subcategory'}`, '');
    const discard = rowMenu('Actions for the new option', only('Discard'), () => {
      li.remove();
      focusLater(addButtonOf(group));
    });
    li.append(name, discard);
    list.append(li);

    let done = false;
    const keep = (viaEnter: boolean) => {
      if (done) return;
      const value = fieldValue(name);
      if (!value) return void (name.errorText = viaEnter ? ERR_OPTION_NAME : '');
      if (optionRows(group).some((r) => r.dataset.option === value)) return void (name.errorText = ERR_OPTION_TAKEN);
      done = true;
      li.replaceWith(optionRow(value, true));
      commitGroup(group);
      hooks.onChange();
      if (viaEnter) pendingOptionRow(group);
      else addButtonOf(group)?.focus({ preventScroll: true });
    };
    onCommit(name, keep);
    li.addEventListener('focusout', (e) => {
      const to = (e as FocusEvent).relatedTarget as Node | null;
      if (to && li.contains(to)) return;
      setTimeout(() => {
        if (done || li.matches(':focus-within')) return;
        if (fieldValue(name)) keep(false);
        else li.remove();
      }, 0);
    });
    void customElements.whenDefined('esa-text-field').then(() => requestAnimationFrame(() => name.focus()));
  };

  const addButtonOf = (group: HTMLLIElement) =>
    group.querySelector<HTMLElement>('.firma2-schema-board__add button');

  // ---- a subcategory ---------------------------------------------------------------

  /**
   * One subcategory: a schema, or (null) a new one with no name yet.
   *
   * RETIRED (published measures only): no longer asked, still on the measure
   * for the entries that answered it. It renders read-only — its list is the
   * vocabulary those past answers were given in, and editing it would rewrite
   * them — under a "Retired" marker, and its menu offers Restore.
   */
  const groupItem = (schema: SubcategorySchema | null, retired = false): HTMLLIElement => {
    // A user schema's options are editable on any measure; the subcategory
    // itself is added or removed only while the measure is a draft, and
    // retired or restored once it is published.
    const editable = !retired && (!schema || schema.origin === 'user');
    const li = document.createElement('li');
    if (retired) li.dataset.retired = '';
    li.dataset.origin = schema?.origin ?? 'user';
    li.dataset.schemaId = schema?.id ?? '';
    li.dataset.sortLabel = schema?.name ?? 'New subcategory';
    // Order is presentation, so subcategories reorder even when published.
    if (schema) li.dataset.sortKey = schema.id;
    else li.dataset.sortLocked = '';

    const section = document.createElement('section');
    section.setAttribute('aria-label', schema?.name ?? 'New subcategory');

    const head = document.createElement('div');
    head.className = 'firma2-schema-board__head';
    const marker = clone('marker');
    let name: HTMLElement;
    if (editable) {
      const field = textField(schema ? `Name of ${schema.name}` : 'Name of the new subcategory', schema?.name ?? '');
      onCommit(field, (viaEnter) => {
        const next = fieldValue(field);
        const label = next || 'New subcategory';
        li.dataset.sortLabel = label;
        section.setAttribute('aria-label', label);
        sortable?.setAttribute('label', label);
        field.setAttribute('aria-label', `Name of ${label}`);
        nameButton(menu, `Actions for ${label}`);
        commitGroup(li);
        hooks.onChange();
        // Enter on a new subcategory's name goes straight on to its first option.
        if (viaEnter && next && optionRows(li).length === 0) pendingOptionRow(li);
      });
      name = field;
    } else {
      name = staticText(schema!.name, 'typography-label-md');
    }

    // Draft: Remove — nothing has been filed against it. Published: Retire or
    // Restore — entries have, so it stays on the measure either way.
    const menuItems = (): MenuItem[] =>
      !locked
        ? [{ label: 'Remove from measure', action: 'remove', variant: 'danger' }]
        : retired
          ? [{ label: 'Restore subcategory', action: 'restore' }]
          : [{ label: 'Retire subcategory', action: 'retire', variant: 'danger' }];
    const menu = rowMenu(`Actions for ${schema?.name ?? 'the new subcategory'}`, menuItems, (action) => {
      const label = li.dataset.sortLabel;
      if (action === 'remove') {
        const next = (li.nextElementSibling ?? li.previousElementSibling) as HTMLLIElement | null;
        li.remove();
        relink();
        hooks.onChange();
        announce(`${label} removed from this measure.`);
        focusLater(next?.querySelector<HTMLElement>('.firma2-schema-board__menu button'));
        return;
      }
      if (!schema) return;
      // Rebuilt in place: a retired subcategory is a read-only one, and an
      // editable one has fields and grips a read-only one does not.
      const swapped = groupItem(schema, action === 'retire');
      li.replaceWith(swapped);
      relink();
      hooks.onChange();
      announce(action === 'retire' ? `${label} retired. Reporters are no longer asked it; past entries keep their answers.` : `${label} restored. Reporters are asked it again.`);
      focusLater(swapped.querySelector<HTMLElement>('.firma2-schema-board__menu button'));
    });
    head.append(name, marker);
    if (!locked || schema) head.append(menu);

    const meta = document.createElement('p');
    meta.className = 'firma2-schema-board__meta typography-meta';
    const error = document.createElement('p');
    error.className = 'firma2-schema-board__error typography-meta';
    error.hidden = true;

    const ol = document.createElement('ol');
    ol.className = 'firma2-schema-board__options';
    const options = (schema?.options ?? []).map((o) => optionRow(o, editable, !!schema?.retiredOptions?.includes(o)));
    let sortable: HTMLElement | null = null;
    section.append(head, meta, error);
    if (editable) {
      // Linked to every other editable subcategory: options move between them.
      sortable = document.createElement('bcn-sortable-list');
      sortable.setAttribute('group', 'schema-options');
      sortable.setAttribute('label', schema?.name ?? 'New subcategory');
      const handle = document.createElement('template');
      handle.setAttribute('data-sort-handle', '');
      handle.content.append(clone('grip'));
      const placeholder = document.createElement('li');
      placeholder.dataset.sortPlaceholder = '';
      placeholder.append(clone('empty'));
      ol.append(placeholder, ...options);
      sortable.append(handle, ol);
      section.append(sortable);

      const add = clone('add');
      add.classList.add('firma2-schema-board__add');
      button(add).addEventListener('click', () => pendingOptionRow(li));
      section.append(add);
    } else if (options.length > 0) {
      ol.append(...options);
      section.append(ol);
    }

    li.append(section);
    paintMarker(li, schema);
    return li;
  };

  /**
   * Re-link the option lists. bcn-sortable-list builds each grip's "Move to"
   * items from the linked lists on the page when it decorates, so one added
   * or removed later leaves the others stale; re-setting a list's `label`
   * makes it re-decorate every peer.
   */
  const relink = () => {
    const list = root.querySelector<HTMLElement>('bcn-sortable-list[group="schema-options"]');
    list?.setAttribute('label', list.getAttribute('label') ?? '');
  };

  // ---- moves -----------------------------------------------------------------------

  // A subcategory reordered changes the measure; an option moved between two
  // subcategories changes both lists. Nested lists bubble here alike.
  root.addEventListener('sort-change', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('.firma2-schema-board__groups > li > section')) {
      const group = groupOf(target);
      // An option moved into a subcategory that already has it merges into it.
      const seen = new Set<string>();
      if (group) for (const row of optionRows(group)) {
        if (seen.has(row.dataset.option!)) row.remove();
        else seen.add(row.dataset.option!);
      }
      commitGroup(group);
      const from = (e as CustomEvent<{ from?: HTMLElement }>).detail?.from;
      if (from && from !== target) commitGroup(groupOf(from));
    }
    hooks.onChange();
  });

  // ---- the API ---------------------------------------------------------------------

  const add = (schema: SubcategorySchema | null, retired = false) => {
    const item = groupItem(schema, retired);
    groupsOl.append(item);
    relink();
    if (!schema) {
      void customElements
        .whenDefined('esa-text-field')
        .then(() => requestAnimationFrame(() => item.querySelector<Field>('.firma2-schema-board__head esa-text-field')?.focus()));
      // A new subcategory left with no name and no options is dropped.
      item.addEventListener('focusout', (e) => {
        const to = (e as FocusEvent).relatedTarget as Node | null;
        if (to && item.contains(to)) return;
        setTimeout(() => {
          if (item.matches(':focus-within') || item.dataset.schemaId) return;
          if (!groupName(item) && optionRows(item).length === 0) item.remove();
        }, 0);
      });
    }
  };

  const ids = () => groups().map((g) => g.dataset.schemaId ?? '').filter(Boolean);
  const retiredIds = () => groups().filter((g) => 'retired' in g.dataset).map((g) => g.dataset.schemaId ?? '').filter(Boolean);

  return {
    add,
    ids,
    retired: retiredIds,
    // What a reporter is offered: retired subcategories and options are left out.
    lists: () =>
      groups().filter((g) => !('retired' in g.dataset)).map((g) => ({
        origin: g.dataset.origin as SchemaList['origin'],
        name: groupName(g),
        options: liveOptions({ options: groupOptions(g), retiredOptions: groupRetired(g) }),
      })),
    clear: () => groupsOl.replaceChildren(),
    setLocked: (next) => {
      if (next === locked) return;
      const saved = ids();
      const wasRetired = new Set(retiredIds());
      locked = next;
      groupsOl.replaceChildren();
      saved.forEach((id) => {
        const schema = schemaById(id);
        if (schema) add(schema, wasRetired.has(id));
      });
    },
  };
}
