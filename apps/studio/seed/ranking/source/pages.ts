import type { EdForm, EditorialBlock } from "./types";
import type { ListingPage } from "./types";
import { newsletterBlock } from "./shared";

const SECTORS = [
  "Banca y seguros",
  "Consumo masivo",
  "Telecomunicaciones",
  "Energía y minería",
  "Salud",
  "Retail",
  "Industria",
  "Servicios",
  "Agroindustria y exportación",
  "Agencia de comunicación o publicidad",
  "Sector público",
  "ONG o academia",
  "Medios",
  "Otro",
];

/** Newsletter issues (archive, sample). */
export const ISSUES: [number, string, string][] = [
  [42, "26 oct 2026", "La banca vuelve al top 10"],
  [41, "19 oct 2026", "Premios Verdes: quién ganó y por qué"],
  [40, "12 oct 2026", "Merco Talento cambia de líder"],
  [39, "5 oct 2026", "Summum: la noche de la cocina costeña"],
  [38, "28 sep 2026", "Lo que dejó el Foro de Comunicación Interna"],
  [37, "21 sep 2026", "Great Place to Work abre su temporada"],
  [36, "14 sep 2026", "Las empresas con más reconocimientos del semestre"],
  [35, "7 sep 2026", "Exportadoras: la temporada de premios empieza en Guayaquil"],
];

/** "/newsletter": subscription (Netlify Forms) and archive. */
export function newsletterPage(): ListingPage {
  const form: EdForm = {
    name: "newsletter-completo",
    fields: [
      { name: "email", label: "Correo electrónico", type: "email", required: true, placeholder: "nombre@empresa.com", full: true, error: "Escribe un correo válido." },
      { name: "nombre", label: "Nombre y apellido", type: "text", required: true, placeholder: "María Pérez", error: "Escribe tu nombre." },
      { name: "cargo", label: "Cargo", type: "text", required: true, placeholder: "Directora de Comunicación", error: "Escribe tu cargo." },
      { name: "empresa", label: "Empresa", type: "text", required: true, placeholder: "Nombre de la empresa", full: true, error: "Escribe tu empresa." },
      { name: "sector", label: "Sector", type: "select", required: true, placeholder: "Selecciona un sector", options: SECTORS, full: true, error: "Elige un sector." },
    ],
    checkbox: { name: "alertas", label: "Avisarme también cuando se publique un ranking o los ganadores de un galardón.", checked: true },
    submit: "Suscribirme ↗",
    note: "Todos los campos son obligatorios. Sin costo. Puedes darte de baja desde cualquier edición. Tratamos tus datos según nuestra política de privacidad.",
    success: { eyebrow: "Casi listo", title: "Revisa tu correo.", text: "Enviamos un enlace de confirmación a tu correo. La próxima edición llega el lunes." },
  };

  const blocks: EditorialBlock[] = [
    {
      _type: "edNewsletterHero",
      eyebrow: "Cada lunes · 7:00",
      title: ["Ranking", "Newsletter."],
      text: "Quién ganó, qué rankings se publicaron y qué viene en la agenda de las empresas en Ecuador. Cinco minutos de lectura, una vez por semana.",
      totals: [
        { value: String(ISSUES[0][0]), label: "ediciones publicadas" },
        { value: "5 min", label: "de lectura" },
        { value: "Lunes", label: "en tu bandeja a las 7:00" },
      ],
      formTitle: "Suscríbete gratis",
      form,
    },
    {
      _type: "edColumns",
      spaceTop: 80,
      columns: [
        {
          blocks: [
            { _type: "edHeading", eyebrow: "En cada edición", title: "Qué recibes", size: "lg" },
            {
              _type: "edNumberedColumns",
              variant: "big",
              items: [
                { title: "Quién ganó", text: "Los ganadores de la semana en todos los galardones que cubrimos, con enlace a cada ficha." },
                { title: "Rankings publicados", text: "Las nuevas ediciones de los rankings corporativos y quién sube o baja." },
                { title: "La agenda", text: "Las galas, foros y encuentros de los próximos quince días." },
                { title: "Para leer", text: "Las noticias de actualidad de la semana y una entrevista, un análisis o un caso seleccionado por la redacción." },
              ],
            },
          ],
        },
      ],
    },
    {
      _type: "edArchive",
      eyebrow: "Archivo",
      title: "Ediciones anteriores",
      searchPlaceholder: "Buscar en el archivo",
      items: ISSUES.map(([number, date, title]) => ({ number: String(number), date, title })),
      empty: "Ninguna edición coincide.",
      more: { label: `Ver las ${ISSUES[0][0]} ediciones`, href: "/newsletter" },
    },
  ];
  return { path: "newsletter", title: "ranking.ec · Ranking Newsletter", blocks };
}

