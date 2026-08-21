// measure-reporter-preview — the MODEL and the MARKUP of the entry-form preview
// panel, in one module, because that panel is rendered twice.
//
// WHAT THE PANEL ARGUES, AND WHY IT WAS REBUILT. The previous version drew every
// combination of a measure's subcategories as a filled matrix and announced "16
// values per reporting period". That misrepresents the model in the most
// expensive possible direction: reporting is SPARSE ROWS, not a filled grid. A
// project that only ran broadcast burns on federal ground files ONE entry, not
// sixteen cells of which fifteen are zero. The matrix made a cheap feature look
// punishing, so the matrix is gone — cartesian product, cell count, large-grid
// alarm and all.
//
// WHAT REPLACED IT IS THE CONTRAST ITSELF. A dimension now declares a SOURCE
// (see firma2-performance-measures.ts): `reported` means a person picks it, and
// `spatial` / `historical` / `record` mean the system derives it for nothing. So
// the panel is two blocks with a rule between them — the questions a reporter is
// actually asked, and, underneath, what arrives without being asked. Reading one
// against the other is the whole argument, which is why they are drawn as
// opposites: entry answers sit in sunken wells (a slot someone fills), derived
// answers are plain text (already known).
//
// TWO KINDS OF MEASURE MEAN TWO SHAPES OF FORM, and this module renders both. An
// OUTPUT records work someone did, so its form opens with the question that
// makes an entry an entry — the primary reported dimension, "what did you do" —
// and everything after it qualifies that answer. An OUTCOME records a condition
// someone measured, and it has no such question, because nobody DID a survival
// rate. What an outcome entry is instead is a READING: where it was taken, when
// it was taken, and what the count or the instrument said. So the outcome form
// leads with the place and the date, and its reported dimensions qualify the
// reading ("Years since planting") rather than naming an action.
//
// primaryDimension() returning undefined is therefore the NORMAL case here, not
// missing data. outstandingFields() never asks an outcome for one either — see
// requiresPrimaryDimension in the data module — so a form with no "what did you
// do" is a finished form, and nothing in this module treats it as a gap.
//
// THE PLACE AND THE DATE ARE NOT OPTIONAL ON AN OUTCOME. On an output the mapped
// extent is asked only when a spatial dimension depends on it (volunteer hours
// are never asked where). An outcome record belongs to a place and a monitoring
// effort rather than to a project — measureKind('outcome').reportedBy says
// exactly that — so where and when are the FRAME of the record rather than
// authored dimensions, and they are on the form even when the definition is
// otherwise empty. Which is also why the two blank drafts do not render
// identically: an empty output asks nothing at all, an empty outcome still asks
// where and when, and neither is an error state.
//
// A SPATIALLY DERIVED DIMENSION IS A SPLIT, NOT A LABEL — and this module's most
// important rendering decision. Twenty acres of treatment is not "in critical
// habitat" or "not": it is 18 acres inside and 2 outside. So spatial rows render
// as an ALLOCATION — a list of parts, each carrying its own share of the
// quantity, summing to it. `record` and `historical` dimensions resolve to one
// fact about the entry and carry NO quantity at all. That is the visible
// difference, and it is structural rather than decorative: any row with amounts
// on it divides the quantity; any row without them does not. No per-row icon, no
// provenance caption, no colour — the shape of the value says which kind it is.
//
// ONLY AN OUTPUT'S QUANTITY DIVIDES, though, and that limit is not a detail. An
// allocation is a claim that the total is MADE OF its parts: 20 acres of
// treatment is 18 acres inside the polygon plus 2 outside, and the two add back
// up. A reading is not made of parts. Sixty percent survival is not 54 percent
// inside critical habitat plus 6 percent outside — that is arithmetic on a rate,
// the same category error as summing temperatures, and it is why COUNTING_RULES
// refuses to offer `sum` to an outcome at all. So on an outcome a spatial
// dimension resolves to ONE value: the zone the monitoring location falls in.
// The legend above still holds word for word — amounts present mean the quantity
// divides here — it simply reports, correctly, that a reading divides nowhere.
// (Which is also why the markup decides list-or-text by asking whether a row
// carries amounts, and never by asking what source it came from.)
//
// THE ILLUSTRATIVE SPLIT IS DERIVED, NOT ROLLED. Nothing here is random (a demo
// a client watches must render identically every time), and nothing is a literal
// either. The split falls out of the LAYER'S OWN VOCABULARY: a layer whose
// values include the outside-every-polygon case — `None` — is a layer a treated
// extent can straddle, so the extent lands mostly in the layer's first
// designation with a tenth spilling outside. A layer with no outside case
// (Watershed, County) contains the extent whole. `Unknown` is deliberately NOT
// treated as an outside case: it is a data-quality bucket in the ownership
// layer, not geometry, and splitting on it would claim a boundary that is not
// there. Same record in, same numbers out, on every build and every keystroke.
//
// EVERYTHING INTERPOLATED IS ESCAPED, WITHOUT EXCEPTION. Dimension names, option
// labels, the quantity and the measure's name are user-entered text arriving
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
// ONE RENDERER, TWO CALLERS. The .astro drops this output in with `set:html` at
// build time and the client script drops the same output into the same container
// on MEASURE_CHANGE_EVENT. Writing the markup twice — once in a template, once
// in a script — is the one failure mode a live panel has, and it is silent: the
// copies stay identical until the first fix lands in one of them.

