# NN — <Actor> <outcome>

Type: story
Epic: <E# title, or "none">
Release: <first | later | undecided>
Status: <status string>
Revision: 1
Blocked by: <story numbers, or "none">
Covers: <inventory IDs>
Sources: <prototype route, or "not in the prototype">; <spec decision numbers, or "none">
Snapshot: not yet captured
Read with: `../epics/<epic file>` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · <open-questions file> (Q-n) · <spec> (spec #n)

Can start: <requirement numbers>. Waiting: <requirement numbers> on <Q-n or feature>.

## Story

As a <actor>, I want <capability>, so that <reason>.

## Description

<Two to five sentences: where this sits in the workflow, what comes before and after.>

## Requirements

R1. <One observable behavior or rule.>

R2. …

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- <What a reader might assume is included> — see story NN.

## Needs to know from elsewhere

- <rule, in one line> — owned by <story NN or feature>

## Scenarios

**S1 — <name>** (proves R1)
- Given <starting condition with concrete data>
- When <one action>
- Then <observable result>

## UAT script

Preconditions: <who is signed in, what exists>
Test data: <fixture name in `../fixtures.md`, and the rows used>
Reset: <how to get back to the starting state>

| # | Do this | You should see |
|---|---|---|
| 1 | | |

## Open questions

- Q-n — <which requirement or step it would change, and how>

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | <shown, decided, decided not built> | |

- Prototype files: <paths>
- Data shapes: <as the prototype models them>
- Do not copy: <prototype artifacts that fake a real capability>

</details>
