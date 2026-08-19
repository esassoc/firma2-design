// Single source of truth for the design-system sidebar + breadcrumbs.
// Types come from @esa/docs so this data is structurally compatible with DocsShell.
//
// The `foundations` group below is GENERIC — every spoke documents the same five
// token-driven foundation pages, so keep it as-is.
//
// `componentGroups` MIRRORS THE HUB'S OWN CATEGORIES (apps/site/src/data/catalog.ts
// § CATEGORIES) rather than curating a subset: this spoke documents the FULL
// @esa/ecology kit wearing the ProjectFirma 2.0 skin. Regenerate it from the hub
// when the hub's catalog changes — a group here that the hub has dropped renders a
// sidebar row pointing at a page nobody ports.
//
// `Deprecated` stays LAST, mirroring the hub: a deprecated component is still
// shipped and still documented (a spoke mid-migration is exactly who needs the
// page), but it must not sit in the group people shop from.
import type { NavItem, NavGroup } from '@esa/docs/nav';
export type { NavItem, NavGroup };

export const foundations: NavGroup = {
  label: 'Foundations',
  items: [
    { label: 'Color', href: '/design-system/foundations/color' },
    { label: 'Typography', href: '/design-system/foundations/typography' },
    { label: 'Spacing', href: '/design-system/foundations/spacing' },
    { label: 'Radius', href: '/design-system/foundations/radius' },
    { label: 'Iconography', href: '/design-system/foundations/iconography' },
  ],
};

const c = (label: string, name: string): NavItem => ({
  label,
  href: `/design-system/components/${name}`,
});

export const componentGroups: NavGroup[] = [
  {
    label: 'Core',
    items: [
      c('Button', 'esa-button'),
      c('Button Group', 'esa-button-group'),
      c('Button Toggle', 'esa-button-toggle'),
      c('Icon', 'esa-icon'),
    ],
  },
  {
    label: 'Layout & Sections',
    items: [
      c('App Shell', 'esa-app-shell'),
      c('Page Header', 'esa-page-header'),
      c('Stat', 'esa-stat'),
      c('Container', 'esa-container'),
    ],
  },
  {
    label: 'Forms',
    items: [
      c('Text Field', 'esa-text-field'),
      c('Textarea', 'esa-textarea'),
      c('Select', 'esa-select'),
      c('Combobox', 'esa-combobox'),
      c('Input Tag', 'esa-input-tag'),
      c('Checkbox', 'esa-checkbox'),
      c('Checkbox Group', 'esa-checkbox-group'),
      c('Radio Group', 'esa-radio-group'),
      c('Switch Toggle', 'esa-switch-toggle'),
      c('Form Field', 'esa-form-field'),
      c('Field Error', 'esa-field-error'),
      c('Error Summary', 'esa-error-summary'),
      c('Date Picker', 'esa-date-picker'),
      c('Color Picker', 'esa-color-picker'),
      c('Range Slider', 'esa-range-slider'),
      c('File Upload', 'esa-file-upload'),
      c('File List', 'esa-file-list'),
    ],
  },
  {
    label: 'Display',
    items: [
      c('Avatar', 'esa-avatar'),
      c('Badge', 'esa-badge'),
      c('Card', 'esa-card'),
      c('Chip Group', 'esa-chip-group'),
      c('Alert Box', 'esa-alert-box'),
      c('Danger Zone', 'esa-danger-zone'),
      c('Pill', 'esa-pill'),
      c('Pillbox', 'esa-pillbox'),
      c('Progress Bar', 'esa-progress-bar'),
      c('Loading Spinner', 'esa-loading-spinner'),
      c('Loading Overlay', 'esa-loading-overlay'),
      c('Empty State', 'esa-empty-state'),
      c('Back To Top', 'esa-back-to-top'),
      c('Collapsible', 'esa-collapsible'),
      c('Keycap', 'esa-kbd'),
    ],
  },
  {
    label: 'Overlays',
    items: [
      c('Dialog', 'esa-dialog'),
      c('Confirm Dialog', 'esa-confirm-dialog'),
      c('Side Dialog', 'esa-side-dialog'),
      c('Popover', 'esa-popover'),
      c('Tooltip', 'esa-tooltip'),
      c('Dropdown Menu', 'esa-dropdown-menu'),
      c('Command Palette', 'esa-command-palette'),
      c('Entity Search', 'esa-entity-search'),
      c('Snackbar', 'esa-snackbar-container'),
      c('Snackbar Item', 'esa-snackbar-item'),
      c('Search Panel', 'esa-search-panel'),
    ],
  },
  {
    label: 'Navigation',
    items: [
      c('App Bar', 'esa-app-bar'),
      c('Nav Dropdown', 'esa-nav-dropdown'),
      c('Link Column', 'esa-link-column'),
      c('Header Nav', 'esa-header-nav'),
      c('Sidebar Nav', 'esa-sidebar-nav'),
      c('Breadcrumbs', 'esa-breadcrumbs'),
      c('Pagination', 'esa-pagination'),
      c('Tab Layout', 'esa-tab-layout'),
    ],
  },
  {
    label: 'Filters',
    items: [
      c('Filter Container', 'esa-filter-container'),
      c('Filter Dropdown', 'esa-filter-dropdown'),
      c('Filter Pills', 'esa-filter-pills'),
      c('Filter Clear Button', 'esa-filter-clear-button'),
    ],
  },
  {
    label: 'Data & Editors',
    items: [
      c('Chart', 'esa-chart'),
      c('Data Grid', 'esa-grid'),
      c('Map', 'esa-map'),
      c('Rich Text Editor', 'esa-rich-text-editor'),
    ],
  },
  {
    label: 'Deprecated',
    items: [
      c('Icon Link', 'esa-icon-link'),
      c('Icon Button', 'esa-icon-button'),
    ],
  },
];

export const allGroups: NavGroup[] = [foundations, ...componentGroups];
