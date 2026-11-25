# 2. A workspace can act as an organization in another workspace

Date: 2026-10-19
Status: accepted

## Context

The workspace is the tenant (settled 2026-10-02), and organizations live inside
one workspace. That fits a program that hosts all its implementers. It fails the
case the plans depend on: an organization runs its own workspace, then a funder
it reports to buys a program workspace. The organization must take part in the
program and keep its own workspace. Two records per project, kept by hand, is
the double reporting the product exists to remove.

Payment stays with the convener: the program pays, and organizations take part
for free (`.scratch/tiers/spec.md`).

## Decision

A workspace can **connect** to a program workspace, where it appears as a
**connected organization**, beside in-program organizations.

1. A shared project is **one record**, owned and edited by the connected
   organization's workspace and shown live in the program's.
2. The program sets the **scope** (project types, optionally its own funding) and
   the **minimum** it must see. The organization maps its project types to the
   program's and can share more, field by field.
3. The program reviews and publishes through its existing publish review, and
   edits only its own funder-owned fields.
4. Leaving ends the live link; the program keeps a frozen copy of what was
   published.
5. One workspace can connect to several programs.

## Consequences

- "Workspace = tenant" still holds for billing and administration. An
  organization in a program is now either a place inside the workspace or a
  pointer to another workspace.
- Aggregates in a program must work over records it doesn't own; visibility is
  per program, per field.
- Type mapping is the first crosswalk. Fields and measures follow, guarded by
  matching counting rules (`docs/measure-model.md`).
- Consolidating workspaces by moving projects is not needed: an in-program
  organization graduates to its own workspace and stays connected.
- Spec: `.scratch/connected-orgs/spec.md`.
