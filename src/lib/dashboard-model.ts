// The arithmetic behind one Progress Dashboard tile.
//
// THE INVENTORY IS THE MODEL (user, 2026-11-12: "that's why I asked you to
// make an inventory of all possible data fields"). A tile is built from two
// lists the dataset carries (src/data/firma2-dashboard.ts), and nothing else:
//   - FIGURES (Dataset.measures): every number the workspace holds — the
//     performance measures, and also project counts, money, mapped work
//     areas, reporting, and the number custom fields.
//   - DIMENSIONS (Dataset.dimensions): every way to split or filter them —
//     the project's own attributes, its classifications by group, tags,
//     funders, years, and the choice custom fields.
// A tile is one figure, shown as one number, as bars by a dimension, or over
// time. compute() decides what is LEGAL to draw:
//   - a figure that does not sum is averaged, never totalled or accumulated
//     ([[measure-counting-rule-framing]]);
//   - a split whose values overlap (a project in two plan goals) is never
//     stacked and never totalled — unless the figure is money and the split
//     is who paid, where each funder's share adds up exactly;
//   - a figure with no year to it (a cost, an acreage) is never charted over
//     time;
//   - every closed year carries how many projects filed of those that owed.

export interface DsDimension {
  /** No colon in it: a scope is '<key>:<value>'. */
  key: string;
  label: string;
  /** For "Search …". */
  plural: string;
  /** A project can hold several values. */
  overlapping?: boolean;
  /** Its values are who paid, each with a share of the project's cost. */
  shares?: boolean;
}

export interface DsProject {
  name: string;
  /** Its values for each dimension, by Dataset.dimensions key. */
  dims: Record<string, string[]>;
  /** For the dimensions that are who paid: each value's share of the cost, 0–1. */
  shares: Record<string, Record<string, number>>;
}

export interface DsRow {
  /** Index into Dataset.projects. */
  p: number;
  /** The whole-project figure: what was committed, budgeted, or — for a figure with no year — its value. */
  committed: number;
  /** [year, value]; null = owed and not filed. Closed years only. */
  series: [number, number | null][];
  /** [year, planned]. */
  plan: [number, number][];
}

export type FigureGroup = 'Performance measures' | 'Projects' | 'Money' | 'Work areas' | 'Reporting' | 'Custom fields';

export interface DsMeasure {
  slug: string;
  name: string;
  unit: string;
  decimals: number;
  additive: boolean;
  breakdowns: { question: string; options: string[] }[];
  rows: DsRow[];
  /** Where it sits in the inventory. */
  group: FigureGroup;
  /** No year to it: one figure, never a chart over time. Its value is each row's `committed`. */
  timeless?: boolean;
  /** Its plan is one whole-project total (`committed`), not a figure per year. */
  budgeted?: boolean;
  /** A funder's share cannot apply (a project is not 40% of a project). */
  whole?: boolean;
  /** Money: split by who paid, each funder's share adds up to the total. */
  shared?: boolean;
  /** The word for what was filed: "Reported" unless said otherwise. */
  filed?: string;
  /** The word for what it is read against: "Planned" unless said otherwise. */
  planned?: string;
}

export interface Dataset {
  projects: DsProject[];
  measures: DsMeasure[];
  dimensions: DsDimension[];
}

export type Attribution = 'full' | 'share';
export type View = 'year' | 'cumulative';
/** A tile is one figure, that figure by group, or that figure over time. */
export type Kind = 'chart' | 'number' | 'groups';

export interface TileState {
  measure: string;
  /** 'none' | 'bd:<n>' (the figure's own breakdown) | a Dataset.dimensions key */
  split: string;
  /**
   * 'all', or '<dimension>:<value>' filters joined by '|'. Values of ONE
   * dimension are alternatives (either funder); different dimensions must all
   * hold (that funder AND that goal).
   */
  scope: string;
  /** First year shown; 0 = every year. */
  from: number;
  attribution: Attribution;
  view: View;
  kind: Kind;
  /** A chart's width, in columns of the dashboard's twelve. */
  span: number;
  /** A chart's plot height, in pixels. */
  height: number;
}