/* ---------- Institutional pages ---------- */

type Doc = {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  lead: string;
  sections: [string, string[], [string, string][]?][];
};

export const UPDATED = "30 de octubre de 2026";

export const DOCS: Doc[] = [
  {
    slug: "quienes-somos",
    label: "Quiénes somos",
    eyebrow: "Institucional",
    title: "Quiénes somos",
    lead: "ranking.ec es la publicación de registro de los reconocimientos, galardones y premios que reciben las organizaciones en Ecuador.",
    sections: [
      ["Qué hacemos", ["Registramos cada edición de los rankings, premios y certificaciones que cubrimos, con sus ganadores, categorías y fuentes. Sobre ese registro publicamos noticias, entrevistas, análisis e informes."]],
      ["Por qué existimos", ["Los reconocimientos empresariales están dispersos en notas de prensa, sitios de organizadores y redes sociales. Los reunimos en un solo lugar, con un mismo formato y con enlace a la fuente oficial."]],
      [
        "Quiénes estamos detrás",
        ["ranking.ec es un proyecto de RANKING, consultora de estrategia de marca y posicionamiento construida desde los datos."],
        [
          ["Dirección", "Por definir"],
          ["Redacción", "redaccion@ranking.ec"],
          ["Ciudad", "Quito, Ecuador"],
        ],
      ],
    ],
  },
  {
    slug: "politica-editorial",
    label: "Política editorial",
    eyebrow: "Institucional",
    title: "Política editorial",
    lead: "Cómo decidimos qué publicar, cómo verificamos los datos y cómo separamos la información del contenido comercial.",
    sections: [
      ["Independencia", ["La redacción decide qué se publica y cómo. Ningún acuerdo comercial modifica los datos del registro ni el contenido de las noticias."]],
      ["Verificación", ["Cada resultado se contrasta con la fuente oficial del organizador antes de publicarse. Cuando un dato no puede verificarse, no se publica."]],
      ["Contenido de marca", ["El contenido producido por encargo de una marca se identifica como «Contenido de marca» y lo elabora un equipo distinto de la redacción de noticias."]],
      ["Correcciones", ["Si detectamos un error, lo corregimos y dejamos constancia al pie del artículo o de la ficha, con la fecha del cambio."]],
    ],
  },
  {
    slug: "metodologia",
    label: "Metodología",
    eyebrow: "Rankings",
    title: "Metodología del registro",
    lead: "Qué galardones entran al registro, cómo se cargan sus resultados y cómo se construye la ficha de cada organización.",
    sections: [
      ["Qué galardones cubrimos", ["Incluimos rankings, premios y certificaciones otorgados en Ecuador o con capítulo ecuatoriano que publiquen sus bases, su jurado o su metodología y sus resultados."]],
      [
        "Cómo se registran los resultados",
        ["Cargamos los resultados tal como los publica el organizador, con la fecha y el enlace a la fuente."],
        [
          ["Fuente", "Publicación oficial del organizador"],
          ["Plazo", "Hasta 72 horas desde el anuncio"],
          ["Niveles", "Los que define cada galardón: posición, oro, plata, certificación o mención"],
        ],
      ],
      ["Fichas de organizaciones", ["Cada organización reúne en su ficha todos sus reconocimientos. Una ficha verificada es aquella cuyos datos fueron confirmados por la propia organización."]],
    ],
  },
  {
    slug: "contacto",
    label: "Contacto",
    eyebrow: "Institucional",
    title: "Contacto",
    lead: "Escríbenos al área que corresponda. Respondemos en un máximo de dos días hábiles.",
    sections: [
      ["Redacción", ["Para enviar información, proponer una nota o pedir una corrección."], [["Correo", "redaccion@ranking.ec"]]],
      [
        "Registro",
        ["Para publicar los resultados de un galardón, proponer uno nuevo o reclamar la ficha de una organización."],
        [
          ["Correo", "registro@ranking.ec"],
          ["Formulario", "Envía tu información"],
        ],
      ],
      ["Comercial", ["Para contenido de marca y alianzas."], [["Correo", "comercial@ranking.ec"]]],
    ],
  },
  {
    slug: "privacidad",
    label: "Privacidad y términos",
    eyebrow: "Legal",
    title: "Privacidad y términos",
    lead: "Cómo tratamos los datos de quienes visitan el sitio y se suscriben al newsletter, y las condiciones de uso del contenido.",
    sections: [
      ["Datos que recogemos", ["Al suscribirte al newsletter pedimos correo, nombre, cargo, empresa y sector. Los usamos solo para enviarte el newsletter y entender a nuestra audiencia."]],
      ["Tus derechos", ["Puedes pedir acceso, corrección o eliminación de tus datos en cualquier momento, conforme a la Ley Orgánica de Protección de Datos Personales."]],
      ["Uso del contenido", ["Puedes citar los datos del registro mencionando a ranking.ec como fuente y enlazando a la ficha correspondiente."]],
    ],
  },
];

