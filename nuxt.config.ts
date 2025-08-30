import tools from "./server/data/tools";

// Generate dynamic routes from tools data
const generateRoutes = () => {
  const routes: Record<string, { prerender: boolean }> = {};

  // Get unique categories
  const categories = [...new Set(tools.map((tool) => tool.category))];

  // Add category routes
  categories.forEach((category) => {
    routes[`/${category}`] = { prerender: true };
  });

  // Add tool routes
  tools.forEach((tool) => {
    routes[tool.path] = { prerender: true };
  });

  return routes;
};

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: process.env.NUXT_DEVTOOLS === "true" },
  pages: true,
  modules: ["@nuxt/test-utils/module", "@nuxt/eslint"],
  ignore: ["**/*.test.ts"],
  css: ["~/assets/styles.css"],
  runtimeConfig: {
    public: {
      contactEmail: "vise@seventysete.com",
    },
  },
  app: {
    head: {
      titleTemplate: "%s | SuperTool.digital",
      htmlAttrs: { lang: "pt-BR" },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#2563EB" },
        {
          name: "description",
          content: "Free, fast and privacy-friendly online tools.",
        },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
  routeRules: {
    "/": { prerender: true },
    "/all-tools": { prerender: true },
    "/privacy": { prerender: true },
    "/contact": { prerender: true },
    "/support": { prerender: true },
    "/terms": { prerender: true },
    "/faq": { prerender: true },
    "/report-bug": { prerender: true },
    "/.well-known/**": { headers: { "X-Robots-Tag": "noindex" } },
    ...generateRoutes(),
  },
});
