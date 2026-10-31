import type { EditorialBlock } from "@microsites/ui/editorial";
import { article, articleHref, MERCO_TOP5, OPEN_CALLS, OPINION_AUTHORS, PUBLISHED_RESULTS, teaser, UPCOMING_GALAS } from "./content";
import { newsletterBlock } from "./shared";

/** Home page ("Portada") of ranking.ec, composed like the prototype. */
export function homeBlocks(): EditorialBlock[] {
  const opinion = ["demasiados-premios-pocos-criterios", "lo-que-un-ranking-de-reputacion-no-puede-medir", "por-que-publicamos-la-metodologia"].map(
    (slug) => {
      const a = article(slug);
      return { author: a.author, title: a.title, role: OPINION_AUTHORS[a.author] ?? "", href: articleHref(a.slug) };
    },
  );

  return [
    // Opening: lead story + two secondary stories.
    {
      _type: "edColumns",
      spaceTop: 40,
      dividers: true,
      columns: [
        {
          width: "8fr",
          blocks: [
            {
              _type: "edArticleCard",
              variant: "lead",
              showImage: true,
              article: teaser("quito-suma-tres-de-los-cinco-mejores-restaurantes-summum", { dek: true, author: true, date: true, readTime: true }),
            },
          ],
        },
        {
          width: "4fr",
          blocks: [
            {
              _type: "edArticleGrid",
              columns: 1,
              showImage: true,
              gap: 28,
              items: [
                teaser("premios-verdes-2026-doce-proyectos-llegan-a-la-final", { dek: true }),
                teaser("merco-empresas-la-banca-recupera-tres-puestos", { dek: true }),
              ],
            },
          ],
        },
      ],
    },
    // News row.
    {
      _type: "edColumns",
      spaceTop: 48,
      columns: [
        {
          blocks: [
            {
              _type: "edArticleGrid",
              columns: 4,
              rule: "ink",
              dividers: true,
              items: [
                "great-place-to-work-lista-2026-once-empresas-debutan",
                "summum-reconocen-restaurante-de-galapagos",
                "abren-inscripciones-premio-nacional-a-la-calidad",
                "guayaquil-y-cuenca-concentran-galardones-a-la-gestion",
              ].map((slug) => teaser(slug, { dek: true, date: true })),
            },
          ],
        },
      ],
    },
    // The registry this week.
    {
      _type: "edColumns",
      band: true,
      spaceTop: 64,
      columns: [
        {
          gap: 32,
          blocks: [
            { _type: "edSectionHeader", title: "El registro esta semana", more: { label: "Ir a Rankings", href: "/rankings" } },
            {
              _type: "edColumns",
              gap: 40,
              columns: [
                { width: "1.15fr", gap: 0, blocks: [{ _type: "edResultList", title: "Resultados publicados", items: PUBLISHED_RESULTS }] },
                {
                  gap: 0,
                  blocks: [
                    {
                      _type: "edRankingSnapshot",
                      title: "Merco Empresas 2026",
                      note: "vs. 2025",
                      rows: MERCO_TOP5,
                      more: { label: "Ver las 100 empresas", href: "/rankings/merco-empresas/2026" },
                    },
                  ],
                },
                {
                  gap: 0,
                  blocks: [
                    {
                      _type: "edDeadlineList",
                      title: "Convocatorias abiertas",
                      items: OPEN_CALLS,
                      more: { label: "Calendario de eventos", href: "/eventos" },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // Interviews + most read.
    {
      _type: "edColumns",
      spaceTop: 64,
      dividers: true,
      gap: 36,
      columns: [
        {
          width: "2fr",
          blocks: [
            { _type: "edSectionHeader", title: "Entrevistas", more: { label: "Ver todo", href: "/actualidad/entrevistas" } },
            {
              _type: "edArticleCard",
              variant: "horizontal",
              showImage: true,
              article: teaser("un-reconocimiento-sirve-si-cambia-algo-dentro-de-la-empresa", { dek: true, author: true, date: true }),
            },
            {
              _type: "edArticleGrid",
              variant: "compact",
              columns: 2,
              rule: "line",
              gap: 28,
              items: ["la-chef-detras-del-mejor-restaurante-del-pais", "el-jurado-del-premio-a-la-calidad-explica-que-cambio"].map((slug) =>
                teaser(slug, { author: true }),
              ),
            },
          ],
        },
        {
          width: "1fr",
          gap: 22,
          blocks: [
            { _type: "edSectionHeader", title: "Más leídos", size: "sm" },
            {
              _type: "edArticleList",
              variant: "ranked",
              items: [
                "las-10-empresas-con-mejor-reputacion-2026",
                "todos-los-ganadores-premios-summum-2026",
                "lista-completa-mejores-empresas-para-trabajar",
                "cuanto-cuesta-postular-a-un-premio-empresarial",
                "calendario-de-premios-y-rankings-2027",
              ].map((slug) => teaser(slug)),
            },
          ],
        },
      ],
    },
    // Events · opinion · reports.
    {
      _type: "edColumns",
      autoFit: true,
      gap: 40,
      columns: [
        {
          gap: 8,
          blocks: [
            { _type: "edSectionHeader", title: "Próximos eventos", size: "sm", more: { label: "Ver todo", href: "/eventos" } },
            { _type: "edEventList", items: UPCOMING_GALAS },
          ],
        },
        {
          gap: 8,
          blocks: [
            { _type: "edSectionHeader", title: "Opinión", size: "sm", more: { label: "Ver todo", href: "/actualidad/opinion" } },
            { _type: "edOpinionList", items: opinion },
          ],
        },
        {
          gap: 20,
          blocks: [
            { _type: "edSectionHeader", title: "Informes", size: "sm", more: { label: "Ver todo", href: "/actualidad/informes" } },
            { _type: "edArticleCard", showImage: true, article: teaser("mapa-de-galardones-2026", { dek: true }) },
          ],
        },
      ],
    },
    // Analysis.
    {
      _type: "edColumns",
      columns: [
        {
          blocks: [
            { _type: "edSectionHeader", title: "Análisis", more: { label: "Ver todo", href: "/actualidad" } },
            {
              _type: "edArticleGrid",
              variant: "large",
              columns: 3,
              itemRule: true,
              items: [
                "premios-pagados-y-premios-con-jurado",
                "diez-anos-de-rankings-corporativos",
                "certificaciones-de-sostenibilidad-con-auditoria-externa",
              ].map((slug) => teaser(slug, { author: true, date: true })),
            },
          ],
        },
      ],
    },
    newsletterBlock("Cada lunes: premios, rankings, eventos y convocatorias de las empresas en Ecuador."),
  ];
}
