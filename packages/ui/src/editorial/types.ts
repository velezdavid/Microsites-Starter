/**
 * Editorial kit: blocks for news and registry sites (articles, rankings, events…).
 * Separate entry point (`@microsites/ui/editorial`) so landing-page sites never load its CSS.
 */

export interface EdLink {
  label: string;
  href: string;
}

/** Image, or a labelled placeholder while the photo does not exist yet. */
export interface EdImage {
  src?: string;
  alt?: string;
  /** Placeholder text when there is no `src`. */
  label?: string;
  caption?: string;
  credit?: string;
}

export interface ArticleTeaser {
  href: string;
  kicker?: string;
  title: string;
  dek?: string;
  author?: string;
  date?: string;
  readTime?: string;
  image?: EdImage;
  sponsored?: boolean;
}

export type CardVariant = "lead" | "standard" | "large" | "horizontal" | "compact" | "ranked";
export type MedalLevel = "grand" | "oro" | "plata" | "bronce" | "mencion" | "finalista";

import type { RegistryBlock } from "./registry-types";

/* ---------- Blocks ---------- */

export interface EdSectionHeaderBlock {
  _type: "edSectionHeader";
  title: string;
  /** "Ver todo ↗" link; omitted = none. */
  more?: EdLink;
  size?: "sm" | "md" | "lg";
  description?: string;
}

export interface EdArticleCardBlock {
  _type: "edArticleCard";
  variant?: CardVariant;
  article: ArticleTeaser;
  /** Show the image (or its placeholder) even without a photo. */
  showImage?: boolean;
  ratio?: string;
  /** Position number for the "ranked" variant. */
  index?: number;
  /** Heading level of the title (default 3). */
  headingLevel?: 2 | 3;
}

export interface EdArticleGridBlock {
  _type: "edArticleGrid";
  variant?: CardVariant;
  items: ArticleTeaser[];
  /** Columns at full width; they wrap down to one on narrow screens. */
  columns?: number;
  showImage?: boolean;
  /** Line above the whole grid. */
  rule?: "ink" | "line";
  /** Vertical lines between columns. */
  dividers?: boolean;
  /** Line above each card: ink (true) or light ("line"). */
  itemRule?: boolean | "line";
  /** Image ratio of the cards. */
  ratio?: string;
  /** Light line under each card. */
  itemBorder?: boolean;
  /** Space between the rule and the card (with `itemRule`). */
  rulePadding?: number;
  /** CSS gap; number = px. */
  gap?: number | string;
  /** Uppercase title over the grid, with an optional note on the right ("Página 1 de 5"). */
  label?: string;
  note?: string;
  /** Shown when there are no items. */
  empty?: string;
  /** Heading level of the card titles (default 3). */
  headingLevel?: 2 | 3;
}

export interface EdArticleListBlock {
  _type: "edArticleList";
  variant?: "ranked" | "compact" | "standard";
  items: ArticleTeaser[];
  /** Small uppercase title above the list (sidebars). */
  label?: string;
  gap?: number;
}

export interface EdPageIntroBlock {
  _type: "edPageIntro";
  eyebrow: string;
  title: string;
  text?: string;
  /** Section tabs (each one a page). */
  tabs?: (EdLink & { current?: boolean })[];
}

export interface EdPaginationBlock {
  _type: "edPagination";
  pages: { label: string; href: string; current?: boolean }[];
  prev?: EdLink;
  next?: EdLink;
  prevLabel: string;
  nextLabel: string;
}

export interface EdMovementListBlock {
  _type: "edMovementList";
  title: string;
  items: { initials: string; name: string; role: string; organization: string; href?: string }[];
  more?: EdLink;
}

export interface EdBreadcrumbBlock {
  _type: "edBreadcrumb";
  items: { label: string; href?: string }[];
}

export interface EdArticleHeaderBlock {
  _type: "edArticleHeader";
  eyebrow: string;
  title: string;
  /** Part of the title in the accent color. */
  highlight?: string;
  dek?: string;
  author: string;
  /** Dateline details after the author ("Quito · 24 oct 2026 · 5 min de lectura"). */
  meta: string;
  /** Absolute URL to share. */
  shareUrl: string;
  /** Single centered column (long-form features). */
  centered?: boolean;
}

export interface EdFigureBlock {
  _type: "edFigure";
  image: EdImage;
  ratio?: string;
}

