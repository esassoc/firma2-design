/**
 * The colour-scheme preference — light, dark, or follow the operating system.
 *
 * THE HUB ALREADY OWNS THE RENDERING HALF. `theme-firma2.css` ships a full
 * `html[data-scheme="dark"][data-theme="firma2"]` block re-pointing every
 * semantic role to the olive dark ramp, and the esa-* components read those
 * roles through the shadow boundary. So nothing here paints anything: the whole
 * job is deciding what `data-scheme` should say and writing it on <html>.
 *
 * TWO ATTRIBUTES, NOT ONE, because the preference and the result are different
 * facts and "system" is only expressible as the first:
 *
 *   data-scheme="light|dark"              the RESOLVED scheme — what the CSS reads
 *   data-scheme-preference="light|dark|system"  what the reader ASKED FOR
 *
 * Collapsing them would lose the distinction the moment the OS is dark: the
 * settings control could no longer tell "System" from "Dark", and would show the
 * wrong segment selected on every reload. The preference attribute is also what
 * `watchSystemScheme` reads to decide whether an OS flip is its business.
 *
 * WHERE THE FIRST APPLICATION HAPPENS — not here. A module script is deferred,
 * so by the time this file runs the page has already painted in light and the
 * reader watches it turn dark. BaseLayout carries a duplicate of `resolve()` as
 * a blocking `is:inline` script in <head> instead. That duplication is
 * deliberate and is the standing cost of a no-flash theme; the copy is four
 * lines long and commented on both sides. Change one, change the other.
 */

export type SchemePreference = 'light' | 'dark' | 'system';

/** The localStorage key. Namespaced — the hub's docs shell uses `docs-scheme`. */
export const SCHEME_STORAGE_KEY = 'firma2-scheme';

/** The default for a reader who has never chosen: follow the OS. */
export const DEFAULT_SCHEME: SchemePreference = 'system';

const isPreference = (value: unknown): value is SchemePreference =>
  value === 'light' || value === 'dark' || value === 'system';

/**
 * The stored preference, or the default.
 *
 * localStorage throws rather than returning null in a partitioned or
 * storage-blocked context (Safari private browsing, an embedded frame), and a
 * settings page that cannot read a preference must still render — so every
 * access is guarded and failure means "never chose".
 */
export const readScheme = (): SchemePreference => {
  try {
    const stored = localStorage.getItem(SCHEME_STORAGE_KEY);
    if (isPreference(stored)) return stored;
  } catch {
    /* storage unavailable — fall through to the default */
  }
  return DEFAULT_SCHEME;
};

/** Resolve a preference to the scheme the stylesheet actually reads. */
export const resolveScheme = (preference: SchemePreference): 'light' | 'dark' => {
  if (preference !== 'system') return preference;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/** Write both attributes on <html>. Does not persist — see `setScheme`. */
export const applyScheme = (preference: SchemePreference): void => {
  const root = document.documentElement;
  root.setAttribute('data-scheme', resolveScheme(preference));
  root.setAttribute('data-scheme-preference', preference);
};

/**
 * Commit a choice: persist it, then apply it.
 *
 * No confirmation and no toast. The page repaints in the chosen scheme as the
 * attribute lands, which is the whole of the feedback this needs — a message
 * announcing a change the reader is already looking at is text about the page.
 */
export const setScheme = (preference: SchemePreference): void => {
  try {
    localStorage.setItem(SCHEME_STORAGE_KEY, preference);
  } catch {
    /* storage unavailable — the choice still applies for this page load */
  }
  applyScheme(preference);
};

/**
 * Keep a "System" reader in step with the OS while the tab is open.
 *
 * Only fires for the system preference; an explicit light or dark choice
 * outranks the OS by definition. Registered once per document, from BaseLayout,
 * so every page in the app follows — not just the settings screen.
 */
export const watchSystemScheme = (): void => {
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  query.addEventListener('change', () => {
    if (document.documentElement.getAttribute('data-scheme-preference') !== 'system') return;
    applyScheme('system');
  });
};
