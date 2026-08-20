// Mock project portfolio for the ProjectFirma 2.0 prototypes.
//
// INVENTED CONTENT. Every project, organization, cost, and year below is
// fabricated. Nothing here is copied, derived, or sanitized from a client
// system, a real grant portfolio, or any ProjectFirma tenant's data — this repo
// and its deployed site are public.
//
// What IS borrowed is the domain VOCABULARY, taken from the open-source
// ProjectFirma data model so the screens speak the product's own language:
// ProjectStage (Proposal / Planning & Design / Implementation /
// Post-Implementation / Completed / Deferred), the taxonomy tier that groups
// projects into programs, EstimatedTotalCost, and the
// ImplementationStartYear / CompletionYear pair. California county and
// watershed names are real geography; the organizations working in them are
// not.
//
// Deterministic by construction — a literal array, no generated values, so
// every demo run renders the identical table.

/** ProjectFirma's project lifecycle ladder, in canonical (not alphabetical) order. */
export type ProjectStage =
  | 'Proposal'
  | 'Planning & Design'
  | 'Implementation'
  | 'Post-Implementation'
  | 'Completed'
  | 'Deferred';

/** Canonical lifecycle order — drives both the filter chips and the column sort. */
export const STAGE_ORDER: ProjectStage[] = [
  'Proposal',
  'Planning & Design',
  'Implementation',
  'Post-Implementation',
  'Completed',
  'Deferred',
];

/**
 * esa-pill variant per stage. Deferred takes `warning` so the off-track state
 * stands out; the two terminal stages share `success`, which is accurate —
 * both mean the work is done.
 */
export const STAGE_TONE: Record<ProjectStage, 'default' | 'info' | 'primary' | 'success' | 'warning'> = {
  'Proposal': 'default',
  'Planning & Design': 'info',
  'Implementation': 'primary',
  'Post-Implementation': 'success',
  'Completed': 'success',
  'Deferred': 'warning',
};

export interface Project {
  projectName: string;
  /** Taxonomy tier — the program a project rolls up into. */
  program: string;
  leadOrganization: string;
  county: string;
  stage: ProjectStage;
  implementationStartYear: number;
  completionYear: number;
  /** Whole dollars. */
  estimatedTotalCost: number;
}

