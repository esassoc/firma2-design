# Standing requirements — Import a report (project-updates, build 1)

Rules every story in `story-map.md` must meet. A story references this file and does not restate it. Each line cites where the rule is written and carries a tag. A line tagged `proposed (Q-n)` rests on a proposed answer awaiting the user's validation (`.scratch/proposed-answers.md`): binding like any other, and not a decision until validated. Updated 2026-11-23, when the answers were written into the stories.

| ID | Requirement | Source | Tag |
|---|---|---|---|
| SR-1 | The interface never uses "project update" as a noun. | inventory RUL-4; spec #6 | decided |
| SR-2 | Every screen works on a phone, a tablet and with touch, by the breakpoints and rules of the mobile foundation spec. This file does not restate them. Stories 05 and 08 hold the two behaviors that are specific to this feature on a narrow screen ("Show source"; the header action inside "…"). | `.scratch/mobile-foundation/spec.md` (status: ready-for-human) | decided |
| SR-3 | Who may act is decided by fixed roles and by who can edit or publish the project. No story adds a role or a permission. Someone who may not act never receives the page, a document's name, a change's quote or an unpublished value. | system map, Shared rules (owned by `users-and-security`); `docs/roles-and-permissions.md`; inventory RUL-25, RUL-28; spec #42 | decided; proposed (Q-136) for the name and the quote |
| SR-4 | Every label and every sentence the product words takes the workspace's own word for a renameable noun, in the form the sentence needs. The reading service words nothing. | system map, Shared rules (owned by `workspace-look-and-language`); Q-98 | proposed (Q-98) |
| SR-5 | Words come from `GLOSSARY.md`. Say "performance measures". | `GLOSSARY.md`; skill rule "Vocabulary" | decided |
| SR-6 | A message about a problem is written next to the control it concerns, tied to it for assistive technology, announced once, and goes when its cause does. | inventory RUL-52 (shown on the file control); Q-83 (b), Q-96, Q-104, Q-108 | shown; proposed (Q-83) |
| SR-7 | A control or case that another story owns is absent, or not handled, until that story ships. Stories are released together as the epic's plan says, so no story describes a half-built screen: its Out of scope names the control or case and the story that owns it, and nothing more. | skill rule (slice, "Walking skeleton"; write, "Out of scope") | decided |
| SR-8 | Every screen meets WCAG 2.2 at level AA. A client contract that names another standard replaces it. | Q-83 (a); no written source names a standard | proposed (Q-83) |
| SR-9 | Reading by an outside AI service is a workspace setting: off until an Administrator agrees and turns it on, and it can be unavailable to a workspace. Import a report exists in a workspace only while the setting is on. Every story assumes it on; stories 82 and 83 hold the setting and the other two states. | spec #41 (the user, 2026-11-23, Q-52); stories 82 and 83 | decided (spec #41) |
| SR-10 | The file is not kept. No story stores, shows or opens a document once its reading has ended (added, cancelled, failed or left); pasted text likewise. What stays with each imported change is the document's name and the words it was read from (its quote). | spec #42 (the user, 2026-11-23, Q-45), which replaces spec #19 and amends #31 | decided (spec #42); proposed (Q-45) for keeping the name and the quote |
| SR-11 | Every scenario and UAT script is run in one test environment, provided by the development team: its reading service is a stand-in that serves the recorded reading of each sample in `fixtures.md`, and it has a reset, outside the product, that returns the sample project to its starting state. A script's `Reset:` line means that reset. An assumption, not a question for the user. | Q-88; the user's note of 2026-11-23; `fixtures.md`, "The test environment" | proposed (Q-88), an assumption |

## Not yet written anywhere

Looked for and not found in the sources read.

- **Accessibility standard.** No source read names the level every screen must meet. SR-8 states the proposal (Q-83); a client contract may name another. Story 23 is where it bites first: "Undo" is on a toast only (Q-24), which Q-64 proposes to make reachable by keyboard and announced.
- **Audit.** Nothing asks for an audit trail beyond the change history. No document is kept (SR-10), so nothing is opened or logged.
