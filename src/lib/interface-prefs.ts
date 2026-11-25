/**
 * Interface preferences — underline links, use pointer cursors.
 *
 * Two on/off settings that sit beside the theme under Preferences › Interface
 * and theme. Same shape as src/lib/scheme.ts: localStorage holds the choice, an
 * attribute on <html> carries it to the stylesheet, and a blocking inline copy
 * in BaseLayout's <head> applies it before first paint. Change the keys or the
 * attribute names here, change them there.
 *
 *   data-underline-links       present → every content link is underlined
 *   data-pointer-cursors="off" present → interactive elements keep the arrow
 *
 * Both attributes are written only for the NON-default state, so a reader who
 * never visits Preferences gets exactly the app as it shipped: links bare,
 * pointer on everything clickable.
 *
 * THE CSS LIVES IN src/styles/interface-prefs.css for the light DOM. The pointer
 * setting needs a second half: the esa-* Lit legos declare `cursor: pointer`
 * inside their shadow roots, where no page stylesheet reaches. `syncShadowCursors`
 * adopts one shared constructable sheet into every open shadow root — see it
 * below. The proper fix is a hub token (`--cursor-interactive`, esassoc/ecology#41);
 * until that exists, this is the spoke's half.
 */

export type InterfacePref = 'underlineLinks' | 'pointerCursors';

const KEYS: Record<InterfacePref, string> = {
  underlineLinks: 'firma2-underline-links',
  pointerCursors: 'firma2-pointer-cursors',
};

/** What a reader who has never chosen gets — the app as it shipped. */
const DEFAULTS: Record<InterfacePref, boolean> = {
  underlineLinks: false,
  pointerCursors: true,
};

/** Guarded: localStorage throws in a storage-partitioned context. */
export const readPref = (pref: InterfacePref): boolean => {
  try {
    const stored = localStorage.getItem(KEYS[pref]);
    if (stored === 'on') return true;
    if (stored === 'off') return false;
  } catch {
    /* storage unavailable — fall through to the default */
  }
  return DEFAULTS[pref];
};

export const applyPref = (pref: InterfacePref, on: boolean): void => {
  const root = document.documentElement;
  if (pref === 'underlineLinks') {
    root.toggleAttribute('data-underline-links', on);
  } else {
    if (on) root.removeAttribute('data-pointer-cursors');
    else root.setAttribute('data-pointer-cursors', 'off');
    syncShadowCursors();
  }
};

/** Persist, then apply. No toast — the page changes under the reader's hand. */
export const setPref = (pref: InterfacePref, on: boolean): void => {
  try {
    localStorage.setItem(KEYS[pref], on ? 'on' : 'off');
  } catch {
    /* storage unavailable — the choice still applies for this page load */
  }
  applyPref(pref, on);
};

// ── Shadow-root half of "Use pointer cursors" ────────────────────────────────
//
// The legos only ever declare pointer, not-allowed or default inside their
// shadow roots (no grab, no resize), so a blanket override is safe in there —
// it spares text entry, which keeps its I-beam, and disabled controls, which
// keep not-allowed. The sheet is EMPTY while pointers are on, so adopting it
// everywhere costs nothing until the reader turns the setting off.
const SHADOW_RULES = `
  *:not(:disabled, [aria-disabled="true"], textarea, [contenteditable],
        input:not([type="checkbox"], [type="radio"], [type="range"], [type="button"],
                  [type="submit"], [type="reset"], [type="color"], [type="file"])) {
    cursor: default !important;
  }
`;

let sheet: CSSStyleSheet | null = null;
let observing = false;
const seen = new WeakSet<ShadowRoot>();

const adopt = (root: ShadowRoot): void => {
  if (!sheet || seen.has(root)) return;
  seen.add(root);
  // Appended, never assigned: Lit sets its own sheets once in createRenderRoot,
  // which has already run by the time an element has a shadow root to find.
  root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  observe(root);
  walk(root);
};

const walk = (scope: ParentNode): void => {
  scope.querySelectorAll('*').forEach((el) => {
    if (el.shadowRoot) {
      adopt(el.shadowRoot);
    } else if (el.localName.includes('-') && !customElements.get(el.localName)) {
      // Not upgraded yet — its shadow root arrives with the definition.
      customElements.whenDefined(el.localName).then(() => {
        if (el.shadowRoot) adopt(el.shadowRoot);
      });
    }
  });
};

const observer = typeof MutationObserver === 'undefined'
  ? null
  : new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.shadowRoot) adopt(node.shadowRoot);
          walk(node);
        });
      }
    });

const observe = (scope: Node): void => {
  observer?.observe(scope, { childList: true, subtree: true });
};

/**
 * Bring every shadow root in line with the current setting. Started lazily —
 * the first time the setting is off — and kept running after, because a reader
 * can turn it off again without a reload.
 */
export const syncShadowCursors = (): void => {
  const off = document.documentElement.getAttribute('data-pointer-cursors') === 'off';
  if (!sheet) {
    if (!off) return;
    sheet = new CSSStyleSheet();
  }
  sheet.replaceSync(off ? SHADOW_RULES : '');
  if (!observing) {
    observing = true;
    observe(document);
    walk(document);
  }
};
