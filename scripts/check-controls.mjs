#!/usr/bin/env node
/**
 * check-controls — measure every form control this spoke renders, on every
 * prototype page, and fail when siblings disagree.
 *
 * WHY THIS EXISTS
 *
 * design-principles already states the rule: "Every control sharing a row, bar,
 * or group matches its siblings in rendered height, font size, and variant.
 * Verify RENDERED output — different components can resolve different tokens and
 * silently mismatch." Knowing the rule was never the problem. Every size defect
 * shipped in this spoke passed a clean `astro build`, because none of them are
 * build errors — they are two numbers that disagree in a browser.
 *
 * The specific failures this is built from, all 2026-08-20:
 *
 *   - esa-text-field at `sm` renders a 36px box with 12px text; esa-select at
 *     `sm` renders 43px with 16px. Same rung, same column, no agreement — and
 *     12px is below the 13px floor design-principles sets for ANY text.
 *   - The row edit affordance shipped at `size="sm"` (38px), identical to the
 *     SECTION-level control it is supposed to be subordinate to.
 *   - AppLayout's height pin was gated on `Promise.all` across two legos.
 *     `customElements.whenDefined()` for an element a page never imports never
 *     resolves — so one unused lego silently withheld the pin from every other
 *     control on that page, and the Projects index search field went back to
 *     46px beside 40px dropdowns. Clean build, 114 pages, no warning.
 *
 * That last one is the case for automating this rather than remembering it: it
 * was introduced by the very code written to prevent it, on a page nobody was
 * looking at, and nothing but a rendered measurement could see it.
 *
 * USAGE
 *
 *   npm run dev                 # in another terminal
 *   node scripts/check-controls.mjs [baseUrl]
 *
 * Exits non-zero on a violation, so it can gate a commit.
 */

// Resolved dynamically so the failure is a sentence rather than a stack trace:
// playwright is NOT a dependency of this spoke, and adding one to run a check
// script is a decision for whoever owns the repo, not something this file should
// assume. `npm i -D playwright && npx playwright install chromium` enables it.
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error(
    'check-controls needs Playwright, which this spoke does not depend on.\n' +
      '  npm i -D playwright && npx playwright install chromium\n' +
      'Then re-run. (Or set NODE_PATH to a checkout that already has it.)',
  );
  process.exit(2);
}

const BASE = process.argv[2] ?? 'http://localhost:4330';

// Every route that renders app chrome. A page added here is a page that gets
// checked; the AppLayout pin is shared by all of them, which is exactly why one
// page is never enough.
const ROUTES = [
  '/prototypes/projects',
  '/prototypes/projects/deer-creek-riparian-corridor-enhancement',
  '/prototypes/performance-measures',
];

// The height every single-line field control in this app renders at. Not a
// preference — it is esa-filter-dropdown's own md height, adopted because that
// lego has no height hook to pin, so everything else moves to meet it.
const FIELD_HEIGHT = 40;

// design-principles: 16px body, 14px dense floor, and nothing below 13px ever.
const MIN_FONT_PX = 13;

// Multi-line by nature — a textarea is sized by its rows, not by the field ramp.
const EXEMPT_FROM_HEIGHT = new Set(['esa-textarea']);

const measure = async (page) =>
  page.evaluate(() => {
    const TAGS = [
      'esa-text-field',
      'esa-select',
      'esa-textarea',
      'esa-filter-dropdown',
      'esa-combobox',
      'esa-date-picker',
    ];
    const out = [];
    for (const el of document.querySelectorAll(TAGS.join(','))) {
      // The box each lego actually draws its border and height on differs:
      // esa-text-field uses a `.control` wrapper, esa-select's trigger IS
      // `.input`. Measuring the wrong node reports a pass that is not real.
      const root = el.shadowRoot;
      const box =
        root?.querySelector('.control') ??
        root?.querySelector('.input') ??
        root?.querySelector('[role="combobox"], button');
      if (!box) continue;
      const rect = box.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue; // not rendered
      out.push({
        tag: el.localName,
        size: el.getAttribute('size') ?? '(default)',
        height: Number(rect.height.toFixed(1)),
        fontSize: Number.parseFloat(getComputedStyle(box).fontSize),
        pinned: Boolean(root._firma2FieldH),
        hidden: el.closest('[hidden]') !== null,
      });
    }
    return out;
  });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const failures = [];

for (const route of ROUTES) {
  let controls;
  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
  } catch {
    console.error(`✗ ${route} — could not load. Is \`npm run dev\` running on ${BASE}?`);
    process.exitCode = 1;
    continue;
  }
  // Open every inline editor so its control is measured too. A control that is
  // only reachable behind an interaction is still a control that has to match.
  await page.evaluate(() => {
    document.querySelectorAll('[data-field-edit] button').forEach((b) => b.click());
  });
  await page.waitForTimeout(1200);
  controls = await measure(page);

  console.log(`\n${route}`);
  if (controls.length === 0) {
    console.log('  (no form controls)');
    continue;
  }
  console.table(controls);

  for (const c of controls) {
    if (!EXEMPT_FROM_HEIGHT.has(c.tag) && Math.abs(c.height - FIELD_HEIGHT) > 1) {
      failures.push(`${route} — ${c.tag}[size=${c.size}] is ${c.height}px, expected ${FIELD_HEIGHT}px`);
    }
    if (c.fontSize < MIN_FONT_PX) {
      failures.push(`${route} — ${c.tag}[size=${c.size}] text is ${c.fontSize}px, below the ${MIN_FONT_PX}px floor`);
    }
  }
}

await browser.close();

if (failures.length > 0) {
  console.error(`\n✗ ${failures.length} control mismatch(es):`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log('\n✓ every control agrees on height and clears the type floor');
