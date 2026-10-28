import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("demo registration, login with arbitrary credentials, persistence and logout", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Masuk ke otakQU" }),
  ).toBeVisible();
  await page.screenshot({ path: "artifacts/auth-login.png", fullPage: true });
  await page.getByRole("button", { name: "Daftar sekarang" }).click();
  await page.screenshot({
    path: "artifacts/auth-register.png",
    fullPage: true,
  });
  await page.getByLabel("Nama lengkap").fill("Nadia Putri");
  await page.getByLabel("Email atau username").fill("nadia@example.test");
  await page.getByLabel("Sandi contoh").fill("demo-one");
  await page.getByRole("button", { name: "Buat akun & masuk" }).click();
  await expect(
    page.getByRole("heading", { name: /Hai, Nadia!/ }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: /Hai, Nadia!/ }),
  ).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Profile", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: /Nadia Putri/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Keluar dari akun" }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Masuk ke otakQU" }),
  ).toBeVisible();
  await page.getByLabel("Email atau username").fill("NADIA@example.test");
  await page.getByLabel("Sandi contoh").fill("totally-different");
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: /Hai, Nadia!/ }),
  ).toBeVisible();
  const saved = await page.evaluate(() => JSON.stringify(localStorage));
  expect(saved).not.toContain("demo-one");
  expect(saved).not.toContain("totally-different");
  expect(errors).toEqual([]);
});

test("login and registration fit a 320px screen and keyboard submission works", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  for (const register of [false, true]) {
    if (register)
      await page.getByRole("button", { name: "Daftar sekarang" }).click();
    expect(
      await page
        .locator(".auth-content")
        .evaluate((el) => el.scrollWidth > el.clientWidth),
    ).toBe(false);
    await expect(
      page.getByRole("button", {
        name: register ? "Buat akun & masuk" : "Masuk",
        exact: true,
      }),
    ).toBeVisible();
  }
  await page.getByRole("button", { name: "Masuk ke akun" }).click();
  await page.getByLabel("Email atau username").fill("another-user");
  await page.getByLabel("Sandi contoh").fill("x");
  await page.getByLabel("Sandi contoh").press("Enter");
  await expect(
    page.getByRole("heading", { name: /Hai, Another!/ }),
  ).toBeVisible();
});
