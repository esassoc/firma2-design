#!/usr/bin/env node
// report-reader — reads a real document against a project's measures, with
// Claude, and returns the reading the "Import a report" sheet reviews
// (src/components/projects/firma2-project-report-import.astro).
//
//   node scripts/report-reader.mjs                      serve on localhost:4399
//   node scripts/report-reader.mjs read <file> --target <target.json> [--out <reading.json>]
//
// LOCAL ONLY. The deployed site is static and public and never calls this:
// the sheet looks for the reader only when the page itself is on localhost,
// and falls back to its scripted fixture when nothing answers. Nothing is
// written to disk unless --out says where. Readings of client documents
// belong in docs/private/ (gitignored), never in src/.
//
// WHO DOES WHAT — the split the product needs, not only this script:
//   - CLAUDE READS AND MAPS. It finds the lines that answer a measure, quotes
//     them, copies the quantity and unit AS WRITTEN, and says whether the
//     document counts the same thing the measure asks for.
//   - CODE DOES THE ARITHMETIC. Unit conversion, adding lines, and whether two
//     units can be converted at all are worked out here (convert()). A length
//     can never become a count because the model felt confident.
//   - THE SHEET DECIDES AGAINST THE RECORD. "Already on file" and the
//     difference a to-date total leaves are computed in the browser from what
//     the record holds.
//   - A PERSON COMMITS. Nothing here writes to a record.
//
// PROTOTYPE TRANSPORT. Requests go through this machine's Claude Code login
// (`claude -p`, no tools, structured output). A product backend would send
// the same system prompt, schema and document block to the Messages API with
// its own key; only ask() changes.

import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { basename, extname } from 'node:path';
import { inflateRawSync } from 'node:zlib';

const PORT = Number(process.env.REPORT_READER_PORT ?? 4399);
const CLAUDE = process.env.CLAUDE_BIN ?? 'claude';
const MODEL = process.env.REPORT_READER_MODEL ?? 'opus';
const TIMEOUT_MS = 240_000;

