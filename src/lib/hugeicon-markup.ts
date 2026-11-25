// Hugeicons glyph data → the inner-SVG markup the kit's icon slots take (the
// `paths` convention of esa-icon and esa-button-toggle: children only, no
// <svg> wrapper). Shared by the registry stand-in (hugeicons-registry.ts) and
// anything that offers the whole set (bcn-icon-picker).

export type IconNode = ReadonlyArray<readonly [string, Record<string, string | number>]>;

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

export function toMarkup(node: IconNode): string {
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

/** "Progress03Icon" → "Progress 03": the export name, readable. */
export const iconLabel = (name: string): string =>
  name
    .replace(/Icon$/, '')
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    .replace(/([0-9])([A-Z])/g, '$1 $2');

export interface CatalogIcon {
  /** The Hugeicons export name, e.g. "Progress03Icon" — what a choice stores. */
  name: string;
  label: string;
  paths: string;
}

let catalog: Promise<CatalogIcon[]> | null = null;

/**
 * The whole free set, once per page and only when asked for: ~6,000 glyphs,
 * ~1.4 MB gzipped, so it is a dynamic import a picker triggers on first
 * search, never part of a page's own bundle. The package exports each glyph
 * under several aliases (`Activity`, `ActivityIcon`, `ActivityFreeIcons`);
 * the `…Icon` names are kept, one per glyph.
 */
export function loadCatalog(): Promise<CatalogIcon[]> {
  catalog ??= import('@hugeicons/core-free-icons').then((Huge) => {
    const seen = new Set<unknown>();
    const icons: CatalogIcon[] = [];
    for (const [name, node] of Object.entries(Huge)) {
      if (!name.endsWith('Icon') || seen.has(node)) continue;
      seen.add(node);
      icons.push({ name, label: iconLabel(name), paths: toMarkup(node as unknown as IconNode) });
    }
    return icons.sort((a, b) => a.label.localeCompare(b.label));
  });
  return catalog;
}
