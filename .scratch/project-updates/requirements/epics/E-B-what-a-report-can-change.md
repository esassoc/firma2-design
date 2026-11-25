# E-B — A Contributor adds every kind of change a report supports, and settles the cases the reading could not

Feature: project-updates
Release: mixed
Status: needs-triage

## Goal

Beyond a clean performance measure entry, an import proposes Key facts, funding sources and contacts, and shows the Contributor what it left out and why. Where the reading could not decide, the change waits on the person, so that what goes on the record is what the report says. Each story adds one kind of change or one case to epic A's check step and can ship after A without the others.

## Actors

- Contributor (anyone who can edit the project: a Contributor on a project an organization of theirs leads, or an Administrator): sees each kind of change, fills or leaves out what was flagged, and sees what was not used.

## Decisions that shape every story

| Source | Decision |
|---|---|
| spec #9; interview 2026-11-23, Q-21, Q-27 | An import proposes four kinds of change only: performance measure entries, Key facts, contacts and funding sources. It never proposes the description, stage, photos or tags. Partner organizations are `later`. |
| interview 2026-11-23, Q-27 | A Key facts change can be for a built-in field or one of the workspace's custom fields, when the report names a value for a field the project has. Never the stage, the project type or the lead organization (proposed, Q-65). |
| spec #10 | Spend is never proposed. A budget or expenditure table is named once under "Skipped" with the reason. |
| spec #11 | A location is never proposed from a report. |
| spec #13; interview 2026-11-23, Q-25 | When the reading is unsure, nothing is written in: the change is flagged for the person to fill or leave out. A change is ready or flagged. No confidence level is shown and no suggested figure is offered. |
| spec #14 | A contact is added as a name, role, organization and email only. No invitation is sent and no account is created. |
| spec #15 | An organization is never created by an import. |
| spec #16, amended by spec #40 | A Key facts field an authoritative data source supplies is shown as kept and cannot be added. A field from a source that is not authoritative is proposed like any other. |
| spec #20; interview 2026-11-23, Q-26 | When the report names another project, the page warns and names it. First release. |
| inventory RUL-15 (shown) | Whether the record already holds a change is worked out from the record, never taken from the reading. |
| interview 2026-11-23, Q-62 | The reading's guards and unit conversion are requirements in a later release. The first release converts no unit and relies on the person checking each change. A figure in another unit arrives flagged and empty (proposed, Q-82). Three checks are brought forward into the first release: a reporting period the project does not offer, a breakdown answer that is not an option, a Key facts value that does not fit its field (proposed, Q-114, Q-115, Q-71). |
| proposed, Q-99 | The same thing twice: never saved twice by default. An exact repeat folds into one change or arrives unticked; two different values for one thing are both flagged; adding checks the record again. |
| proposed, Q-87 | A Key facts field, a funding source or a contact the record already holds has no checkbox; an entry already on file arrives unticked and can be ticked. |
| proposed, Q-110, Q-61 | The tally has five parts, each change in exactly one. There is one flagged badge, "Needs you". |
| proposed, Q-32 | Figures and funding sources can be edited on the check step; a Key facts change and a contact are taken or left. Amends spec #13. |

## Out of scope

