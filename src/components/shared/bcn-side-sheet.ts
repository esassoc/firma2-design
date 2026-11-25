// bcn-side-sheet — esa-side-dialog, docked. The same element in every respect a
// caller touches (heading, size, the default and footer slots, show(), close(),
// the bubbling `close` event), so moving a sheet onto the page is a tag rename.
// What changes is where it lives: not floating over a scrim, but ON the page —
// the content sheet gives up its right-hand column and this sits in the room
// it made, under the top bar, one hairline between them.
//
// EVERY SLIDE SHEET IS THIS (user, 2026-10-20, starting from Custom fields):
// an edit sheet works on what is beside it, so the list or record it edits has
// to stay in view and live. A modal scrim hid the very row being changed.
// ALWAYS UNDER THE TOP BAR (user, same day): the bar is the page's own top and
// spans the whole sheet, the rail included.
//
// IT IS firma2-rail, IN closes MODE, restated for a shadow root (user, same
// day: "a rail is a rail"). An .astro component cannot render inside a Lit
// element, so the geometry, the control and the motion are repeated here with
// firma2-rail's numbers — keep the two in step:
//   - the toggle (panel-right, a 40px md chrome button, 18px icon) INSIDE the
//     sheet at its header's trailing end — never a chevron on the border,
//     never a header X (user: neither that icon nor that spot);
//   - pressed, the sheet eases down to the strip that holds the toggle, and
//     then leaves the page;
//   - opening eases up from the strip, and the content comes back only once
//     the width has landed (data-opening), so there is a width to animate.
// Done / Cancel / Add in the footer still close it — through the same motion.
//
// HOW IT DOCKS. The host is a fixed box inside the pane's right edge: from the
// bar's bottom to the pane's, left of the pane's scrollbar. AppLayout reserves
// the room — while a sheet is open the pane's end padding grows by the sheet's
// current width (the strip, while collapsed) and the top bar's bleed grows to
// match, so the bar still runs edge to edge and nothing under it is covered.
// On show() the sheet writes its width (the lego's sm/md/lg ladder, or a
// caller's --side-dialog-width) onto the frame as --firma2-side-sheet-size, so
// the pane and the sheet read one number. Below 64rem there is no room for two
// columns: it lies over the pane instead, still without a scrim, and opens and
// closes without the width motion.
//
// IT TAKES THE RAIL'S PLACE (user, 2026-10-21). A record with a pinned
// firma2-rail used to get two right-hand columns — the rail, then this beside
// it. Never two: on show() the page's pinned rail steps out (data-sheet-over —
// its collapsed state untouched) and the sheet starts at the rail's width
// (data-from-rail, --firma2-side-sheet-from) instead of the strip, so one
// column eases from the rail's width to the sheet's. Closing runs it back:
// down to the rail's width, then the rail returns exactly as it was, open or
// strip. While the sheet is open the rail cannot be reached. Pages with no
// rail, and the narrow overlay, are unchanged.
//
// NON-MODAL. The native <dialog> is opened with show(), not showModal(): no top
// layer, no inert page, no light dismiss (closedby is stripped — a click on the
// table must not close the sheet editing it). Escape closes it while focus is
// inside, and focus goes back to whatever opened it. One sheet at a time.
//
// RESIZABLE like every rail: a bcn-edge-handle on its leading edge writes
// --firma2-side-sheet-width onto the app frame, remembered per viewer.
//
// bcn-lego-checked: esa-side-dialog IS the lego — this subclasses it (as
// bcn-radio-group does esa-radio-group) and changes only how it opens and where
// it sits; esa-dialog is modal too, and no esa- lego is a docked edit sheet.
// firma2-rail is the spoke's rail but is an .astro component that must sit in
// the page's `.sidebar` track, so a sheet owned by a component deep in the page
// cannot use it directly. Beacon is not cloned.
import { css } from 'lit';
import { EsaSideDialog } from '@esa/ecology/esa-side-dialog';
import { iconSvg } from '@esa/ecology/icon-registry';
import './bcn-edge-handle';

const NARROW = '(max-width: 64rem)';

