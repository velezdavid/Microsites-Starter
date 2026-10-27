import { defineArrayMember, defineField, type ReferenceFilterResolver } from "sanity";

/** Restricts reference pickers to documents of the same site as the edited document. */
export const sameSiteFilter: ReferenceFilterResolver = ({ document }) => ({
  filter: "site._ref == $site",
  params: { site: (document.site as { _ref?: string } | undefined)?._ref ?? "" },
});

export const siteField = defineField({
  name: "site",
  title: "Sitio",
  type: "reference",
  to: [{ type: "site" }],
  validation: (rule) => rule.required(),
});

export const stringList = (name: string, title: string, description?: string) =>
  defineField({ name, title, description, type: "array", of: [defineArrayMember({ type: "string" })] });

/** Layout fields shared by every page-builder block. */
export const blockBaseFields = [
  defineField({
    name: "anchor",
    title: "Ancla",
    type: "string",
    description: "Id de la sección para enlaces internos (p. ej. contacto → /#contacto). Opcional.",
    group: "design",
  }),
  defineField({
    name: "tone",
    title: "Fondo",
    type: "string",
    options: {
      list: [
        { title: "Base", value: "base" },
        { title: "Superficie", value: "surface" },
        { title: "Profundo", value: "deep" },
      ],
      layout: "radio",
      direction: "horizontal",
    },
    initialValue: "base",
    group: "design",
  }),
  defineField({
    name: "decor",
    title: "Decoración",
    type: "array",
    of: [defineArrayMember({ type: "string" })],
    options: {
      list: [
        { title: "Líneas verticales", value: "lines" },
        { title: "Cuadrícula", value: "grid" },
        { title: "Brillo arriba a la derecha", value: "glow-top-right" },
        { title: "Brillo suave arriba a la derecha", value: "glow-top-right-soft" },
        { title: "Brillo abajo a la izquierda", value: "glow-bottom-left" },
      ],
    },
    group: "design",
  }),
];

export const blockGroups = [
  { name: "content", title: "Contenido", default: true },
  { name: "design", title: "Diseño" },
];

export const eyebrowField = defineField({ name: "eyebrow", title: "Antetítulo", type: "string", group: "content" });
export const titleField = defineField({ name: "title", title: "Título", type: "string", group: "content" });

/** Block preview: title (or eyebrow) plus the block type label. */
export const blockPreview = (label: string) => ({
  select: { title: "title", eyebrow: "eyebrow" },
  prepare: ({ title, eyebrow }: { title?: string; eyebrow?: string }) => ({
    title: title || eyebrow || label,
    subtitle: label,
  }),
});
