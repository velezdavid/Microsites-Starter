import type { APIRoute, GetStaticPaths } from "astro";
import { getSite } from "../lib/content/site";

/**
 * Root files defined per microsite in Sanity:
 * - `_redirects` for Netlify (files starting with "_" are ignored by Astro routing, hence the dynamic param).
 *   The Netlify adapter appends its own rules to this file after the build.
 * - Verification files (e.g. Google Search Console's googleXXXX.html).
 * - Other generated files of the site (e.g. calendar feeds).
 */
// Always static, also on the server-rendered preview site, where an on-demand "/[siteFile]"
// would catch every one-segment page URL before "/[...path]".
export const prerender = true;

export const getStaticPaths = (async () => {
  const { verificationFiles, files = [] } = await getSite();
  return [
    { params: { siteFile: "_redirects" } },
    ...[...verificationFiles, ...files].map((f) => ({ params: { siteFile: f.filename } })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const site = await getSite();
  if (params.siteFile === "_redirects") {
    const lines = site.redirects.map((r) => `${r.from}  ${r.to}  ${r.status}${r.force ? "!" : ""}`);
    return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain" } });
  }
  const extra = site.files?.find((f) => f.filename === params.siteFile);
  if (extra) return new Response(extra.content, { headers: { "Content-Type": extra.contentType } });
  const file = site.verificationFiles.find((f) => f.filename === params.siteFile);
  if (!file) return new Response("Not found", { status: 404 });
  const type = file.filename.endsWith(".html") ? "text/html" : "text/plain";
  return new Response(file.content, { headers: { "Content-Type": `${type}; charset=utf-8` } });
};
