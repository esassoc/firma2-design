// Publish history — when each project's public page was last brought up to
// date, and what has changed on the record since.
//
// THE WORKFLOW (user, 2026-10-09). Editors change their projects freely and
// the record saves as they go; the public page shows only a published
// snapshot. Every so often a steward or administrator sweeps their projects,
// checks what changed, and publishes. QA/QC happens at publish — between
// publishes, editors are trusted. There is no re-certification: a project with
// nothing new since its last publish needs nothing.
//
// THE REVIEW IS A NET DIFF, NOT A HISTORY. A steward asks "what is different
// from what the public sees?", so the log entries after the last publish fold
// into one row per field — published value, current value, who touched it.
// Three edits to the cost read as one line; a county changed and changed back
// reads as nothing at all. The change log keeps every entry: it is the
// evidence behind the review, not the review.
//
// PURE AND DEPENDENCY-FREE. firma2-project-detail calls applyPublishing() while
// it builds each record, so the log the History sheet shows and the diff the
// review page shows come from one list and cannot disagree. Type imports only —
// nothing here imports a module that imports this one at runtime.
//
// DETERMINISTIC. Every date is authored or derived from the record; no clock.

import type { Project, ProjectStage } from './firma2-projects';
import type { AuditEntry, FundingSource, PerformanceMeasure } from './firma2-project-detail';

