import type { SiteDefinition } from "../lib/content/types";
import { rankingSite } from "./ranking";

/** Microsites whose content still lives in code (static port stage), keyed by SITE_SLUG. */
const LOCAL_SITES: Record<string, () => SiteDefinition> = {
  ranking: rankingSite,
};

export function getLocalSite(slug: string): SiteDefinition {
  const site = LOCAL_SITES[slug];
  if (!site) throw new Error(`No local content for "${slug}" (SITE_LOCAL_DATA=true).`);
  return site();
}
