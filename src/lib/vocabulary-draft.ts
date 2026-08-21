// Browser-local vocabularies — the tenant's option lists authored IN THIS
// BROWSER, layered beside (never over) the seeded ones.
//
// WHY THIS STORE EXISTS. The measure model's rule is that vocabularies are
// shared and referenced, never copied per measure (docs/measure-model.md,
// rule 2) — which only means something if a vocabulary created while setting up
// one measure is OFFERED when setting up the next. A static build cannot mint
// tenant records, so the tenant-level store is localStorage: same trick, same
// honesty terms as measure drafts ("in this browser"; a colleague opening the
// site sees the seeds).
//
// ONE KEY FOR THE WHOLE SET, not a key per vocabulary — unlike measure drafts,
// which key per slug. A draft patches one record it names; vocabularies are a
// tenant-level LIST whose whole point is being read together (every picker
// shows all of them), so one array under one versioned key is the shape every
// read actually wants, and there is no per-item diffing to preserve.
//
// LOCAL IDS ARE PREFIXED (`local-`), so a locally authored vocabulary can
// never collide with a seed id shipped later, and so anything debugging a
// measure can see at a glance which side of the line a reference points to.

import { VOCABULARIES } from '../data/firma2-performance-measures';
import type { Vocabulary } from '../data/firma2-performance-measures';

const KEY_VERSION = 'v1';
const KEY = `firma2:vocabularies:${KEY_VERSION}`;

/** Shape-check one stored entry; a malformed one is dropped, not thrown on. */
const isVocabulary = (v: unknown): v is Vocabulary => {
  if (typeof v !== 'object' || v === null) return false;
  const c = v as Partial<Vocabulary>;
  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    (c.origin === 'house' || c.origin === 'imported') &&
    Array.isArray(c.options) &&
    c.options.every((o) => typeof o === 'string')
  );
};

/** The vocabularies authored in this browser. Empty everywhere else. */
export function readLocalVocabularies(): Vocabulary[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isVocabulary) : [];
  } catch {
    // Blocked storage or corrupt JSON — the seeds still work, so this
    // degrades to "no local lists" rather than failing anything.
    return [];
  }
}

/**
 * Add or replace one local vocabulary. Returns false when the browser blocks
 * storage — the caller decides whether that is worth a toast (the measure
 * editor's precedent: silent on success, loud once on failure).
 */
export function writeLocalVocabulary(vocabulary: Vocabulary): boolean {
  try {
    const rest = readLocalVocabularies().filter((v) => v.id !== vocabulary.id);
    window.localStorage.setItem(KEY, JSON.stringify([...rest, vocabulary]));
    return true;
  } catch {
    return false;
  }
}

/** Mint an id for a newly authored list. Deterministic given existing ids. */
export function nextLocalVocabularyId(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'vocabulary';
  const taken = new Set([...VOCABULARIES, ...readLocalVocabularies()].map((v) => v.id));
  let id = `local-${slug}`;
  let n = 2;
  while (taken.has(id)) id = `local-${slug}-${n++}`;
  return id;
}

/**
 * Every vocabulary a picker should offer: seeds first (stable order), then
 * local ones. THE read path for anything client-side; server renders use the
 * seeds alone, which is correct — a build cannot know one browser's lists.
 */
export function allVocabularies(): Vocabulary[] {
  return [...VOCABULARIES, ...readLocalVocabularies()];
}
