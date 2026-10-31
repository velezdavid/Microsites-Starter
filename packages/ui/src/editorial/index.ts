// Editorial kit (news and registry sites). Imported only by the editorial template.
import "./editorial.css";

// Imported from its file (not the package index) so landing blocks and their CSS stay out.
export { default as BaseLayout } from "../components/layout/BaseLayout.astro";
export { default as EditorialRenderer } from "./components/EditorialRenderer.astro";
export { default as Masthead } from "./components/Masthead.astro";
export { default as EdFooter } from "./components/EdFooter.astro";
export { default as ArticleCard } from "./components/ArticleCard.astro";
export * from "./types";
export type * from "./registry-types";
