import { defineArrayMember, defineField, defineType, type ValidationContext } from "sanity";
import { sameSiteFilter, siteField, siteSlugField } from "../fields";
import { ARTICLE_TYPES, EDITORIAL_FORMS } from "../objects/editorial";

/** Validation of `site` for singletons: only one document of the type per site. */
const onePerSite = (type: string) => async (value: { _ref?: string } | undefined, { document, getClient }: ValidationContext) => {
  if (!value?._ref || !document) return true;
  const id = document._id.replace(/^drafts\./, "");
  const taken = await getClient({ apiVersion: "2026-10-01" }).fetch<boolean>(
    `defined(*[_type == $type && site._ref == $site && !(_id in [$id, "drafts." + $id])][0]._id)`,
    { type, site: value._ref, id },
  );
  return taken ? "Este sitio ya tiene uno; edita ese documento." : true;
};

const articleRefs = (name: string, title: string, max: number, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "array",
    of: [defineArrayMember({ type: "reference", to: [{ type: "article" }], options: { filter: sameSiteFilter } })],
    validation: (rule) => rule.max(max).unique(),
  });

export const editorialSettings = defineType({
  name: "editorialSettings",
  title: "Ajustes editoriales",
  type: "document",
  groups: [
    { name: "chrome", title: "Cabecera y pie", default: true },
    { name: "sections", title: "Secciones" },
    { name: "newsletter", title: "Newsletter" },
  ],
  fields: [
    defineField({
      ...siteField,
      group: "chrome",
      validation: (rule) => rule.required().custom(onePerSite("editorialSettings")),
    }),
    defineField({
      name: "masthead",
      title: "Cabecera",
      type: "object",
      group: "chrome",
      description: "El logo es el de Configuración → Marca.",
      fields: [
        defineField({ name: "locale", title: "Zona junto a la fecha", type: "string", placeholder: "Ecuador" }),
        defineField({ name: "nav", title: "Menú", type: "array", of: [defineArrayMember({ type: "link" })] }),
      ],
    }),
    defineField({
      name: "footer",
      title: "Pie",
      type: "object",
      group: "chrome",
      fields: [
        defineField({
          name: "logo",
          title: "Logo para fondo oscuro",
          type: "image",
          fields: [defineField({ name: "alt", title: "Texto alternativo", type: "string" })],
        }),
        defineField({ name: "tagline", title: "Frase", type: "text", rows: 2 }),
        defineField({ name: "columns", title: "Columnas", type: "array", of: [defineArrayMember({ type: "linkGroup" })], validation: (rule) => rule.max(4) }),
        defineField({ name: "bottomLeft", title: "Texto inferior izquierdo", type: "string", placeholder: "© 2026 Marca" }),
        defineField({ name: "bottomRight", title: "Texto inferior derecho", type: "string" }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Secciones de Actualidad",
      type: "array",
      group: "sections",
      description: "Pestañas de /actualidad. Cada una agrupa uno o más tipos de artículo.",
      of: [
        defineArrayMember({
          type: "object",
          name: "newsSection",
          fields: [
            defineField({ name: "label", title: "Nombre", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "slug",
              title: "Slug",
              type: "slug",
              description: "URL: /actualidad/<slug>.",
              options: { source: (_doc, { parent }) => (parent as { label?: string })?.label ?? "" },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "types",
              title: "Tipos de artículo",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              options: { list: ARTICLE_TYPES },
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: { select: { title: "label", subtitle: "slug.current" } },
        }),
      ],
    }),
    defineField({ name: "actualidad", title: "Índice de Actualidad", type: "hubIntro", group: "sections" }),
    defineField({ name: "rankings", title: "Índice de Rankings", type: "hubIntro", group: "sections" }),
    defineField({
      name: "rankingsSearch",
      title: "Buscador de Rankings: búsquedas frecuentes",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "sections",
    }),
    defineField({ name: "empresas", title: "Índice de Empresas", type: "hubIntro", group: "sections" }),
    defineField({ name: "eventos", title: "Índice de Eventos", type: "hubIntro", group: "sections" }),
    defineField({
      name: "newsletterBand",
      title: "Banda del newsletter (antes del pie)",
      type: "object",
      group: "newsletter",
      fields: [
        defineField({ name: "eyebrow", title: "Antetítulo", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "text", title: "Texto general", type: "string", description: "Cada índice o página puede cambiarlo." }),
        defineField({ name: "cta", title: "Botón", type: "string", initialValue: "Suscribirme" }),
        defineField({ name: "placeholder", title: "Ejemplo de correo", type: "string", initialValue: "nombre@empresa.com" }),
        defineField({ name: "consent", title: "Texto de aceptación", type: "string" }),
        defineField({ name: "success", title: "Mensaje de éxito", type: "string" }),
      ],
    }),
    defineField({
      name: "newsletterPage",
      title: "Página /newsletter",
      type: "object",
      group: "newsletter",
      fields: [
        defineField({ name: "eyebrow", title: "Antetítulo", type: "string", placeholder: "Cada lunes · 7:00" }),
        defineField({ name: "title", title: "Título", type: "array", description: "Una línea por elemento.", of: [defineArrayMember({ type: "string" })] }),
        defineField({ name: "text", title: "Texto", type: "text", rows: 3 }),
        defineField({
          name: "totals",
          title: "Cifras",
          type: "array",
          description: "El número de ediciones publicadas se agrega solo al principio.",
          of: [defineArrayMember({ type: "keyFact" })],
        }),
        defineField({ name: "formTitle", title: "Título del formulario", type: "string" }),
        defineField({ name: "formNote", title: "Nota del formulario", type: "text", rows: 2 }),
        defineField({ name: "successEyebrow", title: "Éxito: antetítulo", type: "string" }),
        defineField({ name: "successTitle", title: "Éxito: título", type: "string" }),
        defineField({ name: "successText", title: "Éxito: texto", type: "text", rows: 2 }),
        defineField({ name: "benefitsEyebrow", title: "Antetítulo de «Qué recibes»", type: "string" }),
        defineField({ name: "benefitsTitle", title: "Título de «Qué recibes»", type: "string" }),
        defineField({ name: "benefits", title: "Qué recibes", type: "array", of: [defineArrayMember({ type: "titledText" })] }),
      ],
    }),
  ],
  preview: { select: { site: "site.name" }, prepare: ({ site }) => ({ title: "Ajustes editoriales", subtitle: site }) },
});

export const frontPage = defineType({
  name: "frontPage",
  title: "Portada y destacados",
  type: "document",
  fields: [
    defineField({ ...siteField, validation: (rule) => rule.required().custom(onePerSite("frontPage")) }),
    defineField({
      name: "lead",
      title: "Apertura: artículo principal",
      type: "reference",
      to: [{ type: "article" }],
      options: { filter: sameSiteFilter },
      description: "Vacío = el artículo más reciente.",
    }),
    articleRefs("secondary", "Apertura: secundarios", 2),
    articleRefs("newsRow", "Fila de noticias", 4, "Vacío = las noticias más recientes."),
    articleRefs("opinion", "Opinión", 3, "Vacío = las columnas más recientes."),
    articleRefs("interviews", "Entrevistas", 3, "La primera va grande. Vacío = las entrevistas más recientes."),
    defineField({
      name: "report",
      title: "Informe",
      type: "reference",
      to: [{ type: "article" }],
      options: { filter: sameSiteFilter },
      description: "Vacío = el informe más reciente.",
    }),
    articleRefs("analysis", "Análisis", 3, "Vacío = los análisis más recientes."),
    articleRefs("mostRead", "Más leídos", 5, "Se muestran en la portada, Actualidad y los artículos."),
    defineField({
      name: "featuredEdition",
      title: "Edición destacada del registro",
      type: "reference",
      to: [{ type: "edition" }],
      options: { filter: sameSiteFilter },
      description: "Sus primeras cinco posiciones salen en «El registro esta semana».",
    }),
    defineField({
      name: "featuredEvent",
      title: "Evento destacado de la agenda",
      type: "reference",
      to: [{ type: "event" }],
      options: { filter: sameSiteFilter },
      description: "Vacío = la próxima gala con ficha propia.",
    }),
  ],
  preview: { select: { site: "site.name" }, prepare: ({ site }) => ({ title: "Portada y destacados", subtitle: site }) },
});

const PAGE_GROUPS = [
  { title: "Institucional (/<slug>)", value: "institucional" },
  { title: "Participa (/participa/<slug>)", value: "participa" },
];

export const editorialPage = defineType({
  name: "editorialPage",
  title: "Página institucional",
  type: "document",
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "settings", title: "Ajustes" },
  ],
  fields: [
    { ...siteField, group: "settings" },
    defineField({
      name: "group",
      title: "Grupo",
      type: "string",
      description: "Define la URL y el menú lateral donde aparece.",
      options: { list: PAGE_GROUPS, layout: "radio" },
      initialValue: "institucional",
      group: "settings",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "menuLabel", title: "Nombre en el menú", type: "string", group: "settings", validation: (rule) => rule.required() }),
    { ...siteSlugField("menuLabel"), group: "settings" },
    defineField({ name: "order", title: "Orden en el menú", type: "number", group: "settings" }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "settings" }),
    defineField({ name: "eyebrow", title: "Antetítulo", type: "string", group: "content" }),
    defineField({ name: "title", title: "Título", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "lead", title: "Introducción", type: "text", rows: 3, group: "content" }),
    defineField({
      name: "sections",
      title: "Secciones",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "docSection",
          fields: [
            defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "body", title: "Texto", type: "simpleText" }),
            defineField({ name: "rows", title: "Datos", type: "array", of: [defineArrayMember({ type: "keyValue" })] }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    defineField({
      name: "form",
      title: "Formulario",
      type: "string",
      description: "Los campos son fijos (Netlify Forms); aquí se eligen y se editan sus textos.",
      options: { list: EDITORIAL_FORMS },
      group: "content",
    }),
    defineField({
      name: "formCopy",
      title: "Textos del formulario",
      type: "object",
      hidden: ({ document }) => !document?.form,
      group: "content",
      fields: [
        defineField({ name: "submit", title: "Botón", type: "string" }),
        defineField({ name: "note", title: "Nota", type: "text", rows: 2 }),
        defineField({ name: "successEyebrow", title: "Éxito: antetítulo", type: "string", initialValue: "Recibido" }),
        defineField({ name: "successTitle", title: "Éxito: título", type: "string", initialValue: "Gracias." }),
        defineField({ name: "successText", title: "Éxito: texto", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "footnote",
      title: "Nota final",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "text", title: "Texto", type: "string" }),
        defineField({ name: "link", title: "Enlace", type: "link" }),
      ],
    }),
    defineField({ name: "newsletterText", title: "Texto de la banda del newsletter", type: "string", description: "Vacío = el texto general.", group: "content" }),
  ],
  orderings: [{ title: "Orden", name: "order", by: [{ field: "group", direction: "asc" }, { field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "menuLabel", group: "group", slug: "slug.current" },
    prepare: ({ title, group, slug }) => ({ title, subtitle: group === "participa" ? `/participa/${slug ?? ""}` : `/${slug ?? ""}` }),
  },
});

export const editorialSiteTypes = [editorialSettings, frontPage, editorialPage];
