// Classifications — the initiative's goals, and how progress toward each is
// tracked. A classification is usually a goal ("Salmon & steelhead recovery");
// the noun stays general because a tenant can also group by other axes, a
// species for example (user, 2026-10-03). Projects carry one or more, and the
// catalog measures that list a classification are its KPIs — see
// src/data/firma2-classification-rollup.ts for how progress adds up.
//
// GROUPS SORT IT, they do not split it. A classification belongs to one
// classification group; a project may carry any mix across groups. Groups
// exist so a long vocabulary scans, and so a map or a filter can ask "which
// goal?" without a second data model.
//
// GROUPS ALSO CARRY A TENANT'S OWN HIERARCHY. A two-level taxonomy (an area
// of work, the practices within it) needs no new model: each area is a
// group, each practice a classification in it (user, 2026-10-03). A practice
// may have KPIs or none — a classification with none is a filing label that
// still opens a page of its projects. Nothing limits a project to one
// practice, or to one area: a single-leaf rule was a limit of the old
// product, not a need. The PRACTICE AREAS below are the invented sample of
// that shape; the map colours by them.
//
// GROUPS NEST, TO ANY DEPTH (user, 2026-11-23). A group may sit inside
// another (`parent`), so a taxonomy of three or four levels is one tree. A
// group carries its own colour and description and has its own progress page,
// which adds up everything filed beneath it. PROJECTS ARE FILED ON
// CLASSIFICATIONS ONLY — the leaves; a group's projects are the projects of
// the classifications under it, so no project sits "in the group but in none
// of its children". A group has no measures or targets of its own.
//
// THE TREE IS FREE (user, 2026-11-23). A group may hold groups and
// classifications together, groups may be nested and moved without limit
// (never inside themselves), and a classification may sit in a group or in
// none. Projects are still filed on classifications only. Declared levels, a
// uniform depth and a groups-or-classifications rule were each built and
// withdrawn the same day: each stopped a move a person arranging a taxonomy
// expected to make.
//
// NOT HERE, on purpose: how a project's page is built (its PROJECT TYPE —
// src/data/firma2-project-types.ts, optional for a workspace). Functional
// labels with no KPIs were Tags, removed from the product 2026-11-24.

import type { ClassificationName, Project } from './firma2-projects';
import { REAL, realRecords, realSystems, slugOf } from './firma2-real-data';

// ---------------------------------------------------------------------------
// Groups
// ---------------------------------------------------------------------------

export interface ClassificationGroup {
  slug: string;
  name: string;
  description: string;
  /** The swatch that tells two groups apart at a glance. */
  color: string;
  /** The group this one sits inside. Absent at the top level. */
  parent?: string;
}

// Invented sample: a top-level group of classifications (Plan goal), and a
// top-level group of groups, each holding classifications (Practice area).
// An empty group is not seeded — adding one in Workspace settings shows that
// state.
const MOCK_GROUPS: ClassificationGroup[] = [
  { slug: 'plan-goal', name: 'Plan goal', color: '#3c5fa8', description: 'The plan outcomes a project works toward.' },
  { slug: 'practice-area', name: 'Practice area', color: '#646464', description: 'The kinds of work a project does on the ground.' },
  { slug: 'channels-and-fish-passage', parent: 'practice-area', name: 'Channels & fish passage', color: '#b4432f', description: 'Work in the stream channel: opening passage, adding habitat, giving high flows room.' },
  { slug: 'vegetation-and-wetlands', parent: 'practice-area', name: 'Vegetation & wetlands', color: '#2f8f6b', description: 'Planting and weeding along streams, and rewetting meadows and marshes.' },
  { slug: 'forests-and-fuels', parent: 'practice-area', name: 'Forests & fuels', color: '#5f7a3a', description: 'Thinning, fuel breaks and burning that change how fire moves through a forest.' },
  { slug: 'runoff-and-groundwater', parent: 'practice-area', name: 'Runoff & groundwater', color: '#3c5fa8', description: 'Holding soil in place, catching storm runoff, and putting water back underground.' },
];

