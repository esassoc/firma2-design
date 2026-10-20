# Connected organizations — one record, reported to every program

Status: ready-for-agent

Settled in a grilling session on 2026-10-19. Decision record:
`docs/adr/0002-a-workspace-can-act-as-an-organization.md`. Plans and limits:
`.scratch/tiers/spec.md`.

## Problem Statement

A small organization buys Firma for its own work. A funder sees its reports and
wants everyone it funds on Firma, so the funder buys Program and sets up a
program workspace. The organization now has to be part of the funder's program,
but it still wants its own workspace, because it tracks more project types and
more fields its own way. Today the only answer is two records per project, kept
by hand, which is the double reporting the product exists to remove. An
implementer funded by three programs re-keys the same project three times.

## Solution

A workspace can **connect** to a program workspace and appear in it as a
**connected organization**. Shared projects stay one record, owned and edited by
the organization, shown live in the program. The program sets what it needs to
see; the organization chooses what to share beyond that.

## Decisions

| # | Decision |
|---|----------|
| 1 | Two ways to belong to a program: an **in-program organization** (lives inside the program workspace, as today) or a **connected organization** (its own workspace, linked in). An in-program organization can graduate to its own workspace, taking its projects and staying linked. |
| 2 | A shared project is **one record**, owned by the organization's workspace and shown live in the program's. No copies. |
| 3 | The program publishes a **scope rule**: project types it wants, optionally "and funded by us." Projects outside it never leave the organization's workspace. |
| 4 | At connection, the organization **maps its project types** to the program's types, or to "not in this program." The map can be edited later; changes appear in the program's review queue. |
| 5 | Projects that fit the rule are pre-selected; the organization confirms each one. Nothing is shared without its yes, and an omission is visible. |
| 6 | Creating a project that fits asks "Share with [program]?" with Yes pre-selected. |
| 7 | The program sets a **minimum**: core facts it picks (name, type, work areas, dates, stage, description), its own fields, and its performance measures. Items the organization doesn't track appear as a program section on the project, answered in the organization's workspace. |
| 8 | The organization may **share more**, field by field per program, set once in the connection settings. Amounts from other funders are hidden by default and can be turned on. |
| 9 | A project under the minimum is shared anyway, marked incomplete, and listed in the program's review queue. |
| 10 | When the program adds a required item, connected organizations get a notice and their projects show incomplete until answered; nothing is filled in backwards. A removed item keeps its values in published copies. |
| 11 | Only the organization edits. The program reviews: comment, send back, publish in the program through the existing publish review. |
| 12 | Exception: **funder-owned fields** (grant agreement number, compliance status) are edited by the program and read-only for the organization. |
| 13 | Stopping a share or leaving: the program keeps a frozen copy of the last published version and its history, marked no longer connected. The live link ends. |
| 14 | An organization can connect to several programs, each with its own scope rule, mapping and sharing. One project can be shared with several programs. |
| 15 | Each workspace publishes its own public page. The program's page shows only the program view and links to the organization's page if published. |
| 16 | One **crosswalk** mechanism: v1 maps project types only; fields and measures answer the program directly. Later, the organization links its own field or measure to the program's so one answer serves both, allowed only when the counting rules match; unit conversion within one kind of quantity. The field-and-measure crosswalk is Agency and above. |
| 17 | Plans: accepting connected organizations needs Program. Connecting outward works on any plan, Free included, which makes every program a signup channel. |
| 18 | An organization leaving can always take a full export of its projects, on every plan. Moving back into its own workspace can come later. |

## User Stories

### Organization (connected)

1. As an organization administrator, I want to connect my workspace to a funder's program, so that I report there without re-entering projects.
2. As an organization administrator, I want to map my project types to the program's, so that I keep tracking my own way while the program gets its own categories.
3. As an organization administrator, I want projects that fit the program pre-selected but confirmed by me, so that nothing leaves my workspace without my yes.
4. As a contributor, I want a new project that fits the program to ask whether to share it, so that the funder's report doesn't quietly miss it.
5. As a contributor, I want the program's required fields and measures as their own section on my project, so that I answer them where I already work.
6. As an organization administrator, I want to choose extra fields to share per program, so that each funder sees what I'm comfortable showing.
7. As an organization administrator, I want other funders' amounts hidden unless I turn them on, so that competing funders never see each other's money.
8. As an organization, I want to stop sharing and keep my work, so that joining a program is never a trap.

### Program (funder)

9. As a program administrator, I want to set the scope rule and the minimum fields, so that every connected project answers what the program needs.
10. As a program administrator, I want incomplete shared projects in my review queue, so that I can chase gaps instead of losing projects.
11. As a program administrator, I want to fill in grant agreement numbers and compliance status myself, so that my administrative facts live with the project.
12. As a program administrator, I want a frozen copy of what was reported when an organization leaves, so that my past reports stay true.

## Out of scope for v1

- The field-and-measure crosswalk (build last).
- Moving an organization's projects back into its own workspace when it leaves a program (export covers v1).
- Consolidating several workspaces into one: replaced by connecting.
