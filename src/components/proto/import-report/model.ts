// PROTOTYPE, TO BE DELETED. The shared ground for the Import a report check-step
// exploration at /proto/import-report: one reading of one invented funder
// report, resolved against one project's record, and one piece of state that
// every variant binds to. Nothing in the product imports from this folder.
//
// The variants differ in what the person LOOKS AT to check the reading. They do
// not differ in what was read, what needs a decision, or what ticking a row
// does, so all of that lives here and a variant is markup plus bind().
//
// Nothing is saved: Add shows a toast and stops.

import type { ImportDocument, ImportReading } from '../../../data/firma2-report-import';
import type { ProjectDetail } from '../../../data/firma2-project-detail';
import { periodName } from '../../../data/firma2-performance-measures';

export type ProtoGroup = 'Key facts' | 'Performance measures' | 'Funding sources' | 'Contacts';
export const PROTO_GROUPS: ProtoGroup[] = ['Key facts', 'Performance measures', 'Funding sources', 'Contacts'];

/** `ready` arrives ticked. `needs` arrives unticked and says why. `on-file` is already on the record. */
export type ProtoStatus = 'ready' | 'needs' | 'on-file';

export interface ProtoItem {
  id: string;
  group: ProtoGroup;
  kind: 'field' | 'measure' | 'funding' | 'contact';
  /** "Timeline", "Acres of invasive vegetation removed · 2025", "Funding source", "Contact · Monitoring contact". */
  label: string;
  /** The short name without the period or role: "Timeline", "Acres of invasive vegetation removed". */
  name: string;
  status: ProtoStatus;
  /** The badge a `needs` row wears: why it is waiting. */
  badge?: 'Needs a decision' | 'No match' | 'Unsure' | 'Not in this workspace';
  /** One plain sentence on what the person has to decide. Only on `needs`. */
  reason?: string;
  /** A softer flag on a ready row. */
  check?: boolean;
  /** Where in the document it came from, verbatim. */
  quote: string;
  /** The passage id in `ProtoData.document`. */
  passage?: string;
  page?: number;
  /** Arithmetic done to the figure, shown rather than hidden. */
  conversion?: string;
  note?: string;
  /** The record's value today, as it reads. Absent when the change adds something. */
  was?: string;
  /** The proposed value as it reads. Empty when the reading wrote nothing in. */
  value: string;

  // --- measure rows
  unit?: string;
  /** The figure written in, or null when the reading left it empty. */
  amount?: number | null;
  year?: number;
  period?: string;
  answers?: Record<string, string>;
  /** Offered beside an empty row; taking it is the person's act. */
  suggestion?: { amount: number; basis: string };
  /** What the record holds for this measure today, and its target. */
  reported?: number;
  expected?: number;

  // --- funding rows
  funding?: { name: string; organization: string; amount: number };
  /** The funder is not an organization the workspace holds. */
  organizationMissing?: boolean;

  // --- contact rows
  contact?: { name: string; role: string; organization: string; email: string };
}

export interface ProtoData {
  projectName: string;
  documentName: string;
  document: ImportDocument;
  items: ProtoItem[];
  notUsed: string[];
  skipped: string[];
  organizations: string[];
  /** The record as it stands, for the variant that shows changes in place. */
  record: {
    facts: { key: string; label: string; value: string }[];
    measures: { name: string; unit: string; reported: number; expected: number }[];
    funding: { name: string; organization: string; amount: number }[];
    contacts: { name: string; role: string; organization: string; email: string }[];
  };
}

const figure = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const same = (a: string, b: string): boolean => a.trim().toLowerCase() === b.trim().toLowerCase();

export const formatFigure = (n: number): string => figure.format(n);
export const formatUsd = (n: number): string => usd.format(n);

