// vitest.config.ts

import { defineVitestConfig } from "@nuxt/test-utils/config";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    fileParallelism: false,
    testTimeout: 1000 * 60,
    // you can optionally set Nuxt-specific environment options
    // environmentOptions: {
    //   nuxt: {
    //     rootDir: fileURLToPath(new URL('./playground', import.meta.url)),
    //     domEnvironment: 'happy-dom', // 'happy-dom' (default) or 'jsdom'
    //     overrides: {
    //       // other Nuxt config you want to pass
    //     }
    //   }
    // }
  },
});
