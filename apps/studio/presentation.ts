import { defineLocations, presentationTool, type DocumentLocation } from "sanity/presentation";

/** Public URL for a page path (same rule as `pageHref` in apps/web). */
const pageHref = (path?: string) => "/" + encodeURI(path ?? "");

const home: DocumentLocation = { title: "Inicio", href: "/" };

/**
 * Presentation (visual editing): a microsite preview runs inside the Studio, with drafts and
 * click-to-edit. The Studio opens /api/preview/enable on the preview site with a short-lived
 * secret, which unlocks drafts for that browser session only.
 */
export function previewTool({ name, title, origin }: { name: string; title: string; origin: string }) {
  return presentationTool({
    name,
    title,
    previewUrl: { initial: origin, previewMode: { enable: "/api/preview/enable" } },
    allowOrigins: [origin],
    resolve: {
      locations: {
        page: defineLocations({
          select: { title: "title", path: "path" },
          resolve: (doc) => ({ locations: [{ title: doc?.title || "Página", href: pageHref(doc?.path) }] }),
        }),
        item: defineLocations({
          select: { title: "title", path: "page.path", hasPage: "page._ref" },
          resolve: (doc) => ({
            locations: doc?.hasPage ? [{ title: doc.title, href: pageHref(doc.path) }, home] : [home],
          }),
        }),
        category: { locations: [home] },
        site: { locations: [home] },
      },
    },
  });
}
