// measure-reporter-preview — the MODEL and the MARKUP of the reporting-form
// preview panel, in one module, because that panel is now rendered twice.
//
// WHY THIS FILE EXISTS. firma2-measure-reporter-preview.astro used to be a pure
// build-time render: the admin added a subcategory in the config rail, the
// panel's whole argument ("this definition asks for sixteen numbers a quarter")
// went stale on screen, and the page's central claim — that the preview shows
// what you are defining as you define it — was false. Making it live needs the
// same markup produced in the browser.
//
// THE OBVIOUS WAY TO DO THAT IS THE ONE MISTAKE THAT MATTERS. Write the table in
// the .astro for the server render and again in a client script for the update,
// and the two copies are identical for exactly as long as nobody edits either.
// The first fix that lands in one and not the other — a class, a scope, a
// colspan — is invisible until someone happens to be looking at the panel at the
// moment it changes. So there is ONE renderer, here, and two callers: the .astro
// drops its output in with `set:html` at build time, and the client script drops
// the same output into the same container on MEASURE_CHANGE_EVENT.
//
// EVERYTHING INTERPOLATED IS ESCAPED, WITHOUT EXCEPTION. Subcategory names,
// option labels, the unit and the measure's name are user-entered text arriving
// from a localStorage draft, and this module builds HTML by concatenation — so a
// single unescaped hole is a stored-XSS hole. `esc()` is applied at EVERY
// interpolation, including ones that "obviously" hold a number, because the rule
// that has exceptions is the rule that gets one more.
//
// (escapeHtml comes from ./format, NOT from shared/grid-chrome.ts, which
// re-exports it as escGridHtml. grid-chrome registers all of AG Grid as a
// top-level side effect; importing four lines of escaping from it would ship the
// grid runtime to a page that draws no grid. format.ts exists precisely so this
// import is free — see its own header.)
//
// WHAT LIVES HERE AND WHAT STAYS IN THE .astro. This module owns everything that
// varies with the definition. The .astro keeps the frame that does not: the
// esa-collapsible, and the esa-alert-box for the large-grid note — a lego whose
// markup this module must not reproduce in a string, so the .astro renders one
// instance and the client toggles it from `largeGridNote` below. One source for
// the sentence, one instance of the lego, no second copy of its chrome.

import { escapeHtml } from './format';
import {
  measureDisplayName,
  type PerformanceMeasureDefinition,
} from '../data/firma2-performance-measures';

const esc = escapeHtml;

/** The disclosure's title. Exported so the heading and the status announcement
 *  that names the panel read from one string rather than two that drift. */
export const PREVIEW_PANEL_TITLE = 'Reporting form preview';

// Hooks the client script queries. They live beside the markup that carries them
// so a rename is one edit, not a silent miss in a file the compiler never links.
export const PREVIEW_ROOT_ATTR = 'data-firma2-reporter-preview';
export const PREVIEW_ROOT_SELECTOR = `[${PREVIEW_ROOT_ATTR}]`;
export const PREVIEW_HEAD_SELECTOR = '[data-firma2-preview-head]';
export const PREVIEW_BODY_SELECTOR = '[data-firma2-preview-body]';
export const PREVIEW_ALERT_SELECTOR = '[data-firma2-preview-alert]';
export const PREVIEW_ALERT_TEXT_SELECTOR = '[data-firma2-preview-alert-text]';
export const PREVIEW_SCROLLER_SELECTOR = '.firma2-reporter-preview__scroller';

/**
 * The four shapes a definition can produce.
 *
 *  - `none`         no subcategories: one value, one well.
 *  - `list`         one subcategory: one labelled row per option.
 *  - `matrix`       two subcategories: rows cross columns.
 *  - `combinations` three or more: a grid cannot hold them, so every
 *                   combination is listed (capped — see MAX_COMBINATION_ROWS).
 */
export type ReporterPreviewMode = 'none' | 'list' | 'matrix' | 'combinations';

