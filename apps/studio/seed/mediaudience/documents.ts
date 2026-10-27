/**
 * Builds the Sanity documents of the Mediaudience microsite from ./content.ts.
 * IDs are deterministic, so re-importing with --replace updates the same documents.
 */
import {
  ABOUT_LINKS,
  CHANNELS,
  COUNTRIES,
  GROUPS,
  KPI_LABELS,
  LEGAL_PATH,
  MAIL,
  OBJECTIVES,
  PAGE_PATHS,
  PRODUCTS,
  SOLUTIONS,
  TOOLS,
  type GroupId,
  type SolutionDetail,
} from "./content";
import { keyed, ref, type SanityDoc } from "../lib";

const SITE = "mediaudience";
const siteRef = ref(`site-${SITE}`);

/* ---------- IDs ---------- */

const CATEGORY_SLUG: Record<GroupId, string> = { obj: "objetivos", prod: "productos", ch: "canales", tool: "herramientas" };
const categoryId = (g: GroupId) => `category-${SITE}-${CATEGORY_SLUG[g]}`;
const itemId = (g: GroupId, slug: string) => `item-${SITE}-${CATEGORY_SLUG[g]}-${slug}`;
const pageId = (path: string) => `page-${SITE}-${path ? path.replace(/[^a-z0-9]+/gi, "-").toLowerCase() : "home"}`;

/** Solution keys (as used in SOLUTIONS / PAGE_PATHS) → catalog item ids. */
function itemIdForSolution(key: string): string {
  if (key.startsWith("ch-")) return itemId("ch", key.slice(3));
  return itemId(SOLUTIONS[key].g, key);
}

const TOOL_SLUGS: Record<string, string> = { CC: "campaign-console", BS: "brand-safety" };
const toolSlug = (t: (typeof TOOLS)[number]) => t.slug ?? TOOL_SLUGS[t.code];
const chName = (id: string) => CHANNELS.find((c) => c.id === id)!.name;

const pageRefFor = (key: string) => (PAGE_PATHS[key] ? ref(pageId(PAGE_PATHS[key])) : undefined);

/* ---------- Site ---------- */

const catalogColumns = (["obj", "prod", "ch", "tool"] as GroupId[]).map((g) => ({
  _type: "catalogNavColumn",
  category: ref(categoryId(g)),
}));

