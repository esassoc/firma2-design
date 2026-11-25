// The Team 5 sandbox's state, kept in this browser — who is looking, whether
// the workspace reviews edits, every value changed, the change log and the
// files. One versioned key; clear it (resetSandbox) and the demo is back to
// its seed. Same honesty terms as publish-store: nothing leaves the browser.
//
// THE TWO SWITCHES ARE TEAM 5'S TENANT FLAGS (their ADR-0005):
//   review     ProjectUpdateReview. Off: every edit writes live and is logged.
//              On: a project editor's edits land Pending until an administrator
//              approves or rejects them. An administrator's own edits are
//              always live.
//   assistant  ProjectUpdateAssistant. Off: the update screen takes files and
//              typed values only.
//
// Every component in the sandbox reads through here and re-renders on
// SANDBOX_EVENT, so the update screen, the project page and the queue agree
// after any commit, approval or revert.

import {
  SANDBOX_PEOPLE,
  SANDBOX_TODAY,
  changeLabel,
  domainOf,
  formatTargetValue,
  isImageName,
  seedAttachments,
  seedChanges,
  targetsFor,
} from '../data/firma2-project-updates';
import type { Attachment, ChangeRow, ChangeSource, PhotoTiming, SandboxRole, UpdateTarget } from '../data/firma2-project-updates';
import { projects, projectSlug } from '../data/firma2-projects';

const KEY = 'firma2:update-sandbox:v1';
export const SANDBOX_EVENT = 'firma2:update-sandbox';

export interface SandboxSettings {
  role: SandboxRole;
  review: boolean;
  assistant: boolean;
}

interface State {
  settings: SandboxSettings;
  /** Applied values that differ from the fixture, per slug, by target id. */
  values: Record<string, Record<string, string>>;
  /** The whole log, seed included, in the order written. */
  changes: ChangeRow[];
  /** Files per slug — absent until a slug is first read, then seeded. */
  files: Record<string, Attachment[]>;
  seq: number;
}

const fresh = (): State => ({
  settings: { role: 'reporter', review: true, assistant: true },
  values: {},
  changes: seedChanges(),
  files: {},
  seq: 0,
});

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

let memory: State | null = null;

const read = (): State => {
  if (memory) return memory;
  try {
    const parsed = JSON.parse(storage()?.getItem(KEY) ?? 'null');
    memory = parsed && typeof parsed === 'object' && Array.isArray(parsed.changes) ? { ...fresh(), ...parsed } : fresh();
  } catch {
    memory = fresh();
  }
  return memory!;
};

const write = (next: State): void => {
  memory = next;
  try {
    storage()?.setItem(KEY, JSON.stringify(next));
  } catch {
    // Blocked or full storage: the page keeps working from memory until reload.
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(SANDBOX_EVENT));
};

/** Run `render` now and again after every change to the sandbox. */
export const onSandboxChange = (render: () => void): void => {
  render();
  window.addEventListener(SANDBOX_EVENT, render);
  // Another tab changed it: drop the cache and re-read.
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    memory = null;
    render();
  });
};

// ---------------------------------------------------------------------------
// Settings and the seat
// ---------------------------------------------------------------------------
export const readSettings = (): SandboxSettings => read().settings;

export const writeSettings = (patch: Partial<SandboxSettings>): void => {
  const state = read();
  write({ ...state, settings: { ...state.settings, ...patch } });
};

export const resetSandbox = (): void => {
  try {
    storage()?.removeItem(KEY);
  } catch {
    // Nothing stored, nothing to clear.
  }
  write(fresh());
};

/** Who is acting: the name written on every change they make. */
export const actor = (): { name: string; role: SandboxRole } => {
  const { role } = readSettings();
  return { name: SANDBOX_PEOPLE[role].name, role };
};

/** Only an administrator approves, rejects or reverts. */
export const canReview = (): boolean => readSettings().role === 'admin';

/** Whether THIS seat's edits wait for a reviewer right now. */
export const editsWaitForReview = (): boolean => {
  const { role, review } = readSettings();
  return review && role === 'reporter';
};

// ---------------------------------------------------------------------------
// Values
// ---------------------------------------------------------------------------
export const currentValue = (slug: string, target: Pick<UpdateTarget, 'id' | 'value'>): string => read().values[slug]?.[target.id] ?? target.value;

/** Every target on a project with its value as it stands now. */
export const currentTargets = (slug: string): UpdateTarget[] => targetsFor(slug).map((t) => ({ ...t, value: currentValue(slug, t) }));

const projectNameOf = (slug: string): string => projects.find((p) => projectSlug(p) === slug)?.projectName ?? slug;

const nextId = (state: State): string => `local-${state.seq + 1}`;

// ---------------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------------
const filesOf = (state: State, slug: string): Attachment[] => state.files[slug] ?? seedAttachments(slug);

