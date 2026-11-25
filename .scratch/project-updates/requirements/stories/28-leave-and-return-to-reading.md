# 28 — A Contributor leaves while a report is read and comes back to the finished reading

Type: story
Epic: A — Import a report
Release: later
Status: needs-triage
Built on proposals awaiting validation: Q-80, Q-173
Revision: 1
Blocked by: 01, 35, 06, 07, 10, 12, 21, 32
Covers: RUL-61, RUL-379, RUL-380, RUL-381, RUL-382, RUL-383, RUL-384, RUL-385, RUL-386, RUL-387, RUL-388
Sources: not in the prototype; interview 2026-11-23, Q-23; spec #42
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: nothing in the first release; this story is `later`. When it is taken up: R1 to R12, once stories 01 and 35 are built. Waiting on a feature that is not built: the product's notifications, for R4. Nothing waits on a question.

## Story

As a Contributor, I want to leave the page while a long report is being read and come back when it is done, so that getting a report onto the record does not hold me at one screen for minutes.

## Description

In the first release the person waits on the Import a report page, and leaving it ends the reading (story 01, R7). This later story replaces that rule: a reading carries on without the person, and what it produced is held for a few days so they can come back to it. The interview (Q-23) decided the direction and the three states. What is held is the reading's result, never the file: the user decided that the report is used only to read data from and is not kept (spec #42), so a person who comes back finds the proposed changes and the words each was read from, and not the document beside them. Nothing of this is prototyped. It has no UAT script until it is designed.

## Requirements

R1. A reading does not end when the person leaves the page. It carries on, and the person can come back to it.

R2. A reading is in one of three states: reading, ready or failed. A person who comes back to it finds it in the state it has reached: still being read, ready with its check step, or failed with the reason.

R3. A reading that is waiting or finished is found on the project page, as one line beside the "Import a report" entry on the Performance measures card. The line says which state it is in and opens the Import a report page at that state.

R4. The person who started the reading gets one notification when it becomes ready or fails. Nobody else is notified.

R5. A project has one reading at a time. While one is reading or ready, a second "Read it" for that project is refused, for anyone, with a message saying a reading is already waiting. Another person who can edit the project sees the line of R3, and so knows a reading is waiting, but cannot open it: only the person who started it can.

R6. A ready or failed reading is held for 7 days. It ends, and is discarded, when its changes are added with "Add N changes", on "Cancel", on "Read another", or when the 7 days pass. A failed reading holds only its reason; to read the report again the person chooses the file again.

R7. The file itself is not held. It is sent to be read and is deleted as soon as the reading ends, whether it succeeded or failed; neither the product nor the provider keeps it. What is held for the 7 days is the reading's result: the document's name, the proposed changes with their quotes, the "Not used" and "Skipped" lists, and what the person set (R9).

R8. A person who stays on the page sees the check step as in the first release, with the document beside the changes. A person who comes back to a ready reading sees the changes with their quotes and, where the document would be, one line saying the document is not kept and each change shows the words it was read from. "Show source" is not offered on a narrow screen.

R9. Ticks, edits and the note for the reviewer are kept when the person leaves a ready reading, and are there when they come back.

R10. What depends on the record is worked out again on return: "Already on file", the difference of a total to date, and whether a field is kept by a data source. A change the project can no longer take is marked: a breakdown answer that is no longer an option arrives unanswered with its note, and a reporting period that is no longer offered leaves "Reporting period" empty and the change flagged.

R11. The right to edit the project is checked on return. A person who can no longer edit it gets what story 12, R6 shows anyone who cannot, and the reading is discarded.

R12. During the wait the page says the person may leave and where the reading will be found. A reading nobody is waiting on may run for 15 minutes before it fails; a reading the person waits for keeps the first release's limit (enabler 02, R7).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Waiting on the page — story 01.
- Why a reading fails, and the words shown — story 10.
- The document beside the changes while the person stays on the page — stories 04, 05 and 31.
- More than one reading waiting for one project, or one person's list of readings across projects — not in the product.

## Needs to know from elsewhere

