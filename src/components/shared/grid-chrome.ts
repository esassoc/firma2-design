// Shared AG Grid chrome — the token-mapped theme, small formatting helpers,
// and the common grid-bootstrap wiring every themed AG Grid in this spoke
// needs.
//
// Ported from cb-fish-design's src/components/shared/grid-chrome.ts, which is
// the vetted precedent for tabular surfaces across ESA spokes (AG Grid
// Community as a direct dependency, Theming API only, wireDataGrid() owning
// the create/search/CSV/count-footer bootstrap). Kept structurally identical
// on purpose so a fix in one spoke reads the same in the other; the intended
// divergences are the theme's own name, this spoke's tokens, and the count
// footer's wording (see onModelUpdated).
import { createGrid, ModuleRegistry, AllCommunityModule, themeQuartz, type ColDef, type GridApi, type GridOptions } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

// AG Grid Theming API mapped onto the spoke's semantic tokens — every themed
// grid reads like the rest of the surfaces instead of shipping its own palette.
// Deliberately NO `ag-grid-community/styles/*.css` or ag-theme-quartz import:
// the v33+ Theming API path keeps every colour flowing through var(), so a
// brand re-point or a scheme swap reaches the grid for free.
export const firma2GridTheme = themeQuartz.withParams({
  fontFamily: 'inherit',
  fontSize: '14px',
  foregroundColor: 'var(--color-content-default)',
  backgroundColor: 'var(--color-background-elevation-raised)',
  headerBackgroundColor: 'var(--color-background-elevation-sunken, transparent)',
  headerTextColor: 'var(--color-content-default-secondary)',
  headerFontWeight: 600,
  borderColor: 'var(--color-border-default)',
  rowHoverColor: 'var(--color-background-brand-subtle)',
  accentColor: 'var(--color-background-brand)',
  // The framed surface belongs to .firma2-data-grid__grid (1px border +
  // --radius-200 + overflow: hidden), so AG Grid must NOT draw a second outer
  // ring inside it. quartz defaults `wrapperBorder: true`, which stacked a
  // SQUARE 1px border just inside the wrapper's rounded one: 2px along the
  // straight edges, and only 1px around the corner arcs — where overflow:hidden
  // clips the square border away — so the frame read as if it thinned out or
  // vanished at every corner. Turning it off leaves exactly one border, and
  // wrapperBorderRadius stays 0 because the wrapper owns the rounding.
  wrapperBorder: false,
  wrapperBorderRadius: 0,
  borderRadius: 'var(--radius-100, 4px)',
});

/** Renders a Date back to a readable "Oct 1, 2020" form (more scannable than a raw slashed string). */
export const gridDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/** Whole-dollar currency for cost columns — ProjectFirma costs are budget figures, not cents. */
export const gridCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Parses a source M/D/YYYY string to a Date so date columns sort chronologically; blank/invalid -> null. */
export function asGridDate(s?: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Escapes text dropped into a cellRenderer's HTML string. */
export function escGridHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export interface DataGridWiring<T> {
  root: HTMLElement;
  /** Selector for the empty div AG Grid mounts into. */
  gridSelector: string;
  /** Selector for the <script type="application/json"> element carrying serialized row data. */
  dataSelector: string;
  columnDefs: ColDef[];
  /** Plural noun for the count footer, e.g. "projects" -> "16 projects", or "3 of 16 projects" once filtered. */
  countNoun: string;
  csvFileName: string;
  /** Selector for the search control feeding AG Grid's quick filter. */
  searchSelector?: string;
  countSelector?: string;
  csvSelector?: string;
  /** Read-only grids (no cell editing) suppress the cell focus ring; editable grids need it. */
  suppressCellFocus?: boolean;
  /** Extra grid-level callbacks a specific grid needs on top of the common
   *  bootstrap (isExternalFilterPresent/doesExternalFilterPass for chip
   *  filters, onCellValueChanged for inline editing, etc.). Merged in after
   *  the common options — must not redeclare rowData/columnDefs/onModelUpdated. */
  gridOptions?: Partial<GridOptions<T>>;
}

export interface DataGridHandle<T> {
  gridApi: GridApi<T>;
  /** The live row-data array — mutate in place (unshift/push) then call
   *  gridApi.applyTransaction and bump countState.total to keep the footer in sync. */
  data: T[];
  countState: { total: number };
}

/**
 * Wires up the create-grid + quick-search + CSV-export + count-footer
 * bootstrap every themed AG Grid data grid in this spoke shares. A caller
 * still owns and passes its own columnDefs and any grid-specific extras
 * (external chip filters, cell-edit callbacks) via `gridOptions`.
 */
export function wireDataGrid<T = unknown>(opts: DataGridWiring<T>): DataGridHandle<T> | null {
  const gridHost = opts.root.querySelector<HTMLElement>(opts.gridSelector);
  const dataEl = opts.root.querySelector<HTMLScriptElement>(opts.dataSelector);
  if (!gridHost || !dataEl) return null;

  const data: T[] = JSON.parse(dataEl.textContent ?? '[]');
  const countState = { total: data.length };

  const search = opts.searchSelector ? opts.root.querySelector<HTMLElement & { value?: string }>(opts.searchSelector) : null;
  const count = opts.countSelector ? opts.root.querySelector<HTMLElement>(opts.countSelector) : null;
  const csvBtn = opts.csvSelector ? opts.root.querySelector<HTMLElement>(opts.csvSelector) : null;

  let gridApi: GridApi<T>;
  gridApi = createGrid(gridHost, {
    theme: firma2GridTheme,
    rowData: data,
    domLayout: 'autoHeight',
    animateRows: false,
    suppressCellFocus: opts.suppressCellFocus ?? false,
    defaultColDef: { sortable: true, resizable: true, suppressHeaderMenuButton: true, getQuickFilterText: () => '' },
    columnDefs: opts.columnDefs,
    // Count reads "16 projects" at rest and "3 of 16 projects" once a filter or
    // search narrows it. The number leads: "Showing" spent the scanning position
    // on the least informative word, and "of 16" restated the total to a reader
    // who had filtered nothing.
    onModelUpdated: () => {
      let shown = 0;
      gridApi.forEachNodeAfterFilterAndSort(() => { shown += 1; });
      if (count) {
        count.textContent = shown === countState.total
          ? `${countState.total} ${opts.countNoun}`
          : `${shown} of ${countState.total} ${opts.countNoun}`;
      }
    },
    ...opts.gridOptions,
  });

  // The search control is an esa-text-field: a Lit element whose typed value
  // surfaces as `.value` on the host and bubbles an `input` event out of the
  // shadow root, so one listener covers it. Typed as a loose HTMLElement here
  // because the lego's class is not imported into this module.
  search?.addEventListener('input', () => {
    gridApi.setGridOption('quickFilterText', (search.value ?? '').trim());
  });

  csvBtn?.addEventListener('click', () => {
    gridApi.exportDataAsCsv({ fileName: opts.csvFileName });
  });

  return { gridApi, data, countState };
}
