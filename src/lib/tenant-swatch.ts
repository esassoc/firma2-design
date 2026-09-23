// tenant-swatch: the one way a tenantColors hue becomes a color on screen, and
// the one way a default color is chosen from a mark's hue.
//
// Two callers draw a swatch (the color tile and the appearance roster), so the
// formula lives once. L and C are the milestone band's: SetupLayout tints the
// brand fill as an oklch over the milestone hue, and a swatch the tenant picks
// should look like the band it will become.

import type { TenantColor } from '../data/firma2-setup';

const SWATCH_L = 0.62;
const SWATCH_C = 0.13;

/** A tenantColors hue as a CSS color. */
export const tenantSwatch = (hue: number): string => `oklch(${SWATCH_L} ${SWATCH_C} ${hue})`;

/** Angular distance on the wheel, 0 to 180. */
const hueDistance = (a: number, b: number): number => {
  const d = Math.abs((((a - b) % 360) + 360) % 360);
  return d > 180 ? 360 - d : d;
};

/** The color whose hue sits nearest a given hue; the first on a tie, so the answer is deterministic. */
export const nearestTenantColor = (colors: readonly TenantColor[], hue: number): TenantColor | null =>
  colors.reduce<TenantColor | null>(
    (best, color) => (best === null || hueDistance(color.hue, hue) < hueDistance(best.hue, hue) ? color : best),
    null,
  );
