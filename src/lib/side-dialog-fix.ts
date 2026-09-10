// Spoke-side patch for esa-side-dialog's panel geometry under current Chrome.
//
// THE BUG (hub, not ours — file via /request-lego): the lego positions its
// native <dialog> with `position: fixed; top/bottom: 16px` and an anchored
// side (`right: 16px` for position="right"), relying on the unset sides
// resolving to `auto`. Chrome's present UA stylesheet for top-layer dialogs
// supplies `inset-inline-start/end: 0` and content-based sizing, so the
// unset side is NOT auto: the panel lands flush LEFT regardless of
// `position`, and its height grows to its content — taller than the
// viewport, with the footer unreachable and no internal scroll.
//
// THE PATCH: a few declarations adopted into the lego's shadow root, stating
// what the lego already means — the anchored side wins, the height is the
// inset box. adoptedStyleSheets is this spoke's established way to reach into
// a lego's shadow DOM (the retired bcn-option-list pinned control heights the
// same way). Remove the geometry half when the hub lego clears the UA's
// insets itself.
//
// THIS SPOKE'S OWN LOOK RIDES ALONG: full-viewport-height sheets, flush to
// the screen edge, square corners — a work surface docked to the side, not a
// floating card (user-directed, 2026-08-24). The lego publishes the inset as
// --side-dialog-inset; the radius it does not, which is why the zero lives
// here beside the geometry fix rather than in each component's CSS.

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  :host { --side-dialog-inset: 0px; }
  dialog.panel { height: auto; border-radius: 0; }
  :host([position='right']) dialog.panel { left: auto; }
  :host([position='left']) dialog.panel { right: auto; }
`);

type LitLike = HTMLElement & { updateComplete?: Promise<unknown> };
type Marked = ShadowRoot & { _f2SideDialogFixed?: boolean };

/** Adopt the geometry fix into one esa-side-dialog. Idempotent. */
export async function fixSideDialog(host: HTMLElement | null): Promise<void> {
  if (!host) return;
  await (host as LitLike).updateComplete;
  const root = host.shadowRoot as Marked | null;
  if (!root || root._f2SideDialogFixed) return;
  root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  root._f2SideDialogFixed = true;
}
