# Coverage — classifications

Checked: 2026-11-24
Stories: 23 · Open questions they cite: 31

## How this was verified

By `scripts/coverage.py`, which parses the inventory, the story map, the epics and every story. An item counts as covered only when a story lists it under `Covers` and that story's Trace table gives it to a requirement; a `relies on` citation does not count. An item with no covering requirement must be excluded by the map (standing requirements, dependencies on other features, out of scope) or struck in the inventory. A spec decision is covered through the inventory items that name it as their source.

Not checked by script: whether a requirement states its inventory item correctly, glossary use, and whether a scenario's Given truly needs only the story's blockers. Those are for the cold read and the reviewer.

## Result

| Kind | Items | Covered by a requirement | Excluded with a reason | Unmapped |
|---|---|---|---|---|
| Screens (SCR) | 14 | 12 | 2 | 0 |
| States (STA) | 48 | 47 | 1 | 0 |
| Actions (ACN) | 45 | 42 | 3 | 0 |
| Rules (RUL) | 96 | 90 | 6 | 0 |
| Objects (OBJ) | 7 | 7 | 0 | 0 |
| Actors (ACT) | 4 | 0 | 4 | 0 |
| Spec decisions | 33 | 20 | 0 | 13 |

Screens, states, actions and rules together: 191 covered, 12 excluded, 0 unmapped, of 203.

