// bcn-entity-graph — a record and what it links to, drawn as a force-directed
// graph: the Obsidian "local graph" for this spoke's records. Every node is
// the record it names; following one opens that record's page, where the
// graph re-centres on it (user, 2026-10-09).
//
// bcn-lego-checked: no esa- component draws a node-link graph — esa-chart
// wraps AG Charts Community, which has no network/force series (its graph-ish
// series, sankey and chord, are Enterprise and are flows, not neighbourhoods);
// Beacon not cloned on this machine. bcn-entity-graph is the reusable home,
// data-agnostic: any {nodes, links} with a `kind` per node.
//
// USAGE. The data rides in a JSON script child, so a server-rendered caller
// needs no client glue:
//
//   <bcn-entity-graph label="Connections of Salmon & steelhead recovery">
//     <script type="application/json">{"nodes":[…],"links":[…]}</script>
//   </bcn-entity-graph>
//
// node: { id, kind, label, href?, center? } — `kind` picks the colour
// (data-kind on the node, styled in bcn-entity-graph.css), `href` makes the
// node a real link, `center` marks the record the page is about.
// Methods for the caller's view controls: zoomIn(), zoomOut(), fit().
//
// THE ENGINE IS D3 (user, 2026-10-09): d3-force for the simulation, d3-drag
// for moving nodes, d3-zoom for zoom and pan. They replaced a hand-rolled
// simulation; what d3 does not own is the drawing, which stays SVG for the
// reason below. The canvas graph libraries (Cytoscape.js, force-graph, Sigma)
// were weighed and passed over for the same reason.
//
// SVG, NOT CANVAS, and that decides the accessibility story. A canvas is a
// bitmap that needs a proxy DOM; here every linked node IS an <a> with an
// accessible name ("Upper Butte Creek fish passage, project") and a native
// tooltip, in the tab order, opened with Enter like any link. The links are
// decoration (aria-hidden) — the neighbourhood they describe is also listed in
// text by the caller, which owns the "View as list" alternative.
//
// THE LAYOUT IS DETERMINISTIC. d3-force seeds positions on a phyllotaxis
// spiral and jitters with its own fixed-seed LCG, the centre is pinned at the
// origin, and the simulation is ticked to rest synchronously before the first
// paint — same data, same picture, every load, no settling animation on
// arrival. It runs in its own units, independent of the element's rendered
// size, so a graph first drawn inside a hidden panel is right when it shows.
//
// TWO SCALES, AND THEY ARE DIFFERENT THINGS. The FIT scale spreads the rest
// state across the frame by multiplying positions only, so discs and labels
// keep their size however small or sparse the graph. The ZOOM scale (d3-zoom,
// on the viewport group) is the reader's, and scales everything, as a zoom
// should; past LABEL_ZOOM every node is labelled, Obsidian's rule.
//
// IT MOVES ONLY WHEN TOUCHED. Dragging a node pins it under the pointer and
// re-heats the simulation, so its neighbours follow; letting go releases it.
// Under prefers-reduced-motion the dragged node moves and nothing else
// animates. d3-drag's click distance tells a click from a drag and swallows
// the click a drag ends in, so a drag never opens the link.
//
// ZOOM NEVER STEALS THE RAIL'S SCROLL. The rail scrolls, so a bare wheel is
// left to it; pinch (which browsers report as ctrl+wheel) and ctrl/⌘+wheel
// zoom, a drag on empty space pans, and the caller's buttons do both from the
// keyboard. Double-click zoom is off — a double click on a node is a visit.
//
// NOTHING LEAVES THE FRAME. Panning is bounded to the drawing (translate
// extent), zoom never goes wider than the fitted view, every node is held
// inside the frame after each tick, and the svg clips.
//
// LABELS. A small graph names every node. A big one names the centre only, and
// a hovered or focused node names itself and its neighbours.
import { forceSimulation, forceLink, forceManyBody, forceCollide, forceX, forceY } from 'd3-force';
import type { ForceX, ForceY, Simulation, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
import { drag } from 'd3-drag';
import { zoom, zoomIdentity } from 'd3-zoom';
import type { ZoomBehavior, ZoomTransform } from 'd3-zoom';
import { select } from 'd3-selection';
import 'd3-transition';
import './bcn-entity-graph.css';

interface InNode {
  id: string;
  kind: string;
  label: string;
  href?: string;
  center?: boolean;
}

interface InLink {
  source: string;
  target: string;
}

interface SimNode extends InNode, SimulationNodeDatum {
  r: number;
  degree: number;
  el?: SVGGElement;
  text?: SVGTextElement;
  /** Rendered label width, measured once (estimated while hidden). */
  textWidth?: number;
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  source: SimNode;
  target: SimNode;
  el?: SVGLineElement;
}

const SVG = 'http://www.w3.org/2000/svg';

/** The drawing space. ~1 unit per CSS pixel in a 22rem rail. */
const W = 360;
const H = 320;
const PAD = 28;
/** The fitted view keeps the top band clear for the caller's view controls. */
const PAD_TOP = 48;

/** At or under this many nodes, every node is labelled. */
const LABEL_ALL = 8;
/** At or past this zoom, every node is labelled. */
const LABEL_ZOOM = 1.6;
const LABEL_MAX = 24;

/** The fitted view already shows everything, so it is also the widest view. */
const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 1.5;

const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const truncate = (text: string): string => (text.length > LABEL_MAX ? `${text.slice(0, LABEL_MAX - 1).trimEnd()}…` : text);

class BcnEntityGraph extends HTMLElement {
  private nodes: SimNode[] = [];
  private links: SimLink[] = [];
  private neighbours = new Map<string, Set<string>>();
  private sim?: Simulation<SimNode, SimLink>;
  private svg?: SVGSVGElement;
  private viewport?: SVGGElement;
  private zoomer?: ZoomBehavior<SVGSVGElement, unknown>;
  /** The fit scale: positions only, never discs or labels. */
  private scale = 1;
  private dragging = false;

  connectedCallback(): void {
    if (this.svg) return;
    const source = this.querySelector<HTMLScriptElement>('script[type="application/json"]');
    if (!source?.textContent) return;
    const data = JSON.parse(source.textContent) as { nodes: InNode[]; links: InLink[] };
    this.build(data);
    this.settle();
    this.render();
  }

  disconnectedCallback(): void {
    this.sim?.stop();
  }

  // -------------------------------------------------------------------------
  // Public — the caller's view controls
  // -------------------------------------------------------------------------

  zoomIn(): void {
    this.zoomTo((z) => z.scaleBy(this.target(), ZOOM_STEP));
  }

  zoomOut(): void {
    this.zoomTo((z) => z.scaleBy(this.target(), 1 / ZOOM_STEP));
  }

  /** Back to the fitted rest view. */
  fit(): void {
    this.zoomTo((z) => z.transform(this.target(), zoomIdentity));
  }

  private zoomTo(act: (z: ZoomBehavior<SVGSVGElement, unknown>) => void): void {
    if (this.svg && this.zoomer) act(this.zoomer);
  }

  /** The svg, animated unless the reader has asked for less motion. */
  private target() {
    const s = select(this.svg!);
    return (reducedMotion() ? s : s.transition().duration(200)) as unknown as Parameters<
      ZoomBehavior<SVGSVGElement, unknown>['transform']
    >[0];
  }

  // -------------------------------------------------------------------------
  // Model
  // -------------------------------------------------------------------------

  private build(data: { nodes: InNode[]; links: InLink[] }): void {
    const byId = new Map<string, SimNode>();
    for (const n of data.nodes) {
      const node: SimNode = { ...n, r: 0, degree: 0 };
      if (n.center) {
        node.fx = 0;
        node.fy = 0;
      }
      byId.set(n.id, node);
      this.neighbours.set(n.id, new Set());
    }
    for (const l of data.links) {
      const a = byId.get(l.source);
      const b = byId.get(l.target);
      if (!a || !b) continue;
      this.links.push({ source: a, target: b });
      a.degree++;
      b.degree++;
      this.neighbours.get(a.id)!.add(b.id);
      this.neighbours.get(b.id)!.add(a.id);
    }
    this.nodes = [...byId.values()];
    // Size by how linked a node is, like Obsidian; the centre is the largest.
    for (const n of this.nodes) n.r = n.center ? 11 : Math.min(9, 4.5 + Math.sqrt(n.degree) * 1.4);

    this.sim = forceSimulation<SimNode, SimLink>(this.nodes)
      .force('link', forceLink<SimNode, SimLink>(this.links).distance(64))
      .force('charge', forceManyBody<SimNode>().strength(-260))
      // The centre's label is always shown and sits under it, so the centre
      // keeps a wider berth than its disc — no neighbour lands on its name.
      .force('collide', forceCollide<SimNode>((n) => (n.center ? n.r + 26 : n.r + 8)))
      // Gravity, so a node with one link does not drift to the rim.
      .force('x', forceX<SimNode>(0).strength(0.04))
      .force('y', forceY<SimNode>(0).strength(0.04))
      .stop()
      .on('tick', () => {
        this.contain();
        this.paint();
      });
  }

  /** Tick to rest before anything paints, then fit the rest state to the frame. */
  private settle(): void {
    const sim = this.sim!;
    sim.tick(Math.ceil(Math.log(sim.alphaMin()) / Math.log(1 - sim.alphaDecay())));

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const n of this.nodes) {
      minX = Math.min(minX, n.x!);
      maxX = Math.max(maxX, n.x!);
      minY = Math.min(minY, n.y!);
      maxY = Math.max(maxY, n.y!);
    }
    this.scale = Math.min((W - PAD * 2) / Math.max(maxX - minX, 1), (H - PAD - PAD_TOP) / Math.max(maxY - minY, 1), 2.4);
    // Recentre on the bounds, not the origin: the centre node is pinned at 0,
    // but its neighbourhood may lean one way. Then drop the drawing by half
    // the extra top padding, so the controls' band starts empty.
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2 - (PAD_TOP - PAD) / 2 / this.scale;
    for (const n of this.nodes) {
      n.x! -= cx;
      n.y! -= cy;
      if (n.center) {
        n.fx = n.x;
        n.fy = n.y;
      }
    }
    // The gravity wells move with the drawing, or a re-heat would pull the
    // whole graph back toward the old origin.
    (sim.force('x') as ForceX<SimNode>).x(-cx);
    (sim.force('y') as ForceY<SimNode>).y(-cy);
  }

  // -------------------------------------------------------------------------
  // View
  // -------------------------------------------------------------------------

  private render(): void {
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('class', 'bcn-entity-graph__svg');
    svg.setAttribute('viewBox', `${-W / 2} ${-H / 2} ${W} ${H}`);
    svg.setAttribute('role', 'group');
    svg.setAttribute('aria-label', this.getAttribute('label') ?? 'Connections');
    if (this.nodes.length <= LABEL_ALL) svg.dataset.labelAll = '';

    const viewport = document.createElementNS(SVG, 'g');
    const linkLayer = document.createElementNS(SVG, 'g');
    linkLayer.setAttribute('class', 'bcn-entity-graph__links');
    linkLayer.setAttribute('aria-hidden', 'true');
    const nodeLayer = document.createElementNS(SVG, 'g');
    nodeLayer.setAttribute('class', 'bcn-entity-graph__nodes');

    for (const link of this.links) {
      const line = document.createElementNS(SVG, 'line');
      line.setAttribute('class', 'bcn-entity-graph__link');
      link.el = line;
      linkLayer.append(line);
    }

    const kindName = (kind: string): string => this.dataset[`kind${kind[0].toUpperCase()}${kind.slice(1)}`] ?? kind;

    for (const node of this.nodes) {
      const linked = Boolean(node.href) && !node.center;
      const g = document.createElementNS(SVG, linked ? 'a' : 'g') as SVGGElement;
      g.setAttribute('class', 'bcn-entity-graph__node');
      g.dataset.kind = node.kind;
      g.dataset.id = node.id;
      if (node.center) g.dataset.center = '';
      const name = `${node.label}, ${kindName(node.kind).toLowerCase()}`;
      if (linked) {
        g.setAttribute('href', node.href!);
        g.setAttribute('aria-label', name);
      } else {
        // The centre is this page — a link to itself would be a dead end — and
        // a record with no page has nowhere to go. Both stay named, not focusable.
        g.setAttribute('role', 'img');
        g.setAttribute('aria-label', node.center ? `${name} (this page)` : name);
      }

      const title = document.createElementNS(SVG, 'title');
      title.textContent = node.label;
      // The disc is as small as 9px; the target is never under 24px (SC 2.5.8).
      const hit = document.createElementNS(SVG, 'circle');
      hit.setAttribute('class', 'bcn-entity-graph__hit');
      hit.setAttribute('r', String(Math.max(12, node.r + 3)));
      const disc = document.createElementNS(SVG, 'circle');
      disc.setAttribute('class', 'bcn-entity-graph__disc');
      disc.setAttribute('r', String(node.r));
      const label = document.createElementNS(SVG, 'text');
      label.setAttribute('class', 'bcn-entity-graph__label');
      label.setAttribute('y', String(node.r + 13));
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('aria-hidden', 'true');
      label.textContent = truncate(node.label);

      g.append(title, hit, disc, label);
      node.el = g;
      node.text = label;
      nodeLayer.append(g);
    }

    viewport.append(linkLayer, nodeLayer);
    svg.append(viewport);
    this.svg = svg;
    this.viewport = viewport;
    this.append(svg);
    this.paint();
    this.wire();
  }

  /**
   * Keep every node inside the frame. Runs after each tick integrates — a
   * dragged node, and the neighbours it pulls, stop at the edge instead of
   * leaving the drawing. The bottom margin leaves room for the label.
   */
  private contain(): void {
    const s = this.scale;
    for (const n of this.nodes) {
      const x = Math.min(Math.max(n.x! * s, -W / 2 + n.r + 4), W / 2 - n.r - 4) / s;
      const y = Math.min(Math.max(n.y! * s, -H / 2 + n.r + 4), H / 2 - n.r - 20) / s;
      n.x = x;
      n.y = y;
      if (n.fx != null) n.fx = x;
      if (n.fy != null) n.fy = y;
    }
  }

  private paint(): void {
    const s = this.scale;
    for (const { source: a, target: b, el } of this.links) {
      el!.setAttribute('x1', (a.x! * s).toFixed(1));
      el!.setAttribute('y1', (a.y! * s).toFixed(1));
      el!.setAttribute('x2', (b.x! * s).toFixed(1));
      el!.setAttribute('y2', (b.y! * s).toFixed(1));
    }
    for (const n of this.nodes) {
      const x = n.x! * s;
      n.el!.setAttribute('transform', `translate(${x.toFixed(1)} ${(n.y! * s).toFixed(1)})`);
      // A label is centred under its disc unless that would cross the frame's
      // edge — then it slides inward just far enough, so a node on the rim is
      // still read whole. Measured once; a label first drawn in a hidden panel
      // measures 0, so it is estimated from its length until it can be.
      if (!n.textWidth) n.textWidth = n.text!.getComputedTextLength() || n.text!.textContent!.length * 6.6;
      const half = n.textWidth / 2;
      const edge = W / 2 - 2;
      const shift = Math.min(Math.max(x, -edge + half), edge - half) - x;
      n.text!.setAttribute('x', shift.toFixed(1));
    }
  }

  /** Light the node and its neighbours; dim everything else. */
  private highlight(id: string | null): void {
    const svg = this.svg!;
    if (!id) {
      delete svg.dataset.active;
      svg.querySelectorAll('[data-lit]').forEach((el) => el.removeAttribute('data-lit'));
      return;
    }
    const near = this.neighbours.get(id) ?? new Set();
    svg.dataset.active = '';
    for (const n of this.nodes) n.el!.toggleAttribute('data-lit', n.id === id || near.has(n.id));
    for (const l of this.links) l.el!.toggleAttribute('data-lit', l.source.id === id || l.target.id === id);
  }

  private wire(): void {
    const svg = this.svg!;
    const sim = this.sim!;
    const nodeOf = (target: EventTarget | null): SimNode | undefined => {
      const el = (target as Element | null)?.closest?.<SVGGElement>('.bcn-entity-graph__node');
      return el ? this.nodes.find((n) => n.el === el) : undefined;
    };

    svg.addEventListener('pointerover', (e) => {
      if (!this.dragging) this.highlight(nodeOf(e.target)?.id ?? null);
    });
    svg.addEventListener('pointerleave', () => {
      if (!this.dragging) this.highlight(null);
    });
    svg.addEventListener('focusin', (e) => this.highlight(nodeOf(e.target)?.id ?? null));
    svg.addEventListener('focusout', () => this.highlight(null));

    // ---- drag (d3-drag) ----
    // The subject is the node in DRAWN coordinates (fit scale applied), so the
    // pointer and the disc stay together; the simulation is told in its own.
    // The container is the node layer, inside the zoomed viewport, so a drag
    // at any zoom tracks the pointer.
    const s = this.scale;
    const dragger = drag<SVGGElement, SimNode>()
      .clickDistance(4)
      .subject((_, d) => ({ x: d.x! * s, y: d.y! * s }))
      .on('start', (event, d) => {
        this.dragging = true;
        svg.dataset.dragging = '';
        this.highlight(d.id);
        if (!event.active && !reducedMotion()) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x / s;
        d.fy = event.y / s;
        if (reducedMotion()) {
          d.x = d.fx;
          d.y = d.fy;
          this.contain();
          this.paint();
        }
      })
      .on('end', (event, d) => {
        this.dragging = false;
        delete svg.dataset.dragging;
        if (!event.active) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
    select(this.viewport!)
      .selectAll<SVGGElement, SimNode>('.bcn-entity-graph__node:not([data-center])')
      .data(this.nodes.filter((n) => !n.center))
      .call(dragger);

    // ---- zoom & pan (d3-zoom) ----
    this.zoomer = zoom<SVGSVGElement, unknown>()
      .scaleExtent([ZOOM_MIN, ZOOM_MAX])
      // Pan only as far as the drawing reaches: at the fitted view there is
      // nothing to pan to, and zoomed in, the frame's edge stops at the
      // drawing's edge — the graph can never be dragged out of its frame.
      .extent([[-W / 2, -H / 2], [W / 2, H / 2]])
      .translateExtent([[-W / 2, -H / 2], [W / 2, H / 2]])
      .filter((event: Event) => {
        if (event.type === 'wheel') return (event as WheelEvent).ctrlKey || (event as WheelEvent).metaKey;
        // Pan from empty space only; a press on a node belongs to the drag.
        return !nodeOf(event.target) && !(event as MouseEvent).button;
      })
      .on('zoom', (event: { transform: ZoomTransform }) => {
        this.viewport!.setAttribute('transform', event.transform.toString());
        svg.toggleAttribute('data-zoomed', event.transform.k >= LABEL_ZOOM);
      });
    select(svg).call(this.zoomer).on('dblclick.zoom', null);
  }
}

if (!customElements.get('bcn-entity-graph')) {
  customElements.define('bcn-entity-graph', BcnEntityGraph);
}
