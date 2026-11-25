// bcn-tile-grip — the corner you drag to size a tile on a grid. It rides the
// tile's bottom-right corner and reports how far it has been pulled; whoever
// owns the tile decides what that means (columns across, pixels down).
//
// WHY IT IS NOT bcn-edge-handle. That grip sizes ONE axis of a docked panel in
// free pixels, writes the width itself and remembers it. A tile is sized on
// two axes at once and snaps — to whole grid columns one way and to a height
// step the other — and its size belongs to the tile's own state, not to a CSS
// property this element could write. Same idiom, kept on purpose: a quiet mark
// that darkens on approach, a focusable separator, arrow keys, Escape to put
// it back.
//
// CONTRACT
//   <bcn-tile-grip label="Resize chart"></bcn-tile-grip>
//   Place it inside a position: relative tile; it pins itself to the corner.
//
//   bcn-grip-start   the pointer went down
//   bcn-grip-move    detail { dx, dy } — pixels from where the drag began
//   bcn-grip-end     the drag finished
//   bcn-grip-cancel  Escape during a drag: put the size back
//   bcn-grip-step    detail { dx, dy } — an arrow key, each -1, 0 or 1
//
// It owns the pointer capture, the keyboard map and its own mark. It owns no
// size: nothing changes unless the listener changes it.
//
// GATES. Hidden below the tablet gate (64rem), where a grid is one column and
// there is nothing to size; a 44px target under a coarse pointer; hover only
// where there is hover ([[mobile-foundation-breakpoints]]).
//
// bcn-lego-checked: no esa- lego resizes a grid tile, and bcn-edge-handle is
// the wrong shape (above). Beacon is not cloned.

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  :host {
    position: absolute;
    inset-block-end: calc(var(--spacing-200, 0.5rem) * -1);
    inset-inline-end: calc(var(--spacing-200, 0.5rem) * -1);
    inline-size: 24px;
    block-size: 24px;
    cursor: nwse-resize;
    touch-action: none;
    color: var(--color-content-subtle, #8d8d8d);
    transition: color 150ms ease-out;
    border-radius: var(--radius-sm, 4px);
  }
  /* A 10px angle bracket in the corner of the 24px target. */
  :host::after {
    content: '';
    position: absolute;
    inset-block-end: 6px;
    inset-inline-end: 6px;
    inline-size: 10px;
    block-size: 10px;
    border-inline-end: 2px solid currentColor;
    border-block-end: 2px solid currentColor;
    border-end-end-radius: 3px;
  }
  :host([dragging]) { color: var(--color-content-default, #202020); }
  :host(:focus-visible) {
    color: var(--color-content-default, #202020);
    outline: var(--focus-ring-width, 2px) solid var(--focus-ring-color, currentColor);
    outline-offset: var(--focus-ring-offset, 2px);
  }
  @media (hover: hover) {
    :host(:hover) { color: var(--color-content-default, #202020); }
  }
  @media (pointer: coarse) {
    :host { inline-size: 44px; block-size: 44px; }
  }
  @media (max-width: 64rem) {
    :host { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    :host { transition: none; }
  }
`);

export class BcnTileGrip extends HTMLElement {
  private start: { x: number; y: number } | null = null;

  connectedCallback(): void {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [sheet];
    this.setAttribute('role', 'separator');
    this.tabIndex = 0;
    if (!this.hasAttribute('aria-label')) this.setAttribute('aria-label', this.getAttribute('label') ?? 'Resize');
    this.addEventListener('pointerdown', this.onDown);
    this.addEventListener('pointermove', this.onMove);
    this.addEventListener('pointerup', this.onUp);
    this.addEventListener('pointercancel', this.onUp);
    this.addEventListener('keydown', this.onKey);
  }

  private emit(name: string, detail?: { dx: number; dy: number }): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private onDown = (e: PointerEvent): void => {
    if (e.button !== 0) return;
    this.start = { x: e.clientX, y: e.clientY };
    this.setPointerCapture(e.pointerId);
    this.toggleAttribute('dragging', true);
    this.emit('bcn-grip-start');
    e.preventDefault();
  };

  private onMove = (e: PointerEvent): void => {
    if (this.start) this.emit('bcn-grip-move', { dx: e.clientX - this.start.x, dy: e.clientY - this.start.y });
  };

  private onUp = (): void => {
    if (!this.start) return;
    this.start = null;
    this.toggleAttribute('dragging', false);
    this.emit('bcn-grip-end');
  };

  private onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.start) {
      this.start = null;
      this.toggleAttribute('dragging', false);
      this.emit('bcn-grip-cancel');
      return;
    }
    const step: Record<string, [number, number]> = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] };
    const move = step[e.key];
    if (!move) return;
    this.emit('bcn-grip-step', { dx: move[0], dy: move[1] });
    // The arrows size the tile; they must not also scroll the page.
    e.preventDefault();
    e.stopPropagation();
  };
}

if (!customElements.get('bcn-tile-grip')) customElements.define('bcn-tile-grip', BcnTileGrip);
