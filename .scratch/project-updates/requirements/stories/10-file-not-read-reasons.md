# 10 — A Contributor is told why a file was not read

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-38, Q-41, Q-47, Q-66, Q-69, Q-83, Q-104
Revision: 1
Blocked by: 01
Covers: STA-3, STA-7, STA-36, RUL-31, RUL-52, RUL-95, RUL-96, RUL-97, RUL-283, RUL-284, RUL-285, RUL-286, RUL-287, RUL-288, RUL-289
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; no spec decision names the file types, the limits or the failures
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R3 and R5. Against a stand-in for enabler 02 (not built) that answers a named file with a named failure: R4. The limits of 100 pages and 5,000 rows in R3 are to be confirmed against the reading service when it is chosen. Nothing waits on a question.

## Story

As a Contributor, I want to be told why my file was not read, so that I can choose one that will be and still get the report onto the record without retyping it.

## Description

Story 01 covers the path where a file is chosen and read. This story covers the ways that path stops on the choose step: "Read it" is pressed with no file held, the file is of a type or size the control does not take, or the reading fails. Each time the person is on the choose step with one reason under the file control, and nothing has been added to the record. The reasons let the person tell "fix the file" from "try again". See the choose step at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; the prototype shows no failed reading.

## Requirements

R1. Pressing "Read it" with no file held reads nothing: the page stays on the choose step and shows "Choose a file, or switch to Paste text." under the file control.

R2. The file picker offers only files of the types the control names: .pdf, .docx, .xlsx, .csv and .txt. A file of any other type that reaches the control is refused before anything is read, and is not held:
- a .doc or .xls: "`<file name>` is an older Word or Excel file. Save it as .docx or .xlsx and choose it again."
- any other file that is not a spatial file: "`<file name>` can't be read. Choose a PDF, Word (.docx), Excel (.xlsx), CSV or text (.txt) file."

R3. A report file is held to three limits, each refused with the limit stated, and nothing is read in part or cut short.
- A file over 20 MB is not held, whether it is chosen in the file picker or dropped onto the control. Under the control the person reads "File exceed 20 MB limit: `<file name>`". A file the control held before stays held and listed.
- A file of more than 100 pages, or a spreadsheet of more than 5,000 rows, is refused before it is read: the page is on the choose step, the file is still listed, and the message reads "`<file name>` has more than 100 pages." or "`<file name>` has more than 5,000 rows."
- These limits are for reports. A .zip is not a report; whether it is held, and its own limit, is story 11.

R4. When a reading fails, the page returns from the wait to the choose step and shows "Couldn't read `<file name>`." followed by one reason, under the file control. The reading service says which reason applies and the page words it:
- no text to read: "It has no text to read. It may be a scan."
- password-protected: "It is password-protected."
- empty: "The file is empty."
- too long: "Reading took too long. Try again." A reading that has not come back after four minutes fails with this reason.
- service not available: "The reading service is not available. Try again shortly."
- connection lost: "The connection was lost. Try again."
The file is still held, so "Read it" can be pressed again; it starts a new reading. Nothing is added to the record.

R5. One message at a time shows under the file control: the latest replaces the one before it. Each is announced to assistive technology once, straight away, and keyboard focus stays where it was. Every message goes when the control's content changes (a file chosen, replaced or removed), when a reading starts, and when the person switches to "Paste text". None survives a reading and "Read another" (story 35).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- A spatial file, a .zip among them — story 11.
- "Read it" pressed with no pasted text, text over its limit, a failed reading of pasted text, and messages cleared by the switch — story 09 (R2 to R4, R6).
- Several files dropped on the control together — story 01 (R5).
- A file dropped on the project page that is too large or not readable — story 08.
- An invalid change when "Add N changes" is pressed — story 30.
- A reading that proposes nothing — story 04.
- A failure while the import is saved — story 22 (R1).

## Needs to know from elsewhere

- The file control holds one file, lists it with its name and size, names the types and the limit on its face, and a second file replaces the first — owned by story 01 (R4, R5).
- The reading — enabler 02, not built. It answers with a reading or with a failure; a failure says which of the six reasons applies (enabler 02, R7). The service words nothing: every sentence the person reads is the product's (SR-4).
- A reading is not stored, and a failed one leaves nothing behind: the file sent is deleted — owned by story 01 (R7) and enabler 02 (R4).
- The pattern these messages follow, next to the control, announced once, gone when its cause goes, is SR-6.

