import type { APIRoute } from "astro";
import { getSite } from "../lib/content/site";

export const GET: APIRoute = async () => {
  const { url } = await getSite();
  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${new URL("/sitemap.xml", url).href}`, ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
