// Work-area shapes — one per work area, drawn to its own size and kind.
//
// Until 2026-11-12 every project's footprint was one of three area templates
// and three reach templates, stamped at a fixed size: a 9-acre diversion site
// and a 2,400-acre fuels unit were the same outline, and the map read as
// copy-paste. Each shape is now GENERATED from the work area itself:
//
//   - its SIZE is its recorded extent — a ring encloses its acres, a line runs
//     its miles — so the map and the record agree;
//   - its CHARACTER comes from what the label says it is, because the real
//     thing has a recognisable outline:
//       stand   forest treatment, fuels, road decommissioning: an angular
//               polygon whose long straight edges follow roads and ridgelines
//       parcel  sites, parcels, basin clusters: a blocky near-rectangle with a
//               jog or two, as ownership boundaries are
//       organic meadows, marshes, floodplains, riparian units: a smooth lobed
//               outline stretched along its valley
//       stream  reaches, channels, tributaries: a meandering line
//       built   levees, fuel breaks, crossings, greenways: a nearly straight
//               line with a few deliberate bends
//   - its RANDOMNESS is seeded from the project and the label (FNV-1a into
//     mulberry32), so a shape is identical on every load and every build, and
//     no two work areas share one.
//
// Invented, never traced: like every shape in this spoke, these sit at an
// authored center and stand for nothing on the ground.

import { pathMiles, ringAcres } from '../lib/geo';
import type { LatLng } from '../lib/geo';

type Character = 'stand' | 'parcel' | 'organic' | 'stream' | 'built';

/** What a work area's label says its outline looks like. */
const characterOf = (label: string, kind: 'area' | 'reach'): Character => {
  if (kind === 'reach') return /levee|fuel break|alignment|crossing|greenway/i.test(label) ? 'built' : 'stream';
  if (/treatment unit|fuel|decommission|ridge|slope|rim/i.test(label)) return 'stand';
  if (/site|parcel|cluster|basin cluster/i.test(label)) return 'parcel';
  return 'organic';
};

/** FNV-1a: a stable 32-bit seed from a string. */
const hash = (text: string): number => {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
};

/** mulberry32: a small, fast, deterministic PRNG in [0, 1). */
const prng = (seed: number) => {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const KM_PER_DEG_LAT = 111.32;

/** Local kilometre offsets [east, north] onto a center, as [lat, lng]. */
const toLatLng = (center: LatLng, pts: [number, number][]): LatLng[] => {
  const kmPerDegLng = KM_PER_DEG_LAT * Math.cos((center[0] * Math.PI) / 180);
  return pts.map(([x, y]) => [
    Number((center[0] + y / KM_PER_DEG_LAT).toFixed(5)),
    Number((center[1] + x / kmPerDegLng).toFixed(5)),
  ]);
};

const rotate = ([x, y]: [number, number], a: number): [number, number] => [
  x * Math.cos(a) - y * Math.sin(a),
  x * Math.sin(a) + y * Math.cos(a),
];

/** A closed outline in local km, around the origin, before sizing. */
const ringOf = (character: Character, rand: () => number): [number, number][] => {
  const bearing = rand() * Math.PI;
  if (character === 'parcel') {
    // A rectangle with one or two jogs cut into its corners.
    const w = 1;
    const h = 0.45 + rand() * 0.7;
    const jx = 0.25 + rand() * 0.35;
    const jy = 0.2 + rand() * 0.4;
    const pts: [number, number][] = [
      [-w, -h], [w, -h], [w, h * (1 - jy)], [w - jx, h * (1 - jy)], [w - jx, h], [-w, h],
    ];
    if (rand() > 0.45) pts.splice(1, 0, [-w + jx * 1.2, -h], [-w + jx * 1.2, -h + jy * h * 0.8], [w * 0.2, -h + jy * h * 0.8], [w * 0.2, -h]);
    // Hand-digitised: no corner is exactly square.
    return pts.map(([x, y]) => rotate([x + (rand() - 0.5) * 0.04, y + (rand() - 0.5) * 0.04], bearing));
  }
  const stand = character === 'stand';
  const n = stand ? 9 + Math.floor(rand() * 5) : 30 + Math.floor(rand() * 10);
  const stretch = stand ? 1.1 + rand() * 0.8 : 1.5 + rand() * 1.6;
  // Low harmonics give lobes; a stand gets sharper ones and per-vertex jitter,
  // an organic outline gets smooth ones only.
  const harmonics = [2, 3, 4, 5, 7].map((k) => ({
    k,
    amp: (stand ? 0.22 : 0.16) * (0.4 + rand()) / Math.sqrt(k),
    phase: rand() * Math.PI * 2,
  }));
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i += 1) {
    // Uneven angular steps: real outlines do not space their vertices evenly.
    const theta = ((i + (stand ? (rand() - 0.5) * 0.7 : 0)) / n) * Math.PI * 2;
    let r = 1;
    harmonics.forEach(({ k, amp, phase }) => (r += amp * Math.sin(k * theta + phase)));
    if (stand) r *= 0.88 + rand() * 0.24;
    r = Math.max(r, 0.35);
    pts.push(rotate([Math.cos(theta) * r * stretch, Math.sin(theta) * r], bearing));
  }
  return pts;
};