const slugify = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Institutional pages ("/quienes-somos", "/politica-editorial"…). */
export function institutionalPages(): ListingPage[] {
  return DOCS.map((d) => ({
    path: d.slug,
    title: `ranking.ec · ${d.label}`,
    blocks: [
      { _type: "edBreadcrumb", items: [{ label: "Inicio", href: "/" }, { label: "Institucional" }, { label: d.label }] },
      {
        _type: "edDocPage",
        menuTitle: "Institucional",
        menu: DOCS.map((m) => ({ label: m.label, href: `/${m.slug}`, current: m.slug === d.slug })),
        eyebrow: d.eyebrow,
        title: d.title,
        lead: d.lead,
        sections: d.sections.map(([title, paragraphs, rows]) => ({
          id: slugify(title),
          title,
          paragraphs,
          rows: rows?.map(([label, value]) => ({ label, value })),
        })),
        footnote: { text: `Última actualización: ${UPDATED}. ¿Algo no está claro? Escríbenos a`, link: { label: "redaccion@ranking.ec", href: "mailto:redaccion@ranking.ec" } },
        tocTitle: "En esta página",
      },
      { ...newsletterBlock("Cada lunes: premios, rankings, eventos y las noticias de actualidad de las empresas en Ecuador."), spaceTop: 80 },
    ],
  }));
}

/* ---------- Participa (Netlify Forms) ---------- */

const contact = (corporate = false) =>
  [
    { name: "nombre", label: "Nombre y apellido", type: "text" as const, required: true, error: "Escribe tu nombre." },
    { name: "email", label: corporate ? "Correo corporativo" : "Correo electrónico", type: "email" as const, required: true, placeholder: "nombre@empresa.com", error: "Escribe un correo válido." },
  ];

