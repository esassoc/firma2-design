// The intake form's rules and its browser-local store — THE ONE SEAM every
// intake surface reads through: the builder (Workspace settings › Intake
// form), the member's New project and intake pages, and the steward's
// Proposals queue. Spec: .scratch/project-intake/spec.md.
//
// THE RULES ARE PURE FUNCTIONS OF (form, answers). Which blocks show, which
// answers are dropped, what is still missing, what may be removed or placed —
// none of it reads storage, so the builder's preview and the member's page
// cannot disagree about a form.
//
// TWO COPIES OF THE FORM. The builder edits a working copy that saves as you
// go; Publish copies it over the published one, which is the only copy
// members fill. Drafts follow the published form as it changes — they store
// answers, never a snapshot of the form.
//
// Same honesty terms as every other draft store here (src/lib/measure-draft.ts):
// localStorage, one browser, no backend. The versioned keys are the escape hatch.

import { BUILTINS, DEFAULT_FORM_TITLE, SEED_FORM, SEED_PROPOSALS, STANDARD_FORM, builtin } from '../data/firma2-intake';
import type { Answers, Block, BuiltinKey, Condition, IntakeForm, IntakeProject, IntakeStatus, QuestionBlock, Screen } from '../data/firma2-intake';
import type { FieldDefinition } from '../data/firma2-project-types';
import { allFields, updateField } from './project-type-draft';
import { PROJECT_TYPES } from '../data/firma2-project-types';
import { CLASSIFICATIONS } from '../data/firma2-classifications';
import { TAGS } from '../data/firma2-tags';
import { organizations, users } from '../data/firma2-directory';
import { planIncludes } from './workspace-plan';

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

export const isQuestion = (block: Block): block is QuestionBlock => block.type !== 'text';

/** Where a question's answer is kept: the built-in's key, or the field's. */
export const answerKey = (block: QuestionBlock): string => (block.type === 'builtin' ? block.key : `field:${block.fieldId}`);

export const allBlocks = (form: IntakeForm): Block[] => form.screens.flatMap((s) => s.blocks);

export const findBlock = (form: IntakeForm, id: string): Block | undefined => allBlocks(form).find((b) => b.id === id);

export const screenOf = (form: IntakeForm, blockId: string): Screen | undefined => form.screens.find((s) => s.blocks.some((b) => b.id === blockId));

export const isLocked = (block: Block): boolean => block.type === 'builtin' && builtin(block.key).locked;

/** The built-ins already on the form. Each may appear once. */
export const builtinsInForm = (form: IntakeForm): Set<BuiltinKey> =>
  new Set(allBlocks(form).flatMap((b) => (b.type === 'builtin' ? [b.key] : [])));