const site: SanityDoc = {
  _id: `site-${SITE}`,
  _type: "site",
  name: "Mediaudience",
  slug: { _type: "slug", current: SITE },
  url: "https://mediaudience.com",
  lang: "es",
  seo: {
    _type: "seo",
    title: "Mediaudience · Conectamos marcas con audiencias reales",
    description:
      "Soluciones publicitarias full-funnel — Connected TV, Mobile Push Premium, Programmatic y Gaming — con inventario premium y First Party Data.",
  },
  analytics: { gtmId: "", ga4Id: "G-3Q4TS6WY1D" },
  scripts: keyed([
    {
      _type: "externalScript",
      label: "Radar Platform",
      src: "https://realtime.radarplatform.ai/tracker.min.js",
      attributes: keyed([{ _type: "scriptAttribute", name: "data-site-id", value: "c3877d41-c85c-43b0-892d-79b65dc0459d" }]),
    },
  ]),
  verificationFiles: keyed([
    {
      _type: "verificationFile",
      filename: "googled05686a231482217.html",
      content: "google-site-verification: googled05686a231482217.html",
    },
  ]),
  logo: {
    _type: "logo",
    label: "Mediaudience, inicio",
    wordmark: keyed([
      { _type: "wordmarkPart", text: "medi", accent: false },
      { _type: "wordmarkPart", text: "a", accent: true },
      { _type: "wordmarkPart", text: "udience", accent: false },
    ]),
    mark: "rings",
  },
  theme: {
    _type: "theme",
    bg: "#0A0E17",
    surface: "#121828",
    surface2: "#1A2135",
    surfaceEnd: "#0c1220",
    deep: "#06090F",
    raised: "#0d1220",
    accent: "#58B0FF",
    accentHover: "#70C0FF",
    accentSoft: "rgba(88,176,255,.10)",
    onAccent: "#040B17",
    text: "#E9EDF6",
    muted: "#8A93A9",
    dim: "#7782A3",
    line: "rgba(255,255,255,.09)",
    lineSoft: "rgba(255,255,255,.05)",
    placeholder: "#5E6886",
    fontDisplay: "'Space Grotesk Variable', 'Space Grotesk', sans-serif",
    fontBody: "'IBM Plex Sans Variable', 'IBM Plex Sans', sans-serif",
    fontMono: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
  },
  catalogLabel: "Soluciones",
  header: {
    nav: keyed([
      {
        _type: "navMenu",
        id: "soluciones",
        label: "Soluciones",
        blurb: "Cuatro entradas al mismo catálogo: elige por objetivo, producto, canal o herramienta.",
        layout: "mega",
        columns: keyed(catalogColumns),
      },
      {
        _type: "navMenu",
        id: "nosotros",
        label: "Nosotros",
        blurb: "Quiénes somos y cómo contactarnos.",
        layout: "list",
        columns: keyed([
          {
            _type: "navColumn",
            items: keyed(ABOUT_LINKS.map((n) => ({ _type: "navItem", title: n.title, description: n.desc, href: `#${n.anchor}` }))),
          },
        ]),
      },
    ]),
    cta: { _type: "link", label: "Agenda una demo", href: "#contacto" },
    backLabel: "← Inicio",
    pageCta: { _type: "link", label: "Contactar", href: "#contacto" },
    minimalBackLabel: "← VOLVER AL INICIO",
  },
  footer: {
    tagline: "Tu partner estratégico en publicidad full-funnel.",
    columns: keyed([
      ...catalogColumns,
      {
        _type: "navColumn",
        title: "Compañía",
        items: keyed([
          { _type: "navItem", title: "Nosotros", href: "#nosotros" },
          { _type: "navItem", title: "Contacto", href: "#contacto" },
        ]),
      },
    ]),
    bottomText: "PERÚ · MÉXICO · ECUADOR · CHILE · © MEDIAUDIENCE",
    legalLabel: "TÉRMINOS Y CONDICIONES",
    legalPage: ref(pageId(LEGAL_PATH)),
  },
  redirects: keyed([
    { _type: "redirect", from: "/panel", to: "https://hub.mediaudience.com", status: 301, force: true },
    { _type: "redirect", from: "/panel/*", to: "https://hub.mediaudience.com", status: 301, force: true },
    { _type: "redirect", from: "/mediaudience%20web", to: "/", status: 301, force: false },
    { _type: "redirect", from: "/mediaudience%20web.html", to: "/", status: 301, force: false },
    { _type: "redirect", from: "/Mediaudience%20Web.html", to: "/", status: 301, force: false },
    { _type: "redirect", from: "/*", to: "/index.html", status: 200, force: false },
  ]),
};

/* ---------- Catalog ---------- */

const categories: SanityDoc[] = (["obj", "prod", "ch", "tool"] as GroupId[]).map((g, i) => ({
  _id: categoryId(g),
  _type: "category",
  site: siteRef,
  title: GROUPS[g].name,
  slug: { _type: "slug", current: CATEGORY_SLUG[g] },
  anchor: GROUPS[g].anchor,
  order: i + 1,
}));

const itemBase = (g: GroupId, slug: string, title: string, order: number) => ({
  _id: itemId(g, slug),
  _type: "item",
  site: siteRef,
  category: ref(categoryId(g)),
  title,
  slug: { _type: "slug", current: slug },
  order,
});

