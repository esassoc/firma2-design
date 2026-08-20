// The performance-measure setup controller — the wiring between the config
// rail, the two preview panels, and local draft storage.
//
// WHY A CONTROLLER AND NOT A COMPONENT. Three sections have to agree about one
// record, and none of them can own it: the rail holds the controls, the two
// previews render consequences, and none should know the others exist. So the
// page owns a controller that reads the rail, builds the working record, and
// announces it. The previews listen on `document` for MEASURE_CHANGE_EVENT and
// re-render themselves; this module never touches their DOM, and they never
// reach back into the rail.
//
// THE VALUES IN THE RAIL ARE SLUGGED. firma2-measure-config builds its select
// and radio options as `{ label, value: slug(label) }`, so the DOM holds
// "on-completion" where the record holds "On completion". Reading a control
// therefore means mapping back through the SAME vocabulary the options were
// built from — never by un-hyphenating and title-casing the string, which would
// turn "on-completion" into "On Completion" and silently fail every comparison
// downstream. `fromSlug` below is that mapping, and it is why every vocabulary
// is imported rather than retyped.

import {
  DATA_TYPES,
  AGGREGATIONS,
  REPORTING_FREQUENCIES,
  PROGRAMS,
} from '../data/firma2-performance-measures';
import { measureDisplayName } from '../data/firma2-performance-measures';
import type {
  PerformanceMeasureDefinition,
  MeasureSubcategory,
} from '../data/firma2-performance-measures';
import {
  readDraft,
  writeDraft,
  clearDraft,
  mergeDraft,
  emitMeasureChange,
  type MeasureDraft,
} from './measure-draft';

/** Must match firma2-measure-config's own `slug`, or every lookup misses. */
const slug = (label: string): string =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Slugged DOM value -> the canonical label from the vocabulary that built it. */
const fromSlug = <T extends string>(vocabulary: readonly T[], value: string): T | undefined =>
  vocabulary.find((entry) => slug(entry) === value);

const el = <T extends HTMLElement>(id: string): T | null => document.getElementById(id) as T | null;

/** esa-text-field / esa-textarea / esa-select all expose `.value`. */
const valueOf = (id: string): string => {
  const node = el<HTMLElement & { value?: unknown }>(id);
  const raw = node?.value;
  return typeof raw === 'string' ? raw : '';
};

export interface MeasureEditorOptions {
  /** The build-time record. Local edits are layered over this, never into it. */
  seed: PerformanceMeasureDefinition;
}

