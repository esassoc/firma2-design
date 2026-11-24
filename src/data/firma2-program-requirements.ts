// Program requirements — what a program asks of every project shared with it,
// and which projects are shared (.scratch/connected-orgs/spec.md, decisions 7,
// 9, 10, 12).
//
// THE MINIMUM. A program picks core facts it needs, adds fields of its own, and
// names the performance measures it counts. What the organization already
// tracks answers itself; what it doesn't appears on the project as the
// program's own section, answered where the organization already works. A
// project under the minimum is shared anyway and marked incomplete.
//
// FUNDER-OWNED FIELDS (decision 12) are the program's to fill in — a grant
// agreement number — and read-only for the organization.
//
// MEASURES BY TYPE. One minimum for every project would ask a gravel
// placement how many barriers it removed. The program names its measures per
// project type (the type map of decision 4), and the catalog measure (`kpi`)
// is what a project's own measure is matched on.
//
// INVENTED. The program is a funding source the fixture already has, so the
// section, the funding table and the funder's page agree on its name; every
// field, answer and agreement number is made up. Deterministic: no clock, no
// Math.random().

import { demoProjectName } from './firma2-projects';
import type { Project } from './firma2-projects';
import type { ProjectDetail } from './firma2-project-detail';

/** Core facts a program may pick, in the order the record shows them. */
export type CoreFact = 'name' | 'type' | 'workAreas' | 'timeline' | 'stage' | 'description';

export const CORE_FACT_LABELS: Record<CoreFact, string> = {
  name: 'name',
  type: 'project type',
  workAreas: 'work areas',
  timeline: 'timeline',
  stage: 'stage',
  description: 'description',
};

export interface ProgramField {
  /** Stable within the program. */
  key: string;
  /** Worded as the record names it — a field, not a question on a form. */
  label: string;
  control: 'text' | 'select';
  options?: string[];
  /** `program`: a funder-owned field, edited by the program and read-only here. */
  owner: 'organization' | 'program';
}

export interface ProgramMeasure {
  name: string;
  /** The catalog measure a project's own measure must report toward. */
  kpi: string;
}

export interface Program {
  id: string;
  name: string;
  /** The organization that runs it — the funder on the funding table. */
  funder: string;
  /** The program's own guide, when it has published one. Base-less route. */
  guide?: { title: string; href: string };
  coreFacts: CoreFact[];
  fields: ProgramField[];
  /** Keyed by the program's project type; a type it doesn't list asks for no measure. */
  measuresByType: Record<string, ProgramMeasure[]>;
}

export interface ProgramShare {
  project: string;
  program: string;
  /** What has been answered so far, by field key. Missing keys are unanswered. */
  answers: Record<string, string>;
}

export const programs: Program[] = [
  {
    id: 'afrf',
    name: 'Anadromous Fisheries Recovery Fund',
    funder: 'Pacific Fisheries Trust',
    // The program's monitoring protocol, published into this workspace's Pages.
    guide: { title: 'Monitoring protocol', href: '/prototypes/pages/page?id=monitoring-protocol' },
    coreFacts: ['name', 'type', 'workAreas', 'timeline', 'stage', 'description'],
    fields: [
      {
        key: 'targetSpecies',
        label: 'Target species',
        control: 'select',
        options: ['Coho salmon', 'Chinook salmon', 'Steelhead', 'Pacific lamprey', 'More than one'],
        owner: 'organization',
      },
      {
        key: 'landownerAgreement',
        label: 'Landowner access agreement',
        control: 'select',
        options: ['Signed', 'In negotiation', 'Not needed'],
        owner: 'organization',
      },
      { key: 'passageId', label: 'Passage assessment site ID', control: 'text', owner: 'organization' },
      { key: 'grantAgreement', label: 'Grant agreement number', control: 'text', owner: 'program' },
    ],
    measuresByType: {
      'Fish passage': [
        { name: 'Fish passage barriers removed', kpi: 'fish-passage-barriers-removed' },
        { name: 'Stream miles reopened', kpi: 'stream-miles-reopened' },
      ],
      'Aquatic habitat restoration': [
        { name: 'Stream miles of instream habitat improved', kpi: 'stream-miles-instream-habitat' },
      ],
    },
  },
];

