#!/usr/bin/env node
// Pulls one ProjectFirma tenant into docs/private/<tenant>/workspace.json.
//
// docs/private/ is gitignored and this repo is public: the output of this
// script must never be committed, and the prototype only reads it in `astro
// dev` (see src/data/firma2-real-data.ts). The script itself holds no token
// and no tenant data.
//
//   PF_TOKEN=<web service token> node scripts/pull-projectfirma.mjs <host> <tenant>
//   node scripts/pull-projectfirma.mjs https://www.example.org example
//
// A signed-in user's "Projects" Excel export adds what the public cannot see:
// deferred and terminated projects, each project's primary contact, watersheds,
// secondary limiting factors and other partners. Save it as
// docs/private/<tenant>/Projects.xlsx and it is merged in on every pull.
//
// The token can also sit in docs/private/<tenant>/token.txt. Pages already
// downloaded are kept in docs/private/<tenant>/raw/ and reused; pass --refresh
// to fetch them again.
//
// Two sources, because the web services are thin: they list projects,
// organizations and measures, and give each project's shapes, but say nothing
// about who leads a project, what it costs or what it reported. Those come
// from the tenant's public project pages.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const refresh = args.includes('--refresh');
const [hostArg, tenant] = args.filter((a) => !a.startsWith('--'));
if (!hostArg || !tenant) {
  console.error('usage: node scripts/pull-projectfirma.mjs <host> <tenant> [--refresh]');
  process.exit(1);
}
const host = hostArg.replace(/\/+$/, '').replace(/\/webservices$/i, '');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'docs', 'private', tenant);
const raw = join(out, 'raw');
await mkdir(raw, { recursive: true });

const tokenFile = join(out, 'token.txt');
const token = (process.env.PF_TOKEN ?? (existsSync(tokenFile) ? await readFile(tokenFile, 'utf8') : '')).trim();
if (!token) {
  console.error(`No token: set PF_TOKEN or write it to ${tokenFile}`);
  process.exit(1);
}

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

/** Fetch a URL once and keep the body under raw/, so a re-parse costs nothing. */
const cached = async (name, url) => {
  const file = join(raw, name);
  if (!refresh && existsSync(file)) return readFile(file, 'utf8');
  // A page the public cannot see answers with a redirect to sign-in, which
  // loops. Keep it as an empty page: the project still has its web service row.
  const response = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0 (prototype data pull)' } });
  if (response.status >= 300 && response.status < 400) {
    await writeFile(file, '');
    return '';
  }
  if (!response.ok) throw new Error(`${response.status} for ${url.replace(token, '<token>')}`);
  const body = await response.text();
  await writeFile(file, body);
  await sleep(150);
  return body;
};

const service = async (name, id) =>
  JSON.parse(await cached(`${name}${id ? `-${id}` : ''}.json`, `${host}/WebServices/${name}/JSON/${token}${id ? `/${id}` : ''}`));

// ---------------------------------------------------------------------------
// Page parsing — no dependencies, so the markup is read with patterns. The
// pages are server-rendered tables with stable region labels.
// ---------------------------------------------------------------------------

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ', apos: "'" };
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);

/** Visible text of a fragment; `<br>` and block ends become line breaks. */
const lines = (html) =>
  decode(
    html
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/<br\s*\/?>|<\/(p|div|li|tr)>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  )
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
const text = (html) => lines(html).join(' ');