// A REAL WORKSPACE'S OWN TREE (dev only — firma2-real-data.ts). ProjectFirma
// files a project on one taxonomy leaf under a branch, and in any number of
// classification systems. Here the taxonomy is one group whose child groups
// are the branches, and each system is a top-level group. The tenant's public
// data carries no descriptions or colours; the colours are dealt in order.
const REAL_SWATCHES = ['#3c5fa8', '#b4432f', '#2f8f6b', '#d08a1e', '#56708a', '#a24d86', '#167a7a', '#8a5a2b', '#7a8a2a', '#2b88b8', '#c4473a', '#5f7a3a', '#8c6d4f', '#6a5aa8'];
const swatch = (i: number): string => REAL_SWATCHES[i % REAL_SWATCHES.length];
const REAL_TAXONOMY = 'taxonomy';
const realBranches = (): string[] => Array.from(new Set([...realRecords.values()].map((r) => r.taxonomyBranch))).sort();

const REAL_GROUPS: ClassificationGroup[] = [
  { slug: REAL_TAXONOMY, name: 'Ecological concern', color: '#646464', description: '' },
  ...realBranches().map((name, i) => ({ slug: slugOf(name), parent: REAL_TAXONOMY, name, color: swatch(i), description: '' })),
  ...realSystems().map((name, i) => ({ slug: slugOf(name), name, color: swatch(i + 3), description: '' })),
];

export const CLASSIFICATION_GROUPS: ClassificationGroup[] = REAL ? REAL_GROUPS : MOCK_GROUPS;

export const getClassificationGroup = (slug: string): ClassificationGroup | undefined => CLASSIFICATION_GROUPS.find((g) => g.slug === slug);

/** The groups directly inside a group; with no argument, the top-level groups. */
export const childGroups = (parent?: string): ClassificationGroup[] => CLASSIFICATION_GROUPS.filter((g) => (g.parent ?? '') === (parent ?? ''));

/** A group's ancestors and then itself, outermost first. */
export const groupPath = (slug: string): ClassificationGroup[] => {
  const path: ClassificationGroup[] = [];
  for (let g = getClassificationGroup(slug); g && !path.includes(g); g = g.parent ? getClassificationGroup(g.parent) : undefined) path.unshift(g);
  return path;
};

/** A group's slug and the slug of every group beneath it. */
export const groupAndDescendants = (slug: string): string[] => [slug, ...childGroups(slug).flatMap((g) => groupAndDescendants(g.slug))];

/**
 * The areas of work: the groups directly inside Practice area. Sample-data
 * convention, not a model concept: it tells the map which groups make up its
 * "Practice area" colouring.
 */
export const PRACTICE_GROUP = REAL ? REAL_TAXONOMY : 'practice-area';
export const PRACTICE_AREA_GROUPS = childGroups(PRACTICE_GROUP).map((g) => g.slug);

/**
 * The group whose classifications are the workspace's goals — what the public
 * pages, the map and the dashboards mean by "goal". In a real workspace (dev
 * only) the taxonomy is both this and the practice tree: its limiting factors
 * are the only classifications that track measures.
 */
export const GOAL_GROUP = REAL ? REAL_TAXONOMY : 'plan-goal';

// ---------------------------------------------------------------------------
// Classifications
// ---------------------------------------------------------------------------

/**
 * What the initiative means to reach on one KPI, set on the classification —
 * not the sum of what its projects promised. The two differ on purpose: a goal
 * whose projects commit less than its target is under-planned, and that gap is
 * exactly what an index of goals has to be able to show.
 */
export interface GoalTarget {
  /** A catalog measure slug that lists this classification. */
  measure: string;
  value: number;
  /** The year the goal is due. */
  year: number;
}

export interface Classification {
  slug: string;
  name: ClassificationName;
  /** A CLASSIFICATION_GROUPS slug, or '' for a classification in no group. */
  group: string;
  /** The swatch that tells two classifications apart at a glance. */
  color: string;
  description: string;
  /** Goal targets, one per KPI at most. A KPI without one tracks without a goal line. */
  targets?: GoalTarget[];
}

