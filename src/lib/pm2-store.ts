// pm2-store — PM 2's server, in the browser. Every rule and every message here
// is the branch's (projectfirma2 `features/0010_project_performance_measures`):
// PerformanceMeasures.cs, PerformanceMeasureEntries.cs,
// ProjectPerformanceMeasureTargets.cs and ProjectPerformanceMeasureReports.cs.
// Where the prototype has to stand in for something the branch does with a
// live service (the Claude draft), it says so at the function.
//
// ONE localStorage key holds the whole store, seeded from firma2-pm2.ts on
// first read and never mixed with the original prototype's `firma2:measure-*`
// / `firma2:entries:*` keys. resetPm2() puts the seed back.

import {
  PM2_PERIODS,
  PM2_SEED_CHANGES,
  PM2_SEED_ENTRIES,
  PM2_SEED_MEASURES,
  PM2_SEED_TARGETS,
  PM2_TODAY,
  UNSPECIFIED,
  pm2IsSummable,
  pm2Rule,
  pm2Theme,
  pm2Unit,
} from '../data/firma2-pm2';
import type { Pm2Category, Pm2Change, Pm2Entry, Pm2Measure, Pm2ReportingPeriod, Pm2Target } from '../data/firma2-pm2';

const KEY = 'firma2:pm2:v1';
export const PM2_CHANGE_EVENT = 'firma2:pm2-change';
const CHANGED_BY = 'You';

interface Store {
  measures: Pm2Measure[];
  entries: Pm2Entry[];
  targets: Pm2Target[];
  changes: Pm2Change[];
  nextId: number;
}

export type Result<T = void> = { ok: true; value: T } | { ok: false; errors: string[] };
const ok = <T>(value: T): Result<T> => ({ ok: true, value });
const fail = (...errors: string[]): Result<never> => ({ ok: false, errors });

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

function seed(): Store {
  return {
    measures: clone(PM2_SEED_MEASURES),
    entries: clone(PM2_SEED_ENTRIES),
    targets: clone(PM2_SEED_TARGETS),
    changes: clone(PM2_SEED_CHANGES),
    nextId: 1000,
  };
}

let cache: Store | null = null;

function store(): Store {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Store) : seed();
  } catch {
    cache = seed();
  }
  return cache;
}

function commit(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store()));
  } catch {
    /* private window: the edit lives until the page closes */
  }
  document.dispatchEvent(new CustomEvent(PM2_CHANGE_EVENT));
}

const nextId = () => store().nextId++;

export function resetPm2(): void {
  cache = seed();
  commit();
}

// ── Formatting ──────────────────────────────────────────────────────────────

/** The change log's invariant `0.####`, no unit. */
const invariant = (n: number) => String(Math.round(n * 10000) / 10000);

const amountFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 });
export const formatAmount = (n: number, abbreviation?: string | null) =>
  abbreviation ? `${amountFmt.format(n)} ${abbreviation}` : amountFmt.format(n);

// ── Reads ───────────────────────────────────────────────────────────────────

export const listMeasures = () => [...store().measures].sort((a, b) => a.name.localeCompare(b.name));
export const getMeasure = (id: number) => store().measures.find((m) => m.id === id) ?? null;
export const listPeriods = () => [...PM2_PERIODS].sort((a, b) => b.startDate.localeCompare(a.startDate));
export const listChanges = (projectSlug: string) =>
  store().changes
    .filter((c) => c.projectSlug === projectSlug)
    .sort((a, b) => b.changedDate.localeCompare(a.changedDate) || b.id - a.id);

export interface Pm2CatalogRow {
  id: number;
  name: string;
  theme: string;
  unit: string;
  sums: string;
  status: string;
  categories: number;
  entries: number;
}

