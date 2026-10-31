import type { ArticleTeaser, EditorialBlock } from "@microsites/ui/editorial";
import { AWARD_TYPE_LABEL, awardHref, daysUntil, editionHref, longDate, orgHref, shortDate, type Award, type Edition, type EditorialContent } from "./content";
import { eventItem } from "./home";
import { newsletterBlock, type ListingPage } from "./shared";

const href = (slug?: string) => (slug ? orgHref(slug) : undefined);
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Articles about an award (mentions of it or its editions, or its name in the kicker or title), newest first. */
function newsAbout(c: EditorialContent, a: Award, count = 3): ArticleTeaser[] {
  const ids = [a.id, ...c.editionsOf(a.slug).map((e) => e.id)];
  const hits = c.newsAbout(ids, a.name);
  return (hits.length ? hits : c.articlesByDate).slice(0, count).map((x) => c.teaser(x));
}

/** Search index of the registry: one entry per result. */
const searchIndex = (c: EditorialContent) =>
  c.editions.flatMap((e) =>
    e.results.map((r) => ({
      title: r.name,
      detail: `${c.editionLabel(e)} · ${r.category ?? "General"}`,
      result: c.resultLabel(r),
      href: editionHref(e),
    })),
  );

/** "/rankings": the registry hub. */
export function rankingsHub(c: EditorialContent, siteName: string): ListingPage {
  const hub = c.settings.rankings;
  const awards = c.awardsWithEditions;
  const latest = c.editionsByDate.slice(0, 3);
  const categories = [...new Set(awards.map((a) => a.category))];
  const corporate = awards
    .filter((a) => a.corporate)
    .map((a) => ({ a, e: c.latestEdition(a.slug)! }))
    .sort((x, y) => y.e.year - x.e.year);
  const totals = c.totals;
  const galas = c.upcomingEvents.filter((e) => e.type === "gala").slice(0, 4);

  const blocks: EditorialBlock[] = [
    {
      _type: "edHubIntro",
      eyebrow: hub?.eyebrow ?? "",
      lines: hub?.title?.length ? hub.title : ["Rankings"],
      text: hub?.text ?? "",
      search: {
        label: "Buscador de ganadores",
        placeholder: "Empresa, galardón o categoría",
        button: "Buscar ↗",
        suggestionsLabel: "Frecuentes:",
        suggestions: c.settings.rankingsSearch ?? [],
        empty: "Sin resultados en el registro.",
        more: { label: "Ver todos los resultados", href: "#galardones" },
        index: searchIndex(c),
      },
      totals: [
        { value: String(totals.awards), label: "galardones en cobertura" },
        { value: String(totals.recognitions), label: "reconocimientos registrados" },
        { value: String(totals.organizations), label: "organizaciones" },
      ],
    },
    {
      _type: "edColumns",
      spaceTop: 80,
      columns: [
        {
          blocks: [
            { _type: "edSectionHeader", title: "Últimas ediciones", more: { label: "Todas las ediciones", href: "#galardones" } },
            {
              _type: "edEditionCards",
              items: latest.map((e) => {
                const a = c.award(e.award)!;
                return {
                  type: AWARD_TYPE_LABEL[a.type],
                  date: shortDate(e.published),
                  name: a.fullName && a.type === "ranking" ? `${a.fullName} ${e.year}` : `${a.name} ${e.year}`,
                  summary: e.summary,
                  top: e.results.slice(0, 3).map((r) => ({ mark: c.resultMark(r), name: r.name })),
                  cta: a.type === "ranking" ? "Ver ranking" : "Ver ganadores",
                  href: editionHref(e),
                };
              }),
            },
          ],
        },
      ],
    },
    {
      _type: "edAwardTable",
      anchor: "galardones",
      eyebrow: "Lo que cubrimos",
      title: "Todos los galardones",
      note: `${awards.length} galardones en cobertura`,
      columns: ["Galardón", "Tipo", "Organizador", "Última edición", "Primer lugar / Gran premio"],
      filters: ["Todos", ...categories],
      rows: awards.map((a) => {
        const e = c.latestEdition(a.slug)!;
        return {
          name: a.name,
          type: a.category,
          category: a.category,
          organizer: c.organizer(a.organizer)?.name ?? "",
          edition: String(e.year),
          winner: c.topResult(e)?.name ?? "",
          href: awardHref(a.slug),
        };
      }),
      footer: {
        text: "La lista crece cada trimestre. ¿Tu organización otorga un galardón en Ecuador?",
        cta: { label: "Propón un galardón", href: "/participa/publica-resultados" },
      },
    },
    {
      _type: "edColumns",
      spaceTop: 80,
      gap: "clamp(20px,3.13vw,40px)",
      columns: [
        {
          blocks: [
            {
              _type: "edLeaderList",
              eyebrow: "Rankings corporativos",
              title: "Líderes vigentes",
              items: corporate.map(({ a, e }) => ({ name: a.name, leader: c.topResult(e)?.name ?? "", edition: `Edición ${e.year}`, href: editionHref(e) })),
              more: { label: "Todos los rankings corporativos", href: "#galardones" },
            },
          ],
        },
        {
          blocks: [
            {
              _type: "edAgendaPanel",
              eyebrow: "Qué viene",
              title: "Próximas galas",
              items: galas.map((e) => {
                const days = daysUntil(e.date);
                const item = eventItem(e);
                return {
                  ...item,
                  href: e.hasPage ? item.href : undefined,
                  flag: days <= 45 ? `Quedan ${days} días` : `${item.month} ${e.date.slice(0, 4)}`,
                  soon: days <= 14 || undefined,
                };
              }),
              more: { label: "Agenda de galas", href: "/eventos" },
            },
          ],
        },
      ],
    },
    { ...newsletterBlock(c, hub?.newsletterText), spaceTop: 80 },
  ];

  return { path: "rankings", title: `${siteName} · Rankings`, blocks, section: "/rankings" };
}

