// Geography for the work-area screens — ported from ProjectFirma2 hackathon
// team 2 (geospatial), reworked against this spoke's portfolio.
//
// THE MISSION'S THREE KINDS OF GEOSPATIAL DATA, and where each lives here:
//
//   1. REFERENCE LAYERS (display only) — REFERENCE_LAYERS. Hydrologic regions
//      and subwatersheds draw on every map; a third, inactive layer shows what
//      "kept but offered nowhere" looks like in settings.
//   2. SPATIAL CLASSIFICATIONS (roll-ups) — HYDROLOGIC_REGIONS. A project
//      belongs to the region its location falls in, which is what makes
//      "how many projects in this region" answerable from a point alone.
//   3. PROJECT FOOTPRINTS (authored) — seedWorkAreas(), plus whatever a person
//      draws, types, adopts or uploads (src/lib/work-areas.ts keeps those).
//
// INVENTED, NEVER DERIVED. The region and subwatershed rings are hand-drawn
// simplifications around real names — coarse on purpose, and labelled so on
// the coverage card. Nothing is traced from a published boundary. Town
// coordinates in PLACES are public gazetteer facts, rounded.
//
// Deterministic: literal arrays and index-seeded shapes, no randomness.

import { projects, projectSlug } from './firma2-projects';
import type { Project } from './firma2-projects';
import { projectDetails } from './firma2-project-detail';
import { centroid, pointInRing, ringAcres, pathMiles } from '../lib/geo';
import type { LatLng } from '../lib/geo';

// ---------------------------------------------------------------------------
// Work areas — the shape every map in this spoke draws
// ---------------------------------------------------------------------------

export type WorkAreaKind = 'area' | 'reach' | 'point';

export interface MapWorkArea {
  id: string;
  label: string;
  kind: WorkAreaKind;
  /** [lat, lng]. A point is a path of one. */
  path: LatLng[];
  /** Acres for an area, miles for a reach, null for a point — never 0. */
  extent: number | null;
  unit: 'acres' | 'miles' | null;
  /**
   * Seeded shapes are templates whose authored extents were never measured off
   * the template ring. Reshaping one rescales the new measurement by this
   * ratio, so a 62-acre unit nudged by a vertex reads 63 acres, not 2,300.
   */
  extentScale?: number;
  /** The subwatershed this shape was adopted from — provenance a table can say. */
  adoptedFrom?: string;
  /** How it arrived, for the Source column. */
  origin: 'record' | 'drawn' | 'coordinates' | 'reference' | 'upload';
}

/**
 * PROPOSALS WITH NO LOCATION YET. A proposal is often a paragraph and a budget
 * before it is a place, and these three are the ones a program manager would
 * open to put on the map. They are also what the portfolio map's "Not on this
 * map" count is about. Their detail records still carry template shapes for
 * the atlas; the work-area screens read this list instead.
 */
export const UNMAPPED_PROJECTS = new Set([
  'Cosumnes Floodplain Reconnection',
  'San Luis Rey Arroyo Toad Habitat',
  'Cache Creek Floodplain Terracing',
]);

/** The work areas a project starts with, before anyone edits them. */
export const seedWorkAreas = (project: Project): MapWorkArea[] => {
  if (UNMAPPED_PROJECTS.has(project.projectName)) return [];
  const detail = projectDetails.get(project.projectName);
  if (!detail) return [];
  const slug = projectSlug(project);
  return detail.workAreas.map((area, i) => {
    const measured = area.kind === 'area' ? ringAcres(area.path) : pathMiles(area.path);
    return {
      id: `${slug}-${i}`,
      label: area.label,
      kind: area.kind,
      path: area.path,
      extent: area.extent,
      unit: area.extentUnit,
      extentScale: measured > 0 ? area.extent / measured : 1,
      origin: 'record',
    };
  });
};

/** A point in the middle of Lake Tahoe: where the four shores meet, and the
 *  fallback center for anything without one. */
export const LAKE: LatLng = [39.09, -120.04];

/** Where a project's map opens: its authored center, which every project has. */
export const projectCenter = (project: Project): LatLng =>
  projectDetails.get(project.projectName)?.mapCenter ?? LAKE;