/** PerformanceMeasureDto, as the list page's grid reads it. */
export function catalogRows(): Pm2CatalogRow[] {
  const s = store();
  return listMeasures().map((m) => ({
    id: m.id,
    name: m.name.trim() || 'Untitled measure',
    theme: pm2Theme(m.themeId)?.displayName ?? '—',
    unit: pm2Unit(m.unitId)?.displayName ?? '—',
    sums: m.countingRuleId == null ? '—' : m.countingRuleId === 1 ? 'Yes' : 'No',
    status: ['Draft', 'Published', 'Retired'][m.statusId - 1],
    categories: m.categories.length,
    entries: s.entries.filter((e) => e.measureId === m.id).length,
  }));
}

export function measureHistory(id: number): { entryCount: number; projectCount: number } {
  const rows = store().entries.filter((e) => e.measureId === id);
  return { entryCount: rows.length, projectCount: new Set(rows.map((e) => e.projectSlug)).size };
}

// ── Measures (PerformanceMeasures.cs) ───────────────────────────────────────

export interface Pm2MeasureUpsert {
  name: string;
  definition: string;
  reporterGuidance: string;
  claimText: string;
  themeId: number | null;
  unitId: number | null;
  countingRuleId: 1 | 2 | null;
  categories: { id?: number; name: string; options: { id?: number; name: string }[] }[];
}

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

function validateMeasure(dto: Pm2MeasureUpsert, selfId: number | null): string[] {
  const errors: string[] = [];
  const name = dto.name.trim();
  if (!name) errors.push('A measure needs a name.');
  else if (name.length > 200) errors.push('A measure name cannot be longer than 200 characters.');
  else if (store().measures.some((m) => m.id !== selfId && same(m.name, name)))
    errors.push('This catalog already has a measure with that name.');
  if (dto.themeId != null && !pm2Theme(dto.themeId)) errors.push('That is not a theme we know about.');
  if (dto.unitId != null && !pm2Unit(dto.unitId)) errors.push('That is not a unit we know about.');
  if (dto.countingRuleId != null && !pm2Rule(dto.countingRuleId)) errors.push('That is not a counting rule we know about.');

  const seen: string[] = [];
  for (const c of dto.categories) {
    const cname = c.name.trim();
    if (!cname) {
      errors.push('A category needs a name.');
      continue;
    }
    if (cname.length > 200) errors.push('Category names cannot be longer than 200 characters.');
    if (seen.some((s) => same(s, cname))) errors.push(`This measure asks "${cname}" more than once.`);
    seen.push(cname);
    const named = c.options.map((o) => o.name.trim()).filter(Boolean);
    if (named.length === 0) errors.push(`"${cname}" has no options, so nobody could answer it.`);
    const optSeen: string[] = [];
    for (const o of named) {
      if (o.length > 200) errors.push('Option names cannot be longer than 200 characters.');
      if (optSeen.some((s) => same(s, o))) errors.push(`"${cname}" lists "${o}" more than once.`);
      optSeen.push(o);
    }
  }
  return errors;
}

/** "Unspecified" is ADDED, never demanded — on create and on a draft's update. */
function buildCategories(dto: Pm2MeasureUpsert): Pm2Category[] {
  return dto.categories.map((c, ci) => {
    const names = c.options.map((o) => o.name.trim()).filter(Boolean);
    if (!names.some((n) => same(n, UNSPECIFIED))) names.push(UNSPECIFIED);
    return {
      id: c.id ?? nextId(),
      name: c.name.trim(),
      sortOrder: ci,
      options: names.map((n, oi) => ({ id: c.options.find((o) => same(o.name, n))?.id ?? nextId(), name: n, sortOrder: oi })),
    };
  });
}

/** Structure compared by name, case-insensitively — what a published measure freezes. */
function structureKey(cats: { name: string; options: { name: string }[] }[]): string {
  return JSON.stringify(
    cats.map((c) => [c.name.trim().toLowerCase(), c.options.map((o) => o.name.trim().toLowerCase()).filter(Boolean).sort()]),
  );
}

export function createMeasure(dto: Pm2MeasureUpsert): Result<Pm2Measure> {
  const errors = validateMeasure(dto, null);
  if (errors.length) return fail(...errors);
  const m: Pm2Measure = {
    id: nextId(),
    name: dto.name.trim(),
    definition: dto.definition,
    reporterGuidance: dto.reporterGuidance,
    claimText: dto.claimText,
    themeId: dto.themeId,
    unitId: dto.unitId,
    countingRuleId: dto.countingRuleId,
    statusId: 1,
    categories: buildCategories(dto),
  };
  store().measures.push(m);
  commit();
  return ok(m);
}

