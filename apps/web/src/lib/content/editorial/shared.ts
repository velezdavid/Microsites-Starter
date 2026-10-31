import type { EditorialBlock, EdNewsletterBlock } from "@microsites/ui/editorial";
import type { EditorialContent } from "./content";

export interface ListingPage {
  /** Path without leading slash. */
  path: string;
  title: string;
  blocks: EditorialBlock[];
  /** Menu item to mark in the masthead. */
  section?: string;
  flushFooter?: boolean;
  description?: string;
  noIndex?: boolean;
}

/** Newsletter band shown before the footer (texts from the editorial settings; `text` overrides the general one). */
export function newsletterBlock(c: EditorialContent, text?: string): EdNewsletterBlock {
  const n = c.settings.newsletterBand;
  return {
    _type: "edNewsletter",
    eyebrow: n?.eyebrow ?? "",
    title: n?.title ?? "Newsletter",
    text: text || n?.text || "",
    cta: n?.cta ?? "Suscribirme",
    consent: n?.consent ?? "",
    placeholder: n?.placeholder ?? "nombre@empresa.com",
    formName: "newsletter",
    success: n?.success ?? "",
  };
}

/** Sidebar "Lo más leído" (curated on the front page; newest articles when empty). */
export const mostReadBlock = (c: EditorialContent): EditorialBlock => ({
  _type: "edArticleList",
  label: "Lo más leído",
  items: c.curated(c.front.mostRead, () => c.articlesByDate, 5).map((a) => c.teaser(a)),
});