export interface Choice {
  value: string;
  label: string;
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export const measureOf = (ds: Dataset, slug: string): DsMeasure => ds.measures.find((m) => m.slug === slug) ?? ds.measures[0];
export const dimensionOf = (ds: Dataset, key: string): DsDimension | undefined => ds.dimensions.find((d) => d.key === key);

/** The inventory's sections, in the order the dataset lists them. */
export const figureGroups = (ds: Dataset): FigureGroup[] => [...new Set(ds.measures.map((m) => m.group))];

/** A dimension's values across the workspace: years in order, the rest most used first. */
export const valuesOf = (ds: Dataset, key: string): string[] => {
  const n = new Map<string, number>();
  ds.projects.forEach((p) => (p.dims[key] ?? []).forEach((v) => n.set(v, (n.get(v) ?? 0) + 1)));
  const values = [...n];
  return (key === 'start' || key === 'end' ? values.sort((a, b) => a[0].localeCompare(b[0])) : values.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))).map(([v]) => v);
};

/** Every way to split a figure: its own breakdowns first, then every dimension. */
export const splitChoices = (ds: Dataset, m: DsMeasure): Choice[] => [
  { value: 'none', label: 'No split' },
  ...m.breakdowns.map((b, i) => ({ value: `bd:${i}`, label: b.question })),
  ...ds.dimensions.map((d) => ({ value: d.key, label: d.label })),
];

export const attributionChoices: Choice[] = [
  { value: 'full', label: 'Each project’s full result' },
  { value: 'share', label: 'Only the share this funder paid for' },
];

/** "Show as" — the tile's form. Over time needs a year; a running total needs values that add up. */
export const showChoices = (m: DsMeasure): Choice[] => [
  { value: 'number', label: 'One number' },
  { value: 'groups', label: 'Bars by group' },
  ...(m.timeless ? [] : [{ value: 'year', label: 'Chart by year' }]),
  ...(m.additive && !m.timeless ? [{ value: 'cumulative', label: 'Chart of the running total' }] : []),
];
export const showOf = (s: TileState): string => (s.kind === 'chart' ? s.view : s.kind);
export const showPatch = (value: string): Partial<TileState> =>
  value === 'number' || value === 'groups' ? { kind: value } : { kind: 'chart', view: value === 'cumulative' ? 'cumulative' : 'year' };

/** A scope's filters, grouped by dimension. */
export const facetsOf = (scope: string): Map<string, string[]> => {
  const out = new Map<string, string[]>();
  for (const part of scope.split('|')) {
    const at = part.indexOf(':');
    if (at < 0) continue;
    const key = part.slice(0, at);
    out.set(key, [...(out.get(key) ?? []), part.slice(at + 1)]);
  }
  return out;
};
export const scopeOf = (picked: Map<string, string[]>): string =>
  [...picked].flatMap(([key, values]) => values.map((v) => `${key}:${v}`)).join('|') || 'all';

/** The one funder a scope is about — none when it names no funder, or several. */
export const funderOf = (scope: string): string => {
  const funders = facetsOf(scope).get('funder') ?? [];
  return funders.length === 1 ? funders[0] : '';
};
/** A funder's view of a figure that sums is the one place attribution is a choice. */
export const attributionApplies = (ds: Dataset, s: TileState): boolean => {
  const m = measureOf(ds, s.measure);
  return funderOf(s.scope) !== '' && m.additive && !m.whole;
};

export const inScope = (p: DsProject, scope: string): boolean =>
  [...facetsOf(scope)].every(([key, wanted]) => (p.dims[key] ?? []).some((v) => wanted.includes(v)));

/** How many projects a scope holds. */
export const projectsIn = (ds: Dataset, scope: string): number => ds.projects.filter((p) => inScope(p, scope)).length;