export const attachments = (slug: string, kind?: Attachment['kind']): Attachment[] =>
  filesOf(read(), slug).filter((a) => !kind || a.kind === kind);

/** A file the reader chose, ready to stage: photos carry a small preview. */
export interface NewFile {
  fileName: string;
  kind: 'photo' | 'document';
  src?: string;
  caption?: string;
  timing?: PhotoTiming;
}

/**
 * Read a chosen File into a NewFile. A photo is drawn down to 640px and kept
 * as a JPEG data URL so it survives a reload without filling storage; if the
 * browser cannot decode it, it is kept by name alone.
 */
export const readFile = async (file: File): Promise<NewFile> => {
  const photo = file.type.startsWith('image/') || isImageName(file.name);
  if (!photo) return { fileName: file.name, kind: 'document' };
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 640 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return { fileName: file.name, kind: 'photo', src: canvas.toDataURL('image/jpeg', 0.72) };
  } catch {
    return { fileName: file.name, kind: 'photo' };
  }
};

const fileRow = (state: State, slug: string, file: Attachment, removing: boolean, pending: boolean, seq: number): ChangeRow => ({
  id: `local-${seq}`,
  slug,
  projectName: projectNameOf(slug),
  targetId: `file:${file.id}`,
  label: file.kind === 'photo' ? 'Photo' : 'Document',
  domain: file.kind,
  from: removing ? file.fileName : '',
  to: removing ? '' : file.fileName,
  fromLabel: removing ? file.fileName : '—',
  toLabel: removing ? 'Removed' : file.fileName,
  by: SANDBOX_PEOPLE[state.settings.role].name,
  at: SANDBOX_TODAY,
  source: 'Direct',
  status: pending ? 'Pending' : 'Applied',
});

const withFiles = (state: State, slug: string, files: NewFile[], pending: boolean): State => {
  let seq = state.seq;
  const added: Attachment[] = [];
  const rows: ChangeRow[] = [];
  files.forEach((f) => {
    seq += 1;
    const attachment: Attachment = {
      id: `file-${seq}`,
      slug,
      kind: f.kind,
      fileName: f.fileName,
      caption: f.caption ?? '',
      timing: f.timing,
      src: f.src,
      by: SANDBOX_PEOPLE[state.settings.role].name,
      at: SANDBOX_TODAY,
    };
    seq += 1;
    const row = fileRow(state, slug, attachment, false, pending, seq);
    if (pending) {
      attachment.pending = 'add';
      attachment.changeId = row.id;
    }
    added.push(attachment);
    rows.push(row);
  });
  return { ...state, seq, files: { ...state.files, [slug]: [...filesOf(state, slug), ...added] }, changes: [...state.changes, ...rows] };
};

/** Add files from the project page. Staged for review when this seat's edits wait. */
export const addFiles = (slug: string, files: NewFile[]): void => {
  if (!files.length) return;
  write(withFiles(read(), slug, files, editsWaitForReview()));
};

/** Caption and timing are notes on a file, saved live and not logged. */
export const updateAttachment = (slug: string, id: string, patch: Pick<Partial<Attachment>, 'caption' | 'timing'>): void => {
  const state = read();
  write({ ...state, files: { ...state.files, [slug]: filesOf(state, slug).map((a) => (a.id === id ? { ...a, ...patch } : a)) } });
};

/** Remove a file — at once, or staged as a removal for a reviewer. */
export const removeAttachment = (slug: string, id: string): void => {
  const state = read();
  const file = filesOf(state, slug).find((a) => a.id === id);
  if (!file) return;
  const pending = editsWaitForReview();
  const seq = state.seq + 1;
  const row = fileRow(state, slug, file, true, pending, seq);
  const files = pending
    ? filesOf(state, slug).map((a) => (a.id === id ? { ...a, pending: 'remove' as const, changeId: row.id } : a))
    : filesOf(state, slug).filter((a) => a.id !== id);
  write({ ...state, seq, files: { ...state.files, [slug]: files }, changes: [...state.changes, row] });
};

// ---------------------------------------------------------------------------
// Committing an update
// ---------------------------------------------------------------------------
export interface UpdateEntry {
  targetId: string;
  /** The new raw value (already normalized). */
  to: string;
  source: ChangeSource;
}

/**
 * One commit: every changed value and every staged file, all or nothing — the
 * caller validates first. Returns how many landed live and how many are
 * waiting, so the screen can say which.
 */
