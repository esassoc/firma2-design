// What the geospatial screens remember — localStorage, the same stand-in for a
// server every other prototype in this spoke uses. Versioned keys, so a shape
// change later discards stale state instead of misreading it.
//
// FOUR THINGS, each keyed on its own so one screen's reset never takes
// another's with it:
//
//   work areas      per project, written whole: the record's shapes as edited.
//                   Absent means "as seeded" — so a project nobody touched
//                   keeps following the fixture.
//   project source  how this workspace gets its projects (decision 15): made
//                   in ProjectFirma, or read from a GIS subscription. It
//                   decides whether the drawing tools exist at all.
//   layers          the workspace's reference layers, as edited in settings.
//   subscriptions   the GIS subscriptions, as edited and synced.
//
// Every write dispatches one document event and the browser's own `storage`
// event carries it to other windows, so a map in one tab follows a setting
// changed in another.

import { REFERENCE_LAYERS, SEED_SUBSCRIPTION } from '../data/firma2-geography';
import type { MapWorkArea, ReferenceLayer, Subscription } from '../data/firma2-geography';

export const GEO_CHANGE_EVENT = 'firma2:geo-change';

const WORK_AREAS_KEY = 'firma2:work-areas:v1';
const SOURCE_KEY = 'firma2:project-source:v1';
const LAYERS_KEY = 'firma2:reference-layers:v1';
const SUBSCRIPTIONS_KEY = 'firma2:subscriptions:v1';
export const GEO_KEYS = [WORK_AREAS_KEY, SOURCE_KEY, LAYERS_KEY, SUBSCRIPTIONS_KEY];

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

export const readLayers = (): ReferenceLayer[] => read<ReferenceLayer[]>(LAYERS_KEY, REFERENCE_LAYERS);
export const writeLayers = (layers: ReferenceLayer[]): void => write(LAYERS_KEY, layers);

// ---- subscriptions -----------------------------------------------------------------

export const readSubscriptions = (): Subscription[] => read<Subscription[]>(SUBSCRIPTIONS_KEY, [SEED_SUBSCRIPTION]);
export const writeSubscriptions = (subscriptions: Subscription[]): void => write(SUBSCRIPTIONS_KEY, subscriptions);
