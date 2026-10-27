/**
 * Manual deploy of one microsite to its own Netlify site.
 * Usage: npm run deploy:draft -- <slug>   |   npm run deploy:prod -- <slug>
 *
 * The slug picks both the content (SITE_SLUG) and the Netlify site (apps/web/netlify-sites.json),
 * so a build can never be published to another microsite's site.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const prod = args.includes("--prod");
const slug = args.find((a) => !a.startsWith("--"));
const sites = JSON.parse(readFileSync(new URL("../apps/web/netlify-sites.json", import.meta.url), "utf8"));

if (!slug || !sites[slug]) {
  console.error(`Usage: npm run deploy:${prod ? "prod" : "draft"} -- <slug>\nKnown microsites: ${Object.keys(sites).join(", ")}`);
  process.exit(1);
}

console.log(`\n→ ${prod ? "PRODUCTION" : "Draft"} deploy of "${slug}" (Netlify site ${sites[slug]})\n`);

const result = spawnSync(
  "npx",
  ["-y", "netlify-cli@27", "deploy", "--build", "--filter", "web", "--site", sites[slug], "--message", `${slug}-${prod ? "production" : "draft"}`, ...(prod ? ["--prod"] : [])],
  // Run from the repo root, like Netlify CI (base directory = root, package directory = apps/web).
  { cwd: new URL("../", import.meta.url), stdio: "inherit", shell: true, env: { ...process.env, SITE_SLUG: slug } },
);
process.exit(result.status ?? 1);
