# Glossary

Domain terms as this product uses them. Use these words in specs, issues and
code; avoid the listed synonyms.

**Workspace** — the tenant: one customer's Firma, billed and administered as one.
_Avoid:_ initiative, program, partnership (as the tenant term).

**Organization** — a group inside a workspace whose members record projects.
Either an in-program organization or a connected organization.

**Program** — a workspace whose organizations report to it and are coordinated
across. Also the name of the plan that unlocks this.

**In-program organization** — an organization that lives inside the program's
workspace.

**Connected organization** — a workspace linked into a program, where it acts as
an organization. It owns and edits its shared projects. See ADR 0002.

**Shared project** — one record, owned by a connected organization and shown live
in a program. _Avoid:_ synced copy, mirror.

**Scope rule** — which projects a program wants from connected organizations:
project types, optionally its own funding.

**Minimum** — the fields and performance measures a program requires on every
shared project.

**Crosswalk** — a map from a connected organization's types, fields or measures
to a program's. Measures link only when counting rules match.

**Performance measure** — a question asked of every project, forever.
_Avoid:_ KPI.

**Member** — a person with an active account in the workspace. The Members
list is for finding one; an administrator runs accounts in Users. _Avoid:_ user
(outside Workspace settings).

**Support request** — a question or a problem someone sent the workspace's
administrators, open until one marks it resolved. Not a request for access:
joining an organization, or asking for a new one, is a join request or a
new-organization request.

**Funding source** — money one organization offers that can fund many
projects: a grant, an award, an appropriation. A project's funding row links to
one and carries the amount. _Avoid:_ fund, program (as the name of the money).

**Classification** — what a project is filed under so its progress can be read
from above: usually one of the workspace's goals, sometimes another axis such as
a species. Performance measures and targets are set on it. A project can carry
several. _Avoid:_ goal (as the noun for the object), category.

**Classification group** — a named set of classifications and groups. Groups nest: a group
can sit inside another, to any depth, and can be moved under any other. A group has a colour, a description and a
progress page that adds up everything filed beneath it; it has no performance
measures or targets of its own, and projects are never filed directly on it. In a
list, a classification wears its group's colour.
_Avoid:_ parent classification, category, folder.

**Geospatial area** — a place a project is filed under because of where its work is: a
watershed, a habitat area, a district. It is one shape of a reference layer. Nobody
picks it for a project. Used like a classification everywhere a reader meets one; set
up separately. _Avoid:_ spatial classification, region (unless it is the area's name).

**Area group** — a set of geospatial areas read from one reference layer, named by one
of the layer's fields. _Avoid:_ geospatial area type (ProjectFirma 1's term).

**Stage (of a project)** — where the work is in its life: Proposal, Planning &
Design, Implementation and so on. Says nothing about whether the record has been
accepted.

**Solicitation** — a call new projects are entered under. A project says which
one it is for on the intake form; only active solicitations are offered. Not
money: what funds a project is its funding sources.

**Proposal** — a project whose stage is Proposal: work that is proposed and not
yet committed. _Avoid:_ proposal for a project that is waiting to be approved
into the workspace; that is its admission status, whatever its stage.

**Admission status** — whether a project's record is in the inventory yet:
draft, submitted, returned, approved or declined. Independent of stage. A
project counts in reports and on the public map once approved.

**Photo point** — a named place a project's photos are taken from ("Culvert,
looking upstream"). Two or more photos at one point show the same view over
time. _Avoid:_ pair (a pair is a Before and an After at one photo point, not a
thing of its own), station.

**Stage (of a photo)** — where in the work a photo was taken: Before, During or
After. Stored on the photo, never read from its date. _Avoid:_ timing, phase.

**Collection (of photos)** — a named, ordered set of a project's photos shown
together, such as a planting day. A photo is in at most one. _Avoid:_ album,
carousel (the carousel is how a collection is shown).
