/**
 * Editorial sites (SITE_TEMPLATE=editorial): news + registry from Sanity, rendered with the editorial kit.
 * The site document gives brand, theme, SEO and analytics; editorialSettings the masthead, footer and texts.
 */
import { createImageUrlBuilder } from "@sanity/image-url";
import type { Theme } from "@microsites/ui";
import type { EdFooterConfig, MastheadConfig } from "@microsites/ui/editorial";
import { sanityClient } from "sanity:client";
import { contentClient, isPreviewSite } from "../preview";
import { SITE_QUERY, type RawSite } from "../queries";
import type { PageDefinition, SiteDefinition } from "../types";
import { agendaPage, calendarFiles, eventPages } from "./agenda";
import { EditorialContent, type ImageUrl } from "./content";
import { directoryPage, organizationPages } from "./directory";
import { homeBlocks } from "./home";
import { editorialPages, newsletterPage } from "./institutional";
import { actualidadPages, articlePages } from "./news";
import { EDITORIAL_QUERY, type RawEditorial, type RawSvg } from "./queries";
import { awardPages, editionPages, rankingsHub } from "./rankings";
import type { ListingPage } from "./shared";

const imageBuilder = createImageUrlBuilder(sanityClient);
const imageUrl: ImageUrl = (image, width, height) => {
  if (!image?.asset) return undefined;
  const img = imageBuilder.image(image).width(width).auto("format");
  return (height ? img.height(height).fit("crop") : img).url();
};

type SiteFile = NonNullable<SiteDefinition["files"]>[number];

/**
 * Logo at a fixed width, keeping the file's aspect ratio. SVG logos are copied to the site root
 * (named after their content hash, cached as immutable): the masthead logo is often the LCP element,
 * and a same-origin file avoids opening a connection to the image CDN.
 */
async function logoAt(svg: RawSvg | undefined | null, width: number, alt: string, where: string, files: SiteFile[]) {
  if (!svg?.url) throw new Error(`Editorial site without ${where} (upload it in the Studio).`);
  const ratio = svg.dimensions ? svg.dimensions.width / svg.dimensions.height : 6;
  let src = svg.url;
  const hash = svg.url.match(/\/([0-9a-f]{12,})-\d+x\d+\.svg$/)?.[1];
  if (hash) {
    const res = await fetch(svg.url);
    if (!res.ok) throw new Error(`Could not download the logo ${svg.url} (${res.status}).`);
    const filename = `brand-${hash.slice(0, 12)}.svg`;
    if (!files.some((f) => f.filename === filename)) files.push({ filename, content: await res.text(), contentType: "image/svg+xml" });
    src = `/${filename}`;
  }
  return { src, alt: svg.alt || alt, width, height: Math.round(width / ratio) };
}

const LOGO_SVG_QUERY = /* groq */ `*[_type == "site" && _id == $siteId][0].logo.image{alt, "url": asset->url, "dimensions": asset->metadata.dimensions}`;

export async function fetchEditorialSite(slug: string, preview: boolean): Promise<SiteDefinition> {
  const client = contentClient(sanityClient, preview);
  const site = await client.fetch<RawSite | null>(SITE_QUERY, { slug });
  if (!site) throw new Error(`No "site" document with slug "${slug}" in Sanity (SITE_SLUG).`);
  const [raw, logoSvg] = await Promise.all([
    client.fetch<RawEditorial>(EDITORIAL_QUERY, { siteId: site._id }),
    client.fetch<RawSvg | null>(LOGO_SVG_QUERY, { siteId: site._id }),
  ]);
  if (!raw.settings) throw new Error(`Site "${slug}" has no editorialSettings document (required by SITE_TEMPLATE=editorial).`);

  const c = new EditorialContent(raw, imageUrl);
  const s = c.settings;
  const name = site.name;
  const description = site.seo?.description;
  const ogImage = imageUrl(site.seo?.ogImage, 1200, 630);

  const page = (p: ListingPage): PageDefinition => ({
    path: p.path,
    seo: { title: p.title, description: p.description || description, image: ogImage, noIndex: p.noIndex === true },
    header: { homeHref: "/" },
    footer: { bottomText: "" },
    blocks: [],
    editorial: { blocks: p.blocks, section: p.section, flushFooter: p.flushFooter },
  });

  const pages: ListingPage[] = [
    { path: "", title: site.seo?.title ? `${site.seo.title} · Portada` : name, blocks: homeBlocks(c) },
    ...actualidadPages(c, name),
    ...articlePages(c, name, site.url),
    rankingsHub(c, name),
    ...awardPages(c, name),
    ...editionPages(c, name),
    directoryPage(c, name),
    ...organizationPages(c, name),
    agendaPage(c, name),
    ...eventPages(c, name),
    newsletterPage(c, name),
    ...editorialPages(c, name),
  ];

  const brandFiles: SiteFile[] = [];
  const masthead: MastheadConfig = {
    homeHref: "/",
    locale: s.masthead?.locale ?? "",
    logo: await logoAt(logoSvg, 270, site.logo.label, "logo image (Configuración → Marca)", brandFiles),
    nav: s.masthead?.nav ?? [],
  };
  const footer: EdFooterConfig = {
    logo: await logoAt(s.footer?.logo, 170, site.logo.label, "footer logo (Ajustes editoriales → Pie)", brandFiles),
    tagline: s.footer?.tagline ?? "",
    columns: (s.footer?.columns ?? []).map((col) => ({ title: col.title, links: col.links ?? [] })),
    bottomLeft: s.footer?.bottomLeft ?? "",
    bottomRight: s.footer?.bottomRight ?? "",
  };

  return {
    slug: site.slug,
    name,
    lang: site.lang ?? "es",
    url: site.url,
    theme: site.theme as unknown as Theme,
    logo: { label: site.logo.label, wordmark: site.logo.wordmark?.length ? site.logo.wordmark : [{ text: name }] },
    // No tracking on the preview site (editors are not visitors).
    analytics: {
      gtmId: isPreviewSite ? undefined : site.analytics?.gtmId || import.meta.env.PUBLIC_GTM_ID,
      ga4Id: isPreviewSite ? undefined : site.analytics?.ga4Id || import.meta.env.PUBLIC_GA4_ID,
      loading: site.analytics?.loading,
      maxDelaySeconds: site.analytics?.maxDelay,
    },
    scripts: (isPreviewSite ? [] : (site.scripts ?? [])).map((x) => ({
      src: x.src,
      attributes: Object.fromEntries((x.attributes ?? []).map((a) => [a.name, a.value ?? ""])),
    })),
    allowAiCrawlers: site.allowAiCrawlers !== false,
    pages: pages.map(page),
    redirects: site.redirects ?? [],
    verificationFiles: site.verificationFiles ?? [],
    files: [...calendarFiles(c, name, site.url), ...brandFiles],
    editorial: { masthead, footer },
  };
}
