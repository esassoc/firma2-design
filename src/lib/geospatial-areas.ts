// Which projects fall in which geospatial area. A group's areas are its
// layer's shapes; a project is filed under every area its work touches.
//
// STORED, AND RE-COUNTED ONLY WHEN SOMETHING IT RESTS ON CHANGES
// (docs/data-model.md, decision 10): one row per project and area. The rows
// are kept with a signature of what they were counted from, the group's layer,
// its name field, its areas and every project's work areas. A work area
// redrawn on a project, or a layer changed on Map layers, changes the
// signature, and the next read counts again and stores the result. Nobody
// edits a filing by hand.
//
// FAKED HERE, AND WHAT THE REAL THING DOES:
//   The shapes. A real group asks its layer's service for them. This prototype
//   holds shapes for two service layers only (`draws`); any other reads as
//   "couldn't be read", which is also the sample for that state.
//   The name field. The stored shapes carry a name and an id, so a field with
//   ACRES in it reads the acreage, an id or code field the id, anything else the name.
//   An uploaded file. Whatever is chosen reads as the one sample
//   (AREA_FILE_SAMPLES): five habitat areas, placed around the workspace.
//   "Touches". A real test is a true intersection. Here a project is in an
//   area when a vertex of one of its work areas, or a work area's middle,
//   falls inside the area's ring.

import { HABITAT_AREAS, HYDROLOGIC_REGIONS, LAYER_KINDS, PROBE_RESULTS, SUBWATERSHEDS, seedWorkAreas } from '../data/firma2-geography';
import type { ReferenceLayer } from '../data/firma2-geography';
import { areaFileOf } from '../data/firma2-geospatial-areas';
import type { AreaGroup } from '../data/firma2-geospatial-areas';
import { projects, projectSlug } from '../data/firma2-projects';
import { centroid, pointInRing, ringAcres } from './geo';
import type { LatLng } from './geo';
import { readAllWorkAreas, readAreaDetails, readAreaGroups, readLayers } from './work-areas';

export interface Area {
  id: string;
  name: string;
  ring: LatLng[];
  /** Every piece of an area that is in several; absent when `ring` is all of it. */
  parts?: LatLng[][];
  acres: number;
}

export interface FiledProject {
  slug: string;
  name: string;
  /** The middle of its work, for a dot. */
  at: LatLng;
}

export interface Filing {
  /** `no-layer`: the layer was deleted. `unread`: the layer has no shapes to read. */
  status: 'ok' | 'no-layer' | 'unread';
  layer: ReferenceLayer | null;
  areas: { area: Area; projects: FiledProject[] }[];
  /** Located, but in none of the group's areas. */
  outside: FiledProject[];
  /** No work areas at all, so there is nowhere to file them by. */
  unlocated: { slug: string; name: string }[];
  /** Projects in at least one area. */
  filed: number;
}

/** Layers that send shapes. A picture of a boundary (WMS, a map server) has no areas to read. */
export const shapeLayers = (): ReferenceLayer[] =>
  readLayers().filter((layer) => !LAYER_KINDS.find((k) => k.value === layer.kind)?.raster);

/** The fields a layer's shapes carry, for naming areas. */
export const nameFields = (layer: ReferenceLayer): string[] => {
  const fields = layer.fields ?? PROBE_RESULTS[layer.kind]?.fields ?? [];
  return layer.popupField && !fields.includes(layer.popupField) ? [layer.popupField, ...fields] : fields;
};

const fieldValue = (shape: { id: string; name: string; acres: number }, field: string): string =>
  /acre/i.test(field) ? shape.acres.toLocaleString('en-US') : /(^|_)id$|code|huc/i.test(field) ? shape.id : shape.name;