// ---------------------------------------------------------------------------
// Hydrologic regions — the reference geography coverage is counted against
// ---------------------------------------------------------------------------

export interface Region {
  id: string;
  name: string;
  ring: LatLng[];
}

// The Lake Tahoe basin and its two outflow corridors, as six coarse areas: the
// four shores (each a group of the tributaries that drain into the lake from
// that side), the Truckee River below the outlet, and the Upper Carson. The
// four shores meet at a point in the lake, so the set tiles the basin with no
// slivers at this resolution. Hand-drawn, never traced from a boundary.
export const HYDROLOGIC_REGIONS: Region[] = [
  {
    id: 'truckee-river',
    name: 'Truckee River',
    ring: [[39.42, -120.4], [39.42, -120.06], [39.255, -120.06], [39.255, -120.17], [39.18, -120.17], [39.15, -120.4]],
  },
  {
    id: 'north-shore',
    name: 'North Shore',
    ring: [[39.42, -120.06], [39.42, -119.85], [39.22, -119.85], LAKE, [39.18, -120.17], [39.255, -120.17], [39.255, -120.06]],
  },
  {
    id: 'east-shore',
    name: 'East Shore',
    ring: [[39.22, -119.85], [38.95, -119.8], [38.95, -119.93], LAKE],
  },
  {
    id: 'south-shore',
    name: 'South Shore',
    ring: [LAKE, [38.95, -119.93], [38.95, -119.8], [38.85, -119.8], [38.85, -119.97], [38.65, -119.98], [38.65, -120.12], [38.95, -120.12]],
  },
  {
    id: 'west-shore',
    name: 'West Shore',
    ring: [LAKE, [38.95, -120.12], [38.95, -120.4], [39.15, -120.4], [39.18, -120.17]],
  },
  {
    id: 'upper-carson',
    name: 'Upper Carson River',
    ring: [[38.85, -119.8], [38.65, -119.8], [38.65, -119.98], [38.85, -119.97]],
  },
];

/** The region a location falls in, or null outside every ring. */
export const regionAt = (point: LatLng): Region | null =>
  HYDROLOGIC_REGIONS.find((region) => pointInRing(point, region.ring)) ?? null;

/** The region a set of work areas counts toward: where its shapes sit. */
export const regionOfAreas = (areas: MapWorkArea[]): Region | null =>
  areas.length ? regionAt(centroid(areas.flatMap((a) => a.path))) : null;

// ---------------------------------------------------------------------------
// Subwatersheds — boundaries small enough to adopt as a footprint
// ---------------------------------------------------------------------------

export interface Subwatershed {
  id: string;
  name: string;
  ring: LatLng[];
  acres: number;
  /** The project whose drainage it is — what "near this project" means. */
  projectSlug: string;
}

/** The stream each project works on, which names its subwatersheds. */
const STREAMS: Record<string, string> = {
  'Deer Creek Riparian Corridor Enhancement': 'Saxon Creek',
  'Scott River Fish Passage Barrier Removal': 'Ward Creek',
  'Suisun Slough Tidal Marsh Enhancement': 'Trout Creek',
  'Red Clover Valley Meadow Reconnection': 'West Fork Carson River',
  'Cosumnes Floodplain Reconnection': 'Donner Creek',
  'Bear River Gravel Augmentation': 'General Creek',
  'Yuba Headwaters Fuels Reduction': 'Third Creek',
  'Butte Creek Canyon Fuel Break': 'Glenbrook Creek',
  'Navarro River Large Wood Placement': 'Meeks Creek',
  'Salinas River Arundo Removal': 'Cold Creek',
  'Alameda Creek Culvert Retrofit': 'Incline Creek',
  'Truckee River Streambank Stabilization': 'Truckee River',
  'Elk River Sediment Reduction': 'Burton Creek',
  'Carmel Valley Steelhead Habitat': 'Bear Creek',
  'Owens Valley Spring Channel Restoration': 'Martis Creek',
  'Putah Creek Riparian Planting': 'Edgewood Creek',
  'San Luis Rey Arroyo Toad Habitat': 'McFaul Creek',
  'Klamath Tributary Thermal Refugia': 'Glen Alpine Creek',
  'Mokelumne Meadow Rewetting': 'Grass Lake Creek',
  'Pescadero Marsh Tidal Exchange': 'Taylor Creek',
  'Battle Creek Diversion Screening': 'Blackwood Creek',
  'Cache Creek Floodplain Terracing': 'Heavenly Valley Creek',
  'Trinity River Side-Channel Construction': 'Marlette Creek',
  'Arroyo Seco Urban Greenway': 'Griff Creek',
};