const tables = (html) =>
  [...html.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)].map((t) =>
    [...t[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((r) =>
      [...r[1].matchAll(/<t([hd])([^>]*)>([\s\S]*?)<\/t[hd]>/gi)].map((c) => ({
        head: c[1].toLowerCase() === 'h',
        span: Number(/colspan="(\d+)"/i.exec(c[2])?.[1] ?? 1),
        html: c[3],
        text: text(c[3]),
      })),
    ),
  );

const money = (s) => {
  const n = Number(String(s).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) && /\d/.test(String(s)) ? n : null;
};
const number = money;

/** The page split into its labelled panels: { 'Reported Performance': html }. */
const panels = (html) => {
  const marks = [...html.matchAll(/<div class="panel panelFirma"[^>]*aria-label="([^"]*)"/g)];
  const found = {};
  marks.forEach((m, i) => {
    const label = decode(m[1]);
    const body = html.slice(m.index, marks[i + 1]?.index ?? html.length);
    // Classification systems each get their own panel with their own name.
    found[label] = (found[label] ?? '') + body;
  });
  return found;
};

const parseProjectPage = (html) => {
  const p = panels(html);
  const result = {};

  // Organizations: one row per relationship, any number of organizations each.
  result.organizations = [];
  for (const row of tables(p['Organizations'] ?? '')[0] ?? []) {
    if (row.length < 2 || row[0].head) continue;
    for (const a of row[1].html.matchAll(/<a[^>]*href="\/Organization\/Detail\/(\d+)"[^>]*>([\s\S]*?)<\/a>/g)) {
      result.organizations.push({ role: row[0].text, id: Number(a[1]), name: text(a[2]) });
    }
  }

  result.contacts = [];
  for (const row of tables(p['Contacts'] ?? '')[0] ?? []) {
    if (row.length < 2 || row[0].head) continue;
    for (const name of lines(row[1].html)) result.contacts.push({ role: row[0].text, name });
  }

  // Expected: measure | "Dimension: option" lines | "3,600 lf".
  result.expected = [];
  for (const row of tables(p['Expected Performance'] ?? '')[0] ?? []) {
    if (row.length < 3 || row[0].head) continue;
    const value = /^([\d,.-]+)\s*(.*)$/.exec(row[2].text);
    result.expected.push({
      measure: row[0].text,
      measureId: Number(/PerformanceMeasure\/Detail\/(\d+)/.exec(row[0].html)?.[1] ?? 0) || null,
      subcategories: lines(row[1].html).map((l) => {
        const at = l.indexOf(':');
        return at < 0 ? { name: '', option: l } : { name: l.slice(0, at).trim(), option: l.slice(at + 1).trim() };
      }),
      value: value ? number(value[1]) : null,
      unit: value ? value[2] : '',
    });
  }

  // Reported: one table per measure — title row, header row (dimensions, then
  // years, then Units), one row per option combination, then a Total row.
  result.reported = [];
  for (const table of tables(p['Reported Performance'] ?? '')) {
    if (table.length < 3) continue;
    const header = table[1].map((c) => c.text);
    const years = header.map((h, i) => (/^\d{4}$/.test(h) ? i : -1)).filter((i) => i >= 0);
    if (!years.length) continue;
    const dims = header.slice(0, years[0]);
    const rows = [];
    let unit = '';
    for (const row of table.slice(2)) {
      if (row[0].span > 1 || /^total$/i.test(row[0].text)) continue;
      const byYear = {};
      for (const i of years) {
        const v = number(row[i]?.text ?? '');
        if (v !== null) byYear[header[i]] = v;
      }
      unit = row[row.length - 1]?.text || unit;
      rows.push({ options: row.slice(0, dims.length).map((c) => c.text), byYear });
    }
    // A "nothing to report" explanation is laid out as a table too.
    if (!/PerformanceMeasure\/Detail\/\d+/.test(table[0][0].html)) continue;
    result.reported.push({
      measure: table[0][0].text,
      measureId: Number(/PerformanceMeasure\/Detail\/(\d+)/.exec(table[0][0].html)?.[1] ?? 0) || null,
      dimensions: dims,
      unit,
      rows,
    });
  }

  // Budget: labelled figures, then a fund table (Fund | Secured | Targeted | Total).
  const budget = p['Budget'] ?? p['Project Budget'] ?? Object.entries(p).find(([k]) => /budget/i.test(k))?.[1] ?? '';
  const figure = (label) => {
    const at = budget.indexOf(`>${label}</label>`);
    if (at < 0) return null;
    const m = /col-xs-9">\s*([^<]*)</.exec(budget.slice(at));
    return m ? money(m[1]) : null;
  };
  result.estimatedTotalCost = figure('Estimated Total Cost');
  result.securedFunding = figure('Secured Funding');
  result.targetedFunding = figure('Targeted Funding');
  result.funding = [];
  for (const row of tables(budget)[0] ?? []) {
    if (row.length < 4 || row[0].head || /^total$/i.test(row[0].text)) continue;
    result.funding.push({ fund: row[0].text, secured: money(row[1].text) ?? 0, targeted: money(row[2].text) ?? 0 });
  }

  // Expenditures: Fund | one column per year | Total.
  result.expenditures = [];
  const spend = tables(p['Reported Expenditure'] ?? '')[0] ?? [];
  if (spend.length > 1) {
    const header = spend[0].map((c) => c.text);
    for (const row of spend.slice(1)) {
      if (/total$/i.test(row[0].text)) continue;
      const byYear = {};
      header.forEach((h, i) => {
        const v = /^\d{4}$/.test(h) ? money(row[i]?.text ?? '') : null;
        if (v) byYear[h] = v;
      });
      if (Object.keys(byYear).length) result.expenditures.push({ fund: row[0].text, byYear });
    }
  }

  // Classification systems: the heading names the system, the panel lists
  // what the project is filed under and why.
  result.classifications = {};
  for (const m of html.matchAll(/<h2 id="classificationSystem"[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2 [^>]*sectionHeader|$)/g)) {
    const system = text(m[1]);
    result.classifications[system] = [...m[2].matchAll(/<label><a[^>]*>([\s\S]*?)<\/a><\/label>\s*<div>([\s\S]*?)<\/div>/g)].map(
      (c) => ({ name: text(c[1]), note: text(c[2]) }),
    );
  }

  // Notes: two empty control cells, then date | author | text.
  result.notes = [];
  for (const row of tables(p['Notes'] ?? '')[0] ?? []) {
    const cells = row.map((c) => c.text).filter(Boolean);
    if (cells.length >= 3) result.notes.push({ date: cells[0], author: cells[1], text: cells.slice(2).join(' ') });
  }

  result.photos = [...html.matchAll(/<a class="gallery"[^>]*href="(\/FileResource\/DisplayResource\/[0-9a-f-]+)"[^>]*title="([^"]*)"/g)].map(
    (m) => {
      const [caption = '', meta = '', credit = ''] = decode(m[2]).split('\n').map((l) => l.trim());
      return {
        url: host + m[1],
        caption,
        timing: /Timing: ([^)]*)\)/.exec(meta)?.[1] ?? '',
        credit: credit.replace(/^Credit:\s*/, ''),
      };
    },
  );

  result.lastUpdated = /Last Updated<\/[\s\S]{0,400}?(\d{1,2}\/\d{1,2}\/\d{4})/.exec(html)?.[1] ?? '';
  return result;
};

