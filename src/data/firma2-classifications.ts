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
// NOT HERE, on purpose: how a project's page is built (its PROJECT TYPE —
// src/data/firma2-project-types.ts, optional for a workspace) and functional
// labels with no KPIs (TAGS — src/data/firma2-tags.ts).

import type { ClassificationName, Project } from './firma2-projects';

// ---------------------------------------------------------------------------
// Groups
// ---------------------------------------------------------------------------

export interface ClassificationGroup {
  slug: string;
  name: string;
  description: string;
}

export const CLASSIFICATION_GROUPS: ClassificationGroup[] = [
  { slug: 'plan-goal', name: 'Plan goal', description: 'The plan outcomes a project works toward.' },
  { slug: 'channels-and-fish-passage', name: 'Channels & fish passage', description: 'Work in the stream channel: opening passage, adding habitat, giving high flows room.' },
  { slug: 'vegetation-and-wetlands', name: 'Vegetation & wetlands', description: 'Planting and weeding along streams, and rewetting meadows and marshes.' },
  { slug: 'forests-and-fuels', name: 'Forests & fuels', description: 'Thinning, fuel breaks and burning that change how fire moves through a forest.' },
  { slug: 'runoff-and-groundwater', name: 'Runoff & groundwater', description: 'Holding soil in place, catching storm runoff, and putting water back underground.' },
];

/**
 * The groups that are areas of work, each holding its practices. Sample-data
 * convention, not a model concept: it tells the map which groups make up its
 * "Practice area" colouring.
 */
export const PRACTICE_AREA_GROUPS = ['channels-and-fish-passage', 'vegetation-and-wetlands', 'forests-and-fuels', 'runoff-and-groundwater'];

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
  /** A CLASSIFICATION_GROUPS slug. */
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
export const CLASSIFICATIONS: Classification[] = [
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

export const getClassification = (slug: string): Classification | undefined => CLASSIFICATIONS.find((c) => c.slug === slug);

export const classificationNamed = (name: string): Classification | undefined => CLASSIFICATIONS.find((c) => c.name === name);

export const classificationsInGroup = (group: string): Classification[] => CLASSIFICATIONS.filter((c) => c.group === group);

/** A project's first classification in a group, for one-value-per-project views (map colours). */
export const classificationInGroup = (project: Pick<Project, 'classifications'>, group: string): ClassificationName | undefined =>
  project.classifications.find((n) => classificationNamed(n)?.group === group);

/** The practice-area group a project's first practice sits in, for one-value-per-project views (map colours). */
export const practiceAreaOf = (project: Pick<Project, 'classifications'>): string | undefined => {
  const group = project.classifications.map((n) => classificationNamed(n)?.group).find((g) => g && PRACTICE_AREA_GROUPS.includes(g));
  return CLASSIFICATION_GROUPS.find((g) => g.slug === group)?.name;
};
