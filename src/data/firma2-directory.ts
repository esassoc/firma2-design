// The directory — every organization in the workspace and every person with an
// account, in one module because each half counts the other: an organization's
// row says how many people it has, and a person's row names their organization.
//
// DERIVED WHERE THE FIXTURE ALREADY KNOWS. Lead organizations come off the
// project list and funders off the funding table, so the Organizations screen,
// the Projects index and a project's funding sources cannot disagree about who
// exists or what they did. Everything else is INVENTED — names,
// addresses, dates — and never copied or sanitized from a client document.
//
// DETERMINISTIC: every pick is a hash or a stride, never Math.random(), so a
// demo shows the same people in the same places every time.

import { projects } from './firma2-projects';
import { funderPrograms, getProjectDetail } from './firma2-project-detail';
import { REAL } from './firma2-real-data';

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
  // A real organization (dev only) has a real domain this cannot guess, and a
  // guess would read as its address. The invented people mail from example.org.
  REAL
    ? 'example.org'
    : organization
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

/** The kinds of organization a type field can hold; a type decides whether
 *  an organization can lead or fund projects. */
export type OrganizationType =
  | 'Nonprofit'
  | 'Resource conservation district'
  | 'Tribal government'
  | 'Local government'
  | 'State agency'
  | 'Federal agency'
  | 'Private company';

/** A domain an organization has claimed, and how far its proof has got. */
export interface ApprovedDomain {
  domain: string;
  /** `pending`: a code went to `email` and has not been entered yet. */
  status: 'verified' | 'pending';
  /** The address at the domain the code went to. */
  email: string;
  /** "14 March 2024" — when it was verified, or when the code was sent. */
  date: string;
}

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
  /** Distinct projects it leads or funds — one count, so a project an
   *  organization both leads and part-funds is not counted twice. */
  projects: number;
  /** Who can see the organization and its projects. */
  visibility: OrganizationVisibility;
  /** Email domains whose holders join this organization without an
   *  invitation (Linear's approved domains, per organization). Only a
   *  verified domain admits anyone; a verified domain belongs to one
   *  organization at most. */
  approvedDomains: ApprovedDomain[];
  /** ISO date the organization was added to the workspace — ISO so the grid
   *  sorts it chronologically; display formatting is the grid's job. */
  created: string;
  /** Grant programs it administers; empty for anyone who does not fund. */
  programs: string[];
  /** How someone without a matching domain gets in (Access › How people join). */
  joining: JoiningChoice;
  /** The administrator who created it — only administrators create
   *  organizations (.scratch/access-requests/spec.md, decision 7). */
  addedBy: string;
  /** Who asked for it, when it began as a new-organization request. */
  requestedBy?: string;
}

/** Access › How people join. `approval` is the default (decided 2026-11-02). */
export type JoiningChoice = 'open' | 'invite' | 'approval';

/** The values Organization settings › Access offers for who can see an
 *  organization. One list, so the settings page, the create dialog and the
 *  Organizations grid cannot disagree about what the choices are called. */
export type OrganizationVisibility = 'public' | 'workspace' | 'private';

export interface AccessChoice<V extends string = string> {
  value: V;
  label: string;
  /** What choosing it means, shown as help text while selected — omit when the label says it. */
  hint?: string;
}

export const visibilityChoices: AccessChoice<OrganizationVisibility>[] = [
  { value: 'public', label: 'Public' },
  { value: 'workspace', label: 'Members of any organization' },
  { value: 'private', label: 'Private to organization members' },
];

export const joiningChoices: AccessChoice<JoiningChoice>[] = [
  { value: 'approval', label: 'Approval required', hint: 'Anyone can ask. Managers approve each request.' },
  { value: 'invite', label: 'Invitation required', hint: 'Not listed for people choosing an organization. Managers invite.' },
  { value: 'open', label: 'Anyone who can see it can join' },
];

/** The short form a grid cell has room for. */
export const visibilityLabel: Record<OrganizationVisibility, string> = {
  public: 'Public',
  workspace: 'Members',
  private: 'Members only',
};

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

