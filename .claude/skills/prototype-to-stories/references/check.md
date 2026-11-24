# Stage: check

Prove nothing fell through between the prototype and the stories.

## Coverage matrix

Write `<out>/coverage.md`: one row per inventory item (every `OBJ`, `SCR`, `STA`, `ACN`, `RUL`, and every numbered spec decision), with the story and requirement that covers it, or the reason it is not covered (`out of scope: dropped in interview`, `owned by <feature>`, `prototype artifact`, `outside this build`). An item is covered when a story lists it under `Covers` and one of that story's requirements cites it; a `relies on` citation does not count. A spec decision is covered through the inventory items that name it as their source; a decision in range with no inventory item is a finding. Actors are covered by the map's goals. Do not check this by reading. Run `python3 <skill-dir>/scripts/coverage.py <out> <spec> <open-questions file> --template <skill-dir>/assets/coverage.md --write`: it builds the matrix, the counts per story, the build order in waves and the lint list, and holds no feature-specific knowledge (exclusions come from the map's own tables). Without `--write` it only prints the findings, which is the quick check to run after any edit to a story.

The script cannot judge one thing that matters most: whether every scenario's Given and every UAT step can be reached with the story's own behavior plus its blockers'. Check that by reading, story by story, and list what fails under **Added by hand** in coverage.md (the script keeps that section on a re-run). When many stories fail for the same reason, the cause is usually the sample data, not the cut: a sample that mixes several stories' changes cannot test any one of them.

```markdown
| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| RUL-7 | Unsure readings are left empty and flagged | 03 R3 | |
| ACN-12 | Speech input | | dropped (interview 2026-11-23) |
```

## Lint

List every violation under **Findings**:

- an inventory item with neither a covering requirement nor an exclusion;
- a requirement with no scenario, or a scenario that cites no requirement;
- a requirement tagged `inferred` with no open question beside it;
- a story whose `Blocked by` names something that is not a story, enabler or other feature's story;
- a story with more than about 12 scenarios, or more than one actor;
- a story whose own effect cannot be observed without a story that it does not list in `Blocked by`;
- an ID in a story's `Covers` that none of its requirements cites;
- the map, the epics and the story headers disagreeing on a story's epic, release or blockers;
- an enabler that unblocks nothing;
- a scenario whose Given needs behavior from a story outside this story's `Blocked by`;
- a control a story shows without saying what it does when the story ships alone;
- a UAT script that cannot be run from its own Preconditions and Test data;
- a term that is not in the glossary used as if it were;
- a story with open questions whose status is a `ready` value;
- a story that mentions a prototype artifact as a requirement (local storage, mock data).

Fix what is mechanical. Show the user the rest; each is fixed or explicitly accepted, and an accepted finding is recorded in coverage.md with the date.

## Cold read

Pick the two stories you judge weakest. For each, start a fresh subagent with only that story file and its companions (epic, standing requirements, terms, fixtures), told to open nothing else, and ask it to state what it would build, how it would test it, and every question it would need answered first. Sort what comes back three ways. A question the story already flags as open is expected. A question about how to build it (schemas, interfaces, components) is the team's and not a defect. What remains are defects: an unacknowledged question about behavior, an unexplained term, a UAT step that cannot be performed, and prototype detail presented as a requirement. A blunt reader always returns a long list; the story passes when that last group is empty, not when the list is. Ask the reader for its overall verdict too: the target is "could start, and knows exactly what is open". Each defect is in the story or the template; fix the story, and if the same gap would recur, tell the user what to change in the template.

## Done when

The matrix has no unmapped row and the findings list is empty or every entry is accepted by the user.
