// bcn-sortable-list — drag a row by its grip to reorder a list, or click the
// grip for a menu that does the same moves without dragging.
//
// bcn-lego-checked: no esa- component reorders a list (catalog walked, and the
// hub's main branch: the only drag handling is esa-file-upload's drop zone).
// Beacon is not cloned on this machine. Due upstream as a /request-lego for
// `esa-sortable-list` (esassoc/ecology#39); this is the spoke's stand-in until it ships. The grip is
// an EsaButton the consumer supplies in a <template>, and the move menu is
// esa-dropdown-menu — no control here is hand-rolled.
//
// THE GRIP DOES TWO THINGS, deliberately, which bcn-edge-handle was told not
// to. The difference is that here both jobs are the SAME job — move this row —
// by two means. Dragging is the fast way; the menu is the way that does not
// need a steady hand, a mouse, or sight of the list (WCAG 2.5.7, Dragging
// Movements: anything done by dragging must also be doable with a single
// pointer without dragging). Notion and Atlassian put both on one grip for
// the same reason. A press that travels under DRAG_SLOP px is a click and
// opens the menu; past it, it is a drag and the click that follows is eaten.
//
// KEYBOARD: the grip is the menu's trigger, so Enter, Space or Down opens the
// menu and the arrows walk it — the menu-button contract, inherited from
// esa-dropdown-menu rather than re-implemented. Every move is announced
// ("Status moved to 3 of 6") and focus returns to the moved row's grip, even
// though the consumer repaints the list.
//
// THE CONTRACT
//
//   <bcn-sortable-list>
//     <template data-sort-handle><EsaButton variant="chrome" iconOnly icon="menu" … /></template>
//                                (the glyph is replaced with a grip — see GRIP_PATHS)
//     <ol>
//       <li data-sort-key="a" data-sort-label="Status">…</li>
//       <li data-sort-key="z" data-sort-locked>…</li>      ← cannot move, cannot be passed
//     </ol>
//   </bcn-sortable-list>
//
// LINKED LISTS. Lists that share a `group` attribute pass rows between them —
// menu rows between menu sections. A row dragged over a linked list drops into it, and
// the grip's menu adds "Move to <label>" for every other list in the group
// (each list's `label` attribute names it, or `move-label` gives the whole
// item — "Remove from group" for the list of rows in none). An empty list stays a drop target
// if the consumer gives it a placeholder <li> with no data-sort-key; it is
// hidden as soon as the list holds a real row.
//
//   <bcn-sortable-list group="menu" label="Workspace">…</bcn-sortable-list>
//   <bcn-sortable-list group="menu" label="More">…</bcn-sortable-list>
//
// LINKED LISTS MAY NEST — a group's list inside a row of its parent's. While
// dragging, the innermost list under the pointer takes the row.
//
// SHOWING WHERE A ROW WILL LAND: `drop="line"` (the classification settings
// tree, 2026-11-23 — user: "the UI for what becomes part of what is not good
// … see apple examples"). By default the dragged row is moved through the
// list as the pointer travels, and its neighbours slide aside: right for one
// flat list, unreadable for a tree, where the question is WHICH GROUP the row
// is about to join. With `drop="line"` nothing moves until the drop, as in
// Finder and Reminders:
//   - an INSERTION LINE marks the gap the row would take, drawn at the width
//     and indent of the list it would join;
//   - a row that holds a linked list is a place to drop INTO: over the middle
//     of its own line it is marked `data-drop-into` (the consumer styles it),
//     and the row joins the end of that list. A thin band at the top and
//     bottom of the line still means before and after it;
//   - an empty list's placeholder row is marked `data-drop-into` the same way;
//   - the dragged row STAYS WHERE IT IS, dimmed, and a small label with its
//     name follows the pointer, set off to one side so it never covers what
//     is being aimed at. (The first version carried the whole row under the
//     pointer: a group took everything inside it along, over the target.);
//   - near the top or bottom edge of whatever scrolls the list, the page
//     scrolls under the pointer, so a row can be carried to a group that was
//     off screen when the drag began.
// The attribute is read on the list the drag STARTS in.
//
// A list can turn rows away: `refuse="key1 key2"` names the keys it never
// takes, so a drag skips it and the grip's menu leaves out "Move to" it — a
// row that may not be nested in itself (More, on the menu-order page).
//
//   <bcn-sortable-list group="menu" label="More" refuse="more">…</bcn-sortable-list>
//
// A ROW CAN CARRY ITS OWN ACTIONS: `data-sort-actions` holds a JSON list of
// esa-dropdown-menu items, shown above the moves (the form canvas puts
// Duplicate and Remove there — docs/adr/0001). The list leaves them alone, so
// their `menu-action` bubbles to the consumer; the row is
// `event.target.closest("li")`. Changing the attribute re-decorates.
//
// A row that lands in another list fires `sort-change` on the list it LANDED
// IN, with `detail.from` the list it left. The event bubbles, so a consumer
// with nested lists checks `event.target`.
//
// A GRID OF TILES, NOT ONLY A COLUMN OF ROWS: `layout="grid"` (the Progress
// Dashboard, 2026-11-12). Rows that sit side by side and wrap are placed by
// reading order — the dragged tile goes before the first tile the pointer is
// above, or left of the middle of, on its own line — it follows the pointer on
// both axes, and the menu says Move earlier / later / to start / to end,
// because "up" means nothing between two tiles on one line. Everything else
// is the list's: the grip, the menu, the announcement, Escape.
//
// WHERE THE GRIP GOES. First in the row, unless the row holds an element
// marked `data-sort-grip-slot` — then there, so a tile can keep its grip with
// its other actions instead of ahead of its title.
//
// It decorates every movable <li> with a grip (and re-decorates whenever the
// consumer repaints — a MutationObserver, so the consumer never calls it).
// A move fires `sort-change` with `detail: { order: string[], key: string }`:
// the keys of the MOVABLE rows in their new order. The DOM has already moved
// for a drag; the consumer saves the order and may repaint from its model.

