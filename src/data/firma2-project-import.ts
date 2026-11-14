// Importing projects from a spreadsheet — the fields a file can fill, and the
// partner workbook the prototype reads.
//
// INVENTED CONTENT. The workbook below is a fictional partnership's project
// list. Every name, number, figure and note is made up; the counties and
// creeks are real geography, the organizations working on them are not.
//
// WHAT THE SAMPLE IS BUILT TO SHOW. A program's own spreadsheet is never in
// the workspace's shape, so this one is wrong in the usual ways:
//
//   - two title rows above the headings, which are found rather than assumed;
//   - headings in the partnership's own words ("Lead agency", "Status");
//   - values in its own vocabulary ("In construction", "Salmon recovery",
//     "Scott Valley RCD") that have to be matched to the workspace's closed
//     lists, since a second spelling splits a roll-up in two (product brief §0);
//   - two lead organizations the workspace has never heard of;
//   - three projects the workspace already holds, one of them unchanged —
//     their County cells are blank, so the seeds' counties can change freely;
//   - a year that is "TBD", a cost that is "see grant agreement", a
//     completion before its start, a row with no name, and a row pasted twice;
//   - a TOTAL row at the bottom.
//
// Any .xlsx chosen reads as this workbook; a .csv is parsed for real (see
// src/lib/project-import.ts), so a Projects export from Workspace settings
// round-trips. Deterministic: a literal, no generated values.

import { customFields } from './firma2-workspace-settings';

/** One sheet of a workbook: its cells, row by row, as the file holds them. */
export interface ImportSheet {
  name: string;
  cells: string[][];
}

export interface ImportWorkbook {
  fileName: string;
  sheets: ImportSheet[];
}

/** The workspace's closed lists a column can be matched against. */
export type ImportVocabulary = 'projectType' | 'classifications' | 'tags' | 'leadOrganization' | 'stage';

export type ImportFieldKind = 'text' | 'long-text' | 'year' | 'money' | 'number' | 'choice' | 'multi';

export interface ImportField {
  /** A Project property, or `custom:<name>` for one of the workspace's custom fields. */
  key: string;
  /** Canonical name. Renameable nouns in it resolve through the workspace vocabulary at render. */
  label: string;
  kind: ImportFieldKind;
  vocabulary?: ImportVocabulary;
  required?: boolean;
  /** Headings that map to this field without asking, compared lower-cased and trimmed. */
  synonyms: string[];
}

/**
 * The fields a file can fill, in the order the record shows them. Required is
 * the minimum a project needs to exist: a name, whose it is, and where it
 * stands. Project type is optional, as it is everywhere else (settled
 * 2026-10-03).
 */
export const IMPORT_FIELDS: ImportField[] = [
  { key: 'projectName', label: 'Project name', kind: 'text', required: true, synonyms: ['project name', 'project', 'name', 'project title', 'title'] },
  { key: 'projectType', label: 'Project type', kind: 'choice', vocabulary: 'projectType', synonyms: ['project type', 'type', 'type of work', 'work type', 'category'] },
  { key: 'classifications', label: 'Classifications', kind: 'multi', vocabulary: 'classifications', synonyms: ['classifications', 'classification', 'goals', 'goal', 'program goals', 'priorities'] },
  { key: 'tags', label: 'Tags', kind: 'multi', vocabulary: 'tags', synonyms: ['tags', 'tag', 'labels', 'keywords'] },
  { key: 'leadOrganization', label: 'Lead organization', kind: 'choice', vocabulary: 'leadOrganization', required: true, synonyms: ['lead organization', 'lead org', 'lead agency', 'lead', 'sponsor', 'organization', 'grantee', 'applicant'] },
  { key: 'county', label: 'County', kind: 'text', synonyms: ['county', 'counties'] },
  { key: 'stage', label: 'Stage', kind: 'choice', vocabulary: 'stage', required: true, synonyms: ['stage', 'status', 'phase', 'project stage', 'project status'] },
  { key: 'implementationStartYear', label: 'Implementation start year', kind: 'year', synonyms: ['implementation start year', 'start year', 'start', 'begin', 'start date'] },
  { key: 'completionYear', label: 'Completion year', kind: 'year', synonyms: ['completion year', 'end year', 'end', 'completion', 'end date', 'finish'] },
  { key: 'estimatedTotalCost', label: 'Estimated total cost', kind: 'money', synonyms: ['estimated total cost', 'total cost', 'total budget', 'budget', 'cost', 'project cost'] },
  { key: 'estimatedAnnualOperatingCost', label: 'Annual operating cost', kind: 'money', synonyms: ['estimated annual operating cost', 'annual operating cost', 'annual o&m', 'o&m', 'operations and maintenance', 'operating cost'] },
  { key: 'description', label: 'Description', kind: 'long-text', synonyms: ['description', 'summary', 'project description', 'scope', 'abstract'] },
  // The workspace's custom fields (Workspace settings › Custom fields). An
  // import places values into fields that exist; it never makes one.
  ...customFields.map((f): ImportField => ({
    key: `custom:${f.name}`,
    label: f.name,
    kind: f.cells.kind === 'Number' ? 'number' : 'text',
    synonyms: f.name === 'Grant agreement number' ? ['grant agreement number', 'agreement #', 'agreement number', 'agreement no', 'grant #', 'grant number'] : [f.name.toLowerCase()],
  })),
];

