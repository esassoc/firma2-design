# Public views — page inventory

Status: ready-for-agent
Date: 2026-11-20

Step 1 of 3: which pages need a public pair. Step 2 is templates for them;
step 3 is the features that customize them.

## Rules already settled that every public page inherits

- **Published snapshot, not the record** (brief §3, 2026-10-09). The public
  reads what a manager last published.
- **The public = a Viewer with no organization** (roles-and-permissions.md).
  One definition of "what the public sees", signed in or not.
- **Organization visibility** (Organization › Access): a private
  organization's projects are not public.
- **Stage switch** (Workspace settings › Stages): "Shown on the public site",
  per stage.
- **Public site switches** (Workspace settings › Public site › Site details; on Custom pages until 2026-11-24):
  *Public access* ("Published projects, pages and the map, without signing
  in") and *Contact details* (off by default; names always show).
- **Requesters never see managers**: no manager names or emails in page data.
- Existing precedent for the pair: a separate route with no app chrome
  (`/prototypes/public/[project]` on BaseLayout), worn in the tenant brand.

## A. Needs a public pair

| # | App page (route under /prototypes) | Public pair | State | Notes |
|---|---|---|---|---|
| 1 | Project record `projects/[project]` | Public project page | **Built**, reworked 2026-11-20 in the home's language (`public/[project]`, `firma2-public-project`) | Dark hero with the Featured photo, facts strip, results with by-year bars, funding treemap, spending columns, before-and-after photos, full-width map. Has the not-yet-public state. Fact sheet (print/PDF) is still inert. |
| 2 | Project map reading `projects/[project]/map` | Map mode of the public project page | Not built | Its header already names the public as its hardest reader. A mode of #1, not a second page. |
| 3 | Projects index `projects` (Table / List / Map) | Public project finder, with the map | Not built | The *Public access* hint already promises "the map". Saved views fold in as shareable filter URLs. |
| 4 | Organization home `organizations/[organization]` | Public organization page | Not built | Settings copy already says "Viewers and the public see its published page". Its project list is a section, not a second page. |
| 5 | — (no app reading page; only the settings list) | Organizations directory | Not built, no twin | The public needs a way to #4. |
| 6 | Performance measures index `performance-measures` | Public measures index | Not built | Header names "a funder or partner sent the link". |
| 7 | Measure page `performance-measures/[measure]` | Public measure page | Not built | Cut "Edit measure" and how-it-is-asked internals. |
| 8 | Classifications index `classifications` | Public goals index | Not built | Same named reader as #6. |
| 9 | Classification page `classifications/[classification]` | Public goal page | Not built | "The page a program manager sends a funder." |
| 10 | Progress Dashboard `progress-dashboard`, added dashboards `pages/dashboard/[template]` | Public dashboard | Not built | Read mode only. Needs a per-dashboard public choice; none exists. |
| 11 | Custom page `pages/page` | Public custom page | Not built | Visibility choice "Everyone, including the public site" exists; nothing renders it. |
| 12 | Custom document `pages/document` | Public document page | Not built | PDF in place. Same visibility choice. |
| 13 | — (the workspace has no home; Map is the editor's landing) | Public home | **Built 2026-11-20** (`public/index`), no twin | Announcement strip; dark hero (`firma2-public-hero`: name, description, results at poster size, featured projects as three tall photographs); full-width map band with the four figures on a panel; goals against targets; recently updated projects; partners. Authored content is seeded in `PUBLIC_HOME` (`firma2-public-site.ts`) and edited in Workspace settings › Public site (2026-11-24). Goal and organization doors lead to the index stubs until those pages exist. |

## B. Not pages, but every public page needs them

| Piece | State |
|---|---|
| Public shell: tenant header, public navigation, footer, Sign in door | **Built 2026-11-20** — `PublicLayout`, `firma2-public-header`, `firma2-public-footer`, menu in `src/data/firma2-public-site.ts`; the project page wears it; six destination routes exist as not-built-yet pages |; **signed in (2026-11-23):** an account menu replaces Sign in — see `signed-in-doors-decision.md`
| Settings that customize the site (step 3) | **Built 2026-11-24** for the home, navigation, theme, footer and identity: Workspace settings › Public site. See `.scratch/public-site-settings/spec.md` |
| Public search | Not built |
| Not-public states: unpublished project (built), private organization, hidden stage, public access off, page not shared publicly | One of five built |
| "View public page" door from each paired app page | Built for projects only (project page top bar since 2026-11-23, Review, Branding preview) |

## C. Decided 2026-11-20 (user: "go with your recommendations")

| Page | Question | Decision |
|---|---|---|
| Updates `updates`, `organizations/[o]/updates` | Does the public get a feed? | No page. The app feed is a change log for administrators. A "recently published" block on the public home and organization page is enough. |
| Organization Reports `organizations/[o]/reports` | Are reports public? | Defer. The report itself is unbuilt (brief §7); when it exists it is a public-facing document and joins list A. |
| Saved view `organizations/[o]/views/[view]` | Shareable publicly? | Fold into #3 as filter URLs; no separate page. |
| Funding sources / Funding Status | Public funding pages? | Defer until the app pages exist (brief §6: not built). |
| What's new `changelog` | — | Already public; it is about the product, not the workspace. Leave out of the public site's navigation. |

## D. No public pair

- **Work surfaces:** Map (my projects), My projects, Review, Review a project,
  Intake, New project, Import projects, Import work areas, Import a report,
  Organization Projects / Review / Views list.
- **Settings:** all of Workspace settings, organization settings, account
  settings.
- **Account flow:** Sign in is public by nature and becomes the shell's door.
  Welcome, Join and New-organization request are signed-in.
- **Experiments:** `proto/*`, `pm2/*`, `team-5/*`, `archive/*`.

## Open questions

1. **Aggregates on public pages count published values only.** Decided
   2026-11-20 (the Viewer rule). A public total can lag the app's.
2. **Does a signed-in organizationless Viewer see the public site or the app
   shell?** Still open. The header's Sign in becomes "Open workspace" once a
   session exists to read.
3. **Per-page public choice or one switch?** Today: one workspace switch, plus
   organization, stage and custom-page visibility. Dashboards (#10), measures
   and goals have no choice of their own.
4. This feature answers brief §7's "is the public a real reader" in practice;
   update the brief when the first template lands.
