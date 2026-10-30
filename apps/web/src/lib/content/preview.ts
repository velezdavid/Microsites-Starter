import { createHmac, timingSafeEqual } from "node:crypto";
import type { AstroCookies } from "astro";
import type { SanityClient, StegaConfig } from "@sanity/client";
import { createDataAttribute } from "@sanity/visual-editing-csm";

/**
 * Visual editing (Sanity Presentation) is available in two cases, never in the public build:
 * - `astro dev` with SANITY_VISUAL_EDITING=true (local Studio), always on;
 * - the preview site (SANITY_PREVIEW_SITE=true, server-rendered), only for requests that
 *   entered through the Studio (signed cookie set by /api/preview/enable).
 */
export const visualEditingEnabled =
  (import.meta.env.DEV && import.meta.env.SANITY_VISUAL_EDITING === "true") || import.meta.env.SANITY_PREVIEW_SITE === "true";

/** The preview site: rendered on demand, never indexed. */
export const isPreviewSite = import.meta.env.SANITY_PREVIEW_SITE === "true";

const studioUrl = import.meta.env.SANITY_STUDIO_URL || "http://localhost:3333";

/** Server-only Viewer token (read at runtime on Netlify Functions, from .env in dev). */
export const readToken = (): string | undefined => process.env.SANITY_API_READ_TOKEN || import.meta.env.SANITY_API_READ_TOKEN || undefined;

/* ---------- Preview cookie (signed, so it cannot be forged without the token) ---------- */

export const PREVIEW_COOKIE = "sanity-preview";
const PREVIEW_TTL_SECONDS = 60 * 60 * 8;

const sign = (value: string, key: string) => createHmac("sha256", key).update(value).digest("base64url");

/** `Set-Cookie` value for a preview session. Partitioned + SameSite=None so it works inside the Studio iframe. */
export function previewCookieHeader(): string {
  const key = readToken();
  if (!key) throw new Error("Missing SANITY_API_READ_TOKEN");
  const expires = String(Math.floor(Date.now() / 1000) + PREVIEW_TTL_SECONDS);
  return `${PREVIEW_COOKIE}=${expires}.${sign(expires, key)}; Path=/; Max-Age=${PREVIEW_TTL_SECONDS}; HttpOnly; Secure; SameSite=None; Partitioned`;
}

export const clearPreviewCookieHeader = () => `${PREVIEW_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None; Partitioned`;

function validPreviewCookie(value: string | undefined): boolean {
  const key = readToken();
  if (!key || !value) return false;
  const [expires, signature = ""] = value.split(".");
  if (!expires || Number(expires) * 1000 < Date.now()) return false;
  const expected = Buffer.from(sign(expires, key));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** Whether this request shows drafts with click-to-edit overlays. */
export function isPreviewRequest(cookies: AstroCookies): boolean {
  if (!visualEditingEnabled) return false;
  if (import.meta.env.DEV) return true;
  return validPreviewCookie(cookies.get(PREVIEW_COOKIE)?.value);
}

/* ---------- Content client ---------- */

/**
 * Fields whose text is shown on the page. Only these get stega (invisible source markers),
 * so ids, anchors, slugs, paths, links, theme tokens and SEO tags stay byte-exact.
 */
const DISPLAY_FIELDS = new Set([
  "title", "titleHighlight", "eyebrow", "lead", "intro", "text", "statement", "note", "notes", "caption", "source",
  "label", "value", "meta", "headline", "description", "blurb", "badge", "stat", "statLabel", "bullets", "chips",
  "tagline", "bottomText", "backLabel", "minimalBackLabel", "legalLabel", "listLabel", "linkLabel", "chipsLabel",
  "highlightsLabel", "tipsLabel", "contactTitle", "contactSubtitle", "submitLabel", "successMessage", "placeholder",
]);
const SKIP_PARENTS = new Set(["seo", "theme", "analytics", "scripts", "redirects", "verificationFiles", "attributes", "options"]);

const stegaFilter: NonNullable<StegaConfig["filter"]> = (props) => {
  const { sourcePath, filterDefault } = props;
  const keys = sourcePath.filter((s): s is string => typeof s === "string");
  if (keys.some((k) => SKIP_PARENTS.has(k))) return false;
  const field = keys.at(-1);
  return !!field && DISPLAY_FIELDS.has(field) && filterDefault(props);
};

/** The client used to read content: plain for public pages, with drafts + stega for previews. */
export function contentClient(client: SanityClient, preview: boolean): SanityClient {
  if (!preview) return client;
  const token = readToken();
  return client.withConfig({
    token,
    // Without a viewer token only published content is readable.
    perspective: token ? "drafts" : "published",
    useCdn: false,
    stega: { enabled: true, studioUrl, filter: stegaFilter },
  });
}

/**
 * `data-sanity` value of a page-builder section: lets Presentation select the whole block
 * and reorder it by drag-and-drop.
 */
export const sectionEditAttr = (pageId: string, key: string): string =>
  createDataAttribute({ id: pageId, type: "page", path: `sections[_key=="${key}"]`, baseUrl: studioUrl }).toString();
