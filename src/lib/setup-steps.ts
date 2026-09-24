// The step list a stepped setup walk is built from, and the one place a bare id
// becomes a label. Shared by firma2-setup-stepper (the milestone walks),
// firma2-setup-step-rail (the checklist beside them) and Start, which owns its
// own screens but wears the same rail.

/** One step of a walk: its screen id (matches the screen's `data-step`) and its rail label. */
export interface SetupStep {
  id: string;
  /** One to three words. Shown in the rail and in the Next button that leads to it. */
  label: string;
}

/** Where a rail row stands. `active` is the screen on show, whatever it resolved to before. */
export type SetupStepStatus = 'active' | 'complete' | 'skipped' | 'upcoming';

/** 'stewardship' → 'Stewardship', 'program-shape' → 'Program shape'. The fallback label only. */
export function labelFromId(id: string): string {
  const words = id.replace(/[-_]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * The walk's steps. `steps` wins when both are passed; `stepIds` alone still
 * renders, labelled from the ids, so a page that has not been given labels yet
 * keeps working.
 */
export function resolveSetupSteps(steps?: SetupStep[], stepIds?: string[]): SetupStep[] {
  if (steps && steps.length > 0) return steps;
  return (stepIds ?? []).map((id) => ({ id, label: labelFromId(id) }));
}

/** The advance button's words for a screen that has a next step. */
export function nextLabel(next: SetupStep): string {
  return `Next: ${next.label}`;
}
