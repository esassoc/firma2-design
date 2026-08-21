// The performance-measure setup controller — the wiring between the About
// card's rows, the editable page title, the form editor, the lifecycle
// cluster, the live panels, and local draft storage.
//
// WHY A CONTROLLER AND NOT A COMPONENT. Six surfaces have to agree about one
// record, and none of them can own it: the field rows, the title and the form
// hold the controls, the claim and the chart render consequences, the
// lifecycle cluster does both — and none should know the others exist. So the
// page owns a controller that reads the controls, builds the working record,
// and announces it. The panels listen on `document` for MEASURE_CHANGE_EVENT
// and re-render themselves; this module never touches their DOM, and they
// never reach back into the controls.
//
// THE SCALARS LIVE ON EDITABLE-FIELD ROWS NOW, not on raw Lit controls, and
// the read changes with them. A firma2-editable-field row keeps its truth in
// `data-raw` (the component's pinned contract) — committed values only, never
// half-typed ones — so this controller reads the DOM attribute instead of a
// control's `.value`, listens for the row's own `firma2:field-save` commit
// signal, and restores drafts by dispatching `firma2:field-set`, which routes
// the value through the same paint-and-announce path a commit uses. The old
// fmc-name / fmc-definition / fmc-guidance / fmc-classifications id contract
// is RETIRED with the open controls that carried it; `fmc-readiness` is the
// one id left, because the readiness line is a plain span this module owns.
//
// EACH ZONE'S FALLBACK IS ITS OWN SLICE OF THE SEED, and the distinction
// between `undefined` and a real answer is load-bearing. A missing row or an
// uninstalled expando means the surface is absent or broken — the safe read is
// the seed's slice, which diffs to nothing and therefore SAVES nothing. An
// empty string or an empty array is a real answer the author gave. Collapsing
// the two would make a broken surface read as a deliberate deletion that the
// autosave then persists.
//
// NOTHING IS SLUGGED, and the note survives because the trap it describes is
// still live: classifications' option values ARE the labels, units and
// counting-rule ids are already the canonical union members, and any mapping
// layer between the DOM and the record is a class of silent mismatch this
// page has already shipped once.

import {
  CLASSIFICATIONS,
  outstandingFields,
  outstandingLine,
} from '../data/firma2-performance-measures';
import type { Classification } from '../data/firma2-projects';
import type {
  PerformanceMeasureDefinition,
  MeasureDimension,
  MeasureAspect,
  MeasureStatus,
} from '../data/firma2-performance-measures';
import {
  readDraft,
  writeDraft,
  mergeDraft,
  emitMeasureChange,
  type MeasureDraft,
} from './measure-draft';

/**
 * A scalar row's committed truth, or undefined when the row is not on the page
 * — the absence the seed-fallback contract above turns into "not edited".
 */
const rowRaw = (field: string): string | undefined =>
  document.querySelector<HTMLElement>(`[data-editable-field][data-field="${field}"]`)?.dataset.raw;

/** Restore one row through the component's own set-and-paint path. */
const setRow = (field: string, raw: string | undefined): void => {
  if (raw === undefined) return;
  document.dispatchEvent(new CustomEvent('firma2:field-set', { detail: { field, raw } }));
};