export interface ReporterPreviewModel {
  /** Which record this model describes — the client re-renders only its own panel. */
  slug: string;
  mode: ReporterPreviewMode;
  /** The measure's name as a reporter would see it at the top of their form. */
  formTitle: string;
  /** Values a reporter fills each period: the product of the option counts. */
  cellCount: number;
  /** "16 values per reporting period" — the figure this panel exists to deliver. */
  countText: string;
  periodLabel: string | null;
  guidance: string;
  guidanceId: string;
  captionId: string;
  /** Which subcategories this grid crosses, plus the unit. Caption AND accessible name. */
  captionText: string;
  rowHeaders: string[];
  columnHeaders: string[];
  hasTable: boolean;
  needsScroller: boolean;
  /** The format mask inside each cell well, unit dropped — see valueMask(). */
  cellMask: string;
  /** The same mask carrying its unit word: the lone value well, and the roll-up. */
  fullMask: string;
  rollUpLabel: string | null;
  /** "3 subcategories don't fit a grid…" — only in `combinations` mode. */
  fallbackText: string | null;
  /** "Showing 12 of 64 combinations." — only when the cap actually bit. */
  truncationText: string | null;
  /** The whole large-grid sentence, or null when the note does not fire. */
  largeGridNote: string | null;
}

// THE PERIOD THIS PREVIEW IS FOR. Invented but deterministic: a fixed period
// label per frequency, not a computed "current" one, so the page renders
// identically on every build. Omitted entirely when frequency is unset — the
// readiness card already reports that gap, and a "not set yet" line here would
// be the same nag twice.
const PERIOD_LABEL = {
  Annually: '2026',
  Quarterly: 'Q3 2026',
  'On completion': 'Completion report',
} as const;

// The flat list is capped. Three subcategories of four options is 64 rows, and
// a preview that runs for two screens stops previewing anything — the reader
// already has the exact total on the meta line above, so what the rows are
// still for is showing the SHAPE, which the first dozen do as well as all 64.
// Twelve, because it is the same threshold the large-grid note uses below.
const MAX_COMBINATION_ROWS = 12;

// TWELVE. Chosen, not inherited. Below it a grid still fits one screen at this
// page's column width and reads as a short form. Above it two things change at
// once: the matrix starts to need horizontal scrolling, and the per-year burden
// stops being a sitting — 16 cells reported quarterly is 64 numbers a year from
// every project on the measure. Twelve also lets the two real 3x4 measures in
// the catalog through unremarked, which matters: a big grid is frequently the
// correct answer, and a note that fires on every second measure is a note
// nobody reads by the third.
const LARGE_GRID_THRESHOLD = 12;

/** Every ordered combination of the option lists — the 3+ fallback's rows. */
const combinations = (lists: string[][]): string[][] =>
  lists.reduce<string[][]>(
    (acc, list) => acc.flatMap((prefix) => list.map((option) => [...prefix, option])),
    [[]],
  );

/**
 * The definition, reduced to everything the preview draws. Pure: same record in,
 * same model out, no DOM, no clock, no storage — which is what lets the build
 * and the browser produce byte-identical markup from it.
 */