/** "/rankings/<award>": award profile. */
export function awardPages(c: EditorialContent, siteName: string): ListingPage[] {
  const newsText = c.settings.rankings?.newsletterText;
  return c.awardsWithEditions.map((a) => {
    const editions = c.editionsOf(a.slug);
    const last = editions[0];
    const org = c.organizer(a.organizer);
    const words = a.name.split(" ");
    const history = c.historyOf(a.slug);
    const count = last.number ?? editions.length;
    const main: EditorialBlock[] = [
      {
        _type: "edLatestEdition",
        eyebrow: "Última edición",
        status: "Publicada",
        year: String(last.year),
        detail: [`Publicada el ${longDate(last.published)}`, `${last.total} ${a.unit}`, last.number && `${last.number}.ª edición`].filter(Boolean).join(" · "),
        cta: { label: `Ver ${a.type === "ranking" ? "el ranking" : "los ganadores"} ${last.year}`, href: editionHref(last) },
        top: last.results.slice(0, 3).map((r) => ({ position: c.resultMark(r), name: r.name, detail: r.sector ?? r.category ?? c.resultLabel(r), href: href(r.org) })),
      },
      {
        _type: "edColumns",
        anchor: "ediciones",
        columns: [
          {
            gap: 20,
            blocks: [
              { _type: "edSectionHeader", title: "Ediciones", more: { label: `Las ${count} ediciones`, href: "#ediciones" } },
              {
                _type: "edEditionsTable",
                columns: ["Año", a.type === "ranking" ? "Primer lugar" : "Gran premio", capitalize(a.unit), "Publicada"],
                rows: editions.map((e) => ({ year: String(e.year), winner: c.topResult(e)?.name ?? "", count: `${e.total} ${a.unit}`, date: shortDate(e.published), href: editionHref(e) })),
              },
            ],
          },
        ],
      },
    ];
    if (history) {
      main.push({
        _type: "edColumns",
        anchor: "mas-premiadas",
        columns: [
          {
            gap: 20,
            blocks: [
              { _type: "edSectionHeader", title: "Más premiadas", description: `Empresas con más ediciones en el top 10 desde ${history.years[0]}. Cada casilla es un año.` },
              {
                _type: "edHeatmap",
                years: history.years.map((y) => `'${String(y).slice(2)}`),
                totalLabel: "Top 10",
                rows: history.rows,
                legend: ["Primer lugar", "Top 10", "Fuera del top 10"],
              },
            ],
          },
        ],
      });
    }
    if (a.about?.length) {
      main.push({
        _type: "edColumns",
        anchor: "sobre",
        columns: [{ gap: 20, blocks: [{ _type: "edSectionHeader", title: "Sobre el galardón" }, { _type: "edNumberedColumns", items: a.about }] }],
      });
    }

    const aside: EditorialBlock[] = [];
    if (a.nextEdition) {
      aside.push({ _type: "edTimeline", title: "Próxima edición", heading: String(a.nextEdition.year), steps: a.nextEdition.steps, note: a.nextEdition.note });
    }
    aside.push(
      {
        _type: "edOrganizer",
        title: "Organizador",
        name: org?.name ?? "",
        detail: org?.description ?? "",
        siblingsLabel: "Otros galardones del organizador",
        siblings: c.awardsWithEditions.filter((x) => x.organizer === a.organizer && x.slug !== a.slug).map((x) => ({ label: x.name, href: awardHref(x.slug) })),
      },
      { _type: "edNewsList", title: "Noticias", items: newsAbout(c, a) },
      {
        _type: "edCtaBox",
        title: "¿Organizas este galardón?",
        text: "Envía los resultados de cada edición y mantén la ficha al día. La redacción los publica tras verificarlos.",
        cta: { label: "Publicar resultados", href: "/participa/publica-resultados" },
      },
    );

    const blocks: EditorialBlock[] = [
      { _type: "edBreadcrumb", items: [{ label: "Inicio", href: "/" }, { label: "Rankings", href: "/rankings" }, { label: "Galardones", href: "/rankings#galardones" }, { label: a.name }] },
      {
        _type: "edRecordHeader",
        eyebrow: `Galardón · ${AWARD_TYPE_LABEL[a.type]} de ${a.category.toLowerCase()}`,
        lines: words.length === 2 ? words : [a.name],
        rule: true,
        text: a.description,
        facts: [
          { label: "Tipo", value: AWARD_TYPE_LABEL[a.type] },
          { label: "Categoría", value: a.category },
          { label: "Organizador", value: org?.name ?? "" },
          ...(a.scope ? [{ label: "Ámbito", value: a.scope }] : []),
          ...(a.periodicity ? [{ label: "Periodicidad", value: a.periodicity }] : []),
          ...(a.firstEdition ? [{ label: "Primera edición", value: String(a.firstEdition) }] : []),
          { label: "Ediciones registradas", value: String(count) },
        ],
        link: a.website ? { label: "Sitio oficial", href: a.website } : undefined,
        asideWidth: 380,
        spaceBottom: 44,
      },
      {
        _type: "edTabBar",
        items: [
          { label: "Resumen", href: "#resumen", current: true },
          { label: "Ediciones", href: "#ediciones" },
          ...(history ? [{ label: "Más premiadas", href: "#mas-premiadas" }] : []),
          ...(a.about?.length ? [{ label: "Sobre el galardón", href: "#sobre" }] : []),
        ],
      },
      {
        _type: "edColumns",
        anchor: "resumen",
        spaceTop: 48,
        dividers: true,
        alignTop: true,
        gap: "clamp(20px,3.75vw,48px)",
        columns: [
          { width: "1fr", gap: "clamp(20px,5vw,64px)", blocks: main },
          { width: "300px", aside: true, gap: "clamp(20px,3.13vw,40px)", blocks: aside },
        ],
      },
      { ...newsletterBlock(c, newsText), spaceTop: 80 },
    ];
    return { path: `rankings/${a.slug}`, title: `${siteName} · ${a.name} · Ficha de galardón`, description: a.description, blocks, section: "/rankings" };
  });
}

