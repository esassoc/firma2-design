# Proposals to validate — classifications

2026-11-24 · The only page you need to read. Updated the same day: Q-187 and Q-198 are answered (below). Reply with the Q-IDs you disagree with, with what you want instead; silence on the rest is acceptance. Each answer is written into `.scratch/open-questions.md`, the requirements are retagged, and the story map follows.

Full questions, with their context: `.scratch/open-questions.md`, section "classifications — nested groups". The inventory behind them: `.scratch/classifications/requirements/inventory.md`.

## Needs you

None. Every question has a proposal the stories can be written on.

## Answered since the first version

- **Q-187** — The pages inside the app count every project; only the public site counts published ones.
- **Q-198** — Importing a client's ProjectFirma 1.x taxonomy is out of scope; it will be scoped per client later.

## Worth a look

Most consequential first. Each one changes which stories exist, moves something to a later release, reverses what the prototype does, or is a low-confidence guess.

1. **Q-180** — Who may open Settings › Classifications and see "Edit classification" / "Edit group"? → Only people the "Manage classifications" setting lets in (administrators by default). Everyone else does not see the buttons, and a settings address opened directly says they lack permission. The prototype shows them to everyone. (high)
2. **Q-185** — Converting a group with "Remove them" when projects work toward its classifications? → "Remove them" is offered only when none of them is in use; otherwise only "Keep them" and "Cancel". The prototype removes them regardless. (medium)
3. **Q-161** — Converting, or dragging out of every group, a classification that projects use? → Goes ahead after a confirm that names the cost ("72 projects filed under it lose it. Its 3 performance measures stop tracking it."), as built. (medium)
4. **Q-182** — The "Add classification" and "Add group" pages? → Dropped. Every add is a row in place. (medium)
5. **Q-183** — The classification and group lists on a group's settings page? → Removed. The settings list does ordering and adding; the group page keeps details, parent group, colour and remove. (medium)
6. **Q-184** — The card board on a group's page? → Kept, as the group page's contents. (medium)
7. **Q-195** — Changing a classification's own colour? → Add a Color control to a classification's settings page, as a group has. The map and charts use it; lists use the group's colour. (medium)
8. **Q-156** — Groups as a map colouring and a dashboard dimension? → Every top-level group is offered, splitting by whatever sits directly inside it; deeper levels are not. (medium)
9. **Q-155** — Do the public see groups? → Not in the first release; the public sees classifications as today. (medium)
10. **Q-200** — Search or filter on the Classifications pages? → Not in the first release; folding and Browse's list narrow a tree of dozens. (medium)
11. **Q-181** — Spec decisions #15, #18, #19 and #22 no longer match what is built. → Correct them: keep the old text, mark each "replaced by #n", add one row for the settings list as built. Recorded with `decision-log` once you agree. (high)

Low-confidence guesses, in case you know better:

- **Q-201** — A Viewer with no organization sees the public site's figures on these pages, as the roles document already says; every other signed-in reader sees the all-projects figures. (medium)
- **Q-186** — Structure changes are recorded in the change log with who and when; no undo beyond the confirms. (low)
- **Q-188** — Two administrators at once: each change saves on its own, the last save wins, no locks. (low)
- **Q-189** — A name up to 100 characters, a description up to 300; no limit on depth or count. (low)
- **Q-194** — A removed record's page is the ordinary "not found" page with a link back. (low)
- **Q-197** — A retired performance measure leaves the pages but keeps its link and target. (low)

## Routine

**Rules about the tree**
- **Q-152** — A group's page shows no target; each measure reads reported against what its projects planned.
- **Q-153** — A group is removable only once it holds nothing; the page says what it still holds.
- **Q-154** — A group's name is unique across the workspace, ignoring case.
- **Q-196** — "In use" means any project that carries it, in any stage, published or not.
- **Q-190** — Lists start in the order things were created; nothing sorts by itself; "Sort A to Z" is on demand.

**Screens and states**
- **Q-192** — A link ending `#g:` or `#c:` opens Browse on that record; Outline has no per-row link.
- **Q-193** — Nothing set up: the Classifications page says "No classifications yet" (with a link to Settings for people who may set up); the settings list says "No groups yet. Add one to start."

**Failure and notifications**
- **Q-199** — A save fails: the row returns to where it was and a message says "Couldn't save the change. Try again."
- **Q-191** — No notifications for tree changes.

## Already answered by a written decision, so not asked

Sort A to Z does not reach into nested groups (spec #27). A classification is always in a group, and out of every group it becomes a group (spec #25). The tree is free: no levels, no depth rule, no groups-or-classifications rule (spec #20). Per-year interim targets are not part of this feature (the settings page's own header, "Cut").

## Added by the stories pass, 2026-11-24 (Q-202 to Q-233)

The story writers found thirty-two places the prototype and the record were silent. Each has a proposed answer, written into the stories as a requirement tagged `proposed (Q-n)`. Reject one and its stories change. Full text and context: `.scratch/open-questions.md`, "Stories pass".

**Needs your eye first (the answer changes what readers see)**
- **Q-233** — Does a Viewer who belongs to an organization see published-only figures? Proposed: yes, every Viewer does (the roles document says a Viewer "reads published values everywhere"). Your Q-201 answer covered only a Viewer with no organization. Medium.
- **Q-231, Q-232** — A published-only reader sees the same groups and every linked measure, counted over published projects only; 0 where nothing is published. Low.
- **Q-230** — A line under the page title, "Figures count published projects only." Medium.
- **Q-212, Q-214** — Converting a classification that has only measures asks first; a project left with no classification is allowed after the confirm, which says how many. Medium and low.
- **Q-224** — Folding a group that holds Browse's chosen row is allowed; "never hidden" means opened into view when chosen. Medium.

**Routine (apply unless you object)**
- Settings list: Q-202 refused add row drops on leaving with one message; Q-203 descriptions under every group and row; Q-211 folds stay on the device; Q-213 a converted row goes to the end of its list.
- Measures and goals: Q-204 "Every performance measure is already tracking this classification"; Q-205 a retired linked measure stays in the editor, marked; Q-206 a target is above 0 and at most 1,000,000,000.
- Remove and move: Q-207 the confirm names the measures and targets that go too; Q-208 the rule is checked again at confirm; Q-209 a folded group is not a drop place; Q-210 over a row, top half is before and bottom half is after; Q-215 wording when classifications beneath are in use.
- Doors: Q-216 a person let in sees only Classifications in Workspace settings; Q-217 other links to the settings are plain text for others; Q-218 a refused save shows the permission page.
- Reading: Q-219 catalog order for measures; Q-220 "Not reported" with "No goal set"; Q-221 a unit mismatch is left out and listed for the administrator; Q-222 no due year on tiles; Q-223 a ring is not a keyboard stop; Q-225 a `#` link does not change the remembered view; Q-226 going back to Browse rewrites the address; Q-227 the peek says "No performance measures yet"; Q-228 "No projects yet."; Q-229 project rows by reported amount, largest first.
