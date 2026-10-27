import type { Template } from "sanity";
import type { StructureResolver } from "sanity/structure";

const SITE_SCOPED = [
  { type: "page", title: "Páginas" },
  { type: "category", title: "Categorías" },
  { type: "item", title: "Catálogo" },
] as const;

/** Templates that create site-scoped documents with the site already set. */
export const siteTemplates: Template[] = SITE_SCOPED.map(({ type, title }) => ({
  id: `${type}-by-site`,
  title: `${title} del sitio`,
  schemaType: type,
  parameters: [{ name: "siteId", type: "string" }],
  value: ({ siteId }: { siteId: string }) => ({ site: { _type: "reference", _ref: siteId } }),
}));

/** Content grouped by microsite: Sites → <site> → Pages / Categories / Catalog. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Micrositios")
        .child(
          S.documentTypeList("site")
            .title("Micrositios")
            .child((siteId) =>
              S.list()
                .title("Contenido del sitio")
                .items([
                  S.listItem()
                    .title("Configuración")
                    .child(S.document().schemaType("site").documentId(siteId)),
                  S.divider(),
                  ...SITE_SCOPED.map(({ type, title }) =>
                    S.listItem()
                      .title(title)
                      .schemaType(type)
                      .child(
                        S.documentTypeList(type)
                          .title(title)
                          .filter("_type == $type && site._ref == $siteId")
                          .params({ type, siteId })
                          .defaultOrdering(type === "page" ? [{ field: "path", direction: "asc" }] : [{ field: "order", direction: "asc" }])
                          .initialValueTemplates([S.initialValueTemplateItem(`${type}-by-site`, { siteId })]),
                      ),
                  ),
                ]),
            ),
        ),
    ]);
