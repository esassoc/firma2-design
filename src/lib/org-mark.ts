// org-mark — an organization's emblem: its real logo when the directory holds
// one, and initials in a shape on a hue when it does not.
//
// WHY THIS IS A STRING FUNCTION AND NOT ONLY A COMPONENT. The directory renders
// its results in the BROWSER (which entries match a typed query is client state),
// and an .astro component is compile-time — it does not exist at runtime. So the
// emblem is authored once here, as markup, and both callers use the same function:
// firma2-org-mark.astro pipes it through set:html, the directory's script pipes it
// through innerHTML on a node it just built. One renderer, no drift.
//
// THE LOGO IS THE MARK WHEN THERE IS ONE. The directory is real organizations
// (Deschutes National Forest, ODFW, Deschutes Land Trust), and a roster of real
// partners wearing invented emblems reads as a placeholder for the thing it is
// meant to show. So a record may carry `logo`, a file under public/org-logos/,
// and the renderer emits it in the same square box the generated mark would take:
// white field, hairline, the logo fitted inside. Andy authorised real marks on
// 2026-09-11 because the fidelity is the point of the prototype. The generated
// mark stays as the fallback for the organizations that have no logo on file
// (a private ranch, a grazing association, a tenant that has not uploaded one
// yet), which is exactly the slot a real build would fill from an upload.
//
// THE ONE PLACE RAW COLOUR IS ALLOWED. Every other surface in this repo reads
// var(--token). A mark cannot: its hue is DATA (one per organization, 47 of them),
// and there is no token for "hue 214". So the colour is computed here, from the
// datum, with saturation and lightness FIXED — the tokens the rest of the system
// would have given are replaced by three constants, not by a free hand. Fixed L
// is what keeps 47 emblems reading as one set instead of a paint chart, and what
// guarantees the initials clear contrast on every hue rather than only on the
// lucky ones.

import { withBase } from './base';

export type OrgMarkShape = 'circle' | 'shield' | 'hex' | 'square';

export type OrgMarkSize = 'sm' | 'md' | 'lg';

export interface OrgMark {
  /** Two or three letters, set in the display face. The fallback when there is no logo. */
  initials: string;
  /** 0 to 360. The only thing that varies between two marks of the same shape. */
  hue: number;
  shape: OrgMarkShape;
  /** Root-relative path to the organization's own logo, e.g. `/org-logos/odfw.svg`. Wins over the generated mark. */
  logo?: string;
}

/** Rendered size in px. sm rides a table row, md a result tile, lg a detail header. */
const SIZE_PX: Record<OrgMarkSize, number> = { sm: 28, md: 40, lg: 56 };

// The emblem is drawn once at 40 units and scaled by the SVG viewBox, so a shape
// path is written once and holds at every size.
const BOX = 40;

// EVERY MARK TAKES THE SAME LANDSCAPE BOX, 2.5 wide to 1 tall. Real logos are
// mostly wordmarks (OWEB, NRCS, ODOT, a watershed council's name under a river),
// and a wordmark squeezed into a square at 28px is a smudge. A seal sits centred
// in the same box with air either side. One box for both kinds is what keeps the
// name column aligned down a grid whose rows mix logos with generated marks.
const WIDE = 2.5;

/**
 * The three fixed values. Saturation stays low enough that a mark never competes
 * with the page's own chrome; the lightness pair holds roughly 8:1 between ink and
 * field at every hue, so the initials are legible at 28px on all 360 of them.
 */
const FIELD_S = 42;
const FIELD_L = 93;
const RING_S = 32;
const RING_L = 78;
const INK_S = 52;
const INK_L = 30;

/** The mark's field, ring and ink for one hue. Exported so a caller can tint a container to match. */
export const orgMarkColors = (hue: number): { field: string; ring: string; ink: string } => {
  const h = ((Math.round(hue) % 360) + 360) % 360;
  return {
    field: `hsl(${h} ${FIELD_S}% ${FIELD_L}%)`,
    ring: `hsl(${h} ${RING_S}% ${RING_L}%)`,
    ink: `hsl(${h} ${INK_S}% ${INK_L}%)`,
  };
};

