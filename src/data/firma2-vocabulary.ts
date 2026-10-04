// Vocabulary — the nouns a tenant may rename.
//
// WHERE THIS CAME FROM. ProjectFirma2 already lets a tenant rename its nouns
// (`AliasableEntities` + the `entityLabel` pipe); hackathon team 3 widened the
// registry to twelve and gave it a settings screen. Legacy deployments call
// the same record a Project, a Grant, an Effort or a Treatment, and a tenant's
// own word is one of the three things the mission said is worth keeping.
//
// WHAT IS RENAMEABLE IS DECIDED IN CODE, here, by whoever writes the strings —
// a tenant has no business adding to it. The machinery (user, role, tenant)
// stays out: renaming it makes documentation wrong without making anything
// better. Lookup VALUES stay out too — "Implementation" is a stage, not a noun.
//
// AIM THE SUBSTITUTION. The team's hardest-won rule: replacing a word
// everywhere it appears renames things nobody asked to rename. "Project
// Finder" is a feature, and a funding source called "Federal Habitat
// Partnership Program" is data. So substitution is OPT-IN per string: only
// text marked as a noun-bearing label is ever rewritten (see
// src/lib/vocabulary.ts for the markers), never a whole page.
//
// Canonical forms are spelled as this spoke writes them mid-sentence; the
// resolver carries the case of whatever it replaces.

export interface Noun {
  key: string;
  singular: string;
  plural: string;
}

export const NOUNS: Noun[] = [
  { key: 'project', singular: 'Project', plural: 'Projects' },
  { key: 'organization', singular: 'Organization', plural: 'Organizations' },
  { key: 'classification', singular: 'Classification', plural: 'Classifications' },
  { key: 'performance-measure', singular: 'Performance measure', plural: 'Performance measures' },
  { key: 'funding-source', singular: 'Funding source', plural: 'Funding sources' },
  { key: 'expenditure', singular: 'Expenditure', plural: 'Expenditures' },
  { key: 'milestone', singular: 'Milestone', plural: 'Milestones' },
  { key: 'work-area', singular: 'Work area', plural: 'Work areas' },
  { key: 'contact', singular: 'Contact', plural: 'Contacts' },
];

/** A tenant's renaming of one noun. Blank means "keep the application's word". */
export interface NounAlias {
  singular?: string;
  plural?: string;
}

export type Vocabulary = Record<string, NounAlias>;

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isAcronym = (w: string) => w.length > 1 && w === w.toUpperCase() && /[A-Z]/.test(w);

/**
 * Carry the case of the replaced text onto the alias: lowercase stays
 * lowercase, a capitalised label stays capitalised. Acronyms the tenant typed
 * ("BMP") are never lowercased.
 */
const matchCase = (match: string, alias: string): string => {
  const words = alias.split(' ');
  if (match === match.toLowerCase()) return words.map((w) => (isAcronym(w) ? w : w.toLowerCase())).join(' ');
  const first = alias.charAt(0).toUpperCase() + alias.slice(1);
  const matchWords = match.split(' ');
  const sentenceCase = matchWords.length > 1 && matchWords.slice(1).every((w) => w === w.toLowerCase());
  if (!sentenceCase) return first;
  return first
    .split(' ')
    .map((w, i) => (i === 0 || isAcronym(w) ? w : w.toLowerCase()))
    .join(' ');
};

/** The plural a tenant meant when they typed only the singular. */
export const suggestPlural = (singular: string): string => {
  const s = singular.trim();
  if (!s) return '';
  if (/[^aeiou]y$/i.test(s)) return s.slice(0, -1) + 'ies';
  if (/(s|x|z|ch|sh)$/i.test(s)) return s + 'es';
  return s + 's';
};

/** The effective singular and plural for a noun under a vocabulary. */
export const formsOf = (noun: Noun, vocabulary: Vocabulary): { singular: string; plural: string } => {
  const alias = vocabulary[noun.key] ?? {};
  const singular = alias.singular?.trim() || noun.singular;
  const plural = alias.plural?.trim() || (alias.singular?.trim() ? suggestPlural(alias.singular) : noun.plural);
  return { singular, plural };
};

/**
 * Rewrite every renamed noun in one label. Whole words, plural before
 * singular, case carried. Only ever called on text already known to be a
 * noun-bearing label — see the module header.
 */
export const resolveText = (text: string, vocabulary: Vocabulary): string => {
  let out = text;
  for (const noun of NOUNS) {
    const alias = vocabulary[noun.key];
    if (!alias?.singular?.trim() && !alias?.plural?.trim()) continue;
    const forms = formsOf(noun, vocabulary);
    const re = new RegExp(`\\b(${escapeRegex(noun.plural)}|${escapeRegex(noun.singular)})\\b`, 'gi');
    out = out.replace(re, (m) =>
      matchCase(m, m.toLowerCase() === noun.plural.toLowerCase() ? forms.plural : forms.singular),
    );
  }
  return out;
};
