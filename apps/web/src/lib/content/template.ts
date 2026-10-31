/**
 * Page template of this build. SITE_TEMPLATE is read at build time, so the unused template
 * (and all its CSS) is left out: "editorial" sites never ship landing CSS and vice versa.
 */
export async function getSitePage() {
  return import.meta.env.SITE_TEMPLATE === "editorial"
    ? (await import("../../components/EditorialSitePage.astro")).default
    : (await import("../../components/SitePage.astro")).default;
}