export function initMeasureEditor({ seed }: MeasureEditorOptions): void {
  const rail = document.querySelector('.firma2-measure-config');
  if (!rail) return;

  const repeater = document.querySelector<
    HTMLElement & {
      readRows?: () => MeasureSubcategory[];
      setRows?: (rows: MeasureSubcategory[]) => void;
    }
  >('.firma2-option-repeater');

  /** The record as the controls currently describe it. */
  function readWorkingMeasure(): PerformanceMeasureDefinition {
    const dataType = fromSlug(DATA_TYPES, valueOf('fmc-data-type')) ?? seed.dataType;
    const decimalsRaw = Number.parseInt(valueOf('fmc-decimals'), 10);

    return {
      ...seed,
      name: valueOf('fmc-name'),
      definition: valueOf('fmc-definition'),
      program: fromSlug(PROGRAMS, valueOf('fmc-program')),
      dataType,
      // The Unit row is REMOVED from the DOM, not hidden, when the data type
      // does not take one — so reading it would return "" and silently erase a
      // unit the user typed before switching. Percent and currency carry their
      // own unit and the record stores "" for both, so the honest read is: the
      // control's value when it exists, and "" when it legitimately does not.
      unit: dataType === 'Number' ? valueOf('fmc-unit') : '',
      decimalPlaces: Number.isNaN(decimalsRaw) ? seed.decimalPlaces : decimalsRaw,
      aggregation: fromSlug(AGGREGATIONS, valueOf('fmc-aggregation')),
      reportingFrequency: fromSlug(REPORTING_FREQUENCIES, valueOf('fmc-frequency')),
      required: Boolean(el<HTMLElement & { checked?: boolean }>('fmc-required')?.checked),
      reporterGuidance: valueOf('fmc-guidance'),
      // A half-typed row (a name with no options yet) is dropped rather than
      // shown, so the preview's cell count never multiplies by zero mid-keystroke.
      subcategories: (repeater?.readRows?.() ?? seed.subcategories).filter(
        (row) => row.name.trim() && row.options.length > 0,
      ),
    };
  }

  /** Push a stored draft back onto the controls. Runs once, on load. */
  function applyDraftToControls(draft: MeasureDraft): void {
    const setValue = (id: string, value: string | undefined) => {
      if (value === undefined) return;
      const node = el<HTMLElement & { value?: unknown }>(id);
      if (node) node.value = value;
    };
    setValue('fmc-name', draft.name);
    setValue('fmc-definition', draft.definition);
    setValue('fmc-guidance', draft.reporterGuidance);
    setValue('fmc-unit', draft.unit);
    if (draft.decimalPlaces !== undefined) setValue('fmc-decimals', String(draft.decimalPlaces));
    if (draft.dataType) setValue('fmc-data-type', slug(draft.dataType));
    if (draft.program) setValue('fmc-program', slug(draft.program));
    if (draft.aggregation) setValue('fmc-aggregation', slug(draft.aggregation));
    if (draft.reportingFrequency) setValue('fmc-frequency', slug(draft.reportingFrequency));
    if (draft.required !== undefined) {
      const toggle = el<HTMLElement & { checked?: boolean }>('fmc-required');
      if (toggle) toggle.checked = draft.required;
    }
    // Subcategories go back through the repeater's own setRows(), which clones
    // the same prototype row addRow() uses — so a restored row and a typed one
    // are the same markup. Without this the demo lost its most important state
    // on reload: subcategories are what drive the reporting-form preview, so a
    // saved draft came back with the grid gone.
    if (draft.subcategories) repeater?.setRows?.(draft.subcategories);
  }

  /**
   * The page header is server-rendered from the SEED, so a measure saved with a
   * name still showed "Untitled measure" in the h1, the crumb and the tab after
   * a reload — the field said one thing and the heading said another. The record
   * IS the page here, so the page's own identity has to track it.
   *
   * Routed through measureDisplayName() so clearing the name falls back to the
   * same string the server would have rendered, rather than to an empty heading.
   */
  function syncPageIdentity(working: PerformanceMeasureDefinition): void {
    const shown = measureDisplayName(working);
    const title = document.querySelector('.esa-page-header__title');
    if (title && title.textContent !== shown) title.textContent = shown;
    // The last crumb is the current page; esa-breadcrumbs marks it aria-current.
    const crumb = document.querySelector('[aria-current="page"]');
    if (crumb && crumb.textContent !== shown) crumb.textContent = shown;
    const docTitle = `${shown} — ProjectFirma 2.0`;
    if (document.title !== docTitle) document.title = docTitle;
  }

  /** Only what the user actually changed, so a seed edit is never masked. */
  function buildPatch(working: PerformanceMeasureDefinition): MeasureDraft {
    const patch: MeasureDraft = {};
    const keys: (keyof MeasureDraft)[] = [
      'name', 'definition', 'program', 'dataType', 'unit', 'decimalPlaces',
      'aggregation', 'subcategories', 'reportingFrequency', 'required', 'reporterGuidance',
    ];
    for (const key of keys) {
      if (JSON.stringify(working[key]) !== JSON.stringify(seed[key])) {
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

  // Every control the rail owns bubbles a composed `change`; the textareas and
  // text fields also bubble `input`, which is what makes the preview track
  // typing rather than waiting for blur. One delegated pair on the rail beats
  // ten listeners that have to be kept in step with the rail's markup.
  rail.addEventListener('change', publish);
  rail.addEventListener('input', publish);
  rail.addEventListener('firma2-repeater-change', publish);

  const toast = (message: string, variant: 'success' | 'danger'): void => {
    const container = document.querySelector<HTMLElement & { show?: (c: unknown) => string }>(
      'esa-snackbar-container',
    );
    // A duration would auto-dismiss, which the lego documents as an SC 2.2.1
    // (Timing Adjustable) failure unless the host supplies its own adjustment.
    // Persistent-until-dismissed is the conforming default; take it.
    container?.show?.({ message, variant });
  };

  el<HTMLButtonElement>('fmc-save')?.addEventListener('click', () => {
    const working = readWorkingMeasure();
    const saved = writeDraft(seed.slug, buildPatch(working));
    toast(
      saved
        ? 'Draft saved in this browser.'
        : 'Could not save. This browser is blocking local storage.',
      saved ? 'success' : 'danger',
    );
  });

  el<HTMLButtonElement>('fmc-cancel')?.addEventListener('click', () => {
    // Discard everything since the last save by re-reading from storage — a
    // reload is the honest revert here, because the repeater's rows cannot be
    // rebuilt in place (see applyDraftToControls).
    window.location.reload();
  });

  el<HTMLButtonElement>('fmc-discard')?.addEventListener('click', () => {
    clearDraft(seed.slug);
    window.location.reload();
  });

  // Restore, then announce. The page was server-rendered from the seed, so the
  // previews are showing the seed until this runs.
  const stored = readDraft(seed.slug);
  if (stored) {
    applyDraftToControls(stored);
    // The rail hydrates its own selects behind customElements.whenDefined, and
    // module execution order across component scripts is not guaranteed — so a
    // value written here can be overwritten by the rail's own hydration a tick
    // later. Re-applying after the definitions settle makes this the last write.
    void Promise.all([
      customElements.whenDefined('esa-select'),
      customElements.whenDefined('esa-text-field'),
      customElements.whenDefined('esa-textarea'),
      customElements.whenDefined('esa-switch-toggle'),
    ]).then(() => {
      requestAnimationFrame(() => {
        applyDraftToControls(stored);
        publish();
      });
    });
  }

  // The previews register their listeners at module-eval time, and deferred
  // module scripts all run before DOMContentLoaded — so dispatching here is
  // guaranteed to be heard. Dispatching during module eval would race them.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', publish, { once: true });
  } else {
    publish();
  }
}

/** The record as it stands in this browser — seed plus stored draft. */
export const currentMeasure = (
  seed: PerformanceMeasureDefinition,
): PerformanceMeasureDefinition => mergeDraft(seed, readDraft(seed.slug));
