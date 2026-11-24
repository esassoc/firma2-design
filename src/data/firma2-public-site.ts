// The public site — what a workspace shows people who are not signed in.
//
// One list of destinations, read by the public header (and by nothing else, so
// the menu cannot drift from the pages). The inventory behind it is
// .scratch/public-views/inventory.md: each entry is the public pair of an app
// page, and uses the app page's own noun so a reader sent from one to the
// other meets the same word.
//
// THE WORKSPACE'S OWN PAGES sit in one Pages menu, after the fixed
// destinations. Custom pages' visibility is one workspace choice ("Everyone,
// including the public site"), so every page and document is listed; which
// ones show, and where, is a customization question (step 3).
//
// NOT HERE, deliberately: Updates, Reports, Funding (inventory §C).
import { progressOver } from './firma2-classification-rollup';
import { goalClassifications } from './firma2-classifications';
import type { Classification } from './firma2-classifications';
import { organizations } from './firma2-directory';
import { PAGES_GROUP, seedEntries } from './firma2-pages';
import { measures } from './firma2-performance-measures';
import type { PerformanceMeasureDefinition } from './firma2-performance-measures';
import { getProjectDetail } from './firma2-project-detail';
import { demoProjectSlug, projects, projectSlug } from './firma2-projects';
import { REAL } from './firma2-real-data';
import { seededFeatured } from './firma2-featured-photos';
import type { ProjectPhoto } from './firma2-project-detail';
import type { Project, ProjectStage } from './firma2-projects';
import { TENANT_NAME } from './firma2-project-types';
import { workspaceGeneral } from './firma2-workspace-settings';

export const PUBLIC_HOME_HREF = '/prototypes/public';
export const PUBLIC_SIGN_IN_HREF = '/prototypes/sign-in';

export type PublicNavKey = 'home' | 'pages' | 'projects' | 'organizations' | 'performance-measures' | 'classifications' | 'dashboard';

export interface PublicNavItem {
  key: PublicNavKey;
  label: string;
  href: string;
}

// No Home tab: the tenant's name, leading the bar, is the way home.
export const PUBLIC_NAV: PublicNavItem[] = [
  { key: 'projects', label: 'Projects', href: `${PUBLIC_HOME_HREF}/projects` },
  { key: 'organizations', label: 'Organizations', href: `${PUBLIC_HOME_HREF}/organizations` },
  { key: 'performance-measures', label: 'Performance measures', href: `${PUBLIC_HOME_HREF}/performance-measures` },
  { key: 'classifications', label: 'Classifications', href: `${PUBLIC_HOME_HREF}/classifications` },
  { key: 'dashboard', label: 'Progress Dashboard', href: `${PUBLIC_HOME_HREF}/dashboard` },
];

/** Whose site this is, and how to reach them. The name is the one the public
    project page has always worn. */
export const PUBLIC_SITE_OWNER = {
  name: TENANT_NAME,
  contact: workspaceGeneral.contact,
};

/** The Pages menu: the workspace's pages and documents, in the rail's order. */
export const PUBLIC_PAGES_LABEL = PAGES_GROUP;
export const publicPageHref = (id: string): string => `${PUBLIC_HOME_HREF}/pages/${id}`;
export const PUBLIC_PAGES = seedEntries
  .filter((entry) => entry.kind === 'page' || entry.kind === 'document')
  .map((entry) => ({ id: entry.id, label: (entry as { title: string }).title, href: publicPageHref(entry.id) }));

// ---------------------------------------------------------------------------
// What the public can see
// ---------------------------------------------------------------------------

// The stages Workspace settings › Stages shows on the public site (its seeded
// answers; the switch per stage lives there).
const PUBLIC_STAGES: ProjectStage[] = ['Planning & Design', 'Implementation', 'Post-Implementation', 'Completed'];

export interface PublicProject {
  project: Project;
  href: string;
  /** ISO day of the last publish. */
  publishedIso: string;
  /** The published stage and cost — the public reads the snapshot, not the record. */
  stage: ProjectStage;
  estimatedTotalCost: number;
}

export const publicProjectHref = (project: Project): string => `${PUBLIC_HOME_HREF}/${projectSlug(project)}`;

/**
 * Every project the public site shows: published at least once, in a stage
 * shown publicly, led by an organization that is public. One definition, read
 * by every public page, so a total on the home and a row in the finder can
 * never disagree about what counts.
 */
