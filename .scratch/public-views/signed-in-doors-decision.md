# Signed in on the public site — where the doors live

Status: ready-for-agent
Date: 2026-11-23
Decided from `/proto/public-session` (prototype deleted).

## Decision

- **A signed-in reader gets an account menu in the public header's corner**, in
  place of Sign in: their avatar, opening a menu.
- **The menu holds, in order:** the page's own record in the workspace when the
  page has one (a project's public page: "Open project"), "Review changes (n)"
  when that project has unpublished changes, "Open workspace", then "Sign out".
- **Sign out stays on the public page** and reloads it signed out, so the
  reader sees the page as the public does.
- **The unpublished-changes strip stays** under the header for signed-in
  readers ("3 unpublished changes. Review changes"; "Not public yet." before a
  first publish). It is about the page; the menu is about the person.
- **The project page in the workspace has a "Public page" icon button** in its
  top bar, shown once the project has been published.
- Any signed-in reader sees the strip and the menu, whatever their role. The
  review page says who may publish.
- Built in `firma2-public-header` (menu), `firma2-public-review-notice`
  (strip), `firma2-project-actions` (Public page). "Signed in" is a browser
  flag in the prototype (`src/lib/session.ts`): any workspace page sets it.

## Rejected

- **Current** (a single "Open project" / "Open workspace" button in place of
  Sign in): no way to sign out, and one door only.
- **Staff bar** (a strip above the site's header with every door, the reader's
  name and Sign out): about 48px of chrome on every public page, and the page
  stops looking like the public's.
- **Dock** (a floating group in the bottom corner): covers content, worst on a
  phone, and the least expected place for Sign out.

## Not built

- Record doors on public pages other than a project's (they offer Open
  workspace and Sign out only).