## Scenarios

No sample is a file over a limit, a file of another type, or a file whose reading fails; S3 to S11 describe the data by kind and size. A failed reading needs the test environment's stand-in to answer a named file with a named failure (to be made).

**S1 — "Read it" with no file** (proves R1)
- Given a Contributor is on the choose step for Deer Creek and the file control holds no file
- When they press "Read it"
- Then the page stays on the choose step and shows "Choose a file, or switch to Paste text." under the file control

**S2 — The message is announced once** (proves R5)
- Given a Contributor using a screen reader is on the choose step and the file control holds no file
- When they press "Read it"
- Then "Choose a file, or switch to Paste text." is read out once, without their moving to it

**S3 — The picker offers only the named types** (proves R2)
- Given the choose step, and a folder that holds a .pdf, a .txt and a .png image
- When the Contributor opens the file picker from the control
- Then the .pdf and the .txt can be chosen and the .png cannot

**S4 — An older Word file is refused** (proves R2)
- Given the choose step, and the file control holds no file
- When the Contributor drops a file named `old-report.doc` on the control
- Then the control holds no file and "old-report.doc is an older Word or Excel file. Save it as .docx or .xlsx and choose it again." shows under it

**S5 — A file of another type is refused** (proves R2)
- Given the choose step, and the file control holds no file
- When the Contributor drops a photograph named `site.png` on the control
- Then the control holds no file and "site.png can't be read. Choose a PDF, Word (.docx), Excel (.xlsx), CSV or text (.txt) file." shows under it

**S6 — A file that is too large** (proves R3)
- Given the choose step, and the file control holds no file
- When the Contributor chooses a PDF of 25 MB named `big-report.pdf`
- Then the control holds no file, and "File exceed 20 MB limit: big-report.pdf" shows under it

**S7 — A too-large file does not put out the held one** (proves R3)
- Given the file control holds `deer-creek-crew-log-2025.xlsx`
- When the Contributor chooses a PDF of 25 MB named `big-report.pdf`
- Then the control still lists the crew log, and "File exceed 20 MB limit: big-report.pdf" shows under it

**S8 — A file with too many pages** (proves R3)
- Given the file control holds a PDF under 20 MB, of 140 pages, named `long-report.pdf`
- When the Contributor presses "Read it"
- Then the page is on the choose step, still listing the file, with "long-report.pdf has more than 100 pages.", and no change is listed

**S9 — A failure the person fixes in the file** (proves R4)
- Given the file control holds a password-protected PDF under 20 MB, named `locked.pdf`, and Deer Creek's figures are the fixture's "Before" column
- When the Contributor presses "Read it" and the reading fails
- Then the choose step shows "Couldn't read locked.pdf. It is password-protected." under the file control, and Deer Creek's figures are still the "Before" column

**S10 — A failure the person tries again** (proves R4, R5)
- Given the choose step shows "Couldn't read slow-report.pdf. Reading took too long. Try again." after a reading that did not come back in four minutes
- When the Contributor presses "Read it" without choosing a file again
- Then the message goes and the page shows "Reading slow-report.pdf…"

**S11 — The latest message replaces the one before** (proves R5)
- Given the choose step shows "Choose a file, or switch to Paste text."
- When the Contributor chooses a PDF of 25 MB named `big-report.pdf`
- Then "File exceed 20 MB limit: big-report.pdf" shows under the control, and the earlier message does not

**S12 — Another file takes the message away** (proves R5)
- Given the choose step shows "File exceed 20 MB limit: big-report.pdf"
- When the Contributor chooses `deer-creek-crew-log-2025.xlsx`
- Then the control lists the crew log and no message shows under it

## UAT script

