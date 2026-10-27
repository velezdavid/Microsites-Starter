import { defineArrayMember, defineField, defineType } from "sanity";
import { sameSiteFilter } from "../fields";

export const link = defineType({
  name: "link",
  title: "Enlace",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Texto", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "href",
      title: "URL",
      type: "string",
      description: "Ruta interna (/…), ancla (#…), mailto: o URL completa.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const buttonLink = defineType({
  name: "buttonLink",
  title: "Botón",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Texto", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "href", title: "URL", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "style",
      title: "Estilo",
      type: "string",
      options: { list: [{ title: "Principal", value: "primary" }, { title: "Secundario", value: "secondary" }], layout: "radio" },
      initialValue: "primary",
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const keyValue = defineType({
  name: "keyValue",
  title: "Fila",
  type: "object",
  fields: [
    defineField({ name: "key", title: "Clave", type: "string" }),
    defineField({ name: "value", title: "Valor", type: "string" }),
  ],
  preview: { select: { title: "key", subtitle: "value" } },
});

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.max(70).warning("Ideal: máximo 70 caracteres") }),
    defineField({ name: "description", title: "Descripción", type: "text", rows: 3, validation: (rule) => rule.max(170).warning("Ideal: máximo 170 caracteres") }),
    defineField({ name: "ogImage", title: "Imagen para redes", type: "image", description: "1200×630 px recomendado." }),
  ],
});

/* ---------- Navigation ---------- */

export const navItem = defineType({
  name: "navItem",
  title: "Enlace de menú",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Texto", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "meta", title: "Etiqueta", type: "string" }),
    defineField({ name: "description", title: "Descripción", type: "text", rows: 2 }),
    defineField({ name: "href", title: "URL", type: "string", validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: "title", subtitle: "href" } },
});

export const navColumn = defineType({
  name: "navColumn",
  title: "Columna manual",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Título", type: "string" }),
    defineField({ name: "href", title: "Enlace del título", type: "string" }),
    defineField({ name: "items", title: "Enlaces", type: "array", of: [defineArrayMember({ type: "navItem" })] }),
  ],
  preview: {
    select: { title: "title", items: "items" },
    prepare: ({ title, items }) => ({ title: title || "Columna", subtitle: `Manual · ${items?.length ?? 0} enlaces` }),
  },
});

export const catalogNavColumn = defineType({
  name: "catalogNavColumn",
  title: "Columna de catálogo",
  type: "object",
  description: "Lista automáticamente los ítems de una categoría.",
  fields: [
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "title", title: "Título", type: "string", description: "Por defecto, el nombre de la categoría." }),
  ],
  preview: {
    select: { title: "title", category: "category.title" },
    prepare: ({ title, category }) => ({ title: title || category || "Columna", subtitle: "Catálogo" }),
  },
});

export const navMenu = defineType({
  name: "navMenu",
  title: "Menú",
  type: "object",
  fields: [
    defineField({ name: "id", title: "Id", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "label", title: "Texto del botón", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "blurb", title: "Descripción", type: "string" }),
    defineField({
      name: "layout",
      title: "Diseño",
      type: "string",
      options: { list: [{ title: "Mega menú (columnas)", value: "mega" }, { title: "Lista con descripciones", value: "list" }], layout: "radio" },
      initialValue: "mega",
    }),
    defineField({
      name: "columns",
      title: "Columnas",
      type: "array",
      of: [defineArrayMember({ type: "catalogNavColumn" }), defineArrayMember({ type: "navColumn" })],
    }),
  ],
  preview: { select: { title: "label", subtitle: "blurb" } },
});

/* ---------- Brand ---------- */

const color = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "string",
    validation: (rule) =>
      rule.required().regex(/^(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\))$/, { name: "color" }).error("Usa #RRGGBB o rgba(…)"),
  });

export const theme = defineType({
  name: "theme",
  title: "Tema",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    color("bg", "Fondo"),
    color("surface", "Superficie"),
    color("surface2", "Superficie 2"),
    color("surfaceEnd", "Final de degradado de tarjetas"),
    color("deep", "Fondo profundo", "Footer y secciones técnicas."),
    color("raised", "Fondo de menús desplegables"),
    color("accent", "Acento"),
    color("accentHover", "Acento (hover)"),
    color("accentSoft", "Acento suave"),
    color("onAccent", "Texto sobre acento"),
    color("text", "Texto"),
    color("muted", "Texto secundario"),
    color("dim", "Texto terciario"),
    color("line", "Bordes"),
    color("lineSoft", "Bordes suaves"),
    color("placeholder", "Placeholder de formularios"),
    defineField({
      name: "fontDisplay",
      title: "Fuente de titulares",
      type: "string",
      description: "Familia CSS. Debe estar autoalojada en apps/web/src/styles/fonts.css.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "fontBody", title: "Fuente de texto", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "fontMono", title: "Fuente monoespaciada", type: "string", validation: (rule) => rule.required() }),
  ],
});

export const logo = defineType({
  name: "logo",
  title: "Logo",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Nombre accesible", type: "string", description: "P. ej. «Marca, inicio».", validation: (rule) => rule.required() }),
    defineField({
      name: "image",
      title: "Imagen del logo",
      type: "image",
      description: "Opcional. Si se carga, reemplaza al logotipo de texto.",
      fields: [defineField({ name: "alt", title: "Texto alternativo", type: "string" })],
    }),
    defineField({
      name: "wordmark",
      title: "Logotipo de texto",
      type: "array",
      description: "Partes del nombre; las marcadas como acento usan el color de acento.",
      of: [
        defineArrayMember({
          type: "object",
          name: "wordmarkPart",
          fields: [
            defineField({ name: "text", title: "Texto", type: "string" }),
            defineField({ name: "accent", title: "Acento", type: "boolean", initialValue: false }),
          ],
          preview: {
            select: { title: "text", accent: "accent" },
            prepare: ({ title, accent }) => ({ title, subtitle: accent ? "Acento" : undefined }),
          },
        }),
      ],
    }),
    defineField({
      name: "mark",
      title: "Símbolo",
      type: "string",
      options: { list: [{ title: "Ninguno", value: "none" }, { title: "Anillos concéntricos", value: "rings" }], layout: "radio" },
      initialValue: "none",
    }),
  ],
});

export const redirect = defineType({
  name: "redirect",
  title: "Redirección",
  type: "object",
  fields: [
    defineField({ name: "from", title: "Desde", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "to", title: "Hacia", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "status",
      title: "Código",
      type: "number",
      options: { list: [200, 301, 302, 404] },
      initialValue: 301,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "force", title: "Forzar", type: "boolean", description: "Aplicar aunque exista un archivo en esa ruta.", initialValue: false }),
  ],
  preview: {
    select: { from: "from", to: "to", status: "status" },
    prepare: ({ from, to, status }) => ({ title: `${from} → ${to}`, subtitle: String(status) }),
  },
});

/** Reference to a page of the same site. */
export const pageReference = (name: string, title: string, description?: string) =>
  defineField({ name, title, description, type: "reference", to: [{ type: "page" }], options: { filter: sameSiteFilter } });

export const objectTypes = [link, buttonLink, keyValue, seo, navItem, navColumn, catalogNavColumn, navMenu, theme, logo, redirect];
