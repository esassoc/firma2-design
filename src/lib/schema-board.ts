// The behaviour of firma2-schema-board: a measure's BREAKDOWNS as group
// headings and their options as rows, built the way firma2-tag-board builds
// tag groups and tags. See the component's header for the pattern.
//
// THE MEASURE OWNS ITS BREAKDOWNS (PM 2 reconciliation, 2026-10-09). There is
// no shared list store any more: the board edits the measure's own copies, and
// the editor that mounts it saves them on the record (persistMeasure). The
// board reads `breakdowns()` for the record, `lists()` for the reporter
// preview, and calls `onChange` after every edit, add, move or removal.
//
// A breakdown reaches the record once it is a real list — a question, and two
// options or more besides "Unspecified". Until then it says what it still
// needs and stays off the record; a breakdown that falls short AFTER saving
// keeps its last saved state on the record until it is whole again.

import { announce } from '@esa/ecology/announcer';
import { UNSPECIFIED, liveOptions, withUnspecified } from '../data/firma2-performance-measures';
import type { Breakdown } from '../data/firma2-performance-measures';
import { nameButton } from './name-button';

const ERR_QUESTION = 'Add a question to save it.';
const ERR_OPTIONS = 'Add at least two options to save it — one option splits nothing.';
const ERR_OPTION_NAME = 'Name the option.';
const ERR_OPTION_TAKEN = 'Already in this breakdown.';
const NOTE_NEW = 'Saves once it has a question and two options.';

type Field = HTMLElement & { value?: string; errorText?: string; focus: () => void };
type MenuItem = { label: string; action: string; variant?: 'danger'; divider?: boolean };

export interface SchemaBoardHooks {
  /** Anything the measure records or previews changed. */
  onChange: () => void;
}

/** One question as a reporter meets it: the question and the options they may pick. */
export interface SchemaList {
  name: string;
  options: string[];
}

export interface SchemaBoard {
  /** Show a breakdown, or (null) open a new, empty one with its question focused. */
  add: (breakdown: Breakdown | null) => void;
  /** The breakdowns as the record should store them, in order — retired ones included. */
  breakdowns: () => Breakdown[];
  /** Every breakdown a reporter is still asked, as it stands on screen, saved or not. */
  lists: () => SchemaList[];
  clear: () => void;
  /** Published: no adding or removing a breakdown — retiring instead. Repaints when it changes. */
  setLocked: (locked: boolean) => void;
  /** Retired: nothing edits, moves or retires — the measure takes no new figures. Repaints when it changes. */
  setFrozen: (frozen: boolean) => void;
}

/** What a retired breakdown says under its "Retired" pill. */
const RETIRED_NOTE = 'Reporters are no longer asked this. Entries already filed keep their answers.';

let idSeq = 0;
/** An id for a breakdown made in this browser. Unique per page load and across reloads. */
export const newBreakdownId = (): string => `bd-local-${Date.now().toString(36)}-${(idSeq += 1)}`;

const isUnspecified = (o: string) => o.trim().toLowerCase() === UNSPECIFIED.toLowerCase();