// The kit's one polite live region. A component minting its own region
// degrades every other announcement on the page (see the hub's announcer.ts).
import { announce } from '@esa/ecology/announcer';
import { ICON_PATHS } from '@esa/ecology/icon-registry';

const DRAG_SLOP = 4;

// THE GRIP GLYPH: Lucide's `grip-vertical`, six dots — the reorder handle in
// Notion, Atlassian, Material (drag_indicator) and most current products. ≡
// was the first version, and it reads as "menu" on the web, so a reader may
// never think to drag it.
//
// The hub's icon registry has no grip, and EsaButton draws only registry
// names, so the consumer's template carries a registry icon (any one) and its
// glyph is swapped for these dots on each clone. The button, its sizing and
// its states stay the hub's; only the drawing changes. TEMPORARY: due upstream
// with the esa-sortable-list request, esassoc/ecology#39 (`grip-vertical` in icon-registry.ts).
// Once it ships, the template says icon="grip-vertical" and this goes.
const GRIP_PATHS =
  '<circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/>' +
  '<circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>';

function cloneGrip(template: HTMLTemplateElement): DocumentFragment {
  const fragment = template.content.cloneNode(true) as DocumentFragment;
  // Registry first: the spoke's icon set maps `grip-vertical`; the Lucide dots
  // above are the fallback for a registry without it (the hub's, today).
  fragment.querySelectorAll('svg').forEach((svg) => (svg.innerHTML = ICON_PATHS['grip-vertical'] ?? GRIP_PATHS));
  return fragment;
}

interface MenuEl extends HTMLElement {
  items: { label: string; action: string; disabled?: boolean; divider?: boolean }[];
}

