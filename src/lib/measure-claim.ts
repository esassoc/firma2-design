// The CLAIM — the measure stated as the sentence it exists to produce.
//
// The grammar (docs/measure-model.md): "we accomplished [quantity] [unit] of
// [concept] — [qualifier], [qualifier]…". This module renders the measure being
// authored AS that sentence, with a visible blank for every part not yet
// decided. The blanks ARE the readiness checklist: they carry the same labels
// outstandingFields() reports, so the header's count, the claim's gaps and the
// publish gate are three renders of one opinion and cannot disagree.
//
// ONE BUILDER + ONE RENDERER, TWO CALLERS — the proven live-panel pattern
// (firma2-measure-split-chart, the old reporter preview): the .astro file calls
// both at build time and again from its client script on MEASURE_CHANGE_EVENT,
// so the server render and every later repaint are byte-identical by
// construction.
//
// SEGMENTS, NOT A TEMPLATE STRING. The sentence is a list of literal runs and
// BLANKS; each blank knows its label, its value if any, and the EDITOR TARGET
// it opens ("aspect:0:unit", "dimension:2"). Building it as data keeps the
// renderer dumb and lets the claim component wire every blank as a real
// <button> without parsing its own output.
//
// bcn-lego-checked: the blank is a native <button> in a TEXT RUN — a fragment
// of a flowing sentence that happens to be clickable, the same shape (and the
// same argument) as firma2-editable-field's display button. esa-button draws a
// BUTTON BOX — its own padding, border ring, label layout — which mid-sentence
// would break the line into chips and destroy the one thing this panel is (a
// sentence you read). Checked the catalog for an inline-affordance lego: none;
// esa-pill is a status chip, wrong grammar. Beacon is not cloned on this
// machine. The button carries only semantics + the two claim styles defined in
// firma2-measure-claim.astro, which is this markup's one consumer and home.

import { escapeHtml } from './format';
import {
  derivedDimensions,
  reportedDimensions,
  type PerformanceMeasureDefinition,
} from '../data/firma2-performance-measures';

const esc = escapeHtml;

export interface ClaimBlank {
  /** What the sentence shows while undecided — outstandingFields()' own label. */
  label: string;
  /** The decided value, when there is one. */
  value: string;
  filled: boolean;
  /** The editor to open: "aspect:<i>:quantity|unit|rule" or "dimension:<i>". */
  target: string;
}

export type ClaimSegment = { text: string } | { blank: ClaimBlank };

export interface ClaimModel {
  segments: ClaimSegment[];
}

// NO INVENTED MAGNITUDE. The sentence used to lead each aspect with an
// illustrative total ("1,240 acres of treated extent"), on the argument that a
// number makes the line read as a claim rather than a form. It failed the
// reviewer test: a specific figure in the page's authoritative first sentence
// reads as STORED DATA — "where does 1,240 come from?" — and a fabricated
// figure that passes for real is the small lie a prototype cannot afford. The
// example numbers live where the placeholder register marks them as examples:
// the form editor's wells. The claim states the definition it actually knows:
// "acres of treated extent, summed across entries."

/**
 * The counting rules, as MID-SENTENCE phrases. COUNTING_RULES' own names are
 * imperatives for a select ("Sum every entry"); a sentence needs the same fact
 * as a participle. One copy here, keyed by the same ids, and the ids are the
 * join — the two spellings describe one rule and cannot diverge in meaning.
 * Exported: the amount rows' fact lines ("acres · summed across entries")
 * state the same fact as the claim, and two spellings of it would drift.
 */
export const RULE_PHRASE: Record<string, string> = {
  sum: 'summed across entries',
  'spatial-union': 'unioned on the map',
  'distinct-places': 'counted by distinct place',
  'latest-per-place': 'latest reading per place',
  'average-per-place': 'averaged across places',
};

