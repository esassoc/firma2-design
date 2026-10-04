// Hugeicons — this spoke's icon set, standing in for the hub's icon-registry.
//
// Not a fork of the design system: nothing imports this file directly. The
// Vite plugin in astro.config.mjs redirects every import of @esa/ecology's
// ./icon-registry here, so esa-icon, esa-button and esa-sidebar-nav all render
// Hugeicons with zero component or hub edits. ICONS=lucide (npm run
// dev:lucide) skips the redirect and the hub's Lucide registry is used untouched.
//
// SPOKE CODE GOES THROUGH THE REGISTRY TOO. A glyph the hub lacks is added
// below under its Lucide name, and the spoke looks it up by that name — with
// its Lucide body only as the fallback for the ICONS=lucide build. Inline
// Lucide that skips the registry would stay Lucide here and mix two sets.
//
// Same exports and signatures as the hub module (ICON_PATHS, iconSvg). Keys stay
// the hub's Lucide names, so callers keep passing name="chevron-down"; only the
// glyph behind each name changes. Unmapped names fall through to Lucide.
//
// Glyphs: @hugeicons/core-free-icons (Stroke Rounded, MIT). Free set only — the
// Pro styles are licensed and this repo is public.
// NAMED IMPORTS, NEVER `import * as Huge`: this module loads on every page (it
// IS the icon registry), and a namespace import with lookups by string keeps
// all ~6,000 glyphs in the bundle — 6.4 MB, measured. Named imports let the
// build drop every glyph not mapped here. The whole set is only for searching
// (src/lib/hugeicon-markup.ts loadCatalog), loaded on demand.
import {
  Activity01Icon,
  Alert02Icon,
  AlertCircleIcon,
  Archive02Icon,
  Attachment01Icon,
  ArrowDown01Icon,
  ArrowDown02Icon,
  ArrowLeft01Icon,
  ArrowLeft02Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  ArrowRightDoubleIcon,
  ArrowUp01Icon,
  ArrowUp02Icon,
  Award01Icon,
  Building03Icon,
  Calendar03Icon,
  Cancel01Icon,
  CancelCircleIcon,
  ChartIncreaseIcon,
  CheckmarkCircle02Icon,
  ChefHatIcon,
  CircleDotIcon,
  CircleIcon,
  Copy01Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  Database01Icon,
  Delete01Icon,
  Delete02Icon,
  Download04Icon,
  DragDropVerticalIcon,
  File01Icon,
  FileAddIcon,
  FileTextIcon,
  FilterIcon,
  FloppyDiskIcon,
  Folder01Icon,
  FolderInputIcon,
  FullScreenIcon,
  Heading02Icon,
  Heading03Icon,
  HelpCircleIcon,
  HistoryIcon,
  Home01Icon,
  Image01Icon,
  InformationCircleIcon,
  InputTextIcon,
  LandPlotIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  Link01Icon,
  LinkSquare02Icon,
  Loading03Icon,
  LocateIcon,
  Location01Icon,
  Maximize01Icon,
  Menu01Icon,
  MoreHorizontalIcon,
  Note01Icon,
  Notification03Icon,
  PanelRightIcon,
  PauseCircleIcon,
  PencilEdit02Icon,
  PentagonIcon,
  PinIcon,
  PlusSignIcon,
  QuoteDownIcon,
  Restaurant01Icon,
  Search01Icon,
  Settings01Icon,
  Shield01Icon,
  SplineIcon,
  StarIcon,
  TextBoldIcon,
  TextItalicIcon,
  Tick02Icon,
  Tree06Icon,
  UndoIcon,
  Upload04Icon,
  UserCircleIcon,
  UserIcon,
  UserMultipleIcon,
  ViewIcon,
} from '@hugeicons/core-free-icons';
import { toMarkup } from './hugeicon-markup';
import type { IconNode } from './hugeicon-markup';
import { ICON_PATHS as LUCIDE_PATHS } from '../../node_modules/@esa/ecology/src/components/icon-registry';