// What the initiative set out to reach on each goal's KPIs. Invented, and
// deliberately uneven: some goals are ahead of their projects' promises, some
// behind, and a few KPIs carry no target at all.
const GOAL_TARGETS: Partial<Record<ClassificationName, GoalTarget[]>> = {
  'Salmon & steelhead recovery': [
    { measure: 'fish-passage-barriers-removed', value: 12, year: 2030 },
    { measure: 'stream-miles-reopened', value: 25, year: 2030 },
    { measure: 'stream-miles-instream-habitat', value: 30, year: 2030 },
    { measure: 'acres-floodplain-habitat', value: 1000, year: 2032 },
  ],
  'Riparian & wetland habitat': [
    { measure: 'acres-riparian-habitat-restored', value: 500, year: 2030 },
    { measure: 'native-plants-installed', value: 25000, year: 2030 },
    { measure: 'acres-wetland-meadow-restored', value: 1500, year: 2035 },
    { measure: 'plant-survival-rate', value: 80, year: 2030 },
  ],
  'Water quality': [
    { measure: 'tons-sediment-prevented', value: 1000, year: 2030 },
    { measure: 'miles-road-decommissioned', value: 40, year: 2032 },
    { measure: 'stormwater-captured', value: 150, year: 2030 },
  ],
  'Water supply reliability': [
    { measure: 'water-supply-gained', value: 5000, year: 2035 },
    { measure: 'stream-miles-floodplain-reconnected', value: 10, year: 2035 },
  ],
  'Wildfire resilience': [
    { measure: 'acres-forest-fuels-reduction-treatment', value: 10000, year: 2030 },
    { measure: 'miles-fuel-break', value: 30, year: 2030 },
  ],
  'Flood risk reduction': [
    { measure: 'acres-floodplain-habitat', value: 1500, year: 2035 },
    { measure: 'miles-levee-setback', value: 5, year: 2035 },
  ],
  'Public access & recreation': [{ measure: 'miles-trail-opened', value: 5, year: 2030 }],
};
const MOCK_CLASSIFICATIONS: Classification[] = [
  ...(
    [
      ['Salmon & steelhead recovery', '#c4473a', 'Spawning and rearing habitat for listed runs.'],
      ['Riparian & wetland habitat', '#2f8f6b', 'Streamside and wetland vegetation and the wildlife it holds.'],
      ['Water quality', '#2b88b8', 'Sediment, temperature, and nutrient loads.'],
      ['Water supply reliability', '#3c5fa8', 'Groundwater recharge and dry-year flows.'],
      ['Wildfire resilience', '#d08a1e', 'Fuel loads and fire behavior near communities and habitat.'],
      ['Flood risk reduction', '#56708a', 'Room for high water away from homes and roads.'],
      ['Public access & recreation', '#a24d86', 'Trails, river access, and places to learn.'],
    ] as [ClassificationName, string, string][]
  ).map(([name, color, description]) => ({
    slug: name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name,
    group: 'plan-goal',
    color,
    description,
    targets: GOAL_TARGETS[name],
  })),
  // Practices, by area. No targets: a practice's KPIs, when it has any, are
  // the catalog measures that list it.
  ...(
    [
      ['Barrier removal & fish screens', 'channels-and-fish-passage', '#b4432f', 'Culverts, dams and diversions that block or trap fish.'],
      ['Instream habitat structures', 'channels-and-fish-passage', '#8a5a2b', 'Large wood, boulders and gravel placed in the channel.'],
      ['Side channels & floodplains', 'channels-and-fish-passage', '#56708a', 'Ground lowered or levees set back so high water spreads out.'],
      ['Native planting', 'vegetation-and-wetlands', '#2f8f6b', 'Trees, shrubs and grasses planted along streams.'],
      ['Invasive plant removal', 'vegetation-and-wetlands', '#7a8a2a', 'Arundo, broom and other invaders cleared and retreated.'],
      ['Meadow & marsh rewetting', 'vegetation-and-wetlands', '#2b88b8', 'Water returned to meadows, springs and tidal marsh.'],
      ['Forest thinning', 'forests-and-fuels', '#5f7a3a', 'Small trees and brush cut by hand or machine.'],
      ['Fuel breaks', 'forests-and-fuels', '#d08a1e', 'Strips cleared so crews can hold a fire.'],
      ['Prescribed fire', 'forests-and-fuels', '#c4473a', 'Planned burns that clear ground fuel under set conditions.'],
      ['Erosion & sediment control', 'runoff-and-groundwater', '#8c6d4f', 'Banks, roads and slopes kept from washing into streams.'],
      ['Stormwater capture', 'runoff-and-groundwater', '#3c5fa8', 'Runoff held, slowed or cleaned before it reaches a stream.'],
      ['Groundwater recharge', 'runoff-and-groundwater', '#167a7a', 'Water spread or held so it soaks back into the aquifer.'],
    ] as [ClassificationName, string, string, string][]
  ).map(([name, group, color, description]) => ({
    slug: name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name,
    group,
    color,
    description,
  })),
];

