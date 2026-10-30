/**
 * Manual deploy of one microsite to its own Netlify site.
 * Usage: npm run deploy:draft -- <slug>   |   npm run deploy:prod -- <slug>   |   npm run deploy:preview -- <slug>
 *
 * The slug picks both the content (SITE_SLUG) and the Netlify site (apps/web/netlify-sites.json),
 * so a build can never be published to another microsite's site.
 * deploy:preview publishes the server-rendered preview site used by the Studio's "Vista previa"
 * (apps/web/netlify-preview-sites.json) straight to production.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const previewSite = args.includes("--preview-site");
const prod = previewSite || args.includes("--prod");
const slug = args.find((a) => !a.startsWith("--"));
const sitesFile = previewSite ? "netlify-preview-sites.json" : "netlify-sites.json";
const sites = JSON.parse(readFileSync(new URL(`../apps/web/${sitesFile}`, import.meta.url), "utf8"));
const command = previewSite ? "preview" : prod ? "prod" : "draft";
const kind = previewSite ? "preview-site" : prod ? "production" : "draft";

if (!slug || !sites[slug]) {
  console.error(`Usage: npm run deploy:${command} -- <slug>\nKnown microsites: ${Object.keys(sites).join(", ")}`);
  process.exit(1);
}

console.log(`\n→ ${kind} deploy of "${slug}" (Netlify site ${sites[slug]})\n`);

const result = spawnSync(
  "npx",
  ["-y", "netlify-cli@27", "deploy", "--build", "--filter", "web", "--site", sites[slug], "--message", `${slug}-${kind}`, ...(prod ? ["--prod"] : [])],
  // Run from the repo root, like Netlify CI (base directory = root, package directory = apps/web).
  {
    cwd: new URL("../", import.meta.url),
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      SITE_SLUG: slug,
      // Public builds never pick up a preview flag from a local .env; preview builds always set it.
      SANITY_PREVIEW_SITE: previewSite ? "true" : "false",
      ...(previewSite ? { SANITY_STUDIO_URL: "https://microsites-starter.sanity.studio" } : {}),
    },
  },
);
process.exit(result.status ?? 1);
