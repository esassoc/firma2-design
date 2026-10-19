// entity-graph — the one-hop neighbourhood of any record, as nodes and links.
// Backs the Connections rail (firma2-entity-connections → bcn-entity-graph):
// the Obsidian "local graph" for a project, a classification, a performance
// measure or an organization (user, 2026-10-09).
//
// ONE HOP, BY DECISION (user, 2026-10-09). The graph holds the record and
// every record it links to directly — no depth control. What keeps that from
// drawing a star is the second pass: links AMONG the neighbours are drawn too,
// so on a classification the projects that report one of its measures are
// tied to that measure, and the clusters a reader came to see appear on their
// own. Nothing two hops out is added to get them.
//
// THE LINKS ARE THE DATA'S OWN, never inferred:
//   project ↔ classification   project.classifications
//   project ↔ measure          a detail row's `kpi` (the catalog slug)
//   project ↔ organization     lead organization, and every funding source's body
//   project ↔ tag              project.tags
//   measure ↔ classification   measure.classifications (its goals)
// A classification's funders are not a link — they reach it only through its
// projects, which is two hops.
//
// HREFS ARE BUILD-TIME AND ALREADY BASED (withBase), so the element can drop
// them straight into its anchors. A node with no reading page carries none:
// tags have no page of their own, and an organization that is not one of the
// reader's opens its Workspace settings record instead.
import { projects, projectSlug, projectHref } from '../data/firma2-projects';
import type { Project } from '../data/firma2-projects';
import { getProjectDetail } from '../data/firma2-project-detail';
import { CLASSIFICATIONS, classificationNamed } from '../data/firma2-classifications';
import type { Classification } from '../data/firma2-classifications';
import { classificationHref } from '../data/firma2-classification-rollup';
import { measures, measureDisplayName } from '../data/firma2-performance-measures';
import type { PerformanceMeasureDefinition } from '../data/firma2-performance-measures';
import { organizationSlug } from '../data/firma2-directory';
import { organizationPageHref } from '../data/firma2-organization-pages';
import { CURRENT_USER_ORGANIZATIONS } from '../data/firma2-directory';
import { measurePageHref } from './measure-pages';
import { withBase } from './base';

export type EntityKind = 'project' | 'classification' | 'measure' | 'organization' | 'tag';

