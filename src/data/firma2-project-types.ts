// Project types — a tenant's difference, expressed as data.
//
// WHERE THIS CAME FROM. ProjectFirma2's hackathon team 3 (Mission 3,
// "Customizations") answered "how does 2.0 flex without forking?" with one
// primitive: a PROJECT TYPE. A type says what its projects track (the
// tenant's own fields, and where on the page each one sits) and how their
// page is built (which sections, in what order). Their closing sentence:
// "a tenant's project pages are a data shape, not a fork."
//
// TWO TIERS, settled by the team and kept here:
//
//   tenant brand    one colour, every page               (firma2-tenant-brand)
//     └ project type  fields + section layout             (this module)
//
// No per-project tier: a project inherits its type's page entirely. One rule,
// one screen, one mental model.
//
// THE SECTION GRAMMAR IS A DELTA, as on the team's branch: a registry in code
// says what sections exist and their default order; a type records only what
// it changed — `{ order, hidden }`. A section added to the registry next
// release reaches every type somebody already configured, and a type that
// never opened the studio needs no row at all.
//
// REFINED FROM THE HACKATHON: field DEFINITIONS are tenant-wide and
// REFERENCED by types, never copied — the same rule this spoke's measures
// apply to subcategory schemas (docs/measure-model.md). The hackathon split
// defining a field (one screen) from placing it (another); here both happen
// on the type, with "add an existing field" and "define a new one" as two
// different acts, exactly as the measure sheet separates reusing a list from
// inventing one.
//
// IN THE MOCK, A PROJECT'S TYPE FOLLOWS ITS PROGRAM — this portfolio's
// programs happen to name kinds of work. That is a convenience of the
// fixture, not a claim that types and programs are the same thing.
//
// INVENTED CONTENT, deterministic: values come from a hash of the project
// name, never from randomness.

import type { Project } from './firma2-projects';

// ---------------------------------------------------------------------------
// Sections — the registry
// ---------------------------------------------------------------------------

export interface PageSection {
  key: string;
  label: string;
  /** Spatial content always closes the page — house style, not configurable. */
  pinnedLast?: boolean;
}

export const PAGE_SECTIONS: PageSection[] = [
  { key: 'details', label: 'Project details' },
  { key: 'measures', label: 'Performance measures' },
  { key: 'funding', label: 'Funding sources' },
  { key: 'expenditures', label: 'Expenditures' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'gallery', label: 'Photos' },
  { key: 'map', label: 'Work areas map', pinnedLast: true },
];

/** What a type changed about the registry. Absent keys mean "no opinion". */
export interface SectionsDelta {
  order?: string[];
  hidden?: string[];
}

/**
 * Fold a delta over the registry: the type's order first (unknown keys
 * dropped, so a retired section self-heals), then anything the type never
 * placed in registry order, then the pinned section last.
 */
export const resolveSections = (delta: SectionsDelta = {}): { section: PageSection; visible: boolean }[] => {
  const known = new Map(PAGE_SECTIONS.map((s) => [s.key, s]));
  const movable = PAGE_SECTIONS.filter((s) => !s.pinnedLast);
  const ordered = [
    ...(delta.order ?? []).map((k) => known.get(k)).filter((s): s is PageSection => !!s && !s.pinnedLast),
    ...movable.filter((s) => !(delta.order ?? []).includes(s.key)),
    ...PAGE_SECTIONS.filter((s) => s.pinnedLast),
  ];
  const hidden = new Set(delta.hidden ?? []);
  return ordered.map((section) => ({ section, visible: !hidden.has(section.key) }));
};

// ---------------------------------------------------------------------------
// Fields — tenant-wide definitions
// ---------------------------------------------------------------------------

export type FieldKind = 'choice' | 'number' | 'date' | 'text';

export const FIELD_KINDS: { id: FieldKind; name: string; note: string }[] = [
  { id: 'choice', name: 'Choice', note: 'Picked from a list you control. Rolls up across projects.' },
  { id: 'number', name: 'Number', note: 'A quantity in a fixed unit. Totals across projects.' },
  { id: 'date', name: 'Date', note: 'A single day.' },
  {
    id: 'text',
    name: 'Text',
    note: 'Free text. Nothing can be totalled or filtered by it — use it for references, never for categories.',
  },
];

export const kindName = (id: FieldKind): string => FIELD_KINDS.find((k) => k.id === id)?.name ?? id;