export class BcnSideSheet extends EsaSideDialog {
  static styles = [
    ...(Array.isArray(EsaSideDialog.styles) ? EsaSideDialog.styles : [EsaSideDialog.styles]),
    css`
      :host {
        position: fixed;
        /* Straight under the app bar, even on a page with a record bar: the
           sheet sits outside the pane, and the record bar narrows with the
           pane to end where the sheet begins. */
        inset-block-start: calc(var(--firma2-gutter, 0px) + var(--firma2-band-height, 48px));
        /* Down to the pane's foot, not the window's: the utility bar
           (firma2-utility-bar) runs under the pane, and a sheet to the window
           edge covered its Recent, Help and Shortcuts. */
        inset-block-end: max(var(--firma2-gutter, 0px), var(--firma2-utility-height, 0px));
        /* Inside the pane's scrollbar, as a rail in the pane would be. */
        inset-inline-end: calc(var(--firma2-gutter, 0px) + var(--firma2-pane-scrollbar, 0px));
        inline-size: var(--firma2-side-sheet-width, var(--firma2-side-sheet-size, 400px));
        box-sizing: border-box;
        z-index: calc(var(--z-header, 200) + 1);
        /* The rail's surface and hairline (user, 2026-11-16): a sheet stands in
           the rail's slot, so it paints what firma2-rail paints — neutral
           step 2 in both modes and a subtle leading border. */
        border-end-end-radius: var(--radius-lg, 12px);
        border-inline-start: var(--border-width-default, 1px) solid var(--color-border-default-subtle);
        background: var(--firma2-neutral-2, var(--color-background-default, #f8f8f8));
        overflow: visible;
        transition: inline-size var(--transition-base, 200ms ease);
      }
      :host(:not([open])) {
        display: none;
      }
      :host([data-resizing]) {
        transition: none;
      }

      /* The dialog fills the host; the host is the box. */
      dialog.panel {
        position: static;
        inline-size: 100%;
        block-size: 100%;
        border-radius: inherit;
        background: transparent;
        box-shadow: none;
        animation: none;
        transition: none;
      }

      /* ---- THE STRIP ---- firma2-rail's --_collapsed: the toggle and its margins. */
      :host([collapsed]) {
        inline-size: calc(2.5rem + 2 * var(--spacing-200, 0.5rem) + var(--border-width-default, 1px));
      }
      /* Taking a rail's place: the strip's part is played by the rail's width. */
      :host([collapsed][data-from-rail]) {
        inline-size: var(--firma2-side-sheet-from);
      }
      :host([collapsed]) dialog.panel,
      :host([data-opening]) dialog.panel {
        display: none;
      }
      /* The content fades in once the width has landed. */
      dialog.panel {
        animation: bcn-side-sheet-in var(--transition-base, 200ms ease);
      }
      @keyframes bcn-side-sheet-in {
        from {
          opacity: 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        dialog.panel {
          animation: none;
        }
      }

      /* ---- THE TOGGLE ---- firma2-rail__toggle, restated: inside, at the
         header's trailing end; the sheet is anchored there, so it stays put
         as the sheet eases to the strip that keeps it. */
      .toggle {
        position: absolute;
        inset-block-start: var(--spacing-300, 0.75rem);
        inset-inline-end: var(--spacing-500, 1.5rem);
        z-index: 1;
        display: grid;
        place-items: center;
        inline-size: 40px;
        block-size: 40px;
        padding: 0;
        border: var(--border-width-default, 1px) solid transparent;
        border-radius: var(--radius-sm, 4px);
        background: transparent;
        color: var(--color-content-default, #202020);
        cursor: pointer;
        transition: inset-inline-end var(--transition-base, 200ms ease);
      }
      :host([collapsed]) .toggle {
        inset-inline-end: var(--spacing-200, 0.5rem);
      }
      @media (hover: hover) and (pointer: fine) {
        .toggle:hover {
          background: var(--color-background-elevation-sunken, #f0f0f0);
        }
      }

      .toggle:active {
        background: var(--color-background-elevation-sunken, #f0f0f0);
      }
      .toggle:focus-visible {
        outline: var(--focus-ring-width, 2px) solid var(--focus-ring-color, #3e9b4f);
        outline-offset: var(--focus-ring-offset, 2px);
      }
      .header {
        padding-inline-end: calc(var(--spacing-500, 1.5rem) + 40px + var(--spacing-200, 0.5rem));
      }

      /* NO ROOM FOR TWO COLUMNS: over the pane, still under the bar and
         without a scrim. */
      @media (max-width: 64rem) {
        :host {
          inset-inline-start: var(--firma2-pane-start, 0px);
          inline-size: auto;
          border-inline-start: none;
          border-end-start-radius: var(--radius-lg, 12px);
          transition: none;
        }
        ::slotted(bcn-edge-handle) {
          display: none;
        }
      }
    `,
  ];

