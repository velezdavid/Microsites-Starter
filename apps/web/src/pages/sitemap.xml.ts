import type { APIRoute } from "astro";
import { getSite } from "../lib/content/site";
import { pageHref } from "../lib/content/types";

const escapeXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = async () => {
  const site = await getSite();
  const urls = site.pages.filter((p) => !p.seo.noIndex).map((p) => `  <url><loc>${escapeXml(new URL(pageHref(p.path), site.url).href)}</loc></url>`);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
