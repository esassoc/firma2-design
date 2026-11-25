// What the geospatial screens remember — localStorage, the same stand-in for a
// server every other prototype in this spoke uses. Versioned keys, so a shape
// change later discards stale state instead of misreading it.
//
// SIX THINGS, each keyed on its own so one screen's reset never takes
// another's with it:
//
//   work areas      per project, written whole: the record's shapes as edited.
//                   Absent means "as seeded" — so a project nobody touched
//                   keeps following the fixture.
//   project source  how this workspace gets its projects (decision 15): made
//                   in ProjectFirma, or read from a GIS subscription. It
//                   decides whether the drawing tools exist at all.
//   layers          the workspace's reference layers, as edited in settings.
//   map style       the base map a map opens on and the work areas' colours.
//   subscriptions   the GIS subscriptions, as edited and synced.
//   draft           the one subscription being set up in the wizard, and the
//                   step it stopped on — so leaving to share a layer into the
//                   ArcGIS group never costs the answers already given.
//
// Every write dispatches one document event and the browser's own `storage`
// event carries it to other windows, so a map in one tab follows a setting
// changed in another.

import { REFERENCE_LAYERS, SEED_SUBSCRIPTION } from '../data/firma2-geography';
import type { MapWorkArea, ReferenceLayer, Subscription } from '../data/firma2-geography';
import { AREA_GROUPS } from '../data/firma2-geospatial-areas';
import type { AreaGroup } from '../data/firma2-geospatial-areas';

export const GEO_CHANGE_EVENT = 'firma2:geo-change';

const WORK_AREAS_KEY = 'firma2:work-areas:v1';
const SOURCE_KEY = 'firma2:project-source:v1';
const LAYERS_KEY = 'firma2:reference-layers:v1';
const SUBSCRIPTIONS_KEY = 'firma2:subscriptions:v1';
const DRAFT_KEY = 'firma2:subscription-draft:v1';
const MAP_STYLE_KEY = 'firma2:map-style:v1';
// v2: lists saved under v1 held the invented groups beside a real workspace's own.
const AREA_GROUPS_KEY = 'firma2:area-groups:v2';
const AREA_DETAILS_KEY = 'firma2:area-details:v1';
export const GEO_KEYS = [WORK_AREAS_KEY, SOURCE_KEY, LAYERS_KEY, SUBSCRIPTIONS_KEY, DRAFT_KEY, MAP_STYLE_KEY, AREA_GROUPS_KEY, AREA_DETAILS_KEY];

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private window or blocked storage: the change holds for this page view.
  }
  document.dispatchEvent(new CustomEvent(GEO_CHANGE_EVENT, { detail: { key } }));
};

/** Re-run `paint` whenever any geospatial state changes, here or in another window. */
export const onGeoChange = (paint: () => void): void => {
  document.addEventListener(GEO_CHANGE_EVENT, paint);
  window.addEventListener('storage', (event) => {
    if (event.key && GEO_KEYS.includes(event.key)) paint();
  });
};

// ---- work areas ---------------------------------------------------------------

type WorkAreaStore = Record<string, MapWorkArea[]>;

export const readWorkAreas = (slug: string, seed: MapWorkArea[]): MapWorkArea[] =>
  read<WorkAreaStore>(WORK_AREAS_KEY, {})[slug] ?? seed;

export const writeWorkAreas = (slug: string, areas: MapWorkArea[]): void => {
  const store = read<WorkAreaStore>(WORK_AREAS_KEY, {});
  write(WORK_AREAS_KEY, { ...store, [slug]: areas });
};

/** Every project's work areas at once — the portfolio map's read. */
export const readAllWorkAreas = (seeds: Record<string, MapWorkArea[]>): Record<string, MapWorkArea[]> => {
  const store = read<WorkAreaStore>(WORK_AREAS_KEY, {});
  return Object.fromEntries(Object.entries(seeds).map(([slug, seed]) => [slug, store[slug] ?? seed]));
};

let nextId = 0;
export const newWorkAreaId = (slug: string): string => `${slug}-new-${Date.now().toString(36)}-${(nextId += 1)}`;

// ---- project source -------------------------------------------------------------

export type ProjectSource = 'app' | 'subscribed';

export const readProjectSource = (): ProjectSource => (read<string>(SOURCE_KEY, 'app') === 'subscribed' ? 'subscribed' : 'app');
export const writeProjectSource = (source: ProjectSource): void => write(SOURCE_KEY, source);

