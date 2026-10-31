import { createImageUrlBuilder } from "@sanity/image-url";
import type { Block, FooterConfig, HeaderConfig, LogoConfig, NavColumn, Theme } from "@microsites/ui";
import { sanityClient } from "sanity:client";
import { contentClient, isPreviewSite, sectionEditAttr } from "./preview";
import { mapSection } from "./blocks";
import { Catalog } from "./catalog";
import {
  CATEGORIES_QUERY,
  ITEMS_QUERY,
  PAGES_QUERY,
  SITE_QUERY,
  type RawCategory,
  type RawItem,
  type RawNavColumn,
  type RawPage,
  type RawSite,
  type SanityImage,
} from "./queries";
import { pageHref, type PageDefinition, type SiteDefinition } from "./types";

const imageBuilder = createImageUrlBuilder(sanityClient);
const imageUrl = (image: SanityImage | undefined, width: number, height?: number) => {
  if (!image?.asset) return undefined;
  const img = imageBuilder.image(image).width(width).auto("format");
  return (height ? img.height(height).fit("crop") : img).url();
};

function navColumns(columns: RawNavColumn[] | undefined, catalog: Catalog, onHome: boolean): NavColumn[] {
  return (columns ?? []).map((col) => {
    if (col._type === "catalogNavColumn" && col.category) {
      const categoryId = col.category._ref;
      return {
        title: col.title || catalog.category(categoryId)?.title,
        ...catalog.categoryLink(categoryId, onHome),
        items: catalog.itemsOf(categoryId).map((it) => ({ title: it.title, meta: it.meta, ...catalog.link(it, onHome) })),
      };
    }
    return { title: col.title, href: col.href, items: col.items ?? [] };
  });
}

function header(site: RawSite, page: RawPage, catalog: Catalog, onHome: boolean): HeaderConfig {
  const h = site.header ?? {};
  const variant = page.header ?? "compact";
  if (variant === "full") {
    const first = page.sections?.[0]?.anchor;
    return {
      homeHref: onHome && first ? `#${first}` : "/",
      nav: (h.nav ?? []).map((m) => ({
        id: m.id,
        label: m.label,
        blurb: m.blurb,
        layout: m.layout ?? "mega",
        columns: navColumns(m.columns, catalog, onHome),
      })),
      cta: h.cta,
      pulse: true,
    };
  }
  if (variant === "minimal") {
    return { homeHref: "/", links: [{ label: h.minimalBackLabel || h.backLabel || "←", href: "/" }], wordmarkOnly: true };
  }
  return { homeHref: "/", links: h.backLabel ? [{ label: h.backLabel, href: "/" }] : [], cta: h.pageCta };
}

function footer(site: RawSite, page: RawPage, catalog: Catalog, onHome: boolean): FooterConfig {
  const f = site.footer ?? {};
  const legalPath = f.legalPath ?? undefined;
  const common: FooterConfig = {
    bottomText: f.bottomText ?? "",
    legal: f.legalLabel && legalPath != null ? { label: f.legalLabel, href: pageHref(legalPath) } : undefined,
    legalIsCurrent: legalPath != null && page.path === legalPath,
  };
  if (page.footer !== "full") return common;
  return {
    ...common,
    tagline: f.tagline,
    columns: navColumns(f.columns, catalog, onHome).map((c) => ({ title: c.title, items: c.items })),
  };
}

function logo(site: RawSite): LogoConfig {
  const l = site.logo;
  return {
    label: l.label,
    wordmark: l.wordmark?.length ? l.wordmark : [{ text: site.name }],
    mark: l.mark === "rings" ? { type: "rings" } : undefined,
    image: l.image?.asset ? { src: imageUrl(l.image, 400)!, alt: l.image.alt || site.name } : undefined,
  };
}

async function fetchSite(slug: string, preview: boolean): Promise<SiteDefinition> {
  const client = contentClient(sanityClient, preview);
  const site = await client.fetch<RawSite | null>(SITE_QUERY, { slug });
  if (!site) throw new Error(`No "site" document with slug "${slug}" in Sanity (SITE_SLUG).`);

  const params = { siteId: site._id };
  const [pages, categories, items] = await Promise.all([
    client.fetch<RawPage[]>(PAGES_QUERY, params),
    client.fetch<RawCategory[]>(CATEGORIES_QUERY, params),
    client.fetch<RawItem[]>(ITEMS_QUERY, params),
  ]);
  const home = pages.find((p) => p.path === "");
  const catalog = new Catalog(categories, items, home?.sections ?? []);

  const pageDefinitions: PageDefinition[] = pages.map((page) => {
    const onHome = page.path === "";
    return {
      path: page.path,
      seo: {
        title: page.seo?.title || site.seo?.title || site.name,
        description: page.seo?.description || site.seo?.description,
        image: imageUrl(page.seo?.ogImage ?? site.seo?.ogImage, 1200, 630),
        noIndex: page.seo?.noIndex === true,
      },
      header: header(site, page, catalog, onHome),
      footer: footer(site, page, catalog, onHome),
      blocks: (page.sections ?? [])
        .map((s) => {
          const block = mapSection(s, { catalog, onHome });
          if (block && preview) block.editAttr = sectionEditAttr(page._id, s._key);
          return block;
        })
        .filter((b): b is Block => !!b),
    };
  });

  return {
    slug: site.slug,
    name: site.name,
    lang: site.lang ?? "es",
    url: site.url,
    theme: site.theme as unknown as Theme,
    logo: logo(site),
    // No tracking on the preview site (editors are not visitors).
    analytics: {
      gtmId: isPreviewSite ? undefined : site.analytics?.gtmId || import.meta.env.PUBLIC_GTM_ID,
      ga4Id: isPreviewSite ? undefined : site.analytics?.ga4Id || import.meta.env.PUBLIC_GA4_ID,
      loading: site.analytics?.loading,
      maxDelaySeconds: site.analytics?.maxDelay,
    },
    scripts: (isPreviewSite ? [] : (site.scripts ?? [])).map((s) => ({
      src: s.src,
      attributes: Object.fromEntries((s.attributes ?? []).map((a) => [a.name, a.value ?? ""])),
    })),
    allowAiCrawlers: site.allowAiCrawlers !== false,
    pages: pageDefinitions,
    redirects: site.redirects ?? [],
    verificationFiles: site.verificationFiles ?? [],
  };
}

let cached: Promise<SiteDefinition> | undefined;

/**
 * Loads the microsite named by SITE_SLUG from Sanity: once per build for the public site,
 * on every request in dev and on the preview site (content changes without rebuilding).
 * `preview` reads drafts and adds the visual-editing markers.
 */
export function getSite({ preview = false } = {}): Promise<SiteDefinition> {
  const slug = import.meta.env.SITE_SLUG;
  if (!slug) throw new Error("Missing SITE_SLUG. Set it in apps/web/.env.");
  // Static port of a new microsite (content in code, before its Sanity schemas exist).
  if (import.meta.env.SITE_LOCAL_DATA === "true") return import("../../sites/local").then((m) => m.getLocalSite(slug));
  // Editorial sites (news + registry) have their own content model.
  const load =
    import.meta.env.SITE_TEMPLATE === "editorial"
      ? (s: string, p: boolean) => import("./editorial/site").then((m) => m.fetchEditorialSite(s, p))
      : fetchSite;
  if (import.meta.env.DEV || isPreviewSite) return load(slug, preview);
  cached ??= load(slug, false);
  return cached;
}
