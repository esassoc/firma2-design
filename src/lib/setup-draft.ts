// Local draft storage for tenant setup.
//
// Same contract as measure-draft.ts: THERE IS NO BACKEND. This spoke is a static
// build, so "saving" is localStorage in one browser. Setup is the argument that
// a tenant is stood up over days, from bookmarked URLs, by more than one person —
// a prototype that forgot everything on reload could not show it. The demo says
// plainly that drafts live in this browser only.
//
// PATCHES OVER SEED. Storage holds only what the admin decided: which documents
// were uploaded, and each organization's status. Journey statuses are DERIVED
// from those at read time (see journeyStatuses), never stored, so the hub and
// the map can never disagree with the records beneath them.
//
// VERSIONED KEY. Bump KEY_VERSION when the stored shape changes; old entries are
// ignored rather than parsed into something that throws at render.

import {
  askExamples,
  candidateCountByJourney,
  classificationFromFields,
  fundingSourceFromFields,
  intentQuestionById,
  intentQuestionsFor,
  journeys,
  journeysFromIntent,
  organizationFromFreeText,
  personFromFields,
  programShapeEvidence,
  sampleDocuments,
  stageOptions,
  suggestedClassifications,
  suggestedFundingSources,
  suggestedOrganizations,
  suggestedPeople,
  suggestedSpatialAreas,
  spatialAreaFromFields,
  stewardshipFromIntent,
  suggestedProjectNoun,
  suggestedSiteVisibility,
  tenantAppearanceDefaults,
  tenantColors,
  tenantOrganization,
} from '../data/firma2-setup';
import type {
  ClassificationFields,
  ClassificationLimit,
  ClassificationRecord,
  ClassificationStatus,
  FundingSource,
  FundingSourceFields,
  FundingSourceStatus,
  ImportProject,
  IntentMilestone,
  IntentOption,
  JourneyKey,
  JourneyStatus,
  Organization,
  OrganizationStatus,
  PersonFields,
  PersonRecord,
  PersonRole,
  PersonStatus,
  ProjectImportStatus,
  ProjectNoun,
  SiteVisibility,
  Stewardship,
  BoundarySource,
  OutsidePolicy,
  SpatialAreaFields,
  SpatialAreaRecord,
  SpatialAreaStatus,
  StageOption,
  StageStatus,
} from '../data/firma2-setup';
import { projects, projectSlug } from '../data/firma2-projects';
import { directoryById } from '../data/firma2-org-directory';
import { nearestTenantColor } from './tenant-swatch';

// Still v1 after the funding fields landed (2026-09-18): every addition is a new
// key with a default in EMPTY, and readSetupDraft spreads EMPTY under whatever
// was stored, so a v1 draft written before them reads back whole. A bump is for
// a key whose MEANING changed, because that is the case a default cannot repair.
const KEY_VERSION = 'v1';
const KEY = `firma2:setup-draft:${KEY_VERSION}`;

export interface SetupDraft {
  /** True once the admin has uploaded documents — the canned extraction has run. */
  documentsUploaded: boolean;
  /** Status per organization id, for every organization the admin has touched. */
  organizationStatus: Record<string, OrganizationStatus>;
  /** Organizations minted in this browser (from Ask or by hand). Seed organizations are not stored. */
  addedOrganizations: Organization[];
  /** Intent answers: question id to the option ids chosen. A question the admin has not answered is absent. */
  intent: Record<string, string[]>;
  /**
   * Options typed into a question's "in your own words" field, by question id.
   * Built-in options are never stored — only what this browser added.
   */
  customIntentOptions: Record<string, IntentOption[]>;
  /** Status per funding source id, for every source the admin has touched. */
  fundingSourceStatus: Record<string, FundingSourceStatus>;
  /** Funding sources typed into the create dialog in this browser. Seed suggestions are not stored. */
  addedFundingSources: FundingSource[];
  /** Status per project slug, for every tracker row the admin has answered on the import screen. */
  projectStatus: Record<string, ProjectImportStatus>;
  /** Status per stage id, for every fixed stage the admin has answered. Patches over stageOptions. */
  stageStatus: Record<string, StageStatus>;
  /** Where new projects start: one of the used stages. Null until answered. */
  defaultStage: StageOption['id'] | null;
  /** Status per classification id, for every classification the admin has touched. */
  classificationStatus: Record<string, ClassificationStatus>;
  /** Classifications typed into the create dialog in this browser. Seed suggestions are not stored. */
  addedClassifications: ClassificationRecord[];
  /** How many classifications a project may carry. Null until answered. */
  classificationLimit: ClassificationLimit | null;
  /** Status per spatial area id, for every area the admin has touched. */
  spatialAreaStatus: Record<string, SpatialAreaStatus>;
  /** Areas typed into the add screen in this browser. Seed suggestions are not stored. */
  addedSpatialAreas: SpatialAreaRecord[];
  /** Where the program's boundaries come from. Null until answered. */
  boundarySource: BoundarySource | null;
  /** What happens to a project outside every area. Null until answered. */
  outsidePolicy: OutsidePolicy | null;
  /** dbo.Tenant display name. Null until answered; keeping the default writes the default. */
  tenantName: string | null;
  /** dbo.Tenant short name. Written with tenantName by setTenantNames. */
  tenantShortName: string | null;
  /** A replacement logo, by file name only: the mock never stores bytes. Null is the directory logo. */
  tenantLogoFileName: string | null;
  /** The FieldDefinition label for "Project". Null until answered; keeping "Project" writes defaultProjectNoun. */
  projectNoun: ProjectNoun | null;
  /** A tenantColors id. Null until answered. */
  tenantColorId: string | null;
  /** Who can see the site. Null until answered. */
  siteVisibility: SiteVisibility | null;
  /** Status per person id, for every person the admin has touched. */
  personStatus: Record<string, PersonStatus>;
  /** People typed into the add screen in this browser. Seed suggestions are not stored. */
  addedPeople: PersonRecord[];
  /** Role overrides per person id; patches over each record's role. */
  personRole: Record<string, PersonRole>;
  /** Whether partner organizations edit their own projects. Null until answered. */
  stewardship: Stewardship | null;
  /**
   * True once the measures milestone is done. Mission 6 owns that walk; this is
   * the one bit it writes back so the hub can count it. False on every draft
   * written before it existed, because EMPTY spreads under the stored shape.
   */
  measuresComplete: boolean;
}

