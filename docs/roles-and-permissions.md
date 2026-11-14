# Roles and permissions

How access works in ProjectFirma 2.0: who can do what, where each thing is
set, and why. It follows Linear's members-and-roles model (decided
2026-10-02). The principle is summed up in `docs/product-brief.md` §4 ("Roles
are fixed; who-can thresholds flex"). This page is the full reference.

## The model in one paragraph

Everyone has **one fixed workspace role**: Administrator, Contributor or
Viewer. Each role includes everything below it, and there are no custom roles.
Separately, a person belongs to **any number of organizations**: a
Contributor to at least one, a Viewer to none or more. A Contributor can be a
**manager** of an organization they belong to. Manager is a flag on one
membership, not a role (Linear's *team owner*; called Steward until 2026-11-02, renamed so
it can't be confused with ProjectFirma 1.x's Project steward role).
Anything that varies between workspaces is a **"who can" setting on the action
itself**, never a new role.

| Linear | ProjectFirma |
|---|---|
| Workspace | Workspace |
| Team | Organization |
| Admin | **Administrator** (workspace role) |
| Team owner | **Manager** (per-organization flag) |
| Member | **Contributor** (workspace role) |
| Guest | **Viewer** (workspace role; reads published values. With no organization, a Viewer sees exactly what the public sees) |
| Owner (Enterprise only) | No equivalent; we have no billing or plans |

## Roles

The roles are fixed, so there is no settings page for them. This table is the
reference, and each role's description also appears under it in the Users
*Change role…* dialog, where the choice is made.

| Role | What it is | Can edit | Approves updates | Manages settings | Set on |
|---|---|---|---|---|---|
| **Administrator** | Configures the workspace and manages people. Counts as a manager of every organization. | All projects | All projects | All | Workspace settings › Users |
| **Manager** | Runs one organization's members, settings and approvals. Given only to Contributors. | Their organization's | Their organization's | Their organization's | Organization settings › Members |
| **Contributor** | Drafts updates on the projects their organizations lead. Belongs to at least one. | Projects their organizations lead (funding gives no edit rights) | No | No | Workspace settings › Users |
| **Viewer** | Signed in, reads published values. With no organization, sees exactly what the public sees. Can't be a manager. | None | No | No | Workspace settings › Users |

Rules that never change:

- **Only an Administrator can make someone an Administrator**, and only from
  Users. Everywhere else (an organization's Members page, its approved email
  domains, its invite link, approving a join request) can grant Contributor or
  Viewer, nothing higher.
- **Only an Administrator creates an organization**, and only an Administrator
  approves a request for a new one. Whoever requested it becomes a Contributor
  and its first manager.
- **Administrators are managers of every organization** automatically.
- An organization can have **any number of managers, including none**.
- **A Viewer can never be a manager.** Changing a manager to Viewer removes
  their manager role, and the change-role dialog says so before you save.

## Organization membership

A person belongs to **any number of organizations**. Membership and role are
separate: the role is workspace-wide, and membership says which organizations
someone works in or follows.

| Role | Organizations | What membership gives them |
|---|---|---|
| **Administrator** | Any number | Nothing extra; they already manage every organization |
| **Contributor** | **At least one** | The projects they can draft on, and the chance to be its manager |
| **Viewer** | **Zero or more** | That organization's member-only views (a private organization, its landing view), still as published values. An organizationless Viewer sees exactly what the public sees |

What keeps this true:

- **Removing a Contributor from their last organization makes them an
  organizationless Viewer.** That's the same place a Viewer lands when removed
  from their last one. The remove confirm says so before it happens, and the
  toast reports it ("…removed. They're now a Viewer.").
- **Removing someone who belongs elsewhere** ends only this membership, and
  removing them also ends their manager role here.
- **Making an organizationless Viewer a Contributor** (Users › *Change role…*)
  requires choosing an organization in the same dialog. It won't save without
  one.
- **Becoming a Viewer** keeps someone's organizations but ends every
  manager role.
- **Adding someone already in the workspace** to an organization never changes
  their role. The Add dialog's Role field applies only to people being
  invited.

## Who can manage an organization's members

"Managing members" covers adding, removing, approving requests to join, and
inviting people.

| Who | Add people already in the workspace, remove, approve requests | Invite people new to the workspace (by email) | Make or remove managers |
|---|---|---|---|
| **Administrators** | Always | Always | Always |
| **That organization's managers** | Always | **Always** | Always |
| **Its other members** | Only if Access › *Manage members* = "All members" (default: "Only managers") | Never | Never |

**Why invitations are manager-only.** Typing a new email address in *Add
members* doesn't just add someone to the organization. It also brings a new
person into the **workspace**, and Security › *Invite people* has its own
setting for that. Both settings would apply to the same action, so Linear's
rule decides it: managers can always invite into their own organization, and
everyone else can only add people who already have an account. Someone who
isn't a manager and types a new email sees *"[email] isn't in the workspace
yet. Ask a manager to invite them."*

The hint text on both settings says this, so neither page can be misread:
- Organization › Access › *Manage members*: "…Only managers can invite people
  new to the workspace."
- Security › *Invite people*: "…Managers can always invite people into their
  own organization."

Per member row on Organization settings › Members, a manager can:

| Action | Applies to |
|---|---|
| Make manager / Remove as manager | Contributors who have accepted |
| Resend invitation, Cancel invitation | Invited rows |
| Remove from organization | Everyone except themselves (see *Organization membership* for where they land) |

A manager **can't**:
- Create organizations. Only administrators can.
- Change anyone's role, except that approving a join request may raise a
  Viewer to Contributor (never higher). Roles are workspace-wide and a person can belong to
  several organizations, so changing a role is an administrator's job, on
  Users.
- Act on an administrator's row. Those rows only get a "…" when the reader is
  also an administrator.
- Suspend anyone. That cuts off the whole account, so it stays with
  administrators on Users.

## Configurable "who can" settings

Each of these is set on the action itself. They are not inherited from
workspace to organization.

### Workspace: Security › Workspace permissions

The options widen in rank order: *Only administrators* → *Administrators and
managers* → *Everyone except viewers*.

| Action | Default |
|---|---|
| Invite people | Only administrators (managers can always invite into their own organization) |
| Create projects | Everyone except viewers |
| Import data | Only administrators |
| Export data | Administrators and managers |
| Create API tokens | Only administrators |

*Add organizations* is not on this list: it is always administrator-only and
has no setting (decided 2026-11-02, `.scratch/access-requests/spec.md`).

Custom pages (Custom pages settings) use the same three options: *Create pages*
(everyone except viewers), *Edit any page* (administrators and managers;
authors can always edit their own), *Delete pages* (only administrators).

### Organization: Organization settings › Access and permissions

Each is either *All members* or *Only managers*. All four default to **Only
managers**: that's the safe end, because widening later takes one edit, while
narrowing can't undo what was already changed.

| Action | Default |
|---|---|
| Manage settings | Only managers |
| Manage pinned projects | Only managers |
| Manage the landing view | Only managers |
| Manage members | Only managers |

Managers can always do all four. These are **always manager-only and have no
setting**: making the organization private, naming another manager,
inviting people new to the workspace, and approving email domains.

## Joining the workspace

Every account starts as a **Viewer with no organization**, which sees exactly
what the public sees. Five doors lead into an organization. None of them
grants more than Contributor; approving and configuring are earned through
promotion, never by joining.

| Way in | Set on | Lands as | Organization |
|---|---|---|---|
| **Invitation** | Organization › Members (*Add members*), Users (*Invite people*) | The role chosen when inviting (Contributor or Viewer) | The inviting organization |
| **Approved email domain** | Organization › Access › *Approved email domains* | New to the workspace: the organization's *join as* role (default Viewer). Already in it: keeps their role | That organization |
| **Organization invite link** | Organization › Members (managers create and reset it) | The role the manager chose for the link | That organization |
| **Join request** | First sign-in, or *Request edit access* on a project | What the manager approved: as asked, or one level lower | That organization |
| **New-organization request** | First sign-in › *My organization isn't listed* | Contributor and its first manager, once an administrator approves | The new organization |

There is no workspace-wide invite link (removed 2026-11-02): it named no
organization, and an organizationless Viewer gains nothing the public lacks.

### Approved email domains, per organization

Linear's approved domains, scoped to one organization: anyone signed in with
an address at one of its domains joins it **without an invitation or
approval**. The organization's *How people join* setting covers everyone
else.

- **Manager-only, always.** A domain is a standing invitation into the
  workspace, so it follows the invitation rule.
- **Every domain is verified before it admits anyone.** *Add domain* asks for
  the domain and an address at it, and emails that address a 6-digit code.
  Entering the code verifies the domain. *Verify later* leaves it listed as
  **Pending**, with *Enter code* and *Resend code* in its "…". A pending
  domain admits nobody and blocks no other organization.
- **The verification address must be at the domain being claimed**, so the
  code proves the organization controls it.
- **A verified domain belongs to one organization at most.** Adding a domain
  another organization has verified is refused, naming that organization.
- **Personal providers are refused** (gmail.com, outlook.com, yahoo.com,
  icloud.com…), since anyone could join through them.
- **Join as** (Viewer or Contributor, default Viewer) applies only to people
  new to the workspace, and only shows once at least one domain is verified.
- **Removing a domain** closes that door; anyone who already joined through
  it stays a member.
- **Keep the list current.** If an organization stops using a domain, remove
  it, or whoever holds addresses there next can walk in. The field's hint says
  so.

There are no workspace-wide approved domains: someone let in by domain always
belongs to an organization. Each organization's *How people join* setting
(anyone with access, invitation required, or **approval required, the
default**) applies to everyone without a matching domain.

## Requests

The full spec is `.scratch/access-requests/spec.md`.

- **A join request** asks for *Edit its projects* (Contributor) or *Follow it*
  (Viewer), with an optional message. A manager approves as asked or one level
  lower, or declines with an optional reason. The requester hears either way.
- **One pending request per organization**, any number of organizations at
  once. A requester can withdraw. After a decline, the same organization can
  be asked again after 30 days.
- **Where they wait:** Organization settings › Members › *Requests* for
  managers; Workspace settings › Users › *Requests* for administrators, who
  see every request and are told when one has waited 7 days. Requests to an
  organization with no manager go straight to administrators.
- **Request edit access** on a project is a join request to its lead
  organization, for *Edit its projects*.
- **A new-organization request** gives name, type, website and an optional
  message, and waits in Workspace settings › Organizations › *Requested*. The
  administrator sees the requester's email domain beside the website (flagged
  when they differ) and similar existing names, can correct the name or type,
  and approves, sends the requester to an existing organization instead, or
  declines. At the plan's organization limit, approval waits for room.

