// Access requests — people asking into an organization, and people asking for
// a new one (.scratch/access-requests/spec.md).
//
// TWO KINDS, ONE SHAPE. A join request names an organization that exists; a
// new-organization request names one that doesn't yet, with the type and
// website an administrator needs to judge it. Both carry what was asked for
// and who asked, so one list component draws either.
//
// THE EVIDENCE IS THE EMAIL DOMAIN. A name proves nothing (decision 6), so each
// request is judged by whether the requester's address sits at the
// organization's domain, at a personal provider, or somewhere else. That is
// computed here, once, so the manager's list and the administrator's review
// page cannot disagree about it.
//
// INVENTED, like the rest of the directory. Dates count back from the fixture's
// TODAY, so "waited 9 days" is the same in every demo.

import { TODAY, organizations, type OrganizationType } from './firma2-directory';

/** What a request asks for — the role the requester would hold. */
export type AskedAccess = 'Contributor' | 'Viewer';

export type RequestStatus = 'pending' | 'approved' | 'declined' | 'withdrawn';

export interface AccessRequest {
  id: string;
  kind: 'join' | 'organization';
  name: string;
  email: string;
  /** Join: an existing organization's name. Organization: the name asked for. */
  organization: string;
  /** New-organization requests only. */
  orgType?: OrganizationType;
  website?: string;
  asked: AskedAccess;
  message?: string;
  /** ISO date. */
  created: string;
  status: RequestStatus;
  /** What a manager granted — as asked, or one level lower. */
  granted?: AskedAccess;
  reason?: string;
  answeredBy?: string;
  answered?: string;
  /** Where the request was made, so the list can say "from a project". */
  via?: 'welcome' | 'project' | 'intake';
  /** The project a Request edit access came from. */
  project?: string;
}

/** A request older than this tells administrators (decision 16). */
export const OVERDUE_DAYS = 7;
/** After a decline, the same organization can be asked again after this. */
export const REASK_DAYS = 30;

export const isoDaysAgo = (days: number): string =>
  new Date(TODAY - days * 86_400_000).toISOString().slice(0, 10);

/** Whole days since an ISO date, counted from the fixture's today. */
export const daysSince = (iso: string): number =>
  Math.max(0, Math.round((TODAY - Date.parse(`${iso}T00:00:00Z`)) / 86_400_000));

/** The words for what was asked. Front-loaded on the verb a manager acts on. */
export const askedLabel: Record<AskedAccess, string> = {
  Contributor: 'Edit its projects',
  Viewer: 'Follow it',
};

// Free mail providers: an address there says nothing about an employer. The
// same list Access › Approved email domains refuses.
const PERSONAL = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'me.com', 'aol.com', 'proton.me', 'protonmail.com'];

export const domainOfEmail = (email: string): string => email.split('@')[1]?.toLowerCase() ?? '';

const bare = (site: string): string => site.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');

export type DomainEvidence = 'match' | 'personal' | 'other';

/** Whether the requester's address is at the organization's own domain. */
export const evidenceFor = (email: string, website: string | undefined): DomainEvidence => {
  const domain = domainOfEmail(email);
  if (PERSONAL.includes(domain)) return 'personal';
  if (website && (domain === bare(website) || domain.endsWith(`.${bare(website)}`))) return 'match';
  return 'other';
};

/** The website a join request is judged against: the organization's own. */
export const websiteOf = (organization: string): string | undefined =>
  organizations.find((o) => o.name === organization)?.website;

// Words that every conservation group shares, so they can't make two names "similar".
const COMMON = new Set([
  'the', 'of', 'and', 'for', 'river', 'rivers', 'watershed', 'trust', 'conservancy', 'council', 'group',
  'alliance', 'partners', 'partnership', 'district', 'resource', 'conservation', 'county', 'board', 'basin',
  'valley', 'coalition', 'collaborative', 'land', 'water', 'headwaters', 'creek', 'stream', 'coastal',
  'coast', 'wetlands', 'bay', 'fisheries', 'habitat', 'forest', 'sierra', 'north', 'south', 'east', 'west',
  'central', 'upper', 'lower', 'california', 'regional', 'restoration', 'stewardship', 'services',
]);
const words = (name: string): string[] =>
  name.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w && !COMMON.has(w));

/** Existing organizations a requested one might duplicate: a shared
 *  distinctive (place) word, or the same website. Most alike first. */
export const similarOrganizations = (name: string, website?: string, askableOnly = false): string[] => {
  const mine = new Set(words(name));
  return organizations
    // A requester is only offered organizations they could ask to join —
    // never an invitation-only one. The administrator's review sees them all,
    // which is where a duplicate of one still gets caught.
    .filter((o) => !askableOnly || o.joining !== 'invite')
    .map((o) => ({
      name: o.name,
      score: words(o.name).filter((w) => mine.has(w)).length * 2 + (website && bare(o.website) === bare(website) ? 3 : 0),
    }))
    // One shared distinctive word — after the habitat and direction words every
    // group here uses are set aside, what's left is mostly a place name
    // ("Truckee", "Feather"), which is the signal — or the same website.
    .filter((o) => o.score >= 2 && o.name.toLowerCase() !== name.toLowerCase())
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 3)
    .map((o) => o.name);
};

