# Project photos — what a photo says about itself

Status: exploring

Started 2026-11-24 from the user's note that the photos experience was thin and
that metadata was not captured: whether a photo is featured, part of a
before/after pair, part of a carousel.

## Problem Statement

A photo on a project record held a caption, a month label and a credit.
Featured lived in a separate browser store. "Before and after" on the public
page was a guess: the oldest photo against the newest. The carousel was the
lightbox stepping through everything. A project that opens on a mid-work photo,
or whose newest photo is a crew in the field, put the wrong picture in front of
the public.

## Solution

A photo stores what it is: its stage, the named point it was taken from, an
optional collection, whether the public may see it, the day it was taken, the
work area in frame, credit and alt text. Pairs and timelines come from photo
points rather than from a flag. The gallery edits all of it in a docked sheet,
reorders by drag, and adds many files at once, reading the day and location
from each file. The public page draws its lead photo, its compare and its
gallery from the same record.

Actors: anyone who can edit the project (Contributor and above) edits photos;
a visitor sees only photos marked public.

## Decisions

| # | Decision | Why |
|---|---|---|
| 1 | A photo has a **stage**: Before, During or After. Stored, never inferred from its date. | A project can open on a during photo; the public page must not call it "before". Team 5's Before/During/After timing is the same idea, folded in. |
| 2 | A **photo point** is a named vantage ("Main site, looking upstream"). Two or more photos at one point are one view over time. A Before and an After at one point are a **pair**; the public compare uses the first complete pair of public photos. | Monitoring protocols already revisit named photo points. One concept covers pairs and timelines; no separate "pair" flag to keep in step. |
| 3 | A **collection** is a named, ordered set; a photo is in at most one. The gallery filters by it and the viewer pages within it. | This is the carousel. One collection per photo keeps the picker a single choice. |
| 4 | **Featured** is a fact of the record: one photo per project. It cannot be switched off, only moved. A photo that is not public cannot lead the public page; the newest public photo does instead. | A private frame must never front a public page. |
| 5 | **Show on the public page** is a per-photo yes/no, default yes. Photos with people in the frame (the seed's crew photos) start as no. | Consent for a public page is not permission to file a photo. |
| 6 | **Taken on** is a real day; the month label is derived from it. A file's EXIF day fills it; with a GPS position, the work area within 3 km fills the work area. | Dates were stored as formatted strings; EXIF saves retyping a dozen photos. |
| 7 | **Alt text** is separate from the caption. Empty alt falls back to the caption on the public compare only. | The caption says what the work is; alt says what is visible. Repeating one as the other makes a screen reader say it twice. |
| 8 | Every field **saves as it changes**; there is no Save. | The record is always editable (brief §7). |
| 9 | Photos reorder by drag or the grip's menu (bcn-sortable-list, grid). Reordering is off while a filter hides tiles. | Moving a photo past ones you cannot see is not a move you can check. |
| 10 | Details live in a docked `bcn-side-sheet` beside the grid, never a modal. | Side sheets dock (memory: side-sheets-dock). |
| 11 | A multi-file drop adds all files, then offers one stage for the whole batch. Non-image files are ignored. | Field crews upload a day's photos together. |

## Faked in the prototype

- Edits persist in `localStorage` (`firma2:photo-meta`); the order, patches and
  removals are per browser.
- A photo added in the browser is a blob URL: it lasts until reload and cannot
  be Featured.
- The public page follows edits made in the same browser, the way Featured did.
- Stand-in pictures are stock (see `src/lib/project-photos.ts`).

## Open questions

- Should a Before/After pair be allowed across photo points of different
  projects? Proposed: no, a photo point belongs to one project.
- Should deleting a Featured photo move Featured to the newest public photo, or
  ask? Proposed: it moves silently to the newest public photo and says so.
- Does a visitor see the photo point name? Proposed: no, only in the compare's
  caption.

## Files

- `src/data/firma2-project-detail.ts` (ProjectPhoto, buildPhotos)
- `src/lib/photo-meta.ts`, `src/lib/exif.ts`, `src/lib/lightbox.ts`
- `src/components/projects/firma2-project-gallery.astro`, `firma2-photo-tile.astro`
- `src/components/shared/firma2-lightbox.astro`
- `src/components/public/firma2-public-project.astro`