// Eight radii per ring, so a subwatershed reads as a drainage rather than a
// circle. Two patterns, so the upper and lower units do not look stamped.
const RADII = [
  [1.0, 0.82, 1.12, 0.9, 1.04, 0.78, 1.16, 0.94],
  [0.92, 1.1, 0.84, 1.0, 1.14, 0.86, 0.96, 1.06],
];

const blob = (center: LatLng, radiusDeg: number, pattern: number): LatLng[] => {
  const lngStretch = 1 / Math.cos((center[0] * Math.PI) / 180);
  return RADII[pattern].map((r, i) => {
    const angle = (i / 8) * 2 * Math.PI;
    return [
      Number((center[0] + Math.sin(angle) * radiusDeg * r).toFixed(4)),
      Number((center[1] + Math.cos(angle) * radiusDeg * r * lngStretch).toFixed(4)),
    ];
  });
};

/**
 * Two per project: the LOWER unit holds the project's own center (so adopting
 * it covers the work), the UPPER sits upstream of it — away from the lake,
 * which is where every tributary in the basin comes from. Basin subwatersheds
 * run a few thousand to ten thousand acres; these land in that range.
 */
export const SUBWATERSHEDS: Subwatershed[] = projects.flatMap((project) => {
  const stream = STREAMS[project.projectName] ?? project.projectName;
  const [lat, lng] = projectCenter(project);
  const slug = projectSlug(project);
  const away = [lat - LAKE[0], lng - LAKE[1]];
  const length = Math.hypot(away[0], away[1]) || 1;
  const lower = blob([lat - 0.004, lng + 0.003], 0.032, 0);
  const upper = blob([lat + (away[0] / length) * 0.055, lng + (away[1] / length) * 0.055], 0.03, 1);
  return [
    { id: `${slug}-lower`, name: `Lower ${stream}`, ring: lower, acres: Math.round(ringAcres(lower)), projectSlug: slug },
    { id: `${slug}-upper`, name: `Upper ${stream}`, ring: upper, acres: Math.round(ringAcres(upper)), projectSlug: slug },
  ];
});

/** The subwatersheds offered for adoption on one project: its own two first. */
export const subwatershedsNear = (project: Project, count = 4): Subwatershed[] => {
  const [lat, lng] = projectCenter(project);
  const distance = (s: Subwatershed) => {
    const [cLat, cLng] = centroid(s.ring);
    return (cLat - lat) ** 2 + (cLng - lng) ** 2;
  };
  return [...SUBWATERSHEDS].sort((a, b) => distance(a) - distance(b)).slice(0, count);
};

// ---------------------------------------------------------------------------
// Reference layers — what a workspace's maps are drawn against
// ---------------------------------------------------------------------------

export type LayerKind = 'feature' | 'map' | 'wms' | 'geojson';

export const LAYER_KINDS: { value: LayerKind; label: string; note?: string; raster: boolean }[] = [
  {
    value: 'feature',
    label: 'ArcGIS feature service',
    raster: false,
  },
  {
    value: 'map',
    label: 'ArcGIS map service',
    note: 'Cached services only.',
    raster: true,
  },
  {
    value: 'wms',
    label: 'WMS',
    note: 'Its look is fixed by the publisher.',
    raster: true,
  },
  {
    value: 'geojson',
    label: 'GeoJSON',
    note: 'A file, or a WFS returning JSON.',
    raster: false,
  },
];

/** Quick picks beside every map colour field: hues that hold on the grey base map. */
export const MAP_SWATCHES: { value: string; label: string }[] = [
  { value: '#3e63dd', label: 'Indigo' },
  { value: '#0090ff', label: 'Blue' },
  { value: '#12a594', label: 'Teal' },
  { value: '#46a758', label: 'Green' },
  { value: '#f76b15', label: 'Orange' },
  { value: '#e5484d', label: 'Red' },
  { value: '#8e4ec6', label: 'Purple' },
  { value: '#6b7280', label: 'Gray' },
];

