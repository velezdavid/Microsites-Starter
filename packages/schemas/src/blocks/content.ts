import { defineArrayMember, defineField, defineType } from "sanity";
import { blockBaseFields, blockGroups, blockPreview, eyebrowField, sameSiteFilter, stringList, titleField } from "../fields";

const withGroup = <T extends object>(field: T, group = "content") => ({ ...field, group });

/* ---------- hero ---------- */

const heroStatCard = defineArrayMember({
  name: "heroStatCard",
  title: "Tarjeta con cifra",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Etiqueta", type: "string" }),
    defineField({ name: "value", title: "Cifra", type: "string" }),
    defineField({ name: "caption", title: "Leyenda", type: "string" }),
  ],
  preview: { select: { title: "value", subtitle: "caption" } },
});

const heroStatTabs = defineArrayMember({
  name: "heroStatTabs",
  title: "Cifras por pestañas",
  type: "object",
  fields: [
    defineField({ name: "id", title: "Id", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "Título", type: "string" }),
    defineField({ name: "ariaLabel", title: "Nombre accesible de las pestañas", type: "string" }),
    defineField({
      name: "tabs",
      title: "Pestañas",
      type: "array",
      of: [
        defineArrayMember({
          name: "statTab",
          type: "object",
          fields: [
            defineField({ name: "id", title: "Id", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "label", title: "Texto", type: "string" }),
            defineField({ name: "meta", title: "Nota", type: "string" }),
            defineField({
              name: "stats",
              title: "Cifras",
              type: "array",
              of: [
                defineArrayMember({
                  name: "stat",
                  type: "object",
                  fields: [
                    defineField({ name: "value", title: "Cifra", type: "string" }),
                    defineField({ name: "label", title: "Etiqueta", type: "string" }),
                  ],
                  preview: { select: { title: "value", subtitle: "label" } },
                }),
              ],
            }),
          ],
          preview: { select: { title: "label", subtitle: "meta" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: title || "Cifras por pestañas" }) },
});

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  groups: blockGroups,
  fields: [
    defineField({
      name: "variant",
      title: "Variante",
      type: "string",
      options: { list: [{ title: "Portada", value: "landing" }, { title: "Página interior", value: "page" }], layout: "radio" },
      initialValue: "landing",
      group: "design",
    }),
    defineField({ name: "breadcrumb", title: "Migas de pan", type: "array", of: [defineArrayMember({ type: "link" })], group: "content", description: "Niveles superiores; la página actual (título del hero) se añade al final automáticamente." }),
    eyebrowField,
    withGroup(defineField({ name: "title", title: "Título (H1)", type: "string", validation: (rule) => rule.required() })),
    withGroup(defineField({ name: "titleHighlight", title: "Parte resaltada del título", type: "string", description: "Debe aparecer tal cual dentro del título." })),
    withGroup(defineField({ name: "lead", title: "Bajada destacada", type: "string" })),
    withGroup(defineField({ name: "text", title: "Texto", type: "text", rows: 3 })),
    withGroup(defineField({ name: "actions", title: "Botones", type: "array", of: [defineArrayMember({ type: "buttonLink" })] })),
    withGroup(defineField({ name: "aside", title: "Panel lateral", type: "array", of: [heroStatCard, heroStatTabs], validation: (rule) => rule.max(1) })),
    ...blockBaseFields,
  ],
  preview: blockPreview("Hero"),
});

/* ---------- cardGrid ---------- */

export const cardGrid = defineType({
  name: "cardGrid",
  title: "Grilla de tarjetas",
  type: "object",
  groups: blockGroups,
  fields: [
    eyebrowField,
    titleField,
    withGroup(defineField({ name: "intro", title: "Introducción", type: "text", rows: 3 })),
    withGroup(
      defineField({
        name: "cards",
        title: "Tarjetas",
        type: "array",
        of: [
          defineArrayMember({
            name: "card",
            type: "object",
            fields: [
              defineField({ name: "title", title: "Título", type: "string" }),
              defineField({ name: "text", title: "Texto", type: "text", rows: 2 }),
              defineField({ name: "highlight", title: "Destacar título", type: "boolean" }),
            ],
            preview: { select: { title: "title", subtitle: "text" } },
          }),
        ],
      }),
    ),
    withGroup(defineField({ name: "chipsLabel", title: "Etiqueta de la fila de chips", type: "string" })),
    withGroup(stringList("chips", "Chips")),
    defineField({
      name: "layout",
      title: "Disposición",
      type: "string",
      options: { list: [{ title: "Apilada", value: "stack" }, { title: "Dos columnas", value: "split" }], layout: "radio" },
      initialValue: "stack",
      group: "design",
    }),
    defineField({
      name: "numbering",
      title: "Numeración",
      type: "string",
      options: {
        list: [
          { title: "Sin números", value: "none" },
          { title: "Número arriba", value: "top" },
          { title: "Número al lado", value: "inline" },
        ],
        layout: "radio",
      },
      initialValue: "none",
      group: "design",
    }),
    ...blockBaseFields,
  ],
  preview: blockPreview("Grilla de tarjetas"),
});

/* ---------- statGrid ---------- */

export const statGrid = defineType({
  name: "statGrid",
  title: "Cifras",
  type: "object",
  groups: blockGroups,
  fields: [
    eyebrowField,
    titleField,
    withGroup(
      defineField({
        name: "items",
        title: "Cifras",
        type: "array",
        of: [
          defineArrayMember({
            name: "statItem",
            type: "object",
            fields: [
              defineField({ name: "eyebrow", title: "Antetítulo", type: "string" }),
              defineField({ name: "value", title: "Cifra", type: "string" }),
              defineField({ name: "text", title: "Texto", type: "text", rows: 2 }),
              defineField({ name: "highlight", title: "Destacar", type: "boolean" }),
            ],
            preview: { select: { title: "value", subtitle: "text" } },
          }),
        ],
      }),
    ),
    withGroup(defineField({ name: "highlightsLabel", title: "Etiqueta de bloques destacados", type: "string" })),
    withGroup(
      defineField({
        name: "highlights",
        title: "Bloques destacados",
        type: "array",
        of: [
          defineArrayMember({
            name: "statHighlight",
            type: "object",
            fields: [
              defineField({ name: "title", title: "Título", type: "string" }),
              defineField({ name: "meta", title: "Detalle", type: "string" }),
              defineField({ name: "note", title: "Nota (lo destaca)", type: "string" }),
            ],
            preview: { select: { title: "title", subtitle: "meta" } },
          }),
        ],
      }),
    ),
    withGroup(defineField({ name: "source", title: "Fuente", type: "text", rows: 2 })),
    defineField({
      name: "layout",
      title: "Disposición",
      type: "string",
      options: { list: [{ title: "Tarjetas", value: "cards" }, { title: "Celdas con bordes", value: "cells" }], layout: "radio" },
      initialValue: "cards",
      group: "design",
    }),
    ...blockBaseFields,
  ],
  preview: blockPreview("Cifras"),
});

/* ---------- featureList ---------- */

export const featureList = defineType({
  name: "featureList",
  title: "Lista de características",
  type: "object",
  groups: blockGroups,
  fields: [
    eyebrowField,
    titleField,
    withGroup(defineField({ name: "intro", title: "Introducción", type: "text", rows: 3 })),
    withGroup(
      defineField({
        name: "category",
        title: "Categoría de catálogo",
        type: "reference",
        to: [{ type: "category" }],
        options: { filter: sameSiteFilter },
        description: "Si se elige, la lista muestra los ítems de esa categoría (código = etiqueta corta).",
      }),
    ),
    withGroup(defineField({ name: "linkLabel", title: "Texto de los enlaces", type: "string", initialValue: "Ver más" })),
    withGroup(
      defineField({
        name: "items",
        title: "Elementos manuales",
        type: "array",
        hidden: ({ parent }) => !!parent?.category,
        of: [
          defineArrayMember({
            name: "feature",
            type: "object",
            fields: [
              defineField({ name: "code", title: "Código", type: "string" }),
              defineField({ name: "title", title: "Título", type: "string" }),
              defineField({ name: "text", title: "Texto", type: "text", rows: 2 }),
              defineField({ name: "href", title: "Enlace", type: "string" }),
            ],
            preview: { select: { title: "title", subtitle: "code" } },
          }),
        ],
      }),
    ),
    ...blockBaseFields,
  ],
  preview: blockPreview("Lista de características"),
});

/* ---------- splitList ---------- */

export const splitList = defineType({
  name: "splitList",
  title: "Texto + lista",
  type: "object",
  groups: blockGroups,
  fields: [
    eyebrowField,
    titleField,
    withGroup(defineField({ name: "statement", title: "Frase destacada", type: "text", rows: 3, description: "Se usa en lugar del título." })),
    withGroup(defineField({ name: "text", title: "Texto", type: "text", rows: 3 })),
    withGroup(stringList("tiles", "Recuadros destacados")),
    withGroup(defineField({ name: "listLabel", title: "Etiqueta de la lista", type: "string" })),
    withGroup(stringList("items", "Elementos de la lista")),
    defineField({
      name: "listStyle",
      title: "Estilo de lista",
      type: "string",
      options: { list: [{ title: "Viñetas", value: "bullets" }, { title: "Numerada", value: "numbered" }], layout: "radio" },
      initialValue: "bullets",
      group: "design",
    }),
    ...blockBaseFields,
  ],
  preview: blockPreview("Texto + lista"),
});

/* ---------- variantCards ---------- */

export const variantCards = defineType({
  name: "variantCards",
  title: "Tarjetas de variantes",
  type: "object",
  groups: blockGroups,
  fields: [
    eyebrowField,
    titleField,
    withGroup(defineField({ name: "note", title: "Nota", type: "text", rows: 2 })),
    withGroup(
      defineField({
        name: "cards",
        title: "Tarjetas",
        type: "array",
        of: [
          defineArrayMember({
            name: "variantCard",
            type: "object",
            fields: [
              defineField({ name: "badge", title: "Distintivo", type: "string", description: "Vacío = número de orden." }),
              defineField({ name: "title", title: "Título", type: "string" }),
              defineField({ name: "text", title: "Texto", type: "text", rows: 2 }),
              defineField({ name: "highlight", title: "Destacar", type: "boolean" }),
              defineField({ name: "rows", title: "Filas", type: "array", of: [defineArrayMember({ type: "keyValue" })] }),
            ],
            preview: { select: { title: "title", subtitle: "badge" } },
          }),
        ],
      }),
    ),
    ...blockBaseFields,
  ],
  preview: blockPreview("Tarjetas de variantes"),
});

/* ---------- specTable ---------- */

export const specTable = defineType({
  name: "specTable",
  title: "Tabla de especificaciones",
  type: "object",
  groups: blockGroups,
  fields: [
    eyebrowField,
    titleField,
    withGroup(defineField({ name: "rows", title: "Filas", type: "array", of: [defineArrayMember({ type: "keyValue" })] })),
    withGroup(defineField({ name: "notes", title: "Notas", type: "array", of: [defineArrayMember({ type: "text" })] })),
    withGroup(defineField({ name: "tipsLabel", title: "Título de recomendaciones", type: "string" })),
    withGroup(stringList("tips", "Recomendaciones")),
    ...blockBaseFields,
  ],
  preview: blockPreview("Tabla de especificaciones"),
});

/* ---------- stepFlow ---------- */

export const stepFlow = defineType({
  name: "stepFlow",
  title: "Pasos",
  type: "object",
  groups: blockGroups,
  fields: [
    eyebrowField,
    titleField,
    withGroup(defineField({ name: "text", title: "Texto", type: "text", rows: 3 })),
    withGroup(stringList("steps", "Pasos")),
    withGroup(defineField({ name: "note", title: "Nota", type: "text", rows: 2 })),
    ...blockBaseFields,
  ],
  preview: blockPreview("Pasos"),
});

/* ---------- contactSection ---------- */

export const contactSection = defineType({
  name: "contactSection",
  title: "Contacto",
  type: "object",
  groups: blockGroups,
  fields: [
    eyebrowField,
    withGroup(defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.required() })),
    withGroup(defineField({ name: "text", title: "Texto", type: "text", rows: 3 })),
    withGroup(defineField({ name: "contactTitle", title: "Nombre de contacto", type: "string" })),
    withGroup(defineField({ name: "contactSubtitle", title: "Subtítulo de contacto", type: "string" })),
    withGroup(defineField({ name: "email", title: "Correo", type: "string", validation: (rule) => rule.required().email() })),
    withGroup(defineField({ name: "emailSubject", title: "Asunto del correo", type: "string" })),
    withGroup(defineField({ name: "note", title: "Nota", type: "string" })),
    withGroup(
      defineField({
        name: "form",
        title: "Formulario",
        type: "object",
        description: "Abre el cliente de correo del visitante con la consulta prellenada.",
        options: { collapsible: true, collapsed: false },
        fields: [
          defineField({ name: "enabled", title: "Mostrar formulario", type: "boolean", initialValue: false }),
          defineField({ name: "subject", title: "Asunto", type: "string" }),
          defineField({ name: "contextLabel", title: "Etiqueta de contexto", type: "string", description: "Primera línea del mensaje, p. ej. «Producto»." }),
          defineField({ name: "contextValue", title: "Valor de contexto", type: "string" }),
          defineField({
            name: "fields",
            title: "Campos",
            type: "array",
            of: [
              defineArrayMember({
                name: "formField",
                type: "object",
                fields: [
                  defineField({ name: "name", title: "Nombre técnico", type: "string", validation: (rule) => rule.required() }),
                  defineField({ name: "label", title: "Etiqueta", type: "string" }),
                  defineField({
                    name: "type",
                    title: "Tipo",
                    type: "string",
                    options: { list: ["text", "email", "select", "textarea"] },
                    initialValue: "text",
                  }),
                  defineField({ name: "required", title: "Obligatorio", type: "boolean" }),
                  defineField({ name: "placeholder", title: "Placeholder", type: "string" }),
                  defineField({ name: "options", title: "Opciones (select)", type: "array", of: [defineArrayMember({ type: "string" })] }),
                ],
                preview: { select: { title: "label", subtitle: "type" } },
              }),
            ],
          }),
          defineField({ name: "submitLabel", title: "Texto del botón", type: "string" }),
          defineField({ name: "successMessage", title: "Mensaje tras enviar", type: "string" }),
        ],
      }),
    ),
    ...blockBaseFields,
  ],
  preview: blockPreview("Contacto"),
});

/* ---------- richText ---------- */

export const richText = defineType({
  name: "richText",
  title: "Texto enriquecido",
  type: "object",
  groups: blockGroups,
  fields: [
    eyebrowField,
    withGroup(defineField({ name: "title", title: "Título (H1)", type: "string", validation: (rule) => rule.required() })),
    withGroup(defineField({ name: "meta", title: "Nota bajo el título", type: "string" })),
    withGroup(
      defineField({
        name: "sections",
        title: "Apartados",
        type: "array",
        of: [
          defineArrayMember({
            name: "richTextSection",
            type: "object",
            fields: [
              defineField({ name: "title", title: "Título", type: "string" }),
              defineField({
                name: "body",
                title: "Texto",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "block",
                    styles: [{ title: "Normal", value: "normal" }],
                    lists: [
                      { title: "Viñetas", value: "bullet" },
                      { title: "Numerada", value: "number" },
                    ],
                  }),
                ],
              }),
            ],
            preview: { select: { title: "title" } },
          }),
        ],
      }),
    ),
    ...blockBaseFields,
  ],
  preview: blockPreview("Texto enriquecido"),
});

export const contentBlocks = [hero, cardGrid, statGrid, featureList, splitList, variantCards, specTable, stepFlow, contactSection, richText];