// A CHART'S SIZE. Dragged, it snaps to whole columns and 40px of height; the
// sheet names the common sizes and shows any other as what it is.
export const SPAN = { min: 3, max: 12, default: 4 };
export const HEIGHT = { min: 160, max: 560, step: 40, default: 240 };
export const clampSpan = (n: number) => Math.min(SPAN.max, Math.max(SPAN.min, Math.round(n)));
export const clampHeight = (n: number) => Math.min(HEIGHT.max, Math.max(HEIGHT.min, Math.round(n / HEIGHT.step) * HEIGHT.step));
const withCurrent = (presets: Choice[], current: number, other: (n: number) => string): Choice[] =>
  presets.some((c) => c.value === String(current)) ? presets : [...presets, { value: String(current), label: other(current) }];
export const widthChoices = (span: number): Choice[] =>
  withCurrent(
    [
      { value: '3', label: 'Quarter' },
      { value: '4', label: 'Third' },
      { value: '6', label: 'Half' },
      { value: '8', label: 'Two thirds' },
      { value: '12', label: 'Full width' },
    ],
    span,
    (n) => `${n} of 12 columns`,
  );
export const heightChoices = (height: number): Choice[] =>
  withCurrent(
    [
      { value: '160', label: 'Short' },
      { value: '240', label: 'Medium' },
      { value: '400', label: 'Tall' },
    ],
    height,
    (n) => `${n} pixels`,
  );

/** "All years" is the Years filter left empty. */
export const yearChoices: Choice[] = [
  { value: '2015', label: 'Since 2015' },
  { value: '2020', label: 'Since 2020' },
  { value: '2023', label: 'Since 2023' },
];

/** Repairs a state after one choice changed: drops what the new figure cannot draw. */
export const normalize = (ds: Dataset, s: TileState): TileState => {
  const m = measureOf(ds, s.measure);
  const next = { ...s, measure: m.slug };
  if (!splitChoices(ds, m).some((c) => c.value === next.split)) next.split = 'none';
  if (!m.additive) next.view = 'year';
  if (m.timeless && next.kind === 'chart') next.kind = 'number';
  // Bars need something to be bars OF.
  if (next.kind === 'groups' && next.split === 'none') next.split = m.breakdowns.length ? 'bd:0' : 'type';
  if (!attributionApplies(ds, next)) next.attribution = 'full';
  next.span = clampSpan(Number(next.span) || SPAN.default);
  next.height = clampHeight(Number(next.height) || HEIGHT.default);
  return next;
};

// ---------------------------------------------------------------------------

export interface YearFigure {
  year: number;
  value: number | null;
  planned: number | null;
  closed: boolean;
  owed: number;
  filed: number;
  reportedToDate: number | null;
  plannedToDate: number | null;
}

export interface Group {
  key: string;
  /** One per year in Figure.years; null where nothing was filed. */
  values: (number | null)[];
  toDate: (number | null)[];
  total: number;
  projects: number;
}

export interface Figure {
  measure: DsMeasure;
  additive: boolean;
  years: YearFigure[];
  /** Every group of the split, largest first; empty with no split. */
  groups: Group[];
  /** The groups a chart over time draws: six colours' worth. */
  drawn: Group[];
  /** The groups a bar chart draws: ten bars' worth. */
  bars: Group[];
  /** The groups add up to the figure, so they may stack. */
  stackable: boolean;
  /** One project can sit in several groups, counted whole in each. */
  overlapping: boolean;
  /** What the split is called, mid-sentence. */
  splitNoun: string;
  projects: number;
  lastClosed?: YearFigure;
  /** A timeless figure's value: its rows added up. */
  total: number | null;
  /** The whole-project plan a budgeted figure is read against. */
  budget: number | null;
  empty: boolean;
}

const round = (n: number) => Number(n.toFixed(4));

// Deterministic 0–1 from a string: the breakdown shares below are invented
// (seed data holds no per-option entries) and must not change between two
// paints of the same question.
const unit = (text: string): number => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return ((h >>> 0) % 10000) / 10000;
};

