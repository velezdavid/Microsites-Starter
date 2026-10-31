import type { EditorialBlock } from "@microsites/ui/editorial";
import { ARTICLES_BY_DATE, MOST_READ, MOVEMENTS, SECTIONS, teaser, type Article } from "./content";
import { newsletterBlock } from "./shared";

export interface ListingPage {
  /** Path without leading slash. */
  path: string;
  title: string;
  blocks: EditorialBlock[];
}

const BASE = "actualidad";
const pagePath = (section: string | undefined, n: number) =>
  [BASE, section, n > 1 ? `pagina/${n}` : undefined].filter(Boolean).join("/");

/** Sidebar shared by the listing and the article pages. */
export const mostReadBlock = (): EditorialBlock => ({
  _type: "edArticleList",
  label: "Lo más leído",
  items: MOST_READ.map((slug) => teaser(slug)),
});

/**
 * Actualidad listing: "Todo" plus one listing per section, each paginated.
 * Page 1 opens with a lead story and two secondary ones; the rest go to the grid.
 */
export function actualidadPages(): ListingPage[] {
  const listings: { section?: (typeof SECTIONS)[number]; articles: Article[]; grid: number }[] = [
    { articles: ARTICLES_BY_DATE, grid: 9 },
    ...SECTIONS.map((section) => ({ section, articles: ARTICLES_BY_DATE.filter((a) => section.types.includes(a.type)), grid: 6 })),
  ];

  return listings.flatMap(({ section, articles, grid }) => {
    const first = 3 + grid;
    const perPage = 3 + grid;
    const total = Math.max(1, 1 + Math.ceil(Math.max(0, articles.length - first) / perPage));
    const tabs = [{ label: "Todo", slug: undefined as string | undefined }, ...SECTIONS.map((s) => ({ label: s.label, slug: s.slug }))].map(
      (t) => ({ label: t.label, href: `/${pagePath(t.slug, 1)}`, current: t.slug === section?.slug }),
    );

    return Array.from({ length: total }, (_, i) => {
      const n = i + 1;
      const slice = n === 1 ? articles.slice(0, first) : articles.slice(first + (n - 2) * perPage, first + (n - 1) * perPage);
      const [lead, ...rest] = slice;
      const opening = n === 1 && lead ? rest.slice(0, 2) : [];
      const gridItems = n === 1 ? rest.slice(2) : slice;
      const pages = Array.from({ length: total }, (_, j) => ({ label: String(j + 1), href: `/${pagePath(section?.slug, j + 1)}`, current: j + 1 === n }));

      const blocks: EditorialBlock[] = [
        {
          _type: "edPageIntro",
          eyebrow: "Sección",
          title: "Actualidad",
          text: "Noticias, entrevistas, opinión y casos sobre las empresas reconocidas en Ecuador y quienes las dirigen.",
          tabs,
        },
      ];
      if (n === 1 && lead) {
        blocks.push({
          _type: "edColumns",
          spaceTop: 40,
          dividers: true,
          columns: [
            {
              width: "8fr",
              blocks: [
                { _type: "edArticleCard", variant: "lead", showImage: true, headingLevel: 2, article: teaser(lead.slug, { dek: true, author: true, date: true, readTime: true }) },
              ],
            },
            {
              width: "4fr",
              blocks: [{ _type: "edArticleGrid", columns: 1, showImage: true, gap: 28, headingLevel: 2, items: opening.map((a) => teaser(a.slug, { dek: true, date: true })) }],
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
                  items: gridItems.map((a) => teaser(a.slug, { dek: true, author: true, date: true })),
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
              blocks: [mostReadBlock(), { _type: "edMovementList", title: "Movimientos", items: MOVEMENTS }],
            },
          ],
        },
        { ...newsletterBlock("Cada lunes: premios, rankings, eventos y las noticias de actualidad de las empresas en Ecuador."), spaceTop: 80 },
      );

      const title = `ranking.ec · ${section ? `${section.label} · ` : ""}Actualidad${n > 1 ? ` · Página ${n}` : ""}`;
      return { path: pagePath(section?.slug, n), title, blocks };
    });
  });
}
