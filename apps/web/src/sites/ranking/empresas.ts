import type { ArticleTeaser, EditorialBlock } from "@microsites/ui/editorial";
import type { ListingPage } from "./actualidad";
import { ARTICLES_BY_DATE, shortDate, teaser } from "./content";
import { DIRECTORY_TOTALS, initials, medalsOf, ORGANIZATIONS, orgHref, positionsOf, recognitionsOf, type Organization } from "./organizations";
import { EDITIONS, award, resultLabel, topResult } from "./registry";
import { newsletterBlock } from "./shared";

const NEWSLETTER = "Cada lunes: premios, rankings, eventos y convocatorias de las empresas en Ecuador.";
const MEDAL_LABELS = { grand: "G. Premio", oro: "Oro", plata: "Plata", bronce: "Bronce", mencion: "Mención" } as const;

/** Articles that mention an organization, newest first. */
function newsAbout(name: string, count: number): ArticleTeaser[] {
  const n = name.toLowerCase();
  const hits = ARTICLES_BY_DATE.filter((a) => `${a.title} ${a.dek ?? ""}`.toLowerCase().includes(n));
  return hits.slice(0, count).map((a) => ({ ...teaser(a.slug), author: "Redacción", date: shortDate(a.date), image: { label: "Imagen" } }));
}

/** "/empresas": the directory. */
export function directoryPage(): ListingPage {
  const byCount = [...ORGANIZATIONS].sort((a, b) => b.recognitions - a.recognitions);
  const sectors = [...new Set(ORGANIZATIONS.map((o) => o.sector))];
  // Latest result of each edition, as "recognized this month".
  const recent = [...EDITIONS]
    .sort((a, b) => b.published.localeCompare(a.published))
    .map((e) => ({ e, r: topResult(e) }))
    .filter((x) => x.r?.org)
    .slice(0, 4);

  const blocks: EditorialBlock[] = [
    {
      _type: "edDirectoryIntro",
      eyebrow: "Directorio",
      title: "Empresas",
      text: "Cada organización reconocida en Ecuador, con su ficha, sus galardones y su posición en los rankings, edición por edición.",
      search: { placeholder: "Buscar empresa", button: "Buscar ↗" },
      totals: [
        { value: String(DIRECTORY_TOTALS.organizations), label: "empresas en el directorio" },
        { value: String(DIRECTORY_TOTALS.verified), label: "fichas verificadas" },
        { value: String(DIRECTORY_TOTALS.recognitions), label: "reconocimientos registrados" },
      ],
    },
    {
      _type: "edColumns",
      spaceTop: 64,
      columns: [
        {
          blocks: [
            {
              _type: "edRecentList",
              title: "Reconocidas este mes",
              more: { label: "Buscador de ganadores", href: "/rankings" },
              items: recent.map(({ e, r }) => ({
                date: shortDate(e.published).split(" ").slice(0, 2).join(" "),
                name: r!.name,
                result: resultLabel(r!),
                award: `${award(e.award).name} ${e.year}`,
                href: orgHref(r!.org!),
              })),
            },
          ],
        },
      ],
    },
    {
      _type: "edColumns",
      anchor: "directorio",
      spaceTop: 64,
      dividers: true,
      alignTop: true,
      gap: "clamp(20px,3.75vw,48px)",
      columns: [
        {
          width: "1fr",
          blocks: [
            {
              _type: "edDirectory",
              title: "Todas las empresas",
              sortLabel: "Orden",
              sorts: ["Más reconocidas", "A–Z"],
              sectorLabel: "Sector",
              sectors: ["Todos", "Banca y seguros", "Consumo masivo", "Industria", "Salud", "Retail", "Telecomunicaciones"],
              cityLabel: "Ciudad",
              cities: ["Todas", "Quito", "Guayaquil", "Cuenca"],
              verifiedLabel: "Solo verificadas",
              verifiedBadge: "Verificada",
              columns: ["Empresa", "Sector", "Ciudad", "Reconoc.", "Último reconocimiento"],
              rows: byCount.map((o) => ({
                initials: initials(o.name),
                name: o.name,
                href: orgHref(o.slug),
                verified: o.verified,
                sector: o.sector,
                city: o.city,
                count: o.recognitions,
                last: o.lastRecognition,
              })),
              count: `Mostrando {n} de ${DIRECTORY_TOTALS.organizations} empresas`,
              empty: "Ninguna empresa coincide con los filtros.",
              loadMore: "Cargar más",
              pageSize: 16,
            },
          ],
        },
        {
          width: "300px",
          aside: true,
          gap: "clamp(20px,3.13vw,40px)",
          blocks: [
            { _type: "edSectorCounts", title: "Por sector", items: sectors.map((s) => ({ label: s, count: ORGANIZATIONS.filter((o) => o.sector === s).length })) },
            { _type: "edNewsList", title: "Noticias de empresas", items: ARTICLES_BY_DATE.filter((a) => a.type === "noticia").slice(0, 3).map((a) => teaser(a.slug)) },
            {
              _type: "edCtaBox",
              dark: true,
              block: true,
              eyebrow: "Para empresas",
              title: ["¿Tu empresa", "no aparece?"],
              text: "Crea su ficha o reclama la existente para verificar los datos y mantener al día sus reconocimientos.",
              cta: { label: "Crear o reclamar ficha", href: "/participa/corrige-una-ficha" },
            },
          ],
        },
      ],
    },
    { ...newsletterBlock(NEWSLETTER), spaceTop: 80 },
  ];
  return { path: "empresas", title: "ranking.ec · Empresas", blocks };
}

