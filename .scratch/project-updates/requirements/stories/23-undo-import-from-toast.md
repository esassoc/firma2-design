# 23 — A Contributor takes back an import from the toast

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 01, 22
Covers: STA-27, ACN-18, RUL-23, RUL-62, RUL-83, RUL-183, RUL-184, RUL-185, RUL-222
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement`; spec #18; interview 2026-11-23, Q-24
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R7, once story 01 shows the toast and story 22 lists the import in the change history; like story 01, only against the recorded crew log reading in `../fixtures.md` until enabler 02 is built. Waiting: what the person sees when "Undo" itself fails, in R2, on Q-157; how "Undo" is reached by keyboard and assistive technology, in R1, on Q-64 and Q-83; "Undo" after a publish, in R2, on Q-75; an entry changed or removed by hand since the import, in R2 and R3, on Q-137; correcting by hand, in R6, on Q-135; the count of six on Q-82.

## Story

As a Contributor, I want to undo an import right after I add it, so that I can take back an import that should not have been added without correcting each change by hand.

## Description

"Add N changes" saves to the record at once and returns the person to the project page, where a toast says what was added (story 01). This story puts "Undo" on that toast and states how long the toast and its "Undo" last. In this story "Undo" takes back performance measure entries, the one kind of change story 01 adds; story 41 holds the other kinds and the kept document. Split on 2026-11-23: story 41 was part of this story. The change history row (R7, S9) came back from story 41 the same day, so that "the import is no longer recorded" is seen here. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement`, after adding the sample crew log.

## Requirements

R1. The toast that says what an import added carries one action, "Undo". (open: Q-64)

R2. Pressing "Undo" takes that import back at once, with no confirmation: every performance measure entry it added leaves the record, the figures on the Performance measures card follow without a reload, and the import is no longer recorded (R7 is where that is seen), nor anything recorded with it (its note, story 21). Nothing else on the record changes: entries recorded by hand and entries another import added stay. The toast goes as "Undo" is pressed, so "Undo" cannot be pressed twice. Not decided: whether "Undo" is still offered, and what it does, once the import's changes have been published (Q-75); an entry the person changed or removed by hand after the import, and an import that was already taken back in another window (Q-137); what the person sees when "Undo" itself fails (a server error, a lost connection, an edit right lost since the import), what is then left on the record, and whether "Undo" can be tried again once its toast has gone (Q-157; a part-way failure is Q-137).

R3. After "Undo" the project page shows a toast in the first one's place, "`<N>` changes removed", or "1 change removed" for one, where `<N>` is the number of changes the import added. It carries no action: an import taken back is not put back, and the person reads the report again to add it. It stays until the person dismisses it.

R4. The toast that carries "Undo" has no timer. It stays until the person dismisses it, while they use the rest of the project page.

R5. That toast is shown once, to the person who added the import, on the project page they are returned to. Reloading the page, or leaving it and coming back, does not show it again, and nobody else is offered "Undo".

R6. "Undo" is on the toast and nowhere else. Once the toast is gone the import cannot be taken back as a whole; each thing it added is corrected by hand on the project page. Not decided: how a funding source or a contact an import added is corrected by hand, since the project page offers no way to remove either (Q-135).

R7. The import's row leaves the change history.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The toast's wording, and dismissing it — story 01 (R12, R13).
- "Undo" of a Key facts field, a funding source or a contact, and of its kept document — story 41.
- Reverting one imported change in the review, with a reason — `publish-review`, build 2.
- The "`<N>` unpublished changes" badge — `publish-review`.

## Needs to know from elsewhere

