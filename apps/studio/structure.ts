import type { Template } from "sanity";
import type { ListItemBuilder, StructureBuilder, StructureResolver } from "sanity/structure";
import { ARTICLE_TYPES } from "@microsites/schemas";

const API_VERSION = "2026-10-01";

const SITE_SCOPED = [
  { type: "page", title: "Páginas" },
  { type: "category", title: "Categorías" },
  { type: "item", title: "Catálogo" },
] as const;

/** Documents of editorial sites (news + registry), listed under each site that has editorial settings. */
const EDITORIAL_SCOPED = [
  { type: "editorialSettings", title: "Ajustes editoriales" },
  { type: "frontPage", title: "Portada y destacados" },
  { type: "article", title: "Artículos" },
  { type: "author", title: "Autores" },
  { type: "topic", title: "Temas" },
  { type: "movement", title: "Movimientos" },
  { type: "newsletterIssue", title: "Ediciones del newsletter" },
  { type: "award", title: "Galardones" },
  { type: "edition", title: "Ediciones" },
  { type: "organization", title: "Empresas" },
  { type: "sector", title: "Sectores" },
  { type: "organizer", title: "Organizadores" },
  { type: "event", title: "Eventos" },
  { type: "editorialPage", title: "Páginas institucionales" },
] as const;

/**
 * Types that are only created from a site's lists (their default templates are hidden).
 * Editorial settings keep theirs: creating them under "Sitios editoriales" is how a site becomes editorial.
 */
export const siteScopedTypes: string[] = [...SITE_SCOPED, ...EDITORIAL_SCOPED].map(({ type }) => type).filter((type) => type !== "editorialSettings");

/** Templates that create site-scoped documents with the site already set. */
export const siteTemplates: Template[] = [
  ...[...SITE_SCOPED, ...EDITORIAL_SCOPED].map(({ type, title }) => ({
    id: `${type}-by-site`,
    title: `${title} del sitio`,
    schemaType: type,
    parameters: [{ name: "siteId", type: "string" }],
    value: ({ siteId }: { siteId: string }) => ({ site: { _type: "reference", _ref: siteId } }),
  })),
  {
    id: "edition-by-award",
    title: "Edición del galardón",
    schemaType: "edition",
    parameters: [
      { name: "siteId", type: "string" },
      { name: "awardId", type: "string" },
    ],
    value: ({ siteId, awardId }: { siteId: string; awardId: string }) => ({
      site: { _type: "reference", _ref: siteId },
      award: { _type: "reference", _ref: awardId },
    }),
  },
];

type Ordering = { field: string; direction: "asc" | "desc" }[];

const ORDERING: Record<string, Ordering> = {
  page: [{ field: "path", direction: "asc" }],
  article: [{ field: "publishedAt", direction: "desc" }],
  movement: [{ field: "date", direction: "desc" }],
  newsletterIssue: [{ field: "number", direction: "desc" }],
  edition: [{ field: "publishedAt", direction: "desc" }],
  event: [{ field: "date", direction: "asc" }],
  author: [{ field: "name", direction: "asc" }],
  organization: [{ field: "name", direction: "asc" }],
  organizer: [{ field: "name", direction: "asc" }],
  award: [{ field: "name", direction: "asc" }],
  topic: [{ field: "title", direction: "asc" }],
  editorialPage: [
    { field: "group", direction: "asc" },
    { field: "order", direction: "asc" },
  ],
};

/** List of a site's documents of one type, optionally narrowed with an extra GROQ condition. */
function siteList(S: StructureBuilder, siteId: string, type: string, title: string, extra?: { filter: string; params?: Record<string, unknown> }) {
  return S.documentTypeList(type)
    .title(title)
    .filter(`_type == $type && site._ref == $siteId${extra ? ` && ${extra.filter}` : ""}`)
    .params({ type, siteId, ...extra?.params })
    .defaultOrdering(ORDERING[type] ?? [{ field: "order", direction: "asc" }])
    .initialValueTemplates([S.initialValueTemplateItem(`${type}-by-site`, { siteId })]);
}

const listItem = (S: StructureBuilder, siteId: string, type: string, title: string) =>
  S.listItem().title(title).schemaType(type).child(siteList(S, siteId, type, title));

/** One document per site (editorial settings, front page): opens the existing one or a new one with the site set. */
const singletonItem = (S: StructureBuilder, siteId: string, type: string, title: string, existingId: string | undefined, idSuffix: string) =>
  S.listItem()
    .title(title)
    .schemaType(type)
    .child(
      S.document()
        .schemaType(type)
        .documentId(existingId ?? `${siteId}-${idSuffix}`)
        .initialValueTemplate(`${type}-by-site`, { siteId }),
    );

