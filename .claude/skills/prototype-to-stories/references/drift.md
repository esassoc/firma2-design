# Baseline, status, sync, reopen

Requirements must not drift from the prototype, and experimenting must stay free. So each feature has a state in `<out>/manifest.json`:

- `exploring` (default): the prototype is still changing. Nothing is checked and nothing is reported.
- `baselined`: the user has said "I'm done". The stories describe this snapshot, and later changes to the feature's owned files are detected.

`scripts/drift.py` does the bookkeeping so it is fast and repeatable. Run it from the repo root with `python3 <skill-dir>/scripts/drift.py`.

## baseline

The user's "I'm done making changes" signal. It can run before or after stories exist; stories written against an un-baselined feature have nothing to detect drift from, so baseline no later than the end of `write`.

If the manifest already has a baseline and stories exist, the user means `sync`; run that instead.

1. Confirm the manifest's `scope` still matches the feature's owned files (new files since harvest are the usual miss).
2. `drift.py baseline <out>`. This hashes every file in scope, records the commit, sets the state and bumps the revision.
3. Snapshots, if the adapter has them on: capture one screenshot per `SCR` and `STA` in the inventory into `<out>/snapshots/r<revision>/`, named by inventory ID. Set each story's `Snapshot` line to the screens it covers.
4. Update the feature's state in the system map.

## status

`drift.py status <search-root>` lists every baselined feature whose owned files changed, were added or were removed since its baseline. Add `--quiet` for one line per drifted feature and no output otherwise; that form is what a session-start hook runs.

Status reports changed files, not changed requirements. A refactor shows up here; `sync` is what decides whether it matters.

## sync

Bring the requirements up to date with the prototype.

1. `drift.py status <out> --json` for the changed, added and removed files.
2. For each, read the change: `git diff <baseline commit> -- <file>` when the baseline has a commit, otherwise read the file against the inventory items that cite it.
3. Find the affected inventory items (those whose source is in a changed file) and re-harvest only those, plus anything new in added files. Harvest's rules apply.
4. Classify each change:
   - **cosmetic**: no inventory statement changes. Nothing to do.
   - **changed**: an item's statement changes.
   - **new**: a new item.
   - **removed**: an item no longer exists.
5. If a change contradicts a `decided` item, or you cannot tell whether a behavior change is intended, ask the user before applying it. Otherwise proceed.
6. Apply to the stories that cover each affected item:
   - A story whose `Status` shows it is being built or is done is left untouched. Write a new follow-up story that names it in an `Amends:` line.
   - Otherwise edit the story's requirements, scenarios and UAT steps, and bump its `Revision`.
   - New behavior goes into the story it belongs to if that story still passes the slice tests, otherwise into a new story with the next free number.
   - A story whose behavior is entirely gone gets `Status: withdrawn` and a one-line reason. It is never deleted or renumbered.
7. Append to `<out>/changelog.md`:

```markdown
## r<new revision> · <date>
Prototype changes: <files>
- Story 04, R3: was "<old>", now "<new>". (RUL-7 changed)
- Story 11 added: <title>. (ACN-21 new)
- Story 06 withdrawn: <reason>.
- No requirement change: <cosmetic files>
```

8. Run the `check` stage again.
9. `drift.py baseline <out>` to move the baseline, and re-capture snapshots for the affected screens only.
10. Tell the user what changed, in the changelog's terms.

Sync works one way: prototype to stories. A requirement someone edited by hand may be rewritten if the prototype item behind it changed; when you are about to change a requirement whose text no longer matches what the inventory would produce, stop and show the user both versions.

## reopen

`drift.py reopen <out>` sets the feature back to `exploring` for another round of experiments, and status goes quiet for it. Update the system map. The stories stay as they are and the old baseline is kept. When the user is done again, run `sync`, not `baseline`: sync diffs against the kept baseline (`status --json` reports it for a reopened feature too) and sets the new baseline as its last step. Running `baseline` first would overwrite the hashes sync needs.
