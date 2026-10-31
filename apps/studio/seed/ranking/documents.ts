/**
 * Builds the Sanity documents of ranking.ec from the prototype's sample data (./source, copied from
 * apps/web/src/sites/ranking during the static port). IDs are deterministic and start with "ranking-",
 * so re-importing with --replace updates the same documents and the sample is easy to delete.
 * After the import, Sanity is the source of truth: edit content in the Studio, not here.
 */
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { keyed, ref, type SanityDoc } from "../lib";
import { ARTICLES, MOST_READ, MOVEMENTS, OPEN_CALLS, OPINION_AUTHORS, SECTIONS, type Article } from "./source/content";
import { EVENTS } from "./source/events";
import { ORGANIZATIONS } from "./source/organizations";
import { DOCS, FORMS, ISSUES, UPDATED } from "./source/pages";
import { AWARDS, EDITIONS, ORGANIZERS, slugify, type Award, type Edition, type Result } from "./source/registry";
import type { ArticleBodyNode, EdFeatureNode, MedalLevel } from "./source/types";

const SITE = "ranking";
const SITE_ID = `site-${SITE}`;
const site = ref(SITE_ID);
const P = `${SITE}-`;

const ASSETS = join(dirname(fileURLToPath(import.meta.url)), "assets");
const imageAsset = (file: string) => `image@${pathToFileURL(join(ASSETS, file)).href}`;

/* ---------- IDs ---------- */

const id = {
  article: (slug: string) => `${P}article-${slug}`,
  author: (name: string) => `${P}author-${slugify(name)}`,
  topic: (title: string) => `${P}topic-${slugify(title)}`,
  sector: (title: string) => `${P}sector-${slugify(title)}`,
  organizer: (slug: string) => `${P}organizer-${slug}`,
  org: (slug: string) => `${P}org-${slug}`,
  award: (slug: string) => `${P}award-${slug}`,
  edition: (award: string, year: number) => `${P}edition-${award}-${year}`,
  event: (slug: string) => `${P}event-${slug}`,
  page: (slug: string) => `${P}page-${slug}`,
};

const slug = (current: string) => ({ _type: "slug", current });

/* ---------- Portable Text ---------- */

let spanKey = 0;
const block = (text: string, style = "normal") => ({
  _type: "block",
  style,
  markDefs: [],
  children: [{ _type: "span", _key: `s${spanKey++}`, text, marks: [] }],
});

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
/** "24 oct 2026" → "2026-10-24". */
const isoDate = (text: string) => {
  const [d, m, y] = text.split(" ");
  return `${y}-${String(MONTHS.indexOf(m) + 1).padStart(2, "0")}-${d.padStart(2, "0")}`;
};

/* ---------- Registry ---------- */

/**
 * Awards and editions the directory and the sample profile mention but the registry sample lacks.
 * Placeholders (organizer, description and dates are not in the prototypes): replace them in the Studio.
 */
const EXTRA_ORGANIZERS = [
  { slug: "effie-ecuador", name: "Effie Ecuador", description: "" },
  { slug: "premio-nacional-a-la-calidad", name: "Premio Nacional a la Calidad", description: "" },
];
const EXTRA_AWARDS: Award[] = [
  {
    slug: "effie-awards-ecuador",
    name: "Effie Awards Ecuador",
    type: "premio",
    category: "Marketing",
    organizer: "effie-ecuador",
    scope: "Nacional",
    periodicity: "Anual",
    firstEdition: 0,
    website: "",
    description: "Premios a la eficacia de las campañas de comunicación comercial.",
    unit: "campañas",
  },
  {
    slug: "premio-nacional-a-la-calidad",
    name: "Premio Nacional a la Calidad",
    type: "premio",
    category: "Calidad",
    organizer: "premio-nacional-a-la-calidad",
    scope: "Nacional",
    periodicity: "Anual",
    firstEdition: 0,
    website: "",
    description: "Reconocimiento a la gestión de calidad de las organizaciones.",
    unit: "empresas",
  },
];
const EXTRA_EDITION_DATES: Record<string, string> = {
  "premios-verdes-2025": "2025-10-16",
  "effie-awards-ecuador-2026": "2026-10-20",
  "premio-nacional-a-la-calidad-2024": "2024-11-26",
};

