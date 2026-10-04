// A classification KPI's progress — the ring's fill, the figure, the note, and
// the project × year table — in one place, so the rows the build renders
// (firma2-kpi-progress on the board, firma2-classification-measures on a
// classification's page) and the rows a page repaints from browser edits
// (src/lib/goal-kpis.ts) cannot disagree.
//
// THE RING AND THE FIGURE MEASURE AGAINST THE GOAL, the classification's own
// target. With no goal set they fall back to what the projects committed,
// which is the comparison a project's measure row makes, and the note says the
// goal is missing. With neither, the figure stands alone and the ring stays
// empty, as a project measure with no target does.

export interface KpiRowInput {
  unit: string;
  decimals: number;
  reported: number | null;
  committed: number | null;
  goal?: number;
  goalYear?: number;
  /** Whether projects' figures add (a total) or average (a reading). Default true. */
  additive?: boolean;
  from: {
    name: string;
    /** For the side-panel button beside the project's link. */
    slug?: string;
    href: string;
    reported: number;
    committed: number;
    /** Closed periods, oldest first; null where nothing was filed. */
    series?: { year: number; value: number | null }[];
  }[];
  /**
   * The year columns to draw — the page's shared axis, so every measure's
   * years line up under one another. Defaults to the years these projects
   * reported in. Drawn newest first either way.
   */
  years?: number[];
}

/** Every year any of these projects' series covers, newest first — a page's shared axis. */
export const yearAxis = (froms: { series?: { year: number }[] }[][]): number[] =>
  [...new Set(froms.flat().flatMap((p) => (p.series ?? []).map((y) => y.year)))].sort((a, b) => b - a);

export interface KpiRowView {
  /** What the ring and the figure measure against; 0 when nothing to. */
  expected: number;
  /** 0–100, never rounded up to a full ring (firma2-project-measure-row's rule). */
  percent: number;
  /**
   * 0–100: what the projects planned, against the goal — the ring's lighter
   * arc. 0 with no goal (the ring already measures against the plan then)
   * or no plan.
   */
  plannedPercent: number;
  totalText: string;
  /** How much of the goal is not yet planned, or "No goal set". Empty when fully planned. */
  lead: string;
  /**
   * The highlight tile (a classification page's Simple view), under the
   * measure's name: the big figure — the share of what the ring measures
   * against, or the bare reading when there is nothing to measure it against
   * — then what that share is of, then what is not yet planned.
   */
  highlight: { value: string; label: string; sub: string };
  /** The projects the figure is made of, each with its share. */
  from: { name: string; href: string; share: string }[];
  /**
   * The same projects as a project × year table, newest year first (user,
   * 2026-10-03). A cell is "—" when the year is in the project's window and
   * nothing was filed, and empty when the year is outside it — or when the
   * year is on the page's axis only because another measure reported in it.
   */
  table: {
    years: number[];
    /** The measure's own figure per year — the sum across its projects (the
     *  average, for a measure that does not add). Aligned with `years`. */
    totals: string[];
    rows: { name: string; slug?: string; href: string; share: string; cells: string[] }[];
    /** The goal no project has planned for yet, with its unit — "14.8 miles".
     *  Empty with no goal, or when the plans meet it. */
    gap: string;
  };
}

export const kpiRowView = (k: KpiRowInput): KpiRowView => {
  const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: k.decimals });
  const num = (n: number) => nf.format(n);
  // "each" is a counting unit with no noun to print — "7 each" reads as a typo.
  const withUnit = (n: number) =>
    k.unit === 'percent' ? `${num(n)}%` : k.unit === 'each' || !k.unit ? num(n) : `${num(n)} ${k.unit}`;
  const expected = k.goal ?? k.committed ?? 0;

  // THE FIGURE NAMES ITS DENOMINATOR (user, 2026-10-03): "14.5 of 30 miles"
  // read as either the goal or the plan, and it silently switched between
  // the two when a goal was missing. So it ends in the word for what it is
  // measured against — "goal" or "planned".
  const against = k.goal != null ? 'goal' : 'planned';
  const done = k.reported == null ? '—' : k.unit === 'percent' ? withUnit(k.reported) : num(k.reported);
  let totalText: string;
  if (expected > 0) totalText = `${done} of ${withUnit(expected)} ${against}`;
  else totalText = k.reported == null ? 'Not reported' : withUnit(k.reported);

  const percent = (() => {
    if (k.reported == null || expected <= 0) return 0;
    const raw = (k.reported / expected) * 100;
    if (raw >= 100) return 100;
    const rounded = Math.round(raw);
    return rounded === 100 ? 99 : rounded;
  })();

  const plannedPercent =
    k.goal != null && k.goal > 0 && k.committed != null ? Math.min(100, Math.round((k.committed / k.goal) * 100)) : 0;

  const gap = k.goal != null && k.committed != null ? Number((k.goal - k.committed).toFixed(4)) : null;

  // ONLY WHAT IS NOT YET PLEDGED (user, 2026-10-03): the ring's grey, in
  // words — the light-green-on-grey step is too faint to be the only place
  // that figure lives. Fully or over-planned, the closed ring says so and the
  // line goes. "No goal set" stays: without it the ring silently measures
  // against the plan instead.
  const lead =
    k.goal == null ? 'No goal set' : gap != null && gap > 0 ? `${num(gap)} not yet planned` : '';

  const from = k.from.map((p) => ({
    name: p.name,
    href: p.href,
    share: p.committed > 0 ? `${num(p.reported)} of ${num(p.committed)} planned` : num(p.reported),
  }));
  const years = [...(k.years ?? yearAxis([k.from]))].sort((a, b) => b - a);
  const table = {
    years,
    rows: k.from.map((p, i) => ({
      ...from[i],
      slug: p.slug,
      cells: years.map((year) => {
        const period = p.series?.find((y) => y.year === year);
        if (!period) return '';
        return period.value === null ? '—' : num(period.value);
      }),
    })),
    totals: years.map((year) => {
      const periods = k.from.map((p) => p.series?.find((y) => y.year === year)).filter((y) => y != null);
      if (!periods.length) return '';
      const values = periods.map((y) => y!.value).filter((v): v is number => v !== null);
      if (!values.length) return '—';
      const sum = values.reduce((a, b) => a + b, 0);
      return num(k.additive === false ? sum / values.length : sum);
    }),
    gap: gap != null && gap > 0 ? withUnit(gap) : '',
  };

  const highlight = {
    value: k.reported == null ? '—' : expected > 0 ? `${percent}%` : withUnit(k.reported),
    label: expected > 0 ? totalText : '',
    sub: lead,
  };

  return { expected, percent, plannedPercent, totalText, lead, highlight, from, table };
};
