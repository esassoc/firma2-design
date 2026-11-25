// PROTOTYPE — money by year and related organizations for /proto/project-record. Throwaway.
//
// The record does not hold amounts by year yet (docs/data-model.md, decision 7
// as amended 2026-11-24). This spreads each funding row's amount over the
// project's years, deterministically, so the variants have real-shaped data:
// sources that start late, sources that fund one year, years with nothing.
import type { ProjectDetail } from '../../data/firma2-project-detail';
import { FUNDING_STATUS_LABEL, fundingSourceHref, getFundingSource, type FundingStatus } from '../../data/firma2-funding-sources';
import { organizations } from '../../data/firma2-directory';
import { organizationPageHref } from '../../data/firma2-organization-pages';
import { realRecords } from '../../data/firma2-real-data';
import { withBase } from '../../lib/base';

export interface PlanRow {
  name: string;
  organization: string;
  href?: string;
  status: FundingStatus;
  statusLabel: string;
  total: number;
  /** Whole dollars by year. A year the source puts nothing in is absent. */
  byYear: Record<number, number>;
  /** Whole dollars spent from this source by year, and in all. */
  spentByYear: Record<number, number>;
  spent: number;
}

export interface ProjectOrganization {
  name: string;
  href?: string;
  /** "Lead", "Funder", "Lead, funder" or "Related". */
  part: string;
}

export interface FundingPlan {
  years: number[];
  rows: PlanRow[];
  /** Secured money by year, and in all. */
  securedByYear: Record<number, number>;
  secured: number;
  requested: number;
  cost: number;
  /** Estimated total cost less secured and requested funding. Never below zero. */
  gap: number;
  /** Years with spend, and the spend in each, across every source. */
  spendYears: number[];
  spentTotalByYear: Record<number, number>;
  spent: number;
  /** Organizations named on the project that neither lead nor fund it. */
  related: ProjectOrganization[];
  /** Lead, funders and related organizations, in that order. */
  organizations: ProjectOrganization[];
}

export const fundingPlan = (detail: ProjectDetail): FundingPlan => {
  const { project } = detail;
  const start = project.implementationStartYear;
  const end = Math.max(start, project.completionYear);
  const years = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const rows: PlanRow[] = detail.funding.map((row, i) => {
    // A source's own window inside the project's: later sources start later,
    // and every other one stops a year early.
    const from = Math.min(years.length - 1, i % 3);
    const length = Math.max(1, years.length - from - (i % 2));
    const window = years.slice(from, from + length);
    // Front-loaded weights: n, n-1, … 1.
    const weights = window.map((_, k) => window.length - k);
    const weightSum = weights.reduce((a, b) => a + b, 0);
    const byYear: Record<number, number> = {};
    let left = row.amount;
    window.forEach((year, k) => {
      const amount = k === window.length - 1 ? left : Math.round((row.amount * weights[k]) / weightSum / 100) * 100;
      const given = Math.min(left, amount);
      if (given > 0) byYear[year] = given;
      left -= given;
    });
    return {
      name: row.name,
      organization: row.organization,
      href: getFundingSource(row.source) ? withBase(fundingSourceHref(row.source)) : undefined,
      status: row.status,
      statusLabel: FUNDING_STATUS_LABEL[row.status],
      total: row.amount,
      byYear,
      spentByYear: {},
      spent: 0,
    };
  });

  const securedRows = rows.filter((row) => row.status === 'secured');
  const securedByYear: Record<number, number> = {};
  for (const row of securedRows) for (const [year, amount] of Object.entries(row.byYear)) securedByYear[Number(year)] = (securedByYear[Number(year)] ?? 0) + amount;
  const secured = securedRows.reduce((sum, row) => sum + row.total, 0);
  const requested = rows.filter((row) => row.status === 'requested').reduce((sum, row) => sum + row.total, 0);
  const cost = project.estimatedTotalCost;

  // Spend by source: each year's spend, shared among the secured sources by
  // the size of their funding. The last source takes the remainder.
  const spendYears: number[] = [];
  const spentTotalByYear: Record<number, number> = {};
  for (const e of detail.expenditures) {
    if (e.spent <= 0 || securedRows.length === 0) continue;
    spendYears.push(e.year);
    spentTotalByYear[e.year] = e.spent;
    let left = e.spent;
    securedRows.forEach((row, k) => {
      const part = k === securedRows.length - 1 ? left : Math.min(left, Math.round((e.spent * row.total) / (secured || 1) / 100) * 100);
      if (part > 0) row.spentByYear[e.year] = part;
      row.spent += part;
      left -= part;
    });
  }
  const spent = Object.values(spentTotalByYear).reduce((a, b) => a + b, 0);

  // Related organizations. A real workspace (dev only) names its implementers
  // and partners; the invented one takes a few from the directory.
  const orgHref = (name: string) => {
    const org = organizations.find((o) => o.name === name);
    return org ? withBase(organizationPageHref(org.slug)) : undefined;
  };
  const funders = [...new Set(rows.filter((row) => row.status !== 'not-awarded').map((row) => row.organization))];
  const taken = new Set([project.leadOrganization, ...funders]);
  const record = realRecords.get(project.projectName);
  const relatedNames = record
    ? record.organizations.filter((o) => o.role !== 'Lead Implementer' && o.role !== 'Funder').map((o) => o.name)
    : Array.from({ length: project.projectName.length % 4 }, (_, k) => organizations[(project.projectName.length * 7 + k * 5) % organizations.length].name);
  const related: ProjectOrganization[] = [...new Set(relatedNames)].filter((name) => !taken.has(name)).map((name) => ({ name, href: orgHref(name), part: 'Related' }));
  const all: ProjectOrganization[] = [
    { name: project.leadOrganization, href: orgHref(project.leadOrganization), part: funders.includes(project.leadOrganization) ? 'Lead, funder' : 'Lead' },
    ...funders.filter((name) => name !== project.leadOrganization).map((name) => ({ name, href: orgHref(name), part: 'Funder' })),
    ...related,
  ];

  return { years, rows, securedByYear, secured, requested, cost, gap: Math.max(0, cost - secured - requested), spendYears, spentTotalByYear, spent, related, organizations: all };
};
