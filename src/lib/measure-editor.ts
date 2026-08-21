// The performance-measure setup controller — the wiring between the metadata
// band, the two record zones, the two preview panels, and local draft storage.
//
// WHY A CONTROLLER AND NOT A COMPONENT. Six sections have to agree about one
// record, and none of them can own it: the band and the zones hold the
// controls, the previews render consequences, and none should know the others
// exist. So the page owns a controller that reads the controls, builds the
// working record, and announces it. The previews listen on `document` for
// MEASURE_CHANGE_EVENT and re-render themselves; this module never touches
// their DOM, and they never reach back into the controls.
//
// THE DIMENSIONS ARE COMPOSED FROM TWO ZONES, in the model's own order: the
// primary subcategory (firma2-measure-record), then every other subcategory —
// reported and derived, interleaved as authored (firma2-measure-attributes).
// [primary, ...rest-in-row-order] matches every seed's authored order, so a
// no-op read composes back to the seed and the draft diff stays empty.
//
// EACH ZONE'S FALLBACK IS ITS OWN SLICE OF THE SEED, and the distinction
// between `undefined` and a real answer is load-bearing. An optional chain
// returning undefined means the zone's script has not installed its expando —
// component missing or broken — and the safe read is the seed's slice, which
// diffs to nothing and therefore SAVES nothing. A null primary or an empty
// array is a real answer the author gave. Collapsing the two (one flat
// `?? seed.dimensions`) would either duplicate the seed mid-concat or make a
// broken selector read as a deliberate deletion that Save then persists.
//
// NOTHING IS SLUGGED ANY MORE, and the note survives because the trap it
// describes is still live. The band used to slug PROGRAM option values, so the
// DOM held "forest-health-fuels" where the record held "Forest Health & Fuels"
// and every read had to map back through the vocabulary that built it. Program
// is gone, replaced by CLASSIFICATIONS, whose combobox option values ARE the
// labels — no round trip, nothing to get wrong. UNIT and COUNTING RULE were
// never slugged either: their DOM values are already the canonical `UNITS`
// member and `CountingRule` id, and slugging them would produce strings
// ("tons-per-year") that no longer satisfy the unions they came from.

import {
  CLASSIFICATIONS,
  UNITS,
  COUNTING_RULES,
  measureDisplayName,
  outstandingFields,
  outstandingLine,
  primaryDimension,
} from '../data/firma2-performance-measures';
import type { Classification } from '../data/firma2-projects';
import type {
  PerformanceMeasureDefinition,
  MeasureDimension,
  MeasureUnit,
  CountingRule,
} from '../data/firma2-performance-measures';
import {
  readDraft,
  writeDraft,
  mergeDraft,
  emitMeasureChange,
  type MeasureDraft,
} from './measure-draft';

const el = <T extends HTMLElement>(id: string): T | null => document.getElementById(id) as T | null;

/** esa-text-field / esa-textarea / esa-select all expose `.value`. */
const valueOf = (id: string): string => {
  const node = el<HTMLElement & { value?: unknown }>(id);
  const raw = node?.value;
  return typeof raw === 'string' ? raw : '';
};

/**
 * The multi-value counterpart, for esa-combobox in `multiple` mode — the one
 * control on this page whose `.value` is a string[]. Anything else reads as an
 * empty set rather than throwing: a control that has not upgraded yet is not a
 * deliberate deselection, and the caller's `?? seed` fallback covers it.
 */
const valuesOf = (id: string): string[] => {
  const node = el<HTMLElement & { value?: unknown }>(id);
  const raw = node?.value;
  return Array.isArray(raw) ? raw.filter((v): v is string => typeof v === 'string') : [];
};

/**
 * KEY-ORDER-STABLE serialization, for diffing only. The seeds write a
 * dimension's keys as `name, source, primary, options`; every zone's read-back
 * builds `name, source, options, primary`. Plain JSON.stringify is
 * insertion-order-sensitive, so a bare string compare called those two
 * different — which put `dimensions` into the stored draft on an UNTOUCHED
 * page, and the stored whole-array then masked every later seed edit. Sorting
 * keys at every depth compares the values and nothing else.
 */
