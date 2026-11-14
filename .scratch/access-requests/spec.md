# Access requests and organization creation

Status: ready-for-agent

Settled in a grilling session on 2026-11-02 (30 decisions). Mock content is invented.

## Problem Statement

A workspace gathers projects from many organizations, and it does not know all of them when it is set up. People keep arriving from organizations the workspace has never heard of, and from ones it has.

Today a newcomer has no way in. Unless someone invited them or their email domain is approved, they land as a Viewer with no organization and nothing to do. Organization › Access offers "Approval required", but nothing lists the requests. Nobody can ask for a new organization: only an administrator or steward can add one, from a form the newcomer never sees. The most common support request in the product, "let me edit my organization's projects", has no button.

The model also has trust gaps. An organization's name proves nothing, so a fake "Apple" can be added and its projects published under that name. Delete is blocked once an organization leads a project, so a bad organization cannot be taken down. And "Steward" carries ProjectFirma 1.x meaning that confuses the people it is meant for.

## Solution

Newcomers **join** organizations; only **administrators create** them.

- A new account is a **Viewer with no organization**, which sees exactly what the public sees. First sign-in asks one skippable question: *Which organization do you work for?* The answer joins them at once, sends a **join request**, or names the organization's managers.
- A join request asks to *Edit its projects* (Contributor) or *Follow it* (Viewer). The organization's **Managers** approve it, or grant one level lower, or decline it. Administrators see every request and are told when one has waited 7 days.
- **Request edit access** on any project a signed-in person cannot edit is a join request to its lead organization.
- *My organization isn't listed* sends a **new-organization request**. Only an administrator approves it; the requester becomes a Contributor and its first Manager.
- An organization is **verified** when it has a verified email domain that matches its website. The public sees the mark with the domain spelled out. An unverified organization cannot publish its own projects.
- An administrator can **Remove** an organization: it unpublishes at once, disappears everywhere, and can be undone for 30 days.
- **Steward is renamed Manager** everywhere.

## Decisions

| # | Decision |
|---|---|
| 1 | Organizations are not all known at setup. An organization normally comes into existence with its first member, through a new-organization request. |
| 2 | A newcomer whose organization is not listed requests a new one. Nobody is left stuck. |
| 3 | A Contributor edits every project **led** by an organization they belong to. Funding a project gives no edit rights (ADR 0002 keeps funders to their own fields). |
| 4 | Approving a join request may raise a Viewer to Contributor, never higher, never lower. The approval says the role changes. |
| 5 | The default for *How people join* is **Approval required** (was Invitation required). |
| 6 | **Verified** = a verified email domain matching the organization's website. Shown publicly with the domain spelled out (`✓ deltarcd.org`). |
| 7 | **Only administrators create organizations** and approve new-organization requests. Managers cannot add organizations. |
| 8 | On approval, the requester becomes a Contributor and the organization's first Manager. Until its domain is verified, its projects publish only through an administrator. |
| 9 | A new account is a Viewer. **A Viewer with no organization sees exactly what the public sees.** |
| 10 | An administrator may still create an organization with no members (a funder). Its people join later by ordinary join request, which an administrator approves while it has no manager. |
| 11 | "Add organizations" is a fixed administrator-only act. It leaves Security › Workspace permissions and joins the acts that never widen. |
| 12 | *Workspace members* visibility means people who belong to at least one organization, plus administrators. Short label: "Members of any organization". |
| 13 | The workspace invite link is removed. Each organization gets its own link on its Members page: managers create and reset it, using it counts as an invitation (no approval), and it grants the role the manager chose (Viewer or Contributor). |
| 14 | A Viewer reads published values everywhere. Membership adds the organization's private pages and projects, not its unpublished edits. |
| 15 | A request asks for *Edit its projects* or *Follow it*. A manager approves as asked or one level lower; the requester is told which. |
| 16 | Administrators see and can act on every request at any time, and are notified when one has waited 7 days. Requests to an organization with no manager go straight to administrators. |
| 17 | First sign-in is one skippable question, *Which organization do you work for?* — search; outcome by the organization's join setting; *My organization isn't listed*; *Skip for now*. Reachable later from the profile. |
| 18 | A new-organization request asks for name, type, website and an optional message. An email domain that does not match the website is flagged to the administrator, not blocked. Similar existing names are shown. |
| 19 | Administrators can **Remove organization**: unpublishes at once, hides it everywhere, ends its memberships, reassigns or removes its projects, logged with a reason, undoable for 30 days. |
| 20 | Organizations get an **Added by** column. No notification on add (only administrators add). |
| 21 | Steward is renamed **Manager** — UI, docs and code (`managerOf`, `isManager`, `?as=manager`). |
| 22 | A Manager is a Contributor who runs one organization's members, settings and approvals. Any number per organization, including none. Administrators act as managers of every organization. |
| 23 | Rename reaches code and docs in the same pass. |
| 24 | Requests wait where approving them takes effect: Members › *Requests* (managers), Users › *Requests* (administrators, join requests), Organizations › *Requested* (new-organization requests). |
| 25 | A requester can withdraw a pending request. A decline reason is optional and is sent when given. After a decline, the same organization can be asked again after 30 days. |
| 26 | One pending request per organization; any number of organizations at once. |
| 27 | *Request edit access* on a project fills in its lead organization and *Edit its projects*, and names where it goes. If a request is already pending there, it says so instead. |
| 28 | Intake's lead organization offers *Not listed — request it*. The proposal stays a draft and cannot be submitted until the organization is approved. If declined, the draft stays with its author to re-point. |
| 29 | At the plan's organization limit, requests still arrive. The administrator sees the limit and upgrade prompt on the request and cannot approve until there is room. The requester sees only "pending". |
| 30 | An approved organization starts Public with *Approval required*; its manager can change both. Connected organizations (ADR 0002) are out of scope. |

