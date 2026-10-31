/**
 * Registry sample data of ranking.ec (awards, editions, results), from the prototypes.
 * Fictitious: replaced by the editors' records in Sanity (stage 3).
 */
import type { MedalLevel } from "@microsites/ui/editorial";

export type AwardType = "ranking" | "premio" | "certificacion";

export interface Organizer {
  slug: string;
  name: string;
  description: string;
}

export interface Award {
  slug: string;
  name: string;
  /** Long form used in titles, e.g. "Merco Empresas Ecuador". */
  fullName?: string;
  type: AwardType;
  category: string;
  organizer: string;
  scope: string;
  periodicity: string;
  firstEdition: number;
  website: string;
  description: string;
  /** Unit of the results ("empresas", "líderes"). */
  unit: string;
  /** Corporate rankings appear in "Líderes vigentes". */
  corporate?: boolean;
  /** Awards shown as tabs of the same family on edition pages. */
  family?: { key: string; label: string };
  about?: { title: string; text: string }[];
  nextEdition?: { year: number; steps: { when: string; what: string }[]; note: string };
  /**
   * Top-10 history for "Más premiadas" ("2" first place, "1" top 10, "0" out), since `firstEdition`.
   * Sample data: in Sanity it will be computed from the editions.
   */
  history?: { name: string; years: string }[];
}

export interface Result {
  name: string;
  /** Organization slug, when it has a profile. */
  org?: string;
  sector?: string;
  position?: number;
  level?: MedalLevel;
  /** Text of the result when it is not a position ("Certificada", "Ganador"…). */
  label?: string;
  category?: string;
  score?: number;
  change?: string;
}

export interface Edition {
  award: string;
  year: number;
  number: number;
  /** ISO date. */
  published: string;
  /** Results in the full edition (the registry may hold only the top). */
  total: number;
  /** One line for cards ("Últimas ediciones"). */
  summary: string;
  /** Header text of the edition page (defaults to the award description). */
  intro?: string;
  methodology?: { text: string; weights: { label: string; value: number }[] };
  results: Result[];
}

export const ORGANIZERS: Organizer[] = [
  { slug: "merco", name: "Merco", description: "Monitor de reputación · 12 países" },
  { slug: "great-place-to-work", name: "Great Place to Work Ecuador", description: "Certificación de clima laboral" },
  { slug: "banco-de-fomento-verde", name: "Banco de Fomento Verde", description: "Banca de desarrollo" },
  { slug: "revista-summum", name: "Revista Summum", description: "Gastronomía y hotelería" },
  { slug: "camara-de-comercio-exterior", name: "Cámara de Comercio Exterior", description: "Gremio exportador" },
];

