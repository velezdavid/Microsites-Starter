import type { APIRoute, GetStaticPaths } from "astro";
import { getSite } from "../lib/content/site";

/**
 * Root files defined per microsite in Sanity:
 * - `_redirects` for Netlify (files starting with "_" are ignored by Astro routing, hence the dynamic param).
 *   The Netlify adapter appends its own rules to this file after the build.
 * - Verification files (e.g. Google Search Console's googleXXXX.html).
 */
export const getStaticPaths = (async () => {
  const { verificationFiles } = await getSite();
  return [
    { params: { siteFile: "_redirects" } },
    ...verificationFiles.map((f) => ({ params: { siteFile: f.filename } })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const site = await getSite();
  if (params.siteFile === "_redirects") {
    const lines = site.redirects.map((r) => `${r.from}  ${r.to}  ${r.status}${r.force ? "!" : ""}`);
    return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain" } });
  }
  const file = site.verificationFiles.find((f) => f.filename === params.siteFile)!;
  const type = file.filename.endsWith(".html") ? "text/html" : "text/plain";
  return new Response(file.content, { headers: { "Content-Type": `${type}; charset=utf-8` } });
};