const EMPTY: SetupDraft = {
  documentsUploaded: false,
  organizationStatus: {},
  addedOrganizations: [],
  intent: {},
  customIntentOptions: {},
  fundingSourceStatus: {},
  addedFundingSources: [],
  projectStatus: {},
  stageStatus: {},
  defaultStage: null,
  classificationStatus: {},
  addedClassifications: [],
  classificationLimit: null,
  spatialAreaStatus: {},
  addedSpatialAreas: [],
  boundarySource: null,
  outsidePolicy: null,
  tenantName: null,
  tenantShortName: null,
  tenantLogoFileName: null,
  projectNoun: null,
  tenantColorId: null,
  siteVisibility: null,
  personStatus: {},
  addedPeople: [],
  personRole: {},
  stewardship: null,
  measuresComplete: false,
};

/** SSR-safe: localStorage does not exist during `astro build`, and Safari private mode throws on access. */
const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

export const readSetupDraft = (): SetupDraft => {
  const store = storage();
  if (!store) return { ...EMPTY };
  const raw = store.getItem(KEY);
  if (!raw) return { ...EMPTY };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...EMPTY };
    return { ...EMPTY, ...(parsed as Partial<SetupDraft>) };
  } catch {
    return { ...EMPTY };
  }
};

/** Returns false when the browser is blocking storage — the one failure the admin cannot see, so callers should say so once. */
export const writeSetupDraft = (draft: SetupDraft): boolean => {
  const store = storage();
  if (!store) return false;
  try {
    store.setItem(KEY, JSON.stringify(draft));
    document.dispatchEvent(new CustomEvent('setup-draft-change', { detail: draft }));
    return true;
  } catch {
    return false;
  }
};

export const clearSetupDraft = (): void => {
  storage()?.removeItem(KEY);
  document.dispatchEvent(new CustomEvent('setup-draft-change', { detail: { ...EMPTY } }));
};

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export const markDocumentsUploaded = (): boolean => writeSetupDraft({ ...readSetupDraft(), documentsUploaded: true });

/**
 * The documents that named these records, in upload order, for the line under a
 * picker's prompt ("Named in A, B, and C."). A record with no source document,
 * one typed by hand, contributes nothing.
 */
export const sourceDocumentNames = (records: readonly { sourceDocumentId?: string }[]): string[] => {
  const ids = new Set(records.map((record) => record.sourceDocumentId).filter((id): id is string => Boolean(id)));
  return sampleDocuments.filter((document) => ids.has(document.id)).map((document) => document.name);
};

// ---------------------------------------------------------------------------
// Intent
// ---------------------------------------------------------------------------

/** Records the options chosen for one question. An empty choice removes the answer. */
export const setIntentAnswer = (questionId: string, optionIds: string[]): boolean => {
  const draft = readSetupDraft();
  const intent = { ...draft.intent };
  if (optionIds.length) intent[questionId] = optionIds;
  else delete intent[questionId];
  return writeSetupDraft({ ...draft, intent });
};

/**
 * Every option a question can show: the authored ones first, then the ones typed
 * into its ask field in this browser. The chip group renders exactly this list,
 * so a typed answer is one more chip rather than a second kind of control.
 */
export const intentOptionsFor = (questionId: string, draft: SetupDraft = readSetupDraft()): IntentOption[] => [
  ...(intentQuestionById(questionId)?.options ?? []),
  ...(draft.customIntentOptions[questionId] ?? []),
];

/**
 * Turns typed text into one more option on a question, already chosen.
 *
 * The journeys are the UNION of everything the question's authored options light:
 * the choices could not be exhaustive, but they do bound what the question is
 * about, so an answer nobody anticipated opens the same milestones its siblings
 * would. That is deliberately generous — setup suggests, the admin confirms.
 *
 * Returns the option, or null when there is nothing to add: blank text, or a
 * label this question already carries.
 */
export const addIntentOption = (questionId: string, label: string): IntentOption | null => {
  const question = intentQuestionById(questionId);
  if (!question) return null;

  const text = label.trim().replace(/\s+/g, ' ');
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!slug) return null;
  const id = `custom-${slug}`;

  const draft = readSetupDraft();
  const custom = draft.customIntentOptions[questionId] ?? [];
  const taken = [...question.options, ...custom];
  if (taken.some((o) => o.id === id || o.label.toLowerCase() === text.toLowerCase())) return null;

  const option: IntentOption = {
    id,
    label: text,
    journeys: [...new Set(question.options.flatMap((o) => o.journeys))],
    phrase: text.toLowerCase(),
  };

  // A single-select question replaces its answer, exactly as picking another chip
  // would; a multi-select one gains a choice.
  const chosen = draft.intent[questionId] ?? [];
  writeSetupDraft({
    ...draft,
    customIntentOptions: { ...draft.customIntentOptions, [questionId]: [...custom, option] },
    intent: { ...draft.intent, [questionId]: question.multiple ? [...chosen, id] : [id] },
  });
  return option;
};

/** True once every question the given milestone asks has an answer. Start's by default. */
export const intentComplete = (draft: SetupDraft = readSetupDraft(), asks: IntentMilestone = 'documents'): boolean =>
  intentQuestionsFor(asks).every((q) => (draft.intent[q.id] ?? []).length > 0);

/** Number of the given milestone's questions answered, for its journey's count. Start's by default. */
export const intentAnswered = (draft: SetupDraft = readSetupDraft(), asks: IntentMilestone = 'documents'): number =>
  intentQuestionsFor(asks).filter((q) => (draft.intent[q.id] ?? []).length > 0).length;

// ---------------------------------------------------------------------------
// Organizations
// ---------------------------------------------------------------------------