import { escapeHtml } from './format';
import {
  derivedDimensions,
  dimensionValues,
  measureDisplayName,
  measureKind,
  primaryDimension,
  reportedDimensions,
  GEO_LAYERS,
  type MeasureDimension,
  type MeasureKind,
  type PerformanceMeasureDefinition,
} from '../data/firma2-performance-measures';

const esc = escapeHtml;

/**
 * The disclosure's title. Exported so the heading and the status announcement
 * that names the panel read from one string rather than two that drift.
 *
 * IT DOES NOT FORK WITH THE KIND, and that was a decision rather than an
 * oversight. "Reading form preview" was drafted and rejected on the read-aloud
 * pass: "Reading form" garden-paths as a gerund ("reading a form") for exactly
 * the half-second a disclosure summary gets. This string names the PANEL on the
 * setup page — a landmark an admin scans past and an announcement's referent —
 * and every measure, of either kind, produces entries. The fork is expressed
 * INSIDE the form, where a reporter would actually meet it: the block heading,
 * the fields, and the line naming who files the record.
 */
export const PREVIEW_PANEL_TITLE = 'Entry form preview';

// Hooks the client script queries. They live beside the markup that carries them
// so a rename is one edit, not a silent miss in a file the compiler never links.
export const PREVIEW_ROOT_ATTR = 'data-firma2-reporter-preview';
export const PREVIEW_ROOT_SELECTOR = `[${PREVIEW_ROOT_ATTR}]`;

/** The count the status announcement watches, parked on the root as an attribute. */
export const PREVIEW_COUNT_ATTR = 'data-question-count';

// ---------------------------------------------------------------------------
// The model
// ---------------------------------------------------------------------------

/**
 * Why a field is on the entry form. Decides how the value cell is drawn.
 *
 * `date` exists only on an outcome: when a reading was taken is part of the
 * record's frame, not a dimension anyone authored. It is kept distinct from
 * `dimension` even though the two share a cell shape, because a field's reason
 * for being on the form is the thing this type is for — collapsing it would
 * make the model say the author declared something they did not.
 */
export type PreviewFieldKind = 'dimension' | 'place' | 'date' | 'quantity';

export interface PreviewField {
  /** The form label. For a dimension this is the AUTHOR'S OWN NAME for it. */
  label: string;
  /** The illustrative answer shown in the well. */
  value: string;
  /** The unit, drawn OUTSIDE the well — a reporter types the number, not "acres". */
  suffix: string | null;
  kind: PreviewFieldKind;
}

