// Drawing an intake question — shared by the builder's canvas (inert, as a
// preview of what members get) and the member's intake page (live). ONE
// RENDERER, so the builder cannot show a form that differs from the one
// members fill.
//
// Every control is a runtime esa-* lego (esa-text-field, esa-textarea,
// esa-radio-group, esa-checkbox-group, esa-combobox, esa-date-picker). Their
// option lists and values are PROPERTIES, so markup carries the attributes and
// `hydrateQuestions` assigns the rest once the elements are defined (the
// upgrade-shadow rule: never before define).
//
// LOCATION is a coordinates field with a map above it. The field is the
// question — it carries the label, help, required and the keyboard path; the
// map is a faster pointer path to the same value (click to pin), hidden from
// assistive tech because the field already says everything it does.

import { builtin } from '../data/firma2-intake';
import type { Answers, QuestionBlock } from '../data/firma2-intake';
import type { FieldDefinition } from '../data/firma2-project-types';
import { answerKey, choicesFor } from './intake-form';
import { createMap, loadLeaflet } from './leaflet';
import { parsePair } from './geo';
import { isFormatted, sanitizeInline } from './inline-format';

export type Input = 'text' | 'long-text' | 'number' | 'money' | 'year' | 'date' | 'choice' | 'combo' | 'multi' | 'combo-multi' | 'yes-no' | 'location';

const esc = (s: string): string => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Which control a question draws. Long built-in lists take a searchable combobox. */
export const inputOf = (block: QuestionBlock, fields: FieldDefinition[]): Input => {
  if (block.type === 'builtin') {
    const input = builtin(block.key).input;
    if (input === 'choice') return block.key === 'projectType' ? 'choice' : 'combo';
    if (input === 'multi-choice' || input === 'people') return 'combo-multi';
    return input;
  }
  const field = fields.find((f) => f.id === block.fieldId);
  switch (field?.kind) {
    case 'long-text':
      return 'long-text';
    case 'number':
      return 'number';
    case 'money':
      return 'money';
    case 'date':
      return 'date';
    case 'choice':
      return 'choice';
    case 'multi-choice':
      return 'multi';
    case 'yes-no':
      return 'yes-no';
    default:
      return 'text';
  }
};

/** The kind's name as the builder's sidebar and settings say it. */
export const INPUT_NAMES: Record<Input, string> = {
  text: 'Short text',
  'long-text': 'Long text',
  number: 'Number',
  money: 'Money',
  year: 'Year',
  date: 'Date',
  choice: 'Single select',
  combo: 'Single select',
  multi: 'Multi-select',
  'combo-multi': 'Multi-select',
  'yes-no': 'Yes or no',
  location: 'Map location',
};

interface Options {
  /** Members' page: the lego carries the label and help. The canvas draws its own, editable. */
  labelled: boolean;
}

/** The control's markup. Hydrate it with `hydrateQuestions` once it is in the DOM. */
/** The inputs whose empty box takes example text (Tally's placeholder). */
export const PLACEHOLDER_INPUTS: ReadonlySet<string> = new Set(['text', 'long-text', 'number', 'money']);

export const controlMarkup = (block: QuestionBlock, fields: FieldDefinition[], options: Options): string => {
  // FORMATTED COPY IS DRAWN HERE, not by the lego: an esa-* control takes its
  // label and help as plain strings. So a question whose label or help has
  // bold, italics or a link gets them above and below the control, and the
  // control keeps the plain wording as its accessible name (aria-label) and
  // its own required state. Plain questions stay entirely the lego's.
  if (options.labelled && (isFormatted(block.labelHtml) || isFormatted(block.helpHtml))) {
    const label = block.labelHtml ? sanitizeInline(block.labelHtml).html : esc(block.label);
    const help = block.helpHtml ? sanitizeInline(block.helpHtml).html : block.help ? esc(block.help) : '';
    const star = block.required ? '<span class="firma2-intake-q__required" aria-hidden="true">*</span>' : '';
    const control = rawControl({ ...block, help: undefined }, fields, `aria-label="${esc(block.label || 'Untitled question')}"${block.required ? ' required' : ''}`);
    return `<div class="firma2-intake-q stack" data-gap="xs">
      <p class="firma2-intake-q__label typography-label-md">${label}${star}</p>
      ${control}
      ${help ? `<p class="firma2-intake-q__help typography-body-sm">${help}</p>` : ''}
    </div>`;
  }
  const { labelled } = options;
  const name = labelled
    ? `label="${esc(block.label)}"${block.help ? ` help-text="${esc(block.help)}"` : ''}${block.required ? ' required' : ''}`
    : `aria-label="${esc(block.label || 'Untitled question')}"`;
  return rawControl(block, fields, name);
};

