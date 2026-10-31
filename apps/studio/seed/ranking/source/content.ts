/**
 * Sample content of ranking.ec, taken from the design prototypes (reference/ranking).
 * Fictitious data: it will move to Sanity in stage 3, where the editors replace it.
 */
import type { ArticleBodyNode, ArticleTeaser, EdFeatureNode, EdImage, MedalLevel } from "./types";

export type ArticleType =
  | "noticia"
  | "entrevista"
  | "opinion"
  | "caso"
  | "campana"
  | "informe"
  | "analisis"
  | "datos"
  | "reportaje";

export interface Article {
  slug: string;
  type: ArticleType;
  kicker: string;
  title: string;
  /** Part of the title shown in the accent color on the article page. */
  highlight?: string;
  dek?: string;
  author: string;
  /** ISO date (yyyy-mm-dd). */
  date: string;
  readTime?: string;
  place?: string;
  image?: EdImage;
  body?: ArticleBodyNode[];
  keyFacts?: { value: string; label: string }[];
  topics?: string[];
  /** Registry records mentioned in the article. */
  mentions?: { type: string; initials: string; name: string; detail: string; cta: string; href: string }[];
  sponsored?: boolean;
  /** Long-form layout (full-bleed photo, centered column) used for reports and brand content. */
  feature?: { photoCredit?: string; body: EdFeatureNode[] };
}

/** Actualidad sections: URL segment and label of each article type. */
export const SECTIONS: { slug: string; label: string; types: ArticleType[] }[] = [
  { slug: "noticias", label: "Noticias", types: ["noticia"] },
  { slug: "entrevistas", label: "Entrevistas", types: ["entrevista"] },
  { slug: "opinion", label: "Opinión", types: ["opinion"] },
  { slug: "casos-y-campanas", label: "Casos y campañas", types: ["caso", "campana"] },
  { slug: "informes", label: "Informes", types: ["informe"] },
];

/** Singular label of each type (article eyebrow). */
export const TYPE_LABEL: Record<ArticleType, string> = {
  noticia: "Noticia",
  entrevista: "Entrevista",
  opinion: "Opinión",
  caso: "Caso",
  campana: "Campaña",
  informe: "Informe",
  analisis: "Análisis",
  datos: "Datos",
  reportaje: "Reportaje",
};

export const sectionOf = (type: ArticleType) => SECTIONS.find((sec) => sec.types.includes(type));

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** "2026-10-29" → "29 oct 2026". */
export function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export const articleHref = (slug: string) => `/actualidad/${slug}`;

