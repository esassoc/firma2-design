---
name: feature-kickoff
description: Sets a new feature or prototype up so that user stories can be written from it later with little rework. Use when the user starts a new feature, prototype, screen or flow, says "new prototype" or "let's build", or begins changing an existing prototype that has no spec yet.
---

# Feature kickoff

Stories are written from a prototype after it is finished. What makes that expensive is everything the prototype never recorded: why a rule exists, what was rejected, what happens off the clean path, and sample data that shows only the happy case. A few habits from the first day remove most of that cost. Paths and conventions are in `docs/agents/requirements.md`.

## At the start

1. **Name the feature and register it.** Pick a slug. Add a row to the system map (`exploring`), with its goal, actors and routes as far as they are known, and anything it will share with another feature. If the map shows another feature already owns part of the idea, say so before building.
2. **Start the spec.** Create the feature's spec with a title, a short problem statement, who it is for (in the adapter's actor vocabulary), and an empty numbered Decisions table. Answer the product brief's opening questions there if the repo has a brief.
3. **Start the manifest.** Create `<out>/manifest.json` with `state: exploring`, `revision: 0`, `baseline: null` and a `scope` that lists the files as they are created. Nothing is checked while a feature is exploring.

## While building

These are the things later stages could not recover from a finished prototype.

- **Log each decision as it is made**, with the `decision-log` skill: a rule, a limit, who may do something, what was rejected, a reversal.
- **Seed a sample for every state.** Each state the screen can be in (empty, flagged, already there, locked, failed) gets sample data that shows it. A state with no sample cannot be tested later, and a sample document or record should have a stable name.
- **Decide what happens off the clean path, or write down that it is open.** For each thing a person can save: what if it already exists; all or nothing; saved as what. For each value typed: what is accepted. For each state: what happens when two apply at once. If the answer is "the prototype just does X by accident", put a question in the adapter's open-questions file rather than leaving the accident to be read as a rule.
- **Say what is faked.** A comment where the prototype stands in for a real capability (local storage, a scripted response, a hard-coded user) saves the harvest from guessing.
- **Use the glossary's words**, and add a term to it when the feature needs a new one.
- **Keep the manifest's scope current** when files are added or renamed.
- **Keep the data model current.** Every new thing the feature stores (an entity, a field, a setting, a status) gets its row or attribute in `docs/data-model.md` when it is built, marked with its status; anything removed comes out. If its shape is your proposal and not a decision, say so in the row.

## When the prototype is done

The user says so. Then `/prototype-to-stories <feature>` runs harvest, interview, slice, write and check, and `baseline` marks the point later changes are measured from.
