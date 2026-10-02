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
   * tenant's vocabulary rewrites it. Opt-in: "Project Finder" names a feature,
   * not the record, and stays as written.
   */
  aliasable?: boolean;
}

// Four groups, in reading order: find something, work the records, read the
// results, administer the tenant.
//
// Organizations and Funding Sources deliberately appear TWICE — once under Track
// as the browse index every user sees, once under Manage as the admin surface,
// which is how ProjectFirma itself splits them. The group heading alone was not
// enough to tell two identical words apart at a glance, so the Manage entries
// carry the verb in their label.
//
// Home is not a row: the wordmark at the top of the rail is already a link to
// `/`, and a second one below it would be two affordances for one destination.
export const navItems: Firma2NavItem[] = [
  { key: 'project-finder', label: 'Project Finder', icon: 'search', group: 'Explore' },
  { key: 'map', label: 'Map', icon: 'map-pin', group: 'Explore' },

  { key: 'projects', label: 'Projects', href: '/prototypes/projects', icon: 'folder', group: 'Track', aliasable: true },
  { key: 'organizations', label: 'Organizations', icon: 'users', group: 'Track', aliasable: true },
  { key: 'funding-sources', label: 'Funding Sources', icon: 'database', group: 'Track', aliasable: true },

  { key: 'progress-dashboard', label: 'Progress Dashboard', icon: 'layout-dashboard', group: 'Report' },
  { key: 'performance-measures', label: 'Performance Measures', href: '/prototypes/performance-measures', icon: 'trending-up', group: 'Report', aliasable: true },
  { key: 'funding-status', label: 'Funding Status', icon: 'credit-card', group: 'Report' },

  { key: 'users', label: 'Users', icon: 'user', group: 'Manage' },
  { key: 'manage-organizations', label: 'Manage Organizations', icon: 'users', group: 'Manage', aliasable: true },
  { key: 'manage-funding-sources', label: 'Manage Funding Sources', icon: 'database', group: 'Manage', aliasable: true },
  { key: 'custom-pages', label: 'Custom Pages', icon: 'file-text', group: 'Manage' },
];

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

  // PERSONAL FIRST: the one section every account can use, and the one the
  // account menu's Settings opens. The four pages were one Settings screen;
  // split the way Linear splits its account settings, so each is linkable and
  // Security & access had somewhere to go. Routes live under /prototypes/settings
  // because these are one person's settings, not the workspace's.
  { key: 'me-preferences', label: 'Preferences', href: '/prototypes/settings/preferences', icon: 'star', group: 'Personal' },
  { key: 'me-profile', label: 'Profile', href: '/prototypes/settings/profile', icon: 'circle-user', group: 'Personal' },
  { key: 'me-notifications', label: 'Notifications', href: '/prototypes/settings/notifications', icon: 'bell', group: 'Personal' },
  { key: 'me-security', label: 'Security & access', href: '/prototypes/settings/security', icon: 'circle-check', group: 'Personal' },

  // "Look and language", not "Workspace": the workspace's own record moved to
  // Administration › Workspace, and two "Workspace" headings in one rail would
  // make a reader guess which one holds the name. Branding is the look; labels
  // and definitions are the language.
  { key: 'ws-branding', label: 'Branding', href: '/prototypes/workspace-settings/branding', icon: 'eye', group: 'Look and language' },
  { key: 'ws-labels', label: 'Labels and definitions', href: '/prototypes/workspace-settings/labels', icon: 'file-text', group: 'Look and language' },

  { key: 'ws-project-types', label: 'Project types', href: '/prototypes/workspace-settings/project-types', icon: 'folder', group: 'Projects' },
  { key: 'ws-stages', label: 'Stages', href: '/prototypes/workspace-settings/stages', icon: 'activity', group: 'Projects' },
  { key: 'ws-custom-fields', label: 'Custom fields', href: '/prototypes/workspace-settings/custom-fields', icon: 'pencil', group: 'Projects' },
  { key: 'ws-classifications', label: 'Classifications', href: '/prototypes/workspace-settings/classifications', icon: 'trees', group: 'Projects' },

  { key: 'ws-organization-types', label: 'Organization types', href: '/prototypes/workspace-settings/organization-types', icon: 'users', group: 'Organizations' },
  { key: 'ws-funding-fields', label: 'Funding source fields', href: '/prototypes/workspace-settings/funding-source-fields', icon: 'database', group: 'Funding' },

  { key: 'ws-roles', label: 'Roles and permissions', href: '/prototypes/workspace-settings/roles', icon: 'circle-user', group: 'People' },

  // ADMINISTRATION is the workspace's own records rather than its vocabulary:
  // what it is called, who belongs to it, and the data going in and out. Last,
  // the way Linear orders it — a new tenant configures its lists first and
  // invites people once there is something to show them. Workspace is the page
  // that was "General"; its route keeps the old slug so existing links hold.
  { key: 'ws-workspace', label: 'Workspace', href: '/prototypes/workspace-settings/general', icon: 'settings', group: 'Administration' },
  { key: 'ws-organizations', label: 'Organizations', href: '/prototypes/workspace-settings/organizations', icon: 'users', group: 'Administration', aliasable: true },
  { key: 'ws-users', label: 'Users', href: '/prototypes/workspace-settings/users', icon: 'user', group: 'Administration' },
  { key: 'ws-import-export', label: 'Import & export', href: '/prototypes/workspace-settings/import-export', icon: 'upload', group: 'Administration' },

  // "Profile", not the organization's name. Linear lists "Your teams" by name,
  // and that was the first version — but organization names run long ("California
  // Watershed Restoration Board" is 38 characters), the rail clips without an
  // ellipsis, and the label read "…Restorati". Under the "Your organization"
  // heading, Profile says enough; the page's own title carries the full name.
  { key: 'ws-your-organization', label: 'Profile', href: '/prototypes/workspace-settings/your-organization', icon: 'home', group: 'Your organization' },
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
  ...navItems
    .filter((item) => item.href)
    .map((item) => ({
      id: item.href!,
      title: item.label,
      subtitle: item.group,
      category: 'Pages',
    })),
  // Settings sections get their own category: "Stages" or "Custom fields" read
  // alone among Pages would not say they configure the workspace. Back to app
  // is a way out of the settings rail, not a destination.
  ...workspaceSettingsNavItems
    .filter((item) => item.href && item.group)
    .map((item) => ({
      id: item.href!,
      title: item.label,
      subtitle: item.group,
      category: item.group === 'Personal' ? 'Settings' : 'Workspace settings',
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
