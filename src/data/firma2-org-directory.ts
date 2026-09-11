// firma2-org-directory — the full cast a restoration program could ever name.
//
// WHAT THIS IS FOR. Setting up a program means listing the organizations it works
// with, and the traditional answer is a text box: type the name, type it again
// next year, and by year three the same irrigation district is in the database
// four times under four spellings. A directory turns that typing into picking.
// The reporter who meets this list as a dropdown in 2031 is the reader this file
// is actually for — one canonical record per organization is what they get.
//
// EVERY RECORD IS INVENTED. Central Oregon is the setting, so the names read like
// the agencies, districts and land trusts a Deschutes or Metolius program would
// really work with, and nothing here was copied from a client document or a public
// register. Every mark is generated (see lib/org-mark.ts) — no real agency's logo
// is reproduced anywhere in this spoke.
//
// IT OVERLAPS THE DOCUMENT SUGGESTIONS ON PURPOSE. Every id in
// suggestedOrganizations is also an id here, so a name the extraction found
// resolves to the same record, the same mark and the same level as a name picked
// out of the directory. One organization, one identity, whichever door it came in.

import type { Organization, OrganizationRole } from './firma2-setup';
import type { OrgMark } from '../lib/org-mark';

/** Where an organization sits in the governance stack. The directory's coarsest filter. */
export type OrganizationLevel = 'federal' | 'state' | 'county' | 'local' | 'tribal' | 'ngo';

export interface DirectoryOrganization {
  id: string;
  name: string;
  level: OrganizationLevel;
  /** What KIND of body it is — 'Agency', 'District', 'Land trust', 'Tribe', 'University'. */
  kind: string;
  /** The ground it answers for — 'Oregon', 'Deschutes County', 'Sisters'. */
  jurisdiction: string;
  /** The parts this organization typically plays. A program can override per record. */
  roles: OrganizationRole[];
  mark: OrgMark;
}

/** Level, in the words a reader already has. NGO stays an initialism; nobody says "non-governmental organization" out loud. */
export const levelLabels: Record<OrganizationLevel, string> = {
  federal: 'Federal',
  state: 'State',
  county: 'County',
  local: 'Local',
  tribal: 'Tribal',
  ngo: 'NGO',
};

/**
 * Search and result order, top of the governance stack down. A stable rank rather
 * than a relevance score: a directory that reshuffles between two keystrokes is a
 * directory you cannot point at.
 */
const levelRank: Record<OrganizationLevel, number> = {
  federal: 0,
  state: 1,
  county: 2,
  local: 3,
  tribal: 4,
  ngo: 5,
};

export const organizationLevels: OrganizationLevel[] = ['federal', 'state', 'county', 'local', 'tribal', 'ngo'];

// ---------------------------------------------------------------------------
// The directory
// ---------------------------------------------------------------------------