/**
 * Every organization the tenant knows about, with the draft's statuses applied.
 * Document-sourced suggestions only appear once documents have been uploaded;
 * before that the cast is the tenant itself and whatever was added by hand.
 */
export const listOrganizations = (draft: SetupDraft = readSetupDraft()): Organization[] => {
  const seed = draft.documentsUploaded ? suggestedOrganizations : [];
  return [tenantOrganization, ...seed, ...draft.addedOrganizations].map((org) => ({
    ...org,
    status: draft.organizationStatus[org.id] ?? org.status,
  }));
};

export const setOrganizationStatuses = (statuses: Record<string, OrganizationStatus>): boolean => {
  const draft = readSetupDraft();
  return writeSetupDraft({ ...draft, organizationStatus: { ...draft.organizationStatus, ...statuses } });
};

export const setOrganizationStatus = (id: string, status: OrganizationStatus): boolean => {
  const draft = readSetupDraft();
  return writeSetupDraft({ ...draft, organizationStatus: { ...draft.organizationStatus, [id]: status } });
};

/** Adds organizations minted in this browser as `suggested`; ids already present are skipped. */
export const addOrganizations = (organizations: Organization[]): boolean => {
  const draft = readSetupDraft();
  const known = new Set(listOrganizations(draft).map((o) => o.id));
  const fresh = organizations.filter((o) => !known.has(o.id));
  return writeSetupDraft({ ...draft, addedOrganizations: [...draft.addedOrganizations, ...fresh] });
};

/**
 * Answers a typed request with proposed organizations. Canned: the first example
 * whose keywords appear in the text wins; otherwise one organization named after
 * the text itself. Proposals are returned, not stored — the caller adds the ones
 * the admin picks.
 */
export const proposeOrganizations = (text: string): Organization[] => {
  const lower = text.toLowerCase();
  const match = askExamples.find((ex) => ex.keywords.some((k) => lower.includes(k)));
  return match ? match.organizations.map((o) => ({ ...o })) : [organizationFromFreeText(text)];
};

// ---------------------------------------------------------------------------
// Funding sources
// ---------------------------------------------------------------------------

/**
 * Every funding source the tenant knows about, with the draft's statuses applied.
 * Same contract as listOrganizations: document suggestions appear once documents
 * are uploaded; sources added by hand are stored whole.
 */
export const listFundingSources = (draft: SetupDraft = readSetupDraft()): FundingSource[] => {
  const seed = draft.documentsUploaded ? suggestedFundingSources : [];
  return [...seed, ...draft.addedFundingSources].map((source) => ({
    ...source,
    status: draft.fundingSourceStatus[source.id] ?? source.status,
  }));
};

/** The sources a commitment can name. */
export const confirmedFundingSources = (draft: SetupDraft = readSetupDraft()): FundingSource[] =>
  listFundingSources(draft).filter((source) => source.status === 'confirmed');

/** Changes one source's status. */
export const setFundingSourceStatus = (id: string, status: FundingSourceStatus): boolean =>
  setFundingSourceStatuses({ [id]: status });

/**
 * Changes several statuses in one write: a stepped screen answers for its whole
 * cast at once (selected confirmed, the rest dismissed), and one write means one
 * `setup-draft-change` rather than a re-render per tile.
 */
export const setFundingSourceStatuses = (statuses: Record<string, FundingSourceStatus>): boolean => {
  const draft = readSetupDraft();
  return writeSetupDraft({ ...draft, fundingSourceStatus: { ...draft.fundingSourceStatus, ...statuses } });
};

/**
 * Adds a source typed into the create dialog, already confirmed. Returns null when
 * there is nothing to add: a blank name or organization, or a name the tenant
 * already tracks (FundingSourceName is unique within the tenant; compared without
 * case, and a dismissed suggestion does not count because it was never stored).
 */
export const addFundingSource = (fields: FundingSourceFields): FundingSource | null => {
  const source = fundingSourceFromFields(fields);
  if (!source.name || !source.organizationName) return null;

  const draft = readSetupDraft();
  const tracked = listFundingSources(draft).filter((s) => s.status !== 'dismissed');
  if (tracked.some((s) => s.name.toLowerCase() === source.name.toLowerCase())) return null;

  // A manual source removed earlier and typed in again gets its old id back; the
  // stale row and its `dismissed` status go, or the new row would read as removed.
  const added = draft.addedFundingSources.filter((s) => s.id !== source.id);
  const { [source.id]: _stale, ...fundingSourceStatus } = draft.fundingSourceStatus;
  writeSetupDraft({ ...draft, addedFundingSources: [...added, source], fundingSourceStatus });
  return source;
};


// ---------------------------------------------------------------------------
// Project stages
// ---------------------------------------------------------------------------

/**
 * The six fixed stages in STAGE_ORDER, with the draft's statuses applied. Unlike
 * the record milestones the cast does not wait for documents: the stages are
 * dbo.ProjectStage's global rows, not something the documents proposed. Only
 * their trackerStatuses (the provenance) come from the tracker.
 */
export const listStages = (draft: SetupDraft = readSetupDraft()): StageOption[] =>
  stageOptions.map((stage) => ({ ...stage, status: draft.stageStatus[stage.id] ?? stage.status }));

/** The stages the program uses, in order: the ones a project can be in, and a default can name. */
export const usedStages = (draft: SetupDraft = readSetupDraft()): StageOption[] =>
  listStages(draft).filter((stage) => stage.status === 'confirmed');

/**
 * Changes several statuses in one write. A stage dismissed while it is the
 * default takes the default with it in the same write, because new projects
 * cannot start in a stage the program does not use.
 */
export const setStageStatuses = (statuses: Record<string, StageStatus>): boolean => {
  const draft = readSetupDraft();
  const defaultStage = draft.defaultStage && statuses[draft.defaultStage] === 'dismissed' ? null : draft.defaultStage;
  return writeSetupDraft({ ...draft, stageStatus: { ...draft.stageStatus, ...statuses }, defaultStage });
};

/** Changes one stage's status, clearing the default when that stage is dismissed. */
export const setStageStatus = (id: string, status: StageStatus): boolean => setStageStatuses({ [id]: status });

