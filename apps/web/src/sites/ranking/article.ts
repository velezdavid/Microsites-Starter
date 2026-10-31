import type { ArticleBodyNode, EditorialBlock } from "@microsites/ui/editorial";
import { mostReadBlock, type ListingPage } from "./actualidad";
import { ARTICLES, ARTICLES_BY_DATE, articleHref, sectionOf, shortDate, teaser, TYPE_LABEL, type Article } from "./content";
import { newsletterBlock } from "./shared";

// Topics have no pages yet: they link to the Actualidad listing.
const topicHref = (_topic: string) => "/actualidad";

/** Sample body for articles whose full text is not in the prototype. */
const sampleBody = (a: Article): ArticleBodyNode[] => [
  ...(a.dek ? [{ _type: "p" as const, text: a.dek }] : []),
  { _type: "p", text: "Texto de ejemplo. El contenido completo de esta nota se cargará desde el Studio en la etapa 3." },
];

/** One page per article, at /actualidad/<slug>. */
export function articlePages(siteUrl: string): ListingPage[] {
  return ARTICLES.map((a) => {
    const section = sectionOf(a.type);
    const typeLabel = TYPE_LABEL[a.type];
    const eyebrow = a.kicker.toLowerCase() === typeLabel.toLowerCase() ? typeLabel : `${typeLabel} · ${a.kicker}`;
    const related = ARTICLES_BY_DATE.filter((r) => r.slug !== a.slug).slice(0, 4);
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
              items: related.map((r) => ({ ...teaser(r.slug), date: shortDate(r.date) })),
            },
          ],
        },
      ],
    };
    const shareUrl = new URL(articleHref(a.slug), siteUrl).href;

    // Long-form layout: full-bleed photo and a centered column.
    if (a.feature) {
      return {
        path: `actualidad/${a.slug}`,
        title: `ranking.ec · ${a.sponsored ? "Contenido de marca" : a.title}`,
        blocks: [
          {
            _type: "edFeatureArticle",
            image: { label: a.image?.label ?? "Foto principal", caption: a.image?.caption, credit: a.image?.credit },
            eyebrow: a.kicker,
            title: a.title,
            highlight: a.highlight,
            dek: a.dek ?? "",
            author: a.author,
            meta: [a.feature.photoCredit, shortDate(a.date), a.readTime].filter(Boolean).join(" · "),
            shareUrl,
            body: a.feature.body,
          },
          { ...readMore, spaceTop: 72 } as EditorialBlock,
          newsletterBlock("Cada lunes: premios, rankings, eventos y convocatorias de las empresas en Ecuador."),
        ],
      };
    }

    const blocks: EditorialBlock[] = [
      {
        _type: "edBreadcrumb",
        items: [
          { label: "Inicio", href: "/" },
          { label: "Actualidad", href: "/actualidad" },
          section ? { label: section.label, href: `/actualidad/${section.slug}` } : { label: typeLabel },
        ],
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
        body: a.body ?? sampleBody(a),
        tags: a.topics && { title: "Temas", items: a.topics.map((t) => ({ label: t, href: topicHref(t) })) },
        aside: [mostReadBlock()],
      },
    ];
    if (a.mentions?.length) {
      blocks.push({ _type: "edMentions", eyebrow: "En el registro", title: "Mencionados en esta nota", items: a.mentions });
    }
    blocks.push(
      readMore,
      newsletterBlock("Cada lunes: premios, rankings, eventos y las noticias de actualidad de las empresas en Ecuador."),
    );

    return { path: `actualidad/${a.slug}`, title: `ranking.ec · ${a.title}`, blocks };
  });
}
