// Leaflet, shared by the maps that EDIT and AGGREGATE work areas — the project
// work-area editor, its upload preview and the portfolio map. The read-only
// project map (firma2-project-map.astro) predates this file and keeps its own
// copy of the loader; both inject the same tags, so whichever runs first wins
// and the other awaits it.
//
// Leaflet is a CDN global (1.9.4 from cdnjs, the vetted precedent in
// cb-fish-design), not an npm dependency, so `any` is the honest type.

import { dashOf, lineStyleOf } from '../data/firma2-geography';
import type { ReferenceLayer, Region, Subwatershed } from '../data/firma2-geography';
import { BASEMAPS, readMapStyle } from './work-areas';
import { ICON_PATHS } from '@esa/ecology/icon-registry';
import '../styles/map.css';
import '@esa/ecology/esa-popover';
import '@esa/ecology/esa-radio-group';
import '@esa/ecology/esa-checkbox-group';

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
//
// TWO RASTER SETS, BASE AND REFERENCE. The base is land, water and roads; the
// reference set is the place names alone, on a transparent tile. Drawing the
// names in their own pane ABOVE the work areas is what every serious map does
// (Mapbox and Felt call it "labels above data") — a translucent fill laid over
// a baked-in label smudges the one word that says where the reader is.
const scheme = (): 'Dark' | 'Light' =>
  document.documentElement.getAttribute('data-scheme') === 'dark' ? 'Dark' : 'Light';
const esriUrl = (layer: 'Base' | 'Reference'): string =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${scheme()}_Gray_${layer}/MapServer/tile/{z}/{y}/{x}`;

/** Glyphs from the house registry (Hugeicons) for Leaflet's own controls. */
export const glyph = (name: string): string =>
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] ?? ''}</svg>`;

/** Leaflet's zoom and layer controls, re-drawn with house glyphs. Idempotent. */
const reglyph = (container: HTMLElement): void => {
  const set = (sel: string, name: string) => {
    const el = container.querySelector<HTMLElement>(sel);
    if (el && !el.querySelector('svg')) el.innerHTML = glyph(name);
  };
  set('.leaflet-control-zoom-in', 'plus');
  set('.leaflet-control-zoom-out', 'minus');
};

/** A pixel of overlap on every tile — see TILE SEAMS in createMap. */
const closeSeams = (layer: Leaflet): void => {
  layer.on('tileloadstart', (e: { tile: HTMLElement }) => {
    const size = parseFloat(e.tile.style.width);
    if (size) {
      e.tile.style.width = `${size + 1}px`;
      e.tile.style.height = `${size + 1}px`;
    }
  });
};

/**
 * A map on the grayscale Esri basemap, following the colour scheme live.
 * `onScheme` lets the caller repaint its own shapes, whose colours are read
 * from tokens that the scheme just changed.
 */
