import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// Minimal, mirroring the ecology hub and the other spokes. The spoke ships
// static HTML/CSS; interactivity comes from the hub's Lit web components
// (self-registering) and any island scripts a prototype adds.
//
// Intended to publish to GitHub Pages as a project site, so production builds
// need the subpath as `base`. Dev stays at root for clean local URLs —
// withBase() (src/lib/base.ts) reads whichever base is active.
const base = process.env.NODE_ENV === 'production' ? '/firma2-design/' : '/';

// Hugeicons trial (local only): `npm run dev:hugeicons` swaps the hub's Lucide
// icon-registry for src/lib/hugeicons-registry.ts at resolve time. Off by default,
// so normal dev, builds and deploys keep Lucide.
const HUGEICONS_REGISTRY = fileURLToPath(new URL('./src/lib/hugeicons-registry.ts', import.meta.url));
const hugeiconsTrial = {
  name: 'firma2-hugeicons-trial',
  enforce: 'pre',
  async resolveId(source, importer, options) {
    if (!source.includes('icon-registry') || !importer || importer === HUGEICONS_REGISTRY) return null;
    const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
    return resolved && /ecology\/src\/components\/icon-registry\.ts$/.test(resolved.id) ? HUGEICONS_REGISTRY : null;
  },
};

export default defineConfig({
  site: 'https://esassoc.github.io',
  base,
  server: { port: 4330 },
  vite: { plugins: process.env.ICONS === 'hugeicons' ? [hugeiconsTrial] : [] },
});
