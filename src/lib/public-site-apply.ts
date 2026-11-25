// Lays the public site's settings over a public page — the half of Workspace
// settings › Public site that the public sees.
//
// THE PAGE IS BUILT IN ITS DEFAULT ARRANGEMENT; THIS REARRANGES IT. The server
// renders every section, every result and project the settings can choose
// among, and a template for each thing they can add. This reads the settings
// stored in the browser and moves, hides, words and fills what is already
// there. Nothing an administrator typed is read as markup, and no figure is
// touched: the numbers stay the page's own.
//
// WHICH COPY. The public reads the published settings. The preview frame on
// the settings screen (an iframe marked `data-public-site-preview`) reads the
// draft, and re-applies on every storage event, so it follows the controls
// beside it. So does any open public page when Publish is pressed.
//
// EVERY STEP CAN RUN AGAIN. A storage event re-applies the whole thing, so
// each step works from the elements the server rendered (kept by key the
// first time), never from the result of the last run.
//
// FAKED: in production the server would render the published settings; the
// browser does it here because the prototype has no server. Hence the held
// first paint in PublicLayout.

import { withBase } from './base';
import { announcementShows, FONT_PAIRS, isBuiltIn, MAX_FEATURED, MAX_RESULTS } from './public-site-config';
import type { PublicSiteConfig, PublicSiteDefaults, SiteBlock, SiteLink } from './public-site-config';
import { PUBLIC_SITE_KEY, readDefaults, readDraft, readPublished } from './public-site-store';

const root = document.documentElement;

const isPreview = (): boolean => {
  try {
    return window.frameElement?.hasAttribute('data-public-site-preview') ?? false;
  } catch {
    return false;
  }
};

/** An address an administrator typed, as somewhere a link may go — or null. */
const linkTo = (href: string): string | null => {
  const h = href.trim();
  if (/^(https?:\/\/|mailto:)/i.test(h)) return h;
  if (h.startsWith('/')) return withBase(h);
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(h)) return `https://${h}`;
  return null;
};
const leavesSite = (href: string): boolean => /^https?:\/\//i.test(href);

const setLabel = (button: Element, label: string): void => {
  const at = button.querySelector('.esa-button__label') ?? button;
  at.textContent = label;
};

const wrapperOf = (native: Element): HTMLElement => (native.closest('.esa-button') ?? native) as HTMLElement;

/** Put `nodes` in `host` in this order, moving only what is out of place. */
const arrange = (host: Element, nodes: Element[]): void => {
  nodes.forEach((node, i) => {
    if (host.children[i] !== node) host.insertBefore(node, host.children[i] ?? null);
  });
  while (host.children.length > nodes.length) host.lastElementChild!.remove();
};

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

const baseTitle = document.title;

const meta = (key: string, value: string, attr: 'name' | 'property' = 'property'): void => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!value) return el?.remove();
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.append(el);
  }
  el.content = value;
};

const applyIdentity = (config: PublicSiteConfig, defaults: PublicSiteDefaults): void => {
  const { identity } = config;
  const name = identity.name.trim() || defaults.config.identity.name;
  document.title = baseTitle.split(defaults.config.identity.name).join(name);
  document.querySelectorAll('[data-site-name]').forEach((el) => (el.textContent = name));
  document.querySelectorAll<HTMLImageElement>('[data-site-logo]').forEach((img) => {
    img.hidden = !identity.logo;
    if (identity.logo) img.src = identity.logo;
    else img.removeAttribute('src');
  });
  let icon = document.head.querySelector<HTMLLinkElement>('link[data-site-icon]');
  if (identity.icon) {
    if (!icon) {
      icon = document.createElement('link');
      icon.rel = 'icon';
      icon.setAttribute('data-site-icon', '');
      document.head.append(icon);
    }
    icon.href = identity.icon;
  } else icon?.remove();
  const shared = defaults.projects.find((p) => p.value === identity.shareImage) ?? defaults.projects.find((p) => p.value === config.home.hero.featured[0]);
  meta('og:title', name);
  meta('og:description', identity.shareText.trim());
  meta('description', identity.shareText.trim(), 'name');
  meta('og:image', shared?.photo ?? '');
};

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

