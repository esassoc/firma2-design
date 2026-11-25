// REFERENCE ONLY — the mark functions from the discarded project detail lab
// (2026-11-24). Not imported by anything. Each returns an HTML string styled by
// marks.css; `--s` on a parent sets the series hue.

export interface Point {
  value: number | null; // null = no report filed (a gap, never a zero)
  planned: number;
  status: 'complete' | 'current' | 'upcoming';
}
export interface Axis {
  years: number[];
  now: number; // index of the current year, or -1
}
type Points = Map<number, Point>;
export type Hue = 'series' | 'brand' | 'ink' | 'poster';

// ── Hue ────────────────────────────────────────────────────────────────────
const POSTER = ['orange-9', 'blue-9', 'amber-9', 'pink-9', 'teal-11', 'tomato-10'];
export const accent = (hue: Hue) =>
  hue === 'ink' ? 'var(--color-content-default)' : hue === 'poster' ? 'var(--color-orange-9)' : 'var(--color-background-brand)';
export const seriesHue = (hue: Hue, i: number) =>
  hue === 'poster'
    ? `var(--color-${POSTER[i % POSTER.length]})`
    : hue === 'series'
      ? `var(--color-background-dataviz-categorical-${(i % 8) + 1})`
      : accent(hue);
/** Parts of a whole: the sequential ramp spread end to end, so two parts sit far apart. */
export const partHue = (hue: Hue, i: number, n: number) =>
  hue === 'poster'
    ? `var(--color-${POSTER[(i + 1) % POSTER.length]})`
    : hue === 'ink'
      ? `color-mix(in oklab, var(--color-content-default) ${Math.round(100 - (i / Math.max(1, n)) * 70)}%, transparent)`
      : `var(--color-background-dataviz-sequential-${Math.max(1, 7 - Math.round((i * 6) / Math.max(1, n - 1)))})`;

const peak = (points: Points) => Math.max(1e-9, ...[...points.values()].flatMap((p) => [p.value ?? 0, p.planned]));

// ── Year marks (share one axis) ────────────────────────────────────────────
export const axisLabels = (axis: Axis, every: boolean) => {
  const n = axis.years.length;
  const stride = every ? Math.ceil(n / 12) : 0;
  return `<div class="pd-axis"${every ? ' data-every' : ''} style="--n:${n}" aria-hidden="true">${axis.years
    .map((y, i) => {
      const show = every ? (i % stride === 0 && (axis.now < 0 || Math.abs(i - axis.now) > 1)) || i === axis.now : i === 0 || i === n - 1 || i === axis.now;
      return `<span${i === axis.now ? ' data-now' : ''}>${show ? (every || i === 0 || i === n - 1 ? y : 'Now') : ''}</span>`;
    })
    .join('')}</div>`;
};

export const yearBars = (axis: Axis, points: Points) => {
  const max = peak(points);
  return `<div class="pd-years" style="--n:${axis.years.length}">${axis.years
    .map((y, i) => {
      const p = points.get(y);
      const now = i === axis.now ? ' data-now' : '';
      if (!p) return `<div class="pd-year"${now}></div>`;
      const plan = p.planned > 0 ? `<i class="pd-plan" style="--h:${(p.planned / max).toFixed(3)}"></i>` : '';
      const done = p.value !== null && p.value > 0 ? `<i class="pd-done" style="--h:${(p.value / max).toFixed(3)}"></i>` : '';
      return `<div class="pd-year"${now}>${plan}${done}</div>`;
    })
    .join('')}</div>`;
};

export const yearCells = (axis: Axis, points: Points) => {
  const max = peak(points);
  return `<div class="pd-cells" style="--n:${axis.years.length}">${axis.years
    .map((y, i) => {
      const p = points.get(y);
      const now = i === axis.now ? ' data-now' : '';
      if (!p) return `<i${now}></i>`;
      if (p.value === null) return `<i data-state="${p.status === 'complete' ? 'gap' : 'open'}"${now}></i>`;
      return `<i data-state="done" style="--a:${Math.round(18 + (p.value / max) * 82)}%"${now}></i>`;
    })
    .join('')}</div>`;
};

