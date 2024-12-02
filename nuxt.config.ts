// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import { resolve } from "path";
import { copySync } from "fs-extra";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  pages: true,
  modules: ["@nuxt/test-utils/module"],
  ignore: ["**/*.test.ts"],
  hooks: {
    "build:before": () => {
      const src = resolve(__dirname, "resources/migrations");
      const dest = resolve(__dirname, ".nuxt/resources/migrations");
      copySync(src, dest);
    },
  },
});
