// PROTOTYPE KIT — /proto/map-style. Throwaway (emil-prototype): nothing in
// production imports this. One live map and one set of control builders that
// the three explored variants share, so they differ in arrangement and model,
// never in materials.
//
// Every variant writes the REAL stores (reference layers, map style), and the
// stage repaints from them — so a change made in one variant is what the next
// one opens on, and what the production settings page shows.

import '@esa/ecology/esa-select';
import '@esa/ecology/esa-color-picker';
import '@esa/ecology/esa-range-slider';
import '@esa/ecology/esa-button-toggle';
import '@esa/ecology/esa-switch-toggle';
import '@esa/ecology/esa-radio-group';
import { HYDROLOGIC_REGIONS, LINE_STYLES, MAP_SWATCHES, SUBWATERSHEDS, dashOf, lineStyleOf, seedWorkAreas } from '../../data/firma2-geography';
import type { LineStyle, ReferenceLayer } from '../../data/firma2-geography';
import { projects } from '../../data/firma2-projects';
import { addBasemaps, createMap, houseKindColor, loadLeaflet, shapeStyle } from '../../lib/leaflet';
import type { Leaflet } from '../../lib/leaflet';
import { BASEMAPS, DEFAULT_MAP_STYLE, onGeoChange, readLayers, readMapStyle, writeLayers, writeMapStyle } from '../../lib/work-areas';
import type { BasemapId, MapStyle } from '../../lib/work-areas';

export { BASEMAPS, DEFAULT_MAP_STYLE, LINE_STYLES, MAP_SWATCHES, lineStyleOf, onGeoChange, readLayers, readMapStyle };
export type { BasemapId, LineStyle, MapStyle, ReferenceLayer };

// ---- store writes -------------------------------------------------------------

export const patchLayer = (id: string, patch: Partial<ReferenceLayer>): void =>
  writeLayers(readLayers().map((l) => (l.id === id ? { ...l, ...patch } : l)));

export const patchMapStyle = (patch: Partial<MapStyle>): void => writeMapStyle({ ...readMapStyle(), ...patch });

/** Only layers a style can reach: shapes, in the workspace's own colours. */
export const styleable = (layer: ReferenceLayer): boolean => !layer.publisherColours && (layer.kind === 'feature' || layer.kind === 'geojson');

export const toHex = (color: string): string => {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return color;
  ctx.fillStyle = color;
  return ctx.fillStyle;
};

export const areaHex = (): string => readMapStyle().areaColor ?? toHex(houseKindColor('area'));
export const reachHex = (): string => readMapStyle().reachColor ?? toHex(houseKindColor('reach'));

// ---- element builders ----------------------------------------------------------

type Props = Record<string, unknown>;

/** A lego by tag. The modules above are already defined, so props land on the upgraded element. */
export const lego = <T extends HTMLElement = HTMLElement>(tag: string, attrs: Record<string, string> = {}, props: Props = {}, onChange?: (el: T & Props) => void): T & Props => {
  const el = document.createElement(tag) as T & Props;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  Object.assign(el, props);
  if (onChange) el.addEventListener('change', () => onChange(el));
  return el;
};

export const box = (className: string, gap: string | null, ...children: (Node | string)[]): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = className;
  if (gap) el.dataset.gap = gap;
  el.append(...children);
  return el;
};

