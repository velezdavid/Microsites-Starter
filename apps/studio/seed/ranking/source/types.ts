/**
 * Minimal copies of the editorial kit types used by the sample data (the Studio does not depend on @microsites/ui).
 * Only the shapes the seed converts are typed; the rest are loose.
 */
export type MedalLevel = "grand" | "oro" | "plata" | "bronce" | "mencion" | "finalista";

export interface EdLink {
  label: string;
  href: string;
}

export interface EdImage {
  label: string;
  caption?: string;
  credit?: string;
}

export type ArticleBodyNode =
  | { _type: "p"; text: string }
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

export type EdFeatureNode =
  | { _type: "p"; text: string; dropCap?: boolean; closing?: boolean }
  | { _type: "h2"; text: string }
  | { _type: "pullQuote"; text: string; author?: string; role?: string }
  | { _type: "imagePair"; images: { label: string; caption?: string; ratio: string }[]; weights: [number, number] }
  | { _type: "recordList"; title: string; more?: EdLink; items: { year: string; award: string; level: MedalLevel; result: string; href?: string }[] }
  | { _type: "sponsor"; label: string; logo: string; note: string };

export type EdForm = {
  name: string;
  fields: Record<string, unknown>[];
  checkbox?: Record<string, unknown>;
  submit: string;
  note?: string;
  success: { eyebrow: string; title: string; text: string };
};

// Page-building types of the original files (unused by the seed).
export type ArticleTeaser = any;
export type EditorialBlock = any;
export type EdNewsletterBlock = any;
export type ListingPage = { path: string; title: string; blocks: EditorialBlock[] };