const FONT_LINK = 'firma2-public-site-fonts';

const applyTheme = (config: PublicSiteConfig): void => {
  const { theme } = config;
  if (theme.hero === 'dark') root.removeAttribute('data-public-hero');
  else root.setAttribute('data-public-hero', theme.hero);
  if (theme.accent) root.style.setProperty('--firma2-public-accent', theme.accent);
  else root.style.removeProperty('--firma2-public-accent');

  const header = document.querySelector('.firma2-public-header');
  header?.classList.toggle('esa-app-bar--surface', theme.bar === 'neutral');
  header?.classList.toggle('esa-app-bar--brand', theme.bar === 'brand');
  header?.classList.toggle('esa-app-bar--brand-strong', theme.bar === 'dark');

  const pair = FONT_PAIRS.find((f) => f.value === theme.fonts) ?? FONT_PAIRS[0];
  const themed = document.querySelector<HTMLElement>('[data-theme]') ?? root;
  const font = (token: string, family: string): void => {
    if (family) themed.style.setProperty(token, family);
    else themed.style.removeProperty(token);
  };
  font('--typography-font-family-sans', pair.body);
  font('--typography-font-family-display', pair.display);
  const href = pair.load.length ? `https://fonts.googleapis.com/css2?${pair.load.map((f) => `family=${f}`).join('&')}&display=swap` : '';
  let link = document.getElementById(FONT_LINK) as HTMLLinkElement | null;
  if (!href) return link?.remove();
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK;
    link.rel = 'stylesheet';
    document.head.append(link);
  }
  if (link.href !== href) link.href = href;
};

// ---------------------------------------------------------------------------
// Navigation bar
// ---------------------------------------------------------------------------

interface Bar {
  header: HTMLElement;
  row: HTMLElement;
  menu: HTMLElement;
  rowItems: Map<string, HTMLElement>;
  menuItems: Map<string, HTMLElement>;
  rowPages: Map<string, HTMLElement>;
  menuPages: Map<string, HTMLElement>;
  template: HTMLTemplateElement | null;
}

let bar: Bar | null | undefined;

const readBar = (): Bar | null => {
  const header = document.querySelector<HTMLElement>('.firma2-public-header');
  const row = header?.querySelector<HTMLElement>('[data-nav-row]');
  const menu = header?.querySelector<HTMLElement>('[data-nav-menu]');
  if (!header || !row || !menu) return null;
  const keyed = (host: Element, attr: string, own = false) =>
    new Map(
      [...host.querySelectorAll<HTMLElement>(`[${attr}]`)].map((el) => [el.getAttribute(attr)!, own && el.matches('div') ? el : wrapperOf(el)] as [string, HTMLElement]),
    );
  return {
    header,
    row,
    menu,
    rowItems: keyed(row, 'data-nav-key', true),
    menuItems: keyed(menu, 'data-nav-key'),
    rowPages: keyed(row, 'data-page-id'),
    menuPages: keyed(menu, 'data-page-id'),
    template: header.querySelector<HTMLTemplateElement>('template[data-nav-link-template]'),
  };
};

/** Fold the tabs into the menu when they no longer fit beside the name and the corner. */
const measureBar = (): void => {
  if (!bar) return;
  const main = bar.row.parentElement;
  if (!main || main.clientWidth === 0) return bar.header.removeAttribute('data-collapsed');
  bar.header.toggleAttribute('data-collapsed', bar.row.scrollWidth > main.clientWidth + 1);
};

const linkButton = (template: HTMLTemplateElement | null, link: SiteLink): HTMLElement | null => {
  const href = linkTo(link.href);
  const made = template?.content.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
  if (!made || !href || !link.label.trim()) return null;
  const a = made.querySelector('a') ?? made;
  a.setAttribute('href', href);
  if (!leavesSite(href)) {
    a.removeAttribute('target');
    a.removeAttribute('rel');
  }
  setLabel(made, link.label.trim());
  return made;
};