/** Build time: resolve the reading against the record. Pure. */
export const buildProtoData = (
  detail: ProjectDetail,
  reading: ImportReading,
  documentName: string,
  organizations: string[],
): ProtoData => {
  const { project } = detail;
  const raw: Record<string, string> = {
    timeline: `${project.implementationStartYear},${project.completionYear}`,
    county: project.county,
  };
  const reads = (value: string): string => value.split(',').join('–');

  const items = reading.proposals.map((p): ProtoItem => {
    const base = { id: p.id, quote: p.quote, passage: p.passage, page: p.page, note: p.note };

    if (p.field) {
      const onFile = raw[p.field.key] === p.field.raw;
      return {
        ...base,
        group: 'Key facts',
        kind: 'field',
        label: p.field.label,
        name: p.field.label,
        status: onFile ? 'on-file' : 'ready',
        was: reads(raw[p.field.key] ?? ''),
        value: p.field.display,
      };
    }

    if (p.funding) {
      const f = p.funding;
      const onFile = detail.funding.some((h) => same(h.name, f.name) && same(h.organization, f.organization));
      const missing = !organizations.some((o) => same(o, f.organization));
      return {
        ...base,
        group: 'Funding sources',
        kind: 'funding',
        label: 'Funding source',
        name: f.name,
        status: onFile ? 'on-file' : missing ? 'needs' : 'ready',
        badge: !onFile && missing ? 'Not in this workspace' : undefined,
        reason: !onFile && missing ? `“${f.organization}” isn’t an organization here. Pick one, or leave this out.` : undefined,
        value: `${f.name}, ${f.organization}, ${usd.format(f.amount)}`,
        funding: f,
        organizationMissing: missing,
      };
    }

    if (p.contact) {
      const c = p.contact;
      const onFile = detail.contacts.some((h) => same(h.email, c.email));
      return {
        ...base,
        group: 'Contacts',
        kind: 'contact',
        label: `Contact · ${c.role}`,
        name: c.name,
        status: onFile ? 'on-file' : 'ready',
        value: `${c.name}, ${c.organization}, ${c.email}`,
        contact: c,
      };
    }

    const measure = detail.measures.find((m) => same(m.name, p.measure));
    const unit = measure?.unit ?? '';
    const held = measure?.reported ?? 0;
    let amount: number | null = p.amount;
    let conversion = p.conversion;
    let status: ProtoStatus = 'ready';
    let badge: ProtoItem['badge'];
    let reason: string | undefined;

    if (p.unsure) {
      amount = null;
      status = 'needs';
      badge = 'Unsure';
      reason = p.unsure;
    } else if (p.noMatch) {
      amount = null;
      status = 'needs';
      badge = 'No match';
      reason = p.note;
    } else if (p.cumulative !== undefined) {
      const rest = Math.round((p.cumulative - held) * 100) / 100;
      amount = rest > 0 ? rest : null;
      conversion = `${figure.format(p.cumulative)} to date − ${figure.format(held)} on record = ${figure.format(Math.max(rest, 0))}`;
      if (rest <= 0) status = 'on-file';
    } else if (p.decide) {
      status = 'needs';
      badge = 'Needs a decision';
      reason = p.note;
    }

    return {
      ...base,
      // The reason already says it; a needs row does not repeat the note.
      note: status === 'needs' ? undefined : p.note,
      group: 'Performance measures',
      kind: 'measure',
      label: `${p.measure} · ${periodName(p.year)}`,
      name: p.measure,
      status,
      badge,
      reason,
      check: status === 'ready' && p.confidence !== 'High',
      conversion,
      value: amount === null ? '' : `${figure.format(amount)} ${unit}`.trim(),
      unit,
      amount,
      year: p.year,
      period: periodName(p.year),
      answers: p.answers,
      suggestion: p.noMatch?.suggestion,
      reported: held,
      expected: measure?.expected,
    };
  });

  return {
    projectName: project.projectName,
    documentName,
    document: reading.document ?? { pages: [] },
    items,
    notUsed: reading.notAsked,
    skipped: reading.skipped,
    organizations,
    record: {
      facts: [
        { key: 'timeline', label: 'Timeline', value: reads(raw.timeline) },
        { key: 'county', label: 'County', value: raw.county },
      ],
      measures: detail.measures.map(({ name, unit, reported, expected }) => ({ name, unit, reported, expected })),
      funding: detail.funding.map(({ name, organization, amount }) => ({ name, organization, amount })),
      contacts: detail.contacts,
    },
  };
};

