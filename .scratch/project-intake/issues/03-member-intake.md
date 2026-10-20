# 03 — New project page and member intake steps

Status: resolved
Spec: ../spec.md
Blocked by: 01

New project → add page with screen 1 → Continue creates a draft (Proposal stage, Draft status) with its own link → intake page with steps, progress, any order, review, Submit when every visible required block is answered. Drafts listed under My projects; kept out of the Projects table, map, reports. Works at phone width. New project gated by "Create projects" and the project source.

## Comments

2026-10-19 — Built: `projects/new.astro`, `projects/intake.astro` (`?id=`), `firma2-intake-flow`, `firma2-proposal-list` (My projects). Gaps: approved proposals don't join the static Projects table or map; answers to intake-created custom fields aren't shown on existing project pages (no seeded project has one). Phone width: the page itself reflows, but the app shell's nav doesn't collapse on phones on any page.