## Screens

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| SCR-1 | Classifications page: a toggle (Outline, Browse) over the chosen view, with the classification peek docked beside it | 15 R1 |  |
| SCR-2 | Outline view: the whole tree as one table (Name, Projects, Funders, Performance measures, Progress) | 15 R2, R3, R6, R7 |  |
| SCR-3 | Browse view: a list of every group and classification on the left, one chosen record on the right | 17 R6, R8 |  |
| SCR-4 | Classification peek: a docked side panel with a classification's name, its group's badge, summary figures and every … | 18 R4 |  |
| SCR-5 | Classification page: summary, performance measures (Simple or Detailed), projects, funders | 14 R1, R4, R4 |  |
| SCR-6 | Group page: summary, contents (the card board scoped to the group), performance measures, projects, funders | 21 R1, R2, R4 |  |
| SCR-7 | Settings › Classifications: one section per top-level group, each its groups and classifications as rows | 02 R1, R2, R14 |  |
| SCR-8 | Settings › a classification: details (name, description, group), performance measures with goal targets, remove | 03 R1 |  |
| SCR-9 | Settings › a group: details (name, description, parent group, colour) and remove (its two member lists are struck, … | 04 R1 |  |
| SCR-10 | Add classification page: name, description, group | | out of scope: struck in the interview (Q-182, Q-183): adds are rows in place and a group's settings page has no member lists |
| SCR-11 | Add group page: name, description, parent group | | out of scope: struck in the interview (Q-182, Q-183): adds are rows in place and a group's settings page has no member lists |
| SCR-12 | Dialog: "Convert … to a group?" (confirm) | 11 R3, R4 |  |
| SCR-13 | Dialog: "Convert … to a classification?" with Keep them, Remove them, Cancel | 12 R3, R7 |  |
| SCR-14 | Dialog: "Remove …?" (confirm) | 06 R1, R9 |  |

## States

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| STA-1 | Outline chosen (default) | 15 R1 |  |
| STA-2 | Browse chosen, or opened by a link ending `#g:` or `#c:` | 17 R3 |  |
| STA-3 | at rest | 15 R12 |  |
| STA-4 | folded | 15 R11 |  |
| STA-5 | opened | 15 R9 |  |
| STA-6 | no performance measures | 15 R10 |  |
| STA-7 | any | 15 R4 |  |
| STA-8 | hovered or focused | 16 R1, R5, R7 |  |
| STA-9 | narrow screen | 15 R13 |  |
| STA-10 | on arrival with no link | 17 R7 |  |
| STA-11 | a group chosen | 17 R11 |  |
| STA-12 | a classification chosen | 17 R12 |  |
| STA-13 | groups open or folded | 17 R8, R9, R10 |  |
| STA-14 | many branches open | 17 R14 |  |
| STA-15 | no groups and no classifications at all | 23 R1, R2, R3 |  |
| STA-16 | closed | 18 R2 |  |
| STA-17 | open | 18 R3, R4, R5, R6, R7 |  |
| STA-18 | a measure with a goal | 14 R6, R8 |  |
| STA-19 | a measure with no goal | 14 R6, R9 |  |
| STA-20 | a measure nobody reported | 14 R9, R9 |  |
| STA-21 | a measure fully planned | 14 R8 |  |
| STA-22 | no performance measures | 14 R12 |  |
| STA-23 | Detailed (narrowed 2026-11-24: Simple is STA-47) | 19 R2, R3, R8, R9 |  |
| STA-24 | no funding on its projects | 20 R1, R7 |  |
| STA-25 | a project carries more than one classification | 20 R4 |  |
| STA-26 | the record was removed in this browser | 23 R5, R6 |  |
| STA-27 | a group with nothing beneath it | 21 R7 |  |
| STA-28 | groups open or closed | 21 R6 |  |
| STA-29 | all open / some folded | 10 R1, R2, R4, R7, R9 |  |
| STA-30 | no groups at all | 02 R13 |  |
| STA-31 | an add row is open | 02 R8 |  |
| STA-32 | a name is refused in an open add row | 02 R12 |  |
| STA-33 | a row is dragged | 09 R1, R8, R11 |  |
| STA-34 | a classification is dragged | 11 R9 |  |
| STA-35 | the pointer is on a row | 07 R3 |  |
| STA-36 | in use | 06 R3 |  |
| STA-37 | not in use | 06 R4 |  |
| STA-38 | none linked | 05 R2 |  |
| STA-39 | target cleared | 05 R9 |  |
| STA-40 | holds something | 06 R5, R6 |  |
| STA-41 | the last group | 06 R7 |  |
| STA-42 | any | 03 R6 |  |
| STA-43 | empty | | out of scope: struck in the interview (Q-182, Q-183): adds are rows in place and a group's settings page has no member lists |
| STA-44 | a conversion to a group is refused because a group already has the name | 11 R8 |  |
| STA-45 | a conversion to a classification is refused because a classification already has the name | 12 R9 |  |
| STA-46 | any | 04 R7 |  |
| STA-47 | Simple (the default) | 14 R4, R5 |  |
| STA-48 | no performance measures | 19 R1 |  |

## Actions

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| ACN-1 | the toggle "Outline" / "Browse" | 17 R1, R2, R5 |  |
| ACN-2 | a group row's chevron "Hide …" / "Show …" | 15 R11 |  |
| ACN-3 | a classification row's chevron "Show measures for …" | 15 R9 |  |
| ACN-4 | a name link | 15 R8 |  |
| ACN-5 | the side-panel button on a classification | 18 R1 |  |
| ACN-6 | hover (mouse) or focus a ring | 16 R1, R2, R4 |  |
| ACN-7 | a name in the list | 17 R10 |  |
| ACN-8 | a group's chevron in the list | 17 R9 |  |
| ACN-9 | "Open group" / "Open classification" | 17 R11, R12, R13 |  |
| ACN-10 | the title door, "Open classification", close, drag the edge, Esc | 18 R8, R9 |  |
| ACN-11 | the toggle "Simple" / "Detailed" | 19 R1 |  |
| ACN-12 | a measure's chevron in Detailed | 19 R6 |  |
| ACN-13 | a project's name, its side-panel button | 19 R3, R7 |  |
| ACN-14 | "View as data" under the funders chart | 20 R2, R5, R6 |  |
| ACN-15 | "Edit classification" (top bar) | 13 R1 |  |
| ACN-16 | "Edit group" (top bar) | 13 R2 |  |
| ACN-17 | a card group's title; "Open group" | 21 R4, R8 |  |
| ACN-18 | the top bar's "Add group" | 02 R6 |  |
| ACN-19 | the top bar's "Sort A to Z" | 07 R7, R9 |  |
| ACN-20 | a group's "Add" menu: "Classification", "Group" | 02 R7 |  |
| ACN-21 | typing in an add row | 02 R9 |  |
| ACN-22 | a group's "…" menu: "Sort A to Z" | 07 R6, R9 |  |
| ACN-23 | a group's "…" menu: "Convert to classification" (not on a top-level group) | 12 R1, R2, R10 |  |
| ACN-24 | a classification's "…" menu: "Convert to group" | 11 R1, R5, R10 |  |
| ACN-25 | SCR-13's "Keep them" / "Remove them" / "Cancel" | 12 R4, R6, R7 |  |
| ACN-26 | drag a row by its grip | 09 R3, R5, R8, R9 |  |
| ACN-27 | a row's grip menu: "Move up", "Move down", "Move to top", "Move to bottom" | 07 R3, R4, R5 |  |
| ACN-28 | a group's chevron | 10 R1, R3 |  |
| ACN-29 | a name link | 02 R5 |  |
| ACN-30 | the Name field of a classification | 03 R2, R3 |  |
| ACN-31 | the Description field of a classification | 03 R4 |  |
| ACN-32 | the Group choice | 03 R5 |  |
| ACN-33 | the Parent group choice | 04 R4, R5, R6 |  |
| ACN-34 | the Color picker | 04 R8, R9 |  |
| ACN-35 | "Add a performance measure" | 05 R3 |  |
| ACN-36 | "Goal target" and "Due by" fields | 05 R8, R11 |  |
| ACN-37 | "Stop tracking" | 05 R10 |  |
| ACN-38 | "Remove" in the danger zone | 06 R10, R11 |  |
| ACN-39 | drag or "…" a row in its classifications list or groups list | | out of scope: struck in the interview (Q-182, Q-183): adds are rows in place and a group's settings page has no member lists |
| ACN-40 | "Add classification" / "Add group" | | out of scope: struck in the interview (Q-182, Q-183): adds are rows in place and a group's settings page has no member lists |
| ACN-41 | "Add classification" / "Add group", "Cancel" | | out of scope: struck in the interview (Q-182, Q-183): adds are rows in place and a group's settings page has no member lists |
| ACN-42 | a row's grip menu: "Move to <group>", "Move to top level" | 08 R1, R3, R4 |  |
| ACN-43 | the Color control (a classification's colour) | 03 R7 |  |
| ACN-44 | the Name field of a group | 04 R2, R3 |  |
| ACN-45 | the Description field of a group | 04 R3 |  |

## Rules

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| RUL-1 | Projects are filed on classifications only, never on a group. A group's projects are those of the classifications … | 02 R4 |  |
| RUL-2 | A classification is always in a group. Moved out of every group it becomes a group at the top level, asking first when … | 11 R10, R11 |  |
| RUL-3 | The tree is free: a group may hold groups and classifications together; any group goes under any other group or to the … | 08 R2, R8 |  |
| RUL-4 | A name is unique among classifications, and among groups, ignoring upper and lower case and surrounding space. A … | 02 R12 |  |
| RUL-5 | A new classification or group is dealt the next of six colours. (A group's colour: RUL-42. A classification's colour … | 02 R11 |  |
| RUL-6 | In the Classifications page's lists, on the group page's cards and in the peek, a classification's swatch is its parent … | 15 R4, R5 |  |
| RUL-7 | Order is stored per list. A new thing joins the end of its list. Inside a group the classifications come before its … | 07 R1, R2, R6, R7, R8 |  |
| RUL-8 | A classification can be removed only when no project works toward it. A group can be removed only when it holds no … | 06 R4, R8, R12 |  |
| RUL-9 | Classification to group: keeps name, colour, description and place; its performance measures and goal targets are … | 11 R2, R3, R4, R5, R6, R7, R11 |  |
| RUL-10 | Group to classification: keeps name, colour, description and place. What it held is kept (moved up to where the group … | 12 R2, R3, R4, R5, R6, R8 |  |
| RUL-11 | An add takes only a name. Description, colour, performance measures and targets are set on the record's own page. | 02 R10 |  |
| RUL-12 | A drag shows before it changes anything: an insertion line at the indent of the list the row would join; over a group's … | 09 R1, R2, R3, R4, R9 |  |
| RUL-13 | Every move saves at once, by drag or by menu. A group is never offered, or dropped, inside itself or a group beneath it. | 08 R2, R5 |  |
| RUL-14 | A project counts toward a performance measure under a classification only when it carries the classification and one of … | 14 R3 |  |
| RUL-15 | A measure that adds (its counting rule is "sum") adds across projects. One that does not add is averaged over the … | 14 R10 |  |
| RUL-16 | A project's row must use the measure's unit; a mismatch stops the build rather than adding acres to miles (a few named … | 14 R11, R11 |  |
| RUL-17 | The ring and the figure measure against the goal target; with none, against what projects planned, and the note says … | 14 R5, R6, R7, R8 |  |
| RUL-18 | A group's page adds up everything filed beneath it, each project once, each report counted once however many of its … | 21 R3, R9, R10, R10, R11 |  |
| RUL-19 | Funding on these pages is whole-project dollars: a grant funds a project and a project carries several classifications, … | 20 R3, R4, R8, R9 |  |
| RUL-20 | A goal target is a number above zero and a year due from this year to fifty years on; both are saved together when … | 05 R6, R6, R7, R9 |  |
| RUL-21 | Only catalog measures that are not retired and have a name can be linked; a measure is defined in Performance measures, … | 05 R4, R4 |  |
| RUL-22 | Per-year interim targets are not part of this feature: one target and one due year per measure. | 05 R5 |  |
| RUL-23 | The Outline's counts: Projects are the distinct projects beneath; Funders the distinct organizations administering a … | 15 R2, R4, R5 |  |
| RUL-24 | The Classifications page defaults to Outline and remembers each reader's choice; a link ending `#g:` or `#c:` opens … | 17 R2, R3, R4, R9, R10, R15 |  |
| RUL-25 | Outline groups start open and classification measure lines start closed; folding a group hides the whole branch. | 15 R12 |  |
| RUL-26 | The ring tooltip is never the only way to a fact: opening the row shows the same name and figure. It opens after 300 … | 16 R6, R7 |  |
| RUL-27 | The settings list shows what is wrong with setup: a classification with no performance measures shows 0; setup is read … | 02 R3 |  |
| RUL-28 | A folded group stays folded across visits; adding into a folded group opens it. (Narrowed 2026-11-24: a folded group … | 10 R5, R8 |  |
| RUL-29 | The settings crumbs show a record's full path of groups, outermost first, each a link, and show the new path when the … | 08 R7 |  |
| RUL-30 | The reading pages' record pages carry an edit door: "Edit classification" and "Edit group" go to the record's settings … | 13 R1, R2, R6 |  |
| RUL-31 | Who may change the tree is the Security setting "Manage classifications" (administrators by default; a workspace may … | 13 R1, R2, R3, R4, R5, R7, R8, R9, R10 |  |
| RUL-32 | A group is not public in the first cut: the public sees classifications as today and a group has no public page. | | out of scope: owned by `public-site` |
| RUL-33 | The figures on the Classifications pages inside the app count every project. The public site's classification figures … | 22 R1, R2, R3, R4, R5, R6 |  |
| RUL-34 | Each structure change (add, rename, move, convert, remove, sort, target set) is written to the change log with who and … | | standing requirement (`standing-requirements.md`) |
| RUL-35 | Two people changing the tree at once: each change saves on its own and the last save wins; a row someone else already … | | standing requirement (`standing-requirements.md`) |
| RUL-36 | A name is at most 100 characters and a description at most 300; at the limit the field shows how many are left and … | | standing requirement (`standing-requirements.md`) |
| RUL-37 | Nobody is notified when the tree changes. | | standing requirement (`standing-requirements.md`) |
| RUL-38 | A classification is "in use" when any project carries it, in any stage and whether or not the project is published; the … | 06 R2 |  |
| RUL-39 | A performance measure that is retired while linked leaves the pages and the editor's choices; its link and goal target … | 05 R12, R12 |  |
| RUL-40 | When a save fails the row returns to where it was and a message under the page title says "Couldn't save the change. … | | standing requirement (`standing-requirements.md`) |
| RUL-41 | A top-level group has no "Convert to classification": a classification cannot stand at the top level, so there is … | 12 R1 |  |
| RUL-42 | A group's colour is chosen with a Color control on its settings page and saved on change. | 04 R8 |  |
| RUL-43 | A classification's colour is changed with a Color control on its settings page, as a group's is; the map and charts use … | 03 R7 |  |
| RUL-44 | On a classification's own page in Settings, changing its Group updates its crumbs at once. | 03 R6 |  |
| RUL-45 | On a group's own page in Settings, changing its Parent group updates its crumbs at once. | 04 R7 |  |
| RUL-46 | A rename is checked against every other record of the same kind and never against the record itself, so the same name … | 03 R2 |  |
| RUL-47 | Each details field saves on its own as it is left; a refused name blocks nothing else (description, group, colour still … | 03 R8 |  |
| RUL-48 | A colour typed in that is not a three- or six-digit hex value is not saved; the old colour stands. | 03 R7 |  |
| RUL-49 | Changing a classification's group leaves its performance measures, goal targets and projects alone. | 03 R5 |  |
| RUL-50 | A move changes only the row's place: a moved group joins the end of its new parent's groups and keeps its name, … | 08 R6 |  |
| RUL-51 | A group's name may equal a classification's name; the two kinds are checked apart, and a conversion is refused when the … | 02 R12 |  |
| RUL-52 | A year typed with no goal number is emptied and not saved; both the number and the year are checked before either is … | 05 R8, R9 |  |
| RUL-53 | Removing a classification also removes its performance-measure links and goal targets. | 06 R9, R10 |  |
| RUL-54 | "N not yet planned" carries no unit and is rounded to four decimals before it is shown. | 14 R8 |  |
| RUL-55 | A measure that adds reads 0 when a project reported 0 toward it, and "—" when no project reports toward it at all. | 14 R10 |  |
| RUL-56 | For a measure that does not add, the average leaves out the projects that reported 0. | 14 R10 |  |
| RUL-57 | The date a goal is due is never shown on the Classifications pages (the year is set and seen on the settings page only). | 14 R13, R13 |  |
| RUL-58 | In Outline a group's fold state is kept apart from each classification's open state, so an inner fold survives its … | 15 R11 |  |
| RUL-59 | In every list a group's own classifications come before the groups inside it. | 15 R3 |  |
| RUL-60 | The ring tooltip opens for a mouse only (touch and pen are ignored); Esc, a scroll and a resize each close it; only one … | 16 R3, R4, R6 |  |
| RUL-61 | An unknown `#` key on the Classifications page falls back to the first group. | 17 R7 |  |
| RUL-62 | Only a click on a name in Browse changes the address and announces; following a link never writes the remembered view. | 17 R3, R10 |  |
| RUL-63 | In Browse's list a group with no classification beneath it has no chevron. | 17 R8 |  |
| RUL-64 | At a content width of 904 px or less the peek drops under the page instead of sitting beside it. | 18 R10 |  |
| RUL-65 | The peek is independent of Browse's chosen row. | 18 R11 |  |
| RUL-66 | A classification's page opens on Simple every time; the Simple/Detailed choice is not stored. | 19 R1 |  |
| RUL-67 | In Detailed a project's year cell reads "—" for a year inside its span with nothing filed and is empty outside its span. | 19 R3 |  |
| RUL-68 | The Projects section lists every project that carries the classification. | 19 R8 |  |
| RUL-69 | Funders with equal totals are ordered by name, A to Z. | 20 R2 |  |
| RUL-70 | The funders chart's tooltip counts distinct projects. | 20 R2 |  |
| RUL-71 | The funding data table's columns sort. | 20 R6 |  |
| RUL-72 | Cards on a group's page have no side-panel button. | 21 R5 |  |
| RUL-73 | On a group's page a nested group with nothing beneath it is not shown. | 21 R7 |  |
| RUL-74 | A card shows the classification's name as a door to its page, its description cut to two lines, the first three … | 21 R5 |  |
| RUL-75 | A group's performance measures are the non-retired measures tracked by any classification beneath it, then those … | 21 R9 |  |
| RUL-76 | The public site reuses the same progress arithmetic over published projects only. | 22 R2 |  |
| RUL-77 | The first-run state of the settings list ends at the first group, even a group holding no classification. | 23 R4 |  |
| RUL-78 | An address that never existed shows the same page as a removed record. | 23 R7 |  |
| RUL-79 | Dragging a group onto another group's thin bottom band means "after it" only when that group shows nothing inside; … | 09 R4 |  |
| RUL-80 | Over a classification row the drag line is "before" the row except in its bottom band (proposed in Q-210: before in the … | 09 R7 |  |
| RUL-81 | A drag starts only after vertical travel: a sideways-only press never starts one. | 09 R12 |  |
| RUL-82 | The product asks before converting a classification that has projects or measures linked (proposed in Q-212; the spec … | 11 R2, R3 |  |
| RUL-83 | A converted row lands at the end of its list, because it is removed and re-added; the rows kept from a converted group … | 11 R5 |  |
| RUL-84 | A name clash is checked before any question on both conversion paths. | 11 R8, R11 |  |
| RUL-85 | The group-to-classification question counts every depth; "Keep them" moves only what is directly inside. | 12 R3, R4 |  |
| RUL-86 | Declining the question when a classification is dropped on the top-level row leaves the row exactly where it was (the … | 11 R12 |  |
| RUL-87 | A classification chosen on its own in Browse shows an "Open classification" button and no side-panel button on the … | 18 R1 |  |
| RUL-88 | The settings list draws a swatch on a group's line and none on a classification's row; a classification's own colour … | 02 R11 |  |
| RUL-89 | A description shows under every group line and every classification row on the settings list, cut to two lines (the … | 02 R2 |  |
| RUL-90 | A folded group still takes a row sent to it with "Move to": the row joins it and the group stays folded. | 08 R9 |  |
| RUL-91 | A folded group is not a place to drop a row by dragging: it is not marked and the row does not join it; the row goes … | 09 R10 |  |
| RUL-92 | A classification's page and every list that draws its measures show each performance measure that any project carrying … | 14 R4 |  |
| RUL-93 | Linking a performance measure to a classification only sets where a goal can be set; it does not decide whether the … | 05 R10, R13 |  |
| RUL-94 | A classification and a group can each have an icon: chosen on its settings page with a picker offering a shortlist and … | 03 R10 |  |
| RUL-95 | Where a name leads (Outline, Browse list and detail, cards, the settings list, page headings, the peek), the icon … | 15 R14 |  |
| RUL-96 | A conversion between classification and group keeps the record's icon. | 11 R13 |  |

## Objects

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| OBJ-1 | Classification | 02 R3, R10 |  |
| OBJ-2 | Classification group | 02 R4, R10 |  |
| OBJ-3 | Goal target | 05 R10 |  |
| OBJ-4 | Performance-measure link (a KPI) | 05 R1, R3 |  |
| OBJ-5 | Order | 07 R1, R10 |  |
| OBJ-6 | Roll-up (derived, never stored) | 14 R2, R3 |  |
| OBJ-7 | Reader preferences (stored on the reader's device) | 10 R5, R6 |  |

## Actors

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| ACT-1 | Administrator | | standing requirement (`standing-requirements.md`) |
| ACT-2 | Person the Security setting "Manage classifications" lets in | | standing requirement (`standing-requirements.md`) |
| ACT-3 | Anyone signed in who reads progress (Viewer, Contributor, Manager, Administrator) | | standing requirement (`standing-requirements.md`) |
| ACT-4 | Visitor (no account) | | out of scope: owned by `public-site` |

## Spec decisions

| Item | Statement | Covered by | Or excluded because |
|---|---|---|---|
| spec #1 | Classification groups nest to any depth: a group can sit inside another group. One tree; the workspace … | 02 R4, R10 (through OBJ-2) | |
| spec #2 | A group carries a colour and a description, as a classification does. *(2026-11-23)* | | **UNMAPPED** |
| spec #3 | A group has its own progress page: its projects, funding and performance measures, added up from everything … | 02 R4; 21 R3, R9, R10, R11 (through RUL-1, RUL-18) | |
| spec #4 | A group has no performance measures or targets of its own. Rejected: letting a group list measures and set … | 02 R4; 05 R10; 21 R3, R9, R10, R11 (through OBJ-3, RUL-1, RUL-18) | |
| spec #5 | Projects are filed on classifications only, never directly on a group. A group's projects are the projects of … | 02 R4 (through RUL-1) | |
| spec #6 | The Classifications index has two views, switched by a toggle: **Outline**, the whole tree as one table, and … | 15 R2, R3, R6, R7; 17 R2, R3, R4, R6, R8, R9, R10, R15 (through SCR-2, SCR-3, RUL-24) | |
| spec #7 | In Outline every column means one thing on every row: Name, Projects, Funders, Performance measures (a … | 15 R2, R3, R4, R5, R6, R7 (through SCR-2, RUL-23) | |
| spec #8 | In Browse the list shows every level of the tree: groups and the classifications in them. Groups start folded … | 17 R2, R3, R4, R6, R8, R9, R10, R15 (through SCR-3, RUL-24) | |
| spec #9 | Wherever a classification is listed under, or tagged with, its group (the index's two views, a group's cards, … | 15 R4, R5 (through RUL-6) | |
| spec #10 | In the classification side panel the group's badge carries the group's colour, as a light tint under dark … | 15 R4, R5; 18 R3, R4, R5, R6, R7 (through STA-17, RUL-6) | |
| spec #11 | A classification's page and a group's page each carry an edit button in the header ("Edit classification", … | 13 R1, R2, R6 (through RUL-30) | |
| spec #12 | ~~A top-level group declares its levels: the name of each level beneath it, top down. The number of names is … | | **UNMAPPED** |
| spec #13 | ~~Every branch of one top-level group is the same depth, and only the deepest level holds classifications. A … | | **UNMAPPED** |
| spec #14 | ~~Everything below a top-level group is added from the row it goes inside, and the add names the level it … | | **UNMAPPED** |
| spec #15 | The settings list is one tree table per top-level group. A classification's row shows projects, performance … | | **UNMAPPED** |
| spec #16 | ~~A level can be renamed at any time. Levels can be added or removed only while the top-level group is … | | **UNMAPPED** |
| spec #17 | ~~A level's name is optional. Unnamed, a level reads as "group", or "classification" at the last level, and … | | **UNMAPPED** |
| spec #18 | Adding a classification or a group inside a top-level group is adding a row in place, as on Tags: the add … | 02 R8, R9, R10 (through STA-31, ACN-21, RUL-11) | |
| spec #19 | Classifications and groups are moved on the settings list as tags are: every row has a grip, shown on hover … | 07 R3, R4, R5; 08 R1, R3, R4; 09 R3, R5, R8, R9 (through ACN-26, ACN-27, ACN-42) | |
| spec #20 | The classification tree is free. A group may hold groups and classifications together; any group may be moved … | 07 R3, R4, R5; 08 R1, R2, R3, R4, R8 (through ACN-27, ACN-42, RUL-3) | |
| spec #21 | A classification can become a group, and a group a classification, keeping its name, colour, description and … | 11 R1, R2, R3, R4, R5, R6, R7, R10, R11; 12 R1, R2, R3, R4, R5, R6, R8, R10 (through ACN-23, ACN-24, RUL-9, RUL-10) | |
| spec #22 | On the settings list each group has one "Add" (Classification, Group) that opens a row inside it, and the … | 02 R6, R7 (through ACN-18, ACN-20) | |
| spec #23 | Groups fold on the settings list: a chevron on each group's line hides what is inside it, and the folded set … | 08 R9; 09 R10; 10 R1, R2, R3, R4, R5, R7, R8, R9 (through STA-29, ACN-28, RUL-28, RUL-90, RUL-91) | |
| spec #24 | The settings list has no "Targets set" column: a classification's row shows projects and performance … | 02 R3 (through RUL-27) | |
| spec #25 | A classification is always in a group. Moved out of every group — "Move to top level", or dropped at the top … | 02 R6; 09 R3, R5, R8, R9; 11 R10, R11, R12; 12 R1, R2, R10 (through ACN-18, ACN-23, ACN-26, RUL-2, RUL-41, RUL-86) | |
| spec #26 | Dragging on the settings list shows what will become part of what before anything moves, as Finder and … | 09 R1, R2, R3, R4, R5, R8, R9, R11 (through STA-33, ACN-26, RUL-12) | |
| spec #27 | An order arranged by hand can be put back to alphabetical. "Sort A to Z" in a group's menu sorts what is … | 07 R1, R2, R6, R7, R8, R9 (through ACN-19, ACN-22, RUL-7) | |
| spec #28 | Inside the app the Classifications pages count every project. The public site's classification figures count … | | **UNMAPPED** |
| spec #29 | Converting a classification that projects use goes ahead only after a confirm that says what will happen (the … | | **UNMAPPED** |
| spec #30 | Moving a client's ProjectFirma 1.x taxonomy into the product is out of scope for this feature. It will be … | | **UNMAPPED** |
| spec #31 | The settings list is grouped rows on one column grid (the Tags construction): Name, Projects and Performance … | | **UNMAPPED** |
| spec #32 | A classification or group rolls up every performance measure that any project beneath it reports toward, … | | **UNMAPPED** |
| spec #33 | A classification and a group can each have an icon, chosen on their own settings page (shortlist and search, … | | **UNMAPPED** |

## Counts per story

| # | Story | Type | Release | Lines | Requirements | Scenarios | Status | Blocked by |
|---|---|---|---|---|---|---|---|---|
| 01 | The classification tree is saved, and every page reads what is saved | enabler | first | 151 | 8 | 9 | needs-triage | none |
| 02 | Administrator adds a group and a classification in place and sees them listed | story | first | 200 | 14 | 13 **(over 12)** | needs-triage | 01 |
| 03 | Administrator edits a classification's name, description, group and colour | story | first | 173 | 10 | 12 | needs-triage | 02 |
| 04 | Administrator edits a group's name, description, parent group and colour | story | first | 174 | 10 | 12 | needs-triage | 02, 03 |
| 05 | Administrator sets a goal for a performance measure on a classification | story | first | 191 | 13 | 12 | needs-triage | 03 |
| 06 | Administrator removes a classification or group nothing depends on | story | first | 177 | 12 | 11 | needs-triage | 02 |
| 07 | Administrator puts rows in order: move up or down, or sort A to Z | story | first | 169 | 10 | 12 | needs-triage | 02 |
| 08 | Administrator moves rows into other groups from the grip menu | story | first | 169 | 9 | 12 | needs-triage | 02, 10 |
| 09 | Administrator drags rows and sees what will join what before letting go | story | first | 179 | 12 | 12 | needs-triage | 07, 08, 10 |
| 10 | Administrator folds groups on the settings list, and the folds are remembered | story | first | 157 | 9 | 10 | needs-triage | 02 |
| 11 | Administrator turns a classification into a group, after being told what happens | story | first | 184 | 13 | 11 | needs-triage | 05, 08, 09 |
| 12 | Administrator turns a group into a classification, keeping or removing what it held | story | first | 162 | 10 | 10 | needs-triage | 08, 11 |
| 13 | Only people the "Manage classifications" setting lets in see the edit buttons | story | first | 173 | 10 | 12 | needs-triage | 03, 04 |
| 14 | Reader sees how far along a classification is on its own page | story | first | 199 | 13 | 14 **(over 12)** | needs-triage | 05 |
| 15 | Reader scans the whole tree in Outline and opens a classification's measures | story | first | 199 | 14 | 14 **(over 12)** | needs-triage | 14 |
| 16 | Reader reads a ring's measure name and figure by hovering it | story | first | 138 | 7 | 8 | needs-triage | 15 |
| 17 | Reader switches to Browse and reads one group or classification in full | story | first | 205 | 16 | 14 **(over 12)** | needs-triage | 15 |
| 18 | Reader peeks at a classification from its row without leaving the list | story | first | 193 | 11 | 14 **(over 12)** | needs-triage | 15, 17 |
| 19 | Reader sees which projects make up a classification's figures | story | first | 177 | 9 | 13 **(over 12)** | needs-triage | 14 |
| 20 | Reader sees who funds a classification's projects | story | first | 160 | 9 | 11 | needs-triage | 14 |
| 21 | Reader reads a group's progress on its own page, with what it holds | story | first | 186 | 11 | 14 **(over 12)** | needs-triage | 14, 19, 20 |
| 22 | Each reader sees the figures they are meant to see | story | first | 161 | 6 | 12 | needs-triage | 14, 15, 17, 18, 19, 20, 21 |
| 23 | Reader sees a sensible page when nothing is set up and when a record is removed | story | first | 144 | 7 | 9 | needs-triage | 15, 17, 06 |
| | **23 stories** | | | 4021 | 243 | 271 | | |

## Build order

1. 01
2. 02
3. 03, 06, 07, 10
4. 04, 05, 08
5. 09, 13, 14
6. 11, 15, 19, 20
7. 12, 16, 17, 21
8. 18, 23
9. 22

## Findings

- **story that covers nothing** (1)
  - 01: Covers: artifacts: browser store, draft routes, reading pages built from seeded data, seeded targets
- **Trace row that names no inventory item** (7)
  - 01 R1
  - 01 R2
  - 01 R3
  - 01 R4
  - 01 R7
  - 01 R8
  - 03 R9
- **Trace cites an item the story does not cover, without 'relies on'** (3)
  - 01 R5 cites RUL-7 (covered by: 07)
  - 01 R6 cites RUL-34 (covered by: no story)
  - 22 R5 cites RUL-32 (covered by: no story)
- **'relies on' a story that is not in Blocked by (directly or through its blockers)** (2)
  - 14 R1: story 15, RUL-95
  - 21 R1: story 15, RUL-95
- **UAT Preconditions need a story outside Blocked by (directly or through its blockers)** (2)
  - 01: needs 02, 14, 15, 17; Blocked by none
  - 05: needs 14; Blocked by 03
- **Scenarios section names a story outside Blocked by (read: does a Given need it?)** (5)
  - 01: names 02, 14, 15, 17
  - 04: names 11, 12
  - 05: names 14
  - 07: names 15
  - 21: names 08
- **story with more than 12 scenarios** (7)
  - 02: 13
  - 14: 14
  - 15: 14
  - 17: 14
  - 18: 14
  - 19: 13
  - 21: 14
- **story with no 'As a …' line** (22)
  - 02
  - 03
  - 04
  - 05
  - 06
  - 07
  - 08
  - 09
  - 10
  - 11
  - 12
  - 13
  - 14
  - 15
  - 16
  - 17
  - 18
  - 19
  - 20
  - 21
  - 22
  - 23
- **requirement names an open question the story's Open questions does not list** (10)
  - 03 R10: Q-235
  - 04 R10: Q-235
  - 11 R13: Q-235
  - 14 R1: Q-235
  - 15 R14: Q-235
  - 17 R16: Q-235
  - 18 R3: Q-235
  - 21 R1: Q-235
  - 22 R2: Q-187
  - 22 R2: Q-201
- **requirement with no scenario** (1)
  - 11 R13
- **epic and story disagree on Epic** (23)
  - 01: listed in pic, story says none
  - 02: listed in pic, story says E-A Set up and arrange the classification tree
  - 03: listed in pic, story says E-A Set up and arrange the classification tree
  - 04: listed in pic, story says E-A Set up and arrange the classification tree
  - 05: listed in pic, story says E-A Set up and arrange the classification tree
  - 06: listed in pic, story says E-A Set up and arrange the classification tree
  - 07: listed in pic, story says E-A Set up and arrange the classification tree
  - 10: listed in pic, story says E-A Set up and arrange the classification tree
  - 08: listed in pic, story says E-A Set up and arrange the classification tree
  - 09: listed in pic, story says E-A Set up and arrange the classification tree
  - 12: listed in pic, story says E-A Set up and arrange the classification tree
  - 11: listed in pic, story says E-A Set up and arrange the classification tree
  - 13: listed in pic, story says E-A Set up and arrange the classification tree
  - 14: listed in pic, story says E-B Read progress against the tree
  - 15: listed in pic, story says E-B Read progress against the tree
  - 19: listed in pic, story says E-B Read progress against the tree
  - 20: listed in pic, story says E-B Read progress against the tree
  - 16: listed in pic, story says E-B Read progress against the tree
  - 17: listed in pic, story says E-B Read progress against the tree
  - 18: listed in pic, story says E-B Read progress against the tree
  - 21: listed in pic, story says E-B Read progress against the tree
  - 22: listed in pic, story says E-B Read progress against the tree
  - 23: listed in pic, story says E-B Read progress against the tree
- **epic lists a story before one that blocks it** (1)
  - pic: 12 before 11
- **spec decision with no inventory item and no exclusion in the map** (13)
  - #2
  - #12
  - #13
  - #14
  - #15
  - #16
  - #17
  - #28
  - #29
  - #30
  - #31
  - #32
  - #33

## Accepted by the user

None yet. Each finding the user accepts is listed here with the date.

## Added by hand

Findings the script cannot see (for example, a scenario that cannot be reached with the story's blockers alone). Kept when the script rewrites this file.