export type LineStyle = 'solid' | 'dashed' | 'dotted';

export const LINE_STYLES: { value: LineStyle; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
];

/**
 * A layer's line style. Regions were always drawn dashed, before the style was
 * a setting, so a regions layer saved without one keeps its dashes.
 */
export const lineStyleOf = (layer: Pick<ReferenceLayer, 'strokeStyle' | 'draws'>): LineStyle =>
  layer.strokeStyle ?? (layer.draws === 'regions' ? 'dashed' : 'solid');

/** The SVG/Leaflet dash pattern for a style at a line width. Undefined: solid. */
export const dashOf = (style: LineStyle, width: number): string | undefined => {
  const w = Math.max(1, width);
  return style === 'dashed' ? `${w * 4} ${w * 3}` : style === 'dotted' ? `${w * 0.1} ${w * 2.5}` : undefined;
};

export interface ReferenceLayer {
  id: string;
  name: string;
  kind: LayerKind;
  url: string;
  /** WMS only: the layer as the service's capabilities document names it. */
  serviceLayer?: string;
  description: string;
  popupField: string;
  /** Below this zoom the layer does not draw. Null: draws at every zoom. */
  minZoom: number | null;
  onByDefault: boolean;
  active: boolean;
  publisherColours: boolean;
  stroke: string;
  strokeWidth: number;
  fill: string;
  fillOpacity: number;
  /** Absent on layers saved before line styles: read it through lineStyleOf(). */
  strokeStyle?: LineStyle;
  /** Print the pop-up field on each shape, instead of on hover only. */
  showLabels?: boolean;
  /** Which geometry in this file the prototype draws for it. Null: none to draw. */
  draws: 'regions' | 'subwatersheds' | null;
}

export const REFERENCE_LAYERS: ReferenceLayer[] = [
  {
    id: 'subwatersheds',
    name: 'Subwatersheds',
    kind: 'feature',
    url: 'https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/6',
    description: 'Drainage units small enough to stand for one project’s footprint.',
    popupField: 'NAME',
    minZoom: 11,
    onByDefault: true,
    active: true,
    publisherColours: false,
    stroke: '#3e63dd',
    strokeWidth: 1,
    fill: '#3e63dd',
    fillOpacity: 0.04,
    draws: 'subwatersheds',
  },
  {
    id: 'subbasins',
    name: 'Subbasins',
    kind: 'feature',
    url: 'https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/4',
    description: 'USGS 8-digit watersheds, the scale river programs report at.',
    popupField: 'NAME',
    minZoom: 7,
    onByDefault: false,
    active: true,
    publisherColours: false,
    stroke: '#0d74ce',
    strokeWidth: 1.5,
    fill: '#0d74ce',
    fillOpacity: 0,
    draws: null,
  },
  {
    id: 'hydrologic-regions',
    name: 'Hydrologic regions',
    kind: 'geojson',
    url: 'https://data.example.org/reference/hydrologic-regions.geojson',
    description: 'The six basin areas the coverage report counts against.',
    popupField: 'REGION_NAME',
    minZoom: null,
    onByDefault: false,
    active: true,
    publisherColours: false,
    stroke: '#6b7280',
    strokeWidth: 1.5,
    fill: '#6b7280',
    fillOpacity: 0,
    draws: 'regions',
  },
  {
    id: 'fire-hazard',
    name: 'Fire hazard severity zones',
    kind: 'wms',
    url: 'https://maps.example.org/geoserver/wms',
    serviceLayer: 'fire:hazard_severity',
    description: 'State-responsibility zones, as the publisher colours them.',
    popupField: '',
    minZoom: 8,
    onByDefault: false,
    active: false,
    publisherColours: true,
    stroke: '#6b7280',
    strokeWidth: 1,
    fill: '#6b7280',
    fillOpacity: 0,
    draws: null,
  },
];

