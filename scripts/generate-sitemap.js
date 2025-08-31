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

const generateSitemap = () => {
  const urls = [];

  // Root redirect
  urls.push(createUrl("/", "monthly", 1.0));

  languages.forEach((lang) => {
    // Language home pages
    urls.push(createUrl(`/${lang}`, "monthly", 1.0));

    // Static routes for each language
    Object.entries(staticRoutes).forEach(([route, config]) => {
      if (route !== "/") {
        urls.push(
          createUrl(`/${lang}${route}`, config.changefreq, config.priority),
        );
      }
    });

    // Categories for each language
    [...new Set(tools.map((tool) => tool.category))].forEach((category) => {
      urls.push(createUrl(`/${lang}/${category}`, "monthly", 0.8));
    });

    // Tools for each language
    tools.forEach((tool) => {
      urls.push(createUrl(`/${lang}${tool.path}`, "monthly", 0.7));
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
};

fs.writeFileSync(
  path.join(__dirname, "../public/sitemap.xml"),
  generateSitemap(),
  "utf-8",
);

const totalUrls =
  1 +
  languages.length *
    (Object.keys(staticRoutes).length +
      [...new Set(tools.map((t) => t.category))].length +
      tools.length);
console.log(
  `✅ Sitemap generated with ${totalUrls} URLs across ${languages.length} languages (${tools.length} tools, ${[...new Set(tools.map((t) => t.category))].length} categories)`,
);
