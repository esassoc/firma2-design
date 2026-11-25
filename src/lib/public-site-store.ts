// The public site's settings, made to persist in this browser: a DRAFT the
// administrator is editing and the PUBLISHED settings the public reads.
//
// DRAFT, THEN PUBLISH (spec decision 2). Every control on Workspace settings ›
// Public site writes the draft; the public pages read the published copy, and
// only the settings screen's preview reads the draft. Publish copies one onto
// the other. Nothing here goes live as it is typed.
//
// THE SEED IS THE BUILD'S. With nothing stored, both copies are the defaults
// the server wrote into the page, so clearing the key puts the demo back.
//
// FAKED: localStorage stands in for the workspace's saved settings, as in
// every store here. Uploaded images are kept as downscaled data URLs in the
// same key; production would store files.

import type { PublicSiteConfig, PublicSiteDefaults } from './public-site-config';

export const PUBLIC_SITE_KEY = 'firma2:public-site:v1';
/** Fired on `document` in the settings screen after every draft or publish write. */
export const PUBLIC_SITE_EVENT = 'firma2:public-site-change';

interface Stored {
  draft?: PublicSiteConfig;
  published?: PublicSiteConfig;
}

const readStored = (): Stored => {
  try {
    const parsed = JSON.parse(localStorage.getItem(PUBLIC_SITE_KEY) ?? 'null');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeStored = (next: Stored): boolean => {
  try {
    if (next.draft || next.published) localStorage.setItem(PUBLIC_SITE_KEY, JSON.stringify(next));
    else localStorage.removeItem(PUBLIC_SITE_KEY);
    document.dispatchEvent(new CustomEvent(PUBLIC_SITE_EVENT));
    return true;
  } catch {
    // Blocked or full storage (an image too many): the last saved state stands.
    return false;
  }
};

/** The defaults the server wrote into this page. */
export const readDefaults = (): PublicSiteDefaults | null => {
  try {
    return JSON.parse(document.querySelector('[data-public-site-defaults]')?.textContent ?? 'null');
  } catch {
    return null;
  }
};

const isObject = (v: unknown): v is Record<string, unknown> => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

/** A stored copy laid over the defaults, so a setting added later still has a value. */
const over = <T>(base: T, stored: unknown): T => {
  if (!isObject(base) || !isObject(stored)) return (stored === undefined ? base : stored) as T;
  const out: Record<string, unknown> = { ...stored };
  Object.keys(base).forEach((key) => (out[key] = over((base as Record<string, unknown>)[key], stored[key])));
  return out as T;
};

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

export const readPublished = (defaults: PublicSiteConfig): PublicSiteConfig => over(clone(defaults), readStored().published);

export const readDraft = (defaults: PublicSiteConfig): PublicSiteConfig => {
  const stored = readStored();
  return over(clone(defaults), stored.draft ?? stored.published);
};

export const writeDraft = (draft: PublicSiteConfig): boolean => writeStored({ ...readStored(), draft });

/** Does the draft differ from what the public reads? */
export const hasUnpublished = (defaults: PublicSiteConfig): boolean =>
  JSON.stringify(readDraft(defaults)) !== JSON.stringify(readPublished(defaults));

/** Does the public read anything other than the defaults? */
export const isCustomized = (defaults: PublicSiteConfig): boolean =>
  JSON.stringify(readPublished(defaults)) !== JSON.stringify(over(clone(defaults), undefined));

export const publishDraft = (defaults: PublicSiteConfig): boolean => {
  const draft = readDraft(defaults);
  return writeStored({ draft, published: draft });
};

export const discardDraft = (): boolean => writeStored({ published: readStored().published });

/** Put the draft back to the product's defaults. Still a draft: the public sees it on publish. */
export const resetDraft = (defaults: PublicSiteConfig): boolean => writeDraft(clone(defaults));

/** Downscale an uploaded image to a data URL small enough to keep. */
export const imageToDataUrl = (file: File, maxPx: number, type: 'image/png' | 'image/jpeg'): Promise<string> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL(type, 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('not an image'));
    };
    img.src = url;
  });
