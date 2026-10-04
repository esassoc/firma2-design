import { withBase } from './base';

// Shared wiring for a taxonomy record page in Workspace settings — a project
// type, classification or tag. Seeded records have their own static route;
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

/** Where a record opens, seeded or local. `listPath` is base-less ("/prototypes/…"). */
export const recordHref = (listPath: string, slug: string): string =>
  withBase(slug.startsWith('local-') ? `${listPath}/draft?slug=${encodeURIComponent(slug)}` : `${listPath}/${slug}`);
