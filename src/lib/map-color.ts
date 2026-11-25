// WHAT A PROJECT'S WORK WEARS ON A MAP. Every map paints a project's work
// areas, its pins and its zoomed-out dot in ONE colour, taken from something
// the project already has a colour for: its stage by default, or — the
// workspace's choice on Map layers — its project type or a classification
// group. "Fixed colors" is the older behaviour: every project alike, in the
// two colours picked on that page.
//
// THE COLOURS ARE NOT NEW ONES. A stage, a project type, a classification and
// a classification group each carry a colour an administrator already chose,
// and a reader has already met it beside the name. The map reuses it, so the
// green of "Implementation" in a list is the green of its work on the map.
//
// A CLASSIFICATION GROUP COLOURS BY WHAT SITS DIRECTLY INSIDE IT, groups or
// classifications (open question Q-156's proposed rule), and only top-level
// groups are offered. A project filed several times takes its first.
//
// Read through the browser's edit stores, so a colour changed on the Stages,
// Project types or Classifications page is the colour on the next paint.

import { projects, projectSlug } from '../data/firma2-projects';
import type { Project } from '../data/firma2-projects';
import { readStages } from './stage-draft';
import { entries, groupAndDescendants } from './taxonomy-edits';
import type { TaxonomyEntry } from './taxonomy-edits';
import { label as vocab } from './vocabulary';
import { readMapStyle } from './work-areas';

/** `stage`, `projectType`, `group:<classification group slug>`, or `none` (fixed colours). */
export type ColorBy = string;

export interface Tint {
  /** The value's name: a stage, a project type, a classification or a group. */
  label: string;
  color: string;
}

/** A project with no value on the chosen dimension: no type, or nothing filed in the group. */
const NEUTRAL = '#8d8d8d';

interface Tables {
  by: ColorBy;
  title: string;
  /** Every value the dimension has, in its own order, for a key. */
  order: string[];
  tintOf: (project: Project) => Tint;
}

const groupTables = (top: TaxonomyEntry): Pick<Tables, 'order' | 'tintOf'> => {
  const groups = entries('classificationGroup');
  const filed = entries('classification');
  const within = groupAndDescendants(top.slug);
  const direct = [...groups.filter((g) => g.group === top.slug), ...filed.filter((c) => c.group === top.slug)];
  const none: Tint = { label: 'Unclassified', color: NEUTRAL };
  return {
    order: [...direct.map((e) => e.name), none.label],
    tintOf: (project) => {
      for (const name of project.classifications) {
        const c = filed.find((e) => e.name === name);
        if (!c || !within.includes(c.group ?? '')) continue;
        if (c.group === top.slug) return { label: c.name, color: c.color ?? NEUTRAL };
        // Filed deeper: climb to the group that sits directly inside the top one.
        let g = groups.find((e) => e.slug === c.group);
        while (g && g.group !== top.slug) g = groups.find((e) => e.slug === g!.group);
        if (g) return { label: g.name, color: g.color ?? NEUTRAL };
      }
      return none;
    },
  };
};

const build = (by: ColorBy): Tables | null => {
  if (by === 'none') return null;
  if (by === 'projectType') {
    const types = entries('projectType');
    const none: Tint = { label: 'No type', color: NEUTRAL };
    return {
      by,
      title: vocab('Project type'),
      order: [...types.map((t) => t.name), none.label],
      tintOf: (p) => {
        const t = types.find((e) => e.name === p.projectType);
        return t ? { label: t.name, color: t.color ?? NEUTRAL } : none;
      },
    };
  }
  if (by.startsWith('group:')) {
    const top = entries('classificationGroup').find((g) => g.slug === by.slice(6) && !g.group);
    if (top) return { by, title: top.name, ...groupTables(top) };
  }
  // Stage, and the fallback when a saved group no longer exists.
  const stages = readStages();
  return {
    by: 'stage',
    title: vocab('Stage'),
    order: stages.map((s) => s.name),
    tintOf: (p) => {
      const s = stages.find((x) => x.key === p.stage);
      return { label: s?.name ?? p.stage, color: s?.color ?? NEUTRAL };
    },
  };
};

// One paint asks for hundreds of colours; the stores are read once per task.
const cache = new Map<ColorBy, Tables | null>();
const tables = (by: ColorBy): Tables | null => {
  if (!cache.has(by)) {
    if (cache.size === 0) setTimeout(() => cache.clear(), 0);
    cache.set(by, build(by));
  }
  return cache.get(by)!;
};

const bySlug = new Map(projects.map((p) => [projectSlug(p), p]));

/** What the workspace colours its maps by. */
export const colorBy = (): ColorBy => readMapStyle().colorBy;

/**
 * A project's value and colour on a dimension (the workspace's, unless given).
 * Null under fixed colours, and for a project this build does not know.
 */
export const projectTint = (slug: string, by: ColorBy = colorBy()): Tint | null => {
  const project = bySlug.get(slug);
  const t = tables(by);
  return project && t ? t.tintOf(project) : null;
};

/** The key for a set of projects: the dimension's name, and the values present, in its order. */
export const colorKey = (slugs: string[], by: ColorBy = colorBy()): { title: string; items: Tint[] } | null => {
  const t = tables(by);
  if (!t) return null;
  const present = new Map<string, Tint>();
  slugs.forEach((slug) => {
    const tint = projectTint(slug, by);
    if (tint) present.set(tint.label, tint);
  });
  return { title: t.title, items: t.order.filter((l) => present.has(l)).map((l) => present.get(l)!) };
};

/** The choices on Map layers: stage, project type, each top-level classification group, fixed colours. */
export const colorByOptions = (): { value: ColorBy; label: string }[] => [
  { value: 'stage', label: vocab('Stage') },
  { value: 'projectType', label: vocab('Project type') },
  ...entries('classificationGroup')
    .filter((g) => !g.group)
    .map((g) => ({ value: `group:${g.slug}`, label: g.name })),
  { value: 'none', label: 'Fixed colors' },
];

/** The saved choice, or stage when it names a group that is gone. */
export const resolvedColorBy = (): ColorBy => tables(colorBy())?.by ?? 'none';
