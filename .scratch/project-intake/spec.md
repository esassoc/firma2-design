# Project intake form

Status: ready-for-agent

Settled in a grilling session on 2026-10-19 (28 decisions). Mock content is invented.

## Problem Statement

A workspace has no way to start a project. The Projects index carries a New project button that goes nowhere, and nothing checks the "Create projects" permission. When a project does get created, the workspace has no say in what is asked first: its own facts (custom fields) can only be filled in afterwards on the project page, one field at a time, by whoever remembers to.

Administrators need to decide what a new project must tell them on day one: which built-in attributes, which of their own questions, in what order, on which screens, and which questions only matter given an earlier answer. Members need one clear path to propose a project that they can finish over several sittings. Stewards need to see proposals and accept or return them before they count in reports and on the public map.

## Solution

Each workspace has **one intake form**. An administrator builds it in a Tally-like form builder under Workspace settings › Intake form: the form is shown as members will see it, edited in place, with question types added from a right-hand sidebar, by dragging, or by typing `/`. Built-in project attributes and the workspace's own custom questions sit side by side; screens, rich-text blocks and light show-when logic shape the experience.

A member with "Create projects" presses New project, answers the first screen, and gets a **draft project** (Proposal stage, Draft status) with its own link. They fill the remaining screens in any order, over days if needed, and submit. The lead organization's steward approves it (it moves to Planning & Design and starts reporting) or returns it with a comment.

Free workspaces get no intake customization: the Intake form page stays, locked, showing a fixed six-question form and a call to upgrade. *(Revised 2026-10-19 — see .scratch/form-canvas/spec.md, decisions 18, 21–25.)*

## User Stories

### Administrator: building the form

1. As an administrator, I want an Intake form page in Workspace settings, so that I can find where new projects are defined.
2. As an administrator, I want the builder to show the form exactly as members will see it, so that I don't have to imagine the result.
3. As an administrator, I want to edit a question's label, help text and options by typing directly on the form, so that building feels like writing, not configuring.
4. As an administrator, I want the whole form in one scrolling canvas with a divider for each screen, so that I can see and rearrange everything at once.
5. As an administrator, I want to give each screen a title, so that members know what each step is about.
6. As an administrator, I want a right sidebar listing every question type I can add, grouped as Project attributes, Custom questions and Layout, so that I can see what's available without memorizing it.
7. As an administrator, I want to click a type in the sidebar to add it below the selected question (or at the end of the last screen), so that adding is one click.
8. As an administrator, I want to drag a type from the sidebar to any spot on the canvas, so that I can place it precisely.
9. As an administrator, I want to type `/` on an empty line to open the same list of types, filtered as I keep typing, so that I can build without leaving the keyboard.
10. As an administrator, I want a "+" on empty lines, as Custom pages has, so that the builder works the way the rest of the product does.
11. As an administrator, I want to drag questions, text blocks and screens to reorder them, including across screens, so that restructuring is direct.
12. As an administrator using a keyboard or switch, I want every drag to also be available as Move up / Move down / Move to top / Move to bottom from the item's grip, so that reordering doesn't require dragging.
13. As an administrator, I want name, project type, lead organization and classifications already on the form, required and impossible to remove, so that every project has what the data model needs.
14. As an administrator, I want to move the locked built-ins anywhere, so that the form can still open the way I want.
15. As an administrator, I want to add, require or remove the optional built-ins (description, location, start and completion year, estimated cost, tags, contacts), so that I ask only what my workspace needs up front.
16. As an administrator, I want each built-in to appear at most once, and to show as "In form" in the sidebar once placed, so that I can't ask the same thing twice.
17. As an administrator, I want to add custom questions of these kinds: text, long text, number with a unit, money, date, yes/no, choose one, choose several, so that I can ask my workspace's own questions.
18. As an administrator, I want a new custom question to become a workspace custom field automatically, so that the answer has one home and appears on every project.
19. As an administrator, I want to reuse an existing custom field as a question instead of creating a duplicate, so that the same fact is never stored twice.
20. As an administrator, I want a choice question's options to belong to its field, so that every project picks from the same closed list and reports add up.
21. As an administrator, I want to add free rich-text blocks anywhere (headings, lists, links, images, files), so that I can explain, instruct or warn exactly where it helps.
22. As an administrator, I want to select a question and see its settings in the sidebar (required, show-when, field, unit), so that the canvas stays clean.
23. As an administrator, I want to mark any non-locked question required, and see required questions marked on the canvas as members will, so that what I build is what they get.
24. As an administrator, I want to give a question, text block or whole screen one condition — show only when an earlier yes/no or choice question is, or is any of, certain answers — so that members only see what applies to them.
25. As an administrator, I want to base a condition on project type or classifications, so that I can ask type-specific questions without maintaining separate forms.
26. As an administrator, I want the builder to only offer earlier questions as conditions, so that I can't create a loop or a condition on something not yet answered.
27. As an administrator, I want my edits saved as I go, so that I never lose work.
28. As an administrator, I want my edits to stay invisible to members until I press Publish changes, so that a half-finished form never reaches them.
29. As an administrator, I want to see that there are unpublished changes and when the form was last published, so that I know what members currently see.
30. As an administrator, I want Preview to open the real intake page with my unpublished changes, so that I can try the form as a member would.
31. As an administrator, I want to remove a question from the form without losing the custom field or any answers already given, so that cleaning up the form never deletes data.
32. As an administrator, I want to edit the message members see after submitting, with a sensible default, so that I can tell them what happens next.
33. ~~As an administrator on the free tier, I want the builder to offer only project attributes and screen titles.~~ *Superseded 2026-10-19 by .scratch/form-canvas/spec.md stories 18–21: the free tier gets a locked, read-only page with a CTA.*