const items: SanityDoc[] = [
  ...OBJECTIVES.map((o, i) => ({
    ...itemBase("obj", o.id, o.name, i + 1),
    meta: o.stage,
    headline: o.headline,
    text: o.desc,
    chips: o.kpis,
    recommended: keyed(o.recs.map((id) => ref(itemId("prod", id)))),
    page: pageRefFor(o.id),
  })),
  ...PRODUCTS.map((p, i) => ({
    ...itemBase("prod", p.id, p.name, i + 1),
    meta: chName(p.ch).toUpperCase(),
    text: p.desc,
    stat: p.stat,
    statLabel: p.statLabel,
    bullets: p.bullets,
    related: keyed([ref(itemId("ch", p.ch)), ...p.objs.map((id) => ref(itemId("obj", id)))]),
    page: pageRefFor(p.id),
  })),
  ...CHANNELS.map((c, i) => ({
    ...itemBase("ch", c.id, c.name, i + 1),
    meta: `${c.stat} ${c.statLabel}`,
    text: c.desc,
    stat: c.stat,
    statLabel: c.statLabel,
    page: pageRefFor(`ch-${c.id}`),
  })),
  ...TOOLS.map((t, i) => ({
    ...itemBase("tool", toolSlug(t), t.name, i + 1),
    meta: t.code,
    text: t.desc,
    page: t.slug ? pageRefFor(t.slug) : undefined,
  })),
];

/* ---------- Pages ---------- */

const contact = {
  contactTitle: "Contacto",
  contactSubtitle: "Mediaudience Latam",
  email: MAIL,
  note: "RESPUESTA EN 24–48 H",
};

const homeSections = keyed([
  {
    _type: "hero",
    anchor: "top",
    variant: "landing",
    tone: "base",
    decor: ["glow-top-right", "lines"],
    eyebrow: "AdTech · Data-driven",
    title: "Conectamos marcas con audiencias reales",
    titleHighlight: "audiencias reales",
    text: "Soluciones publicitarias full-funnel — Connected TV, Mobile Push Premium, Programmatic y Gaming — con inventario premium y First Party Data.",
    actions: keyed([
      { _type: "buttonLink", label: "Empieza por tu objetivo", href: "#objetivos", style: "primary" },
      { _type: "buttonLink", label: "Ver productos", href: "#productos", style: "secondary" },
    ]),
    aside: keyed([
      {
        _type: "heroStatTabs",
        id: "paises",
        title: "KPIS POR PAÍS",
        ariaLabel: "País",
        tabs: keyed(
          COUNTRIES.map((c) => ({
            _type: "statTab",
            id: c.code.toLowerCase(),
            label: c.name,
            meta: `${c.code} · 2025`,
            stats: keyed(c.kpis.map((value, i) => ({ _type: "stat", value, label: KPI_LABELS[i] }))),
          })),
        ),
      },
    ]),
  },
  {
    _type: "catalogTabs",
    anchor: "objetivos",
    eyebrow: "01 · Objetivos",
    title: "¿Qué quieres lograr?",
    intro: "Elige tu objetivo y te mostramos los productos y KPIs que lo mueven.",
    category: ref(categoryId("obj")),
    ariaLabel: "Objetivos",
    chipsLabel: "KPIS QUE OPTIMIZAMOS",
    cardsLabel: "PRODUCTOS RECOMENDADOS",
    cardLinkLabel: "Ver producto",
    ctaLabel: "Conoce más sobre {title}",
  },
  {
    _type: "catalogFilterGrid",
    anchor: "productos",
    tone: "surface",
    eyebrow: "02 · Productos",
    title: "Formatos para cada pantalla",
    category: ref(categoryId("prod")),
    filterCategory: ref(categoryId("ch")),
    chipsCategory: ref(categoryId("obj")),
    filterAriaLabel: "Filtrar por canal",
    allLabel: "Todos",
    ctaLabel: "Ver {title}",
    cardAnchorPrefix: "p-",
  },
  {
    _type: "catalogGrid",
    anchor: "canales",
    eyebrow: "03 · Canales",
    title: "Donde está tu audiencia",
    category: ref(categoryId("ch")),
    primaryLabel: "Ver canal",
    countCategory: ref(categoryId("prod")),
    countSingular: "producto",
    countPlural: "productos",
  },
  {
    _type: "featureList",
    anchor: "herramientas",
    tone: "deep",
    decor: ["grid"],
    eyebrow: "04 · Herramientas",
    title: "La tecnología detrás de cada campaña",
    intro: "Datos, segmentación y medición incluidos en todos los productos — sin monto mínimo.",
    category: ref(categoryId("tool")),
    linkLabel: "Ver más",
  },
  {
    _type: "statGrid",
    anchor: "resultados",
    tone: "surface",
    layout: "cards",
    eyebrow: "Resultados",
    title: "Campañas que superan el estándar",
    items: keyed([
      { _type: "statItem", eyebrow: "RASPADITAS · CTV", value: "94.5%", text: "VTR con 100% de viewability · 294K impresiones.", highlight: true },
      { _type: "statItem", eyebrow: "DIRECTV · PUSH", value: "13.3%", text: "CTR captando clientes en zonas con servicio disponible." },
      { _type: "statItem", eyebrow: "MOVISTAR · PRIME VIDEO", value: "9.3%", text: "CTR con GeoPush a usuarios con apps de streaming." },
    ]),
  },
  {
    _type: "cardGrid",
    anchor: "nosotros",
    layout: "split",
    numbering: "none",
    eyebrow: "Por qué Mediaudience",
    title: "Tu partner estratégico en la región",
    intro:
      "Empresa 100% peruana con más de 6 años de experiencia y operación en Ecuador, respaldada por partners tecnológicos líderes a nivel mundial.",
    cards: keyed([
      { _type: "card", title: "Único formato de Claro", text: "El único formato enviado por el teleoperador Claro.", highlight: true },
      { _type: "card", title: "First Party Data", text: "Segmentación óptima con datos propios de la telco." },
      { _type: "card", title: "Inventario premium", text: "Primera línea de compra como SSP." },
      { _type: "card", title: "KPIs óptimos", text: "Optimización constante y reportes transparentes." },
    ]),
  },
  {
    _type: "contactSection",
    anchor: "contacto",
    decor: ["glow-bottom-left"],
    title: "¿Listos para activar tu próxima campaña?",
    text: "Agenda una demo y diseñamos una estrategia full-funnel a la medida de tus objetivos.",
    ...contact,
  },
]);

