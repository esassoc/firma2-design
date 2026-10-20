// Pill tone → badge variant. The status tone maps (STAGE_TONE, MEASURE_STATUS_TONE,
// PM2_STATUS_TONE) were written for esa-pill, whose neutral is `default`; esa-badge
// names the same neutral `secondary`. Status moved from pills under the title to
// badges in the top bar (2026-10-19), and the maps stay pill-shaped because the
// grids and peeks still render pills from them.
export type PillTone = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeTone = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

export const badgeTone = (tone: PillTone): BadgeTone => (tone === 'default' ? 'secondary' : tone);
