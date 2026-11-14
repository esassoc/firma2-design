// Draws one Progress Dashboard tile for whatever question its store holds.
// Imported for its side effect by firma2-dashboard.
//
// THE FORM FOLLOWS WHAT IS LEGAL (src/lib/dashboard-model.ts), never a free
// chart-type picker:
//   one number            the figure, what it is read against, who filed
//   bars by group         one bar per group, largest first
//   over time, no split   one bar per year filled to its report, plan behind
//                         and ticked (firma2-measure-history's form)
//   over time, no sum     lines: the average reading against the target
//   split that adds up    stacked bars; running total = stacked areas
//   split that overlaps   side-by-side bars, no total, no plan
import '@esa/ecology/esa-chart';
import { compute, formatter, queryLine, type Figure, type Group, type TileState, type YearFigure } from './dashboard-model';
import { ds, storeFor } from './dashboard-store';

type ChartElement = HTMLElement & Record<string, unknown>;
type GridApi = { setGridOption: (key: string, value: unknown) => void };

const token = (name: string, fallback: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
const show = (el: HTMLElement | null, on: boolean) => {
  if (el) el.style.display = on ? '' : 'none';
};
const plural = (n: number, one: string) => `${n} ${n === 1 ? one : `${one}s`}`;

document.querySelectorAll<HTMLElement>('[data-figure]').forEach((root) => {
  const store = storeFor(root);
  const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel);
  const slot = q('[data-figure-chart]')!;
  const title = q('[data-figure-title]');
  const query = q('[data-figure-query]');
  const coverage = q('[data-figure-coverage]');
  const note = q('[data-figure-note]');
  const empty = q('[data-figure-empty]');
  const body = q('[data-figure-body]');
  const number = q('[data-figure-number]');
  // The plot and its data view: both belong to the chart forms only.
  const chartParts = [...root.querySelectorAll<HTMLElement>('[data-figure-chartwrap]')];
  const gridHost = q('[data-grid]');

  let chart: ChartElement | null = null;
  let figure: Figure | null = null;
  let gridApi: GridApi | null = null;

  const paint = () => {
    if (!chart || !figure || figure.empty) return;
    const f = figure;
    const s = store.get();
    if (s.kind === 'number') return;
    // The plot is as tall as the tile was dragged to.
    if (chart.getAttribute('height') !== `${s.height}px`) chart.setAttribute('height', `${s.height}px`);
    const { nf, withUnit } = formatter(f.measure);
    const color = token('--color-background-dataviz-categorical-1', '#3e9b4f');
    const ink = token('--color-content-default', '#202020');
    const reportedName = f.additive ? f.measure.filed ?? 'Reported' : 'Average reading';
    const plannedName = f.additive ? f.measure.planned ?? 'Planned' : 'Target';
    const cumulative = s.view === 'cumulative' && f.additive;
    const quiet = { highlight: { unhighlightedItem: { opacity: 1 }, unhighlightedSeries: { opacity: 1 } } };
    const tickLabel = { formatter: (p: { value: unknown }) => nf.format(Number(p.value)) };
    const axes = { x: { type: 'category', position: 'bottom' }, y: { type: 'number', position: 'left', label: tickLabel } };
    const options = { legend: { position: 'top' }, tooltip: { mode: 'single' }, axes };
    const noSymbol = { marker: { enabled: false }, line: { enabled: false } };
    const label = `${f.measure.name}${s.kind === 'groups' ? ` by ${f.splitNoun}` : ' by year'}`;
    chart.setAttribute('label', label);
    chart.label = label;

    // BARS BY GROUP — one figure per group, largest first, read across.
    if (s.kind === 'groups') {
      chart.data = f.bars.map((g) => ({ group: g.key, value: g.total, g }));
      chart.series = [
        {
          type: 'bar',
          direction: 'horizontal',
          xKey: 'group',
          yKey: 'value',
          yName: f.measure.name,
          fill: color,
          strokeWidth: 0,
          cornerRadius: 3,
          ...quiet,
          tooltip: {
            renderer: (p: { datum: { g: Group } }) => ({
              heading: p.datum.g.key,
              symbol: noSymbol,
              data: [
                { label: f.measure.name, value: withUnit(p.datum.g.total) },
                ...(p.datum.g.projects ? [{ label: 'Projects', value: String(p.datum.g.projects) }] : []),
              ],
            }),
          },
        },
      ];
      // A LONG NAME IS SHORTENED, NOT CLIPPED (user's screenshot, 2026-11-12:
      // "…shed Restoration Board"). The library caps the label column at a
      // share of the plot and cuts whatever runs past it — from the front,
      // because the labels are right-aligned — and it can wrap or truncate an
      // axis TITLE but not its labels (ag-charts 14.1 types). So the names get
      // 40% of the tile and an ellipsis at the end that fits it; the whole
      // name is in the tooltip and in View as data. Repainted on resize.
      const room = slot.getBoundingClientRect().width * 0.4 - 16;
      const fits = Math.max(8, Math.floor(room / 6.6));
      const short = (name: string) => (name.length > fits ? `${name.slice(0, fits - 1).trimEnd()}…` : name);
      chart.options = {
        legend: { enabled: false },
        tooltip: { mode: 'single' },
        axes: {
          x: { type: 'category', position: 'left', maxThicknessRatio: 0.4, label: { formatter: (p: { value: unknown }) => short(String(p.value)) } },
          y: { type: 'number', position: 'bottom', label: tickLabel },
        },
      };
      return;
    }

    const filedText = (y: YearFigure) => (y.closed ? `${y.filed} of ${plural(y.owed, 'project')}` : 'Not due yet');
    const yearTip = {
      renderer: (p: { datum: { y: YearFigure } }) => {
        const y = p.datum.y;
        const planRow = y.planned != null ? [{ label: plannedName, value: withUnit(y.planned) }] : [];
        return {
          heading: String(y.year),
          symbol: noSymbol,
          data: y.closed
            ? [{ label: reportedName, value: y.value != null ? withUnit(y.value) : 'Nothing filed' }, ...planRow, ...(f.measure.group === 'Performance measures' ? [{ label: 'Filed', value: filedText(y) }] : [])]
            : planRow,
        };
      },
    };
    const planLine = (stroke: string) => ({ stroke, strokeOpacity: 0.6, strokeWidth: 2, lineDash: [6, 4], marker: { enabled: false } });
    const plotWidth = Math.max(0, slot.getBoundingClientRect().width - 80);
    const barWidth = Math.max(4, (plotWidth / Math.max(1, f.years.length)) * 0.7);
    const tick = ({ path, x, y }: { path: { rect: (x: number, y: number, w: number, h: number) => void }; x: number; y: number }) => path.rect(x - barWidth / 2, y - 1, barWidth, 2);
    const planTick = (name: string) => ({ type: 'line', xKey: 'period', yKey: 'planned', yName: name, strokeWidth: 0, strokeOpacity: 0, marker: { enabled: true, shape: tick, size: barWidth, fill: ink, stroke: ink, strokeWidth: 0 }, highlight: { enabled: false } });
    // A figure read against one whole budget has no plan per year to draw.
    const yearlyPlan = f.years.some((y) => y.planned != null);

    // NO SPLIT — the measure page's own chart.
    if (f.drawn.length === 0) {
      if (!f.additive) {
        chart.data = f.years.map((y) => ({ period: String(y.year), value: y.value ?? undefined, planned: y.planned ?? undefined, y }));
        chart.series = [
          { type: 'line', xKey: 'period', yKey: 'planned', yName: plannedName, ...planLine(color), ...quiet, tooltip: yearTip },
          { type: 'line', xKey: 'period', yKey: 'value', yName: reportedName, stroke: color, strokeWidth: 2.5, marker: { enabled: false }, connectMissingData: true, ...quiet, tooltip: yearTip },
        ];
      } else if (cumulative) {
        chart.data = f.years.map((y) => ({ period: String(y.year), reported: y.reportedToDate ?? undefined, planned: y.plannedToDate ?? undefined, y }));
        chart.series = [
          ...(yearlyPlan ? [{ type: 'line', xKey: 'period', yKey: 'planned', yName: `${plannedName} to date`, ...planLine(color), ...quiet }] : []),
          { type: 'line', xKey: 'period', yKey: 'reported', yName: `${reportedName} to date`, stroke: color, strokeWidth: 2.5, marker: { enabled: false }, ...quiet },
        ];
      } else {
        chart.data = f.years.map((y) => ({ period: String(y.year), value: y.value ?? undefined, planned: y.planned ?? undefined, y }));
        chart.series = [
          ...(yearlyPlan ? [{ type: 'bar', xKey: 'period', yKey: 'planned', yName: plannedName, showInLegend: false, grouped: false, widthRatio: 0.7, cornerRadius: 3, fill: color, fillOpacity: 0.25, strokeWidth: 0, highlight: { enabled: false }, tooltip: yearTip }] : []),
          { type: 'bar', xKey: 'period', yKey: 'value', yName: reportedName, grouped: false, widthRatio: 0.7, cornerRadius: 3, fill: color, strokeWidth: 0, highlight: { enabled: false }, tooltip: yearTip },
          ...(yearlyPlan ? [{ ...planTick(plannedName), tooltip: { ...yearTip, range: 'nearest' } }] : []),
        ];
      }
      chart.options = options;
      return;
    }

    // SPLIT OVER TIME. One key per drawn group; a closed year with nothing
    // filed in a group stays a gap, never a zero.
    const keys = f.drawn.map((_, i) => `g${i}`);
    const lastClosed = f.lastClosed?.year ?? -Infinity;
    const rows = f.years.map((y, yi) => {
      const row: Record<string, unknown> = { period: String(y.year), planned: (cumulative ? y.plannedToDate : y.planned) ?? undefined };
      f.drawn.forEach((g, i) => {
        row[keys[i]] = (cumulative ? g.toDate[yi] : g.values[yi]) ?? undefined;
      });
      return row;
    });
    const valueTip = { renderer: (p: { datum: Record<string, unknown>; yKey: string; yName: string }) => ({ heading: String(p.datum.period), data: [{ label: p.yName, value: withUnit(Number(p.datum[p.yKey])) }] }) };

    if (!f.additive) {
      chart.data = rows;
      chart.series = [
        // Readings are taken some years and not others; the line runs through the gap.
        ...f.drawn.map((g, i) => ({ type: 'line', xKey: 'period', yKey: keys[i], yName: g.key, strokeWidth: 2, connectMissingData: true, ...quiet, tooltip: valueTip })),
        { type: 'line', xKey: 'period', yKey: 'planned', yName: 'Target', ...planLine(ink), ...quiet },
      ];
    } else if (!f.stackable) {
      // OVERLAPPING GROUPS never stack and carry no plan: both would draw a
      // total that counts some projects twice.
      chart.data = cumulative ? rows.filter((r) => Number(r.period) <= lastClosed) : rows;
      chart.series = cumulative
        ? f.drawn.map((g, i) => ({ type: 'line', xKey: 'period', yKey: keys[i], yName: g.key, strokeWidth: 2, ...quiet, tooltip: valueTip }))
        : f.drawn.map((g, i) => ({ type: 'bar', xKey: 'period', yKey: keys[i], yName: g.key, cornerRadius: 2, strokeWidth: 0, ...quiet, tooltip: valueTip }));
    } else if (cumulative) {
      chart.data = rows;
      chart.series = [
        ...f.drawn.map((g, i) => ({ type: 'area', xKey: 'period', yKey: keys[i], yName: g.key, stacked: true, fillOpacity: 0.85, strokeWidth: 0, marker: { enabled: false }, ...quiet, tooltip: valueTip })),
        ...(yearlyPlan ? [{ type: 'line', xKey: 'period', yKey: 'planned', yName: `${plannedName} to date`, ...planLine(ink), ...quiet }] : []),
      ];
    } else {
      chart.data = rows;
      chart.series = [
        ...f.drawn.map((g, i) => ({ type: 'bar', xKey: 'period', yKey: keys[i], yName: g.key, stacked: true, widthRatio: 0.7, strokeWidth: 0, ...quiet, tooltip: valueTip })),
        ...(yearlyPlan ? [planTick(plannedName)] : []),
      ];
    }
    chart.options = options;
  };

  // THE DATA VIEW follows the form: a row per group, or a row per year.
  const columns = (f: Figure, s: TileState) => {
    const { withUnit } = formatter(f.measure);
    const right = { minWidth: 130, flex: 1, type: 'rightAligned' };
    if (s.kind === 'groups') {
      type Row = { g: Group };
      return [
        { headerName: f.splitNoun.charAt(0).toUpperCase() + f.splitNoun.slice(1), minWidth: 180, flex: 2, valueGetter: (p: { data: Row }) => p.data.g.key },
        { headerName: f.measure.name, ...right, valueGetter: (p: { data: Row }) => withUnit(p.data.g.total) },
        { headerName: 'Projects', ...right, valueGetter: (p: { data: Row }) => p.data.g.projects },
      ];
    }
    type Row = { y: YearFigure; i: number };
    const cell = (v: number | null, y: YearFigure) => (v != null ? withUnit(v) : y.closed ? 'Nothing filed' : 'Not due yet');
    return [
      { headerName: 'Year', minWidth: 90, flex: 1, valueGetter: (p: { data: Row }) => p.data.y.year },
      { headerName: f.additive ? f.measure.filed ?? 'Reported' : 'Average reading', ...right, valueGetter: (p: { data: Row }) => cell(p.data.y.value, p.data.y) },
      ...(f.years.some((y) => y.planned != null) ? [{ headerName: f.additive ? f.measure.planned ?? 'Planned' : 'Target', ...right, valueGetter: (p: { data: Row }) => (p.data.y.planned != null ? withUnit(p.data.y.planned) : '') }] : []),
      ...(f.measure.group === 'Performance measures' ? [{ headerName: 'Filed', minWidth: 150, flex: 1, valueGetter: (p: { data: Row }) => (p.data.y.closed ? `${p.data.y.filed} of ${plural(p.data.y.owed, 'project')}` : 'Not due yet') }] : []),
      // EVERY group, not only the six the chart had colours for.
      ...f.groups.map((g) => ({ headerName: g.key, ...right, valueGetter: (p: { data: Row }) => (g.values[p.data.i] != null ? withUnit(g.values[p.data.i]!) : '') })),
    ];
  };
  const tableRows = (f: Figure, s: TileState): unknown[] => (s.kind === 'groups' ? f.groups.map((g) => ({ g })) : f.years.map((y, i) => ({ y, i })).reverse());

  let mounting = false;
  function ensureChart() {
    if (chart || mounting) return;
    mounting = true;
    void customElements.whenDefined('esa-chart').then(() => {
      chart = document.createElement('esa-chart') as ChartElement;
      chart.setAttribute('label', 'Chart');
      paint();
      slot.replaceChildren(chart);
      // NO FRAME (user, 2026-11-12: no card border around the charts). The
      // lego draws its border, padding and fill on an inner .wrap with no hook
      // to turn them off, so a sheet is added to its shadow root. This wants a
      // frameless option on esa-chart (/request-lego) and goes when it lands.
      const el = chart;
      void (el as unknown as { updateComplete?: Promise<unknown> }).updateComplete?.then(() => {
        const bare = new CSSStyleSheet();
        bare.replaceSync('.wrap { border: 0; padding: 0; background: transparent; border-radius: 0; }');
        if (el.shadowRoot) el.shadowRoot.adoptedStyleSheets = [...el.shadowRoot.adoptedStyleSheets, bare];
      });
    });
  }

  const render = (s: TileState) => {
    figure = compute(ds, s);
    const f = figure;
    const { withUnit } = formatter(f.measure);
    if (title) title.textContent = f.measure.name;
    if (query) {
      query.textContent = queryLine(ds, s);
      show(query, query.textContent !== '');
    }
    show(body, !f.empty);
    show(empty, f.empty);
    const isChart = s.kind !== 'number';
    chartParts.forEach((part) => show(part, isChart));
    show(number, !isChart);
    // A tile that is not on screen yet draws nothing; it is asked again when shown.
    if (isChart && !f.empty && root.offsetParent !== null) ensureChart();

    if (number && !isChart) {
      const y = f.lastClosed;
      const timeless = f.total != null;
      const filed = f.measure.filed ?? 'Reported';
      const value = timeless ? f.total : f.additive ? y?.reportedToDate : y?.value;
      // A budget is one whole-project figure; a plan is what was due by now.
      const planned = timeless ? null : f.budget != null ? f.budget : f.additive ? y?.plannedToDate : y?.planned;
      const against = (f.measure.planned ?? 'Planned').toLowerCase();
      const set = (sel: string, text: string) => {
        const el = number.querySelector<HTMLElement>(sel);
        if (el) el.textContent = text;
      };
      // NO FIGURE, NO DISPLAY TYPE (user, 2026-11-12: "why is nothing filed
      // massive?"). The stat's value slot is sized for a number; with nothing
      // filed the tile says so in a body line and the stat stays away.
      const stat = number.querySelector<HTMLElement>('.esa-stat');
      const none = number.querySelector<HTMLElement>('[data-figure-nothing]');
      show(stat, value != null);
      show(none, value == null);
      if (none) none.textContent = planned == null ? 'Nothing filed' : `Nothing filed · ${withUnit(planned)} ${f.additive ? against : 'target'}`;
      // A count of projects is its own label; other timeless figures say how many projects they add up.
      const across = f.measure.unit === 'projects' ? '' : `Across ${plural(f.projects, 'project')}`;
      set('.esa-stat__value', value != null ? withUnit(value) : '');
      set('.esa-stat__label', timeless ? across : !y ? '' : f.additive ? `${filed} through ${y.year}` : `${y.year} average reading`);
      set('.esa-stat__sub', planned == null ? '' : f.additive ? `of ${withUnit(planned)} ${against}` : `Target ${withUnit(planned)}`);
    }

    // COVERAGE IS PART OF THE NUMBER, for what people file: the last closed
    // year's figure is only as whole as the filings behind it. Money and
    // counts come off the project record; nobody files them.
    const last = f.lastClosed;
    const filedFigure = f.measure.group === 'Performance measures' && s.kind !== 'groups';
    if (coverage) {
      coverage.textContent = last ? `${last.year}: ${last.filed} of ${plural(last.owed, 'project')} filed` : '';
      show(coverage, Boolean(last) && !f.empty && filedFigure);
    }
    if (note) {
      // Only where a reader would add them up: averages invite no total.
      const warn = f.overlapping && f.additive && !f.empty && isChart;
      note.textContent = warn ? `A project can count toward more than one ${f.splitNoun}, so these do not add up to a total.` : '';
      show(note, warn);
    }
    paint();
    if (gridApi) {
      gridApi.setGridOption('columnDefs', columns(f, s));
      gridApi.setGridOption('rowData', tableRows(f, s));
    }
  };

  new MutationObserver(paint).observe(document.documentElement, { attributeFilter: ['data-scheme'] });
  // The plan's tick is sized in pixels to the bar, so a resize repaints it —
  // once, after the width stops changing.
  let lastWidth = 0;
  let settle = 0;
  new ResizeObserver(() => {
    const w = Math.round(slot.getBoundingClientRect().width);
    if (w === lastWidth) return;
    lastWidth = w;
    window.clearTimeout(settle);
    settle = window.setTimeout(paint, 120);
  }).observe(slot);

  // The grid mounts on first open: built inside a closed <details> it
  // measures zero width and keeps it.
  const details = gridHost?.closest('details');
  details?.addEventListener('toggle', async () => {
    if (!details.open || gridApi || !gridHost || !figure) return;
    const { createCardGrid } = await import('../components/shared/grid-chrome');
    gridApi = createCardGrid(gridHost, { rowData: tableRows(figure, store.get()), columnDefs: columns(figure, store.get()) as never }) as unknown as GridApi;
  });

  store.subscribe(render);
});
