# Terms — classifications

Every word the stories use that a newcomer would not know. Stories use these words exactly and do not define them again. Written 2026-11-24.

## How to read a story

| Notation | Means | Look it up in |
|---|---|---|
| `R1`, `R2` … | A numbered requirement of the story you are reading. **Every numbered requirement is binding, whatever its tag.** | the story |
| `S1`, `S2` … | A scenario (Given / When / Then). Each names the requirements it proves. | the story |
| `story 06, R5` | A requirement of another story. | `stories/06-….md` |
| `SR-1` … | A standing requirement: a rule every story must meet, stated once. | `standing-requirements.md` |
| `F1`, `F2.3`, `F3.1` | A fixture: the sample tree, figures and people a scenario or script uses, and the row of it. | `fixtures.md` |
| `SCR-n`, `STA-n`, `ACN-n`, `RUL-n`, `OBJ-n`, `ACT-n` | An inventory item: a screen, a state of a screen, an action, a rule, an object, an actor. The inventory records what the prototype and the written record show. | `inventory.md` |
| `Q-n` | A question. All of this feature's questions are answered; a story cites the ID and never restates the question, which is in the open-questions file under Answered. | `../../open-questions.md` |
| `spec #n` | A numbered decision in the feature's spec. | `../spec.md` |
| `interview <date>, Q-n` | A question the product owner answered on that date. | `../../open-questions.md` |
| `relies on story NN, <ID>` | The requirement leans on an item another story covers. | that story |
| `<name>`, `<N>` | A placeholder inside quoted interface wording: the real value goes there. | |
| Trace table | The table in a story's collapsed notes that gives each requirement's tag and the inventory items it states. | the story |
| Text in "double quotes" | Interface wording. It is the required wording unless the requirement says otherwise. | |

**Tags say where a requirement came from, not how optional it is.**

| Tag | Means |
|---|---|
| `shown` | Observed in the prototype and not yet confirmed in writing. Binding. |
| `decided` | Written in the spec, a decision record or an interview answer. Binding. |
| `decided, not built` | Decided in writing; the prototype does not do it, so there is nothing to look at. Binding. |
| `proposed (Q-n)` | The proposed answer to question Q-n, written in as a requirement. Binding like any other tag; it awaits the user's validation and is not yet a decision. Once validated it reads `decided (validated <date>, Q-n)`. |
| `inferred` | The writer's reading, always with an open question beside it. None remains in this feature. |

**Header lines of a story.**

| Line | Means |
|---|---|
| `Type` | `story`, or `enabler` for a capability with no screen of its own. |
| `Release` | When the story ships: `first`, `later` or `undecided`. Every story here is `first`. |
| `Status` | `needs-triage`: drafted; every question it touches has an answer or a proposed answer, written in. `needs-info`: it touches a question that could not be proposed (none does). |
| `Built on proposals awaiting validation` | The questions whose proposed answer is a requirement of the story, tagged `proposed (Q-n)`. If the user rejects one, those requirements change. |
| `Revision` | How many times the story has been changed to follow the prototype since it was written. It starts at 1. |
| `Blocked by` | Stories that must be built before this one can be built or shown. |
| `Covers` | The inventory items this story is the one home of. No other story lists them. |
| `Sources` | Where the behavior comes from: the prototype's address, and the spec decisions or interview answers the story rests on. |
| `Snapshot` | The screenshots of the prototype this story was written against. "Not yet captured" until the prototype is declared finished. |
| `Reset` (in a UAT script) | How a tester returns the tree to the starting state, F1. |

## Who

| Term | Meaning |
|---|---|
| Administrator | The fixed workspace role that configures the workspace. Counts as able to change classifications. |
| the person who may change classifications | An Administrator, or anyone the Security setting "Manage classifications" lets in. The setting starts at Administrators and a workspace may open it wider. The stories say "the administrator" for short; they mean this person. |
| reader | Anyone signed in who reads the Classifications pages. Any of the three fixed roles (Administrator, Contributor, Viewer). |
| Viewer with no organization | A Viewer who belongs to no organization. By the roles document such a person "sees exactly what the public sees". |
| the public, visitor | Someone with no account, reading the public site. |

