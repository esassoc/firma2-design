# Coverage — {{FEATURE}}

Checked: {{DATE}}
Stories: {{NSTORIES}} · Open questions they cite: {{NQUESTIONS}}

## How this was verified

By `scripts/coverage.py`, which parses the inventory, the story map, the epics and every story. An item counts as covered only when a story lists it under `Covers` and that story's Trace table gives it to a requirement; a `relies on` citation does not count. An item with no covering requirement must be excluded by the map (standing requirements, dependencies on other features, out of scope) or struck in the inventory. A spec decision is covered through the inventory items that name it as their source.

Not checked by script: whether a requirement states its inventory item correctly, glossary use, and whether a scenario's Given truly needs only the story's blockers. Those are for the cold read and the reviewer.

## Result

{{SUMMARY}}

Screens, states, actions and rules together: {{TOTAL}}.

## Screens

{{SCR}}

## States

{{STA}}

## Actions

{{ACN}}

## Rules

{{RUL}}

## Objects

{{OBJ}}

## Actors

{{ACT}}

## Spec decisions

{{DECISIONS}}

## Counts per story

{{COUNTS}}

## Build order

{{WAVES}}

## Findings

{{LINT}}

## Accepted by the user

None yet. Each finding the user accepts is listed here with the date.

## Added by hand

Findings the script cannot see (for example, a scenario that cannot be reached with the story's blockers alone). Kept when the script rewrites this file.
