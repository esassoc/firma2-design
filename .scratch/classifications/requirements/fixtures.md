# Fixtures — classifications

The sample workspace, people and records every scenario and UAT script in this feature uses. A story names a fixture and its rows (`F1`, `F2.3`) and does not repeat them. Written 2026-11-24 from `inventory.md` and from the invented sample the prototype builds (every name here is invented; no client data is used or quoted).

**What a figure here is.** Every number below is what the invented sample produces for the shape it has: 24 projects. It is a stand-in for "a workspace loaded with this sample"; the development team's test workspace is loaded with the same projects, performance measures and funding so the same figures appear. If a figure ever differs in the built product, the fixture is wrong, not the product, until the team agrees which.

**The test environment.** A test workspace, provided by the development team, loaded with the 24 projects and the performance measure catalog of this sample and with the classification tree in F1 already set up. A script says which tree it starts from. Stories 02 to 12 change the tree; each script returns it to F1 under **Reset**.

## F1 — The sample tree

Two top-level groups, in this order (the settings list and the Classifications page show them in this order).

| Top-level group | What it holds | Colour |
|---|---|---|
| Plan goal | seven classifications (F1.1), no groups | blue |
| Practice area | four groups (F1.2), no classifications of its own | grey |

**F1.1 Plan goal's classifications**, in this order: Salmon & steelhead recovery · Riparian & wetland habitat · Water quality · Water supply reliability · Wildfire resilience · Flood risk reduction · Public access & recreation.

**F1.2 Practice area's groups**, in this order, each holding three classifications:

| Group | Its classifications |
|---|---|
| Channels & fish passage | Barrier removal & fish screens · Instream habitat structures · Side channels & floodplains |
| Vegetation & wetlands | Native planting · Invasive plant removal · Meadow & marsh rewetting |
| Forests & fuels | Forest thinning · Fuel breaks · Prescribed fire |
| Runoff & groundwater | Erosion & sediment control · Stormwater capture · Groundwater recharge |

Descriptions: each group and classification has a one-line description (for example Salmon & steelhead recovery: "Spawning and rearing habitat for listed runs."; Forests & fuels: "Thinning, fuel breaks and burning that change how fire moves through a forest."). A group's colour is its own; a classification's swatch in the Classifications page's lists, on the group page's cards and in the peek is its parent group's colour (spec #9). The settings list draws a swatch on a group's line only.

**Not in F1** (a script makes it): a group holding both groups and classifications, a third level of groups, an empty group, a classification no project works toward. Where a script needs one, it says how to make it with story 02.

## F2 — What the Classifications page shows for F1 (the Outline)

Read as: Projects, Funders, Performance measures (a count). A group's row counts what is beneath it, each project once.

| Row | Projects | Funders | Performance measures |
|---|---|---|---|
| Plan goal (group) | 24 | 33 | 19 |
| Salmon & steelhead recovery | 11 | 17 | 9 |
| Riparian & wetland habitat | 9 | 15 | 8 |
| Water quality | 4 | 8 | 6 |
| Water supply reliability | 5 | 10 | 7 |
| Wildfire resilience | 2 | 4 | 4 |
| Flood risk reduction | 5 | 11 | 7 |
| Public access & recreation | 1 | 3 | 3 |
| Practice area (group) | 24 | 33 | 18 |
| Channels & fish passage (group) | 10 | 14 | 6 |
| Barrier removal & fish screens | 3 | 5 | 2 |
| Instream habitat structures | 4 | 7 | 2 |
| Side channels & floodplains | 3 | 7 | 4 |
| Vegetation & wetlands (group) | 9 | 15 | 8 |
| Native planting | 2 | 3 | 4 |
| Invasive plant removal | 2 | 5 | 3 |
| Meadow & marsh rewetting | 5 | 10 | 4 |
| Forests & fuels (group) | 2 | 4 | 3 |
| Forest thinning | 1 | 3 | 3 |
| Fuel breaks | 1 | 2 | 1 |
| Prescribed fire | 1 | 3 | 3 |
| Runoff & groundwater (group) | 4 | 8 | 7 |
| Erosion & sediment control | 2 | 4 | 3 |
| Stormwater capture | 1 | 3 | 2 |
| Groundwater recharge | 1 | 3 | 2 |

A group's row says how many classifications are beneath it ("Plan goal 7 classifications", "Practice area 12 classifications", "Forests & fuels 3 classifications") and shows no ring.

