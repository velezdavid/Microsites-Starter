import { defineLocations, presentationTool, type DocumentLocation, type DocumentLocationsState } from "sanity/presentation";

/** Public URL for a page path (same rule as `pageHref` in apps/web). */
const pageHref = (path?: string) => "/" + encodeURI(path ?? "");

const home: DocumentLocation = { title: "Inicio", href: "/" };
const at = (title: string, href: string): DocumentLocation => ({ title, href });
const actualidad = at("Actualidad", "/actualidad");

type Doc = Record<string, any> | null;
type Resolver = { select: Record<string, string>; resolve: (doc: Doc) => DocumentLocationsState };

/** Locations of each document type, as select + resolve (scoped to one site in `previewTool`). */
const LOCATIONS: Record<string, Resolver> = {
  /* ---------- Landing sites ---------- */
  page: {
    select: { title: "title", path: "path" },
    resolve: (doc) => ({ locations: [at(doc?.title || "Página", pageHref(doc?.path))] }),
  },
  item: {
    select: { title: "title", path: "page.path", hasPage: "page._ref" },
    resolve: (doc) => ({ locations: doc?.hasPage ? [at(doc.title, pageHref(doc.path)), home] : [home] }),
  },
  category: { select: {}, resolve: () => ({ locations: [home] }) },
  site: { select: {}, resolve: () => ({ locations: [home] }) },

  /* ---------- Editorial sites (news + registry) ---------- */
  article: {
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => ({ locations: doc?.slug ? [at(doc.title || "Artículo", `/actualidad/${doc.slug}`), actualidad, home] : [actualidad] }),
  },
  award: {
    select: { title: "name", slug: "slug.current" },
    resolve: (doc) => ({ locations: doc?.slug ? [at(doc.title || "Galardón", `/rankings/${doc.slug}`), at("Rankings", "/rankings")] : [at("Rankings", "/rankings")] }),
  },
  edition: {
    select: { award: "award.name", awardSlug: "award.slug.current", year: "year" },
    resolve: (doc) => ({
      locations:
        doc?.awardSlug && doc.year
          ? [at(`${doc.award} ${doc.year}`, `/rankings/${doc.awardSlug}/${doc.year}`), at(doc.award || "Galardón", `/rankings/${doc.awardSlug}`), at("Rankings", "/rankings")]
          : [at("Rankings", "/rankings")],
    }),
  },
  organization: {
    select: { title: "name", slug: "slug.current" },
    resolve: (doc) => ({ locations: doc?.slug ? [at(doc.title || "Empresa", `/empresas/${doc.slug}`), at("Empresas", "/empresas")] : [at("Empresas", "/empresas")] }),
  },
  event: {
    select: { title: "name", slug: "slug.current", hasPage: "hasPage" },
    resolve: (doc) => ({ locations: doc?.slug && doc.hasPage ? [at(doc.title || "Evento", `/eventos/${doc.slug}`), at("Eventos", "/eventos")] : [at("Eventos", "/eventos")] }),
  },
  editorialPage: {
    select: { title: "menuLabel", slug: "slug.current", group: "group" },
    resolve: (doc) => ({
      locations: doc?.slug ? [at(doc.title || "Página", doc.group === "participa" ? `/participa/${doc.slug}` : `/${doc.slug}`)] : [home],
    }),
  },
  frontPage: { select: {}, resolve: () => ({ locations: [home] }) },
  editorialSettings: { select: {}, resolve: () => ({ locations: [home, actualidad, at("Newsletter", "/newsletter")] }) },
  author: { select: {}, resolve: () => ({ locations: [actualidad] }) },
  topic: { select: {}, resolve: () => ({ locations: [actualidad] }) },
  movement: { select: {}, resolve: () => ({ locations: [actualidad] }) },
  newsletterIssue: { select: {}, resolve: () => ({ locations: [at("Newsletter", "/newsletter")] }) },
  sector: { select: {}, resolve: () => ({ locations: [at("Empresas", "/empresas")] }) },
  organizer: { select: {}, resolve: () => ({ locations: [at("Rankings", "/rankings")] }) },
};

/**
 * Locations for one microsite: a document only shows "Used on N pages" in the preview tool of its own site
 * (the `site` document by its slug, the rest by their `site` reference). Without a slug (local preview), every site.
 */
function siteLocations(siteSlug?: string) {
  return Object.fromEntries(
    Object.entries(LOCATIONS).map(([type, { select, resolve }]) => [
      type,
      defineLocations({
        select: { ...select, siteSlug: type === "site" ? "slug.current" : "site.slug.current" },
        resolve: (doc) => (!siteSlug || doc?.siteSlug === siteSlug ? resolve(doc) : null),
      }),
    ]),
  );
}

/**
 * Presentation (visual editing): a microsite preview runs inside the Studio, with drafts and
 * click-to-edit. The Studio opens /api/preview/enable on the preview site with a short-lived
 * secret, which unlocks drafts for that browser session only.
 */
export function previewTool({ name, title, origin, siteSlug }: { name: string; title: string; origin: string; siteSlug?: string }) {
  return presentationTool({
    name,
    title,
    previewUrl: { initial: origin, previewMode: { enable: "/api/preview/enable" } },
    allowOrigins: [origin],
    resolve: { locations: siteLocations(siteSlug) },
  });
}