// ---------------------------------------------------------------------------
// Seeds — pending requests a demo opens on
// ---------------------------------------------------------------------------

export const SEED_REQUESTS: AccessRequest[] = [
  // The host board's own Members page: one colleague at the board's domain,
  // one follower at a personal address.
  {
    id: 'rq-herrera', kind: 'join', name: 'Tomás Herrera', email: 't.herrera@cwrb.org',
    organization: 'California Watershed Restoration Board', asked: 'Contributor',
    message: 'I started this week as a grants analyst on the Delta team.',
    created: isoDaysAgo(1), status: 'pending', via: 'welcome',
  },
  {
    id: 'rq-park', kind: 'join', name: 'Lena Park', email: 'lena.park.water@gmail.com',
    organization: 'California Watershed Restoration Board', asked: 'Viewer',
    created: isoDaysAgo(3), status: 'pending', via: 'welcome',
  },
  // From a project page: a consultant asking into the organization that leads it.
  {
    id: 'rq-haddad', kind: 'join', name: 'Samir Haddad', email: 'samir@haddadecology.com',
    organization: 'Truckee Basin Conservancy', asked: 'Contributor',
    message: 'I’m the consulting hydrologist on your Martis Creek work this season.',
    created: isoDaysAgo(4), status: 'pending', via: 'project',
  },
  // Waiting past a week: the manager hasn't answered, so administrators hear.
  {
    id: 'rq-mensah', kind: 'join', name: 'Kofi Mensah', email: 'k.mensah@ebsp.org',
    organization: 'East Bay Stream Partners', asked: 'Contributor',
    created: isoDaysAgo(9), status: 'pending', via: 'welcome',
  },
  // An organization with no manager: only administrators can answer.
  {
    id: 'rq-okafor', kind: 'join', name: 'Ruth Okafor', email: 'r.okafor@dcb.org',
    organization: 'Delta Conservancy Board', asked: 'Contributor',
    message: 'I run our grant reporting and would like to keep our records current.',
    created: isoDaysAgo(2), status: 'pending', via: 'welcome',
  },

  // New organizations, for an administrator to judge.
  {
    id: 'rq-yolo', kind: 'organization', name: 'Bea Lindqvist', email: 'b.lindqvist@yolorcd.org',
    organization: 'Yolo County Resource Conservation District', orgType: 'Resource conservation district',
    website: 'yolorcd.org', asked: 'Contributor',
    message: 'We’re taking over two Putah Creek planting sites next spring.',
    created: isoDaysAgo(2), status: 'pending', via: 'welcome',
  },
  // Looks like an existing organization, from a personal address.
  {
    id: 'rq-feather', kind: 'organization', name: 'Marcus Webb', email: 'marcus.webb.eco@gmail.com',
    organization: 'Feather River Headwaters Trust', orgType: 'Nonprofit',
    website: 'featherheadwaters.org', asked: 'Contributor',
    created: isoDaysAgo(1), status: 'pending', via: 'welcome',
  },
  {
    id: 'rq-mojave', kind: 'organization', name: 'Inês Carvalho', email: 'i.carvalho@mojaveriver.org',
    organization: 'Mojave River Watershed Group', orgType: 'Nonprofit',
    website: 'mojaveriverwg.org', asked: 'Contributor',
    message: 'Our old site was mojaveriver.org; the group renamed in 2025.',
    created: isoDaysAgo(5), status: 'pending', via: 'welcome',
  },

  // The newcomer's own history: one request already answered, so "Your
  // requests" and the ask-again wait have something to show.
  {
    id: 'rq-iniguez-svrd', kind: 'join', name: 'Rosa Iñiguez', email: 'rosa.iniguez@sierravalleyrcd.org',
    organization: 'Scott Valley Resource District', asked: 'Contributor',
    created: isoDaysAgo(8), status: 'declined', via: 'welcome',
    reason: 'We add district staff only. Your district can request its own organization.',
    answeredBy: 'Scott Valley Resource District', answered: isoDaysAgo(6),
  },
];

/** A new-organization request's id comes from the name asked for, so a request
 *  made in the browser can land on a review page built ahead of time. */
export const organizationRequestId = (organization: string): string =>
  `rq-org-${organization.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

/**
 * Requests the access-request FLOW makes in the browser (firma2-flows). They
 * are not pending until someone sends them — they're here only so their review
 * pages exist at build time. The flow opens the form filled in with exactly this.
 */
export const FLOW_REQUESTS: AccessRequest[] = [
  {
    id: organizationRequestId('Sierra Valley Resource Conservation District'),
    kind: 'organization', name: 'Rosa Iñiguez', email: 'rosa.iniguez@sierravalleyrcd.org',
    organization: 'Sierra Valley Resource Conservation District', orgType: 'Resource conservation district',
    website: 'sierravalleyrcd.org', asked: 'Contributor',
    message: 'We run the Sierra Valley meadow restoration work and report to the Board.',
    created: isoDaysAgo(0), status: 'pending', via: 'welcome',
  },
];

/** The newcomer the first sign-in page is shown as. Their address matches no
 *  verified domain, so nothing admits them before they answer. */
export const NEWCOMER = {
  name: 'Rosa Iñiguez',
  email: 'rosa.iniguez@sierravalleyrcd.org',
};