export function buildClaimModel(measure: PerformanceMeasureDefinition): ClaimModel {
  const segments: ClaimSegment[] = [];
  const say = (text: string) => segments.push({ text });
  const blank = (b: ClaimBlank) => segments.push({ blank: b });

  // The subject. An output is reported by projects; an outcome is a reading.
  say(measure.kind === 'outcome' ? 'Each reading records ' : 'Each project entry reports ');

  measure.aspects.forEach((aspect, i) => {
    if (i > 0) say(' and ');
    const at = measure.aspects.length > 1 ? ` (amount ${i + 1})` : '';

    // "[acres] of [treated extent]" — the unit leads, no invented total (see
    // the note above).
    blank({
      label: `Unit${at}`,
      value: aspect.unit ?? '',
      filled: Boolean(aspect.unit),
      target: `aspect:${i}:unit`,
    });
    say(' of ');
    blank({
      label: `Quantity${at}`,
      // Lowercased in the sentence — "1,240 acres of treated extent" — because
      // the value is mid-phrase here; the form editor shows it as authored.
      value: aspect.quantity.trim().toLowerCase(),
      filled: Boolean(aspect.quantity.trim()),
      target: `aspect:${i}:quantity`,
    });
    say(', ');
    blank({
      label: `Counting rule${at}`,
      value: aspect.countingRule ? RULE_PHRASE[aspect.countingRule] ?? aspect.countingRule : '',
      filled: Boolean(aspect.countingRule),
      target: `aspect:${i}:rule`,
    });
  });

  // The qualifiers a reporter answers. Dimensions are OPTIONAL, so none is not
  // a gap — the sentence simply ends sooner, which is itself information: it
  // reads lighter because the measure asks less.
  const reported = reportedDimensions(measure);
  if (reported.length > 0) {
    say(' — qualified by ');
    reported.forEach((d, i) => {
      if (i > 0) say(i === reported.length - 1 ? ' and ' : ', ');
      blank({
        label: 'New subcategory',
        value: d.name.trim().toLowerCase(),
        filled: Boolean(d.name.trim()),
        // Indexed within the reported list — the form editor's dimension rows
        // are that list, in the same order.
        target: `dimension:${i}`,
      });
    });
  }

  // The free splits — the yield clause. Plain text, not blanks: nothing here
  // is undecided, and the claim hands the reader the idea; the rows themselves
  // sit directly below in the form editor's report block.
  const derived = derivedDimensions(measure).filter((d) => d.name.trim());
  if (derived.length > 0) {
    const names = derived.map((d) => d.name.trim());
    const list =
      names.length === 1
        ? names[0]
        : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
    say(`, split automatically by ${list}`);
  }

  say('.');
  return { segments };
}

/**
 * The sentence as markup. Blanks are real <button>s — focusable, named for
 * what they edit — carrying `data-claim-target` for the component's delegated
 * click handler. An unfilled blank shows its outstandingFields() label in the
 * unset treatment; a filled one shows the value at full weight.
 *
 * THE UNFILLED LABEL IS SPOKEN IN THE SENTENCE'S OWN GRAMMAR: lowercased and
 * given its article, so a blank draft reads "reports a unit of a quantity, a
 * counting rule." rather than "reports Unit of Quantity, Counting rule." —
 * which read as a rendering fault, and the draft is the state this page is in
 * when it matters most. The label itself is untouched everywhere it is a
 * LABEL: the aria-label below and the header's readiness count both keep
 * outstandingFields()' exact words, so the checklist correspondence survives.
 */
const inSentence = (label: string): string => `a ${label.charAt(0).toLowerCase()}${label.slice(1)}`;

export function renderClaim(model: ClaimModel): string {
  return model.segments
    .map((segment) => {
      if ('text' in segment) return esc(segment.text);
      const { label, value, filled, target } = segment.blank;
      const cls = filled
        ? 'firma2-measure-claim__blank'
        : 'firma2-measure-claim__blank firma2-measure-claim__blank--unset';
      const shown = filled ? value : inSentence(label);
      return (
        `<button type="button" class="${cls}" data-claim-target="${esc(target)}"` +
        ` aria-label="Edit ${esc(label)}">${esc(shown)}</button>`
      );
    })
    .join('');
}