## The feature's own words

| Term | Meaning |
|---|---|
| classification | What a project is filed under so its progress can be read from above: usually one of the workspace's goals, sometimes another axis such as a species. Performance measures and goal targets are set on it. A project can carry several. Projects are filed on classifications only. |
| group, classification group | A named set of classifications and groups, with a name, a description and a colour. A group can sit inside another group, at any depth. It has no performance measures, targets or projects of its own: its figures add up what is beneath it. |
| top level | Where a group stands when it is inside no other group. The top level holds groups only; a classification is always in a group. |
| the tree | All the groups and classifications of the workspace, as arranged. |
| goal target, goal | A number and a year on one performance measure for one classification: what the workspace means to reach, set by an administrator. Not the sum of what projects promised. |
| planned | What projects have promised toward a performance measure (their own targets). A measure with no goal target is measured against what is planned. |
| not yet planned | The part of a goal no project has promised: the goal minus what is planned. Shown only while the goal is larger than what is planned. |
| Classifications page | The page `Classifications` in the main navigation: a toggle between Outline and Browse over the tree, with the classification peek beside it. |
| Outline | The Classifications page's default view: the whole tree as one table. A row per group and per classification; Name, Projects, Funders, Performance measures (a count), Progress (one ring per measure). |
| Browse | The Classifications page's other view: a list of every group and classification on the left and one chosen record on the right. |
| ring | The small circle that shows how far along one performance measure is, against its goal (or against what is planned when there is none). |
| peek, classification peek | A side panel docked beside the Classifications page that shows one classification's summary and every performance measure, opened by the side-panel button on its row. |
| classification page | One classification's own page: summary, performance measures, projects, funders. |
| group page | One group's own page: summary, what it holds, performance measures, projects, funders, added up beneath it. |
| Simple, Detailed | The two ways a classification's performance measures are shown on its page: tiles, and a table of projects by year. |
| settings list | Workspace settings › Classifications: the tree as grouped rows that an administrator adds to, arranges, converts and removes in place. |
| row | One line of the settings list: a classification (with its figures) or a group's own line. |
| add row | An empty row that opens where a new classification or group will sit, with one name field. |
| grip | The handle at the start of a row, shown when the pointer is on the row. Dragging it moves the row; clicking it opens a menu of the same moves. |
| grip menu | The menu that opens from a row's grip: "Move up", "Move down", "Move to top", "Move to bottom", "Move to <group>", "Move to top level". |
| fold, folded | A group closed so what is inside it is hidden; the chevron on its line opens it again. |
| convert | Turn a classification into a group, or a group into a classification, keeping its name, colour, description and place. |
| Sort A to Z | The action that puts one list in alphabetical order (case ignored; numbers read as numbers). It orders what is directly inside one group, or the top level. It does not reach into groups inside. |
| in use | Said of a classification when any project carries it, in any stage and whether or not the project is published. |
| edit door | The button "Edit classification" or "Edit group" on a record's page: it goes to that record's page in Workspace settings. |
| structure change | An add, a rename, a change of description or colour, a move, a conversion, a removal, a sort, a measure linked or unlinked, or a goal target set or cleared. |

## Words from the rest of the product

| Term | Meaning |
|---|---|
| performance measure | A question asked of every project, forever (`GLOSSARY.md`). Defined in Performance measures; linked to a classification here. |
| the catalog | The workspace's list of defined performance measures. A classification can link only to a measure from it. |
| counting rule | Whether a measure adds across projects (sum) or not; a measure that does not add is averaged over the projects that reported and has no planned total. |
| published | A project's values the public may see. The public site counts only published projects. |
| change log | The record of changes the workspace keeps. Where it is shown is the `updates-feed` feature's. |
| funding source, funder | A funding source is a grant or program that pays for a project; its funder is the organization administering it. |
| peek (project) | The project side panel; the classification peek uses the same docked panel. |

## Glossary proposals

`GLOSSARY.md` has Classification and Classification group. Proposed additions: **Outline**, **Browse**, **Convert** (a classification to a group and back), **Top level**, **Goal target**, **Edit door**. Until the glossary has them, this file defines them.
