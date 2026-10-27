import { defineArrayMember, defineField, defineType } from "sanity";
import { pageReference } from "../objects";

export const site = defineType({
  name: "site",
  title: "Micrositio",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "brand", title: "Marca" },
    { name: "navigation", title: "Navegación" },
    { name: "advanced", title: "Avanzado" },
  ],
  fields: [
    defineField({ name: "name", title: "Nombre", type: "string", group: "general", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Debe coincidir con SITE_SLUG del sitio en Netlify.",
      options: { source: "name" },
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "url", title: "URL pública", type: "url", group: "general", validation: (rule) => rule.required() }),
    defineField({ name: "lang", title: "Idioma", type: "string", initialValue: "es", group: "general" }),
    defineField({ name: "seo", title: "SEO por defecto", type: "seo", group: "general" }),
    defineField({
      name: "allowAiCrawlers",
      title: "Permitir rastreadores de IA",
      type: "boolean",
      description:
        "GPTBot, ClaudeBot, PerplexityBot, Google-Extended… Activado: pueden leer el sitio (aparecer en respuestas de IA). Desactivado: se bloquean en robots.txt. Vacío = permitido.",
      initialValue: true,
      group: "general",
    }),
    defineField({
      name: "analytics",
      title: "Analítica",
      type: "object",
      group: "general",
      description: "Vacío = sin analítica. Si hay ID de GTM, GA4 se configura dentro de GTM.",
      fields: [
        defineField({ name: "gtmId", title: "Google Tag Manager ID", type: "string", placeholder: "GTM-XXXXXXX" }),
        defineField({ name: "ga4Id", title: "GA4 Measurement ID", type: "string", placeholder: "G-XXXXXXXXXX" }),
        defineField({
          name: "loading",
          title: "Carga de scripts de terceros",
          type: "string",
          description:
            "Aplica a GTM, GA4 y los scripts externos. «Tras interacción» protege la velocidad (Lighthouse), pero no registra a quien se va sin interactuar antes del tiempo máximo. Vacío = tras interacción.",
          options: {
            list: [
              { title: "Tras la primera interacción (recomendado)", value: "interaction" },
              { title: "Inmediata", value: "immediate" },
            ],
            layout: "radio",
          },
          initialValue: "interaction",
        }),
        defineField({
          name: "maxDelay",
          title: "Tiempo máximo de espera (segundos)",
          type: "number",
          description: "Si no hay interacción, se cargan igualmente pasado este tiempo desde la carga de la página. Vacío = 4.",
          initialValue: 4,
          hidden: ({ parent }) => parent?.loading === "immediate",
          validation: (rule) => rule.min(0).max(30),
        }),
      ],
    }),

    defineField({ name: "logo", title: "Logo", type: "logo", group: "brand" }),
    defineField({ name: "theme", title: "Tema (design tokens)", type: "theme", group: "brand" }),

    defineField({
      name: "header",
      title: "Encabezado",
      type: "object",
      group: "navigation",
      fields: [
        defineField({ name: "nav", title: "Menús (página de inicio)", type: "array", of: [defineArrayMember({ type: "navMenu" })] }),
        defineField({ name: "cta", title: "Botón principal", type: "link" }),
        defineField({ name: "backLabel", title: "Texto «volver» en páginas interiores", type: "string", initialValue: "← Inicio" }),
        defineField({ name: "pageCta", title: "Botón en páginas interiores", type: "link" }),
        defineField({ name: "minimalBackLabel", title: "Texto «volver» en páginas legales", type: "string" }),
      ],
    }),
    defineField({
      name: "footer",
      title: "Pie de página",
      type: "object",
      group: "navigation",
      fields: [
        defineField({ name: "tagline", title: "Frase de marca", type: "string" }),
        defineField({
          name: "columns",
          title: "Columnas",
          type: "array",
          of: [defineArrayMember({ type: "catalogNavColumn" }), defineArrayMember({ type: "navColumn" })],
        }),
        defineField({ name: "bottomText", title: "Texto inferior", type: "string" }),
        defineField({ name: "legalLabel", title: "Texto del enlace legal", type: "string" }),
        pageReference("legalPage", "Página legal"),
      ],
    }),
    defineField({
      name: "catalogLabel",
      title: "Nombre del catálogo",
      type: "string",
      description: "Primer nivel de las migas de pan en las páginas de detalle (p. ej. «Soluciones»).",
      group: "navigation",
    }),

    defineField({
      name: "redirects",
      title: "Redirecciones (Netlify)",
      type: "array",
      group: "advanced",
      description: "Se aplican en orden. La regla comodín (/*) debe ir al final.",
      of: [defineArrayMember({ type: "redirect" })],
    }),
    defineField({
      name: "scripts",
      title: "Scripts externos",
      type: "array",
      group: "advanced",
      description: "Herramientas de terceros (p. ej. trackers). Se cargan con async al final del <body>. GA4/GTM van en General → Analítica.",
      of: [
        defineArrayMember({
          name: "externalScript",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Nombre", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "src",
              title: "URL del script",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["https"] }),
            }),
            defineField({
              name: "attributes",
              title: "Atributos",
              type: "array",
              description: "Solo atributos data-* (p. ej. data-site-id).",
              of: [
                defineArrayMember({
                  name: "scriptAttribute",
                  type: "object",
                  fields: [
                    defineField({
                      name: "name",
                      title: "Nombre",
                      type: "string",
                      validation: (rule) => rule.required().regex(/^data-[a-z0-9-]+$/, { name: "data-*" }),
                    }),
                    defineField({ name: "value", title: "Valor", type: "string" }),
                  ],
                  preview: { select: { title: "name", subtitle: "value" } },
                }),
              ],
            }),
          ],
          preview: { select: { title: "label", subtitle: "src" } },
        }),
      ],
    }),
    defineField({
      name: "verificationFiles",
      title: "Archivos de verificación",
      type: "array",
      group: "advanced",
      description: "Archivos que servicios como Google Search Console piden publicar en la raíz del dominio.",
      of: [
        defineArrayMember({
          name: "verificationFile",
          type: "object",
          fields: [
            defineField({
              name: "filename",
              title: "Nombre del archivo",
              type: "string",
              description: "P. ej. google1234abcd.html",
              validation: (rule) => rule.required().regex(/^[A-Za-z0-9._-]+\.(html|txt)$/, { name: "archivo .html o .txt" }),
            }),
            defineField({ name: "content", title: "Contenido", type: "text", rows: 2, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "filename", subtitle: "content" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "url" } },
});