export const projects: Project[] = [
  { projectName: 'Deer Creek Riparian Corridor Enhancement', program: 'Riparian Revegetation', leadOrganization: 'Deer Creek Watershed Alliance', county: 'Tehama', stage: 'Implementation', implementationStartYear: 2023, completionYear: 2027, estimatedTotalCost: 412000 },
  { projectName: 'Scott River Fish Passage Barrier Removal', program: 'Fish Passage', leadOrganization: 'Scott Valley Resource District', county: 'Siskiyou', stage: 'Planning & Design', implementationStartYear: 2025, completionYear: 2028, estimatedTotalCost: 1240000 },
  { projectName: 'Suisun Slough Tidal Marsh Enhancement', program: 'Meadow & Wetland Restoration', leadOrganization: 'Suisun Basin Conservancy', county: 'Solano', stage: 'Implementation', implementationStartYear: 2022, completionYear: 2026, estimatedTotalCost: 876500 },
  { projectName: 'Red Clover Valley Meadow Reconnection', program: 'Meadow & Wetland Restoration', leadOrganization: 'Feather Headwaters Trust', county: 'Plumas', stage: 'Completed', implementationStartYear: 2018, completionYear: 2023, estimatedTotalCost: 305000 },
  { projectName: 'Cosumnes Floodplain Reconnection', program: 'Aquatic Habitat Restoration', leadOrganization: 'Cosumnes Valley Conservancy', county: 'Sacramento', stage: 'Proposal', implementationStartYear: 2027, completionYear: 2031, estimatedTotalCost: 2150000 },
  { projectName: 'Bear River Gravel Augmentation', program: 'Aquatic Habitat Restoration', leadOrganization: 'Bear River Watershed Council', county: 'Nevada', stage: 'Implementation', implementationStartYear: 2024, completionYear: 2026, estimatedTotalCost: 528000 },
  { projectName: 'Yuba Headwaters Fuels Reduction', program: 'Forest Health & Fuels', leadOrganization: 'Yuba Headwaters Partnership', county: 'Sierra', stage: 'Implementation', implementationStartYear: 2023, completionYear: 2028, estimatedTotalCost: 3480000 },
  { projectName: 'Butte Creek Canyon Fuel Break', program: 'Forest Health & Fuels', leadOrganization: 'Upper Butte Fire Safe Alliance', county: 'Butte', stage: 'Post-Implementation', implementationStartYear: 2019, completionYear: 2024, estimatedTotalCost: 1690000 },
  { projectName: 'Navarro River Large Wood Placement', program: 'Aquatic Habitat Restoration', leadOrganization: 'Navarro Coastal Stewardship', county: 'Mendocino', stage: 'Completed', implementationStartYear: 2020, completionYear: 2024, estimatedTotalCost: 447000 },
  { projectName: 'Salinas River Arundo Removal', program: 'Riparian Revegetation', leadOrganization: 'Salinas Basin Water Alliance', county: 'Monterey', stage: 'Implementation', implementationStartYear: 2022, completionYear: 2027, estimatedTotalCost: 962000 },
  { projectName: 'Alameda Creek Culvert Retrofit', program: 'Fish Passage', leadOrganization: 'East Bay Stream Partners', county: 'Alameda', stage: 'Planning & Design', implementationStartYear: 2026, completionYear: 2029, estimatedTotalCost: 1875000 },
  { projectName: 'Truckee River Streambank Stabilization', program: 'Stormwater & Water Quality', leadOrganization: 'Truckee Basin Conservancy', county: 'Placer', stage: 'Implementation', implementationStartYear: 2024, completionYear: 2027, estimatedTotalCost: 734000 },
  { projectName: 'Elk River Sediment Reduction', program: 'Stormwater & Water Quality', leadOrganization: 'Humboldt Bay Watershed Trust', county: 'Humboldt', stage: 'Deferred', implementationStartYear: 2025, completionYear: 2029, estimatedTotalCost: 1120000 },
  { projectName: 'Carmel Valley Steelhead Habitat', program: 'Aquatic Habitat Restoration', leadOrganization: 'Carmel Watershed Collaborative', county: 'Monterey', stage: 'Post-Implementation', implementationStartYear: 2018, completionYear: 2023, estimatedTotalCost: 690000 },
  { projectName: 'Owens Valley Spring Channel Restoration', program: 'Meadow & Wetland Restoration', leadOrganization: 'Eastern Sierra Land Coalition', county: 'Inyo', stage: 'Planning & Design', implementationStartYear: 2026, completionYear: 2030, estimatedTotalCost: 1340000 },
  { projectName: 'Putah Creek Riparian Planting', program: 'Riparian Revegetation', leadOrganization: 'Lower Putah Stewardship Group', county: 'Yolo', stage: 'Completed', implementationStartYear: 2019, completionYear: 2022, estimatedTotalCost: 218000 },
  { projectName: 'San Luis Rey Arroyo Toad Habitat', program: 'Aquatic Habitat Restoration', leadOrganization: 'Inland Rivers Conservancy', county: 'San Diego', stage: 'Proposal', implementationStartYear: 2027, completionYear: 2030, estimatedTotalCost: 845000 },
  { projectName: 'Klamath Tributary Thermal Refugia', program: 'Aquatic Habitat Restoration', leadOrganization: 'Klamath Tributaries Stewardship Group', county: 'Siskiyou', stage: 'Implementation', implementationStartYear: 2023, completionYear: 2028, estimatedTotalCost: 1560000 },
  { projectName: 'Mokelumne Meadow Rewetting', program: 'Meadow & Wetland Restoration', leadOrganization: 'Highland Sierra Trust', county: 'Amador', stage: 'Planning & Design', implementationStartYear: 2026, completionYear: 2029, estimatedTotalCost: 597000 },
  { projectName: 'Pescadero Marsh Tidal Exchange', program: 'Meadow & Wetland Restoration', leadOrganization: 'Coastside Wetlands Group', county: 'San Mateo', stage: 'Deferred', implementationStartYear: 2024, completionYear: 2028, estimatedTotalCost: 2310000 },
  { projectName: 'Battle Creek Diversion Screening', program: 'Fish Passage', leadOrganization: 'North Valley Fisheries Trust', county: 'Shasta', stage: 'Implementation', implementationStartYear: 2022, completionYear: 2026, estimatedTotalCost: 1985000 },
  { projectName: 'Cache Creek Floodplain Terracing', program: 'Aquatic Habitat Restoration', leadOrganization: 'Capay Valley Land Council', county: 'Yolo', stage: 'Proposal', implementationStartYear: 2028, completionYear: 2032, estimatedTotalCost: 1470000 },
  { projectName: 'Trinity River Side-Channel Construction', program: 'Aquatic Habitat Restoration', leadOrganization: 'Trinity Restoration Alliance', county: 'Trinity', stage: 'Post-Implementation', implementationStartYear: 2017, completionYear: 2022, estimatedTotalCost: 2740000 },
  { projectName: 'Arroyo Seco Urban Greenway', program: 'Stormwater & Water Quality', leadOrganization: 'Central LA Watershed Coalition', county: 'Los Angeles', stage: 'Planning & Design', implementationStartYear: 2026, completionYear: 2030, estimatedTotalCost: 3120000 },
];

/** Programs present in the data, alphabetical — the filter never lists an empty bucket. */
export const programs: string[] = Array.from(new Set(projects.map((p) => p.program))).sort();
