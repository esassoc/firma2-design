# 23 — A Contributor takes back an import from the toast

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-64, Q-94, Q-101, Q-157, Q-177
Revision: 1
Blocked by: 01, 22
Covers: STA-27, ACN-18, RUL-23, RUL-62, RUL-83, RUL-183, RUL-184, RUL-185, RUL-222, RUL-356, RUL-357, RUL-358, RUL-359, RUL-360
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement`; spec #18; interview 2026-11-23, Q-24
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R8, once story 01 shows the toast and story 22 lists the import in the change history, against the recorded samples `deer-creek-crew-log-2025.xlsx` and `deer-creek-treatments-2025.pdf`. Waiting: the keyboard reach and announcement of R1 on the shared toast component gaining an action that is a real button and is announced (a hub request; the toast as prototyped has neither); the change log half of R7 on `performance-measures` showing a source on its change log rows (story 22, R8).

## Story

As a Contributor, I want to undo an import right after I add it, so that I can take back an import that should not have been added without correcting each change by hand.

## Description

"Add N changes" saves to the record at once and returns the person to the project page, where a toast says what was added (story 01). This story puts "Undo" on that toast, makes it reachable by keyboard and announced, and states how long the toast and its "Undo" last. Here "Undo" takes back performance measure entries, the one kind of change story 01 adds, on the plain path: nothing on the record has moved since the import. Story 84 holds what "Undo" does when something has (an entry changed by hand, a publish, a failure, the right to edit lost), and story 41 the other kinds of change. Nothing of the document is undone, because no file was kept (spec #42). See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement`, after adding the sample crew log; the prototype's toast action cannot be reached by keyboard, which is not a requirement.

## Requirements

R1. The toast that says what an import added carries one action, "Undo". The toast is announced to assistive technology when it appears. "Undo" is a real button: it is the next keyboard stop after the project page loads, and Enter or Space presses it.

R2. Pressing "Undo" takes that import back, with no confirmation: every performance measure entry it added leaves the record, the figures on the Performance measures card follow without a reload, and the import is no longer recorded (R7 is where that is seen), nor anything recorded with it (its note, story 21). Nothing else on the record changes: entries recorded by hand and entries another import added stay. While the taking back runs, "Undo" is switched off, so it cannot be pressed twice. The first toast goes only once the taking back has succeeded. What "Undo" does when an entry was changed or removed by hand since the import, when the import was already taken back, when any of its changes was published, when the taking back fails, or when the person can no longer edit the project, is story 84's.

R3. Once the taking back has succeeded, the project page shows a toast in the first one's place, "`<N>` changes removed", or "1 change removed" for one, where `<N>` is the number of changes removed: every change the import added, when nothing has moved since. It is announced when it appears. It carries no action: an import taken back is not put back, and the person reads the report again to add it. It stays until the person dismisses it.

R4. The toast that carries "Undo" has no timer. It stays until the person dismisses it, while they use the rest of the project page.

R5. That toast is shown once, to the person who added the import, on the project page they are returned to. Reloading the page, or leaving it and coming back, does not show it again, and nobody else is offered "Undo".

R6. "Undo" is on the toast and nowhere else. Once the toast is gone the import cannot be taken back as a whole; each thing it added is corrected by hand on the project page: an entry on the Performance measures card (`performance-measures`), a funding source or a contact on its own row (story 81).

R7. The import's row leaves the change history, and the rows of its entries leave the performance measures' change log. Neither log gains a row for the taking back: no pair of "added" and "removed" is left behind.

R8. When "Undo" is pressed by keyboard, keyboard focus is on the toast "`<N>` changes removed" once it replaces the first, on its dismiss control.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The toast's wording, and dismissing it — story 01 (R12, R13).
- "Undo" when the record or the right to edit has moved since the import, and every toast that says so — story 84.
- "Undo" of a Key facts field, a funding source or a contact — story 41.
- Reverting one imported change in the review, with a reason — `publish-review`, build 2.
- The "`<N>` unpublished changes" badge — `publish-review`.

## Needs to know from elsewhere

