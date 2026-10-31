import { defineArrayMember, defineField, defineType } from "sanity";
import { sameSiteFilter } from "../fields";

/* ---------- Shared lists ---------- */

export const MEDAL_LEVELS = [
  { title: "Gran Premio", value: "grand" },
  { title: "Oro", value: "oro" },
  { title: "Plata", value: "plata" },
  { title: "Bronce", value: "bronce" },
  { title: "Mención", value: "mencion" },
  { title: "Finalista", value: "finalista" },
];

export const ARTICLE_TYPES = [
  { title: "Noticia", value: "noticia" },
  { title: "Entrevista", value: "entrevista" },
  { title: "Opinión", value: "opinion" },
  { title: "Caso", value: "caso" },
  { title: "Campaña", value: "campana" },
  { title: "Informe", value: "informe" },
  { title: "Análisis", value: "analisis" },
  { title: "Datos", value: "datos" },
  { title: "Reportaje", value: "reportaje" },
  { title: "Crónica", value: "cronica" },
  { title: "Galería", value: "galeria" },
];

export const EVENT_TYPES = [
  { title: "Gala de premiación", value: "gala" },
  { title: "Foro o congreso", value: "foro" },
  { title: "Taller", value: "taller" },
  { title: "Encuentro", value: "encuentro" },
];

/** Netlify Forms whose fields live in the code (their names must not change between builds). */
export const EDITORIAL_FORMS = [
  { title: "Envía tu información", value: "envia-tu-informacion" },
  { title: "Publica resultados", value: "publica-resultados" },
  { title: "Corrige una ficha", value: "corrige-una-ficha" },
];

const titleOf = (list: { title: string; value: string }[], value?: string) => list.find((x) => x.value === value)?.title ?? value;

/* ---------- Images ---------- */

export const editorialImage = defineType({
  name: "editorialImage",
  title: "Imagen",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texto alternativo",
      type: "string",
      description: "Qué muestra la foto, para lectores de pantalla.",
      // Sample images are placeholders without a file: only uploaded photos need the text.
      validation: (rule) =>
        rule.custom((alt, { parent }) => ((parent as { asset?: unknown } | undefined)?.asset && !alt ? "Las imágenes necesitan texto alternativo." : true)).warning(),
    }),
    defineField({ name: "caption", title: "Pie de foto", type: "string" }),
    defineField({ name: "credit", title: "Crédito", type: "string", placeholder: "Foto: Nombre Apellido" }),
  ],
});

const RATIOS = [
  { title: "Horizontal 3:2", value: "3/2" },
  { title: "Panorámica 16:9", value: "16/9" },
  { title: "Cuadrada", value: "1/1" },
  { title: "Vertical 4:5", value: "4/5" },
];

/* ---------- Article body (Portable Text members) ---------- */

export const bodyImage = defineType({
  name: "bodyImage",
  title: "Imagen",
  type: "object",
  fields: [
    defineField({ name: "image", title: "Imagen", type: "editorialImage", validation: (rule) => rule.required() }),
    defineField({ name: "ratio", title: "Proporción", type: "string", options: { list: RATIOS }, initialValue: "3/2" }),
  ],
  preview: { select: { title: "image.caption", media: "image" }, prepare: ({ title, media }) => ({ title: title || "Imagen", media }) },
});

export const imagePair = defineType({
  name: "imagePair",
  title: "Par de imágenes",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Imágenes",
      type: "array",
      of: [defineArrayMember({ type: "bodyImage" })],
      validation: (rule) => rule.required().length(2),
    }),
    defineField({
      name: "weights",
      title: "Reparto del ancho",
      type: "string",
      options: { list: [{ title: "Mitad y mitad", value: "1:1" }, { title: "Más ancha la primera (3:2)", value: "3:2" }, { title: "Más ancha la segunda (2:3)", value: "2:3" }], layout: "radio" },
      initialValue: "1:1",
    }),
  ],
  preview: { prepare: () => ({ title: "Par de imágenes" }) },
});

