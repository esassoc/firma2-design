// Who may publish a project — the Security threshold, plus the one rule a
// threshold cannot express: an UNVERIFIED organization's projects publish only
// through an administrator (.scratch/access-requests/spec.md, decisions 6, 8).
//
// WHY THE LEAD ORGANIZATION. Publishing puts a project in front of the public
// under its lead organization's name, and a name proves nothing — a fake
// "Apple" could be approved and publish as Apple. A verified domain matching
// the website is the proof (verifiedDomain), so until an organization has one,
// nobody short of an administrator publishes in its name. Administrators are
// the ones who approved it; they publish as the check.
//
// One function, so the review page's Publish button and the status line that
// explains its absence cannot disagree.

import { organizations, verifiedDomain } from '../data/firma2-directory';
import { can, currentActor } from './workspace-permissions';

/** Why the reader may not publish this project, or null if they may. */
export type PublishBlock = 'threshold' | 'unverified' | null;

export const publishBlock = (leadOrganization: string): PublishBlock => {
  if (!can('perm-publish')) return 'threshold';
  if (currentActor().role === 'Administrator') return null;
  const lead = organizations.find((o) => o.name === leadOrganization);
  return lead && verifiedDomain(lead) ? null : 'unverified';
};