/**
 * Suggested matches the sample's vocabulary carries, by list then the file's
 * value (lower-cased). A suggestion is pre-picked and marked as one — the
 * person importing confirms it by leaving it, or changes it. Values with no
 * entry here and no exact match start unmatched. Written out rather than
 * guessed by a string distance, because "Habitat" is genuinely ambiguous and
 * a guess would file it somewhere confidently wrong.
 */
export const IMPORT_SUGGESTIONS: Record<ImportVocabulary, Record<string, string>> = {
  stage: {
    proposed: 'Proposal',
    planning: 'Planning & Design',
    design: 'Planning & Design',
    'in construction': 'Implementation',
    construction: 'Implementation',
    monitoring: 'Post-Implementation',
    complete: 'Completed',
    'on hold': 'Deferred',
  },
  projectType: {
    'fuels reduction': 'Forest health & fuels',
    'riparian planting': 'Riparian revegetation',
    'meadow restoration': 'Meadow & wetland restoration',
    'water quality': 'Stormwater & water quality',
    'instream habitat': 'Aquatic habitat restoration',
  },
  classifications: {
    'salmon recovery': 'Salmon & steelhead recovery',
    recreation: 'Public access & recreation',
    groundwater: 'Groundwater recharge',
  },
  tags: {},
  leadOrganization: {
    'scott valley rcd': 'Scott Valley Resource District',
    'upper butte fire safe council': 'Upper Butte Fire Safe Alliance',
  },
};

export const SAMPLE_FILE_NAME = 'sierra-headwaters-project-list.xlsx';

const H = ['Project Name', 'Agreement #', 'Type of work', 'Goals', 'Lead agency', 'County', 'Status', 'Start', 'End', 'Total budget', 'Annual O&M', 'Description', 'Contact', 'Notes (internal)'];

