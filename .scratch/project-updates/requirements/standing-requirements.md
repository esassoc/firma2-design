# Standing requirements — Import a report (project-updates, build 1)

Rules every story in `story-map.md` must meet. A story references this file and does not restate it. Each line cites where the rule is written; nothing here is new.

| ID | Requirement | Source | Tag |
|---|---|---|---|
| SR-1 | The interface never uses "project update" as a noun. | inventory RUL-4; spec #6 | decided |
| SR-2 | Every screen works on a phone, a tablet and with touch, by the breakpoints and rules of the mobile foundation spec. This file does not restate them. Stories 05 and 08 hold the two behaviors that are specific to this feature on a narrow screen ("Show source"; the header action inside "…"). | `.scratch/mobile-foundation/spec.md` (status: ready-for-human) | decided |
| SR-3 | Who may act is decided by fixed roles and by who can edit or publish the project. No story adds a role or a permission. Someone who may not act never receives the page, the document or an unpublished value. | system map, Shared rules (owned by `users-and-security`); `docs/roles-and-permissions.md`; inventory RUL-25, RUL-28 | decided |
| SR-4 | A label that names a renameable noun shows the workspace's own word for it. | system map, Shared rules (owned by `workspace-look-and-language`) | inferred there · open: Q-98 (which of this feature's labels and sentences it reaches) |
| SR-5 | Words come from `GLOSSARY.md`. Say "performance measures". | `GLOSSARY.md`; skill rule "Vocabulary" | decided |
| SR-6 | A message about a problem is written next to the control it concerns and announced to assistive technology once. | inventory RUL-52 (shown on the file control; stated here as the pattern the other error states follow) | inferred · open: Q-83 |
| SR-7 | A control or case that another story owns is absent, or not handled, until that story ships. Stories are released together as the epic's plan says, so no story describes a half-built screen: its Out of scope names the control or case and the story that owns it, and nothing more. | skill rule (slice, "Walking skeleton"; write, "Out of scope") | decided |

## Not yet written anywhere

These were looked for and not found in the sources read. Each is a question, not a requirement.

- **Accessibility standard.** Q-83. No source read names the level every screen must meet. Story 23 is where it bites first: Undo is on a toast only (Q-24), and the component's note says a toast action is not reachable by keyboard.
- **Audit.** Whether opening a kept document is logged is Q-45. Nothing else asks for an audit trail beyond the change history.
