// Hugeicons trial — a LOCAL, flag-gated stand-in for the hub's icon-registry.
//
// Not a fork of the design system: nothing imports this file directly. When the
// spoke runs with ICONS=hugeicons, the Vite plugin in astro.config.mjs redirects
// every import of @esa/ecology's ./icon-registry here, so esa-icon,
// esa-icon-button and esa-sidebar-nav all render Hugeicons with zero component
// or hub edits. Without the flag the hub's Lucide registry is used untouched.
//
// Same exports and signatures as the hub module (ICON_PATHS, iconSvg). Keys stay
// the hub's Lucide names, so callers keep passing name="chevron-down"; only the
// glyph behind each name changes. Unmapped names fall through to Lucide.
//
// Glyphs: @hugeicons/core-free-icons (Stroke Rounded, MIT). Free set only — the
// Pro styles are licensed and this repo is public.
import * as Huge from '@hugeicons/core-free-icons';
import { ICON_PATHS as LUCIDE_PATHS } from '../../node_modules/@esa/ecology/src/components/icon-registry';

type IconNode = ReadonlyArray<readonly [string, Record<string, string | number>]>;

/** Hub registry name (plus names the spoke passes via `paths`) → Hugeicons export. */
const MAP: Record<string, keyof typeof Huge> = {
  home: 'Home01Icon',
  settings: 'Settings01Icon',
  plus: 'PlusSignIcon',
  x: 'Cancel01Icon',
  check: 'Tick02Icon',
  'chevron-down': 'ArrowDown01Icon',
  'chevron-up': 'ArrowUp01Icon',
  'chevron-left': 'ArrowLeft01Icon',
  'chevron-right': 'ArrowRight01Icon',
  'chevrons-left': 'ArrowLeftDoubleIcon',
  'chevrons-right': 'ArrowRightDoubleIcon',
  search: 'Search01Icon',
  filter: 'FilterIcon',
  'arrow-left': 'ArrowLeft02Icon',
  'arrow-right': 'ArrowRight02Icon',
  'arrow-up': 'ArrowUp02Icon',
  'arrow-down': 'ArrowDown02Icon',
  'circle-alert': 'AlertCircleIcon',
  'circle-check': 'CheckmarkCircle02Icon',
  'circle-x': 'CancelCircleIcon',
  info: 'InformationCircleIcon',
  eye: 'ViewIcon',
  pencil: 'PencilEdit02Icon',
  'trash-2': 'Delete02Icon',
  trash: 'Delete01Icon',
  copy: 'Copy01Icon',
  download: 'Download04Icon',
  upload: 'Upload04Icon',
  'external-link': 'LinkSquare02Icon',
  calendar: 'Calendar03Icon',
  user: 'UserIcon',
  users: 'UserMultipleIcon',
  star: 'StarIcon',
  loader: 'Loading03Icon',
  menu: 'Menu01Icon',
  bell: 'Notification03Icon',
  'triangle-alert': 'Alert02Icon',
  save: 'FloppyDiskIcon',
  'circle-question-mark': 'HelpCircleIcon',
  'notepad-text': 'Note01Icon',
  'circle-user': 'UserCircleIcon',
  database: 'Database01Icon',
  activity: 'Activity01Icon',
  trees: 'Tree06Icon',
  'trending-up': 'ChartIncreaseIcon',
  'credit-card': 'CreditCardIcon',
  'file-text': 'FileTextIcon',
  file: 'File01Icon',
  'layout-dashboard': 'DashboardSquare01Icon',
  expand: 'Maximize01Icon',
  folder: 'Folder01Icon',
  history: 'HistoryIcon',
  'rotate-ccw': 'RotateLeft01Icon',
  'chef-hat': 'ChefHatIcon',
  utensils: 'Restaurant01Icon',
  'map-pin': 'Location01Icon',
  award: 'Award01Icon',
  archive: 'Archive02Icon',
  pin: 'PinIcon',
};

// Hugeicons ships React-style nodes ([tag, {strokeWidth, …, key}]); emit SVG markup.
const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
function toMarkup(node: IconNode): string {
  return node
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs)
        .filter(([k]) => k !== 'key')
        .map(([k, v]) => `${kebab(k)}="${v}"`)
        .join(' ');
      return `<${tag} ${a}/>`;
    })
    .join('');
}

// Each child carries its own stroke-width="1.5", which overrides the hub
// wrappers' stroke-width="2" — so Hugeicons render at their designed weight.
export const ICON_PATHS: Record<string, string> = {
  ...LUCIDE_PATHS,
  ...Object.fromEntries(
    Object.entries(MAP).map(([name, exp]) => [name, toMarkup(Huge[exp] as unknown as IconNode)]),
  ),
};

export function iconSvg(name: string, size = 18): string | null {
  const inner = ICON_PATHS[name];
  if (!inner) return null;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
