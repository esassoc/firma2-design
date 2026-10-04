// Repaints a classification's KPI list from this browser's edits — KPIs
// linked or unlinked and goal targets set in Workspace settings
// (src/lib/taxonomy-edits.ts) — over figures only the build could compute
// (kpiFigureTable in src/data/firma2-classification-rollup.ts). The
// Classifications board and each goal's page share it, so a target changed in
// settings moves the same ring on both.
//
// Rows are cloned from a `<template>` holding the server-rendered markup of
// one row (a firma2-kpi-progress), so a repainted row is the same legos the
// build would have drawn.

import { kpiSlugs, targetsFor } from './taxonomy-edits';
import type { GoalTarget } from '../data/firma2-classifications';
import type { KpiFigures } from '../data/firma2-classification-rollup';
import { kpiRowView, yearAxis } from './kpi-row';
import { projectPeekButton } from './project-peek';

export interface GoalData {
  /** Per seeded classification slug: its build-time links, targets and figures. */
  seeded: Record<string, { kpis: string[]; targets: GoalTarget[]; figures: Record<string, KpiFigures> }>;
  /** Every catalog measure, for one linked to a classification added in this browser. */
  catalog: Record<string, { name: string; unit: string; decimals: number }>;
}

/** This classification's KPIs as this browser has them: links, targets, figures. */
const linkedKpis = (slug: string, data: GoalData): { f: KpiFigures; t?: GoalTarget }[] => {
  const seed = data.seeded[slug];
  const linked = kpiSlugs(slug, seed?.kpis ?? []);
  const targets = targetsFor(slug, seed?.targets ?? []);
  return linked.map((ms) => {
    const c = data.catalog[ms];
    const f: KpiFigures = seed?.figures[ms] ?? {
      name: c?.name ?? ms,
      unit: c?.unit ?? '',
      decimals: c?.decimals ?? 0,
      additive: true,
      reported: null,
      committed: null,
      from: [],
    };
    return { f, t: targets.find((x) => x.measure === ms) };
  });
};

/** Fill `list` with this classification's KPIs; returns how many there are. */
export const renderKpis = (
  list: HTMLElement,
  template: HTMLTemplateElement,
  slug: string,
  data: GoalData,
): number => {
  const kpis = linkedKpis(slug, data);
  list.replaceChildren(
    ...kpis.map(({ f, t }) => {
      const li = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const root = li.matches('[data-kpi-progress]') ? li : li.querySelector<HTMLElement>('[data-kpi-progress]');
      if (root) paintKpiProgress(root, f, t);
      return li;
    }),
  );
  return kpis.length;
};

// Same arc arithmetic as bcn-progress-ring and firma2-project-measures' painter.
const paintRing = (root: Element, percent: number, planned: number): void => {
  const fill = root.querySelector<SVGElement>('.bcn-progress-ring__fill');
  const dash = Number(fill?.getAttribute('stroke-dasharray'));
  if (!fill || !Number.isFinite(dash)) return;
  fill.setAttribute('stroke-dashoffset', String(dash * (1 - percent / 100)));
  root.querySelector<SVGElement>('.bcn-progress-ring__secondary')?.setAttribute('stroke-dashoffset', String(dash * (1 - planned / 100)));
};

/** Repaint a server-rendered (or cloned) firma2-kpi-progress in place. */
export const paintKpiProgress = (root: HTMLElement, f: KpiFigures, t?: GoalTarget): void => {
  const v = kpiRowView({ ...f, goal: t?.value, goalYear: t?.year });
  const name = root.querySelector('[data-kpi-name]');
  if (name) name.textContent = f.name;
  const total = root.querySelector('[data-kpi-total]');
  if (total) total.textContent = v.totalText;
  paintRing(root, v.percent, v.plannedPercent);
  const note = root.querySelector<HTMLElement>('[data-kpi-note]');
  if (note) {
    note.textContent = v.lead;
    note.hidden = !v.lead;
  }
};

/**
 * Rebuild firma2-classification-measures' table — a row per KPI, a child row
 * per project, the "Not yet planned" row — from this browser's links and
 * targets. Rows match the build's: same view (kpiRowView), same classes, and
 * the ring, chevron and side-panel button cloned from the component's own
 * templates. Returns how many KPIs there are.
 */