/** The groups one project's value lands in, and how much of it. */
const groupsFor = (ds: Dataset, m: DsMeasure, p: DsProject, split: string): [string, number][] => {
  if (split.startsWith('bd:')) {
    const options = m.breakdowns[Number(split.slice(3))]?.options ?? [];
    // Each project works in two or three of the options, in fixed proportions.
    const weights = options.map((o) => {
      const w = unit(`${p.name}|${o}`);
      return w > 0.55 ? w : 0;
    });
    const sum = weights.reduce((a, b) => a + b, 0);
    if (sum === 0) return [[options[options.length - 1] ?? 'Unspecified', 1]];
    return options.flatMap((o, i) => (weights[i] ? [[o, m.additive ? weights[i] / sum : 1] as [string, number]] : []));
  }
  const dim = dimensionOf(ds, split);
  if (!dim) return [];
  // Money by who paid: each funder gets its share, and the shares add up.
  const byShare = dim.shares && m.shared;
  return (p.dims[split] ?? []).map((v) => [v, byShare ? p.shares[split]?.[v] ?? 0 : 1]);
};

export const compute = (ds: Dataset, s: TileState): Figure => {
  const m = measureOf(ds, s.measure);
  const funder = funderOf(s.scope);
  const rows = m.rows
    .filter((r) => inScope(ds.projects[r.p], s.scope))
    .map((r) => {
      const p = ds.projects[r.p];
      const w = funder && s.attribution === 'share' && m.additive && !m.whole ? p.shares.funder?.[funder] ?? 1 : 1;
      return { r, p, w };
    });

  const yearList = [...new Set(rows.flatMap(({ r }) => [...r.series.map((y) => y[0]), ...r.plan.map((y) => y[0])]))].filter((year) => year >= s.from).sort((a, b) => a - b);
  const cell = (r: DsRow, year: number) => r.series.find((y) => y[0] === year);
  const plan = (r: DsRow, year: number) => r.plan.find((y) => y[0] === year)?.[1];

  let lastClosedYear = -Infinity;
  const base = yearList.map((year) => {
    const cells = rows.flatMap(({ r, w }) => {
      const c = cell(r, year);
      return c ? [{ v: c[1], w }] : [];
    });
    const filed = cells.filter((c) => c.v != null) as { v: number; w: number }[];
    const sum = filed.reduce((a, c) => a + c.v * c.w, 0);
    const value = filed.length ? round(m.additive ? sum : sum / filed.length) : null;
    const planning = rows.filter(({ r }) => plan(r, year) != null && r.committed > 0);
    const planned = !planning.length
      ? null
      : m.additive
        ? round(planning.reduce((a, { r, w }) => a + (plan(r, year) ?? 0) * w, 0))
        : round(planning.reduce((a, { r }) => a + r.committed, 0) / planning.length);
    if (cells.length) lastClosedYear = Math.max(lastClosedYear, year);
    return { year, value, planned, closed: cells.length > 0, owed: cells.length, filed: filed.length };
  });
  let rt = 0;
  let pt = 0;
  const years: YearFigure[] = base.map((y) => {
    rt += y.value ?? 0;
    pt += y.planned ?? 0;
    return { ...y, reportedToDate: y.year <= lastClosedYear ? round(rt) : null, plannedToDate: round(pt) };
  });

  // THE SPLIT.
  const dim = dimensionOf(ds, s.split);
  const overlapping = Boolean(dim?.overlapping) && !(dim?.shares && m.shared);
  const stackable = m.additive && !overlapping;
  const bucket = new Map<string, { sums: number[]; counts: number[]; projects: Set<number>; flat: number }>();
  if (s.split !== 'none') {
    for (const { r, p, w } of rows) {
      for (const [key, factor] of groupsFor(ds, m, p, s.split)) {
        const g = bucket.get(key) ?? { sums: yearList.map(() => 0), counts: yearList.map(() => 0), projects: new Set<number>(), flat: 0 };
        g.projects.add(r.p);
        g.flat += r.committed * factor * w;
        yearList.forEach((year, i) => {
          const v = cell(r, year)?.[1];
          if (v == null) return;
          // A reading that does not sum varies a little by option, so the lines are not one line.
          const reading = m.additive ? v * factor * w : v * (0.92 + unit(`${key}|${p.name}`) * 0.16);
          g.sums[i] += reading;
          g.counts[i] += 1;
        });
        bucket.set(key, g);
      }
    }
  }
  const toGroup = (key: string, sums: number[], counts: number[], projects: number, flat: number): Group => {
    const values = sums.map((sum, i) => (counts[i] ? round(m.additive ? sum : sum / counts[i]) : null));
    let run = 0;
    const toDate = values.map((v, i) => {
      run += v ?? 0;
      return yearList[i] <= lastClosedYear ? round(run) : null;
    });
    const filled = values.filter((v): v is number => v != null);
    const total = m.timeless ? round(flat) : m.additive ? round(filled.reduce((a, b) => a + b, 0)) : filled.length ? round(filled.reduce((a, b) => a + b, 0) / filled.length) : 0;
    return { key, values, toDate, total, projects };
  };
  const groups = [...bucket]
    .map(([key, g]) => toGroup(key, g.sums, g.counts, g.projects.size, g.flat))
    .filter((g) => (m.timeless ? g.total > 0 : g.values.some((v) => v != null)))
    .sort((a, b) => b.total - a.total || a.key.localeCompare(b.key));

  // A CEILING ON MARKS: six colours over time, ten bars by group. Past it,
  // groups that add up fold into Other; groups that do not are left to the
  // table, because "Other" of an average or of overlapping sets is not a
  // number anyone reported.
  const capped = (max: number): Group[] => {
    if (groups.length <= max) return groups;
    if (!stackable) return groups.slice(0, max);
    const rest = groups.slice(max - 1);
    const sums = yearList.map((_, i) => rest.reduce((a, g) => a + (g.values[i] ?? 0), 0));
    const counts = yearList.map((_, i) => (rest.some((g) => g.values[i] != null) ? 1 : 0));
    const total = round(rest.reduce((a, g) => a + g.total, 0));
    return [...groups.slice(0, max - 1), { ...toGroup(`Other (${rest.length})`, sums, counts, 0, total), total }];
  };

  const committed = round(rows.reduce((a, { r, w }) => a + r.committed * w, 0));
  return {
    measure: m,
    additive: m.additive,
    years,
    groups,
    drawn: capped(6),
    bars: capped(10),
    stackable,
    overlapping,
    splitNoun: lower(splitChoices(ds, m).find((c) => c.value === s.split)?.label ?? ''),
    projects: rows.length,
    lastClosed: years.filter((y) => y.closed).at(-1),
    total: m.timeless ? committed : null,
    budget: m.budgeted ? committed : null,
    empty: rows.length === 0 || (s.kind === 'groups' ? groups.length === 0 : !m.timeless && years.every((y) => y.value == null && y.planned == null)),
  };
};

