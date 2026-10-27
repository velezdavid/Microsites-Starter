import { blockTypes } from "./blocks";
import { category, item } from "./documents/catalog";
import { page } from "./documents/page";
import { site } from "./documents/site";
import { objectTypes } from "./objects";

export const documentTypes = [site, page, category, item];

export const schemaTypes = [...documentTypes, ...objectTypes, ...blockTypes];

export { pageBlockTypes } from "./blocks";
