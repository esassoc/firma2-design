// Tenant setup — the model behind the setup hub and its journeys.
//
// THE SHAPE OF SETUP. Standing up a tenant is not one form and not one sitting.
// It is a small set of JOURNEYS, each a draft with its own URL, that resolve
// into the records a program needs before its staff enter a first project:
// who exists (organizations), what money is tracked against (funding sources),
// how the portfolio is sliced (classifications), what stages a project moves
// through (lifecycle), what the landscape is (spatial areas), what things are
// called (appearance), and who may log in (people).
//
// THREE TIERS, by dependency and reversibility rather than by topic:
//
//   foundation  sequential, first — the answers change what every later screen
//               means (what you call a project; whether you fund or implement).
//   build       parallel, any order, each resumable and shareable. Soft
//               dependencies only: funding sources want organizations first,
//               because a funder IS an organization.
//   go-live     gated on readiness. Inviting people is the go-live act; the
//               first project is the proof the tenant is stood up.
//
// STARTING FROM WHAT THE TENANT HAS. Every new tenant arrives with a spreadsheet,
// a grant report, an old site. The `documents` journey reads those and turns
// them into SUGGESTIONS on every other journey — a hex on the map goes from
// gray to outlined. Nothing extracted is written as fact: an admin confirms
// each suggestion, which is where human review lives in this design.
//
// MOCK DATA ONLY. Tenant, documents, organizations, excerpts: all invented.
// The tenant is Cascade Headwaters Partnership from the hackathon cast
// (docs/hackathon/PERSONAS.md in the projectfirma2 repo): six staff, ~30
// projects, no GIS analyst, Dana as admin.

import type { Project, ProjectStage } from './firma2-projects';
import { STAGE_ORDER } from './firma2-projects';

export type JourneyKey =
  | 'documents'
  | 'program-shape'
  | 'organizations'
  | 'funding-sources'
  | 'classifications'
  | 'lifecycle'
  | 'spatial-areas'
  | 'appearance'
  | 'people'
  | 'import-projects'
  | 'measures';

export type JourneyTier = 'foundation' | 'build' | 'go-live';

/**
 * The hub's three groups, ordered by dependency. Each group is one tier
 * (program = foundation, project = build, work = go-live), and each carries a
 * definition of done that the hub prints under its heading. Andy, 2026-09-23:
 * three groups by dependency replaced five subject sections, which left two
 * groups holding one or two cards.
 */
export type MilestoneSection = 'program' | 'project' | 'work';

export interface MilestoneGroup {
  key: MilestoneSection;
  heading: string;
  /** The group's definition of done: one sentence, printed after its count. */
  done: string;
}

/** Hub group order, headings, and definitions of done. */
export const milestoneSections: MilestoneGroup[] = [
  {
    key: 'program',
    heading: 'Describe your program',
    done: 'Your name and look are on the site, and the rules you run by are on record.',
  },
  {
    key: 'project',
    heading: 'Define what a project is made of',
    done: 'A project record can be filled in end to end without inventing a term.',
  },
  {
    key: 'work',
    heading: 'Bring in the work',
    done: 'Your projects are in, your measures are defined, and your people can sign in.',
  },
];

/**
 * A journey's state on the hub, and the hex's state on the map.
 *
 *   untouched   nothing known yet — flat gray
 *   suggested   documents produced candidates awaiting review — outlined
 *   in-progress some records confirmed, some still open — part filled
 *   confirmed   the journey has what the tenant needs — filled, raised
 */
export type JourneyStatus = 'untouched' | 'suggested' | 'in-progress' | 'confirmed';

export interface SetupJourney {
  key: JourneyKey;
  /** The hub row's name and the hex's label. */
  title: string;
  tier: JourneyTier;
  section: MilestoneSection;
  /** Root-relative, base-less. Omitted for a journey this spoke has not built — renders inert, not as a dead link. */
  route?: string;
  /** Journeys whose records this one's data entry reads (people belong to organizations). The hub never shows it: every card stays open, and the milestone's own screens decide what can be added. */
  dependsOn: JourneyKey[];
  /** Position on the hex map, axial coordinates. Adjacency is meaningful: neighbours depend on each other. */
  hex: { q: number; r: number };
  /** The noun a count on this journey counts — "organizations", "funding sources". */
  unit: string;
  /** esa-icon registry name. */
  icon: string;
  /**
   * The milestone's colour, as an oklch hue angle. Eleven milestones, one
   * spectrum, walked in hub order from red toward magenta. Each group owns a
   * band (program 25 to 85, project 115 to 265, work 295 to 355), stepped 30
   * degrees inside the small groups and 35 to 40 inside the project group, so
   * the ramp still runs in journey order. The emblem derives every fill and
   * outline from the brand tokens with only this angle swapped, so each colour
   * is the brand at a different hue rather than eleven hand-picked values.
   */
  hue: number;
  /** Owned by another team this hackathon. Renders on the map as the seam, not as ours to fill. */
  external?: 'mission-6';
}

// Hex layout, reading top to bottom in setup order. Axial (q, r): r is the row,
// q shifts half a hex per row. Documents sits alone at the top, feeding the ring
// beneath it; import projects is at the bottom centre, the destination everything
// above it feeds; measures sits at the edge as the hand-off to Mission 6.
export const journeys: SetupJourney[] = [
  {
    key: 'documents',
    title: 'Start',
    tier: 'foundation',
    section: 'program',
    route: '/prototypes/setup/start',
    dependsOn: [],
    hex: { q: 0, r: -2 },
    unit: 'documents',
    icon: 'upload',
    hue: 25,
  },
  {
    key: 'program-shape',
    title: 'Program shape',
    tier: 'foundation',
    section: 'program',
    route: '/prototypes/setup/program-shape',
    dependsOn: [],
    hex: { q: 1, r: -2 },
    unit: 'decisions',
    icon: 'settings',
    hue: 55,
  },
  {
    key: 'appearance',
    title: 'Names and appearance',
    tier: 'foundation',
    section: 'program',
    route: '/prototypes/setup/appearance',
    dependsOn: [],
    hex: { q: 1, r: 0 },
    unit: 'settings',
    icon: 'pencil',
    hue: 85,
  },
  {
    key: 'organizations',
    title: 'Organizations',
    tier: 'build',
    section: 'project',
    route: '/prototypes/setup/organizations',
    dependsOn: [],
    hex: { q: -1, r: -1 },
    unit: 'organizations',
    icon: 'users',
    hue: 115,
  },
  {
    key: 'funding-sources',
    title: 'Funding sources',
    tier: 'build',
    section: 'project',
    route: '/prototypes/setup/funding-sources',
    dependsOn: [],
    hex: { q: 0, r: -1 },
    unit: 'funding sources',
    icon: 'credit-card',
    hue: 150,
  },
  {
    key: 'classifications',
    title: 'Classifications',
    tier: 'build',
    section: 'project',
    route: '/prototypes/setup/classifications',
    dependsOn: [],
    hex: { q: 1, r: -1 },
    unit: 'classifications',
    icon: 'filter',
    hue: 190,
  },
  {
    key: 'lifecycle',
    title: 'Project stages',
    tier: 'build',
    section: 'project',
    route: '/prototypes/setup/project-stages',
    dependsOn: [],
    hex: { q: -1, r: 0 },
    unit: 'stages',
    icon: 'activity',
    hue: 230,
  },
  {
    key: 'spatial-areas',
    title: 'Spatial areas',
    tier: 'build',
    section: 'project',
    route: '/prototypes/setup/spatial-areas',
    dependsOn: [],
    hex: { q: 0, r: 0 },
    unit: 'areas',
    icon: 'map-pin',
    hue: 265,
  },
  // IMPORT, NOT AUTHOR. This milestone was "First project": walk the admin
  // through entering one project by hand so the portfolio is not empty at
  // go-live. Andy, 2026-09-18, chose the import instead: setup configures
  // reference data, and the portfolio's first fill is the tracking spreadsheet
  // Start already took, not a form. The unit stays "projects" because the count
  // on the card is how many came in.
  {
    key: 'import-projects',
    title: 'Import projects',
    tier: 'go-live',
    section: 'work',
    route: '/prototypes/setup/import-projects',
    dependsOn: ['organizations'],
    hex: { q: 0, r: 1 },
    unit: 'projects',
    icon: 'download',
    hue: 295,
  },
  {
    key: 'measures',
    title: 'Performance measures',
    tier: 'go-live',
    section: 'work',
    route: '/prototypes/performance-measures',
    dependsOn: [],
    hex: { q: 1, r: 1 },
    unit: 'measures',
    icon: 'trending-up',
    hue: 325,
    external: 'mission-6',
  },
  {
    key: 'people',
    title: 'People',
    tier: 'go-live',
    section: 'work',
    route: '/prototypes/setup/people',
    dependsOn: ['organizations'],
    hex: { q: -1, r: 1 },
    unit: 'people',
    icon: 'user',
    hue: 355,
  },
];