/** A block of dots a year, six tall; solid is reported, ringed is planned. */
export const yearDots = (axis: Axis, points: Points) => {
  const ROWS = 6;
  const n = axis.years.length;
  const cols = n <= 6 ? 5 : n <= 10 ? 3 : n <= 16 ? 2 : 1;
  const total = ROWS * cols;
  const max = peak(points);
  return `<div class="pd-dots"${n > 16 ? ' data-dense' : ''} style="--n:${n};--c:${cols}">${axis.years
    .map((y, i) => {
      const p = points.get(y);
      const done = p && p.value !== null && p.value > 0 ? Math.max(1, Math.round((p.value / max) * total)) : 0;
      const plan = p && p.planned > 0 ? Math.max(1, Math.round((p.planned / max) * total)) : 0;
      return `<div${i === axis.now ? ' data-now' : ''}><span>${Array.from({ length: total }, (_, r) => `<b${r < done ? ' data-on' : r < plan ? ' data-plan' : ''}></b>`).join('')}</span></div>`;
    })
    .join('')}</div>`;
};

/** Running total against the planned curve; `ceiling` is the target. */
export const yearLine = (axis: Axis, points: Points, ceiling: number) => {
  const n = axis.years.length;
  const x = (i: number) => ((i + 0.5) / n) * 100;
  let plan = 0;
  let done = 0;
  const planPts: [number, number][] = [];
  const donePts: [number, number][] = [];
  axis.years.forEach((y, i) => {
    const p = points.get(y);
    if (!p) return;
    plan += p.planned;
    planPts.push([i, plan]);
    if (p.value !== null) {
      done += p.value;
      donePts.push([i, done]);
    }
  });
  const max = Math.max(1e-9, ceiling, plan, done);
  const y = (v: number) => 98 - (v / max) * 94;
  const path = (pts: [number, number][]) => pts.map(([i, v], k) => `${k ? 'L' : 'M'}${x(i).toFixed(2)} ${y(v).toFixed(2)}`).join(' ');
  const last = donePts[donePts.length - 1];
  const area = donePts.length > 1 ? `<path class="pd-line__area" d="${path(donePts)} L${x(last[0]).toFixed(2)} 98 L${x(donePts[0][0]).toFixed(2)} 98 Z"/>` : '';
  return `<div class="pd-line">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      ${planPts.length > 1 ? `<path class="pd-line__plan" d="${path(planPts)}"/>` : ''}${area}
      ${donePts.length > 1 ? `<path class="pd-line__done" d="${path(donePts)}"/>` : ''}
    </svg>
    ${last && done > 0 ? `<i class="pd-line__dot" style="left:${x(last[0]).toFixed(2)}%;top:${y(last[1]).toFixed(2)}%"></i>` : ''}
    ${axis.now >= 0 ? `<i class="pd-line__now" style="left:${x(axis.now).toFixed(2)}%"></i>` : ''}
  </div>`;
};

// ── Share-of-target marks ──────────────────────────────────────────────────
/** 40 ticks; `planShare` draws one taller tick at plan to date. */
export const tickMeter = (share: number, planShare: number | null) => {
  const N = 40;
  const filled = Math.round(Math.min(1, Math.max(0, share)) * N);
  const mark = planShare === null ? -1 : Math.min(N - 1, Math.round(Math.min(1, planShare) * N));
  return `<div class="pd-ticks">${Array.from({ length: N }, (_, i) => `<i${i < filled ? ' data-on' : ''}${i === mark ? ' data-plan' : ''}></i>`).join('')}</div>`;
};

/** `total` dashes, `on` filled; `half` marks the one in progress (a step bar). */
export const dashMeter = (on: number, total: number, half = -1) =>
  `<div class="pd-dashes">${Array.from({ length: total }, (_, i) => `<i${i < on ? ' data-on' : i === half ? ' data-half' : ''}></i>`).join('')}</div>`;

/** A bar whose label sits inside it and inverts where the fill covers it. */
export const fillMeter = (share: number, startLabel: string, endLabel: string) => {
  const text = `<div class="pd-meter__text"><span>${startLabel}</span><span>${endLabel}</span></div>`;
  return `<div class="pd-meter" style="--p:${(share * 100).toFixed(2)}">${text}<div class="pd-meter__fill" aria-hidden="true">${text}</div></div>`;
};

