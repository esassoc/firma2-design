// The Help sheet's articles — short explanations of the core concepts, for
// someone who logs in a few times a year and has forgotten how things work
// since the last visit (ProjectFirma is a trailing system: projects are logged
// after the work is done).
//
// Written from docs/product-brief.md (§3, §4 "Roles are fixed…", "Review the
// net diff…") and docs/roles-and-permissions.md, in the microcopy skill's
// voice: plain, front-loaded, one fact per paragraph. Each paragraph has to
// stop a mistake; anything that only explains the system's design is cut.
//
// `paths` makes the sheet context-aware: opened on a page whose route starts
// with one of them, the article opens first. Longest match wins, so
// /prototypes/projects/import opens Importing, not Projects.

export interface HelpArticle {
  slug: string;
  title: string;
  /** Base-less route prefixes where this article is the one you need. */
  paths: string[];
  body: string[];
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: 'projects',
    title: 'Projects',
    paths: ['/prototypes/projects', '/prototypes/map', '/prototypes/my-projects'],
    body: [
      'A project is the record of one piece of work: what it is, where, who leads it, and what it delivered. Most are logged after the work is done.',
      'To change a value, choose Edit beside the title, then click the value. Changes save as you go; Escape cancels the field you’re in.',
      'Record work files a year’s numbers against the project’s performance measures. It’s there even while the page is in read view.',
      'Logging many finished projects at once? Use Import on the Projects page.',
    ],
  },
  {
    slug: 'performance-measures',
    title: 'Performance measures',
    paths: ['/prototypes/performance-measures', '/prototypes/pm2', '/prototypes/workspace-settings/performance-measures', '/prototypes/workspace-settings/pm2'],
    body: [
      'A performance measure is a question asked of every project, forever: how much of what did this project accomplish?',
      'Every project answers each measure on every report, for the life of the program. Add only what you’ll report on.',
      'The counting rule can’t be changed once projects report. Only measures that add up can show a running total; the others report per year.',
      'Projects can plan a target for each year. Views by year show reported against planned.',
    ],
  },
  {
    slug: 'publishing',
    title: 'Publishing and review',
    paths: ['/prototypes/review', '/prototypes/public', '/prototypes/updates', '/prototypes/workspace-settings/organization-settings/review'],
    body: [
      'Editors change records freely and every change saves. The public page shows what a manager or administrator last published.',
      'Review shows what changed since the last publish, one row per field. Publish and next moves on to the next project waiting.',
      'Revert puts one field back to its published value. A filed report or a redrawn boundary is fixed on the project itself.',
      'Review schedules are optional. An organization that sets one gets Overdue marks and a weekly reminder.',
      'Managers and administrators can publish. An administrator can change that in Security.',
    ],
  },
  {
    slug: 'roles',
    title: 'Organizations and roles',
    paths: [
      '/prototypes/organizations',
      '/prototypes/join',
      '/prototypes/workspace-settings/users',
      '/prototypes/workspace-settings/organizations',
      '/prototypes/workspace-settings/organization-settings',
      '/prototypes/workspace-settings/security',
      '/prototypes/settings/security',
    ],
    body: [
      'Everyone has one workspace role. Administrators configure the workspace and manage people. Contributors edit the projects their organizations lead. Viewers read published values.',
      'A person can belong to any number of organizations. A Contributor needs at least one.',
      'Manager isn’t a role. It’s set per organization, on its Members page, and runs that organization’s members, settings and approvals. Administrators manage every organization.',
      'Only administrators create organizations or make someone an administrator.',
      'Who may invite, import, export or publish is set per act in Security, not by a role.',
    ],
  },
  {
    slug: 'connected-organizations',
    title: 'Connected organizations',
    paths: ['/prototypes/workspace-settings/plan'],
    body: [
      'A workspace can connect to a program and appear in it as a connected organization. It keeps its own workspace, project types and fields.',
      'A shared project is one record. The organization edits it; the program sees it live and reviews it.',
      'The program says which projects it wants and which fields and measures each must answer. Nothing is shared until the organization says yes.',
      'If sharing stops, the program keeps a frozen copy of the last published version.',
      'Accepting connected organizations needs the Program plan. Connecting to a program works on any plan.',
    ],
  },
  {
    slug: 'importing',
    title: 'Importing projects and shapes',
    paths: ['/prototypes/projects/import', '/prototypes/projects/import-work-areas', '/prototypes/workspace-settings/import-export'],
    body: [
      'Projects import from a spreadsheet: .xlsx, .xls or .csv, up to 20 MB. Pick a field for each column; its first values show beside it.',
      'Values the workspace doesn’t know are matched to ones it does, never added. “In construction” becomes Implementation, not a new stage.',
      'Rows that can’t go in are listed with the reason, and you can download them to fix.',
      'Undo removes everything one import wrote. Imported projects wait for a publish like any other change.',
      'Work area shapes come from a zipped shapefile or file geodatabase, up to 100 MB, matched to projects by number or name.',
    ],
  },
];

/** The article for a base-less path: the longest matching prefix, or none. */
export const articleForPath = (path: string): HelpArticle | undefined => {
  let best: { article: HelpArticle; length: number } | undefined;
  for (const article of HELP_ARTICLES) {
    for (const prefix of article.paths) {
      const hit = path === prefix || path.startsWith(`${prefix}/`);
      if (hit && (!best || prefix.length > best.length)) best = { article, length: prefix.length };
    }
  }
  return best?.article;
};