export const AWARDS: Award[] = [
  {
    slug: "merco-empresas",
    name: "Merco Empresas",
    fullName: "Merco Empresas Ecuador",
    type: "ranking",
    category: "Reputación",
    organizer: "merco",
    scope: "Nacional",
    periodicity: "Anual",
    firstEdition: 2013,
    website: "https://www.merco.info",
    description:
      "Monitor Empresarial de Reputación Corporativa. Ordena cada año a las 100 empresas con mejor reputación del país a partir de la opinión de directivos, expertos y ciudadanos.",
    unit: "empresas",
    corporate: true,
    family: { key: "merco", label: "Empresas" },
    about: [
      { title: "Qué mide", text: "La reputación corporativa: ética, calidad de la oferta, resultados, talento, innovación y responsabilidad." },
      { title: "Quién evalúa", text: "Directivos de grandes empresas, analistas, periodistas, catedráticos, ONG y una muestra de ciudadanos." },
      { title: "Cómo se verifica", text: "Cada edición pasa por una revisión independiente de su proceso y sus resultados antes de publicarse." },
    ],
    nextEdition: {
      year: 2027,
      steps: [
        { when: "Mar 2027", what: "Inicio de encuestas a directivos" },
        { when: "Jul 2027", what: "Evaluación de expertos y méritos" },
        { when: "Oct 2027", what: "Publicación de resultados" },
      ],
      note: "Fechas estimadas según ediciones anteriores.",
    },
    history: [
      { name: "Banco del Litoral", years: "11111112212212" },
      { name: "Grupo Pacífico", years: "11112221121121" },
      { name: "Cerámica Andina", years: "01111111111111" },
      { name: "Cervecería del Sur", years: "22221111111110" },
      { name: "Telecom Sierra", years: "11110011111111" },
      { name: "Alimentos del Valle", years: "00011101101111" },
    ],
  },
  {
    slug: "merco-lideres",
    name: "Merco Líderes",
    type: "ranking",
    category: "Liderazgo",
    organizer: "merco",
    scope: "Nacional",
    periodicity: "Anual",
    firstEdition: 2014,
    website: "https://www.merco.info",
    description: "Los 100 líderes empresariales con mejor reputación del país.",
    unit: "líderes",
    corporate: true,
    family: { key: "merco", label: "Líderes" },
  },
  {
    slug: "merco-talento",
    name: "Merco Talento",
    type: "ranking",
    category: "Talento",
    organizer: "merco",
    scope: "Nacional",
    periodicity: "Anual",
    firstEdition: 2015,
    website: "https://www.merco.info",
    description: "Las 100 empresas más atractivas para trabajar según profesionales, estudiantes y expertos.",
    unit: "empresas",
    corporate: true,
    family: { key: "merco", label: "Talento" },
  },
  {
    slug: "merco-responsabilidad-esg",
    name: "Merco Responsabilidad ESG",
    type: "ranking",
    category: "Sostenibilidad",
    organizer: "merco",
    scope: "Nacional",
    periodicity: "Anual",
    firstEdition: 2016,
    website: "https://www.merco.info",
    description: "Las 100 empresas más responsables en gobierno corporativo, ambiente y sociedad.",
    unit: "empresas",
    corporate: true,
    family: { key: "merco", label: "Responsabilidad ESG" },
  },
  {
    slug: "great-place-to-work",
    name: "Great Place to Work",
    type: "certificacion",
    category: "Clima laboral",
    organizer: "great-place-to-work",
    scope: "Nacional",
    periodicity: "Anual",
    firstEdition: 2008,
    website: "https://www.greatplacetowork.com.ec",
    description: "Las mejores empresas para trabajar, según la encuesta a sus colaboradores.",
    unit: "empresas",
    corporate: true,
  },
  {
    slug: "premios-verdes",
    name: "Premios Verdes",
    type: "premio",
    category: "Sostenibilidad",
    organizer: "banco-de-fomento-verde",
    scope: "Nacional",
    periodicity: "Anual",
    firstEdition: 2011,
    website: "https://premiosverdes.ec",
    description: "Reconocimiento a proyectos de sostenibilidad en ocho categorías.",
    unit: "proyectos",
  },
  {
    slug: "premios-summum",
    name: "Premios Summum",
    type: "premio",
    category: "Gastronomía",
    organizer: "revista-summum",
    scope: "Nacional",
    periodicity: "Anual",
    firstEdition: 2005,
    website: "https://summum.ec",
    description: "Lo mejor de la gastronomía ecuatoriana, elegido por un jurado de 300 especialistas.",
    unit: "restaurantes",
  },
  {
    slug: "excelencia-exportadora",
    name: "Excelencia Exportadora",
    type: "premio",
    category: "Exportación",
    organizer: "camara-de-comercio-exterior",
    scope: "Nacional",
    periodicity: "Anual",
    firstEdition: 2010,
    website: "https://comex.ec",
    description: "Las empresas exportadoras con mejor desempeño del año.",
    unit: "empresas",
  },
];