/** Leader of each sector in a ranked edition (first five sectors). */
function sectorLeaders(e: Edition) {
  const seen = new Map<string, { name: string; position: number }>();
  for (const r of [...e.results].sort((a, b) => (a.position ?? 99) - (b.position ?? 99))) {
    if (r.sector && r.position && !seen.has(r.sector)) seen.set(r.sector, { name: r.name, position: r.position });
  }
  return [...seen].slice(0, 5).map(([sector, v]) => ({ label: sector, name: v.name, value: `${v.position}.º` }));
}

/** "/rankings/<award>/<year>": results of one edition. */
export function editionPages(c: EditorialContent, siteName: string): ListingPage[] {
  const newsText = c.settings.rankings?.newsletterText;
  return c.editions.map((e) => {
    const a = c.award(e.award)!;
    const org = c.organizer(a.organizer);
    const editions = c.editionsOf(a.slug);
    const family = a.family ? c.awardsWithEditions.filter((x) => x.family?.key === a.family!.key) : [a];
    const ranked = e.results.every((r) => r.position != null) && e.results.length > 3;
    const results = ranked ? [...e.results].sort((x, y) => x.position! - y.position!) : e.results;
    const nameLines = a.fullName && a.fullName.startsWith(a.name) ? [a.name, `${a.fullName.slice(a.name.length).trim()} ${e.year}`] : [a.name, String(e.year)];
    const unit = capitalize(a.unit);
    const source = e.source ?? a.website;
    const leaders = ranked ? sectorLeaders(e) : [];

    const main: EditorialBlock[] = ranked
      ? [
          {
            _type: "edResultsTable",
            searchPlaceholder: "Buscar empresa",
            filters: ["Todos", ...[...new Set(results.map((r) => r.sector).filter((s): s is string => !!s))].slice(0, 4)],
            columns: ["Pos.", unit.replace(/s$/, ""), "Sector", "Puntos", `Vs. ${e.year - 1}`],
            rows: results.map((r) => ({
              position: r.position!,
              name: r.name,
              sector: r.sector ?? "",
              score: r.score?.toLocaleString("es-EC") ?? "",
              change: r.change ?? "",
              href: href(r.org),
            })),
            skip: 3,
            count: `Mostrando {n} de ${e.total} ${a.unit}`,
            empty: "Ninguna empresa coincide con la búsqueda.",
            more: source ? { label: `Ver las ${e.total}`, href: source } : undefined,
            note: `Resultados publicados por ${org?.name ?? a.name} el ${longDate(e.published)} de ${e.year}. ranking.ec los registra tal como fueron publicados y enlaza a la fuente oficial. Cada empresa lleva a su perfil con el resto de sus reconocimientos.`,
          },
        ]
      : [
          {
            _type: "edLabeledList",
            title: a.type === "ranking" ? "Primer lugar" : "Ganadores",
            items: results.map((r) => ({ label: r.category ?? "General", name: r.name, value: c.resultLabel(r), href: href(r.org) })),
          },
        ];

    const aside: EditorialBlock[] = [];
    if (e.methodology) {
      aside.push({ _type: "edWeights", title: "Cómo se elabora", text: e.methodology.text, items: e.methodology.weights, more: { label: "Metodología completa", href: "/metodologia" } });
    }
    if (leaders.length) aside.push({ _type: "edLabeledList", title: "Líder por sector", items: leaders });
    aside.push({ _type: "edNewsList", title: "Noticias del ranking", items: newsAbout(c, a) });

    const others = c.awardsWithEditions.filter((x) => x.slug !== a.slug && x.corporate === a.corporate).slice(0, 4);

    const blocks: EditorialBlock[] = [
      { _type: "edBreadcrumb", items: [{ label: "Inicio", href: "/" }, { label: "Rankings", href: "/rankings" }, { label: a.name, href: awardHref(a.slug) }, { label: String(e.year) }] },
      {
        _type: "edRecordHeader",
        eyebrow: `${AWARD_TYPE_LABEL[a.type]}${a.corporate ? " corporativo" : ""} · ${a.category}`,
        lines: nameLines,
        highlight: String(e.year),
        text: e.intro ?? a.description,
        facts: [
          { label: "Organizador", value: org?.name ?? "" },
          { label: "Publicado", value: shortDate(e.published) },
          { label: unit, value: String(e.total) },
          ...(e.number ? [{ label: "Edición", value: `N.º ${e.number}` }] : []),
        ],
        link: source ? { label: "Fuente oficial", href: source } : undefined,
        asideWidth: 340,
        alignEnd: true,
        titleSize: "md",
      },
      {
        _type: "edTabBar",
        inset: true,
        spaceTop: 40,
        gap: 28,
        items: family.map((x) => ({ label: x.family?.label ?? x.name, href: editionHref(x.slug === a.slug ? e : c.latestEdition(x.slug)!), current: x.slug === a.slug })),
        chips: { label: "Edición", items: editions.map((x) => ({ label: String(x.year), href: editionHref(x), current: x.year === e.year })) },
      },
    ];
    if (ranked) {
      blocks.push({
        _type: "edPodium",
        items: results.slice(0, 3).map((r) => ({ position: r.position!, name: r.name, detail: r.sector ?? "", score: r.score?.toLocaleString("es-EC"), change: r.change, href: href(r.org) })),
      });
    }
    blocks.push(
      {
        _type: "edColumns",
        spaceTop: ranked ? 56 : 40,
        dividers: true,
        alignTop: true,
        gap: "clamp(20px,3.75vw,48px)",
        columns: [
          { width: "1fr", gap: 20, blocks: main },
          { width: "300px", aside: true, gap: "clamp(20px,3.13vw,40px)", blocks: aside },
        ],
      },
      {
        _type: "edColumns",
        band: true,
        spaceTop: 80,
        columns: [
          {
            blocks: [
              { _type: "edSectionHeader", title: a.corporate ? "Otros rankings corporativos" : "Otros galardones", more: { label: "Todos los rankings", href: "/rankings#galardones" } },
              {
                _type: "edCardGrid",
                items: others.map((x) => {
                  const xe = c.latestEdition(x.slug)!;
                  return { eyebrow: x.category, title: x.name, detail: `Edición ${xe.year} · ${xe.total} ${x.unit}`, href: editionHref(xe) };
                }),
              },
            ],
          },
        ],
      },
      newsletterBlock(c, newsText),
    );
    return { path: `rankings/${a.slug}/${e.year}`, title: `${siteName} · ${a.fullName ?? a.name} ${e.year}`, description: e.summary || a.description, blocks, section: "/rankings" };
  });
}
