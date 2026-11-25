// What this browser knows about a project's photos beyond the seed: the
// manager's edits to each photo's metadata, the order they put them in, the
// Featured choice, and the photos they added this session.
//
// FAKED: the prototype has no server. Edits to the seeded photos persist in
// localStorage (src/lib/featured-photo.ts keeps the Featured key as before);
// a photo ADDED here lives in memory only, because its pixels are a blob URL
// that dies with the page. A real tenant stores all of it with the upload.
//
// A photo's id is its place in the seed (`p0`, `p1`…) — stable under reorder —
// or `a<n>` for one added in this session.
import type { PhotoStage, ProjectPhoto } from '../data/firma2-project-detail';
import { readFeatured, writeFeatured } from './featured-photo';
import { seededFeatured } from '../data/firma2-featured-photos';

const KEY = 'firma2:photo-meta';
export const PHOTO_META_EVENT = 'firma2:photo-meta';

export const STAGES: { value: PhotoStage; label: string }[] = [
  { value: 'before', label: 'Before' },
  { value: 'during', label: 'During' },
  { value: 'after', label: 'After' },
];
export const stageLabel = (stage: PhotoStage): string => STAGES.find((s) => s.value === stage)?.label ?? '';

/** The fields a person edits on a photo. Everything else about it is the file's. */
export type PhotoMetaPatch = Partial<
  Pick<ProjectPhoto, 'caption' | 'alt' | 'stage' | 'point' | 'collection' | 'public' | 'takenOn' | 'workArea' | 'credit'>
>;

/** A photo as the record shows it: the seed, then this browser's edits. */
export interface ResolvedPhoto extends ProjectPhoto {
  id: string;
  featured: boolean;
  /** Present for a photo added this session: its own pixels, thumb and full. */
  thumb?: string;
  full?: string;
}

interface Stored {
  patches: Record<string, PhotoMetaPatch>;
  /** Photo ids in the order the manager set; ids not listed follow in seed order. */
  order: string[];
  removed: string[];
}

const empty = (): Stored => ({ patches: {}, order: [], removed: [] });

const readAll = (): Record<string, Stored> => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const read = (slug: string): Stored => ({ ...empty(), ...(readAll()[slug] ?? {}) });

const write = (slug: string, next: Stored): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...readAll(), [slug]: next }));
  } catch {
    /* blocked storage: the edit lasts until the page reloads */
  }
  window.dispatchEvent(new CustomEvent(PHOTO_META_EVENT, { detail: { slug } }));
};

// Photos added this session, per project. Memory only (see the header).
const added = new Map<string, ResolvedPhoto[]>();
let addedCount = 0;

/** The seed as the record shows it with no edits: for build time, where there is no browser to ask. */
export const plainPhotos = (slug: string, seed: ProjectPhoto[]): ResolvedPhoto[] => {
  const featuredAt = seededFeatured(slug, seed.length);
  return seed.map((photo, i) => ({ ...photo, id: `p${i}`, featured: i === featuredAt }));
};

/**
 * The photo that leads the public page: the Featured one when the public may
 * see it, else the newest public photo — a private frame never fronts a page.
 */
export const leadPhoto = (photos: ResolvedPhoto[]): ResolvedPhoto | undefined => {
  const open = photos.filter((p) => p.public);
  return open.find((p) => p.featured) ?? open[open.length - 1];
};

/** A project's photos as they stand, in the manager's order. */
export const resolvePhotos = (slug: string, seed: ProjectPhoto[]): ResolvedPhoto[] => {
  const stored = read(slug);
  const featuredAt = readFeatured(slug, seed.length);
  const base: ResolvedPhoto[] = seed.map((photo, i) => ({
    ...photo,
    ...(stored.patches[`p${i}`] ?? {}),
    id: `p${i}`,
    featured: i === featuredAt,
  }));
  const all = [...base, ...(added.get(slug) ?? []).map((p) => ({ ...p, ...(stored.patches[p.id] ?? {}) }))].filter(
    (p) => !stored.removed.includes(p.id),
  );
  const rank = (id: string): number => {
    const at = stored.order.indexOf(id);
    return at < 0 ? Number.MAX_SAFE_INTEGER : at;
  };
  // A stable sort: unlisted photos keep their seed order behind the listed ones.
  return all
    .map((p, i) => ({ p, i }))
    .sort((a, b) => rank(a.p.id) - rank(b.p.id) || a.i - b.i)
    .map(({ p }) => p);
};

