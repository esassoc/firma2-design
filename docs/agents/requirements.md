# Requirements adapter

Read by the `prototype-to-stories`, `decision-log` and `story-export` skills. It holds every path and convention that is specific to this repo.

## Prototype
- Routes: `src/pages/prototypes/`
- Components: `src/components/` (feature folders such as `projects/`, `review/`; `shared/` is shared)
- Data and logic: `src/data/`, `src/lib/`
- Registry of prototypes: `src/data/prototypes.ts`
- Routes that are not the product: `/` (the spoke's index), `/design-system/**`, `/patterns`
- Experiments (never baselined): `src/pages/proto/`, `src/components/proto/`, `src/proto/`, `src/pages/prototypes/archive/`
- How to run it: `npm run dev` serves at `/` (port varies). `npm run build && npx astro preview` serves under `/firma2-design/`.
- Usual prototype artifacts: browser-local stores in `src/lib/*-store.ts` and `localStorage`; invented seed data in `src/data/`; scripted readings and assistants (no model is called); a hard-coded current user and role switchers; `?flow=` guided walkthroughs.

## Unfinished screens
- The prototype is not complete everywhere. The project detail page (`project-record`) is one screen the user has named as unfinished (2026-11-23); features marked `exploring` in the system map may be too.
- Something missing from an unfinished screen is unfinished work, not a decision and not a bug. Propose the obvious completion, tag it `proposed`, and say it is not yet prototyped.

## Context documents
- Glossary: `GLOSSARY.md`
- Decision records: `docs/adr/`
- Navigation model: `src/data/firma2-nav.ts`
- Actors: `docs/product-brief.md` §1 (the four readers; marked inferred there)
- Roles and permissions: `docs/roles-and-permissions.md`
- Actor vocabulary for stories: the workspace roles (Administrator, Contributor, Viewer, plus the per-organization Manager flag) and "visitor" for someone with no account. A story's "so that" may draw on the brief's readers, but the actor is a role, because a role is what a tester can sign in as. "Maintainer" in the project-updates spec means anyone who can edit that project.
- Feature specs: `.scratch/<feature>/spec.md` (numbered Decisions tables). One spec can span several features; the system map gives each feature its decision range. `.scratch/public-views/inventory.md` is that feature's spec under an older name, not a harvest inventory.
- Other domain docs: `docs/measure-model.md`, `docs/field-patterns.md`
- Session transcripts (backup only): `~/.claude/projects/-Users-mauricio-Documents-GitHub-firma2-design/*.jsonl`

## Output
- Per feature (`<out>`): `.scratch/<feature>/requirements/` (kept apart from `.scratch/<feature>/issues/`, which holds prototype-build tickets)
- Private companion: `docs/private/requirements/<feature>/` (gitignored: not committed, shared or backed up by git)
- System map: `.scratch/system-map.md`
- Open questions: `.scratch/open-questions.md`
- Public repo: yes. Nothing client-sensitive in `<out>`; see Confidentiality in `CLAUDE.md`.

## Conventions
- Status strings: `needs-triage` (drafted), `needs-info` (has open questions), `ready-for-human`, `ready-for-agent`, `in-progress`, `done`, `withdrawn`. The first four are defined in `docs/agents/triage-labels.md`. `in-progress` and `done` mean sync must not edit the story.
- Release values: `first`, `later`, `undecided`
- Snapshots: on. No browser tooling is installed in the repo: install `playwright-core` in a scratch directory outside the repo and launch the system Chrome by `executablePath`. Check which server is running before capturing (dev at `/`, preview under `/firma2-design/`).
- Tracker: undecided
