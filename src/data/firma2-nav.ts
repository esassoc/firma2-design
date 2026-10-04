// The application chrome's nav model and omnibox index — the single source of
// truth for what the ProjectFirma 2.0 shell offers, shared by every prototype
// page through AppLayout.
//
// The feature surface is taken from the open-source ProjectFirma controllers
// and menu groups (Projects / Results / Organizations / Manage / About / Help,
// plus Project Finder, Funding Sources, Performance Measures, Document Library,
// Labels & Definitions, Tenant Configuration) so the shell shows the real shape
// of the product rather than an invented information architecture.
//
// ROUTES THIS SPOKE HAS NOT BUILT CARRY NO `href`. esa-sidebar-nav renders an
// href-less item as an inert span rather than a link, so the nav can show the
// whole app without shipping a dozen dead links. Give an item an href the
// moment its prototype exists.
//
// Paths here are root-relative and BASE-LESS — AppLayout wraps them with
// withBase() at render, the same contract src/data/prototypes.ts uses.

import { projects } from './firma2-projects';
import { CURRENT_USER_ORGANIZATIONS, organizationSlug } from './firma2-directory';

export interface Firma2NavItem {
  /** Stable id, matched against AppLayout's `active` prop. */
  key: string;
  label: string;
  /** Omit for a route this spoke has not built — it renders inert, not as a dead link. */
  href?: string;
  /** esa-icon registry name. The sidenav collapses to an icon rail, so every item needs one. */
  icon: string;
  /** Section heading this item sits under. Items are grouped in array order. */
  group?: string;
  /**
   * The label names a renameable noun (src/data/firma2-vocabulary.ts), so the
   * tenant's vocabulary rewrites it. Opt-in: "Progress Dashboard" names a feature,
   * not the record, and stays as written.
   */
  aliasable?: boolean;
  /** Sub-rows: the item becomes an expandable parent instead of a link. */
  children?: Firma2NavItem[];
}

// In reading order: an unheaded block of starting points (your projects, the
// map), then the whole workspace, then the reader's own organizations. There
// is no Manage group: administering the tenant (users, organizations, GIS subscriptions) lives in Workspace settings,
// the mode below, so the app rail carries only what every reader comes to do.
//
// WORKSPACE is everything shared across the tenant — its records and its
// results in one list, because a reader looking for Progress Dashboard should not
// have to know it was filed under "Report" and Funding Sources under "Track".
//
// Home is not a row: the wordmark at the top of the rail is already a link to
// `/`, and a second one below it would be two affordances for one destination.
// (An organization's Home, below, is a different place: that organization's.)
export const navItems: Firma2NavItem[] = [
  // UNGROUPED, AT THE TOP: the reader's own starting points need no heading.
  // My Projects is the editor's landing page (hackathon team 5), first: it is
  // where someone who updates projects starts; Projects below is the portfolio.
  { key: 'my-projects', label: 'My Projects', href: '/prototypes/my-projects', icon: 'home', aliasable: true },
  { key: 'map', label: 'Map', href: '/prototypes/map', icon: 'map-pin' },

  { key: 'projects', label: 'Projects', href: '/prototypes/projects', icon: 'folder', group: 'Workspace', aliasable: true },
  // No index route yet — only one page per classification — so the row is inert.
  { key: 'classifications', label: 'Classifications', href: '/prototypes/classifications', icon: 'list', group: 'Workspace', aliasable: true },
  { key: 'progress-dashboard', label: 'Progress Dashboard', icon: 'layout-dashboard', group: 'Workspace' },
  // MORE: the workspace's less-visited lists, one expandable row so the
  // everyday rows above stay short. Members and Support Requests have no route
  // yet, so they render dimmed (the navItems contract).
  {
    key: 'more',
    label: 'More',
    icon: 'ellipsis',
    group: 'Workspace',
    children: [
      { key: 'organizations', label: 'Organizations', icon: 'users', aliasable: true },
      { key: 'funding-sources', label: 'Funding Sources', icon: 'database', aliasable: true },
      { key: 'performance-measures', label: 'Performance Measures', href: '/prototypes/performance-measures', icon: 'trending-up', aliasable: true },
      { key: 'members', label: 'Members', icon: 'user' },
      { key: 'support-requests', label: 'Support Requests', icon: 'circle-question-mark' },
    ],
  },
];

/**
 * The app rail as one page sees it. When the current page lives inside a
 * parent row (More), its row steps out and sits just above that parent, in
 * the parent's group: a closed parent would otherwise hide where you are.
 */
export const navItemsFor = (active?: string): Firma2NavItem[] =>
  navItems.flatMap((item) => {
    const current = item.children?.find((child) => child.key === active);
    if (!current) return [item];
    return [
      { ...current, group: item.group },
      { ...item, children: item.children!.filter((child) => child !== current) },
    ];
  });

/** The group heading over the reader's organizations, singular for one. */
export const YOUR_ORGANIZATIONS_GROUP =
  CURRENT_USER_ORGANIZATIONS.length === 1 ? 'Your organization' : 'Your organizations';

