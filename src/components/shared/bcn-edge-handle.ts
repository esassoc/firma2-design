// bcn-edge-handle — the grip that rides the outer edge of a resizable panel.
// A 2px bar standing off the panel's border at the middle of the fold: drag it
// and the panel changes width. That is the whole of what it does.
//
// IT USED TO COLLAPSE TOO, AND THAT WAS THE WRONG SHAPE (changed 2026-08-24,
// user-directed, after looking at how Stripe's docs sidebar handles the same
// problem). One control carrying both jobs meant every press had to be
// classified as a click or a drag by how far it travelled, and the mark had to
// advertise both — a bar that folded into a chevron on hover, so the rest state
// promised a drag and the hover state promised a toggle. It worked, and it was
// two ideas sharing one 18px box.
//
// Stripe's answer is one control per job: an always-visible icon button INSIDE
// the panel, at the top, for collapse — and no edge control at all, because
// their sidebar does not resize. Taking that split and keeping the resize leaves
// this file with a single, honest job: the edge is where you change the width.
// The collapse lives on a button the reader can see without hunting for it.
//
// WHAT THAT SUBTRACTED, all of it welcome: the click/drag slop test, the chevron
// fold and its four rotation rules, the direction arithmetic that decided which
// way the chevron pointed, the Enter/Space toggle, the collapse-past-the-minimum
// gesture, and the "reopen at the width it was" bookkeeping that existed only
// because a drag could shut the panel on its way past the floor. The mark is one
// bar now because it only means one thing.
//
// SO THE REST STATE CAN BE QUIET. At rest this is a 2px line standing 8px off a
// 1px border — trim, until the pointer is near it. It darkens on approach and
// while dragging, and that is the only state it has. A resize grip does not need
// to announce itself louder than that: a reader who wants a wider panel goes to
// the edge between the two panes, which is exactly where this is.
//
// IT HIDES WHEN THE PANEL IS SHUT. There is nothing to resize, and a grip on the
// edge of a 48px strip would be a control for a width the reader has just said
// they do not want. It watches the panel's `collapsed` attribute for that —
// whoever set it, which is the point of watching the DOM rather than keeping a
// second copy of the state.
//
// role="separator" WITH tabindex — the ARIA window-splitter pattern, minus the
// half of it this control no longer does. A focusable separator between two
// panes with a value (the panel's width) and bounds: Left/Right resize by 16px
// (Shift: 64), Home/End go to the bounds, Escape cancels a drag in progress. The
// pattern's Enter-to-collapse went with the collapse.
//
// WHAT IT OWNS AND WHAT IT DOES NOT. It owns the grip, the pointer arithmetic,
// the keyboard map, the ARIA values, and the panel's stored GEOMETRY — both the
// width it writes and the collapsed state it merely watches. That last one looks
// like a stray responsibility and is deliberate: the collapse button is a
// toggle, and a toggle that also had to know about storage would be two
// components persisting two halves of one panel's layout under two keys. One
// element owns the geometry; the button flips an attribute and calls persist().
//
// It owns NO appearance: resizing writes ONE CSS custom property, named by the
// caller, onto an element named by the caller, and marks the panel
// `data-resizing` for the length of a drag so a panel that animates its width
// can turn that animation off while the pointer is driving it. So the same grip
// drives a hub lego it cannot see inside and a local component it has never
// heard of.
//
// CONTRACT
//   edge="start|end"   which edge of the PANEL the grip rides. A left-hand nav
//                      takes `end`; a right-hand rail takes `start`.
//   panel="<sel>"      the panel. Default: the parent element.
//   size-var="--x"     the custom property the panel's open width is written to.
//   size-host="<sel>"  where that property is written. `parent` for the panel's
//                      parent, a selector for anything else, absent for the
//                      panel itself.
//   min / max          bounds in px.
//   label="<noun>"     what the panel IS, in the reader's words — it becomes the
//                      accessible name, "Resize <label>".
//   storage-key="<k>"  persist width + collapsed under this key. Omit for none.
//   .persist()         write the panel's current geometry to that key. For the
//                      collapse button, which changes the state but does not own
//                      where it is kept.
//   `bcn-edge-change`  bubbling + composed, on every settled resize.
//
// bcn-lego-checked: no esa- lego is a resize grip — walked the catalog
// (`ls node_modules/@esa/ecology/src/components/`). esa-range-slider is a form
// control that reports a value, not a layout handle; esa-sidebar-nav owns a
// collapse state but no width control; esa-side-dialog is a transient overlay,
// not a laid-out pane. The layout primitives (.sidebar) size tracks and expose no
// interaction at all. The COLLAPSE half of this pattern is deliberately NOT here,
// precisely because a lego does fit it — esa-button in `chrome` + `iconOnly`
// mode, which is what firma2-record-rail now renders. Beacon is not cloned on
// this machine.
//
// a11y-checked: the ONE `outline: none` below is on the :host, and the very next
// rule paints the ring on `.grip` in the same state from the same three tokens
// (--focus-ring-width / -color / -offset). The ring is moved, not removed, and
// for a reason the regex cannot see: the host is a 56px-tall invisible hit box,
// so a ring on it would draw a tall lozenge around empty space either side of a
// 28px mark. Verified rendered: Tab reaches the grip (tabindex=0 below), and the
// focused grip carries a 2px brand ring at 2px offset.

