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

**Plan** — Free, Agency or Program: what a workspace can use and how much.
_Avoid:_ tier (in visible copy).

**Performance measure** — a question asked of every project, forever.
_Avoid:_ KPI.
