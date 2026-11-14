// The Featured photo, as this browser has set it. The prototype has no store,
// so a manager's choice lives here and both the record's gallery and the public
// page read it over the seed (src/data/firma2-featured-photos.ts).
import { seededFeatured } from '../data/firma2-featured-photos';

const KEY = 'firma2:featured-photos';
export const FEATURED_EVENT = 'firma2:featured-photo';

const readAll = (): Record<string, number> => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

/** The Featured photo's index for a record with `count` photos; -1 with none. */
export const readFeatured = (slug: string, count: number): number => {
  const chosen = readAll()[slug];
  return typeof chosen === 'number' && chosen >= 0 && chosen < count ? chosen : seededFeatured(slug, count);
};

/** Mark photo `index` Featured, and tell every gallery on the page. */
export const writeFeatured = (slug: string, index: number): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...readAll(), [slug]: index }));
  } catch {
    /* blocked storage: the choice lasts until the page reloads */
  }
  window.dispatchEvent(new CustomEvent(FEATURED_EVENT, { detail: { slug, index } }));
};

/** The project slug of the record page this script runs on, from the route. */
export const slugFromLocation = (): string => {
  const parts = location.pathname.split('/').filter(Boolean);
  const at = parts.findIndex((p) => p === 'projects' || p === 'public');
  return at >= 0 ? (parts[at + 1] ?? '') : '';
};