/** Is the answer there at all? An empty list or blank string is not an answer. */
export const isAnswered = (value: unknown): boolean => {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * The answers a block can be conditioned on, or null when it cannot be a
 * source. Sources are yes/no and choice questions: what a single "is / is any
 * of" can be read against.
 */
export const conditionOptions = (block: Block, fields: FieldDefinition[] = allFields()): string[] | null => {
  if (block.type === 'text') return null;
  if (block.type === 'builtin') {
    if (block.key === 'projectType') return BUILTIN_OPTIONS.projectType();
    if (block.key === 'classifications') return BUILTIN_OPTIONS.classifications();
    return null;
  }
  const field = fields.find((f) => f.id === block.fieldId);
  if (!field) return null;
  if (field.kind === 'yes-no') return ['Yes', 'No'];
  if (field.kind === 'choice' || field.kind === 'multi-choice') return field.options ?? [];
  return null;
};

/** Earlier blocks this one may be conditioned on — never itself, never a later one. */
export const conditionSources = (form: IntakeForm, targetId: string, fields: FieldDefinition[] = formFields(form)): QuestionBlock[] => {
  const screenIndex = form.screens.findIndex((s) => s.id === targetId);
  const blocks = allBlocks(form);
  // A screen may depend on anything on the screens before it.
  const cut = screenIndex !== -1 ? form.screens.slice(0, screenIndex).flatMap((s) => s.blocks).length : blocks.findIndex((b) => b.id === targetId);
  return blocks.slice(0, Math.max(cut, 0)).filter((b): b is QuestionBlock => isQuestion(b) && conditionOptions(b, fields) !== null);
};

const holds = (when: Condition, answers: Answers, form: IntakeForm): boolean => {
  const source = findBlock(form, when.source);
  // A condition on a question that has left the form no longer hides anything.
  if (!source || !isQuestion(source)) return true;
  const value = answers[answerKey(source)];
  const picked = Array.isArray(value) ? value.map(String) : isAnswered(value) ? [String(value)] : [];
  return picked.some((v) => when.values.includes(v));
};

/**
 * Screens shown for these answers, each holding only its shown blocks. Read
 * in one pass in form order: a condition is tested against the answers of
 * earlier questions that are themselves shown, so a question whose source is
 * hidden is hidden too. Sources are always earlier, so one pass is enough.
 */
export const visibleScreens = (form: IntakeForm, answers: Answers): Screen[] => {
  const counted: Answers = {};
  const shown: Screen[] = [];
  for (const screen of form.screens) {
    if (screen.when && !holds(screen.when, counted, form)) continue;
    const blocks = screen.blocks.filter((b) => {
      const visible = !b.when || holds(b.when, counted, form);
      if (visible && isQuestion(b)) counted[answerKey(b)] = answers[answerKey(b)];
      return visible;
    });
    shown.push({ ...screen, blocks });
  }
  return shown;
};

export const visibleQuestions = (form: IntakeForm, answers: Answers): QuestionBlock[] =>
  visibleScreens(form, answers).flatMap((s) => s.blocks.filter(isQuestion));

/** Answers with every hidden question's answer dropped. Keys the form never asks are kept. */
export const clearHidden = (form: IntakeForm, answers: Answers): Answers => {
  const shown = new Set(visibleQuestions(form, answers).map(answerKey));
  const asked = new Set(allBlocks(form).filter(isQuestion).map(answerKey));
  return Object.fromEntries(Object.entries(answers).filter(([k]) => shown.has(k) || !asked.has(k)));
};

/** Required questions shown and not yet answered, in form order. */
export const missingRequired = (form: IntakeForm, answers: Answers): QuestionBlock[] =>
  visibleQuestions(form, answers).filter((b) => b.required && !isAnswered(answers[answerKey(b)]));

export const canSubmit = (form: IntakeForm, answers: Answers): boolean => missingRequired(form, answers).length === 0;

// ---------------------------------------------------------------------------
// Edits — pure transforms the builder applies to the working copy
// ---------------------------------------------------------------------------

let counter = 0;
export const newId = (prefix: string): string => `${prefix}-${Date.now().toString(36)}${(counter++).toString(36)}`;

const mapScreens = (form: IntakeForm, fn: (s: Screen) => Screen): IntakeForm => ({ ...form, screens: form.screens.map(fn) });

/** Insert after `afterId`, or at the end of `screenId`, or at the end of the last screen. */
export const insertBlock = (form: IntakeForm, block: Block, at: { afterId?: string; screenId?: string; index?: number } = {}): IntakeForm => {
  if (block.type === 'builtin' && builtinsInForm(form).has(block.key)) return form;
  const target = at.afterId ? screenOf(form, at.afterId) : form.screens.find((s) => s.id === at.screenId) ?? form.screens[form.screens.length - 1];
  if (!target) return form;
  return mapScreens(form, (s) => {
    if (s.id !== target.id) return s;
    const blocks = [...s.blocks];
    const i = at.afterId ? blocks.findIndex((b) => b.id === at.afterId) + 1 : at.index ?? blocks.length;
    blocks.splice(i, 0, block);
    return { ...s, blocks };
  });
};

export const updateBlock = (form: IntakeForm, id: string, patch: Partial<Block>): IntakeForm =>
  mapScreens(form, (s) => ({ ...s, blocks: s.blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)) }));

/**
 * Remove a block. The locked built-ins stay. Conditions that read it are
 * dropped with it, so nothing is left hidden behind a question nobody asks.
 * The field and any answers already given are untouched.
 */
export const removeBlock = (form: IntakeForm, id: string): IntakeForm => {
  const block = findBlock(form, id);
  if (!block || isLocked(block)) return form;
  const unlink = <T extends { when?: Condition }>(x: T): T => (x.when?.source === id ? { ...x, when: undefined } : x);
  return {
    ...form,
    screens: form.screens.map((s) => unlink({ ...s, blocks: s.blocks.filter((b) => b.id !== id).map(unlink) })),
  };
};

