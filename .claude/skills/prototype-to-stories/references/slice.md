# Stage: slice

Cut the inventory into stories that are independent, testable and complete, and group them into epics only when the size calls for it. The output is an outline, one line per story, that the user approves before anything is written.

## Method, in order

1. **Boundary.** Remove everything the system map says another feature owns; list each by ID as a dependency. Remove items the interview marked `dropped`. When this feature owns a behavior that appears inside another feature's surface (a source shown on that feature's review rows), the story stays here and names that surface as a dependency.
2. **Actors and goals.** For each actor, list what they are trying to get done in this feature, as outcomes ("get last quarter's numbers onto the record"), not as screens.
3. **Backbone.** For each goal, lay out the steps the user goes through in order. This row of steps is the backbone of the map.
4. **Hang the inventory.** Place every remaining action, state and rule under the step it belongs to; objects and screens go with the first story that needs them, and actors are covered by the goals table. Anything that fits nowhere means a missing step or a missing goal.
5. **Walking skeleton.** Mark the thinnest path that takes one actor from the first step to the last with real value: one input type, the happy path, no options. That is the first user story, and everything else builds on it. It carries only the controls it makes work; a control whose behavior belongs to a later story arrives with that story. Write that once, as a standing requirement ("a control or case another story owns is absent or unhandled until that story ships"), so no story has to describe a half-built screen. If it cannot be demonstrated without a capability the prototype fakes, the enabler for that capability is numbered before it and blocks it.
6. **Candidate stories.** Under each step, group what one actor needs for one outcome.
7. **Split what is too big**, trying these cuts in this order and stopping at the first that yields pieces that each still deliver something a user can see:
   1. workflow step
   2. business-rule variation
   3. happy path vs exception
   4. input or data type
   5. role
   6. operation (create, view, edit, remove)
   7. surface (desktop, phone)
8. **Test each story.** It passes when all are true:
   - one actor, one goal;
   - it can be demonstrated on its own once its `Blocked by` stories exist;
   - it is blocked only by the skeleton, an enabler, or a named story, never by "the rest of the feature";
   - its own effect can be seen and tested with nothing but its blockers: if the only way to observe what it does is through a later story, the two are one story;
   - it would need at most about 12 scenarios (at outline stage, count its rules and states: more than about 15 is the signal to look again);
   - a tester could say pass or fail without asking what was meant.

   A story that fails goes back to step 7. A story with one or two trivial scenarios is merged into its neighbour, unless it differs in actor or in release (a `later` story is often one rule and stays separate).
9. **Enablers.** Each prototype artifact stands in for a real capability. Where that capability has no user-visible face (storage, an integration, a migration), make an enabler story. An enabler must name the stories it unblocks, in the map's Unblocks column; one that unblocks nothing is not needed yet.
10. **Standing requirements.** Rules every story must meet (accessibility, phone layout, audit, permissions pattern) go once in `<out>/standing-requirements.md`. Stories reference it. A rule that every story must obey is standing; a rule that touches only some stories lives in the one story that tests it. Standing rules are listed in the map as covered by standing requirements, so coverage still accounts for them. If no source names an accessibility standard or an audit rule, say so there and file a question.
11. **Epics.** Create epics only if the feature has more than about 8 stories, more than one actor journey, or parts that could ship separately. Cut epics along actor journeys or shippable increments, never along technical layers. Otherwise the feature has no epics and the map's header is the parent.
12. **Release and order.** Give each story a `Release` (`first`, `later`, `undecided`) from the interview's answers, and list stories in build order. A story holds one release value: split it where its items differ. A story whose release waits on an open question is `undecided`.

## Coverage before approval

Every in-scope inventory item must appear under exactly one story's `Covers`, or under standing requirements, dependencies or out of scope, each by ID. Record under **Open questions by story** which Q-IDs each story touches; those stories will be written as `needs-info`. List any orphan at the bottom of the map; an orphan is a missing story or an item that should have been struck.

## Format

Use [assets/story-map.md](../assets/story-map.md).

## Splitting after writing

Writing is where a story's real size shows. A story that comes out over about 12 scenarios is split by the same cuts as step 7, but only where both halves can each be demonstrated with their blockers alone. Size is the weaker test: a 14-scenario story a tester can run end to end is better than two 7-scenario stories of which one cannot show its effect until the other ships. Splitting to meet a number produces fragments, long blocker chains and scenarios that cannot pass on delivery. The original keeps its number, its file and the narrowed scope; each new story takes the next free number. Requirements and scenarios move, not rewritten, and are renumbered without gaps in both files; every `relies on`, `Blocked by` and Out of scope pointer in other stories is corrected. An inventory item whose parts fall on both sides is itself split: the original keeps its ID and the narrowed statement, the other part gets a new ID, and each story covers its own. A story never ends up covering nothing. The map gets a dated line recording the split. A split that only repackages approved scope needs no new approval; one that adds, drops or moves scope between releases does.

## Approval

Show the user the map and ask for approval. Point out the cuts you were least sure of and any orphan. Apply their changes and show it again until they approve. Record the approval date in the map.

## Done when

Every in-scope inventory item sits under exactly one story and the map carries an approval date.
