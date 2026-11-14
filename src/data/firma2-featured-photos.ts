// Which photo leads each project's public page — the record's Featured photo.
// Kept beside the project data rather than in it (firma2-project-detail is
// another workstream's file); keyed by project slug, valued by the photo's
// position in the record's gallery, oldest first.
//
// A project with photos always has one Featured: the seeds below, else its
// newest photo — the after picture, which is what a public reader wants to
// see first. A manager changes it from the project's Photos section
// (firma2-project-gallery); this browser remembers the change
// (src/lib/featured-photo.ts) and the public page follows it.

/** Hand-picked seeds: a before-and-after project leads with its site, not its newest frame. */
export const FEATURED_PHOTO: Record<string, number> = {
  'scott-river-fish-passage-barrier-removal': 1,
  'deer-creek-riparian-corridor-enhancement': 0,
  'red-clover-valley-meadow-reconnection': 1,
  'navarro-river-large-wood-placement': 0,
};

/** The seeded Featured index for a record with `count` photos; -1 with none. */
export const seededFeatured = (slug: string, count: number): number => {
  if (count === 0) return -1;
  const seeded = FEATURED_PHOTO[slug];
  return seeded !== undefined && seeded < count ? seeded : count - 1;
};
