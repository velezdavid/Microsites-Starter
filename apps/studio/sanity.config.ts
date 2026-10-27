import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@microsites/schemas";
import { siteTemplates, structure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

if (!projectId) {
  throw new Error("Missing SANITY_STUDIO_PROJECT_ID. Copy .env.example to .env.");
}

export default defineConfig({
  name: "default",
  title: "Microsites Starter",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // Site-scoped documents are created from each site's lists, with the site preset.
    templates: (prev) => [...prev.filter((t) => !["page", "category", "item"].includes(t.id)), ...siteTemplates],
  },
});
