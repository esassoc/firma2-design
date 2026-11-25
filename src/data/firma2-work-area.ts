// A work area — one place a project's work happens: an area, a stream reach or
// a point. A project has as many as its work needs.
//
// ONE DEFINITION (docs/data-model.md, decision 13). Until 2026-11-24 the
// project record described a work area one way (label, kind, path, extent,
// extentUnit) and every map described it another (the same, plus an id, points
// and where the shape came from). The record's was the poorer copy of the
// map's, so the map's is the one that stayed.
//
// A leaf module with no data imports: the project record and the geography
// module both build on it.

import type { LatLng } from '../lib/geo';

export type WorkAreaKind = 'area' | 'reach' | 'point';

export interface WorkArea {
  /** Stable within the workspace: `<project slug>-<n>`. */
  id: string;
  /** What the shape is on the ground. "Lower reach planting unit", "Tidal basin". */
  label: string;
  kind: WorkAreaKind;
  /** [lat, lng] vertices. Closed automatically for an area. A point is a path of one. */
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