export function buildReporterPreviewModel(
  measure: PerformanceMeasureDefinition,
): ReporterPreviewModel {
  // SUBCATEGORIES WITH NO OPTIONS ARE NOT PART OF THE SHAPE. The repeater lets a
  // row be named before its vocabulary is typed, so `subcategories` can hold
  // `{ name: 'Ownership', options: [] }` mid-edit — and now that this panel
  // updates live, that half-built state is on screen constantly rather than only
  // at build time. Folding it into the product would multiply by zero and report
  // "0 values per reporting period" — a number that is both wrong and alarming —
  // so an option-less dimension is simply not splitting anything yet, and is
  // skipped until its vocabulary exists.
  const subs = measure.subcategories.filter((s) => s.options.length > 0);

  const cellCount = subs.reduce((n, s) => n * s.options.length, 1);

  // The value notation the definition produces. `compact` drops the word unit for
  // dense contexts — repeating "acres" in twenty cells is noise, so the unit is
  // stated once, in the column heading and again on the roll-up. `%` and `$` are
  // never dropped: they are the number's own notation, not a unit word.
  const zeros = '0'.repeat(Math.max(0, measure.decimalPlaces));
  const numberMask = measure.decimalPlaces > 0 ? `0.${zeros}` : '0';
  const valueMask = (compact: boolean): string => {
    if (measure.dataType === 'Currency') return `$${numberMask}`;
    if (measure.dataType === 'Percent') return `${numberMask}%`;
    const unit = measure.unit.trim();
    return compact || !unit ? numberMask : `${numberMask} ${unit}`;
  };

  // The heading for a lone value column. The unit is the best word for it when
  // there is one ("acres", "barriers"); percent and currency measures carry no
  // unit, so they name the quantity instead.
  const valueColumnLabel =
    measure.unit.trim() || (measure.dataType === 'Currency' ? 'Amount' : 'Value');

  // A MATRIX CAN SHOW TWO DIMENSIONS. THREE IS A DIFFERENT DRAWING. Rows carry
  // one subcategory and columns carry the other; a third has nowhere to go, and
  // the failure modes are both bad — silently dropping it draws a grid that is
  // not the form, and nesting header bands draws a table almost nobody can read
  // aloud. So at three or more the panel stops pretending to be a grid and lists
  // every combination as its own labelled row. It is uglier, which is the point:
  // the shape on screen is the shape the admin built.
  const mode: ReporterPreviewMode =
    subs.length === 0 ? 'none' : subs.length === 1 ? 'list' : subs.length === 2 ? 'matrix' : 'combinations';

  const allCombinationLabels =
    mode === 'combinations' ? combinations(subs.map((s) => s.options)).map((c) => c.join(', ')) : [];
  const shownCombinationLabels = allCombinationLabels.slice(0, MAX_COMBINATION_ROWS);
  const combinationsTruncated = allCombinationLabels.length > shownCombinationLabels.length;

  const rowHeaders: string[] =
    mode === 'matrix' || mode === 'list'
      ? subs[0].options
      : mode === 'combinations'
        ? shownCombinationLabels
        : [];
  const columnHeaders: string[] = mode === 'matrix' ? subs[1].options : [valueColumnLabel];

  // The table's accessible name, and its visible caption — one string doing both
  // jobs, because a caption a sighted reader needs and a name a screen-reader
  // user needs are the same sentence here: which subcategories this grid crosses.
  const unit = measure.unit.trim();
  const crossed =
    mode === 'matrix'
      ? `${subs[0].name} by ${subs[1].name}`
      : mode === 'combinations'
        ? subs.map((s) => s.name).join(', ')
        : mode === 'list'
          ? subs[0].name
          : '';

  const valuesPerYear = measure.reportingFrequency === 'Quarterly' ? cellCount * 4 : cellCount;

  // INFO, NOT WARNING. Nothing is broken and nothing needs fixing — the admin may
  // well need every one of those cells. The box states the annual cost and offers
  // the lever; the amber variant would be claiming a mistake this component
  // cannot know has been made.
  const burdenSentence =
    measure.reportingFrequency === 'Quarterly'
      ? `${valuesPerYear} values a year, per project — ${cellCount} every quarter.`
      : measure.reportingFrequency === 'On completion'
        ? `${cellCount} values per project, once at completion.`
        : measure.reportingFrequency === 'Annually'
          ? `${cellCount} values a year, per project.`
          : `${cellCount} values per project, every reporting period.`;

  return {
    slug: measure.slug,
    mode,
    formTitle: measureDisplayName(measure),
    cellCount,
    countText: `${cellCount} ${cellCount === 1 ? 'value' : 'values'} per reporting period`,
    periodLabel: measure.reportingFrequency ? PERIOD_LABEL[measure.reportingFrequency] : null,
    guidance: measure.reporterGuidance.trim(),
    guidanceId: `${measure.slug}-reporter-guidance`,
    captionId: `${measure.slug}-preview-caption`,
    // The unit rides along with the crossed names, never alone: with no
    // subcategories there is no table and no caption, and a bare "(acres)" is a
    // caption for nothing.
    captionText: crossed && unit ? `${crossed} (${unit})` : crossed,
    rowHeaders,
    columnHeaders,
    hasTable: rowHeaders.length > 0,
    // A HORIZONTAL SCROLLER, ONLY WHEN THERE IS SOMETHING TO SCROLL. A matrix can
    // run to five or six columns; the one-value shapes never overflow.
    needsScroller: columnHeaders.length > 2,
    cellMask: valueMask(true),
    fullMask: valueMask(false),
    // The roll-up row. `aggregation` is documented as how values from MANY
    // PROJECTS combine into a program total, and on one project's form the same
    // word governs how that project's own cells combine — so the label is the
    // aggregation's own name rather than an invented one. "Most recent" gets NO
    // row: the latest of a set of cells entered together is not a quantity, and
    // drawing a slot for it would be inventing arithmetic the form does not do.
    // A single-cell form gets no row either — a total of one number is that number.
    rollUpLabel:
      cellCount > 1 && (measure.aggregation === 'Sum' || measure.aggregation === 'Average')
        ? measure.aggregation === 'Sum'
          ? 'Total'
          : 'Average'
        : null,
    fallbackText:
      mode === 'combinations'
        ? `${subs.length} subcategories don't fit a grid, so every combination is listed.`
        : null,
    truncationText: combinationsTruncated
      ? `Showing ${shownCombinationLabels.length} of ${allCombinationLabels.length} combinations.`
      : null,
    largeGridNote:
      cellCount > LARGE_GRID_THRESHOLD
        ? `${burdenSentence} Keep the split if you need it, or remove a subcategory.`
        : null,
  };
}

