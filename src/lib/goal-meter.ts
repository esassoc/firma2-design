// The arithmetic and wording of bcn-goal-meter, in one place, so the meter the
// server renders and the meter a page repaints from browser edits (a target
// changed in Workspace settings) cannot disagree. See bcn-goal-meter.astro for
// what the meter shows and why.

export interface MeterInput {
  label: string;
  unit: string;
  reported: number | null;
  committed: number | null;
  goal?: number;
  goalYear?: number;
  decimals?: number;
}

export interface MeterView {
  scale: number;
  reportedPct: number;
  committedPct: number;
  reportedText: string;
  committedText: string | null;
  goalText: string;
}

export const meterView = ({ unit, reported, committed, goal, goalYear, decimals = 0 }: MeterInput): MeterView => {
  const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals });
  // "each" is a counting unit with no noun to print — "7 each" reads as a typo.
  const withUnit = (n: number) =>
    unit === 'percent' ? `${fmt.format(n)}%` : unit === 'each' ? fmt.format(n) : `${fmt.format(n)} ${unit}`;
  const scale = goal ?? Math.max(reported ?? 0, committed ?? 0);
  const pct = (n: number | null) => (n == null || scale <= 0 ? 0 : Math.min(100, (n / scale) * 100));
  return {
    scale,
    reportedPct: pct(reported),
    committedPct: pct(committed),
    reportedText: reported == null ? 'No reports yet' : `${withUnit(reported)} reported`,
    committedText: committed != null ? `${fmt.format(committed)} planned` : null,
    goalText: goal != null ? `Goal ${withUnit(goal)}${goalYear ? ` by ${goalYear}` : ''}` : 'No goal set',
  };
};

/** Repaint a server-rendered (or cloned) bcn-goal-meter in place. */
export const paintMeter = (root: HTMLElement, input: MeterInput): void => {
  const v = meterView(input);
  const track = root.querySelector<HTMLElement>('[role="meter"]');
  if (track) {
    track.setAttribute('aria-label', input.label);
    track.setAttribute('aria-valuemax', String(v.scale || 1));
    track.setAttribute('aria-valuenow', String(input.reported ?? 0));
    track.setAttribute('aria-valuetext', `${v.reportedText}. ${v.goalText}.`);
  }
  const committed = root.querySelector<HTMLElement>('[data-meter-committed]');
  if (committed) {
    committed.hidden = v.committedText == null;
    committed.style.inlineSize = `${v.committedPct}%`;
  }
  const reported = root.querySelector<HTMLElement>('[data-meter-reported]');
  if (reported) reported.style.inlineSize = `${v.reportedPct}%`;
  const set = (sel: string, text: string) => {
    const el = root.querySelector(sel);
    if (el) el.textContent = text;
  };
  set('[data-meter-reported-text]', v.reportedText);
  set('[data-meter-goal-text]', v.goalText);
  const ct = root.querySelector<HTMLElement>('[data-meter-committed-text]');
  if (ct) {
    ct.hidden = v.committedText == null;
    ct.textContent = v.committedText ? ` · ${v.committedText}` : '';
  }
};