export const pullQuote = defineType({
  name: "pullQuote",
  title: "Cita destacada",
  type: "object",
  fields: [
    defineField({ name: "text", title: "Cita", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "author", title: "Quién lo dice", type: "string" }),
    defineField({ name: "role", title: "Cargo", type: "string" }),
  ],
  preview: { select: { title: "text", subtitle: "author" } },
});

export const rankingTableRow = defineType({
  name: "rankingTableRow",
  title: "Fila",
  type: "object",
  fields: [
    defineField({ name: "position", title: "Posición", type: "number" }),
    defineField({ name: "name", title: "Nombre", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "detail", title: "Detalle", type: "string", description: "P. ej. el sector." }),
    defineField({ name: "change", title: "Variación", type: "string", placeholder: "▲ 2, ▼ 1, =, Nueva" }),
    defineField({ name: "href", title: "Enlace", type: "string" }),
  ],
  preview: {
    select: { position: "position", name: "name", detail: "detail" },
    prepare: ({ position, name, detail }) => ({ title: `${position ?? "·"}. ${name}`, subtitle: detail }),
  },
});

export const rankingTable = defineType({
  name: "rankingTable",
  title: "Tabla de ranking",
  type: "object",
  description: "Toma las primeras posiciones de una edición del registro, o filas escritas a mano.",
  fields: [
    defineField({ name: "edition", title: "Edición", type: "reference", to: [{ type: "edition" }], options: { filter: sameSiteFilter } }),
    defineField({ name: "limit", title: "Filas", type: "number", initialValue: 10, hidden: ({ parent }) => !parent?.edition }),
    defineField({
      name: "rows",
      title: "Filas manuales",
      type: "array",
      of: [defineArrayMember({ type: "rankingTableRow" })],
      hidden: ({ parent }) => !!parent?.edition,
    }),
    defineField({ name: "highlight", title: "Posición resaltada", type: "number" }),
    defineField({ name: "source", title: "Fuente", type: "string", description: "Vacío = se arma con la edición." }),
    defineField({ name: "more", title: "Enlace «ver todo»", type: "link", description: "Vacío = enlace a la edición." }),
  ],
  validation: (rule) =>
    rule.custom((value: { edition?: unknown; rows?: unknown[] } | undefined) =>
      value?.edition || value?.rows?.length ? true : "Elige una edición o escribe las filas.",
    ),
  preview: {
    select: { award: "edition.award.name", year: "edition.year", rows: "rows" },
    prepare: ({ award, year, rows }) => ({
      title: "Tabla de ranking",
      subtitle: award ? `${award} ${year}` : `${rows?.length ?? 0} filas manuales`,
    }),
  },
});

export const recordList = defineType({
  name: "recordList",
  title: "Reconocimientos de una empresa",
  type: "object",
  description: "Lista los reconocimientos que la empresa tiene en el registro.",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", initialValue: "Reconocimientos en el registro" }),
    defineField({
      name: "organization",
      title: "Empresa",
      type: "reference",
      to: [{ type: "organization" }],
      options: { filter: sameSiteFilter },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "limit", title: "Máximo", type: "number", initialValue: 4 }),
  ],
  preview: { select: { title: "title", subtitle: "organization.name" } },
});

/** Portable Text of article bodies. */
export const articleBody = defineType({
  name: "articleBody",
  title: "Cuerpo",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Subtítulo", value: "h2" },
        { title: "Cierre (reportajes)", value: "closing" },
      ],
      lists: [],
      marks: {
        decorators: [
          { title: "Negrita", value: "strong" },
          { title: "Cursiva", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "textLink",
            title: "Enlace",
            type: "object",
            fields: [defineField({ name: "href", title: "URL", type: "string", validation: (rule) => rule.required() })],
          }),
        ],
      },
    }),
    defineArrayMember({ type: "bodyImage" }),
    defineArrayMember({ type: "imagePair" }),
    defineArrayMember({ type: "pullQuote" }),
    defineArrayMember({ type: "rankingTable" }),
    defineArrayMember({ type: "recordList" }),
  ],
});