// Four silhouettes, each drawn to the same 40-unit box with a 1-unit inset so the
// ring stroke is never clipped. They are not decoration: a reader scanning 47
// results reads the shape before the letters, and the directory assigns shape by
// level, so federal/state/county/local/tribal/NGO separate at a glance.
const SHAPE_PATH: Record<OrgMarkShape, string> = {
  // A disc.
  circle: 'M20 1a19 19 0 1 0 0 38 19 19 0 1 0 0-38Z',
  // A pointy-top hexagon — the seal a district or a county puts on a document.
  hex: 'M20 1 36.45 10.5 36.45 29.5 20 39 3.55 29.5 3.55 10.5Z',
  // A shield — the silhouette an agency badge has had for a century.
  shield: 'M20 1 37 6.5V20.5C37 29.8 29.6 35.8 20 39 10.4 35.8 3 29.8 3 20.5V6.5Z',
  // A rounded square.
  square: 'M12 1h16a11 11 0 0 1 11 11v16a11 11 0 0 1-11 11H12A11 11 0 0 1 1 28V12A11 11 0 0 1 12 1Z',
};

/** A shield's optical centre sits above its geometric one, so its letters ride up. */
const TEXT_Y: Record<OrgMarkShape, number> = { circle: 20, hex: 20, shield: 18.5, square: 20 };

/** Letters have to shrink as they multiply or a three-letter mark runs out of field. */
const TEXT_SIZE = (letters: number): number => (letters >= 3 ? 12.5 : letters === 2 ? 15.5 : 18);

/** Initials are authored data, but a mark is written into innerHTML — so the guard stays. */
const clean = (initials: string): string =>
  (initials ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 3);

/**
 * The emblem, as markup: an <img> of the logo when the record has one, the
 * generated SVG otherwise. Both carry the same class and the same box, so a
 * caller lays out a mark without knowing which kind it got.
 *
 * Decorative on purpose: every place a mark appears, the organization's name is
 * the text beside it, and an emblem that announced "M L T" before the name would
 * make the roster twice as long to hear. The logo's alt is empty for the same reason.
 */
/** Where the generated mark sits inside the landscape box. A logo always fills it. */
export type OrgMarkAlign = 'start' | 'center';

export const orgMarkHtml = (mark: OrgMark, size: OrgMarkSize = 'md', align: OrgMarkAlign = 'start'): string => {
  const px = SIZE_PX[size];

  const wide = Math.round(px * WIDE);

  if (mark.logo) {
    return (
      `<img class="firma2-org-mark firma2-org-mark--${size} firma2-org-mark--logo"` +
      ` src="${withBase(mark.logo)}" width="${wide}" height="${px}" alt="" loading="lazy" decoding="async" />`
    );
  }

  const { field, ring, ink } = orgMarkColors(mark.hue);
  const letters = clean(mark.initials);
  const path = SHAPE_PATH[mark.shape] ?? SHAPE_PATH.circle;

  return [
    `<svg class="firma2-org-mark firma2-org-mark--${size}" width="${wide}" height="${px}"`,
    // The drawing is the square; the box is wide. preserveAspectRatio parks the
    // square at the box's start beside a name, or at its centre in a grid cell.
    ` viewBox="0 0 ${BOX} ${BOX}" preserveAspectRatio="${align === 'center' ? 'xMidYMid' : 'xMinYMid'} meet"`,
    ` xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">`,
    `<path d="${path}" fill="${field}" stroke="${ring}" stroke-width="1" />`,
    `<text x="20" y="${TEXT_Y[mark.shape] ?? 20}" text-anchor="middle" dominant-baseline="central"`,
    ` font-size="${TEXT_SIZE(letters.length)}" font-weight="650" letter-spacing="0.2" fill="${ink}">${letters}</text>`,
    `</svg>`,
  ].join('');
};