const awards = [...AWARDS, ...EXTRA_AWARDS];
const editions: Edition[] = EDITIONS.map((e) => ({ ...e, results: [...e.results] }));
const orgSlugs = new Set(ORGANIZATIONS.map((o) => o.slug));

const LEVEL_BY_TEXT: Record<string, MedalLevel> = {
  "Gran Premio": "grand",
  Oro: "oro",
  Plata: "plata",
  Bronce: "bronce",
  Mención: "mencion",
  Finalista: "finalista",
};

/** "3.º lugar" → position, "Oro" → level, anything else → label. */
function parseResult(text: string): Partial<Result> {
  const position = text.match(/^(\d+)\.(?:er|º) (?:lugar|del sector)$/);
  if (position) return { position: Number(position[1]) };
  if (LEVEL_BY_TEXT[text]) return { level: LEVEL_BY_TEXT[text] };
  return { label: text };
}

function editionFor(awardName: string, year: number): Edition {
  const a = awards.find((x) => x.name === awardName);
  if (!a) throw new Error(`Unknown award "${awardName}"`);
  let e = editions.find((x) => x.award === a.slug && x.year === year);
  if (!e) {
    const published = EXTRA_EDITION_DATES[`${a.slug}-${year}`];
    if (!published) throw new Error(`No date for the placeholder edition ${a.slug} ${year}`);
    e = { award: a.slug, year, number: 0, published, total: 0, summary: a.description, results: [] };
    editions.push(e);
  }
  return e;
}

/** Adds a recognition shown in the directory or a profile to its edition, unless the organization is already there. */
function addRecognition(org: string, awardName: string, year: number, text: string, extra: Partial<Result> = {}) {
  const e = editionFor(awardName, year);
  if (e.results.some((r) => r.org === org)) return;
  e.results.push({ name: "", org, ...parseResult(text), ...extra });
}

for (const o of ORGANIZATIONS) {
  const [, awardName, year, text] = o.lastRecognition.match(/^(.+) (\d{4}) · (.+)$/)!;
  addRecognition(o.slug, awardName, Number(year), text);
  for (const r of o.recognitionsByYear ?? []) {
    const parsed = parseResult(r.result);
    addRecognition(o.slug, r.award, r.year, r.result, { category: r.category, ...(parsed.label ? { level: r.level } : {}) });
  }
}

const sectorNames = [...new Set(ORGANIZATIONS.map((o) => o.sector))];
const SHORT_SECTOR: Record<string, string> = Object.fromEntries(
  ORGANIZATIONS.filter((o) => o.shortSector).map((o) => [o.sector, o.shortSector!]),
);

const sectors: SanityDoc[] = sectorNames.map((title, i) => ({
  _id: id.sector(title),
  _type: "sector",
  site,
  title,
  shortTitle: SHORT_SECTOR[title],
  slug: slug(slugify(title)),
  order: i + 1,
}));

const eventOrganizerNames = [...new Set(EVENTS.map((e) => e.organizer))];
const organizerList = [
  ...ORGANIZERS,
  ...EXTRA_ORGANIZERS,
  ...eventOrganizerNames.filter((n) => !ORGANIZERS.some((o) => o.name === n)).map((name) => ({ slug: slugify(name), name, description: "" })),
];
const organizerIdByName = (name: string) => {
  const o = organizerList.find((x) => x.name === name);
  if (!o) throw new Error(`Unknown organizer "${name}"`);
  return id.organizer(o.slug);
};

const organizers: SanityDoc[] = organizerList.map((o) => ({
  _id: id.organizer(o.slug),
  _type: "organizer",
  site,
  name: o.name,
  slug: slug(o.slug),
  description: o.description || undefined,
}));

const organizations: SanityDoc[] = ORGANIZATIONS.map((o) => ({
  _id: id.org(o.slug),
  _type: "organization",
  site,
  name: o.name,
  slug: slug(o.slug),
  sector: ref(id.sector(o.sector)),
  city: o.city,
  founded: o.founded,
  employees: o.employees,
  website: o.website,
  linkedin: o.linkedin,
  description: o.description,
  verified: o.verified,
  updatedAt: o.updated ? isoDate(o.updated) : undefined,
}));