const DEFAULT_POINTS_TITLE: Record<GroupId, string> = { obj: "Cómo lo logramos", prod: "Qué incluye", ch: "Qué incluye", tool: "Cómo funciona" };
const kv = (rows: [string, string][] = []) => keyed(rows.map(([key, value]) => ({ _type: "keyValue", key, value })));

function solutionSections(key: string) {
  const p: SolutionDetail = SOLUTIONS[key];
  const group = GROUPS[p.g];
  const s: Record<string, unknown>[] = [];

  s.push({
    _type: "hero",
    variant: "page",
    decor: ["glow-top-right", "lines"],
    breadcrumb: keyed([
      { _type: "link", label: "Soluciones", href: "/" },
      { _type: "link", label: group.name, href: `/#${group.anchor}` },
    ]),
    eyebrow: p.tag,
    title: p.name,
    lead: p.headline,
    text: p.desc,
    actions: keyed([
      { _type: "buttonLink", label: `Quiero activar ${p.name}`, href: "#contacto", style: "primary" },
      {
        _type: "buttonLink",
        label: "Escríbenos por correo",
        href: `mailto:${MAIL}?subject=${encodeURIComponent(`Consulta: ${p.name}`)}`,
        style: "secondary",
      },
    ]),
    aside: keyed([{ _type: "heroStatCard", label: group.name, value: p.stat, caption: p.statLabel }]),
  });

  s.push({
    _type: "cardGrid",
    numbering: "top",
    eyebrow: p.pointsTitle ?? DEFAULT_POINTS_TITLE[p.g],
    cards: keyed(p.points.map(([title, text]) => ({ _type: "card", title, text }))),
    chipsLabel: p.list?.length ? p.listTitle : undefined,
    chips: p.list?.length ? p.list : undefined,
  });

  if (p.what) {
    s.push({ _type: "splitList", tone: "surface", eyebrow: "Qué es", statement: p.what.text, listLabel: p.what.listTitle, listStyle: "bullets", items: p.what.items });
  }
  if (p.variants) {
    s.push({
      _type: "variantCards",
      eyebrow: p.variants.eyebrow,
      title: p.variants.title,
      note: p.variants.note || undefined,
      cards: keyed(
        p.variants.items.map(([title, text, rows, badge]) => ({ _type: "variantCard", title, text, badge, highlight: !!badge, rows: kv(rows) })),
      ),
    });
  }
  if (p.ctx) {
    s.push({
      _type: "statGrid",
      layout: "cells",
      eyebrow: p.ctx.eyebrow,
      title: p.ctx.title,
      items: keyed(p.ctx.stats.map((x) => ({ _type: "statItem", value: x.v, text: x.l }))),
      highlightsLabel: p.ctx.blocks.length ? "BLOQUES DE CONSUMO" : undefined,
      highlights: p.ctx.blocks.length ? keyed(p.ctx.blocks.map(([title, meta, note]) => ({ _type: "statHighlight", title, meta, note }))) : undefined,
      source: p.ctx.source,
    });
  }
  if (p.segs) {
    s.push({
      _type: "cardGrid",
      tone: "surface",
      numbering: "inline",
      eyebrow: "Segmentación",
      title: p.segsTitle,
      cards: keyed(p.segs.map(([title, text]) => ({ _type: "card", title, text }))),
    });
  }
  if (p.formats) {
    s.push({
      _type: "splitList",
      eyebrow: p.formats.eyebrow,
      title: p.formats.title,
      text: p.formats.desc,
      tiles: p.formats.placements.length ? p.formats.placements : undefined,
      listLabel: p.formats.listTitle,
      listStyle: "numbered",
      items: p.formats.interactive,
    });
  }
  if (p.specs) {
    s.push({
      _type: "specTable",
      tone: "deep",
      eyebrow: p.specsEyebrow ?? "Especificaciones técnicas",
      title: p.specsTitle ?? "Material requerido",
      rows: kv(p.specs),
      notes: p.specNotes?.length ? p.specNotes : undefined,
      tipsLabel: p.tips ? (p.tipsTitle ?? "RECOMENDACIONES") : undefined,
      tips: p.tips,
    });
  }
  if (p.flow) {
    s.push({ _type: "stepFlow", decor: ["glow-top-right-soft"], eyebrow: p.flow.eyebrow, title: p.flow.title, text: p.flow.desc, steps: p.flow.steps, note: p.flow.note });
  }

  s.push({
    _type: "relatedItems",
    tone: "surface",
    eyebrow: "Se combina con",
    linkLabel: "Ver página",
    items: keyed(p.rel.filter((r) => SOLUTIONS[r]).map((r) => ref(itemIdForSolution(r)))),
  });

  s.push({
    _type: "contactSection",
    anchor: "contacto",
    decor: ["glow-bottom-left"],
    eyebrow: "Contacto",
    title: `Hablemos de ${p.name}`,
    text: "Cuéntanos tu objetivo y armamos una propuesta a medida. Sin monto mínimo.",
    ...contact,
    emailSubject: `Consulta: ${p.name}`,
    form: {
      enabled: true,
      subject: `Consulta: ${p.name}`,
      contextLabel: "Producto",
      contextValue: p.name,
      fields: keyed([
        { _type: "formField", name: "name", label: "Nombre", type: "text", required: true, placeholder: "Tu nombre" },
        { _type: "formField", name: "company", label: "Empresa", type: "text", placeholder: "Marca o agencia" },
        { _type: "formField", name: "email", label: "Correo", type: "email", required: true, placeholder: "nombre@empresa.com" },
        { _type: "formField", name: "country", label: "País", type: "select", options: ["Perú", "México", "Ecuador", "Chile", "Otro"] },
        { _type: "formField", name: "message", label: "Mensaje", type: "textarea", placeholder: "Objetivo, fechas y presupuesto estimado" },
      ]),
      submitLabel: "Enviar consulta",
      successMessage: "Abrimos tu correo con la consulta lista para enviar.",
    },
  });

  return keyed(s);
}