export const FROZEN_MESSAGE =
  'This measure has been published, so its categories and options can no longer be changed. Reporters have already answered these questions, and changing them would alter what their past answers meant. Names, the definition and the reporter guidance can still be edited.';

export function updateMeasure(id: number, dto: Pm2MeasureUpsert): Result<Pm2Measure> {
  const m = getMeasure(id);
  if (!m) return fail('That measure does not exist.');
  const errors = validateMeasure(dto, id);
  if (m.statusId !== 1) {
    // Compared WITHOUT the auto-added Unspecified, as the reporter sees it.
    const incoming = dto.categories.map((c) => ({
      name: c.name,
      options: c.options.some((o) => same(o.name, UNSPECIFIED)) ? c.options : [...c.options, { name: UNSPECIFIED }],
    }));
    if (structureKey(incoming) !== structureKey(m.categories)) errors.push(FROZEN_MESSAGE);
  }
  if (errors.length) return fail(...errors);
  Object.assign(m, {
    name: dto.name.trim(),
    definition: dto.definition,
    reporterGuidance: dto.reporterGuidance,
    claimText: dto.claimText,
    themeId: dto.themeId,
    unitId: dto.unitId,
    countingRuleId: dto.countingRuleId,
  });
  if (m.statusId === 1) m.categories = buildCategories(dto);
  commit();
  return ok(m);
}

/** What the lifecycle bar lists after "Before publishing, this still needs …". */
export function missingForPublish(m: Pick<Pm2Measure, 'name' | 'definition' | 'unitId' | 'countingRuleId' | 'themeId'>): string[] {
  const missing: string[] = [];
  if (!m.name.trim()) missing.push('a name');
  if (!m.definition.trim()) missing.push('a definition saying what counts');
  if (m.unitId == null) missing.push('a unit');
  if (m.countingRuleId == null) missing.push('whether the values add up');
  if (m.themeId == null) missing.push('a theme');
  return missing;
}

export function publishMeasure(id: number): Result<Pm2Measure> {
  const m = getMeasure(id);
  if (!m) return fail('That measure does not exist.');
  if (m.statusId !== 1) return fail('This measure is already published.');
  const errors: string[] = [];
  if (!m.definition.trim())
    errors.push('A published measure needs a definition saying what counts toward it and what does not. It is what makes two reporters answer the same question the same way.');
  if (m.unitId == null) errors.push('A published measure needs a unit.');
  if (m.countingRuleId == null)
    errors.push('A published measure needs to say whether its values add up. Totals and cumulative figures depend on it, and offering them for a measure that does not sum would be reporting a lie.');
  if (m.themeId == null) errors.push('A published measure needs a theme.');
  if (errors.length) return fail(...errors);
  m.statusId = 2;
  commit();
  return ok(m);
}

export function retireMeasure(id: number): Result<Pm2Measure> {
  const m = getMeasure(id);
  if (!m) return fail('That measure does not exist.');
  m.statusId = 3;
  commit();
  return ok(m);
}

export function deleteMeasure(id: number): Result {
  const m = getMeasure(id);
  if (!m) return fail('That measure does not exist.');
  if (m.statusId !== 1)
    return fail('Only a draft can be deleted. A measure that has been published is retired instead, which stops it being asked while keeping everything reported against it.');
  if (store().entries.some((e) => e.measureId === id))
    return fail('This measure has entries reported against it, so it is retired rather than deleted.');
  store().measures = store().measures.filter((x) => x.id !== id);
  commit();
  return ok(undefined);
}

// ── Entries (PerformanceMeasureEntries.cs) ──────────────────────────────────

export interface Pm2EntryUpsert {
  measureId: number;
  periodId: number;
  value: number;
  optionIds: number[];
}

const sameSet = (a: number[], b: number[]) => a.length === b.length && [...a].sort().join() === [...b].sort().join();

