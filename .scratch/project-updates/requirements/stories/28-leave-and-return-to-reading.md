# 28 — A Contributor leaves while a report is read and comes back to the finished reading

Type: story
Epic: A — Import a report
Release: later
Status: needs-info
Revision: 1
Blocked by: 01, 03, 35
Covers: RUL-61
Sources: not in the prototype; interview 2026-11-23, Q-23
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n)

Can start: nothing. Waiting: R1 and R2 on Q-80.

**This story is a stub.** The prototype does not show it. It states the two rules that are decided and lists what must be decided before it can be built or signed off.

## Story

As a Contributor, I want to leave the page while a long report is being read and come back when it is done, so that getting a report onto the record does not hold me at one screen for minutes.

## Description

In the first release the person waits on the Import a report page, and leaving it ends the reading (story 01, R7). This later story replaces that rule: a reading carries on without the person and is there when they come back. The interview (Q-23) decided the direction and the three states, and nothing more.

## Requirements

R1. A reading does not end when the person leaves the page. It carries on, and the person can come back to it.

R2. A reading is in one of three states: reading, ready or failed. A person who comes back to it finds it in the state it has reached: still being read, ready with its check step, or failed.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Waiting on the page — story 01.
- Why a reading fails, and the words shown — story 10.
- Keeping the document once an import is added — enabler 03.
- Keeping what an import left out after "Add N changes" — not decided (Q-46).

## Needs to know from elsewhere

- Leaving the page ends a reading and nothing of it is kept — owned by story 01, R7. This story replaces that rule when it ships.
- A document is kept only once its import is added; one that is read and then abandoned is not kept — owned by enabler 03. This story needs the document held from "Read it", so that rule changes with it (Q-80).
- During the wait, "Cancel" ends the reading, as any other way of leaving does — owned by story 35 (R3). Whether "Cancel" still ends a stored reading is among the parts to be added to Q-80.
- The check step, and "Add N changes" — owned by story 01.

## Scenarios

Three scenarios, for the two rules that are settled; where the person "comes back" is Q-80 (a). No fixture shows this: every recorded reading is served at once.

**S1 — The reading carries on** (proves R1)
- Given a Contributor pressed "Read it" for a report on Deer Creek and the page shows "Reading `<file name>`…"
- When they leave the page
- Then the reading is not ended, and it goes on to ready or failed without them

**S2 — Back to a finished reading** (proves R2)
- Given a reading for Deer Creek became ready while the Contributor was away
- When they come back to it
- Then they get its check step, with the changes read from that report

**S3 — Back to a failed reading** (proves R2)
- Given a reading for Deer Creek failed while the Contributor was away
- When they come back to it
- Then they are told it failed, and nothing was added to the record

## Open questions

Q-80 holds everything that must be decided. Each part adds requirements, scenarios and the script:

- Q-80 (a) — where the person finds a waiting or finished reading; it decides the When of S2 and S3.
- Q-80 (b) — whether they are told when it finishes or fails while they are away.
- Q-80 (c) — how many readings can wait, and whether another person who can edit the project can see or use one.
- Q-80 (d) — how long a ready or failed reading and its document are kept, and what discards them.
- Q-80 (e) — whether "Already on file" and a total to date are worked out again on return.
- Q-80 (f) — whether ticks, edits and the note are kept when the person leaves a ready reading.
- Q-80, parts (g) to (k) — what ends a stored reading (adding, "Cancel", "Read another", time) and whether a failed one can be read again; a second reading started while one is reading or ready; what happens when the project, or the person's right to edit it, changes while they are away; the document held from "Read it", which changes enabler 03, R2; what the page says about leaving. Each adds requirements and scenarios.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided, not built | RUL-61 |
| R2 | decided, not built | RUL-61 |

- Prototype files: none for this behavior. The first release's wait is in `src/components/projects/firma2-project-report-import.astro`.
- Data shapes: none. In the prototype a reading exists only while the page is open.
- Do not copy: the fixed 1.6-second scripted reading. The developer-machine reader allows a reading up to four minutes, which is why this story exists.

</details>
