export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  pages: true,
  modules: ["@nuxt/test-utils/module"],
  ignore: ["**/*.test.ts"],
  routeRules: {
    "/": { prerender: true },
    "/jsdoc": { prerender: true },
  },
});
