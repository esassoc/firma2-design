// Menu icons — draws the glyph each esa-dropdown-menu item names in `icon`.
//
// The hub's menu already takes `icon` on its items, but renders it as a 6px
// bullet dot (its docblock: kept dependency-free). This fills that dot's span
// with the registry glyph of the same name and restyles the span from a dot to
// an icon box, through a sheet adopted into the menu's shadow root — the same
// adopted-sheet move the spoke uses on esa-sidebar-nav. The item markup, its
// keyboard model and its danger styling stay the hub's; a danger item's icon
// takes the item's red through currentColor.
//
// bcn-lego-checked: esa-dropdown-menu is the lego and is used unchanged; no
// esa- menu draws item glyphs (catalog walked). Beacon is not cloned here. Due
// upstream as a /request-lego: render `icon` through icon-registry in
// esa-dropdown-menu, and then this file goes.
//
// A name the registry does not have (the hub's Lucide set, in the
// ICONS=lucide build, lacks the spoke's additions) leaves no dot behind: the
// span is hidden and the label sits where it would with no icon at all.

import { iconSvg } from '@esa/ecology/icon-registry';

type Menu = HTMLElement & { items?: { icon?: string; divider?: boolean }[] };

const SHEET = `
  .esa-dropdown-menu__bullet[data-icon] {
    display: inline-flex;
    width: 18px;
    height: 18px;
    border-radius: 0;
    background: none;
    opacity: 1;
    color: var(--color-content-default-secondary, #646464);
  }
  .esa-dropdown-menu__item--danger .esa-dropdown-menu__bullet[data-icon] { color: inherit; }
  .esa-dropdown-menu__bullet[data-icon] svg { display: block; }
  .esa-dropdown-menu__bullet[data-icon=''] { display: none; }
`;

let sheet: CSSStyleSheet | undefined;
const decorated = new WeakSet<HTMLElement>();

/** Draws the menu's item icons now and on every open. Safe to call more than once. */
export function drawMenuIcons(menu: Menu): void {
  const root = menu.shadowRoot;
  if (!root || decorated.has(menu)) return;
  decorated.add(menu);
  sheet ??= (() => {
    const s = new CSSStyleSheet();
    s.replaceSync(SHEET);
    return s;
  })();
  root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];

  // The panel is rendered only while open, so each open is a fresh set of
  // spans; the observer fills them as they arrive. Buttons and non-divider
  // items line up one to one, in order.
  const fill = (): void => {
    const items = (menu.items ?? []).filter((i) => !i.divider);
    root.querySelectorAll<HTMLElement>('.esa-dropdown-menu__item').forEach((button, i) => {
      const bullet = button.querySelector<HTMLElement>('.esa-dropdown-menu__bullet');
      const name = items[i]?.icon;
      if (!bullet || !name || bullet.dataset.icon !== undefined) return;
      const svg = iconSvg(name, 18);
      bullet.dataset.icon = svg ? name : '';
      if (svg) bullet.innerHTML = svg;
    });
  };
  new MutationObserver(fill).observe(root, { childList: true, subtree: true });
  fill();
}