export const ARTICLES: Article[] = [
  {
    slug: "quito-suma-tres-de-los-cinco-mejores-restaurantes-summum",
    type: "noticia",
    kicker: "Premios Summum 2026",
    title: "Quito suma tres de los cinco mejores restaurantes del país en los Summum",
    dek: "La edición de este año reconoció a 42 restaurantes y por primera vez premió a cocinas de Galápagos y la Amazonía. La capital recupera el primer lugar de la gastronomía nacional.",
    author: "Redacción ranking.ec",
    date: "2026-10-29",
    readTime: "4 min",
  },
  {
    slug: "premios-verdes-2026-doce-proyectos-llegan-a-la-final",
    type: "noticia",
    kicker: "Sostenibilidad",
    title: "Premios Verdes 2026: doce proyectos empresariales llegan a la final",
    dek: "Energía, agua y economía circular concentran las postulaciones.",
    author: "Redacción ranking.ec",
    date: "2026-10-29",
  },
  {
    slug: "merco-empresas-la-banca-recupera-tres-puestos",
    type: "noticia",
    kicker: "Reputación",
    title: "Merco Empresas: la banca recupera tres puestos en el top 10",
    dek: "La edición incluye por primera vez a empresas públicas.",
    author: "Redacción ranking.ec",
    date: "2026-10-24",
    readTime: "5 min",
  },
  {
    slug: "great-place-to-work-lista-2026-once-empresas-debutan",
    type: "noticia",
    kicker: "Clima laboral",
    title: "Great Place to Work publica su lista 2026: once empresas debutan entre las mejores",
    dek: "El sector agroindustrial suma cuatro de los debuts.",
    author: "Redacción ranking.ec",
    date: "2026-10-29",
  },
  {
    slug: "summum-reconocen-restaurante-de-galapagos",
    type: "noticia",
    kicker: "Gastronomía",
    title: "Los Summum reconocen por primera vez a un restaurante de Galápagos",
    dek: "La categoría de cocina regional se amplía a seis provincias.",
    author: "Redacción ranking.ec",
    date: "2026-10-28",
  },
  {
    slug: "abren-inscripciones-premio-nacional-a-la-calidad",
    type: "noticia",
    kicker: "Convocatorias",
    title: "Abren inscripciones para el Premio Nacional a la Calidad",
    dek: "Las postulaciones cierran el 4 de noviembre.",
    author: "Redacción ranking.ec",
    date: "2026-10-28",
  },
  {
    slug: "guayaquil-y-cuenca-concentran-galardones-a-la-gestion",
    type: "noticia",
    kicker: "Regiones",
    title: "Guayaquil y Cuenca concentran seis de cada diez galardones a la gestión",
    dek: "Quito pierde peso frente a 2024.",
    author: "Redacción ranking.ec",
    date: "2026-10-27",
  },
  {
    slug: "un-reconocimiento-sirve-si-cambia-algo-dentro-de-la-empresa",
    type: "entrevista",
    kicker: "Entrevista",
    title: "«Un reconocimiento sirve si cambia algo dentro de la empresa, no solo en la vitrina»",
    dek: "La gerente general de Cerámica Andina repasa doce años de certificaciones y explica por qué dejó de postular a la mitad de los premios.",
    author: "María José Ortiz",
    date: "2026-10-28",
  },
  {
    slug: "la-chef-detras-del-mejor-restaurante-del-pais",
    type: "entrevista",
    kicker: "Entrevista",
    title: "La chef detrás del mejor restaurante del país: «El premio es del equipo y de los productores»",
    author: "Andrés Vega",
    date: "2026-10-27",
  },
  {
    slug: "el-jurado-del-premio-a-la-calidad-explica-que-cambio",
    type: "entrevista",
    kicker: "Entrevista",
    title: "El jurado del Premio a la Calidad explica qué cambió en la evaluación",
    author: "Redacción",
    date: "2026-10-26",
  },
  {
    slug: "las-10-empresas-con-mejor-reputacion-2026",
    type: "noticia",
    kicker: "Reputación",
    title: "Las 10 empresas con mejor reputación de Ecuador en 2026",
    author: "Redacción ranking.ec",
    date: "2026-10-24",
  },
  {
    slug: "todos-los-ganadores-premios-summum-2026",
    type: "noticia",
    kicker: "Gastronomía",
    title: "Todos los ganadores de los Premios Summum 2026",
    author: "Redacción ranking.ec",
    date: "2026-10-02",
  },
  {
    slug: "lista-completa-mejores-empresas-para-trabajar",
    type: "noticia",
    kicker: "Clima laboral",
    title: "Lista completa: las mejores empresas para trabajar",
    author: "Redacción ranking.ec",
    date: "2026-10-27",
  },
  {
    slug: "cuanto-cuesta-postular-a-un-premio-empresarial",
    type: "analisis",
    kicker: "Análisis",
    title: "¿Cuánto cuesta postular a un premio empresarial?",
    author: "Redacción",
    date: "2026-10-19",
  },
  {
    slug: "calendario-de-premios-y-rankings-2027",
    type: "noticia",
    kicker: "Convocatorias",
    title: "Calendario de premios y rankings para 2027",
    author: "Redacción ranking.ec",
    date: "2026-10-18",
  },
  {
    slug: "demasiados-premios-pocos-criterios",
    type: "opinion",
    kicker: "Opinión",
    title: "Demasiados premios, pocos criterios",
    author: "Paula Cevallos",
    date: "2026-10-25",
  },
  {
    slug: "lo-que-un-ranking-de-reputacion-no-puede-medir",
    type: "opinion",
    kicker: "Opinión",
    title: "Lo que un ranking de reputación no puede medir",
    author: "Jorge Andrade",
    date: "2026-10-22",
  },
  {
    slug: "por-que-publicamos-la-metodologia",
    type: "opinion",
    kicker: "Opinión",
    title: "Por qué publicamos la metodología de cada galardón",
    author: "La Redacción",
    date: "2026-10-21",
  },
  {
    slug: "mapa-de-galardones-2026",
    type: "informe",
    kicker: "Informe ranking.ec",
    title: "Mapa de galardones 2026: 84 premios, rankings y certificaciones activos en Ecuador",
    dek: "Quién los otorga, qué miden y con qué metodología.",
    author: "Equipo de datos",
    date: "2026-10-10",
  },
  {
    slug: "premios-pagados-y-premios-con-jurado",
    type: "analisis",
    kicker: "Análisis",
    title: "Premios pagados y premios con jurado: cómo distinguirlos antes de postular",
    author: "Redacción",
    date: "2026-10-26",
  },
  {
    slug: "diez-anos-de-rankings-corporativos",
    type: "datos",
    kicker: "Datos",
    title: "Diez años de rankings corporativos: las empresas que nunca salieron del top 20",
    author: "Equipo de datos",
    date: "2026-10-22",
  },
  {
    slug: "certificaciones-de-sostenibilidad-con-auditoria-externa",
    type: "analisis",
    kicker: "Análisis",
    title: "Certificaciones de sostenibilidad: cuáles tienen auditoría externa",
    author: "Andrés Vega",
    date: "2026-10-20",
  },
  {
    slug: "cincuenta-anos-en-la-costa-y-una-sola-pregunta",
    type: "reportaje",
    kicker: "Reportaje",
    title: "Cincuenta años en la Costa y una sola pregunta: ¿en quién confías?",
    highlight: "¿en quién confías?",
    dek: "Banco del Litoral llegó este año al primer lugar del ranking de reputación corporativa. Recorrimos sus oficinas de Manta, Machala y Guayaquil para entender qué hay detrás del resultado.",
    author: "Andrea Salazar",
    date: "2026-10-29",
    readTime: "8 min",
    sponsored: true,
    image: { label: "Foto principal del reportaje", caption: "Sucursal del malecón de Manta, la primera que abrió el banco en 1976.", credit: "Foto: Daniela Ruiz" },
    feature: {
      photoCredit: "Fotos de Daniela Ruiz",
      body: [
        { _type: "p", dropCap: true, text: "A las siete de la mañana, antes de que abra la sucursal del malecón de Manta, ya hay una fila de pescadores en la puerta. No vienen a depositar: vienen a preguntar por el crédito de temporada, un producto que el banco diseñó en 1983 y que nunca dejó de ofrecer." },
        { _type: "p", text: "Esa continuidad es, según su gerente general, la explicación más simple del resultado de este año. «No cambiamos de producto cada vez que cambia el mercado. La gente lo nota», dice desde su oficina en Guayaquil." },
        { _type: "h2", text: "Un producto que no cambió en cuarenta años" },
        { _type: "p", text: "El crédito de temporada se paga al ritmo de la pesca, no del calendario. Si una temporada es mala, la cuota se mueve. El modelo se copió después en agricultura y comercio, y hoy representa una de cada cuatro operaciones del banco en la Costa." },
        { _type: "pullQuote", text: "No cambiamos de producto cada vez que cambia el mercado.", author: "Ricardo Mendoza", role: "gerente general" },
        { _type: "h2", text: "La oficina como punto de encuentro" },
        { _type: "p", text: "Mientras otras entidades cerraron agencias, el banco las rediseñó. Las de Machala y Portoviejo tienen salas abiertas para asociaciones de productores, que las usan para reuniones sin costo." },
        {
          _type: "imagePair",
          weights: [3, 2],
          images: [
            { label: "Foto", caption: "Sala comunitaria en la agencia de Machala.", ratio: "3/2" },
            { label: "Foto", caption: "Asesora de crédito en Portoviejo.", ratio: "4/5" },
          ],
        },
        { _type: "h2", text: "Lo que miden los rankings" },
        { _type: "p", text: "El ranking de reputación combina encuestas a directivos, analistas y ciudadanos. El banco obtuvo su mejor nota en ética y responsabilidad, y la más baja en innovación digital, un frente en el que anuncia inversiones para 2027." },
        {
          _type: "recordList",
          title: "Reconocimientos en el registro",
          more: { label: "Ver ficha", href: "/empresas/banco-del-litoral" },
          items: [
            { year: "2026", award: "Merco Empresas · Ranking general", level: "grand", result: "1.º lugar", href: "/rankings/merco-empresas/2026" },
            { year: "2026", award: "Great Place to Work · +1.000 colaboradores", level: "oro", result: "Certificada", href: "/rankings/great-place-to-work" },
            { year: "2025", award: "Premios Verdes · Finanzas sostenibles", level: "finalista", result: "Finalista", href: "/rankings/premios-verdes" },
            { year: "2024", award: "Merco Empresas · Sector financiero", level: "grand", result: "1.º del sector", href: "/rankings/merco-empresas/2024" },
          ],
        },
        { _type: "p", closing: true, text: "De vuelta en Manta, la fila ya se disolvió. Queda un pescador que espera a su asesora para firmar. Viene, dice, porque su padre también venía." },
        {
          _type: "sponsor",
          label: "Contenido de marca · Presentado por",
          logo: "Logo marca",
          note: "Producido por el estudio de contenidos de ranking.ec en el marco de un auspicio. La redacción de noticias no participó en su elaboración. Los datos de reconocimientos provienen del registro y no se modifican por acuerdos comerciales.",
        },
      ],
    },
  },
  // Actualidad (prototype list).
  { slug: "la-banca-recupera-tres-puestos-en-el-top-10-de-reputacion", type: "noticia", kicker: "Merco Empresas 2026", title: "La banca recupera tres puestos en el top 10 de reputación", dek: "Banco del Litoral lidera por segundo año el ranking Merco Empresas Ecuador. Banco Andino sube al sexto lugar y Cooperativa Sierra Sur entra por primera vez al top 20.", author: "Redacción ranking.ec", date: "2026-10-24", readTime: "5 min" },
  { slug: "un-reconocimiento-sirve-si-cambia-algo-grupo-pacifico", type: "entrevista", kicker: "Entrevista", title: "«Un reconocimiento sirve si cambia algo dentro de la empresa»", dek: "La directora de comunicación de Grupo Pacífico habla sobre reputación y clima laboral.", author: "Ana Ortiz", date: "2026-10-22", readTime: "8 min" },
  { slug: "banco-del-litoral-gana-el-gran-premio-por-su-cartera-de-credito-verde", type: "noticia", kicker: "Premios Verdes 2026", title: "Banco del Litoral gana el Gran Premio por su cartera de crédito verde", dek: "El jurado evaluó 214 postulaciones en ocho categorías.", author: "Redacción ranking.ec", date: "2026-10-16", readTime: "3 min" },
  { slug: "demasiados-premios-poca-metodologia", type: "opinion", kicker: "Opinión", title: "Demasiados premios, poca metodología", dek: "Cuando cualquier evento entrega trofeos, el valor de un galardón depende de cómo se elige al ganador.", author: "Carlos Vera", date: "2026-10-15", readTime: "4 min" },
  { slug: "como-ceramica-andina-convirtio-su-planta-en-un-caso-de-economia-circular", type: "caso", kicker: "Caso", title: "Cómo Cerámica Andina convirtió su planta en un caso de economía circular", dek: "Tres años de trabajo, un cambio de proveedores y un Oro en los Premios Verdes.", author: "Lucía Paredes", date: "2026-10-13", readTime: "7 min" },
  { slug: "mapa-de-galardones-2026-que-se-premia-y-quien-lo-organiza", type: "informe", kicker: "Informe ranking.ec", title: "Mapa de galardones 2026: qué se premia y quién lo organiza", dek: "Un recuento de los reconocimientos activos en Ecuador por tipo, organizador y periodicidad.", author: "Equipo de datos", date: "2026-10-10", readTime: "10 min" },
  { slug: "telecom-sierra-encabeza-por-primera-vez-merco-talento", type: "noticia", kicker: "Merco Talento 2026", title: "Telecom Sierra encabeza por primera vez Merco Talento", dek: "La operadora desplaza a la banca del primer puesto del ranking de atracción de talento.", author: "Redacción ranking.ec", date: "2026-10-08", readTime: "3 min" },
  { slug: "la-reputacion-ya-no-se-gestiona-desde-un-solo-departamento", type: "entrevista", kicker: "Entrevista", title: "«La reputación ya no se gestiona desde un solo departamento»", dek: "El presidente de Seguros Equinoccio explica por qué su comité de reputación reporta al directorio.", author: "Diego Salazar", date: "2026-10-06", readTime: "9 min" },
  { slug: "lo-que-un-ranking-no-mide", type: "opinion", kicker: "Opinión", title: "Lo que un ranking no mide", dek: "Las tablas ordenan percepciones; las decisiones de una empresa necesitan algo más que una posición.", author: "María José Andrade", date: "2026-10-02", readTime: "4 min" },
  { slug: "cerveceria-del-sur-y-la-campana-que-devolvio-la-cebada-a-la-sierra", type: "campana", kicker: "Campaña", title: "Cervecería del Sur y la campaña que devolvió la cebada a la Sierra", dek: "Un programa con 600 productores que terminó en un Oro de los Premios Summum.", author: "Lucía Paredes", date: "2026-09-30", readTime: "6 min" },
  { slug: "great-place-to-work-abre-la-medicion-2026-con-record-de-empresas-inscritas", type: "noticia", kicker: "Great Place to Work", title: "Great Place to Work abre la medición 2026 con récord de empresas inscritas", dek: "Participan 148 organizaciones, un 20 % más que el año pasado.", author: "Redacción ranking.ec", date: "2026-09-28", readTime: "3 min" },
  { slug: "la-camara-de-comercio-exterior-anuncia-los-finalistas-de-2026", type: "noticia", kicker: "Excelencia Exportadora", title: "La Cámara de Comercio Exterior anuncia los finalistas de 2026", dek: "Veinticuatro empresas compiten en seis categorías; la gala será el 9 de diciembre.", author: "Redacción ranking.ec", date: "2026-09-25", readTime: "3 min" },
  { slug: "postular-a-un-premio-obliga-a-ordenar-los-datos-de-la-empresa", type: "entrevista", kicker: "Entrevista", title: "«Postular a un premio obliga a ordenar los datos de la empresa»", dek: "La gerente de sostenibilidad de Cerámica Andina cuenta cómo preparan cada postulación.", author: "Ana Ortiz", date: "2026-09-24", readTime: "7 min" },
  { slug: "el-clima-laboral-se-mide-pero-tambien-se-cuenta", type: "entrevista", kicker: "Entrevista", title: "«El clima laboral se mide, pero también se cuenta»", dek: "El director de talento de Telecom Sierra, tras liderar Merco Talento.", author: "Diego Salazar", date: "2026-09-18", readTime: "8 min" },
  { slug: "un-jurado-serio-publica-sus-criterios-antes-de-evaluar", type: "entrevista", kicker: "Entrevista", title: "«Un jurado serio publica sus criterios antes de evaluar»", dek: "La presidenta del jurado de los Premios Verdes explica el método de selección.", author: "Ana Ortiz", date: "2026-09-11", readTime: "9 min" },
  { slug: "la-cocina-ecuatoriana-ya-compite-por-su-propia-identidad", type: "entrevista", kicker: "Entrevista", title: "«La cocina ecuatoriana ya compite por su propia identidad»", dek: "El director de la revista Summum sobre veinte años de premios gastronómicos.", author: "Lucía Paredes", date: "2026-09-04", readTime: "8 min" },
  { slug: "el-directorio-tambien-deberia-leer-los-rankings", type: "opinion", kicker: "Opinión", title: "El directorio también debería leer los rankings", dek: "La reputación es un activo del negocio y no solo un tema del área de comunicación.", author: "Carlos Vera", date: "2026-09-22", readTime: "4 min" },
  { slug: "premiar-la-sostenibilidad-sin-premiar-el-discurso", type: "opinion", kicker: "Opinión", title: "Premiar la sostenibilidad sin premiar el discurso", dek: "Los galardones verdes deben exigir datos verificables, no solo buenas intenciones.", author: "María José Andrade", date: "2026-09-15", readTime: "4 min" },
  { slug: "cuando-la-empresa-gana-y-nadie-se-entera", type: "opinion", kicker: "Opinión", title: "Cuando la empresa gana y nadie se entera", dek: "Un reconocimiento que no se comunica bien pierde la mitad de su valor.", author: "Carlos Vera", date: "2026-09-08", readTime: "4 min" },
  { slug: "rankings-regionales-ecuador-compite-o-se-compara", type: "opinion", kicker: "Opinión", title: "Rankings regionales: ¿Ecuador compite o se compara?", dek: "Las ediciones locales necesitan leerse en el contexto de la región.", author: "María José Andrade", date: "2026-09-01", readTime: "5 min" },
  { slug: "banco-del-litoral-tres-anos-para-pasar-del-puesto-9-al-1", type: "caso", kicker: "Caso", title: "Banco del Litoral: tres años para pasar del puesto 9 al 1", dek: "Cambios en gobierno corporativo, atención al cliente y relación con medios.", author: "Lucía Paredes", date: "2026-09-27", readTime: "8 min" },
  { slug: "grupo-pacifico-y-la-campana-interna-que-cambio-su-clima-laboral", type: "campana", kicker: "Campaña", title: "Grupo Pacífico y la campaña interna que cambió su clima laboral", dek: "Un programa de escucha con 4.000 colaboradores que terminó en Great Place to Work.", author: "Diego Salazar", date: "2026-09-20", readTime: "6 min" },
  { slug: "exportadora-bananera-oro-certificar-para-entrar-a-europa", type: "caso", kicker: "Caso", title: "Exportadora Bananera Oro: certificar para entrar a Europa", dek: "La ruta de certificaciones que abrió tres mercados nuevos.", author: "Lucía Paredes", date: "2026-09-13", readTime: "7 min" },
  { slug: "supermercados-costa-y-el-programa-de-proveedores-locales", type: "campana", kicker: "Campaña", title: "Supermercados Costa y el programa de proveedores locales", dek: "Cómo una política de compras se convirtió en una historia de marca.", author: "Ana Ortiz", date: "2026-09-06", readTime: "6 min" },
  { slug: "las-empresas-mas-reconocidas-del-primer-semestre", type: "informe", kicker: "Informe ranking.ec", title: "Las empresas más reconocidas del primer semestre", dek: "Recuento de galardones obtenidos entre enero y junio, por empresa y sector.", author: "Equipo de datos", date: "2026-09-29", readTime: "9 min" },
  { slug: "reputacion-por-sector-quien-lidera-en-cada-industria", type: "informe", kicker: "Informe ranking.ec", title: "Reputación por sector: quién lidera en cada industria", dek: "Cruce de los rankings corporativos publicados en 2026.", author: "Equipo de datos", date: "2026-09-19", readTime: "10 min" },
  { slug: "quien-organiza-los-premios-en-ecuador", type: "informe", kicker: "Informe ranking.ec", title: "Quién organiza los premios en Ecuador", dek: "Gremios, medios y consultoras: el mapa de los organizadores y sus metodologías.", author: "Equipo de datos", date: "2026-09-09", readTime: "11 min" },
  { slug: "diez-anos-de-merco-en-ecuador", type: "informe", kicker: "Informe ranking.ec", title: "Diez años de Merco en Ecuador", dek: "Las empresas que más veces entraron al top 10 y las que nunca salieron.", author: "Equipo de datos", date: "2026-08-29", readTime: "12 min" },
  { slug: "calendario-de-galas-2026-cuando-se-entrega-cada-premio", type: "informe", kicker: "Informe ranking.ec", title: "Calendario de galas 2026: cuándo se entrega cada premio", dek: "Las fechas de las ceremonias del año, mes a mes.", author: "Equipo de datos", date: "2026-08-15", readTime: "6 min" },
];

