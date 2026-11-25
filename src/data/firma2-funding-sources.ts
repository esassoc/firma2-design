// Funding sources — money one organization offers that can fund many projects:
// a grant, an award, an appropriation, a call for proposals.
//
// AN ENTITY OF ITS OWN (docs/data-model.md, decision 1, user 2026-11-24). Until
// then a funding source was a name typed on each project's funding row, so the
// same grant on twelve projects was twelve strings. A project's funding row now
// LINKS to one of these and carries only the amount; the funder
// is read from here and never typed again.
//
// THE CATALOGUE AND NOTHING ELSE. This module imports no project detail, so
// firma2-project-detail.ts can build its funding rows from it without a cycle.
// What a source adds up to across projects lives in
// firma2-funding-source-rollup.ts.
//
// INVENTED CONTENT. Every program, administering body, award number and officer
// below is fabricated to read like California restoration funding without being
// any real program, agency or person. This repo and its site are public.
//
// DETERMINISTIC — literal arrays, no Math.random(), no Date.now().

import { projects } from './firma2-projects';
import { REAL, realFund, realRecords, slugOf } from './firma2-real-data';

export interface FundingSource {
  slug: string;
  /** The grant, award or program the money comes through. */
  name: string;
  /** The organization offering it. One per source. */
  organization: string;
  description: string;
  /**
   * The workspace's funding source fields, answered: label to value
   * (Workspace settings › Funding source fields). Only what was answered.
   */
  fields: Record<string, string>;
}

/** The name a project's own contribution carries; its organization is the project's lead. */
export const LOCAL_MATCH_NAME = 'Local Sponsor Match';

/** A source's address-safe id: its name, and its organization where the name alone is shared. */
export const fundingSourceSlug = (name: string, organization: string): string =>
  name === LOCAL_MATCH_NAME ? slugOf(`${name} ${organization}`) : slugOf(name);

type Seed = Omit<FundingSource, 'slug'>;

const SEEDS: Seed[] = [
  {
    name: 'Watershed Resilience Grant Program',
    organization: 'California Watershed Restoration Board',
    description: 'Multi-benefit watershed restoration on public and private land.',
    fields: { 'Award number': 'WRB-2024-118', 'Match required': '25%', 'Award period': 'Jul 2024 to Jun 2028', 'Program officer': 'Imani Okafor', 'Restricted to': 'Implementation' },
  },
  {
    name: 'Anadromous Fisheries Recovery Fund',
    organization: 'Pacific Fisheries Trust',
    description: 'Fish passage and instream habitat for salmon and steelhead.',
    fields: { 'Award number': 'PFT-AF-0471', 'Match required': '10%', 'Award period': 'Jan 2023 to Dec 2027', 'Program officer': 'Tomás Villanueva' },
  },
  {
    name: 'Wildfire Resilience Block Grant',
    organization: 'California Forest Health Authority',
    description: 'Fuels reduction, thinning and prescribed fire near communities.',
    fields: { 'Award number': 'FHA-BG-22-309', 'Match required': '0%', 'Award period': 'Oct 2022 to Sep 2027', 'Program officer': 'Renee Castellanos', 'Restricted to': 'Fuels treatment' },
  },
  {
    name: 'Coastal Wetlands Conservation Fund',
    organization: 'Pacific Coast Wetlands Board',
    description: 'Tidal marsh and coastal wetland protection and restoration.',
    fields: { 'Award number': 'CW-2021-0062', 'Match required': '50%', 'Award period': 'Jul 2021 to Jun 2026', 'Program officer': 'Daniel Whitcombe' },
  },
  {
    name: 'Regional Water Quality Improvement Fund',
    organization: 'Central Valley Water Alliance',
    description: 'Stormwater capture, erosion control and sediment reduction.',
    fields: { 'Award number': 'RWQ-19-744', 'Match required': '20%', 'Award period': 'Jan 2020 to Dec 2026', 'Program officer': 'Priya Raman' },
  },
  {
    name: 'Sierra Meadows Restoration Initiative',
    organization: 'Sierra Headwaters Conservancy',
    description: 'Rewetting and reconnecting degraded mountain meadows.',
    fields: { 'Award number': 'SMR-2025-031', 'Match required': '15%', 'Award period': 'Jul 2025 to Jun 2029', 'Program officer': 'Hannah Bergstrom', 'Restricted to': 'Planning and implementation' },
  },
  {
    name: 'Federal Habitat Partnership Program',
    organization: 'National Watershed Partnership',
    description: 'Federal cost-share for habitat work with local sponsors.',
    fields: { 'Award number': 'NWP-HP-9-2203', 'Match required': '35%', 'Award period': 'Oct 2021 to Sep 2026', 'Program officer': 'Marcus Delgado' },
  },
  {
    name: 'Delta Ecosystem Restoration Fund',
    organization: 'Delta Conservancy Board',
    description: 'Floodplain, side channel and tidal habitat in the Delta.',
    fields: { 'Award number': 'DCB-ER-2020-15', 'Match required': '0%', 'Award period': 'Jul 2020 to Jun 2027' },
  },
  {
    name: 'Urban Greening Program',
    organization: 'Southern California Rivers Authority',
    description: 'Green infrastructure and river access in built-up watersheds.',
    fields: { 'Award number': 'UG-23-0880', 'Match required': '25%', 'Award period': 'Jan 2023 to Dec 2026', 'Program officer': 'Leilani Akana' },
  },
];

// A project's own contribution is a source too: one per lead organization, so
// the row links to something and the organization's page can total it.
const localMatches = (): Seed[] =>
  [...new Set(projects.map((p) => p.leadOrganization))].sort().map((organization) => ({
    name: LOCAL_MATCH_NAME,
    organization,
    description: 'The lead organization’s own contribution to its projects.',
    fields: {},
  }));

// A real workspace's funds, each under the organization behind it. They carry
// no description, dates or field values: the pull does not include them.
const realSeeds = (): Seed[] =>
  [...new Set([...realRecords.values()].flatMap((record) => record.funding.map((row) => row.fund)))]
    .sort()
    .map((fund) => ({ ...realFund(fund), description: '', fields: {} }));

export const fundingSources: FundingSource[] = (REAL ? realSeeds() : [...SEEDS, ...localMatches()]).map((seed) => ({
  slug: fundingSourceSlug(seed.name, seed.organization),
  ...seed,
}));

const bySlug = new Map(fundingSources.map((source) => [source.slug, source]));

export const getFundingSource = (slug: string): FundingSource | undefined => bySlug.get(slug);

/** The source a row names, by the two facts a row used to carry. */
export const findFundingSource = (name: string, organization: string): FundingSource | undefined =>
  bySlug.get(fundingSourceSlug(name, organization));

export const fundingSourceHref = (slug: string): string => `/prototypes/funding-sources/${slug}`;
