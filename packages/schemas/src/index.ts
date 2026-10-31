import { blockTypes } from "./blocks";
import { category, item } from "./documents/catalog";
import { editorialContentTypes } from "./documents/editorial";
import { editorialSiteTypes } from "./documents/editorial-site";
import { page } from "./documents/page";
import { registryTypes } from "./documents/registry";
import { site } from "./documents/site";
import { objectTypes } from "./objects";
import { editorialObjectTypes } from "./objects/editorial";

/** Editorial sites (news + registry): settings, articles and registry records. */
export const editorialDocumentTypes = [...editorialSiteTypes, ...editorialContentTypes, ...registryTypes];

export const documentTypes = [site, page, category, item, ...editorialDocumentTypes];

export const schemaTypes = [...documentTypes, ...objectTypes, ...editorialObjectTypes, ...blockTypes];

export { pageBlockTypes } from "./blocks";
export { ARTICLE_TYPES, EVENT_TYPES } from "./objects/editorial";
