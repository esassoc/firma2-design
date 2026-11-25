# Directory pages: organizations, members and support requests

Status: needs-triage

The app rail's More group listed Organizations, Funding Sources, Members and
Support Requests, and none of them opened anything. Each needs a list and a page
per record, read by anyone signed in (support requests: by administrators), and
kept apart from the Workspace settings pages where an administrator changes the
same records. Funding sources are built separately (data model decision 1); this
spec covers the other three, and the removal of an organization's Views.

Who it is for: Program staff, Executive, and Public / partner readers looking an
organization or a person up; Program staff (Administrator) answering support
requests.

The brief's five questions are answered in each page's module header:
`src/pages/prototypes/organizations/index.astro`, `organizations/[organization]/index.astro`,
`members/index.astro`, `members/[member].astro`, `support-requests/index.astro`,
`support-requests/[request].astro`.

## Decisions

| # | Decision |
|---|----------|
| 1 | Organizations, members and support requests each have a list and a page per record in the app, opened from the More group. *(user, 2026-11-24)* |
| 2 | An organization has no Views pages: the saved-views list and each saved view's page are removed, with the rail row. *(user, 2026-11-24)* |
| 3 | Support requests are worked through as an inbox, the pattern Review uses: the list beside the selected request, and resolving one moves to the next. The table built first is gone. *(user, 2026-11-24)* |
| 4 | Access requests (people asking to join an organization, and requests for a new one) get the same inbox, on a page of their own. *(user, 2026-11-24: "why not have a similar thing for user requests")* |
| 5 | A support request can be sent from a New request page, and an administrator can change who it is assigned to. *(user, 2026-11-24, on being told these were left out)* |
| 6 | An organization's page opens on who the organization is: its description, its totals and its facts, then its projects, the funding sources it offers, its members and the map. The first version, the members' Home with an About tab added, was rejected. *(user, 2026-11-24: "abysmal")* |
| 7 | A support request's properties (assigned to, type, sender, organization, email, the page it was sent from, dates) sit in a docked rail beside the request, not under the conversation. *(user, 2026-11-24)* |

## Proposed, not yet confirmed

Built as the obvious completion; each is the builder's call until the user says otherwise.

- The Organizations list is the settings grid in a reading mode: no administrator columns, no Add, and a private organization the reader is not in is not listed.
- Which of last year's reports did not come back, and the latest updates, show on an organization's page only to its members. Anyone else sees a member count in that place.
- Members lists active accounts only. Invited and suspended accounts stay on Workspace settings › Users.
- A member's page shows role, email and the organizations they are with. It has no activity feed and does not show last active.
- A support request is a Question, a Problem, a Correction or Other, sent with a subject and a message. It is Open until an administrator marks it Resolved, and can be reopened.
- A reply is sent with a button, never on leaving the field. Resolving asks for no confirmation.
- Each support request also keeps a page of its own, so one can be linked to.
- The Access requests inbox has two views, Join and New organization. A join request is approved or declined there, by the rules of access-requests decisions 4 and 18. A new-organization request is stated there and decided on its existing review page.
- The request bands on Users, Organizations and an organization's Members settings stay. Whether the inbox replaces them is open.
- Both inboxes are shown to administrators. What a manager or a non-administrator sees there is not built.
- The inbox shell (`firma2-inbox`) is shared by support requests and access requests. Review's inbox still has its own copy of the layout and should move onto the shell.

## What is faked

- A support request sent from New request, a reply, a status change and an assignee are kept in this browser only (`src/lib/support-request-edits.ts`); nothing is emailed.
- Access request answers are kept in this browser (`src/lib/access-requests.ts`), as before.
- An organization added in this browser has no page, so the Organizations list leaves it out.
