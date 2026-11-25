// bcn-tooltip — a hover/focus tooltip that is never cut off.
//
//   <bcn-tooltip text="Stream miles reopened: 14.5 of 30 miles goal">
//     …the thing being described…
//   </bcn-tooltip>
//
// bcn-lego-checked: esa-tooltip is the lego and was tried first
// (firma2-classification-outline, 2026-11-23). It positions its bubble
// absolutely INSIDE its own wrapper, centred on the trigger, and never wraps.
// So a trigger near the edge of anything that scrolls (a table's last column)
// has its bubble cut, and text wider than 240px spills out of the bubble; the
// only placement that fit was "left", over the trigger's neighbours (user,
// 2026-11-23: "why to the left instead of underneath?"). It exposes no hook
// for either. Beacon is not cloned on this machine. bcn-tooltip is the
// reusable home; the hub request is the same behaviour on esa-tooltip.
//
// WHAT IT DOES DIFFERENTLY
//   The bubble is one element on <body>, position: fixed, so no ancestor's
//   overflow can clip it. It opens UNDER the trigger, centred on it, then is
//   pushed sideways to stay 8px inside the window, and flips above when there
//   is no room below. It wraps at 22rem instead of spilling.
//
//   THE NOTCH POINTS AT THE TRIGGER, not at the bubble's middle (user,
//   2026-11-23: among a row of rings, a bubble with no notch does not say
//   which ring it is about). When the bubble has been pushed sideways the
//   notch stays over the trigger's centre.
//
// TWO FACTS, TWO LINES: a line break in `text` is kept, so a name can sit
// over its figure (user, 2026-11-23).
//
// SAME CONTRACT AS esa-tooltip OTHERWISE
//   `text`; opens on hover (a mouse only — touch fires no hover worth
//   trusting) and on keyboard focus; Esc closes it; no timer closes it; and
//   the pointer can move from the trigger ONTO the bubble without closing it
//   (SC 1.4.13: dismissible, hoverable, persistent — a magnifier user has to
//   be able to bring the bubble into view). The first tooltip waits 300ms so a passing pointer does not
//   fire it; moving on to a neighbour within 300ms of the last one closing
//   opens at once.
//
// ASSISTIVE TECH: the bubble is wired to the trigger with aria-describedby.
// Add `labelled` when the trigger ALREADY carries the same words as its
// accessible name (a ring with role="img" and a label) — a screen reader
// would otherwise hear them twice.
//
// HOVER IS NEVER THE ONLY WAY: put `text` only where the same fact is
// reachable without a pointer.

const STYLES = `
  bcn-tooltip { display: inline-flex; }
  .bcn-tooltip__bubble {
    position: fixed;
    inset-block-start: 0;
    inset-inline-start: 0;
    z-index: var(--z-tooltip, 600);
    box-sizing: border-box;
    max-inline-size: min(22rem, calc(100vw - 16px));
    padding: var(--spacing-100, 0.25rem) var(--spacing-200, 0.5rem);
    border-radius: var(--radius-sm, 0.25rem);
    background: var(--color-background-default-knockout, #202020);
    color: var(--color-content-default-knockout, #fcfcfc);
    font-family: var(--typography-body-sm-font-family, inherit);
    font-size: var(--typography-body-sm-font-size, 0.875rem);
    line-height: var(--typography-body-sm-line-height, 1.4);
    font-variant-numeric: tabular-nums;
    /* A line break in the text is a line break in the bubble. */
    white-space: pre-line;
    text-wrap: balance;
    box-shadow: var(--elevation-4, 0 6px 24px -6px rgba(0, 0, 0, 0.07));
  }
  .bcn-tooltip__bubble[hidden] { display: none; }
  /* The gap between trigger and bubble, bridged, so the pointer crossing it
     never leaves both. */
  .bcn-tooltip__bubble::after {
    content: '';
    position: absolute;
    inset-inline: 0;
    block-size: 10px;
  }
  .bcn-tooltip__bubble[data-side='below']::after { inset-block-end: 100%; }
  .bcn-tooltip__bubble[data-side='above']::after { inset-block-start: 100%; }
  /* A rotated square half-sunk in the bubble's edge: esa-tooltip's notch. */
  .bcn-tooltip__notch {
    position: absolute;
    inset-inline-start: 0;
    inline-size: 8px;
    block-size: 8px;
    background: inherit;
    transform: translateX(var(--bcn-tooltip-notch, 0px)) rotate(45deg);
  }
  .bcn-tooltip__bubble[data-side='below'] .bcn-tooltip__notch { inset-block-start: -4px; }
  .bcn-tooltip__bubble[data-side='above'] .bcn-tooltip__notch { inset-block-end: -4px; }
  @media (forced-colors: active) {
    .bcn-tooltip__bubble { border: 1px solid CanvasText; }
    /* A bordered rotated square reads as a loose diamond: the edge suffices. */
    .bcn-tooltip__notch { display: none; }
  }
`;

const GAP = 8;
/** The notch's half-diagonal, and how near a corner it may sit. */
const NOTCH = 4;
const NOTCH_INSET = 10;
const EDGE = 8;
const OPEN_DELAY = 300;
/** How long after one closes a neighbour still opens at once. */
const WARM = 300;

let bubble: HTMLElement | null = null;
let label: HTMLElement | null = null;
let owner: BcnTooltip | null = null;
let closedAt = 0;

