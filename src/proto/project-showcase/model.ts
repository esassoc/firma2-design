// PROTOTYPE — the data the /proto/project-showcase variants share.
// Throwaway (emil-prototype); production imports nothing here.
//
// One flat object per project, shaped for presentation: photos at the sizes
// the variants ask for, measures with their share of plan and year series,
// funding sources with shares, spending by year and cumulative. Public
// (published) values where the record and the snapshot differ.
import type { Project } from '../../data/firma2-projects';
import { projectSlug } from '../../data/firma2-projects';
import { getProjectDetail, latestReport } from '../../data/firma2-project-detail';
import type { ProjectPhoto } from '../../data/firma2-project-detail';
import { classificationNamed, isGoal } from '../../data/firma2-classifications';
import { organizations, verifiedDomain } from '../../data/firma2-directory';
import { projectTypeFor } from '../../data/firma2-project-types';
import { publicGoalHref, publicGoalIcon } from '../../data/firma2-public-site';
import { seededFeatured } from '../../data/firma2-featured-photos';
import { photoSrc } from '../../lib/project-photos';
import { withBase } from '../../lib/base';

export const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export const usdShort = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 });
export const num = (n: number, d = 1) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export const showcase = (project: Project) => {
  const detail = getProjectDetail(project);
  const published = detail.publishing.published;
  const slug = projectSlug(project);
  const featuredAt = seededFeatured(slug, detail.photos.length);
  // Featured first, then the rest oldest-first: the order a mosaic reads.
  const ordered: ProjectPhoto[] =
    featuredAt < 0 ? [] : [detail.photos[featuredAt], ...detail.photos.filter((_, i) => i !== featuredAt)];
  const photo = (p: ProjectPhoto, w: number, h: number) => ({ src: photoSrc(p, w, h, 70), alt: p.caption, date: p.date });
  const withheld = (name: string, year: number) =>
    Boolean(published?.withheldReports?.some((r) => r.measure === name && r.year === year));

  const measures = detail.measures.map((m) => {
    const series = m.series.map((p) => ({ year: p.year, value: withheld(m.name, p.year) ? null : p.value, planned: p.planned ?? 0, status: p.status }));
    const reported = series.reduce((s, p) => s + (p.value ?? 0), 0);
    return {
      name: m.name,
      unit: m.unit,
      reported,
      expected: m.expected,
      percent: m.expected > 0 ? Math.min(100, Math.round((reported / m.expected) * 100)) : 0,
      last: latestReport(series)?.year ?? null,
      series,
    };
  });

  const funding = detail.funding.filter((row) => row.status === 'secured')
    .filter((f) => !published?.withheldFunding?.includes(f.name))
    .sort((a, b) => b.amount - a.amount);
  const fundingTotal = funding.reduce((s, f) => s + f.amount, 0);
  let running = 0;
  const spending = detail.expenditures.map((e) => {
    running += e.spent;
    return { year: e.year, spent: e.spent, cumulative: running, status: e.status };
  });
  const cost = published?.estimatedTotalCost ?? project.estimatedTotalCost;
  const spent = running;
  const lead = organizations.find((o) => o.name === project.leadOrganization);

  return {
    slug,
    name: project.projectName,
    type: projectTypeFor(project)?.name ?? '',
    stage: published?.stage ?? project.stage,
    start: published?.implementationStartYear ?? project.implementationStartYear,
    end: published?.completionYear ?? project.completionYear,
    county: published?.county ?? project.county,
    lead: project.leadOrganization,
    leadDomain: lead ? verifiedDomain(lead) : undefined,
    description: published?.description ?? detail.projectDescription,
    photos: ordered,
    photo,
    before: detail.photos.length > 1 ? detail.photos[0] : undefined,
    after: detail.photos.length > 1 ? detail.photos[detail.photos.length - 1] : undefined,
    goals: project.classifications
      .map((n) => classificationNamed(n))
      .filter((c): c is NonNullable<typeof c> => !!c && isGoal(c))
      .map((g) => ({ name: g.name, description: g.description, icon: publicGoalIcon(g), href: withBase(publicGoalHref(g)) })),
    measures,
    pastHalf: measures.filter((m) => m.percent >= 50).length,
    lastReport: Math.max(0, ...measures.map((m) => m.last ?? 0)) || null,
    funding: funding.map((f) => ({ ...f, share: fundingTotal ? f.amount / fundingTotal : 0 })),
    fundingTotal,
    spending,
    spent,
    cost,
    milestones: detail.milestones,
    detail,
  };
};

export type Showcase = ReturnType<typeof showcase>;

/** A ring's stroke-dasharray for a percent, on a circle of radius r. */
export const ring = (percent: number, r: number) => {
  const c = 2 * Math.PI * r;
  return { c, dash: `${((percent / 100) * c).toFixed(2)} ${c.toFixed(2)}` };
};
