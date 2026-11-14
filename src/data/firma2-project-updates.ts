// Fixtures for the Team 5 sandbox (/prototypes/team-5) — ProjectFirma2's
// hackathon mission 5, "Streamlined Project Updates", rebuilt on this spoke's
// components so it can be judged feature by feature.
//
// INVENTED CONTENT, like every data module here. Nothing below is copied from
// the hackathon branch's seed scripts or sample documents: the targets, the
// change rows, the documents and the assistant's script are all DERIVED from
// this spoke's own mock portfolio (firma2-projects, firma2-project-detail), so
// the sandbox speaks about the same 24 projects as the rest of the site.
//
// WHAT IS BORROWED is the model, from the branch's DTOs:
//   ProjectUpdateTarget   one thing a project can be updated on — a record
//                         field, a funding source's money for a year, or a
//                         performance measure's figure for a year.
//   ProjectFieldChange    one logged change, with a status. Team 5 keeps one
//                         log per domain (their ADR-0006); here a `domain`
//                         column stands in for the three tables.
//   ProjectAttachment     a photo or a document on the project.
//
// THE ASSISTANT IS SCRIPTED. Team 5 sends the reporter's words and documents
// to Claude; this spoke has no server, so `assistantScript` writes a sample
// update FROM the project's own data and knows which target each sentence
// fills. Same contract as firma2-report-import: a reading is matched in code,
// never improvised.

import { projects, projectSlug } from './firma2-projects';
import type { Project } from './firma2-projects';
import { getProjectDetail } from './firma2-project-detail';
import { CURRENT_USER, users } from './firma2-directory';
import { photoSrc } from '../lib/project-photos';

/** The reporting year every "this year" target points at — the fixture's present. */
export const UPDATE_YEAR = 2026;
/** The fixture's today, as an ISO day (firma2-directory's TODAY). */
export const SANDBOX_TODAY = '2026-09-30';

// ---------------------------------------------------------------------------
// Routes — base-less, wrap with withBase() at render.
// ---------------------------------------------------------------------------
export const UPDATES_BASE = '/prototypes/team-5';
export const sandboxProjectsHref = `${UPDATES_BASE}/my-projects`;
export const sandboxQueueHref = `${UPDATES_BASE}/changes`;
export const sandboxProjectHref = (slug: string): string => `${UPDATES_BASE}/projects/${slug}`;
export const sandboxUpdateHref = (slug: string): string => `${UPDATES_BASE}/projects/${slug}/update`;

// ---------------------------------------------------------------------------
// People — the two seats the sandbox switches between.
// ---------------------------------------------------------------------------
const reporterUser =
  users.find((u) => u.role === 'Contributor' && u.status === 'Active' && u.organizations.includes(projects[0].leadOrganization)) ??
  users.find((u) => u.role === 'Contributor' && u.status === 'Active')!;

export type SandboxRole = 'reporter' | 'admin';

export const SANDBOX_PEOPLE: Record<SandboxRole, { name: string; title: string; organizations: string[] }> = {
  reporter: { name: reporterUser.name, title: 'Project editor', organizations: reporterUser.organizations },
  admin: { name: CURRENT_USER.name, title: 'Administrator', organizations: [] },
};

/** The slugs a seat may edit: an editor's own organizations' projects, an administrator's everything. */
export const editableSlugs = (role: SandboxRole): string[] => {
  if (role === 'admin') return projects.map(projectSlug);
  const mine = projects.filter((p) => SANDBOX_PEOPLE.reporter.organizations.includes(p.leadOrganization));
  return (mine.length ? mine : projects.slice(0, 3)).map(projectSlug);
};

// ---------------------------------------------------------------------------
// Update targets
// ---------------------------------------------------------------------------
export type TargetKind = 'Field' | 'Money' | 'Measure';

