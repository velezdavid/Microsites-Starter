import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@microsites/schemas";
import { siteScopedTypes, siteTemplates, structure } from "./structure";
import { previewTool } from "./presentation";
import { previewSites } from "./preview-sites";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
// Local Astro dev server (apps/studio/.env.development); replaces the deployed preview sites in `sanity dev`.
const localPreviewUrl = process.env.SANITY_STUDIO_PREVIEW_URL;
const previewTools = localPreviewUrl
  ? [previewTool({ name: "presentation", title: "Vista previa (local)", origin: localPreviewUrl })]
  : previewSites.map((s) => previewTool({ name: `preview-${s.slug}`, title: previewSites.length > 1 ? `Vista previa · ${s.title}` : "Vista previa", origin: s.url }));

if (!projectId) {
  throw new Error("Missing SANITY_STUDIO_PROJECT_ID. Copy .env.example to .env.");
}

export default defineConfig({
  name: "default",
  title: "Microsites Starter",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), ...previewTools, visionTool()],
  schema: {
    types: schemaTypes,
    // Site-scoped documents are created from each site's lists, with the site preset.
    templates: (prev) => [...prev.filter((t) => !siteScopedTypes.includes(t.id)), ...siteTemplates],
  },
});