- Choosing the document, waiting, ticking, adding, the toast and Undo — epic A.
- Correcting a performance measure change's amount, reporting period and breakdown answers — story 07 (epic A).
- Imported changes in the review — epic C.
- Row markers that read the "changed from the document's figure" and "filled in after an unsure reading" flags — `publish-review`, build 2.
- Data sources themselves (spec #22 to #29) — `gis-data-sources`; specified, not built.
- "Use suggestion" and the confidence badges — dropped (Q-25).
- A location change from coordinates in a report — not planned (spec #11). A spatial file is story 11 (epic A).

## Stories, by dependency

| # | Story | Type | Release | Blocked by | Wave |
|---|---|---|---|---|---|
| 19 | A Contributor sees what the report says that the import did not use, and why | story | first | 04, 02 | 4 |
| 20 | A Contributor is warned when the report names another project | story | first | 04, 02, 06, 22 | 5 |
| 32 | A Contributor sees an entry the record already holds as "Already on file" | story | first | 01, 02, 06 | 5 |
| 14 | A Contributor fills or leaves out a change the reading flagged | story | first | 06, 07, 02, 32 | 6 |
| 15 | A Contributor adds Key facts the report names | story | first | 04, 02, 32, 19 | 6 |
| 17 | A Contributor adds funding sources the report names and sees them on the project page | story | first | 06, 02, 32, 22, 81 | 6 |
| 18 | A Contributor adds contacts the report names, with no invitation sent | story | first | 04, 02, 32, 22, 81 | 6 |
| 13 | A Contributor sees a total to date filed as the difference from the record | story | first | 01, 02, 32, 14 | 7 |
| 16 | A Contributor sees a Key facts field an authoritative data source supplies as kept | story | first | 15 | 7 |
| 75 | A Contributor picks an organization for a funding source whose organization the workspace does not hold | story | first | 17, 30 | 7 |
| 65 | A Contributor is stopped before anything is added by an invalid funding source | story | first | 17, 30, 75 | 8 |
| 86 | A Contributor sees a funding source the record already holds with another amount as a change to that row | story | first | 17, 41 | 8 |
| 26 | Unit conversion: a figure in another unit is converted in code, or flagged | enabler | later | 02, 04, 13, 14 | later |
| 50 | Reading guards: what the model returns is checked against the project in code | enabler | later | 02, 07, 14, 15, 19 | later |
| 27 | A Contributor adds partner organizations the report names | story | later | 17, 41, 75, and a partner organizations section on the project page (`project-record`, later, not built) | later |

The table is in dependency order; "Wave" is the story's wave in the map's Build order. Enabler 02 (epic A) unblocks 13, 14, 15, 17, 18, 19, 20 and 32, and the `later` enablers 26 and 50. No story is blocked by enabler 26 or 50. Story 16 is `first` and is built and accepted against a stand-in for `gis-data-sources`, which is not built (the user's approval of 2026-11-23 stands; the proposal on Q-17 was not applied). Story 17 is not released without 65, 75 and 81 (epic A); story 18 not without 81. The later story 27 also waits on a partner organizations section on the project page (`project-record`, not built).

2026-11-23: answers written in; stories built on proposals awaiting the user's validation (see `.scratch/proposed-answers.md`). Scope changes that day: added 86, split from 17 (a funding source the record already holds with another amount). Blockers: 17 and 18 gained 81; 20 gained 06 and 22; 15 gained 19.

## Depends on other features

- `project-record`: Key facts fields that can be set from outside, the Funding sources table, the Contacts panel; a funding source stores its organization, not the organization's name.
- `performance-measures`: units, breakdown questions and options, closed reporting periods, the total reported to date.
- `custom-fields`: the workspace's custom fields and which of them a project has (story 15).
- `gis-data-sources`: which fields a data source keeps, whether the source is authoritative, and the source's name (story 16; spec #40). Not built: story 16 runs against a stand-in.
- `organizations-admin`, `users-and-security`: the workspace's organizations and people, to match a funder or a contact against (stories 17, 18); an organization a funding source names cannot be removed, and organization names are unique ignoring capitals.
- `publish-review`: an import over a hand edit of the same field, or two imports of one field, is one review row (story 15). Build 2: the row markers that read the two facts an import records about a change (enabler 36, epic A).

## Proposals these stories rest on

No question is open in any story of this epic. Each story is built on proposed answers awaiting the user's validation (`.scratch/proposed-answers.md`), and is `needs-triage` until they are validated. Listed here: every question a story of this epic cites in its Open questions section, with the stories that cite it, read from the story files on 2026-11-23. Q-45, Q-52 and Q-135 are the user's decisions; where a story lists one, it leans on the part still proposed. The words after each ID are the question's heading in `.scratch/open-questions.md`.

- Q-32 — Is every proposed value editable? (stories 15, 18)
- Q-33 — Does an unsure change arrive empty? (stories 14, 13, 26, 50)
- Q-34 — How is a contact matched? (story 18)
- Q-35 — An organization the person did not pick (stories 19, 75)
- Q-42 — Nothing to propose (story 19)
- Q-43 — A project with no performance measures, or no closed reporting period to file under (story 19)
- Q-45 — The kept document (stories 17, 18, 86)
- Q-46 — Is the reading itself kept? (story 19)
- Q-48 — Two people at once (stories 32, 15, 13, 86)
- Q-50 — A funding source already on the record with a different amount (story 86)
- Q-51 — Overwriting a hand edit (story 15)
- Q-56 — Does the authoritative setting apply only to GIS subscriptions, or to every data source? (story 16)
- Q-58 — A hand edit to a field a two-way subscription supplies: does it wait for publish review before it is sent to the GIS system, or go at once? (story 16)
- Q-59 — What does the person see when sending an edit back to the GIS system fails? (story 16)
- Q-61 — What does the one flagged state read as? (stories 14, 26, 50)
- Q-63 — When a report names another project, do its changes arrive unticked? (story 20)
- Q-65 — Which Key facts fields count as "built-in" for an import? (stories 19, 15)
- Q-66 — The reading service: three things the developer-machine reader leaves open (story 50)
- Q-68 — Keyboard focus on the Import a report page (story 65)
- Q-71 — A Key facts value that does not fit its field (stories 19, 15)
- Q-72 — A field a GIS subscription supplies (spec #40), on the check step and on Undo (story 16)
- Q-73 — A contact the report names with no email (story 18)
- Q-74 — "This report names another project": how is the name matched, and what if there are several? (story 20)
- Q-76 — After a publish, what of an import still shows? (stories 17, 18)
- Q-78 — If Q-33 follows the spec, how are two readings offered? (story 14)
- Q-79 — Partner organizations, the later story (Q-21) (story 27)
- Q-82 — A figure in another unit than the measure's, in the first release (stories 14, 13, 26)
- Q-83 — Two standing requirements with no written source (stories 20, 65)
- Q-87 — An entry the record already holds, on "Add N changes" (stories 32, 15, 17, 18, 86)
- Q-89 — The reading service, for the kinds of change the developer-machine reader does not return (story 14)
- Q-91 — A total to date that is lower than the record's (story 13)
- Q-92 — A flagged change that ticked itself, then was emptied (story 14)
- Q-95 — A converted figure under 0.01 (later release) (story 26)
- Q-96 — When does a message from the check on "Add N changes" go? (story 65)
- Q-98 — Asked once for the feature: do labels and sentences that contain a renameable noun take the workspace's word? (stories 19, 20, 17, 18, 75, 50)
- Q-99 — Asked once for the feature: the same thing twice. Can two identical entries both appear in a list, and what happens when one input holds the same thing twice? (stories 19, 32, 15, 18, 13, 86)
- Q-110 — The tally after the person ticks and unticks (story 32)
- Q-113 — What may be typed into an amount: a performance measure change's "Amount", and a funding source's "Secured ($)" and "Grant or program" (stories 14, 17, 65)
- Q-114 — The reporting period of a performance measure change, in two cases (story 14)
- Q-118 — Arithmetic the first release does, and how it is shown (stories 13, 26)
- Q-120 — What is a total to date compared with? (story 13)
- Q-121 — A total to date after the person acts on it (story 13)
- Q-122 — A flagged change the person has dealt with: do the badge and the reason go? (stories 14, 75, 65)
- Q-123 — Which typed figures tick an empty flagged change? (story 14)
- Q-124 — How exactly is a Key facts value compared with the record's? (story 15)
- Q-125 — A Timeline when the report states one year (stories 19, 15)
- Q-126 — What a change kept by a data source shows (story 16)
- Q-127 — What `gis-data-sources` answers, for a field kept by a data source (story 16)
- Q-128 — Contacts the reading returns incomplete, and a contact that matches two people (story 18)
- Q-129 — What "Not used" and "Skipped" must hold (story 19)
- Q-130 — After adding the changes of a report that names another project, is anything recorded? (story 20)
- Q-131 — Which organizations does "Organization" on a funding source change offer and match against, and in what order? (stories 17, 75)
- Q-132 — A funding source the report names with no organization, or with no amount (story 75)
- Q-133 — How a funding source's name and organization are matched: two rules nobody wrote down (stories 17, 86)
- Q-134 — Can a project's record hold a funding source whose organization the workspace does not hold? (story 17)
- Q-135 — Correcting by hand what an import added (stories 17, 18)
- Q-136 — Who may read the document's name? (stories 17, 18)
- Q-137 — "Undo" when what the import added has changed since, or cannot all be taken back (story 86)
- Q-138 — Two imports set the same Key facts field and both are taken back, the earlier first (story 86)
- Q-147 — A figure the document gives with no unit at all, once unit conversion is built (later release) (story 26)
- Q-148 — A total to date stated in another unit, once unit conversion is built (later release) (story 26)
- Q-149 — When a check in code quietly changes what the model returned, is the person told? (later release) (story 50)
- Q-150 — A Key facts change the checks turn away (later release): dropped, or listed under "Not used"? (story 50)
- Q-168 — What tells the person why "Add N changes" added nothing, when the record changed while the check step was open? (story 32)
- Q-169 — A repeat inside one reading whose entry the record also holds: which state shows? (story 32)
- Q-170 — A figure typed into an empty change that makes it an entry the record already holds: is the change ticked? (story 14)
- Q-171 — A change flagged for its reporting period (Q-114): does picking a period tick it? And a change with more than one reason? (story 14)
- Q-174 — What does the Funding sources table show for a row whose amount an import changed? (story 86)
- Q-175 — When an edit on the check step turns an "Already on file" funding source into something that can be added, is it ticked? (story 86)