## Verified organizations

An organization is **verified** when it has a verified approved domain that
matches its website. The mark shows publicly with the domain spelled out
(`✓ deltarcd.org`), because a name proves nothing. **An unverified
organization can't publish its own projects**: they publish only through an
administrator's review.

## Removing an organization

Administrators only, from the organization's danger zone, beside Retire and
Delete. *Remove* unpublishes the organization and its projects at once, hides
it everywhere, ends its memberships, and reassigns or removes each project.
It is logged with a reason and can be undone for 30 days. It exists because
Delete is blocked once an organization leads a project, and an impostor or a
mistake has to come down before anyone relies on it.

## Account status

| Status | Meaning | Shown as |
|---|---|---|
| **Active** | Signed in at least once; has access | Last-active date |
| **Invited** | Invitation not accepted yet | *Invited* badge |
| **Suspended** | Lost all access immediately. Stays listed so the projects and updates they touched still show their name. Left out of organization member lists. | *Suspended* badge |

An administrator suspends from the row's "…" on Users (*Suspend…*, which asks
for confirmation), and undoes it with *Restore access* (no confirmation, since
it's one click to reverse). Nobody can suspend or demote themselves; their own
row has no "…". That's how a workspace loses its last administrator.

## Where each thing lives

| Task | Where | Who |
|---|---|---|
| Change someone's role | Workspace settings › Users → row "…" → *Change role…* | Administrators |
| Suspend / restore / cancel an invitation | Workspace settings › Users → row "…" | Administrators |
| Find invitations or suspended accounts | Users: the list is grouped into **Active**, **Invited** and **Suspended** bands, each counted | Administrators |
| Find people with no organization | Users → *Organization* filter → *No organization* | Administrators |
| Approve or decline a join request | Organization settings › Members › *Requests*; Users › *Requests* | Managers, administrators |
| Approve a new organization | Workspace settings › Organizations › *Requested* | Administrators |
| Make or remove a manager | Organization settings › Members → row "…" | Managers, administrators |
| Add / remove organization members | Organization settings › Members | Per *Manage members* (see above) |
| See who the administrators are | Profile, Security and access → *View administrators* | **Everyone** |

## Data model

In `src/data/firma2-directory.ts`:

```ts
type UserRole = 'Administrator' | 'Contributor' | 'Viewer';

interface WorkspaceUser {
  name: string;
  email: string;
  role: UserRole;
  organizations: string[];                       // ≥1 for a Contributor; may be [] for a Viewer
  managerOf: string[];                           // subset of organizations; [] for a Viewer
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}

isManager(user, org?) // Administrator, or a Contributor whose managerOf includes org (any, if omitted)
administrators()    // active Administrators, for "View administrators"
userRoles           // ['Administrator', 'Contributor', 'Viewer'], highest first
grantableRoles      // ['Contributor', 'Viewer'], what non-administrators can grant
```

Role and status are **separate fields**. The Users list groups by status, as
Linear's does: one table in Active, Invited and Suspended bands, each with its
count, with no lines between rows. Sorting and the Role and Organization
filters work inside each band, and a band with nothing left in it disappears.

## Not yet decided

- **"View as" for other roles.** The prototype is always signed in as an
  administrator, so every control shows. To demo what a manager, Contributor
  or Viewer sees, we need a role switcher. The non-manager invitation error is
  built, but you can't reach it in the demo yet.
- **Left workspace.** Linear separates people who left on their own from
  people who were suspended. We have no self-leave flow yet.
- **Applications.** Linear lists app (integration) accounts among members.
  API tokens here aren't people, so they stay in Security.
