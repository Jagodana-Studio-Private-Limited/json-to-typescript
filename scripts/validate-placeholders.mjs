/**
 * Pre-build validation: ensures all {{PLACEHOLDER}} values
 * in siteConfig have been replaced before deploying.
 *
 * Runs automatically via `npm run build`.
 * To skip during template development: SKIP_PLACEHOLDER_CHECK=1 npm run build
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.SKIP_PLACEHOLDER_CHECK === "1") {
  process.exit(0);
}

const configPath = resolve(__dirname, "../src/config/site.ts");
const manifestPath = resolve(__dirname, "../public/site.webmanifest");

const files = [
  { path: configPath, name: "src/config/site.ts" },
  { path: manifestPath, name: "public/site.webmanifest" },
];

let hasPlaceholders = false;

for (const file of files) {
  const content = readFileSync(file.path, "utf-8");
  const matches = content.match(/\{\{[A-Z_]+\}\}/g);

  if (matches) {
    const unique = [...new Set(matches)];
    console.error(`\x1b[31m[placeholder-check] ${file.name} has ${unique.length} unresolved placeholder(s):\x1b[0m`);
    for (const match of unique) {
      console.error(`  - ${match}`);
    }
    hasPlaceholders = true;
  }
}

if (hasPlaceholders) {
  console.error("\n\x1b[31mBuild blocked: Replace all {{PLACEHOLDER}} values before deploying.\x1b[0m");
  console.error("To skip this check: SKIP_PLACEHOLDER_CHECK=1 npm run build\n");
  process.exit(1);
}