/** What "Check service" finds at each kind of URL — the probe, scripted. */
export const PROBE_RESULTS: Record<LayerKind, { name: string; fields: string[]; warning?: string }> = {
  feature: { name: 'Hydrography — Subwatersheds', fields: ['NAME', 'HUC12', 'AREA_ACRES', 'STATES'] },
  map: {
    name: 'Ownership',
    fields: [],
    warning: 'This service isn’t cached, so it can’t draw. Use its feature service instead.',
  },
  wms: { name: 'fire:hazard_severity', fields: [] },
  geojson: { name: 'hydrologic-regions.geojson', fields: ['REGION_NAME', 'REGION_ID'] },
};

// ---------------------------------------------------------------------------
// Place search — a workspace's own areas first, then towns
// ---------------------------------------------------------------------------

export interface Place {
  name: string;
  kind: 'Town' | 'Subwatershed' | 'Region';
  center: LatLng;
  zoom: number;
}

const TOWNS: [string, number, number][] = [
  ['Truckee', 39.328, -120.1833], ['Olympic Valley', 39.1971, -120.2357], ['Tahoe City', 39.1677, -120.1452],
  ['Carnelian Bay', 39.2269, -120.0802], ['Tahoe Vista', 39.2399, -120.051], ['Kings Beach', 39.2377, -120.0266],
  ['Incline Village', 39.2513, -119.973], ['Glenbrook', 39.0905, -119.9393], ['Zephyr Cove', 39.0013, -119.9474],
  ['Stateline', 38.9616, -119.9396], ['South Lake Tahoe', 38.9399, -119.9772], ['Meyers', 38.8566, -120.0135],
  ['Tahoma', 39.0674, -120.1288], ['Homewood', 39.0855, -120.1602], ['Markleeville', 38.6941, -119.7802],
  ['Kirkwood', 38.7024, -120.0716],
];

export const PLACES: Place[] = [
  ...SUBWATERSHEDS.map((s) => ({ name: s.name, kind: 'Subwatershed' as const, center: centroid(s.ring), zoom: 11 })),
  ...HYDROLOGIC_REGIONS.map((r) => ({ name: r.name, kind: 'Region' as const, center: centroid(r.ring), zoom: 7 })),
  ...TOWNS.map(([name, lat, lng]) => ({ name, kind: 'Town' as const, center: [lat, lng] as LatLng, zoom: 12 })),
];

// ---------------------------------------------------------------------------
// Upload — what the server reads out of a zipped file, scripted
// ---------------------------------------------------------------------------

export interface UploadFeature {
  kind: WorkAreaKind;
  /** Offsets from the project's center, so the sample lands on any project. */
  offsets: LatLng[];
  fields: Record<string, string>;
}

export interface UploadLayer {
  name: string;
  features: UploadFeature[];
}

export interface UploadFile {
  fileName: string;
  /** A refusal that no choice can fix — the file itself is wrong. */
  refusal?: string[];
  layers: UploadLayer[];
}

export const UPLOAD_SAMPLES: Record<'gdb' | 'noprj', UploadFile> = {
  gdb: {
    fileName: 'treatment-units.gdb.zip',
    layers: [
      {
        name: 'TreatmentUnits',
        features: [
          {
            kind: 'area',
            offsets: [[0.011, -0.016], [0.014, -0.004], [0.006, 0.003], [-0.002, -0.002], [-0.001, -0.014]],
            fields: { UNIT_ID: 'TU-01', UNIT_NAME: 'North terrace planting', TREATMENT: 'Riparian planting' },
          },
          {
            kind: 'area',
            offsets: [[-0.004, 0.006], [-0.001, 0.017], [-0.011, 0.021], [-0.016, 0.011], [-0.012, 0.004]],
            fields: { UNIT_ID: 'TU-02', UNIT_NAME: 'Confluence bench', TREATMENT: 'Riparian planting' },
          },
          {
            kind: 'area',
            offsets: [[-0.018, -0.02], [-0.014, -0.011], [-0.022, -0.006], [-0.027, -0.015]],
            fields: { UNIT_ID: 'TU-03', UNIT_NAME: 'South floodplain pocket', TREATMENT: 'Riparian planting' },
          },
        ],
      },
      {
        name: 'MonitoringPoints',
        features: [
          { kind: 'point', offsets: [[0.009, -0.009]], fields: { SITE_ID: 'MP-1', STATION: 'Upper photo point' } },
          { kind: 'point', offsets: [[0.002, 0.004]], fields: { SITE_ID: 'MP-2', STATION: 'Bench thermograph' } },
          { kind: 'point', offsets: [[-0.009, 0.014]], fields: { SITE_ID: 'MP-3', STATION: 'Confluence gauge' } },
          { kind: 'point', offsets: [[-0.02, -0.012]], fields: { SITE_ID: 'MP-4', STATION: 'Lower photo point' } },
        ],
      },
    ],
  },
  noprj: {
    fileName: 'survey-reach.zip',
    refusal: [
      'survey_reach.prj is missing. Zip the .shp, .shx, .dbf and .prj together and choose it again.',
    ],
    layers: [],
  },
};

