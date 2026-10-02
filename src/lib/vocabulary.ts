// Applying the tenant's vocabulary to the page — one resolver, opt-in markers.
//
// THE MARKERS. Substitution never scans a page; it rewrites only text that
// markup has declared to be a noun-bearing label:
//
//   data-aliasable          the element's own text
//   data-aliasable-title    the first heading inside (a card title, a page h1)
//   data-aliasable-labels   every field label inside (<dt>, editable-field labels)
//   data-aliasable-crumbs   the breadcrumb links whose labels it lists (JSON)
//   data-aliasable-attr     the named attributes ("label") — for a lego whose
//                           text lives in its shadow root
//
// and, for the one surface with no markup of its own, the sidebar nav: items
// flagged `aliasable` in src/data/firma2-nav.ts.
//
// ORIGINALS ARE KEPT. The first time a node is resolved its canonical text is
// remembered, so a second renaming — or clearing one — resolves from the
// application's word, never from the previous alias.
//
// Strings built in JavaScript (grid headers, the studio's sentences) call
// resolveText() themselves with readVocabulary(). They pick a change up on
// their next load; everything marked here changes live.

import { resolveText } from '../data/firma2-vocabulary';
import type { Vocabulary } from '../data/firma2-vocabulary';

export const VOCABULARY_KEY = 'firma2:vocabulary:v1';
export const VOCABULARY_CHANGE_EVENT = 'firma2:vocabulary-change';

export const readVocabulary = (): Vocabulary => {
  try {
    const parsed = JSON.parse(localStorage.getItem(VOCABULARY_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? (parsed as Vocabulary) : {};
  } catch {
    return {};
  }
};

export const writeVocabulary = (vocabulary: Vocabulary): boolean => {
  try {
    localStorage.setItem(VOCABULARY_KEY, JSON.stringify(vocabulary));
    document.dispatchEvent(new Event(VOCABULARY_CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
};

/** Resolve a JS-built string against the stored vocabulary. */
export const label = (text: string): string => resolveText(text, readVocabulary());

const originals = new WeakMap<Node, string>();

const resolveNode = (node: Node, vocabulary: Vocabulary) => {
  if (!originals.has(node)) originals.set(node, node.textContent ?? '');
  const next = resolveText(originals.get(node)!, vocabulary);
  if (node.textContent !== next) node.textContent = next;
};

/** Every text node under an element — so an icon or a badge beside the words survives. */
const textNodes = (el: Element): Text[] => {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const out: Text[] = [];
  while (walker.nextNode()) {
    const n = walker.currentNode as Text;
    if (n.textContent?.trim()) out.push(n);
  }
  return out;
};

type NavItem = { label: string; aliasable?: boolean; children?: NavItem[] };
type NavHost = HTMLElement & { items?: NavItem[] };
const navOriginals = new WeakMap<HTMLElement, NavItem[]>();

const resolveNav = (vocabulary: Vocabulary) => {
  document.querySelectorAll<NavHost>('esa-sidebar-nav').forEach((nav) => {
    const current = nav.items;
    if (!current?.length) return;
    if (!navOriginals.has(nav)) navOriginals.set(nav, current);
    const walk = (items: NavItem[]): NavItem[] =>
      items.map((it) => ({
        ...it,
        label: it.aliasable ? resolveText(it.label, vocabulary) : it.label,
        children: it.children ? walk(it.children) : undefined,
      }));
    nav.items = walk(navOriginals.get(nav)!);
  });
};

export const applyVocabulary = (vocabulary: Vocabulary = readVocabulary()): void => {
  document.querySelectorAll('[data-aliasable]').forEach((el) => textNodes(el).forEach((n) => resolveNode(n, vocabulary)));
  document.querySelectorAll('[data-aliasable-title]').forEach((el) => {
    const heading = el.querySelector('.esa-card__title, h1, h2, h3');
    if (heading) textNodes(heading).forEach((n) => resolveNode(n, vocabulary));
  });
  document.querySelectorAll('[data-aliasable-labels]').forEach((el) =>
    el.querySelectorAll('dt, .firma2-editable-field__label').forEach((label) =>
      textNodes(label).forEach((n) => resolveNode(n, vocabulary)),
    ),
  );
  document.querySelectorAll<HTMLElement>('[data-aliasable-crumbs]').forEach((el) => {
    const marked: string[] = JSON.parse(el.dataset.aliasableCrumbs ?? '[]');
    el.querySelectorAll('a').forEach((a) => {
      const canonical = originals.get(a) ?? a.textContent?.trim() ?? '';
      if (marked.includes(canonical)) {
        if (!originals.has(a)) originals.set(a, canonical);
        a.textContent = resolveText(canonical, vocabulary);
      }
    });
  });
  document.querySelectorAll<HTMLElement>('[data-aliasable-attr]').forEach((el) => {
    (el.dataset.aliasableAttr ?? '').split(',').map((a) => a.trim()).filter(Boolean).forEach((attr) => {
      const key = `canonical${attr.charAt(0).toUpperCase()}${attr.slice(1)}`;
      if (el.dataset[key] === undefined) el.dataset[key] = el.getAttribute(attr) ?? '';
      el.setAttribute(attr, resolveText(el.dataset[key]!, vocabulary));
    });
  });
  resolveNav(vocabulary);
};

/**
 * Boot once per document: apply now, again once the shell has handed the nav
 * its items, and whenever the vocabulary changes — here (the settings screen)
 * or in another window (storage event).
 */
export const bootVocabulary = (): void => {
  applyVocabulary();
  // The shell hands the nav its items from its own island script, whose
  // timing this module does not control — so wait for them, briefly.
  customElements.whenDefined('esa-sidebar-nav').then(() => {
    let tries = 0;
    const waitForItems = () => {
      const nav = document.querySelector<NavHost>('esa-sidebar-nav');
      if (nav?.items?.length) applyVocabulary();
      else if (tries++ < 60) requestAnimationFrame(waitForItems);
    };
    waitForItems();
  });
  document.addEventListener(VOCABULARY_CHANGE_EVENT, () => applyVocabulary());
  window.addEventListener('storage', (event) => {
    if (event.key === VOCABULARY_KEY) applyVocabulary();
  });
};