const MERCO_2026: Result[] = [
  ["Banco del Litoral", "Banca", 10000, "▲ 2"],
  ["Grupo Pacífico", "Consumo masivo", 9640, "▼ 1"],
  ["Cerámica Andina", "Industria", 9415, "="],
  ["Alimentos del Valle", "Alimentos", 9120, "▲ 5"],
  ["Telecom Sierra", "Telecomunicaciones", 8970, "▼ 1"],
  ["Banco Andino", "Banca", 8810, "▲ 1"],
  ["Cervecería del Sur", "Bebidas", 8655, "▼ 3"],
  ["Supermercados Costa", "Retail", 8490, "="],
  ["Farmacéutica Ecuatorial", "Salud", 8302, "▲ 4"],
  ["Seguros Equinoccio", "Seguros", 8150, "▲ 2"],
  ["Petroandes", "Energía", 7988, "▼ 2"],
  ["Cooperativa Sierra Sur", "Banca", 7840, "Nueva"],
  ["Lácteos Cotopaxi", "Alimentos", 7702, "▲ 1"],
  ["Aerolíneas del Ecuador", "Transporte", 7590, "▼ 4"],
  ["Cementos Chimborazo", "Industria", 7466, "="],
  ["Clínica Metropolitana", "Salud", 7320, "▲ 6"],
  ["Bebidas Tropicales", "Bebidas", 7208, "▼ 1"],
  ["Exportadora Bananera Oro", "Agroindustria", 7090, "▲ 3"],
  ["Constructora Guayas", "Construcción", 6975, "Nueva"],
  ["Electro Hogar", "Retail", 6860, "▼ 2"],
].map(([name, sector, score, change], i) => ({
  name: name as string,
  org: slugify(name as string),
  sector: sector as string,
  score: score as number,
  change: change as string,
  position: i + 1,
}));

const first = (name: string, extra: Partial<Result> = {}): Result => ({ name, org: slugify(name), position: 1, ...extra });

export const EDITIONS: Edition[] = [
  {
    award: "merco-empresas",
    year: 2026,
    number: 14,
    published: "2026-10-24",
    total: 100,
    summary: "Las 100 empresas con mejor reputación del país. La banca recupera terreno en el top 10.",
    intro: "Las 100 empresas con mejor reputación del país, según directivos, analistas, periodistas, expertos y ciudadanos.",
    methodology: {
      text: "Evaluación multistakeholder en varias etapas: encuesta a directivos, valoración de expertos y verificación de méritos. Auditada de forma independiente.",
      weights: [
        { label: "Directivos", value: 40 },
        { label: "Expertos y analistas", value: 30 },
        { label: "Ciudadanía", value: 20 },
        { label: "Méritos verificados", value: 10 },
      ],
    },
    results: MERCO_2026,
  },
  ...[
    [2025, "Grupo Pacífico", "2025-10-19"],
    [2024, "Banco del Litoral", "2024-10-24"],
    [2023, "Banco del Litoral", "2023-10-19"],
    [2022, "Grupo Pacífico", "2022-10-24"],
    [2021, "Banco del Litoral", "2021-10-19"],
  ].map(([year, winner, published]) => ({
    award: "merco-empresas",
    year: year as number,
    number: (year as number) - 2012,
    published: published as string,
    total: 100,
    summary: "Las 100 empresas con mejor reputación del país.",
    results: [first(winner as string)],
  })),
  {
    award: "premios-verdes",
    year: 2026,
    number: 16,
    published: "2026-10-16",
    total: 24,
    summary: "Reconocimiento a proyectos de sostenibilidad en ocho categorías. 214 postulaciones.",
    results: [
      { name: "Banco del Litoral", org: "banco-del-litoral", level: "grand", category: "Finanzas sostenibles" },
      { name: "Cerámica Andina", org: "ceramica-andina", level: "oro", category: "Economía circular" },
      { name: "Exportadora Bananera Oro", org: "exportadora-bananera-oro", level: "oro", category: "Agroindustria responsable" },
      { name: "Seguros Equinoccio", org: "seguros-equinoccio", level: "plata", category: "Gestión de riesgo climático" },
    ],
  },
  {
    award: "premios-summum",
    year: 2026,
    number: 21,
    published: "2026-10-02",
    total: 42,
    summary: "Lo mejor de la gastronomía ecuatoriana, elegido por un jurado de 300 especialistas.",
    results: [
      { name: "Cervecería del Sur", org: "cerveceria-del-sur", level: "oro", category: "Bebida nacional" },
      { name: "Restaurante Casa Pacífico", level: "oro", category: "Restaurante de cocina ecuatoriana" },
      { name: "Alimentos del Valle", org: "alimentos-del-valle", level: "plata", category: "Proveedor del año" },
    ],
  },
  {
    award: "great-place-to-work",
    year: 2026,
    number: 18,
    published: "2026-10-27",
    total: 48,
    summary: "Las mejores empresas para trabajar en Ecuador.",
    results: [first("Grupo Pacífico", { category: "Más de 1.000 colaboradores" })],
  },
  {
    award: "merco-talento",
    year: 2026,
    number: 12,
    published: "2026-10-08",
    total: 100,
    summary: "Las empresas más atractivas para trabajar.",
    results: [first("Telecom Sierra")],
  },
  {
    award: "merco-lideres",
    year: 2025,
    number: 11,
    published: "2025-11-20",
    total: 100,
    summary: "Los líderes empresariales con mejor reputación.",
    results: [{ name: "Presidente de Banco del Litoral", position: 1 }],
  },
  {
    award: "merco-responsabilidad-esg",
    year: 2025,
    number: 10,
    published: "2025-09-30",
    total: 100,
    summary: "Las empresas más responsables del país.",
    results: [first("Cerámica Andina")],
  },
  {
    award: "excelencia-exportadora",
    year: 2025,
    number: 15,
    published: "2025-12-10",
    total: 24,
    summary: "Las exportadoras con mejor desempeño.",
    results: [{ name: "Exportadora Bananera Oro", org: "exportadora-bananera-oro", label: "Ganador", category: "Agroindustria" }],
  },
];

