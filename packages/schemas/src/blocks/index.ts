import { catalogBlocks } from "./catalog";
import { contentBlocks } from "./content";

export const blockTypes = [...contentBlocks, ...catalogBlocks];

/** Type names allowed in a page's `sections` array. */
export const pageBlockTypes = blockTypes.map((t) => t.name);