  #opener: HTMLElement | null = null;
  /** Bumped by every show/close, so a motion that finishes late does not act on a newer one. */
  #turn = 0;
  #toggle: HTMLButtonElement | null = null;
  /** The page rail this sheet has taken the place of, while open. */
  #rail: HTMLElement | null = null;

  constructor() {
    super();
    // The toggle at the header's end is the way out; the lego's header X is not.
    this.showCloseButton = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this.#onKeyDown);
    if (!this.querySelector(':scope > bcn-edge-handle')) {
      const grip = document.createElement('bcn-edge-handle');
      grip.setAttribute('edge', 'start');
      grip.setAttribute('size-var', '--firma2-side-sheet-width');
      grip.setAttribute('size-host', '.firma2-app-frame');
      grip.setAttribute('min', '320');
      grip.setAttribute('max', '640');
      grip.setAttribute('label', 'side sheet');
      grip.setAttribute('storage-key', 'side-sheet');
      grip.slot = 'grip';
      this.append(grip);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.#onKeyDown);
  }

  #dialog(): HTMLDialogElement | null {
    return (this.renderRoot as ShadowRoot).querySelector('dialog');
  }

  firstUpdated(): void {
    this.#dialog()?.removeAttribute('closedby');
    // The toggle and the grip sit outside the dialog, so the strip keeps the toggle.
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'toggle';
    toggle.innerHTML = iconSvg('panel-right', 18) ?? '';
    toggle.addEventListener('click', () => this.close());
    this.#toggle = toggle;
    this.#syncToggle();
    const slot = document.createElement('slot');
    slot.name = 'grip';
    this.renderRoot.append(toggle, slot);
  }

  updated(changed: Map<string, unknown>): void {
    if (changed.has('heading')) this.#syncToggle();
    if (!changed.has('open') && !changed.has('closing')) return;
    const el = this.#dialog();
    if (!el) return;
    // The lego's open/close sync, with show() in place of showModal().
    const shouldBeOpen = this.open || this.closing;
    if (shouldBeOpen && !el.open) el.show();
    else if (!shouldBeOpen && el.open) el.close();
  }

  #syncToggle(): void {
    if (!this.#toggle) return;
    const name = `Close ${(this.heading || 'side sheet').toLowerCase()}`;
    this.#toggle.setAttribute('aria-label', name);
    this.#toggle.title = name;
  }