export const createMap = (L: Leaflet, canvas: HTMLElement, options: Record<string, unknown> = {}, onScheme?: () => void): Leaflet => {
  // Tooltips at full strength: Leaflet's 0.9 lets the basemap bleed through text.
  L.Tooltip.prototype.options.opacity = 1;
  canvas.classList.add('firma2-map');
  const map = L.map(canvas, { scrollWheelZoom: false, ...options });
  map.attributionControl?.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');

  // RETINA BASE TILES. Esri serves 256px rasters only, so on a 2x screen the
  // roads and coastlines were upscaled mush. detectRetina asks for the next
  // zoom level at half size — four tiles where there was one — which is the
  // honest way to get a sharp raster out of a 256px service. maxZoom is one
  // over the service's last level because detectRetina spends one.
  const retina = window.devicePixelRatio > 1;
  const base = L.tileLayer(esriUrl('Base'), {
    attribution: 'Tiles &copy; Esri',
    maxZoom: retina ? 17 : 16,
    maxNativeZoom: retina ? 15 : 16,
    detectRetina: retina,
  }).addTo(map);

  // The labels pane sits over the overlay pane (400) and under markers (600).
  // Not retina: the names would come out at half size.
  map.createPane('labels').style.zIndex = '450';
  const labels = L.tileLayer(esriUrl('Reference'), { pane: 'labels', maxZoom: 16, interactive: false }).addTo(map);

  // TILE SEAMS. At a fractional zoom (zoomSnap 0.5) Chrome rounds each tile's
  // scaled edge separately and leaves a hairline of background between them —
  // the white grid that ran across every map. A pixel of overlap closes it (a
  // half pixel did not: at a .5 zoom the tile container is scaled to 0.71).
  // map.css turns off Leaflet's plus-lighter blend, which would double the overlap.
  [base, labels].forEach(closeSeams);
  // Kept on the map so a page can offer the base beside another one
  // (addBasemaps) and swap the names for ones that read on a photo.
  map.firma2Base = base;
  map.firma2Labels = labels;

  reglyph(canvas);
  // A layer control added after creation (addReferenceLayers) gets its glyph too.
  new MutationObserver(() => reglyph(canvas)).observe(canvas.querySelector('.leaflet-control-container') ?? canvas, {
    childList: true,
    subtree: true,
  });

  new MutationObserver(() => {
    base.setUrl(esriUrl('Base'));
    if (!map.firma2OnImagery) labels.setUrl(esriUrl('Reference'));
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

/**
 * The house colour for a kind: the categorical ramp slot — slots 1 and 2 are
 * the most separable pair. What a workspace gets until it picks its own.
 */
export const houseKindColor = (kind: 'area' | 'reach' | 'point'): string =>
  kind === 'reach'
    ? token('--color-background-dataviz-categorical-2', '#3e63dd')
    : token('--color-background-dataviz-categorical-1', '#3e9b4f');

/** A kind's colour: the workspace's own (Map layers settings), else the house's. */
export const kindColor = (kind: 'area' | 'reach' | 'point'): string => {
  const style = readMapStyle();
  return (kind === 'reach' ? style.reachColor : style.areaColor) ?? houseKindColor(kind);
};

/**
 * A marker: a solid dot in a light ring on a soft shadow (the ring and the
 * shadow come from map.css via the class). `on` is the lit state a map uses
 * when its list row or card is hovered.
 */
export const markerStyle = (fillColor: string, on = false) => ({
  radius: on ? 9 : 7,
  color: token('--color-background-elevation-floating', '#fff'),
  weight: 2,
  opacity: 1,
  fillColor,
  fillOpacity: 1,
  className: 'firma2-map-dot',
  // Markers ride ABOVE the place names (markerPane 600 > labels 450 > shapes
  // 400): a label may sit over a fill, never over the thing you click.
  pane: 'markerPane',
});

/**
 * How a saved shape is painted, by kind. The same treatment on every map.
 * An area is a light wash under a firm edge — the edge is the claim, the wash
 * only says "inside". A reach is a heavy round-capped line with a casing.
 * A point is a marker.
 */
export const shapeStyle = (kind: 'area' | 'reach' | 'point', color = kindColor(kind)) =>
  kind === 'reach'
    ? { color, weight: 4, opacity: 1, lineCap: 'round', lineJoin: 'round', className: 'firma2-map-reach' }
    : kind === 'point'
      ? { ...markerStyle(color), radius: 6 }
      : { color, weight: 2, opacity: 1, lineJoin: 'round', fillColor: color, fillOpacity: readMapStyle().areaFillOpacity, className: 'firma2-map-area' };

/**
 * THE LAYERS CONTROL — the map's base maps and the workspace's reference
 * layers, behind one button in the trailing control group.
 *
 * Until 2026-11-12 this was Leaflet's own L.control.layers. It opened on HOVER
 * (Leaflet's collapsed mode has no click-only option), kept its toggle glyph as
 * a grey tile at the top of the open panel, and drew bare native radios and
 * checkboxes with no group names. Now the button is a leaflet-bar button like
 * zoom, and the panel is Ecology's: esa-popover (click to open; Escape or a
 * click outside closes it; aria-expanded on the button), esa-radio-group for
 * the base map and esa-checkbox-group for the layers.
 *
 * bcn-lego-checked: esa-popover, esa-radio-group and esa-checkbox-group are the
 * whole panel; the only spoke markup is the 40px leaflet-bar button every map
 * control already uses (src/styles/map.css). Beacon is not cloned here.
 *
 * The API kept Leaflet's two calls (addBaseLayer, addTo + _map) so the three
 * maps that build one did not change. Toggling a base map fires the map's
 * `baselayerchange`, as Leaflet's control did.
 */
type LayerEntry = { id: string; layer: ReferenceLayer; group: Leaflet; on: boolean; live: boolean };

/** An ArcGIS REST layer endpoint: …/MapServer/6 or …/FeatureServer/0. */
const isArcgisLayer = (url: string): boolean => /\/(MapServer|FeatureServer)\/\d+\/?$/i.test(url);

/** A feature's popup field, matched without regard to case (NAME vs name). */
const fieldOf = (props: Record<string, unknown>, field: string): string => {
  const key = Object.keys(props).find((k) => k.toLowerCase() === field.toLowerCase());
  return key ? String(props[key] ?? '') : '';
};

const createLayersControl = (L: Leaflet, map: Leaflet, entries: LayerEntry[], sync: () => void): Leaflet => {
  const bases: { layer: Leaflet; name: string }[] = [];
  const radios: HTMLElement & { options?: unknown; value?: string } = document.createElement('esa-radio-group');
  const boxes: HTMLElement & { options?: unknown; value?: string[]; helpText?: string } = document.createElement('esa-checkbox-group');

  const gatedNow = () =>
    entries.filter((e) => e.on && e.layer.minZoom != null && map.getZoom() < e.layer.minZoom).map((e) => e.layer.name);

  const render = () => {
    radios.hidden = bases.length < 2;
    radios.options = bases.map((b, i) => ({ value: String(i), label: b.name }));
    radios.value = String(Math.max(0, bases.findIndex((b) => map.hasLayer(b.layer))));
    boxes.hidden = entries.length === 0;
    boxes.options = entries.map((e) => ({ value: e.id, label: e.layer.name }));
    boxes.value = entries.filter((e) => e.on).map((e) => e.id);
    const gated = gatedNow();
    boxes.helpText = gated.length ? `Zoom in to see ${gated.join(' and ')}.` : '';
  };

  const Control = L.Control.extend({
    options: { position: 'topright' },
    onAdd() {
      const root = L.DomUtil.create('div', 'firma2-layers');
      const popover = document.createElement('esa-popover') as HTMLElement & { label: string; position: string };
      popover.setAttribute('position', 'left');
      popover.setAttribute('label', 'Map layers');
      const bar = L.DomUtil.create('div', 'leaflet-bar', popover);
      const button = L.DomUtil.create('button', '', bar);
      button.type = 'button';
      button.title = 'Map layers';
      button.setAttribute('aria-label', 'Map layers');
      button.innerHTML = glyph('layers');
      const panel = document.createElement('div');
      panel.slot = 'content';
      panel.className = 'firma2-layers__panel';
      radios.setAttribute('label', 'Base map');
      radios.setAttribute('size', 'md');
      boxes.setAttribute('label', 'Layers');
      boxes.setAttribute('size', 'md');
      panel.append(radios, boxes);
      // HUB GAP: esa-popover listens for its trigger click on the wrapper that
      // ALSO holds the open panel, so a click on any option toggled the panel
      // shut. Stopping the click at the panel keeps it inside; the popover's
      // outside-click check runs in the capture phase, before this, and still
      // closes it from anywhere else. Worth a /request-lego (listen on the
      // trigger slot, not the anchor).
      panel.addEventListener('click', (e) => e.stopPropagation());
      popover.append(panel);
      root.append(popover);

      // HUB GAP: esa-popover's side placements CENTER the panel on the trigger
      // and offer no alignment. On a short map with the button near its top,
      // a centered panel runs past the map's clipped edge and loses its first
      // group. Top-aligned to the button instead, arrow on the button's middle
      // (20px of its 40px). An adopted sheet, the AppLayout CONTROL_PINS
      // technique; worth a /request-lego (an `align` on esa-popover).
      customElements.whenDefined('esa-popover').then(async () => {
        await (popover as HTMLElement & { updateComplete?: Promise<unknown> }).updateComplete;
        const shadow = popover.shadowRoot;
        if (!shadow) return;
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`
          .esa-popover--left { top: 0; transform: none; }
          .esa-popover__arrow--left { top: 20px; }
        `);
        shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, sheet];
      });

      radios.addEventListener('change', (e: Event) => {
        const pick = bases[Number((e as CustomEvent).detail.value)];
        if (!pick || map.hasLayer(pick.layer)) return;
        bases.forEach((b) => b !== pick && map.hasLayer(b.layer) && map.removeLayer(b.layer));
        pick.layer.addTo(map);
        pick.layer.bringToBack?.();
        map.fire('baselayerchange', { layer: pick.layer, name: pick.name });
      });
      boxes.addEventListener('change', (e: Event) => {
        const on = new Set<string>((e as CustomEvent).detail.value);
        entries.forEach((en) => (en.on = on.has(en.id)));
        sync();
        render();
      });

      L.DomEvent.disableClickPropagation(root);
      L.DomEvent.disableScrollPropagation(root);
      render();
      return root;
    },
  });

  const control = new Control();
  control.addBaseLayer = (layer: Leaflet, name: string) => {
    bases.push({ layer, name });
    render();
    return control;
  };
  control.render = render;
  return control;
};

/**
 * The workspace's reference layers as overlays, in the layers control. Only
 * active layers are offered, and only those this prototype holds geometry for
 * actually draw. A layer with a minimum zoom stays checked while the map is
 * zoomed out past it, and the control's help text says to zoom in, rather than
 * the layer silently drawing nothing.
 */
export const addReferenceLayers = (
  L: Leaflet,
  map: Leaflet,
  layers: ReferenceLayer[],
  geometry: { regions: Region[]; subwatersheds: Subwatershed[] },
): Leaflet => {
  const styleOf = (layer: ReferenceLayer) =>
    layer.publisherColours
      ? { color: '#6b7280', weight: 1, fillOpacity: 0 }
      : {
          color: layer.stroke,
          weight: layer.strokeWidth,
          opacity: 0.8,
          fillColor: layer.fill || layer.stroke,
          fillOpacity: layer.fillOpacity,
          dashArray: dashOf(lineStyleOf(layer), layer.strokeWidth),
          // A dot is a zero-length dash, and only a round cap gives it a body.
          lineCap: lineStyleOf(layer) === 'dotted' ? 'round' : 'butt',
        };
  const hoverTip = { sticky: true, className: 'firma2-map-tip' };
  // A labelled layer prints each name on its shape, in the layer's own colour,
  // rather than waiting for a pointer.
  const tipFor = (layer: ReferenceLayer) =>
    layer.showLabels ? { permanent: true, direction: 'center', className: 'firma2-map-shape-label', interactive: false } : hoverTip;
  const labelled = (layer: ReferenceLayer, l: Leaflet, name: string) => {
    l.bindTooltip(name, tipFor(layer));
    if (layer.showLabels && !layer.publisherColours) l.on('tooltipopen', (e: { tooltip: Leaflet }) => e.tooltip.getElement()?.style.setProperty('color', layer.stroke));
    return l;
  };

  // The geometry this file holds for a layer — the prototype's stand-in, and
  // the fallback when a live service cannot be reached.
  const drawStored = (entry: LayerEntry) => {
    const rings = entry.layer.draws === 'regions' ? geometry.regions : entry.layer.draws === 'subwatersheds' ? geometry.subwatersheds : [];
    entry.group.clearLayers();
    rings.forEach((r) =>
      labelled(entry.layer, L.polygon(r.ring, { ...styleOf(entry.layer), pane: 'reference', interactive: Boolean(entry.layer.popupField) }), r.name).addTo(
        entry.group,
      ),
    );
  };

  const entries: LayerEntry[] = layers
    .filter((layer) => layer.active && (layer.draws || (layer.kind === 'feature' && isArcgisLayer(layer.url))))
    .map((layer, i) => ({
      id: `layer-${i}`,
      layer,
      group: L.featureGroup([], { attribution: layer.url.includes('hydro.nationalmap.gov') ? 'Watersheds: USGS WBD' : undefined }),
      on: layer.onByDefault,
      live: layer.kind === 'feature' && isArcgisLayer(layer.url),
    }));

  // Reference layers sit UNDER the work areas: they are context, not content.
  const pane = map.createPane('reference');
  pane.style.zIndex = '350';
  entries.filter((e) => !e.live).forEach(drawStored);

  // LIVE ARCGIS LAYERS. A feature layer whose URL is a real ArcGIS REST layer
  // is queried for what is in view, as GeoJSON, generalised to about a pixel at
  // the current zoom so a state-wide view stays light. The old shapes stay up
  // until the new ones arrive, so a pan never blanks the layer; a newer view
  // aborts the request in flight. A layer whose service fails (a dead URL, an
  // outage) falls back to the geometry this file holds, once, and stays there.
  const inflight = new Map<string, AbortController>();
  const load = async (entry: LayerEntry) => {
    if (!entry.live) return;
    inflight.get(entry.id)?.abort();
    const ctrl = new AbortController();
    inflight.set(entry.id, ctrl);
    const b = map.getBounds().pad(0.25);
    const pixel = 360 / (256 * 2 ** map.getZoom());
    const field = entry.layer.popupField || '*';
    const q = new URLSearchParams({
      where: '1=1',
      geometry: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()].map((n: number) => n.toFixed(4)).join(','),
      geometryType: 'esriGeometryEnvelope',
      inSR: '4326',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: field,
      returnGeometry: 'true',
      outSR: '4326',
      maxAllowableOffset: pixel.toFixed(6),
      geometryPrecision: '5',
      f: 'geojson',
    });
    try {
      const res = await fetch(`${entry.layer.url.replace(/\/$/, '')}/query?${q}`, { signal: ctrl.signal });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data?.features)) throw new Error('not a feature collection');
      entry.group.clearLayers();
      L.geoJSON(data, {
        pane: 'reference',
        interactive: Boolean(entry.layer.popupField),
        style: () => styleOf(entry.layer),
        onEachFeature: (f: { properties: Record<string, unknown> }, l: Leaflet) => {
          const name = entry.layer.popupField ? fieldOf(f.properties ?? {}, entry.layer.popupField) : '';
          if (name) labelled(entry.layer, l, name);
        },
      })
        .getLayers()
        .forEach((l: Leaflet) => entry.group.addLayer(l));
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      entry.live = false;
      drawStored(entry);
    } finally {
      if (inflight.get(entry.id) === ctrl) inflight.delete(entry.id);
    }
  };

  // The checkbox is the reader's intent; the zoom gate is ours.
  const sync = () => {
    entries.forEach((entry) => {
      const visibleAtZoom = entry.layer.minZoom == null || map.getZoom() >= entry.layer.minZoom;
      const shown = entry.on && visibleAtZoom;
      if (shown && !map.hasLayer(entry.group)) entry.group.addTo(map);
      if (!shown && map.hasLayer(entry.group)) map.removeLayer(entry.group);
      if (shown) void load(entry);
    });
  };

  const control = createLayersControl(L, map, entries, sync);
  let settle = 0;
  map.on('moveend', () => {
    clearTimeout(settle);
    settle = window.setTimeout(() => {
      sync();
      control.render();
    }, 250);
  });
  if (entries.length) control.addTo(map);
  sync();
  return control;
};

