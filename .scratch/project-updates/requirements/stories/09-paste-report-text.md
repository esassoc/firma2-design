# 09 — A Contributor pastes the report's text instead of choosing a file

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 01
Covers: STA-2, STA-4, ACN-4, RUL-30, RUL-82, RUL-101, RUL-102, RUL-103
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #21
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R3 and R5. Can start only against the recorded reading of the pasted paragraph in `../fixtures.md`, which stands in for enabler 02 (not built): R4. Waiting: the length limit in R4 on Q-47; whether the message of R3 is announced on Q-83, and what switching does to it on Q-108; a failed reading of pasted text on Q-105; the fixture's row P3 on Q-82.

## Story

As a Contributor, I want to paste a report's text when I have no file to choose, so that what the report says gets onto the project's record without retyping it.

## Description

This is the second way to give Import a report its document, on the choose step that story 01 builds. The person switches from "File" to "Paste text", pastes, and presses "Read it"; the wait and the check step are then the same as for a file. This story ends on the check step. Story 40 holds what adding leaves behind: the pasted text kept as the import's document, and "pasted text" in place of a file name. Split on 2026-11-23: story 40 was part of this story. See it at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`, under "Paste text".

## Requirements

R1. The choose step offers a choice of two, "File" and "Paste text", named "Report source" for assistive technology, and opens on "File" every time the page is opened. Choosing "Paste text" puts a text area labelled "Your report" in place of the file control; choosing "File" brings the file control back. The text area arrives empty. The page's one action is "Read it" on both.

R2. Switching between "File" and "Paste text" loses nothing: a file held in the file control and text typed in the text area are both still there when the person switches back. Switching either way removes a message the page wrote under the file control (story 10: no file held, a reading that failed); it is not there when the person switches back. Not decided: whether switching removes "Paste the report text first." for good, or only while the text area is out of view (Q-108).

R3. Pressing "Read it" on "Paste text" with no text reads nothing and shows "Paste the report text first." by the text area. Text that is only spaces or line breaks counts as none. The message stays while the person types and goes on the next press of "Read it" with text in the text area. Keyboard focus stays where it was. (open: Q-83, for whether the message is announced)

R4. Pressing "Read it" on "Paste text" with text in the text area reads that text as the document, whatever the file control holds, a spatial file included. The whole text is read, as typed. The wait shows "Reading your report…" in place of a file's name and is announced once as "Reading your report"; the check step then lists what was read as it does for a file. Not decided: a limit on the length of the text, and what the person sees at it (Q-47); what a failed reading of pasted text shows (Q-105; story 10, R4).

R5. A file and typed or pasted text are the only two ways to give a document. Speech input is not offered.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Adding the changes read from pasted text, the text kept as the import's document, and "pasted text" in place of a file name — story 40.
- The file control, the wait and the check step for a file — story 01.
- "Read it" pressed with no file held, and a reading that fails — story 10 (R1, R4). That story does not yet say what a failed reading of pasted text shows (Q-105).
- The "That's a spatial file" box — story 11.
- The pasted text shown beside the changes — stories 04 and 31.
- "Cancel" and "Read another" — story 35. After "Read another" the choice is still on "Paste text" and the text is still in the text area (story 35, R4).

## Needs to know from elsewhere

- The reading — enabler 02, not built. This story hands it the pasted text in place of a file, with the same account of what the project can take as story 01 hands over, and gets back the same thing: the proposed performance measure entries.
- The wait, and what the check step shows for each change — owned by story 01 (R6, R8).
- Leaving the page before adding keeps nothing of a reading, and the page opens again on the choose step; typed text is not kept either — owned by story 01 (R7).
- A message about a problem is written next to the control it concerns and announced to assistive technology once (SR-6, which is `inferred` and waits on Q-83). The prototype does not announce the message of R3.

## Scenarios

S6 and S7 run against the recorded reading of the pasted paragraph in `../fixtures.md`.

**S1 — "Paste text" takes the file control's place** (proves R1)
- Given a Contributor is on the choose step of Import a report for Deer Creek, which is on "File"
- When they choose "Paste text"
- Then a text area labelled "Your report" stands where the file control was, and the page's one action is still "Read it"

**S2 — A file and typed text survive the switch** (proves R2)
- Given the file control holds `deer-creek-crew-log-2025.xlsx`, and the text area holds the pasted paragraph
- When the Contributor chooses "File" and then "Paste text" again
- Then the file control showed the crew log, and the text area shows the paragraph as it was

