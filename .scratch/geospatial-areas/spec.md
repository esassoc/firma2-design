# Geospatial areas

Started 2026-11-24. Mock content is invented.

ProjectFirma 1 had geospatial areas: groups of areas (watersheds, habitat areas, districts) drawn from a spatial layer, which a project belongs to because of where its work is. Each area carries its own description and performance measures, and the group can be drawn on maps. ProjectFirma 2 needs them. The question was how they relate to classifications, which already give a project something to be filed under, with performance measures and optional targets.

For: Program staff (Administrator), often with a GIS analyst beside them, who set the groups up. Everyone who filters, reports or reads a map meets the areas afterwards, the same way they meet classifications.

The brief's five questions are answered in each route's header (`ws/geospatial-areas`, `ws/geospatial-areas/new`, `ws/geospatial-areas/group`).

## Decisions

| # | Decision |
|---|----------|
| 1 | Geospatial areas are separate to set up and the same to use. They have their own settings page beside Map layers and their own term, and they do not sit in the classification tree. Everywhere a reader meets classification groups (project filters, performance-measure breakdowns, map colouring, public pages) a geospatial area group appears alongside them. Rejected: making them ordinary classifications, which puts a "not for geospatial" exception on every classification editing screen; and a fully separate entity, which makes every filter and report handle two kinds. *(2026-11-24)* |
| 2 | Adding geospatial areas is one action, and where they come from is its first question: a layer already on Map layers, or an uploaded file (zipped shapefile, .gdb folder, GeoJSON). Each shape becomes one area. A file also becomes a layer on Map layers, so it is styled and drawn there. Rejected: a group that can only read a layer set up on Map layers first, which left a person with a shapefile nowhere to start. *(2026-11-24; the user: "the action is still the same, adding one whether you're using a GIS connection or adding it from a shapefile"; answers Q-235)* |
| 3 | A person can edit an area group and each of its areas. The group has a name, a description and a colour. Each area has its own page with a description, a colour (its group's until changed), and performance measures with a target for each; a target is optional, as on a classification. An area's name, shape and acreage come from the layer and are not edited. *(2026-11-24; the user: "like the color, or the PMs goals")* |
| 4 | Each geospatial area has a reader's page analogous to a classification's: its description and four totals (projects, estimated cost, spent, funders), its performance measures against their targets, its projects, and its funders. It adds a map of the area and its projects. "Edit area" opens its settings page. *(2026-11-24; the user: "an analogous page to classification detail page but for geospatial area")* |
| 5 | The reader's "Geospatial areas" page is a map, built like the Map page: the areas of one group drawn on a map that fills the sheet, the projects as dots, and the areas listed in a column over it (name, projects, acres; most projects first). Hovering a row lights its area and the reverse. What a click does is decision 6. It replaces a table with no map. *(2026-11-24; the user: "why is there no maps when looking at a geospatial area. It should look more like the map page")* |
| 6 | Selecting an area, by its name in the list or its shape on the map, keeps the reader on the map: the map zooms to the area, the other areas fade, and the area's projects show as their work areas. The column swaps the list for the area's short account: group, name, description, the four totals, up to three performance measures (those with a target first), its projects, and "Open area page" for the full page. "All areas", Back or Escape returns to the list. The address carries the group and the area, so a selection can be linked. *(2026-11-24; proposed by me, the user: "yes")* |
| 7 | Clicking a project on this page, in an area's column or on the map, opens the project side sheet. It does not show a project card. *(2026-11-24; the user: "clicking on the actual projects then should bring the project side sheet")* |

## Built as proposed, not yet confirmed

The prototype does these; each is a proposal until the user settles it, and each has a question in `.scratch/open-questions.md`.

- An uploaded file becomes a reference layer on Map layers when the group is added (my reading of decision 2's "set up once"; the user has not said so).
- One group per layer: a layer a group already reads is not offered to a second group (Q-236).
- Only layers that send shapes can be read. A WMS or a map server sends a picture and is not offered (Q-236).
- A project is filed under every area its work touches, with no share of overlap (Q-237).
- Projects outside every area, and projects with no location, are listed under the areas with their counts (Q-237).
- An area's colour shows on its group's page and map only. On other maps the layer is still drawn in the one style set on Map layers.
- "Geospatial areas" sits in the app's navigation after Classifications (my placement).
- The areas map shows one group at a time; a select switches group when there are two or more. Search narrows by area name only.
- While the project side sheet is open on the areas map, the floating column folds to its search field and the map refits to the room left; closing the sheet brings the column back. The Map page does not do this (its column stays over a narrowed map).
- Under the list, the map's gaps are counted: projects outside every area, and projects with no location.
- Deleting a layer on Map layers leaves the group in place, marked "Layer deleted"; Map layers does not warn (Q-238).

## Not built

- A reader's page for an area group, adding up its areas (a classification group has one).
- The rest of the reader's side: project filters, performance-measure breakdowns, "Color work areas by", a project's own page naming its areas, public pages (decision 1 says they belong there).
- Correcting one project's filing by hand, and filing a project that has no location (Q-239).
- "Classify projects by this layer" from a layer on Map layers.
- Replacing a group's file with a newer one, and matching its areas to the old ones.
- A third source: a GIS connection chosen on the add page itself (today a service is added on Map layers first, then picked as "Map layer").

## What is faked

See the header of `src/lib/geospatial-areas.ts`: the shapes (two service layers have any), reading an uploaded file (any file reads as five sample habitat areas), the name field, and the "touches" test. The reader's pages are static routes built from the seeded groups and each project's recorded work areas, so a group added in the browser has no reader's pages and a work area redrawn in the browser does not move a project there.

## A real file, in dev only

A spatial file converted to `docs/private/<tenant>/area-files.json` (gitignored) shows in `astro dev` as a reference layer and an area group, on the same terms as the real workspace: every build gets none. Its areas, names and acres are read from the file, and projects are filed against its true shapes (simplified to about 200 m). The conversion was done by hand for the one file on disk; the upload on the add page still reads nothing.