/** The passage an item was read from, with the page it sits on. */
export const passageOf = (data: ProtoData, item: ProtoItem) => {
  for (const page of data.document.pages) {
    const passage = page.passages.find((p) => p.id === item.passage);
    if (passage) return { page: page.label, passage };
  }
  return undefined;
};

// ---------------------------------------------------------------------------
// Browser: one state, shared by whichever variant is on screen
// ---------------------------------------------------------------------------

export const PROTO_CHANGE = 'proto:import-report-change';

interface State {
  picked: Record<string, boolean>;
  amount: Record<string, string>;
  organization: Record<string, string>;
}

export interface ProtoModel {
  data: ProtoData;
  item(id: string): ProtoItem | undefined;
  picked(id: string): boolean;
  /** The figure in the row now, as typed. */
  amount(id: string): string;
  organization(id: string): string;
  /** A `needs` row the person has dealt with: a figure typed, an organization picked, or ticked as read. */
  resolved(id: string): boolean;
  setPicked(id: string, on: boolean): void;
  setAmount(id: string, value: string): void;
  setOrganization(id: string, value: string): void;
  /** How many changes Add would add. */
  count(): number;
  /** How many `needs` rows are still waiting. */
  waiting(): number;
  /** The item's value as it reads now, after any edit. */
  valueNow(id: string): string;
  reset(): void;
}

let model: ProtoModel | null = null;

const initial = (data: ProtoData): State => ({
  picked: Object.fromEntries(data.items.map((i) => [i.id, i.status === 'ready'])),
  amount: Object.fromEntries(data.items.map((i) => [i.id, i.amount == null ? '' : String(i.amount)])),
  organization: Object.fromEntries(
    data.items.map((i) => [i.id, i.funding && !i.organizationMissing ? (data.organizations.find((o) => same(o, i.funding!.organization)) ?? '') : '']),
  ),
});

/** The page's one model, read from the JSON the page renders. */
export const getModel = (): ProtoModel => {
  // One model per PAGE, not per script bundle: each component's script may
  // carry its own copy of this module, and they must share one state.
  const shared = window as unknown as { __protoImportModel?: ProtoModel };
  if (shared.__protoImportModel) return shared.__protoImportModel;
  if (model) return model;
  const data = JSON.parse(document.getElementById('proto-import-data')?.textContent ?? '{}') as ProtoData;
  let state = initial(data);
  const emit = () => document.dispatchEvent(new Event(PROTO_CHANGE));
  const item = (id: string) => data.items.find((i) => i.id === id);
  const number = (id: string): number => Number((state.amount[id] ?? '').replace(/[$,\s]/g, ''));
  const addable = (id: string): boolean => {
    const it = item(id);
    if (!it || it.status === 'on-file') return false;
    if (it.kind === 'measure') return Number.isFinite(number(id)) && number(id) > 0;
    if (it.kind === 'funding') return Boolean(state.organization[id]);
    return true;
  };

  model = {
    data,
    item,
    picked: (id) => Boolean(state.picked[id]) && addable(id),
    amount: (id) => state.amount[id] ?? '',
    organization: (id) => state.organization[id] ?? '',
    resolved: (id) => item(id)?.status === 'needs' && Boolean(state.picked[id]) && addable(id),
    setPicked: (id, on) => {
      state.picked[id] = on && addable(id);
      emit();
    },
    setAmount: (id, value) => {
      const wasEmpty = !addable(id);
      state.amount[id] = value;
      // A figure typed into a row that arrived empty is the person filling it in.
      if (wasEmpty && addable(id)) state.picked[id] = true;
      if (!addable(id)) state.picked[id] = false;
      emit();
    },
    setOrganization: (id, value) => {
      state.organization[id] = value;
      state.picked[id] = Boolean(value);
      emit();
    },
    count: () => data.items.filter((i) => model!.picked(i.id)).length,
    waiting: () => data.items.filter((i) => i.status === 'needs' && !model!.picked(i.id)).length,
    valueNow: (id) => {
      const it = item(id);
      if (!it) return '';
      if (it.kind === 'measure') return addable(id) ? `${figure.format(number(id))} ${it.unit ?? ''}`.trim() : '';
      if (it.kind === 'funding' && it.funding)
        return `${it.funding.name}, ${state.organization[id] || it.funding.organization}, ${usd.format(it.funding.amount)}`;
      return it.value;
    },
    reset: () => {
      state = initial(data);
      emit();
    },
  };
  shared.__protoImportModel = model;
  return model;
};