/** The lego for a question, with `name` as its label attributes. */
const rawControl = (block: QuestionBlock, fields: FieldDefinition[], name: string): string => {
  const input = inputOf(block, fields);
  const field = block.type === 'field' ? fields.find((f) => f.id === block.fieldId) : undefined;
  const key = `data-answer="${esc(answerKey(block))}" data-input="${input}"`;
  // The administrator's example text, for the boxes that take free text.
  const ph = block.placeholder ? ` placeholder="${esc(block.placeholder)}"` : '';
  switch (input) {
    case 'long-text':
      return `<esa-textarea ${key} ${name} size="md" rows="4" auto-resize${ph}></esa-textarea>`;
    case 'number':
      return `<esa-text-field ${key} ${name} size="md" type="number" inputmode="decimal"${field?.unit ? ` suffix="${esc(field.unit)}"` : ''}${ph}></esa-text-field>`;
    case 'money':
      return `<esa-text-field ${key} ${name} size="md" type="number" inputmode="decimal" prefix="$"${ph}></esa-text-field>`;
    case 'year':
      return `<esa-text-field ${key} ${name} size="md" type="number" inputmode="numeric" placeholder="2027"></esa-text-field>`;
    case 'date':
      return `<esa-date-picker ${key} ${name} size="md"></esa-date-picker>`;
    case 'choice':
    case 'yes-no':
      return `<esa-radio-group ${key} ${name} size="md"${input === 'yes-no' ? ' orientation="horizontal"' : ''}></esa-radio-group>`;
    case 'multi':
      return `<esa-checkbox-group ${key} ${name} size="md"></esa-checkbox-group>`;
    case 'combo':
      return `<esa-combobox ${key} ${name} size="md" placeholder="Search"></esa-combobox>`;
    case 'combo-multi':
      return `<esa-combobox ${key} ${name} size="md" multiple placeholder="Search"></esa-combobox>`;
    case 'location':
      return `<div class="firma2-intake-location stack" data-gap="sm">
        <div class="firma2-intake-location__map" aria-hidden="true" data-location-map></div>
        <esa-text-field ${key} ${name} size="md" placeholder="40.0712, -121.1834"></esa-text-field>
      </div>`;
    default:
      return `<esa-text-field ${key} ${name} size="md"${ph}></esa-text-field>`;
  }
};

type Control = HTMLElement & { options?: unknown; value?: unknown };

/** Assign option lists and values to every question control under `root`. */
export const hydrateQuestions = async (root: HTMLElement, blocks: QuestionBlock[], answers: Answers, fields: FieldDefinition[], live: boolean): Promise<void> => {
  await Promise.all(['esa-text-field', 'esa-textarea', 'esa-radio-group', 'esa-checkbox-group', 'esa-combobox', 'esa-date-picker'].map((t) => customElements.whenDefined(t)));
  for (const block of blocks) {
    const key = answerKey(block);
    const el = root.querySelector<Control>(`[data-answer="${CSS.escape(key)}"]`);
    if (!el) continue;
    const input = el.dataset.input as Input;
    const value = answers[key];
    if (input === 'location') {
      const point = Array.isArray(value) ? (value as [number, number]) : undefined;
      if (point) el.value = point.join(', ');
      void mountLocation(el, point, live);
      continue;
    }
    if (['choice', 'yes-no', 'multi', 'combo', 'combo-multi'].includes(input)) {
      el.options = choicesFor(block, fields).map((o) => ({ label: o, value: o }));
    }
    if (value != null) el.value = Array.isArray(value) ? [...value] : String(value);
  }
};

/** The answer a control holds now, in the shape answers are stored. */
export const readControl = (el: Control): unknown => {
  const input = el.dataset.input as Input;
  const v = el.value;
  if (input === 'location') return typeof v === 'string' ? parsePair(v) ?? undefined : undefined;
  if (input === 'number' || input === 'money' || input === 'year') return v === '' || v == null ? undefined : Number(v);
  return v;
};

/**
 * The map above a location field. A click pins the point and writes it into
 * the field, which fires the field's own `change`; typing coordinates moves
 * the pin. Inert on the builder's canvas: the map shows and takes no input.
 */
export const mountLocation = async (field: Control, value: [number, number] | undefined, live: boolean): Promise<void> => {
  const canvas = field.parentElement?.querySelector<HTMLElement>('[data-location-map]');
  if (!canvas || canvas.dataset.mounted) return;
  canvas.dataset.mounted = '';
  const L = await loadLeaflet();
  // Northern California, where the invented workspace works.
  const map = createMap(L, canvas, { center: value ?? [39.6, -121.4], zoom: value ? 10 : 6, zoomControl: live, dragging: live, doubleClickZoom: live, keyboard: false });
  let marker = value ? L.circleMarker(value, { radius: 8, weight: 2 }).addTo(map) : null;
  const pin = (p: [number, number]) => {
    if (marker) marker.setLatLng(p);
    else marker = L.circleMarker(p, { radius: 8, weight: 2 }).addTo(map);
  };
  if (!live) return;
  map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
    const p: [number, number] = [Number(e.latlng.lat.toFixed(4)), Number(e.latlng.lng.toFixed(4))];
    pin(p);
    field.value = p.join(', ');
    field.dispatchEvent(new CustomEvent('change', { detail: { value: field.value }, bubbles: true, composed: true }));
  });
  field.addEventListener('change', () => {
    const p = parsePair(String(field.value ?? ''));
    if (p && Math.abs(p[0]) <= 90 && Math.abs(p[1]) <= 180) {
      pin(p);
      map.panTo(p);
    }
  });
};