// ---------------------------------------------------------------------------
// GIS subscription — Marcus's layer, and what a sync of it finds
// ---------------------------------------------------------------------------

export interface LayerField {
  name: string;
  alias?: string;
  type: 'String' | 'Integer' | 'Double' | 'Date' | 'GlobalID' | 'OID';
}

export interface SharedLayer {
  id: string;
  name: string;
  geometry: 'Polygon' | 'Polyline' | 'Point';
  url: string;
  globalIdField: string;
  objectIdField: string;
  displayField: string;
  fields: LayerField[];
}

export const ARCGIS_GROUP = { id: '5b026788339642edbb9c160fe3c3fab8', title: 'Project_Firma2.0' };

export const SHARED_LAYERS: SharedLayer[] = [
  {
    id: 'project-boundaries',
    name: 'Project boundaries',
    geometry: 'Polygon',
    url: 'https://services.arcgis.com/nsw4Pq/arcgis/rest/services/ProjectBoundaries/FeatureServer/0',
    globalIdField: 'GlobalID',
    objectIdField: 'OBJECTID',
    displayField: 'UNIT_NAME',
    fields: [
      { name: 'OBJECTID', type: 'OID' },
      { name: 'GlobalID', type: 'GlobalID' },
      { name: 'PROJ_ID', alias: 'Project number', type: 'String' },
      { name: 'PROJ_NAME', alias: 'Project name', type: 'String' },
      { name: 'STATUS', type: 'String' },
      { name: 'UNIT_NAME', alias: 'Unit name', type: 'String' },
      { name: 'LEAD_ORG', alias: 'Lead organization', type: 'String' },
      { name: 'TREAT_YR', alias: 'Treatment year', type: 'Integer' },
      { name: 'Shape__Area', type: 'Double' },
      { name: 'Shape__Length', type: 'Double' },
    ],
  },
  {
    id: 'treatment-reaches',
    name: 'Stream treatment reaches',
    geometry: 'Polyline',
    url: 'https://services.arcgis.com/nsw4Pq/arcgis/rest/services/TreatmentReaches/FeatureServer/0',
    globalIdField: 'GlobalID',
    objectIdField: 'OBJECTID',
    displayField: 'REACH_NAME',
    fields: [
      { name: 'OBJECTID', type: 'OID' },
      { name: 'GlobalID', type: 'GlobalID' },
      { name: 'PROJ_ID', alias: 'Project number', type: 'String' },
      { name: 'REACH_NAME', alias: 'Reach name', type: 'String' },
      { name: 'TREATMENT', type: 'String' },
      { name: 'Shape__Length', type: 'Double' },
    ],
  },
  {
    id: 'monitoring-sites',
    name: 'Monitoring sites',
    geometry: 'Point',
    url: 'https://services.arcgis.com/nsw4Pq/arcgis/rest/services/MonitoringSites/FeatureServer/0',
    globalIdField: 'GlobalID',
    objectIdField: 'OBJECTID',
    displayField: 'SITE_NAME',
    fields: [
      { name: 'OBJECTID', type: 'OID' },
      { name: 'GlobalID', type: 'GlobalID' },
      { name: 'SITE_ID', type: 'String' },
      { name: 'SITE_NAME', alias: 'Site name', type: 'String' },
      { name: 'PROJ_ID', alias: 'Project number', type: 'String' },
    ],
  },
];

