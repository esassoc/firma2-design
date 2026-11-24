// How one change reads in the review: the old value struck, the new one
// marked, and how far it moved (user, 2026-11-17, picked "Struck and marked"
// in /proto/review-sweep over "Public page / Record" side by side, a Before /
// After table, and a sentence: "it's hard to know what changed and from what
// to what").
//
//   amount     ~~$398,500~~ → $412,000   +$13,500 (+3.4%)
//   years      2023–~~2026~~ → 2023–2027   ends a year later
//   a word     ~~Planning & Design~~ → Implementation
//   text       … the words around it, with what went in marked and what
//              came out struck; long unchanged runs cut to "…"
//   new        New: 0.6 miles   (nothing on the public page to strike)
//   first      the value alone: on a first publish every field is new, and
//              the page already says "Not public yet"
//
// ONE RENDERER, TWO CALLERS. firma2-review-changes draws its seeded rows on the
// server and its imported rows in the browser; both call renderDiff(), so the
// two cannot drift. It returns HTML built only from escaped text.
//
// <del> and <ins> are the semantic marks for an edit, so a screen reader can
// announce them; the colour is a second signal, never the only one (the
// strike and the arrow carry it in grayscale).

export interface DiffInput {
  /** The published value. Absent when the change adds something. */
  from?: string;
  /** The record's value. Absent when there is none to show (a redrawn boundary). */
  to?: string;
  /** True on a project's first publish: every field is new. */
  first?: boolean;
  /** What "to" says when there is no value: "Boundary redrawn". */
  fallback?: string;
  /** One line, for a list row: prose says it changed instead of quoting it. */
  compact?: boolean;
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const parseUsd = (s: string): number | null => (/^\$[\d,]+$/.test(s.trim()) ? Number(s.replace(/[$,]/g, '')) : null);
const parseYears = (s: string): [number, number] | null => {
  const m = /^(\d{4})–(\d{4})$/.exec(s.trim());
  return m ? [Number(m[1]), Number(m[2])] : null;
};

const del = (s: string) => `<del class="firma2-review-diff__del">${esc(s)}</del>`;
const ins = (s: string) => `<ins class="firma2-review-diff__ins">${esc(s)}</ins>`;
const muted = (s: string) => `<span class="firma2-review-diff__by">${esc(s)}</span>`;
const ARROW = ' <span class="firma2-review-diff__arrow" aria-label="to">→</span> ';

type Seg = { text: string; op: 'same' | 'add' | 'del' | 'gap' };

/** Word-level diff (LCS); unchanged runs longer than a few lines keep a little context. */
const wordDiff = (a: string, b: string, context = 8): Seg[] => {
  const x = a.split(/(\s+)/).filter(Boolean);
  const y = b.split(/(\s+)/).filter(Boolean);
  // A description is a few hundred words at most; the table stays small.
  const dp = Array.from({ length: x.length + 1 }, () => new Array<number>(y.length + 1).fill(0));
  for (let i = x.length - 1; i >= 0; i--) for (let j = y.length - 1; j >= 0; j--) dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: Seg[] = [];
  const push = (text: string, op: Seg['op']) => {
    const last = out.at(-1);
    if (last && last.op === op) last.text += text;
    else out.push({ text, op });
  };
  let i = 0;
  let j = 0;
  while (i < x.length && j < y.length) {
    if (x[i] === y[j]) { push(x[i], 'same'); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) push(x[i++], 'del');
    else push(y[j++], 'add');
  }
  while (i < x.length) push(x[i++], 'del');
  while (j < y.length) push(y[j++], 'add');
  return out.flatMap((s, k): Seg[] => {
    if (s.op !== 'same') return [s];
    const words = s.text.split(/(\s+)/).filter(Boolean);
    if (words.length <= context * 4) return [s];
    const head = k === 0 ? [] : words.slice(0, context * 2);
    const tail = k === out.length - 1 ? [] : words.slice(-context * 2);
    return [
      ...(head.length ? [{ text: head.join(''), op: 'same' as const }] : []),
      { text: '… ', op: 'gap' as const },
      ...(tail.length ? [{ text: tail.join(''), op: 'same' as const }] : []),
    ];
  });
};

const years = (n: number) => (n === 1 ? 'a year' : `${n} years`);
const pct = (p: number) => `${p > 0 ? '+' : '−'}${Math.abs(p) < 10 ? Math.abs(p).toFixed(1) : Math.round(Math.abs(p))}%`;

/** The change as HTML: struck old → marked new, and how far it moved. */
export const renderDiff = ({ from, to, first = false, fallback = '', compact = false }: DiffInput): string => {
  if (to === undefined || to === '') return esc(fallback);
  if (first) return esc(compact && to.length > 60 ? `${to.slice(0, 57).trimEnd()}…` : to);
  if (from === undefined) return `${muted('New:')} ${ins(to)}`;

  const a = parseUsd(from);
  const b = parseUsd(to);
  if (a !== null && b !== null) {
    const d = b - a;
    const by = `${d > 0 ? '+' : '−'}${usd.format(Math.abs(d))}${a ? ` (${pct((d / a) * 100)})` : ''}`;
    return `${del(from)}${ARROW}${ins(to)} ${muted(by)}`;
  }

  const ya = parseYears(from);
  const yb = parseYears(to);
  if (ya && yb) {
    const side = (v: [number, number], o: [number, number], mark: (s: string) => string) =>
      `${v[0] === o[0] ? esc(String(v[0])) : mark(String(v[0]))}–${v[1] === o[1] ? esc(String(v[1])) : mark(String(v[1]))}`;
    const parts: string[] = [];
    const s = yb[0] - ya[0];
    const e = yb[1] - ya[1];
    if (s) parts.push(`starts ${years(Math.abs(s))} ${s > 0 ? 'later' : 'earlier'}`);
    if (e) parts.push(`ends ${years(Math.abs(e))} ${e > 0 ? 'later' : 'earlier'}`);
    return `${side(ya, yb, del)}${ARROW}${side(yb, ya, ins)}${parts.length ? ` ${muted(parts.join(' and '))}` : ''}`;
  }

  // Prose: the words that went in or out, where they sit.
  if (from.length > 60 || to.length > 60) {
    const segs = wordDiff(from, to);
    if (compact) return muted(segs.some((g) => g.op === 'del') ? 'Text rewritten' : 'Text added');
    return `<span class="firma2-review-diff__text">${segs
      .map((g) => (g.op === 'add' ? ins(g.text) : g.op === 'del' ? del(g.text) : g.op === 'gap' ? muted(g.text) : esc(g.text)))
      .join('')}</span>`;
  }

  return `${del(from)}${ARROW}${ins(to)}`;
};