/** Hub registry name (plus names the spoke looks up) → Hugeicons glyph. */
const MAP: Record<string, unknown> = {
  home: Home01Icon,
  settings: Settings01Icon,
  plus: PlusSignIcon,
  x: Cancel01Icon,
  check: Tick02Icon,
  'chevron-down': ArrowDown01Icon,
  'chevron-up': ArrowUp01Icon,
  'chevron-left': ArrowLeft01Icon,
  'chevron-right': ArrowRight01Icon,
  'chevrons-left': ArrowLeftDoubleIcon,
  'chevrons-right': ArrowRightDoubleIcon,
  search: Search01Icon,
  filter: FilterIcon,
  'arrow-left': ArrowLeft02Icon,
  'arrow-right': ArrowRight02Icon,
  'arrow-up': ArrowUp02Icon,
  'arrow-down': ArrowDown02Icon,
  'circle-alert': AlertCircleIcon,
  'circle-check': CheckmarkCircle02Icon,
  'circle-x': CancelCircleIcon,
  info: InformationCircleIcon,
  eye: ViewIcon,
  pencil: PencilEdit02Icon,
  'trash-2': Delete02Icon,
  trash: Delete01Icon,
  copy: Copy01Icon,
  download: Download04Icon,
  upload: Upload04Icon,
  'external-link': LinkSquare02Icon,
  calendar: Calendar03Icon,
  user: UserIcon,
  users: UserMultipleIcon,
  star: StarIcon,
  loader: Loading03Icon,
  menu: Menu01Icon,
  bell: Notification03Icon,
  'triangle-alert': Alert02Icon,
  save: FloppyDiskIcon,
  'circle-question-mark': HelpCircleIcon,
  'notepad-text': Note01Icon,
  'circle-user': UserCircleIcon,
  database: Database01Icon,
  activity: Activity01Icon,
  trees: Tree06Icon,
  'trending-up': ChartIncreaseIcon,
  'credit-card': CreditCardIcon,
  'file-text': FileTextIcon,
  file: File01Icon,
  'layout-dashboard': DashboardSquare01Icon,
  expand: Maximize01Icon,
  folder: Folder01Icon,
  history: HistoryIcon,
  'rotate-ccw': UndoIcon,
  'chef-hat': ChefHatIcon,
  utensils: Restaurant01Icon,
  'map-pin': Location01Icon,
  award: Award01Icon,
  archive: Archive02Icon,
  pin: PinIcon,
  // Not in the hub registry — spoke names, looked up registry-first.
  circle: CircleIcon,
  'circle-dot': CircleDotIcon,
  'circle-pause': PauseCircleIcon,
  'panel-right': PanelRightIcon,
  'grip-vertical': DragDropVerticalIcon,
  pentagon: PentagonIcon,
  spline: SplineIcon,
  locate: LocateIcon,
  'land-plot': LandPlotIcon,
  ellipsis: MoreHorizontalIcon,
  shield: Shield01Icon,
  // The app rail's Your organizations rows.
  'building-2': Building03Icon,
  // Rich text formatting — firma2-rich-text's selection toolbar. The hub's
  // Lucide registry has none of these, so ICONS=lucide shows them without a glyph.
  bold: TextBoldIcon,
  italic: TextItalicIcon,
  'heading-2': Heading02Icon,
  'heading-3': Heading03Icon,
  list: LeftToRightListBulletIcon,
  'list-ordered': LeftToRightListNumberIcon,
  link: Link01Icon,
  'text-quote': QuoteDownIcon,
  image: Image01Icon,
  paperclip: Attachment01Icon,
  // A PDF preview's Full screen (firma2-rich-text).
  maximize: FullScreenIcon,
  // The Pages rail's row menus (firma2-pages-nav): Add page, Rename and Move.
  'file-plus': FileAddIcon,
  'text-cursor-input': InputTextIcon,
  'folder-input': FolderInputIcon,
};

// Hugeicons ships React-style nodes ([tag, {strokeWidth, …, key}]); emit SVG markup.
export const ICON_PATHS: Record<string, string> = {
  ...LUCIDE_PATHS,
  ...Object.fromEntries(
    Object.entries(MAP).map(([name, node]) => [name, toMarkup(node as IconNode)]),
  ),
};

export function iconSvg(name: string, size = 18): string | null {
  const inner = ICON_PATHS[name];
  if (!inner) return null;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