export const FORMS: { slug: string; label: string; lead: string; form: EdForm }[] = [
  {
    slug: "envia-tu-informacion",
    label: "Envía tu información",
    lead: "Comparte con la redacción una noticia, un nombramiento, un reconocimiento o un evento de tu organización.",
    form: {
      name: "envia-tu-informacion",
      fields: [
        ...contact(),
        { name: "empresa", label: "Organización", type: "text", required: true, full: true, error: "Escribe tu organización." },
        { name: "tipo", label: "Tipo de información", type: "select", required: true, options: ["Noticia", "Nombramiento", "Reconocimiento", "Evento", "Otro"], full: true, error: "Elige un tipo." },
        { name: "mensaje", label: "Mensaje", type: "textarea", required: true, error: "Cuéntanos de qué se trata." },
        { name: "enlace", label: "Enlace (opcional)", type: "url", placeholder: "https://", full: true },
      ],
      submit: "Enviar ↗",
      note: "La redacción revisa cada envío y responde en un máximo de dos días hábiles.",
      success: { eyebrow: "Recibido", title: "Gracias.", text: "La redacción revisará tu información y te escribirá si necesita más datos." },
    },
  },
  {
    slug: "publica-resultados",
    label: "Publica resultados",
    lead: "Si organizas un ranking, premio o certificación en Ecuador, envía los resultados de cada edición para registrarlos.",
    form: {
      name: "publica-resultados",
      fields: [
        ...contact(true),
        { name: "organizador", label: "Organizador", type: "text", required: true, error: "Escribe el organizador." },
        { name: "galardon", label: "Galardón", type: "text", required: true, error: "Escribe el galardón." },
        { name: "edicion", label: "Edición o año", type: "text", required: true, error: "Escribe la edición." },
        { name: "fuente", label: "Enlace a los resultados oficiales", type: "url", required: true, placeholder: "https://", full: true, error: "Agrega el enlace oficial." },
        { name: "mensaje", label: "Comentarios", type: "textarea" },
      ],
      submit: "Enviar resultados ↗",
      note: "Publicamos los resultados tras contrastarlos con la fuente oficial, en un plazo de hasta 72 horas.",
      success: { eyebrow: "Recibido", title: "Gracias.", text: "Verificaremos los resultados con la fuente oficial y te avisaremos cuando estén publicados." },
    },
  },
  {
    slug: "corrige-una-ficha",
    label: "Corrige una ficha",
    lead: "Completa la ficha de tu organización, corrige un dato o envía un reconocimiento que falte.",
    form: {
      name: "corrige-una-ficha",
      fields: [
        ...contact(true),
        { name: "empresa", label: "Organización (ficha)", type: "text", required: true, error: "Escribe la organización." },
        { name: "cargo", label: "Cargo", type: "text" },
        { name: "cambio", label: "Qué hay que corregir o agregar", type: "textarea", required: true, error: "Describe el cambio." },
      ],
      submit: "Enviar solicitud ↗",
      note: "La redacción valida cada cambio con un correo corporativo de la organización.",
      success: { eyebrow: "Recibido", title: "Gracias.", text: "Revisaremos la solicitud y te escribiremos para validar el cambio." },
    },
  },
];

/** "/participa/<slug>": contribution forms. */
export function participaPages(): ListingPage[] {
  return FORMS.map((f) => ({
    path: `participa/${f.slug}`,
    title: `ranking.ec · ${f.label}`,
    blocks: [
      { _type: "edBreadcrumb", items: [{ label: "Inicio", href: "/" }, { label: "Participa" }, { label: f.label }] },
      {
        _type: "edDocPage",
        menuTitle: "Participa",
        menu: FORMS.map((m) => ({ label: m.label, href: `/participa/${m.slug}`, current: m.slug === f.slug })),
        eyebrow: "Participa",
        title: f.label,
        lead: f.lead,
        sections: [],
        form: f.form,
      },
      { ...newsletterBlock("Cada lunes: premios, rankings, eventos y convocatorias de las empresas en Ecuador."), spaceTop: 80 },
    ],
  }));
}
