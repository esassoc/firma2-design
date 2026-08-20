// Value formatters shared across this spoke's surfaces — the grid cells that
// started them, and the page sections that render the same numbers outside a
// grid.
//
// WHY THIS FILE EXISTS, rather than these living on in grid-chrome.ts where
// they were first written: grid-chrome.ts opens with
//
//     import { createGrid, ModuleRegistry, AllCommunityModule, … } from 'ag-grid-community';
//     ModuleRegistry.registerModules([AllCommunityModule]);
//
// — a top-level SIDE EFFECT. Importing anything from that module, including a
// four-line Intl.NumberFormat, pulls the entire AG Grid runtime into the bundle
// of a page that may render no grid at all. The project detail page is exactly
// that page: it shows an estimated cost and a funding table, wants the same
// dollar formatting the portfolio grid uses, and has no grid on it.
//
// The alternative that was actually reached for first — each section declaring
// its own local Intl.NumberFormat — is how "$1,240,000" in one place and
// "$1.24M" in another end up on the same screen. So the formatters move here,
// to a module with NO imports and NO side effects, and grid-chrome.ts
// re-exports them so every existing call site keeps working unchanged.

/** Renders a Date back to a readable "Oct 1, 2020" form (more scannable than a raw slashed string). */
export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/** Whole-dollar currency — ProjectFirma costs are budget figures, not cents. */
export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Parses a source M/D/YYYY string to a Date so date columns sort chronologically; blank/invalid -> null. */
export function asDate(s?: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Escapes text dropped into a string of HTML.
 *
 * Named for the hazard rather than for AG Grid: any code that builds markup by
 * concatenation needs this, and a name tied to one consumer is a name the next
 * consumer writes a second copy of.
 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
