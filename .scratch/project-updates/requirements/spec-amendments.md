# Spec decisions the proposals would amend — Import a report (project-updates, build 1)

Written 2026-11-23, when the proposed answers were written into the stories. For the user to confirm. **The spec has not been edited for any row of the first table**: each is a proposal, written into the stories as requirements tagged `proposed (Q-n)`, and becomes an amendment to `.scratch/project-updates/spec.md` only when the user validates it (`.scratch/proposed-answers.md`). Decision numbers are the spec's.

## Proposed amendments, awaiting confirmation

| Spec decision | What it says | What the proposal changes | Question | Stories |
|---|---|---|---|---|
| #5 | Every change carries one of three sources; the change log and the review show it the same way | Only a change from a document or a data source names its source. A hand edit shows who and when, and no source | Q-37 | 22, 24 |
| #8 | Three entries, one of them an item in the project page's "…" menu | The header entry is an always-visible icon; it sits inside "…" only under phone width (as built) | Q-30 | 08 |
| #9 | Proposes changes to performance measures, timeline, contacts, funding sources and named attributes | An import never sets the stage, the project type or the lead organization; those go to "Not used" | Q-65 | 15, 19 |
| #10 | Spend is skipped and the page says so | Everything the import did not use is listed; "Skipped" is a list, each part with a reason | Q-129 | 19 |
| #11 | A spatial file is handed to the existing Upload shapes flow, with a link | Only what Upload shapes takes (a .zip, up to 50 MB) is handed over; other spatial files get a box saying what Upload shapes needs | Q-106, Q-103 | 11, 08 |
| #12 | The document on one side, changes on the other; selecting a change shows its passage | Every file type is shown beside the changes: a PDF as itself, anything else as passages, on the check step only | Q-66 (b) | 04, 31 |
| #13 | Every proposed value is editable; an unsure reading is a flagged item to fill, never a pre-filled guess | A Key facts change and a contact are taken or left, not edited. A flagged change for a repeat, a period not offered or another project keeps its figure; only an unsettled figure arrives empty | Q-32, Q-33, Q-82, Q-99 | 07, 14, 15, 18, 32 |
| #14 | A contact is matched to an existing person by email or name | Matched by email; by name only when the report gives no email; never linked to an account | Q-34, Q-73, Q-128 | 18 |
| #15 | An organization not in the workspace is flagged; otherwise listed as not added | "Listed as not added" is the check step's own list: the change stays there unticked; nothing lists it after adding | Q-35 | 75, 19 |
| #18 | A toast offers Undo for everything that import added | Undo takes back only what is still as the import left it, says what stayed, and takes nothing back once any of it is published | Q-64, Q-75, Q-137, Q-157 | 23, 84, 41 |
| #20 | The existing warning stays when a report names another project | How the name is matched is fixed in code; such a report's changes arrive unticked; the import records it and the review tells the Manager | Q-74, Q-63, Q-130 | 20, 22, 24 |
| #24 | Workspace sources publish without review | "Without review" covers only values that originate in the GIS system; a hand edit sent back to it still waits for review before the public sees it | Q-58 | 16 |
| #31 (as amended by #42) | Each row shows its source | The row shows the document's name and the quote the change was read from; a hand edit's row shows no source | Q-45 (second half), Q-37 | 24, 85 |

## Already recorded in the spec

| Spec decision | What it records | From |
|---|---|---|
| #41 | Reading a report with an outside AI service is a workspace setting: off until an administrator agrees and turns it on; can be turned off; can be unavailable to a workspace. It narrows #21 ("available to anyone who can edit the project") to workspaces where the setting is on | the user, 2026-11-23, Q-52 |
| #42 | The file is not kept after the import is added or abandoned; pasted text likewise. Replaces #19 and amends #31. Still a proposal within it: that the document's name and each change's quote stay (Q-45) | the user, 2026-11-23, Q-45 |

## Interview answers the proposals narrow

Not spec decisions, but answers the user gave on 2026-11-23 that a proposal would narrow:

| Answer | What it says | What the proposal changes | Question |
|---|---|---|---|
| Q-62 | The reading's guards and unit conversion are requirements in a later release | Three checks move into the first release: a reporting period the project does not offer, a breakdown answer that is not an option, a Key facts value that does not fit its field | Q-114, Q-115, Q-71 |
| Q-26 | A spatial file is handed to Upload shapes in the first release | Only a .zip is handed over | Q-106 |
| Q-80 (the proposal itself) | A waiting reading holds its file for up to 7 days (later story 28) | Overridden by #42: the file goes when the reading ends; only the result waits | Q-173 |

Outside this feature's spec: the Security page's own earlier cut of "AI and compliance toggles" would be reversed by Q-163 (the setting of story 82 sits on that page).

Not amended: the approved map's "story 16 `first`". The proposal on Q-17 would move it to the later release; it was not applied.
