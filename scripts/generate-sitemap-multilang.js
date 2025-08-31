import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const tools = require("../server/data/tools.json");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = "https://www.supertool.digital";
const currentDate = new Date().toISOString().split("T")[0];
const languages = ["en", "pt-br", "es"];

const staticRoutes = {
  "/": { priority: 1.0, changefreq: "monthly" },
  "/all-tools": { priority: 0.8, changefreq: "weekly" },
};

const createUrl = (route, changefreq, priority) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const generateLanguageSitemap = (lang) => {
  const urls = [];

  // Language home page
  urls.push(createUrl(`/${lang}`, "monthly", 1.0));

  // Static routes for the language
  Object.entries(staticRoutes).forEach(([route, config]) => {
    if (route !== "/") {
      urls.push(
        createUrl(`/${lang}${route}`, config.changefreq, config.priority),
      );
    }
  });

  // Categories for the language
  [...new Set(tools.map((tool) => tool.category))].forEach((category) => {
    urls.push(createUrl(`/${lang}/${category}`, "monthly", 0.8));
  });

  // Tools for the language
  tools.forEach((tool) => {
    urls.push(createUrl(`/${lang}${tool.path}`, "monthly", 0.7));
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
};

const generateSitemapIndex = () => {
  const sitemaps = [];

  // Main sitemap
  sitemaps.push(`  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`);

  // Language-specific sitemaps
  languages.forEach((lang) => {
    sitemaps.push(`  <sitemap>
    <loc>${baseUrl}/sitemap-${lang}.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join("\n")}
</sitemapindex>`;
};

// Generate language-specific sitemaps
languages.forEach((lang) => {
  const sitemap = generateLanguageSitemap(lang);
  fs.writeFileSync(
    path.join(__dirname, `../public/sitemap-${lang}.xml`),
    sitemap,
    "utf-8",
  );
});

// Generate sitemap index
const sitemapIndex = generateSitemapIndex();
fs.writeFileSync(
  path.join(__dirname, "../public/sitemap-index.xml"),
  sitemapIndex,
  "utf-8",
);

console.log(
  `✅ Generated ${languages.length} language-specific sitemaps and sitemap index`,
);