// A real workspace (dev only) brings its own registry and its own type names.
// A lead or a fund's organization the registry does not list is added untyped.
const realSeeds = (): { name: string; type: OrganizationType }[] => {
  const listed = (REAL?.organizations ?? []).map((o) => ({ name: o.name, type: o.type as OrganizationType }));
  const known = new Set(listed.map((o) => o.name));
  const unlisted = [...leadNames, ...funderNames].filter((name) => !known.has(name));
  return [...listed, ...Array.from(new Set(unlisted)).map((name) => ({ name, type: '' as OrganizationType }))];
};

const others = REAL ? [] : OTHER_ORGANIZATIONS;

const seeds: { name: string; type: OrganizationType }[] = REAL
  ? realSeeds()
  : [
      ...leadNames.map((name) => ({ name, type: leadType(name) })),
      ...funderNames.map((name) => ({ name, type: FUNDER_TYPES[name] ?? 'State agency' })),
      ...OTHER_ORGANIZATIONS,
    ];

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

// ROLES FOLLOW LINEAR'S. A workspace role is one of three FIXED rungs, each
// holding everything below it — Administrator ⊃ Contributor ⊃ Viewer, Linear's
// Admin ⊃ Member ⊃ Guest. There are no custom roles: what flexes is the "who
// can…" threshold on each act (Security › Workspace permissions for the
// workspace, Organization settings › Access for one organization).
//
// MEMBERSHIP IS A LIST, AND ONLY CONTRIBUTORS NEED ONE. A person belongs to any
// number of organizations. A Contributor drafts on an organization's projects,
// so it belongs to at least one; a Viewer reads the whole workspace anyway, so
// it may belong to none — membership only opens that organization's own views
// (a private organization, its landing view). Removing a Contributor from their
// last organization makes them an organizationless Viewer: the same place a
// Viewer lands when removed from their last one.
//
// MANAGER IS NOT A ROLE. It is a flag on a membership, Linear's team owner: it
// runs one organization (its members, settings and approvals) and is set on
// that organization's Members page. Administrators are managers of every
// organization without the flag; a Viewer can never hold it, as a Linear guest
// can never own a team.

/** The workspace roles, highest first — set on Workspace settings › Users. */
export type UserRole = 'Administrator' | 'Contributor' | 'Viewer';

