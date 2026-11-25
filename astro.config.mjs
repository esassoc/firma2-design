import { defineConfig } from 'astro/config';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Minimal, mirroring the ecology hub and the other spokes. The spoke ships
// static HTML/CSS; interactivity comes from the hub's Lit web components
// (self-registering) and any island scripts a prototype adds.
//
// Intended to publish to GitHub Pages as a project site, so production builds
// need the subpath as `base`. Dev stays at root for clean local URLs —
// withBase() (src/lib/base.ts) reads whichever base is active.
const base = process.env.NODE_ENV === 'production' ? '/firma2-design/' : '/';

// Hugeicons are this spoke's icons: the plugin swaps the hub's Lucide
// icon-registry for src/lib/hugeicons-registry.ts at resolve time, in dev,
// builds and deploys alike. `npm run dev:lucide` (ICONS=lucide) turns it off,
// to compare against the hub's own glyphs.
const HUGEICONS_REGISTRY = fileURLToPath(new URL('./src/lib/hugeicons-registry.ts', import.meta.url));
const hugeicons = {
  name: 'firma2-hugeicons',
  enforce: 'pre',
  async resolveId(source, importer, options) {
    if (!source.includes('icon-registry') || !importer || importer === HUGEICONS_REGISTRY) return null;
    const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
    return resolved && /ecology\/src\/components\/icon-registry\.ts$/.test(resolved.id) ? HUGEICONS_REGISTRY : null;
  },
};

// A REAL WORKSPACE, IN DEV ONLY. `scripts/pull-projectfirma.mjs` writes one
// tenant to docs/private/<tenant>/workspace.json (gitignored), and the data
// modules read it through `virtual:firma2-workspace` in place of the invented
// fixtures (src/data/firma2-real-data.ts). This repo and its site are public,
// so the module is `null` in EVERY build, whatever is on disk: a build cannot
// publish a tenant's data because it never reads the file.
//   FIRMA2_WORKSPACE=<tenant>  pick a folder (default: the first one found)
//   FIRMA2_DATA=mock           dev with the invented fixtures
const PRIVATE = fileURLToPath(new URL('./docs/private/', import.meta.url));
const workspaceFile = () => {
  if (process.env.FIRMA2_DATA === 'mock' || !existsSync(PRIVATE)) return null;
  const tenants = process.env.FIRMA2_WORKSPACE ? [process.env.FIRMA2_WORKSPACE] : readdirSync(PRIVATE).sort();
  return tenants.map((t) => `${PRIVATE}${t}/workspace.json`).find((file) => existsSync(file)) ?? null;
};
const realWorkspace = () => {
  let serving = false;
  return {
    name: 'firma2-real-workspace',
    configResolved(config) {
      serving = config.command === 'serve' && !config.isProduction;
    },
    resolveId(source) {
      return source === 'virtual:firma2-workspace' ? '\0virtual:firma2-workspace' : null;
    },
    load(id) {
      if (id !== '\0virtual:firma2-workspace') return null;
      const file = serving ? workspaceFile() : null;
      if (!file) return 'export default null;';
      this.addWatchFile(file);
      return `export default ${readFileSync(file, 'utf8')};`;
    },
  };
};

// AREA FILES, IN DEV ONLY, on the same terms: a spatial file converted to
// docs/private/<tenant>/area-files.json sits beside the workspace it belongs
// to and is served as `virtual:firma2-area-files`; every build gets `null`
// (src/data/firma2-geospatial-areas.ts).
const realAreaFiles = () => {
  let serving = false;
  return {
    name: 'firma2-real-area-files',
    configResolved(config) {
      serving = config.command === 'serve' && !config.isProduction;
    },
    resolveId(source) {
      return source === 'virtual:firma2-area-files' ? '\0virtual:firma2-area-files' : null;
    },
    load(id) {
      if (id !== '\0virtual:firma2-area-files') return null;
      const workspace = serving ? workspaceFile() : null;
      const file = workspace ? workspace.replace(/workspace\.json$/, 'area-files.json') : null;
      if (!file || !existsSync(file)) return 'export default null;';
      this.addWatchFile(file);
      return `export default ${readFileSync(file, 'utf8')};`;
    },
  };
};

export default defineConfig({
  site: 'https://esassoc.github.io',
  base,
  server: { port: 4330 },
  vite: { plugins: [realWorkspace(), realAreaFiles(), ...(process.env.ICONS === 'lucide' ? [] : [hugeicons])] },
});