/** Lay the blocks out again from the order the canvas reports: screen id → block ids. */
export const reorder = (form: IntakeForm, layout: Record<string, string[]>): IntakeForm => {
  const byId = new Map(allBlocks(form).map((b) => [b.id, b]));
  return dropBrokenConditions(
    mapScreens(form, (s) => ({ ...s, blocks: (layout[s.id] ?? s.blocks.map((b) => b.id)).map((id) => byId.get(id)).filter((b): b is Block => !!b) })),
  );
};

// After a move a condition may point at a question that now comes later. It
// is dropped rather than kept dangling: a rule the builder would not let you
// write must not survive a drag.
const dropBrokenConditions = (form: IntakeForm): IntakeForm => {
  const fields = formFields(form);
  const ok = (targetId: string, when?: Condition) => !when || conditionSources(form, targetId, fields).some((b) => b.id === when.source);
  return {
    ...form,
    screens: form.screens.map((s) => ({
      ...s,
      when: ok(s.id, s.when) ? s.when : undefined,
      blocks: s.blocks.map((b) => (ok(b.id, b.when) ? b : { ...b, when: undefined })),
    })),
  };
};

/**
 * Lay the form out again from the canvas's flat order: one list of screens,
 * each with the block ids it now holds. Screens missing from `order` are kept
 * in place; the builder always reports every screen.
 */
export const relayout = (form: IntakeForm, order: { screenId: string; blockIds: string[] }[]): IntakeForm => {
  const byId = new Map(allBlocks(form).map((b) => [b.id, b]));
  const screens = order
    .map(({ screenId, blockIds }) => {
      const s = form.screens.find((x) => x.id === screenId);
      return s ? { ...s, blocks: blockIds.map((id) => byId.get(id)).filter((b): b is Block => !!b) } : undefined;
    })
    .filter((s): s is Screen => !!s);
  return dropBrokenConditions({ ...form, screens });
};

/**
 * A screen break placed inside a screen: the blocks after the break move to a
 * new screen that follows it. `afterId` is the block the break goes under;
 * otherwise it goes at `index` in `screenId`, or at its end (an empty screen).
 */
export const splitScreen = (form: IntakeForm, at: { afterId?: string; screenId?: string; index?: number }): { form: IntakeForm; screen: Screen } => {
  const host = at.afterId ? screenOf(form, at.afterId) : form.screens.find((s) => s.id === at.screenId) ?? form.screens[form.screens.length - 1];
  const i = !host ? 0 : at.afterId ? host.blocks.findIndex((b) => b.id === at.afterId) + 1 : at.index ?? host.blocks.length;
  const screen: Screen = { id: newId('s'), title: '', blocks: host ? host.blocks.slice(i) : [] };
  const screens = form.screens.flatMap((s) => (s.id === host?.id ? [{ ...s, blocks: s.blocks.slice(0, i) }, screen] : [s]));
  return { form: dropBrokenConditions({ ...form, screens }), screen };
};

/**
 * A copy of a block, placed right below it. A standard question appears once,
 * so it is never copied. A custom question gets a new field of the same kind
 * and choices — two questions must never share one answer by accident. The
 * condition is copied too.
 */
export const duplicateBlock = (form: IntakeForm, id: string): { form: IntakeForm; block?: Block } => {
  const block = findBlock(form, id);
  if (!block || block.type === 'builtin') return { form };
  if (block.type === 'text') {
    const copy: Block = { ...block, id: newId('t') };
    return { form: insertBlock(form, copy, { afterId: id }), block: copy };
  }
  const field = formFields(form).find((f) => f.id === block.fieldId);
  if (!field) return { form };
  const fieldId = nextFieldId(form, block.label || field.label);
  const staged = stageField(form, { ...field, id: fieldId, label: `${field.label} (copy)`, options: field.options ? [...field.options] : undefined });
  const copy: Block = { ...block, id: newId('q'), fieldId, fieldNamed: undefined };
  return { form: insertBlock(staged, copy, { afterId: id }), block: copy };
};

export const addScreen = (form: IntakeForm, afterScreenId?: string): { form: IntakeForm; screen: Screen } => {
  const screen: Screen = { id: newId('s'), title: '', blocks: [] };
  const screens = [...form.screens];
  const i = afterScreenId ? screens.findIndex((s) => s.id === afterScreenId) + 1 : screens.length;
  screens.splice(i, 0, screen);
  return { form: { ...form, screens }, screen };
};

export const updateScreen = (form: IntakeForm, id: string, patch: Partial<Screen>): IntakeForm =>
  mapScreens(form, (s) => (s.id === id ? { ...s, ...patch } : s));

