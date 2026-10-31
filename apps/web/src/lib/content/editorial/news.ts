import type { EditorialBlock } from "@microsites/ui/editorial";
import { featureBody, standardBody } from "./body";
import { ARTICLE_TYPE_LABEL, articleHref, shortDate, type Article, type EditorialContent } from "./content";
import { mostReadBlock, newsletterBlock, type ListingPage } from "./shared";

const BASE = "actualidad";
const pagePath = (section: string | undefined, n: number) => [BASE, section, n > 1 ? `pagina/${n}` : undefined].filter(Boolean).join("/");

// Topics have no pages yet: they link to the Actualidad listing.
const topicHref = (_slug: string) => "/actualidad";

const sectionsOf = (c: EditorialContent) => c.settings.sections ?? [];
const sectionOf = (c: EditorialContent, type: string) => sectionsOf(c).find((s) => s.types.includes(type));

/**
 * Actualidad listing: "Todo" plus one listing per section, each paginated.
 * Page 1 opens with a lead story and two secondary ones; the rest go to the grid.
 */
export function actualidadPages(c: EditorialContent, siteName: string): ListingPage[] {
  const hub = c.settings.actualidad;
  const sections = sectionsOf(c);
  const listings: { section?: (typeof sections)[number]; articles: Article[]; grid: number }[] = [
    { articles: c.articlesByDate, grid: 9 },
    ...sections.map((section) => ({ section, articles: c.articlesByDate.filter((a) => section.types.includes(a.type)), grid: 6 })),
  ];

  return listings.flatMap(({ section, articles, grid }) => {
    const first = 3 + grid;
    const perPage = 3 + grid;
    const total = Math.max(1, 1 + Math.ceil(Math.max(0, articles.length - first) / perPage));
    const tabs = [{ label: "Todo", slug: undefined as string | undefined }, ...sections.map((s) => ({ label: s.label, slug: s.slug }))].map((t) => ({
      label: t.label,
      href: `/${pagePath(t.slug, 1)}`,
      current: t.slug === section?.slug,
    }));

    return Array.from({ length: total }, (_, i) => {
      const n = i + 1;
      const slice = n === 1 ? articles.slice(0, first) : articles.slice(first + (n - 2) * perPage, first + (n - 1) * perPage);
      const [lead, ...rest] = slice;
      const opening = n === 1 && lead ? rest.slice(0, 2) : [];
      const gridItems = n === 1 ? rest.slice(2) : slice;
      const pages = Array.from({ length: total }, (_, j) => ({ label: String(j + 1), href: `/${pagePath(section?.slug, j + 1)}`, current: j + 1 === n }));

      const blocks: EditorialBlock[] = [
        { _type: "edPageIntro", eyebrow: hub?.eyebrow ?? "", title: hub?.title?.join(" ") || "Actualidad", text: hub?.text ?? "", tabs },
      ];
      if (n === 1 && lead) {
        blocks.push({
          _type: "edColumns",
          spaceTop: 40,
          dividers: true,
          columns: [
            {
              width: "8fr",
              blocks: [{ _type: "edArticleCard", variant: "lead", showImage: true, headingLevel: 2, article: c.teaser(lead, { dek: true, author: true, date: true, readTime: true }) }],
            },
            {
              width: "4fr",
              blocks: [{ _type: "edArticleGrid", columns: 1, showImage: true, gap: 28, headingLevel: 2, items: opening.map((a) => c.teaser(a, { dek: true, date: true })) }],
            },
          ],
        });
      }
      blocks.push(
        {
          _type: "edColumns",
          spaceTop: n === 1 ? 64 : 40,
          dividers: true,
          alignTop: true,
          gap: "clamp(20px,3.75vw,48px)",
          columns: [
            {
              width: "1fr",
              blocks: [
                {
                  _type: "edArticleGrid",
                  columns: 3,
                  gap: "36px 28px",
                  itemBorder: true,
                  label: section ? `Más ${section.label}` : "Más de actualidad",
                  note: `Página ${n} de ${total}`,
                  empty: "Más publicaciones de este tipo en las próximas semanas.",
                  items: gridItems.map((a) => c.teaser(a, { dek: true, author: true, date: true })),
                },
                {
                  _type: "edPagination",
                  pages,
                  prev: n > 1 ? { label: "Anteriores", href: `/${pagePath(section?.slug, n - 1)}` } : undefined,
                  next: n < total ? { label: "Siguientes", href: `/${pagePath(section?.slug, n + 1)}` } : undefined,
                  prevLabel: "← Anteriores",
                  nextLabel: "Siguientes →",
                },
              ],
            },
            {
              width: "300px",
              aside: true,
              gap: "clamp(20px,3.44vw,44px)",
              blocks: [mostReadBlock(c), { _type: "edMovementList", title: "Movimientos", items: c.movements.slice(0, 4) }],
            },
          ],
        },
        { ...newsletterBlock(c, hub?.newsletterText), spaceTop: 80 },
      );

      const title = `${siteName} · ${section ? `${section.label} · ` : ""}Actualidad${n > 1 ? ` · Página ${n}` : ""}`;
      return { path: pagePath(section?.slug, n), title, blocks, section: "/actualidad" };
    });
  });
}

