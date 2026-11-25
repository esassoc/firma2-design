import { withBase } from './base';

// Shared wiring for a taxonomy record page in Workspace settings — a project
// type or classification. Seeded records have their own static route;
// one added in this browser opens on the kind's `draft` route with its slug
// in the query, because a static site cannot build a page for it. Every
// component on either route asks this module which record it is showing.

/** The record's slug: the server-rendered one, else `?slug=` on a draft route. */
export const recordSlug = (el: HTMLElement): string =>
  el.dataset.slug || new URLSearchParams(window.location.search).get('slug') || '';

/** Put a (new) name everywhere the page shows it: the h1, the last crumb, the tab. */
export const retitle = (name: string): void => {
  const h1 = document.querySelector('.esa-page-header__title');
  const crumb = document.querySelector('.esa-breadcrumbs__current');
  const old = h1?.textContent ?? '';
  if (h1) h1.textContent = name;
  if (crumb) crumb.textContent = name;
  document.title = old && document.title.startsWith(old) ? name + document.title.slice(old.length) : document.title;
};

/**
 * Put a record's groups in the crumbs, outermost first, between the list's
 * crumb and the record's own: "Classifications › Practice area › Forests & fuels › Prescribed fire". The build draws the seeded path; this
 * redraws it from the browser's store, where groups are moved, added and
 * converted — so the trail is the full, current path on every record page,
 * a draft's included (user, 2026-11-23: the lowest level showed no path).
 * Each crumb is a copy of the list's own, so it is the lego's markup.
 */
export const pathCrumbs = (trail: { name: string; href: string }[]): void => {
  const list = document.querySelector('.esa-breadcrumbs__list');
  const current = list?.querySelector(':scope > .esa-breadcrumbs__item[aria-current="page"]');
  // The crumb just before the groups: the last linked one that is not a group's.
  const items = Array.from(list?.querySelectorAll<HTMLElement>(':scope > .esa-breadcrumbs__item:not([aria-current])') ?? []).filter((li) => li.querySelector('a.esa-breadcrumbs__link'));
  const home = items.find((li) => !('groupCrumb' in li.dataset) && /\/workspace-settings\/classifications\/?$/.test(li.querySelector('a')?.getAttribute('href') ?? ''));
  if (!list || !current || !home) return;
  // Whatever stood between them was the path as the build knew it.
  for (let node = home.nextElementSibling; node && node !== current; ) {
    const next = node.nextElementSibling;
    node.remove();
    node = next;
  }
  for (const group of trail) {
    const crumb = home.cloneNode(true) as HTMLElement;
    crumb.dataset.groupCrumb = '';
    const link = crumb.querySelector<HTMLAnchorElement>('a.esa-breadcrumbs__link')!;
    link.href = group.href;
    link.textContent = group.name;
    current.before(crumb);
  }
  // The bar folds a long trail behind "…"; let it measure the new one.
  window.dispatchEvent(new Event('resize'));
};

/** Where a record opens, seeded or local. `listPath` is base-less ("/prototypes/…"). */
export const recordHref = (listPath: string, slug: string): string =>
  withBase(slug.startsWith('local-') ? `${listPath}/draft?slug=${encodeURIComponent(slug)}` : `${listPath}/${slug}`);