export function mountSchemaBoard(root: HTMLElement, hooks: SchemaBoardHooks): SchemaBoard {
  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const groupsOl = $<HTMLOListElement>('[data-groups]');
  const clone = (name: string) =>
    $<HTMLTemplateElement>(`[data-tpl-${name}]`).content.firstElementChild!.cloneNode(true) as HTMLElement;
  const button = (el: HTMLElement) => el.querySelector<HTMLElement>('button, a') ?? el;
  let locked = false;
  // RETIRED MEASURE (user, 2026-10-09): every breakdown and option reads only.
  let frozen = false;
  let seq = 0;

  // ---- shared parts (firma2-tag-board's, without colour) ----------------------

  const textField = (label: string, value: string, placeholder = ''): Field => {
    const f = document.createElement('esa-text-field') as Field;
    f.className = 'firma2-schema-board__name';
    f.setAttribute('size', 'md');
    f.setAttribute('aria-label', label);
    if (placeholder) f.setAttribute('placeholder', placeholder);
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

  /** A "Retired" pill, shown only while its owner carries data-retired. */
  const retiredPill = (): HTMLElement => {
    const tag = clone('marker');
    const label = tag.querySelector<HTMLElement>('.esa-pill__label');
    if (label) label.textContent = 'Retired';
    return tag;
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

  // ---- reading a breakdown off the page ------------------------------------------

  const groups = () => [...groupsOl.querySelectorAll<HTMLLIElement>(':scope > li[data-breakdown-id]')];
  const groupOf = (el: Element) => el.closest<HTMLLIElement>('.firma2-schema-board__groups > li');

  const groupQuestion = (li: HTMLLIElement): string => {
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

  /** The breakdown as the page states it now — valid or not. */
  const readGroup = (li: HTMLLIElement): Breakdown => {
    const options = groupOptions(li);
    const retiredOptions = groupRetired(li).filter((o) => options.includes(o));
    return {
      id: li.dataset.breakdownId!,
      question: groupQuestion(li),
      options,
      ...(retiredOptions.length ? { retiredOptions } : {}),
      ...('retired' in li.dataset ? { retired: true } : {}),
    };
  };

  /** The last state of this breakdown that was whole enough to save, if any. */
  const savedOf = (li: HTMLLIElement): Breakdown | null => {
    try {
      return li.dataset.saved ? (JSON.parse(li.dataset.saved) as Breakdown) : null;
    } catch {
      return null;
    }
  };

  const setError = (li: HTMLLIElement, message: string | null) => {
    const p = li.querySelector<HTMLElement>('.firma2-schema-board__error')!;
    p.hidden = !message;
    p.textContent = message ?? '';
  };

  /** The line under a heading: what a new one needs, or why a retired one recedes. */
  const paintMeta = (li: HTMLLIElement) => {
    const meta = li.querySelector<HTMLElement>('.firma2-schema-board__meta')!;
    const pill = li.querySelector<HTMLElement>('.firma2-schema-board__head > .firma2-schema-board__marker');
    const retired = 'retired' in li.dataset;
    if (pill) pill.hidden = !retired;
    if (retired) {
      meta.hidden = false;
      meta.textContent = RETIRED_NOTE;
    } else if (!li.dataset.saved) {
      meta.hidden = false;
      meta.textContent = NOTE_NEW;
    } else if ('fresh' in li.dataset) {
      // Made in this sitting: the line stays as a reserved, invisible line, so
      // the rows under it do not jump between pressing "Add option" and
      // releasing it (the click would miss).
      meta.dataset.done = '';
    } else {
      meta.hidden = true;
    }
  };

  /** Keep exactly one Unspecified row, last — added, never demanded. */
  const ensureUnspecified = (li: HTMLLIElement) => {
    const rows = optionRows(li);
    const real = rows.filter((r) => !isUnspecified(r.dataset.option!));
    if (real.length === 0) return;
    if (rows.some((r) => isUnspecified(r.dataset.option!))) return;
    const list = li.querySelector<HTMLElement>('.firma2-schema-board__options');
    list?.append(optionRow(UNSPECIFIED, 'editable' in li.dataset));
  };

  /**
   * Record a breakdown once it is a real list. A blank new one is a change of
   * mind, not an error; a half-made one says what it still needs and stays off
   * the record (or keeps its last saved state there) until it has it.
   */
  const commitGroup = (li: HTMLLIElement | null) => {
    if (!li || !('editable' in li.dataset)) return;
    ensureUnspecified(li);
    const b = readGroup(li);
    const live = liveOptions(b).filter((o) => !isUnspecified(o)).length;
    const isNew = !li.dataset.saved;
    // A new one says what it still needs in its meta line, which is always
    // on screen: an error line appearing on blur pushes "Add option" down
    // between press and release, and the click misses.
    if (isNew && (!b.question || live < 2)) return setError(li, null);
    if (!b.question) return setError(li, ERR_QUESTION);
    if (live < 2) return setError(li, ERR_OPTIONS);
    setError(li, null);
    li.dataset.saved = JSON.stringify({ ...b, options: withUnspecified(b.options) });
    if (isNew) {
      li.dataset.sortKey = b.id;
      li.removeAttribute('data-sort-locked');
      li.querySelector(':scope > [data-sort-spacer]')?.remove();
      paintMeta(li);
      announce(`${b.question} saved.`);
    }
  };

  // ---- an option row ---------------------------------------------------------------

  /**
   * `editable`: the option is renamed, reordered, moved, removed. Removal
   * depends on the measure: a draft's option is deleted; a published one's is
   * RETIRED — no longer offered to reporters, still there for the entries that
   * used it — and can be restored.
   *
   * UNSPECIFIED is the board's, not the author's: it is appended to every
   * breakdown, stays last, and has no field and no menu.
   */
  const optionRow = (option: string, editable: boolean, retired = false): HTMLLIElement => {
    const li = document.createElement('li');
    li.className = 'firma2-schema-board__row';
    li.dataset.option = option;
    if (retired) li.dataset.retired = '';
    const tag = retiredPill();
    const paintRetired = () => (tag.hidden = !('retired' in li.dataset));
    paintRetired();
    if (!editable || isUnspecified(option)) {
      // Locked in a sortable list: it cannot move, and nothing passes it.
      if (editable) li.dataset.sortLocked = '';
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

  /** An empty row for a new option, above Unspecified: kept once named, dropped if left empty. */
  const pendingOptionRow = (group: HTMLLIElement) => {
    const list = group.querySelector<HTMLElement>('.firma2-schema-board__options')!;
    const li = document.createElement('li');
    li.className = 'firma2-schema-board__row';
    // Locked: a row with no name cannot be moved; it gets the grip's width as
    // a spacer so its field lines up with the rest.
    li.dataset.sortLocked = '';
    const name = textField(`New option in ${groupQuestion(group) || 'the new breakdown'}`, '');
    const discard = rowMenu('Actions for the new option', only('Discard'), () => {
      li.remove();
      focusLater(addButtonOf(group));
    });
    li.append(name, discard);
    const unspecified = optionRows(group).find((r) => isUnspecified(r.dataset.option!));
    if (unspecified) unspecified.before(li);
    else list.append(li);

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

  // ---- a breakdown -----------------------------------------------------------------

  /**
   * One breakdown: a saved one, or (null) a new one with no question yet.
   *
   * RETIRED (published measures only): no longer asked, still on the measure
   * for the entries that answered it. It renders read-only — its list is the
   * vocabulary those past answers were given in, and editing it would rewrite
   * them — under a "Retired" pill, and its menu offers Restore.
   */
  const groupItem = (b: Breakdown | null): HTMLLIElement => {
    const retired = !!b?.retired;
    const editable = !retired && !frozen;
    const id = b?.id ?? newBreakdownId();
    const li = document.createElement('li');
    li.dataset.breakdownId = id;
    if (retired) li.dataset.retired = '';
    if (editable) li.dataset.editable = '';
    if (b) li.dataset.saved = JSON.stringify(b);
    else li.dataset.fresh = '';
    li.dataset.sortLabel = b?.question || 'New breakdown';
    // Order is presentation, so breakdowns reorder even when published —
    // but not once the measure is retired.
    if (b && !frozen) li.dataset.sortKey = id;
    else li.dataset.sortLocked = '';

    const section = document.createElement('section');
    section.setAttribute('aria-label', b?.question || 'New breakdown');

    const head = document.createElement('div');
    head.className = 'firma2-schema-board__head';
    let name: HTMLElement;
    if (editable) {
      const field = textField(b ? `Question: ${b.question}` : 'Question for the new breakdown', b?.question ?? '', 'e.g. Treatment type');
      onCommit(field, (viaEnter) => {
        const next = fieldValue(field);
        const label = next || 'New breakdown';
        li.dataset.sortLabel = label;
        section.setAttribute('aria-label', label);
        sortable?.setAttribute('label', label);
        field.setAttribute('aria-label', `Question: ${label}`);
        nameButton(menu, `Actions for ${label}`);
        commitGroup(li);
        hooks.onChange();
        // Enter on a new breakdown's question goes straight on to its first option.
        const real = optionRows(li).filter((r) => !isUnspecified(r.dataset.option!));
        if (viaEnter && next && real.length === 0) pendingOptionRow(li);
      });
      name = field;
    } else {
      name = staticText(b!.question, 'typography-label-md');
    }

    // Draft: Remove — nothing has been filed against it. Published: Retire or
    // Restore — entries have, so it stays on the measure either way.
    const menuItems = (): MenuItem[] =>
      !locked
        ? [{ label: 'Remove breakdown', action: 'remove', variant: 'danger' }]
        : retired
          ? [{ label: 'Restore breakdown', action: 'restore' }]
          : [{ label: 'Retire breakdown', action: 'retire', variant: 'danger' }];
    const menu = rowMenu(`Actions for ${b?.question || 'the new breakdown'}`, menuItems, (action) => {
      const label = li.dataset.sortLabel;
      if (action === 'remove') {
        const next = (li.nextElementSibling ?? li.previousElementSibling) as HTMLLIElement | null;
        li.remove();
        relink();
        hooks.onChange();
        announce(`${label} removed.`);
        focusLater(next?.querySelector<HTMLElement>('.firma2-schema-board__menu button'));
        return;
      }
      // Rebuilt in place from its saved state: a retired breakdown is a
      // read-only one, and an editable one has fields and grips it does not.
      const saved = savedOf(li);
      if (!saved) return;
      const swapped = groupItem({ ...saved, ...(action === 'retire' ? { retired: true } : { retired: undefined }) });
      li.replaceWith(swapped);
      relink();
      hooks.onChange();
      announce(action === 'retire' ? `${label} retired. Reporters are no longer asked it; past entries keep their answers.` : `${label} restored. Reporters are asked it again.`);
      focusLater(swapped.querySelector<HTMLElement>('.firma2-schema-board__menu button'));
    });
    const pill = retiredPill();
    pill.hidden = !retired;
    head.append(name, pill);
    if (!frozen && (!locked || b)) head.append(menu);

    const meta = document.createElement('p');
    meta.className = 'firma2-schema-board__meta typography-meta';
    const error = document.createElement('p');
    error.className = 'firma2-schema-board__error typography-meta';
    error.hidden = true;

    const ol = document.createElement('ol');
    ol.className = 'firma2-schema-board__options';
    // A new breakdown starts with Unspecified already in its list.
    const startOptions = b ? withUnspecified(b.options) : [UNSPECIFIED];
    const options = startOptions.map((o) => optionRow(o, editable, !!b?.retiredOptions?.includes(o)));
    let sortable: HTMLElement | null = null;
    section.append(head, meta, error);
    if (editable) {
      // Linked to every other editable breakdown: options move between them.
      sortable = document.createElement('bcn-sortable-list');
      sortable.setAttribute('group', 'schema-options');
      sortable.setAttribute('label', b?.question || 'New breakdown');
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
    paintMeta(li);
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

  // A breakdown reordered changes the measure; an option moved between two
  // breakdowns changes both lists. Nested lists bubble here alike.
  root.addEventListener('sort-change', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('.firma2-schema-board__groups > li > section')) {
      const group = groupOf(target);
      if (group) {
        // An option moved into a breakdown that already has it merges into it,
        // and Unspecified goes back to the end.
        const seen = new Set<string>();
        for (const row of optionRows(group)) {
          if (seen.has(row.dataset.option!)) row.remove();
          else seen.add(row.dataset.option!);
        }
        const unspecified = optionRows(group).find((r) => isUnspecified(r.dataset.option!));
        if (unspecified) unspecified.parentElement?.append(unspecified);
      }
      commitGroup(group);
      const from = (e as CustomEvent<{ from?: HTMLElement }>).detail?.from;
      if (from && from !== target) commitGroup(groupOf(from));
    }
    hooks.onChange();
  });

  // ---- the API ---------------------------------------------------------------------

  const add = (b: Breakdown | null) => {
    const item = groupItem(b);
    groupsOl.append(item);
    relink();
    if (!b) {
      void customElements
        .whenDefined('esa-text-field')
        .then(() => requestAnimationFrame(() => item.querySelector<Field>('.firma2-schema-board__head esa-text-field')?.focus()));
      // A new breakdown left with no question and no options of its own is dropped.
      item.addEventListener('focusout', (e) => {
        const to = (e as FocusEvent).relatedTarget as Node | null;
        if (to && item.contains(to)) return;
        setTimeout(() => {
          if (item.matches(':focus-within') || item.dataset.saved) return;
          const real = optionRows(item).filter((r) => !isUnspecified(r.dataset.option!));
          if (!groupQuestion(item) && real.length === 0) item.remove();
        }, 0);
      });
    }
  };

  const breakdowns = (): Breakdown[] =>
    groups().flatMap((g): Breakdown[] => {
      const saved = savedOf(g);
      if (!saved) return [];
      // A retired breakdown is its saved state, flagged; an editable one is
      // its current state whenever that is whole (commitGroup keeps `saved`
      // current), else its last whole state.
      const { retired: _retired, ...rest } = saved;
      return ['retired' in g.dataset ? { ...rest, retired: true } : rest];
    });

  return {
    add,
    breakdowns,
    // What a reporter is offered: retired breakdowns and options are left out.
    lists: () =>
      groups()
        .filter((g) => !('retired' in g.dataset))
        .map((g) => ({
          name: groupQuestion(g),
          options: liveOptions({ options: groupOptions(g), retiredOptions: groupRetired(g) }),
        })),
    clear: () => groupsOl.replaceChildren(),
    setLocked: (next) => {
      if (next === locked) return;
      const saved = breakdowns();
      locked = next;
      groupsOl.replaceChildren();
      saved.forEach(add);
    },
    setFrozen: (next) => {
      if (next === frozen) return;
      const saved = breakdowns();
      frozen = next;
      groupsOl.replaceChildren();
      saved.forEach(add);
    },
  };
}