export interface WorkspaceUser {
  name: string;
  email: string;
  role: UserRole;
  /** The organizations this person belongs to. At least one for a Contributor;
   *  a Viewer's may be empty. */
  organizations: string[];
  /** The organizations they manage — a subset of `organizations`. Always empty
   *  for a Viewer, and never needed by an Administrator — see isManager(). */
  managerOf: string[];
  /** `Invited` has not signed in yet, so it has no last-active date.
   *  `Suspended` has lost all access but stays listed, so the projects and
   *  updates they touched still name them. */
  status: 'Active' | 'Invited' | 'Suspended';
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

// An organizationless Viewer mails from a personal address.
const emailOf = (name: string, organization: string): string => {
  const parts = name.toLowerCase().split(' ');
  return `${parts[0][0]}.${parts[parts.length - 1]}@${organization ? domainOf(organization) : 'example.com'}`;
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
// The fixture's "today", fixed so the dates never drift between demos. Exported
// so any surface that says "N days ago" counts from the same day.
export const TODAY = Date.UTC(2026, 8, 30);
const isoDaysAgo = (days: number): string => new Date(TODAY - days * 86_400_000).toISOString().slice(0, 10);
const daysAgo = (days: number): string => {
  const d = new Date(TODAY - days * 86_400_000);
  return `${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

/** The signed-in reader — the same person AppLayout's account menu names. */
// In a real workspace (dev only) the reader's organizations are the two that
// lead the most projects; the reader stays invented.
const busiestLeads = [...leadNames].sort(
  (a, b) => projects.filter((p) => p.leadOrganization === b).length - projects.filter((p) => p.leadOrganization === a).length || a.localeCompare(b),
);

export const CURRENT_USER = {
  name: 'Dana Whitfield',
  email: REAL ? 'd.whitfield@example.org' : 'd.whitfield@cwrb.org',
  organization: REAL ? busiestLeads[0] : 'California Watershed Restoration Board',
};

/**
 * Every organization the signed-in reader belongs to, home organization first.
 * Two, so the app rail shows its plural case: a board administrator who also
 * sits on a partner trust. Invented, like the rest of the directory.
 */
export const CURRENT_USER_ORGANIZATIONS: string[] = [CURRENT_USER.organization, REAL ? busiestLeads[1] : 'Feather Headwaters Trust'].filter(Boolean);

const roster: { organization: string; role: UserRole; manager: boolean }[] = [];
const add = (organization: string, role: UserRole, count: number, manager = false) => {
  for (let i = 0; i < count; i += 1) roster.push({ organization, role, manager });
};

// The host agency runs the workspace: its staff are the administrators, and its
// grant managers read every project without editing any.
add(CURRENT_USER.organization, 'Administrator', 2);
add(CURRENT_USER.organization, 'Viewer', 3);
for (const name of leadNames) {
  const h = hashOf(name);
  // Every lead organization has one manager, who drafts like any contributor.
  add(name, 'Contributor', 1, true);
  add(name, 'Contributor', 1 + (h % 3));
  add(name, 'Viewer', h % 2);
}
for (const name of funderNames.filter((n) => n !== CURRENT_USER.organization)) {
  add(name, 'Viewer', 1 + (hashOf(name) % 2));
}
for (const { name, type } of others) {
  add(name, 'Contributor', 1);
  if (type === 'Local government') add(name, 'Viewer', 1);
}
// One program officer at the host board drafts updates too — added last so no
// earlier name moves — which gives its Members page a Contributor to make a
// manager of.
add(CURRENT_USER.organization, 'Contributor', 1);
// Members of the public who follow the program — signed-in Viewers who belong
// to no organization.
add('', 'Viewer', 4);

export const users: WorkspaceUser[] = [
  {
    name: CURRENT_USER.name,
    email: CURRENT_USER.email,
    role: 'Administrator',
    organizations: [CURRENT_USER.organization],
    managerOf: [],
    status: 'Active',
    lastActive: daysAgo(0),
  },
  ...roster.map(({ organization, role, manager }, k): WorkspaceUser => {
    const name = nameAt(k);
    // Every ninth account is an invitation nobody has accepted yet — the row an
    // administrator most needs to find, so the fixture has to hold some. A few
    // others were suspended — never a manager, whose organization would then be
    // left without the person who runs it.
    const invited = k % 9 === 4;
    const suspended = !invited && !manager && k % 17 === 10;
    // Some contributors work for two lead organizations — a consultant on one
    // project, staff on another — so the fixture holds multi-organization rows.
    const lead = leadNames.indexOf(organization);
    const second = role === 'Contributor' && !manager && lead >= 0 && hashOf(name) % 5 === 0
      ? leadNames[(lead + 1) % leadNames.length]
      : '';
    return {
      name,
      email: emailOf(name, organization),
      role,
      organizations: [organization, second].filter(Boolean),
      managerOf: manager ? [organization] : [],
      status: invited ? 'Invited' : suspended ? 'Suspended' : 'Active',
      // A suspended account keeps the date it was last used: the last time it
      // had access is what an administrator reviewing it needs.
      lastActive: invited ? '' : daysAgo(hashOf(name) % 75 + (suspended ? 40 : 0)),
    };
  }),
];

/** Manages this organization — flagged on it, or an Administrator of the
 *  workspace. Without an organization: manages any. */
export const isManager = (user: WorkspaceUser, organization?: string): boolean =>
  user.role === 'Administrator' ||
  (user.role !== 'Viewer' && (organization ? user.managerOf.includes(organization) : user.managerOf.length > 0));

/** Who anyone can ask about their access — Linear's "View workspace admins". */
export const administrators = (): WorkspaceUser[] =>
  users
    .filter((u) => u.role === 'Administrator' && u.status === 'Active')
    .sort((a, b) => a.name.localeCompare(b.name));

// ---------------------------------------------------------------------------
// Organizations, assembled — after people, because they count them
// ---------------------------------------------------------------------------

const adminNames = users.filter((u) => u.role === 'Administrator' && u.name !== CURRENT_USER.name).map((u) => u.name);

export const organizations: Organization[] = seeds
  .map(({ name, type }) => {
    const members = users.filter((u) => u.organizations.includes(name) && u.status !== 'Suspended');
    const contact =
      members.find((u) => u.managerOf.includes(name) && u.status === 'Active') ??
      members.find((u) => u.role === 'Administrator' && u.name !== CURRENT_USER.name) ??
      members[0];
    const h = hashOf(name);
    const host = name === CURRENT_USER.organization;
    return {
      name,
      slug: organizationSlug(name),
      type,
      website: REAL ? '' : domainOf(name),
      description: FUNDER_DESCRIPTIONS[name] ?? '',
      primaryContact: contact?.name ?? '',
      projectsLed: projects.filter((p) => p.leadOrganization === name).length,
      projectsFunded: fundedBy(name),
      people: members.length,
      projects: projects.filter(
        (p) =>
          p.leadOrganization === name ||
          getProjectDetail(p).funding.some((source) => source.organization === name),
      ).length,
      // Most organizations are public — their projects are public record. A
      // contractor's drafts are the usual reason to close one; a few others
      // keep to signed-in readers.
      visibility: host
        ? ('public' as const)
        : type === 'Private company' && h % 2 === 0
          ? ('private' as const)
          : h % 5 === 3
            ? ('workspace' as const)
            : ('public' as const),
      // The host board and most lead organizations let their own staff in by
      // domain; funders and contractors invite one by one.
      approvedDomains: [
        ...(!REAL && (host || (leadNames.includes(name) && h % 3 !== 0))
          ? [{ domain: domainOf(name), status: 'verified' as const, email: contact?.email ?? `admin@${domainOf(name)}`, date: daysAgo(host ? 900 : 20 + (h % 600)) }]
          : []),
        // The board is also bringing in the state agency's own domain; the code
        // went out two days ago and nobody has entered it yet.
        ...(host && !REAL ? [{ domain: 'watershedboard.ca.gov', status: 'pending' as const, email: 'a.castillo@watershedboard.ca.gov', date: daysAgo(2) }] : []),
      ],
      // The host agency opened the workspace about two and a half years before
      // the fixture's today; everyone else joined after it.
      created: isoDaysAgo(host ? 940 : 30 + (h % 880)),
      programs: funderPrograms.get(name) ?? [],
      // Most ask for approval, the new default. Contractors keep to invitations;
      // a few open nonprofits let anyone who can see them in.
      joining: (type === 'Private company'
        ? 'invite'
        : type === 'Nonprofit' && h % 7 === 2
          ? 'open'
          : 'approval') as JoiningChoice,
      // The host's administrators added everyone, the founder most often.
      addedBy: host || h % 3 !== 1 ? CURRENT_USER.name : (adminNames[h % adminNames.length] ?? CURRENT_USER.name),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const MOCK_ORGANIZATION_TYPES: OrganizationType[] = [
  'Nonprofit',
  'Resource conservation district',
  'Tribal government',
  'Local government',
  'State agency',
  'Federal agency',
  'Private company',
];

export const organizationTypes: OrganizationType[] = REAL
  ? (Array.from(new Set(REAL.organizations.map((o) => o.type))).sort() as OrganizationType[])
  : MOCK_ORGANIZATION_TYPES;

/** Highest first; each role holds everything below it. */
export const userRoles: UserRole[] = ['Administrator', 'Contributor', 'Viewer'];

/** The roles anyone short of an Administrator can hand out — on an
 *  organization's Members page, the invite link and approved domains. Only an
 *  Administrator makes another, from Users. */
export const grantableRoles: UserRole[] = ['Contributor', 'Viewer'];

/** The domain that makes an organization VERIFIED: a verified approved domain
 *  that is also its website. A name proves nothing; this does (decision 6). */
export const verifiedDomain = (org: Pick<Organization, 'website' | 'approvedDomains'>): string | undefined =>
  org.approvedDomains.find((d) => d.status === 'verified' && d.domain === org.website.replace(/^https?:\/\/(www\.)?/, ''))?.domain;

export const getOrganization = (slug: string): Organization | undefined =>
  organizations.find((o) => o.slug === slug);

export const currentOrganization = (): Organization =>
  organizations.find((o) => o.name === CURRENT_USER.organization)!;

/** People at one organization, administrators and managers first. Suspended
 *  accounts are left out: they belong to no one until restored. */
export const membersOf = (organization: string): WorkspaceUser[] =>
  users
    .filter((u) => u.organizations.includes(organization) && u.status !== 'Suspended')
    .sort(
      (a, b) =>
        userRoles.indexOf(a.role) - userRoles.indexOf(b.role) ||
        Number(b.managerOf.includes(organization)) - Number(a.managerOf.includes(organization)) ||
        a.name.localeCompare(b.name),
    );

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
