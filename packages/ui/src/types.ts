/**
 * Shared data contracts for the UI package.
 * Block shapes mirror the Sanity schemas (`_type` + fields), so pages can be
 * rendered from hardcoded data now and from GROQ results later.
 */

/** Client-side behaviour attached to a link: select a tab, apply a filter or highlight a card. */
export interface Action {
  type: "tab" | "filter" | "highlight";
  /** Scope id of the tabs/filter group the action applies to. */
  target: string;
  /** Tab id, filter value or element id. */
  value: string;
}

export interface Link {
  label: string;
  href: string;
  action?: Action;
}

export interface ButtonLink extends Link {
  style?: "primary" | "secondary";
}

export interface Theme {
  bg: string;
  surface: string;
  surface2: string;
  /** End color of card gradients. */
  surfaceEnd: string;
  /** Darkest background (footer, technical sections). */
  deep: string;
  /** Background of dropdown panels. */
  raised: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  onAccent: string;
  text: string;
  muted: string;
  dim: string;
  line: string;
  lineSoft: string;
  placeholder: string;
  fontDisplay: string;
  fontBody: string;
  fontMono: string;
}

export interface LogoConfig {
  /** Accessible name, e.g. "Mediaudience, inicio". */
  label: string;
  /** Wordmark split in parts; parts with `accent` use the accent color. */
  wordmark: { text: string; accent?: boolean }[];
  /** Optional drawn mark next to the wordmark. */
  mark?: { type: "rings" };
  /** Image logo; replaces the wordmark and mark when present. */
  image?: { src: string; alt: string };
}

export interface NavItem {
  title: string;
  meta?: string;
  description?: string;
  href: string;
  action?: Action;
}

export interface NavColumn {
  title?: string;
  href?: string;
  action?: Action;
  items: NavItem[];
}

export interface NavMenu {
  id: string;
  label: string;
  blurb?: string;
  layout: "mega" | "list";
  columns: NavColumn[];
}

export interface HeaderConfig {
  homeHref: string;
  nav?: NavMenu[];
  links?: Link[];
  cta?: Link;
  /** Animate the logo mark. */
  pulse?: boolean;
  /** Hide the drawn mark and show only the wordmark. */
  wordmarkOnly?: boolean;
}

export interface FooterConfig {
  tagline?: string;
  columns?: NavColumn[];
  bottomText: string;
  legal?: Link;
  /** Render the legal link as plain text (when already on that page). */
  legalIsCurrent?: boolean;
}

export interface AnalyticsConfig {
  ga4Id?: string;
  gtmId?: string;
  /** When third-party scripts (GTM, GA4, external) load. Default: "interaction". */
  loading?: "interaction" | "immediate";
  /** With "interaction": load anyway this many seconds after window load. Default: 4. */
  maxDelaySeconds?: number;
}

/** Third-party script loaded async at the end of <body>. */
export interface ExternalScript {
  src: string;
  /** Only data-* attributes. */
  attributes?: Record<string, string>;
}

/* ---------- Blocks ---------- */

export type Decor = "lines" | "grid" | "glow-top-right" | "glow-top-right-soft" | "glow-bottom-left";

export interface BlockBase {
  _key?: string;
  anchor?: string;
  tone?: "base" | "surface" | "deep";
  decor?: Decor[];
}

export interface StatCardAside {
  type: "stat";
  label: string;
  value: string;
  caption: string;
}

export interface StatTabsAside {
  type: "statTabs";
  id: string;
  title: string;
  ariaLabel: string;
  tabs: { id: string; label: string; meta?: string; stats: { value: string; label: string }[] }[];
}

export interface HeroBlock extends BlockBase {
  _type: "hero";
  variant?: "landing" | "page";
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: string;
  title: string;
  /** Substring of the title rendered with the accent color. */
  titleHighlight?: string;
  lead?: string;
  text?: string;
  actions?: ButtonLink[];
  aside?: StatCardAside | StatTabsAside;
}

export interface CardGridBlock extends BlockBase {
  _type: "cardGrid";
  layout?: "stack" | "split";
  numbering?: "none" | "top" | "inline";
  eyebrow?: string;
  title?: string;
  intro?: string;
  cards: { title: string; text: string; highlight?: boolean }[];
  chips?: { label: string; items: string[] };
}

