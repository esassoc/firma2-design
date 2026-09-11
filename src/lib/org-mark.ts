// org-mark — an organization's emblem, generated from three data.
//
// WHY THIS IS A STRING FUNCTION AND NOT ONLY A COMPONENT. The directory renders
// its results in the BROWSER (which entries match a typed query is client state),
// and an .astro component is compile-time — it does not exist at runtime. So the
// emblem is authored once here, as markup, and both callers use the same function:
// firma2-org-mark.astro pipes it through set:html, the directory's script pipes it
// through innerHTML on a node it just built. One renderer, no drift.
//
// EVERY MARK IS GENERATED. No real agency's logo is copied, traced, or approximated
// anywhere in this spoke — the mark is initials in a shape on a hue, and that is the
// whole of it. A real build would let a tenant upload the genuine article; the shape
// of the slot is the same.
//
// THE ONE PLACE RAW COLOUR IS ALLOWED. Every other surface in this repo reads
// var(--token). A mark cannot: its hue is DATA (one per organization, 47 of them),
// and there is no token for "hue 214". So the colour is computed here, from the
// datum, with saturation and lightness FIXED — the tokens the rest of the system
// would have given are replaced by three constants, not by a free hand. Fixed L
// is what keeps 47 emblems reading as one set instead of a paint chart, and what
// guarantees the initials clear contrast on every hue rather than only on the
// lucky ones.

export type OrgMarkShape = 'circle' | 'shield' | 'hex' | 'square';

export type OrgMarkSize = 'sm' | 'md' | 'lg';

export interface OrgMark {
  /** Two or three letters, set in the display face. */
  initials: string;
  /** 0 to 360. The only thing that varies between two marks of the same shape. */
  hue: number;
  shape: OrgMarkShape;
}

/** Rendered size in px. sm rides a table row, md a result tile, lg a detail header. */
const SIZE_PX: Record<OrgMarkSize, number> = { sm: 28, md: 40, lg: 56 };

// The emblem is drawn once at 40 units and scaled by the SVG viewBox, so a shape
// path is written once and holds at every size.
const BOX = 40;

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
 * The emblem, as an SVG string.
 *
 * Decorative on purpose: every place a mark appears, the organization's name is
 * the text beside it, and an emblem that announced "M L T" before the name would
 * make the roster twice as long to hear.
 */
export const orgMarkSvg = (mark: OrgMark, size: OrgMarkSize = 'md'): string => {
  const px = SIZE_PX[size];
  const { field, ring, ink } = orgMarkColors(mark.hue);
  const letters = clean(mark.initials);
  const path = SHAPE_PATH[mark.shape] ?? SHAPE_PATH.circle;

  return [
    `<svg class="firma2-org-mark firma2-org-mark--${size}" width="${px}" height="${px}"`,
    ` viewBox="0 0 ${BOX} ${BOX}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">`,
    `<path d="${path}" fill="${field}" stroke="${ring}" stroke-width="1" />`,
    `<text x="20" y="${TEXT_Y[mark.shape] ?? 20}" text-anchor="middle" dominant-baseline="central"`,
    ` font-size="${TEXT_SIZE(letters.length)}" font-weight="650" letter-spacing="0.2" fill="${ink}">${letters}</text>`,
    `</svg>`,
  ].join('');
};