/** True once the admin has answered for any stage. */
export const stagesAnswered = (draft: SetupDraft = readSetupDraft()): boolean =>
  listStages(draft).some((stage) => stage.status !== 'suggested');

/** Records where new projects start. Null clears the answer. */
export const setDefaultStage = (id: StageOption['id'] | null): boolean =>
  writeSetupDraft({ ...readSetupDraft(), defaultStage: id });

// ---------------------------------------------------------------------------
// Classifications
// ---------------------------------------------------------------------------

/**
 * Every classification the tenant knows about, with the draft's statuses
 * applied. Same contract as listFundingSources: document suggestions appear once
 * documents are uploaded; classifications added by hand are stored whole.
 */
export const listClassifications = (draft: SetupDraft = readSetupDraft()): ClassificationRecord[] => {
  const seed = draft.documentsUploaded ? suggestedClassifications : [];
  return [...seed, ...draft.addedClassifications].map((record) => ({
    ...record,
    status: draft.classificationStatus[record.id] ?? record.status,
  }));
};

/** The classifications a project can carry. */
export const confirmedClassifications = (draft: SetupDraft = readSetupDraft()): ClassificationRecord[] =>
  listClassifications(draft).filter((record) => record.status === 'confirmed');

/** Changes one classification's status. */
export const setClassificationStatus = (id: string, status: ClassificationStatus): boolean =>
  setClassificationStatuses({ [id]: status });

/** Changes several statuses in one write, one `setup-draft-change` for the set. */
export const setClassificationStatuses = (statuses: Record<string, ClassificationStatus>): boolean => {
  const draft = readSetupDraft();
  return writeSetupDraft({ ...draft, classificationStatus: { ...draft.classificationStatus, ...statuses } });
};

/**
 * Adds a classification typed into the create dialog, already confirmed. Returns
 * null when there is nothing to add: a blank name, or a name the tenant already
 * tracks (compared without case; a dismissed suggestion does not count, the same
 * rule as addFundingSource).
 */
export const addClassification = (fields: ClassificationFields): ClassificationRecord | null => {
  const record = classificationFromFields(fields);
  if (!record.name || record.id === 'manual-') return null;

  const draft = readSetupDraft();
  const tracked = listClassifications(draft).filter((c) => c.status !== 'dismissed');
  if (tracked.some((c) => c.name.toLowerCase() === record.name.toLowerCase())) return null;

  // A manual classification removed earlier and typed in again gets its old id
  // back; the stale row and its `dismissed` status go with it.
  const added = draft.addedClassifications.filter((c) => c.id !== record.id);
  const { [record.id]: _stale, ...classificationStatus } = draft.classificationStatus;
  writeSetupDraft({ ...draft, addedClassifications: [...added, record], classificationStatus });
  return record;
};

/** Records how many classifications a project may carry. Null clears the answer. */
export const setClassificationLimit = (limit: ClassificationLimit | null): boolean =>
  writeSetupDraft({ ...readSetupDraft(), classificationLimit: limit });

// ---------------------------------------------------------------------------
// Spatial areas
// ---------------------------------------------------------------------------

/**
 * Every area the tenant knows about, with the draft's statuses applied. Same
 * contract as listClassifications: document suggestions appear once documents
 * are uploaded; areas added by hand are stored whole.
 */
export const listSpatialAreas = (draft: SetupDraft = readSetupDraft()): SpatialAreaRecord[] => {
  const seed = draft.documentsUploaded ? suggestedSpatialAreas : [];
  return [...seed, ...draft.addedSpatialAreas].map((record) => ({
    ...record,
    status: draft.spatialAreaStatus[record.id] ?? record.status,
  }));
};

/** The areas a project can fall in. Empty is a valid answer: projects sit on a point. */
export const confirmedSpatialAreas = (draft: SetupDraft = readSetupDraft()): SpatialAreaRecord[] =>
  listSpatialAreas(draft).filter((record) => record.status === 'confirmed');

/** Changes one area's status. */
export const setSpatialAreaStatus = (id: string, status: SpatialAreaStatus): boolean =>
  setSpatialAreaStatuses({ [id]: status });

/** Changes several statuses in one write, one `setup-draft-change` for the set. */
export const setSpatialAreaStatuses = (statuses: Record<string, SpatialAreaStatus>): boolean => {
  const draft = readSetupDraft();
  return writeSetupDraft({ ...draft, spatialAreaStatus: { ...draft.spatialAreaStatus, ...statuses } });
};

/**
 * Adds an area typed into the add screen, already confirmed. Returns null on a
 * blank name or one the tenant already tracks (compared without case; a
 * dismissed suggestion does not count, the same rule as addClassification).
 */
export const addSpatialArea = (fields: SpatialAreaFields): SpatialAreaRecord | null => {
  const record = spatialAreaFromFields(fields);
  if (!record.name || record.id === 'manual-') return null;

  const draft = readSetupDraft();
  const tracked = listSpatialAreas(draft).filter((a) => a.status !== 'dismissed');
  if (tracked.some((a) => a.name.toLowerCase() === record.name.toLowerCase())) return null;

  // A manual area removed earlier and typed in again gets its old id back; the
  // stale row and its `dismissed` status go with it.
  const added = draft.addedSpatialAreas.filter((a) => a.id !== record.id);
  const { [record.id]: _stale, ...spatialAreaStatus } = draft.spatialAreaStatus;
  writeSetupDraft({ ...draft, addedSpatialAreas: [...added, record], spatialAreaStatus });
  return record;
};

/** Records where the program's boundaries come from. Null clears the answer. */
export const setBoundarySource = (source: BoundarySource | null): boolean =>
  writeSetupDraft({ ...readSetupDraft(), boundarySource: source });

/** Records what happens to a project outside every area. Null clears the answer. */
export const setOutsidePolicy = (policy: OutsidePolicy | null): boolean =>
  writeSetupDraft({ ...readSetupDraft(), outsidePolicy: policy });

// ---------------------------------------------------------------------------
// Names and appearance
// ---------------------------------------------------------------------------

