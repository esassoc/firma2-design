# 82 — An Administrator agrees to reading by an outside AI service and turns it on or off for the workspace

Type: story
Epic: A — Import a report
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-162, Q-163, Q-164, Q-165, Q-89
Revision: 1
Blocked by: none
Covers: OBJ-6, SCR-6, RUL-421, STA-38, RUL-422, RUL-423, RUL-424, RUL-425, RUL-426, RUL-427
Sources: not in the prototype; spec #41, #42; interview 2026-11-23, Q-52
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: R1 to R10, once `users-and-security` can say who is an Administrator of a workspace; until it can, against a stand-in that answers that one question. Against a stand-in for the operator's means of making a workspace unavailable, which has no screen in the first release: R8 and R9. Built here, not showable until story 83: what the setting does to Import a report (R6, R7). Nothing waits on a question.

## Story

As an Administrator, I want to read what it means to have reports read by an outside AI service, agree to it for my workspace and turn it on, and turn it off again, so that our documents go to an outside provider only when we have chosen that.

## Description

Import a report sends a document to an outside AI service to be read. Whether a workspace allows that is the workspace's choice (spec #41): the setting is off until an Administrator agrees and turns it on, the Administrator can turn it off again, and it can be made unavailable to a workspace whose terms do not allow its documents to go to an outside provider. This story is the setting and the place it lives. Story 83 is what everyone else sees while it is off or unavailable; every other story of the feature assumes it on (SR-9). Not yet prototyped: the workspace settings pages exist, and nothing on them holds this setting.

## Requirements

R1. Each workspace has one setting, reading by an outside AI service, in one of three states: off, on, unavailable. It is off for every workspace until an Administrator of that workspace turns it on. It is the same on every plan.

R2. The setting is on the Security page of workspace settings, in a section of its own headed "Reading by an outside AI service". The section is not under any plan lock. It always shows the saved state: "Off", "On" or "Not available".

R3. Only an Administrator of the workspace sees the section and can change the setting. Nobody else is shown it, by any route.

R4. While the setting is off, the section states what turning it on means, before the control can be used:
- reports and pasted text that people give to Import a report are sent to an outside AI service to be read;
- with each document go the project's performance measures (their units, breakdown questions and options), its closed reporting periods and its fields; nothing about the project's funding sources or contacts, or the workspace's organizations and people, is sent;
- neither the product nor the provider keeps the document once it has been read.
The statement is the product's own and is the same for every workspace.

R5. Turning the setting on takes an agreement. The section has a checkbox, "I agree to this on behalf of this workspace", and an action, "Turn on". "Turn on" cannot be pressed until the checkbox is ticked. Pressing it sets the state to on and records who agreed and when; the section then shows "On" and the line "Turned on by `<who>` · `<day>`".

R6. Once the setting is on, Import a report is offered in the workspace as the other stories say, to everyone who can edit a project, from their next page load. Nobody has to sign in again.

R7. While the setting is on, the section has an action, "Turn off". Pressing it sets the state to off, with no agreement asked; the section then shows "Off", the line "Turned off by `<who>` · `<day>`", and the statement and controls of R4 and R5 again. From that moment no document is sent to be read for the workspace.
- What was already added stays on the record as it is, with each change's document name and quote.
- A reading that had already come back can still be added, and a reading already under way finishes and can be added, because nothing more leaves the workspace (proven in story 83).
- Turning it on again takes the agreement again, and records the new person and day.

R8. While the setting is unavailable, the section shows "Not available" and one line with the reason, "This workspace's terms do not allow documents to be sent to an outside service." It offers no checkbox and no action, and nothing an Administrator can do in the workspace changes the state.

R9. Only the product's operator makes the setting unavailable for a workspace, or available again, from outside the workspace's own settings. There is no screen for it in the first release.
- A workspace made unavailable while the setting was on is treated as turned off from that moment (R7).
- A workspace made available again is off, not on: an Administrator agrees and turns it on as R5 says.