function log(c: Omit<Pm2Change, 'id' | 'changedBy' | 'changedDate'>): void {
  store().changes.push({ ...c, id: nextId(), changedBy: CHANGED_BY, changedDate: new Date().toISOString() });
}

function validateEntry(projectSlug: string, dto: Pm2EntryUpsert, selfId: number | null): string[] {
  const m = getMeasure(dto.measureId);
  if (!m) return ['That measure does not exist.'];
  if (m.statusId === 1) return ['This measure is still a draft, so nothing can be reported against it yet. Publish it first.'];
  if (m.statusId === 3) return ['This measure has been retired, so it is no longer collecting entries.'];
  const errors: string[] = [];
  if (!PM2_PERIODS.some((p) => p.id === dto.periodId)) errors.push('That reporting period does not exist.');
  if (!(dto.value >= 0)) errors.push('A reported value cannot be negative.');
  const answered = new Set<number>();
  for (const oid of dto.optionIds) {
    const cat = m.categories.find((c) => c.options.some((o) => o.id === oid));
    if (!cat) {
      const anywhere = store().measures.some((x) => x.categories.some((c) => c.options.some((o) => o.id === oid)));
      errors.push(anywhere ? 'An option was chosen that belongs to a different measure.' : 'One of the options chosen no longer exists. Reload the form and try again.');
      continue;
    }
    if (answered.has(cat.id)) errors.push(`"${cat.name}" was answered more than once. One answer per question.`);
    answered.add(cat.id);
  }
  const dup = store().entries.some(
    (e) => e.id !== selfId && e.projectSlug === projectSlug && e.measureId === dto.measureId && e.periodId === dto.periodId && sameSet(e.optionIds, dto.optionIds),
  );
  if (dup)
    errors.push(
      dto.optionIds.length
        ? 'This project has already reported that combination for this measure and period. Edit the existing row rather than adding a second one — two identical rows would count twice in every total.'
        : 'This project has already reported an untagged value for this measure and period. Edit the existing row rather than adding a second one.',
    );
  return errors;
}

export function createEntry(projectSlug: string, dto: Pm2EntryUpsert): Result<Pm2Entry> {
  const errors = validateEntry(projectSlug, dto, null);
  if (errors.length) return fail(...errors);
  const entry: Pm2Entry = { id: nextId(), projectSlug, ...dto };
  store().entries.push(entry);
  log({ projectSlug, measureId: dto.measureId, periodId: dto.periodId, field: 'EntryValue', oldValue: null, newValue: invariant(dto.value) });
  commit();
  return ok(entry);
}

/** Delete-plus-insert, as the branch does it: the entry's id changes. */
export function updateEntry(projectSlug: string, entryId: number, dto: Pm2EntryUpsert): Result<Pm2Entry> {
  const old = store().entries.find((e) => e.id === entryId && e.projectSlug === projectSlug);
  if (!old) return fail('That entry does not exist.');
  if (old.value === dto.value && old.periodId === dto.periodId && sameSet(old.optionIds, dto.optionIds)) return ok(old);
  const errors = validateEntry(projectSlug, dto, entryId);
  if (errors.length) return fail(...errors);
  store().entries = store().entries.filter((e) => e.id !== entryId);
  const entry: Pm2Entry = { id: nextId(), projectSlug, ...dto };
  store().entries.push(entry);
  if (old.periodId === dto.periodId) {
    log({ projectSlug, measureId: dto.measureId, periodId: dto.periodId, field: 'EntryValue', oldValue: invariant(old.value), newValue: invariant(dto.value) });
  } else {
    log({ projectSlug, measureId: old.measureId, periodId: old.periodId, field: 'EntryValue', oldValue: invariant(old.value), newValue: null });
    log({ projectSlug, measureId: dto.measureId, periodId: dto.periodId, field: 'EntryValue', oldValue: null, newValue: invariant(dto.value) });
  }
  commit();
  return ok(entry);
}

