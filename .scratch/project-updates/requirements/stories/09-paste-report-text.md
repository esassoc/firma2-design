# 09 — A Contributor pastes the report's text instead of choosing a file

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-47, Q-83, Q-105, Q-108
Revision: 1
Blocked by: 01
Covers: STA-2, STA-4, ACN-4, RUL-30, RUL-82, RUL-101, RUL-102, RUL-103, RUL-279, RUL-280, RUL-281, RUL-282
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #21, #42
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R3, R5 and R6. Against the recorded reading of the pasted paragraph in `../fixtures.md`, which stands in for enabler 02 (not built): R4. Against a stand-in that answers with a failure: the failed reading in R4. Nothing waits on a question.

## Story

As a Contributor, I want to paste a report's text when I have no file to choose, so that what the report says gets onto the project's record without retyping it.

## Description

This is the second way to give Import a report its document, on the choose step that story 01 builds. The person switches from "File" to "Paste text", pastes, and presses "Read it"; the wait and the check step are then the same as for a file. This story ends on the check step. Pasted text is not kept any more than a file is (spec #42); story 40 holds the one thing adding leaves behind, the name "pasted text" where a file's name would be. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, under "Paste text".

## Requirements

R1. The choose step offers a choice of two, "File" and "Paste text", named "Report source" for assistive technology, and opens on "File" every time the page is opened. Choosing "Paste text" puts a text area labelled "Your report" in place of the file control; choosing "File" brings the file control back. The text area arrives empty. The page's one action is "Read it" on both.

R2. Switching between "File" and "Paste text" loses nothing the person gave: a file held in the file control and text typed in the text area are both still there when the person switches back. Switching either way clears every message on the choose step for good: a message under the file control (story 10, R5) and a message by the text area (R3, R4, R6). None is there when the person switches back.

R3. Pressing "Read it" on "Paste text" with no text reads nothing and shows "Paste the report text first." by the text area. Text that is only spaces or line breaks counts as none. The message is announced to assistive technology once when it appears, and goes as soon as anything is typed or pasted. Keyboard focus stays where it was.

R4. Pressing "Read it" on "Paste text" with text in the text area reads that text as the document, whatever the file control holds, a spatial file included. The whole text is read, as typed. The wait shows "Reading your report…" in place of a file's name and is announced once as "Reading your report"; the check step then lists what was read as it does for a file.
- When the reading fails, the page returns to the choose step, still on "Paste text", and shows "Couldn't read the pasted text. `<reason>`" by the text area. The reason is the one the reading service gives (enabler 02, R7), worded as story 10 (R4) words it for a file.
- The text is still in the text area, and "Read it" reads it again as a new reading.
- The message is announced once, and goes when the text is edited or a reading starts.

R5. A file and typed or pasted text are the only two ways to give a document. Speech input is not offered.

R6. Pasted text is at most 50,000 characters. Text over the limit is not read and not cut: the text area keeps all of it, and a message by the text area states the limit and the text's length, "Pasted text can be up to 50,000 characters. This is `<count>`." "Read it" reads nothing while the text is over the limit. The message goes when the text is 50,000 characters or fewer. Text of exactly 50,000 characters is read.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Adding the changes read from pasted text, and "pasted text" in place of a file name — story 40.
- The file control, the wait and the check step for a file — story 01.
- "Read it" pressed with no file held, and a file's reading that fails — story 10 (R1, R4).
- The "That's a spatial file" box, which is hidden while "Paste text" is chosen — story 11 (R2).
- The pasted text shown beside the changes, under the heading "Pasted text" — stories 04 and 31.
- "Cancel" and "Read another" — story 35. After "Read another" the choice is still on "Paste text" and the text is still in the text area (story 35, R4).

## Needs to know from elsewhere

- The reading — enabler 02, not built. This story hands it the pasted text in place of a file, with the same account of what the project can take as story 01 hands over, and gets back the same thing: the proposed performance measure entries, or a failure with which of its reasons applies. The service keeps nothing of the text.
- The wait, and what the check step shows for each change — owned by story 01 (R6, R8).
- Leaving the page before adding keeps nothing of a reading, and the page opens again on the choose step; typed text is not kept either — owned by story 01 (R7).
- A message about a problem is written next to its control, tied to it for assistive technology, announced once, and goes when its cause does (SR-6). R3, R4 and R6 are that rule for the text area.

## Scenarios

S7 and S8 run against the recorded reading of the pasted paragraph in `../fixtures.md`. No sample is a text over the limit or a text whose reading fails; S9 and S10 describe those by kind.

**S1 — "Paste text" takes the file control's place** (proves R1)
- Given a Contributor is on the choose step of Import a report for Deer Creek, which is on "File"
- When they choose "Paste text"
- Then a text area labelled "Your report" stands where the file control was, and the page's one action is still "Read it"

**S2 — A file and typed text survive the switch** (proves R2)
- Given the file control holds `deer-creek-crew-log-2025.xlsx`, and the text area holds the pasted paragraph
- When the Contributor chooses "File" and then "Paste text" again
- Then the file control showed the crew log, and the text area shows the paragraph as it was

**S3 — Switching clears the message for good** (proves R2)
- Given "Paste text" is chosen and "Paste the report text first." is showing
- When the Contributor chooses "File" and then "Paste text" again
- Then no message shows on either

**S4 — "Read it" with no text** (proves R3)
- Given "Paste text" is chosen and the text area is empty
- When the Contributor presses "Read it"
- Then the page stays on the choose step and shows "Paste the report text first." by the text area, read out once to a screen reader

**S5 — Spaces are not text** (proves R3)
- Given "Paste text" is chosen and the text area holds three spaces and a line break
- When the Contributor presses "Read it"
- Then the page stays on the choose step and shows "Paste the report text first."

**S6 — Typing takes the message away** (proves R3)
- Given "Paste text" is chosen, the text area is empty and "Paste the report text first." is showing
- When the Contributor types one word
- Then the message goes

**S7 — The wait names no file** (proves R4)
- Given "Paste text" is chosen and the text area holds the pasted paragraph
- When the Contributor presses "Read it"
- Then the page shows a progress indicator and "Reading your report…"

**S8 — The pasted text is read** (proves R4)
- Given the pasted paragraph has been sent to be read for Deer Creek
- When the reading comes back
- Then the check step lists three changes, each as its fixture row P1 to P3 says, and the action reads "Add 3 changes"; P1 reads "Acres of riparian habitat restored · 2025", 6 acres, Riparian treatment: Planting

**S9 — Text over the limit is not read** (proves R6)
- Given "Paste text" is chosen
- When the Contributor pastes a text of 50,001 characters and presses "Read it"
- Then the text area still holds all 50,001 characters, the message "Pasted text can be up to 50,000 characters. This is 50,001." shows by it, and no reading starts

**S10 — A failed reading of pasted text** (proves R4)
- Given "Paste text" is chosen and the text area holds a text whose reading will fail because the reading service is not available
- When the Contributor presses "Read it" and the reading fails
- Then the choose step is on "Paste text", the text is still in the text area, and "Couldn't read the pasted text." shows by it, followed by the reason

**S11 — No speech input** (proves R5)
- Given the choose step
- When the Contributor looks over it on "File" and then on "Paste text"
- Then neither shows a microphone button or any control for dictating the report

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Reading by an outside AI service is on for the workspace. The test environment serves the recorded reading of the pasted paragraph for that text.
Test data: `../fixtures.md`: the pasted paragraph, rows P1 to P3, and the crew log file. Made by the tester, because no sample has it: any text longer than 50,000 characters (the paragraph pasted over and over will do).
Reset: none needed. The script stops on the check step; leave by the breadcrumb without adding and nothing is kept.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and press "Import a report" on the Performance measures card | The Import a report page, with "File" chosen and the file control showing |
| 2 | Look over the page for a way to speak the report in | No microphone button and no dictation control |
| 3 | Choose `deer-creek-crew-log-2025.xlsx` in the file control, then choose "Paste text" | A text area labelled "Your report" where the file control was; "Read it" is still the one button |
| 4 | Press "Read it" with the text area empty | "Paste the report text first." by the text area; the page does not move on |
| 5 | Type three spaces and press "Read it" | The message goes as you type, and is back after the press |
| 6 | Choose "File", then "Paste text" again | The file control still holding the crew log; then the text area, with no message |
| 7 | Paste the long text and press "Read it" | A message by the text area giving the 50,000 limit and the text's length; all of the text is still there; the page does not move on |
| 8 | Replace the text with the paragraph from the fixture | The paragraph in the text area, and no message |
| 9 | Choose "File", then "Paste text" again | The paragraph is still there |
| 10 | Press "Read it" | "Reading your report…" and no button at the top of the page |
| 11 | Wait for the reading to finish | Three changes, each as rows P1 to P3 say, and one button, "Add 3 changes" |

## Open questions

None open. The story rests on these proposed answers:

- Q-108 (proposed) — "Paste the report text first." goes as soon as text is typed, and a switch clears it for good (R2, R3, S3, S6, steps 5 and 6).
- Q-83 (proposed) — the messages are announced once, as SR-6 now says of every error state (R3, R4, S4).
- Q-47 (proposed) — the 50,000-character limit and what the person sees at it (R6, S9, step 7).
- Q-105 (proposed) — what a failed reading of pasted text shows, and where (R4, S10).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | STA-2, ACN-4; RUL-101 |
| R2 | decided; proposed (Q-108) | ACN-4, RUL-102; RUL-279 |
| R3 | shown; proposed (Q-108); proposed (Q-83) | STA-4, RUL-102; RUL-279; RUL-280 |
| R4 | decided; proposed (Q-105) | STA-2, RUL-82, RUL-103; RUL-281; relies on story 01, ACN-6, STA-6 |
| R5 | decided | RUL-30 |
| R6 | proposed (Q-47) | RUL-282 |
- Wording provisional: "Pasted text can be up to 50,000 characters. This is `<count>`." (R6). "Couldn't read the pasted text. `<reason>`" is the feature's shared wording.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the choice of File or Paste text, the text area, the message for no text, the reading of pasted text); `src/data/firma2-report-import.ts` (the scripted reading of the paragraph).
- Data shapes, as the prototype models them: the page holds a chosen file and the typed text side by side, and reads whichever the choice is on.
- Where the prototype differs from the requirements above: switching to "File" hides "Paste the report text first." with the text area, and it is back when the person returns; the message stays while the person types; it is shown but not announced; a failed reading of pasted text writes its message under the hidden file control, where it cannot be seen; the text area sets no longest length; the "That's a spatial file" box stays in view on "Paste text" (story 11).
- Do not copy: the text area filled in advance with the sample paragraph; the scripted reading that returns the same three changes for any pasted text; the "Converted: …" line and the inferred "Planting" on row P3 (the sample's volunteer sentence is restated in `../fixtures.md` so that P3 is a plain ready change).

</details>