function editorialItems(S: StructureBuilder, siteId: string, ids: { settings?: string; front?: string }): (ListItemBuilder | ReturnType<StructureBuilder["divider"]>)[] {
  const today = new Date().toISOString().slice(0, 10);
  return [
    singletonItem(S, siteId, "editorialSettings", "Ajustes editoriales", ids.settings, "editorial"),
    singletonItem(S, siteId, "frontPage", "Portada y destacados", ids.front, "front-page"),
    S.divider(),
    S.listItem()
      .title("Actualidad")
      .child(
        S.list()
          .title("Actualidad")
          .items([
            listItem(S, siteId, "article", "Todos los artículos"),
            S.listItem()
              .title("Por tipo")
              .child(
                S.list()
                  .title("Por tipo")
                  .items(
                    ARTICLE_TYPES.map(({ title, value }) =>
                      S.listItem()
                        .id(`type-${value}`)
                        .title(title)
                        .schemaType("article")
                        .child(siteList(S, siteId, "article", title, { filter: "type == $articleType", params: { articleType: value } })),
                    ),
                  ),
              ),
            S.listItem()
              .title("Contenido de marca")
              .schemaType("article")
              .child(siteList(S, siteId, "article", "Contenido de marca", { filter: "sponsored == true" })),
            S.divider(),
            listItem(S, siteId, "author", "Autores"),
            listItem(S, siteId, "topic", "Temas"),
            listItem(S, siteId, "movement", "Movimientos"),
            listItem(S, siteId, "newsletterIssue", "Ediciones del newsletter"),
          ]),
      ),
    S.listItem()
      .title("Registro")
      .child(
        S.list()
          .title("Registro")
          .items([
            S.listItem()
              .title("Galardones")
              .schemaType("award")
              .child(
                siteList(S, siteId, "award", "Galardones").child((awardId) =>
                  S.list()
                    .title("Galardón")
                    .items([
                      S.listItem().title("Ficha").schemaType("award").child(S.document().schemaType("award").documentId(awardId)),
                      S.listItem()
                        .title("Ediciones")
                        .schemaType("edition")
                        .child(
                          siteList(S, siteId, "edition", "Ediciones", { filter: "award._ref == $awardId", params: { awardId } })
                            .defaultOrdering([{ field: "year", direction: "desc" }])
                            .initialValueTemplates([S.initialValueTemplateItem("edition-by-award", { siteId, awardId })]),
                        ),
                    ]),
                ),
              ),
            listItem(S, siteId, "edition", "Todas las ediciones"),
            S.divider(),
            S.listItem()
              .title("Empresas")
              .schemaType("organization")
              .child(
                S.list()
                  .title("Empresas")
                  .items([
                    listItem(S, siteId, "organization", "Todas"),
                    S.listItem()
                      .title("Verificadas")
                      .schemaType("organization")
                      .child(siteList(S, siteId, "organization", "Verificadas", { filter: "verified == true" })),
                    S.listItem()
                      .title("Sin verificar")
                      .schemaType("organization")
                      .child(siteList(S, siteId, "organization", "Sin verificar", { filter: "verified != true" })),
                  ]),
              ),
            listItem(S, siteId, "sector", "Sectores"),
            listItem(S, siteId, "organizer", "Organizadores"),
          ]),
      ),
    S.listItem()
      .title("Eventos")
      .schemaType("event")
      .child(
        S.list()
          .title("Eventos")
          .items([
            S.listItem()
              .title("Próximos")
              .schemaType("event")
              .child(siteList(S, siteId, "event", "Próximos", { filter: "date >= $today", params: { today } })),
            S.listItem()
              .title("Pasados")
              .schemaType("event")
              .child(
                siteList(S, siteId, "event", "Pasados", { filter: "date < $today", params: { today } }).defaultOrdering([
                  { field: "date", direction: "desc" },
                ]),
              ),
            listItem(S, siteId, "event", "Todos"),
          ]),
      ),
    listItem(S, siteId, "editorialPage", "Páginas institucionales"),
  ];
}

const scopedItems = (S: StructureBuilder, siteId: string) => SITE_SCOPED.map(({ type, title }) => listItem(S, siteId, type, title));

/**
 * Content grouped by microsite: Sites → <site> → its lists.
 * Sites with editorial settings get the news + registry lists; the rest keep Pages / Categories / Catalog.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Micrositios")
        .child(
          S.documentTypeList("site")
            .title("Micrositios")
            .child(async (siteId) => {
              const ids = await context
                .getClient({ apiVersion: API_VERSION })
                .fetch<{ settings?: string; front?: string }>(
                  `{
                    "settings": *[_type == "editorialSettings" && site._ref == $siteId] | order(_id desc)[0]._id,
                    "front": *[_type == "frontPage" && site._ref == $siteId] | order(_id desc)[0]._id
                  }`,
                  { siteId },
                );
              const published = (id?: string) => id?.replace(/^drafts\./, "");
              const settings = published(ids.settings);
              return S.list()
                .title("Contenido del sitio")
                .items([
                  S.listItem().title("Configuración").child(S.document().schemaType("site").documentId(siteId)),
                  ...(settings ? editorialItems(S, siteId, { settings, front: published(ids.front) }) : [S.divider(), ...scopedItems(S, siteId)]),
                ]);
            }),
        ),
      // Turning a site into an editorial one: create its settings here (choosing the site).
      S.listItem()
        .title("Sitios editoriales")
        .schemaType("editorialSettings")
        .child(S.documentTypeList("editorialSettings").title("Ajustes editoriales por sitio")),
    ]);