// ---------------------------------------------------------------------------
// The markup. Two functions rather than one, because the large-grid esa-alert-box
// sits BETWEEN them: the note elaborates the count line it follows, and a
// sixteen-cell table pushes anything underneath it off the bottom of the panel —
// a note about the size of a thing has to arrive before the thing, or it arrives
// after the reader has stopped looking. Keeping the lego in the .astro at that
// exact position costs one extra container and one extra call; reproducing
// esa-alert-box's chrome in a template literal would cost the lego.
// ---------------------------------------------------------------------------

/** Title, the "not editable" line, and the count/period meta. */
export function renderReporterPreviewHead(model: ReporterPreviewModel): string {
  return [
    '<div class="stack" data-gap="xs">',
    // THE MEASURE'S NAME IS THE FORM'S HEADING, and yes, the page header above
    // says it too. That is not the redundancy the house style cuts — the name at
    // the top of the page identifies the RECORD being edited, and the name here
    // is a component of the artifact, the first thing a reporter reads on their
    // own screen. h3 puts it at the same level as the sibling cards' titles.
    `<h3 class="firma2-reporter-preview__form-title typography-title">${esc(model.formTitle)}</h3>`,
    // The one sentence of chrome in the panel. The disclosure summary already
    // says "preview" and the cells are drawn as wells rather than fields, so this
    // is the third signal — kept anyway, because the cost of a reader believing
    // they can report data from the setup screen is a support ticket and the cost
    // of this line is 48 characters.
    '<p class="firma2-reporter-preview__note typography-body-sm">Projects fill this in. Nothing here is editable.</p>',
    '</div>',
    // THE NUMBER THIS PANEL EXISTS TO DELIVER, and the period it applies to. A
    // cluster of two independent facts rather than one sentence, so neither has
    // to carry the other's grammar and the period can be absent without leaving a
    // hole. The count leads because it is the thing that cannot be read off any
    // other surface — and it is the one line whose CHANGE is worth announcing.
    '<p class="firma2-reporter-preview__meta cluster" data-gap="sm">',
    `<span class="firma2-reporter-preview__count typography-label-sm-strong">${esc(model.countText)}</span>`,
    model.periodLabel
      ? `<span class="firma2-reporter-preview__sep" aria-hidden="true">·</span><span class="typography-body-sm">${esc(model.periodLabel)}</span>`
      : '',
    '</p>',
  ].join('');
}