/** Pointer travel, in px, below which a press is ignored rather than resizing. */
const DRAG_SLOP = 3;

/** Arrow-key step, and the Shift-modified one. */
const STEP = 16;
const STEP_LARGE = 64;

const clamp = (n: number, lo: number, hi: number): number => Math.min(Math.max(n, lo), hi);

// A constructable stylesheet, shared by every instance — one parse for the
// document however many grips it renders.
//
// SHADOW DOM, which is the one structural choice here worth defending. This
// element is created from SCRIPT at one of its two call sites (AppLayout has to
// move it next to a lego it renders through a slot), so there is no compile-time
// markup for Astro to scope styles to. A shadow root carries them instead.
// Custom properties inherit straight through the boundary, so every colour,
// radius and duration below is still the theme's — nothing is hardcoded that a
// token could say.
const SHEET = new CSSStyleSheet();
SHEET.replaceSync(`
  :host {
    /* The hit box, which is deliberately bigger than the mark: 18px across the
       edge and 56px down. Fitts's law on a target whose visible half is 2px. */
    --_hit-inline: var(--bcn-edge-handle-hit-inline, 18px);
    --_hit-block: var(--bcn-edge-handle-hit-block, 56px);
    /* The mark itself. 28px is a little under two line-heights — long enough to
       read as an intentional grip, short enough not to become a rule. */
    --_length: var(--bcn-edge-handle-length, 28px);
    --_thickness: var(--bcn-edge-handle-thickness, 2px);
    /* THE MARK CLEARS THE EDGE RATHER THAN SITTING ON IT. Centred on the border
       it read as a nick IN the rail — a 2px thickening of a 1px line, which looks
       like a rendering artefact before it looks like a control. Standing it off
       into the neighbouring pane makes it a separate object beside the line.

       --spacing-200 (8px), so the grip's centre lands 8px clear of the border:
       inside the content pane's own 24px padding on the nav's side, and inside
       the layout's 24px gutter on the record rail's, so it never reaches text or
       a card edge on either. AppLayout restates the same token — see the note
       there on why that placement cannot read this one. */
    --_gap: var(--bcn-edge-handle-gap, var(--spacing-200, 8px));

    /* DEFAULT PLACEMENT: absolutely positioned against the panel it sits inside,
       centred on the panel's own height. A panel that is a 100dvh sticky box —
       which is what both of this spoke's rails are — therefore puts the grip at
       the middle of the VIEWPORT and keeps it there.

       A caller whose panel cannot take children (a lego with a closed set of
       slots) overrides all of these and places the grip itself; that is what
       AppLayout does for the app's nav rail. Nothing below depends on how the box
       got where it is. */
    position: absolute;
    inset-block-start: 50%;
    inline-size: var(--_hit-inline);
    block-size: var(--_hit-block);
    translate: 0 -50%;

    display: flex;
    align-items: center;
    justify-content: center;

    /* One rung above the rails themselves (--z-sidebar), because the grip stands
       off the edge and sits over the neighbouring pane. */
    z-index: calc(var(--z-sidebar, 100) + 1);

    cursor: ew-resize;
    /* The drag must not be read as a scroll gesture on a touch screen. */
    touch-action: none;
    -webkit-user-select: none;
    user-select: none;

    /* A step stronger than the hairline it stands beside
       (--color-border-default-subtle on both rails), so it reads as a mark rather
       than a fleck of the border that came loose. */
    color: var(--color-border-default-strong, #bbbbbb);
    transition: color var(--transition-fast, 150ms ease);
  }

  /* Half the hit box past the edge puts the mark ON the border; the gap then
     pushes the whole box outward, away from the panel. One expression for both
     sides: an inset toward the panel's own edge going more negative always means
     "further out", whichever edge it is. */
  :host([edge='end']) { inset-inline-end: calc(var(--_hit-inline) / -2 - var(--_gap)); }
  :host([edge='start']) { inset-inline-start: calc(var(--_hit-inline) / -2 - var(--_gap)); }

  /* NOTHING TO RESIZE WHEN THE PANEL IS SHUT. The attribute is mirrored off the
     panel by #sync, so this follows whoever collapsed it — the rail's own toggle
     button, the app shell's, or a restored preference. */
  :host([collapsed]) { display: none; }

  /* Text colour on approach — the same step every secondary glyph in this spoke
     uses. Deliberately NOT the brand: resizing a rail is not the primary action
     on any screen it appears on. */
  :host(:hover),
  :host(:focus-visible),
  :host([dragging]) {
    color: var(--color-content-default-secondary, #6f6f6f);
  }

  .grip {
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: 100%;
    block-size: var(--_length);
    border-radius: var(--radius-pill, 999px);
  }

  /* THE RING IS MOVED TO THE GRIP, NOT REMOVED — see the a11y-checked note in
     the module header. The host is a 56px-tall hit box; the mark is 28px. */
  :host(:focus-visible) { outline: none; }
  :host(:focus-visible) .grip {
    outline: var(--focus-ring-width, 2px) solid var(--focus-ring-color, #3e9b4f);
    outline-offset: var(--focus-ring-offset, 2px);
  }

  /* ONE BAR, AND IT STAYS ONE BAR. It was two halves that folded into a chevron
     on hover, back when a press here also collapsed the panel — the fold was how
     the mark advertised its second job. The second job moved to a button, so the
     mark went back to meaning one thing. */
  .bar {
    inline-size: var(--_thickness);
    block-size: 100%;
    border-radius: var(--radius-pill, 999px);
    background: currentColor;
  }

  /* Forced-colors modes drop author colours; currentColor resolves to the system
     text colour, so the mark survives — but only if it is not painted as a
     background the UA replaces. Stated rather than assumed. */
  @media (forced-colors: active) {
    .bar { background: CanvasText; }
  }
`);