export function deleteEntry(projectSlug: string, entryId: number): Result {
  const old = store().entries.find((e) => e.id === entryId && e.projectSlug === projectSlug);
  if (!old) return ok(undefined);
  store().entries = store().entries.filter((e) => e.id !== entryId);
  log({ projectSlug, measureId: old.measureId, periodId: old.periodId, field: 'EntryValue', oldValue: invariant(old.value), newValue: null });
  commit();
  return ok(undefined);
}

// ── Targets (ProjectPerformanceMeasureTargets.cs) ───────────────────────────

export function setTarget(projectSlug: string, measureId: number, value: number): Result {
  const m = getMeasure(measureId);
  if (!m) return fail("That measure is not in this tenant's catalog.");
  if (m.statusId !== 2) return fail(`Only a published measure can carry a target. ${m.name} is not being asked of any project yet.`);
  if (!pm2IsSummable(m)) return fail(`A target is only meaningful for a measure whose values add up; ${m.name} does not sum.`);
  if (!(value > 0)) return fail('A target must be greater than zero.');
  const existing = store().targets.find((t) => t.projectSlug === projectSlug && t.measureId === measureId);
  if (!existing) {
    store().targets.push({ projectSlug, measureId, value });
    log({ projectSlug, measureId, periodId: null, field: 'TargetValue', oldValue: null, newValue: invariant(value) });
  } else if (existing.value !== value) {
    log({ projectSlug, measureId, periodId: null, field: 'TargetValue', oldValue: invariant(existing.value), newValue: invariant(value) });
    existing.value = value;
  }
  commit();
  return ok(undefined);
}

/** Never refused; a missing target is a silent no-op. Entries are untouched. */
export function removeTarget(projectSlug: string, measureId: number): void {
  const existing = store().targets.find((t) => t.projectSlug === projectSlug && t.measureId === measureId);
  if (!existing) return;
  log({ projectSlug, measureId, periodId: null, field: 'TargetValue', oldValue: invariant(existing.value), newValue: null });
  store().targets = store().targets.filter((t) => t !== existing);
  commit();
}

// ── Project report (ProjectPerformanceMeasureReports.GetReportAsync) ────────

export interface Pm2PeriodTotal { periodId: number; periodName: string; total: number | null; entryCount: number }
export interface Pm2Breakdown { label: string; periodTotals: Pm2PeriodTotal[]; allPeriodsTotal: number | null }

export interface Pm2ReportMeasure {
  measure: Pm2Measure;
  unitAbbreviation: string;
  unitDisplayName: string;
  isSummable: boolean;
  entries: Pm2Entry[];
  previousPeriodEntries: Pm2Entry[];
  isReported: boolean;
  periodTotals: Pm2PeriodTotal[];
  allPeriodsTotal: number | null;
  breakdowns: Pm2Breakdown[];
  targetValue: number | null;
  targetPercentComplete: number | null;
}

export interface Pm2Report {
  period: Pm2ReportingPeriod;
  periods: Pm2ReportingPeriod[];
  measures: Pm2ReportMeasure[];
  reportedCount: number;
}

export function defaultPeriod(): Pm2ReportingPeriod {
  const newestFirst = listPeriods();
  return newestFirst.find((p) => p.startDate <= PM2_TODAY) ?? newestFirst[0];
}

/** The honesty rule: a total only when it means something. */
function periodTotals(rows: Pm2Entry[], summable: boolean): Pm2PeriodTotal[] {
  return [...PM2_PERIODS]
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map((p) => {
      const inP = rows.filter((e) => e.periodId === p.id);
      const sum = inP.reduce((s, e) => s + e.value, 0);
      const total = inP.length === 0 ? null : summable || inP.length === 1 ? sum : null;
      return { periodId: p.id, periodName: p.name, total, entryCount: inP.length };
    });
}

export function optionLabel(m: Pm2Measure, optionIds: number[]): string {
  const names = m.categories
    .map((c) => c.options.find((o) => optionIds.includes(o.id))?.name)
    .filter((n): n is string => !!n);
  return names.length ? names.join(' / ') : 'Not specified';
}

