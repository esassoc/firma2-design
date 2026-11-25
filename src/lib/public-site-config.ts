// The public site's settings — what an administrator may change about the
// site a workspace shows the public (Workspace settings › Public site), and
// the closed lists each choice is made from.
//
// THE SHAPE ONLY. No data import lives here: the settings screens and every
// public page load this in the browser, and the workspace's own values (its
// name, its goals, its projects) reach them as JSON the server wrote into the
// page (`publicSiteDefaults()` in src/data/firma2-public-site.ts). Importing
// the data here would ship the whole fixture set to every public reader.
//
// AN ADMINISTRATOR CHOOSES WHAT APPEARS, NEVER A NUMBER. Nothing in this shape
// holds a figure: results, goals, funders and totals stay computed from
// published projects. The settings pick, order and word.
//
// FONTS AND COLOURS ARE CLOSED LISTS (spec decisions 4 and 5). A font is one
// of FONT_PAIRS; a colour is a named role with a few values, so the contrast
// check can grade every combination a workspace can reach.

/** The one-of-a-kind sections of the home page. */
export type BuiltInSection = 'hero' | 'map' | 'goals' | 'recent' | 'partners';
/** The sections an administrator writes, and may add more than once. */
export type BlockKind = 'text' | 'image-text' | 'button' | 'page';

export interface SiteBlock {
  kind: BlockKind;
  heading: string;
  body: string;
  /** image-text: a data URL, downscaled on upload. */
  image: string;
  imageAlt: string;
  /** image-text: which side the picture sits on. */
  side: 'start' | 'end';
  /** button: the button's words and where it leads. */
  buttonLabel: string;
  href: string;
  /** page: the custom page shown in place. */
  pageId: string;
}

export interface SiteLink {
  label: string;
  href: string;
}

export interface PublicSiteConfig {
  access: { public: boolean; contacts: boolean };
  identity: {
    name: string;
    /** Data URLs, downscaled on upload; '' for none. */
    logo: string;
    icon: string;
    shareText: string;
    /** A featured-photo candidate's slug; 'featured' for the first featured project. */
    shareImage: string;
  };
  announcement: { on: boolean; text: string; linkLabel: string; href: string; from: string; until: string };
  home: {
    /** Section ids in page order: a BuiltInSection, or a key of `blocks`. */
    order: string[];
    hero: { headline: string; description: string; results: string[]; featured: string[] };
    /** `area`: 'all', or the county the map opens on. */
    map: { base: 'terrain' | 'plain'; area: string };
    goals: { shown: string[] };
    recent: { count: string };
    partners: { funders: boolean; leads: boolean; amounts: boolean };
    blocks: Record<string, SiteBlock>;
  };
  nav: {
    /** Destination keys in bar order: a public destination, 'pages', or a key of `links`. */
    order: string[];
    labels: Record<string, string>;
    links: Record<string, SiteLink>;
    /** Custom pages left out of the Pages menu. */
    hiddenPages: string[];
  };
  theme: { fonts: string; bar: 'neutral' | 'brand' | 'dark'; hero: 'dark' | 'brand' | 'light'; accent: string };
  footer: { contact: boolean; funders: boolean; links: SiteLink[]; social: SiteLink[] };
}

/** What the server tells the browser about this workspace: the starting settings and what each list can hold. */
export interface PublicSiteDefaults {
  config: PublicSiteConfig;
  /** key → label for everything a list can hold. */
  measures: Option[];
  goals: Option[];
  projects: FeaturedOption[];
  pages: Option[];
  counties: Option[];
  navItems: Option[];
  /** Built-in sections with nothing to show, and why. */
  empty: Partial<Record<BuiltInSection, string>>;
}

export interface Option {
  value: string;
  label: string;
}

export interface FeaturedOption extends Option {
  href: string;
  meta: string;
  photo: string;
  alt: string;
}

export const BUILT_IN_SECTIONS: { value: BuiltInSection; label: string }[] = [
  { value: 'hero', label: 'Introduction' },
  { value: 'map', label: 'Map' },
  { value: 'goals', label: 'Goals' },
  { value: 'recent', label: 'Recently updated' },
  { value: 'partners', label: 'Partners' },
];

export const BLOCK_KINDS: { value: BlockKind; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'image-text', label: 'Image with text' },
  { value: 'button', label: 'Button' },
  { value: 'page', label: 'Custom page' },
];

export const isBuiltIn = (id: string): id is BuiltInSection => BUILT_IN_SECTIONS.some((s) => s.value === id);