const areasOf = (layer: ReferenceLayer, field: string): Area[] => {
  // An area file on disk (dev only) carries real attribute rows: the field is read, not faked.
  const file = layer.draws === 'file' ? areaFileOf(layer.id) : undefined;
  if (file) {
    return file.shapes
      .map((s) => ({ id: s.id, name: s.fields[field] ?? s.fields[file.nameField] ?? s.id, ring: s.parts[0] ?? [], parts: s.parts, acres: s.acres }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }
  const shapes =
    layer.draws === 'regions'
      ? HYDROLOGIC_REGIONS.map((r) => ({ ...r, acres: Math.round(ringAcres(r.ring)) }))
      : layer.draws === 'subwatersheds'
        ? SUBWATERSHEDS
        : layer.draws === 'habitat'
          ? HABITAT_AREAS
          : [];
  return shapes
    .map((s) => ({ id: s.id, name: fieldValue(s, field), ring: s.ring, acres: s.acres }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

const seeds = Object.fromEntries(projects.map((p) => [projectSlug(p), seedWorkAreas(p)]));

// ---- the stored filing -------------------------------------------------------
//
// FAKED: the rows live in this browser's localStorage, one entry per group.
// At build time there is no store, so the filing is counted and not kept.

const FILING_KEY = 'firma2:area-filing:v1';

/** One stored row: this project is filed under this area. */
export interface AreaFiling {
  project: string;
  area: string;
}

interface StoredFiling {
  /** What the rows were counted from. A different signature means count again. */
  signature: string;
  rows: AreaFiling[];
}

const readStored = (groupId: string): StoredFiling | null => {
  try {
    const all = JSON.parse(localStorage.getItem(FILING_KEY) ?? '{}');
    return all && typeof all === 'object' ? (all[groupId] ?? null) : null;
  } catch {
    return null;
  }
};

const writeStored = (groupId: string, stored: StoredFiling): void => {
  try {
    const all = JSON.parse(localStorage.getItem(FILING_KEY) ?? '{}');
    localStorage.setItem(FILING_KEY, JSON.stringify({ ...(all && typeof all === 'object' ? all : {}), [groupId]: stored }));
  } catch {
    // No store (the build, or blocked storage): counted each time instead.
  }
};

/** A short, stable fingerprint of a value. */
const fingerprint = (value: unknown): string => {
  const text = JSON.stringify(value);
  let h = 5381;
  for (let i = 0; i < text.length; i += 1) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return `${text.length}:${h.toString(36)}`;
};

export const filing = (group: AreaGroup): Filing => {
  const layer = readLayers().find((l) => l.id === group.layerId) ?? null;
  const areas = layer ? areasOf(layer, group.nameField) : [];
  const status = !layer ? 'no-layer' : areas.length ? 'ok' : 'unread';
  const work = readAllWorkAreas(seeds);
  const rows = areas.map((area) => ({ area, projects: [] as FiledProject[] }));
  const outside: FiledProject[] = [];
  const unlocated: { slug: string; name: string }[] = [];
  let filed = 0;

  const signature = fingerprint([group.layerId, group.nameField, areas.map((a) => [a.id, a.parts ?? a.ring]), projects.map((p) => (work[projectSlug(p)] ?? []).map((s) => s.path))]);
  const stored = readStored(group.id);
  const kept = stored?.signature === signature ? stored.rows : null;
  const counted: AreaFiling[] = [];

  projects.forEach((p) => {
    const slug = projectSlug(p);
    const shapes = work[slug] ?? [];
    if (!shapes.length) {
      unlocated.push({ slug, name: p.projectName });
      return;
    }
    const project = { slug, name: p.projectName, at: centroid(shapes.flatMap((s) => s.path)) };
    let hits: typeof rows;
    if (kept) {
      const under = new Set(kept.filter((row) => row.project === slug).map((row) => row.area));
      hits = rows.filter((row) => under.has(row.area.id));
    } else {
      const points = shapes.flatMap((s) => [...s.path, centroid(s.path)]);
      hits = rows.filter((row) => (row.area.parts ?? [row.area.ring]).some((ring) => points.some((point) => pointInRing(point, ring))));
      hits.forEach((row) => counted.push({ project: slug, area: row.area.id }));
    }
    hits.forEach((row) => row.projects.push(project));
    if (hits.length) filed += 1;
    else outside.push(project);
  });
  if (!kept) writeStored(group.id, { signature, rows: counted });
  return { status, layer, areas: rows, outside, unlocated, filed };
};

/** One area's key: what its details, measures and targets are kept under, and its page's `?slug=`. */
export const areaKey = (groupId: string, areaId: string): string => `${groupId}~${areaId}`;
export const parseAreaKey = (key: string): { groupId: string; areaId: string } => {
  const at = key.indexOf('~');
  return { groupId: key.slice(0, at), areaId: key.slice(at + 1) };
};

/** The reader's page for one area. Base-less ("/prototypes/…"). */
export const areaHref = (groupId: string, areaId: string): string => `/prototypes/geospatial-areas/${groupId}/${areaId}`;

/** A group's colour: its own, else its layer's line colour. */
export const groupColor = (group: AreaGroup, layer: ReferenceLayer | null): string => group.color ?? layer?.stroke ?? '#6b7280';
/** An area's colour: its own, else its group's. */
export const areaColor = (group: AreaGroup, layer: ReferenceLayer | null, areaId: string): string =>
  readAreaDetails(areaKey(group.id, areaId)).color ?? groupColor(group, layer);

export const areaGroup = (id: string): AreaGroup | null => readAreaGroups().find((g) => g.id === id) ?? null;

/** An id for a group made in this browser. */
export const newAreaGroupId = (name: string): string =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'group'}-${Date.now().toString(36)}`;
