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
// tags between tag groups. A row dragged over a linked list drops into it, and
// the grip's menu adds "Move to <label>" for every other list in the group
// (each list's `label` attribute names it, or `move-label` gives the whole
// item — "Remove from group" for the list of tags in none). An empty list stays a drop target
// if the consumer gives it a placeholder <li> with no data-sort-key; it is
// hidden as soon as the list holds a real row.
//
//   <bcn-sortable-list group="tags" label="Partners">…</bcn-sortable-list>
//   <bcn-sortable-list group="tags" label="Community">…</bcn-sortable-list>
//
// A row that lands in another list fires `sort-change` on the list it LANDED
// IN, with `detail.from` the list it left. The event bubbles, so a consumer
// with nested lists checks `event.target`.
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
  bcn-sortable-list li[data-dragging] {
    position: relative;
    z-index: var(--z-dropdown, 50);
    background: var(--color-background-elevation-floating, #fcfcfc);
    box-shadow: var(--elevation-4, 0 6px 24px -6px rgba(0, 0, 0, 0.12));
    border-radius: var(--radius-sm, 0.25rem);
    /* Room inside the shadow, taken back out of the margin so the row's
       content does not shift sideways the moment it lifts. */
    padding-inline: var(--spacing-200, 0.5rem);
    margin-inline: calc(var(--spacing-200, 0.5rem) * -1);
  }
  bcn-sortable-list li[data-dragging] [data-sort-grip] button { cursor: grabbing; }
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
    this.#observer.observe(this, { childList: true, subtree: true });
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
    return Array.from(document.querySelectorAll<BcnSortableList>(`bcn-sortable-list[group="${CSS.escape(group)}"]`));
  }

  get #list(): HTMLElement | null {
    return this.querySelector(':scope > ol, :scope > ul');
  }

  #rows(): HTMLLIElement[] {
    return Array.from(this.#list?.children ?? []).filter((n): n is HTMLLIElement => n instanceof HTMLLIElement);
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
      let menu = li.querySelector<MenuEl>(':scope > [data-sort-grip]');
      if (!menu) {
        menu = document.createElement('esa-dropdown-menu') as MenuEl;
        menu.setAttribute('data-sort-grip', '');
        menu.setAttribute('position', 'below-start');
        menu.append(cloneGrip(template));
        li.prepend(menu);
        const button = menu.querySelector('button');
        button?.addEventListener('pointerdown', (e) => this.#onPointerDown(e, li));
      }
      const name = li.dataset.sortLabel ?? 'row';
      const button = menu.querySelector('button');
      button?.setAttribute('aria-label', `Move ${name}`);
      button?.setAttribute('title', 'Drag to move, or click for options');
      const items: MenuEl['items'] = [
        { label: 'Move up', action: 'up', disabled: i === 0 },
        { label: 'Move down', action: 'down', disabled: i === movable.length - 1 },
        { label: 'Move to top', action: 'top', disabled: i === 0 },
        { label: 'Move to bottom', action: 'bottom', disabled: i === movable.length - 1 },
      ];
      const peers = this.#peers().filter((p) => p !== this);
      if (peers.length) {
        items.push({ label: '', action: '', divider: true });
        peers.forEach((p, n) =>
          items.push({ label: p.getAttribute('move-label') ?? `Move to ${p.getAttribute('label') ?? `list ${n + 1}`}`, action: `to:${n}` }),
        );
      }
      customElements.whenDefined('esa-dropdown-menu').then(() => {
        menu!.items = items;
      });
    });
    this.#observer.observe(this, { childList: true, subtree: true });

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
      if (!peer?.#list) return;
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
    const original = this.#order();
    // Where the row came from, to put it back exactly on Escape.
    const home = { parent: li.parentElement!, next: li.nextSibling };
    let dragging = false;
    // The pointer's offset inside the row, so the row stays under it as the
    // DOM reorders around it.
    let grabOffset = 0;

    const flip = (siblings: HTMLElement[], mutate: () => void) => {
      const before = new Map(siblings.map((s) => [s, s.getBoundingClientRect().top]));
      mutate();
      if (reducedMotion()) return;
      siblings.forEach((s) => {
        const dy = before.get(s)! - s.getBoundingClientRect().top;
        if (!dy) return;
        s.style.transition = 'none';
        s.style.transform = `translateY(${dy}px)`;
        requestAnimationFrame(() => {
          s.style.transition = 'transform 150ms ease';
          s.style.transform = '';
        });
      });
    };

    const follow = (y: number) => {
      li.style.transform = '';
      const natural = li.getBoundingClientRect().top;
      li.style.transform = `translateY(${y - grabOffset - natural}px)`;
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) {
        if (Math.abs(e.clientY - startY) < DRAG_SLOP) return;
        dragging = true;
        grabOffset = startY - li.getBoundingClientRect().top;
        li.dataset.dragging = '';
        this.dataset.sorting = '';
      }
      e.preventDefault();
      const y = e.clientY;
      // The list under the pointer — or, between lists, the nearest one.
      // Unlinked, that is always this list.
      const peers = this.#peers();
      const distance = (p: BcnSortableList) => {
        const r = p.getBoundingClientRect();
        return y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
      };
      const target = peers.reduce((best, p) => (distance(p) < distance(best) ? p : best), (li.closest('bcn-sortable-list') as BcnSortableList) ?? this);
      const others = target.#movable().filter((r) => r !== li);
      const everyRow = peers.flatMap((p) => p.#movable()).filter((r) => r !== li);
      // Find the first movable row whose midpoint is below the pointer: the
      // dragged row belongs just before it. Locked rows are never crossed —
      // they are not in `others`, and the row is only ever placed beside a
      // movable one.
      const next = others.find((r) => {
        const rect = r.getBoundingClientRect();
        return y < rect.top + rect.height / 2;
      });
      const inTarget = li.parentElement === target.#list;
      const currentNext = inTarget ? target.#movable()[target.#movable().indexOf(li) + 1] : undefined;
      if (!inTarget || next !== currentNext) {
        flip(everyRow, () => {
          if (next) next.before(li);
          else if (others.length) others[others.length - 1].after(li);
          else target.#list?.append(li);
        });
      }
      follow(y);
    };

    const end = (cancelled: boolean) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      window.removeEventListener('keydown', onKey, true);
      if (!dragging) return;
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