export const newBlock = (kind: BlockKind): SiteBlock => ({
  kind,
  heading: '',
  body: '',
  image: '',
  imageAlt: '',
  side: 'start',
  buttonLabel: '',
  href: '',
  pageId: '',
});

/** How many of each pick the page has room for. */
export const MAX_RESULTS = 4;
export const MAX_FEATURED = 3;

export interface FontPair {
  value: string;
  label: string;
  /** CSS font-family values; '' keeps the product's own. */
  display: string;
  body: string;
  /** Google Fonts `family=` parameters to load, none for the product's own. */
  load: string[];
}

const FALLBACK_SANS = 'system-ui, sans-serif';
const FALLBACK_SERIF = 'Georgia, serif';

/** Tested pairings. Each loads from Google Fonts only once it is chosen. */
export const FONT_PAIRS: FontPair[] = [
  { value: 'standard', label: 'Standard', display: '', body: '', load: [] },
  { value: 'public-sans', label: 'Public Sans', display: `'Public Sans', ${FALLBACK_SANS}`, body: `'Public Sans', ${FALLBACK_SANS}`, load: ['Public+Sans:wght@400;500;600;700'] },
  {
    value: 'atkinson',
    label: 'Atkinson Hyperlegible',
    display: `'Atkinson Hyperlegible', ${FALLBACK_SANS}`,
    body: `'Atkinson Hyperlegible', ${FALLBACK_SANS}`,
    load: ['Atkinson+Hyperlegible:wght@400;700'],
  },
  {
    value: 'source',
    label: 'Source Serif headings, Source Sans text',
    display: `'Source Serif 4', ${FALLBACK_SERIF}`,
    body: `'Source Sans 3', ${FALLBACK_SANS}`,
    load: ['Source+Serif+4:wght@400;600;700', 'Source+Sans+3:wght@400;500;600;700'],
  },
  {
    value: 'merriweather',
    label: 'Merriweather headings, Public Sans text',
    display: `'Merriweather', ${FALLBACK_SERIF}`,
    body: `'Public Sans', ${FALLBACK_SANS}`,
    load: ['Merriweather:wght@400;700', 'Public+Sans:wght@400;500;600;700'],
  },
  {
    value: 'lora',
    label: 'Lora headings, Inter text',
    display: `'Lora', ${FALLBACK_SERIF}`,
    body: `'Inter', ${FALLBACK_SANS}`,
    load: ['Lora:wght@400;600;700', 'Inter:wght@400;500;600;700'],
  },
];

export const BAR_TONES = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'brand', label: 'Brand color' },
  { value: 'dark', label: 'Dark' },
];

export const HERO_TONES = [
  { value: 'dark', label: 'Dark' },
  { value: 'brand', label: 'Brand color' },
  { value: 'light', label: 'Light' },
];

export const MAP_BASES = [
  { value: 'terrain', label: 'Terrain' },
  { value: 'plain', label: 'Plain' },
];

export const RECENT_COUNTS = [
  { value: '3', label: '3' },
  { value: '6', label: '6' },
];

export const SHARE_TEXT_MAX = 160;

/** The parts of Workspace settings › Public site, each a page of its own. */
export const PUBLIC_SITE_PARTS = [
  { key: 'home', label: 'Home page' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'theme', label: 'Theme' },
  { key: 'footer', label: 'Footer' },
  { key: 'details', label: 'Site details' },
] as const;
export type PublicSitePart = (typeof PUBLIC_SITE_PARTS)[number]['key'];
export const publicSitePartHref = (part: PublicSitePart): string => `/prototypes/workspace-settings/public-site/${part}`;

/** Read a dotted path. */
export const getAt = (config: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((at, key) => (at && typeof at === 'object' ? (at as Record<string, unknown>)[key] : undefined), config);

/** Write a dotted path in place. */
export const setAt = (config: unknown, path: string, value: unknown): void => {
  const keys = path.split('.');
  const last = keys.pop()!;
  const host = keys.reduce<Record<string, unknown>>((at, key) => (at[key] ??= {}) as Record<string, unknown>, config as Record<string, unknown>);
  host[last] = value;
};

/** Is the announcement up on this day (ISO)? */
export const announcementShows = (a: PublicSiteConfig['announcement'], todayIso: string): boolean =>
  a.on && a.text.trim() !== '' && (!a.from || a.from <= todayIso) && (!a.until || todayIso <= a.until);