const applyNav = (config: PublicSiteConfig, defaults: PublicSiteDefaults): void => {
  if (bar === undefined) {
    bar = readBar();
    if (bar) {
      new ResizeObserver(measureBar).observe(bar.header);
      void document.fonts?.ready.then(measureBar);
    }
  }
  if (!bar) return;
  const { nav } = config;
  const label = (key: string): string => nav.labels[key]?.trim() || defaults.navItems.find((item) => item.value === key)?.label || key;
  const pagesShown = (pages: Map<string, HTMLElement>): HTMLElement[] =>
    [...pages].flatMap(([id, el]) => {
      el.hidden = nav.hiddenPages.includes(id);
      return el.hidden ? [] : [el];
    });

  const rowNodes: HTMLElement[] = [];
  const menuNodes: HTMLElement[] = [];
  for (const key of nav.order) {
    if (key === 'pages') {
      const dropdown = bar.rowItems.get('pages');
      if (dropdown && pagesShown(bar.rowPages).length) {
        const summary = dropdown.querySelector('summary');
        if (summary) setLabel(summary, label('pages'));
        rowNodes.push(dropdown);
      }
      menuNodes.push(...pagesShown(bar.menuPages));
    } else if (nav.links[key]) {
      const inRow = linkButton(bar.template, nav.links[key]);
      const inMenu = linkButton(bar.template, nav.links[key]);
      if (inRow && inMenu) {
        rowNodes.push(inRow);
        menuNodes.push(inMenu);
      }
    } else {
      const inRow = bar.rowItems.get(key);
      const inMenu = bar.menuItems.get(key);
      if (inRow) {
        setLabel(inRow, label(key));
        rowNodes.push(inRow);
      }
      if (inMenu) {
        setLabel(inMenu, label(key));
        menuNodes.push(inMenu);
      }
    }
  }
  arrange(bar.row, rowNodes);
  arrange(bar.menu, menuNodes);
  measureBar();
};

// ---------------------------------------------------------------------------
// Announcement and footer
// ---------------------------------------------------------------------------

const today = (): string => new Date().toISOString().slice(0, 10);

const applyAnnouncement = (config: PublicSiteConfig): void => {
  const strip = document.querySelector<HTMLElement>('[data-site-announcement]');
  if (!strip) return;
  const notice = config.announcement;
  strip.hidden = !announcementShows(notice, today());
  const text = strip.querySelector('[data-notice-text]');
  if (text) text.textContent = notice.text.trim();
  const a = strip.querySelector('a');
  const href = linkTo(notice.href);
  if (!a) return;
  a.hidden = !href || !notice.linkLabel.trim();
  a.textContent = notice.linkLabel.trim();
  a.setAttribute('href', href ?? '#');
};

const anchors = (host: HTMLElement | null, links: SiteLink[]): void => {
  if (!host) return;
  const made = links.flatMap((link) => {
    const href = linkTo(link.href);
    if (!href || !link.label.trim()) return [];
    const a = document.createElement('a');
    a.href = href;
    a.textContent = link.label.trim();
    if (leavesSite(href)) a.rel = 'noopener';
    return [a];
  });
  host.replaceChildren(...made);
  host.hidden = made.length === 0;
};

const applyFooter = (config: PublicSiteConfig): void => {
  const { footer } = config;
  document.querySelectorAll<HTMLElement>('[data-footer-contact]').forEach((el) => (el.hidden = !footer.contact));
  document.querySelectorAll<HTMLElement>('[data-footer-funders]').forEach((el) => (el.hidden = !footer.funders));
  anchors(document.querySelector('[data-footer-links]'), footer.links);
  anchors(document.querySelector('[data-footer-social]'), footer.social);
};

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------

let sections: Map<string, HTMLElement> | undefined;
const built = new Map<string, { signature: string; el: HTMLElement }>();

const paragraphs = (host: Element | null, body: string): void => {
  if (!host) return;
  const made = body
    .split(/\n\s*\n/)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      return p;
    });
  host.replaceChildren(...made);
  (host as HTMLElement).hidden = made.length === 0;
};

