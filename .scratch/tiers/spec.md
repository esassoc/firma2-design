# Plans — a free-to-program customer ramp

Status: ready-for-agent

Settled in a grilling session on 2026-10-19. Sister spec:
`.scratch/connected-orgs/spec.md` (how a workspace takes part in another
workspace's program). Decision record for that model:
`docs/adr/0002-a-workspace-can-act-as-an-organization.md`.
Supersedes form-canvas decisions 24–25 (`.scratch/form-canvas/spec.md`): the plans
are **Free, Agency, Program**, not Free and Pro, and the Plan page grows into
Plan and usage.

## Problem Statement

Every Firma workspace today is set up by hand for an agency that bought it
through a contract. There is no way to start small, no plan a program manager can
buy without a solicitation, and nothing in the product that turns a single
agency into a multi-organization program customer. The only plan gate in the code
(the intake builder's `?tier=free|paid`) removes paid parts instead of showing
them, which contradicts the locked-with-a-tease rule (form-canvas decision 21).

## Who pays

- The customers are **public agencies**. No discounts.
- They come in two shapes: a **single agency** tracking its own organization's
  projects, and a **multi-organization program** whose implementers submit and
  manage projects while the program reports across them. Programs need the most
  customization, support and migration.
- **The convener pays** (old Firma's model). Implementers take part for free.
  Rejected: every organization pays its own way. One implementer that won't pay
  is a hole in a stakeholder report, and the product can't sell an aggregate it
  can't guarantee.
- Cost-sharing among member agencies is a contract matter (split invoice), with
  no product interface.

## Never paywalled

Recording projects and performance measures, the basic stakeholder report, the
fact sheet, the public project page, full export, data integrity (aggregation
rules, closed vocabularies), accessibility, connecting to a program, type mapping.
**Sell scale, customization, integrations, governance and support, never the
truth.**

## Decisions

| # | Decision |
|---|----------|
| 1 | Three plans: **Free** (self-serve), **Agency** (self-serve, card or invoice; priced under common purchase-card / micro-purchase limits), **Program** (sold by contract, set up by ESA). |
| 2 | The main line is multi-organization: "are other organizations reporting to you?" |
| 3 | Pricing: a flat annual price per plan; Program priced in bands by organizations. Viewers free and unlimited on every plan. No prices in the prototype. Price research goes in `docs/private/`. |
| 4 | Self-serve signup creates a Free workspace. Program keeps today's hand setup. |
| 5 | Limits are few and on volume only (table below). Measures, classifications, fields and map layers are gated by feature, never by count, so nobody crams several questions into one measure. |
| 6 | A plan-locked feature stays visible and locked: its nav item and page remain, with a tease and one CTA naming the plan ("Available on Program"). Admin feature switches still remove completely. The intake builder moves from "removed" to locked. |
| 7 | Free → Agency is a checkout. Anything that needs Program says **Talk to us** (contact sales). |
| 8 | Admins see the upgrade CTA; Contributors see "Ask an administrator." |
| 9 | Downgrade or over-limit: nothing is deleted or hidden. Paid customizations keep working and showing but can't be edited. Projects over the cap stay editable; no new ones can be added. |
| 10 | Support: Free gets docs; Agency gets email support plus paid migration as an add-on; Program gets a named contact, onboarding, migration and workspace consolidation. |
| 11 | Agency's 3 partner organizations are in-workspace only. Accepting connected organizations is Program only; any plan can connect outward. |
| 12 | The field-and-measure crosswalk (answer once) is Agency and above. Type mapping is free. |

## Limits

| | Free | Agency | Program |
|---|---|---|---|
| Organizations | 1 | 1 plus 3 partner orgs | Priced in bands |
| Projects | 50 | Unlimited | Unlimited |
| Contributors | 5 | Unlimited | Unlimited |
| Viewers | Unlimited | Unlimited | Unlimited |
| File storage | 2 GB | 100 GB | Priced in bands |

Numbers are placeholders to tune; the shape is settled.

## Features by plan

**Every plan:** projects index, My projects, project detail (measures,
expenditures, funding, timeline, gallery, contacts, comments, work areas),
portfolio map, classifications board, updates feed, Share, fact sheet, public
project page, import/export, users and roles, personal settings, performance
measure setup, import work areas (GIS file), connecting to a program, type
mapping, the basic stakeholder report.

| Feature | Free | Agency | Program |
|---|---|---|---|
| Branding, terminology, menu order | Defaults | ✓ | ✓ |
| Custom fields, funding source fields | — | ✓ | ✓ |
| Project types | 1 default | ✓ | ✓ |
| Stages | Default set | ✓ | ✓ |
| Grid defaults | — | ✓ | ✓ |
| Intake form | Standard questions | Custom questions, layout, logic | ✓ |
| Custom pages | 3 | Unlimited | Unlimited |
| Map layers | 1 | ✓ | ✓ |
| Saved views | Personal only | Shared | Shared |
| Security "who can" settings | Defaults | ✓ | ✓ |
| API tokens | — | ✓ | ✓ |
| GIS sync, project source = GIS | — | Add-on | ✓ |
| Crosswalk (fields, measures) | — | ✓ | ✓ |
| Organization reports pages | — | ✓ | ✓ |
| More than 3 organizations | — | — | ✓ |
| Stewards | — | — | ✓ |
| Per-organization access (private orgs, domain joining, per-org "who can") | — | — | ✓ |
| Publish review queue and schedule | — | — (publishes directly) | ✓ |
| Accepting connected organizations, funder-owned fields | — | — | ✓ |
| Reports added up across organizations and programs | — | — | ✓ |

## Surfaces to build

- **Plan state:** extend `readTier()` in `src/lib/intake-form.ts` (or lift it to a
  shared module) to `?tier=free|agency|program`.
- **Locked-page pattern:** form-canvas decision 23, generalized: the real page
  read-only, one info `esa-alert-box` with the tease and one CTA, the top bar's
  primary replaced by the upgrade action.
- **Plan and usage** (`workspace-settings/plan`): the current plan, each limit as
  a count against its cap, and what the next plan adds.
- **Limit prompts** where each limit is hit (e.g. the 51st project: "Free
  includes 50 projects").
- **Locked states** on every Agency and Program feature in the table.

## Build order

1. ADR 0002 and the glossary entry (done with this spec).
2. Plan state, the locked-page pattern, and the intake builder switched to locked.
3. Plan and usage page, and the limit prompts.
4. Locked states on every Agency and Program feature.
5. Connecting to a program, organization side (see connected-orgs spec).
6. Funder side.
7. The field-and-measure crosswalk, last.

Verify in the browser after each step. All strings (including the plan names)
go through the `microcopy` skill. "Never paywall the truth" enters the product
brief once the first screen applying it is built.
