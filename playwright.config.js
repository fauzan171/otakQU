import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  // File *.dom.test.jsx milik vitest; tanpa ini Playwright ikut memungutnya.
  testIgnore: "**/*.dom.test.jsx",
  use: {
    baseURL: "http://127.0.0.1:5180",
    viewport: { width: 1440, height: 1100 },
  },
  reporter: "list",
});