/** One share of the quantity, or — for a single-valued derivation — one fact. */
export interface DerivedPart {
  value: string;
  /**
   * "18 acres". Null whenever the quantity does not divide here: every record
   * and historical dimension, and every dimension at all on an outcome, whose
   * quantity is a reading and has no parts to be made of.
   */
  amount: string | null;
}

export interface PreviewDerivation {
  label: string;
  kind: 'spatial' | 'historical' | 'record';
  parts: DerivedPart[];
}

export interface ReporterPreviewModel {
  /** Which record this model describes — the client re-renders only its own panel. */
  slug: string;
  /** Output or outcome. Everything below already reflects it; carried for callers. */
  kind: MeasureKind;
  /** The measure's name as a reporter would see it at the top of their entry. */
  formTitle: string;
  /** "Add entry" / "Add reading" — the form's own verb for what it files. */
  entryHeading: string;
  /**
   * The one line of chrome: that these values are illustrative, and who files
   * the real thing. Built from the kind, so it cannot claim a project reports a
   * reading that a monitoring effort files.
   */
  note: string;
  guidance: string;
  guidanceId: string;
  /** The questions. Primary first on an output; place and date first on an outcome. */
  fields: PreviewField[];
  /** What arrives without being asked, spatial first. */
  derivations: PreviewDerivation[];
  questionCount: number;
  dimensionCount: number;
  /** "4 questions per entry" — the cost half of the trade. */
  questionText: string;
  /** "6 breakdowns on the report" — the yield half. */
  dimensionText: string;
  /** The same two facts as one spoken sentence, for the status announcement. */
  costSummary: string;
}

// THE ILLUSTRATIVE QUANTITY, keyed by unit rather than invented per measure. A
// number is needed because an allocation cannot be drawn without one; keying it
// to the unit keeps it domain-credible (20 acres of treatment, 40 volunteer
// hours, 4 miles of channel) and keeps this module a pure function of the
// record. Round numbers on purpose: the figure is scenery, the SPLIT is the
// content, and a quantity like 23.7 invites a reader to work out where it came
// from.
const EXAMPLE_QUANTITY: Record<string, number> = {
  acres: 20,
  miles: 4,
  'square feet': 5000,
  'linear feet': 1200,
  each: 2,
  plants: 400,
  pounds: 250,
  tons: 12,
  'tons per year': 12,
  hours: 40,
  dollars: 5000,
  percent: 60,
};
const DEFAULT_QUANTITY = 10;

// THE MAPPED FEATURE the entry is attached to, also keyed by unit, because the
// unit is what says whether the work happened over an area, along a line, or at
// a point. A fuels unit, a stream reach and a barrier site are the three shapes
// this catalog actually contains.
const EXAMPLE_PLACE: Record<string, string> = {
  acres: 'Unit 3',
  'square feet': 'Unit 3',
  plants: 'Unit 3',
  miles: 'Reach 2',
  'linear feet': 'Reach 2',
};
const DEFAULT_PLACE = 'Site 4';

// THE MONITORING LOCATION an outcome's reading was taken at, which is a
// different kind of place from a treated extent and named differently in the
// field: a survival survey happens on a fixed PLOT, a water-quality or flow
// reading at a STATION, a fish count along a REACH. Same determinism as above —
// keyed by the unit, so the same record always names the same location.
const EXAMPLE_READING_PLACE: Record<string, string> = {
  'degrees Celsius': 'Station 2',
  'cubic feet per second': 'Station 2',
  'parts per million': 'Station 2',
  miles: 'Reach 2',
  'linear feet': 'Reach 2',
};
const DEFAULT_READING_PLACE = 'Plot 7';

