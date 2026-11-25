# 13 — Only people the "Manage classifications" setting lets in see the edit buttons

Type: story
Epic: E-A Set up and arrange the classification tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-216, Q-217, Q-218
Revision: 1
Blocked by: 03, 04
Covers: ACN-15, ACN-16, RUL-30, RUL-31
Sources: `/prototypes/classifications/<classification>`, `/prototypes/classifications/groups/<group>`, `/prototypes/workspace-settings/classifications`; spec #11; interview 2026-11-24, Q-180; `docs/roles-and-permissions.md`
Snapshot: not yet captured
Read with: `../epics/E-A-set-up-the-tree.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R10. Waiting: nothing; R8 to R10 rest on proposals (Q-216, Q-217, Q-218).

## Story

As a reader of a classification or a group, I want to see the edit button only if I may change classifications, and as an administrator I want everyone else kept out of the settings, so that nobody is invited to do something they cannot, and nobody changes the tree who should not.

## Description

A classification's page and a group's page only read. Each has one door in its top bar, "Edit classification" or "Edit group", that opens that record's page in Workspace settings (stories 03 and 04). Who may use it is the Security setting "Manage classifications": Administrators by default, and a workspace can open it wider. Anyone the setting does not let in is shown no door and cannot open any Settings › Classifications page, even by typing its address. Reading stays open to every signed-in reader. To see the doors in the prototype, open `/prototypes/classifications/<a classification>` (any sample); the prototype shows the door to everyone and checks nothing, so the hiding is not visible there.

## Requirements

R1. A classification's page has a button "Edit classification" in its top bar for a person the setting lets in. It opens that classification's page in Workspace settings (story 03).

R2. A group's page has a button "Edit group" in its top bar for a person the setting lets in. It opens that group's page in Workspace settings (story 04).

R3. A person the setting does not let in sees neither button: it is absent, not greyed out or explained, and nothing in its place; the rest of the top bar is as before. (standing requirement SR-5)

R4. The setting "Manage classifications" decides who is let in. Administrators are always let in. The setting starts at Administrators only and a workspace may widen it, in the order the Security page offers its options, to include managers or contributors. A Viewer is never let in, with no organization or with one. The options and their meaning are owned by `users-and-security`; this story says "anyone the setting lets in".

R5. Every address under Settings › Classifications (the list, a classification's page, a group's page) is closed to a person the setting does not let in: it shows no settings content and says "You don't have permission to change classifications." with a link back to the Classifications page. The link's text uses the workspace's own word for Classifications.

R6. The reading pages stay open to every signed-in reader, whether or not the person is let in: a classification's page and a group's page show all of their content to a person without the button, and the pages never edit in place for anyone. (standing requirement SR-5; story 14 and story 21 own the content)

R7. When the setting is changed, the next time a page loads it shows or hides its button, and an address opens or closes, by the new setting.

R8. A person whose access is withdrawn while a settings page is open, and who then saves a change, is refused: nothing is saved, and the permission page of R5 replaces the settings page.

R9. For a person who is let in but is not an Administrator, the Workspace settings navigation shows only Classifications, the section the setting lets them into.

R10. Where another page links to Settings › Classifications (the project form's Classifications field, the performance measure page's list of classifications that track it), a person the setting does not let in sees plain text, not a link.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The settings pages the door opens, and what is edited there — see stories 02 to 12.
- The wording and options of the Security setting itself, and how a "manager" or a "contributor" is told from the roles — owned by `users-and-security`.
- The other sections of Workspace settings, and who may open them — owned by `workspace-settings`.
- The public site's pages — owned by `public-site`.

## Needs to know from elsewhere

- The role model is fixed (Administrator, Contributor, Viewer; Manager is a per-organization flag); no story adds a role or permission — `docs/roles-and-permissions.md`.
- Every reader signed in, in any role, may read the Classifications pages; a Viewer with no organization sees the public's figures — owned by story 22.
- The Security setting's options and their wording belong to `users-and-security`; the roles document and the prototype name the widest option differently ("Everyone except viewers", "Administrators and contributors").
- The record's page in Workspace settings exists for a classification (story 03) and for a group (story 04).

## Scenarios

**S1 — An Administrator sees "Edit classification"** (proves R1)
- Given Ada (F5) and the setting at its default
- When Ada opens the page of "Salmon & steelhead recovery"
- Then the top bar has "Edit classification"; pressing it opens that classification's page in Workspace settings

**S2 — An Administrator sees "Edit group"** (proves R2)
- Given Ada and the setting at its default
- When Ada opens the page of "Practice area"
- Then the top bar has "Edit group"; pressing it opens that group's page in Workspace settings

**S3 — A Contributor sees neither** (proves R3, R4)
- Given Cam (F5) and the setting at its default
- When Cam opens the page of "Salmon & steelhead recovery" and the page of "Practice area"
- Then neither page has "Edit classification" or "Edit group", and nothing stands in their place

**S4 — A Viewer sees neither** (proves R3, R4)
- Given Vera and Noor (F5) and the setting at its default
- When each opens the same two pages
- Then neither sees an edit button

**S5 — Opening the settings by address** (proves R5)
- Given Cam and the setting at its default
- When Cam opens the address of Settings › Classifications, then of "Salmon & steelhead recovery"'s settings page, then of "Practice area"'s
- Then each shows "You don't have permission to change classifications." with a link back to Classifications and none of the settings content

**S6 — Widening the setting lets Contributors in** (proves R4, R7)
- Given the setting widened to include contributors
- When Cam opens the page of "Salmon & steelhead recovery", presses "Edit classification", and then opens the settings list by address
- Then the button is there, it opens the classification's settings page, and the list opens

**S7 — A Viewer is not let in by any option** (proves R4)
- Given the setting widened as far as it goes
- When Vera opens a classification's page and the settings list by address
- Then there is no button and the permission message shows

**S8 — Narrowing the setting closes it again** (proves R7)
- Given the setting changed back to Administrators only and Cam signed in
- When Cam reloads the page of "Salmon & steelhead recovery"
- Then the button is gone

**S9 — Reading is open to everyone** (proves R6)
- Given Cam, Vera and Noor with the setting at its default
- When each opens the page of "Salmon & steelhead recovery" and of "Practice area"
- Then the summary, performance measures, projects and funders of each page are shown (Noor sees the public's figures, F6); no control on the page edits the record in place

**S10 — Access withdrawn while a settings page is open** (proves R8)
- Given Cam let in by the setting and on the settings list, and then the setting changed back to Administrators only
- When Cam renames a classification
- Then the rename is not saved and the page is replaced by "You don't have permission to change classifications." with a link back to Classifications

**S11 — A manager let in sees only Classifications** (proves R9)
- Given Max (F5, Manager) and the setting widened to include managers
- When Max opens a classification's page, presses "Edit classification" and looks at the Workspace settings navigation
- Then the navigation lists only Classifications

**S12 — Other links are plain text** (proves R10)
- Given Cam with the setting at its default
- When Cam opens a performance measure's page that lists the classifications tracking it, and the project form
- Then the classification names and the Classifications field's pointer to settings are plain text, not links; for Ada they are links

## UAT script

Preconditions: stories 03 and 04 are built (the doors lead to their pages). Ada (Administrator), Cam (Contributor), Vera (Viewer) and Noor (Viewer with no organization) exist (F5); Security › Manage classifications is at its default (administrators only).
Test data: F1; F5; F6 (Noor).
Reset: set Security › Manage classifications back to its default.

| # | Do this | You should see |
|---|---|---|
| 1 | Sign in as Ada. Open Classifications, then "Salmon & steelhead recovery". | A top bar with "Edit classification". |
| 2 | Press "Edit classification". | That classification's page in Workspace settings. |
| 3 | Open "Practice area" from Classifications. | "Edit group" in the top bar; it opens the group's settings page. |
| 4 | Sign in as Cam and open the same two pages. | Both pages read in full; neither has an edit button. |
| 5 | As Cam, open the address of Settings › Classifications. | "You don't have permission to change classifications." and a link back to Classifications. |
| 6 | As Ada, widen Security › Manage classifications to include contributors. Sign in as Cam; open "Salmon & steelhead recovery". | "Edit classification" is there and opens the settings page. |
| 7 | Sign in as Vera and open the same page, then the settings address. | No button; the permission message. |
| 8 | As Ada, set the setting back to its default. As Cam, reload the classification's page. | The button is gone. |

Exception: sign in as Noor and open "Salmon & steelhead recovery": the page shows the public's figures (F6), and no button.

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-216 (proposed) — A person the setting lets in who is not an Administrator: what do they see of Workspace settings?
- Q-217 (proposed) — Are the other links to Settings › Classifications hidden from people who are not let in?
- Q-218 (proposed) — What does a person see when a save is refused because their access was withdrawn while the page was open?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided, not built | ACN-15; RUL-30; RUL-31 |
| R2 | decided, not built | ACN-16; RUL-30; RUL-31 |
| R3 | decided, not built | RUL-31 |
| R4 | decided, not built | RUL-31 |
| R5 | decided, not built | RUL-31 |
| R6 | decided | RUL-30 |
| R7 | decided, not built | RUL-31 |
| R8 | decided, not built; proposed (Q-218) | RUL-31 |
| R9 | proposed (Q-216) | RUL-31 |
| R10 | proposed (Q-217) | RUL-31 |

- Prototype files: `src/pages/prototypes/classifications/[classification].astro` (line 91, the door), `src/pages/prototypes/classifications/groups/[group].astro` (line 86), `src/data/firma2-workspace-settings.ts` (the setting, key `perm-classifications`, label "Manage classifications", default `admins`; the options are `PERMISSION_AUDIENCES`), `docs/roles-and-permissions.md`.
- Data shapes: the setting holds one of three values, "admins", "managers", "editors", shown as "Only administrators", "Administrators and managers", "Administrators and contributors".
- Do not copy: the prototype shows the doors and opens every settings page to everyone and checks nothing; the Settings entry in the navigation and other links (the project form's field, the measure page) are plain links with no check. The "shown to everyone" state is a prototype artifact, not a requirement.

</details>
