// Grid defaults — the workspace's own column layout for each data table.
//
// WHERE THIS CAME FROM. Hackathon team 3 made ProjectFirma2's grids
// configurable in three layers: the columns a grid ships with (code), the
// tenant's default (this), and a person's own arrangement. Each layer is a
// DELTA over the one below — `{ order, hidden }` — never an absolute list, so
// a column added to the code next release still reaches a tenant that already
// arranged its grid: it lands at the end, switched on. The team's
// project types (firma2-project-types.ts) use the same
// grammar for page sections, and that sameness was their headline: one way
// to arrange things, everywhere.
//
// THE PERSONAL LAYER (Settings › Preferences) sits on top, and is the one
// layer that is NOT a pure delta: once a person reorders, their order stands;
// once they switch a column, their whole shown/hidden set stands. Either part
// left untouched keeps following the workspace — so an administrator's later
// change still reaches everyone who only changed the other half.
//
// THE IDENTIFYING COLUMN IS PINNED. A row with no name is a row nobody can
// find, so a grid's first column is always first and always shown.

export interface GridColumn {
  /** The AG Grid colId — stable, and what a stored delta keys on. */
  key: string;
  /** The header as written; renameable nouns resolve through the vocabulary. */
  label: string;
  pinned?: boolean;
}

export interface GridDefinition {
  key: string;
  label: string;
  /** The page the grid lives on, base-less. */
  page: string;
  columns: GridColumn[];
}

export const GRIDS: GridDefinition[] = [
  {
    key: 'projects',
    label: 'Projects',
    page: '/prototypes/projects',
    columns: [
      { key: 'projectName', label: 'Project', pinned: true },
      { key: 'projectType', label: 'Project type' },
      { key: 'classifications', label: 'Classifications' },
      { key: 'leadOrganization', label: 'Lead organization' },
      { key: 'county', label: 'County' },
      { key: 'stage', label: 'Stage' },
      { key: 'timeline', label: 'Timeline' },
      { key: 'estimatedTotalCost', label: 'Estimated cost' },
    ],
  },
  {
    key: 'performance-measures',
    label: 'Performance measures',
    page: '/prototypes/workspace-settings/performance-measures',
    columns: [
      { key: 'name', label: 'Measure', pinned: true },
      { key: 'unit', label: 'Unit' },
      { key: 'status', label: 'Status' },
    ],
  },
];

export const getGrid = (key: string): GridDefinition | undefined => GRIDS.find((g) => g.key === key);

export interface ColumnsDelta {
  order?: string[];
  hidden?: string[];
}

/**
 * Fold a delta over a grid's columns: the pinned column first, then the
 * delta's order (unknown keys dropped), then anything it never placed, in
 * code order — which is how a new column reaches an arranged grid.
 */
export const resolveColumns = (grid: GridDefinition, delta: ColumnsDelta = {}): { column: GridColumn; visible: boolean }[] => {
  const byKey = new Map(grid.columns.map((c) => [c.key, c]));
  const pinned = grid.columns.filter((c) => c.pinned);
  const order = (delta.order ?? []).map((k) => byKey.get(k)).filter((c): c is GridColumn => !!c && !c.pinned);
  const rest = grid.columns.filter((c) => !c.pinned && !order.includes(c));
  const hidden = new Set(delta.hidden ?? []);
  return [...pinned, ...order, ...rest].map((column) => ({ column, visible: column.pinned || !hidden.has(column.key) }));
};

/**
 * The columns a person sees: the workspace default folded over the code, then
 * their own choices over that. `personal.order` and `personal.hidden` each
 * REPLACE the workspace's when present; a column neither layer has placed
 * still lands at the end, shown.
 */
export const resolveLayered = (
  grid: GridDefinition,
  workspace: ColumnsDelta = {},
  personal: ColumnsDelta = {},
): { column: GridColumn; visible: boolean }[] => {
  const base = resolveColumns(grid, workspace);
  const arranged: GridDefinition = { ...grid, columns: base.map((r) => r.column) };
  const hidden = personal.hidden ?? base.filter((r) => !r.visible).map((r) => r.column.key);
  return resolveColumns(arranged, { order: personal.order, hidden });
};
