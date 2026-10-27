// @ts-check
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import sanity from "@sanity/astro";
import { loadEnv } from "vite";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? "development",
  process.cwd(),
  "",
);

if (!PUBLIC_SANITY_PROJECT_ID) {
  throw new Error("Missing PUBLIC_SANITY_PROJECT_ID. Copy .env.example to .env.");
}

export default defineConfig({
  output: "static",
  adapter: netlify(),
  // "file" emits `page.html` (not `page/index.html`), matching the URLs of the sites being migrated.
  // Inline CSS (≈10 KB gzip) to avoid a render-blocking request.
  build: { format: "file", inlineStylesheets: "always" },
  trailingSlash: "never",
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2026-10-01",
      useCdn: false,
    }),
  ],
});