Assumptions accepted with the decisions: notifications go by email and in-app; an administrator can correct a requested organization's name or type before approving; *Added by* shows the approving administrator, and the record names the requester.

## User Stories

### Newcomer

1. As a newcomer, I want to be asked which organization I work for when I first sign in, so that I know how to get to my organization's projects.
2. As a newcomer, I want to search organizations by name, so that I can find mine without knowing how the workspace is set up.
3. As a newcomer at an organization with a verified domain, I want to be in it as soon as I sign in, so that I wait for nobody.
4. As a newcomer, I want to choose between editing my organization's projects and following them, so that I ask only for what I need.
5. As a newcomer, I want to add a message to my request, so that the manager knows who I am.
6. ~~As a newcomer at an invitation-only organization, I want to see who its managers are.~~ Reversed 2026-11-02: invitation-only organizations are not listed to newcomers at all, and no requester surface names a manager (spam).
7. As a newcomer whose organization is not listed, I want to request it, so that I am not stuck.
8. As a newcomer, I want to skip the question and come back to it from my profile, so that I can look around first.
9. As a requester, I want to see my pending requests and which role answers them (its managers, or the administrators — never their names, 2026-11-02), so that I know what I am waiting for.
10. As a requester, I want to withdraw a request, so that I can fix a mistake.
11. As a requester, I want to be told when a request is approved or declined, and why if a reason was given, so that I know what to do next.
12. As a requester, I want to ask several organizations at once, so that a consultant working for two can ask both.

### Signed-in reader on a project

13. As a signed-in person who cannot edit a project, I want a Request edit access button on it, so that I can ask without knowing which organization runs it.
14. As that person, I want the button to name the organization it goes to, so that I know who will answer.
15. As that person with a request already pending, I want the button to say so, so that I don't ask twice.

### Manager

