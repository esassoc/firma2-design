// Support requests — a question or a problem someone sent the people who run
// the workspace, and what was said back.
//
// WHAT ONE IS (proposed 2026-11-24; .scratch/support-requests/spec.md). A
// request has a subject, a kind, a message, who sent it and from which page,
// and it is OPEN until an administrator marks it RESOLVED. Replies hang under
// it in order. It is not a request for access: joining an organization, or
// asking for one that is not listed, has its own flow and its own list
// (.scratch/access-requests/spec.md).
//
// A SAMPLE FOR EVERY STATE: open with no reply and nobody assigned, open and
// assigned with a reply waiting on the requester, resolved with a reply,
// resolved with none, and one from a visitor with no account (the public site's
// Contact door), who has no organization and no member page.
//
// WHAT IS FAKED. Sending a request and emailing a reply do not exist: the list
// is this literal array. Marking one resolved or reopening it, and a reply
// typed on its page, are kept in this browser only
// (src/lib/support-request-edits.ts).
//
// INVENTED CONTENT. Every subject, message and reply is fabricated; requesters
// are drawn from the invented directory by position, so a demo always shows the
// same names.
//
// DETERMINISTIC — literal seeds, no Math.random(), no wall clock.

import { administrators, users } from './firma2-directory';
import type { WorkspaceUser } from './firma2-directory';
import { projectHref, projects } from './firma2-projects';

export type SupportRequestKind = 'Question' | 'Problem' | 'Correction' | 'Other';

export const SUPPORT_REQUEST_KINDS: SupportRequestKind[] = ['Question', 'Problem', 'Correction', 'Other'];

export type SupportRequestStatus = 'open' | 'resolved';

export const SUPPORT_REQUEST_STATUS_LABEL: Record<SupportRequestStatus, string> = {
  open: 'Open',
  resolved: 'Resolved',
};

/** esa-badge tone per status: open is the one that asks for someone. */
export const SUPPORT_REQUEST_STATUS_TONE: Record<SupportRequestStatus, 'warning' | 'success'> = {
  open: 'warning',
  resolved: 'success',
};

export interface SupportReply {
  author: string;
  /** `YYYY-MM-DD`. */
  date: string;
  body: string;
}

export interface SupportRequest {
  /** "SR-1042" — what a requester quotes back, and the page's address. */
  id: string;
  subject: string;
  kind: SupportRequestKind;
  message: string;
  requester: {
    name: string;
    email: string;
    /** Empty for someone with no account, or a member of no organization. */
    organization: string;
    /** Has an account, so their name opens a member page. */
    member: boolean;
  };
  /** The page it was sent from, when it was sent from one. Base-less route. */
  page?: { label: string; href: string };
  /** `YYYY-MM-DD`. */
  received: string;
  status: SupportRequestStatus;
  /** The administrator answering it; empty until someone takes it. */
  assignedTo: string;
  /** `YYYY-MM-DD`, when resolved. */
  resolved?: string;
  replies: SupportReply[];
}

// Requesters by position: active people who are not administrators, so nobody
// writes to themselves. The directory is deterministic, so these never move.
const askers: WorkspaceUser[] = users.filter((u) => u.status === 'Active' && u.role !== 'Administrator');
const asker = (i: number) => {
  const u = askers[(i * 7) % askers.length];
  return { name: u.name, email: u.email, organization: u.organizations[0] ?? '', member: true };
};
const admins = administrators();
const admin = (i: number): string => admins[i % admins.length].name;
const projectPage = (i: number) => {
  const p = projects[(i * 5) % projects.length];
  return { label: p.projectName, href: projectHref(p) };
};

type Seed = Omit<SupportRequest, 'id'>;