// WHEN THE READING WAS TAKEN. A literal, for the same reason every other example
// value is one: a demo a client watches must render identically on every build,
// so no clock. The YEAR is not arbitrary — a measure carrying the `reporting-year`
// record dimension shows "2026" in the derived block below, and on an outcome
// that year is derived FROM this date. Two dates that disagreed would read as a
// bug in the model rather than as scenery. Mid-June is when a survival survey
// falls, after leaf-out and before the count stops meaning anything.
const EXAMPLE_READING_DATE = 'June 12, 2026';

/**
 * The words the two kinds put on the form. Only the strings live here; WHO files
 * the record is read from measureKind() rather than restated, because that fact
 * belongs to the data module and a second copy of it would be the thing that
 * drifts.
 *
 * "Add reading" over "Record a reading" / "Log a reading": `record` is a
 * data-model noun everywhere else in this feature, so using it as a verb reads
 * ambiguously, and "Add" keeps the outcome heading parallel with the output's
 * "Add entry" — the two forms are siblings, and a reader comparing them should
 * be looking at the fields, not at two different grammars.
 */
const KIND_COPY: Record<
  MeasureKind,
  {
    /** The heading over the block of questions. */
    entryHeading: string;
    /** What one filed record is called, for the note line. */
    exampleNoun: string;
    /** Label for the value cell when the author has not named the quantity yet. */
    quantityFallback: string;
    /** Label for the reading date. Outcome only; the output branch never asks. */
    dateLabel: string;
  }
> = {
  output: {
    entryHeading: 'Add entry',
    exampleNoun: 'entry',
    quantityFallback: 'Amount',
    dateLabel: '',
  },
  outcome: {
    entryHeading: 'Add reading',
    exampleNoun: 'reading',
    quantityFallback: 'Reading',
    // "Measured on" over "Survey date" / "Reading date": not every outcome is a
    // survey (a logger records a temperature nobody attended), and "Measured"
    // front-loads the information that the generic word "Date" does not carry.
    dateLabel: 'Measured on',
  },
};

/** One label for the mapped feature, both kinds. What it holds differs; the question does not. */
const PLACE_LABEL = 'Place';

// Values for the two derived kinds that are not spatial. `historical` normally
// takes the first value its rule can return; a rule with an open answer (the
// year a place was first treated) gets a literal here instead.
const EXAMPLE_RECORD: Record<string, string> = {
  'reporting-year': '2026',
  project: 'Deer Creek Fuel Break',
  'lead-organization': 'Yuba Watershed Council',
  program: 'Forest Health & Fuels',
};
const EXAMPLE_HISTORICAL: Record<string, string> = {
  'first-treatment-year': '2019',
};

/** The layer value that means "outside every polygon" — the one that splits. */
const OUTSIDE_CASE = 'None';

/** The share that falls outside, when a layer has an outside case at all. */
const OUTSIDE_SHARE = 0.1;

const layerFor = (d: MeasureDimension) => GEO_LAYERS.find((l) => l.id === d.source.ref);

/**
 * The definition, reduced to everything the preview draws. Pure: same record in,
 * same model out, no DOM, no clock, no storage, no randomness — which is what
 * lets the build and the browser produce byte-identical markup from it.
 */