// YOUR ORGANIZATIONS: one expandable row per organization the reader belongs
// to, each holding the same five pages scoped to it. No route is built yet, so
// the sub-rows carry no href and render dimmed (the navItems contract); the
// parent row itself stays live, because opening it is the only way to see what
// an organization offers. Keys carry the slug so a future page can mark itself.
export const organizationNavItems: Firma2NavItem[] = CURRENT_USER_ORGANIZATIONS.map((name) => {
  const slug = organizationSlug(name);
  return {
    key: `org-${slug}`,
    label: name,
    icon: 'building-2',
    group: YOUR_ORGANIZATIONS_GROUP,
    children: [
      { key: `org-${slug}-home`, label: 'Home', icon: 'home' },
      { key: `org-${slug}-projects`, label: 'Projects', icon: 'folder', aliasable: true },
      { key: `org-${slug}-updates`, label: 'Updates', icon: 'activity' },
      { key: `org-${slug}-views`, label: 'Views', icon: 'eye' },
      { key: `org-${slug}-reports`, label: 'Reports', icon: 'file-text' },
    ],
  };
});

// WORKSPACE SETTINGS REPLACES THE RAIL rather than sitting on a page under it.
// Settings is a mode, not a destination: once you are in it, the app's
// navigation is noise and the settings sections are the navigation. Each
// section is its own page so it can be bookmarked and linked, and the groups
// are the objects being configured, in the order a new tenant sets them up.
//
// The section list is ProjectFirma's own tenant configuration (Tenant
// Configuration, project stages, custom attributes, classification systems,
// organization types, field definitions, roles), regrouped by object. Unbuilt
// sections carry no href, same contract as navItems.
//
// "Back to app" is the first row and ungrouped: leaving the mode is the one
// thing every reader of this rail can want, wherever they are in it.
export const workspaceSettingsNavItems: Firma2NavItem[] = [
  { key: 'back-to-app', label: 'Back to app', href: '/prototypes/projects', icon: 'arrow-left' },

  // PERSONAL FIRST: the one section every account can use. The four pages were one Settings screen;
  // split the way Linear splits its account settings, so each is linkable and
  // Security and access had somewhere to go. Routes live under /prototypes/settings
  // because these are one person's settings, not the workspace's.
  { key: 'me-preferences', label: 'Preferences', href: '/prototypes/settings/preferences', icon: 'star', group: 'Personal' },
  { key: 'me-profile', label: 'Profile', href: '/prototypes/settings/profile', icon: 'circle-user', group: 'Personal' },
  { key: 'me-notifications', label: 'Notifications', href: '/prototypes/settings/notifications', icon: 'bell', group: 'Personal' },
  { key: 'me-security', label: 'Security and access', href: '/prototypes/settings/security', icon: 'circle-check', group: 'Personal' },

  // "Look and language", not "Workspace": the workspace's own record moved to
  // Administration › Workspace, and two "Workspace" headings in one rail would
  // make a reader guess which one holds the name. Branding is the look; labels
  // and definitions are the language.
  { key: 'ws-branding', label: 'Branding', href: '/prototypes/workspace-settings/branding', icon: 'eye', group: 'Look and language' },
  { key: 'ws-labels', label: 'Labels and definitions', href: '/prototypes/workspace-settings/labels', icon: 'file-text', group: 'Look and language' },

  { key: 'ws-project-types', label: 'Project types', href: '/prototypes/workspace-settings/project-types', icon: 'folder', group: 'Projects' },
  { key: 'ws-classifications', label: 'Classifications', href: '/prototypes/workspace-settings/classifications', icon: 'folder', group: 'Projects' },
  { key: 'ws-tags', label: 'Tags', href: '/prototypes/workspace-settings/tags', icon: 'list', group: 'Projects' },
  { key: 'ws-stages', label: 'Stages', href: '/prototypes/workspace-settings/stages', icon: 'activity', group: 'Projects' },
  { key: 'ws-custom-fields', label: 'Custom fields', href: '/prototypes/workspace-settings/custom-fields', icon: 'pencil', group: 'Projects' },

  // MAPS: where projects come from, and what every map sits against. A
  // workspace's GIS arrangement, set once — hackathon team 2.
  { key: 'ws-project-source', label: 'Project source', href: '/prototypes/workspace-settings/project-source', icon: 'database', group: 'Maps', aliasable: true },
  { key: 'ws-gis-subscriptions', label: 'GIS subscriptions', href: '/prototypes/workspace-settings/gis-subscriptions', icon: 'rotate-ccw', group: 'Maps' },
  { key: 'ws-gis-sync', label: 'GIS sync', href: '/prototypes/workspace-settings/gis-sync', icon: 'rotate-ccw', group: 'Maps' },
  { key: 'ws-map-layers', label: 'Map layers', href: '/prototypes/workspace-settings/map-layers', icon: 'map-pin', group: 'Maps' },

  { key: 'ws-funding-fields', label: 'Funding source fields', href: '/prototypes/workspace-settings/funding-source-fields', icon: 'database', group: 'Funding' },


  // ADMINISTRATION is the workspace's own records rather than its vocabulary:
  // what it is called, who belongs to it, and the data going in and out. Last,
  // the way Linear orders it — a new tenant configures its lists first and
  // invites people once there is something to show them. Workspace is the page
  // that was "General"; its route keeps the old slug so existing links hold.
  { key: 'ws-workspace', label: 'Workspace', href: '/prototypes/workspace-settings/general', icon: 'settings', group: 'Administration' },
  { key: 'ws-organizations', label: 'Organizations', href: '/prototypes/workspace-settings/organizations', icon: 'users', group: 'Administration', aliasable: true },
  { key: 'ws-users', label: 'Users', href: '/prototypes/workspace-settings/users', icon: 'user', group: 'Administration' },
  { key: 'ws-security', label: 'Security', href: '/prototypes/workspace-settings/security', icon: 'shield', group: 'Administration' },
  { key: 'ws-custom-pages', label: 'Custom pages', href: '/prototypes/workspace-settings/custom-pages', icon: 'file-text', group: 'Administration' },
  { key: 'ws-import-export', label: 'Import and export', href: '/prototypes/workspace-settings/import-export', icon: 'upload', group: 'Administration' },

  // The index of the organization's settings pages (General, Members, …) and
  // the way out of it. Its sub-pages keep this row active.
  { key: 'ws-organization-settings', label: 'Settings', href: '/prototypes/workspace-settings/organization-settings', icon: 'settings', group: 'Your organization' },
];