/** Portable Text paragraph; `link` turns the matching substring into a link. */
function paragraph(text: string, link?: { text: string; href: string }) {
  const children: Record<string, unknown>[] = [];
  const markDefs: Record<string, unknown>[] = [];
  if (link && text.includes(link.text)) {
    const [before, after] = text.split(link.text);
    if (before) children.push({ _type: "span", text: before, marks: [] });
    markDefs.push({ _key: "l1", _type: "link", href: link.href });
    children.push({ _type: "span", text: link.text, marks: ["l1"] });
    if (after) children.push({ _type: "span", text: after, marks: [] });
  } else {
    children.push({ _type: "span", text, marks: [] });
  }
  return { _type: "block", style: "normal", markDefs, children: keyed(children) };
}

const LEGAL_SECTIONS: [string, string][] = [
  ["1. Aceptación", "El acceso y uso de este sitio implica la aceptación de estos Términos y Condiciones. Si no está de acuerdo con ellos, le pedimos no utilizar el sitio."],
  ["2. Sobre Mediaudience", "Mediaudience es una compañía de AdTech que opera como SSP y representante de medios digitales en Perú, México, Ecuador y Chile. La información del sitio describe nuestros productos y servicios con fines informativos."],
  ["3. Uso del sitio", "El usuario se compromete a utilizar el sitio de forma lícita y a no realizar acciones que afecten su funcionamiento, seguridad o disponibilidad."],
  ["4. Propiedad intelectual", "Marcas, logotipos, textos, gráficos y demás contenidos del sitio pertenecen a Mediaudience o a sus licenciantes. No pueden reproducirse ni distribuirse sin autorización escrita."],
  ["5. Servicios y contratación", "Las cifras, formatos y resultados mostrados son referenciales. Las condiciones de cada campaña se definen en la propuesta comercial y el contrato correspondientes."],
  ["6. Datos personales", "Los datos enviados a través de los canales de contacto se usan únicamente para responder consultas y coordinar servicios, conforme a la normativa de protección de datos aplicable en cada país."],
  ["7. Enlaces a terceros", "El sitio puede incluir enlaces a sitios de terceros. Mediaudience no se responsabiliza por sus contenidos ni por sus políticas."],
  ["8. Responsabilidad", "Mediaudience procura que la información sea exacta y esté actualizada, pero no garantiza la ausencia de errores ni la disponibilidad ininterrumpida del sitio."],
  ["9. Modificaciones", "Estos términos pueden actualizarse en cualquier momento. La versión vigente es la publicada en esta página."],
  ["10. Contacto", `Consultas sobre estos términos: ${MAIL}`],
];