// ---------------------------------------------------------------------------
// Pull
// ---------------------------------------------------------------------------

const [projectRows, measures, organizations] = [
  await service('GetProjects'),
  await service('GetPerformanceMeasures'),
  await service('GetOrganizations'),
];

const projects = [];
for (const row of projectRows) {
  const id = row.ProjectID;
  const geometries = (await service('GetProjectGeometries', id).catch(() => []))
    .map((g) => {
      try {
        return JSON.parse(g.ProjectLocationGeometry).geometry;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  const html = await cached(`project-${id}.html`, `${host}/Project/Detail/${id}`);
  const page = parseProjectPage(html);
  projects.push({
    id,
    name: row.ProjectName.trim(),
    taxonomyBranch: row.TaxonomyBranch,
    taxonomyLeaf: row.TaxonomyLeaf,
    description: row.ProjectDescription ?? '',
    planningStartYear: row.PlanningStartDate,
    implementationStartYear: row.ImplementationStartDate,
    completionYear: row.EndDate,
    stage: row.Stage,
    latitude: row.Latitude,
    longitude: row.Longitude,
    geometries,
    publicPage: html.length > 0,
    ...page,
  });
  process.stdout.write(`\r${projects.length}/${projectRows.length} projects`);
}
process.stdout.write('\n');

// ---------------------------------------------------------------------------
// The Excel export, when one is on disk
// ---------------------------------------------------------------------------

/** An .xlsx as { sheet name: [row objects] }. An .xlsx is a zip of XML; the
 *  system `unzip` reads it, so the script still needs no packages. */
const readWorkbook = (file) => {
  // Some writers prefix every element ("x:row"); the prefix is dropped on read.
  const part = (name) =>
    execFileSync('unzip', ['-p', file, name], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }).replace(/<(\/?)[A-Za-z0-9]+:/g, '<$1');
  const cellText = (xml) => decode([...xml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join(''));
  let strings = [];
  try {
    strings = [...part('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => cellText(m[1]));
  } catch {
    // A workbook of inline strings has no shared table.
  }
  const targets = Object.fromEntries(
    [...part('xl/_rels/workbook.xml.rels').matchAll(/<Relationship\b[^>]*>/g)].map((m) => [
      /Id="([^"]*)"/.exec(m[0])[1],
      /Target="([^"]*)"/.exec(m[0])[1],
    ]),
  );
  const column = (ref) => [...ref.replace(/\d+/g, '')].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1;
  const book = {};
  for (const m of part('xl/workbook.xml').matchAll(/<sheet\b[^>]*>/g)) {
    const name = decode(/name="([^"]*)"/.exec(m[0])[1]);
    const target = targets[/r:id="([^"]*)"/.exec(m[0])[1]].replace(/^\/?(xl\/)?/, 'xl/');
    const rows = [...part(target).matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)].map((row) => {
      const cells = [];
      for (const c of row[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const type = /\bt="([^"]*)"/.exec(c[1])?.[1];
        const value = /<v>([\s\S]*?)<\/v>/.exec(c[2] ?? '')?.[1];
        cells[column(/\br="([A-Z]+\d+)"/.exec(c[1])[1])] =
          type === 's' ? strings[Number(value)] : type === 'inlineStr' ? cellText(c[2] ?? '') : value === undefined ? '' : decode(value);
      }
      return cells;
    });
    const header = rows[0] ?? [];
    book[name] = rows
      .slice(1)
      .filter((cells) => cells.some((v) => v !== undefined && v !== ''))
      .map((cells) => Object.fromEntries(header.map((h, i) => [h, (cells[i] ?? '').toString().trim()])));
  }
  return book;
};

