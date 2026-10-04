// Geometry the work-area screens need, and nothing else: an area's acres, a
// reach's miles, whether a point sits inside a ring, and reading a coordinate
// pair the way a spec sheet prints it.
//
// [lat, lng] THROUGHOUT, the order a person writes a pair and the order
// WorkArea.path already uses. GeoJSON's [lng, lat] appears in exactly one place
// — the export, which builds its features from these.
//
// MEASURED ON THE SPHERE, not on the screen. Web Mercator inflates area by the
// square of the latitude's secant, so a polygon measured in projected pixels at
// Mount Shasta would read a quarter larger than the same polygon at San Diego.
// The spherical-excess sum below is the one Leaflet.draw ships as
// geodesicArea; at the scale of a treatment unit it agrees with an equal-area
// projection to well under a percent, which is closer than anyone digitizes.

export type LatLng = [number, number];

const EARTH_RADIUS_M = 6378137;
const SQ_M_PER_ACRE = 4046.8564224;
const M_PER_MILE = 1609.344;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Acres enclosed by a ring. The ring need not repeat its first vertex. */
export const ringAcres = (ring: LatLng[]): number => {
  if (ring.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const [lat1, lng1] = ring[i];
    const [lat2, lng2] = ring[(i + 1) % ring.length];
    sum += rad(lng2 - lng1) * (2 + Math.sin(rad(lat1)) + Math.sin(rad(lat2)));
  }
  return Math.abs((sum * EARTH_RADIUS_M * EARTH_RADIUS_M) / 2) / SQ_M_PER_ACRE;
};

/** Great-circle distance between two vertices, in miles. */
const segmentMiles = ([lat1, lng1]: LatLng, [lat2, lng2]: LatLng): number => {
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return (2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a))) / M_PER_MILE;
};

/** Miles along a line, vertex to vertex. */
export const pathMiles = (path: LatLng[]): number =>
  path.slice(1).reduce((total, vertex, i) => total + segmentMiles(path[i], vertex), 0);

/** Ray casting. Good enough for the simple, non-self-intersecting rings here. */
export const pointInRing = ([lat, lng]: LatLng, ring: LatLng[]): boolean => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [latI, lngI] = ring[i];
    const [latJ, lngJ] = ring[j];
    const crosses = latI > lat !== latJ > lat && lng < ((lngJ - lngI) * (lat - latI)) / (latJ - latI) + lngI;
    if (crosses) inside = !inside;
  }
  return inside;
};

/** The vertex average — where a label or a point stands in for a shape. */
export const centroid = (path: LatLng[]): LatLng => {
  const n = path.length || 1;
  const [lat, lng] = path.reduce(([a, b], [c, d]) => [a + c, b + d], [0, 0]);
  return [lat / n, lng / n];
};

/**
 * Read a coordinate the way people paste one. A spec sheet prints
 * "47.6062, -122.3321" on one line; a GIS export prints "47.6062 -122.3321";
 * both are a pair. Returns null for anything that is not two numbers, so the
 * caller types the paste through untouched rather than half-splitting it.
 */
export const parsePair = (text: string): LatLng | null => {
  const parts = text.trim().split(/[,\s]+/).filter(Boolean);
  if (parts.length !== 2) return null;
  const [lat, lng] = parts.map(Number);
  return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
};

/**
 * Why a coordinate is refused, or null when it is usable. A latitude past 90
 * is a typo every time, and plotting it somewhere unfindable is worse than
 * declining it.
 */
export const coordinateProblem = (latText: string, lngText: string): string | null => {
  if (!latText.trim() || !lngText.trim()) return null;
  const lat = Number(latText);
  const lng = Number(lngText);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return 'Both values need to be numbers, like 40.0231 and -122.0654.';
  if (lat < -90 || lat > 90) return 'Latitude runs from -90 to 90. Check the first number.';
  if (lng < -180 || lng > 180) return 'Longitude runs from -180 to 180. Check the second number.';
  return null;
};

/**
 * A POSITIVE longitude is not refused — it is a real place — but in this
 * program's part of the world it is the most common silent error there is: a
 * project that lands in China and, zoomed in, looks like nothing happened.
 */
export const coordinateWarning = (lngText: string): string | null =>
  Number(lngText) > 0 ? 'That longitude is east of Greenwich, on the other side of the world. In California it is negative.' : null;

/** "62 acres", "4.1 miles" — the unit is part of the value. */
export const formatExtent = (extent: number | null, unit: 'acres' | 'miles' | null): string => {
  if (extent == null || !unit) return '';
  const digits = unit === 'acres' ? (extent < 10 ? 1 : 0) : 1;
  return `${extent.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: 0 })} ${unit}`;
};

/**
 * A project's size in one line — its areas' acres summed, or, for a project
 * of reaches alone, their miles. Acres win because an area is the footprint;
 * a reach crossing it adds no ground. `label` names what the figure is — an
 * Area or a Length — for whoever cannot see the glyph that leads it.
 */
export const projectSize = (
  areas: { unit: 'acres' | 'miles' | null; extent: number | null }[],
): { label: 'Area' | 'Length'; text: string } => {
  const acres = areas.reduce((t, a) => t + (a.unit === 'acres' ? (a.extent ?? 0) : 0), 0);
  const miles = areas.reduce((t, a) => t + (a.unit === 'miles' ? (a.extent ?? 0) : 0), 0);
  if (acres) return { label: 'Area', text: formatExtent(Math.round(acres), 'acres') };
  if (miles) return { label: 'Length', text: formatExtent(miles, 'miles') };
  return { label: 'Area', text: 'No work areas mapped' };
};