/** One authored block, from its template — or null when it has nothing to show. */
const buildBlock = (id: string, block: SiteBlock): HTMLElement | null => {
  const signature = JSON.stringify(block);
  const kept = built.get(id);
  if (kept?.signature === signature) return kept.el;
  const key = block.kind === 'page' ? `page:${block.pageId}` : block.kind;
  const template = [...document.querySelectorAll<HTMLTemplateElement>('template[data-block-template]')].find((t) => t.dataset.blockTemplate === key);
  const el = template?.content.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
  if (!el) return null;
  el.dataset.homeSection = id;
  if (block.kind !== 'page') {
    const heading = el.querySelector<HTMLElement>('[data-block-heading]');
    if (heading) {
      heading.textContent = block.heading.trim();
      heading.hidden = !block.heading.trim();
    }
    paragraphs(el.querySelector('[data-block-body]'), block.body);
    const image = el.querySelector<HTMLImageElement>('[data-block-image]');
    if (image) {
      if (!block.image) return null;
      image.src = block.image;
      image.alt = block.imageAlt.trim();
      image.closest<HTMLElement>('section')!.dataset.side = block.side;
    }
    const button = el.querySelector<HTMLElement>('[data-block-button]');
    if (button) {
      const href = linkTo(block.href);
      if (!href || !block.buttonLabel.trim()) return null;
      const a = button.querySelector('a')!;
      a.setAttribute('href', href);
      if (leavesSite(href)) a.setAttribute('rel', 'noopener');
      setLabel(button, block.buttonLabel.trim());
    }
    if (block.kind === 'text' && !block.heading.trim() && !block.body.trim()) return null;
  }
  built.set(id, { signature, el });
  return el;
};

const applyHero = (hero: HTMLElement, config: PublicSiteConfig, defaults: PublicSiteDefaults): void => {
  const set = config.home.hero;
  const headline = hero.querySelector('[data-hero-headline]');
  if (headline) headline.textContent = set.headline.trim() || config.identity.name.trim() || defaults.config.identity.name;
  const description = hero.querySelector<HTMLElement>('[data-hero-description]');
  if (description) {
    description.textContent = set.description.trim();
    description.hidden = !set.description.trim();
  }

  const results = hero.querySelector<HTMLElement>('[data-hero-results]');
  if (results) {
    const all = new Map([...results.querySelectorAll<HTMLElement>('[data-result]')].map((li) => [li.dataset.result!, li]));
    const chosen = set.results.flatMap((slug) => all.get(slug) ?? []).slice(0, MAX_RESULTS);
    all.forEach((li) => (li.hidden = !chosen.includes(li)));
    chosen.forEach((li) => results.append(li));
    results.hidden = chosen.length === 0;
  }

  const featured = hero.querySelector<HTMLElement>('[data-hero-featured]');
  const template = hero.querySelector<HTMLTemplateElement>('template[data-hero-featured-template]');
  if (!featured || !template) return;
  const chosen = set.featured.flatMap((slug) => defaults.projects.find((p) => p.value === slug) ?? []).slice(0, MAX_FEATURED);
  const signature = chosen.map((p) => p.value).join(' ');
  featured.hidden = chosen.length === 0;
  if (featured.dataset.shown === signature) return;
  featured.dataset.shown = signature;
  featured.replaceChildren(
    ...chosen.map((p, i) => {
      const li = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
      li.querySelector('a')!.href = withBase(p.href);
      const img = li.querySelector('img')!;
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.alt = p.alt;
      img.src = p.photo;
      li.querySelector('[data-name]')!.textContent = p.label;
      li.querySelector('[data-meta]')!.textContent = p.meta;
      return li;
    }),
  );
};

const applyMap = (section: HTMLElement, config: PublicSiteConfig): void => {
  const map = section.querySelector<HTMLElement>('.firma2-project-set-map');
  if (!map) return;
  const terrain = config.home.map.base === 'terrain';
  if (map.hasAttribute('data-terrain') !== terrain) {
    map.toggleAttribute('data-terrain', terrain);
    map.dispatchEvent(new CustomEvent('firma2:set-map-base', { detail: { terrain } }));
  }
  const slugs = config.home.map.area !== 'all'
    ? [...section.querySelectorAll<HTMLElement>('[data-project-list] li[data-county]')].filter((li) => li.dataset.county === config.home.map.area).map((li) => li.dataset.slug!)
    : [];
  if ((map.dataset.frame ?? '') !== slugs.join(' ')) {
    map.dataset.frame = slugs.join(' ');
    map.dispatchEvent(new CustomEvent('firma2:set-map-frame', { detail: { slugs } }));
  }
};