/** The project columns a layer may maintain — decision 26's list. */
export const MAPPABLE_PROJECT_FIELDS = [
  { value: 'stage', label: 'Stage' },
  { value: 'projectType', label: 'Project type' },
  { value: 'leadOrganization', label: 'Lead organization' },
  { value: 'county', label: 'County' },
  { value: 'implementationStartYear', label: 'Implementation start year' },
  { value: 'completionYear', label: 'Completion year' },
  { value: 'estimatedTotalCost', label: 'Estimated total cost' },
];

export interface Subscription {
  id: string;
  name: string;
  access: 'arcgis' | 'public';
  layerId: string;
  url: string;
  joinField: string;
  featureIdField: string;
  labelField: string;
  extraFields: string[];
  nameField: string;
  defaultLead: string;
  defaultProjectType: string;
  defaultStage: string;
  mappings: { projectField: string; layerField: string }[];
  active: boolean;
  /** Projects and shapes it maintains. */
  projectCount: number;
  workAreaCount: number;
  lastSuccess: string | null;
  lastMessage: string | null;
  /** Work areas the last sync no longer found upstream — kept, never deleted. */
  staleLabels?: string[];
  /**
   * Every extra field a sync has EVER brought across. Un-nominating one stops
   * it being updated and keeps what is stored (decisions 9 and 10): a
   * subscription that cannot supply a value must not erase one.
   */
  syncedFields?: string[];
}

const mappedCount = projects.filter((p) => !UNMAPPED_PROJECTS.has(p.projectName)).length;
const mappedShapes = projects
  .filter((p) => !UNMAPPED_PROJECTS.has(p.projectName))
  .reduce((n, p) => n + (projectDetails.get(p.projectName)?.workAreas.length ?? 0), 0);

export const SEED_SUBSCRIPTION: Subscription = {
  id: 'enterprise-boundaries',
  name: 'Enterprise project boundaries',
  access: 'arcgis',
  layerId: 'project-boundaries',
  url: SHARED_LAYERS[0].url,
  joinField: 'PROJ_ID',
  featureIdField: 'GlobalID',
  labelField: 'UNIT_NAME',
  extraFields: ['STATUS'],
  nameField: 'PROJ_NAME',
  defaultLead: '',
  defaultProjectType: 'Aquatic habitat restoration',
  defaultStage: 'Planning & Design',
  mappings: [
    { projectField: 'stage', layerField: 'STATUS' },
    { projectField: 'leadOrganization', layerField: 'LEAD_ORG' },
  ],
  syncedFields: ['STATUS'],
  active: true,
  projectCount: mappedCount,
  workAreaCount: mappedShapes,
  lastSuccess: '2026-09-30T06:00:00',
  lastMessage: `Matched ${mappedCount} of ${mappedCount + 1} features on PROJ_ID. 1 matched no project: PROJ-0193.`,
};

/** A subscription's setup, in the order the decisions fall: access decides
    what the rest of the form even is. The side sheet shows all five at once;
    the wizard shows one per screen. */
export const SUBSCRIPTION_STEPS = [
  { key: 'access', title: 'Access' },
  { key: 'layer', title: 'Layer' },
  { key: 'matching', title: 'Matching' },
  { key: 'fields', title: 'Project fields' },
  { key: 'name', title: 'Name' },
] as const;
export type SubscriptionStep = (typeof SUBSCRIPTION_STEPS)[number]['key'];

/** What pressing Sync now finds upstream this time. Scripted, and stable. */
export const SYNC_RESULT = {
  added: 0,
  updated: 3,
  stale: ['Gravel injection reach'],
  projectsUpdated: 2,
  unmatched: ['PROJ-0193'],
  skippedWithoutJoin: 1,
};

// ---------------------------------------------------------------------------
// The layer's own view of a project — project numbers and field values
// ---------------------------------------------------------------------------

/**
 * Each project's number in the partner's GIS — the external ID a subscription
 * joins on and a bulk import matches against. Invented, and stable: the
 * portfolio's order, from PROJ-0101.
 */
export const projectNumber = (project: Project): string =>
  `PROJ-0${101 + projects.findIndex((p) => p.projectName === project.projectName)}`;

