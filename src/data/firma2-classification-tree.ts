// The classification tree as the Classifications index reads it: every group
// and classification with its counts, and each classification's performance
// measures against their targets. Both of the index's views (Outline and
// Browse) are drawn from it, so they cannot disagree.
//
// Every figure comes from the roll-ups in firma2-classification-rollup.ts;
// this module only shapes them into a tree.

import { seededIcon } from './firma2-classification-icons';
import { childGroups, classificationsInGroup, groupPath, listColorOf } from './firma2-classifications';
import type { Classification, ClassificationGroup } from './firma2-classifications';
import { classificationGroupHref, classificationHref, rollupClassification, rollupGroup } from './firma2-classification-rollup';
import type { KpiProgress } from './firma2-classification-rollup';
import { kpiRowView } from '../lib/kpi-row';
import { withBase } from '../lib/base';

export interface MeasureLine {
  name: string;
  /** The props firma2-kpi-progress takes, so a view can draw the real row. */
  input: { unit: string; decimals: number; reported: number | null; committed: number | null; goal?: number; goalYear?: number; additive: boolean };
  /** 0–100 of the target (of the plan, with no target). */
  percent: number;
  plannedPercent: number;
  /** "14.5 of 30 miles goal". */
  total: string;
  /** "48%", "No goal", "Not reported". */
  share: string;
}

export interface ClassificationNode {
  kind: 'classification';
  slug: string;
  name: string;
  color: string;
  iconPaths?: string;
  description: string;
  href: string;
  /** Its groups, outermost first. */
  path: string[];
  projects: number;
  funders: number;
  measures: MeasureLine[];
}

export interface GroupNode {
  kind: 'group';
  slug: string;
  name: string;
  color: string;
  iconPaths?: string;
  description: string;
  href: string;
  depth: number;
  path: string[];
  projects: number;
  funders: number;
  /** Every classification beneath it, at any depth. */
  total: number;
  /** The distinct performance measures of those classifications. */
  measureCount: number;
  classifications: ClassificationNode[];
  groups: GroupNode[];
}

const line = (k: KpiProgress): MeasureLine => {
  const input = {
    unit: k.unit,
    decimals: k.measure.decimalPlaces,
    reported: k.reported,
    committed: k.committed,
    goal: k.goal?.value,
    goalYear: k.goal?.year,
    additive: k.additive,
  };
  const v = kpiRowView({ ...input, from: [] });
  return {
    name: k.measure.name,
    input,
    percent: v.percent,
    plannedPercent: v.plannedPercent,
    total: v.totalText,
    share: v.share.text,
  };
};

const classificationNode = (c: Classification): ClassificationNode => {
  const rollup = rollupClassification(c);
  const measures = rollup.kpis.map(line);
  return {
    kind: 'classification',
    slug: c.slug,
    name: c.name,
    // Its group's colour: this tree is only ever drawn as a list.
    color: listColorOf(c),
    iconPaths: seededIcon(c.name)?.iconPaths,
    description: c.description,
    href: withBase(classificationHref(c.slug)),
    path: groupPath(c.group).map((g) => g.name),
    projects: rollup.projects.length,
    funders: rollup.funders,
    measures,
  };
};

const groupNode = (g: ClassificationGroup, depth: number): GroupNode => {
  const rollup = rollupGroup(g);
  return {
    kind: 'group',
    slug: g.slug,
    name: g.name,
    color: g.color,
    iconPaths: seededIcon(g.slug)?.iconPaths,
    description: g.description,
    href: withBase(classificationGroupHref(g.slug)),
    depth,
    path: groupPath(g.slug).map((x) => x.name),
    projects: rollup.projects.length,
    funders: rollup.funders,
    total: rollup.classifications.length,
    measureCount: rollup.kpis.length,
    classifications: classificationsInGroup(g.slug).map(classificationNode),
    groups: childGroups(g.slug).map((child) => groupNode(child, depth + 1)),
  };
};

/** The top-level groups, each with everything beneath it. */
export const tree = (): GroupNode[] => childGroups().map((g) => groupNode(g, 0));

/** Every group, parents before their children. */
export const flatGroups = (nodes: GroupNode[] = tree()): GroupNode[] => nodes.flatMap((g) => [g, ...flatGroups(g.groups)]);

export const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;
