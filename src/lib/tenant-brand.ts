// The tenant's brand — one colour, and everything else derived from it.
//
// WHERE THIS CAME FROM. Hackathon team 3's branding screen: a tenant picks a
// hex and the whole application re-skins, because every brand role in the
// theme already routes through a twelve-step ramp (`--firma2-brand-1..12` in
// theme-firma2.css). Pointing all twelve at one colour would make every
// subtle surface a saturated fill, so the ramp is DERIVED with color-mix()
// in oklab — perceptually even, no colour library.
//
// HOW IT LANDS. Nothing here writes a role token. The derived values go on
// <html> as `--tenant-brand-*` primitives plus a `data-tenant-brand`
// attribute, and src/styles/tenant-brand.css maps them onto the ramp —
// light and dark — at a specificity that beats the theme file. Clearing the
// attribute restores the house brand exactly.
//
// THE FIRST APPLICATION HAPPENS IN BaseLayout's <head>, as a blocking inline
// copy of `brandVars`, for the same no-flash reason the colour scheme does.
// Change the percentages here, change them there.
//
// REFINED FROM THE HACKATHON: the text ON the brand colour is chosen, not
// assumed. The house theme puts dark text on its green; a tenant who picks a
// navy would get dark-on-navy. So the readable one of white and near-black
// is picked by contrast, and the contrast panel reports the result.

export const TENANT_BRAND_KEY = 'firma2:tenant-brand:v1';

export interface TenantBrand {
  /** The brand colour, `#rrggbb`. */
  primary: string;
}

/** The house brand — what a tenant that never chose gets. */
export const HOUSE_PRIMARY = '#46a758';

/** Swatches offered beside the picker. Invented, varied in hue and value. */
export const BRAND_SWATCHES = ['#46a758', '#2d6fb0', '#167a7a', '#6a5aa8', '#b5621f', '#a8324a', '#1f3a5f', '#e0b100'];

const TINTS = [4, 8, 14, 22, 32, 46, 62, 80];
const SHADES = [88, 62, 38];
const DARK_BASE = '#111210';
const DARK_TINTS = [3, 6, 14, 22, 30, 38, 48, 60];
const DARK_LIFTS = [88, 65, 30];

const NEAR_BLACK = '#1b1d1a';
const WHITE = '#ffffff';

export const isHex = (s: string): boolean => /^#[0-9a-f]{6}$/i.test(s.trim());

const channels = (hex: string): [number, number, number] => {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
};

/** WCAG relative luminance. */
const luminance = (hex: string): number => {
  const [r, g, b] = channels(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio, 1–21. */
export const contrast = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** The readable text colour to put on a fill of `hex`. */
export const onBrand = (hex: string): string => (contrast(hex, WHITE) >= contrast(hex, NEAR_BLACK) ? WHITE : NEAR_BLACK);

/** sRGB mix — close enough to oklab for grading a contrast, which is all it is used for. */
const mix = (hex: string, other: string, percent: number): string => {
  const a = channels(hex);
  const b = channels(other);
  const p = percent / 100;
  return (
    '#' +
    a
      .map((c, i) => Math.round(c * p + b[i] * (1 - p)))
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('')
  );
};

/** Step 11 — the brand as text on a light page (links, brand headings). */
export const brandTextColor = (hex: string): string => mix(hex, '#000000', SHADES[1]);

/** The custom properties a brand sets on <html>. */
export const brandVars = (hex: string): Record<string, string> => {
  const vars: Record<string, string> = {};
  TINTS.forEach((p, i) => (vars[`--tenant-brand-${i + 1}`] = `color-mix(in oklab, ${hex} ${p}%, white)`));
  vars['--tenant-brand-9'] = hex;
  SHADES.forEach((p, i) => (vars[`--tenant-brand-${i + 10}`] = `color-mix(in oklab, ${hex} ${p}%, black)`));
  DARK_TINTS.forEach((p, i) => (vars[`--tenant-brand-dark-${i + 1}`] = `color-mix(in oklab, ${hex} ${p}%, ${DARK_BASE})`));
  vars['--tenant-brand-dark-9'] = hex;
  DARK_LIFTS.forEach((p, i) => (vars[`--tenant-brand-dark-${i + 10}`] = `color-mix(in oklab, ${hex} ${p}%, white)`));
  vars['--tenant-on-brand'] = onBrand(hex);
  return vars;
};

export const readBrand = (): TenantBrand | null => {
  try {
    const raw = localStorage.getItem(TENANT_BRAND_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed.primary === 'string' && isHex(parsed.primary) ? parsed : null;
  } catch {
    return null;
  }
};

export const writeBrand = (brand: TenantBrand | null): boolean => {
  try {
    if (brand) localStorage.setItem(TENANT_BRAND_KEY, JSON.stringify(brand));
    else localStorage.removeItem(TENANT_BRAND_KEY);
    return true;
  } catch {
    return false;
  }
};

/** Apply (or clear, with null) a brand on the document. */
export const applyBrand = (brand: TenantBrand | null, root: HTMLElement = document.documentElement): void => {
  [...root.style].filter((p) => p.startsWith('--tenant-')).forEach((p) => root.style.removeProperty(p));
  if (!brand) {
    root.removeAttribute('data-tenant-brand');
    return;
  }
  Object.entries(brandVars(brand.primary)).forEach(([k, v]) => root.style.setProperty(k, v));
  root.setAttribute('data-tenant-brand', '');
};

export interface ContrastRow {
  label: string;
  ratio: number;
  passes: boolean;
}

/** The combinations a brand colour is actually used in, graded at AA. */
export const contrastRows = (hex: string): ContrastRow[] => {
  const rows: [string, string, string, number][] = [
    ['Button text on the brand colour', onBrand(hex), hex, 4.5],
    ['Links and brand text on the page', brandTextColor(hex), WHITE, 4.5],
    ['The brand colour against the page', hex, WHITE, 3],
  ];
  return rows.map(([label, fg, bg, min]) => {
    const ratio = contrast(fg, bg);
    return { label, ratio, passes: ratio >= min };
  });
};