export const publicProjects = (): PublicProject[] =>
  projects.flatMap((project) => {
    const { publishing } = getProjectDetail(project);
    if (!publishing.publishedIso) return [];
    if (!PUBLIC_STAGES.includes(publishing.published.stage)) return [];
    if (organizations.find((o) => o.name === project.leadOrganization)?.visibility !== 'public') return [];
    return [
      {
        project,
        href: publicProjectHref(project),
        publishedIso: publishing.publishedIso,
        stage: publishing.published.stage,
        estimatedTotalCost: publishing.published.estimatedTotalCost,
      },
    ];
  });

export interface PublicMeasureTotal {
  measure: PerformanceMeasureDefinition;
  reported: number;
  projects: number;
}

/**
 * The measures the most public projects report toward, with their totals —
 * summable, published measures only (a rate has no portfolio total).
 * SIMPLIFICATION: a filing made since a project's last publish is counted
 * here; production would total the published filings only.
 */
export const publicMeasureTotals = (limit: number): PublicMeasureTotal[] => {
  const over = publicProjects().map((p) => p.project);
  return measures
    .filter((m) => m.status === 'Published' && m.countingRule === 'sum')
    .map((measure) => {
      const progress = progressOver(over, measure);
      return { measure, reported: progress.reported ?? 0, projects: progress.contributions.length };
    })
    .filter((t) => t.reported > 0)
    .sort((a, b) => b.projects - a.projects || a.measure.name.localeCompare(b.measure.name))
    .slice(0, limit);
};

// ---------------------------------------------------------------------------
// The home's AUTHORED content
// ---------------------------------------------------------------------------

/**
 * What an administrator writes or picks for the public home — the story half
 * of the page. INVENTED seed content; step 3 (customization) gives each field
 * its editor. Everything else on the home is COMPUTED from public projects and
 * is not editable: an administrator chooses what appears, never a number.
 */
export const PUBLIC_HOME = {
  /** One sentence: who, what, where, paid for how. */
  // A real workspace (dev only) has not written one, and has no notice up.
  description: REAL
    ? ''
    : 'A partnership of local organizations restoring streams, meadows and forests across Northern California, paid for by state, federal and private grants.',
  /** Hand-picked project slugs, in order. Ones that are not public drop out. */
  featured: [demoProjectSlug('red-clover-valley-meadow-reconnection'), demoProjectSlug('navarro-river-large-wood-placement'), demoProjectSlug('yuba-headwaters-fuels-reduction')],
  /** One current notice, or null for none (the default for a new workspace). */
  announcement: (REAL ? null : {
    text: 'Proposals for 2027 grants are due 15 January 2027.',
    linkLabel: 'Funding calendar',
    href: publicPageHref('funding-calendar'),
  }) as { text: string; linkLabel: string; href: string } | null,
};

// Doors to pages that are not built yet lead to their index, so nothing 404s;
// each becomes the entity's own public page when its template lands.
export const publicGoalHref = (_goal: Classification): string => `${PUBLIC_HOME_HREF}/classifications`;
export const publicOrganizationHref = (_name: string): string => `${PUBLIC_HOME_HREF}/organizations`;

export interface PublicFeatured extends PublicProject {
  /** The record's Featured photo; projects without one are not featured. */
  photo: ProjectPhoto;
  /** The record's oldest photo, when it has an earlier one than the Featured. */
  before?: ProjectPhoto;
}

export const publicFeatured = (): PublicFeatured[] => {
  const shown = publicProjects();
  return PUBLIC_HOME.featured.flatMap((slug) => {
    const found = shown.find((p) => projectSlug(p.project) === slug);
    if (!found) return [];
    const { photos } = getProjectDetail(found.project);
    const at = seededFeatured(slug, photos.length);
    return at < 0 ? [] : [{ ...found, photo: photos[at] }];
  });
};

// Each plan goal's icon, by icon-registry name. SEED CHOICES: a goal's icon is
// the administrator's to pick, as a stage's is (Workspace settings › Stages);
// classifications store none yet, so the picks live here until step 3.
const GOAL_ICONS: Record<string, string> = {
  'salmon-and-steelhead-recovery': 'fish',
  'riparian-and-wetland-habitat': 'sprout',
  'water-quality': 'droplet',
  'water-supply-reliability': 'glass-water',
  'wildfire-resilience': 'flame',
  'flood-risk-reduction': 'cloud-rain-wind',
  'public-access-and-recreation': 'footprints',
};

