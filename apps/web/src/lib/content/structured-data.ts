import type { HeroBlock } from "@microsites/ui";
import { pageHref, type PageDefinition, type SiteDefinition } from "./types";

/**
 * Schema.org graph for a page (rendered as JSON-LD): Organization + WebSite + WebPage,
 * plus a BreadcrumbList when the page hero has breadcrumbs. Built only from existing content.
 */
export function structuredData(site: SiteDefinition, page: PageDefinition): object {
  const abs = (href: string) => new URL(href, site.url).href;
  const siteUrl = abs("/");
  const pageUrl = abs(pageHref(page.path));
  const ids = {
    organization: `${siteUrl}#organization`,
    website: `${siteUrl}#website`,
    webpage: `${pageUrl}#webpage`,
    breadcrumb: `${pageUrl}#breadcrumb`,
  };

  const hero = page.blocks.find((b): b is HeroBlock => b._type === "hero");
  const crumbs = hero?.breadcrumb ?? [];

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": ids.organization,
      name: site.name,
      url: siteUrl,
      ...(site.logo.image ? { logo: site.logo.image.src } : {}),
    },
    {
      "@type": "WebSite",
      "@id": ids.website,
      url: siteUrl,
      name: site.name,
      inLanguage: site.lang,
      publisher: { "@id": ids.organization },
    },
    {
      "@type": "WebPage",
      "@id": ids.webpage,
      url: pageUrl,
      name: page.seo.title,
      ...(page.seo.description ? { description: page.seo.description } : {}),
      ...(page.seo.image ? { primaryImageOfPage: { "@type": "ImageObject", url: page.seo.image } } : {}),
      inLanguage: site.lang,
      isPartOf: { "@id": ids.website },
      about: { "@id": ids.organization },
      ...(crumbs.length ? { breadcrumb: { "@id": ids.breadcrumb } } : {}),
    },
  ];

  if (crumbs.length) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": ids.breadcrumb,
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.label,
        // The last crumb is the current page.
        item: i === crumbs.length - 1 ? pageUrl : abs(c.href ?? "/"),
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