/** "5 of 7 reported" with a block per item. */
export const countBlocks = (on: number, total: number, word: string) =>
  `<span class="pd-count">${on} of ${total} ${word}<span class="pd-blocks" aria-hidden="true">${Array.from({ length: Math.min(total, 14) }, (_, i) => `<i${i < Math.round((on / total) * Math.min(total, 14)) ? ' data-on' : ''}></i>`).join('')}</span></span>`;

// ── Stream: a cumulative total widening over the years ─────────────────────
export const stream = (axis: Axis, cumulative: { year: number; total: number }[], whole: number, label: (n: number) => string) => {
  const n = axis.years.length;
  const x = (i: number) => ((i + 0.5) / n) * 100;
  const pts = cumulative.map((c) => [axis.years.indexOf(c.year), whole > 0 ? (c.total / whole) * 46 : 0, c.total] as const).filter(([i]) => i >= 0);
  if (pts.length < 2) return '';
  const curve = (sign: number, list: readonly (readonly [number, number, number])[]) =>
    list
      .map(([i, h], k) => {
        const X = x(i);
        const Y = 50 + sign * Math.max(0.8, h);
        if (!k) return `${X.toFixed(2)} ${Y.toFixed(2)}`;
        const [pi, ph] = list[k - 1];
        const mid = (x(pi) + X) / 2;
        return `C${mid.toFixed(2)} ${(50 + sign * Math.max(0.8, ph)).toFixed(2)} ${mid.toFixed(2)} ${Y.toFixed(2)} ${X.toFixed(2)} ${Y.toFixed(2)}`;
      })
      .join(' ');
  const stride = Math.ceil(pts.length / 4);
  const markers = pts.filter((_, k) => k % stride === stride - 1 || k === pts.length - 1);
  return `<div class="pd-stream">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M${curve(-1, pts)} L${curve(1, [...pts].reverse())} Z"/></svg>
    ${markers.map(([i, , total]) => `<i class="pd-stream__at" style="left:${x(i).toFixed(2)}%"><b>${label(total)}</b></i>`).join('')}
  </div>`;
};

// ── Parts of a whole ───────────────────────────────────────────────────────
export const segmentBar = (parts: { share: number }[], hue: Hue) =>
  `<div class="pd-segments">${parts.map((p, i) => `<i style="--s:${partHue(hue, i, parts.length)};flex-grow:${Math.max(0.01, p.share).toFixed(4)}"></i>`).join('')}</div>`;

/** Leader rows under a segment bar; `bars` adds a share bar under each row. */
export const partRows = (parts: { name: string; amount: string; share: number }[], hue: Hue, bars = false) =>
  `<ul class="pd-fund">${parts
    .map(
      (p, i) => `<li style="--s:${partHue(hue, i, parts.length)};--w:${(p.share * 100).toFixed(2)}%">
        <span class="pd-fund__name"><i class="pd-swatch"></i>${p.name}</span><i class="pd-leader"></i>
        <span class="pd-fund__amt">${p.amount}</span><span class="pd-fund__share">${Math.round(p.share * 100)}%</span>
        ${bars ? '<i class="pd-fund__bar"></i>' : ''}
      </li>`,
    )
    .join('')}</ul>`;

// ── Lanes: several series on one shared axis ───────────────────────────────
export const lanes = (axis: Axis, rows: { id: string; plot: string; hue: string }[]) =>
  `<div class="pd-lanes">
    <div class="pd-lane pd-lane--axis"><div class="pd-lane__id"></div><div class="pd-lane__plot">${axisLabels(axis, true)}</div></div>
    ${rows.map((r) => `<div class="pd-lane" style="--s:${r.hue}"><div class="pd-lane__id">${r.id}</div><div class="pd-lane__plot">${r.plot}</div></div>`).join('')}
    ${axis.now >= 0 ? `<i class="pd-lanes__now" style="--now:${((axis.now + 0.5) / axis.years.length).toFixed(4)}"></i>` : ''}
  </div>`;