const awardDocs: SanityDoc[] = awards.map((a) => {
  const call = OPEN_CALLS.find((c) => c.award === a.name);
  // The call closes in the year of its edition ("15 ene" of "Edición 2027").
  const closes = call && `${call.closes} ${call.edition.match(/\d{4}/)![0]}`;
  return {
    _id: id.award(a.slug),
    _type: "award",
    site,
    name: a.name,
    fullName: a.fullName,
    slug: slug(a.slug),
    type: a.type,
    category: a.category,
    organizer: ref(id.organizer(a.organizer)),
    scope: a.scope,
    periodicity: a.periodicity,
    firstEdition: a.firstEdition || undefined,
    website: a.website || undefined,
    description: a.description,
    unit: a.unit,
    corporate: !!a.corporate,
    family: a.family,
    about: a.about && keyed(a.about.map((x) => ({ _type: "titledText", ...x }))),
    nextEdition: a.nextEdition && {
      year: a.nextEdition.year,
      steps: keyed(a.nextEdition.steps.map((s) => ({ _type: "milestone", ...s }))),
      note: a.nextEdition.note,
    },
    call: call && { status: call.status, edition: call.edition, closesAt: isoDate(closes!) },
  };
});

const editionDocs: SanityDoc[] = editions.map((e) => ({
  _id: id.edition(e.award, e.year),
  _type: "edition",
  site,
  award: ref(id.award(e.award)),
  year: e.year,
  number: e.number || undefined,
  publishedAt: e.published,
  total: e.total || undefined,
  summary: e.summary,
  intro: e.intro,
  methodology: e.methodology && {
    text: e.methodology.text,
    weights: keyed(e.methodology.weights.map((w) => ({ _type: "weight", ...w }))),
  },
  results: keyed(
    e.results.map((r) => {
      const hasProfile = !!r.org && orgSlugs.has(r.org);
      return {
        _type: "editionResult",
        organization: hasProfile ? ref(id.org(r.org!)) : undefined,
        name: hasProfile ? undefined : r.name,
        position: r.position,
        level: r.level,
        label: r.label,
        category: r.category,
        sector: r.sector,
        score: r.score,
        change: r.change,
      };
    }),
  ),
}));

/* ---------- Events ---------- */

/** Previous Merco galas (the prototype only gives year and venue; the day is a placeholder). */
const MERCO_GALA = EVENTS.find((e) => e.slug === "gala-merco-empresas-2026")!;
const pastGalas = (MERCO_GALA.previous ?? []).map((p) => {
  const [city, venue] = p.detail.split(" · ");
  return {
    slug: `gala-merco-empresas-${p.year}`,
    date: `${p.year}-12-02`,
    time: undefined,
    type: "gala" as const,
    name: `Gala Merco Empresas ${p.year}`,
    short: "Gala Merco",
    organizer: "Merco",
    city,
    venue,
    award: { slug: "merco-empresas", year: p.year },
  };
});

const eventDocs: SanityDoc[] = [...EVENTS, ...pastGalas].map((e) => {
  const d = "featured" in e ? e : undefined;
  return {
    _id: id.event(e.slug),
    _type: "event",
    site,
    name: e.name,
    shortName: e.short,
    slug: slug(e.slug),
    type: e.type,
    date: e.date,
    time: e.time,
    organizer: ref(organizerIdByName(e.organizer)),
    city: e.city,
    venue: e.venue,
    edition: e.award ? ref(id.edition(e.award.slug, e.award.year)) : undefined,
    hasPage: !!d?.featured,
    page: d?.featured && {
      title: d.featured.title,
      highlight: d.featured.highlight,
      dek: d.featured.dek,
      summary: d.featured.summary,
      access: d.access,
      venueDetails: d.venueInfo && {
        name: d.venueInfo.name,
        address: d.venueInfo.address.join("\n"),
        note: d.venueInfo.note,
        mapUrl: d.venueInfo.map,
      },
      delivers: d.delivers && { text: d.delivers.text, items: keyed(d.delivers.items.map((x) => ({ _type: "keyFact", ...x }))) },
      program: d.program && keyed(d.program.map((x) => ({ _type: "programItem", ...x }))),
      follow: d.follow && keyed(d.follow.map((x) => ({ _type: "titledText", ...x }))),
    },
  };
});

