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
  | 'first-project'
  | 'measures';

export type JourneyTier = 'foundation' | 'build' | 'go-live';

/**
 * A journey's state on the hub, and the hex's state on the map.
 *
 *   locked      a dependency is unmet — the hex is faint and not a link
 *   untouched   nothing known yet — flat gray
 *   suggested   documents produced candidates awaiting review — outlined
 *   in-progress some records confirmed, some still open — part filled
 *   confirmed   the journey has what the tenant needs — filled, raised
 */
export type JourneyStatus = 'locked' | 'untouched' | 'suggested' | 'in-progress' | 'confirmed';

export interface SetupJourney {
  key: JourneyKey;
  /** The hub row's name and the hex's label. */
  title: string;
  tier: JourneyTier;
  /** Root-relative, base-less. Omitted for a journey this spoke has not built — renders inert, not as a dead link. */
  route?: string;
  /** Journeys that must be `confirmed` before this one unlocks. Empty for most: build-tier journeys are never locked. */
  dependsOn: JourneyKey[];
  /** Position on the hex map, axial coordinates. Adjacency is meaningful: neighbours depend on each other. */
  hex: { q: number; r: number };
  /** The noun a count on this journey counts — "organizations", "funding sources". */
  unit: string;
  /** esa-icon registry name. */
  icon: string;
  /** Owned by another team this hackathon. Renders on the map as the seam, not as ours to fill. */
  external?: 'mission-6';
}