export const organizationDirectory: DirectoryOrganization[] = [
  // ---- Federal ----------------------------------------------------------
  {
    id: 'cascade-national-forest',
    name: 'Cascade National Forest',
    level: 'federal',
    kind: 'Agency',
    jurisdiction: 'Central Oregon',
    roles: ['Partner agency', 'Landowner'],
    mark: { initials: 'CNF', hue: 142, shape: 'shield' },
  },
  {
    id: 'high-desert-public-lands-office',
    name: 'High Desert Public Lands Office',
    level: 'federal',
    kind: 'Agency',
    jurisdiction: 'Central Oregon',
    roles: ['Partner agency', 'Landowner'],
    mark: { initials: 'HD', hue: 28, shape: 'shield' },
  },
  {
    id: 'national-fish-and-wildlife-service',
    name: 'National Fish and Wildlife Service',
    level: 'federal',
    kind: 'Agency',
    jurisdiction: 'Pacific Northwest',
    roles: ['Partner agency', 'Funder'],
    mark: { initials: 'NFW', hue: 208, shape: 'shield' },
  },
  {
    id: 'upper-deschutes-reclamation-office',
    name: 'Upper Deschutes Reclamation Office',
    level: 'federal',
    kind: 'Agency',
    jurisdiction: 'Deschutes Basin',
    roles: ['Partner agency', 'Funder'],
    mark: { initials: 'UDR', hue: 196, shape: 'shield' },
  },
  {
    id: 'farm-and-range-conservation-service',
    name: 'Farm and Range Conservation Service',
    level: 'federal',
    kind: 'Agency',
    jurisdiction: 'Oregon',
    roles: ['Funder', 'Partner agency'],
    mark: { initials: 'FRC', hue: 96, shape: 'shield' },
  },
  {
    id: 'columbia-river-fisheries-commission',
    name: 'Columbia River Fisheries Commission',
    level: 'federal',
    kind: 'Commission',
    jurisdiction: 'Columbia Basin',
    roles: ['Partner agency', 'Funder'],
    mark: { initials: 'CRF', hue: 220, shape: 'hex' },
  },
  {
    id: 'cascade-power-authority',
    name: 'Cascade Power Authority',
    level: 'federal',
    kind: 'Authority',
    jurisdiction: 'Columbia Basin',
    roles: ['Funder'],
    mark: { initials: 'CPA', hue: 262, shape: 'hex' },
  },

  // ---- State ------------------------------------------------------------
  {
    id: 'state-fish-and-wildlife',
    name: 'State Department of Fish and Wildlife',
    level: 'state',
    kind: 'Agency',
    jurisdiction: 'Oregon',
    roles: ['Partner agency'],
    mark: { initials: 'FW', hue: 168, shape: 'shield' },
  },
  {
    id: 'state-watershed-enhancement-board',
    name: 'State Watershed Enhancement Board',
    level: 'state',
    kind: 'Board',
    jurisdiction: 'Oregon',
    roles: ['Funder'],
    mark: { initials: 'WEB', hue: 118, shape: 'shield' },
  },
  {
    id: 'state-environmental-quality',
    name: 'State Department of Environmental Quality',
    level: 'state',
    kind: 'Agency',
    jurisdiction: 'Oregon',
    roles: ['Partner agency'],
    mark: { initials: 'DEQ', hue: 186, shape: 'shield' },
  },
  {
    id: 'state-water-resources-department',
    name: 'State Water Resources Department',
    level: 'state',
    kind: 'Agency',
    jurisdiction: 'Oregon',
    roles: ['Partner agency'],
    mark: { initials: 'WRD', hue: 202, shape: 'shield' },
  },
  {
    id: 'state-forestry-department',
    name: 'State Department of Forestry',
    level: 'state',
    kind: 'Agency',
    jurisdiction: 'Oregon',
    roles: ['Landowner', 'Partner agency'],
    mark: { initials: 'DOF', hue: 132, shape: 'shield' },
  },
  {
    id: 'state-parks-and-recreation',
    name: 'State Parks and Recreation Department',
    level: 'state',
    kind: 'Agency',
    jurisdiction: 'Oregon',
    roles: ['Landowner', 'Partner agency'],
    mark: { initials: 'PRD', hue: 154, shape: 'shield' },
  },
  {
    id: 'state-department-of-agriculture',
    name: 'State Department of Agriculture',
    level: 'state',
    kind: 'Agency',
    jurisdiction: 'Oregon',
    roles: ['Partner agency'],
    mark: { initials: 'DOA', hue: 46, shape: 'shield' },
  },
  {
    id: 'high-cascades-university-extension',
    name: 'High Cascades University Extension',
    level: 'state',
    kind: 'University',
    jurisdiction: 'Oregon',
    roles: ['Partner agency'],
    mark: { initials: 'HCU', hue: 344, shape: 'circle' },
  },

  // ---- County -----------------------------------------------------------
  {
    id: 'deschutes-county',
    name: 'Deschutes County',
    level: 'county',
    kind: 'County government',
    jurisdiction: 'Deschutes County',
    roles: ['Partner agency', 'Landowner'],
    mark: { initials: 'DC', hue: 210, shape: 'hex' },
  },
  {
    id: 'jefferson-county',
    name: 'Jefferson County',
    level: 'county',
    kind: 'County government',
    jurisdiction: 'Jefferson County',
    roles: ['Partner agency', 'Landowner'],
    mark: { initials: 'JC', hue: 24, shape: 'hex' },
  },
  {
    id: 'crook-county',
    name: 'Crook County',
    level: 'county',
    kind: 'County government',
    jurisdiction: 'Crook County',
    roles: ['Partner agency'],
    mark: { initials: 'CC', hue: 62, shape: 'hex' },
  },
  {
    id: 'deschutes-county-swcd',
    name: 'Deschutes County Soil and Water Conservation District',
    level: 'county',
    kind: 'Conservation district',
    jurisdiction: 'Deschutes County',
    roles: ['Implementer', 'Partner agency'],
    mark: { initials: 'DSW', hue: 104, shape: 'hex' },
  },
  {
    id: 'crooked-river-swcd',
    name: 'Crooked River Soil and Water Conservation District',
    level: 'county',
    kind: 'Conservation district',
    jurisdiction: 'Crook County',
    roles: ['Implementer', 'Partner agency'],
    mark: { initials: 'CRS', hue: 86, shape: 'hex' },
  },
  {
    id: 'jefferson-county-swcd',
    name: 'Jefferson County Soil and Water Conservation District',
    level: 'county',
    kind: 'Conservation district',
    jurisdiction: 'Jefferson County',
    roles: ['Implementer'],
    mark: { initials: 'JSW', hue: 178, shape: 'hex' },
  },

  // ---- Local ------------------------------------------------------------
  {
    id: 'city-of-bend',
    name: 'City of Bend',
    level: 'local',
    kind: 'City',
    jurisdiction: 'Bend',
    roles: ['Partner agency'],
    mark: { initials: 'BD', hue: 218, shape: 'square' },
  },
  {
    id: 'city-of-redmond',
    name: 'City of Redmond',
    level: 'local',
    kind: 'City',
    jurisdiction: 'Redmond',
    roles: ['Partner agency'],
    mark: { initials: 'RD', hue: 12, shape: 'square' },
  },
  {
    id: 'city-of-sisters',
    name: 'City of Sisters',
    level: 'local',
    kind: 'City',
    jurisdiction: 'Sisters',
    roles: ['Partner agency'],
    mark: { initials: 'SI', hue: 158, shape: 'square' },
  },
  {
    id: 'city-of-prineville',
    name: 'City of Prineville',
    level: 'local',
    kind: 'City',
    jurisdiction: 'Prineville',
    roles: ['Partner agency'],
    mark: { initials: 'PV', hue: 38, shape: 'square' },
  },
  {
    id: 'three-sisters-irrigation-district',
    name: 'Three Sisters Irrigation District',
    level: 'local',
    kind: 'Irrigation district',
    jurisdiction: 'Sisters',
    roles: ['Partner agency', 'Landowner'],
    mark: { initials: 'TSI', hue: 192, shape: 'hex' },
  },
  {
    id: 'central-oregon-irrigation-district',
    name: 'Central Oregon Irrigation District',
    level: 'local',
    kind: 'Irrigation district',
    jurisdiction: 'Redmond',
    roles: ['Partner agency', 'Landowner'],
    mark: { initials: 'COI', hue: 172, shape: 'hex' },
  },
  {
    id: 'juniper-butte-irrigation-district',
    name: 'Juniper Butte Irrigation District',
    level: 'local',
    kind: 'Irrigation district',
    jurisdiction: 'Bend',
    roles: ['Partner agency', 'Landowner'],
    mark: { initials: 'JBI', hue: 74, shape: 'hex' },
  },
  {
    id: 'central-oregon-intergovernmental-council',
    name: 'Central Oregon Intergovernmental Council',
    level: 'local',
    kind: 'Regional council',
    jurisdiction: 'Central Oregon',
    roles: ['Partner agency'],
    mark: { initials: 'CIC', hue: 286, shape: 'square' },
  },

  // ---- Tribal -----------------------------------------------------------
  {
    id: 'metolius-basin-tribes',
    name: 'Confederated Tribes of the Metolius Basin',
    level: 'tribal',
    kind: 'Tribe',
    jurisdiction: 'Metolius Basin',
    roles: ['Partner agency', 'Landowner'],
    mark: { initials: 'CTM', hue: 20, shape: 'circle' },
  },
  {
    id: 'whychus-tribal-council',
    name: 'Whychus Tribal Council',
    level: 'tribal',
    kind: 'Tribal council',
    jurisdiction: 'Sisters',
    roles: ['Partner agency'],
    mark: { initials: 'WTC', hue: 340, shape: 'circle' },
  },
  {
    id: 'metolius-tribal-natural-resources',
    name: 'Metolius Basin Natural Resources Office',
    level: 'tribal',
    kind: 'Tribal agency',
    jurisdiction: 'Camp Sherman',
    roles: ['Implementer'],
    mark: { initials: 'MNR', hue: 120, shape: 'hex' },
  },
  {
    id: 'high-desert-tribal-fisheries',
    name: 'High Desert Tribal Fisheries Program',
    level: 'tribal',
    kind: 'Tribal program',
    jurisdiction: 'Central Oregon',
    roles: ['Implementer'],
    mark: { initials: 'HTF', hue: 200, shape: 'circle' },
  },

  // ---- NGO and private --------------------------------------------------
  {
    id: 'cascade-headwaters-partnership',
    name: 'Cascade Headwaters Partnership',
    level: 'ngo',
    kind: 'Partnership',
    jurisdiction: 'Sisters',
    roles: ['Implementer'],
    mark: { initials: 'CHP', hue: 146, shape: 'circle' },
  },
  {
    id: 'metolius-land-trust',
    name: 'Metolius Land Trust',
    level: 'ngo',
    kind: 'Land trust',
    jurisdiction: 'Sisters',
    roles: ['Implementer', 'Landowner'],
    mark: { initials: 'MLT', hue: 100, shape: 'circle' },
  },
  {
    id: 'deschutes-basin-land-trust',
    name: 'Deschutes Basin Land Trust',
    level: 'ngo',
    kind: 'Land trust',
    jurisdiction: 'Bend',
    roles: ['Implementer', 'Landowner'],
    mark: { initials: 'DLT', hue: 84, shape: 'circle' },
  },
  {
    id: 'black-butte-conservancy',
    name: 'Black Butte Conservancy',
    level: 'ngo',
    kind: 'Conservancy',
    jurisdiction: 'Camp Sherman',
    roles: ['Landowner'],
    mark: { initials: 'BBC', hue: 270, shape: 'circle' },
  },
  {
    id: 'whychus-creek-watershed-council',
    name: 'Whychus Creek Watershed Council',
    level: 'ngo',
    kind: 'Watershed council',
    jurisdiction: 'Sisters',
    roles: ['Implementer'],
    mark: { initials: 'WWC', hue: 188, shape: 'circle' },
  },
  {
    id: 'upper-deschutes-watershed-council',
    name: 'Upper Deschutes Watershed Council',
    level: 'ngo',
    kind: 'Watershed council',
    jurisdiction: 'Bend',
    roles: ['Implementer'],
    mark: { initials: 'UDW', hue: 204, shape: 'circle' },
  },
  {
    id: 'crooked-river-watershed-council',
    name: 'Crooked River Watershed Council',
    level: 'ngo',
    kind: 'Watershed council',
    jurisdiction: 'Prineville',
    roles: ['Implementer'],
    mark: { initials: 'CRW', hue: 52, shape: 'circle' },
  },
  {
    id: 'columbia-basin-habitat-fund',
    name: 'Columbia Basin Habitat Fund',
    level: 'ngo',
    kind: 'Fund',
    jurisdiction: 'Portland',
    roles: ['Funder'],
    mark: { initials: 'CBH', hue: 232, shape: 'circle' },
  },
  {
    id: 'northwest-salmon-recovery-foundation',
    name: 'Northwest Salmon Recovery Foundation',
    level: 'ngo',
    kind: 'Foundation',
    jurisdiction: 'Seattle',
    roles: ['Funder'],
    mark: { initials: 'NSR', hue: 356, shape: 'circle' },
  },
  {
    id: 'cascade-conservation-fund',
    name: 'Cascade Conservation Fund',
    level: 'ngo',
    kind: 'Fund',
    jurisdiction: 'Portland',
    roles: ['Funder'],
    mark: { initials: 'CCF', hue: 300, shape: 'circle' },
  },
  {
    id: 'high-desert-anglers',
    name: 'High Desert Anglers',
    level: 'ngo',
    kind: 'Volunteer group',
    jurisdiction: 'Bend',
    roles: ['Implementer'],
    mark: { initials: 'HDA', hue: 248, shape: 'circle' },
  },
  {
    id: 'pine-ridge-ranch',
    name: 'Pine Ridge Ranch',
    level: 'ngo',
    kind: 'Ranch',
    jurisdiction: 'Camp Sherman',
    roles: ['Landowner'],
    mark: { initials: 'PRR', hue: 32, shape: 'square' },
  },
  {
    id: 'juniper-flats-grazing-association',
    name: 'Juniper Flats Grazing Association',
    level: 'ngo',
    kind: 'Grazing association',
    jurisdiction: 'Terrebonne',
    roles: ['Landowner'],
    mark: { initials: 'JFG', hue: 66, shape: 'square' },
  },
  {
    id: 'river-design-group',
    name: 'Headwaters Engineering',
    level: 'ngo',
    kind: 'Consultancy',
    jurisdiction: 'Bend',
    roles: ['Implementer'],
    mark: { initials: 'HE', hue: 214, shape: 'square' },
  },
];

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

/** Every directory record by id. The join the picker, the roster and the header all use to find a mark. */
export const directoryById: Map<string, DirectoryOrganization> = new Map(
  organizationDirectory.map((entry) => [entry.id, entry]),
);

/**
 * The directory's one order: governance level, then name. Never relevance — a
 * list that reshuffles per keystroke cannot be pointed at. The grid opens in this
 * order and a search only narrows it.
 */
export const byLevelThenName = (a: DirectoryOrganization, b: DirectoryOrganization): number =>
  levelRank[a.level] - levelRank[b.level] || a.name.localeCompare(b.name);

/**
 * A directory record as the program's own record of it.
 *
 * `source: 'ask'` is the closest the Organization union has to "picked by hand" —
 * the roster labels that column "Directory" now that the free-text ask is gone. It
 * enters `suggested`; the caller confirms, because nothing is written into a
 * program without a person pressing something.
 */
export const toOrganization = (entry: DirectoryOrganization): Organization => ({
  id: entry.id,
  name: entry.name,
  roles: [...entry.roles],
  location: entry.jurisdiction,
  source: 'ask',
  status: 'suggested',
});