const REAL_CLASSIFICATIONS: Classification[] = [
  // Limiting factors, each in its branch's group.
  ...Array.from(new Map([...realRecords.values()].filter((r) => r.taxonomyBranch).map((r) => [r.taxonomyLeaf, r.taxonomyBranch])))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, branch], i) => ({ slug: slugOf(name), name: name as ClassificationName, group: slugOf(branch), color: swatch(i), description: '' })),
  // Every other system's entries, in its own group.
  ...realSystems().flatMap((system) =>
    Array.from(new Set([...realRecords.values()].flatMap((r) => (r.classifications[system] ?? []).map((c) => c.name))))
      .sort()
      .map((name, i) => ({ slug: slugOf(name), name: name as ClassificationName, group: slugOf(system), color: swatch(i + 5), description: '' })),
  ),
];

export const CLASSIFICATIONS: Classification[] = REAL ? REAL_CLASSIFICATIONS : MOCK_CLASSIFICATIONS;

export const getClassification = (slug: string): Classification | undefined => CLASSIFICATIONS.find((c) => c.slug === slug);

/**
 * The colour a classification wears wherever it is LISTED under, or tagged
 * with, its group — the index's two views, a group's cards, the side panel:
 * its direct parent group's colour, so a branch reads as one thing (user,
 * 2026-11-23). Its own `color` is kept for the places that must tell the
 * classifications of one group apart: the map's colour-by, and charts.
 */
export const listColorOf = (c: Pick<Classification, 'group' | 'color'>): string => getClassificationGroup(c.group)?.color ?? c.color;

export const classificationNamed = (name: string): Classification | undefined => CLASSIFICATIONS.find((c) => c.name === name);

/** The classifications filed directly in a group. */
export const classificationsInGroup = (group: string): Classification[] => CLASSIFICATIONS.filter((c) => c.group === group);

/** Every classification in a group or in any group beneath it. */
export const classificationsUnderGroup = (group: string): Classification[] => {
  const within = groupAndDescendants(group);
  return CLASSIFICATIONS.filter((c) => within.includes(c.group));
};

/** A project's first classification in a group, for one-value-per-project views (map colours). */
export const classificationInGroup = (project: Pick<Project, 'classifications'>, group: string): ClassificationName | undefined => {
  const within = groupAndDescendants(group);
  return project.classifications.find((n) => within.includes(classificationNamed(n)?.group ?? ''));
};

/** The goals: every classification in the goal group or beneath it. */
export const goalClassifications = (): Classification[] => classificationsUnderGroup(GOAL_GROUP);

export const isGoal = (c: Pick<Classification, 'group'>): boolean => groupAndDescendants(GOAL_GROUP).includes(c.group);

/** The area of work a project's first practice sits under, for one-value-per-project views (map colours). */
export const practiceAreaOf = (project: Pick<Project, 'classifications'>): string | undefined => {
  for (const n of project.classifications) {
    const area = groupPath(classificationNamed(n)?.group ?? '').find((g) => PRACTICE_AREA_GROUPS.includes(g.slug));
    if (area) return area.name;
  }
  return undefined;
};
