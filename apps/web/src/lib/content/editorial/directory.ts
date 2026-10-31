import type { EditorialBlock } from "@microsites/ui/editorial";
import { dayMonth, initials, orgHref, shortDate, type EditorialContent, type Organization } from "./content";
import { newsletterBlock, type ListingPage } from "./shared";

const MEDAL_LABELS = { grand: "G. Premio", oro: "Oro", plata: "Plata", bronce: "Bronce", mencion: "Mención" } as const;

/** Values of a filter, most frequent first (the directory shows the main ones). */
const byFrequency = (values: string[], max: number) => {
  const counts = new Map<string, number>();
  for (const v of values) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, max).map(([v]) => v);
};

/** "/empresas": the directory. */
export function directoryPage(c: EditorialContent, siteName: string): ListingPage {
  const hub = c.settings.empresas;
  const count = (o: Organization) => c.recognitionsOf(o.slug).length;
  const byCount = [...c.organizations].sort((a, b) => count(b) - count(a) || a.name.localeCompare(b.name, "es"));
  const sectors = [...new Set(c.organizations.map((o) => o.sector))].filter(Boolean);
  const totals = c.totals;
  // Winner of each latest edition, as "recognized this month".
  const recent = c.editionsByDate
    .map((e) => ({ e, r: c.topResult(e) }))
    .filter((x) => x.r?.org)
    .slice(0, 4);

  const blocks: EditorialBlock[] = [
    {
      _type: "edDirectoryIntro",
      eyebrow: hub?.eyebrow ?? "",
      title: hub?.title?.join(" ") || "Empresas",
      text: hub?.text ?? "",
      search: { placeholder: "Buscar empresa", button: "Buscar ↗" },
      totals: [
        { value: String(totals.organizations), label: "empresas en el directorio" },
        { value: String(totals.verified), label: "fichas verificadas" },
        { value: String(totals.recognitions), label: "reconocimientos registrados" },
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
              items: recent.map(({ e, r }) => ({ date: dayMonth(e.published), name: r!.name, result: c.resultLabel(r!), award: c.editionLabel(e), href: orgHref(r!.org!) })),
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
              sectors: ["Todos", ...byFrequency(c.organizations.map((o) => o.sector), 6)],
              cityLabel: "Ciudad",
              cities: ["Todas", ...byFrequency(c.organizations.map((o) => o.city), 3)],
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
                count: count(o),
                last: c.lastRecognition(o.slug),
              })),
              count: `Mostrando {n} de ${totals.organizations} empresas`,
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
            { _type: "edSectorCounts", title: "Por sector", items: sectors.map((s) => ({ label: s, count: c.organizations.filter((o) => o.sector === s).length })) },
            { _type: "edNewsList", title: "Noticias de empresas", items: c.latestOfType(["noticia"]).slice(0, 3).map((a) => c.teaser(a)) },
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
    { ...newsletterBlock(c, hub?.newsletterText), spaceTop: 80 },
  ];
  return { path: "empresas", title: `${siteName} · Empresas`, blocks, section: "/empresas" };
}

/** "/empresas/<slug>": organization profile. */
export function organizationPages(c: EditorialContent, siteName: string): ListingPage[] {
  const newsText = c.settings.empresas?.newsletterText;
  const thisYear = Math.max(...c.editions.map((e) => e.year), new Date().getFullYear() - 1);
  const years = Array.from({ length: 5 }, (_, i) => thisYear - 4 + i);
  const count = (o: Organization) => c.recognitionsOf(o.slug).length;

  return c.organizations.map((o) => {
    const recognitions = c.recognitionsOf(o.slug);
    const medals = c.medalsOf(o.slug);
    const byYear = [...new Set(recognitions.map((r) => r.year))].sort((a, b) => b - a);
    const positions = c.positionsOf(o.slug, years);
    const news = c
      .newsAbout([o.id], o.name, (a) => `${a.title} ${a.dek ?? ""}`)
      .slice(0, 4)
      .map((a) => ({ ...c.teaser(a), author: a.author, date: shortDate(a.date), image: a.image?.src ? a.image : { label: "Imagen" } }));
    const peers = c.organizations
      .filter((x) => x.sector === o.sector)
      .sort((a, b) => count(b) - count(a))
      .slice(0, 5);
    const sectorName = o.shortSector;
    const yearsRange = byYear.length ? `${Math.min(...byYear)}–${Math.max(...byYear)}` : "";

    const main: EditorialBlock[] = [
      {
        _type: "edColumns",
        anchor: "reconocimientos",
        columns: [
          {
            gap: 20,
            blocks: [
              { _type: "edSectionHeader", title: "Reconocimientos", more: { label: `Ver los ${recognitions.length}`, href: "#reconocimientos" } },
              recognitions.length
                ? {
                    _type: "edRecognitions",
                    filters: [{ label: "Todos" }, { label: "Premios", type: "Premio" }, { label: "Rankings", type: "Ranking" }, { label: "Certificaciones", type: "Certificación" }],
                    years: byYear.map((y) => ({
                      year: String(y),
                      items: recognitions.filter((r) => r.year === y).map(({ year, award, category, type, level, result, href }) => ({ year, award, category, type, level, result, href })),
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

    const hostname = (url: string) => {
      try {
        return new URL(url).hostname;
      } catch {
        return url;
      }
    };

    const blocks: EditorialBlock[] = [
      { _type: "edBreadcrumb", items: [{ label: "Inicio", href: "/" }, { label: "Empresas", href: "/empresas" }, { label: o.name }] },
      {
        _type: "edOrgHeader",
        eyebrow: `Empresa · ${sectorName}`,
        verified: o.verified ? "Verificada" : undefined,
        name: o.name,
        meta: [o.city, o.founded && `Desde ${o.founded}`, o.employees && `${o.employees} colaboradores`].filter(Boolean).join(" · "),
        links: [...(o.website ? [{ label: hostname(o.website), href: o.website }] : []), ...(o.linkedin ? [{ label: "LinkedIn", href: o.linkedin }] : [])],
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
                items: peers.map((p) => ({ name: p.name, count: String(count(p)), href: orgHref(p.slug), current: p.slug === o.slug })),
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
      { ...newsletterBlock(c, newsText), spaceTop: 80 },
    ];
    return { path: `empresas/${o.slug}`, title: `${siteName} · ${o.name} · Perfil de empresa`, description: o.description, blocks, section: "/empresas" };
  });
}