/** Totals shown on the Rankings hub (registry-wide counts, sample). */
export const REGISTRY_TOTALS = { recognitions: 214, organizations: 96 };

/** Upcoming award galas (sample; the Eventos section will own them). */
export const UPCOMING_AWARD_GALAS = [
  { day: "12", month: "Nov", name: "Great Place to Work · Reconocimiento 2026", place: "Quito · Swissôtel", flag: "Quedan 13 días", soon: true },
  { day: "02", month: "Dic", name: "Gala Merco Empresas 2026", place: "Guayaquil · Hilton Colón", flag: "Quedan 33 días", href: "/eventos/gala-merco-empresas-2026" },
  { day: "09", month: "Dic", name: "Excelencia Exportadora 2026", place: "Guayaquil · Centro de Convenciones", flag: "Quedan 40 días" },
  { day: "22", month: "Ene", name: "Premios Verdes · Entrega regional", place: "Cuenca · Teatro Sucre", flag: "Ene 2027" },
];

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const award = (slug: string) => {
  const a = AWARDS.find((x) => x.slug === slug);
  if (!a) throw new Error(`Unknown award "${slug}"`);
  return a;
};
export const organizer = (slug: string) => ORGANIZERS.find((o) => o.slug === slug)!;
export const editionsOf = (slug: string) => EDITIONS.filter((e) => e.award === slug).sort((a, b) => b.year - a.year);
export const latestEdition = (slug: string) => editionsOf(slug)[0];
export const awardHref = (slug: string) => `/rankings/${slug}`;
export const editionHref = (e: Edition) => `/rankings/${e.award}/${e.year}`;

export const TYPE_LABEL: Record<AwardType, string> = { ranking: "Ranking", premio: "Premio", certificacion: "Certificación" };

/** "1.er lugar", "Oro", "Certificada"… */
export function resultLabel(r: Result): string {
  if (r.label) return r.label;
  if (r.level) return { grand: "Gran Premio", oro: "Oro", plata: "Plata", bronce: "Bronce", mencion: "Mención", finalista: "Finalista" }[r.level];
  if (r.position) return r.position === 1 ? "1.er lugar" : `${r.position}.º lugar`;
  return "";
}

/** Short mark for compact lists: position, or GP / O / P / B / M. */
export function resultMark(r: Result): string {
  if (r.position) return String(r.position);
  if (r.level) return { grand: "GP", oro: "O", plata: "P", bronce: "B", mencion: "M", finalista: "F" }[r.level];
  return "·";
}

/** The winner of an edition: first position or highest level. */
export function topResult(e: Edition): Result | undefined {
  const order: MedalLevel[] = ["grand", "oro", "plata", "bronce", "mencion", "finalista"];
  return [...e.results].sort((a, b) => (a.position ?? 99) - (b.position ?? 99) || order.indexOf(a.level ?? "finalista") - order.indexOf(b.level ?? "finalista"))[0];
}