export const patchPhoto = (slug: string, id: string, patch: PhotoMetaPatch): void => {
  const stored = read(slug);
  write(slug, { ...stored, patches: { ...stored.patches, [id]: { ...(stored.patches[id] ?? {}), ...patch } } });
};

/** Several photos at once — the review pass after a multi-file drop. */
export const patchPhotos = (slug: string, ids: string[], patch: PhotoMetaPatch): void => {
  const stored = read(slug);
  const patches = { ...stored.patches };
  ids.forEach((id) => (patches[id] = { ...(patches[id] ?? {}), ...patch }));
  write(slug, { ...stored, patches });
};

export const orderPhotos = (slug: string, ids: string[]): void => write(slug, { ...read(slug), order: ids });

export const removePhoto = (slug: string, id: string): void => {
  const stored = read(slug);
  write(slug, { ...stored, removed: [...stored.removed, id] });
};

/** Mark a photo Featured. Only a seeded photo can lead the public page here (see the header). */
export const featurePhoto = (slug: string, id: string): void => {
  const at = Number(id.slice(1));
  if (id.startsWith('p') && Number.isFinite(at)) writeFeatured(slug, at);
};

/** A photo added this session. The caller supplies what the file told it. */
export const addPhoto = (
  slug: string,
  input: { thumb: string; full: string; caption: string; takenOn: string; date: string; workArea?: string },
): ResolvedPhoto => {
  const photo: ResolvedPhoto = {
    id: `a${addedCount++}`,
    featured: false,
    caption: input.caption,
    alt: '',
    date: input.date,
    takenOn: input.takenOn,
    scene: 'stream',
    seed: 0,
    stage: 'during',
    public: true,
    workArea: input.workArea,
    thumb: input.thumb,
    full: input.full,
  };
  added.set(slug, [...(added.get(slug) ?? []), photo]);
  write(slug, read(slug));
  return photo;
};

// ---------------------------------------------------------------------------
// What the metadata means
// ---------------------------------------------------------------------------

/** One view over time: the photos taken from one named point, oldest first. */
export interface PhotoPoint {
  name: string;
  photos: ResolvedPhoto[];
  /** A Before and an After at the point: the pair the public page lets a reader compare. */
  pair: { before: ResolvedPhoto; after: ResolvedPhoto } | null;
}

const STAGE_RANK: Record<PhotoStage, number> = { before: 0, during: 1, after: 2 };

const byTime = (a: ResolvedPhoto, b: ResolvedPhoto): number =>
  STAGE_RANK[a.stage] - STAGE_RANK[b.stage] || a.takenOn.localeCompare(b.takenOn);

/** Every photo point holding two or more photos. */
export const pointsOf = (photos: ResolvedPhoto[]): PhotoPoint[] => {
  const groups = new Map<string, ResolvedPhoto[]>();
  photos.forEach((p) => p.point && groups.set(p.point, [...(groups.get(p.point) ?? []), p]));
  return [...groups.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([name, list]) => {
      const sorted = [...list].sort(byTime);
      const before = sorted.find((p) => p.stage === 'before');
      const after = [...sorted].reverse().find((p) => p.stage === 'after');
      return { name, photos: sorted, pair: before && after ? { before, after } : null };
    });
};

/** The names a manager can pick for a photo point or a collection, as already used on this record. */
export const namesOf = (photos: ResolvedPhoto[], key: 'point' | 'collection'): string[] => [
  ...new Set(photos.map((p) => p[key]).filter((n): n is string => !!n)),
];

/** The first complete pair on a record, for the public page's compare. */
export const leadPair = (photos: ResolvedPhoto[]): { before: ResolvedPhoto; after: ResolvedPhoto } | null =>
  pointsOf(photos.filter((p) => p.public)).find((p) => p.pair)?.pair ?? null;
