/**
 * The ceiling on a page's main content column, in the app chrome.
 *
 * AppLayout applies it to the whole pane by default. A page with a rail on its
 * trailing edge (the project record, the projects index's peek) opts out with
 * `width="full"` and applies it to its MAIN column instead, so the rail keeps
 * the window's edge while the reading column stops growing beside it.
 *
 * 1280px and not narrower because of the project record: its `.sidebar` track
 * wraps the rail below the content once the main column drops under ~40rem plus
 * the rail, and the cap must stay clear of that on wide screens.
 */
export const CONTENT_MAX = '1280px';

/**
 * The narrower ceiling for pages that are read rather than surveyed — settings
 * sections, forms, short definition lists. AppLayout's `width="reading"`.
 *
 * 48rem (768px): a line of body text stops around 90 characters, short enough
 * to read across, and a five-column settings table
 * still fits without wrapping its headers into three lines. Pages whose job is
 * surface — the projects grid, the record, an editor with a live preview beside
 * it — keep CONTENT_MAX.
 */
export const CONTENT_READING = '48rem';