// One row per line, in heading order. Empty strings are empty cells.
const ACTIVE: string[][] = [
  ['Sierra Headwaters Partnership — project list'],
  ['Updated 3/14/2026. Internal working copy.'],
  H,
  ['Scott River fish passage barrier removal', 'SHP-21-014', 'Fish passage', 'Salmon recovery; Barrier removal & fish screens', 'Scott Valley RCD', '', 'Construction', '2025', '2028', '$1,310,000', '6,500', 'Replaces two perched culverts on French Creek with a bridge and a roughened channel.', 'R. Okafor', 'Budget amended Feb 2026'],
  ['Butte Creek Canyon Fuel Break', 'SHP-19-006', 'Fuels reduction', 'Wildfire resilience; Fuel breaks', 'Upper Butte Fire Safe Council', '', 'Complete', '2019', '2024', '1,690,000', '74,000', '', 'M. Teague', ''],
  ['Putah Creek Riparian Planting', '','Riparian planting', 'Riparian & wetland habitat; Native planting', 'Lower Putah Stewardship Group', '', 'Complete', '2019', '2022', '218,000', '11,500', '', 'L. Brandt', ''],
  ['Lassen Creek Meadow Reconnection', 'SHP-24-031', 'Meadow restoration', 'Groundwater; Habitat', 'Lassen Creek Stewards', 'Lassen', 'Planning', '2026', '2029', '$640K', '12,000', 'Fills a gully that drains the meadow, so spring flows spread across the floodplain again.', 'J. Alvarez', 'New partner, first project'],
  ['Middle Fork Feather Fuels Thinning', 'SHP-23-027', 'Fuels reduction', 'Wildfire resilience; Forest thinning', 'Feather Headwaters Trust', 'Plumas', 'In construction', '2023', '2027', '$2.4M', '96,000', 'Thins 1,900 acres of overstocked mixed conifer above three communities.', 'K. Huang', ''],
  ['Indian Creek Culvert Replacement', 'SHP-24-033', 'Fish passage', 'Salmon recovery; Barrier removal & fish screens', 'Feather Headwaters Trust', 'Plumas', 'Design', '2025', '2027', '1,150,000', '4,000', 'Swaps an undersized road culvert for a span that passes fish at every flow.', 'K. Huang', ''],
  ['Sly Park Creek Riparian Buffer', 'SHP-22-019', 'Riparian planting', 'Water quality; Native planting', 'Mother Lode Land Trust', 'El Dorado', 'Construction', '2022', '2026', '385,000', '14,000', 'Plants a 60-foot native buffer along four miles of grazed bank.', 'D. Reyes', 'Check easement status'],
  ['Upper Truckee Marsh Rewetting', 'SHP-23-024', 'Meadow restoration', 'Habitat; Meadow & marsh rewetting', 'Truckee Basin Conservancy ', 'El Dorado', 'Monitoring', '2020', '2024', '1,820,000', '38,000', 'Reconnects the river to 250 acres of marsh it was ditched away from.', 'S. Patel', ''],
  ['Martis Valley Fuel Break', 'SHP-24-035', 'Fuels reduction', 'Wildfire resilience; Fuel breaks', 'Truckee Basin Conservancy', 'Placer', 'Proposed', '2027', '2030', '2,050,000', '81,000', '', 'S. Patel', 'Pending county CEQA'],
  ['Bear Creek Large Wood Structures', 'SHP-22-017', 'Instream habitat', 'Salmon recovery; Instream habitat structures', 'Bear River Watershed Council', 'Nevada', 'Implementation', '2022', '2025', '512,000', '6,000', 'Anchors 40 log jams to scour pools for juvenile steelhead.', 'T. Lindqvist', ''],
  ['Wolf Creek Sediment Basins', 'SHP-21-012', 'Water quality', 'Water quality; Erosion & sediment control', 'Bear River Watershed Council', 'Nevada', 'Complete', '2021', '2023', '298,000', '9,000', '', 'T. Lindqvist', ''],
  ['Deer Creek Meadow Headcut Repair', 'SHP-25-040', 'Meadow restoration', 'Habitat', 'Deer Creek Watershed Alliance', 'Tehama', 'Proposed', 'TBD', '', '455,000', '', 'Stops a headcut that is advancing up the meadow by about 30 feet a year.', 'A. Moreno', 'Start depends on 2026 award'],
  ['Mill Creek Fish Screen', 'SHP-20-009', 'Fish passage', 'Salmon recovery; Barrier removal & fish screens', 'Deer Creek Watershed Alliance', 'Tehama', 'Complete', '2020', '2022', '870,000', '22,000', '', 'A. Moreno', ''],
  ['North Yuba Prescribed Burn Units', 'SHP-24-036', 'Fuels reduction', 'Wildfire resilience; Prescribed fire', 'Yuba Headwaters Partnership', 'Sierra', 'On hold', '2024', '2028', 'see grant agreement', '45,000', '', 'P. Nakamura', 'Burn window missed 2025'],
  ['Downie River Floodplain Bench', 'SHP-25-041', 'Instream habitat', 'Salmon recovery; Side channels & floodplains', 'Yuba Headwaters Partnership', 'Sierra', 'Planning', '2029', '2027', '1,380,000', '15,000', 'Lowers a mine-tailing terrace so the river floods it in most winters.', 'P. Nakamura', ''],
  ['Loyalton Spring Recharge Basins', 'SHP-23-026', 'Water quality', 'Groundwater', 'Highland Sierra Trust', 'Sierra', 'Construction', '2023', '2026', '760,000', '27,000', '', 'E. Fischer', ''],
  ['', 'SHP-24-037', 'Riparian planting', 'Native planting', 'Highland Sierra Trust', 'Amador', 'Planning', '2026', '2028', '190,000', '', '', 'E. Fischer', 'Name TBD with landowner'],
  ['Indian Creek Culvert Replacement', 'SHP-24-033', 'Fish passage', 'Salmon recovery; Barrier removal & fish screens', 'Feather Headwaters Trust', 'Plumas', 'Design', '2025', '2027', '1,150,000', '4,000', '', 'K. Huang', 'dup?'],
  ['Mono Basin Willow Planting', 'SHP-22-020', 'Riparian planting', 'Habitat; Native planting', 'Eastern Sierra Land Coalition', 'Mono', 'Monitoring', '2021', '2024', '336,000', '12,500', '', 'G. Whitehorse', ''],
  ['Rush Creek Tamarisk Removal', 'SHP-23-025', 'Riparian planting', 'Habitat; Invasive plant removal', 'Eastern Sierra Land Coalition', 'Mono', 'Construction', '2023', '2026', '248,000', '31,000', 'Removes tamarisk from eleven miles of creek and replants the gaps.', 'G. Whitehorse', ''],
  ['Hirschman Pond Trail Erosion Control', 'SHP-25-042', 'Water quality', 'Recreation; Erosion & sediment control', 'Bear River Watershed Council', 'Nevada', 'Proposed', '2027', '2029', '410,000', '18,000', '', 'T. Lindqvist', ''],
  ['Sardine Lakes Meadow Rewetting', 'SHP-24-034', 'Meadow restoration', 'Groundwater; Meadow & marsh rewetting', 'Yuba Headwaters Partnership', 'Sierra', 'Planning', '2026', '2028', '$520K', '9,000', '', 'P. Nakamura', ''],
  ['Weber Creek Fish Ladder Retrofit', 'SHP-22-018', 'Fish passage', 'Salmon recovery; Barrier removal & fish screens', 'Mother Lode Land Trust', 'El Dorado', 'Implementation', '2022', '2025', '930,000', '17,500', '', 'D. Reyes', ''],
  ['Feather River Oak Woodland Planting', 'SHP-25-043', 'Riparian planting', 'Native planting', 'Feather Headwaters Trust', 'Plumas', 'Proposed', '2027', '2028', '165,000', '7,000', '', 'K. Huang', ''],
  [],
  ['TOTAL', '', '', '', '', '', '', '', '', '$19,947,000', '', '', '', ''],
];