/* ---------- Editorial ---------- */

const authorNames = [...new Set(ARTICLES.map((a) => a.author))];
const authors: SanityDoc[] = authorNames.map((name) => ({
  _id: id.author(name),
  _type: "author",
  site,
  name,
  slug: slug(slugify(name)),
  role: OPINION_AUTHORS[name],
}));

const topicTitles = [...new Set(ARTICLES.flatMap((a) => a.topics ?? []))];
const topics: SanityDoc[] = topicTitles.map((title) => ({ _id: id.topic(title), _type: "topic", site, title, slug: slug(slugify(title)) }));

/** "Mencionados en esta nota": registry links → references. */
function mentionRef(href: string) {
  const edition = href.match(/^\/rankings\/([^/]+)\/(\d{4})$/);
  if (edition) return ref(id.edition(edition[1], Number(edition[2])));
  const award = href.match(/^\/rankings\/([^/]+)$/);
  if (award) return ref(id.award(award[1]));
  const org = href.match(/^\/empresas\/([^/]+)$/);
  if (org) return ref(id.org(org[1]));
  const event = href.match(/^\/eventos\/([^/]+)$/);
  if (event) return ref(id.event(event[1]));
  throw new Error(`Unknown mention link "${href}"`);
}

const RATIO_WEIGHTS: Record<string, string> = { "3,2": "3:2", "2,3": "2:3", "1,1": "1:1" };

const imageFields = (img: { caption?: string; credit?: string }) => ({ _type: "editorialImage", caption: img.caption, credit: img.credit });

function standardBody(nodes: ArticleBodyNode[]): object[] {
  return nodes.map((n): object => {
    switch (n._type) {
      case "p":
        return block(n.text);
      case "h2":
        return block(n.text, "h2");
      case "pullQuote":
        return { _type: "pullQuote", text: n.text, author: n.author, role: n.role };
      case "image":
        return { _type: "bodyImage", image: imageFields(n.image), ratio: n.ratio };
      case "rankingTable": {
        // Tables taken from an edition reference it; the rest keep their rows.
        const edition = n.more && n.more.href.match(/^\/rankings\/([^/]+)\/(\d{4})$/);
        return edition
          ? { _type: "rankingTable", edition: ref(id.edition(edition[1], Number(edition[2]))), limit: n.rows.length, highlight: n.highlight, source: n.source, more: n.more && { _type: "link", ...n.more } }
          : { _type: "rankingTable", rows: keyed(n.rows.map((r) => ({ _type: "rankingTableRow", ...r }))), highlight: n.highlight, source: n.source, more: n.more && { _type: "link", ...n.more } };
      }
    }
  });
}

function featureBody(nodes: EdFeatureNode[]): object[] {
  return nodes.flatMap((n): object[] => {
    switch (n._type) {
      case "p":
        // The drop cap goes on the first paragraph automatically.
        return [block(n.text, n.closing ? "closing" : "normal")];
      case "h2":
        return [block(n.text, "h2")];
      case "pullQuote":
        return [{ _type: "pullQuote", text: n.text, author: n.author, role: n.role }];
      case "imagePair":
        return [
          {
            _type: "imagePair",
            weights: RATIO_WEIGHTS[n.weights.join(",")] ?? "1:1",
            images: keyed(n.images.map((img) => ({ _type: "bodyImage", image: imageFields(img), ratio: img.ratio }))),
          },
        ];
      case "recordList": {
        const org = n.more?.href.match(/^\/empresas\/([^/]+)$/);
        return org ? [{ _type: "recordList", title: n.title, organization: ref(id.org(org[1])), limit: n.items.length }] : [];
      }
      case "sponsor":
        return []; // Goes to the article's sponsor fields.
    }
  });
}