// ---- styles, once per document ----------------------------------------------
// Light DOM throughout (the rows are the consumer's), so the rules are global
// but every selector starts at the element.
const STYLES = `
  bcn-sortable-list { display: block; }
  bcn-sortable-list [data-sort-grip] { flex: none; }
  bcn-sortable-list [data-sort-spacer] { flex: none; visibility: hidden; }
  bcn-sortable-list [data-sort-grip] button { cursor: grab; touch-action: none; }
  /* THE ROW MOVES AS ITSELF, NOT ON A PLATE (user, 2026-10-20). A lifted row
     once grew a floating card — surface, shadow, padding — the full width of
     the list, so a short "Map" became a 784px slab and the drag felt like
     moving a container that holds the item. Now nothing is added around it:
     the row keeps its own look and only the surface it already sits on goes
     behind it, so it covers the rows it passes instead of showing through. */
  bcn-sortable-list li[data-dragging] {
    position: relative;
    z-index: var(--z-dropdown, 50);
    background: var(--firma2-sheet-background, var(--color-background-default, #fcfcfc));
  }
  bcn-sortable-list li[data-dragging] [data-sort-grip] button { cursor: grabbing; }
  /* drop="line": the row stays in place, dimmed, and out of the pointer's
     way; a label with its name is what travels. */
  bcn-sortable-list[drop='line'] li[data-dragging] {
    opacity: 0.4;
    pointer-events: none;
    background: transparent;
  }
  .bcn-sortable-drag-label {
    position: fixed;
    inset-block-start: 0;
    inset-inline-start: 0;
    z-index: var(--z-dropdown, 50);
    box-sizing: border-box;
    max-inline-size: 20rem;
    padding: var(--spacing-150, 0.375rem) var(--spacing-300, 0.75rem);
    overflow: hidden;
    border: 1px solid var(--color-border-default, #cecece);
    border-radius: var(--radius-md, 0.5rem);
    background: var(--color-background-elevation-floating, var(--color-background-default, #fcfcfc));
    box-shadow: var(--elevation-4, 0 6px 24px -6px rgba(0, 0, 0, 0.18));
    color: var(--color-content-default, #202020);
    font-family: var(--typography-body-sm-font-family, inherit);
    font-size: var(--typography-body-sm-font-size, 0.875rem);
    line-height: var(--typography-body-sm-line-height, 1.4);
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
  }
  .bcn-sortable-drop-line {
    position: fixed;
    z-index: var(--z-dropdown, 50);
    block-size: 2px;
    margin-block-start: -1px;
    border-radius: 1px;
    background: var(--bcn-sortable-drop-color, var(--color-border-default-focus, #2a7e3b));
    pointer-events: none;
  }
  /* The ring at its leading end says where the line starts — which is the
     indent of the list the row would join. */
  .bcn-sortable-drop-line::before {
    content: '';
    position: absolute;
    inset-inline-start: -4px;
    inset-block-start: -3px;
    box-sizing: border-box;
    inline-size: 8px;
    block-size: 8px;
    border: 2px solid var(--bcn-sortable-drop-color, var(--color-border-default-focus, #2a7e3b));
    border-radius: 50%;
    background: var(--firma2-sheet-background, var(--color-background-default, #fcfcfc));
  }
  .bcn-sortable-drop-line[hidden] { display: none; }
  /* A row about to take the dragged one. Consumers restyle it (a tree marks
     the group's own line, not everything under it). */
  bcn-sortable-list li[data-drop-into] {
    outline: 2px solid var(--bcn-sortable-drop-color, var(--color-border-default-focus, #2a7e3b));
    outline-offset: -2px;
    border-radius: var(--radius-md, 0.5rem);
  }
  bcn-sortable-list[data-sorting] { user-select: none; cursor: grabbing; }
  bcn-sortable-list :is(ol, ul):has(> li[data-sort-key]) > li[data-sort-placeholder] { display: none; }
  @media (prefers-reduced-motion: reduce) {
    bcn-sortable-list li { transition: none !important; }
  }
`;
let styled = false;
function ensureStyles(): void {
  if (styled) return;
  const style = document.createElement('style');
  style.dataset.bcnSortableList = '';
  style.textContent = STYLES;
  document.head.appendChild(style);
  styled = true;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export class BcnSortableList extends HTMLElement {
  static observedAttributes = ['label', 'move-label'];

  #observer = new MutationObserver(() => this.#decorate());
  /** Key whose grip gets focus after the consumer's next repaint. */
  #refocus: string | null = null;
  #suppressClick = false;

  connectedCallback(): void {
    ensureStyles();
    this.#decorate();
    this.#observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-sort-actions'] });
    // Capture phase on the host runs before esa-dropdown-menu's trigger
    // listener inside its shadow root, so the click a drag ends with can be
    // eaten before it opens the menu.
    this.addEventListener('click', this.#onClickCapture, true);
    this.addEventListener('menu-action', this.#onMenuAction);
  }

  disconnectedCallback(): void {
    this.#observer.disconnect();
  }

  /** A renamed list renames every linked list's "Move to …" item. */
  attributeChangedCallback(): void {
    if (this.isConnected) this.#peers().forEach((p) => p.#decorate());
  }

  /** Every list linked to this one by `group`, this one included, in page order. */
  #peers(): BcnSortableList[] {
    const group = this.getAttribute('group');
    if (!group) return [this];
    // Only upgraded lists: while linked lists upgrade in turn, the first one's
    // attributeChangedCallback runs before its later peers are instances.
    return Array.from(document.querySelectorAll(`bcn-sortable-list[group="${CSS.escape(group)}"]`))
      .filter((p): p is BcnSortableList => p instanceof BcnSortableList);
  }

  /** Whether this list will take the row with `key` (see `refuse`). */
  #takes(key: string): boolean {
    return !(this.getAttribute('refuse') ?? '').split(/\s+/).includes(key);
  }

  get #list(): HTMLElement | null {
    return this.querySelector(':scope > ol, :scope > ul');
  }

  #rows(): HTMLLIElement[] {
    return Array.from(this.#list?.children ?? []).filter((n): n is HTMLLIElement => n instanceof HTMLLIElement);
  }

  /** Rows sit side by side and wrap, so place is reading order on two axes. */
  get #grid(): boolean {
    return this.getAttribute('layout') === 'grid';
  }

  /** Where a row's grip lives: its marked slot, or the row itself. */
  #gripHome(li: HTMLLIElement): HTMLElement {
    return li.querySelector<HTMLElement>('[data-sort-grip-slot]') ?? li;
  }

  #movable(): HTMLLIElement[] {
    return this.#rows().filter((li) => li.dataset.sortKey && !('sortLocked' in li.dataset));
  }

  #order(): string[] {
    return this.#movable().map((li) => li.dataset.sortKey!);
  }

  // ---- decoration ---------------------------------------------------------------
  #decorate(): void {
    const template = this.querySelector<HTMLTemplateElement>(':scope > template[data-sort-handle]');
    if (!template) return;
    const movable = this.#movable();
    this.#observer.disconnect();
    // A locked row gets an invisible copy of the grip, so its text starts on
    // the same line as every movable row's instead of a grip's width to the left.
    this.#rows()
      .filter((li) => 'sortLocked' in li.dataset && !li.querySelector(':scope > [data-sort-spacer]'))
      .forEach((li) => {
        const spacer = document.createElement('span');
        spacer.setAttribute('data-sort-spacer', '');
        spacer.setAttribute('aria-hidden', 'true');
        spacer.inert = true;
        spacer.append(cloneGrip(template));
        li.prepend(spacer);
      });
    movable.forEach((li, i) => {
      const home = this.#gripHome(li);
      let menu = home.querySelector<MenuEl>(':scope > [data-sort-grip]');
      if (!menu) {
        menu = document.createElement('esa-dropdown-menu') as MenuEl;
        menu.setAttribute('data-sort-grip', '');
        menu.setAttribute('position', home === li ? 'below-start' : 'below-end');
        menu.append(cloneGrip(template));
        home.prepend(menu);
        const button = menu.querySelector('button');
        button?.addEventListener('pointerdown', (e) => this.#onPointerDown(e, li));
      }
      const name = li.dataset.sortLabel ?? 'row';
      const button = menu.querySelector('button');
      button?.setAttribute('aria-label', `Move ${name}`);
      button?.setAttribute('title', 'Drag to move, or click for options');
      // A row's own actions (Duplicate, Remove, …) come first, from the
      // consumer's `data-sort-actions` JSON; they are not handled here, so
      // their `menu-action` bubbles on to the consumer.
      const own: MenuEl['items'] = li.dataset.sortActions ? JSON.parse(li.dataset.sortActions) : [];
      const items: MenuEl['items'] = [
        ...own,
        ...(own.length ? [{ label: '', action: '', divider: true }] : []),
        { label: this.#grid ? 'Move earlier' : 'Move up', action: 'up', disabled: i === 0 },
        { label: this.#grid ? 'Move later' : 'Move down', action: 'down', disabled: i === movable.length - 1 },
        { label: this.#grid ? 'Move to start' : 'Move to top', action: 'top', disabled: i === 0 },
        { label: this.#grid ? 'Move to end' : 'Move to bottom', action: 'bottom', disabled: i === movable.length - 1 },
      ];
      // `to:n` is the peer's place among ALL the other lists, refusing or not,
      // so the action still finds it.
      const peers = this.#peers().filter((p) => p !== this);
      const offered = peers.filter((p) => p.#takes(li.dataset.sortKey!));
      if (offered.length) {
        items.push({ label: '', action: '', divider: true });
        offered.forEach((p) => {
          const n = peers.indexOf(p);
          items.push({ label: p.getAttribute('move-label') ?? `Move to ${p.getAttribute('label') ?? `list ${n + 1}`}`, action: `to:${n}` });
        });
      }
      customElements.whenDefined('esa-dropdown-menu').then(() => {
        menu!.items = items;
      });
    });
    this.#observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-sort-actions'] });

    // DEFERRED TWO FRAMES, not done here. A move from the menu closes
    // esa-dropdown-menu, and its focus restore runs in its own next render —
    // aimed at the trigger it opened from, which the consumer's repaint has
    // usually just thrown away, so focus falls to <body>. Focusing now would be
    // undone by that; focusing after it settles is not.
    if (this.#refocus) {
      const key = this.#refocus;
      this.#refocus = null;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const li = this.#movable().find((r) => r.dataset.sortKey === key);
          li?.querySelector<HTMLElement>('[data-sort-grip] button')?.focus();
        }),
      );
    }
  }

  // ---- commit -------------------------------------------------------------------
  #commit(key: string, order: string[], from?: BcnSortableList): void {
    const li = this.#movable().find((r) => r.dataset.sortKey === key);
    const name = li?.dataset.sortLabel ?? 'Row';
    const where = from && from !== this ? ` ${this.getAttribute('label') ?? 'another list'},` : '';
    announce(`${name} moved to${where} ${order.indexOf(key) + 1} of ${order.length}.`);
    this.#refocus = key;
    this.dispatchEvent(new CustomEvent('sort-change', { detail: { order, key, from: from ?? this }, bubbles: true }));
    // If the consumer did not repaint, the grips still need fresh menus and focus.
    queueMicrotask(() => this.#decorate());
  }

  // ---- the menu -----------------------------------------------------------------
  #onMenuAction = (event: Event): void => {
    const action = (event as CustomEvent<string>).detail;
    const grip = (event.target as HTMLElement).closest('[data-sort-grip]');
    const li = grip?.closest('li') as HTMLLIElement | null;
    if (!li?.dataset.sortKey) return;
    if (action.startsWith('to:')) {
      event.stopPropagation();
      const peer = this.#peers().filter((p) => p !== this)[Number(action.slice(3))];
      if (!peer?.#list || !peer.#takes(li.dataset.sortKey)) return;
      // Joins the end of the list it moves to.
      peer.#list.append(li);
      peer.#commit(li.dataset.sortKey, peer.#order(), this);
      queueMicrotask(() => this.#decorate());
      return;
    }
    if (!['up', 'down', 'top', 'bottom'].includes(action)) return;
    event.stopPropagation();
    const order = this.#order();
    const key = li.dataset.sortKey;
    const from = order.indexOf(key);
    const targets: Record<string, number> = { up: from - 1, down: from + 1, top: 0, bottom: order.length - 1 };
    const target = Math.max(0, Math.min(order.length - 1, targets[action]));
    if (target === from) return;
    order.splice(from, 1);
    order.splice(target, 0, key);
    // Move the DOM too, so a consumer that does not repaint still shows it.
    const rows = this.#movable();
    const anchor = rows.filter((r) => r !== li)[target];
    if (anchor) anchor.before(li);
    else rows[rows.length - 1].after(li);
    this.#commit(key, order);
  };

  #onClickCapture = (event: MouseEvent): void => {
    if (!this.#suppressClick) return;
    this.#suppressClick = false;
    event.stopPropagation();
    event.preventDefault();
  };

  // ---- dragging -----------------------------------------------------------------
  #onPointerDown(event: PointerEvent, li: HTMLLIElement): void {
    if (event.button !== 0) return;
    const startY = event.clientY;
    const startX = event.clientX;
    const grid = this.#grid;
    const original = this.#order();
    // Where the row came from, to put it back exactly on Escape.
    const home = { parent: li.parentElement!, next: li.nextSibling };
    let dragging = false;
    // The pointer's offset inside the row, so the row stays under it as the
    // DOM reorders around it.
    let grabOffset = 0;
    let grabOffsetX = 0;

    // Rows in a column only ever shift down or up, so dx is 0 there; tiles in
    // a grid also change line.
    const flip = (siblings: HTMLElement[], mutate: () => void) => {
      const before = new Map(siblings.map((s) => [s, s.getBoundingClientRect()]));
      mutate();
      if (reducedMotion()) return;
      siblings.forEach((s) => {
        const now = s.getBoundingClientRect();
        const dy = before.get(s)!.top - now.top;
        const dx = before.get(s)!.left - now.left;
        if (!dy && !dx) return;
        s.style.transition = 'none';
        s.style.transform = `translate(${dx}px, ${dy}px)`;
        requestAnimationFrame(() => {
          s.style.transition = 'transform 150ms ease';
          s.style.transform = '';
        });
      });
    };

    let dragLabel: HTMLElement | null = null;
    const follow = (x: number, y: number) => {
      if (this.getAttribute('drop') === 'line') {
        // The row stays put; its name travels, below and beside the pointer.
        if (!dragLabel) {
          dragLabel = document.createElement('div');
          dragLabel.className = 'bcn-sortable-drag-label';
          dragLabel.setAttribute('aria-hidden', 'true');
          dragLabel.textContent = li.dataset.sortLabel ?? '';
          document.body.append(dragLabel);
        }
        dragLabel.style.transform = `translate(${Math.round(x + 14)}px, ${Math.round(y + 14)}px)`;
        return;
      }
      li.style.transform = '';
      const natural = li.getBoundingClientRect();
      li.style.transform = grid
        ? `translate(${x - grabOffsetX - natural.left}px, ${y - grabOffset - natural.top}px)`
        : `translateY(${y - grabOffset - natural.top}px)`;
    };

    // ---- drop="line": nothing moves until the drop --------------------------
    const byLine = this.getAttribute('drop') === 'line';
    let dropLine: HTMLElement | null = null;
    let marked: HTMLElement | null = null;
    /** Where the row will go on release: into `target`, before `next` (or last). */
    let pending: { target: BcnSortableList; next?: HTMLLIElement } | null = null;
    const mark = (row: HTMLElement | null): void => {
      if (marked === row) return;
      marked?.removeAttribute('data-drop-into');
      marked = row;
      row?.setAttribute('data-drop-into', '');
    };
    const showLine = (target: BcnSortableList, next: HTMLLIElement | undefined, others: HTMLLIElement[]): void => {
      const box = (target.#list ?? target).getBoundingClientRect();
      const last = others[others.length - 1];
      const y = next ? next.getBoundingClientRect().top : last ? last.getBoundingClientRect().bottom : box.top;
      if (!dropLine) {
        dropLine = document.createElement('div');
        dropLine.className = 'bcn-sortable-drop-line';
        document.body.append(dropLine);
      }
      dropLine.hidden = false;
      dropLine.style.insetBlockStart = `${Math.round(y)}px`;
      dropLine.style.insetInlineStart = `${Math.round(box.left)}px`;
      dropLine.style.inlineSize = `${Math.round(box.width)}px`;
    };
    /**
     * The row under the pointer that the dragged one could be dropped INTO,
     * BEFORE or AFTER: one whose own line holds the pointer and which carries
     * a list linked to this drag.
     */
    const overRow = (x: number, y: number, peers: BcnSortableList[]): { row: HTMLLIElement; inner?: BcnSortableList; own?: BcnSortableList; edge: 'top' | 'bottom' | '' } | null => {
      const under = document.elementFromPoint(x, y) as HTMLElement | null;
      const row = under?.closest<HTMLLIElement>('li[data-sort-key]');
      if (!row || row === li || li.contains(row)) return null;
      const inner = peers.find((p) => p.closest('li') === row);
      const own = row.parentElement?.closest('bcn-sortable-list') as BcnSortableList | null;
      // Its own line ends where the first list inside it that takes up room begins.
      const top = row.getBoundingClientRect().top;
      const lists = Array.from(row.querySelectorAll<HTMLElement>('bcn-sortable-list')).filter((l) => l.closest('li') === row && l.getBoundingClientRect().height > 0);
      const bottom = lists.length ? Math.min(...lists.map((l) => l.getBoundingClientRect().top)) : row.getBoundingClientRect().bottom;
      if (y < top || y > bottom || bottom <= top) return null;
      // A thin band at each edge means beside the row; the rest of it, into it.
      const band = Math.min(10, (bottom - top) / 4);
      const edge = y - top < band ? 'top' : bottom - y < band ? 'bottom' : '';
      return { row, inner, own: own && peers.includes(own) ? own : undefined, edge };
    };

    // ---- carrying a row past the edge of the screen ---------------------------
    const scroller = ((): HTMLElement | null => {
      for (let node = this.parentElement; node; node = node.parentElement) {
        const overflow = getComputedStyle(node).overflowY;
        if ((overflow === 'auto' || overflow === 'scroll') && node.scrollHeight > node.clientHeight) return node;
      }
      return (document.scrollingElement as HTMLElement | null) ?? null;
    })();
    let last: { x: number; y: number } | null = null;
    let scrolling = 0;
    const EDGE = 64;
    const autoScroll = (): void => {
      scrolling = 0;
      if (!dragging || !last || !scroller) return;
      const box = scroller === document.scrollingElement ? { top: 0, bottom: window.innerHeight } : scroller.getBoundingClientRect();
      // Faster the nearer the edge, up to 18px a frame.
      const up = Math.max(0, box.top + EDGE - last.y);
      const down = Math.max(0, last.y - (box.bottom - EDGE));
      const step = Math.round((Math.min(EDGE, down) - Math.min(EDGE, up)) / EDGE * 18);
      if (step) {
        const before = scroller.scrollTop;
        scroller.scrollTop += step;
        // What is under a still pointer has changed: aim again.
        if (scroller.scrollTop !== before) onMove(new PointerEvent('pointermove', { clientX: last.x, clientY: last.y }));
      }
      scrolling = requestAnimationFrame(autoScroll);
    };

    const onMove = (e: PointerEvent) => {
      if (byLine && e.isTrusted !== false) last = { x: e.clientX, y: e.clientY };
      if (!dragging) {
        const travelled = grid ? Math.hypot(e.clientX - startX, e.clientY - startY) : Math.abs(e.clientY - startY);
        if (travelled < DRAG_SLOP) return;
        dragging = true;
        grabOffset = startY - li.getBoundingClientRect().top;
        grabOffsetX = startX - li.getBoundingClientRect().left;
        li.dataset.dragging = '';
        this.dataset.sorting = '';
        if (byLine && !scrolling) scrolling = requestAnimationFrame(autoScroll);
      }
      e.preventDefault();
      const y = e.clientY;
      const x = e.clientX;
      // The list under the pointer — or, between lists, the nearest one.
      // Unlinked, that is always this list.
      // Never a list inside the dragged row itself.
      const peers = this.#peers().filter((p) => p.#takes(li.dataset.sortKey!) && !li.contains(p));
      if (byLine) {
        const over = overRow(x, y, peers);
        if (over && (over.inner || over.own)) {
          const siblings = over.own ? over.own.#movable().filter((r) => r !== li) : [];
          // The band at the top of a row of the same kind means before it;
          // anywhere else on a row that holds a list means into it.
          if (over.own && (over.edge === 'top' || !over.inner)) {
            const next = over.edge === 'bottom' ? siblings[siblings.indexOf(over.row) + 1] : over.row;
            pending = { target: over.own, next };
            mark(null);
            showLine(over.own, next, siblings);
          } else if (over.own && over.edge === 'bottom' && over.inner && !over.inner.#movable().some((r) => r !== li && r.getBoundingClientRect().height > 0)) {
            // Nothing showing inside it: the band at the bottom means after it.
            const next = siblings[siblings.indexOf(over.row) + 1];
            pending = { target: over.own, next };
            mark(null);
            showLine(over.own, next, siblings);
          } else if (over.inner) {
            pending = { target: over.inner };
            mark(over.row);
            if (dropLine) dropLine.hidden = true;
          }
          follow(x, y);
          return;
        }
      }
      const distance = (p: BcnSortableList) => {
        const r = p.getBoundingClientRect();
        return y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
      };
      // NESTED LISTS (the classification settings tree, 2026-11-23): a list
      // inside a row of another holds the pointer whenever the outer one does,
      // so on a tie the INNER list wins — over a group's contents the row goes
      // into the group, over the group's own line it goes beside it.
      const target = peers.reduce((best, p) => {
        const d = distance(p);
        const b = distance(best);
        return d < b || (d === b && best !== p && best.contains(p)) ? p : best;
      }, (li.closest('bcn-sortable-list') as BcnSortableList) ?? this);
      const others = target.#movable().filter((r) => r !== li);
      const everyRow = peers.flatMap((p) => p.#movable()).filter((r) => r !== li);
      // Find the first movable row whose midpoint is below the pointer: the
      // dragged row belongs just before it. Locked rows are never crossed —
      // they are not in `others`, and the row is only ever placed beside a
      // movable one.
      // In a grid the same question is asked in reading order: the first
      // tile on a later line, or on the pointer's line with its middle to the
      // pointer's right. A tile that is not on screen has no place to offer.
      const next = others.find((r) => {
        const rect = r.getBoundingClientRect();
        if (!grid) return y < rect.top + rect.height / 2;
        if (!rect.width) return false;
        return y < rect.top || (y <= rect.bottom && x < rect.left + rect.width / 2);
      });
      if (byLine) {
        pending = { target, next };
        // An empty list shows its placeholder row as the place to drop.
        const placeholder = others.length ? null : target.#list?.querySelector<HTMLElement>(':scope > li[data-sort-placeholder]');
        if (placeholder && placeholder.getBoundingClientRect().height > 0) {
          mark(placeholder);
          if (dropLine) dropLine.hidden = true;
        } else {
          mark(null);
          showLine(target, next, others);
        }
        follow(x, y);
        return;
      }
      const inTarget = li.parentElement === target.#list;
      const currentNext = inTarget ? target.#movable()[target.#movable().indexOf(li) + 1] : undefined;
      if (!inTarget || next !== currentNext) {
        flip(everyRow, () => {
          if (next) next.before(li);
          else if (others.length) others[others.length - 1].after(li);
          else target.#list?.append(li);
        });
      }
      follow(x, y);
    };

    const end = (cancelled: boolean) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      window.removeEventListener('keydown', onKey, true);
      dropLine?.remove();
      dropLine = null;
      dragLabel?.remove();
      dragLabel = null;
      mark(null);
      if (scrolling) cancelAnimationFrame(scrolling);
      scrolling = 0;
      if (!dragging) return;
      // drop="line": the row goes where the line or the marked row said.
      if (byLine && !cancelled && pending) {
        const { target, next } = pending;
        if (next) {
          if (next !== li && li.nextElementSibling !== next) next.before(li);
        } else if (target.#list && !(li.parentElement === target.#list && target.#movable()[target.#movable().length - 1] === li)) {
          target.#list.append(li);
        }
      }
      pending = null;
      // A drag always ends in a click on the grip; it must not open the menu.
      this.#suppressClick = true;
      setTimeout(() => (this.#suppressClick = false), 0);
      delete li.dataset.dragging;
      delete this.dataset.sorting;
      li.style.transition = reducedMotion() ? '' : 'transform 150ms ease';
      li.style.transform = '';
      li.addEventListener('transitionend', () => (li.style.transition = ''), { once: true });
      const key = li.dataset.sortKey!;
      if (cancelled) {
        home.parent.insertBefore(li, home.next);
        return;
      }
      const landed = li.closest('bcn-sortable-list') as BcnSortableList | null;
      if (landed && landed !== this) {
        landed.#commit(key, landed.#order(), this);
        queueMicrotask(() => this.#decorate());
        return;
      }
      const order = this.#order();
      if (order.join() !== original.join()) this.#commit(key, order);
    };

    const onUp = () => end(false);
    const onCancel = () => end(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dragging) {
        e.preventDefault();
        e.stopPropagation();
        end(true);
      }
    };

    // ON THE WINDOW, NOT CAPTURED ON THE GRIP. Pointer capture was the first
    // version and it broke on the first reorder: moving the row in the DOM
    // detaches the grip for an instant, the browser releases the capture, and
    // the pointerup never arrives — the row stayed lifted after the drop.
    // Window listeners also survive a quick flick off a 32px grip.
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    window.addEventListener('keydown', onKey, true);
  }
}

if (!customElements.get('bcn-sortable-list')) {
  customElements.define('bcn-sortable-list', BcnSortableList);
}
