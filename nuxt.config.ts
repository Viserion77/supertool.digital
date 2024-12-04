
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  pages: true,
  modules: ["@nuxt/test-utils/module"],
  ignore: ["**/*.test.ts"],
  nitro: {
    vercel: {
      functions: {
        migrations: {
          handler: "~/server/api/v1/migrations/index.ts",
          events: ["http"],
        },
      },
    }
  }

});