const exportFile = join(out, 'Projects.xlsx');
if (existsSync(exportFile)) {
  const book = readWorkbook(exportFile);
  const of = (sheet, id) => (book[sheet] ?? []).filter((row) => Number(row['Project ID']) === id);
  const list = (value) => (value ?? '').split(',').map((v) => v.trim()).filter(Boolean);
  const amount = (value) => Number(value) || 0;
  const shortOf = (name) => organizations.find((o) => o.OrganizationName.trim() === name)?.OrganizationShortName.trim();
  const fundLabel = (row) => (shortOf(row['Funding Organization']) ? `${row.Fund} (${shortOf(row['Funding Organization'])})` : row.Fund);
  // A limiting factor's name can hold a comma, so a list of them is read by
  // finding the names already known, longest first.
  const factors = [...new Set([...projects.map((p) => p.taxonomyLeaf), ...(book.Projects ?? []).map((r) => r['Primary Limiting Factor'])])]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  const branchOf = (leaf) => projects.find((p) => p.taxonomyLeaf === leaf)?.taxonomyBranch ?? '';
  const otherFactors = (value) => {
    let rest = value ?? '';
    const found = [];
    for (const name of factors) {
      if (rest.includes(name)) {
        found.push(name);
        rest = rest.split(name).join('');
      }
    }
    return found;
  };

  // A date cell holds days since 30 December 1899; the page form is MM/DD/YYYY.
  const excelDate = (value) => {
    if (!/^\d+(\.\d+)?$/.test(value)) return value;
    const d = new Date(Date.UTC(1899, 11, 30) + Math.floor(Number(value)) * 86_400_000);
    return `${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}/${d.getUTCFullYear()}`;
  };

  let added = 0;
  for (const row of book.Projects ?? []) {
    const id = Number(row['Project ID']);
    let project = projects.find((p) => p.id === id);
    if (!project) {
      // Not in the web services at all: a deferred or terminated project.
      const sum = (rows, key, field) => {
        const total = new Map();
        for (const r of rows) total.set(key(r), (total.get(key(r)) ?? 0) + amount(r[field]));
        return total;
      };
      const budget = of('Budgets', id).filter((r) => r.Fund);
      const secured = sum(budget, fundLabel, 'Secured Funding Amount');
      const targeted = sum(budget, fundLabel, 'Targeted Funding Amount');
      const spendByFund = new Map();
      for (const r of of('Reported Expenditures', id)) {
        const byYear = spendByFund.get(fundLabel(r)) ?? {};
        if (amount(r['Expenditure Amount'])) byYear[r['Calendar Year']] = (byYear[r['Calendar Year']] ?? 0) + amount(r['Expenditure Amount']);
        spendByFund.set(fundLabel(r), byYear);
      }
      const reported = new Map();
      for (const r of of('Reported Performance Measures', id)) {
        const dims = [1, 2, 3, 4].filter((n) => r[`Subcategory ${n} Name`]);
        const entry = reported.get(r['Performance Measure']) ?? {
          measure: r['Performance Measure'],
          measureId: Number(r['Performance Measure ID']) || null,
          dimensions: dims.map((n) => r[`Subcategory ${n} Name`]),
          unit: '',
          rows: [],
        };
        entry.rows.push({ options: dims.map((n) => r[`Subcategory ${n} Option`]), byYear: { [r['Calendar Year']]: amount(r['Reported Value']) } });
        reported.set(r['Performance Measure'], entry);
      }
      project = {
        id,
        name: row['Project Name'],
        taxonomyBranch: branchOf(row['Primary Limiting Factor']),
        taxonomyLeaf: row['Primary Limiting Factor'],
        description: row['Project Description'],
        planningStartYear: null,
        implementationStartYear: Number(row['Implementation Start Year']) || null,
        completionYear: Number(row['Completion Year']) || null,
        stage: row['Project Stage'],
        latitude: row.Latitude ? Number(row.Latitude) : null,
        longitude: row.Longitude ? Number(row.Longitude) : null,
        geometries: [],
        publicPage: false,
        organizations: [],
        contacts: [],
        expected: of('Expected Performance Measures', id).map((r) => ({
          measure: r['Performance Measure'],
          measureId: Number(r['Performance Measure ID']) || null,
          subcategories: [],
          value: r['Expected Value'] === '' ? null : amount(r['Expected Value']),
          unit: '',
        })),
        reported: [...reported.values()],
        estimatedTotalCost: amount(row['Estimated Total Cost']) || null,
        securedFunding: amount(row['Secured Funding']),
        targetedFunding: amount(row['Targeted Funding']),
        funding: [...secured.keys()].map((fund) => ({ fund, secured: secured.get(fund), targeted: targeted.get(fund) ?? 0 })),
        expenditures: [...spendByFund].filter(([, byYear]) => Object.keys(byYear).length).map(([fund, byYear]) => ({ fund, byYear })),
        classifications: Object.fromEntries(
          ['Focal Species', 'Project Types', 'FIP Bienniums'].map((system) => [system, of(system, id).map((r) => ({ name: r.Classification, note: '' }))]),
        ),
        notes: of('Project Notes', id).map((r) => ({ date: excelDate(r['Create Date']), author: r['Create Person'], text: r['Project Note'] })),
        photos: [],
        lastUpdated: '',
      };
      projects.push(project);
      added += 1;
    }

    // What only the export holds, on every project it lists.
    project.fromExport = true;
    const relationships = of('Project Organizations', id);
    if (relationships.length) {
      project.organizations = relationships.map((r) => ({
        role: r['Organization Relationship To Project'],
        id: Number(r['Organization ID']) || 0,
        name: r['Organization Name'],
      }));
    }
    // "Last, First" as the export prints it.
    const [last, first] = row['Project Primary Contact'].split(',').map((part) => part.trim());
    project.primaryContact = row['Project Primary Contact']
      ? { name: first ? `${first} ${last}` : last, email: row['Project Primary Contact Email'] }
      : null;
    project.otherLimitingFactors = otherFactors(row['Other Limiting Factor(s)']).filter((name) => name !== project.taxonomyLeaf);
    project.classifications.Watersheds = list(row.Watersheds).map((name) => ({ name, note: '' }));
    project.biennium = row.Biennium === 'None' ? '' : row.Biennium;
    project.federalFunding = row['Federal Funding Opportunities'] === 'None' ? '' : row['Federal Funding Opportunities'];
    project.locationNotes = row['Project Location Notes'];
  }
  console.log(`Merged ${exportFile}: ${(book.Projects ?? []).length} projects, ${added} not in the web services`);
}