  /** Hold the pane's room still for the frame a rail and this sheet trade places. */
  #swap(): void {
    const frame = this.closest<HTMLElement>('.firma2-app-frame');
    frame?.setAttribute('data-sheet-swapping', '');
    requestAnimationFrame(() => requestAnimationFrame(() => frame?.removeAttribute('data-sheet-swapping')));
  }

  /** Resolve once the host's width transition ends (or at once, with none running). */
  #settled(): Promise<void> {
    // Chrome reports the logical property by its physical name.
    const track = this.getAnimations().find((a) => ['inline-size', 'width'].includes((a as CSSTransition).transitionProperty));
    return track ? track.finished.then(() => undefined, () => undefined) : Promise.resolve();
  }

  show(): void {
    document.querySelectorAll<BcnSideSheet>('bcn-side-sheet[open]').forEach((s) => s !== this && s.close());
    const active = document.activeElement;
    this.#opener = active instanceof HTMLElement && active !== document.body && !this.contains(active) ? active : this.#opener;
    const frame = this.closest<HTMLElement>('.firma2-app-frame');
    // The lego's resolved width — its size ladder or a caller's
    // --side-dialog-width — handed to the frame, which reserves that much room.
    const width = getComputedStyle(this).getPropertyValue('--_width').trim();
    if (width) frame?.style.setProperty('--firma2-side-sheet-size', width);
    const pane = frame?.querySelector<HTMLElement>('.esa-app-shell__content');
    if (pane) {
      // A classic (non-overlay) scrollbar keeps its track to the sheet's right.
      frame!.style.setProperty('--firma2-pane-scrollbar', `${pane.offsetWidth - pane.clientWidth}px`);
      // Where the pane begins, for the narrow overlay — it covers the page, not the nav.
      frame!.style.setProperty('--firma2-pane-start', `${Math.round(pane.getBoundingClientRect().left)}px`);
    }

    // The page's pinned rail, still showing or already stepped out for a sheet
    // this one replaces: its width is where this sheet starts.
    const rail = matchMedia(NARROW).matches
      ? null
      : (frame ?? document).querySelector<HTMLElement>(
          '[data-rail][data-sheet-over], [data-rail]:not([hidden]):not([data-unpinned])',
        );
    if (rail && !this.open) {
      if (!rail.hasAttribute('data-sheet-over')) {
        frame?.style.setProperty('--firma2-side-sheet-from', `${Math.round(rail.getBoundingClientRect().width)}px`);
        rail.setAttribute('data-sheet-over', '');
      }
      this.#rail = rail;
      this.setAttribute('data-from-rail', '');
      // The swap itself is instant: the pane's room jumps to the rail's width
      // in the frame the rail leaves, and only then eases.
      this.#swap();
    }

    const turn = ++this.#turn;
    if (this.open || matchMedia(NARROW).matches) {
      this.removeAttribute('collapsed');
      super.show();
      return;
    }
    // In at the strip, then ease open; the content comes back when it lands.
    this.setAttribute('collapsed', '');
    super.show();
    void this.updateComplete.then(() => {
      if (turn !== this.#turn) return;
      void this.offsetWidth;
      // The rail's room has landed; from here the room eases with the sheet.
      frame?.removeAttribute('data-sheet-swapping');
      this.dataset.opening = '';
      this.removeAttribute('collapsed');
      void this.#settled().then(() => {
        if (turn !== this.#turn) return;
        delete this.dataset.opening;
        // The dialog's own focusing steps ran while its box was still the
        // strip and found nothing; a keyboard reader is owed a way in.
        if (!this.matches(':focus-within')) this.#toggle?.focus();
      });
    });
  }

  close(): void {
    if (!this.open) return;
    const hadFocus = this.matches(':focus-within');
    const turn = ++this.#turn;
    const finish = (): void => {
      if (turn !== this.#turn) return;
      super.close();
      this.removeAttribute('collapsed');
      this.removeAttribute('data-from-rail');
      delete this.dataset.opening;
      // The rail comes back as it was — unless another sheet has taken its place.
      const replaced = [...document.querySelectorAll<BcnSideSheet>('bcn-side-sheet')].some((s) => s !== this && s.open);
      if (this.#rail && !replaced) {
        this.#swap();
        this.#rail.removeAttribute('data-sheet-over');
      }
      this.#rail = null;
      if (hadFocus && this.#opener?.isConnected) this.#opener.focus();
    };
    if (matchMedia(NARROW).matches) {
      finish();
      return;
    }
    // Down to the strip (or the rail's width), then out of the page.
    this.setAttribute('collapsed', '');
    void this.#settled().then(finish);
  }

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || event.defaultPrevented || !this.open) return;
    event.preventDefault();
    this.close();
  };
}

if (!customElements.get('bcn-side-sheet')) {
  customElements.define('bcn-side-sheet', BcnSideSheet);
}

declare global {
  interface HTMLElementTagNameMap {
    'bcn-side-sheet': BcnSideSheet;
  }
}