/** Articles of the same day keep the prototype's order: the first one is the newest (12:00 Ecuador, then a minute earlier each). */
function publishedAt(a: Article, index: number) {
  const sameDayBefore = ARTICLES.slice(0, index).filter((x) => x.date === a.date).length;
  const [y, m, d] = a.date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 17, 0) - sameDayBefore * 60_000).toISOString();
}

/** Body of the articles whose full text is not in the prototypes. */
const sampleBody = (a: Article) => [...(a.dek ? [block(a.dek)] : []), block("Texto de ejemplo: el contenido completo de esta nota se edita en el Studio.")];

const articles: SanityDoc[] = ARTICLES.map((a, i) => {
  const sponsor = a.feature?.body.find((n) => n._type === "sponsor");
  const body = a.feature ? featureBody(a.feature.body) : a.body ? standardBody(a.body) : sampleBody(a);
  return {
    _id: id.article(a.slug),
    _type: "article",
    site,
    type: a.type,
    kicker: a.kicker,
    title: a.title,
    highlight: a.highlight,
    dek: a.dek,
    slug: slug(a.slug),
    authors: keyed([ref(id.author(a.author))]),
    publishedAt: publishedAt(a, i),
    place: a.place,
    image: a.image && imageFields(a.image),
    layout: a.feature ? "feature" : "standard",
    photoCredit: a.feature?.photoCredit,
    keyFacts: a.keyFacts && keyed(a.keyFacts.map((x) => ({ _type: "keyFact", ...x }))),
    body: keyed(body),
    readingMinutes: a.readTime ? Number.parseInt(a.readTime, 10) : undefined,
    topics: a.topics && keyed(a.topics.map((t) => ref(id.topic(t)))),
    mentions: a.mentions && keyed(a.mentions.map((m) => mentionRef(m.href))),
    sponsored: !!a.sponsored,
    // The prototype shows a logo placeholder: the brand name is a placeholder too.
    sponsor: sponsor && { brand: "Marca auspiciante", label: sponsor.label, note: sponsor.note },
  };
});

/** Appointments: the prototype has no dates, so they get consecutive placeholder days (newest first). */
const movements: SanityDoc[] = MOVEMENTS.map((m, i) => ({
  _id: `${P}movement-${slugify(m.name)}`,
  _type: "movement",
  site,
  person: m.name,
  role: m.role,
  organization: ref(id.org(slugify(m.organization))),
  date: `2026-10-${String(28 - i).padStart(2, "0")}`,
}));

const issues: SanityDoc[] = ISSUES.map(([number, date, title]) => ({
  _id: `${P}newsletter-${number}`,
  _type: "newsletterIssue",
  site,
  number,
  date: isoDate(date),
  title,
}));

/* ---------- Site, settings, front page and pages ---------- */

const DESCRIPTION = "La publicación de registro de los reconocimientos, galardones y premios de las organizaciones en Ecuador.";
const NEWSLETTER_CALLS = "Cada lunes: premios, rankings, eventos y convocatorias de las empresas en Ecuador.";
const NEWSLETTER_NEWS = "Cada lunes: premios, rankings, eventos y las noticias de actualidad de las empresas en Ecuador.";

const NAV = [
  { label: "Actualidad", href: "/actualidad" },
  { label: "Rankings", href: "/rankings" },
  { label: "Empresas", href: "/empresas" },
  { label: "Eventos", href: "/eventos" },
  { label: "Newsletter", href: "/newsletter" },
];
const links = (items: { label: string; href: string }[]) => keyed(items.map((l) => ({ _type: "link", ...l })));

const siteDoc: SanityDoc = {
  _id: SITE_ID,
  _type: "site",
  name: "ranking.ec",
  slug: slug(SITE),
  // Placeholder until the domain is decided.
  url: "https://ranking.netlify.app",
  lang: "es",
  seo: { _type: "seo", title: "ranking.ec", description: DESCRIPTION },
  allowAiCrawlers: true,
  analytics: {},
  logo: {
    _type: "logo",
    label: "ranking.ec, inicio",
    image: { _type: "image", alt: "RANKING", _sanityAsset: imageAsset("logo.svg") },
    wordmark: keyed([
      { _type: "wordmarkPart", text: "RAN", accent: false },
      { _type: "wordmarkPart", text: "KING", accent: true },
    ]),
    mark: "none",
  },
  theme: {
    _type: "theme",
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
    // #FF0000 on white is 3.99:1; small red text uses the design system "rojo hover" (5.2:1).
    accentText: "#D90000",
    premium: "#CBBFA9",
    fontDisplay: '"Bebas Neue", Oswald, "Arial Narrow", sans-serif',
    fontBody: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
    fontMono: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
  },
};

