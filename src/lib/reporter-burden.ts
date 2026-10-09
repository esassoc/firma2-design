// Reporter burden — how much a measure asks of the person filing it, as a
// relative level a program lead can read at a glance while the definition is
// still open: Low, Moderate or High.
//
// THE COUNT IS ANSWERS PER ENTRY: the figure itself, plus every subcategory a
// reporter picks by hand. Splits the system fills in (watershed, ownership,
// the reporting year) cost the reporter nothing and do not count — that is
// the leverage the level exists to make visible. Every entry repeats on every
// project, every year, so the count is per entry, not per measure.
//
// THRESHOLDS: 1 answer is Low (a number and nothing else), 2–3 is Moderate,
// 4 or more is High. Deliberately coarse — a relative signal, not a score.
//
// One implementation for both surfaces that show it (the drafter's review and
// the measure page), so the two cannot disagree. firma2-reporter-burden is the
// markup; paintBurden() fills it in.

export type BurdenLevel = 'low' | 'moderate' | 'high';

export const BURDEN_LEVELS: readonly BurdenLevel[] = ['low', 'moderate', 'high'];

export const BURDEN_NAME: Record<BurdenLevel, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
};

/** Answers per entry at each level, printed under the scale so the rule is never hidden. */
export const BURDEN_RANGE: Record<BurdenLevel, string> = {
  low: '1',
  moderate: '2–3',
  high: '4+',
};

export interface ReporterBurden {
  level: BurdenLevel;
  /** Answers per entry: the figure plus each hand-picked split. */
  answers: number;
  /** The one line under the level. */
  detail: string;
}

/** `picks` is the number of subcategories a reporter answers by hand. */
export const reporterBurden = (picks: number): ReporterBurden => {
  const answers = 1 + Math.max(0, picks);
  const level: BurdenLevel = answers <= 1 ? 'low' : answers <= 3 ? 'moderate' : 'high';
  const words = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const count = words[picks] ?? String(picks);
  const asked = picks <= 0 ? 'one number' : `one number and ${count} ${picks === 1 ? 'pick' : 'picks'}`;
  return { level, answers, detail: `Each entry asks for ${asked}, on every project, every year.` };
};

/** Fill a firma2-reporter-burden element in. */
export const paintBurden = (el: HTMLElement | null, burden: ReporterBurden): void => {
  if (!el) return;
  el.dataset.level = burden.level;
  const name = `${BURDEN_NAME[burden.level]} burden`;
  // Under a heading that already says "Reporter burden", the level stands alone.
  const label = el.querySelector<HTMLElement>('[data-burden-label]');
  const detail = el.querySelector('[data-burden-detail]');
  if (label) label.textContent = label.dataset.bare !== undefined ? BURDEN_NAME[burden.level] : name;
  if (detail) detail.textContent = burden.detail;
  const meter = el.querySelector<HTMLElement>('[data-burden-meter]');
  if (meter) {
    meter.setAttribute('aria-valuenow', String(BURDEN_LEVELS.indexOf(burden.level) + 1));
    meter.setAttribute('aria-valuetext', name);
  }
};
