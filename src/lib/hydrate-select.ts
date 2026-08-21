// Client-side esa-select hydration, shared by the measure setup sections.
//
// WHY THIS EXISTS AS A MODULE. `options` is a PROPERTY on esa-select, not an
// attribute — an array cannot survive the trip through markup — so every
// section that renders a select must assign it from a script after
// `customElements.whenDefined('esa-select')`. The definition band and the
// record section each own selects; two hand-rolled copies of this assignment
// is exactly the kind of duplication that drifts, so the one copy lives here.
//
// The caller still owns the whenDefined gate: assign before the element
// upgrades and the value lands on a plain HTMLElement, where Lit's setter
// never sees it and the control renders empty.

export interface EsaOption {
  label: string;
  value: string;
}

/**
 * Assign a select's option list, then its value — in that order, because
 * esa-select resolves its trigger label by looking the value up in the option
 * list. `value` is a bare accessor with no declarative attribute behind it
 * (a known hub gap, called out in the hub's own form-section pattern), so a
 * preselected value has no way to reach the element except this assignment;
 * it defaults to the server-written `data-initial`.
 */
export const hydrateSelect = (id: string, options: EsaOption[], initialValue?: string): void => {
  const el = document.getElementById(id) as (HTMLElement & { options: unknown; value: unknown }) | null;
  if (!el) return;
  el.options = options;
  const initial = initialValue ?? el.dataset.initial;
  if (initial) el.value = initial;
};

/** Options for a vocabulary whose display strings ARE its stored values. */
export const identityOptions = (values: readonly string[]): EsaOption[] =>
  values.map((v) => ({ label: v, value: v }));