const pages: SanityDoc[] = [
  {
    _id: pageId(""),
    _type: "page",
    site: siteRef,
    title: "Inicio",
    seo: { _type: "seo", title: site.seo.title, description: site.seo.description },
    header: "full",
    footer: "full",
    sections: homeSections,
  },
  ...Object.entries(PAGE_PATHS).map(([key, path]) => ({
    _id: pageId(path),
    _type: "page",
    site: siteRef,
    title: SOLUTIONS[key].name,
    path,
    seo: { _type: "seo", title: `${SOLUTIONS[key].name} · Mediaudience`, description: SOLUTIONS[key].desc },
    header: "compact",
    footer: "minimal",
    sections: solutionSections(key),
  })),
  {
    _id: pageId(LEGAL_PATH),
    _type: "page",
    site: siteRef,
    title: "Términos y Condiciones",
    path: LEGAL_PATH,
    seo: { _type: "seo", title: "Términos y Condiciones · Mediaudience" },
    header: "minimal",
    footer: "minimal",
    sections: keyed([
      {
        _type: "richText",
        eyebrow: "Legal",
        title: "Términos y Condiciones",
        meta: "ÚLTIMA ACTUALIZACIÓN · OCTUBRE 2026",
        sections: keyed(
          LEGAL_SECTIONS.map(([title, text]) => ({
            _type: "richTextSection",
            title,
            body: keyed([paragraph(text, { text: MAIL, href: `mailto:${MAIL}` })]),
          })),
        ),
      },
    ]),
  },
];

export const documents: SanityDoc[] = [site, ...categories, ...items, ...pages];