export interface FieldDefinition {
  id: string;
  label: string;
  kind: FieldKind;
  /** Choice fields only — the closed list. */
  options?: string[];
  /** Number fields only. */
  unit?: string;
  helpText?: string;
  /** Number fields: the range the fixture draws values from. */
  range?: [number, number];
}

export const FIELD_DEFINITIONS: FieldDefinition[] = [
  { id: 'barrier-type', label: 'Barrier type', kind: 'choice', options: ['Culvert', 'Dam', 'Weir', 'Diversion', 'Unspecified'] },
  { id: 'structures-addressed', label: 'Structures addressed', kind: 'number', unit: 'each', range: [1, 6] },
  { id: 'habitat-opened', label: 'Habitat opened upstream', kind: 'number', unit: 'miles', range: [2, 24] },
  {
    id: 'target-species',
    label: 'Target species',
    kind: 'choice',
    options: ['Chinook salmon', 'Steelhead', 'Coho salmon', 'Mixed', 'Unspecified'],
  },
  { id: 'planting-stock', label: 'Planting stock', kind: 'choice', options: ['Container', 'Cuttings and stakes', 'Seed', 'Mixed'] },
  {
    id: 'landowner-agreement',
    label: 'Landowner agreement',
    kind: 'choice',
    options: ['Signed', 'In negotiation', 'Not needed'],
    helpText: 'Whether the private parcels this work touches have signed access.',
  },
  { id: 'fence-length', label: 'Exclusion fence', kind: 'number', unit: 'miles', range: [1, 9] },
  {
    id: 'treatment-prescription',
    label: 'Treatment prescription',
    kind: 'choice',
    options: ['Thin and pile', 'Mastication', 'Prescribed burn', 'Grazing'],
  },
  { id: 'near-homes', label: 'Near homes', kind: 'choice', options: ['Within a quarter mile', 'Further out'] },
  { id: 'burn-window', label: 'Burn window opens', kind: 'date' },
  { id: 'wetland-type', label: 'Wetland type', kind: 'choice', options: ['Wet meadow', 'Fen', 'Seasonal marsh', 'Floodplain'] },
  { id: 'monitoring-wells', label: 'Groundwater wells', kind: 'number', unit: 'each', range: [2, 14] },
  { id: 'wood-structures', label: 'Wood structures installed', kind: 'number', unit: 'each', range: [6, 60] },
  {
    id: 'lead-permit',
    label: 'Lead permit',
    kind: 'text',
    helpText: 'The agreement number on the lead streambed permit.',
  },
  { id: 'bmp-type', label: 'Treatment type', kind: 'choice', options: ['Bioswale', 'Detention basin', 'Pervious paving', 'Rain garden'] },
  { id: 'drainage-area', label: 'Drainage area treated', kind: 'number', unit: 'acres', range: [12, 340] },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FieldPlacement = 'rail' | 'details';

export interface TypeField {
  fieldId: string;
  placement: FieldPlacement;
}

export interface ProjectType {
  slug: string;
  name: string;
  /** The swatch that tells two types apart at a glance. */
  color: string;
  description: string;
  fields: TypeField[];
  sections: SectionsDelta;
}

export const PROJECT_TYPES: ProjectType[] = [
  {
    slug: 'riparian-revegetation',
    name: 'Riparian Revegetation',
    color: '#3f9142',
    description: 'Streamside planting and the fencing that keeps it alive.',
    fields: [
      { fieldId: 'planting-stock', placement: 'rail' },
      { fieldId: 'landowner-agreement', placement: 'rail' },
      { fieldId: 'fence-length', placement: 'details' },
    ],
    sections: {},
  },
  {
    slug: 'fish-passage',
    name: 'Fish Passage',
    color: '#2d6fb0',
    description: 'Removing or fixing the barriers between fish and their habitat.',
    fields: [
      { fieldId: 'barrier-type', placement: 'rail' },
      { fieldId: 'structures-addressed', placement: 'rail' },
      { fieldId: 'habitat-opened', placement: 'details' },
      { fieldId: 'target-species', placement: 'details' },
      { fieldId: 'lead-permit', placement: 'details' },
    ],
    sections: { order: ['details', 'timeline', 'measures', 'funding', 'expenditures', 'gallery'] },
  },
  {
    slug: 'forest-health-and-fuels',
    name: 'Forest Health & Fuels',
    color: '#b5621f',
    description: 'Thinning, burning and grazing to make forests less flammable.',
    fields: [
      { fieldId: 'treatment-prescription', placement: 'rail' },
      { fieldId: 'near-homes', placement: 'rail' },
      { fieldId: 'burn-window', placement: 'details' },
    ],
    // This program does not publish spend.
    sections: { hidden: ['expenditures'] },
  },
  {
    slug: 'meadow-and-wetland-restoration',
    name: 'Meadow & Wetland Restoration',
    color: '#5b7f2a',
    description: 'Raising water tables and rewetting meadows and marshes.',
    fields: [
      { fieldId: 'wetland-type', placement: 'rail' },
      { fieldId: 'landowner-agreement', placement: 'rail' },
      { fieldId: 'monitoring-wells', placement: 'details' },
    ],
    sections: {},
  },
  {
    slug: 'aquatic-habitat-restoration',
    name: 'Aquatic Habitat Restoration',
    color: '#167a7a',
    description: 'Wood, gravel and side channels that give fish somewhere to live.',
    fields: [
      { fieldId: 'wood-structures', placement: 'rail' },
      { fieldId: 'target-species', placement: 'rail' },
      { fieldId: 'lead-permit', placement: 'details' },
    ],
    sections: {},
  },
  {
    slug: 'stormwater-and-water-quality',
    name: 'Stormwater & Water Quality',
    color: '#6a5aa8',
    description: 'Catching and cleaning runoff before it reaches a stream.',
    fields: [
      { fieldId: 'bmp-type', placement: 'rail' },
      { fieldId: 'drainage-area', placement: 'rail' },
    ],
    sections: { hidden: ['gallery'] },
  },
];

export const getProjectType = (slug: string): ProjectType | undefined => PROJECT_TYPES.find((t) => t.slug === slug);

/** The fixture's rule: a project's type is the one named for its program. */
export const typeForProject = (project: Pick<Project, 'program'>): ProjectType | undefined =>
  PROJECT_TYPES.find((t) => t.name === project.program);

// ---------------------------------------------------------------------------
// Values
// ---------------------------------------------------------------------------

const hash = (s: string): number => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/**
 * A project's answer to one field. Deterministic per project and field; a
 * field defined in the browser has no fixture answer, so it reads as blank —
 * which is the truth about a question nobody has been asked yet.
 */
export const fieldValue = (
  project: Pick<Project, 'projectName' | 'implementationStartYear'>,
  field: FieldDefinition,
): string => {
  // Defined in this browser: nobody has answered it yet.
  if (field.id.startsWith('local-')) return '';
  const h = hash(`${project.projectName}|${field.id}`);
  switch (field.kind) {
    case 'choice': {
      const options = (field.options ?? []).filter((o) => o !== 'Unspecified');
      return options.length ? options[h % options.length] : '';
    }
    case 'number': {
      if (!field.range) return '';
      const [lo, hi] = field.range;
      const n = lo + (h % (hi - lo + 1));
      return `${n.toLocaleString('en-US')} ${field.unit ?? ''}`.trim();
    }
    case 'date': {
      const month = ['April', 'May', 'September', 'October'][h % 4];
      return `${month} ${(h % 20) + 1}, ${project.implementationStartYear + 1}`;
    }
    case 'text':
      return field.id === 'lead-permit'
        ? `1600-${project.implementationStartYear}-0${100 + (h % 800)}-R2`
        : '';
  }
};

export interface FieldRow {
  label: string;
  value: string;
  helpText?: string;
}

/**
 * The rows a type puts in one place on a project's page, in the type's order.
 * Definitions are passed in so the build (seeds) and the browser (seeds plus
 * fields defined locally) resolve through the same function.
 */
export const fieldRows = (
  type: ProjectType,
  project: Pick<Project, 'projectName' | 'implementationStartYear'>,
  definitions: FieldDefinition[],
  placement: FieldPlacement,
): FieldRow[] =>
  type.fields
    .filter((f) => f.placement === placement)
    .map((f) => definitions.find((d) => d.id === f.fieldId))
    .filter((d): d is FieldDefinition => !!d)
    .map((d) => ({ label: d.label, value: fieldValue(project, d), helpText: d.helpText }));

// ---------------------------------------------------------------------------
// The tenant
// ---------------------------------------------------------------------------

/** The invented organization whose public pages these are. */
export const TENANT_NAME = 'North State Watershed Partnership';
