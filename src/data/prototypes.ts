// The spoke's prototype registry — the single source of truth that drives the
// home page index table. Add a row here when you ship a new prototype.
//
// The template ships with an EMPTY registry: the home page renders the layers
// (Design System / Pattern Library) immediately, and the prototypes list stays
// empty until this spoke builds its first working screen. Add entries here as
// prototypes land (each route lives under src/pages/prototypes/<slug>.astro).

export type PrototypeStatus = 'live' | 'in-progress' | 'planned' | 'archived';

export interface Prototype {
  /** URL-safe id. */
  slug: string;
  title: string;
  description: string;
  /** Internal route, root-relative and base-less — wrap with withBase() at render. */
  route: string;
  /** ISO date (YYYY-MM-DD) the prototype was first built. */
  createdAt: string;
  /** Tracking ticket id, e.g. a Jira key. Optional. */
  ticket?: string;
  status: PrototypeStatus;
}

export const prototypes: Prototype[] = [
  // Ported from ProjectFirma2's hackathon team 3 (customizations): a tenant's
  // difference expressed as data — project types build pages, one colour
  // brands everything. Edits are browser-local.
  {
    slug: 'project-types',
    title: 'Project types',
    description:
      'Each kind of project gets its own fields and its own public page layout, with the page live beside the editor.',
    route: '/prototypes/workspace-settings/project-types',
    createdAt: '2026-10-01',
    status: 'in-progress',
  },
  {
    slug: 'public-project-page',
    title: 'Public project page',
    description:
      'One project as the public sees it — no account, the tenant’s brand, and only the sections its type publishes.',
    route: '/prototypes/public/scott-river-fish-passage-barrier-removal',
    createdAt: '2026-10-01',
    status: 'in-progress',
  },
  {
    slug: 'branding',
    title: 'Branding',
    description: 'Pick one colour and every screen and public page follows, with its contrast graded as you choose.',
    route: '/prototypes/workspace-settings/branding',
    createdAt: '2026-10-01',
    status: 'in-progress',
  },
  // Ported from ProjectFirma2's hackathon team 6 (performance measures),
  // reworked against this spoke's measure model. Both flows are scripted
  // stand-ins for live Claude calls.
  {
    slug: 'measure-drafting',
    title: 'Draft a measure from a claim',
    description:
      'Write what you owe your funder, or answer two clickable questions, and get a measure drafted with its reporting cost priced.',
    route: '/prototypes/performance-measures/new',
    createdAt: '2026-10-01',
    status: 'in-progress',
  },
  {
    slug: 'report-import',
    title: 'Report from a document',
    description:
      'Upload a crew log or paste a report; each proposed entry shows its source and is checked before it is saved.',
    route: '/prototypes/projects/deer-creek-riparian-corridor-enhancement',
    createdAt: '2026-10-01',
    status: 'in-progress',
  },
  // The one screen here that is not a record. Listed because the colour-scheme
  // control on it is app-wide and live — it is the fastest way to see every
  // other prototype in this list rendered in the dark scheme.
  {
    slug: 'settings',
    title: 'Settings',
    description:
      'One account’s own settings, in four pages: theme, name and email, which events send mail, and sign-in and sessions.',
    route: '/prototypes/settings',
    createdAt: '2026-08-24',
    status: 'in-progress',
  },
  {
    slug: 'performance-measures',
    title: 'Performance measure setup',
    description:
      'Every performance measure in one searchable table, with the draft-first setup page each one is defined on.',
    route: '/prototypes/performance-measures',
    createdAt: '2026-08-20',
    status: 'in-progress',
  },
  {
    slug: 'projects',
    title: 'Projects index',
    description:
      'Every project in one searchable table, with stage and program filters and CSV export.',
    route: '/prototypes/projects',
    createdAt: '2026-08-19',
    status: 'in-progress',
  },
  // The detail screen is a PARAMETERIZED route — one page per project — so
  // there is no single URL for "the prototype" the way there is for the index.
  // The route here points at one representative project rather than at a
  // chooser page nobody would build: every other project is one click away from
  // the index, which is how a reader reaches them anyway. Deer Creek is the
  // pick because it is mid-Implementation, so its measures show partial
  // progress and its milestones show all three states — a Proposal or a
  // Completed project would demo a page where every bar reads the same.
  {
    slug: 'project-detail',
    title: 'Project detail',
    description:
      'One project in full: work areas on a map, performance measures, funding sources and milestones.',
    route: '/prototypes/projects/deer-creek-riparian-corridor-enhancement',
    createdAt: '2026-08-20',
    status: 'in-progress',
  },
  // TWO READINGS OF ONE RECORD, and both are listed because the choice between
  // them is a real one this spoke has not settled — not because one supersedes
  // the other. The row above reads the project as a document and leads with the
  // numbers; this one reads it as a place and makes the map the pane. Same
  // representative project, for the same reason Deer Creek was picked there.
  {
    slug: 'project-detail-map',
    title: 'Project detail — map view',
    description:
      'One project read as a place: the work-areas map fills the screen, and the record and its sections float over it until you hide them.',
    route: '/prototypes/projects/deer-creek-riparian-corridor-enhancement/map',
    createdAt: '2026-08-24',
    status: 'in-progress',
  },
];

/** Newest first — the order the index table renders. */
export const prototypesByNewest = (): Prototype[] =>
  [...prototypes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