- After adding, the project page shows a success toast, "`<N>` changes added from `<document name>`", which the person can dismiss — owned by story 01 (R12, R13).
- Each import is recorded with each change and the entry it saved — owned by story 22 (R1, R2). "Undo" uses that record to know what to take back.
- An import has one row in the change history, placed by its time, and each of its entries has a row in the performance measures' change log — owned by story 22 (R3, R6, R8).
- The badge beside the project's stage, "`<N>` unpublished changes", counts an import's changes with the project's other waiting changes, and follows an import and its "Undo" without a reload — owned by `publish-review`. This story does not test it.
- Each added change is a new entry beside those the record already holds, and the card's figure for a measure whose values add up is the sum of its entries — owned by story 01 (R11) and `performance-measures`.
- Toasts on the project page — owned by `project-record`. The toast component is the hub's; an action on it that is a button, a keyboard stop and announced is a hub request.

## Scenarios

All start from Deer Creek's starting state in `../fixtures.md`, with the crew log added. The second import in S2 is the treatments sample.

**S1 — "Undo" removes the entries** (proves R1, R2)
- Given the crew log's six changes were added to Deer Creek, the Performance measures card shows the fixture's "After C1–C6" figures, and the toast "6 changes added from deer-creek-crew-log-2025.xlsx" is showing with "Undo"
- When the Contributor presses "Undo"
- Then no question is asked, and each figure on the card is the fixture's "Before" column

**S2 — Only that import** (proves R2)
- Given the crew log's six changes were added to Deer Creek and its toast dismissed, then the treatments sample's two changes were added, and the toast "2 changes added from deer-creek-treatments-2025.pdf" is showing
- When the Contributor presses "Undo"
- Then each figure on the Performance measures card is the fixture's "After C1–C6" column

**S3 — The toast says what was removed** (proves R3)
- Given the toast "6 changes added from deer-creek-crew-log-2025.xlsx" is showing
- When the Contributor presses "Undo" and the taking back succeeds
- Then the project page shows a toast in its place, "6 changes removed", with no action

**S4 — "Undo" cannot be pressed twice** (proves R2)
- Given the toast with "Undo" is showing
- When the Contributor presses "Undo" twice in quick succession
- Then the import is taken back once, and one toast reads "6 changes removed"

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
- Then no row names `deer-creek-crew-log-2025.xlsx`, and no row says an import was removed

**S10 — The rows leave the performance measures' change log** (proves R7)
- Given the change log for Native trees and shrubs planted has the row of 1,850 plants "From deer-creek-crew-log-2025.xlsx"
- When the Contributor presses "Undo" and opens that change log
- Then it has no row from the crew log, neither an added one nor a removed one

**S11 — The toast is announced** (proves R1)
- Given a Contributor using a screen reader presses "Add 6 changes"
- When the project page opens
- Then the toast's message, "6 changes added from deer-creek-crew-log-2025.xlsx", is read out without the person moving to it

**S12 — "Undo" by keyboard** (proves R1, R8)
- Given the project page has just opened with the toast, and the Contributor has touched nothing
- When they press Tab once, then Enter
- Then the first Tab puts keyboard focus on "Undo", Enter takes the import back, and focus is on the dismiss control of the toast "6 changes removed"

## UAT script