const hub = (eyebrow: string, title: string[], text: string, newsletterText?: string) => ({ _type: "hubIntro", eyebrow, title, text, newsletterText });

const settings: SanityDoc = {
  _id: `${P}editorial`,
  _type: "editorialSettings",
  site,
  masthead: { locale: "Ecuador", nav: links(NAV) },
  footer: {
    logo: { _type: "image", alt: "RANKING", _sanityAsset: imageAsset("logo-white.svg") },
    tagline: DESCRIPTION,
    columns: keyed([
      { _type: "linkGroup", title: "ranking.ec", links: links([...NAV.slice(0, 4), { label: "Ranking Newsletter", href: "/newsletter" }]) },
      {
        _type: "linkGroup",
        title: "Participa",
        links: links(FORMS.map((f) => ({ label: f.label, href: `/participa/${f.slug}` }))),
      },
      {
        _type: "linkGroup",
        title: "Institucional",
        links: links(DOCS.filter((d) => d.slug !== "privacidad").map((d) => ({ label: d.label, href: `/${d.slug}` }))),
      },
    ]),
    bottomLeft: "© 2026 RANKING · Dato & Data",
    bottomRight: "Ecuador",
  },
  sections: keyed(SECTIONS.map((s) => ({ _type: "newsSection", label: s.label, slug: slug(s.slug), types: s.types }))),
  actualidad: hub("Sección", ["Actualidad"], "Noticias, entrevistas, opinión y casos sobre las empresas reconocidas en Ecuador y quienes las dirigen.", NEWSLETTER_NEWS),
  rankings: hub(
    "El registro de ranking.ec",
    ["Quién ganó.", "Qué se publicó.", "Qué viene."],
    "Los rankings, premios y certificaciones que reciben las organizaciones en Ecuador, registrados edición por edición.",
  ),
  rankingsSearch: ["Banco del Litoral", "Premios Verdes", "Summum", "Great Place to Work"],
  empresas: hub("Directorio", ["Empresas"], "Cada organización reconocida en Ecuador, con su ficha, sus galardones y su posición en los rankings, edición por edición."),
  eventos: hub("Agenda", ["Eventos"], "Las galas de premiación, foros y encuentros donde se reconoce y se discute el liderazgo empresarial en el país."),
  newsletterBand: {
    eyebrow: "Ranking Newsletter",
    title: "Ranking Newsletter.",
    text: NEWSLETTER_CALLS,
    cta: "Suscribirme",
    placeholder: "nombre@empresa.com",
    consent: "Acepto la política de tratamiento de datos.",
    success: "Listo. Revisa tu correo para confirmar.",
  },
  newsletterPage: {
    eyebrow: "Cada lunes · 7:00",
    title: ["Ranking", "Newsletter."],
    text: "Quién ganó, qué rankings se publicaron y qué viene en la agenda de las empresas en Ecuador. Cinco minutos de lectura, una vez por semana.",
    totals: keyed([
      { _type: "keyFact", value: "5 min", label: "de lectura" },
      { _type: "keyFact", value: "Lunes", label: "en tu bandeja a las 7:00" },
    ]),
    formTitle: "Suscríbete gratis",
    formNote: "Todos los campos son obligatorios. Sin costo. Puedes darte de baja desde cualquier edición. Tratamos tus datos según nuestra política de privacidad.",
    successEyebrow: "Casi listo",
    successTitle: "Revisa tu correo.",
    successText: "Enviamos un enlace de confirmación a tu correo. La próxima edición llega el lunes.",
    benefitsEyebrow: "En cada edición",
    benefitsTitle: "Qué recibes",
    benefits: keyed(
      [
        { title: "Quién ganó", text: "Los ganadores de la semana en todos los galardones que cubrimos, con enlace a cada ficha." },
        { title: "Rankings publicados", text: "Las nuevas ediciones de los rankings corporativos y quién sube o baja." },
        { title: "La agenda", text: "Las galas, foros y encuentros de los próximos quince días." },
        { title: "Para leer", text: "Las noticias de actualidad de la semana y una entrevista, un análisis o un caso seleccionado por la redacción." },
      ].map((x) => ({ _type: "titledText", ...x })),
    ),
  },
};