Steps 9 and 10 need the test environment's stand-in to fail two named files (to be made); until it does, stop after step 8.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Reading by an outside AI service is on for the workspace. The test environment answers `locked.pdf` with the failure "password-protected" and `slow-report.pdf` with "too long".
Test data: `../fixtures.md`: the crew log file. Brought by the tester, because no sample has them: any PDF over 20 MB; a folder that holds a .png image beside a .pdf; any file whose name ends in .doc; two small PDFs named `locked.pdf` and `slow-report.pdf`.
Reset: none needed. The script adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and press "Import a report" on the Performance measures card | The Import a report page, with the file control empty |
| 2 | Press "Read it" without choosing a file | "Choose a file, or switch to Paste text." under the file control; the page does not move on |
| 3 | Open the file picker from the control and go to the folder with the .png | The .pdf can be chosen; the .png cannot. Close the picker without choosing |
| 4 | Choose the PDF over 20 MB | "File exceed 20 MB limit: `<its name>`" under the control, in place of the earlier message; the control shows no file |
| 5 | Drop the .doc file on the control | A message that names the file and says to save it as .docx or .xlsx, in place of the size message; the control shows no file |
| 6 | Drop the .png on the control | A message that names the file and lists PDF, Word (.docx), Excel (.xlsx), CSV and text (.txt); the control shows no file |
| 7 | Choose `deer-creek-crew-log-2025.xlsx` | The control lists the crew log, and no message under it |
| 8 | Choose the PDF over 20 MB again | The size message; the control still lists the crew log |
| 9 | Choose `locked.pdf` and press "Read it" | "Reading locked.pdf…", then the choose step with "Couldn't read locked.pdf. It is password-protected."; the control still lists the file |
| 10 | Choose `slow-report.pdf`, press "Read it", and when the message "Couldn't read slow-report.pdf. Reading took too long. Try again." shows, press "Read it" again | The first message goes when the file is chosen; after the second press, "Reading slow-report.pdf…" and no message |

## Open questions

None open. The story rests on these proposed answers:

- Q-38 (proposed) — the five types, and the refusal of .doc and .xls (R2, S3, S4, step 5).
- Q-69 (proposed) — a dropped file of another type is refused, not held (R2, S5, step 6).
- Q-47 (proposed) — 20 MB, 100 pages and 5,000 rows, each refused with the limit stated (R3, S6, S8). The page and row figures are to be confirmed when the reading service is chosen.
- Q-41 (proposed) — the six reasons a reading fails, told apart (R4, S9, S10, steps 9 and 10).
- Q-66 (proposed) — a reading fails after four minutes (R4, S10).
- Q-104 (proposed) — one message at a time, what removes each, and a too-large file leaving the held file in place (R3, R5, S7, S11, S12, steps 4 to 8).
- Q-83 (proposed) — every message is announced once, as SR-6 now says of every error state (R5, S2).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | STA-3 |
| R2 | shown; proposed (Q-38); proposed (Q-69) | RUL-31; RUL-283; RUL-284 |
| R3 | shown; proposed (Q-104); proposed (Q-47) | STA-36, RUL-31, RUL-96; RUL-285; RUL-286 |
| R4 | shown; proposed (Q-41); proposed (Q-66) | STA-7, RUL-95, RUL-97; RUL-287; RUL-288; relies on story 01, RUL-84 |
| R5 | shown; proposed (Q-104); proposed (Q-83) | RUL-52, STA-7, RUL-96; RUL-285; RUL-289 |
- Wording provisional: the two refusals of R2, the two limit messages of R3 and the six reason sentences of R4. "Couldn't read `<file name>`." is the feature's shared wording.
- "File exceed 20 MB limit: `<file name>`" is the shared file control's own wording, kept because the control writes it. Correcting its words is a hub request, as is a refusal of several files at once (story 01, R5).
- Whether pages and rows are counted before the file is sent or by the reading service is the build's choice; either way the person sees R3 and nothing is read in part.
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the file control, the message for no file, the return from a failed reading); `node_modules/@esa/ecology/src/components/esa-file-upload.ts` (the hub's file control: the size limit and its message); `scripts/report-reader.mjs` (the developer-machine reader, the only place a reading fails).
- Data shapes: none of its own. A failure produces no reading and no import.
- Where the prototype differs from the requirements above: a file of another type dropped onto the control is held like any other and fails only when it is read; one general "Couldn't read `<name>`." line stands for every failure; the size message is the control's own and the other two are the page's, in two places, so two can show together and the size message stays until the control is next given a file; taking the held file out removes no message; no time limit is set on the wait; no page or row limit exists. "Over 20 MB" is more than 20 × 1,024 × 1,024 bytes.
- Do not copy: the scripted readings, which never fail and read any PDF or Word file as one sample and any spreadsheet as the other; the control's list naming .xls.

</details>