16. As a manager, I want pending requests at the top of my organization's Members page, so that I see them where I manage people.
17. As a manager, I want each request to show the person's email and whether its domain matches ours, so that I can judge whether they work here.
18. As a manager, I want to approve as asked or one level lower, so that I can let someone follow without letting them edit.
19. As a manager, I want approving to tell me when it raises someone to Contributor, so that a role change is never a surprise.
20. As a manager, I want to decline with an optional reason, so that I can explain when it helps.
21. As a manager, I want an invite link for my organization that I can reset, so that I can bring my team in without one invitation each.

### Administrator

22. As an administrator, I want every join request in one place on Users, so that nothing waits unseen.
23. As an administrator, I want to be told when a request has waited 7 days, so that an absent manager doesn't strand anyone.
24. As an administrator, I want requests to organizations with no manager to come to me, so that they have someone to answer them.
25. As an administrator, I want new-organization requests at the top of Organizations, so that I approve them where organizations live.
26. As an administrator, I want a request to show the requester's email domain beside the website they gave, flagged when they differ, so that I can spot an impostor.
27. As an administrator, I want to see existing organizations with similar names, so that I don't create a duplicate.
28. As an administrator, I want to send a requester to an existing organization instead, so that a duplicate request becomes a join.
29. As an administrator, I want to correct a requested organization's name or type before approving, so that the list stays tidy.
30. As an administrator at the plan limit, I want to see the limit on the request, so that I know why I can't approve yet.
31. As an administrator, I want to see who added each organization, so that I can trace any that look wrong.
32. As an administrator, I want to remove an organization at once, unpublishing everything it put out, so that an impostor or a mistake is gone before anyone relies on it.
33. As an administrator, I want a removal to be undoable for 30 days, so that removing a real organization by mistake is recoverable.

### Public and Viewers

34. As a member of the public, I want a verified organization to show its domain, so that I can tell it is real.
35. As a Viewer with no organization, I want to see what the public sees, so that signing up opens nothing it shouldn't.

### Intake

36. As a Contributor filing for an organization that isn't listed, I want to request it from the lead organization field, so that I can keep drafting.
37. As that Contributor, I want my draft kept if the request is declined, so that I can choose another lead organization.

## Implementation Decisions

### Model

- `WorkspaceUser.stewardOf` → `managerOf`; `isSteward` → `isManager`; the `?as=steward` demo switch → `?as=manager`.
- `AccessRequest`: `id`, `kind` (`join` | `organization`), `requester` (name, email), `organization` (existing name, or for `organization` requests: name, type, website), `asked` (`Contributor` | `Viewer`), `message?`, `created`, `status` (`pending` | `approved` | `declined` | `withdrawn`), `granted?`, `reason?`, `answeredBy?`.
- `Organization.addedBy` (person) and `Organization.requestedBy?`. `Organization.verified` derives from a verified approved domain matching `website`.
- Browser-local persistence, one versioned key, the same honesty terms as every store in the spoke (`src/lib/access-requests.ts`).

### Surfaces

- **First sign-in** — `/prototypes/welcome`: the one question, its outcomes, and *Your requests* below once any exist. Also linked from Profile.
- **New-organization request** — `/prototypes/welcome/new-organization` (adds are pages).
- **Project record** — *Request edit access* in the record's actions for a signed-in reader who cannot edit (demo with `?as=viewer`).
- **Organization settings › Members** — *Requests* band above Invited; the invite link section.
- **Workspace settings › Users** — *Requests* band.
- **Workspace settings › Organizations** — *Requested* band, Added by column, verified mark.
- **New-organization review** — `/prototypes/workspace-settings/organizations/requests/[id]`: the evidence (domains, similar names), editable name/type, Approve / Add to existing / Decline, plan limit.
- **Organization danger zone** — *Remove organization* (administrators only).
- **Security** — "Add organizations" and the workspace invite link removed.
- **Organization › Access** — default *Approval required*; "Workspace members" relabelled.

## Out of Scope

- Connected organizations (ADR 0002).
- Real email delivery and real identity checks; the prototype shows what would be sent.
- Accountless intake.
- Merging two organizations that already exist.

## Comments
