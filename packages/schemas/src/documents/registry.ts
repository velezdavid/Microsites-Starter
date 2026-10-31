import { defineArrayMember, defineField, defineType } from "sanity";
import { sameSiteFilter, siteField, siteSlugField } from "../fields";
import { EVENT_TYPES, titleOf } from "../objects/editorial";

export const sector = defineType({
  name: "sector",
  title: "Sector",
  type: "document",
  fields: [
    siteField,
    defineField({ name: "title", title: "Nombre", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "shortTitle", title: "Nombre corto", type: "string", description: "Para tablas y fichas (p. ej. «Banca»). Vacío = el nombre." }),
    siteSlugField("title"),
    defineField({ name: "order", title: "Orden", type: "number" }),
  ],
  orderings: [{ title: "Orden", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "shortTitle" } },
});

export const organizer = defineType({
  name: "organizer",
  title: "Organizador",
  type: "document",
  fields: [
    siteField,
    defineField({ name: "name", title: "Nombre", type: "string", validation: (rule) => rule.required() }),
    siteSlugField("name"),
    defineField({ name: "description", title: "Descripción corta", type: "string", placeholder: "Monitor de reputación · 12 países" }),
    defineField({ name: "website", title: "Sitio web", type: "url" }),
    defineField({ name: "logo", title: "Logo", type: "editorialImage" }),
  ],
  orderings: [{ title: "Nombre", name: "name", by: [{ field: "name", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "description", media: "logo" } },
});

export const organization = defineType({
  name: "organization",
  title: "Empresa",
  type: "document",
  groups: [
    { name: "profile", title: "Ficha", default: true },
    { name: "status", title: "Estado" },
  ],
  fields: [
    { ...siteField, group: "status" },
    defineField({ name: "name", title: "Nombre", type: "string", group: "profile", validation: (rule) => rule.required() }),
    { ...siteSlugField("name", "URL de la ficha: /empresas/<slug>."), group: "profile" },
    defineField({ name: "logo", title: "Logo", type: "editorialImage", group: "profile" }),
    defineField({
      name: "sector",
      title: "Sector",
      type: "reference",
      to: [{ type: "sector" }],
      options: { filter: sameSiteFilter },
      group: "profile",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "city", title: "Ciudad", type: "string", group: "profile", validation: (rule) => rule.required() }),
    defineField({ name: "founded", title: "Año de fundación", type: "number", group: "profile" }),
    defineField({ name: "employees", title: "Colaboradores", type: "string", placeholder: "4.800", group: "profile" }),
    defineField({ name: "website", title: "Sitio web", type: "url", group: "profile" }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url", group: "profile" }),
    defineField({ name: "description", title: "Descripción", type: "text", rows: 4, group: "profile" }),
    defineField({
      name: "verified",
      title: "Ficha verificada",
      type: "boolean",
      description: "Los datos los confirmó la propia organización.",
      initialValue: false,
      group: "status",
    }),
    defineField({ name: "updatedAt", title: "Última actualización de la ficha", type: "date", group: "status" }),
  ],
  orderings: [{ title: "Nombre", name: "name", by: [{ field: "name", direction: "asc" }] }],
  preview: {
    select: { title: "name", sector: "sector.title", city: "city", verified: "verified", media: "logo" },
    prepare: ({ title, sector, city, verified, media }) => ({
      title,
      subtitle: [sector, city, verified ? "Verificada" : undefined].filter(Boolean).join(" · "),
      media,
    }),
  },
});

const AWARD_TYPES = [
  { title: "Ranking", value: "ranking" },
  { title: "Premio", value: "premio" },
  { title: "Certificación", value: "certificacion" },
];

export const award = defineType({
  name: "award",
  title: "Galardón",
  type: "document",
  groups: [
    { name: "profile", title: "Ficha", default: true },
    { name: "texts", title: "Textos" },
    { name: "calendar", title: "Calendario" },
  ],
  fields: [
    { ...siteField, group: "profile" },
    defineField({ name: "name", title: "Nombre", type: "string", group: "profile", validation: (rule) => rule.required() }),
    defineField({ name: "fullName", title: "Nombre largo", type: "string", description: "Para títulos (p. ej. «Merco Empresas Ecuador»). Vacío = el nombre.", group: "profile" }),
    { ...siteSlugField("name", "URL del galardón: /rankings/<slug>."), group: "profile" },
    defineField({
      name: "type",
      title: "Tipo",
      type: "string",
      options: { list: AWARD_TYPES, layout: "radio", direction: "horizontal" },
      group: "profile",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "category", title: "Categoría", type: "string", placeholder: "Reputación, Talento, Sostenibilidad…", group: "profile", validation: (rule) => rule.required() }),
    defineField({
      name: "organizer",
      title: "Organizador",
      type: "reference",
      to: [{ type: "organizer" }],
      options: { filter: sameSiteFilter },
      group: "profile",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "scope", title: "Ámbito", type: "string", initialValue: "Nacional", group: "profile" }),
    defineField({ name: "periodicity", title: "Periodicidad", type: "string", initialValue: "Anual", group: "profile" }),
    defineField({ name: "firstEdition", title: "Primera edición (año)", type: "number", group: "profile" }),
    defineField({ name: "website", title: "Sitio oficial", type: "url", group: "profile" }),
    defineField({ name: "description", title: "Descripción", type: "text", rows: 3, group: "profile", validation: (rule) => rule.required() }),
    defineField({
      name: "unit",
      title: "Unidad de los resultados",
      type: "string",
      description: "Qué se ordena o premia: «empresas», «líderes», «restaurantes»…",
      initialValue: "empresas",
      group: "profile",
    }),
    defineField({
      name: "corporate",
      title: "Mostrar en «Líderes vigentes»",
      type: "boolean",
      description: "Rankings corporativos cuyo primer lugar se destaca en el índice de Rankings.",
      initialValue: false,
      group: "profile",
    }),
    defineField({
      name: "family",
      title: "Familia",
      type: "object",
      description: "Galardones del mismo organizador que se muestran como pestañas en las ediciones (p. ej. Merco Empresas, Líderes, Talento).",
      group: "profile",
      fields: [
        defineField({ name: "key", title: "Clave de la familia", type: "string", placeholder: "merco" }),
        defineField({ name: "label", title: "Nombre en la pestaña", type: "string", placeholder: "Empresas" }),
      ],
    }),
    defineField({
      name: "about",
      title: "Sobre el galardón",
      type: "array",
      description: "Qué mide, quién evalúa, cómo se verifica.",
      of: [defineArrayMember({ type: "titledText" })],
      group: "texts",
    }),
    defineField({
      name: "nextEdition",
      title: "Próxima edición",
      type: "object",
      group: "calendar",
      fields: [
        defineField({ name: "year", title: "Año", type: "number" }),
        defineField({
          name: "steps",
          title: "Hitos",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "milestone",
              fields: [
                defineField({ name: "when", title: "Cuándo", type: "string", placeholder: "Mar 2027" }),
                defineField({ name: "what", title: "Qué", type: "string" }),
              ],
              preview: { select: { title: "what", subtitle: "when" } },
            }),
          ],
        }),
        defineField({ name: "note", title: "Nota", type: "string", initialValue: "Fechas estimadas según ediciones anteriores." }),
      ],
    }),
    defineField({
      name: "call",
      title: "Convocatoria",
      type: "object",
      description: "Aparece en «Convocatorias abiertas» mientras esté abierta o próxima.",
      group: "calendar",
      fields: [
        defineField({
          name: "status",
          title: "Estado",
          type: "string",
          options: {
            list: [
              { title: "Abierta", value: "abierta" },
              { title: "Próxima", value: "proxima" },
              { title: "Cerrada", value: "cerrada" },
            ],
            layout: "radio",
            direction: "horizontal",
          },
          initialValue: "cerrada",
        }),
        defineField({ name: "edition", title: "Edición", type: "string", placeholder: "Edición 2026" }),
        defineField({ name: "closesAt", title: "Cierre de postulaciones", type: "date" }),
      ],
    }),
  ],
  orderings: [{ title: "Nombre", name: "name", by: [{ field: "name", direction: "asc" }] }],
  preview: {
    select: { title: "name", type: "type", organizer: "organizer.name" },
    prepare: ({ title, type, organizer }) => ({ title, subtitle: [titleOf(AWARD_TYPES, type), organizer].filter(Boolean).join(" · ") }),
  },
});

