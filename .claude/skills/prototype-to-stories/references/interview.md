# Stage: interview

A prototype shows the front of a feature with invented data. This stage collects what it cannot show, and turns every `inferred` item into a fact or removes it.

## What to ask

Ask only what the inventory does not already answer. Work through this checklist against the inventory and skip any line the prototype or spec settles.

1. **Conflicts.** Each one: which side is right?
2. **Inferred items.** Each one: confirm, correct or strike. Batch similar ones.
3. **Shown but uncommitted.** Each one: first release, later, or dropped?
4. **Who may do it.** For each action, which roles; what the others see instead (hidden, disabled, explained).
5. **Failure.** For each action that saves, sends, reads a file or calls another system: what can fail and what the user sees.
6. **Empty and first use.** What the screen shows before any data exists.
7. **What persists.** Behind each prototype artifact: what is really stored, for how long, who can see it, whether it is audited.
8. **Limits.** Sizes, counts, lengths, file types, rates; what happens at the limit.
9. **Notifications.** Who is told about what, by which channel, when.
10. **Concurrency.** Two people on the same record.
11. **Existing data.** Migration from a previous system; records created before the feature existed.
12. **Out of scope.** What a reasonable developer might assume is included and is not.
13. **Sensitivity.** Whether any answer is client-sensitive and must go in the private companion file.

## How to ask

- **Write every question down first.** Before asking anything, add all of them to the open-questions file under the feature's slug, each marked `[cut]` or `[detail]` and with your suggested answer where the inventory supports one. The interview then works through a list the user can also answer on their own time, and nothing is lost if the session ends.
  - `[cut]` changes which stories exist: what is in the feature, who may use it, what is in the first release, anything that turns into a stored thing or an enabler.
  - `[detail]` only fills in a story: limits, failure messages, retention, wording.
- **Ask the `[cut]` questions live**, and do not start `slice` until each has an answer. If the user cannot decide one, the affected items get `Release: undecided` and are still sliced.
- **`[detail]` questions may stay open.** Offer them after the cut questions; whatever is left open does not stop `slice` or `write`. A story that touches one is written with what is known and marked `needs-info`.
- Ask in batches of related questions, most consequential first. Give each question enough context to answer without opening the prototype, and offer a recommended answer when the inventory suggests one.
- "I don't know" is a valid answer. Park it in the open-questions file under the feature's slug, with whoever can answer it if the user names someone, and list its `Q-n` ID under the inventory's **Open questions**.
- Stop when the checklist is exhausted, not when the user seems tired; unasked questions become invented requirements later. If the user wants to stop early, record every unasked question as open.

## Recording

In the open-questions file: write the answer and date on the question and move it to Answered. An answer to one question may settle another; if so, answer that one too and say which answer settled it. A new question that surfaces while recording is filed there at once with the next ID.

In `inventory.md`:

- **Interview** table: one row per answered question, short form, with the Q-ID.
- **Tags.** A confirmed `inferred` item becomes `decided (interview <date>, Q-n)`. An item already `decided` that the answer re-confirms keeps its source and gains the Q-ID. An answer that requires something the prototype does not do yet is `decided, not built`.
- **Struck items** keep their ID and read "struck (Q-n)". When an answer drops only part of an item, rewrite the statement and note "narrowed by Q-n".
- **New rules** an answer creates get new `RUL-n` IDs with the interview as source.
- **Open items.** An item whose question is still open keeps its tag and gains `open: Q-n`. List each open Q-ID with its items under **Open questions**.
- **Conflicts.** Fill Resolution with the winning side and the Q-ID, or "open: Q-n".
- **Release** is set on the Shown-but-uncommitted rows: one of the adapter's release values, or `dropped`. A new rule that belongs to a later release says so in its statement. Every uncommitted row must have had a question; if one was never asked, file it now.
- **Sensitive answers** go in the private companion file; the inventory says "see private: <file>".

Outside the inventory: when an answer contradicts a written source (a spec decision, a roles document), that source is now wrong. Tell the user which lines, and record the correction with the `decision-log` skill once they agree; do not leave two documents disagreeing silently.

## Done when

Every checklist question is written in the open-questions file; every `[cut]` question is answered or its items marked `Release: undecided`; every `[detail]` question is answered or still open there with its ID listed under the inventory's **Open questions**. An `inferred` item stays tagged until its question is answered.
