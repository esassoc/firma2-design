// spatial-preview: the Leaflet side of firma2-map-preview. One typed call draws
// an ArcGIS REST layer, clipped to a bounding box, over a muted basemap, and
// says how many of the program's areas it found in it.
//
// WHY A QUERY AND NOT esri-leaflet. Beacon draws its feature services through
// esri-leaflet's featureLayer, which tiles requests as the map pans. A setup
// preview never pans far: one /query over the region with f=geojson answers in
// one request, needs no second dependency, and returns plain GeoJSON that
// L.geoJSON draws as is. maxAllowableOffset generalizes the rings server side,
// which is what keeps HUC-12's 372 polygons light enough for a preview.
//
// COLOUR IS CSS, NOT LEAFLET OPTIONS. Every path carries a class and
// firma2-map-preview's stylesheet paints it from the brand tokens with the
// milestone's hue swapped in, the emblem's construction. SVG presentation
// attributes cannot read a custom property; a CSS rule on the path can, and it
// outranks the attributes Leaflet writes. So this file only sets the hue.
//
// ONE MAP PER ELEMENT, REUSED. The first call builds the map and the basemap;
// later calls swap the data layer. A counter per element drops a response that
// lands after a newer request, so switching levels quickly never leaves the
// older layer on screen. Responses are memoized per URL for the page's life.
import L from 'leaflet';
import type { Feature, FeatureCollection, Geometry } from 'geojson';

/** [west, south, east, north] in WGS84. */
export type Bbox = [number, number, number, number];

export interface LayerPreviewOptions {
  /** An ArcGIS REST layer endpoint, …/MapServer/<n> or …/FeatureServer/<n>. */
  serviceUrl: string;
  /** The attribute holding each feature's name. Omitted, the common name fields are tried. */
  nameField?: string;
  bbox: Bbox;
  /** The program's area names; a feature whose name matches one is highlighted. */
  highlightNames: string[];
  /** The milestone's oklch hue angle. */
  hue: number;
  /** Server-side generalization in degrees. */
  maxAllowableOffset?: number;
}

export interface LayerPreviewResult {
  /** Features the layer returned inside the bbox. */
  featureCount: number;
  /** The highlightNames the layer contains, as the program spelled them. */
  matched: string[];
}

/** Thrown when a newer request on the same element superseded this one. */
export class PreviewSuperseded extends Error {}

interface MapState {
  map: L.Map;
  data: L.GeoJSON | null;
  generation: number;
  /** Whether the map has had a view set; see fitBbox. */
  viewed: boolean;
}

type NamedProperties = Record<string, unknown> | null;

// THE BASEMAP IS ESRI'S LIGHT GRAY CANVAS, NOT CARTO. CARTO's light_all tiles
// were the brief; checked 2026-09-24, every keyless CARTO tile now carries an
// "API KEY REQUIRED" watermark. Esri's canvas answers keyless, is as muted, and
// is the tile family Beacon's own maps use (LeafletHelperService's Aerial,
// Street and Terrain are all services.arcgisonline.com).
const BASEMAP_URL =
  'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
const BASEMAP_ATTRIBUTION = 'Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** Tried in order when the caller cannot name the field (an own service). */
const NAME_FIELDS = ['name', 'NAME', 'Name', 'LARNAME', 'NAMELSAD'];

/** Trailing words a program adds to a unit's name that the layer does not carry. */
const TRAILING_WORDS = /\s+(subbasin|watershed|county)$/;

const states = new WeakMap<HTMLElement, MapState>();
const responses = new Map<string, Promise<FeatureCollection<Geometry, NamedProperties>>>();

/** "Upper Deschutes Subbasin" and "upper deschutes" compare equal. */
export const normalizeAreaName = (name: string): string =>
  name.trim().toLowerCase().replace(/\s+/g, ' ').replace(TRAILING_WORDS, '');

/** True for an https ArcGIS REST layer endpoint the preview can query. */
export const looksLikeArcgisLayer = (url: string): boolean =>
  /^https:\/\/[^\s]+\/(MapServer|FeatureServer)\/\d+\/?$/i.test(url.trim());

const queryUrl = (options: LayerPreviewOptions): string => {
  const [west, south, east, north] = options.bbox;
  const params = new URLSearchParams({
    where: '1=1',
    geometry: `${west},${south},${east},${north}`,
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    outSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: options.nameField ?? '*',
    f: 'geojson',
  });
  if (options.maxAllowableOffset !== undefined) params.set('maxAllowableOffset', String(options.maxAllowableOffset));
  return `${options.serviceUrl.trim().replace(/\/$/, '')}/query?${params}`;
};