export interface UpdateTarget {
  /** Stable id: `field:CompletionYear`, `spent:0:2026`, `measure:2:2026`. */
  id: string;
  /** The card it sits in on the update screen. */
  group: string;
  label: string;
  kind: TargetKind;
  /** "$" for money, the measure's unit for a measure, absent for a field. */
  unit?: string;
  /** The stored value as a raw string — "412000", "13", "" for nothing reported. */
  value: string;
  /** The one long-text field; everything else is a single line. */
  multiline?: boolean;
  /**
   * Where it can be edited. `update` targets are on the reporter's update
   * screen; `record` targets (funding commitments, other years' money) are
   * edited in place on the project page only.
   */
  screen: 'update' | 'record';
  /** Money only: which funding source and year. */
  sourceIndex?: number;
  year?: number;
  column?: 'spent' | 'budgeted' | 'commitment';
}

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

/** A target's value the way a person reads it: "$412,000", "13 acres", "—" for empty. */
export const formatTargetValue = (target: Pick<UpdateTarget, 'kind' | 'unit'>, raw: string): string => {
  if (raw === '') return '—';
  if (target.kind === 'Field' && target.unit !== '$') return raw;
  const n = Number(raw);
  if (!Number.isFinite(n)) return raw;
  if (target.unit === '$') return money.format(n);
  return target.unit ? `${number.format(n)} ${target.unit}` : number.format(n);
};

/** Why a draft cannot be saved, or null. One sentence, for the row that caused it. */
export const validateTarget = (target: UpdateTarget, draft: string): string | null => {
  const v = draft.trim();
  if (target.id === 'field:ImplementationStartYear' || target.id === 'field:CompletionYear') {
    return /^(19|20)\d{2}$/.test(v) ? null : 'Enter a four-digit year.';
  }
  if (target.kind === 'Money' || target.kind === 'Measure' || target.unit === '$') {
    if (v === '') return target.kind === 'Measure' ? null : 'Enter an amount, or 0.';
    const n = Number(v.replace(/[$,\s]/g, ''));
    if (!Number.isFinite(n)) return 'Enter a number.';
    if (n < 0) return 'Enter 0 or more.';
    return null;
  }
  if (target.id === 'field:LeadOrganization' && v === '') return 'Enter the lead organization.';
  return null;
};

/** Money and measure drafts as stored: "$62,500" → "62500". Fields pass through trimmed. */
export const normalizeDraft = (target: UpdateTarget, draft: string): string => {
  const v = draft.trim();
  if (target.kind === 'Field' && target.unit !== '$') return v;
  return v.replace(/[$,\s]/g, '');
};

/** Split a year's total across sources by share, the remainder on the last, so the parts sum. */
const splitByShare = (total: number, shares: number[]): number[] => {
  const parts = shares.map((s) => Math.round((total * s) / 500) * 500);
  if (parts.length) parts[parts.length - 1] = total - parts.slice(0, -1).reduce((a, b) => a + b, 0);
  return parts;
};

const round500 = (n: number): number => Math.round(n / 500) * 500;