/**
 * The base maps a reader can choose between, as radios at the top of the
 * layers control. All four are Esri's keyless tile services (server.
 * arcgisonline.com), like the canvas. Each says what to do with the place
 * names drawn over it:
 *   - Map: the house grey canvas, with its own grey names (createMap).
 *   - Topographic: Esri's topo map, which prints its own names — ours hide.
 *   - Terrain: shaded relief, which has none — the grey names stay.
 *   - Satellite: imagery, on which grey names vanish — Esri's white, haloed
 *     set replaces them while it is on.
 * Terrain's service stops at level 13; past it the tiles are scaled up rather
 * than going blank.
 */
export const addBasemaps = (L: Leaflet, map: Leaflet, control: Leaflet): void => {
  const retina = window.devicePixelRatio > 1;
  const esriTiles = (service: string, attribution: string, lastLevel: number) => {
    const layer = L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`, {
      attribution,
      maxZoom: retina ? 17 : 16,
      maxNativeZoom: Math.min(lastLevel, 16),
      detectRetina: retina,
    });
    closeSeams(layer);
    return layer;
  };
  const topo = esriTiles('World_Topo_Map', 'Tiles &copy; Esri, USGS, NOAA and contributors', 23);
  const terrain = esriTiles('World_Terrain_Base', 'Terrain &copy; Esri, USGS, NOAA', 13);
  const imagery = esriTiles('World_Imagery', 'Imagery &copy; Esri, Maxar, Earthstar Geographics', 16);
  const layers = { map: map.firma2Base, topo, terrain, imagery };
  BASEMAPS.forEach((b) => control.addBaseLayer(layers[b.value], b.label));
  map.on('baselayerchange', (e: { layer: Leaflet }) => {
    map.firma2OnImagery = e.layer === imagery;
    map.firma2Labels.setUrl(
      map.firma2OnImagery
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
        : esriUrl('Reference'),
    );
    map.firma2Labels.setOpacity(e.layer === topo ? 0 : 1);
  });

  // The workspace's opening base map (Map layers settings). The reader's own
  // switch after that is theirs, and lasts the page view.
  const opening = layers[readMapStyle().basemap];
  if (opening && opening !== map.firma2Base) {
    map.removeLayer(map.firma2Base);
    opening.addTo(map);
    opening.bringToBack?.();
    map.fire('baselayerchange', { layer: opening });
    control.render?.();
  }
};
