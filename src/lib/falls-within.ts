// Which reference places a work area touches — the "Falls within" list on the
// record rail's Map mode (firma2-work-areas, rail size).
//
// A coarse intersection, matched to the coarse geography it runs against
// (src/data/firma2-geography.ts draws its regions and subwatersheds by hand):
// a shape touches a place when any of its vertices or its centre sits inside
// the place's ring, or — for an area — any of the ring's vertices sits inside
// the shape. That catches a place wholly inside a big area and an area
// straddling a boundary, which is all a list of names needs. It is not a
// topology engine and does not pretend to be.
//
// Pure: geometry in, names out, so the browser can rerun it as shapes are
// drawn and reshaped. No data module is imported, which keeps the project
// data out of the client bundle.

import { centroid, pointInRing } from './geo';
import type { LatLng } from './geo';

export interface PlaceRing {
  id: string;
  name: string;
  ring: LatLng[];
}

export interface ShapeForPlaces {
  id: string;
  label: string;
  kind: 'area' | 'reach' | 'point';
  path: LatLng[];
}

/** Whether one shape touches one ring. */
export const touches = (shape: ShapeForPlaces, ring: LatLng[]): boolean => {
  if (!shape.path.length) return false;
  if (shape.path.some((v) => pointInRing(v, ring))) return true;
  if (pointInRing(centroid(shape.path), ring)) return true;
  return shape.kind === 'area' && ring.some((v) => pointInRing(v, shape.path));
};

export interface PlaceHit {
  id: string;
  name: string;
  /** The layer it comes from, as the provenance line names it. */
  layer: string;
  /** Labels of the shapes that touch it, in the shapes' order. */
  shapes: string[];
}

/**
 * Every place, across the given layers, that at least one shape touches —
 * layer by layer in the order given, places in each layer's own order.
 */
export const fallsWithin = (
  shapes: ShapeForPlaces[],
  layers: { layer: string; places: PlaceRing[] }[],
): PlaceHit[] =>
  layers.flatMap(({ layer, places }) =>
    places
      .map((place) => ({
        id: place.id,
        name: place.name,
        layer,
        shapes: shapes.filter((s) => touches(s, place.ring)).map((s) => s.label),
      }))
      .filter((hit) => hit.shapes.length > 0),
  );