const SEEDS: Seed[] = [
  {
    subject: 'Reported acres don’t match our monitoring report',
    kind: 'Correction',
    message:
      'The 2025 figure for acres treated on this project is lower than what our monitoring report says. I think two treatment units were left out when the report was entered. Can it be corrected, or should I enter a new report?',
    requester: asker(0),
    page: projectPage(0),
    received: '2026-09-28',
    status: 'open',
    assignedTo: '',
    replies: [],
  },
  {
    subject: 'Can’t upload a work area shapefile',
    kind: 'Problem',
    message:
      'Uploading our work area boundary stops with “This file couldn’t be read.” It is a zipped shapefile exported from ArcGIS Pro, about 4 MB. The same file opens in QGIS.',
    requester: asker(1),
    page: projectPage(1),
    received: '2026-09-26',
    status: 'open',
    assignedTo: admin(0),
    replies: [
      { author: admin(0), date: '2026-09-27', body: 'Thanks for the detail. Could you check whether the zip holds the .prj file? Without it the upload can’t tell which coordinate system the shapes use.' },
    ],
  },
  {
    subject: 'Which stage should a project on hold be in?',
    kind: 'Question',
    message:
      'Our landowner agreement fell through and the project is paused, probably for a year. Should we move it to Deferred, or leave it in Planning & Design until we know?',
    requester: asker(2),
    page: projectPage(2),
    received: '2026-09-22',
    status: 'resolved',
    assignedTo: admin(1),
    resolved: '2026-09-23',
    replies: [
      { author: admin(1), date: '2026-09-23', body: 'Deferred is the right stage: the project stays in the inventory and reads as paused. Move it back to Planning & Design when work resumes.' },
      { author: asker(2).name, date: '2026-09-23', body: 'Done, thank you.' },
    ],
  },
  {
    subject: 'How do I get updates on projects near me?',
    kind: 'Question',
    message:
      'I live along the creek and saw the restoration signs. Is there a way to follow what is happening on the projects in my area without an account?',
    // A visitor to the public site: no account, so no organization and no member page.
    requester: { name: 'Marisol Trevino', email: 'marisol.trevino@example.com', organization: '', member: false },
    received: '2026-09-19',
    status: 'open',
    assignedTo: admin(0),
    replies: [],
  },
  {
    subject: 'Performance measure missing from our project type',
    kind: 'Question',
    message:
      'We report stream miles reopened for fish passage projects, but the measure is not offered when I record work on this one. Is it turned off for the project type?',
    requester: asker(3),
    page: projectPage(3),
    received: '2026-09-15',
    status: 'resolved',
    assignedTo: admin(0),
    resolved: '2026-09-16',
    replies: [
      { author: admin(0), date: '2026-09-16', body: 'The measure wasn’t on the project yet. I’ve added it, so it’s there the next time you record work.' },
    ],
  },
  {
    subject: 'Export stops partway through',
    kind: 'Problem',
    message: 'The projects export downloads a file with 12 rows. The Projects page shows 24.',
    requester: asker(4),
    page: { label: 'Import and export', href: '/prototypes/workspace-settings/import-export' },
    received: '2026-09-09',
    status: 'resolved',
    assignedTo: admin(1),
    // Resolved without a written reply: fixed, and the requester told in person.
    resolved: '2026-09-11',
    replies: [],
  },
  {
    subject: 'Suggestion: show county on the project map',
    kind: 'Other',
    message: 'When several projects sit close together on the map it would help to see the county line. Not urgent.',
    requester: asker(5),
    page: { label: 'Map', href: '/prototypes/map' },
    received: '2026-08-30',
    status: 'open',
    assignedTo: '',
    replies: [],
  },
];

/** Newest first; ids count down from the newest so they read as a running log. */
export const supportRequests: SupportRequest[] = [...SEEDS]
  .sort((a, b) => b.received.localeCompare(a.received))
  .map((seed, i) => ({ ...seed, id: `SR-${1048 - i}` }));

export const supportRequestSlug = (id: string): string => id.toLowerCase();

/** Base-less, like every route in this spoke — wrap with withBase() at render. */
export const supportRequestHref = (id: string): string => `/prototypes/support-requests/${supportRequestSlug(id)}`;

export const getSupportRequest = (slug: string): SupportRequest | undefined =>
  supportRequests.find((r) => supportRequestSlug(r.id) === slug);