/** Records both names in one write; they are one decision on one screen. */
export const setTenantNames = (name: string, shortName: string): boolean =>
  writeSetupDraft({
    ...readSetupDraft(),
    tenantName: name.trim().replace(/\s+/g, ' ') || null,
    tenantShortName: shortName.trim().replace(/\s+/g, ' ') || null,
  });

/** Records a replacement logo by file name. Null goes back to the directory logo. */
export const setTenantLogoFileName = (name: string | null): boolean =>
  writeSetupDraft({ ...readSetupDraft(), tenantLogoFileName: name });

/** Records what a project is called. Null clears the answer. */
export const setProjectNoun = (noun: ProjectNoun | null): boolean =>
  writeSetupDraft({ ...readSetupDraft(), projectNoun: noun });

/** Records the primary color, a tenantColors id. Null clears the answer. */
export const setTenantColor = (id: string | null): boolean =>
  writeSetupDraft({ ...readSetupDraft(), tenantColorId: id });

/** Records who can see the site. Null clears the answer. */
export const setSiteVisibility = (visibility: SiteVisibility | null): boolean =>
  writeSetupDraft({ ...readSetupDraft(), siteVisibility: visibility });

/** The four appearance decisions, each answered or not. The logo rides with the names. */
export const appearanceAnswered = (
  draft: SetupDraft = readSetupDraft(),
): { name: boolean; noun: boolean; color: boolean; visibility: boolean } => ({
  name: draft.tenantName !== null && draft.tenantShortName !== null,
  noun: draft.projectNoun !== null,
  color: draft.tenantColorId !== null,
  visibility: draft.siteVisibility !== null,
});

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

/**
 * Every person the tenant knows about, with the draft's statuses and role
 * overrides applied. Same contract as listClassifications: the report's staff
 * appear once documents are uploaded; people added by hand are stored whole.
 */
export const listPeople = (draft: SetupDraft = readSetupDraft()): PersonRecord[] => {
  const seed = draft.documentsUploaded ? suggestedPeople : [];
  return [...seed, ...draft.addedPeople].map((person) => ({
    ...person,
    role: draft.personRole[person.id] ?? person.role,
    status: draft.personStatus[person.id] ?? person.status,
  }));
};

/** The people the product will invite. */
export const confirmedPeople = (draft: SetupDraft = readSetupDraft()): PersonRecord[] =>
  listPeople(draft).filter((person) => person.status === 'confirmed');

/** Changes one person's status. */
export const setPersonStatus = (id: string, status: PersonStatus): boolean => setPersonStatuses({ [id]: status });

/** Changes several statuses in one write, one `setup-draft-change` for the set. */
export const setPersonStatuses = (statuses: Record<string, PersonStatus>): boolean => {
  const draft = readSetupDraft();
  return writeSetupDraft({ ...draft, personStatus: { ...draft.personStatus, ...statuses } });
};

/** Changes one person's role, seed or added. */
export const setPersonRole = (id: string, role: PersonRole): boolean => {
  const draft = readSetupDraft();
  return writeSetupDraft({ ...draft, personRole: { ...draft.personRole, [id]: role } });
};

/**
 * Adds a person typed into the add screen, already confirmed. Returns null on a
 * blank name or one the tenant already lists (compared without case; a
 * dismissed suggestion does not count, the same rule as addClassification).
 */
export const addPerson = (fields: PersonFields): PersonRecord | null => {
  const person = personFromFields(fields);
  if (!person.name || person.id === 'manual-') return null;

  const draft = readSetupDraft();
  const listed = listPeople(draft).filter((p) => p.status !== 'dismissed');
  if (listed.some((p) => p.name.toLowerCase() === person.name.toLowerCase())) return null;

  // A manual person removed earlier and typed in again gets the old id back; the
  // stale row, its `dismissed` status and any role override go with it.
  const added = draft.addedPeople.filter((p) => p.id !== person.id);
  const { [person.id]: _staleStatus, ...personStatus } = draft.personStatus;
  const { [person.id]: _staleRole, ...personRole } = draft.personRole;
  writeSetupDraft({ ...draft, addedPeople: [...added, person], personStatus, personRole });
  return person;
};

/** Records whether partners edit their own projects. Null clears the answer. */
export const setStewardship = (stewardship: Stewardship | null): boolean =>
  writeSetupDraft({ ...readSetupDraft(), stewardship });

// ---------------------------------------------------------------------------
// Measures
// ---------------------------------------------------------------------------

/**
 * Marks the measures milestone done or not done. The seam Mission 6's walk
 * writes when it lands; until then only fillSetupDraft sets it. Returns void,
 * like clearSetupDraft, because nothing downstream of a single flag has a
 * storage failure to report that the next read would not show.
 */
export const setMeasuresComplete = (value: boolean): void => {
  writeSetupDraft({ ...readSetupDraft(), measuresComplete: value });
};

// ---------------------------------------------------------------------------
// Import projects
// ---------------------------------------------------------------------------

/**
 * Every tracker row with its current status, in portfolio order. The cast is
 * the portfolio's own `projects`, which in this prototype is what the tracking
 * spreadsheet holds, so it appears only once the documents are in. A row the
 * admin has not answered is `suggested`.
 */
const PROJECT_TRACKER_ID = 'project-tracker';

export const listImportProjects = (draft: SetupDraft = readSetupDraft()): ImportProject[] => {
  if (!draft.documentsUploaded) return [];
  return projects.map((project) => {
    const id = projectSlug(project);
    return { id, project, status: draft.projectStatus[id] ?? 'suggested', sourceDocumentId: PROJECT_TRACKER_ID };
  });
};

export const confirmedImportProjects = (draft: SetupDraft = readSetupDraft()): ImportProject[] =>
  listImportProjects(draft).filter((row) => row.status === 'confirmed');

/** Answers the import question for many rows at once: the arrow's write. */
export const setProjectStatuses = (statuses: Record<string, ProjectImportStatus>): boolean => {
  const draft = readSetupDraft();
  return writeSetupDraft({ ...draft, projectStatus: { ...draft.projectStatus, ...statuses } });
};