export const journeyByKey = (key: JourneyKey): SetupJourney => {
  const found = journeys.find((j) => j.key === key);
  if (!found) throw new Error(`Unknown setup journey: ${key}`);
  return found;
};

// ---------------------------------------------------------------------------
// Documents — what the tenant brought
// ---------------------------------------------------------------------------

export type DocumentKind = 'pdf' | 'xlsx' | 'docx';

export interface TenantDocument {
  id: string;
  /** File name as uploaded. */
  name: string;
  kind: DocumentKind;
  /** Bytes. */
  size: number;
  pages?: number;
}

/**
 * The documents the demo "uploads". esa-file-upload accepts real files, but a
 * static site cannot read a PDF, so the extraction below is CANNED against these
 * three regardless of what was dropped. The demo says so.
 */
export const sampleDocuments: TenantDocument[] = [
  {
    id: 'annual-report-2025',
    name: 'Cascade Headwaters Annual Report 2025.pdf',
    kind: 'pdf',
    size: 4_812_000,
    pages: 28,
  },
  {
    id: 'project-tracker',
    name: 'Project tracking master.xlsx',
    kind: 'xlsx',
    size: 388_000,
  },
  {
    id: 'grant-agreement',
    name: 'OWEB grant agreement 2024.pdf',
    kind: 'pdf',
    size: 1_204_000,
    pages: 14,
  },
];

// ---------------------------------------------------------------------------
// Organizations — the cast
// ---------------------------------------------------------------------------

/** The part an organization plays in this program. One organization can play several. */
export type OrganizationRole = 'Implementer' | 'Funder' | 'Landowner' | 'Partner agency';

export const organizationRoles: OrganizationRole[] = ['Implementer', 'Funder', 'Landowner', 'Partner agency'];

/** How an organization entered the tenant. */
export type OrganizationSource = 'document' | 'ask' | 'manual';

export type OrganizationStatus = 'suggested' | 'confirmed' | 'dismissed';

export interface Organization {
  id: string;
  name: string;
  roles: OrganizationRole[];
  /** Town, for telling two similar names apart. */
  location?: string;
  source: OrganizationSource;
  /** The document a `document`-sourced suggestion came from. */
  sourceDocumentId?: string;
  /** The passage the name was found in. Shown so the admin can judge the suggestion. */
  sourceExcerpt?: string;
  /** How many projects the documents mention this organization on. */
  projectsMentioned?: number;
  status: OrganizationStatus;
}

/**
 * The tenant's own organization. Confirmed from the start: the program that
 * signed the contract is the one record setup can take as given.
 */
export const tenantOrganization: Organization = {
  id: 'cascade-headwaters-partnership',
  name: 'Cascade Headwaters Partnership',
  roles: ['Implementer'],
  location: 'Sisters',
  source: 'manual',
  status: 'confirmed',
};

/**
 * What the canned extraction finds in the three sample documents. Ordered by
 * projectsMentioned descending, which is the order the pick grid shows them in:
 * the organizations the tenant works with most are the ones it should see first.
 */
export const suggestedOrganizations: Organization[] = [
  {
    id: 'deschutes-land-trust',
    name: 'Deschutes Land Trust',
    roles: ['Implementer', 'Landowner'],
    location: 'Bend',
    source: 'document',
    sourceDocumentId: 'project-tracker',
    sourceExcerpt: 'Lead: Deschutes Land Trust (11 rows)',
    projectsMentioned: 11,
    status: 'suggested',
  },
  {
    id: 'upper-deschutes-watershed-council',
    name: 'Upper Deschutes Watershed Council',
    roles: ['Implementer'],
    location: 'Bend',
    source: 'document',
    sourceDocumentId: 'annual-report-2025',
    sourceExcerpt: 'In partnership with the Upper Deschutes Watershed Council, eight reaches were reconnected to their floodplain.',
    projectsMentioned: 8,
    status: 'suggested',
  },
  {
    id: 'oregon-watershed-enhancement-board',
    name: 'Oregon Watershed Enhancement Board',
    roles: ['Funder'],
    location: 'Salem',
    source: 'document',
    sourceDocumentId: 'grant-agreement',
    sourceExcerpt: 'This agreement between the Oregon Watershed Enhancement Board ("OWEB") and Cascade Headwaters Partnership ("Grantee")',
    projectsMentioned: 7,
    status: 'suggested',
  },
  {
    id: 'deschutes-swcd',
    name: 'Deschutes Soil and Water Conservation District',
    roles: ['Implementer', 'Partner agency'],
    location: 'Redmond',
    source: 'document',
    sourceDocumentId: 'project-tracker',
    sourceExcerpt: 'Lead: Deschutes SWCD (6 rows)',
    projectsMentioned: 6,
    status: 'suggested',
  },
  {
    id: 'three-sisters-irrigation-district',
    name: 'Three Sisters Irrigation District',
    roles: ['Partner agency', 'Landowner'],
    location: 'Sisters',
    source: 'document',
    sourceDocumentId: 'annual-report-2025',
    sourceExcerpt: 'Piping agreements with Three Sisters Irrigation District returned 4.2 cfs to the creek.',
    projectsMentioned: 5,
    status: 'suggested',
  },
  {
    id: 'national-fish-and-wildlife-foundation',
    name: 'National Fish and Wildlife Foundation',
    roles: ['Funder'],
    location: 'Washington, DC',
    source: 'document',
    sourceDocumentId: 'annual-report-2025',
    sourceExcerpt: 'Funders: OWEB, the National Fish and Wildlife Foundation, and private donors.',
    projectsMentioned: 4,
    status: 'suggested',
  },
  {
    id: 'pine-ridge-ranch',
    name: 'Pine Ridge Ranch',
    roles: ['Landowner'],
    location: 'Camp Sherman',
    source: 'document',
    sourceDocumentId: 'project-tracker',
    sourceExcerpt: 'Landowner: Pine Ridge Ranch (3 rows)',
    projectsMentioned: 3,
    status: 'suggested',
  },
  {
    id: 'usda-forest-service',
    name: 'USDA Forest Service',
    roles: ['Partner agency', 'Landowner'],
    location: 'Bend',
    source: 'document',
    sourceDocumentId: 'annual-report-2025',
    sourceExcerpt: 'Work on Deschutes National Forest land proceeded under a 2023 stewardship agreement with the Forest Service.',
    projectsMentioned: 3,
    status: 'suggested',
  },
  {
    id: 'oregon-department-of-fish-and-wildlife',
    name: 'Oregon Department of Fish and Wildlife',
    roles: ['Partner agency'],
    location: 'Bend',
    source: 'document',
    sourceDocumentId: 'grant-agreement',
    sourceExcerpt: 'Fish passage designs are subject to review by the Oregon Department of Fish and Wildlife.',
    projectsMentioned: 2,
    status: 'suggested',
  },
  {
    id: 'juniper-flats-grazing-association',
    name: 'Juniper Flats Grazing Association',
    roles: ['Landowner'],
    location: 'Terrebonne',
    source: 'document',
    sourceDocumentId: 'project-tracker',
    sourceExcerpt: 'Landowner: Juniper Flats Grazing Assoc. (2 rows)',
    projectsMentioned: 2,
    status: 'suggested',
  },
  {
    id: 'central-oregon-flyfishers',
    name: 'Central Oregon Flyfishers',
    roles: ['Implementer'],
    location: 'Bend',
    source: 'document',
    sourceDocumentId: 'annual-report-2025',
    sourceExcerpt: 'Volunteers from Central Oregon Flyfishers planted 3,400 willow stakes.',
    projectsMentioned: 1,
    status: 'suggested',
  },
];