type Control = HTMLElement & { value?: unknown; options?: unknown; checked?: boolean };

/**
 * Wire a variant's markup to the model. Inside `root`, by item id:
 *
 *   [data-item="<id>"]            gets data-picked / data-waiting kept in step
 *   esa-checkbox[data-pick]       ticks the row
 *   esa-text-field[data-amount]   the figure
 *   esa-select[data-organization] the funder's organization (options are set here)
 *   [data-use-suggestion]         writes the suggested figure in
 *   [data-value]                  textContent = the value as it reads now
 *
 * and anywhere in `root`: [data-count] and [data-waiting-count] get the numbers.
 * A control names its item with the attribute's value, or by sitting inside
 * a [data-item].
 */
export const bind = (root: HTMLElement): void => {
  const m = getModel();
  // Astro renders a bare attribute as ="true", so that is "no id given" too.
  const idOf = (el: Element, attr: string): string => {
    const named = el.getAttribute(attr);
    return named && named !== 'true' ? named : (el.closest<HTMLElement>('[data-item]')?.dataset.item ?? '');
  };

  const paint = () => {
    root.querySelectorAll<HTMLElement>('[data-item]').forEach((el) => {
      const id = el.dataset.item!;
      el.toggleAttribute('data-picked', m.picked(id));
      el.toggleAttribute('data-waiting', m.item(id)?.status === 'needs' && !m.picked(id));
    });
    root.querySelectorAll<Control>('esa-checkbox[data-pick]').forEach((el) => {
      const on = m.picked(idOf(el, 'data-pick'));
      if (el.checked !== on) el.checked = on;
    });
    root.querySelectorAll<Control>('esa-text-field[data-amount]').forEach((el) => {
      const next = m.amount(idOf(el, 'data-amount'));
      if (String(el.value ?? '') !== next) el.value = next;
    });
    root.querySelectorAll<Control>('esa-select[data-organization]').forEach((el) => {
      const next = m.organization(idOf(el, 'data-organization'));
      if (String(el.value ?? '') !== next) el.value = next;
    });
    root.querySelectorAll<HTMLElement>('[data-value]').forEach((el) => {
      el.textContent = m.valueNow(idOf(el, 'data-value'));
    });
    root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => (el.textContent = String(m.count())));
    root.querySelectorAll<HTMLElement>('[data-waiting-count]').forEach((el) => (el.textContent = String(m.waiting())));
  };

  Promise.all(['esa-checkbox', 'esa-text-field', 'esa-select'].map((tag) => customElements.whenDefined(tag))).then(() => {
    root.querySelectorAll<Control>('esa-select[data-organization]').forEach((el) => {
      el.options = m.data.organizations.map((o) => ({ label: o, value: o }));
    });
    paint();
  });

  root.addEventListener('change', (event) => {
    const el = event.target as Control;
    if (el.matches?.('esa-checkbox[data-pick]')) m.setPicked(idOf(el, 'data-pick'), Boolean(el.checked));
    else if (el.matches?.('esa-text-field[data-amount]')) m.setAmount(idOf(el, 'data-amount'), String(el.value ?? ''));
    else if (el.matches?.('esa-select[data-organization]')) m.setOrganization(idOf(el, 'data-organization'), String(el.value ?? ''));
  });
  root.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLElement>('[data-use-suggestion]');
    if (!button) return;
    const id = idOf(button, 'data-use-suggestion');
    const suggestion = m.item(id)?.suggestion;
    if (suggestion) m.setAmount(id, String(suggestion.amount));
  });
  document.addEventListener(PROTO_CHANGE, paint);
};