// ---------------------------------------------------------------------------
// Journey status — derived, never stored
// ---------------------------------------------------------------------------

export interface JourneyProgress {
  status: JourneyStatus;
  /** Records confirmed on this journey. */
  confirmed: number;
  /** Candidates still awaiting review. */
  suggested: number;
  /**
   * How far through the milestone the admin is, in the milestone's own units:
   * screens answered for the start step, records resolved for a record
   * milestone. `total` is 0 when nothing is on the table yet, which is the
   * case for every milestone this slice has not opened.
   */
  steps: { done: number; total: number };
}

/** The number of marks a card's progress row draws. */
export const MILESTONE_DOTS = 5;

/**
 * How many of a card's marks are filled. A confirmed milestone fills every
 * mark whatever its counts say, an untouched one fills none, and in
 * between the row rounds the fraction but never rounds a started milestone
 * down to nothing or an unfinished one up to full.
 */
export const milestoneDotsFilled = (progress: JourneyProgress, dots = MILESTONE_DOTS): number => {
  if (progress.status === 'confirmed') return dots;
  const { done, total } = progress.steps;
  if (total === 0 || done === 0) return 0;
  if (done >= total) return dots;
  return Math.min(dots - 1, Math.max(1, Math.round((done / total) * dots)));
};

/**
 * The hub's and the map's single source of truth.
 *
 *   documents       the first step holds two halves, documents and intent:
 *                   confirmed when both are done, in-progress when one is;
 *                   intent here is Start's own questions (asks 'documents')
 *   program shape   three rules, the questions asked 'program-shape': confirmed
 *                   when all three are answered, in-progress when some are;
 *                   unanswered ones are suggested once documents are in
 *   appearance      four decisions (names, noun, color, visibility), the same
 *                   shape as program shape
 *   people          the classifications shape over people, with stewardship as
 *                   the preference step; in-progress keys on the admin having
 *                   acted, because the seed arrives with the admin confirmed
 *   organizations   confirmed when every suggestion is resolved and at least one
 *                   organization beyond the tenant itself is confirmed; in-progress
 *                   when some are; suggested when the documents produced candidates
 *                   or the intent answers call for partners
 *   funding sources the same shape as organizations, over funding sources: the
 *                   count is the roster's, so a dismissed suggestion stops counting
 *   classifications the same shape again, over classifications, plus one step
 *                   for the per-project limit: confirmed waits on that answer too
 *   spatial areas   the classifications shape with two preference steps (boundary
 *                   source, outside policy); confirmed with zero areas is valid,
 *                   the point-only outcome, once both are answered
 *   lifecycle       the six fixed stages are the suggestion, plus one step for
 *                   the default: confirmed when every stage is answered, one is
 *                   used and a default is set;
 *                   in-progress once any is answered; suggested once documents
 *                   are in or intent calls for it, untouched before that
 *   other build     suggested once the documents produced candidates or an intent
 *                   answer made the journey relevant, untouched otherwise
 *   import projects the same shape again, over the tracker's rows: confirmed
 *                   when every row is answered and at least one came in
 *   go-live         otherwise untouched until its own screen is built; dependsOn
 *                   is for data entry, never for the hub, so nothing here is locked
 *   measures        confirmed only when draft.measuresComplete is true (the
 *                   seam Mission 6 writes; today only fillSetupDraft sets it);
 *                   otherwise suggested when intent names performance measures
 */
