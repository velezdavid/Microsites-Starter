import { defineArrayMember, defineField, defineType } from "sanity";
import { pageBlockTypes } from "../blocks";
import { siteField } from "../fields";

export const page = defineType({
  name: "page",
  title: "Página",
  type: "document",
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "settings", title: "Ajustes" },
  ],
  fields: [
    { ...siteField, group: "settings" },
    defineField({ name: "title", title: "Nombre interno", type: "string", group: "settings", validation: (rule) => rule.required() }),
    defineField({
      name: "path",
      title: "Ruta",
      type: "string",
      group: "settings",
      description: "Sin barra inicial. Vacío = página de inicio. Puede tener espacios (p. ej. «producto - notoriedad»).",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "settings" }),
    defineField({
      name: "header",
      title: "Encabezado",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "Completo (menús)", value: "full" },
          { title: "Interior (volver + botón)", value: "compact" },
          { title: "Mínimo (solo volver)", value: "minimal" },
        ],
        layout: "radio",
      },
      initialValue: "compact",
    }),
    defineField({
      name: "footer",
      title: "Pie de página",
      type: "string",
      group: "settings",
      options: { list: [{ title: "Completo", value: "full" }, { title: "Mínimo", value: "minimal" }], layout: "radio" },
      initialValue: "minimal",
    }),
    defineField({
      name: "sections",
      title: "Secciones",
      type: "array",
      group: "content",
      of: pageBlockTypes.map((type) => defineArrayMember({ type })),
    }),
  ],
  preview: {
    select: { title: "title", path: "path" },
    prepare: ({ title, path }) => ({ title, subtitle: path ? `/${path}` : "/ (inicio)" }),
  },
});
