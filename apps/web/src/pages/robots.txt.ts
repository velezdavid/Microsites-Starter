import type { APIRoute } from "astro";
import { isPreviewSite } from "../lib/content/preview";
import { getSite } from "../lib/content/site";

/** AI crawlers named explicitly so each site can allow or block them (site → allowAiCrawlers). */
const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "CCBot"];

export const GET: APIRoute = async () => {
  // The preview site is never indexed.
  if (isPreviewSite) return new Response("User-agent: *\nDisallow: /\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  const { url, allowAiCrawlers } = await getSite();
  const rule = allowAiCrawlers ? "Allow: /" : "Disallow: /";
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `# AI crawlers (${allowAiCrawlers ? "allowed" : "blocked"})`,
    ...AI_CRAWLERS.flatMap((bot) => [`User-agent: ${bot}`, rule, ""]),
    `Sitemap: ${new URL("/sitemap.xml", url).href}`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
