# 10 — A Contributor is told why a file was not read

Type: story
Epic: A — Import a report
Release: first
Status: needs-info
Revision: 1
Blocked by: 01
Covers: STA-3, STA-7, STA-36, RUL-31, RUL-52, RUL-95, RUL-96, RUL-97
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; no spec decision names the file types, the limit or the failures
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R3 and R5. Can start only against a stand-in for enabler 02 (not built) that answers with a failure: R4. Waiting: which failures are told apart and the reason shown for each, in R4, on Q-41; how long the wait may last on Q-66; the undecided part of R2 on Q-69; the list of types on Q-38; the limit and its message on Q-47; the other parts marked "Not decided" on Q-104 and Q-105.

## Story

As a Contributor, I want to be told why my file was not read, so that I can choose one that will be and still get the report onto the record without retyping it.

## Description

Story 01 covers the path where a file is chosen and read. This story covers the ways that path stops on the choose step: "Read it" is pressed with no file held, the file is of a type the control does not take, the file is too large, or the reading fails. Each time the person is on the choose step with the reason next to the file control, and nothing has been added to the record. See the choose step at `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; the prototype shows no failed reading.

## Requirements

R1. Pressing "Read it" with no file held reads nothing: the page stays on the choose step and shows "Choose a file, or switch to Paste text." under the file control.

R2. The file picker offers only files of the types the control names: .pdf, .docx, .xlsx, .xls and .csv. Not decided: what happens to a file of another type that is dropped onto the control (Q-69). (open: Q-38)

R3. A file over 20 MB is not held, whether it is chosen in the file picker or dropped onto the control. Under the control the person reads "File exceed 20 MB limit: `<file name>`". Not decided: whether a file the control held before stays held (Q-104). (open: Q-47)

R4. When a reading fails, the page returns from the wait to the choose step and shows "Couldn't read `<file name>`." followed by the reason the reading service gives, in one sentence, under the file control. When the failure carries no reason, "Couldn't read `<file name>`." stands alone. The file is still held, so "Read it" can be pressed again; it starts a new reading. Nothing is added to the record. The page sets no time limit of its own on the wait: it shows a failure only when the reading service answers with one (open: Q-66). Not decided: which failures are told apart, and the reason shown for each (Q-41); what a failed reading of pasted text shows, and where (Q-105).

R5. Each of these messages is written under the file control and announced to assistive technology once, straight away. Keyboard focus stays where it was. The message of R1 or R4 goes when the control takes a file, when a reading starts, and when the person switches to "Paste text" (story 09, R2). Not decided: when the message of R3 goes, whether it can show together with the message of R1 or R4, and whether taking the held file out removes a message (Q-104).

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- A spatial file — story 11.
- "Read it" pressed with no pasted text, and the message going when the person switches to "Paste text" — story 09 (R2, R3).
- "Read it" pressed with a spatial file held, which shows no message — story 11 (R3).
- A file dropped on the project page that is too large or not readable — story 08.
- An invalid change when "Add N changes" is pressed — story 30.
- A reading that proposes nothing — story 04.
- A failure while the import is saved — story 01 (Q-44).

## Needs to know from elsewhere

- The file control holds one file, names the types and the limit on its face, and a second file replaces the first — owned by story 01 (R4, R5).
- The reading — enabler 02, not built. It answers with a reading or with a failure; a failure carries its reason as one sentence, which R4 shows word for word. Who writes those sentences, and whether one may name a renameable noun, is part of Q-41.
- A reading is not stored, and a failed one leaves nothing behind — owned by story 01 (R7).
- The pattern these messages follow, next to the control and announced once, is SR-6; whether it binds every error state is Q-83.

## Scenarios

No fixture has a file over 20 MB, a file of another type, or a failed reading; S3 to S6 describe the data by kind and size.

**S1 — "Read it" with no file** (proves R1)
- Given a Contributor is on the choose step for Deer Creek and the file control holds no file
- When they press "Read it"
- Then the page stays on the choose step and shows "Choose a file, or switch to Paste text." under the file control

**S2 — The message is announced once** (proves R5)
- Given a Contributor using a screen reader is on the choose step and the file control holds no file
- When they press "Read it"
- Then "Choose a file, or switch to Paste text." is read out once, without their moving to it

**S3 — The picker offers only the named types** (proves R2)
- Given the choose step, and a folder that holds a .pdf, a .csv and a .png image
- When the Contributor opens the file picker from the control
- Then the .pdf and the .csv can be chosen and the .png cannot

**S4 — A file that is too large** (proves R3)
- Given the choose step, and the file control holds no file
- When the Contributor chooses a PDF of 25 MB named `big-report.pdf`
- Then the control holds no file, and "File exceed 20 MB limit: big-report.pdf" shows under it

**S5 — The reading fails** (proves R4)
- Given the file control holds a PDF under 20 MB, named `unreadable.pdf`, whose reading will fail, and Deer Creek's figures are the fixture's "Before" column
- When the Contributor presses "Read it" and the reading fails
- Then the choose step shows "Couldn't read unreadable.pdf." and the reason under the file control, and Deer Creek's figures are still the "Before" column

**S6 — The file is still held after a failure** (proves R4, R5)
- Given the choose step shows "Couldn't read unreadable.pdf." after a failed reading
- When the Contributor presses "Read it" without choosing a file again
- Then the message goes and the page shows "Reading unreadable.pdf…"

**S7 — Another file takes the message away** (proves R5)
- Given the choose step shows "Choose a file, or switch to Paste text."
- When the Contributor chooses `deer-creek-crew-log-2025.xlsx`
- Then the control holds the crew log and no message shows under it

## UAT script

The script stops before a failed reading (R4): nobody has said which files fail or how a tester makes a reading fail (Q-41, Q-88).

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person).
Test data: `../fixtures.md`: the crew log file. Brought by the tester, because no fixture has them: any PDF over 20 MB, and a folder that holds a .png image beside a .pdf.
Reset: none needed. The script reads nothing and adds nothing to the record.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and press "Import report" on the Performance measures card | The Import a report page, with the file control empty |
| 2 | Press "Read it" without choosing a file | "Choose a file, or switch to Paste text." under the file control; the page does not move on |
| 3 | Open the file picker from the control and go to the folder with the .png | The .pdf can be chosen; the .png cannot |
| 4 | Choose the PDF over 20 MB | "File exceed 20 MB limit: `<its name>`" under the control; the control shows no file |
| 5 | Choose `deer-creek-crew-log-2025.xlsx` | The control shows the crew log's name, and no message under it |

On the prototype: a failed reading cannot be seen there either; its scripted readings never fail.

## Open questions

- Q-38 — R2 and S3: the list of types the picker offers.
- Q-41 — R4, S5 and S6: which failures are told apart and each one's reason; the script cannot reach R4 until a failing file is named.
- Q-66 — R4: a time limit on the wait would add a failure the page raises itself, with its own sentence.
- Q-47 — R3, S4 and step 5: the size limit and the wording of its message.
- Q-69 — R2: whether the control refuses a dropped file of another type, and with what words; no scenario covers it yet.
- Q-88 — how a tester is served a failed reading, so where the script stops.
- Q-104 — would change R3 and R5: which message goes when, whether two can show at once, and whether a too-large file puts out the file already held; S4 and S7 assume an empty control and one message.
- Q-105 — would change R4: adds the message, and its place, for a failed reading of pasted text.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | STA-3 |
| R2 | shown | RUL-31 |
| R3 | shown | STA-36, RUL-31; RUL-96 |
| R4 | shown | STA-7, RUL-95, RUL-97; relies on story 01, RUL-84 |
| R5 | shown | RUL-52, STA-7, RUL-96 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (the file control, the message for no file, the return from a failed reading); `node_modules/@esa/ecology/src/components/esa-file-upload.ts` (the hub's file control: the size limit and its message); `scripts/report-reader.mjs` (the developer-machine reader, the only place a reading fails).
- Data shapes: none of its own. A failure produces no reading and no import.
- What the prototype does where nothing is decided (not requirements): a file of another type dropped onto the control is held like any other, with no message, and fails only when it is read (Q-69); one general "Couldn't read `<name>`." line stands for every failure (Q-41). The size message is the file control's own and the other two are the page's, in two places under the control: a too-large file leaves a file already held in place and fires nothing, so "Choose a file, or switch to Paste text." or "Couldn't read …" stays beside the size message, and the size message stays until the control is next given a file, through a reading and "Read another"; taking the held file out removes no message (Q-104). A failed reading of pasted text writes "Couldn't read your report." into the file control's panel, which is hidden while "Paste text" is chosen, so the person sees nothing and only the announcement is made (Q-105). "Over 20 MB" is more than 20 × 1,024 × 1,024 bytes; several too-large files dropped together read "Files exceed 20 MB limit: `<name>`, `<name>`" (Q-47).
- Do not copy: the scripted readings, which never fail and read any PDF or Word file as one sample and any spreadsheet as the other. The developer-machine reader refuses .doc and .xls and takes .txt, which disagrees with the control (Q-38); neither list is final. "File exceed 20 MB limit" is the hub control's own wording, kept here only because it is what was shown (Q-47).

</details>