function ensureBubble(): HTMLElement {
  if (bubble) return bubble;
  const style = document.createElement('style');
  style.dataset.bcnTooltip = '';
  style.textContent = STYLES;
  document.head.appendChild(style);
  bubble = document.createElement('div');
  bubble.className = 'bcn-tooltip__bubble';
  bubble.id = 'bcn-tooltip-bubble';
  bubble.setAttribute('role', 'tooltip');
  bubble.hidden = true;
  label = document.createElement('span');
  const notch = document.createElement('span');
  notch.className = 'bcn-tooltip__notch';
  notch.setAttribute('aria-hidden', 'true');
  bubble.append(label, notch);
  document.body.appendChild(bubble);
  // One listener each for every tooltip on the page.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') owner?.hide();
  });
  // The trigger moved under a still pointer: a stale bubble would point at
  // nothing. Capture, so a scrolling pane inside the page counts.
  window.addEventListener('scroll', () => owner?.hide(), { capture: true, passive: true });
  window.addEventListener('resize', () => owner?.hide(), { passive: true });
  // Leaving the bubble closes it, unless the pointer went back to its trigger.
  bubble.addEventListener('pointerleave', (event) => {
    if (owner && !owner.contains(event.relatedTarget as Node | null)) owner.hide();
  });
  return bubble;
}

export class BcnTooltip extends HTMLElement {
  #timer: ReturnType<typeof setTimeout> | null = null;

  connectedCallback(): void {
    this.addEventListener('pointerenter', this.#onEnter);
    this.addEventListener('pointerleave', this.#onLeave);
    this.addEventListener('focusin', this.#onFocus);
    this.addEventListener('focusout', this.#onLeave);
  }

  disconnectedCallback(): void {
    this.removeEventListener('pointerenter', this.#onEnter);
    this.removeEventListener('pointerleave', this.#onLeave);
    this.removeEventListener('focusin', this.#onFocus);
    this.removeEventListener('focusout', this.#onLeave);
    this.hide();
  }

  get text(): string {
    return this.getAttribute('text') ?? '';
  }

  set text(value: string) {
    this.setAttribute('text', value);
  }

  /** The element the bubble describes: the first child, else the host. */
  get #trigger(): HTMLElement {
    return (this.firstElementChild as HTMLElement | null) ?? this;
  }

  #onEnter = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse') return;
    this.#schedule();
  };

  #onFocus = (): void => {
    // Keyboard focus only: a click also focuses, and the pointer path has it.
    if (this.matches(':has(:focus-visible)')) this.show();
  };

  #onLeave = (event: Event): void => {
    // Onto the bubble is not away: it stays open while the pointer is on it.
    const to = (event as PointerEvent).relatedTarget as Node | null;
    if (event.type === 'pointerleave' && bubble && to && bubble.contains(to)) return;
    this.hide();
  };

  #schedule(): void {
    if (this.#timer) clearTimeout(this.#timer);
    const warm = Date.now() - closedAt < WARM;
    if (warm) this.show();
    else this.#timer = setTimeout(() => this.show(), OPEN_DELAY);
  }

  show(): void {
    if (this.#timer) clearTimeout(this.#timer);
    this.#timer = null;
    if (!this.text || !this.isConnected) return;
    const el = ensureBubble();
    if (owner && owner !== this) owner.hide();
    owner = this;
    if (label) label.textContent = this.text;
    el.style.inlineSize = '';
    el.hidden = false;
    // SHRINK TO THE TEXT. A box whose text wraps takes its full maximum width,
    // and balancing the lines then leaves both short of it — a bubble much
    // wider than its words (user, 2026-11-23). Measure the widest line and
    // size the box to it.
    const range = document.createRange();
    range.selectNodeContents(label ?? el);
    const widest = Math.max(0, ...Array.from(range.getClientRects(), (r) => r.width));
    const style = getComputedStyle(el);
    const chrome = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    if (widest > 0) el.style.inlineSize = `${Math.ceil(widest + chrome) + 1}px`;
    if (!this.hasAttribute('labelled')) this.#trigger.setAttribute('aria-describedby', el.id);

    // Under the trigger, centred; then kept inside the window; above when
    // there is no room below.
    const at = this.#trigger.getBoundingClientRect();
    const size = el.getBoundingClientRect();
    const left = Math.min(
      Math.max(EDGE, at.left + at.width / 2 - size.width / 2),
      Math.max(EDGE, window.innerWidth - EDGE - size.width),
    );
    const below = at.bottom + GAP;
    const flip = below + size.height > window.innerHeight - EDGE;
    const top = flip ? Math.max(EDGE, at.top - GAP - size.height) : below;
    el.dataset.side = flip ? 'above' : 'below';
    el.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
    // Over the trigger's centre, wherever the bubble ended up; kept off the
    // rounded corners.
    const centre = at.left + at.width / 2 - Math.round(left);
    const notchAt = Math.min(Math.max(NOTCH_INSET, centre), size.width - NOTCH_INSET) - NOTCH;
    el.style.setProperty('--bcn-tooltip-notch', `${notchAt}px`);
  }

  hide(): void {
    if (this.#timer) clearTimeout(this.#timer);
    this.#timer = null;
    if (owner !== this) return;
    owner = null;
    closedAt = Date.now();
    if (bubble) bubble.hidden = true;
    this.#trigger.removeAttribute('aria-describedby');
  }
}

if (!customElements.get('bcn-tooltip')) customElements.define('bcn-tooltip', BcnTooltip);
