import type { SiteDefinition } from "../lib/content/types";

/**
 * Microsites whose content still lives in code (static port stage, SITE_LOCAL_DATA=true), keyed by SITE_SLUG.
 * Each one goes in ./<slug>/ until its Sanity schemas exist; ranking.ec already moved to Sanity.
 */
const LOCAL_SITES: Record<string, () => SiteDefinition> = {};

export function getLocalSite(slug: string): SiteDefinition {
  const site = LOCAL_SITES[slug];
  if (!site) throw new Error(`No local content for "${slug}" (SITE_LOCAL_DATA=true).`);
  return site();
}