// ---------------------------------------------------------------------------
// The prompt
// ---------------------------------------------------------------------------
const SYSTEM = `You read a document that a restoration project's team already wrote for someone else: a funder's completion report, a crew log, a paragraph from a grant report. The same team is then expected to retype it into their project tracker. You are sparing them the retyping by finding what the document says that answers the tracker's questions for ONE project.

A person reviews every row you propose before anything is saved, and the figures end up in reports to funders. So a row you leave out costs little, and a wrong row that looks right costs a lot. When you are unsure, say so on the row instead of smoothing it over.

The tracker asks a fixed list of performance measures, each with a unit. You are given that list, the reporting periods the project has, and a few record fields. For each thing in the document that answers a measure, return one proposal.

How to fill a proposal:

- measure: the measure's name exactly as given. Never propose a measure that is not in the list.
- sourceQuantity and sourceUnit: the number and the unit exactly as the document writes them. Do not convert units and do not add lines together. The tracker does that arithmetic itself, so that it can be checked.
- addends: when a measure is answered by several separate lines that should be added (two planting areas on different ground), list each line's number here and set sourceQuantity to the first one. Leave it out otherwise.
- status:
  - "match" when the document counts the same kind of thing the measure asks for. The unit may differ within one kind (feet where the measure wants miles); that is still a match.
  - "decide" when the document supports more than one reasonable reading: two lines that may be the same ground counted twice, a year that is unclear, a line that only partly fits. Give your best reading as the quantity and state the other reading in note.
  - "no_match" when the document counts a different kind of thing than the measure asks for, such as a number of structures where the measure asks for a length, or events where it asks for hours. Still report the line, because the person needs to see it.
- suggestion: only on a no_match row, and only when the document itself contains the numbers needed to work out the measure. Give the amount in the measure's unit and a basis that shows the arithmetic and where each number came from. If the document does not contain those numbers, leave suggestion out. Never estimate from general knowledge.
- toDate: true when the document states the figure as a running total since the project or grant began, false when it is for one period.
- year: the reporting period the work belongs to, taken from dates in the document and chosen from the periods given. If the document does not say, use the latest period, say so in note, and lower confidence.
- answers: a measure may have follow-up questions with fixed options. Answer one only when the document states it, using an option exactly as given.
- quote: the words from the document, verbatim and short. where: the page and the table or section.
- note: one or two plain sentences, only when the person needs them to judge the row.
- confidence: High when the line is unambiguous, Medium when you inferred something, Low when you are guessing.

Watch for the same ground or the same work appearing on more than one line. A report may list tree planting and shrub planting at the same acreage and also give a smaller total for the whole treatment; those lines overlap, and the row is a "decide".

fields: the record fields you may propose are listed with their format. Propose one only when the document states it.

notAsked: quantities the document reports that no measure asks for, each as a short phrase with its unit. This list tells the program lead what they are not collecting. Keep it to the notable ones.

skipped: anything you deliberately did not read as data, with the reason in a few words. Money is out of scope here: mention a budget or expenditure table once in skipped.

project: the project's name as the document writes it. The tracker compares it with the project you were given and warns the person itself, so if the document is about a different project, read it the same way and do not repeat the mismatch in each note.`;

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['project', 'proposals', 'fields', 'notAsked', 'skipped'],
  properties: {
    project: { type: 'string' },
    proposals: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['measure', 'status', 'sourceQuantity', 'sourceUnit', 'toDate', 'year', 'quote', 'where', 'confidence'],
        properties: {
          measure: { type: 'string' },
          status: { type: 'string', enum: ['match', 'decide', 'no_match'] },
          sourceQuantity: { type: 'number' },
          sourceUnit: { type: 'string' },
          addends: { type: 'array', items: { type: 'number' } },
          toDate: { type: 'boolean' },
          year: { type: 'integer' },
          answers: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['question', 'option'],
              properties: { question: { type: 'string' }, option: { type: 'string' } },
            },
          },
          quote: { type: 'string' },
          where: { type: 'string' },
          note: { type: 'string' },
          suggestion: {
            type: 'object',
            additionalProperties: false,
            required: ['amount', 'basis'],
            properties: { amount: { type: 'number' }, basis: { type: 'string' } },
          },
          confidence: { type: 'string', enum: ['High', 'Medium', 'Low'] },
        },
      },
    },
    fields: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['key', 'value', 'quote', 'where', 'confidence'],
        properties: {
          key: { type: 'string' },
          value: { type: 'string' },
          quote: { type: 'string' },
          where: { type: 'string' },
          confidence: { type: 'string', enum: ['High', 'Medium', 'Low'] },
        },
      },
    },
    notAsked: { type: 'array', items: { type: 'string' } },
    skipped: { type: 'array', items: { type: 'string' } },
  },
};

// ---------------------------------------------------------------------------
// Units — the arithmetic the model is told not to do
// ---------------------------------------------------------------------------
const LENGTH = { ft: 0.3048, mi: 1609.344, m: 1, km: 1000, yd: 0.9144 };
const AREA = { ac: 4046.8564224, ha: 10000, sqft: 0.09290304, sqm: 1, sqmi: 2589988.110336 };