const fetchLayer = (url: string): Promise<FeatureCollection<Geometry, NamedProperties>> => {
  const cached = responses.get(url);
  if (cached) return cached;
  const request = fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Layer answered ${response.status}`);
      return response.json() as Promise<unknown>;
    })
    .then((body) => {
      const collection = body as Partial<FeatureCollection<Geometry, NamedProperties>> & { error?: unknown };
      // ArcGIS reports a bad query as a 200 with an `error` body.
      if (collection.error || collection.type !== 'FeatureCollection' || !Array.isArray(collection.features)) {
        throw new Error('Layer did not return GeoJSON');
      }
      return collection as FeatureCollection<Geometry, NamedProperties>;
    });
  // A failure is not remembered, so the next try asks again.
  request.catch(() => responses.delete(url));
  responses.set(url, request);
  return request;
};

const featureName = (feature: Feature<Geometry, NamedProperties>, nameField?: string): string => {
  const properties = feature.properties ?? {};
  const fields = nameField ? [nameField] : NAME_FIELDS;
  for (const field of fields) {
    const value = properties[field];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

const stateFor = (el: HTMLElement): MapState => {
  const existing = states.get(el);
  if (existing) return existing;

  const map = L.map(el, {
    zoomSnap: 0.25,
    scrollWheelZoom: false,
    attributionControl: true,
  });
  L.tileLayer(BASEMAP_URL, {
    attribution: BASEMAP_ATTRIBUTION,
    maxZoom: 16,
  }).addTo(map);

  // The preview lives on a step screen that may be hidden when the map is
  // built; a zero-size map fits nothing, so refit whenever the box changes.
  const state: MapState = { map, data: null, generation: 0, viewed: false };
  const observer = new ResizeObserver(() => {
    const bbox = el.dataset.previewBbox;
    if (bbox) fitBbox(state, el, JSON.parse(bbox) as Bbox);
  });
  observer.observe(el);

  states.set(el, state);
  return state;
};

/**
 * Fits the map to the bbox once the element has a size. Leaflet caches the
 * container's size on its first read and ignores invalidateSize until a view
 * has been set, so a map first measured behind a hidden step screen would keep
 * a zero size and never load (observed 2026-09-24: no tiles, no paths, the
 * status line right). Setting any view first marks the map loaded, and
 * invalidateSize then re-measures the box before the fit.
 */
const fitBbox = (state: MapState, el: HTMLElement, [west, south, east, north]: Bbox): void => {
  if (el.clientWidth === 0 || el.clientHeight === 0) return;
  if (!state.viewed) {
    state.map.setView([south, west], 0, { animate: false });
    state.viewed = true;
  }
  state.map.invalidateSize({ animate: false });
  state.map.fitBounds(
    [
      [south, west],
      [north, east],
    ],
    { animate: false },
  );
};

/**
 * Draws the layer into `el`, highlighting the program's areas. Resolves with
 * what it found; rejects when the layer does not answer, or with
 * PreviewSuperseded when a newer call on the same element has started.
 */
export const renderLayerPreview = async (
  el: HTMLElement,
  options: LayerPreviewOptions,
): Promise<LayerPreviewResult> => {
  const state = stateFor(el);
  const generation = ++state.generation;

  el.style.setProperty('--firma2-map-hue', String(options.hue));
  el.dataset.previewBbox = JSON.stringify(options.bbox);
  fitBbox(state, el, options.bbox);

  const collection = await fetchLayer(queryUrl(options));
  if (generation !== state.generation) throw new PreviewSuperseded();

  // Normalized name -> the program's own spelling, for the result.
  const wanted = new Map(options.highlightNames.map((name) => [normalizeAreaName(name), name]));
  const matched = new Set<string>();

  state.data?.remove();
  state.data = L.geoJSON(collection, {
    style: (feature) => {
      const name = feature ? featureName(feature as Feature<Geometry, NamedProperties>, options.nameField) : '';
      const hit = wanted.get(normalizeAreaName(name));
      if (hit) matched.add(hit);
      return {
        className: hit ? 'firma2-map-preview__unit firma2-map-preview__unit--match' : 'firma2-map-preview__unit',
        weight: hit ? 2 : 1,
      };
    },
    onEachFeature: (feature, layer) => {
      const name = featureName(feature as Feature<Geometry, NamedProperties>, options.nameField);
      if (name && wanted.has(normalizeAreaName(name))) {
        layer.bindTooltip(name, { sticky: true, className: 'firma2-map-preview__tooltip' });
      }
    },
  }).addTo(state.map);

  return { featureCount: collection.features.length, matched: [...matched] };
};

/** Takes the data layer off the map, keeping the map and basemap for the next call. */
export const clearLayerPreview = (el: HTMLElement): void => {
  const state = states.get(el);
  if (!state) return;
  state.generation++;
  state.data?.remove();
  state.data = null;
};