/** Where Settings opens: the first row of its rail. */
export const SETTINGS_HOME = '/prototypes/settings/preferences';

/** The keyboard shortcut that opens Settings, as the omnibox shows it. */
export const SETTINGS_SHORTCUT_HINT = 'Shortcut: G then S';

/** One organization's settings pages, listed on its Organization settings index. */
export const organizationSettingsPages = [
  { label: 'General', href: '/prototypes/workspace-settings/organization-settings/general' },
  { label: 'Members', href: '/prototypes/workspace-settings/organization-settings/members' },
  { label: 'Access and permissions', href: '/prototypes/workspace-settings/organization-settings/access' },
  { label: 'Notifications', href: '/prototypes/workspace-settings/organization-settings/notifications' },
];

export interface Firma2SearchEntry {
  /** Destination route, base-less. */
  id: string;
  title: string;
  /** The record's distinguishing attribute, not a description of what it is. */
  subtitle?: string;
  category?: string;
}

/** Project count per lead organization, so the Organizations results carry a real datum. */
const projectsPerOrg = projects.reduce<Record<string, number>>((acc, p) => {
  acc[p.leadOrganization] = (acc[p.leadOrganization] ?? 0) + 1;
  return acc;
}, {});

/**
 * The omnibox index: the pages that exist, plus every project and lead
 * organization as a findable record.
 *
 * Record results all resolve to the projects list, because no detail route
 * exists yet — selecting one lands you where the record is actually visible
 * rather than on a 404. Re-point these at the detail route when it ships.
 */
export const searchIndex: Firma2SearchEntry[] = [
  // Rows inside a parent (More) are pages too; they take the parent's group.
  ...navItems
    .flatMap((item) => [item, ...(item.children ?? []).map((child) => ({ ...child, group: item.group }))])
    .filter((item) => item.href)
    .map((item) => ({
      id: item.href!,
      title: item.label,
      subtitle: item.group,
      category: 'Pages',
    })),
  // SETTINGS IS FINDABLE BY NAME. The omnibox matches title and subtitle, never
  // category, so a reader typing "settings" found nothing but the one row that
  // happened to be called it. Every settings page now carries its place in the
  // rail as its subtitle — "Settings › Projects" — which both answers that query
  // and tells "Stages" apart from a page in the app. Back to app is a way out of
  // the settings rail, not a destination.
  { id: SETTINGS_HOME, title: 'Settings', subtitle: SETTINGS_SHORTCUT_HINT, category: 'Settings' },
  ...workspaceSettingsNavItems
    .filter((item) => item.href && item.group)
    .map((item) => ({
      id: item.href!,
      // The organization's index is "Settings" in its rail group; alone in a
      // result list it would read as the whole of Settings.
      title: item.key === 'ws-organization-settings' ? 'Organization settings' : item.label,
      subtitle: `Settings › ${item.group}`,
      category: 'Settings',
    })),
  // The organization's own pages hang off its index, not the rail, so they are
  // listed here by hand.
  ...organizationSettingsPages.map((page) => ({
    id: page.href,
    title: page.label,
    subtitle: 'Settings › Organization settings',
    category: 'Settings',
  })),
  ...projects.map((p) => ({
    id: '/prototypes/projects',
    title: p.projectName,
    subtitle: `${p.stage} · ${p.county} County`,
    category: 'Projects',
  })),
  ...Object.keys(projectsPerOrg)
    .sort()
    .map((org) => ({
      id: '/prototypes/projects',
      title: org,
      subtitle: `${projectsPerOrg[org]} project${projectsPerOrg[org] === 1 ? '' : 's'}`,
      category: 'Organizations',
    })),
];
