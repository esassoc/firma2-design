// The icon a classification or group wears, beside its name wherever the name
// leads (Q-235). A shortlist for the picker, and the sample's own choices.
// A record stores the Hugeicons export name AND the glyph's markup, so a page
// draws it without loading the whole set (same contract as a stage's icon:
// src/data/firma2-workspace-settings.ts, bcn-icon-picker).
import {
  CloudIcon,
  DropletIcon,
  FireIcon,
  FishIcon,
  HikingIcon,
  Leaf01Icon,
  MountainIcon,
  Plant01Icon,
  Recycle01Icon,
  Shield01Icon,
  Sun01Icon,
  Tree01Icon,
  WaterEnergyIcon,
} from '@hugeicons/core-free-icons';
import { toMarkup } from '../lib/hugeicon-markup';
import type { CatalogIcon, IconNode } from '../lib/hugeicon-markup';

const SHORTLIST: [unknown, string, string][] = [
  [FishIcon, 'FishIcon', 'Fish'],
  [DropletIcon, 'DropletIcon', 'Droplet'],
  [WaterEnergyIcon, 'WaterEnergyIcon', 'Water'],
  [Leaf01Icon, 'Leaf01Icon', 'Leaf'],
  [Plant01Icon, 'Plant01Icon', 'Plant'],
  [Tree01Icon, 'Tree01Icon', 'Tree'],
  [FireIcon, 'FireIcon', 'Fire'],
  [MountainIcon, 'MountainIcon', 'Mountain'],
  [CloudIcon, 'CloudIcon', 'Cloud'],
  [Sun01Icon, 'Sun01Icon', 'Sun'],
  [HikingIcon, 'HikingIcon', 'Hiking'],
  [Recycle01Icon, 'Recycle01Icon', 'Recycle'],
  [Shield01Icon, 'Shield01Icon', 'Shield'],
];

export const CLASSIFICATION_ICON_SUGGESTIONS: CatalogIcon[] = SHORTLIST.map(([node, name, label]) => ({
  name,
  label,
  paths: toMarkup(node as IconNode),
}));

const byName = (name: string): CatalogIcon | undefined => CLASSIFICATION_ICON_SUGGESTIONS.find((i) => i.name === name);

/** The sample's icons, by group slug or classification name. Invented. */
const SEEDED: Record<string, string> = {
  'plan-goal': 'MountainIcon',
  'practice-area': 'Recycle01Icon',
  'channels-and-fish-passage': 'FishIcon',
  'vegetation-and-wetlands': 'Plant01Icon',
  'forests-and-fuels': 'Tree01Icon',
  'runoff-and-groundwater': 'DropletIcon',
  'Salmon & steelhead recovery': 'FishIcon',
  'Riparian & wetland habitat': 'Leaf01Icon',
  'Water quality': 'DropletIcon',
  'Water supply reliability': 'WaterEnergyIcon',
  'Wildfire resilience': 'FireIcon',
  'Flood risk reduction': 'CloudIcon',
  'Public access & recreation': 'HikingIcon',
};

/** The seeded icon for a group (slug) or classification (name): export name and markup. */
export const seededIcon = (key: string): { icon: string; iconPaths: string } | undefined => {
  const hit = byName(SEEDED[key] ?? '');
  return hit ? { icon: hit.name, iconPaths: hit.paths } : undefined;
};
