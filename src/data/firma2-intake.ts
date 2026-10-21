// The project intake form — what a workspace asks of a new project before it
// exists. Spec: .scratch/project-intake/spec.md.
//
// ONE FORM PER WORKSPACE, built of screens, each an ordered list of blocks. A
// block is a built-in project attribute, one of the workspace's own custom
// fields, or a block of formatted text. A custom question REFERENCES its field
// (src/data/firma2-project-types.ts) and never copies it — the rule project
// types already follow — so an answer has one home, and the same fact is never
// stored twice.
//
// FIELDS ARE MADE IN CUSTOM FIELDS, NEVER HERE (2026-10-20). The form places a
// field that already exists, at most once, and words it as a question; its
// name, kind and choices stay the field's. A form that also made fields asked
// the administrator to design a data model and a questionnaire in one gesture.
//
// WHAT BELONGS TO THE FORM, NOT THE FIELD: a custom question's wording, help
// text, whether it is required, and when it is shown. A BUILT-IN keeps the
// attribute's own name everywhere — only its help text, required-ness and
// condition are the form's — and its choices are kept where `choicesFrom`
// says. A field is a fact about a project; required-ness is a fact about this
// one moment of asking.
//
// The rules over this shape (visibility, clearing, readiness, the locked
// built-ins) live in src/lib/intake-form.ts. INVENTED CONTENT throughout.

/** The Project's own attributes the form can ask for. */
export type BuiltinKey =
  | 'projectName'
  | 'projectType'
  | 'leadOrganization'
  | 'classifications'
  | 'projectDescription'
  | 'location'
  | 'implementationStartYear'
  | 'completionYear'
  | 'estimatedTotalCost'
  | 'tags'
  | 'contacts';

/** How a built-in is answered — which control the intake page draws. */
export type BuiltinInput = 'text' | 'long-text' | 'choice' | 'multi-choice' | 'year' | 'money' | 'location' | 'people';

export interface Builtin {
  key: BuiltinKey;
  /** The default wording, and the name it goes by in the builder's sidebar. */
  label: string;
  input: BuiltinInput;
  /** Always on the form and always required: the record cannot exist without it. */
  locked: boolean;
  /**
   * Where its closed list is kept, for the built-ins that pick from one. The
   * builder never edits a built-in's name or choices; it points here.
   */
  choicesFrom?: { page: string; href: string };
}

// Locked first, in the order a new form opens with them. Classifications are
// locked because a project is never in none (firma2-projects.ts).
export const BUILTINS: Builtin[] = [
  { key: 'projectName', label: 'Project name', input: 'text', locked: true },
  { key: 'projectType', label: 'Project type', input: 'choice', locked: true, choicesFrom: { page: 'Project types', href: '/prototypes/workspace-settings/project-types' } },
  { key: 'leadOrganization', label: 'Lead organization', input: 'choice', locked: true, choicesFrom: { page: 'Organizations', href: '/prototypes/workspace-settings/organizations' } },
  { key: 'classifications', label: 'Classifications', input: 'multi-choice', locked: true, choicesFrom: { page: 'Classifications', href: '/prototypes/workspace-settings/classifications' } },
  { key: 'projectDescription', label: 'Description', input: 'long-text', locked: false },
  { key: 'location', label: 'Location', input: 'location', locked: false },
  { key: 'implementationStartYear', label: 'Start year', input: 'year', locked: false },
  { key: 'completionYear', label: 'Completion year', input: 'year', locked: false },
  { key: 'estimatedTotalCost', label: 'Estimated total cost', input: 'money', locked: false },
  { key: 'tags', label: 'Tags', input: 'multi-choice', locked: false, choicesFrom: { page: 'Tags', href: '/prototypes/workspace-settings/tags' } },
  { key: 'contacts', label: 'Contacts', input: 'people', locked: false, choicesFrom: { page: 'Users', href: '/prototypes/workspace-settings/users' } },
];

export const builtin = (key: BuiltinKey): Builtin => BUILTINS.find((b) => b.key === key)!;

/**
 * Show this block only when an earlier answer calls for it. One condition, no
 * AND/OR: the light version the spec settled on.
 */
export interface Condition {
  /** The id of an earlier yes/no or choice block. */
  source: string;
  op: 'is' | 'is-any-of';
  values: string[];
}

interface BlockBase {
  id: string;
  when?: Condition;
}

export interface BuiltinBlock extends BlockBase {
  type: 'builtin';
  key: BuiltinKey;
  label: string;
  help?: string;
  /** Example text in an empty text box, typed into the box on the canvas. */
  placeholder?: string;
  /**
   * The label and help with their formatting (bold, italic, links), when they
   * have any — src/lib/inline-format.ts. `label` and `help` stay the plain
   * text every other surface reads (names, conditions, the review step).
   */
  labelHtml?: string;
  helpHtml?: string;
  required: boolean;
}

export interface FieldBlock extends BlockBase {
  type: 'field';
  fieldId: string;
  /** The question's wording. The field keeps its own name in Custom fields. */
  label: string;
  help?: string;
  /** Example text in an empty text box, typed into the box on the canvas. */
  placeholder?: string;
  /**
   * The label and help with their formatting (bold, italic, links), when they
   * have any — src/lib/inline-format.ts. `label` and `help` stay the plain
   * text every other surface reads (names, conditions, the review step).
   */
  labelHtml?: string;
  helpHtml?: string;
  required: boolean;
}

