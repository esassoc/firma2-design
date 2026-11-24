# Stage: map

The system map is the level above a feature. Each feature's breakdown can be consistent inside and still collide with its neighbours: two features writing a story for the same review queue, or neither writing it. The map prevents that by giving every shared thing one owner.

The map is coarse on purpose. Every row is a first reading that the user's review and each feature's harvest correct, so judge from route files, their imports, component names and the written record; do not read components in full.

## Sources to read, all of them

The prototype registry, every route file's header and imports, any navigation model the adapter names, every spec's Decisions, every decision record, and the adapter's actors and roles documents. The rules and ownership calls in the map come from these and nowhere else, which is what makes the stage repeatable.

## Build

1. **Features.** Walk the route directory; a stale registry is common, so routes are the ground truth and the registry and specs supply names and goals. A feature is a user-facing capability with its own goal.
   - Granularity: a set of routes that create, show and edit one object is one feature. A settings page that manages one object is its own feature; group settings pages only when they manage the same object.
   - A feature may have no route yet (a spec or a section on another feature's page). List it with state `unbuilt`.
   - A feature's slug names its output directory. Reuse the spec's directory name when one spec maps to one feature.
2. **Specs do not map one-to-one.** One spec may span several features: give each feature its decision range in the Spec column. A spec that cuts across every feature (an editing grammar, a responsive pass) is not a feature: list it under **Cross-cutting specs**, where `slice` picks it up as standing requirements.
3. **Not features.** Classify every other route so the done-when can be checked:
   - *experiment*: under the adapter's experiments directories;
   - *alternative*: a rival or superseded build of an existing feature kept for comparison, wherever it lives. Name the feature it competes with; the user decides which stays;
   - *redirect*, *stub* (a placeholder page), *static-site artifact* (a route that exists only because the prototype has no server).
4. **Per feature** record: slug, one-line goal, actors (in the adapter's actor vocabulary), routes, spec, and state (`exploring` unless a `manifest.json` says `baselined`).
5. **Shared objects.** The product's nouns that more than one feature reads or changes. Start from the glossary; a noun the product plainly has and the glossary lacks is still listed, and also added to **Glossary gaps**. The owner is the feature where the object is edited after it exists; note the features that create it.
6. **Shared surfaces.** Screens, panels or components that more than one feature's routes import and whose name or use suggests behavior (a review queue, a change log, a permission gate). Import lists and names are enough evidence at this stage.
7. **Shared rules.** A rule more than one feature must obey ("only published values are public"), with its source. Give each one owner: the feature whose stories will state and test it.
8. **What needs the user.** Anything you could not settle becomes a question in the open-questions file under "Product-wide", never silently resolved: a shared thing with no clear owner, two written sources that disagree (quote both), which of two alternatives stays, whether a leftover is still wanted, and the glossary gaps. The map's rows cite the `Q-n` ID where the answer will land.

## Format

Use [assets/system-map.md](../assets/system-map.md). Open with a short note of what was read and any shorthand used in the tables.

## Done when

Every route is a feature's or is classified under step 3; every spec Decisions table and decision record has been read; every shared rule found has one owner or is listed as unowned.

## How later stages use it

- `harvest` adds what it finds: a new shared surface, a rule it discovers the feature owns.
- `slice` turns anything owned by another feature into a named dependency, never a story.
- `baseline` and `reopen` update the feature's state here.
