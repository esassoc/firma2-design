// Estimate methods — the fourth source of a measure's figure.
//
// A METHOD IS A COEFFICIENT TABLE. quantity × coefficient, where the quantity
// is read off the project's mapped work areas (acres of each area) and the
// coefficient is looked up by the project's PRACTICE and the REGION each area
// sits in. Nobody types the result: an `estimated` measure
// (src/data/firma2-performance-measures.ts) shows it on every project it
// applies to, with how it was worked out one disclosure away.
//
// Pattern learned from FieldDoc's model-run estimates (2026-11-12 study): the
// figure is only as good as its inputs, so when an input is missing the
// record says WHICH, instead of printing a number.
//
// ⚠ MOCK. EVERY COEFFICIENT BELOW IS INVENTED. They are plausible in
// magnitude for planted riparian ground and rewetted meadow, and taken from
// no published model, protocol or calculator. Do not cite them. This repo and
// its site are public.
//
// PURE and DETERMINISTIC: no imports beyond geometry, no randomness, so the
// project page's client script can run it against the work areas as they are
// edited in the browser.

import { centroid, pointInRing } from '../lib/geo';
import type { LatLng } from '../lib/geo';

export interface EstimateMethod {
  id: string;
  /** What the provenance line and the disclosure call it. */
  name: string;
  /** Which edition of the table produced a figure — part of its provenance. */
  version: string;
  /** The figure's unit; a measure using the method takes this unit. */
  unit: string;
  /** What the coefficient multiplies. Only areas carry acres. */
  quantity: 'acres';
  /** The coefficient's own unit, as the disclosure prints it. */
  coefficientUnit: string;
  /** practice (a classification name) → region id → coefficient. */
  coefficients: Record<string, Record<string, number>>;
}

export const ESTIMATE_METHODS: EstimateMethod[] = [
  {
    id: 'planting-rewetting-carbon',
    name: 'Restoration carbon',
    version: '2026.1',
    unit: 'tonnes CO2e per year',
    quantity: 'acres',
    coefficientUnit: 'tonnes per acre a year',
    // MOCK coefficients. East Shore has no rewetting figure ON PURPOSE: it is
    // the case where the method cannot answer, and the page has to say so.
    coefficients: {
      'Native planting': {
        'truckee-river': 1.9,
        'north-shore': 2.2,
        'east-shore': 1.6,
        'south-shore': 2.4,
        'west-shore': 2.6,
        'upper-carson': 1.4,
      },
      'Meadow & marsh rewetting': {
        'truckee-river': 0.9,
        'north-shore': 1.1,
        'south-shore': 1.3,
        'west-shore': 1.2,
        'upper-carson': 0.8,
      },
    },
  },
];

export const getEstimateMethod = (id: string | undefined): EstimateMethod | undefined =>
  ESTIMATE_METHODS.find((m) => m.id === id);

/** The practices a method has any coefficient for, in table order. */
export const methodPractices = (method: EstimateMethod): string[] => Object.keys(method.coefficients);

// ---------------------------------------------------------------------------
// Running a method
// ---------------------------------------------------------------------------

/** The slice of a work area a method reads. */
export interface EstimateArea {
  label: string;
  kind: 'area' | 'reach' | 'point';
  extent: number | null;
  path: LatLng[];
}

/** The slice of a region a method reads. */
export interface EstimateRegion {
  id: string;
  name: string;
  ring: LatLng[];
}

/** One area's share of the estimate, as the disclosure lists it. */
export interface EstimateLine {
  label: string;
  acres: number;
  region: string | null;
  /** Null when the table has no figure for this practice in this region. */
  coefficient: number | null;
  value: number | null;
}

export type EstimateResult =
  | {
      ok: true;
      value: number;
      practice: string;
      lines: EstimateLine[];
    }
  | {
      ok: false;
      /** Short, for the figure's own cell. */
      missing: string;
      /** What to do about it, for the disclosure. */
      fix: string;
      practice: string | null;
      lines: EstimateLine[];
    };

/**
 * Run a method against one project: its classifications (the practice is the
 * first one the table covers) and its work areas (each area's region is the
 * one its centre falls in). Reaches and points carry no acres and are left
 * out. Areas the table has no coefficient for are listed but not counted.
 */
export const runEstimate = (
  method: EstimateMethod,
  classifications: string[],
  areas: EstimateArea[],
  regions: EstimateRegion[],
): EstimateResult => {
  const practice = classifications.find((c) => method.coefficients[c]) ?? null;
  const sized = areas.filter((a) => a.kind === 'area' && (a.extent ?? 0) > 0);
  const lines: EstimateLine[] = sized.map((a) => {
    const region = regions.find((r) => pointInRing(centroid(a.path), r.ring)) ?? null;
    const coefficient = practice && region ? method.coefficients[practice][region.id] ?? null : null;
    const acres = a.extent ?? 0;
    return {
      label: a.label,
      acres,
      region: region?.name ?? null,
      coefficient,
      value: coefficient === null ? null : acres * coefficient,
    };
  });

  if (!practice) {
    return {
      ok: false,
      missing: 'Needs a practice',
      fix: `This method covers ${methodPractices(method).join(' and ')}. Add one to the project’s classifications.`,
      practice: null,
      lines,
    };
  }
  if (sized.length === 0) {
    return {
      ok: false,
      missing: 'Needs a mapped area',
      fix: 'Draw an area on the map. Reaches and points have no acres.',
      practice,
      lines,
    };
  }
  const counted = lines.filter((l) => l.value !== null);
  if (counted.length === 0) {
    const places = [...new Set(lines.map((l) => l.region ?? 'outside every region'))].join(', ');
    return {
      ok: false,
      missing: 'No coefficient here',
      fix: `The method has no figure for ${practice} in ${places}.`,
      practice,
      lines,
    };
  }
  return {
    ok: true,
    value: Math.round(counted.reduce((t, l) => t + (l.value ?? 0), 0)),
    practice,
    lines,
  };
};