export type ArticleBodyNode =
  /** `html`: inline markup (bold, links) rendered instead of `text` when present. */
  | { _type: "p"; text: string; html?: string }
  | { _type: "h2"; text: string }
  | { _type: "pullQuote"; text: string; author?: string; role?: string }
  | { _type: "image"; image: EdImage; ratio?: string }
  | {
      _type: "rankingTable";
      rows: { position: number; name: string; detail?: string; change?: string; href?: string }[];
      highlight?: number;
      source?: string;
      more?: EdLink;
    };

export interface EdArticleBodyBlock {
  _type: "edArticleBody";
  keyFacts?: { title: string; items: { value: string; label: string }[] };
  body: ArticleBodyNode[];
  tags?: { title: string; items: EdLink[] };
  /** Right column (e.g. most read). */
  aside?: EditorialBlock[];
}

export interface EdMentionsBlock {
  _type: "edMentions";
  eyebrow: string;
  title: string;
  items: { type: string; initials: string; name: string; detail: string; cta: string; href: string }[];
}

export interface EdResultListBlock {
  _type: "edResultList";
  title: string;
  items: { award: string; when: string; level: MedalLevel; winner: string; detail?: string; href: string }[];
}

export interface EdRankingSnapshotBlock {
  _type: "edRankingSnapshot";
  title: string;
  note?: string;
  rows: { position: number; name: string; change?: string; href?: string }[];
  /** How many top rows use the accent color. */
  highlight?: number;
  more?: EdLink;
}

export interface EdDeadlineListBlock {
  _type: "edDeadlineList";
  title: string;
  items: { award: string; edition: string; closes?: string; daysLeft?: number; status: "abierta" | "proxima" | "cerrada"; href?: string }[];
  more?: EdLink;
}

export interface EdEventListBlock {
  _type: "edEventList";
  items: { day: string; month: string; name: string; place: string; href: string }[];
}

export interface EdOpinionListBlock {
  _type: "edOpinionList";
  items: { author: string; title: string; role: string; href: string }[];
}

export interface EdNewsletterBlock {
  _type: "edNewsletter";
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  consent: string;
  placeholder: string;
  /** Netlify Forms name. */
  formName: string;
  success: string;
  /** Space above, in px (default 72). */
  spaceTop?: number;
}

export interface EdColumn {
  /** CSS grid track, e.g. "8fr" or "300px". Ignored when the row uses `autoFit`. */
  width?: string;
  /** CSS gap; number = px. */
  gap?: number | string;
  /** Render as <aside>. */
  aside?: boolean;
  blocks: EditorialBlock[];
}

/** Row of columns: the layout primitive pages are composed with. Stacks to one column on narrow screens. */
export interface EdColumnsBlock {
  _type: "edColumns";
  columns: EdColumn[];
  /** Equal columns that wrap (min 170px) instead of fixed tracks. */
  autoFit?: boolean;
  /** 1px vertical line between columns. */
  dividers?: boolean;
  /** CSS gap; number = px. */
  gap?: number | string;
  /** Align columns to the top instead of stretching them. */
  alignTop?: boolean;
  /** Space above the row, in px. */
  spaceTop?: number;
  /** Full-bleed light band behind the row. */
  band?: boolean;
  anchor?: string;
}

export type EditorialBlock =
  | EdSectionHeaderBlock
  | EdArticleCardBlock
  | EdArticleGridBlock
  | EdArticleListBlock
  | EdResultListBlock
  | EdRankingSnapshotBlock
  | EdDeadlineListBlock
  | EdEventListBlock
  | EdOpinionListBlock
  | EdNewsletterBlock
  | EdColumnsBlock
  | EdPageIntroBlock
  | EdPaginationBlock
  | EdMovementListBlock
  | EdBreadcrumbBlock
  | EdArticleHeaderBlock
  | EdFigureBlock
  | EdArticleBodyBlock
  | EdMentionsBlock
  | RegistryBlock;

/* ---------- Page chrome ---------- */

export interface MastheadConfig {
  homeHref: string;
  /** Text after the date, e.g. "Ecuador". */
  locale: string;
  logo: { src: string; alt: string; width: number; height: number };
  nav: EdLink[];
  /** Path of the current section, to mark it in the menu. */
  current?: string;
}

export interface EdFooterConfig {
  logo: { src: string; alt: string; width: number; height: number };
  tagline: string;
  columns: { title: string; links: EdLink[] }[];
  bottomLeft: string;
  bottomRight: string;
}
