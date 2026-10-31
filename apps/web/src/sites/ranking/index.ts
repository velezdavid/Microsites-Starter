import type { PageDefinition, SiteDefinition } from "../../lib/content/types";
import logoUrl from "./assets/logo.svg?url";
import logoWhiteUrl from "./assets/logo-white.svg?url";
import { actualidadPages } from "./actualidad";
import { articlePages } from "./article";
import { homeBlocks } from "./home";
import { awardPages, editionPages, rankingsHub } from "./rankings";
import { directoryPage, organizationPages } from "./empresas";
import { agendaPage, calendarFiles, eventPages } from "./eventos";
import { institutionalPages, newsletterPage, participaPages } from "./pages";

// The SVG logo is 5491×868 (viewBox units); shown at 270 px wide in the masthead.
const LOGO_RATIO = 5491 / 868;

const NAV = [
  { label: "Actualidad", href: "/actualidad" },
  { label: "Rankings", href: "/rankings" },
  { label: "Empresas", href: "/empresas" },
  { label: "Eventos", href: "/eventos" },
  { label: "Newsletter", href: "/newsletter" },
];

// Placeholder until the domain is decided.
const SITE_URL = "https://ranking.netlify.app";

const DESCRIPTION = "La publicación de registro de los reconocimientos, galardones y premios de las organizaciones en Ecuador.";

function page(path: string, title: string, editorial: PageDefinition["editorial"], description = DESCRIPTION): PageDefinition {
  return {
    path,
    seo: { title, description, noIndex: false },
    header: { homeHref: "/" },
    footer: { bottomText: "" },
    blocks: [],
    editorial,
  };
}

/** ranking.ec (static port): site chrome and pages, with the prototype's sample content. */
export function rankingSite(): SiteDefinition {
  return {
    slug: "ranking",
    name: "ranking.ec",
    lang: "es",
    url: SITE_URL,
    theme: {
      bg: "#FFFFFF",
      surface: "#F2F2F2",
      surface2: "#E8E8E8",
      surfaceEnd: "#F2F2F2",
      deep: "#0A0A0A",
      raised: "#FFFFFF",
      accent: "#FF0000",
      accentHover: "#D90000",
      accentSoft: "rgba(255,0,0,.08)",
      onAccent: "#FFFFFF",
      text: "#0A0A0A",
      muted: "#4A4A4A",
      dim: "#7A7A7A",
      line: "#E2E2E2",
      lineSoft: "#F2F2F2",
      placeholder: "#9A9A9A",
      fontDisplay: '"Bebas Neue", Oswald, "Arial Narrow", sans-serif',
      fontBody: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
      fontMono: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
      premium: "#CBBFA9",
      // #FF0000 on white is 3.99:1; small red text uses the design system "rojo hover" (5.2:1).
      accentText: "#D90000",
    },
    logo: { label: "ranking.ec, inicio", wordmark: [{ text: "RAN" }, { text: "KING", accent: true }] },
    analytics: {},
    scripts: [],
    allowAiCrawlers: true,
    redirects: [],
    verificationFiles: [],
    files: calendarFiles(SITE_URL),
    editorial: {
      masthead: {
        homeHref: "/",
        locale: "Ecuador",
        logo: { src: logoUrl, alt: "RANKING", width: 270, height: Math.round(270 / LOGO_RATIO) },
        nav: NAV,
      },
      footer: {
        logo: { src: logoWhiteUrl, alt: "RANKING", width: 170, height: Math.round(170 / LOGO_RATIO) },
        tagline: DESCRIPTION,
        columns: [
          { title: "ranking.ec", links: [...NAV.slice(0, 4), { label: "Ranking Newsletter", href: "/newsletter" }] },
          {
            title: "Participa",
            links: [
              { label: "Envía tu información", href: "/participa/envia-tu-informacion" },
              { label: "Publica resultados", href: "/participa/publica-resultados" },
              { label: "Corrige una ficha", href: "/participa/corrige-una-ficha" },
            ],
          },
          {
            title: "Institucional",
            links: [
              { label: "Quiénes somos", href: "/quienes-somos" },
              { label: "Política editorial", href: "/politica-editorial" },
              { label: "Metodología", href: "/metodologia" },
              { label: "Contacto", href: "/contacto" },
            ],
          },
        ],
        bottomLeft: "© 2026 RANKING · Dato & Data",
        bottomRight: "Ecuador",
      },
    },
    pages: [
      page("", "ranking.ec · Portada", { blocks: homeBlocks() }),
      ...[...actualidadPages(), ...articlePages(SITE_URL)].map((p) => page(p.path, p.title, { blocks: p.blocks, section: "/actualidad" })),
      ...[rankingsHub(), ...awardPages(), ...editionPages()].map((p) => page(p.path, p.title, { blocks: p.blocks, section: "/rankings" })),
      ...[directoryPage(), ...organizationPages()].map((p) => page(p.path, p.title, { blocks: p.blocks, section: "/empresas" })),
      ...[agendaPage(), ...eventPages()].map((p) => page(p.path, p.title, { blocks: p.blocks, section: "/eventos" })),
      page("newsletter", newsletterPage().title, { blocks: newsletterPage().blocks, section: "/newsletter", flushFooter: true }),
      ...[...institutionalPages(), ...participaPages()].map((p) => page(p.path, p.title, { blocks: p.blocks })),
    ],
  };
}
