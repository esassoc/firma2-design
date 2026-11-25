# Proposed answers

A prototype leaves hundreds of small things undecided. Asking the user each one stalls the work and produces stories nobody can build from. So every question gets a proposed answer, the stories are written on the proposals, and the user validates one short page.

## Proposing

For each open question write, in the open-questions file under the question:

`Proposed: <the answer, stated as the behavior> — <one-line reason> (confidence: high | medium | low)`

Leave `Answer:` empty; it is filled when the user validates.

Choose the proposal in this order:

1. **A written decision wins.** If a spec decision, a decision record or a dated code comment settles it, propose that, and say which.
2. **The product's purpose.** Read the adapter's actors document and product brief; propose what serves the purpose stated there (for example, where totals must be trustworthy: never count twice, never save an invalid value silently, never present a guess as a fact).
3. **Consistency.** Propose what the product already does in the nearest similar place.
4. **Unfinished is not decided.** Where the adapter or the system map says a screen is unfinished, something missing from it is work not yet done: propose the obvious completion and say it is not prototyped. Do not report it as a bug.
5. **The safe default** for anything the prototype does by accident: validate, guard, show a message, do not lose the person's work.
6. **The least new surface.** Between two answers that both work, propose the one that adds no screen, role, permission or setting.

Confidence is `high` when rule 1 applies or the alternatives are plainly worse; `medium` when a reasonable person could choose otherwise; `low` when it is a guess.

Mark a question `Needs you:` instead of proposing only when the answer is a fact about the organization or its clients that cannot be inferred (a retention period, a legal or contractual limit, who provides an environment, whether data may leave the organization). Even then, say what you would assume meanwhile.

## Building on proposals

A proposal is written into the stories as a requirement with the tag `proposed` and its `Q-n`, with a scenario like any other. "Not decided" remains only for `Needs you` questions. A story whose every question has a proposal is `needs-triage` and carries one header line: `Built on proposals awaiting validation: Q-n, Q-n`. A story touching a `Needs you` question stays `needs-info`.

## The validation page

One file, `<out>/proposals.md` (or the adapter's product-wide location), is the only thing the user is asked to read:

1. **Needs you**: the few questions that could not be proposed, with the assumption in use.
2. **Worth a look**: proposals that change which stories exist, move something between releases, reverse a written decision or a prototype behavior the user chose, or have low confidence. Most consequential first.
3. **Routine**: everything else, one line each, grouped by topic.

Each line: `Q-n — <question in a few words> → <proposed answer>`. The user replies with the IDs they disagree with; silence on the rest is acceptance. Then: write `Answer:` on each, retag the requirements `decided (validated <date>)`, change what was rejected, and record with `decision-log` any proposal that amends a written decision.