- After adding, the project page shows a success toast, "`<N>` changes added from `<document name>`", which the person can dismiss — owned by story 01 (R12, R13).
- Each import is recorded with each change and the entry it saved — owned by story 22 (R1, R2). "Undo" uses that record to know what to take back.
- An import has one row in the change history — owned by story 22 (R3, R4).
- The badge beside the project's stage, "`<N>` unpublished changes", counts an import's changes with the project's other waiting changes, and follows an import and its "Undo" without a reload: after "Undo" it no longer counts that import's changes, and it is not shown when nothing else is waiting — owned by `publish-review`. This story does not test it.
- Each added change is a new entry beside those the record already holds, and the card's figure for a measure whose values add up is the sum of its entries — owned by story 01 (R11) and `performance-measures`.
- Changing or removing an entry on the record by hand — owned by `performance-measures`. It is what R6 leaves the person with for an entry.
- Toasts on the project page — owned by `project-record`.

## Scenarios

All run against the recorded crew log reading in `../fixtures.md`. No fixture gives a second import; S3 describes it by kind.

**S1 — "Undo" removes the entries** (proves R1, R2)
- Given the crew log's six changes were added to Deer Creek, the Performance measures card shows the fixture's "After C1–C6" figures, and the toast "6 changes added from deer-creek-crew-log-2025.xlsx" is showing with "Undo"
- When the Contributor presses "Undo"
- Then no question is asked, and each figure on the card is the fixture's "Before" column

**S2 — The import is no longer recorded** (proves R2)
- Given the crew log's import is Deer Creek's only import and its toast is showing
- When the Contributor presses "Undo"
- Then Deer Creek has no import

**S3 — Only that import** (proves R2)
- Given the crew log's six changes were added to Deer Creek and its toast dismissed, then a second import was added from another spreadsheet, and the second import's toast is showing
- When the Contributor presses "Undo"
- Then each figure on the Performance measures card is the fixture's "After C1–C6" column

**S4 — The toast says what was removed** (proves R3)
- Given the toast "6 changes added from deer-creek-crew-log-2025.xlsx" is showing
- When the Contributor presses "Undo"
- Then the project page shows a toast, "6 changes removed"

**S5 — The toast waits** (proves R4)
- Given the toast with "Undo" is showing
- When five minutes pass without the Contributor touching the page
- Then the toast is still showing, with "Undo"

**S6 — A reload does not repeat it** (proves R5)
- Given the toast with "Undo" is showing and the card shows the "After C1–C6" figures
- When the Contributor reloads the project page
- Then no toast shows, and the card still shows the "After C1–C6" figures

**S7 — Nobody else is offered "Undo"** (proves R5)
- Given a Contributor has just added the crew log's six changes and their toast is showing
- When an Administrator opens the Deer Creek project page in their own session
- Then the Administrator is shown no toast

**S8 — No "Undo" once the toast is gone** (proves R6)
- Given the Contributor dismissed the toast without pressing "Undo"
- When they look through the project page's header actions and its Performance measures card, and open Import a report
- Then none of them offers "Undo" or any other way to take the import back

**S9 — The row leaves the change history** (proves R7)
- Given the change history has the row "6 changes from deer-creek-crew-log-2025.xlsx"
- When the Contributor presses "Undo" and opens the change history
- Then no row names `deer-creek-crew-log-2025.xlsx`

## UAT script

Preconditions: story 01's UAT script has been run to its step 7, so the check step lists the crew log's six changes. Nothing has been imported to Deer Creek, so its figures are the "Before" column.
Test data: `../fixtures.md`: the crew log, and Deer Creek's "Before" and "After C1–C6" figures. The count of six and two of the figures wait on Q-82.
Reset: not known (Q-88). The script ends with six entries on Deer Creek and no "Undo" left to take them off.