export const journeyStatuses = (draft: SetupDraft = readSetupDraft()): Record<JourneyKey, JourneyProgress> => {
  const counts = draft.documentsUploaded ? candidateCountByJourney() : {};
  const wanted = journeysFromIntent(draft.intent, draft.customIntentOptions);
  const orgs = listOrganizations(draft).filter((o) => o.id !== tenantOrganization.id);
  const orgConfirmed = orgs.filter((o) => o.status === 'confirmed').length;
  const orgSuggested = orgs.filter((o) => o.status === 'suggested').length;

  const result = {} as Record<JourneyKey, JourneyProgress>;

  for (const journey of journeys) {
    let progress: JourneyProgress;
    switch (journey.key) {
      case 'documents': {
        const docs = draft.documentsUploaded ? 3 : 0;
        const answers = intentAnswered(draft);
        const done = docs > 0 && intentComplete(draft);
        const started = docs > 0 || answers > 0;
        progress = {
          status: done ? 'confirmed' : started ? 'in-progress' : 'untouched',
          confirmed: docs + answers,
          suggested: 0,
          // One screen for the documents, one per question Start asks.
          steps: { done: (docs > 0 ? 1 : 0) + answers, total: 1 + intentQuestionsFor('documents').length },
        };
        break;
      }
      case 'program-shape': {
        // Three rules, each an intent answer. Unanswered questions count as
        // suggested once documents are in, because each has a piece of evidence
        // (programShapeEvidence) the walk pre-selects.
        const total = intentQuestionsFor('program-shape').length;
        const answered = intentAnswered(draft, 'program-shape');
        const suggested = draft.documentsUploaded ? total - answered : 0;
        let status: JourneyStatus = 'untouched';
        if (answered === total) status = 'confirmed';
        else if (answered > 0) status = 'in-progress';
        else if (draft.documentsUploaded || wanted.has('program-shape')) status = 'suggested';
        progress = { status, confirmed: answered, suggested, steps: { done: answered, total } };
        break;
      }
      case 'appearance': {
        // Four decisions. Unanswered ones count as suggested once documents are
        // in, the program-shape rule: the directory and the report propose each.
        const answers = appearanceAnswered(draft);
        const total = Object.keys(answers).length;
        const done = Object.values(answers).filter(Boolean).length;
        const suggested = draft.documentsUploaded ? total - done : 0;
        let status: JourneyStatus = 'untouched';
        if (done === total) status = 'confirmed';
        else if (done > 0) status = 'in-progress';
        else if (draft.documentsUploaded || wanted.has('appearance')) status = 'suggested';
        progress = { status, confirmed: done, suggested, steps: { done, total } };
        break;
      }
      case 'people': {
        const records = listPeople(draft);
        const confirmed = records.filter((p) => p.status === 'confirmed').length;
        const suggested = records.filter((p) => p.status === 'suggested').length;
        // The stewardship answer is one more step, and confirmation waits on it.
        // The seed arrives with the admin already confirmed, so in-progress keys
        // on the admin having acted, not on a confirmed count, or an untouched
        // upload would read as started.
        const touched =
          Object.keys(draft.personStatus).length > 0 ||
          Object.keys(draft.personRole).length > 0 ||
          draft.addedPeople.length > 0 ||
          draft.stewardship !== null;
        let status: JourneyStatus = 'untouched';
        if (confirmed > 0 && suggested === 0 && draft.stewardship !== null) status = 'confirmed';
        else if (touched) status = 'in-progress';
        else if (suggested > 0 || wanted.has('people')) status = 'suggested';
        progress = {
          status,
          confirmed,
          suggested,
          steps: { done: confirmed + (draft.stewardship ? 1 : 0), total: confirmed + suggested + 1 },
        };
        break;
      }
      case 'organizations': {
        let status: JourneyStatus = 'untouched';
        if (orgConfirmed > 0 && orgSuggested === 0) status = 'confirmed';
        else if (orgConfirmed > 0) status = 'in-progress';
        else if (orgSuggested > 0 || wanted.has('organizations')) status = 'suggested';
        progress = {
          status,
          confirmed: orgConfirmed,
          suggested: orgSuggested,
          steps: { done: orgConfirmed, total: orgConfirmed + orgSuggested },
        };
        break;
      }
      case 'funding-sources': {
        const sources = listFundingSources(draft);
        const confirmed = sources.filter((s) => s.status === 'confirmed').length;
        const suggested = sources.filter((s) => s.status === 'suggested').length;
        let status: JourneyStatus = 'untouched';
        if (confirmed > 0 && suggested === 0) status = 'confirmed';
        else if (confirmed > 0) status = 'in-progress';
        else if (suggested > 0 || wanted.has('funding-sources')) status = 'suggested';
        progress = {
          status,
          confirmed,
          suggested,
          steps: { done: confirmed, total: confirmed + suggested },
        };
        break;
      }
      case 'classifications': {
        const records = listClassifications(draft);
        const confirmed = records.filter((c) => c.status === 'confirmed').length;
        const suggested = records.filter((c) => c.status === 'suggested').length;
        // The limit answer is one more step, and confirmation waits on it.
        const limitAnswered = draft.classificationLimit !== null;
        let status: JourneyStatus = 'untouched';
        if (confirmed > 0 && suggested === 0 && limitAnswered) status = 'confirmed';
        else if (confirmed > 0) status = 'in-progress';
        else if (suggested > 0 || wanted.has('classifications')) status = 'suggested';
        progress = {
          status,
          confirmed,
          suggested,
          steps: { done: confirmed + (limitAnswered ? 1 : 0), total: confirmed + suggested + 1 },
        };
        break;
      }
      case 'lifecycle': {
        const stages = listStages(draft);
        const confirmed = stages.filter((s) => s.status === 'confirmed').length;
        const suggested = stages.filter((s) => s.status === 'suggested').length;
        let status: JourneyStatus = 'untouched';
        if (confirmed > 0 && suggested === 0 && draft.defaultStage !== null) status = 'confirmed';
        else if (confirmed > 0 || stagesAnswered(draft)) status = 'in-progress';
        else if (draft.documentsUploaded || wanted.has('lifecycle')) status = 'suggested';
        // The default-stage answer is one more step, so a card with every stage
        // answered and no default reads short of full.
        progress = {
          status,
          confirmed,
          suggested,
          steps: { done: confirmed + (draft.defaultStage !== null ? 1 : 0), total: confirmed + suggested + 1 },
        };
        break;
      }
      case 'spatial-areas': {
        const records = listSpatialAreas(draft);
        const confirmed = records.filter((a) => a.status === 'confirmed').length;
        const suggested = records.filter((a) => a.status === 'suggested').length;
        // Two preference answers are two more steps. Zero confirmed areas is a
        // valid outcome (projects sit on a point), so confirmation waits on the
        // answers and on the admin having acted, never on a count.
        const answered = draft.boundarySource !== null && draft.outsidePolicy !== null;
        const touched =
          records.some((a) => a.status !== 'suggested') || draft.boundarySource !== null || draft.outsidePolicy !== null;
        let status: JourneyStatus = 'untouched';
        if (suggested === 0 && answered && touched) status = 'confirmed';
        else if (touched) status = 'in-progress';
        else if (suggested > 0 || wanted.has('spatial-areas')) status = 'suggested';
        progress = {
          status,
          confirmed,
          suggested,
          steps: {
            done: confirmed + (draft.boundarySource ? 1 : 0) + (draft.outsidePolicy ? 1 : 0),
            total: confirmed + suggested + 2,
          },
        };
        break;
      }
      case 'import-projects': {
        const rows = listImportProjects(draft);
        const confirmed = rows.filter((r) => r.status === 'confirmed').length;
        const suggested = rows.filter((r) => r.status === 'suggested').length;
        let status: JourneyStatus = 'untouched';
        if (confirmed > 0 && suggested === 0) status = 'confirmed';
        else if (confirmed > 0) status = 'in-progress';
        else if (suggested > 0) status = 'suggested';
        progress = {
          status,
          confirmed,
          suggested,
          steps: { done: confirmed, total: confirmed + suggested },
        };
        break;
      }
      case 'measures':
        // draft.measuresComplete is the seam Mission 6's walk writes when it
        // lands; today only the hub's fill control (fillSetupDraft) sets it.
        // Without it the case reads exactly as before: suggested when intent
        // names measures, untouched otherwise, never confirmed.
        progress = draft.measuresComplete
          ? { status: 'confirmed', confirmed: 1, suggested: 0, steps: { done: 1, total: 1 } }
          : {
              status: wanted.has('measures') ? 'suggested' : 'untouched',
              confirmed: 0,
              suggested: 0,
              steps: { done: 0, total: 0 },
            };
        break;
      default: {
        const suggested = counts[journey.key] ?? 0;
        const relevant = suggested > 0 || wanted.has(journey.key);
        progress = {
          status: relevant ? 'suggested' : 'untouched',
          confirmed: 0,
          suggested,
          steps: { done: 0, total: suggested },
        };
      }
    }
    result[journey.key] = progress;
  }

  return result;
};