export const moveScreen = (form: IntakeForm, id: string, by: -1 | 1): IntakeForm => {
  const screens = [...form.screens];
  const i = screens.findIndex((s) => s.id === id);
  const j = i + by;
  if (i === -1 || j < 0 || j >= screens.length) return form;
  [screens[i], screens[j]] = [screens[j], screens[i]];
  return dropBrokenConditions({ ...form, screens });
};

/**
 * Remove a screen. Its blocks move to the screen before it (or after, for the
 * first), so the locked built-ins can never be deleted by taking their screen.
 * The last screen cannot be removed.
 */
export const removeScreen = (form: IntakeForm, id: string): IntakeForm => {
  if (form.screens.length < 2) return form;
  const i = form.screens.findIndex((s) => s.id === id);
  if (i === -1) return form;
  const heir = form.screens[i === 0 ? 1 : i - 1];
  const moving = form.screens[i].blocks;
  const screens = form.screens
    .filter((s) => s.id !== id)
    .map((s) => (s.id === heir.id ? { ...s, blocks: i === 0 ? [...moving, ...s.blocks] : [...s.blocks, ...moving] } : s));
  return dropBrokenConditions({ ...form, screens });
};

// ---------------------------------------------------------------------------
// Built-in choices
// ---------------------------------------------------------------------------


export const BUILTIN_OPTIONS = {
  projectType: (): string[] => PROJECT_TYPES.map((t) => t.name),
  classifications: (): string[] => CLASSIFICATIONS.map((c) => c.name),
  leadOrganization: (): string[] => [...new Set(organizations.map((o) => o.name))].sort(),
  tags: (): string[] => TAGS.map((t) => t.name),
  contacts: (): string[] => [...new Set(users.map((u) => u.name))].sort(),
};

/** The closed list a choice-style question picks from, built-in or custom. */
export const choicesFor = (block: QuestionBlock, fields: FieldDefinition[] = allFields()): string[] => {
  if (block.type === 'builtin') {
    const fn = (BUILTIN_OPTIONS as Record<string, (() => string[]) | undefined>)[block.key];
    return fn ? fn() : [];
  }
  const field = fields.find((f) => f.id === block.fieldId);
  if (field?.kind === 'yes-no') return ['Yes', 'No'];
  return field?.options ?? [];
};

// ---------------------------------------------------------------------------
// Staged fields — custom-field changes waiting for Publish
// ---------------------------------------------------------------------------

/** The catalog as this form sees it: every field, with its staged changes over them. */
export const formFields = (form: IntakeForm): FieldDefinition[] => {
  const staged = form.fields ?? {};
  const catalog = allFields();
  const ids = new Set(catalog.map((f) => f.id));
  return [...catalog.map((f) => staged[f.id] ?? f), ...Object.values(staged).filter((f) => !ids.has(f.id))];
};

/** A field the catalog does not have yet: created by this form, at its next publish. */
export const isNewField = (id: string): boolean => !allFields().some((f) => f.id === id);

export const stageField = (form: IntakeForm, field: FieldDefinition): IntakeForm => ({ ...form, fields: { ...form.fields, [field.id]: field } });

export const unstageField = (form: IntakeForm, id: string): IntakeForm => {
  const { [id]: _gone, ...rest } = form.fields ?? {};
  return { ...form, fields: rest };
};

/** An id for a new field, clear of the catalog and of anything already staged. */
export const nextFieldId = (form: IntakeForm, label: string): string => {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'field';
  const taken = new Set(formFields(form).map((f) => f.id));
  let id = `local-${slug}`;
  let n = 2;
  while (taken.has(id)) id = `local-${slug}-${n++}`;
  return id;
};

export { BUILTINS };

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

// v2: the sample form was cleared to a blank start (2026-10-19).
const FORM_KEY = 'firma2:intake-form:v2';
const PROJECTS_KEY = 'firma2:intake-projects:v1';

interface FormStore {
  working: IntakeForm;
  published: IntakeForm;
  publishedAt: string | null;
  /** Whether the working copy differs from the published one. */
  dirty: boolean;
}

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

const readJson = <T>(key: string): T | null => {
  try {
    const raw = storage()?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeJson = (key: string, value: unknown): void => {
  try {
    storage()?.setItem(key, JSON.stringify(value));
  } catch {
    // Unsaved in this browser; the page still shows the change.
  }
};

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));

const SEED_PUBLISHED_AT = '2026-10-02T17:30:00Z';

