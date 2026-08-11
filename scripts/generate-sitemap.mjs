/**
 * Generates public/sitemap.xml from the content files.
 *
 * The routes are derived from the same slugs the app renders, so the sitemap
 * cannot list a page that does not exist or miss one that does. Slugs are read
 * by pattern-matching the content sources rather than importing them, which
 * keeps this a zero-dependency step that runs before the TypeScript build.
 *
 * Run via `npm run sitemap` or automatically as part of `npm run build`.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Keep in sync with `site.url` in src/content/site.ts.
const SITE_URL = "https://scholar-zone.web.app";

const readSlugs = (relativePath) => {
  const source = readFileSync(resolve(root, relativePath), "utf8");
  const slugs = [...source.matchAll(/^\s{2,4}slug:\s*"([a-z0-9-]+)"/gm)].map((match) => match[1]);
  if (slugs.length === 0) {
    throw new Error(`No slugs found in ${relativePath} — the content format changed, fix this script.`);
  }
  return slugs;
};

const testTypeSlugs = readSlugs("src/content/testTypes.ts");
const guideSlugs = readSlugs("src/content/guides.ts");
const authorSlugs = readSlugs("src/content/authors.ts");
const opportunitySlugs = readSlugs("src/content/opportunities.ts");
const productSlugs = readSlugs("src/content/commerce.ts");

// Test types with no question bank yet are still documented, but only the ones
// with questions get a /practice route.
const questionSource = readFileSync(resolve(root, "src/content/questions.ts"), "utf8");
const practicedTypes = testTypeSlugs.filter((slug) =>
  new RegExp(`testType:\\s*"${slug}"`).test(questionSource)
);

/** @type {{path: string, priority: string, changefreq: string}[]} */
const routes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/opportunities", priority: "0.9", changefreq: "weekly" },
  { path: "/practice", priority: "0.9", changefreq: "weekly" },
  { path: "/test-types", priority: "0.9", changefreq: "monthly" },
  { path: "/guides", priority: "0.9", changefreq: "weekly" },
  { path: "/resources", priority: "0.7", changefreq: "monthly" },
  { path: "/pricing", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.5", changefreq: "yearly" },
  { path: "/editorial-policy", priority: "0.5", changefreq: "yearly" },
  { path: "/contact", priority: "0.4", changefreq: "yearly" },
  { path: "/privacy", priority: "0.2", changefreq: "yearly" },
  { path: "/terms", priority: "0.2", changefreq: "yearly" },
  ...opportunitySlugs.map((slug) => ({
    path: `/opportunities/${slug}`,
    priority: "0.9",
    changefreq: "monthly"
  })),
  ...productSlugs.map((slug) => ({
    path: `/resources/${slug}`,
    priority: "0.8",
    changefreq: "monthly"
  })),
  ...practicedTypes.map((slug) => ({
    path: `/practice/${slug}`,
    priority: "0.8",
    changefreq: "monthly"
  })),
  ...testTypeSlugs.map((slug) => ({
    path: `/test-types/${slug}`,
    priority: "0.8",
    changefreq: "monthly"
  })),
  ...guideSlugs.map((slug) => ({ path: `/guides/${slug}`, priority: "0.7", changefreq: "monthly" })),
  ...authorSlugs.map((slug) => ({ path: `/about/${slug}`, priority: "0.4", changefreq: "yearly" }))
];

const lastmod = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(resolve(root, "public/sitemap.xml"), xml, "utf8");
console.log(`Wrote public/sitemap.xml with ${routes.length} routes.`);