// ---------------------------------------------------------------------------
// The strings a tile states about itself — data, not commentary.

export const formatter = (m: DsMeasure) => {
  const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: m.decimals });
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 });
  const counted = (n: number, one: string) => `${nf.format(n)} ${n === 1 ? one : `${one}s`}`;
  const withUnit = (n: number): string =>
    m.unit === 'dollars'
      ? money.format(n)
      : m.unit === 'projects' || m.unit === 'milestones' || m.unit === 'reports'
        ? counted(n, m.unit.slice(0, -1))
        : m.unit === 'percent'
          ? `${nf.format(n)}%`
          : m.unit === 'each' || !m.unit
            ? nf.format(n)
            : `${nf.format(n)} ${m.unit}`;
  return { nf: m.unit === 'dollars' ? money : nf, withUnit };
};

/** How the figure is cut — the line under a tile's title. */
export const queryLine = (ds: Dataset, s: TileState): string => {
  const m = measureOf(ds, s.measure);
  const split = s.kind !== 'number' && s.split !== 'none' ? `By ${lower(splitChoices(ds, m).find((c) => c.value === s.split)?.label ?? '')}` : '';
  const running = s.kind === 'chart' && s.view === 'cumulative' ? 'Running total' : '';
  return [running, split].filter(Boolean).join(' · ');
};