/** Full content of the articles the prototype shows in detail (the rest get a sample body). */
const DETAILS: Record<string, Partial<Article>> = {
  "la-banca-recupera-tres-puestos-en-el-top-10-de-reputacion": {
    highlight: "top 10",
    place: "Quito",
    image: {
      label: "Foto principal de la noticia",
      caption: "Presentación de los resultados de Merco Empresas Ecuador 2026 en Quito.",
      credit: "Foto: Daniela Ruiz",
    },
    keyFacts: [
      { value: "100", label: "empresas en el ranking" },
      { value: "3", label: "entidades financieras suben en el top 10" },
      { value: "2", label: "empresas nuevas en el top 20" },
      { value: "2 dic", label: "gala de entrega en Guayaquil" },
    ],
    body: [
      { _type: "p", text: "Merco publicó este jueves la edición 2026 de su monitor de reputación corporativa en Ecuador. El ranking evalúa a las 100 empresas con mejor reputación del país a partir de encuestas a directivos, expertos, analistas y ciudadanos, y de una verificación de méritos auditada de forma independiente." },
      { _type: "p", text: "Banco del Litoral repite en el primer lugar, con 10.000 puntos, seguido de Grupo Pacífico y Cerámica Andina. La principal novedad es el regreso de la banca al top 10: tres entidades financieras ganaron posiciones respecto de 2025." },
      { _type: "h2", text: "Así quedó el top 10" },
      {
        _type: "rankingTable",
        rows: [
          ["Banco del Litoral", "Banca", "="],
          ["Grupo Pacífico", "Consumo masivo", "▼ 1"],
          ["Cerámica Andina", "Industria", "▲ 1"],
          ["Alimentos del Valle", "Alimentos", "▲ 5"],
          ["Telecom Sierra", "Telecomunicaciones", "▼ 1"],
          ["Banco Andino", "Banca", "▲ 1"],
          ["Cervecería del Sur", "Bebidas", "▼ 3"],
          ["Supermercados Costa", "Retail", "="],
          ["Farmacéutica Ecuatorial", "Salud", "▲ 4"],
          ["Seguros Equinoccio", "Seguros", "▲ 2"],
        ].map(([name, detail, change], i) => ({ position: i + 1, name, detail, change })),
        source: "Fuente: Merco Empresas Ecuador 2026. Variación frente a 2025.",
        more: { label: "Ver las 100", href: "/rankings/merco-empresas/2026" },
      },
      { _type: "p", text: "Banco Andino es el que más sube entre las entidades financieras: pasa del séptimo al sexto lugar. Seguros Equinoccio gana dos posiciones y cierra el top 10. Fuera de la banca, Farmacéutica Ecuatorial sube cuatro puestos y Alimentos del Valle, cinco." },
      { _type: "pullQuote", text: "La reputación no se construye en un año. Se pierde en uno, eso sí.", author: "Ricardo Mendoza", role: "gerente general, Banco del Litoral" },
      { _type: "h2", text: "Las que entran y las que caen" },
      { _type: "p", text: "Cooperativa Sierra Sur y Constructora Guayas aparecen por primera vez entre las 20 primeras. En sentido contrario, Aerolíneas del Ecuador pierde cuatro posiciones y Cervecería del Sur, tres, aunque ambas se mantienen en el top 20." },
      { _type: "p", text: "Merco entregará los reconocimientos en una gala el 2 de diciembre en el Hilton Colón de Guayaquil. ranking.ec cubrirá la ceremonia en vivo." },
    ],
    topics: ["Merco Empresas", "Reputación corporativa", "Banca y seguros", "Rankings 2026"],
    mentions: [
      { type: "Ranking", initials: "ME", name: "Merco Empresas 2026", detail: "Las 100 empresas con mejor reputación", cta: "Ver ranking", href: "/rankings/merco-empresas/2026" },
      { type: "Empresa", initials: "BL", name: "Banco del Litoral", detail: "Banca · 14 reconocimientos", cta: "Ver ficha", href: "/empresas/banco-del-litoral" },
      { type: "Empresa", initials: "BA", name: "Banco Andino", detail: "Banca · 4 reconocimientos", cta: "Ver ficha", href: "/empresas/banco-andino" },
      { type: "Gala", initials: "2D", name: "Gala Merco 2026", detail: "2 dic · Hilton Colón, Guayaquil", cta: "Ver gala", href: "/eventos/gala-merco-empresas-2026" },
    ],
  },
};

