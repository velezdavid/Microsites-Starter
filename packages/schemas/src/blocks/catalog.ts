import { defineArrayMember, defineField, defineType } from "sanity";
import { blockBaseFields, blockGroups, blockPreview, eyebrowField, sameSiteFilter, titleField } from "../fields";

const categoryField = (name: string, title: string, description?: string, required = true) =>
  defineField({
    name,
    title,
    description,
    type: "reference",
    to: [{ type: "category" }],
    options: { filter: sameSiteFilter },
    group: "content",
    validation: required ? (rule) => rule.required() : undefined,
  });

const text = (name: string, title: string, description?: string) =>
  defineField({ name, title, description, type: "string", group: "content" });

const TEMPLATE_HINT = "{title} se reemplaza por el nombre del ítem.";

export const catalogTabs = defineType({
  name: "catalogTabs",
  title: "Catálogo en pestañas",
  type: "object",
  groups: blockGroups,
  description: "Una pestaña por ítem de la categoría, con sus KPIs y recomendados.",
  fields: [
    eyebrowField,
    titleField,
    defineField({ name: "intro", title: "Introducción", type: "text", rows: 2, group: "content" }),
    categoryField("category", "Categoría"),
    text("ariaLabel", "Nombre accesible de las pestañas"),
    text("chipsLabel", "Etiqueta de KPIs"),
    text("cardsLabel", "Etiqueta de recomendados"),
    text("cardLinkLabel", "Texto del enlace de recomendados"),
    text("ctaLabel", "Texto del botón", TEMPLATE_HINT),
    ...blockBaseFields,
  ],
  validation: (rule) => rule.custom((v: { anchor?: string } | undefined) => (v?.anchor ? true : "Define el ancla (pestaña Diseño).")),
  preview: blockPreview("Catálogo en pestañas"),
});

export const catalogFilterGrid = defineType({
  name: "catalogFilterGrid",
  title: "Catálogo con filtros",
  type: "object",
  groups: blockGroups,
  fields: [
    eyebrowField,
    titleField,
    categoryField("category", "Categoría de las tarjetas"),
    categoryField("filterCategory", "Categoría de los filtros", "Se filtra por los ítems relacionados de esta categoría."),
    categoryField("chipsCategory", "Categoría de los chips", "Ítems relacionados que se muestran como chips en cada tarjeta.", false),
    text("filterAriaLabel", "Nombre accesible de los filtros"),
    text("allLabel", "Texto del filtro «todos»"),
    text("ctaLabel", "Texto del botón", TEMPLATE_HINT),
    defineField({
      name: "cardAnchorPrefix",
      title: "Prefijo del ancla de cada tarjeta",
      type: "string",
      description: "El ancla es prefijo + slug del ítem (p. ej. p-ctv).",
      initialValue: "p-",
      group: "design",
    }),
    ...blockBaseFields,
  ],
  validation: (rule) => rule.custom((v: { anchor?: string } | undefined) => (v?.anchor ? true : "Define el ancla (pestaña Diseño).")),
  preview: blockPreview("Catálogo con filtros"),
});

export const catalogGrid = defineType({
  name: "catalogGrid",
  title: "Grilla de catálogo",
  type: "object",
  groups: blockGroups,
  fields: [
    eyebrowField,
    titleField,
    categoryField("category", "Categoría"),
    text("primaryLabel", "Texto del enlace a la página"),
    categoryField("countCategory", "Categoría a contar", "Cuenta los ítems de esta categoría relacionados con cada celda.", false),
    text("countSingular", "Texto del conteo (singular)"),
    text("countPlural", "Texto del conteo (plural)"),
    ...blockBaseFields,
  ],
  preview: blockPreview("Grilla de catálogo"),
});

export const relatedItems = defineType({
  name: "relatedItems",
  title: "Ítems relacionados",
  type: "object",
  groups: blockGroups,
  fields: [
    eyebrowField,
    text("linkLabel", "Texto del enlace"),
    defineField({
      name: "items",
      title: "Ítems",
      type: "array",
      group: "content",
      description: "Solo se muestran los que tienen página de detalle.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "item" }], options: { filter: sameSiteFilter } })],
    }),
    ...blockBaseFields,
  ],
  preview: {
    select: { eyebrow: "eyebrow" },
    prepare: ({ eyebrow }) => ({ title: eyebrow || "Ítems relacionados", subtitle: "Ítems relacionados" }),
  },
});

export const catalogBlocks = [catalogTabs, catalogFilterGrid, catalogGrid, relatedItems];