const stableStringify = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`);
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value) ?? 'undefined';
};

export interface MeasureEditorOptions {
  /** The build-time record. Local edits are layered over this, never into it. */
  seed: PerformanceMeasureDefinition;
}

export function initMeasureEditor({ seed }: MeasureEditorOptions): void {
  // THE RECORD'S BOUNDARY, NOT ONE SECTION'S. The listeners hang off the page
  // wrapper so a control can move between sections — which keeps happening —
  // without the previews going quiet.
  //
  // NOT `document`, which is the other obvious answer. The Lit legos' `change`
  // and `input` are composed and bubbling, so a document listener would also
  // fire `publish()` on every keystroke in the app-shell omnibox and every
  // sidebar-nav interaction. Harmless, but it erases the one thing this
  // selector documents: WHICH controls own this record.
  const root = document.querySelector('[data-firma2-measure-root]');
  if (!root) return;

  type RecordZone = HTMLElement & {
    readPrimaryDimension?: () => MeasureDimension | null;
    setPrimaryDimension?: (d: MeasureDimension | null) => Promise<void> | void;
  };
  type ListZone = HTMLElement & {
    readDimensions?: () => MeasureDimension[];
    setDimensions?: (next: MeasureDimension[]) => void;
  };

  const recordZone = document.querySelector<RecordZone>('.firma2-measure-record');
  // ONE attributes zone where there were two. firma2-measure-attributes owns
  // every non-primary dimension — reported and derived, interleaved in authored
  // order — so the controller stops re-splitting the array by source and
  // stitching it back together. The record still owns the primary.
  const attributesZone = document.querySelector<ListZone>('.firma2-measure-attributes');

  /** The record as the controls currently describe it. */
  function readWorkingMeasure(): PerformanceMeasureDefinition {
    const decimalsRaw = Number.parseInt(valueOf('fmc-decimals'), 10);
    const unitRaw = valueOf('fmc-unit');
    const ruleRaw = valueOf('fmc-rule');

    // Two slices now, each with the undefined-vs-answer distinction the
    // header note explains: the primary from the record section, everything
    // else from the attributes section, in ROW ORDER — the merge is what let
    // the authored interleave of reported and derived rows survive a
    // round-trip. Half-declared rows (named, but no vocabulary yet) are kept
    // rather than filtered: dropping one would make the previews disagree
    // with the section the author is looking at.
    const primaryRead = recordZone?.readPrimaryDimension?.();
    const primary = primaryRead === undefined ? primaryDimension(seed) ?? null : primaryRead;
    const attributes =
      attributesZone?.readDimensions?.() ?? seed.dimensions.filter((d) => !d.primary);

    return {
      ...seed,
      quantity: valueOf('fmc-quantity'),
      name: valueOf('fmc-name'),
      definition: valueOf('fmc-definition'),
      reporterGuidance: valueOf('fmc-guidance'),
      // A SET, READ WHOLE AND VALIDATED MEMBER BY MEMBER. esa-combobox in
      // `multiple` mode exposes `.value` as a string[], so this is the one
      // control on the page whose value is not a string — hence its own reader
      // rather than valueOf(). Each member is checked against the vocabulary
      // for the same reason unit and counting rule are: a hand-edited DOM or a
      // stale draft must not put a label into the record that no roll-up
      // downstream knows. NOT SLUGGED — the combobox's option values are the
      // labels themselves, so there is no round trip to get wrong.
      classifications: valuesOf('fmc-classifications').filter(
        (c): c is Classification => (CLASSIFICATIONS as string[]).includes(c),
      ),
      // Validated against the vocabulary rather than cast: a hand-edited DOM or
      // a stale draft must not put a value into the record that no rollup,
      // formatter or filter downstream knows how to handle.
      unit: (UNITS as readonly string[]).includes(unitRaw) ? (unitRaw as MeasureUnit) : undefined,
      countingRule: COUNTING_RULES.some((r) => r.id === ruleRaw)
        ? (ruleRaw as CountingRule)
        : undefined,
      decimalPlaces: Number.isNaN(decimalsRaw) ? seed.decimalPlaces : decimalsRaw,
      dimensions: [...(primary ? [primary] : []), ...attributes],
    };
  }

  /** Push a stored draft back onto the controls. Runs on load only. */
  function applyDraftToControls(draft: MeasureDraft): void {
    const setValue = (id: string, value: string | undefined) => {
      if (value === undefined) return;
      const node = el<HTMLElement & { value?: unknown }>(id);
      if (node) node.value = value;
    };
    setValue('fmc-quantity', draft.quantity);
    setValue('fmc-name', draft.name);
    setValue('fmc-definition', draft.definition);
    setValue('fmc-guidance', draft.reporterGuidance);
    setValue('fmc-unit', draft.unit);
    setValue('fmc-rule', draft.countingRule);
    if (draft.decimalPlaces !== undefined) setValue('fmc-decimals', String(draft.decimalPlaces));
    // The set is assigned as an ARRAY, not a string — esa-combobox `multiple`
    // takes and returns string[]. `setValue` is typed for the scalar controls
    // and would coerce, so this writes the property directly.
    if (draft.classifications) {
      const node = el<HTMLElement & { value?: unknown }>('fmc-classifications');
      if (node) node.value = [...draft.classifications];
    }

    // The dimensions split back into the two zones. THE PRIMARY IS SET EVEN
    // WHEN ABSENT — a draft whose author deleted the primary contains no
    // flagged row, and skipping the call would leave the seed's subcategory
    // standing, resurrecting exactly what was deleted. The attributes zone
    // takes the rest in one call and routes each row by its own source kind,
    // so a blank-ref derived row restores read-only rather than as an
    // editable question.
    if (draft.dimensions) {
      const primary = draft.dimensions.find((d) => d.primary) ?? null;
      void recordZone?.setPrimaryDimension?.(primary);
      attributesZone?.setDimensions?.(draft.dimensions.filter((d) => !d.primary));
    }
  }

  /** The page identity and the readiness line are both renders of the record. */
  function syncPageIdentity(working: PerformanceMeasureDefinition): void {
    const shown = measureDisplayName(working);
    const title = document.querySelector('.esa-page-header__title');
    if (title && title.textContent !== shown) title.textContent = shown;
    const crumb = document.querySelector('[aria-current="page"]');
    if (crumb && crumb.textContent !== shown) crumb.textContent = shown;
    const docTitle = `${shown} — ProjectFirma 2.0`;
    if (document.title !== docTitle) document.title = docTitle;

    // Beside Save, through the same outstandingLine() the server rendered it
    // with — one copy of the sentence, and outstandingFields() is the one
    // opinion about readiness (it already forks on the measure's kind).
    const readiness = document.getElementById('fmc-readiness');
    if (readiness) {
      const line = outstandingLine(outstandingFields(working).length);
      if (readiness.textContent !== line) readiness.textContent = line;
    }
  }

  /** Only what the user actually changed, so a seed edit is never masked. */
  function buildPatch(working: PerformanceMeasureDefinition): MeasureDraft {
    const patch: MeasureDraft = {};
    const keys: (keyof MeasureDraft)[] = [
      'name', 'definition', 'classifications', 'quantity', 'unit',
      'decimalPlaces', 'countingRule', 'dimensions', 'reporterGuidance',
    ];
    for (const key of keys) {
      // stableStringify, not JSON.stringify: the zones rebuild dimension
      // objects in a different key order than the seeds author them, and a
      // key-order-sensitive compare stored the whole array on an untouched
      // page — see the helper's note.
      if (stableStringify(working[key]) !== stableStringify(seed[key])) {
        (patch as Record<string, unknown>)[key] = working[key];
      }
    }
    return patch;
  }

  const publish = (): void => {
    const working = readWorkingMeasure();
    syncPageIdentity(working);
    emitMeasureChange(working);
  };

  // Every control on the record bubbles a composed `change`; text fields and
  // textareas also bubble `input`, which is what makes the previews track
  // typing rather than waiting for blur. One delegated set on the page's record
  // wrapper beats a dozen listeners that have to be kept in step with each
  // section's markup — and it keeps working when a control moves between
  // sections, which is exactly what keeps happening.
  root.addEventListener('change', publish);
  root.addEventListener('input', publish);
  root.addEventListener('firma2-dimensions-change', publish);

  const toast = (message: string, variant: 'success' | 'danger'): void => {
    const container = document.querySelector<HTMLElement & { show?: (c: unknown) => string }>(
      'esa-snackbar-container',
    );
    // No duration: the lego documents auto-dismiss as an SC 2.2.1 (Timing
    // Adjustable) failure unless the host supplies its own adjustment.
    container?.show?.({ message, variant });
  };

  // ---- AUTOSAVE, ON THE SIGNAL THE PREVIEWS ALREADY USE --------------------
  //
  // This was a Save button and a Cancel button in the page header; the page's
  // own note records why they went. What replaces them is not a new mechanism —
  // `publish` above is already called on every change to every control on the
  // record, because that is what keeps the previews live. Persisting on the
  // same signal is one more call on a path that was already firing.
  //
  // ON `change`, NOT `input`. `publish` takes both, deliberately: the previews
  // track typing, which is the whole point of a preview. A write does not want
  // that — `input` fires per keystroke, so a definition paragraph would be a few
  // hundred serialize-and-write round trips, and the last keystroke's value is
  // the only one anybody wanted. `change` fires when a control is done being
  // changed (blur for text, immediately for a select or a checkbox), which is
  // exactly the "crossing the field's edge is the save gesture" boundary the
  // rest of the spoke uses. The custom dimensions event is a commit, not a
  // keystroke, so it saves on arrival.
  //
  // SILENT ON SUCCESS, LOUD ON FAILURE. A toast per field would be the noisiest
  // thing on the screen and would be reporting the expected case, which is text
  // ABOUT the page. A blocked localStorage is the one thing the author cannot
  // see and must not discover later, so it still speaks — once. `warned` is what
  // keeps "once" true: without it, every subsequent field would re-announce the
  // same broken browser.
  let warned = false;
  const persist = (): void => {
    const saved = writeDraft(seed.slug, buildPatch(readWorkingMeasure()));
    if (saved || warned) return;
    warned = true;
    toast('Could not save. This browser is blocking local storage.', 'danger');
  };

  root.addEventListener('change', persist);
  root.addEventListener('firma2-dimensions-change', persist);

  // RESTORE AND FIRST PUBLISH RUN AFTER DOMContentLoaded, and the gate is about
  // MODULE ORDER, not element upgrade. The zones install their expandos at
  // their own module eval, and execution order across component scripts is not
  // guaranteed — but every deferred module runs before DOMContentLoaded, so by
  // then the expandos provably exist. This matters most for the breakdowns
  // zone, which contains NO Lit elements at all: a customElements.whenDefined
  // gate can never vouch for it, and optional-chaining past its missing
  // setDimensions would silently revert a saved deletion on the next Save.
  const start = (): void => {
    const stored = readDraft(seed.slug);
    if (stored) {
      applyDraftToControls(stored);
      // The band and the record zone hydrate their own selects behind
      // customElements.whenDefined, and a value written above can be
      // overwritten by that hydration a tick later. Re-applying after the
      // definitions settle makes this the last write.
      void Promise.all([
        customElements.whenDefined('esa-select'),
        customElements.whenDefined('esa-text-field'),
        customElements.whenDefined('esa-textarea'),
        customElements.whenDefined('esa-input-tag'),
      ]).then(() => {
        requestAnimationFrame(() => {
          applyDraftToControls(stored);
          publish();
        });
      });
    }
    // The previews register their listeners at module-eval time, so they are
    // guaranteed to hear this. The zones' own settle-emits may publish again
    // afterwards; reads are pull-based, so the last one wins harmlessly.
    publish();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
}

/** The record as it stands in this browser — seed plus stored draft. */
export const currentMeasure = (
  seed: PerformanceMeasureDefinition,
): PerformanceMeasureDefinition => mergeDraft(seed, readDraft(seed.slug));