/**
 * KEY-ORDER-STABLE serialization, for diffing only. The seeds write a
 * dimension's keys in one order; every zone's read-back builds another. Plain
 * JSON.stringify is insertion-order-sensitive, so a bare string compare called
 * those two different — which put `dimensions` into the stored draft on an
 * UNTOUCHED page, and the stored whole-array then masked every later seed
 * edit. Sorting keys at every depth compares the values and nothing else.
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
  // without the panels going quiet. The adopted page title qualifies: the
  // header band is inside this wrapper too.
  //
  // NOT `document`, which is the other obvious answer. The Lit legos' `change`
  // and `input` are composed and bubbling, so a document listener would also
  // fire `publish()` on every keystroke in the app-shell omnibox and every
  // sidebar-nav interaction. Harmless, but it erases the one thing this
  // selector documents: WHICH controls own this record.
  const root = document.querySelector('[data-firma2-measure-root]');
  if (!root) return;

  type FormZone = HTMLElement & {
    readAspects?: () => MeasureAspect[];
    readDimensions?: () => MeasureDimension[];
    setAspects?: (next: MeasureAspect[]) => void;
    setDimensions?: (next: MeasureDimension[]) => void;
  };
  type LifecycleZone = HTMLElement & {
    readStatus?: () => MeasureStatus;
    setStatus?: (next: MeasureStatus) => void;
  };

  // The form editor owns both arrays — the amounts (aspects) and the whole
  // dimension list, reported and derived. The lifecycle cluster owns status.
  const formZone = document.querySelector<FormZone>('.firma2-measure-form-editor');
  const lifecycleZone = document.querySelector<LifecycleZone>('[data-firma2-measure-lifecycle]');

  /** The record as the controls currently describe it. */
  function readWorkingMeasure(): PerformanceMeasureDefinition {
    const aspects = formZone?.readAspects?.() ?? seed.aspects;
    const dimensions = formZone?.readDimensions?.() ?? seed.dimensions;

    // A SET, READ WHOLE AND VALIDATED MEMBER BY MEMBER. The classifications
    // row's raw is a JSON array (firma2-editable-field's contract for sets).
    // Each member is checked against the vocabulary for the same reason unit
    // and counting rule are: a hand-edited DOM or a stale draft must not put a
    // label into the record that no roll-up downstream knows.
    const classificationsRaw = rowRaw('classifications');
    let classifications = seed.classifications;
    if (classificationsRaw !== undefined) {
      try {
        const parsed: unknown = JSON.parse(classificationsRaw);
        classifications = (Array.isArray(parsed) ? parsed.map(String) : []).filter(
          (c): c is Classification => (CLASSIFICATIONS as string[]).includes(c),
        );
      } catch {
        classifications = [];
      }
    }

    return {
      ...seed,
      name: rowRaw('name') ?? seed.name,
      definition: rowRaw('definition') ?? seed.definition,
      reporterGuidance: rowRaw('reporterGuidance') ?? seed.reporterGuidance,
      classifications,
      status: lifecycleZone?.readStatus?.() ?? seed.status,
      aspects,
      dimensions,
    };
  }

  /** Push a stored draft back onto the surfaces. Runs on load only. */
  function applyDraftToControls(draft: MeasureDraft): void {
    // The scalar rows restore through firma2:field-set — the same paint (and
    // the same firma2:field-save announcement, which is what keeps the
    // breadcrumb and the tab title honest for a drafted rename) a commit uses.
    setRow('name', draft.name);
    setRow('definition', draft.definition);
    setRow('reporterGuidance', draft.reporterGuidance);
    if (draft.classifications) setRow('classifications', JSON.stringify(draft.classifications));

    if (draft.aspects) formZone?.setAspects?.(draft.aspects);
    // The whole dimension list restores through the one zone, which routes
    // each row by its own source kind — so a blank-ref derived row restores
    // read-only rather than as an editable question.
    if (draft.dimensions) formZone?.setDimensions?.(draft.dimensions);
    // setStatus (the expando) paints without announcing — restore is not a
    // user transition, and announcing it would persist a no-op patch.
    if (draft.status) lifecycleZone?.setStatus?.(draft.status);
  }

  /**
   * The readiness line is the one page mirror this controller still paints.
   * The page NAME's mirrors (h1, breadcrumb, tab title) are the editable
   * title's own choreography now — firma2-editable-field announces the commit
   * and firma2-page-header keeps the copies in step — so writing them here
   * would be a second hand on the same string, and it would destroy the
   * adopted display button besides.
   */
  function syncReadiness(working: PerformanceMeasureDefinition): void {
    const readiness = document.getElementById('fmc-readiness');
    if (readiness) {
      const count = outstandingFields(working).length;
      const line = outstandingLine(count);
      if (readiness.textContent !== line) readiness.textContent = line;
      // The line is DRAFT vocabulary — "Ready to publish" beside an Active
      // pill and a Retire button is a contradiction, and a published record
      // that is complete has nothing to count. It comes back the moment
      // either half stops being true: a draft (the state it gates) or a gap
      // (a required field blanked on a live measure is exactly what the
      // count exists to flag).
      readiness.hidden = working.status !== 'Draft' && count === 0;
    }
  }

  /** Only what the user actually changed, so a seed edit is never masked. */
  function buildPatch(working: PerformanceMeasureDefinition): MeasureDraft {
    const patch: MeasureDraft = {};
    const keys: (keyof MeasureDraft)[] = [
      'name', 'definition', 'classifications', 'aspects', 'dimensions', 'reporterGuidance', 'status',
    ];
    for (const key of keys) {
      // stableStringify, not JSON.stringify — see the helper's note.
      if (stableStringify(working[key]) !== stableStringify(seed[key])) {
        (patch as Record<string, unknown>)[key] = working[key];
      }
    }
    return patch;
  }

  const publish = (): void => {
    const working = readWorkingMeasure();
    syncReadiness(working);
    emitMeasureChange(working);
  };

  // THE SIGNALS, one delegated set on the record wrapper:
  //   change / input            the form editor's Lit controls (input is what
  //                             makes the claim and chart track typing)
  //   firma2:field-save         an editable-field row committed — the field
  //                             rows and the page title arrive only here,
  //                             because their truth (data-raw) moves on commit
  //   firma2-dimensions-change  the form zone committed/added/removed a row
  //   firma2-status-change      a lifecycle transition
  root.addEventListener('change', publish);
  root.addEventListener('input', publish);
  root.addEventListener('firma2:field-save', publish);
  root.addEventListener('firma2-dimensions-change', publish);
  root.addEventListener('firma2-status-change', publish);

  const toast = (message: string, variant: 'success' | 'danger'): void => {
    const container = document.querySelector<HTMLElement & { show?: (c: unknown) => string }>(
      'esa-snackbar-container',
    );
    // No duration: the lego documents auto-dismiss as an SC 2.2.1 (Timing
    // Adjustable) failure unless the host supplies its own adjustment.
    container?.show?.({ message, variant });
  };

  // ---- AUTOSAVE, ON THE SIGNAL THE PANELS ALREADY USE ----------------------
  //
  // ON COMMITS, NOT KEYSTROKES. `publish` takes `input` too, deliberately: the
  // claim and chart track typing, which is the point of a live panel. A write
  // wants the boundary instead — `change` fires when a control is done being
  // changed, and the three custom events ARE commits — which is exactly the
  // "crossing the field's edge is the save gesture" boundary the rest of the
  // spoke uses.
  //
  // SILENT ON SUCCESS, LOUD ON FAILURE. A toast per field would report the
  // expected case, which is text ABOUT the page. A blocked localStorage is the
  // one thing the author cannot see and must not discover later, so it still
  // speaks — once. `warned` keeps "once" true.
  let warned = false;
  const persist = (): void => {
    const saved = writeDraft(seed.slug, buildPatch(readWorkingMeasure()));
    if (saved || warned) return;
    warned = true;
    toast('Could not save. This browser is blocking local storage.', 'danger');
  };

  root.addEventListener('change', persist);
  root.addEventListener('firma2:field-save', persist);
  root.addEventListener('firma2-dimensions-change', persist);
  root.addEventListener('firma2-status-change', persist);

  // RESTORE AND FIRST PUBLISH RUN AFTER DOMContentLoaded, and the gate is
  // about MODULE ORDER, not element upgrade. The zones and the editable-field
  // module install their expandos and listeners at their own module eval, and
  // execution order across component scripts is not guaranteed — but every
  // deferred module runs before DOMContentLoaded, so by then they provably
  // exist. (The editable rows need no re-apply dance: firma2:field-set writes
  // DOM attributes and text, and no Lit hydration overwrites those later.)
  const start = (): void => {
    const stored = readDraft(seed.slug);
    if (stored) {
      applyDraftToControls(stored);
      // The form zone's selects hydrate behind customElements.whenDefined, and
      // an aspect array written above can be overwritten by that hydration a
      // tick later. Re-applying after the definitions settle makes this the
      // last write.
      void Promise.all([
        customElements.whenDefined('esa-select'),
        customElements.whenDefined('esa-text-field'),
        customElements.whenDefined('esa-textarea'),
      ]).then(() => {
        requestAnimationFrame(() => {
          applyDraftToControls(stored);
          publish();
        });
      });
    }
    // The panels register their listeners at module-eval time, so they are
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
