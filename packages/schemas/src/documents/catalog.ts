import { defineArrayMember, defineField, defineType, type SlugIsUniqueValidator } from "sanity";
import { sameSiteFilter, siteField, stringList } from "../fields";
import { pageReference } from "../objects";

/** Item slugs only need to be unique within their category (and site). */
const isUniqueInCategory: SlugIsUniqueValidator = async (slug, context) => {
  const { document, getClient } = context;
  const id = document?._id.replace(/^drafts\./, "");
  const params = { slug, category: (document?.category as { _ref?: string })?._ref ?? "", draft: `drafts.${id}`, published: id };
  const query = `!defined(*[_type == "item" && slug.current == $slug && category._ref == $category && !(_id in [$draft, $published])][0]._id)`;
  return getClient({ apiVersion: "2026-10-01" }).fetch(query, params);
};

export const category = defineType({
  name: "category",
  title: "Categoría",
  type: "document",
  fields: [
    siteField,
    defineField({ name: "title", title: "Nombre", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({
      name: "anchor",
      title: "Sección en la página de inicio",
      type: "string",
      description: "Ancla de la sección que muestra esta categoría (p. ej. «objetivos»).",
    }),
    defineField({ name: "order", title: "Orden", type: "number" }),
  ],
  orderings: [{ title: "Orden", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "anchor" } },
});

export const item = defineType({
  name: "item",
  title: "Ítem de catálogo",
  type: "document",
  groups: [
    { name: "summary", title: "Resumen", default: true },
    { name: "relations", title: "Relaciones" },
  ],
  fields: [
    { ...siteField, group: "relations" },
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "category" }],
      options: { filter: sameSiteFilter },
      group: "relations",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "title", title: "Nombre", type: "string", group: "summary", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", isUnique: isUniqueInCategory },
      description: "Identificador dentro de su categoría (filtros y anclas).",
      group: "summary",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "order", title: "Orden", type: "number", group: "summary" }),
    defineField({ name: "meta", title: "Etiqueta corta", type: "string", description: "Etapa, canal o código según la categoría.", group: "summary" }),
    defineField({ name: "headline", title: "Titular", type: "string", group: "summary" }),
    defineField({ name: "text", title: "Descripción breve", type: "text", rows: 3, group: "summary" }),
    defineField({ name: "stat", title: "Cifra", type: "string", group: "summary" }),
    defineField({ name: "statLabel", title: "Etiqueta de la cifra", type: "string", group: "summary" }),
    { ...stringList("bullets", "Puntos clave"), group: "summary" },
    { ...stringList("chips", "Etiquetas (KPIs)"), group: "summary" },
    defineField({
      name: "recommended",
      title: "Recomendados",
      type: "array",
      description: "Ítems sugeridos en las pestañas de catálogo.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "item" }], options: { filter: sameSiteFilter } })],
      group: "relations",
    }),
    defineField({
      name: "related",
      title: "Relacionados",
      type: "array",
      description: "Ítems de otras categorías con los que se vincula (p. ej. el canal y los objetivos de un producto).",
      of: [defineArrayMember({ type: "reference", to: [{ type: "item" }], options: { filter: sameSiteFilter } })],
      group: "relations",
    }),
    { ...pageReference("page", "Página de detalle"), group: "relations" },
  ],
  orderings: [{ title: "Orden", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "category.title" } },
});