const buildTargets = (project: Project): UpdateTarget[] => {
  const detail = getProjectDetail(project);
  const targets: UpdateTarget[] = [
    { id: 'field:ProjectDescription', group: 'Project record', label: 'Description', kind: 'Field', value: detail.projectDescription, multiline: true, screen: 'update' },
    { id: 'field:ImplementationStartYear', group: 'Project record', label: 'Start year', kind: 'Field', value: String(project.implementationStartYear), screen: 'update' },
    { id: 'field:CompletionYear', group: 'Project record', label: 'Completion year', kind: 'Field', value: String(project.completionYear), screen: 'update' },
    { id: 'field:EstimatedTotalCost', group: 'Project record', label: 'Estimated cost', kind: 'Field', unit: '$', value: String(project.estimatedTotalCost), screen: 'update' },
    { id: 'field:LeadOrganization', group: 'Project record', label: 'Lead organization', kind: 'Field', value: project.leadOrganization, screen: 'update' },
    { id: 'field:County', group: 'Project record', label: 'County', kind: 'Field', value: project.county, screen: 'update' },
  ];

  const shares = detail.funding.map((f) => f.share);
  // A budget a year: the whole cost spread evenly over the window, never under what was spent.
  const evenYear = round500(project.estimatedTotalCost / Math.max(1, detail.expenditures.length));
  detail.funding.forEach((source, i) => {
    targets.push({
      id: `funding:${i}`,
      group: 'Funding sources',
      label: source.name,
      kind: 'Money',
      unit: '$',
      value: String(source.amount),
      screen: 'record',
      sourceIndex: i,
      column: 'commitment',
    });
  });
  detail.expenditures.forEach((year) => {
    const spent = splitByShare(year.spent, shares);
    const budgeted = splitByShare(Math.max(evenYear, year.spent), shares);
    detail.funding.forEach((source, i) => {
      const onUpdate = year.year === UPDATE_YEAR;
      targets.push({
        id: `spent:${i}:${year.year}`,
        group: `Spent in ${year.year}`,
        label: source.name,
        kind: 'Money',
        unit: '$',
        value: String(spent[i]),
        screen: onUpdate ? 'update' : 'record',
        sourceIndex: i,
        year: year.year,
        column: 'spent',
      });
      targets.push({
        id: `budgeted:${i}:${year.year}`,
        group: `Budgeted for ${year.year}`,
        label: source.name,
        kind: 'Money',
        unit: '$',
        value: String(budgeted[i]),
        screen: onUpdate ? 'update' : 'record',
        sourceIndex: i,
        year: year.year,
        column: 'budgeted',
      });
    });
  });

  detail.measures.forEach((measure, i) => {
    const period = measure.series.find((s) => s.year === UPDATE_YEAR);
    if (!period) return;
    targets.push({
      id: `measure:${i}:${UPDATE_YEAR}`,
      group: `Work done in ${UPDATE_YEAR}`,
      label: measure.name,
      kind: 'Measure',
      unit: measure.unit,
      value: period.value === null ? '' : String(period.value),
      screen: 'update',
      year: UPDATE_YEAR,
    });
  });
  return targets;
};

const TARGETS = new Map<string, UpdateTarget[]>(projects.map((p) => [projectSlug(p), buildTargets(p)]));

/** Every target on a project, record-only ones included. Empty for an unknown slug. */
export const targetsFor = (slug: string): UpdateTarget[] => TARGETS.get(slug) ?? [];

/** The targets on the reporter's update screen, in card order. */
export const updateScreenTargets = (slug: string): UpdateTarget[] => targetsFor(slug).filter((t) => t.screen === 'update');

/** Card order on the update screen: the season's numbers first, the record last. */
export const UPDATE_GROUP_ORDER = [`Work done in ${UPDATE_YEAR}`, `Spent in ${UPDATE_YEAR}`, `Budgeted for ${UPDATE_YEAR}`, 'Project record'];

// ---------------------------------------------------------------------------
// The change log
// ---------------------------------------------------------------------------
export type ChangeDomain = 'field' | 'money' | 'measure' | 'photo' | 'document';
export type ChangeStatus = 'Pending' | 'Applied' | 'Approved' | 'Rejected' | 'Reverted';
/** The pathway, not the author: typed by a person, or proposed by the assistant and committed by one. */
export type ChangeSource = 'Direct' | 'Assistant';

export interface ChangeRow {
  id: string;
  slug: string;
  projectName: string;
  /** The target changed, or `file:<attachment id>` for a photo or document. */
  targetId: string;
  /** "Completion year", "Spent in 2026 · Local Sponsor Match", "Photo". */
  label: string;
  domain: ChangeDomain;
  /** Raw values; '' means empty (a file row's add has from '', its removal has to ''). */
  from: string;
  to: string;
  /** Rendered values — formatted money and units, or a file name. */
  fromLabel: string;
  toLabel: string;
  by: string;
  /** ISO day. */
  at: string;
  source: ChangeSource;
  status: ChangeStatus;
  resolvedBy?: string;
  resolvedAt?: string;
  /** Set on a row that puts an earlier change back. */
  revertOf?: string;
}