**S3 — Switching removes the message** (proves R2)
- Given "Paste text" is chosen and "Paste the report text first." is showing
- When the Contributor chooses "File"
- Then the choose step shows no message

**S4 — "Read it" with no text** (proves R3)
- Given "Paste text" is chosen and the text area is empty
- When the Contributor presses "Read it"
- Then the page stays on the choose step and shows "Paste the report text first." by the text area

**S5 — Spaces are not text** (proves R3)
- Given "Paste text" is chosen and the text area holds three spaces and a line break
- When the Contributor presses "Read it"
- Then the page stays on the choose step and shows "Paste the report text first."

**S6 — The wait names no file** (proves R4)
- Given "Paste text" is chosen and the text area holds the pasted paragraph
- When the Contributor presses "Read it"
- Then the page shows a progress indicator and "Reading your report…"

**S7 — The pasted text is read** (proves R4)
- Given the pasted paragraph has been sent to be read for Deer Creek
- When the reading comes back
- Then the check step lists three changes, each as its fixture row P1 to P3 says; P1 reads "Acres of riparian habitat restored · 2025", 6 acres, Riparian treatment: Planting

**S8 — No speech input** (proves R5)
- Given the choose step
- When the Contributor looks over it on "File" and then on "Paste text"
- Then neither shows a microphone button or any control for dictating the report

## UAT script

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). The recorded reading of the pasted paragraph is served for that text.
Test data: `../fixtures.md`: the pasted paragraph, rows P1 to P3, and the crew log file. Row P3's amount waits on Q-82. No fixture has a text at a length limit (Q-47).
Reset: none needed. The script stops on the check step; leave by the breadcrumb without adding and nothing is kept.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and press "Import report" on the Performance measures card | The Import a report page, with "File" chosen and the file control showing |
| 2 | Look over the page for a way to speak the report in | No microphone button and no dictation control |
| 3 | Choose `deer-creek-crew-log-2025.xlsx` in the file control, then choose "Paste text" | A text area labelled "Your report" where the file control was; "Read it" is still the one button |
| 4 | Press "Read it" with the text area empty | "Paste the report text first." by the text area; the page does not move on |
| 5 | Type three spaces and press "Read it" | The same message |
| 6 | Choose "File" | The file control, still holding the crew log, and no message |
| 7 | Choose "Paste text" and paste the paragraph from the fixture | The paragraph in the text area |
| 8 | Choose "File", then "Paste text" again | The paragraph is still there |
| 9 | Press "Read it" | "Reading your report…" and no button at the top of the page |
| 10 | Wait for the reading to finish | Three changes, each as rows P1 to P3 say, and one button, "Add 3 changes" |

On the prototype: the paragraph is already in the text area, so empty it before step 4; any pasted text reads as this paragraph. See `../fixtures.md`, On the prototype.

## Open questions

- Q-47 — R4: a length limit on the text and the message at it would add a requirement and a scenario.
- Q-82 — S7 and step 10: what is proposed for row P3, so the count of three.
- Q-83 — R3 and S4: if SR-6 binds every error state, "Paste the report text first." is announced once; today it is not.
- Q-88 — how the recorded reading is served for the Preconditions.
- Q-105 — would change R4: adds what a failed reading of pasted text shows, and a scenario.
- Q-108 — would change R2 and S3: whether "Paste the report text first." is gone, or back, when the person returns to "Paste text".

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | STA-2, ACN-4; RUL-101 |
| R2 | decided | ACN-4; RUL-102 |
| R3 | shown | STA-4, RUL-102 |
| R4 | decided | STA-2, RUL-82; RUL-103; relies on story 01, ACN-6, STA-6 |
| R5 | decided | RUL-30 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the choice of File or Paste text, the text area, the message for no text, the reading of pasted text); `src/data/firma2-report-import.ts` (the scripted reading of the paragraph).
- Data shapes, as the prototype models them: the page holds a chosen file and the typed text side by side, and reads whichever the choice is on.
- What the prototype does where nothing is decided (not requirements): switching to "File" hides "Paste the report text first." with the text area, and it is back when the person returns (Q-108); that message is shown but not announced, and focus is not moved to the text area (Q-83); a failed reading of pasted text writes its message where it cannot be seen (Q-105); the text area sets no longest length (Q-47); the "That's a spatial file" box stays in view on "Paste text" (story 11).
- Do not copy: the text area filled in advance with the sample paragraph; the scripted reading that returns the same three changes for any pasted text; the "Converted: …" line on row P3 (story 26, `later`).

</details>
