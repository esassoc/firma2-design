---
name: decision-log
description: Records a product decision in the feature's spec the moment it is settled, while a prototype is being built or changed. Use when the user decides how a feature behaves, chooses between options, rejects an approach, sets a rule, limit or permission, or reverses an earlier decision, even in passing ("let's not do X", "only managers can", "drop that").
---

# Decision log

A prototype shows what was built, never why, and never what was rejected. Those live in the conversation and are gone when it ends. Writing each decision down as it is made is what lets requirements be produced later without re-interviewing the person who made it.

## What counts

A decision is a choice about what the product does that someone could have made differently: a rule, a limit, who may do something, what is left out, which of two approaches won. Styling choices and implementation details of the prototype are not decisions.

## Recording one

1. Find the feature's spec using the paths in `docs/agents/requirements.md` (Feature specs). If the feature has no spec, create one with a title, a one-paragraph problem statement, and an empty Decisions table.
2. Append a row to the Decisions table with the next number. Numbers are never reused, because requirements cite them.

```markdown
| # | Decision |
|---|----------|
| 34 | Speech input is dropped. Typed or pasted text stays as a source. *(2026-11-23; replaces 21)* |
```

3. State the decision as the behavior, in the glossary's terms, in one or two sentences. Add the reason when it is not obvious from the statement. Add the date.
4. A reversal is a new row that names the row it replaces; mark the old row "replaced by #n" and leave its text. The history of a reversal is itself useful to whoever writes the requirements.
5. Tell the user in one line what you recorded, so a misheard decision is caught at once.

Record only what the user settled. A proposal of yours they have not agreed to is not a decision.