/** A unit as people write it, to a key in LENGTH or AREA, or null. */
const unitKey = (written) => {
  const u = String(written ?? '')
    .toLowerCase()
    .replace(/[().]/g, '')
    .replace(/\b(of|stream|river|channel|linear|lineal|bank)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (/^(sq ?ft|sf|square f(oo|ee)t|ft2|ft²)$/.test(u)) return 'sqft';
  if (/^(sq ?m|square met(er|re)s?|m2|m²)$/.test(u)) return 'sqm';
  if (/^(sq ?mi|square miles?)$/.test(u)) return 'sqmi';
  if (/^(ft|foot|feet|lf)$/.test(u)) return 'ft';
  if (/^(mi|mile|miles)$/.test(u)) return 'mi';
  if (/^(m|meter|meters|metre|metres)$/.test(u)) return 'm';
  if (/^(km|kilometer|kilometers|kilometre|kilometres)$/.test(u)) return 'km';
  if (/^(yd|yard|yards)$/.test(u)) return 'yd';
  if (/^(ac|acre|acres)$/.test(u)) return 'ac';
  if (/^(ha|hectare|hectares)$/.test(u)) return 'ha';
  return null;
};

const plain = (written) =>
  String(written ?? '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/s$/, '')
    .replace(/^hr$/, 'hour');
const tidy = (n) => (Math.abs(n) > 0 && Math.abs(n) < 0.01 ? Number(n.toPrecision(2)) : Math.round(n * 100) / 100);
const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

/**
 * A quantity in the document's unit, in the measure's unit.
 *   same          the units are one unit
 *   converted     same dimension, converted here
 *   incompatible  both known, different dimensions: this can never be filed
 *   unknown       at least one unit is not a length or an area
 */
export const convert = (quantity, fromWritten, toWritten) => {
  const from = unitKey(fromWritten);
  const to = unitKey(toWritten);
  if (from && to) {
    if (from === to) return { kind: 'same', amount: tidy(quantity) };
    const table = from in LENGTH && to in LENGTH ? LENGTH : from in AREA && to in AREA ? AREA : null;
    if (!table) return { kind: 'incompatible' };
    const amount = tidy((quantity * table[from]) / table[to]);
    return { kind: 'converted', amount, text: `${fmt.format(quantity)} ${fromWritten} = ${fmt.format(amount)} ${toWritten}` };
  }
  if (plain(fromWritten) === plain(toWritten)) return { kind: 'same', amount: tidy(quantity) };
  return { kind: from || to ? 'incompatible' : 'unknown', amount: tidy(quantity) };
};

// ---------------------------------------------------------------------------
// Documents — a PDF goes to the model whole; office files are unpacked to text
// ---------------------------------------------------------------------------
/** The files inside a zip (xlsx and docx are zips), by name. */
const unzip = (buffer) => {
  const files = new Map();
  let end = buffer.length - 22;
  while (end >= 0 && buffer.readUInt32LE(end) !== 0x06054b50) end -= 1;
  if (end < 0) throw new Error('not a zip file');
  let at = buffer.readUInt32LE(end + 16);
  for (let i = 0; i < buffer.readUInt16LE(end + 10); i += 1) {
    if (buffer.readUInt32LE(at) !== 0x02014b50) break;
    const method = buffer.readUInt16LE(at + 10);
    const size = buffer.readUInt32LE(at + 20);
    const nameLength = buffer.readUInt16LE(at + 28);
    const extra = buffer.readUInt16LE(at + 30);
    const comment = buffer.readUInt16LE(at + 32);
    const local = buffer.readUInt32LE(at + 42);
    const name = buffer.toString('utf8', at + 46, at + 46 + nameLength);
    const start = local + 30 + buffer.readUInt16LE(local + 26) + buffer.readUInt16LE(local + 28);
    const raw = buffer.subarray(start, start + size);
    files.set(name, () => (method === 8 ? inflateRawSync(raw) : raw).toString('utf8'));
    at += 46 + nameLength + extra + comment;
  }
  return files;
};

const unescape = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

const xlsxText = (buffer) => {
  const files = unzip(buffer);
  const strings = [];
  const shared = files.get('xl/sharedStrings.xml')?.() ?? '';
  for (const [, si] of shared.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
    strings.push(unescape([...si.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join('')));
  }
  const names = [...(files.get('xl/workbook.xml')?.() ?? '').matchAll(/<sheet [^>]*name="([^"]+)"/g)].map((m) => unescape(m[1]));
  const sheets = [...files.keys()].filter((n) => /^xl\/worksheets\/sheet\d+\.xml$/.test(n)).sort();
  return sheets
    .map((sheet, index) => {
      const rows = [];
      for (const [, attrs, row] of files.get(sheet)().matchAll(/<row([^>]*)>([\s\S]*?)<\/row>/g)) {
        const number = attrs.match(/ r="(\d+)"/)?.[1] ?? String(rows.length + 1);
        const cells = [];
        for (const [, column, cellAttrs, body] of row.matchAll(/<c r="([A-Z]+)\d+"([^>]*)>([\s\S]*?)<\/c>/g)) {
          const v = body.match(/<v>([\s\S]*?)<\/v>/)?.[1];
          const t = body.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1];
          const value = /t="s"/.test(cellAttrs) && v !== undefined ? strings[Number(v)] : (v ?? (t ? unescape(t) : undefined));
          if (value !== undefined && String(value).trim() !== '') cells.push(`${column}: ${String(value).trim()}`);
        }
        if (cells.length) rows.push(`Row ${number} | ${cells.join(' | ')}`);
      }
      return `Sheet "${names[index] ?? index + 1}"\n${rows.join('\n')}`;
    })
    .join('\n\n');
};

const docxText = (buffer) => {
  const xml = unzip(buffer).get('word/document.xml')?.() ?? '';
  return [...xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)]
    .map(([p]) => unescape([...p.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((m) => m[1]).join('')))
    .filter((line) => line.trim() !== '')
    .join('\n');
};

/** The content blocks that carry the document to the model. */
const documentBlocks = ({ name, bytes, text }) => {
  if (text !== undefined) return [{ type: 'text', text: `<document name="${name ?? 'pasted text'}">\n${text}\n</document>` }];
  const kind = extname(name ?? '').toLowerCase();
  if (kind === '.pdf') {
    return [{ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: bytes.toString('base64') } }];
  }
  const body =
    kind === '.xlsx' ? xlsxText(bytes) : kind === '.docx' ? docxText(bytes) : kind === '.csv' || kind === '.txt' ? bytes.toString('utf8') : null;
  if (body === null) throw new Error(`${kind || 'This kind of'} file can't be read. Use PDF, Word (.docx), Excel (.xlsx), CSV or text.`);
  return [{ type: 'text', text: `<document name="${name}">\n${body}\n</document>` }];
};

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------
/** One request, no tools, structured output. Resolves with the parsed object. */
const ask = (content) =>
  new Promise((resolve, reject) => {
    const child = spawn(
      CLAUDE,
      [
        '-p',
        '--input-format', 'stream-json',
        '--output-format', 'stream-json',
        '--verbose',
        '--model', MODEL,
        '--tools', '',
        '--strict-mcp-config',
        '--no-session-persistence',
        '--setting-sources', '',
        '--system-prompt', SYSTEM,
        '--json-schema', JSON.stringify(SCHEMA),
      ],
      // Away from the repo, so no project instructions ride along.
      { cwd: tmpdir(), stdio: ['pipe', 'pipe', 'pipe'] },
    );
    let out = '';
    let err = '';
    const timer = setTimeout(() => child.kill(), TIMEOUT_MS);
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('error', (e) => reject(new Error(`Could not start ${CLAUDE}: ${e.message}`)));
    child.on('close', () => {
      clearTimeout(timer);
      const result = out
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .find((event) => event?.type === 'result');
      if (!result) return reject(new Error(`No answer from Claude. ${err.trim().slice(0, 300)}`));
      if (result.is_error || !result.structured_output) {
        return reject(new Error(`Claude could not read it: ${String(result.result ?? result.subtype).slice(0, 300)}`));
      }
      resolve({
        output: result.structured_output,
        meta: { model: Object.keys(result.modelUsage ?? {})[0] ?? MODEL, ms: result.duration_ms, costUsd: result.total_cost_usd },
      });
    });
    child.stdin.write(`${JSON.stringify({ type: 'user', message: { role: 'user', content } })}\n`);
    child.stdin.end();
  });

// ---------------------------------------------------------------------------
// Reading
// ---------------------------------------------------------------------------
const same = (a, b) => plain(a) === plain(b);
const cite = (where, quote) => `${String(where).replace(/^./, (c) => c.toUpperCase())} — “${String(quote).replace(/^[“"]|[”"]$/g, '')}”`;

/**
 * target: {
 *   project:  string,
 *   periods:  number[],                       reporting years an entry can land in
 *   measures: { name, unit, questions?: { name, options: string[] }[] }[],
 *   fields?:  { key, label, format, value }[]  record fields a document may set
 * }
 * Resolves with { reading, project, meta }; `reading` is the sheet's ImportReading.
 */
export const readReport = async ({ name, bytes, text, target }) => {
  const brief = {
    project: target.project,
    reportingPeriods: target.periods,
    measures: target.measures.map((m) => ({ name: m.name, unit: m.unit, questions: m.questions ?? [] })),
    recordFields: (target.fields ?? []).map(({ key, label, format }) => ({ key, label, format })),
  };
  const { output, meta } = await ask([
    ...documentBlocks({ name, bytes, text }),
    { type: 'text', text: `Read the document above for this project.\n\n<tracker>\n${JSON.stringify(brief, null, 1)}\n</tracker>` },
  ]);

  const notAsked = [...output.notAsked];
  const latest = Math.max(...target.periods);
  const proposals = [];
  output.proposals.forEach((p, index) => {
    const measure = target.measures.find((m) => m.name === p.measure) ?? target.measures.find((m) => same(m.name, p.measure));
    // A measure the tracker does not ask is not a row, whatever it was called.
    if (!measure) return notAsked.push(`${fmt.format(p.sourceQuantity)} ${p.sourceUnit}: ${p.quote}`);

    const addends = p.addends?.length > 1 ? p.addends : null;
    const quantity = addends ? addends.reduce((sum, n) => sum + n, 0) : p.sourceQuantity;
    const converted = convert(quantity, p.sourceUnit, measure.unit);
    const notes = p.note ? [p.note] : [];
    let status = p.status;
    // Two known units of different dimensions cannot be the same quantity.
    if (converted.kind === 'incompatible' && status !== 'no_match') {
      status = 'no_match';
      notes.push(`The report gives ${p.sourceUnit}. This measure asks for ${measure.unit}.`);
    }
    // An unfamiliar unit is the person's call, not a silent match.
    if (converted.kind === 'unknown' && status === 'match') {
      status = 'decide';
      notes.push(`The report says “${p.sourceUnit}”. This measure counts ${measure.unit}.`);
    }
    // A guess never arrives ticked.
    if (p.confidence === 'Low' && status === 'match') status = 'decide';
    let year = p.year;
    if (!target.periods.includes(year)) {
      notes.push(`${year} is not a reporting period on this project, so this is under ${latest}.`);
      year = latest;
      if (status === 'match') status = 'decide';
    }
    const sum = addends ? `${addends.map((n) => fmt.format(n)).join(' + ')} = ${fmt.format(quantity)} ${p.sourceUnit}` : '';
    const arithmetic = [sum, converted.kind === 'converted' ? converted.text : ''].filter(Boolean).join('; ');
    const amount = status === 'no_match' ? 0 : (converted.amount ?? 0);
    const answers = {};
    (p.answers ?? []).forEach(({ question, option }) => {
      const asked = (measure.questions ?? []).find((q) => q.name === question);
      if (asked?.options.includes(option)) answers[question] = option;
    });

    proposals.push({
      id: `read-${index + 1}`,
      measure: measure.name,
      year,
      amount: p.toDate && status !== 'no_match' ? 0 : amount,
      answers,
      quote: cite(p.where, p.quote),
      ...(arithmetic ? { conversion: arithmetic } : {}),
      ...(notes.length ? { note: notes.join(' ') } : {}),
      confidence: p.confidence,
      ...(status === 'decide' ? { decide: true } : {}),
      ...(status === 'no_match'
        ? { noMatch: p.suggestion ? { suggestion: { amount: tidy(p.suggestion.amount), basis: p.suggestion.basis.replace(/\.$/, '') } } : {} }
        : {}),
      ...(p.toDate && status !== 'no_match' ? { cumulative: amount } : {}),
    });
  });

  // Record fields: only the keys offered, only in the stated format.
  output.fields.forEach((f, index) => {
    const field = (target.fields ?? []).find((t) => t.key === f.key);
    if (!field) return;
    if (field.key === 'timeline' && !/^(19|20)\d{2},(19|20)\d{2}$/.test(f.value)) return;
    proposals.push({
      id: `read-field-${index + 1}`,
      measure: '',
      year: 0,
      amount: 0,
      answers: {},
      field: { key: field.key, label: field.label, raw: f.value, display: f.value.split(',').join('–') },
      quote: cite(f.where, f.quote),
      confidence: f.confidence,
      ...(f.confidence === 'Low' ? { decide: true } : {}),
    });
  });

  // A report about another project never arrives ticked, whatever it says.
  const matches = !output.project || same(output.project, target.project);
  if (!matches) proposals.forEach((p) => !p.noMatch && (p.decide = true));

  // Ready rows first, then the ones waiting on a person.
  const rank = (p) => (p.noMatch ? 2 : p.decide ? 1 : 0);
  proposals.sort((a, b) => rank(a) - rank(b));

  return {
    reading: { proposals, notAsked, skipped: output.skipped.map((line) => (/[.!?]$/.test(line.trim()) ? line.trim() : `${line.trim()}.`)) },
    project: { inReport: output.project, matches },
    meta,
  };
};

// ---------------------------------------------------------------------------
// CLI and server
// ---------------------------------------------------------------------------
const main = async () => {
  const args = process.argv.slice(2);
  if (args[0] === 'read') {
    const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
    const file = args[1];
    const target = JSON.parse(readFileSync(flag('--target'), 'utf8'));
    const result = await readReport({ name: basename(file), bytes: readFileSync(file), target });
    const json = JSON.stringify(result, null, 1);
    if (flag('--out')) writeFileSync(flag('--out'), json);
    else console.log(json);
    console.error(`${basename(file)}: ${result.reading.proposals.length} rows, ${result.meta.ms} ms, $${result.meta.costUsd?.toFixed(3)}`);
    return;
  }

  // Localhost pages only: this is a development aid, not a public endpoint.
  const local = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin ?? '');
  createServer(async (request, response) => {
    const origin = request.headers.origin;
    const send = (status, body) => {
      response.writeHead(status, {
        'Content-Type': 'application/json',
        ...(local(origin) ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'Content-Type' } : {}),
      });
      response.end(JSON.stringify(body));
    };
    if (request.method === 'OPTIONS') return send(204, {});
    if (request.method === 'GET' && request.url === '/health') return send(200, { ok: true });
    if (request.method !== 'POST' || request.url !== '/read') return send(404, { error: 'Not found' });
    if (origin && !local(origin)) return send(403, { error: 'Local pages only' });
    try {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const { name, data, text, target } = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      const result = await readReport({ name, bytes: data ? Buffer.from(data, 'base64') : undefined, text, target });
      console.log(`${name ?? 'pasted text'}: ${result.reading.proposals.length} rows, ${result.meta.ms} ms`);
      send(200, result);
    } catch (error) {
      console.error(error.message);
      send(500, { error: error.message });
    }
  }).listen(PORT, '127.0.0.1', () => console.log(`report-reader on http://localhost:${PORT}`));
};

if (process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]))) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