export interface GraphNode {
  /** `<kind>:<key>` — unique across kinds, stable build to build. */
  id: string;
  kind: EntityKind;
  label: string;
  /** Based and ready for an anchor; absent when the record has no page. */
  href?: string;
  /** The record the page is about. Exactly one node carries it. */
  center?: boolean;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface EntityGraph {
  nodes: GraphNode[];
  links: GraphLink[];
}

/** The order kinds are listed in, and the singular/plural each is read as. */
export const ENTITY_KINDS: { kind: EntityKind; one: string; many: string }[] = [
  { kind: 'project', one: 'Project', many: 'Projects' },
  { kind: 'classification', one: 'Classification', many: 'Classifications' },
  { kind: 'measure', one: 'Performance measure', many: 'Performance measures' },
  { kind: 'organization', one: 'Organization', many: 'Organizations' },
  { kind: 'tag', one: 'Tag', many: 'Tags' },
];

// ---------------------------------------------------------------------------
// Nodes
// ---------------------------------------------------------------------------

const readerOrgs = new Set(CURRENT_USER_ORGANIZATIONS);

const projectNode = (p: Project): GraphNode => ({
  id: `project:${projectSlug(p)}`,
  kind: 'project',
  label: p.projectName,
  href: withBase(projectHref(p)),
});

const classificationNode = (c: Classification): GraphNode => ({
  id: `classification:${c.slug}`,
  kind: 'classification',
  label: c.name,
  href: withBase(classificationHref(c.slug)),
});

const measureNode = (m: PerformanceMeasureDefinition): GraphNode => ({
  id: `measure:${m.slug}`,
  kind: 'measure',
  label: measureDisplayName(m),
  href: withBase(measurePageHref(m.slug)),
});

const organizationNode = (name: string): GraphNode => {
  const slug = organizationSlug(name);
  return {
    id: `organization:${slug}`,
    kind: 'organization',
    label: name,
    href: withBase(
      readerOrgs.has(name) ? organizationPageHref(slug) : `/prototypes/workspace-settings/organizations/${slug}`,
    ),
  };
};

const tagNode = (name: string): GraphNode => ({
  id: `tag:${name}`,
  kind: 'tag',
  label: name,
});

// ---------------------------------------------------------------------------
// Every record's direct links, once
// ---------------------------------------------------------------------------

const measureBySlug = new Map(measures.map((m) => [m.slug, m]));

/** Every node a project links to — the one record type that links to all kinds. */
const projectNeighbours = (p: Project): GraphNode[] => {
  const detail = getProjectDetail(p);
  const out: GraphNode[] = [];
  for (const name of p.classifications) {
    const c = classificationNamed(name);
    if (c) out.push(classificationNode(c));
  }
  for (const row of detail.measures) {
    const m = row.kpi ? measureBySlug.get(row.kpi) : undefined;
    if (m && m.status !== 'Retired') out.push(measureNode(m));
  }
  out.push(organizationNode(p.leadOrganization));
  for (const source of detail.funding) out.push(organizationNode(source.organization));
  for (const tag of p.tags) out.push(tagNode(tag));
  return out;
};

const key = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`);

/**
 * Every link in the workspace, as unordered pairs. Built once per build: the
 * projects carry all but one kind of link, and the catalog carries the last
 * (a measure's goals).
 */
const ALL_LINKS: Set<string> = (() => {
  const links = new Set<string>();
  for (const p of projects) {
    const from = projectNode(p).id;
    for (const n of projectNeighbours(p)) links.add(key(from, n.id));
  }
  for (const m of measures) {
    if (m.status === 'Retired') continue;
    for (const name of m.classifications) {
      const c = classificationNamed(name);
      if (c) links.add(key(`measure:${m.slug}`, `classification:${c.slug}`));
    }
  }
  return links;
})();

// ---------------------------------------------------------------------------
// The graph for one record
// ---------------------------------------------------------------------------

const assemble = (center: GraphNode, neighbours: GraphNode[]): EntityGraph => {
  const byId = new Map<string, GraphNode>([[center.id, { ...center, center: true }]]);
  for (const n of neighbours) if (!byId.has(n.id)) byId.set(n.id, n);

  const order = new Map(ENTITY_KINDS.map((k, i) => [k.kind, i]));
  const nodes = [...byId.values()].sort(
    (a, b) =>
      Number(Boolean(b.center)) - Number(Boolean(a.center)) ||
      order.get(a.kind)! - order.get(b.kind)! ||
      a.label.localeCompare(b.label),
  );

  // Every pair in the set that the workspace links — the centre's spokes and
  // the ties among its neighbours alike.
  const links: GraphLink[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (ALL_LINKS.has(key(nodes[i].id, nodes[j].id))) links.push({ source: nodes[i].id, target: nodes[j].id });
    }
  }
  return { nodes, links };
};

export const projectGraph = (p: Project): EntityGraph => assemble(projectNode(p), projectNeighbours(p));

export const classificationGraph = (c: Classification): EntityGraph => {
  const neighbours: GraphNode[] = [
    ...measures.filter((m) => m.status !== 'Retired' && m.classifications.includes(c.name)).map(measureNode),
    ...projects.filter((p) => p.classifications.includes(c.name)).map(projectNode),
  ];
  return assemble(classificationNode(c), neighbours);
};

export const measureGraph = (m: PerformanceMeasureDefinition): EntityGraph => {
  const neighbours: GraphNode[] = [
    ...CLASSIFICATIONS.filter((c) => m.classifications.includes(c.name)).map(classificationNode),
    ...projects.filter((p) => getProjectDetail(p).measures.some((row) => row.kpi === m.slug)).map(projectNode),
  ];
  return assemble(measureNode(m), neighbours);
};

export const organizationGraph = (name: string): EntityGraph => {
  const neighbours = projects
    .filter((p) => p.leadOrganization === name || getProjectDetail(p).funding.some((s) => s.organization === name))
    .map(projectNode);
  return assemble(organizationNode(name), neighbours);
};
