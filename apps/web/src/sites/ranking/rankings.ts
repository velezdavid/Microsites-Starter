import type { ArticleTeaser, EditorialBlock } from "@microsites/ui/editorial";
import type { ListingPage } from "./actualidad";
import { ARTICLES_BY_DATE, shortDate, teaser } from "./content";
import {
  AWARDS,
  EDITIONS,
  REGISTRY_TOTALS,
  TYPE_LABEL,
  UPCOMING_AWARD_GALAS,
  award,
  awardHref,
  editionHref,
  editionsOf,
  latestEdition,
  organizer,
  resultLabel,
  resultMark,
  topResult,
  type Award,
  type Edition,
} from "./registry";
import { newsletterBlock } from "./shared";

const NEWSLETTER = "Cada lunes: premios, rankings, eventos y convocatorias de las empresas en Ecuador.";
const orgHref = (slug?: string) => (slug ? `/empresas/${slug}` : undefined);
const longDate = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("es-EC", { day: "numeric", month: "long" });
};
const editionLabel = (e: Edition) => `${award(e.award).name} ${e.year}`;

/** Articles that talk about an award (kicker or title), newest first. */
function newsAbout(a: Award, count = 3): ArticleTeaser[] {
  const name = a.name.toLowerCase();
  const hits = ARTICLES_BY_DATE.filter((x) => `${x.kicker} ${x.title}`.toLowerCase().includes(name));
  return (hits.length ? hits : ARTICLES_BY_DATE).slice(0, count).map((x) => teaser(x.slug));
}

/** Search index of the registry: one entry per result. */
const searchIndex = () =>
  EDITIONS.flatMap((e) =>
    e.results.map((r) => ({
      title: r.name,
      detail: `${editionLabel(e)} · ${r.category ?? "General"}`,
      result: resultLabel(r),
      href: editionHref(e),
    })),
  );

/** "/rankings": the registry hub. */
export function rankingsHub(): ListingPage {
  const latest = [...EDITIONS].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 3);
  const categories = [...new Set(AWARDS.map((a) => a.category))];
  const corporate = AWARDS.filter((a) => a.corporate)
    .map((a) => ({ a, e: latestEdition(a.slug) }))
    .sort((x, y) => y.e.year - x.e.year);

  const blocks: EditorialBlock[] = [
    {
      _type: "edHubIntro",
      eyebrow: "El registro de ranking.ec",
      lines: ["Quién ganó.", "Qué se publicó.", "Qué viene."],
      text: "Los rankings, premios y certificaciones que reciben las organizaciones en Ecuador, registrados edición por edición.",
      search: {
        label: "Buscador de ganadores",
        placeholder: "Empresa, galardón o categoría",
        button: "Buscar ↗",
        suggestionsLabel: "Frecuentes:",
        suggestions: ["Banco del Litoral", "Premios Verdes", "Summum", "Great Place to Work"],
        empty: "Sin resultados en el registro.",
        more: { label: "Ver todos los resultados", href: "#galardones" },
        index: searchIndex(),
      },
      totals: [
        { value: String(AWARDS.length), label: "galardones en cobertura" },
        { value: String(REGISTRY_TOTALS.recognitions), label: "reconocimientos registrados" },
        { value: String(REGISTRY_TOTALS.organizations), label: "organizaciones" },
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
                const a = award(e.award);
                return {
                  type: TYPE_LABEL[a.type],
                  date: shortDate(e.published),
                  name: a.fullName && a.type === "ranking" ? `${a.fullName} ${e.year}` : `${a.name} ${e.year}`,
                  summary: e.summary,
                  top: e.results.slice(0, 3).map((r) => ({ mark: resultMark(r), name: r.name })),
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
      note: `${AWARDS.length} galardones en cobertura`,
      columns: ["Galardón", "Tipo", "Organizador", "Última edición", "Primer lugar / Gran premio"],
      filters: ["Todos", ...categories],
      rows: AWARDS.map((a) => {
        const e = latestEdition(a.slug);
        return {
          name: a.name,
          type: a.category,
          category: a.category,
          organizer: organizer(a.organizer).name,
          edition: String(e.year),
          winner: topResult(e)?.name ?? "",
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
              items: corporate.map(({ a, e }) => ({ name: a.name, leader: topResult(e)?.name ?? "", edition: `Edición ${e.year}`, href: editionHref(e) })),
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
              items: UPCOMING_AWARD_GALAS,
              more: { label: "Agenda de galas", href: "/eventos" },
            },
          ],
        },
      ],
    },
    { ...newsletterBlock(NEWSLETTER), spaceTop: 80 },
  ];

  return { path: "rankings", title: "ranking.ec · Rankings", blocks };
}

