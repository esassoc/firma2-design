# Stage: harvest

Produce the inventory: everything the prototype and the written record say about this feature, itemised, sourced and tagged. It is the index every later stage works from: the cut is made from it, coverage is checked against it, and the writers use its sources to find the code behind each item. An item missing here is missing from the stories.

## 1. Fix the scope

A harvest may cover a whole feature or one build of it (a spec often describes more than is built). State the coverage in the inventory's header and list what is left out under **Out of scope for this harvest**. A later harvest of the same feature extends the same inventory and continues its ID numbering.

Find the feature's files: its routes, the components those routes import (follow imports and references wherever they lead, including outside the adapter's listed directories, until you reach shared or library code), its data and logic modules, and its spec. Sort them:

- **Owned**: files that exist for this feature, wherever they are stored. Read each completely. They go in the manifest's `scope`.
- **Shared, watched**: a file another feature owns that holds a block existing only for this feature. Read the regions that reference this feature and say which. Add the file to `scope` too: drift there will sometimes be noise, and that is cheaper than a missed change.
- **Shared, read only**: files this feature merely relies on. Read what you need, list them as dependencies, leave them out of `scope`.
- **The spec** goes in `scope`. A changed decision changes requirements as surely as changed code.
- **Experiments** that the system map says feed this feature: skim them for behavior the real route lacks, and record only that, under **Shown but uncommitted**.

Check the system map for what other features own. If the feature has no entry there, add one in the map template's format (`assets/system-map.md`).

## 2. Read the written record

Read the spec if there is one, the decision records that touch the feature, and the glossary. Every numbered spec decision becomes a source you can cite (`spec #13`). With no spec, skip this; more items will be `inferred` and the interview will be longer.

## 3. Read the prototype, file by file

For each file, extract into the inventory:

| Kind | ID | What to capture |
|---|---|---|
| Actor | `ACT-n` | who uses it, in the adapter's actor vocabulary |
| Object | `OBJ-n` | each thing a user would name that the feature creates, shows or changes; its fields as shown; its lifecycle states. Internal plumbing is an artifact, not an object, unless it must outlive the session |
| Screen | `SCR-n` | each route, page, panel, dialog or sheet; how the user reaches it |
| State | `STA-n` | each distinct condition of a screen or of an element on it (a row that is ready, unsure, locked): empty, loading, populated, error, no permission, partial, per-role variants |
| Action | `ACN-n` | each thing a user can do: the control, its label, what happens, where the user lands, any feedback (toast, count, undo) |
| Rule | `RUL-n` | each condition in the code or spec: validation, matching, calculation, limits, who may do what, what is never done |

Where one element can be in several states, note which state wins when two apply at once, if the code decides it. For every action that writes, capture the write rule: what happens when the thing already exists (replace, add to, refuse, duplicate), whether the write is all-or-nothing, and what state the result is in (draft, saved, published). These are the rules a builder asks for first and a screen never states. Rules hide in conditionals, in mock-data shapes, in copy ("Kept by *source*"), and in what a control refuses to do. Read for them deliberately; screens and actions are easy to see and rules are what make a story testable.

Per item record a one-sentence statement, the source, and the tag.

- **Source**: `file:line` using the file's base name (full paths are listed once under Scope), or `spec #n`, or a decision record. When the working tree has uncommitted changes, say so in the header beside the commit; line numbers then refer to the files as read.
- **Tag**:
  - `shown`: the prototype does it and nothing written says why.
  - `decided`: a spec, decision record or a code comment that states the rule and its reason says so. If the prototype does not do it yet, write `decided, not built`, so later stages can tell a promise from a behavior.
  - `inferred`: your reading.
- **Words**: use the glossary's term; where it has none, use the spec's term, and list each such term once under **Terms to define**.

Also record:

- **Prototype artifacts**: local storage, scripted or canned responses, seeded mock data, demo switchers, hard-coded "current user". For each, say what real capability it stands in for; that capability is a likely enabler story.
- **Sample data**: the named records, files and values the prototype seeds (a project, a person, a sample document and what it proposes). Scenarios and UAT scripts are written from these, and later stages cannot open the code to find them.
- **Conflicts**: any two sources that disagree, prototype against written record or one document against another, including a decision the prototype only partly carries out. Quote both.
- **Shown but uncommitted**: things on screen that look like experiments, placeholders or "later" ideas. The interview decides them.
- **Dependencies**: shared surfaces and rules owned by other features.
- **Gaps**: what a production system needs that nothing shows. Use the checklist in [interview.md](interview.md) to find them; write each as a question with why it matters.

Leave the inventory's Interview and Open questions sections empty; the interview fills them.

## 4. Write the outputs

- `<out>/inventory.md` from [assets/inventory.md](../assets/inventory.md).
- `<out>/manifest.json`:

```json
{
  "feature": "<slug>",
  "state": "exploring",
  "revision": 0,
  "scope": ["<glob or path>", "..."],
  "baseline": null
}
```

- The system map: add the shared surfaces and rules you found.

## When the reason for something is unclear

If a behavior looks deliberate and neither the written record nor a code comment explains it, search the adapter's session transcripts for the feature's distinctive terms and read only the matching passages. Cite what you find as `transcript <date>` and tag the item `decided`. If nothing turns up, leave it `inferred` and add a gap question. Transcripts are large; never read them wholesale.

## Done when

Every owned file has been read in full, and every screen, state, action and rule in it is an inventory item with a source. End by giving the user the counts per kind, and in full: the conflicts, the shown-but-uncommitted items and the gap questions.