export interface StatGridBlock extends BlockBase {
  _type: "statGrid";
  layout?: "cards" | "cells";
  eyebrow?: string;
  title?: string;
  items: { eyebrow?: string; value: string; text: string; highlight?: boolean }[];
  highlights?: { label: string; items: { title: string; meta: string; note?: string }[] };
  source?: string;
}

export interface FeatureListBlock extends BlockBase {
  _type: "featureList";
  eyebrow?: string;
  title?: string;
  intro?: string;
  items: { code: string; title: string; text: string; link?: Link }[];
}

export interface SplitListBlock extends BlockBase {
  _type: "splitList";
  eyebrow?: string;
  title?: string;
  /** Large standalone sentence used instead of a title. */
  statement?: string;
  text?: string;
  tiles?: string[];
  listLabel?: string;
  listStyle?: "bullets" | "numbered";
  items: string[];
}

export interface VariantCardsBlock extends BlockBase {
  _type: "variantCards";
  eyebrow?: string;
  title?: string;
  note?: string;
  cards: { badge?: string; title: string; text: string; rows?: [string, string][]; highlight?: boolean }[];
}

export interface SpecTableBlock extends BlockBase {
  _type: "specTable";
  eyebrow?: string;
  title?: string;
  rows: [string, string][];
  notes?: string[];
  tips?: { label: string; items: string[] };
}

export interface StepFlowBlock extends BlockBase {
  _type: "stepFlow";
  eyebrow?: string;
  title?: string;
  text?: string;
  steps: string[];
  note?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "textarea";
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

export interface ContactSectionBlock extends BlockBase {
  _type: "contactSection";
  eyebrow?: string;
  title: string;
  text?: string;
  contact: { title: string; subtitle?: string; email: string; emailSubject?: string; note?: string };
  form?: {
    /** "mailto" opens the visitor's mail client with the message prefilled. */
    mode: "mailto";
    subject: string;
    /** Extra lines prepended to the message body, e.g. the product name. */
    context?: { label: string; value: string }[];
    fields: FormField[];
    submitLabel: string;
    successMessage: string;
  };
}

export interface RichTextBlock extends BlockBase {
  _type: "richText";
  eyebrow?: string;
  title: string;
  meta?: string;
  /** Section bodies are trusted HTML until Portable Text replaces them. */
  sections: { title: string; html: string }[];
}

export interface CatalogTabsBlock extends BlockBase {
  _type: "catalogTabs";
  id: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  ariaLabel: string;
  tabs: {
    id: string;
    label: string;
    meta?: string;
    headline: string;
    text: string;
    chipsLabel?: string;
    chips?: string[];
    cardsLabel?: string;
    cards?: { eyebrow?: string; title: string; linkLabel: string; href: string; action?: Action }[];
    cta?: Link;
  }[];
}

export interface CatalogFilterGridBlock extends BlockBase {
  _type: "catalogFilterGrid";
  id: string;
  eyebrow?: string;
  title?: string;
  filterAriaLabel: string;
  /** The first filter is the "show all" option. */
  filters: { value: string; label: string }[];
  cards: {
    id: string;
    tags: string[];
    eyebrow?: string;
    stat?: string;
    title: string;
    text: string;
    bullets?: string[];
    chips?: Link[];
    cta?: Link;
  }[];
}

export interface CatalogGridBlock extends BlockBase {
  _type: "catalogGrid";
  eyebrow?: string;
  title?: string;
  items: { title: string; stat: string; statLabel: string; text: string; primary: Link; secondary?: Link }[];
}

export interface RelatedItemsBlock extends BlockBase {
  _type: "relatedItems";
  eyebrow?: string;
  linkLabel: string;
  items: { eyebrow?: string; title: string; href: string }[];
}

export type Block =
  | HeroBlock
  | CardGridBlock
  | StatGridBlock
  | FeatureListBlock
  | SplitListBlock
  | VariantCardsBlock
  | SpecTableBlock
  | StepFlowBlock
  | ContactSectionBlock
  | RichTextBlock
  | CatalogTabsBlock
  | CatalogFilterGridBlock
  | CatalogGridBlock
  | RelatedItemsBlock;
