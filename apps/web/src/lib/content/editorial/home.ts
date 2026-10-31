import type { EditorialBlock } from "@microsites/ui/editorial";
import { articleHref, editionHref, eventHref, parts, type Article, type EditorialContent, type EventRecord } from "./content";
import { newsletterBlock } from "./shared";

const MONTHS_SHORT = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/** Calendar item of an event ("12 Nov · name · city · venue"). */
export const eventItem = (e: EventRecord) => {
  const { d, m } = parts(e.date);
  return { day: String(d).padStart(2, "0"), month: MONTHS_SHORT[m - 1], name: e.name, place: `${e.city} · ${e.venue}`, href: e.hasPage ? eventHref(e.slug) : "/eventos" };
};

/** Front page ("Portada"): curated slots from the front page document, the latest articles where they are empty. */
export function homeBlocks(c: EditorialContent): EditorialBlock[] {
  const f = c.front;
  const all = c.articlesByDate;
  const lead = c.articleById(f.lead) ?? all[0];
  const secondary = c.curated(f.secondary, () => all.filter((a) => a !== lead), 2);
  const used = new Set<Article>([lead, ...secondary].filter(Boolean));
  const newsRow = c.curated(f.newsRow, () => c.latestOfType(["noticia"]).filter((a) => !used.has(a)), 4);
  const interviews = c.curated(f.interviews, () => c.latestOfType(["entrevista"]), 3);
  const report = c.articleById(f.report) ?? c.latestOfType(["informe"])[0];
  const analysis = c.curated(f.analysis, () => c.latestOfType(["analisis", "datos"]), 3);
  const opinion = c.curated(f.opinion, () => c.latestOfType(["opinion"]), 3);
  const mostRead = c.curated(f.mostRead, () => all, 5);
  const snapshot = c.editionById(f.featuredEdition) ?? c.editionsByDate.find((e) => e.results.filter((r) => r.position).length >= 5);
  const galas = c.upcomingEvents.filter((e) => e.type === "gala").slice(0, 3);

  const blocks: EditorialBlock[] = [];
  if (lead) {
    // Opening: lead story + two secondary stories.
    blocks.push({
      _type: "edColumns",
      spaceTop: 40,
      dividers: true,
      columns: [
        { width: "8fr", blocks: [{ _type: "edArticleCard", variant: "lead", showImage: true, article: c.teaser(lead, { dek: true, author: true, date: true, readTime: true }) }] },
        { width: "4fr", blocks: [{ _type: "edArticleGrid", columns: 1, showImage: true, gap: 28, items: secondary.map((a) => c.teaser(a, { dek: true })) }] },
      ],
    });
  }
  if (newsRow.length) {
    blocks.push({
      _type: "edColumns",
      spaceTop: 48,
      columns: [{ blocks: [{ _type: "edArticleGrid", columns: 4, rule: "ink", dividers: true, items: newsRow.map((a) => c.teaser(a, { dek: true, date: true })) }] }],
    });
  }

  // The registry this week.
  const registry: EditorialBlock[] = [{ _type: "edSectionHeader", title: "El registro esta semana", more: { label: "Ir a Rankings", href: "/rankings" } }];
  const registryColumns = [{ width: "1.15fr", gap: 0, blocks: [{ _type: "edResultList", title: "Resultados publicados", items: c.publishedResults(3) }] as EditorialBlock[] }];
  if (snapshot) {
    const a = c.award(snapshot.award)!;
    registryColumns.push({
      width: "",
      gap: 0,
      blocks: [
        {
          _type: "edRankingSnapshot",
          title: `${a.name} ${snapshot.year}`,
          note: `vs. ${snapshot.year - 1}`,
          rows: snapshot.results
            .filter((r) => r.position)
            .sort((x, y) => x.position! - y.position!)
            .slice(0, 5)
            .map((r) => ({ position: r.position!, name: r.name, change: r.change ?? "" })),
          more: { label: `Ver las ${snapshot.total} ${a.unit}`, href: editionHref(snapshot) },
        },
      ],
    });
  }
  registryColumns.push({
    width: "",
    gap: 0,
    blocks: [{ _type: "edDeadlineList", title: "Convocatorias abiertas", items: c.openCalls.slice(0, 3), more: { label: "Calendario de eventos", href: "/eventos" } }],
  });
  registry.push({ _type: "edColumns", gap: 40, columns: registryColumns.map(({ width, ...col }) => (width ? { width, ...col } : col)) });
  blocks.push({ _type: "edColumns", band: true, spaceTop: 64, columns: [{ gap: 32, blocks: registry }] });

  // Interviews + most read.
  const [mainInterview, ...moreInterviews] = interviews;
  blocks.push({
    _type: "edColumns",
    spaceTop: 64,
    dividers: true,
    gap: 36,
    columns: [
      {
        width: "2fr",
        blocks: [
          { _type: "edSectionHeader", title: "Entrevistas", more: { label: "Ver todo", href: "/actualidad/entrevistas" } },
          ...(mainInterview
            ? ([
                { _type: "edArticleCard", variant: "horizontal", showImage: true, article: c.teaser(mainInterview, { dek: true, author: true, date: true }) },
                { _type: "edArticleGrid", variant: "compact", columns: 2, rule: "line", gap: 28, items: moreInterviews.map((a) => c.teaser(a, { author: true })) },
              ] as EditorialBlock[])
            : []),
        ],
      },
      {
        width: "1fr",
        gap: 22,
        blocks: [
          { _type: "edSectionHeader", title: "Más leídos", size: "sm" },
          { _type: "edArticleList", variant: "ranked", items: mostRead.map((a) => c.teaser(a)) },
        ],
      },
    ],
  });

  // Events · opinion · reports.
  blocks.push({
    _type: "edColumns",
    autoFit: true,
    gap: 40,
    columns: [
      { gap: 8, blocks: [{ _type: "edSectionHeader", title: "Próximos eventos", size: "sm", more: { label: "Ver todo", href: "/eventos" } }, { _type: "edEventList", items: galas.map(eventItem) }] },
      {
        gap: 8,
        blocks: [
          { _type: "edSectionHeader", title: "Opinión", size: "sm", more: { label: "Ver todo", href: "/actualidad/opinion" } },
          { _type: "edOpinionList", items: opinion.map((a) => ({ author: a.author, title: a.title, role: a.authors[0]?.role ?? "", href: articleHref(a.slug) })) },
        ],
      },
      {
        gap: 20,
        blocks: [
          { _type: "edSectionHeader", title: "Informes", size: "sm", more: { label: "Ver todo", href: "/actualidad/informes" } },
          ...(report ? ([{ _type: "edArticleCard", showImage: true, article: c.teaser(report, { dek: true }) }] as EditorialBlock[]) : []),
        ],
      },
    ],
  });

  if (analysis.length) {
    blocks.push({
      _type: "edColumns",
      columns: [
        {
          blocks: [
            { _type: "edSectionHeader", title: "Análisis", more: { label: "Ver todo", href: "/actualidad" } },
            { _type: "edArticleGrid", variant: "large", columns: 3, itemRule: true, items: analysis.map((a) => c.teaser(a, { author: true, date: true })) },
          ],
        },
      ],
    });
  }
  blocks.push(newsletterBlock(c));
  return blocks;
}