/**
 * Fraction of milestones complete, for the hub's meter. Every milestone counts,
 * measures included: the hub collects all eleven, and setup is not stood up
 * until measures confirms too. A walk through this slice alone tops out at ten
 * of eleven, because only Mission 6's screen or the demo fill sets
 * measuresComplete. That is the honest number.
 */
export const setupCompletion = (draft: SetupDraft = readSetupDraft()): { done: number; total: number } => {
  const statuses = journeyStatuses(draft);
  const done = journeys.filter((j) => statuses[j.key].status === 'confirmed').length;
  return { done, total: journeys.length };
};

/** True when every milestone is confirmed. The hub's complete band and the summary page both gate on it. */
export const setupComplete = (draft: SetupDraft = readSetupDraft()): boolean => {
  const { done, total } = setupCompletion(draft);
  return done === total && total > 0;
};

// ---------------------------------------------------------------------------
// Demo fill
// ---------------------------------------------------------------------------

/**
 * A fully complete draft, for the hub's one-click demo fill and the summary
 * page it opens. PURE: no storage read or write, so a test or a page can build
 * it without touching the browser.
 *
 * FILLED FROM WHAT THE WALKS ALREADY PROPOSE, 2026-09-23. Every value is the
 * seed's own suggestion or the answer a walk pre-selects; nothing is invented,
 * so the filled hub shows the program the documents describe. Where a walk
 * pre-selects nothing (Start's six questions), the answers are the ones that
 * fit the Cascade Headwaters narrative: a watershed partnership that implements
 * its own projects with partners, reports measures, groups projects by program
 * area and draws subbasins.
 *
 *   work       habitat, water         restoration and streamflow, per the tracker
 *   goals      track-funding, report, the grant agreement, the annual report,
 *              coordinate, share      partners on the roster, a public site
 *   slices     program-areas          the tracker's Program area column
 *   map        watersheds             the report's four subbasins
 *   measures   yes                    reports performance measures
 *   reporters  partners               implements its projects with partners
 *   money, time, proposals           programShapeEvidence: both, fiscal-july, no
 *
 * Records: every seeded organization, funding source, tracker row,
 * classification, spatial area and person confirmed. Stages: the ones the
 * tracker's Status column lands in confirmed, the rest dismissed; Proposal is
 * dismissed because the proposals answer is no, and Deferred because no tracker
 * value lands there (the stage picker's pre-press rule). The default stage is
 * the stage default screen's pick: Proposal when used, else the first used
 * stage. The color is the color screen's opening pick, the swatch nearest the
 * tenant's directory mark. Visibility and stewardship derive from the answers
 * above, the way their screens suggest them.
 */
export const completeSetupDraft = (): SetupDraft => {
  const intent: Record<string, string[]> = {
    work: ['habitat', 'water'],
    goals: ['track-funding', 'report', 'coordinate', 'share'],
    slices: ['program-areas'],
    map: ['watersheds'],
    measures: ['yes'],
    reporters: ['partners'],
  };
  for (const evidence of programShapeEvidence) intent[evidence.questionId] = [evidence.optionId];

  const confirmAll = <T extends { id: string }>(records: readonly T[]): Record<string, 'confirmed'> =>
    Object.fromEntries(records.map((record) => [record.id, 'confirmed' as const]));

  // The stage picker's pre-press: the proposals answer decides Proposal, the
  // tracker's evidence decides the rest.
  const proposals = intent.proposals?.[0];
  const stageStatus: Record<string, StageStatus> = Object.fromEntries(
    stageOptions.map((stage) => {
      const pressed =
        stage.id === 'proposal' && (proposals === 'yes' || proposals === 'no')
          ? proposals === 'yes'
          : stage.trackerStatuses.length > 0;
      return [stage.id, pressed ? 'confirmed' : 'dismissed'];
    }),
  );
  const used = stageOptions.filter((stage) => stageStatus[stage.id] === 'confirmed').map((stage) => stage.id);
  const defaultStage = used.includes('proposal') ? 'proposal' : (used[0] ?? 'planning-design');

  const markHue = directoryById.get(tenantAppearanceDefaults.logoOrganizationId)?.mark.hue;
  const tenantColorId =
    (markHue !== undefined ? nearestTenantColor(tenantColors, markHue)?.id : undefined) ?? tenantColors[0].id;

  return {
    ...EMPTY,
    documentsUploaded: true,
    intent,
    organizationStatus: confirmAll(suggestedOrganizations),
    fundingSourceStatus: confirmAll(suggestedFundingSources),
    projectStatus: Object.fromEntries(projects.map((project) => [projectSlug(project), 'confirmed' as const])),
    stageStatus,
    defaultStage,
    classificationStatus: confirmAll(suggestedClassifications),
    classificationLimit: 1,
    spatialAreaStatus: confirmAll(suggestedSpatialAreas),
    boundarySource: 'published',
    outsidePolicy: 'catch-all',
    tenantName: tenantAppearanceDefaults.name,
    tenantShortName: tenantAppearanceDefaults.shortName,
    tenantLogoFileName: null,
    projectNoun: suggestedProjectNoun.noun,
    tenantColorId,
    siteVisibility: suggestedSiteVisibility(intent),
    personStatus: confirmAll(suggestedPeople),
    stewardship: stewardshipFromIntent(intent) ?? 'staff',
    measuresComplete: true,
  };
};

/**
 * Writes the complete draft over whatever this browser holds: the hub's demo
 * fill, the mirror of clearSetupDraft behind Reset demo. writeSetupDraft
 * dispatches `setup-draft-change` with the new draft, so every listening card
 * and roster re-renders in place; no reload.
 */
export const fillSetupDraft = (): void => {
  writeSetupDraft(completeSetupDraft());
};