type Drag = {
  id: number;
  x: number;
  startWidth: number;
  moved: boolean;
};

type Stored = { w?: number; c?: boolean };

class BcnEdgeHandle extends HTMLElement {
  #panel: HTMLElement | null = null;
  #sizeHost: HTMLElement | null = null;
  #watcher: MutationObserver | null = null;
  #drag: Drag | null = null;
  /** The width last WRITTEN. Authoritative between frames — see #widthNow. */
  #width = 0;
  #built = false;

  connectedCallback(): void {
    this.#build();

    this.#panel = this.#resolve(this.getAttribute('panel')) ?? this.parentElement;
    this.#sizeHost = this.#resolveSizeHost();
    if (!this.#panel) return;

    // The splitter's own semantics. Set here rather than in markup so a caller
    // cannot forget half of them, and guarded so a caller can still override the
    // accessible name for a panel whose label is not a plain noun.
    this.setAttribute('role', 'separator');
    this.setAttribute('aria-orientation', 'vertical');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', `Resize ${this.getAttribute('label') ?? 'panel'}`);
    }
    if (this.#panel.id) this.setAttribute('aria-controls', this.#panel.id);
    this.setAttribute('aria-valuemin', String(this.min));
    this.setAttribute('aria-valuemax', String(this.max));

    this.#restore();
    this.#width = this.#width || this.#measure();

    // THE PANEL IS THE SOURCE OF TRUTH FOR COLLAPSE, and this element is not the
    // one that sets it any more — the rail's toggle button is. Watching the
    // attribute is how the grip knows to take itself off the edge of a shut
    // panel, and it works for every route into that state without either
    // component holding a reference to the other.
    this.#watcher = new MutationObserver(() => this.#sync());
    this.#watcher.observe(this.#panel, { attributes: true, attributeFilter: ['collapsed'] });

    this.addEventListener('pointerdown', this.#onPointerDown);
    this.addEventListener('pointermove', this.#onPointerMove);
    this.addEventListener('pointerup', this.#onPointerUp);
    this.addEventListener('pointercancel', this.#onPointerUp);
    this.addEventListener('keydown', this.#onKeyDown);

    this.#sync();
  }

  disconnectedCallback(): void {
    this.#watcher?.disconnect();
    this.#watcher = null;
    this.#endDrag();
  }

  get edge(): 'start' | 'end' {
    return this.getAttribute('edge') === 'start' ? 'start' : 'end';
  }
  get min(): number {
    return Number(this.getAttribute('min')) || 160;
  }
  get max(): number {
    return Number(this.getAttribute('max')) || 640;
  }
  get sizeVar(): string {
    return this.getAttribute('size-var') || '--width';
  }
  get collapsed(): boolean {
    return !!this.#panel?.hasAttribute('collapsed');
  }

  /**
   * Write the panel's current geometry to the storage key. PUBLIC because the
   * collapse button is the caller — it flips the attribute and asks this element
   * to remember it. See the module header on why the storage lives here.
   */
  persist(): void {
    this.#settle();
  }

  #build(): void {
    if (this.#built) return;
    this.#built = true;
    const root = this.attachShadow({ mode: 'open' });
    root.adoptedStyleSheets = [SHEET];
    root.innerHTML = '<span class="grip" part="grip"><span class="bar"></span></span>';
  }

  #resolve(selector: string | null): HTMLElement | null {
    if (!selector) return null;
    if (selector === 'parent') return this.parentElement;
    return document.querySelector<HTMLElement>(selector);
  }

  #resolveSizeHost(): HTMLElement | null {
    const attr = this.getAttribute('size-host');
    if (!attr) return this.#panel;
    if (attr === 'parent') return this.#panel?.parentElement ?? null;
    return this.#panel?.closest<HTMLElement>(attr) ?? document.querySelector<HTMLElement>(attr);
  }

  #measure(): number {
    return this.#panel?.getBoundingClientRect().width ?? 0;
  }

  /**
   * The panel's width for arithmetic — the value last written, not the box on
   * screen. Both rails ANIMATE their width, so a rect read taken a frame after a
   * change returns a number part-way through a 200ms ease. Stepping from that
   * made every arrow key after the first move by less than a step (measured: two
   * ArrowRights from 200 landed on 216 instead of 232, because the second read
   * the first still in flight). During a drag the two agree, because the drag
   * turns the panel's transition off — which is why the drag is the one place
   * that still corrects #width from the rendered box.
   */
  #widthNow(): number {
    return this.#width || this.#measure();
  }

  #writeWidth(px: number): void {
    this.#width = Math.round(px);
    this.#sizeHost?.style.setProperty(this.sizeVar, `${this.#width}px`);
  }

  /** Mirror the panel's collapsed state onto this element, and the ARIA value. */
  #sync(): void {
    this.toggleAttribute('collapsed', this.collapsed);
    this.setAttribute('aria-valuenow', String(Math.round(this.#widthNow())));
  }

  /** Persist, and tell the page. Called once per settled change, never per frame. */
  #settle(): void {
    const key = this.getAttribute('storage-key');
    if (key) {
      try {
        const state: Stored = { w: this.#width, c: this.collapsed };
        localStorage.setItem(`bcn-edge-handle:${key}`, JSON.stringify(state));
      } catch {
        // A blocked or full store is not a reason to break the control.
      }
    }
    this.dispatchEvent(
      new CustomEvent('bcn-edge-change', {
        bubbles: true,
        composed: true,
        detail: { collapsed: this.collapsed, width: this.#width },
      }),
    );
  }

  #restore(): void {
    const key = this.getAttribute('storage-key');
    if (!key) return;
    try {
      const raw = localStorage.getItem(`bcn-edge-handle:${key}`);
      if (!raw) return;
      const state = JSON.parse(raw) as Stored;
      if (typeof state.w !== 'number' && !state.c) return;
      // RESTORE IS NOT A CHANGE THE READER MADE, so it must not be animated. The
      // stored width lands after first paint — unavoidable without an inline
      // blocking script — and a panel that eased from its default to the stored
      // width on every page load would read as the layout settling. The same
      // `data-resizing` flag the drag uses suppresses it for one frame.
      this.#panel?.setAttribute('data-resizing', '');
      if (typeof state.w === 'number') this.#writeWidth(clamp(state.w, this.min, this.max));
      if (state.c) this.#panel?.setAttribute('collapsed', '');
      requestAnimationFrame(() => {
        if (!this.#drag) this.#panel?.removeAttribute('data-resizing');
      });
    } catch {
      // Corrupt or unreadable state falls back to whatever the CSS says.
    }
  }

  #onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 || !this.#panel) return;
    // Stops the press from selecting text across the two panes, and from being
    // read as the start of a native drag.
    //
    // DELIBERATELY NOT this.focus(). Pointer capture does not need it, and
    // calling it from a pointerdown handler left a focus ring painted around the
    // grip after every press — Chrome treats a script-moved focus on a non-text
    // element as keyboard-initiated, so :focus-visible matched a mouse press.
    // Escape still has to reach the drag, so that listener goes on the window for
    // as long as the drag lasts rather than relying on the element having focus.
    event.preventDefault();
    this.setPointerCapture(event.pointerId);
    window.addEventListener('keydown', this.#onDragKey);
    this.#drag = { id: event.pointerId, x: event.clientX, startWidth: this.#measure(), moved: false };
    this.setAttribute('dragging', '');
    // The panel's cue to stop animating its own width for the duration — see the
    // module header. The panel decides what that means; this only says when.
    this.#panel.setAttribute('data-resizing', '');
    // On the ROOT, so the cursor holds while the pointer is over the other pane.
    document.documentElement.style.cursor = 'ew-resize';
  };

  #onPointerMove = (event: PointerEvent): void => {
    const drag = this.#drag;
    if (!drag || event.pointerId !== drag.id) return;
    const travel = event.clientX - drag.x;
    // The slop is no longer a click/drag test — there is no click here any more.
    // It is just a dead zone, so a press that wobbles by a pixel does not nudge
    // the panel by a pixel.
    if (!drag.moved && Math.abs(travel) <= DRAG_SLOP) return;
    drag.moved = true;

    // A `start` grip is on the panel's LEFT edge, so rightward travel makes the
    // panel narrower. One sign flip is the whole of the difference between the
    // two sides of the screen.
    const raw = drag.startWidth + (this.edge === 'end' ? travel : -travel);
    this.#writeWidth(clamp(raw, this.min, this.max));

    // THE LAYOUT GETS THE LAST WORD ON THE WIDTH. `min` and `max` are the panel's
    // own bounds; they are not the only ones. A track can also be capped by the
    // space its neighbour is owed — the record rail caps its basis at whatever is
    // left after the main column's minimum — and when that cap bites, the
    // property says one number and the box is another. Left alone, the drag would
    // keep writing widths the panel cannot take, and the edge would sit still
    // under a pointer that is still moving.
    //
    // So the written width is corrected to the RENDERED one, every frame it
    // differs. The drag's anchor is the width at pointerdown and never moves, so
    // this cannot drift: pulling back the same distance returns the same width.
    const rendered = this.#measure();
    if (rendered > 0 && Math.abs(rendered - this.#width) > 1) this.#writeWidth(rendered);
    this.#sync();
  };

  #onPointerUp = (event: PointerEvent): void => {
    const drag = this.#drag;
    if (!drag || event.pointerId !== drag.id) return;
    this.#endDrag();
    if (drag.moved) this.#settle();
    this.#sync();
  };

  /**
   * Escape, and only Escape, for the length of a drag. Separate from the
   * element's own key map because this one is on the WINDOW: an arrow key
   * reaching the panel from anywhere on the page mid-drag would be a surprise.
   */
  #onDragKey = (event: KeyboardEvent): void => {
    const drag = this.#drag;
    if (event.key !== 'Escape' || !drag) return;
    event.preventDefault();
    // Put the panel back where the drag found it — the same undo a native window
    // splitter gives, and the reason the start width is recorded.
    const { startWidth } = drag;
    this.#endDrag();
    this.#writeWidth(startWidth);
    this.#sync();
  };

  #endDrag(): void {
    const drag = this.#drag;
    if (!drag) return;
    window.removeEventListener('keydown', this.#onDragKey);
    if (this.hasPointerCapture(drag.id)) this.releasePointerCapture(drag.id);
    this.#drag = null;
    this.removeAttribute('dragging');
    this.#panel?.removeAttribute('data-resizing');
    document.documentElement.style.cursor = '';
  }

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this.#writeWidth(event.key === 'Home' ? this.min : this.max);
      this.#sync();
      this.#settle();
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const step = (event.shiftKey ? STEP_LARGE : STEP) * (event.key === 'ArrowRight' ? 1 : -1);
    // Same sign flip as the drag: on a `start` grip, rightward narrows.
    const delta = this.edge === 'end' ? step : -step;
    this.#writeWidth(clamp(this.#widthNow() + delta, this.min, this.max));
    this.#sync();
    this.#settle();
  };
}

if (!customElements.get('bcn-edge-handle')) {
  customElements.define('bcn-edge-handle', BcnEdgeHandle);
}

export {};