| # | Do this | You should see |
|---|---|---|
| 1 | Press "Add 6 changes" | The Deer Creek project page, with the message "6 changes added from deer-creek-crew-log-2025.xlsx" and a button on it, "Undo" |
| 2 | Press History in the header, read the top row, and close the change history | "6 changes from deer-creek-crew-log-2025.xlsx" |
| 3 | Leave the page alone for a minute | The message is still there, with "Undo" |
| 4 | Look at the Performance measures card | The seven figures of the "After C1–C6" column |
| 5 | Press "Undo" | A message, "6 changes removed", with no question asked first |
| 6 | Look at the Performance measures card | The seven figures of the "Before" column |
| 7 | Press History in the header | No row names the crew log |
| 8 | Dismiss the message. Press "Import report", choose `deer-creek-crew-log-2025.xlsx`, press "Read it", wait, and press "Add 6 changes" | The project page, with the message "6 changes added from deer-creek-crew-log-2025.xlsx" and "Undo" |
| 9 | Reload the page | No message; the card shows the "After C1–C6" figures |
| 10 | Look through the header's actions and the Performance measures card for "Undo" | No "Undo" |

On the prototype: press "Sample crew log" in place of choosing the file in step 8; see `../fixtures.md`, On the prototype.

## Open questions

- Q-64 — R1 and steps 1 and 5: if "Undo" must work by keyboard and assistive technology, a button on a toast may not do, and R1 and R6 say where else it lives. The standard itself is Q-83.
- Q-75 — R2: "Undo" after the import's changes were published while the toast was open; no scenario covers it yet.
- Q-82 — S1 to S9 and steps 1 to 9: the count of six and two of the figures.
- Q-88 — the Reset line.
- Q-94 — step 2: whether the import's row is the top row of the change history.
- Q-135 — would change R6: what "corrected by hand" is for a funding source or a contact, which no screen removes.
- Q-137 — would change R2 and R3: what "Undo" does to an entry changed or removed by hand since the import, what its toast then counts, and what it says when the import is already gone; an answer adds scenarios to this story's nine.
- Q-157 — would change R2, R3 and R6: what the person is told when "Undo" fails as a whole, what stays on the record, and whether "Undo" can be tried again; an answer adds a scenario and may put "Undo", or a way to retry it, somewhere other than the first toast.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided | ACN-18 |
| R2 | decided; shown | ACN-18, RUL-83; RUL-183, RUL-185 |
| R3 | shown | STA-27, RUL-183, RUL-185 |
| R4 | shown | RUL-23 |
| R5 | shown | RUL-23; RUL-184 |
| R6 | decided | RUL-62 |
| R7 | decided | RUL-222; relies on story 22, RUL-50 |

- Prototype files: `src/components/projects/firma2-project-imported.astro` (the component's own note on keyboard reach, 30-34; the toast and "Undo", 103-131; shown once, 133-141); `src/lib/report-imports.ts` (taking an import back whole, 164-181); `src/lib/entry-draft.ts` (an entry removed by its identifier, 96-106); `src/components/projects/firma2-project-measures.astro` (a hand correction replaces the entries it covers with one new entry, 1460-1472).
- What the prototype does where nothing is decided (not requirements): "Undo" removes each entry the import saved, as it saved it. A figure corrected by hand on the project page since is a new entry in the old one's place, so "Undo" passes over it, as it does an entry already removed: the corrected figure stays, the imported amount in it, and the toast still counts every change the import added; when the import is already gone the toast closes and says nothing (Q-137).
- What the prototype does when "Undo" fails (nothing is decided, Q-157): it closes the toast and stops listening for "Undo" before the taking back runs, and handles no failure (`firma2-project-imported.astro`, 115-120; `report-imports.ts`, 164-181). A failure would leave the import and its entries in place with no toast, no message and no "Undo". Nothing checks again that the person can still edit the project.
- The change history's rows are drawn from the imports that remain, so the row goes with the import (`src/components/projects/firma2-project-actions.astro`, 251-277).
- Data shapes, as the prototype models them: each imported change records what it wrote, here the entry it saved; "Undo" walks those records for one import and then drops the import.
- Do not copy: `?imported=<id>` on the address to tell the project page which import to announce, which is how a reload comes to show no toast; imports kept in the browser's localStorage. If Q-64 is answered yes, do not copy the toast action as built: the component's own note says it is not reachable by keyboard or announced as a button.

</details>
