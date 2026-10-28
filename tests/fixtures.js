import { test as base, expect } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      if (!localStorage.getItem("otakqu-demo-session"))
        localStorage.setItem(
          "otakqu-demo-session",
          JSON.stringify({
            name: "Andi Fauzan",
            identifier: "demo@otakqu.test",
          }),
        );
    });
    await use(page);
  },
});
export { expect };