const applyGoals = (section: HTMLElement, config: PublicSiteConfig): void => {
  const list = section.querySelector<HTMLElement>('.firma2-public-goals__list');
  if (!list) return;
  const all = new Map([...list.querySelectorAll<HTMLElement>('[data-goal]')].map((li) => [li.dataset.goal!, li]));
  const chosen = config.home.goals.shown.flatMap((slug) => all.get(slug) ?? []);
  all.forEach((li) => (li.hidden = !chosen.includes(li)));
  chosen.forEach((li) => list.append(li));
  section.hidden = chosen.length === 0;
};

const applyRecent = (section: HTMLElement, config: PublicSiteConfig): void => {
  const cards = [...section.querySelectorAll<HTMLElement>('li[data-slug]')];
  // The introduction already shows the featured projects, when it is on the page.
  const featured = config.home.order.includes('hero') ? config.home.hero.featured.slice(0, MAX_FEATURED) : [];
  let left = Number(config.home.recent.count) || 3;
  cards.forEach((li) => {
    const shows = left > 0 && !featured.includes(li.dataset.slug!);
    li.hidden = !shows;
    if (shows) left -= 1;
  });
  const inner = section.querySelector<HTMLElement>('[data-recent]');
  if (inner) inner.hidden = cards.every((li) => li.hidden);
  section.hidden = cards.every((li) => li.hidden);
};

const applyPartners = (section: HTMLElement, config: PublicSiteConfig): void => {
  const set = config.home.partners;
  const funders = section.querySelector<HTMLElement>('[data-partners="funders"]');
  const leads = section.querySelector<HTMLElement>('[data-partners="leads"]');
  if (funders) funders.hidden = !set.funders;
  if (leads) leads.hidden = !set.leads;
  section.querySelectorAll<HTMLElement>('[data-partner-amount]').forEach((el) => (el.hidden = !set.amounts));
  section.hidden = [funders, leads].every((el) => !el || el.hidden);
};

const applyHome = (config: PublicSiteConfig, defaults: PublicSiteDefaults): void => {
  const home = document.querySelector<HTMLElement>('[data-public-home]');
  if (!home) return;
  sections ??= new Map([...home.querySelectorAll<HTMLElement>(':scope > [data-home-section]')].map((el) => [el.dataset.homeSection!, el]));
  const kept = sections;
  const nodes = config.home.order.flatMap((id) => {
    if (isBuiltIn(id)) return kept.get(id) ?? [];
    const block = config.home.blocks[id];
    return (block && buildBlock(id, block)) || [];
  });
  const moved = nodes.some((node, i) => home.children[i] !== node) || home.children.length !== nodes.length;
  arrange(home, nodes);

  const at = (id: string): HTMLElement | undefined => (config.home.order.includes(id) ? kept.get(id) : undefined);
  const hero = at('hero');
  if (hero) applyHero(hero, config, defaults);
  const map = at('map');
  if (map) applyMap(map, config);
  const goals = at('goals');
  if (goals) applyGoals(goals, config);
  const recent = at('recent');
  if (recent) applyRecent(recent, config);
  const partners = at('partners');
  if (partners) applyPartners(partners, config);
  // A map that changed place has to re-measure its canvas.
  if (moved) window.dispatchEvent(new Event('resize'));
};

// ---------------------------------------------------------------------------

const apply = (config: PublicSiteConfig, defaults: PublicSiteDefaults): void => {
  const steps = [applyIdentity, applyTheme, applyNav, applyAnnouncement, applyFooter, applyHome];
  steps.forEach((step) => {
    try {
      step(config, defaults);
    } catch (error) {
      // One section's settings failing must not take the rest of the page with it.
      console.error(error);
    }
  });
};

export const applyPublicSite = (): void => {
  const defaults = readDefaults();
  const shown = (): void => root.removeAttribute('data-public-site-pending');
  if (!defaults) return shown();
  const run = (): void => {
    apply(isPreview() ? readDraft(defaults.config) : readPublished(defaults.config), defaults);
    shown();
  };
  run();
  window.addEventListener('storage', (event) => {
    if (event.key === null || event.key === PUBLIC_SITE_KEY) run();
  });
};