function sortKey(m: Pm2Measure, optionIds: number[]): string {
  return m.categories
    .map((c) => c.options.find((o) => optionIds.includes(o.id)))
    .filter((o) => !!o)
    .map((o) => String(o!.sortOrder).padStart(4, '0'))
    .join('-');
}

export function getReport(projectSlug: string, periodId?: number): Pm2Report {
  const s = store();
  const periods = listPeriods();
  const period = periods.find((p) => p.id === periodId) ?? defaultPeriod();
  const previous = periods.find((p) => p.startDate < period.startDate) ?? null;

  const measures = listMeasures()
    .filter((m) => m.statusId === 2)
    .map<Pm2ReportMeasure>((m) => {
      const summable = pm2IsSummable(m);
      const unit = pm2Unit(m.unitId);
      const rows = s.entries.filter((e) => e.projectSlug === projectSlug && e.measureId === m.id);
      const totals = periodTotals(rows, summable);
      const allPeriodsTotal = summable ? rows.reduce((t, e) => t + e.value, 0) : null;

      const combos = new Map<string, Pm2Entry[]>();
      if (m.categories.length) {
        for (const r of rows) {
          const k = [...r.optionIds].sort().join(',');
          combos.set(k, [...(combos.get(k) ?? []), r]);
        }
      }
      const breakdowns = [...combos.values()]
        .map((group) => ({
          label: optionLabel(m, group[0].optionIds),
          key: sortKey(m, group[0].optionIds),
          unspecified: group[0].optionIds.length === 0,
          periodTotals: periodTotals(group, summable),
          allPeriodsTotal: summable ? group.reduce((t, e) => t + e.value, 0) : null,
        }))
        .sort((a, b) => Number(a.unspecified) - Number(b.unspecified) || a.key.localeCompare(b.key) || a.label.localeCompare(b.label))
        .map(({ label, periodTotals: pt, allPeriodsTotal: at }) => ({ label, periodTotals: pt, allPeriodsTotal: at }));

      const target = summable ? s.targets.find((t) => t.projectSlug === projectSlug && t.measureId === m.id) : undefined;
      const entries = rows.filter((e) => e.periodId === period.id);
      return {
        measure: m,
        unitAbbreviation: unit?.abbreviation ?? '',
        unitDisplayName: unit?.displayName ?? '',
        isSummable: summable,
        entries,
        previousPeriodEntries: previous ? rows.filter((e) => e.periodId === previous.id) : [],
        isReported: entries.length > 0,
        periodTotals: totals,
        allPeriodsTotal,
        breakdowns,
        targetValue: target?.value ?? null,
        targetPercentComplete: target ? ((allPeriodsTotal ?? 0) / target.value) * 100 : null,
      };
    });

  return { period, periods, measures, reportedCount: measures.filter((m) => m.isReported).length };
}

// ── The draft (stands in for POST performance-measures/draft) ───────────────
// The branch sends the claim to Claude with a standard library of fifteen
// themes. Here the same library is matched by keyword, so the flow can be
// walked without a key. Nothing is saved: the draft fills the form only.

export interface Pm2Draft {
  name: string;
  definition: string;
  reporterGuidance: string;
  themeId: number;
  unitId: number;
  countingRuleId: 1 | 2;
  categories: { name: string; options: string[] }[];
  payoff: string;
  warnings: string[];
}

interface LibraryRow { words: RegExp; draft: Omit<Pm2Draft, 'payoff' | 'warnings'> }

