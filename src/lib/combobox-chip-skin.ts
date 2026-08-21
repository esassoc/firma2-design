/**
 * esa-combobox's chips, re-skinned to this spoke's quiet chip.
 *
 * WHY THIS MODULE EXISTS. The lego's chips ship green-tinted, fully rounded and
 * one type rung larger than esa-pill. That is a defensible default and it is not
 * this product's chip: a classification is VOCABULARY, not a state, and the one
 * coloured pill on a record screen is the project's stage in the page header —
 * it should stay the only one.
 *
 * IT WAS WRITTEN TWICE BEFORE IT WAS WRITTEN ONCE. The recipe started inside
 * firma2-editable-field, where the project detail page edits its classifications
 * set, and the measure setup page then grew its own classifications combobox
 * with no skin at all — so the SAME vocabulary rendered as a neutral chip on one
 * screen and a green one on the other. One concept, two skins, on the only two
 * screens that show it. This module is the single copy; both callers adopt it.
 *
 * TOKENS, NOT LITERALS, all the way down. Custom properties inherit into a
 * shadow root, so the chip and the esa-pill it imitates resolve the same values
 * and cannot drift apart in a retheme.
 *
 * TEMPORARY, AND IT BELONGS UPSTREAM. This is a spoke reaching into a hub
 * component's shadow root — deliberate and documented, but a
 * `--combobox-chip-*` hook (or a `chip-variant` prop) on esa-combobox would
 * retire the whole file. Filed as a /request-lego; delete this the day one
 * lands.
 */

/**
 * The chip ITSELF: fill, border, corner, type, and the × that a display chip
 * does not have. This is the part that must be identical everywhere a set is
 * edited, because it is what a reader recognises as "a member of a vocabulary".
 *
 * The × is sized in EM so it can never out-grow the label's line — chip and
 * pill both resolve to padding + 1em + border at every width of the type clamp.
 */
export const COMBOBOX_CHIP_RECIPE = `
  .chip {
    gap: var(--spacing-100, 0.25rem);
    padding: var(--spacing-150, 0.375rem) var(--spacing-100, 0.25rem)
      var(--spacing-150, 0.375rem) var(--spacing-200, 0.5rem);
    background: var(--color-background-elevation-sunken, #f0f0f0);
    color: var(--color-content-default, #202020);
    border: var(--border-width-default, 1px) solid var(--color-border-default-subtle, #d9d9d9);
    border-radius: var(--radius-chip, var(--radius-sm, 0.25rem));
    box-sizing: border-box;
    font-family: var(--typography-microcopy-sm-font-family, inherit);
    font-size: var(--typography-microcopy-sm-font-size, 0.875rem);
    font-weight: var(--typography-microcopy-sm-font-weight, 400);
    line-height: var(--typography-microcopy-sm-line-height, 1);
    letter-spacing: var(--typography-microcopy-sm-letter-spacing, normal);
  }
  .chip__remove {
    width: 1em;
    height: 1em;
    color: var(--color-content-default-secondary, #646464);
  }
  .chip__remove svg {
    width: 0.85em;
    height: 0.85em;
  }
`;

/**
 * Where the chips SIT is the caller's business, not this module's, and the two
 * callers genuinely want different answers:
 *
 *   - firma2-editable-field stacks them one per line and insets them to land on
 *     the display's own text x and y, because that row swaps between a display
 *     and an editor and nothing may move in the swap.
 *   - a plain form field (the measure setup band) has no display state to
 *     mirror, so its chips take the lego's own arrangement.
 *
 * Passing geometry in rather than baking one of those in is what stops the
 * shared recipe from quietly encoding one caller's layout as everyone's.
 */
export function skinComboboxChips(el: Element, geometryCss = ''): void {
  const root = el.shadowRoot as (ShadowRoot & { _f2ChipSkinned?: boolean }) | null;
  if (!root || root._f2ChipSkinned) return;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`${COMBOBOX_CHIP_RECIPE}\n${geometryCss}`);
  root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  root._f2ChipSkinned = true;
}