export function buildReporterPreviewModel(
  measure: PerformanceMeasureDefinition,
): ReporterPreviewModel {
  const unit = measure.unit?.trim() ?? '';
  const decimals = Math.max(0, measure.decimalPlaces);
  const number = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const amount = (n: number): string => (unit ? `${number.format(n)} ${unit}` : number.format(n));

  const quantityTotal = EXAMPLE_QUANTITY[unit] ?? DEFAULT_QUANTITY;

  // ONLY `reported` DIMENSIONS ARE QUESTIONS. Both lists come from the data
  // module's own helpers — re-filtering `dimensions` by hand here would be a
  // second copy of the rule that decides what a question is.
  //
  // On an OUTPUT the primary one leads: it is what makes an entry an entry, so
  // it is asked first and everything after it qualifies the answer. On an
  // OUTCOME there is none to lead with, and `undefined` here is that ordinary
  // fact rather than a gap — see the header. `supporting` then simply holds
  // every reported dimension, which is the correct reading of an outcome's
  // dimensions: they all qualify a reading, none of them names an action.
  const isOutcome = measure.kind === 'outcome';
  const copy = KIND_COPY[measure.kind];
  const primary = primaryDimension(measure);
  const reported = reportedDimensions(measure);
  const supporting = reported.filter((d) => d !== primary);
  const derived = derivedDimensions(measure);
  const spatial = derived.filter((d) => d.source.kind === 'spatial');

  const dimensionField = (d: MeasureDimension): PreviewField => ({
    label: d.name.trim() || 'Untitled question',
    // The first option, every time. Deterministic, and it is the author's own
    // vocabulary rather than an invented answer.
    value: (d.options ?? []).find((o) => o.trim()) ?? '',
    suffix: null,
    kind: 'dimension',
  });

  const fields: PreviewField[] = [];

  // "WHAT DID YOU DO" — an output's opening question, and an outcome's absent
  // one. Nobody did a survival rate, so there is nothing to ask here and the
  // form starts one line lower.
  if (primary) fields.push(dimensionField(primary));

  if (isOutcome) {
    // WHERE AND WHEN ARE THE READING. They are asked unconditionally, before
    // anything else, because they are what an outcome record IS: a condition
    // observed at a place on a day. Neither is an authored dimension, which is
    // why neither appears in `measure.dimensions` and why an outcome asks two
    // questions before its author has declared a single one.
    //
    // The date also does real work below: on an outcome, the derived
    // `reporting-year` row is read off this date rather than off a filing
    // timestamp. Which year a reading belongs to is decided by when it was
    // taken — a September survey typed up in January is September's.
    fields.push({
      label: PLACE_LABEL,
      value: EXAMPLE_READING_PLACE[unit] ?? DEFAULT_READING_PLACE,
      suffix: null,
      kind: 'place',
    });
    fields.push({ label: copy.dateLabel, value: EXAMPLE_READING_DATE, suffix: null, kind: 'date' });
  } else if (spatial.length > 0) {
    // ON AN OUTPUT THE PLACE IS ASKED ONLY WHEN SOMETHING SPATIAL DEPENDS ON IT.
    // That is the honest accounting in both directions: a mapped extent is a
    // real question a reporter answers, so it counts against the cost — and it
    // is also the single question that BUYS every spatial dimension below. A
    // measure with no spatial dimension (volunteer hours) is never asked where,
    // and nothing derives.
    fields.push({ label: PLACE_LABEL, value: EXAMPLE_PLACE[unit] ?? DEFAULT_PLACE, suffix: null, kind: 'place' });
  }

  // The quantity, labelled with the author's own word for it — "Treated extent",
  // "Survival at survey" — which is more use to a reporter than either kind's
  // generic noun, so the fallback only appears while the author has named a unit
  // but not yet the thing being counted. Omitted entirely while neither the
  // quantity nor the unit is decided: an unlabelled slot on a blank draft would
  // be a field the measure has not asked for yet.
  if (measure.quantity.trim() || unit) {
    fields.push({
      label: measure.quantity.trim() || copy.quantityFallback,
      value: number.format(quantityTotal),
      suffix: unit || null,
      kind: 'quantity',
    });
  }

  fields.push(...supporting.map(dimensionField));

  const derivationFor = (d: MeasureDimension): PreviewDerivation => {
    const label = d.name.trim() || 'Untitled breakdown';

    if (d.source.kind === 'spatial') {
      const values = layerFor(d)?.values ?? [];
      const inside = values.find((v) => v !== OUTSIDE_CASE) ?? '';

      // AN OUTCOME'S QUANTITY IS NOT ALLOCABLE, so its spatial dimensions carry
      // no amounts: the layer classifies the monitoring location, and that is
      // the whole of what it says. Splitting a rate across a polygon boundary
      // would be arithmetic the model explicitly refuses elsewhere — see the
      // header, and countingRulesFor('outcome'), which offers no `sum`. This
      // returns before any share is computed rather than computing shares and
      // hiding them, so nothing downstream can resurrect a number that has no
      // meaning.
      if (isOutcome) return { label, kind: 'spatial', parts: [{ value: inside, amount: null }] };

      const splits = values.includes(OUTSIDE_CASE);
      // Rounded to the measure's own precision, and the remainder goes to the
      // inside share so the parts always sum to the quantity exactly. A spill
      // that rounds to nothing is not drawn: two barriers cannot be 1.8 inside
      // and 0.2 outside, and a part reading "0" would be worse than no split.
      const outsideRaw = Number((quantityTotal * OUTSIDE_SHARE).toFixed(decimals));
      const parts: DerivedPart[] =
        splits && outsideRaw > 0
          ? [
              { value: inside, amount: amount(quantityTotal - outsideRaw) },
              { value: OUTSIDE_CASE, amount: amount(outsideRaw) },
            ]
          : [{ value: inside, amount: amount(quantityTotal) }];
      return { label, kind: 'spatial', parts };
    }

    if (d.source.kind === 'historical') {
      const ref = d.source.ref ?? '';
      const value = EXAMPLE_HISTORICAL[ref] ?? dimensionValues(d)[0] ?? '';
      return { label, kind: 'historical', parts: [{ value, amount: null }] };
    }

    const ref = d.source.ref ?? '';
    return {
      label,
      kind: 'record',
      parts: [{ value: EXAMPLE_RECORD[ref] ?? dimensionValues(d)[0] ?? '', amount: null }],
    };
  };

  // Spatial first: they are the ones that divide the quantity, and putting the
  // allocations together means the amounts read as one column instead of being
  // interleaved with single facts.
  const order = { spatial: 0, historical: 1, record: 2 } as const;
  const derivations = derived
    .map(derivationFor)
    .map((row, i) => ({ row, i }))
    // Stable: equal kinds keep the author's declared order.
    .sort((a, b) => order[a.row.kind] - order[b.row.kind] || a.i - b.i)
    .map(({ row }) => row);

  const questionCount = fields.length;
  const dimensionCount = measure.dimensions.length;

  // THE TRADE, STATED ONCE, AS A DATUM. Cost on the left, yield on the right, no
  // sentence around them: what a reporter is asked for, against what the program
  // can slice by. Two facts rather than one, so neither has to carry the other's
  // grammar. Zero is said in the same words as four — a draft that asks nothing
  // and reports nothing is a real answer, not an error state.
  //
  // "PER ENTRY" ON BOTH KINDS, on purpose. This line is the admin's chrome, not
  // the reporter's form: it is what the panel is called, what the announcement
  // says, and the one figure two measures get compared on — so it stays one
  // phrase, and "entry" is the generic for a filed record of either kind. The
  // fork speaks inside the form, where "Add reading" belongs to the person
  // filing it. Forking this too would buy a nuance and cost the comparison.
  const questionText = `${questionCount} ${questionCount === 1 ? 'question' : 'questions'} per entry`;
  // "breakdown" is the UI's collective noun for a dimension — the chart panel
  // is "Breakdown preview" and the table column "Breakdowns"; "dimension"
  // survives only in code and the data model.
  const dimensionText = `${dimensionCount} ${dimensionCount === 1 ? 'breakdown' : 'breakdowns'} on the report`;

  return {
    slug: measure.slug,
    kind: measure.kind,
    formTitle: measureDisplayName(measure),
    entryHeading: copy.entryHeading,
    // WHO FILES THE REAL ONE, in the data module's own words. An output is filed
    // by the project; an outcome by a monitoring effort, about a place — and
    // that second half is the correction this line exists to make, because every
    // other surface on this page belongs to a project and would otherwise imply
    // the project reports its own outcomes. Reading `reportedBy` rather than
    // restating it keeps the panel and the create dialog saying one thing.
    note: `Example ${copy.exampleNoun}. Filed by ${measureKind(measure.kind).reportedBy}.`,
    guidance: measure.reporterGuidance.trim(),
    guidanceId: `${measure.slug}-reporter-guidance`,
    fields,
    derivations,
    questionCount,
    dimensionCount,
    questionText,
    dimensionText,
    // A comma, not the middot the eye gets: the separator on screen is a
    // typographic device, and screen readers either skip it or say "middle dot".
    costSummary: `${questionText}, ${dimensionText}`,
  };
}

