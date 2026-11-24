# 05 — A Contributor on a narrow screen opens a change's source and comes back to the same change

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 04
Covers: STA-9, ACN-10, RUL-108, RUL-109, RUL-110
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #12; interview 2026-11-23, Q-20
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, ACN) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R7, on story 04's check step (its document pane and its selection are used here, not built here); like story 01, only against the recorded crew log reading in `../fixtures.md` until enabler 02 is built. Waiting: the layout at exactly 64rem, in R1, on Q-119; where keyboard focus goes in R3 and R5 on Q-68; the page's action while the document is showing, and the second half of R7, on Q-112; the count of six on Q-82.

## Story

As a Contributor on a phone or in a narrow window, I want to open the document at the place a change was read from and return to that same change, so that I can check what the report says without losing my place in the list.

## Description

Story 04 puts the document pane beside the changes, which needs a screen wider than 64rem. At that width and below there is no room for both, so the check step shows the changes alone and the document only when asked for. This story holds the one behavior of the check step that is specific to a narrow screen; everything else about it is as the other stories say, under the standing phone and tablet requirement (SR-2). See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, with the sample crew log, in a window 64rem wide or narrower.

## Requirements

R1. On a screen 64rem wide or narrower, the check step shows the changes in one column. The document pane is not shown until the person asks for it. (open: Q-119)

R2. On such a screen every change has an action, "Show source", whatever the change's state. On a wider screen no change has it.

R3. Pressing "Show source" selects that change (story 04, R6) and puts the document pane in the place of everything else on the check step: the tally, the changes and whatever follows them. The page is shown from its top, and the pane is at the place that change was read from. Not decided: whether keyboard focus moves to the document (Q-68).

R4. While the document pane is showing, its first action is "Back", beside the document's name. The pane fills the height of the window and scrolls within itself.

R5. "Back" puts the changes back, with the change the person came from in view and still selected. Not decided: whether keyboard focus returns to that change's "Show source" (Q-68).

R6. Opening and closing the document pane changes nothing else on the check step: everything the person set there is as they left it.

R7. When the window is made wider than 64rem while the document pane is showing, the changes and the pane show side by side, as story 04 has them. Not decided: whether the pane is showing again when the window is narrowed once more (Q-112).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The check step on a screen wider than 64rem — story 04.
- What the document pane shows, and what "the place a change was read from" is: for a file that cannot be shown — story 04 (R9, R10); for a PDF and a document held as passages — story 31.
- The same document opened on a narrow screen from the review — story 80.
- The header action inside "…" on a phone — story 08.
- "Add N changes" pressed while the document pane is showing — not decided (Q-112); story 30 holds the check.

## Needs to know from elsewhere

- The check step lists the changes, each with its quote, and "Add N changes" stays in view at every width, also while the document pane is showing — owned by story 01.
- On a screen wider than 64rem the document pane is beside the changes; one change is always selected, and selecting a change moves the pane — owned by story 04.
- What the person can set on the check step, which R6 keeps: ticks (story 06), edits to a change (story 07) and the note for the reviewer (story 21).
- "Read another" and "Cancel" stay in reach while the document pane is showing, and do what they do from the list — owned by story 35.
- Every other phone, tablet and touch rule (SR-2) — owned by the mobile foundation spec. Its tablet layout runs up to and including 64rem.

## Scenarios

All run against the recorded crew log reading in `../fixtures.md`. "Narrow" is a screen 64rem wide or narrower.

**S1 — One column, no document** (proves R1)
- Given the crew log has been sent to be read on a narrow screen
- When the check step opens
- Then the six changes show in one column and the document pane is not on the screen

**S2 — Every change offers "Show source"** (proves R2)
- Given the check step lists the crew log's six changes on a narrow screen
- When the Contributor looks at each change
- Then each of the six has "Show source"

**S3 — At exactly 64rem the changes are alone** (proves R1)
- Given the crew log has been sent to be read on a screen exactly 64rem wide
- When the check step opens
- Then the changes show in one column, each with "Show source", and the document pane is not on the screen

**S4 — "Show source" puts the document in the changes' place** (proves R3, R4)
- Given the check step on a narrow screen, scrolled down to C5
- When the Contributor presses "Show source" on C5
- Then the document pane takes the place of the tally and the changes, shown from the top of the page, with "Back" as its first action