/** "/empresas/<slug>": organization profile. */
export function organizationPages(): ListingPage[] {
  const thisYear = Math.max(...EDITIONS.map((e) => e.year));
  const years = Array.from({ length: 5 }, (_, i) => thisYear - 4 + i);

  return ORGANIZATIONS.map((o) => {
    const recognitions = recognitionsOf(o);
    const medals = medalsOf(o);
    const byYear = [...new Set(recognitions.map((r) => r.year))].sort((a, b) => b - a);
    const positions = positionsOf(o, years);
    const news = newsAbout(o.name, 4);
    const peers = ORGANIZATIONS.filter((x) => x.sector === o.sector)
      .sort((a, b) => b.recognitions - a.recognitions)
      .slice(0, 5);
    const sectorName = o.shortSector ?? o.sector;
    const yearsRange = byYear.length ? `${Math.min(...byYear, 2018)}–${Math.max(...byYear)}` : "";

    const main: EditorialBlock[] = [
      {
        _type: "edColumns",
        anchor: "reconocimientos",
        columns: [
          {
            gap: 20,
            blocks: [
              { _type: "edSectionHeader", title: "Reconocimientos", more: { label: `Ver los ${o.recognitions}`, href: "#reconocimientos" } },
              recognitions.length
                ? {
                    _type: "edRecognitions",
                    filters: [{ label: "Todos" }, { label: "Premios", type: "Premio" }, { label: "Rankings", type: "Ranking" }, { label: "Certificaciones", type: "Certificación" }],
                    years: byYear.map((y) => ({
                      year: String(y),
                      items: recognitions.filter((r) => r.year === y).map((r) => ({ ...r })),
                    })),
                  }
                : { _type: "edArticleGrid", items: [], empty: "Aún no hay reconocimientos en el registro." },
            ],
          },
        ],
      },
    ];
    if (positions.length) {
      main.push({
        _type: "edColumns",
        anchor: "rankings",
        columns: [
          {
            gap: 20,
            blocks: [
              { _type: "edSectionHeader", title: "Posición en rankings", description: "Puesto obtenido en cada edición. El año actual, en rojo." },
              { _type: "edPositions", label: "Ranking", years: years.map(String), rows: positions.map((p) => ({ name: p.name, values: years.map((y) => p.byYear[y] ?? "") })) },
            ],
          },
        ],
      });
    }
    if (news.length) {
      main.push({
        _type: "edColumns",
        anchor: "noticias",
        columns: [
          {
            gap: 20,
            blocks: [
              { _type: "edSectionHeader", title: "En las noticias", more: { label: "Ver todo", href: "/actualidad" } },
              { _type: "edArticleGrid", variant: "horizontal", columns: 2, showImage: true, ratio: "1/1", itemRule: "line", rulePadding: 16, gap: "32px 28px", items: news },
            ],
          },
        ],
      });
    }

    const facts = [
      { label: "Sector", value: sectorName },
      { label: "Sede", value: o.city },
      ...(o.founded ? [{ label: "Fundación", value: String(o.founded) }] : []),
      ...(o.employees ? [{ label: "Colaboradores", value: o.employees }] : []),
      ...(o.updated ? [{ label: "Ficha actualizada", value: o.updated }] : []),
    ];

    const blocks: EditorialBlock[] = [
      { _type: "edBreadcrumb", items: [{ label: "Inicio", href: "/" }, { label: "Empresas", href: "/empresas" }, { label: o.name }] },
      {
        _type: "edOrgHeader",
        eyebrow: `Empresa · ${sectorName}`,
        verified: o.verified ? "Verificada" : undefined,
        name: o.name,
        meta: [o.city, o.founded && `Desde ${o.founded}`, o.employees && `${o.employees} colaboradores`].filter(Boolean).join(" · "),
        links: [
          ...(o.website ? [{ label: new URL(o.website).hostname, href: o.website }] : []),
          ...(o.linkedin ? [{ label: "LinkedIn", href: o.linkedin }] : []),
        ],
        medalsTitle: "Reconocimientos",
        medalsRange: yearsRange,
        medals: (Object.keys(MEDAL_LABELS) as (keyof typeof MEDAL_LABELS)[]).map((level) => ({ level, label: MEDAL_LABELS[level], count: medals[level] })),
      },
      {
        _type: "edTabBar",
        items: [
          { label: "Resumen", href: "#resumen", current: true },
          { label: "Reconocimientos", href: "#reconocimientos" },
          ...(positions.length ? [{ label: "Rankings", href: "#rankings" }] : []),
          ...(news.length ? [{ label: "Noticias", href: "#noticias" }] : []),
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
          {
            width: "320px",
            aside: true,
            gap: "clamp(20px,3.13vw,40px)",
            blocks: [
              { _type: "edAboutBox", title: "Sobre la empresa", text: o.description, facts },
              {
                _type: "edRankedList",
                title: `Más reconocidas en ${sectorName.toLowerCase()}`,
                items: peers.map((p: Organization) => ({ name: p.name, count: String(p.recognitions), href: orgHref(p.slug), current: p.slug === o.slug })),
              },
              {
                _type: "edCtaBox",
                title: "¿Trabajas en esta empresa?",
                text: "Completa la ficha, corrige un dato o envía un reconocimiento que falte. La redacción valida cada cambio con un correo corporativo.",
                cta: { label: "Actualizar ficha", href: "/participa/corrige-una-ficha" },
              },
            ],
          },
        ],
      },
      { ...newsletterBlock(NEWSLETTER), spaceTop: 80 },
    ];
    return { path: `empresas/${o.slug}`, title: `ranking.ec · ${o.name} · Perfil de empresa`, blocks };
  });
}

