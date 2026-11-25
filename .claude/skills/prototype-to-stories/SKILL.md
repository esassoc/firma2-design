---
name: prototype-to-stories
description: Turns a working prototype into requirements — an inventory, a story map, epics and user stories with requirements, Given/When/Then scenarios and UAT scripts — and keeps them in step with the prototype afterwards. Use when the user wants user stories, epics, requirements, acceptance criteria, a feature breakdown or a dev handoff from a prototype or feature; says a prototype is "done" or "ready for requirements"; asks whether stories are out of date; or names a stage (map, harvest, interview, slice, write, check, baseline, status, sync, reopen).
---

# Prototype to stories

A prototype holds a feature's requirements implicitly: in routes, components, mock data and scattered decisions. This skill makes them explicit as stories a developer or coding agent can build from and a tester can sign off, without reading the prototype's code.

The prototype is the **primary source**. Written specs and decisions come second. Chat transcripts are a backup, searched only to answer one specific "why".

## Invocation

`/prototype-to-stories <feature> [stage]`, or `/prototype-to-stories map|status` for the whole product.

With no stage, read the feature's `manifest.json` and continue from the first stage whose output file is missing. Each stage writes a file, so a fresh session can resume anywhere.

## Before any stage: the adapter

Read `docs/agents/requirements.md`. It holds every path and convention that differs between repos; this skill names none of them. If it is missing, read [references/adapter.md](references/adapter.md) and create it first.

Everywhere below, `<out>` means the feature's requirements directory as the adapter defines it.

## Stages

Run one stage per invocation unless the user asks to continue. Read the stage's reference file when you start it, not before.

| Stage | Output | Reference | Done when |
|---|---|---|---|
| `map` | system map | [references/map.md](references/map.md) | every prototype route belongs to a feature; every shared rule has one owner or is listed as unowned |
| `harvest` | `<out>/inventory.md`, `<out>/manifest.json` | [references/harvest.md](references/harvest.md) | every file in the feature's scope has been read and every screen, state, action and rule in it is an inventory item with a source |
| `interview` | answers in `inventory.md` | [references/interview.md](references/interview.md) | every question is written down; every question that shapes the cut is answered; the rest are answered or parked |
| `slice` | `<out>/story-map.md` | [references/slice.md](references/slice.md) | every in-scope inventory item sits under exactly one story, and the user has approved the map |
| `write` | `<out>/terms.md`, `<out>/fixtures.md`, `<out>/epics/`, `<out>/stories/` | [references/write.md](references/write.md) | every story in the map has a file, and has been through the builder's checklist |
| `check` | `<out>/coverage.md` | [references/check.md](references/check.md) | the matrix has no unmapped row and the lint list is empty or each entry is accepted by the user |
| `baseline`, `status`, `sync`, `reopen` | manifest, snapshots, changelog | [references/drift.md](references/drift.md) | see the reference |

Two stops are fixed because the user's judgement is the input: the end of `interview`, and the story-map approval at the end of `slice`. Write no story before that approval; a wrong cut is cheap to fix in a one-line-per-story outline and expensive in thirty files.

## Rules that hold in every stage

- **Provenance.** Every inventory item and every requirement carries one tag: `shown` (the prototype does it), `decided` (a spec or decision record says it), `inferred` (your reading). A reader must be able to tell a fact from a guess.
- **Sources.** Every item points at where it came from: `path:line`, a spec decision number, or a decision record.
- **Conflicts are surfaced.** When the prototype and a written decision disagree, list the conflict and ask. Picking a side silently hides the one thing the user most needs to see.
- **Prototype artifacts are named, then excluded.** Browser-local storage, scripted responses, mock data and demo switchers are how the prototype fakes a system. List them in the inventory so nobody mistakes them for requirements.
- **Stable IDs.** Inventory IDs and story numbers are never reused or renumbered. Sync, the changelog and any exported tracker tickets all hang on them.
- **Vocabulary.** Use the glossary's terms exactly. A term the glossary lacks is a question for the interview.
- **Propose, do not ask.** The user validates; they do not fill in a questionnaire. Every question the work raises gets a proposed answer with a one-line reason and a confidence, and the work proceeds on the proposal. See [references/proposals.md](references/proposals.md). A question stays open only when its answer is a fact nobody can infer.
- **Unanswered questions are parked, in one place.** Any question the user cannot answer now, in any stage, goes in the adapter's open-questions file with a permanent `Q-n` ID, enough context to answer it cold, what it blocks, and an empty `Answer:` line. Other files cite the ID and never restate the question. When the user answers one, write the answer and date, apply it wherever the ID is cited, and move it to Answered. At the start of every stage, read the file and tell the user which open questions block that stage (in the stage's output file when no user is present).
- **Sensitive material** goes to the adapter's private directory and is referred to by file name only.