**S5 — "Show source" selects the change** (proves R3)
- Given the check step on a narrow screen with C1 selected
- When the Contributor presses "Show source" on C5 and then "Back"
- Then C5 is marked as selected and C1 is not

**S6 — "Back" returns to the same change** (proves R5)
- Given the document pane is showing after "Show source" on C5
- When the Contributor presses "Back"
- Then the changes are back, with C5 in view

**S7 — Nothing else changed** (proves R6)
- Given the check step lists the crew log's six changes with "Add 6 changes", and the Contributor has pressed "Show source" on C5
- When they press "Back"
- Then the same six changes are listed, in the same order, and the action still reads "Add 6 changes"

**S8 — Widening shows both** (proves R7)
- Given the document pane is showing on a narrow screen after "Show source" on C5
- When the window is made wider than 64rem
- Then the changes and the document pane show side by side, and no change has "Show source"

## UAT script

What the document pane shows for the crew log is story 04 (R10), and for a PDF or a document held as passages story 31; this script checks only that it opens and closes in the right place.

Preconditions: story 01's UAT script has been run to its step 5 on a phone, or in a desktop browser window narrowed to about phone width, so the check step lists the crew log's changes. Story 04 is built.
Test data: `../fixtures.md`: the crew log, rows C1 to C6. The count of six waits on Q-82.
Reset: none needed if you stop here; the script adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Look at the page | The changes in one column, each with "Show source"; no document pane; the action "Add 6 changes" |
| 2 | Scroll to "Volunteer hours contributed · 2025" and press "Show source" | The document pane in place of the tally and the changes, from the top of the page, with "Back" first; "Add 6 changes" still in view |
| 3 | Press "Back" | The list of changes, with "Volunteer hours contributed · 2025" in view and marked as selected |
| 4 | Scroll through the list | The same six changes, and "Add 6 changes" |
| 5 | Press "Show source" on any change, then widen the window well past tablet width | The document pane beside the changes; no "Show source" on any change |

On the prototype: press "Sample crew log"; see `../fixtures.md`, On the prototype.

## Open questions

- Q-68 — R3 and R5: where keyboard focus goes on "Show source" and on "Back"; an answer adds a scenario for each.
- Q-82 — S1, S2, S7 and steps 1, 2 and 4: the count of six.
- Q-88 — Preconditions: how the recorded reading is served.
- Q-119 — would change R1 and S3: which layout a screen exactly 64rem wide gets; the review's document pane puts that width on the wide side.
- Q-112 — would change R4 and R7 and add a requirement: what "Add N changes" does while the document pane is showing, above all when story 30's check stops it; and whether the pane is still showing after the window is widened and narrowed again.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided | STA-9 |
| R2 | decided; shown | STA-9, ACN-10; RUL-108 |
| R3 | decided; shown | ACN-10; RUL-108 |
| R4 | decided; shown | STA-9; RUL-108 |
| R5 | decided; shown | ACN-10; RUL-109 |
| R6 | shown | ACN-10 |
| R7 | shown | RUL-110 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the narrow layout at 277-307; "Show source" at 185, 709-718 and 834; "Back" at 719-722); `src/components/shared/firma2-report-source.astro` (the document pane and its "Back").
- Data shapes: none of its own. It uses the selected change and what that change points at in the document, as story 04.
- The boundary: the prototype's one-column layout applies at `max-width: 64rem`, so exactly 64rem is narrow, as in the mobile foundation spec. The inventory's STA-8 and STA-9 say "64rem and up" and "under 64rem".
- What the prototype does where nothing is decided (not requirements): neither "Show source" nor "Back" moves keyboard focus (Q-68), while the review's own document pane does (story 80); "Back" puts the selected change in the middle of the window; "Add N changes" can be pressed while the document is showing, and when the check stops it the messages are on fields the person cannot see and nothing on the screen changes; the pane stays "open" after the window is widened, so narrowing it again shows the document, not the changes (Q-112).
- Do not copy: nothing specific to this story. The document shown is the prototype's in-browser preview (story 31).

</details>