export const edition = defineType({
  name: "edition",
  title: "Edición",
  type: "document",
  groups: [
    { name: "profile", title: "Datos", default: true },
    { name: "results", title: "Resultados" },
  ],
  fields: [
    { ...siteField, group: "profile" },
    defineField({
      name: "award",
      title: "Galardón",
      type: "reference",
      to: [{ type: "award" }],
      options: { filter: sameSiteFilter },
      group: "profile",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Año",
      type: "number",
      description: "URL de la edición: /rankings/<galardón>/<año>.",
      group: "profile",
      validation: (rule) =>
        rule
          .required()
          .integer()
          .custom(async (year, { document, getClient }) => {
            const awardRef = (document?.award as { _ref?: string } | undefined)?._ref;
            if (!year || !awardRef) return true;
            const id = document!._id.replace(/^drafts\./, "");
            const taken = await getClient({ apiVersion: "2026-10-01" }).fetch<boolean>(
              `defined(*[_type == "edition" && award._ref == $award && year == $year && !(_id in [$id, "drafts." + $id])][0]._id)`,
              { award: awardRef, year, id },
            );
            return taken ? "Ya existe una edición de este galardón para ese año." : true;
          }),
    }),
    defineField({ name: "number", title: "Número de edición", type: "number", group: "profile" }),
    defineField({ name: "publishedAt", title: "Fecha de publicación de resultados", type: "date", group: "profile", validation: (rule) => rule.required() }),
    defineField({
      name: "total",
      title: "Total de resultados",
      type: "number",
      description: "Cuántos tiene la edición completa (el registro puede guardar solo los primeros). Vacío = los cargados.",
      group: "profile",
    }),
    defineField({ name: "summary", title: "Resumen", type: "string", description: "Una línea para las tarjetas («Últimas ediciones»).", group: "profile" }),
    defineField({ name: "intro", title: "Introducción", type: "text", rows: 3, description: "Vacío = la descripción del galardón.", group: "profile" }),
    defineField({ name: "sourceUrl", title: "Fuente oficial", type: "url", group: "profile" }),
    defineField({
      name: "methodology",
      title: "Metodología",
      type: "object",
      group: "profile",
      fields: [
        defineField({ name: "text", title: "Texto", type: "text", rows: 3 }),
        defineField({
          name: "weights",
          title: "Pesos",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "weight",
              fields: [
                defineField({ name: "label", title: "Componente", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "value", title: "Peso (%)", type: "number", validation: (rule) => rule.required().min(0).max(100) }),
              ],
              preview: {
                select: { label: "label", value: "value" },
                prepare: ({ label, value }) => ({ title: label, subtitle: `${value} %` }),
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "results",
      title: "Resultados",
      type: "array",
      of: [defineArrayMember({ type: "editionResult" })],
      group: "results",
    }),
  ],
  orderings: [{ title: "Más recientes", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { award: "award.name", year: "year", results: "results" },
    prepare: ({ award, year, results }) => ({
      title: `${award ?? "Galardón"} ${year ?? ""}`.trim(),
      subtitle: `${results?.length ?? 0} resultados`,
    }),
  },
});

export const event = defineType({
  name: "event",
  title: "Evento",
  type: "document",
  groups: [
    { name: "agenda", title: "Agenda", default: true },
    { name: "page", title: "Ficha" },
    { name: "live", title: "En vivo y después" },
  ],
  fields: [
    { ...siteField, group: "agenda" },
    defineField({ name: "name", title: "Nombre", type: "string", group: "agenda", validation: (rule) => rule.required() }),
    defineField({ name: "shortName", title: "Nombre corto", type: "string", description: "Para el calendario mensual.", group: "agenda", validation: (rule) => rule.required().max(22) }),
    { ...siteSlugField("name", "URL de la ficha: /eventos/<slug>."), group: "agenda" },
    defineField({
      name: "type",
      title: "Tipo",
      type: "string",
      options: { list: EVENT_TYPES, layout: "radio", direction: "horizontal" },
      group: "agenda",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "date", title: "Fecha", type: "date", group: "agenda", validation: (rule) => rule.required() }),
    defineField({
      name: "time",
      title: "Hora (Ecuador)",
      type: "string",
      placeholder: "19:30",
      group: "agenda",
      validation: (rule) => rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "HH:MM" }),
    }),
    defineField({
      name: "organizer",
      title: "Organizador",
      type: "reference",
      to: [{ type: "organizer" }],
      options: { filter: sameSiteFilter },
      group: "agenda",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "city", title: "Ciudad", type: "string", group: "agenda", validation: (rule) => rule.required() }),
    defineField({ name: "venue", title: "Sede (nombre corto)", type: "string", placeholder: "Hilton Colón", group: "agenda", validation: (rule) => rule.required() }),
    defineField({
      name: "edition",
      title: "Edición relacionada",
      type: "reference",
      to: [{ type: "edition" }],
      options: { filter: sameSiteFilter },
      description: "Para galas: la edición cuyos reconocimientos se entregan. Une la gala con sus galas anteriores.",
      group: "agenda",
    }),
    defineField({
      name: "hasPage",
      title: "Tiene ficha propia",
      type: "boolean",
      description: "Sin ficha, el evento solo aparece en la agenda.",
      initialValue: false,
      group: "page",
    }),
    defineField({
      name: "page",
      title: "Ficha",
      type: "object",
      hidden: ({ document }) => !document?.hasPage,
      group: "page",
      fields: [
        defineField({
          name: "title",
          title: "Título",
          type: "array",
          description: "Una línea por elemento.",
          of: [defineArrayMember({ type: "string" })],
          validation: (rule) => rule.required().min(1),
        }),
        defineField({ name: "highlight", title: "Línea resaltada", type: "string", description: "Texto exacto de una línea del título." }),
        defineField({ name: "dek", title: "Bajada", type: "text", rows: 3 }),
        defineField({ name: "summary", title: "Resumen (destacado de la agenda)", type: "text", rows: 2 }),
        defineField({ name: "access", title: "Acceso", type: "string", placeholder: "Por invitación" }),
        defineField({
          name: "venueDetails",
          title: "Sede",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Nombre completo", type: "string" }),
            defineField({ name: "address", title: "Dirección", type: "text", rows: 2, description: "Una línea por renglón." }),
            defineField({ name: "note", title: "Nota", type: "string" }),
            defineField({ name: "mapUrl", title: "Enlace al mapa", type: "url" }),
          ],
        }),
        defineField({
          name: "delivers",
          title: "Qué se entrega",
          type: "object",
          fields: [
            defineField({ name: "text", title: "Texto", type: "text", rows: 3 }),
            defineField({ name: "items", title: "Cifras", type: "array", of: [defineArrayMember({ type: "keyFact" })] }),
          ],
        }),
        defineField({
          name: "program",
          title: "Programa",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "programItem",
              fields: [
                defineField({ name: "time", title: "Hora", type: "string", placeholder: "20:15", validation: (rule) => rule.required() }),
                defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "detail", title: "Detalle", type: "string" }),
              ],
              preview: { select: { title: "title", subtitle: "time" } },
            }),
          ],
        }),
        defineField({ name: "follow", title: "Cómo seguirla", type: "array", of: [defineArrayMember({ type: "titledText" })] }),
      ],
    }),
    defineField({ name: "streamUrl", title: "Transmisión (YouTube o Vimeo)", type: "url", group: "live" }),
    ...(
      [
        ["liveArticle", "Minuto a minuto"],
        ["chronicle", "Crónica"],
        ["gallery", "Galería"],
      ] as const
    ).map(([name, title]) =>
      defineField({ name, title, type: "reference", to: [{ type: "article" }], options: { filter: sameSiteFilter }, group: "live" }),
    ),
  ],
  orderings: [{ title: "Fecha", name: "date", by: [{ field: "date", direction: "asc" }] }],
  preview: {
    select: { title: "name", date: "date", city: "city", type: "type" },
    prepare: ({ title, date, city, type }) => ({ title, subtitle: [date, titleOf(EVENT_TYPES, type), city].filter(Boolean).join(" · ") }),
  },
});

export const registryTypes = [sector, organizer, organization, award, edition, event];