export interface TextBlock extends BlockBase {
  type: 'text';
  /** Rich text, as firma2-rich-text stores it. */
  html: string;
}

export type Block = BuiltinBlock | FieldBlock | TextBlock;
export type QuestionBlock = BuiltinBlock | FieldBlock;

export interface Screen {
  id: string;
  title: string;
  when?: Condition;
  blocks: Block[];
}

export interface IntakeForm {
  /** The form's name — the title of every page a member fills it on. */
  title: string;
  screens: Screen[];
  /** Shown once a proposal is submitted. Rich text. */
  afterSubmit: string;
}

export const DEFAULT_AFTER_SUBMIT =
  '<p class="typography-body-md">Your proposal is with the lead organization’s steward. You’ll get a notification when they approve it or send it back.</p>';

export const DEFAULT_FORM_TITLE = 'Project proposal';

/**
 * A new workspace's form: one screen holding the four attributes no project
 * can exist without. Everything else is the administrator's to add.
 */
export const SEED_FORM: IntakeForm = {
  title: DEFAULT_FORM_TITLE,
  screens: [
    {
      id: 's-first',
      title: '',
      blocks: [
        { id: 'q-name', type: 'builtin', key: 'projectName', label: 'Project name', required: true },
        { id: 'q-type', type: 'builtin', key: 'projectType', label: 'Project type', required: true },
        { id: 'q-lead', type: 'builtin', key: 'leadOrganization', label: 'Lead organization', required: true },
        { id: 'q-classifications', type: 'builtin', key: 'classifications', label: 'Classifications', required: true },
      ],
    },
  ],
  afterSubmit: DEFAULT_AFTER_SUBMIT,
};

/**
 * The form a free workspace's members fill: fixed, because customizing it is a
 * paid feature (.scratch/form-canvas/spec.md, decisions 18 and 22). The four a
 * project can't exist without, plus Description — what a steward reviews —
 * and Location, which puts the proposal on the map.
 */
export const STANDARD_FORM: IntakeForm = {
  title: DEFAULT_FORM_TITLE,
  screens: [
    {
      id: 's-standard',
      title: '',
      blocks: [
        ...SEED_FORM.screens[0].blocks,
        { id: 'q-description', type: 'builtin', key: 'projectDescription', label: 'Description', required: false },
        { id: 'q-location', type: 'builtin', key: 'location', label: 'Location', required: false },
      ],
    },
  ],
  afterSubmit: DEFAULT_AFTER_SUBMIT,
};

// ---------------------------------------------------------------------------
// Intake projects — a proposal from its first screen to its approval
// ---------------------------------------------------------------------------

/**
 * Where a proposal stands. Every status sits in the Proposal stage except
 * approved (Planning & Design) and deferred (Deferred) — no new stage.
 */
export type IntakeStatus = 'draft' | 'submitted' | 'returned' | 'approved' | 'deferred';

/** Answers keyed by built-in key, or `field:<fieldId>` for a custom field. */
export type Answers = Record<string, unknown>;

export interface IntakeProject {
  id: string;
  status: IntakeStatus;
  answers: Answers;
  createdBy: string;
  createdAt: string;
  submittedAt?: string;
  decidedAt?: string;
  decidedBy?: string;
  /** The steward's note when returned. Cleared on resubmit. */
  returnComment?: string;
}

/** Invented proposals so the steward's queue has something in it. */
export const SEED_PROPOSALS: IntakeProject[] = [
  {
    id: 'p-mill-creek',
    status: 'submitted',
    createdBy: 'Rosa Delgado',
    createdAt: '2026-10-06T16:20:00Z',
    submittedAt: '2026-10-14T18:05:00Z',
    answers: {
      projectName: 'Mill Creek Culvert Replacement',
      projectType: 'Fish passage',
      leadOrganization: 'Feather Headwaters Trust',
      classifications: ['Salmon & steelhead recovery', 'Barrier removal & fish screens'],
      projectDescription: 'Replace two undersized culverts under Forest Road 24N08 with a bottomless arch, reopening 4 miles of spawning habitat.',
      location: [40.07, -121.18],
      implementationStartYear: 2027,
      completionYear: 2028,
      estimatedTotalCost: 860000,
    },
  },
  {
    id: 'p-butte-meadow',
    status: 'submitted',
    createdBy: 'Kevin Osei',
    createdAt: '2026-10-11T15:00:00Z',
    submittedAt: '2026-10-17T21:40:00Z',
    answers: {
      projectName: 'Butte Meadows Wet Meadow Restoration',
      projectType: 'Meadow & wetland restoration',
      leadOrganization: 'Feather Headwaters Trust',
      classifications: ['Water supply reliability', 'Meadow & marsh rewetting'],
      projectDescription: 'Plug a 1,200-foot incised gully with beaver dam analogs to raise the water table across 40 acres of meadow.',
      location: [40.08, -121.56],
      implementationStartYear: 2027,
      estimatedTotalCost: 215000,
    },
  },
];