### Member: proposing a project

34. As a member with "Create projects", I want New project to open a page with the form's first screen, so that starting is one click.
35. As a member, I want Continue on the first screen to create my draft project, so that my work is saved from then on.
36. As a member, I want my draft to have its own link, so that I can come back to it or send it to a colleague who has the missing figure.
37. As a member, I want to see the screens as steps with my progress, so that I know how much is left.
38. As a member, I want to move between steps in any order, so that I can fill in what I know first.
39. As a member, I want questions to appear and disappear as my answers make them relevant, so that I'm never asked something that doesn't apply.
40. As a member, I want a hidden question never to block me, even if it's required, so that I can submit what actually applies.
41. As a member, I want an answer to be dropped when the question it belongs to becomes hidden, so that my project doesn't keep a fact that no longer applies.
42. As a member, I want my drafts listed under my projects, marked Draft, so that I can find unfinished work.
43. As a member, I want my draft kept out of the Projects table, the map and reports, so that half-finished proposals don't show up as real work.
44. As a member, I want a review of my answers before submitting, so that I can catch mistakes.
45. As a member, I want Submit enabled only once every visible required question is answered, with each missing one shown, so that I know exactly what's left.
46. As a member, I want the administrator's message after submitting, so that I know what happens next.
47. As a member, I want my project page to show it's waiting for approval, so that I know where it stands.
48. As a member whose proposal was returned, I want the steward's comment at the top of my intake page, so that I know what to fix.
49. As a member whose proposal was returned, I want to edit and resubmit it, so that one round of feedback doesn't mean starting over.
50. As a member, I want to be notified when my proposal is approved or returned, so that I don't have to keep checking.
51. As a member filling the form on a phone, I want the intake page to work at phone width, so that I can propose a project from the field.
52. As a member working on a draft that the administrator changes, I want to see any newly added questions, so that what I submit matches the current form.

### Steward: approving

