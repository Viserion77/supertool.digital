import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const tools = require("../server/data/tools.json");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = "https://www.supertool.digital";
const currentDate = new Date().toISOString().split("T")[0];

const staticRoutes = {
  "/": { priority: 1.0, changefreq: "weekly" },
  "/all-tools": { priority: 0.8, changefreq: "monthly" },
  "/privacy": { priority: 0.5, changefreq: "monthly" },
  "/contact": { priority: 0.5, changefreq: "monthly" },
  "/support": { priority: 0.5, changefreq: "monthly" },
  "/terms": { priority: 0.5, changefreq: "monthly" },
  "/faq": { priority: 0.6, changefreq: "monthly" },
  "/report-bug": { priority: 0.4, changefreq: "monthly" },
};

const createUrl = (route, changefreq, priority) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const generateSitemap = () => {
  const urls = [];

  // Static routes
  Object.entries(staticRoutes).forEach(([route, config]) => {
    urls.push(createUrl(route, config.changefreq, config.priority));
  });

  // Categories
  [...new Set(tools.map((tool) => tool.category))].forEach((category) => {
    urls.push(createUrl(`/${category}`, "weekly", 0.8));
  });

  // Tools
  tools.forEach((tool) => {
    urls.push(createUrl(tool.path, "weekly", 0.7));
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

console.log(
  `✅ Sitemap generated with ${tools.length} tools and ${[...new Set(tools.map((t) => t.category))].length} categories`,
);
