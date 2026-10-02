// The directory — every organization in the workspace and every person with an
// account, in one module because each half counts the other: an organization's
// row says how many people it has, and a person's row names their organization.
//
// DERIVED WHERE THE FIXTURE ALREADY KNOWS. Lead organizations come off the
// project list and funders off the funding table, so the Organizations screen,
// the Projects index and a project's funding sources cannot disagree about who
// exists or what they did. Organization types and Roles (Workspace settings)
// count from here for the same reason. Everything else is INVENTED — names,
// addresses, dates — and never copied or sanitized from a client document.
//
// DETERMINISTIC: every pick is a hash or a stride, never Math.random(), so a
// demo shows the same people in the same places every time.

import { projects } from './firma2-projects';
import { funderPrograms, getProjectDetail } from './firma2-project-detail';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const hashOf = (value: string): number => {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
};

/** The acronym an invented organization's web and mail domains are built on —
 *  the same rule firma2-project-detail uses for contact emails. */
const domainOf = (organization: string): string =>
  organization
    .split(/\s+/)
    .filter((word) => !/^(of|the|and|for|&)$/i.test(word))
    .map((word) => word[0])
    .join('')
    .toLowerCase() + '.org';

export const organizationSlug = (name: string): string =>
  name.toLowerCase().replace(/[–—]/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------------------------------------------------------------------------
// Organizations
// ---------------------------------------------------------------------------

/** The names Workspace settings › Organization types defines. */
export type OrganizationType =
  | 'Nonprofit'
  | 'Resource conservation district'
  | 'Tribal government'
  | 'Local government'
  | 'State agency'
  | 'Federal agency'
  | 'Private company';

export interface Organization {
  name: string;
  slug: string;
  type: OrganizationType;
  website: string;
  /** Empty when nobody has written one — the record page offers to add it. */
  description: string;
  /** Name of the person outsiders are pointed to. */
  primaryContact: string;
  /** Projects this organization leads. */
  projectsLed: number;
  /** Projects carrying at least one of this organization's grant programs. */
  projectsFunded: number;
  /** People with an account at this organization. */
  people: number;
  /** Grant programs it administers; empty for anyone who does not fund. */
  programs: string[];
}

// Funders are typed by hand: the name alone cannot say whether a "Trust" is a
// nonprofit or an "Authority" is state or regional.
const FUNDER_TYPES: Record<string, OrganizationType> = {
  'California Watershed Restoration Board': 'State agency',
  'Pacific Fisheries Trust': 'Nonprofit',
  'California Forest Health Authority': 'State agency',
  'Pacific Coast Wetlands Board': 'State agency',
  'Central Valley Water Alliance': 'Local government',
  'Sierra Headwaters Conservancy': 'State agency',
  'National Watershed Partnership': 'Federal agency',
  'Delta Conservancy Board': 'State agency',
  'Southern California Rivers Authority': 'Local government',
};

const FUNDER_DESCRIPTIONS: Record<string, string> = {
  'California Watershed Restoration Board':
    'Administers the Watershed Resilience Grant Program and hosts this workspace for its grantees.',
};

// Organizations that neither lead nor fund but still hold accounts: the
// contractors who draft field updates, and the public works departments that
// co-sign permits. Invented names on real county geography, like the projects.
const OTHER_ORGANIZATIONS: { name: string; type: OrganizationType }[] = [
  { name: 'Granite Bay Ecological Consulting', type: 'Private company' },
  { name: 'Foothill Revegetation Services', type: 'Private company' },
  { name: 'Coastline Hydrology Partners', type: 'Private company' },
  { name: 'Plumas County Public Works', type: 'Local government' },
  { name: 'Tehama County Planning Department', type: 'Local government' },
];

const leadNames = Array.from(new Set(projects.map((p) => p.leadOrganization))).sort();
const funderNames = Array.from(funderPrograms.keys()).sort();

const leadType = (name: string): OrganizationType =>
  /Resource District/.test(name) ? 'Resource conservation district' : 'Nonprofit';

const fundedBy = (organization: string): number =>
  projects.filter((project) =>
    getProjectDetail(project).funding.some(
      // A local match resolves to the lead organization itself; that is the
      // sponsor paying its own share, not funding someone else's project.
      (source) => source.organization === organization && source.organization !== project.leadOrganization,
    ),
  ).length;

const seeds: { name: string; type: OrganizationType }[] = [
  ...leadNames.map((name) => ({ name, type: leadType(name) })),
  ...funderNames.map((name) => ({ name, type: FUNDER_TYPES[name] ?? 'State agency' })),
  ...OTHER_ORGANIZATIONS,
];

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

/** The names Workspace settings › Roles and permissions defines. */
export type UserRole = 'Administrator' | 'Project steward' | 'Contributor' | 'Viewer';

export interface WorkspaceUser {
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  /** `Invited` has not signed in yet, so it has no last-active date. */
  status: 'Active' | 'Invited';
  /** "28 September 2026", or empty for an invitation. */
  lastActive: string;
}

// 24 × 24, paired by a stride that never repeats a pair below 576 people. None
// of these appear in firma2-project-detail's contact pool, so a project contact
// is never silently a second person with the same name.
const FIRST = [
  'Avery', 'Jordan', 'Elena', 'Malik', 'Hannah', 'Rafael', 'Leah', 'Desmond',
  'Kira', 'Mateo', 'Sofia', 'Owen', 'Naomi', 'Julian', 'Tessa', 'Andre',
  'Mei', 'Caleb', 'Lucia', 'Rohan', 'Greta', 'Isaac', 'Yara', 'Wesley',
];
const LAST = [
  'Castillo', 'Bennett', 'Moreau', 'Hollis', 'Takahashi', 'Ferreira', 'Whitcomb', 'Delgado',
  'Abernathy', 'Okonkwo', 'Sato', 'Larkin', 'Prescott', 'Villanueva', 'Hargrove', 'Nguyen',
  'Calloway', 'Dunmore', 'Iverson', 'Quintero', 'Ashby', 'Mendoza', 'Thorne', 'Kessler',
];
const nameAt = (k: number): string => `${FIRST[k % 24]} ${LAST[(k * 7 + Math.floor(k / 24)) % 24]}`;

const emailOf = (name: string, organization: string): string => {
  const parts = name.toLowerCase().split(' ');
  return `${parts[0][0]}.${parts[parts.length - 1]}@${domainOf(organization)}`;
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
// The fixture's "today", fixed so the dates never drift between demos.
const TODAY = Date.UTC(2026, 8, 30);
const daysAgo = (days: number): string => {
  const d = new Date(TODAY - days * 86_400_000);
  return `${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

/** The signed-in reader — the same person AppLayout's account menu names. */
export const CURRENT_USER = {
  name: 'Dana Whitfield',
  email: 'd.whitfield@cwrb.org',
  organization: 'California Watershed Restoration Board',
};

const roster: { organization: string; role: UserRole }[] = [];
const add = (organization: string, role: UserRole, count: number) => {
  for (let i = 0; i < count; i += 1) roster.push({ organization, role });
};

// The host agency runs the workspace: its staff are the administrators, and its
// grant managers read every project without editing any.
add(CURRENT_USER.organization, 'Administrator', 2);
add(CURRENT_USER.organization, 'Viewer', 3);
for (const name of leadNames) {
  const h = hashOf(name);
  add(name, 'Project steward', 1);
  add(name, 'Contributor', 1 + (h % 3));
  add(name, 'Viewer', h % 2);
}
for (const name of funderNames.filter((n) => n !== CURRENT_USER.organization)) {
  add(name, 'Viewer', 1 + (hashOf(name) % 2));
}
for (const { name, type } of OTHER_ORGANIZATIONS) {
  add(name, 'Contributor', 1);
  if (type === 'Local government') add(name, 'Viewer', 1);
}

export const users: WorkspaceUser[] = [
  {
    ...CURRENT_USER,
    role: 'Administrator',
    status: 'Active',
    lastActive: daysAgo(0),
  },
  ...roster.map(({ organization, role }, k) => {
    const name = nameAt(k);
    // Every ninth account is an invitation nobody has accepted yet — the row an
    // administrator most needs to find, so the fixture has to hold some.
    const invited = k % 9 === 4;
    return {
      name,
      email: emailOf(name, organization),
      organization,
      role,
      status: invited ? ('Invited' as const) : ('Active' as const),
      lastActive: invited ? '' : daysAgo(hashOf(name) % 75),
    };
  }),
];

// ---------------------------------------------------------------------------
// Organizations, assembled — after people, because they count them
// ---------------------------------------------------------------------------

export const organizations: Organization[] = seeds
  .map(({ name, type }) => {
    const members = users.filter((u) => u.organization === name);
    const contact =
      members.find((u) => u.role === 'Project steward') ??
      members.find((u) => u.role === 'Administrator' && u.name !== CURRENT_USER.name) ??
      members[0];
    return {
      name,
      slug: organizationSlug(name),
      type,
      website: domainOf(name),
      description: FUNDER_DESCRIPTIONS[name] ?? '',
      primaryContact: contact?.name ?? '',
      projectsLed: projects.filter((p) => p.leadOrganization === name).length,
      projectsFunded: fundedBy(name),
      people: members.length,
      programs: funderPrograms.get(name) ?? [],
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export const organizationTypes: OrganizationType[] = [
  'Nonprofit',
  'Resource conservation district',
  'Tribal government',
  'Local government',
  'State agency',
  'Federal agency',
  'Private company',
];

export const userRoles: UserRole[] = ['Administrator', 'Project steward', 'Contributor', 'Viewer'];

export const getOrganization = (slug: string): Organization | undefined =>
  organizations.find((o) => o.slug === slug);

export const currentOrganization = (): Organization =>
  organizations.find((o) => o.name === CURRENT_USER.organization)!;

/** People at one organization, administrators and stewards first. */
export const membersOf = (organization: string): WorkspaceUser[] =>
  users
    .filter((u) => u.organization === organization)
    .sort((a, b) => userRoles.indexOf(a.role) - userRoles.indexOf(b.role) || a.name.localeCompare(b.name));

/** The projects an organization leads or funds, with what it put in. */
export const projectsOf = (organization: string) =>
  projects
    .map((project) => {
      const detail = getProjectDetail(project);
      const leads = project.leadOrganization === organization;
      const amount = detail.funding
        .filter((source) => source.organization === organization && !leads)
        .reduce((sum, source) => sum + source.amount, 0);
      return { project, leads, amount };
    })
    .filter((row) => row.leads || row.amount > 0);