/** Simple text (paragraphs and links) for institutional sections. */
export const simpleText = defineType({
  name: "simpleText",
  title: "Texto",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [],
      marks: {
        decorators: [{ title: "Negrita", value: "strong" }],
        annotations: [
          defineArrayMember({
            name: "textLink",
            title: "Enlace",
            type: "object",
            fields: [defineField({ name: "href", title: "URL", type: "string", validation: (rule) => rule.required() })],
          }),
        ],
      },
    }),
  ],
});

/* ---------- Small objects ---------- */

export const keyFact = defineType({
  name: "keyFact",
  title: "Dato",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Cifra", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "label", title: "Texto", type: "string", validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

export const titledText = defineType({
  name: "titledText",
  title: "Bloque de texto",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "text", title: "Texto", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "title", subtitle: "text" } },
});

export const linkGroup = defineType({
  name: "linkGroup",
  title: "Columna de enlaces",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "links", title: "Enlaces", type: "array", of: [defineArrayMember({ type: "link" })] }),
  ],
  preview: {
    select: { title: "title", links: "links" },
    prepare: ({ title, links }) => ({ title, subtitle: `${links?.length ?? 0} enlaces` }),
  },
});

/** Intro of a section index (Actualidad, Rankings, Empresas, Eventos). */
export const hubIntro = defineType({
  name: "hubIntro",
  title: "Presentación de la sección",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "eyebrow", title: "Antetítulo", type: "string" }),
    defineField({
      name: "title",
      title: "Título",
      type: "array",
      description: "Una línea por elemento.",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "text", title: "Texto", type: "text", rows: 3 }),
    defineField({ name: "newsletterText", title: "Texto de la banda del newsletter", type: "string", description: "Vacío = el texto general." }),
  ],
});

/** Result of an organization (or a person) in an edition. */
export const editionResult = defineType({
  name: "editionResult",
  title: "Resultado",
  type: "object",
  fields: [
    defineField({
      name: "organization",
      title: "Empresa",
      type: "reference",
      to: [{ type: "organization" }],
      options: { filter: sameSiteFilter },
      description: "Si tiene ficha en el directorio.",
    }),
    defineField({ name: "name", title: "Nombre", type: "string", description: "Vacío = el nombre de la empresa. Obligatorio para personas o ganadores sin ficha." }),
    defineField({ name: "position", title: "Posición", type: "number", validation: (rule) => rule.integer().positive() }),
    defineField({ name: "level", title: "Nivel", type: "string", options: { list: MEDAL_LEVELS } }),
    defineField({ name: "label", title: "Etiqueta", type: "string", description: "Cuando el resultado no es posición ni nivel: «Certificada», «Ganador»…" }),
    defineField({ name: "category", title: "Categoría", type: "string" }),
    defineField({ name: "sector", title: "Sector en esta edición", type: "string", description: "Como lo publica el organizador. Vacío = el sector corto de la empresa (solo en resultados por posición sin categoría)." }),
    defineField({ name: "score", title: "Puntos", type: "number" }),
    defineField({ name: "change", title: "Variación", type: "string", placeholder: "▲ 2, ▼ 1, =, Nueva", description: "Vacío = se calcula con la edición anterior si la empresa está en ella." }),
  ],
  validation: (rule) =>
    rule.custom((value: { organization?: unknown; name?: string; position?: number; level?: string; label?: string } | undefined) => {
      if (!value) return true;
      if (!value.organization && !value.name) return "Elige una empresa o escribe un nombre.";
      if (!value.position && !value.level && !value.label) return "Indica la posición, el nivel o una etiqueta.";
      return true;
    }),
  preview: {
    select: { org: "organization.name", name: "name", position: "position", level: "level", label: "label", category: "category" },
    prepare: ({ org, name, position, level, label, category }) => ({
      title: `${position ? `${position}. ` : ""}${name || org || "Sin nombre"}`,
      subtitle: [titleOf(MEDAL_LEVELS, level) ?? label, category].filter(Boolean).join(" · "),
    }),
  },
});

export const editorialObjectTypes = [
  editorialImage,
  bodyImage,
  imagePair,
  pullQuote,
  rankingTableRow,
  rankingTable,
  recordList,
  articleBody,
  simpleText,
  keyFact,
  titledText,
  linkGroup,
  hubIntro,
  editionResult,
];

export { titleOf };