/** "Spent in 2026 · Local Sponsor Match" for money and measures; the bare label for fields. */
export const changeLabel = (target: UpdateTarget): string => {
  if (target.column === 'commitment') return `Funding · ${target.label}`;
  if (target.kind === 'Money') return `${target.group} · ${target.label}`;
  if (target.kind === 'Measure') return `${target.label}, ${target.year}`;
  return target.label;
};

export const domainOf = (target: UpdateTarget): ChangeDomain =>
  target.kind === 'Money' ? 'money' : target.kind === 'Measure' ? 'measure' : 'field';

const daysBefore = (days: number): string => new Date(Date.parse(SANDBOX_TODAY) - days * 86_400_000).toISOString().slice(0, 10);

/**
 * The log every project starts with: two applied history rows on the first six
 * projects, and on the first three a pair of edits still waiting for review —
 * one of them stale, because the cost moved after it was proposed.
 */
export const seedChanges = (): ChangeRow[] => {
  const rows: ChangeRow[] = [];
  projects.slice(0, 6).forEach((project, p) => {
    const slug = projectSlug(project);
    const detail = getProjectDetail(project);
    const editor = detail.contacts[0]?.name ?? SANDBOX_PEOPLE.reporter.name;
    const target = (id: string) => targetsFor(slug).find((t) => t.id === id);
    const row = (id: string, t: UpdateTarget, from: string, to: string, patch: Partial<ChangeRow>): ChangeRow => ({
      id,
      slug,
      projectName: project.projectName,
      targetId: t.id,
      label: changeLabel(t),
      domain: domainOf(t),
      from,
      to,
      fromLabel: formatTargetValue(t, from),
      toLabel: formatTargetValue(t, to),
      by: editor,
      at: daysBefore(40 + p * 9),
      source: 'Direct',
      status: 'Applied',
      ...patch,
    });

    const cost = target('field:EstimatedTotalCost')!;
    const earlierCost = String(round500(project.estimatedTotalCost * 0.92));
    rows.push(row(`seed-${p}-cost`, cost, earlierCost, cost.value, {}));
    const completion = target('field:CompletionYear')!;
    rows.push(row(`seed-${p}-completion`, completion, String(project.completionYear - 1), completion.value, { at: daysBefore(120 + p * 5), source: 'Assistant' }));

    if (p > 2) return;
    // The sandbox's own editor proposed the first project's; the others' came from their own contacts.
    const proposer = p === 0 ? SANDBOX_PEOPLE.reporter.name : (detail.contacts[1]?.name ?? editor);
    // Proposed against the earlier cost: the field has moved since, so it reads as stale.
    rows.push(row(`seed-${p}-cost-pending`, cost, earlierCost, String(round500(project.estimatedTotalCost * 1.05)), { status: 'Pending', at: daysBefore(6 + p), by: proposer }));
    const measure = targetsFor(slug).find((t) => t.kind === 'Measure' && t.value === '');
    const planned = detail.measures[0]?.series.find((s) => s.year === UPDATE_YEAR)?.planned;
    if (measure && planned) {
      rows.push(row(`seed-${p}-measure-pending`, measure, '', String(planned), { status: 'Pending', at: daysBefore(3 + p), by: proposer, source: 'Assistant' }));
    }
  });
  return rows;
};

// ---------------------------------------------------------------------------
// Photos and documents
// ---------------------------------------------------------------------------
export type PhotoTiming = 'Before' | 'During' | 'After';
export const PHOTO_TIMINGS: PhotoTiming[] = ['Before', 'During', 'After'];

export interface Attachment {
  id: string;
  slug: string;
  kind: 'photo' | 'document';
  fileName: string;
  caption: string;
  /** Photos only. */
  timing?: PhotoTiming;
  /** Photos only: an image URL (seed) or a downscaled data URL (added in this browser). */
  src?: string;
  by: string;
  /** ISO day. */
  at: string;
  /** Waiting for a reviewer: `add` is not on the record yet, `remove` is still on it. */
  pending?: 'add' | 'remove';
  /** The change row that staged it, while pending. */
  changeId?: string;
}

