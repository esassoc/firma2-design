// What a dashboard can start from. The workspace's Progress Dashboard is the
// first of these; a dashboard added from the rail's Dashboards group starts as
// a copy of one, or blank, and is changed from there.
//
// A template is the tiles a dashboard opens with (`shown` of them on screen;
// the rest are what Add chart brings in next, in order) and, optionally, the
// filter it opens under. Tiles name a figure and a form from the inventory in
// src/data/firma2-dashboard.ts.
//
// THE PROTOTYPE'S LIMIT, stated once: a tile is server-rendered markup, so a
// dashboard's route serves the tile set of the template it started from, and
// what an administrator changes afterwards (charts, sizes, order, filter) is
// not stored. The dashboard's name, folder and place in the rail are.

export type TileOpening = Record<string, string | number>;

export interface DashboardTemplate {
  slug: string;
  /** In Add dashboard's "Start from". */
  name: string;
  tiles: TileOpening[];
  shown: number;
  /** The filter it opens under, as a scope ('goal:Salmon & steelhead recovery'). */
  scope?: string;
}

// What Add chart offers a dashboard once its own tiles are used up — a spread
// across the inventory, so a blank dashboard is not a dead end.
const MORE: TileOpening[] = [
  { measure: 'projects', kind: 'number' },
  { measure: 'spent', kind: 'number' },
  { measure: 'acres-riparian-habitat-restored', kind: 'chart', view: 'cumulative', span: 6 },
  { measure: 'projects', kind: 'groups', split: 'stage', span: 6 },
  { measure: 'funding-secured', kind: 'groups', split: 'funder', span: 6 },
  { measure: 'reports-filed', kind: 'chart', span: 6 },
  { measure: 'work-area-acres', kind: 'groups', split: 'county', span: 6 },
  { measure: 'projects-completed', kind: 'chart', view: 'cumulative', span: 6 },
];

const template = (slug: string, name: string, tiles: TileOpening[], scope?: string): DashboardTemplate => ({
  slug,
  name,
  tiles: [...tiles, ...MORE],
  shown: tiles.length,
  scope,
});

export const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  template('blank', 'A blank dashboard', []),
  // Chosen to show the inventory's range: a count, money, a mapped acreage,
  // measures by year and as a running total, and a custom field cut by another.
  template('program-progress', 'Progress Dashboard', [
    { measure: 'projects', kind: 'number' },
    { measure: 'spent', kind: 'number' },
    { measure: 'work-area-acres', kind: 'number' },
    { measure: 'acres-riparian-habitat-restored', kind: 'number' },
    { measure: 'plant-survival-rate', kind: 'number' },
    { measure: 'acres-riparian-habitat-restored', kind: 'chart', view: 'cumulative', split: 'bd:0', span: 8 },
    { measure: 'projects', kind: 'groups', split: 'stage', span: 4 },
    { measure: 'spent', kind: 'chart', split: 'type', span: 6 },
    { measure: 'funding-secured', kind: 'groups', split: 'funder', span: 6 },
    { measure: 'cf-habitat-opened', kind: 'groups', split: 'cf-target-species', span: 6 },
    { measure: 'plant-survival-rate', kind: 'chart', span: 6 },
  ]),
  template('funding-and-spending', 'Funding and spending', [
    { measure: 'estimated-total-cost', kind: 'number' },
    { measure: 'funding-secured', kind: 'number' },
    { measure: 'spent', kind: 'number' },
    { measure: 'annual-operating-cost', kind: 'number' },
    { measure: 'spent', kind: 'chart', view: 'cumulative', span: 8 },
    { measure: 'estimated-total-cost', kind: 'groups', split: 'stage', span: 4 },
    { measure: 'funding-secured', kind: 'groups', split: 'funder', span: 6 },
    { measure: 'funding-secured', kind: 'groups', split: 'program', span: 6 },
    { measure: 'spent', kind: 'chart', split: 'type', span: 12 },
  ]),
  template(
    'salmon-recovery',
    'Salmon recovery progress',
    [
      { measure: 'projects', kind: 'number' },
      { measure: 'fish-passage-barriers-removed', kind: 'number' },
      { measure: 'stream-miles-reopened', kind: 'number' },
      { measure: 'stream-miles-instream-habitat', kind: 'number' },
      { measure: 'stream-miles-instream-habitat', kind: 'chart', view: 'cumulative', span: 8 },
      { measure: 'projects', kind: 'groups', split: 'type', span: 4 },
      { measure: 'cf-habitat-opened', kind: 'groups', split: 'cf-target-species', span: 6 },
      { measure: 'cf-structures-addressed', kind: 'groups', split: 'cf-barrier-type', span: 6 },
    ],
    'goal:Salmon & steelhead recovery',
  ),
];

export const dashboardTemplate = (slug: string): DashboardTemplate => DASHBOARD_TEMPLATES.find((t) => t.slug === slug) ?? DASHBOARD_TEMPLATES[0];