const STATUS_BY_STAGE: Record<string, string> = {
  Proposal: 'Proposed',
  'Planning & Design': 'Design',
  Implementation: 'Active',
  'Post-Implementation': 'Monitoring',
  Completed: 'Completed',
  Deferred: 'On hold',
};

/** What the subscribed layer holds in one of its fields for a project. */
export const layerValue = (project: Project, field: string): string => {
  switch (field) {
    case 'PROJ_ID':
      return projectNumber(project);
    case 'PROJ_NAME':
      return project.projectName;
    case 'STATUS':
      return STATUS_BY_STAGE[project.stage] ?? '';
    case 'UNIT_NAME':
      return projectDetails.get(project.projectName)?.workAreas[0]?.label ?? '';
    case 'LEAD_ORG':
      return project.leadOrganization;
    case 'TREAT_YR':
      return String(project.implementationStartYear);
    default:
      return '';
  }
};

/** Which key-facts row a mapped project field locks. Stage has no row: it is the header pill. */
export const FACT_ROW_FOR_FIELD: Record<string, string> = {
  projectType: 'projectType',
  leadOrganization: 'leadOrganization',
  county: 'county',
  implementationStartYear: 'timeline',
  completionYear: 'timeline',
  estimatedTotalCost: 'estimatedTotalCost',
};

// ---------------------------------------------------------------------------
// Bulk import — one partner file, shapes for many projects
// ---------------------------------------------------------------------------

export interface BulkFeature {
  kind: WorkAreaKind;
  /** Offsets from the matched project's center, so a hand match lands sensibly. */
  offsets: LatLng[];
  fields: Record<string, string>;
}

const numberOf = (name: string) => projectNumber(projects.find((p) => p.projectName === name)!);

export const BULK_IMPORT_SAMPLE = {
  fileName: 'partner-boundaries.zip',
  layer: 'Boundaries',
  features: [
    {
      kind: 'area',
      offsets: [[0.012, -0.018], [0.016, 0.004], [0.004, 0.012], [-0.008, 0.006], [-0.006, -0.014]],
      fields: { PROJ_NO: numberOf('Cosumnes Floodplain Reconnection'), PROJECT: 'Cosumnes Floodplain Reconnection', UNIT: 'Lower floodplain unit' },
    },
    {
      kind: 'area',
      offsets: [[0.008, -0.01], [0.01, 0.006], [-0.002, 0.01], [-0.009, -0.002]],
      fields: { PROJ_NO: numberOf('San Luis Rey Arroyo Toad Habitat'), PROJECT: 'San Luis Rey Arroyo Toad Habitat', UNIT: 'Breeding pool complex' },
    },
    {
      kind: 'area',
      offsets: [[0.014, -0.012], [0.012, 0.01], [-0.004, 0.014], [-0.01, -0.004], [0.002, -0.016]],
      fields: { PROJ_NO: numberOf('Cache Creek Floodplain Terracing'), PROJECT: 'Cache Creek Floodplain Terracing', UNIT: 'Terrace grading unit' },
    },
    {
      kind: 'reach',
      offsets: [[0.02, -0.02], [0.01, -0.008], [0.002, -0.01], [-0.008, 0.004], [-0.018, 0.012]],
      fields: { PROJ_NO: numberOf('Cache Creek Floodplain Terracing'), PROJECT: 'Cache Creek Floodplain Terracing', UNIT: 'Setback channel' },
    },
    {
      kind: 'reach',
      offsets: [[0.024, 0.01], [0.018, 0.018], [0.01, 0.02], [0.002, 0.028]],
      fields: { PROJ_NO: numberOf('Deer Creek Riparian Corridor Enhancement'), PROJECT: 'Deer Creek Riparian Corridor Enhancement', UNIT: 'Upper fence line' },
    },
    {
      kind: 'area',
      offsets: [[-0.012, 0.014], [-0.008, 0.026], [-0.018, 0.028], [-0.022, 0.016]],
      fields: { PROJ_NO: 'PROJ-0230', PROJECT: 'Cosumnes Floodplain Reconection', UNIT: 'Oak woodland buffer' },
    },
    {
      kind: 'point',
      offsets: [[0.001, 0.002]],
      fields: { PROJ_NO: '', PROJECT: '', UNIT: 'Survey benchmark' },
    },
  ] as BulkFeature[],
};
