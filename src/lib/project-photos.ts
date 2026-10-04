/**
 * The stand-in pictures behind a ProjectPhoto record. No real project
 * photography can appear in this public repo, so a photo's scene and seed pick
 * a curated Unsplash landscape — the presentation half of the ProjectPhoto
 * contract (see firma2-project-detail). Shared by the record's gallery and the
 * My Projects cards, so a project's cover is a picture its gallery holds.
 */
import type { ProjectPhoto } from '../data/firma2-project-detail';

// Curated Unsplash photo IDs per scene kind — every one fetched and REVIEWED
// on a rendered contact sheet before earning its slot (an ID that 404s or
// resolves to a beach would ship 24 broken galleries). Ordering within a pool
// is deliberate: the most scene-typical frames first, context frames (uplands,
// access roads, valley floors) later, because low-index picks are the ones
// short galleries land on. Some IDs serve two pools — a valley oak is both a
// meadow and a floodplain — which is fine across projects; uniqueness only
// matters within one gallery, and the seed stride guarantees that per pool.
export const SCENE_IMAGES: Record<ProjectPhoto['scene'], string[]> = {
  stream: [
    '1506744038136-46273834b3fb', // river across a granite valley floor
    '1473448912268-2022ce9509d8', // river running through conifer forest
    '1432405972618-c60b0225b8f9', // creek falls into a boulder pool
    '1433086966358-54859d0ed716', // falls in a forested gorge
    '1502082553048-f009c37129b9', // lone valley oak on a grassland floodplain
    '1426604966848-d7adac402bff', // pines on a valley floor below granite
  ],
  meadow: [
    '1470071459604-3b5ec3a7fe05', // green hills under first light
    '1465146344425-f00d5f5c8f07', // poppies through dry grass
    '1502082553048-f009c37129b9', // lone valley oak on open grassland
    '1469474968028-56623f02e42e', // rocky upland meadow at dusk
    '1439066615861-d1af74d74000', // still pond with a monitoring platform
    '1444927714506-8492d94b4e3d', // hazy blue ridgelines
  ],
  forest: [
    '1441974231531-c6227db76b6e', // sunlit trail through mixed conifer
    '1418065460487-3e41a6c84dc5', // mist over a conifer ridge
    '1425913397330-cf8af2ff40a1', // sunbeams through a pine stand
    '1476231682828-37e571bc172f', // aerial: road curving through forest
    '1473773508845-188df298d2d1', // aerial: unbroken conifer canopy
    '1426604966848-d7adac402bff', // valley-floor pines below a granite wall
    '1448375240586-882707db888b', // closed-canopy stand, pre-treatment dark
  ],
  channel: [
    '1473448912268-2022ce9509d8', // river through conifers
    '1439066615861-d1af74d74000', // basin holding still water
    '1432405972618-c60b0225b8f9', // creek falls and boulder pool
    '1470071459604-3b5ec3a7fe05', // green hills above the corridor
    '1476231682828-37e571bc172f', // aerial: road through forest
    '1444927714506-8492d94b4e3d', // hazy ridgelines above the watershed
  ],
};

export const imageId = (photo: ProjectPhoto): string => {
  const pool = SCENE_IMAGES[photo.scene];
  return pool[photo.seed % pool.length];
};

// Exact 4:3 crops from the CDN, so both surfaces get uniform frames whatever
// the source's native shape: 2× the ~234px tile for the grid, and a
// screen-size 1600×1200 for the lightbox — the SAME crop at two resolutions,
// so opening a photo enlarges it rather than reframing it.
/** An exact crop from the CDN, so every surface gets a uniform frame whatever the source's native shape. */
export const photoSrc = (photo: ProjectPhoto, w: number, h: number, q = 60): string =>
  `https://images.unsplash.com/photo-${imageId(photo)}?auto=format&fit=crop&w=${w}&h=${h}&q=${q}`;
