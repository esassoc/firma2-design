/// <reference types="astro/client" />

// The dev-only real workspace (astro.config.mjs). `null` in every build.
declare module 'virtual:firma2-area-files' {
  const files: unknown;
  export default files;
}

declare module 'virtual:firma2-workspace' {
  const workspace: unknown;
  export default workspace;
}