/**
 * An open line in local km, before sizing. It runs UPSTREAM along `bearing`
 * (radians, east = 0) from a point a little below the origin, so a reach
 * starts just downstream of its authored center and climbs away from where
 * the basin drains: no tributary crosses the lake it feeds.
 */
const lineOf = (character: Character, rand: () => number, miles: number, bearing: number): [number, number][] => {
  const built = character === 'built';
  // A creek bends more the longer it runs: about one bend per mile, never
  // fewer than three. A built line turns a handful of times, sharply.
  const bends = Math.max(3, miles * (0.9 + rand() * 0.5));
  const steps = built ? 6 + Math.floor(rand() * 4) : Math.max(48, Math.round(bends * 12));
  const valley = { amp: 0.35 + rand() * 0.35, freq: 0.8 + rand() * 0.8, phase: rand() * 6.28 };
  const swing = { amp: 0.55 + rand() * 0.35, phase: rand() * 6.28 };
  const ripple = { amp: 0.08 + rand() * 0.08, freq: bends * (1.6 + rand() * 0.5), phase: rand() * 6.28 };
  let wander = 0;
  let p: [number, number] = [0, 0];
  const pts: [number, number][] = [p];
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    let heading: number;
    if (built) heading = bearing + (rand() - 0.5) * 0.6;
    else {
      // The valley's own long curve, meanders on it whose size drifts so no
      // two bends match, a faint ripple, and a slow random wander.
      wander += (rand() - 0.5) * 0.2;
      const drift = 0.6 + 0.8 * Math.abs(Math.sin(2.3 * Math.PI * t + swing.phase * 0.7));
      heading =
        bearing +
        wander +
        valley.amp * Math.sin(valley.freq * Math.PI * t + valley.phase) +
        swing.amp * drift * Math.sin(bends * Math.PI * t + swing.phase) +
        ripple.amp * Math.sin(ripple.freq * Math.PI * t + ripple.phase);
    }
    const step = 1 / steps;
    p = [p[0] + Math.cos(heading) * step, p[1] + Math.sin(heading) * step];
    pts.push(p);
  }
  // The downstream end sits 15% of the way back past the center.
  const back = pts[Math.round(pts.length * 0.15)];
  return pts.map(([x, y]) => [x - back[0], y - back[1]]);
};

/**
 * The shape of one work area: `extent` acres for an area, `extent` miles for a
 * reach, at `center`, its outline chosen by its label and seeded by `seed`
 * (the project's name and the label, so it never changes and never repeats).
 */
export const workAreaShape = (
  kind: 'area' | 'reach',
  label: string,
  extent: number,
  center: LatLng,
  seed: string,
  /** Where the basin drains to. A reach climbs away from it, within 40°. */
  drainsTo?: LatLng,
): LatLng[] => {
  const rand = prng(hash(`${seed}|${label}`));
  const character = characterOf(label, kind);
  const away = drainsTo
    ? Math.atan2(center[0] - drainsTo[0], (center[1] - drainsTo[1]) * Math.cos((center[0] * Math.PI) / 180))
    : rand() * Math.PI * 2;
  const bearing = away + (rand() - 0.5) * ((80 * Math.PI) / 180);
  const unit = kind === 'area' ? ringOf(character, rand) : lineOf(character, rand, extent, bearing);
  // Size it: measure the unit shape where it will sit, then scale it to the
  // record — by the square root for an area, linearly for a line.
  const measured = kind === 'area' ? ringAcres(toLatLng(center, unit)) : pathMiles(toLatLng(center, unit));
  const k = measured > 0 ? (kind === 'area' ? Math.sqrt(extent / measured) : extent / measured) : 1;
  return toLatLng(
    center,
    unit.map(([x, y]) => [x * k, y * k]),
  );
};
