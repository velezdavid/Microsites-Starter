import type { AnalyticsConfig, Block, ExternalScript, FooterConfig, HeaderConfig, LogoConfig, Theme } from "@microsites/ui";

/** Render-ready page: what the Astro templates consume. */
export interface PageDefinition {
  /** Path without leading slash; "" is the home page. May contain spaces (kept for URL compatibility). */
  path: string;
  seo: { title: string; description?: string; image?: string };
  header: HeaderConfig;
  footer: FooterConfig;
  blocks: Block[];
}

export interface Redirect {
  from: string;
  to: string;
  status: number;
  /** Apply even if a file exists at `from` (Netlify `!`). */
  force?: boolean;
}

/** Render-ready microsite, built from Sanity content. */
export interface SiteDefinition {
  slug: string;
  name: string;
  lang: string;
  url: string;
  theme: Theme;
  logo: LogoConfig;
  analytics: AnalyticsConfig;
  scripts: ExternalScript[];
  pages: PageDefinition[];
  /** Emitted to Netlify `_redirects` in this order. */
  redirects: Redirect[];
  /** Files served at the site root (e.g. Google Search Console verification). */
  verificationFiles: { filename: string; content: string }[];
}

/** Public URL for a page path (spaces and accents encoded). */
export const pageHref = (path: string) => "/" + encodeURI(path);