The measures count is every performance measure that any project under the row reports toward, linked or not (spec #32). It is larger than the number linked: Salmon & steelhead recovery has four linked and nine in all. Plan goal and Practice area count each measure once. Recomputed 2026-11-24 from the prototype's sample.

## F3 — Performance measures, as each classification shows them

Each line is one performance measure under one classification, with its figure as the product words it. `Goal` is the target an administrator set; `planned` is what projects planned when there is none.

| # | Under | Measure | Figure shown | Share of the goal | Which state it shows |
|---|---|---|---|---|---|
| F3.1 | Salmon & steelhead recovery | Stream miles of instream habitat improved | 14.5 of 30 miles goal | 48% | has a goal, partly reported |
| F3.2 | Salmon & steelhead recovery | Fish passage barriers removed | 0 of 12 goal | 0% | has a goal, nothing yet reported toward it |
| F3.3 | Salmon & steelhead recovery | Acres of floodplain habitat reconnected | 106 of 1,000 acres goal | 11% | has a goal, over-planned: projects planned more than the goal, so there is no "not yet planned" line |
| F3.3a | Salmon & steelhead recovery | Stream miles reopened to fish | 0 of 25 miles goal | 0% | has a goal; 6.5 not yet planned (the classification's fourth measure) |
| F3.4 | Riparian & wetland habitat | Native plants installed | 13,067 of 25,000 plants goal | 52% | has a goal |
| F3.5 | Riparian & wetland habitat | Plant survival rate | — of 80% goal | — | a percentage that does not add: averaged over the projects that reported; none did |
| F3.6 | Water quality | Acres of riparian habitat restored | 11.1 of 18 acres planned | | no goal: measured against what projects planned, "No goal set" |
| F3.7 | Wildfire resilience | Tons of biomass removed in fuels treatment | Not reported | | no project reported toward it |
| F3.8 | Fuel breaks | Miles of fuel break completed | 9.2 of 9.2 miles planned | | no goal; fully planned (no "not yet planned" line) |
| F3.9 | Flood risk reduction | Acres of wetland and meadow restored | 173 of 240 acres planned | | no goal |
| F3.10 | Public access & recreation | Volunteer hours contributed | Not reported | | no project reported toward it |
| F3.11 | a classification added in Settings that no project carries | (none) | "No performance measures yet" | | no performance measures: nothing linked and nothing reported (no sample classification is in this state; add one with story 02) |
| F3.12 | Salmon & steelhead recovery | Volunteer hours contributed | 1,478 of 2,400 hours planned | | reported by projects, not linked: "No goal set", measured against what projects planned, listed after the linked measures |

The rest of the sample's goals carry targets that are uneven on purpose: some measures are ahead of what their projects planned, some behind, some have no target. A script that needs a "not yet planned" line uses F3.1 (the goal is 30 miles; the line reads "14.8 not yet planned") or F3.2 ("5 not yet planned"). The line carries no unit.

## F4 — A classification's and a group's own page

| Page | Projects | Estimated cost | Spent to date | Funders |
|---|---|---|---|---|
| Salmon & steelhead recovery | 11 of 24 in the portfolio | $19,507,000 | $10,904,000 (56% of estimated cost) | 17 |
| Wildfire resilience | 2 of 24 | $11,330,000 | $6,124,500 (54%) | 4 |
| Fuel breaks | 1 of 24 | $1,690,000 | $1,690,000 (100%) | 2 |
| Prescribed fire | 1 of 24 | $9,640,000 | $4,434,500 (46%) | 3 |
| Public access & recreation | 1 of 24 | $3,120,000 | $0 (0%) | 3 |
| Practice area (group) | 24 of 24 | $42,424,500 | $19,396,500 (46%) | 33 |
| Forests & fuels (group) | 2 of 24 | $11,330,000 | $6,124,500 (54%) | 4 |
| Plan goal (group) | 24 of 24 | $42,424,500 | $19,396,500 (46%) | 33 |

"Funders" counts organizations that administer a funding source on those projects. On every page above the funding section carries the note "Whole-project amounts, so totals overlap across classifications." because at least one project carries more than one classification. Practice area's four areas add up to 25 projects (10 + 9 + 2 + 4) but its own page and row say 24: one project carries classifications in two areas and a group counts each project once.

## F5 — People and the setting

| Person | Role | Organization | Can change classifications |
|---|---|---|---|
| Ada, Administrator | Administrator | any | yes |
| Cam, Contributor | Contributor | one organization | no (the setting is at its default) |
| Vera, Viewer | Viewer | one organization | no |
| Max, Manager | Contributor with the Manager flag of one organization | one organization | no (the setting is at its default); yes when the setting is widened to include managers |
| Noor, Viewer with no organization | Viewer | none | no |

Workspace setting: Security › Manage classifications = Administrators (the default). A script that needs the setting wider says so.

## F6 — The same classifications, inside the app and on the public site

The public site counts only published projects. Projects in the app that are not published are the difference.

| Classification | Projects in the app | Projects on the public site |
|---|---|---|
| Salmon & steelhead recovery | 11 | 9 |
| Riparian & wetland habitat | 9 | 5 |
| Water quality | 4 | 3 |
| Water supply reliability | 5 | 4 |
| Wildfire resilience | 2 | 1 |
| Flood risk reduction | 5 | 2 |
| Public access & recreation | 1 | 1 |

Flood risk reduction (5 against 2) is the clearest pair; Public access & recreation (1 and 1) is the case where nothing differs. A Viewer with no organization sees the right-hand column on the Classifications pages (story 22).

## F7 — Records the setup scripts use

| What | Where | Why it is useful |
|---|---|---|
| Native planting | Vegetation & wetlands; 2 projects; 2 performance measures (Native plants installed, Carbon stored per year) | a classification in use: converting it asks first; removing it is refused |
| Invasive plant removal | Vegetation & wetlands; 2 projects; no performance measures | in use, with no measures |
| Forests & fuels | Practice area; holds 3 classifications, 2 of which projects work toward | a group that holds something and sits inside another group: converting it to a classification asks what happens to what it holds |
| Plan goal | top level; holds 7 classifications | a top-level group: has no "Convert to classification"; removal refused while it holds anything |
| A classification the script adds | made with story 02 in any group | a classification no project works toward: can be removed and converted without a question |
| A group the script adds | made with story 02 at the top level, empty | an empty group: can be removed; "Remove them" and "Keep them" are not asked |

Names a script types are described by kind ("a name no group and no classification has"); the tester chooses them. A name that is already in use for the refusal scenarios is any name from F1.

## F8 — Performance measures a script links

The measure catalog of the sample. A script that links a measure to a classification picks one the classification does not yet have. Used by story 05: "Acres of floodplain habitat reconnected" (unit acres), "Miles of fuel break completed" (miles), "Plant survival rate" (percent), "Native plants installed" (plants). A retired measure is one the catalog marks Retired; none is linked in F1.

## F9 — Samples the feature still needs

Shapes and records the stories use that the sample above does not hold. The development team adds them to the test workspace (or a script makes them with story 02); until then a story describes the data by kind.

| What | Used by | How to have it |
|---|---|---|
| An empty workspace: no groups, no classifications | 02 (first-run), 23 | a second test workspace, used once: the last group cannot be removed |
| An empty group inside another group; a group inside a group holding two classifications no project carries and a subgroup holding one | 03, 04, 06, 12 | add with story 02 to F1 |
| A group whose classifications are named so that Sort A to Z shows numbers read as numbers and case ignored: names ending 1, 2 and 10, one in lower case | 07 | add with story 02 |
| A classification with performance measures linked and no project | 11 | add with story 02, link with story 05 |
| A group that shares a name with a classification, and a classification that shares a name with a group | 02, 11, 12 | add with story 02 |
| A workspace where every catalog measure is already linked to one classification | 05 | link all with story 05 |
| A retired measure that is linked to a classification | 05 | retire it in Performance measures |
| A project carrying two classifications and one grant | 20, 21 | in the sample (the overlap note shows) |
| A project with a year inside its span in which nothing was filed | 19 | in the sample; the Detailed table shows "—" there |
| A classification with more than three performance measures | 21 | Riparian & wetland habitat has five |
| Two funders with equal totals on one classification; a funder with two sources on one project | 20 | to be added to the test workspace |
| A measure at about 99.6% of its goal and one over its goal | 14 | to be added: the share must show 99% and 100% |
| A project whose row reports a measure in a different unit than the measure (acres against miles) | 14 | to be added to the test workspace |
| For F6: the estimated cost, spent, funders and measures of the published-only sets | 22 | to be computed by the team from the published projects |

## Reset

A script that changes the tree says how to return to F1. In the built product: restore the test workspace's saved tree. On the prototype: see below.

## On the prototype

The prototype keeps every change in the browser, not in a saved workspace. To walk a script on it:

1. Use the invented sample: run `npm run build` and `npx astro preview`, then open the site under `/firma2-design/` (the development server may show a different tree if a private workspace file is on disk; the invented sample is what a build always shows).
2. The classification pages are at `/prototypes/classifications` (the Classifications page) and `/prototypes/workspace-settings/classifications` (Settings › Classifications); a record's page opens from its name.
3. A group or classification added in the browser opens on a "draft" address (`…/draft?slug=…`) because a static site cannot build a page for it; the built product has an ordinary page.
4. The Classifications page and a group's page are drawn from the original tree, so a change made in Settings does not show there on the prototype; the built product shows it.
5. Everyone who opens the prototype sees the edit buttons and the settings; the built product hides them from anyone the setting does not let in.
6. Reset: clear this site's data in the browser (storage and cookies for the address), then reload.
