import { defineArrayMember, defineField, defineType } from "sanity";
import { sameSiteFilter, siteField, siteSlugField } from "../fields";
import { ARTICLE_TYPES, titleOf } from "../objects/editorial";

export const article = defineType({
  name: "article",
  title: "Artículo",
  type: "document",
  groups: [
    { name: "header", title: "Cabecera", default: true },
    { name: "body", title: "Cuerpo" },
    { name: "relations", title: "Clasificación" },
    { name: "settings", title: "Ajustes" },
  ],
  fields: [
    { ...siteField, group: "settings" },
    defineField({
      name: "type",
      title: "Tipo",
      type: "string",
      options: { list: ARTICLE_TYPES },
      initialValue: "noticia",
      group: "header",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "kicker", title: "Antetítulo", type: "string", group: "header", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "Titular", type: "string", group: "header", validation: (rule) => rule.required() }),
    defineField({
      name: "highlight",
      title: "Parte resaltada del titular",
      type: "string",
      description: "Texto exacto del titular que se muestra en el color de acento.",
      group: "header",
      validation: (rule) =>
        rule.custom((value, { document }) =>
          !value || String(document?.title ?? "").includes(value) ? true : "Debe ser un fragmento literal del titular.",
        ),
    }),
    defineField({ name: "dek", title: "Bajada", type: "text", rows: 3, group: "header" }),
    { ...siteSlugField("title", "URL del artículo: /actualidad/<slug>."), group: "header" },
    defineField({
      name: "authors",
      title: "Autores",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "author" }], options: { filter: sameSiteFilter } })],
      group: "header",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "publishedAt", title: "Fecha de publicación", type: "datetime", group: "header", validation: (rule) => rule.required() }),
    defineField({ name: "place", title: "Ciudad", type: "string", group: "header" }),
    defineField({ name: "image", title: "Foto principal", type: "editorialImage", group: "header" }),
    defineField({
      name: "layout",
      title: "Diseño",
      type: "string",
      options: {
        list: [
          { title: "Estándar", value: "standard" },
          { title: "Reportaje (foto a todo el ancho, columna centrada)", value: "feature" },
        ],
        layout: "radio",
      },
      initialValue: "standard",
      group: "body",
    }),
    defineField({
      name: "photoCredit",
      title: "Crédito general de fotos",
      type: "string",
      placeholder: "Fotos de Nombre Apellido",
      hidden: ({ document }) => document?.layout !== "feature",
      group: "body",
    }),
    defineField({
      name: "keyFacts",
      title: "Datos clave",
      type: "array",
      of: [defineArrayMember({ type: "keyFact" })],
      validation: (rule) => rule.max(6),
      group: "body",
    }),
    defineField({ name: "body", title: "Cuerpo", type: "articleBody", group: "body" }),
    defineField({
      name: "readingMinutes",
      title: "Minutos de lectura",
      type: "number",
      description: "Vacío = se calcula con el cuerpo.",
      group: "body",
    }),
    defineField({
      name: "topics",
      title: "Temas",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "topic" }], options: { filter: sameSiteFilter } })],
      group: "relations",
    }),
    defineField({
      name: "mentions",
      title: "Mencionados en esta nota",
      type: "array",
      description: "Fichas del registro relacionadas. El artículo aparece también en ellas.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "organization" }, { type: "award" }, { type: "edition" }, { type: "event" }],
          options: { filter: sameSiteFilter },
        }),
      ],
      group: "relations",
    }),
    defineField({ name: "sponsored", title: "Contenido de marca", type: "boolean", initialValue: false, group: "relations" }),
    defineField({
      name: "sponsor",
      title: "Patrocinio",
      type: "object",
      hidden: ({ document }) => !document?.sponsored,
      group: "relations",
      fields: [
        defineField({ name: "brand", title: "Marca", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "logo", title: "Logo", type: "image" }),
        defineField({ name: "label", title: "Rótulo", type: "string", initialValue: "Contenido de marca · Presentado por" }),
        defineField({ name: "note", title: "Aviso", type: "text", rows: 3 }),
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "settings" }),
  ],
  orderings: [{ title: "Más recientes", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", type: "type", date: "publishedAt", media: "image", sponsored: "sponsored" },
    prepare: ({ title, type, date, media, sponsored }) => ({
      title,
      subtitle: [titleOf(ARTICLE_TYPES, type), date?.slice(0, 10), sponsored ? "Marca" : undefined].filter(Boolean).join(" · "),
      media,
    }),
  },
});

export const author = defineType({
  name: "author",
  title: "Autor",
  type: "document",
  fields: [
    siteField,
    defineField({ name: "name", title: "Nombre", type: "string", validation: (rule) => rule.required() }),
    siteSlugField("name"),
    defineField({
      name: "role",
      title: "Cargo o descripción",
      type: "string",
      description: "Se muestra bajo el nombre en Opinión (p. ej. «Consultora en gobierno corporativo»).",
    }),
    defineField({ name: "photo", title: "Foto", type: "editorialImage" }),
    defineField({ name: "bio", title: "Biografía corta", type: "text", rows: 3 }),
  ],
  orderings: [{ title: "Nombre", name: "name", by: [{ field: "name", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

export const topic = defineType({
  name: "topic",
  title: "Tema",
  type: "document",
  fields: [
    siteField,
    defineField({ name: "title", title: "Nombre", type: "string", validation: (rule) => rule.required() }),
    siteSlugField("title"),
    defineField({ name: "description", title: "Descripción", type: "text", rows: 3 }),
  ],
  orderings: [{ title: "Nombre", name: "title", by: [{ field: "title", direction: "asc" }] }],
  preview: { select: { title: "title" } },
});

export const movement = defineType({
  name: "movement",
  title: "Movimiento",
  type: "document",
  fields: [
    siteField,
    defineField({ name: "person", title: "Persona", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "role", title: "Cargo", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "organization", title: "Empresa", type: "reference", to: [{ type: "organization" }], options: { filter: sameSiteFilter } }),
    defineField({
      name: "organizationName",
      title: "Empresa (sin ficha)",
      type: "string",
      hidden: ({ document }) => !!document?.organization,
    }),
    defineField({ name: "date", title: "Fecha", type: "date", validation: (rule) => rule.required() }),
    defineField({ name: "photo", title: "Foto", type: "editorialImage" }),
  ],
  validation: (rule) =>
    rule.custom((doc) => (doc?.organization || doc?.organizationName ? true : "Elige una empresa o escribe su nombre.")),
  orderings: [{ title: "Más recientes", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { person: "person", role: "role", org: "organization.name", orgName: "organizationName", media: "photo" },
    prepare: ({ person, role, org, orgName, media }) => ({ title: person, subtitle: `${role} · ${org ?? orgName ?? ""}`, media }),
  },
});

export const newsletterIssue = defineType({
  name: "newsletterIssue",
  title: "Edición del newsletter",
  type: "document",
  fields: [
    siteField,
    defineField({ name: "number", title: "Número", type: "number", validation: (rule) => rule.required().integer().positive() }),
    defineField({ name: "date", title: "Fecha de envío", type: "date", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "url", title: "Enlace a la edición", type: "url" }),
  ],
  orderings: [{ title: "Número", name: "numberDesc", by: [{ field: "number", direction: "desc" }] }],
  preview: {
    select: { number: "number", title: "title", date: "date" },
    prepare: ({ number, title, date }) => ({ title: `N.º ${number} · ${title}`, subtitle: date }),
  },
});

export const editorialContentTypes = [article, author, topic, movement, newsletterIssue];