- In the first release leaving the page ends a reading and nothing of it is kept — story 01, R7. This story replaces that rule when it ships.
- The file is not kept after an import is added or abandoned; what stays is the document's name and each change's quote — the standing requirements (spec #42). R7 holds this story to the same rule.
- In the first release a reading is not stored and the "Not used" and "Skipped" lists are discarded after adding — story 01, R7 and story 19, R1. This story is the one place a reading's result is stored, for 7 days.
- During the wait, "Cancel" ends the reading, and "Read another" discards it — story 35 (R3, R4). Both still do.
- What a person sees when they cannot edit the project — story 12, R6.
- "Already on file", a total to date, and the check made again when "Add N changes" is pressed — stories 32 and 13.
- How long a reading may take, and the reasons it fails — enabler 02 (R7) and story 10.

## Scenarios

No sample shows this: every recorded reading is served at once. Every scenario describes its data by kind.

**S1 — The reading carries on** (proves R1)
- Given a Contributor pressed "Read it" for a report on a project and the page shows "Reading `<file name>`…"
- When they leave the page
- Then the reading is not ended, and it goes on to ready or failed without them

**S2 — Back to a finished reading** (proves R2, R3)
- Given a reading for the project became ready while the Contributor was away
- When they open the project page and follow the line beside "Import a report"
- Then they get its check step, with the changes read from that report

**S3 — Back to a failed reading** (proves R2, R6)
- Given a reading for the project failed while the Contributor was away
- When they follow the line beside "Import a report"
- Then they are told it failed and why, nothing was added to the record, and the choose step holds no file

**S4 — Told when it finishes** (proves R4)
- Given a Contributor left the page while a reading ran
- When the reading becomes ready
- Then that Contributor gets one notification, and nobody else gets one

**S5 — One reading per project** (proves R5)
- Given a reading for the project is ready and has not been added
- When the same person, or another who can edit the project, chooses a file and presses "Read it"
- Then nothing is read, and a message says a reading is already waiting for this project

**S6 — Another person cannot open it** (proves R5)
- Given a reading for the project is ready, started by one Contributor
- When another person who can edit the project opens the project page
- Then they see that a reading is waiting, and cannot open its check step

**S7 — The reading ends after 7 days** (proves R6)
- Given a ready reading that nobody has added, cancelled or replaced
- When 7 days have passed since it became ready
- Then the line on the project page is gone and "Read it" is accepted again

**S8 — The file is not held** (proves R7, R8)
- Given a reading became ready while the Contributor was away
- When they come back to its check step
- Then each change shows its quote, no document is shown beside the changes, and one line says the document is not kept

**S9 — What the person set is kept** (proves R9)
- Given a Contributor unticked one change of a ready reading, edited another's amount, wrote a note for the reviewer and left
- When they come back to it
- Then the tick, the amount and the note are as they left them

**S10 — The record changed while they were away** (proves R10)
- Given a ready reading holds a ready entry, and while the Contributor was away the same entry was recorded by hand
- When they come back to it
- Then that change is "Already on file" and unticked

**S11 — The right to edit was lost** (proves R11)
- Given a ready reading, and the Contributor has since lost the right to edit the project
- When they follow a link to it
- Then they see what anyone who cannot edit the project sees, and the reading is discarded

**S12 — The page says they may leave** (proves R12)
- Given a Contributor pressed "Read it"
- When the wait is showing
- Then the page says they may leave and that the reading will be on the project page

## Open questions

None open. The story rests on these proposed answers:

- Q-80 (proposed) — R3 to R6 and R9 to R12, each part: where the reading is found (a); the notification (b); one per project, and who may open it (c, h); the 7 days and what ends a reading (d, g); worked out again on return (e); ticks, edits and the note kept (f); a project or a right that changed meanwhile (i); the page saying the person may leave, and 15 minutes (k).
- Q-80 (j) is not followed as proposed. It would hold the document from "Read it" for as long as the reading waits, up to 7 days. The user's decision that the file is not kept (spec #42) wins: R7 holds the reading's result and never the file. Two things follow that Q-80 did not say: a failed reading cannot be read again without choosing the file again (R6), and a person who comes back has no document beside the changes (R8).
- Q-173 (proposed) — R8: what stands where the document would be when a person comes back.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided, not built | RUL-61 |
| R2 | decided, not built | RUL-61 |
| R3 | proposed (Q-80) | RUL-379 |
| R4 | proposed (Q-80) | RUL-380 |
| R5 | proposed (Q-80) | RUL-381 |
| R6 | proposed (Q-80); decided (spec #42) for choosing the file again | RUL-382 |
| R7 | decided (spec #42); proposed (Q-80) for what the result holds | RUL-383 |
| R8 | proposed (Q-173) | RUL-384 |
| R9 | proposed (Q-80) | RUL-385 |
| R10 | proposed (Q-80) | RUL-386 |
| R11 | proposed (Q-80) | RUL-387 |
| R12 | proposed (Q-80) | RUL-388 |
- Wording provisional: the line of R3, the message of R5, the line of R8 and what the page says in R12 have no fixed words yet.
- Not yet prototyped: all of it.
- The held result contains what the report says about people (a contact's name and email) for up to 7 days. It is seen only by the person who started the reading and is discarded with it.
- Prototype files: none for this behavior. The first release's wait is in `src/components/projects/firma2-project-report-import.astro`.
- Data shapes: none. In the prototype a reading exists only while the page is open.
- Do not copy: the fixed 1.6-second scripted reading. The developer-machine reader allows a reading up to four minutes, which is why this story exists.

</details>