const esc = (v: string) => v.replace(/[^#\w(),.% -]/g, '');

/** A layer's style as one inset rectangle: its line, dashes included, over its fill. */
export const swatch = (layer: Pick<ReferenceLayer, 'stroke' | 'strokeWidth' | 'fill' | 'fillOpacity' | 'strokeStyle' | 'draws'>): HTMLSpanElement => {
  const el = document.createElement('span');
  el.className = 'proto-swatch';
  el.setAttribute('aria-hidden', 'true');
  const width = Math.max(0.5, layer.strokeWidth);
  const style = lineStyleOf(layer);
  const dash = dashOf(style, width);
  el.innerHTML = `<svg><rect x="14%" y="18%" width="72%" height="64%" rx="2" vector-effect="non-scaling-stroke"
    fill="${esc(layer.fill || layer.stroke)}" fill-opacity="${Math.max(0, Math.min(1, layer.fillOpacity))}"
    stroke="${esc(layer.stroke)}" stroke-width="${Math.min(width, 3)}"
    ${dash ? `stroke-dasharray="${dash}"` : ''} stroke-linecap="${style === 'dotted' ? 'round' : 'butt'}"/></svg>`;
  return el;
};

/** The work areas' swatch: an area patch crossed by a reach. */
export const workSwatch = (): HTMLSpanElement => {
  const el = document.createElement('span');
  el.className = 'proto-swatch';
  el.setAttribute('aria-hidden', 'true');
  const s = readMapStyle();
  el.innerHTML = `<svg viewBox="0 0 32 20" preserveAspectRatio="none"><rect x="4" y="4" width="16" height="12" rx="2" fill="${esc(areaHex())}" fill-opacity="${s.areaFillOpacity}" stroke="${esc(areaHex())}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>
    <path d="M12 16 Q 20 4 29 8" fill="none" stroke="${esc(reachHex())}" stroke-width="2.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`;
  return el;
};

// ---- the full control set (variant: Studio) --------------------------------------

/** Every knob a layer's style has. Writes on each change; never re-reads while open. */
export const layerKnobs = (layer: ReferenceLayer): HTMLElement =>
  box(
    'stack',
    'md',
    lego('esa-color-picker', { label: 'Line color', size: 'md' }, { value: layer.stroke, swatches: MAP_SWATCHES }, (el) => patchLayer(layer.id, { stroke: String(el.value) })),
    lego('esa-button-toggle', { label: 'Line style', size: 'md' }, { options: LINE_STYLES, value: lineStyleOf(layer) }, (el) =>
      patchLayer(layer.id, { strokeStyle: String(el.value) as LineStyle }),
    ),
    lego('esa-range-slider', { label: 'Line width (px)', size: 'md', min: '0.5', max: '6', step: '0.5' }, { value: layer.strokeWidth }, (el) =>
      patchLayer(layer.id, { strokeWidth: Number(el.value) }),
    ),
    lego('esa-color-picker', { label: 'Fill color', size: 'md' }, { value: layer.fill || layer.stroke, swatches: MAP_SWATCHES }, (el) => patchLayer(layer.id, { fill: String(el.value) })),
    lego('esa-range-slider', { label: 'Fill opacity (%)', size: 'md', min: '0', max: '100', step: '1' }, { value: Math.round(layer.fillOpacity * 100) }, (el) =>
      patchLayer(layer.id, { fillOpacity: Number(el.value) / 100 }),
    ),
    lego('esa-switch-toggle', { label: 'Label shapes with the pop-up field' }, { checked: Boolean(layer.showLabels) }, (el) => patchLayer(layer.id, { showLabels: Boolean(el.checked) })),
  );

export const workKnobs = (): HTMLElement => {
  const s = readMapStyle();
  return box(
    'stack',
    'md',
    lego('esa-color-picker', { label: 'Area and point color', size: 'md' }, { value: areaHex(), swatches: MAP_SWATCHES }, (el) => patchMapStyle({ areaColor: String(el.value) })),
    lego('esa-color-picker', { label: 'Reach color', size: 'md' }, { value: reachHex(), swatches: MAP_SWATCHES }, (el) => patchMapStyle({ reachColor: String(el.value) })),
    lego('esa-range-slider', { label: 'Area fill opacity (%)', size: 'md', min: '0', max: '60', step: '1' }, { value: Math.round(s.areaFillOpacity * 100) }, (el) =>
      patchMapStyle({ areaFillOpacity: Number(el.value) / 100 }),
    ),
  );
};

// ---- presets (variants: Legend, Themes) ---------------------------------------------

export const WEIGHTS = [
  { value: '1', label: 'Thin' },
  { value: '2', label: 'Medium' },
  { value: '3.5', label: 'Thick' },
];
export const FILLS = [
  { value: '0', label: 'None' },
  { value: '0.12', label: 'Light' },
  { value: '0.35', label: 'Solid' },
];
/** The preset nearest a stored number, so an off-preset value still lights a segment. */
export const nearest = (options: { value: string }[], n: number): string =>
  options.reduce((best, o) => (Math.abs(Number(o.value) - n) < Math.abs(Number(best.value) - n) ? o : best)).value;

export const STYLE_PRESETS: { value: string; label: string; patch: Partial<ReferenceLayer> }[] = [
  { value: 'outline', label: 'Outline', patch: { strokeStyle: 'solid', strokeWidth: 1.5, fillOpacity: 0 } },
  { value: 'wash', label: 'Soft fill', patch: { strokeStyle: 'solid', strokeWidth: 1, fillOpacity: 0.12 } },
  { value: 'dashed', label: 'Dashed boundary', patch: { strokeStyle: 'dashed', strokeWidth: 1.5, fillOpacity: 0 } },
  { value: 'dotted', label: 'Dotted boundary', patch: { strokeStyle: 'dotted', strokeWidth: 2, fillOpacity: 0 } },
  { value: 'bold', label: 'Bold outline', patch: { strokeStyle: 'solid', strokeWidth: 3, fillOpacity: 0.04 } },
];
export const presetOf = (layer: ReferenceLayer): string =>
  STYLE_PRESETS.find((p) => p.patch.strokeStyle === lineStyleOf(layer) && p.patch.strokeWidth === layer.strokeWidth && p.patch.fillOpacity === layer.fillOpacity)?.value ?? '';

export interface Theme {
  value: string;
  label: string;
  description: string;
  style: MapStyle;
  /** The colour every styleable reference layer takes. */
  reference: string;
}
export const THEMES: Theme[] = [
  {
    value: 'house',
    label: 'House',
    description: 'Gray base map. Green areas, blue reaches.',
    style: { ...DEFAULT_MAP_STYLE },
    reference: '#3e63dd',
  },
  {
    value: 'field',
    label: 'Field',
    description: 'Satellite imagery. Bright colors that hold on a photo.',
    style: { basemap: 'imagery', areaColor: '#ffd60a', reachColor: '#22d3ee', areaFillOpacity: 0.1 },
    reference: '#ffffff',
  },
  {
    value: 'survey',
    label: 'Survey',
    description: 'Topographic base map. Rust areas, violet boundaries.',
    style: { basemap: 'topo', areaColor: '#c2410c', reachColor: '#1d4ed8', areaFillOpacity: 0.2 },
    reference: '#7c3aed',
  },
  {
    value: 'print',
    label: 'Print',
    description: 'Shaded terrain. Dark outlines for a page or a slide.',
    style: { basemap: 'terrain', areaColor: '#1f2937', reachColor: '#b91c1c', areaFillOpacity: 0.12 },
    reference: '#4b5563',
  },
];
export const themeOf = (): string => {
  const s = readMapStyle();
  return THEMES.find((t) => t.style.basemap === s.basemap && t.style.areaColor === s.areaColor && t.style.reachColor === s.reachColor)?.value ?? '';
};
export const applyTheme = (value: string): void => {
  const theme = THEMES.find((t) => t.value === value);
  if (!theme) return;
  writeLayers(readLayers().map((l) => (styleable(l) ? { ...l, stroke: theme.reference, fill: theme.reference } : l)));
  writeMapStyle({ ...theme.style });
};

// ---- a style per base map (variant: Legend, per base map) ----------------------------
//
// What a line needs depends on what is under it: indigo reads on the grey
// canvas and vanishes on a photograph. Here each base map keeps its own set
// of colours and styles; switching the base map swaps the set in. A base map
// nobody has styled yet opens on a starting set chosen for it (the themes
// above), not on whatever the last one left behind.

type BaseSet = { layers: Record<string, Partial<ReferenceLayer>>; style: Omit<MapStyle, 'basemap'> };
const SETS_KEY = 'firma2:proto-base-sets:v1';

const readSets = (): Partial<Record<BasemapId, BaseSet>> => {
  try {
    return JSON.parse(localStorage.getItem(SETS_KEY) ?? '{}');
  } catch {
    return {};
  }
};

const snapshot = (): BaseSet => {
  const { basemap: _, ...style } = readMapStyle();
  return {
    style,
    layers: Object.fromEntries(
      readLayers().map((l) => [l.id, { stroke: l.stroke, fill: l.fill, strokeWidth: l.strokeWidth, fillOpacity: l.fillOpacity, strokeStyle: lineStyleOf(l), showLabels: Boolean(l.showLabels) }]),
    ),
  };
};

const starting = (base: BasemapId): BaseSet => {
  const theme = THEMES.find((t) => t.style.basemap === base)!;
  const { basemap: _, ...style } = theme.style;
  return { style, layers: Object.fromEntries(readLayers().filter(styleable).map((l) => [l.id, { stroke: theme.reference, fill: theme.reference }])) };
};

/** Switch the base map. With `perBase`, file the current style under the old one and bring in the new one's. */
export const switchBase = (next: BasemapId, perBase: boolean): void => {
  const from = readMapStyle().basemap;
  if (next === from) return;
  if (!perBase) return patchMapStyle({ basemap: next });
  const sets = readSets();
  sets[from] = snapshot();
  const target = sets[next] ?? starting(next);
  try {
    localStorage.setItem(SETS_KEY, JSON.stringify(sets));
  } catch {
    // Blocked storage: the sets hold for this page view only.
  }
  writeLayers(readLayers().map((l) => ({ ...l, ...(target.layers[l.id] ?? {}) })));
  writeMapStyle({ ...target.style, basemap: next });
};

// ---- the live map ----------------------------------------------------------------------

export interface Stage {
  /** The stage was hidden or resized; let Leaflet re-measure. */
  reflow: () => void;
}

/** A map of the Tahoe basin drawing the stores as they stand, repainting on every write. */
export const mountStage = async (canvas: HTMLElement): Promise<Stage> => {
  canvas.classList.add('firma2-map');
  const L: Leaflet = await loadLeaflet();
  const map = createMap(L, canvas, { scrollWheelZoom: false }, () => paint());
  const bases: Record<string, Leaflet> = {};
  addBasemaps(L, map, {
    addBaseLayer: (layer: Leaflet, name: string) => (bases[BASEMAPS.find((b) => b.label === name)?.value ?? name] = layer),
    render: () => undefined,
  });
  const pane = map.getPane('reference') ?? map.createPane('reference');
  pane.style.zIndex = '350';
  const reference = L.featureGroup().addTo(map);
  const work = L.featureGroup().addTo(map);
  const areas = projects.flatMap((p) => seedWorkAreas(p));
  let current: Leaflet = Object.values(bases).find((b) => map.hasLayer(b));

  const paint = () => {
    const want = bases[readMapStyle().basemap];
    if (want && want !== current) {
      if (current) map.removeLayer(current);
      want.addTo(map);
      want.bringToBack?.();
      map.fire('baselayerchange', { layer: want });
      current = want;
    }
    reference.clearLayers();
    readLayers()
      .filter((l) => l.active && l.draws)
      .forEach((layer) => {
        const style = layer.publisherColours
          ? { color: '#6b7280', weight: 1, fillOpacity: 0 }
          : {
              color: layer.stroke,
              weight: layer.strokeWidth,
              opacity: 0.8,
              fillColor: layer.fill || layer.stroke,
              fillOpacity: layer.fillOpacity,
              dashArray: dashOf(lineStyleOf(layer), layer.strokeWidth),
              lineCap: lineStyleOf(layer) === 'dotted' ? 'round' : 'butt',
            };
        (layer.draws === 'regions' ? HYDROLOGIC_REGIONS : SUBWATERSHEDS).forEach((r) => {
          const shape = L.polygon(r.ring, { ...style, pane: 'reference' }).addTo(reference);
          if (layer.showLabels) {
            shape.bindTooltip(r.name, { permanent: true, direction: 'center', className: 'firma2-map-shape-label', interactive: false });
            shape.getTooltip()?.getElement()?.style.setProperty('color', layer.stroke);
          } else shape.bindTooltip(r.name, { sticky: true, className: 'firma2-map-tip' });
        });
      });
    work.clearLayers();
    areas.forEach((a) =>
      (a.kind === 'point' ? L.circleMarker(a.path[0], { ...shapeStyle('point'), radius: 6 }) : a.kind === 'reach' ? L.polyline(a.path, shapeStyle('reach')) : L.polygon(a.path, shapeStyle('area')))
        .bindTooltip(a.label, { sticky: true, className: 'firma2-map-tip' })
        .addTo(work),
    );
  };

  paint();
  // Fitted after the first layout settles: a stage inside a container that was
  // display:none a frame ago can still report a stale box to Leaflet.
  const fit = () => {
    map.invalidateSize();
    map.fitBounds(L.latLngBounds(HYDROLOGIC_REGIONS.flatMap((r) => r.ring)), { padding: [16, 16], animate: false });
  };
  fit();
  window.setTimeout(fit, 250);
  onGeoChange(paint);
  return { reflow: () => map.invalidateSize() };
};

/** Mount a variant's stage the first time its section is shown; re-measure after. */
export const onShown = (section: HTMLElement, canvas: HTMLElement): void => {
  let stage: Promise<Stage> | null = null;
  const show = () => {
    if (section.hidden) return;
    if (!stage) stage = mountStage(canvas);
    else void stage.then((s) => s.reflow());
  };
  section.addEventListener('proto:show', show);
  show();
};