// ---------------------------------------------------------------------------
// Extraction — what the documents suggested for every journey
// ---------------------------------------------------------------------------

/**
 * One candidate the documents produced for a journey this spoke has NOT built
 * a page for. Organizations are modelled in full above; these are counted on
 * the documents page and light their hex as `suggested`.
 */
export interface ExtractedCandidate {
  journey: JourneyKey;
  label: string;
  sourceDocumentId: string;
}

export const extractedCandidates: ExtractedCandidate[] = [
  // Funding sources: the grant agreement names one; the annual report names the rest.
  { journey: 'funding-sources', label: 'OWEB 2024 award', sourceDocumentId: 'grant-agreement' },
  { journey: 'funding-sources', label: 'Salmon Recovery grant 2023', sourceDocumentId: 'annual-report-2025' },
  { journey: 'funding-sources', label: 'Private donations', sourceDocumentId: 'annual-report-2025' },
  { journey: 'funding-sources', label: 'Irrigation efficiency cost-share', sourceDocumentId: 'project-tracker' },
  // Classifications: the tracker has a "Program area" column with five distinct values.
  { journey: 'classifications', label: 'Riparian habitat', sourceDocumentId: 'project-tracker' },
  { journey: 'classifications', label: 'Fish passage', sourceDocumentId: 'project-tracker' },
  { journey: 'classifications', label: 'Streamflow restoration', sourceDocumentId: 'project-tracker' },
  { journey: 'classifications', label: 'Upland forest health', sourceDocumentId: 'project-tracker' },
  { journey: 'classifications', label: 'Community engagement', sourceDocumentId: 'project-tracker' },
  // Lifecycle: the tracker's "Status" column.
  { journey: 'lifecycle', label: 'Funded', sourceDocumentId: 'project-tracker' },
  { journey: 'lifecycle', label: 'In construction', sourceDocumentId: 'project-tracker' },
  { journey: 'lifecycle', label: 'Complete', sourceDocumentId: 'project-tracker' },
  { journey: 'lifecycle', label: 'Monitoring', sourceDocumentId: 'project-tracker' },
  // Spatial areas: the annual report's map names four subbasins.
  { journey: 'spatial-areas', label: 'Whychus Creek', sourceDocumentId: 'annual-report-2025' },
  { journey: 'spatial-areas', label: 'Metolius River', sourceDocumentId: 'annual-report-2025' },
  { journey: 'spatial-areas', label: 'Upper Deschutes', sourceDocumentId: 'annual-report-2025' },
  { journey: 'spatial-areas', label: 'Crooked River', sourceDocumentId: 'annual-report-2025' },
  // Appearance: what the documents call things.
  { journey: 'appearance', label: 'Projects are called "restoration actions"', sourceDocumentId: 'annual-report-2025' },
  { journey: 'appearance', label: 'Wordmark on report cover', sourceDocumentId: 'annual-report-2025' },
  // Program shape: the tracker has no proposal rows; every project is funded before it appears.
  { journey: 'program-shape', label: 'Implements its own projects with partners', sourceDocumentId: 'annual-report-2025' },
  { journey: 'program-shape', label: 'No proposal cycle in the tracker', sourceDocumentId: 'project-tracker' },
  { journey: 'program-shape', label: 'Fiscal year July 1 to June 30', sourceDocumentId: 'grant-agreement' },
  // People: the staff page of the report. "Name, title" — suggestedPeople splits on the comma.
  { journey: 'people', label: 'Dana Whitfield, program manager', sourceDocumentId: 'annual-report-2025' },
  { journey: 'people', label: 'Marisol Ortega, restoration ecologist', sourceDocumentId: 'annual-report-2025' },
  { journey: 'people', label: 'Ben Tanaka, GIS and data coordinator', sourceDocumentId: 'annual-report-2025' },
  { journey: 'people', label: 'Hollis Reed, outreach coordinator', sourceDocumentId: 'annual-report-2025' },
  { journey: 'people', label: 'Priya Natarajan, finance manager', sourceDocumentId: 'annual-report-2025' },
  { journey: 'people', label: 'Wes Calloway, field crew lead', sourceDocumentId: 'annual-report-2025' },
];

/** Candidates per journey, including organizations, for the documents page's results and the hub's counts. */
export const candidateCountByJourney = (): Partial<Record<JourneyKey, number>> => {
  const counts: Partial<Record<JourneyKey, number>> = {
    organizations: suggestedOrganizations.length,
  };
  for (const c of extractedCandidates) counts[c.journey] = (counts[c.journey] ?? 0) + 1;
  return counts;
};

// ---------------------------------------------------------------------------
// Ask — natural-language additions, canned
// ---------------------------------------------------------------------------

/**
 * A canned answer to a typed request on the organizations journey. The
 * prototype matches the request against `keywords` (any hit, case-insensitive)
 * and proposes `organizations`; nothing is confirmed until the admin picks
 * them. A live build would call the model with the tenant's documents as
 * context; the shape of the answer is the same.
 */
export interface AskExample {
  /** Shown as a placeholder or example prompt. */
  prompt: string;
  keywords: string[];
  organizations: Organization[];
}

export const askExamples: AskExample[] = [
  {
    prompt: 'Add the land trust and the conservancy we work with on the Metolius',
    keywords: ['land trust', 'conservancy', 'metolius'],
    organizations: [
      {
        id: 'deschutes-land-trust',
        name: 'Deschutes Land Trust',
        roles: ['Implementer', 'Landowner'],
        location: 'Bend',
        source: 'ask',
        status: 'suggested',
      },
      {
        id: 'the-nature-conservancy',
        name: 'The Nature Conservancy',
        roles: ['Implementer', 'Landowner'],
        location: 'Portland',
        source: 'ask',
        status: 'suggested',
      },
    ],
  },
  {
    prompt: 'The county and the two cities we have agreements with',
    keywords: ['county', 'city', 'cities', 'municipal'],
    organizations: [
      {
        id: 'jefferson-county',
        name: 'Jefferson County',
        roles: ['Partner agency', 'Landowner'],
        location: 'Madras',
        source: 'ask',
        status: 'suggested',
      },
      {
        id: 'city-of-sisters',
        name: 'City of Sisters',
        roles: ['Partner agency'],
        location: 'Sisters',
        source: 'ask',
        status: 'suggested',
      },
      {
        id: 'city-of-redmond',
        name: 'City of Redmond',
        roles: ['Partner agency'],
        location: 'Redmond',
        source: 'ask',
        status: 'suggested',
      },
    ],
  },
  {
    prompt: 'Our engineering consultants',
    keywords: ['engineer', 'consultant', 'design firm'],
    organizations: [
      {
        id: 'headwaters-engineering',
        name: 'Headwaters Engineering',
        roles: ['Implementer'],
        location: 'Bend',
        source: 'ask',
        status: 'suggested',
      },
    ],
  },
];

/**
 * The fallback when no example matches: one organization named after the
 * request itself, so the flow still lands somewhere the admin can edit.
 */