// A form saved before forms had names gets the default one, and a built-in
// always carries its attribute's own name — the builder cannot rename one, and
// a form saved before that rule is brought back in line here.
const named = (f: IntakeForm): IntakeForm => ({
  ...f,
  fields: f.fields ?? {},
  title: typeof f.title === 'string' ? f.title : DEFAULT_FORM_TITLE,
  screens: f.screens.map((s) => ({ ...s, blocks: s.blocks.map((b) => (b.type === 'builtin' ? { ...b, label: builtin(b.key).label } : b)) })),
});

export const readFormStore = (): FormStore => {
  const stored = readJson<FormStore>(FORM_KEY);
  if (!stored) return { working: clone(SEED_FORM), published: clone(SEED_FORM), publishedAt: SEED_PUBLISHED_AT, dirty: false };
  return { ...stored, working: named(stored.working), published: named(stored.published) };
};

/** Save the builder's working copy. Members do not see it until it is published. */
export const saveWorking = (working: IntakeForm): FormStore => {
  const store = { ...readFormStore(), working, dirty: true };
  writeJson(FORM_KEY, store);
  return store;
};

/**
 * Make the working copy live. Its staged field changes go into the catalog
 * first — new fields appear in Custom fields, edits reach every project — and
 * then the form itself, with nothing left staged.
 */
export const publish = (): FormStore => {
  const current = readFormStore();
  // Blank choices (a new question's unfilled "Choice 1") never reach the catalog.
  Object.values(current.working.fields ?? {}).forEach((f) => updateField(f.options ? { ...f, options: f.options.filter((o) => o.trim()) } : f));
  const working: IntakeForm = { ...current.working, fields: {} };
  const store = { ...current, working, published: clone(working), publishedAt: new Date().toISOString(), dirty: false };
  writeJson(FORM_KEY, store);
  return store;
};

/** The form members fill — or the working copy, on a preview. A free workspace
 * has no customization (it needs Agency), so its members always get the standard form. */
export const formFor = (preview: boolean): IntakeForm => {
  if (!planIncludes('agency')) return clone(STANDARD_FORM);
  const store = readFormStore();
  return preview ? store.working : store.published;
};

export const isFormKey = (key: string | null): boolean => key === FORM_KEY;

// ---- intake projects -----------------------------------------------------

export const readIntakeProjects = (): IntakeProject[] => readJson<IntakeProject[]>(PROJECTS_KEY) ?? clone(SEED_PROPOSALS);

const writeIntakeProjects = (list: IntakeProject[]): void => writeJson(PROJECTS_KEY, list);

export const getIntakeProject = (id: string): IntakeProject | undefined => readIntakeProjects().find((p) => p.id === id);

export const saveIntakeProject = (project: IntakeProject): void => {
  const list = readIntakeProjects();
  const i = list.findIndex((p) => p.id === project.id);
  if (i === -1) list.push(project);
  else list[i] = project;
  writeIntakeProjects(list);
};

export const createDraft = (answers: Answers, createdBy: string): IntakeProject => {
  const project: IntakeProject = { id: newId('p'), status: 'draft', answers, createdBy, createdAt: new Date().toISOString() };
  saveIntakeProject(project);
  return project;
};

/** Submit, with hidden answers dropped. Refuses while anything required is missing. */
export const submitProject = (id: string, form: IntakeForm): IntakeProject | undefined => {
  const p = getIntakeProject(id);
  if (!p || !canSubmit(form, p.answers)) return undefined;
  const next: IntakeProject = { ...p, answers: clearHidden(form, p.answers), status: 'submitted', submittedAt: new Date().toISOString(), returnComment: undefined };
  saveIntakeProject(next);
  return next;
};

export const decide = (id: string, status: Extract<IntakeStatus, 'approved' | 'returned' | 'deferred'>, by: string, comment?: string): IntakeProject | undefined => {
  const p = getIntakeProject(id);
  if (!p) return undefined;
  const next: IntakeProject = { ...p, status, decidedAt: new Date().toISOString(), decidedBy: by, returnComment: status === 'returned' ? comment : undefined };
  saveIntakeProject(next);
  return next;
};

export const STATUS_STAGE: Record<IntakeStatus, string> = {
  draft: 'Proposal',
  submitted: 'Proposal',
  returned: 'Proposal',
  approved: 'Planning & Design',
  deferred: 'Deferred',
};

export const projectName = (p: IntakeProject): string => String(p.answers.projectName ?? '') || 'Untitled project';