// Hex layout, reading top to bottom in setup order. Axial (q, r): r is the row,
// q shifts half a hex per row. Documents sits alone at the top, feeding the ring
// beneath it; first project is at the bottom centre, the destination everything
// above it feeds; measures sits at the edge as the hand-off to Mission 6.
export const journeys: SetupJourney[] = [
  {
    key: 'documents',
    title: 'Start',
    tier: 'foundation',
    route: '/prototypes/setup/start',
    dependsOn: [],
    hex: { q: 0, r: -2 },
    unit: 'documents',
    icon: 'upload',
  },
  {
    key: 'program-shape',
    title: 'Program shape',
    tier: 'foundation',
    dependsOn: [],
    hex: { q: 1, r: -2 },
    unit: 'decisions',
    icon: 'settings',
  },
  {
    key: 'organizations',
    title: 'Organizations',
    tier: 'build',
    route: '/prototypes/setup/organizations',
    dependsOn: [],
    hex: { q: -1, r: -1 },
    unit: 'organizations',
    icon: 'users',
  },
  {
    key: 'funding-sources',
    title: 'Funding sources',
    tier: 'build',
    dependsOn: [],
    hex: { q: 0, r: -1 },
    unit: 'funding sources',
    icon: 'database',
  },
  {
    key: 'classifications',
    title: 'Classifications',
    tier: 'build',
    dependsOn: [],
    hex: { q: 1, r: -1 },
    unit: 'classifications',
    icon: 'filter',
  },
  {
    key: 'lifecycle',
    title: 'Project stages',
    tier: 'build',
    dependsOn: [],
    hex: { q: -1, r: 0 },
    unit: 'stages',
    icon: 'activity',
  },
  {
    key: 'spatial-areas',
    title: 'Spatial areas',
    tier: 'build',
    dependsOn: [],
    hex: { q: 0, r: 0 },
    unit: 'areas',
    icon: 'map-pin',
  },
  {
    key: 'appearance',
    title: 'Names and appearance',
    tier: 'build',
    dependsOn: [],
    hex: { q: 1, r: 0 },
    unit: 'settings',
    icon: 'pencil',
  },
  {
    key: 'people',
    title: 'People',
    tier: 'go-live',
    dependsOn: ['organizations'],
    hex: { q: -1, r: 1 },
    unit: 'people',
    icon: 'user',
  },
  {
    key: 'first-project',
    title: 'First project',
    tier: 'go-live',
    route: '/prototypes/projects',
    dependsOn: ['organizations'],
    hex: { q: 0, r: 1 },
    unit: 'projects',
    icon: 'folder',
  },
  {
    key: 'measures',
    title: 'Performance measures',
    tier: 'build',
    route: '/prototypes/performance-measures',
    dependsOn: [],
    hex: { q: 1, r: 1 },
    unit: 'measures',
    icon: 'trending-up',
    external: 'mission-6',
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
    name: 'Columbia Basin Habitat Fund grant agreement 2024.pdf',
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
    id: 'metolius-land-trust',
    name: 'Metolius Land Trust',
    roles: ['Implementer', 'Landowner'],
    location: 'Sisters',
    source: 'document',
    sourceDocumentId: 'project-tracker',
    sourceExcerpt: 'Lead: Metolius Land Trust (11 rows)',
    projectsMentioned: 11,
    status: 'suggested',
  },
  {
    id: 'whychus-creek-watershed-council',
    name: 'Whychus Creek Watershed Council',
    roles: ['Implementer'],
    location: 'Sisters',
    source: 'document',
    sourceDocumentId: 'annual-report-2025',
    sourceExcerpt: 'In partnership with Whychus Creek Watershed Council, eight reaches were reconnected to their floodplain.',
    projectsMentioned: 8,
    status: 'suggested',
  },
  {
    id: 'columbia-basin-habitat-fund',
    name: 'Columbia Basin Habitat Fund',
    roles: ['Funder'],
    location: 'Portland',
    source: 'document',
    sourceDocumentId: 'grant-agreement',
    sourceExcerpt: 'This agreement between Columbia Basin Habitat Fund ("Funder") and Cascade Headwaters Partnership ("Grantee")',
    projectsMentioned: 7,
    status: 'suggested',
  },
  {
    id: 'crooked-river-swcd',
    name: 'Crooked River Soil and Water Conservation District',
    roles: ['Implementer', 'Partner agency'],
    location: 'Prineville',
    source: 'document',
    sourceDocumentId: 'project-tracker',
    sourceExcerpt: 'Lead: Crooked River SWCD (6 rows)',
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
    id: 'northwest-salmon-recovery-foundation',
    name: 'Northwest Salmon Recovery Foundation',
    roles: ['Funder'],
    location: 'Seattle',
    source: 'document',
    sourceDocumentId: 'annual-report-2025',
    sourceExcerpt: 'Funders: Columbia Basin Habitat Fund, Northwest Salmon Recovery Foundation, and private donors.',
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
    id: 'cascade-national-forest',
    name: 'Cascade National Forest',
    roles: ['Partner agency', 'Landowner'],
    location: 'Bend',
    source: 'document',
    sourceDocumentId: 'annual-report-2025',
    sourceExcerpt: 'Work on Cascade National Forest land proceeded under a 2023 stewardship agreement.',
    projectsMentioned: 3,
    status: 'suggested',
  },
  {
    id: 'state-fish-and-wildlife',
    name: 'State Department of Fish and Wildlife',
    roles: ['Partner agency'],
    location: 'Salem',
    source: 'document',
    sourceDocumentId: 'grant-agreement',
    sourceExcerpt: 'Fish passage designs are subject to review by the State Department of Fish and Wildlife.',
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
    id: 'high-desert-anglers',
    name: 'High Desert Anglers',
    roles: ['Implementer'],
    location: 'Bend',
    source: 'document',
    sourceDocumentId: 'annual-report-2025',
    sourceExcerpt: 'Volunteers from High Desert Anglers planted 3,400 willow stakes.',
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
  { journey: 'funding-sources', label: 'Columbia Basin Habitat Fund 2024 award', sourceDocumentId: 'grant-agreement' },
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
  { journey: 'lifecycle', label: 'Proposed', sourceDocumentId: 'project-tracker' },
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
  { journey: 'program-shape', label: 'Fiscal year July to June', sourceDocumentId: 'grant-agreement' },
  // People: named staff in the report.
  { journey: 'people', label: 'Dana Whitfield, program manager', sourceDocumentId: 'annual-report-2025' },
  { journey: 'people', label: 'Five other named staff', sourceDocumentId: 'annual-report-2025' },
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
    prompt: 'Add the two land trusts we work with on the Metolius',
    keywords: ['land trust', 'metolius'],
    organizations: [
      {
        id: 'deschutes-basin-land-trust',
        name: 'Deschutes Basin Land Trust',
        roles: ['Implementer', 'Landowner'],
        location: 'Bend',
        source: 'ask',
        status: 'suggested',
      },
      {
        id: 'black-butte-conservancy',
        name: 'Black Butte Conservancy',
        roles: ['Landowner'],
        location: 'Camp Sherman',
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
        id: 'river-design-group',
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

export interface IntentQuestion {
  id: string;
  /** One line, under 32 characters, asked as the assistant would ask it. */
  prompt: string;
  multiple: boolean;
  /** Registry icon shown above the prompt. */
  icon: string;
  /** Words that precede the chosen phrases in the summary sentence; empty when the phrase stands alone. */
  lead: string;
  options: IntentOption[];
  guide: StepGuide;
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
    id: 'slices',
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
  },
  {
    id: 'map',
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
  },
  {
    id: 'time',
    prompt: 'How do you count years?',
    multiple: false,
    icon: 'calendar',
    lead: 'counted in',
    options: [
      { id: 'funding-years', label: 'Funding years', journeys: ['funding-sources'], phrase: 'funding years' },
      { id: 'bienniums', label: 'Bienniums', journeys: ['funding-sources', 'lifecycle'], phrase: 'bienniums' },
      { id: 'calendar-years', label: 'Calendar years', journeys: [], phrase: 'calendar years' },
    ],
    guide: {
      title: 'The reporting period',
      body: 'Funding, expenditures and progress are reported against this period. Bienniums follow the Oregon and Washington budget cycle. Funding years follow each award.',
      examples: ['Biennium: 2025 to 2027', 'Funding year: FY2026'],
    },
  },
  {
    id: 'measures',
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
  },
  {
    id: 'reporters',
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
 * One sentence composed from the answers, for the confirm screen. Only answered
 * questions contribute, in screen order; an empty answer set yields ''.
 */
export const composeIntentSummary = (answers: Record<string, string[]>): string => {
  const clauses: string[] = [];
  for (const question of intentQuestions) {
    const chosen = question.options.filter((o) => (answers[question.id] ?? []).includes(o.id));
    if (!chosen.length) continue;
    const phrases = joinAnd(chosen.map((o) => o.phrase));
    clauses.push(question.lead ? `${question.lead} ${phrases}` : phrases);
  }
  if (!clauses.length) return '';
  return `${tenantOrganization.name} ${clauses.join(', ')}.`;
};

export const intentQuestionById = (id: string): IntentQuestion | undefined => intentQuestions.find((q) => q.id === id);

/** Journeys the given answers make relevant. `answers` maps question id to chosen option ids. */
export const journeysFromIntent = (answers: Record<string, string[]>): Set<JourneyKey> => {
  const keys = new Set<JourneyKey>();
  for (const question of intentQuestions) {
    const chosen = answers[question.id] ?? [];
    for (const option of question.options) {
      if (!chosen.includes(option.id)) continue;
      for (const j of option.journeys) keys.add(j);
    }
  }
  return keys;
};

/** Classifications the answers call for, by name, for the classifications hex's count. */
export const classificationsFromIntent = (answers: Record<string, string[]>): string[] => {
  const names: string[] = [];
  for (const question of intentQuestions) {
    const chosen = answers[question.id] ?? [];
    for (const option of question.options) {
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
    body: 'Setup opens with the journeys these answers call for marked as suggested. Any of them can be skipped or finished later.',
  },
};

/** The journeys a question's options can light, for the guide's "Sets up" list. */
export const journeysForQuestion = (question: IntentQuestion): SetupJourney[] => {
  const keys = new Set(question.options.flatMap((o) => o.journeys));
  return journeys.filter((j) => keys.has(j.key));
};
