// ---------------------------------------------------------------------------
// Public spatial layers — where a program's boundaries can come from
// ---------------------------------------------------------------------------
//
// THE PICKER on the Spatial areas walk's layer step: public map layers real
// conservation programs already use, offered before "your own service or
// file". Each level is one ArcGIS REST layer the preview queries directly for
// GeoJSON, clipped to seedRegion. The teammate's 2026-09-23 spatial mock named
// the four families (watersheds, counties, tribal lands, legislative districts).
//
// ENDPOINTS VERIFIED 2026-09-24 with curl: a /query over seedRegion's bbox with
// f=geojson answered 200 with features, and an Origin header came back allowed
// (`*` from hydro.nationalmap.gov, echoed from tigerweb.geo.census.gov and
// biamaps.geoplatform.gov). Counts over the bbox at the time: HUC-8 15, HUC-10
// 83, HUC-12 372, counties 12, congressional districts 3, tribal lands 1
// (Warm Springs). Geometry returned as Polygon or MultiPolygon in WGS84 with
// outSR=4326.
//
// TRIBAL LANDS come from BIA's Land Area Representations, not Census AIANNHA:
// BIA is the land-status source programs cite, and the brief named it. Census
// AIANNHA layer 2 (Federal American Indian Reservations, field NAME) also
// answers and is the fallback if the BIA server goes down.
//
// POPULAR IS MOCK DATA. The "Most programs" mark is invented for the prototype,
// never a count drawn from client material.

export interface SpatialLayerLevel {
  id: string;
  /** Radio or select label for the level, under 30 chars. */
  label: string;
  /** An ArcGIS REST layer endpoint (…/MapServer/<n>) that answers /query?f=geojson. */
  serviceUrl: string;
  /** The attribute that holds each feature's display name. */
  nameField: string;
  /** One plain line on what the level is good for. */
  note?: string;
}

export interface PublicSpatialLayer {
  id: string;
  /** "Watersheds". */
  name: string;
  /** The agency that publishes it: "USGS". */
  provider: string;
  /** One sentence: what it is and who uses it. */
  description: string;
  /** Watersheds carry three; the others carry one. */
  levels: SpatialLayerLevel[];
  /** The invented "Most programs" mark. */
  popular?: boolean;
}

const WBD = 'https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer';
const TIGER = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb';

export const publicSpatialLayers: PublicSpatialLayer[] = [
  {
    id: 'usgs-watersheds',
    name: 'Watersheds',
    provider: 'USGS',
    description: 'Hydrologic units from the Watershed Boundary Dataset, used by most restoration and water quality programs.',
    popular: true,
    levels: [
      {
        id: 'huc8',
        label: 'Subbasin (HUC-8)',
        serviceUrl: `${WBD}/4`,
        nameField: 'name',
        note: 'Large basins, a handful per region',
      },
      {
        id: 'huc10',
        label: 'Watershed (HUC-10)',
        serviceUrl: `${WBD}/5`,
        nameField: 'name',
        note: 'A few dozen per region',
      },
      {
        id: 'huc12',
        label: 'Subwatershed (HUC-12)',
        serviceUrl: `${WBD}/6`,
        nameField: 'name',
        note: 'Hundreds per region, for site-level reporting',
      },
    ],
  },
  {
    id: 'census-counties',
    name: 'Counties',
    provider: 'US Census Bureau',
    description: 'County boundaries from TIGERweb, used when funders or partners report by county.',
    popular: true,
    levels: [
      {
        id: 'county',
        label: 'County',
        serviceUrl: `${TIGER}/State_County/MapServer/1`,
        nameField: 'NAME',
      },
    ],
  },
  {
    id: 'bia-tribal-lands',
    name: 'Tribal lands',
    provider: 'Bureau of Indian Affairs',
    description: 'Reservation and trust land boundaries, used by programs that work with or report to tribes.',
    levels: [
      {
        id: 'lar',
        label: 'Tribal land area',
        serviceUrl: 'https://biamaps.geoplatform.gov/server/rest/services/DivLTR/BIA_AIAN_National_LAR/MapServer/0',
        nameField: 'LARNAME',
      },
    ],
  },
  {
    id: 'census-legislative',
    name: 'Legislative districts',
    provider: 'US Census Bureau',
    description: 'Congressional districts from TIGERweb, used to show elected officials the work in their district.',
    levels: [
      {
        id: 'congressional',
        label: 'Congressional district',
        serviceUrl: `${TIGER}/Legislative/MapServer/0`,
        nameField: 'NAME',
      },
    ],
  },
];

/**
 * The preview's frame: Central Oregon around the Upper Deschutes and Crooked
 * subbasins and the Metolius, as [west, south, east, north] in WGS84. Taken
 * from the HUC-8 extent of 17070301 to 17070305, rounded out to 44.9 north.
 */
export const seedRegion: { name: string; bbox: [number, number, number, number] } = {
  name: 'Central Oregon',
  bbox: [-122.2, 43.2, -119.5, 44.9],
};

export const publicSpatialLayer = (layerId: string): PublicSpatialLayer | undefined =>
  publicSpatialLayers.find((layer) => layer.id === layerId);

export const spatialLayerLevel = (layerId: string, levelId: string): SpatialLayerLevel | undefined =>
  publicSpatialLayer(layerId)?.levels.find((level) => level.id === levelId);