export const renderKpiTable = (root: HTMLElement, slug: string, data: GoalData): number => {
  const kpis = linkedKpis(slug, data);
  const years = yearAxis(kpis.map(({ f }) => f.from));
  const body = root.querySelector<HTMLElement>('[data-kpi-body]');
  const head = root.querySelector<HTMLElement>('[data-kpi-head]');
  const headTemplate = root.querySelector<HTMLTemplateElement>('template[data-kpi-head-template]');
  const projectTemplate = root.querySelector<HTMLTemplateElement>('template[data-kpi-project-template]');
  if (!body || !head || !headTemplate || !projectTemplate) return kpis.length;

  // Astro scopes the component's rules by attribute; built cells carry it too.
  const scope = (body.closest('table') ?? body).getAttributeNames().filter((a) => a.startsWith('data-astro-cid'));
  const cell = (tag: 'th' | 'td', text = '', cls = ''): HTMLElement => {
    const el = document.createElement(tag);
    for (const a of scope) el.setAttribute(a, '');
    if (cls) el.className = cls;
    el.textContent = text;
    return el;
  };
  const num = 'firma2-classification-measures__num';
  const pin = `${num} firma2-classification-measures__pin`;
  const spacer = () => cell('td', '', 'firma2-classification-measures__spacer');
  const row = (cls: string, attrs: Record<string, string>): HTMLTableRowElement => {
    const tr = document.createElement('tr');
    for (const a of scope) tr.setAttribute(a, '');
    tr.className = cls;
    for (const [k, val] of Object.entries(attrs)) tr.setAttribute(k, val);
    return tr;
  };

  const colHead = (text: string, cls = '') => {
    const th = cell('th', text, cls);
    th.setAttribute('scope', 'col');
    return th;
  };
  head.replaceChildren(
    colHead('Measure'),
    colHead('Progress', pin),
    ...years.map((y) => colHead(String(y), num)),
    spacer(),
  );

  // The Simple view's highlight tiles: cloned, then filled.
  const highlights = root.querySelector<HTMLElement>('[data-kpi-highlights]');
  const highlightTemplate = root.querySelector<HTMLTemplateElement>('template[data-kpi-highlight-template]');
  const tiles: HTMLElement[] = [];

  const rows: HTMLElement[] = [];
  kpis.forEach(({ f, t }, i) => {
    const v = kpiRowView({ ...f, goal: t?.value, goalYear: t?.year, years });

    const tile = highlightTemplate?.content.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
    if (tile) {
      paintRing(tile, v.percent, v.plannedPercent);
      const set = (sel: string, text: string) => {
        const el = tile.querySelector<HTMLElement>(sel);
        if (!el) return;
        el.textContent = text;
        el.hidden = !text;
      };
      set('[data-highlight-value]', v.highlight.value);
      set('[data-highlight-name]', f.name);
      set('[data-highlight-label]', v.highlight.label);
      set('[data-highlight-sub]', v.highlight.sub);
      tiles.push(tile);
    }

    const measure = row('firma2-classification-measures__measure', { 'data-measure': String(i) });
    const th = cell('th');
    th.setAttribute('scope', 'row');
    const headEl = headTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const name = headEl.querySelector<HTMLElement>('[data-name]');
    if (name) {
      name.textContent = f.name;
      name.title = f.name;
    }
    const button = headEl.querySelector('button');
    button?.setAttribute('aria-label', `Hide projects for ${f.name}`);
    button?.setAttribute('title', `Hide projects for ${f.name}`);
    paintRing(headEl, v.percent, v.plannedPercent);
    th.append(headEl);
    const total = cell('td', v.totalText, `${pin} firma2-classification-measures__total`);
    measure.append(th, total, ...v.table.totals.map((c) => cell('td', c, num)), spacer());
    rows.push(measure);

    v.table.rows.forEach((r) => {
      const child = row('firma2-classification-measures__child', { 'data-child-of': String(i), 'data-peek-row': '' });
      const nameCell = cell('th');
      nameCell.setAttribute('scope', 'row');
      const pair = projectTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const a = pair.querySelector('a');
      if (a) {
        a.href = r.href;
        a.title = r.name;
        a.textContent = r.name;
      }
      const peek = r.slug ? projectPeekButton(r.slug, r.name) : null;
      if (peek) pair.append(peek);
      nameCell.append(pair);
      child.append(nameCell, cell('td', r.share, pin), ...r.cells.map((c) => cell('td', c, num)), spacer());
      rows.push(child);
    });

    if (v.table.gap) {
      const gap = row('firma2-classification-measures__child firma2-classification-measures__gap', { 'data-child-of': String(i) });
      const label = cell('th', 'Not yet planned');
      label.setAttribute('scope', 'row');
      gap.append(label, cell('td', v.table.gap, pin), ...years.map(() => cell('td', '', num)), spacer());
      rows.push(gap);
    }
  });
  body.replaceChildren(...rows);
  highlights?.replaceChildren(...tiles);
  if (highlights) highlights.hidden = kpis.length === 0;
  return kpis.length;
};
