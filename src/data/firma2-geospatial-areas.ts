// Geospatial area groups — the places a workspace files its projects by:
// watersheds, habitat areas, districts. A group is one reference layer read as
// a set of areas; a project belongs to an area because of where its work is,
// never because someone picked it (.scratch/geospatial-areas/spec.md).
//
// A GROUP POINTS AT A LAYER, IT DOES NOT COPY ONE. The layer is set up once, on
// Map layers, where it is also styled and drawn; the group only says "read
// this layer's shapes as areas, and name each by this field".
//
// INVENTED. The two seeded groups sit on the two layers this prototype holds
// shapes for (src/data/firma2-geography.ts): six coarse regions, and two
// subwatersheds per project, which is the long-list case.

import rawFiles from 'virtual:firma2-area-files';
import { REAL } from './firma2-real-data';

// AREA FILES ON DISK, IN DEV ONLY. A real spatial file, converted to
// docs/private/<tenant>/area-files.json (gitignored), is read here beside the
// real workspace and on the same terms: astro.config.mjs serves it in
// `astro dev` and gives every build `null`, so the public site never carries
// it. Each file is a reference layer and an area group, as if it had been
// uploaded on "Add geospatial areas". Nothing from a file is written under src/.
export interface AreaFileShape {
  id: string;
  /** The shape's attribute row, as the file had it. */
  fields: Record<string, string>;
  acres: number;
  /** Its outer rings, [lat, lng]: more than one for an area in several pieces. */
  parts: [number, number][][];
}

export interface RealAreaFile {
  id: string;
  fileName: string;
  layerName: string;
  credit: string;
  fields: string[];
  nameField: string;
  shapes: AreaFileShape[];
}

/** The area files on disk, or none — always none in a build. */
export const AREA_FILES: RealAreaFile[] = (rawFiles as RealAreaFile[] | null) ?? [];

/** The reference layer (and area group) id a file on disk goes by. */
export const areaFileLayerId = (file: RealAreaFile): string => `file-${file.id}`;
export const areaFileOf = (layerId: string): RealAreaFile | undefined => AREA_FILES.find((f) => areaFileLayerId(f) === layerId);

export interface AreaGroup {
  id: string;
  name: string;
  description: string;
  /** The reference layer (Map layers) whose shapes are this group's areas. */
  layerId: string;
  /** The layer field each area is named by. */
  nameField: string;
  /** What its areas are drawn in, unless one has its own. Unset: the layer's line colour. */
  color?: string;
}

// THE SWITCH IS AT THE ROOT, as for every fixture: a real workspace (dev only)
// has the area groups its files on disk give it and none of the invented ones
// (user, 2026-11-24); the invented data, and so every build, has the two below.
const INVENTED_GROUPS: AreaGroup[] = [
  {
    id: 'hydrologic-regions',
    name: 'Hydrologic regions',
    description: 'The six basin areas progress is reported by.',
    layerId: 'hydrologic-regions',
    nameField: 'REGION_NAME',
  },
  {
    id: 'subwatersheds',
    name: 'Subwatersheds',
    description: 'The drainage each project works in.',
    layerId: 'subwatersheds',
    nameField: 'NAME',
  },
];

export const AREA_GROUPS: AreaGroup[] = [
  ...(REAL ? [] : INVENTED_GROUPS),
  ...AREA_FILES.map((file) => ({
    id: areaFileLayerId(file),
    name: file.layerName,
    description: '',
    layerId: areaFileLayerId(file),
    nameField: file.nameField,
  })),
];

/**
 * What reading an uploaded file finds — scripted. Any file chosen on "Add area
 * group" reads as `habitat`; `noprj` is the sample for a file that is refused.
 */
export interface AreaFile {
  fileName: string;
  /** The layer inside the file, which names the group until the person does. */
  layerName: string;
  fields: string[];
  shapes: number;
  /** A refusal no choice can fix: the file itself is wrong. */
  refusal?: string;
}

export const AREA_FILE_SAMPLES: Record<'habitat' | 'noprj', AreaFile> = {
  habitat: { fileName: 'habitat-areas.zip', layerName: 'Habitat areas', fields: ['HABITAT', 'HABITAT_ID', 'ACRES'], shapes: 5 },
  noprj: {
    fileName: 'districts.zip',
    layerName: '',
    fields: [],
    shapes: 0,
    refusal: 'districts.prj is missing. Zip the .shp, .shx, .dbf and .prj together and choose it again.',
  },
};