R10. When a change to the setting cannot be saved, the state stays as it was and a message by the control says so and to try again. When another Administrator has changed the setting since the page was opened, the press changes nothing and the section shows the state as it now is.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- What a person who can edit a project sees while the setting is off or unavailable, the check on "Read it", and adding from a check step already open — story 83.
- Who is offered Import a report while the setting is on — story 12.
- The line on the choose step that says the document is read by an outside AI service — story 01 (R15).
- What the reading service is sent and what it keeps — enabler 02 (R4, R5).
- The terms between the product and the provider, and any client's own terms: not part of the product. A client-specific text, if one is ever needed, is kept outside this repository.
- A screen for the product's operator — not in the first release.
- The other sections of the Security page, and its plan lock — `users-and-security` and `plans`.

## Needs to know from elsewhere

- Who is an Administrator of a workspace, and that only Administrators open workspace settings — owned by `users-and-security`. This story asks one thing of it: is this person an Administrator of this workspace.
- Workspace settings, the Security page and how a settings control saves (at once, with no Save button) — owned by `users-and-security`; this story adds one section to that page.
- The file is not kept: no story stores a document once its reading has ended (SR-10, spec #42). R4's third line states that to the Administrator.
- What is sent with a document — owned by enabler 02 (R5). R4's second line states it; if enabler 02's list changes, the statement changes with it.
- Import a report is on every plan — owned by story 12 (R2). So this section is outside the Security page's plan lock.

## Scenarios

No sample holds a workspace that is off by default or unavailable; `../fixtures.md` gives the sample workspace with the setting on. The scenarios describe the other workspaces by kind.

**S1 — Off until someone turns it on** (proves R1, R2)
- Given a workspace in which nobody has changed the setting
- When an Administrator opens the Security page of workspace settings
- Then a section headed "Reading by an outside AI service" shows "Off"

**S2 — Nobody but an Administrator sees it** (proves R3)
- Given a Contributor who is a Manager of an organization in the workspace, and is not an Administrator
- When they look for the setting, by the product's menus and by the Security page's address
- Then they are shown no section headed "Reading by an outside AI service" and no control for it

**S3 — What turning it on means is stated first** (proves R4)
- Given the setting is off
- When an Administrator reads the section
- Then, above the control, it says that reports and pasted text are sent to an outside AI service to be read, what goes with each document and what does not, and that neither the product nor the provider keeps the document

**S4 — No turning on without agreeing** (proves R5)
- Given the setting is off and the checkbox "I agree to this on behalf of this workspace" is not ticked
- When an Administrator tries to press "Turn on"
- Then it cannot be pressed, and the section still shows "Off"

**S5 — Agreeing and turning on** (proves R5)
- Given the setting is off
- When an Administrator ticks the checkbox and presses "Turn on"
- Then the section shows "On" and "Turned on by `<their name>` · `<today>`", and the action is now "Turn off"

**S6 — On for the whole workspace** (proves R6)
- Given an Administrator has just turned the setting on
- When a second Administrator of the same workspace opens the Security page
- Then the section shows "On" and the first Administrator's name and day

**S7 — Turning off** (proves R7)
- Given the setting is on
- When an Administrator presses "Turn off"
- Then no agreement is asked, and the section shows "Off", "Turned off by `<their name>` · `<today>`", the statement, the unticked checkbox and "Turn on"

**S8 — Turning on again takes the agreement again** (proves R7)
- Given the setting was on, and an Administrator has turned it off
- When they look at the section
- Then the checkbox is unticked and "Turn on" cannot be pressed until it is ticked

**S9 — Unavailable** (proves R8)
- Given a workspace the product's operator has made unavailable
- When an Administrator opens the Security page
- Then the section shows "Not available" and "This workspace's terms do not allow documents to be sent to an outside service.", with no checkbox and no action

**S10 — Made unavailable while on** (proves R9)
- Given a workspace whose setting is on
- When the product's operator makes it unavailable, and an Administrator then opens the Security page
- Then the section shows "Not available", with no action

**S11 — Available again is off** (proves R9)
- Given a workspace that was on, then made unavailable
- When the product's operator makes it available again, and an Administrator opens the Security page
- Then the section shows "Off", with the statement, the unticked checkbox and "Turn on"

**S12 — A change that cannot be saved** (proves R10)
- Given the setting is off, the checkbox is ticked, and the save will fail
- When an Administrator presses "Turn on"
- Then the section still shows "Off", and a message by the control says the change was not saved and to try again

## UAT script

Steps 7 and 8 need a second workspace that the operator has made unavailable (to be made); until one exists, stop after step 6.

Preconditions: two accounts in the sample workspace: an Administrator, and a Contributor who is not an Administrator. The sample workspace starts with reading by an outside AI service on (see `../fixtures.md`). For steps 7 and 8, an Administrator account in a second workspace that has been made unavailable.
Test data: no document is read. The accounts and the second workspace are to be made; no sample holds them. What the setting does to Import a report is seen in story 83.
Reset: none needed. The script ends with the setting on, as it started.

| # | Do this | You should see |
|---|---|---|
| 1 | Sign in as the Administrator and open Workspace settings, then Security | A section headed "Reading by an outside AI service" that shows "On", a line saying who turned it on and when, and a button, "Turn off" |
| 2 | Press "Turn off" | No question asked. The section shows "Off" and "Turned off by" your name and today. Under it: what turning it on means, a checkbox "I agree to this on behalf of this workspace", and a button, "Turn on" |
| 3 | Read the statement | It says documents are sent to an outside AI service to be read, what goes with each document and what does not, and that the document is not kept |
| 4 | Try to press "Turn on" without ticking the checkbox | It cannot be pressed; the section still shows "Off" |
| 5 | Tick the checkbox and press "Turn on" | The section shows "On" and "Turned on by" your name and today |
| 6 | Sign in as the Contributor and look for Workspace settings and its Security page | No section headed "Reading by an outside AI service" anywhere |
| 7 | Sign in as the Administrator of the second workspace and open Workspace settings, then Security | The section shows "Not available" and "This workspace's terms do not allow documents to be sent to an outside service." |
| 8 | Look for a way to turn it on | No checkbox and no button in the section |

## Open questions

None open. Four points the decision (spec #41) leaves to be settled were raised as questions Q-162 to Q-165, each with a proposed answer in `../../../open-questions.md`; the story is written on the proposals:

- Q-162 (proposed) — who makes the setting unavailable, and where: the product's operator, outside the workspace's settings, with no screen in the first release; unavailable while on acts as off, and available again is off (R8, R9, S9 to S11).
- Q-163 (proposed) — which settings page holds the control: the Security page, in a section of its own outside the plan lock (R2, R3, R10, S1, S2, S12).
- Q-164 (proposed) — the text an Administrator agrees to and how agreeing is given and recorded: the product's own three-line statement, a checkbox, and who and when shown in the section (R4, R5, R7, S3 to S5, S8). A client's own terms are not in the product.
- Q-165 (proposed) — what turning off does to work under way: no document is sent from that moment; a reading already back or under way can still be added (R7; proven in story 83).
- Q-89 (proposed) — what is sent with a document, which R4's statement repeats (R4, S3).

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided (spec #41) | OBJ-6 |
| R2 | proposed (Q-163) | SCR-6 (not yet prototyped) |
| R3 | decided (spec #41); proposed (Q-163) | RUL-421 (not yet prototyped) |
| R4 | decided (spec #41); proposed (Q-164); proposed (Q-89); decided (spec #42) | STA-38 (not yet prototyped) |
| R5 | decided (spec #41); proposed (Q-164) | RUL-422 (not yet prototyped) |
| R6 | decided (spec #41) | RUL-423 |
| R7 | decided (spec #41); proposed (Q-164); proposed (Q-165) | RUL-424 (not yet prototyped) |
| R8 | decided (spec #41); proposed (Q-162) | RUL-425 (not yet prototyped) |
| R9 | proposed (Q-162) | RUL-426 (not yet prototyped) |
| R10 | proposed (Q-163) | RUL-427 (not yet prototyped) |
- Wording provisional: every string in this story. The heading, the three state words, the checkbox, "Turn on", "Turn off", the two "Turned … by" lines and the reason line of R8 are placeholders for the microcopy pass; R4 gives the three facts the statement must state, not its sentences.
- Prototype files: none hold the setting. The page it joins is `src/pages/prototypes/workspace-settings/security.astro` (its sections are in `src/components/settings/firma2-workspace-security.astro`, inside a plan lock this section must sit outside of).
- Data shapes: none modelled. The setting needs a state (off, on, unavailable) and, for on and off, who set it and when.
- The Security page's own header comment lists "AI and compliance toggles" among the things cut from it. Spec #41 is the later decision; Q-163 is where the user confirms the page or names another.
- Do not copy: nothing; there is nothing to copy.

</details>
