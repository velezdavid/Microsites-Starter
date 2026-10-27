/**
 * GROQ queries and the raw shapes they return.
 * References are kept as ids (`_ref`) and resolved in code against the fetched catalog.
 */

export const SITE_QUERY = /* groq */ `*[_type == "site" && slug.current == $slug][0]{
  _id, name, "slug": slug.current, url, lang, seo, analytics, allowAiCrawlers, logo, theme, catalogLabel,
  header, footer{..., "legalPath": legalPage->path},
  redirects,
  "scripts": scripts[]{src, attributes[]{name, value}},
  "verificationFiles": verificationFiles[]{filename, content}
}`;

export const PAGES_QUERY = /* groq */ `*[_type == "page" && site._ref == $siteId]{
  _id, title, "path": coalesce(path, ""), seo, header, footer, sections
}`;

export const CATEGORIES_QUERY = /* groq */ `*[_type == "category" && site._ref == $siteId] | order(order asc){
  _id, title, "slug": slug.current, anchor
}`;

export const ITEMS_QUERY = /* groq */ `*[_type == "item" && site._ref == $siteId] | order(order asc){
  _id, title, "slug": slug.current, "category": category._ref,
  meta, headline, text, stat, statLabel, bullets, chips,
  "recommended": recommended[]._ref, "related": related[]._ref,
  "path": page->path, "hasPage": defined(page)
}`;

/* ---------- Raw shapes ---------- */

export type Ref = { _ref: string };
export type SanityImage = { asset?: Ref; alt?: string };
type Keyed<T> = T & { _key: string };

export interface RawLink {
  label: string;
  href: string;
}

export interface RawNavColumn {
  _type: "navColumn" | "catalogNavColumn";
  title?: string;
  href?: string;
  category?: Ref;
  items?: { title: string; meta?: string; description?: string; href: string }[];
}

export interface RawSite {
  _id: string;
  name: string;
  slug: string;
  url: string;
  lang?: string;
  seo?: { title?: string; description?: string; ogImage?: SanityImage };
  allowAiCrawlers?: boolean;
  analytics?: { gtmId?: string; ga4Id?: string; loading?: "interaction" | "immediate"; maxDelay?: number };
  logo: { label: string; image?: SanityImage; wordmark?: { text: string; accent?: boolean }[]; mark?: "none" | "rings" };
  theme: Record<string, string>;
  catalogLabel?: string;
  header?: {
    nav?: Keyed<{ id: string; label: string; blurb?: string; layout?: "mega" | "list"; columns?: RawNavColumn[] }>[];
    cta?: RawLink;
    backLabel?: string;
    pageCta?: RawLink;
    minimalBackLabel?: string;
  };
  footer?: {
    tagline?: string;
    columns?: RawNavColumn[];
    bottomText?: string;
    legalLabel?: string;
    legalPath?: string | null;
  };
  redirects?: { from: string; to: string; status: number; force?: boolean }[];
  scripts?: { src: string; attributes?: { name: string; value?: string }[] }[];
  verificationFiles?: { filename: string; content: string }[];
}

/** A page-builder block as stored in Sanity (fields depend on `_type`). */
export type RawSection = { _type: string; _key: string; [field: string]: any };

export interface RawPage {
  _id: string;
  title: string;
  path: string;
  seo?: { title?: string; description?: string; ogImage?: SanityImage; noIndex?: boolean };
  header?: "full" | "compact" | "minimal";
  footer?: "full" | "minimal";
  sections?: RawSection[];
}

export interface RawCategory {
  _id: string;
  title: string;
  slug: string;
  anchor?: string;
}

export interface RawItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  meta?: string;
  headline?: string;
  text?: string;
  stat?: string;
  statLabel?: string;
  bullets?: string[];
  chips?: string[];
  recommended?: string[];
  related?: string[];
  path?: string | null;
  hasPage: boolean;
}