const tenantName = /<title>\s*([^|<]*?)\s*\|/.exec(await cached('home.html', `${host}/`))?.[1] ?? tenant;

await writeFile(
  join(out, 'workspace.json'),
  JSON.stringify(
    {
      source: { host, tenant, name: tenantName, pulled: new Date().toISOString().slice(0, 10) },
      projects,
      organizations: organizations.map((o) => ({
        id: o.OrganizationID,
        name: o.OrganizationName.trim(),
        shortName: o.OrganizationShortName,
        type: o.OrganizationType,
        primaryContact: o.PrimaryContact === 'None' ? '' : o.PrimaryContact,
        projectCount: o.ProjectCount,
        fundCount: o.FundingSourceCount,
      })),
      measures: measures.map((m) => ({
        id: m.PerformanceMeasureID,
        name: m.PerformanceMeasureName.trim(),
        description: m.PerformanceMeasureDescription ?? '',
        unit: m.PerformanceMeasureUnits,
        subcategories: [1, 2, 3, 4]
          .map((n) => ({ name: (m[`PMSubcategoryName${n}`] ?? '').trim(), options: m[`PMSubcategoryOptionCount${n}`] ?? 0 }))
          .filter((s) => s.name),
      })),
    },
    null,
    1,
  ),
);
console.log(`Wrote ${join(out, 'workspace.json')}`);
