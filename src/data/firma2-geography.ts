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

/** Where a project's map opens: its authored center, which every project has. */
export const projectCenter = (project: Project): LatLng =>
  projectDetails.get(project.projectName)?.mapCenter ?? [38.5, -121.5];

// ---------------------------------------------------------------------------
// Hydrologic regions — the reference geography coverage is counted against
// ---------------------------------------------------------------------------

export interface Region {
  id: string;
  name: string;
  ring: LatLng[];
}

// California's ten hydrologic regions, by name. The rings are a coarse,
// hand-drawn simplification — shared vertices where two regions meet, so the
// set tiles the state without slivers at this resolution.
export const HYDROLOGIC_REGIONS: Region[] = [
  {
    id: 'north-coast',
    name: 'North Coast',
    ring: [[42.0, -124.21], [42.0, -122.4], [41.3, -122.45], [40.3, -122.95], [39.4, -122.85], [38.8, -122.7], [38.3, -122.55], [38.3, -123.05], [39.0, -123.7], [39.8, -123.85], [40.44, -124.41], [41.0, -124.12]],
  },
  {
    id: 'sacramento-river',
    name: 'Sacramento River',
    ring: [[42.0, -122.4], [42.0, -120.75], [40.6, -120.55], [39.75, -120.15], [39.4, -120.35], [39.0, -120.2], [38.85, -120.2], [38.65, -120.8], [38.4, -121.5], [38.25, -121.9], [38.3, -122.55], [38.8, -122.7], [39.4, -122.85], [40.3, -122.95], [41.3, -122.45]],
  },
  {
    id: 'north-lahontan',
    name: 'North Lahontan',
    ring: [[42.0, -120.75], [42.0, -120.0], [39.0, -120.0], [38.2, -118.93], [38.2, -119.6], [38.6, -119.95], [39.0, -120.2], [39.4, -120.35], [39.75, -120.15], [40.6, -120.55]],
  },
  {
    id: 'san-francisco-bay',
    name: 'San Francisco Bay',
    ring: [[38.3, -123.05], [38.3, -122.55], [38.25, -121.9], [37.9, -121.75], [37.45, -121.55], [37.1, -121.6], [37.1, -122.35], [37.2, -122.45], [37.82, -122.52]],
  },
  {
    id: 'san-joaquin-river',
    name: 'San Joaquin River',
    ring: [[38.25, -121.9], [38.4, -121.5], [38.65, -120.8], [38.85, -120.2], [39.0, -120.2], [38.6, -119.95], [38.2, -119.6], [37.4, -118.95], [36.9, -118.75], [36.85, -119.8], [36.85, -120.6], [37.1, -121.2], [37.45, -121.55], [37.9, -121.75]],
  },
  {
    id: 'central-coast',
    name: 'Central Coast',
    ring: [[37.1, -122.35], [37.1, -121.6], [37.45, -121.55], [37.1, -121.2], [36.85, -120.6], [36.0, -120.35], [35.4, -120.1], [34.85, -119.4], [34.45, -120.47], [35.65, -121.28], [36.6, -121.9], [36.95, -122.05]],
  },
  {
    id: 'tulare-lake',
    name: 'Tulare Lake',
    ring: [[36.9, -118.75], [36.85, -119.8], [36.85, -120.6], [36.0, -120.35], [35.4, -120.1], [34.85, -119.4], [34.8, -118.8], [35.8, -118.35]],
  },
  {
    id: 'south-lahontan',
    name: 'South Lahontan',
    ring: [[38.2, -119.6], [38.2, -118.93], [35.7, -115.6], [34.6, -115.5], [34.3, -116.8], [34.4, -117.7], [34.8, -118.8], [35.8, -118.35], [36.9, -118.75], [37.4, -118.95]],
  },
  {
    id: 'south-coast',
    name: 'South Coast',
    ring: [[34.45, -120.47], [34.85, -119.4], [34.8, -118.8], [34.4, -117.7], [34.3, -116.8], [33.4, -116.3], [32.65, -116.1], [32.53, -117.12], [33.2, -117.38], [33.7, -118.3], [34.02, -118.8], [34.4, -119.7]],
  },
  {
    id: 'colorado-river',
    name: 'Colorado River',
    ring: [[35.7, -115.6], [35.0, -114.63], [34.3, -114.13], [33.4, -114.72], [32.72, -114.72], [32.65, -116.1], [33.4, -116.3], [34.3, -116.8], [34.6, -115.5]],
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
  'Deer Creek Riparian Corridor Enhancement': 'Deer Creek',
  'Scott River Fish Passage Barrier Removal': 'Scott River',
  'Suisun Slough Tidal Marsh Enhancement': 'Suisun Slough',
  'Red Clover Valley Meadow Reconnection': 'Red Clover Creek',
  'Cosumnes Floodplain Reconnection': 'Cosumnes River',
  'Bear River Gravel Augmentation': 'Bear River',
  'Yuba Headwaters Fuels Reduction': 'North Yuba River',
  'Butte Creek Canyon Fuel Break': 'Butte Creek',
  'Navarro River Large Wood Placement': 'Navarro River',
  'Salinas River Arundo Removal': 'Salinas River',
  'Alameda Creek Culvert Retrofit': 'Alameda Creek',
  'Truckee River Streambank Stabilization': 'Truckee River',
  'Elk River Sediment Reduction': 'Elk River',
  'Carmel Valley Steelhead Habitat': 'Carmel River',
  'Owens Valley Spring Channel Restoration': 'Owens River',
  'Putah Creek Riparian Planting': 'Putah Creek',
  'San Luis Rey Arroyo Toad Habitat': 'San Luis Rey River',
  'Klamath Tributary Thermal Refugia': 'Klamath River',
  'Mokelumne Meadow Rewetting': 'Mokelumne River',
  'Pescadero Marsh Tidal Exchange': 'Pescadero Creek',
  'Battle Creek Diversion Screening': 'Battle Creek',
  'Cache Creek Floodplain Terracing': 'Cache Creek',
  'Trinity River Side-Channel Construction': 'Trinity River',
  'Arroyo Seco Urban Greenway': 'Arroyo Seco',
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
 * it covers the work), the UPPER sits upstream beside it. Real subwatersheds
 * are ten to forty thousand acres; these land in that range.
 */
export const SUBWATERSHEDS: Subwatershed[] = projects.flatMap((project) => {
  const stream = STREAMS[project.projectName] ?? project.projectName;
  const [lat, lng] = projectCenter(project);
  const slug = projectSlug(project);
  const lower = blob([lat - 0.004, lng + 0.003], 0.075, 0);
  const upper = blob([lat + 0.12, lng + 0.1], 0.07, 1);
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

export const LAYER_KINDS: { value: LayerKind; label: string; note: string; raster: boolean }[] = [
  {
    value: 'feature',
    label: 'ArcGIS feature server',
    note: 'Draws one layer’s shapes, and you choose how they look. What most reference boundaries want.',
    raster: false,
  },
  {
    value: 'map',
    label: 'ArcGIS map server',
    note: 'Sends pre-rendered tiles, so it only works against a cached service — an uncached one draws nothing at all.',
    raster: true,
  },
  {
    value: 'wms',
    label: 'WMS',
    note: 'The open standard your own GeoServer, MapServer or QGIS Server publishes. It sends images, so its look is fixed by the publisher.',
    raster: true,
  },
  {
    value: 'geojson',
    label: 'GeoJSON',
    note: 'A file, or a WFS asked for JSON. It styles like a feature server.',
    raster: false,
  },
];

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
  /** Which geometry in this file the prototype draws for it. Null: none to draw. */
  draws: 'regions' | 'subwatersheds' | null;
}

export const REFERENCE_LAYERS: ReferenceLayer[] = [
  {
    id: 'subwatersheds',
    name: 'Subwatersheds',
    kind: 'feature',
    url: 'https://services.example.org/arcgis/rest/services/Hydrography/FeatureServer/2',
    description: 'Drainage units small enough to stand for one project’s footprint.',
    popupField: 'NAME',
    minZoom: 9,
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
    id: 'hydrologic-regions',
    name: 'Hydrologic regions',
    kind: 'geojson',
    url: 'https://data.example.org/reference/hydrologic-regions.geojson',
    description: 'The ten regions the coverage report counts against.',
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
    warning: 'This map service is not cached, so it has no tiles to send. Ask its publisher for a cached version, or use its feature server instead.',
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
  ['Red Bluff', 40.1785, -122.2358], ['Chico', 39.7285, -121.8375], ['Redding', 40.5865, -122.3917],
  ['Yreka', 41.7354, -122.6345], ['Fort Jones', 41.6071, -122.8414], ['Quincy', 39.9368, -120.9472],
  ['Truckee', 39.328, -120.1833], ['Downieville', 39.5596, -120.8263], ['Grass Valley', 39.2191, -121.0611],
  ['Ukiah', 39.1502, -123.2078], ['Eureka', 40.8021, -124.1637], ['Salinas', 36.6777, -121.6555],
  ['King City', 36.2127, -121.126], ['Carmel-by-the-Sea', 36.5552, -121.9233], ['Bishop', 37.3635, -118.3951],
  ['Independence', 36.8027, -118.2001], ['Davis', 38.5449, -121.7405], ['Fairfield', 38.2494, -122.04],
  ['Fremont', 37.5485, -121.9886], ['Pescadero', 37.2552, -122.383], ['Weaverville', 40.731, -122.942],
  ['Pasadena', 34.1478, -118.1445], ['Pala', 33.3653, -117.0761], ['Elk Grove', 38.4088, -121.3716],
  ['Woodland', 38.6785, -121.7733], ['Jackson', 38.3488, -120.7741], ['Fresno', 36.7378, -119.7871],
  ['Bakersfield', 35.3733, -119.0187], ['El Centro', 32.792, -115.5631], ['Visalia', 36.3302, -119.2921],
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
      'survey_reach.prj is missing, so there is no way to know what the coordinates mean. Export the shapefile again with its projection, zip the .shp, .shx, .dbf and .prj together, and choose it here.',
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
  { value: 'program', label: 'Program' },
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
  defaultProgram: string;
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
  defaultProgram: 'Aquatic Habitat Restoration',
  defaultStage: 'Planning & Design',
  mappings: [{ projectField: 'stage', layerField: 'STATUS' }],
  active: true,
  projectCount: mappedCount,
  workAreaCount: mappedShapes,
  lastSuccess: '2026-09-30T06:00:00',
  lastMessage: `Matched ${mappedCount} of ${mappedCount + 1} features on PROJ_ID. 1 matched no project: PROJ-0193.`,
};

/** What pressing Sync now finds upstream this time. Scripted, and stable. */
export const SYNC_RESULT = {
  added: 0,
  updated: 3,
  stale: ['Gravel injection reach'],
  projectsUpdated: 2,
  unmatched: ['PROJ-0193'],
  skippedWithoutJoin: 1,
};