/** One page per article, at /actualidad/<slug>. */
export function articlePages(c: EditorialContent, siteName: string, siteUrl: string): ListingPage[] {
  const newsText = c.settings.actualidad?.newsletterText;
  return c.articlesByDate.map((a) => {
    const section = sectionOf(c, a.type);
    const typeLabel = ARTICLE_TYPE_LABEL[a.type] ?? a.type;
    const eyebrow = a.kicker.toLowerCase() === typeLabel.toLowerCase() ? typeLabel : `${typeLabel} · ${a.kicker}`;
    const related = c.articlesByDate.filter((r) => r !== a).slice(0, 4);
    const readMore: EditorialBlock = {
      _type: "edColumns",
      columns: [
        {
          gap: 24,
          blocks: [
            { _type: "edSectionHeader", title: "Seguir leyendo", more: { label: "Ver todo", href: "/actualidad" } },
            {
              _type: "edArticleGrid",
              columns: 4,
              gap: 24,
              itemRule: true,
              rulePadding: 16,
              items: related.map((r) => ({ ...c.teaser(r), date: shortDate(r.date) })),
            },
          ],
        },
      ],
    };
    const shareUrl = new URL(articleHref(a.slug), siteUrl).href;
    const path = `actualidad/${a.slug}`;
    const description = a.dek;

    // Long-form layout: full-bleed photo and a centered column.
    if (a.feature) {
      return {
        path,
        title: `${siteName} · ${a.sponsored ? "Contenido de marca" : a.title}`,
        description,
        section: "/actualidad",
        blocks: [
          {
            _type: "edFeatureArticle",
            image: { label: a.image?.label ?? "Foto principal", caption: a.image?.caption, credit: a.image?.credit, src: a.image?.src, alt: a.image?.alt },
            eyebrow: a.kicker,
            title: a.title,
            highlight: a.highlight,
            dek: a.dek ?? "",
            author: a.author,
            meta: [a.photoCredit, shortDate(a.date), a.readTime].filter(Boolean).join(" · "),
            shareUrl,
            body: featureBody(c, a),
          },
          { ...readMore, spaceTop: 72 } as EditorialBlock,
          newsletterBlock(c),
        ],
      };
    }

    const mentions = a.mentions.map((id) => c.mention(id)).filter((m) => !!m);
    const blocks: EditorialBlock[] = [
      {
        _type: "edBreadcrumb",
        items: [{ label: "Inicio", href: "/" }, { label: "Actualidad", href: "/actualidad" }, section ? { label: section.label, href: `/actualidad/${section.slug}` } : { label: typeLabel }],
      },
      {
        _type: "edArticleHeader",
        eyebrow,
        title: a.title,
        highlight: a.highlight,
        dek: a.dek,
        author: a.author,
        meta: [a.place, shortDate(a.date), a.readTime && `${a.readTime} de lectura`].filter(Boolean).join(" · "),
        shareUrl,
      },
      { _type: "edFigure", image: a.image ?? { label: "Foto principal" } },
      {
        _type: "edArticleBody",
        keyFacts: a.keyFacts && { title: "Datos clave", items: a.keyFacts },
        body: standardBody(c, a),
        tags: a.topics.length ? { title: "Temas", items: a.topics.map((t) => ({ label: t.title, href: topicHref(t.slug) })) } : undefined,
        aside: [mostReadBlock(c)],
      },
    ];
    if (mentions.length) blocks.push({ _type: "edMentions", eyebrow: "En el registro", title: "Mencionados en esta nota", items: mentions });
    blocks.push(readMore, newsletterBlock(c, newsText));

    return { path, title: `${siteName} · ${a.title}`, description, blocks, section: "/actualidad" };
  });
}
