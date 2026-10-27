import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Shared Studio for every microsite: https://microsites-starter.sanity.studio
  studioHost: "microsites-starter",
  deployment: {
    appId: "bwpjh2ut996txy0d5rhke1b0",
  },
  server: {
    port: 3333,
  },
});