// ---------------------------------------------------------------------------
// The markup
// ---------------------------------------------------------------------------

// The heading over the block of questions is per-kind and lives on the model
// (see KIND_COPY): "Add entry" for work someone did, "Add reading" for a
// condition someone measured.

/** The heading over the block nobody fills in. Same for both kinds — how a
 *  dimension derives has nothing to do with what the measure states. */
const DERIVED_HEADING = 'Filled in automatically';

const cls = 'firma2-reporter-preview';

function renderFields(model: ReporterPreviewModel): string {
  if (model.fields.length === 0) return '';

  const rows = model.fields
    .map((field) => {
      // THE WELL. Not an input, not `disabled` — a <span> holding the answer this
      // definition would produce. Zero tab stops, zero controls, nothing to
      // submit, and still real content to a screen reader, so the shape of the
      // form survives non-visually. See the .astro's note for the two mechanisms
      // this was chosen over.
      const wellClass =
        field.kind === 'quantity' ? `${cls}__well ${cls}__well--quantity` : `${cls}__well`;
      const suffix = field.suffix
        ? `<span class="${cls}__unit typography-body-sm">${esc(field.suffix)}</span>`
        : '';
      return [
        `<dt class="${cls}__label typography-body-sm">${esc(field.label)}</dt>`,
        `<dd class="${cls}__value cluster" data-gap="xs">`,
        `<span class="${wellClass} typography-body-sm">${esc(field.value)}</span>`,
        suffix,
        '</dd>',
      ].join('');
    })
    .join('');

  // GUIDANCE AT THE POINT OF ENTRY — which is what reporterGuidance is for. It is
  // stored as instruction to the person entering the number, so it renders where
  // they would meet it: immediately above the questions, and wired to them with
  // aria-describedby, exactly as a field hint is.
  const describedBy = model.guidance ? ` aria-describedby="${esc(model.guidanceId)}"` : '';
  const guidance = model.guidance
    ? `<p id="${esc(model.guidanceId)}" class="${cls}__guidance typography-body-md">${esc(model.guidance)}</p>`
    : '';

  return [
    `<div class="${cls}__block stack" data-gap="sm">`,
    `<h4 class="${cls}__block-title typography-label-md-strong">${esc(model.entryHeading)}</h4>`,
    guidance,
    `<dl class="${cls}__rows"${describedBy}>`,
    rows,
    '</dl>',
    '</div>',
  ].join('');
}

