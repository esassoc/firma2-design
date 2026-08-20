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

  { key: 'projects', label: 'Projects', href: '/prototypes/projects', icon: 'folder', group: 'Track' },
  { key: 'organizations', label: 'Organizations', icon: 'users', group: 'Track' },
  { key: 'funding-sources', label: 'Funding Sources', icon: 'database', group: 'Track' },

  { key: 'progress-dashboard', label: 'Progress Dashboard', icon: 'layout-dashboard', group: 'Report' },
  { key: 'performance-measures', label: 'Performance Measures', href: '/prototypes/performance-measures', icon: 'trending-up', group: 'Report' },
  { key: 'funding-status', label: 'Funding Status', icon: 'credit-card', group: 'Report' },

  { key: 'users', label: 'Users', icon: 'user', group: 'Manage' },
  { key: 'manage-organizations', label: 'Manage Organizations', icon: 'users', group: 'Manage' },
  { key: 'manage-funding-sources', label: 'Manage Funding Sources', icon: 'database', group: 'Manage' },
  { key: 'custom-pages', label: 'Custom Pages', icon: 'file-text', group: 'Manage' },
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