export const programShares: ProgramShare[] = [
  // Half answered: the agreement is signed and the program has its number in,
  // but nobody has picked the species or found the site ID.
  {
    project: demoProjectName('Scott River Fish Passage Barrier Removal'),
    program: 'afrf',
    answers: { landownerAgreement: 'Signed', grantAgreement: 'AFRF-2025-014' },
  },
  // Nearly there from the organization's side; the program hasn't entered its
  // agreement number yet.
  {
    project: demoProjectName('Bear River Gravel Augmentation'),
    program: 'afrf',
    answers: { targetSpecies: 'Chinook salmon', landownerAgreement: 'Not needed' },
  },
];

// ---------------------------------------------------------------------------
// The checklist
// ---------------------------------------------------------------------------

export interface RequirementItem {
  /** Unique on the page: it is the editable field's key for answerable rows. */
  key: string;
  kind: 'facts' | 'field' | 'measure';
  label: string;
  done: boolean;
  /** What the record holds, formatted; '' when missing. */
  value: string;
  /** The organization answers it here (an organization field). */
  answerable: boolean;
  /** Funder-owned: the program fills it in. */
  programOwned: boolean;
  control?: 'text' | 'select';
  options?: string[];
}

export interface ProgramSection {
  program: Program;
  items: RequirementItem[];
}

const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const hasFact = (fact: CoreFact, project: Project, detail: ProjectDetail): boolean => {
  switch (fact) {
    case 'name': return Boolean(project.projectName.trim());
    case 'type': return Boolean(project.projectType);
    case 'workAreas': return detail.workAreas.length > 0;
    case 'timeline': return Boolean(project.implementationStartYear && project.completionYear);
    case 'stage': return Boolean(project.stage);
    case 'description': return Boolean(detail.projectDescription.trim());
  }
};

/** "name, type and stage" */
const listOf = (words: string[]): string =>
  words.length < 2 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words.at(-1)}`;

const sentenceCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** Every program this project is shared with, and its minimum as a checklist. */
export const programSections = (detail: ProjectDetail): ProgramSection[] =>
  programShares
    .filter((share) => share.project === detail.project.projectName)
    .map((share) => {
      const program = programs.find((p) => p.id === share.program);
      if (!program) throw new Error(`Program share for "${share.project}" names an unknown program: ${share.program}`);
      const { project } = detail;

      // Core facts fold into one row: the record already holds them, so six
      // ticked rows would be a list of things nobody has to do.
      const missingFacts = program.coreFacts.filter((f) => !hasFact(f, project, detail));
      const facts: RequirementItem = {
        key: `program:${program.id}:facts`,
        kind: 'facts',
        label: 'Core facts',
        done: missingFacts.length === 0,
        value: missingFacts.length
          ? `Missing ${listOf(missingFacts.map((f) => CORE_FACT_LABELS[f]))}`
          : sentenceCase(listOf(program.coreFacts.map((f) => CORE_FACT_LABELS[f]))),
        answerable: false,
        programOwned: false,
      };

      const fields: RequirementItem[] = program.fields.map((field) => {
        const value = share.answers[field.key] ?? '';
        return {
          key: `program:${program.id}:${field.key}`,
          kind: 'field',
          label: field.label,
          done: Boolean(value.trim()),
          value,
          answerable: field.owner === 'organization',
          programOwned: field.owner === 'program',
          control: field.control,
          options: field.options,
        };
      });

      const measures: RequirementItem[] = (program.measuresByType[project.projectType] ?? []).map((m) => {
        const own = detail.measures.find((x) => x.kpi === m.kpi);
        return {
          key: `program:${program.id}:measure:${m.kpi}`,
          kind: 'measure',
          label: m.name,
          // Tracked is not answered: the program needs a reported figure, not a target.
          done: Boolean(own && own.reported > 0),
          value: !own
            ? ''
            : own.reported > 0
              ? `${numberFormat.format(own.reported)} of ${numberFormat.format(own.expected)} ${own.unit} reported`
              : `Nothing reported yet (${numberFormat.format(own.expected)} ${own.unit} expected)`,
          answerable: false,
          programOwned: false,
        };
      });

      return { program, items: [facts, ...fields, ...measures] };
    });