for (const a of ARTICLES) Object.assign(a, DETAILS[a.slug]);

/** Newest first; articles of the same day keep their order. */
export const ARTICLES_BY_DATE = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));

/** "Lo más leído", curated by the editors. */
export const MOST_READ = [
  "la-banca-recupera-tres-puestos-en-el-top-10-de-reputacion",
  "quito-suma-tres-de-los-cinco-mejores-restaurantes-summum",
  "un-reconocimiento-sirve-si-cambia-algo-grupo-pacifico",
  "demasiados-premios-poca-metodologia",
  "mapa-de-galardones-2026-que-se-premia-y-quien-lo-organiza",
];

/** Recent appointments ("Movimientos"). */
export const MOVEMENTS = [
  { initials: "MP", name: "María Pérez", role: "Directora de Comunicación", organization: "Banco del Litoral" },
  { initials: "JC", name: "Jorge Cevallos", role: "Gerente de Asuntos Corporativos", organization: "Telecom Sierra" },
  { initials: "AV", name: "Andrea Villacís", role: "Directora de Sostenibilidad", organization: "Cerámica Andina" },
  { initials: "RM", name: "Ricardo Moreno", role: "Vicepresidente de Marca", organization: "Grupo Pacífico" },
];

const bySlug = new Map(ARTICLES.map((a) => [a.slug, a]));