const LIBRARY: LibraryRow[] = [
  {
    words: /temperature|degrees|cooler|warmer/i,
    draft: {
      name: 'Late-summer stream temperature',
      definition: 'The seven-day average of daily maximum water temperature at the project reach, during the warmest week of the year.',
      reporterGuidance: 'Report your own logger’s reading. If you did not monitor this year, leave it blank.',
      themeId: 7, unitId: 19, countingRuleId: 2, categories: [],
    },
  },
  {
    words: /riparian|streamside|streambank|planting|plant/i,
    draft: {
      name: 'Riparian habitat treated',
      definition: 'Acres within the streamside corridor where native vegetation was planted, released, or protected from grazing this period.',
      reporterGuidance: 'Report the extent you treated this period, not the area of the whole project.',
      themeId: 1, unitId: 5, countingRuleId: 1,
      categories: [
        { name: 'Treatment type', options: ['Planting', 'Fencing', 'Invasive removal', UNSPECIFIED] },
        { name: 'Habitat type', options: ['In-stream', 'Streambank', 'Upland', UNSPECIFIED] },
      ],
    },
  },
  {
    words: /barrier|culvert|passage|dam/i,
    draft: {
      name: 'Barriers removed',
      definition: 'Fish passage barriers fully removed or made passable this period and signed off by the project engineer.',
      reporterGuidance: 'Count each barrier once, in the period it became passable.',
      themeId: 3, unitId: 9, countingRuleId: 1,
      categories: [{ name: 'Barrier type', options: ['Culvert', 'Dam', 'Diversion', UNSPECIFIED] }],
    },
  },
  {
    words: /fuel|thin|burn|fire/i,
    draft: {
      name: 'Fuels treatment',
      definition: 'Acres where surface or ladder fuels were reduced this period by thinning, mastication or prescribed fire.',
      reporterGuidance: 'Report each acre once per period, under the treatment that did the most work.',
      themeId: 4, unitId: 5, countingRuleId: 1,
      categories: [
        { name: 'Treatment type', options: ['Thinning', 'Mastication', 'Pile burning', 'Broadcast burning', UNSPECIFIED] },
        { name: 'Land ownership', options: ['Federal', 'State', 'Private', 'Tribal', UNSPECIFIED] },
      ],
    },
  },
  {
    words: /volunteer|community|hours/i,
    draft: {
      name: 'Volunteer hours contributed',
      definition: 'Hours of unpaid work given to the project by members of the public this period.',
      reporterGuidance: 'Report hours from your sign-in sheets. Staff time does not count.',
      themeId: 15, unitId: 16, countingRuleId: 1,
      categories: [{ name: 'Activity type', options: ['Planting', 'Monitoring', 'Cleanup', 'Outreach', UNSPECIFIED] }],
    },
  },
  {
    words: /people|reach|outreach|education|event/i,
    draft: {
      name: 'People reached',
      definition: 'People who attended an event or received direct instruction from the project this period.',
      reporterGuidance: 'Count each person once per event.',
      themeId: 13, unitId: 11, countingRuleId: 1,
      categories: [{ name: 'Audience type', options: ['Students', 'Landowners', 'General public', UNSPECIFIED] }],
    },
  },
];

const FALLBACK: LibraryRow['draft'] = {
  name: 'Land protected',
  definition: 'Acres placed under a conservation easement or acquired in fee this period.',
  reporterGuidance: 'Report the recorded acreage, in the period the deed or easement recorded.',
  themeId: 9, unitId: 5, countingRuleId: 1,
  categories: [{ name: 'Protection mechanism', options: ['Easement', 'Fee acquisition', UNSPECIFIED] }],
};

export function draftFromClaim(claim: string): Pm2Draft {
  const row = LIBRARY.find((r) => r.words.test(claim))?.draft ?? FALLBACK;
  const unit = pm2Unit(row.unitId)!.displayName;
  const by = row.categories.map((c) => `by ${c.name.toLowerCase()}`).join(' and ');
  const payoff =
    row.countingRuleId === 1
      ? `Total ${unit} of ${row.name.toLowerCase()}${by ? ` and broken down ${by}` : ''}, by period and cumulative.`
      : `${unit[0].toUpperCase()}${unit.slice(1)} of ${row.name.toLowerCase()} per period. This measure does not sum, so no total is offered.`;
  const warnings: string[] = [];
  if (row.categories.length > 1)
    warnings.push('Two breakdowns double the picks on every entry. Keep both only if your funder asks for both.');
  if (store().measures.some((m) => same(m.name, row.name)))
    warnings.push(`Your catalog already has a measure called “${row.name}”. Rename this one or use that one.`);
  return { ...clone(row), payoff, warnings };
}
