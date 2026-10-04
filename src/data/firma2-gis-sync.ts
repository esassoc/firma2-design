// firma2-gis-sync — the mock world of the two-way GIS sync prototype
// (components/gis/firma2-gis-sync.astro). Invented and deterministic: the
// account, how many projects each field would match, the field rows, and the
// edits that landed on both sides between two syncs.
//
// The layers themselves are the existing SHARED_LAYERS: both GIS prototypes
// read the same ArcGIS, so a reviewer comparing them compares flows, not data.

import { SHARED_LAYERS, UNMAPPED_PROJECTS } from './firma2-geography';
import { projects } from './firma2-projects';

export const ARCGIS_ACCOUNT = { org: 'Cosumnes Basin GIS', email: 'gis.admin@cosumnesbasin.example' };

/** Which side a field follows. `both` is the only one that can conflict. */
export type Direction = 'none' | 'layer' | 'app' | 'both';

export const DIRECTION_OPTIONS: { value: Direction; label: string }[] = [
  { value: 'none', label: 'Not synced' },
  { value: 'layer', label: 'Layer to ProjectFirma' },
  { value: 'app', label: 'ProjectFirma to layer' },
  { value: 'both', label: 'Either way, newest wins' },
];

/**
 * The fields a sync can carry. `layerField` is the field a freshly linked
 * layer is offered first; a row whose default the layer lacks starts unsynced.
 * Shapes have no layer field: they ARE the geometry.
 */
export interface FieldRow {
  key: string;
  label: string;
  layerField: string | null;
  direction: Direction;
}

export const FIELD_ROWS: FieldRow[] = [
  { key: 'shapes', label: 'Shapes', layerField: null, direction: 'layer' },
  { key: 'name', label: 'Project name', layerField: 'PROJ_NAME', direction: 'layer' },
  { key: 'stage', label: 'Stage', layerField: 'STATUS', direction: 'both' },
  { key: 'leadOrganization', label: 'Lead organization', layerField: 'LEAD_ORG', direction: 'app' },
  { key: 'county', label: 'County', layerField: 'COUNTY', direction: 'none' },
  { key: 'implementationStartYear', label: 'Implementation start year', layerField: 'TREAT_YR', direction: 'none' },
  { key: 'completionYear', label: 'Completion year', layerField: 'END_YR', direction: 'none' },
  { key: 'estimatedTotalCost', label: 'Estimated total cost', layerField: 'COST_EST', direction: 'none' },
];

const MAPPED = projects.length - UNMAPPED_PROJECTS.size;

/** Features each layer holds. The boundaries layer has one more than we have projects for. */
export const FEATURE_COUNTS: Record<string, number> = {
  'project-boundaries': MAPPED + 1,
  'treatment-reaches': 14,
  'monitoring-sites': 11,
};

/** The feature that matches no project, when matching on a project number. */
export const UNMATCHED_FEATURES: Record<string, string[]> = {
  'project-boundaries': ['PROJ-0193'],
};

/**
 * How many projects a field would match. Project numbers match; names miss the
 * few that were retyped; shape IDs and everything else match nothing, which is
 * exactly why they are in the list: seeing "0 of 44" is cheaper than finding
 * out after a sync.
 */
export const matchCount = (layerId: string, field: string): number => {
  if (field === 'PROJ_ID') return { 'project-boundaries': MAPPED, 'treatment-reaches': 12, 'monitoring-sites': 9 }[layerId] ?? 0;
  if (field === 'PROJ_NAME' && layerId === 'project-boundaries') return MAPPED - 9;
  return 0;
};

export const suggestJoin = (layerId: string): string => {
  const layer = SHARED_LAYERS.find((l) => l.id === layerId);
  const ranked = (layer?.fields ?? [])
    .map((f) => ({ name: f.name, n: matchCount(layerId, f.name) }))
    .sort((a, b) => b.n - a.n);
  return ranked[0]?.n ? ranked[0].name : '';
};

/**
 * What changed on both sides since the last sync. Scripted: Sync now finds the
 * ones whose field is set to "Either way", and resolving one removes it.
 */
export interface Conflict {
  project: string;
  field: string;
  layer: { value: string; at: string };
  app: { value: string; at: string };
}

export const CONFLICTS: Conflict[] = [
  {
    project: 'Bear River Gravel Augmentation',
    field: 'stage',
    layer: { value: 'Monitoring', at: '2026-10-01T14:05:00' },
    app: { value: 'Implementation', at: '2026-10-01T14:10:00' },
  },
  {
    project: 'Yuba Headwaters Fuels Reduction',
    field: 'leadOrganization',
    layer: { value: 'Yuba Headwaters Partnership Inc.', at: '2026-10-01T09:30:00' },
    app: { value: 'Yuba Headwaters Partnership', at: '2026-10-01T16:42:00' },
  },
  {
    project: 'Battle Creek Diversion Screening',
    field: 'estimatedTotalCost',
    layer: { value: '$2,040,000', at: '2026-10-01T11:15:00' },
    app: { value: '$1,985,000', at: '2026-10-01T13:20:00' },
  },
];

/** What one sync moves, in a state where every side can be reached. */
export const SYNC_COUNTS = { fromLayer: 3, toLayer: 2, staleShapes: ['Gravel injection reach'] };

export const TOTAL_PROJECTS = projects.length;
