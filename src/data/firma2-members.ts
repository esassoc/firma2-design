// Members — the people in the workspace, as the people in it read them: the
// directory at /prototypes/members and one page per person.
//
// THE SAME PEOPLE AS Workspace settings › Users (firma2-directory: `users`),
// read from the other side. Users is where an administrator runs accounts —
// invitations, suspensions, roles. Members is where anyone signed in finds a
// colleague: who they are and which organizations they belong to.
//
// ACTIVE ACCOUNTS ONLY. An invitation nobody has accepted is not a person in
// the workspace yet, and a suspended account has lost its access; both stay
// on Users, where the administrator who has to act on them looks.
//
// NO ACTIVITY FEED. The projects' change logs name project contacts, an
// invented pool that shares no names with the accounts here, so "what this
// member changed" has no data behind it and the page does not pretend to.

import { users, userRoles } from './firma2-directory';
import type { WorkspaceUser } from './firma2-directory';

/** A member's address-safe id: their name. Names are unique in the directory. */
export const memberSlug = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Base-less, like every route in this spoke — wrap with withBase() at render. */
export const memberHref = (name: string): string => `/prototypes/members/${memberSlug(name)}`;

/** Everyone with an active account, administrators first, then A to Z. */
export const members: WorkspaceUser[] = users
  .filter((u) => u.status === 'Active')
  .sort((a, b) => userRoles.indexOf(a.role) - userRoles.indexOf(b.role) || a.name.localeCompare(b.name));

const bySlug = new Map(members.map((m) => [memberSlug(m.name), m]));

export const getMember = (slug: string): WorkspaceUser | undefined => bySlug.get(slug);

/** Whether a name is a member with a page — a project contact from outside the workspace is not. */
export const isMember = (name: string): boolean => bySlug.has(memberSlug(name));

/**
 * What a member reads as in one organization: Manager outranks the Contributor
 * role it sits on (firma2-organization-record's rule).
 */
export const roleIn = (member: WorkspaceUser, organization: string): string =>
  member.role === 'Contributor' && member.managerOf.includes(organization) ? 'Manager' : member.role;

/**
 * The member behind a project contact: the account with the contact's email
 * (docs/data-model.md, decision 9). A contact is its own row on the project
 * and most are not members; no account is ever created for one.
 */
export const memberForEmail = (email: string): WorkspaceUser | undefined =>
  email ? members.find((m) => m.email.toLowerCase() === email.trim().toLowerCase()) : undefined;