/** Guidance, the fallback note, the value slots themselves, and the truncation line. */
export function renderReporterPreviewBody(model: ReporterPreviewModel): string {
  const parts: string[] = [];

  // GUIDANCE AT THE POINT OF ENTRY — which is what reporterGuidance is for. It is
  // stored as instruction to the person typing the number, so it renders where
  // they would meet it: immediately above the value slots, and wired to them with
  // aria-describedby, exactly as a field hint is.
  if (model.guidance) {
    parts.push(
      `<p id="${esc(model.guidanceId)}" class="firma2-reporter-preview__guidance typography-body-md">${esc(model.guidance)}</p>`,
    );
  }

  if (model.fallbackText) {
    parts.push(
      `<p class="firma2-reporter-preview__fallback typography-body-sm">${esc(model.fallbackText)}</p>`,
    );
  }

  if (model.hasTable) {
    // The role="region" + tabindex="0" + accessible-name trio is the documented
    // pattern for a scrollable table: without it a keyboard-only user cannot
    // reach the right-hand columns at all. It is the ONE tab stop this panel
    // adds, and it is the opposite of the dozen fake inputs the cells
    // deliberately are not — it goes somewhere and does something.
    const scrollerAttrs = model.needsScroller
      ? ` role="region" aria-labelledby="${esc(model.captionId)}" tabindex="0"`
      : '';
    const scrollerClass = model.needsScroller
      ? 'firma2-reporter-preview__scroller firma2-reporter-preview__scroller--pannable'
      : 'firma2-reporter-preview__scroller';
    const describedBy = model.guidance ? ` aria-describedby="${esc(model.guidanceId)}"` : '';

    parts.push(`<div class="${scrollerClass}"${scrollerAttrs}>`);
    parts.push(`<table class="firma2-reporter-preview__table"${describedBy}>`);
    // The caption is both the visible label for the grid and its accessible
    // name: which subcategories are crossed here, plus the unit, said once
    // instead of in every cell.
    parts.push(
      `<caption id="${esc(model.captionId)}" class="firma2-reporter-preview__caption typography-label-sm">${esc(model.captionText)}</caption>`,
    );
    // The corner cell is empty and must stay a <td>: it heads nothing, and a <th>
    // there would be announced as a heading for both the row labels and the columns.
    parts.push('<thead><tr><td class="firma2-reporter-preview__corner"></td>');
    for (const header of model.columnHeaders) {
      parts.push(
        `<th scope="col" class="firma2-reporter-preview__col-head typography-label-sm-strong">${esc(header)}</th>`,
      );
    }
    parts.push('</tr></thead><tbody>');
    for (const rowHeader of model.rowHeaders) {
      parts.push(
        `<tr><th scope="row" class="firma2-reporter-preview__row-head typography-body-sm">${esc(rowHeader)}</th>`,
      );
      for (let i = 0; i < model.columnHeaders.length; i += 1) {
        // The well. Not an input, not disabled — a <span> holding the format mask
        // the definition produces. Zero tab stops, zero controls, nothing to
        // submit, and still real content inside a properly headed table, so the
        // shape of the form survives non-visually.
        parts.push(
          `<td class="firma2-reporter-preview__cell"><span class="firma2-reporter-preview__slot typography-body-sm">${esc(model.cellMask)}</span></td>`,
        );
      }
      parts.push('</tr>');
    }
    parts.push('</tbody>');
    if (model.rollUpLabel) {
      // Plain text, NOT a slot. The roll-up is computed from the cells above it,
      // so drawing it in the same well would say a reporter types it — the one
      // thing about this row that is worth getting right. It carries the unit
      // because it is the figure that leaves the form.
      parts.push(
        `<tfoot><tr><th scope="row" class="firma2-reporter-preview__row-head typography-label-sm-strong">${esc(model.rollUpLabel)}</th>`,
        `<td class="firma2-reporter-preview__rollup typography-body-sm" colspan="${esc(String(model.columnHeaders.length))}">${esc(model.fullMask)}</td></tr></tfoot>`,
      );
    }
    parts.push('</table></div>');
  } else {
    // NO SUBCATEGORIES — one value, and a complete answer. It gets no label: the
    // form's heading two lines up IS this field's label, and repeating the
    // measure's name over its only input is the kind of duplication a real form
    // would not ship either.
    parts.push(
      `<div class="firma2-reporter-preview__single"><span class="firma2-reporter-preview__slot typography-body-md">${esc(model.fullMask)}</span></div>`,
    );
  }

  if (model.truncationText) {
    parts.push(
      `<p class="firma2-reporter-preview__truncation typography-body-sm">${esc(model.truncationText)}</p>`,
    );
  }

  return parts.join('');
}
