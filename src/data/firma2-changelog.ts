// The changelog — dated changes to the prototype, as the people using it would
// describe them. Seeded on 2026-11-12 from `git log --oneline -40`, whose
// commit subjects ("Enhance performance measure components…") say what was
// touched rather than what changed for anyone; each entry is rewritten from
// the decisions dated in the product brief and the spec files for that day.
// Newest first. Add an entry when a change is something a returning user
// would notice.

export interface ChangelogEntry {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-11-12',
    changes: [
      'Help opens a panel beside the page, with the article for where you are, a searchable glossary and this changelog.',
      'The Projects page shows the same projects as a table, a list or a map.',
      'A project photo can be marked Featured. The public project page leads with it.',
      'The Progress Dashboard is a grid of tiles with filters.',
      'Workspace security offers only sign-in methods each workspace can set.',
    ],
  },
  {
    date: '2026-11-02',
    changes: [
      'Steward is now Manager, so it isn’t confused with ProjectFirma 1.x’s project steward.',
      'New people choose their organization at first sign-in: join, ask to join, or ask for a new one.',
      'Map replaces My projects as the landing page for people who edit projects.',
    ],
  },
  {
    date: '2026-10-22',
    changes: [
      'On a project, Details and Map open from the bar under the top bar.',
      'The Connections graph is gone from projects.',
    ],
  },
  {
    date: '2026-10-21',
    changes: [
      'The intake form builder: click anywhere on the canvas and type.',
      'Recent pages, Help and Shortcuts sit in a strip under the page.',
      'Classifications can carry performance measures as goals.',
    ],
  },
  {
    date: '2026-10-20',
    changes: [
      'Edit panels open beside the list they change instead of over it, starting with Custom fields.',
      'Intake form fields come from Custom fields and are placed on the form, worded as questions.',
    ],
  },
  {
    date: '2026-10-19',
    changes: [
      'Three plans: Free, Agency and Program. Locked features stay visible and say which plan unlocks them.',
      'Plan and usage shows how much of each limit the workspace uses.',
    ],
  },
  {
    date: '2026-10-09',
    changes: [
      'Publishing: editors change records freely, and managers review what changed before it goes public.',
      'Performance measures list as a table, with one settings page per measure.',
      'Projects plan a target for each year of a performance measure.',
    ],
  },
  {
    date: '2026-10-03',
    changes: [
      'A Classifications page lists how projects are filed.',
      'Custom pages and documents: write your own pages and add them to the menu.',
      'My projects: the projects you can edit, as cards with a map of each.',
    ],
  },
  {
    date: '2026-10-02',
    changes: [
      'Roles are Administrator, Contributor and Viewer, with “who can” settings per act in Security.',
      'Project pages open to read, with Edit beside the title.',
      'A new icon set across the app.',
    ],
  },
  {
    date: '2026-10-01',
    changes: ['Preferences: choose a light or dark theme, underlined links and hand cursors.'],
  },
  {
    date: '2026-09-10',
    changes: ['Each performance measure has a page with its projects, totals and history.'],
  },
  {
    date: '2026-08-20',
    changes: ['Performance measures get charts of what was reported over time.'],
  },
  {
    date: '2026-08-19',
    changes: ['The first ProjectFirma 2.0 prototype pages.'],
  },
];