function renderDerivations(model: ReporterPreviewModel): string {
  if (model.derivations.length === 0) return '';

  const rows = model.derivations
    .map((row) => {
      // TWO SHAPES, AND THE SHAPE IS THE ARITHMETIC. A row that divides the
      // quantity is a LIST of shares — always, even when an output's extent
      // falls whole inside one polygon, because "North Yuba 20 acres" is still
      // an allocation and drawing it as a bare word would make it
      // indistinguishable from the record row two lines below. A row that
      // divides nothing is plain text with no quantity on it at all. Amounts
      // present = the quantity splits here; no amounts = a single fact. That is
      // the whole legend, and it needs no icon, no colour and no caption.
      //
      // THE TEST IS THE AMOUNTS, NOT THE SOURCE — which is what makes the same
      // renderer correct for both kinds. An output's spatial rows carry shares
      // and list; an outcome's carry none, because a reading has no parts, and
      // they fall through to the same plain text a record row uses. Asking
      // `kind === 'spatial'` here would have drawn a one-item allocation of
      // nothing on every outcome.
      const value =
        row.parts.some((part) => part.amount)
          ? // role="list" restores what `list-style: none` takes away in Safari,
            // which is the one thing this markup cannot afford to lose: an
            // allocation that stops announcing "2 items" is a run-on phrase.
            `<ul role="list" class="${cls}__parts cluster" data-gap="xs">${row.parts
              .map((part) => {
                const label = `<span class="${cls}__part-value">${esc(part.value)}</span>`;
                const amount = part.amount
                  ? `<span class="${cls}__part-amount">${esc(part.amount)}</span>`
                  : '';
                return `<li class="${cls}__part">${label}${amount}</li>`;
              })
              .join('')}</ul>`
          : esc(row.parts[0]?.value ?? '');
      return [
        `<dt class="${cls}__label typography-body-sm">${esc(row.label)}</dt>`,
        `<dd class="${cls}__value typography-body-sm">${value}</dd>`,
      ].join('');
    })
    .join('');

  return [
    `<div class="${cls}__block ${cls}__block--derived stack" data-gap="sm">`,
    `<h4 class="${cls}__block-title typography-label-md-strong">${esc(DERIVED_HEADING)}</h4>`,
    `<dl class="${cls}__rows">`,
    rows,
    '</dl>',
    '</div>',
  ].join('');
}

