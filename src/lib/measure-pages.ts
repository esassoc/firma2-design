// Where a performance measure is READ versus where it is SET UP — two pages
// for one entity, as classifications have (user, 2026-10-09). The reading
// pages live in the main menu; the catalog and each measure's settings page
// live in Workspace settings › Projects.

/** The reader-facing index: every published measure and its portfolio figure. */
export const MEASURES_INDEX = '/prototypes/performance-measures';

/** One measure's reading page. */
export const measurePageHref = (slug: string): string => `${MEASURES_INDEX}/${slug}`;

/** One measure's settings page (seeded measures; browser-made ones use the draft route). */
export const measureSettingsHref = (slug: string): string => `/prototypes/workspace-settings/performance-measures/${slug}`;
