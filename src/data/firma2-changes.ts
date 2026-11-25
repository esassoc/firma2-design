// A change — one row for one write to a project's record, whatever was changed
// and however it arrived (docs/data-model.md, section 5 and decision 3, user
// 2026-11-24).
//
// ONE SHAPE WHERE THERE WERE FOUR. Until then the record's seeded history was a
// free-text line (AuditEntry), a target or entry edit was a MeasureChange, an
// import kept its own ImportedChange, and the hackathon sandbox had a fourth.
// The history sheet, the publish review's net difference and an organization's
// Latest updates each read a different one. They read this now.
//
// EVERY CHANGE CARRIES ITS SOURCE (.scratch/project-updates/spec.md, decision
// 5): made by hand, read from a named document, or supplied by a named data
// source. A change read from a document keeps the words it was read from.
//
// THE SUMMARY IS THE SENTENCE THE HISTORY PRINTS. The structured parts beside
// it (subject, key, from, to) are what code reads; nothing parses the summary
// except `readSentence` below, which exists so the seeds can stay authored as
// the sentences a person would check them against.
//
// No imports: the seed data and the browser's log both build on this.

/** What part of the record a change touched. */
export type ChangeSubject =
  | 'project'
  | 'field'
  | 'custom-field'
  | 'measure-entry'
  | 'target'
  | 'funding'
  | 'contact'
  | 'work-area'
  | 'photo'
  | 'publish';

export type ChangeAction = 'set' | 'add' | 'remove';

export type ChangeSource =
  | { kind: 'hand' }
  | { kind: 'document'; name: string; quote?: string; passage?: string; page?: number }
  | { kind: 'data-source'; name: string };

export interface Change {
  /** Stable within the project. */
  id: string;
  subject: ChangeSubject;
  /**
   * Which one: a field's key ("estimatedTotalCost"), a funding source's name, a
   * work area's label, "<measure>:<period>" for an entry, a measure for a target.
   */
  key: string;
  action: ChangeAction;
  /** The value before, as a person reads it. Absent on an add, or when not recorded. */
  from?: string;
  /** The value after, as a person reads it. Absent on a remove. */
  to?: string;
  /** The sentence the history prints. */
  summary: string;
  /** Who made it. */
  by: string;
  /** When: an ISO day for a seeded change, a full ISO timestamp for one made in this browser. */
  at: string;
  source: ChangeSource;
  /** The id of the change this one takes back. */
  reverts?: string;
}

/** The structured parts of a change, without who, when and where from. */
export type ChangeFacts = Pick<Change, 'subject' | 'key' | 'action' | 'from' | 'to' | 'summary'>;

/** The sentence a publish leaves in the history. */
export const PUBLISHED_SUMMARY = 'Published to the public page';

/**
 * A seed's sentence as a change's facts. The seeds are authored as sentences
 * ("County changed from Placer to El Dorado") because that is what a person
 * checks them against; this is the one place a sentence is read. A sentence it
 * cannot read is a mistake in the seed and throws, naming it.
 */
export const readSentence = (sentence: string): ChangeFacts => {
  const set = (key: string, from?: string, to?: string): ChangeFacts => ({ subject: 'field', key, action: 'set', from, to, summary: sentence });
  let m: RegExpMatchArray | null;
  if (sentence === PUBLISHED_SUMMARY) return { subject: 'publish', key: 'publish', action: 'set', summary: sentence };
  if (sentence === 'Project created') return { subject: 'project', key: 'project', action: 'add', summary: sentence };
  if ((m = sentence.match(/^Estimated total cost changed from (-?\$[\d,]+) to (-?\$[\d,]+)$/))) return set('estimatedTotalCost', m[1], m[2]);
  if ((m = sentence.match(/^Timeline changed from (\d{4}–\d{4}) to (\d{4}–\d{4})$/))) return set('timeline', m[1], m[2]);
  if ((m = sentence.match(/^County changed from (.+) to (.+)$/))) return set('county', m[1], m[2]);
  if ((m = sentence.match(/^Stage set to (.+)$/))) return set('stage', undefined, m[1]);
  if (/^Description (edited|updated)$/.test(sentence)) return set('description');
  if ((m = sentence.match(/^Reported value filed: (.+), (\d{4})$/))) return { subject: 'measure-entry', key: `${m[1]}:${m[2]}`, action: 'add', summary: sentence };
  if ((m = sentence.match(/^Funding source added: (.+)$/))) return { subject: 'funding', key: m[1], action: 'add', to: m[1], summary: sentence };
  if ((m = sentence.match(/^Work area boundary revised: (.+)$/))) return { subject: 'work-area', key: m[1], action: 'set', summary: sentence };
  throw new Error(`Cannot read change sentence: ${sentence}`);
};

/** How a change's source reads beside it: nothing for a hand edit. */
export const sourceLabel = (source: ChangeSource): string =>
  source.kind === 'hand' ? '' : source.kind === 'document' ? `From ${source.name}` : `From ${source.name}`;
