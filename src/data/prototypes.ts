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
  {
    slug: 'setup',
    title: 'Tenant setup',
    description:
      'The setup hub: every milestone a new tenant stands up, laid out by subject and fed by the documents it already has. Built for the Mission 4 hackathon slice.',
    route: '/prototypes/setup',
    createdAt: '2026-09-11',
    status: 'in-progress',
  },
  // The one screen here that is not a record. Listed because the colour-scheme
  // control on it is app-wide and live — it is the fastest way to see every
  // other prototype in this list rendered in the dark scheme.
  {
    slug: 'settings',
    title: 'Settings',
    description:
      'One account’s own preferences: name and email, the light / dark / system theme, and which events send mail.',
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