/**
 * The whole panel body: the measure's name, the trade, the questions, and what
 * arrives without being asked. One function, one container — the previous split
 * existed only to keep an esa-alert-box between two halves, and that alert (the
 * large-grid alarm) is exactly what this rewrite deleted.
 */
export function renderReporterPreview(model: ReporterPreviewModel): string {
  return [
    `<div class="${cls}__head stack" data-gap="xs">`,
    // THE MEASURE'S NAME IS THE FORM'S HEADING, and yes, the page header above
    // says it too. That is not the redundancy the house style cuts — the name at
    // the top of the page identifies the RECORD being edited, and the name here
    // is a component of the artifact, the first thing a reporter reads on their
    // own screen. h3 puts it at the same level as the sibling cards' titles.
    `<h3 class="${cls}__form-title typography-title">${esc(model.formTitle)}</h3>`,
    // The one line of chrome in the panel, and it earns its place twice over.
    // First: this preview carries WORKED NUMBERS, and an admin who reads "20
    // acres · Federal" as a figure from a real project has been misled by the
    // panel — no amount of sunken styling says otherwise. Second: it names who
    // files the real record, which on an outcome is the one thing the rest of
    // this page cannot tell you. Both halves are built from the kind (see the
    // model), so the sentence cannot say "entry" over a form of readings.
    `<p class="${cls}__note typography-body-sm">${esc(model.note)}</p>`,
    '</div>',
    // THE TRADE, AS A DATUM AND NOTHING ELSE. Cost first, because the cost is the
    // thing an author cannot read off any other surface on this page — and it is
    // the one line whose CHANGE is worth announcing. The two facts are separate
    // spans in a cluster, so the yield can wrap under the cost on a narrow rail
    // without breaking a sentence, and the separator is decoration: hidden.
    `<p class="${cls}__cost cluster" data-gap="sm">`,
    `<span class="${cls}__cost-figure typography-label-sm-strong">${esc(model.questionText)}</span>`,
    `<span class="${cls}__sep" aria-hidden="true">·</span>`,
    `<span class="${cls}__cost-yield typography-body-sm">${esc(model.dimensionText)}</span>`,
    '</p>',
    renderFields(model),
    renderDerivations(model),
  ].join('');
}
