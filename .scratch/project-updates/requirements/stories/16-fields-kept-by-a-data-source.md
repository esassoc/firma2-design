# 16 — A Contributor sees a Key facts field an authoritative data source supplies as kept

Type: story
Epic: B — What a report can change
Release: first
Status: needs-info
Revision: 1
Blocked by: 15
Covers: STA-16, RUL-18, RUL-69, RUL-152, RUL-153, RUL-154, RUL-155, RUL-156
Sources: `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`; spec #16, #27, #40
Snapshot: not yet captured
Read with: `../epics/E-B-what-a-report-can-change.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (STA, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R4, R6 and R7, on a check step where stories 04, 06 and 15 are built (the tally, the checkbox and the Key facts change are used here, not built here), and only against a stand-in for the `gis-data-sources` feature (specified, not built) that answers, for a Key facts field of a project, whether a data source supplies it, whether that source is authoritative, and the source's name. R7 is built as stated; Q-56 may change it. Waiting: R5, sending an added change back to the GIS system, on `gis-data-sources`; the parts marked "Not decided" or "open", each on the question named beside it.

## Story

As a Contributor, I want a field that an authoritative data source supplies shown as kept, with the source named, so that I do not put a value on the record that the source will overwrite, and I know where to change it.

## Description

Story 15 proposes Key facts changes. Some Key facts fields are supplied by a data source, such as a GIS subscription, and each GIS subscription is either authoritative or not (spec #40). On the check step of Import a report, a field from an authoritative source is shown with what the report says and cannot be added. A field from a GIS subscription that is not authoritative is an ordinary Key facts change, and once added it is sent back to the GIS system. The prototype shows the kept state only, and only after its GIS settings are changed by hand; it has no authoritative setting. See `/prototypes/projects/deer-creek-riparian-corridor-enhancement/import-report`.

## Requirements

R1. When the report names a value for a Key facts field that an authoritative data source supplies, the change is shown as kept: the field's label, the badge "Kept by a data source", the value read, and the line "Kept by `<source name>`. Change it there." The line is text; nothing in it is a link. Like any change it shows its quote and can be selected to see its passage (story 04). Not decided: whether "Was …" is shown when the value read differs from the record's, and whether the line leads to the source (Q-126).

R2. Kept wins over "Already on file". A kept field is shown as kept even when the value read is the record's value: the badge is "Kept by a data source", no "Was …" is shown, and the tally counts it under "kept by a data source" and not under "already on file". A Key facts change is not flagged in the first release (story 15, R5), so kept meets no flagged state.

R3. A kept change cannot be added. It has no checkbox, it is never counted in "Add N changes" or under "ready to add", and adding the import leaves the field on the record as it was. When every change of a reading is kept, nothing can be ticked and the commit action reads "Nothing ticked" (story 06, R5). Not decided: whether those words are right when no change has a checkbox (Q-126).

R4. When the report names a value for a Key facts field that a GIS subscription supplies, and that subscription is not authoritative, the change is proposed like any other Key facts change. (open: Q-72)

R5. When a change of R4 is added, the new value is sent back to the GIS system as an edit to that field. Sending it is the `gis-data-sources` feature's, which is not built: this story hands over the project, the field and the value added, and shows nothing that comes back. (open: Q-58, Q-59)

R6. Whether a data source supplies a field, whether that source is authoritative, and the source's name come from the workspace's data sources. They are never taken from the reading.
- It applies to every Key facts field story 15 can propose. A Timeline counts as supplied when the source supplies either of its two years.
- It is worked out once, when the check step opens. Not decided: whether it is checked again when "Add N changes" is pressed (Q-127).
- Not decided: two sources that supply one field, a source that supplies a custom field, and a check step that opens before the answer is known (Q-127).

R7. A Key facts field supplied by a data source that is not a GIS subscription is shown as kept. (open: Q-56)

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- Proposing a Key facts change, and adding one — story 15.
- Where a kept change sits among the others in its group — story 04, R4 (Q-67).
- Putting back, on Undo, a value that was already sent to the GIS system — story 41.
- The authoritative setting, which fields a subscription supplies, when an edit is sent back, which value stands when both sides changed, and a send that fails — `gis-data-sources`.
- Setting up a data source from this page — not in build 1.

## Needs to know from elsewhere

- `gis-data-sources`, not built. This story asks it, for a project's Key facts field: does a data source supply it, is that source authoritative, and what is the source called. It expects one answer for a field. For R5 it hands over the project, the field and the value added.
- A field is read-only by hand only when an authoritative source supplies it (spec #40, amending #27) — owned by `gis-data-sources`.
- How a Key facts change is listed, added and marked "Already on file", and that none arrives flagged — story 15 (R5, R6, R8).
- Each change that can be added has a checkbox; only ticked changes are added; with nothing ticked the commit action reads "Nothing ticked" — story 06 (R1, R5).
- The tally's fourth part, "`<N>` kept by a data source", left out when no change is kept — story 04, R2.

## Scenarios

No fixture has a field kept by a data source. The scenarios set Deer Creek up differently from the fixture's starting state, as each Given says. S2 uses the funder report's rows F1 and F2 only; the reading's other rows belong to other stories.

**S1 — A field an authoritative source supplies** (proves R1)
- Given Deer Creek's County is supplied by a GIS subscription named "Enterprise project boundaries" that is authoritative, and a report names a county other than the record's
- When the reading comes back
- Then the County change shows the label "County", the badge "Kept by a data source", the county read, and "Kept by Enterprise project boundaries. Change it there."

**S2 — Kept, not "Already on file"** (proves R2)
- Given the same subscription, and Deer Creek's County is El Dorado
- When the funder report's reading comes back
- Then F2 carries the badge "Kept by a data source" and not "Already on file", shows no "Was …", and the tally counts it under "kept by a data source" and not under "already on file"

**S3 — A kept change cannot be added** (proves R3)
- Given the check step of S1, where the County change has no checkbox
- When the Contributor adds the ticked changes
- Then the County on the project page is the one it held before

**S4 — A source that is not authoritative** (proves R4)
- Given a project's County is supplied by a GIS subscription that is not authoritative, and a report names a county other than the record's
- When the reading comes back
- Then the County change has a checkbox and no "Kept by a data source" badge

**S5 — An added change is sent back** (proves R5)
- Given the County change of S4
- When the Contributor adds it
- Then the GIS system receives the report's county as an edit to that field

**S6 — The reading does not decide what is kept** (proves R6)
- Given the subscription of S1, and a reading that returns the County change with nothing said about a data source
- When the check step opens
- Then the County change is shown as kept

**S7 — A source that is not a GIS subscription** (proves R7)
- Given a Key facts field supplied by a data source of another kind, and a report that names a value for it
- When the reading comes back
- Then the change is shown as kept, naming that source

**S8 — A Timeline with one year supplied** (proves R6)
- Given an authoritative subscription that supplies Deer Creek's completion year and not its start year
- When the funder report's reading comes back
- Then F1, "Timeline", is shown as kept, with no checkbox

## UAT script

Nothing here can be run on Deer Creek as the fixture sets it up, and none of it until a stand-in for `gis-data-sources` answers what R6 asks. Steps 5 to 7 need `gis-data-sources` built, for the setting and for the send; stop after step 4 until it is.

Preconditions: signed in as someone who can edit the project, and able to change a GIS subscription's settings. One GIS subscription supplies the project's County and is authoritative. Story 06 is built.
Test data: no fixture. A report that names a county other than the record's and at least one other change, with a recorded reading that proposes them.
Reset: not known (Q-88).

| # | Do this | You should see |
|---|---|---|
| 1 | Open the project page and note the County | Its value on the record |
| 2 | Press "Import report", choose the report, press "Read it" and wait | The check step, with a Key facts group first; the tally ends "1 kept by a data source" |
| 3 | Find the "County" change | The badge "Kept by a data source", the county from the report, "Kept by `<source name>`. Change it there." naming the subscription, and no checkbox |
| 4 | Add the ticked changes and look at the Key facts section | The project page; County as in step 1 |
| 5 | Set the subscription to not authoritative, then import the same report again and find the "County" change | A change with a checkbox, and no "Kept by a data source" badge |
| 6 | Tick it if it is not ticked, add the ticked changes and look at the Key facts section | County holds the report's value |
| 7 | Look up the project's county in the GIS system | It holds the report's value |

On the prototype: the kept state shows only after the GIS prototype's settings are changed in the browser (the project source set to the seeded subscription, and County added to its field mapping); then read the sample funder report. Steps 5 to 7 cannot be walked there.

## Open questions

- Q-56 — R7 and S7: if the authoritative setting reaches every kind of data source, R7 follows R1 and R4 instead of always showing the field as kept.
- Q-72 — R4, S4 and step 5: part (a), whether such a change says that its value will be sent to the GIS system.
- Q-58 — R5, S5 and step 7: whether the edit is sent when the change is added or only after a publish, so when step 7 can be checked.
- Q-59 — R5: what the person sees when the send fails.
- Q-67 — where a kept change sits in its group; this story assumes the reading's order.
- Q-88 — the Reset line, and how a recorded reading is served.
- Q-126 — would change R1, R3 and S1: "Was …" on a kept change, whether "Change it there." is a link, and the commit action's words when nothing can be ticked.
- Q-127 — would change R6 and the UAT's Preconditions: what `gis-data-sources` answers when two sources supply one field or a custom field, when the answer is late, and whether it is asked again on "Add N changes".

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided; shown | STA-16, RUL-18, RUL-69; RUL-152, RUL-153 |
| R2 | shown | STA-16; RUL-156 |
| R3 | decided | RUL-18; relies on story 06, STA-20 |
| R4 | decided, not built | RUL-69 |
| R5 | decided, not built | RUL-69 |
| R6 | shown | STA-16; RUL-154, RUL-155 |
| R7 | decided (spec #27) · open: Q-56 | RUL-18, RUL-69 |

- Prototype files: `src/components/projects/firma2-project-report-import.astro` (which fields are kept, 623-632; a kept change left out of what can be added, 398-399; the badge, "Was …" and the line, 770-771 and 780-783; no checkbox, 812-816); `src/lib/work-areas.ts` and `src/data/firma2-geography.ts` (where the prototype reads which Key facts a workspace data source keeps; the Timeline row tied to either year at 727-734).
- Data shapes, as the prototype models them: "kept" is a state the page works out for a Key facts change from the field and the workspace's source mapping. It is not a field of the reading.
- What the prototype does where nothing is decided (not requirements): a kept change whose value differs from the record's shows "Was …" (Q-126); a field that becomes kept while the check step is open is still added (Q-127); a kept change the reading flagged would carry both badges.
- Do not copy: every field the first GIS subscription maps is treated as kept, for every project, read from a browser-local setting; there is no authoritative setting, no second source, no change from a source that is not authoritative, and nothing is sent to a GIS system. The prototype's tally counts a kept field whose value equals the record's twice, as already on file and as kept; R2 says which it is.

</details>