export function article(slug: string): Article {
  const a = bySlug.get(slug);
  if (!a) throw new Error(`Unknown article "${slug}"`);
  return a;
}

/** Card data of an article. `parts` chooses which optional fields the card shows. */
export function teaser(slug: string, parts: { dek?: boolean; author?: boolean; date?: boolean; readTime?: boolean; image?: string } = {}): ArticleTeaser {
  const a = article(slug);
  return {
    href: articleHref(a.slug),
    kicker: a.kicker,
    title: a.title,
    dek: parts.dek ? a.dek : undefined,
    author: parts.author ? a.author : undefined,
    date: parts.date ? shortDate(a.date) : undefined,
    readTime: parts.readTime ? a.readTime : undefined,
    image: parts.image ? { label: parts.image } : undefined,
    sponsored: a.sponsored,
  };
}

/* ---------- Registry samples used on the home page ---------- */

export const PUBLISHED_RESULTS: { award: string; when: string; level: MedalLevel; winner: string; detail: string; href: string }[] = [
  { award: "Premios Summum 2026", when: "29 oct", level: "grand", winner: "Casa Tamia", detail: "· mejor restaurante del país", href: "/rankings" },
  { award: "Great Place to Work 2026", when: "27 oct", level: "oro", winner: "Cerámica Andina", detail: "· primer lugar, +1.000", href: "/rankings" },
  { award: "Merco Empresas 2026", when: "24 oct", level: "oro", winner: "Banco del Litoral", detail: "· 1.º de 100", href: "/rankings/merco-empresas/2026" },
];