export const commitUpdate = (slug: string, entries: UpdateEntry[], files: NewFile[] = []): { applied: number; pending: number } => {
  let state = read();
  const pending = editsWaitForReview();
  const who = SANDBOX_PEOPLE[state.settings.role].name;
  const values = { ...(state.values[slug] ?? {}) };
  const rows: ChangeRow[] = [];
  let seq = state.seq;
  entries.forEach((entry) => {
    const target = targetsFor(slug).find((t) => t.id === entry.targetId);
    if (!target) return;
    const from = values[target.id] ?? target.value;
    if (from === entry.to) return;
    seq += 1;
    rows.push({
      id: `local-${seq}`,
      slug,
      projectName: projectNameOf(slug),
      targetId: target.id,
      label: changeLabel(target),
      domain: domainOf(target),
      from,
      to: entry.to,
      fromLabel: formatTargetValue(target, from),
      toLabel: formatTargetValue(target, entry.to),
      by: who,
      at: SANDBOX_TODAY,
      source: entry.source,
      status: pending ? 'Pending' : 'Applied',
    });
    if (!pending) values[target.id] = entry.to;
  });
  state = { ...state, seq, values: { ...state.values, [slug]: values }, changes: [...state.changes, ...rows] };
  state = withFiles(state, slug, files, pending);
  write(state);
  const count = rows.length + files.length;
  return pending ? { applied: 0, pending: count } : { applied: count, pending: 0 };
};

// ---------------------------------------------------------------------------
// Reading and resolving the log
// ---------------------------------------------------------------------------
/** Newest first. Pass a slug for one project's log, nothing for the workspace's. */
export const changesFor = (slug?: string): ChangeRow[] =>
  read()
    .changes.filter((c) => !slug || c.slug === slug)
    .map((c, i) => ({ c, i }))
    .sort((a, b) => b.c.at.localeCompare(a.c.at) || b.i - a.i)
    .map(({ c }) => c);

export const pendingChanges = (slug?: string): ChangeRow[] => changesFor(slug).filter((c) => c.status === 'Pending');

const isFileRow = (row: ChangeRow): boolean => row.domain === 'photo' || row.domain === 'document';

/**
 * The field has moved since this was proposed, so "From" no longer says what
 * approving would overwrite. Still approvable — the reviewer decides.
 */
export const isStale = (row: ChangeRow): boolean => {
  if (row.status !== 'Pending' || isFileRow(row)) return false;
  const target = targetsFor(row.slug).find((t) => t.id === row.targetId);
  return !!target && currentValue(row.slug, target) !== row.from;
};

/** An applied or approved value change can be put back; a file change cannot. */
export const canRevert = (row: ChangeRow): boolean => (row.status === 'Applied' || row.status === 'Approved') && !isFileRow(row) && !row.revertOf;

const resolve = (id: string, status: 'Approved' | 'Rejected'): void => {
  const state = read();
  const row = state.changes.find((c) => c.id === id);
  if (!row || row.status !== 'Pending') return;
  const who = SANDBOX_PEOPLE[state.settings.role].name;
  const changes = state.changes.map((c) => (c.id === id ? { ...c, status, resolvedBy: who, resolvedAt: SANDBOX_TODAY } : c));
  let values = state.values;
  let files = state.files;
  if (isFileRow(row)) {
    const fileId = row.targetId.replace(/^file:/, '');
    const adding = row.to !== '';
    // Approve an add or reject a removal: the file stays, no longer pending.
    // Reject an add or approve a removal: the file goes.
    const keep = adding === (status === 'Approved');
    const list = filesOf(state, row.slug);
    files = {
      ...files,
      [row.slug]: keep ? list.map((a) => (a.id === fileId ? { ...a, pending: undefined, changeId: undefined } : a)) : list.filter((a) => a.id !== fileId),
    };
  } else if (status === 'Approved') {
    values = { ...values, [row.slug]: { ...(values[row.slug] ?? {}), [row.targetId]: row.to } };
  }
  write({ ...state, changes, values, files });
};

export const approveChange = (id: string): void => resolve(id, 'Approved');
export const rejectChange = (id: string): void => resolve(id, 'Rejected');

/** Put an applied change back: the old value is written and a new row records it. */
export const revertChange = (id: string): void => {
  const state = read();
  const row = state.changes.find((c) => c.id === id);
  if (!row || !canRevert(row)) return;
  const who = SANDBOX_PEOPLE[state.settings.role].name;
  const seq = state.seq + 1;
  const back: ChangeRow = {
    ...row,
    id: `local-${seq}`,
    from: row.to,
    to: row.from,
    fromLabel: row.toLabel,
    toLabel: row.fromLabel,
    by: who,
    at: SANDBOX_TODAY,
    source: 'Direct',
    status: 'Applied',
    resolvedBy: undefined,
    resolvedAt: undefined,
    revertOf: row.id,
  };
  write({
    ...state,
    seq,
    values: { ...state.values, [row.slug]: { ...(state.values[row.slug] ?? {}), [row.targetId]: row.from } },
    changes: [...state.changes.map((c) => (c.id === id ? { ...c, status: 'Reverted' as const, resolvedBy: who, resolvedAt: SANDBOX_TODAY } : c)), back],
  });
};

/** "30 September 2026" from an ISO day. */
export const dayLabel = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