/** The fixture's present — firma2-directory's TODAY, restated to keep this module import-free. */
export const TODAY_ISO = '2026-09-30';
const DAY_MS = 86_400_000;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "4 January 2025" → "2025-01-04". The log's labels are the only dates it stores. */
export const isoOfLabel = (label: string): string => {
  const [day, month, year] = label.split(' ');
  const m = MONTHS.indexOf(month);
  return m < 0 ? '' : `${year}-${String(m + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/** "2025-01-04" → "4 January 2025". */
export const labelOfIso = (iso: string): string => {
  const [year, month, day] = iso.split('-');
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
};

export const daysBetween = (fromIso: string, toIso: string = TODAY_ISO): number =>
  Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / DAY_MS);

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const costChange = (from: number, to: number) => `Estimated total cost changed from ${usd.format(from)} to ${usd.format(to)}`;

/** The log sentence a publish leaves. Read by the Updates feed as its own kind. */
export const PUBLISHED_CHANGE = 'Published to the public page';

// ---------------------------------------------------------------------------
// Seeds
// ---------------------------------------------------------------------------

type Who = 'lead' | 'grant' | 'field';

interface EditSeed {
  iso: string;
  who: Who;
  change: string;
}

interface PublishSeed {
  /** Last publish, ISO. `null`: never published — the project has no public page yet. */
  published: string | null;
  /** Who published. Defaults to the host board's administrators, by rotation. */
  by?: string;
  /** Entries the log gains — after the publish for the diff, or before it as history. */
  edits?: EditSeed[];
  /** The cost the public page shows. The log's original cost entry is rewritten to end here. */
  costWas?: number;
  /** The stage the public page shows. */
  stageWas?: ProjectStage;
  /** Re-date the log's entry that starts with this text — a filing made later than its year implies. */
  redate?: { startsWith: string; iso: string }[];
}

// The host board's administrators run the sweep in this workspace; a steward
// of the lead organization could publish too, under the Security threshold.
const PUBLISHERS = ['Avery Castillo', 'Jordan Delgado', 'Dana Whitfield'];

// Invented. Nine of the 24 projects carry unpublished changes, spread so a
// quarterly schedule finds two of the host board's overdue, three inside the
// window, and one project that has never been public at all.
const SEEDS: Record<string, PublishSeed> = {
  // The demonstration case: two cost edits that net to one change, a county
  // misclick put back the same minute (nets to nothing), a sentence added to
  // the description, and the timeline pushed a year.
  'Deer Creek Riparian Corridor Enhancement': {
    published: '2026-03-02',
    by: 'Avery Castillo',
    costWas: 398_500,
    edits: [
      { iso: '2026-05-18', who: 'grant', change: costChange(398_500, 405_000) },
      { iso: '2026-05-18', who: 'grant', change: costChange(405_000, 412_000) },
      { iso: '2026-05-18', who: 'lead', change: 'County changed from Tehama to Glenn' },
      { iso: '2026-05-18', who: 'lead', change: 'County changed from Glenn to Tehama' },
      { iso: '2026-08-21', who: 'lead', change: 'Description edited' },
      { iso: '2026-09-12', who: 'lead', change: 'Timeline changed from 2023–2026 to 2023–2027' },
    ],
  },
  // A year's numbers, filed after the year closed.
  'Salinas River Arundo Removal': {
    published: '2025-04-03',
    by: 'Jordan Delgado',
    redate: [{ startsWith: 'Reported value filed', iso: '2026-07-08' }],
    edits: [{ iso: '2026-07-08', who: 'lead', change: 'Description edited' }],
  },
  // A stage change — the kind a funder watches for.
  'Elk River Sediment Reduction': {
    published: '2025-09-15',
    by: 'Avery Castillo',
    stageWas: 'Implementation',
    redate: [{ startsWith: 'Stage set to', iso: '2026-08-27' }],
    edits: [{ iso: '2025-06-02', who: 'lead', change: 'Stage set to Implementation' }],
  },
  // The log's own recent entries, after a summer publish.
  'San Luis Rey Arroyo Toad Habitat': { published: '2026-06-30', by: 'Dana Whitfield' },
  // Never public: a proposal still taking shape.
  'Cache Creek Floodplain Terracing': { published: null },
  // The trust's one project: a closing paragraph added to a finished record.
  'Red Clover Valley Meadow Reconnection': {
    published: '2023-06-30',
    by: 'Jordan Delgado',
    edits: [{ iso: '2026-09-02', who: 'lead', change: 'Description edited' }],
  },
  'Scott River Fish Passage Barrier Removal': {
    published: '2025-02-01',
    costWas: 1_226_000,
    edits: [{ iso: '2026-06-03', who: 'grant', change: costChange(1_226_000, 1_240_000) }],
  },
  'Truckee River Streambank Stabilization': {
    published: '2024-05-20',
    redate: [{ startsWith: 'Reported value filed', iso: '2026-04-14' }],
  },
  'Arroyo Seco Urban Greenway': {
    published: '2025-08-01',
    edits: [{ iso: '2026-05-13', who: 'lead', change: 'Description edited' }],
  },
};

// ---------------------------------------------------------------------------
// The diff
// ---------------------------------------------------------------------------

export type ChangeGroup = 'Key facts' | 'Performance measures' | 'Funding sources' | 'Work areas';

/** The editable field a change can be reverted through — firma2-editable-field's key and raw format. */
export interface RevertTarget {
  field: string;
  /** The published value in the field's data-raw format ("412000", "2023,2027"). */
  raw: string;
}

export interface UnpublishedChange {
  /** Stable within the project: "estimatedTotalCost", "report:Acres…:2025". */
  key: string;
  group: ChangeGroup;
  /** What changed, in the record's own field vocabulary. */
  label: string;
  /** The published value. Absent when the change adds something new. */
  from?: string;
  /** The current value. Absent when the change has no value to show (a redrawn boundary). */
  to?: string;
  /** Whom the log names for it, in order of first edit. */
  editors: string[];
  /** How many log entries fold into this row. */
  edits: number;
  /** The newest of them. */
  lastIso: string;
  /** Text added since the publish, when that is the whole change (a sentence on the description). */
  added?: string;
  /** Present when the field can be put back to its published value. */
  revert?: RevertTarget;
}

/** What the public page shows where the record has moved on. */
export interface PublishedSnapshot {
  estimatedTotalCost: number;
  implementationStartYear: number;
  completionYear: number;
  county: string;
  stage: ProjectStage;
  description: string;
  /** Filings the public page does not show yet. */
  withheldReports: { measure: string; year: number }[];
  /** Funding sources the public page does not list yet. */
  withheldFunding: string[];
}

export interface Publishing {
  /** ISO day of the last publish; `null` when the project has never been public. */
  publishedIso: string | null;
  publishedBy: string | null;
  changes: UnpublishedChange[];
  /** Log entries since the last publish — more than `changes` whenever edits fold together. */
  edits: number;
  /** The oldest unpublished entry: how long the public page has been behind. */
  waitingSinceIso: string | null;
  published: PublishedSnapshot;
}

/** The project's description as published: every sentence but the one added since. */
const withoutLastSentence = (text: string): { kept: string; added: string } => {
  // A sentence ends at a stop followed by a capital — so "2.8 miles" holds together.
  const sentences = text.trim().split(/(?<=[.!?])\s+(?=[A-Z“"])/);
  if (sentences.length < 2) return { kept: text, added: '' };
  return { kept: sentences.slice(0, -1).join(' '), added: sentences.at(-1)! };
};

const parseUsd = (s: string): number => Number(s.replace(/[$,]/g, ''));

interface Context {
  description: string;
  measures: PerformanceMeasure[];
  funding: FundingSource[];
  people: Record<Who, string>;
}

/**
 * Fold the seed into the record's log and derive the diff. Takes the log
 * newest first, as buildAudit returns it, and returns it the same way.
 */
export const applyPublishing = (project: Project, base: AuditEntry[], ctx: Context): { audit: AuditEntry[]; publishing: Publishing } => {
  const seed: PublishSeed | undefined = SEEDS[project.projectName];
  let entries = base.map((e) => ({ ...e, iso: isoOfLabel(e.date) }));

  for (const { startsWith, iso } of seed?.redate ?? []) {
    const hit = entries.find((e) => e.change.startsWith(startsWith));
    if (!hit) throw new Error(`Publish seed for "${project.projectName}" re-dates a missing entry: ${startsWith}`);
    hit.iso = iso;
  }
  if (seed?.costWas !== undefined) {
    const hit = entries.find((e) => e.change.startsWith('Estimated total cost changed'));
    if (!hit) throw new Error(`Publish seed for "${project.projectName}" sets costWas with no cost entry`);
    hit.change = hit.change.replace(/to \$[\d,]+$/, `to ${usd.format(seed.costWas)}`);
  }
  for (const edit of seed?.edits ?? []) {
    entries.push({ date: '', user: ctx.people[edit.who], change: edit.change, iso: edit.iso });
  }

  // Unseeded projects were published a few weeks after their last change —
  // the sweep caught up, and nothing has moved since.
  const latest = entries.reduce((max, e) => (e.iso > max ? e.iso : max), '');
  const hash = [...project.projectName].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const fallback = () => {
    const t = Math.min(Date.parse(`${latest}T00:00:00Z`) + (12 + (hash % 30)) * DAY_MS, Date.parse(`${TODAY_ISO}T00:00:00Z`) - DAY_MS);
    return new Date(t).toISOString().slice(0, 10);
  };
  const publishedIso = seed ? seed.published : fallback();
  const publishedBy = publishedIso ? seed?.by ?? PUBLISHERS[hash % PUBLISHERS.length] : null;
  if (publishedIso) entries.push({ date: '', user: publishedBy!, change: PUBLISHED_CHANGE, iso: publishedIso });

  // Chronological, stable: same-day entries keep the order they were authored in.
  entries = entries.map((e, i) => ({ e, i })).sort((a, b) => a.e.iso.localeCompare(b.e.iso) || a.i - b.i).map(({ e }) => e);
  const audit = entries.map(({ iso, user, change }) => ({ date: labelOfIso(iso), user, change })).reverse();

  const publishIndex = publishedIso ? entries.findIndex((e) => e.change === PUBLISHED_CHANGE) : -1;
  const pending = entries.slice(publishIndex + 1).filter((e) => e.change !== PUBLISHED_CHANGE);

  // --- fold the pending entries into one row per thing changed ---
  const rows = new Map<string, UnpublishedChange>();
  const touch = (key: string, init: () => Omit<UnpublishedChange, 'editors' | 'edits' | 'lastIso'>, e: { user: string; iso: string }) => {
    const row = rows.get(key) ?? { ...init(), editors: [], edits: 0, lastIso: e.iso };
    if (!row.editors.includes(e.user)) row.editors.push(e.user);
    row.edits += 1;
    row.lastIso = e.iso;
    rows.set(key, row);
    return row;
  };

  const years = `${project.implementationStartYear}–${project.completionYear}`;
  const description = withoutLastSentence(ctx.description);
  const published: PublishedSnapshot = {
    estimatedTotalCost: project.estimatedTotalCost,
    implementationStartYear: project.implementationStartYear,
    completionYear: project.completionYear,
    county: project.county,
    stage: project.stage,
    description: ctx.description,
    withheldReports: [],
    withheldFunding: [],
  };

  for (const e of pending) {
    let m: RegExpMatchArray | null;
    if ((m = e.change.match(/^Estimated total cost changed from (\$[\d,]+) to (\$[\d,]+)$/))) {
      const row = touch('estimatedTotalCost', () => ({ key: 'estimatedTotalCost', group: 'Key facts', label: 'Estimated total cost', from: m![1], revert: { field: 'estimatedTotalCost', raw: String(parseUsd(m![1])) } }), e);
      row.to = m[2];
    } else if ((m = e.change.match(/^Timeline changed from (\d{4})–(\d{4}) to (\d{4})–(\d{4})$/))) {
      const row = touch('timeline', () => ({ key: 'timeline', group: 'Key facts', label: 'Timeline', from: `${m![1]}–${m![2]}`, revert: { field: 'timeline', raw: `${m![1]},${m![2]}` } }), e);
      row.to = `${m[3]}–${m[4]}`;
    } else if ((m = e.change.match(/^County changed from (.+) to (.+)$/))) {
      const row = touch('county', () => ({ key: 'county', group: 'Key facts', label: 'County', from: m![1], revert: { field: 'county', raw: m![1] } }), e);
      row.to = m[2];
    } else if ((m = e.change.match(/^Stage set to (.+)$/))) {
      const row = touch('stage', () => ({ key: 'stage', group: 'Key facts', label: 'Stage', from: seed?.stageWas }), e);
      row.to = m[1];
    } else if (/^Description (edited|updated)$/.test(e.change)) {
      touch('description', () => ({ key: 'description', group: 'Key facts', label: 'Description', from: description.kept, to: ctx.description, added: description.added || undefined, revert: { field: 'projectDescription', raw: description.kept } }), e);
    } else if ((m = e.change.match(/^Reported value filed: (.+), (\d{4})$/))) {
      const [, measure, year] = m;
      const value = ctx.measures.find((x) => x.name === measure)?.series.find((p) => p.year === Number(year))?.value;
      const unit = ctx.measures.find((x) => x.name === measure)?.unit ?? '';
      touch(`report:${measure}:${year}`, () => ({ key: `report:${measure}:${year}`, group: 'Performance measures', label: `${measure}, ${year}`, to: value == null ? undefined : `${value.toLocaleString('en-US')} ${unit}`.trim() }), e);
      published.withheldReports.push({ measure, year: Number(year) });
    } else if ((m = e.change.match(/^Funding source added: (.+)$/))) {
      const source = ctx.funding.find((f) => f.name === m![1]);
      touch(`funding:${m[1]}`, () => ({ key: `funding:${m![1]}`, group: 'Funding sources', label: m![1], to: source ? `${usd.format(source.amount)} from ${source.organization}` : undefined }), e);
      published.withheldFunding.push(m[1]);
    } else if ((m = e.change.match(/^Work area boundary revised: (.+)$/))) {
      touch(`area:${m[1]}`, () => ({ key: `area:${m[1]}`, group: 'Work areas', label: m![1], to: 'Boundary redrawn' }), e);
    } else if (e.change === 'Project created') {
      // Folded into the first-publish rows below.
    } else {
      throw new Error(`Publish diff cannot read log entry on "${project.projectName}": ${e.change}`);
    }
  }

  // A field changed and changed back is no change — the misclick case.
  for (const [key, row] of rows) if (row.from !== undefined && row.from === row.to) rows.delete(key);

  // Never published: the whole record is new to the public.
  if (!publishedIso) {
    rows.clear();
    const first = pending[0];
    const add = (key: string, label: string, to: string) =>
      rows.set(key, { key, group: 'Key facts', label, to, editors: [first.user], edits: 1, lastIso: first.iso });
    add('stage', 'Stage', project.stage);
    add('leadOrganization', 'Lead organization', project.leadOrganization);
    add('county', 'County', project.county);
    add('timeline', 'Timeline', years);
    add('estimatedTotalCost', 'Estimated total cost', usd.format(project.estimatedTotalCost));
    add('description', 'Description', ctx.description);
    for (const f of ctx.funding) rows.set(`funding:${f.name}`, { key: `funding:${f.name}`, group: 'Funding sources', label: f.name, to: `${usd.format(f.amount)} from ${f.organization}`, editors: [first.user], edits: 1, lastIso: first.iso });
  }

  // What the public page still shows, for every row the diff kept.
  const kept = new Set(rows.keys());
  if (kept.has('estimatedTotalCost') && publishedIso) published.estimatedTotalCost = parseUsd(rows.get('estimatedTotalCost')!.from!);
  if (kept.has('timeline') && publishedIso) {
    const [a, b] = rows.get('timeline')!.from!.split('–').map(Number);
    published.implementationStartYear = a;
    published.completionYear = b;
  }
  if (kept.has('county') && publishedIso) published.county = rows.get('county')!.from!;
  if (kept.has('stage') && seed?.stageWas) published.stage = seed.stageWas;
  if (kept.has('description') && publishedIso) published.description = description.kept;

  // The cost chain must land on the record's own figure, or the log contradicts the rail.
  const cost = rows.get('estimatedTotalCost');
  if (publishedIso && cost && parseUsd(cost.to!) !== project.estimatedTotalCost) {
    throw new Error(`Publish seed for "${project.projectName}" ends its cost at ${cost.to}, not the record's ${usd.format(project.estimatedTotalCost)}`);
  }
  const timeline = rows.get('timeline');
  if (publishedIso && timeline && timeline.to !== years) {
    throw new Error(`Publish seed for "${project.projectName}" ends its timeline at ${timeline.to}, not ${years}`);
  }

  const changes = [...rows.values()];
  return {
    audit,
    publishing: {
      publishedIso,
      publishedBy,
      changes,
      edits: changes.length ? pending.length : 0,
      waitingSinceIso: changes.length ? pending[0].iso : null,
      published,
    },
  };
};