// ---- reference layers -------------------------------------------------------------

// A layer or group that comes from an area file on disk (dev only) is always
// there: a browser that saved its lists before the file arrived still gets it.
const withFileSeeds = <T extends { id: string }>(stored: T[], seeds: T[]): T[] => [
  ...stored,
  ...seeds.filter((seed) => seed.id.startsWith('file-') && !stored.some((s) => s.id === seed.id)),
];

export const readLayers = (): ReferenceLayer[] => withFileSeeds(read<ReferenceLayer[]>(LAYERS_KEY, REFERENCE_LAYERS), REFERENCE_LAYERS);
export const writeLayers = (layers: ReferenceLayer[]): void => write(LAYERS_KEY, layers);

// ---- geospatial area groups ------------------------------------------------------

export const readAreaGroups = (): AreaGroup[] => withFileSeeds(read<AreaGroup[]>(AREA_GROUPS_KEY, AREA_GROUPS), AREA_GROUPS);
export const writeAreaGroups = (groups: AreaGroup[]): void => write(AREA_GROUPS_KEY, groups);

/**
 * What a person adds to one area: the layer gives its shape and name, and these
 * are kept beside it, by area key (src/lib/geospatial-areas `areaKey`). Its
 * performance measures and targets are in the taxonomy store under the same key.
 */
export interface AreaDetails {
  description?: string;
  /** Its own colour; unset, it wears its group's. */
  color?: string;
}

export const readAreaDetails = (key: string): AreaDetails => read<Record<string, AreaDetails>>(AREA_DETAILS_KEY, {})[key] ?? {};
export const writeAreaDetails = (key: string, details: AreaDetails): void =>
  write(AREA_DETAILS_KEY, { ...read<Record<string, AreaDetails>>(AREA_DETAILS_KEY, {}), [key]: details });

// ---- map style ---------------------------------------------------------------------

/** The base maps every map's layers control offers, in its order. */
export const BASEMAPS = [
  { value: 'map', label: 'Map' },
  { value: 'topo', label: 'Topographic' },
  { value: 'terrain', label: 'Terrain' },
  { value: 'imagery', label: 'Satellite' },
] as const;
export type BasemapId = (typeof BASEMAPS)[number]['value'];

/**
 * How the workspace's own shapes are painted, and what they open on. A null
 * colour follows the house colour — a token, so it keeps tracking the colour
 * scheme — where a chosen one is the same hex in light and dark.
 */
export interface MapStyle {
  basemap: BasemapId;
  /** Areas and points share one colour: a point is an area too small to outline. */
  areaColor: string | null;
  reachColor: string | null;
  /** 0 to 1. The wash inside an area's edge. */
  areaFillOpacity: number;
  /**
   * What a project's work is coloured by: `stage`, `projectType`,
   * `group:<classification group slug>`, or `none` — the two fixed colours
   * above (src/lib/map-color.ts).
   */
  colorBy: string;
}

export const DEFAULT_MAP_STYLE: MapStyle = { basemap: 'map', areaColor: null, reachColor: null, areaFillOpacity: 0.18, colorBy: 'stage' };

export const readMapStyle = (): MapStyle => ({ ...DEFAULT_MAP_STYLE, ...read<Partial<MapStyle>>(MAP_STYLE_KEY, {}) });
export const writeMapStyle = (style: MapStyle): void => write(MAP_STYLE_KEY, style);

// ---- subscriptions -----------------------------------------------------------------

export const readSubscriptions = (): Subscription[] => read<Subscription[]>(SUBSCRIPTIONS_KEY, [SEED_SUBSCRIPTION]);
export const writeSubscriptions = (subscriptions: Subscription[]): void => write(SUBSCRIPTIONS_KEY, subscriptions);

// ---- the subscription being set up ---------------------------------------------------

export interface SubscriptionDraft {
  /** Index into SUBSCRIPTION_STEPS of the step it stopped on. */
  step: number;
  subscription: Subscription;
}

export const readSubscriptionDraft = (): SubscriptionDraft | null => read<SubscriptionDraft | null>(DRAFT_KEY, null);
export const writeSubscriptionDraft = (draft: SubscriptionDraft): void => write(DRAFT_KEY, draft);
export const clearSubscriptionDraft = (): void => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Blocked storage: there was nothing persisted to clear.
  }
  document.dispatchEvent(new CustomEvent(GEO_CHANGE_EVENT, { detail: { key: DRAFT_KEY } }));
};
