// The glossary the Help sheet searches — a mirror of GLOSSARY.md at the repo
// root, which stays the source of truth. Change a term there first, then here.
// The four role terms and Publish come from docs/roles-and-permissions.md and
// docs/product-brief.md §4, because they are the words people look up most.
//
// Definitions are rewritten for the reader of the Help sheet, not the
// developer reading GLOSSARY.md: the "Avoid" lists are internal naming rules
// and stay behind; the meaning does not change.

export interface GlossaryTerm {
  term: string;
  definition: string;
  /** The Help article that explains the term in full, if one does. */
  article?: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Workspace',
    definition: 'Your organization’s ProjectFirma: one set of projects, people and settings, on one plan.',
  },
  {
    term: 'Organization',
    definition: 'A group inside a workspace whose members record projects.',
    article: 'roles',
  },
  {
    term: 'Program',
    definition: 'A workspace that coordinates the organizations reporting to it. Also the plan that allows this.',
    article: 'connected-organizations',
  },
  {
    term: 'In-program organization',
    definition: 'An organization that lives inside the program’s own workspace.',
    article: 'connected-organizations',
  },
  {
    term: 'Connected organization',
    definition: 'A separate workspace linked into a program. It owns and edits the projects it shares.',
    article: 'connected-organizations',
  },
  {
    term: 'Shared project',
    definition: 'One record, owned by a connected organization and shown live in a program. Never a copy.',
    article: 'connected-organizations',
  },
  {
    term: 'Scope rule',
    definition: 'Which projects a program wants from its connected organizations: by project type, and optionally its own funding.',
    article: 'connected-organizations',
  },
  {
    term: 'Minimum',
    definition: 'The fields and performance measures a program requires on every shared project.',
    article: 'connected-organizations',
  },
  {
    term: 'Crosswalk',
    definition: 'A map from a connected organization’s types, fields or measures to a program’s. Measures link only when they count the same way.',
    article: 'connected-organizations',
  },
  {
    term: 'Plan',
    definition: 'Free, Agency or Program: what a workspace can use, and how much of it.',
  },
  {
    term: 'Performance measure',
    definition: 'A question asked of every project, forever: how much of what did it accomplish?',
    article: 'performance-measures',
  },
  {
    term: 'Administrator',
    definition: 'Configures the workspace and manages people. Manages every organization.',
    article: 'roles',
  },
  {
    term: 'Contributor',
    definition: 'Edits the projects their organizations lead. Belongs to at least one organization.',
    article: 'roles',
  },
  {
    term: 'Viewer',
    definition: 'Reads published values. With no organization, sees what the public sees.',
    article: 'roles',
  },
  {
    term: 'Manager',
    definition: 'A Contributor who runs one organization’s members, settings and approvals. A flag on the membership, not a role.',
    article: 'roles',
  },
  {
    term: 'Publish',
    definition: 'Bring a project’s public page up to date with its record, after reviewing what changed.',
    article: 'publishing',
  },
];