const fileSlug = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** What a project's files start as: its gallery photos, and two documents once work has begun. */
export const seedAttachments = (slug: string): Attachment[] => {
  const project = projects.find((p) => projectSlug(p) === slug);
  if (!project) return [];
  const detail = getProjectDetail(project);
  const by = detail.contacts[0]?.name ?? SANDBOX_PEOPLE.reporter.name;
  const photos: Attachment[] = detail.photos.map((photo, i) => ({
    id: `seed-photo-${i}`,
    slug,
    kind: 'photo',
    fileName: `${fileSlug(photo.caption)}.jpg`,
    caption: photo.caption,
    timing: PHOTO_TIMINGS[Math.min(2, Math.floor((i * 3) / Math.max(1, detail.photos.length)))],
    src: photoSrc(photo, 640, 480),
    by,
    at: daysBefore(200 - i * 30),
  }));
  const started = project.implementationStartYear < UPDATE_YEAR;
  const documents: Attachment[] = started
    ? [
        { id: 'seed-doc-0', slug, kind: 'document', fileName: `${UPDATE_YEAR - 1}-annual-progress-report.pdf`, caption: `${UPDATE_YEAR - 1} annual progress report`, by, at: daysBefore(250) },
        { id: 'seed-doc-1', slug, kind: 'document', fileName: 'landowner-access-agreement.pdf', caption: '', by, at: daysBefore(410) },
      ]
    : [];
  return [...photos, ...documents];
};

/** File types the assistant reads as text; anything else is attached without being read. */
export const READABLE_DOCUMENT = /\.(pdf|docx|xlsx|csv|txt)$/i;
export const isImageName = (name: string): boolean => /\.(jpe?g|png|gif|webp|heic)$/i.test(name);

// ---------------------------------------------------------------------------
// The scripted assistant
// ---------------------------------------------------------------------------
export interface ScriptedProposal {
  targetId: string;
  /** Raw value proposed into the box. */
  value: string;
  /** The reporter's words, or the document's line, quoted under the box. */
  evidence: string;
  from: 'words' | 'document';
  /** Words only: the figure that must appear in what was typed for this to match. */
  cue?: string;
}

export interface AssistantScript {
  /** A sample update in the reporter's voice, written from this project's own figures. */
  sampleUpdate: string;
  /** The sample report's file name. */
  documentName: string;
  proposals: ScriptedProposal[];
  /** A word in the sample the project has no target for, and what the assistant says about it. */
  unplacedCue: string;
  unplacedNote: string;
}

