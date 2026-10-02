// Leaflet, shared by the maps that EDIT and AGGREGATE work areas — the project
// work-area editor, its upload preview and the portfolio map. The read-only
// project map (firma2-project-map.astro) predates this file and keeps its own
// copy of the loader; both inject the same tags, so whichever runs first wins
// and the other awaits it.
//
// Leaflet is a CDN global (1.9.4 from cdnjs, the vetted precedent in
// cb-fish-design), not an npm dependency, so `any` is the honest type.

import type { ReferenceLayer, Region, Subwatershed } from '../data/firma2-geography';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Leaflet = any;

const LEAFLET_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4';
let leafletReady: Promise<Leaflet> | null = null;

/** Load Leaflet once per document and resolve with `window.L`. */
export const loadLeaflet = (): Promise<Leaflet> => {
  const w = window as unknown as { L?: Leaflet };
  if (w.L) return Promise.resolve(w.L);
  if (leafletReady) return leafletReady;
  if (!document.querySelector('link[data-leaflet-css]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${LEAFLET_BASE}/leaflet.min.css`;
    link.setAttribute('data-leaflet-css', '');
    document.head.append(link);
  }
  let tag = document.querySelector<HTMLScriptElement>('script[data-leaflet-js]');
  if (!tag) {
    tag = document.createElement('script');
    tag.src = `${LEAFLET_BASE}/leaflet.min.js`;
    tag.async = true;
    tag.setAttribute('data-leaflet-js', '');
    document.head.append(tag);
  }
  const script = tag;
  leafletReady = new Promise<Leaflet>((resolve, reject) => {
    if (w.L) return resolve(w.L);
    script.addEventListener('load', () => (w.L ? resolve(w.L) : reject(new Error('no window.L'))), { once: true });
    script.addEventListener('error', () => reject(new Error('Leaflet failed to load')), { once: true });
  });
  return leafletReady;
};

/** A design token, resolved to the literal string an SVG attribute needs. */
export const token = (name: string, fallback: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

// Esri's gray canvas, light and dark: the same grayscale cartography in both
// schemes, keyless. CARTO's light_all/dark_all now answer with an "API key
// required" tile, which is how this file came to switch (2026-10-02).
const basemapUrl = (): string =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${
    document.documentElement.getAttribute('data-scheme') === 'dark' ? 'Dark' : 'Light'
  }_Gray_Base/MapServer/tile/{z}/{y}/{x}`;

/**
 * A map on the grayscale CARTO basemap, following the colour scheme live.
 * `onScheme` lets the caller repaint its own shapes, whose colours are read
 * from tokens that the scheme just changed.
 */
export const createMap = (L: Leaflet, canvas: HTMLElement, options: Record<string, unknown> = {}, onScheme?: () => void): Leaflet => {
  const map = L.map(canvas, { scrollWheelZoom: false, ...options });
  const tiles = L.tileLayer(basemapUrl(), {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 16,
  }).addTo(map);
  new MutationObserver(() => {
    tiles.setUrl(basemapUrl());
    onScheme?.();
  }).observe(document.documentElement, { attributeFilter: ['data-scheme'] });
  // A rail dragged or collapsed resizes the canvas without resizing the window.
  let frame = 0;
  new ResizeObserver(() => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      map.invalidateSize();
    });
  }).observe(canvas);
  return map;
};

/** The categorical ramp slot for a kind — slots 1 and 2 are the most separable pair. */
export const kindColor = (kind: 'area' | 'reach' | 'point'): string =>
  kind === 'reach'
    ? token('--color-background-dataviz-categorical-2', '#3e63dd')
    : token('--color-background-dataviz-categorical-1', '#3e9b4f');

/** How a saved shape is painted, by kind. The same treatment the read-only map uses. */
export const shapeStyle = (kind: 'area' | 'reach' | 'point', color = kindColor(kind)) =>
  kind === 'reach'
    ? { color, weight: 4, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }
    : { color, weight: 2, opacity: 0.9, fillColor: color, fillOpacity: kind === 'point' ? 0.85 : 0.22 };

/**
 * The workspace's reference layers as Leaflet overlays, in a layer control.
 * Only active layers are offered, and only those this prototype holds geometry
 * for actually draw. A layer with a minimum zoom says so in its own label
 * while the map is zoomed out past it, rather than silently drawing nothing.
 */
export const addReferenceLayers = (
  L: Leaflet,
  map: Leaflet,
  layers: ReferenceLayer[],
  geometry: { regions: Region[]; subwatersheds: Subwatershed[] },
): Leaflet => {
  const control = L.control.layers(undefined, undefined, { position: 'topright', collapsed: true });
  const entries = layers
    .filter((layer) => layer.active && layer.draws)
    .map((layer) => {
      const style = layer.publisherColours
        ? { color: '#6b7280', weight: 1, fillOpacity: 0 }
        : {
            color: layer.stroke,
            weight: layer.strokeWidth,
            opacity: 0.8,
            fillColor: layer.fill || layer.stroke,
            fillOpacity: layer.fillOpacity,
            dashArray: layer.draws === 'regions' ? '6 4' : undefined,
          };
      const rings = layer.draws === 'regions' ? geometry.regions : geometry.subwatersheds;
      const group = L.featureGroup(
        rings.map((r) =>
          L.polygon(r.ring, { ...style, interactive: Boolean(layer.popupField) }).bindTooltip(r.name, {
            sticky: true,
            className: 'firma2-map-tip',
          }),
        ),
      );
      return { layer, group, label: layer.name, on: layer.onByDefault };
    });

  // Reference layers sit UNDER the work areas: they are context, not content.
  const pane = map.createPane('reference');
  pane.style.zIndex = '350';
  entries.forEach((entry) => entry.group.eachLayer((l: Leaflet) => (l.options.pane = 'reference')));

  const labelFor = (entry: (typeof entries)[number]) =>
    entry.layer.minZoom != null && map.getZoom() < entry.layer.minZoom ? `${entry.layer.name} (zoom in to see)` : entry.layer.name;

  const sync = () => {
    entries.forEach((entry) => {
      const visibleAtZoom = entry.layer.minZoom == null || map.getZoom() >= entry.layer.minZoom;
      const shown = entry.on && visibleAtZoom;
      if (shown && !map.hasLayer(entry.group)) entry.group.addTo(map);
      if (!shown && map.hasLayer(entry.group)) map.removeLayer(entry.group);
      const label = labelFor(entry);
      if (label !== entry.label) {
        control.removeLayer(entry.group);
        control.addOverlay(entry.group, label);
        entry.label = label;
      }
    });
  };

  entries.forEach((entry) => {
    entry.label = labelFor(entry);
    control.addOverlay(entry.group, entry.label);
  });
  // The control's checkbox is the reader's intent; the zoom gate is ours.
  map.on('overlayadd', (e: Leaflet) => entries.forEach((en) => en.group === e.layer && (en.on = true)));
  map.on('overlayremove', (e: Leaflet) => {
    entries.forEach((en) => {
      if (en.group !== e.layer) return;
      const gated = en.layer.minZoom != null && map.getZoom() < en.layer.minZoom;
      if (!gated) en.on = false;
    });
  });
  map.on('zoomend', sync);
  if (entries.length) control.addTo(map);
  sync();
  return control;
};