Preconditions: the test environment serves the recorded samples `deer-creek-crew-log-2025.xlsx` and `deer-creek-treatments-2025.pdf`. Deer Creek is in its starting state, so its figures are the "Before" column. Signed in as someone who can edit Deer Creek. Step 9 can be run only once `performance-measures` shows a source on its change log rows.
Test data: `../fixtures.md`: the crew log, and Deer Creek's "Before" and "After C1–C6" figures; the treatments sample, and the line under the samples' table that gives the figures once it is added after the crew log. The treatments sample is to be made.
Reset: reset the sample project in the test environment. The script ends with eight imported entries on Deer Creek and no "Undo" left.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page, press "Import a report" on the Performance measures card, choose `deer-creek-crew-log-2025.xlsx`, press "Read it" and wait | The check step, with the button "Add 6 changes" |
| 2 | Press "Add 6 changes" | The Deer Creek project page, with the message "6 changes added from deer-creek-crew-log-2025.xlsx" and a button on it, "Undo" |
| 3 | Without using the mouse, press Tab once | Keyboard focus is on "Undo" |
| 4 | Press History in the header, read the top row, and close the change history | "6 changes from deer-creek-crew-log-2025.xlsx" |
| 5 | Leave the page alone for a minute, then look at the Performance measures card | The message is still there, with "Undo"; the card shows the seven figures of the "After C1–C6" column |
| 6 | Press "Undo" | A message in the first one's place, "6 changes removed", with no question asked first and no button to put the import back |
| 7 | Look at the Performance measures card | The seven figures of the "Before" column |
| 8 | Press History in the header | No row names the crew log |
| 9 | Open the performance measures' change log for Native trees and shrubs planted | No row from the crew log |
| 10 | Dismiss the message. Import `deer-creek-crew-log-2025.xlsx` again as in steps 1 and 2, and dismiss its message | The card shows the "After C1–C6" figures |
| 11 | Import `deer-creek-treatments-2025.pdf` the same way, pressing "Add 2 changes" | The message "2 changes added from deer-creek-treatments-2025.pdf" with "Undo"; Acres of invasive vegetation removed 20.5; Native trees and shrubs planted 14,427 |
| 12 | Press "Undo" | "2 changes removed"; the card shows the "After C1–C6" figures again |
| 13 | Dismiss the message, import `deer-creek-treatments-2025.pdf` once more, and reload the project page | No message; Acres of invasive vegetation removed 20.5 |
| 14 | Look through the header's actions and the Performance measures card for "Undo" | No "Undo" |

On the prototype: only the crew log can be added (press "Sample crew log"), and "Undo" cannot be reached by keyboard; see `../fixtures.md`, On the prototype.

## Open questions

None open. This story rests on these proposed answers:

- Q-64 (proposed) — R1, S11, S12 and step 3: "Undo" stays on the toast only (decided, interview Q-24), and the toast is announced and its button a keyboard stop.
- Q-94 (proposed) — step 4: the import's row is the top row because rows sit by their time.
- Q-101 (proposed) — R7, S10 and step 9: the entries' rows leave the performance measures' change log.
- Q-157 (proposed) — R2, R3, S3 and S4: "Undo" is switched off while it runs, and the first toast goes only on success.
- Q-177 (proposed) — R8 and S12: where keyboard focus is once the toast with "Undo" has been replaced.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; proposed (Q-64), not yet prototyped | ACN-18; RUL-356 |
| R2 | decided; shown; proposed (Q-157) | ACN-18, RUL-83; RUL-183, RUL-185; RUL-357 |
| R3 | shown; proposed (Q-157); proposed (Q-64) | STA-27, RUL-183, RUL-185; RUL-357; RUL-356 |
| R4 | shown | RUL-23 |
| R5 | shown | RUL-23; RUL-184 |
| R6 | decided; decided (interview 2026-11-23, Q-135) | RUL-62; RUL-358 |
| R7 | decided; proposed (Q-101) | RUL-222; RUL-359; relies on story 22, RUL-50 |
| R8 | proposed (Q-177), not yet prototyped | RUL-360 |
- Prototype files: `src/components/projects/firma2-project-imported.astro` (the component's own note on keyboard reach, 30-34; the toast and "Undo", 103-131; shown once, 133-141); `src/lib/report-imports.ts` (taking an import back whole, 164-181); `src/lib/entry-draft.ts` (an entry removed by its identifier, 96-106).
- Where the prototype differs from the requirements: it closes the toast and stops listening for "Undo" before the taking back runs (R2 keeps the toast until success); the toast action is not reachable by keyboard or announced as a button, by the component's own note (R1); the performance measures' change log is not touched (R7).
- The change history's rows are drawn from the imports that remain, so the row goes with the import (`src/components/projects/firma2-project-actions.astro`, 251-277).
- Data shapes, as the prototype models them: each imported change records what it wrote, here the entry it saved; "Undo" walks those records for one import and then drops the import.
- Do not copy: `?imported=<id>` on the address to tell the project page which import to announce, which is how a reload comes to show no toast; imports kept in the browser's localStorage; the toast action as built.

</details>
