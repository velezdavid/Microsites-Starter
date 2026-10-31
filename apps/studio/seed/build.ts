/**
 * Writes the seed documents of a microsite to seed/out/<slug>.ndjson.
 * Usage: npm run seed:build --workspace=studio -- <slug>
 * Then import: npx sanity dataset import seed/out/<slug>.ndjson <dataset> --replace
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { clean, type SanityDoc } from "./lib";
import { documents as mediaudience } from "./mediaudience/documents";
import { documents as ranking } from "./ranking/documents";

const SEEDS: Record<string, SanityDoc[]> = { mediaudience, ranking };

const slug = process.argv[2];
const docs = slug ? SEEDS[slug] : undefined;
if (!docs) {
  console.error(`Usage: seed:build <slug>. Available: ${Object.keys(SEEDS).join(", ")}`);
  process.exit(1);
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), "out");
mkdirSync(outDir, { recursive: true });
const file = join(outDir, `${slug}.ndjson`);
writeFileSync(file, docs.map((d) => JSON.stringify(clean(d))).join("\n") + "\n");

const byType = docs.reduce<Record<string, number>>((acc, d) => ({ ...acc, [d._type]: (acc[d._type] ?? 0) + 1 }), {});
console.log(`Wrote ${docs.length} documents to ${file}`, byType);
