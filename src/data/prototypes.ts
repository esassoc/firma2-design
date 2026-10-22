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
  // difference expressed as data — classifications build pages, one colour
  // brands everything. Project types and classifications merged 2026-10-02.
  // Edits are browser-local.
  {
    slug: 'classifications',
    title: 'Classifications',
    description: 'Work types and plan goals, grouped',
    route: '/prototypes/workspace-settings/classifications',
    createdAt: '2026-10-01',
    status: 'in-progress',
  },
  {
    slug: 'public-project-page',
    title: 'Public project page',
    description: 'A project as the public sees it',
    route: '/prototypes/public/scott-river-fish-passage-barrier-removal',
    createdAt: '2026-10-01',
    status: 'in-progress',
  },
  {
    slug: 'branding',
    title: 'Branding',
    description: 'One brand colour for every screen',
    route: '/prototypes/workspace-settings/branding',
    createdAt: '2026-10-01',
    status: 'in-progress',
  },
  // Ported from ProjectFirma2's hackathon team 5 (project updates).
  {
    slug: 'my-projects',
    title: 'My Projects',
    description: 'Projects you can update, with a map',
    route: '/prototypes/my-projects',
    createdAt: '2026-10-03',
    status: 'in-progress',
  },
  // Ported from ProjectFirma2's hackathon team 2 (geospatial). The ArcGIS
  // service, the upload reader and the sync are scripted stand-ins.
  {
    slug: 'work-areas',
    title: 'Place a project',
    description: 'Draw, drop, paste or upload a project’s footprint',
    route: '/prototypes/projects/cosumnes-floodplain-reconnection',
    createdAt: '2026-10-02',
    status: 'in-progress',
  },
  {
    slug: 'portfolio-map',
    title: 'Portfolio map',
    description: 'Every project on one map',
    route: '/prototypes/map',
    createdAt: '2026-10-02',
    status: 'in-progress',
  },
  {
    slug: 'gis-subscriptions',
    title: 'GIS subscriptions',
    description: 'Sync footprints from your ArcGIS layer',
    route: '/prototypes/workspace-settings/gis-subscriptions',
    createdAt: '2026-10-02',
    status: 'in-progress',
  },
  {
    slug: 'gis-sync',
    title: 'GIS sync (two-way)',
    description: 'Two-way ArcGIS sync, chosen per field',
    route: '/prototypes/workspace-settings/gis-sync',
    createdAt: '2026-10-02',
    status: 'in-progress',
  },
  {
    slug: 'map-layers',
    title: 'Map layers',
    description: 'Reference boundaries for every map',
    route: '/prototypes/workspace-settings/map-layers',
    createdAt: '2026-10-02',
    status: 'in-progress',
  },
  {
    slug: 'organization-settings',
    title: 'Organization settings',
    description: 'Your organization’s settings pages',
    route: '/prototypes/workspace-settings/organization-settings',
    createdAt: '2026-10-02',
    status: 'in-progress',
  },
  {
    slug: 'project-source',
    title: 'Project source',
    description: 'Create projects here or sync them from GIS',
    route: '/prototypes/workspace-settings/project-source',
    createdAt: '2026-10-02',
    status: 'in-progress',
  },
  // Ported from ProjectFirma2's hackathon team 6 (performance measures),
  // reworked against this spoke's measure model. Both flows are scripted
  // stand-ins for live Claude calls.
  {
    slug: 'measure-drafting',
    title: 'Draft a measure from a claim',
    description: 'Draft a measure from a funder claim',
    route: '/prototypes/workspace-settings/performance-measures/new',
    createdAt: '2026-10-01',
    status: 'in-progress',
  },
  {
    slug: 'report-import',
    title: 'Report from a document',
    description: 'Report from a crew log or pasted report',
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
    description: 'Your account settings',
    route: '/prototypes/settings',
    createdAt: '2026-08-24',
    status: 'in-progress',
  },
  // PM 2: projectfirma2's measures as built on branch
  // features/0010_project_performance_measures (categories, targets, a change
  // log), ported beside the original so the two can be compared.
  {
    slug: 'pm2-catalog',
    title: 'Performance measures (PM 2)',
    description: 'Measure catalog and setup, as ProjectFirma2 built it',
    route: '/prototypes/workspace-settings/pm2',
    createdAt: '2026-10-08',
    status: 'in-progress',
  },
  {
    slug: 'pm2-project',
    title: 'Project measures (PM 2)',
    description: 'A project’s measures by period, with targets',
    route: '/prototypes/pm2/projects/deer-creek-riparian-corridor-enhancement',
    createdAt: '2026-10-08',
    status: 'in-progress',
  },
  {
    slug: 'performance-measures',
    title: 'Performance measure setup',
    description: 'Every performance measure in one table',
    route: '/prototypes/workspace-settings/performance-measures',
    createdAt: '2026-08-20',
    status: 'in-progress',
  },
  {
    slug: 'projects',
    title: 'Projects index',
    description: 'Every project in one table',
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
    description: 'One project in full',
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
    description: 'One project, map first',
    route: '/prototypes/projects/deer-creek-riparian-corridor-enhancement/map',
    createdAt: '2026-08-24',
    status: 'in-progress',
  },
];

/** Newest first — the order the index table renders. */
export const prototypesByNewest = (): Prototype[] =>
  [...prototypes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
