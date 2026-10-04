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
**steward** of an organization they belong to. Steward is a flag on one
membership, not a role (Linear's *team owner*).
Anything that varies between workspaces is a **"who can" setting on the action
itself**, never a new role.

| Linear | ProjectFirma |
|---|---|
| Workspace | Workspace |
| Team | Organization |
| Admin | **Administrator** (workspace role) |
| Team owner | **Steward** (per-organization flag) |
| Member | **Contributor** (workspace role) |
| Guest | **Viewer** (workspace role; read-only across the workspace, where a Linear guest is limited to the teams they belong to) |
| Owner (Enterprise only) | No equivalent; we have no billing or plans |

## Roles

The roles are fixed, so there is no settings page for them. This table is the
reference, and each role's description also appears under it in the Users
*Change role…* dialog, where the choice is made.

| Role | What it is | Can edit | Approves updates | Manages settings | Set on |
|---|---|---|---|---|---|
| **Administrator** | Configures the workspace and manages people. Counts as a steward of every organization. | All projects | All projects | All | Workspace settings › Users |
| **Steward** | Runs one organization's members, settings and approvals. Given only to Contributors. | Their organization's | Their organization's | Their organization's | Organization settings › Members |
| **Contributor** | Drafts updates on the projects of their organizations. Belongs to at least one. | Their own | No | No | Workspace settings › Users |
| **Viewer** | Signed in, read-only, with or without an organization. Can't be a steward. | None | No | No | Workspace settings › Users |

Rules that never change:

- **Only an Administrator can make someone an Administrator**, and only from
  Users. Everywhere else (an organization's Members page, its approved email
  domains, the invite link) can grant Contributor or Viewer, nothing higher.
- **Administrators are stewards of every organization** automatically. Whoever
  creates an organization becomes its steward.
- An organization can have **any number of stewards, including none**.
- **A Viewer can never be a steward.** Changing a steward to Viewer removes
  their stewardship, and the change-role dialog says so before you save.

## Organization membership

A person belongs to **any number of organizations**. Membership and role are
separate: the role is workspace-wide, and membership says which organizations
someone works in or follows.

| Role | Organizations | What membership gives them |
|---|---|---|
| **Administrator** | Any number | Nothing extra; they already steward every organization |
| **Contributor** | **At least one** | The projects they can draft on, and the chance to be its steward |
| **Viewer** | **Zero or more** | That organization's member-only views (a private organization, its landing view). An organizationless Viewer still reads everything else |

What keeps this true:

- **Removing a Contributor from their last organization makes them an
  organizationless Viewer.** That's the same place a Viewer lands when removed
  from their last one. The remove confirm says so before it happens, and the
  toast reports it ("…removed. They're now a Viewer.").
- **Removing someone who belongs elsewhere** ends only this membership, and
  removing them also ends their stewardship here.
- **Making an organizationless Viewer a Contributor** (Users › *Change role…*)
  requires choosing an organization in the same dialog. It won't save without
  one.
- **Becoming a Viewer** keeps someone's organizations but ends every
  stewardship.
- **Adding someone already in the workspace** to an organization never changes
  their role. The Add dialog's Role field applies only to people being
  invited.

## Who can manage an organization's members

"Managing members" covers adding, removing, approving requests to join, and
inviting people.

| Who | Add people already in the workspace, remove, approve requests | Invite people new to the workspace (by email) | Make or remove stewards |
|---|---|---|---|
| **Administrators** | Always | Always | Always |
| **That organization's stewards** | Always | **Always** | Always |
| **Its other members** | Only if Access › *Manage members* = "All members" (default: "Only stewards") | Never | Never |

**Why invitations are steward-only.** Typing a new email address in *Add
members* doesn't just add someone to the organization. It also brings a new
person into the **workspace**, and Security › *Invite people* has its own
setting for that. Both settings would apply to the same action, so Linear's
rule decides it: stewards can always invite into their own organization, and
everyone else can only add people who already have an account. Someone who
isn't a steward and types a new email sees *"[email] isn't in the workspace
yet. Ask a steward to invite them."*

The hint text on both settings says this, so neither page can be misread:
- Organization › Access › *Manage members*: "…Only stewards can invite people
  new to the workspace."
- Security › *Invite people*: "…Stewards can always invite people into their
  own organization."

Per member row on Organization settings › Members, a steward can:

| Action | Applies to |
|---|---|
| Make steward / Remove as steward | Contributors who have accepted |
| Resend invitation, Cancel invitation | Invited rows |
| Remove from organization | Everyone except themselves (see *Organization membership* for where they land) |

A steward **can't**:
- Change anyone's role. Roles are workspace-wide and a person can belong to
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
stewards* → *Everyone except viewers*.

| Action | Default |
|---|---|
| Invite people | Only administrators (stewards can always invite into their own organization) |
| Add organizations | Administrators and stewards |
| Create projects | Everyone except viewers |
| Import data | Only administrators |
| Export data | Administrators and stewards |
| Create API tokens | Only administrators |

Custom pages (Custom pages settings) use the same three options: *Create pages*
(everyone except viewers), *Edit any page* (administrators and stewards;
authors can always edit their own), *Delete pages* (only administrators).

### Organization: Organization settings › Access and permissions

Each is either *All members* or *Only stewards*. All four default to **Only
stewards**: that's the safe end, because widening later takes one edit, while
narrowing can't undo what was already changed.

| Action | Default |
|---|---|
| Manage settings | Only stewards |
| Manage pinned projects | Only stewards |
| Manage the landing view | Only stewards |
| Manage members | Only stewards |

Stewards can always do all four. These are **always steward-only and have no
setting**: making the organization private, naming another steward,
inviting people new to the workspace, and approving email domains.

## Joining the workspace

There are three ways in. None of them grants more than Contributor; approving
and configuring are earned through promotion, never by joining.

| Way in | Set on | Lands as | Organization |
|---|---|---|---|
| **Invitation** | Organization › Members (*Add members*), Users (*Invite people*) | The role chosen when inviting (Contributor or Viewer) | The inviting organization |
| **Approved email domain** | Organization › Access › *Approved email domains* | New to the workspace: the organization's *join as* role (default Viewer). Already in it: keeps their role | That organization |
| **Invite link** | Security › Joining | Viewer | None (a Contributor needs one, and the link names none) |

### Approved email domains, per organization

Linear's approved domains, scoped to one organization: anyone signed in with
an address at one of its domains joins it **without an invitation or
approval**. The organization's *How people join* setting covers everyone
else.

- **Steward-only, always.** A domain is a standing invitation into the
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
(anyone with access, invitation required by default, or approval required)
applies to everyone without a matching domain.

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
| Make or remove a steward | Organization settings › Members → row "…" | Stewards, administrators |
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
  stewardOf: string[];                           // subset of organizations; [] for a Viewer
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}

isSteward(user, org?) // Administrator, or a Contributor whose stewardOf includes org (any, if omitted)
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
  administrator, so every control shows. To demo what a steward, Contributor
  or Viewer sees, we need a role switcher. The non-steward invitation error is
  built, but you can't reach it in the demo yet.
- **Left workspace.** Linear separates people who left on their own from
  people who were suspended. We have no self-leave flow yet.
- **Applications.** Linear lists app (integration) accounts among members.
  API tokens here aren't people, so they stay in Security.
- **Join requests.** Access offers "Approval required", but Members has no
  list of pending requests to approve or decline yet.
- **Organization creator becomes steward.** This is a rule of the model, but
  the create form doesn't show it yet.