/** A plan goal's icon (icon-registry name) — the public home's goal cards and a project page's goals. */
export const publicGoalIcon = (goal: Classification): string => GOAL_ICONS[goal.slug] ?? 'target';

export interface PublicGoal {
  goal: Classification;
  /** An icon-registry name. */
  icon: string;
  href: string;
  /** Public projects carrying the goal. */
  projects: number;
  /** The goal's target that is furthest along; absent when nothing is reported yet. */
  lead?: { measure: PerformanceMeasureDefinition; reported: number; target: number; year: number; percent: number };
}

/**
 * The program's plan goals, each with ONE measure against its target, from
 * public projects only. WHICH measure: the target furthest along (reported ÷
 * target) — computed, so the home shows the goal's strongest result without
 * anyone choosing a number. Only summable measures qualify. Goals no public
 * project carries are left out; a goal with projects but no reports stays, and
 * says so.
 */
export const publicGoals = (): PublicGoal[] => {
  const shown = publicProjects().map((p) => p.project);
  return goalClassifications().flatMap((goal) => {
    const carrying = shown.filter((p) => p.classifications.includes(goal.name));
    if (carrying.length === 0) return [];
    const lead = (goal.targets ?? [])
      .flatMap((target) => {
        const measure = measures.find((m) => m.slug === target.measure);
        if (!measure || measure.status !== 'Published' || measure.countingRule !== 'sum') return [];
        const reported = progressOver(carrying, measure, target).reported ?? 0;
        return reported > 0 ? [{ measure, reported, target: target.value, year: target.year, percent: Math.min(100, Math.round((reported / target.value) * 100)) }] : [];
      })
      .sort((a, b) => b.reported / b.target - a.reported / a.target)[0];
    return [{ goal, icon: publicGoalIcon(goal), href: publicGoalHref(goal), projects: carrying.length, lead }];
  });
};

/**
 * The projects whose public pages changed most recently, each with its
 * Featured photo. Featured projects are left out — the hero already shows
 * them — and so is a project with no photo.
 */
export const publicRecentlyUpdated = (limit: number): PublicFeatured[] =>
  publicProjects()
    .filter((p) => !PUBLIC_HOME.featured.includes(projectSlug(p.project)))
    .sort((a, b) => b.publishedIso.localeCompare(a.publishedIso) || a.project.projectName.localeCompare(b.project.projectName))
    .flatMap((p) => {
      const { photos } = getProjectDetail(p.project);
      const at = seededFeatured(projectSlug(p.project), photos.length);
      // The record's oldest photo, when it is not the Featured one: the "before".
      return at < 0 ? [] : [{ ...p, photo: photos[at], before: at > 0 ? photos[0] : undefined }];
    })
    .slice(0, limit);

export interface PublicPartner {
  name: string;
  href: string;
  /** Public projects it leads (a lead) or funds (a funder). */
  projects: number;
  /** A funder's dollars on public projects — whole-project grant amounts. */
  amount?: number;
}

export interface PublicPartners {
  /** Public organizations funding a public project, largest total first. */
  funding: PublicPartner[];
  /** Organizations leading a public project, by name. */
  leading: PublicPartner[];
}

export const publicPartners = (): PublicPartners => {
  const shown = publicProjects();
  const isPublic = (name: string) => organizations.find((o) => o.name === name)?.visibility === 'public';
  const leads = new Map<string, number>();
  for (const p of shown) leads.set(p.project.leadOrganization, (leads.get(p.project.leadOrganization) ?? 0) + 1);
  const funders = new Map<string, { amount: number; projects: Set<string> }>();
  for (const p of shown) {
    for (const source of getProjectDetail(p.project).funding) {
      // A lead that part-funds its own project is credited once, as a lead.
      if (!isPublic(source.organization) || leads.has(source.organization)) continue;
      const entry = funders.get(source.organization) ?? { amount: 0, projects: new Set<string>() };
      entry.amount += source.amount;
      entry.projects.add(projectSlug(p.project));
      funders.set(source.organization, entry);
    }
  }
  return {
    funding: [...funders]
      .map(([name, f]) => ({ name, href: publicOrganizationHref(name), projects: f.projects.size, amount: f.amount }))
      .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name)),
    leading: [...leads]
      .filter(([name]) => isPublic(name))
      .map(([name, projects]) => ({ name, href: publicOrganizationHref(name), projects }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
};
