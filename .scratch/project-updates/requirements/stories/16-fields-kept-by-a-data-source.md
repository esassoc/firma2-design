# 16 — A Contributor sees a Key facts field an authoritative data source supplies as kept

Type: story
Epic: B — What a report can change
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-56, Q-58, Q-59, Q-72, Q-126, Q-127
Revision: 1
Blocked by: 15
Covers: STA-16, RUL-18, RUL-69, RUL-152, RUL-153, RUL-154, RUL-155, RUL-156, RUL-311, RUL-312, RUL-313, RUL-314
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #16, #27, #40
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R7, on a check step where stories 04, 06 and 15 are built (the tally, the checkbox and the Key facts change are used here, not built here), against the recorded sample `deer-creek-key-facts-2025.pdf` and a stand-in for the `gis-data-sources` feature (specified, not built, release `later`). The stand-in answers, for a Key facts field of a project, whether a data source supplies it, whether that source is authoritative and the source's name, and records what R5 hands it. Waiting: the real answer and the real send, on `gis-data-sources`.

## Story

As a Contributor, I want a field that an authoritative data source supplies shown as kept, with the source named, so that I do not put a value on the record that the source will overwrite, and I know where to change it.

## Description

Story 15 proposes Key facts changes. Some Key facts fields are supplied by a data source, such as a GIS subscription, and each GIS subscription is either authoritative or not (spec #40). On the check step of Import a report, a field from an authoritative source is shown with what the report says and cannot be added. A field from a GIS subscription that is not authoritative is an ordinary Key facts change, and once added it is handed over to be sent to the GIS system.

This story is in the first release, built and accepted against a stand-in for `gis-data-sources`, by the user's approval of 2026-11-23. Q-17's proposal (every `gis-data-sources` story is later, and so is the door that creates projects from a GIS source) does not move it; until that feature ships no workspace has a data source, so nothing is kept outside the test environment. The prototype shows the kept state only, and only after its GIS settings are changed by hand; it has no authoritative setting. See `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`.

## Requirements

R1. When the report names a value for a Key facts field that an authoritative data source supplies, the change is shown as kept: the field's label, the badge "Kept by a data source", the value read, and one line of plain text that names the source. Like any change it shows its quote and can be selected to see its place in the document (story 04).
- When the value read is the record's value, the line reads "Kept by `<source name>`. Change it there."
- When the value read differs, the line reads "`<source name>` has `<the record's value>`. Change it there."
- A kept change never shows "Was …", and nothing in the line is a link.

R2. Kept wins over every other state a Key facts change can be in. A kept field whose value is the record's is not "Already on file"; a kept field the reading gives two different values for (story 15, R7) is not flagged. Each such change carries the one badge "Kept by a data source", and the tally counts it under "kept by a data source" and under nothing else.

R3. A kept change cannot be added. It has no checkbox, it is never counted in "Add N changes" or under "ready to add", and adding the import leaves the field on the record as it was. When no change of a reading has a checkbox, the commit action reads "Nothing to add" and cannot be pressed (story 06, R5).

R4. When the report names a value for a Key facts field that a GIS subscription supplies, and that subscription is not authoritative, the change is proposed like any other Key facts change, with one more line that names the source the value is also sent to: "Also sent to `<source name>`."

R5. When a change of R4 is added, the project, the field and the value are handed to `gis-data-sources` to be sent to the GIS system as an edit to that field. They are handed over when the change is saved, not when it is published. This story shows nothing that comes back: a send that fails never undoes or blocks the save, and what the person is then told is `gis-data-sources`'.

R6. Whether a data source supplies a field, whether that source is authoritative, and the source's name come from the workspace's data sources. They are never taken from the reading.
- It applies to every Key facts field story 15 can propose, a custom field included. A Timeline counts as supplied when the source supplies either of its two years.
- One source supplies a field, so the line names one source.
- It is asked when the check step opens. When there is no answer by then, the change is proposed as an ordinary one.
- It is asked again when "Add N changes" is pressed. If a ticked field is now kept, nothing is saved, the change is shown as kept, and the person presses again on a true count. If there is still no answer, nothing is saved and the page says to try again: "Couldn't check which fields a data source keeps. Try again."

R7. A Key facts field supplied by a data source that is not a GIS subscription is shown as kept.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Proposing a Key facts change, and adding one — story 15.
- Where a kept change sits in its group: last, after "Already on file" — story 04, R4.
- Putting back, on Undo, a value that was handed over to be sent to the GIS system: it is taken back as another edit, sent the same way — story 41.
- The authoritative setting, which fields a subscription supplies, refusing a second source for one field, which value stands when both sides changed, and a send that fails — `gis-data-sources`.
- An authoritative setting for a data source that is not a GIS subscription: no such source is built.
- Setting up a data source from this page — not in build 1.

## Needs to know from elsewhere

- `gis-data-sources`, not built, release `later`. This story asks it, for a project's Key facts field: does a data source supply it, is that source authoritative, and what is the source called. It expects one answer for a field. For R5 it hands over the project, the field and the value added. Until it exists the answer comes from the stand-in.
- A field is read-only by hand only when an authoritative source supplies it (spec #40, amending #27) — owned by `gis-data-sources`.
- An edit handed over for the GIS system still waits in the review like any hand edit; it is not published by coming back from the GIS system — owned by `publish-review` and `gis-data-sources`.
- How a Key facts change is listed, added, flagged and marked "Already on file" — story 15 (R5 to R8).
- Each change that can be added has a checkbox; only ticked changes are added; "Nothing to add" when no change has a checkbox, "Nothing ticked" when one could be ticked — story 06 (R1, R5).
- The tally's part "`<N>` kept by a data source", left out when no change is kept — story 04, R2.
- The check at the press, where nothing is saved, the changes are marked afresh and the person presses again — story 32, R5.

## Scenarios

S1, S2, S4, S6, S7 and S9 run against the recorded sample `deer-creek-key-facts-2025.pdf` (rows F1, F2, F3) on Deer Creek with the stand-in set as each Given says. The stand-in's subscription is named "Enterprise project boundaries". No sample holds the data of the others; it is described by kind.

**S1 — A kept field whose value differs** (proves R1)
- Given the stand-in says an authoritative subscription supplies Deer Creek's Timeline, and the record's Timeline is 2023–2027
- When the key facts sample's reading comes back
- Then F1 shows the label "Timeline", the badge "Kept by a data source", "2023–2025", and "Enterprise project boundaries has 2023–2027. Change it there.", with no "Was …"

**S2 — Kept, not "Already on file"** (proves R1, R2)
- Given the stand-in says the same subscription supplies Deer Creek's County, and the record's County is El Dorado
- When the key facts sample's reading comes back
- Then F2 carries the badge "Kept by a data source" and not "Already on file", reads "Kept by Enterprise project boundaries. Change it there.", and the tally counts it under "kept by a data source" only

**S3 — Kept, not flagged** (proves R2)
- Given a field an authoritative source supplies, and a report that gives two different values for it
- When the reading comes back
- Then both changes carry "Kept by a data source", neither carries "Needs you", and neither has a checkbox

**S4 — A kept change cannot be added** (proves R3)
- Given the check step of S1, where F1 has no checkbox and the action reads "Add 1 change"
- When the Contributor presses it
- Then the Timeline on the project page is still 2023–2027

**S5 — Nothing to add** (proves R3)
- Given a reading whose only changes are Key facts fields an authoritative source supplies
- When the check step opens
- Then the commit action reads "Nothing to add" and cannot be pressed

**S6 — A source that is not authoritative** (proves R4)
- Given the stand-in says the subscription supplies Deer Creek's Timeline and is not authoritative
- When the key facts sample's reading comes back
- Then F1 is ticked, shows "2023–2025" and "Was 2023–2027", carries no "Kept by a data source" badge, and reads "Also sent to Enterprise project boundaries."

**S7 — An added change is handed over** (proves R5)
- Given the check step of S6
- When the Contributor presses "Add 2 changes"
- Then, before anything is published, the stand-in has received Deer Creek, the Timeline field and 2023–2025

**S8 — The reading does not decide what is kept** (proves R6)
- Given the stand-in of S1, and a reading that returns the Timeline change with nothing said about a data source
- When the check step opens
- Then the Timeline change is shown as kept

**S9 — A Timeline with one year supplied** (proves R6)
- Given the stand-in says an authoritative subscription supplies Deer Creek's completion year and not its start year
- When the key facts sample's reading comes back
- Then F1 is shown as kept, with no checkbox

**S10 — A field that becomes kept while the check step is open** (proves R6)
- Given a Key facts change that arrived ticked, and its field's source is set authoritative after the check step opened
- When the Contributor presses "Add N changes"
- Then nothing is saved, the change is shown as kept with no checkbox, and the action's count is one lower

**S11 — No answer** (proves R6)
- Given the data sources gave no answer when the check step opened, so a Key facts change arrived as an ordinary ticked one, and they still give none
- When the Contributor presses "Add N changes"
- Then nothing is saved and the page reads "Couldn't check which fields a data source keeps. Try again."

**S12 — A source that is not a GIS subscription** (proves R7)
- Given a Key facts field supplied by a data source of another kind, and a report that names a value for it
- When the reading comes back
- Then the change is shown as kept, naming that source

## UAT script

Run against the stand-in for `gis-data-sources`; the tester needs a way to set what it answers and to read what it was handed. With the real feature, step 9 is checked in the GIS system.

Preconditions: signed in as someone who can edit Deer Creek (see `../fixtures.md`, The person). Nothing has been imported to Deer Creek. The test environment serves the recorded sample `deer-creek-key-facts-2025.pdf`. The stand-in says a subscription named "Enterprise project boundaries" supplies Deer Creek's Timeline and County, and that it is authoritative.
Test data: `../fixtures.md`: the key facts sample, rows F1, F2 and F3; Deer Creek's Key facts. The sample is to be made, and so is the stand-in. No sample has a field with two values, a reading of kept fields only, or a source of another kind.
Reset: reset the sample project in the test environment, and set the stand-in back to authoritative.

| # | Do this | You should see |
|---|---|---|
| 1 | Open the Deer Creek project page and note the Key facts section | Timeline 2023–2027; County El Dorado |
| 2 | Press "Import a report", choose `deer-creek-key-facts-2025.pdf`, press "Read it" and wait | The check step; the tally "1 ready to add · 2 kept by a data source"; the action "Add 1 change" |
| 3 | Find the "Timeline" change | The badge "Kept by a data source"; "2023–2025"; "Enterprise project boundaries has 2023–2027. Change it there."; no "Was …" and no checkbox |
| 4 | Find the "County" change | The badge "Kept by a data source" and not "Already on file"; "Kept by Enterprise project boundaries. Change it there."; no checkbox |
| 5 | Press "Add 1 change" and look at the Key facts section | The project page; Timeline 2023–2027; County El Dorado |
| 6 | Reset the sample project, set the stand-in to not authoritative, and import the same file again | The tally "2 ready to add · 1 already on file" |
| 7 | Find the "Timeline" change | Ticked; "2023–2025", "Was 2023–2027" and "Also sent to Enterprise project boundaries."; no "Kept by a data source" badge |
| 8 | Press "Add 2 changes" and look at the Key facts section | Timeline 2023–2025 |
| 9 | Read what the stand-in was handed | Deer Creek, Timeline, 2023–2025 |

On the prototype: the kept state shows only after the GIS prototype's settings are changed in the browser (the project source set to the seeded subscription, and County added to its field mapping); then read the sample funder report. Steps 6 to 9 cannot be walked there.

## Open questions

None open. The story rests on these proposed answers:

- Q-126 (proposed) — R1 to R3, S1 to S5: no "Was …" on a kept change, the line that names the record's value, plain text, kept wins over a flag, "Nothing to add".
- Q-72 (proposed) — R4, S6: a field of a subscription that is not authoritative is an ordinary change with one line naming the source. Its part (b), Undo, is story 41's.
- Q-58 (proposed) — R5, S7: the edit is handed over when it is saved, not at publish. Narrows spec #24.
- Q-59 (proposed) — R5: a failed send never undoes the save, and this story shows nothing of it.
- Q-127 (proposed) — R6, S10, S11: one source for a field, a custom field can be kept, no answer means ordinary, and kept is asked again at the press.
- Q-56 (proposed) — R7, S12: only a GIS subscription has the authoritative setting; any other source keeps its fields.

Not applied: Q-17's proposal to move this story to the later release. The user approved it as `first` against a stand-in.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown; proposed (Q-126) | STA-16, RUL-18, RUL-69; RUL-152, RUL-153; RUL-311 |
| R2 | shown; proposed (Q-126) | STA-16, RUL-156; RUL-311 |
| R3 | decided; proposed (Q-126) | RUL-18; RUL-311; relies on story 06, STA-20 |
| R4 | decided, not built; proposed (Q-72) | RUL-69; RUL-312 |
| R5 | decided, not built; proposed (Q-58, Q-59) | RUL-69; RUL-313 |
| R6 | shown; proposed (Q-127) | STA-16, RUL-154, RUL-155; RUL-314 |
| R7 | decided (spec #27); proposed (Q-56) | RUL-18, RUL-69 |
- Wording provisional: "Also sent to `<source name>`." (R4) and "Couldn't check which fields a data source keeps. Try again." (R6).
- Prototype files: `src/components/projects/firma2-project-report-import.astro` (which fields are kept, 623-632; a kept change left out of what can be added, 398-399; the badge, "Was …" and the line, 770-771 and 780-783; no checkbox, 812-816); `src/lib/work-areas.ts` and `src/data/firma2-geography.ts` (where the prototype reads which Key facts a workspace data source keeps; the Timeline row tied to either year at 727-734).
- Data shapes, as the prototype models them: "kept" is a state the page works out for a Key facts change from the field and the workspace's source mapping. It is not a field of the reading.
- The prototype differs from the requirements in these: a kept change whose value differs shows "Was …" (R1); a field that becomes kept while the check step is open is still added (R6); a kept change that was also flagged would carry both badges (R2); its tally counts a kept field whose value equals the record's twice (R2).
- Do not copy: every field the first GIS subscription maps is treated as kept, for every project, read from a browser-local setting; there is no authoritative setting, no second source, no change from a source that is not authoritative, and nothing is sent to a GIS system.

</details>