const SCRIPTS = new Map<string, AssistantScript>(
  projects.map((project) => {
    const slug = projectSlug(project);
    const detail = getProjectDetail(project);
    const targets = updateScreenTargets(slug);
    const proposals: ScriptedProposal[] = [];
    const sentences: string[] = [];

    const cost = String(Math.round((project.estimatedTotalCost * 1.08) / 1000) * 1000);
    const costText = money.format(Number(cost));
    sentences.push(`The total came in higher than we planned, around ${costText}.`);
    proposals.push({ targetId: 'field:EstimatedTotalCost', value: cost, evidence: `The total came in higher than we planned, around ${costText}.`, from: 'words', cue: costText });

    const completion = String(project.completionYear + 1);
    sentences.push(`We're pushing completion out to ${completion} — permits took longer than expected.`);
    proposals.push({ targetId: 'field:CompletionYear', value: completion, evidence: `We're pushing completion out to ${completion}`, from: 'words', cue: completion });

    const measureTargets = targets.filter((t) => t.kind === 'Measure');
    const plannedFor = (t: UpdateTarget): string => {
      const i = Number(t.id.split(':')[1]);
      const planned = detail.measures[i]?.series.find((s) => s.year === UPDATE_YEAR)?.planned;
      return planned === undefined ? '' : String(planned);
    };
    const firstMeasure = measureTargets[0];
    if (firstMeasure && plannedFor(firstMeasure)) {
      const v = plannedFor(firstMeasure);
      const said = `${number.format(Number(v))} ${firstMeasure.unit}`;
      sentences.unshift(`This season we got ${said} done — ${firstMeasure.label.toLowerCase()}.`);
      proposals.unshift({ targetId: firstMeasure.id, value: v, evidence: `This season we got ${said} done`, from: 'words', cue: said });
    }

    const spentTargets = targets.filter((t) => t.column === 'spent');
    const firstSpent = spentTargets[0];
    if (firstSpent) {
      const v = String(Number(firstSpent.value) + 4000);
      const said = money.format(Number(v));
      sentences.push(`We've spent ${said} of the ${firstSpent.label} money this year.`);
      proposals.push({ targetId: firstSpent.id, value: v, evidence: `We've spent ${said} of the ${firstSpent.label} money this year.`, from: 'words', cue: said });
    }

    const secondMeasure = measureTargets[1];
    if (secondMeasure && plannedFor(secondMeasure)) {
      const v = plannedFor(secondMeasure);
      proposals.push({ targetId: secondMeasure.id, value: v, evidence: `Table 2 — ${secondMeasure.label}: ${number.format(Number(v))} ${secondMeasure.unit}`, from: 'document' });
    }
    const secondSpent = spentTargets[1];
    if (secondSpent) {
      const v = String(Number(secondSpent.value) + 1500);
      proposals.push({ targetId: secondSpent.id, value: v, evidence: `Expenditures to date — ${secondSpent.label}: ${money.format(Number(v))}`, from: 'document' });
    }

    sentences.push('The landowner also wants the gate moved before winter.');
    return [
      slug,
      {
        sampleUpdate: sentences.join(' '),
        documentName: `${slug.split('-').slice(0, 2).join('-')}-${UPDATE_YEAR}-progress-report.pdf`,
        proposals,
        unplacedCue: 'gate',
        unplacedNote: 'Moving the gate isn’t something this project tracks, so it wasn’t filled in.',
      },
    ];
  }),
);

export const assistantScript = (slug: string): AssistantScript | undefined => SCRIPTS.get(slug);

// ---------------------------------------------------------------------------
// The sandbox's index — what Team 5 built, and where each part can be seen.
// ---------------------------------------------------------------------------
export interface SandboxFeature {
  name: string;
  /** Base-less route to the screen that shows it. */
  href: string;
  /** Where this spoke already has it or has decided otherwise. Absent when it is new here. */
  spokeNote?: string;
}

const DEMO_SLUG = projectSlug(projects[0]);

export const SANDBOX_FEATURES: SandboxFeature[] = [
  { name: 'My Projects landing', href: sandboxProjectsHref, spokeNote: 'Ported here on 3 October; it has since become the Map page.' },
  { name: 'Update screen with one Save', href: sandboxUpdateHref(DEMO_SLUG), spokeNote: 'The record page here saves each field as you leave it.' },
  { name: 'Describe your update: type, speak or drop files', href: sandboxUpdateHref(DEMO_SLUG), spokeNote: 'Scripted here. Import a report on the record page reads a document too.' },
  { name: 'Change log with approve, reject and revert', href: `${sandboxProjectHref(DEMO_SLUG)}#changes`, spokeNote: 'Review here compares the public page with the record, once per publish.' },
  { name: 'Pending changes queue', href: sandboxQueueHref },
  { name: 'Money by funding source and year', href: `${sandboxProjectHref(DEMO_SLUG)}#financials`, spokeNote: 'Projects here are budgeted once, not per year.' },
  { name: 'Photos with before, during and after', href: `${sandboxProjectHref(DEMO_SLUG)}#photos` },
  { name: 'Documents list', href: `${sandboxProjectHref(DEMO_SLUG)}#documents`, spokeNote: 'Files here show inline in the text; there is no files list.' },
  { name: 'Performance measure tiles', href: `${sandboxProjectHref(DEMO_SLUG)}#measures`, spokeNote: 'The record page here has its own measures section.' },
];