53. As a steward, I want to be notified when a proposal is submitted for my organization, so that proposals don't wait unseen.
54. As a steward, I want a Proposals list on my review page, so that approval lives where I already review work.
55. As a steward, I want to open a proposal and see every answer, so that I can judge it.
56. As a steward, I want Approve to move the project to Planning & Design, so that it starts reporting and can appear publicly.
57. As a steward, I want Return to send the project back to Draft with my comment, so that the member knows what to change.
58. As a steward, I want to move a proposal that won't go ahead to Deferred, using the existing stage change, so that nothing new needs learning.
59. As an administrator, I want to approve proposals for organizations without a steward, so that no proposal is stuck without an approver.

### Visibility and permissions

60. As a draft's creator, I want only me, administrators and the people I share it with to be able to open it, so that unfinished proposals stay private.
61. As a steward, I want submitted proposals for my organization to appear for me only once submitted, so that drafts don't clutter my queue.
62. As a viewer, I want New project absent, so that I'm not offered something I can't do.
63. As a member of a workspace whose projects come from a GIS subscription, I want New project absent, as it is today, so that a sync stays the only source of projects.

## Implementation Decisions

### Model

- **One intake form per workspace.** It holds an ordered list of screens; each screen holds an ordered list of blocks. Branching by project type into separate forms is out (it may come later — keep the model open to a form-per-type, but don't build it).
- **Block kinds:** built-in attribute, custom question, text block. A screen has a title and can carry a show-when condition. "New screen" is a layout action, not a block.
- **Built-in attributes** are the Project's own fields. Locked (always present, always required, movable, not removable): project name, project type, lead organization, classifications. Optional: description, location, implementation start year, completion year, estimated total cost, tags, contacts. Each appears at most once.
- **Custom questions reference workspace custom fields; they never copy them.** This is the same rule project types already follow: field definitions are workspace-wide and referenced. Creating a custom question in the builder creates the field; the field then appears in Custom fields and on every project's Details section, whatever its type.
- **Field kinds** grow from today's four (choice, number, date, text) to: text, long text, number (with unit), money, date, yes/no, choose one, choose several. Choice options stay on the field; there is no separate option-list library.
- **"Required" belongs to the question on the form**, not the field. Custom fields don't model required-ness today and should not gain it here.
- **Show-when condition:** at most one per question, text block or screen: `{ sourceBlock, operator: 'is' | 'is-any-of', values }`. Sources are earlier yes/no and choice blocks only, including the built-ins project type and classifications. No AND/OR, no nesting. A hidden block is never required, and its answer is cleared when its condition stops holding.
- **Form lifecycle:** the builder edits a working copy that autosaves. Publish changes replaces the published copy. Members always fill the published copy; Preview renders the working copy. Drafts follow the published form as it changes; submitted projects keep their answers. Removing a block from the form never deletes a field or its answers.
- **After-submit message:** one editable rich-text message on the form, with a default saying the proposal is waiting for approval.

### Project lifecycle

- **No new stage.** An intake project lives in the existing Proposal stage, with a status: `draft` → `submitted` → (`returned` → `submitted`)* → approved. Approved moves it to Planning & Design. Deferred stays the existing stage change, not a status.
- **Draft visibility:** creator, administrators, and people the creator shares it with. Drafts are excluded from the Projects table, map and reports. They appear in the creator's projects marked Draft.
- **Approver:** the lead organization's steward; an administrator when the organization has no steward. Return requires a comment, which shows at the top of the intake page.
- **Permission:** the existing "Create projects" act gates New project, and this feature is its first real check. New project stays withheld when the workspace's project source is a GIS subscription.
- **Notifications:** steward on submit; submitter on approve or return; through the existing notification settings, no new channels.

### Surfaces

- **Workspace settings › Intake form** (settings mode, full width): the builder itself, not a summary page. Left: the settings rail as usual. Middle: the form canvas. Right: a sidebar docked to the window's edge, the same layout the project record uses for its rail.
- **Canvas:** in-place editing built on the same rich-text editing model Custom pages uses (what you type is what members read, no edit mode). Screens are dividers in one scroll. Reordering uses a grip that drags and also opens a Move menu, as the sortable lists do.
- **Right sidebar:** nothing selected → palette of types (Project attributes / Custom questions / Layout: New screen, Text block). Block selected → that block's settings (required, show-when, field picker or new field, unit). Back returns to the palette.
- **Adding a block:** click in the palette (inserts below the selection, else at the end of the last screen), drag from the palette, or `/` (and "+") on an empty line, which opens the same palette filtered by typing.
- **Top of the builder:** last published, unpublished-changes state, Preview, Publish changes.
- **Free tier:** the palette and slash menu show only Project attributes. Custom questions, New screen, Text block and show-when are absent, not disabled. Screen titles stay editable.
- **New project page:** an "add" page (adds are pages, never a modal) rendering screen 1 of the published form. Continue creates the draft.
- **Intake page for a draft:** the form's screens as steps with a progress bar; steps reachable in any order; a review step; Submit enabled when every visible required block is answered. A returned project shows the steward's comment at the top. It must work at phone width; the builder is desktop-first.
- **After submit:** the after-submit message, then the project page with a waiting-for-approval state in the header's status slot.
- **Proposals queue:** a Proposals list on the steward's existing review page, not a new app section. Opening one shows every answer with Approve and Return.

### Components

- Ecology has no form builder, stepper or wizard lego. The GIS subscription wizard is the closest prior art for stepping (one section per step, progress bar, resumable draft) and is the pattern to follow for the member's intake steps.
- New `firma2-` components for the builder canvas, palette/settings sidebar, slash menu, and the intake stepper. The stepper is generic enough to be a hub lego: file a `/request-lego` for an esa stepper, and build the spoke version so it can be swapped later.
- Inputs on the member's intake page are the bordered, labeled form legos (this is a form, not a record), not the borderless record fields.

### Sample content (invented)

A restoration workspace with three screens: **Basics** (name, type, lead organization, classifications, description); **Where and when** (location, start and completion year); **Funding and permits** (estimated cost, "Matching funds secured?" yes/no, "Needs permits?" yes/no, and "Which permits?" choose-several, shown when "Needs permits?" is Yes), plus one text block on the permits screen shown under the same condition.

## Testing Decisions

- The repo has no test runner. Verification is in a real browser (playwright-core with system Chrome, run from the scratchpad), measuring the rendered DOM and geometry rather than reading component properties.
- **One seam:** a pure intake-form module that owns the form definition and its rules — block placement, the at-most-once and locked-built-in rules, which blocks are visible given a set of answers, which answers are cleared, whether a draft can be submitted (and what is missing), and publishing the working copy. Builder, intake page and review queue all read through it. Browser checks drive the UI and assert outcomes at this seam's level: what a member sees for given answers, whether Submit is enabled, what the published form contains.
- Must verify: the sample form's condition shows and hides both "Which permits?" and its text block; a hidden required question doesn't block Submit; a cleared answer is gone after hiding; the locked four can be moved but not removed; a built-in can't be placed twice; Publish separates working and published copies; the free tier shows no paid controls; drafts are absent from the Projects table and map; the intake page fits at phone width; reordering works by keyboard.
- Prior art: the GIS subscription wizard (resumable steps) and Custom pages (in-place rich text) for behavior to match.

## Out of Scope

- Separate forms per project type (one form for now; may change).
- Conditions with AND/OR, nesting, or computed values.
- Public or accountless intake (applications from people without an account), spam protection, and applicant contact flows.
- A Decline action (Deferred covers it) and a "send back" state beyond Return.
- File-upload questions (files live in rich text).
- Version history of the form beyond working vs published copies.
- A builder that works at phone width.
- Changes to how updates and performance measures are reported after approval.

## Further Notes

- Relevant principles already in the product brief: "Setup is not a wizard" (why intake is a draft project with a link, not a one-sitting wizard); closed vocabularies keep reports true (why options live on shared fields).
- Design-principles restraint governs the builder's own chrome and microcopy, not what administrators write in their forms.
- Paid-tier gating follows the rule that a switched-off feature is truly removed.

## Comments