export const MERCO_TOP5 = [
  { position: 1, name: "Banco del Litoral", change: "▲ 2" },
  { position: 2, name: "Grupo Pacífico", change: "▼ 1" },
  { position: 3, name: "Cerámica Andina", change: "=" },
  { position: 4, name: "Alimentos del Valle", change: "▲ 5" },
  { position: 5, name: "Telecom Sierra", change: "▼ 1" },
];

export const OPEN_CALLS = [
  { award: "Premio Nacional a la Calidad", edition: "Edición 2026", closes: "4 nov", daysLeft: 6, status: "abierta" as const },
  { award: "Effie Awards Ecuador", edition: "Edición 2026", closes: "19 nov", daysLeft: 21, status: "abierta" as const },
  { award: "Premios Verdes", edition: "Edición 2027", closes: "15 ene", status: "proxima" as const },
];

export const UPCOMING_GALAS = [
  { day: "12", month: "Nov", name: "Effie Awards Ecuador 2026", place: "Quito · Centro de Convenciones", href: "/eventos" },
  { day: "26", month: "Nov", name: "Premio Nacional a la Calidad", place: "Guayaquil", href: "/eventos" },
  { day: "03", month: "Dic", name: "Gala de los Premios Verdes", place: "Guayaquil", href: "/eventos" },
];

export const OPINION_AUTHORS: Record<string, string> = {
  "Paula Cevallos": "Consultora en gobierno corporativo",
  "Jorge Andrade": "Profesor de estrategia",
  "La Redacción": "ranking.ec",
};
