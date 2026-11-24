// PROTOTYPE DATA — /proto/classifications-index. The classification tree as
// the three new variants read it: every group and classification with its
// counts and its performance measures against their targets. Throwaway;
// nothing in production imports it.
//
// Every figure comes from the production roll-ups, so the variants argue about
// layout, not about arithmetic. Statuses are facts on the record (a measure
// has a target or it does not), never a judgement of pace.

import { CLASSIFICATION_GROUPS, childGroups, classificationsInGroup, groupPath } from '../../data/firma2-classifications';
import type { Classification, ClassificationGroup } from '../../data/firma2-classifications';
import { classificationGroupHref, classificationHref, rollupClassification, rollupGroup } from '../../data/firma2-classification-rollup';
import type { KpiProgress } from '../../data/firma2-classification-rollup';
import { kpiRowView } from '../../lib/kpi-row';
import { withBase } from '../../lib/base';

export interface MeasureLine {
  name: string;
  /** The props firma2-kpi-progress takes, so a variant can draw the real row. */
  input: { unit: string; decimals: number; reported: number | null; committed: number | null; goal?: number; goalYear?: number; additive: boolean };
  /** 0–100 of the target (of the plan, with no target). */
  percent: number;
  plannedPercent: number;
  /** "14.5 of 30 miles goal". */
  total: string;
  /** "48%", "No goal", "Not reported". */
  share: string;
  hasTarget: boolean;
  reported: boolean;
  reached: boolean;
}

export type Status = 'no-measures' | 'missing-targets' | 'not-reported' | 'reached';

export interface ClassificationNode {
  kind: 'classification';
  slug: string;
  name: string;
  color: string;
  description: string;
  href: string;
  /** Its groups, outermost first. */
  path: string[];
  projects: number;
  funders: number;
  measures: MeasureLine[];
  statuses: Status[];
}

export interface GroupNode {
  kind: 'group';
  slug: string;
  name: string;
  color: string;
  description: string;
  href: string;
  depth: number;
  path: string[];
  projects: number;
  funders: number;
  /** Every classification beneath it, at any depth. */
  total: number;
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
    hasTarget: k.goal != null,
    reported: k.reported != null,
    reached: k.goal != null && k.reported != null && k.reported >= k.goal.value,
  };
};

const classificationNode = (c: Classification): ClassificationNode => {
  const rollup = rollupClassification(c);
  const measures = rollup.kpis.map(line);
  const statuses: Status[] = [];
  if (measures.length === 0) statuses.push('no-measures');
  if (measures.some((m) => !m.hasTarget)) statuses.push('missing-targets');
  if (measures.some((m) => !m.reported)) statuses.push('not-reported');
  if (measures.some((m) => m.reached)) statuses.push('reached');
  return {
    kind: 'classification',
    slug: c.slug,
    name: c.name,
    color: c.color,
    description: c.description,
    href: withBase(classificationHref(c.slug)),
    path: groupPath(c.group).map((g) => g.name),
    projects: rollup.projects.length,
    funders: rollup.funders,
    measures,
    statuses,
  };
};

const groupNode = (g: ClassificationGroup, depth: number): GroupNode => {
  const rollup = rollupGroup(g);
  return {
    kind: 'group',
    slug: g.slug,
    name: g.name,
    color: g.color,
    description: g.description,
    href: withBase(classificationGroupHref(g.slug)),
    depth,
    path: groupPath(g.slug).map((x) => x.name),
    projects: rollup.projects.length,
    funders: rollup.funders,
    total: rollup.classifications.length,
    classifications: classificationsInGroup(g.slug).map(classificationNode),
    groups: childGroups(g.slug).map((child) => groupNode(child, depth + 1)),
  };
};

/** The top-level groups, each with everything beneath it. */
export const tree = (): GroupNode[] => childGroups().map((g) => groupNode(g, 0));

/** Every group, parents before their children. */
export const flatGroups = (nodes: GroupNode[] = tree()): GroupNode[] => nodes.flatMap((g) => [g, ...flatGroups(g.groups)]);

/** Every classification, in tree order. */
export const allClassifications = (nodes: GroupNode[] = tree()): ClassificationNode[] =>
  nodes.flatMap((g) => [...g.classifications, ...allClassifications(g.groups)]);

export const STATUS_LABEL: Record<Status, string> = {
  'no-measures': 'No measures',
  'missing-targets': 'Missing targets',
  'not-reported': 'Not reported',
  reached: 'Target reached',
};

export const GROUP_COUNT = CLASSIFICATION_GROUPS.length;
export const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;