const articleRefs = (slugs: string[]) => keyed(slugs.map((s) => ref(id.article(s))));

/** Curation of the prototype's home page. */
const frontPage: SanityDoc = {
  _id: `${P}front-page`,
  _type: "frontPage",
  site,
  lead: ref(id.article("quito-suma-tres-de-los-cinco-mejores-restaurantes-summum")),
  secondary: articleRefs(["premios-verdes-2026-doce-proyectos-llegan-a-la-final", "merco-empresas-la-banca-recupera-tres-puestos"]),
  newsRow: articleRefs([
    "great-place-to-work-lista-2026-once-empresas-debutan",
    "summum-reconocen-restaurante-de-galapagos",
    "abren-inscripciones-premio-nacional-a-la-calidad",
    "guayaquil-y-cuenca-concentran-galardones-a-la-gestion",
  ]),
  opinion: articleRefs(["demasiados-premios-pocos-criterios", "lo-que-un-ranking-de-reputacion-no-puede-medir", "por-que-publicamos-la-metodologia"]),
  interviews: articleRefs([
    "un-reconocimiento-sirve-si-cambia-algo-dentro-de-la-empresa",
    "la-chef-detras-del-mejor-restaurante-del-pais",
    "el-jurado-del-premio-a-la-calidad-explica-que-cambio",
  ]),
  report: ref(id.article("mapa-de-galardones-2026")),
  analysis: articleRefs(["premios-pagados-y-premios-con-jurado", "diez-anos-de-rankings-corporativos", "certificaciones-de-sostenibilidad-con-auditoria-externa"]),
  mostRead: articleRefs(MOST_READ),
  featuredEdition: ref(id.edition("merco-empresas", 2026)),
  featuredEvent: ref(id.event("gala-merco-empresas-2026")),
};

const institutionalPages: SanityDoc[] = DOCS.map((d, i) => ({
  _id: id.page(d.slug),
  _type: "editorialPage",
  site,
  group: "institucional",
  menuLabel: d.label,
  slug: slug(d.slug),
  order: i + 1,
  eyebrow: d.eyebrow,
  title: d.title,
  lead: d.lead,
  sections: keyed(
    d.sections.map(([title, paragraphs, rows]) => ({
      _type: "docSection",
      title,
      body: keyed(paragraphs.map((p) => block(p))),
      rows: rows && keyed(rows.map(([key, value]) => ({ _type: "keyValue", key, value }))),
    })),
  ),
  footnote: {
    text: `Última actualización: ${UPDATED}. ¿Algo no está claro? Escríbenos a`,
    link: { _type: "link", label: "redaccion@ranking.ec", href: "mailto:redaccion@ranking.ec" },
  },
  newsletterText: NEWSLETTER_NEWS,
}));

const participaPages: SanityDoc[] = FORMS.map((f, i) => ({
  _id: id.page(f.slug),
  _type: "editorialPage",
  site,
  group: "participa",
  menuLabel: f.label,
  slug: slug(f.slug),
  order: i + 1,
  eyebrow: "Participa",
  title: f.label,
  lead: f.lead,
  form: f.form.name,
  formCopy: {
    submit: f.form.submit,
    note: f.form.note,
    successEyebrow: f.form.success.eyebrow,
    successTitle: f.form.success.title,
    successText: f.form.success.text,
  },
}));

export const documents: SanityDoc[] = [
  siteDoc,
  settings,
  frontPage,
  ...sectors,
  ...organizers,
  ...organizations,
  ...awardDocs,
  ...editionDocs,
  ...eventDocs,
  ...authors,
  ...topics,
  ...articles,
  ...movements,
  ...issues,
  ...institutionalPages,
  ...participaPages,
];