const CLOSED: string[][] = [
  ['Project Name', 'Agreement #', 'Type of work', 'Lead agency', 'County', 'Status', 'Start', 'End', 'Total budget'],
  ['Little Last Chance Creek Grazing Exclosure', 'SHP-16-002', 'Riparian planting', 'Highland Sierra Trust', 'Plumas', 'Complete', '2016', '2018', '142,000'],
  ['Yellow Creek Meadow Pond-and-Plug', 'SHP-15-001', 'Meadow restoration', 'Feather Headwaters Trust', 'Plumas', 'Complete', '2015', '2019', '688,000'],
  ['Coldstream Canyon Road Decommissioning', 'SHP-17-004', 'Water quality', 'Truckee Basin Conservancy', 'Placer', 'Complete', '2017', '2020', '355,000'],
  ['Kanaka Creek Mine Tailings Cleanup', 'SHP-18-005', 'Water quality', 'Yuba Headwaters Partnership', 'Sierra', 'Complete', '2018', '2021', '1,240,000'],
];

const LISTS: string[][] = [
  ['Status', 'Type of work', 'Goals'],
  ['Proposed', 'Fish passage', 'Salmon recovery'],
  ['Planning', 'Fuels reduction', 'Wildfire resilience'],
  ['Design', 'Riparian planting', 'Water quality'],
  ['Construction', 'Meadow restoration', 'Habitat'],
  ['Monitoring', 'Instream habitat', 'Groundwater'],
  ['Complete', 'Water quality', 'Recreation'],
  ['On hold', '', ''],
];

export const SAMPLE_WORKBOOK: ImportWorkbook = {
  fileName: SAMPLE_FILE_NAME,
  sheets: [
    { name: 'Active projects', cells: ACTIVE },
    { name: 'Closed out', cells: CLOSED },
    { name: 'Dropdown lists', cells: LISTS },
  ],
};
