// @ts-check
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import { loadEnv } from "vite";

/**
 * @sanity/astro (dev only) aliases "styled-components" to its package folder, but on Windows the
 * path keeps a trailing "\package.json", so the visual-editing overlay fails to load. Strip it.
 * @returns {import("vite").Plugin}
 */
const fixSanityAliasOnWindows = () => ({
  name: "fix-sanity-alias-on-windows",
  enforce: "post",
  config(config) {
    const alias = config.resolve?.alias;
    if (!Array.isArray(alias)) return;
    for (const entry of alias) {
      if (typeof entry.replacement === "string") entry.replacement = entry.replacement.replace(/[\\/]package\.json$/, "");
    }
  },
});

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_VISUAL_EDITING, SANITY_PREVIEW_SITE } = loadEnv(
  process.env.NODE_ENV ?? "development",
  process.cwd(),
  "",
);

if (!PUBLIC_SANITY_PROJECT_ID) {
  throw new Error("Missing PUBLIC_SANITY_PROJECT_ID. Copy .env.example to .env.");
}

/**
 * Preview site (SANITY_PREVIEW_SITE=true): a separate Netlify site rendered on demand, used by
 * Sanity Presentation in the deployed Studio. The public sites stay fully static.
 */
const previewSite = SANITY_PREVIEW_SITE === "true";
const localVisualEditing = SANITY_VISUAL_EDITING === "true";

/** Routes Presentation uses to start / end a preview session: preview site, or `astro dev` with visual editing. */
const previewRoutes = () => ({
  name: "preview-routes",
  hooks: {
    /** @param {{ command: string; injectRoute: (route: { pattern: string; entrypoint: string; prerender?: boolean }) => void }} options */
    "astro:config:setup": ({ command, injectRoute }) => {
      if (!previewSite && !(command === "dev" && localVisualEditing)) return;
      injectRoute({ pattern: "/api/preview/enable", entrypoint: "./src/preview/enable.ts", prerender: false });
      injectRoute({ pattern: "/api/preview/disable", entrypoint: "./src/preview/disable.ts", prerender: false });
    },
  },
});

export default defineConfig({
  output: previewSite ? "server" : "static",
  adapter: netlify(),
  // "file" emits `page.html` (not `page/index.html`), matching the URLs of the sites being migrated.
  // Inline CSS (≈10 KB gzip) to avoid a render-blocking request.
  build: { format: "file", inlineStylesheets: "always" },
  trailingSlash: "never",
  // Visual-editing overlay (astro dev): its CommonJS deps must be pre-bundled to load in the browser.
  vite: {
    plugins: [fixSanityAliasOnWindows()],
    optimizeDeps: {
      include: ["lodash/groupBy.js", "lodash/isObject.js", "lodash/keyBy.js", "lodash/partition.js", "lodash/sortedIndex.js", "react-is", "react/compiler-runtime"],
    },
  },
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2026-10-01",
      useCdn: false,
    }),
    // Renders only the visual-editing overlay (previews); no JS on public pages.
    react(),
    previewRoutes(),
  ],
});
