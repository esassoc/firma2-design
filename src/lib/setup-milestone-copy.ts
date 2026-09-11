// The one place a milestone's count line is worded.
//
// WHY IT IS A MODULE AND NOT TWO STRING TEMPLATES. The hub renders every count
// twice: once on the server, for the zero state a first-time visitor sees before
// any script runs, and once in the browser, when journeyStatuses() re-derives
// from the local draft. An .astro component cannot share a function between its
// frontmatter and its client <script> — they are separate module graphs — so the
// alternative is the same sentence written in two places in one file, drifting
// the first time somebody edits one of them.
//
// THE UNIT COMES FROM THE MODEL. Every milestone carries `unit`, the plural noun
// its records are counted in ("organizations", "funding sources", "people"), so
// the line says what the number is OF rather than leaving the reader to infer it
// from the card's title.

/** The half of a milestone's progress a count line is reporting. */
export type MilestoneCountNoun = 'suggested' | 'confirmed';

/**
 * The singular of a milestone's `unit`. Every unit in the model is a plural
 * noun and all but one are regular, so this is a trailing "s" and a single
 * irregular. A unit that needs more than this belongs in the model beside its
 * plural, not in a bigger rule here.
 */
export const singularUnit = (unit: string): string => {
  if (unit === 'people') return 'person';
  if (unit.endsWith('ies')) return `${unit.slice(0, -3)}y`;
  if (unit.endsWith('s')) return unit.slice(0, -1);
  return unit;
};

/**
 * One count line: "11 suggested organizations", "1 confirmed person".
 * Front-loaded on the number, which is the thing being scanned for, and carrying
 * its own noun so two lines on one card never read as a single packed string.
 */
export const milestoneCountLine = (value: number, noun: MilestoneCountNoun, unit: string): string =>
  `${value} ${noun} ${value === 1 ? singularUnit(unit) : unit}`;