export const organizationFromFreeText = (text: string): Organization => {
  const name = text.trim().replace(/^(add|include|create)\s+/i, '').replace(/[.?!]$/, '');
  const id = `ask-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
  return {
    id,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    roles: ['Implementer'],
    source: 'ask',
    status: 'suggested',
  };
};

// ---------------------------------------------------------------------------
// Intent — what the program tracks, asked alongside the documents
// ---------------------------------------------------------------------------

/**
 * The first step asks for CONTEXT (documents) and INTENT (what the program
 * tracks and how it runs). Documents produce candidates; intent decides which
 * journeys the tenant needs at all. Both feed the hub: an option the admin picks
 * lights its journeys as `suggested` even when no document mentioned them, and
 * the classifications option names the classification it stands for.
 */
export interface IntentOption {
  id: string;
  label: string;
  /** Journeys this answer makes relevant. */
  journeys: JourneyKey[];
  /** For classification answers: the classification the tenant will need, by name. */
  classification?: string;
  /** How the answer reads in the composed summary sentence. */
  phrase: string;
}

/**
 * The milestone that asks a question. Start asks what the program DOES; Program
 * shape asks the rules it RUNS BY. Decision 2026-09-23: money, time and
 * proposals moved out of Start onto Program shape, so Start asks only what the
 * program does. The answers still live in one place, draft.intent, so
 * journeysFromIntent lights the hub from both milestones' answers alike.
 */
export type IntentMilestone = 'documents' | 'program-shape';

export interface IntentQuestion {
  id: string;
  /** Which milestone's walk renders this question. */
  asks: IntentMilestone;
  /** One line, under 40 characters, asked as the assistant would ask it. */
  prompt: string;
  multiple: boolean;
  /** Registry icon shown above the prompt. */
  icon: string;
  /** Words that precede the chosen phrases in the summary sentence; empty when the phrase stands alone. */
  lead: string;
  options: IntentOption[];
  guide: StepGuide;
  /**
   * When the choices cannot be exhaustive, an "in your own words" field under
   * them. What is typed becomes one more selected chip on this question.
   */
  ask?: { label: string; placeholder: string };
}

/** The side panel beside a screen: what the choice sets up, in the admin's terms. */
export interface StepGuide {
  title: string;
  body: string;
  /** Concrete instances of the thing being chosen, when naming a few helps. */
  examples?: string[];
}

/** One screen each, in this order. Three or four choices a screen, label only. */
export const intentQuestions: IntentQuestion[] = [
  {
    id: 'money',
    asks: 'program-shape',
    prompt: 'How does money move?',
    multiple: false,
    icon: 'credit-card',
    lead: '',
    options: [
      { id: 'funds-others', label: 'We fund projects others deliver', journeys: ['funding-sources', 'organizations', 'program-shape'], phrase: 'funds projects that partners deliver' },
      { id: 'delivers', label: 'We deliver our own projects', journeys: ['lifecycle', 'program-shape'], phrase: 'delivers its own projects' },
      { id: 'both', label: 'Both', journeys: ['funding-sources', 'organizations', 'lifecycle', 'program-shape'], phrase: 'funds and delivers projects' },
    ],
    guide: {
      title: 'Funder, implementer, or both',
      body: 'A funder tracks awards, obligations and grantee reporting. An implementer tracks its own project pipeline and delivery. Both keeps the two ledgers in one program.',
    },
  },
  {
    id: 'work',
    asks: 'documents',
    prompt: 'What kind of work do you do?',
    multiple: true,
    icon: 'trees',
    lead: 'working on',
    options: [
      { id: 'habitat', label: 'Habitat restoration', journeys: ['classifications', 'measures'], phrase: 'habitat restoration' },
      { id: 'water', label: 'Water quality and supply', journeys: ['classifications', 'measures'], phrase: 'water quality and supply' },
      { id: 'land', label: 'Land protection', journeys: ['classifications', 'spatial-areas'], phrase: 'land protection' },
      { id: 'planning', label: 'Planning and monitoring', journeys: ['classifications'], phrase: 'planning and monitoring' },
    ],
    guide: {
      title: 'Work types become project types',
      body: 'Each kind of work seeds a project type and the performance measures that usually go with it. Pick every one your projects fall under.',
      examples: ['Habitat restoration: fish passage, riparian planting', 'Water: instream flow leases, irrigation efficiency'],
    },
    ask: { label: 'Another kind of work', placeholder: 'Wildfire fuels reduction, outreach and education' },
  },
  {
    id: 'goals',
    asks: 'documents',
    prompt: 'What should ProjectFirma do for you?',
    multiple: true,
    icon: 'star',
    lead: 'using ProjectFirma to',
    options: [
      { id: 'track-funding', label: 'Track funding and spending', journeys: ['funding-sources'], phrase: 'track funding' },
      { id: 'report', label: 'Report to funders and the board', journeys: ['measures', 'classifications'], phrase: 'report results' },
      { id: 'coordinate', label: 'Coordinate with partners', journeys: ['organizations', 'people'], phrase: 'coordinate partners' },
      { id: 'share', label: 'Share our work publicly', journeys: ['appearance', 'spatial-areas'], phrase: 'share work publicly' },
    ],
    guide: {
      title: 'Goals decide what opens first',
      body: 'Tracking money opens funding sources. Reporting opens measures. Coordinating opens partner accounts. Sharing opens the public site and map.',
    },
  },
  {
    id: 'slices',
    asks: 'documents',
    prompt: 'How do you group projects?',
    multiple: true,
    icon: 'folder',
    lead: 'grouped by',
    options: [
      { id: 'focal-species', label: 'Focal species', journeys: ['classifications'], classification: 'Focal species', phrase: 'focal species' },
      { id: 'project-types', label: 'Project types', journeys: ['classifications'], classification: 'Project type', phrase: 'project type' },
      { id: 'limiting-factors', label: 'Limiting factors', journeys: ['classifications'], classification: 'Limiting factor', phrase: 'limiting factor' },
      { id: 'program-areas', label: 'Program areas', journeys: ['classifications'], classification: 'Program area', phrase: 'program area' },
    ],
    guide: {
      title: 'Groupings become classifications',
      body: 'Each grouping is a tag every project carries and a filter on every list, map and report. Pick the ones your reporting already uses.',
      examples: ['Focal species: steelhead, bull trout', 'Project type: fish passage, riparian planting', 'Limiting factor: temperature, sediment'],
    },
    ask: { label: 'Another way you group projects', placeholder: 'Grant round, priority tier, watershed council' },
  },
  {
    id: 'map',
    asks: 'documents',
    prompt: 'What draws your map?',
    multiple: true,
    icon: 'map-pin',
    lead: 'mapped by',
    options: [
      { id: 'watersheds', label: 'Watersheds', journeys: ['spatial-areas'], phrase: 'watershed' },
      { id: 'counties', label: 'Counties', journeys: ['spatial-areas'], phrase: 'county' },
      { id: 'own-boundaries', label: 'Our own boundaries', journeys: ['spatial-areas'], phrase: 'your own boundaries' },
    ],
    guide: {
      title: 'Areas the map is drawn by',
      body: 'Every project sits inside these areas and totals roll up by them. Watersheds and counties come pre-drawn. Your own boundaries are uploaded as shapefiles later.',
      examples: ['Watershed: Whychus Creek', 'County: Deschutes, Jefferson'],
    },
    ask: { label: 'Another kind of area', placeholder: 'HUC-12 subbasins, irrigation districts, reaches' },
  },
  {
    id: 'time',
    asks: 'program-shape',
    prompt: 'How do you count years?',
    multiple: false,
    icon: 'calendar',
    lead: 'reporting by',
    options: [
      { id: 'calendar', label: 'Calendar year, January 1 to December 31', journeys: [], phrase: 'calendar year' },
      { id: 'fiscal-july', label: 'Fiscal year, July 1 to June 30', journeys: ['funding-sources'], phrase: 'July-to-June fiscal year' },
      { id: 'fiscal-october', label: 'Federal fiscal year, October 1 to September 30', journeys: ['funding-sources'], phrase: 'federal fiscal year' },
      { id: 'biennium', label: 'Biennium', journeys: ['funding-sources', 'lifecycle'], phrase: 'biennium' },
    ],
    guide: {
      title: 'The reporting period',
      body: 'Every report frames funding, spending and progress by this period. Oregon and Washington budget by biennium; federal awards run October to September.',
      examples: ['Fiscal year: July 2025 to June 2026', 'Biennium: 2025 to 2027'],
    },
    ask: { label: 'A different period', placeholder: 'Water year, grant cycle' },
  },
  {
    id: 'proposals',
    asks: 'program-shape',
    prompt: 'Do projects start as proposals?',
    multiple: false,
    icon: 'file-text',
    lead: '',
    options: [
      { id: 'yes', label: 'Yes, proposals are approved before they become projects', journeys: ['lifecycle'], phrase: 'starts projects as proposals' },
      { id: 'no', label: 'No, there is no proposal stage', journeys: [], phrase: 'does not use proposals' },
    ],
    guide: {
      title: 'Proposals before projects',
      body: 'Yes turns on the Proposal stage: ideas are entered and approved before they count as projects. No starts every project in Planning and design or later.',
    },
  },
  {
    id: 'measures',
    asks: 'documents',
    prompt: 'Do you report performance measures?',
    multiple: false,
    icon: 'trending-up',
    lead: '',
    options: [
      { id: 'yes', label: 'Yes', journeys: ['measures'], phrase: 'reporting performance measures' },
      { id: 'not-yet', label: 'Not yet', journeys: [], phrase: 'not reporting performance measures yet' },
    ],
    guide: {
      title: 'Numbers each project reports',
      body: 'A performance measure is a quantity reported per project and summed for the program, like miles of stream opened or acres treated.',
      examples: ['Miles of stream opened', 'Acres of riparian planting', 'Fish passage barriers removed'],
    },
    ask: { label: 'Measures you already report', placeholder: 'Acres treated, stream miles opened, barriers removed' },
  },
  {
    id: 'reporters',
    asks: 'documents',
    prompt: 'Who enters project data?',
    multiple: false,
    icon: 'users',
    lead: 'with data entered by',
    options: [
      { id: 'staff', label: 'Our staff only', journeys: ['people'], phrase: 'your staff' },
      { id: 'partners', label: 'Staff and partner organizations', journeys: ['people', 'organizations'], phrase: 'your staff and partner organizations' },
    ],
    guide: {
      title: 'Who gets an account',
      body: 'Staff get full access. Partner organizations get accounts limited to their own projects, which adds every partner to the organizations roster.',
    },
  },
];

const joinAnd = (parts: string[]): string =>
  parts.length <= 1 ? (parts[0] ?? '') : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;

/**
 * Options a question can be answered with: the authored ones, plus anything typed
 * into its ask field and kept in the draft. `custom` is the draft's
 * customIntentOptions map; callers without a draft pass nothing.
 */
const optionsWithCustom = (question: IntentQuestion, custom: Record<string, IntentOption[]>): IntentOption[] => [
  ...question.options,
  ...(custom[question.id] ?? []),
];

/** The questions one milestone's walk asks, in screen order. */
export const intentQuestionsFor = (asks: IntentMilestone): IntentQuestion[] =>
  intentQuestions.filter((question) => question.asks === asks);

/**
 * One sentence composed from the answers, for a confirm screen. Only answered
 * questions contribute, in screen order; an empty answer set yields ''. `asks`
 * limits the sentence to one milestone's questions; omitted, every question counts.
 */
export const composeIntentSummary = (
  answers: Record<string, string[]>,
  custom: Record<string, IntentOption[]> = {},
  asks?: IntentMilestone,
): string => {
  const clauses: string[] = [];
  for (const question of asks ? intentQuestionsFor(asks) : intentQuestions) {
    const chosen = optionsWithCustom(question, custom).filter((o) => (answers[question.id] ?? []).includes(o.id));
    if (!chosen.length) continue;
    const phrases = joinAnd(chosen.map((o) => o.phrase));
    clauses.push(question.lead ? `${question.lead} ${phrases}` : phrases);
  }
  if (!clauses.length) return '';
  return `${tenantOrganization.name} ${clauses.join(', ')}.`;
};

export const intentQuestionById = (id: string): IntentQuestion | undefined => intentQuestions.find((q) => q.id === id);

/** Journeys the given answers make relevant. `answers` maps question id to chosen option ids. */
export const journeysFromIntent = (
  answers: Record<string, string[]>,
  custom: Record<string, IntentOption[]> = {},
): Set<JourneyKey> => {
  const keys = new Set<JourneyKey>();
  for (const question of intentQuestions) {
    const chosen = answers[question.id] ?? [];
    for (const option of optionsWithCustom(question, custom)) {
      if (!chosen.includes(option.id)) continue;
      for (const j of option.journeys) keys.add(j);
    }
  }
  return keys;
};

/** Classifications the answers call for, by name, for the classifications hex's count. */
export const classificationsFromIntent = (
  answers: Record<string, string[]>,
  custom: Record<string, IntentOption[]> = {},
): string[] => {
  const names: string[] = [];
  for (const question of intentQuestions) {
    const chosen = answers[question.id] ?? [];
    for (const option of optionsWithCustom(question, custom)) {
      if (chosen.includes(option.id) && option.classification) names.push(option.classification);
    }
  }
  return names;
};

/** Guidance for the two screens that are not intent questions. */
export const stepGuides: Record<'documents' | 'confirm', StepGuide> = {
  documents: {
    title: 'Documents worth bringing',
    body: 'Each one names organizations, funding sources, measures and projects that setup proposes instead of asking for.',
    examples: ['Grant agreement', 'Project tracking spreadsheet', 'Annual report', 'Partner roster'],
  },
  confirm: {
    title: 'What opens next',
    body: 'Setup opens with the milestones these answers call for marked as suggested. Any of them can be skipped or finished later.',
  },
};

/** The journeys a question's options can light, for the guide's "Sets up" list. */
export const journeysForQuestion = (question: IntentQuestion): SetupJourney[] => {
  const keys = new Set(question.options.flatMap((o) => o.journeys));
  return journeys.filter((j) => keys.has(j.key));
};

// ---------------------------------------------------------------------------
// Funding sources
// ---------------------------------------------------------------------------
//
// THE RECORD IS dbo.FundingSource: FundingSourceName (required, unique within the
// tenant), OrganizationName (required, free text — a transitional column, not a
// key into dbo.Organization; FIRMA-27 tracks the join), IsActive. TotalAward is a
// PROPOSED column, not in the schema today: it exists so a fund's ceiling can be
// priced against every project that draws on it, which nothing else in the model
// can do. The setup screen writes OrganizationName from the confirmed
// organizations roster rather than from free text, because a funder IS an
// organization (see the journey order above) and the Organizations screen already
// cut free text for the same reason; the column stays a string either way.
//
// A COMMITMENT (dbo.ProjectFundingSource: one Amount per Project + FundingSource
// + Tenant) IS NOT SETUP. It is entered on the project record, from the Funding
// sources card (firma2-project-funding, store in src/lib/funding-commitment-draft.ts).
// Setup configures the reference list a project's funding table picks from; the
// rows that use it are the product's ongoing work. Andy, 2026-09-18: "individual
// data connections between a project and funding source feel like the ongoing
// maintenance and use of the platform." Expenditures
// (dbo.ProjectFundingSourceExpenditure, per calendar year) are outside setup too.
//
// WHERE THE SUGGESTIONS COME FROM. The Start step's canned extraction lists four
// funding-source candidates (extractedCandidates above); these are the same four
// with the fields the documents would carry. The award is present only where the
// document kind would state one: a grant agreement names its award, an annual
// report names a grant's size, a project tracker's cost-share line does not, and
// donations have no ceiling.

export type FundingSourceSource = 'document' | 'manual';

export type FundingSourceStatus = 'suggested' | 'confirmed' | 'dismissed';

export interface FundingSource {
  id: string;
  /** dbo.FundingSource.FundingSourceName. */
  name: string;
  /** dbo.FundingSource.OrganizationName: the administering organization, by name. */
  organizationName: string;
  /** Proposed dbo.FundingSource.TotalAwardAmount, whole dollars. Absent when the fund has no fixed total. */
  totalAward?: number;
  source: FundingSourceSource;
  /** The document the name was found in, for `document`-sourced suggestions. */
  sourceDocumentId?: string;
  status: FundingSourceStatus;
}

export const suggestedFundingSources: FundingSource[] = [
  {
    id: 'oweb-2024-award',
    name: 'OWEB 2024 award',
    organizationName: 'Oregon Watershed Enhancement Board',
    totalAward: 450000,
    source: 'document',
    sourceDocumentId: 'grant-agreement',
    status: 'suggested',
  },
  {
    id: 'salmon-recovery-grant-2023',
    name: 'Salmon Recovery grant 2023',
    organizationName: 'National Fish and Wildlife Foundation',
    totalAward: 100000,
    source: 'document',
    sourceDocumentId: 'annual-report-2025',
    status: 'suggested',
  },
  {
    id: 'private-donations',
    name: 'Private donations',
    organizationName: 'Cascade Headwaters Partnership',
    source: 'document',
    sourceDocumentId: 'annual-report-2025',
    status: 'suggested',
  },
  {
    id: 'irrigation-efficiency-cost-share',
    name: 'Irrigation efficiency cost-share',
    organizationName: 'Deschutes Soil and Water Conservation District',
    source: 'document',
    sourceDocumentId: 'project-tracker',
    status: 'suggested',
  },
];

export interface FundingSourceFields {
  name: string;
  organizationName: string;
  totalAward?: number;
}

/** Mints a funding source from the create dialog's three fields: `manual`, and already confirmed. */
export const fundingSourceFromFields = (fields: FundingSourceFields): FundingSource => {
  const name = fields.name.trim().replace(/\s+/g, ' ');
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return {
    id: `manual-${slug}`,
    name,
    organizationName: fields.organizationName.trim(),
    totalAward: fields.totalAward,
    source: 'manual',
    status: 'confirmed',
  };
};


// ---------------------------------------------------------------------------
// Project stages
// ---------------------------------------------------------------------------
//
// THE RECORD IS dbo.ProjectStage: six global rows with assigned IDs and a
// canonical order. A tenant cannot rename, add, or reorder them; the portfolio's
// ProjectStage and STAGE_ORDER (src/data/firma2-projects.ts) are the same six.
// So setup authors no stage. What it captures is two PREFERENCES:
//
//   which of the six the program uses   a proposed dbo.TenantProjectStage in the
//                                       feature-flag shape (tenant + stage, on or
//                                       off). No such table exists yet.
//   where new projects start            a create-project default. No
//                                       create-project endpoint exists yet, so
//                                       this preference has nowhere to write
//                                       until FIRMA builds one.
//
// NOT SETUP: proposal approval, and public or protected visibility of pending
// proposals. dbo.Project has no approval-status or visibility column, and Public
// would need an anonymous read surface the app does not have. Recorded in the
// teammate's 2026-09-23 "Project Stages Setup" x-ray.
//
// WHERE THE SUGGESTIONS COME FROM. The tracker's Status column (extractedCandidates,
// journey 'lifecycle') mapped onto the fixed stages by trackerStatusToStage. A
// stage no tracker value lands in is still offered, because the six are fixed;
// its trackerStatuses is empty and the tile carries no provenance line.

export type StageStatus = 'suggested' | 'confirmed' | 'dismissed';

export interface StageOption {
  /** Slug of the stage name; stable id for the draft. */
  id: 'proposal' | 'planning-design' | 'implementation' | 'post-implementation' | 'completed' | 'deferred';
  /** dbo.ProjectStage.ProjectStageDisplayName; the portfolio's ProjectStage. */
  name: ProjectStage;
  /** One line, what a project in this stage is doing. Under 80 characters. */
  definition: string;
  /** Tracker Status values (extractedCandidates, journey 'lifecycle') that land in this stage. Empty when none does. */
  trackerStatuses: string[];
  /** Seed 'suggested'; the draft patches it. */
  status: StageStatus;
}

/** Tracker Status value -> StageOption id. The guess the picker shows as provenance. */
export const trackerStatusToStage: Record<string, StageOption['id']> = {
  'Proposed': 'proposal',
  'Funded': 'planning-design',
  'In construction': 'implementation',
  'Complete': 'completed',
  'Monitoring': 'post-implementation',
};

const STAGE_ID: Record<ProjectStage, StageOption['id']> = {
  'Proposal': 'proposal',
  'Planning & Design': 'planning-design',
  'Implementation': 'implementation',
  'Post-Implementation': 'post-implementation',
  'Completed': 'completed',
  'Deferred': 'deferred',
};

// Deferred is the one exception to the linear order: a project can pause from
// any stage, so its definition says so.
const STAGE_DEFINITION: Record<StageOption['id'], string> = {
  'proposal': 'Proposed, not yet approved or funded.',
  'planning-design': 'Approved and in design, permitting, and agreements.',
  'implementation': 'Construction, planting, or treatment is underway.',
  'post-implementation': 'Built; monitoring and maintenance continue.',
  'completed': 'Closed out; no work or reporting remains.',
  'deferred': 'On hold; a project can pause here from any other stage.',
};

/** The six fixed stages in STAGE_ORDER, with trackerStatuses derived from extractedCandidates via trackerStatusToStage. */
export const stageOptions: StageOption[] = STAGE_ORDER.map((name) => {
  const id = STAGE_ID[name];
  return {
    id,
    name,
    definition: STAGE_DEFINITION[id],
    trackerStatuses: extractedCandidates
      .filter((c) => c.journey === 'lifecycle' && trackerStatusToStage[c.label] === id)
      .map((c) => c.label),
    status: 'suggested',
  };
});

// ---------------------------------------------------------------------------
// Classifications
// ---------------------------------------------------------------------------
//
// THE RECORD IS dbo.Classification: ClassificationName, ClassificationDescription,
// tenant-scoped, a flat list. A classification is what a project is FOR, the
// outcome a board asks about, not what kind of work it is; the work type lives
// on Project.program (the taxonomy tier).
//
// THE TENANT'S ONE PREFERENCE is how many classifications a project may carry.
// One: totals add up across the portfolio. Two: a project counts toward both.
// More than two makes dollar and acre rollups multiply, so the choice stops there.
//
// NOT SETUP: the reporting calendar (it belongs to program-shape) and draft
// performance measures (the measures journey). The teammate's 2026-09-23
// "Classifications Interview" specimen carried both.
//
// WHERE THE SUGGESTIONS COME FROM. The tracker's Program area column
// (extractedCandidates, journey 'classifications'); these are the same five, as
// document-sourced records. A spreadsheet column holds values, not definitions,
// so no suggestion carries a description. Intent answers to the `slices` question
// name classification SYSTEMS (Focal species, Program area), not values, so they
// are not candidates here.

export type ClassificationSource = 'document' | 'manual';

export type ClassificationStatus = 'suggested' | 'confirmed' | 'dismissed';

export type ClassificationLimit = 1 | 2;

export interface ClassificationRecord {
  id: string;
  /** dbo.Classification.ClassificationName. */
  name: string;
  /** dbo.Classification.ClassificationDescription; optional, one line. */
  description?: string;
  source: ClassificationSource;
  /** The document the name was found in, for `document`-sourced suggestions. */
  sourceDocumentId?: string;
  status: ClassificationStatus;
}

const slugify = (text: string): string => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** The tracker's five Program area values, source 'document', status 'suggested', ids slugged from the label. */
export const suggestedClassifications: ClassificationRecord[] = extractedCandidates
  .filter((c) => c.journey === 'classifications')
  .map((c) => ({
    id: slugify(c.label),
    name: c.label,
    source: 'document',
    sourceDocumentId: c.sourceDocumentId,
    status: 'suggested',
  }));

export interface ClassificationFields {
  name: string;
  description?: string;
}

/** Mints a classification from the create dialog's fields: `manual-<slug>`, `manual`, and already confirmed. */
export const classificationFromFields = (fields: ClassificationFields): ClassificationRecord => {
  const name = fields.name.trim().replace(/\s+/g, ' ');
  const description = fields.description?.trim().replace(/\s+/g, ' ');
  return {
    id: `manual-${slugify(name)}`,
    name,
    ...(description ? { description } : {}),
    source: 'manual',
    status: 'confirmed',
  };
};

// ---------------------------------------------------------------------------
// Spatial areas
// ---------------------------------------------------------------------------
//
// THE RECORD IS dbo.GeospatialAreaType (the layer: a kind, and where its
// boundaries come from) and dbo.GeospatialArea (a named area of one type, with
// geometry). Setup names the areas and their kind, and answers two questions
// once for the program: where boundaries come from, and what happens to a
// project that falls outside all of them.
//
// NOT SETUP: the geometry itself. A published source, an uploaded file, or a map
// service supplies it; the upload and service screens and the GIS handoff link
// are product work. Nor a project's location and area membership: both are
// computed on the record, which is why the teammate's 2026-09-23 "Five Doors"
// mock says each layer "costs a reporter nothing". A program with no areas is a
// valid outcome: every project sits on a point.
//
// WHERE THE SUGGESTIONS COME FROM. The annual report's map (extractedCandidates,
// journey 'spatial-areas'): four subbasins, all of kind watershed. Start's intent
// `map` question names KINDS (Watersheds, Counties, Our own boundaries), not
// areas, so it is not a candidate source here.

export type SpatialAreaKind = 'watershed' | 'county' | 'own';

/** Labels for the add screen's select and the roster's Kind column. Under 20 chars. */
export const spatialAreaKinds: { id: SpatialAreaKind; label: string }[] = [
  { id: 'watershed', label: 'Watershed' },
  { id: 'county', label: 'County or district' },
  { id: 'own', label: 'Our own unit' },
];

export const spatialAreaKindLabel = (kind: SpatialAreaKind): string =>
  spatialAreaKinds.find((k) => k.id === kind)?.label ?? kind;

export type SpatialAreaSource = 'document' | 'manual';

export type SpatialAreaStatus = 'suggested' | 'confirmed' | 'dismissed';

export interface SpatialAreaRecord {
  id: string;
  /** dbo.GeospatialArea.GeospatialAreaName. */
  name: string;
  /** The layer the area belongs to: dbo.GeospatialAreaType. */
  kind: SpatialAreaKind;
  source: SpatialAreaSource;
  /** The document the name was found in, for `document`-sourced suggestions. */
  sourceDocumentId?: string;
  status: SpatialAreaStatus;
}

/** The annual report's four subbasins, kind 'watershed', source 'document', status 'suggested'. */
export const suggestedSpatialAreas: SpatialAreaRecord[] = extractedCandidates
  .filter((c) => c.journey === 'spatial-areas')
  .map((c) => ({
    id: slugify(c.label),
    name: c.label,
    kind: 'watershed',
    source: 'document',
    sourceDocumentId: c.sourceDocumentId,
    status: 'suggested',
  }));

export interface SpatialAreaFields {
  name: string;
  kind: SpatialAreaKind;
}

/** Mints an area from the add screen's fields: `manual-<slug>`, `manual`, and already confirmed. */
export const spatialAreaFromFields = (fields: SpatialAreaFields): SpatialAreaRecord => {
  const name = fields.name.trim().replace(/\s+/g, ' ');
  return {
    id: `manual-${slugify(name)}`,
    name,
    kind: fields.kind,
    source: 'manual',
    status: 'confirmed',
  };
};

export type BoundarySource = 'published' | 'file' | 'service' | 'gis';

/** Radio options for the boundaries screen; `note` is the consequence folded after the label. */
export const boundarySources: { id: BoundarySource; label: string; note: string }[] = [
  { id: 'published', label: 'Use a published source', note: 'watersheds, counties, districts and tribal lands are free' },
  { id: 'file', label: 'Upload a file', note: 'a shapefile, GeoJSON or KML from your GIS' },
  { id: 'service', label: 'Connect a map service', note: 're-syncs on demand' },
  { id: 'gis', label: 'Our GIS person has it', note: 'nothing else waits on it' },
];

export type OutsidePolicy = 'catch-all' | 'blank';

/** Radio options for the outside screen, the recommended catch-all first. */
export const outsidePolicies: { id: OutsidePolicy; label: string; note: string }[] = [
  { id: 'catch-all', label: 'Count it as Outside the region', note: 'every project is accounted for' },
  { id: 'blank', label: 'Leave it blank', note: 'area totals run short' },
];

/** The catch-all area the `catch-all` policy adds; derived, never stored as a record. */
export const OUTSIDE_AREA_NAME = 'Outside the region';

// ---------------------------------------------------------------------------
// Import projects — the portfolio's first fill
// ---------------------------------------------------------------------------
//
// WHAT A PROJECT IS HERE: a row of dbo.Project, as the tracking spreadsheet
// (sampleDocuments 'project-tracker') already holds it. The candidates are the
// portfolio's own `projects` (src/data/firma2-projects.ts), because that module
// IS the tracker's contents in this prototype: same names, same programs, same
// lead organizations. The milestone reads them and asks which come in; it
// authors nothing, so there is no ProjectFields and no fromFields here.
//
// THE STATUS IS THE SAME THREE WORDS AS EVERY OTHER RECORD MILESTONE. A row the
// spreadsheet proposed is `suggested`; the admin's answer makes it `confirmed`
// or `dismissed`. Dismissed is not deleted: the row is still in the file and
// the review screen's Remove puts it back to suggested.

export type ProjectImportStatus = 'suggested' | 'confirmed' | 'dismissed';

/** One tracker row on the import screens: the project as authored, keyed by its slug. */
export interface ImportProject {
  id: string;
  project: Project;
  status: ProjectImportStatus;
  /** The document that proposed the row; every tracker row is the spreadsheet's. */
  sourceDocumentId: string;
}

// ---------------------------------------------------------------------------
// Program shape
// ---------------------------------------------------------------------------
//
// THE RECORD IS three tenant rules with schema consequences:
//
//   the reporting period       dbo.Tenant's reporting year: the period every
//                              report frames funding, spending and progress by
//   whether proposals exist    whether dbo.ProjectStage 'Proposal' is in use,
//                              which the Project stages milestone then honours
//   how money moves            the default lead implementer: the tenant itself
//                              when it delivers its own projects
//
// The three are intent questions (asks: 'program-shape' above), so the answers
// live in draft.intent beside Start's and journeysFromIntent reads them alike.
//
// NOT SETUP: who approves a proposal (dbo.Project has no approver column;
// Stacy's 2026-09-23 x-ray) and the report that consumes the period, which is
// product work that reads this answer rather than a setup screen.
//
// WHERE THE ANSWERS COME FROM. The grant agreement (its fiscal year), the
// tracker (no proposal rows: every project is funded before it appears) and the
// annual report (the partnership implements its own work with partners). Each
// is one extractedCandidates row, journey 'program-shape'; programShapeEvidence
// maps it onto the option it argues for. The walk pre-selects that option on an
// unanswered question once documents are uploaded and shows the label with its
// document, so the admin confirms a rule instead of recalling it.
//
// Decision 2026-09-23: these three questions moved out of Start so Start asks
// only what the program does.

export type ProgramShapeQuestionId = 'money' | 'time' | 'proposals';

export interface ProgramShapeEvidence {
  questionId: ProgramShapeQuestionId;
  /** The option the evidence argues for; an id in that question's options. */
  optionId: string;
  sourceDocumentId: string;
  /** The extractedCandidates label, shown as the provenance line. */
  label: string;
}

/** One piece of document evidence per program-shape question, in screen order. */
export const programShapeEvidence: ProgramShapeEvidence[] = [
  { questionId: 'money', optionId: 'both', sourceDocumentId: 'annual-report-2025', label: 'Implements its own projects with partners' },
  { questionId: 'time', optionId: 'fiscal-july', sourceDocumentId: 'grant-agreement', label: 'Fiscal year July 1 to June 30' },
  { questionId: 'proposals', optionId: 'no', sourceDocumentId: 'project-tracker', label: 'No proposal cycle in the tracker' },
];

// ---------------------------------------------------------------------------
// Names and appearance
// ---------------------------------------------------------------------------
//
// THE RECORD IS dbo.Tenant attributes: display name, short name, square logo,
// primary color, and the public-site flag; plus the FieldDefinition label for
// "Project" (ProjectFirma's Labels and Definitions), which renames the noun on
// every page, list and report.
//
// FOUR DECISIONS: the names (with the logo beside them), the project noun, the
// color, and who can see the site. Each is null in the draft until answered, and
// keeping a default is an answer: the walk writes the default value, it does not
// leave null, so "kept Project" and "not asked yet" stay distinguishable.
//
// NOT SETUP: the banner logo, a custom stylesheet, custom pages. They are site
// administration after go-live, not what a tenant needs to open.
//
// WHERE THE SUGGESTIONS COME FROM. The tenant's own directory entry
// (tenantOrganization: its name, and its mark in the org directory, which is the
// logo until one is uploaded); the annual report ('Projects are called
// "restoration actions"', 'Wordmark on report cover'); and Start's "Share our
// work publicly" answer, which suggests a public site.

/** A primary color the tenant can pick. The milestone band tints from a hue, so a hue is the whole color. */
export interface TenantColor {
  id: string;
  /** Plain name, one word. */
  label: string;
  /** oklch hue angle, 0 to 360. */
  hue: number;
}

/** Eight swatches spread around the wheel, 40 to 50 degrees apart, warm to cool. */
export const tenantColors: TenantColor[] = [
  { id: 'rust', label: 'Rust red', hue: 30 },
  { id: 'amber', label: 'Amber yellow', hue: 75 },
  { id: 'moss', label: 'Moss green', hue: 120 },
  { id: 'pine', label: 'Forest green', hue: 160 },
  { id: 'glacier', label: 'Glacier blue', hue: 200 },
  { id: 'river', label: 'River blue', hue: 245 },
  { id: 'iris', label: 'Iris purple', hue: 290 },
  { id: 'berry', label: 'Berry pink', hue: 335 },
];

/** The FieldDefinition label for "Project", both forms. */
export interface ProjectNoun {
  singular: string;
  plural: string;
}

export const defaultProjectNoun: ProjectNoun = { singular: 'Project', plural: 'Projects' };

/** What the annual report calls its projects. */
export const suggestedProjectNoun: { noun: ProjectNoun; sourceDocumentId: string } = {
  noun: { singular: 'Restoration action', plural: 'Restoration actions' },
  sourceDocumentId: 'annual-report-2025',
};

export type SiteVisibility = 'public' | 'signed-in';

/** Radio options for who can see the site; `note` is the consequence folded after the label. */
export const siteVisibilities: { id: SiteVisibility; label: string; note: string }[] = [
  { id: 'public', label: 'Public site', note: 'anyone can browse projects and the map without an account' },
  { id: 'signed-in', label: 'Signed-in only', note: 'only people with an account see anything' },
];

/** What Start's answers suggest for visibility: public when a goal is sharing work, otherwise no suggestion. */
export const suggestedSiteVisibility = (answers: Record<string, string[]>): SiteVisibility | null =>
  (answers.goals ?? []).includes('share') ? 'public' : null;

export interface TenantAppearanceDefaults {
  /** dbo.Tenant display name. */
  name: string;
  /** dbo.Tenant short name: the header and page titles when space is tight. */
  shortName: string;
  /** Directory id whose mark is the logo until one is uploaded (directoryById in firma2-org-directory). */
  logoOrganizationId: string;
}

/** Derived from tenantOrganization: the full name, the name without its "Partnership", its directory mark. */
export const tenantAppearanceDefaults: TenantAppearanceDefaults = {
  name: tenantOrganization.name,
  shortName: tenantOrganization.name.replace(/\s+Partnership$/, ''),
  logoOrganizationId: tenantOrganization.id,
};

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------
//
// THE RECORD IS dbo.Person: name, email, organization, role (admin, editor,
// viewer). Plus the tenant's stewardship model, ProjectFirma's project
// stewardship by organization: whether partner organizations edit the projects
// they lead, or staff edit everything.
//
// NOT SETUP: sending invitations, and authentication. The walk stages a list;
// the product sends the invitations and owns sign-in.
//
// WHERE THE SUGGESTIONS COME FROM. The staff named in the annual report
// (extractedCandidates, journey 'people', "Name, title"); every one belongs to
// the tenant. Dana Whitfield is the admin doing setup, so she arrives confirmed
// as admin; the rest arrive suggested as editors. Start's "Who enters project
// data?" answer seeds the stewardship preference (stewardshipFromIntent). The
// organization select reads the Organizations milestone's confirmed roster,
// which is why this journey dependsOn organizations.

export type PersonRole = 'admin' | 'editor' | 'viewer';

/** Role options; `note` is what the role can do, folded after the label. */
export const personRoles: { id: PersonRole; label: string; note: string }[] = [
  { id: 'admin', label: 'Admin', note: 'manages setup, people and every project' },
  { id: 'editor', label: 'Editor', note: 'edits projects and reports progress' },
  { id: 'viewer', label: 'Viewer', note: 'sees every project, changes nothing' },
];

export type PersonSource = 'document' | 'manual';

export type PersonStatus = 'suggested' | 'confirmed' | 'dismissed';

export interface PersonRecord {
  id: string;
  /** dbo.Person first and last name, as one string. */
  name: string;
  /** Job title as the document gives it. Not a dbo.Person column; shown to tell people apart. */
  title?: string;
  /** dbo.Person.Email. Absent until the admin types it; an invitation needs one. */
  email?: string;
  /** dbo.Person.OrganizationID, as an Organization id. */
  organizationId: string;
  role: PersonRole;
  source: PersonSource;
  /** The document the name was found in, for `document`-sourced suggestions. */
  sourceDocumentId?: string;
  status: PersonStatus;
}

const THE_ADMIN = 'Dana Whitfield';

/** The report's six named staff, all of the tenant: Dana confirmed as admin, the rest suggested as editors. */
export const suggestedPeople: PersonRecord[] = extractedCandidates
  .filter((c) => c.journey === 'people')
  .map((c) => {
    const [name, title = ''] = c.label.split(/,\s*/);
    const admin = name === THE_ADMIN;
    return {
      id: slugify(name),
      name,
      ...(title ? { title: title.charAt(0).toUpperCase() + title.slice(1) } : {}),
      organizationId: tenantOrganization.id,
      role: admin ? 'admin' : 'editor',
      source: 'document',
      sourceDocumentId: c.sourceDocumentId,
      status: admin ? 'confirmed' : 'suggested',
    };
  });

export interface PersonFields {
  name: string;
  email?: string;
  organizationId: string;
  role: PersonRole;
}

/** Mints a person from the add screen's fields: `manual-<slug>`, `manual`, and already confirmed. */
export const personFromFields = (fields: PersonFields): PersonRecord => {
  const name = fields.name.trim().replace(/\s+/g, ' ');
  const email = fields.email?.trim();
  return {
    id: `manual-${slugify(name)}`,
    name,
    ...(email ? { email } : {}),
    organizationId: fields.organizationId,
    role: fields.role,
    source: 'manual',
    status: 'confirmed',
  };
};

export type Stewardship = 'staff' | 'partners';

/** Radio options for who edits projects; `note` is the consequence folded after the label. */
export const stewardships: { id: Stewardship; label: string; note: string }[] = [
  { id: 'staff', label: 'Our staff edit every project', note: 'partners can see their projects but not change them' },
  { id: 'partners', label: 'Partners edit their own projects', note: 'each partner organization keeps the projects it leads current' },
];

/** Start's reporters answer as a stewardship suggestion; null when unanswered or typed in. */
export const stewardshipFromIntent = (answers: Record<string, string[]>): Stewardship | null => {
  const answer = (answers.reporters ?? [])[0];
  return answer === 'staff' || answer === 'partners' ? answer : null;
};
