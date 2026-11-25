# Standing requirements — classifications

Rules every story in `story-map.md` must meet. A story references this file and does not restate it. Each line cites where the rule is written and carries a tag. Written 2026-11-24.

| ID | Requirement | Source | Tag |
|---|---|---|---|
| SR-1 | Words come from `GLOSSARY.md`. Say "performance measures", never "KPI". Say "classification" and "group". | `GLOSSARY.md`; skill rule "Vocabulary" | decided |
| SR-2 | A label or sentence that names a renameable noun (the page's own name, "Classifications", is one) shows the workspace's own word for it. | system map, shared rules ("A label naming a renameable noun…"); classifications.astro `aliasableTitle` | shown |
| SR-3 | Every screen works on a phone, a tablet and with touch, by the breakpoints and rules of the mobile foundation spec; this file does not restate them. Two behaviors of this feature are named there: the Outline keeps its Name column in view while the table scrolls sideways (story 15), and a row's grip and "…" are always visible where there is no hover (story 07). Nothing a person needs is reachable by hover alone: a tooltip repeats what the row already says. | `.scratch/mobile-foundation`; inventory RUL-26, STA-9, STA-35 | decided |
| SR-4 | Every action that moves or reorders something has a way to do it without dragging: the row's grip menu. Every control that opens or folds something names its state to assistive technology ("Hide …", "Show …", expanded or not). A move, a conversion, a sort, and a change of what is shown beside a list are announced once. Keyboard focus returns to the moved or converted row's control after the page redraws. | inventory ACN-27, ACN-42, ACN-7; bcn-sortable-list.ts header | shown |
| SR-5 | Who may act is the Security setting "Manage classifications" (administrators by default; a workspace may open it wider). Someone who may not act is not shown the controls and does not receive the settings pages. The role model is fixed; no story adds a role or a permission. Reading pages are open to every signed-in reader. | inventory RUL-31; `docs/roles-and-permissions.md`; interview 2026-11-24, Q-180 | decided |
| SR-6 | Every change to the tree is recorded in the change log with who made it and when: an add, a rename, a change of description or colour, a move, a conversion, a removal, a sort, a measure linked or unlinked, a goal target set or cleared. There is no undo beyond the confirmations a story names; a person puts things back by doing the opposite change. | inventory RUL-34; interview 2026-11-24, Q-186 | decided, not built |
| SR-7 | Each change saves on its own as it is made. If a save fails, the row or field returns to where it was, a message under the page title says "Couldn't save the change. Try again.", and nothing else the person did is lost. | inventory RUL-40; Q-199 | decided, not built |
| SR-8 | Two people changing the tree at once: each change saves on its own and the last save wins. A row someone else already moved or removed returns to its current place the next time the page refreshes, with the message "Someone else changed this." There are no locks. | inventory RUL-35; Q-188 | decided, not built |
| SR-9 | A name is at most 100 characters and a description at most 300. At the limit the field shows how many characters are left and takes no more. There is no limit on depth or count; the design holds six levels and five hundred classifications. | inventory RUL-36; Q-189 | decided, not built |
| SR-10 | Nobody is notified when the tree changes. | inventory RUL-37; Q-191 | decided |
| SR-11 | A control or case that another story owns is absent, or not handled, until that story ships. Stories are released together as each epic's plan says, so no story describes a half-built screen. A story names the owner and nothing more. | skill rule (slice, step 5) | decided |
| SR-12 | Every screen meets WCAG 2.2 at level AA. A client contract that names another standard replaces it. | Q-83 (product-wide, in `.scratch/open-questions.md`); no written source names a standard | proposed (Q-83) |
| SR-13 | Every scenario and UAT script is run against the built product, in a test workspace the development team provides, loaded with the sample in `fixtures.md`. The prototype keeps changes in the browser; how to walk the same paths on it is said once in `fixtures.md`. | `fixtures.md`; skill rule "Prototype artifacts" | decided |

## Not yet written anywhere

Looked for and not found in the sources read.

- **Accessibility standard.** No source read names the level every screen must meet. SR-12 states the proposal (Q-83); a client contract may name another.
- **Where the change log is shown.** SR-6 says each change is recorded; no source says which screen lists them. The system map's `updates-feed` is the likely home and is to be confirmed with that feature's owner.
- **The permission-denied page's exact wording.** Q-180 proposes "You don't have permission to change classifications." with a link back to Classifications; story 13 uses it as the required wording unless a later answer changes it.