/** "/rankings/<award>": award profile. */
export function awardPages(): ListingPage[] {
  return AWARDS.map((a) => {
    const editions = editionsOf(a.slug);
    const last = editions[0];
    const org = organizer(a.organizer);
    const words = a.name.split(" ");
    const main: EditorialBlock[] = [
      {
        _type: "edLatestEdition",
        eyebrow: "Última edición",
        status: "Publicada",
        year: String(last.year),
        detail: `Publicada el ${longDate(last.published)} · ${last.total} ${a.unit} · ${last.number}.ª edición`,
        cta: { label: `Ver ${a.type === "ranking" ? "el ranking" : "los ganadores"} ${last.year}`, href: editionHref(last) },
        top: last.results.slice(0, 3).map((r) => ({
          position: resultMark(r),
          name: r.name,
          detail: r.sector ?? r.category ?? resultLabel(r),
          href: orgHref(r.org),
        })),
      },
      {
        _type: "edColumns",
        anchor: "ediciones",
        columns: [
          {
            gap: 20,
            blocks: [
              { _type: "edSectionHeader", title: "Ediciones", more: { label: `Las ${last.number} ediciones`, href: "#ediciones" } },
              {
                _type: "edEditionsTable",
                columns: ["Año", a.type === "ranking" ? "Primer lugar" : "Gran premio", a.unit.charAt(0).toUpperCase() + a.unit.slice(1), "Publicada"],
                rows: editions.map((e) => ({
                  year: String(e.year),
                  winner: topResult(e)?.name ?? "",
                  count: `${e.total} ${a.unit}`,
                  date: shortDate(e.published),
                  href: editionHref(e),
                })),
              },
            ],
          },
        ],
      },
    ];
    if (a.history?.length) {
      const years = a.history[0].years.length;
      main.push({
        _type: "edColumns",
        anchor: "mas-premiadas",
        columns: [
          {
            gap: 20,
            blocks: [
              {
                _type: "edSectionHeader",
                title: "Más premiadas",
                description: `Empresas con más ediciones en el top 10 desde ${a.firstEdition}. Cada casilla es un año.`,
              },
              {
                _type: "edHeatmap",
                years: Array.from({ length: years }, (_, i) => `'${String(a.firstEdition + i).slice(2)}`),
                totalLabel: "Top 10",
                rows: a.history.map((h) => ({ name: h.name, cells: [...h.years].map((c) => Number(c) as 0 | 1 | 2) })),
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
        name: org.name,
        detail: org.description,
        siblingsLabel: "Otros galardones del organizador",
        siblings: AWARDS.filter((x) => x.organizer === a.organizer && x.slug !== a.slug).map((x) => ({ label: x.name, href: awardHref(x.slug) })),
      },
      { _type: "edNewsList", title: "Noticias", items: newsAbout(a) },
      {
        _type: "edCtaBox",
        title: "¿Organizas este galardón?",
        text: "Envía los resultados de cada edición y mantén la ficha al día. La redacción los publica tras verificarlos.",
        cta: { label: "Publicar resultados", href: "/participa/publica-resultados" },
      },
    );

    const blocks: EditorialBlock[] = [
      {
        _type: "edBreadcrumb",
        items: [{ label: "Inicio", href: "/" }, { label: "Rankings", href: "/rankings" }, { label: "Galardones", href: "/rankings#galardones" }, { label: a.name }],
      },
      {
        _type: "edRecordHeader",
        eyebrow: `Galardón · ${TYPE_LABEL[a.type]} de ${a.category.toLowerCase()}`,
        lines: words.length === 2 ? words : [a.name],
        rule: true,
        text: a.description,
        facts: [
          { label: "Tipo", value: TYPE_LABEL[a.type] },
          { label: "Categoría", value: a.category },
          { label: "Organizador", value: org.name },
          { label: "Ámbito", value: a.scope },
          { label: "Periodicidad", value: a.periodicity },
          { label: "Primera edición", value: String(a.firstEdition) },
          { label: "Ediciones registradas", value: String(last.number) },
        ],
        link: { label: "Sitio oficial", href: a.website },
        asideWidth: 380,
        spaceBottom: 44,
      },
      {
        _type: "edTabBar",
        items: [
          { label: "Resumen", href: "#resumen", current: true },
          { label: "Ediciones", href: "#ediciones" },
          ...(a.history?.length ? [{ label: "Más premiadas", href: "#mas-premiadas" }] : []),
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
      { ...newsletterBlock(NEWSLETTER), spaceTop: 80 },
    ];
    return { path: `rankings/${a.slug}`, title: `ranking.ec · ${a.name} · Ficha de galardón`, blocks };
  });
}

/** "/rankings/<award>/<year>": results of one edition. */
export function editionPages(): ListingPage[] {
  return EDITIONS.map((e) => {
    const a = award(e.award);
    const org = organizer(a.organizer);
    const editions = editionsOf(a.slug);
    const family = a.family ? AWARDS.filter((x) => x.family?.key === a.family!.key) : [a];
    const ranked = e.results.every((r) => r.position != null) && e.results.length > 3;
    const nameLines = a.fullName ? [a.name, `${a.fullName.slice(a.name.length).trim()} ${e.year}`] : [a.name, String(e.year)];
    const unit = a.unit.charAt(0).toUpperCase() + a.unit.slice(1);

    const sectorLeaders = (() => {
      const seen = new Map<string, { name: string; position: number }>();
      for (const r of e.results) if (r.sector && r.position && !seen.has(r.sector)) seen.set(r.sector, { name: r.name, position: r.position });
      return [...seen].slice(0, 5).map(([sector, v]) => ({ label: sector, name: v.name, value: `${v.position}.º` }));
    })();

    const main: EditorialBlock[] = ranked
      ? [
          {
            _type: "edResultsTable",
            searchPlaceholder: "Buscar empresa",
            filters: ["Todos", ...[...new Set(e.results.map((r) => r.sector!))].slice(0, 4)],
            columns: ["Pos.", unit.replace(/s$/, ""), "Sector", "Puntos", `Vs. ${e.year - 1}`],
            rows: e.results.map((r) => ({
              position: r.position!,
              name: r.name,
              sector: r.sector ?? "",
              score: r.score?.toLocaleString("es-EC") ?? "",
              change: r.change ?? "",
              href: orgHref(r.org),
            })),
            skip: 3,
            count: `Mostrando {n} de ${e.total} ${a.unit}`,
            empty: "Ninguna empresa coincide con la búsqueda.",
            more: { label: `Ver las ${e.total}`, href: a.website },
            note: `Resultados publicados por ${org.name} el ${longDate(e.published)} de ${e.year}. ranking.ec los registra tal como fueron publicados y enlaza a la fuente oficial. Cada empresa lleva a su perfil con el resto de sus reconocimientos.`,
          },
        ]
      : [
          {
            _type: "edLabeledList",
            title: a.type === "ranking" ? "Primer lugar" : "Ganadores",
            items: e.results.map((r) => ({ label: r.category ?? "General", name: r.name, value: resultLabel(r), href: orgHref(r.org) })),
          },
        ];

    const aside: EditorialBlock[] = [];
    if (e.methodology) {
      aside.push({ _type: "edWeights", title: "Cómo se elabora", text: e.methodology.text, items: e.methodology.weights, more: { label: "Metodología completa", href: "/metodologia" } });
    }
    if (sectorLeaders.length) aside.push({ _type: "edLabeledList", title: "Líder por sector", items: sectorLeaders });
    aside.push({ _type: "edNewsList", title: "Noticias del ranking", items: newsAbout(a) });

    const others = AWARDS.filter((x) => x.slug !== a.slug && x.corporate === a.corporate).slice(0, 4);

    const blocks: EditorialBlock[] = [
      { _type: "edBreadcrumb", items: [{ label: "Inicio", href: "/" }, { label: "Rankings", href: "/rankings" }, { label: a.name, href: awardHref(a.slug) }, { label: String(e.year) }] },
      {
        _type: "edRecordHeader",
        eyebrow: `${TYPE_LABEL[a.type]}${a.corporate ? " corporativo" : ""} · ${a.category}`,
        lines: nameLines,
        highlight: String(e.year),
        text: e.intro ?? a.description,
        facts: [
          { label: "Organizador", value: org.name },
          { label: "Publicado", value: shortDate(e.published) },
          { label: unit, value: String(e.total) },
          { label: "Edición", value: `N.º ${e.number}` },
        ],
        link: { label: "Fuente oficial", href: a.website },
        asideWidth: 340,
        alignEnd: true,
        titleSize: "md",
      },
      {
        _type: "edTabBar",
        inset: true,
        spaceTop: 40,
        gap: 28,
        items: family.map((x) => {
          const xe = latestEdition(x.slug);
          return { label: x.family?.label ?? x.name, href: editionHref(x.slug === a.slug ? e : xe), current: x.slug === a.slug };
        }),
        chips: { label: "Edición", items: editions.map((x) => ({ label: String(x.year), href: editionHref(x), current: x.year === e.year })) },
      },
    ];
    if (ranked) {
      blocks.push({
        _type: "edPodium",
        items: e.results.slice(0, 3).map((r) => ({
          position: r.position!,
          name: r.name,
          detail: r.sector ?? "",
          score: r.score?.toLocaleString("es-EC"),
          change: r.change,
          href: orgHref(r.org),
        })),
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
                  const xe = latestEdition(x.slug);
                  return { eyebrow: x.category, title: x.name, detail: `Edición ${xe.year} · ${xe.total} ${x.unit}`, href: editionHref(xe) };
                }),
              },
            ],
          },
        ],
      },
      newsletterBlock(NEWSLETTER),
    );
    return { path: `rankings/${a.slug}/${e.year}`, title: `ranking.ec · ${a.fullName ?? a.name} ${e.year}`, blocks };
  });
}
